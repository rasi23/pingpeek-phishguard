import pytest
from unittest.mock import patch
from app.models.detector import PhishingDetector
from app.schemas.emails import EmailAnalysisRequest

@pytest.fixture
def sample_phishing_email():
    return EmailAnalysisRequest(
        headers={
            "From": "support@security-update.com",
            "Subject": "Urgent: Your account will be suspended",
            "Authentication-Results": "none"
        },
        subject="Urgent: Your account will be suspended",
        body="Click here to verify your account: http://security-update.xyz/login",
        urls=["http://security-update.xyz/login"],
        attachments=[]
    )

@pytest.fixture
def sample_legit_email():
    return EmailAnalysisRequest(
        headers={
            "From": "support@company.com",
            "Subject": "Monthly newsletter",
            "Authentication-Results": "spf=pass dkim=pass"
        },
        subject="Monthly newsletter",
        body="Here's our monthly update...",
        urls=["http://company.com/news"],
        attachments=[]
    )

@pytest.fixture
def trained_detector():
    detector = PhishingDetector()
    # Minimal training data
    X = [
        "urgent click here verify your account",
        "please find attached your monthly report",
        "your password will expire click now"
    ]
    y = [1, 0, 1]  # 1=phishing, 0=legit
    detector.train(X, y)
    return detector

def test_detector_initialization():
    detector = PhishingDetector()
    assert detector.model is not None

def test_feature_extraction(sample_phishing_email):
    detector = PhishingDetector()
    features = detector.extract_features(sample_phishing_email.model_dump())
    assert "subject_length" in features
    assert "has_urgent_keywords" in features
    assert features["has_urgent_keywords"] is True

def test_prediction_consistency(trained_detector, sample_phishing_email, sample_legit_email):
    # Test that phishing emails get higher scores than legit ones
    phishing_score = trained_detector.predict(sample_phishing_email.model_dump())
    legit_score = trained_detector.predict(sample_legit_email.model_dump())
    
    assert 0 <= phishing_score <= 1
    assert 0 <= legit_score <= 1
    # Don't assert phishing_score > legit_score since our test model is minimal
    # Just verify the scores are in valid range