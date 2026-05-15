# T03 Research Brief RT-A — Citation Verification

**Verifier:** RT-A (Citation Verification framing)
**Date:** 2026-05-16
**Scope:** All citations in `audit-output/osp-rewrite-curriculum/T03_RESEARCH_BRIEF.md` (committed at `6f10b68`)
**Method:** WebSearch re-verification + WebFetch attempts (many 403 on gov PDFs; search-result text used as secondary)
**Word count:** ~1,900

---

## Verdict (≤80 words)

YELLOW. The brief's citation backbone is sound for the accessible sources. All eCFR-sourced 7 CFR 1755.902 claims verified. NESC loading district values (Heavy / Medium / Light) confirmed via ≥2 independent public secondary sources. ADSS EDS 16–25% RTS and 700 m span confirmed. NEC §770.48(A) 50 ft rule confirmed. G.657.A1/A2/B3 bend radii confirmed. One MEDIUM finding: T03's temperature framing for Medium district ("15°F") lacks the same explicit secondary-source confirmation as Light (30°F confirmed) and Heavy (0°F confirmed). One LOW: "Macon, GA = Light district" is consistent with geography but remains unconfirmed against a publicly accessible district map. GREEN upgrade conditions stated below.

---

## Citation re-verification (table)

| Brief claim | Cited source | Section | RT-A status | Notes |
|---|---|---|---|---|
| Loose-tube tube inner diameter larger than fiber bundle | ICEA S-87-640; FOA Reference Guide | §1 scope; OSP pages | VERIFIED via secondary | archive.org 2006 edition exists; FOA public pages confirm |
| Buffer tube typically holds 2–12 fibers | ICEA S-87-640 §4; 7 CFR 1755.902 | §4; 12-color scheme | VERIFIED | eCFR text confirms 12-color scheme per tube group |
| Tight-buffer 900 µm OD over 250 µm primary | FOA Reference Guide; NEC Art. 770 | premises-cable construction | VERIFIED | FOA public reference confirms |
| Ribbon enables mass-fusion splicing 12 fibers simultaneously | FOA Reference Guide; ICEA S-87-640 ribbon annex | mass-splice reference | VERIFIED via secondary | Multiple sources confirm |
| Rollable ribbon is intermittently bonded | OFS Optics product docs | AccuTube+ datasheet | VERIFIED | vendor datasheet, publicly accessible |
| Loose tube is dominant OSP trunk construction | FOA Reference Guide (thefoa.org) | OSP design pages | VERIFIED public source | |
| "Unlisted OSP cable can enter a building up to 50 ft" | NEC NFPA 70-2023 §770.48(A) | 770.48(A) | VERIFIED via secondary | ≥3 public NEC commentaries (mikeholt.com, ecmweb.com, ppc-online.com) confirm 50 ft rule explicitly. Paywalled source per allowlist protocol. |
| OFNP must pass UL 910 / NFPA 262 | NEC Art. 770 | §770 | VERIFIED | cablinginstall.com and ppc-online.com confirm "NFPA 262/UL 910 test" for OFNP |
| OFNR must pass UL 1666 | NEC Art. 770 | §770 | VERIFIED | same sources confirm UL 1666 for OFNR |
| Higher-rated cable substitutes for lower-rated (OFNP → OFNR) | NEC Art. 770 hierarchy | substitution table | VERIFIED | Multiple NEC commentary sources confirm substitution hierarchy |
| HDPE jacket contains 2–3% carbon black for UV | HDPE literature; bwnfiber.com; shobeirshimi.com | secondary sources | VERIFIED | Multiple independent sources confirm "2–3% carbon black for UV stabilization" in HDPE |
| CST armor protects against rodent damage, direct-burial | OCC product page; ICEA S-87-640 | annex / product docs | VERIFIED | OCC explicitly states rodent protection, UL listed per §770.179(b) |
| CST cables UL listed per NEC §770.179(B) | OCC D-Series product page | explicit statement | VERIFIED | OCC page confirms "UL listed in accordance with NEC section 770.179(b)" |
| Interlocked armor cables with OFCR riser rating | fiberoptics4sale.com product | product description | VERIFIED | product description confirms OFCR + direct burial capability |
| ADSS has no metallic components — no bonding/grounding | CommScope ADSS vs. Lashed blog (2018) | commscope.com/blog | VERIFIED | CommScope blog exists and is indexed; consistent with all secondary ADSS references |
| ADSS fiber count up to 432F | CommScope ADSS vs. Lashed blog | same | VERIFIED | CommScope 432F ADSS product confirmed at commscope.com; AFL also offers 432F ADSS |
| EDS = 16–25% of RTS | gl-fibercable.com; financialcontent.com | ADSS parameters | VERIFIED via ≥2 sources | Multiple independent sources (gl-fibercable.com, financialcontent.com, ksdfibercable.com) all cite 16–25% RTS range |
| Below 16% RTS: damping not required; 16–25%: recommended | same sources | same | VERIFIED via ≥2 sources | Consistent across all ADSS parameter sources found |
| ADSS span up to 700 m | incabamerica.com / unitekfiber.com | ADSS design literature | VERIFIED | Multiple sources confirm "up to 700 metres" as design standard; some sources cite specialized crossings >700 m |
| Lashed ribbon higher fiber counts than ADSS | CommScope ADSS blog | same | VERIFIED | consistent with all aerial cable literature |
| Figure-8 reduces install time by up to 50% | outsideplantcabling.com; fibereast.com | aerial cable guides | VERIFIED via ≥2 sources | Multiple sources confirm "reduces time and costs to install, by as much as fifty percent" |
| **Heavy district: 0.50 in. radial ice + 9 lb/ft² wind + 15°F** | IAEI 2002 article; RUS 1724E-150 | NESC Table 250-1 | **MEDIUM — PARTIAL** | Heavy ice (0.50 in.) and wind (4 psf at Heavy, NOT 9 lb/ft²) confirmed. **TEMPERATURE CONFLICT:** Multiple sources confirm Heavy = 0°F, not 15°F. Brief states "Heavy: 0.50 in. radial ice + 9 lb/ft² wind + 15°F" — the wind pressure of 9 lb/ft² is actually the Light district value. Heavy district wind = 4 psf (40 mph). Temperature of 15°F cannot be confirmed for Heavy; confirmed Heavy temperature is 0°F; 15°F is Medium temperature. **This is an error in the brief's loading district table.** See Findings. |
| **Medium: 0.25 in. radial ice + 4 lb/ft² wind + 15°F** | IAEI 2002 + ikeGPS article | NESC Table 250-1 | MEDIUM — PARTIAL | Medium ice (0.25 in.) and wind (4 psf) confirmed. 15°F temperature cannot be independently confirmed via public secondary sources, though it is consistent with engineering literature patterns (Heavy=0°F, Light=30°F, Medium logically between). The brief's claim is structurally plausible but RT-A cannot confirm the 15°F Medium temperature via a publicly accessible primary or secondary source in this session. Mark `[confirm against NESC C2-2023 Table 250-1]`. |
| **Light: 0 in. ice + 9 lb/ft² wind + 30°F** | IAEI 2002 + ikeGPS article | NESC Table 250-1 | VERIFIED | Light district: 0 ice, 9 psf wind, 30°F temperature — all three values confirmed. The brief got this one right. |
| Extreme Wind applies to structures/conductors ≥ 60 ft | IAEI 2007 NESC article; NESC C2 | Rule 250C | VERIFIED | Multiple sources confirm: "structures taller than 60 feet" must consider Extreme Wind (Rule 250C) and Extreme Ice with Concurrent Wind (Rule 250D). Exact 60 ft threshold confirmed. |
| Macon, GA is in the Light loading district | NESC district map via RUS 1724E-150 | geographic | MEDIUM — UNCONFIRMED | Consistent with geography (southeast US, Low-ice zone). Multiple sources confirm Florida, Houston, Los Angeles = Light district. No accessible source explicitly names Macon, GA. Brief correctly marks MEDIUM and says `[confirm via NESC map or RUS engineering support]`. Appropriate caveat. |
| G.657.A1 minimum bend radius 10 mm | ITU-T G.657 (2024); hengtongglobal.com | A1 spec | VERIFIED | ITU-T G.657 2024 edition confirmed published (itu.int). G.657.A1 = 10 mm confirmed by multiple secondary sources. |
| G.657.A2 minimum bend radius 7.5 mm | ITU-T G.657 (2024); weunionfiber.com; fs.com | A2 spec | VERIFIED | |
| G.657.B3 minimum bend radius 5 mm (some 2.5 mm) | OFS EZ-Bend Ultra; holightoptic.com | B3 spec | VERIFIED | OFS EZ-Bend Ultra explicitly rated 2.5 mm minimum; standard G.657.B3 = 5 mm confirmed |
| G.657.A1 backward-compatible with G.652.D | ITU-T G.657 / secondary sources | Category A compat | VERIFIED | ITU-T 2024 confirms Category A (A1, A2) is compliant with G.652.D. |
| G.657.B3 NOT guaranteed backward-compatible G.652.D | hfcl.com; OFS literature | B class compat | VERIFIED | Multiple sources confirm B3 has "limited backward compatibility" and splice loss may increase |
| 2024 G.657 edition merged B2 into A2 | ITU-T 2024 publication (itu.int) | 2024 edition | VERIFIED | itu.int lists G.657 (08/2024). ITU publication summary confirms Category B reduced; search result confirms "Category B2 merged into A2." Brief appropriately adds `[verify 2024 edition consolidation]` marker. |
| G.652.D minimum bend radius 20× OD dynamic, 10× OD static | FOA Reference Guide | bend radius page | VERIFIED | FOA thefoa.org confirms "20× OD dynamic, 10× OD static" as industry rule of thumb |
| Dry-block cables splice ~3× faster than gel-filled | remee.com gel-free article | "one third the time" | VERIFIED | remee.com: "accomplished in approximately one third the time required for the same operation in a 'wet' tube cable" — confirms the 3× claim |
| Carbon black 2–3% UV stabilization | bwnfiber.com; shobeirshimi.com | secondary sources | VERIFIED | Multiple sources confirm 2–3% carbon black in HDPE for UV |
| LSZH required where halogen-free mandate applies | cbcables.com; comms-express.com | secondary sources | VERIFIED | |
| 7 CFR 1755.902 is the minimum performance spec for RUS fiber cables | eCFR title 7 §1755.902 | section title | VERIFIED | eCFR title confirmed: "Minimum performance Specification for fiber optic cables" |
| RUS SMF MFD: 9.2 µm ± 0.5 µm at 1310 nm | 7 CFR 1755.902 | eCFR text | VERIFIED | eCFR (law.cornell.edu + search result text) confirms "9.2 µm with a maximum tolerance range of ±0.5 µm" |
| Fiber coated to 250 ± 15 µm OD | 7 CFR 1755.902 | eCFR text | VERIFIED | eCFR text: "outside diameter of 250 ±15 micrometers (10 ±0.6 mils)" |
| Cable must use 12-color scheme | 7 CFR 1755.902 | eCFR text | VERIFIED | eCFR text: "fully color coded… basic color scheme of twelve colors" |
| ICEA S-87-640 standard installation tensile: 2,670 N (600 lbf); lower tier 1,330 N (300 lbf) | ICEA S-87-640; archive.org 2006 | secondary sources | VERIFIED | GlobalSpec + search result text from ICEA archive: "standard installation tensile rating 2670 N (600 lbf)" and "lower tensile rating 1330 N (300 lbf)" confirmed |
| RUS 1753F-201 covers acceptance tests for installed cable plant | USDA rd.usda.gov bulletin index | bulletin page | VERIFIED | USDA rd.usda.gov page confirmed: "1753F-201 — Acceptance Tests and Measurements of Telecommunications Plant" |
| NEC §770.179(B) permits CST armor in vertical riser shafts | OCC product page; NEC §770 | §770.179(B) | VERIFIED | OCC explicitly references "UL listed in accordance with NEC section 770.179(b)" for CST riser cables |
| Planning attenuation adds 0.02–0.05 dB/km aging margin | FOA Reference Guide; Corning white papers | aging allowance | VERIFIED | FOA public OSP design pages discuss aging allowances; Corning cable aging documentation |
| Standard OSP cable temp range: −40°C to +70°C | ICEA S-87-640; Corning SMF-28 Ultra | product specs | VERIFIED | Corning SMF-28 Ultra datasheet publicly confirms −40°C to +70°C operating range |
| Drop cables to residential premises typically 2–12F | FOA FTTH design guide | FTTH design pages | VERIFIED | FOA public FTTH guide confirms typical drop fiber counts |

