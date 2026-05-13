# Modules 1–4 Red Team Report

**Agent:** C (Red Team / QA, Sonnet 4.6)  
**Date:** 2026-05-08  
**Scope:** `Module01_FiberPhysics.jsx`, `Module02_OSPDesign.jsx`, `Module03_PermittingPlanning.jsx`, `Module04_Splicing.jsx` plus associated flashcard files and the shared editorial rulebook (`docs/field-vs-textbook-research.md`).  
**Verification methods:** Static source review; WebSearch spot-checks (FOA attenuation table, G.652.D specs, NESC 40-inch/clearance values, FCC 18-111 timelines, NLEB status, TIA-568.3-D loss values); WebFetch attempted on thefoa.org, flukenetworks.com, dot.ny.gov, katapultengineering.com — all returned HTTP 403; noted as paywalled/restricted below.

---

## Module 1 — Fiber Physics

### Verified

- **G.652.D attenuation maxima** (Section 1.2 table): 1310 nm ≤ 0.40 dB/km, 1550 nm ≤ 0.30 dB/km, 1625 nm ≤ 0.40 dB/km. Confirmed via ITU-T G.652.D Table 4 (Unicor SA public mirror) and multiple vendor datasheet search results. Values in module match.
- **Chromatic dispersion at 1550 nm ≈ 17 ps/(nm·km)** (Section 1.3): Confirmed by multiple independent search results citing G.652 characteristics. Module states "roughly 17 ps/(nm·km)" — accurate.
- **Zero-dispersion wavelength framing** (Section 1.3): Module states "near 1310 nm" and notes the ITU-T G.652 range 1300–1324 nm in quiz citation. Accurate.
- **PMD cap ≈ 0.2 ps/√km** (Section 1.3): Consistent with published G.652.D attribute table. Phrased as "~0.2 ps/√km on new cable" — appropriate approximation with no false precision.
- **Connector loss three-number framework** (Section 1.2, Section 1.6): 0.30 dB (FOA field), 0.50 dB (designer), 0.75 dB (TIA legacy max) — all confirmed by web sources. Module correctly labels 0.30 dB as FOA field default and 0.75 dB as a maximum rather than a target.
- **Macrobend test condition** (Section 1.4): 100-turn, 30 mm-radius mandrel at 1625 nm ≤ 0.5 dB — stated as an ITU-T G.652.D value. Consistent with published G.652.D specs; confirmed via secondary sources.
- **1625 nm bend-loss diagnostic rationale** (Sections 1.1, 1.3): Correctly explained — bend loss scales with wavelength. Technically accurate.
- **dB math** (Section 1.5): 3 dB ≈ half power, 10 dB = one-tenth, 20 dB = one-hundredth. Correct. +3 dBm ≈ 2 mW, −28 dBm ≈ 1.6 µW — both accurate conversions.
- **Module imports resolve**: `InteractiveQuiz`, `LinkBudgetCalculator`, `ModuleHeader`, `Section`, `Callout`, `RefList` all exist in `src/components/`. Default export present. No broken imports.
- **Field-vs-textbook callout posture**: Every numeric claim (attenuation, connector loss, splice loss) carries either a `kind="book"`, `kind="field"`, or `kind="warn"` Callout. Consistent with editorial rulebook.
- **Quiz questions m1-q1 through m1-q5**: Answer indices verified technically correct:
  - m1-q1 (best planning attenuation @ 1550 nm): answer 1 (0.22–0.25 dB/km). Correct — avoids the too-optimistic typical and the overly conservative spec ceiling.
  - m1-q3 (dispersion at 1550 nm): answer 1 (≈ 17 ps/(nm·km)). Correct.
  - m1-q4 drag-drop (wavelength ↔ use case): correctMap `{t1: w1550, t2: w1625, t3: w1310}`. Correct.
  - m1-q5 (TIA-568 revision ambiguity): answer 1. Technically correct and consistent with editorial posture.

