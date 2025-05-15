import joblib
import re
from typing import Dict, Any, List
import logging

logger = logging.getLogger(__name__)

class PhishingDetector:
    def __init__(self):
        self.model = None
    
    def predict(self, email_data: Dict[str, Any]) -> float:
        try:
            if self.model is None:
                raise ValueError("Model not loaded")
            text = self._prepare_text_for_prediction(email_data)
            score = float(self.model.predict_proba([text])[0][1])
            return score
        except Exception as e:
            logger.error(f"Predict failed: {e}")
            return 0.0
    
    def _prepare_text_for_prediction(self, email_data: Dict[str, Any]) -> str:
        text = f"{email_data.get('subject', '')} {email_data.get('content', '')}"
        features = {
            'text': text,
            'subject_length': len(email_data.get('subject', '')),
            'num_urls': len(email_data.get('urls', [])),
            'has_urgent': int('urgent' in text.lower())
        }
        return str(features)
    
    def rule_based_analysis(self, email_data: Dict[str, Any]) -> List[str]:
        rules = {
            'suspicious_sender': self._is_suspicious_sender(email_data),
            'shortened_url': any(url in email_data.get('content', '') 
                                for url in ['bit.ly', 'goo.gl', 'tinyurl.com']),
            'mismatch_links': len(set(re.findall(
                r'href=["\'](http[^"\']+)', 
                email_data.get('content', '')))) > 1,
            'generic_greeting': bool(re.search(
                r'Dear (Customer|User|Valued Member)', 
                email_data.get('content', ''), re.I)),
            'spoofed_headers': self._has_spoofed_headers(email_data)
        }
        return [rule for rule, triggered in rules.items() if triggered]
    
    def _is_suspicious_sender(self, email_data: Dict[str, Any]) -> bool:
        sender = email_data.get('headers', {}).get('From', '').lower()
        trusted_domains = ('@company.com', '@gmail.com', '@outlook.com')
        return bool(sender and not any(sender.endswith(domain) for domain in trusted_domains))
    
    def _has_spoofed_headers(self, email_data: Dict[str, Any]) -> bool:
        headers = email_data.get('headers', {})
        from_addr = headers.get('From', '')
        reply_to = headers.get('Reply-To', None)
        return bool(reply_to and from_addr and from_addr != reply_to)
    
    def load(self, path: str):
        try:
            self.model = joblib.load(path)
            logger.info(f"Loaded model from {path}")
        except Exception as e:
            logger.error(f"Model load failed: {e}")
            raise