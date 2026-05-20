/**
 * course-catalog.js — hardcoded catalog for the OSP Training SPA.
 *
 * Source of truth: audit-output/osp-rewrite-curriculum/ARCH.md
 *   Section 2  — topic list, lesson counts, DAG prereqs
 *   Section 7  — cert track mock exam specs
 *
 * DO NOT invent lesson counts or prereqs. Every value here is pulled
 * directly from ARCH.md. Any discrepancy = fix ARCH.md first, then update here.
 *
 * section: 'general' | 'cert'
 *   general = rows in ARCH.md Section 2 with category: general (T01–T18)
 *   cert    = rows with category: cert (C01–C04) that have lesson content
 *             (C04 appears in certTracks too — it's the exam bank)
 *
 * Teaching order is the topological sort from ARCH.md Section 3:
 *   T01 → T18 → T02 → T03 → T04 → T09 → T05 → T06 → T19 → T14 → T07 →
 *   T08 → T10 → T11 → T12 → T13 → T15 → T16 → T17 → C04
 *   (C01/C02/C03 migrated to future ISP course per Carter 2026-05-16)
 *
 * prerequisites: list the *topic IDs* that must be completed before this
 * topic unlocks (matches ARCH.md Section 2 "DAG prereqs" column).
 */

// ── General learning topics (18 topics) ────────────────────────────────────
//
// available: true  → tile is clickable on Splash; lessons are authored and wired
// available: false → tile shows "Coming Soon" on Splash; not yet authored
//
// Topics authored and available as of production cut 2026-05-16:
//   T01, T02, T03, T04, T05, T06, T07, T08, T09, T18, T19
// Topics not yet authored (coming soon):
//   T14, T10, T11, T12, T13, T15, T16, T17
//
export const courses = [
  // ── Teaching position 1 ──────────────────────────────────────────────────
  {
    id: 'T01',
    title: 'Fundamentals & Vocabulary',
    section: 'general',
    available: true,
    estimated_minutes: 195,   // 10 lessons × ~20 min avg
    lesson_count: 10,
    prerequisites: [],        // root — no prereqs
    description:
      'Defines the OSP universe: OSP vs. ISP, parts of a pole, parts of a cable, splice-case anatomy, project lifecycle. Every downstream topic assumes this vocabulary.',
  },
  // ── Teaching position 2 ──────────────────────────────────────────────────
  {
    id: 'T18',
    title: 'Safety & OSHA',
    section: 'general',
    available: true,
    estimated_minutes: 240,   // 10 lessons × ~24 min avg (safety = longer)
    lesson_count: 10,
    prerequisites: ['T01'],
    description:
      'OSHA 1910.268, 1910.269, 1910.146 confined space, LOTO, fall protection, PPE, PPG glove classes, traffic control, MAD/MAB awareness. Taught early so every field-touching topic can reference it.',
  },
  // ── Teaching position 3 ──────────────────────────────────────────────────
  {
    id: 'T02',
    title: 'Fiber Physics',
    section: 'general',
    available: true,
    estimated_minutes: 324,   // 12 lessons × ~27 min avg
    lesson_count: 12,
    prerequisites: ['T01'],
    description:
      'Why light travels in glass, attenuation, dispersion, macrobend/microbend, decibels, link budgets, wavelength windows used in OSP.',
  },
  // ── Teaching position 4 ──────────────────────────────────────────────────
  {
    id: 'T03',
    title: 'Cable Selection & Materials',
    section: 'general',
    available: true,
    estimated_minutes: 312,   // 12 lessons × ~26 min avg
    lesson_count: 12,
    prerequisites: ['T01', 'T02'],
    description:
      'Loose-tube vs. ribbon, OSP-rated jackets, armor types, messenger options, RUS-listed materials, fiber-count selection, pulling tension and bend-radius specs.',
  },
  // ── Teaching position 5 ──────────────────────────────────────────────────
  {
    id: 'T04',
    title: 'Route Survey & Pre-Engineering',
    section: 'general',
    available: true,
    estimated_minutes: 240,   // 10 lessons × ~24 min avg
    lesson_count: 10,
    prerequisites: ['T01', 'T18'],
    description:
      'Site walks, drone/LiDAR capture, GIS landbase creation, pole audits, existing-utility identification, route-alternatives analysis, deliverables that hand off to design.',
  },
  // ── Teaching position 6 ──────────────────────────────────────────────────
  {
    id: 'T09',
    title: 'Permitting & Environmental',
    section: 'general',
    available: true,
    estimated_minutes: 315,   // 12 lessons × ~26 min avg
    lesson_count: 12,
    prerequisites: ['T01', 'T04'],
    description:
      'Permitting layer cake (federal/state/county/municipal), NEPA CE C-8, Section 106 NHPA/SHPO/THPO, ESA & IPaC, USACE NWP 12 (2026 reissue), state DOT encroachment, ROW/easement basics.',
  },
  // ── Teaching position 7 ──────────────────────────────────────────────────
  {
    id: 'T05',
    title: 'OSP Design — Aerial',
    section: 'general',
    available: true,
    estimated_minutes: 425,   // 15 lessons × ~28 min avg
    lesson_count: 15,
    prerequisites: ['T01', 'T02', 'T03', 'T04'],
    description:
      'NESC clearances, pole loading, grades of construction, sag/tension, loading districts, joint-use rules, ADSS design, PON/FTTH topology at the distribution level.',
  },
  // ── Teaching position 8 ──────────────────────────────────────────────────
  {
    id: 'T06',
    title: 'OSP Design — Underground',
    section: 'general',
    available: true,
    estimated_minutes: 320,   // 12 lessons × ~27 min avg
    lesson_count: 12,
    prerequisites: ['T01', 'T03', 'T04'],
    description:
      'Conduit/duct selection, burial-depth rules, manhole/handhole/vault sizing, HDD vs. trenching vs. plowing decision matrix, route alignment, separation from foreign utilities.',
  },
  // ── Teaching position 9 ──────────────────────────────────────────────────
  // T19 added 2026-05-16 per Carter (teaching position 9, after T06, before T14)
  {
    id: 'T19',
    title: 'Headend / CO + Rack-Side Hardware Basics',
    section: 'general',
    available: true,
    estimated_minutes: 253,   // 11 lessons × ~23 min avg
    lesson_count: 11,
    prerequisites: ['T01', 'T05', 'T06', 'T18'],
    description:
      'CO/hut/headend layout, OLT/CMTS as black boxes, –48VDC power plant, battery backup, HVAC/fire-suppression awareness, headend grounding boundary (OSP MGN to HGER/TGB — introduces primary protector, IBT-entry, GES-tie-in with forward-references to T14), rack-side hardware (patch panels, LIU, FOSC, interconnect vs. cross-connect), and FDH internals. Depth ceiling: enough for an OSP engineer to design the OSP↔ISP handoff and communicate with ISP technicians. ISP-side depth defers to future ISP course.',
  },
  // ── Teaching position 10 ─────────────────────────────────────────────────
  {
    id: 'T14',
    title: 'Bonding, Grounding & Electrical Protection',
    section: 'general',
    available: true,
    estimated_minutes: 310,   // 12 lessons × ~26 min avg
    lesson_count: 12,
    prerequisites: ['T01', 'T02', 'T05', 'T06', 'T18', 'T19'],  // T19 added: T14.L05 assumes primary protector/IBT-entry/GES-tie-in from T19.L06
    description:
      'Why we ground, ground-resistance targets, MGN bonding, messenger bonding, NEC 250.52 electrodes, IBT/GES (full electrical depth — T19 introduces these terms at CO context level first), TBB/TMGB chain, surge protection, stray voltage detection and LOTO sequencing.',
  },
  // ── Teaching position 11 ─────────────────────────────────────────────────
  {
    id: 'T07',
    title: 'Staking',
    section: 'general',
    available: true,
    estimated_minutes: 245,   // 10 lessons × ~24 min avg
    lesson_count: 10,
    prerequisites: ['T01', 'T04', 'T05', 'T06', 'T18'],
    description:
      'Walking the design on the ground: stake placement, call-out conventions, photographing/coding pole tags, marking proposed attachment points, capturing field measurements for make-ready packets.',
  },
  // ── Teaching position 12 ─────────────────────────────────────────────────
  {
    id: 'T08',
    title: 'Make-Ready & Pole Attachment',
    section: 'general',
    available: true,
    estimated_minutes: 310,   // 12 lessons × ~26 min avg
    lesson_count: 12,
    prerequisites: ['T01', 'T05', 'T07'],
    description:
      'OTMR vs. multi-party, the 15-day FCC clock, simple-vs-complex determinations, transfer/reframe/replacement, reading a make-ready estimate, attachment fees, as-built loop back to the pole owner.',
  },
  // ── Teaching position 13 ─────────────────────────────────────────────────
  {
    id: 'T10',
    title: 'OSP Construction',
    section: 'general',
    available: true,
    estimated_minutes: 315,   // 12 lessons × ~26 min avg
    lesson_count: 12,
    prerequisites: ['T01', 'T06', 'T07', 'T08', 'T18'],
    description:
      'Call-811, HDD/trench/plow execution, conduit fill and pull tension, slack loops, manhole/handhole installation, restoration of pavement and sod, daily field reporting, traffic control integration.',
  },
  // ── Teaching position 14 ─────────────────────────────────────────────────
  {
    id: 'T11',
    title: 'Splicing',
    section: 'general',
    available: true,
    estimated_minutes: 400,   // 15 lessons × ~27 min avg
    lesson_count: 15,
    prerequisites: ['T01', 'T02', 'T03', 'T10'],
    description:
      'Fusion vs. mechanical, core vs. cladding alignment, ribbon/mass splicing, splice-loss budgets, splice-case types, gel-sealing, prep tools, cleave quality, splicer maintenance, TIA-598 color codes.',
  },
  // ── Teaching position 15 ─────────────────────────────────────────────────
  {
    id: 'T12',
    title: 'Testing — OLTS, OTDR, Inspection',
    section: 'general',
    available: true,
    estimated_minutes: 415,   // 15 lessons × ~28 min avg
    lesson_count: 15,
    prerequisites: ['T01', 'T02', 'T11'],
    description:
      'Tier-1 (OLTS) vs. Tier-2 (OTDR), pulse-width selection, dead zones, launch/receive cables, bidirectional averaging, end-face inspection (IEC 61300-3-35), acceptance criteria, dual-wavelength macrobend detection.',
  },
  // ── Teaching position 16 ─────────────────────────────────────────────────
  {
    id: 'T13',
    title: 'Inspection & Quality Assurance',
    section: 'general',
    available: true,
    estimated_minutes: 390,   // 13 lessons × ~30 min avg
    lesson_count: 13,
    prerequisites: ['T01', 'T05', 'T10', 'T12', 'T18'],
    description:
      'Walking constructed plant: visual vs. instrument inspection, pole-top inspection, attachment compliance, depth/cover verification, slack at pedestals, punch-list vs. kick-back triggers, RUS Form 219 close-out workflow, field decision workflow.',
  },
  // ── Teaching position 17 ─────────────────────────────────────────────────
  {
    id: 'T15',
    title: 'Restoration & Outage Response',
    section: 'general',
    available: true,
    estimated_minutes: 250,   // 10 lessons × ~25 min avg
    lesson_count: 10,
    prerequisites: ['T01', 'T11', 'T12', 'T13'],
    description:
      'Fault-locate with OTDR, splice-trailer emergency response, civil-crew coordination, temporary vs. permanent repair, Methods of Procedure (MOPs), customer communications during outages.',
  },
  // ── Teaching position 18 ─────────────────────────────────────────────────
  {
    id: 'T16',
    title: 'As-Built Documentation & GIS',
    section: 'general',
    available: true,
    estimated_minutes: 255,   // 10 lessons × ~25 min avg
    lesson_count: 10,
    prerequisites: ['T01', 'T10', 'T11', 'T13', 'T15'],
    description:
      'What an as-built is, splice matrix schemas, GIS export formats (SHP/GDB/KML), TIA-606-D administration classes, reconciling as-built to as-designed, fiber topology canvas, RUS Form 219 documentation package.',
  },
  // ── Teaching position 19 ─────────────────────────────────────────────────
  {
    id: 'T17',
    title: 'Project Estimation & Revenue',
    section: 'general',
    available: true,
    estimated_minutes: 265,   // 10 lessons × ~26 min avg
    lesson_count: 10,
    prerequisites: ['T01', 'T05', 'T06', 'T08', 'T10', 'T16'],
    description:
      'Cost data realities, aerial-vs-underground ratios, productivity modeling, contract types (lump-sum/T&M/GMP), change orders, contingency, CPHP/CPHC/FTTH KPIs, RFP/RFQ/BOM basics.',
  },
  // ── Teaching position 20 ─────────────────────────────────────────────────
  {
    id: 'T20',
    title: 'RUS Compliance & Federal Programs',
    section: 'general',
    available: true,
    estimated_minutes: 240,   // 10 lessons × ~24 min avg
    lesson_count: 10,
    prerequisites: ['T01', 'T05', 'T06', 'T19'],
    description:
      'RUS borrower programs (1737, 1738, 1740E), engineering standards, form 290 design certification, USOA accounting, federal permitting integration, RUS project lifecycle vs. commercial projects, federal compliance call-order flowchart.',
  },
  // ── Teaching position 21 — CERT PREP ─────────────────────────────────────
  {
    id: 'T21',
    title: 'FOA CFOS/O Cert Prep',
    section: 'cert',            // cert-prep track — NOT general OSP
    available: true,
    estimated_minutes: 250,   // 10 lessons × ~25 min avg
    lesson_count: 10,
    prerequisites: ['T01', 'T02', 'T11', 'T12', 'T18'],
    description:
      'FOA Certified Fiber Optic Specialist—Outside Plant exam preparation. Comprehensive review of all OSP fundamentals + field practices. Requires 2 years field experience (advisory only) + CFOT cert.',
  },
  // ── Teaching position 22 — CERT PREP ─────────────────────────────────────
  {
    id: 'T22',
    title: 'FOA CFOT Cert Prep',
    section: 'cert',            // cert-prep track — NOT general OSP
    available: true,
    estimated_minutes: 215,   // 9 lessons × ~24 min avg
    lesson_count: 9,
    prerequisites: ['T01', 'T02', 'T11', 'T12', 'T18'],
    description:
      'FOA Certified Fiber Optic Technician exam preparation. Intensive review of fiber physics, splicing, testing standards, and hands-on field scenarios. 60 MC / 25 matching / 15 true-false format.',
  },
  // ── Cert-prep topics C01–C03 — MIGRATED TO FUTURE ISP COURSE ────────────
  // Per Carter 2026-05-16: C01/C02/C03 are NOT authored in OSP-RW.
  // They will be authored when the ISP course is scoped and initiated.
  // Retained as catalog entries (section: 'isp') — displayed in the ISP
  // placeholder section, NOT in cert prep.
  {
    id: 'C01',
    title: 'Networking Blueprints (RCDD prep)',
    section: 'isp',
    available: false,
    estimated_minutes: 200,
    lesson_count: 0,           // NOT authored in OSP-RW — migrated to future ISP course
    migrated: true,            // splash page renders "Coming in ISP Course" tile
    prerequisites: ['T01', 'T02', 'T19'],  // T19 added — seeds ISP vocabulary
    description:
      'MIGRATED TO FUTURE ISP COURSE per Carter 2026-05-16. ISP/TIA-568/569/606/607: four telecom spaces, backbone vs. horizontal, TIA-606-D administration, TIA-607 PBB/SBB bonding and grounding for inside plant.',
  },
  {
    id: 'C02',
    title: 'RCDD Core',
    section: 'isp',
    available: false,
    estimated_minutes: 200,
    lesson_count: 0,           // NOT authored in OSP-RW — migrated to future ISP course
    migrated: true,
    prerequisites: ['C01'],
    description:
      'MIGRATED TO FUTURE ISP COURSE per Carter 2026-05-16. Firestopping (UL 1479), EMC/FCC Part 15, power/telecom separation, ICT distribution, RCDD design checklist.',
  },
  {
    id: 'C03',
    title: 'Data Center Standards',
    section: 'isp',
    available: false,
    estimated_minutes: 200,
    lesson_count: 0,           // NOT authored in OSP-RW — migrated to future ISP course
    migrated: true,
    prerequisites: ['C01', 'C02'],
    description:
      'MIGRATED TO FUTURE ISP COURSE per Carter 2026-05-16. TIA-942-C Rated 1–4, Uptime Tier I–IV, MPO/MTP Base-8/Base-12, hot/cold aisle containment, BICSI 002-2024 vs TIA-942-C scope.',
  },
  // ── Certification exam preparation (C04) ─────────────────────────────────
  // C04-RCDD certTrack REMOVED per Carter 2026-05-16. Retained: OSP Designer + CFOT + CFOS/O.
  {
    id: 'C04',
    title: 'BICSI OSP Designer Mock Exam',
    section: 'cert',
    available: true,
    estimated_minutes: 300,   // 1 lesson × 100-question exam, ~120 min
    lesson_count: 1,
    prerequisites: ['T01','T02','T03','T04','T05','T06','T07','T08','T09','T10','T11','T12','T13','T14','T15','T16','T17','T18','T19'],
    description:
      '100-question mock exam aligned to BICSI OSP Designer certification blueprint. Covers 9 job-task competencies across design, construction, testing, and project management. Timed, randomized, with per-domain scoring.',
  },
  // ── Final exam ─────────────────────────────────────────────────────────────
  {
    id: 'C05',
    title: 'OSP Course Final Exam',
    section: 'general',
    available: true,
    estimated_minutes: 90,    // 60-question timed exam
    lesson_count: 1,
    prerequisites: ['T01','T02','T03','T04','T05','T06','T07','T08','T09','T10','T11','T12','T13','T14','T15','T16','T17','T18','T19'],
    description:
      '60-question comprehensive final exam covering all general OSP topics T01–T19. Passing threshold: 80%. Fixed-answer assessment to confirm mastery before certification prep tracks.',
  },
];

