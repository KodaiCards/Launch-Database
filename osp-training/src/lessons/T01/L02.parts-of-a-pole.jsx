// Net-new — T01 Fundamentals & Vocabulary, Lesson 2
// T01.L02 — Parts of a Pole
// Foundation lesson: pole anatomy, attachment zones, NESC framing (intro only)

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import GatedAssessment from '../../components/primitives/GatedAssessment.jsx';

export const meta = {
  id: 'T01.L02',
  course_id: 'T01',
  title: 'Parts of a Pole',
  order: 2,
  lesson_type: 'foundation',
  prerequisites: ['T01.L01'],
  vocabulary_introduced: [
    'pole',
    'NESC',
    'attachment',
    'span',
    'midspan',
    'sag',
    'grade of construction',
    'climbing space',
    'communication space',
    'supply space',
    'neutral',
    'pole class',
    'joint-use',
    'clearance',
    'conduit',
  ],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
  ],
  estimated_minutes: 20,
  learning_objectives: [
    'Identify the three vertical zones of a shared utility pole (supply, climbing, communication) and explain the safety purpose of each',
    'Explain how sag affects ground clearance and why clearance is measured at midspan rather than at the attachment point',
    'Read a pole tag to determine pole class, height, and ownership',
    'Describe joint-use pole attachment rights and the role of FCC Part 1.1406 in governing attachment fees',
  ],
};

