# OSP Cable Selection — Content Authoring System

## Purpose

This directory contains the Markdown source for the **Cable Selection** topic of the OSP-DRD BICSI prep course, authored for eventual import into Moodle 4.x.

Authoring in Markdown (not in Moodle's WYSIWYG editor) provides:

- Git version history and diff-based review for all content changes
- Citation tracking inline with the text (every numeric claim cites its standard)
- AI-assisted drafting and iteration without browser UI friction
- A clean source from which HTML, H5P packages, and Moodle REST API payloads can be generated programmatically

## File Structure

```
content/osp-cable-selection/
├── README.md                          ← this file
├── 01-smf-vs-mmf.md                   ← Lesson 1: Single-Mode vs Multi-Mode Fiber
├── 02-smf-grades-os1-os2.md           ← Lesson 2: OS1 vs OS2 and ITU-T G.652/G.657
├── 03-mmf-grades-om1-om5.md           ← Lesson 3: OM1–OM5 Application Matrix
├── 04-loose-tube-construction.md      ← Lesson 4: Loose-Tube Cable Construction
├── 05-tight-buffer-breakout.md        ← Lesson 5: Tight-Buffer and Breakout Cable
├── 06-ribbon-mass-fusion.md           ← Lesson 6: Ribbon Cable and Mass-Fusion Splicing
├── 07-armored-aerial-rodent.md        ← Lesson 7: Armored, Aerial, Rodent-Resistant Variants
├── 08-sheath-options.md               ← Lesson 8: Sheath Options (PE, OSP, FR, Armored)
├── 09-drop-distribution-feeder.md     ← Lesson 9: Drop vs Distribution vs Feeder Hierarchy
├── 10-cable-selection-by-environment.md ← Lesson 10: Selection by Environment
├── 11-connector-termination.md        ← Lesson 11: Connector and Field-Termination Options
├── 12-compliance-checklist.md         ← Lesson 12: Compliance (NESC, NEC, ANSI/TIA-758-C)
└── images/                            ← SVG diagrams (generated separately, referenced in lessons)
    └── smf-vs-mmf-cross-section.svg   ← Lesson 1 cross-section diagram
```

## Front-Matter Schema

Every lesson file opens with a YAML front-matter block:

```yaml
---
title: "Lesson N: Title"
duration_min: 25
topic: cable-selection
order: N
bicsi_alignment:
  - "OSP-DRD domain.section: Description"
sources:
  - "ANSI/TIA-XXX §section"
  - "..."
---
```

| Field | Purpose |
|---|---|
| `title` | Display name in Moodle |
| `duration_min` | Estimated learner time — used in course overview |
| `topic` | Topic slug for grouping |
| `order` | Sort order within topic |
| `bicsi_alignment` | Maps lesson to BICSI OSP-DRD exam domain/section |
| `sources` | Standards and references cited in this lesson |

## Content Structure Per Lesson

Each lesson contains these sections in order:

1. **Learning Objectives** — 4–6 measurable outcomes
2. **Reading Content** — 800–1200 words, substantive, every factual claim cited inline
3. **Key Terms** — 8–12 flashcard-ready definitions with citations
4. **Interactive: Drag-and-Drop** — cross-section labeling or matching activity (where applicable)
5. **Interactive: Scenario** — branching decision tree with feedback paragraphs
6. **Multiple-Choice Quiz** — 5–8 questions, 4 options each, per-option rationale with citation
7. **Final Check** — 3 pulse questions before advancing to the next lesson
8. **Glossary Cross-References** — terms that recur across lessons, with forward references

## Citation Convention

Every numeric specification, distance limit, attenuation value, or standard reference in the reading content and quiz rationales uses the inline citation format:

```
[ANSI/TIA-568.3-D §6.3.2.2]
[ITU-T G.652.D §4.1]
[BICSI OSP-DRD Manual, Ch. 5.2]
[Corning OSP Reference, §3.4]
```

Claims without citations are authoring errors and must be corrected before the lesson is imported to Moodle.

## Image Conventions

Images are referenced as `[image:filename.svg]` placeholders in lesson Markdown. SVG files are created separately and placed in `content/osp-cable-selection/images/`. The image reference format is:

```markdown
**[image:smf-vs-mmf-cross-section.svg]**

*Image description for SVG illustrator: ...*
```

The description block provides full layout and label specifications for the SVG illustrator (human or toolchain).

## Moodle Import Pipeline (planned)

```
Markdown source
  │
  ├─ Reading + objectives → HTML via markdown-it → POST to Moodle REST API
  │   (core_course_edit_module or core_block_add_block)
  │
  ├─ Quiz questions → H5P Question Set JSON → .h5p zip → Moodle H5P import
  │
  ├─ Flashcards (Key Terms) → H5P Dialog Cards JSON → .h5p zip → Moodle import
  │
  └─ Drag-drops → H5P Drag the Words / Image Hotspots → .h5p zip → Moodle import
```

The toolchain for this pipeline is not yet built. Current status: content is authored in Markdown and will be imported manually via Moodle's course editor for the MVP, with the scripted pipeline as a follow-on build item.

## Authoring Standards

- **No first-person.** Content reads as authored textbook material, not an AI assistant or personal tutor.
- **No references to AI, Claude, admin, or the authoring system** in lesson content.
- **Technical but not dry.** Analogies are encouraged where they clarify without condescending.
- **BICSI OSP-DRD exam alignment.** Every lesson maps to at least one OSP-DRD domain/section.
- **Tone target:** a $60 BICSI prep textbook a candidate would purchase on Amazon.
