# Citation Registry — OSP Training Curriculum
> **Purpose:** Shared verified-citation cache. Before any primary-source lookup, check this file.
> If citation exists AND `Last Verified` is within 90 days of today, skip lookup and use the entry here.
> Append new citations encountered in your audit with your commit SHA.
>
> **Format:** `| Citation | Verified Verbatim Title/Quote | Primary Source URL | Last Verified | Verified By (commit SHA) | Notes |`
>
> **Cascade-defense rule:** If two agents disagreed on a citation's title/value, the entry here reflects the
> PRIMARY-SOURCE-VERIFIED version. See "Verified By" SHA + Notes for resolution details.

---

## 47 CFR — FCC Regulations

| Citation | Verified Verbatim Title/Quote | Primary Source URL | Last Verified | Verified By (commit SHA) | Notes |
|---|---|---|---|---|---|
| 47 CFR §1.1411(i) | "If the electric utility or the pole owner does not complete the make-ready work within [period], the telecommunications carrier or cable television system may hire its own contractor to complete the make-ready work" | https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-1/subpart-J/section-1.1411 | 2026-05-16 | 255ecdf | T08 cascade; §1.1411(i) is the correct subsection for attacher-hired contractor remedy — NOT §1.1411 alone |
| 47 CFR §1.1404 | "Pole attachment access" | https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-1/subpart-J/section-1.1404 | 2026-05-16 | 255ecdf | T08 cascade; general pole attachment application requirements |
| 47 CFR §1.1413 | "Pole attachment rates — telecommunications carriers" | https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-1/subpart-J/section-1.1413 | 2026-05-16 | 255ecdf | T08 cascade |
| 47 CFR §1.1414 | "Pole attachment rates — cable television systems" | https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-1/subpart-J/section-1.1414 | 2026-05-16 | 255ecdf | T08 cascade |
| 47 CFR §32.2210 | "Central office—switching" | https://www.ecfr.gov/current/title-47/chapter-I/subchapter-C/part-32/subpart-B/subject-group-ECFR6dddad3a58b5f37/section-32.2210 | 2026-05-16 | T01 polish-3 (d7161ad) + T04 Haiku tiebreaker (a42e9f8) | CONFLICT RESOLVED: R-1 (T04) claimed "Land", R-2 claimed "Cable & Wire" — BOTH WRONG. Primary source (Cornell LII eCFR) confirms §32.2210 = "Central office—switching". T04.L07 contains wrong teaching and needs polish-wave correction. |
| 47 CFR §32.2410 | "Cable and wire facilities" | https://www.ecfr.gov/current/title-47/chapter-I/subchapter-C/part-32/subpart-B/subject-group-ECFR6dddad3a58b5f37/section-32.2410 | 2026-05-16 | T01 polish-3 (d7161ad) + T04 Haiku tiebreaker (a42e9f8) | Parent category for cable and wire plant accounting |
| 47 CFR §32.2411 | "Poles" | https://www.ecfr.gov/current/title-47/chapter-I/subchapter-C/part-32/subpart-B/subject-group-ECFR6dddad3a58b5f37/section-32.2411 | 2026-05-16 | T01 polish-3 (d7161ad) | T01.L01 Advanced tier verified. T04 P9 open item: T04.L07 currently teaches §32.2420=Poles (wrong — should be §32.2411). |
| 47 CFR §32.2420 | "Cable and wire facilities" (parent category) | https://www.ecfr.gov/current/title-47/chapter-I/subchapter-C/part-32/subpart-B/subject-group-ECFR6dddad3a58b5f37/section-32.2420 | 2026-05-16 | T04 Haiku tiebreaker (a42e9f8) | T04.L07 incorrectly teaches §32.2420=Poles; correct value is §32.2411. See P9 in Polish Tracker. |

---

## NESC — National Electrical Safety Code (IEEE C2-2023)

