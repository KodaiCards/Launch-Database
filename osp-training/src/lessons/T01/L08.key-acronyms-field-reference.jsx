// Net-new — T01 Fundamentals & Vocabulary, Lesson 8
// T01.L08 — Key Acronyms Field Reference
// Foundation lesson: consolidated acronym glossary — 50+ terms learners will encounter

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T01.L08',
  course_id: 'T01',
  title: 'Key Acronyms Field Reference',
  order: 8,
  lesson_type: 'foundation',
  prerequisites: ['T01.L01', 'T01.L02', 'T01.L03', 'T01.L04', 'T01.L05', 'T01.L06', 'T01.L07'],
  vocabulary_introduced: [
    'SMF',
    'MMF',
    'OTDR',
    'OLTS',
    'MGN',
    'IBT',
    'GES',
    'NESC',
    'NEC',
    'TIA',
    'FOA',
    'CFOT',
    'CFOS',
    'RCDD',
    'USDA',
    'HDPE',
    'ADSS',
    'ROW',
    'AHJ',
    'GIS',
    'LiDAR',
    'FTTH',
    'GPON',
    'XGS-PON',
    'OLT',
    'ONT',
    'FDH',
    'NAP',
    'PE',
    'HDD',
    'PVC',
    'HDPE',
    'LOTO',
    'PPE',
    'NEPA',
    'NHPA',
    'ESA',
    'MUTCD',
  ],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'ISP', source_lesson_id: 'T01.L01' },
    { term: 'OLT', source_lesson_id: 'T01.L01' },
    { term: 'ONT', source_lesson_id: 'T01.L01' },
    { term: 'RUS', source_lesson_id: 'T01.L01' },
    { term: 'BICSI', source_lesson_id: 'T01.L01' },
    { term: 'FDH', source_lesson_id: 'T01.L07' },
    { term: 'NAP', source_lesson_id: 'T01.L07' },
    { term: 'PON', source_lesson_id: 'T01.L07' },
    { term: 'NESC', source_lesson_id: 'T01.L02' },
    { term: 'PE', source_lesson_id: 'T01.L06' },
  ],
  estimated_minutes: 15,
};

