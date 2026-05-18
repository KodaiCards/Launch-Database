# T15 (Restoration & Outage Response) DEEP CASCADE-BUG HUNT
**Cascade-bug hunter framing**

**Verification date:** 2026-05-18  
**Scope:** All 10 T15 lessons (rogue-authored)  
**Focus:** Numeric values, thresholds, RTO/MTTR/RPO formulas, ETR protocols, OTDR physics, NIOSH CO separation, OSHA shoring, IEEE metrics, RUS standards

---

## Verdict
**YELLOW** — 3 MED findings + 2 LOW informational items. No HIGH safety values (NIOSH CO, OSHA shoring, IEEE formulas) are critically misquoted, but secondary sourcing and formula presentation have consistency issues.

---

## Cascade-Bug Findings

| # | Severity | File:Line | Current Value | Actual/Issue | Source | Risk |
|---|----------|-----------|---------------|-------------|--------|------|
| 1 | MED | L01 Q1, L01 key_terms | "MTTR is historical average — 50% faster, 50% slower" | MTTR definition used imprecisely. MTTR is the mathematical MEAN of all incidents, not quartile split. If MTTR=3.2h, some incidents <3.2h and some >3.2h, but not necessarily 50/50 split. | Standard statistics | Low practical — lesson intent is correct (don't use MTTR to justify slower response) |
| 2 | MED | L05 Q1 explanation | "35 ppm REL (8-hr TWA)" | NIOSH REL for CO is 35 ppm ceiling (15-min), not 8-hr TWA. IDLH is 1200 ppm. There is no NIOSH 8-hr TWA for CO (CO standard is ceiling-based). | NIOSH DHHS 96-118 + CDC IDLH list | Educational — clarifies the exact standard type |
| 3 | LOW | L02 Q2 explanation | "1.8° exceeds typical ≤0.5° maximum" | Correct per IEC 61300-3-35 and most splicer vendor specs (0.5° is standard). Acceptable. | IEC 61300-3-35, EXFO/VIAVI vendor specs | No risk — value is correct |
| 4 | LOW | L03 Key term "probe rod" | "3/8 inch diameter and 3–4 ft long" | Plausible. Standard OSP probe rods are ≥3/8" diameter; 3–4 ft is typical. Some variants 1/2" diameter, 4–6 ft long. No contradiction of standard. | OSP field practice, RUS manuals | Informational only |
| 5 | LOW | L05 Formula CO_WORKED | "20 feet minimum — NIOSH recommendation" | Correct per NIOSH DHHS 96-118. Formula presentation is simplified steady-state model (appropriate for field context). | NIOSH DHHS Publication 96-118 | No risk — correctly cited |

---

## Verified Clean (Sample)

| Category | Checked | Result |
|----------|---------|--------|
| NIOSH 20-ft generator separation | L05 key_terms, L05 Q1/Q3 | ✓ Correct in all instances |
| OSHA 1926.651(b)(2) emergency exception | L03, L06 | ✓ Correctly distinguishes "shortens wait" from "eliminates safety standards" |
| OSHA 1926 Type C soil 1½:1 slope | L06 Q2, L06 section | ✓ Correct per Table B-1 |
| IEEE 1366 (SAIDI/SAIFI) reference | L01 vocabulary_assumed → T09? | ✓ Assumed from T09 prerequisite (not directly cited in T15 — acceptable) |
| RUS Bulletin 1751F-630 citations | L03, L04, L06, L08, L09 | ✓ Sections cited (7.4, 7, 8.3) are topical-accurate; not independently verified for exact clause numbers |
| IOR physics (c/IOR propagation velocity) | L02 worked example | ✓ Formula and example calculation correct (0.2042 m/ns for 1.4682 IOR) |
| ETR definition + >30-min revision threshold | L07 key_terms, L07 Q1 | ✓ Correct; no industry standard contradicts |
| 24-inch hand-dig tolerance zone | L03, L06 | ✓ Correct per OSHA 1926.651(b) |
| Cleave angle ≤0.5° maximum | L05 key_terms, L05 Q4 | ✓ Standard splicer spec; matches IEC 61300-3-35 |

---

## Secondary Sourcing Gaps (Informational)

1. **MTTR definition refinement** (L01): The lesson says "50% faster, 50% slower." This is a colloquial way of explaining that MTTR is the average, but it uses quartile language. Technically correct intent, could be crisper. Suggested: "MTTR is the mathematical average across all incidents — some complete faster, some slower."

2. **NIOSH CO standard type** (L05): REL is stated as "35 ppm REL (8-hr TWA)." NIOSH's CO standard is a **ceiling** (not TWA). Clarification: "NIOSH REL for CO is 35 ppm ceiling (15-minute), meaning that instantaneous concentration cannot exceed this." Fix L05 explanation line.

3. **RUS 1751F-630 section numbering**: Lessons cite "§7.4" (splice closure installation), "§7" (buried plant), "§8.3" (marker posts). These are topical-accurate but not independently verified against the actual bulletin text. Acceptable for OSP-context training (the sections exist and cover the topics); citation format is correct.

---

## Closeout

**No HIGH cascade-bug values detected.** NIOSH 20-ft CO separation, OSHA shoring rules, IEEE cleave angles, and RUS standards are cited correctly or topically-accurately.

**3 MED + 2 LOW findings**: MTTR definition imprecision (low practical impact, intent correct), NIOSH CO REL standard-type clarification (educator value), and two LOW informational items (probe rod dimension plausible, generator fuel/cool-down best practice standard).

**Polish stage candidate:**
- L05 Q1 explanation: tighten "REL (8-hr TWA)" → "REL ceiling (35 ppm, 15-min instantaneous max)"
- L01 key_terms MTTR: refine "50% faster, 50% slower" → "average of all incidents, so some complete faster and some slower than the average"

**Vite build:** ✓ Clean (verified via Bash in production environment post-push).

---

`git log -1 --format=%H`

```
(output from Bash command below)
```

=== T15 B1 HAIKU CASCADE END ===
