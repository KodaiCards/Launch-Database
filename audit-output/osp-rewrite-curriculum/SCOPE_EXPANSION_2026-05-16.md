# OSP Training — Scope Expansion Proposal (2026-05-16)

**Prepared by:** Curriculum Architect (read-only scope expansion analysis)
**Date:** 2026-05-16
**Source:** Carter Trantham scope directive (four additions + one removal)
**Covers:** ARCH.md edits, DAG analysis, course-catalog.js delta, open decisions, risks

---

## 1. Proposed ARCH.md Changes

### 1-A. New General Topic — Headend / CO + Rack-Side Hardware Basics

**Recommended Topic ID:** T19 (next available general ID)
**Recommended teaching position:** 19 — immediately after T17 (Estimation) and before cert-prep C01.

**Rationale for positioning:** The new topic bridges OSP plant (T01–T17) to the inside-plant / ISP world (C01–C03). It assumes OSP vocabulary is complete and introduces headend/rack vocabulary that C01 (Networking Blueprints) currently assumes without introduction. Placing T19 at position 19 makes C01's prereq list cleaner (adds T19 as a hard prereq for C01), closes the vocabulary gap that currently exists between the general track and the RCDD-prep cert topics, and keeps the general track at a natural "boundary of OSP" endpoint before the learner crosses into cert prep.

**DAG prereqs for T19:** T01 (for OSP/ISP vocabulary), T05 (for feeder/aerial topology that terminates at headend), T06 (for underground/conduit that terminates at headend), T14 (for MGN-to-headend-ground-electrode boundary).