export default function T01L08_KeyAcronymsFieldReference() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          OSP is acronym-heavy. Walk into a project meeting without knowing what NESC, RUS,
          OTDR, and MGN stand for, and you'll spend half the time decoding the conversation
          instead of contributing to it. This lesson is your reference sheet — all the acronyms
          you'll encounter across T01–T18, organized by category. Use the flashcards below
          to drill them until they're automatic.
        </p>
        <p className="mt-2">
          Every acronym here has been introduced in earlier T01 lessons or will appear in
          subsequent topics. Think of this lesson as a cheat-sheet you can return to whenever
          a term appears in a later lesson and you need a quick reminder.
        </p>

        <h3 className="mt-5 font-semibold">Fiber types</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-sm">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">SMF</td>
              <td className="px-3 py-2">Single-Mode Fiber</td>
              <td className="px-3 py-2">9 µm core; one propagation mode; used in all OSP long-distance runs; the default for FTTH and carrier networks. ITU-T G.652 / G.657.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">MMF</td>
              <td className="px-3 py-2">Multi-Mode Fiber</td>
              <td className="px-3 py-2">50 or 62.5 µm core; multiple propagation modes; used for short runs inside buildings (data centers, ISP). OM3/OM4/OM5 grades. Not standard for FTTH OSP.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OS2</td>
              <td className="px-3 py-2">Optical Single-mode, class 2</td>
              <td className="px-3 py-2">ISO/IEC 11801 designation for G.652.D SMF. OS2 = the single-mode fiber spec used in OSP and backbone. OS1 = older, looser-spec SMF (rare in modern deployments).</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ADSS</td>
              <td className="px-3 py-2">All-Dielectric Self-Supporting</td>
              <td className="px-3 py-2">Aerial cable with no metallic components; strength members are built in. No separate messenger wire needed; no bonding/grounding required. Common in RUS-program aerial deployments.</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Test instruments and methods</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it does</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-sm">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OTDR</td>
              <td className="px-3 py-2">Optical Time-Domain Reflectometer</td>
              <td className="px-3 py-2">Sends a light pulse into the fiber; measures what bounces back to locate events (splices, bends, breaks) and measure distance and loss. The standard fiber diagnostic instrument. Tier 2 test per TIA-568.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OLTS</td>
              <td className="px-3 py-2">Optical Loss Test Set</td>
              <td className="px-3 py-2">Measures end-to-end insertion loss (total loss through the fiber, connectors, and splices). Requires a light source at one end and power meter at the other. Tier 1 test per TIA-568. Simpler and faster than OTDR but doesn't locate events.</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Electrical and grounding</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-sm">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">MGN</td>
              <td className="px-3 py-2">Multi-Grounded Neutral</td>
              <td className="px-3 py-2">The neutral conductor on a rural electric distribution line, grounded at every pole. In RUS-program areas, fiber messengers are often bonded to the MGN for lightning protection. Introduces grounding obligations at every pole.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">IBT</td>
              <td className="px-3 py-2">Insulated Bonding Transformer</td>
              <td className="px-3 py-2">A device that bonds the messenger to the MGN while isolating the messenger from induced AC voltage. Provides bonding continuity without creating a shock hazard from longitudinal induced voltage. Used at intervals on long aerial runs.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">GES</td>
              <td className="px-3 py-2">Grounding Electrode System</td>
              <td className="px-3 py-2">The combination of ground rods, conductors, and connections that provide a low-resistance path to earth. NEC Article 250 defines GES requirements for buildings; RUS bulletins extend these for OSP installations.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NEC</td>
              <td className="px-3 py-2">National Electrical Code</td>
              <td className="px-3 py-2">NFPA 70 — the US electrical installation code adopted by most jurisdictions. Governs grounding, bonding, cable entry into buildings, and electrical protection for fiber OSP. Different from NESC (overhead utility lines) — both apply to fiber work.</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Standards bodies and codes</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What they govern</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-sm">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NESC</td>
              <td className="px-3 py-2">National Electrical Safety Code</td>
              <td className="px-3 py-2">IEEE C2 — governs overhead utility lines: clearances, attachment heights, loading, grades of construction. The code for aerial OSP. Most states adopt it by reference. Different from NEC.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">TIA</td>
              <td className="px-3 py-2">Telecommunications Industry Association</td>
              <td className="px-3 py-2">Publishes TIA-568 (cabling standards), TIA-598 (fiber color codes), TIA-606 (administration/labeling), TIA-942 (data centers). TIA standards are the primary technical reference for fiber cabling in North America.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">RUS</td>
              <td className="px-3 py-2">Rural Utilities Service (USDA)</td>
              <td className="px-3 py-2">USDA agency that funds rural broadband and electric infrastructure. Publishes the 1751F-series engineering bulletins that govern RUS-funded OSP projects. RUS approval is required for materials, design, and construction on funded projects.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">BICSI</td>
              <td className="px-3 py-2">Building Industry Consulting Service International</td>
              <td className="px-3 py-2">Professional association publishing OSP + ISP design standards; administers RCDD, CFOS, CFOT certifications. The OSPDRM (Outside Plant Design Reference Manual) is a primary design reference.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">FOA</td>
              <td className="px-3 py-2">Fiber Optic Association</td>
              <td className="px-3 py-2">Non-profit that administers CFOT (Certified Fiber Optic Technician) and CFOS (Certified Fiber Optic Specialist) certifications. FOA Reference Guide is a widely used training resource.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">AHJ</td>
              <td className="px-3 py-2">Authority Having Jurisdiction</td>
              <td className="px-3 py-2">The regulatory body or official responsible for enforcing codes in a specific location. Could be the state fire marshal (NEC), state utility commission (NESC), local building department, or the Corps of Engineers (waterway crossings). Different AHJs for different aspects of the same project.</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Construction and survey</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-sm">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">HDD</td>
              <td className="px-3 py-2">Horizontal Directional Drilling</td>
              <td className="px-3 py-2">Boring underground conduit horizontally without open-cut trenching. Used under roads, rivers, and other obstructions. A drill rig bores a pilot hole, then reams it to size and pulls conduit back through.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ROW</td>
              <td className="px-3 py-2">Right-of-Way</td>
              <td className="px-3 py-2">The legal corridor (roadway, utility easement, railroad right-of-way) where infrastructure can be installed. Fiber must stay within permitted ROW boundaries. Encroaching on private property without an easement is a trespass violation.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">GIS</td>
              <td className="px-3 py-2">Geographic Information System</td>
              <td className="px-3 py-2">Software and databases that store geographic data (maps, infrastructure locations) with associated attribute information. Modern OSP design and as-built documentation is GIS-based. Common platforms: Esri ArcGIS, QGIS, Katapult.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">LiDAR</td>
              <td className="px-3 py-2">Light Detection and Ranging</td>
              <td className="px-3 py-2">Remote sensing technology that uses pulsed laser light to measure distances and create 3D point clouds of terrain and structures. Drone-mounted LiDAR is used for pole height measurement, vegetation clearance analysis, and route surveys.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">HDPE</td>
              <td className="px-3 py-2">High-Density Polyethylene</td>
              <td className="px-3 py-2">The plastic used for OSP cable outer jackets and conduit. HDPE resists UV radiation, moisture, and chemical exposure. OSP fiber conduit is typically Schedule 40 PVC or HDPE; innerduct is often corrugated HDPE.</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Safety</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-sm">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">LOTO</td>
              <td className="px-3 py-2">Lockout / Tagout</td>
              <td className="px-3 py-2">OSHA 1910.147 procedure for de-energizing and locking out equipment before working on or near it. Required before any work near energized conductors or powered equipment. Every field worker must be LOTO-trained.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">PPE</td>
              <td className="px-3 py-2">Personal Protective Equipment</td>
              <td className="px-3 py-2">Hard hat, safety glasses, gloves, high-visibility vest, steel-toed boots — the baseline for any field work. Additional PPE (face shield, FR clothing, dielectric gloves) required for specific hazard exposures.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">MUTCD</td>
              <td className="px-3 py-2">Manual on Uniform Traffic Control Devices</td>
              <td className="px-3 py-2">FHWA publication governing traffic control in work zones (signs, cones, flaggers, lane closures). Required any time OSP construction work affects a public road. DOT encroachment permits typically cite MUTCD standards.</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Environmental and permitting</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-sm">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NEPA</td>
              <td className="px-3 py-2">National Environmental Policy Act</td>
              <td className="px-3 py-2">Federal law requiring environmental review of projects using federal funding. RUS-funded fiber projects require NEPA compliance. Most qualify for a Categorical Exclusion (CE) — a streamlined process — rather than a full Environmental Impact Statement.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NHPA</td>
              <td className="px-3 py-2">National Historic Preservation Act</td>
              <td className="px-3 py-2">Section 106 of NHPA requires review of potential impacts on historic properties before federally funded projects proceed. Involves coordination with the State Historic Preservation Officer (SHPO) and Tribal Historic Preservation Officer (THPO) where applicable.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ESA</td>
              <td className="px-3 py-2">Endangered Species Act</td>
              <td className="px-3 py-2">Section 7 consultation required for federally funded projects affecting listed species or critical habitat. FWS IPaC (Information, Planning, and Conservation) tool is used to identify ESA concerns in a project area.</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Certifications — What Each Is For</h2>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Cert</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">Who gets it and why</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-sm">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">RCDD</td>
              <td className="px-3 py-2">Registered Communications Distribution Designer</td>
              <td className="px-3 py-2">BICSI credential for ISP/data-center designers. Covers TIA-568/569/606/607, firestopping, EMC, power-telecom separation. Career credential for ISP and data-center designers. Requires experience + exam + ongoing CEUs.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">CFOT</td>
              <td className="px-3 py-2">Certified Fiber Optic Technician</td>
              <td className="px-3 py-2">FOA entry-level fiber credential. Covers fiber types, connectors, splicing, testing, safety. Good starting credential for field techs moving into fiber work. Written + hands-on exam at an FOA-approved school.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">CFOS/O</td>
              <td className="px-3 py-2">Certified Fiber Optic Specialist / OSP</td>
              <td className="px-3 py-2">FOA specialist credential for OSP splicers and technicians. Requires CFOT plus 2 years field experience. Covers aerial and underground OSP, splice case types, OTDR interpretation, OSP-specific safety.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OSP Designer</td>
              <td className="px-3 py-2">BICSI OSP Designer (no acronym — it's the cert title)</td>
              <td className="px-3 py-2">BICSI credential for OSP design professionals. Covers OSPDRM content: route survey, design, permitting, construction, testing, documentation for outside plant. Relevant to engineers and senior designers on RUS-program projects.</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── FLASHCARDS ───────────────────────────────────────────────────── */}
      <Flashcard
        deckId="T01-L08"
        cards={[
          { id: 'T01-L08-FC-otdr', front: 'OTDR', back: 'Optical Time-Domain Reflectometer — sends a light pulse into fiber, measures reflections to locate and measure events (splices, bends, breaks). Tier 2 test per TIA-568.' },
          { id: 'T01-L08-FC-olts', front: 'OLTS', back: 'Optical Loss Test Set — measures end-to-end insertion loss using a light source and power meter. Tier 1 test per TIA-568. Faster than OTDR but doesn\'t locate events.' },
          { id: 'T01-L08-FC-mgn', front: 'MGN', back: 'Multi-Grounded Neutral — neutral wire on rural electric distribution, grounded at every pole. Fiber messengers bonded to MGN for lightning protection in RUS areas.' },
          { id: 'T01-L08-FC-ibt', front: 'IBT', back: 'Insulated Bonding Transformer — bonds messenger to MGN while isolating from induced AC voltage. Used at intervals on aerial runs.' },
          { id: 'T01-L08-FC-ges', front: 'GES', back: 'Grounding Electrode System — combination of ground rods, conductors, and connections providing a low-resistance path to earth. Governed by NEC Article 250.' },
          { id: 'T01-L08-FC-nesc', front: 'NESC', back: 'National Electrical Safety Code (IEEE C2) — governs aerial utility line clearances, loading, grades of construction. The code for aerial OSP.' },
          { id: 'T01-L08-FC-nec', front: 'NEC', back: 'National Electrical Code (NFPA 70) — governs electrical installations including grounding, bonding, cable entries into buildings. Different from NESC.' },
          { id: 'T01-L08-FC-ahj', front: 'AHJ', back: 'Authority Having Jurisdiction — the regulatory body enforcing codes in a specific location. Could be fire marshal, state utility commission, building department, or Corps of Engineers.' },
          { id: 'T01-L08-FC-row', front: 'ROW', back: 'Right-of-Way — the legal corridor where infrastructure can be installed. Fiber must stay within permitted ROW boundaries.' },
          { id: 'T01-L08-FC-hdd', front: 'HDD', back: 'Horizontal Directional Drilling — boring conduit underground horizontally without open-cut trenching. Used under roads, rivers, and other obstructions.' },
          { id: 'T01-L08-FC-loto', front: 'LOTO', back: 'Lockout/Tagout — OSHA 1910.147 procedure for de-energizing and locking out equipment before working near it. Required near energized conductors.' },
          { id: 'T01-L08-FC-adss', front: 'ADSS', back: 'All-Dielectric Self-Supporting — aerial fiber cable with no metallic components; strength members built in; no separate messenger or grounding required.' },
          { id: 'T01-L08-FC-nepa', front: 'NEPA', back: 'National Environmental Policy Act — requires environmental review of federally funded projects. RUS-funded fiber projects require NEPA CE (Categorical Exclusion) compliance.' },
          { id: 'T01-L08-FC-smf', front: 'SMF', back: 'Single-Mode Fiber — 9 µm core, one propagation mode, used in all OSP long-distance runs. ITU-T G.652.D is the dominant OSP SMF spec.' },
          { id: 'T01-L08-FC-fdh', front: 'FDH', back: 'Fiber Distribution Hub — where feeder fiber connects to distribution cables via passive optical splitters. The junction of an FTTH network.' },
          { id: 'T01-L08-FC-gpon', front: 'GPON', back: 'Gigabit Passive Optical Network — the most common FTTH standard in North America. One OLT port serves up to 32 or 64 customers via passive splitters. Up to 2.5 Gb/s downstream shared.' },
          { id: 'T01-L08-FC-mutcd', front: 'MUTCD', back: 'Manual on Uniform Traffic Control Devices (FHWA) — governs work zone traffic control: signs, cones, flaggers, lane closures. Required when construction affects public roads.' },
          { id: 'T01-L08-FC-rcdd', front: 'RCDD', back: 'Registered Communications Distribution Designer — BICSI credential for ISP/data-center designers. Covers TIA-568/569/606/607 content.' },
          { id: 'T01-L08-FC-cfot', front: 'CFOT', back: 'Certified Fiber Optic Technician — FOA entry-level fiber credential. Written + hands-on exam at FOA-approved school.' },
        ]}
      />

      {/* ── PRACTICE QUIZ ───────────────────────────────────────────────── */}
      <Quiz
        title="T01.L08 Check — Key Acronyms"
        mode="drag-match"
        questions={[
          {
            id: 'T01-L08-Q1',
            type: 'dragdrop',
            prompt: 'Match each acronym to its full name.',
            items: [
              { id: 'otdr', label: 'OTDR' },
              { id: 'mgn', label: 'MGN' },
              { id: 'nesc', label: 'NESC' },
              { id: 'loto', label: 'LOTO' },
              { id: 'rus', label: 'RUS' },
            ],
            targets: [
              { id: 'totdr', label: 'Optical Time-Domain Reflectometer' },
              { id: 'tmgn', label: 'Multi-Grounded Neutral' },
              { id: 'tnesc', label: 'National Electrical Safety Code' },
              { id: 'tloto', label: 'Lockout / Tagout' },
              { id: 'trus', label: 'Rural Utilities Service' },
            ],
            correctMap: {
              totdr: 'otdr',
              tmgn: 'mgn',
              tnesc: 'nesc',
              tloto: 'loto',
              trus: 'rus',
            },
            explanation:
              'OTDR = Optical Time-Domain Reflectometer (fiber test instrument). MGN = Multi-Grounded Neutral (electric utility neutral wire grounded at every pole). NESC = National Electrical Safety Code (IEEE C2, aerial utility line code). LOTO = Lockout/Tagout (OSHA 1910.147 safety procedure). RUS = Rural Utilities Service (USDA funding and standards agency for rural OSP).',
          },
          {
            id: 'T01-L08-Q2',
            type: 'mc',
            prompt:
              'An OSP project is federally funded through the RUS program. Which acronym represents the federal environmental review requirement that applies to this project?',
            choices: [
              'MUTCD — the traffic control manual',
              'NEPA — the National Environmental Policy Act requires environmental review of federally funded projects',
              'NESC — the electrical safety code governs all federal utility work',
              'LOTO — lockout/tagout is required before environmental review',
            ],
            answerIndex: 1,
            explanation:
              'NEPA (National Environmental Policy Act) requires environmental review of projects using federal funding. RUS-funded fiber projects must comply with NEPA. Most qualify for a Categorical Exclusion (CE C-8 for telecom projects) — a streamlined process that avoids a full Environmental Impact Statement. MUTCD governs traffic control in work zones. NESC governs aerial line safety. LOTO is a construction safety procedure, not an environmental review.',
            citation: 'NEPA (42 U.S.C. §4321 et seq.); RUS Environmental Review procedures.',
          },
          {
            id: 'T01-L08-Q3',
            type: 'fill-in-blank',
            prompt:
              'The BICSI credential for inside-plant and data center designers — covering TIA-568, TIA-569, TIA-606, and TIA-607 — is called the ____.',
            answer: 'RCDD',
            answerDisplay: 'RCDD (Registered Communications Distribution Designer)',
            explanation:
              'The RCDD (Registered Communications Distribution Designer) is BICSI\'s primary credential for ISP and data-center design professionals. It covers the four-telecom-spaces model, backbone vs. horizontal cabling, TIA-606-D administration, and TIA-607 bonding/grounding for inside plant. OSP designers working on the general learning track in this training program are not required to hold an RCDD — it\'s primarily a career credential for ISP specialists.',
          },
        ]}
      />

    </LessonLayout>
  );
}
