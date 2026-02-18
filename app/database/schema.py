"""
Database schema creation and seed data.
Run once on application startup to initialize tables and populate chatbot responses.
"""

from app.database.connection import get_db


def create_tables():
    """Create all database tables if they don't exist."""
    with get_db() as conn:
        cursor = conn.cursor()

        # Chatbot responses table - stores keyword-to-response mappings
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS chatbot_responses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                keyword TEXT NOT NULL,
                response TEXT NOT NULL,
                category TEXT DEFAULT 'general',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Contact messages table - stores messages from the contact form
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                subject TEXT,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Projects table - portfolio projects
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                features TEXT NOT NULL,
                tech_stack TEXT NOT NULL,
                architecture TEXT,
                github_url TEXT,
                live_url TEXT,
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Chat history table - logs all chat interactions
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS chat_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_message TEXT NOT NULL,
                bot_response TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)


def seed_chatbot_responses():
    """Populate the chatbot_responses table with initial data."""
    with get_db() as conn:
        cursor = conn.cursor()

        # Check if data already exists
        cursor.execute("SELECT COUNT(*) FROM chatbot_responses")
        if cursor.fetchone()[0] > 0:
            return

        responses = [
            # Greetings
            ("hello", "Hey there! Welcome to my portfolio. I'm an AI Backend Developer specializing in Python and FastAPI. How can I help you?", "greeting"),
            ("hi", "Hi! Great to see you here. Feel free to ask me about my skills, projects, or experience!", "greeting"),
            ("hey", "Hey! I'm the portfolio chatbot. Ask me anything about my developer's skills, projects, or background!", "greeting"),

            # Skills
            ("skills", "My core skills include:\n\n🔧 Technical Skills:\n- Python (Advanced)\n- FastAPI & REST API Design\n- SQLite & Database Architecture\n- API Security & Authentication\n- Git Version Control\n- Uvicorn & ASGI Servers\n- Pydantic Data Validation\n- Postman API Testing\n\n🧠 Analytical & Critical Thinking:\n- Strong problem-solving ability\n- Logical decision-making\n- Ability to break down complex topics clearly\n\n📚 Fast Learner:\n- Quick to grasp new concepts\n- Self-driven learning mindset\n- Adaptable to new tools and environments\n\n💬 Communication Skills:\n- Clear and direct communicator\n- Precise, goal-oriented questions\n- Comfortable discussing ideas and solutions\n\n🎯 Results-Oriented Approach:\n- Focused on practical outcomes\n- Efficiency-driven thinking\n- Goal-focused mindset\n\n🔄 Continuous Improvement:\n- Self-aware and growth-oriented\n- Actively seeks feedback\n- Motivated to develop new skills", "skills"),
            ("python", "Python is my primary language. I use it for backend development, API creation, data processing, and automation. I'm proficient with FastAPI, Pydantic, SQLAlchemy, and the Python ecosystem.", "skills"),
            ("fastapi", "FastAPI is my go-to framework for building APIs. I love it for its speed, automatic OpenAPI docs, type safety with Pydantic, and async support. This very portfolio runs on FastAPI!", "skills"),
            ("database", "I work primarily with SQLite for lightweight applications and prototyping. I understand relational database design, indexing, query optimization, and data modeling.", "skills"),
            ("sqlite", "SQLite is my preferred database for projects that need a lightweight, zero-config, serverless solution. It's perfect for portfolios, chatbots, and small-to-medium applications.", "skills"),
            ("backend", "I'm a backend-focused developer. I design and build scalable REST APIs, handle database architecture, implement authentication systems, and ensure clean code structure.", "skills"),
            ("api", "I specialize in REST API development using FastAPI. I follow best practices: proper HTTP methods, status codes, request validation with Pydantic, error handling, and API documentation.", "skills"),

            # Projects
            ("projects", "Here are my projects:\n\n1. AutoMail Generation System - Automated email generation for streamlined communication\n2. Travel Reminder Notification System - Email & WhatsApp reminders before travel dates\n3. Hotel Blocking Deadline Reminder - Alerts before hotel blocking time limits expire\n4. Hotel Travel Date Reconfirmation Reminder - Smart reconfirmation workflow for hotels\n5. Public File Access Tracking System - Lead generation via pre-access authentication\n6. OCR-Based Document Data Extraction - Extract data from Aadhaar, PAN, Voter ID, Passport, DL\n7. AgriStack Chatbot with Data Visualization - AI chatbot for farmer & crop data insights\n8. Multi-RAG System - Multi-database Retrieval-Augmented Generation for intelligent querying\n\nAsk about any specific project for more details!", "projects"),
            ("automail", "AutoMail Generation System:\nDesigned and developed an automated email generation system to streamline communication workflows.\n\nKey Features:\n- Automated dynamic email creation based on event triggers\n- SMTP/API integration for scheduled & bulk email delivery\n- Reduced manual communication effort\n- Improved response time and operational efficiency\n\nTech: Python | SMTP | REST APIs | Database", "projects"),
            ("travel", "Travel Reminder Notification System:\nBuilt a reminder system to notify users before travel dates to avoid missing boarding passes.\n\nFeatures:\n- Automated email & WhatsApp reminders before departure\n- Configurable reminder timelines (24 hrs, 48 hrs, etc.)\n- Calendar & booking data integration\n- Real-time notification triggering\n\nImpact: Reduced missed travel check-ins and improved customer satisfaction.", "projects"),
            ("hotel blocking", "Hotel Blocking Deadline Reminder System:\nDeveloped an automated alert system to notify users before hotel blocking time limits expire.\n\nFeatures:\n- Time-based trigger notifications\n- Email & WhatsApp API integration\n- Dashboard to track blocking deadlines\n- Admin control for reminder configuration\n\nImpact: Prevented booking cancellations due to missed blocking deadlines.", "projects"),
            ("hotel reconfirmation", "Hotel Travel Date Reconfirmation Reminder:\nCreated a smart reminder workflow to prompt hotel reconfirmation before travel dates.\n\nFeatures:\n- Automated reconfirmation alerts\n- Booking database integration\n- Notification logs & tracking system\n\nImpact: Improved coordination with hotels and reduced last-minute issues.", "projects"),
            ("file access", "Public File Access Tracking System:\nDesigned a system to collect email and mobile numbers before granting access to public files.\n\nFeatures:\n- Pre-access user authentication form\n- Email/mobile OTP verification\n- User data storage & analytics tracking\n- GDPR-aware data handling\n\nImpact: Generated user leads and improved access control.", "projects"),
            ("ocr", "OCR-Based Document Data Extraction System:\nBuilt an OCR system to extract structured data from government documents like Aadhaar, PAN, Voter ID, Passport, and Driving License.\n\nFeatures:\n- Text extraction using OCR engines\n- Field-level data parsing (Name, DOB, ID number, etc.)\n- Validation & structured JSON output\n- Image preprocessing for higher accuracy\n\nTech: Tesseract OCR | OpenCV | Python | ML Models\n\nImpact: Reduced manual data entry time and improved verification speed.", "projects"),
            ("agristack", "AgriStack Chatbot with Data Visualization:\nDeveloped an AI chatbot for AgriStack to display farmer and crop data in interactive visual formats.\n\nFeatures:\n- Conversational query handling\n- Farmer database integration\n- Crop insights & land data visualization\n- Dashboard-style graphical outputs\n\nImpact: Simplified agricultural data access for farmers and administrators.", "projects"),
            ("rag", "Multi-RAG (Retrieval Augmented Generation) System:\nDeveloped a multi-database Retrieval-Augmented Generation system for intelligent data querying.\n\nFeatures:\n- Fetch data from multiple databases\n- Context-aware AI responses\n- Vector embeddings & semantic search\n- LLM integration for dynamic answer generation\n\nTech: LangChain | LLM APIs | Vector DB | SQL | NoSQL\n\nImpact: Enabled intelligent cross-database querying and improved decision-making speed.", "projects"),
            ("chatbot", "The AI Chatbot API is built with FastAPI + SQLite. It uses keyword-based matching to provide intelligent responses, logs conversations, and can be extended with NLP. You're talking to it right now!", "projects"),

            # Experience
            ("experience", "I'm a backend developer focused on building AI-powered applications and REST APIs. My expertise lies in Python, FastAPI, and database design. I build clean, modular, production-ready systems.", "experience"),
            ("work", "I focus on backend development and API engineering. My work involves designing scalable architectures, building REST APIs, integrating databases, and creating developer-friendly documentation.", "experience"),
            ("education", "I have a strong foundation in computer science and software engineering, with continuous learning in AI/ML, backend systems, and API design through hands-on project development.", "experience"),

            # Architecture
            ("architecture", "My typical project architecture:\n\nFrontend (HTML/CSS/JS) → FastAPI Backend → Pydantic Validation → SQLite Database → JSON Response\n\nI follow clean separation of concerns with modular routing, models, and database layers.", "architecture"),
            ("tech stack", "👨‍💻 TECHNICAL SKILLS\n\n🔹 Backend:\n- Python\n- FastAPI\n- Flask\n\n🔹 Frontend:\n- HTML\n- CSS\n- JavaScript\n- Bootstrap\n\n🔹 Databases:\n- SQLite\n- PostgreSQL\n\n🔹 AI & Machine Learning:\n- Retrieval-Augmented Generation (RAG)\n- Large Language Models (LLMs)\n- Pretrained Transformer Models\n- Ollama (Local LLM deployment)\n- Hugging Face Models\n- AI-based Document Processing\n\n🔹 Tools & Development Environment:\n- Git (Version Control)\n- Postman (API Testing)\n- VS Code\n- Cursor\n- Antigravity", "architecture"),

            # Contact
            ("contact", "You can reach me through:\n- Email: nkbisane@gmail.com\n- GitHub: github.com/Nikky-05\n- LinkedIn: linkedin.com/in/nikky-bisen-4a609115a\n\nOr use the contact form on this page!", "contact"),
            ("email", "Feel free to send me an email at nkbisane@gmail.com. I typically respond within 24 hours!", "contact"),
            ("hire", "I'm open to opportunities! Whether it's freelance work, full-time positions, or collaboration on interesting projects. Use the contact form or reach out via email/LinkedIn!", "contact"),

            # About
            ("about", "I'm an AI Backend Developer and FastAPI Engineer passionate about building intelligent, scalable systems. I specialize in Python-based backend development with clean architecture and production-ready code.", "about"),
            ("who", "I'm a backend developer who loves building APIs and AI-powered applications. My focus is on clean code, scalable architecture, and developer experience. This portfolio itself is a showcase of my work!", "about"),

            # Fallback / Fun
            ("thanks", "You're welcome! Feel free to explore the portfolio or ask me anything else. Happy to help!", "general"),
            ("bye", "Thanks for visiting! Don't forget to check out the projects section and feel free to reach out. See you!", "general"),
            ("help", "I can help you with:\n- My skills and tech stack\n- Project details\n- Work experience\n- Architecture decisions\n- Contact information\n\nJust type a keyword or question!", "general"),
        ]

        cursor.executemany(
            "INSERT INTO chatbot_responses (keyword, response, category) VALUES (?, ?, ?)",
            responses
        )


