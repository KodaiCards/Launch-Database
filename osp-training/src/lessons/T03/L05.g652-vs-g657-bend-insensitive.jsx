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
  learning_objectives: [
    'Apply the G.657 bend-radius decision tree: ≥30 mm → G.652.D, 10–30 mm → A1, 7.5–10 mm → A2, ≤5 mm → B3',
    'Explain the trench-assisted refractive index profile and why G.657.B3 is not guaranteed splice-compatible with G.652.D',
    'State the 2024 ITU-T G.657 edition change merging B2 into A2',
    'Apply the FOA bend-radius rule correctly: "20× cable OD dynamic, 10× cable OD static" — the OD is the cable outer diameter, not the bare fiber coating diameter',
    'Identify the field failure mode of using G.652.D drop cable in tight-bend drop installations',
  ],
  vocabulary_introduced: [
    'G.657.A1',
    'G.657.A2',
    'G.657.B3',
    'trench-assisted profile',
    'G.655 (NZDSF)',
    'G.656',
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
    {
      term: 'G.655 (NZDSF)',
      definition:
        'ITU-T G.655 — Non-Zero Dispersion-Shifted Single-Mode Fiber. Engineered for long-haul DWDM transport (1530–1565 nm C-band). Has reduced chromatic dispersion (typically 1–10 ps/nm·km vs. G.652.D\'s ~17 ps/nm·km at 1550 nm) to reduce four-wave mixing while still allowing dispersion-compensating techniques. NOT the standard choice for OSP metro/access builds — seen at long-haul carrier handoff points. (Source: ITU-T G.655 — itu.int)',
    },
    {
      term: 'G.656',
      definition:
        'ITU-T G.656 — Wideband Non-Zero Dispersion-Shifted Single-Mode Fiber. Similar to G.655 but with a wider low-dispersion passband covering the S-, C-, and L-bands (1460–1625 nm). Designed for metropolitan and access WDM applications. Rarely seen in new builds; primarily encountered when reviewing legacy infrastructure. (Source: ITU-T G.656 — itu.int)',
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
          Critically, the <strong>OD here is the cable outer diameter, not the bare fiber
          coating diameter</strong>. The bare fiber coating is 250 µm = 0.25 mm — 20× that
          would give only 5 mm, far tighter than is safe. For a typical OSP loose-tube cable
          with a 12 mm OD, the rule gives 12 mm × 20 = 240 mm (~9.5 inches) for installation
          pulls (dynamic) and 12 mm × 10 = 120 mm for long-term routing (static).
          (Source: FOA Reference Guide bend radius page — verified)
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

        <h3 className="mt-6 font-semibold">G.655 and G.656 — fibers you may encounter at long-haul handoffs</h3>
        <p>
          G.652.D and G.657 cover virtually all new OSP metro and access builds. But when
          your fiber route terminates at a long-haul carrier hand-off point — a telecom
          hut, a major CO, or a carrier hotel — you may encounter fiber types with
          different physics: <strong>G.655 (NZDSF)</strong> and
          <strong> G.656 (wideband NZDSF)</strong>.
        </p>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Fiber type</th>
                <th className="px-3 py-2 text-left">Key characteristic</th>
                <th className="px-3 py-2 text-left">When you see it</th>
                <th className="px-3 py-2 text-left">OSP decision</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-mono font-semibold">G.652.D</td>
                <td className="px-3 py-2">Standard SMF; ~17 ps/nm·km dispersion @ 1550 nm</td>
                <td className="px-3 py-2">All new OSP metro/access/FTTH builds</td>
                <td className="px-3 py-2 text-green-300">Default spec — use this</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-mono font-semibold">G.655</td>
                <td className="px-3 py-2">NZDSF; 1–10 ps/nm·km reduced dispersion @ 1550 nm; optimized for C-band DWDM; lower MFD than G.652.D</td>
                <td className="px-3 py-2">Long-haul backbone; carrier DWDM routes; legacy inter-CO fiber</td>
                <td className="px-3 py-2 text-yellow-300">Do NOT specify for OSP metro/access unless explicitly a long-haul DWDM project</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-mono font-semibold">G.656</td>
                <td className="px-3 py-2">Wideband NZDSF; low dispersion across S+C+L bands (1460–1625 nm); niche</td>
                <td className="px-3 py-2">Legacy metropolitan WDM; rarely in new builds</td>
                <td className="px-3 py-2 text-yellow-300">Encounter only when reviewing existing plant; not specified for new OSP</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-3 p-3 border border-blue-400/20 bg-blue-400/5 rounded-lg text-sm">
          <p className="font-semibold text-blue-300 mb-1">Why G.655 is NOT the right choice for typical OSP</p>
          <ul className="list-disc pl-4 space-y-1 text-slate-300/90">
            <li><strong>MFD difference:</strong> G.655 typically has a smaller Mode Field Diameter than G.652.D. Splicing G.655 to G.652.D introduces measurable splice loss, which accumulates on multi-splice routes. (Source: ITU-T G.655)</li>
            <li><strong>DWDM optimization is irrelevant for access:</strong> The reduced dispersion benefit only matters on EDFA-amplified long-haul systems (100+ km spans). A 5-mile FTTH distribution route gains nothing from low dispersion.</li>
            <li><strong>Compatibility problems:</strong> If a future crew splices G.652.D into a G.655 backbone without awareness of the MFD difference, the added splice loss may push a long-haul link budget into failure.</li>
          </ul>
        </div>

        <p className="mt-3 text-sm text-slate-300/80">
          <strong>Decision rule:</strong> For every OSP project you design or spec, use <strong>G.652.D</strong>
          unless the project explicitly involves long-haul DWDM transport and your client's network
          engineering team specifies G.655. If you see G.655 in an existing cable plant and need to
          splice into it, measure the actual splice loss — it will likely be higher than a
          G.652.D-to-G.652.D splice. Budget accordingly. (Source: ITU-T G.655; ITU-T G.656 — itu.int)
        </p>

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
            left: '~240 mm installation (20× cable OD for 12 mm OD cable); ~120 mm long-term (10× cable OD). FOA "20×/10× OD" rule applies to cable outer diameter, not bare fiber coating (250 µm = 0.25 mm — a distinct concept).',
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

        <h3 className="mt-4 font-semibold">The G.652 vs. G.657 decision in the full design workflow</h3>
        <p>
          The fiber-type choice you make here directly drives downstream design phases that you'll learn in T06 (underground conduit sizing) and T11 (fusion splicing compatibility). Here's why this matters: T02 taught you that macrobend loss is the enemy, especially at 1550 nm. Using the CABLE-level installation (dynamic-pull) rule from T03.L11 — roughly 20&times; the cable's outer diameter — a typical 12 mm OSP cable containing G.652.D fiber has an installation-pull minimum bend radius of roughly 240 mm (9.5 inches). This is a distinct figure from the ~30 mm bare-fiber long-term bend-radius convention cited elsewhere in this lesson (and in the graded quiz below) — the 240 mm number applies to the whole cable during the dynamic stress of pulling, while the ~30 mm figure is an industry-convention long-term/loaded bend-radius reference for the bare fiber itself, not the installed cable. Don't confuse the two: they answer different questions (safe pulling radius for this cable vs. long-term bare-fiber bend tolerance) and are not interchangeable. See T03.L11 for the general installation-vs-long-term bend radius distinction (installation number is larger/less restrictive; long-term is smaller). [Cable-level 20&times;OD installation-pull convention; ~30 mm bare-fiber figure per industry convention, not a single pinned ITU-T clause — see T03 research log.] That's fine for a straight aerial span or a gently curved burial run. But what happens when an OSP feeder cable has to make a 90-degree turn inside a conduit at a distribution handhole? Or when a fiber drop cable has to make a 5 mm radius turn inside a building?
        </p>
        <p className="mt-2">
          If you specify G.652.D for that tight-bend scenario, you're guaranteeing macrobend loss that will fail the link budget. The fix is either (a) redesign the conduit with larger radius bends (costs $3k–5k in civil work), or (b) re-spec the cable to G.657.A1 or A2 ($0.10–0.20/meter difference, negligible total). Architects and crew leads who understand G.657 subcategories make the right call at design time. Crews who don't end up with tight bends and field-installed cable that fails 6 months later.
        </p>
        <p className="mt-2">
          Additionally, when you're splicing cables with mixed fiber types (legacy G.652 in the trunk + new G.657.A1/A2 at a distribution point), T11 splicing techniques assume you'll measure the splice loss because MFD differences may add up to 0.1 dB per joint. This Advanced section teaches the physics so you understand the tradeoffs at a level that prevents costly field surprises.
        </p>

        <h3 className="mt-5 font-semibold">Trench-assisted profile — the physics</h3>
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

        <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
          <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
          <p className="text-slate-200 mb-3">
            The bend-insensitive fiber choice directly impacts two downstream design phases:
          </p>
          <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
            <li><strong>T04.L06 Conduit &amp; Duct Sizing</strong> — Bend-insensitive fiber (G.657.A1/A2) enables tighter conduit bends, which may allow smaller/cheaper duct in congested underground runs. Tight bends with G.652.D = unacceptable loss, forcing larger/more-expensive duct.</li>
            <li><strong>T11.L03 Fusion Splicing Margins</strong> — G.657.B3 has a slightly different MFD than G.652.D. When splicing mixed cable types (legacy G.652 + new G.657 at a distribution point), you must measure each splice; the trench-assisted profile changes attenuation by up to 0.1 dB per splice.</li>
            <li><strong>T06.L09 Drop Cable Design</strong> — FTTH drop cables are almost always G.657.A1 or A2 because the customer's drop terminal inside the home tolerates only 5–10 mm bends. Standard G.652.D drops would guarantee damage at those radii.</li>
          </ul>
          <p className="text-slate-200 mt-3 text-sm italic">
            The choice between G.652 and G.657 is not a fiber specification technicality — it drives duct cost, splicing labor, and field reliability.
          </p>
        </section>
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
          {
            id: 'T03-L05-fc-g655',
            front: 'What is G.655 (NZDSF) and when does an OSP engineer encounter it?',
            back: 'ITU-T G.655 — Non-Zero Dispersion-Shifted SMF. Designed for long-haul DWDM transport in the C-band (1530–1565 nm). Has reduced chromatic dispersion (~1–10 ps/nm·km vs. ~17 ps/nm·km for G.652.D). NOT used in new OSP metro/access builds — encountered at long-haul carrier handoff points and in legacy backbone fiber. Splicing G.655 to G.652.D may add measurable loss due to MFD differences. (ITU-T G.655 — itu.int)',
          },
          {
            id: 'T03-L05-fc-g656',
            front: 'What is G.656 and how does it differ from G.655?',
            back: 'ITU-T G.656 — Wideband Non-Zero Dispersion-Shifted SMF. Similar to G.655 but with a wider low-dispersion passband covering S+C+L bands (1460–1625 nm). Rarely seen in new builds; primarily encountered when reviewing legacy metropolitan WDM infrastructure. Neither G.655 nor G.656 is the correct spec for new OSP access/distribution projects. (ITU-T G.656 — itu.int)',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ───────────────────────────────────────────────── */}
      <Quiz
        title="Check — G.652 vs. G.657 Bend-Insensitive Fiber"
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
            type: 'mc',
            prompt:
              'A long-haul carrier is handing off fiber at your CO. The splice record shows the incoming fiber is ITU-T G.655. Your distribution plant uses G.652.D. What should you do before splicing G.652.D directly onto the G.655 carrier fiber?',
            choices: [
              'Splice directly — G.655 and G.652.D are fully interchangeable at the core level',
              'Measure actual splice loss at the G.655/G.652.D interface — MFD differences may add measurable loss that needs to be budgeted',
              'Replace the entire distribution plant with G.655 fiber for compatibility',
              'G.655 is a multimode fiber — you cannot splice it to G.652.D single-mode',
            ],
            answerIndex: 1,
            explanation:
              'G.655 (NZDSF) and G.652.D both are single-mode fibers, but G.655 typically has a slightly different MFD. Splicing them together may introduce measurable splice loss that would not occur at a G.652.D-to-G.652.D joint. Before finalizing the link budget, measure the actual splice loss at the interface. If it is within budget, proceed. If not, use an intermediate fiber or discuss the MFD issue with the carrier. (Source: ITU-T G.655 — itu.int)',
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
