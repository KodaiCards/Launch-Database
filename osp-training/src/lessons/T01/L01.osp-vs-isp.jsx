// Net-new — T01 Fundamentals & Vocabulary, Lesson 1
// T01.L01 — What is OSP vs. ISP?
// Foundation lesson: defines OSP, ISP, the demarcation boundary, and why the distinction matters.

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import SideBySide from '../../components/primitives/SideBySide.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T01.L01',
  course_id: 'T01',
  title: 'What is OSP vs. ISP?',
  order: 1,
  lesson_type: 'foundation',
  prerequisites: [],
  vocabulary_introduced: [
    'OSP',
    'ISP',
    'outside plant',
    'inside plant',
    'demarcation point',
    'headend',
    'OLT',
    'ONT',
  ],
  vocabulary_assumed: [],
  estimated_minutes: 20,
};

export default function T01L01_OspVsIsp() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Every piece of fiber optic infrastructure in the world falls into one of two
          categories: <strong>Outside Plant (OSP)</strong> or <strong>Inside Plant (ISP)</strong>.
          That's the first dividing line you need to know — because the codes, the safety rules,
          the materials, and the people involved are different on each side.
        </p>
        <p className="mt-2">
          Think of it like plumbing: the water main running under the street is "outside" work.
          The pipes inside your house are "inside" work. They're connected, but different
          crews, different materials, different permits, and different inspectors handle each side.
          Fiber is the same way.
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
              <td className="px-3 py-2 font-mono">OSP</td>
              <td className="px-3 py-2">Outside Plant</td>
              <td className="px-3 py-2">All fiber infrastructure between buildings — aerial on poles, buried in conduit, in manholes</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ISP</td>
              <td className="px-3 py-2">Inside Plant</td>
              <td className="px-3 py-2">Fiber inside a building — data centers, server rooms, horizontal runs to desks</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OLT</td>
              <td className="px-3 py-2">Optical Line Terminal</td>
              <td className="px-3 py-2">The provider's equipment at the headend/central office that originates the fiber signal</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ONT</td>
              <td className="px-3 py-2">Optical Network Terminal</td>
              <td className="px-3 py-2">The device at the customer's premises that converts fiber signal to ethernet — often called the "modem" by customers</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">BICSI</td>
              <td className="px-3 py-2">Building Industry Consulting Service International</td>
              <td className="px-3 py-2">The professional association that publishes OSP and ISP design standards and administers certifications like RCDD and OSP Designer (CFOS/CFOT are FOA credentials, not BICSI)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">RUS</td>
              <td className="px-3 py-2">Rural Utilities Service</td>
              <td className="px-3 py-2">A USDA agency that funds rural telecom infrastructure and publishes the engineering bulletins (1751F-series) that govern how RUS-funded OSP is designed and built</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">OSP: the world between buildings</h3>
        <p className="mt-2">
          Outside plant is everything that lives outdoors, between buildings, or underground
          in public right-of-way. Specifically:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-300/90">
          <li>Fiber cable strung on utility poles (aerial)</li>
          <li>Fiber cable buried directly in the ground or pulled through conduit (underground)</li>
          <li>Manholes, handholes, and vaults that house splices and equipment underground</li>
          <li>Fiber distribution hubs (FDH cabinets) at the curb or in fields</li>
          <li>Drop cables from the pole or pedestal to the customer's building</li>
          <li>The splice cases, closures, and connectors on all of the above</li>
        </ul>
        <p className="mt-2">
          If it's outside and part of the fiber network, it's OSP. This is your world.
          Everything in this training program is about OSP.
        </p>

        <h3 className="mt-5 font-semibold">ISP: the world inside buildings</h3>
        <p className="mt-2">
          Inside plant is everything within a building's four walls. That includes:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-300/90">
          <li>Data center fiber runs between server racks</li>
          <li>Horizontal cabling from the telecom room to office workstations</li>
          <li>Patch panels, distribution frames, and fiber trays inside a building</li>
          <li>Equipment in the main distribution frame (MDF) or intermediate distribution frame (IDF)</li>
        </ul>
        <p className="mt-2">
          ISP is primarily governed by building codes (NEC Article 770 for optical fiber),
          TIA-568/569 standards for commercial buildings, and local fire codes. OSP crews
          generally don't work inside buildings — the ISP trade is a different specialization.
        </p>

        <h3 className="mt-5 font-semibold">The demarcation point</h3>
        <p className="mt-2">
          The <strong>demarcation point</strong> (also called the "demarc") is the exact
          boundary between OSP and ISP — the point where one team's responsibility ends and
          another's begins. In a residential FTTH (fiber-to-the-home) deployment:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-300/90">
          <li>The drop cable from the pole to the house = OSP</li>
          <li>The ONT mounted on the outside of the house or just inside the entrance = demarc</li>
          <li>The ethernet cable from the ONT to the router = customer/ISP responsibility</li>
        </ul>
        <p className="mt-2">
          In a commercial building or carrier central office, the demarc may be a patch panel
          in a telecom room, or a fiber entrance splice at the cable entry point through the
          building's exterior wall.
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> Standards treat "OSP" and "ISP" as clean categories with
            a single demarcation point. RUS Bulletin 1751F-630 defines OSP scope from the
            central office to the customer premises. TIA-568.3-D covers ISP.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> In practice, there's a gray zone. The drop cable entering
            a house may be pulled by an OSP contractor but terminated on an ONT installed by
            an ISP tech. Arguments about who owns a bad splice at the wall penetration — the
            OSP crew or the ISP tech — happen on every job site. Know where the formal demarc
            is, document it in the as-built, and take a photo.
          </p>
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The Signal Flow — Headend to Customer</h2>
        <p>
          Understanding OSP vs. ISP is clearer once you trace where the fiber signal actually
          goes. Here's a simplified FTTH path:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-3 text-slate-300/90">
          <li>
            <strong>Headend / Central Office</strong> — where the provider's active
            equipment lives. The <strong>OLT (Optical Line Terminal)</strong> generates the
            downstream signal and receives the upstream signal. Think of this as the source.
          </li>
          <li>
            <strong>Feeder cable</strong> (OSP) — large-count fiber cable (often 72, 144, or
            288 fibers) running from the headend out to the neighborhood. Aerial on poles or
            buried in conduit. This is trunk infrastructure.
          </li>
          <li>
            <strong>Fiber Distribution Hub (FDH)</strong> (OSP) — a cabinet at the edge of
            a neighborhood where the feeder cable is split (using passive optical splitters)
            into distribution cables that fan out to streets.
          </li>
          <li>
            <strong>Distribution cable</strong> (OSP) — smaller cable (12–48 fibers) running
            from the FDH down each street.
          </li>
          <li>
            <strong>Network Access Point (NAP)</strong> (OSP) — a small closure or
            pedestal on a pole or at the curb where distribution fibers are spliced to
            individual drop cables.
          </li>
          <li>
            <strong>Drop cable</strong> (OSP) — the single-fiber or 2-fiber cable running
            from the NAP to one customer's premises. Aerial (from pole to house) or buried
            (from pedestal to house).
          </li>
          <li>
            <strong>ONT (Optical Network Terminal)</strong> — the demarc device. Sits at the
            customer premises. Converts the fiber signal to ethernet. Everything from the OLT
            to the ONT's fiber port = OSP. Everything beyond the ONT = customer/ISP.
          </li>
        </ol>

        <h3 className="mt-5 font-semibold">Why the distinction matters on the job</h3>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-300/90">
          <li>
            <strong>Different codes govern each side.</strong> OSP is governed by NESC (National
            Electrical Safety Code) for aerial attachments and RUS bulletins for construction
            standards. ISP is governed by NEC Article 770 and TIA-568. Using the wrong code
            on the wrong side of the demarc is a compliance failure.
          </li>
          <li>
            <strong>Different cable ratings.</strong> OSP cable is rated for outdoor UV/moisture
            exposure. ISP cable is rated for riser or plenum fire codes. Running OSP-rated
            cable inside a building violates fire code in most jurisdictions.
          </li>
          <li>
            <strong>Different licensing.</strong> Some states require different contractor
            licenses for OSP vs. ISP work. Know your jurisdiction.
          </li>
          <li>
            <strong>Different testing standards.</strong> OSP links are tested to TIA-568.3-D
            Tier 1 (OLTS loss) and Tier 2 (OTDR trace). ISP horizontal links have different
            acceptance limits. Applying OSP test criteria to ISP runs or vice versa will
            generate incorrect pass/fail results.
          </li>
        </ul>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper — Regulatory Boundaries</h2>
        <p>
          The OSP/ISP boundary has regulatory significance beyond just which standard applies.
          The <strong>FCC's Part 32</strong> accounting rules define "outside plant" as a
          specific plant account category for regulated carriers (Account 2421 — Cable, aerial;
          Account 2422 — Cable, underground; Account 2423 — Cable, buried). Note: Account 2411
          is “Poles” and Account 2441 is “Conduit” — different plant categories, not cable accounts.
          These accounts
          determine depreciation schedules, rate-base inclusion for ratemaking, and how
          infrastructure is reported to regulators.
        </p>
        <p className="mt-2">
          For RUS borrowers, the distinction matters for cost allocation between loan-eligible
          OSP plant and non-loan-eligible ISP equipment. The RUS Loan Agreement specifies which
          plant account categories are covered under the loan. Misclassifying ISP equipment as
          OSP can constitute a loan compliance violation.
        </p>
        <p className="mt-2">
          Source: 47 CFR Part 32 (FCC Uniform System of Accounts); RUS Bulletin 1751F-630 §1.
        </p>
      </section>

      {/* ── KEY TERMS FLASHCARDS ────────────────────────────────────────── */}
      <Flashcard
        deckId="T01-L01"
        cards={[
          { id: 'T01-L01-FC-osp', front: 'OSP', back: 'Outside Plant — all fiber infrastructure between buildings: aerial on poles, buried in conduit, in manholes and vaults, from the headend to the customer demarcation point.' },
          { id: 'T01-L01-FC-isp', front: 'ISP', back: 'Inside Plant — fiber inside a building: data centers, server rooms, horizontal runs to workstations. Governed by NEC Article 770 and TIA-568.' },
          { id: 'T01-L01-FC-outside-plant', front: 'Outside plant', back: 'Everything that lives outdoors, between buildings, or underground in public right-of-way — aerial cable on poles, buried conduit, manholes, FDH cabinets, drop cables, and all their splice cases and connectors.' },
          { id: 'T01-L01-FC-inside-plant', front: 'Inside plant', back: 'Fiber inside a building — data center fiber runs, horizontal cabling to desks, patch panels and distribution frames, MDF/IDF rooms. Different codes, different cable ratings, different testing standards from OSP.' },
          { id: 'T01-L01-FC-demarc', front: 'Demarcation point', back: 'The exact boundary between OSP and ISP — where one team\'s responsibility ends and another\'s begins. In FTTH it\'s typically the ONT at the customer premises. As-built documentation must clearly identify the demarc location.' },
          { id: 'T01-L01-FC-headend', front: 'Headend', back: 'The provider\'s facility — usually a central office or hub site — where the OLT and other active equipment live. The origin of the fiber signal. All OSP infrastructure runs from here outward to customers.' },
          { id: 'T01-L01-FC-olt', front: 'OLT', back: 'Optical Line Terminal — the provider\'s active equipment at the headend that originates the downstream signal and receives the upstream signal from all ONTs on that PON. One OLT port serves one feeder fiber (up to 32 or 64 customers via splitters).' },
          { id: 'T01-L01-FC-ont', front: 'ONT', back: 'Optical Network Terminal — the demarc device at the customer premises that converts the fiber signal to ethernet. Often called the "modem" by customers. Everything from the OLT to the ONT\'s fiber port is OSP.' },
        ]}
      />

      {/* ── SIDE BY SIDE ────────────────────────────────────────────────── */}
      <SideBySide
        title="OSP vs. ISP — At a Glance"
        leftLabel="Outside Plant (OSP)"
        rightLabel="Inside Plant (ISP)"
        rows={[
          {
            label: 'Location',
            left: 'Outdoors, on poles, buried underground, in manholes/vaults',
            right: 'Inside buildings — data centers, telecom rooms, office floors',
          },
          {
            label: 'Primary code',
            left: 'NESC (aerial), RUS bulletins (construction), NEC Art. 250/770 at entries',
            right: 'NEC Article 770 (optical fiber), TIA-568/569 (commercial)',
          },
          {
            label: 'Cable rating needed',
            left: 'OSP-rated: UV-resistant, waterproof, outdoor-grade jacket',
            right: 'Riser (OFNR) or plenum (OFNP) for fire code compliance',
          },
          {
            label: 'Typical fiber counts',
            left: 'Feeder: 72–288 fibers; Distribution: 12–48; Drop: 1–4',
            right: 'Horizontal: 2–12 fibers; Backbone: 12–96 fibers',
          },
          {
            label: 'Key active equipment',
            left: 'OLT at headend; FDH at distribution point; ONT at demarc',
            right: 'Switches, routers, patch panels, servers inside building',
          },
          {
            label: 'Who tests it',
            left: 'OSP contractor — OLTS + OTDR per TIA-568.3-D Tier 1/2',
            right: 'Low-voltage ISP contractor — loss test to TIA-568.3-D ISP specs',
          },
        ]}
      />

      {/* ── PRACTICE QUIZ ───────────────────────────────────────────────── */}
      <Quiz
        title="T01.L01 Check — OSP vs. ISP"
        mode="multiple-choice"
        questions={[
          {
            id: 'T01-L01-Q1',
            type: 'mc',
            prompt:
              'A drop cable running from a utility pole down to a house and connecting to an ONT on the exterior wall. Which category does this drop cable fall under?',
            choices: [
              'Inside plant (ISP) — it serves a single customer',
              'Outside plant (OSP) — it runs outdoors between OSP infrastructure and the customer demarc',
              'Neither — drop cables are a special third category',
              'Inside plant (ISP) — because it terminates at the ONT',
            ],
            answerIndex: 1,
            explanation:
              'Drop cables run outdoors from OSP infrastructure (a NAP on a pole or a curb pedestal) to the customer demarc. They are OSP, must be rated for outdoor use, and are built and tested by the OSP contractor. The ONT at the end of the drop is the demarc — the ONT itself is usually the customer-side equipment, but the fiber up to the ONT port is OSP.',
            citation: 'RUS Bulletin 1751F-630 §1 — Scope of outside plant.',
          },
          {
            id: 'T01-L01-Q2',
            type: 'mc',
            prompt:
              'An OSP contractor runs fiber through a building\'s exterior wall and terminates it on a patch panel in the telecom room. Why might this raise a code compliance concern?',
            choices: [
              'OSP contractors are not allowed to touch patch panels — only ISP contractors can do that',
              'OSP-rated cable may not be rated for indoor use — NEC Article 770 requires riser or plenum-rated fiber inside buildings; OSP-only rated cable may not comply',
              'Patch panels are not permitted in telecom rooms by RUS standards',
              'There is no compliance concern — OSP cable is acceptable everywhere',
            ],
            answerIndex: 1,
            explanation:
              'OSP-rated cable is designed for outdoor conditions (UV exposure, moisture, temperature swings) but is not automatically rated for indoor fire-code compliance. NEC Article 770 requires optical fiber inside buildings to be OFNR (riser) or OFNP (plenum) rated. Running OSP-only cable inside a building violates fire code in most jurisdictions unless the cable also carries an indoor rating (dual-rated cable).',
            citation: 'NEC Article 770 (optical fiber cabling); RUS Bulletin 1751F-630 §1.',
          },
          {
            id: 'T01-L01-Q3',
            type: 'fill-in-blank',
            prompt:
              'The boundary point between OSP and ISP infrastructure — where one contractor\'s responsibility ends — is called the ____ point.',
            answer: 'demarcation',
            answerDisplay: 'demarcation',
            explanation:
              'The demarcation point (demarc) is the formal handoff between OSP and ISP. In FTTH, it is typically the ONT or a small fiber termination box at the customer premises entry. As-built documentation must clearly identify the demarc location.',
          },
          {
            id: 'T01-L01-Q4',
            type: 'mc',
            prompt:
              'The OLT (Optical Line Terminal) is located at the provider\'s headend. The ONT (Optical Network Terminal) is located at the customer premises. Between them is a continuous OSP fiber path. Which statement about the OLT is correct?',
            choices: [
              'The OLT is the customer\'s equipment and is installed by the OSP contractor',
              'The OLT is the provider\'s active equipment at the headend that originates and receives the optical signal for all customer connections on that fiber segment',
              'The OLT is the same device as the ONT, just named differently depending on location',
              'The OLT terminates only the feeder cable; distribution cables are served by a different device',
            ],
            answerIndex: 1,
            explanation:
              'The OLT is the provider\'s active equipment at the headend or central office. It originates the downstream optical signal and receives the upstream signal from all ONTs on that PON (Passive Optical Network). The OLT-to-ONT path is entirely OSP fiber. The OSP contractor builds and tests that path but does not install or configure the OLT or ONT equipment — that is done by the provider\'s network team.',
          },
        ]}
      />

    </LessonLayout>
  );
}
