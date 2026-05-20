// C05.L01 — OSP Course Final Exam (60 Questions, Comprehensive Assessment)
// Covers all general topics T01–T19 proportionally.
// Scores persisted via POST /api/training/cert-attempt (cert_track: 'OSP-Designer')
// and POST /api/training/progress (lesson completion).
//
// Pass threshold: 80% (48/60).
// Timed: 90 minutes with auto-submit on expiry.
// Per-domain breakdown shown in results view.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';

// ── Meta export ─────────────────────────────────────────────────────────────

export const meta = {
  id: 'C05.L01',
  course_id: 'C05',
  title: 'OSP Course Final Exam',
  order: 1,
  lesson_type: 'mock-exam',
  prerequisites: [
    'T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09',
    'T10', 'T11', 'T12', 'T13', 'T14', 'T15', 'T16', 'T17', 'T18', 'T19',
  ],
  learning_objectives: [
    'Demonstrate mastery of all OSP engineering topics from T01 (Fundamentals) through T19 (Headend/CO Hardware Basics)',
    'Apply integrated knowledge to complex, real-world OSP scenarios across design, construction, testing, and operations',
    'Achieve a minimum score of 80% (48/60) to confirm readiness for field work or advanced certification preparation',
    'Identify personal knowledge gaps for targeted study using per-topic score breakdown',
  ],
  vocabulary_introduced: [],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'NESC', source_lesson_id: 'T05.L01' },
    { term: 'attenuation', source_lesson_id: 'T02.L02' },
    { term: 'splice', source_lesson_id: 'T11.L01' },
    { term: 'make-ready', source_lesson_id: 'T08.L01' },
    { term: 'OTDR', source_lesson_id: 'T12.L01' },
    { term: 'FDH', source_lesson_id: 'T19.L09' },
  ],
  key_terms: [],
  estimated_minutes: 90,
};

// ── Question bank (60 questions) ────────────────────────────────────────────
// Distribution: T01×4, T02×5, T03×3, T04×3, T05×5, T06×4, T07×2, T08×4,
//               T09×4, T10×3, T11×4, T12×4, T13×3, T14×4, T15×2, T16×2,
//               T17×2, T18×4, T19×2 = 64 written → trim T07, T15, T16, T17 by 1 each = 60.
// Source lesson cited in JSX comment above each question for traceability.

