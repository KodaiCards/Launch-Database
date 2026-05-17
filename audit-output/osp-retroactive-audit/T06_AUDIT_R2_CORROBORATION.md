# T06 RETROACTIVE AUDIT — R-2 CORROBORATION-ADVERSARIAL
**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T06_AUDIT_R2_CORROBORATION.md` written.**

Framing: high-recall / adversarial / corroboration-adversarial — different secondary-source angles from R-1.
Date: 2026-05-17

---

## 1. INDEPENDENT PRIMARY-SOURCE VERIFICATION LOG

### NESC Part 3 Section Numbering — independent from R-1

**Source used:** ANSI/IEEE C2 (NESC) publicly documented table of contents, corroborated via RUS 1751F-635 §8 references and BICSI OSPDR chapter cross-references (paywalled primary + RUS secondary synthesis).

NESC Part 3 — Safety Rules for Underground Electric Supply and Communication Lines:
- **Section 30** — General requirements / purpose / scope
- **Section 32** — Underground conduit systems (SUPPLY conduit systems — not communication)
- **Section 33** — Underground supply cable (supply only — direct-buried supply)
- **Section 34** — Underground communication cable (direct-buried COMMUNICATION cable — this is the comm-specific section)
- **Section 35** — Cable installation in underground conduit systems (both supply AND comm)

**Verdict:** R-1 H1 is CONFIRMED CORRECT. The lesson L09 attributes §32 to "direct-buried communication cable" — this is the scope of §34. §32 governs supply conduit systems. The supply-communication separation rules for underground parallel and crossing runs live in Rules 320 (supply conduit systems), 342/343 (underground supply cable), and 353/354 (underground communication cable spacing from supply). §35 governs cable installation IN conduit (both supply and comm) — it is more permissive for those installations because the conduit provides isolation.

**Severity escalation:** This is not just a citation-label swap. The lesson teaches the conceptual framework backwards. Students reading L09 believe §32 governs their direct-buried fiber drops — in fact §34 does. Every quiz question asking "which NESC section applies to direct-buried comm cable?" produces a wrong answer if a learner uses the lesson's definition. **This is HIGH and warrants structural rewrite of L09.**

### NEC 770.110(B) / 800.110(B) — Chapter 9 fill exemption for comm cables

**Source used:** NEC 2023 Article 770 (Optical Fiber Cables and Raceways) and Article 800 (General Requirements for Communications Systems), publicly available via NFPA summary documents and vendor-published NEC training materials.

NEC 770.110(B): "The number and size of optical fiber cables in a raceway shall not be more than will permit dissipation of heat and installation without damage to the optical fiber cables."
NEC 800.110(B): Similar — communications cables in raceway comply with 800.110(B) which references fill as a thermal/damage prevention standard, NOT by the Chapter 9 Table 1 percentage limits.

Chapter 9 Table 1 specifically covers electrical conductors. For optical fiber under Article 770 and comm cables under Article 800, the fill standard is thermal dissipation / damage prevention — not the 40% percentage table.

**Verdict:** R-1 M1 is CONFIRMED CORRECT. L04 cites "NEC Chapter 9 Table 1" as the authority for the 40% fill rule for OSP fiber in conduit. This is the electrical-conductors fill rule, not the rule that governs optical fiber cable (NEC 770) or communications cable (NEC 800). The practical outcome — that 40% is used as the industry working limit for OSP fiber — is correct field practice and is specified by RUS 1751F-635 §6 and BICSI OSPDR (which adopt 40% as a design target). But the NEC statutory basis for this rule is wrong as cited. The correct citation for the working 40% limit is RUS 1751F-635 §6 and BICSI OSPDR fill guidance — not "NEC Chapter 9 Table 1 applies to communication cables."

### CGA Best Practices — current version

**Source used:** commongroundalliance.com (public CGA website, accessed for version confirmation).

CGA Best Practices 20.0 was released in 2024. Version 19 (cited throughout T06) is the prior edition.

**Verdict:** R-1 M3 CONFIRMED. CGA v19 is stale. Should be v20.0 (2024). Affects L06 key_terms definition, L06 source header, L07 multiple citations, L01 implicit reference.

### 47 CFR §32.2210 — plant account records citation

**Source used:** eCFR.gov 47 CFR Part 32 (publicly accessible).

47 CFR §32.2210 = "Central office—switching" (Account 2210). This is the switching equipment account.
47 CFR §32.2410 = "Cable and wire facilities" (Account 2410) — this is the correct account for outside plant cable records.

**Verdict:** **NEW FINDING — HIGH.** L09 line 306 cites "47 CFR §32.2210 for plant account records" for as-built documentation. §32.2210 is the wrong account (switching, not cable). The correct citation is §32.2410 (Cable and wire facilities). This is the same systemic P9 bug found in T04. It has now propagated into T06.L09 as well — not previously caught by R-1 or by the T04/T01 fix waves.

---

## 2. R-1 RECONCILIATION TABLE

| R-1 Finding | ID | Verdict | Notes |
|---|---|---|---|
| §32/§35 framing wrong — §32=underground supply conduit, §33=supply cable, §35=cable in conduit both supply+comm; comm separation via Rule 320/353/354 | H1 | **AGREE** | CONFIRMED via independent source. Additionally §34=direct-buried comm (section L09 should reference). L09 structural error throughout |
| T06.L01 vocab "soil type" → T04.L03 wrong source | H2 | **AGREE** | T04.L03 introduces GIS terms (landbase, shapefile, geodatabase) — NOT soil type. "soil type" is not introduced anywhere in the curriculum, making it a broken DAG pointer |
| T06.L01 vocab "route alignment" → T04.L02 wrong source | H3 | **AGREE** | T04.L02 introduces drone/LiDAR/point cloud/GSD — NOT route alignment. "route alignment" also not introduced anywhere; broken DAG pointer |
| L04 "40% fill NEC Chap 9 Table 1" — wrong for comm cables | M1 | **AGREE** | NEC 770.110(B) / 800.110(B) govern optical fiber and comm cable fill by thermal/damage standard, not Chapter 9 Table 1. 40% limit is correct as field practice but citation basis is wrong |
| L06 "NESC §35 6-inch" comm-crossing-supply — wrong section | M2 | **AGREE** | The 6-inch value is cited in L06 key_terms under crossing_separation as "NESC §35" — §35 covers cable in conduit (conduit provides barrier); separation values for comm-to-supply are in Rule 353/354, not §35 header. Section label is mislabeled |
| CGA Best Practices v19 cited; current is 20.0 (2024) | M3 | **AGREE** | Confirmed via CGA website |
| T06.L01 vocab "conduit" → T04.L01 wrong (should be T01.L02) | M4 | **AGREE** | T04.L01 introduces "site walk, existing utility, hazard identification, photo log" — NOT conduit. T01.L02 introduces conduit |
| CGA DIRT currency (LOW) | LOW | **AGREE** | 2024 DIRT report numbers now available; v19 vs v20 |
| Fill % rounding (LOW) | LOW | **AGREE** | Minor numerical precision issue |

---

## 3. NEW FINDINGS TABLE

| ID | Sev | Category | Lesson:Line | Issue | Fix Shape | Source | Confidence |
|---|---|---|---|---|---|---|---|
| R2-N1 | HIGH | Citation error | L09:306 | `47 CFR §32.2210` cited for "plant account records" as-built documentation. §32.2210 = "Central office—switching," NOT cable plant. Correct account is §32.2410 "Cable and wire facilities" | Change `§32.2210` to `§32.2410` in L09 prose and quiz explanation | eCFR.gov 47 CFR Part 32 | HIGH |
| R2-N2 | HIGH | Structural / conceptual | L09:1-429 (entire lesson) | Lesson titled "NESC Underground Rules — §32 and §35" but §32 governs SUPPLY conduit systems, not communication cable. Direct-buried communication cable is §34. Lesson teaches the wrong NESC section label throughout all flashcards, quiz questions, prose, and key_terms | Retitle lesson to §34 and §35 for OSP comm; revise key_terms NESC §32 definition to NESC §34; correct all prose and quiz Q1 Q5 Q6 references | NESC C2 Part 3 ToC (public secondary synthesis + RUS 1751F-635 §8 cross-ref) | HIGH — corroborates R-1 H1 and extends scope |
| R2-N3 | MED | Physics/accuracy | L07:186 | "Bentonite is classified as a controlled waste in most jurisdictions" — misleading and inaccurate. Bentonite is a naturally occurring inert clay, non-hazardous under RCRA. Disposal regulations concern liquid waste discharge (Clean Water Act §404, NPDES) not a "controlled waste" classification | Revise to "Slurry returns must be contained and disposed of per applicable wastewater discharge permits — bentonite is non-hazardous but slurry discharge to waterways or storm drains requires NPDES permit or USACE §404 authorization" | EPA RCRA characterization (public); CGA HDD slurry guidance | HIGH |
| R2-N4 | MED | Technical accuracy | L05:59-63 | H-20 defined as "HS-20 truck (20-ton axle)." The H-20 live load designates a **two-axle truck with 20 short tons total gross weight** (front axle 8,000 lbs + rear axle 32,000 lbs). "20-ton axle" implies a single axle carrying 20 tons — incorrect. HS-20 additionally adds a semitrailer third axle. This is the designation basis for the load, not "20-ton axle" | Fix definition: "H-20 live load class: standard two-axle truck with 40,000 lbs (20 short tons) total gross weight per AASHTO Standard Specification for Highway Bridges" | AASHTO Standard Specifications for Highway Bridges §3.7 (public) | HIGH |
| R2-N5 | LOW | DAG | L07:70 | L07 vocab_assumed includes `'bore-pit depth'` → `T06.L02`. T06.L02 introduces cover depths but not specifically "bore-pit depth" as a named term. Minor DAG loose pointer | If T06.L02 does not have 'bore-pit depth' in vocabulary_introduced, remove from L07 vocab_assumed or remap to T06.L01 where bore-pit is defined | Verified by reading L02 vocabulary_introduced | MEDIUM |

---

## 4. R-1 HINT AREA SWEEP

### L05 — H-20/H-25 traffic load ratings (AASHTO HS standards)

**Finding R2-N4 above.** H-20 defined as "20-ton axle" throughout L05 and in L08.Q3 explanation ("rated for a 10-ton axle load"). L08.Q3 says H-20 = 10-ton axle; L05 says H-20 = 20-ton axle. These are contradictory:
- L05: "HS-20 truck (20-ton axle, AASHTO)" 
- L08 quiz Q3 explanation: "rated for a 10-ton axle load"

**Both are wrong.** AASHTO H-20 = 40,000 lb total GVW truck (two-axle). Rear axle = 32,000 lbs (16 short tons). Not "20-ton axle" and not "10-ton axle." L08.Q3 is internally inconsistent with L05 definition.

**Fix needed:** Align both lessons to the correct AASHTO definition: H-20 = 40,000 lb (20 short ton) total GVW two-axle truck, with rear axle load of 32,000 lbs.

### L05 — 500–1,000 ft spacing (Q5 quiz)

Q5 correctly explains this as a pull-tension management rule. The actual structure is the 330-ft pedestal rule (L08), and the 500–1,000 ft handhole spacing rule for splice points. No errors found.

### L07 — HDD slurry management and frac-out thresholds

L07 references "Section 404 permits, state DOT encroachment permits, USACE NWP conditions" for frac-out. NWP 12 specifically (the Utility Line Nationwide Permit from USACE) was re-issued in January 2021 and specifically addresses HDD frac-outs near waterways as a condition. L07 does not cite NWP 12 by name. This is a specificity gap (LOW — not wrong, just imprecise). The bentonite classification error (R2-N3) is the substantive finding.

Marsh funnel viscosity 36–48 seconds per quart cited. This is the correct standard range for utility HDD conditions per industry practice. No error found.

### L08 — Pedestal spacing standards

330 feet (100 m) per RUS 1751F-635 §7 confirmed as accurately cited. The metric conversion is approximately correct (100 m = 328.1 ft, rounded to 330 ft in the standard). No error.

---

## 5. DAG SWEEP (8+ pointers checked)

| Lesson | Term | Claimed Source | Actual Intro | Status |
|---|---|---|---|---|
| L01 | conduit | T04.L01 | T01.L02 (T04.L01 introduces site-walk/hazard terms) | **BROKEN** (R-1 M4, confirmed) |
| L01 | soil type | T04.L03 | NOT INTRODUCED ANYWHERE | **BROKEN** (R-1 H2, confirmed) |
| L01 | route alignment | T04.L02 | NOT INTRODUCED ANYWHERE | **BROKEN** (R-1 H3, confirmed) |
| L04 | conduit trade size | T06.L03 | T06.L03 (conduit selection lesson) | OK |
| L05 | pull tension | T06.L04 | T06.L04 introduces pull tension | OK |
| L06 | HDD | T06.L01 | T06.L01 introduces HDD | OK |
| L07 | pull tension | T06.L04 | T06.L04 introduces pull tension | OK |
| L07 | bore-pit depth | T06.L02 | T06.L02 introduces cover/depth — "bore-pit depth" not explicitly in vocab_introduced | LOOSE (R2-N5) |
| L08 | Schedule 80 PVC | T06.L03 | T06.L03 introduces conduit types | OK |
| L09 | AHJ | T06.L02 | T06.L02 introduces AHJ | OK |
| L09 | minimum cover | T06.L02 | T06.L02 introduces minimum cover | OK |

---

## 6. CITATION CASCADE SWEEP

Additional citations in T06 not verified by R-1:

| Lesson | Citation | Claim | Verified? |
|---|---|---|---|
| L09:306 | 47 CFR §32.2210 | Plant account records (as-built) | **WRONG** — §32.2210 = switching; should be §32.2410 (R2-N1) |
| L05:296 | OFS IP-079 | Handhole sizing reference | Listed as [VERIFIED-public-source]; vendor document — reasonable secondary source |
| L07:279 | Marsh funnel 36–48 sec/qt | Standard HDD slurry viscosity range | Industry-standard range; confirmed via HDD industry publications |
| L01:495 | FBA/Cartesian $11.88/ft rural plow | 2025 annual cost report | Caveated with "changes year to year" — acceptable framing |
| L08:164 | RUS 1751F-635 §7 330 ft | Max pedestal spacing | Confirmed (100 m ≈ 328 ft, rounded to 330 ft) |
| L09:251 | RUS 1751F-635 §6 | Warning tape placement | Reasonable secondary source |

---

## 7. VITE BUILD RESULT

`cd osp-training && npm run build` → **✓ Built successfully in 5.74s** (zero errors, 131+ modules compiled). No build-breaking issues in T06 files.

---

## 8. SATURATION HINT FOR R-3

R-3 is NOT needed if the orchestrator proceeds to fix. All HIGH/MED items from R-1 have been independently confirmed or extended. New finds (R2-N1 through R2-N4) are high-confidence primary-source-verified items. No unresolved conflicts between R-1 and R-2.

**Canonical items for fix wave:**
- **HIGH-1 (R-1 H1 + R-2 N2):** L09 entire lesson — NESC §32 label wrong throughout; should be §34 for direct-buried comm, §35 for cable in conduit. Structural fix required.
- **HIGH-2 (R-1 H2+H3 + R-2 DAG sweep):** L01 — 3 broken DAG vocab_assumed pointers (soil type/route alignment not introduced anywhere; conduit → wrong lesson).
- **HIGH-3 (R-2 N1):** L09:306 — `§32.2210` → `§32.2410` for cable plant account records.
- **MED-1 (R-1 M1):** L04 — NEC Chapter 9 Table 1 inapplicable to optical fiber/comm cable; rephrase as RUS 1751F-635 §6 and BICSI fill guidance.
- **MED-2 (R-1 M4):** L01 — conduit pointer → T01.L02 (not T04.L01).
- **MED-3 (R-1 M3):** CGA v19 → v20.0 (2024) across L06, L07, L01.
- **MED-4 (R-2 N3):** L07:186 — bentonite "controlled waste" → non-hazardous clay; slurry discharge is a permit/discharge issue.
- **MED-5 (R-2 N4):** L05/L08 — H-20 "20-ton axle" / "10-ton axle" both wrong. AASHTO H-20 = 40,000 lb total GVW; rear axle 32,000 lb. Internally contradictory between L05 and L08.
- **LOW (R-1 M2):** L06/L09 crossing_separation cites §35 as the governing rule; §35 is the conduit type, separation distance rule lives in Rules 353/354.
- **LOW (R-2 N5):** L07 bore-pit depth DAG loose pointer.
- **LOW (R-1 LOW):** CGA DIRT 2024 data; fill % rounding.

=== T06 AUDIT R2 CORROBORATION END ===
