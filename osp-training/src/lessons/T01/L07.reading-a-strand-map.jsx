// Migrated from M07 §7.1 — strand map content adapted for T01 foundation context
// T01.L07 — Reading a Strand Map
// Working lesson: strand map, FDH, NAP, drop, fiber counts, reading a distribution diagram

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T01.L07',
  course_id: 'T01',
  title: 'Reading a Strand Map',
  order: 7,
  lesson_type: 'working',
  prerequisites: ['T01.L01', 'T01.L05', 'T01.L06'],
  vocabulary_introduced: [
    'strand map',
    'FDH',
    'NAP',
    'drop',
    'feeder',
    'distribution cable',
    'splitter',
    'PON',
    'fiber assignment',
  ],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'OLT', source_lesson_id: 'T01.L01' },
    { term: 'ONT', source_lesson_id: 'T01.L01' },
    { term: 'headend', source_lesson_id: 'T01.L01' },
    { term: 'span', source_lesson_id: 'T01.L02' },
    { term: 'buffer tube', source_lesson_id: 'T01.L03' },
    { term: 'splice case', source_lesson_id: 'T01.L04' },
    { term: 'designer', source_lesson_id: 'T01.L06' },
    { term: 'splicer', source_lesson_id: 'T01.L06' },
  ],
  estimated_minutes: 25,
};

