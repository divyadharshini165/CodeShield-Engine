# CodeShield Engine — Complete (Pass 1 + Pass 2 + Dashboard Analytics)

Production-grade full-stack online coding judge and technical assessment platform.

## Design System — Cyber Purple Shield

| Token | Dark (default) | Light |
|---|---|---|
| Background | `#060509` / `#0d0b14` | `#f6f4fb` / `#ffffff` |
| Accent | `#a855f7` (purple) | `#9333ea` |
| Success | `#10b981` (emerald) | `#059669` |
| Danger | `#f43f5e` (crimson) | `#dc2626` |

All panels — Dashboard, Workspace, Leaderboard, Admin Panel, AI slide-out — share the same CSS variable token system. Dark/light toggle persisted to `localStorage`.

---

## Architecture

```
CodeShield-Engine/
├── backend/
│   ├── docker/Dockerfile          ← Multilingual runner image (Python/Node/GCC/JDK/Bash)
│   ├── execute/
│   │   ├── dockerExecutor.js      ← Docker sandbox (TLE/MLE, exit-137 catch, availability cache)
│   │   ├── executeCode.js         ← Routes to Docker or direct subprocess (auto-fallback)
│   │   ├── generateFile.js        ← Per-job isolated directory
│   │   └── languageConfig.js      ← 6-language path-agnostic command matrix
│   ├── queue/
│   │   ├── connection.js          ← IORedis + availability check
│   │   ├── submissionQueue.js     ← BullMQ "submission-queue"
│   │   ├── gradingService.js      ← Shared grading logic (sync + async)
│   │   └── submissionWorker.js    ← BullMQ Worker (in-process or standalone)
│   ├── routes/
│   │   ├── authRoutes.js          ← JWT register / login / me
│   │   ├── problemRoutes.js       ← Problem list (tag + category filter), stats, single
│   │   ├── submissionRoutes.js    ← Submit → queue or sync, history, single
│   │   ├── leaderboardRoutes.js   ← MongoDB aggregation ranked leaderboard
│   │   ├── adminRoutes.js         ← RBAC CRUD (problems + submissions + users)
│   │   └── aiRoutes.js            ← Ollama SSE streaming (hint + review + status)
│   ├── models/
│   │   ├── User.js                ← username / email / bcrypt password / role / solvedProblems / solvedHistory / streak
│   │   ├── Problem.js             ← title / difficulty / category / tags[] / testCases[]
│   │   └── Submission.js          ← status (incl. MLE/Queued/Evaluating) / testCaseResults[]
│   ├── utils/
│   │   ├── jwt.js                 ← Sign / verify JWTs
│   │   └── streak.js              ← Daily coding-streak date math (consecutive/same-day/reset)
│   ├── seedData/
│   │   ├── easy.js                ← 40 Easy problems
│   │   ├── medium.js              ← 35 Medium problems
│   │   ├── hard_new.js + hard_extra.js ← 25 Hard problems
│   │   └── tagMap.js              ← Category defaults + title-level tag overrides
│   ├── socket.js                  ← Socket.io (submission rooms + leaderboard broadcast)
│   └── server.js                  ← HTTP + Socket.io + in-process Worker
└── frontend/
    ├── src/
    │   ├── api/axios.js + socket.js
    │   ├── context/ AuthContext + ThemeContext
    │   ├── pages/
    │   │   ├── Dashboard.jsx      ← Stats, streak flame, progression graph, verdict/language breakdown, multi-tag filter
    │   │   ├── Workspace.jsx      ← Monaco, live grading, per-TC dots, AI Hint, AI Review panel
    │   │   ├── Leaderboard.jsx    ← Real-time ranked (auto-refreshes on AC)
    │   │   ├── AdminPanel.jsx     ← RBAC CRUD: problems (incl. tags), submissions log, users
    │   │   ├── Login.jsx + Signup.jsx
    │   └── components/
    │       ├── Navbar.jsx                 ← Theme toggle, Leaderboard link, Admin link (admin only)
    │       ├── VerdictBadge.jsx           ← Full verdict set incl. MLE / Queued / Evaluating
    │       ├── SolvedChallengesModal.jsx  ← Solved list + difficulty breakdown + streak (clickable stat card)
    │       └── ProgressionChart.jsx       ← Recharts cumulative solved-over-time area chart
    └── index.css                  ← Cyber Purple CSS variables
```

---

## Dashboard Analytics (latest update)

| Feature | Where |
|---|---|
| Clickable "Your Solved Challenges" card | `Dashboard.jsx` — purple glow hover/border, opens `SolvedChallengesModal` |
| Solved problem list with deep links | `SolvedChallengesModal.jsx` — click any title to jump back into that Workspace |
| Easy/Medium/Hard breakdown (solved vs total) | `GET /api/auth/me` → `stats.difficultyBreakdown`, rendered inside the modal |
| Daily coding streak (🔥 + count) | `utils/streak.js` (date logic) + `queue/gradingService.js` (updates on every Accepted verdict) → `stats.streak` |
| Cumulative solved-over-time graph | `GET /api/auth/me` → `stats.solvedTimeline`, rendered via `ProgressionChart.jsx` (Recharts) |

