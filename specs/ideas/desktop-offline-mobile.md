# Desktop app (offline + local-file ingest) + mobile version (admin-lite + timeclock)

> **Carter, 2026-07-13 (verbatim):** "I want to make the launch software a full desktop app that runs offline and accesses local files to pull contents into the DB for admin to access. I want a mobile version too, less features mainly just for admin stuff or timeclocks"

Status: **IN PLAN** (2026-07-13) — now PLAN rows 2.13 (desktop) + 2.14 (mobile); call-ups *20/*21. Carter's same-night rulings:
1. **Sync:** wants "full sync in real time" — accepted the physics: real-time while connected, offline = capture queue + read-only cache syncing on reconnect, **money edits online-only**. (True offline real-time is impossible; offline money replica rejected.)
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

## Open questions for the spec session
- Does admin ever truly need offline WRITE beyond capture? (Named scenario, or it stays out.)
- Desktop distribution: unsigned installer + SmartScreen "run anyway" acceptable, or budget for code signing?
- Which watched-folder ingests are v1 vs later (KMZ? CSV? photos?)
- Mobile admin-lite exact tab list (Carter strikes the list, *1-style).
