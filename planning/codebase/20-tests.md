# 20 — Tests (coverage shape) — ✅ COMPLETE

> Mapped 2026-06-29. `tests/` = **64 `.test.js` files** (Node test runner) + `integration/` + `browser/` (Playwright E2E). **The regression net is broader than I assumed (revises O9 down) — money, hours, keystone, security, and schema-drift are all covered.** Gaps are specific, not systemic.

## What IS protected (coverage by area)
- **Money/billing:** `billing`, `billing_keystone` (the earned−billed ledger, chunk 07a), `budgets`, `budgets_keystone`, `projections` (chunk 07c), `margin_variance`, `revenue_group`, `aging_buckets`, `project_billing`, `progress_math`. → the keystone money-trio (billing ledger + budgets + projections) IS tested.
- **Hours:** `hours_bulk_delete` (+undo), `hours_import`, `hours_import_match` (the _hours_match matcher, chunk 09b), **`hours_quarter_snap`** (⭐ O22 — the round-to-0.25 is LOCKED BY A TEST → it's intentional/regression-protected, not an accident), `inspection_attribution` (the chunk-08 4-tier ancestor attribution).
- **Keystone:** `service_area_write_path`, `sa_job_geometry`, `clients_service_areas`, `project_documents_keystone`.
- **CSV:** `csv_import`, `csv_guard`, `csv_review_queue`.
- **Security:** `ai_security_guards`, `ai_upload`, `contractor_guard` (IDOR), `csv_guard`, `impersonation`, `contract_friendly_label`.
- **Legacy:** `project_tree_delete` (+undo), `projects_cascade`, `projects_leaves_only`, `projects_tree`.
- **Schema:** `schema_shape` (drift guard — pairs with the CI schema:sync validation, chunk 14).
- **Other:** `client_portal_v2`, `folder_workspace`, `dwg_two_way_sync`, `map_integration`, `splice`, `permits`, `design_pipeline`, `engineering_contracts`, `onboard_client`, `recent_activity`, `audit_cleanup`/`audit_log` + `integration/` + `browser/` (E2E).

## ⭐ Gaps (specific, ranked)
1. **Keystone SA-DELETE cascade (O14) likely UNtested.** `project_tree_delete` covers the LEGACY delete; `service_area_write_path` is write not delete. So the keystone SA-delete's cascade (config-destroy + hours-SET-NULL, chunk 18) has no regression test → the O14 fix (add undo) should ship WITH a test.
2. **The legacy↔keystone SPLIT isn't tested as correctness (O23/O16/O18).** No test asserts the SAME hours/billing show consistently across legacy + keystone views — which is exactly the split-brain users feel. The cutover should add reconciliation tests.
3. **The I4 rate-fallback** (hardcoded CASE ×6 files) has no single test pinning "rate resolution" — divergence wouldn't be caught. (hours_quarter_snap tests the snap, not the rate source.)
4. **CI activation unverified:** chunk 14 saw `deploy_preflight.js` + `validate_schema.js`; need to confirm `npm test` actually RUNS pre-deploy/in CI (a 64-file suite only protects if it gates deploys). → verify.

## Findings
- **Regression net is substantial (64 tests)** — money/hours/keystone/security/schema covered. **Revises O9 (Planning's "need a QA net") DOWN: the net largely EXISTS;** the real questions are (a) does it run in CI on every deploy, and (b) the specific gaps above (keystone-delete, the split reconciliation). Update O9.
- **⭐ O22 is test-locked = intentional.** `hours_quarter_snap.test.js` encodes the round-to-0.25 behavior. So my O22 recommendation ("reject non-grid input instead of silently snapping") would CHANGE a tested invariant — meaning it's a deliberate decision for Carter, not a bug to "fix." Reframe O22 as a policy question (the test proves intent), and any change updates that test.
- **Security has real tests** (IDOR/contractor guard, AI guards, impersonation, csv guard) — reinforces the "security is the more careful part" theme (chunks 02/10/13).
- **Coverage mirrors the dual model:** there are BOTH legacy (`project_tree_delete`, `projects_*`) AND keystone (`*_keystone`, `service_area_*`) tests — the test suite itself documents the parallel-tables reality (O18).

## Reapproach-if
- O14 fix ships with a keystone SA-delete cascade + undo test.
- Cutover: add legacy↔keystone reconciliation tests (the split-brain correctness gap) before/with the unification.
- O9 (QA net recommendation): downgrade — verify CI runs the suite on deploy; if yes, O9 is largely satisfied + add the 2 gap tests.
- O22: the snap is intentional (test-locked) — treat as a policy decision, not a fix; surface to Carter as "is silent-snap the policy, or reject-non-grid?" with the note that changing it updates hours_quarter_snap.test.