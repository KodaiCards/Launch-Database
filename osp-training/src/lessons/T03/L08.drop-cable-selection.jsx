// T03.L08 — Drop Cable Selection
// Working lesson: figure-8, dielectric drop, feeder vs distribution, fiber count selection

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import TimelineSequence from '../../components/primitives/TimelineSequence.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import GatedAssessment from '../../components/primitives/GatedAssessment.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import ReferencesBlock from '../../components/ReferencesBlock.jsx';

export const meta = {
  id: 'T03.L08',
  course_id: 'T03',
  title: 'Drop Cable Selection',
  order: 8,
  lesson_type: 'working',
  prerequisites: ['T03.L04', 'T03.L05', 'T03.L06'],
  learning_objectives: [
    'Size feeder, distribution, and drop cable fiber counts for a FTTH network segment',
    'Apply growth margin principles to avoid premature cable replacement',
    'Select G.657 drop cable grade for specific FTTH drop bend scenarios',
    'Distinguish dark fiber strategy from active fiber provisioning and explain the economic tradeoff',
    'Specify the correct aerial drop type (figure-8 vs. ADSS vs. lashed) for a given span and attachment situation',
  ],
  vocabulary_introduced: [
    'distribution cable',
    'feeder cable',
    'dark fiber',
    'growth margin',
  ],
  vocabulary_assumed: [
    { term: 'drop',          source_lesson_id: 'T01.L07' },
    { term: 'FDH',           source_lesson_id: 'T01.L07' },
    { term: 'ONT',           source_lesson_id: 'T01.L01' },
    { term: 'HDPE',          source_lesson_id: 'T01.L08' },
    { term: 'NEC',           source_lesson_id: 'T01.L08' },
    { term: 'figure-8 cable', source_lesson_id: 'T03.L04' },
    { term: 'ADSS',          source_lesson_id: 'T01.L08' },
    { term: 'G.657.A1',      source_lesson_id: 'T03.L05' },
    { term: 'G.657.A2',      source_lesson_id: 'T03.L05' },
  ],
  key_terms: [
    {
      term: 'distribution cable',
      definition:
        'A mid-network cable running from the FDH (Fiber Distribution Hub) to a closer distribution point such as a NAP (Network Access Point) or pedestal. Typically 24–96F loose-tube. Serves a neighborhood cluster of subscribers.',
    },
    {
      term: 'feeder cable',
      definition:
        'The high-fiber-count backbone cable running from the central office or OLT to FDH locations. Typically 96–864F, often ribbon for dense FTTH builds. Carries traffic aggregated from many distribution branches.',
    },
    {
      term: 'dark fiber',
      definition:
        'Installed fiber strands that are not currently carrying any traffic — physically present and spliced, but no active electronics connected at either end. Dark fibers are a capacity reserve that can be lit in the future without pulling new cable.',
    },
    {
      term: 'growth margin',
      definition:
        'Additional fiber count specified beyond today\'s demand forecast, installed at initial build cost, to avoid a future cable replacement when subscriber density grows. Installing 20% extra fibers during initial construction is far cheaper than pulling a new cable five years later.',
    },
  ],
  estimated_minutes: 24,
};

