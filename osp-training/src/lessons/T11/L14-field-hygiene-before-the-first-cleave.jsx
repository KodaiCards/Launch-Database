// T11.L14 — Field Hygiene — Before the First Cleave
// Working lesson: contamination types, IPA sequence (dry-first rule), gel cleanup,
// IEC 61300-3-35 zone map, controlled splice environment
// Source: M07 §7.6 partial; IEC 61300-3-35 [confirm edition]

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T11.L14',
  course_id: 'T11',
  title: 'Field Hygiene — Before the First Cleave',
  order: 14,
  lesson_type: 'working',
  prerequisites: ['T11.L13'],
  learning_objectives: [
    'Sequence the correct field fiber-end preparation routine from buffer tube opening through end-face inspection',
    'Explain why dry wipe must come BEFORE IPA wipe when gel-flooded fibers are present',
    'Name the four IEC 61300-3-35 end-face inspection zones (A/B/C/D) and state which zone defect is always a reject',
    'Identify the two most common field contamination errors and their consequences',
  ],
  estimated_minutes: 20,
  vocabulary_introduced: [
    'contamination (dust, oil, moisture, buffer gel residue)',
    'IPA wipe (99% isopropyl alcohol)',
    'lint-free wipe',
    'dry-cleave-first rule',
    'gel cleanup sequence (dry-then-wet)',
    'controlled splice environment',
    'IEC 61300-3-35 end-face zones (A/B/C/D)',
  ],
  vocabulary_assumed: [
    { term: 'fusion splice', source_lesson_id: 'T11.L04' },
    { term: 'cleave angle', source_lesson_id: 'T11.L06' },
    { term: 'insertion loss', source_lesson_id: 'T11.L12' },
    { term: 'IEC 61300-3-35 inspection protocol', source_lesson_id: 'T11.L12' },
    { term: 'IPA hazmat awareness', source_lesson_id: 'T18.L04' },
  ],
};

export const key_terms = [
  {
    term: 'Contamination (field context)',
    definition:
      'Any foreign substance on the fiber end-face or coating surface that increases loss or causes connector failure. The four main types: dust (airborne particulate), oil (skin oils from bare-hand contact), moisture (condensation or rain), and buffer gel residue (the petroleum or water-blocking gel inside the cable). Each type requires a specific removal sequence.',
  },
  {
    term: 'IPA wipe (99% isopropyl alcohol)',
    definition:
      'A lint-free wipe saturated with 99% isopropyl alcohol (IPA) used to dissolve and remove oil and moisture contamination from fiber surfaces. Must be 99% purity — lower grades contain water that leaves residue. SAFETY: IPA is flammable. Use nitrile gloves and ensure ventilation. Do not use near open flames.',
  },
  {
    term: 'Lint-free wipe',
    definition:
      'A low-particle wipe material (reel-type cassette or individual folded wipe) used to clean fiber surfaces. Key technique: always ROLL the wipe along the fiber — never wipe back-and-forth. Back-and-forth motion re-deposits contamination. Pull the wipe in one direction only, then use a fresh surface or fresh wipe.',
  },
  {
    term: 'Dry-cleave-first rule',
    definition:
      'The principle that a short section of any fiber should be cleaved and discarded BEFORE beginning the IPA cleaning sequence. Purpose: removes the first few millimeters of fiber that may have the highest contamination load from the cleaver\'s blade contact. After dry-cleave, clean, then cleave again for the actual splice.',
  },
  {
    term: 'Gel cleanup sequence (dry-then-wet)',
    definition:
      'When removing buffer gel from fibers, always dry-wipe first to mechanically lift and absorb the gel, THEN apply IPA. If IPA is applied first, it partially dissolves the gel and smears it into a thin film that is much harder to remove than the original gel. Dry first, then wet — never the reverse.',
  },
  {
    term: 'Controlled splice environment',
    definition:
      'Any enclosure, tent, or barrier that reduces wind, rain, and airborne dust at the splice work area. A fusion arc is extinguished by even a moderate breeze — and wind carries dust particles directly onto the cleaved fiber end. Field splice tents ($30–$80, lightweight) are standard equipment for aerial and outside-plant splicing.',
  },
  {
    term: 'IEC 61300-3-35 end-face zones (A/B/C/D)',
    definition:
      'A four-zone classification of the fiber end-face defined by IEC 61300-3-35 [confirm edition]. Zone A = core area (125 µm ferrule); Zone B = cladding area (inner ring); Zone C = contact area (epoxy); Zone D = outer ring. Any defect in Zone A (the light-carrying core) is an automatic reject — defects there directly increase insertion loss. Zones B/C/D have size-graded acceptance criteria.',
  },
];

