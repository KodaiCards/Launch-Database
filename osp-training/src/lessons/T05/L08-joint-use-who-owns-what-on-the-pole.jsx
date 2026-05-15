// Net-new (migrated from Module02 §2.6, expanded) — T05.L08 Joint Use — Who Owns What on the Pole
// Working lesson: pole attachment framework, ILA, overlashing rights, FCC 47 CFR Part 1 Subpart J

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T05.L08',
  course_id: 'T05',
  title: 'Joint Use — Who Owns What on the Pole',
  order: 8,
  lesson_type: 'working',
  prerequisites: ['T05.L02', 'T05.L03'],
  learning_objectives: [
    'Explain the joint-use model and why multiple utilities share the same poles',
    'Describe the role of an Interagency Licensing Agreement (ILA) in governing pole attachments',
    'Explain what overlashing is, who controls it, and the FCC notice requirements',
    'Walk through the sequence of steps required to attach to a pole your company does not own',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'joint use',
    'pole owner',
    'attacher',
    'ILA (pole attachment agreement)',
    'overlashing',
    'attachment fee',
    'CATV',
    'CLEC',
    'ILEC',
  ],
  vocabulary_assumed: [
    { term: 'NESC', source_lesson_id: 'T05.L01' },
    { term: 'supply space', source_lesson_id: 'T01.L02' },
    { term: 'communication space', source_lesson_id: 'T01.L02' },
    { term: 'Rule 232', source_lesson_id: 'T05.L02' },
    { term: 'Rule 235', source_lesson_id: 'T05.L03' },
    { term: 'communication worker safety zone', source_lesson_id: 'T05.L03' },
    { term: 'messenger', source_lesson_id: 'T03.L04' },
    { term: 'attachment', source_lesson_id: 'T01.L01' },
    { term: 'span', source_lesson_id: 'T01.L01' },
  ],
  key_terms: [
    {
      term: 'joint use',
      definition:
        'The shared use of a utility pole by two or more entities — most commonly an electric utility that owns the pole and a telecommunications company (cable TV provider or fiber ISP) that attaches to it. Joint use is the normal operating arrangement for aerial OSP in developed areas. The rules governing who can attach what, where, and for how much are set by the pole owner\'s tariff and governed by federal regulations (47 CFR Part 1, Subpart J) for telecommunications attachers.',
    },
    {
      term: 'pole owner',
      definition:
        'The utility or municipality that physically owns the poles in a corridor. Most poles in the US are owned by the local electric utility or telephone company. The pole owner sets attachment rates (within FCC limits), approves or denies attachment applications, and performs or coordinates make-ready. The pole owner is also responsible for the structural integrity of the pole itself.',
    },
    {
      term: 'attacher',
      definition:
        'Any entity that places a cable, equipment, or hardware on a pole it does not own. Common attachers: cable TV providers (CATV), fiber internet providers (ISPs/CLECs), telephone companies (ILECs), and municipal networks. Attachers must have an executed attachment agreement with the pole owner before placing any hardware.',
    },
    {
      term: 'ILA (pole attachment agreement)',
      definition:
        'Interagency Licensing Agreement — the contract between a pole owner and an attacher that governs attachment rates, terms, make-ready cost responsibility, engineering requirements, and liability. An ILA (sometimes called a "joint-use agreement" or "pole attachment agreement") must be fully executed before the attacher can begin work on the poles. The FCC regulates the maximum rates a pole owner can charge; the ILA captures the specific negotiated terms within those limits.',
    },
    {
      term: 'overlashing',
      definition:
        'The practice of lashing an additional cable to an existing attacher\'s already-installed messenger or cable without establishing a new independent attachment point on the pole. The overlashing company rides on the existing attacher\'s messenger. Per FCC rules, pole owners must allow overlashing; the overlasher must provide advance notice (typically ≤ 15 days) and is responsible for ensuring their overlash meets safety and engineering requirements.',
    },
    {
      term: 'attachment fee',
      definition:
        'The annual per-pole fee an attacher pays the pole owner for the right to occupy space on the pole. FCC rules at 47 CFR Part 1, Subpart J set the maximum rates a regulated pole owner can charge for telecommunications attachments. Rates vary by attacher type: telecom attachers typically pay a lower rate than cable TV attachers under the "fully allocated cost" vs. "telecom formula" distinction.',
    },
    {
      term: 'CATV',
      definition:
        'Cable Television — a common type of attacher on joint-use poles. Originally built for one-way video distribution, CATV systems now carry broadband internet and phone services. CATV attachers pay attachment fees under the FCC cable formula, which is typically higher than the telecom formula.',
    },
    {
      term: 'CLEC',
      definition:
        'Competitive Local Exchange Carrier — a telephone company that competes with the incumbent local telephone company in a given area. CLECs (including fiber ISPs operating as CLECs) may be entitled to lower FCC-regulated attachment rates than CATV providers. The CLEC designation matters for determining which FCC attachment rate formula applies.',
    },
    {
      term: 'ILEC',
      definition:
        'Incumbent Local Exchange Carrier — the original local telephone company in a given area (typically AT&T, CenturyLink/Lumen, Frontier, or a rural RLEC). ILECs often own poles in areas where the telephone company built before the electric utility. When the ILEC owns the pole, the electric utility becomes the attacher.',
    },
  ],
};

