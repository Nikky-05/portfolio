# Visitor Tracker Setup — Step-by-Step

Isse aapki portfolio pe `/#viewers` route pe password-protected analytics dashboard aa jayega.

---

## 1. Local Testing (pehle laptop pe test karo)

### Backend
```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Edit `backend\.env`:
```
DATABASE_URL=sqlite:///./visitors.db
ADMIN_PASSWORD=your-strong-password-here
JWT_SECRET=paste-a-random-32-char-string-here
FRONTEND_ORIGIN=http://localhost:5173
```

Run:
```powershell
uvicorn main:app --reload --port 8000
```

### Frontend
Naya terminal:
```powershell
copy .env.example .env.local
```

`.env.local` mein:
```
VITE_API_URL=http://localhost:8000
```

Run:
```powershell
npm run dev
```

Open http://localhost:5173 — normal site load hoga (aur backend mein aapka visit log ho jayega).
Ab http://localhost:5173/#viewers khol ke password enter karo → dashboard dikhega.

---

## 2. Deploy Backend to Render

1. Poora repo GitHub pe push karo (agar nahi hai to).
2. https://dashboard.render.com → **New +** → **Blueprint** → apni repo select karo.
   - `render.yaml` automatically detect ho jayega. `nikky-tracker` web service + `nikky-tracker-db` Postgres create hoga.
3. Deploy start hone se pehle Render 2 env vars manually maangega:
   - **ADMIN_PASSWORD** → strong password (jo aap `/#viewers` pe daloge)
   - **FRONTEND_ORIGIN** → aapki Vercel URL, e.g. `https://portfolio-mu-orpin-21.vercel.app`
4. Deploy click karo. 3-5 min mein backend live ho jayega. URL note karo, e.g. `https://nikky-tracker.onrender.com`.

**Test**: browser mein `https://nikky-tracker.onrender.com/health` open karo → `{"status": "healthy"}` dikhna chahiye.

---

## 3. Connect Frontend on Vercel

1. Vercel dashboard → apna portfolio project → **Settings** → **Environment Variables**.
2. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://nikky-tracker.onrender.com` (Render backend URL)
   - **Environments**: Production, Preview, Development sab tick karo.
3. **Deployments** tab → latest deployment ke 3-dot menu → **Redeploy** (env var apply karne ke liye).

---

## 4. Instagram Bio Update (Recommended)

Insta bio link ko update karo taaki dashboard mein clearly "Instagram" traffic dikhe:

```
https://portfolio-mu-orpin-21.vercel.app?utm_source=instagram&utm_medium=bio
```

LinkedIn ke liye:
```
https://portfolio-mu-orpin-21.vercel.app?utm_source=linkedin
```

---

## 5. Access Dashboard

Kisi bhi din, kisi bhi device se:
1. `https://portfolio-mu-orpin-21.vercel.app/#viewers` open karo
2. Apna `ADMIN_PASSWORD` daalo
3. 30 din tak login rahega (JWT), phir dobara password chahiye

---

## Troubleshooting

**Login "Wrong password" dikha raha?**
- Render → nikky-tracker service → Environment tab → `ADMIN_PASSWORD` verify karo. Change kiya to service auto-redeploy hogi (1-2 min).

**Dashboard blank / "Failed to fetch"?**
- Browser DevTools → Console → CORS error dekho.
- Render pe `FRONTEND_ORIGIN` = aapki exact Vercel URL hai? Trailing slash mat lagana.

**Visits log nahi ho rahi?**
- Vercel pe `VITE_API_URL` set hai? Redeploy kiya after adding?
- Backend URL browser mein khol ke check karo — `{"status":"ok"}` aana chahiye.

**Render backend slow (10s first request)?**
- Free tier 15 min baad sleep karta hai. Yeh expected hai. Chahe to `cron-job.org` se har 10 min ping karke jaga rakh sakte ho.

**Bots dikh rahe stats mein?**
- Backend automatically bot user-agents skip karta hai. Agar phir bhi dikhe, `geo.py` mein `parse_user_agent` filter tighten karo.
