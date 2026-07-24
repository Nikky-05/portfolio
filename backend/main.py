import os
from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from dotenv import load_dotenv

from database import Base, engine, get_db
from models import Visitor
from schemas import (
    TrackRequest, TrackResponse, DurationUpdate,
    LoginRequest, LoginResponse, StatsResponse, VisitorOut,
    StatsSourceCount, StatsCountryCount, StatsDeviceCount, StatsPageCount,
)
from geo import lookup_ip, parse_user_agent, classify_referrer, get_client_ip
from auth import verify_password, create_token, require_admin

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Portfolio Visitor Tracker")

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "*")
allow_origins = [o.strip() for o in FRONTEND_ORIGIN.split(",")] if FRONTEND_ORIGIN != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "service": "portfolio-tracker"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/track", response_model=TrackResponse)
async def track_visit(payload: TrackRequest, request: Request, db: Session = Depends(get_db)):
    ip = get_client_ip(request)
    ua_string = request.headers.get("user-agent", "")
    ua_info = parse_user_agent(ua_string)

    # Skip bots so dashboard stays clean
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
        .scalar()
        or 0
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
def list_visitors(
    page: int = 1,
    limit: int = 50,
    db: Session = Depends(get_db),
):
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
