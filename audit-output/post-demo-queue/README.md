# Post-Demo Queue — Decision Docs

Synthesis of audit verdicts (W218 / W220 / W221) captured here as durable
reference for the post-Monday-demo work. Each doc below distills the audit
findings into a recommended next-wave plan so future fix-agents have the
synthesis ready and don't re-derive from raw findings.

---

## 1. Client Portal v1 — E2 (token-auth foundation) verdict

**File:** [`client-portal-v1-e2-verdict.md`](./client-portal-v1-e2-verdict.md)

**Two-line summary:** E2 (token-auth foundation + admin token mgmt + client
read/write API) is on main with a complete IDOR scoping pattern. Verdict
GREEN — E3 UI build can proceed unblocked. Two non-blocking polish items
(rate-limit on `/client/login/:rawToken`, audit log on read endpoints) are
queued for E6 future.

**Recommended next wave:** E3 — client portal HTML UI shell (`public/client/`
static surface, login landing, projects list view, document view + upload,
approval list + respond) wiring to the existing `/api/client/*` endpoints.

---

## 2. Splice subsystem — scope re-baseline

**File:** [`splice-scope-rebaseline.md`](./splice-scope-rebaseline.md)

**Two-line summary:** Splice is 7314-line routes/splice.js + 9763-line
splice.html + 21 migrations + 104 endpoints (largest single subsystem in the
app). Risk of a clean-sheet rewrite far exceeds the value of the refactor —
recommend INCREMENTAL improvements in 6 small waves. Contractor public-token
URLs (`/splice/field/:token`, `/splice/view/:token`) are SACRED — printed
QR codes in the field point at these URLs and cannot be regenerated.

**Recommended next wave:** SR-1 (splice rewrite wave 1) — extract splice
public-token routes into `routes/splice_public.js` (~600 lines) preserving
URL contract verbatim. Smallest defensible reduction in splice.js size with
zero contractor-side impact.

---

## 3. Cascade port playbook (design → permitting → admin)

**File:** [`cascade-port-playbook.md`](./cascade-port-playbook.md)

**Two-line summary:** Shared `public/js/project_cascade.js` (584 lines)
shipped in W212; admin port deferred per agent risk-assessment pre-demo.
Per-portal port difficulty differs (design + permitting use `<datalist>`
typeahead; admin uses inline custom typeahead with hidden input). Recommend
porting design + permitting FIRST as lower-risk validation of module API,
then admin LAST (highest entanglement). SKIP timeclock — it has 3 cascade
instances (entry/ci/sw) already abstracted via shared `cascadeChanged()`,
so port = no behavior change, just churn.

**Recommended next wave:** CP-1 — port design.html to ProjectCascade module
(easier of design/permitting because design's job select is a vanilla
`<select>` not the admin-style custom typeahead).

---

## Index

| Doc | Topic | Verdict | Next wave |
|---|---|---|---|
| [client-portal-v1-e2-verdict.md](./client-portal-v1-e2-verdict.md) | Client portal E2 IDOR audit | GREEN | E3 UI build |
| [splice-scope-rebaseline.md](./splice-scope-rebaseline.md) | Splice rewrite scope | INCREMENTAL (6 waves) | SR-1 extract public-token routes |
| [cascade-port-playbook.md](./cascade-port-playbook.md) | Cascade module portal ports | DESIGN→PERMITTING→ADMIN, skip timeclock | CP-1 design port |
