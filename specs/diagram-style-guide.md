# Diagram Style Guide — the visual bar for training figures

> **SKELETON — Carter, 2026-07-20.** Companion to [`specs/diagrams.md`](diagrams.md). Seeded from the two in-session POCs; **the canonical values lock after the first co-drawn diagram with Carter (batch 1, technical style).** Until then, treat numbers below as starting points, not law. The Illustrator boot-reads this file.

## Shared foundations (both styles)
- **Inline SVG**, authored as JSX / a shared component via the `AnnotatedDiagram`/`Figure` primitive. Never `<img src>` / PNG / data-URI.
- **Theming via `currentColor` + SPA theme tokens — no hardcoded hex.** The figure inherits the lesson's theme. Verify in **both** light and dark before flipping `built`.
- **`viewBox`** set, `width:100%; height:auto` (responsive); no fixed pixel width on the rendered element.
- **Accessibility:** `role="img"` + `<title>` (short name) + `<desc>` (one-sentence description of what the figure shows). Interactive mode: each hot-point has an accessible label.
- **No displayed attribution** — nothing cited on the figure itself (we are the source). See diagrams.md §Attribution.
- **Reuse:** cross-lesson figures live in `osp-training/src/diagrams/` as importable SVG components.

## Style A — Technical line-art (DEFAULT / workhorse)
The RUS/REA construction-figure language. Precise, authoritative, no wobble.
- **Stroke:** `currentColor`, width ~1.8, `stroke-linejoin/linecap: round`, `fill: none` for structure. _(starting point — lock in batch 1)_
- **Leader lines:** thin (~1), ~0.72 opacity; straight; short.
- **Label font:** clean sans (`"Arial Narrow","Segoe UI",system-ui,sans-serif`), ~10px, uppercase, letter-spacing ~0.4px. Optional figure title in small caps (~11px, letter-spacing ~1.2px).
- **Theming (POC starting values):** light = print (bg `#ffffff`, ink `#16202b`); dark = reversed print (bg `#0f1c30`, line `#eef3fa`). Prefer tokens over these literals once mapped.
- **Use for:** closures, splice/slack storage, grounding & bonding, pedestals, cable cross-sections, bend radius, hardware — anything showing real physical build/config/dimensions.
- **Hard edge:** 2D orthographic/schematic figures are the sweet spot. **Isometric 3D perspective is occasional, high-effort — not routine** (diagrams.md §Scope); lean on Carter for those.

## Style B — Hand-drawn sketch (conceptual)
Whiteboard-explainer feel; for ideas/overviews where precision isn't the point.
- **The shared "sketch" filter (one reusable util — every sketch diagram uses it, so they stay consistent):**
  ```
  <filter><feTurbulence type="fractalNoise" baseFrequency="0.017–0.019" numOctaves="2" seed="<vary per figure>"/>
          <feDisplacementMap in="SourceGraphic" scale="~4.6" xChannelSelector="R" yChannelSelector="G"/></filter>
  ```
  Vary `seed` per figure so no two look stamped. _(starting values — lock in batch 1)_
- **Stroke:** `currentColor`, width ~2.4, round caps/joins; fibers/dots filled `currentColor`.
- **Label font:** hand style (`"Segoe Print","Bradley Hand","Comic Sans MS",cursive`), ~14px.
- **Theming (POC starting values):** light = ink on paper (bg `#f8f3e9`, ink `#26303a`); dark = chalk on navy (bg `#0f1c30`, chalk `#e9eff8`).
- **Use for:** concept intros, overviews, "here's the gist" moments.

## Annotation modes (either style)
- **Static labels** (default) — always visible, leader-line callouts (technical genre).
- **Hot-points** (optional) — click-to-reveal explanations via the primitive; use where a lesson teaches better interactively (the existing `AnnotatedDiagram` example's model, rebuilt on inline SVG).

## Internal accuracy checklist (verify, never display)
Where a figure depicts these, the value is checked against its real standard and noted in the brief — shown to no one:
- **Fiber color order** — TIA-598 (blue, orange, green, brown, slate, white, red, black, yellow, violet, rose, aqua).
- **Bend radius** minimums (loaded/unloaded); **RUS clearances**; **AWG bonding/grounding** specs; any dimensioned callout.
- Everything we *originate* (route layouts, teaching compositions) needs no external check — it's ours.

## To lock in batch 1 (the first co-drawn technical figure)
- [ ] Final stroke widths + title convention for technical style.
- [ ] Theme **token** names (replace the POC hex literals).
- [ ] Sketch-filter final `baseFrequency`/`scale`.
- [ ] The `AnnotatedDiagram`/`Figure` primitive API (props: `title`, `desc`, style, hot-points).
- [ ] Whether figures get a visible caption/number, or none.
