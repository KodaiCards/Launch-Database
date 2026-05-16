# T18 Final-Verify-4 RT-K — Pedagogy + Coverage + Primary-Source Verification

**Constraints acknowledged:** I did NOT modify any lesson file, canonical file, CLAUDE.md, ARCH.md, course-catalog.js, SLEEP_SNAPSHOT.md, HANDOFF.md, or pending-dispatches.md. Write-path allowlist: `audit-output/osp-retroactive-audit/T18_FINAL_VERIFY_RT_K_PEDAGOGY.md` ONLY. Pre-push `git diff --stat origin/main..HEAD` will show only this file.

**Framing:** Senior OSP engineer + curriculum reviewer + field safety officer + NIOSH-certified industrial hygienist. Pedagogy / coverage / primary-source verification lens. Independent pass conducted with fresh web research BEFORE reading prior RT reports (except for locating the polish-4 commit SHA for context framing).

**HEAD SHA at review:** `7d203b9` (T18 lessons last touched at `ad3c3ee` polish-4)
**Date:** 2026-05-16

---

## 1. NIOSH IDLH Primary-Source Verification Table

Two independent source families confirmed. CDC/NIOSH primary URLs return HTTP 403 in this environment; verification performed via web search result snippets and secondary sources that directly quote from the NIOSH IDLH documentation and NPG.

| Source | URL referenced in search results | IDLH value stated | Quote / verbatim excerpt |
|---|---|---|---|
| NIOSH IDLH documentation CAS 7783-06-4 (H₂S, revised 1994) | cdc.gov/niosh/idlh/7783064.html | **100 ppm** | "The revised IDLH for hydrogen sulfide is 100 ppm based on acute inhalation toxicity data in humans" — consistently surfaced across all NIOSH/CDC search result snippets |
| NIOSH Pocket Guide to Chemical Hazards, H₂S entry (NPGD0337) | cdc.gov/niosh/npg/npgd0337.html | **100 ppm** | IDLH = 100 ppm; NIOSH REL = C 10 ppm (15-min ceiling); OSHA PEL per general industry Table Z-2: 20 ppm ceiling / 50 ppm 10-min peak (NOT a STEL — a time-limited peak exception for general industry); confirmed via search result summary |

**Additional cross-check:** OSHA hydrogen sulfide hazards page (osha.gov/hydrogen-sulfide/hazards) states "exposures at or above 100 ppm are considered immediately dangerous" — independent corroboration of 100 ppm IDLH.

**IDLH = 100 ppm: CONFIRMED from 2 independent NIOSH/CDC source families.** The lesson's current state (post-polish-4) teaches 100 ppm — CORRECT.

### Clarification on OSHA STEL vs NIOSH IDLH

The task prompt asked to verify "10 ppm = OSHA STEL (per 1910.1000 Table Z-2)." **This claim does NOT appear in L03.** Verified:
- OSHA Table Z-2 for general industry (1910.1000): ceiling = 20 ppm; acceptable 10-min peak exception = 50 ppm. **No STEL listed.**
- ACGIH TLV-STEL (current, adopted 2010): 5 ppm (revised down from prior 15 ppm). **Not cited in L03.**
- L03 uses "10 ppm" only as the pellistor sensor poisoning threshold — factually correct and not an IDLH/STEL claim.
- L03 exit threshold for H₂S (> 1 ppm: exit immediately) is appropriately conservative.

---

## 2. Polish-4 Verification — 5 L03 Locations

Diff verified via `git show ad3c3ee -- osp-training/src/lessons/T18/L03-confined-space-entry.jsx`.

