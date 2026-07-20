# SPEC — Training diagrams: the Scout→Illustrator pipeline, two house styles, inline themeable SVG (PLAN §Track-1 training)

> ◐ **DESIGN RATIFIED — Carter, 2026-07-20** (two POC rounds in session: hand-drawn sketch + technical line-art, both approved; "we can have both"). **THIS FILE awaits Carter's read before the Registrar lands it + the campaign roles boot** (doctrine: Carter signs FILES). Carter's constraints, verbatim:
> - **Style (2026-07-20):** "I want the diagrams to look hand drawn, not picture or lifelike." — and, on the technical RUS-figure references he then shared: "Thats okay to have too but I was thinking something like this. **We can have both.**"
> - **Attribution (2026-07-20):** "The final product shouldnt have anything citied about the source because we are the source."

## Why
Fiber is a physical, spatial domain — a loose-tube cross-section, a splice closure's tray stack, slack storage in a pedestal, grounding/bonding, bend radius. Teaching it in prose alone is a real gap (PRODUCT_BAR §1: teach the foundation clearly). Trainees also meet **exactly these figures** in real RUS/OSP work, so teaching in that visual language is both clearer and authentic.

## Scope
- **IN:** authored **illustrative + technical figures** embedded in lessons as **inline SVG**, in two house styles; the Scout→Illustrator pipeline + campaign roles; the missing `AnnotatedDiagram`/`Figure` primitive (built as infra); theming; the accuracy discipline; the no-displayed-attribution rule.
- **OUT:** data-driven **interactive components** (`OTDRTraceViewer`, `LinkBudgetCalculator`, `TopologyCanvas`) — separate, not this campaign. **Photos / lifelike imagery** — explicitly ruled out by Carter (a separate sourcing track if ever needed). **Isometric 3D** as routine — allowed but occasional (see §Hard edge).

## The two house styles (the brief names one per diagram)
1. **Technical line-art — the default / workhorse.** Precise geometry, no filter, clean leader-line callouts; the RUS/REA construction-figure language. Use for anything that shows **how something is actually built or configured**: closures, splice/slack storage, grounding & bonding, pedestals, cable cross-sections, bend radius, hardware.
2. **Hand-drawn sketch — the conceptual one.** A single shared "sketch" displacement filter gives every sketch diagram a consistent hand-drawn wobble; looser shapes, a hand-style label font. Use for **ideas, overviews, intro moments** where precision is not the point.

**Annotation axis (orthogonal to style):** labels may be **static** (always visible, default — matches the technical genre) or **interactive hot-points** (click-to-reveal explanations, via the primitive) where a lesson teaches better that way. The brief specifies.

## Technical requirements (grounded in the actual SPA)
Lessons are `.jsx` (see `osp-training/src/lessons/schema.md`); diagrams embed inline in the lesson body via a primitive.
- **Inline SVG only** — authored as JSX / a shared SVG component. **NOT** `<img src>` PNGs and **NOT** data-URI blobs. (The existing `AnnotatedDiagram.example.jsx` uses a PNG-style `src` with a data-URI placeholder — do **not** follow that mechanic.)
- **Themeable — hard requirement.** Strokes/fills via **`currentColor` + the SPA theme tokens**; **NO hardcoded hex palettes.** (The existing example hardcodes navy/amber and only reads in dark — the exact anti-pattern.) Both light and dark must read: POCs proved **ink-on-paper / print** (light) and **chalk-on-navy / reversed-print** (dark).
- **Shared sketch filter:** one reusable `feTurbulence`+`feDisplacementMap` filter utility for the sketch style so every sketch diagram is consistent; technical style uses **no** filter.
- **No external deps / CDN / runtime lib** — the SVG is authored directly. Static inline SVG also sidesteps the SPA's flagged interactive-component render issues.
- **Accessibility:** each figure carries `role="img"` + `<title>` + `<desc>` (or the hot-point labels for the interactive mode).
- **Build the missing primitive:** a real `AnnotatedDiagram` (or `Figure`) that renders **inline SVG children** + optional hot-points, themeable, no baked palette. This is infra — it unblocks every diagram.
- **Reuse:** cross-lesson figures live in a shared module (e.g. `osp-training/src/diagrams/`) exporting SVG components importable by multiple lessons.

