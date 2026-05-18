// T22 CFOT Lesson 6 — Safety & OSHA Compliance
// Field technician focus: PPE, electrical hazards, confined space

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T22.L06',
  course_id: 'T22',
  title: 'Safety, OSHA, and Workmanship Standards',
  order: 6,
  lesson_type: 'working',
  prerequisites: ['T18.L01', 'T18.L02', 'T18.L07'],
  vocabulary_introduced: [
    'OSHA 1910.147 (Lockout-Tagout)',
    'OSHA 1910.1200 (GHS)',
    'confined space',
    'fall protection',
    'incident report',
    'competent person',
  ],
  vocabulary_assumed: [
    { term: 'electrical hazard', source_lesson_id: 'T18.L01' },
    { term: 'safety glasses', source_lesson_id: 'T18.L02' },
    { term: 'OSHA', source_lesson_id: 'T18.L01' },
  ],
  estimated_minutes: 24,
  learning_objectives: [
    'Select appropriate PPE for fiber-splicing and installation environments',
    'Understand OSHA lockout-tagout (LOTO) procedures for electrical equipment',
    'Recognize confined space hazards and when a competent person is required',
    'Document incidents and near-misses per OSHA requirements',
    'Apply workmanship standards (NEC, TIA, RUS) to fiber network installations',
  ],
};

export const key_terms = meta.vocabulary_introduced;

