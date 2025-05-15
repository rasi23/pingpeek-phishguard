import pytest
from email.message import Message
from app.models.email_processor import EmailProcessor

@pytest.fixture
def raw_email_message():
    msg = Message()
    msg["From"] = "test@example.com"
    msg["Subject"] = "Test email"
    msg["Date"] = "Wed, 01 Jan 2020 12:00:00 +0000"
    msg.set_payload("This is a test email body")
    return msg

@pytest.fixture
def multipart_email_message():
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText
    
    msg = MIMEMultipart()
    msg["From"] = "multipart@example.com"
    msg["Subject"] = "Multipart test"
    msg.attach(MIMEText("Plain text part", "plain"))
    msg.attach(MIMEText("<html><body>HTML part</body></html>", "html"))
    return msg

def test_email_parsing(raw_email_message):
    processor = EmailProcessor("imap.example.com", "user", "pass")
    parsed = processor._parse_email(raw_email_message)
    
    assert parsed["subject"] == "Test email"
    assert parsed["body"] == "This is a test email body"
    assert parsed["headers"]["From"] == "test@example.com"

def test_multipart_parsing(multipart_email_message):
    processor = EmailProcessor("imap.example.com", "user", "pass")
    parsed = processor._parse_email(multipart_email_message)
    
    assert "Plain text part" in parsed["body"]
    assert parsed["headers"]["From"] == "multipart@example.com"

def test_url_extraction():
    processor = EmailProcessor("imap.example.com", "user", "pass")
    text = "Visit http://example.com and https://test.org"
    urls = processor._extract_urls(text)
    
    assert "http://example.com" in urls
    assert "https://test.org" in urls
    assert len(urls) == 2