const QUESTIONS = [
  // ─── T01 Fundamentals & Vocabulary (4 questions) ────────────────────────

  // Source: T01.L04 — Inside a Splice Case
  {
    id: 'F01',
    topic: 'T01',
    topicLabel: 'Fundamentals & Vocabulary',
    prompt:
      'In a dome-style aerial splice closure, the entry port serves which primary function?',
    choices: [
      'Routes water away from the splice trays',
      'Provides a controlled-environment cable entry point where fibers transition to the splice region while maintaining the environmental seal',
      'Anchors the strength members to the closure body',
      'Supplies thermal insulation for the fusion joints',
    ],
    answerIndex: 1,
    explanation:
      'The entry port (also called a cable port or entry fitting) is the sealed interface where the incoming cable enters the closure. It must maintain the environmental seal against moisture and contaminants while allowing fiber transition to the internal splice trays. Strength-member anchoring and water routing are separate functions handled by other closure features. (T01.L04; RUS 1751F-630 §6)',
  },

  // Source: T01.L02 — Parts of a Pole
  {
    id: 'F02',
    topic: 'T01',
    topicLabel: 'Fundamentals & Vocabulary',
    prompt:
      'On a joint-use utility pole, which attachment zone is closest to the ground under NESC conventions?',
    choices: [
      'Supply space (electric utility)',
      'Neutral conductor',
      'Communications space (telecom)',
      'Streetlight fixture',
    ],
    answerIndex: 2,
    explanation:
      'NESC Rule 230 establishes a three-zone hierarchy from top to bottom: (1) supply conductors (power utility) at the top, (2) neutral conductor / streetlights in the middle, and (3) communications cables (telephone, cable TV, fiber) in the lowest zone. This separation provides isolation between the higher-voltage supply lines and the lower-voltage communications plant. (T01.L02; NESC C2 Rule 230)',
  },

  // Source: T01.L08 — Key Acronyms Field Reference
  {
    id: 'F03',
    topic: 'T01',
    topicLabel: 'Fundamentals & Vocabulary',
    prompt:
      'TIA-598-D assigns the following 12-color sequence to fiber ribbons. What color is position 5?',
    choices: [
      'White',
      'Brown',
      'Slate',
      'Green',
    ],
    answerIndex: 2,
    explanation:
      'TIA-598-D 12-color sequence (positions 1–12): Blue, Orange, Green, Brown, Slate, White, Red, Black, Yellow, Violet, Rose, Aqua. Position 5 = Slate. This sequence applies to buffer tubes, fiber ribbons, and jacketed fibers in OSP cables. (T01.L08; TIA-598-D)',
  },

  // Source: T01.L05 — OSP Project Lifecycle
  {
    id: 'F04',
    topic: 'T01',
    topicLabel: 'Fundamentals & Vocabulary',
    prompt:
      'For a RUS-funded project, what makes the as-built documentation the critical contractual deliverable (not the as-designed drawings)?',
    choices: [
      'As-built reflects actual field conditions, confirming the network matches the funded investment agreement',
      'As-built replaces the design drawings for future maintenance',
      'As-designed is discarded after construction begins',
      'RUS only funds as-built documentation, not design drawings',
    ],
    answerIndex: 0,
    explanation:
      'As-designed drawings capture the engineer\'s intent before construction. As-built documents record what was actually constructed — pole locations vary, spans differ, splices may shift. For RUS programs, the as-built (including Form 219 Close-Out Report) is the proof that the funded network was built as agreed. Discrepancies between as-designed and as-built are documented variances. (T01.L05; RUS Form 219)',
  },

  // ─── T02 Fiber Physics (5 questions) ────────────────────────────────────

  // Source: T02.L04 — Macrobend and Microbend
  {
    id: 'F05',
    topic: 'T02',
    topicLabel: 'Fiber Physics',
    prompt:
      'G.652.D fiber is rated for a 30 mm installation bend radius. A conduit route requires a 20 mm bend. What is the expected consequence?',
    choices: [
      'No consequence — the specification is conservative and real fibers tolerate smaller bends',
      'Measurable macrobend loss at this location, typically 0.1–1.0 dB per bend event',
      'Temporary loss only during the pull; fiber returns to normal after tension is released',
      'Loss only occurs at wavelengths below 1310 nm',
    ],
    answerIndex: 1,
    explanation:
      'When a singlemode fiber is bent below its rated minimum bend radius, higher-order mode cutoff shifts, causing light to leak out of the core — macrobend loss. G.652.D at 20 mm (below the 30 mm install spec) produces measurable permanent loss of roughly 0.1–1.0 dB per bend location depending on severity. The loss does NOT reverse when the bend is released. G.657.A1/A2 bend-insensitive fibers are specified for tight-bend applications. (T02.L04; ITU-T G.652.D; IEC 60793-2-50)',
  },

  // Source: T02.L06 — Link Budget Worked Example
  {
    id: 'F06',
    topic: 'T02',
    topicLabel: 'Fiber Physics',
    prompt:
      'A 15 km link at 1310 nm has 3 fusion splices at 0.1 dB each and 2 connectors at 0.5 dB each. Fiber attenuation is 0.35 dB/km. What is the total optical link loss?',
    choices: [
      '5.25 dB',
      '6.55 dB',
      '5.55 dB',
      '7.05 dB',
    ],
    answerIndex: 1,
    explanation:
      'Fiber loss: 15 km × 0.35 dB/km = 5.25 dB. Splice loss: 3 × 0.1 dB = 0.30 dB. Connector loss: 2 × 0.5 dB = 1.00 dB. Total: 5.25 + 0.30 + 1.00 = 6.55 dB. This calculation is the Tier 1 (OLTS) reference for link acceptance testing. The result must be compared against the optical power budget (transmit power minus receiver sensitivity) with a margin of at least 3 dB. (T02.L06; TIA-568.3-D Annex C)',
  },

  // Source: T02.L08 — SMF vs. MMF Choosing
  {
    id: 'F07',
    topic: 'T02',
    topicLabel: 'Fiber Physics',
    prompt:
      'Why is G.652.D singlemode fiber (SMF) preferred over OM4 multimode for a 12-mile OSP feeder route?',
    choices: [
      'SMF is less expensive than OM4 for OSP applications',
      'OM4 multimode cannot be fusion-spliced in the field',
      'SMF eliminates modal dispersion, allowing transmission over 12+ miles without bandwidth limitation from fiber type',
      'RUS Bulletin 1751F-630 prohibits multimode fiber in rural telecom networks',
    ],
    answerIndex: 2,
    explanation:
      'OM4 multimode fiber\'s bandwidth-distance product limits it to ~2 km at 25 Gbps (VCSEL launch). At 12 miles (~19 km), only singlemode fiber is practical because SMF has a single propagation mode and is dispersion-limited only by chromatic and polarization mode dispersion (far less limiting). RUS-funded rural networks universally specify G.652.D or G.657-series SMF. (T02.L08; RUS 1751F-630 §4; ITU-T G.652.D)',
  },

  // Source: T02.L03 — Dispersion: Why Signals Blur
  {
    id: 'F08',
    topic: 'T02',
    topicLabel: 'Fiber Physics',
    prompt:
      'Chromatic dispersion causes signal pulse spreading proportional to the source\'s spectral width. At 1550 nm on G.652.D (17 ps/nm·km), a 0.1 nm spectral-width DFB laser over 80 km creates total dispersion of:',
    choices: [
      '13.6 ps',
      '136 ps',
      '1360 ps',
      '1.36 ps',
    ],
    answerIndex: 1,
    explanation:
      'Total chromatic dispersion = D × Δλ × L = 17 ps/nm·km × 0.1 nm × 80 km = 136 ps. At 10 Gbps (bit period ≈ 100 ps), 136 ps of dispersion is significant — it spreads each bit by 1.36× its time slot. This is within reach for 10G with some margin but approaches limits. Coherent systems (100G+) use DSP-based dispersion compensation, making G.652.D viable for long-haul. (T02.L03; ITU-T G.952)',
  },

  // Source: T02.L02 — Attenuation Three Numbers
  {
    id: 'F09',
    topic: 'T02',
    topicLabel: 'Fiber Physics',
    prompt:
      'The three standard wavelength windows used for OSP singlemode fiber transmission are (in ascending wavelength order):',
    choices: [
      '850 nm, 1300 nm, 1550 nm',
      '1310 nm, 1490 nm, 1550 nm',
      '1250 nm, 1310 nm, 1550 nm',
      '1300 nm, 1490 nm, 1625 nm',
    ],
    answerIndex: 1,
    explanation:
      '1310 nm: the O-band (original band) — lowest chromatic dispersion for G.652.D, commonly used for shorter OSP spans. 1490 nm: GPON downstream wavelength (OLT→ONT). 1550 nm: the C-band — lowest attenuation (~0.20 dB/km), used for longer-haul and DWDM. A fourth wavelength (1625 nm) is used for live-network OTDR testing without interrupting traffic. The 850 nm window applies to multimode (VCSEL), not OSP singlemode. (T02.L02; ITU-T G.652.D)',
  },

  // ─── T03 Cable Selection & Materials (3 questions) ──────────────────────

  // Source: T03.L07 — Armor Deep Dive
  {
    id: 'F10',
    topic: 'T03',
    topicLabel: 'Cable Selection & Materials',
    prompt:
      'Corrugated aluminum tape (CAT) armor is preferred over corrugated steel tape (CST) in aerial applications primarily because:',
    choices: [
      'CAT provides superior rodent resistance in areas with gnawing wildlife',
      'CAT has better corrosion resistance than CST due to its passive aluminum oxide surface layer, and is lighter per unit length',
      'CAT costs less than CST for long aerial spans',
      'RUS Bulletin 1751F-630 mandates CAT for all aerial cables',
    ],
    answerIndex: 1,
    explanation:
      'Aluminum forms a self-repairing passive oxide (Al₂O₃) that prevents corrosion progression — important in coastal, industrial, or humid environments. CAT is also lighter than CST, reducing pole loading. The tradeoff: aluminum is softer, so CAT offers less rodent resistance than CST. For direct-burial in rodent-active zones, CST or polyethylene-jacketed CST is preferred. Neither is universally mandated — cable selection is project-specific. (T03.L07; ICEA S-87-640)',
  },

  // Source: T03.L08 — Drop Cable Selection
  {
    id: 'F11',
    topic: 'T03',
    topicLabel: 'Cable Selection & Materials',
    prompt:
      'A drop cable datasheet specifies "breaking strength: 600 lb / EDS: 15% RTS." A crew installs the cable at 100 lb tension. After installation, the cable settles to 90 lb long-term tension. Is the long-term tension compliant?',
    choices: [
      'No — EDS limits long-term tension to 15% of 600 lb = 90 lb; 90 lb is exactly at the limit, so compliant but marginal',
      'Yes — 90 lb is comfortably below the 600 lb breaking strength',
      'No — EDS = 15% of 600 lb = 90 lb; 90 lb equals the limit exactly; any temperature-induced tension increase may cause a violation',
      'Cannot determine without knowing ambient temperature and ice loading',
    ],
    answerIndex: 2,
    explanation:
      'EDS (Every Day Stress) = 15% × 600 lb = 90 lb. This is the maximum sustained tension allowed after installation to preserve fiber integrity and connector performance over decades. At 90 lb the cable is precisely at the EDS limit. Temperature drops or ice loading will increase tension beyond EDS — violating the long-term limit. Best practice is to sag to 60–80% of EDS for a thermal margin. The installation tension (100 lb) during the pull is separate — installation tension limits are typically 40–50% of RTS for short pulls. (T03.L08; ICEA S-87-640; cable manufacturer guidelines)',
  },

  // Source: T03.L05 — G.652 vs. G.657 Bend-Insensitive
  {
    id: 'F12',
    topic: 'T03',
    topicLabel: 'Cable Selection & Materials',
    prompt:
      'G.657.A2 fiber is specified for a drop cable route that passes through an MDU (multi-dwelling unit) with multiple bends in conduit risers. What is the primary advantage of G.657.A2 over standard G.652.D in this application?',
    choices: [
      'G.657.A2 has lower attenuation than G.652.D at all wavelengths',
      'G.657.A2 is rated for a minimum bend radius of 7.5 mm (vs. 30 mm for G.652.D), enabling sharper bends in tight routing without measurable loss',
      'G.657.A2 can use multimode connectors, reducing termination cost',
      'G.657.A2 fiber is thicker-coated and provides better protection against crushing forces',
    ],
    answerIndex: 1,
    explanation:
      'G.657.A2 (bend-insensitive singlemode) is fully backward-compatible with G.652.D (same core/cladding dimensions, same MFD) but is manufactured with a depressed-cladding design that traps light more effectively at tight bends. The IEC 60793-2-50 standard specifies G.657.A2 minimum bend radius of 7.5 mm at 1 turn vs. the 30 mm installation minimum for G.652.D. MDU riser conduit routes routinely require 10–15 mm radius bends that G.652.D would not tolerate without loss. (T03.L05; ITU-T G.657; IEC 60793-2-50)',
  },

  // ─── T04 Route Survey & Pre-Engineering (3 questions) ───────────────────

  // Source: T04.L01 — Site Walk Hazard Recon
  {
    id: 'F13',
    topic: 'T04',
    topicLabel: 'Route Survey & Pre-Engineering',
    prompt:
      'A route survey identifies a yellow-flagged underground utility at a critical crossing. What is the engineer\'s required next step before finalizing the route design?',
    choices: [
      'Assume the standard 36-inch burial depth and route the fiber above it',
      'Contact the 811 One-Call center and the utility owner to confirm exact depth, material, and clearance before finalizing design',
      'The yellow flag means gas — fiber cannot cross gas lines under any circumstances',
      'Notify RUS that a foreign utility conflict exists and request a redesign waiver',
    ],
    answerIndex: 1,
    explanation:
      'A yellow utility flag indicates a gas pipeline. The engineer must contact 811 (which triggers the utility\'s locating service) AND the gas utility directly to obtain: precise depth (which varies widely — gas mains range from 18 inches to 8+ feet depending on era and local codes), pipe material, pressure rating, and any right-of-way restrictions. Assuming 36 inches without verification risks conflicts or the utility requiring relocation at the project\'s expense. (T04.L01; Common Ground Alliance Best Practices; 49 CFR 192)',
  },

  // Source: T04.L02 — Drone LiDAR Aerial Survey
  {
    id: 'F14',
    topic: 'T04',
    topicLabel: 'Route Survey & Pre-Engineering',
    prompt:
      'A drone LiDAR survey produces a point cloud showing actual pole spacing of 127 ft where the design assumed 130 ft. The project engineer decides to proceed without revising sag/tension calculations. What is the primary risk?',
    choices: [
      'No risk — a 3-foot difference is below survey margin of error',
      'Minor risk — the design will be conservative (shorter spans usually have less sag)',
      'Moderate risk — shorter spans do reduce sag, but pole count increases, altering the cost estimate; structural margins are unaffected',
      'Structural risk if the sag/tension ratio at 127 ft combined with temperature-induced tension approaches the cable\'s EDS limit — calculations must use actual span length',
    ],
    answerIndex: 3,
    explanation:
      'Sag and tension are functions of span length, loading district ice/wind loads, and cable properties. A 127-ft span (vs. 130-ft design) changes the sag-tension curve. While shorter spans typically produce less sag (better), the EDS calculation uses the actual span. More critically, if the design was borderline (e.g., at 97% of EDS at 130 ft), recalculation may confirm compliance — or may not. The design must use the actual field measurement per RUS 1751F-630 §5. (T04.L02; RUS 1751F-630 §5; NESC Rule 250)',
  },

  // Source: T04.L04 — Pole Audit / Attachment Measurement
  {
    id: 'F15',
    topic: 'T04',
    topicLabel: 'Route Survey & Pre-Engineering',
    prompt:
      'During a pole audit, a staker measures an existing cable at 19.5 ft above ground at a point with 20 ft required clearance under NESC Rule 232 (Grade B residential crossing). What is the correct next step?',
    choices: [
      'Document the deficiency and proceed — the existing cable was permitted at 19.5 ft',
      'Flag the pole as requiring make-ready to raise all attachments before adding the new cable',
      'The new fiber cable can attach below the existing cable since the clearance rule applies to the lowest conductor only',
      'Contact the pole owner and request a variance since 0.5 ft deficiency is minor',
    ],
    answerIndex: 1,
    explanation:
      'NESC Rule 232 (Grade B crossings) typically requires 18 ft clearance at crossing for communications cables (actual value depends on loading district and crossing type — verify against Table 232-1). If the existing cable is already non-compliant or at the minimum, adding a new attachment below it would push clearances even lower. Make-ready must address all existing violations before the new attachment can be added. The existing violation does not grandfather the condition — it must be corrected. (T04.L04; NESC Rule 232; FCC 47 CFR §1.1413)',
  },

  // ─── T05 OSP Design — Aerial (5 questions) ──────────────────────────────

  // Source: T05.L02 — Vertical Clearance Rule 232
  {
    id: 'F16',
    topic: 'T05',
    topicLabel: 'OSP Design — Aerial',
    prompt:
      'NESC Rule 232 Grade B requires 18 ft clearance above a residential road. An aerial fiber cable is designed to sag 1.8 ft under heavy ice loading. What attachment height above the poles is required to maintain the 18 ft clearance under worst-case conditions?',
    choices: [
      '18 ft (clearance is measured at attachment)',
      '19.8 ft (18 ft clearance + 1.8 ft sag at midspan)',
      '20 ft (NESC requires 2 ft margin above published clearance)',
      '18 ft + the NESC loading factor, which varies by district',
    ],
    answerIndex: 1,
    explanation:
      'Clearance is measured at the lowest point of the cable (midspan under worst-case loading). If the cable sags 1.8 ft under heavy ice, the attachment point must be at minimum: required clearance + max sag = 18 + 1.8 = 19.8 ft. NESC Rule 232 Table 232-1 specifies clearances at midspan under the worst loading condition for the applicable Loading District. The engineer must design the attachment height so that even at maximum sag, the cable remains above the required clearance. (T05.L02; NESC Rule 232)',
  },

  // Source: T05.L05 — Pole Loading Forces on a Pole
  {
    id: 'F17',
    topic: 'T05',
    topicLabel: 'OSP Design — Aerial',
    prompt:
      'A pole is designed for Grade B construction with a 1,200-lb transverse load capacity at 2 ft from the top. Current loading is 800 lb. A new fiber cable would add 280 lb. Is the addition feasible without make-ready?',
    choices: [
      'Yes — 800 + 280 = 1,080 lb, below the 1,200-lb limit',
      'No — combined load (1,080 lb) is below the rating but NESC Rule 257 requires wind load to be added; full analysis is needed',
      'Yes, but only if the new cable weighs less than the existing cable',
      'No — pole rating headroom must exceed 25% of total load',
    ],
    answerIndex: 1,
    explanation:
      'Adding gravity loads (800 + 280 = 1,080 lb) and comparing to the static rating is a first-pass check, not the full analysis. NESC Rule 257 requires combined loading: vertical load (conductor weight, equipment) PLUS transverse wind loads (Rule 250) PLUS longitudinal loads at dead-ends. In a Heavy loading district, a combined transverse wind load may add 200–400 lb more. The full pole-loading worksheet per NESC Rule 261 (or O-Calc/PLS-POLE analysis) is required before committing to the attachment. (T05.L05; NESC Rules 257 and 261)',
  },

  // Source: T05.L07 — Sag-Tension: How Cable Hangs
  {
    id: 'F18',
    topic: 'T05',
    topicLabel: 'OSP Design — Aerial',
    prompt:
      'A 150-meter span fiber cable is sagged to 2.1% under combined ice/wind loading. The NESC Grade B limit is 2.5% sag. The installation is performed at 95°F (hot day). Should the designer increase the sag for the hot-day installation?',
    choices: [
      'No — 2.1% is already below 2.5%; there is no reason to adjust',
      'Yes — cable elongates at high temperatures, increasing sag beyond 2.1%; the installed sag must account for thermal elongation so the worst-case (winter ice) sag remains ≤ 2.5%',
      'No — temperature effects on sag are negligible for fiber optic cable',
      'Yes — NESC requires sag tables to be calculated at 60°F regardless of field conditions',
    ],
    answerIndex: 1,
    explanation:
      'Sag tables must account for the full temperature range. At 95°F, thermal elongation increases sag. The cable must be tensioned at the installation temperature such that: when temperature drops to the Loading District minimum (e.g., 0°F or –20°F with ice), sag is at or below the NESC limit. Conversely, at peak summer temperatures, sag increases above the design point — the designer must verify clearance is still met at maximum thermal sag. Installing at 95°F requires referencing the sag-tension table for that temperature to apply the correct stringing chart. (T05.L07; NESC Rule 250; cable manufacturer sag-tension tables)',
  },

  // Source: T05.L09 — OTMR in Aerial Design
  {
    id: 'F19',
    topic: 'T05',
    topicLabel: 'OSP Design — Aerial',
    prompt:
      'OTMR (One-Touch Make-Ready) was authorized under the FCC 2018 Pole Access Order (FCC 18-111). Which type of make-ready work does OTMR NOT cover?',
    choices: [
      'Simple make-ready (transferring existing cables to code position)',
      'Complex make-ready (work requiring pole replacement or down-guy installation)',
      'All make-ready if the pole owner can do it within 15 business days',
      'Make-ready involving cable transfer above the top communications wire',
    ],
    answerIndex: 1,
    explanation:
      'OTMR allows the attaching party (fiber company) to perform simple make-ready work with its own contractors without waiting for the pole owner — subject to the pole owner\'s right to be present. Complex make-ready (pole replacement, down-guy addition, cross-arm changes) is excluded from OTMR and requires the pole owner\'s work crews or approved contractors. Simple vs. complex determination is made by the pole owner per 47 CFR §1.1411. (T05.L09; FCC 18-111; 47 CFR §1.1411)',
  },

  // Source: T05.L06 — Loading Districts Rule 250
  {
    id: 'F20',
    topic: 'T05',
    topicLabel: 'OSP Design — Aerial',
    prompt:
      'NESC Rule 250 defines three loading districts. Macon, Georgia falls in which district, and what does that imply for radial ice thickness in the combined load calculation?',
    choices: [
      'Heavy — 0.5-inch radial ice',
      'Medium — 0.25-inch radial ice',
      'Light — 0.0-inch radial ice (no ice loading)',
      'Extreme Wind — 0.0-inch radial ice but with higher wind pressure',
    ],
    answerIndex: 2,
    explanation:
      'Macon, Georgia is in the Light Loading District (NESC Rule 250, NESC Figure 250-1). Light district: 0.0 inches of radial ice, wind pressure of 9 lb/ft² on projected area, temperature 60°F for combined loading. The designer adds wind load but no ice weight. Note: the Extreme Wind zone (coastal areas facing Gulf/Atlantic) overlaps some Georgia counties — verify the actual project location on the NESC loading district map before assuming Light applies. (T05.L06; NESC Rule 250 and Figure 250-1)',
  },

  // ─── T06 OSP Design — Underground (4 questions) ─────────────────────────

  // Source: T06.L09 — NESC Underground Rules §32–35
  {
    id: 'F21',
    topic: 'T06',
    topicLabel: 'OSP Design — Underground',
    prompt:
      'Under NESC Rule 354 (Underground Supply and Communications), a fiber conduit crossing a buried gas main must maintain what minimum vertical separation at the crossing?',
    choices: [
      '3 inches — same as for electric supply cables',
      '6 to 12 inches vertical separation at crossings per NESC Rule 354',
      '24 inches — same as the burial depth for direct-buried fiber',
      'No minimum; the gas utility establishes separation requirements',
    ],
    answerIndex: 1,
    explanation:
      'NESC Rule 354 specifies separation between underground communication cables and supply utilities (including gas mains). At crossings, 6–12 inches of vertical separation is the standard requirement; parallel horizontal separation is 12–24 inches depending on construction method. The gas utility may impose additional requirements. NESC is the baseline minimum — local utility standards and state regulations may be stricter. (T06.L09; NESC Rule 354)',
  },

  // Source: T06.L04 — Conduit Fill and Pull Tension
  {
    id: 'F22',
    topic: 'T06',
    topicLabel: 'OSP Design — Underground',
    prompt:
      'A 1.25-inch innerduct (1.25-inch ID) is to carry a 12-fiber cable with a 0.35-inch outer diameter. What is the approximate fill percentage, and is it within GR-63-CORE guidance for a single cable?',
    choices: [
      '28% fill — within the 40% guideline for a single cable',
      '35% fill — exceeds the 30% maximum',
      'The fill calculation requires the cable area vs. conduit ID area: (0.35² / 1.25²) × 100% ≈ 7.8% — well within any guideline',
      '21% fill — within guidance but requires documentation',
    ],
    answerIndex: 2,
    explanation:
      'Fill percentage for a single cable = (cable OD² / conduit ID²) × 100 = (0.35² / 1.25²) × 100 = (0.1225 / 1.5625) × 100 ≈ 7.8%. Fill is the ratio of cross-sectional areas. At 7.8%, this is well within any industry guideline (GR-63-CORE, cable manufacturer recommendations). Common guidance for a single cable in a conduit is ≤40% area fill. For multiple cables, 40% total fill is a typical ceiling. (T06.L04; GR-63-CORE; cable pull tension calculation guides)',
  },

  // Source: T06.L05 — Manhole, Handhole, Vault Sizing
  {
    id: 'F23',
    topic: 'T06',
    topicLabel: 'OSP Design — Underground',
    prompt:
      'A handhole is designed for a branch point with one incoming 96-fiber feeder cable and two outgoing 48-fiber distribution cables. Why must the handhole be sized larger than a simple straight-through splice handhole?',
    choices: [
      'Branching cables add weight, requiring a reinforced structure',
      'Multiple cable routes require bend-radius-compliant cable management in three directions simultaneously, increasing the required internal volume',
      'RUS Bulletin 1751F-635 mandates a minimum 36×36×36-inch handhole for any branch point',
      'The splitter equipment inside a branch handhole requires 120V AC power, requiring a larger housing',
    ],
    answerIndex: 1,
    explanation:
      'A branching handhole must accommodate cables leaving in multiple directions simultaneously, each requiring the minimum bend radius (typically 10–20 cable diameters). With three cable paths (one in, two out), the handhole must provide space for the cables to make compliant curves without kinking — requiring significantly more volume than a straight-through splice. Additionally, the splice organizer or distribution frame has a physical footprint. Sizing is calculated from the sum of cable diameters, bend-radius requirements, and equipment footprint. (T06.L05; RUS 1751F-635; cable bend-radius tables)',
  },

  // Source: T06.L02 — Burial Depth Rules
  {
    id: 'F24',
    topic: 'T06',
    topicLabel: 'OSP Design — Underground',
    prompt:
      'Direct-buried fiber cable (no conduit) in a non-traffic area under NESC Rule 352 must be buried at a minimum depth of:',
    choices: [
      '18 inches',
      '24 inches',
      '30 inches',
      '36 inches',
    ],
    answerIndex: 1,
    explanation:
      'NESC Rule 352 specifies burial depths for underground communication cables. In non-traffic (non-roadway) areas for direct-buried cable: 24 inches minimum (NESC 2023, Table 352-1 for buried communication cables in public areas). Depths increase to 30–36 inches in roadway crossings. Conduit reduces required burial depth in some jurisdictions. Local utility standards and state DOT specifications may be more stringent than NESC minimums. (T06.L02; NESC Rule 352, Table 352-1)',
  },

  // ─── T07 Staking (2 questions) ───────────────────────────────────────────

  // Source: T07.L05 — Staking Notes, RUS Form 740
  {
    id: 'F25',
    topic: 'T07',
    topicLabel: 'Staking',
    prompt:
      'A staking report notes "Proposed attachment: 22 ft above ground, south side." What critical information is missing for NESC compliance review?',
    choices: [
      'The GPS coordinates of the attachment point',
      'The color of the marking paint used on the pole',
      'The direction and distance relative to the power line attachment (azimuth reference), to verify supply-to-communications separation per NESC Rule 235',
      'The attachment hardware (clamp type and size)',
    ],
    answerIndex: 2,
    explanation:
      'Vertical clearance under NESC Rule 235 (communication-to-supply separation) is measured from the lowest supply conductor to the highest communications cable under worst-case loading — not the static attachment height. To verify compliance, the engineer needs: the existing power attachment height, the proposed telecom attachment height (22 ft), AND the horizontal offset and azimuth — because wind deflection in the horizontal plane may cause cables to approach each other on diagonal spans. "South side" is insufficient without a defined reference to the power attachment position. (T07.L05; NESC Rule 235; RUS Form 740)',
  },

  // Source: T07.L03 — Photographing and Coding Pole Tags
  {
    id: 'F26',
    topic: 'T07',
    topicLabel: 'Staking',
    prompt:
      'During field staking, the staker photographs each pole from the same cardinal direction (facing north) and logs the pole tag number. Why is consistent cardinal-direction photography important for as-built documentation?',
    choices: [
      'Cardinal direction ensures the sun does not create glare in the photos',
      'Consistent orientation means all photos can be directly compared to the GIS strand map, ensuring north-referenced cable routes, attachment positions, and infrastructure are correctly aligned without ambiguity',
      'Facing north is required by RUS Form 740 instructions',
      'It is a personal preference; consistency is optional as long as all components are visible',
    ],
    answerIndex: 1,
    explanation:
      'Staking photos serve as field-documentation evidence for design review, inspector review, and post-construction as-built reconciliation. Consistent cardinal-direction photography ensures each pole\'s photo can be correlated with the GIS/strand map (which is north-referenced) and clearly shows which side of the pole carries which attachment, which direction the span goes, and what the clearance situation looks like. Inconsistent orientation makes comparison to strand maps and clearance calculations ambiguous. (T07.L03; RUS Form 740 instructions)',
  },

  // ─── T08 Make-Ready & Pole Attachment (4 questions) ─────────────────────

  // Source: T08.L02 — The 15-Day Clock
  {
    id: 'F27',
    topic: 'T08',
    topicLabel: 'Make-Ready & Pole Attachment',
    prompt:
      'Under FCC 47 CFR §1.1411, a complete OTMR application was submitted to a pole owner 17 days ago. The pole owner has not commenced work. What is the attacher\'s available remedy?',
    choices: [
      'File a complaint with the FCC; no self-help is authorized under OTMR',
      'The attacher may now perform the make-ready work using its own qualified contractors, at the pole owner\'s expense, with required advance notice',
      'The FCC automatically approves the attachment if the clock expires without pole-owner action',
      'The attacher must wait an additional 30 days before taking any action',
    ],
    answerIndex: 1,
    explanation:
      '47 CFR §1.1411 establishes the OTMR timeline: 15 business days from receipt of a complete OTMR application for the pole owner to commence make-ready. After expiry without commencement, the attacher may self-perform make-ready using its own qualified contractors, with advance written notice to the pole owner (typically 3 business days). The work is performed at the pole owner\'s expense. At day 17, the clock has expired and self-help rights are available. (T08.L02; 47 CFR §1.1411; FCC 18-111)',
  },

  // Source: T08.L03 — Simple vs. Complex Attachment
  {
    id: 'F28',
    topic: 'T08',
    topicLabel: 'Make-Ready & Pole Attachment',
    prompt:
      'A make-ready estimate includes "pole replacement (Class 3 → Class 2) due to load requirement." This work is classified as:',
    choices: [
      'Simple make-ready — the attaching party\'s crews can perform it under OTMR',
      'Complex make-ready — excluded from OTMR; requires pole owner coordination and may involve specialized crews',
      'No-cost make-ready — structural improvements are the pole owner\'s responsibility',
      'Negotiable — the parties can agree to treat pole replacement as simple under OTMR',
    ],
    answerIndex: 1,
    explanation:
      'Pole replacement is complex make-ready per FCC 18-111 and 47 CFR §1.1411. Complex work (also including down-guys, cross-arm changes, and riser conduit replacements) is excluded from OTMR self-help rights. The pole owner must perform or coordinate complex work within the applicable timeframe (typically 60 days for complex). The attaching party bears the cost of any make-ready required by its new attachment — including structural upgrades that the existing load situation made necessary. (T08.L03; 47 CFR §1.1411; FCC 18-111)',
  },

  // Source: T08.L07 — Reading a Make-Ready Estimate
  {
    id: 'F29',
    topic: 'T08',
    topicLabel: 'Make-Ready & Pole Attachment',
    prompt:
      'A make-ready estimate line item reads: "Transfer AT&T drop wire from 22.0 ft to 23.5 ft at Pole 47: $185." Who is responsible for this cost?',
    choices: [
      'AT&T — since it is their wire being moved',
      'The pole owner — since they control the attachment zone',
      'The fiber attacher requesting the new attachment that requires the transfer',
      'Shared equally between AT&T and the new attacher',
    ],
    answerIndex: 2,
    explanation:
      'Under FCC 18-111 and NECA joint-use norms, the new attaching party bears the cost of all make-ready work required to accommodate its new attachment — including moving existing third-party wires to comply with NESC clearances. AT&T\'s wire transfer is required because the new fiber attachment needs the space AT&T currently occupies (or needs the clearance zone AT&T\'s wire would violate). This is a well-established principle: you pay for the space you displace. (T08.L07; FCC 18-111; NECA Joint Use Guidelines)',
  },

  // Source: T08.L08 — Attachment Fees and Annual Rents
  {
    id: 'F30',
    topic: 'T08',
    topicLabel: 'Make-Ready & Pole Attachment',
    prompt:
      'Annual pole attachment rent under FCC 47 CFR §1.1409 (the telecom formula) is calculated based on which factors?',
    choices: [
      'Market rate negotiated between the attacher and pole owner',
      'Pole owner\'s net cost per pole, the usable pole space occupied by the attacher, and the total usable pole space available for attachments',
      'Number of attachments per pole and the pole replacement cost',
      'RUS Bulletin 1751F-630 tabulated rates by pole class and loading district',
    ],
    answerIndex: 1,
    explanation:
      'The FCC telecom formula (47 CFR §1.1409): Annual rent = (Net cost per pole) × (Occupied space / Usable space). Occupied space = the attacher\'s vertical space. Usable space = total pole height minus minimum ground clearance, minus the space reserved for joint-use supply (power). The formula is designed to allocate pole costs fairly across all attachers. Cable companies use a different FCC formula. RUS does not set attachment rents. (T08.L08; 47 CFR §1.1409)',
  },

  // ─── T09 Permitting & Environmental (4 questions) ───────────────────────

  // Source: T09.L02 — NEPA CE, EA, EIS
  {
    id: 'F31',
    topic: 'T09',
    topicLabel: 'Permitting & Environmental',
    prompt:
      'A RUS-funded fiber project uses the NTIA Categorical Exclusion (CE) C-8 for an "installation of new broadband facilities." The route crosses a small seasonal wetland. Can CE C-8 still apply?',
    choices: [
      'Yes — CE C-8 applies to all broadband installations regardless of environmental features',
      'No — any wetland crossing triggers a full Environmental Impact Statement (EIS)',
      'Maybe — CE C-8 requires an Extraordinary Circumstances review; wetland crossing may be a disqualifying extraordinary circumstance requiring at minimum an EA',
      'Yes — seasonal wetlands are exempt from NEPA review as non-jurisdictional waters',
    ],
    answerIndex: 2,
    explanation:
      'Categorical Exclusions are not automatic. Under NTIA and RUS NEPA procedures, an Extraordinary Circumstances review is required for each CE application. A wetland crossing is a potential extraordinary circumstance that may negate the CE and require at minimum an Environmental Assessment (EA). Seasonal wetlands may still be USACE jurisdictional under Clean Water Act §404. The reviewer must determine whether the crossing is practicable to avoid. If not, an EA (and possibly an EA with FONSI) replaces the CE. (T09.L02; 40 CFR 1508.1; NTIA CE C-8; 7 CFR 1794 subpart B)',
  },

  // Source: T09.L04 — ESA, Bats, IPaC
  {
    id: 'F32',
    topic: 'T09',
    topicLabel: 'Permitting & Environmental',
    prompt:
      'The USFWS IPaC (Information for Planning and Consultation) tool returns a result listing the Northern Long-Eared Bat (NLEB) as a Threatened species within a project area. What regulatory step is triggered?',
    choices: [
      'The project must be halted immediately until an Endangered Species Act consultation is complete',
      'ESA Section 7 formal consultation with USFWS is potentially triggered if the project has federal nexus (RUS funding); the agency must determine if the action "may affect" NLEB',
      'The NLEB listing applies only to projects in cave hibernacula areas; aerial fiber installation is exempt',
      'No action required — IPaC results are advisory only',
    ],
    answerIndex: 1,
    explanation:
      'ESA Section 7 requires federal agencies (RUS, in this case) to consult with USFWS whenever an action "may affect" a listed species. IPaC results showing NLEB in the project area trigger the agency\'s obligation to conduct Biological Assessment and potentially formal Section 7 consultation. NLEB was uplisted to Threatened under White-Nose Syndrome pressure (87 FR 73488, November 2022). A 4(d) rule may provide some exceptions for tree clearing. The attaching party must work with the RUS NEPA review team to complete consultation. (T09.L04; 16 USC 1536; 87 FR 73488)',
  },

  // Source: T09.L05 — USACE Wetlands, NWP-57
  {
    id: 'F33',
    topic: 'T09',
    topicLabel: 'Permitting & Environmental',
    prompt:
      'USACE Nationwide Permit 57 (NWP 57, 2026 reissuance) covers certain utility line activities. What is a key limitation that may disqualify a fiber project from using NWP 57 vs. requiring an Individual Permit?',
    choices: [
      'NWP 57 does not apply to fiber optic cable installations — only to electric and gas utilities',
      'NWP 57 caps fill in wetlands at 0.5 acres per crossing; projects exceeding this threshold require an Individual Section 404 Permit',
      'NWP 57 applies only in USACE Omaha District jurisdiction',
      'NWP 57 requires the project to be funded by the state, not the federal government',
    ],
    answerIndex: 1,
    explanation:
      'NWP 57 (Utility Line Activities for Water and Other Resources) authorizes discharges of dredge/fill material for utility lines (including fiber) subject to conditions. The key acreage threshold: up to 0.5 acres of waters of the United States (wetlands + other waters) per crossing. Exceeding 0.5 acres per crossing requires either: a different NWP, a regional general permit, or an Individual Permit under Clean Water Act Section 404. (T09.L05; 88 FR — NWP 57 reissuance 2023/2026; 33 CFR Part 330)',
  },

  // Source: T09.L11 — RUS Environmental Review
  {
    id: 'F34',
    topic: 'T09',
    topicLabel: 'Permitting & Environmental',
    prompt:
      'Under 7 CFR Part 1b (Environmental Policies and Procedures, the replacement for 7 CFR Part 1970 effective April 2026), which document signals RUS\'s determination that a project does not have significant environmental impact, allowing the project to proceed without an EIS?',
    choices: [
      'Finding of No Significant Impact (FONSI) based on an Environmental Assessment (EA)',
      'Categorical Exclusion (CE) determination by the RUS Administrator',
      'Environmental Impact Statement (EIS) with a preferred alternative',
      'Biological Opinion from USFWS under ESA Section 7',
    ],
    answerIndex: 0,
    explanation:
      'When RUS determines through an EA that a project does not have significant environmental impact, it issues a Finding of No Significant Impact (FONSI), allowing the project to proceed without preparing a full EIS. The CE determination bypasses the EA altogether for qualifying actions. The EIS is required only when significant impacts are identified. The Biological Opinion is an ESA Section 7 product, not a NEPA document. (T09.L11; 7 CFR Part 1b; 40 CFR 1501–1508)',
  },

  // ─── T10 OSP Construction (3 questions) ─────────────────────────────────

  // Source: T10.L01 — Call 811 Before You Dig
  {
    id: 'F35',
    topic: 'T10',
    topicLabel: 'OSP Construction',
    prompt:
      'The crew has called 811, received utility markings, and the locate tickets are 5 days old. Excavation is about to begin. What must be confirmed before the first shovel hits the ground?',
    choices: [
      'Locate tickets are valid for 30 days; no additional steps are needed',
      'Verify that all marked utilities have been visually confirmed in the field and that the ticket is still within the valid window for the jurisdiction (varies from 3 to 30 days)',
      'Call 811 again since 5-day-old tickets are always expired',
      'Confirm that the pole owner has approved excavation within their right-of-way',
    ],
    answerIndex: 1,
    explanation:
      'Locate ticket validity varies significantly by state — from 3 working days (some states) to 30 calendar days (others). The crew must verify: (1) the ticket is still valid under the state\'s window, (2) all utilities shown on the ticket have been physically staked/painted in the field, and (3) any stakes that have been displaced or faded must be re-confirmed before excavation. Some states require re-notification (a new ticket) after the validity window even if no digging has occurred. (T10.L01; Common Ground Alliance Best Practices; state one-call requirements)',
  },

  // Source: T10.L05 — Conduit Pull Tension
  {
    id: 'F36',
    topic: 'T10',
    topicLabel: 'OSP Construction',
    prompt:
      'During a 400-foot conduit pull, tension starts at 80 lb and rises to 160 lb by the midpoint. The cable manufacturer\'s maximum pulling tension is 200 lb. What is the correct action?',
    choices: [
      'Continue the pull — 160 lb is still below the 200-lb limit',
      'Stop the pull, investigate the tension increase (obstruction, conduit damage, excess bend), and resolve before resuming',
      'Switch to a higher-powered winch to pull through the obstruction',
      'Add pulling lubricant and continue at the increased tension',
    ],
    answerIndex: 1,
    explanation:
      'A tension spike during pulling signals an obstruction, bent conduit, debris, or cable binding. Continuing at elevated tension — even below the manufacturer\'s maximum — risks sudden tension spikes that can exceed the limit and cause micro-crack formation in fiber or damage to the buffer tubes. The correct response is STOP, investigate, and resolve. Adding lubricant without identifying the cause may mask the problem temporarily but does not address the root cause. (T10.L05; TIA/EIA-590; cable manufacturer installation guides)',
  },

  // Source: T10.L07 — Manhole and Handhole Installation
  {
    id: 'F37',
    topic: 'T10',
    topicLabel: 'OSP Construction',
    prompt:
      'A concrete handhole is set in a sidewalk location. The top of the handhole frame is 0.5 inches below the finished sidewalk grade. What is the consequence and the required correction?',
    choices: [
      'No consequence — 0.5 inches is within acceptable tolerance',
      'The frame must be raised to be flush with or slightly above finished grade; a recessed frame creates a tripping hazard and allows surface water infiltration',
      'The frame should be further lowered to 1 inch below grade to protect it from traffic impact',
      'The frame height is correct; the cover will create the flush surface',
    ],
    answerIndex: 1,
    explanation:
      'Handhole frames installed in pedestrian areas must be flush with (or in some jurisdictions, up to 0.25 inches above) finished grade. A recessed frame (0.5 inches below grade) creates: (1) a tripping hazard — a depression that catches toes; (2) a water collection point that accelerates ice formation in freeze-thaw climates; (3) an infiltration path for surface water into the handhole and potentially into conduit. AASHTO, ADA guidelines, and local municipal codes govern frame-to-grade requirements. The contractor must reset the frame using adjustment rings. (T10.L07; ADA guidelines; local DOT specifications)',
  },

  // ─── T11 Splicing (4 questions) ──────────────────────────────────────────

  // Source: T11.L05 — Core Align vs. Cladding Align
  {
    id: 'F38',
    topic: 'T11',
    topicLabel: 'Splicing',
    prompt:
      'A fusion splicer\'s core-alignment system reports a predicted loss of 0.30 dB before fusion. After fusion, the measured loss is 0.04 dB. What is the most likely explanation?',
    choices: [
      'The splicer is malfunctioning — loss cannot be better than the pre-fusion prediction',
      'The fibers are from the same manufacturer batch with nearly identical MFD; thermal fusion improved alignment beyond the pre-fusion optical estimate',
      'The measured 0.04 dB is a temporary post-fusion value that will increase over time',
      'The fiber geometry is defective; unusually low loss indicates geometric misalignment that will cause failure',
    ],
    answerIndex: 1,
    explanation:
      'Core-alignment splicers estimate loss from pre-fusion optical imagery. When the actual post-fusion loss is much better than predicted, it usually means the fibers are very well-matched (same manufacturer batch, tight MFD tolerance). The fusion process also reflows the glass interface to molecular contact, which can improve measured loss beyond the geometric prediction. A 0.04 dB fusion splice is acceptable and should be approved. The value will not degrade over time for a properly made fusion joint. (T11.L05; IEC 61300-35; TIA OFSTP-5)',
  },

  // Source: T11.L04 — Fusion Splicing Step by Step
  {
    id: 'F39',
    topic: 'T11',
    topicLabel: 'Splicing',
    prompt:
      'During fusion splicing, the splicer displays "arc current insufficient" and produces a splice with 0.8 dB loss. The next splice also shows excessive loss. What is the most likely root cause?',
    choices: [
      'Fiber contamination from improper stripping procedure',
      'Electrodes are near end of life or dirty; arc calibration is needed',
      'The splice sleeves are the wrong length for this fiber type',
      'The IOR (Index of Refraction) setting is incorrect for G.652.D fiber',
    ],
    answerIndex: 1,
    explanation:
      '"Arc current insufficient" is a direct splicer warning that the discharge current is below calibration. This happens as electrodes age (tungsten depletes after ~1,000–3,000 discharges), or when residue builds up on electrode tips. Consequences: incomplete glass reflow → high loss and weak mechanical joint. Corrective action: perform electrode cleaning (if option is available), run arc calibration, and if persistent, replace electrodes. IOR affects OTDR distance measurement, not splice quality. (T11.L04; splicer manufacturer maintenance guides; FOA splice training)',
  },

  // Source: T11.L09 — Splice Case Types
  {
    id: 'F40',
    topic: 'T11',
    topicLabel: 'Splicing',
    prompt:
      'A gel-filled dome splice closure is opened for maintenance 8 years after initial installation. The technician must access two specific splices in tray 3 of 6. What is the primary advantage of a re-enterable (rather than heat-shrink-sealed) closure in this scenario?',
    choices: [
      'Re-enterable closures are waterproof; heat-shrink closures are not',
      'Re-enterable closures can be opened, repaired, and resealed without damaging the other splice trays or replacing the closure body',
      'Re-enterable closures cost less to purchase and install than heat-shrink closures',
      'Re-enterable closures do not require gel filling, simplifying maintenance',
    ],
    answerIndex: 1,
    explanation:
      'Re-enterable closures use mechanical sealing systems (o-rings, compression plates) that can be opened without heat and resealed without replacing the closure. When accessing tray 3 of 6, a re-enterable closure allows opening, accessing only the affected trays, and resealing with the original hardware. A heat-shrink closure requires cutting the heat-shrink sleeve, which destroys the seal; resealing requires replacement shrink material. For a closure that may need repeated maintenance access, re-enterable is the preferred spec. (T11.L09; ITU-T L.12; FOSC manufacturer guidelines)',
  },

  // Source: T11.L03 — Splice Loss Four Numbers
  {
    id: 'F41',
    topic: 'T11',
    topicLabel: 'Splicing',
    prompt:
      'A 72-fiber cable is spliced end-to-end. The acceptance criterion per TIA-568.3-D is ≤0.3 dB per fusion splice. After the splice session, OTDR shows 65 splices at ≤0.1 dB and 7 splices at 0.4–0.6 dB. What is the required action for the 7 high-loss splices?',
    choices: [
      'Average the total splice count — if average is ≤0.3 dB, the work is acceptable',
      'Each splice must individually meet the 0.3 dB criterion; the 7 splices exceeding the limit must be re-spliced',
      'Document the 7 splices as variances for the as-built record and proceed',
      'Acceptable if link budget margin covers the excess loss',
    ],
    answerIndex: 1,
    explanation:
      'TIA-568.3-D splice acceptance criteria are per-splice, not average. Each individual fusion splice must meet the ≤0.3 dB criterion. The 7 splices at 0.4–0.6 dB exceed the acceptance limit regardless of the link budget margin — the spec is the spec. Each must be re-spliced (or optically inspected for root cause) until they meet ≤0.3 dB. Averaging across all splices is not permitted under TIA acceptance testing. (T11.L03; TIA-568.3-D Table 9; IEC 61300-35)',
  },

  // ─── T12 Testing — OLTS, OTDR, Inspection (4 questions) ─────────────────

  // Source: T12.L04 — Dead Zones: EDZ and ADZ
  {
    id: 'F42',
    topic: 'T12',
    topicLabel: 'Testing — OLTS, OTDR, Inspection',
    prompt:
      'An OTDR is set to a 1 µs pulse width, producing a 100-m attenuation dead zone (ADZ). A splice at 90 m is not visible. What adjustment resolves this?',
    choices: [
      'Increase pulse width to 2 µs to extend range and improve resolution',
      'Use a launch/receive cable to move the splice outside the dead zone, then use a shorter pulse width for near-end resolution',
      'Increase averaging time to filter out the dead zone',
      'Switch to bidirectional OTDR measurement to reveal the splice from the other end',
    ],
    answerIndex: 1,
    explanation:
      'A 1 µs pulse = ~100 m ADZ, meaning events within ~100 m of the OTDR port cannot be individually resolved. Solution: connect a launch cable (≥100 m of the same fiber type) before the DUT. This moves the first splice/connector outside the ADZ. At the far end, a receive cable performs the same function. Increasing pulse width would expand the dead zone, making matters worse. Bidirectional averaging can reduce measurement uncertainty but won\'t resolve an event buried in the dead zone — the dead zone is physically inherent to pulse length. (T12.L04; TIA-OFSTP-14A; IEC 60793-1-40)',
  },

  // Source: T12.L11 — End-Face Inspection IEC 61300-3-35
  {
    id: 'F43',
    topic: 'T12',
    topicLabel: 'Testing — OLTS, OTDR, Inspection',
    prompt:
      'End-face inspection per IEC 61300-3-35 Zone A is the critical inspection zone. What does Zone A represent?',
    choices: [
      'The entire fiber end face from 0 to 125 µm diameter',
      'The core region — typically 0 to 25 µm diameter for singlemode fiber — where contamination causes the highest optical loss',
      'The cladding surface from 25 µm to 125 µm diameter',
      'The ferrule physical contact area that must be flat to within ±1 µm',
    ],
    answerIndex: 1,
    explanation:
      'IEC 61300-3-35 defines four concentric inspection zones for fiber end-face assessment: Zone A (core region, 0–25 µm diameter for SMF), Zone B (cladding, 25–120 µm), Zone C (adhesive, 120–130 µm), and Zone D (ferrule exterior). Zone A is the critical zone because contamination there directly intercepts the optical mode field — even microscopic scratches or pits in Zone A cause significant connector loss. Zone A defects have the strictest pass/fail criteria. (T12.L11; IEC 61300-3-35)',
  },

  // Source: T12.L08 — Reading an OTDR Trace
  {
    id: 'F44',
    topic: 'T12',
    topicLabel: 'Testing — OLTS, OTDR, Inspection',
    prompt:
      'An OTDR trace shows a "gainer" — a step UP in backscatter power at a splice location. What does this indicate?',
    choices: [
      'The splice has amplified the signal; a booster splice was installed',
      'The fiber after the splice has a higher backscatter coefficient (larger MFD or different manufacturer), causing more Rayleigh backscatter — this is an apparent gain, not real amplification',
      'The OTDR is malfunctioning; power cannot increase through a passive splice',
      'The splice was made incorrectly and light is leaking from the cladding into the core',
    ],
    answerIndex: 1,
    explanation:
      'A "gainer" in an OTDR trace is a measurement artifact, not real amplification. When the fiber after the splice has a higher backscatter coefficient (larger MFD), the OTDR receives more reflected light per unit length from the second fiber than from the first. This makes the trace appear to step upward at the splice — a positive step. The actual splice has loss (it always does); the apparent gain is due to mismatched fiber backscatter. Bidirectional OTDR and averaging eliminates this artifact for accurate loss measurement. (T12.L08; TIA-OFSTP-14A; OTDR interpretation guides)',
  },

  // Source: T12.L13 — Acceptance Testing: What Passes
  {
    id: 'F45',
    topic: 'T12',
    topicLabel: 'Testing — OLTS, OTDR, Inspection',
    prompt:
      'Tier-1 (OLTS) testing of a fiber link produces a measured loss of 4.2 dB. The calculated maximum loss from the design (fiber + splices + connectors + margin) is 5.0 dB. The optical power budget allows 6.0 dB total loss (transmitter to receiver). Does this fiber link pass Tier-1 acceptance?',
    choices: [
      'No — 4.2 dB exceeds the "headroom" expected for a new installation',
      'Yes — 4.2 dB is below the design maximum (5.0 dB) AND within the optical power budget (6.0 dB)',
      'Cannot determine — Tier-1 requires bidirectional measurement before accepting any result',
      'No — Tier-2 (OTDR) must confirm the result before acceptance is valid',
    ],
    answerIndex: 1,
    explanation:
      'Tier-1 (OLTS) acceptance criterion: measured loss ≤ calculated maximum allowed loss for that link. Here 4.2 dB ≤ 5.0 dB (design max) — the link passes. The optical power budget (6.0 dB) provides additional headroom. TIA-568.3-D Tier-1 requires bidirectional measurements for accurate results (the OLTS reference method uses Method B — launch + receive cable), but a single-direction measurement showing 4.2 dB ≤ 5.0 dB passes regardless. Tier-2 (OTDR) is an optional diagnostic tool, not required for Tier-1 acceptance. (T12.L13; TIA-568.3-D §11; TIA-OFSTP-6)',
  },

  // ─── T13 Inspection & Quality Assurance (3 questions) ───────────────────

  // Source: T13.L07 — Close-Out Documentation Form 219
  {
    id: 'F46',
    topic: 'T13',
    topicLabel: 'Inspection & Quality Assurance',
    prompt:
      'RUS Form 219 (Close-Out Report) requires the engineer to certify the as-built network. A splice location was field-shifted 18 feet from the design location to avoid a utility conflict. Is this a reportable variance requiring documentation?',
    choices: [
      'No — 18 feet is within a typical engineering tolerance zone',
      'Yes — all location changes that affect the splice matrix, OTDR address assignments, or future maintenance must be documented as variances in the as-built record',
      'No — if the splice passes OTDR acceptance criteria, its location does not matter',
      'Yes, but only if the shift causes a NESC clearance issue',
    ],
    answerIndex: 1,
    explanation:
      'Any deviation from the design (pole location, splice location, cable route, fiber count changes) must be documented in the as-built record. An 18-foot splice shift changes: (1) the OTDR distance reference for the splice in the splice matrix, (2) the GPS coordinate of the splice location in the GIS database, (3) the length of the cable segments on either side. Future technicians using the splice matrix to locate a failure must have accurate location data. RUS Form 219 requires the engineer to certify accuracy of the as-built or document all variances. (T13.L07; RUS Form 219 instructions)',
  },

  // Source: T13.L03 — Aerial Construction Inspection
  {
    id: 'F47',
    topic: 'T13',
    topicLabel: 'Inspection & Quality Assurance',
    prompt:
      'A constructed aerial fiber route is inspected. At one pole, the messenger strand is wrapped three times around the pole (dead-end style) rather than through-lashed. The design calls for a through-lash at this pole. Should the inspector issue a kick-back?',
    choices: [
      'No — dead-end and through-lash produce equivalent mechanical results at any pole',
      'Yes — the dead-end wrap creates a concentrated attachment point that may exceed the pole\'s bearing capacity at that location and differs from the approved design',
      'No — the contractor may use any approved lashing method',
      'Yes, but only if the pole is a Class 4 or smaller',
    ],
    answerIndex: 1,
    explanation:
      'A dead-end wrap (looping the messenger around the pole) creates a highly concentrated lateral force at the pole at the wrap point. A through-lash (attaching via a lashing clamp through the pole hardware) distributes the load across the attachment hardware and into the pole structure per the design. Deviation from the approved construction method is a kick-back item because: (1) it wasn\'t in the approved design, (2) structural implications must be re-analyzed. The contractor must conform to the design unless a field revision is approved by the engineer. (T13.L03; NESC Rule 261; RUS 1751F-630)',
  },

  // Source: T13.L04 — Underground Construction Inspection
  {
    id: 'F48',
    topic: 'T13',
    topicLabel: 'Inspection & Quality Assurance',
    prompt:
      'Underground excavation inspection finds that two conduit runs are installed at a crossing point with 4 inches of vertical separation, not the 6-inch minimum specified in the design. Should the inspector kick back the work?',
    choices: [
      'No — 4 inches is close enough; the conduit is protected inside and separation is for information only',
      'Yes — 4 inches is below the 6-inch design minimum; the contractor must expose and re-separate the conduit runs',
      'No — if the conduits are different colors, they are identifiable without minimum separation',
      'Maybe — only if the crossing creates NESC interference (electrical crossings have separation requirements; fiber-to-fiber crossings do not)',
    ],
    answerIndex: 1,
    explanation:
      'The design specified a 6-inch minimum separation for a reason (thermal separation, excavation damage risk zone, or foreign utility coordination agreement). The contractor must meet the design specification. At 4 inches, the work fails the design acceptance criterion and must be corrected. Dig-up, re-route, or fill/re-compact to achieve the specified separation. The inspector\'s role is to enforce the design, not to re-engineer it on the fly. Any deviation must be approved by the engineer of record before acceptance. (T13.L04; RUS 1751F-635; design specifications)',
  },

  // ─── T14 Bonding, Grounding & Electrical Protection (4 questions) ────────

  // Source: T14.L06 — Ground Resistance Testing
  {
    id: 'F49',
    topic: 'T14',
    topicLabel: 'Bonding, Grounding & Electrical Protection',
    prompt:
      'A grounding electrode at an FDH measures 8 Ω. Telcordia GR-1275 §5 requires ≤5 Ω. What is the engineering remedy?',
    choices: [
      'Accept as-is — 8 Ω is within NEC §250.56\'s ≤25 Ω standard',
      'Drive an additional ground rod at least 8 feet from the first to create a parallel combination; treat with conductive backfill (bentonite) if needed; re-test',
      'Increase wire gauge on the bonding conductor from the electrode to the equipment',
      'Request a GR-1275 waiver from Telcordia since 8 Ω meets NEC',
    ],
    answerIndex: 1,
    explanation:
      'GR-1275 §5 is stricter than NEC §250.56 (≤25 Ω for supplemental rods). At 8 Ω, the FDH electrode fails GR-1275. Remediation: (1) drive a second rod at least 8 ft away from the first (parallel resistance reduces combined resistance — two 8 Ω rods in parallel ≈ 4 Ω); (2) treat with bentonite (hygroscopic conductive soil amendment) to reduce soil resistivity around the rod; (3) consider a ground ring electrode for very high-resistivity soils. Wire gauge does not reduce electrode resistance — only the electrode-to-earth contact area matters. GR-1275 is a Telcordia industry standard, not a regulatory authority, but it\'s the contractual compliance standard for FDH installations. (T14.L06; GR-1275 §5; IEEE Std 81; NEC §250.56)',
  },

  // Source: T14.L03 — Messenger Bonding Rules
  {
    id: 'F50',
    topic: 'T14',
    topicLabel: 'Bonding, Grounding & Electrical Protection',
    prompt:
      'NESC Rule 215D requires messenger strand bonding at pole attachment points. For a 500-foot aerial span, how many bonding points does the NESC minimum require?',
    choices: [
      'One bonding point at the dead-end pole only',
      'One at each attachment point (both poles at each end of the span)',
      'One per 300 feet of span (approximately 2 for this span)',
      'Bonding at both end poles plus a mid-span bond for spans exceeding 400 feet',
    ],
    answerIndex: 1,
    explanation:
      'NESC Rule 215D requires messenger bonding (to the grounded support structure) at each attachment point where the cable is supported. For a 500-foot span, the messenger attaches at both end poles — two bonding points. For continuous aerial routes with no dead-ends, bonding at each pole is the standard (every attachment point). This prevents voltage buildup from induced currents in the messenger over long ungrounded runs. Additional mid-span grounding is common engineering practice for long-span runs but is not the NESC minimum. (T14.L03; NESC Rule 215D; RUS 1751F-630 §7)',
  },

  // Source: T14.L05 — IBT and GES
  {
    id: 'F51',
    topic: 'T14',
    topicLabel: 'Bonding, Grounding & Electrical Protection',
    prompt:
      'At a building entrance, the OSP cable\'s metallic armor and messenger must be bonded to the building\'s Grounding Electrode System (GES) via an Intersystem Bonding Termination (IBT) per NEC Article 250.94. What is the primary safety function of the IBT?',
    choices: [
      'The IBT provides a removable connection point for testing ground resistance without disconnecting the system',
      'The IBT equalizes potential between the OSP metallic components and the building GES, preventing voltage differences that could arc through equipment or create shock hazard during faults or lightning',
      'The IBT allows the building\'s GES to share load with the OSP messenger during overload events',
      'The IBT is required only when the building is on commercial power over 240V',
    ],
    answerIndex: 1,
    explanation:
      'Ground Potential Rise (GPR) events (lightning, utility fault currents) create transient voltage differences between remote earth (where OSP cable is referenced far from the building) and the building GES (referenced to local earth). Without IBT bonding, this voltage difference appears across OLT line cards or equipment protection circuits — potentially causing arcing or equipment destruction. The IBT (NEC 250.94) creates the bonding path that equalizes the potentials at the building entrance. The IBT must be accessible for future connections of other systems (NEC 250.94(B)). (T14.L05; NEC 250.94; IEEE Std 1100)',
  },

  // Source: T14.L07 — Surge Arresters and Lightning Protection
  {
    id: 'F52',
    topic: 'T14',
    topicLabel: 'Bonding, Grounding & Electrical Protection',
    prompt:
      'A surge arrester on an aerial fiber cable\'s messenger strand is rated for Class B (medium exposure) under ANSI/IEEE C62.11. After a direct lightning strike nearby, the arrester is found to be shorted. What is the correct corrective action?',
    choices: [
      'Leave the shorted arrester in place — it has failed safely and no longer poses a risk',
      'Replace the shorted arrester immediately; a shorted arrester may present the appearance of protection while the clamping circuit is disabled',
      'Shorted arresters are normal after lightning events; test and reuse if clamping voltage is within 20% of rating',
      'Remove the arrester entirely; the cable has survived the strike without it',
    ],
    answerIndex: 1,
    explanation:
      'Surge arresters sacrifice themselves under high-energy transients — their metal oxide varistor (MOV) elements can be permanently damaged (shorted or open). A shorted arrester appears bonded at all times (may actually look "working") but its voltage-clamping function is disabled. The next lightning event passes through unimpeded. Any arrester that has taken a direct transient must be tested and replaced if degraded. ANSI/IEEE C62.11 classes (A, B, C) indicate rated exposure levels — a Class B arrester that absorbed a Class C event may be damaged regardless of visual appearance. (T14.L07; ANSI/IEEE C62.11; ANSI C62.41)',
  },

  // ─── T15 Restoration & Outage Response (2 questions) ────────────────────

  // Source: T15.L02 — Fault Locate with OTDR
  {
    id: 'F53',
    topic: 'T15',
    topicLabel: 'Restoration & Outage Response',
    prompt:
      'An OTDR from one end shows a break at 7,230 m. An OTDR from the other end of the same 15,000 m link shows the break at 7,680 m from that end. What is the actual distance of the break from the first measurement point?',
    choices: [
      '7,230 m (trust the first measurement)',
      '7,680 m (trust the second measurement)',
      '(15,000 - 7,680) = 7,320 m from the first end — average the two with (7,230 + 7,320) / 2 = 7,275 m',
      '7,230 m and 7,320 m are both valid; the break may span this 90 m zone',
    ],
    answerIndex: 2,
    explanation:
      'Bidirectional OTDR: from end A, break at 7,230 m. From end B, break at 15,000 - 7,680 = 7,320 m from end A. The true break location is the average: (7,230 + 7,320) / 2 = 7,275 m from end A. The 90-m discrepancy reflects IOR (Index of Refraction) calibration error or measurement uncertainty in each OTDR measurement. Averaging the two bidirectional measurements is the standard technique to improve accuracy. This location is where the crew should excavate or search the aerial span. (T15.L02; TIA-OFSTP-14A; OTDR application notes)',
  },

  // Source: T15.L08 — Method of Procedure
  {
    id: 'F54',
    topic: 'T15',
    topicLabel: 'Restoration & Outage Response',
    prompt:
      'A restoration team arrives at a backhoe-strike location. One end of the OTDRed cut is confirmed at the site. Before any splicing can begin, what is the required safety/planning step?',
    choices: [
      'Immediately set up the splice trailer and begin stripping the cable',
      'Verify the site is safe (call 811 for surrounding utilities, confirm backhoe is removed, set up traffic control), OTDR both ends to characterize the full damage, then develop the repair plan',
      'Contact the utility at each end of the link and notify them of the outage status before beginning repairs',
      'Test fiber continuity with a visible light source to confirm which fibers are cut',
    ],
    answerIndex: 1,
    explanation:
      'Before restoration work begins: (1) safety — the excavation site may have exposed other utilities; call 811 for adjacent utility locate, set up traffic control, verify the backhoe and any other equipment is cleared; (2) OTDR from both ends — confirm whether there is one break or multiple breaks, get accurate distances, characterize fiber damage; (3) develop the repair plan — determine whether to use a pre-made pigtail repair or a full section replacement. Rushing to splice before understanding the damage scope often leads to incomplete restoration or safety incidents. (T15.L08; CGA guidelines; emergency restoration best practices)',
  },

  // ─── T16 As-Built Documentation & GIS (2 questions) ─────────────────────

  // Source: T16.L05 — GIS Formats for As-Built Delivery
  {
    id: 'F55',
    topic: 'T16',
    topicLabel: 'As-Built Documentation & GIS',
    prompt:
      'An as-built GIS record is exported in Shapefile (SHP) format for RUS submission. A RUS reviewer requests the data in a "geodatabase format." What is the key difference between an SHP and a File Geodatabase (GDB)?',
    choices: [
      'SHP files are more accurate than GDB for utility mapping applications',
      'GDB supports complex topology, relationship classes, and richer attribute tables in a single container; SHP separates each layer into multiple files and lacks topology support',
      'SHP is the RUS standard; GDB is proprietary and cannot be accepted',
      'Both formats are equivalent; the difference is only in filename extension',
    ],
    answerIndex: 1,
    explanation:
      'Shapefile (SHP) format: each layer consists of at least 4 files (.shp, .dbf, .shx, .prj); limited to 255 attribute fields; no topology; 2 GB file size limit; widely supported. File Geodatabase (GDB): single container; supports topology rules, relationship classes (linking splice records to splice locations), richer domain types, unlimited field count, and large datasets. For complex OSP networks with splice matrices, conduit routing, and equipment records, GDB allows relational data that SHP cannot. RUS accepts both; the reviewer may want GDB for its relational capabilities. (T16.L05; ESRI Shapefile Technical Desc.; ESRI GDB documentation)',
  },

  // Source: T16.L07 — Form 219 Documentation Package
  {
    id: 'F56',
    topic: 'T16',
    topicLabel: 'As-Built Documentation & GIS',
    prompt:
      'An OSP project close-out package includes Form 219 signed by the engineer. The engineer certifies the as-built drawings are accurate. Three months later, a crew finds a splice location that is 200 feet from the documented position. Who bears responsibility?',
    choices: [
      'The RUS borrower — they are responsible for verifying all field work before submission',
      'The contractor — they are responsible for accurate as-built markup',
      'The engineer of record — Form 219 certification carries professional liability for the accuracy of the documented as-built information',
      'No individual is responsible — documentation errors are treated as systematic issues',
    ],
    answerIndex: 2,
    explanation:
      'Form 219 requires the licensed engineer\'s signature and stamp. The certification states the engineer has reviewed the as-built documentation and certifies it accurately reflects the constructed network. A 200-foot splice position error is a certification failure. The engineer bears professional liability (E&O insurance exposure, potential PE board action). The engineer\'s responsibility: verify contractor-provided as-built markup against OTDR traces, GPS coordinates, and field inspection records before signing Form 219. (T16.L07; RUS Form 219 instructions; NSPE Code of Ethics)',
  },

  // ─── T17 Project Estimation & Revenue (2 questions) ─────────────────────

  // Source: T17.L07 — Contingency and Escalation
  {
    id: 'F57',
    topic: 'T17',
    topicLabel: 'Project Estimation & Revenue',
    prompt:
      'A $1,000,000 project is 50% complete and has spent $560,000 (12% over the 50% milestone budget of $500,000). If the cost overrun rate continues for the remaining 50% of work, what is the projected final cost?',
    choices: [
      '$1,060,000',
      '$1,100,000',
      '$1,120,000',
      '$1,560,000',
    ],
    answerIndex: 2,
    explanation:
      'If the 12% overrun rate continues: remaining budget = $500,000 × 1.12 = $560,000. Total projected cost = $560,000 (spent) + $560,000 (projected remaining) = $1,120,000. This assumes the overrun percentage persists uniformly — actual projection requires identifying overrun causes. Cost performance index (CPI) = 500,000/560,000 = 0.893; Estimate at Completion (EAC) = Budget / CPI = 1,000,000 / 0.893 ≈ $1,120,000. (T17.L07; PMI PMBOK Earned Value Management)',
  },

  // Source: T17.L08 — CPHP / CPHC KPIs
  {
    id: 'F58',
    topic: 'T17',
    topicLabel: 'Project Estimation & Revenue',
    prompt:
      'A rural aerial fiber project installs 25 miles in 18 working days with a crew of 4 technicians. What is the CPHP (Cost Per Home Passed) if the total project cost is $450,000 and there are 900 homes in the service area?',
    choices: [
      '$450 per home passed',
      '$500 per home passed',
      '$550 per home passed',
      'Cannot be calculated without knowing the number of homes connected, not just passed',
    ],
    answerIndex: 1,
    explanation:
      'CPHP = Total project cost ÷ Total homes passed = $450,000 ÷ 900 = $500 per home passed. CPHP is a network deployment efficiency metric; it does not depend on take-rate (actual subscribers connected) — it measures the cost of making the network available to a home. CPHC (Cost Per Home Connected) would use subscriber count. At $500 CPHP for an aerial rural deployment, this is competitive but not unusual for lower-density routes. (T17.L08; FTTH Council deployment benchmarks)',
  },

  // ─── T18 Safety & OSHA (4 questions) ────────────────────────────────────

  // Source: T18.L03 — Confined Space Entry
  {
    id: 'F59',
    topic: 'T18',
    topicLabel: 'Safety & OSHA',
    prompt:
      'Before entering an underground manhole (permit-required confined space) to perform splice work, the crew must test for which atmospheric hazards per OSHA 1910.146?',
    choices: [
      'Oxygen content only — fiber splicing produces no toxic gases',
      'Oxygen deficiency/enrichment, flammable gases, and toxic gases (minimum — oxygen, combustible, CO, H₂S)',
      'Carbon monoxide (CO) only — the primary hazard in manholes',
      'H₂S only — sewage-adjacent manholes require sulfide testing',
    ],
    answerIndex: 1,
    explanation:
      'OSHA 1910.146(d)(5) requires atmospheric testing for oxygen content, flammable gases, and toxic air contaminants before initial entry and continuously during PRCS work. The minimum test sequence: (1) oxygen (normal: 19.5–23.5%); (2) combustibles (LEL < 10% for safe entry); (3) toxic gases — minimum CO (IDLH 1200 ppm) and H₂S (IDLH 100 ppm per NIOSH). Manholes near gas mains require methane testing. Near sewers, H₂S is the critical hazard. Single-gas testers are insufficient — a 4-gas meter (O₂, LEL, CO, H₂S) is the field minimum. (T18.L03; OSHA 1910.146(d)(5); NIOSH IDLH values)',
  },

  // Source: T18.L04 — Fall Protection, Poles, and Aerial Lifts
  {
    id: 'F60',
    topic: 'T18',
    topicLabel: 'Safety & OSHA',
    prompt:
      'A technician is working from a bucket truck at 20 feet. OSHA 29 CFR 1910.67 requires the technician to use personal fall protection (harness and lanyard) at all times in the bucket. When is the harness allowed to be unattached?',
    choices: [
      'When the bucket is stationary — fall protection is only required during movement',
      'Never — OSHA 1910.67 requires continuous fall protection attachment inside the bucket at all times during use',
      'When the bucket is within 10 feet of the ground',
      'When a guardrail system is installed on the bucket',
    ],
    answerIndex: 1,
    explanation:
      'OSHA 29 CFR 1910.67(c)(2)(ii) requires workers in boom-supported aerial work platforms (bucket trucks) to use a personal fall protection system (body harness + lanyard attached to the basket anchorage) at all times while in the elevated bucket. The standard does not provide an exception for stationary buckets or proximity to the ground. The hazard — bucket tip-over, cable snag, vehicle impact — is present whenever the worker is elevated. Unattaching the harness for "convenience" is a common OSHA violation in OSP construction. (T18.L04; OSHA 29 CFR 1910.67; ANSI/SIA A92.6)',
  },

  // Source: T18.L07 — Working Near Energized Conductors
  {
    id: 'F61',
    topic: 'T18',
    topicLabel: 'Safety & OSHA',
    prompt:
      'An OSP crew (unqualified electrical workers) must work within 10 feet of a 7,200-volt primary conductor on a shared pole. What is OSHA 1910.269 MAD (Minimum Approach Distance) for 7,200V phase-to-ground (12.47 kV phase-to-phase)?',
    choices: [
      '2 feet — same as for distribution voltages under 15 kV',
      'Any approach is acceptable if the unqualified worker does not touch the conductor',
      'There is no OSHA MAD for unqualified workers — all work near energized conductors requires a qualified electrical worker',
      'Minimum 1.5 feet, the Phase-to-Ground voltage MAD per OSHA Table S-5',
    ],
    answerIndex: 2,
    explanation:
      'OSHA 1910.269 and 1910.268(h) establish that unqualified workers must stay at least 10 feet away from energized supply conductors in the 1–50 kV range. Unqualified workers do not have an MAD per Table S-5 — that table applies to qualified electrical workers. The OSP crew\'s requirement is: if within 10 feet, the utility must de-energize or provide a qualified electrical worker to establish safe working clearance. OSP fiber work on the communications space (bottom of the pole) typically maintains 10-foot separation from primary conductors — if not, work must be halted until clearance is established. (T18.L07; OSHA 1910.269; OSHA 1910.268(h))',
  },

  // Source: T18.L02 — Lockout / Tagout
  {
    id: 'F62',
    topic: 'T18',
    topicLabel: 'Safety & OSHA',
    prompt:
      'OSHA 1910.147 LOTO procedures require verification of de-energization (zero-energy state) before declaring the equipment safe to work on. After de-energizing a –48 VDC battery bus, what must the technician do before touching any conductors?',
    choices: [
      'Verify de-energization visually by confirming the disconnect is in the open position',
      'Wait 5 minutes for residual charge to dissipate',
      'Test for zero voltage with a calibrated voltage meter or pen tester at the working point — do not rely on visual confirmation alone',
      'De-energization is sufficient for –48 VDC; LOTO is only required for AC voltages above 50V',
    ],
    answerIndex: 2,
    explanation:
      'OSHA 1910.147(d)(6) requires attempting to start or operate equipment (actuate controls) or test for zero energy (with a meter) to verify de-energization — visual confirmation of an open disconnect is not sufficient (contactors can fail in the closed position or reverse). For –48 VDC battery systems, use a calibrated voltage meter at the point where work will be performed. Battery systems store substantial energy at –48 VDC and can source hundreds of amps into a fault; residual charge dissipates in seconds, not 5 minutes. LOTO applies to all energy sources >50V or capable of causing injury — –48 VDC qualifies. (T18.L02; OSHA 1910.147(d)(6); ANSI Z244.1)',
  },

  // ─── T19 Headend / CO + Rack-Side Hardware Basics (2 questions) ──────────

  // Source: T19.L06 — Headend Grounding, OSP MGN Terminates
  {
    id: 'F63',
    topic: 'T19',
    topicLabel: 'Headend / CO + Rack-Side Hardware',
    prompt:
      'The OSP messenger strand and cable armor must be bonded to the building\'s Grounding Electrode System at the headend entry. During a lightning event on the feeder route, what does this bonding prevent?',
    choices: [
      'It prevents the lightning current from entering the cable — the bond diverts it to earth',
      'It prevents a Ground Potential Rise (GPR) voltage difference from appearing across the OLT line card circuits between the OSP reference potential and the building reference potential',
      'It prevents the OLT from sensing the lightning event and rebooting',
      'It is a regulatory formality; the surge arrester at the primary protector provides the actual protection',
    ],
    answerIndex: 1,
    explanation:
      'GPR (Ground Potential Rise) occurs when lightning or fault current raises the local earth potential. The building GES is at local earth potential; OSP cable armor (bonded at the far end to remote earth) may be at a different potential. Without bonding at the building entry, this potential difference appears across the OLT\'s optical-to-electrical interface — voltage transients that protection circuits were not designed for. The bond equalizes both references at the entry point. The surge arrester at the primary protector clamps overvoltage on individual conductors; the building-entry bond is a separate protection layer for the entire cable assembly. (T19.L06; NEC 250.94; IEEE Std 1100; RUS 1751F-810)',
  },

  // Source: T19.L07 — Rack-Side Hardware, Patch Panels, LIU
  {
    id: 'F64',
    topic: 'T19',
    topicLabel: 'Headend / CO + Rack-Side Hardware',
    prompt:
      'In an interconnect configuration at the ODF, the OLT trunk fiber connects directly to one adapter row and the feeder pigtail connects to the same adapter row. Compared to a cross-connect configuration, what is the tradeoff?',
    choices: [
      'Interconnect provides better optical performance; cross-connect reduces connector loss',
      'Interconnect is simpler (one mated connector pair = one less connection loss) but less flexible — rerouting a circuit requires physical re-patching at the OLT trunk fiber rather than at a cross-connect jumper field',
      'Interconnect requires two ODF bays; cross-connect fits in a single bay',
      'Cross-connect is always preferred; interconnect is only used for temporary installations',
    ],
    answerIndex: 1,
    explanation:
      'Interconnect: single adapter per circuit path → fewer connectors → ~0.5 dB less insertion loss per circuit. The disadvantage: moving a circuit (OLT port reuse, feeder fiber reassignment) requires touching the OLT trunk or feeder pigtails directly — higher disruption risk. Cross-connect: two adapter rows plus a jumper between them → one additional connector loss (~0.5 dB) but circuit reassignment happens by swapping a patch cord at the jumper field without touching OLT ports or feeder fibers. For high-churn environments (carrier-grade NOC), cross-connect management flexibility outweighs the 0.5 dB penalty. For static, low-change networks, interconnect saves the connector loss. (T19.L07; TIA-568.3-D; BICSI OSPDRM)',
  },
];

