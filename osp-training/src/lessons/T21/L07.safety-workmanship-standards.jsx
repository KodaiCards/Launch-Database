import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T21.L07',
  course_id: 'T21',
  title: 'Safety & Workmanship Standards: OSHA, NESC, Field Best Practices',
  order: 7,
  lesson_type: 'cert-prep',
  prerequisites: ['T21.L02', 'T18.L01'],
  learning_objectives: [
    'Apply OSHA 1910.268 (Power Generation, Transmission, Distribution), 1910.146 (Permit-Required Confined Spaces), and 1910.147 (Lockout/Tagout)',
    'Identify hazards specific to fiber-optic OSP installation (climbing, electrical hazard awareness, UV laser, fiber handling)',
    'Understand NESC safety rules for joint-use poles and personnel clearance',
    'Execute safe work practices: PPE, tool inspection, rescue planning',
    'Recognize workmanship quality indicators in field termination and splicing',
  ],
  estimated_minutes: 26,
  vocabulary_introduced: [
    'Competent climber',
    'Rescue plan',
    'Electrical hazard awareness',
    'PPE (Personal Protective Equipment)',
    'Tool inspection and maintenance',
    'Fiber safety (eye hazard awareness)',
    'Qualified person (OSHA definition)',
  ],
  vocabulary_assumed: [
    { term: 'OSHA', source_lesson_id: 'T18.L01' },
    { term: 'NESC', source_lesson_id: 'T05.L01' },
    { term: 'PPE', source_lesson_id: 'T18.L02' },
    { term: 'pole climbing', source_lesson_id: 'T18.L03' },
  ],
};

export const key_terms = meta.vocabulary_introduced;

