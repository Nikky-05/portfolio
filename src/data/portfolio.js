// All portfolio data - no backend needed
export const personalInfo = {
  name: "Nikky Bisen",
  initials: "NB",
  email: "nkbisane@gmail.com",
  github: "https://github.com/Nikky-05",
  linkedin: "https://www.linkedin.com/in/nikky-bisen-4a609115a/",
  status: "Available for opportunities",
  roles: [
    "AI Backend Developer",
    "FastAPI Engineer",
    "Python Developer",
    "API Architect",
    "RAG System Builder",
    "OCR & ML Engineer",
  ],
  stats: [
    { label: "Projects", value: 10, suffix: "+" },
    { label: "APIs Built", value: 5, suffix: "+" },
    { label: "Lines of Python", value: 15000, suffix: "+" },
  ],
  about: `def nikky_bisen():
    role = "AI Backend Developer"
    passion = "Building intelligent APIs"
    stack = ["Python", "FastAPI", "AI/ML"]
    status = "Available for opportunities"
    return "Let's build something amazing!"`,
};

export const techStack = {
  backend: [
    "Python",
    "FastAPI",
    "Flask",
    "Node.js",
    "REST APIs",
    "Uvicorn",
    "Pydantic",
    "Redis",
  ],
  frontend: ["React.js", "Next.js", "HTML5", "CSS3", "JavaScript", "Jinja2"],
  databases: ["PostgreSQL", "SQLite", "Vector DB", "NoSQL"],
  aiMl: [
    "LLMs",
    "LangChain",
    "LangGraph",
    "RAG Pipelines",
    "Hugging Face",
    "Tesseract OCR",
    "OpenCV",
    "Ollama",
    "NLP",
  ],
  cloud: ["AWS", "Google Cloud (GCP)", "Docker", "Nginx", "GitHub Actions", "Render"],
  tools: ["Git", "GitHub", "Postman", "VS Code"],
  softSkills: [
    "Analytical Thinking",
    "Problem Solving",
    "Fast Learner",
    "Clear Communication",
    "Results-Oriented",
    "Continuous Improvement",
  ],
};

// Services offered
export const services = [
  {
    icon: "🤖",
    title: "AI & Automation Solutions",
    color: "#8b5cf6",
    items: [
      "AI Chatbots",
      "Custom AI Agents",
      "RAG Applications",
      "OCR & Document Processing",
      "Workflow Automation",
      "AI-Powered Business Solutions",
      "Business Process Automation",
    ],
  },
  {
    icon: "💻",
    title: "Full Stack Development",
    color: "#3b82f6",
    items: [
      "Custom Web Applications",
      "SaaS Platform Development",
      "Admin Dashboards",
      "REST API Development",
      "Backend Systems",
      "Database Design & Integration",
      "Cloud Deployment (AWS, GCP)",
    ],
  },
  {
    icon: "🌐",
    title: "Website Development",
    color: "#22d3ee",
    items: [
      "Business & Corporate Websites",
      "Portfolio Websites",
      "School & College Websites",
      "E-Commerce Websites",
      "Landing Pages",
      "SEO-Friendly Websites",
    ],
  },
  {
    icon: "🎓",
    title: "AI & Technical Training",
    color: "#f472b6",
    items: [
      "Python Training",
      "AI & Machine Learning Training",
      "Git & GitHub Training",
      "Full Stack Development Training",
      "Real-Time Industry Projects",
      "Career Guidance & Interview Prep",
    ],
  },
  {
    icon: "🏫",
    title: "Academic & College Projects",
    color: "#34d399",
    items: [
      "Final Year Projects",
      "AI/ML Projects",
      "Web Development Projects",
      "Research Prototypes",
      "Project Documentation Support",
    ],
  },
  {
    icon: "📊",
    title: "Business & Financial Solutions",
    color: "#fbbf24",
    items: [
      "Business Automation Consulting",
      "Digital Transformation",
      "Data Analytics Solutions",
      "Financial Dashboard Development",
      "Reporting & Insights Systems",
    ],
  },
];

