"""
Main application entry point.
Configures FastAPI, registers routes, mounts static files, and initializes the database.
"""

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import APP_TITLE, APP_VERSION, APP_DESCRIPTION, ALLOWED_ORIGINS
from app.database.schema import init_db
from app.routes import chat, contact, projects


# ─── Lifespan: runs on startup/shutdown ──────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    init_db()
    print("Database initialized and seeded.")
    yield
    print("Application shutting down.")


# ─── App Instance ────────────────────────────────────────────────

app = FastAPI(
    title=APP_TITLE,
    version=APP_VERSION,
    description=APP_DESCRIPTION,
    lifespan=lifespan,
)

# ─── CORS Middleware ─────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Mount Static Files & Templates ─────────────────────────────

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# ─── Register API Routes ────────────────────────────────────────

app.include_router(chat.router)
app.include_router(contact.router)
app.include_router(projects.router)


# ─── Root: Serve Portfolio Page ──────────────────────────────────

@app.get("/", include_in_schema=False)
async def serve_portfolio(request: Request):
    """Serve the main portfolio HTML page."""
    return templates.TemplateResponse("index.html", {"request": request})


# ─── Health Check ────────────────────────────────────────────────

@app.get("/api/health", tags=["System"])
async def health_check():
    """API health check endpoint."""
    return {
        "status": "healthy",
        "version": APP_VERSION,
        "message": "Portfolio API is running"
    }
