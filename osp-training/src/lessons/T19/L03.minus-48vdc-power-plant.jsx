// Net-new — T19.L03
// T19.L03 — –48VDC Power Plant — Why DC, Not AC
// Working lesson: battery plant anatomy, DC power convention, rectifiers, float voltage

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T19.L03',
  course_id: 'T19',
  title: '–48VDC Power Plant — Why DC, Not AC',
  order: 3,
  lesson_type: 'working',
  prerequisites: ['T19.L02'],
  learning_objectives: [
    'Explain why telecom equipment uses –48VDC rather than 120/240VAC and the safety advantages of that choice',
    'Describe the role of rectifiers in converting AC utility power to regulated –48VDC for equipment bays',
    'Define battery string, float voltage, and distribution bus in a telecom power plant context',
    'Explain why OSP designers must account for power plant capacity when designing feeder route additions to a headend',
    'Identify VRLA vs. lithium battery technologies and the basic maintenance implications of each',
  ],
  estimated_minutes: 22,
  vocabulary_introduced: [
    '–48VDC',
    'rectifier',
    'battery string',
    'float voltage',
    'distribution bus',
    'VRLA',
    'battery return',
    'power plant',
  ],
  key_terms: [
    {
      term: '–48VDC',
      definition: 'The nominal direct-current voltage used to power CO-grade telecommunications equipment. "Negative" means the –48 V terminal is the load side and the battery\'s positive terminal is grounded (connected to chassis/earth). This is called negative-ground convention. Equipment chassis are at –48 V relative to the battery-return bus (which is at 0 V, tied to earth ground). The convention dates to early telephone equipment designed to minimize electrolytic corrosion on copper wire.',
    },
    {
      term: 'rectifier',
      definition: 'A power supply unit that converts AC power from the utility (typically 120 V or 240 VAC) to regulated DC power (–48 VDC or –24 VDC). In a CO power plant, multiple rectifiers operate in parallel for redundancy — if one fails, the others maintain voltage. Rectifiers also continuously charge the battery strings (float charging). Modern rectifiers are high-efficiency switch-mode supplies with input power factor correction.',
    },
    {
      term: 'battery string',
      definition: 'A series-connected set of lead-acid cells that stores DC energy for backup power. A –48 V string typically consists of 24 cells at 2 V each (24 × 2 V = 48 V nominal). Valve-Regulated Lead-Acid (VRLA) batteries are standard in modern COs — sealed, maintenance-free, and spill-proof. Battery strings are sized to provide a specified number of hours of backup at the equipment\'s full DC load.',
    },
    {
      term: 'float voltage',
      definition: 'The constant DC voltage maintained by rectifiers to keep the battery string at full charge without overcharging. For VRLA cells, the float voltage is typically 2.25–2.27 V per cell [verify with battery manufacturer; see IEEE 1188 [confirm edition] for VRLA maintenance and float voltage test methodology]. At 24 cells × 2.25 V = 54 V float, which is why the CO "–48 V" system actually measures around –52 to –56 V at the bus when fully charged. Equipment must tolerate this range.',
    },
    {
      term: 'distribution bus',
      definition: 'The copper busbar or distribution panel inside the CO power plant that distributes DC power from the rectifiers and batteries to the equipment. The distribution bus has fuse or breaker positions for each equipment load. OSP engineers see the distribution bus when reviewing headend power drawings — each OLT shelf draws current from a fused position on the bus.',
    },
    {
      term: 'VRLA',
      definition: 'Valve-Regulated Lead-Acid — a type of sealed lead-acid battery used in CO power plants. VRLA batteries are maintenance-free (no water topping-off required), sealed (no acid spill risk in normal use), and can be installed in equipment bays without a dedicated battery room. Two types: AGM (Absorbent Glass Mat) and gel. AGM is most common in CO applications. Rated life: typically 5–10 years depending on temperature management.',
    },
    {
      term: 'battery return',
      definition: 'The positive terminal side of the battery plant, held at 0 V (connected to earth ground). In the negative-ground convention, the battery return is the reference voltage for the system. All equipment chassis bond to the battery return bus, which connects to the TMGB (Telecom Main Grounding Busbar). This is why grounding and DC power are tightly coupled in a CO environment.',
    },
    {
      term: 'power plant',
      definition: 'The complete DC power infrastructure in a CO or headend: rectifiers, battery strings, distribution bus, fusing, and monitoring. "Power plant" in telecom context always means DC power infrastructure — not a generator (which is the AC standby source that feeds the rectifiers during a utility outage). A properly sized power plant maintains continuous DC power to equipment through utility outages limited by battery reserve time.',
    },
  ],
  vocabulary_assumed: [
    { term: 'CO', source_lesson_id: 'T19.L01' },
    { term: 'hut', source_lesson_id: 'T19.L01' },
    { term: 'OLT', source_lesson_id: 'T19.L02' },
    { term: 'chassis', source_lesson_id: 'T19.L02' },
  ],
  estimated_minutes: 25,
};