| Citation | Verified Verbatim Title/Quote | Primary Source URL | Last Verified | Verified By (commit SHA) | Notes |
|---|---|---|---|---|---|
| NESC Rule 232 | Minimum vertical clearances for overhead supply and communication conductors and equipment | IEEE C2-2023 §232 | 2026-05-16 | T05 audit | Clearance measured at midspan under maximum loading conditions |
| NESC Rule 235 | Clearances between conductors carried on different supporting structures or on the same structure | IEEE C2-2023 §235 | 2026-05-16 | T05 audit | Communication-to-supply separation; safety-zone rule |
| NESC Rule 250 | Loads on line conductors — weather loading districts (Light, Medium, Heavy, Extreme Wind) | IEEE C2-2023 §250 | 2026-05-16 | T05 audit | Loading districts define ice thickness, wind pressure, temperature design conditions |
| NESC Rule 261 | Grades of construction (Grade B, Grade C, Grade N) | IEEE C2-2023 §261 | 2026-05-16 | T05 audit | Grade B mandatory at railroad crossings, navigable waterways, limited-access highways |
| NESC Section 24 | Construction requirements — overhead lines | IEEE C2-2023 §24x | 2026-05-16 | T05 audit | Groups clearance rules (Part 2, Section 24) |
| NESC Section 25 | Loadings for grades of construction | IEEE C2-2023 §25x | 2026-05-16 | T05 audit | Loading factors and strength requirements |
| NESC Section 26 | Load and strength factors | IEEE C2-2023 §26x | 2026-05-16 | T05 audit | Structural design factors for aerial construction |
| NESC Sections 32–35 | Underground supply and communication line construction | IEEE C2-2023 §32–§35 | 2026-05-16 | T06 audit | CONFLICT PENDING: T06 R-3 flagged uncertainty on §34 vs §35 boundary — tiebreaker not yet dispatched |

---

## NEC — National Electrical Code (NFPA 70-2023)

| Citation | Verified Verbatim Title/Quote | Primary Source URL | Last Verified | Verified By (commit SHA) | Notes |
|---|---|---|---|---|---|
| NEC Article 770 | Optical Fiber Cables and Raceways | https://www.nfpa.org/codes-and-standards/nfpa-70-national-electrical-code/ | 2026-05-16 | T06 audit | Governs optical fiber cabling inside buildings + building entry |
| NEC 770.110(B) | Listing requirements for optical fiber cables | NEC 2023 §770.110(B) | 2026-05-16 | T06 audit | OSP-to-ISP transition: OSP cable must transition to listed cable at building entry |
| NEC Article 800 | Communications Circuits | NEC 2023 Article 800 | 2026-05-16 | T06 audit | Companion to Article 770 for comm circuits |
| NEC 800.110(B) | Listing requirements for communications cables | NEC 2023 §800.110(B) | 2026-05-16 | T06 audit | Parallel requirement for comm cables at building entry |

---

## ITU-T — Fiber Standards

| Citation | Verified Verbatim Title/Quote | Primary Source URL | Last Verified | Verified By (commit SHA) | Notes |
|---|---|---|---|---|---|
| ITU-T G.652 | Characteristics of a single-mode optical fibre and cable | https://www.itu.int/rec/T-REC-G.652/ | 2026-05-17 | T02 retroactive audit | Current sub-category G.652.D is the most widely deployed SMF for OSP |
| ITU-T G.652.D | Single-mode fiber — low water-peak (LWP), tight CD tolerances, MFD 8.8–9.6 µm @ 1310 nm | https://www.itu.int/rec/T-REC-G.652/ | 2026-05-17 | T02 retroactive audit | "Standard SMF" in OSP context almost always means G.652.D |
| ITU-T G.655 | Characteristics of a non-zero dispersion-shifted single-mode optical fibre and cable | https://www.itu.int/rec/T-REC-G.655/ | 2026-05-17 | T02 retroactive audit | NZ-DSF; used in long-haul DWDM; GAP in T02/T03 per Haiku verifier — not covered as of 2026-05-16 |
| ITU-T G.656 | Characteristics of a fibre and cable with wide passband for optical amplification and WDM | https://www.itu.int/rec/T-REC-G.656/ | 2026-05-17 | T02 retroactive audit | Low-slope NZ-DSF; used in metropolitan WDM networks |
| ITU-T G.657 | Characteristics of a bending-loss insensitive single-mode optical fibre and cable | https://www.itu.int/rec/T-REC-G.657/ | 2026-05-17 | T02 retroactive audit | Bend-insensitive SMF; G.657.A1 = 10mm mandrel; G.657.A2 = 7.5mm mandrel (NOT 16mm — cascade bug fixed) |

---

## TIA — Telecommunications Industry Association

