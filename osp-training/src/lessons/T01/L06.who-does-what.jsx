// Net-new — T01 Fundamentals & Vocabulary, Lesson 6
// T01.L06 — Who Does What on an OSP Job
// Foundation lesson: field roles, responsibilities, workflow handoffs

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import TimelineSequence from '../../components/primitives/TimelineSequence.jsx';

export const meta = {
  id: 'T01.L06',
  course_id: 'T01',
  title: 'Who Does What on an OSP Job',
  order: 6,
  lesson_type: 'foundation',
  prerequisites: ['T01.L05'],
  vocabulary_introduced: [
    'designer',
    'staker',
    'make-ready crew',
    'splicer',
    'inspector',
    'test technician',
    'project manager',
    'PE',
  ],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'survey', source_lesson_id: 'T01.L05' },
    { term: 'design', source_lesson_id: 'T01.L05' },
    { term: 'permit', source_lesson_id: 'T01.L05' },
    { term: 'make-ready', source_lesson_id: 'T01.L05' },
    { term: 'construction', source_lesson_id: 'T01.L05' },
    { term: 'as-built', source_lesson_id: 'T01.L05' },
  ],
  estimated_minutes: 20,
};

export default function T01L06_WhoDoesWhat() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          A fiber project has a lot of moving parts — not just cables and conduit, but
          people with different skills doing different jobs at different stages. Knowing who
          does what (and who's responsible for what) prevents confusion, reduces rework, and
          tells you who to call when something goes wrong.
        </p>
        <p className="mt-2">
          On a small project, one person might wear multiple hats — the same technician might
          stake the route, help with permitting, and test the cable. On a large RUS-program
          project, each role is a different team or subcontractor. This lesson covers the
          roles as they exist in full, specialized form.
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
              <td className="px-3 py-2 font-mono">PE</td>
              <td className="px-3 py-2">Professional Engineer</td>
              <td className="px-3 py-2">A licensed engineer (typically EE or civil) who stamps drawings for legal compliance. Required for RUS-program designs. Signs off on structural calculations (pole loading).</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">PM</td>
              <td className="px-3 py-2">Project Manager</td>
              <td className="px-3 py-2">Coordinates all stages and roles. Tracks budget, schedule, permits, and contractor performance. The person who catches stage-sequencing problems before they become field problems.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ROW</td>
              <td className="px-3 py-2">Right-of-Way</td>
              <td className="px-3 py-2">The legal corridor where fiber can be installed (public road ROW, easements over private land). ROW acquisition or permitting is sometimes a separate team on large projects.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OTDR</td>
              <td className="px-3 py-2">Optical Time-Domain Reflectometer</td>
              <td className="px-3 py-2">The primary fiber test instrument. Used by splicers (after each splice) and test technicians (for final acceptance). Sends a light pulse into the fiber and measures what bounces back to locate events (splices, bends, breaks). (Preview — formally covered with flashcards and full detail in L08.)</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The roles — who they are and what they do</h3>

        <div className="mt-3 space-y-4 text-sm text-slate-300/90">
          <div className="p-4 border border-white/10 rounded-lg">
            <p className="font-semibold text-slate-100">Surveyor / Staker</p>
            <p className="mt-1">
              Walks the proposed route and collects field data: pole measurements, existing
              attachment heights, span lengths, crossing measurements, underground utility
              locations, and GPS waypoints. Photographs every pole and relevant feature.
              On aerial jobs, the staker may physically mark each pole (with spray paint or
              flag tags) showing the proposed attachment height and equipment.
            </p>
            <p className="mt-1"><strong>Delivers to:</strong> Designer (field data package for design).</p>
            <p className="mt-1"><strong>Must know:</strong> NESC clearance basics, how to read a pole tag, GPS tools, field measurement techniques.</p>
          </div>

          <div className="p-4 border border-white/10 rounded-lg">
            <p className="font-semibold text-slate-100">OSP Designer / Engineer</p>
            <p className="mt-1">
              Takes the survey data and produces the construction drawings. Calculates pole
              loading (can the pole handle the new attachment?), sag-tension for aerial cable,
              conduit sizing for underground routes, splice locations, and fiber count planning.
              On RUS-program projects, designs require a PE stamp.
            </p>
            <p className="mt-1"><strong>Delivers to:</strong> PM (design package); Permitting team (drawings for permit applications); Make-ready application team.</p>
            <p className="mt-1"><strong>Must know:</strong> NESC, RUS bulletins, GIS tools, sag-tension calculations, fiber route planning.</p>
          </div>

          <div className="p-4 border border-white/10 rounded-lg">
            <p className="font-semibold text-slate-100">Permitting Specialist</p>
            <p className="mt-1">
              Submits and tracks permit applications to all relevant agencies: state DOT,
              county/city, pole owner attachment agreement, Corps of Engineers (for waterway
              crossings), and federal land agencies where applicable. Responds to agency
              comments and conditions. Tracks permit expiration dates.
            </p>
            <p className="mt-1"><strong>Delivers to:</strong> PM (executed permits); Construction team (permit conditions that affect construction method).</p>
            <p className="mt-1"><strong>Must know:</strong> NEPA basics, state DOT processes, FCC pole attachment rules, environmental review timelines.</p>
          </div>

          <div className="p-4 border border-white/10 rounded-lg">
            <p className="font-semibold text-slate-100">Make-Ready Crew</p>
            <p className="mt-1">
              Works for the pole owner (or their authorized contractor). Moves, raises, or
              re-arranges existing attachments on shared poles to make room for the new fiber
              attachment and restore NESC clearances. This crew does not install the new
              fiber — they prepare the pole to accept it.
            </p>
            <p className="mt-1"><strong>Delivers to:</strong> Pole owner (make-ready completion records); Fiber company (pole-ready notification).</p>
          </div>

          <div className="p-4 border border-white/10 rounded-lg">
            <p className="font-semibold text-slate-100">Construction Crew (Cable Installer)</p>
            <p className="mt-1">
              Installs the physical cable plant. For aerial: operates strand trucks, lashing
              machines, and bucket trucks to install messenger and lash fiber. For underground:
              runs directional bore machines, trenching equipment, and conduit installation
              crews. Places handholes and manholes. Installs splice case hardware (but does
              not splice — that's a separate crew on large projects).
            </p>
            <p className="mt-1"><strong>Delivers to:</strong> Splicer (installed cable with slack at splice points); PM (daily field reports).</p>
          </div>

          <div className="p-4 border border-white/10 rounded-lg">
            <p className="font-semibold text-slate-100">Splicer</p>
            <p className="mt-1">
              Opens splice cases, strips cable, prepares and cleans fibers, and performs
              fusion splicing. Tests each splice with the fusion splicer (which estimates
              splice loss from core alignment) and with an OTDR. Documents every splice in
              a splice record. Re-closes and seals the splice case. Highest-skill field role
              in OSP — bad splices are hard to find and expensive to fix.
            </p>
            <p className="mt-1"><strong>Delivers to:</strong> Test technician (splice records, initial OTDR traces); PM (splice completion status).</p>
            <p className="mt-1"><strong>Must know:</strong> Fusion splicing technique, fiber handling, OTDR operation, splice documentation.</p>
          </div>

          <div className="p-4 border border-white/10 rounded-lg">
            <p className="font-semibold text-slate-100">Test Technician</p>
            <p className="mt-1">
              Performs the final acceptance test of the completed fiber plant. Runs
              bidirectional OTDR traces (Tier 2) and end-to-end insertion loss tests
              (Tier 1) on every fiber. Compares results to the design loss budget and
              acceptance criteria. Documents pass/fail. Identifies fibers that need rework
              and coordinates re-splicing.
            </p>
            <p className="mt-1"><strong>Delivers to:</strong> PM and designer (test records); Client's engineer (acceptance test package).</p>
          </div>

          <div className="p-4 border border-white/10 rounded-lg">
            <p className="font-semibold text-slate-100">Inspector / QA Technician</p>
            <p className="mt-1">
              Walks the completed construction to verify it matches the design drawings and
              meets code requirements. Checks attachment heights, cable sag, conduit depths,
              handhole installation, grounding, and labeling. Creates a punch list of
              items that don't pass. Works with the construction crew to resolve punch-list
              items before acceptance.
            </p>
            <p className="mt-1"><strong>Delivers to:</strong> PM (punch list and acceptance recommendation); Client (inspection report).</p>
          </div>

          <div className="p-4 border border-white/10 rounded-lg">
            <p className="font-semibold text-slate-100">As-Built Drafter / Documentation Team</p>
            <p className="mt-1">
              Updates the design drawings to reflect field-as-built conditions based on
              construction redlines. Compiles the final as-built package: drawings, splice
              records, test records, permit copies. For RUS-program: assembles the RUS
              Form 219 documentation package.
            </p>
            <p className="mt-1"><strong>Delivers to:</strong> Client (as-built package and close-out report); RUS (Form 219 package for fund advancement).</p>
          </div>
        </div>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> Org charts show clean lines between roles.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> On many projects — especially small regional contractors —
            one person does three of these jobs. The splicer also runs the OTDR for final
            acceptance. The staker also submits the permit applications. This isn't wrong —
            it's the reality of small-shop OSP work. The important thing is that ALL the
            tasks still get done by someone who knows what they're doing. What gets skipped
            on small jobs (documentation, final test records) is exactly what comes back to
            haunt you five years later.
          </p>
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Who Hands Off to Whom</h2>
        <p>
          Understanding handoffs is as important as understanding individual roles. A splicer
          who doesn't receive complete splice records from the previous crew is starting blind.
          A test technician who doesn't receive the design loss budget can't determine pass/fail.
        </p>
      </section>

      {/* ── TIMELINE SEQUENCE ────────────────────────────────────────────── */}
      <TimelineSequence
        title="OSP Project Roles — In Order"
        description="These events appear in roughly chronological project order. Understanding the sequence helps you see how each role depends on the one before it."
        events={[
          {
            id: 'survey',
            label: 'Surveyor / Staker conducts field survey',
            detail: 'Walks the route, measures poles, records existing attachments and underground utilities, delivers field data to designer.',
          },
          {
            id: 'design',
            label: 'Designer produces construction drawings',
            detail: 'Uses field data to create the design package: routes, attachment heights, conduit layouts, splice locations, fiber counts, load calculations. PE stamps for RUS work.',
          },
          {
            id: 'permit',
            label: 'Permitting specialist submits applications',
            detail: 'Submits permit applications to DOT, pole owner, environmental agencies. Runs in parallel with make-ready application. Tracks and responds to conditions.',
          },
          {
            id: 'makready',
            label: 'Make-ready crew prepares poles',
            detail: 'Pole owner\'s crew moves existing attachments to make room. Issues pole-ready notification when complete. Fiber company cannot attach until this is done.',
          },
          {
            id: 'construct',
            label: 'Construction crew installs cable plant',
            detail: 'Installs messenger and cable on poles (aerial) or conduit and cable (underground). Places splice case hardware. Provides slack at splice locations.',
          },
          {
            id: 'splice',
            label: 'Splicer completes all fiber splices',
            detail: 'Strips cable, prepares fibers, fusion splices, tests each splice with OTDR, documents splice record, re-seals cases.',
          },
          {
            id: 'test',
            label: 'Test technician performs acceptance testing',
            detail: 'Bidirectional OTDR (Tier 2) and end-to-end loss test (Tier 1) on every fiber. Pass/fail against design acceptance criteria.',
          },
          {
            id: 'inspect',
            label: 'Inspector walks completed plant',
            detail: 'Physical inspection of attachment heights, cable sag, conduit depths, grounding, labeling. Issues punch list. Approves acceptance.',
          },
          {
            id: 'asbuilt',
            label: 'As-built team compiles documentation package',
            detail: 'Updates drawings to as-built conditions. Compiles splice records, test records, permits. Delivers final package to client and RUS (Form 219).',
          },
        ]}
      />

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper — Who Signs What</h2>
        <p>
          On RUS-program engineering services contracts, the PE (Professional Engineer) has
          specific signing obligations:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm text-slate-300/90">
          <li>Construction drawings must be stamped and signed by a licensed PE.</li>
          <li>Load calculations (pole loading, sag-tension) must be certified by a PE.</li>
          <li>In some states, the make-ready engineering analysis (which determines whether a pole can handle an additional attachment) also requires PE certification.</li>
          <li>The RUS Form 219 project completion certification must be signed by the PE responsible for the project.</li>
        </ul>
        <p className="mt-2 text-sm text-slate-300/90">
          The PE's stamp is a legal obligation — it means the PE is personally liable for
          the accuracy of the stamped documents. A PE who stamps inaccurate calculations
          faces license suspension or revocation. This is why PE-stamped work is taken seriously
          and why engineers push back when clients ask them to stamp documents they haven't
          actually verified.
        </p>
        <p className="mt-2 text-sm text-slate-300/90">
          Source: RUS Bulletin 1751F-630 §2 (PE requirements); state engineering licensing
          boards (jurisdiction-specific requirements).
        </p>
      </section>

      {/* ── KEY TERMS FLASHCARDS ────────────────────────────────────────── */}
      <Flashcard
        deckId="T01-L06"
        cards={[
          { id: 'T01-L06-FC-designer', front: 'Designer (OSP Designer)', back: 'Takes survey data and produces construction drawings: cable routes, pole loading calculations, sag-tension, conduit sizing, splice locations, fiber counts. On RUS-program projects, designs require a PE stamp.' },
          { id: 'T01-L06-FC-staker', front: 'Staker (Surveyor)', back: 'Walks the proposed route and collects field data: pole measurements, existing attachment heights, span lengths, crossing measurements, underground utility locations, GPS waypoints, and photographs. Delivers the field data package that makes design possible.' },
          { id: 'T01-L06-FC-make-ready-crew', front: 'Make-ready crew', back: 'Works for the pole owner or their authorized contractor. Moves, raises, or rearranges existing attachments on shared poles to make room for new fiber. Does not install the new fiber — prepares the pole to accept it.' },
          { id: 'T01-L06-FC-splicer', front: 'Splicer', back: 'Opens splice cases, strips cable, prepares and cleans fibers, performs fusion splicing, tests each splice with the OTDR, documents splice records, and re-closes and seals the case. Highest-skill field role in OSP.' },
          { id: 'T01-L06-FC-inspector', front: 'Inspector / QA Technician', back: 'Walks completed construction to verify it matches the design drawings and meets code: attachment heights, cable sag, conduit depths, grounding, labeling. Creates a punch list of items that don\'t pass.' },
          { id: 'T01-L06-FC-test-tech', front: 'Test technician', back: 'Performs the final acceptance test — bidirectional OTDR traces (Tier 2) and end-to-end insertion loss tests (Tier 1) on every fiber. Compares results to the design loss budget. Documents pass/fail. The splicer\'s in-process OTDR checks are not the acceptance test.' },
          { id: 'T01-L06-FC-project-manager', front: 'Project manager (PM)', back: 'Coordinates all stages and roles. Tracks budget, schedule, permits, and contractor performance. Catches stage-sequencing problems before they become field problems. Runs permitting and make-ready in parallel to shorten the schedule.' },
          { id: 'T01-L06-FC-pe', front: 'PE (Professional Engineer)', back: 'A state-licensed engineer whose stamp certifies that design documents meet applicable codes and are structurally sound. Required on RUS-program OSP drawings. Personally liable for stamped documents — PE stamps are not rubber stamps.' },
        ]}
      />

      {/* ── PRACTICE QUIZ ───────────────────────────────────────────────── */}
      <Quiz
        title="T01.L06 Check — Who Does What"
        mode="multiple-choice"
        questions={[
          {
            id: 'T01-L06-Q1',
            type: 'mc',
            prompt:
              'A construction crew finishes installing cable on a route segment. The splicer shows up to begin splicing but discovers there are no splice records identifying which cable entries should be connected to which. Who is primarily responsible for this gap?',
            choices: [
              'The splicer — they should have requested the records before arriving',
              'The designer — they should have provided complete splice design documentation that would be handed to the splicer with the cable installation package',
              'The test technician — they own all documentation',
              'No one — splice records are created by the splicer during splicing, not before',
            ],
            answerIndex: 1,
            explanation:
              'The designer produces the splice design as part of the design package: which fibers connect to which, which buffer tubes are through-spliced vs. broken out. This information is handed to the splicer as the "splice map." The splicer creates individual fiber splice records (actual splice loss, fiber-by-fiber detail) during work, but the splice map comes from design. Arriving without a splice map is a design-to-field handoff failure.',
          },
          {
            id: 'T01-L06-Q2',
            type: 'mc',
            prompt:
              'An inspector walking a completed aerial installation finds a span where the fiber cable appears to be hanging below the minimum ground clearance required by permit. What is the inspector\'s correct next action?',
            choices: [
              'Add it to the punch list and notify the PM — construction crew must correct it before acceptance',
              'Immediately call the electric utility to report a hazard',
              'Adjust the cable sag themselves using the lashing tool in their truck',
              'Accept the span since small clearance violations are typically waived',
            ],
            answerIndex: 0,
            explanation:
              'The inspector\'s job is to identify and document non-conformances, not to fix them. Adding the clearance violation to the punch list and notifying the PM triggers the correct correction workflow: the construction crew adjusts the installation, and the inspector re-inspects. Inspectors do not perform construction corrections — that would compromise their independence as a QA function.',
          },
          {
            id: 'T01-L06-Q3',
            type: 'fill-in-blank',
            prompt:
              'The licensed engineer who stamps and signs OSP construction drawings, certifying they meet applicable codes and are structurally sound, is designated as a ____.',
            answer: 'PE',
            answerDisplay: 'PE (Professional Engineer)',
            explanation:
              'A PE (Professional Engineer) is state-licensed to certify engineering work. Their stamp on a drawing is a legal certification that they have reviewed and stand behind the technical content. For RUS-program work, PE-stamped drawings are required. The PE is personally liable for stamped documents.',
            citation: 'RUS Bulletin 1751F-630 §2; state engineering licensing requirements.',
          },
          {
            id: 'T01-L06-Q4',
            type: 'mc',
            prompt:
              'Who performs the final acceptance testing of the fiber plant, generating the Tier 1 and Tier 2 test records?',
            choices: [
              'The splicer — they tested each splice with the OTDR so no separate test is needed',
              'The make-ready crew — they are responsible for final verification before the permit is closed',
              'The test technician — performing bidirectional OTDR traces and end-to-end insertion loss tests on every fiber against the design acceptance criteria',
              'The designer — they set the acceptance criteria and must verify the plant meets them',
            ],
            answerIndex: 2,
            explanation:
              'The test technician performs the final acceptance test. The splicer\'s OTDR traces are real-time quality checks during splicing, but they are not the formal acceptance test — they test one splice at a time rather than the end-to-end link. The final acceptance test is an independent, end-to-end measurement of every fiber in the as-built plant, compared to the design\'s accepted loss budget.',
          },
        ]}
      />

    </LessonLayout>
  );
}