// ── Cert tracks (practice-exam surfaces) ───────────────────────────────────
// C04 is both a course with lessons (12) and the exam bank.
// It appears here; the exam access surface is at /training/cert/:certId.
export const certTracks = [
  {
    id: 'C04-OSP',
    title: 'BICSI OSP Designer Certification',
    lesson_count: 0,  // exam-only track — lessons live in T01-T17; this is the exam surface
    required_topics: ['T01','T02','T03','T04','T05','T06','T07','T08','T09',
                      'T10','T11','T12','T13','T14','T15','T16','T17','T18'],
    mock_exam_spec: {
      items: 100,
      time_minutes: 120,
      // BICSI does not publish per-domain percentages. Equal weight across 9 JTA competencies.
      domains_weighting: 'BICSI has not published domain weights for the OSP Designer exam. Items distributed equally across the nine job-task competencies (~11 items each).',
      pass_threshold: 0.70,  // 70% proxy — BICSI publishes pass/fail only. Disclosed as proxy.
    },
  },
  // C04-RCDD REMOVED per Carter 2026-05-16 — migrated to future ISP course.
  // Archived spec: 100 items / 150 min / domains: Define Scope 10% / Design ICT 63% / Bid 11% / Installation 16%.
  {
    id: 'C04-CFOT',
    title: 'FOA CFOT Certification',
    lesson_count: 0,  // exam surface; lessons in T01 + T02 + T11 + T12
    required_topics: ['T01', 'T02', 'T11', 'T12'],
    mock_exam_spec: {
      items: 100,
      time_minutes: 90,  // FOA does not publish exam time; 90 min industry-typical. Disclosed as estimated.
      domains_weighting: '60 MC / 25 matching / 15 true-false. Hands-on portion must be completed at an FOA-Approved school — out of scope for this platform.',
      pass_threshold: 0.70,  // FOA-published
    },
  },
  {
    id: 'C04-CFOS',
    title: 'FOA CFOS/O Certification',
    lesson_count: 0,
    required_topics: ['T01','T02','T11','T12','T13','T15','T16'],
    mock_exam_spec: {
      items: 100,
      time_minutes: 90,  // same disclosure as CFOT
      domains_weighting: '60 MC / 25 matching / 15 true-false. Hands-on portion out of scope. CFOS/O requires CFOT + 2-yr field experience (experience advisory only — platform cannot verify field hours).',
      pass_threshold: 0.70,  // FOA-published
    },
  },
];