export default function L14FieldHygieneBeforeTheFirstCleave() {
  const quizQuestions = [
    {
      id: 'q1',
      question:
        'A technician opens a gel-filled cable buffer tube and finds the fibers coated in water-blocking gel. What is the correct cleaning sequence?',
      type: 'multiple-choice',
      options: [
        'IPA-soaked lint-free wipe first, then dry wipe to remove residue',
        'Dry lint-free wipe first to mechanically remove gel, then IPA wipe to remove remaining oil film',
        'Canned air blast to remove gel, then IPA wipe',
        'IPA wipe, then re-wipe with IPA, then dry wipe',
      ],
      correct: 1,
      explanation:
        'Dry first, then wet. Applying IPA to gel-coated fiber partially dissolves the gel into a smeared film — harder to clean than the original gel bead. The dry wipe mechanically lifts and absorbs the bulk gel. IPA then cleans the remaining oil residue left behind. This sequence is critical for gel-filled cables, which are common in OSP outside-plant applications.',
    },
    {
      id: 'q2',
      question:
        'During end-face inspection on a fusion splice fiber, the technician finds a scratch in Zone A (the core area). The scratch is smaller than the Zone B acceptance limit for surface defects. Is this fiber acceptable?',
      type: 'multiple-choice',
      options: [
        'Yes — the scratch meets the Zone B size limit, which is the most conservative criterion',
        'No — Zone A is the core and any defect there is an automatic reject regardless of size',
        'Yes — for fusion splicing (not connectors), Zone A defects are acceptable if the estimated loss is under 0.10 dB',
        'Only if the inspection is done with a 400× scope — lower magnification might miss true defect size',
      ],
      correct: 1,
      explanation:
        'Zone A is the light-carrying core. Per IEC 61300-3-35 [confirm edition], ANY defect in Zone A is an automatic reject — the size limits that apply to Zones B/C/D do NOT apply to Zone A. A scratch in Zone A directly interrupts the guided light and causes increased insertion loss that cannot be corrected by cleaning.',
    },
    {
      id: 'q3',
      question:
        'A technician is cleaning a fiber end with a lint-free wipe soaked in IPA. After wiping left-to-right, they see some oil residue remaining. They wipe right-to-left with the same wipe surface to get the remaining oil. What error did they make?',
      type: 'multiple-choice',
      options: [
        'Using IPA — should use a dry wipe for oil contamination',
        'Wiping back-and-forth — this re-deposits the contamination that was just removed in the first pass',
        'Using the same wipe twice — should always use a fresh wipe after the first pass',
        'Both B and C are errors in this scenario',
      ],
      correct: 3,
      explanation:
        'Both B and C are correct: (1) back-and-forth motion re-deposits contamination — the correct technique is one-directional pull only; (2) the second pass should use a fresh, uncontaminated wipe surface. Pulling a contaminated wipe back across the fiber in the reverse direction guarantees you\'re smearing previously removed material back onto the end-face.',
    },
    {
      id: 'q4',
      question:
        'A crew is splicing in an open aerial bucket truck on a breezy day. The splicer keeps showing "arc error" or estimating unusually high losses. The most likely cause is:',
      type: 'multiple-choice',
      options: [
        'Electrode oxidation — the counter must have triggered',
        'Wind quenching the arc discharge — a splice tent or wind barrier is required',
        'The splicer profile is set for the wrong fiber type',
        'The fibers were cleaned with a lower-purity IPA that left a water residue',
      ],
      correct: 1,
      explanation:
        'Arc errors on breezy days in open aerial environments are almost always wind-related. Even a light breeze (5–10 mph) can deflect or quench the arc plasma column, producing inconsistent fusion. The correct fix is a field splice tent. Electrode oxidation is also possible but would not suddenly appear on a breezy day — it develops gradually over arc cycles. Water from low-purity IPA would cause arc instability but typically manifests as "fiber contaminated" warnings, not blank arc errors.',
    },
  ];

  const endFaceAnnotations = [
    {
      id: 'zone-a',
      x: 50,
      y: 50,
      label: 'Zone A — Core',
      description:
        'The innermost circle of the end-face, corresponding to the fiber core (8–9 µm for single-mode). This is the light-carrying region. ANY defect here (scratch, pit, contamination) is an automatic reject per IEC 61300-3-35 [confirm edition]. No size exceptions.',
    },
    {
      id: 'zone-b',
      x: 50,
      y: 30,
      label: 'Zone B — Cladding',
      description:
        'The ring between the core (Zone A) and the fiber-coating contact area. Defects here can scatter light if large enough. IEC 61300-3-35 specifies maximum defect dimensions by connector grade — generally no single defect exceeds a size limit defined in the standard.',
    },
    {
      id: 'zone-c',
      x: 35,
      y: 20,
      label: 'Zone C — Contact/Epoxy Area',
      description:
        'The region just outside the cladding, typically where adhesive contacts the ferrule. Contamination here can migrate toward the core over time. IEC 61300-3-35 defines acceptance criteria, but Zone C defects are less critical than Zone A/B.',
    },
    {
      id: 'zone-d',
      x: 20,
      y: 40,
      label: 'Zone D — Outer Ring',
      description:
        'The outer ferrule area. Contamination or scratches here rarely affect optical performance but can indicate inadequate cleaning discipline or ferrule damage. IEC 61300-3-35 accepts minor defects in Zone D.',
    },
    {
      id: 'scratch',
      x: 65,
      y: 60,
      label: 'Scratch (example defect)',
      description:
        'A linear surface damage feature from contact with a contaminated wipe or hard surface. A scratch in Zone A = automatic reject. In Zone B, acceptance depends on scratch width and length per IEC 61300-3-35 grade requirements.',
    },
    {
      id: 'pit',
      x: 55,
      y: 45,
      label: 'Pit / Chip (example defect)',
      description:
        'A point defect — typically from a hard particle impact. Pits in Zone A increase insertion loss directly. Pits in Zone B/C/D are graded by diameter. Pits are often caused by insufficiently cleaned end-faces before connector installation.',
    },
  ];

  return (
    <LessonLayout meta={meta}>
      {/* ── FOUNDATIONS TIER ─────────────────────────────── */}
      <section data-tier="foundations" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">In Plain English</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Contamination is the number-one cause of connector loss in the field — and it is a major cause of
          high splice loss too. A speck of dust invisible to the naked eye, placed on a fiber core that is
          8 microns wide (about one-tenth the width of a human hair), blocks enough light to fail an entire
          link. The precision of fiber optics demands precision cleaning before anything touches anything.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          The most common field mistakes are completely preventable: wiping back-and-forth (re-deposits
          what you just removed), IPA on gel first (creates a smear film), and skipping end-face inspection
          (you can't see a contaminated core without a scope). This lesson gives you the correct sequence
          so you don't make those mistakes.
        </p>
        <p className="text-gray-700 leading-relaxed mb-6">
          Think of a fiber end-face like a camera lens. You wouldn't wipe your camera lens back-and-forth
          with a dirty cloth — you'd use a clean lens wipe, one direction, and then inspect it under light.
          Same principle, smaller scale.
        </p>

        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500">
          <strong>Callback:</strong> Recall from <strong>T11.L03 Splice Loss — Four Numbers</strong> — even a single contaminated splice that exceeds 0.30 dB fails the contract. Everything in this lesson is the precision work that keeps you at or under that threshold. Field hygiene is not optional.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Key Terms — Flashcards</h3>
          <Flashcard
            deckId="T11-L14"
            cards={[
              {
                id: 'T11-L14-fc-contamination',
                front: 'What are the four types of fiber contamination in the field?',
                back: 'Dust (airborne particulate), oil (skin oils from bare-hand contact), moisture (condensation or rain), and buffer gel residue (petroleum or water-blocking gel inside the cable). Each type requires a specific removal sequence. Dust and oil are invisible to the naked eye.',
              },
              {
                id: 'T11-L14-fc-ipa',
                front: 'What is an IPA wipe and what purity is required?',
                back: 'A lint-free wipe saturated with 99% isopropyl alcohol (IPA) used to dissolve and remove oil and moisture contamination from fiber surfaces. Must be 99% purity — lower grades contain water that leaves residue. SAFETY: IPA is flammable. Use nitrile gloves and ensure ventilation. Do not use near open flames.',
              },
              {
                id: 'T11-L14-fc-lintfree',
                front: 'What is the correct wiping technique with a lint-free wipe?',
                back: 'Always ROLL the wipe along the fiber — never wipe back-and-forth. Pull the wipe in one direction only, then use a fresh surface or fresh wipe. Back-and-forth motion re-deposits contamination that was just lifted off the fiber surface.',
              },
              {
                id: 'T11-L14-fc-dry-cleave-first',
                front: 'What is the dry-cleave-first rule?',
                back: 'A short section of fiber is cleaved and discarded BEFORE beginning the IPA cleaning sequence. Purpose: removes the first few millimeters of fiber that may have the highest contamination load from the cleaver\'s blade contact. After dry-cleave, clean, then cleave again for the actual splice.',
              },
              {
                id: 'T11-L14-fc-gel-cleanup',
                front: 'What is the gel cleanup sequence and why must dry come before wet?',
                back: 'When removing buffer gel from fibers, always dry-wipe first to mechanically lift and absorb the gel, THEN apply IPA. If IPA is applied first, it partially dissolves the gel and smears it into a thin film that is much harder to remove than the original gel. Dry first, then wet — never the reverse.',
              },
              {
                id: 'T11-L14-fc-controlled-env',
                front: 'What is a controlled splice environment and why is it required for aerial work?',
                back: 'Any enclosure, tent, or barrier that reduces wind, rain, and airborne dust at the splice work area. A fusion arc is extinguished by even a moderate breeze — and wind carries dust particles directly onto the cleaved fiber end. Field splice tents ($30–$80, lightweight) are standard equipment for aerial and outside-plant splicing.',
              },
              {
                id: 'T11-L14-fc-zone-map',
                front: 'What are the IEC 61300-3-35 end-face zones A/B/C/D and which is always a reject?',
                back: 'Zone A = core area (light-carrying region, center); Zone B = cladding area (inner ring); Zone C = contact/epoxy area; Zone D = outer ferrule rim. Any defect in Zone A is an automatic reject — defects there directly increase insertion loss. Zones B/C/D have size-graded acceptance criteria.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── WORKING TIER ─────────────────────────────────── */}
      <section data-tier="working" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">The Field Hygiene Sequence</h2>

        <div className="p-4 mb-6 rounded-lg border border-blue-400/30 bg-blue-400/5">
          <h3 className="font-semibold text-blue-300 mb-2">Quick Refresher — Key Terms</h3>
          <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
            <li><strong>Fusion splice:</strong> The joint you're preparing for — contamination at the end-face kills it.</li>
            <li><strong>Cleave angle:</strong> You can have the perfect angle, but if the end-face has dust or gel smear, the splice loss will still be high.</li>
            <li><strong>IEC 61300-3-35 inspection protocol & insertion loss:</strong> The standard that defines fiber-end-face cleanliness for connectors; same principle for splicing.</li>
            <li><strong>IPA hazmat awareness:</strong> 99% isopropyl alcohol is flammable — use it in well-ventilated areas away from ignition sources.</li>
          </ul>
        </div>

        {/* Step-by-step prep routine */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Complete Fiber-End Preparation Routine</h3>
          <p className="text-gray-600 mb-4">
            Follow this sequence from the moment you open the buffer tube through the cleave. Each step has
            a quality checkpoint — skip any step and contamination compounds into the next.
          </p>

          <ol className="space-y-4">
            <li className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm">1</span>
                <div>
                  <h4 className="font-bold text-gray-800">Set up a controlled environment</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Erect a field splice tent or wind barrier before opening any fiber. Even indoor splicing
                    benefits from an enclosure — HVAC drafts and foot traffic generate dust. No tent = no
                    splice in field conditions. This is not optional on aerial or OSP work.
                  </p>
                </div>
              </div>
            </li>

            <li className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm">2</span>
                <div>
                  <h4 className="font-bold text-gray-800">Put on nitrile gloves before touching fiber</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Skin oil contamination is invisible and transfers to fiber within seconds of bare-hand
                    contact. Use nitrile (not latex — latex leaves residue). Also required for IPA handling —
                    99% IPA absorbs through skin and is a fire hazard without gloves and ventilation.
                  </p>
                </div>
              </div>
            </li>

            <li className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm">3</span>
                <div>
                  <h4 className="font-bold text-gray-800">
                    <span className="text-orange-700">GEL CABLE ONLY:</span> Dry wipe first to remove bulk gel
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    For gel-filled (flooded) cables, pull a lint-free dry wipe along the fiber in one direction
                    to mechanically lift and absorb the bulk gel. Repeat with fresh dry-wipe surfaces until
                    no visible gel remains. <strong>Do NOT apply IPA until the bulk gel is gone.</strong>
                  </p>
                </div>
              </div>
            </li>

            <li className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm">4</span>
                <div>
                  <h4 className="font-bold text-gray-800">IPA wipe — one direction only</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Apply a fresh IPA-soaked lint-free wipe to the fiber. Pull in ONE direction only — do not
                    wipe back-and-forth. Use a fresh wipe surface for each pass. IPA dissolves oil residue left
                    after dry-wipe step. Allow 2–3 seconds for IPA to evaporate before moving to next step.
                  </p>
                </div>
              </div>
            </li>

            <li className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm">5</span>
                <div>
                  <h4 className="font-bold text-gray-800">Dry cleave-first to discard the front section</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Make a dry cleave and discard the first few millimeters of fiber. This removes the
                    fiber end that contacted the cleaver blade and any contamination concentrated at the
                    very tip. Then re-clean with IPA and make the final cleave for the actual splice.
                  </p>
                </div>
              </div>
            </li>

            <li className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm">6</span>
                <div>
                  <h4 className="font-bold text-gray-800">Final cleave and immediate load — no delay</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    After the final cleave, load the fiber into the splicer's V-groove immediately. Every
                    second of exposure to open air allows dust to settle on the end-face. Do not set down the
                    cleaved fiber on any surface. Do not breathe across it.
                  </p>
                </div>
              </div>
            </li>
          </ol>
        </div>

        {/* Two major errors callout */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">The Two Most Common Field Contamination Errors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-red-50 border border-red-300 rounded-lg p-5">
              <h4 className="font-bold text-red-800 mb-2">Error #1 — IPA First on Gel-Flooded Fiber</h4>
              <p className="text-sm text-gray-700 mb-2">
                <strong>What happens:</strong> IPA partially dissolves the hydrophobic buffer gel into a thin,
                transparent smear. The smear cannot be wiped off — it must be dissolved with additional IPA
                and wiped, which risks depositing the dissolved gel back on the end-face.
              </p>
              <p className="text-sm text-gray-700">
                <strong>The fix:</strong> Always dry-wipe first to mechanically remove bulk gel. IPA is the
                second step, not the first.
              </p>
            </div>

            <div className="bg-red-50 border border-red-300 rounded-lg p-5">
              <h4 className="font-bold text-red-800 mb-2">Error #2 — Back-and-Forth Wiping Motion</h4>
              <p className="text-sm text-gray-700 mb-2">
                <strong>What happens:</strong> The first pass lifts contamination onto the wipe. Reversing
                direction drags that contamination — now mixed with IPA — back across the fiber surface, often
                depositing it at a different location (including the end-face).
              </p>
              <p className="text-sm text-gray-700">
                <strong>The fix:</strong> One direction only, then fresh wipe surface for each subsequent pass.
                Think of it as a one-way street — never reverse.
              </p>
            </div>
          </div>
        </div>

        {/* AnnotatedDiagram — IEC 61300-3-35 zone map */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            IEC 61300-3-35 End-Face Inspection Zone Map <span className="text-sm font-normal text-gray-500">[confirm edition]</span>
          </h3>
          <p className="text-gray-600 mb-4">
            The IEC 61300-3-35 standard defines four concentric inspection zones on a fiber end-face. Click each
            annotation to understand the zone boundaries and acceptance criteria.
          </p>
            </div>

        {/* Four contamination types table */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Four Contamination Types and Their Removal</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Type</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Source</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Visible?</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Removal Sequence</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">Dust</td>
                  <td className="border border-gray-300 px-3 py-2">Airborne particulate</td>
                  <td className="border border-gray-300 px-3 py-2">Only under 200×+ scope</td>
                  <td className="border border-gray-300 px-3 py-2">Controlled environment + IPA wipe (one-direction)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2 font-medium">Oil</td>
                  <td className="border border-gray-300 px-3 py-2">Skin contact, lubricants</td>
                  <td className="border border-gray-300 px-3 py-2">Not visible to naked eye</td>
                  <td className="border border-gray-300 px-3 py-2">Nitrile gloves to prevent; IPA wipe to remove</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-medium">Moisture</td>
                  <td className="border border-gray-300 px-3 py-2">Condensation, rain, breath</td>
                  <td className="border border-gray-300 px-3 py-2">Sometimes visible as fogging</td>
                  <td className="border border-gray-300 px-3 py-2">IPA wipe — IPA is water-miscible, removes moisture residue; allow full evaporation</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2 font-medium">Buffer gel residue</td>
                  <td className="border border-gray-300 px-3 py-2">Gel-filled cable flooding compound</td>
                  <td className="border border-gray-300 px-3 py-2">Yes — clear or amber glob</td>
                  <td className="border border-gray-300 px-3 py-2"><strong>Dry wipe first</strong>, then IPA wipe. Never IPA-first on gel.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quiz */}
        <Quiz
          questions={quizQuestions}
          title="Check Your Understanding — Field Hygiene"
        />
      </section>

      {/* ── ADVANCED TIER ────────────────────────────────── */}
      <section data-tier="advanced" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Book vs. Field Practice</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h3 className="text-lg font-bold text-blue-800 mb-3">The Book (IEC 61300-3-35 / IEC 61300-3-13)</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
              <li>Inspect every connector end-face before and after every connection</li>
              <li>Clean with IEC-specified cleaning tools (reel-type dry cleaner or appropriate IPA swab)</li>
              <li>Any Zone A defect = automatic reject, regardless of size</li>
              <li>Use controlled environment to prevent dust contamination during inspection</li>
              <li>Document inspection results for contractor-grade acceptance testing</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
            <h3 className="text-lg font-bold text-amber-800 mb-3">Common Field Practice</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
              <li>Many crews skip end-face inspection entirely on fusion splice work ("we inspected the OTDR trace")</li>
              <li>IPA wipes are sometimes generic isopropyl (70–91%), not 99% — leaves water residue</li>
              <li>Inspection scopes are shared among crews and rarely calibrated</li>
              <li>Splicing in open vehicles without a tent because "it's not windy right now"</li>
              <li>Dust caps skipped on connectors during short moves ("we're repatching in 5 minutes")</li>
            </ul>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-5 mb-6">
          <h3 className="text-lg font-bold text-red-800 mb-2">Why the Field Shortcuts Cost More Later</h3>
          <p className="text-gray-700 text-sm mb-2">
            Using 70% IPA instead of 99% leaves a water-plus-additive residue film on the fiber. This film
            is invisible at room temperature but can cause intermittent loss in cold weather as the residue
            contracts differently from the glass. On a RUS contract, an "intermittent" fiber event discovered
            during acceptance testing requires locating the splice case, re-entering, re-cleaving, and
            re-splicing — far more expensive than the $0.50 cost difference between 99% and 70% IPA.
          </p>
          <p className="text-gray-700 text-sm">
            Skipping the wind tent for "just a few splices" on an aerial job results in contamination-driven
            high loss that appears to be a bad splice when it's actually a contaminated end-face. The OTDR
            reading looks identical to a misaligned core. Troubleshooting a contamination event wastes more
            time than erecting the tent did.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <h3 className="text-lg font-bold text-gray-700 mb-2">IEC 61300-3-35 Zone Map in Practice</h3>
          <p className="text-gray-700 text-sm mb-2">
            IEC 61300-3-35 [confirm edition] grades connectors by class (Grade A, B, or C), and each class
            has different Zone B/C/D acceptance limits. Grade A is the most stringent — used for high-power
            systems, CATV optical networks, and WDM applications where back-reflection causes interference.
            Grade B is standard telecommunications. Grade C is the most permissive.
          </p>
          <p className="text-gray-700 text-sm">
            In OSP field work, contractors are typically required to meet the standard's acceptance criteria
            as part of their inspection protocol — but many field inspection scopes are only 200× while the
            standard's detection limits may require 400×. A defect that passes at 200× can still fail Zone A
            criteria at 400×. Specifying scope magnification requirements in the contract is a project
            manager's quality control responsibility, not just an installer's cleaning responsibility.
          </p>
        </div>
      </section>

      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          This lesson builds on:
        </p>
        <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
    <li><strong>T11.L04</strong> — Part of the broader OSP workflow.</li>
    <li><strong>T11.L06</strong> — Part of the broader OSP workflow.</li>
    <li><strong>T11.L12</strong> — Part of the broader OSP workflow.</li>
        </ul>
        <p className="text-slate-200 mt-3 text-sm italic">
          Each step in the OSP process feeds into the next — understanding these connections strengthens your grasp of the whole system.
        </p>
      </section>
    </LessonLayout>
  );
}
