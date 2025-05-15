# test_imap.py
from imapclient import IMAPClient
import ssl
import traceback
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

server = os.getenv("IMAP_SERVER", "imap-mail.outlook.com")
port = int(os.getenv("IMAP_PORT", 993))
username = os.getenv("IMAP_USER", "jayasundera45@outlook.com")
password = os.getenv("EMAIL_PASSWORD")

if not password:
    print("Error: EMAIL_PASSWORD not set in .env")
    exit(1)

print(f"Testing IMAP login for {username} on {server}:{port}")

try:
    context = ssl.create_default_context()
    with IMAPClient(host=server, port=port, ssl=True, ssl_context=context) as client:
        print("Connecting...")
        client.login(username, password)
        print("Login successful")
        client.select_folder("INBOX")
        print("Selected INBOX")
        messages = client.search(["ALL"])
        print(f"Found {len(messages)} messages in INBOX")
except Exception as e:
    print(f"Login failed: {str(e)}")
    print("Full traceback:")
    traceback.print_exc()