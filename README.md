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

## File Structure

```
├── server.js          # Express server + all API routes + AI chat engine
├── db.js              # PostgreSQL pool + schema init
├── schema.sql         # Database schema (auto-run on first start)
├── package.json       # Dependencies
├── public/
│   └── index.html     # Single-page frontend application
├── nixpacks.toml      # Railway build config
├── railway.json       # Railway deploy config
└── .env.example       # Environment variable template
```

---

## Local Development

```bash
npm install
cp .env.example .env
# Fill in .env with your local PostgreSQL and Anthropic API key
npm run dev
```

---

## AI Assistant Capabilities

The built-in AI assistant (Claude) can:

- **Create, update, and delete projects** with proper billing logic
- **Create clients, staff members, and contracts**
- **Log time entries** (single or bulk from CSV import)
- **Change project status** (active, completed, on_hold, billed)
- **Advance permit stages** through the pipeline
- **Query the database** to answer questions about projects, hours, revenue
- **Auto-calculate** permitting financials (footage → miles → hours → revenue)

The AI has access to 10 tools that directly interact with the database, with safety guards (read-only queries for data lookup, confirmation required for modifications).

## Rate Structure
- Inspection: $90/hr (RUS only)
- Resident Engineer: $100/hr (RUS/PSC only)
- Permitting: $90/hr @ 27.5 hrs/mile (15hr min)
- Design / Other: Variable (prompted on creation)

## Clients
PSC (RUS), COX, IFT, TRI-CO — Contracts and work orders managed manually or via AI
