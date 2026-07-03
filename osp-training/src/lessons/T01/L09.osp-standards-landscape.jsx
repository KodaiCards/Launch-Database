// Migrated from M02 §2.1 partial — standards overview content expanded for T01 foundation context
// T01.L09 — OSP Standards Landscape
// Foundation lesson: what each standards body governs, why it matters, how they interact

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import ReferencesBlock from '../../components/ReferencesBlock.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import GatedAssessment from '../../components/primitives/GatedAssessment.jsx';

export const meta = {
  id: 'T01.L09',
  course_id: 'T01',
  title: 'OSP Standards Landscape',
  order: 9,
  lesson_type: 'foundation',
  prerequisites: ['T01.L08'],
  vocabulary_introduced: [
    'IEEE',
    'NFPA',
    'ITU-T',
    'ICEA',
    'FCC',
    'USACE',
    'CFR',
    'ANSI',
    'code adoption',
    'Form 307',
    'Form 740',
    'Form 740c',
    '7 CFR 1753.49',
    'Form 565',
    'Form 524',
    'Form 1744',
    'Form 1755-A',
  ],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'NESC', source_lesson_id: 'T01.L02' },
    { term: 'RUS', source_lesson_id: 'T01.L01' },
    { term: 'TIA', source_lesson_id: 'T01.L08' },
    { term: 'NEC', source_lesson_id: 'T01.L08' },
    { term: 'BICSI', source_lesson_id: 'T01.L01' },
    { term: 'FOA', source_lesson_id: 'T01.L08' },
    { term: 'AHJ', source_lesson_id: 'T01.L08' },
    { term: 'ROW', source_lesson_id: 'T01.L08' },
    { term: 'NEPA', source_lesson_id: 'T01.L08' },
    { term: 'NHPA', source_lesson_id: 'T01.L08' },
    { term: 'ESA', source_lesson_id: 'T01.L08' },
  ],
  estimated_minutes: 20,
  learning_objectives: [
    'Map the OSP standards stack by work activity: identify which code governs aerial lines (NESC), underground conduit (NEC), RUS-funded design (1751F-series), fiber cabling (TIA), and environmental review (NEPA/NHPA/ESA)',
    'Explain how a standard becomes legally enforceable through state or local code adoption by reference',
    'Identify the USACE Section 404 / NWP 57 permit process and explain when a fiber project requires Corps authorization',
    'Describe what to do when two applicable standards conflict and explain which authority (AHJ) determines which code prevails',
  ],
};

