# SPEC — Training diagrams: the Illustrator campaign, two house styles, inline themeable SVG (PLAN §Track-1 training)

> ◐ **DESIGN RATIFIED — Carter, 2026-07-20** (two POC rounds in session: hand-drawn sketch + technical line-art, both approved; "we can have both"; org model refined same day). **THIS FILE awaits Carter's read before the Registrar lands it, sets up the board, + the Illustrator boots** (doctrine: Carter signs FILES). Carter's constraints, verbatim:
> - **Style:** "I want the diagrams to look hand drawn, not picture or lifelike." — on the technical RUS-figure references he then shared: "Thats okay to have too but I was thinking something like this. **We can have both.**"
> - **Attribution:** "The final product shouldnt have anything citied about the source because we are the source."
> - **Org / intake:** "The Foreman need to start coming up with ideas on where they want a graphic too, just a label for the Illustrator to have an agent team check. If it doesn't need a graphic then the illustrator flips it for VO." (2026-07-20)

## Why
Fiber is a physical, spatial domain — a loose-tube cross-section, a splice closure's tray stack, slack storage in a pedestal, grounding/bonding, bend radius. Prose alone is a real gap (PRODUCT_BAR §1: teach the foundation clearly). Trainees also meet **exactly these figures** in real RUS/OSP work, so teaching in that visual language is clearer and authentic.

## Scope
- **IN:** authored **illustrative + technical figures** embedded in lessons as **inline SVG**, in two house styles; the Illustrator-led campaign (its scout spawns + foreman intake); the missing `AnnotatedDiagram`/`Figure` primitive; theming; the accuracy discipline; the no-displayed-attribution rule.
- **OUT:** data-driven **interactive components** (`OTDRTraceViewer`, `LinkBudgetCalculator`, `TopologyCanvas`) — separate. **Photos / lifelike imagery** — ruled out by Carter. **Isometric 3D** as routine — allowed but occasional (§Scope hard edge below).

## The two house styles (the brief names one per diagram)
1. **Technical line-art — the default / workhorse.** Precise geometry, no filter, clean leader-line callouts; the RUS/REA construction-figure language. For anything showing **how something is actually built or configured**: closures, splice/slack storage, grounding & bonding, pedestals, cable cross-sections, bend radius, hardware.
2. **Hand-drawn sketch — the conceptual one.** A single shared "sketch" displacement filter gives every sketch diagram a consistent hand-drawn wobble; looser shapes, a hand-style label font. For **ideas, overviews, intros** where precision isn't the point.

**Annotation axis (orthogonal):** labels may be **static** (default, matches the technical genre) or **interactive hot-points** (click-to-reveal, via the primitive) where a lesson teaches better that way. The brief specifies.

**Hard edge:** 2D orthographic/schematic figures are the sweet spot. **Isometric 3D perspective is occasional, high-effort — not routine**; lean on Carter for those.

## Technical requirements (grounded in the actual SPA)
Lessons are `.jsx` (`osp-training/src/lessons/schema.md`); diagrams embed inline in the lesson body via a primitive.
- **Inline SVG only** — authored as JSX / a shared SVG component. **NOT** `<img src>` PNGs, **NOT** data-URI blobs. (The existing `AnnotatedDiagram.example.jsx` uses a data-URI `src` — do not follow that mechanic.)
- **Themeable — hard requirement.** Strokes/fills via **`currentColor` + SPA theme tokens**; **NO hardcoded hex.** (The existing example hardcodes navy/amber and only reads in dark — the exact anti-pattern.) Both themes must read: **ink-on-paper/print** (light) and **chalk-on-navy/reversed-print** (dark).
- **Shared sketch filter:** one reusable `feTurbulence`+`feDisplacementMap` util for the sketch style; technical style uses **no** filter.
- **No external deps / CDN / runtime lib.** Static inline SVG also sidesteps the SPA's flagged interactive-component render issues.
- **Accessibility:** `role="img"` + `<title>` + `<desc>` (or hot-point labels for interactive mode).
- **Build the missing primitive:** a real `AnnotatedDiagram`/`Figure` rendering **inline SVG children** + optional hot-points, themeable, no baked palette. Infra — unblocks every diagram.
- **Reuse:** cross-lesson figures live in `osp-training/src/diagrams/` as importable SVG components.

## Attribution + accuracy (Carter's rules, reconciled)
- **DISPLAYED: zero.** No source, citation, or attribution on any figure — we are the source, and a footer would break the aesthetic. A lesson-level ReferencesBlock is unaffected; the **figure itself** carries nothing.
- **INTERNAL: still verified where a standard governs the content.** Because we cite no one, accuracy is entirely on us — a trainee trusts a hand-drawn LFS figure *because* it's ours, with no cited fallback. Where a diagram depicts a fact with external ground truth — **fiber color order (TIA-598), bend radii, RUS clearances, AWG bonding specs** — the Illustrator **verifies the value** and records it in the item's research note (Gate-T), **never shown**. Everything we *originate* (layouts, teaching compositions) is ours.
- The **technical style raises this bar** (reads as spec-accurate); the **sketch style's looseness signals "conceptual."**

## Roles & pipeline — the Foreman pattern, pointed at diagrams
The **Illustrator maps onto a Foreman**: an Opus session Carter talks to, that spawns its own Tier-1 team, makes package-internal calls, and flips work up to the independent stack (Carter → VO → Registrar). Nothing new to the canon — the Foreman shape with a diagram flavor.

