# SPEC — UI/interaction pass: nav consolidation + theme unification (PLAN 2.1)

> ✔ **RATIFIED** — Carter, 2026-07-13 (Partner spec session, succession-sprint batch). Rulings: **one Billing tab** (Billing + Billing-KS + Money + Invoices → views within it) · **Import hours → a button inside Hours** · **Projects + Job board survive; Pipelines folds into Projects as a per-team view/filter** · **themes stay dark-only; unify every surface onto the 4-skin catalog** (light set consciously skipped — revisit only if field crews raise sunlight visibility).

## The rail after the pass (*1 kill list — struck by Carter)
**Dashboard · Projects · Job board · Billing · Hours · Clients · People · Training · Settings** — 9 items, was 16.
Killed/folded: Billing (KS) + Money + Invoices → views inside Billing · Import hours → button on Hours · Pipelines → view inside Projects · Audit log → dies with 2.2 · Admin → dies at the hard cutover (2.3).

## Sequencing
- **Nav consolidation rides the cutover wave** — each tab disappears when its page's replacement lands (Billing consolidation = the 2.3 invoice-path work's UI face; don't kill a tab before its function has a home).
- **Theme unification is standalone + parallel-safe:** move `training-admin.html` and the training SPA onto the `data-skin` catalog (app-shell engine). No new skins. PRODUCT_BAR §2.7 (both-skins contrast, no OS-default controls) is the acceptance lens on every touched surface.
- Visible-organization fixes per PRODUCT_BAR §2 apply to every page this pass touches: county-first grouping where lists group (law §7), consistent empty states, no dead links to killed tabs.

## Done-when
- Rail shows exactly the 9 items; every killed tab's function reachable inside its new home (VO playthrough per killed tab: "do the thing you used to do there").
- Rail search still resolves old destinations to the new homes (no dead results).
- training-admin + SPA render correctly in all 4 skins; contrast lens passes (§2.7).
