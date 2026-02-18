/* ═══════════════════════════════════════════════════════════
   AI DEVELOPER PORTFOLIO - Main JavaScript
   Handles animations, chatbot, contact form, meteors, floating icons
   ═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    initPageLoader();
    initParticles();
    initMeteors();
    initFloatingIcons();
    initCustomCursor();
    initScrollProgress();
    initTypewriter();
    initNavbar();
    initScrollAnimations();
    initSectionSpotlight();
    initStatCounters();
    initButtonRipple();
    initParticleBurst();
    initBackToTop();
    initCardTilt();
    initHeroMouseReactive();
    initTextReveal();
    initMagneticButtons();
    initCodeRain();
    initConstellation();
    initHolographicCards();
    initGlitchTitles();
    initConfetti();
    initStatRings();
    initChatbot();
    initContactForm();
    loadProjects();
});


/* ─── Background Particles ───────────────────────────────── */

function initParticles() {
    const container = document.querySelector(".bg-particles");
    if (!container) return;

    const colors = ["#7c3aed", "#06b6d4", "#ec4899", "#10b981", "#f59e0b"];

    for (let i = 0; i < 40; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        particle.style.left = Math.random() * 100 + "%";
        particle.style.animationDelay = Math.random() * 8 + "s";
        particle.style.animationDuration = 6 + Math.random() * 6 + "s";
        particle.style.width = particle.style.height = (1 + Math.random() * 3) + "px";
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(particle);
    }
}


/* ─── Meteor / Shooting Stars ────────────────────────────── */

function initMeteors() {
    function spawnMeteor() {
        const meteor = document.createElement("div");
        meteor.classList.add("meteor");

        const colorClasses = ["purple", "cyan", "pink", "orange"];
        meteor.classList.add(colorClasses[Math.floor(Math.random() * colorClasses.length)]);

        meteor.style.left = Math.random() * 100 + "%";
        meteor.style.top = "-80px";
        meteor.style.height = (60 + Math.random() * 80) + "px";

        const duration = 1 + Math.random() * 1.5;
        meteor.style.animationDuration = duration + "s";

        document.body.appendChild(meteor);

        setTimeout(() => {
            meteor.remove();
        }, duration * 1000 + 200);
    }

    // Spawn meteors at random intervals
    function scheduleMeteor() {
        spawnMeteor();
        setTimeout(scheduleMeteor, 1500 + Math.random() * 3000);
    }

    // Start after a short delay
    setTimeout(scheduleMeteor, 1000);
}


/* ─── Floating Tech Icons ────────────────────────────────── */

function initFloatingIcons() {
    const container = document.querySelector(".floating-icons");
    if (!container) return;

    const icons = [
        "\u{1F40D}", // python snake
        "\u26A1",     // lightning (FastAPI)
        "\u{1F5C4}",  // file cabinet (DB)
        "\u{1F9E0}", // brain (AI)
        "\u{1F4BB}", // laptop
        "\u{1F517}", // link (API)
        "\u{1F310}", // globe
        "\u{1F4CA}", // chart
        "\u{1F527}", // wrench
        "\u{1F680}", // rocket
        "\u{1F50D}", // magnifying glass
        "\u{1F916}", // robot
        "\u2728",     // sparkles
        "\u{1F4E7}", // email
        "\u{1F512}", // lock (security)
    ];

    function spawnIcon() {
        const icon = document.createElement("div");
        icon.classList.add("floating-icon");
        icon.textContent = icons[Math.floor(Math.random() * icons.length)];
        icon.style.left = Math.random() * 100 + "%";

        const duration = 15 + Math.random() * 20;
        icon.style.animationDuration = duration + "s";
        icon.style.animationDelay = Math.random() * 5 + "s";
        icon.style.fontSize = (1 + Math.random() * 0.8) + "rem";

        const glowColors = [
            "rgba(124, 58, 237, 0.4)",
            "rgba(6, 182, 212, 0.4)",
            "rgba(236, 72, 153, 0.4)",
            "rgba(16, 185, 129, 0.4)",
            "rgba(245, 158, 11, 0.4)",
        ];
        icon.style.filter = `drop-shadow(0 0 8px ${glowColors[Math.floor(Math.random() * glowColors.length)]})`;

        container.appendChild(icon);

        setTimeout(() => {
            icon.remove();
        }, (duration + 5) * 1000);
    }

    // Spawn initial batch
    for (let i = 0; i < 8; i++) {
        setTimeout(() => spawnIcon(), i * 800);
    }

    // Keep spawning
    setInterval(spawnIcon, 3000);
}


