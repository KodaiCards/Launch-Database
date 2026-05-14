# OSP Topic 2 — Splice & Termination Practice: Discovery

> Scope: read-only content scoping for Topic 2 of the OSP training curriculum.
> Template follows Topic 1 (Cable Selection) structure approved 2026-05-14.
> Aligned to BICSI OSP-DRD splice/termination domains. Estimated 5 hrs total.

---

## 12-Lesson Outline

| # | Lesson Title | Est. Duration | Best Interactive Types |
|---|---|---|---|
| 2.1 | Cleaving Fundamentals: Setup, Angle Requirements, and Failure Modes | 25 min | Flashcards (blade wear indicators, angle targets), multiple-choice quiz |
| 2.2 | Fusion Splicing I: Core Alignment, Arc Parameters, and Splice Loss Budgets | 30 min | Flashcards (arc parameters, loss budget terms), scenario (loss budget calc), multiple-choice |
| 2.3 | Fusion Splicing II: Automated Splice Estimation, QA Criteria, and Re-splicing | 25 min | Multiple-choice, scenario (splice rejection decision tree), flashcards |
| 2.4 | Mass-Fusion Splicing: Ribbon Prep, Holder Alignment, and Cycle Times | 25 min | Drag-drop (ribbon prep sequence), flashcards, multiple-choice |
| 2.5 | Mechanical Splicing: When to Use, Accuracy Limits, and Field Repair Scenarios | 20 min | Scenario (field repair go/no-go), flashcards, multiple-choice |
| 2.6 | Splice Closures: Dome vs. In-Line, Environmental Ratings, Gel-Seal vs. Heat-Shrink | 25 min | Drag-drop (match closure type to deployment environment), flashcards |
| 2.7 | Splice Trays and Buffer-Tube Management | 20 min | Drag-drop (label tray layout), flashcards, multiple-choice |
| 2.8 | Termination Methods: Pigtails vs. Field-Installable Connectors | 25 min | Scenario (select method for site conditions), flashcards, multiple-choice |
| 2.9 | Hardened OSP Connectors: LC-APC HOC, OptiTap, and Ruggedized Variants | 20 min | Drag-drop (match connector to deployment scenario), flashcards |
| 2.10 | OTDR Testing: Forward + Reverse Pass, Bidirectional Averaging, Dead Zones | 30 min | Scenario (interpret OTDR trace — locate fault), flashcards, multiple-choice |
| 2.11 | Power Meter and Light Source Testing: Tier 1 vs. Tier 2 | 20 min | Multiple-choice, scenario (select test tier for project type), flashcards |
| 2.12 | Acceptance Testing and As-Built Documentation | 25 min | Scenario (compliance audit walkthrough), multiple-choice, flashcards |

**Total estimated duration: ~5 hrs**

---

## Lesson Scope Detail

### Lesson 2.1 — Cleaving Fundamentals: Setup, Angle Requirements, and Failure Modes
**Duration:** 25 min

The quality of every splice — fusion or mechanical — is gated by the cleave. This lesson covers precision cleaver anatomy (blade, rotation counter, tension setting, fiber holder), cleave angle requirements (≤0.5° for single-fiber fusion; ≤1.0° for mass-fusion ribbon), and how to read cleave failures: hackle, mist, lip, and angle error. Covers blade life and mandatory replacement intervals, holder alignment, and single-mode vs. multi-mode cleave parameters. The lesson closes with a field-decision loop: what to do when a cleave fails on the last workable fiber length.

**Best interactives:** Flashcard set (failure mode vocabulary + visual descriptions), multiple-choice quiz (angle spec, failure mode identification).

**Sources:** Fujikura CT-series cleaver operation guides (public training materials); Sumitomo FC-6S field cleaver manual; BICSI OSP-DRD Manual, Ch. 7.3; IEC 61300-3-35 (fiber end-face geometry).

---

### Lesson 2.2 — Fusion Splicing I: Core Alignment, Arc Parameters, and Splice Loss Budgets
**Duration:** 30 min

The longest lesson in the topic: covers the physics of fusion splicing (arc discharge, glass softening, surface tension pull-in), core alignment modes (PAS — Profile Alignment System, LID — Light Injection and Detection, and clad-alignment), and the three primary arc parameters (gap, prefuse arc, main arc duration). Defines estimated splice loss, measured splice loss, and the difference in how splicers compute each. Builds a worked splice loss budget for a 12-splice route at 0.10 dB/splice vs. 0.05 dB/splice and shows the cumulative link budget impact. Addresses what drives high splice loss: dirty fibers, bad cleave angle, mismatched fiber types, arc contamination.

