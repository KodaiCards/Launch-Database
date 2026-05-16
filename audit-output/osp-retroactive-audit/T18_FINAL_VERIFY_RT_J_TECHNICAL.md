# T18 Final-Verify-3 RT-J — Technical + Math + Primary-Source Citation Verification

**Constraints acknowledged:** I did NOT modify any lesson file, canonical file, CLAUDE.md, ARCH.md, course-catalog.js, SLEEP_SNAPSHOT.md, HANDOFF.md, or pending-dispatches.md. Write-path: `audit-output/osp-retroactive-audit/T18_FINAL_VERIFY_RT_J_TECHNICAL.md` ONLY. Pre-push git diff --stat will show only this file.

**Framing:** Senior OSP engineer + field safety officer + chemistry/physics expert + standards-precision citation auditor. Technical/math/primary-source lens. Independent pass conducted BEFORE reading RT-I.
**HEAD SHA at review:** aa8b8a7 (T18 lessons last touched at a7e8bc8 polish-3)
**Date:** 2026-05-16

---

## 1. Z359 Citation Primary-Source Verification Table

| Citation in L04 | Title stated in lesson | Primary-source verification | Verdict |
|---|---|---|---|
| ANSI Z359.1 | "The Fall Protection Code" | ANSI Blog confirms: "ANSI/ASSP Z359.1-2024: The Fall Protection Code" — exact title match across ANSI store, ASSP store, ANSI blog. [Source: blog.ansi.org/ansi/ansi-assp-z359-1-2024-fall-protection-code/] | **VERIFIED EXACT MATCH** |
| ANSI Z359.11 | "Safety Requirements for Full Body Harnesses" | ANSI Blog confirms: "ANSI/ASSP Z359.11-2021: Safety Requirements for Full Body Harnesses" — exact title match. Standard covers performance, design, marking, qualification, inspection, use, maintenance of FBHs. [Source: blog.ansi.org/ansi/ansi-assp-z359-11-2021-full-body-harnesses-safety/] | **VERIFIED EXACT MATCH** |
| ANSI Z359 (family reference) | "the ANSI Z359 series" | Accurate collective reference to the ASSP Z359 committee family (Z359.1 through Z359.15+). | **ACCEPTABLE** |

**Z359.4 purge verification:** `grep -rn "Z359.4"` across all T18 lesson files returns **zero results**. Z359.4 fully eliminated from T18. CONFIRMED.

---

## 2. Polish-3 Technical Verification

### 2a. Z359.4 → Z359.1+Z359.11 correction (NEW-G1, 3 locations in L04)

| Location | Before | After | Technical verdict |
|---|---|---|---|
| L04:214-218 Book/Field prose | Z359.4 | Z359.1 ("The Fall Protection Code") + Z359.11 (Full Body Harnesses) | **CORRECT** — Z359.1 governs overarching PFAS system requirements; Z359.11 governs full body harness performance. Both appropriate for the body-belt-vs-harness fall arrest prohibition claim. |
| L04:423 SideBySide leftValue | Z359.4 | Z359.1 + Z359.11 pair | **CORRECT** — same rationale |
| L04:469 Q2 citation | Z359.4 | Z359.1 + Z359.11 pair | **CORRECT** — same rationale |

Body belt prohibition for fall arrest: confirmed accurate. OSHA prohibited body belts as personal fall arrest PPE effective January 1, 1998. Full-body harnesses required per OSHA 1910.140 and Z359.11. Z359.1 as the overarching code document is the correct umbrella cite.

### 2b. CO IDLH wording — "For scale" framing (NEW-G2, L03:164)

L03:164 now reads: "(For scale: NIOSH IDLH = 1,200 ppm = immediate threat to life — the 25 ppm exit threshold in column 4 is your actual trigger, far before IDLH.)"

**CO IDLH value verification:** NIOSH IDLH for CO (CAS 630-08-0) = **1,200 ppm** — revised 1994. Confirmed via multiple NIOSH/CDC sources [cdc.gov/niosh/idlh/630080.html; cdc.gov/niosh/npg/npgd0105.html]. The original SCP IDLH was 1,500 ppm; the 1994 revision set it at 1,200 ppm. **CORRECT.**

Column 4 exit threshold `> 25 ppm: exit immediately` based on ACGIH TLV-TWA. The "For scale" framing correctly positions 1,200 ppm as context rather than an operational exit cue, resolving the competing-signal risk. **TECHNICALLY SOUND.**

---

## 3. Numeric/Scientific Re-Derivation Log

### 3a. Fall arrest physics (L04) — anchor 5,000 lbf, 1,800 lbf max arrest, 6 ft max free fall

