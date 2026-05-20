// T11.L11 — Splice Tray Loading and Fiber Management
// Working lesson: tray loading, express loops, slack storage, bend radius compliance
// Source: M04 §4.6 + AnnotatedDiagram + HotSpot-style violation identification

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T11.L11',
  course_id: 'T11',
  title: 'Splice Tray Loading and Fiber Management',
  order: 11,
  lesson_type: 'working',
  prerequisites: ['T11.L10'],
  learning_objectives: [
    'Correctly load a 12F buffer tube with 6 express and 6 spliced fibers onto one splice tray',
    'State the minimum bend radius for G.652.D and G.657.A1 on an express loop inside a splice tray',
    'Identify two violations in a tray loading photograph',
    'Describe the label placement convention for splice trays and buffer tube stubs',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'buffer tube routing',
    'express loop',
    'slack storage coil',
    'fiber management organizer',
  ],
  key_terms: [
    {
      term: 'splice tray',
      definition:
        'A flat plastic organizer, typically 12F capacity, that holds splice protectors in individual retention slots and routes the buffer tube fibers between the entry points and the splice area. Trays are stacked inside the splice case on hinged or removable mounts. Each tray stores exactly the splice protectors for one buffer tube (or one ribbon in ribbon work). Standard dimensions: approximately 180 mm × 110 mm × 12 mm for a 12F tray.',
    },
    {
      term: 'buffer tube routing',
      definition:
        'The path the buffer tube follows from the splice case entry port to the splice tray. The buffer tube must enter the case with a minimum 25 mm of slack past the port seal, route through the fiber management organizer at the base of the case, and enter the splice tray from the correct side (as specified by the tray design). Routing must not create kinks, tight bends, or crossing of tubes from different cables.',
    },
    {
      term: 'express loop',
      definition:
        'The routing path for fibers in a buffer tube that do NOT have splices at this case — they pass through the tray area and continue to another splice point downstream. Express fibers are coiled in a slack loop in the tray\'s express routing channel, separated from the active splice area. Minimum bend radius applies: 30 mm for G.652.D standard fiber in an express loop, 15 mm for G.657.A1. Violating bend radius in an express loop causes macrobend loss on those fibers.',
    },
    {
      term: 'slack storage coil',
      definition:
        'A controlled coil of fiber slack stored inside the splice case outside the active splice tray area. Serves two purposes: (1) provides working length for re-splicing if a splice fails, and (2) accommodates thermal expansion/contraction of the cable without stressing the splice points. Target slack: 1.0–1.5 m of fiber per buffer tube inside the case. Stored in a figure-8 or circular coil on the case floor or dedicated slack management region.',
    },
    {
      term: 'fiber management organizer',
      definition:
        'The structural component inside a splice case (typically a plastic routing frame with fingers or channels) that separates buffer tubes from different cables, prevents crossing of tubes, and guides each tube to its designated tray. Proper use of the fiber management organizer is what makes a splice case re-enterable — without it, re-opening the case disturbs tube routing and potentially causes fiber breaks.',
    },
  ],
  vocabulary_assumed: [
    { term: 'splice tray', source_lesson_id: 'T01.L04' },
    { term: 'buffer tube', source_lesson_id: 'T01.L03' },
    { term: 'splice case', source_lesson_id: 'T01.L04' },
    { term: 'splice protector', source_lesson_id: 'T11.L04' },
    { term: 'fusion splice', source_lesson_id: 'T11.L04' },
    { term: 'TIA-598 color sequence', source_lesson_id: 'T11.L01' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T11L11_SpliceTrayLoadingAndFiberManagement() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ──────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500">
          <strong>Callback:</strong> Remember from <strong>T01.L03 and T01.L04, buffer tubes and splice trays</strong> — buffer tubes carry the fibers, trays organize the splices. This lesson shows you how to load them correctly.
        </p>
        <p>
          Making good splices is only half the job. How you organize those splices inside
          the case determines whether a technician can re-enter and work on the case 10 years
          from now without causing new problems. A messy splice case — fibers crossing each
          other, express loops with tight bends, no slack storage — is a trouble ticket
          waiting to happen.
        </p>
        <p className="mt-2">
          Good fiber management in a splice case looks intentional: every buffer tube has its
          own path, express fibers are separated from splice fibers, bend radii are respected
          everywhere, and labels are on every tray and buffer tube stub. This lesson covers
          the standards for each of those elements.
        </p>

        {/* Flashcards */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Key Terms</h3>
          <Flashcard
            deckId="T11-L11"
            cards={[
              {
                id: 'T11-L11-fc-tray',
                front: 'What is a splice tray and what is its standard capacity?',
                back: 'A flat plastic organizer (approx. 180×110×12 mm) that holds splice protectors in individual retention slots. Standard capacity: 12 fusion splices (12F). Trays are stacked inside the splice case on hinged mounts. Each tray typically serves one buffer tube from one cable direction.',
              },
              {
                id: 'T11-L11-fc-express',
                front: 'What is an express loop and what bend radius must be maintained?',
                back: 'The routing path for fibers that do not have splices at this case — they pass through in a slack coil. Minimum bend radius: 30 mm for G.652.D standard fiber; 15 mm for G.657.A1 bend-insensitive fiber. Violating bend radius in an express loop causes macrobend loss on those fibers.',
              },
              {
                id: 'T11-L11-fc-slack',
                front: 'What is slack storage and how much slack should be stored per buffer tube inside a splice case?',
                back: 'A controlled coil of fiber slack stored in the case outside the active splice tray area. Target: 1.0–1.5 m per buffer tube. Purpose: (1) provides working length for re-splicing if a splice fails, (2) accommodates thermal expansion/contraction of the cable. Stored in figure-8 or circular coil.',
              },
              {
                id: 'T11-L11-fc-organizer',
                front: 'What is the fiber management organizer and why is it important for re-entry?',
                back: 'A plastic routing frame inside the splice case (fingers, channels) that separates buffer tubes from different cables and guides each to its designated tray. Without it, re-opening the case disturbs tube routing and can cause fiber breaks. Proper use of the organizer is what makes a splice case re-enterable without disruption.',
              },
              {
                id: 'T11-L11-fc-tube-routing',
                front: 'What is buffer tube routing?',
                back: 'The organized path each buffer tube takes from the cable entry port through the splice case to its designated splice tray. Proper routing: each tube enters through its own cable entry port, routes through the fiber management organizer fingers, loops at minimum bend radius, and terminates at the tray where its fibers are spliced. Tubes from different cables are routed separately and labeled to prevent mis-identification during re-entry.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── WORKING ──────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Loading a 12F Tray: Express Fibers + Splice Fibers</h2>

        <div className="p-4 mb-6 rounded-lg border border-blue-400/30 bg-blue-400/5">
          <h3 className="font-semibold text-blue-300 mb-2">Quick Refresher — Key Terms</h3>
          <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
            <li><strong>Splice tray:</strong> The precision plastic tray inside the splice case that holds fibers during and after splicing.</li>
            <li><strong>Buffer tube & splice case:</strong> The source of your fibers and the housing that protects them — you're organizing them inside the tray.</li>
            <li><strong>Fusion splice & TIA-598 color sequence:</strong> The splices go in slots 7–12 (positions Red through Aqua); express fibers stay in slots 1–6 (Blue through White).</li>
          </ul>
        </div>

        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500">
          <strong>Callback:</strong> From <strong>T11.L01, the TIA-598 color sequence</strong> — you're using it NOW to organize which fiber goes into which tray slot. From <strong>T01.L04, splice tray basics</strong> — this lesson shows the detailed loading procedure.
        </p>

        <p>
          The scenario: you have a 12F buffer tube from Cable A at this splice location. Six
          of the 12 fibers (Blue through White, positions 1–6) are express — they pass through
          to the next splice location downstream. Six fibers (Red through Aqua, positions 7–12)
          are being spliced here to incoming fibers from Cable B.
        </p>

        {/* AnnotatedDiagram */}
        <div className="mt-4">
              <p className="text-sm text-slate-400 mt-2">
            Standard 12F splice tray loaded with 6 express fibers (top channel) and 6 spliced fibers (retention slots). Source: FOA CFOS-S fiber management reference; generic tray design — consult manufacturer for specific tray routing instructions.
          </p>
        </div>

        <h3 className="mt-6 font-semibold">Bend Radius Quick Reference</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Location in case</th>
                <th className="px-3 py-2 text-left">G.652.D min. bend radius</th>
                <th className="px-3 py-2 text-left">G.657.A1 min. bend radius</th>
                <th className="px-3 py-2 text-left">G.657.A2 min. bend radius</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Express loop in tray channel</td>
                <td className="px-3 py-2 text-yellow-400">30 mm</td>
                <td className="px-3 py-2 text-green-400">15 mm</td>
                <td className="px-3 py-2 text-green-400">7.5 mm</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Slack storage coil (tray area)</td>
                <td className="px-3 py-2 text-yellow-400">30 mm</td>
                <td className="px-3 py-2 text-green-400">15 mm</td>
                <td className="px-3 py-2 text-green-400">7.5 mm</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Buffer tube routing to tray</td>
                <td className="px-3 py-2 text-yellow-400">≥25 mm</td>
                <td className="px-3 py-2 text-yellow-400">≥25 mm (tube is buffer tube, not bare fiber)</td>
                <td className="px-3 py-2 text-yellow-400">≥25 mm</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Splice protector in retention slot</td>
                <td className="px-3 py-2 text-green-400">Straight (no bend) — protector holds the splice flat</td>
                <td className="px-3 py-2 text-green-400">Straight</td>
                <td className="px-3 py-2 text-green-400">Straight</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-slate-400 text-sm">
          Per ITU-T G.652.D (30 mm minimum bend radius, short-term); ITU-T G.657 A1 (15 mm) and A2 (7.5 mm) [registry-verified 2026-05-17]. Inside-case routing is considered long-term installation; these are permanent-installation bend radii.
        </p>

        <h3 className="mt-6 font-semibold">Label Convention</h3>
        <p>
          Labels are not optional. A splice case opened 5 years from now by a different
          technician should be self-documenting. Minimum label set:
        </p>
        <ul className="mt-2 space-y-1 text-slate-300 text-sm list-disc list-inside">
          <li><strong>Tray face label:</strong> Tray number, Cable A tube color/number, Cable B tube color/number, fiber range, splice point ID, date</li>
          <li><strong>Buffer tube stub label:</strong> Cable ID, tube number, tube color, fiber range in this tube, destination splice point for express fibers</li>
          <li><strong>Case exterior label:</strong> Splice point ID, GPS coordinates or route marker, date of installation, contractor ID, fiber count, case capacity</li>
        </ul>

        {/* Quiz */}
        <div className="mt-6">
          <Quiz
            id="T11-L11-quiz-1"
            questions={[
              {
                id: 'q1',
                type: 'multiple-choice',
                text: 'A technician loads 6 express G.652.D fibers into a splice tray express loop with a bend radius of 20 mm. The fibers fit and the tray closes. What is the problem?',
                options: [
                  { id: 'a', text: 'No problem — the tray physically closed, so the bend radius is acceptable' },
                  { id: 'b', text: '20 mm is below the 30 mm minimum bend radius for G.652.D. The fibers will experience macrobend loss at this bend — the loss may not show immediately but will increase over time under thermal cycling' },
                  { id: 'c', text: '20 mm is below the minimum only for G.657 fibers; G.652.D has a 15 mm minimum' },
                  { id: 'd', text: '20 mm is acceptable for express fibers; the 30 mm limit only applies to spliced fibers' },
                ],
                correctId: 'b',
                explanation: 'G.652.D standard single-mode fiber has a minimum permanent installation bend radius of 30 mm (ITU-T G.652.D). A 20 mm bend radius is below this limit. The immediate macrobend loss may be small (0.01–0.05 dB at 1310 nm, more at 1550 nm), but thermal cycling causes the bend to tighten and relax, fatiguing the glass at the bend point. Over 5–10 years, a consistently under-spec express loop bend becomes a latent fracture site. The fix: re-route the express loop with at least 30 mm bend radius. G.657.A1 (15 mm min) and G.657.A2 (7.5 mm min) have lower limits — verify fiber type before assuming the limit.',
              },
              {
                id: 'q2',
                type: 'multiple-choice',
                text: 'After a re-entry, the technician notices that multiple buffer tubes from Cable A and Cable B have become mixed together in the case without following their original routing through the fiber management organizer. What is the risk?',
                options: [
                  { id: 'a', text: 'No risk — as long as the splices still have the correct optical connections, routing through the organizer is cosmetic' },
                  { id: 'b', text: 'Risk: on next re-entry, the mixed tubes cannot be traced to their source trays without disturbing fiber. Any fiber movement during tracing risks breaking splices or causing bend loss. Correct action: re-route each tube through its assigned organizer channel and re-label.' },
                  { id: 'c', text: 'Risk: mixed tubes will cross-connect optically, creating noise on the circuit' },
                  { id: 'd', text: 'Risk only if the tubes are from different cables; mixing tubes from the same cable is acceptable' },
                ],
                correctId: 'b',
                explanation: 'Mixed buffer tube routing through the organizer is an operational risk, not an immediate optical problem. Optically, the splices are still correct. The risk is in future maintenance: a technician tracing "Cable A, Tube 3" through a case where tubes are randomly interleaved has to pull and flex tubes to follow them, risking mechanical stress on nearby splice points. In a well-managed case, every tube has a defined channel through the organizer — you can follow any tube from entry to tray without touching any other tube. Proper organizer routing is what makes re-entry safe.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── ADVANCED ──────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Fiber Management in High-Count Cases</h2>
        <p>
          In a 288F dome case with 24 splice trays, the fiber management organizer becomes
          critical for workable case organization. Best practices for high-count cases:
        </p>
        <ul className="mt-2 space-y-1 text-slate-300 text-sm list-disc list-inside">
          <li>Assign specific organizer channels to specific cable/tube origins before opening the first tube. Draw a routing map before starting.</li>
          <li>Store the routing map inside the case in a sealed plastic bag attached to the case interior. Future technicians need it.</li>
          <li>Color-band the buffer tubes at the entry point with heat-shrink color bands matching the TIA-598 tube color if the tube color is faded or ambiguous.</li>
          <li>Use thermal labels (not adhesive-backed paper labels — paper labels degrade within 3–5 years in a buried case). Thermal labels on polyimide tape last 20+ years.</li>
          <li>On multi-route cases (where cables from three or more directions converge), use different colored cable ties to visually separate routing groups before they enter the organizer.</li>
        </ul>
      </section>


      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          Splice tray loading and fiber management translate the abstract TIA-598 color sequence (L01, L02) and bend-radius physics (T02.L06) into the physical reality of a completed closure that a future technician will need to navigate safely. The express loop bend-radius hierarchy — ≥30 mm for G.652.D, ≥15 mm for G.657.A1, ≥7.5 mm for G.657.A2 — maps directly back to T02.L06's macrobend attenuation threshold data and T03.L01's fiber selection decisions; if the closure was designed for G.652.D fiber but the network was later upgraded to G.657.A2 using the smaller minimum bend radius, the 1.0–1.5 m slack storage coil that was previously compliant may now be routed too tightly at the coil guide edges. T01.L04 (network architecture) introduced the concept of express fiber — fibers that pass through a closure without being spliced — and this lesson operationalizes that concept into the express loop channel as a physically separate routing path that keeps express glass isolated from the splice work area, preventing an accidental nick during tray loading from severing a through fiber that serves a different service area. In T12 (testing), the OTDR technician correlating a splice event to a specific tray position depends entirely on the labeling conventions established here — tray face labels, buffer tube stubs, and case exterior markings are the physical bridge between the OTDR trace event at a given distance and the fiber color record in the splice documentation. For T15 (restoration), when a crew re-enters a closure to re-splice one damaged fiber, proper fiber management — routed slack in the coil, labeled trays, clear express vs. splice separation — is what allows them to work on one fiber without disturbing 287 others; a closure with poor fiber management forces the restoration crew to unload and re-route every fiber just to access the damaged one, turning a 2-hour restoration into an 8-hour job.
        </p>
      </section>
    </LessonLayout>
  );
}