**Downstream DAG edge change:** C01 gains T19 as a mandatory prereq (C01 currently lists T01 + T02 as minimums; add T19 to that list, since C01's inside-plant vocabulary is now pre-seeded by T19 rather than assumed from nothing).

**Scope blurb:** Teaches an OSP engineer just enough about the CO/hut/headend and rack-side hardware to design the OSP↔ISP handoff correctly and communicate with ISP technicians without confusion. Explicitly capped at awareness depth — "what it is, what it does, and where the OSP boundary is" — not configuration, not sizing, not full TIA-607 depth. ISP-side depth defers to a future ISP course.

**Lesson count: 10**

| ID | Title | Tier | Est. min | Interactivity | Vocab introduced |
|---|---|---|---|---|---|
| T19.L01 | CO / Hut / Headend — What the Building Is | foundation | 20 | AnnotatedDiagram (headend layout floor plan) | CO, hut, headend, MDF, IDF, equipment room |
| T19.L02 | OLT and CMTS as Black Boxes | foundation | 20 | Quiz (MC + drag-match signal path) | OLT, CMTS, GPON port, DOCSIS, upstream/downstream |
| T19.L03 | –48VDC Power Plant — Why DC, Not AC | working | 25 | WorkedExample (battery backup runtime concept calc) | –48VDC, rectifier, distribution bus, battery string, float voltage |
| T19.L04 | Battery Backup and Generator Transfer | working | 20 | BranchingScenario (power failure sequence) | UPS, generator, ATS (automatic transfer switch), runtime |
| T19.L05 | HVAC and Fire Suppression — Awareness | foundation | 15 | Quiz (MC) | CRAC, sensible heat, clean-agent suppression, pre-action sprinkler |
| T19.L06 | Headend Grounding — Where OSP MGN Terminates | working | 30 | AnnotatedDiagram (MGN-to-headend ground electrode boundary); WorkedExample (ground path trace from pole to rack) | HGER (headend ground electrode ring), TGB (telecommunications grounding busbar), TIA-607-C [confirm at fix time], GES boundary |
| T19.L07 | Rack-Side Hardware — Patch Panels and LIU | working | 25 | AnnotatedDiagram (rack layout with LIU / patch panel); Quiz | patch panel, LIU (Light Interface Unit), interconnect, cross-connect, port density |
| T19.L08 | FOSC and Splice Enclosures in the Headend | working | 20 | AnnotatedDiagram (FOSC inside headend vs. outside plant); Quiz | FOSC, rack-mount FOSC, splice tray, express vs. split fiber |
| T19.L09 | FDH Internals — Beyond the Box | working | 25 | AnnotatedDiagram (FDH modular bay + splitter cassette); BranchingScenario (fiber routing decision at FDH) | FDH, modular bay, splitter cassette, connector field, demarc, drop fiber |
| T19.L10 | T19 Capstone Quiz | capstone-quiz | 30 | Quiz (15Q MC + AnnotatedDiagram identify) | — |

**Source migration:** Net-new for all lessons. M05 §5.1–5.2 (Telecommunications Rooms, MDF/IDF) provides partial migration source for T19.L01 and T19.L07.

**Standards anchor for T19:** TIA-569-E [confirm edition at fix time] (pathways and spaces); TIA-607-C [confirm edition at fix time] (bonding and grounding for telecom); BICSI TDMM (headend layout context); NFPA 76 (telecom fire protection, awareness only).

---

### 1-B. Long-Haul Awareness

**Decision: B2 — new lesson T02.L07b inserted into T02.**

**Rationale:** T02.L07 (Wavelength Windows) already exists as an authored lesson and covers 850/1310/1550/1625 wavelength windows plus CWDM/DWDM at a "what band is it" level. Long-haul introduces coherent optics, mux/demux, and transponder concepts that are meaningfully distinct from the wavelength survey in L07. Expanding L07 would bloat a lesson already at working tier. A standalone lesson immediately after L07 allows the concepts to breathe and makes it easily skippable for learners whose OSP work never reaches long-haul carrier handoffs.

**New lesson to insert:**

| ID | Title | Tier | Est. min | Interactivity | Vocab introduced |
|---|---|---|---|---|---|
| T02.L07b | Long-Haul Awareness — When Feeder Meets a Carrier | working | 25 | AnnotatedDiagram (feeder-to-long-haul handoff point); Quiz (MC) | coherent optics, DWDM channel, transponder, mux/demux (ROADM concept), ILA (in-line amplifier), handoff demarc |

**Scope:** What coherent optics are at a conceptual level ("the transmitter encodes phase and amplitude, not just on/off"), what mux/demux and transponders do ("a transponder converts your 1310 nm signal to a specific DWDM channel wavelength so it can ride a carrier's long-haul fiber"), and why long-haul matters to feeder design ("when your OSP feeder terminates at a CO that connects to a carrier long-haul span, the link budget on the OSP side must leave enough margin for the carrier's transponder input spec"). Depth ceiling: same as the overall T19 depth — enough to have the conversation, not enough to design coherent systems.

**ARCH.md change:** T02 lesson count 12 → 13. Re-number the existing capstone: T02.L12 becomes T02.L13. Insert T02.L07b between L07 and L08 in the lesson table. Estimated minutes for T02: 325 → 350.

**course-catalog.js change:** T02 `lesson_count: 12 → 13`, `estimated_minutes: 325 → 350`.

---

### 1-C. Multimode Cable Coverage — OM1–OM5

**Decision: C1 — new lesson in T03, not a patch to T03.L05.**

**Rationale:** T03.L05 (G.652 vs. G.657 — When to Use Bend-Insensitive) is a specifically-authored lesson about SMF ITU-T fiber classifications. Patching it to also cover OM1–OM5 multimode would make the lesson schizophrenic (SMF ITU-T classification + MMF IEC/TIA classification are completely different standards families). The existing authored lesson file should not be modified to change meaning. A new T03.L06-style lesson keeps each lesson single-topic, matches the existing lesson granularity, and is cleaner for the authoring agent.

**New lesson to add to T03 (insert after current T03.L05, before current T03.L06):**

| ID | Title | Tier | Vocab introduced | Est. min | Interactivity | Source migration |
|---|---|---|---|---|---|---|
| T03.L05b | Multimode Fiber — OM1 through OM5 | working | OM1, OM2, OM3, OM4, OM5, modal dispersion, bandwidth-distance product, LED vs. VCSEL, EMB, ISO/IEC 11801 [confirm edition] | 30 | WorkedExample (OM3 vs OM4 distance limit at 10 GbE); Quiz (MC + drag-match OM grade to distance) | M01 §1.1 partial (MMF reference stripped out of T02); net-new depth |

**Scope:** OM1–OM5 fiber grades (characteristics, construction, typical bandwidth-distance specs), where each shows up in practice (OM1/OM2 = legacy building, OM3/OM4 = current enterprise and data-center horizontal, OM5 = SWDM multisite), the LED vs. VCSEL source distinction and why it matters (LED = overfilled, VCSEL = encircled-flux-compliant, mismatched connectors degrade measured performance), modal dispersion + bandwidth-distance product at a level the learner can use to select the right cable for a short campus run or building entrance segment, and the OSP↔ISP handoff relevance (OM4 is common at the building-to-FDH transition for in-building distribution).

**Standards anchor:** ISO/IEC 11801 (OM grade definitions); TIA-568-C.3 / TIA-568.3-D (multimode specs); IEC 61753-1 for connector performance on MMF.

**ARCH.md change:** T03 lesson count 12 → 13. Re-number current T03.L06 through T03.L12 → T03.L07 through T03.L13. Insert T03.L05b in the table after L05. Estimated minutes for T03: 310 → 340.

**course-catalog.js change:** T03 `lesson_count: 12 → 13`, `estimated_minutes: 310 → 340`.

**Note for fix-agent:** The authored T03 lesson files on disk use zero-indexed filenames. T03.L05b would be a new file `L05b.multimode-om1-om5.jsx` (or `L05-multimode.jsx` — fix-agent picks naming convention consistent with the authored T03 directory). Do NOT renumber existing authored lesson files on disk — that breaks the lessonFileIndex mappings in course-catalog.js. Only re-label in the ARCH.md table. The lessonFileIndex keys for T03.L06–L12 stay as-is; the in-table lesson IDs become L07–L13 in ARCH.md only for the written plan — the file-system IDs are independent of the lesson table numbering once authored.

---

### 1-D. RCDD Mock Exam Removal from OSP Cert Tracks

**ARCH.md change — Section 7 (Per-Cert Mock Exam Spec):** Remove the "BICSI RCDD (v15)" mock exam specification block entirely. That spec block becomes a placeholder note: "RCDD mock exam will live in the future ISP course. Removed per Carter scope directive 2026-05-16."

**ARCH.md change — Section 2, row C04 (Certification Practice Exam Bank):** Remove "RCDD" from the course description and from the prerequisite gating language. The C04 prerequisites change: remove "C01–C03 for RCDD" from the prereq gating note; C04 gating becomes T01–T17 for OSP Designer + T01–T02+T11+T12 for CFOT + CFOT completion for CFOS/O. C01–C03 remain in the catalog as "RCDD-bridge" prep topics (they retain OSP-relevant inside-plant content) but C04 no longer references them as prerequisites for a mock exam track.

**ARCH.md change — Section 9 (Locked Decisions):** Add a line: "RCDD mock exam: REMOVED from OSP course. Belongs to future ISP course. C01 + C02 retain OSP-relevant inside-plant signpost content. Carter locked 2026-05-16."

**course-catalog.js change — certTracks array:** Remove the `C04-RCDD` object entirely. Retained tracks: `C04-OSP`, `C04-CFOT`, `C04-CFOS`.

**ARCH.md change — OSP cert track list sentence** (Section 2 header above cert topics): "3 cert tracks: BICSI OSP Designer + FOA CFOS/CFOT." Remove RCDD from the sentence.

---

## 2. Prerequisite DAG Analysis

### New vocabulary vs. already-authored topics

T19 introduces: CO, hut, headend, OLT, CMTS, MDF, IDF, –48VDC, rectifier, battery string, ATS, CRAC, HGER, TGB, TGB, LIU, FOSC, patch panel, interconnect, cross-connect, FDH (internals), modular bay, splitter cassette, demarc, coherent optics (in T02.L07b).

**DAG violation check against authored topics (T01–T08, T18):**

- T01 introduces "headend" and "OLT" and "ONT" and "FDH" at the anatomy level (T01 vocabulary table in ARCH.md Section 3). These are used correctly as already-defined terms in T19. No violation — T19 teaches the internals of concepts T01 named. ✓
- T14 uses "TGB" implicitly in T14.L05 (IBT/GES placement). TGB is not in T14's explicit vocab-introduced list in ARCH.md Section 3; it's referenced in the lesson title/content but defined under the IBT/GES umbrella. T19.L06 formally introduces TGB. This is a potential forward-reference if T14 lessons use "TGB" as a defined term before T19 is reached. **Flag for fix-agent:** verify authored T14 lesson files do not define TGB as a standalone term; if they do, that definition should be treated as first-introduction and T19.L06 should cross-reference it rather than re-define.
- No other authored topics introduce headend-internal vocab (LIU, CRAC, –48VDC, ATS, HGER, splitter cassette, modular bay). No violations.
- T02.L07b introduces "coherent optics," "transponder," "ROADM," "ILA," "mux/demux" (DWDM context). T02.L07 (existing authored lesson) introduces DWDM at the wavelength-window level. T02.L07b builds directly on T02.L07 — no prereq violation since L07b follows L07 in the sequence.

### Removing RCDD mock exam — DAG impact

C04 is a terminal node. C01/C02/C03 prerequisites for C04's RCDD mock track were the only edges from cert-prep topics to C04. Removing the RCDD mock track from C04 means the C01/C02/C03 → C04 prerequisite edges can be relaxed: C04 no longer requires C01–C03 for any of its remaining mock exam tracks. C04's prereqs reduce to: none required (OSP Designer track gates on T01–T17+T18; CFOT gates on T01+T02+T11+T12; CFOS gates on CFOT). C01, C02, C03 remain in the catalog as standalone cert-prep courses with their own lesson sets — they're just no longer prereqs for C04. No DAG cycle introduced; no downstream violations.

### Cross-curriculum invariant violations introduced

None from items A, B, C, or D. The new T19 topic is inserted at teaching position 19 (after all general topics), so it cannot violate any prereq in T01–T18. The new lessons T02.L07b and T03.L05b are inserted within their respective topics in sequence order; they do not reference vocabulary that comes after them in the DAG.

---

## 3. course-catalog.js Delta (do not apply — show only)

```js
// ── Changes to existing entries ──────────────────────────────────────────────

// T02: lesson_count 12 → 13, estimated_minutes 325 → 350
{
  id: 'T02',
  lesson_count: 13,           // was 12; T02.L07b (long-haul awareness) added
  estimated_minutes: 350,     // was 325; +25 min for T02.L07b
  // all other fields unchanged
},

// T03: lesson_count 12 → 13, estimated_minutes 310 → 340
{
  id: 'T03',
  lesson_count: 13,           // was 12; T03.L05b (multimode OM1–OM5) added
  estimated_minutes: 340,     // was 310; +30 min for T03.L05b
  // all other fields unchanged
},

// C01: add T19 to prerequisites
{
  id: 'C01',
  prerequisites: ['T01', 'T02', 'T19'],  // was ['T01', 'T02']; T19 added
  // all other fields unchanged
},

// C04: prerequisites relaxed (RCDD track removed; C01–C03 no longer required)
{
  id: 'C04',
  prerequisites: [],          // was ['C01', 'C02', 'C03']; gating now inside mock exam surface
  description:
    'Exam strategy, per-domain content reviews (OSP Designer, CFOT, CFOS/O), timed practice rounds, scoring analysis, and final mock exams. Full lesson set authored in OSP-RW.5.',
},

// ── New entry — append after T17 in the courses array (teaching position 19) ─

{
  id: 'T19',
  title: 'Headend / CO + Rack-Side Hardware Basics',
  section: 'general',
  estimated_minutes: 230,     // 10 lessons × ~23 min avg
  lesson_count: 10,
  prerequisites: ['T01', 'T05', 'T06', 'T14'],
  description:
    'CO/hut/headend layout, OLT/CMTS as black boxes, –48VDC power plant, battery backup, HVAC/fire-suppression awareness, headend grounding boundary (OSP MGN to HGER/TGB), rack-side hardware (patch panels, LIU, FOSC, interconnect vs. cross-connect), and FDH internals beyond the box. Depth ceiling: enough for an OSP engineer to design the OSP↔ISP handoff and converse with ISP technicians. ISP-side depth defers to a future ISP course.',
},

// ── certTracks array — remove C04-RCDD object ────────────────────────────────
// DELETE the following object from the certTracks array:
// { id: 'C04-RCDD', title: 'BICSI RCDD (v15) Certification', ... }
// Retain: C04-OSP, C04-CFOT, C04-CFOS

// ── lessonFileIndex — new entries to add when T19 lessons are authored ────────
// (populated by T19 authoring agent — not populated in this proposal)
// 'T19.L01': '../lessons/T19/L01.co-hut-headend-layout.jsx',
// ... (T19.L01–T19.L10)
// New within-topic entries for T02.L07b and T03.L05b:
// 'T02.L07b': '../lessons/T02/L07b.long-haul-awareness.jsx',
// 'T03.L05b': '../lessons/T03/L05b.multimode-om1-om5.jsx',
```

---

## 4. Open Decisions

**Q1 — Teaching position for T19 vs. mid-track insertion.**
This proposal places T19 at position 19 (after T17, before cert track). An alternative is inserting T19 at position 7 or 8 (after T06 / Underground Design), since the headend is the downstream terminus for both aerial and underground runs. Earlier placement means learners understand the destination before learning T07 (Staking) through T17. Later placement (position 19) keeps the general-track progression linear (design → build → test → document → estimation → headend overview). **Recommendation: position 19 (end of general track).** The headend is a context-broadening lesson, not a design prerequisite — a staker doesn't need to know headend internals. But if Carter prefers position 7–8 for the "you need to know where this is all going" framing, that's also architecturally clean.

**Q2 — Whether C01/C02/C03 should remain in the catalog at all.**
With the RCDD mock exam moving to the future ISP course, C01/C02/C03's raison d'être is weakened. They still have useful OSP-adjacent content (TIA-606-D administration, TIA-607 grounding for inside plant, data center awareness) but learners who aren't pursuing RCDD may skip them. **Recommendation: keep them as optional advanced cert-prep courses visible on the splash page but remove them from C04 prereqs.** If Carter wants to fold them into T19 or a future ISP course entirely, that's a separate scope decision.

**Q3 — TGB first-introduction in T14 vs. T19.**
T14 lesson files may already use TGB as a defined term. If they do, T19.L06 should cross-reference T14's definition rather than re-define. Fix-agent must verify. **Recommendation: fix-agent checks authored T14 files; if TGB is not formally vocab-introduced there, T19.L06 owns the first introduction with a cross-reference back to T14's IBT/GES context.**

---

## 5. Risk + Integration Notes

**Risk R1 — Filesystem path stability for T03 and T02 (authored lessons).**
T03 has authored lesson files on disk. Adding T03.L05b between L05 and L06 does NOT require renaming any existing files. The ARCH.md table re-labels the in-table IDs for consistency, but the on-disk filenames (`L06.cable-sheath-jacket-material.jsx` etc.) remain unchanged. The lessonFileIndex keys in course-catalog.js stay as-is. The fix-agent for SCOPE_EXPANSION must NOT rename existing authored lesson files. Only add the new `L05b.multimode-om1-om5.jsx` file and add its lessonFileIndex entry.

**Risk R2 — Same applies to T02.L07b.**
T02 has 12 authored lesson files. Adding L07b does not require renaming L08–L11 on disk. Insert as a new file `L07b.long-haul-awareness.jsx`. Add the lessonFileIndex entry `'T02.L07b'`. The LessonRouter must handle non-sequential lesson-ID keys (it likely already does via the index map rather than a numeric range scan — verify at fix time).

**Risk R3 — T19 ID collision check.**
ARCH.md uses T01–T18 for general topics and C01–C04 for cert topics. T19 is not currently in ARCH.md or course-catalog.js, so no collision. Fix-agent should grep for "T19" in the codebase before inserting to confirm.

**Risk R4 — C04 prereq removal may break any existing progress-unlock logic.**
If the server-side training_progress routes check C04 prerequisites before allowing cert-track access, removing C01–C03 from C04's prereqs changes the unlock behavior. The T01–T17+T18 gate for OSP Designer is already expressed in certTracks[0].required_topics — that's the actual unlock gate. C04's course-level prerequisites were redundant. Removing them is safe IF the SPA uses certTracks[].required_topics for exam access (not courses[].prerequisites). Fix-agent must verify which field the access-control logic reads.

**Risk R5 — ARCH.md lesson-count totals need updating.**
Section 2 footer: "General-track total: 18 topics, ~209 lessons." After adding T19 (10 lessons) + T02.L07b + T03.L05b, the general-track total becomes 19 topics, ~222 lessons. Grand total becomes ~258 lessons. Fix-agent must update the footer sentence in ARCH.md Section 2.

**Risk R6 — Build sequencing in ARCH.md Section 8.**
Batch A currently lists T01, T18, T03. Batch F currently lists T13, T15, T16, T17. T19 should be added to Batch F or as a new Batch G (it depends on T14 being complete, so it cannot run before Batch C is done). Recommended: add T19 to Batch F alongside T17 (same dependency depth — both depend on T05, T06, T14 or T16; both are terminal general topics). Fix-agent updates the batching table.

---

=== SCOPE EXPANSION PROPOSAL END ===
