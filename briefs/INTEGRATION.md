# Integration gate — who merges a worker branch

Decide in ~10 seconds whether a pushed worker branch (C2/C3/C4) can be **self-merged by anyone** or must be **escalated to CEO (head Claude / Opus)**. Goal: keep cheap routine merges off Opus; route only the high-stakes ones to the brains.

## GREEN — safe to self-merge (you or a coworker; no CEO needed)
ALL of these must hold:
- Diff touches **only** `public/*.html`, `public/js/*.js`, `tests/`, `docs/`, `briefs/` — and **nothing** in `routes/`, `server.js`, `auth.js`, `migrations/`, `schema.sql`.
- **No new backend endpoint** and no change to money math, auth, roles, or customer-scoping.
- `git diff main...origin/<branch> | grep -c '^+<<<<<<<'` returns **0** (no conflict markers).
- For `customer.html` (client-facing): added lines expose **no internal-$ fields** — `grep '^+' | grep -iE "estimated_amount|actual_amount|estimated_total|\bcost\b"` is empty.
- **CI is green** (`.github/workflows/test.yml` runs `npm test` on push).

Self-merge steps:
```
git fetch origin <branch> -q
git diff --stat main...origin/<branch>          # eyeball scope
git diff main...origin/<branch> | grep -c '^+<<<<<<<'   # must be 0
git merge --no-ff origin/<branch> -m "merge: <what>"
git push origin main
```

## RED — escalate to CEO (do NOT self-merge)
ANY of these:
- Touches `routes/*.js`, `server.js`, `auth.js`, `migrations/`, or `schema.sql`.
- Adds/changes a **backend endpoint**, money calculation, auth/role logic, or customer-data scoping.
- Touches the keystone core (`routes/service_areas.js`) or needs a **new route mounted**.
- **CI red**, or a merge conflict, or the worker left a `BLOCKED — needs CEO` note.
- You're unsure → treat as RED.

Why: CEO review is where the non-obvious bugs get caught — e.g. the program-financials N× revenue fan-out, the contractor IDOR guard, customer `$`-leaks. A mechanical merge would rubber-stamp those. Frontend/test/doc changes that pass CI carry none of that risk.