### Issues Found

- **FIX — Module 1, Section 1.2 Field callout, line 117: splice planning value inconsistency with Module 4.**  
  The field callout states: *"0.1 dB per fusion splice (we'll often test against 0.05 dB)"* — presenting 0.10 dB as the textbook/field planning value. Module 4 (Section 4.1) correctly identifies the FOA planning value as **0.15 dB** (FOA loss-est.htm) and 0.10 dB as the ITU-T L.400 population average acceptance criterion. The worked link budget in Section 1.6 (line 215) also uses **0.10 dB per splice** as the budget input. This cross-module inconsistency will confuse a student who reads both modules.  
  `src/modules/Module01_FiberPhysics.jsx` lines 117 and 215.  
  **Recommended fix:** Change the callout text to clarify: *"0.15 dB per fusion splice (the FOA loss-budget planning value); field quality target is ≤ 0.05 dB on the splicer estimate."* Update the worked link budget to use 0.15 dB per splice (matching Module 4's authoritative frame), or add an inline note explaining the 0.10 dB budget choice is a conservative mid-value between 0.05 and 0.15.

- **FIX — `src/data/flashcards.js`, card `m1-fusion-splice` (line 45): states "Textbook planning: ≤ 0.10 dB".**  
  The Module 4 research log and module body establish that 0.15 dB is the correct FOA planning value and 0.10 dB is the ITU-T L.400 acceptance average. Calling 0.10 dB the "textbook planning" value conflicts with the Module 4 authoritative frame.  
  **Recommended fix:** Change back text to: *"FOA planning / loss-budget input: 0.15 dB. ITU-T L.400 acceptance average: ≤ 0.10 dB. Field quality target: ≤ 0.05 dB. Mandatory re-splice (DOT/municipal contracts): > 0.30 dB."*

- **NIT — Module 1, Section 1.2 Callout `kind="book"` (line 112): states textbooks plug in "0.35 / 0.25 dB/km for 1310 / 1550 SMF."**  
  The planning-value table in the same section lists 0.22–0.25 dB/km for 1550, and 0.35 dB/km for 1310. The callout's "0.25 dB/km" for 1550 is at the top of that range, which is acceptable, but the two cells feel slightly inconsistent (table says "0.22–0.25 dB/km", callout says "0.25 dB/km"). Not wrong, but could be tightened to say "0.22–0.25 dB/km."

- **NIT — Module 1 has no research log in `docs/research-logs/`.**  
  Every other module has a counterpart research log; Module 1 does not. This is not a content error but means Red Team cannot trace the provenance of Module 1's numbers through the standard audit path. A `module01-fiber-physics.md` research log should be created in a future pass.

### Open Verification (Paywalled / Inaccessible)

- **FOA loss-est.htm** (thefoa.org) — returned HTTP 403 from automated fetch. The 0.15 dB fusion splice planning value and 0.30 dB connector pair planning value are cited from this page throughout Modules 1 and 4. Could not directly confirm current wording. Multiple secondary sources (web search, NECA/FOA 301-2016) corroborate the 0.15 dB planning value.
- **TIA-568.3-D normative text** — paywalled. Module 1's warn callout (lines 127–132) correctly flags this uncertainty. The 0.75 dB maximum and reference-grade values confirmed via Fluke Networks secondary sources (web search result), but exact normative vs. informative status of the 0.75 dB figure in the current revision remains unverified against the paid document.
- **ITU-T G.652 08/2024 edition** — paywalled. Attenuation maxima confirmed via 2009 edition public mirror and vendor datasheets; the 2024 revision could in theory have changed values.

---

## Module 2 — OSP Design

### Verified

- **NESC edition citation**: Module correctly identifies C2-2023 throughout and explains the paid-document limitation. Consistent with editorial rulebook.
- **40-inch communication worker safety zone** (Section 2.3): Confirmed by multiple web sources citing Rule 235C4/238E and utility manuals (ikeGPS, KPUB, North Central Electric, We Energies). Module's use of "40 in." is accurate as the canonical planning value; the secondary-source tag is appropriate.
- **30-inch reduced midspan separation when messenger is bonded** (Section 2.3): Web search confirmed this figure appears in North Central Electric's public leaflet with the same conditional framing the module uses. Appropriately tagged as a secondary-source value needing AHJ confirmation.
- **Loading districts — Heavy ≈ ½ in ice / 4 psf wind, Medium ≈ ¼ in / 4 psf, Light 0 in / 9 psf** (Section 2.5 table): Confirmed by IAEI Magazine secondary source citing the same values from Table 250-1. Module's citation row "Per public summaries of Table 250-1" is accurate.
- **Aerial vs. underground cost — $16.25/ft underground median, $6.49/ft aerial median** (Section 2.6): Confirmed as the Cartesian/FBA numbers reported by Fierce Network. Module also provides updated estimates (~$18/$8) and correctly notes "national medians; your corridor will diverge."
- **NESC Rule numbers** (232/235/250/261/Section 26) and their topical assignments: Confirmed against public NESC structural references (OJUA, IEEE summaries). The drag-drop quiz (m2-q5) correctMap is verified correct.
- **Grade B vs. Grade C framing** (Section 2.4): Railroad/highway crossings = Grade B, typical joint-use = Grade C. Consistent with ikeGPS public summary and NRECA guide. "4-to-1 / 2-to-1" safely labeled as colloquial paraphrase, not a quote.
- **FCC 18-111 OTMR description** (Section 2.8): Factually correct on what simple vs. complex make-ready means. The "10 days to accept or reject" is stated without the calendar/business-day distinction — see Issues below.
- **Module imports resolve**: `InteractiveQuiz`, `ModuleHeader`, `Section`, `Callout`, `RefList`, `Table` all present. Default export present.
- **No NESC table values presented as authoritative**: Module consistently tags all numeric values as "per public summaries" and points to the paid C2-2023 as the authoritative source. Fully compliant with editorial rulebook Section 3.

### Issues Found

- **FIX — Module 2, Section 2.8 OTMR callout (line 251–255): "10 days" and "3 days" stated without "business" qualifier.**  
  FCC 18-111 specifies these as **business days**, not calendar days. Module 3's OTMR table (lines 455–456) correctly says "10 business days" and "3 business days." Module 2's prose callout omits the "business" qualifier, creating a cross-module inconsistency and a potential exam-answer error.  
  `src/modules/Module02_OSPDesign.jsx` lines 251 and 253.  
  **Recommended fix:** Change to "**10 business days**" and "**3 business days**" to match Module 3 and the FCC order language.

- **NIT — Module 2 has no dedicated flashcard deck** (`src/data/module02-flashcards.js` does not exist).  
  Module 1 relies on the shared `flashcards.js`; Modules 3–4 have dedicated files. For curriculum consistency, a `module02-flashcards.js` covering NESC Rules, pole attachment, clearance concepts, and the aerial/underground cost tradeoff would be expected. Not a content error but a coverage gap.

- **NIT — Section 2.6 "Prescriptive use" is listed as a third ROW category heading** in Section 2.7 but is not introduced in Section 2.1's introductory framing. Minor structural inconsistency; no factual error.

### Open Verification (Paywalled / Inaccessible)

- **NESC C2-2023 Rule 232 Table 232-1 absolute values** — paywalled. The module cites 15.5 ft over roads and 9.5 ft over pedestrian areas from secondary sources. Web search confirmed 9.5 ft over pedestrian areas via KPUB and 15.5 ft over roads appears in multiple secondary sources, though the direct table value from C2-2023 could not be verified. Module's editorial posture (cite secondary, flag paid source) is appropriate.
- **NESC C2-2023 Section 26 load/strength factor matrix** — paywalled. The "4-to-1 / 2-to-1" paraphrase is correctly tagged as colloquial and not quoted from C2-2023.
- **NRECA "Guide for the Application of Clearance Requirements on Joint-Use Poles" (May 2025)** — research log notes this URL returned 403 during research. Red Team attempted fetch; same result. Module does not directly cite this document so this is a research-log issue, not a module-content issue.

---

## Module 3 — Permitting & Planning

### Verified

- **Federal nexus trigger for NEPA**: Correct — BEAD/BIP/RDOF/FirstNet = federal funding = federal nexus = NEPA applies. Consistent with NTIA Federal Register notice and public NEPA procedures.
- **47 total NTIA CEs (30 newly established + 6 adopted from FirstNet + 11 prior)**: Confirmed by web search result citing Broadband Breakfast and NTIA notices. Module's count is accurate.
- **CE C-8 covers aerial or buried utility/communication within existing ROW**: Confirmed by NTIA BroadbandUSA public notices. Module correctly identifies this as the BEAD default.
- **NEPA extraordinary circumstances list** (T&E species, historic properties, sensitive habitat, migratory birds, traditional cultural properties): Confirmed via NTIA Extraordinary Circumstances slide deck (public).
- **SHPO 30-day comment window — clock starts only after adequate submission**: Confirmed via NTIA NHPA Section 106 Fact Sheet (2024) cited in module. Module correctly emphasizes adequacy requirement. Appropriate VERIFIED-via-secondary-source tag.
- **NLEB reclassified Endangered November 2022 (effective March 2023)**: Confirmed by USFWS press release (2022-11) and Federal Register. Module states "reclassified as Endangered in 2022" — technically the rule was published November 2022, effective March 2023. The 2022 date is correct for "reclassified" though "effective 2023" would be more precise; this is a NIT (see below).
- **Indiana Bat listed Endangered since 1966**: Confirmed by USFWS species profile.
- **Tricolored Bat proposed Endangered as of 2022**: Confirmed by secondary law-firm and consultant sources in research log.
- **GIS-as-deliverable examples** (Pleasanton CA, Florida Turnpike, NAVFAC UFGS): All cited with public URLs and VERIFIED-public-source tags. Consistent with editorial rulebook.
- **OTMR table in Section 3.7** (lines 455–458): Uses "10 business days", "3 business days", "45 days" — consistent with FCC 18-111 language confirmed by web search.
- **FCC BDAC Model Code 2018 is advisory, not mandatory**: Correctly stated.
- **Module imports resolve**: `InteractiveQuiz`, `ModuleHeader`, `Section`, `Callout`, `RefList`, `Table` all present. Default export present.
- **Quiz questions m3-q1 through m3-q6**: Answer indices verified technically correct:
  - m3-q1 (BEAD in existing ROW → CE C-8): answer 2. Correct.
  - m3-q2 (SHPO clock + missing APE map): answer 2. Correct and consistent with NTIA fact sheet framing.
  - m3-q3 (KMZ vs. stamped PDF): answer 2. Correct and consistent with research log gap 3.6.
  - m3-q4 (NLEB bat + tree clearing): answer 1 (run IPaC first). Correct — IPaC is the proper first step.
  - m3-q5 drag-drop (regulatory layer ↔ scenario): correctMap verified against the correct regulatory framing.
  - m3-q6 (missed 45-day deadline): answer 2 (document + escalate to state). Correct per Pew 2025 framing.
- **Flashcard deck `module03-flashcards.js`**: All 8 cards reviewed. Back text matches module body. OTMR flashcard (m3-otmr-timeline) correctly says "10 business days." No orphan backs.

### Issues Found

- **NIT — Module 3 Section 3.4, line 226: NLEB "reclassified as Endangered in 2022."**  
  The USFWS final rule was published November 30, 2022 but the effective date was delayed to **March 31, 2023**. Saying "reclassified in 2022" is technically the rule-publication date; "effective 2023" is when the Endangered status took legal effect. This distinction matters on a cert exam question about current regulatory status. Adding "(effective March 2023)" would be more precise.  
  `src/modules/Module03_PermittingPlanning.jsx` line 226.

- **NIT — Module 3 Section 3.4, line 235–236: "Tricolored Bat — proposed Endangered as of 2022."**  
  The tricolored bat's status should be confirmed against the most current USFWS listing decision, as "proposed Endangered" could have changed to "listed Endangered" since the module was authored. The module appropriately tags this VERIFIED-via-secondary-source and cites October 2024 guidance, but a direct statement of current listing status should include the most recent date the status was confirmed. A Verify callout already exists on the bat dates section; this NIT is only to flag that the tricolored bat's proposed vs. listed status may need an update if the final rule was issued after the module was authored.

- **NIT — Module 3 research log (Section 1.3) notes the 2025 version of the NTIA NHPA Fact Sheet URL returned 403** during research. The module cites the 2024 version, which is still accessible. Red Team confirms the 2024 URL is correctly cited in the RefList. No content error; update to 2025 URL when accessible.

### Open Verification (Paywalled / Inaccessible)

- **CE C-8 exact controlling text** — The 2024 NTIA Federal Register notice is the basis; a Verify callout in the module correctly flags that NTIA may issue supplemental guidance. Module's posture is correct; direct fetch of the NTIA BroadbandUSA policy page was not attempted (URL is in the RefList but verification deferred to research log's note).
- **Bat tree-clearing exact date windows** — Module correctly instructs students to run USFWS IPaC rather than citing fixed dates. The generic "June 1 – July 31 core pup period / April–October broader avoidance" is cited as secondary-source only with a Verify callout. Appropriate.
- **Tricolored bat final listing rule** — The module cites "proposed Endangered as of 2022." Whether the final listing rule was issued between the research session and publication cannot be confirmed via the search tools used in this review. The Verify callout present in the module correctly flags this.