export const key_terms = [
  { term: 'IEEE', definition: 'Institute of Electrical and Electronics Engineers — publishes the NESC (C2), the code governing aerial utility line clearances, loading, and construction for OSP work.' },
  { term: 'NFPA', definition: 'National Fire Protection Association — publishes the NEC (NFPA 70), which governs electrical installations including cable entries into buildings, grounding, and bonding. Adopted by most jurisdictions.' },
  { term: 'ITU-T', definition: 'International Telecommunication Union – Telecommunication Standardization Sector — publishes the G-series fiber standards used globally (G.652.D for SMF, G.984 for GPON). International body; TIA aligns with ITU-T specs for North American use.' },
  { term: 'ICEA', definition: 'Insulated Cable Engineers Association — publishes cable construction standards including ICEA S-87-640 (OSP fiber cable construction). Not a regulatory body but widely cited in cable specifications and RUS material lists.' },
  { term: 'FCC', definition: 'Federal Communications Commission — regulates pole attachment rates (47 CFR 1.1406) and access/make-ready timelines including one-touch make-ready (OTMR, 47 CFR 1.1411), plus spectrum licensing. Critical authority for any project attaching to utility poles.' },
  { term: 'USACE', definition: 'U.S. Army Corps of Engineers — administers Section 404 permits for work disturbing waters of the United States. Key permit for fiber work: NWP 57 pre-authorizes telecommunications line crossings including fiber conduit HDD bores under navigable waterways.' },
  { term: 'CFR', definition: 'Code of Federal Regulations — the official body of federal rules. OSP-relevant: 47 CFR (FCC telecom/pole attachment), 7 CFR Parts 1737/1738/1740 (RUS program), 29 CFR (OSHA safety), 33 CFR Part 330 (Corps Nationwide Permit program).' },
  { term: 'ANSI', definition: 'American National Standards Institute — coordinates voluntary standards accreditation in the US. ANSI O5.1 governs wood utility pole specifications. Many TIA and IEEE standards are also ANSI-accredited.' },
  { term: 'code adoption', definition: 'The process by which a state or jurisdiction officially incorporates a standards document into law. Until adopted, a standard is voluntary; after adoption it is legally enforceable in that jurisdiction.' },
  { term: 'Form 307', definition: 'Bid Bond. Required surety submitted with a bid on a RUS construction contract — guarantees the contractor will enter into the construction contract at the bid price if awarded.' },
  { term: 'Form 740', definition: 'Construction Contract. Awarded construction agreement between RUS borrower and contractor — establishes scope, schedule, payment terms, and RUS oversight rights. The master document binding all parties to the project.' },
  { term: 'Form 740c', definition: 'Contractor Closeout. Contractor declares work complete and releases borrower from contractor claims — final contractor certification before RUS final inspection. Reconciles all change orders against the original contract.' },
  { term: '7 CFR 1753.49', definition: 'Closeout documents. The governing telecom-program regulation for RUS project close-out: certified as-built drawings, splice records, OTDR test records, and permit copies, PE-signed, cross-checked against invoices — required before RUS advances final funds and the client accepts the network. (Note: RUS Form 219, "Inventory of Work Orders," is a separate Electric Program form under 7 CFR 1726.405 — not a telecom close-out document.)' },
  { term: 'Form 565', definition: 'Compliance Statement. Borrower certifies project complied with all approved requirements, standards, and RUS conditions — the final compliance affidavit confirming all loan and design conditions were met.' },
  { term: 'Form 524', definition: 'Plans + Specifications Approval Request. Plans and specifications submitted to RUS for review and approval before construction — RUS must approve design before construction begins. Carries PE stamp and RUS approval signature.' },
  { term: 'Form 1744', definition: 'Loan Agreement Certifications. Borrower certifies loan-agreement-specific compliance items at advance — certifies the borrower has met all loan preconditions before RUS advances funds for construction.' },
  { term: 'Form 1755-A', definition: 'Materials Approval. Pre-approved materials list and materials acceptance certification — RUS approves cable type, conduit, poles, and other long-lead items before procurement. Ensures materials comply with RUS standards.' },
];