// What we are currently building
export const building = [
  {
    icon: "✈️",
    title: "Aviation Boarding Automation System",
    description:
      "AI-powered passenger verification and boarding automation system to streamline airport operations.",
    status: "In Development",
  },
  {
    icon: "🐕",
    title: "AI Robotic Dog",
    description:
      "Hardware + software integrated robotic dog capable of autonomous movement, smart navigation, and AI interaction.",
    status: "Prototyping",
  },
  {
    icon: "🛣️",
    title: "Roadwork Intelligence Platform",
    description:
      "AI-powered platform for road project monitoring, DPR analysis, anomaly detection, and project intelligence.",
    status: "In Development",
  },
  {
    icon: "🪪",
    title: "Intelligent KYC OCR Platform",
    description:
      "Automated document processing for Aadhaar, PAN, Passport, Driving License, and other KYC documents.",
    status: "In Development",
  },
];

// Why choose us
export const whyChooseUs = [
  { icon: "⚡", text: "AI-First Approach" },
  { icon: "🔄", text: "End-to-End Development" },
  { icon: "🏭", text: "Real-Time Industry Experience" },
  { icon: "🚀", text: "Fast Delivery" },
  { icon: "📈", text: "Scalable Solutions" },
  { icon: "💰", text: "Affordable Pricing" },
  { icon: "🛟", text: "Ongoing Support" },
  { icon: "🧩", text: "Modern Technology Stack" },
];

export const projects = [
  {
    id: 1,
    title: "AutoMail Generation System",
    icon: "✉️",
    description:
      "Automated email generation system to streamline communication workflows with smart templates and scheduling.",
    features: [
      "Dynamic email creation",
      "SMTP/API integration",
      "Scheduled & bulk delivery",
      "Reduced manual effort",
    ],
    techStack: ["Python", "SMTP", "REST APIs", "Database"],
    architecture:
      "Event Trigger → Email Template Engine → SMTP/API Gateway → Scheduled Delivery",
  },
  {
    id: 2,
    title: "Travel Reminder Notification System",
    icon: "✈️",
    description:
      "Notify users before travel dates to avoid missing boarding passes via multi-channel alerts.",
    features: [
      "Email & WhatsApp reminders",
      "Configurable timelines (24/48 hrs)",
      "Calendar/booking integration",
      "Real-time triggering",
    ],
    techStack: ["Python", "WhatsApp API", "SMTP", "Database", "Scheduling"],
    architecture:
      "Booking Data → Reminder Scheduler → Time-based Trigger → Multi-channel Gateway",
  },
  {
    id: 3,
    title: "Hotel Blocking Deadline Reminder",
    icon: "🏨",
    description:
      "Alert system for hotel blocking time limit expiration with admin dashboard.",
    features: [
      "Time-based notifications",
      "Email/WhatsApp API",
      "Deadline tracking dashboard",
      "Admin configuration",
    ],
    techStack: ["Python", "WhatsApp API", "SMTP", "Database", "Dashboard"],
    architecture:
      "Booking DB → Deadline Monitor → Multi-channel Notification → Admin Dashboard",
  },
  {
    id: 4,
    title: "Hotel Reconfirmation Reminder",
    icon: "📅",
    description:
      "Smart reminder workflow for hotel reconfirmation before travel dates with tracking.",
    features: [
      "Automated alerts",
      "Booking database integration",
      "Notification logs & tracking",
    ],
    techStack: ["Python", "SMTP", "Database", "REST APIs"],
    architecture:
      "Booking Data → Reconfirmation Scheduler → Alert Dispatch → Tracking Dashboard",
  },
  {
    id: 5,
    title: "Public File Access Tracking",
    icon: "🔐",
    description:
      "Collect email/mobile before granting access to public files; generate user leads.",
    features: [
      "Pre-access authentication form",
      "Email/mobile OTP verification",
      "User data storage & analytics",
    ],
    techStack: ["Python", "REST APIs", "Database", "OTP Services"],
    architecture:
      "File Request → Auth Form → OTP Verification → Access Granted → Analytics",
  },
  {
    id: 6,
    title: "OCR Document Data Extraction",
    icon: "📄",
    description:
      "Extract structured data from government documents — Aadhaar, PAN, Voter ID, Passport, DL.",
    features: [
      "Text extraction",
      "Field-level parsing",
      "JSON validation",
      "Image preprocessing",
    ],
    techStack: ["Python", "Tesseract OCR", "OpenCV", "ML Models"],
    architecture:
      "Document Image → Preprocessing → OCR Engine → Field Parsing → Validation → JSON Output",
  },
  {
    id: 7,
    title: "AgriStack Chatbot + Visualization",
    icon: "🌾",
    description:
      "AI chatbot for displaying farmer and crop data in interactive visual formats.",
    features: [
      "Conversational query handling",
      "Farmer database integration",
      "Crop insights visualization",
      "Dashboard outputs",
    ],
    techStack: [
      "Python",
      "FastAPI",
      "Database",
      "Data Visualization",
      "AI/NLP",
    ],
    architecture:
      "User Query → NLP Processing → DB Query → Data Aggregation → Visualization",
  },
  {
    id: 8,
    title: "Multi-RAG System",
    icon: "🤖",
    description:
      "Multi-database Retrieval-Augmented Generation system for intelligent data querying across sources.",
    features: [
      "Multi-database fetching",
      "Context-aware responses",
      "Vector embeddings",
      "LLM integration",
    ],
    techStack: ["Python", "LangChain", "LLM APIs", "Vector DB", "SQL", "NoSQL"],
    architecture:
      "User Query → Vector Embedding → Semantic Search → Context Assembly → LLM Generation",
  },
];

