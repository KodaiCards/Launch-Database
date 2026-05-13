/**
 * module12-flashcards.js
 *
 * Flashcard deck for Module 12 — Final Certification Simulator.
 * Covers: test-taking strategy for RCDD and FOA exams, domain weights,
 * exam structure facts, and ethics of study materials.
 *
 * Shape: { id, front, back, tags[] }
 * Sources: BICSI public certification pages (bicsi.org) and FOA
 * certification pages (thefoa.org) — all VERIFIED-public-source unless noted.
 */

export const MODULE12_FLASHCARDS = [
  {
    id: 'm12-rcdd-structure',
    front: 'BICSI RCDD exam: how many items, how long, and what is the passing score?',
    back:
      '100 scored items | 2.5 hours (150 min) | 70% passing score. ' +
      'Item types include single-best-answer multiple choice, multiple-response, and enhanced matching. ' +
      'Primary reference: TDMM 15th edition. ' +
      '[VERIFIED-public-source: BICSI RCDD certification page and handbook]',
    tags: ['M12', 'RCDD', 'exam-structure'],
  },

  {
    id: 'm12-rcdd-domain-weights',
    front:
      'RCDD exam domain weights — v15 blueprint (CONFIRMED):',
    back:
      'Define Scope of ICT Design: ~10%\n' +
      'Design ICT Solutions: ~63%\n' +
      'Support ICT Bid/Tender Process: ~11%\n' +
      'Support ICT Installation Process: ~16%\n\n' +
      'CONFIRMED: v15 domain weights are identical to the v14 baseline. ' +
      'Red Team verified 2026-05-08 via web search triangulation. ' +
      '[VERIFIED-via-secondary-source as of 2026-05-08]',
    tags: ['M12', 'RCDD', 'domain-weights'],
  },

  {
    id: 'm12-foa-cfos-structure',
    front: 'FOA CFOS/S exam: written structure and what the written score alone does NOT satisfy?',
    back:
      'Written: closed-book, 70% pass threshold (typically 100 questions). ' +
      'A passing written score is NECESSARY BUT NOT SUFFICIENT. ' +
      'CFOS/S also requires a hands-on practical component administered by an FOA-approved school/instructor. ' +
      'The platform cert-sim covers the written domain only — schedule the practical separately. ' +
      '[VERIFIED-via-secondary-source: FOA certifications page and approved-school sites]',
    tags: ['M12', 'FOA', 'CFOS-S', 'exam-structure'],
  },

  {
    id: 'm12-test-taking-scenario',
    front:
      'The RCDD v15 exam includes more scenario-based questions than v14. ' +
      'What study strategy best prepares you for scenario items?',
    back:
      '"Study like a designer, not like a memoriser." ' +
      'Learn WHY a clearance, fill %, or separation value exists — not just the number. ' +
      'Scenario items require you to apply a concept to a situation you have not memorized. ' +
      'r/RCDD forum consensus: 80–150 hours on TDMM 15 cover-to-cover twice, ' +
      'emphasizing chapters relevant to the Design domain (~63% of exam). ' +
      '[VERIFIED-via-secondary-source: engineerboards.com RCDD thread; r/RCDD 2024-2025 posts]',
    tags: ['M12', 'study-strategy', 'scenario'],
  },

  {
    id: 'm12-enhanced-matching',
    front:
      'What is an "enhanced matching" item type on the BICSI exam, and why does it surprise candidates?',
    back:
      'Enhanced matching presents a set of options and a set of targets; ' +
      'each option is matched to one or more targets. ' +
      'It is harder than multiple-choice because: (1) partial-credit scoring is not always obvious, ' +
      'and (2) you must know the full relationship, not just identify the best single answer. ' +
      'Per candidate forum reports, ~5–10% of RCDD items are enhanced matching or multiple-response. ' +
      '[VERIFIED-via-secondary-source: r/RCDD and certforums.com; BICSI item-type descriptions are public]',
    tags: ['M12', 'RCDD', 'enhanced-matching', 'item-types'],
  },

  {
    id: 'm12-osp-exam',
    front: 'BICSI OSP Designer exam: how many items, how long, and primary reference?',
    back:
      '100 scored items | 2 hours (120 min) | Passing score: 70% ' +
      '[VERIFIED-via-secondary-source]. ' +
      'Primary reference: BICSI OSPDRM (Outside Plant Design Reference Manual) 6th edition. ' +
      'Eligibility requires 2 years of verifiable full-time-equivalent OSP experience AND ' +
      'a current qualifying BICSI credential (or accepted alternative). ' +
      '[VERIFIED-via-secondary-source: BICSI OSP page and multiple prep providers]',
    tags: ['M12', 'OSP-Designer', 'exam-structure'],
  },

  {
    id: 'm12-ethics-dumps',
    front:
      'Why must you NOT use exam-dump sites (ITExams, ExamTopics, dumpsarena, SPOTO, etc.) ' +
      'to prepare for BICSI or FOA certifications?',
    back:
      'Exam-dump sites host leaked or reverse-engineered questions, often verbatim. ' +
      'Using them:\n' +
      '1. Violates the BICSI and FOA codes of conduct.\n' +
      '2. Can result in revocation of your certification upon discovery.\n' +
      '3. Teaches recognition of specific questions rather than understanding — ' +
      'so you may pass but cannot apply the knowledge on the job.\n\n' +
      'This platform\'s cert-sim is 100% original content written from public standards and blueprints. ' +
      'Cite sources; never cite a dump site.',
    tags: ['M12', 'ethics', 'exam-integrity'],
  },

  {
    id: 'm12-time-management',
    front:
      'On a 100-item / 150-minute exam (RCDD), how much time should you budget per item, ' +
      'and what is the recommended triage strategy?',
    back:
      'Budget: 150 min / 100 items = 1.5 minutes per item average. ' +
      'Strategy:\n' +
      '1. Answer confidently-known questions immediately.\n' +
      '2. Flag uncertain items for review — do not spend > 2 min on any single item on the first pass.\n' +
      '3. Return to flagged items with remaining time.\n' +
      '4. On multiple-response items: eliminate clearly wrong choices first, ' +
      'then commit to the best-fitting set.\n' +
      '5. Never leave a question blank — there is no penalty for guessing in most BICSI exams ' +
      '(confirm with BICSI handbook at time of exam). ' +
      '[Study-community consensus; verify no-penalty rule in current BICSI Candidate Handbook]',
    tags: ['M12', 'test-taking', 'time-management'],
  },
];
