// T08.L01 — OTMR vs. Multi-Party — The FCC Rule
// Foundation lesson: One-Touch Make-Ready vs. multi-party coordination; when each applies
// Source: M02 §2.8 + M03 §3.7 (migrated + rewritten for T08 per-lesson format)
// FCC authority: 47 CFR §1.1411; FCC 18-111 (2018 One-Touch Make-Ready Order)

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T08.L01',
  course_id: 'T08',
  title: 'OTMR vs. Multi-Party — The FCC Rule',
  order: 1,
  lesson_type: 'foundation',
  prerequisites: ['T01.L01', 'T05.L01', 'T07.L01', 'T18.L01'],
  learning_objectives: [
    'Identify when One-Touch Make-Ready (OTMR) applies versus when multi-party coordination is required',
    'Explain the legal basis for OTMR under 47 CFR §1.1411 and FCC 18-111',
    'Distinguish between the book rule (unilateral right) and field practice (relationship-managed coordination)',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'OTMR',
    'multi-party make-ready',
    'FCC 18-111',
    '47 CFR §1.1411',
    'cable owner',
    'ILEC',
    'attachment applicant',
  ],
  key_terms: [
    {
      term: 'OTMR',
      definition:
        'One-Touch Make-Ready — the FCC rule (established by FCC Order 18-111, codified at 47 CFR §1.1411) that allows a fiber applicant to hire a single approved contractor to perform all make-ready work on a utility pole in one visit, without requiring each existing utility to send its own crew. OTMR applies only when the applicant owns the cable being installed.',
    },
    {
      term: 'multi-party make-ready',
      definition:
        'The traditional pole make-ready process in which each utility or cable company that has an attachment on a pole must send its own crew to move or adjust its own wires before a new attacher can install. Multi-party coordination is required when an existing attachment is owned by a utility (such as a power company or ILEC) whose cable cannot be moved by a third-party contractor without authorization.',
    },
    {
      term: 'FCC 18-111',
      definition:
        'The FCC order issued in 2018 (titled "Accelerating Wireline Broadband Deployment by Removing Barriers to Infrastructure Investment") that established the One-Touch Make-Ready framework. FCC 18-111 created the 15-day clock, the self-help remedy, and the distinction between simple and complex make-ready work.',
    },
    {
      term: '47 CFR §1.1411',
      definition:
        'Title 47 of the Code of Federal Regulations, Part 1, Section 1.1411 — the specific regulatory provision that codifies the OTMR process. It grants attachers the right to perform or contract out make-ready work without waiting for each pole owner or existing attacher to respond separately, subject to the cable-owner limitation for complex work.',
    },
    {
      term: 'cable owner',
      definition:
        'The entity whose name appears on the cable attachment agreement for a given wire on a utility pole. In OTMR, this status matters: if the existing cable at risk of movement is owned by a private telecommunications company (cable TV operator, fiber ISP), the OTMR applicant may relocate it. If the existing cable is owned by an ILEC or power utility, multi-party coordination is required for that specific cable.',
    },
    {
      term: 'ILEC',
      definition:
        'Incumbent Local Exchange Carrier — the established telephone company in a given area (historically the Bell Operating Companies, now AT&T, Lumen/CenturyLink, and regional telcos). ILECs hold attachment rights under a different regulatory framework than competitive carriers. Under OTMR, cables owned by an ILEC on a joint pole cannot be touched by the applicant\'s contractor without the ILEC\'s explicit consent.',
    },
    {
      term: 'attachment applicant',
      definition:
        'The entity (typically a fiber ISP or cable TV company) seeking to install a new cable on a utility pole already occupied by other parties. The attachment applicant triggers the make-ready process by submitting an attachment application to the pole owner.',
    },
  ],
  vocabulary_assumed: [
        { term: 'make-ready', source_lesson_id: 'T01.L05' },
    { term: 'pole owner', source_lesson_id: 'T05.L08' },
    { term: 'transfer', source_lesson_id: 'T07.L06' },
      ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export default function T08L01_OTMRvsMultiParty() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Before you can hang fiber on a pole, you often have to deal with whoever
          is already up there. Power company cables are near the top. Phone company
          cables are in the middle. Cable TV cables are below that. Your new fiber
          needs a spot too — and that means some existing wires might need to move first.
          Who moves them, and who pays, depends on a federal rule called{' '}
          <strong>One-Touch Make-Ready (OTMR)</strong>.
        </p>
        <p className="mt-2">
          OTMR is the FCC's way of saying: instead of waiting for five different
          utility companies to send five different crews on five different days, a fiber
          company can hire ONE approved contractor to handle all the adjustment work in
          a single pole visit. That one visit is the "one touch." The alternative — where
          each company sends their own crew — is <strong>multi-party make-ready</strong>,
          and it can take months longer.
        </p>
        <p className="mt-2">
          The catch? OTMR has rules. Not every wire on a pole can be moved by your
          contractor. And the FCC's rule book says when you get the fast path and when
          you don't.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
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
              <td className="px-3 py-2 font-mono">OTMR</td>
              <td className="px-3 py-2">One-Touch Make-Ready</td>
              <td className="px-3 py-2">One contractor, one pole visit, all adjustments done at once</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">FCC</td>
              <td className="px-3 py-2">Federal Communications Commission</td>
              <td className="px-3 py-2">The U.S. regulator of pole attachments and telecom access rights</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ILEC</td>
              <td className="px-3 py-2">Incumbent Local Exchange Carrier</td>
              <td className="px-3 py-2">The established phone company in your area (AT&T, Lumen, Frontier, etc.)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">CFR</td>
              <td className="px-3 py-2">Code of Federal Regulations</td>
              <td className="px-3 py-2">The published rulebook where FCC orders become enforceable law</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The two paths: OTMR vs. multi-party</h3>
        <p className="mt-2">
          Think of it like a house renovation. In multi-party make-ready, every trade
          (plumber, electrician, HVAC) shows up on their own schedule, and the whole
          project crawls because each trade waits on the previous one. In OTMR, you hire
          a general contractor who coordinates every trade in one day. Same result; much
          faster.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 border border-sky-400/30 bg-sky-400/5 rounded-lg">
            <p className="font-semibold text-sky-300 mb-2">OTMR (One-Touch Make-Ready)</p>
            <ul className="text-sm text-slate-300/90 space-y-1 list-disc pl-4">
              <li>Applicant hires ONE approved contractor</li>
              <li>Contractor performs ALL adjustments in one pole visit</li>
              <li>No waiting for each utility to send their own crew</li>
              <li>Applies when the cables being moved are owned by non-utility companies</li>
              <li>FCC authority: 47 CFR §1.1411; FCC 18-111 (2018)</li>
            </ul>
          </div>
          <div className="p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg">
            <p className="font-semibold text-amber-300 mb-2">Multi-Party Make-Ready</p>
            <ul className="text-sm text-slate-300/90 space-y-1 list-disc pl-4">
              <li>Each utility sends its OWN crew to adjust its own cable</li>
              <li>Pole owner coordinates scheduling between all parties</li>
              <li>Required when power company or ILEC cables must move</li>
              <li>Can take weeks to months vs. days for OTMR</li>
              <li>Cost responsibility varies by party</li>
            </ul>
          </div>
        </div>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T08-L01"
          cards={[
            {
              id: 'T08-L01-fc-otmr',
              front: 'What is OTMR (One-Touch Make-Ready)?',
              back: 'One-Touch Make-Ready — the FCC rule (established by FCC Order 18-111, codified at 47 CFR §1.1411) that allows a fiber applicant to hire a single approved contractor to perform all make-ready work on a utility pole in one visit, without requiring each existing utility to send its own crew. OTMR applies only when the applicant owns the cable being installed.',
            },
            {
              id: 'T08-L01-fc-multiparty',
              front: 'What is multi-party make-ready?',
              back: 'The traditional pole make-ready process in which each utility or cable company that has an attachment on a pole must send its own crew to move or adjust its own wires before a new attacher can install. Multi-party coordination is required when an existing attachment is owned by a utility (such as a power company or ILEC) whose cable cannot be moved by a third-party contractor without authorization.',
            },
            {
              id: 'T08-L01-fc-fcc18111',
              front: 'What is FCC 18-111?',
              back: 'The FCC order issued in 2018 (titled "Accelerating Wireline Broadband Deployment by Removing Barriers to Infrastructure Investment") that established the One-Touch Make-Ready framework. FCC 18-111 created the 15-day clock, the self-help remedy, and the distinction between simple and complex make-ready work.',
            },
            {
              id: 'T08-L01-fc-cfr1411',
              front: 'What does 47 CFR §1.1411 regulate?',
              back: 'Title 47 of the Code of Federal Regulations, Part 1, Section 1.1411 — the specific regulatory provision that codifies the OTMR process. It grants attachers the right to perform or contract out make-ready work without waiting for each pole owner or existing attacher to respond separately, subject to the cable-owner limitation for complex work.',
            },
            {
              id: 'T08-L01-fc-ilec',
              front: 'What is an ILEC and why does it matter for OTMR?',
              back: 'Incumbent Local Exchange Carrier — the established telephone company in a given area (historically the Bell Operating Companies, now AT&T, Lumen/CenturyLink, and regional telcos). ILECs hold attachment rights under a different regulatory framework than competitive carriers. Under OTMR, cables owned by an ILEC on a joint pole cannot be touched by the applicant\'s contractor without the ILEC\'s explicit consent.',
            },
            {
              id: 'T08-L01-fc-cableowner',
              front: 'What is a "cable owner" in the context of OTMR?',
              back: 'The entity whose name appears on the cable attachment agreement for a given wire on a utility pole. In OTMR, this status matters: if the existing cable at risk of movement is owned by a private telecommunications company (cable TV operator, fiber ISP), the OTMR applicant may relocate it. If the existing cable is owned by an ILEC or power utility, multi-party coordination is required for that specific cable.',
            },
            {
              id: 'T08-L01-fc-applicant',
              front: 'What is an attachment applicant?',
              back: 'The entity (typically a fiber ISP or cable TV company) seeking to install a new cable on a utility pole already occupied by other parties. The attachment applicant triggers the make-ready process by submitting an attachment application to the pole owner.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The FCC Rule in Detail</h2>

        <h3 className="mt-4 font-semibold">What FCC 18-111 actually says</h3>
        <p>
          In 2018, the FCC issued Order 18-111 to speed up broadband deployment by cutting
          the time it takes to get new fiber onto existing poles. The key legal provision is{' '}
          <strong>47 CFR §1.1411</strong>, which creates the OTMR right.
        </p>
        <p className="mt-2">
          Under §1.1411, an attachment applicant can hire a single contractor — approved and
          qualified to work near energized infrastructure — to make all necessary adjustments
          to telecom cables on a pole in one visit. The pole owner must grant access within
          15 business days of the application (more on that in T08.L02). If it doesn't, the
          applicant can do the work themselves and bill the pole owner.
        </p>

        <h3 className="mt-5 font-semibold">The cable-owner rule: when OTMR kicks in and when it doesn't</h3>
        <p>
          OTMR doesn't apply to every cable on the pole. The FCC draws a line based on WHO
          owns the existing cable:
        </p>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Existing cable on pole owned by…</th>
                <th className="px-3 py-2 text-left">Can OTMR contractor move it?</th>
                <th className="px-3 py-2 text-left">Why</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Private telecom or cable TV company</td>
                <td className="px-3 py-2 text-green-400 font-medium">Yes — OTMR applies</td>
                <td className="px-3 py-2">FCC 18-111 authorizes movement of privately-owned telecom cables by approved contractor</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">ILEC (AT&T, Lumen, Frontier, etc.)</td>
                <td className="px-3 py-2 text-amber-400 font-medium">No — multi-party required</td>
                <td className="px-3 py-2">ILECs hold different regulatory status; their cables require their own crew or explicit written consent</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Electric utility (power company)</td>
                <td className="px-3 py-2 text-red-400 font-medium">No — multi-party required</td>
                <td className="px-3 py-2">Energized power conductors cannot be moved by telecom contractors regardless of OTMR rules; NESC Rule 235 (communication-worker safety zone) + utility tariff governs</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Pole owner (same entity owns the pole and an attachment)</td>
                <td className="px-3 py-2 text-amber-400 font-medium">Depends on attachment type</td>
                <td className="px-3 py-2">If the pole owner's attachment is a power conductor: no. If telecom-only pole owner: negotiate case-by-case</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-sm text-slate-300/70">
          Source: 47 CFR §1.1411; FCC 18-111 (2018). The cable-owner determination is made
          at the time of the make-ready survey — the staker's report (from T07) documents who
          owns each attachment by looking at attachment agreements on record.
        </p>

        <h3 className="mt-5 font-semibold">A real scenario: three cables on one pole</h3>
        <p>
          Imagine a pole on a rural county road. From top to bottom:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Power company conductors</strong> at the top — owned by the electric
            cooperative that also owns the pole. These are energized. No OTMR contractor
            can touch them. Multi-party coordination required.
          </li>
          <li>
            <strong>AT&T copper drop wire</strong> in the comms space — owned by the ILEC.
            OTMR contractor cannot move this without AT&T's written consent. Multi-party
            coordination required for this cable.
          </li>
          <li>
            <strong>Cable TV coax</strong> — owned by a private cable company. The OTMR
            contractor CAN adjust this cable because it's privately owned telecom, not
            ILEC or power. No multi-party wait needed.
          </li>
        </ul>
        <p className="mt-2 text-sm">
          The result: your OTMR contractor moves the cable TV coax in the same visit. The
          AT&T copper and the power cables require separate coordination. The staker's make-ready
          report identifies all three and flags which need multi-party and which don't.
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-2">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book (47 CFR §1.1411):</strong> The OTMR rule gives applicants a unilateral
            right to proceed with make-ready work after the 15-day clock expires, using their
            own approved contractor. The pole owner's cooperation is not legally required for
            privately-owned telecom cables — the FCC gives the applicant the authority to act.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Experienced applicants almost never invoke the unilateral
            right without attempting to coordinate first. Relationships with pole owners matter
            for future projects, permit approvals, and access scheduling. If you go in unilaterally
            and something goes wrong (a cable is damaged, a customer loses service), the legal
            protection of OTMR may not fully cover the relationship damage. Most applicants use
            the 15-day clock as a negotiating lever, not an automatic trigger.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>The risk of mixing them:</strong> If a crew attempts to move an ILEC cable
            under the assumption that OTMR applies, and ILEC ownership is confirmed afterward,
            the applicant faces liability for unauthorized movement of another party's property.
            Ownership verification before ANY field move is mandatory.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">Why power companies can't use OTMR</h3>
        <p>
          A common misconception: "If OTMR is so efficient, why don't power utilities use
          it when they build new infrastructure?" The answer is that OTMR was written
          specifically for <em>telecom attachment applicants</em> adding new fiber to poles
          owned by utilities. Power companies generally own their own poles, so they don't
          need attachment rights — they're the pole owner. And energized power conductors are
          subject to NESC Rule 235 (communication-worker safety zone) and structural strength rules that require qualified utility linemen,
          not third-party telecom contractors, for any adjustment.
        </p>
        <p className="mt-2">
          The broader point: OTMR is an access rights regulation for competitive broadband
          deployment, not a general make-ready simplification. Its scope is narrow by design.
        </p>

        <h3 className="mt-5 font-semibold">State regulation and OTMR carve-outs</h3>
        <p>
          FCC pole-attachment rules apply in states where the FCC has jurisdiction — i.e.,
          states that have NOT established their own certified pole-attachment programs. As of
          2024, roughly 22 states have certified programs (California, Florida, New York, and
          others) under 47 U.S.C. §224(c). In those states, state PUC rules govern; OTMR may
          be available under state rule, modified, or not available at all.{' '}
          <em>[Verify current certified-state list with the FCC at time of project; the list changes.
          See 47 U.S.C. §224(c) for the certification framework.]</em>
        </p>
        <p className="mt-2">
          For RUS-financed projects, the RUS requirement that fiber be installed on
          efficient timelines creates additional incentive to invoke OTMR where available.
          RUS Bulletin 1751F-630 §8 addresses pole attachment coordination requirements for
          RUS-funded aerial projects. (Source: RUS 1751F-630 §8.)
        </p>
      </section>

      {/* ── BRANCHING SCENARIO ──────────────────────────────────────────── */}
      <BranchingScenario
        title="OTMR Decision: Can You Use One-Touch?"
        description="You're the project engineer on a rural fiber route. The staker just handed you the make-ready report. Walk through the decision."
        scenarioId="T08-L01-otmr-decision"
        initialNodeId="start"
        nodes={[
          {
            id: 'start',
            text: 'You need to move three cables on Pole 42 to make room for your new fiber cable. The staker\'s report shows: (1) Power company conductors at top. (2) AT&T copper at 22 ft. (3) Charter cable coax at 19 ft. Your design needs 18 ft 6 in. Which cables need to move?',
            choices: [
              { label: 'All three — every cable is in the way', nextId: 'all-three-wrong' },
              { label: 'Charter coax only — it\'s the only one in the way of 18 ft 6 in', nextId: 'charter-only-correct' },
              { label: 'Power company and AT&T — those are the critical ones', nextId: 'power-att-wrong' },
            ],
          },
          {
            id: 'all-three-wrong',
            text: 'Not quite. Power conductors at the top aren\'t in your way — they\'re above your attachment height. AT&T copper at 22 ft is also above you. Charter coax at 19 ft is 6 inches above your 18 ft 6 in design height — that\'s the one that needs to move. Try again.',
            isTerminal: false,
            choices: [
              { label: 'Go back and reconsider', nextId: 'start' },
            ],
          },
          {
            id: 'power-att-wrong',
            text: 'Power at the top and AT&T at 22 ft are both above your 18 ft 6 in design height. They don\'t need to move — they\'re already where they need to be. Charter coax at 19 ft is the only obstacle. Try again.',
            isTerminal: false,
            choices: [
              { label: 'Go back and reconsider', nextId: 'start' },
            ],
          },
          {
            id: 'charter-only-correct',
            text: 'Correct. Charter coax at 19 ft needs to move up by 6 inches (or more) to clear your 18 ft 6 in attachment. Now: Charter coax is owned by a private cable company. Can your OTMR contractor move it?',
            choices: [
              { label: 'Yes — private telecom cable is eligible for OTMR', nextId: 'otmr-yes-correct' },
              { label: 'No — you still need Charter\'s permission first', nextId: 'otmr-no-wrong' },
            ],
          },
          {
            id: 'otmr-no-wrong',
            text: 'Under 47 CFR §1.1411 (FCC 18-111), privately-owned telecom cables CAN be moved by your OTMR contractor without waiting for Charter to send their own crew. You don\'t need Charter\'s permission in advance — the FCC grants you that right. In practice you\'d notify Charter, but legally you\'re clear. Try again.',
            isTerminal: false,
            choices: [
              { label: 'Go back', nextId: 'charter-only-correct' },
            ],
          },
          {
            id: 'otmr-yes-correct',
            text: 'Correct. Your OTMR contractor can move the Charter coax. This job is OTMR-eligible for that cable. No multi-party coordination needed. Your contractor visits the pole once, moves Charter coax up 12 inches (to give margin), and installs your fiber bracket — all in one trip. You\'re done.',
            isTerminal: true,
            outcome: 'COMPLETED: OTMR applied correctly. Single contractor, one pole visit, no multi-party coordination delays. Outcome: project stays on schedule.',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T08.L01 Check — OTMR vs. Multi-Party"
        mode="multiple-choice"
        questions={[
          {
            id: 'T08-L01-Q1',
            type: 'mc',
            prompt:
              'A fiber ISP is attaching a new cable to a utility pole. An existing cable TV coax owned by a private cable company is 4 inches above the design height and needs to move. Which process applies?',
            choices: [
              'Multi-party make-ready — the cable company must send their own crew',
              'OTMR — an approved contractor can move the private telecom cable in one visit',
              'The FCC has no jurisdiction; this is a state PUC matter',
              'The fiber ISP must purchase the cable TV company\'s attachment rights before proceeding',
            ],
            answerIndex: 1,
            explanation:
              'Under 47 CFR §1.1411 and FCC Order 18-111, privately-owned telecom cables (cable TV coax, competitive ISP fiber) are eligible for OTMR. The fiber applicant\'s approved contractor can adjust the cable in a single pole visit without waiting for the cable company to dispatch its own crew.',
            citation: '47 CFR §1.1411; FCC 18-111 (2018).',
          },
          {
            id: 'T08-L01-Q2',
            type: 'mc',
            prompt:
              'An ILEC (AT&T) copper drop wire is 2 inches above the design height on a joint pole. The fiber applicant wants to use OTMR to move it. What is the correct action?',
            choices: [
              'Proceed with OTMR — ILEC cables are telecom and therefore OTMR-eligible',
              'Multi-party coordination required — ILEC cables cannot be moved by a third-party contractor without AT&T\'s explicit consent',
              'The pole owner (electric utility) decides whether OTMR or multi-party applies',
              'Invoke the 15-day self-help remedy and move it unilaterally after 15 days',
            ],
            answerIndex: 1,
            explanation:
              'ILECs hold a distinct regulatory status under 47 U.S.C. §224. Their cables cannot be moved by a third-party OTMR contractor without the ILEC\'s explicit written consent. Multi-party coordination is required — the applicant must request that AT&T send their own crew to adjust the copper drop, or negotiate consent in writing.',
            citation: '47 CFR §1.1411; FCC 18-111 (2018); 47 U.S.C. §224.',
          },
          {
            id: 'T08-L01-Q3',
            type: 'mc',
            prompt:
              'Which federal rule established the One-Touch Make-Ready (OTMR) framework for pole attachments?',
            choices: [
              'RUS Bulletin 1751F-630 §8',
              'NESC C2-2023 Rule 235',
              'FCC Order 18-111, codified at 47 CFR §1.1411',
              '47 CFR Part 68 — Terminal Equipment Registration',
            ],
            answerIndex: 2,
            explanation:
              'FCC Order 18-111 (issued 2018, "Accelerating Wireline Broadband Deployment") is the legal source of OTMR. The regulatory text is codified at 47 CFR §1.1411. RUS 1751F-630 §8 addresses pole coordination for RUS-funded projects but did not create OTMR. NESC Rule 235 governs the communication-worker safety zone near power conductors — a clearance/safety standard, not a make-ready access rule.',
            citation: 'FCC 18-111 (2018); 47 CFR §1.1411.',
          },
          {
            id: 'T08-L01-Q4',
            type: 'mc',
            prompt:
              'In field practice, most experienced fiber applicants use the 15-day OTMR clock primarily as:',
            choices: [
              'An automatic trigger to dispatch their contractor on Day 16 without coordination',
              'A negotiating lever — a deadline that motivates the pole owner to cooperate faster without requiring actual escalation',
              'A replacement for the attachment application process',
              'A formal signal to the AHJ that permits can be issued',
            ],
            answerIndex: 1,
            explanation:
              'While 47 CFR §1.1411 grants the unilateral right to proceed after 15 days, field practice is to use the deadline as a scheduling motivator. Most applicants prefer negotiated coordination to preserve the business relationship with the pole owner. Invoking the self-help remedy unilaterally is legal but relationship-costly — experienced engineers use it as a last resort, not a default.',
            citation: 'FCC 18-111 (2018); field practice per industry experience.',
            fieldNote:
              'This gap between the legal right and the field practice is the exact difference OTMR education must teach. The rule gives you a hammer; experienced engineers rarely need to swing it.',
          },
          {
            id: 'T08-L01-Q5',
            type: 'fill-in-blank',
            prompt:
              'The FCC regulation codifying the One-Touch Make-Ready right is ____ CFR §____.',
            answer: '47 CFR §1.1411',
            answerDisplay: '47 CFR §1.1411',
            explanation:
              '47 CFR §1.1411 is the specific CFR section that codifies OTMR rights. The "47" refers to Title 47 of the Code of Federal Regulations (Telecommunications). Part 1 contains FCC procedural rules; Section 1.1411 specifically covers the OTMR access right and the 15-day clock.',
          },
        ]}
      />


      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          The OTMR vs. multi-party choice is not just a process preference — it is a project scheduling decision that determines your construction start date. Under multi-party make-ready, each pole owner's crew performs their own rearrangement work on their own schedule; if a power company takes 80 days to transfer its lines instead of the 15-day OTMR clock covered in <strong>T08.L02</strong>, your construction mobilization slides by 65 days. That schedule impact flows directly into the project timeline you submitted with the RUS Form 740 staking notes from <strong>T07.L05</strong>, which estimated the make-ready completion date the client used to schedule their construction crew. The pole anatomy knowledge from <strong>T01.L02</strong> is what allows the attaching entity to scope and price an OTMR contractor's work: knowing the communication space location, existing attachment heights, and NESC clearance rules from <strong>T05</strong> enables a realistic work order before the clock expires. When OTMR is elected and a utility owner exceeds the 15-day clock, the attaching entity can hire a qualified contractor to do the work at the pole owner's expense — but only if the OTMR election was properly documented in the original application.
        </p>
        <p className="text-slate-200 mt-3 text-sm italic">
          OTMR was created specifically to give attaching entities a tool to enforce timely make-ready — understanding when to elect it versus accepting multi-party pace is one of the highest-leverage schedule decisions in an OSP project.
        </p>
      </section>
    </LessonLayout>
  );
}