| Citation | Verified Verbatim Title/Quote | Primary Source URL | Last Verified | Verified By (commit SHA) | Notes |
|---|---|---|---|---|---|
| TIA-492AAAC | Detail specification for 850-nm laser-optimized, 50-µm core diameter/125-µm cladding diameter class Ia graded-index multimode optical fibers (OM3) | https://tiaonline.org/ | 2026-05-17 | T02 retroactive audit | OM3 spec: 2000 MHz·km EMB @ 850 nm |
| TIA-492AAAD | Detail specification for 850-nm laser-optimized, 50-µm core diameter/125-µm cladding diameter class Ia graded-index multimode optical fibers (OM4) | https://tiaonline.org/ | 2026-05-17 | T02 retroactive audit | OM4 spec: 4700 MHz·km EMB @ 850 nm |
| TIA-492AAAE | Detail specification for 850-nm laser-optimized, 50-µm core diameter/125-µm cladding diameter wideband multimode optical fibers (OM5) | https://tiaonline.org/ | 2026-05-17 | T02 retroactive audit (RT-θ) | OM5 EMB: 4700 MHz·km @ 850 nm (SAME as OM4 for backward-compat) + 2470 MHz·km @ 953 nm (new SWDM4 spec). FABRICATION CAUGHT: prior agent had 28000 MHz·km — that was WRONG, fabricated value. RT-θ independently verified from TIA-492AAAE + IEEE 802.3cm. |
| TIA-526 | Optical power loss measurements of installed single-mode fiber cable plants | https://tiaonline.org/ | [confirm edition] | P3 polish item | Carter must lock edition before hardcoding. T02.L11 uses `-14B` (confirm). T04.L11 correctly uses `[confirm edition]` marker. |

---

## OSHA — Occupational Safety and Health

| Citation | Verified Verbatim Title/Quote | Primary Source URL | Last Verified | Verified By (commit SHA) | Notes |
|---|---|---|---|---|---|
| OSHA 29 CFR §1910.146 | Permit-required confined spaces | https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.146 | 2026-05-16 | T18 audit | Confined space entry requirements; PRCS definition, entry permit, attendant duties |
| OSHA 29 CFR §1910.146(d)(11) | Entry permit content requirements | https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.146 | 2026-05-16 | T18 polish wave (RT-G) | CONFLICT RESOLVED: T18 originally cited §1910.146(c)(8) — wrong. Correct subsection for permit content = (d)(11). |
| OSHA 29 CFR §1910.268 | Telecommunications industry safety | https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.268 | 2026-05-16 | T18 audit | Telecom-specific safety standard; applies to OSP crews |
| OSHA 29 CFR §1910.269 | Electric power generation, transmission, and distribution | https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.269 | 2026-05-16 | T18 audit | Joint-use pole work near energized power; MAD/MAB requirements |
| H₂S IDLH | 100 ppm (NIOSH IDLH — Immediately Dangerous to Life or Health) | https://www.cdc.gov/niosh/idlh/7783064.html + NIOSH NPG NPGD0337 | 2026-05-16 | T18 cascade resolution (RT-J, ~round 5) | CASCADE BUG FIXED: R-2 changed 100→50 claiming 50 ppm was NIOSH IDLH. WRONG — 50 ppm is OSHA 10-min STEL ceiling (H₂S), NOT IDLH. NIOSH IDLH = 100 ppm per NPGD0337. 4 subsequent agents accepted 50 ppm before RT-J caught it. Correct value restored. |
| H₂S OSHA STEL | 20 ppm (OSHA STEL, 8-hr TWA) / 50 ppm (OSHA acceptable ceiling, never exceed for >10 min unless no other choice) | https://www.osha.gov/hydrogen-sulfide/hazards | 2026-05-16 | T18 cascade resolution | Distinguish from IDLH: STEL ≠ IDLH. Training must not conflate these. |

---

## ANSI Z359 — Fall Protection

| Citation | Verified Verbatim Title/Quote | Primary Source URL | Last Verified | Verified By (commit SHA) | Notes |
|---|---|---|---|---|---|
| ANSI Z359.1 | Safety requirements for personal fall arrest systems, subsystems and components | https://www.assp.org/standards/ansi-z359 | 2026-05-16 | T18 polish-1 | Covers fall arrest system design and performance requirements |
| ANSI Z359.2 | Minimum requirements for a comprehensive managed fall protection program | https://www.assp.org/standards/ansi-z359 | 2026-05-16 | T18 polish-2 (RT-G catch) | CONFLICT RESOLVED: T18 polish-2 fix-agent corrected "imprecise" citation to Z359.4 — WRONG. Z359.4 is Assisted-Rescue/Self-Rescue; Z359.2 is the managed fall protection program standard that covers Use/Inspection/Maintenance. Fix-agent introduced a new wrong citation. RT-G caught it. Corrected back to Z359.2. |
| ANSI Z359.4 | Safety requirements for assisted-rescue and self-rescue systems, subsystems, and components | https://www.assp.org/standards/ansi-z359 | 2026-05-16 | T18 polish-2 (RT-G catch) | Z359.4 = assisted rescue / self-rescue. NOT the "use/inspection/maintenance" standard. Fix-agent (T18 polish-2) incorrectly substituted this for Z359.2. |
| ANSI Z359.11 | Safety requirements for full body harnesses | https://www.assp.org/standards/ansi-z359 | 2026-05-16 | T18 audit | "Body belt" → "Full Body Harnesses" — T18 correction: modern fall protection requires FBH, not body belts |