export default function T03L08_DropCableSelection() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ──────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          The FTTH network hierarchy has three cable tiers: <strong>feeder</strong> (the
          backbone from CO to FDH), <strong>distribution</strong> (FDH to the neighborhood
          pedestal or NAP), and <strong>drop</strong> (NAP to the customer's ONT).
          Each tier has different fiber counts, construction types, and bend-radius
          requirements.
        </p>
        <p className="mt-2">
          This lesson focuses on sizing and specifying the cable at all three tiers —
          with emphasis on the drop segment, since that's where G.657 bend-insensitive
          fiber (from the G.652 vs. G.657 — When Bend-Insensitive Fiber Matters lesson) and the
          right aerial type (figure-8 vs. ADSS, from the Messenger Cable — Lashed vs. ADSS
          lesson) have the biggest impact on
          installation speed and long-term reliability.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Term</th>
              <th className="px-3 py-2 text-left">Stands for</th>
              <th className="px-3 py-2 text-left">Role in the network</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">FDH</td>
              <td className="px-3 py-2">Fiber Distribution Hub</td>
              <td className="px-3 py-2">Feeder-to-distribution splice/split point; often a pedestal or cabinet</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NAP</td>
              <td className="px-3 py-2">Network Access Point</td>
              <td className="px-3 py-2">Closest splice/split point to the customer; may be a wall-box or aerial closure</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ONT</td>
              <td className="px-3 py-2">Optical Network Terminal</td>
              <td className="px-3 py-2">The fiber modem at the customer premises; converts optical signal to Ethernet</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">GPON</td>
              <td className="px-3 py-2">Gigabit Passive Optical Network</td>
              <td className="px-3 py-2">The most common FTTH access technology; one OLT port serves up to 128 ONTs via passive splitters</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKING ──────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Cable Sizing at Each FTTH Network Tier</h2>

        <h3 className="mt-4 font-semibold">Feeder cables — backbone from CO to FDH</h3>
        <p>
          Feeder cables carry the aggregated traffic from the central office (CO) or OLT
          location out to FDH locations spread across the service area. They are the highest
          fiber-count cables in an FTTH network.
        </p>
        <p className="mt-2">
          Typical specs:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
          <li><strong>Fiber count:</strong> 96F–864F, or higher in dense urban builds. Ribbon construction is common at 432F+ for splice speed.</li>
          <li><strong>Fiber type:</strong> G.652.D (OS2). Feeder runs are generally straight enough that bend-insensitive fiber isn't needed.</li>
          <li><strong>Construction:</strong> Typically aerial lashed ribbon or direct-burial loose-tube depending on route type.</li>
          <li><strong>Dark fiber:</strong> Feeder cables are almost always sized with significant dark-fiber reserve — it's far cheaper to pull a 432F feeder once than a 144F feeder and return in 5 years to pull another.</li>
        </ul>

        <h3 className="mt-5 font-semibold">Distribution cables — FDH to NAP</h3>
        <p>
          Distribution cables serve a neighborhood cluster. They branch from the FDH
          and run to pedestal locations, wall-mounted NAPs, or aerial splice points
          where the final drops connect.
        </p>
        <p className="mt-2">
          Typical specs:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
          <li><strong>Fiber count:</strong> 24F–96F. Sized for the number of subscribers the distribution segment serves, plus growth margin.</li>
          <li><strong>Fiber type:</strong> G.652.D or G.657.A1. At the distribution level, bends at splice closures or pedestals make G.657.A1 a common choice for its splice-compatibility and moderate bend tolerance.</li>
          <li><strong>Construction:</strong> Aerial loose-tube (lashed or ADSS) or direct-burial depending on route.</li>
        </ul>

        <h3 className="mt-5 font-semibold">Drop cables — NAP to customer ONT</h3>
        <p>
          Drop cables are the final connection from the network to the customer. They are
          the shortest-run, lowest-fiber-count, highest-bend-risk segment.
        </p>
        <p className="mt-2">
          Typical specs:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
          <li>
            <strong>Fiber count:</strong> 2–12F for residential premises. Most residential
            homes need 1–2 active fibers plus 1–2 dark. 2F or 4F drops are most common in
            FTTH residential builds.
          </li>
          <li>
            <strong>Fiber type:</strong> G.657.A1 or G.657.A2, depending on the bend
            environment at the premises entry. Review the G.652 vs. G.657 — When
            Bend-Insensitive Fiber Matters lesson — a 7.5 mm bend at a wall entry requires A2.
          </li>
          <li>
            <strong>Aerial drop type:</strong> Figure-8 (integrated messenger) for faster
            installation on short spans (50–150 ft from pole to house) — reducing install
            time and cost by as much as fifty percent versus pre-installing a separate
            messenger. ADSS for dielectric requirements or longer spans.
          </li>
          <li>
            <strong>Underground drop:</strong> Small-diameter HDPE-jacketed direct-burial
            or conduit pull. CST armor if rodent activity near premises. G.657.A2 to handle
            any tight bends at building entry conduit elbows.
          </li>
        </ul>

        <h3 className="mt-5 font-semibold">Dark fiber and growth margin — the 20-year plan</h3>
        <p>
          Every FTTH cable spec decision has a 20–30 year time horizon. The cable you
          pull today needs to serve subscriber density forecasts that may be 2× today's
          penetration rate. Dark fiber is the insurance policy:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
          <li>
            <strong>At feeder level:</strong> Pull 2× the fiber count you need today.
            Incremental fiber cost at $0.10–0.40/ft is trivial compared to a future cable
            replacement at $10–30/ft installed.
          </li>
          <li>
            <strong>At distribution level:</strong> Size for 100% take rate on the
            distribution segment, plus 20% growth margin. Most distribution cables are
            pulled once.
          </li>
          <li>
            <strong>At drop level:</strong> 2F or 4F drops (vs. the minimum 1F per
            subscriber). Even 4F adds minimal cost per drop; it provides one active
            fiber + one spare + potential future expansion within the same cable.
          </li>
        </ul>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book (RUS / FOA FTTH design guides):</strong> RUS-financed FTTH builds
            follow RUS Bulletin 1751F-630 for aerial construction and 7 CFR 1755.902 for
            cable specs. The FOA FTTH design guide provides tier-by-tier fiber count guidance
            based on serving area size and take rate assumptions.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> The biggest field mistake at the drop level is using
            leftover feeder cable (G.652.D, high fiber count) for residential drops because
            it was in the truck. The consequences: (1) oversized cable doesn't fit through
            the drop conduit easily, (2) the G.652.D fiber fails bend specs at the wall
            entry, (3) you've wasted expensive high-count feeder cable on a 2-fiber
            application. Drop cable exists for a reason — spec it and order it.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Risk:</strong> Using G.652.D on a 7.5 mm wall-entry bend causes
            macrobend loss that may not fail the link immediately but degrades signal
            at temperature extremes (fibers stiffen in cold, worsening bend loss). Customer
            reports of intermittent internet failures on cold winter mornings often trace
            back to a bad drop fiber bend.
          </p>
        </div>
      </section>

      {/* ── BRANCHING SCENARIO ───────────────────────────────────────────── */}
      <BranchingScenario
        scenarioId="T03-L08-scenario-1"
        title="FTTH Drop Design — MDU Building"
        description="Design the drop cable specification for a 40-unit MDU (Multi-Dwelling Unit) building. 200 m aerial run from the distribution NAP to the building. 15 mm bend at building entry conduit."
        startNodeId="start"
        nodes={{
          start: {
            id: 'start',
            text: '40-unit MDU, 200 m aerial span from NAP to building. The drop cable must navigate a 15 mm radius corner at the building entry conduit. What fiber type do you specify for the drop cable?',
            choices: [
              { label: 'G.652.D — standard OSP fiber, lowest cost', nextId: 'g652-fail' },
              { label: 'G.657.A1 — minimum 10 mm radius, handles 15 mm bend', nextId: 'a1-ok' },
              { label: 'G.657.B3 — ultra-bend-insensitive, handles any bend', nextId: 'b3-overspec' },
            ],
          },
          'g652-fail': {
            id: 'g652-fail',
            text: 'G.652.D has a minimum bend radius of ~30 mm. A 15 mm radius bend EXCEEDS its minimum — this will cause macrobend loss. The link may pass initial testing at room temperature, but will degrade as temperature drops in winter (fiber stiffens, worsening the bend). Not an acceptable specification for this application.',
            choices: [
              { label: 'Try again', nextId: 'start' },
            ],
          },
          'a1-ok': {
            id: 'a1-ok',
            text: 'G.657.A1 (minimum 10 mm radius) handles the 15 mm entry bend with margin. Correct. Also splice-compatible with the G.652.D distribution cable at the NAP — no intrinsic splice loss penalty. What aerial cable type do you use for the 200 m span?',
            choices: [
              { label: 'Figure-8 (integrated messenger) — faster installation', nextId: 'fig8' },
              { label: 'ADSS — dielectric, no bonding', nextId: 'adss-ok' },
            ],
          },
          'b3-overspec': {
            id: 'b3-overspec',
            text: 'G.657.B3 would work — it handles 5 mm bends easily. But it is over-specified for a 15 mm bend, and B3 is not guaranteed backward-compatible with G.652.D for zero-loss splicing at the NAP. G.657.A1 (10 mm minimum) is sufficient and fully splice-compatible. Over-specifying can create problems at the splice point.',
            choices: [
              { label: 'Try again with the correct minimum spec', nextId: 'start' },
            ],
          },
          fig8: {
            id: 'fig8',
            text: 'Figure-8 cable for a 200 m span to an MDU. The integrated messenger eliminates a separate strand installation step. At 200 m (655 ft), a figure-8 drop cable is well within normal span range. The steel messenger requires bonding at the pole dead-end, but the bonding likely already exists from the distribution cable installation. Good choice for installation speed.',
            choices: [
              { label: 'How many fibers do you specify for a 40-unit MDU?', nextId: 'fiber-count' },
            ],
          },
          'adss-ok': {
            id: 'adss-ok',
            text: 'ADSS for a 200 m residential MDU drop is also acceptable, especially if the distribution poles don\'t already have bonding assemblies. The dielectric design eliminates bonding requirements. Fiber counts up to 432F are available in ADSS — more than enough for a 40-unit MDU.',
            choices: [
              { label: 'How many fibers do you specify for a 40-unit MDU?', nextId: 'fiber-count' },
            ],
          },
          'fiber-count': {
            id: 'fiber-count',
            text: '40 units × 2 active fibers per unit = 80 active fibers minimum today. Add 20% growth margin = 96F. Standard cable count: specify a 96F G.657.A1 drop cable. This covers today\'s 40 units at 100% take rate with a 2-fiber-per-unit design, plus room for growth without a new cable pull.',
            choices: [
              { label: 'What about dark fiber reserve at this tier?', nextId: 'dark-fiber' },
              { label: 'Back to start', nextId: 'start' },
            ],
          },
          'dark-fiber': {
            id: 'dark-fiber',
            text: '96F for 40 units (2 fibers each) leaves ~16 dark fibers above the 80 active. That\'s your dark fiber reserve — future units, future network upgrades, spare for future repairs. At the incremental cost of going from 80F to 96F, the dark fiber reserve is essentially free. Standard practice is to never spec the minimum active fiber count exactly — always round up to the next standard cable count.',
            choices: [{ label: 'Back to start', nextId: 'start' }],
          },
        }}
      />

      {/* ── TIMELINE: FTTH cable sequence ────────────────────────────────── */}
      <TimelineSequence
        title="FTTH Cable Installation Sequence — Put in the Right Order"
        instructions="Drag these FTTH cable installation steps into the correct chronological order."
        events={[
          { id: 'permits', label: 'Obtain permits and complete make-ready (pole transfers, clearance work)', detail: 'Permitting and make-ready must complete before any cable is installed. Attaching to a pole without make-ready approval is a violation.' },
          { id: 'feeder', label: 'Install feeder cable (CO to FDH)', detail: 'Feeder is the backbone. It runs first, establishing the FDH locations where distribution cables will connect.' },
          { id: 'fdh', label: 'Install and commission FDH closures', detail: 'FDH closures must be in place and spliced before distribution cables can be terminated.' },
          { id: 'dist', label: 'Install distribution cables (FDH to NAP pedestals)', detail: 'Distribution cables fan out from the FDH to serve neighborhood clusters. Install and splice at NAP locations.' },
          { id: 'drop', label: 'Install drop cables (NAP to premises)', detail: 'Drops are installed last — they connect to the distribution cable at the NAP and run to the customer ONT.' },
          { id: 'ont', label: 'Install and provision customer ONTs', detail: 'Final step: ONT installation at premises, provisioning of GPON port, and service activation.' },
        ]}
        correctOrder={['permits', 'feeder', 'fdh', 'dist', 'drop', 'ont']}
        explanation="FTTH builds proceed from backbone to edge: permits/make-ready → feeder → FDH → distribution → drops → ONT provisioning. Installing drops before the feeder and distribution splicing is complete would mean installing to unconnected cables — a common sequencing error on projects where different crews work simultaneously without coordination."
      />

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">MDU distribution — riser vs. home-run drop design</h3>
        <p>
          For a large MDU (40+ units), there are two cable design approaches:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Home-run drops:</strong> Each unit gets its own 2F drop from the NAP
            or FDH to the unit. Highly scalable and fault-isolated — one bad drop doesn't
            affect other units. High cable count at the NAP (40 drops = 80 cable terminations).
          </li>
          <li>
            <strong>Riser + branch design:</strong> A single higher-count cable enters the
            building and runs up the riser. Distribution splice points on each floor serve
            clusters of units. Fewer cables entering the building but more internal splicing.
            Requires OFNR (riser) or OFNP (plenum) rated drop cable inside the building.
          </li>
        </ul>
        <p className="mt-2">
          For most RUS residential builds, home-run drops are the standard. MDU riser
          designs are more common in dense urban multi-story buildings where the riser
          infrastructure is already in place.
        </p>

        <h3 className="mt-5 font-semibold">Maximum installation pulling tension — GR-20 and what it means in the field</h3>
        <p>
          Every OSP fiber cable has two tension ratings that are completely different
          concepts and easy to confuse:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Maximum installation pulling tension (short-term):</strong> The highest
            force you may apply to the cable during the cable pull itself. This is a temporary
            load — it lasts only as long as the pull takes. Governed by Telcordia{' '}
            <strong>GR-20 (Generic Requirements for Optical Fiber and Optical Fiber Cable)</strong>,
            which specifies minimum tensile rating requirements for OSP fiber cable products.
            ICEA S-87-640 (introduced in the Loose-Tube vs. Tight-Buffer vs. Ribbon lesson)
            is the complementary construction standard; GR-20 sets the performance floor the
            cable must meet.
          </li>
          <li>
            <strong>Long-term EDS (Everyday Stress, introduced in the Messenger Cable — Lashed vs. ADSS lesson):</strong> The sustained
            tension the cable must tolerate indefinitely when installed on a span. EDS is
            typically 16–25% of RTS — a much lower value than the installation tension limit.
          </li>
        </ul>
        <p className="mt-3">
          Typical GR-20 installation tension limits for common drop cable types:
        </p>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Cable type</th>
              <th className="px-3 py-2 text-left">Typical GR-20 max pulling tension</th>
              <th className="px-3 py-2 text-left">Field note</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-xs">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">2F–12F drop (dielectric, no messenger)</td>
              <td className="px-3 py-2">~300–600 N (67–135 lbf)</td>
              <td className="px-3 py-2">Pull by the cable jacket — do NOT pull by the fiber; use a pulling grip around the cable sheath</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Figure-8 drop (with steel messenger)</td>
              <td className="px-3 py-2">Messenger rated separately; cable body ~600–900 N</td>
              <td className="px-3 py-2">The steel messenger carries the mechanical load; pulling grip on the messenger — NOT on the fiber cable body</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">OSP loose-tube distribution cable (24–96F)</td>
              <td className="px-3 py-2">~1,300–2,700 N (290–600 lbf)</td>
              <td className="px-3 py-2">GR-20 short-term install tension — NOT the long-term span EDS rating</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Why this matters in the field</p>
          <p className="text-slate-300/90">
            Exceeding the GR-20 installation tension can microfracture the glass fiber
            inside the cable without any visible external damage. The cable looks fine after
            the pull, tests may pass at ambient temperature, but the microfractures grow over
            time under temperature cycling and mechanical fatigue. The result is elevated
            attenuation or outright fiber break months or years after installation — and it's
            nearly impossible to trace back to the installation pull without OTDR records from
            immediately post-installation.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Standard field discipline:</strong> (1) obtain the pulling tension limit
            from the cable manufacturer's datasheet before the pull; (2) use a calibrated
            tensionmeter or tension-limiting swivel on pulls longer than ~50 m; (3) log the
            maximum tension observed during the pull in the as-built records alongside the
            OTDR trace. If the recorded tension approaches or exceeds the GR-20 limit, flag
            the cable segment for monitoring — don't assume it's fine.
          </p>
        </div>

        <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
          <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
          <p className="text-slate-200 mb-3">
            Drop cable design cascades from upstream to customer premise:
          </p>
          <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
            <li><strong>G.652 vs. G.657 — When Bend-Insensitive Fiber Matters</strong> — Drop cables MUST use G.657 because customer premises bend radii are 5–10 mm. Standard G.652.D at those bends creates unacceptable loss within months.</li>
            <li><strong>Link Budget — Worked Example</strong> — Drop cable budget is typically 5–10 dB of the total link loss. Over-thin drop cable or poor routing choices sacrifice that budget; a thick, well-routed drop cable gives you headroom for repairs and future upgrades.</li>
            <li><strong>Fiber Physics</strong> — The drop cable terminates into the customer's ONT (Optical Network Terminal). That ONT has connector loss (0.3–0.5 dB) + splice loss (0.2–0.3 dB); together with the drop cable loss, they determine whether the path reaches minimum power levels for the provisioned service tier, using the same link-budget math taught earlier in the course.</li>
          </ul>
          <p className="text-slate-200 mt-3 text-sm italic">
            Drop cable is the customer's first fiber experience. Thin cable + poor routing = a decade of field problems and callbacks.
          </p>
        </section>
      </section>

      <ReferencesBlock
        items={[
          { citation: 'FOA FTTH Design Guide', note: 'Industry tier-by-tier fiber-count guidance (feeder/distribution/drop) referenced throughout this lesson.' },
          { citation: 'RUS Bulletin 1751F-630', note: 'RUS aerial construction methods for FTTH builds.' },
          { citation: '7 CFR 1755.902', note: 'RUS minimum cable performance specification for RUS-financed FTTH builds.' },
          { citation: 'Telcordia GR-20', note: 'Generic requirements setting minimum installation (short-term) tensile rating for OSP fiber cable products.' },
        ]}
      />

      {/* ── KEY TERMS FLASHCARDS ──────────────────────────────────────────── */}
      <Flashcard
        deckId="T03-L08"
        cards={[
          {
            id: 'T03-L08-fc-distribution',
            front: 'What is a distribution cable in an FTTH network?',
            back: 'A mid-network cable running from the FDH (Fiber Distribution Hub) to a closer distribution point such as a NAP or pedestal. Typically 24–96F loose-tube, serving a neighborhood cluster of subscribers. (FOA FTTH design guide)',
          },
          {
            id: 'T03-L08-fc-feeder',
            front: 'What is a feeder cable and how does it differ from distribution?',
            back: 'The high-fiber-count backbone cable from the central office or OLT to FDH locations. Typically 96–864F, often ribbon for dense FTTH builds. Carries aggregated traffic from many distribution branches. Higher fiber count, longer spans, and more critical redundancy than distribution cables. (FOA FTTH design guide; splice.me)',
          },
          {
            id: 'T03-L08-fc-dark',
            front: 'What is dark fiber and why is it specified at initial construction?',
            back: 'Installed fiber strands not currently carrying traffic — physically present and spliced, but no active electronics at either end. Specified during initial build because adding fiber capacity later requires a new cable pull, which costs 10–30× more per foot than the incremental cost of extra fibers at initial installation.',
          },
          {
            id: 'T03-L08-fc-growth',
            front: 'What is growth margin in cable fiber count selection?',
            back: 'Additional fiber count beyond today\'s demand forecast, installed at initial build cost. Standard practice: size for 100% take rate at distribution level + 20% growth margin; 2× today\'s fiber count at feeder level. The incremental cost of dark fiber at construction is small; the cost of a future cable replacement is large.',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ───────────────────────────────────────────────── */}
      <GatedAssessment
        courseId="T03"
        assessmentId="T03-L08"
        title="Check — Drop Cable Selection"
        fallback={
        <Quiz
          title="Check — Drop Cable Selection"
          mode="multiple-choice"
          questions={[
            {
              id: 'T03-L08-Q1',
              type: 'mc',
              prompt:
                'Drop cables to residential premises typically contain how many fibers?',
              choices: [
                '1 fiber only — one subscriber needs one fiber path',
                '2–12 fibers — small counts for individual premises drops',
                '24–96 fibers — same as distribution cables',
                '144–288 fibers — high count for future expansion',
              ],
              answerIndex: 1,
              explanation:
                '2–12 fibers is the standard drop count for residential premises. (Source: FOA FTTH design guide). Most residential homes need 2–4 fibers (1–2 active + spares). Higher fiber counts belong at the distribution and feeder tiers, not individual residential drops.',
            },
            {
              id: 'T03-L08-Q2',
              type: 'mc',
              prompt:
                'A figure-8 drop cable integrates the steel messenger into the cable jacket. What is the primary installation advantage?',
              choices: [
                'Eliminates the need for any bonding at the pole dead-end',
                'Reduces installation time by up to 50% by eliminating the separate messenger pre-installation step',
                'Allows fiber counts up to 432F in a compact form factor',
                'The cable is dielectric so no NEC requirements apply',
              ],
              answerIndex: 1,
              explanation:
                'A figure-8 cable integrates the messenger into the jacket, so the installer strings one cable rather than pre-installing a separate strand and then lashing the fiber. "Reduces time and costs to install, by as much as fifty percent." (Source: outsideplantcabling.com + fibereast.com). Note: the integrated steel messenger still requires bonding at dead-ends.',
            },
            {
              id: 'T03-L08-Q3',
              type: 'fill-in-blank',
              prompt:
                'Installed fiber strands that are not currently carrying traffic but can be activated in the future without pulling new cable are called ________ fibers.',
              answer: 'dark',
              answerDisplay: 'dark (dark fiber)',
              explanation:
                'Dark fiber refers to physically installed, spliced fiber strands with no active electronics currently connected. Specifying dark fiber at initial construction is standard practice because the incremental cost of additional fibers during the initial cable pull is far lower than the cost of a future cable replacement when capacity is needed.',
            },
            {
              id: 'T03-L08-Q4',
              type: 'mc',
              prompt:
                'For a new 48-unit MDU on a GPON-based FTTH build using 2 fibers per unit, what is the minimum distribution cable fiber count that provides a 20% growth margin?',
              choices: [
                '48F — exactly one fiber per unit',
                '96F — two active fibers per unit with no growth margin',
                '120F — 96 active fibers × 1.25 = 120 with 25% growth margin',
                '48F — 2 active fibers per unit means only 24 units are planned',
              ],
              answerIndex: 2,
              explanation:
                '48 units × 2 fibers = 96 fibers for 100% take rate. Add 20% growth margin: 96 × 1.20 = 115.2 → round up to the next standard cable count of 120F. Standard cable counts are typically 12, 24, 48, 72, 96, 120, 144, 216, 288, 432... 120F is the correct minimum spec. 96F provides zero growth margin.',
            },
          ]}
        />
        }
      />

    </LessonLayout>
  );
}
