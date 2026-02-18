"""
Contact route - handles contact form submissions.
Validates input and stores messages in SQLite.
"""

from fastapi import APIRouter, HTTPException
from app.models.schemas import ContactRequest, ContactResponse
from app.database.connection import get_db

router = APIRouter(prefix="/api", tags=["Contact"])


@router.post("/contact", response_model=ContactResponse)
async def submit_contact(request: ContactRequest):
    """
    Submit a contact form message.
    Stores the message in the database for later review.
    """
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO contact_messages (name, email, subject, message)
            VALUES (?, ?, ?, ?)""",
            (request.name, request.email, request.subject, request.message)
        )

    return ContactResponse(
        success=True,
        message="Thank you for your message! I'll get back to you soon."
    )
