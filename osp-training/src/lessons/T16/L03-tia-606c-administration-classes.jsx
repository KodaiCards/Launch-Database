// T16.L03 — TIA-606-C Administration Classes A through D
// ANSI/TIA-606-C (2018) §4.1 administration classes; §4.2 record types
// Note: "TIA-606-D" is a BICSI TDMM shorthand; published standard is TIA-606-C [confirm edition]

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T16.L03',
  course_id: 'T16',
  title: 'TIA-606-C Administration Classes A Through D',
  order: 3,
  lesson_type: 'working',
  prerequisites: ['T16.L01'],
  learning_objectives: [
    'Identify the four administration classes in TIA-606-C and their typical installation contexts',
    'State the minimum required records for Classes A, B, C, and D',
    'Select the correct TIA-606-C class for a described rural FTTH network scenario',
    'Explain the labeling conventions TIA-606-C requires for cables, spaces, and pathways',
    'Distinguish between a link record and a pathway record under TIA-606-C',
  ],
  estimated_minutes: 30,
  vocabulary_introduced: [
    'TIA-606-C administration class (A/B/C/D)',
    'link record',
    'pathway record',
    'location record',
    'media record',
    'identifier (TIA-606-C label)',
  ],
  vocabulary_assumed: [
    { term: 'ANSI/TIA-606-C', source_lesson_id: 'T16.L01' },
    { term: 'administration (fiber infrastructure)', source_lesson_id: 'T16.L01' },
    { term: 'GIS record of record', source_lesson_id: 'T16.L01' },
    { term: 'splice matrix', source_lesson_id: 'T16.L02' },
    { term: 'as-built record', source_lesson_id: 'T16.L01' },
    { term: 'splice case types', source_lesson_id: 'T11.L09' },
  ],
  key_terms: [
    {
      term: 'TIA-606-C administration class (A/B/C/D)',
      definition:
        'One of four tiers defined in ANSI/TIA-606-C that specifies the minimum required records and labeling for a telecommunications infrastructure based on its complexity. Class A: simplest (small, single-tenant). Class B: moderate (multi-tenant or multi-pathway). Class C: complex (multi-building or campus). Class D: most complex (large campus or major network). Each class includes all requirements of lower classes plus additional record types.',
    },
    {
      term: 'link record',
      definition:
        'A TIA-606-C record documenting a single transmission path — a specific fiber from one termination point (connector, splice, or patch panel port) to another. The link record captures both endpoints, cable/fiber identification, measured performance (insertion loss, OTDR trace reference), and administrative data (identifier, date, technician). Link records are the fiber-level equivalent of documenting a single circuit. Required from Class B onward.',
    },
    {
      term: 'pathway record',
      definition:
        'A TIA-606-C record documenting a physical pathway — a conduit, duct, cable tray, innerduct, or other structure that contains cables. The pathway record identifies the pathway\'s endpoints, routing, installed capacity, fill level (current cable fill vs. total capacity), and any access constraints. Required from Class B onward. For OSP: every conduit run and every aerial strand segment is a pathway. Knowing fill level prevents a borrower from discovering mid-construction that a duct is already at 100% fill.',
    },
    {
      term: 'location record',
      definition:
        'A TIA-606-C record documenting a physical space — a building, room, manhole, handhole, vault, pedestal, equipment cabinet, or any other space where telecommunications infrastructure terminates, splices, or is accessed. The location record includes GPS coordinates or address, access procedures, equipment present, and any environmental hazards. Required from Class C onward. For OSP: every splice closure, every pedestal, every handhole, every CO equipment room is a location.',
    },
    {
      term: 'media record',
      definition:
        'A TIA-606-C record documenting a cable — its type (single-mode, multimode, hybrid), fiber count, manufacturer, reel number, installation date, routing, and slack locations. The media record is the cable-level equivalent of the link record\'s fiber-level documentation. Required from Class B onward for main cross-connect and horizontal cabling. For OSP: every feeder, distribution, and drop cable gets a media record. The media record and the splice matrix together fully document a cable\'s content and path.',
    },
    {
      term: 'identifier (TIA-606-C label)',
      definition:
        'A unique alphanumeric label assigned to every component in a TIA-606-C administration system. TIA-606-C defines naming conventions for each component type: cables get a cable identifier, pathways get a pathway identifier, locations get a location identifier. Identifiers must be unique within the system and should encode enough information to identify the component without looking it up (e.g., "F-144-01" = feeder cable, 144F, sequence 01). The identifier on the physical label matches the identifier in the record database — this correspondence is the core of TIA-606-C administration.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T16L03TIA606CClasses() {
  const quizQuestions = [
    {
      id: 'q1',
      question: 'A rural telecom RUS borrower builds a 500-mile FTTH network serving 3 rural counties. The network includes a central office, 8 remote terminal sites, 14 distribution nodes, and 2,400 subscriber pedestals. Which TIA-606-C administration class is MOST appropriate for this network?',
      options: [
        'Class A — the network serves residential customers, not commercial tenants',
        'Class B — any network larger than a single building requires only Class B',
        'Class C — the network spans multiple building sites (CO + 8 remote terminals + 14 nodes) with complex pathway and location records required',
        'Class D — all FTTH networks require Class D',
      ],
      correct: 2,
      explanation: 'Class C is appropriate for a multi-building network with complex routing. Class C adds location records (documenting the CO, remote terminals, and distribution nodes as distinct locations) on top of Class B link and pathway records. Class D is designed for very large, highly complex campuses (university systems, major hospital networks) — a single-county FTTH network typically targets Class B or C. Class A is insufficient for any multi-building network.',
      citation: 'ANSI/TIA-606-C (2018) §4.1.',
    },
    {
      id: 'q2',
      question: 'A TIA-606-C link record documents:',
      options: [
        'A physical pathway (conduit or duct) and its fill level',
        'A single fiber transmission path from one termination point to another, including both endpoints, cable/fiber ID, and measured insertion loss',
        'A location (manhole, pedestal, equipment room) and its access procedures',
        'A cable\'s type, fiber count, and routing',
      ],
      correct: 1,
      explanation: 'A link record is the fiber-level record — it documents one specific transmission path. A pathway record documents the physical conduit/duct. A location record documents a physical space. A media record documents a cable. TIA-606-C requires all four record types at Class C and above; Class B requires link + pathway + media but not location records for remote OSP plant.',
      citation: 'ANSI/TIA-606-C (2018) §4.2.',
    },
    {
      id: 'q3',
      question: 'A conduit run has 4 innerducts. Currently 3 innerducts contain fiber cables and 1 is empty. Under TIA-606-C, where is the "fill level" (available vs. occupied capacity) recorded?',
      options: [
        'In the link record for each occupied fiber',
        'In the pathway record for the conduit run — documenting current fill vs. total capacity',
        'In the location record for the nearest handhole',
        'In the splice matrix for each cable in the conduit',
      ],
      correct: 1,
      explanation: 'The pathway record documents the physical container (conduit, duct, cable tray) including its total capacity and current fill. This is why pathway records matter: when a design engineer plans to add a new cable to the route, they check the pathway record first to see if capacity exists. A pathway record showing 3 of 4 innerducts occupied tells the designer that one empty innerduct is available without a new bore. Link records track specific fibers; location records track physical spaces; the splice matrix tracks splice joints.',
      citation: 'ANSI/TIA-606-C (2018) §4.2 pathway record requirements.',
    },
    {
      id: 'q4',
      question: 'TIA-606-C identifiers (labels) serve what critical function in an administration system?',
      options: [
        'They encode the fiber\'s wavelength and loss budget',
        'They provide a unique alphanumeric code that links the physical component (labeled in the field) to its corresponding record in the documentation database — the label on the cable matches the identifier in the record system',
        'They identify which splice technician installed the component',
        'They track the cable\'s warranty expiration date',
      ],
      correct: 1,
      explanation: 'The identifier is the bridge between the physical world and the records. When a technician at a splice closure reads "IFB-SC-03" on the closure\'s label, they can search the splice matrix, pathway records, and link records for "IFB-SC-03" and immediately find all documentation for that closure. Without consistent, unique identifiers that match between field labels and database records, the administration system fails — the records exist but cannot be associated with the physical components.',
      citation: 'ANSI/TIA-606-C (2018) §4.3 identification and labeling.',
    },
  ];

  return (
    <LessonLayout meta={meta}>
      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section className="lesson-section foundations">
        <h2>In Plain English — Why Classes Exist</h2>
        <p>
          A single office building with 20 fiber drops needs very basic documentation. A 500-mile rural telecom network with a CO, 8 remote terminals, 2,400 pedestals, and 200,000 individual fiber splices needs something much more systematic. The same documentation approach does not work for both.
        </p>
        <p>
          TIA-606-C solves this with four classes — A through D — that scale the documentation requirement to the complexity of the installation. The basic principle: <strong>every class includes everything from lower classes, plus more.</strong> Class B is Class A plus pathway records and link records. Class C is Class B plus location records. Class D is Class C plus full path tracing and maintenance records.
        </p>
        <p>
          For rural telecom work under RUS programs, the target is typically Class B or Class C. Class B is the minimum for any network that spans multiple pathways (conduit runs, aerial routes) and has multiple termination points. Class C is appropriate when the network includes multiple distinct building locations (CO + remote terminals + nodes).
        </p>

        <h3 className="mt-6">The Four Classes — Quick Reference</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0' }}>
          <thead>
            <tr style={{ background: '#1e293b' }}>
              <th style={{ border: '1px solid #475569', padding: '8px', textAlign: 'left' }}>Class</th>
              <th style={{ border: '1px solid #475569', padding: '8px', textAlign: 'left' }}>Typical context</th>
              <th style={{ border: '1px solid #475569', padding: '8px', textAlign: 'left' }}>Required records</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['A', 'Small single-tenant building, simple single-route network', 'Cable labels + termination records + floor plan. Minimum administration.'],
              ['B', 'Multi-tenant building, office campus, moderate network', 'Class A + pathway records + link records + media records'],
              ['C', 'Multi-building campus, mid-sized carrier network, RUS FTTH', 'Class B + location records (CO, remote sites, vaults, pedestals)'],
              ['D', 'Large campus, major carrier backbone, hospital/university systems', 'Class C + full link database with path tracing + maintenance history'],
            ].map(([cls, context, records]) => (
              <tr key={cls}>
                <td style={{ border: '1px solid #475569', padding: '8px', fontWeight: '700', fontSize: '1.2em', textAlign: 'center' }}>{cls}</td>
                <td style={{ border: '1px solid #475569', padding: '8px' }}>{context}</td>
                <td style={{ border: '1px solid #475569', padding: '8px' }}>{records}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Key Terms */}
        <h3 className="mt-4">Key Terms</h3>
        <div className="flashcard-grid">
          {meta.key_terms.map((kt) => (
            <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
          ))}
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>TIA-606-C Record Types — Four Categories</h2>
        <p>
          TIA-606-C uses four record types to document an infrastructure. Each record type answers a different question:
        </p>

        <h3>1. Media Record — "What cable is this?"</h3>
        <p>
          A media record documents a cable: type (single-mode G.652.D, multimode OM4, hybrid), fiber count, jacket rating (OSP, LSZH, armored), manufacturer, reel number, installation date, routing description, and slack locations. For OSP feeder cables: the media record for a 144F feeder might note "G.652.D, 144F loose-tube, armored, manufacturer X reel #2048, installed April 2026, CO splice case to IFB-SC-01 (route map attached), 10m slack coil at IFB-SC-01."
        </p>
        <p>
          <strong>Required from:</strong> Class B onward for all cables in the network.
        </p>

        <h3>2. Pathway Record — "What is this conduit, and how full is it?"</h3>
        <p>
          A pathway record documents the physical housing that contains cables: conduit, duct, innerduct, aerial messenger, cable tray. The pathway record captures: pathway type, endpoints (from manhole to manhole, from building to pedestal), total capacity (number of ducts or trays), current fill (how many ducts/trays occupied), and any access constraints (permit-required segment, ROW restriction).
        </p>
        <p>
          <strong>Required from:</strong> Class B onward for all pathways containing main distribution cables.
        </p>
        <p>
          <strong>Why it matters:</strong> A complete pathway record system prevents the expensive mistake of routing a new cable through a conduit that is already full, only to discover the fill problem at pull time. Checking the pathway record first is a 30-second step; discovering a full conduit at pull time costs 2–4 hours.
        </p>

        <h3>3. Link Record — "Where does this specific fiber go?"</h3>
        <p>
          A link record documents a single fiber transmission path from one termination to another. It captures both endpoints (port ID, closure ID, or connector ID), the cable and fiber number, measured insertion loss, OTDR trace file reference, installation date, and technician. The link record is the fiber-level roadmap — it answers the question "if I connect to port 3 at this patch panel, where does that fiber go?"
        </p>
        <p>
          <strong>Required from:</strong> Class B onward.
        </p>
        <p>
          <strong>Relationship to splice matrix:</strong> The splice matrix (T16.L02) documents individual splice joints. The link record documents the end-to-end path, which may span multiple splice joints. A link record for a 5-mile feeder fiber references the splice matrix entries for every inline splice on its path. They work together — the splice matrix provides per-joint accuracy; the link record provides the complete path summary.
        </p>

        <h3>4. Location Record — "What is at this GPS coordinate?"</h3>
        <p>
          A location record documents a physical space: a building, equipment room, manhole, handhole, pedestal, or distribution closure site. It captures GPS coordinates, address, access procedure (lock combination, key holder, permit required), equipment present, environmental conditions (flood risk, confined space classification), and any safety considerations.
        </p>
        <p>
          <strong>Required from:</strong> Class C onward.
        </p>
        <p>
          For OSP: every splice closure site, every pedestal, every handhole, every vault, and every building equipment room is a location. A location record for a distribution pedestal might include: GPS (34.7123, -83.4521), access "padlock key at field office," contents "1×144F splice case + 2×12F distribution closures," "no confined space." A restoration crew with the location record can navigate directly to the pedestal, identify the access method, and know what to expect before they arrive.
        </p>

        <h3>Labeling Convention — Identifiers Must Match</h3>
        <p>
          TIA-606-C §4.3 requires that every component in the administration system have a unique identifier that:
        </p>
        <ol>
          <li><strong>Appears on the physical label</strong> attached to the component in the field</li>
          <li><strong>Matches the identifier</strong> in the records database</li>
          <li><strong>Encodes the component type</strong> when possible (cable identifiers start differently from closure identifiers)</li>
        </ol>
        <p>
          A typical OSP identifier scheme:
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0' }}>
          <thead>
            <tr style={{ background: '#1e293b' }}>
              <th style={{ border: '1px solid #475569', padding: '8px' }}>Component</th>
              <th style={{ border: '1px solid #475569', padding: '8px' }}>Identifier pattern</th>
              <th style={{ border: '1px solid #475569', padding: '8px' }}>Example</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Feeder cable', 'F-{count}F-{sequence}', 'F-144-01'],
              ['Distribution cable', 'D-{count}F-{node}-{sequence}', 'D-12-04-01'],
              ['Inline splice case', 'IFB-SC-{sequence}', 'IFB-SC-03'],
              ['Distribution splice case', 'DST-SC-{sequence}', 'DST-SC-07'],
              ['Pedestal', 'PED-{sequence}', 'PED-0142'],
              ['Conduit run', 'CDT-{from}-{to}', 'CDT-HH-04-HH-05'],
            ].map(([comp, pattern, ex]) => (
              <tr key={comp}>
                <td style={{ border: '1px solid #475569', padding: '8px' }}>{comp}</td>
                <td style={{ border: '1px solid #475569', padding: '8px', fontFamily: 'monospace' }}>{pattern}</td>
                <td style={{ border: '1px solid #475569', padding: '8px', fontFamily: 'monospace' }}>{ex}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          The actual identifier scheme is the borrower's choice — TIA-606-C defines requirements for uniqueness and component-type encoding but not the exact format. Whatever scheme is chosen must be applied consistently across the entire network and documented in the network's administration plan.
        </p>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section className="lesson-section advanced">
        <h2>Choosing the Right Class for a RUS Borrower</h2>
        <p>
          When designing the as-built documentation system for a new RUS FTTH project, the engineer must select a TIA-606-C class and specify it in the project documents. The wrong choice creates either over-burden (Class D for a simple network) or under-documentation (Class A for a multi-county carrier).
        </p>
        <p>
          Practical guidance for rural telecom:
        </p>
        <ul>
          <li><strong>Small cooperative, under 1,000 subscribers, single county:</strong> Class B minimum. Pathway + link + media records cover the network adequately. Location records (Class C) are recommended for all splice closure sites, vaults, and remote terminal buildings — but not strictly required.</li>
          <li><strong>Medium cooperative or competitive carrier, 1,000–10,000 subscribers, multi-county:</strong> Class C. The multiple building sites (CO, remote terminals, distribution huts) require location records. This is the most common target for RUS-financed FTTH projects.</li>
          <li><strong>Large carrier or municipal system, over 10,000 subscribers, complex backbone:</strong> Class C or D depending on network complexity. Class D is warranted when the network has multiple CO locations with interconnecting backbone and requires path-level redundancy tracking.</li>
        </ul>

        <h3>Book vs. Field Practice — Class Selection</h3>
        <p>
          <strong>Book (ANSI/TIA-606-C §4.1):</strong> The engineer selects the appropriate class based on network complexity and documents the selection in the project specifications.
        </p>
        <p>
          <strong>Field practice:</strong> Many small RUS borrowers never formally select a TIA-606-C class. They maintain "some records" — typically an Excel splice matrix and a paper route map — without systematically applying link, pathway, location, and media record requirements. This works for day-to-day operations but creates gaps at audit time: the borrower may have good splice records (covered by the matrix) but no pathway records, so fill-level data is unknown and adding a new cable to an existing conduit requires a field survey.
        </p>
        <p>
          <strong>Risk of informal documentation:</strong> If an RUS auditor or USDA program officer asks for the administration system documentation and the borrower cannot produce it, the close-out review may be delayed and additional conditions may be imposed. Designing to TIA-606-C Class B or C from the start is cheaper than retrofitting documentation after the plant is buried.
        </p>
      </section>

      {/* ── QUIZ ────────────────────────────────────────────────────────── */}
      <Quiz
        lessonId="T16.L03"
        questions={quizQuestions}
        title="T16.L03 Check — TIA-606-C Administration Classes"
      />
    </LessonLayout>
  );
}