export default function T01L02_PartsOfAPole() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          A utility pole is basically a vertical traffic jam. Telecom cables, electric
          distribution lines, streetlight wires, cable TV, and fiber all want to share the
          same pole. The NESC (National Electrical Safety Code) draws strict zones on the
          pole — top to bottom — to keep everything separated by enough distance that a
          downed wire in one zone doesn't electrocute someone working in another.
        </p>
        <p className="mt-2">
          Before you can design aerial fiber, stake a route, or understand make-ready work,
          you need to know the pole's anatomy cold. This lesson builds that picture.
        </p>

        <h3 className="mt-5 font-semibold">Building on T01.L01</h3>
        <p className="text-sm text-slate-300/90">
          In T01.L01, we learned that <strong>OSP (Outside Plant)</strong> is all fiber infrastructure between buildings. Now we're zooming in on one of the most critical OSP structures: the utility pole itself.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym / Term</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NESC</td>
              <td className="px-3 py-2">National Electrical Safety Code</td>
              <td className="px-3 py-2">IEEE-published code (adopted by most states) that sets vertical clearance, loading, and attachment rules for overhead utility lines including fiber</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Sag</td>
              <td className="px-3 py-2">—</td>
              <td className="px-3 py-2">How far a cable droops below the straight line between two attachment points. Measured in feet at midspan. Every aerial cable sags — the question is how much.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">FDH</td>
              <td className="px-3 py-2">Fiber Distribution Hub</td>
              <td className="px-3 py-2">A pole-mounted or ground-mounted cabinet where feeder fiber is split and distributed to drops</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The three zones on a pole (top to bottom)</h3>
        <p className="mt-2">
          The NESC divides a shared utility pole into three vertical zones. Each zone is
          reserved for a different type of equipment. Think of it like a building's floors:
          each floor has its own rules about who's allowed and what they can do there.
        </p>
        <div className="mt-3 space-y-3">
          <div className="p-3 border border-red-400/30 bg-red-400/5 rounded-lg">
            <p className="font-semibold text-red-300">Zone 1 — Supply Space (Top)</p>
            <p className="text-sm text-slate-300/90 mt-1">
              High-voltage electric power lines live here. Primary distribution voltages
              (4 kV to 35 kV typical) are the top attachments. Only licensed electricians
              working for the electric utility can touch this zone. The NESC requires a
              minimum <strong>40-inch vertical separation</strong> between the bottom of the
              supply space and the top of the communication space (in most configurations).
              This gap is sometimes called "climbing space."
            </p>
          </div>
          <div className="p-3 border border-yellow-400/30 bg-yellow-400/5 rounded-lg">
            <p className="font-semibold text-yellow-300">Zone 2 — Climbing Space (Middle)</p>
            <p className="text-sm text-slate-300/90 mt-1">
              A minimum clear zone between supply and communication attachments that allows
              linemen to safely climb the pole and work without their body bridging the gap
              between high-voltage and telecom equipment. Nothing is attached here — it's a
              required clearance, not an attachment point.
            </p>
          </div>
          <div className="p-3 border border-blue-400/30 bg-blue-400/5 rounded-lg">
            <p className="font-semibold text-blue-300">Zone 3 — Communication Space (Below)</p>
            <p className="text-sm text-slate-300/90 mt-1">
              Telecom cables live here: cable TV, fiber, telephone copper, and secondary electric
              drops (120/240 V service to homes — below the primary but above telecom in most
              configurations). Fiber is always at or near the bottom of the communication space.
              NESC specifies minimum clearances between each attachment. This is where your work lives.
            </p>
          </div>
        </div>

        <h3 className="mt-5 font-semibold">Key terms defined</h3>
        <dl className="mt-2 space-y-3 text-slate-300/90 text-sm">
          <div>
            <dt className="font-semibold text-slate-200">Attachment</dt>
            <dd>Any cable, equipment, or hardware bolted or clamped to the pole. Each attachment
            occupies vertical space on the pole. The pole owner (usually the electric utility)
            controls what can attach and where. Fiber companies must get a permit (pole attachment
            agreement) to install a new attachment.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-200">Span</dt>
            <dd>The horizontal distance between two poles. The cable runs through the air across
            this gap. Spans are typically 150–300 feet in suburban areas, shorter in urban areas,
            and up to 600+ feet in rural areas where poles are farther apart.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-200">Midspan</dt>
            <dd>The middle of a span — the point where the cable is farthest from the two
            pole attachment points. Midspan is where sag is greatest and where minimum ground
            clearance is measured.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-200">Sag</dt>
            <dd>How far the cable droops below the straight horizontal line between the two
            attachment points. Sag is unavoidable — gravity pulls the cable down. Tight cables
            have less sag but more tension (stress on the pole). Loose cables have more sag
            but lower tension. NESC clearance rules set the maximum sag allowed based on the
            cable's height above the ground.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-200">Grade of construction</dt>
            <dd>NESC's classification of how strongly a line must be built. Grade B is the
            standard for power lines; Grade C (less stringent) is used for many telecom
            attachments. Grade governs strength factors for the pole, attachments, and guys.
            (Detail covered in T05.)</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-200">Joint-use</dt>
            <dd>A pole (or conduit system) that is shared by two or more companies — typically
            the electric utility and one or more telecom attachers. Most utility poles in the
            US are joint-use poles. The electric utility owns the pole; telecom companies are
            attachers who pay for the right to use it. Joint-use is the normal situation for
            aerial OSP fiber; a "single-use" pole owned outright by the fiber company is the
            exception, not the rule.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-200">Clearance</dt>
            <dd>The vertical distance between two things on or below a pole — for example,
            the clearance between a fiber cable and the road below it (ground clearance), or
            the clearance between the fiber attachment and the neutral wire above it (vertical
            separation). NESC specifies minimum clearances for every combination of attachment
            type and crossing type. Clearances are always measured at midspan (the sag point),
            not at the attachment point on the pole.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-200">Conduit</dt>
            <dd>A rigid or semi-rigid pipe or tube that protects cables installed underground.
            Fiber cable is often pulled through conduit rather than buried directly. Common
            types: Schedule 40 PVC (economical, standard for buried runs), HDPE (UV-resistant,
            used for exposed risers on poles and HDD bores under roads), and innerduct (smaller
            diameter sub-conduit inside a larger conduit that allows multiple cables to share
            the same bore). Conduit protects cable from physical damage, moisture intrusion,
            and makes future cable replacement easier — you can pull a new cable without
            re-boring or re-trenching.</dd>
          </div>
        </dl>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> NESC specifies exact clearance values in inches between
            attachment types, based on voltage class, loading district, and grade of
            construction. Designers calculate these for every new attachment.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Stakers, make-ready crews, and OSP designers use the
            term "attachment height" loosely to mean the height above ground where a cable is
            bolted to the pole. When someone says "fiber is at 20 feet," they mean the
            attachment height — the point where the cable leaves the pole — not the sag point
            at midspan, which will be lower. New OSP crews often confuse these two heights.
            Always clarify which is being discussed.
          </p>
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Pole Classification — Class and Length</h2>
        <p>
          Poles aren't all the same strength. The NESC (and ANSI O5.1 for wood poles) assigns
          each pole a <strong>class</strong> based on its circumference at a point 6 feet from
          the butt (bottom). Classes run from Class 1 (strongest) to Class 10 (weakest), with
          Class H1–H6 reserved for extra-heavy loads.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm text-slate-300/90">
          <li><strong>Class 1–3:</strong> Common for distribution and transmission poles. Larger circumference = more bending strength.</li>
          <li><strong>Class 4–5:</strong> Lighter-duty service poles (individual customer drops, small feeder runs).</li>
          <li><strong>Class H1–H6:</strong> Heavy-duty poles for high-voltage transmission or special loading conditions.</li>
        </ul>
        <p className="mt-2 text-sm text-slate-300/90">
          Poles are also rated by length. Common lengths: 30, 35, 40, 45, 50, 55, 60 feet.
          Setting depth is typically 10% of pole length plus 2 feet (a 40-foot pole is set
          6 feet deep, leaving 34 feet above ground). Source: ANSI O5.1.
        </p>

        <h3 className="mt-5 font-semibold">Who owns the pole?</h3>
        <p className="mt-2 text-slate-300/90 text-sm">
          In most of the US, the electric utility owns the pole. Telecom companies (including
          fiber ISPs) are <em>attachers</em> — they pay annual attachment fees (set by FCC
          rules under 47 CFR 1.1406, with §§1.1409-1.1410 apportioning specific cost inputs
          into that rate formula) for the right to put their cable on someone else's pole.
          Some joint-use arrangements involve multiple owners. Before any fiber attachment,
          you need a pole attachment agreement and a make-ready permit from the pole owner.
          (Make-ready is covered in detail in T08.)
        </p>

        <h3 className="mt-5 font-semibold">Reading a pole tag</h3>
        <p className="mt-2 text-slate-300/90 text-sm">
          Every pole has a metal or painted tag showing: the pole number (usually a unique ID
          for that pole in that utility's system), sometimes the class and species, and sometimes
          the year installed. Stakers photograph pole tags as part of the field survey so the
          design package references the pole the utility actually has in its records.
          Discrepancies between a pole tag and the utility's GIS records are common — always
          reconcile before submitting make-ready applications.
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper — The Neutral</h2>
        <p>
          Between the supply space and the communication space, you'll typically see a wire
          called the <strong>neutral</strong>. The neutral is the return path for the electric
          distribution system. It's at a lower voltage than the primary conductors but it's
          not at zero volts — under fault conditions it can carry dangerous current.
        </p>
        <p className="mt-2">
          The neutral is often the lowest conductor in the supply space or immediately below
          it. For fiber crews, knowing where the neutral is matters because:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1 text-sm text-slate-300/90">
          <li>The neutral is the reference point for measuring communication-space attachment heights in NESC calculations.</li>
          <li>A messenger wire (the steel wire that carries aerial fiber) must maintain NESC-specified clearance from the neutral.</li>
          <li>In some rural areas (particularly RUS-program electric grids), the neutral wire is also the <strong>MGN (Multi-Grounded Neutral)</strong> — grounded at every pole. Bonding fiber cable messengers to an MGN is common in RUS areas and has specific grounding requirements (covered in T14).</li>
        </ul>
        <p className="mt-2 text-sm text-slate-300/90">
          Source: NESC C2-2023 §§23, 235; RUS Bulletin 1751F-630 §6.
        </p>
      </section>

      {/* ── KEY TERMS FLASHCARDS ────────────────────────────────────────── */}
      <Flashcard
        deckId="T01-L02"
        cards={[
          { id: 'T01-L02-FC-pole', front: 'Pole (utility pole)', back: 'A wooden, concrete, or steel vertical structure (typically 30–60 feet tall) that supports overhead utility lines including electric power, telecom, and fiber optic cable. Most poles in the US are jointly owned by the electric utility (owner) and shared with telecom attachers who pay annual fees. Poles are classified by strength (Class 1–10) and must comply with NESC loading, clearance, and attachment requirements.' },
          { id: 'T01-L02-FC-nesc', front: 'NESC', back: 'National Electrical Safety Code — IEEE-published code (adopted by most states) that sets vertical clearance, loading, and attachment rules for overhead utility lines including fiber.' },
          { id: 'T01-L02-FC-attachment', front: 'Attachment', back: 'Any cable, equipment, or hardware bolted or clamped to a utility pole. Each attachment occupies vertical space on the pole. Fiber companies must hold a pole attachment agreement to install a new attachment.' },
          { id: 'T01-L02-FC-span', front: 'Span', back: 'The horizontal distance between two poles that a cable crosses through the air. Typically 150–300 ft in suburban areas, up to 600+ ft in rural areas.' },
          { id: 'T01-L02-FC-midspan', front: 'Midspan', back: 'The middle of a span — the point farthest from the two attachment poles, where the cable sags the most and where minimum ground clearance is measured.' },
          { id: 'T01-L02-FC-sag', front: 'Sag', back: 'How far a cable droops below the straight horizontal line between two attachment points. Tight cables have less sag but more tension; loose cables have more sag but lower tension. Ground clearance is measured at midspan (the sag point), not at the attachment.' },
          { id: 'T01-L02-FC-grade', front: 'Grade of construction', back: 'NESC\'s classification of how strongly a line must be built. Grade B is standard for power lines; Grade C for many telecom attachments. Governs strength factors for pole, attachments, and guys.' },
          { id: 'T01-L02-FC-climbing-space', front: 'Climbing space', back: 'The mandatory clearance zone between the supply space and communication space on a shared pole. Nothing is attached here — it\'s a required gap that allows linemen to safely climb without bridging the two zones.' },
          { id: 'T01-L02-FC-comm-space', front: 'Communication space', back: 'The lowest zone on a shared utility pole where telecom cables attach: cable TV, fiber, telephone copper. Fiber is typically the bottom-most attachment. Governed by NESC minimum vertical separation requirements.' },
          { id: 'T01-L02-FC-supply-space', front: 'Supply space', back: 'The top zone on a shared utility pole where high-voltage primary power lines (4–35 kV) attach. Only licensed utility electricians work in this zone. NESC requires minimum separation from the top of the communication space.' },
          { id: 'T01-L02-FC-neutral', front: 'Neutral', back: 'The return conductor for the electric distribution system, typically the lowest supply-space conductor. In RUS areas this is often the MGN (Multi-Grounded Neutral). Fiber messenger wires must maintain NESC clearance from the neutral.' },
          { id: 'T01-L02-FC-pole-class', front: 'Pole class', back: 'NESC / ANSI O5.1 classification of pole strength based on circumference 6 ft from the butt. Class 1 is strongest; Class 10 is weakest. Classes H1–H6 are for extra-heavy loads.' },
          { id: 'T01-L02-FC-joint-use', front: 'Joint-use', back: 'A pole or conduit system shared by two or more companies — typically the electric utility (owner) and one or more telecom attachers. Most US utility poles are joint-use. Fiber companies pay annual attachment fees under FCC Part 1.1406 to attach to joint-use poles.' },
          { id: 'T01-L02-FC-clearance', front: 'Clearance', back: 'The vertical distance between two things on or below a pole — between a cable and the road beneath it (ground clearance), or between a fiber attachment and the neutral above it (vertical separation). NESC specifies minimum clearances for every combination. Always measured at midspan (the sag point), not at the attachment point.' },
          { id: 'T01-L02-FC-conduit', front: 'Conduit', back: 'A rigid or semi-rigid pipe that protects underground cables. Common types: Schedule 40 PVC (buried runs), HDPE (exposed risers, HDD bores), innerduct (sub-conduit inside a larger bore). Allows cable replacement without re-boring or re-trenching.' },
        ]}
      />

      {/* ── POLE ZONE BREAKDOWN ─────────────────────────────────────────── */}
      <div className="lesson-callout">
        <h4>Anatomy of a Shared Utility Pole — Zone Breakdown</h4>
        <p>A joint-use utility pole is divided into vertical zones from top to bottom. Understanding these zones is foundational for every OSP job — where you can attach, where you can't, and who owns what.</p>
        <ol>
          <li>
            <strong>Supply space</strong> — High-voltage primary distribution lines (typically 4–35 kV) attach at the top of the pole. Only electric utility linemen work in this zone. NESC requires a minimum separation from the top of the communication space. Never approach this zone without utility clearance and proper PPE.
          </li>
          <li>
            <strong>Neutral wire</strong> — The return conductor for the electric distribution system, typically the lowest conductor in the supply space. In RUS-program areas this is often the MGN (Multi-Grounded Neutral) — grounded at every pole. Fiber messenger wires must maintain NESC clearance from the neutral. In some areas, messenger bonding connects to the neutral/MGN.
          </li>
          <li>
            <strong>Climbing space</strong> — A mandatory clearance zone between supply and communication attachments. Nothing is attached here — it's a required gap that allows linemen to safely climb and work without their body bridging the two zones. NESC specifies minimum climbing space dimensions.
          </li>
          <li>
            <strong>Communication space</strong> — Where telecom cables attach: cable TV, fiber, telephone copper. Fiber is typically the lowest attachment in this zone. The NESC specifies minimum vertical separation between each attachment type. This is where OSP fiber crews work.
          </li>
          <li>
            <strong>Fiber cable / bottom attachment</strong> — Aerial fiber is usually the bottom-most attachment in the communication space. The cable hangs between two poles via a steel or dielectric messenger wire. Attachment height is measured at the pole; sag at midspan pulls the cable lower, setting the ground clearance.
          </li>
          <li>
            <strong>Midspan / sag</strong> — At midspan, the cable sags below the attachment height due to gravity. Ground clearance is measured at this lowest point. NESC Rule 232 / Table 232-1 requires minimum clearances above roads, sidewalks, and other surfaces (approximately 15.5 ft for telecom over traffic lanes per current NESC editions; verify the adopted edition before design lock). Actual sag varies with span length, cable weight, temperature, and ice/wind loading — always calculate sag for each specific span using the installed cable's sag-tension tables.
          </li>
        </ol>
      </div>

      {/* ── PRACTICE QUIZ ───────────────────────────────────────────────── */}
      <GatedAssessment
        courseId="T01"
        assessmentId="T01-L02"
        title="T01.L02 Check — Parts of a Pole"
        fallback={
        <Quiz
          title="T01.L02 Check — Parts of a Pole"
          mode="multiple-choice"
          questions={[
            {
              id: 'T01-L02-Q1',
              type: 'mc',
              prompt:
                'On a shared utility pole, where does fiber optic cable typically attach relative to electric power lines?',
              choices: [
                'At the very top — fiber gets priority because it is more sensitive to interference',
                'In the supply space alongside primary power conductors',
                'In the communication space, below the climbing space, below primary power and the neutral',
                'Directly below the primary conductors with no required separation',
              ],
              answerIndex: 2,
              explanation:
                'Fiber is a telecom cable and attaches in the communication space, which is the lowest zone on the pole. Supply (power) lines are at the top. A required climbing space separates the two zones. NESC clearance rules specify the minimum separation between the communication space and the supply space.',
              citation: 'NESC C2-2023 §§23, 235.',
            },
            {
              id: 'T01-L02-Q2',
              type: 'mc',
              prompt:
                'A cable is attached to a pole at 24 feet above the ground. At midspan, the cable sags to 20 feet above the ground. The midspan clearance above a public road at that location must be at least approximately 15.5 feet for telecom under traffic lanes per NESC Rule 232 / Table 232-1 (values may update each 5-year NESC revision; verify with the current adopted edition before design lock). Does this installation pass?',
              choices: [
                'No — the attachment height of 24 feet is below the minimum 25-foot rule',
                'Yes — 20 feet of midspan clearance exceeds the 15.5-foot minimum',
                'No — the 4-foot sag exceeds the maximum allowable sag of 3 feet',
                'Yes — but only if the cable is lashed to a steel messenger',
              ],
              answerIndex: 1,
              explanation:
                'Ground clearance is measured at midspan — the lowest point — not at the attachment point. The 20-foot midspan clearance exceeds the NESC minimum of approximately 15.5 feet for telecom cable over a traffic lane (NESC Rule 232 / Table 232-1; verify exact value against the current adopted NESC edition before design lock), so this installation passes on clearance. (Other factors like span length and loading district also affect the full design calculation.)',
              citation: 'NESC C2-2023 Rule 232 / Table 232-1 (clearances over roads; values subject to revision each 5-year NESC cycle).',
              fieldNote:
                'Crews often say "cable is at 22 feet" meaning attachment height. Always ask: "Is that attachment height or midspan clearance?" They are different numbers. A 4-foot sag on a 22-foot attachment = 18 feet midspan — different answer for your compliance check.',
            },
            {
              id: 'T01-L02-Q3',
              type: 'fill-in-blank',
              prompt:
                'The required open gap between the supply space and communication space on a shared utility pole, which allows linemen to safely climb without their body bridging the two zones, is called the ____ space.',
              answer: 'climbing',
              answerDisplay: 'climbing',
              explanation:
                'The climbing space is a mandatory clearance zone — nothing is attached in it. NESC specifies its minimum dimensions. Violating climbing space requirements is a serious compliance failure that endangers every person who climbs that pole.',
              citation: 'NESC C2-2023 §§23, 236.',
            },
            {
              id: 'T01-L02-Q4',
              type: 'mc',
              prompt:
                'Who typically OWNS the utility poles that fiber companies attach to in most US markets?',
              choices: [
                'The fiber company, since they installed the fiber',
                'The local government (city or county) as public infrastructure',
                'The electric utility — fiber companies pay annual attachment fees for the right to use the pole',
                'BICSI, as the standard-setting body for OSP infrastructure',
              ],
              answerIndex: 2,
              explanation:
                'In most US markets, the electric utility owns the poles. Fiber companies are "attachers" who pay annual attachment fees under FCC Part 1.1406 (the pole attachment rate formula, with §§1.1409-1.1410 apportioning specific cost inputs). Before installing fiber, the fiber company must obtain a pole attachment agreement and make-ready permit from the pole owner. Make-ready work (moving or adjusting existing attachments to make room for new fiber) is often the most time-consuming and expensive part of an aerial fiber project.',
              citation: '47 CFR 1.1406; NESC C2-2023 §23.',
            },
          ]}
        />
        }
      />

      {/* ── TYING IT TOGETHER ─────────────────────────────────────────── */}
      <div className="lesson-callout mt-8 bg-blue-400/5 border border-blue-400/30">
        <h4>Tying It Together: From OSP Concept to Pole Reality</h4>
        <p className="text-sm text-slate-300/90">
          In T01.L01 we established what OSP means — all fiber outside buildings. In this lesson, you've learned the anatomy of the primary structure that carries OSP fiber in aerial networks: the utility pole. The three zones (supply, climbing, communication), the sag formula, and the NESC clearance rules are the foundation for everything that comes next in fiber design, permitting, and construction. Before staking a route or designing a single span, a field crew must see a pole and instantly know where fiber can attach, what make-ready work is needed, and why clearance matters. That's what this lesson builds.
        </p>
      </div>

    </LessonLayout>
  );
}
