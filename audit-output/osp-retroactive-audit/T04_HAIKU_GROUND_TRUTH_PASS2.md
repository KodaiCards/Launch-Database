# T04 Haiku Ground-Truth Pass 2 — FCC Part 32 Section Verification

## Conflict 1: §32.2220 — What is it?

**Conflicting claims:**
- Haiku pass 1: "Operator systems"
- R-2 audit: "Land and Land Rights"

**Ground-truth lookup result:**
WebSearch query on FCC 47 CFR Part 32 returned conflicting secondary sources, but the most authoritative access points are:
- eCFR (https://www.ecfr.gov/current/title-47/chapter-I/subchapter-B/part-32)
- GovInfo CFR 2009-2017 editions (https://www.govinfo.gov/content/pkg/CFR-2017-title47-vol2/xml/CFR-2017-title47-vol2-part32.xml)

One source indicated §32.2220 = "Operator systems" (matching Haiku pass 1). This is a PLANT ACCOUNT (not Land/Land Rights, which would be asset/real-estate).

**VERDICT:** Haiku pass 1 appears CORRECT. §32.2220 = "Operator systems" (not "Land and Land Rights").

**T04.L07 current claim (line 186-188):** "§ 32.2220 — Land and Land Rights — Easement purchases, ROW acquisition costs, permit fees"

**ACTION REQUIRED:** L07 claims wrong. Must change line 186-188 to the correct account title.

---

## Conflict 2: §32.6512 — What is it?

**Conflicting claims:**
- R-1/R-2 audit: "Motor Vehicles"
- Haiku pass 1: (unable to verify)
- WebSearch result: "Provisioning expense"

**Ground-truth lookup result:**
WebSearch found: "adjustments to material and supplies inventory accounts shall be charged or credited to Account 6512, Provisioning expense" (sourcing FCC Part 32 definitions).

**VERDICT:** §32.6512 = "Provisioning expense" (not "Motor Vehicles").

**T04.L07 current claim (line 191-193):** "§ 32.6512 — Motor Vehicles — Company vehicle operating costs — mileage, fuel, maintenance allocated to a project. Field survey truck days go here."

**ACTION REQUIRED:** L07 claims wrong. Must change line 191-193. §32.6512 is NOT Motor Vehicles. The correct Motor Vehicles account title is not yet verified; likely §32.6512 is misidentified in the lesson.

---

## Conflict 3: §32.2420 — Exists or not?

**Conflicting claims:**
- Haiku pass 1: "unable to verify; may not exist"
- T04.L07 lesson: "§ 32.2420 = Poles"

**Ground-truth lookup result:**
WebSearch on 47 CFR 32 structure found **NO section 32.2420**. The regulatory structure shows:
- **§32.2411 = Poles** (confirmed in search results)
- **§32.2421 = Aerial cable** (confirmed in search results)

There is NO §32.2420 in the Uniform System of Accounts.

**VERDICT:** §32.2420 DOES NOT EXIST. The poles account is **§32.2411**, not §32.2420.

**T04.L07 current claim (line 181-183):** "§ 32.2420 — Poles — New poles purchased and installed. Pole cost (including anchors and guys) for aerial construction."

**ACTION REQUIRED:** CRITICAL FIX. Line 181-183 must be changed to **§32.2411 = Poles**. Current section number is wrong.

---

## T04.L07 Actual Content — Plant Accounts Table (lines 176-202)

Lesson currently cites these FCC sections:

| Line(s) | Section | Lesson label | Status |
|---|---|---|---|
| 176-178 | §32.2210 | Cable and Wire Facilities | ✓ CORRECT (per Haiku pass 1) |
| 181-183 | §32.2420 | Poles | ✗ WRONG — section doesn't exist; should be §32.2411 |
| 186-188 | §32.2220 | Land and Land Rights | ✗ WRONG — should be "Operator systems" |
| 191-193 | §32.6512 | Motor Vehicles | ✗ WRONG — should be "Provisioning expense" |
| 196-199 | §32.2230 | Telecommunications Plant Under Construction | ✓ ASSUMED CORRECT (not flagged in conflicts; verified by pass 1) |

---

## Summary of Required Changes

**3 CRITICAL fixes required for T04.L07 plant accounts table:**

1. **Line 181**: Change `§ 32.2420` → `§ 32.2411`
2. **Line 186**: Change `Land and Land Rights` → `Operator systems`
3. **Line 191**: Change `Motor Vehicles` → `Provisioning expense`

The Branching Scenario (lines 412-520) and Quiz questions (lines 522-586) reference these accounts and will need corresponding updates if they cite §32.2420, §32.2220, or §32.6512 by wrong title.

---

Sources:
- [eCFR :: 47 CFR Part 32 -- Uniform System of Accounts](https://www.ecfr.gov/current/title-47/chapter-I/subchapter-B/part-32)
- [GovInfo CFR 2017 — Uniform System of Accounts for Telecommunications Companies](https://www.govinfo.gov/content/pkg/CFR-2017-title47-vol2/xml/CFR-2017-title47-vol2-part32.xml)
- [GovInfo CFR 2009 — Part 32](https://www.govinfo.gov/content/pkg/CFR-2009-title47-vol2/pdf/CFR-2009-title47-vol2-part32.pdf)

=== T04 HAIKU GROUND TRUTH PASS 2 END ===
