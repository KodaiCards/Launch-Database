# Launch Fiber Services — Project Management System

## Deploy to Railway

### Step 1 — Create Railway Account
Go to railway.com, sign up, upgrade to Hobby ($5/month).

### Step 2 — Upload this project
Option A (easiest): Push to a GitHub repo, then connect Railway to that repo.
Option B: Install Railway CLI (`npm i -g @railway/cli`), run `railway login` then `railway up`.

### Step 3 — Add PostgreSQL
In Railway dashboard: New → Database → PostgreSQL.
Railway automatically sets the `DATABASE_URL` environment variable.

### Step 4 — Add Environment Variables
In Railway dashboard → your service → Variables, add:
- `ANTHROPIC_API_KEY` = your key from console.anthropic.com
- `NODE_ENV` = production
- `UPLOAD_DIR` = /data/uploads

### Step 5 — Add a Volume (for file uploads)
In Railway dashboard → your service → Volumes → Add Volume.
Mount path: `/data/uploads`
Size: 5GB to start.

### Step 6 — Deploy
Railway auto-deploys on push. First deploy runs the schema automatically.

---

## Local Development

```bash
npm install
cp .env.example .env
# Fill in .env with your local PostgreSQL and Anthropic API key
npm run dev
```

---

## Features
- Project management (inspection, RE, permitting, design)
- RUS billing logic (PSC Contracts 3/4/5, work orders)
- Permitting pipeline tracker with file uploads
- Workforce CSV import via AI
- Monthly billing report (printable)
- Hours tracking and reporting
- Claude AI assistant for project creation and data entry

## Rate Structure
- Inspection: $90/hr (RUS only)
- Resident Engineer: $100/hr (RUS/PSC only)
- Permitting: $90/hr @ 27.5 hrs/mile (15hr min)
- Design / Other: Variable (prompted on creation)

## Clients
PSC (RUS — Contracts 3, 4, 5), COX, IFT, TRI-CO