**Best interactives:** Flashcard set (arc parameters, alignment modes), scenario (work the loss budget calc step by step), multiple-choice quiz (arc parameter effects, loss budget threshold decisions).

**Sources:** Fujikura FSM-series splicer operation manuals (public training content); Sumitomo Type-82 field splicer guide; AFL Fitel S179 splicer training materials; BICSI OSP-DRD Manual, Ch. 7.4; IEC 61300-3-4 (attenuation measurement by backscatter — OTDR method relevant to splice loss verification).

---

### Lesson 2.3 — Fusion Splicing II: Automated Splice Estimation, QA Criteria, and Re-splicing
**Duration:** 25 min

Covers the automated splice estimator built into modern fusion splicers: how the splicer's image-processing algorithm estimates loss from core offset, core deformation, and bubble presence — and why estimated loss ≠ OTDR-measured loss. Defines acceptance thresholds (project-spec vs. BICSI-default vs. IEC 61300 baseline). Covers re-arc capability and its limits (when to re-arc vs. when to re-splice). Addresses splice protection sleeve application (heat-shrink reinforcement sleeves, cooling time, holder selection). Closes with a QA decision tree: estimated loss → accept / re-arc / re-splice.

**Best interactives:** Scenario (decision tree walkthrough — given a splicer screen showing estimated 0.18 dB, walk through the accept/re-arc/re-splice decision), multiple-choice, flashcard set.

**Sources:** Fujikuru FSM splicer operation manuals; Sumitomo field guides; BICSI OSP-DRD Manual, Ch. 7.4; IEC 61300-3-4; AT&T OSP Construction Practices (publicly available subsets).

---

### Lesson 2.4 — Mass-Fusion Splicing: Ribbon Prep, Holder Alignment, and Cycle Times
**Duration:** 25 min

Mass-fusion splicing splices 12 or 24 fibers simultaneously in a single arc cycle — the backbone of high-fiber-count (144F+) OSP installations. This lesson covers ribbon fiber identification, matrix removal (ribbon stripping chemistry, UV-cure stripping for low-shrink variants), simultaneous cleaving of all 12 or 24 fibers in a ribbon cleaver, holder alignment (left/right, top/bottom), arc parameter differences from single-fiber splicing, and cycle time impact on crew productivity. Covers how mass-fusion splice loss is typically higher per fiber than single-fiber splicing (typical: 0.05–0.15 dB vs. 0.02–0.10 dB) and why — and when that trade-off favors mass-fusion anyway (volume, speed).

**Best interactives:** Drag-drop (ribbon prep sequence — strip → clean → cleave → load → splice → protect), flashcard set, multiple-choice.

**Sources:** Fujikuru FSM-60R/70R/90R ribbon splicer manuals (public training); Sumitomo Type-71M+ ribbon splicer guide; BICSI OSP-DRD Manual, Ch. 7.4; Corning/CommScope OSP termination guides.

---

### Lesson 2.5 — Mechanical Splicing: When to Use, Accuracy Limits, and Field Repair Scenarios
**Duration:** 20 min

Mechanical splices are the field-expedient alternative when fusion equipment is unavailable or impractical. This lesson covers mechanical splice anatomy (v-groove alignment, index-matching gel, clamping mechanism), insertion loss typical range (0.3–0.5 dB vs. 0.02–0.10 dB for fusion), and temperature stability limits. Frames the go/no-go decision: emergency drop restoration vs. permanent backbone installation. Covers field scenarios: severed aerial drop cable, vault splice replacement under traffic, low-fiber-count rural service restoration. Addresses when a project specification may explicitly prohibit mechanical splicing on segments over a loss-budget threshold.

**Best interactives:** Scenario (field repair go/no-go: given route loss budget remaining, decide mechanical vs. defer-to-fusion), flashcard set, multiple-choice.

**Sources:** Corning UniCam connector training (public materials); 3M/Fibrlok mechanical splice installation guide; BICSI OSP-DRD Manual, Ch. 7.3; Verizon/AT&T OSP construction practices (publicly available subsets).

---

### Lesson 2.6 — Splice Closures: Dome vs. In-Line, Environmental Ratings, Gel-Seal vs. Heat-Shrink
**Duration:** 25 min

