// Net-new — T18.L08 Hazardous Materials on an OSP Job
// Working lesson: SDS deep dive, fill gel, HDPE fumes, silica dust, battery acid, GHS

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import ReferencesBlock from '../../components/ReferencesBlock.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import GatedAssessment from '../../components/primitives/GatedAssessment.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T18.L08',
  course_id: 'T18',
  title: 'Hazardous Materials on an OSP Job',
  order: 8,
  lesson_type: 'working',
  prerequisites: ['T18.L01'],
  vocabulary_introduced: [
    'PEL',
    'TLV',
    'GHS',
  ],
  key_terms: [
    {
      term: 'PEL',
      definition:
        'Permissible Exposure Limit — the legally enforceable maximum airborne concentration of a chemical substance set by OSHA. Published in 29 CFR 1910.1000 Table Z-1 or substance-specific standards. Typically an 8-hour time-weighted average (TWA) unless noted. Violating a PEL is an OSHA citation.',
    },
    {
      term: 'TLV',
      definition:
        'Threshold Limit Value — a recommended (not legally binding) occupational exposure limit published by the American Conference of Governmental Industrial Hygienists (ACGIH). Often more conservative than OSHA PELs. Used as a best-practice benchmark on job sites even where the OSHA PEL is the legal floor.',
    },
    {
      term: 'GHS',
      definition:
        'Globally Harmonized System — the international standard for classifying and labeling hazardous chemicals. OSHA adopted GHS under HazCom 2012 (29 CFR 1910.1200), which is why modern SDS documents use a standardized 16-section format with pictograms. Any chemical sold in the U.S. after 2015 should have a GHS-format SDS.',
    },
  ],
  vocabulary_assumed: [
    { term: 'SDS', source_lesson_id: 'T18.L01' },
    { term: 'hazard recognition', source_lesson_id: 'T18.L01' },
    { term: 'hierarchy of controls', source_lesson_id: 'T18.L01' },
  ],
  learning_objectives: [
    'Read an OSHA-compliant SDS (16-section GHS format) and extract hazard information, control measures, and emergency response steps for a chemical used on an OSP job',
    'Distinguish between OSHA PELs (legally enforceable 8-hr TWA limits) and ACGIH TLVs (recommended best-practice limits) and explain why TLVs are often more conservative',
    'Identify common OSP hazardous materials (splice-case fill gel HDPE fumes, silica dust from pole treatment, battery acid from backup power pedestals, diesel fuel from generators) and describe engineering controls that reduce exposure',
    'Calculate exposure risk when a material with a known PEL or TLV is used in an open work area, and recommend ventilation, PPE, or substitution strategies to control airborne concentration below the limit',
  ],
  estimated_minutes: 20,
};

