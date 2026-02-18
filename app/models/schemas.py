"""
Pydantic models for request/response validation.
Ensures type safety and automatic API documentation.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# ─── Chat Models ────────────────────────────────────────────────

class ChatRequest(BaseModel):
    """Incoming chat message from the user."""
    message: str = Field(..., min_length=1, max_length=500, description="User's chat message")


class ChatResponse(BaseModel):
    """Bot's response to a chat message."""
    response: str
    category: str = "general"
    timestamp: Optional[str] = None


# ─── Contact Models ─────────────────────────────────────────────

class ContactRequest(BaseModel):
    """Contact form submission."""
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=200)
    subject: Optional[str] = Field(None, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)


class ContactResponse(BaseModel):
    """Response after contact form submission."""
    success: bool
    message: str


# ─── Project Models ──────────────────────────────────────────────

class ProjectOut(BaseModel):
    """Project data for API responses."""
    id: int
    title: str
    description: str
    features: List[str]
    tech_stack: List[str]
    architecture: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None


# ─── General Models ──────────────────────────────────────────────

class HealthCheck(BaseModel):
    """API health check response."""
    status: str = "healthy"
    version: str
    message: str
