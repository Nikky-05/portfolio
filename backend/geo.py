import httpx
from user_agents import parse as parse_ua

PRIVATE_PREFIXES = ("10.", "192.168.", "172.16.", "127.", "0.")


def is_private_ip(ip: str) -> bool:
    if not ip:
        return True
    return ip.startswith(PRIVATE_PREFIXES) or ip in ("::1", "unknown")


async def lookup_ip(ip: str) -> dict:
    """Free IP geo lookup via ipapi.co (1000 req/day free, no key)."""
    if is_private_ip(ip):
        return {"country": None, "country_code": None, "city": None, "region": None}

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

    return {"country": None, "country_code": None, "city": None, "region": None}


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


def classify_referrer(referrer: str | None, utm_source: str | None) -> str:
    """Return one of: instagram, linkedin, google, twitter, facebook, youtube, direct, other."""
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


def get_client_ip(request) -> str:
    """Extract real client IP behind proxies (Render, Cloudflare, etc.)."""
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    real = request.headers.get("x-real-ip")
    if real:
        return real.strip()
    return request.client.host if request.client else "unknown"
