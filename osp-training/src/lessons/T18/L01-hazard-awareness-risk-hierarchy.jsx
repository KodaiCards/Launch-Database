// Net-new — T18.L01 Hazard Awareness & the Risk Hierarchy
// Foundation lesson: general duty clause, 1910.268, hierarchy of controls, SDS

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Sortable from '../../components/primitives/Sortable.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T18.L01',
  course_id: 'T18',
  title: 'Hazard Awareness & the Risk Hierarchy',
  order: 1,
  lesson_type: 'foundation',
  prerequisites: ['T01.L01'],
  vocabulary_introduced: [
    'general duty clause',
    '1910.268',
    'hazard recognition',
    'hierarchy of controls',
    'SDS',
  ],
  key_terms: [
    {
      term: 'general duty clause',
      definition:
        'Section 5(a)(1) of the OSH Act. Requires employers to provide a workplace free from recognized hazards that are causing or likely to cause death or serious physical harm. This applies even when no specific OSHA regulation covers the exact situation.',
    },
    {
      term: '1910.268',
      definition:
        'OSHA Subpart R — Telecommunications. The primary federal safety standard for OSP field work. Covers overhead line work, underground installations, manholes, grounding, and PPE requirements for telecom crews.',
    },
    {
      term: 'hazard recognition',
      definition:
        'The trained skill of identifying physical, electrical, chemical, and environmental dangers before work begins. A worker who spots the hazard before entering the work area can eliminate or control it; a worker who does not may encounter it without protection.',
    },
    {
      term: 'hierarchy of controls',
      definition:
        'An ordered framework for reducing workplace hazards, from most effective to least: Elimination → Substitution → Engineering Controls → Administrative Controls → PPE. Each level addresses the hazard differently; PPE is last because it is the least reliable layer.',
    },
    {
      term: 'SDS',
      definition:
        'Safety Data Sheet — a document supplied with hazardous chemicals that lists composition, exposure limits, PPE requirements, first-aid procedures, and environmental hazards. Replaced the old MSDS format under OSHA HazCom 2012 (29 CFR 1910.1200).',
    },
  ],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'RUS', source_lesson_id: 'T01.L01' },
    { term: 'NESC', source_lesson_id: 'T01.L02' },
  ],
  estimated_minutes: 20,
};

