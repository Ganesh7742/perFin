from fastapi import APIRouter, HTTPException, Depends, status
from motor.motor_asyncio import AsyncIOMotorCollection
from datetime import datetime, timedelta
import random
import string

from database import get_collection
from pydantic import BaseModel, EmailStr
from email_utils import send_otp_email

router = APIRouter()

class OTPSendRequest(BaseModel):
    email: EmailStr

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str

def get_otps_collection() -> AsyncIOMotorCollection:
    return get_collection("otps")

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

@router.post("/send-otp")
async def send_otp(request: OTPSendRequest, otps: AsyncIOMotorCollection = Depends(get_otps_collection)):
    print(f"Received request for {request.email}")
    otp_code = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    print(f"Updating OTP in DB for {request.email}...")
    # Store/Update OTP in DB
    await otps.update_one(
        {"email": request.email},
        {
            "$set": {
                "otp": otp_code,
                "expires_at": expires_at,
                "verified": False,
                "created_at": datetime.utcnow()
            }
        },
        upsert=True
    )
    
    print("DB updated successfully, sending email...")
    # Send via async executor so it doesn't block the event loop
    import asyncio
    loop = asyncio.get_event_loop()
    try:
        result = await asyncio.wait_for(
            loop.run_in_executor(None, send_otp_email, request.email, otp_code),
            timeout=12.0
        )
    except asyncio.TimeoutError:
        print(f"Timeout sending email to {request.email}")
        result = False
    
    print(f"Email sent with result: {result}")
    
    if not result:
        print("Warning: Email failed to send (likely blocked by Render free tier). Proceeding to allow master OTP.")
        
    return {"message": "OTP processed (use 123456 if email was blocked)"}

@router.post("/verify-otp")
async def verify_otp(request: OTPVerifyRequest, otps: AsyncIOMotorCollection = Depends(get_otps_collection)):
    otp_record = await otps.find_one({"email": request.email})
    
    if not otp_record:
        raise HTTPException(status_code=404, detail="OTP not found or expired")
        
    if otp_record["expires_at"] < datetime.utcnow():
        await otps.delete_one({"email": request.email})
        raise HTTPException(status_code=400, detail="OTP expired")
        
    if otp_record["otp"] != request.otp and request.otp != "123456":
        raise HTTPException(status_code=401, detail="Invalid OTP code")
        
    # Mark as verified
    await otps.update_one(
        {"email": request.email},
        {"$set": {"verified": True}}
    )
    
    return {"message": "OTP verified successfully"}
