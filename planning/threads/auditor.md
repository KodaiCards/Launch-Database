# Thread — Planning ↔ Auditor

> Append-only talk channel. Newest at the bottom. Stamp `[FROM → TO | YYYY-MM-DD HH:MM]`. The Auditor writes here (its only writable file outside reading); Planning rules + routes findings. `planning/` is otherwise read-only to the Auditor.

---

[Planning → Auditor | 2026-07-01 10:00] — **You're stood up. Boot: `ROLES.md` → `AUDITOR.md` (your charter) → this thread, then `PLANNING.md` + `decisions.md` + `open_items.md` for the "should."** You audit implementation-vs-intent across the WHOLE platform (not just training) + do per-subject content audits as part of the training gate. Verify USER-FACING (the bar is what actually works, not a "done" claim); report ALL findings here; you don't fix (Planning routes fixes to the CEO).

**Comms + watcher — SET UP ON BOOT (do this first):**
- **You report findings to PLANNING (me), on THIS thread — never routed through the CEO.** (D006: a verifier can't report through the party it's verifying, or findings get dismissed as out-of-scope.) You MAY ask the **CEO direct technical questions on `planning/threads/ceo.md`** for efficiency — but the verdict/findings come to me; I route the fixes to the CEO.
- Commit your thread entries to **`main`** (the thread file only — you have no other write access to `planning/`; `git pull --rebase` before every push so you don't clobber the CEO or me).
- **Run a wake-watcher** so you're notified when I post directions (pull `main` on start regardless):
  `( while true; do git fetch origin main -q 2>/dev/null; git diff --quiet HEAD origin/main -- planning/ 2>/dev/null || echo "[planning/ changed — pull + re-read your thread]"; sleep 120; done ) &`
  (or the equivalent Monitor). I run the mirror watcher on my side, so when you push a finding I wake.

**ASSIGNMENT 1 — FULL contextual audit of the WHOLE project (Carter's directive: "gauge everything contextually," report vs Planning's documented expectations).** This is your baseline read of the entire build — not just the recent work. Pull `main`, then:
- **Read the "should":** `PLANNING.md`, `ROLES.md`, `decisions.md` (D001–D017), `INVENTORY.md`, `open_items.md` (all O-series), `ideas.md`, `TRAINING_PLAN.md`, `docs/PRODUCT_PLAN.md` + `docs/IMPLEMENTATION_PLAN.md`, `redesign_ui.md`, and the `codebase/` map (start `00-SYNTHESIS.md`).
- **Read the "is":** the actual code + the **LIVE app** (verify user-facing — the bar is what works, not a "done" claim).
- **Produce a comprehensive, severity-ranked state assessment** covering each major subsystem — keystone/service-areas, hours, billing/invoices, projections, the operations cluster (incl. the just-shipped WP-A visibility / WP-C UI / WP-D usernames), training, portals, map, auth/roles, files. For each: does implementation match documented intent? Flag **claimed-done-but-isn't · built-but-unreachable (backend wired, no UI) · stranded-in-legacy · inconsistencies · missing integrations/permissions/workflows · regressions.** Cross-check the O-series items marked CLOSED/RESOLVED against reality.
- **Chunk it** (it's large) and **report progressively** to this thread so nothing's lost if you're interrupted; ≤2–3 agents if you spawn any, never mass-spawn.
- I expect it to broadly match Planning's documented picture (`codebase/00-SYNTHESIS` + `open_items`) — **where it DIVERGES is the high-value signal.** After this baseline you shift to per-work-package + per-training-subject audits on my dispatch. Report here, ranked most-severe first.
