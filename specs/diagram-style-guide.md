# Diagram Style Guide — the visual bar for training figures

> ✔ **LOCKED — Carter approved batch-1 (T01/L04 dome splice closure, technical style) 2026-07-20.** Companion to [`specs/diagrams.md`](diagrams.md). The canonical reference figure is [`specs/diagrams-batch1-reference.svg`](diagrams-batch1-reference.svg) — new technical figures match its treatment. Carter's bar, verbatim: the first sparse draft was "too AI generated"; the approved v2 reads "like a real technical drawing." The Illustrator boot-reads this file.

## Shared foundations (both styles)
- **Inline SVG**, authored as JSX / a shared component via the `AnnotatedDiagram`/`Figure` primitive. Never `<img src>` / PNG / data-URI.
- **Theming via `currentColor` + SPA theme tokens — no hardcoded hex.** The figure inherits the lesson's theme. Verify in **both** light and dark before flipping `built`.
- **`viewBox`** set, `width:100%; height:auto` (responsive); no fixed pixel width on the rendered element.
- **Accessibility:** `role="img"` + `<title>` (short name) + `<desc>` (one-sentence description of what the figure shows). Interactive mode: each hot-point has an accessible label.
- **No displayed attribution** — nothing cited on the figure itself (we are the source). See diagrams.md §Attribution.
- **Reuse:** cross-lesson figures live in `osp-training/src/diagrams/` as importable SVG components.

## Style A — Technical line-art (DEFAULT / workhorse)
The RUS/REA construction-figure language. Precise, authoritative, no wobble. **Detail is the bar — a sparse schematic reads as cheap/"AI-generated"; match the reference figure's density.** All values LOCKED from batch 1.
- **Line-weight hierarchy (the thing that makes it read real):** heavy outline `stroke-width:2.1` (`.o`) · medium structure `1.25` (`.s`) · fine detail/slots `0.7` (`.d`) · dashed hidden/center lines `0.9` `stroke-dasharray:5 3` · leader lines `0.8` at ~0.75 opacity. All `currentColor`, `fill:none`, round joins/caps.
- **Section hatching on CUT SOLIDS (metal):** a 45° line pattern (`width/height 4.5`, `stroke-width 0.45`) filling cut metal — base clamp collar, central-member anchor bracket, splice-protector capsules. Plastic housing shown in section is single-outline + a thin inner wall line (no hatch).
- **Detail callout:** a circled magnification (`DETAIL A`, `SCALE 4:1`) linked to a small source circle on the main view by two thin zoom-leader lines. Use for anything too small to read at main scale (e.g., the fusion splice + heat-shrink sleeve).
- **Title block (bottom-right, real-drawing convention):** bordered box, three rows — `LAUNCH FIBER SERVICES · OSP TRAINING` / **figure title** (bold) / cells `FIG. n` | `DWG <topic-lesson>` | `NTS`. This is OUR drawing ID, **not an external attribution** (attribution rule intact).
- **Labels:** uppercase; leader lines end in a small dot (`r 1.4`). Color-code multi-conductor detail with short perpendicular ticks at the root (e.g., buffer-tube fan-out).
- **Fonts:** `"Arial Narrow","Segoe UI",system-ui,sans-serif` — labels `8.6px`/ls `.3–.4`; mini/detail text `6.6px`; `DETAIL A` `10px`/ls `1.5`; title-block title `9px` bold, cells `7px`.
- **Theming:** all strokes/text `currentColor`. Light = print (card `#fbfaf7`, ink `#1a2431`); dark = reversed print (inherits). Map to SPA tokens at primitive-build time — never hardcode hex in the lesson SVG.
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

## LOCKED in batch 1 (2026-07-20, T01/L04 dome closure)
- ✔ **Detail bar:** dense, real-drawing treatment — NOT a sparse schematic (Carter rejected the sparse draft outright).
- ✔ **Line-weight hierarchy** 2.1 / 1.25 / 0.7 + dashed 0.9 + leaders 0.8 (see Style A).
- ✔ **Section hatching** on cut metal; single-outline + inner wall for the plastic housing.
- ✔ **Detail callout** convention (`DETAIL A · SCALE n:1` + zoom leaders).
- ✔ **Title block** present, with our drawing ID (`FIG. n` / `DWG <topic-lesson>` / `NTS`).
- ✔ **Reference figure:** [`specs/diagrams-batch1-reference.svg`](diagrams-batch1-reference.svg) — the canonical example new technical figures match.

## Still open (resolve at primitive-build time, not blocking)
- The `AnnotatedDiagram`/`Figure` primitive API (props: `title`, `desc`, `style`, hot-points) — decided when the primitive is built (spec: inline SVG children + optional hot-points, themeable).
- SPA theme-**token** names to replace the reference figure's literal hexes.
- Sketch-style (Style B) values stay POC-seeded until the first sketch figure is co-drawn (technical is the default and is now locked).