| Location (L03 current line) | Before polish-4 | After polish-4 | Verdict |
|---|---|---|---|
| Line 170: Table action column | "at 50 ppm = NIOSH IDLH — exit immediately" | "at 100 ppm = NIOSH IDLH — exit immediately, no re-entry without SCBA" | **VERIFIED CORRECT** — 100 ppm confirmed; SCBA re-entry note added ✓ |
| Line 296: Advanced prose IDLH statement | "The NIOSH IDLH for H₂S is **50 ppm**" | "The NIOSH IDLH for H₂S is **100 ppm**" | **VERIFIED CORRECT** — bold 100 ppm, primary source cited ✓ |
| Line 297–299: Prose olfactory paralysis | "at 50 ppm you must exit immediately. At around 100 ppm (twice the IDLH)..." | "at or above 100 ppm you must exit immediately… At the IDLH (100 ppm), H₂S can induce olfactory paralysis within minutes" | **VERIFIED CORRECT** — "twice the IDLH" parenthetical eliminated; olfactory paralysis placed AT 100 ppm ✓ |
| Line 304: "above IDLH" reference | "50–100 ppm H₂S has already been above IDLH" | Rewritten to "Workers who descend into an H₂S environment above IDLH don't feel dizzy and climb out. They fall." (no specific ppm boundary claim) | **VERIFIED CORRECT** — incorrect 50 ppm boundary eliminated; statement now refers to IDLH (100 ppm) correctly ✓ |
| Lines 338–340: Footer citation | "NIOSH IDLH documentation… 50 ppm IDLH." | "NIOSH IDLH documentation CAS 7783-06-4 (H₂S, revised 1994) — 100 ppm IDLH (cdc.gov/niosh/idlh/7783064.html); NIOSH Pocket Guide to Chemical Hazards, H₂S entry (cdc.gov/niosh/npg/npgd0337.html)." | **VERIFIED CORRECT** — both NPG and IDLH doc URLs added; 100 ppm stated ✓ |

**All 5 polish-4 locations: CLEAN.** NEW-J1 HIGH fully remediated. NEW-J2 LOW resolved ("twice the IDLH" eliminated, olfactory paralysis correctly placed at 100 ppm).

---

## 3. "50 ppm" Survivor Scan

`grep -rn "50 ppm" /home/user/Launch-Database/osp-training/src/lessons/T18/` returns exactly one hit:

```
L03:285 — "last Tuesday may have H₂S at 50 ppm today because a sewer main cracked two blocks away."
```

**Assessment:** This is a field-scenario concentration example, NOT an IDLH claim. Context: prose teaching that sewer gas accumulation is unpredictable and the monitor should always be used. 50 ppm is a plausible field-scenario concentration that illustrates real danger (it exceeds the 1 ppm exit threshold and the OSHA 20 ppm general industry ceiling) without being misattributed as an IDLH value. The polish-4 commit message explicitly confirms: "neighborhood scan confirms line~285 '50 ppm today' is a scenario concentration (correct), not an IDLH claim — no change needed there." **CORRECT — no change required.**

**No surviving 50 ppm IDLH claims anywhere in T18.** ✓

---

## 4. Regression Check — Prior Fix Families

### 4a. Polish-1 fixes

| Fix | Location | Verified |
|---|---|---|
| Gap-1: L09 Sortable component added | L09 line 7 import + line 326 render | **VERIFIED** — Sortable imported and rendered |
| Gap-D1: L03 CO TLV-TWA basis attributed correctly | L03:163 — "< 25 ppm (ACGIH TLV-TWA)" | **VERIFIED** |
| Gap-D2: L03 pellistor H₂S poisoning callout | L03:326–333 | **VERIFIED** — "H₂S concentrations above 10 ppm can irreversibly poison catalytic bead (pellistor) LEL sensors" ✓ |
| C-19: L03 Q1 citation corrected | L03:562–563 — "29 CFR 1910.268(o) … 29 CFR 1910.5(c)(1)" | **VERIFIED** |

### 4b. Polish-2 fixes