export const chatbotResponses = {
  hello: "Hey there! 👋 I'm Nikky's AI assistant. Ask me about skills, projects, experience, or anything!",
  hi: "Hi! Welcome to Nikky's portfolio. What would you like to know?",
  hey: "Hey! Great to see you here. Feel free to ask about projects, skills, or experience!",
  skills:
    "Nikky's core skills: Python (Advanced), FastAPI, REST API Design, SQLite, RAG Systems, LLMs, OCR, OpenCV, LangChain, and more!",
  python:
    "Python is Nikky's primary language — used for backend development, AI/ML, automation, and data processing.",
  fastapi:
    "FastAPI is Nikky's go-to framework for building high-performance REST APIs with automatic documentation.",
  database:
    "Nikky works with SQLite, PostgreSQL, Vector DBs, and NoSQL for various data storage needs.",
  projects:
    "Nikky has built 8+ projects including AutoMail System, OCR Document Extraction, AgriStack Chatbot, Multi-RAG System, and more!",
  services:
    "Nikky offers AI & Automation, Full Stack Development, Website Development, AI/Technical Training, Academic Projects, and Business Solutions. Scroll to the Services section to explore!",
  training:
    "Nikky provides hands-on training in Python, AI/ML, Git & GitHub, and Full Stack Development — with real-time industry projects and career guidance.",
  experience:
    "Nikky is an AI Backend Developer with experience in Python, FastAPI, REST APIs, and intelligent automation systems.",
  education:
    "Nikky has a strong foundation in computer science with focus on AI/ML and backend development.",
  contact:
    "Reach Nikky at nkbisane@gmail.com or connect on LinkedIn & GitHub. Always open for exciting opportunities!",
  about:
    "Nikky Bisen is an AI Backend Developer passionate about building intelligent APIs and automation systems with Python.",
  architecture:
    "Nikky designs clean, scalable architectures — from event-driven systems to RAG pipelines with vector databases.",
  rag: "Nikky built a Multi-RAG System that queries multiple databases using vector embeddings and LLM-powered responses.",
  ocr: "The OCR system extracts structured data from government documents like Aadhaar, PAN, Passport using Tesseract & OpenCV.",
  chatbot:
    "This chatbot is built with keyword matching and AI — ask about any project or skill!",
  hire: "Nikky is available for opportunities! Email nkbisane@gmail.com or connect on LinkedIn.",
  thanks: "You're welcome! Feel free to explore more of the portfolio.",
  bye: "Goodbye! Thanks for visiting Nikky's portfolio. Have a great day! 🚀",
  help: "You can ask me about: skills, projects, experience, education, contact info, or any specific project name!",
};

export const architectureFlow = [
  { step: "Client Request", icon: "🌐", description: "User interacts with the portfolio" },
  { step: "React Frontend", icon: "⚛️", description: "Component-based UI rendering" },
  { step: "State Management", icon: "🔄", description: "React hooks & context" },
  { step: "Data Layer", icon: "📊", description: "Static data & local processing" },
  { step: "AI Chatbot", icon: "🤖", description: "Keyword-based intelligent responses" },
  { step: "Responsive UI", icon: "📱", description: "Adaptive cross-device layout" },
];
