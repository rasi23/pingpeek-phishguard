from typing import Dict, Any
import re
import tldextract
import whois
from datetime import datetime
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk

nltk.download('vader_lexicon')

class FeatureExtractor:
    def __init__(self):
        self.sia = SentimentIntensityAnalyzer()
        self.url_pattern = re.compile(
            r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
        )
    
    def extract_all_features(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract all features from email data"""
        features = {}
        
        # Header features
        features.update(self._extract_header_features(email_data.get("headers", {})))
        
        # Content features
        features.update(self._extract_content_features(
            email_data.get("subject", ""),
            email_data.get("body", "")
        ))
        
        # URL features
        features.update(self._extract_url_features(email_data.get("urls", [])))
        
        # Attachment features
        features.update(self._extract_attachment_features(
            email_data.get("attachments", [])
        ))
        
        return features
    
    def _extract_header_features(self, headers: Dict[str, str]) -> Dict[str, Any]:
        """Extract features from email headers"""
        features = {}
        
        # Authentication results
        auth_results = headers.get("Authentication-Results", "")
        features["spf_pass"] = "spf=pass" in auth_results.lower()
        features["dkim_pass"] = "dkim=pass" in auth_results.lower()
        features["dmarc_pass"] = "dmarc=pass" in auth_results.lower()
        
        # Sender analysis
        from_header = headers.get("From", "")
        features["sender_has_display_name"] = "<" in from_header and ">" in from_header
        features["reply_to_differs"] = (
            "Reply-To" in headers and 
            headers["Reply-To"].lower() != from_header.lower()
        )
        
        return features
    
    def _extract_content_features(self, subject: str, body: str) -> Dict[str, Any]:
        """Extract features from email content"""
        features = {}
        text = f"{subject} {body}"
        
        # Basic metrics
        features["subject_length"] = len(subject)
        features["body_length"] = len(body)
        features["word_count"] = len(text.split())
        
        # Urgency indicators
        urgent_keywords = ["urgent", "immediate", "action required", "verify now"]
        features["has_urgent_keywords"] = any(
            keyword in text.lower() for keyword in urgent_keywords
        )
        
        # Sentiment analysis
        sentiment = self.sia.polarity_scores(text)
        features["sentiment_neg"] = sentiment["neg"]
        features["sentiment_pos"] = sentiment["pos"]
        features["sentiment_compound"] = sentiment["compound"]
        
        # HTML content indicators
        features["has_html"] = "<html" in body.lower() or "<body" in body.lower()
        
        return features
    
    def _extract_url_features(self, urls: List[str]) -> Dict[str, Any]:
        """Extract features from URLs in email"""
        features = {
            "num_urls": len(urls),
            "has_shortened_urls": False,
            "has_suspicious_tlds": False,
            "avg_domain_age": 0.0
        }
        
        if not urls:
            return features
        
        domain_ages = []
        suspicious_tlds = ["xyz", "top", "gq", "ml", "cf", "tk"]
        url_shorteners = ["bit.ly", "goo.gl", "tinyurl.com"]
        
        for url in urls:
            extracted = tldextract.extract(url)
            domain = f"{extracted.domain}.{extracted.suffix}"
            
            # Check for URL shorteners
            if domain in url_shorteners:
                features["has_shortened_urls"] = True
            
            # Check for suspicious TLDs
            if extracted.suffix in suspicious_tlds:
                features["has_suspicious_tlds"] = True
            
            # Get domain age
            try:
                domain_info = whois.whois(domain)
                if domain_info.creation_date:
                    if isinstance(domain_info.creation_date, list):
                        creation_date = domain_info.creation_date[0]
                    else:
                        creation_date = domain_info.creation_date
                    
                    if creation_date:
                        age = (datetime.now() - creation_date).days
                        domain_ages.append(age)
            except:
                continue
        
        if domain_ages:
            features["avg_domain_age"] = sum(domain_ages) / len(domain_ages)
        
        return features
    
    def _extract_attachment_features(self, attachments: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Extract features from email attachments"""
        features = {
            "num_attachments": len(attachments),
            "has_executable": False,
            "has_archive": False,
            "has_document": False
        }
        
        risky_extensions = [".exe", ".bat", ".sh", ".js", ".jar"]
        archive_extensions = [".zip", ".rar", ".7z"]
        document_extensions = [".pdf", ".doc", ".docx", ".xls"]
        
        for att in attachments:
            filename = att.get("filename", "").lower()
            
            if any(filename.endswith(ext) for ext in risky_extensions):
                features["has_executable"] = True
            
            if any(filename.endswith(ext) for ext in archive_extensions):
                features["has_archive"] = True
            
            if any(filename.endswith(ext) for ext in document_extensions):
                features["has_document"] = True
        
        return features