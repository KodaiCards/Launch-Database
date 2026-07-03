# Theme picker / engine — AS-BUILT CORRECTED (Carter caught it live, 2026-07-03)
> Lesson recorded: the first version of this file declared the picker "unbuilt" off one narrow grep. Craft #1 — verify against ground truth — applies to the Partner too.

**LIVE on main (verified in code):** theme ENGINE + PICKER + **4 dark skins** — graphite (Graphite steel, default) · obsidian · nightsky (stars pattern) · blueprint (grid pattern) — app-shell.js THEMES catalog via data-skin, picker replacing the light/dark toggle (app-shell.js:251), legacy dark→graphite mapping, **server persistence live** (users.theme column; auth accepts catalog ids).

**REMAINING from the 2026-06-30 decision:**
1. **4 LIGHT-mode themes** into the same picker (only the legacy light base exists).
2. **Unify the remaining theme systems:** training-admin.html still runs its own legacy lfs_theme; the osp-training SPA has its own — both onto the shell catalog.
3. **New surfaces must use the picker, not reintroduce Light/Dark** — the mobile settings rebuild did exactly that → deviation #58 (routes with #49).

Structural mods (logo-click collapse etc.) tracked separately: ui-redesign-remnants.md. Full pre-canon context: archive/planning-2026-06/redesign_ui.md. Slot: 2.1 ui-pass spec; call-up *13 narrows to light-set + unification choices.
