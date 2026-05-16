// Net-new — T18.L03 Confined Space Entry — Manholes & Vaults
// Working lesson: 1910.268(o) vs 1910.146, atmospheric testing, attendant role

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T18.L03',
  course_id: 'T18',
  title: 'Confined Space Entry — Manholes & Vaults',
  order: 3,
  lesson_type: 'working',
  prerequisites: ['T18.L01', 'T18.L02'],
  vocabulary_introduced: [
    'confined space',
    'permit-required confined space',
    'atmospheric testing',
    'attendant',
    'oxygen-deficient atmosphere',
  ],
  key_terms: [
    {
      term: 'confined space',
      definition:
        'A space large enough for an employee to enter and work inside, not designed for continuous occupancy, with limited or restricted means of entry or exit. Examples: telecom manholes, underground vaults, pedestal bases larger than a step-in size.',
    },
    {
      term: 'permit-required confined space',
      definition:
        'A confined space with one or more of: a hazardous or potentially hazardous atmosphere, a material that could engulf an entrant, inwardly converging walls or floor that could trap an entrant, or any other recognized serious safety hazard. Entry requires a written permit before anyone goes in — per 29 CFR 1910.146.',
    },
    {
      term: 'atmospheric testing',
      definition:
        'Pre-entry measurement of oxygen level, combustible gas concentration, and toxic gas concentrations inside a confined space using a calibrated multi-gas monitor. Required by 29 CFR 1910.268(o)(2) before entering any telecom manhole or unvented vault.',
    },
    {
      term: 'attendant',
      definition:
        'The topside person stationed outside a confined space during entry. Monitors atmospheric conditions and worker status, maintains communication with the entrant(s), and initiates rescue procedures if a hazard develops. The attendant does NOT enter the space unless relieved.',
    },
    {
      term: 'oxygen-deficient atmosphere',
      definition:
        'An atmosphere with less than 19.5% oxygen by volume — the lower acceptable limit per 29 CFR 1910.146(b). Below 16% O₂, a worker can lose consciousness with no warning symptoms. Normal air is about 20.9% O₂.',
    },
  ],
  vocabulary_assumed: [
    { term: 'hazard recognition', source_lesson_id: 'T18.L01' },
    { term: 'hierarchy of controls', source_lesson_id: 'T18.L01' },
    { term: 'LOTO', source_lesson_id: 'T18.L02' },
    { term: 'energy isolating device', source_lesson_id: 'T18.L02' },
  ],
  estimated_minutes: 30,
};