// ── Exam constants ───────────────────────────────────────────────────────────
const TOTAL_QUESTIONS = QUESTIONS.length; // 64 authored, slice to 60 below
const EXAM_QUESTIONS  = QUESTIONS.slice(0, 60); // 60-question exam
const EXAM_DURATION_S = 90 * 60;           // 90 minutes
const PASS_THRESHOLD  = 0.80;              // 80% = 48/60

// Topic display order and labels for the per-domain score table
const TOPIC_ORDER = [
  { id: 'T01', label: 'T01 — Fundamentals & Vocabulary' },
  { id: 'T02', label: 'T02 — Fiber Physics' },
  { id: 'T03', label: 'T03 — Cable Selection & Materials' },
  { id: 'T04', label: 'T04 — Route Survey & Pre-Engineering' },
  { id: 'T05', label: 'T05 — OSP Design — Aerial' },
  { id: 'T06', label: 'T06 — OSP Design — Underground' },
  { id: 'T07', label: 'T07 — Staking' },
  { id: 'T08', label: 'T08 — Make-Ready & Pole Attachment' },
  { id: 'T09', label: 'T09 — Permitting & Environmental' },
  { id: 'T10', label: 'T10 — OSP Construction' },
  { id: 'T11', label: 'T11 — Splicing' },
  { id: 'T12', label: 'T12 — Testing — OLTS, OTDR, Inspection' },
  { id: 'T13', label: 'T13 — Inspection & Quality Assurance' },
  { id: 'T14', label: 'T14 — Bonding, Grounding & Electrical Protection' },
  { id: 'T15', label: 'T15 — Restoration & Outage Response' },
  { id: 'T16', label: 'T16 — As-Built Documentation & GIS' },
  { id: 'T17', label: 'T17 — Project Estimation & Revenue' },
  { id: 'T18', label: 'T18 — Safety & OSHA' },
  { id: 'T19', label: 'T19 — Headend / CO + Rack-Side Hardware' },
];