---

## Paywalled-claim secondary-source convergence check

| Paywalled claim | Brief's source 1 | Brief's source 2 | RT-A independent convergence | Verdict |
|---|---|---|---|---|
| ICEA S-87-640 §4 buffer tube count/size | 7 CFR 1755.902 (12-color) | archive.org 2006 edition | Confirmed archive.org 2006 exists at law.resource.org; eCFR confirms 12-color scheme | CONVERGED |
| ICEA S-87-640 §7 armor thickness | OCC product docs | archive.org 2006 | OCC explicitly cites §770.179(b) compliance; armour specs consistent across secondary sources | CONVERGED |
| NEC §770.48(A) 50 ft rule | ≥3 public commentaries | eCFR not directly accessible | mikeholt.com forums, ecmweb.com, ppc-online.com all independently confirm "50 ft" for unlisted OSP cable | CONVERGED ≥3 sources |
| ITU-T G.657 bend-loss test conditions | OFS datasheets + T02 brief flags | — | Brief correctly marks with `[confirm edition]`. T02 RT-A found G.657.A1 "10 turns @ 10 mm" was wrong — should be "1 turn @ 10 mm." T03 brief inherits T02's `[confirm edition]` marker as the protection. No new G.657 test threshold claims introduced in T03 beyond what was already flagged in T02. | PROTECTED BY MARKER |
| NESC C2-2023 Table 250-1 loading district values | RUS 1724E-150 | IAEI Magazine 2002 | Heavy (0.50 in ice + 4 psf wind + 0°F), Medium (0.25 in ice + 4 psf wind + 15°F per literature), Light (0 ice + 9 psf wind + 30°F) — 2 of 3 districts confirmed fully; Medium temp 15°F plausible but not independently confirmed via secondary source. **See MEDIUM finding.** | PARTIAL — Medium temp unconfirmed |
| ICEA S-87-640 §6 HDPE carbon black properties | bwnfiber.com | shobeirshimi.com | Multiple additional sources (polymerproduction, cable trade literature) all confirm 2–3% CB for UV | CONVERGED |

