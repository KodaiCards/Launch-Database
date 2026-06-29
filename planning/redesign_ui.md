# UI Redesign (I10) — requirements collector

> Owned by Planning. The whole-new-UI redesign Carter wants ("the colors fucking suck… go a whole new UI"), **co-designed with him.** Everything he specifies + everything the live user-test surfaces lands here so nothing is lost. Build vehicle = I10 (ideas.md). Last updated 2026-06-29.

## Carter's stated requirements (verbatim intent)
1. **New color system / visual design** — current colors disliked; design something better. (Planning to propose 1–2 directions on the `app-shell.css` tokens → Carter picks.)
2. **Transparent (no-background) logo** included — `public/img/launch-fiber-logo-transparent.png`.
3. **Replace the "Launch" text (top-left)** with the transparent logo. *(Today the topbar/rail shows a "Launch" wordmark.)*
4. **Collapsible left nav:** the **left bar (tabs) HIDDEN by default**, revealed when the user **clicks the Launch logo (top-left)** → toggle. More space, cleaner default.
5. **Consolidate the money/billing nav — "there shouldn't be 3 tabs for money and billing."** Today the rail has **Billing + Billing (KS) + Money** = 3. Merge into fewer (e.g. one "Billing" + "Money", or a single "Money & Billing" with sub-tabs).
6. **Light/Dark (O33):** toggle says **"Light Mode" / "Dark Mode"** (text, not sun/moon); **default = DARK** for new accounts + any login w/o a saved pref; only an explicit light-set account starts light.
7. **Training UI:** remove "suggested time to complete" everywhere; gold header drop "OSP" → "Training" (TRAINING_PLAN). New training UI is part of this redesign.
8. **Training progress dashboard redesign** = I11 (scores highlighted, per-lesson time open→test-complete, pause-on-leave, 45-min flag).

## Cross-impacts / how these touch the existing build (flag before building)
- **#5 (3 money/billing tabs) IS the billing cutover (O15/O20).** "Billing" (`billing.html`) = an invoice LIST (`/api/billing/invoices`); "Billing (KS)" (`billing-keystone.html`) = the canonical earned−billed LEDGER (Worklist/Invoices/Report); "Money" (`money.html`) = analytics (margin/aging/revenue/program/projections/reporting). The legacy `billing.js` bill-multiple/batches engine appears to have **no live UI** (orphaned). ⇒ the consolidation = **retire legacy billing, keep ONE keystone Billing (the ledger, which already has an Invoices tab) + Money (analytics).** Decide the consolidated IA AS PART OF the billing cutover — same decision. Don't just hide tabs; retire the legacy path underneath.
- **#3/#4 (logo + collapsible nav):** the operations cluster uses **`app_nav.js`** (the rail) on every page; the shared **`app-shell.js` `mountSidebar` ALREADY has a collapse toggle + `localStorage('lfs-sidebar-collapsed')`** (chunk 15) — precedent exists. The redesign should **unify to one nav** and wire **logo-click → collapse/expand**. Note: the deep-dive found pages ALSO carry a redundant inline header (logo/theme/Admin) on top of the rail, and `dashboard.html` has a FULL duplicate nav → collapse to ONE nav + ONE theme control.
- **#6 (theme):** theme handling is **duplicated across 3 systems** — `app-shell.js` (`lfs-theme`, current default light→prefers-color-scheme), `training-admin.html` (`lfs_theme` underscore), the osp-training SPA (own). Unify; flip default to dark; preserve server pref for light-set accounts.
- **Scope (3 style systems):** `app-shell.css` tokens (cluster + portals — central win), the **osp-training SPA** (separate Tailwind), legacy inline pages. **Don't redesign legacy `admin.html`** (O30 — being retired into the cluster). **Opportunity:** do the new design AS the missing Settings screens (O30) get built → redesign + config-cutover land together.

## Deep-dive UI findings feeding the redesign (live, from USER_TEST.md)
- Every cluster page = shared `app_nav` rail + a redundant page-specific inline header (logo/theme/Admin/sometimes Service-Areas). Theme toggle appears in BOTH topbar (sun/moon) AND inline (sometimes "Theme" text) → O33 inconsistency. `dashboard.html` = full duplicate nav (worst).
- (more appended as the user-test continues)

## Process
Planning proposes palette/typography/component direction on the `app-shell` tokens → Carter picks → roll across cluster + SPA. Co-design while CEO works the training content + the small fixes. This doc is the living spec; I10 (ideas.md) is the tracker.
