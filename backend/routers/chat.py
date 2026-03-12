from fastapi import APIRouter
from schemas import ChatMessage
from ai_advisor import get_chat_response
from database import get_collection
from models import build_chat_document

router = APIRouter()


@router.post("/chat")
async def chat_with_advisor(payload: ChatMessage):
    response = await get_chat_response(payload.message, payload.profile)

    # Save chat to MongoDB
    chat_col = get_collection("chat_history")
    chat_doc = build_chat_document(
        user_id=payload.profile.name,  # Use name as session key for demo
        user_message=payload.message,
        ai_response=response,
    )
    await chat_col.insert_one(chat_doc)

    return {"response": response}
