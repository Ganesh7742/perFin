from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from database import connect_db, close_db
from routers import analyze, chat, auth, otp
from auth_utils import decode_access_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="PerFin AI - Personal Finance Copilot",
    description="AI-powered personal finance analyzer and advisor backed by MongoDB",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for Vercel deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(analyze.router, prefix="/api", tags=["Analysis"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(otp.router, prefix="/api/otp", tags=["OTP"])


@app.get("/")
def root():
    return {"message": "PerFin AI Backend Running ✅", "docs": "/docs"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