export default function T01L09_OspStandardsLandscape() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          When you're doing OSP work, you're operating under a stack of rules from different
          organizations — the federal government, IEEE, NFPA, TIA, ITU-T, USDA. Each one
          governs a different part of the work. Knowing WHICH rules apply to WHICH part of
          the job is what separates a crew that builds confidently from a crew that builds
          and hopes for the best.
        </p>
        <p className="mt-2">
          Think of it like driving. You follow traffic laws (federal and state), vehicle
          equipment standards (federal DOT), and road design standards (AASHTO). They all
          apply simultaneously, each to a different aspect of the same activity. OSP is the
          same — multiple standards, multiple agencies, all at once. This lesson maps the
          landscape so you know who governs what.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">Role in OSP</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">IEEE</td>
              <td className="px-3 py-2">Institute of Electrical and Electronics Engineers</td>
              <td className="px-3 py-2">Publishes the NESC (C2) and many fiber/networking standards. A global professional and standards organization.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NFPA</td>
              <td className="px-3 py-2">National Fire Protection Association</td>
              <td className="px-3 py-2">Publishes the NEC (NFPA 70) and fire safety standards. The NEC governs building electrical installations including grounding and OSP cable entry into buildings.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ITU-T</td>
              <td className="px-3 py-2">International Telecommunication Union — Telecommunication Standardization Sector</td>
              <td className="px-3 py-2">UN agency that publishes international fiber standards: G.652 (SMF), G.657 (bend-insensitive SMF), G.984 (GPON), and many more. ITU-T G-series standards govern the physical fiber you're installing.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ICEA</td>
              <td className="px-3 py-2">Insulated Cable Engineers Association</td>
              <td className="px-3 py-2">Publishes cable construction standards: ICEA S-87-640 (OSP fiber cable), ICEA P-32-382 (sheath adhesion), and others. OSP cable specs reference ICEA standards to define how the cable is built and what it must withstand.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">FCC</td>
              <td className="px-3 py-2">Federal Communications Commission</td>
              <td className="px-3 py-2">Federal agency regulating communications. Governs pole attachment access/make-ready timelines (47 CFR 1.1411 — OTMR rules) and attachment rate/fee formulas (47 CFR 1.1406), plus spectrum and telecommunications licensing.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">USACE</td>
              <td className="px-3 py-2">US Army Corps of Engineers</td>
              <td className="px-3 py-2">Federal agency regulating navigable waters and wetlands. Nationwide Permit 57 (NWP 57; replaces former NWP 12 scope; 2021 NWP package reissued in 2026 NWP package effective March 15, 2026, core scope unchanged) authorizes telecommunications line crossings of waters of the US, including most fiber conduit HDD crossings of rivers and streams.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">CFR</td>
              <td className="px-3 py-2">Code of Federal Regulations</td>
              <td className="px-3 py-2">The codification of US federal regulations, organized by title. "47 CFR Part 1" = Title 47 (Telecommunications), Part 1. FCC rules are in 47 CFR; OSHA rules in 29 CFR; USDA/RUS rules in 7 CFR.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ANSI</td>
              <td className="px-3 py-2">American National Standards Institute</td>
              <td className="px-3 py-2">US national standards body that accredits standards from TIA, IEEE, NFPA, and others. "ANSI/TIA-568" means TIA-568 was also approved as an ANSI standard. ANSI O5.1 governs wood utility pole specifications.</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The standards stack — who governs what</h3>
        <div className="mt-3 space-y-4 text-sm">
          <div className="p-4 border border-blue-400/30 bg-blue-400/5 rounded-lg">
            <p className="font-semibold text-blue-300">Aerial attachments and overhead line design</p>
            <p className="text-slate-300/90 mt-1">
              <strong>NESC (IEEE C2)</strong> — the controlling code. Clearances, loading,
              grades of construction, climbing space. Most states adopt NESC by reference in
              state utility regulations. Violating NESC is a regulatory violation, not just
              a "best practice" deviation.
            </p>
            <p className="text-slate-300/90 mt-1">
              <strong>ANSI O5.1</strong> — wood utility pole specifications (class, species,
              preservative treatment). Referenced in NESC for pole strength calculations.
            </p>
          </div>
          <div className="p-4 border border-green-400/30 bg-green-400/5 rounded-lg">
            <p className="font-semibold text-green-300">Fiber cable specifications</p>
            <p className="text-slate-300/90 mt-1">
              <strong>ITU-T G.652 / G.657</strong> — fiber optical performance specs (attenuation,
              dispersion, geometry). G.652.D is the standard OSP SMF. G.657.A1 is the
              bend-insensitive SMF for drop cables. Manufacturers certify that their fiber
              meets these ITU-T specs.
            </p>
            <p className="text-slate-300/90 mt-1">
              <strong>ICEA S-87-640</strong> — cable construction standard (how the cable
              is built, what environmental performance it must meet). RUS's accepted-materials
              list (7 CFR Part 1755, RUS Bulletin 344-2) references ICEA for qualification testing.
            </p>
            <p className="text-slate-300/90 mt-1">
              <strong>TIA-598-D</strong> — fiber color-coding standard (the 12-color sequence
              for buffer tubes and individual fibers). Every splicer uses TIA-598 daily.
            </p>
          </div>
          <div className="p-4 border border-yellow-400/30 bg-yellow-400/5 rounded-lg">
            <p className="font-semibold text-yellow-300">Cable testing and acceptance</p>
            <p className="text-slate-300/90 mt-1">
              <strong>TIA-568.3-D</strong> — the cabling standard that defines Tier 1 (OLTS)
              and Tier 2 (OTDR) testing for fiber links. Specifies insertion loss limits and
              OTDR bidirectional averaging requirements for acceptance testing.
            </p>
            <p className="text-slate-300/90 mt-1">
              <strong>IEC 61300-3-35</strong> — end-face inspection standard (connector
              cleanliness zones, pass/fail criteria). Used during testing and troubleshooting
              for connector inspection.
            </p>
          </div>
          <div className="p-4 border border-orange-400/30 bg-orange-400/5 rounded-lg">
            <p className="font-semibold text-orange-300">RUS-funded project requirements</p>
            <p className="text-slate-300/90 mt-1">
              <strong>RUS Bulletin 1751F-630</strong> — the primary engineering bulletin for
              aerial and underground OSP on RUS-funded telecom projects. Covers design
              requirements, accepted cable types, construction specifications, and close-out
              documentation. If you're working on a RUS-funded fiber project, this is the
              document that defines what's acceptable.
            </p>
            <p className="text-slate-300/90 mt-1">
              <strong>RUS Bulletin 1751F-635</strong> — underground plant on RUS-funded projects.
            </p>
            <p className="text-slate-300/90 mt-1">
              <strong>RUS accepted-materials program (7 CFR Part 1755; RUS Bulletin 344-2)</strong> —
              materials used on RUS-funded projects must either be on the RUS accepted
              products list or obtain RUS approval. (RUS Bulletin 1753F-201 is a distinct
              bulletin — "Acceptance Tests and Measurements of Telecommunications Plant" —
              covering acceptance *testing* of completed plant, not the materials list itself.)
            </p>
          </div>
          <div className="p-4 border border-red-400/30 bg-red-400/5 rounded-lg">
            <p className="font-semibold text-red-300">Permitting and environmental</p>
            <p className="text-slate-300/90 mt-1">
              <strong>47 CFR Part 1 (FCC)</strong> — pole attachment rights. OTMR timeline
              (15 business days to complete simple make-ready). Attachment fee calculation.
            </p>
            <p className="text-slate-300/90 mt-1">
              <strong>NEPA (42 U.S.C. §4321)</strong> — environmental review for federally
              funded projects.
            </p>
            <p className="text-slate-300/90 mt-1">
              <strong>USACE NWP 57</strong> — Nationwide Permit 57 ("Electric Utility Line
              and Telecommunications Activities"; replaces former NWP 12 scope for telecom;
              2021 NWP package reissued in 2026 NWP package effective March 15, 2026, core
              scope unchanged) authorizes telecommunications line crossings of waters of the
              US by pre-authorization (subject to conditions). NWP 12 now covers only oil/gas
              pipelines. Most fiber conduit HDD crossings qualify under NWP 57.
            </p>
            <p className="text-slate-300/90 mt-1">
              <strong>State DOT encroachment permits</strong> — each state DOT has its own
              requirements for utility work within state highway ROW. No uniform standard —
              you must look up each state's process.
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> Each standard is distinct and clean. The code citations
            are exact. Compliance is binary: you either meet the requirement or you don't.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Standards conflict, overlap, and reference each other
            in ways that aren't always obvious. Example: NESC governs attachment height.
            TIA-568 governs testing. NEC governs grounding at the building entry. RUS governs
            cable type selection. The state DOT permit governs excavation within the ROW.
            NEPA governs the environmental clearance for the whole project. All five apply
            to the same span of cable. When they conflict, the more stringent standard or
            the AHJ's interpretation wins. When in doubt, ask the PE stamping the design —
            that's exactly why PE review exists.
          </p>
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>How Standards Become Law — Code Adoption</h2>
        <p>
          Standards from organizations like IEEE, NFPA, TIA, and ANSI are written by
          committees of industry experts. But a private-organization standard is not law until
          a government body <strong>adopts</strong> it.
        </p>
        <p className="mt-2 text-sm text-slate-300/90">
          Example: NESC (IEEE C2) is published by IEEE. It becomes legally enforceable when
          a state's public utility commission or legislature adopts it by reference in
          state regulations. Most US states have adopted NESC, but specific editions may
          differ (some states are still on older editions). The AHJ in your state may
          enforce a different NESC edition than a neighboring state.
        </p>
        <p className="mt-2 text-sm text-slate-300/90">
          Similarly, the NEC (NFPA 70) is adopted by states and local jurisdictions on
          different cycles. A building in a rural county might be inspected against a
          2017 NEC edition while a neighboring city uses 2023. Always confirm which edition
          your AHJ is enforcing before designing to a specific code cycle.
        </p>
        <p className="mt-2 text-sm text-slate-300/90">
          RUS bulletins are different: they are federal agency documents (USDA administrative
          rules) that apply directly as loan conditions for RUS-funded projects. They do not
          require state adoption — they apply automatically if RUS funding is involved.
        </p>

        <h3 className="mt-5 font-semibold">Quick reference: standards by work activity</h3>
        <p className="mt-2 text-sm text-slate-300/90">
          Rather than memorizing citation numbers, use this as a map of which body owns which
          part of the job — the exact standard designations are in the References block at the
          end of this lesson if you need to look one up:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm text-slate-300/90">
          <li><strong>Aerial attachment design</strong> — NESC clearance, loading, and grade rules, plus the wood-pole specification standard.</li>
          <li><strong>Cable specification (fiber type)</strong> — ITU-T's fiber performance specs for standard and bend-insensitive single-mode fiber.</li>
          <li><strong>Cable construction</strong> — the ICEA construction standard, plus the RUS accepted-materials program for RUS-funded projects.</li>
          <li><strong>Fiber color coding</strong> — TIA's fiber color-code standard.</li>
          <li><strong>Acceptance testing (loss + OTDR)</strong> — the TIA cabling standard's Tier 1/Tier 2 test annex.</li>
          <li><strong>Connector inspection</strong> — the IEC end-face inspection standard.</li>
          <li><strong>Grounding at building entry</strong> — the NEC's rules for optical fiber entries and grounding electrode systems.</li>
          <li><strong>Overhead line grounding / bonding</strong> — NESC grounding rules plus the RUS aerial construction bulletin.</li>
          <li><strong>Water-crossing permits</strong> — the USACE nationwide permit for telecommunications line crossings.</li>
          <li><strong>Pole attachment fees/timeline</strong> — the FCC's fee formula and OTMR access-timeline rules.</li>
          <li><strong>Infrastructure documentation</strong> — the TIA administration standard, plus the RUS close-out regulation for funded projects.</li>
          <li><strong>RUS-funded project design</strong> — the RUS engineering bulletins for aerial/general and underground plant.</li>
        </ul>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>RUS Forms Landscape — Documentation in RUS-Funded Projects</h2>
        <p>
          RUS-funded projects require specific administrative paperwork at different stages of
          the project lifecycle. Knowing roughly when each piece of paperwork happens — and who
          signs it — matters more day-to-day than memorizing the form numbers themselves (those
          are in the References block at the end of this lesson):
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-3 mb-6 text-sm text-slate-300/90">
          <li><strong>Bid phase:</strong> the contractor posts a bid bond — a surety guaranteeing they'll honor their bid price if awarded the job.</li>
          <li><strong>Pre-construction phase:</strong> RUS reviews and approves the plans and specifications before construction can start, the construction contract is executed between the borrower and contractor, and RUS approves the materials (cable, conduit, poles, and other long-lead items) before the contractor can procure them.</li>
          <li><strong>Construction phase:</strong> the borrower periodically certifies to RUS that loan-agreement conditions are being met as funds are advanced.</li>
          <li><strong>Closeout phase:</strong> the contractor certifies the work is complete and reconciles all change orders, the borrower certifies the whole project complied with every approved requirement, and the certified as-built drawings, splice records, and OTDR test records are assembled and cross-checked against invoices before RUS releases final funds.</li>
        </ul>

        <p className="text-sm text-slate-300/90 mb-4">
          <strong>Book vs. Field:</strong> The textbook sequence follows the phases above in strict order. In practice, easement acquisition and design can overlap with bidding, timelines compress, and a delay in any single piece of paperwork can halt project funding. The PE and borrower's project manager spend as much time managing paper as managing the work itself.
        </p>

        <h3 className="mt-6 font-semibold">When Standards Conflict</h3>
        <p>
          Occasionally two applicable standards will specify different things. The general
          resolution hierarchy for OSP:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm text-slate-300/90">
          <li><strong>Federal law (statute or CFR)</strong> — highest authority. FCC rules on pole attachments override any local ordinance or private contract.</li>
          <li><strong>State law and regulation</strong> — state utility commission orders on NESC adoption; state DOT encroachment permit conditions.</li>
          <li><strong>AHJ's adopted standard edition</strong> — which NESC edition the state utility commission enforces; which NEC edition the local building department enforces.</li>
          <li><strong>RUS requirements (for funded projects)</strong> — RUS loan conditions effectively function as contract requirements. Where RUS is more stringent than the applicable code, the more stringent RUS requirement governs.</li>
          <li><strong>Project specifications</strong> — the engineer's specs for a project can be more stringent than code minimums but not less stringent.</li>
        </ol>
        <p className="mt-2 text-sm text-slate-300/90">
          When in doubt, build to the most stringent applicable requirement, document your
          rationale, and get PE confirmation. This approach protects the project from
          compliance disputes and protects the engineering firm from liability.
        </p>
      </section>

      <ReferencesBlock
        items={[
          { citation: 'NESC C2-2023 §§23, 25, 26', note: 'Aerial attachment design — clearances, loading, and grades of construction.' },
          { citation: 'ANSI O5.1', note: 'Wood utility pole specifications (class, species, dimensions).' },
          { citation: 'ITU-T G.652.D', note: 'Standard single-mode fiber optical performance specification.' },
          { citation: 'ITU-T G.657.A1', note: 'Bend-insensitive single-mode fiber optical performance specification.' },
          { citation: 'ICEA S-87-640', note: 'OSP fiber cable construction standard (physical, mechanical, optical, environmental performance).' },
          { citation: '7 CFR Part 1755 + RUS Bulletin 344-2', note: 'RUS accepted-materials program — cable and other materials must be on the RUS accepted products list (or separately approved) for use on funded projects.' },
          { citation: 'TIA-598-D', note: 'Fiber color-coding standard — the 12-color sequence for buffer tubes and individual fibers.' },
          { citation: 'TIA-568.3-D Annex', note: 'Tier 1 (OLTS) and Tier 2 (OTDR) acceptance-testing requirements for fiber links.' },
          { citation: 'IEC 61300-3-35', note: 'Connector end-face inspection standard — cleanliness zones and pass/fail criteria.' },
          { citation: 'NEC Article 770', note: 'Optical fiber cables and raceways at building entries.' },
          { citation: 'NEC Article 250', note: 'Grounding Electrode System (GES) requirements.' },
          { citation: 'NESC §9 + §215', note: 'Overhead line grounding and bonding requirements.' },
          { citation: 'RUS Bulletin 1751F-630 §6', note: 'RUS-specific overhead grounding/bonding requirements.' },
          { citation: 'USACE NWP 57', note: '"Electric Utility Line and Telecommunications Activities" — pre-authorizes telecommunications line crossings of waters of the US, including most fiber conduit HDD bores (2021 NWP package; reissued in the 2026 NWP package effective March 15, 2026; replaces the former NWP 12 telecom scope).' },
          { citation: '47 CFR 1.1406', note: 'FCC pole-attachment fee/rate formula.' },
          { citation: '47 CFR 1.1411', note: 'FCC one-touch make-ready (OTMR) access-timeline rules.' },
          { citation: 'ANSI/TIA-606-C', note: 'Administration standard for labeling and record-keeping of fiber infrastructure.' },
          { citation: '7 CFR 1753.49', note: 'RUS-funded telecom project closeout documentation requirement.' },
          { citation: 'RUS Bulletin 1751F-630', note: 'Primary RUS engineering bulletin for aerial and general OSP construction.' },
          { citation: 'RUS Bulletin 1751F-635', note: 'RUS engineering bulletin for underground OSP construction.' },
          { citation: 'Form 307', note: 'Bid Bond — surety submitted with a bid, guaranteeing the contractor will honor the bid price if awarded.' },
          { citation: 'Form 740', note: 'Construction Contract — the awarded agreement between RUS borrower and contractor.' },
          { citation: 'Form 740c', note: 'Contractor Closeout — contractor’s completion certification, reconciling change orders against Form 740.' },
          { citation: 'Form 565', note: 'Compliance Statement — borrower’s final affidavit that the project met all approved requirements and RUS conditions.' },
          { citation: 'Form 524', note: 'Plans + Specifications Approval Request — RUS design approval required before construction begins.' },
          { citation: 'Form 1744', note: 'Loan Agreement Certifications — borrower certifies loan preconditions are met at each funding advance.' },
          { citation: 'Form 1755-A', note: 'Materials Approval — RUS approval of materials before the contractor procures them.' },
        ]}
      />

      {/* ── KEY TERMS FLASHCARDS ────────────────────────────────────────── */}
      <Flashcard
        deckId="T01-L09"
        cards={[
          { id: 'T01-L09-FC-ieee', front: 'IEEE', back: 'Institute of Electrical and Electronics Engineers — publishes the NESC (C2), the code governing aerial utility line clearances, loading, and construction for OSP work.' },
          { id: 'T01-L09-FC-nfpa', front: 'NFPA', back: 'National Fire Protection Association — publishes the NEC (NFPA 70), which governs electrical installations including cable entries into buildings, grounding, and bonding. Adopted by most jurisdictions.' },
          { id: 'T01-L09-FC-itu-t', front: 'ITU-T', back: 'International Telecommunication Union – Telecommunication Standardization Sector — publishes the G-series fiber standards used globally (G.652.D for SMF, G.984 for GPON). International body; TIA aligns with ITU-T specs for North American use.' },
          { id: 'T01-L09-FC-icea', front: 'ICEA', back: 'Insulated Cable Engineers Association — publishes cable construction standards including ICEA S-87-640 (OSP fiber cable construction). Not a regulatory body but widely cited in cable specifications and RUS material lists.' },
          { id: 'T01-L09-FC-fcc', front: 'FCC', back: 'Federal Communications Commission — regulates pole attachment rates (47 CFR 1.1406) and access/make-ready timelines including one-touch make-ready (OTMR, 47 CFR 1.1411), plus spectrum licensing. Critical authority for any project attaching to utility poles.' },
          { id: 'T01-L09-FC-usace', front: 'USACE', back: 'U.S. Army Corps of Engineers — administers Section 404 permits for work disturbing waters of the United States. The Nationwide Permit program is codified at 33 CFR Part 330. Key permit for fiber work: NWP 57 — "Electric Utility Line and Telecommunications Activities" — pre-authorizes telecommunications line crossings including fiber conduit HDD bores under navigable waterways (replaces former NWP 12 telecom scope; 2021 NWP package reissued in 2026 NWP package effective March 15, 2026, core scope unchanged). Note: 33 CFR Part 323 covers individual case-by-case Section 404 permits — a separate, more burdensome process that most fiber HDD bores avoid by qualifying under NWP 57.' },
          { id: 'T01-L09-FC-cfr', front: 'CFR', back: 'Code of Federal Regulations — the official body of federal rules. OSP-relevant: 47 CFR (FCC telecom/pole attachment), 7 CFR Parts 1737/1738/1740 (RUS program), 29 CFR (OSHA safety), 33 CFR Part 330 (Corps of Engineers Nationwide Permit program — pre-authorizes standard categories of work in waters of the US, including NWP 57 for telecom line crossings), 33 CFR Part 323 (individual Section 404 permits for specific dredge/fill projects). Note: 36 CFR is National Park Service / NHPA Section 106 historic preservation — not the Corps permitting authority.' },
          { id: 'T01-L09-FC-ansi', front: 'ANSI', back: 'American National Standards Institute — coordinates voluntary standards accreditation in the US. ANSI O5.1 governs wood utility pole specifications. Many TIA and IEEE standards are also ANSI-accredited.' },
          { id: 'T01-L09-FC-code-adoption', front: 'Code adoption', back: 'The process by which a state or jurisdiction officially incorporates a standards document into law. Example: most states adopt the NEC and NESC by reference in their electrical codes. Until adopted, a standard is voluntary; after adoption it is legally enforceable in that jurisdiction.' },
          { id: 'T01-L09-FC-form-307', front: 'Form 307', back: 'Bid Bond. Required surety submitted with a bid on a RUS construction contract — guarantees the contractor will enter into the construction contract at the bid price if awarded. Standard federal procurement requirement.' },
          { id: 'T01-L09-FC-form-740', front: 'Form 740', back: 'Construction Contract. Awarded construction agreement between RUS borrower and contractor — establishes scope, schedule, payment terms, and RUS oversight rights. The master document binding all parties to the project.' },
          { id: 'T01-L09-FC-form-740c', front: 'Form 740c', back: 'Contractor Closeout. Contractor declares work complete and releases borrower from contractor claims — final contractor certification before RUS final inspection. Reconciles all change orders and extras against the original contract.' },
          { id: 'T01-L09-FC-form-219', front: '7 CFR 1753.49', back: 'Closeout documents. Certified as-built drawings, splice records, and OTDR test records showing what was actually built vs. what was contracted. Cross-checked against all invoices. PE-signed, triggers final RUS loan advancement for telecom-program projects. (RUS Form 219 — Inventory of Work Orders, 7 CFR 1726.405 — is a separate Electric Program form, not the telecom close-out document.)' },
          { id: 'T01-L09-FC-form-524', front: 'Form 524', back: 'Plans + Specifications Approval Request. Plans and specifications submitted to RUS for review and approval before construction — RUS must approve design before construction begins. The formal design document carrying PE stamp and RUS approval signature.' },
          { id: 'T01-L09-FC-form-565', front: 'Form 565', back: 'Compliance Statement. Borrower certifies project complied with all approved requirements, standards, and RUS conditions — the final compliance affidavit confirming all loan and design conditions were met. Foundation of RUS audit defensibility.' },
          { id: 'T01-L09-FC-form-1744', front: 'Form 1744', back: 'Loan Agreement Certifications. Borrower certifies loan-agreement-specific compliance items at advance — certifies the borrower has met all loan preconditions before RUS advances funds for construction. May be submitted multiple times as milestones are reached.' },
          { id: 'T01-L09-FC-form-1755', front: 'Form 1755-A', back: 'Materials Approval. Pre-approved materials list and materials acceptance certification — RUS approves the cable type, conduit, poles, and other long-lead items before the contractor procures them. Ensures materials comply with RUS standards.' },
        ]}
      />

      {/* ── PRACTICE QUIZ ───────────────────────────────────────────────── */}
      <GatedAssessment
        courseId="T01"
        assessmentId="T01-L09"
        title="Check — OSP Standards Landscape"
        fallback={
        <Quiz
          title="Check — OSP Standards Landscape"
          mode="multiple-choice"
          questions={[
            {
              id: 'T01-L09-Q1',
              type: 'mc',
              prompt:
                'A fiber project requires crossing a navigable river with an HDD bore. Which federal agency\'s permit (and specific permit type) authorizes this work?',
              choices: [
                'FCC Part 1.1411 — pole attachment authorization',
                'USACE Nationwide Permit 57 (NWP 57) — authorizes telecommunications line crossings of waters of the US, including fiber conduit HDD bores',
                'NESC §32 — underground crossing clearances',
                'RUS closeout documentation (7 CFR 1753.49) — close-out authorization',
              ],
              answerIndex: 1,
              explanation:
                'The US Army Corps of Engineers (USACE) regulates navigable waters and wetlands under Section 404 of the Clean Water Act and Section 10 of the Rivers and Harbors Act. Nationwide Permit 57 (NWP 57 — "Electric Utility Line and Telecommunications Activities"; replaces the former NWP 12 scope post-2021 USACE reissuance) pre-authorizes telecommunications line crossings including fiber conduit HDD bores, subject to conditions. NWP 12 now covers only oil and gas pipelines. Most fiber water crossings qualify under NWP 57 without a full individual permit.',
              citation: 'USACE NWP 57 (2021 NWP package; reissued in 2026 NWP package effective March 15, 2026); 33 CFR Part 330.',
            },
            {
              id: 'T01-L09-Q2',
              type: 'mc',
              prompt:
                'A splicer preparing for work on a RUS-funded project is told the cable must be "RUS-listed." What does this mean in practice?',
              choices: [
                'The cable must be manufactured in the United States',
                'The cable must appear on the RUS accepted products list for fiber cable (7 CFR Part 1755; RUS Bulletin 344-2), meaning it has passed RUS qualification testing and meets RUS performance requirements for use on funded projects',
                'The cable must be labeled with the RUS logo on the outer jacket',
                'The cable must be the lowest-cost option that meets TIA specifications',
              ],
              answerIndex: 1,
              explanation:
                'RUS maintains an accepted products list for materials used on funded projects, governed by 7 CFR Part 1755 and RUS Bulletin 344-2 ("List of Materials Acceptable for Use on Telecommunications Systems of RUS Borrowers"), which references ICEA S-87-640 for qualification testing. Cable not on the RUS accepted list cannot be used on a RUS-funded project without specific RUS written approval. Using non-listed cable on a funded project can result in RUS rejecting the close-out (7 CFR 1753.49) and withholding loan advancement.',
              citation: '7 CFR Part 1755; RUS Bulletin 344-2.',
            },
            {
              id: 'T01-L09-Q3',
              type: 'fill-in-blank',
              prompt:
                'The international standards body that publishes fiber optical performance specifications G.652 (standard SMF) and G.657 (bend-insensitive SMF) is the ____.',
              answer: 'ITU-T',
              answerDisplay: 'ITU-T (International Telecommunication Union — Telecommunication Standardization Sector)',
              explanation:
                'The ITU-T (a UN specialized agency) publishes the G-series recommendations governing optical fiber performance: G.652.D is the dominant standard for single-mode fiber in OSP deployments. G.657.A1 is the bend-insensitive SMF used for FTTH drop cables. Manufacturers certify their fiber to ITU-T specs; designers specify fiber using ITU-T designations on drawings.',
              citation: 'ITU-T G.652 (2024 edition); ITU-T G.657 (2024 edition; most recently revised November 2024).',
            },
            {
              id: 'T01-L09-Q4',
              type: 'mc',
              prompt:
                'When NESC and an RUS Bulletin specify different requirements for the same design element on a RUS-funded project, which generally governs?',
              choices: [
                'The NESC always supersedes RUS — federal electrical codes override program requirements',
                'The RUS bulletin always supersedes NESC — USDA loan conditions override everything',
                'The more stringent requirement governs — RUS requirements function as loan conditions that can be more stringent than code minimums; where RUS exceeds NESC, apply RUS. Where NESC exceeds RUS, apply NESC.',
                'The designer chooses which standard to apply based on cost',
              ],
              answerIndex: 2,
              explanation:
                'Both NESC and RUS requirements represent floors, not ceilings. Where they differ, apply the more stringent requirement and document the rationale. RUS loan conditions legally require compliance with RUS bulletins for funded projects; NESC compliance is required by state utility regulations. A design that meets both is the only acceptable outcome. The PE stamping the drawings is responsible for confirming that the design satisfies all applicable requirements.',
              citation: 'RUS Bulletin 1751F-630 §2 (design requirements); NESC C2-2023 (preface on applicability).',
            },
          ]}
        />
        }
      />

    </LessonLayout>
  );
}
