"""
Vercel Python Serverless Function — visitor tracker API.

Deployed at /api/* on the same origin as the frontend.
Requires DATABASE_URL (Neon/Vercel Postgres), ADMIN_PASSWORD, JWT_SECRET env vars.
"""

import os
from datetime import datetime, timedelta, timezone
from typing import Optional

import httpx
from fastapi import Depends, FastAPI, Header, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy import (
    Column, DateTime, Index, Integer, String,
    create_engine, desc, func,
)
from sqlalchemy.orm import Session, declarative_base, sessionmaker
from sqlalchemy.pool import NullPool
from user_agents import parse as parse_ua

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
_raw_db_url = os.getenv("DATABASE_URL") or os.getenv("POSTGRES_URL") or ""
# Neon/Vercel gives postgres:// — SQLAlchemy wants postgresql://
DATABASE_URL = _raw_db_url.replace("postgres://", "postgresql://", 1)

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "1")
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_DAYS = 30

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
if not DATABASE_URL:
    engine = None
    SessionLocal = None
else:
    # NullPool = don't hold connections; each request opens+closes.
    # Neon has its own pooler; local pooling in a serverless function is wrong.
    engine = create_engine(DATABASE_URL, poolclass=NullPool, pool_pre_ping=True)
    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()


class Visitor(Base):
    __tablename__ = "visitors"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(64), index=True)

    ip = Column(String(45))
    country = Column(String(80))
    country_code = Column(String(4))
    city = Column(String(120))
    region = Column(String(120))

    device = Column(String(30))
    browser = Column(String(60))
    os = Column(String(60))

    page = Column(String(255))
    referrer = Column(String(500))
    referrer_source = Column(String(40), index=True)

    utm_source = Column(String(80))
    utm_medium = Column(String(80))
    utm_campaign = Column(String(80))

    duration_seconds = Column(Integer, default=0)
    user_agent = Column(String(500))

    created_at = Column(DateTime, default=datetime.utcnow, index=True)


Index("ix_visitors_created_session", Visitor.created_at, Visitor.session_id)

_schema_ready = False


def ensure_schema():
    global _schema_ready
    if _schema_ready or engine is None:
        return
    Base.metadata.create_all(bind=engine)
    _schema_ready = True


def get_db():
    if SessionLocal is None:
        raise HTTPException(500, "DATABASE_URL not configured on Vercel")
    ensure_schema()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------
def verify_password(password: str) -> bool:
    return password == ADMIN_PASSWORD