export default function T22L06_SafetyOSHA() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Safety is the FIRST rule in telecommunications construction. Fiber itself is not
          electrically conductive, but the environments where you work (near power lines, in
          manholes, on utility poles) are hazardous. OSHA regulations (29 CFR Part 1926 for
          construction) set the minimum standards. Your employer may require stricter rules.
          When in doubt, ask your supervisor.
        </p>

        <h3 className="mt-4 font-semibold">Core Safety Rules for CFOT</h3>
        <ol className="space-y-2 text-sm text-slate-300/90 list-decimal pl-5">
          <li><strong>Always wear safety glasses with side shields</strong> when handling fiber, splicing, or using power tools.</li>
          <li><strong>Avoid stray electrical voltage.</strong> Before working on any line, call 811 for location marks. Verify the line is de-energized with a voltage tester.</li>
          <li><strong>Use fall protection above 6 feet.</strong> Harness, lanyards, and anchor points per OSHA 1926.500.</li>
          <li><strong>Never work alone in a confined space.</strong> A confined space (manhole, vault, conduit run) requires a competent person and a rescue plan per OSHA 1910.146.</li>
          <li><strong>Lockout-Tagout (LOTO) for live equipment.</strong> If you are working near or on electrical equipment (splitter, amplifier, power supply), that equipment must be de-energized and locked per OSHA 1910.147.</li>
          <li><strong>Incident reporting.</strong> Any injury, near-miss, or property damage is reported and documented per OSHA record-keeping (1904).</li>
        </ol>

        <h3 className="mt-5 font-semibold">PPE (Personal Protective Equipment) for Fiber Work</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-3">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">PPE item</th>
              <th className="px-3 py-2 text-left">Purpose</th>
              <th className="px-3 py-2 text-left">When required</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-xs">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Safety glasses (side shields)</td>
              <td className="px-3 py-2">Protect eyes from fiber shards, polishing dust, cleaver slips</td>
              <td className="px-3 py-2">Always, when splicing, cleaving, or polishing</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Hard hat</td>
              <td className="px-3 py-2">Protect head from falling objects, line impacts</td>
              <td className="px-3 py-2">On poles, under power lines, in construction zones</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Gloves (nitrile or leather)</td>
              <td className="px-3 py-2">Protect hands from cuts, splinters, chemical exposure</td>
              <td className="px-3 py-2">When handling raw cable or in rough environments</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Safety vest / high-visibility</td>
              <td className="px-3 py-2">Make you visible to vehicles and equipment operators</td>
              <td className="px-3 py-2">In traffic zones, near roadways, job sites</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Fall protection harness + lanyard</td>
              <td className="px-3 py-2">Prevent falls &gt; 6 feet</td>
              <td className="px-3 py-2">Pole climbing, elevated work, as required per job plan</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Respirator (N95 or P100)</td>
              <td className="px-3 py-2">Protect lungs from polishing dust, conduit debris</td>
              <td className="px-3 py-2">When grinding or blowing dust in enclosed spaces</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-3 p-3 border border-amber-400/30 bg-amber-400/5 rounded-lg">
          <p className="font-semibold text-amber-300 text-sm">Book vs. Field</p>
          <p className="text-slate-300/90 text-sm">
            <strong>Book:</strong> OSHA requires PPE in specific situations.
            <strong>Field:</strong> Many crews skip safety glasses or hard hats on "quick jobs."
            The minute you stop following the rules is the minute you get hurt. Take the extra
            10 seconds to put on safety glasses. It's not negotiable.
          </p>
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Electrical Hazards and Lockout-Tagout (LOTO)</h2>

        <h3 className="font-semibold">Stray Voltage and Bonding</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          Even though fiber is non-conductive, the equipment it connects to (splitters, amplifiers,
          power supplies at a headend or hut) is often powered by –48VDC or AC mains. Before opening
          such equipment or working nearby:
        </p>
        <ol className="space-y-1 text-sm text-slate-300/90 list-decimal pl-5">
          <li>Verify the equipment is de-energized using a voltage tester</li>
          <li>Lock the power switch in the OFF position with a padlock (your lock)</li>
          <li>Tag the lock with your name, date, and work scope</li>
          <li>Only you can remove your lock when work is complete</li>
        </ol>

        <h3 className="mt-3 font-semibold">Grounding and Bonding</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          Metal frames, cable armor, and power supply grounds must be bonded to a common grounding
          electrode to prevent voltage differences that cause shocks. This is covered in detail in T14
          (Bonding & Grounding). For CFOT, remember: <strong>never disconnect a ground wire</strong>
          to make room for your work. If a ground wire is in the way, ask your supervisor or the
          electrical contractor.
        </p>

        <h3 className="mt-3 font-semibold">Confined Space Entry (OSHA 1910.146)</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          A confined space is any area with limited entry/exit, potentially hazardous atmosphere,
          or internal configuration that traps entrants. Typical examples:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300/90">
          <li>Buried cable vaults and handholes</li>
          <li>Utility conduit runs (&gt; 6 inches in diameter, &gt; 30 feet long)</li>
          <li>Pump stations or tanks with sump areas</li>
          <li>Underground cable splicing chambers</li>
        </ul>
        <p className="text-sm text-slate-300/90 mt-2">
          <strong>Required before entry:</strong> Atmospheric testing (oxygen level, explosive gases,
          toxic gases), a competent person stationed outside, and an entry permit signed by a supervisor.
          Never work alone in a confined space.
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Workmanship Standards (NEC, TIA, RUS)</h2>
        <p>
          Beyond OSHA safety, telecommunications installations must meet industry standards for workmanship:
        </p>
        <ul className="space-y-2 text-sm text-slate-300/90 list-disc pl-5">
          <li><strong>NEC (National Electrical Code)</strong> Chapter 8 covers communications equipment. Grounding, bonding, and equipment installations must comply.</li>
          <li><strong>TIA-568 (Cabling standards)</strong> defines cable routes, termination practices, and cable dressing conventions.</li>
          <li><strong>RUS Bulletins</strong> (especially 1751F-630 for OSP) define acceptable splicing practices, cable support, and overall plant quality.</li>
        </ul>
        <p className="text-sm text-slate-300/90 mt-3">
          All three require: clean work environments, labeled cables, organized slack,
          proper cable support (no sagging), and complete documentation. Shortcuts in workmanship
          today become callbacks tomorrow.
        </p>

        <h3 className="mt-3 font-semibold">Incident Documentation (OSHA 1904)</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          Any work-related injury, illness, or near-miss must be logged on OSHA Form 301.
          Your employer maintains these records for 5 years. Examples of recordable incidents:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300/90">
          <li>Fiber splinter in the eye → treated at clinic</li>
          <li>Cut from a cleaver → more than first aid</li>
          <li>Fall from a ladder → even if unhurt, still recordable</li>
          <li>Near-miss with a vehicle → reported to supervisor</li>
        </ul>
      </section>

      {/* ── FLASHCARDS ──────────────────────────────────────────────────── */}
      <Flashcard
        deckId="T22-L06"
        cards={[
          { id: 'T22-L06-FC-1', front: 'PPE (Personal Protective Equipment)', back: 'Safety gear that protects against hazards: safety glasses, hard hat, gloves, harness, respirator, etc. Required based on the work environment.' },
          { id: 'T22-L06-FC-2', front: 'OSHA 1910.147 (Lockout-Tagout)', back: 'Regulation requiring that electrical equipment be de-energized and locked before servicing. The worker locks the power switch and tags it with their name and date.' },
          { id: 'T22-L06-FC-3', front: 'OSHA 1910.1200 (GHS)', back: 'Global Harmonized System for hazard communication. Requires chemical labels, safety data sheets (SDS), and training on hazardous substances (solvents, lubricants, adhesives).' },
          { id: 'T22-L06-FC-4', front: 'Confined space', back: 'Any enclosed area with limited entry/exit and potential hazards (e.g., utility vault, underground conduit run, sump). Requires atmospheric testing and a competent person for safe entry.' },
          { id: 'T22-L06-FC-5', front: 'Grounding', back: 'Connecting conductive equipment to the earth or to a ground bus to prevent voltage buildup and shock hazards. Required by NEC and OSHA.' },
          { id: 'T22-L06-FC-6', front: 'Fall protection', back: 'Equipment and procedures to prevent falls > 6 feet. Includes harness, lanyard, and anchor points per OSHA 1926.500.' },
          { id: 'T22-L06-FC-7', front: 'Incident report', back: 'Documentation of any work-related injury, illness, or near-miss. Filed on OSHA Form 301 and kept for 5 years per OSHA 1904.' },
          { id: 'T22-L06-FC-8', front: 'Competent person', back: 'A trained individual designated to oversee safe work practices, especially in confined spaces or high-risk environments.' },
          { id: 'T22-L06-FC-9', front: 'Stray voltage', back: 'Unintended electrical potential present on conductive surfaces due to grounding faults. Can cause shock hazards even without direct contact to a power source.' },
          { id: 'T22-L06-FC-10', front: 'Workmanship standard', back: 'Industry requirement for quality of installation (NEC, TIA, RUS). Includes cable dressing, labeling, slack management, and splicing practices.' },
        ]}
      />

      {/* ── QUIZ ────────────────────────────────────────────────────────── */}
      <Quiz
        title="T22.L06 Check — Safety & OSHA"
        mode="multiple-choice"
        questions={[
          {
            id: 'T22-L06-Q1',
            type: 'mc',
            prompt:
              'You are preparing to splice fiber in a splice case at a pedestal. Is it required to wear safety glasses?',
            choices: [
              'No — fiber is non-conductive and poses no electrical hazard',
              'Yes — fiber shards and polishing dust can cause eye injury',
              'Only if you are using a cleaver',
              'Only if the job is outdoors',
            ],
            answerIndex: 1,
            explanation:
              'Fiber splinters and polishing dust are physical hazards to the eye. Safety glasses with side shields are required whenever handling fiber or using tools like cleavers.',
          },
          {
            id: 'T22-L06-Q2',
            type: 'mc',
            prompt:
              'You are working on an optical amplifier at a remote site. Before opening the equipment, what must you do?',
            choices: [
              'Just open it — fiber equipment is always safe',
              'Verify it is de-energized with a voltage tester, lock the power switch OFF, and tag it with your name',
              'Ask the customer for permission',
              'Call the equipment manufacturer',
            ],
            answerIndex: 1,
            explanation:
              'OSHA 1910.147 (Lockout-Tagout) is mandatory for electrical equipment. Verify de-energized, lock, and tag. Only you can remove your lock when work is done.',
          },
          {
            id: 'T22-L06-Q3',
            type: 'mc',
            prompt:
              'A confined space is any enclosed area with limited entry/exit. Which of these is NOT typically considered a confined space?',
            choices: [
              'Underground utility vault',
              'Long buried conduit run (> 30 feet)',
              'An open trench for aerial cable installation',
              'Manhole with sump area',
            ],
            answerIndex: 2,
            explanation:
              'An open trench is NOT a confined space — it has free entry and exit. A vault, buried conduit, or manhole ARE confined spaces requiring atmospheric testing and a competent person outside.',
          },
          {
            id: 'T22-L06-Q4',
            type: 'mc',
            prompt:
              'You suffer a minor cut from a fiber cleaver. Your supervisor offers to treat it with a bandage in the field. Should you report it to OSHA?',
            choices: [
              'No — minor injuries don\'t need reporting',
              'Yes — any injury more than first aid (e.g., clinic visit, stitches) is recordable',
              'Only if it draws blood',
              'Only if it prevents you from working',
            ],
            answerIndex: 1,
            explanation:
              'OSHA Form 301 recordability depends on whether treatment exceeds first aid. If it requires a clinic visit, stitches, or antibiotics, it\'s recordable. Check with your supervisor if unsure.',
          },
          {
            id: 'T22-L06-Q5',
            type: 'fill-in-blank',
            prompt:
              'Before entering a confined space, you must test the atmosphere for ____, ____, and toxic gases, and have a ____ person stationed outside.',
            answer: 'oxygen explosive competent',
            answerDisplay: 'oxygen, explosive (or flammable), and competent',
            explanation:
              'OSHA 1910.146 confined-space entry requires atmospheric testing (O₂ level, explosive gases, toxic gases) and a competent person standing outside for rescue if needed.',
          },
        ]}
      />

    </LessonLayout>
  );
}
