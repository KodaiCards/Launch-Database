# SPEC — Permissions system: catalog, role/person grants, the Settings permissions page (PLAN 2.5, System F)

> ✔ **RATIFIED** — Carter, 2026-07-13 (Partner spec session, succession-sprint batch; **expanded same day** from the initial grants model on Carter's follow-up, verbatim below). Initial grants ruling stands: **Carter = admin (everything). Rudy Douglas (Director) = cockpit + all-hours + all-projects — NOT manage-billing.** Everyone else: base, granted case-by-case.

> **Carter (verbatim, 2026-07-13 15:14):** "when viewing a project as me with perms I can see the money stuff in the actual project list but people without perms cant. None of this stuff can just live in your head either. On the job board everything is visible so design and permitting teams can easily float between each other, I want the capability for managers to override someone working on something though, just to void or change their subordinates time, admins can change everyone's time. I want managers able to add mini jobs but the ability to give that permission to other people individually. There should be a whole page in settings where permissions for literally everything can be given to a role or person. Just lists of lots and basically all the different perms."

## Model (expanded per the ruling above)
- **Permission catalog** — a seeded, grouped list of string keys covering *every gated action in the platform*. Standing rule going forward: **any new gated feature MUST register its permission key in the catalog** (the Settings page auto-lists it; no hidden hardcoded gates).
- **Grants to roles AND persons**: `permission_grants` (permission_key · subject_type `role`|`user` · subject_id · granted_by · granted_at · revoked_at). Effective permission = base-role seed ∪ role grants ∪ personal grants. Personal grants let Carter hand ONE person ONE ability (his mini-jobs example) without touching roles.
- **`requirePermission('key')` middleware** — server-side on every gated endpoint. UI hiding is convenience; the API is the gate.
- **Manager→subordinate**: `users.manager_id` (nullable). "Manager of X" scopes the subordinate-level permissions below. v1 = direct reports; transitive later if needed.

## Rulings encoded (each is Carter's, 2026-07-13)
1. **Money is field-level, server-side** (`money.view`): the SAME project list returns $ columns to permitted viewers and **omits the fields entirely from the API response** for everyone else (hard rule 8 — stripping happens server-side, never CSS-hidden). Carter sees money in the project list; others see the identical list without it.
2. **The job board is visible to ALL staff** — no team scoping; design and permitting float between each other freely (visibility ≠ permission to edit money/time).
3. **Time overrides**: `hours.edit_subordinates` — a manager can void/change their direct reports' time segments. `hours.edit_all` — admins change anyone's. Every time edit is change-logged AND **the owner sees a notification** (in-app center, 2.4) — silent edits of someone's hours are trust-poison in a low-key shop (Partner guardrail; strike it if unwanted).
4. **Mini-jobs**: `minijobs.add` seeds to managers by default **and is individually grantable** to anyone (the exact scenario Carter named). `minijobs.template_manage` = admin-seeded.
5. **The Settings permissions page**: one page, the whole catalog grouped by area (Money · Hours · Projects · Mini-jobs · Training · Files · People · System), two grant surfaces per key — roles (checkbox per role) and people (add-person picker). Every change change-logged. "Lists of lots and basically all the different perms."

## Catalog v1 (seed; grows with every feature)
`money.view` · `money.manage_billing` · `hours.edit_subordinates` · `hours.edit_all` · `hours.view_all` · `projects.view_all` · `projects.manage` · `minijobs.add` · `minijobs.template_manage` · `cockpit.view` (incl. leaderboard at 2.9) · `training.admin` · `files.browse_all` (desktop D1 admin browse) · `events.manage` · `people.manage` · `system.logger_toggle` · `certificates.issue`.

## Done-when
- Rudy's account sees cockpit/all-hours/all-projects and CANNOT reach billing mutations (verified by direct API call).
- A no-`money.view` user fetching the project list gets **no $ fields in the JSON** (VO checks the raw wire, not the rendered page).
- Manager voids a direct report's segment → succeeds, change-logged, report notified; same manager editing a NON-report's time → 403. Admin edits anyone's → succeeds, logged, notified.
- Personal grant of `minijobs.add` to a non-manager → they can add; revoke → 403; all visible on the Settings page.
- Settings page lists the full catalog; a grant flipped there takes effect without deploy.

## VO lenses
Server-side enforcement on every touched route (replay unauthenticated + wrong-user) · no self-granting (only `people.manage` holders grant; nobody grants themselves) · money field-stripping verified on the wire · manager scope = direct reports only · change-log rows for every grant/time-edit event · notification fires on time edits.
