import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T21.L08',
  course_id: 'T21',
  title: 'Make-Ready & Design Review Checklist: Pre-Deployment Verification',
  order: 8,
  lesson_type: 'cert-prep',
  prerequisites: ['T21.L02', 'T21.L03', 'T08.L01'],
  learning_objectives: [
    'Understand the make-ready phase (power coordination, clearance verification, final pole inspection)',
    'Review a design plan against real site conditions and flag discrepancies',
    'Use a design-review checklist to catch errors before field work begins',
    'Verify cable route, splice locations, and termination points against the design',
    'Coordinate with power utilities and other stakeholders before deployment',
  ],
  estimated_minutes: 20,
  vocabulary_introduced: [
    'Make-ready (pre-deployment work)',
    'Design review (checkpoint before build)',
    'Power coordination (utility notification)',
    'Pole inspection (as-built vs. as-designed)',
    'Clearance verification (final check)',
    'Conflict resolution (design vs. site reality)',
    'Burndown (resolve issues before build)',
  ],
  vocabulary_assumed: [
    { term: 'design', source_lesson_id: 'T01.L05' },
    { term: 'pole', source_lesson_id: 'T01.L02' },
    { term: 'NESC', source_lesson_id: 'T05.L01' },
    { term: 'make-ready', source_lesson_id: 'T01.L05' },
  ],
};

export const key_terms = meta.vocabulary_introduced;