- **5,000 lbf anchor requirement:** 29 CFR 1910.140(c)(13) confirmed via LII Cornell and multiple OSHA sources — "capable of supporting at least 5,000 pounds (22.2 kN) for each employee attached, OR designed/installed under a qualified person with safety factor ≥2." **CORRECT** as stated in L04:275-276 callout box.
- **1,800 lbf max arrest force:** 29 CFR 1910.140(d) limits maximum arresting force to 1,800 lbf. Consistent throughout L04 (lines 101, 149, 203, 418, 468). **CORRECT.**
- **6 ft max free fall (standard lanyard):** Per OSHA 1910.140(d)(2), maximum free-fall distance is 6 feet. L04:418 states "Limits free-fall to ≤6 ft (lanyard) or 2–3 ft (SRL)." **CORRECT.**
- **SRL 2–3 ft lock:** SRL lock distance is device-dependent (ANSI Z359.14), typically 18–24 inches; 2–3 ft is a conservative industry-standard description. **ACCEPTABLE.**

### 3b. Gas physics (L03) — atmospheric behavior

- **Methane (CH₄) LIGHTER than air:** Molecular weight CH₄ = 16 g/mol; air ≈ 29 g/mol. CH₄ rises and accumulates at TOP. L03:308 states "methane (natural gas, CH₄) is LIGHTER than air and accumulates at the TOP." **CORRECT** (confirmed corrected from the prior HIGH bug C-01).
- **CO₂ heavier than air:** Molecular weight CO₂ = 44 g/mol; CO₂ accumulates at BOTTOM. L03:307 states "carbon dioxide (CO₂) is heavier than air and accumulates at the BOTTOM of a manhole." **CORRECT.**
- **Nitrogen near-neutral:** Not mentioned in L03 (lesson removed the prior incorrect nitrogen density claim per the canonical fixes). No residual incorrect claim found.
- **H₂S heavier than air:** Molecular weight H₂S = 34 g/mol; denser than air (29 g/mol), accumulates at low points. BranchingScenario L03:420 groups H₂S with "gases denser than air (CO₂ and H₂S, which settle to the bottom)." **CORRECT.**

### 3c. O₂ deficiency threshold (L03)

L03:152: `19.5% – 23.5%` safe range. 29 CFR 1910.146(b) definition: oxygen-deficient atmosphere = below 19.5% O₂. L03:152 lower trigger `< 19.5%` = IDLH. **CORRECT.** Note: 16% O₂ (L03:152 action column, L03:314) as cognitive-impairment threshold is accurate per OSHA/NIOSH guidance. **CORRECT.**

### 3d. LEL sensor O₂ dependency note (L03:319-323)

L03:319: "If O₂ reads below 19.5%, your combustible gas (LEL) sensor may output a false-low or zero reading — catalytic bead sensors require oxygen to oxidize the target gas on the sensor bead." **Technically correct.** Catalytic bead (pellistor) sensors rely on oxidation reaction — depleted O₂ starves the reaction. OSHA recognizes this sensor limitation. **CORRECT.**

### 3e. H₂S olfactory paralysis at 100 ppm (L03:297-298)

L03:297: "At around 100 ppm (twice the IDLH), H₂S completely paralyzes your sense of smell."

**INDEPENDENT FINDING — HIGH:** The lesson states 100 ppm is "twice the IDLH" — implying NIOSH IDLH = 50 ppm. However, independent primary-source verification across multiple NIOSH/CDC authoritative sources confirms:

**NIOSH IDLH for H₂S (CAS 7783-06-4) = 100 ppm** (revised 1994).

Sources independently verified:
- NIOSH IDLH documentation page (cdc.gov/niosh/idlh/7783064.html) — revised IDLH = 100 ppm
- NIOSH Pocket Guide NPGD0337 (cdc.gov/niosh/npg/npgd0337.html) — IDLH = 100 ppm
- OSHA Hydrogen Sulfide Hazards page (osha.gov/hydrogen-sulfide/hazards) — "exposures at or above 100 ppm are considered immediately dangerous"

The **50 ppm value** cited throughout L03 as "NIOSH IDLH" is actually the **OSHA short-term exposure ceiling** (10-minute maximum peak within an 8-hour shift per 1910.268(c) and general industry PEL guidance) — NOT the NIOSH IDLH.

**Impact across L03:**
- L03:170 table action column: "at 50 ppm = NIOSH IDLH — exit immediately" → incorrect IDLH value
- L03:296: "The NIOSH IDLH for H₂S is **50 ppm**" → incorrect
- L03:297: "At around 100 ppm (twice the IDLH)" → the math is based on the wrong IDLH; 100 ppm is actually the IDLH itself
- L03:299: "50–100 ppm H₂S has already been above IDLH" → incorrect; at 50 ppm, worker is NOT above IDLH (100 ppm)
- L03:338 source citation: "NIOSH IDLH documentation CAS 7783-06-4 (H₂S, revised 1994) — 50 ppm IDLH" → incorrect

