# SPEC — Mobile app (PWA): the whole-workforce app (PLAN 2.14)

> ✔ **RATIFIED** — Carter, 2026-07-13 (succession-sprint batch, *21 session — scope EXPANDED by Carter in-session, verbatim):
> "Also make sure the other non admin employees can select their jobs on the mobile app. I want even our 1099 people on this app now, just with reduced perms and they clock on when working on only jobs they are allowed to see."

## Scope (PWA-first, wraps the cluster pages)
- **Everyone** installs it — W2 staff AND 1099 contractors.
- **Worker surface:** the job board (county-first) → pick a job → clock on/off (the 2.15 one-active-clock model) → mini-job checkoffs → daily card (2.6, the L-009 one-flow for 1099s: clock + daily card together) → day-end draft-confirm. Offline punch queue (capture-only, syncs on reconnect).
- **Visibility scoping (the Carter rule):** staff see the whole board (his standing all-staff ruling); **1099/external roles see ONLY jobs they are assigned/permitted** — `projects.view_all` seeds to staff roles, not 1099; the scoped board = assigned + explicitly opened jobs. Server-side filtering: the reduced board is what the API returns, never a hidden view.
- **Admin surface** (permission-gated tabs — all four struck IN by Carter): Approve hours (confirm-loop queue + anomaly flags) · Billing glance (read-only did-I-bill view, `money.view`) · Nudges/events center · Job board with who-is-clocked-on (read).
- No money mutations on mobile v1 (aligns with the online-only money rule; keeps the PWA simple).

## Sequencing
Rides the pieces it consumes: mini-jobs M1/M2 (board + clock) and 2.6 (daily card + confirm loop). The PWA wrap + scoping can build as soon as M2 lands; the daily card joins when 2.6 does. Tab-list session (*21) = DONE.

## Done-when
- A 1099 account's board API returns only permitted jobs (wire-checked); clock on/off + checkoffs work on a phone; an offline punch made in airplane mode syncs on reconnect; admin tabs invisible + 403 without their permissions; installable PWA (add-to-home-screen) on Android and iOS Safari.