| Fix | Location | Verified |
|---|---|---|
| NEW-E2: L09 near-miss voluntary status + enforcement-policy caveat | L09:37–39 + L09:160–162 | **VERIFIED** — "OSHA has stated it will not use voluntary near-miss reports as a basis for citations… but this is an enforcement policy, not an absolute statutory immunity" ✓ |
| NEW-E5: L08 cross-ref to L03 atmospheric testing | L08:230 — "monitoring procedures and IDLH thresholds — the forced-air blower requirement" | **VERIFIED** |
| NEW-F1: L03 CO IDLH "For scale" framing | L03:164 — "(For scale: NIOSH IDLH = 1,200 ppm = immediate threat to life — the 25 ppm exit threshold in column 4 is your actual trigger, far before IDLH.)" | **VERIFIED** — competing-signal risk eliminated; CO IDLH 1,200 ppm correct (NIOSH 1994 revision confirmed) ✓ |
| NEW-F3: L04 PFAS anchor content intact | L04:30–50 flashcard/key_terms, L04:200–290 PFAS section | **VERIFIED** |

### 4c. Polish-3 fixes

| Fix | Location | Verified |
|---|---|---|
| NEW-G1: Z359.4 → Z359.1+Z359.11 (3 L04 locations) | L04:214–218, L04:423, L04:469 | **VERIFIED** — Z359.1 ("The Fall Protection Code") + Z359.11 (Full Body Harnesses) at all 3 locations ✓ |
| NEW-G1 purge: No Z359.4 anywhere in T18 | `grep -rn "Z359\.4"` → zero results | **VERIFIED CLEAN** ✓ |
| NEW-G2: CO IDLH softened via "For scale" framing | L03:164 | **VERIFIED** (same as NEW-F1 fix that was applied at polish-2; confirmed no regression) |

### 4d. Original 30-canonical HIGH-priority spot-check

| Canonical item | Location | Verified |
|---|---|---|
| C-01 HIGH: Methane LIGHTER than air, accumulates at TOP | L03:308-309 "methane (natural gas, CH₄) is LIGHTER than air and accumulates at the TOP — near the ceiling" | **VERIFIED** ✓ |
| C-01 (Branching): CO₂ + H₂S denser, settle to bottom | L03:422 BranchingScenario | **VERIFIED** ✓ |
| C-03 HIGH: Nitrogen near-neutral (no incorrect density claim) | L03:309 "Nitrogen is near-neutral" — no "nitrogen heavier/bottom" claim survives | **VERIFIED** ✓ |
| C-04 HIGH: LOTO verify-zero-energy entry gate | L02:148–157 red callout; L10:655–661 BranchingScenario; L10:160–171 quiz correct answer | **VERIFIED** — "This is the ENTRY GATE: no part of your body enters the danger zone until this step is complete" ✓ |
| C-07 MED: Hospitalization "for treatment or observation" | L09:233 | **VERIFIED** |
| CO IDLH 1,200 ppm (polish-3 "For scale" framing) | L03:164 | **VERIFIED** ✓ |

---

## 5. Independent Gap Research — Pedagogy + Coverage Lens

### Gap-K1 (LOW — advisory) — Olfactory paralysis concentration precision

The lesson states "At the IDLH (100 ppm), H₂S can induce olfactory paralysis within minutes." Independent research (NCBI Bookshelf, OSHA H₂S Acute Exposure Guideline Levels) shows: olfactory fatigue at 100 ppm; full olfactory nerve paralysis reported at 150 ppm per Poda 1966 (cited in NIOSH NPG). The lesson's "can induce olfactory paralysis within minutes" at 100 ppm is: (a) technically slightly aggressive (fatigue at 100 ppm; paralysis at 150 ppm per literature); (b) erring conservatively / protectively; (c) consistent with OSHA training-context language ("olfactory nerve is paralyzed after a few inhalations" at 100–150 ppm range). **Pedagogically appropriate.** Workers should not rely on smell as a warning — the exact ppm threshold for full vs. partial olfactory loss is less important than the lesson's core message. **Non-blocking LOW. No change required.** If future polish wants precision, the sentence could say "At or near the IDLH (100–150 ppm), H₂S rapidly overwhelms and paralyzes the sense of smell."