export default function T19L03_Minus48VDCPowerPlant() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Walk into a CO equipment room and you'll notice every rack has two heavy copper
          cables running to it — the "A" feed and the "B" feed — from a giant battery bank
          on the wall. Those cables aren't AC power from the utility. They're DC power from
          a bank of batteries the size of a small fridge, kept charged by rectifiers that
          convert utility AC to DC continuously.
        </p>
        <p className="mt-2">
          This is the –48 VDC power plant. It's the reason a CO stays alive when the
          utility power fails — the batteries kick in immediately, no switchover delay.
          The equipment never knew the utility went out. Understanding this matters to the
          OSP engineer for one key reason: when you spec a remote hut, you're specifying
          this power plant. Miss-spec it and the first four-hour outage kills the OLT.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
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
              <td className="px-3 py-2 font-mono">VDC</td>
              <td className="px-3 py-2">Volts DC (direct current)</td>
              <td className="px-3 py-2">DC voltage — does not alternate like household power</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">VRLA</td>
              <td className="px-3 py-2">Valve-Regulated Lead-Acid</td>
              <td className="px-3 py-2">The standard sealed battery type in CO power plants</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">PDU</td>
              <td className="px-3 py-2">Power Distribution Unit</td>
              <td className="px-3 py-2">The panel that distributes DC feeds from the bus to individual equipment racks</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">AGM</td>
              <td className="px-3 py-2">Absorbent Glass Mat</td>
              <td className="px-3 py-2">Most common VRLA battery subtype; maintenance-free, spill-proof</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Why DC, not AC? Three reasons.</h3>
        <div className="mt-3 space-y-3">
          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="font-semibold text-blue-300">Reason 1: Batteries are DC</p>
            <p className="text-slate-300/90 mt-1 text-sm">
              When utility power fails, you need to keep the equipment running from stored
              energy. Batteries store DC. If the equipment runs on AC, you need an inverter
              to convert battery DC back to AC — that's extra hardware, extra cost, and a
              potential failure point. Running the equipment directly on DC eliminates that
              conversion step.
            </p>
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="font-semibold text-green-300">Reason 2: Corrosion resistance</p>
            <p className="text-slate-300/90 mt-1 text-sm">
              The negative-ground convention (positive terminal at 0 V, chassis negative at
              –48 V) was chosen for early telephone copper circuits to minimize electrolytic
              corrosion. When a fault puts current into the earth via buried copper wire, the
              negative-polarity convention reduces the electrolytic action that would dissolve
              the copper over time. This matters less for fiber, but the convention persists
              because all NEBS-rated equipment is designed for it.
            </p>
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="font-semibold text-purple-300">Reason 3: Safety</p>
            <p className="text-slate-300/90 mt-1 text-sm">
              48 VDC is below the body-resistance threshold for lethal shock in most conditions
              (though not universally safe — wet hands and 48 V is still dangerous). The
              original telephone battery plant design prioritized crew safety when working on
              energized equipment. AC at 120 V is more immediately lethal. The DC convention
              allowed "live" work on powered terminal equipment without automatic fatal risk.
            </p>
          </div>
        </div>

        {/* ── FLASHCARDS ───────────────────────────────────────────────── */}
        <Flashcard
          deckId="T19-L03"
          cards={[
            {
              id: 'T19-L03-fc-48vdc',
              front: 'What does "–48VDC" mean in a CO power plant?',
              back: 'The nominal DC voltage for CO telecom equipment. "Negative" means the load side is at –48 V, and the battery\'s positive terminal is grounded at 0 V (battery return). This is the negative-ground convention. Equipment chassis are at –48 V relative to the grounded battery return.',
            },
            {
              id: 'T19-L03-fc-rectifier',
              front: 'What is a rectifier in a CO power plant?',
              back: 'A power supply that converts AC utility power to regulated DC (–48 VDC). Multiple rectifiers operate in parallel for redundancy. They also float-charge the battery strings continuously. Modern rectifiers are high-efficiency switch-mode supplies.',
            },
            {
              id: 'T19-L03-fc-battery-string',
              front: 'What is a battery string?',
              back: 'A series-connected set of lead-acid cells providing DC backup power. A –48 V string = 24 cells × 2 V each. VRLA (Valve-Regulated Lead-Acid) AGM type is standard — sealed, maintenance-free. Strings are sized to provide specified hours of backup at the equipment\'s full DC load.',
            },
            {
              id: 'T19-L03-fc-float-voltage',
              front: 'What is float voltage?',
              back: 'The constant voltage maintained by rectifiers to keep battery strings fully charged without overcharging. For VRLA: typically 2.25–2.27 V per cell [verify with battery manufacturer; IEEE 1188 covers VRLA float voltage test methodology]. At 24 cells: 54 V float. This is why a "–48 V" bus actually measures –52 to –56 V when fully charged.',
            },
            {
              id: 'T19-L03-fc-battery-return',
              front: 'What is the battery return in a CO power plant?',
              back: 'The positive terminal side of the battery plant, held at 0 V (connected to earth ground). Equipment chassis bond to the battery return bus, which connects to the TMGB. This is why DC grounding and building grounding are tightly coupled in a CO.',
            },
            {
              id: 'T19-L03-fc-vrla',
              front: 'What does VRLA mean and why is it used in COs?',
              back: 'Valve-Regulated Lead-Acid — a sealed lead-acid battery that is maintenance-free (no water topping) and spill-proof. AGM subtype is most common. Can be installed in equipment bays without a dedicated battery room. Rated life 5–10 years depending on temperature.',
            },
            {
              id: 'T19-L03-fc-power-plant',
              front: 'What does "power plant" mean in a telecom CO context?',
              back: 'The complete DC power infrastructure: rectifiers, battery strings, distribution bus, fusing, and monitoring. Always means DC infrastructure in telecom context — NOT a generator (which is AC standby that feeds the rectifiers).',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Battery Plant Sizing — The OSP Engineer's Role</h2>

        <div className="border-l-4 border-blue-400/30 bg-blue-400/5 p-3 my-3">
          <p className="font-semibold text-blue-300 text-sm mb-2">Quick Refresher: Building Context from T19.L01 and T19.L02</p>
          <ul className="text-sm text-slate-300/90 space-y-1">
            <li><strong>CO / hut (from T19.L01):</strong> The facility where you're specifying this power plant. Remote huts are where OSP engineers specify infrastructure.</li>
            <li><strong>OLT (from T19.L02):</strong> The active equipment this power plant must feed. OLT datasheets specify DC draw (amperes). That's your starting load number.</li>
          </ul>
        </div>

        <h3 className="mt-4 font-semibold">The negative-ground convention — step by step</h3>
        <p>
          This confuses a lot of people because it's backwards from what you expect.
          Here's a clear walk-through:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Battery positive terminal (+):</strong> Connected to the grounding
            electrode — earth ground. Held at 0 V (battery return). This terminal
            is also bonded to equipment chassis and the TMGB.
          </li>
          <li>
            <strong>Battery negative terminal (–):</strong> Connected to the load side
            (equipment power input) via the distribution bus. Measured voltage at this
            terminal: approximately –48 V relative to earth/battery return.
          </li>
          <li>
            <strong>Equipment sees:</strong> A –48 V supply on its power input and its
            chassis at 0 V (grounded). The current flows from the equipment load, through
            the distribution bus, into the battery negative terminal, through the battery
            cells, out the positive terminal, through the battery return bus, back to the
            chassis. Conventional current flows: chassis (+0 V) → battery return bus →
            battery cells → distribution bus → equipment load.
          </li>
        </ol>

        <div className="mt-4 p-3 rounded-lg bg-black/30 border border-white/10 text-sm font-mono text-slate-200">
          <p className="font-sans font-semibold text-slate-300 mb-1">DC path summary:</p>
          <p>Earth ground / TMGB ← Battery return (0 V) ← Battery (+) terminal</p>
          <p>Equipment load → Distribution bus → Battery (–) terminal = –48 V</p>
          <p className="font-sans text-slate-400 mt-1">Current flows from load into battery negative, through cells, out positive to earth/chassis</p>
        </div>

        <h3 className="mt-5 font-semibold">Sizing the battery plant — what goes on the OSP spec</h3>
        <p className="mt-2">
          For a rural FTTH hut on a RUS-program build, the OSP engineer typically specifies:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>DC load:</strong> Sum of all equipment's DC draw in amperes at –48 V.
            OLT shelves specify this in the equipment datasheet (e.g., 30 A for a fully
            loaded OLT shelf). Include future load growth headroom (typically 25%).
          </li>
          <li>
            <strong>Reserve time:</strong> How many hours the battery must sustain the
            DC load during a utility outage. RUS-program rural huts: specify minimum
            4 hours. Larger COs: 8 hours minimum. Carrier-grade: 8–24 hours.
          </li>
          <li>
            <strong>Battery string capacity (Ah):</strong> Load (A) × Reserve time (h) =
            Ampere-hours required. Then size by a de-rating factor (see worked example below).
          </li>
          <li>
            <strong>Rectifier capacity:</strong> Must supply the full DC load while
            simultaneously float-charging the battery strings. Specify at minimum
            1.25× the DC equipment load as rectifier capacity. For redundancy: N+1
            rectifier units.
          </li>
        </ul>

        {/* WORKED EXAMPLE: Battery string sizing */}
        <WorkedExample
          title="Battery Plant Sizing — Rural FTTH Hut"
          description="Size the battery plant for a rural FTTH hut. OLT draw: 28 A at –48 VDC. Required reserve: 4 hours. Apply 0.8 de-rating for temperature and end-of-life capacity loss."
          variables={[
            { key: 'load_a', label: 'OLT DC load', units: 'A', default: 28, min: 5, max: 100, step: 1 },
            { key: 'reserve_h', label: 'Required reserve time', units: 'hours', default: 4, min: 1, max: 24, step: 0.5 },
            { key: 'derate', label: 'De-rating factor (temp + aging)', units: '', default: 0.8, min: 0.6, max: 1.0, step: 0.05 },
          ]}
          formula={({ load_a, reserve_h, derate }) => {
            const raw_ah = load_a * reserve_h;
            const sized_ah = raw_ah / derate;
            return sized_ah;
          }}
          steps={({ load_a, reserve_h, derate }, sized_ah) => {
            const raw_ah = load_a * reserve_h;
            return [
              { expression: `Step 1 — Raw Ah needed = Load × Time = ${load_a} A × ${reserve_h} h`, value: raw_ah, unit: 'Ah' },
              { expression: `Step 2 — De-rate factor accounts for: (a) high summer temperature reducing VRLA capacity by ~15–20%, (b) end-of-life capacity loss (~20% after 5 years). De-rating factor: ${derate}` },
              { expression: `Step 3 — Sized Ah = Raw Ah ÷ De-rating = ${raw_ah.toFixed(0)} ÷ ${derate}`, value: sized_ah, unit: 'Ah' },
            ];
          }}
          sanityCheck={(sized_ah) => {
            const rounded = Math.ceil(sized_ah / 50) * 50;
            return `Sized battery capacity: ${sized_ah.toFixed(0)} Ah. Specify a standard battery string of ${rounded} Ah (next standard size up). VRLA AGM batteries are commonly available in 50, 75, 100, 150, 200 Ah ratings. At 24 cells per string (–48 V), specify ${rounded} Ah per cell rating. Verify with battery vendor datasheet at the installation temperature.`;
          }}
          resultLabel="Sized battery capacity"
          resultUnit="Ah"
          resultDecimals={0}
        />

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — Battery Reserve Specs</p>
          <p className="text-slate-300/90">
            <strong>Book (BICSI 002-2024 [confirm edition]; Telcordia GR-63-CORE [confirm edition — paywalled]):</strong>{' '}
            Telecom network equipment battery reserve is specified as minimum 4 hours at the
            design load for remote sites; 8 hours for central offices; with N+1 rectifier
            redundancy and a minimum of 2 battery strings for redundancy.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Small rural FTTH huts (under 2,000 subscribers) are
            routinely built with a single VRLA string sized for 2–4 hours. No redundancy.
            Single rectifier. When the one string degrades (typically around year 3–4 in
            high-temperature rural environments), the site has zero backup. The first 4-hour
            utility outage kills the OLT. The spec must call out minimum 4-hour reserve AND
            N+1 strings (at least two strings) to survive one string failure. Skipping
            redundancy to save $800 in battery cost is a false economy on a production network.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper — AC-Powered Huts and When –48VDC Doesn't Apply</h2>
        <p>
          Not all rural headend huts run on –48 VDC. Many smaller deployments (under
          500 subscribers) use commercial-grade OLT equipment powered by standard 120 VAC
          with an integral UPS (Uninterruptible Power Supply). These huts look very
          different:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>OLT shelf:</strong> Standard server-style AC power input (IEC 60320 C13/C14),
            built-in power supply with 120/240 VAC input. No separate DC distribution bus.
          </li>
          <li>
            <strong>UPS:</strong> Online or line-interactive UPS (typically 1–3 kVA) on the
            input to the OLT. Battery runtime is the UPS battery — typically 15–45 minutes
            at full load, far less than a purpose-built –48 VDC plant.
          </li>
          <li>
            <strong>Generator tie-in:</strong> Manual or automatic generator transfer. Without
            a generator, the UPS runtime determines service continuity during outages.
          </li>
        </ul>
        <p className="mt-3 text-sm text-slate-300/70">
          OSP engineering implication: when reviewing a hut spec, confirm whether the OLT
          is DC-powered or AC-powered BEFORE specifying the power plant. DC-powered = need
          to spec rectifiers + batteries + DC distribution. AC-powered = need to spec the
          UPS, branch circuit, and generator bypass. The common mistake: defaulting to a
          "–48 VDC plant" spec for an AC-powered OLT, resulting in incompatible infrastructure
          being built.
        </p>
        <p className="mt-2 text-sm text-slate-300/70">
          Source for NEBS/–48VDC requirement: ANSI/ATIS-0600336 [confirm current edition];
          Telcordia GR-63-CORE [paywalled — confirm edition]. NEBS requirement applies to
          carrier-grade CO equipment, not to commercial-grade OLT equipment commonly used
          in rural FTTH huts.
        </p>
        <p className="mt-3 text-sm text-slate-300/70">
          <strong>Equalization charging (brief note):</strong> In addition to float charging,
          VRLA battery strings periodically require equalization charging — a controlled
          elevated voltage applied for a set duration to balance cell voltages and reverse
          mild sulfation. Equalization is less common on modern sealed VRLA than on older
          flooded lead-acid cells, and some VRLA manufacturers recommend against it; always
          follow the battery manufacturer's specification [see IEEE 1188 [confirm edition]
          for VRLA maintenance methodology]. Full treatment of equalization, battery
          testing, and replacement thresholds is in T14 Bonding, Grounding &amp; Electrical
          Protection.
        </p>
      </section>

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T19.L03 Check — –48VDC Power Plant"
        mode="multiple-choice"
        questions={[
          {
            id: 'T19-L03-Q1',
            type: 'mc',
            prompt:
              'In a –48VDC CO power plant, which terminal of the battery string is connected to earth ground (held at 0 V)?',
            choices: [
              'The negative (–) terminal, because negative voltage is referenced to earth',
              'The positive (+) terminal — this is the negative-ground convention, where the positive terminal is grounded at 0 V and the negative terminal drives the load at –48 V',
              'Neither terminal is grounded — DC plants are floating (isolated) from earth',
              'Both terminals are grounded, with –48 V maintained as a differential',
            ],
            answerIndex: 1,
            explanation:
              'In the negative-ground convention, the battery\'s positive terminal is the battery return — connected to earth ground at 0 V. Equipment chassis bond to this 0 V return. The battery\'s negative terminal connects through the distribution bus to equipment loads at –48 V. This is counterintuitive but correct — the "negative" in –48VDC refers to the load-side terminal being negative relative to ground, not to the grounded terminal being negative.',
            citation: 'ANSI/ATIS-0600336; Telcordia GR-63-CORE [paywalled — confirm edition].',
          },
          {
            id: 'T19-L03-Q2',
            type: 'fill-in-blank',
            prompt:
              'A –48V battery string consists of 24 cells in series. The nominal voltage per cell is ____ volts.',
            answer: '2',
            answerDisplay: '2 V per cell',
            explanation:
              '24 cells × 2 V per cell = 48 V nominal. The float voltage (fully charged) is 2.25–2.27 V per cell, so a fully charged 24-cell string measures approximately 54 V. Equipment must be rated to operate across the voltage range from end-of-discharge (approximately 1.75 V/cell × 24 = 42 V) to full float (54 V).',
          },
          {
            id: 'T19-L03-Q3',
            type: 'mc',
            prompt:
              'An OSP engineer is specifying the power plant for a rural FTTH hut. The OLT draws 32 A at –48 VDC. The required reserve time is 4 hours. De-rating factor is 0.8 (for temperature and end-of-life). What is the required battery string capacity?',
            choices: [
              '128 Ah (32 × 4 = 128 Ah, no de-rating)',
              '160 Ah (32 × 4 ÷ 0.8 = 160 Ah)',
              '102.4 Ah (32 × 4 × 0.8 = 102.4 Ah)',
              '80 Ah (32 × 4 ÷ 1.6 = 80 Ah)',
            ],
            answerIndex: 1,
            explanation:
              'Step 1: Raw Ah = Load × Time = 32 A × 4 h = 128 Ah. Step 2: De-rating divides the raw Ah by the de-rating factor (NOT multiplies). De-rating accounts for capacity loss at high temperature and end-of-life degradation. Sized Ah = 128 ÷ 0.8 = 160 Ah. Specify a 200 Ah VRLA string (next standard size above 160 Ah).',
          },
          {
            id: 'T19-L03-Q4',
            type: 'mc',
            prompt:
              'A CO battery plant shows a bus voltage of –54 V during normal operations (utility power normal, equipment running). Is this a fault condition?',
            choices: [
              'Yes — the nominal voltage is –48 V; –54 V indicates overcharging and cell damage',
              'No — –54 V is the expected float voltage for a fully charged 24-cell VRLA string at 2.25 V per cell (24 × 2.25 = 54 V). Equipment must be rated for this full float voltage range.',
              'Yes — normal operating voltage should be exactly –48 V; any deviation means a rectifier fault',
              'No — but voltage above –52 V triggers an automatic load-disconnect in all NEBS equipment',
            ],
            answerIndex: 1,
            explanation:
              'Float voltage for VRLA cells is approximately 2.25–2.27 V per cell. At 24 cells, this is 54–54.5 V. A bus reading of –54 V is normal fully-charged float voltage, not a fault. The equipment must be rated to operate across the full operating range: typically –40.5 V (end of discharge at 1.75 V/cell × 24 - allow for some voltage drop) to –57.6 V (high float limit). This range is defined in NEBS (Telcordia GR-63-CORE [paywalled]).',
          },
          {
            id: 'T19-L03-Q5',
            type: 'mc',
            prompt:
              'Which component in a CO power plant continuously charges the battery strings while simultaneously supplying DC power to the equipment?',
            choices: [
              'The ATS (Automatic Transfer Switch)',
              'The PDU (Power Distribution Unit)',
              'The rectifier',
              'The VRLA battery management controller',
            ],
            answerIndex: 2,
            explanation:
              'Rectifiers convert AC utility power to regulated DC and perform both functions simultaneously: supply DC to the equipment AND maintain float charge on the battery strings. The batteries "float" at the rectifier output voltage — they are always charged and ready. When utility fails, the rectifiers stop supplying power and the batteries discharge through the same bus to the equipment without any switching event.',
          },
        ]}
      />

    </LessonLayout>
  );
}