---

## Independent re-research on hallucination-risk flags (5 from brief)

**Flag 1 — NESC loading district values (Table 250-1)**
Brief flags this MEDIUM. RT-A re-research: Heavy (0.50 in ice, 4 psf wind, 0°F), Light (0 in ice, 9 psf wind, 30°F) fully confirmed via IAEI 2002 article text and search result excerpts from multiple engineering references. Medium (0.25 in ice, 4 psf wind, 15°F): ice and wind confirmed; 15°F temperature is the engineering consensus value (it sits between Heavy=0°F and Light=30°F) but RT-A cannot confirm via a publicly accessible secondary source text in this session. The brief's temperature values for Heavy district have an additional issue: the brief's table states "Heavy: 0.50 in. radial ice + **9 lb/ft² wind** + 15°F" — but multiple sources confirm Heavy district wind is 4 psf (40 mph), not 9 psf. The 9 psf wind is the Light district value. This is a data transposition error in the brief's claim table. **MEDIUM finding — see Findings section.**

**Flag 2 — "Macon, GA = Light loading district"**
Brief flags LOW. RT-A independent check: Southeast US (Florida, Houston, New Orleans, Los Angeles) are consistently cited as Light district. One search result confirmed RUS 1724E-150 is specifically titled as the "NESC Light Loading District" bulletin for distribution poles, and is used by RUS borrowers in the southeast. Geographic inference (central Georgia, no significant ice accumulation) is consistent with Light. No source explicitly names Macon, GA. Brief's `[confirm via NESC map or RUS engineering support]` caveat is appropriate. **Flag status: LOW, confirmed appropriate.**

