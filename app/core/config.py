"""
Application configuration settings.
Loads environment variables and defines app-wide constants.
"""

import os
from pathlib import Path

# Base directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Database
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/portfolio.db")
DATABASE_PATH = os.getenv("DATABASE_PATH", str(BASE_DIR / "portfolio.db"))

# Application
APP_TITLE = "AI Developer Portfolio API"
APP_VERSION = "1.0.0"
APP_DESCRIPTION = "Backend API for personal AI developer portfolio with chatbot"

# CORS - allowed origins for frontend
ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:3000",
]

# Add Render production URL if set
_RENDER_URL = os.getenv("RENDER_EXTERNAL_URL")
if _RENDER_URL:
    ALLOWED_ORIGINS.append(_RENDER_URL)
