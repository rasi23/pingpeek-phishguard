from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from .models.detector import PhishingDetector
from .models.email_processor import EmailProcessor
from .models.threat_intel import ThreatIntelligence
from .schemas.emails import EmailAnalysisRequest, EmailAnalysisResponse, Rule
import os
from dotenv import load_dotenv
from typing import List, Dict
import uuid
import random
import logging

# Setup logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize components
detector = PhishingDetector()
email_processor = EmailProcessor(emails_dir="emails")  # Local files
threat_intel = ThreatIntelligence()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan handler for startup/shutdown events."""
    model_path = os.path.join(os.path.dirname(__file__), "../data/models/phishing_model.pkl")
    try:
        detector.load(model_path)
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        if os.getenv("ENV") == "development":
            logger.info("Using mock detector")
            detector.use_mock()
        else:
            raise
    
    yield
    
    try:
        email_processor.disconnect()
    except Exception as e:
        logger.error(f"Failed to disconnect email processor: {e}")

app = FastAPI(
    title="Phishing Detection API",
    description="AI-powered email phishing detection system",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-CSRF-Token"]
)

# Custom CSRF middleware
async def csrf_protect(request: Request, call_next):
    """Validate CSRF tokens for POST requests."""
    logger.debug(f"CSRF middleware: Checking {request.method} request to {request.url}")
    if request.method == "POST":
        client_token = request.headers.get("X-CSRF-Token")
        cookie_token = request.cookies.get("csrf_token")
        if not client_token or client_token != cookie_token:
            logger.warning("CSRF validation failed")
            raise HTTPException(status_code=403, detail="Invalid or missing CSRF token")
    response = await call_next(request)
    return response

app.middleware("http")(csrf_protect)

@app.get("/")
async def root():
    """Root endpoint with API information."""
    logger.info("Received request for /")
    return {
        "message": "Phishing Detection API",
        "endpoints": {
            "docs": "/docs",
            "analyze": "/analyze",
            "fetch-emails": "/fetch-emails",
            "health": "/health",
            "quarantine": "/quarantine/{email_id}",
            "csrf-token": "/csrf-token",
            "threat-time-series": "/threat-time-series",
            "attack-patterns": "/attack-patterns",
            "domain-analysis": "/domain-analysis"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    logger.info("Received request for /health")
    return {"status": "healthy"}

@app.get("/csrf-token")
async def get_csrf_token(response: Response):
    """Generate and set CSRF token in a cookie."""
    logger.info("Received GET request for /csrf-token")
    csrf_token = str(uuid.uuid4())
    response.set_cookie(
        key="csrf_token",
        value=csrf_token,
        httponly=True,
        samesite="lax",
        secure=False,
        path="/"
    )
    logger.info(f"Returning CSRF token: {csrf_token}")
    return {"token": csrf_token}

@app.post("/analyze", response_model=EmailAnalysisResponse)
async def analyze_email(request: EmailAnalysisRequest):
    """Analyze a raw email for phishing threats."""
    logger.info("Received POST request for /analyze")
    try:
        logger.debug(f"Parsing email: {request.raw_email[:100]}...")
        email_data = email_processor.parse_email(request.raw_email)
        logger.debug(f"Email parsed: {email_data}")
        ml_score = detector.predict(email_data)
        logger.debug(f"ML score: {ml_score}")
        threat_data = {}
        if email_data.get('urls'):
            logger.debug(f"Checking URLs: {email_data['urls']}")
            try:
                vt_results = await threat_intel.check_urls_virustotal([email_data['urls'][0]])
                threat_data['virustotal'] = vt_results.get(email_data['urls'][0], {
                    "malicious": 0,
                    "total": 0,
                    "scan_date": None
                })
            except Exception as e:
                logger.warning(f"VirusTotal check failed for {email_data['urls'][0]}: {e}")
                threat_data['virustotal'] = {"malicious": 0, "total": 0, "scan_date": None}
        triggered_rules_raw = detector.rule_based_analysis(email_data)
        logger.debug(f"Raw triggered rules: {triggered_rules_raw}")
        # Convert string rules to Rule objects
        triggered_rules = []
        for i, rule_name in enumerate(triggered_rules_raw):
            rule_map = {
                'suspicious_sender': {
                    'id': 'RULE001',
                    'name': 'Suspicious Sender',
                    'description': 'Sender address appears suspicious or unverified',
                    'severity': 'medium'
                },
                'spoofed_headers': {
                    'id': 'RULE002',
                    'name': 'Spoofed Headers',
                    'description': 'Email headers indicate potential spoofing',
                    'severity': 'high'
                },
            }
            rule_data = rule_map.get(rule_name, {
                'id': f'RULE{i+1:03d}',
                'name': rule_name,
                'description': f'Generic rule for {rule_name}',
                'severity': 'medium'
            })
            logger.debug(f"Mapping rule '{rule_name}' to {rule_data}")
            triggered_rules.append(Rule(**rule_data))
        verdict = "phishing" if ml_score > 0.7 else "suspicious" if ml_score > 0.4 else "legitimate"
        logger.debug(f"Verdict: {verdict}, Triggered rules: {triggered_rules}")
        
        response = EmailAnalysisResponse(
            verdict=verdict,
            confidence=float(ml_score),
            triggered_rules=triggered_rules,
            threat_data=threat_data,
            email_metadata={
                "subject": email_data.get('subject', ''),
                "from": email_data.get('headers', {}).get('From', ''),
                "date": email_data.get('headers', {}).get('Date', '')
            }
        )
        logger.debug(f"Analysis response: {response.model_dump()}")
        return response
    except Exception as e:
        logger.error(f"Email analysis failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Email analysis failed: {str(e)}")

@app.get("/fetch-emails")
async def fetch_emails(limit: int = 10):
    """Fetch and analyze recent emails from local files."""
    logger.info(f"Received GET request for /fetch-emails with limit={limit}")
    try:
        if limit < 1:
            raise HTTPException(status_code=422, detail="Limit must be a positive integer")
        logger.debug(f"Fetching {limit} emails from local directory")
        emails = email_processor.fetch_emails(limit)
        logger.debug(f"Fetched {len(emails)} emails")
        analyzed_emails = []
        
        for email in emails:
            analysis = await analyze_email(EmailAnalysisRequest(raw_email=email["raw"]))
            analyzed_emails.append({
                "id": email.get("id", str(uuid.uuid4())),
                "from": analysis.email_metadata.from_,  # Fixed
                "subject": analysis.email_metadata.subject,  # Fixed
                "date": analysis.email_metadata.date,  # Fixed
                "status": analysis.verdict,
                "content": email.get("raw", ""),
                "analysis": analysis.model_dump()
            })
        
        logger.info(f"Returning {len(analyzed_emails)} emails")
        return {"emails": analyzed_emails}
    except ValueError as e:
        logger.error(f"Invalid limit parameter: {e}")
        raise HTTPException(status_code=422, detail=f"Invalid limit parameter: {str(e)}")
    except Exception as e:
        logger.error(f"Failed to fetch emails: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to fetch emails: {str(e)}")

@app.post("/quarantine/{email_id}")
async def quarantine_email(email_id: str):
    """Quarantine an email by ID."""
    logger.info(f"Received POST request for /quarantine/{email_id}")
    try:
        success = email_processor.quarantine_email(email_id)
        if not success:
            logger.warning(f"Email {email_id} not found")
            raise HTTPException(status_code=404, detail=f"Email {email_id} not found")
        logger.info(f"Email {email_id} quarantined successfully")
        return {"message": f"Email {email_id} quarantined successfully"}
    except Exception as e:
        logger.error(f"Failed to quarantine email: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to quarantine email: {str(e)}")

@app.get("/threat-time-series")
async def get_threat_time_series():
    """Fetch time-series data for email threat trends."""
    logger.info("Received GET request for /threat-time-series")
    return [
        {
            "date": f"2025-05-{i:02d}",
            "phishing": random.randint(0, 10),
            "suspicious": random.randint(0, 7),
            "legitimate": random.randint(30, 80)
        } for i in range(8, 15)
    ]

@app.get("/attack-patterns")
async def get_attack_patterns():
    """Fetch common attack patterns."""
    logger.info("Received GET request for /attack-patterns")
    return [
        {"name": "Account Verification", "count": 18},
        {"name": "Payment Fraud", "count": 12},
        {"name": "Credential Harvest", "count": 24},
        {"name": "Malware Delivery", "count": 9},
        {"name": "CEO Fraud", "count": 6},
    ]

@app.get("/domain-analysis")
async def get_domain_analysis():
    """Fetch domain threat analysis."""
    logger.info("Received GET request for /domain-analysis")
    return [
        {"domain": "apple-verify.com", "count": 15, "threatLevel": 85},
        {"domain": "secure-paypal.co", "count": 12, "threatLevel": 90},
        {"domain": "microsoft-refresh.net", "count": 10, "threatLevel": 75},
        {"domain": "amazon-delivery.info", "count": 8, "threatLevel": 80},
        {"domain": "banking-secure.co", "count": 7, "threatLevel": 95},
    ]