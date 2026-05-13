/**
 * Module 11 — Fiber Project Estimation & Revenue Metrics
 * Flashcard deck (6–8 cards)
 *
 * Format matches src/data/flashcards.js conventions:
 *   { id, front, back, tags }
 *
 * Sources documented in docs/research-logs/module11-revenue-estimation.md.
 * Cost numbers carry explicit range + caveat per editorial rules (§5).
 * Union/non-union differential is flagged UNVERIFIED.
 */

export const MODULE11_FLASHCARDS = [
  {
    id: 'm11-cost-medians',
    front:
      'What are the FBA/Cartesian national median deployment costs for aerial vs. underground fiber? (Name the dataset year, not the report publication year.)',
    back:
      'FBA/Cartesian 2023-dataset figures (published January 2024): aerial ≈ US$6.49/ft; underground ≈ US$16.25/ft.\n' +
      'FBA/Cartesian 2024-dataset figures (published February 2025): aerial ≈ US$6.55/ft; underground ≈ US$18.25/ft (+12% underground).\n' +
      'Note: the "2024 Annual Report" covers 2023 data; the "2025 Annual Report" covers 2024 data — always cite by dataset year to avoid mislabeling.\n' +
      'CRITICAL: these are national medians. Observed field range is 10–15× wider — from <US$3/ft (conduit-in-place suburban) to US$40+/ft (urban pavement-cut or rocky rural bore).',
    tags: ['M11', 'cost', 'field-vs-book'],
  },
  {
    id: 'm11-aerial-ug-ratio',
    front:
      'Textbook vs. field: aerial-to-underground cost ratio.',
    back:
      'Textbook (FBA national medians): ≈ 2.5× (2023-dataset: $16.25/$6.49) to ≈ 2.8× (2024-dataset: $18.25/$6.55). Commonly rounded to "about 2×" in study guides. Field practical range: 1.2× to 5×. At 1.2× — suburban corridor with conduit already in place. At 4–5× — dense urban pavement-cut. Make-ready surprises (especially pole replacement) can flip the ratio entirely. "Aerial is half the price" is only true if the poles are clean.',
    tags: ['M11', 'aerial', 'underground', 'field-vs-book'],
  },
  {
    id: 'm11-cphp-vs-cphc',
    front:
      'CPHP vs. CPHC — define both and give the formula linking them.',
    back:
      'Cost per Home Passed (CPHP) = total CapEx ÷ homes passed. Service is available but no drop installed. Cost per Home Connected (CPHC) = total CapEx ÷ homes with active service. Formula: CPHC = CPHP ÷ Take Rate. Example: US$1,200 CPHP at 40% take rate → US$3,000 CPHC. CPHC is ALWAYS higher than CPHP. They are not interchangeable.',
    tags: ['M11', 'CPHP', 'CPHC', 'take-rate', 'FTTH'],
  },
  {
    id: 'm11-homes-trilogy',
    front:
      'Define Homes Passed, Homes Passed Plus, and Homes Connected.',
    back:
      'Homes Passed (HP): fiber is on the street/riser; customer can order — no drop installed. Homes Passed Plus (HP+): drop cable placed to NIU location; service can be activated quickly on demand; adds roughly US$75–400/drop to HP cost. Homes Connected (HC): customer has active service — provisioned, tested, and billing. Financial model lives on HP→HC conversion (take rate × drop-completion rate).',
    tags: ['M11', 'HP', 'HC', 'FTTH', 'KPI'],
  },
  {
    id: 'm11-contract-types',
    front:
      'RFP, lump-sum, T&M, T&M-NTE, GMP — one-line description of each and when to use it.',
    back:
      'RFP: procurement vehicle (not a contract type). Lump-sum: fixed price; contractor carries risk; best when scope is defined and route is surveyed. T&M: owner pays actuals; owner carries risk; best for unknown scope. T&M-NTE: T&M with a not-to-exceed ceiling; most common OSP compromise for partially-known scope. GMP: contractor guarantees a maximum; used on large programs / data-center builds; rare on pure lateral OSP.',
    tags: ['M11', 'contract', 'RFP', 'T&M', 'lump-sum', 'GMP'],
  },
  {
    id: 'm11-contingency-tiers',
    front:
      'What are the field-standard contingency minimums by OSP project type?',
    back:
      'Textbook default: 5% (vendor template — practitioners call this inadequate for OSP). Field minimums (per Let\'s Talk Cabling / practitioner consensus): 10% greenfield aerial or underground; 15% brownfield overlay or splicing in old infrastructure; 20% downtown pavement-cut zone. PLUS: carry a separate materials-escalation line — do not combine it with construction contingency.',
    tags: ['M11', 'contingency', 'escalation', 'field-vs-book'],
  },
  {
    id: 'm11-change-order-drivers',
    front:
      'What are the top drivers of change orders on OSP / FTTH projects?',
    back:
      '#1: Undisclosed utility conflicts (locate misses) — found at the boring head; halts work immediately. #2: Permit-driven schedule shifts — delayed ROW permits push work into overtime or different season. #3: Pole condition surprises — poles that passed desktop audit fail close-up inspection; replacement is added scope. #4: Quantity changes — actual footage or splice count exceeds design due to route revisions. Change-order management hours are a real cost that under-resourced owners forget to budget.',
    tags: ['M11', 'change-orders', 'OSP', 'risk'],
  },
  {
    id: 'm11-splice-productivity',
    front:
      'Textbook vs. field: how should you model fusion-splicing cost?',
    back:
      'Textbook: cite a per-splice price (e.g., US$50–90/splice for small jobs). Field: model crew-day productivity and price the day. Typical: ≈ 60–100 fusion splices per crew-day for a two-person team on 144-ct ribbon in an accessible vault. Loaded crew-day cost ≈ US$700–900 → implied ≈ US$9–12/splice at scale. Unit-cost per splice appears mainly in change orders and very small jobs. Also flag: union vs. non-union labor differential of ≈ 30–50% on loaded labor is widely cited but UNVERIFIED against a single public primary source.',
    tags: ['M11', 'splicing', 'labor', 'field-vs-book', 'unverified'],
  },
];
