// Net-new — T01 Fundamentals & Vocabulary, Lesson 4
// T01.L04 — Inside a Splice Case
// Foundation lesson: splice case anatomy — dome vs inline, ports, sealing, trays, fan-out

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import GatedAssessment from '../../components/primitives/GatedAssessment.jsx';

export const meta = {
  id: 'T01.L04',
  course_id: 'T01',
  title: 'Inside a Splice Case',
  order: 4,
  lesson_type: 'foundation',
  prerequisites: ['T01.L01', 'T01.L03'],
  vocabulary_introduced: [
    'splice case',
    'splice closure',
    'splice tray',
    'gel seal',
    'fan-out',
    'dome closure',
    'inline closure',
    'port',
    'cable entry',
    'slack storage',
  ],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'buffer tube', source_lesson_id: 'T01.L03' },
    { term: 'fiber', source_lesson_id: 'T01.L03' },
    { term: 'armor', source_lesson_id: 'T01.L03' },
    { term: 'central member', source_lesson_id: 'T01.L03' },
  ],
  estimated_minutes: 20,
  learning_objectives: [
    'Compare dome and inline splice case shapes and explain the typical use case for each configuration',
    'Trace the path of a fiber from cable entry through a splice case to the splice tray and fusion splice point',
    'Explain how splice case capacity and port count drive splice case selection for a given cable splice point',
    'Describe what information must be recorded in splice records and why splice documentation persists for the life of the network',
  ],
};

