from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Index
from database import Base


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
