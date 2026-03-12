import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")

def send_otp_email(to_email: str, otp: str):
    try:
        if not SMTP_USER or not SMTP_PASS:
            print("Missing SMTP credentials")
            return None

        # Format html email string
        html_content = f"""
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
            <h2 style="color: #6366f1;">PerFin AI</h2>
            <p>Hello,</p>
            <p>To continue with your account creation, please use the following verification code:</p>
            <div style="font-size: 32px; font-weight: bold; color: #6366f1; padding: 10px; background: #f1f5f9; border-radius: 5px; text-align: center; letter-spacing: 5px;">
                {otp}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #94a3b8;">© 2026 PerFin AI.</p>
        </div>
        """

        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Your PerFin AI Verification Code"
        msg["From"] = SMTP_USER
        msg["To"] = to_email

        html_part = MIMEText(html_content, "html")
        msg.attach(html_part)

        import time
        start = time.time()
        print(f"Connecting to SMTP {SMTP_HOST}:{SMTP_PORT}...")
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10)
        print(f"Connected in {time.time() - start:.2f}s. Starting TLS...")
        
        tls_start = time.time()
        server.starttls()
        print(f"TLS started in {time.time() - tls_start:.2f}s. Logging in...")
        
        login_start = time.time()
        server.login(SMTP_USER, SMTP_PASS)
        print(f"Logged in in {time.time() - login_start:.2f}s. Sending mail...")
        
        send_start = time.time()
        server.sendmail(SMTP_USER, to_email, msg.as_string())
        print(f"Mail sent in {time.time() - send_start:.2f}s. Quitting...")
        
        quit_start = time.time()
        server.quit()
        print(f"SMTP quit in {time.time() - quit_start:.2f}s. Total: {time.time() - start:.2f}s")
        
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return None