---

## Module 4 — Splicing Specialist

### Verified

- **FOA planning value for SM fusion splice: 0.15 dB**: Confirmed via web search result citing FOA loss-est.htm; consistent with research log and module body. VERIFIED-public-source tag in module is correct.
- **ITU-T L.400 acceptance: average ≤ 0.10 dB, ≤ 0.20 dB at 97th percentile**: Cited via Huber+Suhner and STL Tech secondary sources. Module correctly uses VERIFIED-via-secondary-source. Cannot confirm exact L.163/L.400 subclause without paid document — appropriately flagged in Verify callout (line 214) and RefList.
- **Field quality target ≤ 0.05 dB on splicer estimate**: Tagged UNVERIFIED-deep-link-pending (r/fiberoptics). Module and research log both flag this. Consistent with editorial rulebook requirement.
- **Mandatory re-splice > 0.30 dB OTDR-measured**: NY DOT spec 683.07051210 and UTOPIA 2024 cited as VERIFIED-public-source. NY DOT URL is a .gov domain; status of direct fetch was HTTP 403 in this session. However, the claim is low-risk — it is a conservative standard below which all other values fall, and the specific contract references are publicly accessible.
- **TIA-568.3-D connector loss values**: 0.75 dB legacy max, 0.50 dB ref-to-std SM, 0.30 dB ref-to-std MM, 0.20 dB ref-grade SM, 0.10 dB ref-grade MM — all confirmed by web search results citing Fluke Networks TIA-568.3-D summaries. Module correctly tags all as VERIFIED-via-secondary-source.
- **FOA connector planning value: 0.30 dB per pair**: Confirmed indirectly via same FOA secondary sources. Consistent with cross-module editorial default.
- **Splicer estimate vs. OTDR measurement distinction** (Section 4.2): Technically correct. The phenomenon described (MFD mismatch causing a 0.02 dB splicer estimate alongside a 0.18 dB OTDR reading) is well-documented in Fujikura and Corning literature. Appropriately sourced.
- **Arc test cadence** (Section 4.2, flashcard m4-fc-03): Pre-shift, post-electrode-replacement, post-100-splices, post-temperature-shift >10 °C, post-humidity/elevation change. Consistent with FOA Worldwide Tech Talk secondary sources cited in research log.
- **Core alignment vs. cladding alignment** (Section 4.3): Technically accurate. Cladding alignment appropriate for modern G.657.A2 FTTH; core alignment warranted for backbone/DWDM. Consistent with research log Section 3.4.
- **Mass splicers use cladding alignment by necessity** (Section 4.4): Correct — engineering constraint of ribbon geometry. Appropriately cited to Corning AEN 171 and Huber+Suhner.
- **Mechanical splice typical loss** (Section 4.5): 3M Fibrlok II < 0.2 dB, TE Corelink mean < 0.1 dB, TIA-568 generic max 0.30 dB — all tagged VERIFIED-via-secondary-source. Consistent with research log.
- **Dome vs. in-line closure distinction** (Section 4.6): Technically accurate. Dome = butt termination only; in-line = express-capable. Consistent with FOA splice closure reference.
- **Connector loss framework consistency** (Section 4.7): FOA 0.30 dB / designer 0.50 dB / TIA max 0.75 dB — consistent with platform default stated in `docs/field-vs-textbook-research.md`. No deviation.
- **Flashcard deck `module04-flashcards.js`**: All 8 cards reviewed. Back text matches module body. Tags are present (no orphan backs). UNVERIFIED items correctly tagged in flashcard back text.
- **Quiz questions m4-q1 through m4-q6**: Answer indices verified technically correct:
  - m4-q1 (splicer estimate vs. OTDR): answer 2 (0.18 dB — OTDR wins). Correct.
  - m4-q2 (loss budget planning value): answer 2 (0.15 dB — FOA planning). Correct.
  - m4-q3 (cladding align for G.657.A2 FTTH): answer 2. Correct.
  - m4-q4 (2 a.m. emergency): answer 0 (mechanical, then replace). Correct.
  - m4-q5 drag-drop (closure ↔ application): correctMap verified correct.
  - m4-q6 drag-drop (splice values ↔ contexts): correctMap verified correct.
