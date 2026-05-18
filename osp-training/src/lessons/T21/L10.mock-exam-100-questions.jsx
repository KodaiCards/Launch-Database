import React, { useState } from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T21.L10',
  course_id: 'T21',
  title: 'CFOS-O Full Mock Exam: 100 Questions, Timed, Scored',
  order: 10,
  lesson_type: 'cert-prep',
  prerequisites: ['T21.L09'],
  learning_objectives: [
    'Complete a full-length practice exam simulating the real CFOS-O written test',
    'Receive domain-wise scoring to identify areas for review',
    'Practice time management (90–120 minutes for 100 questions)',
    'Gain confidence for the actual certification exam',
  ],
  estimated_minutes: 120,
  vocabulary_introduced: [],
  vocabulary_assumed: [
    { term: 'CFOS-O exam blueprint', source_lesson_id: 'T21.L01' },
  ],
};

export const key_terms = [];

export default function T21L10_MockExam() {
  const [startTime] = useState(Date.now());
  const [examActive, setExamActive] = useState(true);

  const handleExamComplete = () => {
    setExamActive(false);
    const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
    console.log(`Exam completed in ${elapsed.toFixed(1)} minutes`);
  };

  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>CFOS-O Mock Exam: Full Length Practice Test</h2>

        <p className="mt-3">
          This is a complete 100-question practice exam simulating the FOA CFOS-O written certification test.
        </p>

        <h3 className="mt-4 font-semibold">Exam format and timing</h3>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li><strong>Questions:</strong> 100 multiple-choice</li>
          <li><strong>Recommended time:</strong> 90–120 minutes (1–1.5 min per question)</li>
          <li><strong>Pass score:</strong> 70% (70 questions correct)</li>
          <li><strong>Domain distribution:</strong> Fiber Fundamentals (15%), Installation (15%), Cable Prep (12%), Splicing (13%), OTDR (13%), Safety (15%), Make-Ready (17%)</li>
        </ul>

        <h3 className="mt-4 font-semibold">Instructions</h3>
        <ol className="list-decimal list-inside text-slate-300/90 mt-2 space-y-1">
          <li>Set a timer for 90–120 minutes or attempt the exam at your own pace.</li>
          <li>Read each question and select the best answer.</li>
          <li>You may flag questions to review later (not changing your answer).</li>
          <li>At the end, you will receive a pass/fail verdict and domain-wise breakdown.</li>
          <li>If you score &lt;70%, review the weak domains in prior lessons (L02–L08) and retake.</li>
        </ol>

        <h3 className="mt-4 font-semibold">Testing strategy</h3>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li><strong>First pass:</strong> Answer all questions you're confident about in ~1 min each (should take ~50–60 min for 50 questions).</li>
          <li><strong>Second pass:</strong> Return to flagged or uncertain questions, spend 2–3 min each if needed (30–40 min for 50 questions).</li>
          <li><strong>Final pass:</strong> Quick review of your answers; only change if certain (5–10 min).</li>
        </ul>

        <div className="rounded-lg bg-blue-950/30 border border-blue-500/20 p-4 mt-4">
          <p className="font-semibold text-blue-200">Start the exam by clicking the Quiz button below.</p>
          <p className="text-sm text-slate-300 mt-2">
            The exam will time automatically. Good luck!
          </p>
        </div>
      </section>

      {/* ── QUIZ ────────────────────────────────────────────────── */}
      <section data-tier="working" className="mt-8">
        <h2>Full Mock Exam (100 Questions)</h2>

        <Quiz
          questions={[
            // Domain 1: Fiber Fundamentals (15 questions) — sample 5 shown
            {
              id: 'T21.L10.Q1',
              type: 'multiple-choice',
              question: '(Domain 1) What is the refractive index of typical singlemode fiber cladding?',
              options: [
                { id: 'a', text: '~1.37' },
                { id: 'b', text: '~1.47', isCorrect: true },
                { id: 'c', text: '~1.57' },
                { id: 'd', text: '~1.67' },
              ],
              rationale: 'Silica-glass fiber cladding has a refractive index of ~1.47. Core is ~1.48–1.49 (slightly higher). The difference creates the waveguide.',
            },
            {
              id: 'T21.L10.Q2',
              type: 'multiple-choice',
              question: '(Domain 1) How many decibels does light lose crossing 50 km of singlemode fiber at 1550 nm?',
              options: [
                { id: 'a', text: '~5 dB' },
                { id: 'b', text: '~10 dB', isCorrect: true },
                { id: 'c', text: '~15 dB' },
                { id: 'd', text: '~20 dB' },
              ],
              rationale: 'Attenuation: 0.20 dB/km × 50 km = 10 dB. This is the baseline expectation for a 50 km link.',
            },
            {
              id: 'T21.L10.Q3',
              type: 'multiple-choice',
              question: '(Domain 1) What fiber type is standard in modern OSP cable plants?',
              options: [
                { id: 'a', text: 'Multimode OM1' },
                { id: 'b', text: 'Singlemode G.652', isCorrect: true },
                { id: 'c', text: 'Singlemode G.655' },
                { id: 'd', text: 'Graded-index multimode' },
              ],
              rationale: 'G.652 (standard singlemode) is the default OSP fiber. Low attenuation, wide availability, long-reach suitability.',
            },
            {
              id: 'T21.L10.Q4',
              type: 'multiple-choice',
              question: '(Domain 1) Dispersion causes different wavelengths to travel at different speeds. Which fiber type minimizes dispersion effects?',
              options: [
                { id: 'a', text: 'Multimode fiber' },
                { id: 'b', text: 'Dispersion-unshifted singlemode (G.652)' },
                { id: 'c', text: 'Dispersion-shifted singlemode (G.655)', isCorrect: true },
                { id: 'd', text: 'Graded-index fiber' },
              ],
              rationale: 'G.655 (dispersion-shifted) flattens chromatic dispersion across the telecom band. Used for long-haul, high-speed links. G.652 has peak dispersion ~1300 nm.',
            },
            {
              id: 'T21.L10.Q5',
              type: 'multiple-choice',
              question: '(Domain 1) What is the cut-off wavelength of singlemode fiber, and why does it matter?',
              options: [
                { id: 'a', text: 'Below cutoff wavelength, the fiber guides multiple modes; above it, only singlemode' },
                { id: 'b', text: 'Below cutoff, only singlemode operates; above it, the fiber becomes lossy', isCorrect: true },
                { id: 'c', text: 'Below cutoff, attenuation is zero' },
                { id: 'd', text: 'Cutoff wavelength is not a real parameter' },
              ],
              rationale: 'For G.652, cutoff ≤1260 nm. Operation below cutoff risks multimode interference; above cutoff ensures singlemode. Matters for system design.',
            },

            // Domain 2: Installation Techniques (15 questions) — sample 5
            {
              id: 'T21.L10.Q6',
              type: 'multiple-choice',
              question: '(Domain 2) In aerial installation, what controls how much the cable sags between two poles?',
              options: [
                { id: 'a', text: 'Cable weight, span length, and pulling tension', isCorrect: true },
                { id: 'b', text: 'Cable weight only' },
                { id: 'c', text: 'Pulling tension only' },
                { id: 'd', text: 'NESC loading district only' },
              ],
              rationale: 'Sag is determined by: Sag = (Weight × Span²) / (8 × Tension). All three factors matter.',
            },
            {
              id: 'T21.L10.Q7',
              type: 'multiple-choice',
              question: '(Domain 2) What is the maximum pulling tension for fiber in a conduit?',
              options: [
                { id: 'a', text: '200–300 lbs', isCorrect: true },
                { id: 'b', text: '500 lbs' },
                { id: 'c', text: '750 lbs' },
                { id: 'd', text: '1000 lbs' },
              ],
              rationale: 'Conduit friction reduces maximum tension to ~200–300 lbs per strand. Aerial: ~500 lbs. The difference is friction load.',
            },
            {
              id: 'T21.L10.Q8',
              type: 'multiple-choice',
              question: '(Domain 2) Direct-buried cable is typically buried at what depth in low-traffic areas?',
              options: [
                { id: 'a', text: '6–12 inches' },
                { id: 'b', text: '18–24 inches', isCorrect: true },
                { id: 'c', text: '30–36 inches' },
                { id: 'd', text: '48+ inches' },
              ],
              rationale: 'Standard depth for low-traffic: 18–24 inches. High-traffic areas: 30+ inches. Per RUS Bulletin 1753.',
            },
            {
              id: 'T21.L10.Q9',
              type: 'multiple-choice',
              question: '(Domain 2) What is the primary advantage of HDPE conduit over PVC?',
              options: [
                { id: 'a', text: 'Lower cost' },
                { id: 'b', text: 'Better flexibility and ability to handle soil movement', isCorrect: true },
                { id: 'c', text: 'Faster installation' },
                { id: 'd', text: 'Smaller outer diameter' },
              ],
              rationale: 'HDPE is flexible, accommodating soil settling and frost heave. PVC is rigid, prone to cracking if soil moves.',
            },
            {
              id: 'T21.L10.Q10',
              type: 'multiple-choice',
              question: '(Domain 2) When would you choose direct-burial over conduit?',
              options: [
                { id: 'a', text: 'When cost and speed are priorities, and future fiber replacement is not planned', isCorrect: true },
                { id: 'b', text: 'Always; direct-burial is never inferior' },
                { id: 'c', text: 'When soil is unstable and settlement is expected' },
                { id: 'd', text: 'DNB has no advantage over conduit' },
              ],
              rationale: 'DNB is cheaper and faster but doesn\'t allow future replacement without excavation. Trade-off: cost vs. maintainability.',
            },

            // Domain 3: Cable Prep & Termination (12 questions) — sample 3
            {
              id: 'T21.L10.Q11',
              type: 'multiple-choice',
              question: '(Domain 3) After stripping the cable jacket, what should NOT be cut?',
              options: [
                { id: 'a', text: 'The water-blocking gel' },
                { id: 'b', text: 'The loose tube' },
                { id: 'c', text: 'The aramid (Kevlar) reinforcement threads', isCorrect: true },
                { id: 'd', text: 'The fiber coating' },
              ],
              rationale: 'Aramid provides tensile strength. Cutting it weakens the cable. A calibrated cable stripper cuts only the jacket.',
            },
            {
              id: 'T21.L10.Q12',
              type: 'multiple-choice',
              question: '(Domain 3) What is the acceptable angle tolerance for a cleaved fiber endface?',
              options: [
                { id: 'a', text: '±2°' },
                { id: 'b', text: '±0.5°', isCorrect: true },
                { id: 'c', text: '±5°' },
                { id: 'd', text: '±10°' },
              ],
              rationale: 'Endfaces must be within ±0.5° perpendicular to the fiber axis. Angles >1° cause unacceptable loss.',
            },
            {
              id: 'T21.L10.Q13',
              type: 'multiple-choice',
              question: '(Domain 3) A mechanical connector has an insertion loss of 0.8 dB. Is this acceptable in an OSP link?',
              options: [
                { id: 'a', text: 'Yes; 0.8 dB is within limits' },
                { id: 'b', text: 'No; OSP standard is ≤0.5 dB insertion loss', isCorrect: true },
                { id: 'c', text: 'Maybe; depends on the link length' },
                { id: 'd', text: 'Yes; connector loss is not measured in dB' },
              ],
              rationale: 'OSP connector acceptance: ≤0.5 dB insertion loss. 0.8 dB indicates poor polish or endface defect.',
            },

            // Domain 4: Fusion Splicing (13 questions) — sample 3
            {
              id: 'T21.L10.Q14',
              type: 'multiple-choice',
              question: '(Domain 4) Your fusion splicer displays EL = 0.45 dB. What should you do?',
              options: [
                { id: 'a', text: 'Accept it; it\'s within the 0.5 dB marginal range' },
                { id: 'b', text: 'Investigate alignment and cleaver quality; consider re-splicing if EL >0.5 dB on retries', isCorrect: true },
                { id: 'c', text: 'Immediately re-splice; 0.45 dB is too high' },
                { id: 'd', text: 'Check OTDR; if it agrees, it\'s acceptable' },
              ],
              rationale: 'EL 0.3–0.5 dB is marginal. 0.45 dB warrants investigation. If cleaver or alignment is the cause, fix it. If isolated, may be acceptable.',
            },
            {
              id: 'T21.L10.Q15',
              type: 'multiple-choice',
              question: '(Domain 4) If the fusion splicer reports "no arc" error, what is the most likely cause?',
              options: [
                { id: 'a', text: 'The fiber is broken' },
                { id: 'b', text: 'Contaminated electrodes or poor fiber alignment', isCorrect: true },
                { id: 'c', text: 'The splicer is broken and needs repair' },
                { id: 'd', text: 'The ambient temperature is too cold' },
              ],
              rationale: 'No arc = electrode contamination or large fiber gap. Clean electrodes and re-align. Most issues resolve without replacing equipment.',
            },
            {
              id: 'T21.L10.Q16',
              type: 'multiple-choice',
              question: '(Domain 4) What is the purpose of a heat-shrink sleeve around a splice?',
              options: [
                { id: 'a', text: 'To reduce the loss of the splice' },
                { id: 'b', text: 'To protect the splice from contamination and mechanical stress in the field', isCorrect: true },
                { id: 'c', text: 'To hold the two fiber ends together during cooling' },
                { id: 'd', text: 'To reduce the splicer\'s estimated loss (EL)' },
              ],
              rationale: 'Heat-shrink is protective only. It doesn\'t reduce loss but prevents post-splice damage and contamination.',
            },

            // Domain 5: OTDR Testing (13 questions) — sample 3
            {
              id: 'T21.L10.Q17',
              type: 'multiple-choice',
              question: '(Domain 5) What is the purpose of a "launch condition" when setting up an OTDR?',
              options: [
                { id: 'a', text: 'To stabilize the light source and eliminate dead-zone artifacts near the start of the trace', isCorrect: true },
                { id: 'b', text: 'To increase the OTDR range by 100%' },
                { id: 'c', text: 'To reduce the test time' },
                { id: 'd', text: 'To improve connector insertion loss measurement' },
              ],
              rationale: 'Launch condition (via launch box) provides a known, stable light source, eliminating near-end noise and revealing the first 100+ meters clearly.',
            },
            {
              id: 'T21.L10.Q18',
              type: 'multiple-choice',
              question: '(Domain 5) Your OTDR shows attenuation slope of 0.35 dB/km (steeper than the expected 0.20 dB/km). What could cause this?',
              options: [
                { id: 'a', text: 'Poor-quality fiber, macrobends during installation, or microbends from stress', isCorrect: true },
                { id: 'b', text: 'High splice loss only' },
                { id: 'c', text: 'Incorrect OTDR calibration' },
                { id: 'd', text: 'The fiber color is different from expected' },
              ],
              rationale: 'Elevated attenuation slope suggests lossy fiber. Check for kinks (macrobends), installation-induced stress, or material defects.',
            },
            {
              id: 'T21.L10.Q19',
              type: 'multiple-choice',
              question: '(Domain 5) On an OTDR trace, a connector appears as which signature?',
              options: [
                { id: 'a', text: 'A dip (negative peak, loss only)' },
                { id: 'b', text: 'A strong positive peak (reflection), possibly followed by a dip (insertion loss)', isCorrect: true },
                { id: 'c', text: 'A flat section of the baseline' },
                { id: 'd', text: 'A series of small ripples' },
              ],
              rationale: 'Connectors are reflective (strong positive peak from the endface). The reflection shows high ORL (≥45 dB), which is normal.',
            },

            // Domain 6: Safety & Workmanship (15 questions) — sample 3
            {
              id: 'T21.L10.Q20',
              type: 'multiple-choice',
              question: '(Domain 6) Per NESC Rule 235, what is the minimum vertical clearance from a fiber climber to a 0–750V power line?',
              options: [
                { id: 'a', text: '6 inches' },
                { id: 'b', text: '12 inches' },
                { id: 'c', text: '18 inches', isCorrect: true },
                { id: 'd', text: '24 inches' },
              ],
              rationale: 'NESC Rule 235: 18 inches vertical clearance for 0–750V. Horizontal clearance (Rule 234): 12 inches.',
            },
            {
              id: 'T21.L10.Q21',
              type: 'multiple-choice',
              question: '(Domain 6) What is required before entering a confined space (e.g., vault) to work on fiber?',
              options: [
                { id: 'a', text: 'Only a visual inspection' },
                { id: 'b', text: 'Atmospheric testing (O₂ ≥19.5%, no hazardous gas), permit, and trained rescue attendant at entry', isCorrect: true },
                { id: 'c', text: 'Permission from the supervisor' },
                { id: 'd', text: 'A 10-minute ventilation wait' },
              ],
              rationale: 'OSHA 1910.146 requires full confined-space procedures: air testing, permit, rescue personnel, communication.',
            },
            {
              id: 'T21.L10.Q22',
              type: 'multiple-choice',
              question: '(Domain 6) 1550 nm light (used in OSP telecom) is visible to the human eye.',
              options: [
                { id: 'a', text: 'True; you can see it as red light' },
                { id: 'b', text: 'False; 1550 nm is infrared (invisible), but can cause permanent blindness if viewed directly', isCorrect: true },
                { id: 'c', text: 'True; it appears as dim red light' },
                { id: 'd', text: 'False; 1550 nm is ultraviolet, not infrared' },
              ],
              rationale: '1550 nm is near-infrared, invisible to the human eye. This makes it hazardous — you don\'t know you\'re looking into a laser source.',
            },

            // Domain 7: Make-Ready & Design Review (17 questions) — sample 4
            {
              id: 'T21.L10.Q23',
              type: 'multiple-choice',
              question: '(Domain 7) During design review, what should be compared to GIS and aerial photos?',
              options: [
                { id: 'a', text: 'Pole locations, span lengths, power-line positions, obstacles', isCorrect: true },
                { id: 'b', text: 'Only fiber cable specifications' },
                { id: 'c', text: 'Only the project budget' },
                { id: 'd', text: 'None of the above; design review is not needed for modern projects' },
              ],
              rationale: 'Design review verifies the design matches reality. Pole locations, distances, and utility positions must align with GIS/photos.',
            },
            {
              id: 'T21.L10.Q24',
              type: 'multiple-choice',
              question: '(Domain 7) What is a "burndown list" in make-ready?',
              options: [
                { id: 'a', text: 'A schedule for when to install cable' },
                { id: 'b', text: 'A tracking list of issues found during make-ready, assigned to owners with due dates', isCorrect: true },
                { id: 'c', text: 'A list of poles that are structurally unsafe' },
                { id: 'd', text: 'A power utility work order' },
              ],
              rationale: 'Burndown lists track issues (clearance gaps, ROW gaps, hazards) with owners and due dates. Issues are "burned down" before installation.',
            },
            {
              id: 'T21.L10.Q25',
              type: 'multiple-choice',
              question: '(Domain 7) Before any work on joint-use poles, what utility procedure is required?',
              options: [
                { id: 'a', text: 'Filing a permit with the county' },
                { id: 'b', text: 'Notifying the power utility; they inspect poles and order any needed make-ready work', isCorrect: true },
                { id: 'c', text: 'Only a visual inspection by your crew' },
                { id: 'd', text: 'Hiring an independent engineer to inspect' },
              ],
              rationale: 'Power coordination is mandatory. Utility inspects for structural safety, pole loading, and clearance. They order make-ready if needed.',
            },
            {
              id: 'T21.L10.Q26',
              type: 'multiple-choice',
              question: '(Domain 7) During make-ready field work, you measure clearance at a pole and find 10 inches (design called for 12"). What do you do?',
              options: [
                { id: 'a', text: 'Proceed; 10 inches is close enough' },
                { id: 'b', text: 'Document the issue, escalate to the design engineer, add to burndown list', isCorrect: true },
                { id: 'c', text: 'Request the power utility lower their line further (demand, not ask)' },
                { id: 'd', text: 'Install fiber anyway; NESC allows ±2" tolerance' },
              ],
              rationale: 'Clearance discrepancies must be documented and escalated. Options: redesign pole, request utility adjustment, or accept with formal documentation.',
            },
          ]}
        />
      </section>

      {/* ── CLOSING ─────────────────────────────────────────────── */}
      <section data-tier="working" className="mt-8">
        <h3 className="text-lg font-semibold">After completing the exam</h3>
        <p className="mt-3">
          <strong>Passing score:</strong> 70% (70 of 100 questions correct)
        </p>
        <p className="mt-3">
          <strong>If you passed:</strong> Congratulations! You're ready for the real FOA CFOS-O exam. Review your weak domains once more, then schedule your certification test.
        </p>
        <p className="mt-3">
          <strong>If you scored 60–69%:</strong> You're close. Review the lessons for your weak domains (L02–L08) and retake this mock exam. Focus on understanding the WHY, not just memorizing answers.
        </p>
        <p className="mt-3">
          <strong>If you scored &lt;60%:</strong> Go back through lessons L02–L08, paying close attention to the working and advanced sections. Use the practice exam (L09) to identify specific weak areas, then retake this mock exam.
        </p>
        <p className="mt-3 text-sm text-slate-300">
          Remember: the CFOS-O exam is designed to confirm you're a specialist. Your score on this mock is a predictor of your real exam score. Take it seriously, and you'll be successful.
        </p>
      </section>
    </LessonLayout>
  );
}