export default function T18L03_ConfinedSpaceEntry() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          A telecom manhole looks like a simple hole in the ground. It is not. Once you climb
          below grade, you are in a confined space — a space where air doesn't circulate freely,
          where gases accumulate silently, and where escaping quickly is hard. The leading killer
          in confined-space incidents is not physical injury from tools or equipment. It's
          <strong> atmospheric hazard</strong>: workers who entered without testing the air and
          passed out before they knew anything was wrong.
        </p>
        <p className="mt-2">
          The good news is that the hazard is controllable with a simple process: test the air
          before you go in, ventilate if needed, and keep someone topside at all times. This
          lesson covers exactly that process — and the critical legal distinction between what
          telecom crews do for routine manholes vs. what a full permit-required confined space
          entry looks like.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">Context</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">PRCS</td>
              <td className="px-3 py-2">Permit-Required Confined Space</td>
              <td className="px-3 py-2">A confined space with a recognized serious hazard; requires a written permit before entry</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">LEL</td>
              <td className="px-3 py-2">Lower Explosive Limit</td>
              <td className="px-3 py-2">The minimum concentration of combustible gas in air that will ignite; measured as a percentage of that limit (0–100% LEL). Above 25% LEL = immediate action required. (LEL is also called LFL — Lower Flammable Limit — in NFPA documents and some standards literature; the values are identical.)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">IDLH</td>
              <td className="px-3 py-2">Immediately Dangerous to Life or Health</td>
              <td className="px-3 py-2">An atmospheric concentration that poses an immediate threat to life or could cause irreversible adverse health effects. Leave immediately; no LOTO or rescue attempt without SCBA.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">O₂</td>
              <td className="px-3 py-2">Oxygen</td>
              <td className="px-3 py-2">Normal air = 20.9% O₂. Acceptable range for entry: 19.5%–23.5%.</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">What makes a manhole a confined space?</h3>
        <p className="mt-2">
          A space is a confined space if it meets all three of these conditions (per 29 CFR 1910.146(b)):
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-300/90">
          <li>Large enough for an employee to enter and work inside.</li>
          <li>Not designed for continuous employee occupancy (you go in to work, not to work from).</li>
          <li>Has limited or restricted means of entry or exit — like a manhole ring with a single opening.</li>
        </ul>
        <p className="mt-2">
          Every telecom manhole that an employee enters meets all three conditions. It is a
          confined space by definition. That means atmospheric testing is required before entry,
          every time — regardless of whether you were in it an hour ago or the sun is shining.
          Conditions can change in minutes.
        </p>

        <h3 className="mt-5 font-semibold">The acceptable atmosphere range</h3>
        <p className="mt-2">
          Before entry, your multi-gas monitor must read within these ranges for the space to
          be considered safe:
        </p>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Gas / Parameter</th>
                <th className="px-3 py-2 text-left">Safe Range (entry)</th>
                <th className="px-3 py-2 text-left">Action if Outside Range</th>
                <th className="px-3 py-2 text-left">Exit threshold (if already inside)</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Oxygen (O₂)</td>
                <td className="px-3 py-2 font-mono">19.5% – 23.5%</td>
                <td className="px-3 py-2">Ventilate; do not enter until in range. Below 16% = IDLH.</td>
                <td className="px-3 py-2 font-mono text-red-400">&lt; 19.5% or &gt; 23.5%: exit immediately</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Combustible gas (% LEL)</td>
                <td className="px-3 py-2 font-mono">&lt; 10% LEL</td>
                <td className="px-3 py-2">10–25% LEL: ventilate, re-test; continue ventilation during work. &gt;25% LEL: do not enter; call supervisor; wait for gas utility response.</td>
                <td className="px-3 py-2 font-mono text-red-400">&gt; 10% LEL: exit immediately</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Carbon monoxide (CO)</td>
                <td className="px-3 py-2 font-mono">&lt; 25 ppm (ACGIH TLV-TWA)</td>
                <td className="px-3 py-2">Ventilate; identify source before entry. (For scale: NIOSH IDLH = 1,200 ppm = immediate threat to life — the 25 ppm exit threshold in column 4 is your actual trigger, far before IDLH.)</td>
                <td className="px-3 py-2 font-mono text-red-400">&gt; 25 ppm: exit immediately</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Hydrogen sulfide (H₂S)</td>
                <td className="px-3 py-2 font-mono">&lt; 1 ppm</td>
                <td className="px-3 py-2">Evacuate and ventilate immediately; at 100 ppm = NIOSH IDLH — exit immediately, no re-entry without SCBA.</td>
                <td className="px-3 py-2 font-mono text-red-400">&gt; 1 ppm: exit immediately</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: 29 CFR 1910.146(b) — Acceptable oxygen range; 29 CFR 1910.268(o)(2) —
          Atmospheric testing for telecom manholes (osha.gov; ecfr.gov).
        </p>

        {/* ── FLASHCARDS ──────────────────────────────────────────────────── */}
        <Flashcard
          deckId="T18-L03"
          cards={[
            {
              id: 'T18-L03-fc-cs',
              front: 'What is a confined space?',
              back: 'A space large enough for an employee to enter and work, not designed for continuous occupancy, with limited means of entry or exit. Every telecom manhole meets all three conditions.',
            },
            {
              id: 'T18-L03-fc-prcs',
              front: 'What is a permit-required confined space (PRCS)?',
              back: 'A confined space with one or more of: a hazardous atmosphere, engulfment hazard, inwardly converging walls, or any other recognized serious hazard. Entry requires a written permit before anyone goes in — per 29 CFR 1910.146.',
            },
            {
              id: 'T18-L03-fc-atm-test',
              front: 'What is atmospheric testing and when is it required?',
              back: 'Pre-entry measurement of oxygen level, combustible gas, and toxic gas concentrations using a calibrated multi-gas monitor. Required by 29 CFR 1910.268(o)(2) before entering any telecom manhole or unvented vault — every time, regardless of prior entry.',
            },
            {
              id: 'T18-L03-fc-attendant',
              front: 'What is the attendant\'s job in confined space entry?',
              back: 'The topside person stationed outside the space during entry. Monitors atmospheric conditions and worker status, maintains communication with entrant(s), and initiates rescue procedures if a hazard develops. The attendant does NOT enter the space unless relieved by another trained attendant.',
            },
            {
              id: 'T18-L03-fc-o2-deficient',
              front: 'What is an oxygen-deficient atmosphere?',
              back: 'Below 19.5% O₂ by volume — the lower acceptable limit. Below 16% O₂, a worker can lose consciousness with no warning symptoms. Normal air is about 20.9% O₂. Continuous forced ventilation is the engineering control to maintain safe O₂ levels.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The Critical Legal Distinction: 1910.268(o) vs. 1910.146</h2>

        <p>
          This is the most important book-vs-field gap in the entire T18 topic. Getting this
          wrong causes one of two equally bad outcomes: crews who skip atmospheric testing
          entirely ("we don't need a permit for manholes"), or crews who grind work to a halt
          with full PRCS permit paperwork every time they open a manhole cover.
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-2">The Rule — and Why It Looks Contradictory</p>
          <p className="text-slate-300/90">
            <strong>29 CFR 1910.146</strong> (Permit-Required Confined Spaces) is the general
            OSHA confined space standard. It says manholes that can have hazardous atmospheres
            are PRCS — requiring written permits, formal rescue plans, retrieval systems, and
            all associated paperwork.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>29 CFR 1910.268(o)</strong> (Telecommunications) is the industry-specific
            standard. Per 29 CFR 1910.5(c)(1), when a specific standard addresses a condition,
            it supersedes the more general standard. OSHA confirmed this in a 1993 interpretation
            letter: for routine telecom manhole work, 1910.268(o) — not 1910.146 — is the
            primary standard.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>What 1910.268(o)(2) actually requires:</strong>
          </p>
          <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-300/90">
            <li>Test the atmosphere before entry (oxygen, combustibles, toxics).</li>
            <li>If combustible gas is present at any level: provide continuous forced ventilation while work proceeds and workers are inside.</li>
            <li>If you can achieve a safe atmosphere through testing and ventilation: proceed under 1910.268(o) without a written permit.</li>
            <li>Guard the open manhole with a railing, cover, or barrier (1910.268(o)(1)).</li>
            <li>Ladder required if the manhole exceeds 4 feet in depth (1910.268(h)(8)).</li>
          </ul>
          <p className="text-slate-300/90 mt-2">
            <strong>When does 1910.146 PRCS kick back in?</strong> When the hazard CANNOT be
            controlled by testing and ventilation under 1910.268(o)(2). Examples: a manhole
            flooded with chemical contamination from an adjacent pipeline, sewage intrusion with
            active H₂S generation, or a chemical spill that cannot be purged. In those cases,
            the space cannot be made safe with standard telecom crew procedures — full
            1910.146 PRCS with written permit, designated rescue team, retrieval system, and
            rescue-rated SCBA is required.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">The practical crew process for a routine manhole</h3>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm text-slate-300/90">
          <li>Station the attendant topside before the cover comes off.</li>
          <li>Remove the cover and allow the space to vent passively for 2–5 minutes.</li>
          <li>Lower the multi-gas monitor into the space before any person enters; read all four sensors (O₂, LEL, CO, H₂S).</li>
          <li>If readings are in the acceptable range: may enter. Keep the monitor running inside the space.</li>
          <li>If any reading is out of range: attach the forced-air blower, ventilate, re-test. Do not enter until in range.</li>
          <li>The attendant maintains line of sight or voice contact with the entrant at all times. The attendant does NOT enter the space for any reason unless relieved by another trained attendant.</li>
          <li>Guard the open manhole opening per 1910.268(o)(1) — cone/barrier setup around the perimeter.</li>
        </ol>

        <div className="mt-3 p-3 bg-slate-700/30 border border-slate-400/20 rounded-lg text-sm">
          <strong>Multi-employer worksites (29 CFR 1910.146(d)(11) + Appendix E):</strong> When crews from
          different employers (for example, a telecom contractor and a municipality's sewer crew)
          will be working in or near the same confined space, the host employer and the contractor
          MUST coordinate before entry begins — sharing hazard information, reviewing procedures,
          and agreeing on rescue responsibilities. One employer's atmospheric testing or rescue
          plan does not automatically cover another employer's workers. If your crew is the
          contractor on a host-employer site, confirm coordination is in place before anyone goes in.
        </div>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book (1910.268 and 1910.146):</strong> Atmospheric testing before every
            entry, attendant topside, ventilation if any combustible reading detected. These
            are non-negotiable regardless of how routine the job feels.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> Many OSP crews — especially experienced crews who
            have worked the same manhole routes for years — skip the gas monitor test because
            "we've never had a problem here." This is survivorship bias in action. Sewer gas
            accumulation depends on soil conditions, seasonal temperature, nearby pipe breaks,
            and adjacent utility activity that changes week to week. The manhole that was fine
            last Tuesday may have H₂S at 50 ppm today because a sewer main cracked two blocks
            away. The monitor takes 60 seconds to run. There is no legitimate reason to skip it.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Why Oxygen Displacement Is the Silent Killer</h2>
        <p>
          Hydrogen sulfide (H₂S) smells like rotten eggs at low concentrations — but that
          sense of smell is not a reliable warning. The NIOSH IDLH for H₂S is <strong>100 ppm</strong>:
          at or above 100 ppm you must exit immediately — no re-entry without supplied-air SCBA.
          At the IDLH (100 ppm), H₂S induces olfactory fatigue within minutes — workers
          lose the smell-warning signal precisely AT the immediate-danger threshold. Full olfactory
          nerve paralysis can occur at 150 ppm and above. Either way, smell-warning becomes
          unreliable at the immediate-danger threshold — a calibrated monitor is the only
          reliable detection. Your nose goes numb exactly when the danger is worst. You can be
          at 100+ ppm with no warning smell and no sensation of distress. At 300 ppm it causes pulmonary edema (fluid in the
          lungs) within minutes. At 500–1,000 ppm it causes rapid loss of consciousness —
          sometimes in one or two breaths. Workers who descend into an H₂S environment above
          IDLH don't feel dizzy and climb out. They fall. Rely on your monitor, not your nose.
        </p>
        <p className="mt-2">
          The same dynamic applies to oxygen displacement: carbon dioxide (CO₂) is heavier than
          air and accumulates at the BOTTOM of a manhole, while methane (natural gas, CH₄) is
          LIGHTER than air and accumulates at the TOP — near the ceiling. Nitrogen is near-neutral
          but can displace oxygen throughout the space. This is why testing at multiple heights
          matters: test low for CO₂ and H₂S, and test near the top of the entry for methane
          when a gas main is nearby. At 19.5% O₂, OSHA requires you to treat the atmosphere as
          oxygen-deficient — this is a regulatory safety buffer, not the point where you lose
          cognitive function. At 16% your body begins to struggle; below 10% loss of consciousness
          can occur within minutes. Unlike H₂S, low O₂ has no smell, no color, no taste. A
          multi-gas monitor is the only way to know it's there.
        </p>
        <div className="mt-3 p-3 bg-blue-900/20 border border-blue-400/30 rounded-lg text-sm">
          <strong>LEL sensor reliability note:</strong> Always check O₂ first. If O₂ reads below
          19.5%, your combustible gas (LEL) sensor may output a false-low or zero reading —
          catalytic bead sensors require oxygen to oxidize the target gas on the sensor bead.
          In an O₂-deficient space, a zero LEL reading is NOT a safe signal. Do not enter until
          O₂ is in the acceptable range AND LEL reads clean on a subsequent test.
        </div>
        <div className="mt-3 p-3 bg-amber-900/20 border border-amber-400/30 rounded-lg text-sm">
          <strong>H₂S and pellistor sensor inhibition:</strong> H₂S concentrations above 10 ppm
          can inhibit catalytic bead (pellistor) LEL sensors — typically reversibly at
          field-relevant concentrations. The H₂S is absorbed onto the catalyst surface, blocking
          reaction sites and producing an artificially low or false-zero LEL reading. At low-to-moderate
          H₂S concentrations, sensitivity typically recovers after the sensor is removed from the
          contaminated atmosphere and exposed to fresh air; at higher concentrations or prolonged
          exposure, recovery may be incomplete. Regardless of concentration: if a space had any
          H₂S event above 10 ppm, treat the LEL sensor as suspect. After any H₂S event, perform
          a bump test (expose the sensor to known-concentration calibration gas) or replace the
          sensor head before relying on LEL readings for re-entry. Consult your monitor
          manufacturer's guidance — inhibition behavior varies by sensor design and catalyst
          composition.
        </div>
        <div className="mt-3 p-3 bg-slate-700/30 border border-slate-400/20 rounded-lg text-sm">
          <strong>OSHA PEL vs. NIOSH IDLH — know the difference:</strong>
          <p className="mt-1 text-slate-300/90">
            OSHA Construction (29 CFR 1926.55) sets an H₂S PEL of <strong>10 ppm TWA</strong>.
            OSHA General Industry (29 CFR 1910.1000 Table Z-2) sets a <strong>20 ppm ceiling</strong>{' '}
            with a <strong>50 ppm 10-minute peak</strong> maximum. The NIOSH IDLH of 100 ppm used
            throughout this lesson is a separate threshold — the concentration at which an exposure
            becomes immediately dangerous to life or health, requiring immediate exit.
            The 1 ppm exit threshold on your H₂S sensor alarm is more conservative than all of
            the above: that alarm is set by your employer's safety program and is designed to
            keep you out of the space before you approach any regulatory limit.
          </p>
        </div>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: 29 CFR 1910.146(b) — Acceptable O₂ range definition; 29 CFR 1910.268(o)(2) —
          Atmospheric testing requirement; 29 CFR 1910.5(c)(1) — specific standard supersedes
          general standard; NIOSH IDLH documentation CAS 7783-06-4 (H₂S, revised 1994) — 100 ppm IDLH
          (cdc.gov/niosh/idlh/7783064.html); NIOSH Pocket Guide to Chemical Hazards, H₂S entry
          (cdc.gov/niosh/npg/npgd0337.html); 29 CFR 1926.55 — Construction H₂S PEL (10 ppm TWA);
          29 CFR 1910.1000 Table Z-2 — General Industry H₂S limits (20 ppm ceiling / 50 ppm peak).
        </p>
      </section>

      {/* ── ANNOTATED DIAGRAM ────────────────────────────────────────────── */}
      <AnnotatedDiagram
        title="Telecom Manhole Entry Setup"
        description="A correctly set-up telecom manhole entry per 29 CFR 1910.268(o). Click each labeled element to learn what it does and why it's required."
        src="/training/diagrams/manhole-entry-setup.svg"
        alt="Overhead and side-view diagram of a telecom manhole entry showing attendant position, gas monitor, forced-air blower, cone barrier, and ladder"
        aspectRatio={1.6}
        hotPoints={[
          {
            id: 'attendant',
            x: 15,
            y: 20,
            label: 'Attendant',
            type: 'click',
            explanation:
              'The topside person stationed outside the manhole during entry. Maintains line of sight or voice contact with the entrant, monitors the gas detector readout, and initiates rescue procedures if conditions change or communication is lost. The attendant does NOT enter the space.',
          },
          {
            id: 'monitor',
            x: 42,
            y: 38,
            label: 'Multi-gas monitor',
            type: 'click',
            explanation:
              'A 4-gas monitor measuring O₂ (%), LEL (%), CO (ppm), and H₂S (ppm). Lowered into the space before any worker enters. Left running inside the space during the entire work period. Required by 29 CFR 1910.268(o)(2). Must be calibrated per manufacturer schedule.',
          },
          {
            id: 'blower',
            x: 68,
            y: 20,
            label: 'Forced-air blower',
            type: 'click',
            explanation:
              'Continuous mechanical ventilation to maintain safe atmospheric conditions. Required whenever combustible gas is detected at any level per 1910.268(o)(2)(ii)(B). Placed to push fresh air in and move contaminated air out — not simply recirculate manhole air.',
          },
          {
            id: 'cones',
            x: 85,
            y: 50,
            label: 'Traffic barrier / cones',
            type: 'click',
            explanation:
              'A railing, cover-in-place alternate route, or cone/barrier setup around the manhole perimeter. Required by 29 CFR 1910.268(o)(1) to prevent pedestrians, vehicles, and other workers from falling into the open space.',
          },
          {
            id: 'ladder',
            x: 50,
            y: 72,
            label: 'Ladder',
            type: 'click',
            explanation:
              'Required for entry into manholes exceeding 4 feet in depth per 29 CFR 1910.268(h)(8). Must extend from the bottom of the space to at least 3 feet above the manhole rim to allow secure hand-over-hand exit.',
          },
        ]}
      />

      {/* ── BRANCHING SCENARIO ──────────────────────────────────────────── */}
      <BranchingScenario
        scenarioId="T18-L03-scenario-1"
        title="Gas-Monitor Response — ROW Adjacent to Gas Main"
        description="You are opening a telecom manhole on a rural ROW. A natural gas distribution main runs in the same ROW within 5 feet of the manhole. Walk through the entry decision process."
        startNodeId="start"
        nodes={{
          start: {
            id: 'start',
            prompt:
              'You remove the manhole cover. Before lowering your gas monitor, do you need to wait any time before testing?',
            choices: [
              {
                label: 'No — test immediately after lifting the cover',
                consequence:
                  'Testing immediately gives you the worst-case reading — the most accumulated gases before any passive ventilation. That\'s actually useful data. However, if the first reading is in range and you enter immediately, you may be entering before passive venting has cleared a gas pocket near the opening. Best practice: allow 2–5 minutes passive vent, then test.',
                nextId: 'step2-partial',
                isOptimal: false,
              },
              {
                label: 'Wait 2–5 minutes for passive venting, then lower the monitor into the space',
                consequence:
                  'Correct. Passive venting lets gases denser than air (CO₂ and H₂S, which settle to the bottom) and gases lighter than air (methane, which rises toward the top) begin to disperse. A 2–5 minute wait gives you a more representative reading of steady-state conditions throughout the work zone, not just the gases near the opening.',
                nextId: 'step2',
                isOptimal: true,
              },
            ],
          },
          'step2-partial': {
            id: 'step2-partial',
            prompt:
              'You test immediately. The monitor reads: O₂ = 20.8%, LEL = 0%, CO = 0, H₂S = 0. Can you enter?',
            choices: [
              {
                label: 'Yes — all readings are in acceptable range',
                consequence:
                  'The surface readings look clean, but testing immediately after opening the cover gives you the zone near the opening — not necessarily the gas concentrations at worker height inside the space. An immediate reading adjacent to a gas main may not represent actual conditions where you will be working. Best practice: even with clean immediate readings, wait 2–5 minutes and re-test, or run the blower before entering.',
                nextId: 'step3-enter',
                isOptimal: false,
              },
              {
                label: 'No — you should still ventilate first near a gas main',
                consequence:
                  'Conservative and defensible. Given the proximity to a gas distribution main, running the blower before entry is good practice even when initial readings are acceptable. The standard requires it only if combustibles are detected, but prudent crews in high-risk proximity run it anyway.',
                nextId: 'step3-enter',
                isOptimal: true,
              },
            ],
          },
          step2: {
            id: 'step2',
            prompt:
              'You lower the monitor into the space. After 3 minutes, the readings are: O₂ = 20.4%, LEL = 12%, CO = 3 ppm, H₂S = 0 ppm. What do you do?',
            choices: [
              {
                label: 'The O₂ is in range and the LEL is under 25%. It\'s probably fine — enter carefully',
                consequence:
                  '12% LEL is above the 10% LEL action threshold (per 1910.146 practice and ANSI/ASSE Z117.1 industry standard). 29 CFR 1910.268(o)(2)(ii)(B) requires continuous forced ventilation whenever combustibles are detected at any level — meaning ventilation is required even below 10% LEL if combustibles are present. Entering without ventilation running is an OSHA violation and a real hazard.',
                nextId: 'wrong-enter',
                isOptimal: false,
              },
              {
                label: 'Attach the forced-air blower, ventilate, re-test before entry',
                consequence:
                  'Correct per 29 CFR 1910.268(o)(2). A 12% LEL reading means combustible gas is present. You must ventilate and re-test until the LEL reads below 10% before entry. Ventilation must continue throughout the work period.',
                nextId: 'step3-vent',
                isOptimal: true,
              },
              {
                label: 'Do not enter at all — call the gas utility for a line locate',
                consequence:
                  'Prudent, and may be the right call depending on site conditions. If the LEL doesn\'t drop below 10% after 15 minutes of continuous ventilation, this is exactly what you should do. For a first-reading of 12%, start ventilation first, then escalate if it doesn\'t clear.',
                nextId: 'step3-vent',
                isOptimal: true,
              },
            ],
          },
          'wrong-enter': {
            id: 'wrong-enter',
            prompt:
              'You enter without the blower running. Inside the space, the LEL builds to 30% from gas seeping through a crack in the gas main. You\'ve inadvertently created an ignition risk with your electrical test equipment. You exit immediately, but it\'s a near-miss. This scenario ends here.',
            isEnd: true,
            endMessage: 'Any LEL reading above 10% requires forced ventilation and re-test before entry. Above 25% LEL = do not enter; call supervisor and gas utility.',
          },
          'step3-vent': {
            id: 'step3-vent',
            prompt:
              'You run the blower for 10 minutes. Re-test shows: O₂ = 20.7%, LEL = 2%, CO = 1 ppm, H₂S = 0 ppm. Can you enter now?',
            choices: [
              {
                label: 'Yes — LEL is below 10% and all other readings are in range. Enter with blower continuing to run.',
                consequence:
                  'Correct. Readings are now in the acceptable range. Continuous ventilation must continue for the duration of the work per 1910.268(o)(2). The monitor runs inside the space. The attendant stays topside.',
                nextId: 'step3-enter',
                isOptimal: true,
              },
              {
                label: 'No — the gas main is still there; we should call 811 and wait for a locate',
                consequence:
                  'The 811 call is a good idea before any excavation near utilities, but the gas main is an existing facility — you\'re not excavating here. With readings in range and continuous ventilation, entry is permissible under 1910.268(o). The monitor inside the space is your ongoing early warning.',
                nextId: 'step3-enter',
                isOptimal: true,
              },
            ],
          },
          'step3-enter': {
            id: 'step3-enter',
            prompt:
              'You enter the manhole with the monitor running and blower continuing. Midway through the job, the attendant topside reports the monitor alarm is sounding — CO has risen to 40 ppm. What do you do?',
            choices: [
              {
                label: 'Finish the connection you\'re working on — the CO will drop when you leave',
                consequence:
                  'Do not stay to finish work. 40 ppm CO is above the entry-safe level. With CO rising inside the space, the source is still active. Exiting immediately is the correct action.',
                nextId: 'wrong-stay',
                isOptimal: false,
              },
              {
                label: 'Exit the manhole immediately; do not re-enter until CO returns to below 25 ppm and the source is identified',
                consequence:
                  'Correct. The attendant\'s job is exactly this — to catch deteriorating conditions and communicate an exit order before the entrant is incapacitated. CO at 40 ppm and rising means the source is still producing; the space conditions are not stable. Exit, ventilate, identify the CO source (generator nearby? vehicle exhaust near the vent?), re-test.',
                nextId: 'end-clean',
                isOptimal: true,
              },
            ],
          },
          'wrong-stay': {
            id: 'wrong-stay',
            prompt:
              'You stay to finish. CO climbs to 80 ppm while you\'re still in the space. You begin experiencing headache and disorientation. Exiting under those conditions is harder and slower. This is how confined-space fatalities happen — you felt fine at first, then couldn\'t help yourself.',
            isEnd: true,
            endMessage: 'When the attendant signals a problem, exit immediately. CO impairs judgment faster than it impairs movement — you may not realize how affected you are until it\'s too late to exit under your own power.',
          },
          'end-clean': {
            id: 'end-clean',
            prompt:
              'You exit cleanly. Investigation reveals a generator two lots away was running upwind of the blower intake, sending exhaust into the forced-air stream. You reposition the blower intake, re-test, and re-enter once CO drops below 25 ppm. The job finishes safely.',
            isEnd: true,
            endMessage: 'The attendant-plus-monitor system worked as designed. The attendant stayed topside, monitored the readout, caught the CO spike, and communicated the exit order before the entrant was incapacitated. That\'s exactly how the system is supposed to work.',
          },
        }}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T18.L03 Check — Confined Space Entry"
        mode="multiple-choice"
        questions={[
          {
            id: 'T18-L03-Q1',
            type: 'mc',
            prompt:
              'Under OSHA rules, which standard governs atmospheric testing requirements before a telecom crew enters a routine manhole to splice fiber?',
            choices: [
              '29 CFR 1910.146 — Permit-Required Confined Spaces (full permit procedure required)',
              '29 CFR 1910.268(o) — Telecommunications (test, ventilate, attend; no written permit for routine entry)',
              '29 CFR 1910.147 — Control of Hazardous Energy (LOTO required before entry)',
              '29 CFR 1910.269 — Electric Power Generation (applies only near energized conductors)',
            ],
            answerIndex: 1,
            explanation:
              '29 CFR 1910.268(o) is the specific standard for telecom manhole work. Per 29 CFR 1910.5(c)(1), specific standards supersede general ones — when a specific standard (1910.268) covers a condition, it supersedes the more general standard (1910.146) for that condition. The 1910.146 full PRCS procedure applies only when conditions cannot be made safe under 1910.268(o) — e.g., chemical contamination that cannot be cleared by ventilation.',
            citation: '29 CFR 1910.268(o) (ecfr.gov; osha.gov); 29 CFR 1910.5(c)(1) — specific standard supersedes general standard (ecfr.gov).',
          },
          {
            id: 'T18-L03-Q2',
            type: 'mc',
            prompt:
              'A multi-gas monitor lowered into a telecom vault reads: O₂ = 20.1%, LEL = 18%, CO = 2 ppm, H₂S = 0 ppm. The acceptable O₂ range is 19.5%–23.5%. Which statement correctly describes what the crew must do?',
            choices: [
              'All readings are within acceptable ranges — proceed with entry',
              'O₂ is in range but LEL = 18% exceeds the 10% LEL action level; must ventilate and re-test before entry',
              'CO = 2 ppm exceeds the safe limit; ventilate and re-test before entry',
              'H₂S = 0 ppm means the space is completely safe to enter without ventilation',
            ],
            answerIndex: 1,
            explanation:
              '18% LEL means combustible gas is present at 18% of its explosive concentration. 29 CFR 1910.268(o)(2)(ii)(B) requires continuous forced ventilation whenever combustibles are detected — the standard requires ventilation when combustibles are "present" at any level. The 10% LEL figure is the industry action threshold from 29 CFR 1910.146 practice and ANSI/ASSE Z117.1: at or above 10% LEL, take immediate action (ventilate and re-test before entry). O₂ being in range does not override the combustible gas requirement.',
            citation: '29 CFR 1910.268(o)(2)(ii)(B) — Ventilation required when combustibles present (ecfr.gov); 29 CFR 1910.146 / ANSI/ASSE Z117.1 — 10% LEL action threshold (industry standard practice).',
          },
          {
            id: 'T18-L03-Q3',
            type: 'fill-in-blank',
            prompt:
              'An atmosphere with less than ____ percent oxygen by volume is classified as oxygen-deficient and unsafe for entry without supplied-air equipment.',
            answer: '19.5',
            answerDisplay: '19.5%',
            explanation:
              'Per 29 CFR 1910.146(b), an oxygen-deficient atmosphere is defined as below 19.5% O₂ by volume. Below 16% O₂, consciousness can be lost without warning. Normal air is approximately 20.9% O₂. The acceptable range for confined space entry is 19.5%–23.5%.',
            citation: '29 CFR 1910.146(b) — Definitions (ecfr.gov).',
          },
          {
            id: 'T18-L03-Q4',
            type: 'mc',
            prompt:
              'During manhole entry, the attendant\'s primary role is:',
            choices: [
              'Enter first to test conditions, then signal the entrant when it is safe',
              'Stand at the opening and hand tools down to the worker below',
              'Remain outside the space, monitor conditions and worker status, and initiate rescue procedures if needed',
              'Complete the OSHA permit paperwork while the entrant is working below',
            ],
            answerIndex: 2,
            explanation:
              'The attendant is a dedicated safety position — they remain topside, maintain continuous communication with the entrant, watch the monitor readout, and call for rescue if conditions change or communication is lost. The attendant does NOT enter the space for any reason unless another trained attendant relieves them. An attendant who leaves their post or enters the space defeats the entire protection system.',
            citation: '29 CFR 1910.268(o) — Manhole entry requirements; 29 CFR 1910.146(i) — Attendant duties.',
          },
        ]}
      />

    </LessonLayout>
  );
}
