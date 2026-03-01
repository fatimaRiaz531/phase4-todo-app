# TODO PRO - Professional Task Management System 🚀

A high-performance command center for developers managing complex task ecosystems. Built with Next.js, FastAPI, and Neon DB.

## 🌟 Features

- **Intelligent Dashboard**: Fully interactive UI with real-time sync.
- **AI Task Assistant**: natural language task management via OpenRouter (Gemini 2.0 Flash).
- **User Isolation**: Strict data segregation using Better Auth (JWT).
- **Professional Aesthetics**: Sleek Dark/Light mode support with Teal & Cyan accents.
- **Cloud Scale**: Serverless PostgreSQL (Neon) for persistent storage.

---

## 📋 Phase IV — Kubernetes Deployment (Spec-Driven)

> **Status:** Helm charts complete, deployment pending WSL2 cgroup fix

### What's Ready

| Component | Status | Location |
|-----------|--------|----------|
| Spec Document | ✅ Complete | `docs/phase4-specs.md` |
| Helm Chart | ✅ Complete | `charts/todo-app/` |
| Dockerfiles | ✅ Complete | `Dockerfile.frontend`, `Dockerfile.backend` |
| GitHub Repo | ✅ Pushed | https://github.com/fatimaRiaz531/phase4-todo-app |

### Deployment Commands (When Kubernetes is Available)

```bash
# Start Kubernetes (Docker Desktop or Minikube)
docker desktop kubernetes enable
# OR: minikube start

# Build images
docker build -f Dockerfile.frontend -t todo-frontend:latest .
docker build -f Dockerfile.backend -t todo-backend:latest .

# Deploy via Helm
helm install todo-app ./charts/todo-app --namespace todo --create-namespace

# Verify
kubectl get pods -n todo
kubectl get svc -n todo

# Access frontend
kubectl port-forward svc/todo-frontend 3000:3000 -n todo
```

### Known Issue

**WSL2 Cgroup Compatibility:** Docker Desktop Kubernetes fails to start on some Windows systems due to cgroup v1/v2 incompatibility. This is an environment limitation, not a code issue.

**Workaround:** Use Minikube standalone or deploy to a cloud Kubernetes service (GKE, EKS, AKS).

---

## 🛠️ Setup Instructions

### 1. Prerequisites

- Node.js (v18+)
- Python (3.9+)
- Neon Database Account (PostgreSQL)

### 2. Environment Configuration

Create a `.env` file in the **root** and **backend** directories:

**Backend (.env):**

```env
DATABASE_URL=postgresql://[user]:[password]@[host]/neondb?sslmode=require
OPENAI_API_KEY=sk-or-v1-... (OpenRouter Key)
BETTER_AUTH_JWT_SECRET=your-secure-secret
```

**Frontend (.env.local):**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_JWT_SECRET=your-secure-secret
```

### 3. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

_Running on http://localhost:8000_

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

_Running on http://localhost:3000_

## 🚀 Vercel Deployment

1. **GitHub**: Push your repository to GitHub.
2. **Vercel**: Create a new project and connect your repository.
3. **Env Vars**: Add all environment variables (Backend API URL, Database URL, etc.) in Vercel Dashboard.
4. **Build Settings**:
   - Framework: Next.js

   # TODO PRO - Phase II — Submission Ready

   This repository contains Phase II of the Todo Web App: a Next.js frontend and FastAPI backend with JWT-based authentication and Neon (Postgres) persistence.

   ## Quick Setup (Local)

   Prerequisites:
   - Node.js v18+
   - Python 3.11+
   - Neon or Postgres database
   1. Backend - Environment

   Create `backend/.env` with these values (example):

   ```env
   DATABASE_URL=postgresql+asyncpg://<user>:<pass>@<host>:5432/<db>
   BETTER_AUTH_JWT_SECRET=replace-with-a-secure-random-string
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   REFRESH_TOKEN_EXPIRE_DAYS=7
   FRONTEND_URL=http://localhost:3000
   ```

   2. Backend - Install & Run

   ```bash
   cd backend
   python -m venv .venv
   .\.venv\Scripts\activate   # Windows
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

   API: `http://localhost:8000/api/v1` (docs available at `/api/v1/docs`).
   3. Frontend - Install & Run

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Open `http://localhost:3000`.

   ## Vercel Deployment (Frontend)
   1. Push repo to GitHub.
   2. In Vercel, create a new project and connect the GitHub repo.
   3. Set environment variables on Vercel (Production):
      - `NEXT_PUBLIC_API_URL` → e.g. `https://your-backend.example.com`
   4. Build settings:
      - Framework: Next.js
      - Root Directory: `frontend`
   5. Vercel will auto-deploy on every push to `main`.

   ## Auth & Security
   - The backend issues JWT access tokens at `/api/v1/auth/login` and `/api/v1/auth/register` using `BETTER_AUTH_JWT_SECRET`.
   - Frontend stores the token in `localStorage.token` and user info in `localStorage.user` via `/auth-callback`.
   - All API requests include `Authorization: Bearer <token>` and the backend validates tokens and enforces user isolation.

   ## UI Polishing
   - Dashboard includes initial loading spinner and refresh-sync spinner.
   - Refresh button is disabled while sync runs.
   - Toggle and Delete buttons include `aria-label` attributes.

   ## 60-Second Demo Script

   See `DEMO_60_SECONDS.md` for a concise step-by-step demo script you can run during the presentation.

   ***

   Prepared for submission — Phase II is demo-ready.