/* ─── Navbar ─────────────────────────────────────────────── */

function initNavbar() {
    const navbar = document.querySelector(".navbar");
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-links a");

    // Scroll effect
    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    });

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("open");
        });
    }

    // Close mobile menu on link click
    links.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll("section[id]");
    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (link) {
                link.classList.toggle("active", scrollY >= top && scrollY < top + height);
            }
        });
    });
}


/* ─── Scroll Animations (Intersection Observer) ──────────── */

function initScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".fade-in, .fade-in-left, .fade-in-right").forEach(el => {
        observer.observe(el);
    });
}


/* ─── Chatbot ────────────────────────────────────────────── */

function initChatbot() {
    const input = document.getElementById("chatInput");
    const sendBtn = document.getElementById("chatSend");
    const messages = document.getElementById("chatMessages");

    if (!input || !sendBtn || !messages) return;

    // Send on button click
    sendBtn.addEventListener("click", () => sendMessage());

    // Send on Enter key
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Suggestion chips
    document.querySelectorAll(".chat-suggestion").forEach(chip => {
        chip.addEventListener("click", () => {
            input.value = chip.textContent;
            sendMessage();
        });
    });
}


async function sendMessage() {
    const input = document.getElementById("chatInput");
    const messages = document.getElementById("chatMessages");
    const sendBtn = document.getElementById("chatSend");
    const message = input.value.trim();

    if (!message) return;

    // Disable input while processing
    input.value = "";
    sendBtn.disabled = true;

    // Add user message
    appendMessage(message, "user");

    // Show typing indicator
    const typingEl = showTyping();

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();

        // Remove typing indicator
        typingEl.remove();

        // Add bot response
        appendMessage(data.response, "bot");

    } catch (error) {
        typingEl.remove();
        appendMessage("Sorry, I'm having trouble connecting. Please try again.", "bot");
    }

    sendBtn.disabled = false;
    input.focus();
}


function appendMessage(text, type) {
    const messages = document.getElementById("chatMessages");
    const div = document.createElement("div");
    div.classList.add("chat-message", type);

    const label = document.createElement("span");
    label.classList.add("msg-label");
    label.textContent = type === "bot" ? "Bot" : "You";

    div.appendChild(label);
    div.appendChild(document.createTextNode(text));
    messages.appendChild(div);

    // Scroll to bottom
    messages.scrollTop = messages.scrollHeight;
}


function showTyping() {
    const messages = document.getElementById("chatMessages");
    const typing = document.createElement("div");
    typing.classList.add("chat-typing");
    typing.innerHTML = "<span></span><span></span><span></span>";
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
    return typing;
}


/* ─── Contact Form ───────────────────────────────────────── */

function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const statusEl = document.getElementById("formStatus");
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        const formData = {
            name: form.querySelector('[name="name"]').value,
            email: form.querySelector('[name="email"]').value,
            subject: form.querySelector('[name="subject"]').value,
            message: form.querySelector('[name="message"]').value,
        };

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                statusEl.textContent = data.message;
                statusEl.className = "form-status success";
                form.reset();
            } else {
                const errorMsg = data.detail
                    ? (Array.isArray(data.detail)
                        ? data.detail.map(d => d.msg).join(", ")
                        : data.detail)
                    : "Something went wrong. Please try again.";
                statusEl.textContent = errorMsg;
                statusEl.className = "form-status error";
            }
        } catch (error) {
            statusEl.textContent = "Connection error. Please try again later.";
            statusEl.className = "form-status error";
        }

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Hide status after 5 seconds
        setTimeout(() => {
            statusEl.className = "form-status";
        }, 5000);
    });
}


