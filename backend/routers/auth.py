from fastapi import APIRouter, HTTPException, Depends, status
from motor.motor_asyncio import AsyncIOMotorCollection
from datetime import datetime
import uuid

from database import get_collection
from schemas import UserCreate, UserLogin, UserResponse, Token
from auth_utils import hash_password, verify_password, create_access_token

router = APIRouter()

def get_users_collection() -> AsyncIOMotorCollection:
    return get_collection("users")

def get_otps_collection() -> AsyncIOMotorCollection:
    return get_collection("otps")

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, users: AsyncIOMotorCollection = Depends(get_users_collection), otps: AsyncIOMotorCollection = Depends(get_otps_collection)):
    # Check if OTP is verified
    otp_record = await otps.find_one({"email": user_data.email, "verified": True})
    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified via OTP"
        )
    
    # Check if user already exists
    existing_user = await users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    import asyncio
    
    # Hash password asynchronously
    loop = asyncio.get_event_loop()
    hashed_pwd = await loop.run_in_executor(
        None, hash_password, user_data.password
    )
    user_id = str(uuid.uuid4())
    new_user = {
        "_id": user_id,
        "email": user_data.email,
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow()
    }
    
    await users.insert_one(new_user)
    
    return {
        "id": user_id,
        "email": user_data.email,
        "created_at": new_user["created_at"]
    }

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, users: AsyncIOMotorCollection = Depends(get_users_collection)):
    # Find user by email
    user = await users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    import asyncio
    
    # Verify password asynchronously to avoid blocking event loop
    loop = asyncio.get_event_loop()
    is_valid = await loop.run_in_executor(
        None, verify_password, credentials.password, user["password_hash"]
    )
    
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user["email"], "id": user["_id"]})
    
    return {"access_token": access_token, "token_type": "bearer"}