### Gap-K2 (ADVISORY) — OSHA construction H₂S PEL vs. general industry

OSHA Table Z-2 general industry: 20 ppm ceiling / 50 ppm 10-min peak. OSHA construction (29 CFR 1926.55): 10 ppm TWA. The lesson does not distinguish these. For an OSP field crew (often performing construction work including trenching, boring, underground vault installations), the construction PEL of 10 ppm TWA may apply — yet the lesson only cites the general industry Table Z-2 framework. The practical effect is that the lesson's exit threshold (> 1 ppm: exit immediately) is MORE conservative than either standard, so no safety gap exists in current operations. But technically-aware learners may notice the omission. **LOW advisory — non-blocking.** A single sentence acknowledging construction-PEL applicability for underground OSP work would be complete coverage; however, the conservative exit threshold (1 ppm) already supersedes both standards operationally.

### Gap-K3 (CONFIRM CORRECT — not a finding) — ACGIH STEL vs. lesson content

The lesson does not claim "OSHA STEL = 10 ppm." Verified explicitly. The only reference to "10 ppm" is the pellistor sensor poisoning threshold, which is independently correct. The ACGIH TLV-STEL of 5 ppm (current, since 2010 revision from prior 15 ppm) is not cited in the lesson, but the lesson's exit threshold (1 ppm) is more conservative than any STEL. No accuracy error.

### Gap-K4 (CONFIRM CORRECT — not a finding) — Scenario 50 ppm

L03:285 "H₂S at 50 ppm today" is a scenario concentration illustrating accumulation risk. It is not misattributed as IDLH. The pedagogical point (conditions change; always test) is correct and effective. No change.

---

## 6. Final Verdict

**Verdict: GREEN**

**Summary:**
- **NIOSH IDLH = 100 ppm: INDEPENDENTLY VERIFIED from 2 NIOSH/CDC source families** (idlh/7783064 + npgd0337). The 50 ppm error that survived 4 prior RT rounds is fully corrected.
- **All 5 polish-4 L03 locations: CLEAN.** Correct values, no residual 50 ppm IDLH claims, olfactory paralysis placed correctly AT the 100 ppm IDLH, footer citation includes both NIOSH URLs.
- **50 ppm survivor scan: ONE occurrence at L03:285, correctly identified as scenario concentration, not IDLH claim.**
- **All prior fix families (polish-1, 2, 3 + 30 canonical HIGH-priority items): VERIFIED intact.** No regressions detected.
- **Gas physics correct:** CH₄ LIGHTER/TOP, CO₂ heavier/BOTTOM, H₂S heavier/BOTTOM, N₂ near-neutral — all canonical fixes holding.
- **LOTO verify-zero-energy entry gate: CORRECTLY TAUGHT** in L02, L10 branching scenario, and L10 quiz. "This is the ENTRY GATE" language confirmed.
- **Z359.4: FULLY PURGED** — zero occurrences in all T18 files. Z359.1+Z359.11 pair correctly placed at all 3 L04 locations.
- **CO IDLH 1,200 ppm "For scale" framing: VERIFIED CORRECT** — competing-signal risk eliminated, context positioning sound.
- **Independent gap finds: 2 LOW advisories** (Gap-K1 olfactory paralysis precision; Gap-K2 construction PEL omission) — both non-blocking. No new HIGH or MED findings.

**T18 ready to close: YES** — with acknowledgment of 2 LOW advisory items that are appropriate for future polish if desired but do not block closure. Safety-critical content (H₂S IDLH, methane density, LOTO entry gate, CO IDLH, nitrogen density, Z359 citations) is all correct.

**Saturation assessment:** NEW-J1 HIGH was the last blocking finding. It has been remediated and verified. No new HIGH or MED findings surfaced in this pass. Saturation condition met.

=== T18 FINAL-VERIFY-4 RT K PEDAGOGY END ===
