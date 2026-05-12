import React from 'react';
import InteractiveQuiz from '../components/InteractiveQuiz.jsx';
import { ModuleHeader, Section, Callout, RefList, Table } from '../components/ModuleLayout.jsx';

/**
 * Module 2 — OSP Design
 *
 * Editorial posture (per docs/research-logs/module02-osp-design.md):
 *  - NESC IEEE C2-2023, BICSI OSPDRM 6th, and TIA-758-C are paywalled.
 *    No NESC table values are typed from memory.
 *  - The 40 in. communication-worker safety zone, the Heavy/Medium/Light
 *    district ice/wind values, and Grade B/C safety factors are tagged
 *    "verified via secondary source" (ikeGPS, Alden, Katapult, utility
 *    manuals) — not as if they were quoted from C2-2023.
 *  - Cost numbers ($16.25/ft underground vs $6.49/ft aerial) come from
 *    the Cartesian / Fiber Broadband Association study covered by Fierce
 *    Network — those are public.
 *  - OTMR is described per FCC 18-111 (public).
 */
export default function Module02_OSPDesign() {
  return (
    <article className="space-y-6">
      <ModuleHeader
        number={2}
        title="OSP Design"
        intro="Right-of-way, NESC clearances, pole loading, and the aerial vs. underground decision. NESC IEEE C2-2023 is paywalled — this module cites Rules and concepts from public summaries and utility manuals rather than reproducing the standard. Where a number is the AHJ's call, we say so."
      />

      <Section title="2.1 What NESC actually is, and why we don't print its tables">
        <p>
          The <strong>National Electrical Safety Code (NESC)</strong>, published by
          IEEE as standard <strong>C2</strong>, governs the construction, operation,
          and maintenance of overhead and underground supply and communication
          lines in the U.S. The current edition is <strong>2023 (C2-2023)</strong>.
          Like most IEEE standards, it is sold, not freely distributed.
        </p>
        <p>
          The exam wants you to know what each major Rule covers, not to
          recite Table values. The most useful Rules to memorize by number:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li><strong>Rule 232</strong> — vertical clearance over ground, roadways, water, rail.</li>
          <li><strong>Rule 235</strong> — clearance and separation between lines on the same pole.</li>
          <li><strong>Rule 250</strong> — loading districts, ice, wind, and combined loadings.</li>
          <li><strong>Rule 261</strong> — grades of construction.</li>
          <li><strong>Section 26</strong> — load and strength factors.</li>
        </ul>
        <Callout kind="verify" title="Editorial rule for this module">
          We do not type NESC table numbers as if they came from the standard
          we don't have. Where we cite a value (40 in., ½ in. ice, etc.) we
          tag the source — utility manual, ikeGPS post, Alden article — and
          tell the student that the authoritative figure lives in the paid
          C2-2023 table. The exam answer is "the rule," not "the value."
        </Callout>
      </Section>

      <Section title="2.2 Vertical clearance — Rule 232">
        <p>
          Rule 232 sets the minimum height that overhead supply and
          communication conductors must maintain above ground, roadways,
          rail, water, and pedestrian areas. The actual minimum varies with
          (a) what the conductor is, (b) what is below it, and (c) the
          voltage class. Categorical values (e.g., communication over a
          public road, communication over a pedestrian-only space) are
          published in <strong>Table 232-1</strong>.
        </p>
        <Callout kind="book" title="What public summaries cite for Table 232-1">
          Communication cables crossing over <em>public roads</em> are
          frequently cited in utility design manuals at <strong>≈ 15.5 ft</strong>
          minimum to ground; over <em>pedestrian-only</em> areas at
          <strong> ≈ 9.5 ft</strong>. These appear repeatedly in independent
          utility leaflets — treat them as a planning value sourced via
          secondary publications, and confirm the actual figure from the
          paid C2-2023 table when designing.
        </Callout>
        <Callout kind="field" title="What crews target">
          Designers add <strong>1–2 ft of margin</strong> above the NESC
          minimum to absorb seasonal sag, future re-grading, and the
          inevitable snow pile shoved against the curb. "If the design
          says 15.5 ft, build it at 17 ft" is a working OSP rule.
        </Callout>
      </Section>

      <Section title="2.3 Communication-to-supply separation at the pole">
        <p>
          A joint-use pole carries supply (power) above and communication
          (telco / fiber / CATV) below, with a <strong>neutral</strong>{' '}
          conductor in between. Rule 235 specifies the vertical separation
          between supply and communication and defines a <strong>communication
          worker safety zone</strong> — the working space the comm tech needs
          to safely climb without contacting energized conductors.
        </p>
        <Callout kind="book" title="The 40-inch number">
          Public secondary sources (ikeGPS, Alden Systems, multiple utility
          attachment manuals) consistently cite <strong>40 in.</strong> as
          the supply-to-communication vertical separation at the pole for
          common voltages. Treat that as a planning value; the
          authoritative figure is in NESC Rule 235 family / Table 235-5
          (paid).
        </Callout>
        <Callout kind="field" title="Reduced separation when the messenger is bonded">
          A historical NESC concept (and current utility practice in many
          territories) allows a reduced midspan separation — frequently
          cited at <strong>≈ 30 in.</strong> — when the communication
          messenger is effectively bonded to the supply neutral. Whether
          that reduction survives in C2-2023 verbatim is for the AHJ /
          utility's joint-use book to confirm.
        </Callout>
      </Section>

      <Section title="2.4 Pole loading — grades of construction & load/strength factors">
        <p>
          Pole loading asks: with the cables we are about to attach, will
          this structure stand under the worst combined ice + wind loading
          the code expects in this district? Two NESC concepts drive the
          answer.
        </p>

        <p className="mt-2"><strong>Rule 261 — Grade of construction.</strong>{' '}
          Determines <em>how strong</em> the structure must be relative to
          the calculated load. The two grades you see in OSP work are{' '}
          <strong>Grade B</strong> (higher consequence: railroad and
          highway crossings, heavy traffic) and{' '}
          <strong>Grade C</strong> (typical distribution and joint-use).
        </p>

        <p className="mt-2"><strong>Section 26 — Load and strength factors.</strong>{' '}
          The matrix of multipliers that turn an estimated load into a
          design load, by grade, by component, and by loading condition.
        </p>

        <Callout kind="verify" title="Don't quote the safety-factor matrix from memory">
          The "4-to-1 for Grade B, 2-to-1 for Grade C" line you'll see
          repeated online is a colloquial summary of Section 26's load and
          strength factors, not a quote. The authoritative matrix is in the
          paid C2-2023.
        </Callout>

        <Callout kind="field" title="Internal practice often beats the spec">
          Many utilities default <em>every</em> joint-use pole on a trunk
          corridor to Grade B, regardless of crossing — not because NESC
          requires it, but because it preserves design margin for the next
          attacher. That is internal practice, not standard.
        </Callout>
      </Section>

      <Section title="2.5 Loading districts — Rule 250">
        <p>
          Rule 250B divides the country into three loading districts —{' '}
          <strong>Heavy</strong>, <strong>Medium</strong>,{' '}
          <strong>Light</strong> — and prescribes a combined radial-ice +
          concurrent-wind loading per district. Rule 250C and 250D layer
          extreme-wind and extreme-ice-with-concurrent-wind on top, mapped
          per the NESC's published district maps.
        </p>

        <Table
          headers={['District', 'Radial ice', 'Wind pressure', 'Citation']}
          rows={[
            ['Heavy',  '≈ ½ in',  '≈ 4 psf', 'Per public summaries of Table 250-1'],
            ['Medium', '≈ ¼ in',  '≈ 4 psf', 'Per public summaries of Table 250-1'],
            ['Light',  '0 in',     '≈ 9 psf', 'Per public summaries of Table 250-1'],
          ]}
        />
        <p className="text-[11px] text-slate-400 mt-1">
          These values are republished in many secondary sources (utility
          design manuals, line-design textbooks, vendor blogs) and appear
          consistent across them. The authoritative figures are in NESC
          IEEE C2-2023 Table 250-1 (paid). Treat these as planning values.
        </p>

        <Callout kind="field" title="The AHJ overlay you actually design to">
          Coastal hurricane zones (Florida, the Gulf, parts of NC) almost
          always require Rule 250C extreme-wind loading on top of district
          loading. After the 2004–2005 Florida hurricane season, the
          Florida PSC adopted hardening standards that exceed NESC minima
          for utility infrastructure. In practice, the AHJ's loading
          overlay is what you design to — NESC is the floor.
        </Callout>
      </Section>

      <Section title="2.6 Aerial vs. underground">
        <p>
          The first design question on most OSP routes is "aerial or
          underground?" The honest answer is "depends on what the corridor
          already has and how much make-ready it would take."
        </p>

        <Table
          headers={['Aspect', 'Aerial', 'Underground']}
          rows={[
            ['Speed of build', 'Faster (no excavation)', 'Slower (boring, restoration)'],
            ['Reliability',    'Exposed to ice, wind, vehicles', 'Insulated from weather; hit by dig-ins'],
            ['Visual / permitting', 'Often unpopular with municipalities', 'Generally preferred by AHJs'],
            ['Lifespan',       'Shorter; replacement common at re-attaches', 'Long, if conduit is properly designed'],
          ]}
        />

        <Callout kind="book" title="Public industry cost data">
          Cartesian / Fiber Broadband Association study (covered by Fierce
          Network): underground median ≈ <strong>$16.25/ft</strong>, aerial
          median ≈ <strong>$6.49/ft</strong>. More recent figures cited at
          ≈ $18/ft underground vs ≈ $8/ft aerial. National medians; your
          corridor will diverge.
        </Callout>

        <Callout kind="field" title="Make-ready eats the aerial savings">
          On poorly-maintained corridors, the make-ready cost (pole
          replacement, transfers, fixing prior attachers' violations) can
          equal or exceed the original aerial cost. "Aerial is half the
          price" is true only if the poles are clean.
        </Callout>
      </Section>

      <Section title="2.7 Right-of-way, easements, and prescriptive use">
        <p>
          Three categories matter:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li><strong>Right-of-way (ROW)</strong> — public corridor managed by a
            municipality, county, or state DOT.</li>
          <li><strong>Easement</strong> — a recorded right to use specifically
            described private land for a specifically described purpose.
            Recorded at the county.</li>
          <li><strong>Prescriptive easement</strong> — arises from continuous,
            open, hostile use of someone else's land over a statutory
            period (commonly ~10 years; varies by state).</li>
        </ul>
        <Callout kind="field" title="It's a documents problem, not a design problem">
          OSP designers rarely fail because of legal category. They fail
          because they cannot produce a recordable document the AHJ will
          accept. Older fiber routes routinely ride on prescriptive
          easements the original telco established decades ago, and the
          new owner can't produce a clean recorded grant. Plan permitting
          time around the document hunt, not the design hunt.
        </Callout>
      </Section>

      <Section title="2.8 Make-ready and OTMR">
        <p>
          When you attach to someone else's pole, "make-ready" is the work
          of moving existing attachments to make space. The FCC's{' '}
          <strong>One-Touch Make-Ready</strong> (<strong>OTMR</strong>,
          FCC 18-111) reform allows a new attacher's approved contractor
          to perform <em>simple</em> communication-space make-ready in a
          single visit, rather than waiting for each existing attacher to
          show up sequentially.
        </p>

        <Callout kind="book" title="OTMR core timeline (FCC 18-111)">
          Pole owner has <strong>10 business days</strong> to accept or reject the
          OTMR application. Existing attachers must be notified at least{' '}
          <strong>3 business days</strong> before survey. New attacher's contractor
          performs simple make-ready in a single field visit; existing
          attachers may inspect afterward.
        </Callout>

        <Callout kind="field" title="What disqualifies a job from OTMR">
          Anything <em>complex</em>: cable splicing, work in the supply
          space, antennas, or any reasonable expectation of customer
          outage. Real-world impact: a meaningful fraction of make-ready
          jobs fall back to sequential make-ready because they fail the
          simple-MR test, and "make-ready took longer than the build" is
          a standard contractor complaint.
        </Callout>
      </Section>

      <Section title="2.9 Scenario-Based Exam">
        <InteractiveQuiz title="Module 2 — OSP Design" questions={M2_QUESTIONS} />
      </Section>

      <RefList items={[
        { tag: 'book',   text: 'IEEE — NESC C2-2023 landing page',                 url: 'https://standards.ieee.org/ieee/C2/10814/' },
        { tag: 'book',   text: 'IEEE Innovate — what changed in NESC 2023',        url: 'https://innovate.ieee.org/national-electrical-safety-code-2023/' },
        { tag: 'book',   text: 'FCC 18-111 — One-Touch Make-Ready order',          url: 'https://docs.fcc.gov/public/attachments/doc-352544a1.pdf' },
        { tag: 'book',   text: 'FOA OSP Construction — Aerial Cable Installation', url: 'https://www.thefoa.org/tech/ref/OSP_Construction/Aerial%20Cable%20Installation.html' },
        { tag: 'book',   text: 'Hi-Line application guide — 2023 NESC Table 232-1',url: 'https://www.gdsassociates.com/wp-content/uploads/2022/11/Hi-Line-NESC-2023-Clearance-Charts.pdf' },
        { tag: 'book',   text: 'ikeGPS — NESC Communication Worker Safety Zone',   url: 'https://ikegps.com/ikewire/communication-worker-safety-zone/' },
        { tag: 'book',   text: 'ikeGPS — NESC Grades of Construction',             url: 'https://ikegps.com/ikewire/nesc-grades-of-construction/' },
        { tag: 'book',   text: 'Fierce Network — Cartesian/FBA on aerial vs underground cost', url: 'https://www.fierce-network.com/broadband/underground-fiber-drives-deployment-costs' },
        { tag: 'forum',  text: 'Mike Holt forum — fiber install bend radius / mule tape', url: 'https://forums.mikeholt.com/threads/fiber-install-question.141261/' },
        { tag: 'forum',  text: 'IAEI Magazine — joint-use disputes (inspector view)',     url: 'https://iaeimagazine.org/2000/2000september/this-pole-is-not-big-enough-for-both-of-us/' },
        { tag: 'verify', text: 'NESC Rule 232 / 235 / 250 / 261 absolute Table values are paywalled in IEEE C2-2023 — confirm from paid copy before sealing a design.' },
        { tag: 'verify', text: 'AHJ overlay (Florida hurricane hardening, ice-zone augmentation, DOT corridor specs) routinely exceeds NESC minima — designs follow the AHJ.' },
      ]}/>
    </article>
  );
}

const M2_QUESTIONS = [
  {
    id: 'm2-q1',
    type: 'mc',
    prompt: 'Your design submittal is rejected by the AHJ even though it meets every NESC C2-2023 minimum. Which is the most defensible explanation?',
    choices: [
      'NESC clearances are advisory; only the AHJ\'s rules are binding.',
      'NESC defines minimum requirements; an AHJ may impose stricter requirements (e.g., post-hurricane Florida hardening), and AHJ rules govern in their jurisdiction.',
      'NESC has been superseded by the Florida-specific PSC standards.',
      'BICSI OSPDRM overrides NESC in joint-use cases.',
    ],
    answerIndex: 1,
    explanation: 'NESC is a floor, not a ceiling. AHJs (utilities, DOTs, municipalities) routinely impose stricter clearance, loading, or hardening rules. Your design has to meet whichever is more restrictive on a given pole or route.',
    citation: 'NESC IEEE C2-2023 (paid). AHJ override is universal practice; Florida PSC post-2004 hardening standards are a canonical example.',
    fieldNote: 'In practice, the AHJ\'s standards book is the FIRST document a designer reads, not the second.',
  },
  {
    id: 'm2-q2',
    type: 'mc',
    prompt: 'On a joint-use pole, NESC Rule 235 establishes a "communication worker safety zone." The figure most commonly cited in public utility design manuals for vertical separation between supply and communication at the pole is:',
    choices: [
      '12 in.',
      '24 in.',
      '40 in.',
      '60 in.',
    ],
    answerIndex: 2,
    explanation: '40 in. is the figure consistently cited in independent utility design manuals and vendor publications (ikeGPS, Alden, multiple IOU joint-use books). The authoritative number is in NESC Rule 235 / Table 235-5 (paid).',
    citation: 'ikeGPS — Communication Worker Safety Zone summary; NESC Rule 235 (paid).',
    fieldNote: 'Reduced separations (often cited near 30 in.) apply midspan when the communication messenger is bonded to the supply neutral — confirm in the utility\'s joint-use book before relying on it.',
  },
  {
    id: 'm2-q3',
    type: 'mc',
    prompt: 'A residential street has poles in the public ROW. You\'re asked: aerial or underground for the FTTH overlay? Which is the most honest answer to give the customer?',
    choices: [
      'Aerial is always cheaper, so aerial.',
      'Underground is always more reliable, so underground.',
      'Aerial is roughly half the per-foot cost (Cartesian/FBA reports ≈ $6.50/ft vs ≈ $16.25/ft underground), but make-ready cost on dirty corridors can equal or exceed that savings — the route\'s pole condition decides.',
      'It depends entirely on AHJ preference; cost is irrelevant.',
    ],
    answerIndex: 2,
    explanation: 'Public industry data consistently shows aerial roughly half the per-foot cost of underground, but make-ready cost on poorly-maintained corridors can wipe out that savings. Module 2 specifically warns against the "aerial is always cheaper" oversimplification.',
    citation: 'Cartesian/FBA cost study reported by Fierce Network — $16.25/ft underground median vs $6.49/ft aerial median.',
    fieldNote: '"Make-ready took longer than the build" is a frequent complaint on aerial overlays.',
  },
  {
    id: 'm2-q4',
    type: 'mc',
    prompt: 'Under FCC One-Touch Make-Ready (OTMR, FCC 18-111), which of the following work items would DISQUALIFY a job from the simple OTMR process and force it back to sequential make-ready?',
    choices: [
      'Moving an existing communication cable a few inches downward in the comm space.',
      'Replacing an existing strand bracket with one of equal capacity.',
      'Splicing the existing attacher\'s cable to relocate it, or any work in the supply space.',
      'Installing a new bonding clamp on the comm messenger.',
    ],
    answerIndex: 2,
    explanation: 'OTMR specifically excludes "complex" work — anything involving cable splicing, supply-space work, antennas, or any reasonable expectation of customer outage. Such work reverts to sequential make-ready (each existing attacher gets sequential notice).',
    citation: 'FCC 18-111, Third Report and Order, August 2018.',
    fieldNote: 'A meaningful fraction of make-ready jobs fall out of OTMR for these reasons; this is the #1 reason aerial builds run late.',
  },
  {
    id: 'm2-q5',
    type: 'dragdrop',
    prompt: 'Match each question on a job site to the NESC Rule (or Section) that primarily governs it.',
    items: [
      { id: 'r232', label: 'Rule 232' },
      { id: 'r235', label: 'Rule 235' },
      { id: 'r250', label: 'Rule 250' },
      { id: 'r261', label: 'Rule 261' },
      { id: 's26',  label: 'Section 26' },
    ],
    targets: [
      { id: 't1', label: 'How high must this comm cable be over the road?' },
      { id: 't2', label: 'How far below the supply neutral can comm be installed?' },
      { id: 't3', label: 'What ice + wind loading applies in this district?' },
      { id: 't4', label: 'Is this crossing Grade B or Grade C?' },
      { id: 't5', label: 'What load + strength multipliers apply to my design loads?' },
    ],
    correctMap: {
      t1: 'r232',
      t2: 'r235',
      t3: 'r250',
      t4: 'r261',
      t5: 's26',
    },
    explanation: '232 = vertical clearance to ground/road. 235 = same-pole clearance/separation between systems. 250 = loading districts and weather. 261 = grades of construction. Section 26 = load + strength factors.',
    citation: 'NESC IEEE C2-2023, Rules 232/235/250/261 and Section 26 (paid). Public framing per ikeGPS, IEEE summaries.',
    fieldNote: '"What rule governs this question?" is itself a frequent BICSI exam style — the value lookup happens after.',
  },
];
