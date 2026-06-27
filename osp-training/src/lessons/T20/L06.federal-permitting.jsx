import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T20.L06',
  course_id: 'T20',
  title: 'Federal Permitting Integration: NEPA, §106, USACE, BLM',
  order: 6,
  prerequisites: ['T09.L01'],
  learning_objectives: [
    'Explain RUS-triggered federal permitting (NEPA, Section 106, wetlands)',
    'Identify when USACE Nationwide Permit 57, BLM, or USFS approval required',
    'Understand RUS environmental worksheet role',
  ],
  estimated_minutes: 30,
  vocabulary_introduced: [
    'RUS environmental worksheet',
    'categorical exclusion',
    'environmental assessment',
    'Section 106',
    'NWP 57',
  ],
  vocabulary_assumed: [
    { term: 'NEPA', source_lesson_id: 'T01.L08' },
  ],
};

export const key_terms = [
  {
    term: 'RUS environmental worksheet',
    definition: 'First NEPA screening tool. RUS borrower completes worksheet documenting project scope, environmental setting, and potential impacts (wetlands, endangered species, historic sites, Indian lands). Worksheet determines whether NEPA goes to Categorical Exclusion or Environmental Assessment.',
  },
  {
    term: 'categorical exclusion',
    definition: 'NEPA review level for projects under $300K in low-impact areas where the worksheet shows no wetlands, no endangered species, no historic sites. RUS approves with NEPA coverage closed.',
  },
  {
    term: 'environmental assessment',
    definition: 'Deeper NEPA review for projects $300K or higher or in sensitive areas. RUS prepares EA, issues Finding of No Significant Impact (FONSI) or refers to Environmental Impact Statement.',
  },
  {
    term: 'Section 106',
    definition: 'Federal historic preservation law (54 USC 306108). Required if project crosses federal land, affects historic properties, or triggers federal permits. Requires consultation with state historic preservation office (SHPO).',
  },
  {
    term: 'NWP 57',
    definition: 'USACE Nationwide Permit 57 (33 CFR Part 330). Applies when aerial/underground construction crosses federal jurisdictional wetlands (within 500 ft of OHWM). Telecom projects often qualify; minimal paperwork if conditions met.',
  },
];