// ── Utilities ────────────────────────────────────────────────────────────────

function fmtTime(secs) {
  const m  = Math.floor(secs / 60);
  const ss = String(secs % 60).padStart(2, '0');
  return `${m}:${ss}`;
}

function computeResults(answers) {
  let correct = 0;
  const domainScores = {};

  EXAM_QUESTIONS.forEach((q, idx) => {
    const isCorrect = answers[idx] === q.answerIndex;
    if (isCorrect) correct++;

    if (!domainScores[q.topic]) {
      domainScores[q.topic] = { topic: q.topic, label: q.topicLabel, correct: 0, total: 0 };
    }
    domainScores[q.topic].total++;
    if (isCorrect) domainScores[q.topic].correct++;
  });

  const pct    = Math.round((correct / EXAM_QUESTIONS.length) * 100);
  const passed = pct >= PASS_THRESHOLD * 100;

  return { correct, total: EXAM_QUESTIONS.length, pct, passed, domainScores };
}

// Post results to /api/training/cert-attempt (cert_track: 'OSP-Designer')
async function persistCertAttempt(results, timeTaken) {
  try {
    const body = {
      cert_track:         'osp-general',
      score:              results.pct,
      passed:             results.passed,
      time_taken_seconds: Math.round(timeTaken),
      total_items:        results.total,
      correct_items:      results.correct,
      domain_scores:      Object.fromEntries(
        Object.entries(results.domainScores).map(([k, v]) => [
          k,
          { correct: v.correct, total: v.total, pct: Math.round((v.correct / v.total) * 100) },
        ])
      ),
    };
    await fetch('/api/training/cert-attempt', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
  } catch {
    // Non-blocking — exam result is still shown even if persistence fails
  }
}

// Post lesson completion to /api/training/progress
async function persistLessonComplete(pct) {
  try {
    await fetch('/api/training/progress', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        course_id:      'C05',
        lesson_id:      'C05.L01',
        status:         'completed',
        completion_pct: Math.round(pct),
        score:          Math.round(pct),
      }),
    });
  } catch {
    // Non-blocking
  }
}

