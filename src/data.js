/* Portfolio content, kept in one place for easy future updates. */
export const NOISE_URI = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='180' height='180' filter='url(%23n)' opacity='0.4'/></svg>")`;

export const TOOLS = [
  { n: "01", name: "Python", icon: "python/3776AB", tag: "The language behind my AI systems.", cat: "lang" },
  { n: "02", name: "Java", icon: "openjdk/ED8B00", tag: "Strong foundations, structured thinking.", cat: "lang" },
  { n: "03", name: "C", icon: "c/A8B9CC", tag: "Close to the machine.", cat: "lang" },
  { n: "04", name: "SQL & SQLite", icon: "sqlite/003B57", tag: "Turning questions into useful data.", cat: "be" },
  { n: "05", name: "FastAPI", icon: "fastapi/009688", tag: "Fast, typed APIs for AI products.", cat: "be" },
  { n: "06", name: "OpenCV & OCR", icon: "opencv/5C3EE8", tag: "Teaching software to read and see.", cat: "ai" },
  { n: "07", name: "OpenAI API", icon: "openai/412991", tag: "Models connected to real workflows.", cat: "ai" },
  { n: "08", name: "Gemini API", icon: "googlegemini/8E75B2", tag: "Multimodal intelligence in products.", cat: "ai" },
  { n: "09", name: "RAG Pipelines", icon: null, tag: "Ground answers before generating them.", cat: "ai" },
  { n: "10", name: "Neural Networks", icon: null, tag: "Learning representations from data.", cat: "ai" },
  { n: "11", name: "Raspberry Pi", icon: "raspberrypi/A22846", tag: "Small hardware, always-on intelligence.", cat: "hw" },
  { n: "12", name: "Tailscale", icon: "tailscale/242424", tag: "Private remote access without friction.", cat: "hw" },
  { n: "13", name: "Unity", icon: "unity/FFFFFF", tag: "Interactive worlds driven by logic.", cat: "hw" },
  { n: "14", name: "Git", icon: "git/F05032", tag: "Every experiment stays reversible.", cat: "lang" },
  { n: "15", name: "GitHub", icon: "github/8B949E", tag: "Where the work lives.", cat: "lang" },
];

export const TABS = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI & Machine Learning" },
  { id: "be", label: "Backend & Data" },
  { id: "hw", label: "Hardware & Game Dev" },
  { id: "lang", label: "Languages & Tools" },
];

export const PROJECTS = [
  { title: "OpenClaw", sub: "MULTI-AGENT SYSTEM · RASPBERRY PI · TAILSCALE", img: "/assets/openclaw.jpg",
    href: "https://github.com/Okbatti", tag: "Python · OpenAI API · Raspberry Pi · Tailscale",
    metric: "4 specialist agents", metricSub: "research, finance, coding and trend analysis",
    body: "A private, low-cost AI team with a central orchestrator coordinating specialist agents. Deployed on a Raspberry Pi and reachable securely through Tailscale." },
  { title: "Browzie", sub: "AI WEBPAGE ASSISTANT · CHROME EXTENSION", img: "/assets/browzie.jpg",
    href: "https://github.com/Okbatti/Browzie_AI", tag: "Python · FastAPI · LLM APIs · Embeddings",
    metric: "Context-aware", metricSub: "webpage summaries and grounded Q&A",
    body: "An AI browser assistant that summarizes the page you are reading and answers questions with a lightweight RAG-style pipeline, response validation and private session-based context." },
  { title: "MedDoc", sub: "MEDICAL REPORT ANALYSIS · OCR · NLP", img: "/assets/meddoc.jpg",
    href: "https://github.com/Okbatti/MedDoc", tag: "Python · OCR · NLP · LLM APIs · FastAPI",
    metric: "Guardrailed AI", metricSub: "document-grounded answers, designed for safety",
    body: "Extracts information from uploaded medical reports and supports grounded Q&A. Safety guardrails reduce hallucinations and avoid unsafe medical advice." },
  { title: "Cube Collision", sub: "MOBILE GAME · PHYSICS · ALGORITHMS", img: "/assets/cube-game.jpg",
    href: "https://github.com/Okbatti/CubeCollision", tag: "Python · Game Logic · Vector Mathematics",
    metric: "Published", metricSub: "released on the Google Play Store",
    body: "A real-time physics game with vector-based collision detection and carefully optimized update loops for smooth, consistent play across devices." },
];

export const CHAPTERS = [
  { num: "2021", title: "St. Joseph's Boys' School", meta: "10th Grade · Computer Science", img: "/assets/owais-profile.png", body: "The foundation: curiosity, computers and learning how to solve problems." },
  { num: "2023", title: "Bishop Cotton Boys' School", meta: "12th Grade · Computer Science", img: "/assets/browzie.jpg", body: "Computer science became the path, not just another subject." },
  { num: "2023", title: "B.E. Computer Science - BMSCE", meta: "Expected May 2027 · Bengaluru", img: "/assets/openclaw.jpg", body: "Building a broad engineering base while going deep on AI, machine learning and products." },
  { num: "2024", title: "College Tech Fest - Event Coordinator", meta: "2nd among 100+ events · 500+ registrations", img: "/assets/cube-game.jpg", body: "Led a technical event and drove participation through coordination and outreach." },
  { num: "2025", title: "Neural Networks & Deep Learning", meta: "DeepLearning.AI · Andrew Ng", img: "/assets/meddoc.jpg", body: "Strengthened the theory behind the intelligent systems I wanted to build." },
  { num: "2026", title: "DeathScape 2.0 - Club Coordinator", meta: "Top event · 300+ participants", img: "/assets/owais-profile.png", body: "Managed the technical execution and participant flow for one of the fest's strongest events." },
];

export const EXPERIENCE = [
  { role: "Club Coordinator", org: "DeathScape, B.M.S. College of Engineering · Bengaluru", when: "APR 2026 - MAY 2026",
    points: [
      "Coordinated DeathScape 2.0, ranked among the top events out of more than 100 events at the fest.",
      "Managed the technical side and participant flow for 300+ participants, keeping execution smooth throughout the event.",
    ] },
  { role: "Event Coordinator", org: "College Tech Fest · Bengaluru", when: "NOV 2024 - DEC 2024",
    points: [
      "Organized and led a technical event that placed 2nd among more than 100 events.",
      "Drove 500+ participant registrations through coordination and outreach.",
    ] },
];