**Streak rules:** same calendar day → unchanged · next consecutive day → +1 · a missed day → resets to 1 · `longestStreak` is preserved across resets. Dates are compared as UTC `YYYY-MM-DD` strings to avoid timezone edge cases.

**Problem deletion safety:** deleting a problem from the Admin Panel now also pulls it out of every user's `solvedProblems`/`solvedHistory`, keeping the solved-count, difficulty breakdown, and progression graph accurate.

---

## Prerequisites

| Dependency | Required | Notes |
|---|---|---|
| Node.js 18+ | ✅ Always | |
| MongoDB | ✅ Always | |
| Redis 6+ | ⚡ Optional | Async queue + Socket.io live grading; falls back to sync |
| Docker Desktop | ⚡ Optional | Sandbox isolation; falls back to direct subprocess |
| `codeshield-runner` image | ⚡ With Docker | `docker build -t codeshield-runner -f backend/docker/Dockerfile backend/` |
| Ollama + model | ⚡ Optional | AI Hint + Code Review; routes return 503 if unavailable |

---

## Quick Start

### 1. Build Docker runner image (optional)
```bash
docker build -t codeshield-runner -f backend/docker/Dockerfile backend/
```

### 2. Start Redis (optional)
```bash
docker run -d -p 6379:6379 redis:7-alpine
```

### 3. Start Ollama AI (optional)
```bash
ollama serve
ollama pull deepseek-r1:1.5b
```

### 4. Backend
```bash
cd backend
npm install
cp .env.example .env       # set MONGO_URI, JWT_SECRET at minimum
npm run seed               # inserts 100 tagged problems (40E / 35M / 25H)
npm start                  # API + Socket.io on http://localhost:5000
```

### 5. Frontend
```bash
cd frontend
npm install
npm run dev                # Vite dev server on http://localhost:5173
```

---

## API Surface

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register → JWT |
| POST | `/api/auth/login` | — | Login → JWT |
| GET | `/api/auth/me` | JWT | Profile + analytics (incl. streak, difficulty breakdown, solved timeline) |
| POST | `/api/auth/make-admin` | JWT | Self-promote using `ADMIN_PROMOTION_SECRET` |
| GET | `/api/problems` | — | List (`?difficulty=`, `?category=`, `?tags=`) |
| GET | `/api/problems/stats` | — | Verdict breakdown + language stats |
| GET | `/api/problems/:id` | — | Single problem (no hidden test cases) |
| POST | `/api/submissions` | optional | Submit → queue (202) or sync grade |
| GET | `/api/submissions` | optional | History |
| GET | `/api/submissions/:id` | optional | Detail + per-TC trace |
| GET | `/api/leaderboard` | — | Ranked by solved / AC% |
| GET | `/api/admin/problems` | admin | All problems incl. test cases |
| POST | `/api/admin/problems` | admin | Create problem |
| PUT | `/api/admin/problems/:id` | admin | Update problem |
| DELETE | `/api/admin/problems/:id` | admin | Delete + cascade submissions |
| GET | `/api/admin/submissions` | admin | Global paginated log |
| GET | `/api/admin/users` | admin | All users |
| PATCH | `/api/admin/users/:id/role` | admin | Promote / demote admin |
| GET | `/api/admin/stats` | admin | Per-day submission activity |
| POST | `/api/ai/hint` | optional | Stream SSE hint (Ollama) |
| POST | `/api/ai/review` | optional | Stream SSE code review (Ollama) |
| GET | `/api/ai/status` | — | Ollama availability check |

---

## Promoting a User to Admin

**Recommended — bootstrap endpoint (no DB access required):**

First register/login normally to get a JWT, then call `make-admin` **as that user**
(it promotes whoever the Bearer token belongs to):
```bash
curl -X POST http://localhost:5000/api/auth/make-admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your JWT from /api/auth/login>" \
  -d '{"secret": "<your ADMIN_PROMOTION_SECRET from .env>"}'
```
This uses the `ADMIN_PROMOTION_SECRET` set in `backend/.env`. Rotate or remove it after
bootstrapping your first admin — every admin after that can be promoted from the Admin
Panel's own "Promote to Admin" control instead.

**Alternative — direct database access:**
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

> **Security note:** if `ADMIN_PROMOTION_SECRET` is unset, the endpoint falls back to a
> hardcoded default (`codeshield-admin-secret`). Always set a real secret in `.env`
> before deploying anywhere reachable by untrusted users.