export default function T01L04_InsideASpliceCase() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Wherever two fiber cables meet and connect — at the end of a feeder run, at a
          distribution point, or at a mid-route slack loop — you'll find a splice case.
          The splice case is basically a waterproof box that holds and protects the individual
          fiber connections (splices) where cables are joined.
        </p>
        <p className="mt-2">
          Think of a splice case like a well-organized junction box in an electrical panel.
          The cables enter through sealed openings (ports), the wires (fibers) are organized
          inside on trays, and the whole thing is locked up tight so moisture and contamination
          can't get to the connections. Except instead of wire nuts, fiber uses fusion splices —
          glass-to-glass welds done with a precision fusion splicer machine. A <strong>fusion splice</strong>{' '}
          is where two bare fiber ends are precisely aligned and permanently joined by an electric arc
          that melts and fuses the glass together. The result is a near-invisible joint with very low
          signal loss (typically under 0.1 dB). <em>(The fusion splicer machine, splicing technique,
          and quality verification are covered in depth in T11.)</em>
        </p>

        <h3 className="mt-5 font-semibold">Acronyms and terms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Term</th>
              <th className="px-3 py-2 text-left">What it is</th>
              <th className="px-3 py-2 text-left">Why it matters</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Splice case / closure</td>
              <td className="px-3 py-2">Weatherproof enclosure for fiber splices</td>
              <td className="px-3 py-2">Protects splices from moisture, physical damage, and contamination for the 25–40 year life of the cable plant</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Splice tray</td>
              <td className="px-3 py-2">Rigid plastic tray holding 12–24 individual fiber splices</td>
              <td className="px-3 py-2">Organizes splices in labeled slots; maintains bend radius to prevent macrobend loss; provides protection for fragile fusion-spliced glass</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Port / cable entry</td>
              <td className="px-3 py-2">The sealed opening where each cable enters the splice case</td>
              <td className="px-3 py-2">Must seal tightly around the cable jacket to keep moisture out; sealed with gel, mastic tape, heat-shrink, or mechanical compression</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Gel seal</td>
              <td className="px-3 py-2">Petroleum or silicone gel injected around cable entry points</td>
              <td className="px-3 py-2">Primary moisture barrier at port entries; can be re-enterable (case reopened without cutting the seal)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Fan-out</td>
              <td className="px-3 py-2">Where individual buffer tubes are separated and routed to splice trays</td>
              <td className="px-3 py-2">Organizes the buffer tubes from the cable jacket to the correct tray positions</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Dome vs. inline — two basic shapes</h3>
        <p className="mt-2">
          Splice cases come in two fundamental shapes, and each suits different installation
          scenarios:
        </p>
        <div className="mt-3 space-y-4">
          <div className="p-4 border border-white/10 rounded-lg">
            <p className="font-semibold text-slate-200">Dome closure (butt closure)</p>
            <p className="text-sm text-slate-300/90 mt-1">
              A dome-shaped case where cables enter at one end (the base) and the dome lifts
              off for access. Common for pole-mounted, aerial, and pedestal-mounted applications.
              Can handle multiple cable entries at the base. Good for "stub" locations where
              cables end and connect to drops. Typical: Corning Closetec, Tyco FOSC-series.
            </p>
          </div>
          <div className="p-4 border border-white/10 rounded-lg">
            <p className="font-semibold text-slate-200">Inline closure (in-line splice case)</p>
            <p className="text-sm text-slate-300/90 mt-1">
              A cylindrical or rectangular case where cables enter from both ends. The cable
              passes through the case — the through-cables enter one end, pass through, exit
              the other. Good for mid-route splices where the cable continues beyond the splice
              point. Common underground in manholes or buried at mid-span slack loops.
            </p>
          </div>
        </div>

        <h3 className="mt-5 font-semibold">What's inside — from cable entry to splice</h3>
        <p className="mt-2">
          When you open a splice case, here's what you're looking at, from the cable entry
          points inward:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-2 text-slate-300/90 text-sm">
          <li>
            <strong>Port entry and seal:</strong> The cable jacket passes through a rubber or
            gel-sealed port. The cable's armor (if any) is typically bonded here. The outer
            jacket is clamped to a cable retention bracket so the cable can't pull back out.
          </li>
          <li>
            <strong>Central member anchor:</strong> The cable's central member (steel wire or
            fiberglass rod) must be mechanically anchored to the splice case frame. This is
            critical — if the central member isn't anchored, cable tension will pull the
            buffer tubes through the case and break all the splices.
          </li>
          <li>
            <strong>Fan-out area:</strong> The jacket is stripped back, and individual buffer
            tubes are routed to their designated splice tray(s). Extra slack is stored in
            coiled loops on the tray organizers. Color-coded labels or number tags identify
            each buffer tube.
          </li>
          <li>
            <strong>Splice trays:</strong> Flat plastic trays, stacked in a cassette, each
            holding 12–24 individual splices. Each splice sits in a numbered slot on the tray.
            Pigtail fibers or short lengths of fiber bridge between the two cables' fibers,
            with the fusion splice protected by a heat-shrink splice protector sleeve.
          </li>
          <li>
            <strong>Slack storage:</strong> Extra fiber length (slack) is stored as gentle
            loops in the splice tray or on the tray organizer. Minimum bend radius must be
            maintained — typically 30 mm for coiled fiber in a splice case.
          </li>
        </ol>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> Standards require specific minimum bend radius inside
            splice cases, documented splice records, and weatherproof sealing at all cable entries.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> The most common cause of post-splice high loss is a
            pigtail or slack loop bent too tightly inside the case. The splice machine might
            show 0.01 dB loss — perfect — but then the case is reassembled with a coil wedged
            against the tray edge, creating a macrobend. The OTDR shows a 0.4 dB event at the
            splice case that wasn't there before. Open the case, find the tight coil, re-route,
            re-close. This is the most teachable moment in OSP splicing: always check your
            bend radii before closing a case.
          </p>
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Splice Case Capacity and Selection</h2>
        <p>
          Splice cases are specified by how many cable entries (ports) they have and how many
          splice trays they hold. A typical selection framework:
        </p>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-3">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Use case</th>
              <th className="px-3 py-2 text-left">Typical port count</th>
              <th className="px-3 py-2 text-left">Tray capacity</th>
              <th className="px-3 py-2 text-left">Common type</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Mid-route pass-through splice</td>
              <td className="px-3 py-2">2 (in + out)</td>
              <td className="px-3 py-2">2–4 trays (24–48 splices)</td>
              <td className="px-3 py-2">Inline</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">FDH node (feeder + distribution)</td>
              <td className="px-3 py-2">4–8 ports</td>
              <td className="px-3 py-2">6–12 trays (72–144 splices)</td>
              <td className="px-3 py-2">Dome, pedestal-mount</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">NAP (distribution to drops)</td>
              <td className="px-3 py-2">1–3 ports</td>
              <td className="px-3 py-2">1 tray (12–24 splices)</td>
              <td className="px-3 py-2">Small dome, pole-mount</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Central office / headend</td>
              <td className="px-3 py-2">Up to 24 ports</td>
              <td className="px-3 py-2">Up to 48 trays (576+ splices)</td>
              <td className="px-3 py-2">Large inline or frame-mounted</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Splice records — documentation that lives forever</h3>
        <p className="mt-2 text-sm text-slate-300/90">
          Every fusion splice must be documented in a splice record. The standard splice
          record includes: splice case ID or location, cable IDs on each port, buffer tube
          colors, fiber numbers, splice loss (measured by the fusion splicer and/or OTDR),
          and date/technician. This record follows the splice case for its entire 25-year
          life — a technician opening the case in 2045 needs to know what's in there.
          Many RUS-program contracts require splice records as part of the close-out package
          (RUS Form 219 documentation).
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper — Re-Enterable vs. Non-Re-Enterable Closures</h2>
        <p>
          Some splice cases are designed to be <strong>re-enterable</strong> — you can open
          them, add or rearrange splices, and reseal them using the same sealing system.
          Others are <strong>non-re-enterable</strong> — once sealed with heat-shrink or
          epoxy, reopening destroys the seal and requires new sealing materials.
        </p>
        <p className="mt-2 text-sm text-slate-300/90">
          Re-enterable closures (gel-sealed or mechanically-sealed) are more common in OSP
          because networks evolve: new customers are added, cables are re-spliced for upgrades,
          and troubleshooting requires opening cases. Non-re-enterable closures (heat-shrink)
          are typically used for permanent buried mid-span splices where no future access is
          anticipated and absolute moisture exclusion is required.
        </p>
        <p className="mt-2 text-sm text-slate-300/90">
          RUS Bulletin 1751F-630 §8 requires that splice enclosures for aerial and underground
          cable provide mechanical protection and moisture ingress resistance for the life of
          the cable plant (typically 25+ years). Selection between re-enterable and
          non-re-enterable is a design decision documented in the construction specs.
        </p>
      </section>

      {/* ── KEY TERMS FLASHCARDS ────────────────────────────────────────── */}
      <Flashcard
        deckId="T01-L04"
        cards={[
          { id: 'T01-L04-FC-splice-case', front: 'Splice case / closure', back: 'A weatherproof enclosure that holds and protects fiber fusion splices where cables are joined. Protects splices from moisture, physical damage, and contamination for the 25–40 year life of the cable plant.' },
          { id: 'T01-L04-FC-splice-closure', front: 'Splice closure', back: 'Same as splice case — a weatherproof enclosure for fiber splices. Comes in two main shapes: dome (cables enter one end) and inline (cables enter both ends).' },
          { id: 'T01-L04-FC-splice-tray', front: 'Splice tray', back: 'A rigid plastic tray holding 12–24 individual fiber splices in numbered slots. Maintains minimum bend radius to prevent macrobend loss. Trays stack in a cassette inside the splice case.' },
          { id: 'T01-L04-FC-gel-seal', front: 'Gel seal', back: 'Petroleum or silicone gel injected around cable entry points in a splice case. Primary moisture barrier at port entries. Re-enterable — the case can be reopened without cutting the seal.' },
          { id: 'T01-L04-FC-fan-out', front: 'Fan-out', back: 'The area inside a splice case where the cable jacket is stripped back and individual buffer tubes are separated and routed to their designated splice trays. Organizes tubes by color-coded labels.' },
          { id: 'T01-L04-FC-dome-closure', front: 'Dome closure', back: 'A dome-shaped splice case where cables enter at the base and the dome lifts off for access. Common for pole-mounted, aerial, and pedestal applications. Good for stub locations where cables end inside.' },
          { id: 'T01-L04-FC-inline-closure', front: 'Inline closure', back: 'A splice case where cables enter from both ends and pass through — used at mid-route splice points where the cable continues beyond the splice. Common underground in manholes or at buried mid-span slack loops.' },
          { id: 'T01-L04-FC-port', front: 'Port', back: 'The sealed opening where each cable enters a splice case. Must seal tightly around the cable jacket to keep moisture out — sealed with gel, mastic tape, heat-shrink, or mechanical compression.' },
          { id: 'T01-L04-FC-cable-entry', front: 'Cable entry', back: 'Same as port — the sealed opening in a splice case where a cable enters. The cable jacket is clamped to a retention bracket so the cable cannot pull back out, and the central member is anchored here.' },
          { id: 'T01-L04-FC-slack-storage', front: 'Slack storage', back: 'Extra fiber length stored as gentle loops in the splice tray or tray organizer. Minimum bend radius must be maintained (typically 30 mm). Insufficient slack storage causes macrobend loss after the case is closed — the most common post-splice OTDR surprise.' },
        ]}
      />

      {/* ── SPLICE CASE COMPONENT GUIDE ─────────────────────────────────── */}
      <div className="lesson-callout">
        <h4>Inside a Dome Splice Closure — Component Guide</h4>
        <p>A dome splice closure has five key components, each with a distinct job. When any one of these is done wrong, fibers break or moisture gets in — usually discovered days later by an OTDR surprise.</p>
        <ol>
          <li>
            <strong>Cable entry port</strong> — The sealed opening where each cable enters the case. The cable jacket is clamped to a retention bracket, the central member is anchored, and the port is sealed with gel or mechanical compression to keep moisture out. Armored cable has the armor bonded at this point.
          </li>
          <li>
            <strong>Central member anchor</strong> — The cable's central member (steel or fiberglass rod) is bolted or clamped to the splice case frame here. Critical step — without anchoring, cable tension during aerial sag changes or underground settlement will pull the buffer tubes and break every splice inside.
          </li>
          <li>
            <strong>Fan-out / organizer</strong> — Area where the jacket is stripped back and individual buffer tubes are routed to their designated splice trays. Color-coded labels identify each tube. Extra tube length is looped in gentle coils with bend radius maintained.
          </li>
          <li>
            <strong>Splice tray</strong> — A rigid plastic tray holding 12–24 individual fiber splices. Splices sit in numbered slots, each protected by a heat-shrink splice protector sleeve. Trays stack in a cassette inside the dome. The tray maintains minimum bend radius so stored slack fiber doesn't macrobend.
          </li>
          <li>
            <strong>Splice protector sleeve</strong> — A heat-shrink tube (with internal rod and solder ring in many designs) placed over the fusion splice before splicing, then heated to shrink around the splice point. Protects the fragile bare glass of the fusion splice from mechanical stress. Each splice gets one.
          </li>
        </ol>
      </div>

      {/* ── PRACTICE QUIZ ───────────────────────────────────────────────── */}
      <GatedAssessment
        courseId="T01"
        assessmentId="T01-L04"
        title="T01.L04 Check — Inside a Splice Case"
        fallback={
        <Quiz
          title="T01.L04 Check — Inside a Splice Case"
          mode="multiple-choice"
          questions={[
            {
              id: 'T01-L04-Q1',
              type: 'mc',
              prompt:
                'After a splicer completes all fusion splices in a splice case, they notice the OTDR shows 0.4 dB of unexpected loss at that location — but the splicer machine showed all splices under 0.05 dB. What is the most likely explanation?',
              choices: [
                'The fusion splicer machine is defective and must be returned for calibration',
                'A fiber or pigtail inside the case is bent too tightly (macrobend), creating loss that wasn\'t present when the case was open for splicing but appeared when closed',
                'The OTDR launch cable is defective and introducing error',
                'The loss is within spec — 0.4 dB is acceptable for a fusion splice',
              ],
              answerIndex: 1,
              explanation:
                'This is the classic macrobend-after-closure scenario. The individual splice losses were genuine (0.05 dB each is excellent). But when the case was closed, a slack fiber loop was inadvertently pinched against the tray edge or case wall, creating a tight bend. 0.4 dB at 1550 nm is significant and unacceptable. Open the case, find the tight bend, re-route the fiber with proper slack management, and recheck with the OTDR before final closure.',
              fieldNote:
                'Always do a final OTDR scan with the case closed but before making it weatherproof. That\'s your last chance to catch macrobend issues without reopening sealed entries.',
            },
            {
              id: 'T01-L04-Q2',
              type: 'mc',
              prompt:
                'A splicer forgets to anchor the central member of the cable to the splice case frame before completing the work. What is the likely long-term consequence?',
              choices: [
                'The splices will have higher initial loss because the central member conducts heat away from the splice',
                'No consequence — the central member serves no function inside the splice case',
                'Cable tension from aerial sag changes or underground ground movement can pull the buffer tubes through the case entry, breaking the splices',
                'Water will enter the case through the central member anchor point',
              ],
              answerIndex: 2,
              explanation:
                'The central member is the cable\'s structural backbone. It must be anchored so external cable tension (from aerial sag changes, thermal expansion, or underground settling) stops at the central member anchor and doesn\'t transfer to the fragile buffer tubes inside the case. An unanchored central member is a deferred splice failure waiting to happen — often not discovered until years later when the splice section shows gradually increasing loss or a full break.',
            },
            {
              id: 'T01-L04-Q3',
              type: 'fill-in-blank',
              prompt:
                'A splice case where cables enter from both ends — continuing through the case — rather than terminating inside it is called a(n) ____ closure.',
              answer: 'inline',
              answerDisplay: 'inline',
              explanation:
                'Inline (or in-line) closures are used at mid-route splice points where the cable continues beyond the splice. The cable enters one end of the case, the splices are made, and the cable exits the other end. Dome closures are for stub or terminal locations where cables end inside the case.',
            },
            {
              id: 'T01-L04-Q4',
              type: 'mc',
              prompt:
                'A splice record for a particular splice case must be preserved for the life of the cable plant (20–40 years). Which of the following information is LEAST critical to include in the splice record?',
              choices: [
                'Which buffer tube color from Cable A is spliced to which buffer tube color from Cable B',
                'The name of the vendor who manufactured the splice case',
                'The individual fiber splice loss for each splice (from the splicer or OTDR)',
                'The date the splicing was performed and the technician\'s ID',
              ],
              answerIndex: 1,
              explanation:
                'The splice record must include: cable and buffer tube identification (so a future technician knows what\'s connected to what), individual fiber splice losses (for comparison if loss increases later — a sign of physical degradation), and date/technician (for traceability). The closure manufacturer\'s name is nice to have (for reordering sealing materials) but it is the least critical piece. If it\'s missing, the case can be physically inspected to determine the manufacturer.',
            },
          ]}
        />
        }
      />

    </LessonLayout>
  );
}
