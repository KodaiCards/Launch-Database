import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';

export const meta = {
  id: 'T15.L05',
  course_id: 'T15',
  title: 'Splice Trailer Setup',
  order: 5,
  prerequisites: ['T15.L04'],
  learning_objectives: [
    'Identify the minimum generator separation distance required by NIOSH for carbon monoxide safety',
    'Describe the power, grounding, lighting, and workspace requirements for an emergency splice trailer setup',
    'Explain the environmental controls required for fusion splicing under field conditions',
    'Identify fire, chemical, and electrical hazards present in a splice trailer and the corresponding controls',
    'Describe the equipment and consumables required for a complete emergency restoration kit',
  ],
  estimated_minutes: 22,
  vocabulary_introduced: [
    'splice trailer',
    'field generator separation',
    'IEC protection class (IP rating)',
    'fusion splicer cleave angle',
    'arc calibration',
  ],
  vocabulary_assumed: [
    { term: 'fusion splice', source_lesson_id: 'T11.L04' },
    { term: 'OTDR trace', source_lesson_id: 'T12.L07' },
    { term: 'temporary patch', source_lesson_id: 'T15.L04' },
    { term: 'permanent restoration', source_lesson_id: 'T15.L04' },
    { term: 'fiber type confirmation', source_lesson_id: 'T15.L04' },
    { term: 'mobilization', source_lesson_id: 'T15.L01' },
    { term: 'PPE (general)', source_lesson_id: 'T18.L01' },
    { term: 'LOTO', source_lesson_id: 'T18.L05' },
  ],
  key_terms: [
    {
      term: 'splice trailer',
      definition: 'A field vehicle or enclosed trailer configured as a mobile splice workstation — providing environmental control (temperature, humidity, wind), power, lighting, OTDR and fusion splicer workspace, and secure storage for consumables.',
    },
    {
      term: 'field generator separation',
      definition: 'The minimum distance a portable generator must be positioned from any enclosed workspace, air intake, or occupied vehicle to prevent carbon monoxide (CO) accumulation. NIOSH recommendation: 20 feet minimum with exhaust directed away from all air intakes.',
    },
    {
      term: 'IEC protection class (IP rating)',
      definition: 'The Ingress Protection rating (IEC 60529) indicating a device\'s resistance to solid particles and liquids. IPXX format: first digit = dust (0–6), second digit = water (0–9K). IP54 means dust-protected + splash-resistant; IP67 means dust-tight + submersion up to 1 meter.',
    },
    {
      term: 'fusion splicer cleave angle',
      definition: 'The angular deviation of a cleaved fiber end face from perfect perpendicular (90°). Target cleave angle for low-loss singlemode fusion splicing is ≤0.5°. Maximum acceptable cleave angle in emergency restoration scenarios is ≤1.0° per splicer specifications. In emergency restoration, getting service back quickly may trump perfection — a splice at 0.7° cleave that meets the splicer\'s acceptance criteria goes into service temporarily and may be replaced with a permanent re-do per service continuity plan. Measured by the fusion splicer\'s internal vision system before arc initiation.',
    },
    {
      term: 'arc calibration',
      definition: 'The pre-splice test firing of the fusion splicer\'s electrode arc in ambient conditions to establish the correct arc power and duration for the current temperature, humidity, and altitude — required before splicing any production fibers.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

// ─── Worked Example: CO concentration decay ─────────────────────────────────
const CO_WORKED = {
  title: 'Generator Separation: Why 20 Feet?',
  formula: 'C = S / (Q × k)',
  variables: [
    { symbol: 'C', unit: 'ppm', description: 'CO concentration in enclosed space' },
    { symbol: 'S', unit: 'ppm·CFM', description: 'CO source rate (generator output × emission factor)' },
    { symbol: 'Q', unit: 'CFM', description: 'Ventilation airflow rate into the space' },
    { symbol: 'k', unit: 'dimensionless', description: 'Mixing factor (1.0 = perfect mixing; real spaces 0.5–0.8)' },
  ],
  steps: [
    'This is a simplified steady-state model. The key principle: CO concentration is proportional to the source rate (generator emissions) and inversely proportional to ventilation.',
    'A typical 5 kW generator produces ~40–100 ppm CO at 20 feet downwind in calm air (NIOSH data). At 10 feet, CO concentration can be 4–10× higher due to the inverse-square relationship between distance and plume dilution.',
    'NIOSH DHHS Publication 96-118 sets the minimum generator separation at 20 feet with exhaust directed away from all air intakes. This is not a comfort standard — CO at 200 ppm causes headache and dizziness within 2 hours; at 400 ppm, life-threatening symptoms within 3 hours (NIOSH IDLH = 1,200 ppm).',
    'The 20-foot rule assumes calm-to-light wind and a standard 5–10 kW portable generator. In enclosed valleys, against building faces, or with higher-output generators, additional separation or exhaust extensions are required.',
    'Sanity check: at 20 feet in an open field with light wind, a typical 5 kW generator\'s exhaust plume disperses to below the NIOSH 35 ppm REL (Recommended Exposure Limit), which is a ceiling — an instantaneous maximum over 15 minutes. CO is an acute hazard, not a chronic (8-hour average) hazard. At 10 feet in calm air, the generator exhaust plume exceeds this ceiling.',
  ],
  result: '20 ft minimum — NIOSH recommendation for portable generators near enclosed workspaces. This is the engineering separation distance, not an administrative preference.',
};

// ─── Quiz questions ──────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'What is the NIOSH-recommended minimum separation distance between a portable generator and an enclosed workspace (such as a splice trailer)?',
    options: [
      '5 feet, provided the exhaust is pointed away from the trailer door',
      '10 feet',
      '15 feet',
      '20 feet, with exhaust directed away from all air intakes',
    ],
    correct: 3,
    explanation: 'NIOSH DHHS Publication 96-118 recommends a minimum of 20 feet between a portable generator and any enclosed workspace, with the exhaust directed away from air intakes. The common field shorthand of "10 feet" is below the NIOSH minimum and has been associated with fatal CO poisoning incidents in field crews. The 20-foot distance is the engineering separation; in sheltered or enclosed areas (building faces, trench walls, back-of-trailer in a hollow), additional separation or exhaust extensions are required.',
  },
  {
    id: 'q2',
    question: 'Before splicing the first production fiber in the field, the fusion splicer requires which mandatory step?',
    options: [
      'Arc calibration — a test-arc firing to establish correct arc power for ambient temperature, humidity, and altitude',
      'Cleave the first fiber and inspect manually before using the splicer\'s vision system',
      'Run a full fiber count of the cable to confirm tube assignments',
      'Power cycle the splicer three times to clear any stored arc profiles',
    ],
    correct: 0,
    explanation: 'Arc calibration (sometimes called an "arc check" or "discharge calibration") is a mandatory pre-splice step on all modern fusion splicers. The arc power required to fuse singlemode fibers varies with temperature (denser air at cold temperatures requires different arc parameters), humidity, and altitude (thinner air at high altitude). Skipping arc calibration leads to over- or under-fused splices that pass visual inspection but fail under temperature cycling. Most splicers prompt for arc calibration automatically when ambient conditions change significantly.',
  },
  {
    id: 'q3',
    question: 'A splice trailer has its door facing east. The generator is positioned 20 feet south of the trailer with exhaust pointing north (directly toward the trailer door). Is this setup compliant with NIOSH guidance?',
    options: [
      'Yes — 20 feet is the required separation distance and that requirement is met',
      'No — the 20-foot separation requirement also requires exhaust directed AWAY from air intakes; exhaust pointing toward the trailer door violates the guidance',
      'Yes — CO disperses fully at 20 feet in any exhaust direction',
      'No — generators must always be positioned at least 40 feet from enclosed workspaces',
    ],
    correct: 1,
    explanation: 'The NIOSH guidance specifies BOTH 20 feet AND exhaust directed away from air intakes and entrances. Distance alone is insufficient if the exhaust is aimed directly at the workspace opening — CO plume concentration at 20 feet in the direction of exhaust can still exceed safe levels. The generator must be positioned so its exhaust points away from the trailer door, any windows, and HVAC intakes. In this scenario, the exhaust pointing north (toward the trailer door) violates the directional requirement even though the distance is met.',
  },
  {
    id: 'q4',
    question: 'During a pre-splice fiber cleave check, the fusion splicer\'s vision system reports a cleave angle of 1.8°. What is the correct action?',
    options: [
      'Proceed with the splice — cleave angle affects aesthetics but not optical loss',
      'Recleave the fiber — 1.8° exceeds the typical ≤0.5° maximum for low-loss singlemode splicing',
      'Adjust the fusion splicer arc parameters to compensate for the angled cleave',
      'Accept the cleave if it is less than 3° — that is the FOA field tolerance',
    ],
    correct: 1,
    explanation: 'A cleave angle of 1.8° far exceeds the typical maximum of ≤0.5° for low-loss singlemode fusion splicing. An angled cleave prevents full fiber-end contact during arc initiation, creating a gap that fuses as a high-loss, high-reflection joint — it may look clean on the splicer\'s vision system image but will fail OTDR verification. The correct action is always to recleave when the angle exceeds the splicer manufacturer\'s limit (typically ≤0.5°). Arc parameters compensate for atmospheric conditions, not for bad cleaves.',
  },
];

export default function L05SpliceTrailerSetup() {
  return (
    <LessonLayout meta={meta}>
      <h1>T15.L05 — Splice Trailer Setup</h1>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section className="lesson-section foundations">
        <h2>In Plain English</h2>
        <p>
          A fusion splicer needs a clean, stable, controlled environment to produce a good splice.
          Dirt and wind destroy cleaved fiber ends. Cold temperatures and low humidity affect arc
          parameters. Vibration from traffic ruins the alignment system. A splice trailer is the
          solution to all of this — a mobile, enclosed workspace that brings the lab environment to the
          field.
        </p>
        <p>
          The trailer also has hazards: a generator running nearby is a silent carbon monoxide (CO)
          source. CO is colorless, odorless, and fatal at high concentrations — you won't know it's
          accumulating until you're impaired. The positioning rules for generators are non-negotiable
          safety requirements, not convenience preferences.
        </p>
        <p>
          This lesson covers: how to set up a splice trailer safely (especially generator placement),
          environmental controls for field splicing, equipment pre-checks, and what should be in every
          emergency restoration kit.
        </p>

        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500 mt-4">
          <strong>Callback:</strong> Recall from <strong>T11.L04 Fusion Splicing Process</strong> — tools and materials for splicing. <strong>T12.L08 Post-Splice Testing and Closure</strong> — closure sealing. This lesson covers the logistics: splice trailer setup and equipment checklist for field mobilization during an outage when time is critical.
        </p>
      </section>

      {/* ── GENERATOR SAFETY ──────────────────────────────────────────────── */}
      <section className="lesson-section working">
        <div className="border-l-4 border-blue-400/30 bg-blue-400/5 p-3 my-3 rounded text-sm">
          <strong>Quick Refresher:</strong> Before setting up the splice trailer, recall foundational concepts:
          <ul className="mt-2 space-y-1 ml-4 list-disc text-slate-600">
            <li><strong>Fusion Splice</strong> (T11.L04) — the splicing process that requires precise temperature control and humidity conditions. The trailer's environmental controls support this.</li>
            <li><strong>OTDR Trace</strong> (T12.L07) — post-splice verification performed inside the trailer. The workspace must accommodate an OTDR setup alongside the splicer.</li>
            <li><strong>Temporary Patch</strong> (T15.L04) — some repairs may skip the trailer (mechanical splice in the field). Permanent restoration uses the trailer.</li>
            <li><strong>Permanent Restoration</strong> (T15.L04) — fusion splicing with full environmental control. The trailer IS the permanent restoration tool.</li>
            <li><strong>PPE (General)</strong> (T18.L01) — personal protective equipment required around high-voltage power, arc equipment, and heat sources in the trailer.</li>
            <li><strong>LOTO</strong> (T18.L05) — Lockout/Tagout applies before connecting external power to the trailer's main electrical panel.</li>
          </ul>
        </div>

        <h2>Generator Placement: Carbon Monoxide Safety</h2>

        <div className="callout critical">
          <strong>Safety Critical:</strong> Carbon monoxide (CO) poisoning is the leading cause of
          accidental poisoning death in the United States. Portable generators produce CO as a
          combustion byproduct. NIOSH DHHS Publication 96-118 establishes the engineering separation
          for field use:
          <ul>
            <li><strong>Minimum 20 feet</strong> between the generator and any enclosed workspace, air intake, or occupied vehicle</li>
            <li><strong>Exhaust directed away</strong> from all air intakes, doors, and windows — distance alone is insufficient if the exhaust points toward the trailer</li>
            <li><strong>Never run a generator</strong> inside a trailer, vehicle, garage, or any enclosed space regardless of ventilation</li>
          </ul>
          The common field practice of "10 feet" is below the NIOSH minimum and has been associated
          with fatal CO incidents in splice crews. Use 20 feet.
        </div>

        <WorkedExample {...CO_WORKED} />

        <h3>Additional Generator Safety Rules</h3>
        <ul>
          <li>
            <strong>CO detector mandatory</strong> inside the trailer when a generator is running nearby.
            Battery-operated CO detector (rated for enclosed spaces) positioned near the floor (CO is
            approximately the same density as air — it accumulates uniformly, not just at floor level,
            but a floor-level detector provides early warning for any inflow).
          </li>
          <li>
            <strong>Engine off before fueling</strong>: allow 5 minutes of cool-down before refueling.
            Hot exhaust surfaces can ignite gasoline vapor.
          </li>
          <li>
            <strong>Fire extinguisher</strong> (minimum ABC-class, 5 lb) within 10 feet of the generator.
          </li>
          <li>
            <strong>Generator grounding</strong>: the generator frame must be bonded to the trailer's
            equipment ground per NEC Article 445 and OSHA 1926.404(f)(3) to prevent ground-fault
            shock hazard. This is a separate ground from the neutral conductor — consult the generator
            manufacturer's manual for the correct bonding configuration (separately derived system vs.
            floating neutral).
          </li>
        </ul>
      </section>

      {/* ── WORKSPACE SETUP ───────────────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>Splice Trailer Workspace Requirements</h2>

        <h3>Environmental Controls</h3>
        <p>
          Fusion splicing requires stable environmental conditions. The primary concerns are:
        </p>
        <ul>
          <li>
            <strong>Temperature:</strong> most fusion splicers operate within a specified range (typically
            –10 °C to +50 °C). Below this, arc parameters require recalibration more frequently and
            cleave tools may behave inconsistently. Above this, the splicer's cooling system may
            throttle performance. If ambient temperature is outside the splicer's range, the trailer
            must be heated or cooled before splicing.
          </li>
          <li>
            <strong>Humidity:</strong> high humidity (above ~85% RH) causes fiber ends to absorb moisture
            between cleaving and splicing, increasing splice loss. In high-humidity conditions, minimize
            the time between cleave and arc.
          </li>
          <li>
            <strong>Wind:</strong> even a light breeze across the splicer's V-groove will displace a
            cleaved fiber end and ruin alignment. The trailer door must remain closed during splicing.
            If work is done at the tailgate, use a wind screen.
          </li>
          <li>
            <strong>Dust and particulate:</strong> a single fiber-sized dust particle on the V-groove
            causes a misaligned splice. Keep the trailer's interior clean. Use canned air (not shop air
            — too much pressure) to clean V-grooves. Never work on a bare tailgate in sandy or dusty
            conditions.
          </li>
        </ul>

        <h3>Lighting</h3>
        <p>
          Minimum 50 foot-candles at the work surface for splicing. The fiber buffer tubes (color-coded)
          must be clearly distinguishable — incorrect tube/fiber pairing is the most common
          documentation error in emergency splicing. Use a headlamp plus dedicated task lighting.
          Do not rely on the trailer's overhead light alone in night operations.
        </p>

        <h3>Power Requirements</h3>
        <p>
          A typical field splicing setup requires:
        </p>
        <ul>
          <li>Fusion splicer: 100–240 VAC, 60 Hz, 300–800 W (check manufacturer specification)</li>
          <li>OTDR: 100–240 VAC or DC-powered (most have internal battery — charge before deployment)</li>
          <li>Workstation lighting: 100–300 W</li>
          <li>HVAC (if trailer-mounted): 500–1500 W</li>
          <li>Total typical load: 1.5–3 kW continuous</li>
        </ul>
        <p>
          A 5 kW generator provides adequate headroom. Size the generator at 150% of the expected
          continuous load to allow for start-up surge and equipment not yet listed.
        </p>
      </section>

      {/* ── PRE-SPLICE EQUIPMENT CHECKS ─────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>Pre-Splice Equipment Checks</h2>

        <h3>Arc Calibration</h3>
        <p>
          Before splicing the first production fiber, run an <strong>arc calibration</strong> on the
          fusion splicer. This test-fires the arc in ambient conditions to establish the correct power
          and duration for the current environment. Temperature, altitude, and humidity all affect how
          the arc behaves — a calibration profile set for sea-level warm weather will over-fuse fibers
          at 4,000 ft elevation on a cold night.
        </p>
        <p>
          Most modern splicers prompt for arc calibration automatically when conditions deviate from
          the stored profile. Always accept the prompt. In emergency operations, run arc calibration
          even if the splicer doesn't prompt — conditions in the field have likely changed since the
          last calibration.
        </p>

        <h3>Cleave Quality Verification</h3>
        <p>
          Before arc calibration, confirm the cleave tool is producing acceptable cleave angles.
          Cleave 3–5 test fibers and confirm the splicer's vision system shows ≤0.5° cleave angle
          consistently. If the cleave tool is producing angles above 0.5°, inspect and clean the
          blade. Replace the blade if worn (most cleave tools have a 16-position rotating blade that
          provides 16 clean cleaves per blade face — check position indicator).
        </p>

        <h3>OTDR Pre-Check</h3>
        <p>
          The OTDR must be charged and functional before leaving the depot — not discovered dead on-site.
          Confirm:
        </p>
        <ul>
          <li>Battery at &gt;50% or external power available</li>
          <li>Launch cable attached and clean (clean the connector with IPA wipe before connecting)</li>
          <li>Wavelength settings match the project fiber type (1310/1550 nm for G.652.D singlemode)</li>
          <li>IOR setting matches the cable (G.652.D at 1550 nm: approximately 1.4682 — confirm from manufacturer datasheet; see T12.L07)</li>
          <li>Range setting appropriate for the expected fault distance plus 20% margin</li>
        </ul>
      </section>

      {/* ── EMERGENCY RESTORATION KIT ─────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>Emergency Restoration Kit</h2>
        <p>
          A properly stocked emergency restoration kit prevents a 4-hour repair from becoming a
          6-hour repair due to a missing consumable. Minimum kit contents:
        </p>

        <table className="equipment-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Fusion splicer</td>
              <td>1</td>
              <td>Charged; arc calibration run within past 24 hours</td>
            </tr>
            <tr>
              <td>Cleave tool with fresh blade</td>
              <td>1 + 1 spare blade</td>
              <td>Check blade position indicator before departure</td>
            </tr>
            <tr>
              <td>Heat-shrink splice protectors</td>
              <td>≥ 2× expected fiber count + 10 spare</td>
              <td>Match to fiber OD (standard vs. ribbon splice)</td>
            </tr>
            <tr>
              <td>Isopropyl alcohol (IPA) wipes, lint-free</td>
              <td>≥ 50 individual packets</td>
              <td>99% IPA minimum; avoid reusable wipes in field</td>
            </tr>
            <tr>
              <td>OTDR with launch cable</td>
              <td>1</td>
              <td>Charged; matched to cable fiber type</td>
            </tr>
            <tr>
              <td>Splice closure kit</td>
              <td>1 per anticipated splice point + 1 spare</td>
              <td>Match to buried-cable closure type per project spec</td>
            </tr>
            <tr>
              <td>Buffer tube identification chart (TIA-598-C color codes)</td>
              <td>1 laminated</td>
              <td>Buffer tube colors (Blue, Orange, Green, Brown, Slate, White, Red, Black, Yellow, Violet, Rose, Aqua)</td>
            </tr>
            <tr>
              <td>Cable identification labels and permanent markers</td>
              <td>20+</td>
              <td>For marking individual fibers and buffer tubes</td>
            </tr>
            <tr>
              <td>CO detector</td>
              <td>1</td>
              <td>Battery-checked; rated for enclosed spaces</td>
            </tr>
            <tr>
              <td>Fire extinguisher (ABC, 5 lb)</td>
              <td>1</td>
              <td>Within 10 feet of generator</td>
            </tr>
            <tr>
              <td>PPE: safety glasses, cut-resistant gloves, disposable fiber tray</td>
              <td>Per crew member</td>
              <td>Fiber shards are an eye and skin hazard — all loose fiber ends go in the disposal tray, never loose in the trailer</td>
            </tr>
          </tbody>
        </table>

        <div className="callout field-note">
          <strong>Field Note — Fiber Disposal:</strong> Cleaved fiber ends are a serious eye and skin
          hazard. Each cleave produces a glass sliver approximately 125 µm in diameter and 2–8 mm long.
          These are nearly invisible and will penetrate skin on contact. The disposal protocol: every
          cleaved fiber end goes immediately into the fiber disposal tray (a small container with
          adhesive inside), never onto the work surface, never onto clothing, never onto the floor of
          the trailer. At end of shift, the tray is sealed and disposed of as glass waste. A splicer
          who develops the habit of dropping fiber ends on the work surface will eventually find one in
          their eye or under their fingernail.
        </div>
      </section>

      {/* ── ADVANCED ──────────────────────────────────────────────────────── */}
      <section className="lesson-section advanced">
        <h2>Advanced: Splicer Maintenance and Battery Management</h2>
        <p>
          <strong>Electrode Replacement:</strong> Fusion splicer electrodes (the tungsten rods that produce
          the arc) degrade with use. A typical electrode set is rated for approximately 2,000–5,000 arcs
          (varies by manufacturer and splice type). Degraded electrodes produce unstable arcs, increased
          splice loss, and failed cleave-angle checks that are actually arc issues, not cleave issues.
          Maintain a spare electrode set in the emergency kit. Electrode replacement is a 5-minute
          procedure with the splicer powered off.
        </p>
        <p>
          <strong>V-Groove Cleaning:</strong> The V-grooves that hold the fiber in alignment must be
          cleaned after every 20–30 splices, or any time debris is visible. Use the splicer manufacturer's
          cleaning kit (typically a stick-type cleaner with a soft tip). Never use metal tools in the
          V-groove — scratching the groove surface creates a permanent alignment error.
        </p>
        <p>
          <strong>Battery vs. AC Power:</strong> Most field splicers can run on internal battery (good
          for 50–100 splices per charge) or external AC. In a generator-powered setup, run on AC power
          to preserve battery for the next emergency where generator power isn't available. Always
          start a restoration job with a fully charged splicer battery as insurance against generator
          failure.
        </p>
      </section>

      {/* ── FLASHCARDS ────────────────────────────────────────────────────── */}
      <section className="lesson-section flashcards">
        <h2>Key Terms</h2>
        <div className="flashcard-grid">
          {meta.key_terms.map((kt) => (
            <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
          ))}
        </div>
      </section>

      {/* ── QUIZ ──────────────────────────────────────────────────────────── */}
      <section className="lesson-section quiz">
        <h2>Lesson Quiz</h2>
        <Quiz questions={QUIZ_QUESTIONS} lessonId={meta.id} />
      </section>
    </LessonLayout>
  );
}