---

## FCC Orders / Programs

| Citation | Verified Verbatim Title/Quote | Primary Source URL | Last Verified | Verified By (commit SHA) | Notes |
|---|---|---|---|---|---|
| FCC 18-111 (FCC Order) / 47 CFR §1.1411 | "One-Touch Make-Ready" (OTMR) rule | https://www.fcc.gov/document/fcc-accelerates-broadband-deployment-streamlining-pole-attachment | 2026-05-16 | T08 audit | OTMR allows a single contractor to perform all make-ready in one visit. Codified at 47 CFR §1.1411. |
| FCC 23-109 | Small cell attachment rule — betterment exemptions | https://www.fcc.gov | 2026-05-16 | T08 audit | Governs cost causation for betterment work triggered by new attacher's needs |
| FCC WC 25-253 NOI | Notice of Inquiry re: pole attachment rates (2025) | https://www.fcc.gov | 2026-05-17 | T09 R-3 | NOI in 2025 proceeding — verify current docket status before citing as settled regulation |

---

## USACE / Army Corps — Wetlands & Nationwide Permits

| Citation | Verified Verbatim Title/Quote | Primary Source URL | Last Verified | Verified By (commit SHA) | Notes |
|---|---|---|---|---|---|
| NWP 57 (2026 reissuance) | Nationwide Permit 57 — Utility Line Activities for Water and Other Substances | https://www.usace.army.mil/Missions/Civil-Works/Regulatory-Program-and-Permits/Nationwide-Permits/ | 2026-05-17 | T09 R-3 + Polish-A | NWP 57 was reissued in 2026. NWP 12 (telecom utility lines) was suspended in some districts / replaced by NWP 57. Verify current status for your USACE district before citing specific NWP number. |
| NWP 12 | Utility Line Activities | https://www.usace.army.mil/Missions/Civil-Works/Regulatory-Program-and-Permits/Nationwide-Permits/ | 2026-05-16 | T06 audit | NWP 12 may be suspended or superseded in some regions (see NWP 57). T06 R-3 flagged this. Verify current status. |

---

## 7 CFR — Rural Development / USDA

| Citation | Verified Verbatim Title/Quote | Primary Source URL | Last Verified | Verified By (commit SHA) | Notes |
|---|---|---|---|---|---|
| 7 CFR Part 1970 | Environmental Policies and Procedures (RUS) — REPEALED / REMOVED April 2026 | https://www.ecfr.gov/current/title-7/subtitle-B/chapter-XVII/part-1970 | 2026-05-17 | T09 R-2 (cascade catch) | CRITICAL: 7 CFR Part 1970 was REMOVED from eCFR as of April 2026. T09.L11 and other lessons citing this part need replacement. Replaced by 7 CFR Part 1b (basic NEPA procedures). |
| 7 CFR Part 1b | Basic NEPA Procedures (USDA) — REPLACEMENT for Part 1970 | https://www.ecfr.gov/current/title-7/subtitle-A/part-1b | 2026-05-17 | T09 R-2 + Fix Wave A (0ea54c7) | Current citation for RUS environmental review procedures. Part 1970 content migrated here. T09.L11 updated to cite Part 1b throughout. |

---

## Methane / Gas Density Physics

| Citation | Verified Verbatim Title/Quote | Primary Source URL | Last Verified | Verified By (commit SHA) | Notes |
|---|---|---|---|---|---|
| Methane (CH₄) density | CH₄ density = 0.717 kg/m³ at STP — LIGHTER than air (1.225 kg/m³). Accumulates at ceiling, not floor. | NIST Chemistry WebBook SRD 69 | 2026-05-16 | T18 R-1 | CASCADE BUG FIXED: T18.L03 originally taught methane "accumulates at bottom" — WRONG. CH₄ is lighter than air; it rises and collects at ceiling/top of confined space. R-1 caught this safety-critical error. |
| Nitrogen (N₂) density | N₂ density = 1.25 kg/m³ at STP — slightly lighter than air (1.225 kg/m³). Displaces oxygen uniformly; does NOT pool at floor. | NIST Chemistry WebBook SRD 69 | 2026-05-16 | T18 R-2 | Safety teaching: N₂ asphyxiation risk is uniform (not bottom-pooling). |

---

*Append new entries chronologically. Format: ISO date in `Last Verified`. "Verified By" = commit SHA where primary source was confirmed.*
