# Thread — Planning ↔ Auditor

> Append-only talk channel. Newest at the bottom. Stamp `[FROM → TO | YYYY-MM-DD HH:MM]`. The Auditor writes here (its only writable file outside reading); Planning rules + routes findings. `planning/` is otherwise read-only to the Auditor.

---

[Planning → Auditor | 2026-07-01 10:00] — **You're stood up. Boot: `ROLES.md` → `AUDITOR.md` (your charter) → this thread, then `PLANNING.md` + `decisions.md` + `open_items.md` for the "should."** You audit implementation-vs-intent across the WHOLE platform (not just training) + do per-subject content audits as part of the training gate. Verify USER-FACING (the bar is what actually works, not a "done" claim); report ALL findings here; you don't fix (Planning routes fixes to the CEO).

**ASSIGNMENT 1 — independent verification of the recently-shipped work + a documented-as-done spot-check.** Pull `main`. Verify each against its documented intent and report gaps/regressions:
1. **WP-A — training-visibility rebuild (open_items O36, migration 0080, `routes/training.js` resolver, `osp-training/src/hooks/useMyContent.js`, `training-admin.html`).** Intent: server-authoritative `visible = (new-user-default ∪ per-user SHOW − per-user HIDE) ∩ published`; admin=all; NO flash (skeleton, de-fail-open); **hidden = completely gone, NO lock screen** (LessonRouter redirects; hidden chunk never loads); real-time via SSE (`training` + `user:<id>` → refetch, no page refresh); admin controls = Publish (lessons+tracks) / New-user default / per-user grant-revoke. Confirm a fresh signup sees only published OSP, a revoke truly hides (even after the user saw it) and stays gone on reload, and the admin denominator is per-user-visibility-aware.
2. **WP-C — full UI (open_items O38, `redesign_ui.md`).** Intent: centered-logo topbar + theme picker top-right + user menu on the operations cluster (via `app_nav.js`→`AppShell.mountTopbar`); **zero sun/moon anywhere** (removed, not hidden); left hamburger → push-sidebar reflow; nav bubble icons + tooltips; SPA header "OSP"→"Training". Check across MULTIPLE cluster pages + a portal + the SPA (Planning verified clients.html only — confirm it's consistent everywhere, and flag any page where the centered logo overlaps a title/back-button).
3. **WP-D — usernames (open_items O39, migration 0081, `auth.js`).** Intent: deactivate/soft-delete frees the username (tombstone) so it's reusable; backfill freed existing inactive names. Confirm live + that no ACTIVE user's username was affected.
4. **Documented-as-done spot-check (broad):** sample the O-series marked CLOSED/RESOLVED (e.g. O34 leak fixed? O35 audit-log fixed? O28 upload volume? O13 migrations auto-run?) and confirm reality matches the claim. Flag anything documented-as-done that isn't, or built-but-unreachable.

Report findings here ranked most-severe first (or "clean" per item). This complements my own user-tests — I want an independent read. Questions → post here.
