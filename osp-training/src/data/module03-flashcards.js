/**
 * Module 3 — Permitting & Planning flashcard deck
 *
 * SM-2 compatible shape: { id, front, back, tags }
 * Same structure as src/data/flashcards.js.
 *
 * Sources documented in docs/research-logs/module03-permitting-planning.md.
 * All claims are tagged to their verification status in the back text.
 */

export const MODULE03_FLASHCARDS = [
  {
    id: 'm3-federal-nexus',
    front: 'When does NEPA apply to a fiber broadband project? What is the trigger?',
    back: 'NEPA applies when there is a federal nexus — federal funding (BEAD, BIP, RDOF, FirstNet), a federal permit, or a federal license. If no federal nexus exists, only state and local permitting applies. Source: NTIA NEPA procedures (VERIFIED-public-source).',
    tags: ['M3', 'NEPA', 'federal-nexus'],
  },
  {
    id: 'm3-ce-c8',
    front: 'What is NTIA Categorical Exclusion C-8, and which project type does it cover?',
    back: 'CE C-8 is the NEPA categorical exclusion most BEAD fiber builds rely on. It covers aerial or buried utility/communication construction within or adjacent to existing rights-of-way. Projects using CE C-8 still must document that no extraordinary circumstances apply. NTIA has 47 total CEs. Source: NTIA Notice of Newly Adopted CEs (VERIFIED-public-source).',
    tags: ['M3', 'NEPA', 'CE', 'BEAD'],
  },
  {
    id: 'm3-extraordinary-circumstances',
    front: 'Name four extraordinary circumstances that break NTIA CE C-8 eligibility.',
    back: '(1) Threatened or endangered species or critical habitat. (2) Historic properties listed or eligible for the National Register. (3) Sensitive habitat (wetlands, floodplains, coastal zones). (4) Traditional cultural properties of Native American tribes. A fifth is migratory birds and nesting habitat. Source: NTIA Extraordinary Circumstances slide deck (VERIFIED-public-source).',
    tags: ['M3', 'NEPA', 'CE', 'extraordinary-circumstances'],
  },
  {
    id: 'm3-shpo-clock',
    front: 'How long does the SHPO have to comment under NHPA Section 106, and when does the clock start?',
    back: '30 calendar days — but only after the initiation package is determined adequate (APE map, photos, prior records search). An incomplete letter does not start the clock; it is returned with deficiency comments and the 30-day period restarts on adequate resubmission. Source: NTIA NHPA Section 106 Fact Sheet 2024 (VERIFIED-via-secondary-source).',
    tags: ['M3', 'NHPA', 'Section-106', 'SHPO'],
  },
  {
    id: 'm3-bat-species',
    front: 'Which three bat species are the most common ESA triggers for OSP fiber in the eastern U.S., and what is the primary project-level mitigation?',
    back: '(1) Northern Long-Eared Bat (NLEB) — Endangered since 2022. (2) Tricolored Bat — proposed Endangered since 2022. (3) Indiana Bat — Endangered since 1966. Primary mitigation: time-of-year tree-clearing restrictions during bat pup season. Run USFWS IPaC for project-specific dates. Urban tree canopy qualifies as roost habitat. Source: USFWS program pages via secondary sources (VERIFIED-via-secondary-source).',
    tags: ['M3', 'ESA', 'bats', 'T&E'],
  },
  {
    id: 'm3-gis-deliverable',
    front: 'A municipality says it accepts KMZ for ROW submittals. What should a designer assume about the PDF plan set?',
    back: 'Assume a stamped PDF plan set is also required until you have written confirmation otherwise. GIS (KMZ, shapefile) is the operational artifact the city uses for asset management. The PE-stamped PDF is the legal artifact. "GIS as deliverable" is a growing trend — verified for Pleasanton CA and Florida Turnpike — but it is additional to the stamped PDF, not a replacement. Source: Pleasanton CA Digital Submittal Requirements; Florida Turnpike KMZ Standards (both VERIFIED-public-source).',
    tags: ['M3', 'GIS', 'CAD', 'permits', 'deliverables'],
  },
  {
    id: 'm3-otmr-timeline',
    front: 'Under FCC OTMR (FCC 18-111), what are the two key shot-clock milestones for the pole owner?',
    back: '(1) Pole owner must accept or reject the OTMR application within 10 business days. (2) Pole owner must provide a make-ready survey and estimate within 45 days of the application. Simple communication-space make-ready is then performed in a single visit by the new attacher\'s contractor. Complex work (splicing, supply space, expected outage) reverts to sequential make-ready. Source: FCC 18-111 (VERIFIED-public-source).',
    tags: ['M3', 'make-ready', 'OTMR', 'FCC', 'pole-attachment'],
  },
  {
    id: 'm3-autocad-no-osp-library',
    front: 'What OSP block library does AutoCAD ship with out of the box?',
    back: 'None. AutoCAD has no built-in OSP symbol library (poles, anchors, splice enclosures, handholes, etc.). Every carrier or engineering firm either licenses a third-party block set or maintains an internal standard. Field consequence: new hires spend their first weeks learning the shop\'s internal CAD standard before producing any permitted drawing. Source: Autodesk community forum thread (forum / field practice).',
    tags: ['M3', 'AutoCAD', 'CAD', 'field-vs-book'],
  },
];
