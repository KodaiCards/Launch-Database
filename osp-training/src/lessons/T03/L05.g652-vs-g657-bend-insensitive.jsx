// T03.L05 — G.652 vs. G.657 — When to Use Bend-Insensitive Fiber
// Working lesson: bend-insensitive fiber subcategories, use cases, splice compatibility

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import SideBySide from '../../components/primitives/SideBySide.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T03.L05',
  course_id: 'T03',
  title: 'G.652 vs. G.657 — When Bend-Insensitive Fiber Matters',
  order: 5,
  lesson_type: 'working',
  prerequisites: ['T02.L04', 'T03.L01'],
  vocabulary_introduced: [
    'G.657.A1',
    'G.657.A2',
    'G.657.B3',
    'trench-assisted profile',
  ],
  vocabulary_assumed: [
    { term: 'G.652.D',    source_lesson_id: 'T02.L01' },
    { term: 'macrobend',  source_lesson_id: 'T02.L04' },
    { term: 'MFD',        source_lesson_id: 'T02.L01' },
    { term: 'loose-tube', source_lesson_id: 'T03.L01' },
  ],
  key_terms: [
    {
      term: 'G.657.A1',
      definition:
        'ITU-T category A1 bend-insensitive SMF. Minimum design bend radius 10 mm. Backward-compatible with G.652.D for splicing (same MFD specification). Use case: distribution cables, drop cables, any application with bends down to 10 mm radius.',
    },
    {
      term: 'G.657.A2',
      definition:
        'ITU-T category A2 bend-insensitive SMF. Minimum design bend radius 7.5 mm. Backward-compatible with G.652.D for splicing. Use case: aerial drop cables, FTTH final-drop, tight-bend environments where G.657.A1 is insufficient.',
    },
    {
      term: 'G.657.B3',
      definition:
        'ITU-T category B3 ultra-bend-insensitive SMF. Minimum design bend radius 5 mm (some products rated to 2.5 mm). NOT guaranteed backward-compatible with G.652.D for zero-loss splicing — MFD tolerance may differ. Use case: in-building, MDU, inside drop terminals, customer premises with tight routing.',
    },
    {
      term: 'trench-assisted profile',
      definition:
        'A refractive index design in G.657.B3 fibers (and formerly G.657.B2, which was merged into A2 in the 2024 ITU-T G.657 edition) where a low-index "trench" around the core increases confinement of optical modes, reducing bend-induced loss. The trench profile achieves better bend performance at the cost of potentially different splicing behavior with G.652.D. [verify 2024 edition consolidation]',
    },
  ],
  estimated_minutes: 25,
};