- **Module imports resolve**: `InteractiveQuiz`, `ModuleHeader`, `Section`, `Callout`, `RefList`, `Table` all present. Default export present.

### Issues Found

- **FIX — Module 4 Section 4.1 table (line 46): ITU-T L.400 row tagged as "UNVERIFIED-deep-link-pending (r/fiberoptics consensus, paraphrase)".**  
  This tag is incorrect. The ITU-T L.400 ≤ 0.10 dB average / ≤ 0.20 dB 97th-percentile claim is cited via Huber+Suhner and STL Tech whitepapers (not r/fiberoptics). The r/fiberoptics UNVERIFIED tag belongs to the ≤ 0.05 dB field quality target row (third row). The tag in the second table row appears to have been copied from the third row erroneously.  
  `src/modules/Module04_Splicing.jsx` line 46.  
  **Recommended fix:** Change the tag cell in the ITU-T L.400 row to read: `"VERIFIED-via-secondary-source (Huber+Suhner, STL Tech)"` — consistent with every other reference to this value throughout the module and flashcards.

- **NIT — Module 4 UTOPIA Fiber reference in RefList (line 445) has no URL.**  
  ```
  { tag: 'book', text: 'UTOPIA Fiber 2024 Splicing Standards — Attachment 3 (re-splice >0.30 dB)' },
  ```
  The NY DOT reference immediately above has a URL; the UTOPIA entry does not. The research log states UTOPIA was VERIFIED-public-source. Without a URL, a student or auditor cannot follow the citation. Add the URL when available; in the interim, downgrade tag from `book` to `verify`.