## Attribution + accuracy (Carter's rules, reconciled)
- **DISPLAYED: zero.** No source, citation, or attribution on any diagram — we are the source, and a footer would break the aesthetic. A ReferencesBlock at the lesson level is unaffected; the **figure itself** carries nothing.
- **INTERNAL: still verified where a standard governs the content.** Because we cite no one, accuracy is entirely on us — a trainee trusts a hand-drawn LFS figure *because* it's ours, with no cited fallback. So where a diagram depicts a fact with an external industry ground truth — **fiber color order (TIA-598), standard bend radii, RUS clearances/values, AWG bonding specs** — the Illustrator **verifies the value** and records it in the brief's research note (Gate-T discipline), **never shown to trainees**. Everything we *originate* (layouts, teaching compositions) is ours, presented as ours.
- The **technical style raises this bar** (it reads as spec-accurate — every value must be right); the **sketch style's looseness itself signals "conceptual."**

## The pipeline
1. **Scout** reads assigned lessons lesson-by-lesson (full text, as a learner) → files one **diagram brief** per gap (label `diagram-needed`): *lesson id + insertion point · style (technical | sketch) · what it depicts · key labels · annotation mode (static | hot-points) · any standard-governed values to verify + the standard to check · rough composition.* A brief must earn its place — teach the foundation, don't decorate.
2. **Carter triages briefs** — fast yes / no / priority, **before** any drawing effort. Cheap control point.
3. **Illustrator** claims a triaged brief → reads the **full lesson** (not just the brief snippet) → verifies any standard-governed value (internal note) → drafts inline SVG in the named style → **iterates with Carter** → wires it into the lesson JSX via the primitive at the insertion point.
4. **Verification stack (GATES):** VO diagram lens (below) → cross-foreman playthrough per GATES stack item 2 (now mandatory with ≥2 foremen — `needs-xfm`) → `premerge` green → Registrar merges → **Carter green-lights** (trainee-visible).

## Roles = a bounded CAMPAIGN, not permanent headcount
Scout + Illustrator boot from templates in `law/BOOT.md`, run within the §5 caps (they are specialized foremen for this campaign — ≤4 workers total, ≥1 VO while merging), illustrate the curriculum, then **retire**; re-boot when new topics need it. The VO role is the **existing** VO with an added lens (below) — not a new VO slot. **First batch is co-drawn with Carter in the technical style** to set the bar and fill the style guide.

## Sequencing
Retrofit the **already-merged** topics first (the live-5 set + T09), run **alongside** wave-2 authoring (do not stall T05/T06), and **fold a diagram pass into how new topics come to the bar** going forward (new topics born illustrated).

## Done-when
**Per diagram:** inline SVG; **both themes render** (no hardcoded hex); technically correct + every standard-governed value verified (internal note); **no displayed attribution anywhere on the figure**; `role="img"`+`title`+`desc`; wired at the insertion point; `premerge` green; VO diagram-lens PASS; cross-foreman PASS (if ≥2 foremen); **Carter green-light before publish**.
**Infra:** the real `AnnotatedDiagram`/`Figure` primitive exists (inline SVG children + optional hot-points, themeable, no baked palette); the shared sketch-filter utility exists; the style guide has **both** style definitions filled from batch 1.

## VO diagram lens (extends `.claude/skills/vo-verify`)
- **Both themes** render correctly (no hardcoded hex — `currentColor`/tokens; check light AND dark in preview).
- **Technical accuracy:** labels correct; every standard-governed value **independently checked by the VO** against its ground truth (never trust the drawer's note — Gate-T class discipline).
- **No displayed source/citation** anywhere on the figure.
- **a11y:** `role="img"` + `<title>`/`<desc>` (or hot-point labels) present and accurate.
- **Matches the lesson prose** it illustrates — no contradiction, no forward-reference to unintroduced terms.
- **Style matches the brief** (technical vs sketch); sketch uses the shared filter, technical uses none.

## Decomposition guidance (Registrar)
**Infra primitive first** (`AnnotatedDiagram`/`Figure` + sketch-filter util — unblocks all). Then the brief pipeline per topic; the retrofit batch parallelizes with wave-2. Campaign roles boot on Carter's go **after this file is signed**. Diagram packages are SPA-only (no DB/migration); premerge's Playwright walk covers render; the VO diagram lens is mandatory (no self-certification).
