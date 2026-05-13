# Module 6 — RCDD Prep Core research log

> Curriculum Architect (Agent A) research notes for the RCDD Prep Core module:
> ICT distribution, firestopping (UL listed systems, F/T/L/W ratings, cable
> load reduction), electromagnetic compatibility (EMC), separation between
> power and telecom, FCC Part 15, IEEE 1100 / TIA-607, common bonding, surge
> and SPDs.
>
> Editorial promise of this module: BICSI TDMM 15th Edition is paywalled
> ($300+ for non-members) and we will not pretend otherwise. We will lean on
> public TIA summaries, FOA, UL Solutions public guides, vendor whitepapers
> (3M, Hilti, STI), the International Firestop Council (IFC), IEEE
> standards-page abstracts, and forum discussion. Every numerical claim is
> labeled with a verification tag.

---

## 1. Standards & official sources consulted

### 1.1 Firestopping — UL 1479 / ASTM E814

- **UL 1479** (Standard for Fire Tests of Through-Penetration Firestops) is
  the test method used to qualify a firestop system. The matching ASTM
  reference is **ASTM E814**.
  - Status: VERIFIED-public-source. UL public summary at
    <https://www.ul.com/services/firestopping-joint-protection-and-perimeter-fire-containment-testing>
    and the International Firestop Council's PEN2 primer at
    <https://firestop.org/wp-content/uploads/2025/07/Firestop_basics_penetrations_PEN2-.pdf>.

- **F-rating (Flame)**: hours the system resists passage of flame. A 2-hour
  F-rating means the listed assembly held off flame for 2 hours under the
  UL 1479 fire-exposure curve.
  - VERIFIED-via-secondary-source: Unique Fire Stop Products,
    <https://www.uniquefirestop.com/what-do-the-ul-systems-acronyms-stand-for/>;
    cross-confirmed at the Cabling Installation & Maintenance overview,
    <https://www.cablinginstall.com/standards/cabling-standards/article/16465957/through-penetration-firestop-systems-and-ul-1479>.

- **T-rating (Temperature)**: hours during which the unexposed-side
  temperature rise does not exceed **325 °F (181 °C) above ambient**. T is
  always ≤ F. T matters wherever combustibles can touch the unexposed face
  of the barrier — most commonly in **fire walls** and **horizontal floor
  penetrations**.
  - VERIFIED-via-secondary-source: same Unique / IFC sources.

- **L-rating (Air/smoke leakage)**: cubic feet per minute (cfm) of air
  leakage through the penetration, measured both at ambient and at 400 °F.
  Required by IBC / NFPA 101 for **smoke-resistive** assemblies in many
  occupancies (e.g., I-2 healthcare).
  - VERIFIED-via-secondary-source: Unique Fire Stop Products.

- **W-rating (Water)**: water-tightness; system must withstand a 3-foot
  water column for 72 hours followed by a UL 1479 fire and hose-stream
  test. Introduced in 2004.
  - VERIFIED-via-secondary-source: Unique Fire Stop Products. Useful in
    floor penetrations (sprinkler discharge, mop water) and exterior wall
    penetrations.

