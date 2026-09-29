# Policy Drift Agent — Hindsight Cloud Persistent Memory

> **"An AI agent that learns when real-world operations repeatedly deviate from written company procedures, distinguishes legitimate exceptions from harmful drift, and helps organizations improve their procedures using accumulated experience."**
> A decision-support system that identifies deviations between
written organizational policies and real-world decisions,
while using Hindsight persistent memory to learn from
previous organizational experiences.

Production-ready AI hackathon application powered by **Hindsight Cloud Persistent Memory** (Vectorize.io) and **Groq LLM Reasoning**.

---

## 🌟 Overview & Architecture

Standard Operating Procedures (SOPs) are written down in company documentation, but real-world operations constantly evolve. When frontline teams execute workarounds or approve exceptions, organizations usually lose that context. Traditional LLMs and chatbots treat each query as an isolated conversation without persistent memory.

**Policy Drift Agent** uses **Hindsight Cloud** as its single source of truth for persistent organizational memory. Every operational case, process deviation, human decision, and outcome is stored in Hindsight Cloud. As new cases arrive, the agent recalls matching historical experiences from Hindsight Cloud to synthesize evidence-backed recommendations.

```text
React Frontend (TypeScript + Tailwind CSS)
      │
      │ REST API
      ▼
FastAPI Backend (Python 3.11 + Pydantic)
      │
      ├───► Groq LLM API (Llama 3.3 70B / Structured Reasoning)
      │
      └───► Hindsight Cloud API (Persistent Memory Bank)
```

---

## 🔒 Configuration & Zero-Credential Graceful Behavior

The application is built to handle missing API keys gracefully without crashing:
- If `HINDSIGHT_API_KEY` or `HINDSIGHT_BANK_ID` is missing, the backend starts normally, `/api/health` reports `hindsight_configured: false`, and the UI displays a clear setup banner explaining how to configure credentials.
- The application **does NOT fake Hindsight memory retention or recall** when credentials are missing. If an operation requires Hindsight Cloud and credentials are absent, the API returns a clear `503 Service Unavailable` status (`Hindsight Cloud is unconfigured`).
- When credentials are added to `backend/.env`, all `retain`, `recall`, and `timeline` operations execute directly against **Hindsight Cloud API**.

---

## 📁 Project Structure

```text
Policy Drift Agent/
├── .env.example                 # Root environment configuration guide
├── .gitignore                   # Excludes .env files while keeping .env.example
├── README.md                    # Complete documentation
│
├── backend/
│   ├── .env.example             # Backend environment placeholders
│   ├── requirements.txt         # Python dependencies
│   └── app/
│       ├── main.py              # FastAPI server entrypoint
│       ├── config.py            # Environment settings validation
│       ├── demo/
│       │   └── seed_data.py     # Demonstration seed cases for Hindsight retention
│       ├── models/
│       │   └── database.py      # SOP policy definitions store
│       ├── routes/
│       │   ├── health.py        # GET /api/health (service configuration status)
│       │   ├── policies.py      # GET /api/policies (SOP definitions)
│       │   ├── cases.py         # POST /api/cases/analyze & human decisions
│       │   ├── memory.py        # POST /api/memory/retain, /recall & /timeline
│       │   ├── insights.py      # GET /api/insights
│       │   ├── dashboard.py     # GET /api/dashboard (dynamic Hindsight stats)
│       │   └── demo.py          # Real Hindsight demo bank controllers
│       ├── schemas/             # Pydantic data schemas
│       └── services/
│           ├── hindsight_service.py  # Hindsight Cloud API client (Retain, Recall, List)
│           ├── groq_service.py       # Groq LLM API client
│           ├── policy_service.py     # Process step comparison engine
│           ├── analysis_service.py   # 5-stage case analysis orchestrator
│           └── insight_service.py    # Policy drift pattern detector
│
└── frontend/
    ├── .env.example             # Frontend API configuration
    ├── package.json             # React dependencies
    └── src/
        ├── App.tsx              # Main container with theme & configuration banner
        ├── services/
        │   └── api.ts           # Backend REST API client
        ├── components/
        │   ├── Navbar.tsx       # Navigation header & Hindsight status badge
        │   ├── ThemeToggle.tsx  # Dark / Light theme toggle
        │   ├── MetricCard.tsx   # Reusable KPI card
        │   ├── StageLoader.tsx  # 5-stage analysis loader
        │   └── Badge.tsx        # Risk & status badges
        └── pages/
            ├── DashboardPage.tsx       # KPI overview & visual memory flow
            ├── PolicyLibraryPage.tsx   # Scannable SOP library
            ├── PolicyDetailPage.tsx    # Visual workflow map with step deviations
            ├── AnalyzeCasePage.tsx     # 2-column case submission & presets
            ├── RecommendationView.tsx  # AI recommendation & human decision recorder
            ├── MemoryTimelinePage.tsx  # Retained Hindsight Cloud memories
            ├── LearningInsightsPage.tsx# Policy drift pattern cards
            └── DemoLearningJourneyPage.tsx # 3-stage interactive Hindsight demo
```

