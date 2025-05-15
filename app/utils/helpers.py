import hashlib
import re
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import pytz

class EmailHelpers:
    @staticmethod
    def generate_email_fingerprint(email_data: Dict[str, Any]) -> str:
        """
        Generate a unique fingerprint for an email based on its content
        
        Args:
            email_data: Dictionary containing email components
            
        Returns:
            SHA256 hash string representing the email fingerprint
        """
        fingerprint_str = (
            f"{email_data.get('headers', {}).get('From', '')}"
            f"{email_data.get('subject', '')}"
            f"{email_data.get('body', '')}"
        )
        return hashlib.sha256(fingerprint_str.encode()).hexdigest()
    
    @staticmethod
    def is_recent_email(email_data: Dict[str, Any], hours: int = 24) -> bool:
        """
        Check if email was received within the specified time window
        
        Args:
            email_data: Dictionary containing email components
            hours: Time window in hours to consider as "recent"
            
        Returns:
            bool: True if email is within the time window
        """
        date_str = email_data.get("headers", {}).get("Date")
        if not date_str:
            return False
        
        try:
            # Try to parse various date formats
            email_date = None
            date_formats = [
                "%a, %d %b %Y %H:%M:%S %z",
                "%d %b %Y %H:%M:%S %z",
                "%a, %d %b %Y %H:%M:%S %Z"
            ]
            
            for fmt in date_formats:
                try:
                    email_date = datetime.strptime(date_str, fmt)
                    break
                except ValueError:
                    continue
            
            if not email_date:
                return False
            
            # Convert to UTC if not already
            if email_date.tzinfo is None:
                email_date = pytz.utc.localize(email_date)
            else:
                email_date = email_date.astimezone(pytz.UTC)
            
            time_diff = datetime.now(pytz.UTC) - email_date
            return time_diff < timedelta(hours=hours)
        except:
            return False
    
    @staticmethod
    def extract_display_name(email_header: str) -> Optional[str]:
        """
        Extract display name from email header if present
        
        Args:
            email_header: Full email header string (e.g., "John Doe <john@example.com>")
            
        Returns:
            Extracted display name or None if not found
        """
        match = re.match(r'^"?([^"<]+)"?\s*<', email_header)
        return match.group(1).strip() if match else None
    
    @staticmethod
    def clean_email_text(text: str) -> str:
        """
        Clean email text by removing noise and normalizing
        
        Args:
            text: Raw email text
            
        Returns:
            Cleaned and normalized text
        """
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', ' ', text)
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove email signatures
        text = re.sub(r'(?i)(--\s*)?(regards|thanks|sincerely),?.*$', '', text)
        return text.strip()