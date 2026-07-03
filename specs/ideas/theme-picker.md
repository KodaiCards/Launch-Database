# Theme picker / theme engine — RECOVERED decision (Carter 2026-06-30, pre-canon; rescued 2026-07-03)
> Canon-drafting miss: this Carter-validated direction was archived inside `archive/planning-2026-06/redesign_ui.md` without being carried into law/PLAN. Rescued when Carter caught f2's settings page still showing Light/Dark.

**Carter's words (2026-06-30):** NOT one chosen theme — a user-selectable THEME PICKER (a catalog). "The button to change your theme will replace light and dark mode."

- **Default theme = B · Graphite steel** (decided). Dark variants mocked: B / Emerald / Amber dusk. **NEXT: 4 light-mode themes** into the same picker.
- **Build = a THEME ENGINE (D013-clean):** each theme = CSS-variable token set (data, not code) · theme catalog + picker UI (swatch menu replacing the toggle) · per-user persistence — extend `/api/auth/me/theme` from light|dark → theme id (migration; default 'B') · **unify the 3 duplicated theme systems** (app-shell.js `lfs-theme`, training-admin.html `lfs_theme`, the osp-training SPA) onto ONE catalog.
- **Theme-independent structural mods (keep regardless):** PUSH-sidebar reflow, logo-click nav collapse, sidebar hover bubble/tooltip; logo keeps fixed brand colors (silver wordmark / azure / cyan spark) across all themes.
- Full detail + mockup notes: `archive/planning-2026-06/redesign_ui.md`.
- **Interim ruling (2026-07-03):** #49's settings layout lands as-is; its Light/Dark control is an acknowledged placeholder until the theme-engine package. Building MORE light/dark UI elsewhere = wasted motion; flag it.

Status: awaiting spec session (rides PLAN 2.1). Call-up *13.