Splice closures protect the splice organizer and fibers from the OSP environment. This lesson covers the two primary architectures: dome closures (cylindrical, re-enterable, used in buried and aerial work) and in-line (butt) closures (preferred for conduit where a narrow profile is required). Covers environmental rating (IP68 for buried; UV-resistance and temperature range for aerial), gel-seal vs. heat-shrink cable port options (gel is re-enterable; heat-shrink is faster in field but less re-enterable), and how many cable ports each closure accommodates. Addresses how to size a closure for fiber count and re-entry frequency.

**Best interactives:** Drag-drop (match closure type and sealing method to deployment environment: buried/gel, aerial/heat-shrink, conduit/in-line), flashcard set.

**Sources:** Corning Cable Systems SCF/SCB dome closure installation guide (public); CommScope FOSC closure technical manual; AFL OSP splice closure design guide; BICSI OSP-DRD Manual, Ch. 8; IEC 60068-2-14 (thermal shock for outdoor-rated enclosures); ANSI/TIA-758-C §7 (splice closure requirements).

---

### Lesson 2.7 — Splice Trays and Buffer-Tube Management
**Duration:** 20 min

Inside every splice closure is an organizer: splice trays that hold fibers in radius-controlled loops and identify each splice. This lesson covers tray anatomy (fiber retention, label area, slack storage radius requirements — ≥30 mm for single-fiber OSP), how buffer tubes are broken out and routed to trays (tube management: no kinks, gel removal, fan-out to 250 µm bare fibers), and how to assign fibers across trays in a logical port-to-port mapping scheme. Covers typical tray capacity (12 or 24 splices/tray), and how a poorly managed tray causes microbend-induced attenuation from inadequate bend radius.

**Best interactives:** Drag-drop (label a tray layout: fiber routing path, splice organizer positions, bend radius guides), flashcard set, multiple-choice.

**Sources:** Corning splice tray installation guides (public); Fujikuru FSM series splicer accessories guide; BICSI OSP-DRD Manual, Ch. 8.2; ANSI/TIA-758-C §7.2 (fiber management inside closures).

---

### Lesson 2.8 — Termination Methods: Pigtails vs. Field-Installable Connectors
**Duration:** 25 min

At the FDH, FDT, and building entry, spliced fiber must become connectorized. This lesson compares the two primary termination paths: (1) factory-polished pigtail + fusion splice (the OSP standard — lowest loss, best reliability, requires a splicer on-site), and (2) field-installable connectors (no splicer required — mechanical in the connector body; types include 3M Hot Melt, Corning UniCam, and cleave-and-crimp variants). For each method: typical insertion loss, return loss capability (UPC vs. APC availability), installation time per fiber, equipment cost, and scenarios where each is appropriate. Covers pre-polished vs. epoxy-and-polish field connectors as a third sub-category for high-volume cross-connect frames.

**Best interactives:** Scenario (select method given site constraints: no splicer available, 48 fibers, deadline 4 hours), flashcard set, multiple-choice.

**Sources:** Corning UniCam installation guide (public); 3M Hot Melt connector training (public); AFL Fitel field-polishing kit guide; BICSI OSP-DRD Manual, Ch. 7; ANSI/TIA-568.3-D §6.5; Corning OSP Reference Guide, Ch. 7.

---

### Lesson 2.9 — Hardened OSP Connectors: LC-APC HOC, OptiTap, and Ruggedized Variants
**Duration:** 20 min

Where drop cables connect to distribution plant in aerial or buried pedestals, connectors face outdoor conditions that standard SC/LC cannot handle. This lesson covers the major hardened OSP connector families: Corning OptiTap (the dominant SC-APC drop connector for FTTH), CommScope OptiSheath LC-APC HOC (High-Density Outdoor Connector), and AFL OptiSplice family. Covers IP67/IP68 ratings, weatherproof mating mechanism (bayonet pull-to-lock vs. threaded), and insertion loss specs under field conditions. Discusses the QR-on-closure workflow: hardened connectors at FDT ports that field technicians connect drop cables to using a simple pull-to-lock motion — no splicer required at the customer end.

**Best interactives:** Drag-drop (match connector family to deployment scenario: FDT buried pedestal, aerial FDT, customer NID, FTTH tap), flashcard set.

**Sources:** Corning OptiTap connector product training (public); CommScope HOC technical brief (public); AFL OSP drop connector installation guide; BICSI OSP-DRD Manual, Ch. 7.5; ANSI/TIA-758-C §6.5.