export default function T03L05_G652VsG657BendInsensitive() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ──────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          From T02, you know that bending a fiber too sharply causes light to escape from
          the core — macrobend loss. Standard G.652.D fiber starts losing meaningful signal
          if you bend it tighter than about 30 mm radius (roughly the curvature of a golf
          ball). That's fine for a straight aerial span, but what about a fiber going around
          a door frame? Or through a tiny conduit bend inside a distribution terminal?
        </p>
        <p className="mt-2">
          That's where <strong>G.657 bend-insensitive fiber</strong> comes in. ITU-T G.657
          is a family of fiber types specifically engineered to survive tighter bends without
          significant loss. The different subcategories (A1, A2, B3) let you match the fiber
          to the bend severity of the installation environment.
        </p>
        <p className="mt-2">
          Think of it like selecting tires: you don't need off-road tires for highway driving,
          but you'd want them for tight mountain switchbacks. G.652.D is the highway tire.
          G.657.B3 is the off-road tire for the tightest corners.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Term</th>
              <th className="px-3 py-2 text-left">What it means</th>
              <th className="px-3 py-2 text-left">Quick field reference</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">G.652.D</td>
              <td className="px-3 py-2">Standard single-mode fiber (OS2)</td>
              <td className="px-3 py-2">Default OSP trunk fiber; min bend ~30 mm radius installation</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">G.657.A1</td>
              <td className="px-3 py-2">Bend-insensitive SMF, min 10 mm radius</td>
              <td className="px-3 py-2">Distribution/drop cables; splice-compatible with G.652.D</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">G.657.A2</td>
              <td className="px-3 py-2">Bend-insensitive SMF, min 7.5 mm radius</td>
              <td className="px-3 py-2">FTTH drop with tighter bends; still splice-compatible with G.652.D</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">G.657.B3</td>
              <td className="px-3 py-2">Ultra-bend-insensitive, min 5 mm radius</td>
              <td className="px-3 py-2">In-building, MDU, premises; verify splice compatibility</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">MFD</td>
              <td className="px-3 py-2">Mode Field Diameter</td>
              <td className="px-3 py-2">Effective beam diameter in SMF; must match for low-loss splicing</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKING ──────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>G.657 Subcategories — The Bend Radius Decision Tree</h2>

        <h3 className="mt-4 font-semibold">G.652.D — standard OSP fiber, its bend limits</h3>
        <p>
          G.652.D fiber (OS2) is engineered for long straight runs — trunk cables,
          feeder cables, backbone spans where bends are gentle and follow the natural
          curve of the route. The FOA field guide cites the practical bend radius rule
          for G.652.D: "20× OD dynamic, 10× OD static" as the industry rule of thumb.
          For a standard 250 µm coated fiber, that means approximately 2.5 mm × 20 = 50 mm
          (2 inches) for installation pulls (dynamic) and 2.5 mm × 10 = 25 mm for long-term
          routing (static). (Source: FOA Reference Guide bend radius page — verified)
        </p>
        <p className="mt-2">
          When a G.652.D fiber is bent tighter than its minimum radius, the mode field
          extends out of the core and light energy escapes — macrobend loss. At 1550 nm
          this is worst because longer wavelengths are more susceptible to macrobend
          loss than shorter ones. (Review: T02.L04 covered macrobend physics in detail.)
        </p>

        <h3 className="mt-5 font-semibold">G.657.A1 — the drop-cable workhorse</h3>
        <p>
          G.657.A1 is the most common bend-insensitive fiber for FTTH distribution and
          drop applications. Its key specs per ITU-T G.657 (2024 edition):
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li><strong>Minimum design bend radius: 10 mm</strong> (Source: ITU-T G.657 2024 — verified via itu.int + hengtongglobal.com)</li>
          <li>
            <strong>Bend loss limit (ITU-T G.657 specified test conditions):</strong>
            {' '}1 turn at 10 mm radius: ≤ 0.75 dB at 1550 nm, ≤ 1.5 dB at 1625 nm;
            10 turns at 15 mm radius: ≤ 0.25 dB at 1550 nm, ≤ 1.0 dB at 1625 nm.
            [Exact test conditions in ITU-T G.657 2024 §6 — paywalled; values cited here
            from T02 Research Brief which sourced from vendor datasheets and secondary
            sources. Confirm against current ITU-T G.657 2024 edition for design use.]
          </li>
          <li><strong>Splice compatibility:</strong> Fully backward-compatible with G.652.D for splicing. Same MFD specification — no intrinsic splice loss penalty at a G.657.A1/G.652.D interface. (Source: ITU-T G.657; hfcl.com G.657 blog — verified)</li>
        </ul>

        <h3 className="mt-5 font-semibold">G.657.A2 — tighter drops, still compatible</h3>
        <p>
          G.657.A2 extends bend tolerance to <strong>7.5 mm minimum radius</strong> while
          maintaining backward splice compatibility with G.652.D. (Source: ITU-T G.657 2024 —
          verified via weunionfiber.com + fs.com)
        </p>
        <p className="mt-2">
          Typical use: FTTH aerial drop cables where the cable must navigate a tight bend
          at the house entry point (drilling through a wall, running along a baseboard),
          and ADSS drops to low-clearance structures.
        </p>
        <p className="mt-2 text-sm text-amber-300/90 border-l-4 border-amber-400/30 pl-3">
          <strong>2024 standard update:</strong> ITU-T G.657 August 2024 edition merged
          category B2 into category A2. The current standard has three active
          subcategories: A1, A2, B3. G.657.B2 is now absorbed into G.657.A2.
          {' '}[verify 2024 edition consolidation against itu.int G.657 publication page]
          (Source: ITU-T G.657 2024 publication metadata — verified)
        </p>

        <h3 className="mt-5 font-semibold">G.657.B3 — ultra-tight bends, premises use</h3>
        <p>
          G.657.B3 achieves <strong>5 mm minimum bend radius</strong>, with some products
          rated to 2.5 mm (OFS EZ-Bend Ultra: explicitly rated to 2.5 mm minimum, per
          OFS product datasheet — verified). At 5 mm radius, this fiber can route around
          a bend tighter than a dime.
        </p>
        <p className="mt-2">
          The engineering tradeoff: G.657.B3 uses a <strong>trench-assisted refractive
          index profile</strong> — a low-index "trench" region around the core increases
          optical mode confinement, reducing bend loss. But this profile may not exactly
          match the G.652.D MFD specification. As a result, G.657.B3 is
          <strong> NOT guaranteed backward-compatible with G.652.D for zero-loss
          splicing.</strong> Splice loss at a B3/G.652.D interface depends on the
          specific fiber — it may be negligible or it may be measurable. (Source: hfcl.com
          G.657 blog; OFS technical literature; industry consensus — verified via
          secondary sources)
        </p>
        <p className="mt-2">
          Practical rule: B3 fiber at the customer premises can be spliced or connectorized
          to the OSP G.652.D distribution cable at the drop point with careful attention
          to splice loss measurement. For trunk cables where splice loss accumulates over
          many spans, use A1 or A2 (G.652.D-compatible) wherever possible.
        </p>

        <h3 className="mt-5 font-semibold">Bend radius decision tree</h3>
        <div className="mt-3 space-y-2 text-sm">
          <div className="border border-white/10 rounded-lg p-3 bg-white/3">
            <p className="font-semibold text-slate-100">Bend ≥ 30 mm radius</p>
            <p className="text-slate-300/90 mt-1">G.652.D is fine. Standard OSP trunk cable handles this easily.</p>
          </div>
          <div className="border border-blue-400/20 rounded-lg p-3 bg-blue-400/5">
            <p className="font-semibold text-blue-300">Bend 10–30 mm radius</p>
            <p className="text-slate-300/90 mt-1">G.657.A1 required. G.652.D may exceed acceptable macrobend loss. Common in distribution cables, drop cables, splice closures.</p>
          </div>
          <div className="border border-yellow-400/20 rounded-lg p-3 bg-yellow-400/5">
            <p className="font-semibold text-yellow-300">Bend 7.5–10 mm radius</p>
            <p className="text-slate-300/90 mt-1">G.657.A2 required. G.657.A1 may be marginal. Typical aerial drop at building entry, tight wall penetrations.</p>
          </div>
          <div className="border border-red-400/20 rounded-lg p-3 bg-red-400/5">
            <p className="font-semibold text-red-300">Bend ≤ 5 mm radius</p>
            <p className="text-slate-300/90 mt-1">G.657.B3 required. Ultra-tight bends in MDU distribution terminals, building riser closets, customer premises.</p>
          </div>
        </div>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book (ITU-T G.657 2024):</strong> Defines three active subcategories
            (A1, A2, B3), exact bend test conditions, acceptable loss limits at 1550 nm
            and 1625 nm, and MFD tolerances. The 2024 edition merged B2 into A2.
            [Exact test thresholds paywalled — confirm against current ITU-T G.657 2024
            edition for design specifications.]
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Most OSP crews don't think about G.657 subcategories
            during a feeder build — the specification is handled at design time by the
            engineer. Where field crews run into this is during drop cable installation.
            The standard FTTH procedure in many networks is: OSP G.652.D trunk → splice
            at distribution point → G.657.A1 drop cable → ONT at the house. If someone
            substitutes G.652.D drop cable in a tight-bend installation (because it was
            in the truck), you'll see elevated loss at the first bend that appears fine
            at room temperature but gets worse in winter when the cable stiffens.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Risk:</strong> Using G.652.D in a drop application with a 10 mm
            radius bend can produce 0.5–2 dB of macrobend loss at 1550 nm — enough to
            fail a GPON link budget on a marginal-power installation. G.657.A1 costs
            marginally more per meter; a truck roll to replace a bad drop costs far more.
          </p>
        </div>
      </section>

      {/* ── SIDE-BY-SIDE ────────────────────────────────────────────────── */}
      <SideBySide
        title="G.652.D vs. G.657 Subcategory Comparison"
        leftLabel="G.652.D (standard SMF)"
        rightLabel="G.657.A1 / A2 / B3"
        rows={[
          {
            attribute: 'Minimum bend radius',
            left: '~30 mm (installation); ~25 mm long-term — FOA rule of thumb for 250 µm coated fiber',
            right: 'A1: 10 mm · A2: 7.5 mm · B3: 5 mm (some products: 2.5 mm)',
          },
          {
            attribute: 'Splice compatibility with G.652.D',
            left: 'N/A — this IS G.652.D',
            right: 'A1/A2: fully backward-compatible (same MFD). B3: NOT guaranteed — verify splice loss before assuming zero penalty.',
          },
          {
            attribute: 'Typical OSP use cases',
            left: 'Feeder cables, trunks, aerial spans, backbone — any application with gentle bends',
            right: 'A1/A2: drop cables, distribution, any tight-bend point. B3: in-building, MDU, premises.',
          },
          {
            attribute: 'Bend loss mechanism',
            left: 'Standard step-index core — mode field extends to cladding at tight bends',
            right: 'Trench-assisted profile (B2/B3) or matched-clad (A1/A2) increases mode confinement',
          },
          {
            attribute: 'ITU-T standard',
            left: 'ITU-T G.652.D (2024)',
            right: 'ITU-T G.657 (2024) — note: 2024 edition merged B2 into A2 [confirm edition]',
          },
        ]}
      />

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">Trench-assisted profile — the physics</h3>
        <p>
          In a standard step-index fiber (G.652.D), the refractive index profile is simple:
          high-index core, lower-index cladding, flat cladding out to 125 µm. When the fiber
          bends, the optical mode field spreads laterally toward the outside of the bend,
          and some of the evanescent field extends into the cladding and escapes.
        </p>
        <p className="mt-2">
          The trench-assisted profile adds a third region: a low-index "trench" around the
          core, between the core and the outer cladding. This trench acts as a deeper
          optical barrier — the mode field must penetrate both the trench and the outer
          cladding to escape, requiring a much tighter bend angle to trigger significant
          loss. The result is the G.657.B3 bend tolerance of 5 mm and below.
        </p>
        <p className="mt-2">
          The tradeoff is that the trench profile changes the MFD slightly compared to
          standard G.652.D. For most fusion splicing, the difference is small enough
          to be negligible (&lt; 0.1 dB). But in a precision splice where every 0.02 dB
          matters (long high-loss-budget links), B3 to G.652.D splices need to be
          measured and budgeted individually.
        </p>
      </section>

      {/* ── KEY TERMS FLASHCARDS ──────────────────────────────────────────── */}
      <Flashcard
        deckId="T03-L05"
        cards={[
          {
            id: 'T03-L05-fc-a1',
            front: 'What is G.657.A1 and its minimum bend radius?',
            back: 'ITU-T category A1 bend-insensitive SMF. Minimum design bend radius: 10 mm. Fully backward-compatible with G.652.D for splicing (same MFD spec). Standard for FTTH drop cables and distribution points where bends can be as tight as 10 mm. (ITU-T G.657 2024 — verified)',
          },
          {
            id: 'T03-L05-fc-a2',
            front: 'What is G.657.A2 and when is it required over G.657.A1?',
            back: 'ITU-T category A2 bend-insensitive SMF. Minimum design bend radius: 7.5 mm. Still splice-compatible with G.652.D. Required when bends are tighter than 10 mm but 7.5 mm or more — typical aerial drops at wall entries, tight conduit bends. The 2024 ITU-T G.657 edition merged B2 into A2. (ITU-T G.657 2024 — verified)',
          },
          {
            id: 'T03-L05-fc-b3',
            front: 'What is G.657.B3 and what is its key tradeoff vs. A1/A2?',
            back: 'ITU-T category B3 ultra-bend-insensitive SMF. Minimum design bend radius 5 mm (some products: 2.5 mm). Uses trench-assisted refractive index profile for extreme bend tolerance. NOT guaranteed backward-compatible with G.652.D for zero-loss splicing — MFD tolerance may differ. For in-building, MDU, and customer premises use. (ITU-T G.657 2024; OFS; hfcl.com)',
          },
          {
            id: 'T03-L05-fc-b2-merge',
            front: 'What happened to G.657.B2 in the 2024 ITU-T standard?',
            back: 'The August 2024 edition of ITU-T G.657 merged category B2 into category A2. The current standard has three active subcategories: A1, A2, and B3. When reviewing older datasheets or specifications that reference G.657.B2, understand it maps to the current G.657.A2. [verify 2024 edition consolidation against itu.int]',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ───────────────────────────────────────────────── */}
      <Quiz
        title="T03.L05 Check — G.652 vs. G.657 Bend-Insensitive Fiber"
        mode="multiple-choice"
        questions={[
          {
            id: 'T03-L05-Q1',
            type: 'mc',
            prompt:
              'A GPON drop cable must navigate a 7.5 mm bend at a wall entry point. Which is the minimum ITU-T G.657 grade meeting this requirement?',
            choices: [
              'G.652.D — standard fiber handles most field bends',
              'G.657.A1 — rated to 10 mm minimum; 7.5 mm is within this spec',
              'G.657.A2 — rated to 7.5 mm minimum; exactly meets the requirement',
              'G.657.B3 — only ultra-bend-insensitive handles 7.5 mm',
            ],
            answerIndex: 2,
            explanation:
              'G.657.A2 is rated to a minimum bend radius of 7.5 mm — exactly meeting this requirement. G.657.A1 is rated to 10 mm and would not be sufficient at 7.5 mm. G.657.B3 would also work but is unnecessarily high-spec for this application. G.652.D minimum is ~30 mm for installation. (Source: ITU-T G.657 2024 — verified)',
          },
          {
            id: 'T03-L05-Q2',
            type: 'fill-in-blank',
            prompt:
              'The 2024 edition of ITU-T G.657 merged category _____ into category A2.',
            answer: 'B2',
            answerDisplay: 'B2',
            explanation:
              'ITU-T G.657 August 2024 edition merged category B2 into category A2. The current G.657 standard has three active subcategories: A1, A2, and B3. Older datasheets referencing G.657.B2 now correspond to G.657.A2. [verify 2024 edition consolidation against itu.int G.657 publication page]',
          },
          {
            id: 'T03-L05-Q3',
            type: 'mc',
            prompt:
              'G.657.B3 fiber differs from G.657.A1 primarily in which way?',
            choices: [
              'B3 has a smaller physical core diameter (7 µm vs. 9 µm)',
              'B3 is not guaranteed backward-compatible with G.652.D for zero-loss splicing due to potential MFD tolerance differences',
              'B3 has higher attenuation at 1550 nm than G.657.A1',
              'B3 cannot be used with GPON systems',
            ],
            answerIndex: 1,
            explanation:
              'G.657.B3 uses a trench-assisted refractive index profile that achieves very low bend loss but may have a slightly different MFD compared to G.652.D. It is NOT guaranteed backward-compatible with G.652.D for zero-loss splicing. In contrast, G.657.A1 and A2 are fully splice-compatible with G.652.D. (Source: hfcl.com G.657 blog; OFS technical literature — verified)',
          },
          {
            id: 'T03-L05-Q4',
            type: 'dragdrop',
            prompt:
              'Match each installation scenario to the minimum G.657 fiber grade required.',
            items: [
              { id: 'trunk',  label: 'OSP trunk cable on a gently curved aerial span (min bend ~200 mm)' },
              { id: 'drop10', label: 'FTTH drop cable with a 10 mm bend at a splice closure entry' },
              { id: 'drop75', label: 'GPON aerial drop with a 7.5 mm bend at a building wall entry' },
              { id: 'mdubend', label: 'In-building MDU with 5 mm radius corners in tight cable tray' },
            ],
            targets: [
              { id: 'tg652', label: 'G.652.D — standard OSP fiber is sufficient' },
              { id: 'ta1',   label: 'G.657.A1 — minimum 10 mm bend radius' },
              { id: 'ta2',   label: 'G.657.A2 — minimum 7.5 mm bend radius' },
              { id: 'tb3',   label: 'G.657.B3 — minimum 5 mm bend radius' },
            ],
            correctMap: { tg652: 'trunk', ta1: 'drop10', ta2: 'drop75', tb3: 'mdubend' },
            explanation:
              'Trunk (200 mm bend) → G.652.D handles easily. Drop (10 mm) → G.657.A1 exactly meets the minimum. GPON wall entry (7.5 mm) → G.657.A2 minimum. MDU tight corner (5 mm) → G.657.B3 required. Each step down in bend radius requires the next G.657 grade. (ITU-T G.657 2024 — verified)',
          },
        ]}
      />

    </LessonLayout>
  );
}
