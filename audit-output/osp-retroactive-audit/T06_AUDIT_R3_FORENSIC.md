# T06 RETROACTIVE AUDIT — R-3 FORENSIC / INCIDENT-INVESTIGATION FRAMING
**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T06_AUDIT_R3_FORENSIC.md` written.**

Framing: forensic / incident-investigation / field-failure — asking "does T06 prevent real OSP incidents?"
Date: 2026-05-17
Token budget: ≤200K

---

## 1. PRIMARY-SOURCE VERIFICATION LOG (independent of R-1 and R-2)

### NESC Part 3 Section numbering — independent verification

**Source:** AccessEngineering MCGH library title listing (public index); search results from McGraw-Hill Access Engineering explicitly showing `"Section 35: Direct-Buried Cable and Cable in Duct Not Part of a Conduit System"` + NESC subcommittee 7 (2017 changes) IEEE-hosted document confirming Part 3 section structure.

**Finding:** NESC Part 3 Section 35 is confirmed titled **"Direct-Buried Cable and Cable in Duct Not Part of a Conduit System"** — covering BOTH supply and communication cables that are direct-buried (not in a conduit system). Rule 350A in Section 35 cross-references Section 33 (supply cable) and supplements it. Section 35.353/354 contains separation rules for deliberate (≥12 in) and random (<12 in) separation.

**Verdict on R-1/R-2 HIGH-1 (NESC §32/§35 framework):** PARTIALLY CONFIRMED, but with a critical refinement. R-1 and R-2 claimed §32 = supply conduit and §34 = direct-buried communication only. The independent evidence shows §35 explicitly covers direct-buried cable (both supply AND communication), not §34. Section 32 governs underground conduit SYSTEMS (supply). The title of §35 — "Direct-Buried Cable and Cable in Duct Not Part of a Conduit System" — confirms it covers direct-buried installation. **R-2's specific claim that "§34 = direct-buried communication cable" is unconfirmed by independent primary source.** The AccessEngineering listing for chapter 30 shows §35 covering direct-buried; no independent confirmation that §34 is specifically "communication cable in underground structures" vs §35 being the direct-buried comm section. Tiebreaker needed on §34 vs §35 framing before the lesson fix is applied.

**The lesson error is still real:** L09 currently teaches §32 = direct-buried fiber and §35 = conduit. This is wrong — §35 actually covers direct-buried cable. The lesson has the labels swapped or garbled. Whether the fix is "§35 applies to direct-buried comm" or "§34 + §35 both apply" needs the tiebreaker, but the lesson's current §32=direct-buried-comm claim is definitively WRONG.

### 47 CFR §32.2210 vs §32.2410 — independent verification

**Source:** LII / Law Cornell search result (returned directly) + USLAW search confirming:
- **47 CFR §32.2410 = "Cable and Wire Facilities"** — Account 2410 records original cost of cable and wire plant including poles, aerial cable, underground cable, buried cable, conduit systems. This is the outside plant record account.
- **47 CFR §32.2210 = Central office switching equipment** (local switching, tandem trunks, etc.)

**Verdict:** R-2 N1 CONFIRMED by independent source. L09:306 cites §32.2210 for plant account records of as-built documentation — this is the switching-equipment account, not the OSP cable-plant account. Correct citation is §32.2410 (Cable and Wire Facilities). No ambiguity.

### NWP 12 / NWP 57 split — independent verification

**Source:** Burns McDonnell blog, Cox Castle publication, Federal Register 2021-27441 (Dec 27 2021).

**Key finding:** In the 2021 NWP reissuance, NWP 12 was NARROWED to oil/gas pipelines only. **Telecommunications and electric utility line activities (including fiber HDD) moved to NWP 57** (effective March 15, 2021, expired March 14, 2026). L07 references "Section 404 permits, state DOT encroachment permits, USACE NWP conditions" but does NOT cite NWP 57 (the controlling permit for telecom fiber HDD) by name or number. This is a specificity gap with real forensic consequences — a designer who doesn't know NWP 57 governs telecom HDD across waters/wetlands may fail to file the required pre-construction notification (PCN), triggering §404 enforcement.

---

## 2. FORENSIC SCENARIO COVERAGE TABLE

| # | Scenario | T06 Coverage | Verdict |
|---|---|---|---|
| 1 | HDD frac-out → wetland → EPA enforcement. T06 covers NWP permit + reportable thresholds? | L07 mentions §404, NWP conditions (generic), and slurry containment. Does NOT name NWP 57 (the controlling telecom-HDD permit post-2021). No mention of inadvertent return notification requirements per NWP 57 general conditions. Reportable discharge thresholds absent. | **Present + Inadequate.** NWP 57 not cited; no PCN trigger discussion; no EPA SPILL threshold or §404 enforcement consequence. |
| 2 | Pull-tension failure → bend exceeds spec → attenuation increase. | L04 covers pull tension formula (Capstan equation), rated maximums, breakaway swivel, and mid-assist concept with worked example. L03 covers minimum bend radius in conduit selection. | **Present + Adequate.** L04:worked-example shows arithmetic correctly. Kellems grip, breakaway swivel, and mid-assist all covered. |
| 3 | Vault confined-space fatality — OSHA 1910.146 PRCS not followed. | L05 Advanced tier explicitly covers OSHA 1910.146 + 29 CFR 1926.1200, pre-entry atmospheric monitoring (O₂ 19.5–23.5%, LEL <10%, H₂S <1 ppm), attendant, rescue plan, written permit. Book vs. Field box acknowledges crews skip this and explains why it's still required. | **Present + Adequate.** Confined space covered in L05 Advanced. Cross-references T18. |
| 4 | 811 ticket expired or scope changed, strike hit gas main. T06 covers 811 lifecycle + state variation + reportable damages? | L06 covers 811 system scope, tolerance zone, pothole exposure, APWA color codes. Does NOT cover: ticket expiration periods (state-specific, typically 10–15 working days), ticket renewal/re-notify requirements, or reportable-damage thresholds (state law varies — some states mandate electronic DIRT reporting within 24h). | **Present + Inadequate.** 811 basics covered; ticket lifecycle (expiration, renewal), scope-change re-notification, and reportable-damage requirements absent. |
| 5 | Pipeline-proximity strike — 49 CFR 192 separation. | L06 covers gas main as foreign utility with APWA yellow flag and pothole-exposure requirement. No mention of 49 CFR Part 192 (federal pipeline safety regulations) or PHMSA operator notification requirements for HDD near transmission pipelines. | **Present + Inadequate.** Operational separation addressed; 49 CFR 192 regulatory consequence and PHMSA notification not addressed. |
| 6 | Joint trench cost-allocation dispute. | L06 Q4 mentions that parallel runs in shared corridors "require coordination with the existing utility owner" and an encroachment permit. No substantive treatment of cost-sharing, contractual allocation, or joint-trench agreement terms. | **Absent.** Joint-trench agreements, cost-sharing mechanisms, and indemnification basics not covered. Low forensic priority for OSP design; note for future expansion. |
| 7 | Pedestal vandalism / surge protection inadequacy. | L08 covers pedestal placement, slack-loop storage, NIU placement. No coverage of physical security (locks, tamper-evident hardware, vandal-resistant enclosures per BICSI OSPDR) or surge protection adequacy (ANSI/TIA-968-A, ITU K.66 for lightning protection at pedestals). | **Absent.** Physical security and surge protection out of scope for T06 as designed; not a design error but a coverage gap note. |
| 8 | HDD bore through unmarked tile drain. | L06 covers 811 locate limits: "811 ticket does not cover private laterals." However, no specific mention of agricultural tile drains as a known non-locatable underground hazard, no guidance on agricultural GPR pre-bore survey. | **Present + Inadequate.** Private-lateral caveat present in L06 Q3 rationale but agricultural tile drain as a specific hazard class not addressed. |
| 9 | Buried fiber severed by deep-rip plow — depth dispute (NESC vs RUS). | L02 explicitly covers the tiered depth hierarchy (RUS → NEC → AHJ) with a Macon, GA worked example. Shows that NESC C2 [confirm edition] cover requirements, RUS 1751F-635 floors, and AHJ overrides can all differ. As-built depth documentation discussed in L09 (as-built requirement). | **Present + Adequate.** The lesson correctly frames which depth governs in a dispute: AHJ permit is binding, then RUS floor, then NEC floor. Coverage adequate for preventing/documenting the dispute. |
| 10 | Manhole hydrostatic test failure — H-20/H-25 after freeze-thaw. | L05 covers H-20 and H-25 load rating in detail, traffic loading as a sizing driver, and growth-reserve sizing. Does NOT cover freeze-thaw cycle effects on precast concrete lids, hydrostatic pressure testing of completed structures, or ASTM C497 acceptance testing. | **Present + Inadequate.** Traffic-load selection covered; freeze-thaw durability and post-install hydrostatic acceptance testing not addressed. |

---

## 3. R-1 / R-2 RECONCILIATION — FORENSIC FRAMING

All R-1 and R-2 HIGH/MED findings confirmed from forensic angle:
- **H1 (NESC §32 framework wrong):** CONFIRMED with refinement. §35 = direct-buried cable (both supply + comm per AccessEngineering index). The lesson's §32=direct-buried-comm claim is wrong. Whether §34 or §35 governs communication-specific direct-buried: **tiebreaker needed** (R-1/R-2 framing conflict on §34 role). Fix agent must NOT apply §34-specific language until tiebreaker resolves.
- **H3 / R2-N1 (§32.2210→§32.2410):** CONFIRMED via independent LII/eCFR search. §32.2210 = switching, §32.2410 = cable plant. L09:306 fix is unambiguous.
- **R2-N3 (bentonite "controlled waste"):** CONFIRMED forensically. Bentonite is a naturally-occurring clay mineral, non-hazardous under RCRA. The slurry discharge issue is a §404/NPDES discharge-permit matter, not a "controlled waste" classification. The current language will mislead crew into wrong regulatory framework.
- **R2-N4 (H-20 "20-ton axle"):** CONFIRMED forensically. AASHTO H-20 = 40,000 lb (20 short ton) GVW two-axle truck; rear axle = 32,000 lbs. L05 says "20-ton axle" (wrong); L08 Q3 says "10-ton axle" (also wrong, and internally contradictory).

---

## 4. NEW FINDINGS TABLE (forensic-only; not in R-1 or R-2)

| ID | Sev | Category | Lesson:Line | Issue | Fix Shape |
|---|---|---|---|---|---|
| R3-N1 | MED | Citation gap / compliance | L07:180–188 | NWP 57 not cited for telecom HDD across waters. Post-2021 split means NWP 12 no longer covers fiber HDD. Designers unaware of NWP 57 may fail to file PCN, risking §404 unpermitted-discharge enforcement. L07 cites "USACE NWP conditions" generically — insufficient. | Add NWP 57 citation in L07 slurry-management section; note that telecom HDD across navigable waters/wetlands requires NWP 57 (or individual §404 permit if NWP conditions not met); note 2026 expiration + reissuance pending. |
| R3-N2 | MED | Coverage gap | L06:prose | 811 ticket expiration / renewal not addressed. State validity periods range 10–15 working days. Re-notification when scope changes is required in most states. A crew working beyond ticket validity with no re-notify faces a reportable violation even if no damage occurs. | Add L06 Book vs. Field box: "your 811 ticket has a validity period (commonly 10 working days, verify in your state). If work extends beyond validity, re-notify 811 before continuing. If scope changes (deeper bore, new segment), re-notify before excavating the new area." |
| R3-N3 | LOW | Coverage gap | L07:all | Agricultural tile drains — a common non-locatable underground hazard on rural RUS routes — not specifically flagged as a private lateral class that 811 will NOT mark. Farmer's plow can sever fiber at the tile drain junction. Pre-bore GPR or tile-drain map review is the mitigation. | Add to L06 or L07: "Agricultural tile drains and private irrigation laterals are NOT in the 811 system — no locate, no flags. On rural routes crossing cropland, request tile-drain maps from the county extension office or FSA, or use GPR scan before boring." |
| R3-N4 | LOW | Citation (§34 tiebreaker flag) | L09:all | R-2 states §34 = direct-buried communication; independent verification found §35 = "Direct-Buried Cable and Cable in Duct Not Part of a Conduit System" (covers both supply + comm). Role of §34 unresolved by R-3 independent web sources. Fix-agent MUST NOT apply §34-specific language without a primary-source tiebreaker (Haiku lookup on NESC table of contents) before applying. | Dispatch Haiku tiebreaker: confirm whether §34 or §35 (or both) govern direct-buried communication cable before fix-agent rewrites L09 key_terms and quiz. |

---

## 5. UNDER-AUDITED LESSON ROTATION (L02, L03, L10, L11, L12)

**L02 (Burial Depth Rules):** Worked example uses Macon, GA. Frost line claim "0–6 inches [confirm with local DOT]" — this is accurate for central Georgia. Tiered depth table (24/36 in RUS floors) matches RUS 1751F-635. Concrete-encasement depth-reduction referenced with correct caveat ("confirm with RUS area engineer"). No errors found in numeric claims. Citation to NEC §830.47 = 18 inches for NPBC cable: correct and clearly scoped.

**L03 (Conduit and Innerduct Selection):** Schedule 40/80 PVC definitions correctly cite NEMA TC-2. HDPE = "DR (dimension ratio)" terminology correct. No numeric errors found on wall thickness or application guidance. No errors found.

**L10 (RUS 1751F-643 Innerduct Standard):** RUS AML program accurately described. Traceability chain (type designation, date code, reel/lot, compliance letter) is correct procedure. No errors found in the lesson's claims; all appropriately hedged with [confirm current acceptance test requirements].

**L11 (Underground Design QA Checklist):** Access spacing cites 330 ft = RUS 1751F-635 §7 (confirmed correct in L08). Fill calc verification using 40% references "conduit fill" (T06.L04) — the T06.L04 key_terms definition does mention NEC Chapter 9 Table 1 incorrectly (R-1 M1), so the cross-reference propagates the wrong citation. Minor cascade of R-1 M1 into L11 key_terms prose via fill-calc-verification definition.

**L12 (Capstone):** vocabulary_assumed pointers appear internally consistent with their lesson sources. Quiz scenario wording and answer logic not deeply re-derived, but question themes match lesson content. No numeric errors identified on surface sampling.

---

## 6. DAG SWEEP (5 additional pointers, different from R-2)

| Lesson | Term | Claimed Source | Verified? |
|---|---|---|---|
| L02 | `conduit` | `T04.L01` | **BROKEN** — matches R-1 M4; T04.L01 is site-walk/hazard lesson, not conduit introduction |
| L05 | `H-20 live loading` | *(introduced in L05)* | OK — introduced here for first time |
| L08 | `ONT` | `T01.L01` | OK — T01.L01 introduces ONT in fiber-to-home context |
| L11 | `supply-communication separation` | `T06.L09` | OK — introduced in L09 |
| L12 | `NESC §32` | `T06.L09` | PROPAGATES ERROR — L09 defines §32 as direct-buried comm (wrong), so L12 inheriting it will teach the wrong definition to capstone learners |

---

## 7. VITE BUILD RESULT

`cd osp-training && npm run build` → **✓ Built successfully in 5.76s** (zero errors, all T06 modules compiled). No build-breaking issues.

---

## 8. SATURATION VERDICT

**R-3 adds 4 new items (R3-N1 through R3-N4), none in R-1 or R-2.** The forensic framing found real gaps (NWP 57 citation, 811 ticket lifecycle, agricultural tile drain) that the citation-skeptical and corroboration-adversarial framings missed. However:

- All 4 new R-3 items are MED or LOW severity
- No new HIGH items found
- R3-N4 is not a new bug but a tiebreaker flag on the R-1/R-2 §34 conflict — required before the fix-agent runs

**Tiebreaker required before fix-agent dispatch:** The §34 vs §35 conflict between R-2's claim and the independent §35-as-direct-buried-cable evidence must be resolved via Haiku ground-truth NESC table of contents lookup BEFORE the fix-agent rewrites L09. Fix-agent must not apply §34-specific language without it.

**Pre-fix-wave canonical summary:**
- HIGH-1: L09 §32 label wrong throughout (direct-buried comm is NOT §32; exact replacement — §34 or §35 — needs tiebreaker)
- HIGH-2: L01 — 3 broken DAG vocab_assumed pointers (soil type/route alignment not introduced anywhere; conduit → T04.L01 wrong, should be T01.L02)
- HIGH-3: L09:306 — §32.2210 → §32.2410 (confirmed independently)
- MED-1: L04 — NEC Chapter 9 Table 1 inapplicable to optical fiber/comm fill; correct citation is RUS 1751F-635 §6 + BICSI fill guidance
- MED-2: L01 — conduit DAG pointer → T01.L02 (not T04.L01) [cascade of HIGH-2]
- MED-3: CGA v19 → v20.0 (2024) across L06, L07, L01
- MED-4: L07:186 — bentonite "controlled waste" → non-hazardous clay; discharge is a §404/NPDES permit issue
- MED-5: L05/L08 — H-20 "20-ton axle" / "10-ton axle" both wrong; correct: 40,000 lb total GVW two-axle truck, rear axle 32,000 lb
- MED-R3-N1: L07 — NWP 57 missing (telecom HDD across waters/wetlands post-2021)
- MED-R3-N2: L06 — 811 ticket expiration / renewal lifecycle absent
- LOW: Various (§35 section-label, DAG loose, CGA DIRT, fill rounding, agricultural tile drain, L12 capstone inherits §32 error)

=== T06 AUDIT R3 FORENSIC END ===
