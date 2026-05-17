// T11.L10 — Gel-Seal vs. Heat-Shrink vs. Re-enterable
// Working lesson: sealing system selection, re-entry procedure, moisture ingress failure modes
// Source: net-new (R-A gap per ARCH.md) + BranchingScenario

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T11.L10',
  course_id: 'T11',
  title: 'Gel-Seal vs. Heat-Shrink vs. Re-enterable',
  order: 10,
  lesson_type: 'working',
  prerequisites: ['T11.L09'],
  learning_objectives: [
    'Match each sealing system to its correct application environment',
    'Describe the step-by-step procedure for re-entering a heat-shrink sealed case',
    'Explain the single biggest field mistake when re-entering a heat-shrink sealed case',
    'Apply the sealing system selection framework to three different re-entry scenarios',
  ],
  estimated_minutes: 20,
  vocabulary_introduced: [
    'flooding compound (FP-1/FP-2)',
    'heat-shrink port seal',
    're-enterable cold-seal',
    'oversheath heat-shrink tube',
    'gel displacement during re-entry',
    'sealing compound compatibility',
  ],
  key_terms: [
    {
      term: 'flooding compound (FP-1/FP-2)',
      definition:
        'A water-blocking compound used to flood the interior of a gel-sealed splice case. BICSI OSP Design Reference Manual classifies flooding compounds by type: FP-1 (petroleum-based, petroleum-jelly consistency — common in older installations) and FP-2 (synthetic polymer gel — more compatible with modern cable jacket materials). The compound fills all air voids in the case interior, preventing water migration along cable interstices. FP-1 is incompatible with some modern polyethylene jacket compounds — check cable manufacturer compatibility before selecting.',
    },
    {
      term: 'heat-shrink port seal',
      definition:
        'A tubular heat-shrink sleeve applied over the cable entry port of a splice case after the cable is routed in. A heat gun shrinks the sleeve to the cable jacket diameter, and hot-melt adhesive bonds the sleeve to both the cable jacket and the splice case port body. Permanent — re-entry requires cutting the sleeve back past the adhesive bond and installing a new heat-shrink sleeve. The standard sealing method for buried dome closures on long-term no-reentry installations.',
    },
    {
      term: 're-enterable cold-seal',
      definition:
        'A cable port sealing mechanism that can be opened and re-sealed without cutting the cable or destroying the sealing element. Common types: compression grommet (a rubber grommet that clamps around the cable jacket when the port fitting is tightened) and re-sealable gel block (a split polymer block that seals around the cable). Used when the case will be opened periodically for fiber adds, circuit reconfiguration, or inspection.',
    },
    {
      term: 'oversheath heat-shrink tube',
      definition:
        'A large-diameter heat-shrink tube (larger than the individual port sleeves) that is applied over the entire dome closure or splice case body to provide a secondary moisture barrier over the case seam. Permanent — removing the oversheath requires cutting it longitudinally, which destroys it. A new oversheath must be installed after any re-entry.',
    },
    {
      term: 'gel displacement during re-entry',
      definition:
        'When a gel-sealed dome case is opened, the flooding compound inside can flow and displace as the dome is lifted, potentially pulling the cable jacket away from the entry port seal or contaminating the splice tray area with gel. Proper re-entry procedure includes: laying the dome on its side (not upside-down) when opened, not allowing gel to flow over the splice trays, and using dry lint-free wipes to contain any gel displacement.',
    },
    {
      term: 'sealing compound compatibility',
      definition:
        'The chemical compatibility between the flooding compound inside the splice case and the cable jacket material. Petroleum-based FP-1 compounds can swell, crack, or degrade polyethylene or polypropylene cable jackets over time. Synthetic FP-2 gel compounds are compatible with most modern jacket materials. Always check the cable manufacturer\'s chemical compatibility data before selecting or substituting a flooding compound.',
    },
  ],
  vocabulary_assumed: [
    { term: 'dome closure', source_lesson_id: 'T11.L09' },
    { term: 'butt-splice (inline/horizontal) closure', source_lesson_id: 'T11.L09' },
    { term: 'heat-shrink vs. cold-seal entry port', source_lesson_id: 'T11.L09' },
    { term: 'case re-entry', source_lesson_id: 'T11.L09' },
    { term: 'cable jacket types', source_lesson_id: 'T03.L01' },
    { term: 'gel-filled', source_lesson_id: 'T03.L01' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T11L10_GelSealHeatShrinkReenterable() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ──────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Once you've selected the right splice case (L09), you need to choose the right
          sealing system to close it. The sealing system is what keeps moisture out for
          the life of the installation. The right choice depends on one key question:
          will this case ever need to be opened again?
        </p>
        <p className="mt-2">
          If the answer is "never": heat-shrink and gel-fill the case permanently. If the
          answer is "occasionally": use a re-enterable cold-seal system. If you pick the
          wrong one, re-entry causes moisture ingress — which is one of the most common
          failure modes in buried OSP infrastructure.
        </p>

        {/* Flashcards */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Key Terms</h3>
          <Flashcard
            deckId="T11-L10"
            cards={[
              {
                id: 'T11-L10-fc-fplooding',
                front: 'What is flooding compound (FP-1 vs. FP-2) and why does compatibility matter?',
                back: 'FP-1 = petroleum-based gel (petroleum-jelly consistency). FP-2 = synthetic polymer gel. FP-1 can swell or degrade modern polyethylene cable jackets over time (compatibility issue). FP-2 is compatible with most modern jacket materials. Always check cable manufacturer compatibility before selecting. BICSI OSP Design Reference Manual classifies both types.',
              },
              {
                id: 'T11-L10-fc-heatshrink',
                front: 'What is a heat-shrink port seal and when is it the correct choice?',
                back: 'A heat-shrink sleeve with hot-melt adhesive applied over the cable entry port. Permanent — re-entry requires cutting the sleeve. Correct for: long-term no-reentry buried dome installations, any case that will not be opened after commissioning. Wrong for: cases expected to be opened for future adds or repairs.',
              },
              {
                id: 'T11-L10-fc-reenterable',
                front: 'What is a re-enterable cold-seal and when should it be used?',
                back: 'A cable port sealing mechanism that can be opened and re-sealed without destroying the sealing element: compression grommet or re-sealable gel block. Use when: case will be opened periodically for fiber adds, circuit changes, or inspection. More expensive than heat-shrink seals but saves rework cost on frequent-reentry cases.',
              },
              {
                id: 'T11-L10-fc-reentry-mistake',
                front: 'What is the single biggest field mistake when re-entering a heat-shrink sealed case?',
                back: 'Slitting the heat-shrink oversheath longitudinally and trying to "reuse" it. The re-compressed sleeve does not seal reliably after being cut. Moisture ingress at the opened joint often migrates along the cable into the splice tray over the following wet season. Correct procedure: cut the oversheath back to factory-clean cable jacket, clean the jacket surface, install a NEW oversheath.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── WORKING ──────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Sealing System Selection</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Sealing system</th>
                <th className="px-3 py-2 text-left">Best for</th>
                <th className="px-3 py-2 text-left">Re-enterable?</th>
                <th className="px-3 py-2 text-left">Re-entry cost/complexity</th>
                <th className="px-3 py-2 text-left">Failure if used wrong</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold text-green-400">Gel-filled dome + heat-shrink ports</td>
                <td className="px-3 py-2">Permanent buried joints, high-reliability no-reentry</td>
                <td className="px-3 py-2 text-red-400">No — destructive to re-enter</td>
                <td className="px-3 py-2">High — cut oversheath, clean jacket, install new oversheath + port seals</td>
                <td className="px-3 py-2">Moisture ingress if heat-shrink is cut and reused (most common)</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold text-blue-400">Re-enterable cold-seal ports (compression grommet)</td>
                <td className="px-3 py-2">Cases expected to be opened for adds/repairs</td>
                <td className="px-3 py-2 text-green-400">Yes — release fitting, open case, re-tighten</td>
                <td className="px-3 py-2">Low — release fitting, re-seat, re-tighten to specified torque</td>
                <td className="px-3 py-2">O-ring wear over many cycles; inspect and replace grommet when compression feel degrades</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold text-yellow-400">Aerial inline case (no gel fill)</td>
                <td className="px-3 py-2">Aerial — no ground pressure; moisture less critical</td>
                <td className="px-3 py-2 text-green-400">Yes — longitudinal split, no sealing compound</td>
                <td className="px-3 py-2">Low for aerial; unacceptable for buried</td>
                <td className="px-3 py-2">If used buried: water ingress at port O-rings within 18–36 months</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 font-semibold">Heat-Shrink Re-Entry — Step-by-Step Procedure</h3>
        <p>
          When you must re-enter a heat-shrink sealed dome case (e.g., to add fibers or
          repair a damaged splice tray), the correct procedure is non-negotiable:
        </p>
        <div className="mt-3 space-y-2">
          {[
            { step: '1', text: 'Excavate and expose the case. Clean dirt off the outside of the case.' },
            { step: '2', text: 'Cut the oversheath heat-shrink tube at a point 3–5 cm PAST the adhesive bond on each end. Peel the cut oversheath off the case body. Discard — do not reuse.' },
            { step: '3', text: 'Cut the individual port heat-shrink sleeves at each cable entry. Cut flush with the case port body. Do not nick the cable jacket.' },
            { step: '4', text: 'Open the dome by lifting it straight off the base. Lay the dome on its side to prevent gel displacement into the work area.' },
            { step: '5', text: 'Dry-wipe gel from the cable jackets at the entry ports. Use lint-free wipes only — no paper towels (fiber contamination).' },
            { step: '6', text: 'Perform your work: add splice trays, repair damaged splices, reroute buffer tubes.' },
            { step: '7', text: 'Inspect the gel fill level. If gel was significantly displaced during handling, add FP-2 compatible flooding compound before closing.' },
            { step: '8', text: 'Reseat the dome. Install NEW heat-shrink port sleeves at every cable entry. Apply heat until adhesive flows from both ends.' },
            { step: '9', text: 'Install a NEW oversheath heat-shrink tube over the full case body. Apply heat from center outward.' },
            { step: '10', text: 'Allow full cooling before handling or burying. The oversheath must be fully set.' },
          ].map(({ step, text }) => (
            <div key={step} className="flex gap-3 p-2 bg-slate-800/40 border border-slate-600/30 rounded">
              <span className="text-slate-500 text-sm font-mono w-6 flex-shrink-0">{step}.</span>
              <p className="text-slate-300 text-sm">{text}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 p-3 bg-red-900/30 border border-red-500/40 rounded-lg text-red-200 text-sm">
          <strong>⚠ Never reuse a cut heat-shrink sleeve or oversheath.</strong> Once cut, the
          adhesive bond is broken and the geometry of the sleeve is compromised. A sleeve that
          appears to have re-sealed after being slit open will fail at the first thermal cycle.
          Replacement cost for heat-shrink materials: nominal. Failure cost: full excavation
          and re-splice.
        </p>

        {/* BranchingScenario */}
        <div className="mt-6">
          <BranchingScenario
            id="T11-L10-branch-reentry"
            title="Splice Case Re-entry Decision"
            description="You receive a work order to add 12 new fibers to an existing buried dome closure that was installed 18 months ago. Walk through the re-entry decision."
            initialState="assess_seal"
            states={{
              assess_seal: {
                prompt: 'You arrive at the site and uncover the dome closure. What type of port seals does it have?',
                choices: [
                  { label: 'Heat-shrink port seals with oversheath heat-shrink tube', next: 'heatshrink_reentry' },
                  { label: 'Cold-seal compression grommet fittings', next: 'coldseal_reentry' },
                  { label: 'Self-sealing gel dome with no port seals visible', next: 'gel_dome_only' },
                ],
              },
              heatshrink_reentry: {
                prompt: 'Heat-shrink sealed case. The crew lead suggests slitting the oversheath longitudinally to save time on purchasing new seals. What do you do?',
                choices: [
                  { label: 'Agree — a slit oversheath can be re-sealed with self-amalgamating tape', next: 'wrong_heatshrink' },
                  { label: 'Decline — cut the oversheath past the adhesive bond, perform the work, install new port seals and a new oversheath', next: 'correct_heatshrink' },
                ],
              },
              wrong_heatshrink: {
                prompt: '❌ INCORRECT. Slitting the oversheath and applying self-amalgamating tape is the failure mode documented in T11 Brief §7 F9 — the tape seal failed within one rain season, causing water staining at the case entry port and progressive OTDR loss increase across all fibers. The slit oversheath does not seal reliably under thermal cycling. Return to site and apply the correct procedure.',
                choices: [{ label: 'Try again', next: 'assess_seal' }],
              },
              correct_heatshrink: {
                prompt: '✅ CORRECT. You cut the oversheath back to clean cable jacket, perform the fiber add work, install new individual port heat-shrink sleeves with heat, then install a new oversheath heat-shrink tube. Allow full cooling. The case is properly re-sealed. Document the re-entry date and materials used in the splice record.',
                choices: [{ label: 'Start over', next: 'assess_seal' }],
              },
              coldseal_reentry: {
                prompt: '✅ CORRECT INSTALLATION DESIGN. Cold-seal compression grommets allow re-entry without destructive cutting. You release the compression fittings, open the dome, add the new splice trays, re-route the buffer tubes, close the dome, and re-tighten the compression fittings to the manufacturer\'s specified torque. No new sealing materials needed (inspect grommet condition first — replace if worn). Document the re-entry.',
                choices: [{ label: 'Start over', next: 'assess_seal' }],
              },
              gel_dome_only: {
                prompt: 'A dome with gel at the base but no visible port seals may have gel-filled port grommets that are flush with the base — common in some dome designs. Check the manufacturer\'s data sheet for the installed case model. The correct re-entry procedure for gel-filled ports: treat as heat-shrink sealed (destructive re-entry, install new port seals), because the gel-filled grommet is a single-use sealing element. When in doubt: contact the manufacturer before opening.',
                choices: [{ label: 'Start over', next: 'assess_seal' }],
              },
            }}
          />
        </div>

        {/* Quiz */}
        <div className="mt-6">
          <Quiz
            id="T11-L10-quiz-1"
            questions={[
              {
                id: 'q1',
                type: 'multiple-choice',
                text: 'A buried dome closure needs to be opened to repair a damaged splice tray. After opening, the crew notices gel displacement inside the case — about 30% of the gel has shifted from the cable entry side to the tray area. What should they do before re-sealing the case?',
                options: [
                  { id: 'a', text: 'Clean the displaced gel from the tray area and re-close — the case is designed to work without full gel fill' },
                  { id: 'b', text: 'Add FP-2 compatible flooding compound to replace the displaced volume before closing, to restore the full gel fill that prevents moisture migration' },
                  { id: 'c', text: 'Do not add gel — additional gel adds pressure on the cable jackets and may cause jacket damage' },
                  { id: 'd', text: 'Replace the entire dome case — partial gel fill means the case is no longer usable' },
                ],
                correctId: 'b',
                explanation: 'The flooding compound serves a critical function: it fills all air voids inside the case, preventing moisture from migrating along cable interstices (the spaces between individual fiber buffer tubes). If 30% of the gel has displaced, 30% of the case interior has air voids that can accumulate moisture during future thermal cycles (warm, humid air enters; cool air causes condensation). Before re-closing, add FP-2 compatible flooding compound to restore full fill coverage. Verify FP-2 compatibility with the installed cable jacket type before adding.',
              },
              {
                id: 'q2',
                type: 'multiple-choice',
                text: 'A project manager specifies a dome closure with re-enterable cold-seal port fittings for a buried handhole joint on a network that will add subscribers annually over 5 years. Is this a good specification?',
                options: [
                  { id: 'a', text: 'No — buried applications always require heat-shrink port seals, regardless of re-entry frequency' },
                  { id: 'b', text: 'Yes — re-enterable cold-seal fittings allow annual fiber adds without destructive re-sealing, which is correct for a growing network over 5 years' },
                  { id: 'c', text: 'Yes — but only if the handhole is in an area with low groundwater' },
                  { id: 'd', text: 'No — cold-seal fittings are only rated for above-ground pedestal applications' },
                ],
                correctId: 'b',
                explanation: 'The project manager made the correct specification. If the case will be re-entered annually for subscriber adds, heat-shrink port seals would be destroyed and replaced each year — adding material cost and labor, and increasing the risk of improper re-sealing by crews that aren\'t trained in the full heat-shrink re-entry procedure. Re-enterable cold-seal compression grommets (properly specified for buried/submersible rating) can handle annual re-entry with correct torque re-application. Verify the specific cold-seal fitting is rated for the installation depth and temperature range.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── ADVANCED ──────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Flooding Compound Compatibility — A Hidden Failure Mode</h2>
        <p>
          FP-1 petroleum-based flooding compound has been in use since the 1980s and is still
          found in millions of splice cases. It was designed for the polyethylene cable jackets
          of that era, which were petroleum-compatible. Modern high-density polyethylene (HDPE)
          and low-smoke zero-halogen (LSZH) cable jackets have different chemical compatibility
          profiles.
        </p>
        <p className="mt-2">
          Adding FP-1 compound to a case with modern HDPE-jacketed cable can cause:
          (1) jacket surface softening or "bloom" (white crystalline deposits) where the
          petroleum compound migrates through the jacket wall, (2) long-term jacket embrittlement
          at the compound contact zone, and (3) loss of jacket-to-port-seal adhesion on heat-shrink
          sleeves that were bonded to a petroleum-exposed jacket surface.
        </p>
        <p className="mt-2 p-3 bg-amber-900/30 border border-amber-500/40 rounded-lg text-amber-200 text-sm">
          <strong>Standing rule:</strong> When adding flooding compound to any case, check the
          cable manufacturer's compatibility data sheet before adding. When in doubt: use FP-2
          synthetic gel, which is compatible with all modern cable jacket materials including
          HDPE, LLDPE, and LSZH. Never assume "any gel will work."
        </p>
      </section>

    </LessonLayout>
  );
}