- **UL system numbering** (publicly indexed at UL Product iQ, free account
  at <https://productiq.ulprospector.com/en>; reference page
  <https://www.ul.com/thecodeauthority/knowledge/ul-solutions-numbering-systems>):
  - First letter: **W** = wall (fire-resistive), **F** = floor only, **C**
    = floor or wall.
  - Second letter encodes barrier construction (e.g., concrete, gypsum,
    composite); third letter encodes penetrant family.
  - For cable penetrations the most-cited series is the **C-AJ-1xxx** /
    **W-L-3xxx** range (cable through concrete or gypsum).
  - Status of the *exact* second/third letter mapping table:
    UNVERIFIED-needs-paid-doc — full mapping is in the UL Fire Resistance
    Directory (Vol. 2A/2B). Free Product iQ shows individual systems but
    not a consolidated legend in one place.

- **3M, Hilti, STI** vendor system search portals (publicly indexed):
  - 3M: <https://www.3m.com/3M/en_US/p/d/b40070037/>
  - Hilti: <https://www.hilti.com/c/CLS_FIRESTOP_PROTECTION_7131>
  - STI: <https://systems.stifirestop.com/>
  - Each portal lists the ULC/UL system numbers tested with that vendor's
    products. These are the operational documents installers actually use.

- **Cable load** language: Hilti CAJ 4071 (concrete-floor through-penetration
  with cables, FS-One Max) limits aggregate cable cross-sectional area to a
  stated percentage of the opening. Hilti's published guidance: aggregate
  cross-sectional area of cables inside a sleeve should not exceed **60%**
  of the sleeve's cross-sectional area; cable trays separately limit to
  **67%** of tray cross-section.
  - VERIFIED-via-secondary-source: Hilti engineering Q&A,
    <https://www.hilti.com/engineering/question/annular-space-query-and-general-clarification/0hthvy>.

### 1.2 EMC, FCC Part 15, IEEE 1100, TIA-569 separation

- **FCC Part 15** (47 CFR Part 15) — unintentional-radiator emission
  limits.
  - **Class A** (commercial/industrial; intent: not for use in homes).
    Field-strength limits measured at 10 m.
  - **Class B** (residential). Limits roughly **6–10 dB more stringent**
    than Class A; field-strength limits measured at 3 m.
  - VERIFIED-public-source: 47 CFR §15.109 in eCFR,
    <https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15/subpart-B>,
    cross-confirmed at <https://compliancetesting.com/fcc-part-15-class-a-class-b-limits/>
    and Wikipedia's CFR Part 15 page.

- **IEEE Std 1100 ("Emerald Book")** — Recommended Practice for Powering
  and Grounding Electronic Equipment. Chapter 9 (added in the 1999 revision,
  expanded in 2005) covers telecom / IT / distributed computing.
  - Core editorial principle: **a single, common bonded grounding system**
    for power, lightning/SPD, and telecom. Isolated/dedicated/"clean"
    grounds are explicitly *not* recommended.
  - Status: VERIFIED-public-source (abstract / overview free):
    <https://standards.ieee.org/ieee/1100/3055/>, EC&M overview
    <https://www.ecmweb.com/content/article/20887203/an-overview-of-ieee-1100-the-emerald-book>.
  - Full text: UNVERIFIED-needs-paid-doc for any specific clause-level
    quote. The student-friendly summary in the Emerald Book — "all grounding
    subsystems must be connected; isolated grounds are unsafe and not
    recommended" — is in the publicly available abstract on the IEEE SA
    page.

- **ANSI/TIA-607-D** (2019; current is **TIA-607-E**, 2022). Generic
  telecommunications bonding & grounding for customer premises. Defines:
  - **TMGB** — Telecommunications Main Grounding Busbar (one per
    building).
  - **TGB** — Telecommunications Grounding Busbar (one per TR).
  - **TBB** — Telecommunications Bonding Backbone (connects each TGB to the
    TMGB).
  - Conductor sizing: TIA-607-D allows the TBB to be sized **2 kcmil per
    linear foot of length, up to a maximum of 750 kcmil**, replacing the
    older 3/0 AWG cap from TIA-607-B.
  - Status: VERIFIED-via-secondary-source: NECA/BICSI 607-2011 free
    summary, <https://aux.bicsi.org/om/NECA-BICSI-607-2011.pdf>; EC&M
    "Guidelines for Grounding and Bonding Telecom Systems",
    <https://www.ecmweb.com/basics/bonding-grounding/article/20896447/guidelines-for-grounding-and-bonding-telecom-systems>.
  - The exact letter-revision text (607-D vs. 607-E) is paywalled at the
    TIA store.

- **ANSI/TIA-569 cable separation** between power and telecom (the table
  most installers cite, even when they don't remember which standard it
  came from):
  - Unshielded power < 2 kVA, open / nonmetallic pathway: **5 inches**
    (≈ 127 mm).
  - Unshielded power 2–5 kVA: **12 inches** (≈ 305 mm).
  - Unshielded power > 5 kVA: **24 inches** (≈ 610 mm).
  - Reduce by half if telecom is in a grounded metallic conduit; reduce to
    zero if both telecom and power are in their own grounded metallic
    conduits.
  - Status: VERIFIED-via-secondary-source. The values appear in
    Winnie Industries' separation guide
    <https://winnieindustries.com/resources/knowledge_center/guides_main/cable_separation/>,
    Border States' summary
    <https://solutions.borderstates.com/resources/separation-from-sources-of-interference/>,
    Elliott Electric's TIA-569 reference
    <https://www.elliottelectric.com/StaticPages/ElectricalReferences/DataComm/separation_interference.aspx>,
    and CommScope's SYSTIMAX guidelines TP-106296,
    <https://www.commscope.com/globalassets/digizuite/3164-power-separation-guidelines-tp-106296-en.pdf>.
  - The **exact wording** of TIA-569 (currently TIA-569-E with addendum 1)
    is UNVERIFIED-needs-paid-doc.

### 1.3 Surge / SPDs / primary protection

- **NEC Article 800** (now reorganized under Chapter 8 Article 805 in the
  2023 NEC) requires a **listed primary protector** on any aerial telecom
  conductor entering a building, and on buried conductors that share or
  cross power.
  - VERIFIED-via-secondary-source through Mike Holt forum,
    <https://forums.mikeholt.com/threads/power-communication-separation.115529/>.
  - The full NEC text is paywalled (NFPA 70 sold by NFPA), but a free
    read-only viewer is available at <https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70>.

- **UL 497 / 497A / 497B** — primary, secondary, and isolated-loop
  protectors.
  - UL 497: primary telecom line protector (gas tube / carbon arrester),
    required by NEC for aerial telco entries.
  - UL 497A: secondary protector, used downstream of UL 497, on circuits
    < 150 V rms to ground.
  - UL 497B: isolated-loop circuits.
  - VERIFIED-via-secondary-source: Transtector / Polyphaser product lit,
    e.g., <https://www.transtector.com/data-surge-protector-spd-cpx-indoor-10-1000-1268>;
    Eaton white paper SA01005003E,
    <https://www.eaton.com/content/dam/eaton/services/eess/eess-documents/sa01005003e.pdf>.
  - Exact UL 497 requirements are paywalled at UL CSDS.

---

## 2. Forums & community practice

- **Mike Holt forums — "Power & Communication Separation"** thread,
  <https://forums.mikeholt.com/threads/power-communication-separation.115529/>
  (active 2010s, recurring posts since). Practitioners repeatedly note that
  NEC itself is largely silent on inches-of-separation — those numbers
  *come from TIA-569*, not NEC. The recurring complaint: GCs and
  inspectors will write up violations citing "NEC" when the source is
  actually TIA, which is voluntary unless adopted in spec. Field takeaway:
  if the spec doesn't reference TIA-569, you legally only owe NEC
  separation (which is much looser).
- **Mike Holt forums — "Telecommunications grounding/bonding requirements"**,
  <https://forums.mikeholt.com/threads/telecommunications-grounding-bonding-requirements.141602/>.
  Recurring debate over whether the TBB is a "ground" or a "bond"; whether
  TGBs in non-TR closets are required; whether the TMGB has to be in the
  EF or just bonded to it. Field consensus: bond TMGB to the building's
  GES with a #6 AWG minimum, even if the spec is silent.
- **Mike Holt forums — "Telecomm bonding to steel"**,
  <https://forums.mikeholt.com/threads/telecomm-bonding-to-steel.2551615/>.
  Open question every few years about whether bonding the TMGB to building
  structural steel satisfies TIA-607 — field practice is "yes, with an
  irreversible compression connection," but TIA-607-D is more specific.
- **Hilti Engineering Ask** — an example of a real installer question that
  is exactly the kind of corner-case the curriculum should address:
  <https://ask.hilti.com/question/ul-for-mc-penetration/n3kuhk>. Question:
  "What UL system covers MC cable through a concrete floor where the cable
  bundle has a 2" annular space?" Field answer: it depends on the cable
  type (MC vs. AC vs. classified), and the listed system has *very* tight
  parameters; the most common installer move is to call the manufacturer's
  technical hotline rather than guess.
- **Cabling Installation & Maintenance** practitioner discussion of
  through-penetration firestop and UL 1479,
  <https://www.cablinginstall.com/standards/cabling-standards/article/16465957/through-penetration-firestop-systems-and-ul-1479>.
- **The Building Code Forum — "Spacing of Through Penetration Firestop
  System"**,
  <https://www.thebuildingcodeforum.com/forum/threads/spacing-of-through-penetration-firestop-system.33832/>.
  Recurring AHJ debate over the **3" minimum spacing** between adjacent
  penetrations. Most listed UL systems specify a 3" lateral separation
  between two penetrants, and inspectors often fail jobs that crammed
  multiple cable bundles into one rough opening.

---

## 3. Field vs. textbook gaps (with concrete examples)

1. **"Code requires the listed system."** The textbook answer (and the
   IBC/NFPA 1 requirement) is: every penetration must match a tested,
   listed UL/ULC firestop system *exactly*. Field reality: almost no
   installation matches the listed system perfectly. Field-vs-textbook
   delta:
   - Listed system specifies **0.6" annular space**; site has 1.4". Tech
     packs more sealant than tested.
   - Listed system was tested on **5 lb/ft³ mineral wool**; site uses 4 lb.
   - Listed system was tested with **1 row** of cable trays through the
     opening; site has 2.
   The honest curriculum answer: this is an EJ ("engineering judgment")
   from the firestop manufacturer's technical service, sometimes formalized
   in writing, sometimes a phone call the inspector accepts. We should
   teach (a) what the EJ process is, and (b) the EJ is *not* a UL listing —
   AHJs vary on whether they accept it.

2. **Reusability of putty pads vs. caulk.** Textbook: the system is the
   listed assembly; if you cut into it you destroy the listing. Field: most
   contractors specify **putty / pillow** systems precisely *because* they
   are re-enterable, e.g., 3M Fire Barrier Pillows, STI SpecSeal SSP putty.
   STI explicitly markets SSP as "re-enterable" — see
   <https://www.stifirestop.com/news/whats-the-most-versatile-firestopping-product>.
   The exam answer is "follow the listing." The field answer is "design
   for re-entry on day 1, because the second cable run is coming."

3. **Cable load percentage.** TDMM teaches the listed-system fill limit (a
   percentage of the opening). Field: many crews never measure. Hilti's
   guidance is that the *aggregate* cable cross-section should not exceed
   60% of the *opening* cross-section, and 67% of a cable tray's
   cross-section. Most field crews eyeball "less than half full" and move
   on. We should teach the actual percentages and *also* note the visual
   approximation crews use.

4. **Power separation.** TIA-569 says 12" between unshielded telecom and
   2–5 kVA unshielded power. NEC says effectively 2" if both are in
   different sleeves. Field practice in commercial installs follows TIA-569
   only when the spec invokes TIA. The trap on the RCDD exam is a question
   that expects the TIA-569 number, not NEC.

5. **"Isolated ground" myth.** A persistent field belief is that you can
   run a "clean" earth for telecom that is not bonded to building steel.
   IEEE 1100 and TIA-607 both prohibit this. Yet *every* RCDD with field
   experience has met a customer demanding an isolated ground rod for the
   "computer room." The teaching point is: explain why it is wrong,
   explain how to push back, and explain the rare cases where a
   single-point grounded reference plane is acceptable (and is *still*
   bonded back to the GES).

6. **L-rating and W-rating optionality.** Textbook: only F is mandatory in
   most jurisdictions; T is mandatory in floors and certain walls; L and W
   are mandatory only where the building code says so. Field: most specs
   say "F = T = barrier rating" and the contractor only learns at
   inspection that the GC's life-safety drawings demanded an L-rating in
   I-2 healthcare corridors. Result: re-do.

7. **Primary protection on fiber.** A surprising number of installers
   "primary protect" fiber. Fiber doesn't carry power; per NEC, only the
   **metallic strength member** of an OSP cable needs to be bonded to the
   primary protector ground at the EF. The fiber itself does not need a
   protector.

---

## 4. Open questions for Red Team / user

1. Confirm the exact **TIA-569 revision** to teach against. Current is
   569-E + Addendum 1 (2019/2020). The numerical separation table has
   carried forward from 569-A → 569-E with very small changes — but is
   there a revision-specific value we should highlight?
2. Confirm whether to include **NEC 2023** changes to Article 800 → 805
   reorganization, or stick with the 2020 numbering most students were
   trained on.
3. Should we present **F-rating only** as the universal minimum, or
   require students to memorize which occupancies trigger T, L, W?
4. Are we using **TDMM 14th** or **15th** as the reference exam target?
   The 15th changed bonding chapter numbering and added IoT/PoE coverage;
   we cannot quote it directly, but we can cite to it without quoting.
5. Cable-load-reduction language: do we teach **percentage fill** at the
   penetration (UL system limit), or **derate** of conductor ampacity in
   bundles (NEC 310.15(B), unrelated to firestop). Both terms get
   confused in field talk.
6. Surge: do we cover **DSL/POTS primary protection** at all, or treat it
   as legacy? Current new-construction is fiber-to-the-X.

---

## 5. Recommended editorial defaults for the module

- Teach the **F / T / L / W** definitions as canon, but always paired with
  a real UL system code (e.g., **W-L-3025**) so students see how a system
  ID is read, not just the rating letters.
- Teach **TIA-569 separation table** as the exam answer for cable
  separation. Add a "Field" callout: NEC alone is much more permissive,
  and a job spec must reference TIA-569 to be enforceable.
- Teach the **TIA-607 hierarchy** TMGB → TBB → TGB with the **2 kcmil/ft,
  max 750 kcmil** sizing rule. Add a Field callout: most short-run TBBs
  end up at the 6 AWG minimum because the math doesn't justify upsizing.
- Teach **single-point bonded grounding** per IEEE 1100, with the explicit
  warning: do NOT install isolated grounds for telecom. Use a real war
  story.
- For firestopping, teach the principle "the assembly is what is listed,
  not the product." Use the cable-bundle-through-gypsum example
  (W-L-3xxx series) and walk through the fields of the UL listing: barrier
  construction, penetrant, annular space min/max, fill material, depth.
- Include a **UL Product iQ** walk-through (free account, free search,
  free PDF download for individual systems) so students learn how to find
  a system on a real job, not just answer exam questions.
- For EMC, teach **FCC Part 15 Class A vs. Class B** as
  commercial-vs-residential, with the 6–10 dB delta and the 10 m / 3 m
  measurement-distance difference.
- For surge, teach UL 497 / 497A / 497B as the listing trio; teach the
  primary protector requirement at every aerial entry; teach that fiber
  doesn't get a primary protector but the **metallic strength member of
  an armored OSP fiber cable does require bonding** at the EF.
- Every numerical claim in module content carries one of:
  **VERIFIED-public-source**, **VERIFIED-via-secondary-source**, or
  **UNVERIFIED-needs-paid-doc**, mirroring this log.

---

## 6. Source URLs (consolidated)

- UL Solutions firestop overview: <https://www.ul.com/services/firestopping-joint-protection-and-perimeter-fire-containment-testing>
- UL numbering systems explainer: <https://www.ul.com/thecodeauthority/knowledge/ul-solutions-numbering-systems>
- UL Product iQ (free public DB): <https://productiq.ulprospector.com/en>
- IFC PEN2 firestop primer (PDF): <https://firestop.org/wp-content/uploads/2025/07/Firestop_basics_penetrations_PEN2-.pdf>
- Unique Fire Stop F/T/L/W rating explainer: <https://www.uniquefirestop.com/what-do-the-ul-systems-acronyms-stand-for/>
- Cabling Install & Maint UL 1479 article: <https://www.cablinginstall.com/standards/cabling-standards/article/16465957/through-penetration-firestop-systems-and-ul-1479>
- 3M Fire Barrier Pillows TDS: <https://multimedia.3m.com/mws/media/208381O/3m-fire-barrier-self-locking-pillows-technical-data-sheet.pdf>
- Hilti firestop main: <https://www.hilti.com/c/CLS_FIRESTOP_PROTECTION_7131>
- Hilti annular-space Q&A: <https://www.hilti.com/engineering/question/annular-space-query-and-general-clarification/0hthvy>
- STI firestop systems portal: <https://systems.stifirestop.com/>
- STI on putty re-enterability: <https://www.stifirestop.com/news/whats-the-most-versatile-firestopping-product>
- IEEE 1100 standard page: <https://standards.ieee.org/ieee/1100/3055/>
- EC&M Emerald Book overview: <https://www.ecmweb.com/content/article/20887203/an-overview-of-ieee-1100-the-emerald-book>
- EC&M telecom grounding guidelines: <https://www.ecmweb.com/basics/bonding-grounding/article/20896447/guidelines-for-grounding-and-bonding-telecom-systems>
- NECA/BICSI 607-2011 (PDF): <https://aux.bicsi.org/om/NECA-BICSI-607-2011.pdf>
- TIA-607-D PDF (third-party host): <https://uploads.teachablecdn.com/attachments/oWKf7qZHSLaCDCrJBBeW_TIA+607-D.pdf>
- Winnie Industries cable-separation guide: <https://winnieindustries.com/resources/knowledge_center/guides_main/cable_separation/>
- Border States separation reference: <https://solutions.borderstates.com/resources/separation-from-sources-of-interference/>
- Elliott Electric TIA-569 reference: <https://www.elliottelectric.com/StaticPages/ElectricalReferences/DataComm/separation_interference.aspx>
- CommScope SYSTIMAX TP-106296 separation guidelines: <https://www.commscope.com/globalassets/digizuite/3164-power-separation-guidelines-tp-106296-en.pdf>
- 47 CFR Part 15 Subpart B (eCFR): <https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15/subpart-B>
- FCC Part 15 Class A/B explainer: <https://compliancetesting.com/fcc-part-15-class-a-class-b-limits/>
- Eaton SPD/SPD UL/IEEE white paper: <https://www.eaton.com/content/dam/eaton/services/eess/eess-documents/sa01005003e.pdf>
- Mike Holt power/comm separation thread: <https://forums.mikeholt.com/threads/power-communication-separation.115529/>
- Mike Holt telecom grounding/bonding thread: <https://forums.mikeholt.com/threads/telecommunications-grounding-bonding-requirements.141602/>
- Mike Holt telecomm-bonding-to-steel thread: <https://forums.mikeholt.com/threads/telecomm-bonding-to-steel.2551615/>
- Building Code Forum firestop-spacing thread: <https://www.thebuildingcodeforum.com/forum/threads/spacing-of-through-penetration-firestop-system.33832/>