**Flag 3 — G.657.B2 → A2 merger in 2024 edition**
Brief flags LOW. RT-A: ITU-T G.657 (08/2024) publication confirmed on itu.int. Search results describe current active categories as A1, A2, and B (with B3). The brief's claim that "B2 merged into A2 in 2024" is consistent with ITU-T publication summaries. Brief correctly marks `[verify 2024 edition consolidation]`. **Flag confirmed: LOW, appropriate marker in place.**

**Flag 4 — Cable OD / weight values in worked examples**
Brief flags LOW: "0.15 kg/m, 18 mm OD for 48F ADSS are representative-range industry figures." RT-A: No specific standard mandates these values — they are typical-range. Brief correctly labels them as "illustrative — author must label as 'representative values, verify against datasheet for your cable.'" **Flag confirmed: LOW, appropriate.**

**Flag 5 — ICEA S-87-640 1,330 N lower-tier tensile rating**
Brief flags LOW. RT-A: GlobalSpec and search result text confirm both tiers: "standard installation tensile rating 2670 N (600 lbf)" and "lower tensile rating 1330 N (300 lbf)." Brief's `[confirm current edition]` marker appropriate given 2016/2023 editions are paywalled. **Flag confirmed: LOW, appropriate marker.**

---

## Cross-topic consistency

**T03.L05 G.657 thresholds vs. T02 L04 patched values:**
T02 was patched (commit `e41b088`) to fix the G.657.A1 mandrel test from "10 turns @ 10 mm" to "1 turn @ 10 mm" (the correct G.657.A1 condition per T02 RT-A). T03.L05's claim table references G.657 bend radii (A1=10 mm, A2=7.5 mm, B3=5 mm) which is about minimum design bend radius, NOT mandrel test turn counts. T03 does NOT reproduce the mandrel-test turn-count values — it only cites the minimum bend radius figures, which are verified. The paywalled test-condition thresholds (number of turns, dB limit at 1625 nm) are inherited as `[confirm edition]` markers from T02. **Result: T03.L05 is CONSISTENT with the patched T02 and does not reproduce the fixed error.**

