import os
import email
from email import policy
import uuid
import logging
from typing import List, Dict, Any
from pathlib import Path

logger = logging.getLogger(__name__)

class EmailProcessor:
    def __init__(self, emails_dir: str):
        self.emails_dir = Path(__file__).parent.parent.parent / emails_dir
        self.emails_dir.mkdir(exist_ok=True)
        logger.info(f"EmailProcessor initialized with dir: {self.emails_dir}")

    def parse_email(self, raw_email: str) -> Dict[str, Any]:
        try:
            msg = email.message_from_string(raw_email, policy=policy.default)
            headers = dict(msg.items())
            content = ""
            urls = []

            if msg.is_multipart():
                for part in msg.walk():
                    if part.get_content_type() == 'text/plain':
                        try:
                            content += part.get_payload(decode=True).decode()
                        except:
                            content += part.get_payload()
            else:
                try:
                    content = msg.get_payload(decode=True).decode()
                except:
                    content = msg.get_payload()

            for line in content.splitlines():
                words = line.split()
                for word in words:
                    if word.startswith(('http://', 'https://')):
                        urls.append(word.strip('.,:;!?'))

            return {
                "subject": headers.get('Subject', ''),
                "headers": headers,
                "content": content,
                "urls": urls
            }
        except Exception as e:
            logger.error(f"Failed to parse email: {e}")
            raise

    def fetch_emails(self, limit: int = 10) -> List[Dict[str, Any]]:
        try:
            emails = []
            for email_file in sorted(self.emails_dir.glob("*.eml"))[:limit]:
                try:
                    with open(email_file, 'r', encoding='utf-8') as f:
                        raw_email = f.read()
                    email_data = self.parse_email(raw_email)
                    emails.append({
                        "id": str(uuid.uuid4()),
                        "raw": raw_email,
                        **email_data
                    })
                except Exception as e:
                    logger.warning(f"Failed to process {email_file}: {e}")
                    continue
            logger.info(f"Fetched {len(emails)} emails")
            return emails
        except Exception as e:
            logger.error(f"Failed to fetch emails: {e}")
            raise

    def quarantine_email(self, email_id: str) -> bool:
        logger.info(f"Mock quarantining email {email_id}")
        return True

    def disconnect(self):
        logger.info("Disconnecting EmailProcessor")