**Note on prior RTs:** R-2 (corroboration-adversarial) previously "fixed" the H₂S IDLH from an initially wrong value to "50 ppm" per its report. RT-D, RT-F, and RT-H all accepted 50 ppm without independent primary-source lookup. This RT-J technical framing with explicit WebSearch against NIOSH primary sources caught the error that 8 prior passes missed. The confusion is understandable: OSHA's industry-specific telecom standard (1910.268) references a 50 ppm ceiling, and many confined-space training materials (incorrectly) cite 50 ppm as IDLH. The **NIOSH IDLH is 100 ppm**.

**Operational note:** The lesson's exit threshold (>1 ppm: exit immediately from table) is operationally appropriate and conservative — this is correct. The error is only in the IDLH value stated as a reference point.

**Severity: HIGH** — affects safety-critical atmospheric monitoring content, multiple locations in L03, incorrect chemical value explicitly attributed to NIOSH.

---

## 4. Regression Check (Spot-Check — High-Stakes Canonical Items)

| Item | Location | Verdict |
|---|---|---|
| C-01 HIGH: CH₄ lighter than air → accumulates TOP | L03:308 + BranchingScenario:420 | **VERIFIED** |
| C-02 (prior "fix"): H₂S IDLH "50 ppm" — see Finding NEW-J1 above | L03:170, 296, 297, 299, 338 | **FLAGGED — SEE NEW-J1** |
| C-04 HIGH: LOTO verify-zero-energy entry gate | L02 red callout; BranchingScenario step4 | **VERIFIED** |
| C-06 MED: Glove re-test ≤6 months from last test | L05:335 — "intervals not exceeding **6 months from the date of the LAST TEST**" | **VERIFIED** — also confirmed via OSHA 2020 interpretation letter confirming 6-month interval per 29 CFR 1910.137(b)(2)(ii) |
| C-07 MED: Hospitalization "for treatment or observation" | L09:233 — "Any in-patient hospitalization (whether for treatment or observation)" | **VERIFIED** — 1904.39(a)(3) confirmed |
| CO IDLH 1,200 ppm: scale reference framing | L03:164 — "(For scale: NIOSH IDLH = 1,200 ppm...)" | **VERIFIED CORRECT** |
| Z359.4 fully purged | All T18 files grep → zero hits | **VERIFIED** |
| PFAS anchor 5,000 lbf per 1910.140(c)(13) | L04:275-276 | **VERIFIED** |
| ASTM D120 §10.3 6-month glove re-test interval | L05:335-336 | **VERIFIED** — confirmed via OSHA interp letter 2020-08-19 |

---

## 5. RT-I NEW-I1 Reconciliation — 100% Tie-Off Flashcard

RT-I found (LOW advisory): The flashcard back for "100% tie-off" (L04:157-160) mentions only twin-leg lanyards; the `key_terms` definition at L04:43-47 also includes "SRL plus positioning strap combination."

**Technical assessment:** RT-I's finding is accurate. The flashcard back reads: "Achieved with twin-leg lanyards: one leg connects to the new anchor before the other disconnects from the old anchor — no gap in fall protection." The key_terms entry includes the SRL+positioning strap path but the flashcard back omits it.

**Technical depth note:** The SRL+positioning strap combination is a real and increasingly common 100% tie-off method on poles (SRL provides continuous arrest protection during repositioning; positioning strap maintains work-position connection). Its omission from the flashcard does not create a false belief — twin-leg is the primary method. However, it creates an incomplete picture.

**Verdict: AGREE with RT-I — LOW advisory. Non-blocking.** Flashcard alignment fix is appropriate for the next polish pass.

---

## 6. Independent Gap-Research — Technical Lens

### Finding NEW-J1 (HIGH) — H₂S IDLH stated as 50 ppm throughout L03; actual NIOSH IDLH = 100 ppm

Fully detailed in Section 3e above.

**Fix required (4 locations in L03):**
1. L03:170 — "at 50 ppm = NIOSH IDLH — exit immediately" → "at 100 ppm = NIOSH IDLH — immediate threat to life; the exit threshold (> 1 ppm) is your actual field trigger, far before IDLH"
2. L03:296 — "NIOSH IDLH for H₂S is **50 ppm**" → "NIOSH IDLH for H₂S is **100 ppm**"
3. L03:297 — "At around 100 ppm (twice the IDLH)" → "At 100 ppm (the NIOSH IDLH itself)"
4. L03:299 — "50–100 ppm H₂S has already been above IDLH" → "At or above 100 ppm H₂S, you are at or above IDLH"
5. L03:338 source citation — "50 ppm IDLH" → "100 ppm IDLH"

