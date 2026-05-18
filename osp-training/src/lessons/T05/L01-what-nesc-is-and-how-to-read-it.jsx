// Net-new — T05.L01 What NESC Is and How to Read It
// Foundation lesson: NESC structure, rule numbering, AHJ concept, paywalled-standard handling

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T05.L01',
  course_id: 'T05',
  title: 'What NESC Is and How to Read It',
  order: 1,
  lesson_type: 'foundation',
  prerequisites: ['T01.L09', 'T01.L02'],
  learning_objectives: [
    'Explain what the NESC is, who publishes it, and what it governs',
    'Identify the four primary NESC rules that govern aerial OSP design',
    'Describe how to navigate NESC rule numbering, tables, and section references',
    'Understand what an AHJ is and why it matters for design work',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'NESC',
    'IEEE C2',
    'Rule',
    'Section',
    'Part',
    'AHJ',
    'Rule 232',
    'Rule 235',
    'Rule 250',
    'Rule 261',
  ],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'pole', source_lesson_id: 'T01.L02' },
    { term: 'span', source_lesson_id: 'T01.L02' },
    { term: 'attachment', source_lesson_id: 'T01.L02' },
    { term: 'supply space', source_lesson_id: 'T01.L02' },
    { term: 'communication space', source_lesson_id: 'T01.L02' },
    { term: 'RUS', source_lesson_id: 'T01.L01' },
    { term: 'TIA', source_lesson_id: 'T01.L08' },
  ],
  key_terms: [
    {
      term: 'NESC',
      definition:
        'National Electrical Safety Code — the main engineering standard in the United States that governs how overhead and underground power and communication lines must be built, operated, and maintained. Published by IEEE as document C2. Most states adopt it by reference, making it legally binding for utility construction.',
    },
    {
      term: 'IEEE C2',
      definition:
        'The IEEE document number for the National Electrical Safety Code. "IEEE" stands for the Institute of Electrical and Electronics Engineers, the organization that writes and publishes the NESC. The current edition is C2-2023. When you see "NESC" and "IEEE C2," they refer to the same document.',
    },
    {
      term: 'Rule',
      definition:
        'A numbered requirement within the NESC. Rules are grouped by topic — Rule 232 covers vertical clearance, Rule 235 covers separation between systems, Rule 250 covers loading districts, Rule 261 covers grades of construction. Each Rule may contain lettered sub-rules (e.g., Rule 232A, 232B) and references to numbered Tables.',
    },
    {
      term: 'Section',
      definition:
        'A major division of the NESC that groups related Rules together. For example, Section 23 groups the safety rules for overhead lines, and Section 26 gives the load and strength factors used for structural design. Rules inside a Section share a common theme.',
    },
    {
      term: 'Part',
      definition:
        'The broadest organizational division of the NESC. Part 1 covers definitions and general rules. Part 2 covers overhead lines (aerial construction). Part 3 covers underground lines. Part 4 covers work rules (worker safety procedures). OSP aerial design falls primarily under Part 2.',
    },
    {
      term: 'AHJ',
      definition:
        'Authority Having Jurisdiction — the agency, organization, office, or individual responsible for enforcing or interpreting a code or standard in a particular location. The AHJ for aerial OSP construction may be a state public utility commission, a county road department, a railroad authority, or a private pole owner, depending on where the poles sit and who owns them.',
    },
    {
      term: 'Rule 232',
      definition:
        'The NESC rule that sets the minimum vertical clearance cables must maintain above ground, roads, railroads, and water bodies. This is the clearance rule — it tells you how high the cable must be at its lowest point under design load conditions.',
    },
    {
      term: 'Rule 235',
      definition:
        'The NESC rule that governs the separation between communication lines and supply (power) lines on the same pole. This is the safety-zone rule — it protects communication workers from accidentally contacting energized power conductors while working in the communication space.',
    },
    {
      term: 'Rule 250',
      definition:
        'The NESC rule that defines loading districts (Light, Medium, Heavy, Extreme Wind) and the specific ice thickness, wind pressure, and temperature combinations that aerial structures must be designed to withstand in each district.',
    },
    {
      term: 'Rule 261',
      definition:
        'The NESC rule that defines grades of construction (Grade B, Grade C, Grade N) and specifies which crossings require each grade. Grade B requires higher safety factors than Grade C, and is mandatory at railroad crossings, navigable waterways, and limited-access highways.',
    },
  ],
};

