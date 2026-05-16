# T04 Haiku Ground-Truth Pass 3 — CFR Part 32 Lookups

**Dispatch:** Haiku ground-truth verification on 3 specific CFR Part 32 section references cited in T04.L07.  
**Scope:** STRICT READ-ONLY. Report only.

---

## Lookup 1: Motor Vehicles in 47 CFR Part 32

**Plant Account (Property):**
- **Section:** 47 CFR § 32.2112
- **Verbatim Title:** "Motor vehicles"
- **Context:** Part of the plant accounts series (§32.21xx). This account records the cost of acquisition of motor vehicles used in telecommunications operations.

**Expense Account (Operating Cost):**
- **Section:** 47 CFR § 32.6112
- **Verbatim Title:** "Motor vehicle expense"
- **Context:** Part of the expense accounts series (§32.61xx). This account records the ongoing costs of operating, maintaining, and fueling motor vehicles.

**T04.L07 Reference:** Lesson cites "Motor Vehicles (§ 32.6512)" in branching scenarios at lines 512–517. **DISCREPANCY FOUND:** The lesson claims §32.6512; actual motor vehicle **expense** account is §32.6112, not §32.6512. The lesson also references motor vehicles in context of a drone, which is CORRECTLY rejected (drones are project costs, not vehicle fleet costs).

---

## Lookup 2: Re-verify § 32.2220

**Section:** 47 CFR § 32.2220  
**Verbatim Title:** "Operator systems"  
**Context:** Plant account in the §32.22xx series. This account records telecommunications equipment and apparatus related to central office switching and signaling systems — **NOT land or land rights.**

**Verdict on R-3 Claim:** R-3 audit agent claimed Pass 1 + Pass 2 gave "conflicting verdicts" on §32.2220. **This claim is UNSUBSTANTIATED.** Both prior passes stated §32.2220 = "Operator systems" consistently. There is no conflict in the record. R-3 appears to have misread the audit history OR referenced a different section number.

**T04.L07 Reference:** Line 383 states "§ 32.2220 for land and land rights, etc." **WRONG.** §32.2220 is "Operator systems," not land.

---

## Lookup 3: Section Actually Labeled "Land and Land Rights"

**Section:** 47 CFR § 32.2111  
**Verbatim Title:** "Land"  
**Context:** Part of the plant accounts series (§32.21xx). This is a sub-account of the broader plant account series that records the acquisition cost of land used in telecommunications operations.

**Parent Account:** 47 CFR § 32.2110 (the parent general account for "Land and support assets," under which §32.2111 "Land," §32.2112 "Motor vehicles," §32.2113 "Aircraft," and §32.2114 "Tools and other work equipment" are organized).

**T04.L07 Reference:** The lesson intends to reference land. The correct section is **§32.2111 "Land"** (NOT §32.2220 which is "Operator systems"). There is no section titled "Land and Land Rights" verbatim — the closest is §32.2111 "Land" under the parent §32.2110.

---

## Summary of Findings

| Reference in T04.L07 | Claimed Section | Claimed Title | Actual Title | Verdict |
|---|---|---|---|---|
| Line 383: land account | §32.2220 | "Land and land rights" | "Operator systems" | **WRONG** — should be §32.2111 |
| Lines 512–517: motor vehicle expense | §32.6512 | (context: drone cost, correctly rejected) | actual motor vehicle = §32.6112 | **WRONG section** — §32.6512 does not exist in audit; should be §32.6112 |

**HIGH Priority Fixes Required:**
1. **L07, line 383:** Change "§ 32.2220 for land and land rights" → "§ 32.2111 for land"
2. **L07, lines 512–517:** Change "Motor Vehicles (§ 32.6512)" → "Motor Vehicles (§ 32.6112)"

---

=== T04 HAIKU GROUND TRUTH PASS 3 END ===