export default function T21L07_SafetyWorkmanship() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Safety is not a box to check. Pole climbing, electrical work, digging, and heavy equipment
          operation create real hazards. OSHA regulations and NESC rules exist because people have been
          killed or injured doing this work. For a CFOS-O technician, safety knowledge is as important
          as technical skill. The exam tests both.
        </p>

        <h3 className="mt-4 font-semibold">Why safety is built into the job</h3>
        <p className="mt-2">
          Most OSP fiber installation involves climbing poles, working near power lines, and digging.
          Each of these activities is hazardous. OSHA sets the floor. NESC adds utility-specific rules.
          Your company's safety plan sits on top of both. Understanding all three layers keeps you and
          your crew alive.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Term</th>
              <th className="px-3 py-2 text-left">Meaning</th>
              <th className="px-3 py-2 text-left">In the field</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OSHA</td>
              <td className="px-3 py-2">Occupational Safety and Health Admin.</td>
              <td className="px-3 py-2">Federal agency setting workplace safety regs; enforces through inspections, fines.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NESC</td>
              <td className="px-3 py-2">National Electrical Safety Code</td>
              <td className="px-3 py-2">Utility-specific rules; covers clearance, grounding, rescue, personnel.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">JSA</td>
              <td className="px-3 py-2">Job Safety Analysis</td>
              <td className="px-3 py-2">Pre-work hazard checklist; team reviews before starting each job.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">LOTO</td>
              <td className="px-3 py-2">Lockout/Tagout</td>
              <td className="px-3 py-2">Procedure to de-energize equipment and prevent accidental restart during maintenance.</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>OSHA Regulations for OSP Work</h2>

        <h3 className="mt-4 font-semibold">OSHA 1910.268: Power Generation, Transmission, Distribution</h3>
        <p className="mt-2">
          This is the core OSHA rule for pole climbers and fiber workers. Key sections:
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li><strong>1910.268(b) — Training:</strong> Workers must be trained on hazards, procedures, and rescue.</li>
          <li><strong>1910.268(c) — Unqualified persons:</strong> Only qualified, trained persons may climb poles or work near energized lines.</li>
          <li><strong>1910.268(g) — Rescue plans:</strong> Before any work, a rescue plan must exist (ladder nearby, trained rescuer available).</li>
          <li><strong>1910.268(n) — Live-work procedures:</strong> Work on energized conductors requires specific permits and PPE.</li>
        </ul>

        <h3 className="mt-5 font-semibold">OSHA 1910.146: Permit-Required Confined Spaces</h3>
        <p className="mt-2">
          Fiber work sometimes involves vaults or splicing enclosures underground. If the space is
          confined and hazardous, entry requires a permit, atmospheric testing, and trained rescue personnel.
        </p>
        <p className="mt-3">
          <strong>Confined space definition:</strong> Large enough to enter, limited entry/exit, not designed for occupancy, and hazardous (lacks oxygen, has gas, etc.).
        </p>
        <p className="mt-3">
          <strong>Permit requirement:</strong> Before entering, atmosphere must be tested (oxygen ≥19.5%, no combustible gas, no H₂S). A trained attendant waits outside with rescue equipment.
        </p>

        <h3 className="mt-5 font-semibold">OSHA 1910.147: Lockout/Tagout</h3>
        <p className="mt-2">
          If your fiber work requires de-energizing power equipment, the equipment must be locked out (electrical breaker locked in OFF position) and tagged (warning tag explaining why). Only the person who locked it can unlock it.
        </p>
        <p className="mt-3">
          <strong>Scenario:</strong> You need to splice fiber inside a pedestal with live power equipment nearby. Power is isolated with a breaker, locked, and tagged. You splice safely knowing the breaker can't be turned back on without breaking the lock.
        </p>

        <h2 className="mt-8">NESC Rules for Fiber Workers</h2>

        <h3 className="mt-4 font-semibold">Clearance to energized lines (NESC Rule 234–235)</h3>
        <p className="mt-2">
          When working near power lines, NESC specifies <strong>minimum distances</strong> to avoid electrocution:
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li><strong>0–750V circuit:</strong> 12 inches horizontal, 18 inches vertical clearance from worker body and tools</li>
          <li><strong>751–15 kV:</strong> 3 feet clearance</li>
          <li><strong>Above 15 kV:</strong> 10 feet clearance (no fiber work allowed without special high-voltage procedures)</li>
        </ul>
        <p className="mt-3">
          <strong>Practical application:</strong> Before climbing a pole with fiber, measure clearance to the nearest power line. If you need to climb higher than the clearance allows, work must stop and power must be de-energized (by the power utility).
        </p>

        <h3 className="mt-5 font-semibold">Rescue procedures (NESC Rule 48C)</h3>
        <p className="mt-2">
          For any work on poles or above ground, a rescue plan must be documented:
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li>A trained rescue person must be present on site</li>
          <li>A ladder or lift must be available for immediate access to the worker</li>
          <li>Communication (radio, phone) must be active between worker and rescue person</li>
          <li>If a worker falls or becomes injured, rescue must be able to reach and lower them in &lt;5 min</li>
        </ul>

        <h2 className="mt-8">Field Safety Practices</h2>

        <h3 className="mt-4 font-semibold">Competent climber requirements</h3>
        <p className="mt-2">
          A competent climber is someone trained and capable of recognizing hazards and taking corrective action. Per OSHA and NESC:
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li>Must pass a pole-climbing course (mechanics, footlock, equipment use)</li>
          <li>Must pass a written test on hazards and procedures</li>
          <li>Must recertify annually (some companies require 2–3 years)</li>
          <li>Must wear appropriate PPE: hard hat, climbing belt with lanyard, spikes or climbers, gloves</li>
        </ul>

        <h3 className="mt-5 font-semibold">Tool inspection and safety</h3>
        <p className="mt-2">
          Before using any tool, inspect it:
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li><strong>Fusion splicer:</strong> Check battery, electrodes clean, alignment laser functional</li>
          <li><strong>Cleaver:</strong> Blade sharp, cutting edge straight (test on scrap fiber)</li>
          <li><strong>OTDR:</strong> Battery charged, connectors clean, laser warning label visible</li>
          <li><strong>Climbing equipment:</strong> Harness not frayed, lanyard intact, carabiners locking properly</li>
        </ul>

        <h3 className="mt-5 font-semibold">Fiber eye hazard awareness</h3>
        <p className="mt-2">
          Fiber-optic lasers and light sources can damage the eye. A 1550 nm laser signal cannot be seen
          by the naked eye (invisible near-infrared), so you might shine it directly into your eye without
          knowing. Exposure can cause permanent blindness.
        </p>
        <p className="mt-3">
          <strong>Safe practice:</strong>
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li>Never look directly into a fiber end without protective eyewear (laser safety glasses rated for your wavelength)</li>
          <li>Treat all fiber ends as potentially live light sources</li>
          <li>Use mechanical checks (power meter, OTDR) instead of visual inspection to verify light presence</li>
        </ul>

        <h3 className="mt-5 font-semibold">Workmanship quality checks</h3>
        <p className="mt-2">
          Beyond safety, OSP work has quality standards. A well-trained technician consistently produces:
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li><strong>Splices:</strong> Low loss (&lt;0.2 dB), clean heat-shrink, protective enclosure</li>
          <li><strong>Cable runs:</strong> Neat lashing/strapping, no sharp bends, proper spacing on poles</li>
          <li><strong>Terminations:</strong> Clean connector polish, no scratches or pits, proper strain relief</li>
          <li><strong>Documentation:</strong> Accurate fiber records, OTDR traces captured, test results logged</li>
        </ul>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Advanced: Safety Culture and Risk Assessment</h2>

        <h3 className="mt-4 font-semibold">Job Safety Analysis (JSA)</h3>
        <p className="mt-2">
          Before each job, a team walks through a JSA: list every hazard, identify how to mitigate it, and
          assign responsibility. Example JSA for a 5 km aerial fiber deployment:
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li><strong>Hazard:</strong> Climber falls from pole. <strong>Control:</strong> Full harness + lanyard + rescue ladder on site</li>
          <li><strong>Hazard:</strong> Contact with power line. <strong>Control:</strong> 12" clearance verified before work; power marked with flags</li>
          <li><strong>Hazard:</strong> Tool dropped from height. <strong>Control:</strong> Tools tethered; nobody below during climbing</li>
          <li><strong>Hazard:</strong> Splicer arc flash. <strong>Control:</strong> Face shield during splicing; adequate ventilation</li>
        </ul>

        <h3 className="mt-5 font-semibold">Practical exam scenario</h3>
        <p className="mt-2">
          <em>"You're preparing to splice fiber in a vault 6 feet below grade. The vault has no lighting, and
          the air smells stale. What must happen before you enter?"</em>
        </p>
        <p className="mt-3">
          <strong>Correct answer:</strong> Confined space procedures: (1) Atmosphere tested — oxygen ≥19.5%, no combustible gas, no H₂S. (2) Results documented in a permit. (3) Trained rescue attendant posted at the opening with breathing apparatus available. (4) You enter only after permit is signed off. Failing to follow this can result in both injury and federal OSHA citations ($15K+ fines).
        </p>
      </section>

      {/* ── FLASHCARDS ──────────────────────────────────────────────── */}
      <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
        <h3 className="text-sm font-semibold text-slate-200">Key terms</h3>
        {key_terms.map((term, idx) => (
          <Flashcard key={idx} term={term} definition={getDefinition(term)} />
        ))}
      </div>

      {/* ── QUIZ ────────────────────────────────────────────────── */}
      <Quiz
        questions={[
          {
            id: 'T21.L07.Q1',
            type: 'mc',
            prompt: 'Per NESC Rule 234, what is the minimum horizontal clearance from a fiber climber\'s body/tools to a 0–750V power line on a joint-use pole?',
            options: [
              { id: 'a', text: '6 inches' },
              { id: 'b', text: '12 inches', isCorrect: true },
              { id: 'c', text: '18 inches' },
              { id: 'd', text: '24 inches' },
            ],
            rationale: 'NESC Rule 234 specifies 12 inches horizontal clearance for 0–750V circuits. This prevents accidental electrocution during climbing.',
          },
          {
            id: 'T21.L07.Q2',
            type: 'mc',
            question: 'What is required before a worker enters a confined space (vault) to perform fiber splicing?',
            options: [
              { id: 'a', text: 'Visual inspection for hazards is sufficient' },
              { id: 'b', text: 'Atmosphere testing (oxygen ≥19.5%, no gas hazards), permit documentation, rescue attendant at entry', isCorrect: true },
              { id: 'c', text: 'Permission from the supervisor only' },
              { id: 'd', text: 'A 5-minute waiting period for air circulation' },
            ],
            rationale: 'OSHA 1910.146 requires full confined-space procedures: atmospheric testing, permit documentation, and a trained rescue person present.',
          },
          {
            id: 'T21.L07.Q3',
            type: 'mc',
            question: 'When looking into a fiber end to check for light, what precaution must be taken for 1550 nm light (invisible to the eye)?',
            options: [
              { id: 'a', text: 'Use a simple visual inspection; infrared is harmless' },
              { id: 'b', text: 'Wear laser safety glasses rated for the wavelength; never look directly without them', isCorrect: true },
              { id: 'c', text: 'Use a protective cap; no light can escape' },
              { id: 'd', text: 'Test with an OTDR instead of looking directly' },
            ],
            rationale: '1550 nm is invisible but can cause permanent blindness. Always use wavelength-rated laser safety glasses when handling live fiber sources.',
          },
          {
            id: 'T21.L07.Q4',
            type: 'mc',
            question: 'Per OSHA 1910.268, what must be documented before pole climbing work begins?',
            options: [
              { id: 'a', text: 'A weather forecast' },
              { id: 'b', text: 'A rescue plan (trained rescuer, ladder/lift available, communication method, &lt;5 min rescue time)', isCorrect: true },
              { id: 'c', text: 'An insurance waiver' },
              { id: 'd', text: 'A GPS location of the pole' },
            ],
            rationale: 'OSHA 1910.268(g) requires a documented rescue plan: trained rescuer present, rescue equipment ready, communication active, rescue within 5 minutes.',
          },
        ]}
      />
    </LessonLayout>
  );
}

function getDefinition(term) {
  const defs = {
    'Competent climber': 'Worker trained and certified in pole climbing, hazard recognition, and rescue procedures; meets OSHA/NESC requirements.',
    'Rescue plan': 'Documented procedure for immediate rescue of an injured climber; includes trained rescuer, equipment, communication, and sub-5-minute response time.',
    'Electrical hazard awareness': 'Training in identifying electrical hazards, clearance distances, de-energization procedures, and when to stop work.',
    'PPE (Personal Protective Equipment)': 'Protective gear: hard hat, climbing harness, lanyard, spikes, gloves, eye protection; worn on every climbing/hazardous job.',
    'Tool inspection and maintenance': 'Pre-job check of cleaver, splicer, OTDR, climbing equipment for functionality and safety; worn or damaged tools are replaced.',
    'Fiber safety (eye hazard awareness)': 'Protection against laser light exposure at telecom wavelengths (1550 nm invisible); requires safety glasses and never looking directly into live fiber.',
    'Qualified person (OSHA definition)': 'Worker trained and competent to recognize hazards, trained on procedures, certified annually; meets OSHA 1910.268 qualifications.',
  };
  return defs[term] || '(definition not found)';
}
