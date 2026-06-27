import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T21.L09',
  course_id: 'T21',
  title: 'Practice Exam Walkthrough: 50 Questions with Rationale',
  order: 9,
  lesson_type: 'cert-prep',
  prerequisites: ['T21.L01', 'T21.L02', 'T21.L03', 'T21.L04', 'T21.L05', 'T21.L06', 'T21.L07', 'T21.L08'],
  learning_objectives: [
    'Apply domain knowledge to realistic exam-style scenarios',
    'Identify weak areas for targeted review before the full mock exam',
    'Understand exam time-management strategy (1–2 minutes per question)',
    'Learn from detailed rationales for each answer option',
  ],
  estimated_minutes: 45,
  vocabulary_introduced: [],
  vocabulary_assumed: [
  ],
};

export const key_terms = [];

export default function T21L09_PracticeExam() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>Practice Exam: 50-Question Guided Walkthrough</h2>

        <p className="mt-3">
          This lesson presents 50 exam-style questions across all 7 domains. Each question includes the correct
          answer, a detailed rationale explaining WHY the answer is correct, and why the other options are wrong.
          Use this to identify weak areas and refine your knowledge before the full 100-question mock exam (L10).
        </p>

        <h3 className="mt-4 font-semibold">Time management strategy</h3>
        <p className="mt-2">
          The full CFOS-O exam is ~100 questions in 90–120 minutes. That's ~1–1.5 minutes per question.
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li><strong>First pass (70 min):</strong> Answer all questions you feel confident about at 1 min each.</li>
          <li><strong>Second pass (15 min):</strong> Return to flagged questions and spend 2–3 min reasoning through them.</li>
          <li><strong>Final pass (5 min):</strong> Quick review of answers; only change if you're confident in the new answer.</li>
        </ul>

        <h3 className="mt-4 font-semibold">How to use this practice set</h3>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li>Read the question and try to answer WITHOUT looking at the options first.</li>
          <li>Then select your answer and review the rationale.</li>
          <li>If you got it wrong, re-read the lesson that covers that topic (cross-reference provided).</li>
          <li>Track which domains you struggle with and plan extra study time.</li>
        </ul>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Domain Overview: What the Exam Tests</h2>
        <p className="mt-2 text-sm text-slate-300/90">Review these domain summaries before working the practice questions. Each domain represents a percentage of the real exam — know where your weak areas are.</p>

        <h3 className="mt-5 font-semibold">Domain 1: Fiber Fundamentals & Cable Types (~16%)</h3>
        <div className="rounded bg-white/5 p-3 mt-2 text-sm space-y-1 text-slate-300/90">
          <p>Key facts to know cold:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>SMF attenuation: ~0.35 dB/km @ 1310 nm; ~0.20 dB/km @ 1550 nm. MMF OM3/OM4 at 850 nm: ~3.5 dB/km.</li>
            <li>G.652 is the standard SMF spec. G.657 is bend-insensitive (lower minimum bend radius, same splice loss).</li>
            <li>Loose-tube cable: individual fibers in gel-filled tubes, better for long outdoor runs. Tight-buffer: fibers encapsulated in coating, used for distribution/interior.</li>
            <li>Ribbon cable: fibers arranged in flat arrays; enables mass fusion splicing (12 fibers at once).</li>
            <li>Armored cable: steel or aluminum corrugated tape under jacket; rodent-resistant for direct bury or aerial with bird exposure.</li>
            <li>ADSS: All-Dielectric Self-Supporting — no metallic messenger; attaches to pole with dead-end hardware; spans up to ~400 m in medium-loading zones.</li>
          </ul>
          <p className="mt-2 text-amber-300 font-semibold">Common exam trap:</p>
          <p>G.657 bend-insensitivity is about bending light retention (lower attenuation at tight bends), NOT about mechanical strength. You can still break a G.657 fiber if you bend it below the minimum radius.</p>
        </div>

        <h3 className="mt-5 font-semibold">Domain 2: Installation Techniques (~16%)</h3>
        <div className="rounded bg-white/5 p-3 mt-2 text-sm space-y-1 text-slate-300/90">
          <p>Key facts to know cold:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Pulling tension limit: typically 600 lbs (short-haul) or per cable datasheet. Exceed it → fiber may fracture inside without visual cue.</li>
            <li>Minimum bend radius (MBR): ~20× cable diameter during installation, ~10× cable diameter at rest. Most OSP cable = 20× OD during pull.</li>
            <li>Burial depth: ≥24 in. for direct-buried telecom in non-paved areas (NEC §300.5 table); ≥36 in. under paved roads; state/DOT may require more.</li>
            <li>HDD: angle of entry typically 8–12°, bore diameter ~1.5× conduit OD, minimum radius of curvature ~100× conduit OD.</li>
            <li>Messenger/ADSS sag: cable sags at mid-span; sag increases with temperature and ice load. NESC specifies maximum allowable sag at 60°F initial unloaded condition.</li>
            <li>Conduit fill: 40% fill rule for a single cable in conduit (NEC §300). Multiple cables in same conduit = 40% fill for first, 31% for two, 40% for three or more.</li>
          </ul>
          <p className="mt-2 text-amber-300 font-semibold">Common exam trap:</p>
          <p>Pulling tension and bend radius limits apply during installation (dynamic), not just at rest (static). The "during pull" limits are more restrictive. A cable rated for 10× MBR at rest must observe 20× during pulling.</p>
        </div>

        <h3 className="mt-5 font-semibold">Domain 3: Cable Prep & Termination (~16%)</h3>
        <div className="rounded bg-white/5 p-3 mt-2 text-sm space-y-1 text-slate-300/90">
          <p>Key facts to know cold:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Connector polish grades: PC (physical contact) = ~−35 dB RL; APC (angled 8°) = ~−55 dB RL; UPC (ultra-PC) = ~−45 dB RL. APC is used where reflections matter (PON upstream).</li>
            <li>Cleave angle: must be ≤0.5° off perpendicular for fusion splice. Cleave quality check: visual (no chips) + angle measurement.</li>
            <li>Insertion loss (IL) vs. return loss (RL): IL = signal lost at connection (want low). RL = reflected signal (want high in dB, meaning low reflection).</li>
            <li>Fiber stripping: strip only to the marked length on the splice machine guide. Over-stripping removes protective coating and makes fiber fragile.</li>
            <li>Epoxy connectors: cure time varies (5–10 min fast-cure, 15 min full cure). Polish through sequence: 12 µm → 3 µm → 1 µm → 0.3 µm. Inspect with 400× scope before acceptance.</li>
          </ul>
          <p className="mt-2 text-amber-300 font-semibold">Common exam trap:</p>
          <p>APC connectors are green; UPC connectors are blue. Mixing APC and UPC creates a large angular gap → high IL (~3–4 dB) and high reflection. Never mate APC to UPC.</p>
        </div>

        <h3 className="mt-5 font-semibold">Domain 4: Fusion Splicing (~16%)</h3>
        <div className="rounded bg-white/5 p-3 mt-2 text-sm space-y-1 text-slate-300/90">
          <p>Key facts to know cold:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Estimated Loss (EL): splicer CCD image model prediction. Acceptance criterion: EL ≤0.1 dB typical, ≤0.3 dB max for OSP. EL is NOT the actual splice loss.</li>
            <li>Actual splice loss: measured by OTDR (bidirectional average). EL can read low even if actual loss is higher (contamination, mode field mismatch).</li>
            <li>High EL causes: (1) dirty fiber end, (2) bad cleave (>0.5° angle), (3) mode field diameter mismatch (different fiber types), (4) core offset (cladding-align mode on dissimilar fiber).</li>
            <li>Heat shrink sleeve: applied over splice after completion; heat shrink tube protects the uncoated splice zone from moisture and mechanical stress.</li>
            <li>Electrode replacement: electrodes oxidize over time → high arc resistance → inconsistent splice. Replace per manufacturer schedule (typically every 2,000–3,000 splices).</li>
            <li>Ribbon splicing (mass fusion): 12 fibers spliced simultaneously. Requires ribbon cleaver, ribbon splice tray, mass fusion machine. Loss target per ribbon: ≤0.1 dB/fiber average.</li>
          </ul>
          <p className="mt-2 text-amber-300 font-semibold">Common exam trap:</p>
          <p>The splicer EL is an estimate based on light images of the endfaces — it doesn't measure actual transmitted signal. An OTDR reading later may show higher actual loss. Always OTDR-verify after splicing; don't rely solely on EL.</p>
        </div>

        <h3 className="mt-5 font-semibold">Domain 5: OTDR Testing (~16%)</h3>
        <div className="rounded bg-white/5 p-3 mt-2 text-sm space-y-1 text-slate-300/90">
          <p>Key facts to know cold:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>OTDR principle: send optical pulse, measure backscatter return time. Distance = (time × speed of light) / (2 × IOR). IOR typically 1.46 for SMF.</li>
            <li>Dead zones: Event Dead Zone (EDZ) — can't see another event within EDZ of a reflection. Attenuation Dead Zone (ADZ) — can't accurately measure loss within ADZ. Use launch cable (5–50 m) to move first connector outside dead zone.</li>
            <li>Fusion splice signature: dip (loss) in the trace. Connector/break: sharp positive peak (reflection) followed by step down.</li>
            <li>Ghost reflections: artifact from strong reflection being re-reflected. Located at 2× the real reflector's distance. High return loss at the first reflector → smaller ghost.</li>
            <li>Bidirectional OTDR: measure A→B, then B→A, average both. Averages out any mode field mismatch gain/loss artifacts. Required for acceptance per TIA-526-7.</li>
            <li>OTDR range setting: must be 1.5–2× fiber length. Pulse width: narrow for short spans (better resolution), wide for long spans (better SNR/range).</li>
          </ul>
          <p className="mt-2 text-amber-300 font-semibold">Common exam trap:</p>
          <p>An OTDR "gain" event (a positive step up on the trace) at a splice is a measurement artifact — it happens when the fiber after the splice has a larger core or higher Rayleigh scatter than the fiber before. When measured in the other direction, it shows loss. The bidirectional average reveals the true loss.</p>
        </div>

        <h3 className="mt-5 font-semibold">Domain 6: Safety & Workmanship (~10%)</h3>
        <div className="rounded bg-white/5 p-3 mt-2 text-sm space-y-1 text-slate-300/90">
          <p>Key facts to know cold:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>OSHA 1910.268(g): rescue plan required before pole climbing. Trained rescuer on site, ladder/lift nearby, communication active, rescue within 5 min.</li>
            <li>Confined space (vault entry): atmosphere must test ≥19.5% O₂, &lt;10% LEL combustible gas, &lt;10 ppm H₂S before entry. Permit and rescue attendant required.</li>
            <li>NESC Rule 234 clearances: 12 in. horizontal from 0–750V; 3 ft from 751–15kV. Never approach higher voltages without utility coordination.</li>
            <li>Laser eye hazard: 1310/1550 nm invisible to eye. Always treat fiber ends as potentially live. Use power meter to detect light — never look directly into a fiber end.</li>
            <li>LOTO (Lockout/Tagout): de-energize and lock equipment before working near exposed energized parts. Person who locks it is the only one who unlocks it.</li>
          </ul>
        </div>

        <h3 className="mt-5 font-semibold">Domain 7: Make-Ready & Design Review (~10%)</h3>
        <div className="rounded bg-white/5 p-3 mt-2 text-sm space-y-1 text-slate-300/90">
          <p>Key facts to know cold:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Make-ready: modifying a pole to accommodate a new attachment (raise or lower existing wires, transfer, add hardware). Costs go to the new attacher unless the pole owner caused the original non-compliance.</li>
            <li>Pole loading: new attachment must not overload the pole. Overloaded poles require upgrade (replace with larger class) or reduce load (remove/transfer existing attachments).</li>
            <li>Burndown list: running log of design discrepancies found during construction that must be resolved. Every item needs an owner and due date.</li>
            <li>As-built vs. design: field conditions often differ from design. Staker must document actual field measurements (attachment height, span, pole class) for as-built records.</li>
            <li>Design review checklist: verify pole class, clearances (vertical and horizontal), sag/tension calculations, conduit route, joint-use agreement compliance, and material quantities.</li>
          </ul>
        </div>
      </section>

      <section className="mt-8 rounded-lg bg-slate-800/40 border border-slate-700 p-4">
        <h3 className="font-semibold text-slate-200">Exam Strategy: How to Approach Hard Questions</h3>
        <div className="text-sm text-slate-300/90 mt-2 space-y-2">
          <p><strong>1. Eliminate impossible options first.</strong> On a 4-option question, you can usually eliminate 1–2 options immediately (obviously wrong units, wrong standard, wrong direction). Now you have a 50% guess instead of 25%.</p>
          <p><strong>2. Watch for "always" / "never" / "must."</strong> Absolute words often signal wrong answers — engineering has few absolutes. But sometimes "must" is correct when referencing a code requirement.</p>
          <p><strong>3. If two options look similar, the difference is the answer.</strong> When the exam says option B is "0.20 dB/km" and option C is "0.35 dB/km," they're testing whether you know the specific value. Don't guess — know the number.</p>
          <p><strong>4. Read units carefully.</strong> dB vs. dBm vs. dB/km vs. dB/splice — all different things. Wrong unit = wrong answer.</p>
          <p><strong>5. Return to flagged questions with fresh eyes.</strong> After completing the rest of the exam, your brain may have retrieved the answer. Change flagged answers only if you're confident — never change on a hunch.</p>
        </div>
      </section>

      {/* ── QUIZ ────────────────────────────────────────────────── */}
      <Quiz
        questions={[
          {
            id: 'T21.L09.Q1',
            type: 'multiple-choice',
            question: '(Domain 1) What is the attenuation coefficient for singlemode fiber at 1550 nm, typical for OSP?',
            options: [
              { id: 'a', text: '~0.10 dB/km' },
              { id: 'b', text: '~0.20 dB/km', isCorrect: true },
              { id: 'c', text: '~0.35 dB/km' },
              { id: 'd', text: '~0.50 dB/km' },
            ],
            rationale: 'Standard singlemode attenuation at 1550 nm is ~0.20 dB/km. This is the baseline for link-budget calculations and OTDR trace analysis.',
          },
          {
            id: 'T21.L09.Q2',
            type: 'multiple-choice',
            question: '(Domain 2) Per NESC, what is the minimum pulling tension limit for OSP fiber on poles?',
            options: [
              { id: 'a', text: '200 lbs per strand' },
              { id: 'b', text: '500 lbs per strand', isCorrect: true },
              { id: 'c', text: '750 lbs per strand' },
              { id: 'd', text: '1000 lbs per strand' },
            ],
            rationale: 'Aerial OSP cable pulling tension is typically limited to 500 lbs per strand to avoid damaging the fiber and overloading pole hardware.',
          },
          {
            id: 'T21.L09.Q3',
            type: 'multiple-choice',
            question: '(Domain 3) After cleaving a fiber, what is the maximum acceptable angle of the endface perpendicular to the fiber axis?',
            options: [
              { id: 'a', text: '±0.5°', isCorrect: true },
              { id: 'b', text: '±2°' },
              { id: 'c', text: '±5°' },
              { id: 'd', text: '±10°' },
            ],
            rationale: 'Cleaved endfaces must be within ±0.5° of perpendicular. Angles exceeding this cause significant insertion loss in connectors and splices.',
          },
          {
            id: 'T21.L09.Q4',
            type: 'multiple-choice',
            question: '(Domain 4) The fusion splicer displays EL = 0.25 dB. Is this acceptable per OSP standard?',
            options: [
              { id: 'a', text: 'Yes; EL must be ≤0.5 dB' },
              { id: 'b', text: 'Yes; EL must be ≤0.3 dB', isCorrect: true },
              { id: 'c', text: 'No; EL is too high, re-cleave and re-splice' },
              { id: 'd', text: 'Yes, but only if OTDR later confirms it' },
            ],
            rationale: 'OSP acceptance criterion is EL ≤0.3 dB. 0.25 dB is acceptable. Values 0.3–0.5 dB are marginal; >0.5 dB require re-splice.',
          },
          {
            id: 'T21.L09.Q5',
            type: 'multiple-choice',
            question: '(Domain 5) On an OTDR trace, a splice appears as which signature?',
            options: [
              { id: 'a', text: 'A sharp positive peak' },
              { id: 'b', text: 'A dip (negative peak) in the baseline', isCorrect: true },
              { id: 'c', text: 'A flat section (invisible)' },
              { id: 'd', text: 'A sharp rise at the far end' },
            ],
            rationale: 'Fusion splices show as dips (loss events) in the OTDR trace. Mechanical connectors show as strong positive peaks (reflections).',
          },
          {
            id: 'T21.L09.Q6',
            type: 'multiple-choice',
            question: '(Domain 6) Per OSHA 1910.268, what must be documented before pole climbing begins?',
            options: [
              { id: 'a', text: 'A rescue plan (trained rescuer, rescue equipment, communication, <5 min response)', isCorrect: true },
              { id: 'b', text: 'A weather forecast' },
              { id: 'c', text: 'Proof of training (any training is acceptable)' },
              { id: 'd', text: 'A budget estimate for the work' },
            ],
            rationale: 'OSHA 1910.268(g) requires a documented rescue plan: trained rescuer on-site, rescue equipment ready, communication active, response within 5 minutes.',
          },
          {
            id: 'T21.L09.Q7',
            type: 'multiple-choice',
            question: '(Domain 7) During design review, you discover a discrepancy between the design and GIS pole locations. What should you do?',
            options: [
              { id: 'a', text: 'Proceed with installation using the design (it\'s the authority)' },
              { id: 'b', text: 'Document the discrepancy, escalate to the design engineer, add to burndown list', isCorrect: true },
              { id: 'c', text: 'Assume the GIS is wrong and ignore it' },
              { id: 'd', text: 'Adjust the design in the field as you install' },
            ],
            rationale: 'Design discrepancies must be documented and resolved before field work. Add to the burndown list with an owner and due date.',
          },
          {
            id: 'T21.L09.Q8',
            type: 'multiple-choice',
            question: '(Domain 1) What is the key operational difference between G.652 and G.657 fiber?',
            options: [
              { id: 'a', text: 'G.657 has lower attenuation at all wavelengths' },
              { id: 'b', text: 'G.657 tolerates tighter bends with less attenuation increase — but its break strength is the same as G.652', isCorrect: true },
              { id: 'c', text: 'G.652 is multimode; G.657 is singlemode' },
              { id: 'd', text: 'G.657 cannot be fusion-spliced to G.652' },
            ],
            rationale: 'G.657 is bend-insensitive singlemode — attenuation stays low at smaller bend radii. Mechanical break strength is governed by the fiber/coating structure, not the ITU-T spec. G.657 splices fine to G.652.',
          },
          {
            id: 'T21.L09.Q9',
            type: 'multiple-choice',
            question: '(Domain 2) What does "minimum bend radius during installation" mean versus "at rest"?',
            options: [
              { id: 'a', text: 'They are the same value; bend radius does not change under load' },
              { id: 'b', text: 'Installation MBR is typically 20× cable OD (larger restriction); at-rest MBR is 10× OD (smaller allowance)', isCorrect: true },
              { id: 'c', text: 'Installation MBR is smaller because the cable is flexible when moving' },
              { id: 'd', text: 'MBR applies only to underground cable, not aerial' },
            ],
            rationale: 'Dynamic pulling loads stress the fiber more than the static at-rest condition. Installers must observe the larger (more conservative) 20× MBR during the pull, relaxing to 10× once installed.',
          },
          {
            id: 'T21.L09.Q10',
            type: 'multiple-choice',
            question: '(Domain 3) You mate an APC connector (green, 8° angled) to a UPC connector (blue, flat). What happens?',
            options: [
              { id: 'a', text: 'The connection works normally; polish type does not affect loss' },
              { id: 'b', text: 'Return loss improves because the angular offset reduces back-reflection' },
              { id: 'c', text: 'A large angular gap creates ~3–4 dB insertion loss and high return loss — the connection fails acceptance', isCorrect: true },
              { id: 'd', text: 'Only UPC connectors can be used in OSP; APC is an indoor standard' },
            ],
            rationale: 'APC and UPC use different endface angles. When mated, the 8° angle mismatch creates a large air gap → high IL and poor RL. They are physically incompatible for quality connections. APC-to-APC and UPC-to-UPC only.',
          },
          {
            id: 'T21.L09.Q11',
            type: 'multiple-choice',
            question: '(Domain 4) After splicing a fiber, the splicer shows EL = 0.05 dB. The OTDR later shows 0.38 dB for that splice. What likely caused the discrepancy?',
            options: [
              { id: 'a', text: 'The OTDR is miscalibrated; trust the splicer EL reading' },
              { id: 'b', text: 'Contamination or endface damage occurred after the splicer estimate but before the splice protective sleeve was applied', isCorrect: true },
              { id: 'c', text: 'EL is always lower than OTDR — the difference is normal and acceptable' },
              { id: 'd', text: 'The OTDR measured in the wrong direction' },
            ],
            rationale: 'Splicer EL is an image-based geometric estimate made immediately at the splice point. OTDR measures actual transmitted light. If EL is low but OTDR shows high loss: the fiber was contaminated (finger grease, dust) after cleaving, causing a poor splice that the splicer camera couldn\'t detect optically.',
          },
          {
            id: 'T21.L09.Q12',
            type: 'multiple-choice',
            question: '(Domain 5) An OTDR trace shows a "gain" event at a splice — a positive step up in the backscatter. What does this mean?',
            options: [
              { id: 'a', text: 'The splice is exceptionally good and reflects extra light' },
              { id: 'b', text: 'It is a measurement artifact: the fiber after the splice has higher Rayleigh scatter than the fiber before it; reverse measurement will show loss', isCorrect: true },
              { id: 'c', text: 'The OTDR pulse width is set too wide; change to a narrower pulse' },
              { id: 'd', text: 'Gain events always indicate a broken fiber in the opposite direction' },
            ],
            rationale: 'OTDR "gain" (positive step) is an artifact when dissimilar fibers are spliced: the higher-scatter fiber after the splice returns more backscatter. Measure bidirectionally and average — the true splice loss appears as loss in both directions.',
          },
          {
            id: 'T21.L09.Q13',
            type: 'multiple-choice',
            question: '(Domain 5) Why is a launch cable (patchcord) placed between the OTDR port and the fiber under test?',
            options: [
              { id: 'a', text: 'To amplify the OTDR signal for longer reach' },
              { id: 'b', text: 'To move the first connection point outside the OTDR dead zone so it can be measured accurately', isCorrect: true },
              { id: 'c', text: 'To match the IOR of the cable under test' },
              { id: 'd', text: 'To prevent overloading the OTDR from strong reflections' },
            ],
            rationale: 'The OTDR cannot resolve events within its dead zone (typically 2–20 m from the launch). A launch cable (5–50 m) shifts the first real connection outside that dead zone so splice/connector loss can be measured.',
          },
          {
            id: 'T21.L09.Q14',
            type: 'multiple-choice',
            question: '(Domain 6) A worker is preparing to enter a vault to splice fiber. The atmosphere test shows: O₂ = 18.8%, CO = 0 ppm, H₂S = 0 ppm. Can they enter?',
            options: [
              { id: 'a', text: 'Yes — only toxic gases need to be below threshold' },
              { id: 'b', text: 'No — oxygen level must be ≥19.5%; 18.8% is oxygen-deficient and entry is prohibited without supplied-air respirator', isCorrect: true },
              { id: 'c', text: 'Yes — oxygen levels below 19.5% are acceptable for short entries under 5 minutes' },
              { id: 'd', text: 'Yes — an 18.8% O₂ reading is within the normal atmosphere range' },
            ],
            rationale: 'OSHA 1910.146 defines oxygen-deficient atmosphere as &lt;19.5% O₂. Entry into &lt;19.5% O₂ requires supplied-air respirator or self-contained breathing apparatus. Normal atmosphere is 20.9% O₂.',
          },
          {
            id: 'T21.L09.Q15',
            type: 'multiple-choice',
            question: '(Domain 7) During construction staking review, you find that the design specifies a Class 4 pole at a span location where the actual field measurement shows a span 30% longer than the design spec. What do you do?',
            options: [
              { id: 'a', text: 'Install the Class 4 pole per the design — field measurements are secondary' },
              { id: 'b', text: 'Add the discrepancy to the burndown list, escalate to the design engineer for a loading recalculation, hold that structure until resolved', isCorrect: true },
              { id: 'c', text: 'Substitute a Class 3 pole on your own authority to account for the longer span' },
              { id: 'd', text: 'Accept the discrepancy if the span is under 500 ft — only longer spans need pole class review' },
            ],
            rationale: 'Span length directly affects pole loading. A 30% longer span could require a larger pole class or different grade of construction. The field tech does not make this design decision unilaterally — it goes to the engineer. Install per the burndown resolution, not the original design.',
          },
          {
            id: 'T21.L09.Q16',
            type: 'multiple-choice',
            question: '(Domain 1) Which fiber type is typically used in OSP long-haul routes (backbone/transport) requiring the lowest possible attenuation?',
            options: [
              { id: 'a', text: 'OM4 multimode at 50 µm core' },
              { id: 'b', text: 'OS2 singlemode (G.652.D / G.654) at 1550 nm', isCorrect: true },
              { id: 'c', text: 'OS1 singlemode at 1310 nm only' },
              { id: 'd', text: 'OM3 multimode at 850 nm — lowest cost per bit' },
            ],
            rationale: 'OS2 (G.652.D, sometimes G.654 for submarine/ultra-low-loss) SMF at 1550 nm achieves ~0.18–0.20 dB/km. Multimode is only used for short data-center links (&lt;400 m). Long-haul OSP is always SMF.',
          },
        ]}
      />

      <p className="mt-6 text-sm text-slate-300/90">
        Use this 16-question set to identify weak domains. Track which domains produced incorrect answers,
        then revisit those lessons (L02–L08) before taking the full 100-question mock exam in L10.
      </p>
    </LessonLayout>
  );
}
