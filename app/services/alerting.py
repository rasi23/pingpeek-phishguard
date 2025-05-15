import smtplib
from email.mime.text import MIMEText
from typing import List, Optional
from fastapi import HTTPException
import os

class AlertService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", 587))
        self.sender_email = os.getenv("ALERT_SENDER_EMAIL")
        self.sender_password = os.getenv("ALERT_SENDER_PASSWORD")
    
    def send_alert(
        self,
        recipients: List[str],
        subject: str,
        message: str,
        priority: str = "medium"
    ) -> bool:
        """
        Send email alert to specified recipients
        
        Args:
            recipients: List of email addresses to notify
            subject: Email subject
            message: Email body content
            priority: Alert priority (low/medium/high)
            
        Returns:
            bool: True if alert was sent successfully
        """
        if not self.sender_email or not self.sender_password:
            raise HTTPException(
                status_code=500,
                detail="Alert service not configured properly"
            )
        
        try:
            msg = MIMEText(message)
            msg["Subject"] = f"[{priority.upper()}] {subject}"
            msg["From"] = self.sender_email
            msg["To"] = ", ".join(recipients)
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.sendmail(self.sender_email, recipients, msg.as_string())
            
            return True
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to send alert: {str(e)}"
            )
    
    def send_phishing_alert(
        self,
        recipients: List[str],
        email_data: dict,
        detection_result: dict
    ) -> bool:
        """
        Send specialized phishing alert with analysis details
        
        Args:
            recipients: List of email addresses to notify
            email_data: Original email data
            detection_result: Analysis results from detector
            
        Returns:
            bool: True if alert was sent successfully
        """
        subject = f"Phishing Alert: {email_data.get('subject', 'No Subject')}"
        
        message = f"""
        Phishing email detected and quarantined:
        
        From: {email_data.get('from', 'Unknown')}
        Subject: {email_data.get('subject', 'No Subject')}
        Detection Score: {detection_result.get('score', 0):.2f}
        Verdict: {detection_result.get('verdict', 'unknown').upper()}
        
        === Threat Details ===
        URLs Found: {len(email_data.get('urls', []))}
        Attachments: {len(email_data.get('attachments', []))}
        
        === Recommended Actions ===
        1. Do not interact with this email
        2. Report to your security team
        3. Check for similar emails in your inbox
        """
        
        priority = "high" if detection_result.get("verdict") == "phishing" else "medium"
        return self.send_alert(recipients, subject, message, priority)