def create_token() -> str:
    payload = {
        "sub": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRE_DAYS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def require_admin(authorization: Optional[str] = Header(default=None)) -> None:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing token")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("sub") != "admin":
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token")
    except JWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")


# ---------------------------------------------------------------------------
# Geo + UA helpers
# ---------------------------------------------------------------------------
PRIVATE_PREFIXES = ("10.", "192.168.", "172.16.", "127.", "0.")


def is_private_ip(ip: str) -> bool:
    if not ip:
        return True
    return ip.startswith(PRIVATE_PREFIXES) or ip in ("::1", "unknown")


async def lookup_ip(ip: str) -> dict:
    empty = {"country": None, "country_code": None, "city": None, "region": None}
    if is_private_ip(ip):
        return empty
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            r = await client.get(f"https://ipapi.co/{ip}/json/")
            if r.status_code == 200:
                data = r.json()
                return {
                    "country": data.get("country_name"),
                    "country_code": data.get("country_code"),
                    "city": data.get("city"),
                    "region": data.get("region"),
                }
    except Exception:
        pass
    return empty


def parse_user_agent(ua_string: str) -> dict:
    if not ua_string:
        return {"device": "Unknown", "browser": "Unknown", "os": "Unknown"}
    ua = parse_ua(ua_string)
    if ua.is_mobile:
        device = "Mobile"
    elif ua.is_tablet:
        device = "Tablet"
    elif ua.is_pc:
        device = "Desktop"
    elif ua.is_bot:
        device = "Bot"
    else:
        device = "Other"
    return {
        "device": device,
        "browser": ua.browser.family or "Unknown",
        "os": ua.os.family or "Unknown",
    }


def classify_referrer(referrer: Optional[str], utm_source: Optional[str]) -> str:
    if utm_source:
        s = utm_source.lower()
        for known in ("instagram", "linkedin", "google", "twitter", "facebook", "youtube", "github"):
            if known in s:
                return known
    if not referrer or referrer.strip() == "":
        return "direct"
    ref = referrer.lower()
    mapping = {
        "instagram.com": "instagram",
        "l.instagram.com": "instagram",
        "linkedin.com": "linkedin",
        "lnkd.in": "linkedin",
        "google.": "google",
        "twitter.com": "twitter",
        "t.co": "twitter",
        "x.com": "twitter",
        "facebook.com": "facebook",
        "fb.me": "facebook",
        "youtube.com": "youtube",
        "youtu.be": "youtube",
        "github.com": "github",
    }
    for domain, source in mapping.items():
        if domain in ref:
            return source
    return "other"


def get_client_ip(request: Request) -> str:
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    real = request.headers.get("x-real-ip")
    if real:
        return real.strip()
    return request.client.host if request.client else "unknown"


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class TrackRequest(BaseModel):
    session_id: str
    page: str = "/"
    referrer: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None


class TrackResponse(BaseModel):
    visit_id: int


class DurationUpdate(BaseModel):
    visit_id: int
    duration_seconds: int


class LoginRequest(BaseModel):
    password: str


class LoginResponse(BaseModel):
    token: str


class VisitorOut(BaseModel):
    id: int
    session_id: str
    ip: Optional[str] = None
    country: Optional[str] = None
    country_code: Optional[str] = None
    city: Optional[str] = None
    region: Optional[str] = None
    device: Optional[str] = None
    browser: Optional[str] = None
    os: Optional[str] = None
    page: Optional[str] = None
    referrer: Optional[str] = None
    referrer_source: Optional[str] = None
    utm_source: Optional[str] = None
    user_agent: Optional[str] = None
    duration_seconds: int
    created_at: datetime

    class Config:
        from_attributes = True


class StatsSourceCount(BaseModel):
    source: str
    count: int


class StatsCountryCount(BaseModel):
    country: str
    country_code: Optional[str] = None
    count: int


class StatsDeviceCount(BaseModel):
    device: str
    count: int


class StatsPageCount(BaseModel):
    page: str
    count: int


class StatsResponse(BaseModel):
    total_visits: int
    unique_visitors: int
    visits_today: int
    unique_today: int
    avg_duration_seconds: float
    sources: list[StatsSourceCount]
    countries: list[StatsCountryCount]
    devices: list[StatsDeviceCount]
    top_pages: list[StatsPageCount]


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(title="Portfolio Visitor Tracker (Vercel)")

# Same-origin from nikkybisen.com, so CORS mostly a no-op — but allow all in dev.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    db_ok = engine is not None
    return {"status": "healthy", "db_configured": db_ok}


@app.post("/api/track", response_model=TrackResponse)
async def track_visit(payload: TrackRequest, request: Request, db: Session = Depends(get_db)):
    ip = get_client_ip(request)
    ua_string = request.headers.get("user-agent", "")
    ua_info = parse_user_agent(ua_string)

    if ua_info["device"] == "Bot":
        return TrackResponse(visit_id=0)

    geo = await lookup_ip(ip)
    source = classify_referrer(payload.referrer, payload.utm_source)

    visitor = Visitor(
        session_id=payload.session_id,
        ip=ip,
        country=geo["country"],
        country_code=geo["country_code"],
        city=geo["city"],
        region=geo["region"],
        device=ua_info["device"],
        browser=ua_info["browser"],
        os=ua_info["os"],
        page=payload.page,
        referrer=payload.referrer,
        referrer_source=source,
        utm_source=payload.utm_source,
        utm_medium=payload.utm_medium,
        utm_campaign=payload.utm_campaign,
        user_agent=ua_string[:500],
        duration_seconds=0,
    )
    db.add(visitor)
    db.commit()
    db.refresh(visitor)
    return TrackResponse(visit_id=visitor.id)


@app.post("/api/track/duration")
def update_duration(payload: DurationUpdate, db: Session = Depends(get_db)):
    if payload.visit_id <= 0:
        return {"ok": True}
    v = db.query(Visitor).filter(Visitor.id == payload.visit_id).first()
    if v:
        v.duration_seconds = max(0, min(payload.duration_seconds, 60 * 60 * 6))
        db.commit()
    return {"ok": True}


@app.get("/api/public/count")
def public_count(db: Session = Depends(get_db)):
    total = db.query(func.count(Visitor.id)).scalar() or 0
    unique = db.query(func.count(func.distinct(Visitor.session_id))).scalar() or 0
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_count = db.query(func.count(Visitor.id)).filter(Visitor.created_at >= today).scalar() or 0
    return {"total_visits": total, "unique_visitors": unique, "visits_today": today_count}


@app.post("/api/admin/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    if not verify_password(payload.password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Wrong password")
    return LoginResponse(token=create_token())


@app.get("/api/admin/stats", response_model=StatsResponse, dependencies=[Depends(require_admin)])
def stats(db: Session = Depends(get_db)):
    total_visits = db.query(func.count(Visitor.id)).scalar() or 0
    unique_visitors = db.query(func.count(func.distinct(Visitor.session_id))).scalar() or 0

    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    visits_today = db.query(func.count(Visitor.id)).filter(Visitor.created_at >= today).scalar() or 0
    unique_today = (
        db.query(func.count(func.distinct(Visitor.session_id)))
        .filter(Visitor.created_at >= today)
        .scalar() or 0
    )
    avg_duration = db.query(func.avg(Visitor.duration_seconds)).scalar() or 0.0

    sources_rows = (
        db.query(Visitor.referrer_source, func.count(Visitor.id))
        .group_by(Visitor.referrer_source)
        .order_by(desc(func.count(Visitor.id)))
        .limit(10).all()
    )
    countries_rows = (
        db.query(Visitor.country, Visitor.country_code, func.count(Visitor.id))
        .filter(Visitor.country.isnot(None))
        .group_by(Visitor.country, Visitor.country_code)
        .order_by(desc(func.count(Visitor.id)))
        .limit(10).all()
    )
    devices_rows = (
        db.query(Visitor.device, func.count(Visitor.id))
        .group_by(Visitor.device)
        .order_by(desc(func.count(Visitor.id)))
        .all()
    )
    pages_rows = (
        db.query(Visitor.page, func.count(Visitor.id))
        .group_by(Visitor.page)
        .order_by(desc(func.count(Visitor.id)))
        .limit(10).all()
    )

    return StatsResponse(
        total_visits=total_visits,
        unique_visitors=unique_visitors,
        visits_today=visits_today,
        unique_today=unique_today,
        avg_duration_seconds=round(float(avg_duration), 1),
        sources=[StatsSourceCount(source=s or "unknown", count=c) for s, c in sources_rows],
        countries=[
            StatsCountryCount(country=co, country_code=cc, count=cnt)
            for co, cc, cnt in countries_rows
        ],
        devices=[StatsDeviceCount(device=d or "Unknown", count=c) for d, c in devices_rows],
        top_pages=[StatsPageCount(page=p or "/", count=c) for p, c in pages_rows],
    )


@app.get("/api/admin/visitors", response_model=list[VisitorOut], dependencies=[Depends(require_admin)])
def list_visitors(page: int = 1, limit: int = 50, db: Session = Depends(get_db)):
    limit = max(1, min(limit, 200))
    offset = max(0, (page - 1) * limit)
    rows = (
        db.query(Visitor)
        .order_by(desc(Visitor.created_at))
        .offset(offset)
        .limit(limit)
        .all()
    )
    return rows