export default function T20L06_FederalPermitting() {
  return (
    <LessonLayout meta={meta}>
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>RUS funding triggers federal compliance obligations that OSP projects might not face otherwise. Three big ones: NEPA (environmental review), Section 106 (historic preservation), and USACE permitting (wetlands). T09 covers general permitting. This lesson adds the RUS-specific overlay: what makes a project "federal" and which agencies you'll deal with.</p>

        <h3 className="mt-4 font-semibold">Why RUS funding = federal permitting</h3>
        <p className="mt-2">RUS is a federal agency. Loans/grants = federal funding. When federal dollars flow, federal environmental law kicks in (NEPA = 40 CFR 1500-1508). Your design must demonstrate environmental compliance before RUS releases funds.</p>

        <h3 className="mt-4 font-semibold">Three main federal overlays</h3>
        <div className="space-y-3 mt-3 text-sm">
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-blue-300">NEPA (7 CFR Part 1b — RUS environmental review)</p>
            <p className="text-slate-300/90 mt-1">Applies to RUS projects 300K or higher or in sensitive environmental areas. RUS environmental worksheet required. If project affects wetlands, water quality, endangered species, historic sites: deeper environmental assessment needed. [confirm edition]</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-green-300">Section 106 (54 USC 306108)</p>
            <p className="text-slate-300/90 mt-1">Federal historic preservation law. If project: crosses federal land, affects historic properties, or triggers federal permits, Section 106 review required. Consult with state historic preservation office (SHPO).</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-purple-300">USACE Nationwide Permit 57 (33 CFR Part 330)</p>
            <p className="text-slate-300/90 mt-1">If aerial/underground crosses federal jurisdictional wetlands (within 500 ft of OHWM), NWP 57 applies. Telecom projects often qualify; minimal paperwork if conditions met. RUS coordinates with USACE.</p>
          </div>
        </div>
      </section>

      <Flashcard
        deckId="T20-L06"
        cards={[
          {
            id: 'T20-L06-fc-worksheet',
            front: 'What is the RUS environmental worksheet?',
            back: 'First NEPA screening tool. RUS borrower completes worksheet documenting project scope, environmental setting, and potential impacts (wetlands, endangered species, historic sites, Indian lands). Worksheet determines whether NEPA goes to Categorical Exclusion or Environmental Assessment.',
          },
          {
            id: 'T20-L06-fc-ce',
            front: 'What is a categorical exclusion in RUS NEPA review?',
            back: 'NEPA review level for projects under $300K in low-impact areas where the worksheet shows no wetlands, no endangered species, no historic sites. RUS approves with NEPA coverage closed.',
          },
          {
            id: 'T20-L06-fc-ea',
            front: 'What is an environmental assessment in RUS NEPA review?',
            back: 'Deeper NEPA review for projects $300K or higher or in sensitive areas. RUS prepares EA, issues Finding of No Significant Impact (FONSI) or refers to Environmental Impact Statement.',
          },
          {
            id: 'T20-L06-fc-s106',
            front: 'When does Section 106 apply to an RUS project?',
            back: 'Federal historic preservation law (54 USC 306108). Required if project crosses federal land, affects historic properties, or triggers federal permits. Requires consultation with state historic preservation office (SHPO).',
          },
          {
            id: 'T20-L06-fc-nwp57',
            front: 'What is USACE Nationwide Permit 57?',
            back: 'USACE Nationwide Permit 57 (33 CFR Part 330). Applies when aerial/underground construction crosses federal jurisdictional wetlands (within 500 ft of OHWM). Telecom projects often qualify; minimal paperwork if conditions met.',
          },
        ]}
      />

      <section data-tier="working">
        <h2>RUS Environmental Worksheet</h2>
        <p className="mt-2">First screening tool. RUS borrower completes worksheet documenting: project scope, environmental setting, potential impacts (wetlands? endangered species? historic sites? Indian lands?). Worksheet determines whether NEPA goes to Categorical Exclusion (CE, minimal docs) or Environmental Assessment (EA, deeper review).</p>

        <h3 className="mt-4 font-semibold">Review levels</h3>
        <div className="bg-white/5 rounded p-3 mt-3 text-sm space-y-2">
          <p><strong>Categorical Exclusion (CE):</strong> Project under $300K in low-impact area. Worksheet shows no wetlands, no endangered species, no historic sites. RUS approves with NEPA coverage closed.</p>
          <p><strong>Environmental Assessment (EA):</strong> Project $300K or higher OR sensitive area. RUS prepares EA, issues Finding of No Significant Impact (FONSI) or refers to Environmental Impact Statement (EIS).</p>
          <p><strong>EIS (rare):</strong> Major impacts. Requires 6+ months, multi-agency coordination.</p>
        </div>

        <h3 className="mt-5 font-semibold">NEPA Decision Path (RUS Projects)</h3>
        <div className="mt-3 space-y-2 text-sm">
          <div className="rounded bg-slate-700/50 p-3 border-l-4 border-blue-500">
            <p className="font-semibold text-blue-300">Step 1 — Complete RUS Environmental Worksheet</p>
            <p className="text-slate-300/90 mt-1">Answer: project cost? wetlands/floodplains? endangered species? historic properties? Indian lands? Tribal consultation needed?</p>
          </div>
          <div className="rounded bg-slate-700/50 p-3 border-l-4 border-green-500">
            <p className="font-semibold text-green-300">Step 2 — CE or EA?</p>
            <p className="text-slate-300/90 mt-1">All "no" answers + under $300K → Categorical Exclusion (CE). Any "yes" or over $300K → Environmental Assessment (EA). RUS decides; borrower doesn't self-certify CE.</p>
          </div>
          <div className="rounded bg-slate-700/50 p-3 border-l-4 border-amber-500">
            <p className="font-semibold text-amber-300">Step 3 — Section 106 trigger?</p>
            <p className="text-slate-300/90 mt-1">Any federal nexus (federal land, federal permit, or RUS funding) → 54 USC 306108 applies. SHPO consultation may take 30–90 days for rural routes with unknown archaeological potential.</p>
          </div>
          <div className="rounded bg-slate-700/50 p-3 border-l-4 border-purple-500">
            <p className="font-semibold text-purple-300">Step 4 — Wetlands / USACE?</p>
            <p className="text-slate-300/90 mt-1">Route crosses jurisdictional wetlands (within 500 ft of OHWM)? Apply for NWP 57. If conditions met, most telecom crossings qualify. For directional bore under wetland: NWP 12 may apply instead.</p>
          </div>
          <div className="rounded bg-slate-700/50 p-3 border-l-4 border-red-500">
            <p className="font-semibold text-red-300">Step 5 — Federal land (BLM/USFS/NPS)?</p>
            <p className="text-slate-300/90 mt-1">Route crosses BLM or USFS land? Right-of-way grant required (43 CFR Part 2800 for BLM; 36 CFR 251 for USFS). Add 6–12 months to permit timeline. BLM/USFS coordinate with NEPA and Section 106.</p>
          </div>
        </div>

        <h3 className="mt-5 font-semibold">Worked Scenario: Route with Mixed Permitting</h3>
        <div className="rounded bg-white/5 p-3 mt-3 text-sm space-y-2">
          <p><strong>Project:</strong> 45-mile FTTH build, $3.2M, in rural Georgia. Route passes through: (1) USDA Rural county ROW; (2) a 200-ft wetland crossing via aerial span; (3) one historic district per county records.</p>
          <p><strong>NEPA:</strong> $3.2M &gt; $300K → Environmental Assessment required. RUS starts EA. If FONSI issued (likely), NEPA closed. Timeline: 60–90 days.</p>
          <p><strong>USACE NWP 57:</strong> 200-ft aerial wetland crossing → file NWP 57 pre-construction notification. Aerial span (no ground disturbance in wetland) usually qualifies. Timeline: 30–45 days for PCN response.</p>
          <p><strong>Section 106:</strong> RUS funding = federal nexus → SHPO consultation for the historic district crossing. Submit route map, Section 106 paperwork. SHPO may require archaeological survey of a small buffer. Timeline: 30–90 days.</p>
          <p><strong>Result:</strong> All three can be pursued in parallel. If submissions are coordinated, total permitting timeline is 90–120 days before construction can start. Missing any one of these at project start can delay construction by 3–6 months. Your job: identify all overlapping permits during preliminary design, not after staking.</p>
        </div>

        <h3 className="mt-5 font-semibold">Book vs. Field: Federal Permitting Reality</h3>
        <div className="rounded bg-amber-900/30 p-3 mt-3 text-sm">
          <p className="font-semibold text-amber-300">Book</p>
          <p className="text-slate-300/90 mt-1">NEPA → CE or EA. Section 106 → SHPO. Wetlands → NWP 57. BLM → ROW grant. Clear rules, defined procedures, predictable timelines per the CFR.</p>
        </div>
        <div className="rounded bg-green-900/30 p-3 mt-3 text-sm">
          <p className="font-semibold text-green-300">Field</p>
          <p className="text-slate-300/90 mt-1">SHPO finds an unrecorded archaeological site along the route → 30-day hold while a cultural resource specialist surveys a 500-ft buffer. USACE PCN reviewer asks for more detail on the aerial attachment → 2-week response window. BLM ROW office is short-staffed → 8-month queue for right-of-way review. None of these are exceptional — they're routine. The fix: start permitting before you finish staking. Experienced borrowers pre-screen the route using GIS layers (National Wetlands Inventory, SHPO GIS, BLM/USFS boundaries) before staking to identify triggers early.</p>
        </div>
      </section>

      <section className="mt-8 rounded-lg bg-slate-800/40 border border-slate-700 p-4">
        <h3 className="font-semibold text-slate-200">Tying It Together</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          In <strong>T09</strong> (Permitting) you learned general ROW and permit principles. This lesson adds the RUS-specific overlay: <em>RUS funding makes every permit a federal permit</em>.
          That means NEPA, Section 106, and USACE all activate automatically — even if the route never touches federal land.
          The NEPA Environmental Worksheet is the first action item after the loan is approved, not an afterthought.
          Section 106 is triggered by the federal funding, not the project's location — so even a route entirely on private/state ROW must go through SHPO consultation.
          NWP 57 only covers the wetland crossing itself; your OSP design must document exactly what enters and exits the wetland footprint.
          These permitting layers are why RUS projects take 18–36 months from loan application to construction: the environmental compliance pipeline is real, not bureaucratic noise. Plan for it early.
        </p>
      </section>

      <h3 className="mt-6 font-semibold">Lesson Quiz</h3>
      <Quiz
        questions={[
          {
            id: 'T20-L06-Q1',
            type: 'mc',
            prompt: 'RUS-funded projects trigger federal permitting because:',
            options: [
              { key: 'a', text: 'RUS is a private lender' },
              { key: 'b', text: 'Federal funding invokes federal environmental law (NEPA)' },
              { key: 'c', text: 'NESC requires it' },
              { key: 'd', text: 'State law mandates federal coordination' },
            ],
            correct: 'b',
          },
          {
            id: 'T20-L06-Q2',
            type: 'mc',
            prompt: 'What does USACE Nationwide Permit 57 authorize?',
            options: [
              { key: 'a', text: 'All federal land crossings' },
              { key: 'b', text: 'Electric utility and telecom activities in jurisdictional wetlands' },
              { key: 'c', text: 'Historic property preservation' },
              { key: 'd', text: 'Emergency response projects only' },
            ],
            correct: 'b',
          },
          {
            id: 'T20-L06-Q3',
            type: 'mc',
            prompt: 'An RUS project is under $300K, crosses no wetlands, and affects no historic properties. What NEPA review level likely applies?',
            options: [
              { key: 'a', text: 'Environmental Impact Statement (EIS) — highest tier, required for all federal funds' },
              { key: 'b', text: 'Environmental Assessment (EA) — mid-tier review for moderate impacts' },
              { key: 'c', text: 'Categorical Exclusion (CE) — no significant impact; minimal documentation required' },
              { key: 'd', text: 'No NEPA review needed because the project is under $1M' },
            ],
            correct: 'c',
          },
          {
            id: 'T20-L06-Q4',
            type: 'mc',
            prompt: 'Section 106 of the National Historic Preservation Act (54 USC 306108) requires consultation with which agency when a federally funded project may affect historic properties?',
            options: [
              { key: 'a', text: 'The Army Corps of Engineers (USACE)' },
              { key: 'b', text: 'The State Historic Preservation Office (SHPO)' },
              { key: 'c', text: 'The Bureau of Land Management (BLM)' },
              { key: 'd', text: 'The Environmental Protection Agency (EPA)' },
            ],
            correct: 'b',
          },
        ]}
      />
    </LessonLayout>
  );
}
