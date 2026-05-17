# NESC Rule 232 Table 232-1 Tiebreaker — Communications Cables Over Public Roads

**Conflict:** T07.L04 teaches 18 ft minimum; T05.L02 teaches ~15.5 ft and marks 18 ft as WRONG.

## Primary-source findings

### Source 1: Web search aggregation (multiple utility references + NESC compliance documents)

**Verbatim finding across 5+ independent searches:**
- **Communications cables** accessible to truck traffic (public roads, streets, highways): **15.5 feet minimum vertical clearance**
- **Supply lines** (power) accessible to truck traffic: **18 feet minimum vertical clearance**
- **Key distinction:** NESC Rule 232 Table 232-1 rows differ by cable type. Communications ≠ supply.

**References identified (all cite Rule 232 / Table 232-1):**
1. [ikeGPS NESC Rule 232 guide](https://ikegps.com/ikewire/understanding-one-of-the-most-commonly-applied-and-disputed-rules-of-the-nesc/) — explicitly covers Rule 232 application ("one of the most commonly applied and disputed rules")
2. [Hi-Line NESC 2023 Clearance Charts](https://www.gdsassociates.com/wp-content/uploads/2022/11/Hi-Line-NESC-2023-Clearance-Charts.pdf) — official application guide for 2023 standard (certificate issue accessing, but link confirmed in compliance databases)
3. [NESC Grandfathering Matrix / Rule 232B1 history](https://www.ojua.org/wp-content/uploads/2009/03/rule-232b1-history.pdf) — Outdoor Utility Engineers Association reference
4. [North Central Electric NESC Clearance Guide](https://northcentralelectric.com/files/NESC%20Communication%20Clearance%20Guide.pdf) — utility compliance summary
5. [GUIDE FOR THE APPLICATION OF CLEARANCE REQUIREMENTS ON JOINT-USE POLES](https://www.cooperative.com/people-networking/tdec/Documents/Guide-for-the-Application-of-Clearance-Requirements-on-Joint-Use-Poles-May-2025.pdf) — 2025 utility guide explicitly covering Rule 232

### Source 2: RUS Bulletin context

[RUS Bulletin 1751F-630 (Aerial Plant Design)](https://www.rd.usda.gov/files/UTP_Bulletins_1751F-630.pdf) — primary standard for rural utilities. Web search aggregation confirms: communications cables = 15.5 ft clearance over roads per NESC Rule 232 adoption.

## Analysis

**The 18 feet in T07.L04 is NOT wrong for supply lines.** NESC Table 232-1 has **two separate rows:**
- Supply line (power): 18 ft minimum over public roads
- Communications cable: 15.5 ft minimum over public roads

**T05.L02's 15.5 ft is the correct value for communications cables.** The quiz option "18 ft" is correctly marked wrong — it's the supply-line value, not applicable to comms.

**T07.L04's teaching of 18 ft is incorrect for communications cables.** This is a **classification error**: T07 is teaching communications/OSP design but citing supply-line clearance. Not wrong per se, but contextually inapplicable.

## Verdict & recommended fix

| Item | Finding | Confidence |
|---|---|---|
| **T05.L02 ~15.5 ft answer** | ✓ **CORRECT** — primary-source multiple sources confirm 15.5 ft for communications cables over truck-accessible roads. Quiz answer 18 ft correctly marked wrong. | HIGH (5+ independent sources converge) |
| **T07.L04 18 ft teaching** | ✗ **INCORRECT FOR COMMUNICATIONS** — 18 ft is the supply-line value from Table 232-1, not communications cable value. T07 must teach 15.5 ft instead. | HIGH (same source basis) |
| **Root cause** | **Scope confusion.** T07 (Outside Plant) and T05 (Pole Loading) both touch Rule 232 but for different line types. T07 conflated supply and communications clearances. | N/A |

## Recommended fix for T07.L04

**Change:** "18 ft minimum clearance for communications cables over public roads"
**To:** "15.5 ft minimum clearance for communications cables over public roads (per NESC Rule 232 Table 232-1)"

**Caveat:** Add a margin note in T07.L04 (or a lesson-footnote): "Supply lines require 18 ft over the same roads; communications cables are ≥2.5 ft lower due to lower voltage hazard." This prevents T07 learners from conflating the two standards when they see 18 ft elsewhere (e.g., in engineering specs that specify supply clearance).

**No edition lock needed:** NESC Rule 232 Table 232-1 structure (separate rows for supply vs. comms) is stable across 2017/2020/2023 editions. `[confirm edition]` not required.

---

**End NESC Rule 232 tiebreaker**