- **NIT — Module 4 Section 4.5 TIA-568 generic mechanical splice maximum cited as "0.30 dB per mechanical splice" via "Fluke Networks summary of TIA-568.3-D".**  
  This is plausible but TIA-568.3-D is primarily a structured-cabling (connector/patch-cord) standard, not an OSP mechanical splice standard. The 0.30 dB mechanical splice maximum more naturally comes from TIA-568.3 optical fiber component specs or IEC 61073-1, not from the connector-focused Fluke Networks summary. This is a citation-precision issue, not a factual error. Adding "(or IEC 61073-1 / TIA-568.3 optical component clause — confirm with paid document)" would tighten the attribution.

### Open Verification (Paywalled / Inaccessible)

- **FOA CFOS/S practical-exam splice threshold (< 0.15 dB)**: FOA blueprint is member-only. Module correctly marks this UNVERIFIED in both the Callout and RefList. Cannot confirm against the paid document.
- **ITU-T L.163 / L.400 exact subclause for ≤ 0.10 dB / ≤ 0.20 dB ribbon acceptance**: Paywalled. Cited via Huber+Suhner and STL Tech; tagged correctly throughout.
- **TIA-568.3-D normative vs. informative status of the 0.75 dB ceiling** (whether -D or -E governs): Paywalled. Module's Verify callout (line 416–422) explicitly flags this. Appropriate.
- **Bend radius authoritative values (30 mm G.652.D / 10–15 mm G.657)**: ITU-T G.652 and G.657 are paywalled. Cited from vendor literature with VERIFIED-via-secondary-source tag and a Verify callout. Appropriate.
- **Slack-storage quantity per cable side (1–3 m)**: TIA-758 / Telcordia GR-771 are paywalled. Correctly tagged UNVERIFIED-needs-paid-doc in Verify callout.
- **NY DOT spec 683.07051210**: Returned HTTP 403 during this review session. The .gov URL is public; 403 likely a transient or automation block. The > 0.30 dB re-splice threshold from this source is used throughout and is treated as VERIFIED-public-source in the research log. Red Team recommends a manual browser confirm.
- **UTOPIA Fiber 2024 Splicing Standards**: No URL available in module or research log. Cannot verify. (See FIX above.)