---

### Lesson 2.10 — OTDR Testing: Forward + Reverse Pass, Bidirectional Averaging, Dead Zones
**Duration:** 30 min

The OTDR (Optical Time-Domain Reflectometer) is the primary diagnostic and acceptance tool for OSP fiber. This lesson covers OTDR operating principles (Rayleigh backscatter, Fresnel reflection), launch and receive cable requirements (dead zone masking), reading a trace (event markers, loss slope, connector vs. splice events), and the mandatory bidirectional test practice (forward + reverse pass, then average to eliminate directional artifacts). Defines launch dead zone and event dead zone and explains why a short test cable is not optional. Covers pass/fail thresholds for connectors (≤0.5 dB), splices (≤0.1 dB), and total end-to-end attenuation vs. the link budget. Includes a worked trace-reading exercise.

**Best interactives:** Scenario (read a pre-drawn OTDR trace: identify events, locate fault at km mark, calculate total link loss), flashcard set (dead zones, bidirectional averaging, event types), multiple-choice.

**Sources:** EXFO OTDR application note (public); Viavi/JDSU OTDR user guide training materials (public); ANSI/TIA-526-7 (OFSTP-7, insertion loss measurement — indirect OTDR method); ANSI/TIA-455-61 (FOTP-61, OTDR measurement of optical fibers); BICSI OSP-DRD Manual, Ch. 9; IEC 61300-3-4.

---

### Lesson 2.11 — Power Meter and Light Source Testing: Tier 1 vs. Tier 2
**Duration:** 20 min

Optical power meter / light source (PMLS) testing is faster and simpler than OTDR and is used for end-to-end insertion loss verification. This lesson covers Tier 1 testing (insertion loss only, using a calibrated PMLS pair per ANSI/TIA-526-7 / OFSTP-7), Tier 2 testing (OTDR trace + insertion loss, required for OSP backbone and BICSI certification compliance), and when each tier is required by project specification. Covers the mandated reference condition (one-jumper, two-jumper, or three-jumper reference per TIA-526-7) and how the reference method affects measured insertion loss by up to 0.5 dB. Addresses common measurement errors: dirty adapters, reference jumper degradation, and incorrect reference setup.

**Best interactives:** Multiple-choice, scenario (given a project spec requiring BICSI OSP-DRD compliance, select the correct test tier and reference method), flashcard set.

**Sources:** ANSI/TIA-526-7 (OFSTP-7); ANSI/TIA-526-14 (OFSTP-14 — multimode); Fluke Networks FI-7000 FiberInspector user guide (public); Viavi Solutions OSP testing application note; BICSI OSP-DRD Manual, Ch. 9.

---

### Lesson 2.12 — Acceptance Testing and As-Built Documentation
**Duration:** 25 min

No OSP installation is complete until it passes acceptance testing and the as-built record is filed. This lesson covers the full acceptance checklist: end-face inspection (IEC 61300-3-35 pass/fail zones), insertion loss compliance (ANSI/TIA-568.3-D §6.5 per-span limit), OTDR trace archiving, splice loss per-event compliance, and closure inspection (sealing and weatherproofing). Covers as-built documentation: fiber count and color assignment records, OTDR trace files (.sor format), splice loss logs, test-equipment serial and calibration records. Addresses what a government RUS-funded project (or similar regulated contract) requires for documentation — test data delivered to the owner, chain-of-custody for test instruments.