/* ─── Load Projects from API ─────────────────────────────── */

const PROJECT_ICONS = [
    "\u2709\uFE0F",  // 1. AutoMail - envelope
    "\u2708\uFE0F",  // 2. Travel Reminder - airplane
    "\u{1F3E8}",     // 3. Hotel Blocking - hotel
    "\u{1F4C5}",     // 4. Hotel Reconfirmation - calendar
    "\u{1F510}",     // 5. File Access - lock
    "\u{1F4C4}",     // 6. OCR - document
    "\u{1F33E}",     // 7. AgriStack - rice
    "\u{1F916}",     // 8. Multi-RAG - robot
];

async function loadProjects() {
    const container = document.getElementById("projectsGrid");
    if (!container) return;

    try {
        const response = await fetch("/api/projects");
        const projects = await response.json();

        container.innerHTML = projects.map((project, index) => `
            <div class="project-card fade-in">
                <div class="project-header">
                    <div class="project-icon">${PROJECT_ICONS[index] || '\u{1F4BB}'}</div>
                    <h3>${escapeHtml(project.title)}</h3>
                    <p class="description">${escapeHtml(project.description)}</p>
                </div>
                <div class="project-body">
                    <ul class="project-features">
                        ${project.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
                    </ul>
                    <div class="project-tech">
                        ${project.tech_stack.map(t => `<span class="project-tech-tag">${escapeHtml(t)}</span>`).join('')}
                    </div>
                    ${project.architecture ? `
                    <div class="project-architecture">
                        <div class="arch-label">Architecture</div>
                        <p>${escapeHtml(project.architecture)}</p>
                    </div>` : ''}
                </div>
                <div class="project-footer">
                    ${project.github_url ? `<a href="${escapeHtml(project.github_url)}" class="btn btn-ghost" target="_blank">GitHub \u2192</a>` : ''}
                    ${project.live_url ? `<a href="${escapeHtml(project.live_url)}" class="btn btn-ghost" target="_blank">Live Demo \u2192</a>` : ''}
                </div>
            </div>
        `).join('');

        // Re-observe new elements for animation
        initScrollAnimations();

    } catch (error) {
        console.error("Failed to load projects:", error);
    }
}


/* ─── Custom Glowing Cursor ──────────────────────────────── */

function initCustomCursor() {
    const glow = document.getElementById("cursorGlow");
    const trail = document.getElementById("cursorTrail");
    if (!glow || !trail) return;

    // Only on desktop
    if (window.matchMedia("(max-width: 480px)").matches) return;

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glow.style.left = mouseX + "px";
        glow.style.top = mouseY + "px";
    });

    // Smooth trail follow
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.08;
        trailY += (mouseY - trailY) * 0.08;
        trail.style.left = trailX + "px";
        trail.style.top = trailY + "px";
        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Enlarge cursor on interactive elements
    document.querySelectorAll("a, button, .tech-tag, .chat-suggestion, .project-card").forEach(el => {
        el.addEventListener("mouseenter", () => glow.classList.add("hover"));
        el.addEventListener("mouseleave", () => glow.classList.remove("hover"));
    });
}


/* ─── Scroll Progress Bar ────────────────────────────────── */

function initScrollProgress() {
    const progressBar = document.getElementById("scrollProgress");
    if (!progressBar) return;

    window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = progress + "%";
    });
}


/* ─── Typewriter Effect ──────────────────────────────────── */

function initTypewriter() {
    const el = document.getElementById("typewriter");
    if (!el) return;

    const phrases = [
        "AI Backend Developer",
        "FastAPI Engineer",
        "Python Developer",
        "API Architect",
        "RAG System Builder",
        "OCR & ML Engineer",
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            el.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentPhrase.length) {
            speed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 500; // Pause before next phrase
        }

        setTimeout(type, speed);
    }

    type();
}


/* ─── Animated Stat Counters ─────────────────────────────── */