def seed_projects():
    """Populate the projects table with portfolio projects."""
    with get_db() as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM projects")
        if cursor.fetchone()[0] > 0:
            return

        projects = [
            (
                "AutoMail Generation System",
                "Designed and developed an automated email generation system to streamline communication workflows. Automates dynamic email creation based on event triggers with SMTP/API integration for scheduled and bulk delivery.",
                "Automated dynamic email creation based on event triggers|SMTP/API integration for scheduled & bulk email delivery|Reduced manual communication effort|Improved response time and operational efficiency",
                "Python|SMTP|REST APIs|Database",
                "Event Trigger → Email Template Engine → SMTP/API Gateway → Scheduled Delivery → Delivery Tracking. The system monitors events, generates dynamic email content, and dispatches through configured SMTP or API channels.",
                None,
                None,
                None,
            ),
            (
                "Travel Reminder Notification System",
                "Built a reminder system to notify users before travel dates to avoid missing boarding passes. Supports automated email and WhatsApp reminders with configurable timelines.",
                "Automated email & WhatsApp reminders before departure|Configurable reminder timelines (24 hrs, 48 hrs, etc.)|Calendar & booking data integration|Real-time notification triggering",
                "Python|WhatsApp API|SMTP|Database|Scheduling",
                "Booking Data → Reminder Scheduler → Time-based Trigger → Notification Gateway (Email/WhatsApp) → Delivery Confirmation. The system integrates with booking databases and sends multi-channel reminders at configured intervals.",
                None,
                None,
                None,
            ),
            (
                "Hotel Blocking Deadline Reminder System",
                "Developed an automated alert system to notify users before hotel blocking time limits expire. Prevented booking cancellations due to missed blocking deadlines.",
                "Time-based trigger notifications|Email & WhatsApp API integration|Dashboard to track blocking deadlines|Admin control for reminder configuration",
                "Python|WhatsApp API|SMTP|Database|Dashboard",
                "Booking Database → Deadline Monitor → Time-based Trigger → Multi-channel Notification (Email/WhatsApp) → Admin Dashboard. The system tracks blocking deadlines and dispatches alerts before expiry.",
                None,
                None,
                None,
            ),
            (
                "Hotel Travel Date Reconfirmation Reminder",
                "Created a smart reminder workflow to prompt hotel reconfirmation before travel dates. Improved coordination with hotels and reduced last-minute issues.",
                "Automated reconfirmation alerts|Booking database integration|Notification logs & tracking system|Reduced last-minute coordination issues",
                "Python|SMTP|Database|REST APIs",
                "Booking Data → Reconfirmation Scheduler → Automated Alert Dispatch → Notification Logs → Tracking Dashboard. The workflow monitors upcoming travel dates and triggers reconfirmation prompts.",
                None,
                None,
                None,
            ),
            (
                "Public File Access Tracking System",
                "Designed a system to collect email and mobile numbers before granting access to public files. Generated user leads and improved access control with GDPR-aware data handling.",
                "Pre-access user authentication form|Email/mobile OTP verification|User data storage & analytics tracking|GDPR-aware data handling",
                "Python|REST APIs|Database|OTP Services",
                "File Request → Authentication Form → OTP Verification → Access Granted → User Data Analytics. The system gates file access behind identity verification and tracks user engagement.",
                None,
                None,
                None,
            ),
            (
                "OCR-Based Document Data Extraction System",
                "Built an OCR system to extract structured data from government documents like Aadhaar, PAN, Voter ID, Passport, and Driving License. Reduced manual data entry time and improved verification speed.",
                "Text extraction using OCR engines|Field-level data parsing (Name, DOB, ID number)|Validation & structured JSON output|Image preprocessing for higher accuracy",
                "Python|Tesseract OCR|OpenCV|ML Models",
                "Document Image → Preprocessing (OpenCV) → OCR Engine (Tesseract) → Field-level Parsing → Validation → Structured JSON Output. The pipeline processes document images and extracts verified structured data.",
                None,
                None,
                None,
            ),
            (
                "AgriStack Chatbot with Data Visualization",
                "Developed an AI chatbot for AgriStack to display farmer and crop data in interactive visual formats. Simplified agricultural data access for farmers and administrators.",
                "Conversational query handling|Farmer database integration|Crop insights & land data visualization|Dashboard-style graphical outputs",
                "Python|FastAPI|Database|Data Visualization|AI/NLP",
                "User Query → NLP Processing → Database Query (Farmer/Crop Data) → Data Aggregation → Interactive Visualization → Chat Response. The chatbot interprets queries and renders data as interactive dashboards.",
                None,
                None,
                None,
            ),
            (
                "Multi-RAG System",
                "Developed a multi-database Retrieval-Augmented Generation system for intelligent data querying. Enabled intelligent cross-database querying and improved decision-making speed.",
                "Fetch data from multiple databases|Context-aware AI responses|Vector embeddings & semantic search|LLM integration for dynamic answer generation",
                "Python|LangChain|LLM APIs|Vector DB|SQL|NoSQL",
                "User Query → Query Analysis → Vector Embedding → Semantic Search (Multiple DBs) → Context Assembly → LLM Generation → Response. The system retrieves relevant data across databases and generates context-aware answers.",
                None,
                None,
                None,
            ),
        ]

        cursor.executemany(
            """INSERT INTO projects
            (title, description, features, tech_stack, architecture, github_url, live_url, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            projects
        )


def init_db():
    """Initialize database: create tables and seed data."""
    create_tables()
    seed_chatbot_responses()
    seed_projects()