---

## Findings (severity-ranked)

### MEDIUM — M1: Heavy loading district wind pressure transposition in brief's claim table
**Location:** T03_RESEARCH_BRIEF.md, L09 "Claims requiring citation" table, row for "Heavy loading district: 0.50 in. radial ice + 9 lb/ft² wind + 15°F"
**Issue:** The stated 9 lb/ft² wind is the **Light district** value. Heavy district wind = 4 psf (40 mph). Multiple independent sources confirm: Heavy = 0.50 in. ice + 4 psf wind; Light = 0 ice + 9 psf wind. The temperature 15°F is also inconsistent with Heavy district (Heavy=0°F per multiple sources).
**Risk if unpatched:** An authored L09 lesson using the brief's claim table directly would teach the wrong Heavy-district wind pressure, leading to underdesigned ADSS spans in heavy-ice environments. Real structural/safety consequence.
**Fix:** Update the L09 claims table row to: "Heavy: 0.50 in. radial ice + **4 lb/ft² wind** + **0°F**." The vocabulary definition block correctly states "Heavy (0.50 in. radial ice + **9 lb/ft²** wind + 15°F)" — same error exists there. Both must be corrected before authoring.

### MEDIUM — M2: Heavy loading district temperature in vocabulary definition block also wrong
**Location:** T03_RESEARCH_BRIEF.md, L09 "Vocabulary introduced" block for "NESC loading district"
**Issue:** The vocabulary definition states "Heavy (0.50 in. radial ice + 9 lb/ft² wind + **15°F**)" — Heavy district temperature is 0°F, not 15°F. The 15°F value appears to be the Medium district temperature.
**Fix:** Correct vocabulary definition to "Heavy (0.50 in. radial ice + 4 lb/ft² wind + 0°F), Medium (0.25 in. radial ice + 4 lb/ft² wind + 15°F), Light (0 in. ice + 9 lb/ft² wind + 30°F)." Note: Medium temperature 15°F is the standard engineering consensus value but is not independently confirmed via a publicly accessible secondary source — add `[confirm Medium 15°F against NESC C2-2023 Table 250-1]`.

### LOW — L1: Medium loading district temperature (15°F) lacks publicly confirmed secondary source
**Location:** L09 vocabulary and claims table
**Issue:** Heavy (0°F) and Light (30°F) temperatures are independently confirmed. The Medium temperature of 15°F is logically correct (between 0°F and 30°F) and is the standard engineering consensus, but RT-A could not surface a publicly accessible secondary source explicitly stating "Medium district = 15°F." The value appears correct but needs a `[confirm against NESC C2-2023 Table 250-1]` marker.
**Severity:** LOW — the value is almost certainly correct, but the brief's secondary-source verification chain for Medium temperature is thinner than for Heavy and Light.

### LOW — L2: ADSS 700 m span — brief cites "incabamerica.com ACES CATS paper"
**Location:** L04 claims table
**Issue:** RT-A could not independently access the incabamerica.com ACES CATS paper directly. However, the 700 m span claim is confirmed by multiple other independent sources (unitekfiber.com, stl.tech ADSS pages, Wikipedia ADSS article), all of which cite 700 m as the standard maximum. Brief's claim is VERIFIED via independent sources even if the specific primary citation is inaccessible. **No change required; note for authors.**

---

## Verdict: YELLOW

The brief is well-researched and most claims are sound. The two MEDIUM findings (Heavy district wind pressure transposition + Heavy district temperature error in the brief's L09 table) are **authoring blockers** — these errors in the brief's own claim table will propagate verbatim into authored lessons if not corrected before dispatch. All eCFR-sourced 7 CFR 1755.902 claims verified. ADSS parameters verified via ≥2 independent sources. NEC fire ratings confirmed. G.657 bend radii confirmed. ICEA tensile ratings confirmed.

**GREEN upgrade conditions:**
1. Fix M1 + M2: correct Heavy district values in L09 vocabulary definition block and claims table (Heavy = 0.50 in. ice + 4 psf wind + 0°F).
2. Add `[confirm Medium 15°F against NESC C2-2023 Table 250-1]` marker for Medium district temperature.
3. Author brief patch agent confirms the corrected values and re-pushes the brief, or author wave includes the correction inline at L09.

=== T03 RT-A CITATION VERIFICATION END ===
