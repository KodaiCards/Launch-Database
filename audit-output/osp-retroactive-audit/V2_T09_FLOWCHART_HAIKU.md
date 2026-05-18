# V2 Verification — T09.L02 Regulatory Agency Call-Order Flowchart

**Lesson:** T09.L02 — NEPA: CE, EA, and EIS  
**Verification scope:** 5-step decision tree (USFWS/SHPO/USACE/RUS/state) presence + integrity  
**Verified by:** Haiku read-only structural audit  
**Date:** 2026-05-18  

---

## Findings

### Primary Finding: PARTIAL COVERAGE — Agency Call-Order Missing

**File reviewed:** `osp-training/src/lessons/T09/L02-nepa-ce-ea-eis.jsx`

**What was promised:** 5-step regulatory agency call-order flowchart (USFWS/SHPO/USACE/RUS/state).

**What's present:**

1. **Extraordinary-circumstances checklist (lines 237-285)** — table listing 6 extraordinary circumstances (T&E, historic properties, wetlands, coastal zones, prime farmland, wild/scenic rivers) + how to check + required action. ✓ Present.

2. **BranchingScenario (lines 424-479)** — CE C-8 screening walkthrough. Node structure:
   - `start` (line 429) — "within or adjacent to existing ROW?" → Yes/Partial
   - `roe-yes` (line 438) — T&E species (NLEB) check → Right/Wrong
   - `roe-partial` (line 447) — field deviation consequence (terminal)
   - `bat-wrong` (line 453) — error correction → back to roe-yes
   - `bat-right` (line 458) — T&E confirmed extraordinary circumstance → "call USFWS or not?"
   - `bat-call` (line 467) — informal USFWS coordination path (terminal)
   - `bat-clear` (line 473) — no-coordination path (terminal)

**What's missing:**

The BranchingScenario covers **CE C-8 type selection + single extraordinary circumstance pathway (T&E species)**, but does NOT implement a **multi-agency sequential call-order decision tree**. 

Specifically:
- No branch for "historic properties triggered → call SHPO FIRST"
- No branch for "wetlands triggered → call USACE FIRST"
- No branch for "RUS vs. NTIA — call RUS Area Director vs. state BEAD office"
- No diagram showing how USFWS → SHPO → USACE → RUS/state calls sequence when MULTIPLE extraordinary circumstances fire
- No guidance on which agency holds primary authority depending on the federal nexus (RUS loan vs. BEAD grant)

**Lesson references:** Line 260 mentions "Section 106 consultation with SHPO" + line 255 mentions "Section 7 consultation with USFWS," but these are footnoted in a table, not walked through a decision sequence.

---

## Secondary Findings

### F2: Quiz alignment with BranchingScenario

**Q2 (lines 502-516)** tests "T&E species extraordinary circumstance → USFWS resolution," which aligns with the lesson's BranchingScenario. ✓ Aligned.

Quiz does NOT test multi-agency call order (no Q asking "when historic properties AND T&E species both present, which agency do you call first?"). Low priority (coverage gap, not an error).

### F3: CE C-8 vs. NTIA CE distinction

**Lines 70-71 key_terms + lines 385-391 advanced section** correctly distinguish CE C-8 (RUS) from NTIA CEs (Commerce Dept. level). ✓ Distinction clear.

### F4: Flashcard coverage

8 flashcards (lines 174-213) cover NEPA, CE, EA, FONSI, EIS, extraordinary circumstances, CE C-8, ESAPTT. ✓ All key_terms covered.

---

## Verdict

**YELLOW** — Partial compliance.

**Strengths:**
- Extraordinary-circumstances checklist is complete (6 circumstances + check methods).
- BranchingScenario successfully walks T&E species + ROW-boundary decisions.
- Flashcards + quiz + acronym table provide foundational vocabulary + comprehension check.
- Advanced section covers RUS vs. NTIA distinction + EA/EIS threshold logic.

**Gaps:**
- **Missing:** 5-step decision tree showing sequential agency call-order when extraordinary circumstances fire. Currently only T&E → USFWS path is walkable. When historic properties (SHPO) + T&E (USFWS) + wetlands (USACE) simultaneously present, user has no guidance on call sequence or authority precedence.
- **Missing:** RUS Area Director vs. state BEAD office decision path (lesson mentions both but doesn't route them in a scenario).

**Recommended polish:**
- Add a second BranchingScenario OR AnnotatedDiagram showing **"Multiple Extraordinary Circumstances — Agency Call Sequence"** with branches for each combination (T&E alone → USFWS; historic + T&E → SHPO + USFWS parallel; wetlands → USACE; coastal → NOAA; etc.).
- OR add quiz Q5 asking "Historic properties + T&E species both present in footprint — which agency coordination must complete first?" to audit whether the lesson implicitly teaches order.

---

## Closeout

Schema validation: ✓ (meta export, key_terms array, vocabulary_assumed valid)  
Vite build status: ✓ (no import errors, component references valid)  
Primary-source verify: ✓ (CEQ removal Jan 8 2026 noted; 7 CFR Part 1b effective April 3 2026 cited; NTIA CE distinction verified)

Lesson is **pedagogically sound on CE type + extraordinary-circumstances identification** but **incomplete on agency call-order sequencing** per the stated verification scope. Recommend L02 revision queue entry for polish-stage addition of multi-agency flowchart or sequential scenario.

---

=== V2_T09_FLOWCHART_HAIKU END ===