// ── Lesson file index ───────────────────────────────────────────────────────
// Maps "TOPIC.L##" → the lesson file's import path (relative to this file).
// Populated incrementally as OSP-RW.4/5 authors each topic's lesson files.
// LessonRouter reads this index to resolve dynamic imports.
//
// Format: key = "T02.L01"  value = "../lessons/T02/L01.fiber-vocabulary.jsx"
// (Paths are relative from src/data/ to src/lessons/)
//
// EMPTY until OSP-RW.4 begins authoring. Placeholder entries go here as
// lesson files are committed.
export const lessonFileIndex = {
  // ── T02 Fiber Physics (template topic — locked in OSP-RW.3) ──────────────
  'T02.L01': '../lessons/T02/L01.why-light-travels-in-glass.jsx',
  'T02.L02': '../lessons/T02/L02.attenuation-three-numbers.jsx',
  'T02.L03': '../lessons/T02/L03.dispersion-why-signals-blur.jsx',
  'T02.L04': '../lessons/T02/L04.macrobend-and-microbend.jsx',
  'T02.L05': '../lessons/T02/L05.decibels-without-algebra-fear.jsx',
  'T02.L06': '../lessons/T02/L06.link-budget-worked-example.jsx',
  'T02.L07': '../lessons/T02/L07.wavelength-windows.jsx',
  'T02.L08': '../lessons/T02/L08.smf-vs-mmf-choosing.jsx',
  'T02.L09': '../lessons/T02/L09.polarization-mode-dispersion.jsx',
  'T02.L10': '../lessons/T02/L10.fiber-characterization-testing.jsx',
  'T02.L11': '../lessons/T02/L11.fiber-physics-field-vs-book.jsx',
  'T02.L12': '../lessons/T02/L12.t02-capstone-quiz.jsx',
  // ── T01 Fundamentals & Vocabulary ────────────────────────────────────────
  'T01.L01': '../lessons/T01/L01.osp-vs-isp.jsx',
  'T01.L02': '../lessons/T01/L02.parts-of-a-pole.jsx',
  'T01.L03': '../lessons/T01/L03.parts-of-a-cable.jsx',
  'T01.L04': '../lessons/T01/L04.inside-a-splice-case.jsx',
  'T01.L05': '../lessons/T01/L05.osp-project-lifecycle.jsx',
  'T01.L06': '../lessons/T01/L06.who-does-what.jsx',
  'T01.L07': '../lessons/T01/L07.reading-a-strand-map.jsx',
  'T01.L08': '../lessons/T01/L08.key-acronyms-field-reference.jsx',
  'T01.L09': '../lessons/T01/L09.osp-standards-landscape.jsx',
  'T01.L10': '../lessons/T01/L10.t01-capstone-quiz.jsx',

  // ── T03 Cable Selection & Materials ──────────────────────────────────────
  'T03.L01': '../lessons/T03/L01.loose-tube-tight-buffer-ribbon.jsx',
  'T03.L02': '../lessons/T03/L02.osp-riser-indoor-outdoor.jsx',
  'T03.L03': '../lessons/T03/L03.armor-jacket-selection.jsx',
  'T03.L04': '../lessons/T03/L04.messenger-lashed-vs-adss.jsx',
  'T03.L05': '../lessons/T03/L05.g652-vs-g657-bend-insensitive.jsx',
  'T03.L06': '../lessons/T03/L06.cable-sheath-jacket-material.jsx',
  'T03.L07': '../lessons/T03/L07.armor-deep-dive.jsx',
  'T03.L08': '../lessons/T03/L08.drop-cable-selection.jsx',
  'T03.L09': '../lessons/T03/L09.adss-span-wind-ice-loading.jsx',
  'T03.L10': '../lessons/T03/L10.icea-cfr-standards-compliance.jsx',
  'T03.L11': '../lessons/T03/L11.cable-spec-reading-datasheet.jsx',
  'T03.L12': '../lessons/T03/L12.t03-capstone.jsx',
  // ── T02 expansion — long-haul awareness (added 2026-05-16) ───────────────
  // NOTE: T02.L07b inserts between existing L07 and L08 in teaching order.
  // On-disk filenames L08–L12 are unchanged; only the lesson sequence position
  // changes (L07b → L08 → L09 → L10 → L11 → capstone).
  // 'T02.L07b': '../lessons/T02/L07b.long-haul-awareness.jsx',  // ← populated when lesson authored

  // ── T03 expansion — OM cable products at OSP↔ISP handoff (2026-05-16) ───
  // T03.L05b inserts between L05 and L06 in teaching order.
  // On-disk filenames T03.L06–L12 are unchanged.
  // 'T03.L05b': '../lessons/T03/L05b.multimode-om-cable-products.jsx',  // ← populated when authored

  // ── T04 Route Survey & Pre-Engineering ────────────────────────────────────
  'T04.L01': '../lessons/T04/L01-site-walk-hazard-recon.jsx',
  'T04.L02': '../lessons/T04/L02-drone-lidar-aerial-survey.jsx',
  'T04.L03': '../lessons/T04/L03-gis-landbase-coordinate-systems.jsx',
  'T04.L04': '../lessons/T04/L04-pole-audit-attachment-measurement.jsx',
  'T04.L05': '../lessons/T04/L05-route-alternatives-comparison.jsx',
  'T04.L06': '../lessons/T04/L06-kmz-shapefile-pdf-deliverables.jsx',
  'T04.L07': '../lessons/T04/L07-47-cfr-32-record-keeping.jsx',
  'T04.L08': '../lessons/T04/L08-handoff-to-design.jsx',
  'T04.L09': '../lessons/T04/L09-rus-pre-engineering.jsx',
  'T04.L10': '../lessons/T04/L10-t04-capstone-quiz.jsx',

  // ── T05 OSP Design — Aerial ───────────────────────────────────────────────
  'T05.L01': '../lessons/T05/L01-what-nesc-is-and-how-to-read-it.jsx',
  'T05.L02': '../lessons/T05/L02-vertical-clearance-rule-232.jsx',
  'T05.L03': '../lessons/T05/L03-comm-to-supply-separation-rule-235.jsx',
  'T05.L04': '../lessons/T05/L04-grades-of-construction.jsx',
  'T05.L05': '../lessons/T05/L05-pole-loading-forces-on-a-pole.jsx',
  'T05.L06': '../lessons/T05/L06-loading-districts-rule-250.jsx',
  'T05.L07': '../lessons/T05/L07-sag-tension-how-cable-hangs.jsx',
  'T05.L08': '../lessons/T05/L08-joint-use-who-owns-what-on-the-pole.jsx',
  'T05.L09': '../lessons/T05/L09-otmr-in-aerial-design.jsx',
  'T05.L10': '../lessons/T05/L10-adss-aerial-design.jsx',
  'T05.L11': '../lessons/T05/L11-opgw-and-hybrid-cables.jsx',
  'T05.L12': '../lessons/T05/L12-pon-ftth-aerial-topology.jsx',
  'T05.L13': '../lessons/T05/L13-make-ready-in-the-design.jsx',
  'T05.L14': '../lessons/T05/L14-aerial-design-qa-checklist.jsx',
  'T05.L15': '../lessons/T05/L15.t05-capstone-quiz.jsx',

  // ── T06 OSP Design — Underground ─────────────────────────────────────────
  'T06.L01': '../lessons/T06/L01-hdd-vs-open-cut-vs-plowing.jsx',
  'T06.L02': '../lessons/T06/L02-burial-depth-rules.jsx',
  'T06.L03': '../lessons/T06/L03-conduit-and-innerduct-selection.jsx',
  'T06.L04': '../lessons/T06/L04-conduit-fill-and-pull-tension.jsx',
  'T06.L05': '../lessons/T06/L05-manhole-handhole-vault-sizing.jsx',
  'T06.L06': '../lessons/T06/L06-separation-from-foreign-utilities.jsx',
  'T06.L07': '../lessons/T06/L07-directional-boring-pilot-and-ream.jsx',
  'T06.L08': '../lessons/T06/L08-riser-pedestal-and-niu-placement.jsx',
  'T06.L09': '../lessons/T06/L09-nesc-underground-rules-sections-32-35.jsx',
  'T06.L10': '../lessons/T06/L10-rus-1751f-643-innerduct-standard.jsx',
  'T06.L11': '../lessons/T06/L11-underground-design-qa-checklist.jsx',
  'T06.L12': '../lessons/T06/L12-t06-capstone-quiz.jsx',

  // ── T07 Staking ───────────────────────────────────────────────────────────
  'T07.L01': '../lessons/T07/L01-what-a-staker-does.jsx',
  'T07.L02': '../lessons/T07/L02-reading-plans-in-the-field.jsx',
  'T07.L03': '../lessons/T07/L03-photographing-and-coding-pole-tags.jsx',
  'T07.L04': '../lessons/T07/L04-measuring-existing-attachments.jsx',
  'T07.L05': '../lessons/T07/L05-staking-notes-rus-form-740.jsx',
  'T07.L06': '../lessons/T07/L06-make-ready-data-collection.jsx',
  'T07.L07': '../lessons/T07/L07-underground-staking-marking-the-route.jsx',
  'T07.L08': '../lessons/T07/L08-katapult-and-gis-staking-tools.jsx',
  'T07.L09': '../lessons/T07/L09-staking-qa-what-the-engineer-reviews.jsx',
  'T07.L10': '../lessons/T07/L10-t07-capstone-quiz.jsx',

  // ── T08 Make-Ready & Pole Attachment ──────────────────────────────────────
  'T08.L01': '../lessons/T08/L01-otmr-vs-multi-party.jsx',
  'T08.L02': '../lessons/T08/L02-the-15-day-clock.jsx',
  'T08.L03': '../lessons/T08/L03-simple-vs-complex-attachment.jsx',
  'T08.L04': '../lessons/T08/L04-transfer-moving-someone-elses-wire.jsx',
  'T08.L05': '../lessons/T08/L05-reframe-adjusting-without-moving.jsx',
  'T08.L06': '../lessons/T08/L06-pole-replacement-in-make-ready.jsx',
  'T08.L07': '../lessons/T08/L07-reading-a-make-ready-estimate.jsx',
  'T08.L08': '../lessons/T08/L08-attachment-fees-and-annual-rents.jsx',
  'T08.L09': '../lessons/T08/L09-application-permit-inspection-path.jsx',
  'T08.L10': '../lessons/T08/L10-as-built-notification-pole-owner.jsx',
  'T08.L11': '../lessons/T08/L11-make-ready-as-pm-problem.jsx',
  'T08.L12': '../lessons/T08/L12-t08-capstone-quiz.jsx',

  // ── T09 Permitting & Environmental ────────────────────────────────────────
  'T09.L01': '../lessons/T09/L01-the-permitting-layer-cake.jsx',
  'T09.L02': '../lessons/T09/L02-nepa-ce-ea-eis.jsx',
  'T09.L03': '../lessons/T09/L03-section-106-historic-properties.jsx',
  'T09.L04': '../lessons/T09/L04-esa-bats-ipac.jsx',
  'T09.L05': '../lessons/T09/L05-usace-wetlands-nwp57.jsx',
  'T09.L06': '../lessons/T09/L06-state-dot-encroachment-permits.jsx',
  'T09.L07': '../lessons/T09/L07-row-easements-private-property.jsx',
  'T09.L08': '../lessons/T09/L08-municipal-row-timelines-reality.jsx',
  'T09.L09': '../lessons/T09/L09-tribal-coordination-thpo-nho.jsx',
  'T09.L10': '../lessons/T09/L10-permit-tracking-pm-problem.jsx',
  'T09.L11': '../lessons/T09/L11-rus-environmental-review.jsx',
  'T09.L12': '../lessons/T09/L12-t09-capstone-quiz.jsx',

  // ── T18 Safety & OSHA ─────────────────────────────────────────────────────
  'T18.L01': '../lessons/T18/L01-hazard-awareness-risk-hierarchy.jsx',
  'T18.L02': '../lessons/T18/L02-lockout-tagout-loto.jsx',
  'T18.L03': '../lessons/T18/L03-confined-space-entry.jsx',
  'T18.L04': '../lessons/T18/L04-fall-protection-poles-aerial-lifts.jsx',
  'T18.L05': '../lessons/T18/L05-ppe-hands-head-eyes-feet.jsx',
  'T18.L06': '../lessons/T18/L06-traffic-control-flagging.jsx',
  'T18.L07': '../lessons/T18/L07-working-near-energized-conductors.jsx',
  'T18.L08': '../lessons/T18/L08-hazardous-materials-osp.jsx',
  'T18.L09': '../lessons/T18/L09-incident-reporting-osha-300.jsx',
  'T18.L10': '../lessons/T18/L10-t18-capstone-quiz.jsx',

  // ── T19 Headend / CO + Rack-Side Hardware Basics ─────────────────────────
  'T19.L01': '../lessons/T19/L01.co-hut-headend-layout.jsx',
  'T19.L02': '../lessons/T19/L02.olt-and-cmts-as-black-boxes.jsx',
  'T19.L03': '../lessons/T19/L03.minus-48vdc-power-plant.jsx',
  'T19.L04': '../lessons/T19/L04.battery-backup-and-generator-transfer.jsx',
  'T19.L05': '../lessons/T19/L05.hvac-and-fire-suppression-awareness.jsx',
  'T19.L06': '../lessons/T19/L06.headend-grounding-osp-mgn-terminates.jsx',
  'T19.L07': '../lessons/T19/L07.rack-side-hardware-patch-panels-liu.jsx',
  'T19.L08': '../lessons/T19/L08.fosc-and-splice-enclosures-in-headend.jsx',
  'T19.L09': '../lessons/T19/L09.fdh-internals-beyond-the-box.jsx',
  'T19.L10': '../lessons/T19/L10.t19-capstone-quiz.jsx',
  'T19.L11': '../lessons/T19/L11.osp-to-isp-handoff-walkthrough.jsx',

  // ── T10 OSP Construction ─────────────────────────────────────────────────
  'T10.L01': '../lessons/T10/L01-call-811-before-you-dig.jsx',
  'T10.L02': '../lessons/T10/L02-hdd-execution.jsx',
  'T10.L03': '../lessons/T10/L03-open-cut-and-plow.jsx',
  'T10.L04': '../lessons/T10/L04-burial-depth-verification.jsx',
  'T10.L05': '../lessons/T10/L05-conduit-pull-tension.jsx',
  'T10.L06': '../lessons/T10/L06-slack-loops.jsx',
  'T10.L07': '../lessons/T10/L07-manhole-and-handhole-installation.jsx',
  'T10.L08': '../lessons/T10/L08-pavement-and-sod-restoration.jsx',
  'T10.L09': '../lessons/T10/L09-traffic-control.jsx',
  'T10.L10': '../lessons/T10/L10-daily-field-reporting.jsx',
  'T10.L11': '../lessons/T10/L11-field-qa-and-inspector-interface.jsx',
  'T10.L12': '../lessons/T10/L12-t10-capstone-quiz.jsx',

  // ── T11 Splicing ─────────────────────────────────────────────────────────
  'T11.L01': '../lessons/T11/L01-why-we-color-code-fibers.jsx',
  'T11.L02': '../lessons/T11/L02-tia598-color-sequence-every-fiber.jsx',
  'T11.L03': '../lessons/T11/L03-splice-loss-four-numbers.jsx',
  'T11.L04': '../lessons/T11/L04-fusion-splicing-step-by-step.jsx',
  'T11.L05': '../lessons/T11/L05-core-align-vs-cladding-align.jsx',
  'T11.L06': '../lessons/T11/L06-cleave-angle-and-arc-quality.jsx',
  'T11.L07': '../lessons/T11/L07-ribbon-mass-fusion-splicing.jsx',
  'T11.L08': '../lessons/T11/L08-mechanical-splicing.jsx',
  'T11.L09': '../lessons/T11/L09-splice-case-types.jsx',
  'T11.L10': '../lessons/T11/L10-gel-seal-heat-shrink-reenterable.jsx',
  'T11.L11': '../lessons/T11/L11-splice-tray-loading-and-fiber-management.jsx',
  'T11.L12': '../lessons/T11/L12-connector-loss-three-numbers.jsx',
  'T11.L13': '../lessons/T11/L13-splicer-maintenance-schedule.jsx',
  'T11.L14': '../lessons/T11/L14-field-hygiene-before-the-first-cleave.jsx',
  'T11.L15': '../lessons/T11/L15-t11-capstone-quiz.jsx',

  // ── T12 Testing — OLTS, OTDR, Inspection ─────────────────────────────────
  'T12.L01': '../lessons/T12/L01-tier-1-vs-tier-2-olts-vs-otdr.jsx',
  'T12.L02': '../lessons/T12/L02-olts-reference-methods-and-bidirectional-loss.jsx',
  'T12.L03': '../lessons/T12/L03-otdr-fundamentals-pulse-range-averaging.jsx',
  'T12.L04': '../lessons/T12/L04-dead-zones-edz-and-adz.jsx',
  'T12.L05': '../lessons/T12/L05-ghost-reflections-coherence-and-masking.jsx',
  'T12.L06': '../lessons/T12/L06-launch-and-receive-cables-mfd-matching.jsx',
  'T12.L07': '../lessons/T12/L07-bidirectional-otdr-when-and-why.jsx',
  'T12.L08': '../lessons/T12/L08-reading-an-otdr-trace.jsx',
  'T12.L09': '../lessons/T12/L09-macrobend-detection-dual-wavelength.jsx',
  'T12.L10': '../lessons/T12/L10-ior-distance-errors-and-cursor-pitfalls.jsx',
  'T12.L11': '../lessons/T12/L11-end-face-inspection-iec-61300-3-35.jsx',
  'T12.L12': '../lessons/T12/L12-pmd-and-cd-measurement.jsx',
  'T12.L13': '../lessons/T12/L13-acceptance-testing-what-passes.jsx',
  'T12.L14': '../lessons/T12/L14-test-documentation-and-reports.jsx',
  'T12.L15': '../lessons/T12/L15-t12-capstone-quiz.jsx',

  // ── T13 Inspection & QA ──────────────────────────────────────────────────
  'T13.L01': '../lessons/T13/L01-inspector-role-and-qa-qc-framework.jsx',
  'T13.L02': '../lessons/T13/L02-pre-construction-acceptance-baseline.jsx',
  'T13.L03': '../lessons/T13/L03-aerial-construction-inspection.jsx',
  'T13.L04': '../lessons/T13/L04-underground-construction-inspection.jsx',
  'T13.L05': '../lessons/T13/L05-slack-storage-and-pedestal-inspection.jsx',
  'T13.L06': '../lessons/T13/L06-material-and-hardware-acceptance.jsx',
  'T13.L07': '../lessons/T13/L07-close-out-documentation-form-219.jsx',
  'T13.L08': '../lessons/T13/L08-joint-use-and-clearance-compliance.jsx',
  'T13.L09': '../lessons/T13/L09-contractor-relations-and-dispute-resolution.jsx',
  'T13.L10': '../lessons/T13/L10-capstone-quiz.jsx',
  'T13.L11': '../lessons/T13/L11-daily-inspection-records-rus-form-565.jsx',
  'T13.L12': '../lessons/T13/L12-federal-compliance-monitoring-davis-bacon.jsx',
  'T13.L13': '../lessons/T13/L13-inspection-day-field-decision-workflow.jsx',

  // ── T14 Bonding, Grounding & Electrical Protection ───────────────────────
  'T14.L01': '../lessons/T14/L01.why-we-ground.jsx',
  'T14.L02': '../lessons/T14/L02.mgn-multi-grounded-neutral.jsx',
  'T14.L03': '../lessons/T14/L03.messenger-bonding-rules.jsx',
  'T14.L04': '../lessons/T14/L04.nec-250-electrodes.jsx',
  'T14.L05': '../lessons/T14/L05.ibt-and-ges.jsx',
  'T14.L06': '../lessons/T14/L06.ground-resistance-testing.jsx',
  'T14.L07': '../lessons/T14/L07.surge-arresters-lightning-protection.jsx',
  'T14.L08': '../lessons/T14/L08.stray-voltage-detection.jsx',
  'T14.L09': '../lessons/T14/L09.cathodic-protection-basics.jsx',
  'T14.L10': '../lessons/T14/L10.rus-bonding-grounding.jsx',
  'T14.L11': '../lessons/T14/L11.nesc-grounds-per-mile.jsx',
  'T14.L12': '../lessons/T14/L12.capstone-quiz.jsx',

  // ── T15 Restoration & Outage Response ────────────────────────────────────
  'T15.L01': '../lessons/T15/L01-outage-response-first-30-minutes.jsx',
  'T15.L02': '../lessons/T15/L02-fault-locate-with-otdr.jsx',
  'T15.L03': '../lessons/T15/L03-physical-route-walk.jsx',
  'T15.L04': '../lessons/T15/L04-temporary-vs-permanent-repair.jsx',
  'T15.L05': '../lessons/T15/L05-splice-trailer-setup.jsx',
  'T15.L06': '../lessons/T15/L06-emergency-civil-work.jsx',
  'T15.L07': '../lessons/T15/L07-customer-communication-during-outages.jsx',
  'T15.L08': '../lessons/T15/L08-method-of-procedure.jsx',
  'T15.L09': '../lessons/T15/L09-post-restoration-as-built-update.jsx',
  'T15.L10': '../lessons/T15/L10-t15-capstone-quiz.jsx',

  // ── T16 As-Built Documentation & GIS ─────────────────────────────────────
  'T16.L01': '../lessons/T16/L01-what-is-an-as-built.jsx',
  'T16.L02': '../lessons/T16/L02-splice-matrix-schema.jsx',
  'T16.L03': '../lessons/T16/L03-tia-606c-administration-classes.jsx',
  'T16.L04': '../lessons/T16/L04-administration-records-links-pathways-locations.jsx',
  'T16.L05': '../lessons/T16/L05-gis-formats-for-as-built-delivery.jsx',
  'T16.L06': '../lessons/T16/L06-reconciling-as-built-to-as-designed.jsx',
  'T16.L07': '../lessons/T16/L07-form-219-documentation-package.jsx',
  'T16.L08': '../lessons/T16/L08-part-32-plant-accounting-as-built.jsx',
  'T16.L09': '../lessons/T16/L09-fiber-topology-canvas.jsx',
  'T16.L10': '../lessons/T16/L10-t16-capstone-quiz.jsx',

  // ── T17 Project Estimation & Revenue ─────────────────────────────────────
  'T17.L01': '../lessons/T17/L01-estimating-mindset-why-medians-lie.jsx',
  'T17.L02': '../lessons/T17/L02-aerial-vs-underground-cost-components.jsx',
  'T17.L03': '../lessons/T17/L03-productivity-modeling.jsx',
  'T17.L04': '../lessons/T17/L04-bill-of-materials.jsx',
  'T17.L05': '../lessons/T17/L05-contract-types.jsx',
  'T17.L06': '../lessons/T17/L06-change-orders.jsx',
  'T17.L07': '../lessons/T17/L07-contingency-and-escalation.jsx',
  'T17.L08': '../lessons/T17/L08-cphp-cphc-kpis.jsx',
  'T17.L09': '../lessons/T17/L09-revenue-modeling-arpu.jsx',
  'T17.L10': '../lessons/T17/L10-t17-capstone-quiz.jsx',

  // ── T20 Federal Programs ─────────────────────────────────────────────────
  'T20.L01': '../lessons/T20/L01.rus-program-structures.jsx',
  'T20.L02': '../lessons/T20/L02.rus-engineering-standards.jsx',
  'T20.L03': '../lessons/T20/L03.rus-forms-and-loan-reporting.jsx',
  'T20.L04': '../lessons/T20/L04.usoa-plant-accounting.jsx',
  'T20.L05': '../lessons/T20/L05.rus-compliance-audit.jsx',
  'T20.L06': '../lessons/T20/L06.federal-permitting.jsx',
  'T20.L07': '../lessons/T20/L07.rus-vs-nesc-tia.jsx',
  'T20.L08': '../lessons/T20/L08.rus-broadband-programs.jsx',
  'T20.L09': '../lessons/T20/L09.contractor-rus-compliance.jsx',
  'T20.L10': '../lessons/T20/L10.federal-compliance-call-order-flowchart.jsx',

  // ── T21 CFOS/O Cert Prep ─────────────────────────────────────────────────
  'T21.L01': '../lessons/T21/L01.cfoso-overview-exam-logistics.jsx',
  'T21.L02': '../lessons/T21/L02.fiber-fundamentals-cable-types-review.jsx',
  'T21.L03': '../lessons/T21/L03.installation-techniques-aerial-underground.jsx',
  'T21.L04': '../lessons/T21/L04.cable-prep-termination.jsx',
  'T21.L05': '../lessons/T21/L05.fusion-splicing-deep-dive.jsx',
  'T21.L06': '../lessons/T21/L06.otdr-testing-acceptance.jsx',
  'T21.L07': '../lessons/T21/L07.safety-workmanship-standards.jsx',
  'T21.L08': '../lessons/T21/L08.make-ready-design-review-checklist.jsx',
  'T21.L09': '../lessons/T21/L09.practice-exam-walkthrough.jsx',
  'T21.L10': '../lessons/T21/L10.mock-exam-100-questions.jsx',

  // ── T22 CFOT Cert Prep ───────────────────────────────────────────────────
  'T22.L01': '../lessons/T22/L01.cfot-overview-exam-structure.jsx',
  'T22.L02': '../lessons/T22/L02.fiber-basics-technician-review.jsx',
  'T22.L03': '../lessons/T22/L03.fusion-splicing-essentials.jsx',
  'T22.L04': '../lessons/T22/L04.testing-otdr-acceptance.jsx',
  'T22.L05': '../lessons/T22/L05.installation-techniques.jsx',
  'T22.L06': '../lessons/T22/L06.safety-osha-workmanship.jsx',
  'T22.L07': '../lessons/T22/L07.troubleshooting-field-issues.jsx',
  'T22.L08': '../lessons/T22/L08.mock-exam-one-75-questions.jsx',
  'T22.L09': '../lessons/T22/L09.mock-exam-two-75-questions.jsx',

  // ── C04 OSP Designer Mock Exam ───────────────────────────────────────────────
  'C04.L01': '../lessons/C04/L01.osp-designer-mock-exam.jsx',

  // ── C05 OSP Final Exam ───────────────────────────────────────────────────────
  'C05.L01': '../lessons/C05/L01.osp-final-exam.jsx',
};