---

## ⚙️ Environment Setup & Credentials Instructions

1. Copy `.env.example` to `.env` in the root, `backend/`, and `frontend/` folders:
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. Open `backend/.env` and add your API keys:
   ```env
   # Application Execution Mode ('production')
   APP_MODE=production

   # Groq LLM API Key (https://console.groq.com)
   GROQ_API_KEY=your_actual_groq_api_key_here
   GROQ_MODEL=llama-3.3-70b-versatile

   # Hindsight Cloud API Settings (https://vectorize.io)
   HINDSIGHT_API_KEY=your_actual_hindsight_api_key_here
   HINDSIGHT_API_URL=https://api.hindsight.vectorize.io
   HINDSIGHT_BANK_ID=policy-drift-memory-bank-01
   ```

---

## 🚀 Running Locally

### 1. Start the Backend Server (FastAPI)

```bash
cd backend

# Create and activate Python virtual environment
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
# source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```
- Backend API will be live at: `http://localhost:8000`
- Interactive Swagger docs: `http://localhost:8000/docs`

### 2. Start the Frontend Web Application (React + Vite)

In a second terminal window:

```bash
cd frontend

# Install dependencies (if needed)
npm install

# Start Vite dev server
npm run dev
```
- Open browser at: `http://localhost:3000` (or `http://localhost:5173`)

---

## 🎬 3-Stage Hindsight Demo Walkthrough

Navigate to **"Demo Journey"** in the header navigation:

1. **Stage 1 — Zero Memory State**:
   - Click `1. Test Zero-Memory State`.
   - Clears memory bank and queries Hindsight Cloud for the test scenario.
   - Hindsight returns `0 memories`. The agent conservatively defaults to strict SOP enforcement (`Reject Exception / Enforce SOP`).

2. **Stage 2 — Build Hindsight Memory**:
   - Click `2. Build Hindsight Memory`.
   - Retains 8 historical operational cases, human decisions, and outcomes directly into Hindsight Cloud via `hindsight_service.retain_experience(...)`.
   - Displays real-time retention count (`Retained 8 experiences into Hindsight Cloud bank`).

3. **Stage 3 — Learn From Memory**:
   - Click `3. Test Post-Memory State`.
   - Queries Hindsight Cloud recall endpoint (`POST /banks/{bank_id}/recall`).
   - Hindsight Cloud recalls 6 historical experiences with 100% positive outcomes.
   - The agent recognizes a **Recurring Exception Pattern** and recommends approving alternative verification!

---
## Features

- Policy analysis
- Operational drift detection
- Hindsight persistent memory
- Historical case recall
- Evidence-based recommendations
- Zero-memory vs post-memory learning demo

## 🧪 Verification & Acceptance Tests

1. **Test 1 — No Credentials**:
   - Backend starts without crashing. `/api/health` returns `hindsight_configured: false`. The frontend displays setup warning banner.
2. **Test 2 — Memory Retention (With Credentials)**:
   - Save a human decision on a case. The experience is posted directly to Hindsight Cloud.
3. **Test 3 — Backend Restart Persistence**:
   - Restart the backend server. Open **Memory Timeline**. Retained experiences remain visible because they are fetched live from Hindsight Cloud, proving state is not local process memory.


## Outputs
<img width="1080" height="513" alt="image" src="https://github.com/user-attachments/assets/ea0112b4-8ae6-4e69-8af6-bcd131a52ac3" />
<img width="1080" height="517" alt="image" src="https://github.com/user-attachments/assets/74adcdea-0298-46e5-a27b-e87b2c933662" />
<img width="1080" height="513" alt="image" src="https://github.com/user-attachments/assets/7513709d-67e2-46d5-af2f-5325b752ab79" />
<img width="1080" height="511" alt="image" src="https://github.com/user-attachments/assets/bd6395db-40f6-420f-a47b-ca60a87e5ce5" />
<img width="1080" height="507" alt="image" src="https://github.com/user-attachments/assets/4083b554-30e0-42cc-b5a1-f1f60a92ebd2" />
<img width="1080" height="507" alt="image" src="https://github.com/user-attachments/assets/ab64ab0b-403f-4720-8da0-76bcc212926a" />






