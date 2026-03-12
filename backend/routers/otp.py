from fastapi import APIRouter, HTTPException, Depends, status, BackgroundTasks
from motor.motor_asyncio import AsyncIOMotorCollection
from datetime import datetime, timedelta
import random
import string
import time

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

def send_email_background(email: str, otp: str):
    """Runs in background thread - sends OTP email with detailed timing."""
    start = time.time()
    print(f"[BG] Starting email send to {email}...")
    result = send_otp_email(email, otp)
    duration = time.time() - start
    if result:
        print(f"[BG] Email sent to {email} in {duration:.2f}s")
    else:
        print(f"[BG] Email failed for {email} after {duration:.2f}s. Master OTP 123456 still works.")

@router.post("/send-otp")
async def send_otp(
    request: OTPSendRequest,
    background_tasks: BackgroundTasks,
    otps: AsyncIOMotorCollection = Depends(get_otps_collection)
):
    print(f"Received request for {request.email}")
    otp_code = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    print(f"Updating OTP in DB for {request.email}...")
    # Store/Update OTP in DB first so it's available immediately
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
    
    # Fire email in background - API returns instantly, email sends asynchronously
    background_tasks.add_task(send_email_background, request.email, otp_code)
    print(f"DB updated. Email queued as background task for {request.email}. Returning response now.")
    
    return {"message": "OTP sent. Check your email (use 123456 if email was blocked)."}

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
