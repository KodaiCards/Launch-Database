// Net-new — T06.L10 RUS 1751F-643 — Innerduct Standard
// Advanced lesson: innerduct qualification, traceability, RUS acceptance testing.
// Sources: RUS 1751F-643 (Underground Plant Design) — primary text paywalled; field practice.

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T06.L10',
  course_id: 'T06',
  title: 'RUS 1751F-643 — Innerduct Standard',
  order: 10,
  lesson_type: 'advanced',
  prerequisites: [
    'T06.L01', 'T06.L02', 'T06.L03',
    'T06.L04', 'T06.L05', 'T06.L06',
    'T06.L07', 'T06.L08', 'T06.L09',
  ],
  learning_objectives: [
    'Explain what innerduct is, why it is used inside a larger conduit, and how it differs from microduct',
    'Describe what RUS 1751F-643 requires for innerduct qualification and traceability',
    'Identify the documentation artifacts required to demonstrate RUS innerduct compliance on a deliverable',
    'Apply the innerduct sizing rule for fiber installation inside a conduit bundle',
  ],
  estimated_minutes: 20,
  vocabulary_introduced: [
    'RUS 1751F-643 innerduct qualification',
    'innerduct traceability',
    'RUS acceptance testing',
  ],
  key_terms: [
    {
      term: 'RUS 1751F-643 innerduct qualification',
      definition: 'RUS Bulletin 1751F-643 (Underground Plant Design) is the RUS standard that specifies the material and performance requirements for innerduct (smaller duct installed inside a larger conduit) used on RUS-funded telecommunications projects. For innerduct to be used on a RUS-funded job, it must be listed on the RUS Accepted Materials List (AML) — meaning the manufacturer has submitted test data demonstrating that the innerduct meets RUS 1751F-643 requirements for wall thickness, tensile strength, UV resistance, chemical resistance, and long-term deformation resistance. Using non-listed innerduct on a RUS job is a contract non-compliance issue. (Source: RUS 1751F-643; [confirm current innerduct acceptance test requirements against the current paid edition].)',
    },
    {
      term: 'innerduct traceability',
      definition: 'The documentation chain that allows an inspector to verify that a specific length of innerduct installed in the field was manufactured to RUS 1751F-643 specifications. Traceability includes: (1) the innerduct type designation (often printed on the duct at regular intervals — e.g., "1.25-inch SDR-11 HDPE INNERDUCT RUS LISTED"), (2) the manufacturer\'s date code printed on the duct indicating year/month of manufacture, (3) the reel or lot number allowing the inspector to trace back to the factory test report, and (4) the manufacturer\'s test certificate or compliance letter confirming the innerduct meets 1751F-643 requirements. Traceability is required in the project\'s closeout documentation package.',
    },
    {
      term: 'RUS acceptance testing',
      definition: 'The testing program required by RUS standards to demonstrate that a material meets RUS specifications before it is used on a RUS-funded project. For innerduct, acceptance testing under RUS 1751F-643 includes mechanical tests (tensile pull, crush resistance, impact resistance) and material tests (UV resistance, chemical compatibility with bentonite slurry and conduit lubricants, long-term creep or deformation resistance). RUS does not typically require the field crew to re-run these tests — the manufacturer performs them as part of obtaining RUS Accepted Materials List (AML) status. The field crew\'s job is to verify that the product installed is AML-listed and has the traceability documents.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export const vocabulary_assumed = [
  { term: 'innerduct', source_lesson_id: 'T06.L03' },
  { term: 'microduct', source_lesson_id: 'T06.L03' },
  { term: 'conduit fill', source_lesson_id: 'T06.L04' },
  { term: 'HDPE', source_lesson_id: 'T01.L08' },
  { term: 'RUS 1751F-643', source_lesson_id: 'T06.L02' },
  { term: 'pull tension', source_lesson_id: 'T06.L04' },
];

export const key_terms = meta.key_terms;

export default function T06L10_RUS1751F643InnterductStandard() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          When you install a large conduit (say, 4-inch HDPE) under a road using directional
          boring, you end up with a lot of empty space inside that conduit. Instead of using
          the whole 4-inch space for one fiber cable, it's smarter to fill that conduit with
          several smaller ducts — each one holding its own fiber cable. These smaller ducts
          inside the bigger conduit are called <strong>innerducts</strong>.
        </p>
        <p className="mt-2">
          Think of it like a PVC pipe containing three garden hoses. Each hose carries a
          different fiber run to a different part of your network. Later, when you need to add
          capacity or fix a section, you pull in the new cable through its own innerduct without
          disturbing the others. It also protects the fiber from other cables inside the conduit
          and gives each fiber run its own cleanly managed pathway.
        </p>
        <p className="mt-2">
          On RUS-funded projects, the innerduct can't be just any plastic tube you found at
          the hardware store. RUS has a standard — <strong>RUS 1751F-643</strong> — that
          specifies what the innerduct must be made of, how strong it has to be, and how
          long it must last in the ground. If you use innerduct that isn't on the RUS
          Accepted Materials List, the project auditor can flag it as a contract violation.
          This lesson walks you through what that standard requires and what paperwork you
          need to prove compliance.
        </p>
        <p className="mt-2 text-sm text-slate-300/70">
          Note: RUS 1751F-643 (Underground Plant Design) is a paywalled RUS bulletin.
          Designers should verify directly against the current edition of 1751F-643 when
          available.
          [confirm current innerduct acceptance test requirements per RUS 1751F-643]
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in context</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">RUS</td>
              <td className="px-3 py-2">Rural Utilities Service</td>
              <td className="px-3 py-2">Federal program that funds rural broadband; sets material standards for funded projects</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">AML</td>
              <td className="px-3 py-2">Accepted Materials List</td>
              <td className="px-3 py-2">RUS's list of pre-approved products; only AML-listed innerduct can be used on RUS jobs</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">HDPE</td>
              <td className="px-3 py-2">High-Density Polyethylene</td>
              <td className="px-3 py-2">The plastic material used for both the outer conduit and most RUS-listed innerducts</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">SDR</td>
              <td className="px-3 py-2">Standard Dimension Ratio</td>
              <td className="px-3 py-2">A wall-thickness rating for plastic duct: outer diameter divided by wall thickness. Lower SDR = thicker wall = stronger duct</td>
            </tr>
          </tbody>
        </table>

        {/* Key Terms Flashcards */}
        <Flashcard
          deckId="T06-L10"
          cards={key_terms.map((kt, idx) => ({
            id: `T06-L10-fc-${idx}`,
            front: `What is ${kt.term}?`,
            back: kt.definition,
          }))}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>What RUS 1751F-643 Actually Requires</h2>

        <h3 className="mt-4 font-semibold">Innerduct basics: sizes and materials</h3>
        <p>
          Innerduct is a smaller duct — typically 1 inch, 1.25 inch, or 1.5 inch in outer
          diameter — installed inside a larger outer conduit (typically 2-inch or 4-inch HDPE
          or PVC). The innerduct gives each fiber cable its own dedicated pathway inside the
          shared outer conduit.
        </p>
        <p className="mt-2">
          Common innerduct configurations for fiber distribution:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-slate-300/90">
          <li>3 × 1-inch innerducts inside a 3-inch outer conduit (common for distribution plant)</li>
          <li>4 × 1-inch innerducts inside a 4-inch outer conduit (transport or feeder routes)</li>
          <li>2 × 1.25-inch innerducts inside a 3-inch outer conduit (larger fiber bundles per path)</li>
        </ul>
        <p className="mt-2">
          Innerduct materials approved under RUS 1751F-643 for RUS-funded projects are
          typically:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-slate-300/90">
          <li><strong>HDPE SDR-11:</strong> High-density polyethylene with a standard dimension ratio of 11 (wall thickness = OD ÷ 11). SDR-11 provides good crush resistance and flexibility for curved bore paths. Most common for fiber innerduct.</li>
          <li><strong>Ribbed or corrugated HDPE:</strong> The exterior ribbing increases compressive strength while reducing material weight. The inner bore is smooth to minimize pull friction. Some RUS-listed products use this profile.</li>
        </ul>
        <p className="mt-2 text-sm text-slate-300/70">
          Note: only innerduct products on the current RUS Accepted Materials List may be used
          on RUS-funded jobs. The AML is updated periodically — verify the specific product you
          are specifying is on the current list before purchase.
          [confirm current RUS AML for innerduct products at rd.usda.gov/resources]
        </p>

        <h3 className="mt-5 font-semibold">Innerduct sizing inside the conduit</h3>
        <p>
          The key sizing rule for innerduct inside a conduit is the same 40% fill rule that
          applies to cable inside conduit (see T06.L04). The innerducts, taken together, must
          occupy no more than 40% of the outer conduit's internal cross-sectional area.
          This ensures that the innerducts can be installed without excessive friction and
          that the outer conduit wall isn't stressed.
        </p>
        <p className="mt-2">
          <strong>Example calculation:</strong>
        </p>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 text-sm leading-7 text-slate-200 my-3">
          <p className="font-semibold mb-2">Scenario: 3 × 1.25-inch innerducts in a 3-inch outer conduit</p>
          <p>Step 1: Outer conduit ID (Schedule 40 PVC, 3-inch nominal) = 3.230 inches</p>
          <p>Step 2: Innerduct OD = 1.25 inches each</p>
          <p>Step 3: Outer conduit cross-sectional area = π × (3.230/2)² = π × 1.615² = 8.19 in²</p>
          <p>Step 4: Area of ONE innerduct = π × (1.25/2)² = π × 0.625² = 1.23 in²</p>
          <p>Step 5: Area of THREE innerducts = 3 × 1.23 = 3.69 in²</p>
          <p>Step 6: Fill % = (3.69 / 8.19) × 100 = <strong>45.1%</strong></p>
          <p className="mt-2 text-amber-300">Result: 45.1% exceeds the 40% fill limit. This configuration does not comply.</p>
          <p className="mt-2">Fix: Use 2 × 1.25-inch innerducts (fill = 2 × 1.23 / 8.19 = 30.0%) — compliant. Or use 1-inch innerducts: 3 × (π × 0.5²) = 3 × 0.785 = 2.36 in² → fill = 28.8% — also compliant.</p>
          <p className="mt-2 text-slate-300/70 text-xs">Sanity check: 30% fill in a 3-inch conduit with two 1.25-inch innerducts leaves 70% of the conduit cross-section as open space — room for slurry during bore pull and for the cable to move without binding.</p>
        </div>

        <h3 className="mt-5 font-semibold">Traceability documentation on RUS projects</h3>
        <p>
          RUS project inspectors verify material compliance through traceability documentation.
          For innerduct, the required documentation includes:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Type designation on the duct.</strong> Every AML-listed innerduct has
            its type designation, size, material, and manufacturer printed directly on the
            duct at regular intervals (typically every 2 feet). The printing must include
            "RUS LISTED" or "RUS QUALIFIED" and reference to 1751F-643.
            Example: "1.25-in SDR-11 HDPE INNERDUCT — RUS 1751F-643 LISTED — [MANUFACTURER]"
          </li>
          <li>
            <strong>Date code.</strong> The manufacturing date code (year and month, sometimes
            lot number) is printed on the duct. This allows the inspector to trace the duct
            back to the factory run and verify that the manufacturing date is not beyond the
            product's storage life (most HDPE duct has a UV-exposure storage limit of 12–24
            months before the UV stabilizers degrade).
          </li>
          <li>
            <strong>Manufacturer's compliance letter or test certificate.</strong> A written
            statement from the manufacturer confirming that the specific lot or reel meets
            RUS 1751F-643 requirements. This is submitted as part of the project's material
            submittals, typically before installation begins so the engineer of record can
            approve the product.
          </li>
          <li>
            <strong>Reel records.</strong> The reel number and footage installed is recorded
            on the as-built drawings and in the project's materials log. If an inspector
            later asks "where did this innerduct come from?" the reel number traces it to
            the delivery receipt, which traces to the purchase order, which traces to the
            manufacturer's test certificate.
          </li>
        </ol>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: RUS 1751F-643 §5 and §11 (innerduct requirements and documentation package
          structure); field practice for submittal formatting.
          [confirm current submittal requirements with RUS district office on your project]
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> RUS 1751F-643 requires innerduct to be on the AML before
            it is used on a RUS-funded project. The engineer specifies AML-listed innerduct
            in the project materials list. The contractor procures and installs only listed
            products. The closeout package includes the traceability documentation.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> In practice, the most common compliance failure on RUS
            projects is a contractor substituting a non-listed innerduct product because
            it was available locally, cheaper, or "looks the same." It often DOES look the
            same — HDPE is HDPE — but the material certification history and testing are what
            make the difference for RUS audit purposes. The engineer of record is responsible
            for catching this substitution during inspection visits. The corrective action
            (replacing all non-listed innerduct after the conduit is buried) is extremely
            expensive. The fix: require the traceability paperwork before installation begins,
            not after.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>The risk:</strong> Using non-listed innerduct on a RUS-funded project
            can trigger a material nonconformance finding in the RUS loan closing audit.
            In the worst case, it can require the contractor to remove and replace the
            non-compliant material — at the contractor's expense, without reimbursement
            from the RUS loan proceeds.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Advanced: Innerduct Storage Life and Field Inspection</h2>

        <h3 className="mt-4 font-semibold">UV exposure and storage life</h3>
        <p>
          HDPE innerduct contains UV stabilizer additives that protect the plastic from
          UV degradation during outdoor storage. These stabilizers have a finite life:
          most AML-listed HDPE innerduct has a maximum outdoor storage (direct sun) life
          of 12–24 months. Storage in a shaded or covered area extends this significantly.
        </p>
        <p className="mt-2">
          Field inspectors check the date code on the innerduct to verify it is within its
          storage life. Innerduct beyond its storage life must not be installed — UV degradation
          causes brittleness that can lead to cracking under the mechanical stress of the
          pull-back or freeze-thaw cycling underground.
          [confirm current storage life limit with the specific manufacturer's data sheet]
        </p>

        <h3 className="mt-5 font-semibold">Field inspection checklist for innerduct</h3>
        <p>
          Before allowing innerduct installation to begin, an inspector should verify:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
          <li>Innerduct type designation matches the project specification</li>
          <li>"RUS LISTED" / "RUS 1751F-643" text is printed on the duct at regular intervals</li>
          <li>Date code is within the manufacturer's stated storage life</li>
          <li>Manufacturer's compliance letter or test certificate is in the project submittal file</li>
          <li>No visible cracks, flattening, or chalking on the duct exterior (signs of UV degradation or mechanical damage during shipping)</li>
          <li>Pull string or pull tape is pre-loaded in the innerduct (many AML-listed innerducts come with factory-loaded pull string; verify before installation)</li>
        </ul>
      </section>

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T06.L10 Check — RUS 1751F-643 Innerduct Standard"
        mode="multiple-choice"
        questions={[
          {
            id: 'T06-L10-Q1',
            type: 'mc',
            prompt: 'What does it mean for innerduct to be "RUS 1751F-643 listed"?',
            choices: [
              'The innerduct has been inspected and approved by the project engineer on site',
              'The innerduct manufacturer has submitted test data showing the product meets RUS 1751F-643 requirements, and the product is on the RUS Accepted Materials List (AML)',
              'The innerduct was purchased from a RUS-approved distributor',
              'The innerduct is made of HDPE, which automatically qualifies it for all RUS projects',
            ],
            answerIndex: 1,
            explanation: 'RUS 1751F-643 listing means the manufacturer has submitted test data to RUS demonstrating that the product meets the specification for wall thickness, tensile strength, UV resistance, chemical resistance, and long-term deformation resistance. The product is then added to the RUS Accepted Materials List (AML). Listing is about factory qualification, not on-site inspection or distributor sourcing. (Source: RUS 1751F-643; [confirm current AML process at rd.usda.gov].)',
          },
          {
            id: 'T06-L10-Q2',
            type: 'mc',
            prompt: 'What four items constitute innerduct traceability documentation for a RUS project closeout package?',
            choices: [
              'Manufacturer name, sale price, delivery date, installation photo',
              'Type designation on the duct, date code, reel/lot number, manufacturer test certificate or compliance letter',
              'Conduit fill calculation, pull-tension log, bore depth record, OTDR trace',
              'Purchase order, invoice, delivery receipt, installation report',
            ],
            answerIndex: 1,
            explanation: 'Innerduct traceability includes: (1) type designation printed on the duct (e.g., "1.25-in SDR-11 HDPE RUS LISTED"), (2) manufacturing date code, (3) reel or lot number, and (4) the manufacturer\'s test certificate or compliance letter confirming 1751F-643 compliance. These four items allow an RUS auditor to trace the installed product back to the factory test that qualified it. (Source: RUS 1751F-643 §5; field practice.)',
          },
          {
            id: 'T06-L10-Q3',
            type: 'mc',
            prompt: '3 × 1.25-inch innerducts are planned for a 3-inch Schedule 40 PVC outer conduit (ID = 3.230 inches). The fill calculation shows 45.1%. Is this compliant with the 40% fill rule?',
            choices: [
              'Yes — 45.1% is within the 5% rounding tolerance allowed by RUS',
              'No — 45.1% exceeds the 40% maximum. Use 2 × 1.25-inch innerducts (30% fill) or switch to 1-inch innerducts instead',
              'Yes — the 40% fill rule applies only to fiber cable inside innerduct, not to innerducts inside conduit',
              'No — but the fix is to upgrade to a 4-inch outer conduit and keep all three innerducts',
            ],
            answerIndex: 1,
            explanation: '45.1% exceeds the 40% fill rule. There is no rounding tolerance — 40% is the hard limit. The simplest fix is to use 2 × 1.25-inch innerducts (fill = 30%) or switch to 1-inch innerducts (fill = 28.8% for three). Both are compliant. Upgrading to a 4-inch conduit is also compliant but adds unnecessary cost when a 3-inch conduit with two 1.25-inch innerducts serves the design requirement. (Source: RUS 1751F-643 §5; T06.L04 conduit fill rule.)',
          },
          {
            id: 'T06-L10-Q4',
            type: 'mc',
            prompt: 'A contractor is about to install innerduct that appears identical to the specified product but has no "RUS LISTED" text on it and no manufacturer compliance letter in the submittal file. The correct action is:',
            choices: [
              'Allow installation to proceed — the visual similarity is sufficient evidence of compliance',
              'Stop installation and require the contractor to provide AML listing documentation before any innerduct is placed underground',
              'Allow installation but note the discrepancy in the inspection report; resolve documentation after project completion',
              'Contact RUS to have the unlisted product added to the AML retroactively',
            ],
            answerIndex: 1,
            explanation: 'Unlisted innerduct must not be installed on a RUS project. Once it\'s underground, removing and replacing it is extremely expensive — that cost falls on the contractor, not the project. The fix before installation is simple: stop work, require the contractor to provide the compliance letter or replace the product with listed material. Allowing installation and resolving documentation later is not acceptable — RUS audit standards require compliance BEFORE installation, not after. (Source: RUS 1751F-643 §5; field practice.)',
          },
          {
            id: 'T06-L10-Q5',
            type: 'mc',
            prompt: 'A reel of HDPE innerduct has a date code showing it was manufactured 26 months ago and has been stored outside in the sun. What is the concern?',
            choices: [
              'The innerduct may have exceeded its UV stabilizer storage life, causing UV degradation that makes the plastic brittle and prone to cracking',
              'The innerduct is more than 2 years old and automatically disqualified from RUS use under 1751F-643',
              'The date code is irrelevant — HDPE does not degrade from UV exposure',
              'There is no concern — HDPE innerduct has an unlimited outdoor storage life',
            ],
            answerIndex: 0,
            explanation: 'Most AML-listed HDPE innerduct has a maximum outdoor direct-sun storage life of 12–24 months. At 26 months of outdoor exposure, the UV stabilizer additives are likely depleted. UV-degraded HDPE becomes brittle and can crack under the mechanical stress of conduit pull-back or underground freeze-thaw cycling. An inspector should reject this reel and require fresh-stock replacement. [confirm specific storage life limit with the manufacturer\'s data sheet.] (Source: field practice; manufacturer data.)',
          },
        ]}
      />

    </LessonLayout>
  );
}