// ── Score Bar component ──────────────────────────────────────────────────────

function ScoreBar({ correct, total }) {
  const pct = Math.round((correct / total) * 100);
  return (
    <div className="w-full bg-white/10 rounded-full h-3 mt-1">
      <div
        className={`h-3 rounded-full transition-all ${pct >= 80 ? 'bg-ospgreen' : pct >= 60 ? 'bg-ospamber' : 'bg-rose-500'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Results view ─────────────────────────────────────────────────────────────

function ResultsView({ results, timeTaken, onRetake }) {
  const { correct, total, pct, passed, domainScores } = results;

  return (
    <LessonLayout meta={meta}>
      <section data-tier="foundations">
        <h2>OSP Course Final Exam — Results</h2>

        {/* ── Score card ──────────────────────────────────────────────── */}
        <div className={`mt-4 p-4 rounded-lg border ${passed ? 'border-ospgreen/40 bg-ospgreen/10' : 'border-rose-400/40 bg-rose-400/10'}`}>
          <p className="text-4xl font-bold">
            {correct} <span className="text-xl font-normal text-slate-300/70">/ {total}</span>
            {'  '}
            <span className="text-2xl font-semibold text-ospamber">({pct}%)</span>
          </p>
          <p className={`mt-2 text-lg font-semibold ${passed ? 'text-ospgreen' : 'text-rose-400'}`}>
            {passed
              ? '✓ PASSED — Mastery of OSP Engineering confirmed'
              : '○ Below 80% passing threshold — Review and retake'}
          </p>
          <p className="text-sm text-slate-300/70 mt-1">
            Time taken: {fmtTime(Math.round(timeTaken))} &nbsp;·&nbsp; Pass threshold: 48 / 60 (80%)
          </p>
          <ScoreBar correct={correct} total={total} />
        </div>

        <p className="mt-4 text-slate-200">
          {passed
            ? 'You have demonstrated comprehensive mastery across all OSP engineering domains. You are ready to pursue advanced certifications (BICSI OSP Designer, FOA CFOS/O, FOA CFOT) or take on field leadership roles.'
            : 'Use the per-domain breakdown below to identify your weakest areas. Re-read the relevant topic lessons, then retake the exam. The explanations on each question show the exact source lesson to review.'}
        </p>

        {/* ── Per-domain breakdown ────────────────────────────────────── */}
        <h3 className="mt-6 text-base font-semibold text-slate-100">Per-Domain Score Breakdown</h3>
        <div className="mt-2 space-y-2">
          {TOPIC_ORDER.map(({ id, label }) => {
            const d = domainScores[id];
            if (!d) return null;
            const dpct = Math.round((d.correct / d.total) * 100);
            return (
              <div key={id}>
                <div className="flex justify-between text-sm text-slate-200 mb-0.5">
                  <span>{label}</span>
                  <span className="font-mono">{d.correct} / {d.total} ({dpct}%)</span>
                </div>
                <ScoreBar correct={d.correct} total={d.total} />
              </div>
            );
          })}
        </div>

        {/* ── Missed questions review ─────────────────────────────────── */}
        <h3 className="mt-8 text-base font-semibold text-slate-100">Missed Questions — Review</h3>
        {EXAM_QUESTIONS.every((q, i) => (results.answers ?? {})[i] === q.answerIndex) ? (
          <p className="text-ospgreen mt-2 text-sm">Perfect score — no missed questions.</p>
        ) : (
          <div className="mt-2 space-y-4">
            {EXAM_QUESTIONS.map((q, i) => {
              if ((results.answers ?? {})[i] === q.answerIndex) return null;
              return (
                <div key={q.id} className="border-l-2 border-rose-400/50 pl-4 text-sm">
                  <p className="font-semibold text-slate-100">{q.prompt}</p>
                  <p className="text-rose-300 mt-1">
                    Your answer: {(results.answers ?? {})[i] !== undefined
                      ? q.choices[(results.answers ?? {})[i]]
                      : <em>unanswered</em>}
                  </p>
                  <p className="text-ospgreen mt-0.5">
                    Correct answer: {q.choices[q.answerIndex]}
                  </p>
                  <p className="text-slate-300/80 mt-0.5 italic">{q.explanation}</p>
                </div>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={onRetake}
          className="mt-8 btn-primary"
        >
          Retake Exam
        </button>
      </section>
    </LessonLayout>
  );
}

// ── Pre-exam landing ─────────────────────────────────────────────────────────

function LandingView({ onStart }) {
  return (
    <LessonLayout meta={meta}>
      <section data-tier="foundations">
        <h2>OSP Course Final Exam</h2>
        <p className="mt-4 text-slate-200">
          This comprehensive final exam confirms your mastery of all OSP engineering topics
          covered in T01–T19. Questions are drawn proportionally from every topic: fundamentals,
          fiber physics, cable selection, route survey, aerial and underground design, staking,
          make-ready, permitting, construction, splicing, testing, inspection, bonding/grounding,
          restoration, as-built documentation, estimation, safety, and headend hardware basics.
        </p>

        <ul className="mt-4 space-y-2 text-sm text-slate-200 list-disc pl-5">
          <li><strong>60 questions</strong> — multiple-choice, all fixed-answer</li>
          <li><strong>90 minutes</strong> — timer starts when you click Start Exam; auto-submits at expiry</li>
          <li><strong>Pass threshold: 80%</strong> — 48 of 60 correct</li>
          <li><strong>Per-topic breakdown</strong> shown in results to guide further study</li>
          <li><strong>Score persisted</strong> — attempt recorded for your training record</li>
        </ul>

        <div className="mt-4 p-3 bg-ospamber/10 border border-ospamber/30 rounded-lg text-sm text-amber-200">
          <strong>Before you start:</strong> ensure you have completed all general topics T01–T19
          and their capstone quizzes. The exam covers material from all 19 topics and assumes
          full course completion.
        </div>

        <button
          type="button"
          onClick={onStart}
          className="mt-6 btn-primary text-base px-6 py-2"
        >
          Start Exam
        </button>
      </section>
    </LessonLayout>
  );
}

// ── Exam view ────────────────────────────────────────────────────────────────

function ExamView({ onComplete }) {
  const [idx, setIdx]         = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_S);
  const startTimeRef          = useRef(Date.now());

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  // Auto-submit on time expiry
  const handleSubmit = useCallback(() => {
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    const results = computeResults(answers);
    results.answers = answers; // attach for missed-Q review
    persistCertAttempt(results, elapsed);
    persistLessonComplete(results.pct);
    onComplete(results, elapsed);
  }, [answers, onComplete]);

  useEffect(() => {
    if (timeLeft === 0) handleSubmit();
  }, [timeLeft, handleSubmit]);

  const q        = EXAM_QUESTIONS[idx];
  const answered = idx in answers;
  const timerRed = timeLeft <= 300; // last 5 minutes

  return (
    <LessonLayout meta={meta}>
      <section data-tier="foundations">

        {/* ── Exam header ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-300/80">
            Question {idx + 1} / {EXAM_QUESTIONS.length}
          </span>
          <span className={`font-mono text-sm font-bold ${timerRed ? 'text-rose-400' : 'text-slate-200'}`}>
            ⏱ {fmtTime(timeLeft)}
          </span>
          <span className="text-sm text-slate-300/80">
            Answered: {Object.keys(answers).length} / {EXAM_QUESTIONS.length}
          </span>
        </div>

        {/* ── Question navigator ───────────────────────────────────── */}
        <div className="flex flex-wrap gap-1 mb-4">
          {EXAM_QUESTIONS.map((_, i) => {
            const isAnswered = i in answers;
            const isCurrent  = i === idx;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                className={[
                  'w-7 h-7 rounded text-xs font-mono transition',
                  isCurrent
                    ? 'bg-ospamber text-black'
                    : isAnswered
                    ? 'bg-white/20 text-slate-100'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10',
                ].join(' ')}
                aria-label={`Question ${i + 1}${isAnswered ? ' (answered)' : ''}`}
                aria-current={isCurrent ? 'true' : undefined}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* ── Topic badge ──────────────────────────────────────────── */}
        <div className="text-xs text-ospamber/80 uppercase tracking-widest mb-1">
          {q.topicLabel}
        </div>

        {/* ── Question stem ────────────────────────────────────────── */}
        <p className="text-slate-100 text-base leading-relaxed mb-4">{q.prompt}</p>

        {/* ── Choices ──────────────────────────────────────────────── */}
        <ul className="space-y-2">
          {q.choices.map((choice, ci) => {
            const picked = answers[idx] === ci;
            return (
              <li key={ci}>
                <label className={[
                  'flex items-start gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition',
                  picked
                    ? 'border-ospamber bg-ospamber/15 text-amber-100'
                    : 'border-white/15 hover:border-white/35 text-slate-200',
                ].join(' ')}>
                  <input
                    type="radio"
                    name={`exam-q-${idx}`}
                    value={ci}
                    checked={picked}
                    onChange={() => setAnswers(prev => ({ ...prev, [idx]: ci }))}
                    className="mt-0.5 shrink-0"
                  />
                  <span className="font-mono text-xs text-slate-300/60 shrink-0 mt-0.5">
                    {String.fromCharCode(65 + ci)}.
                  </span>
                  <span>{choice}</span>
                </label>
              </li>
            );
          })}
        </ul>

        {/* ── Navigation ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between mt-6 gap-3">
          <button
            type="button"
            disabled={idx === 0}
            onClick={() => setIdx(i => i - 1)}
            className="btn-ghost disabled:opacity-40"
          >
            ← Previous
          </button>

          {idx < EXAM_QUESTIONS.length - 1 ? (
            <button
              type="button"
              onClick={() => setIdx(i => i + 1)}
              className="btn-primary"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-primary bg-ospgreen/80 hover:bg-ospgreen"
            >
              Submit Exam
            </button>
          )}
        </div>

        {/* ── Unanswered warning on last question ─────────────────── */}
        {idx === EXAM_QUESTIONS.length - 1 && Object.keys(answers).length < EXAM_QUESTIONS.length && (
          <p className="mt-3 text-xs text-ospamber">
            {EXAM_QUESTIONS.length - Object.keys(answers).length} question(s) unanswered.
            You may submit now — unanswered questions count as wrong.
          </p>
        )}

      </section>
    </LessonLayout>
  );
}

// ── Root component ───────────────────────────────────────────────────────────

export default function C05L01_OSPFinalExam() {
  const [phase, setPhase]     = useState('landing'); // 'landing' | 'exam' | 'results'
  const [results, setResults] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  function handleStart() {
    setPhase('exam');
  }

  function handleComplete(res, time) {
    setResults(res);
    setElapsed(time);
    setPhase('results');
  }

  function handleRetake() {
    setResults(null);
    setElapsed(0);
    setPhase('landing');
  }

  if (phase === 'results') {
    return <ResultsView results={results} timeTaken={elapsed} onRetake={handleRetake} />;
  }

  if (phase === 'exam') {
    return <ExamView onComplete={handleComplete} />;
  }

  return <LandingView onStart={handleStart} />;
}