function initStatCounters() {
    const counters = document.querySelectorAll(".stat-number[data-count]");
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 2000;
    const startTime = performance.now();

    el.classList.add("counting");

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        if (target >= 10000) {
            el.textContent = current.toLocaleString() + suffix;
        } else {
            el.textContent = current + suffix;
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target.toLocaleString() + suffix;
            el.classList.remove("counting");
        }
    }

    requestAnimationFrame(update);
}


/* ─── Button Ripple Effect ───────────────────────────────── */

function initButtonRipple() {
    document.querySelectorAll(".btn").forEach(btn => {
        btn.addEventListener("click", function(e) {
            const ripple = document.createElement("span");
            ripple.classList.add("ripple");

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + "px";
            ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
            ripple.style.top = (e.clientY - rect.top - size / 2) + "px";

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}


/* ─── Back to Top Button ─────────────────────────────────── */

function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    window.addEventListener("scroll", () => {
        btn.classList.toggle("visible", window.scrollY > 500);
    });

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


/* ─── Card Tilt Effect on Hover ──────────────────────────── */

function initCardTilt() {
    // Only on desktop
    if (window.matchMedia("(max-width: 768px)").matches) return;

    document.querySelectorAll(".tech-category, .arch-detail-card").forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}


/* ─── Page Loader ────────────────────────────────────────── */

function initPageLoader() {
    const loader = document.getElementById("pageLoader");
    if (!loader) return;

    setTimeout(() => {
        loader.classList.add("hidden");
        document.body.classList.remove("loading");
        document.body.classList.add("loaded");
    }, 2200);
}


/* ─── Section Spotlight Effect ───────────────────────────── */

function initSectionSpotlight() {
    document.querySelectorAll(".section").forEach(section => {
        const spotlight = document.createElement("div");
        spotlight.classList.add("spotlight");
        section.appendChild(spotlight);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle("in-view", entry.isIntersecting);
        });
    }, { threshold: 0.2 });

    document.querySelectorAll(".section").forEach(s => observer.observe(s));
}


/* ─── Particle Burst on Button Click ─────────────────────── */

function initParticleBurst() {
    document.querySelectorAll(".btn-primary, .chat-send").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const colors = ["#8b5cf6", "#22d3ee", "#f472b6", "#34d399", "#fbbf24"];
            const burst = document.createElement("div");
            burst.classList.add("particle-burst");
            burst.style.left = e.clientX + "px";
            burst.style.top = e.clientY + "px";

            for (let i = 0; i < 12; i++) {
                const p = document.createElement("div");
                p.classList.add("burst-particle");
                const angle = (Math.PI * 2 * i) / 12;
                const distance = 40 + Math.random() * 60;
                p.style.setProperty("--tx", Math.cos(angle) * distance + "px");
                p.style.setProperty("--ty", Math.sin(angle) * distance + "px");
                p.style.background = colors[Math.floor(Math.random() * colors.length)];
                p.style.width = p.style.height = (3 + Math.random() * 4) + "px";
                burst.appendChild(p);
            }

            document.body.appendChild(burst);
            setTimeout(() => burst.remove(), 900);
        });
    });
}


/* ─── Hero Mouse Reactive Orbs ───────────────────────────── */

