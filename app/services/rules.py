from typing import Dict, List, Any
import re
import tldextract
from datetime import datetime

class RuleEngine:
    def __init__(self):
        self.rules = self._load_rules()
    
    def _load_rules(self) -> List[Dict[str, Any]]:
        """Initialize all detection rules"""
        return [
            {
                "name": "suspicious_sender_domain",
                "description": "Sender domain is not from trusted sources",
                "function": self._check_sender_domain,
                "weight": 0.3
            },
            {
                "name": "urgent_language",
                "description": "Email contains urgent or threatening language",
                "function": self._check_urgent_language,
                "weight": 0.2
            },
            {
                "name": "suspicious_urls",
                "description": "Email contains suspicious URLs",
                "function": self._check_suspicious_urls,
                "weight": 0.4
            },
            {
                "name": "unusual_attachments",
                "description": "Email contains unusual attachment types",
                "function": self._check_unusual_attachments,
                "weight": 0.3
            }
        ]
    
    def apply_rules(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Apply all rules to email data and return results
        
        Args:
            email_data: Dictionary containing email components
            
        Returns:
            Dictionary with rule results and total score
        """
        results = {}
        total_score = 0.0
        
        for rule in self.rules:
            rule_result = rule["function"](email_data)
            results[rule["name"]] = {
                "triggered": rule_result["triggered"],
                "details": rule_result["details"],
                "weight": rule["weight"],
                "score": rule_result["triggered"] * rule["weight"]
            }
            total_score += results[rule["name"]]["score"]
        
        return {
            "rule_results": results,
            "total_score": min(total_score, 1.0)  # Cap at 1.0
        }
    
    def _check_sender_domain(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check if sender domain is suspicious"""
        from_address = email_data.get("headers", {}).get("From", "")
        domains = re.findall(r"@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})", from_address)
        
        if not domains:
            return {"triggered": False, "details": "No domain found"}
        
        domain = domains[0]
        suspicious_tlds = ["xyz", "top", "gq", "ml", "cf", "tk"]
        extracted = tldextract.extract(domain)
        
        details = {
            "domain": domain,
            "tld": extracted.suffix,
            "is_suspicious_tld": extracted.suffix in suspicious_tlds
        }
        
        triggered = (extracted.suffix in suspicious_tlds or 
                    len(extracted.domain) < 3 or 
                    any(char.isdigit() for char in extracted.domain))
        
        return {"triggered": triggered, "details": details}
    
    def _check_urgent_language(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check for urgent or threatening language"""
        text = (email_data.get("subject", "") + " " + 
               email_data.get("body", "")).lower()
        
        urgent_phrases = [
            "urgent action required",
            "your account will be closed",
            "immediate attention",
            "verify your account",
            "password expiration",
            "click below"
        ]
        
        found_phrases = [phrase for phrase in urgent_phrases if phrase in text]
        
        return {
            "triggered": len(found_phrases) > 0,
            "details": {
                "found_phrases": found_phrases,
                "total_matches": len(found_phrases)
            }
        }
    
    def _check_suspicious_urls(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check for suspicious URL patterns"""
        urls = email_data.get("urls", [])
        suspicious_domains = []
        url_shorteners = ["bit.ly", "goo.gl", "tinyurl.com", "ow.ly"]
        
        for url in urls:
            extracted = tldextract.extract(url)
            domain = f"{extracted.domain}.{extracted.suffix}"
            
            if (extracted.suffix in ["xyz", "top"] or 
                extracted.domain.startswith(("login-", "verify-")) or
                domain in url_shorteners):
                suspicious_domains.append(domain)
        
        return {
            "triggered": len(suspicious_domains) > 0,
            "details": {
                "suspicious_domains": suspicious_domains,
                "total_urls": len(urls),
                "suspicious_urls": len(suspicious_domains)
            }
        }
    
    def _check_unusual_attachments(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check for unusual attachment types"""
        attachments = email_data.get("attachments", [])
        risky_types = [
            "application/vnd.ms-excel",
            "application/vnd.ms-powerpoint",
            "application/x-msdownload",
            "application/x-sh",
            "application/x-bat"
        ]
        
        risky_attachments = [
            att for att in attachments 
            if att.get("content_type", "") in risky_types or
            any(att.get("filename", "").endswith(ext) 
            for ext in [".exe", ".bat", ".sh