export default function T21L08_MakeReadyDesignReview() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Design and real-world don't always match. A pole in the design might be located 20 feet away in
          the field. A clearance calculation assumes one power configuration; in reality, a second power line
          was added since the design was done. The make-ready phase is when you catch these mismatches and
          fix them BEFORE you start pulling fiber. Discovering problems in the field (after you've pulled
          half the cable) is expensive and dangerous.
        </p>

        <h3 className="mt-4 font-semibold">Make-ready and design review: two sides of one coin</h3>
        <p className="mt-2">
          <strong>Design review</strong> is the checkpoint where a second engineer (not the design author) walks
          through the design and checks it against site photos, GIS data, and standards. <strong>Make-ready</strong>
          is the field work: visiting each pole, verifying it matches the design, and doing any prerequisite work
          (power adjustments, pole re-configuration) so the route is safe for cable installation.
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
              <td className="px-3 py-2 font-mono">GIS</td>
              <td className="px-3 py-2">Geographic Information System</td>
              <td className="px-3 py-2">Digital map showing poles, property lines, utilities, terrain.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">As-designed</td>
              <td className="px-3 py-2">What the design engineer drew</td>
              <td className="px-3 py-2">Cables on poles 1–100, splices at specific locations.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">As-built</td>
              <td className="px-3 py-2">What actually exists in the field</td>
              <td className="px-3 py-2">Poles may be different locations, power config different, etc.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ROW</td>
              <td className="px-3 py-2">Right-of-Way</td>
              <td className="px-3 py-2">Legal easement permitting access for installation and maintenance.</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Design Review: Checklist Approach</h2>

        <h3 className="mt-4 font-semibold">Step 1: Compare design to GIS and aerial photo</h3>
        <p className="mt-2">
          Before field work, overlay the design route on GIS and recent aerial photos. Check:
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li>Does each pole marked in the design exist in the GIS at the right location?</li>
          <li>Are the distances between poles (span lengths) correct ±5%?</li>
          <li>Are there obstacles (trees, buildings, water) the design didn't account for?</li>
          <li>Do power/comm lines shown in GIS match what the design assumes?</li>
        </ul>

        <h3 className="mt-5 font-semibold">Step 2: Verify clearance calculations</h3>
        <p className="mt-2">
          The design includes sag and tension calculations for each span. Verify:
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li>Design assumes the correct NESC loading district (Light / Heavy / Extreme)?</li>
          <li>Clearance to power lines is ≥12" (750V) at all poles, accounting for sag?</li>
          <li>If a power line configuration is different in reality (e.g., new line added), recalculate.</li>
        </ul>

        <h3 className="mt-5 font-semibold">Step 3: Check splice and termination locations</h3>
        <p className="mt-2">
          The design specifies splice locations. Verify:
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li>Splice at pole 24? Does pole 24 exist in reality?</li>
          <li>Is there physical access (vault, splice case location)?</li>
          <li>Are there obstructions preventing access for future maintenance?</li>
        </ul>

        <h3 className="mt-5 font-semibold">Step 4: Confirm ROW and easement status</h3>
        <p className="mt-2">
          Utility work requires legal right-of-way. Verify:
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li>Is the entire route covered by acquired easements or public ROW?</li>
          <li>Are there any new easements that expired or need renewal?</li>
          <li>Has the property owner changed since the design was done?</li>
        </ul>

        <h2 className="mt-8">Make-Ready Field Work</h2>

        <h3 className="mt-4 font-semibold">Field survey: walk every pole</h3>
        <p className="mt-2">
          A make-ready crew physically visits every pole on the route. They:
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li>Confirm pole location matches the GIS ±10 feet</li>
          <li>Photograph the pole and note any hazards (leaning pole, old damage, safety concerns)</li>
          <li>Inspect existing utilities (power, comms, others) for conflicts</li>
          <li>Mark lashing/strapping locations on the pole (spray paint marks)</li>
        </ul>

        <h3 className="mt-5 font-semibold">Power coordination (notify utility)</h3>
        <p className="mt-2">
          Before any work touching joint-use poles, notify the power utility. They will:
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li>Inspect the poles for structural safety</li>
          <li>Verify clearance to their power lines</li>
          <li>Order any make-ready work on their side (lower cables, adjust spacing)</li>
          <li>Issue a make-ready agreement specifying what both parties will do</li>
        </ul>
        <p className="mt-3">
          <strong>Typical utility make-ready:</strong> Power company lowers their cable to create more space
          for fiber. Cost: typically $200–$500 per pole, shared between utilities. Timeline: 2–4 weeks.
        </p>

        <h3 className="mt-5 font-semibold">Clearance verification (final check)</h3>
        <p className="mt-2">
          Once utility make-ready is done, a second site visit verifies clearances:
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li>Measure clearance to power lines at each pole with a measuring tape</li>
          <li>Verify ≥12" horizontal and ≥18" vertical (for 750V) per NESC</li>
          <li>If clearance is still inadequate, escalate to the power utility or revise the design</li>
        </ul>

        <h3 className="mt-5 font-semibold">Burndown: resolving issues</h3>
        <p className="mt-2">
          Issues found during make-ready (clearance too tight, pole unsafe, missing ROW) are tracked on a
          <strong>"burndown" list</strong>. Each issue is assigned to a responsible party and a due date.
          Issues are "burned down" (resolved) before cable installation begins.
        </p>
        <p className="mt-3">
          <strong>Example issues:</strong>
        </p>
        <ul className="list-disc list-inside text-slate-300/90 mt-2 space-y-1">
          <li>Pole 47 has insufficient clearance → Power utility orders make-ready (2 weeks)</li>
          <li>Easement for property XYZ not yet recorded → Legal department expedites (1 week)</li>
          <li>Splice case location has a tree blocking access → Arrange tree trim (3 days)</li>
        </ul>
        <p className="mt-3">
          Cable installation does NOT begin until all high-priority burndown items are resolved.
        </p>

        <h2 className="mt-8">Design Review Checklist (Practical Template)</h2>

        <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-4 mt-3 font-mono text-xs space-y-2">
          <p>PROJECT: ________________  DATE: ________ REVIEWED BY: ________</p>
          <p>─────────────────────────────────────────────────────────────</p>
          <p>☐ GIS poles match design locations ±5% (compare GIS to design drawings)</p>
          <p>☐ Span lengths verified within ±10% (measure or compare photos)</p>
          <p>☐ Power lines identified in GIS match design assumptions</p>
          <p>☐ NESC loading district confirmed correct</p>
          <p>☐ Clearance calculations verified (sag + clearance ≥12")</p>
          <p>☐ Splice locations (pole numbers) physically exist</p>
          <p>☐ Termination locations have adequate access</p>
          <p>☐ ROW/easement status confirmed (all poles covered)</p>
          <p>☐ Hazards identified (leaning poles, obstacles, etc.)</p>
          <p>☐ Make-ready coordination scheduled with power utility</p>
          <p>─────────────────────────────────────────────────────────────</p>
          <p>ISSUES FOUND (burndown list):</p>
          <p>1. __________________ [OWNER] [DUE DATE]</p>
          <p>2. __________________ [OWNER] [DUE DATE]</p>
        </div>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Advanced: Conflict Resolution</h2>

        <h3 className="mt-4 font-semibold">As-designed vs. as-built mismatches</h3>
        <p className="mt-2">
          When design and reality diverge, the design engineer must decide: (1) revise the design to fit
          reality, (2) request the power utility to alter their plant (expensive), or (3) choose an
          alternate route (time + cost). The CFOS-O technician's role is to clearly document the mismatch
          and escalate it.
        </p>

        <h3 className="mt-5 font-semibold">Practical exam scenario</h3>
        <p className="mt-2">
          <em>"During make-ready, you measure clearance at pole 52 and find 8 inches to the power line
          (design called for 12"). The power utility says their line can't be lowered further because of a
          transformer. What do you do?"</em>
        </p>
        <p className="mt-3">
          <strong>Correct answer:</strong> (1) Document the issue in the burndown list with photos. (2) Escalate
          to the design engineer. (3) Options: (a) Redesign pole 52 to avoid that span (use a different pole
          or route), (b) Request the power utility to replace the transformer with a lower-profile unit (expensive,
          they may refuse), or (c) Accept the risk if the power utility formally confirms clearance is adequate
          (documentation protects you). Do NOT proceed with installation until resolved.
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
            id: 'T21.L08.Q1',
            type: 'multiple-choice',
            question: 'What is the primary purpose of the design-review phase?',
            options: [
              { id: 'a', text: 'To approve the budget for cable installation' },
              { id: 'b', text: 'To catch discrepancies between the design and actual site conditions before field work begins', isCorrect: true },
              { id: 'c', text: 'To train field crews on the installation procedure' },
              { id: 'd', text: 'To document historical pole data' },
            ],
            rationale: 'Design review is a checkpoint to verify the design matches reality (GIS, photos, power config) and resolve any conflicts before expensive field work begins.',
          },
          {
            id: 'T21.L08.Q2',
            type: 'multiple-choice',
            question: 'During make-ready, you discover that a pole is leaning significantly and appears structurally unsafe. What should you do?',
            options: [
              { id: 'a', text: 'Proceed with installation; the pole is already there' },
              { id: 'b', text: 'Contact the power utility and document the hazard; add it to the burndown list', isCorrect: true },
              { id: 'c', text: 'Install fiber but avoid lashing near the unsafe area' },
              { id: 'd', text: 'Request the customer to replace the pole at their cost' },
            ],
            rationale: 'Unsafe poles are a safety and liability risk. The utility must inspect and repair or replace. Document in the burndown list and do not proceed until resolved.',
          },
          {
            id: 'T21.L08.Q3',
            type: 'multiple-choice',
            question: 'What should be verified during the "clearance verification" step of make-ready?',
            options: [
              { id: 'a', text: 'Only the visual appearance of the route' },
              { id: 'b', text: 'Measured clearance to power lines (≥12" horizontal, ≥18" vertical for 750V) using a measuring tape', isCorrect: true },
              { id: 'c', text: 'Only the GIS data; field measurement is unnecessary' },
              { id: 'd', text: 'The fiber cable specifications' },
            ],
            rationale: 'Clearance is verified by field measurement at each pole. Design calculations assume clearance; reality may differ. Measurement is the proof.',
          },
          {
            id: 'T21.L08.Q4',
            type: 'multiple-choice',
            question: 'What is a "burndown list" in the context of make-ready?',
            options: [
              { id: 'a', text: 'A list of poles that are structurally unsafe' },
              { id: 'b', text: 'A tracking list of issues found during make-ready, each assigned an owner and due date for resolution', isCorrect: true },
              { id: 'c', text: 'A schedule for when to install cable' },
              { id: 'd', text: 'A list of power coordination tasks the utility will complete' },
            ],
            rationale: 'Burndown lists track issues (clearance gaps, ROW gaps, hazards) with assigned owners and due dates. Issues are "burned down" (resolved) before installation.',
          },
        ]}
      />
    </LessonLayout>
  );
}

function getDefinition(term) {
  const defs = {
    'Make-ready (pre-deployment work)': 'Field work prior to cable installation: power coordination, pole verification, clearance checks, and issue resolution.',
    'Design review (checkpoint before build)': 'Second-engineer checkpoint comparing design to site reality (GIS, photos, power config) to catch discrepancies early.',
    'Power coordination (utility notification)': 'Formal notification to the power utility before work begins; utility inspects poles and orders any needed make-ready work.',
    'Pole inspection (as-built vs. as-designed)': 'Field verification that poles match design locations and specifications; document any hazards or discrepancies.',
    'Clearance verification (final check)': 'Measured verification that clearance to power lines meets NESC standards (≥12" horizontal, ≥18" vertical for 750V).',
    'Conflict resolution (design vs. site reality)': 'Process of addressing mismatches: redesign, request utility adjustment, or choose alternate route.',
    'Burndown (resolve issues before build)': 'Tracking list of issues found during make-ready, assigned to responsible parties with due dates; issues resolved before installation.',
  };
  return defs[term] || '(definition not found)';
}
