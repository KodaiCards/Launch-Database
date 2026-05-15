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
 *   T01 → T18 → T02 → T03 → T04 → T09 → T05 → T06 → T14 → T07 →
 *   T08 → T10 → T11 → T12 → T13 → T15 → T16 → T17 →
 *   C01 → C02 → C03 → C04
 *
 * prerequisites: list the *topic IDs* that must be completed before this
 * topic unlocks (matches ARCH.md Section 2 "DAG prereqs" column).
 */

// ── General learning topics (18 topics) ────────────────────────────────────
export const courses = [
  // ── Teaching position 1 ──────────────────────────────────────────────────
  {
    id: 'T01',
    title: 'Fundamentals & Vocabulary',
    section: 'general',
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
    estimated_minutes: 325,   // 12 lessons × ~27 min avg
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
    estimated_minutes: 310,   // 12 lessons × ~26 min avg
    lesson_count: 12,
    prerequisites: ['T01', 'T02'],
    description:
      'Loose-tube vs. ribbon vs. rollable-ribbon, OSP-rated jackets, armor types, messenger options, RUS-listed materials, fiber-count selection, pulling tension and bend-radius specs.',
  },
  // ── Teaching position 5 ──────────────────────────────────────────────────
  {
    id: 'T04',
    title: 'Route Survey & Pre-Engineering',
    section: 'general',
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
    estimated_minutes: 320,   // 12 lessons × ~27 min avg
    lesson_count: 12,
    prerequisites: ['T01', 'T03', 'T04'],
    description:
      'Conduit/duct selection, burial-depth rules, manhole/handhole/vault sizing, HDD vs. trenching vs. plowing decision matrix, route alignment, separation from foreign utilities.',
  },
  // ── Teaching position 9 ──────────────────────────────────────────────────
  {
    id: 'T14',
    title: 'Bonding, Grounding & Electrical Protection',
    section: 'general',
    estimated_minutes: 310,   // 12 lessons × ~26 min avg
    lesson_count: 12,
    prerequisites: ['T01', 'T02', 'T05', 'T06', 'T18'],
    description:
      'Why we ground, ground-resistance targets, MGN bonding, messenger bonding, NEC 250.52 electrodes, IBT/GES, surge protection, stray voltage detection and LOTO sequencing.',
  },
  // ── Teaching position 10 ─────────────────────────────────────────────────
  {
    id: 'T07',
    title: 'Staking',
    section: 'general',
    estimated_minutes: 245,   // 10 lessons × ~24 min avg
    lesson_count: 10,
    prerequisites: ['T01', 'T04', 'T05', 'T06', 'T18'],
    description:
      'Walking the design on the ground: stake placement, call-out conventions, photographing/coding pole tags, marking proposed attachment points, capturing field measurements for make-ready packets.',
  },
  // ── Teaching position 11 ─────────────────────────────────────────────────
  {
    id: 'T08',
    title: 'Make-Ready & Pole Attachment',
    section: 'general',
    estimated_minutes: 310,   // 12 lessons × ~26 min avg
    lesson_count: 12,
    prerequisites: ['T01', 'T05', 'T07'],
    description:
      'OTMR vs. multi-party, the 15-day FCC clock, simple-vs-complex determinations, transfer/reframe/replacement, reading a make-ready estimate, attachment fees, as-built loop back to the pole owner.',
  },
  // ── Teaching position 12 ─────────────────────────────────────────────────
  {
    id: 'T10',
    title: 'OSP Construction',
    section: 'general',
    estimated_minutes: 315,   // 12 lessons × ~26 min avg
    lesson_count: 12,
    prerequisites: ['T01', 'T06', 'T07', 'T08', 'T18'],
    description:
      'Call-811, HDD/trench/plow execution, conduit fill and pull tension, slack loops, manhole/handhole installation, restoration of pavement and sod, daily field reporting, traffic control integration.',
  },
  // ── Teaching position 13 ─────────────────────────────────────────────────
  {
    id: 'T11',
    title: 'Splicing',
    section: 'general',
    estimated_minutes: 400,   // 15 lessons × ~27 min avg
    lesson_count: 15,
    prerequisites: ['T01', 'T02', 'T03', 'T10'],
    description:
      'Fusion vs. mechanical, core vs. cladding alignment, ribbon/mass splicing, splice-loss budgets, splice-case types, gel-sealing, prep tools, cleave quality, splicer maintenance, TIA-598 color codes.',
  },
  // ── Teaching position 14 ─────────────────────────────────────────────────
  {
    id: 'T12',
    title: 'Testing — OLTS, OTDR, Inspection',
    section: 'general',
    estimated_minutes: 415,   // 15 lessons × ~28 min avg
    lesson_count: 15,
    prerequisites: ['T01', 'T02', 'T11'],
    description:
      'Tier-1 (OLTS) vs. Tier-2 (OTDR), pulse-width selection, dead zones, launch/receive cables, bidirectional averaging, end-face inspection (IEC 61300-3-35), acceptance criteria, dual-wavelength macrobend detection.',
  },
  // ── Teaching position 15 ─────────────────────────────────────────────────
  {
    id: 'T13',
    title: 'Inspection & Quality Assurance',
    section: 'general',
    estimated_minutes: 250,   // 10 lessons × ~25 min avg
    lesson_count: 10,
    prerequisites: ['T01', 'T05', 'T10', 'T12', 'T18'],
    description:
      'Walking constructed plant: visual vs. instrument inspection, pole-top inspection, attachment compliance, depth/cover verification, slack at pedestals, punch-list vs. kick-back triggers, RUS Form 219 close-out workflow.',
  },
  // ── Teaching position 16 ─────────────────────────────────────────────────
  {
    id: 'T15',
    title: 'Restoration & Outage Response',
    section: 'general',
    estimated_minutes: 250,   // 10 lessons × ~25 min avg
    lesson_count: 10,
    prerequisites: ['T01', 'T11', 'T12', 'T13'],
    description:
      'Fault-locate with OTDR, splice-trailer emergency response, civil-crew coordination, temporary vs. permanent repair, Methods of Procedure (MOPs), customer communications during outages.',
  },
  // ── Teaching position 17 ─────────────────────────────────────────────────
  {
    id: 'T16',
    title: 'As-Built Documentation & GIS',
    section: 'general',
    estimated_minutes: 255,   // 10 lessons × ~25 min avg
    lesson_count: 10,
    prerequisites: ['T01', 'T10', 'T11', 'T13', 'T15'],
    description:
      'What an as-built is, splice matrix schemas, GIS export formats (SHP/GDB/KML), TIA-606-D administration classes, reconciling as-built to as-designed, fiber topology canvas, RUS Form 219 documentation package.',
  },
  // ── Teaching position 18 ─────────────────────────────────────────────────
  {
    id: 'T17',
    title: 'Project Estimation & Revenue',
    section: 'general',
    estimated_minutes: 265,   // 10 lessons × ~26 min avg
    lesson_count: 10,
    prerequisites: ['T01', 'T05', 'T06', 'T08', 'T10', 'T16'],
    description:
      'Cost data realities, aerial-vs-underground ratios, productivity modeling, contract types (lump-sum/T&M/GMP), change orders, contingency, CPHP/CPHC/FTTH KPIs, RFP/RFQ/BOM basics.',
  },
  // ── Cert-prep topics with lesson content (C01–C03) ───────────────────────
  {
    id: 'C01',
    title: 'Networking Blueprints (RCDD prep)',
    section: 'cert',
    estimated_minutes: 200,   // 8 lessons × ~25 min avg
    lesson_count: 8,
    prerequisites: ['T01', 'T02'],  // minimum per ARCH.md; full general track recommended
    description:
      'ISP/TIA-568/569/606/607: four telecom spaces, backbone vs. horizontal, TIA-606-D administration, TIA-607 PBB/SBB bonding and grounding for inside plant.',
  },
  {
    id: 'C02',
    title: 'RCDD Core',
    section: 'cert',
    estimated_minutes: 200,   // 8 lessons × ~25 min avg
    lesson_count: 8,
    prerequisites: ['C01'],
    description:
      'Firestopping (UL 1479), EMC/FCC Part 15, power/telecom separation, ICT distribution, RCDD design checklist. Requires C01 as foundation.',
  },
  {
    id: 'C03',
    title: 'Data Center Standards',
    section: 'cert',
    estimated_minutes: 200,   // 8 lessons × ~25 min avg
    lesson_count: 8,
    prerequisites: ['C01', 'C02'],
    description:
      'TIA-942-C Rated 1–4, Uptime Tier I–IV, MPO/MTP Base-8/Base-12, hot/cold aisle containment, BICSI 002-2024 vs TIA-942-C scope.',
  },
  // ── Certification exam preparation (C04) ─────────────────────────────────
  {
    id: 'C04',
    title: 'Practice Exam Bank',
    section: 'cert',
    estimated_minutes: 300,   // 12 lessons × ~25 min avg
    lesson_count: 12,
    prerequisites: ['C01', 'C02', 'C03'],
    description:
      'Exam strategy, per-domain content reviews (OSP, RCDD, CFOT/CFOS), timed practice rounds, scoring analysis, and final mock exams. Full lesson set authored in OSP-RW.5.',
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
  {
    id: 'C04-RCDD',
    title: 'BICSI RCDD (v15) Certification',
    lesson_count: 0,  // exam surface; lessons in C01 + C02
    required_topics: ['C01', 'C02'],
    mock_exam_spec: {
      items: 100,
      time_minutes: 150,
      // BICSI RCDD v15 published domain weights
      domains_weighting: 'Define Scope 10% / Design ICT Solutions 63% / Bid/Tender 11% / Installation Support 16%',
      pass_threshold: 0.70,  // 70% proxy; disclosed as proxy
    },
  },
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
  // ── Additional topics populated by authoring agents in OSP-RW.4/5 ────────
  // NOTE: Each authoring agent MUST add their lesson entries here as part of
  //       each lesson commit. An uncommented entry is mandatory — lessons not
  //       listed here will render LessonPlaceholder (unreachable) at runtime.
};
