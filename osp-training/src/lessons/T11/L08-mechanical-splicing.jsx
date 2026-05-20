// T11.L08 — Mechanical Splicing
// Working lesson: mechanical splice types, index-matching gel, field use cases, book-vs-field
// Source: M04 §4.5 migrated + BranchingScenario for go/no-go decisions

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T11.L08',
  course_id: 'T11',
  title: 'Mechanical Splicing',
  order: 8,
  lesson_type: 'working',
  prerequisites: ['T11.L07'],
  learning_objectives: [
    'Identify the two field scenarios where mechanical splicing is acceptable vs. unacceptable',
    'Explain why index-matching gel degrades over time and what that means for long-term loss',
    'State the insertion loss specification for mechanical splices and compare it to fusion splices',
    'Apply the mechanical-vs-fusion decision framework to four different field scenarios',
  ],
  estimated_minutes: 20,
  vocabulary_introduced: [
    'mechanical splice',
    'index-matching gel',
    'ceramic-sleeve mechanical splice',
    'crimp-and-cleave splice',
  ],
  key_terms: [
    {
      term: 'mechanical splice',
      definition:
        'A fiber joint made by mechanically aligning two cleaved fiber ends and holding them in contact inside a precision ferrule or sleeve filled with index-matching gel. No heat is applied. Produces insertion loss of ≤0.5 dB typical, ≤1.0 dB maximum — significantly higher than fusion (≤0.10 dB target). Acceptable for emergency restoration; not acceptable for permanent OSP builds under RUS 1753F-401 or carrier-grade standards.',
    },
    {
      term: 'index-matching gel',
      definition:
        'A fluid or gel with a refractive index that matches optical fiber glass (~1.47 for standard silica), placed at the fiber-to-fiber interface in a mechanical splice. The gel fills any air gap or angular misalignment at the fiber ends, reducing the Fresnel back-reflection that an air gap would cause (~14 dB return loss without gel vs. ≥40 dB with gel). Over 5–10 years, the gel degrades under thermal cycling, drying out and crystallizing, which progressively increases insertion loss and reduces return loss.',
    },
    {
      term: 'ceramic-sleeve mechanical splice',
      definition:
        'A mechanical splice using a precision-bored ceramic ferrule to align two fiber ends. The fibers are inserted from each end until they make contact in the center, and a locking mechanism holds them. The ceramic sleeve provides 125 µm ± 1 µm alignment accuracy. Produces lower insertion loss than crimp-and-cleave designs (typically ≤0.3 dB) but is more expensive per unit.',
    },
    {
      term: 'crimp-and-cleave splice',
      definition:
        'A mechanical splice that uses a metal body with V-groove fiber alignment and a crimp mechanism to lock the fibers. Insert stripped fiber ends, position them so they contact in the gel, then crimp the body to lock both fibers in place. Faster installation than ceramic sleeve designs. Insertion loss: ≤0.5 dB typical. These are the "quick-splice" connectors found in emergency restoration kits.',
    },
  ],
  vocabulary_assumed: [
    { term: 'fusion splice', source_lesson_id: 'T11.L04' },
    { term: 'splice loss acceptance threshold', source_lesson_id: 'T11.L03' },
    { term: 'cleave angle', source_lesson_id: 'T11.L06' },
    { term: 'cleave', source_lesson_id: 'T11.L04' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T11L08_MechanicalSplicing() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ──────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500">
          <strong>Callback:</strong> Remember from <strong>T11.L03, the splice loss numbers</strong> — mechanical splices have higher insertion loss (≤0.5 dB typical) compared to fusion (≤0.10 dB). This lesson covers when and why you'd choose mechanical despite the penalty.
        </p>
        <p>
          A mechanical splice is a quick-connect for fiber: two cleaved ends pushed into a
          precision tube full of matching gel, crimped or locked in place. No electricity, no
          arc, no heat. You can make one in about 3 minutes with hand tools.
        </p>
        <p className="mt-2">
          The tradeoff: mechanical splices lose more light (≤0.5 dB typical vs. ≤0.10 dB for
          fusion) and degrade over time as the gel inside dries out and the fiber ends can shift.
          They are emergency tools — the fiber equivalent of a bandage. The right permanent fix
          is always fusion splicing.
        </p>

        {/* Flashcards */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Key Terms</h3>
          <Flashcard
            deckId="T11-L08"
            cards={[
              {
                id: 'T11-L08-fc-mechanical',
                front: 'What is a mechanical splice and what is its typical insertion loss?',
                back: 'A fiber joint made by aligning two cleaved fiber ends inside a precision ferrule or sleeve with index-matching gel — no heat applied. Insertion loss: ≤0.5 dB typical, ≤1.0 dB maximum. Significantly higher than fusion splice (≤0.10 dB). Acceptable for emergency restoration only; not for permanent OSP builds under RUS 1753F-401.',
              },
              {
                id: 'T11-L08-fc-gel',
                front: 'What is index-matching gel and why does it matter?',
                back: 'A gel with refractive index ~1.47 (matches silica glass) that fills the air gap at the fiber-to-fiber interface. Without gel, an air gap at the junction causes Fresnel back-reflection (~14 dB return loss — terrible for PON). With gel, return loss is ≥40 dB. Problem: gel degrades over 5–10 years under thermal cycling, crystallizing and increasing insertion loss progressively.',
              },
              {
                id: 'T11-L08-fc-ceramic',
                front: 'What is a ceramic-sleeve mechanical splice and when is it preferred over crimp-and-cleave?',
                back: 'Uses a precision-bored ceramic ferrule to align fiber ends. More accurate (125 µm ± 1 µm) and lower insertion loss (≤0.3 dB) than crimp-and-cleave designs (≤0.5 dB). More expensive per unit. Preferred when: emergency splice will remain in service for weeks or months, or when loss budget is tight.',
              },
              {
                id: 'T11-L08-fc-use-cases',
                front: 'What are the two acceptable use cases for mechanical splicing?',
                back: '(1) Emergency restoration without access to a fusion splicer (no power, no splicer on site) — mechanical splice restores service immediately; fusion splice replaces it at the next maintenance window. (2) Single-fiber restoration of a low-count copper-bypass route (T1 circuit, single-fiber enterprise link) where the loss budget is adequate. NOT acceptable for: permanent OSP builds, RUS contract work, FTTH distribution, or any multi-splice route.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── WORKING ──────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Mechanical Splice Specifications</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Parameter</th>
                <th className="px-3 py-2 text-left">Fusion splice</th>
                <th className="px-3 py-2 text-left">Ceramic-sleeve mechanical</th>
                <th className="px-3 py-2 text-left">Crimp-and-cleave mechanical</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">Typical IL</td>
                <td className="px-3 py-2 text-green-400">≤0.10 dB</td>
                <td className="px-3 py-2 text-yellow-400">≤0.30 dB</td>
                <td className="px-3 py-2 text-yellow-400">≤0.50 dB</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">Maximum IL</td>
                <td className="px-3 py-2 text-green-400">≤0.30 dB (RUS contract max)</td>
                <td className="px-3 py-2 text-orange-400">≤0.75 dB</td>
                <td className="px-3 py-2 text-red-400">≤1.00 dB</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">Long-term stability</td>
                <td className="px-3 py-2 text-green-400">Excellent — permanent glass joint</td>
                <td className="px-3 py-2 text-orange-400">Degrades — gel crystallizes in 5–10 yrs</td>
                <td className="px-3 py-2 text-red-400">Poor — gel + mechanical play under vibration</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">RUS 1753F-401 approved</td>
                <td className="px-3 py-2 text-green-400">Yes</td>
                <td className="px-3 py-2 text-red-400">No (for permanent splices)</td>
                <td className="px-3 py-2 text-red-400">No</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">Equipment needed</td>
                <td className="px-3 py-2">Fusion splicer + power + cleaver</td>
                <td className="px-3 py-2">Cleaver + hand tools (no power)</td>
                <td className="px-3 py-2">Cleaver + crimp tool (no power)</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">Re-enterable</td>
                <td className="px-3 py-2">No — permanent joint</td>
                <td className="px-3 py-2">Some models — check manufacturer</td>
                <td className="px-3 py-2">No — crimp is permanent</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* AnnotatedDiagram — mechanical splice cross-section */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Mechanical Splice Cross-Section</h3>
          <AnnotatedDiagram
            imageUrl={null}
            alt="Ceramic-sleeve mechanical splice cross-section diagram"
            width={700}
            height={200}
            annotations={[
              { id: 'left-fiber', x: 80, y: 100, label: 'Left fiber', description: 'Stripped, cleaned, cleaved fiber from the left. The bare 125 µm cladding is inserted into the alignment sleeve from this end.' },
              { id: 'right-fiber', x: 620, y: 100, label: 'Right fiber', description: 'Stripped, cleaned, cleaved fiber from the right. The bare cladding is inserted from the other end until both fiber ends make contact in the center of the sleeve.' },
              { id: 'gel-port', x: 350, y: 60, label: 'Index-matching gel port', description: 'The gel port where index-matching fluid is injected. The gel fills any gap between the two fiber end-faces, reducing Fresnel back-reflection. In factory-assembled crimp-and-cleave units, the gel is pre-filled at the factory.' },
              { id: 'alignment-sleeve', x: 350, y: 140, label: 'Precision alignment sleeve / ferrule', description: 'The 125 µm ± 1 µm precision bore that aligns both fiber ends laterally. In ceramic-sleeve designs, the bore is ground ceramic. In crimp-and-cleave designs, it\'s a precision-machined metal V-groove or tube.' },
              { id: 'crimp-collar', x: 500, y: 160, label: 'Crimp collar / lock mechanism', description: 'The mechanical locking element that holds the right fiber in position after adjustment. In crimp designs: apply once with the crimp tool — not re-adjustable. In some ceramic-sleeve designs: a locking screw allows re-adjustment.' },
              { id: 'body', x: 200, y: 170, label: 'Splice body / housing', description: 'The outer protective housing, typically a 60–80 mm plastic body. Holds the alignment sleeve in position and provides the surface for the locking mechanism.' },
            ]}
          />
          <p className="text-sm text-slate-400 mt-2">
            Ceramic-sleeve mechanical splice cross-section. The two fiber ends meet at the center of the precision bore, with index-matching gel at the interface. Source: FOA CFOS-S technical reference; generic design — consult manufacturer datasheet for specific product dimensions.
          </p>
        </div>

        {/* Quiz */}
        <div className="mt-6">
          <Quiz
            id="T11-L08-quiz-1"
            questions={[
              {
                id: 'q1',
                type: 'multiple-choice',
                text: 'A fiber cut occurs at 2 AM on a Sunday during a rainstorm. The crew has access to a hand tool kit with mechanical splices but the fusion splicer is at the shop 40 minutes away. Service is down. What is the correct approach?',
                options: [
                  { id: 'a', text: 'Wait for the fusion splicer — mechanical splices are never acceptable for any splice work' },
                  { id: 'b', text: 'Apply a mechanical splice to restore service immediately, then replace with a fusion splice at the next maintenance window' },
                  { id: 'c', text: 'Apply a mechanical splice and document it as a permanent repair' },
                  { id: 'd', text: 'Apply two mechanical splices in series to achieve lower combined loss than a single mechanical splice' },
                ],
                correctId: 'b',
                explanation: 'Emergency restoration without a fusion splicer available is one of the two acceptable use cases for mechanical splicing. The correct two-step approach: (1) make the mechanical splice to restore service immediately — this is time-critical, especially on a carrier or government contract. (2) Document the temporary mechanical splice in the splice log. (3) At the next maintenance window (often the next business day), return with the fusion splicer and replace the mechanical splice with a permanent fusion splice. Never document a mechanical splice as permanent on a RUS or carrier contract build.',
              },
              {
                id: 'q2',
                type: 'multiple-choice',
                text: 'A small ISP is building a 24-fiber private enterprise fiber network between two buildings 800 meters apart. The project budget is tight and the crew has crimp-and-cleave mechanical splices in stock. Can they use mechanical splices for the permanent installation?',
                options: [
                  { id: 'a', text: 'Yes — mechanical splices are acceptable for any private-enterprise build as long as the insertion loss passes' },
                  { id: 'b', text: 'Depends — if the link budget is adequate (0.50 dB per mechanical splice fits within the total loss budget AND the installation does not require carrier acceptance, RUS certification, or third-party lease), it may be technically feasible but is not best practice' },
                  { id: 'c', text: 'No — mechanical splices are never acceptable for any outdoor plant installation' },
                  { id: 'd', text: 'Yes — the FOA standard allows mechanical splices for any enterprise application' },
                ],
                correctId: 'b',
                explanation: 'The honest answer is nuanced: on a purely private-enterprise build with no RUS contract, no carrier acceptance test, and no long-term reliability requirement, mechanical splices COULD technically work if the link budget accommodates the higher insertion loss. However, the long-term degradation risk is real — index-matching gel in aerial or pedestal environments can crystallize in 5–7 years in extreme temperature swings, pushing the splice loss to 1.0–2.0 dB. If the fiber plant is later sold, leased to a carrier, or connected to a long-haul network, carrier acceptance testing will require ≤0.10 dB average splice loss. The correct professional advice: fusion splice it now. The cost delta between mechanical and fusion is minimal compared to the cost of rework.',
              },
              {
                id: 'q3',
                type: 'multiple-choice',
                text: 'Index-matching gel in a mechanical splice crystallizes after 7 years in an aerial pedestal environment. What is the expected symptom?',
                options: [
                  { id: 'a', text: 'The fiber breaks at the splice point — crystallized gel creates stress on the glass' },
                  { id: 'b', text: 'Insertion loss increases progressively over time from ≤0.50 dB to 1.0–2.0 dB; return loss decreases as the dried gel no longer fills the gap' },
                  { id: 'c', text: 'No change — the crystallized gel maintains its refractive index properties' },
                  { id: 'd', text: 'The fiber end-faces become re-fused by the pressure, permanently reducing insertion loss' },
                ],
                correctId: 'b',
                explanation: 'Index-matching gel degradation causes progressive insertion loss increase, not sudden failure. As the gel dries out: the refractive index mismatch between crystallized gel and fiber glass increases (away from the ~1.47 match), more light is reflected instead of transmitted, and insertion loss climbs from the original ≤0.50 dB toward 1.0–2.0 dB over 5–10 years. This is a slow, temperature-accelerated process. The symptom: an optical path that passes initial acceptance testing shows increasing loss on annual inspection readings or carrier performance monitoring alerts.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── ADVANCED ──────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Book vs. Field: Mechanical Splices on Small Private Builds</h2>

        <h3 className="mt-4 font-semibold">The book standard</h3>
        <p>
          RUS Bulletin 1753F-401 explicitly requires fusion splicing for all OSP fiber splices
          on RUS-financed telecommunications systems. TIA-568.3-D does not recommend mechanical
          splicing for permanent outside plant installations. FOA CFOS-S KSAs list mechanical
          splicing as an emergency/temporary technique, not a permanent solution.
        </p>

        <h3 className="mt-4 font-semibold">Field reality: cost-driven mechanical splicing on private builds</h3>
        <p>
          On small privately-funded builds — a company connecting two of its own buildings,
          a small municipality installing fiber between city facilities — some crews use
          mechanical splices to save equipment cost (no fusion splicer needed) or to close
          out a job faster. The initial installation passes an OTDR test. The plant looks fine.
        </p>
        <p className="mt-2">
          The problem emerges years later: a fiber-to-the-home build built mechanically and
          later sold to a regional carrier fails the carrier's acceptance testing. Or the
          building changes ownership and the new owner's ISP finds 1.8 dB mechanical splices
          throughout the plant. Rework cost: significant.
        </p>
        <p className="mt-2 p-3 bg-amber-900/30 border border-amber-500/40 rounded-lg text-amber-200 text-sm">
          <strong>Field rule:</strong> Never use mechanical splices for permanent installation
          on any build that might be accepted by a carrier, sold to a third party, or expanded
          in the future. The cost of fusion splicing is a one-time expenditure. The cost of
          re-splicing a mechanical-splice plant to meet carrier standards is compounding.
        </p>
      </section>


      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          This lesson builds on:
        </p>
        <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
    <li><strong>T11.L04</strong> — Part of the broader OSP workflow.</li>
    <li><strong>T11.L03</strong> — Part of the broader OSP workflow.</li>
    <li><strong>T11.L06</strong> — Part of the broader OSP workflow.</li>
        </ul>
        <p className="text-slate-200 mt-3 text-sm italic">
          Each step in the OSP process feeds into the next — understanding these connections strengthens your grasp of the whole system.
        </p>
      </section>
    </LessonLayout>
  );
}