- **Illustrator (Opus session — Carter's partner-in-craft).** The only session Carter talks to. Spawns its scout team; resolves their ties; drafts and iterates diagrams with Carter; wires them into lessons; comes **up the chain** with any issue (domain/priority → Carter; spec/model → Partner; ops → Registrar).
- **Scout team = the Illustrator's spawns (Sonnet), the author≠red-team pair:**
  - **Finder** — sweeps assigned lessons and proposes spots where a graphic would teach better than prose.
  - **Skeptic / RT** — pressure-tests each candidate: *would a graphic really help here?* **Agree →** the RT writes the *why it helps* rationale, which becomes the Illustrator's brief context. **Disagree →** the **Illustrator makes the final call.**
  - The pair **is the ≤2 spawn budget** — for the whole curriculum they run **batch by batch** (same pair, next lessons), never a swarm (§5). Spotting is judgment → **Sonnet/medium**; **Haiku/low** only for mechanical enumeration.
- **Two intake sources feed the same team:**
  1. the Finder's sweep (above), and
  2. **Foreman `graphic-idea` flags** — while authoring a lesson, a training foreman drops a `graphic-idea` label + one-line note where they want a graphic. They **flag, never draw.** The Illustrator's team evaluates it exactly like a Finder candidate.
- **Outcomes of the team check:**
  - **Needs a graphic →** it becomes a confirmed brief (`diagram-needed`) and enters the draw pipeline.
  - **Does NOT need a graphic →** the Illustrator records the rationale and **flips it to VO to confirm the "no"** (independent check on the reject — a foreman's idea is never silently dropped inside the Illustrator's own subtree). VO agrees → closed; VO overrides → back into the pipeline.
- **Carter triages in batches, with the Illustrator.** The Illustrator brings a **list** of confirmed briefs, each with its context, and Carter goes yes / no / priority together with him. **Carter's triage is the real gate on whether a diagram lives** — the Illustrator's tiebreak only decides what to *bring* him.
- **Illustrator draws** (technical/sketch per the call), iterates with Carter to the bar, wires it in, flips `built` (+ `needs-xfm` if ≥2 foremen active).
- **VO (from outside the Illustrator's context):** the diagram lens (below) — including the **contextual cross-reference** Carter named: does the figure make sense *where it lands* in the lesson.
- **Registrar:** accordance (GATES stamp, cross-foreman if applicable, premerge), then merges. **Carter green-lights** anything trainee-visible.

## Board & labels (the Registrar sets these up at land)
- **`graphic-idea`** — an unverified proposal (foreman flag or Finder candidate) awaiting the Illustrator team's check.
- **`diagram-needed`** — a confirmed brief in the draw pipeline (style + insertion point + labels + context + any standard-values to verify).
- Draw lifecycle reuses existing status labels: `built` → VO → `verified`/`fix-needed` → merge.
- **Reject path:** a `graphic-idea` the team declines → Illustrator comments the rationale → flip to VO to confirm → close (or reopen to pipeline if VO overrides).

## Campaign, not permanent headcount
**One campaign session = the Illustrator** (Opus); scouts are its spawns, not booted roles. Runs within §5 caps (the Illustrator counts against ≤4 workers; ≥1 VO while merging), illustrates the curriculum, then **retires**; re-boot when new topics need it. Scale = boot a **second Illustrator** (still ≤4 workers), never more scouts. **First batch is co-drawn with Carter in the technical style** to set the bar and fill the style guide, *before* the campaign runs at volume.

## Sequencing
Retrofit the **already-merged** topics first (live-5 set + T09), run **alongside** wave-2 authoring (don't stall T05/T06), and **fold the `graphic-idea` flag + diagram pass into how new topics come to the bar** going forward (born illustrated).

## Done-when
**Per diagram:** inline SVG; **both themes render** (no hardcoded hex); technically correct + every standard-governed value verified (internal note); **no displayed attribution**; `role="img"`+`title`+`desc`; wired at the insertion point; Carter-approved; `premerge` green; VO diagram-lens PASS; cross-foreman PASS (if ≥2 foremen).
**Per rejected `graphic-idea`:** Illustrator rationale recorded; VO-confirmed; closed.
**Infra:** the real `AnnotatedDiagram`/`Figure` primitive exists (inline SVG + optional hot-points, themeable, no baked palette); shared sketch-filter util exists; style guide has **both** styles filled from batch 1.

## VO diagram lens (extends `.claude/skills/vo-verify`)
- **Both themes** render (no hardcoded hex — `currentColor`/tokens; check light AND dark).
- **Technical accuracy:** labels correct; every standard-governed value **independently checked by the VO** against ground truth (never trust the drawer's note — Gate-T discipline).
- **Contextual fit (Carter-named):** the figure makes sense **at its insertion point** — matches the surrounding prose, no contradiction, no forward-reference to unintroduced terms.
- **No displayed source/citation** anywhere on the figure.
- **a11y** present and accurate; **style matches the brief** (sketch uses the shared filter, technical uses none).
- **Reject confirmations:** on a flipped `graphic-idea`, VO agrees the spot truly needs no graphic (or overrides back to the pipeline).

## Decomposition guidance (Registrar)
Create the two labels; **build the infra primitive first** (`AnnotatedDiagram`/`Figure` + sketch-filter util — unblocks all). The Illustrator boots on Carter's go **after this file is signed and batch 1 is co-drawn**. Diagram packages are SPA-only (no DB/migration); premerge's Playwright walk covers render; the VO diagram lens is mandatory (no self-certification).