export default function T18L08_HazardousMaterialsOSP() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Most chemicals on an OSP job don't feel dangerous — the gel on your hands, the primer
          you're brushing on conduit fittings, the dust from the concrete saw cutting the
          sidewalk. None of them will hurt you today. But the same chemicals handled without
          protection over a career of daily exposure lead to real chronic health problems —
          skin conditions, respiratory disease, and worse.
        </p>
        <p className="mt-2">
          OSHA requires employers to maintain a Safety Data Sheet (SDS) for every hazardous
          chemical on the job site. The SDS tells you exactly what you're dealing with and what
          protects you. This lesson covers the chemicals you actually encounter on an OSP job —
          not a theoretical list — and how to read the SDS sections that matter in the field.
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
              <td className="px-3 py-2 font-mono">SDS</td>
              <td className="px-3 py-2">Safety Data Sheet</td>
              <td className="px-3 py-2">The document for every hazardous chemical — composition, exposure limits, PPE, first aid</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">GHS</td>
              <td className="px-3 py-2">Globally Harmonized System</td>
              <td className="px-3 py-2">The international standard that standardized the 16-section SDS format and hazard pictograms</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">PEL</td>
              <td className="px-3 py-2">Permissible Exposure Limit</td>
              <td className="px-3 py-2">OSHA's legal maximum airborne concentration — violation is a citation; 8-hr TWA unless noted</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">TLV</td>
              <td className="px-3 py-2">Threshold Limit Value</td>
              <td className="px-3 py-2">ACGIH's recommended (non-binding) limit — often stricter than PEL; use as best-practice target</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">TWA</td>
              <td className="px-3 py-2">Time-Weighted Average</td>
              <td className="px-3 py-2">Exposure averaged over an 8-hour shift — the basis for most PEL and TLV values</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The GHS SDS — 16 Sections, 4 You Need Cold</h3>
        <p className="mt-2">
          Under OSHA HazCom 2012 (29 CFR 1910.1200), every SDS in the U.S. follows the
          GHS 16-section format. You don't need to read all 16 sections for every product —
          but you need to know where to find the four sections that matter in a field emergency
          or routine exposure situation:
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Section #</th>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">When you need it</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10 bg-sky-400/5">
                <td className="px-3 py-2 font-mono font-bold">4</td>
                <td className="px-3 py-2 font-semibold">First-Aid Measures</td>
                <td className="px-3 py-2">Exposure occurred — skin contact, eye splash, inhalation, ingestion. What to do in the next 5 minutes.</td>
              </tr>
              <tr className="border-t border-white/10 bg-sky-400/5">
                <td className="px-3 py-2 font-mono font-bold">8</td>
                <td className="px-3 py-2 font-semibold">Exposure Controls / PPE</td>
                <td className="px-3 py-2">What gloves, respirator, eye protection to wear when working with this chemical.</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-mono">11</td>
                <td className="px-3 py-2">Toxicological Information</td>
                <td className="px-3 py-2">Short-term and long-term health effects — useful for understanding chronic exposure risk.</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-mono">2</td>
                <td className="px-3 py-2">Hazard Identification</td>
                <td className="px-3 py-2">GHS hazard categories and pictograms — gives you the hazard class at a glance before you read further.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── FLASHCARDS ──────────────────────────────────────────────────── */}
        <Flashcard
          deckId="T18-L08"
          cards={[
            {
              id: 'T18-L08-fc-ghs',
              front: 'What is the GHS and why does it matter for SDS documents?',
              back: 'Globally Harmonized System — the international standard for classifying and labeling hazardous chemicals. OSHA adopted it under HazCom 2012 (29 CFR 1910.1200). Result: all U.S. SDS documents now use a standardized 16-section format with consistent hazard pictograms, so workers can find the same information in the same place regardless of manufacturer.',
            },
            {
              id: 'T18-L08-fc-pel',
              front: 'What is a Permissible Exposure Limit (PEL)?',
              back: 'The legally enforceable maximum airborne concentration of a chemical, set by OSHA in 29 CFR 1910.1000 Table Z-1 or substance-specific standards. Typically an 8-hour TWA. Exceeding a PEL is an OSHA violation. Example: crystalline silica PEL = 50 µg/m³ TWA per 29 CFR 1910.1053.',
            },
            {
              id: 'T18-L08-fc-tlv',
              front: 'What is a TLV and how does it differ from a PEL?',
              back: 'Threshold Limit Value — ACGIH\'s recommended occupational exposure limit. Unlike the PEL, it is not legally binding. TLVs are often more conservative (lower/stricter) than OSHA PELs. Used as a best-practice target on job sites where the employer wants to exceed OSHA\'s legal minimum.',
            },
            {
              id: 'T18-L08-fc-sds-sec8',
              front: 'Which SDS section tells you what PPE to wear when handling a chemical?',
              back: 'Section 8 — Exposure Controls / PPE. This section lists engineering controls (ventilation requirements), exposure limits (PEL, TLV), and specific PPE: glove type and thickness, respirator type, eye/face protection, and body protection requirements.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The Chemicals You Actually Encounter on an OSP Job</h2>

        <div className="border-l-4 border-blue-400/30 bg-blue-400/5 p-3 my-3 text-sm">
          <p className="font-semibold text-blue-300 mb-1">Refresher</p>
          <ul className="text-slate-300/90 space-y-1 list-disc pl-5">
            <li><strong>SDS:</strong> Safety Data Sheet — the reference document for chemical exposure limits and first-aid info</li>
            <li><strong>Hazard recognition:</strong> identifying dangers before they cause harm</li>
            <li><strong>Hierarchy of controls:</strong> the order of hazard management: elimination first, PPE last</li>
          </ul>
        </div>

        <p>
          Here are the five chemical hazards most commonly encountered on OSP fiber installations,
          with the key exposure info and what protects you:
        </p>

        <div className="mt-4 space-y-4">

          <div className="p-4 border border-white/10 rounded-lg">
            <p className="font-semibold text-slate-200">1. Fiber Optic Filling Gel (Thixotropic Flooding Compound)</p>
            <p className="text-sm text-slate-300/90 mt-1">
              <strong>What it is:</strong> The semi-solid gel (usually mineral oil or polybutene-based)
              packed inside loose-tube fiber cables to protect against water ingress.
              You encounter it every time you prep a cable end for splicing.
            </p>
            <p className="text-sm text-slate-300/90 mt-1">
              <strong>Hazard:</strong> Skin irritation and dermatitis from repeated daily contact.
              Not acutely toxic; no significant inhalation hazard at room temperature. Long-term
              repeated skin contact without cleaning = chronic skin damage.
            </p>
            <p className="text-sm text-slate-300/90 mt-1">
              <strong>Protection (SDS Section 8):</strong> Nitrile or latex gloves when prepping
              cable ends. Clean gel off skin promptly with manufacturer-approved cleaner —
              mineral oil absorbs through cracked skin. Do not use gasoline or acetone to clean
              gel (adds a solvent exposure hazard on top of the gel).
            </p>
          </div>

          <div className="p-4 border border-white/10 rounded-lg">
            <p className="font-semibold text-slate-200">2. HDPE Conduit / Polyethylene Fumes (Heat Fusion, Cutting)</p>
            <p className="text-sm text-slate-300/90 mt-1">
              <strong>What it is:</strong> High-density polyethylene (HDPE) conduit is the
              standard underground OSP conduit. Heat fusion joining (butt welding) and saw
              cutting of HDPE releases decomposition products.
            </p>
            <p className="text-sm text-slate-300/90 mt-1">
              <strong>Hazard:</strong> Polyethylene combustion/decomposition releases hydrocarbons
              and carbon monoxide at elevated temperatures. Fumes can cause respiratory irritation.
              Not classified as a known carcinogen at normal processing temperatures, but adequate
              ventilation is required for fusion operations.
            </p>
            <p className="text-sm text-slate-300/90 mt-1">
              <strong>Protection (SDS Section 8):</strong> Adequate ventilation — outdoors or
              forced-air ventilation for enclosed fusion operations. Safety glasses (hot plastic
              spatter). Heat-resistant gloves during fusion work. If working in a confined vault
              with heat fusion, the confined space atmospheric monitoring requirements also apply:
              CO buildup from HDPE fumes in a poorly ventilated vault can approach hazardous
              concentrations. <em>See the Confined Space Entry — Manholes &amp; Vaults lesson for full
              atmospheric monitoring procedures and IDLH thresholds — the forced-air blower requirement
              and atmospheric testing protocol for manhole entry apply simultaneously with any
              heat fusion or cutting work in an enclosed vault.</em>
            </p>
          </div>

          <div className="p-4 border border-red-400/20 border-l-4 border-l-red-400 rounded-lg">
            <p className="font-semibold text-red-300">3. Crystalline Silica Dust (Concrete / Asphalt Cutting)</p>
            <p className="text-sm text-slate-300/90 mt-1">
              <strong>What it is:</strong> When you saw-cut a concrete sidewalk or asphalt pavement
              to trench for conduit, the cutting generates respirable crystalline silica dust.
              Silica is the hazardous component of concrete — the cement mix itself is also dusty
              but the crystalline silica fraction is the regulated concern.
            </p>
            <p className="text-sm text-slate-300/90 mt-1">
              <strong>Hazard:</strong> Serious. Chronic inhalation of crystalline silica causes
              silicosis — irreversible scarring of the lungs — and is a known lung carcinogen.
              The damage is cumulative and latent; symptoms appear years after exposure.
            </p>
            <p className="text-sm text-slate-300/90 mt-1">
              <strong>OSHA PEL:</strong> 50 µg/m³ TWA (8-hour time-weighted average) per
              29 CFR 1910.1053 — the 2016 silica standard. This is the legal limit; many
              industrial hygienists recommend staying at or below the TLV of 25 µg/m³.
            </p>
            <p className="text-sm text-slate-300/90 mt-1">
              <strong>Protection (SDS Section 8):</strong> Wet-cutting (water applied to the
              blade to suppress dust) is the primary engineering control. If wet-cutting is not
              possible, a vacuum dust-collection system on the saw. An N95 respirator (minimum)
              if engineering controls alone cannot maintain exposure below the PEL; a half-face
              respirator with P100 filters for higher-exposure cutting operations. Safety glasses.
            </p>
          </div>

          <div className="p-4 border border-white/10 rounded-lg">
            <p className="font-semibold text-slate-200">4. Lead-Acid Battery Electrolyte (Fiber Hut Battery Banks)</p>
            <p className="text-sm text-slate-300/90 mt-1">
              <strong>What it is:</strong> Large lead-acid battery backup systems in fiber
              equipment huts contain sulfuric acid electrolyte. You may encounter these when
              doing LOTO work near powered equipment or cleaning/servicing the battery room.
            </p>
            <p className="text-sm text-slate-300/90 mt-1">
              <strong>Hazard:</strong> Sulfuric acid is a strong acid — skin and eye contact
              causes severe burns. Battery gas (hydrogen) released during charging is flammable.
              OSHA PEL for sulfuric acid: 1 mg/m³ per 29 CFR 1910.1000 Table Z-1.
            </p>
            <p className="text-sm text-slate-300/90 mt-1">
              <strong>Protection (SDS Section 8):</strong> Chemical splash goggles (not just
              safety glasses) near open battery cells. Acid-resistant gloves (neoprene or
              nitrile). No open flames or sparks in battery rooms (hydrogen explosion risk).
              Eye wash station required within 10 seconds travel time of battery work area
              per OSHA 29 CFR 1910.151(c).
            </p>
          </div>

        </div>

        <div className="mt-5 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — SDS Availability</p>
          <p className="text-slate-300/90">
            <strong>Book (1910.1200):</strong> Employers must maintain SDS files accessible
            to all employees for every hazardous chemical on the job site. Workers must be
            trained to understand and use SDS documents.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> Most OSP crews never look at an SDS for filling gel
            or conduit materials. The chemicals encountered daily have low acute hazard, and the
            SDS awareness requirement feels like paperwork. The practical issue is the rare
            acute situation — a battery spill at a hut, sewer gas in a contaminated vault, or
            a concrete saw kicking up visible dust on a calm day. Know where the SDSs are on
            your truck (most companies keep a physical SDS binder plus a digital copy), and
            know which four sections to read first. When an incident happens is not the time to
            learn how to read an SDS.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>PEL vs. TLV — Why Both Numbers Matter</h2>
        <p>
          OSHA PELs are legal limits — violating them triggers citations and fines. Many OSHA
          PELs have not been updated since the 1970s and are now considered insufficiently
          protective by occupational health standards. The ACGIH TLVs are typically based on
          more recent toxicological research and are often 2–4× stricter than OSHA PELs for
          the same substance.
        </p>
        <p className="mt-2">
          For field workers: the OSHA PEL is the legal floor, not the safe ceiling. Operating
          at the OSHA PEL for certain substances (particularly silica and some solvents) does
          not mean you have zero health risk — it means you're within the legal limit set
          decades ago. Employers that target the TLV for high-chronic-exposure substances
          provide a meaningfully better health outcome for their crews. This is standard
          practice in responsible industrial hygiene programs.
        </p>
      </section>

      <ReferencesBlock
        items={[
          { citation: '29 CFR 1910.1200', note: 'OSHA HazCom 2012 — GHS-format SDS requirement, 16-section structure.' },
          { citation: '29 CFR 1910.1053', note: 'Crystalline silica standard — current PEL of 50 µg/m³ TWA (not the pre-2016 value of 100 µg/m³).' },
          { citation: '29 CFR 1910.1000 Table Z-1', note: 'OSHA PELs for air contaminants, including sulfuric acid (1 mg/m³).' },
          { citation: '29 CFR 1910.151(c)', note: 'Emergency eyewash/shower — required within 10 seconds travel time of a battery work area.' },
          { citation: 'ACGIH Threshold Limit Values (TLV booklet)', note: 'Recommended, non-binding exposure limits — often more conservative than OSHA PELs; used as a best-practice benchmark.' },
        ]}
      />

      {/* ── MCQ — SDS required or not? ────────────────────────────────────── */}
      <Quiz
        title="Does This Require an SDS on Your Job Site?"
        mode="multiple-choice"
        questions={[
          {
            id: 'T18-L08-SDS-Q1',
            type: 'mc',
            prompt:
              'Your crew is using gel cleaning solvent to clean fiber ends and splice enclosures. Does this product require an SDS on file at the job site?',
            choices: [
              { text: 'No — it\'s a cleaning product, not a chemical', correct: false },
              { text: 'Yes — gel cleaning solvents contain alcohols or petroleum-based solvents with defined OSHA exposure limits and first-aid requirements', correct: true },
              { text: 'Only if the crew uses more than one liter per shift', correct: false },
              { text: 'Only if OSHA is doing a site inspection', correct: false },
            ],
            rationale:
              'Gel cleaning solvents are classified hazardous chemicals under OSHA HazCom (29 CFR 1910.1200). The SDS must be accessible at the job site for any hazardous chemical in use. Section 8 specifies required glove type; Section 4 covers skin/eye first aid.',
          },
          {
            id: 'T18-L08-SDS-Q2',
            type: 'mc',
            prompt:
              'The crew is priming and cementing HDPE conduit joints using PVC conduit primer and cement. Is an SDS required?',
            choices: [
              { text: 'No — conduit cement is a construction adhesive, not a listed chemical', correct: false },
              { text: 'Yes — conduit primer and cement contain solvents (MEK or similar) with inhalation and skin exposure limits', correct: true },
              { text: 'Only for the primer, not the cement', correct: false },
              { text: 'Only if used in a confined space', correct: false },
            ],
            rationale:
              'Conduit primer and cement contain methyl ethyl ketone (MEK) or similar solvents classified as hazardous. SDS Section 8 specifies ventilation requirements and glove selection. Both primer and cement are separately classified and require individual SDS.',
          },
          {
            id: 'T18-L08-SDS-Q3',
            type: 'mc',
            prompt:
              'A 12V lead-acid battery backup unit is stored in the job site van. Does it require an SDS?',
            choices: [
              { text: 'No — sealed lead-acid batteries are safe to handle without special documentation', correct: false },
              { text: 'Yes — lead-acid batteries contain sulfuric acid electrolyte; the SDS covers acid spill response, PPE, and the hydrogen gas fire hazard during charging', correct: true },
              { text: 'Only if the battery is charging on site', correct: false },
              { text: 'Only for batteries over 100 Ah capacity', correct: false },
            ],
            rationale:
              'Lead-acid batteries contain sulfuric acid electrolyte — a corrosive hazardous chemical under 29 CFR 1910.1200. The SDS is required regardless of charge state. Key hazards covered: acid spill (chemical splash goggles + acid-resistant gloves), and hydrogen gas evolution during charging (fire/explosion).',
          },
          {
            id: 'T18-L08-SDS-Q4',
            type: 'mc',
            prompt:
              'The crew is cutting pavement using a concrete saw to trench conduit. Does this require an SDS?',
            choices: [
              { text: 'No — the saw is a tool, not a chemical', correct: false },
              { text: 'Yes — cutting concrete generates crystalline silica dust, which has an OSHA substance-specific standard (29 CFR 1910.1053, PEL = 50 µg/m³ TWA)', correct: true },
              { text: 'Only if the cut is longer than 10 feet', correct: false },
              { text: 'Only when cutting indoors', correct: false },
            ],
            rationale:
              'Crystalline silica dust from concrete cutting is an OSHA regulated substance (29 CFR 1910.1053). The silica-containing product (concrete) has an SDS. Wet-cutting and/or local exhaust ventilation are the required engineering controls. The SDS must be accessible on site.',
          },
          {
            id: 'T18-L08-SDS-Q5',
            type: 'mc',
            prompt:
              'A fiber optic cable reel (loose-tube, gel-filled) is staged at the job site. Does the fiber cable itself require an SDS?',
            choices: [
              { text: 'Yes — all fiber optic cables contain hazardous glass fibers', correct: false },
              { text: 'No — the cable assembly (glass fiber + plastic sheath) is not classified as a hazardous chemical; the filling gel inside requires an SDS separately', correct: true },
              { text: 'Yes — gel-filled cables always require an SDS for the entire assembly', correct: false },
              { text: 'Only if the cable contains more than 144 fibers', correct: false },
            ],
            rationale:
              'The fiber cable assembly itself is not classified as a hazardous chemical under OSHA HazCom. However, the thixotropic filling gel inside loose-tube cables IS a petroleum-based compound that requires its own SDS. Keep the cable manufacturer\'s SDS packet for the gel — not the cable assembly SDS.',
          },
          {
            id: 'T18-L08-SDS-Q6',
            type: 'mc',
            prompt:
              'A bag of galvanized hardware (bolts, nuts, pole-line brackets) is used for routine aerial attachment work. Is an SDS required?',
            choices: [
              { text: 'Yes — all galvanized metal requires an SDS', correct: false },
              { text: 'No — standard galvanized hardware is not classified as a hazardous chemical for routine handling; an SDS is needed only if the hardware is cut, ground, or welded (generating zinc fumes)', correct: true },
              { text: 'Yes — zinc coating is a heavy metal and requires documentation', correct: false },
              { text: 'Only if the hardware weighs more than 50 lbs', correct: false },
            ],
            rationale:
              'Routine handling of assembled galvanized hardware does not require an SDS under OSHA HazCom. The hazard arises when the galvanized coating is disturbed by cutting, grinding, or welding — which generates zinc fumes (a NIOSH-listed respiratory hazard). Those operations require an SDS for the zinc-containing product and respiratory protection assessment.',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <GatedAssessment
        courseId="T18"
        assessmentId="T18-L08"
        title="Check — Hazardous Materials on an OSP Job"
        fallback={
        <Quiz
          title="Check — Hazardous Materials on an OSP Job"
          mode="multiple-choice"
          questions={[
            {
              id: 'T18-L08-Q1',
              type: 'mc',
              prompt:
                'Which section of the GHS Safety Data Sheet (SDS) specifies what PPE to wear when handling a hazardous chemical?',
              choices: [
                'Section 2 — Hazard Identification',
                'Section 4 — First-Aid Measures',
                'Section 8 — Exposure Controls / PPE',
                'Section 11 — Toxicological Information',
              ],
              answerIndex: 2,
              explanation:
                'Section 8 (Exposure Controls / PPE) lists the engineering controls required (ventilation), the applicable exposure limits (OSHA PEL and ACGIH TLV), and the specific PPE requirements: glove type and material, respirator classification, eye and face protection, and body protection. In a field emergency or pre-task check, Section 8 is the first section to open after Section 4 (first aid).',
              citation:
                '29 CFR 1910.1200 (HazCom 2012 — GHS SDS format requirement); 16-section GHS SDS format (ecfr.gov).',
            },
            {
              id: 'T18-L08-Q2',
              type: 'mc',
              prompt:
                'The OSHA Permissible Exposure Limit (PEL) for crystalline silica dust (from concrete cutting) under the 2016 silica rule is:',
              choices: [
                '100 µg/m³ TWA (the original 1970s limit)',
                '50 µg/m³ TWA (the current 2016 rule)',
                '25 µg/m³ TWA (the ACGIH TLV)',
                'There is no OSHA PEL for silica — it is only recommended',
              ],
              answerIndex: 1,
              explanation:
                'The current OSHA PEL for crystalline silica is 50 µg/m³ as an 8-hour TWA, per 29 CFR 1910.1053 (the 2016 revised silica standard). The pre-2016 PEL was 100 µg/m³ — that value appears in older training materials and should not be cited. The ACGIH TLV of 25 µg/m³ is more conservative and is often used as the best-practice target, but it is not legally binding.',
              citation:
                '29 CFR 1910.1053 (ecfr.gov); 2016 OSHA silica rule.',
              fieldNote:
                'Wet-cutting is the primary engineering control for silica. If visible dust is generated during saw-cutting, switch to wet-cutting immediately — visible dust is far above the PEL.',
            },
            {
              id: 'T18-L08-Q3',
              type: 'mc',
              prompt:
                'A technician splices fiber daily without gloves, wiping the filling gel off with a rag and moving on. The gel is not acutely toxic. Is this a health concern?',
              choices: [
                'No — if it doesn\'t cause immediate harm, there\'s no real hazard',
                'No — filling gel is exempt from SDS requirements because it\'s not classified as dangerous',
                'Yes — chronic daily skin contact with mineral oil-based gel causes cumulative skin damage; nitrile gloves and proper cleaning are required',
                'Yes — but only if the worker has pre-existing skin conditions',
              ],
              answerIndex: 2,
              explanation:
                'Filling gel is not acutely toxic, but chronic daily skin contact with mineral oil-based compounds causes cumulative dermatitis and skin damage over time — particularly with absorption through cracked skin. The SDS requires nitrile or latex gloves for routine handling and specifies approved cleaning methods. Using gasoline or acetone to clean gel adds a solvent exposure hazard. The hazard is chronic, not acute — "it doesn\'t burn me" is not the right standard for a chemical you handle every working day.',
              citation:
                'Manufacturer SDS for fiber optic filling gel (Corning, OFS, AFL — publicly posted); NIOSH ICSC for mineral oil.',
            },
            {
              id: 'T18-L08-Q4',
              type: 'fill-in-blank',
              prompt:
                'The international standard for classifying and labeling hazardous chemicals, adopted by OSHA under HazCom 2012, which standardized the 16-section SDS format and hazard pictograms, is called the ____.',
              answer: 'GHS',
              answerDisplay: 'GHS (Globally Harmonized System)',
              explanation:
                'OSHA adopted the Globally Harmonized System (GHS) for chemical classification and labeling under HazCom 2012 (29 CFR 1910.1200), effective June 2015 for most industries. This is why all modern SDS documents in the U.S. use the same 16-section structure and standardized pictograms (flame, skull-and-crossbones, health hazard symbol, etc.) regardless of manufacturer or country of origin.',
              citation:
                '29 CFR 1910.1200 (HazCom 2012); GHS adoption in the U.S. (ecfr.gov).',
            },
            {
              id: 'T18-L08-Q5',
              type: 'mc',
              prompt:
                'A lead-acid battery at a fiber equipment hut spills electrolyte on a crew member\'s arm. The first action (before reviewing the SDS) should be:',
              choices: [
                'Apply baking soda neutralizer immediately',
                'Flush the affected skin with large amounts of water for at least 15–20 minutes, then seek medical attention',
                'Cover with a clean dry cloth and go to urgent care',
                'Apply the SDS Section 4 instructions only after arriving at a hospital',
              ],
              answerIndex: 1,
              explanation:
                'For acid skin exposure, immediate and prolonged water flushing (15–20 minutes minimum) is the universal first-aid measure and takes priority over every other action, including reading the SDS. This is what SDS Section 4 (First-Aid Measures) specifies for sulfuric acid contact. Baking soda neutralization is NOT recommended by most SDS documents — the neutralization reaction generates heat and can worsen burns. Get to an eye wash station or running water first; read Section 4 while the flush is running if possible.',
              citation:
                '29 CFR 1910.1000 Table Z-1 (sulfuric acid PEL); OSHA 29 CFR 1910.151(c) (emergency eyewash/shower requirements); SDS Section 4 first-aid guidance for sulfuric acid.',
            },
          ]}
        />
        }
      />

    </LessonLayout>
  );
}
