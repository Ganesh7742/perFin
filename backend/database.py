import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "perfin")

client: AsyncIOMotorClient = None


async def connect_db():
    global client
    client = AsyncIOMotorClient(MONGO_URI)
    print(f"✅ Connected to MongoDB: {MONGO_URI} | DB: {MONGO_DB}")


async def close_db():
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed.")


def get_database():
    return client[MONGO_DB]


def get_collection(collection_name: str):
    return client[MONGO_DB][collection_name]