export default function T18L01_HazardAwarenessRiskHierarchy() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Before you touch a pole, open a manhole, or set up on a roadway shoulder, you need
          to know what can hurt you — and what to do about it. This lesson covers the two
          things every OSP worker must understand on day one: how to <strong>recognize a
          hazard</strong>, and what the correct order is for <strong>controlling it</strong>.
          Get this wrong and PPE becomes a substitute for thinking. Get it right and the
          whole crew goes home in one piece.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OSHA</td>
              <td className="px-3 py-2">Occupational Safety and Health Administration</td>
              <td className="px-3 py-2">Federal agency that sets and enforces workplace safety rules</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">CFR</td>
              <td className="px-3 py-2">Code of Federal Regulations</td>
              <td className="px-3 py-2">The numbered system for all federal rules (e.g., 29 CFR = OSHA's title)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">SDS</td>
              <td className="px-3 py-2">Safety Data Sheet</td>
              <td className="px-3 py-2">The document that tells you how to handle a chemical safely; used to be called MSDS</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">PPE</td>
              <td className="px-3 py-2">Personal Protective Equipment</td>
              <td className="px-3 py-2">Gloves, helmets, safety glasses, boots — worn by the worker as the last line of defense</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">What "hazard recognition" actually means</h3>
        <p className="mt-2">
          Think of it like a smoke detector. The detector doesn't put out the fire — it tells
          you the fire exists before you walk into it. <strong>Hazard recognition</strong> is
          your mental smoke detector. It's the trained habit of scanning a work site and
          asking: "What in this scene can kill, injure, or sicken someone?" before anyone
          picks up a tool.
        </p>
        <p className="mt-2">
          On an OSP job, the four categories of hazards you're scanning for every day are:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-300/90">
          <li><strong>Physical:</strong> Falls from poles or aerial lifts; trench cave-in; struck-by from vehicles or falling hardware.</li>
          <li><strong>Electrical:</strong> Energized distribution conductors on joint-use poles; induced voltage on messenger; powered equipment in fiber huts.</li>
          <li><strong>Chemical:</strong> Filling gel, conduit cement, battery acid, sewer gas in manholes, concrete saw silica dust.</li>
          <li><strong>Environmental:</strong> Heat stress, lightning, traffic, unstable ground, wildlife in rural ROWs.</li>
        </ul>

        <h3 className="mt-5 font-semibold">The law behind it — 29 CFR 1910.268 and the General Duty Clause</h3>
        <p className="mt-2">
          Two legal rules govern almost every OSP safety situation:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-2">
          <li>
            <strong>29 CFR 1910.268 (OSHA Subpart R — Telecommunications)</strong> is the
            primary federal safety standard for telecom field work. It covers overhead line
            work, manhole entry, grounding, and PPE requirements for crews like yours.
            When OSHA inspects an OSP job and cites a violation, 1910.268 is the citation
            most likely to appear.
          </li>
          <li>
            <strong>The General Duty Clause — OSH Act § 5(a)(1)</strong> is the catch-all.
            When no specific OSHA rule covers an exact hazard, the General Duty Clause still
            requires the employer to protect workers from recognized hazards that can cause
            death or serious harm. An OSHA inspector can cite the General Duty Clause for
            things 1910.268 doesn't specifically address — for example, heat illness in a
            summer aerial job.
          </li>
        </ol>

        {/* ── FLASHCARDS ──────────────────────────────────────────────────── */}
        <Flashcard
          deckId="T18-L01"
          cards={[
            {
              id: 'T18-L01-fc-gdc',
              front: 'What is the General Duty Clause?',
              back: 'Section 5(a)(1) of the OSH Act. Requires employers to provide a workplace free from recognized hazards that are causing or likely to cause death or serious physical harm. Applies even when no specific OSHA regulation covers the exact situation.',
            },
            {
              id: 'T18-L01-fc-1910268',
              front: 'What does 29 CFR 1910.268 cover?',
              back: 'OSHA Subpart R — Telecommunications. The primary federal safety standard for OSP field work. Covers overhead line work, underground installations, manholes, grounding, and PPE requirements for telecom crews.',
            },
            {
              id: 'T18-L01-fc-hazard-rec',
              front: 'What is hazard recognition?',
              back: 'The trained skill of identifying physical, electrical, chemical, and environmental dangers before work begins. Spotting the hazard before entering the work area allows it to be eliminated or controlled.',
            },
            {
              id: 'T18-L01-fc-hierarchy',
              front: 'What is the hierarchy of controls (most to least effective)?',
              back: 'Elimination → Substitution → Engineering Controls → Administrative Controls → PPE. PPE is last because it is the least reliable layer — it depends on correct selection, fit, and consistent use by every worker.',
            },
            {
              id: 'T18-L01-fc-sds',
              front: 'What is a Safety Data Sheet (SDS)?',
              back: 'A document supplied with hazardous chemicals listing composition, exposure limits, PPE requirements, first-aid procedures, and environmental hazards. Replaced the old MSDS format under OSHA HazCom 2012 (29 CFR 1910.1200).',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The Hierarchy of Controls — Applying It in the Field</h2>

        <p>
          The <strong>hierarchy of controls</strong> tells you which fix to reach for first.
          Think of it as a priority ladder: always try the top rung first, and only move down
          when the higher rung isn't practical. Every level to the right of "PPE" is more
          reliable than PPE alone, because it removes or reduces the hazard itself rather than
          relying on a person to use equipment correctly, every time.
        </p>

        <div className="mt-4 space-y-3">
          <div className="p-4 bg-green-400/10 border border-green-400/30 rounded-lg">
            <p className="font-semibold text-green-300">1 — Elimination (most effective)</p>
            <p className="text-sm text-slate-300/90 mt-1">Remove the hazard entirely from the work environment. Example: schedule manhole work during dry weather so accumulated water doesn't create an electrocution or drowning hazard — you're eliminating the hazardous condition, not just managing it.</p>
          </div>
          <div className="p-4 bg-teal-400/10 border border-teal-400/30 rounded-lg">
            <p className="font-semibold text-teal-300">2 — Substitution</p>
            <p className="text-sm text-slate-300/90 mt-1">Replace the hazardous material or method with something less dangerous. Example: use a water-based, low-VOC conduit lubricant instead of a petroleum-based solvent lubricant where ventilation is limited.</p>
          </div>
          <div className="p-4 bg-sky-400/10 border border-sky-400/30 rounded-lg">
            <p className="font-semibold text-sky-300">3 — Engineering Controls</p>
            <p className="text-sm text-slate-300/90 mt-1">Physical changes that reduce exposure without relying on worker behavior. Example: running a forced-air blower into a manhole before entry to purge sewer gas. The fan keeps doing its job whether or not anyone remembers to ask for it.</p>
          </div>
          <div className="p-4 bg-amber-400/10 border border-amber-400/30 rounded-lg">
            <p className="font-semibold text-amber-300">4 — Administrative Controls</p>
            <p className="text-sm text-slate-300/90 mt-1">Policies, procedures, training, and schedules that change how work is done. Example: requiring a gas-monitor reading log before manhole entry; buddy system for pole climbing; rotating crews to limit heat exposure during summer aerial jobs. Effective but dependent on consistent follow-through.</p>
          </div>
          <div className="p-4 bg-red-400/10 border border-red-400/30 rounded-lg">
            <p className="font-semibold text-red-300">5 — PPE (least effective as a standalone)</p>
            <p className="text-sm text-slate-300/90 mt-1">Hard hats, gloves, safety glasses, respirators, fall protection harnesses. PPE doesn't reduce the hazard — it reduces the injury if the hazard is encountered. It's the last line of defense, not the first. PPE is always REQUIRED even when higher controls are in place; it is never a replacement for them.</p>
          </div>
        </div>

        <div className="mt-5 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book (OSHA / NIOSH):</strong> The hierarchy of controls places PPE last
            because it is least reliable. Engineering controls — ventilation fans, barriers,
            mechanical guarding — are preferred because they work independent of human compliance.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> Most OSP crews default to "put on your PPE" as the
            primary hazard response because it's fast and visible. Engineering controls require
            planning time and equipment that field crews may not carry. This is understandable —
            but it means PPE is being used as a substitute for a higher-level control rather than
            as a backup layer. The result: when a worker's hard hat isn't seated right, or a glove
            is off for a "quick" task, the only protection layer just failed. The hierarchy matters
            because layering controls means one layer failing doesn't cause an injury.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">Where SDS fits into the picture</h3>
        <p className="mt-2">
          The <strong>Safety Data Sheet (SDS)</strong> is the tool that gives you the
          information to climb the hierarchy. Before you can eliminate, substitute, engineer,
          or administrate around a chemical hazard, you need to know what the chemical does
          and what protects against it. The SDS tells you:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm text-slate-300/90">
          <li><strong>Section 1:</strong> Product identity and supplier emergency contact.</li>
          <li><strong>Section 4:</strong> First-aid measures (if exposure occurs, what to do immediately).</li>
          <li><strong>Section 8:</strong> Exposure controls and PPE (what to wear when working with this chemical).</li>
          <li><strong>Section 11:</strong> Toxicology (health effects — short-term and long-term).</li>
        </ul>
        <p className="mt-2 text-sm text-slate-300/70">
          Every employer is required to maintain SDS files accessible to all workers for every
          hazardous chemical on site — per 29 CFR 1910.1200 (OSHA HazCom 2012). You don't need
          to memorize the SDS for every product, but you need to know where to find them and how
          to read the four key sections above. L08 of this topic goes into full SDS detail for the
          specific chemicals you'll encounter on OSP jobs.
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Layered Protection — Why One Control Is Never Enough</h2>
        <p>
          Swiss cheese model: imagine each control layer is a slice of Swiss cheese. Each slice
          has holes. Alone, a hole lets a hazard through. Stack multiple slices and the holes
          rarely align — protection holds even when one layer fails. OSHA's hierarchy works
          the same way: use engineering controls AND administrative controls AND PPE together.
          Never treat any one layer as sufficient on its own.
        </p>
        <p className="mt-2">
          This is why OSHA inspectors look for evidence of layered controls, not just the
          presence of PPE on site. A crew wearing hard hats but running no gas monitor before
          manhole entry has PPE (layer 5) but skipped engineering controls (layer 3) and
          administrative controls (layer 4). That's a citation waiting to happen —
          and more importantly, it's a preventable fatality waiting to happen.
        </p>
        <p className="mt-2">
          Source: OSH Act § 5(a)(1) (osha.gov); 29 CFR 1910.268(a) scope
          (ecfr.gov); NIOSH Hierarchy of Controls (cdc.gov/niosh).
        </p>
      </section>

      {/* ── SORTABLE: Hierarchy of Controls ────────────────────────────── */}
      <Sortable
        title="Sort the Controls — Most to Least Effective"
        prompt="Drag these five control types into order from MOST effective (top) to LEAST effective (bottom). Submit when you're confident in your order."
        items={[
          { id: 'ppe', label: 'PPE — personal protective equipment (gloves, hard hat, safety glasses)' },
          { id: 'admin', label: 'Administrative Controls — procedures, training, schedules' },
          { id: 'engineering', label: 'Engineering Controls — physical changes that reduce exposure (ventilation, barriers)' },
          { id: 'substitution', label: 'Substitution — replace the hazardous material or method with a safer one' },
          { id: 'elimination', label: 'Elimination — remove the hazard entirely from the work environment' },
        ]}
        correctOrder={['elimination', 'substitution', 'engineering', 'admin', 'ppe']}
        explanation="Elimination tops the hierarchy because it removes the hazard itself — there's nothing left to protect against. Substitution reduces the hazard's severity. Engineering controls reduce exposure mechanically. Administrative controls depend on consistent human behavior. PPE depends on correct selection, fit, and consistent use every single time — making it the least reliable layer."
        citation="NIOSH Hierarchy of Controls (cdc.gov/niosh); OSHA.gov training materials."
        fieldNote="Field crews often put PPE at the top because it's the most visible and fastest action. The hierarchy isn't saying PPE is unimportant — it's always required. It's saying PPE is the last resort, not the first."
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T18.L01 Check — Hazard Awareness & the Risk Hierarchy"
        mode="multiple-choice"
        questions={[
          {
            id: 'T18-L01-Q1',
            type: 'mc',
            prompt:
              'A fiber crew is scheduled to work in a manhole adjacent to a sewer main. Before any work begins, the foreman identifies a potential sewer gas (hydrogen sulfide) hazard. According to the hierarchy of controls, which action is MOST effective?',
            choices: [
              'Require all workers in the manhole to wear full-face respirators (PPE)',
              'Post a sign at the manhole warning of H₂S hazard (administrative control)',
              'Reschedule the work to a location with a vault instead of a manhole (elimination)',
              'Run a forced-air blower into the manhole for 15 minutes before entry (engineering control)',
            ],
            answerIndex: 2,
            explanation:
              'Elimination (rescheduling to a vault, or redesigning the route to avoid the sewer-adjacent manhole) removes the hazard entirely. The engineering control (blower) is second-best — it reduces exposure but the sewer gas source still exists. PPE and administrative controls address the hazard only after the worker is in proximity to it.',
            citation:
              'NIOSH Hierarchy of Controls; 29 CFR 1910.268(o)(2) (atmospheric testing before manhole entry).',
            fieldNote:
              'In practice, rerouting isn\'t always possible. The next best layer is the engineering control: force-ventilate, continuous-monitor with a calibrated gas detector, and keep the attendant topside. PPE (SCBA if H₂S is confirmed) comes after those controls are running.',
          },
          {
            id: 'T18-L01-Q2',
            type: 'mc',
            prompt:
              'The General Duty Clause (OSH Act § 5(a)(1)) most accurately means:',
            choices: [
              'Employers only need to comply with OSHA rules that specifically name their industry',
              'Workers are responsible for identifying their own hazards and providing their own PPE',
              'Employers must protect workers from recognized hazards even when no specific OSHA rule addresses the exact situation',
              'OSHA can only cite violations if the employer has been warned in a prior inspection',
            ],
            answerIndex: 2,
            explanation:
              'The General Duty Clause is the catch-all authority. When a hazard exists and no specific regulation directly covers it, OSHA can still cite the employer under § 5(a)(1) if the hazard is "recognized" (known in the industry) and likely to cause death or serious harm. Heat illness on outdoor construction sites is a common example — no specific OSHA heat standard exists as of this writing, but employers are regularly cited under the General Duty Clause.',
            citation: 'OSH Act § 5(a)(1) (osha.gov/laws-regs/oshact/section5).',
          },
          {
            id: 'T18-L01-Q3',
            type: 'fill-in-blank',
            prompt:
              'An OSHA ____ is the document that lists the composition, exposure limits, PPE requirements, and first-aid procedures for a hazardous chemical used on the job site.',
            answer: 'SDS',
            answerDisplay: 'Safety Data Sheet (SDS)',
            explanation:
              'The Safety Data Sheet (SDS) replaced the old Material Safety Data Sheet (MSDS) when OSHA adopted the Globally Harmonized System (GHS) under HazCom 2012 (29 CFR 1910.1200). The 16-section format is standardized so workers can find information quickly regardless of the product manufacturer.',
          },
          {
            id: 'T18-L01-Q4',
            type: 'mc',
            prompt:
              'Which OSHA regulation is the primary safety standard specifically covering telecom OSP field work — overhead lines, manholes, and grounding requirements for crews like fiber and telephone crews?',
            choices: [
              '29 CFR 1910.146 — Permit-Required Confined Spaces',
              '29 CFR 1910.268 — Telecommunications (Subpart R)',
              '29 CFR 1926 Subpart M — Fall Protection (Construction)',
              '29 CFR 1910.269 — Electric Power Generation, Transmission, and Distribution',
            ],
            answerIndex: 1,
            explanation:
              '29 CFR 1910.268 (Subpart R — Telecommunications) is the primary OSHA standard for telecom field work. It covers overhead line safety, underground manhole work, atmospheric testing before manhole entry, fall protection on poles, and PPE requirements for telecom crews. The other listed standards are real and important, but they are supplementary or apply to different trades.',
            citation: '29 CFR 1910.268(a) — Scope and Application (ecfr.gov; osha.gov).',
          },
        ]}
      />

    </LessonLayout>
  );
}