function initHeroMouseReactive() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const orbs = hero.querySelectorAll(".hero-orb");
    if (!orbs.length) return;

    hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        orbs.forEach((orb, i) => {
            const speed = (i + 1) * 15;
            orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
}


/* ─── Text Reveal Animation ──────────────────────────────── */

function initTextReveal() {
    const heroName = document.querySelector(".hero-name .highlight");
    if (!heroName) return;

    const text = heroName.textContent;
    heroName.innerHTML = "";
    heroName.classList.add("text-reveal");

    text.split("").forEach((char, i) => {
        const span = document.createElement("span");
        span.classList.add("char");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.transitionDelay = (0.3 + i * 0.05) + "s";
        heroName.appendChild(span);
    });

    // Trigger after a short delay (after page load)
    setTimeout(() => {
        heroName.classList.add("revealed");
    }, 500);
}


/* ─── Magnetic Buttons ───────────────────────────────────── */

function initMagneticButtons() {
    if (window.matchMedia("(max-width: 768px)").matches) return;

    document.querySelectorAll(".btn-primary, .btn-secondary").forEach(btn => {
        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-3px)`;
        });

        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "";
        });
    });
}


/* ─── Code Rain (Matrix-style Python keywords) ──────────── */

function initCodeRain() {
    const canvas = document.getElementById("codeRain");
    if (!canvas) return;

    // Skip on mobile
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const keywords = [
        "def", "class", "import", "return", "async", "await",
        "FastAPI", "SQLite", "Python", "Pydantic", "if", "else",
        "for", "in", "try", "except", "with", "yield", "lambda",
        "self", "None", "True", "False", "api", "query", "db",
        "get", "post", "put", "delete", "json", "dict", "list",
    ];

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    // Random start positions for variety
    for (let i = 0; i < drops.length; i++) {
        drops[i] = Math.random() * -100;
    }

    const colors = [
        "rgba(34, 211, 238, ",   // cyan
        "rgba(139, 92, 246, ",   // purple
        "rgba(52, 211, 153, ",   // green
        "rgba(244, 114, 182, ",  // pink
    ];

    function draw() {
        // Semi-transparent black to create fade trail
        ctx.fillStyle = "rgba(6, 7, 13, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = fontSize + "px JetBrains Mono, monospace";

        for (let i = 0; i < drops.length; i++) {
            const word = keywords[Math.floor(Math.random() * keywords.length)];
            const colorBase = colors[i % colors.length];
            const alpha = 0.3 + Math.random() * 0.4;
            ctx.fillStyle = colorBase + alpha + ")";

            ctx.fillText(word, i * fontSize, drops[i] * fontSize);

            // Reset drop to top when it goes below screen
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i] += 0.5 + Math.random() * 0.5;
        }
    }

    setInterval(draw, 50);
}


/* ─── Mouse Constellation Trail ─────────────────────────── */

function initConstellation() {
    const canvas = document.getElementById("constellation");
    if (!canvas) return;

    // Skip on mobile
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const dots = [];
    const maxDots = 25;
    const connectDistance = 120;

    document.addEventListener("mousemove", (e) => {
        dots.push({
            x: e.clientX,
            y: e.clientY,
            life: 1,
            size: 2 + Math.random() * 2,
        });

        // Limit dots
        if (dots.length > maxDots) {
            dots.shift();
        }
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw dots
        for (let i = dots.length - 1; i >= 0; i--) {
            dots[i].life -= 0.015;

            if (dots[i].life <= 0) {
                dots.splice(i, 1);
                continue;
            }

            // Draw dot
            ctx.beginPath();
            ctx.arc(dots[i].x, dots[i].y, dots[i].size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${dots[i].life * 0.6})`;
            ctx.fill();

            // Connect nearby dots
            for (let j = i - 1; j >= 0; j--) {
                const dx = dots[i].x - dots[j].x;
                const dy = dots[i].y - dots[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectDistance) {
                    const alpha = (1 - dist / connectDistance) * Math.min(dots[i].life, dots[j].life) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(dots[i].x, dots[i].y);
                    ctx.lineTo(dots[j].x, dots[j].y);
                    ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}


/* ─── Holographic Card Sheen ────────────────────────────── */

function initHolographicCards() {
    // Only on desktop
    if (window.matchMedia("(max-width: 768px)").matches) return;

    // Watch for dynamically loaded project cards
    const observer = new MutationObserver(() => {
        const cards = document.querySelectorAll(".project-card:not([data-holo])");
        cards.forEach(card => {
            card.setAttribute("data-holo", "true");
            card.style.position = "relative";
            card.style.overflow = "hidden";

            const sheen = document.createElement("div");
            sheen.classList.add("holo-sheen");
            card.appendChild(sheen);

            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                sheen.style.backgroundPosition = `${x}% ${y}%`;
                sheen.style.opacity = "1";
            });

            card.addEventListener("mouseleave", () => {
                sheen.style.opacity = "0";
            });
        });
    });

    observer.observe(document.getElementById("projectsGrid") || document.body, {
        childList: true,
        subtree: true,
    });
}


/* ─── Periodic Glitch on Section Titles ─────────────────── */

function initGlitchTitles() {
    const titles = document.querySelectorAll(".section-title");

    titles.forEach(title => {
        title.setAttribute("data-text", title.textContent);
    });

    function triggerGlitch() {
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        if (!randomTitle) return;

        randomTitle.classList.add("glitch");
        setTimeout(() => {
            randomTitle.classList.remove("glitch");
        }, 300);
    }

    // Glitch every 4-8 seconds
    function scheduleGlitch() {
        triggerGlitch();
        setTimeout(scheduleGlitch, 4000 + Math.random() * 4000);
    }

    setTimeout(scheduleGlitch, 3000);
}


/* ─── Confetti Easter Egg ───────────────────────────────── */

function initConfetti() {
    // Trigger confetti when clicking the hero name
    const heroName = document.querySelector(".hero-name");
    if (!heroName) return;

    let clickCount = 0;

    heroName.addEventListener("click", () => {
        clickCount++;
        if (clickCount >= 3) {
            burstConfetti();
            clickCount = 0;
        }
    });
}

function burstConfetti() {
    const colors = ["#8b5cf6", "#22d3ee", "#f472b6", "#34d399", "#fbbf24", "#fb7185", "#60a5fa"];
    const shapes = ["square", "circle", "strip"];

    for (let i = 0; i < 80; i++) {
        const piece = document.createElement("div");
        piece.classList.add("confetti-piece");
        piece.classList.add(shapes[Math.floor(Math.random() * shapes.length)]);
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = (20 + Math.random() * 60) + "vw";
        piece.style.top = "-10px";
        piece.style.animationDuration = (2 + Math.random() * 3) + "s";
        piece.style.animationDelay = Math.random() * 0.5 + "s";

        document.body.appendChild(piece);

        setTimeout(() => piece.remove(), 5500);
    }
}


/* ─── Stat Rings (SVG progress circles) ─────────────────── */

function initStatRings() {
    const statItems = document.querySelectorAll(".stat-item");
    if (!statItems.length) return;

    // SVG gradient defs - inject once
    const svgDefs = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgDefs.style.position = "absolute";
    svgDefs.style.width = "0";
    svgDefs.style.height = "0";
    svgDefs.innerHTML = `
        <defs>
            <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#22d3ee"/>
                <stop offset="100%" stop-color="#8b5cf6"/>
            </linearGradient>
            <linearGradient id="grad-pink" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#f472b6"/>
                <stop offset="100%" stop-color="#fb7185"/>
            </linearGradient>
            <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#34d399"/>
                <stop offset="100%" stop-color="#22d3ee"/>
            </linearGradient>
        </defs>
    `;
    document.body.appendChild(svgDefs);

    // Percentages for rings (mapped to stat items)
    const percentages = [80, 60, 95];

    statItems.forEach((item, index) => {
        const ring = document.createElement("div");
        ring.classList.add("stat-ring");

        const circumference = 188; // 2 * PI * 30 ≈ 188
        const fillClass = `ring-fill-${index + 1}`;
        const offset = circumference - (circumference * (percentages[index] || 75)) / 100;

        ring.innerHTML = `
            <svg viewBox="0 0 64 64">
                <circle class="ring-bg" cx="32" cy="32" r="30"/>
                <circle class="ring-fill ${fillClass}" cx="32" cy="32" r="30"
                    style="--offset: ${offset};"/>
            </svg>
        `;

        // Insert ring before the number
        const statNumber = item.querySelector(".stat-number");
        if (statNumber) {
            item.insertBefore(ring, statNumber);
        }
    });

    // Animate rings when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll(".ring-fill").forEach(circle => {
                    circle.classList.add("animated");
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statItems.forEach(item => observer.observe(item));
}


/* ─── Utility: HTML Escaping ─────────────────────────────── */

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