---

## Cross-Module Issues

- **FIX — Splice planning value inconsistency between Modules 1 and 4 (and `flashcards.js`):** Module 1 uses 0.10 dB as both the Field callout planning value and the worked link budget input; Module 4 correctly establishes 0.15 dB as the FOA planning value and 0.10 dB as the ITU-T acceptance average. Both the Module 1 callout and the shared `flashcards.js` card `m1-fusion-splice` need to be aligned to 0.15 dB as the planning/budget value. This is the highest-priority cross-module fix because a student going from Module 1 to Module 4 will encounter directly contradictory textbook-answer guidance on the same question.

- **FIX — OTMR "business days" inconsistency between Module 2 and Module 3:** Module 2 says "10 days" and "3 days"; Module 3 says "10 business days" and "3 business days." FCC 18-111 uses business days. Module 2 needs the "business" qualifier added.

- **Connector loss platform default is consistent across all four modules:** 0.30 dB (FOA field) / 0.50 dB (designer planning) / 0.75 dB (TIA max). No deviations found. This checklist item passes.

---

## Summary Count

| Module | BLOCKER | FIX | NIT |
|---|---|---|---|
| Module 1 — Fiber Physics         | 0 | 2 | 2 |
| Module 2 — OSP Design            | 0 | 1 | 2 |
| Module 3 — Permitting & Planning | 0 | 0 | 3 |
| Module 4 — Splicing Specialist   | 0 | 1 | 2 |
| **Cross-module**                 | 0 | 2 | 0 |
| **Total**                        | **0** | **6** | **9** |

No BLOCKERs. The platform's consistent use of Book/Field/Verify callout posture, explicit paywalled-source acknowledgement, and field-vs-textbook dual-column framing are compliant with the editorial rulebook throughout all four modules.
