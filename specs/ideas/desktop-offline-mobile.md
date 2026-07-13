# Desktop app (offline + local-file ingest) + mobile version (admin-lite + timeclock)

> **Carter, 2026-07-13 (verbatim):** "I want to make the launch software a full desktop app that runs offline and accesses local files to pull contents into the DB for admin to access. I want a mobile version too, less features mainly just for admin stuff or timeclocks"

Status: **IN PLAN** (2026-07-13) — now PLAN rows 2.13 (desktop) + 2.14 (mobile); call-ups *20/*21. Carter's same-night rulings:
1. **Sync:** wants "full sync in real time" — accepted the physics: real-time while connected, offline = capture queue + read-only cache syncing on reconnect, **money edits online-only**. (True offline real-time is impossible; offline money replica rejected.)
   **Clarified (Carter's follow-up, same night):** the line is *work vs accounting*. Money-AFFECTING work actions sync fine offline — completing a project (→ arrives at billing as ready-to-bill), changing status/hours/quantities that feed projections (server recalcs on sync; the on-screen projection is just cached-stale until reconnect). Online-only = money-RECORD edits: generate/void invoice, rate catalog, contract $ amounts, billing ledger. "Work happens anywhere and syncs; accounting requires a connection."
2. **Timing:** desktop pulled forward — its spec session may run ahead of Track-2 opening.
3. **Mobile:** tab-list/scope session with Carter happens BEFORE any build.

## What already exists (don't rebuild)
- `desktop/` — Electron scaffold v0.1.0: login flow against the backend, sync-engine skeleton (`sync/engine.js`, `manifest.js`, tray), electron-builder Windows installer. Founded as "file sync + workspace." Peripheral today; this seed is its mission.
- Banked adjacents: KMZ folder-watch auto-sync (PLAN tail item — explicitly needs the desktop app) · `feature_mobile_app` (PWA wrap) · L-009 (ONE dead-simple mobile flow: clock-in + daily card together) · rus-daily-paperwork seed (field-first, offline-relevant) · 2.6 hours capture (the mobile timeclock IS its mobile flow).

## Partner's proposed shape (pushback delivered in-session, pending Carter's ruling)
1. **Desktop identity = local-file ingest.** Watched folders → DB: KMZ (map), Workforce CSV (hours), invoice samples (billing templates), signed daily sheets + geotagged photos (RUS paperwork). The one thing a browser can't do.
2. **"Offline" = offline CAPTURE + read-only cache, NOT an offline replica.** Punches, daily cards, photos, file drops queue locally and sync on reconnect; recent projects/jobs viewable offline. Billing/contract EDITS stay online-only — money math is server-side (hard rule 8) and sync-conflict resolution on money data is the most expensive feature class there is. Full offline editing only if Carter states the scenario and we spec it knowingly.
3. **Mobile = PWA wrap first, not native.** The vanilla-JS portals wrap cheap; app stores add cost/friction. Scope: the L-009 timeclock/daily-card flow + admin-lite (approve hours, billing-status glance, nudges). Offline-tolerant punch queue.
4. **Sequencing:** mobile timeclock rides 2.6 (already planned). Desktop file-ingest pairs with map/KMZ arrival + RUS daily paperwork. Full wraps AFTER cutover 2.3 (never wrap the legacy admin being retired). Offline-capture layer is a cross-cutting spec section in both.

## Sync rules from Carter's scenario questions (2026-07-13, same night — spec inputs)
- **New records created offline may carry money fields** (e.g., a new project's manual bill override) — conflict-impossible until first sync; they arrive intact.
- **Same-record money conflicts are NEVER auto-resolved.** No newest-wins on dollars: the colliding value lands as a flagged conflict ("Carter $4,500 2:10p vs Jake $5,200 2:45p — pick one") in a human review queue; audit trail keeps both. (Capabilities 2.5 gates who can override at all, shrinking the surface.)
- **Offline maps:** base map visible offline via pre-download — desktop app gets "download this county/SA for offline" (county = the natural unit, per law §7). Basemap licensing is a spec decision: OSM-style tiles cacheable offline, Google's contractually not. Drawing offline = pure data, works fully; features queue append-only (conflict-proof) and on sync the EXISTING map-unit→estimate engines (`projections.js`/`_map_estimate.js`) populate the project server-side. These are REQUIREMENTS handed to map integration (*9, integrate-as-delivered) — not pre-designed internals.

## Carter's expansion ideas (2026-07-13, same night — verbatim + shape)
> **Carter (verbatim):** "I had a though about syncing launches every employees folders automatically so admin can pull anytime. I'd like a system that automatically tracks their production when possible. that might be impossible though because everything does in stages, prelem draw, then final, the bom etc."

- **Employee folder sync** — every employee gets a Launch WORKSPACE folder that syncs continuously; admin pulls any file anytime. Absorbs three banked needs in one engine: documents-storage (memory seed), KMZ watch-folder, CSV ingest. Adds bus-factor insurance (versioned server copies of all work product; who-saved-what-when = free RUS deliverable audit trail). **Partner line (pending Carter): sync the Launch folder, never the machine** — backup tool, not surveillance.
- **Passive production tracking via file events** — Carter thought stages made it impossible; stages are the SENSOR: prelim KMZ appears in the SA folder → suggest "mark prelim complete"; final drawing → final stage; BOM export → construction handoff. + map units drawn + hours = passive production data for the cockpit/PROD tracker/nudges ("no file activity on claimed job in 10 days"). Requirements: light folder-per-SA/naming convention; **SUGGEST-never-auto-flip** (human confirms every stage; a mis-named file can never complete a job or move money).
- Also unlocked by the same agent: tray timeclock punches, local splice-diagram printing (post-map), offline county packs.

## Open questions for the spec session
- Does admin ever truly need offline WRITE beyond capture? (Named scenario, or it stays out.)
- Storage/cost model for continuous employee-folder sync (where files live, retention, size caps) — UPLOAD_DIR vs object storage.
- Desktop distribution: unsigned installer + SmartScreen "run anyway" acceptable, or budget for code signing?
- Which watched-folder ingests are v1 vs later (KMZ? CSV? photos?)
- Mobile admin-lite exact tab list (Carter strikes the list, *1-style).