**Note:** The lesson's operational exit trigger (>1 ppm exit immediately) is correctly conservative and should be retained unchanged. The IDLH is a reference value; the exit threshold is the operational action level.

### Finding NEW-J2 (LOW) — L03 H₂S olfactory paralysis concentration is now misattributed

Consequential to NEW-J1: L03:297 teaches "At around 100 ppm (twice the IDLH), H₂S completely paralyzes your sense of smell." Once IDLH is corrected to 100 ppm, the sentence should read "At around 100–150 ppm (at or above the IDLH), H₂S increasingly overwhelms the olfactory receptors." The 100+ ppm olfactory paralysis claim is physiologically accurate (ATSDR documentation supports rapid olfactory fatigue at >50 ppm, paralysis near 100 ppm); the sentence just needs the "twice the IDLH" parenthetical removed and replaced with the actual IDLH value as the reference.

### Finding NEW-J3 (CONFIRMED CORRECT — not a finding) — PFAS anchor engineered alternative path

The lesson addresses the 5,000 lbf requirement per 1910.140(c)(13) and correctly notes the "OR be designed by a qualified person with a safety factor of at least 2:1" alternative. L04:275-276 contains both options. The "2:1 safety factor" note is accurate (for a 1,800 lbf max arrest force × 2 = 3,600 lbf minimum anchor capacity under the engineered path). Coverage is complete for the audience. Not a finding.

### Finding NEW-J4 (CONFIRMED CORRECT — not a finding) — ASTM D120 §10.3 specificity

L05 cites "ASTM D120-14a §10.3" for the 6-month glove re-test interval. The latest edition is ASTM D120-22, but D120-14a (the then-current edition) is the edition that codified the 6-month interval that OSHA's 1910.137(b)(2)(ii) cross-references. The specific section citation may need updating to D120-22 §10.3 at next polish — LOW cosmetic item, not a content error.

---

## 7. Final Verdict

**Verdict: YELLOW (HIGH finding)**

**Summary:**

- **Polish-3 verification: CLEAN.** Z359.4 fully purged and replaced correctly (Z359.1 + Z359.11). Both titles verified exact match to primary sources (ANSI blog, ANSI store). CO IDLH 1,200 ppm correct (NIOSH 1994 revision confirmed). "For scale" framing is technically sound.
- **Gas physics: CLEAN.** CH₄ lighter/top, CO₂ heavier/bottom, H₂S heavier/bottom all correct post-canonical fixes.
- **Anchor/arrest force math: CLEAN.** 5,000 lbf, 1,800 lbf, 6 ft all verified against 29 CFR 1910.140.
- **PFAS regulatory citations: VERIFIED.** 1910.268(g)(1) 4-foot trigger, 1910.67(c)(2)(v) aerial lift, 1910.140(c)(13) anchor strength — all correctly cited.
- **Z359 citation titles: VERIFIED EXACT MATCH** from primary sources.

**NEW-J1 (HIGH) — H₂S IDLH 50 ppm throughout L03 is WRONG. NIOSH IDLH = 100 ppm (confirmed via NIOSH NPG NPGD0337, NIOSH IDLH page CAS 7783-06-4, OSHA H₂S hazards page — all consistent). The lesson conflates OSHA's 10-minute PEL ceiling (50 ppm) with the NIOSH IDLH (100 ppm). 5 locations in L03 require correction.**

**NEW-J2 (LOW) — "twice the IDLH" parenthetical in L03:297 is consequentially wrong once IDLH corrected; needs rewrite.**

**RT-I NEW-I1 reconciliation: AGREE — LOW advisory, non-blocking.**

**T18 ready to close: NO.** NEW-J1 is a HIGH factual error in safety-critical content. A fresh fix-agent targeting 5 specific locations in L03 is required, followed by a final-verify-4 RT pair before T18 can close.

**Saturation assessment:** The H₂S IDLH error (50 vs 100 ppm) survived 8 prior verification rounds because: (a) R-2 "fixed" it to 50 ppm (itself introducing the error by confusing OSHA PEL ceiling with NIOSH IDLH), and (b) all subsequent RTs accepted R-2's "fix" without independently querying the NIOSH primary source. RT-J's explicit WebSearch against NIOSH NPG and NIOSH IDLH documentation caught it. This is direct evidence that independent-source RT research (directive §3.22 "RT also does INDEPENDENT RESEARCH using DIFFERENT sources") is essential — not just re-verifying what prior RTs verified.

=== T18 FINAL-VERIFY-3 RT J TECHNICAL END ===
