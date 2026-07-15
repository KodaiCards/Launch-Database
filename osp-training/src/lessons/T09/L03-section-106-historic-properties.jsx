// T09.L03 — Section 106 — Historic Properties
// Working lesson: NHPA §106 consultation process, SHPO, APE, 30-day clock, adverse effect
// Source: M03 §3.3 (Section 106, SHPO, 30-day clock)
// Authority: 54 USC §306108 (NHPA §106); 36 CFR Part 800 (ACHP §106 regulations)

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import ReferencesBlock from '../../components/ReferencesBlock.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import GatedAssessment from '../../components/primitives/GatedAssessment.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T09.L03',
  course_id: 'T09',
  title: 'Section 106 — Historic Properties',
  order: 3,
  lesson_type: 'working',
  prerequisites: ['T09.L01', 'T09.L02'],
  learning_objectives: [
    'Sequence the Section 106 consultation steps in order',
    'Explain when the 30-day SHPO clock starts — on receipt of an adequate package, not submission date',
    'Identify what triggers an adverse-effect finding and the options available when adverse effect is found',
  ],
  estimated_minutes: 30,
  vocabulary_introduced: [
    'NHPA §106',
    'SHPO',
    'APE (Area of Potential Effect)',
    'finding of effect',
    '30-day clock',
    'consulting party',
    'program comment',
  ],
  key_terms: [
    {
      term: 'NHPA §106',
      definition:
        'Section 106 of the National Historic Preservation Act — codified at 54 USC §306108 — requires federal agencies to take into account the effects of their undertakings on historic properties, and afford the Advisory Council on Historic Preservation (ACHP) a reasonable opportunity to comment. For fiber projects with a federal nexus, Section 106 applies whenever the project area may contain historic properties.',
    },
    {
      term: 'SHPO',
      definition:
        'State Historic Preservation Officer — the state official designated under the NHPA to administer the state historic preservation program. In the Section 106 process, the SHPO is the primary consulting party. The federal agency sends the initiation package to the SHPO, and the SHPO has 30 days to respond after receiving an adequate package. SHPO contact information is maintained by the National Conference of State Historic Preservation Officers (NCSHPO).',
    },
    {
      term: 'APE (Area of Potential Effect)',
      definition:
        'The geographic area or areas within which an undertaking may directly or indirectly cause alterations in the character or use of historic properties. For aerial fiber, the APE typically includes the pole-line corridor plus a defined buffer (often 0.5–1 mile on each side for visual effects of new aerial infrastructure). For buried fiber, the APE is generally the trench footprint plus a minimal buffer for ground disturbance vibration.',
    },
    {
      term: 'finding of effect',
      definition:
        'The federal agency\'s determination of how the undertaking affects historic properties. The three possible findings are: (1) No historic properties affected — no historic properties in the APE or no effect; (2) No adverse effect — historic properties present but no adverse effect; (3) Adverse effect — the undertaking will diminish the integrity, location, design, setting, materials, workmanship, feeling, or association of a historic property.',
    },
    {
      term: '30-day clock',
      definition:
        'The period within which the SHPO must respond to a Section 106 initiation package. The clock starts when the SHPO RECEIVES an adequate package — not when the applicant submits. An incomplete package (missing APE map, missing photo log, missing prior-records search) will be returned by the SHPO and the clock does not start until resubmission and acceptance of the corrected package.',
    },
    {
      term: 'consulting party',
      definition:
        'An individual or organization with a demonstrated interest in or legal standing related to the undertaking\'s effects on historic properties. Consulting parties in a Section 106 review may include: the SHPO, Tribal Historic Preservation Officers (THPOs) for properties of tribal significance, local governments, and organizations with a documented interest in the historic property at issue. The federal agency identifies and invites consulting parties at the outset of the §106 process.',
    },
    {
      term: 'program comment',
      definition:
        'An alternative to project-by-project Section 106 review issued by the ACHP (Advisory Council on Historic Preservation). A program comment allows a federal agency to address the effects of a program (such as a statewide broadband deployment) on historic properties through a single programmatic document rather than individual project-by-project consultations. Using a program comment significantly reduces per-project Section 106 burden but requires upfront coordination with ACHP.',
    },
  ],
  vocabulary_assumed: [
    { term: 'federal nexus', source_lesson_id: 'T09.L01' },
    { term: 'BEAD', source_lesson_id: 'T09.L01' },
    { term: 'extraordinary circumstances', source_lesson_id: 'T09.L02' },
      ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export default function T09L03_Section106() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          The United States has decided, as a matter of law, that before the federal
          government does something that could damage a historically significant place —
          a building on the National Register, an old farmstead, an archaeologically
          sensitive site, a Native American sacred site — it has to pause and consider
          the impact. That's what <strong>Section 106 of the National Historic Preservation Act
          (NHPA)</strong> is about.
        </p>
        <p className="mt-2">
          For your fiber project, Section 106 is triggered the moment you have a federal
          nexus (BEAD funding, RUS loan) AND your route footprint could affect a historic
          property. "Could affect" is the key phrase — you don't need to know that you're
          going to damage something. You need to look.
        </p>
        <p className="mt-2">
          The looking happens through a defined process: you define the area to look in
          (the APE), you search for historic properties in that area, and you consult with
          the State Historic Preservation Officer (SHPO) about what you found and what
          your project might do to it. The SHPO has 30 days to respond to a complete
          package — but the operative word is <em>complete</em>. Missing one required item
          means the clock never starts.
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
              <td className="px-3 py-2 font-mono">NHPA</td>
              <td className="px-3 py-2">National Historic Preservation Act</td>
              <td className="px-3 py-2">The law requiring federal agencies to consider effects on historic properties</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">SHPO</td>
              <td className="px-3 py-2">State Historic Preservation Officer</td>
              <td className="px-3 py-2">The state official who reviews your §106 package and has 30 days to respond</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">APE</td>
              <td className="px-3 py-2">Area of Potential Effect</td>
              <td className="px-3 py-2">The geographic zone around your route where historic properties could be affected</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ACHP</td>
              <td className="px-3 py-2">Advisory Council on Historic Preservation</td>
              <td className="px-3 py-2">Federal agency that oversees §106 compliance; can be notified when adverse effect found</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">MOA</td>
              <td className="px-3 py-2">Memorandum of Agreement</td>
              <td className="px-3 py-2">The binding mitigation agreement when adverse effect is found and mitigated</td>
            </tr>
          </tbody>
        </table>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T09-L03"
          cards={[
            {
              id: 'T09-L03-fc-nhpa',
              front: 'What does Section 106 of the NHPA require?',
              back: 'Section 106 of the National Historic Preservation Act — codified at 54 USC §306108 — requires federal agencies to take into account the effects of their undertakings on historic properties, and afford the Advisory Council on Historic Preservation (ACHP) a reasonable opportunity to comment. For fiber projects with a federal nexus, Section 106 applies whenever the project area may contain historic properties.',
            },
            {
              id: 'T09-L03-fc-shpo',
              front: 'What is a SHPO and what role do they play in Section 106?',
              back: 'State Historic Preservation Officer — the state official designated under the NHPA to administer the state historic preservation program. In the Section 106 process, the SHPO is the primary consulting party. The federal agency sends the initiation package to the SHPO, and the SHPO has 30 days to respond after receiving an adequate package. SHPO contact information is maintained by the National Conference of State Historic Preservation Officers (NCSHPO).',
            },
            {
              id: 'T09-L03-fc-ape',
              front: 'What is the APE (Area of Potential Effect) in Section 106?',
              back: 'The geographic area or areas within which an undertaking may directly or indirectly cause alterations in the character or use of historic properties. For aerial fiber, the APE typically includes the pole-line corridor plus a defined buffer (often 0.5–1 mile on each side for visual effects of new aerial infrastructure). For buried fiber, the APE is generally the trench footprint plus a minimal buffer for ground disturbance vibration.',
            },
            {
              id: 'T09-L03-fc-finding',
              front: 'What are the three possible Section 106 findings of effect?',
              back: 'The federal agency\'s determination of how the undertaking affects historic properties. The three possible findings are: (1) No historic properties affected — no historic properties in the APE or no effect; (2) No adverse effect — historic properties present but no adverse effect; (3) Adverse effect — the undertaking will diminish the integrity, location, design, setting, materials, workmanship, feeling, or association of a historic property.',
            },
            {
              id: 'T09-L03-fc-30day',
              front: 'When does the Section 106 30-day SHPO clock start?',
              back: 'The clock starts when the SHPO RECEIVES an adequate package — not when the applicant submits. An incomplete package (missing APE map, missing photo log, missing prior-records search) will be returned by the SHPO and the clock does not start until resubmission and acceptance of the corrected package.',
            },
            {
              id: 'T09-L03-fc-consulting-party',
              front: 'What is a consulting party in Section 106?',
              back: 'An individual or organization with a demonstrated interest in or legal standing related to the undertaking\'s effects on historic properties. Consulting parties in a Section 106 review may include: the SHPO, Tribal Historic Preservation Officers (THPOs) for properties of tribal significance, local governments, and organizations with a documented interest in the historic property at issue.',
            },
            {
              id: 'T09-L03-fc-program-comment',
              front: 'What is a Section 106 program comment?',
              back: 'An alternative to project-by-project Section 106 review issued by the ACHP (Advisory Council on Historic Preservation). A program comment allows a federal agency to address the effects of a program (such as a statewide broadband deployment) on historic properties through a single programmatic document rather than individual project-by-project consultations.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The Section 106 Process — Step by Step</h2>

        <h3 className="mt-4 font-semibold">The six steps of Section 106 consultation</h3>
        <p>
          Section 106 follows a defined sequence set out in 36 CFR Part 800 (the ACHP's
          §106 implementing regulations). Here's how it plays out for a fiber route:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-3 text-sm">
          <li>
            <strong>Initiate the process.</strong> The federal agency (NTIA for BEAD, RUS
            for RUS-funded projects) determines that Section 106 applies and notifies the
            SHPO. The subgrantee (your firm) typically prepares the initiation package for
            the agency to review and transmit.
          </li>
          <li>
            <strong>Define the APE.</strong> Establish the Area of Potential Effect — the
            geographic zone where the project could directly or indirectly affect historic
            properties. For aerial fiber: typically the pole corridor plus a visual buffer
            (0.5–1 mile). For buried fiber: the trench footprint plus a ground-disturbance
            buffer. The APE is documented and mapped; it becomes part of the initiation
            package.
          </li>
          <li>
            <strong>Identify historic properties.</strong> Search for properties in the APE
            that are listed on, or eligible for listing on, the National Register of Historic
            Places. This requires: (a) a prior-records search (state inventory, NRHP records),
            (b) a field reconnaissance (photo-documented site visits), and (c) in some cases,
            a formal archaeological survey. The initiation package includes the results of this
            search.
          </li>
          <li>
            <strong>Submit the initiation package to SHPO.</strong> The complete package
            includes: APE map, prior-records search results, field photo log, description of
            the undertaking, and identification of consulting parties. The <strong>30-day
            clock starts when the SHPO receives an adequate package</strong> — not on
            submission date. An incomplete package is returned; the clock resets on resubmission.
          </li>
          <li>
            <strong>Determine the finding of effect.</strong> The SHPO reviews the package
            and responds within 30 days with one of three findings: (a) No historic properties
            affected, (b) No adverse effect, or (c) Adverse effect. The federal agency makes
            the formal finding; the SHPO concurs or objects.
          </li>
          <li>
            <strong>Resolve adverse effects (if found).</strong> If an adverse effect is found,
            the federal agency and SHPO negotiate a resolution. Three outcomes are possible:
            (a) project modification to avoid the adverse effect, (b) Memorandum of Agreement
            (MOA) documenting mitigation measures, or (c) Programmatic Agreement (PA) for
            complex situations involving multiple parties. The ACHP is notified and may
            participate.
          </li>
        </ol>

        <h3 className="mt-5 font-semibold">What goes in the initiation package — and why it matters</h3>
        <p>
          The most common cause of Section 106 delay is an incomplete initiation package.
          SHPO offices review dozens of submissions per month; a package missing the APE map
          or the photo log goes back with a deficiency letter, and the 30-day clock hasn't
          started yet. Real-world timelines for first-time submittals often run 60–120 days
          instead of 30 — not because SHPO is slow, but because the first submission was
          incomplete and had to be revised.
        </p>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Package component</th>
                <th className="px-3 py-2 text-left">What it requires</th>
                <th className="px-3 py-2 text-left">Common deficiency that returns the package</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">APE map</td>
                <td className="px-3 py-2">GIS or topographic map showing the project footprint and the buffer boundary</td>
                <td className="px-3 py-2">APE boundary not defined; buffer distance not justified; scale too small to read</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Prior-records search</td>
                <td className="px-3 py-2">Search of state historic property inventory + NRHP database for properties in the APE</td>
                <td className="px-3 py-2">Search radius too small; database not current; results not summarized in the package</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Field photo log</td>
                <td className="px-3 py-2">Dated photographs of the project corridor, especially older structures, cemeteries, and potential archaeological features</td>
                <td className="px-3 py-2">Photos undated, unlabeled, or taken from a moving vehicle rather than site-level</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Undertaking description</td>
                <td className="px-3 py-2">Clear narrative of what the project does (aerial vs. buried, new poles vs. existing poles, trench depth and width)</td>
                <td className="px-3 py-2">Description too vague; doesn't distinguish between above-ground and below-ground disturbance</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Consulting party identification</td>
                <td className="px-3 py-2">List of parties with demonstrated interest; tribal outreach documentation if tribal land or interest areas are in the APE</td>
                <td className="px-3 py-2">Tribal notification missing for routes in areas of known tribal interest</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-2">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book (36 CFR §800.4):</strong> The SHPO has 30 days to respond after
            receipt of the initiation package. The process moves on the SHPO's timeline.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> SHPO offices routinely return packages as incomplete.
            Each return-and-resubmit resets the clock. On first-time submittals from
            subgrantees with no prior SHPO relationship, a 60–120 day total consultation
            timeline is common. Experienced permitting teams call the SHPO's project
            coordinator before submitting to confirm what the office expects to see — a
            10-minute phone call can prevent a 30-day clock reset.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>What matters most:</strong> Build the SHPO relationship early. SHPO
            offices are understaffed and processing many submissions simultaneously.
            A subgrantee who shows up pre-submission, walks the SHPO coordinator through
            the project, and confirms the package format gets faster reviews and fewer
            deficiency letters. That's not gaming the system — that's professional practice.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">What happens after an adverse-effect finding</h3>
        <p>
          An adverse-effect finding is not a project killer — it's a trigger for negotiation.
          The three available outcomes under 36 CFR Part 800 are:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Project modification:</strong> Redesign the undertaking to avoid the
            adverse effect entirely. Example: reroute the fiber line away from the viewshed
            of a listed historic farmstead, so that no new aerial infrastructure appears
            in the historic setting. If the modification eliminates the adverse effect,
            the finding reverts to "no adverse effect" and the MOA process is not needed.
          </li>
          <li>
            <strong>Memorandum of Agreement (MOA):</strong> A binding agreement between
            the federal agency, the SHPO, and (often) the ACHP that documents the mitigation
            measures the project will implement to address the adverse effect. Example: historic
            photo-documentation of a structure that will be demolished as part of the project,
            or an archaeological data-recovery excavation before ground disturbance. The
            project can proceed after the MOA is signed by all parties.
          </li>
          <li>
            <strong>Programmatic Agreement (PA):</strong> Used when multiple properties,
            multiple jurisdictions, or complex mitigation programs are involved. A PA is
            broader than a MOA and may cover an entire broadband program rather than a
            single project. PAs require ACHP participation and are negotiated over months.
          </li>
        </ol>

        <h3 className="mt-5 font-semibold">Program comments — the fast-track option for statewide programs</h3>
        <p>
          For large BEAD programs deploying fiber across an entire state, the ACHP offers
          a <strong>program comment</strong> mechanism that replaces project-by-project
          Section 106 review with a single programmatic determination. The ACHP issues a
          program comment after reviewing the program's scope and the types of historic
          properties that may be affected, and the agency agrees to specific protective
          measures as conditions of the comment.
        </p>
      </section>

      {/* ── BRANCHING SCENARIO ──────────────────────────────────────────── */}
      <BranchingScenario
        title="Section 106 Adverse-Effect Path"
        description="You're permitting a BEAD aerial route. The route deviates from the existing utility corridor into a rural area containing a 1920s farmhouse. Work through the §106 adverse-effect path."
        scenarioId="T09-L03-section106"
        initialNodeId="start"
        nodes={[
          {
            id: 'start',
            text: 'Your aerial fiber route deviates 20 feet from the existing utility corridor into a rural corridor containing a 1920s farmhouse. The farmhouse appears to be in good condition and maintains its historic rural setting. Is the farmhouse in your APE?',
            choices: [
              { label: 'No — the farmhouse is 200 feet from the nearest pole; it\'s outside the direct construction footprint', nextId: 'ape-wrong' },
              { label: 'Yes — the farmhouse is within the visual effects buffer of the new aerial infrastructure', nextId: 'ape-right' },
            ],
          },
          {
            id: 'ape-wrong',
            text: 'Incorrect. The APE for aerial fiber includes both the direct construction footprint AND the zone of visual effects from new aerial infrastructure. A 1920s farmhouse 200 feet from a new pole line may be within the visual effects APE if the new poles are visible from the property and alter the historic rural setting. The APE is defined based on potential effect pathways — not just physical proximity. Try again.',
            isTerminal: false,
            choices: [{ label: 'Go back', nextId: 'start' }],
          },
          {
            id: 'ape-right',
            text: 'Correct. The farmhouse is within the APE because the new aerial infrastructure will be visible from the property and may affect its historic rural setting. You submit the initiation package to the SHPO. The package includes the APE map, prior-records search, and field photo log. The SHPO returns it in 10 days with a deficiency note: the photo log lacks dated photographs of the farmhouse from the site. What do you do?',
            choices: [
              { label: 'Argue that the clock already started when the package was submitted', nextId: 'clock-wrong' },
              { label: 'Complete the site-level photo documentation and resubmit; the 30-day clock hasn\'t started yet', nextId: 'clock-right' },
            ],
          },
          {
            id: 'clock-wrong',
            text: 'Incorrect. Under 36 CFR §800.4(b)(2), the 30-day response period begins when the SHPO receives an ADEQUATE package — meaning one that contains all required elements. A returned package means the package was not adequate; the clock never started. Arguing that submission date controls the clock is legally incorrect and will damage your SHPO relationship. Resubmit with the corrected photo log. Try again.',
            isTerminal: false,
            choices: [{ label: 'Go back', nextId: 'ape-right' }],
          },
          {
            id: 'clock-right',
            text: 'Correct. You complete the site-level photo documentation and resubmit. The SHPO acknowledges receipt of the adequate package. 30 days later, the SHPO responds: the farmhouse is listed on the National Register of Historic Places. The SHPO finds that the new aerial infrastructure in the viewshed constitutes an ADVERSE EFFECT on the historic property\'s setting. What are your options?',
            choices: [
              { label: 'Stop the project — an adverse effect finding ends your ability to proceed', nextId: 'stop-wrong' },
              { label: 'Negotiate a resolution: project modification, MOA, or PA', nextId: 'negotiate-right' },
            ],
          },
          {
            id: 'stop-wrong',
            text: 'An adverse-effect finding does NOT stop the project — it triggers the resolution phase under 36 CFR §800.6. The federal agency must resolve the adverse effect through project modification, a Memorandum of Agreement (MOA) with mitigation, or a Programmatic Agreement (PA). The project can proceed only after resolution is documented and agreed to by the parties. Try again.',
            isTerminal: false,
            choices: [{ label: 'Go back', nextId: 'clock-right' }],
          },
          {
            id: 'negotiate-right',
            text: 'Correct. You evaluate three options: (1) Reroute the fiber 0.5 miles to the south, removing the farmhouse from the visual APE — no adverse effect if SHPO concurs. (2) Negotiate a MOA: use shorter poles, paint poles an earth tone, limit equipment at pole nearest the farmhouse. (3) Proceed to a PA if multiple historic properties and mitigation programs are involved. Your route survey data from T04 shows a feasible reroute that stays in existing utility ROW. Which option is most cost-effective for the project?',
            choices: [
              { label: 'Reroute to eliminate the adverse effect — avoids the MOA negotiation delay', nextId: 'reroute' },
              { label: 'Negotiate the MOA with the agreed mitigation measures', nextId: 'moa' },
            ],
          },
          {
            id: 'reroute',
            text: 'Smart choice if the reroute is feasible. The reroute eliminates the adverse effect, the SHPO finding reverts to "no adverse effect," and no MOA is needed. Timeline impact: 2–4 weeks to revise route design and resubmit to SHPO for concurrence. This is usually faster than the full MOA negotiation (which can take 60–90 additional days). The reroute also keeps your fiber in existing utility ROW — which helps with CE C-8 NEPA compliance.',
            isTerminal: true,
            outcome: 'COMPLETED: Adverse effect resolved by project modification (reroute). Finding reverts to "no adverse effect" with SHPO concurrence. Schedule impact: +2–4 weeks. No MOA required. Lesson: route design choices (T04) directly affect §106 outcomes. Routing in existing utility corridors minimizes both NEPA and §106 exposure.',
          },
          {
            id: 'moa',
            text: 'Also a valid path when rerouting is not feasible. The MOA documents the mitigation measures (pole height limits, color treatment, equipment placement restrictions) and is signed by the federal agency, SHPO, and any other consulting parties. Once signed, the project can proceed. Timeline impact: 60–90 days for MOA negotiation and execution. The ACHP may participate in complex MOA negotiations.',
            isTerminal: true,
            outcome: 'COMPLETED: Adverse effect resolved by Memorandum of Agreement. Project proceeds with mitigation measures (pole height, color, equipment placement). Timeline impact: +60–90 days. Lesson: MOA negotiation is the standard adverse-effect resolution mechanism. Having a clear project modification package ready when you enter negotiations shortens the timeline significantly.',
          },
        ]}
      />

      <ReferencesBlock
        items={[
          { citation: '54 USC §306108', note: 'NHPA Section 106 — the statute requiring federal agencies to consider a project\'s effects on historic properties before proceeding.' },
          { citation: '36 CFR Part 800', note: 'The ACHP\'s Section 106 implementing regulations — the six-step consultation sequence used on every fiber route with a federal nexus.' },
          { citation: '36 CFR §800.4(b)(2)', note: 'The rule that the SHPO\'s 30-day response clock starts on receipt of an adequate package, not on the applicant\'s submission date.' },
          { citation: '36 CFR §800.16(d)', note: 'The Area of Potential Effect (APE) definition — the geographic zone, including visual/setting effects, that determines which historic properties get evaluated.' },
          { citation: '36 CFR §§800.5–800.6', note: 'The adverse-effect finding and resolution process — project modification, a Memorandum of Agreement, or a Programmatic Agreement.' },
          { citation: '36 CFR §800.2(c)', note: 'Who counts as a consulting party — the SHPO, THPOs, local governments with jurisdiction, and other parties with a demonstrated interest.' },
          { citation: '36 CFR §800.14(e)', note: 'The program comment mechanism — lets a statewide broadband program clear Section 106 once, program-wide, instead of route by route.' },
        ]}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <GatedAssessment
        courseId="T09"
        assessmentId="T09-L03"
        title="Check — Section 106 — Historic Properties"
        fallback={
        <Quiz
          title="Check — Section 106 — Historic Properties"
          mode="multiple-choice"
          questions={[
          {
            id: 'T09-L03-Q1',
            type: 'mc',
            prompt:
              'A fiber route initiation package is submitted to the SHPO on Monday. The SHPO returns it on Friday citing a missing field photo log. When does the 30-day Section 106 clock start?',
            choices: [
              'On Monday — when the package was submitted',
              'Not yet — the clock starts when the SHPO receives an ADEQUATE package, which has not yet been submitted',
              'On Friday — when the SHPO acknowledged receipt',
              'The 30-day clock is advisory; the SHPO can respond at any time regardless of submission date',
            ],
            answerIndex: 1,
            explanation:
              'Under 36 CFR §800.4(b)(2), the 30-day SHPO response period begins when the SHPO receives an adequate package — meaning one that contains all required elements. A returned package with a deficiency note means the package was not adequate; the clock never started. It will start only when the corrected, complete package is resubmitted and accepted by the SHPO.',
            citation: '36 CFR §800.4(b)(2); 54 USC §306108.',
          },
          {
            id: 'T09-L03-Q2',
            type: 'mc',
            prompt:
              'The SHPO issues an adverse-effect finding for a new aerial fiber route that will be visible in the viewshed of a National Register-listed historic farmstead. What are the available resolution options?',
            choices: [
              'The project must stop; an adverse-effect finding ends the federal undertaking',
              'The project must prepare a full Environmental Impact Statement (EIS)',
              'The federal agency and SHPO negotiate resolution: project modification, Memorandum of Agreement (MOA), or Programmatic Agreement (PA)',
              'The subgrantee can appeal directly to the ACHP to override the SHPO finding',
            ],
            answerIndex: 2,
            explanation:
              'An adverse-effect finding under 36 CFR §800.5 triggers the resolution process under 36 CFR §800.6. The three available outcomes are: (1) project modification to avoid the effect, (2) Memorandum of Agreement documenting mitigation, or (3) Programmatic Agreement for complex situations. An adverse effect does not stop the project — it requires a documented resolution before proceeding. ACHP participation is available when adverse effects are complex, but the ACHP does not "override" SHPO findings.',
            citation: '36 CFR §§800.5–800.6; 54 USC §306108.',
          },
          {
            id: 'T09-L03-Q3',
            type: 'mc',
            prompt:
              'For a BEAD-funded aerial fiber route, the APE would typically include which of the following?',
            choices: [
              'Only the land directly beneath the poles where construction crews will work',
              'The pole corridor plus a defined visual-effects buffer (typically 0.5–1 mile on each side for aerial infrastructure)',
              'The entire county through which the route passes',
              'Only properties listed on the National Register of Historic Places within the project footprint',
            ],
            answerIndex: 1,
            explanation:
              'The APE (Area of Potential Effect) for aerial fiber includes both the direct construction footprint (where crews work) AND the zone of potential visual effects from new aerial infrastructure. Because new poles can be visible from surrounding properties, the APE typically includes a buffer of 0.5–1 mile on each side of the pole line for visual effects analysis. The APE is not limited to NRHP-listed properties — it is defined first, and then historic properties within it are identified.',
            citation: '36 CFR §800.16(d) (APE definition); 54 USC §306108.',
          },
          {
            id: 'T09-L03-Q4',
            type: 'mc',
            prompt:
              'In the Section 106 process, who is identified as a consulting party?',
            choices: [
              'Only the SHPO and the federal agency',
              'Only property owners within the APE',
              'Any individual or organization with a demonstrated interest in or legal standing related to the undertaking\'s effects on historic properties, including the SHPO, THPOs, local governments, and interested organizations',
              'Only organizations that file formal comments with the ACHP',
            ],
            answerIndex: 2,
            explanation:
              'Consulting parties in Section 106 include any individual or organization with a demonstrated interest in how the undertaking may affect historic properties. This includes: the SHPO (always), Tribal Historic Preservation Officers (THPOs) for properties of tribal significance, local governments, and organizations with a documented interest. The federal agency is responsible for identifying and inviting consulting parties at the outset of the process under 36 CFR §800.2(c).',
            citation: '36 CFR §800.2(c) (consulting parties); 54 USC §306108.',
          },
        ]}
        />
        }
      />

    </LessonLayout>
  );
}
