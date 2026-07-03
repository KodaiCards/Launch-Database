# UI redesign remnants — I10 minus what shipped (rescued + as-built-verified 2026-07-03)
SHIPPED: theme engine + picker + 4 dark skins + server persistence (see theme-picker.md). NOT built (verified 0 hits in app-shell/app_nav):
- Logo-click nav collapse + PUSH-sidebar reflow (content scoots, not covered) + sidebar-icon hover bubble/tooltip — the "theme-independent structural mods" Carter approved.
- Transparent no-background logo replacing the wordmark (public/img/launch-fiber-logo-transparent.png exists).
- Consolidate the 3 money/billing tabs (Billing + Billing-KS + Money → one) — rides the billing cutover.
- osp-training SPA restyle onto the shared token system (separate Tailwind world today) + training-admin.html theme unification.
- Legacy admin.html: DO NOT redesign (retiring at cutover).
Full context: archive/planning-2026-06/redesign_ui.md. Slot: ui-pass spec (2.1) + billing cutover.