**Best interactives:** Scenario (compliance audit walkthrough: given a partial test data set, identify what's missing before the project can be accepted), multiple-choice, flashcard set.

**Sources:** IEC 61300-3-35 (end-face inspection and pass/fail criteria); ANSI/TIA-568.3-D §6.5–§6.6; ANSI/TIA-526-7; ANSI/TIA-758-C §9 (acceptance testing requirements); BICSI OSP-DRD Manual, Ch. 9–10; Verizon/AT&T OSP construction practices (publicly available subsets).

---

## Interactive Type Distribution

| Interactive Type | Lesson(s) | Count |
|---|---|---|
| Flashcard set (mandatory every lesson) | 2.1–2.12 | 12 |
| Multiple-choice quiz (mandatory every lesson) | 2.1–2.12 | 12 |
| Scenario (branching / worked problem) | 2.2, 2.3, 2.5, 2.8, 2.10, 2.11, 2.12 | 7 |
| Drag-and-drop | 2.4, 2.6, 2.7, 2.9 | 4 |

Every lesson ships with at minimum one flashcard set and one multiple-choice quiz — matching the Topic 1 baseline. Scenario and drag-drop interactives are placed where they deliver the highest learning value (procedural sequences, field decision trees, trace interpretation) rather than forced into every lesson.

---

## Final Exam Structure (~25 questions)

Cumulative across all 12 lessons. 70% pass threshold. Questions randomized from question bank. Each question cites source standard(s).

| Lesson coverage | Approximate question count |
|---|---|
| 2.1 Cleaving | 2 |
| 2.2 Fusion Splicing I | 3 |
| 2.3 Fusion Splicing II | 2 |
| 2.4 Mass-Fusion | 2 |
| 2.5 Mechanical Splicing | 2 |
| 2.6 Splice Closures | 2 |
| 2.7 Splice Trays | 1 |
| 2.8 Termination Methods | 2 |
| 2.9 Hardened Connectors | 2 |
| 2.10 OTDR Testing | 3 |
| 2.11 Power Meter / Tier Testing | 2 |
| 2.12 Acceptance + As-Built | 2 |
| **Total** | **25** |

Question types: multiple-choice (majority), scenario-based (4–5 questions requiring applying a rule to a field condition rather than recalling a fact).

---

## Citation Source Matrix

| Lesson | IEC Standards | ANSI/TIA Standards | BICSI OSP-DRD | Vendor Manuals |
|---|---|---|---|---|
| 2.1 | IEC 61300-3-35 | — | Ch. 7.3 | Fujikura CT-series; Sumitomo FC-6S |
| 2.2 | IEC 61300-3-4 | — | Ch. 7.4 | Fujikura FSM-series; Sumitomo Type-82; AFL Fitel S179 |
| 2.3 | IEC 61300-3-4 | — | Ch. 7.4 | Fujikura FSM-series; Sumitomo field guides |
| 2.4 | — | — | Ch. 7.4 | Fujikura FSM-60R/70R/90R; Sumitomo Type-71M+ |
| 2.5 | — | — | Ch. 7.3 | Corning UniCam; 3M/Fibrlok guide |
| 2.6 | IEC 60068-2-14 | ANSI/TIA-758-C §7 | Ch. 8 | Corning SCF/SCB; CommScope FOSC; AFL closure guide |
| 2.7 | — | ANSI/TIA-758-C §7.2 | Ch. 8.2 | Corning tray guide; Fujikura accessories |
| 2.8 | — | ANSI/TIA-568.3-D §6.5 | Ch. 7 | Corning UniCam; 3M Hot Melt; AFL Fitel |
| 2.9 | — | ANSI/TIA-758-C §6.5 | Ch. 7.5 | Corning OptiTap; CommScope HOC; AFL drop connector |
| 2.10 | IEC 61300-3-4 | ANSI/TIA-526-7; ANSI/TIA-455-61 | Ch. 9 | EXFO OTDR app note; Viavi OTDR guide |
| 2.11 | — | ANSI/TIA-526-7; ANSI/TIA-526-14 | Ch. 9 | Fluke FI-7000 guide; Viavi OSP testing note |
| 2.12 | IEC 61300-3-35 | ANSI/TIA-568.3-D §6.5–6.6; ANSI/TIA-526-7; ANSI/TIA-758-C §9 | Ch. 9–10 | Verizon/AT&T OSP practices (public subsets) |

---

## Open Questions for User

1. **Splicer brand preference:** The lessons reference Fujikura and Sumitomo as the primary vendor manual sources (dominant in the market). Does the office use a specific splicer brand/model that should be featured more prominently (e.g., Fujikura 70S+, Sumitomo Type-82C, AFL Fitel S179A)? Brand-specific parameter screenshots in the scenarios would make the content more immediately useful for staff training.

2. **OTDR brand for trace scenarios:** Lesson 2.10's scenario is built around a generic OTDR trace. If the office owns a specific brand (EXFO, Viavi, Fluke), the trace exercise can be tailored to that device's UI — makes the exam scenario directly recognizable in the field.

3. **Acceptance testing tier for typical projects:** Does the office's standard RUS/government project specification mandate Tier 2 (OTDR + insertion loss), or is Tier 1 (insertion loss only) sometimes accepted? This sets the emphasis balance in Lesson 2.11 and 2.12.

=== OSP TOPIC 2 DISCOVERY END ===
