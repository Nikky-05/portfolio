from datetime import datetime
from typing import Optional
from pydantic import BaseModel


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