export default function T01L07_ReadingAStrandMap() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          A strand map (also called a fiber assignment map, cable diagram, or fiber route
          diagram) is the document that tells you how fibers are connected across the entire
          network — which fiber in which cable serves which customer, and how they're
          spliced together along the way. It's the fiber network's wiring diagram.
        </p>
        <p className="mt-2">
          If you've ever tried to troubleshoot a problem on a circuit without the wiring
          diagram, you know why this matters. With a strand map, a technician can trace
          "Customer at 123 Main Street is down" → "they're on fiber 7 in buffer tube 3 of
          distribution cable DC-047" → "that fiber runs to NAP-12 on Oak Street" → "spliced
          to feeder fiber 22 in F-001" → "which connects back to OLT port 6 at the headend."
          Without the strand map: guesswork.
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
              <td className="px-3 py-2 font-mono">FDH</td>
              <td className="px-3 py-2">Fiber Distribution Hub</td>
              <td className="px-3 py-2">Where feeder fiber connects to distribution cables via passive optical splitters. The "junction box" of an FTTH network. May be pole-mounted, pedestal-mounted, or in an underground vault.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NAP</td>
              <td className="px-3 py-2">Network Access Point</td>
              <td className="px-3 py-2">A small closure or terminal on a pole or at a pedestal where distribution fibers are accessed and connected to individual customer drop cables.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">PON</td>
              <td className="px-3 py-2">Passive Optical Network</td>
              <td className="px-3 py-2">The architecture used in FTTH: one OLT port serves many customers via passive splitters (no powered electronics in the distribution network). Common split ratios: 1:32 or 1:64.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">GPON</td>
              <td className="px-3 py-2">Gigabit Passive Optical Network</td>
              <td className="px-3 py-2">The most common PON standard in North America today. Delivers up to 2.5 Gb/s downstream shared among all customers on one OLT port. (XGS-PON is the 10G successor.)</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The hierarchy — feeder to customer</h3>
        <p className="mt-2">
          An FTTH strand map shows the hierarchy of cables and connections:
        </p>
        <div className="mt-2 space-y-2 text-sm text-slate-300/90">
          <div className="flex items-start gap-3 p-2 border-l-2 border-blue-400/50">
            <span className="font-bold text-blue-300 min-w-24">Feeder cable</span>
            <span>Large count (72–288 fibers), runs from headend to FDH. One fiber per OLT port. Example: "F-001" = Feeder 1, a 144-fiber cable from headend.</span>
          </div>
          <div className="flex items-start gap-3 p-2 border-l-2 border-green-400/50">
            <span className="font-bold text-green-300 min-w-24">Splitter at FDH</span>
            <span>A passive optical splitter (1:32 or 1:64) takes one input feeder fiber and divides the signal to 32 or 64 output ports — each going to a separate distribution cable fiber. No power required.</span>
          </div>
          <div className="flex items-start gap-3 p-2 border-l-2 border-yellow-400/50">
            <span className="font-bold text-yellow-300 min-w-24">Distribution cable</span>
            <span>Medium count (12–48 fibers), runs from FDH to NAPs along streets. Example: "DC-047" = Distribution Cable 47.</span>
          </div>
          <div className="flex items-start gap-3 p-2 border-l-2 border-orange-400/50">
            <span className="font-bold text-orange-300 min-w-24">NAP</span>
            <span>A small closure on a pole or pedestal where one or more distribution fibers are accessed and connected to drop cables. Serves 1–4 customers typically.</span>
          </div>
          <div className="flex items-start gap-3 p-2 border-l-2 border-red-400/50">
            <span className="font-bold text-red-300 min-w-24">Drop cable</span>
            <span>1–2 fiber cable from NAP to customer premises. Aerial (pole to house) or buried (pedestal to house). Terminates at the ONT.</span>
          </div>
        </div>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> Strand maps are clean schematics with clear cable IDs,
            fiber numbers, and connection details.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> On older networks or projects with poor documentation,
            a technician may arrive at a NAP and find cables with no label, splice cases
            with no records, and no strand map on file. They're starting blind. This is why
            as-built documentation discipline (Lesson T01.L05) matters — every hour a
            documentation team doesn't spend on the as-built becomes ten hours a field
            technician spends troubleshooting blind in the dark.
          </p>
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Reading a Strand Map — What the Numbers Mean</h2>
        <p>
          A strand map typically shows each cable segment with a notation like:
        </p>
        <div className="rounded-lg bg-black/30 border border-white/10 p-3 font-mono text-sm text-slate-200 my-3">
          F-001 / 144F / BT4-F7 → FDH-003 → DC-047 / 24F / BT2-F3 → NAP-12 → DROP / 1F → 123 MAIN ST
        </div>
        <p className="text-sm text-slate-300/90">
          Breaking this down:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm text-slate-300/90">
          <li><strong>F-001</strong> — Feeder cable 1</li>
          <li><strong>144F</strong> — 144-fiber cable</li>
          <li><strong>BT4-F7</strong> — Buffer Tube 4, Fiber 7 (specific fiber being traced)</li>
          <li><strong>FDH-003</strong> — Fiber Distribution Hub 3 (where feeder connects to distribution)</li>
          <li><strong>DC-047</strong> — Distribution Cable 47</li>
          <li><strong>24F</strong> — 24-fiber cable</li>
          <li><strong>BT2-F3</strong> — Buffer Tube 2, Fiber 3 (the post-splitter fiber in this cable)</li>
          <li><strong>NAP-12</strong> — Network Access Point 12 (where drop connects)</li>
          <li><strong>DROP / 1F</strong> — Single-fiber drop cable</li>
          <li><strong>123 MAIN ST</strong> — Customer address (connected to the ONT at this address)</li>
        </ul>

        <h3 className="mt-5 font-semibold">Fiber assignment — why it matters to every crew member</h3>
        <p className="mt-2 text-sm text-slate-300/90">
          <strong>For the splicer:</strong> The splice map tells you which buffer tube from
          Cable A connects to which buffer tube in Cable B at each splice case. Without it,
          you're guessing — and a wrong splice puts the wrong customer's fiber on the wrong
          OLT port, which means traffic goes to the wrong place. No customer will have service,
          and tracking down the mismatch is hours of work.
        </p>
        <p className="mt-2 text-sm text-slate-300/90">
          <strong>For the test technician:</strong> You need the fiber assignment to know which
          end to launch from and which end to terminate, and to verify that the OTDR trace
          end-to-end distance matches the design length for that fiber pair.
        </p>
        <p className="mt-2 text-sm text-slate-300/90">
          <strong>For O&amp;M:</strong> When a customer reports an outage, the network operations
          center (NOC) identifies which OLT port lost signal. The strand map traces that port
          back to a specific feeder fiber, FDH, distribution fiber, and NAP — telling the
          field tech exactly where to start looking.
        </p>

        <h3 className="mt-5 font-semibold">Splitter ratios — what "1:32" means</h3>
        <p className="mt-2 text-sm text-slate-300/90">
          A 1:32 splitter takes one input fiber and divides the optical signal to 32 outputs.
          Each output goes to a separate customer drop. The splitting introduces loss:
          a 1:32 splitter adds approximately 15–17 dB of insertion loss (theoretical minimum:
          10 × log₁₀(32) = 10 × 1.505 = 15.05 dB; production tolerance and connector loss
          typically add 0.5–1.5 dB, pushing typical field values to 15.5–16.5 dB with
          worst-case at 17 dB per manufacturer datasheets). This split loss is a major input to the
          link budget — the OLT must launch enough power to reach every ONT through up to 17 dB
          of splitter loss plus all the fiber and connector losses along the route.
        </p>
        <p className="mt-2 text-sm text-slate-300/90">
          Source: ITU-T G.984 (GPON standard); TIA-568.3-D (loss budget approach for PON).
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper — GIS Integration</h2>
        <p>
          Modern OSP networks store strand map data in GIS (Geographic Information System)
          databases rather than paper diagrams. Each pole, handhole, splice case, and cable
          segment is a geographic feature with associated attributes (fiber counts, splice
          records, equipment IDs). The strand map becomes a live, queryable layer in the GIS.
        </p>
        <p className="mt-2 text-sm text-slate-300/90">
          Benefits: the NOC can query "which OLT port is at this address?" in seconds.
          Field technicians can access the strand map on a tablet in their truck. Designers
          can see what's already in the ground before designing a new route.
        </p>
        <p className="mt-2 text-sm text-slate-300/90">
          For RUS-program projects, TIA-606-D (administration standard) provides the framework
          for labeling and record-keeping for fiber infrastructure. The as-built GIS export
          is part of the close-out package. (Covered in T16 — As-Built Documentation &amp; GIS.)
        </p>
      </section>

      {/* ── KEY TERMS FLASHCARDS ────────────────────────────────────────── */}
      <Flashcard
        deckId="T01-L07"
        cards={[
          { id: 'T01-L07-FC-strand-map', front: 'Strand map', back: 'The document that shows how fibers are connected across the entire network — which fiber in which cable serves which customer, how they\'re spliced together along the way. The fiber network\'s wiring diagram. A technician can\'t troubleshoot an outage without it.' },
          { id: 'T01-L07-FC-fdh', front: 'FDH (Fiber Distribution Hub)', back: 'Where feeder fiber connects to distribution cables via passive optical splitters. The junction box of an FTTH network. May be pole-mounted, ground-mounted, or in an underground vault. One feeder fiber in → 32 or 64 distribution fibers out.' },
          { id: 'T01-L07-FC-nap', front: 'NAP (Network Access Point)', back: 'A small closure on a pole or pedestal where distribution fibers are accessed and connected to individual customer drop cables. Last OSP infrastructure before the customer premises. Typically serves 1–4 customers.' },
          { id: 'T01-L07-FC-drop', front: 'Drop', back: 'A 1–2 fiber cable running from the NAP to one customer\'s premises. Aerial (pole to house) or buried (pedestal to house). Terminates at the ONT — the demarcation point.' },
          { id: 'T01-L07-FC-feeder', front: 'Feeder cable', back: 'A large-count cable (72–288 fibers) running from the headend/OLT to the FDH. One fiber per OLT port. The backbone of an FTTH network. Trunk infrastructure — feeder cable failures affect many customers at once.' },
          { id: 'T01-L07-FC-distribution-cable', front: 'Distribution cable', back: 'A medium-count cable (12–48 fibers) running from the FDH to NAPs along streets. Each fiber corresponds to one customer post-splitter. Multiple distribution cables fan out from each FDH in different directions.' },
          { id: 'T01-L07-FC-splitter', front: 'Splitter (passive optical)', back: 'A passive device at the FDH that takes one input feeder fiber and divides the signal to 32 or 64 output ports. No power required. Introduces approximately 15–17 dB of insertion loss on a 1:32 split (theoretical min 15.05 dB; typical field 15.5–16.5 dB). The dominant loss element in a GPON link budget.' },
          { id: 'T01-L07-FC-pon', front: 'PON (Passive Optical Network)', back: 'The FTTH architecture where one OLT port serves many customers via passive splitters — no powered electronics in the distribution network. Common split ratios: 1:32 or 1:64. GPON is the dominant PON standard in North America.' },
          { id: 'T01-L07-FC-fiber-assignment', front: 'Fiber assignment', back: 'Which specific fiber in which cable connects to which customer or OLT port. Documented in the strand map. Wrong fiber assignment means a customer\'s traffic goes to the wrong place — the mismatch can take hours to trace without the map.' },
        ]}
      />

      {/* ── ANNOTATED DIAGRAM ────────────────────────────────────────────── */}
      <AnnotatedDiagram
        title="FTTH Network Architecture — Sample Strand Map"
        description="Click each element to understand what it represents in the fiber network hierarchy. This shows a typical GPON FTTH deployment from headend to customer."
        src="/training/diagrams/ftth-strand-map.svg"
        alt="Diagram of FTTH network architecture showing headend with OLT, feeder cable, FDH with splitters, distribution cables, NAPs, and customer drops to homes"
        aspectRatio={1.8}
        hotPoints={[
          {
            id: 'headend',
            x: 5,
            y: 50,
            label: 'Headend / OLT',
            type: 'click',
            explanation:
              'The OLT (Optical Line Terminal) at the provider\'s headend or central office. Each OLT card has multiple ports; each port serves one PON (one feeder fiber, serving up to 32 or 64 customers via splitters). All signal originates here.',
          },
          {
            id: 'feeder',
            x: 25,
            y: 50,
            label: 'Feeder cable',
            type: 'click',
            explanation:
              'Large-count cable (72–288 fibers) running from headend to FDH. One fiber per OLT port. Typically aerial on poles or buried in conduit in the main right-of-way. The backbone of the FTTH network.',
          },
          {
            id: 'fdh',
            x: 42,
            y: 50,
            label: 'FDH + Splitters',
            type: 'click',
            explanation:
              'Fiber Distribution Hub. Contains passive optical splitters (1:32 or 1:64). One feeder fiber in → 32 or 64 distribution fibers out. No power required — splitters are passive optical components. May be a pole-mounted cabinet, ground cabinet, or underground vault.',
          },
          {
            id: 'distrib',
            x: 65,
            y: 30,
            label: 'Distribution cable',
            type: 'click',
            explanation:
              'Medium-count cable (12–48 fibers) fanning out from FDH to serve streets and neighborhoods. Each fiber in the distribution cable corresponds to one customer (post-splitter). Multiple distribution cables leave each FDH in different directions.',
          },
          {
            id: 'nap',
            x: 80,
            y: 20,
            label: 'NAP',
            type: 'click',
            explanation:
              'Network Access Point. A small closure on a pole or at a pedestal where 1–4 distribution fibers are accessed and connected to customer drop cables. The last OSP infrastructure before the customer premises.',
          },
          {
            id: 'drop',
            x: 92,
            y: 10,
            label: 'Drop + ONT',
            type: 'click',
            explanation:
              'Drop cable (1–2 fibers) runs from NAP to the customer premises. Terminates at the ONT (Optical Network Terminal), which is the demarcation point. The ONT converts fiber to ethernet for the customer\'s equipment. Everything from OLT to ONT is OSP.',
          },
        ]}
      />

      {/* ── PRACTICE QUIZ ───────────────────────────────────────────────── */}
      <Quiz
        title="T01.L07 Check — Reading a Strand Map"
        mode="multiple-choice"
        questions={[
          {
            id: 'T01-L07-Q1',
            type: 'mc',
            prompt:
              'A strand map notation reads: "F-001 / BT6-F11 → FDH-002 → DC-031 / BT1-F4 → NAP-08 → 456 ELM ST." What does "BT1-F4" refer to?',
            choices: [
              'Battery Terminal 1, Fault 4 — an alarm condition on the cable',
              'Buffer Tube 1, Fiber 4 — the specific fiber within distribution cable DC-031 that serves 456 Elm St',
              'Building Terminal 1, Fiber 4 — the ISP wiring inside the customer building',
              'Block Terminal 1, Feed 4 — the FDH output port assignment',
            ],
            answerIndex: 1,
            explanation:
              'In strand map notation, BT = Buffer Tube, F = Fiber. BT1-F4 means Buffer Tube 1, Fiber 4 in the named cable (DC-031). This tells the splicer which physical fiber to connect at each splice case and tells the test technician which fiber to test from end to end.',
          },
          {
            id: 'T01-L07-Q2',
            type: 'mc',
            prompt:
              'A 1:32 passive optical splitter at an FDH introduces approximately how much insertion loss on each output port?',
            choices: [
              'About 3 dB (half the power)',
              'About 10 dB (one-tenth the power)',
              'About 15–16 dB (approximately 1/32 of the power)',
              'No loss — "passive" means no loss',
            ],
            answerIndex: 2,
            explanation:
              '"Passive" means no powered electronics — not no loss. A 1:32 splitter divides the signal among 32 outputs. Each output receives 1/32 of the input power, which in dB is: 10 × log₁₀(1/32) = 10 × (−1.505) = −15.05 dB, plus insertion loss of the splitter itself (typically 0.5–1 dB more), totaling about 15–16 dB. This is the dominant loss in a GPON link budget. The OLT must launch enough power to reach through this loss on the farthest, lossiest customer path.',
            citation: 'ITU-T G.984 (GPON); TIA-568.3-D Annex.',
          },
          {
            id: 'T01-L07-Q3',
            type: 'fill-in-blank',
            prompt:
              'The small closure or terminal on a pole or pedestal where distribution fiber is connected to individual customer drop cables is called a ____.',
            answer: 'NAP',
            answerDisplay: 'NAP (Network Access Point)',
            explanation:
              'NAPs are the last OSP infrastructure before the customer drop. They may be small dome-style closures on a pole, a wall-mount box at the street, or a small pedestal at the curb. Each NAP serves 1–4 customer drops in a typical FTTH deployment.',
          },
          {
            id: 'T01-L07-Q4',
            type: 'mc',
            prompt:
              'A field technician needs to locate the splice case where a specific distribution cable fiber is connected to the feeder cable. Which document is the primary source for this information?',
            choices: [
              'The OTDR test record from acceptance testing',
              'The strand map / fiber assignment document from the as-built package',
              'The make-ready application submitted to the pole owner',
              'The RUS Form 219 close-out certification',
            ],
            answerIndex: 1,
            explanation:
              'The strand map (part of the as-built documentation) shows the complete fiber path from headend to customer: which splice cases connect which cables, and which buffer tube and fiber number is at each connection point. The OTDR record tells you about signal quality, not fiber routing. The strand map is the go-to navigation document for any O&M work on the fiber plant.',
          },
        ]}
      />

    </LessonLayout>
  );
}
