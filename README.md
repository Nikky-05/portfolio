# AI Developer Portfolio

A modern, dark-themed portfolio website with an integrated chatbot, built with **Python**, **FastAPI**, and **SQLite**.

## Folder Structure

```
portfolio/
├── main.py                  # FastAPI application entry point
├── requirements.txt         # Python dependencies
├── .env.example             # Environment variable template
├── .gitignore
├── app/
│   ├── core/
│   │   └── config.py        # App configuration & constants
│   ├── database/
│   │   ├── connection.py    # SQLite connection manager
│   │   └── schema.py        # Table creation & seed data
│   ├── models/
│   │   └── schemas.py       # Pydantic request/response models
│   └── routes/
│       ├── chat.py          # POST /api/chat - Chatbot endpoint
│       ├── contact.py       # POST /api/contact - Contact form
│       └── projects.py      # GET  /api/projects - Portfolio projects
├── static/
│   ├── css/
│   │   └── style.css        # Dark theme styles & animations
│   └── js/
│       └── main.js          # Frontend interactivity & API calls
└── templates/
    └── index.html           # Main portfolio page (Jinja2 template)
```

## Quick Start

### 1. Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the server

```bash
uvicorn main:app --reload
```

The app will be live at **http://localhost:8000**

### 4. API Documentation

FastAPI auto-generates interactive docs:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

| Method | Endpoint          | Description               |
|--------|-------------------|---------------------------|
| GET    | /                 | Portfolio website          |
| POST   | /api/chat         | Chat with the bot          |
| POST   | /api/contact      | Submit contact form        |
| GET    | /api/projects     | List all projects          |
| GET    | /api/projects/:id | Get a single project       |
| GET    | /api/health       | API health check           |

## Database Schema

The SQLite database (`portfolio.db`) is auto-created on first run with these tables:

- **chatbot_responses** - Keyword-to-response mappings for the chatbot
- **contact_messages** - Stored messages from the contact form
- **projects** - Portfolio project entries
- **chat_history** - Logged chatbot conversations

## Customization

1. **Your Info** - Update name, email, GitHub, and LinkedIn in `templates/index.html`
2. **Chatbot Responses** - Edit seed data in `app/database/schema.py`
3. **Projects** - Modify project entries in `app/database/schema.py`
4. **Styling** - All CSS variables are in `static/css/style.css` under `:root`

## Deployment

### Docker

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Render / Railway

1. Push to GitHub
2. Connect repo on Render or Railway
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### VPS (Ubuntu)

```bash
sudo apt update && sudo apt install python3-pip python3-venv
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

Use **nginx** as a reverse proxy and **systemd** for process management in production.

## Tech Stack

- **Backend:** Python 3.12+, FastAPI, Pydantic
- **Database:** SQLite (zero-config, serverless)
- **Server:** Uvicorn (ASGI)
- **Frontend:** Vanilla HTML/CSS/JS, Jinja2 templates
- **Design:** Dark theme, responsive, animated