export const key_terms = meta.key_terms;

export default function T05L08_JointUseWhoOwnsWhatOnThePole() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Picture a wooden pole on a residential street. At the top is the electric
          utility's distribution line — the wires that power everyone's houses.
          Just below the wire is the neutral conductor (the grounded return wire).
          Below the neutral, in the communication space, you might see the telephone
          company's aerial drop cable, the cable TV provider's coax, and maybe a
          fiber ISP's 12-fiber lashed build. Three separate companies, one pole.
        </p>
        <p className="mt-2">
          That's <strong>joint use</strong> — the sharing of a pole among multiple
          utilities. It's the normal model for aerial OSP in most of the US.
          Without joint use, every telecom company would need its own poles, which
          is enormously expensive and visually a disaster.
        </p>
        <p className="mt-2">
          The catch is that each attacher — every company hanging hardware on a pole
          it doesn't own — has to play by the pole owner's rules. Before a single
          strand of wire goes up, you need a signed agreement, an approved engineering
          plan, and a completed make-ready inspection. This lesson covers who owns what,
          how those agreements work, and the basic sequence for getting on a pole.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full form</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">ILA</td>
              <td className="px-3 py-2">Interagency Licensing Agreement</td>
              <td className="px-3 py-2">The contract between pole owner and attacher; must be signed before any work</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">CATV</td>
              <td className="px-3 py-2">Cable Television</td>
              <td className="px-3 py-2">Traditional cable company; now also internet and voice services</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">CLEC</td>
              <td className="px-3 py-2">Competitive Local Exchange Carrier</td>
              <td className="px-3 py-2">Competitive telephone/fiber company; typically lower FCC attachment rate</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">ILEC</td>
              <td className="px-3 py-2">Incumbent Local Exchange Carrier</td>
              <td className="px-3 py-2">The original local telephone company; often owns poles in some areas</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">47 CFR</td>
              <td className="px-3 py-2">Title 47, Code of Federal Regulations</td>
              <td className="px-3 py-2">FCC's regulatory rules; Part 1 Subpart J covers pole attachment rates and access</td>
            </tr>
          </tbody>
        </table>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T05-L08"
          cards={[
            {
              id: 'T05-L08-fc-joint-use',
              front: 'What is joint use and why does it exist?',
              back: 'Joint use is the shared use of a pole by two or more entities — typically the pole owner (electric utility or telephone company) and one or more attachers (cable TV, fiber ISP, CLEC). It exists because building separate pole lines for every utility would be prohibitively expensive. Federal law (47 CFR Part 1, Subpart J) requires regulated pole owners to provide reasonable access to telecommunications attachers.',
            },
            {
              id: 'T05-L08-fc-ila',
              front: 'What is an ILA (pole attachment agreement) and when must it be signed?',
              back: 'An ILA (Interagency Licensing Agreement) is the contract between the pole owner and an attacher that governs attachment rates, make-ready terms, engineering requirements, and liability. It MUST be fully executed before the attacher places any hardware on the poles. Working without a signed ILA is a contract violation and may constitute unauthorized trespass.',
            },
            {
              id: 'T05-L08-fc-overlashing',
              front: 'What is overlashing and who controls it?',
              back: 'Overlashing means lashing your cable to an existing attacher\'s already-installed messenger — you ride on their strand without needing a new pole attachment. FCC rules require pole owners to allow overlashing. The overlasher must give advance notice (≤ 15 days) and is responsible for ensuring their work meets safety and engineering requirements. The existing attacher does not have veto power over overlashing.',
            },
            {
              id: 'T05-L08-fc-catv-clec',
              front: 'What is the practical difference between a CATV and a CLEC attacher for attachment fees?',
              back: 'CATV (cable TV) attachers pay under the FCC "cable formula," which allocates more pole cost to the cable attacher. CLEC (telephone/fiber) attachers pay under the FCC "telecom formula," which typically results in a lower annual per-pole fee. The distinction matters when negotiating attachment agreements — a fiber ISP organized as a CLEC may pay significantly less per pole than one organized as a CATV provider.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The Zones on a Joint-Use Pole</h2>
        <p>
          You learned in T01 and T05.L03 that a pole has defined vertical zones.
          Here's how those zones translate to joint-use ownership:
        </p>

        <AnnotatedDiagram
          src="/training/diagrams/joint-use-pole-zones.svg"
          alt="Cross-section of a joint-use pole showing supply space, neutral, climbing space (safety zone), and communication space with example attachers"
          hotPoints={[
            {
              x: 50,
              y: 8,
              label: 'Supply space',
              explanation: 'Electric utility\'s distribution conductors (typically 4–35 kV). Owned and maintained by the pole owner (electric company). No other attacher goes here. Workers must de-energize or maintain minimum approach distance (MAD) — covered in T18.',
            },
            {
              x: 50,
              y: 25,
              label: 'Neutral conductor',
              explanation: 'The grounded return wire of the distribution circuit. Marks the boundary between supply space (above) and the communication worker safety zone (below). Many NESC separation requirements measure from this neutral.',
            },
            {
              x: 50,
              y: 38,
              label: 'Communication worker safety zone (40 in. at pole)',
              explanation: 'The 40-inch clear zone below the neutral (for < 8.7 kV supply per NESC Table 235-5). No attacher can place hardware here — this is the buffer zone that protects communication workers from contact with energized supply conductors. Verified by secondary sources (ikeGPS, We-Energies). Confirm from NESC C2-2023 [confirm edition] for your design.',
            },
            {
              x: 50,
              y: 55,
              label: 'Communication space',
              explanation: 'The zone where telephone, cable TV, and fiber attachers place their cables. Governed by the ILA and by NESC Rule 235. Multiple attachers share this space — their relative positions are negotiated and approved by the pole owner\'s make-ready engineer.',
            },
            {
              x: 50,
              y: 72,
              label: 'Lowest attacher (fiber ISP, example)',
              explanation: 'A new fiber ISP attaching to poles already carrying telephone and cable TV cables may be placed below the existing attachers. The specific position requires pole owner approval and make-ready engineering. The lowest practical attachment height is constrained by NESC Rule 232 clearance requirements — the cable must still clear the ground, road, or crossing below.',
            },
          ]}
        />

        <h3 className="mt-6 font-semibold">The sequence for attaching to a pole you don't own</h3>
        <p className="mt-2">
          This is the standard workflow. Skipping any step can result in denied
          attachment rights, forced removal of installed cable, or legal liability.
        </p>

        <ol className="list-decimal pl-5 space-y-4 mt-3">
          <li>
            <strong>Execute an ILA.</strong> Before any engineering, survey, or construction,
            your company must have a signed ILA with the pole owner. If your company has
            an existing ILA (e.g., you've attached before in this territory), verify
            it covers the new corridor. If not, start the ILA negotiation process — it
            can take weeks to months.
          </li>
          <li>
            <strong>Field survey + attachment application.</strong> Walk the proposed route,
            identify every pole, record the existing occupants, measure attachment heights,
            and photograph violations or conflicts. Submit an attachment application to
            the pole owner with your proposed design (attachment height, cable diameter,
            strand size, and span layouts). Some pole owners use online portals (Alden,
            Osmose, Utility Cloud); others accept paper applications.
          </li>
          <li>
            <strong>Pole owner's engineering review + make-ready estimate.</strong>
            The pole owner's engineer (or their contractor) reviews your application,
            checks NESC clearances, and determines what make-ready is needed.
            They issue a make-ready cost estimate. You have a defined window to accept
            or reject the estimate.
          </li>
          <li>
            <strong>Accept estimate and pay make-ready deposit.</strong>
            If you accept, you pay the estimated make-ready cost (or your contractor
            performs the make-ready under OTMR rules — covered in T05.L09).
            Make-ready can include transferring existing attachers, re-framing cables,
            or replacing poles.
          </li>
          <li>
            <strong>Receive permit to attach.</strong>
            After make-ready is complete and verified, the pole owner issues a permit
            (sometimes called a "P&A" or "Permit to Attach"). Now you can string your cable.
          </li>
          <li>
            <strong>Install and notify.</strong>
            Install your cable, complete as-built documentation, and notify the pole owner.
            They may conduct a post-attachment inspection to verify clearances and
            placement comply with the approved design.
          </li>
          <li>
            <strong>Pay annual attachment fees.</strong>
            Once attached, you owe an annual per-pole fee under the ILA.
            FCC-regulated rates (47 CFR Part 1, Subpart J) cap what the pole owner
            can charge. Rates vary by attacher type (CATV vs. CLEC formula).
          </li>
        </ol>

        <h3 className="mt-6 font-semibold">Overlashing — a faster path when a messenger already exists</h3>
        <p className="mt-2">
          If another attacher already has a messenger on the poles in your corridor,
          you may be able to <strong>overlash</strong> — lash your cable directly to
          their existing messenger — instead of establishing your own attachment point.
          This avoids the attachment fee for an independent attachment and can
          dramatically simplify the permitting process.
        </p>

        <div className="rounded-lg bg-black/30 border border-white/10 p-4 my-4">
          <p className="font-semibold text-slate-200 mb-2">FCC overlashing rules (47 CFR § 1.1406)</p>
          <ul className="text-sm space-y-2 text-slate-300">
            <li><strong>Pole owner must allow it.</strong> A regulated pole owner cannot refuse overlashing without a specific engineering or safety reason documented in writing.</li>
            <li><strong>Advance notice required.</strong> The overlasher must give notice to both the pole owner and the existing attacher (whose messenger they'll ride). Typically ≤ 15 days advance notice, though the ILA or state PUC rules may set different timelines.</li>
            <li><strong>Overlasher is responsible for their work.</strong> The overlashing company must ensure its cables meet all NESC clearance and safety requirements. If the overlash increases load on the existing messenger beyond its rated capacity, the overlasher is responsible for addressing that engineering problem.</li>
            <li><strong>The existing attacher cannot veto overlashing.</strong> The attacher whose messenger is being used doesn't have approval rights over the overlash — only the pole owner does.</li>
          </ul>
        </div>

        <div className="rounded-lg bg-amber-900/20 border border-amber-700/30 p-4 my-4">
          <p className="font-semibold text-amber-300 mb-1">Book vs. field practice — overlashing</p>
          <p className="text-sm text-slate-300">
            <strong>By the book (FCC / 47 CFR):</strong> Pole owner must allow overlashing;
            15-day advance notice is the standard; existing attacher has no veto.
          </p>
          <p className="text-sm text-slate-300 mt-2">
            <strong>In the field:</strong> Pole owners sometimes slow-walk overlash approvals
            by claiming engineering review is needed, even for lightweight fiber overlashes
            that clearly don't threaten the existing messenger. Some existing attachers
            informally pressure the overlasher to pay them a "coordination fee" — which
            has no legal basis but does happen in practice. Your legal team needs to know
            about your state's PUC rules on overlashing, which may add additional
            protections beyond the FCC baseline.
          </p>
          <p className="text-sm text-slate-300 mt-2">
            <strong>Why this matters:</strong> A project manager who doesn't know the FCC
            rules may accept delays or "fees" that are legally unfounded. Know the rules
            before the negotiation starts.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>FCC Attachment Rate Formulas — Why They Matter</h2>
        <p>
          The FCC sets maximum annual per-pole rates that regulated pole owners can charge.
          Two formulas apply depending on the attacher's classification:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Cable (CATV) formula:</strong> Allocates a larger share of pole ownership
            costs to the cable attacher. Historically resulted in higher annual rates
            (roughly $5–$10 per pole per year in many markets, though exact values vary
            significantly by region and negotiation).
          </li>
          <li>
            <strong>Telecom (CLEC) formula:</strong> Allocates a smaller share of costs.
            Resulted from the Telecommunications Act of 1996's policy that lower attachment
            rates would encourage competitive entry. Typically lower than the cable formula.
          </li>
          <li>
            <strong>RDOF / BEAD grant program context:</strong> Some grant programs
            specify whether the grantee must secure attachment agreements at regulated
            FCC rates. If your build is funded by federal broadband programs, the
            ILA negotiation is part of the project budget and schedule.
          </li>
        </ul>
        <p className="mt-3 text-sm text-slate-300/80">
          The specific current FCC rate formulas are defined in 47 CFR § 1.1409 and
          associated FCC orders. Rate calculations require the pole owner's financials
          and are typically handled by your legal or regulatory team — not computed
          by the OSP designer. The designer's job is to make sure the engineering
          application is accurate and complete so the pole owner can't reject it
          on technical grounds.
        </p>
      </section>

      {/* ── BRANCHING SCENARIO ──────────────────────────────────────────── */}
      <BranchingScenario
        scenarioId="T05-L08-scenario-1"
        title="Getting on a New Pole — Joint-Use Walkthrough"
        startNodeId="start"
        nodes={{
          start: {
            id: 'start',
            text: 'Your company won a BEAD grant to build aerial fiber on a 12-mile rural route. The poles are owned by the local electric utility. Your company has no existing ILA with this utility. What is your first step?',
            choices: [
              { label: 'Begin the field survey and record every pole along the route', nextId: 'wrong-survey-first' },
              { label: 'Start the ILA negotiation process with the pole owner', nextId: 'correct-ila' },
              { label: 'Contact an overlashing vendor since there may be existing telephone cables', nextId: 'wrong-overlash-first' },
              { label: 'Submit an attachment application directly to the FCC', nextId: 'wrong-fcc' },
            ],
          },
          'wrong-survey-first': {
            id: 'wrong-survey-first',
            text: 'Field surveys are valuable — you\'ll need that data for the application. But without an executed ILA, you\'re spending engineering dollars before you have the legal right to attach. The pole owner may also refuse to process your application until the ILA is in place. Return to the beginning and reconsider.',
            choices: [{ label: 'Try again', nextId: 'start' }],
          },
          'correct-ila': {
            id: 'correct-ila',
            text: 'Correct — the ILA comes first. While the ILA negotiation is underway (it can take weeks to months), you can run the field survey in parallel so you\'re ready to file the attachment application the moment the ILA is signed. The ILA is the legal foundation for everything else. \n\nNow the ILA is signed. What comes next?',
            choices: [
              { label: 'Submit the attachment application with your design and field survey data', nextId: 'correct-application' },
              { label: 'Begin stringing fiber — you have the ILA, that\'s enough', nextId: 'wrong-no-permit' },
            ],
          },
          'wrong-overlash-first': {
            id: 'wrong-overlash-first',
            text: 'Good instinct — overlashing is worth investigating. But you still need an ILA with the pole owner before any work. And if the existing telephone cables are on an ILEC messenger, you\'d need to give the proper advance notice. You can\'t skip the ILA step. Go back and start correctly.',
            choices: [{ label: 'Try again', nextId: 'start' }],
          },
          'wrong-fcc': {
            id: 'wrong-fcc',
            text: 'The FCC sets the rules and maximum rates, but it doesn\'t process individual attachment applications. Those go directly to the pole owner. The FCC is the backstop if the pole owner acts unreasonably — but the normal path is through the pole owner directly.',
            choices: [{ label: 'Try again', nextId: 'start' }],
          },
          'correct-application': {
            id: 'correct-application',
            text: 'Exactly right. You submit the attachment application — pole-by-pole survey data, proposed attachment heights, cable specs (OD, weight per foot, strand size), span layout. The pole owner\'s engineer reviews it and returns a make-ready cost estimate. \n\nThe make-ready estimate comes back. Six poles require transfers; two poles require replacement. Total estimate: $18,000. What do you do?',
            choices: [
              { label: 'Reject the estimate — too expensive, find a different route', nextId: 'route-change' },
              { label: 'Accept the estimate and pay the make-ready deposit to proceed', nextId: 'correct-accept' },
              { label: 'Begin construction — you can do the make-ready yourself without paying', nextId: 'wrong-diy' },
            ],
          },
          'wrong-no-permit': {
            id: 'wrong-no-permit',
            text: 'The ILA gives you the legal right to attach — but not the engineering approval for a specific location. You still need the attachment application, the pole owner\'s make-ready review, and a permit to attach (P&A) before stringing cable. Installing without a P&A can result in forced removal and breach of the ILA.',
            choices: [{ label: 'Back up', nextId: 'correct-ila' }],
          },
          'route-change': {
            id: 'route-change',
            text: 'Possible — if the make-ready cost makes the route uneconomical, you may redesign to use alternative infrastructure (existing ILEC conduit, buried route, different poles). But this means restarting the attachment application for the new path. Make-ready costs are often the biggest variable in aerial build budgets — smart designers investigate make-ready potential before locking in the route design.',
            choices: [{ label: 'See what happens if you accept and proceed', nextId: 'correct-accept' }],
          },
          'correct-accept': {
            id: 'correct-accept',
            text: 'You accept the estimate and pay the deposit. The pole owner coordinates make-ready, which takes 6 weeks. After make-ready is verified complete, the pole owner issues your Permit to Attach (P&A). Now you can string your fiber. \n\nYou complete the installation. What is the final step before the route is fully handed off?',
            choices: [
              { label: 'Complete as-built documentation and notify the pole owner', nextId: 'correct-finish' },
              { label: 'Nothing — installation complete means you\'re done', nextId: 'wrong-no-notify' },
            ],
          },
          'wrong-diy': {
            id: 'wrong-diy',
            text: 'Not without the pole owner\'s approval. Standard multi-party make-ready requires the pole owner (or their approved contractors) to perform the work. OTMR (covered in T05.L09) lets you use your own contractor for simple comm-space make-ready, but only after a specific application and notice process. And OTMR doesn\'t apply to pole replacements.',
            choices: [{ label: 'Back up', nextId: 'correct-application' }],
          },
          'correct-finish': {
            id: 'correct-finish',
            text: 'Correct. As-built documentation (pole-by-pole attachment heights, cable placement, hardware photographs) goes to the pole owner. They may inspect your installation for clearance compliance. Once accepted, you begin paying annual attachment fees under the ILA. The route is fully operational and compliant.\n\nYou successfully navigated the full joint-use attachment workflow.',
            choices: [],
          },
          'wrong-no-notify': {
            id: 'wrong-no-notify',
            text: 'The pole owner needs to know where you\'ve placed hardware on their poles — for liability, for future make-ready coordination, and per the terms of your ILA. As-built documentation is a contractual requirement in virtually every ILA. Skipping this step can result in ILA breach.',
            choices: [{ label: 'Complete the workflow correctly', nextId: 'correct-finish' }],
          },
        }}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T05.L08 Check — Joint Use & Pole Attachment"
        mode="multiple-choice"
        questions={[
          {
            id: 'T05-L08-Q1',
            type: 'mc',
            prompt:
              'Which federal regulation governs the rates and access rules for telecommunications attachers on poles owned by regulated utilities?',
            choices: [
              'NESC C2-2023 Rule 261',
              '47 CFR Part 1, Subpart J',
              'RUS Bulletin 1751F-630',
              'ANSI O5.1-2022',
            ],
            answerIndex: 1,
            explanation:
              '47 CFR Part 1, Subpart J contains the FCC\'s pole attachment rules — including rate caps, access requirements, make-ready timelines, and overlashing rights. NESC covers structural design. RUS 1751F-630 covers rural aerial construction. ANSI O5.1 covers wood pole specifications.',
          },
          {
            id: 'T05-L08-Q2',
            type: 'mc',
            prompt:
              'Your company wants to add a 12-fiber cable to a route where an existing telephone company already has a messenger on the poles. What attachment approach could save money by avoiding a full attachment application for each pole?',
            choices: [
              'Apply for a CLEC license from the FCC',
              'Overlash your cable to the existing telephone company\'s messenger',
              'File an ILA with the FCC instead of the pole owner',
              'Install at ground level to avoid the pole entirely',
            ],
            answerIndex: 1,
            explanation:
              'Overlashing — lashing your new cable to the existing messenger — avoids establishing a new independent attachment point and can reduce or eliminate per-pole attachment fees. The pole owner must allow it; you give the required advance notice; you\'re responsible for ensuring your overlash doesn\'t overload the existing strand.',
          },
          {
            id: 'T05-L08-Q3',
            type: 'mc',
            prompt:
              'In the standard joint-use attachment sequence, what is the correct order of the first three major steps?',
            choices: [
              'Field survey → Submit attachment application → Execute ILA',
              'Execute ILA → Field survey + Submit attachment application → Receive make-ready estimate',
              'Pay attachment fees → Execute ILA → Begin installation',
              'Submit application to FCC → Receive FCC approval → Begin construction',
            ],
            answerIndex: 1,
            explanation:
              'The ILA (legal right to attach) must come first. Once the ILA is signed, the field survey and attachment application go to the pole owner\'s engineer. The engineer returns a make-ready estimate. You then accept, pay, and wait for make-ready completion before receiving the Permit to Attach.',
          },
          {
            id: 'T05-L08-Q4',
            type: 'mc',
            prompt:
              'An existing CATV attacher on a pole corridor objects to your plan to overlash a 12-fiber cable to their messenger. They say you need their written approval before proceeding. Is this correct?',
            choices: [
              'Yes — the existing attacher has veto rights over their messenger',
              'No — only the pole owner can approve or deny overlashing; the existing attacher has no veto',
              'Yes — you need both the pole owner\'s approval and the existing attacher\'s approval',
              'Only if your overlash adds more than 10% additional weight to the messenger',
            ],
            answerIndex: 1,
            explanation:
              'Per 47 CFR § 1.1406 and FCC rules, the existing attacher has no veto over overlashing. The pole owner must allow overlashing; you give the required advance notice to both the pole owner and the existing attacher; but the existing attacher cannot block your overlash. They can raise engineering concerns through the pole owner\'s review process, but cannot simply refuse.',
          },
          {
            id: 'T05-L08-Q5',
            type: 'drag-match',
            prompt: 'Match each term to its correct description.',
            pairs: [
              { left: 'ILA', right: 'Signed contract between pole owner and attacher that must exist before any work' },
              { left: 'CLEC', right: 'Competitive telephone company; typically pays lower FCC attachment rate formula' },
              { left: 'Overlashing', right: 'Lashing new cable to an existing attacher\'s messenger without a new pole attachment' },
              { left: 'Pole owner', right: 'Entity that owns the poles, approves applications, and receives attachment fees' },
            ],
          },
        ]}
      />

    </LessonLayout>
  );
}
