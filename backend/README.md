# Portfolio Visitor Tracker — Backend

FastAPI service that logs website visits and exposes a password-protected admin API for the `/#viewers` dashboard.

## Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET  | `/health` | — | Health check |
| POST | `/api/track` | — | Log a page visit (called from frontend on mount) |
| POST | `/api/track/duration` | — | Update how long the visitor stayed |
| POST | `/api/admin/login` | password | Get admin JWT (30 days) |
| GET  | `/api/admin/stats` | Bearer JWT | Aggregated stats for dashboard cards |
| GET  | `/api/admin/visitors?page=1&limit=50` | Bearer JWT | Paginated visitor list |

## Local development

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate         # Windows
# source .venv/bin/activate    # macOS/Linux
pip install -r requirements.txt

copy .env.example .env         # then edit .env
uvicorn main:app --reload --port 8000
```

Open http://localhost:8000/docs for Swagger UI.

## Deploy on Render

1. Push this repo to GitHub.
2. Render dashboard → **New +** → **Web Service** → connect repo.
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Create a **PostgreSQL** database on Render → copy Internal Database URL.
5. Add env vars on the web service:
   - `DATABASE_URL` = the Postgres URL from step 4
   - `ADMIN_PASSWORD` = a strong password (this is what you type on `/#viewers`)
   - `JWT_SECRET` = long random string (`python -c "import secrets; print(secrets.token_urlsafe(32))"`)
   - `FRONTEND_ORIGIN` = your Vercel URL (e.g., `https://portfolio-mu-orpin-21.vercel.app`)
6. Deploy. Note the service URL (e.g., `https://nikky-tracker.onrender.com`).
7. In the frontend project on Vercel, set `VITE_API_URL` to that URL.

## Notes

- **First request may be slow (~10s)** on Render's free tier because the service sleeps after 15 min idle. Tracking is fire-and-forget so it doesn't block the user.
- IP geolocation uses [ipapi.co](https://ipapi.co) — free tier is 1,000 requests/day. Upgrade or swap providers if you exceed that.
- Bots are detected via User-Agent and skipped from tracking.
