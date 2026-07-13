# SPEC — Capabilities / permission grants (PLAN 2.5, System F)

> ✔ **RATIFIED** — Carter, 2026-07-13 (Partner spec session, succession-sprint batch). Initial-grants ruling: **Carter = admin (everything). Rudy Douglas (Director) = cockpit + all-hours + all-projects — NOT manage-billing** (Carter stays sole biller for now). Everyone else: base role only, granted case-by-case.

## Model
- Base roles stay exactly as-is (auth.js roles). Grants ADD capabilities per person on top: `capability_grants` (user_id · capability · granted_by · granted_at · revoked_at nullable).
- Capability set v1 (data, extensible): `cockpit` (profitability views + the admin leaderboard when 2.9 lands) · `all_hours` (see/approve everyone's hours) · `manage_billing` (create/void invoices, edit rates) · `all_projects` (cross-team project visibility) · `manage_users`.
- `requireCapability('x')` middleware — **server-side check on every gated endpoint**; UI hiding is convenience, never the gate.
- Admin grants UI: per-user checkboxes on the staff page; every grant/revoke change-logged.

## Why it's early (already approved)
Small build that unblocks three later systems: cockpit visibility (2.9), leaderboard gating, desktop admin file-browse scoping (D1), and lets Carter give Rudy the director view without making him admin.

## Done-when
- Rudy's account sees cockpit/all-hours/all-projects surfaces and CANNOT reach billing mutations (verified by direct API call, not just hidden buttons).
- A base employee hitting a gated endpoint gets 403; grant → works; revoke → 403 again, all change-logged.
- No client-side-only gating anywhere (VO authz lens: replay each gated route unauthenticated + wrongly-authenticated).

## VO lenses
Server-side enforcement on every route touched · no privilege escalation via the grants API itself (only admin grants; nobody self-grants) · money surfaces respect `manage_billing` strictly (hard rule 8 adjacency) · change-log rows for every grant event.