export const key_terms = meta.key_terms;

export default function T05L01_WhatNESCIsAndHowToReadIt() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Before you can design a single aerial span, you need to know the rulebook.
          The <strong>NESC</strong> — National Electrical Safety Code — is that rulebook.
          It tells you how high your cable must be above the road, how far it has to stay
          from the power lines on the same pole, and how much ice and wind load your design
          must survive. Every aerial OSP designer in the United States works under the NESC
          whether they know it or not.
        </p>
        <p className="mt-2">
          This lesson explains what the NESC is, who publishes it, how its rules are numbered,
          and which four rules you'll use constantly in aerial design work. Think of it as
          learning to read the table of contents before you open the textbook.
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
              <td className="px-3 py-2 font-mono">NESC</td>
              <td className="px-3 py-2">National Electrical Safety Code</td>
              <td className="px-3 py-2">The federal/state safety standard for overhead and underground power and comm lines</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">IEEE</td>
              <td className="px-3 py-2">Institute of Electrical and Electronics Engineers</td>
              <td className="px-3 py-2">The organization that writes and publishes the NESC (document number C2)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">AHJ</td>
              <td className="px-3 py-2">Authority Having Jurisdiction</td>
              <td className="px-3 py-2">The agency or person who enforces the code on your specific project</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">What the NESC actually is</h3>
        <p className="mt-2">
          The NESC is published by <strong>IEEE</strong> (Institute of Electrical and
          Electronics Engineers) as document number <strong>C2</strong>. The current edition
          is <strong>C2-2023</strong>, published in 2023. It's updated on a roughly
          five-year cycle.
        </p>
        <p className="mt-2">
          The NESC governs the construction, operation, and maintenance of:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>Overhead supply (power) lines</li>
          <li>Overhead communication lines (telephone, fiber, cable TV)</li>
          <li>Underground supply and communication lines</li>
        </ul>
        <p className="mt-2">
          Most states in the US adopt the NESC by reference into state law, which means
          building an aerial fiber line that violates the NESC is not just an engineering
          mistake — it can be a legal violation. Your pole owner (usually the electric utility)
          will require NESC compliance as a condition of any attachment permit.
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — The NESC is a minimum, not a target</p>
          <p className="text-slate-300/90">
            <strong>Book (NESC standard):</strong> The NESC sets the absolute minimums for clearances,
            separations, and structural loads. Meeting those minimums is legally compliant.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> Most engineering firms design to margins above the
            NESC minimum. A cable that just barely meets the clearance requirement on paper may
            violate it in the field because of sag variation, thermal expansion, or measurement
            error. The standing practice is to add 1–2 ft of margin above the NESC clearance
            minimum on every design. Your pole owner's attachment guidelines may set even higher
            margins — always check the specific utility's joint-use agreement.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Risk of confusing them:</strong> Designing to the exact NESC minimum
            leaves no room for error. A pole that shifts slightly, a sag calculation that's
            off by a few inches, or a splice case that's a bit heavier than spec can push
            the cable below the minimum. A complaint from DOT or the pole owner means
            re-sagging the entire span at your expense.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">How the NESC is organized</h3>
        <p className="mt-2">
          The NESC has four major divisions called <strong>Parts</strong>:
        </p>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Part</th>
              <th className="px-3 py-2 text-left">Covers</th>
              <th className="px-3 py-2 text-left">Relevant to OSP design?</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Part 1</td>
              <td className="px-3 py-2">Definitions and general rules</td>
              <td className="px-3 py-2">Yes — definitions anchor every other rule</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Part 2</td>
              <td className="px-3 py-2">Overhead lines (aerial construction)</td>
              <td className="px-3 py-2"><strong>Primary reference for aerial OSP design</strong></td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Part 3</td>
              <td className="px-3 py-2">Underground lines</td>
              <td className="px-3 py-2">Covered in T06 (Underground OSP Design)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Part 4</td>
              <td className="px-3 py-2">Work rules (worker safety procedures)</td>
              <td className="px-3 py-2">Covered in T18 (Safety & OSHA) — minimum approach distances are Part 4</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-3">
          Inside each Part, the NESC is organized into numbered <strong>Sections</strong>,
          which are then divided into numbered <strong>Rules</strong>. A Rule reference like
          "Rule 232" means Section 23, Rule 2. The numbering is hierarchical — Rule 232 is in
          Section 23 of Part 2.
        </p>
        <p className="mt-2">
          Rules may have lettered sub-rules (232A, 232B) and reference numbered <strong>Tables</strong>
          (e.g., "Table 232-1"). The Tables contain the actual numeric values — clearance
          distances, load values, conductor ratings — that the Rules require you to use.
        </p>

        <div className="mt-3 p-4 border border-blue-400/30 bg-blue-400/5 rounded-lg text-sm">
          <p className="font-semibold text-blue-300 mb-1">Important: The NESC is a paywalled standard</p>
          <p className="text-slate-300/90">
            The full NESC C2-2023 text is only available for purchase from IEEE
            (standards.ieee.org). The exact table values — specific clearance distances,
            load multipliers, factor matrices — require the paid document.
          </p>
          <p className="text-slate-300/90 mt-2">
            In this curriculum, clearance and load values that come from paywalled NESC
            tables are stated with "approximately" language and verified against multiple
            public secondary sources (utility design guides, regulator summaries). You should
            confirm all values from the current NESC edition for any actual design work.
            Your company's licensed copy, your pole owner's attachment standards, and your
            state PUC's adopted rules are the authoritative references for design.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">The four NESC rules aerial OSP designers use most</h3>
        <p className="mt-2">
          You don't need to memorize the entire NESC. In day-to-day aerial design, four rules
          come up constantly. Here's the quick map — every one of these gets its own full
          lesson in T05:
        </p>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Rule</th>
              <th className="px-3 py-2 text-left">Topic</th>
              <th className="px-3 py-2 text-left">The key question it answers</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono font-semibold">Rule 232</td>
              <td className="px-3 py-2">Vertical clearance</td>
              <td className="px-3 py-2">How high must the cable be above the road / railroad / water?</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono font-semibold">Rule 235</td>
              <td className="px-3 py-2">Comm-to-supply separation</td>
              <td className="px-3 py-2">How far must my cable stay from the power lines on the same pole?</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono font-semibold">Rule 250</td>
              <td className="px-3 py-2">Loading districts</td>
              <td className="px-3 py-2">What ice and wind loads must my design survive?</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono font-semibold">Rule 261</td>
              <td className="px-3 py-2">Grades of construction</td>
              <td className="px-3 py-2">Does my crossing require Grade B or Grade C safety factors?</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">What an AHJ is and why it matters</h3>
        <p className="mt-2">
          The <strong>AHJ</strong> — Authority Having Jurisdiction — is whoever has the
          legal authority to interpret and enforce the NESC (and any other applicable code)
          in the specific location where you're working.
        </p>
        <p className="mt-2">
          The AHJ isn't always the same organization. Depending on the project:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li><strong>State public utility commission (PUC)</strong> — for most joint-use pole lines in the public right-of-way</li>
          <li><strong>County or city road department</strong> — for crossings in road right-of-way; may require permits with specific clearance certifications</li>
          <li><strong>Railroad authority</strong> — for any crossing over or under active rail lines</li>
          <li><strong>US Army Corps of Engineers (USACE)</strong> — for crossings over navigable waterways</li>
          <li><strong>Pole owner (electric utility)</strong> — has its own attachment standards that may be stricter than NESC minimums</li>
          <li><strong>Federal agencies</strong> — for work on federal lands (BLM, NPS, USFS)</li>
        </ul>
        <p className="mt-2">
          When multiple AHJs apply to the same project (e.g., a rail crossing inside a
          county road), the most stringent requirement wins. Your permit application to DOT
          may need separate sign-off from the railroad. Always identify all AHJs at the start
          of a project — finding an AHJ late adds permit delay.
        </p>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T05-L01"
          cards={[
            { id: 'T05-L01-fc-nesc', front: 'What is the NESC and who publishes it?', back: 'National Electrical Safety Code — the main engineering standard governing overhead and underground power and communication lines in the United States. Published by IEEE as document C2. Current edition is C2-2023.' },
            { id: 'T05-L01-fc-ahj', front: 'What is an AHJ?', back: 'Authority Having Jurisdiction — the agency, organization, office, or individual responsible for enforcing or interpreting a code in a specific location. On aerial OSP projects, the AHJ may be a state PUC, county road department, railroad authority, USACE, or the pole owner\'s attachment standards team.' },
            { id: 'T05-L01-fc-rule232', front: 'What does NESC Rule 232 govern?', back: 'Vertical clearance — the minimum height that cables must maintain above ground, roads, railroads, and water bodies, measured at the lowest point of the cable under design loading conditions.' },
            { id: 'T05-L01-fc-rule235', front: 'What does NESC Rule 235 govern?', back: 'Comm-to-supply separation — the required clearance between communication lines and power supply lines on the same pole. This is the safety-zone rule that protects communication workers from accidentally contacting energized conductors.' },
            { id: 'T05-L01-fc-rule250', front: 'What does NESC Rule 250 govern?', back: 'Loading districts — the geographic zones (Light, Medium, Heavy, Extreme Wind) and the specific ice, wind, and temperature design loads that aerial structures must be built to withstand in each zone.' },
            { id: 'T05-L01-fc-rule261', front: 'What does NESC Rule 261 govern?', back: 'Grades of construction (Grade B, Grade C, Grade N) — the classification system that prescribes safety factor multipliers applied to calculated structural loads. Grade B is required at railroad crossings, navigable waterways, and limited-access highways.' },
            { id: 'T05-L01-fc-ieeec2', front: 'What is IEEE C2?', back: 'The IEEE document number for the National Electrical Safety Code. IEEE stands for the Institute of Electrical and Electronics Engineers, the organization that writes and publishes the NESC. The current edition is C2-2023. "NESC" and "IEEE C2" refer to the same document.' },
            { id: 'T05-L01-fc-rule', front: 'What is a "Rule" in the NESC?', back: 'A numbered requirement within the NESC. Rules are grouped by topic — Rule 232 covers vertical clearance, Rule 235 covers separation between systems, Rule 250 covers loading districts, Rule 261 covers grades of construction. Each Rule may contain lettered sub-rules (e.g., Rule 232A) and references to numbered Tables.' },
            { id: 'T05-L01-fc-section', front: 'What is a "Section" in the NESC?', back: 'A major division of the NESC that groups related Rules together. For example, Section 23 groups the safety rules for overhead lines, and Section 26 gives the load and strength factors used for structural design. Rules inside a Section share a common theme.' },
            { id: 'T05-L01-fc-part', front: 'What is a "Part" in the NESC?', back: 'The broadest organizational division of the NESC. Part 1 covers definitions and general rules. Part 2 covers overhead lines (aerial construction). Part 3 covers underground lines. Part 4 covers work rules (worker safety procedures). OSP aerial design falls primarily under Part 2.' },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Reading a NESC Rule Reference</h2>

        <h3 className="mt-4 font-semibold">Anatomy of a rule citation</h3>
        <p>
          When you see a NESC reference in a design document, it typically looks like one
          of these patterns:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><strong>"Rule 232"</strong> — the base rule number. Section 23, Rule 2.</li>
          <li><strong>"Rule 232A"</strong> — sub-rule A within Rule 232. Usually a specific condition or voltage class.</li>
          <li><strong>"Rule 232, Table 232-1"</strong> — the rule number plus the lookup table that contains the actual values.</li>
          <li><strong>"Section 26"</strong> — the full Section containing multiple rules about load and strength factors.</li>
        </ul>
        <p className="mt-3">
          The hierarchy: Part → Section → Rule → Sub-rule → Table. In practice,
          permit applications and pole attachment orders will cite specific Rules. If your
          design calculations reference "Rule 250 Heavy district," the reviewer will pull
          Table 250-1 from the current NESC edition to verify your numbers.
        </p>

        <h3 className="mt-5 font-semibold">Using secondary sources when you don't have the paid NESC</h3>
        <p>
          Many organizations that work with the NESC publish guidance documents, application
          guides, and training materials that summarize the key values from the standard.
          Examples include state PUC rules, utility joint-use attachment handbooks, and
          engineering firm design criteria documents.
        </p>
        <p className="mt-2">
          These secondary sources are useful for learning and for early-stage design checks.
          For the final submitted design and permit package, always confirm values from:
        </p>
        <ol className="list-decimal pl-5 space-y-1 mt-1">
          <li>The licensed NESC C2-2023 (or the edition adopted in your state)</li>
          <li>The pole owner's attachment standards (which may be stricter)</li>
          <li>The AHJ's permit requirements (which may reference a different edition)</li>
        </ol>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>State Adoption and Edition Differences</h2>

        <h3 className="mt-4 font-semibold">Not all states are on the same edition</h3>
        <p>
          States adopt the NESC by reference into state law, but they don't always adopt
          the most current edition immediately. A state might be legally on NESC 2017
          while the current published edition is C2-2023. Your design must comply with
          the edition adopted in the state where the project is located — which is not
          always the newest edition.
        </p>
        <p className="mt-2">
          How to find out which edition applies: check the state PUC's rules (usually
          available on their website), or ask the pole owner's engineering department.
          Your company's engineering standards document should capture the adopted edition
          for each state where you regularly work.
        </p>

        <div className="mt-4 p-4 border border-blue-400/30 bg-blue-400/5 rounded-lg text-sm">
          <p className="font-semibold text-blue-300 mb-1">Georgia-Specific: GA PSC Rule 515-2-9-.05</p>
          <p className="text-slate-300/90">
            For projects in Georgia — including Macon, GA and surrounding jurisdictions — the
            controlling state rule is <strong>Georgia PSC (Public Service Commission) Rule 515-2-9-.05</strong>,
            which adopts the NESC by reference as the safety standard for utility construction in
            the state. This means NESC compliance is not merely a professional standard in Georgia;
            it has the force of state regulation under PSC Rule 515-2-9-.05.
          </p>
          <p className="text-slate-300/90 mt-2">
            The GA PSC website (psc.ga.gov) publishes the current adopted rules. Before any aerial
            design job in Georgia, confirm: (1) which NESC edition GA PSC has adopted by reference,
            and (2) whether the pole owner's attachment standards add any stricter requirements on
            top of the NESC baseline. The PSC rule is the floor; the pole owner may set a higher bar.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Practical note:</strong> On RUS-program jobs in Georgia (PSC's primary project
            type), the RUS engineering requirements layer on top of the NESC and GA PSC Rule —
            RUS 1751F-630 governs the engineering standards for RUS-funded construction, and those
            must also be met. When NESC, GA PSC Rule, and RUS all apply, the most stringent requirement
            on any given element governs.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">When the NESC and the NEC conflict</h3>
        <p>
          The <strong>NEC</strong> (National Electrical Code — NFPA 70) governs
          electrical installations inside buildings and premises wiring. The
          <strong> NESC</strong> (National Electrical Safety Code — IEEE C2) governs
          utility supply and communication lines in public rights-of-way and across
          property. They're different documents from different organizations covering
          different territory.
        </p>
        <p className="mt-2">
          In practice, an OSP drop that enters a building transitions from NESC territory
          (outside, aerial) to NEC territory (inside, premises) at the building entrance.
          The exact demarcation point varies by AHJ. Your splice case at the utility pole
          is NESC. The wall jack inside the building is NEC. The network interface device
          (NID) at the side of the house is typically the transition point, but confirm
          with the AHJ on any project where the scope includes inside-premises work.
        </p>
      </section>

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T05.L01 Check — What NESC Is and How to Read It"
        mode="multiple-choice"
        questions={[
          {
            id: 'T05-L01-Q1',
            type: 'mc',
            prompt: 'The NESC is published by which organization?',
            choices: [
              'ANSI (American National Standards Institute)',
              'IEEE (Institute of Electrical and Electronics Engineers)',
              'OSHA (Occupational Safety and Health Administration)',
              'FCC (Federal Communications Commission)',
            ],
            answerIndex: 1,
            explanation:
              'The NESC is published by IEEE as document C2. The current edition is C2-2023. ANSI accredits the process but IEEE writes and maintains the standard.',
            citation: 'IEEE C2-2023 (NESC); standards.ieee.org.',
          },
          {
            id: 'T05-L01-Q2',
            type: 'drag-match',
            prompt: 'Match each NESC Rule to the design question it answers.',
            pairs: [
              { item: 'Rule 232', match: 'How high must the cable be above the road?' },
              { item: 'Rule 235', match: 'How far must my cable stay from the power lines on the same pole?' },
              { item: 'Rule 250', match: 'What ice and wind loads must my design survive?' },
              { item: 'Rule 261', match: 'Does this crossing require Grade B or Grade C?' },
            ],
            explanation:
              'Rule 232 = vertical clearance. Rule 235 = comm-to-supply separation (safety zone). Rule 250 = loading districts (ice/wind). Rule 261 = grades of construction (Grade B/C/N). These four rules cover the vast majority of aerial OSP structural design decisions.',
          },
          {
            id: 'T05-L01-Q3',
            type: 'mc',
            prompt:
              'A new fiber attachment crosses an active railroad and a county road in the same span. Two AHJs apply: the railroad authority and the county road department. Which standard applies?',
            choices: [
              'The NESC minimum clearance for roads — the county road is the primary AHJ',
              'The railroad\'s crossing standards — they are always more restrictive than road clearances',
              'The most stringent of the two AHJ requirements applies to the entire span',
              'You pick whichever one is cheaper to meet',
            ],
            answerIndex: 2,
            explanation:
              'When multiple AHJs apply, the most stringent requirement governs. A railroad crossing over a county road requires satisfying both the railroad authority\'s standards AND the county road department\'s permit. In practice, rail crossings (Grade B) are typically more restrictive — but confirm with both AHJs.',
            fieldNote:
              'Rail crossings over navigable waterways also require USACE permits. A single span can have three or four independent AHJ permits. Start permit applications early — rail permits alone can take 6–12 months.',
          },
          {
            id: 'T05-L01-Q4',
            type: 'fill-in-blank',
            prompt:
              'The NESC document number is ____. The current edition (as of 2023) is called ____.',
            answer: 'C2 / C2-2023',
            answerDisplay: 'C2 (document number) / C2-2023 (current edition)',
            explanation:
              'IEEE publishes the NESC as document C2. The 2023 edition is formally cited as "IEEE C2-2023." You\'ll see "NESC 2023" and "IEEE C2-2023" used interchangeably in engineering documents.',
          },
        ]}
      />

    </LessonLayout>
  );
}
