"""
Chat route - handles the chatbot API endpoint.
Processes user messages, finds matching responses, and logs conversations.
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime

from app.models.schemas import ChatRequest, ChatResponse
from app.database.connection import get_db

router = APIRouter(prefix="/api", tags=["Chatbot"])


def find_best_response(message: str) -> tuple[str, str]:
    """
    Match user message against stored keywords.
    Returns (response_text, category) tuple.
    Uses keyword matching with priority scoring.
    """
    message_lower = message.lower().strip()
    tokens = set(message_lower.split())

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT keyword, response, category FROM chatbot_responses")
        rows = cursor.fetchall()

    best_match = None
    best_score = 0

    for row in rows:
        keyword = row["keyword"].lower()
        # Exact match gets highest priority
        if keyword in message_lower:
            score = len(keyword) + (10 if keyword in tokens else 5)
            if score > best_score:
                best_score = score
                best_match = row

    if best_match:
        return best_match["response"], best_match["category"]

    # Default fallback response
    return (
        "I'm not sure about that, but feel free to ask about my skills, "
        "projects, experience, or contact info! Type 'help' to see what I can answer.",
        "general"
    )


def log_conversation(user_message: str, bot_response: str):
    """Save the chat exchange to history for analytics."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO chat_history (user_message, bot_response) VALUES (?, ?)",
            (user_message, bot_response)
        )


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint - send a message and get an AI-powered response.
    The chatbot matches keywords from the message against stored responses.
    """
    response_text, category = find_best_response(request.message)

    # Log the conversation
    log_conversation(request.message, response_text)

    return ChatResponse(
        response=response_text,
        category=category,
        timestamp=datetime.now().isoformat()
    )
