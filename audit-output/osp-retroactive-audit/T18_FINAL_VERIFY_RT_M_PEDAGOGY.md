# T18 FINAL-VERIFY-5 RT-M — Pedagogy + Coverage + Citation-Existence Verification

**Constraints acknowledged: I have NOT written to any lesson file, NOT created or modified any *_CANONICAL.md, NOT written to CLAUDE.md / ARCH.md / course-catalog.js / SLEEP_SNAPSHOT.md / HANDOFF.md / pending-dispatches.md. Write-path allowlist: this report file ONLY.**

**Framing:** Senior OSP engineer + curriculum reviewer + field safety officer + NIOSH-certified IH. Pedagogy / coverage / citation-existence / directive-18z / gap-research lens. HEAD SHA reviewed: `9b73263`.

---

## 1. Polish-5 Verification (Gap-K1 + Gap-K2)

### Gap-K1: Olfactory paralysis precision (L03:298–300)

**Before polish-5:** "H₂S can induce olfactory paralysis within minutes" placed AT 100 ppm IDLH.

**After polish-5 (verified at L03:298–302):**
> "At the IDLH (100 ppm), H₂S induces **olfactory fatigue** within minutes — workers lose the smell-warning signal precisely AT the immediate-danger threshold. Full olfactory **nerve paralysis** can occur at 150 ppm and above. Either way, smell-warning becomes unreliable at the immediate-danger threshold — a calibrated monitor is the only reliable detection."

**Verdict: VERIFIED CORRECT.** Gap-K1 fix accurately distinguishes fatigue (100 ppm) from nerve paralysis (150 ppm+) per NIOSH NPG and ATSDR literature. Safety message preserved and strengthened.

### Gap-K2: OSHA construction PEL distinction (L03:337–350)

**Before polish-5:** No mention of 29 CFR 1926.55.

**After polish-5 (verified at L03:338–350):**
> "OSHA Construction (29 CFR 1926.55) sets an H₂S PEL of **10 ppm TWA**. OSHA General Industry (29 CFR 1910.1000 Table Z-2) sets a **20 ppm ceiling** with a **50 ppm 10-minute peak** maximum. The NIOSH IDLH of 100 ppm used throughout this lesson is a separate threshold…"

**Verdict: VERIFIED CORRECT.** Gap-K2 fix adds the construction PEL callout block with correct values and clear framing separating it from the NIOSH IDLH. Citations are accurate (1926.55 + Table Z-2 values independently confirmed by RT-K and RT-L).

---

## 2. RT-L-1 Status (Pellistor "Irreversibly Poison" Claim — Held/Deferred)

**Verified at L03:328–329:**
> "H₂S concentrations above 10 ppm can **irreversibly** poison catalytic bead (pellistor) LEL sensors, causing the sensor to produce a persistent false-zero LEL reading even after the H₂S source is removed"

**Status: STILL PRESENT — orchestrator-adjudicated defer confirmed.**

RT-L identified this as LOW-to-MED: pellistor sensors are actually **reversible inhibitors** of H₂S, not irreversible poisons (irreversible poisoning is from silicones, phosphates, lead compounds). The recommended action (bump test after H₂S event) is correct; only the mechanism word is wrong.

Canonical notes the defer. The field safety message is protective and not directionally wrong. Independent assessment: consistent with orchestrator's adjudication — no severity escalation from this round.

---

## 3. Vite Build Result

`cd osp-training && npm run build`

**RESULT: BUILD CLEAN — ✓ built in 4.34s**

T18 lessons compile without errors. No broken imports, no syntax failures. T19 import typo (`255ecdf`) was the last CI fix; T18 is unaffected. All 10 T18 files (`L01`–`L10-capstone`) appear in chunk output.

---

## 4. Directive 18z Systemic Sweep — T18 vocabulary_introduced vs Flashcard Counts

| Lesson | vocab_introduced count | Flashcard cards rendered | Status |
|---|---|---|---|
| L01 Hazard Awareness | 7 | 7 | ✓ MATCH |
| L02 LOTO | 5 | 5 | ✓ MATCH |
| L03 Confined Space | 5 | 5 | ✓ MATCH |
| L04 Fall Protection | 6 | 6 | ✓ MATCH |
| L05 PPE | 6 | 6 | ✓ MATCH |
| L06 Traffic Control | 6 | 6 | ✓ MATCH |
| L07 Energized Conductors | 3 | 3 | ✓ MATCH |
| L08 Hazardous Materials | 3 | 4 | ✓ ACCEPTABLE (+1 supplemental: `sds-sec8`) |
| L09 Incident Reporting | 4 | 5 | ✓ ACCEPTABLE (+1 supplemental: `fc-severe`) |
| L10 Capstone | — | — | Capstone — no vocab_introduced (uses vocabulary_assumed from prior lessons) |

**Verdict: DIRECTIVE 18z FULLY SATISFIED.** Every lesson meets or exceeds the vocabulary_introduced count. L08 and L09 have supplemental bonus cards (acceptable per directive — over is fine, under is the violation). No lessons have fewer Flashcard cards than vocabulary_introduced terms. This is a clean pass on the systemic check that caught 41-card gaps in T05.

---

## 5. Regression Check

| Item | Location | Verified |
|---|---|---|
| CH₄ lighter than air / accumulates TOP | L03:308–309 | ✓ CLEAN |
| N₂ near-neutral (no "heavier/bottom" claim) | L03:309 | ✓ CLEAN |
| H₂S IDLH = 100 ppm (all locations) | L03:170, L03:296, L03:342 | ✓ CLEAN — no 50 ppm IDLH claim survives |
| "50 ppm today" = scenario concentration (not IDLH) | L03:285 | ✓ CLEAN — field scenario example |
| Z359.1 "The Fall Protection Code" + Z359.11 "Full Body Harnesses" | L04:214–218, L04:423, L04:469 | ✓ CLEAN — no Z359.4 or Z359.2 anywhere |
| `grep -rn "Z359\.4"` → zero results | T18 entire | ✓ CLEAN |
| CO IDLH = 1,200 ppm "For scale" framing | L03:164 | ✓ CLEAN |
| LOTO verify-zero-energy entry gate emphasis | L02:148–157, L10 BranchingScenario | ✓ CLEAN |
| 1,800 lbf max arrest force | L04:200–203 | ✓ CLEAN |
| 5,000 lbf anchor per 1910.140(c)(13) | L04:271–276 | ✓ CLEAN |
| ASTM D120 glove re-test reference | L05:332–337 | ✓ CLEAN |
| T07.L01 `safety zone` → source T18.L01 (cross-topic DAG) | T07/L01:29 | ✓ CLEAN |
| T04.L01 `hazard recognition`, `confined space`, `LOTO`, `fall protection` → T18 sources | T04/L01:56–61 | ✓ CLEAN |
| T08.L01 prerequisites includes T18.L01 | T08/L01:18 | ✓ CLEAN |
| T07.L01 `span`, `sag`, `attachment point` → T01.L02 (not T05.L01) | T07/L01:26–30 | ✓ CLEAN |

No regressions detected to any prior polish (1/2/3/4) or any of the 30 canonical items from the 7-round audit.

---

## 6. Independent Gap Research (Pedagogy Lens)

### Cross-lesson terminology consistency — PASS
"Rubber insulating gloves" / "PPG glove class" terminology is consistent: L05 introduces `PPG glove class`, L07 correctly cites `source_lesson_id: 'T18.L05'`. No cross-lesson term collisions.

### Capstone quiz lesson coverage — PASS
L10 capstone `prerequisites` array lists all 9 source lessons (`T18.L01` through `T18.L09`). vocabulary_assumed entries map to correct source lesson IDs for each term. No capstone coverage gap detected.

### Gap-M1 (LOW — NEW): L09 `fc-severe` Flashcard card is supplemental but `key_terms` does not include a 'severe' entry
L09 has 4 `vocab_introduced` terms and 4 `key_terms`, but 5 Flashcard cards. The extra card (`T18-L09-fc-severe`) covers 29 CFR 1904.39 severe incident reporting timelines, which IS taught extensively in L09. However, `key_terms` doesn't include a matching entry for 'severe incident' / 'severe injury reporting'. This means the Flashcard content is consistent with the lesson body, but slightly orphaned from the meta schema (it renders correctly in the UI — acceptable supplemental card). **Severity: LOW informational.** The lesson content is correct; this is a schema-tidiness observation. No safety or accuracy issue.

### Gap-M2 (LOW — NEW): L08 vocabulary_introduced lists 'GHS' but does NOT list 'SDS' — yet SDS is taught extensively in L08
L08 teaches Safety Data Sheet (SDS) as a primary concept with full section breakdown, an annotated diagram, and a supplemental Flashcard (`sds-sec8`). The `vocabulary_introduced` array contains only `['PEL', 'TLV', 'GHS']`. SDS is in `vocabulary_assumed` (pointing to T18.L01 where it's introduced). This is technically correct — SDS is introduced in L01 and assumed in L08. **No issue.** On second look, this is resolved correctly by the DAG: SDS introduced L01, assumed L08. Gap-M2 dismissed.

### Gas behavior cross-check — all four gases PASS
- CH₄ (methane): lighter, accumulates top ✓
- H₂S: heavier (sp. gr. ~1.19), accumulates bottom ✓
- CO₂: heavier (sp. gr. ~1.52), accumulates bottom ✓
- N₂: near-neutral (sp. gr. ~0.97), displaces throughout ✓
- Multi-height testing instruction: test low for H₂S/CO₂, test near top for CH₄ ✓

All gas physics remain correct from RT-L's verification. No drift.

### LOTO entry-gate pedagogy check — PASS
L02 LOTO lesson explicitly calls the verify-zero-energy step as the "ENTRY GATE" (line 148–157 red callout). L10 capstone BranchingScenario reinforces this. OSHA 1910.147 citation is accurate. Teaching sequence (6-step lockout sequence with the verify-zero-energy step as the gate before entering the danger zone) is pedagogically correct and field-complete.

### L07 Energized Conductors — awareness scope maintained — PASS
L07 consistently restricts instruction to "awareness-level response" for non-1910.269-qualified workers. The `NOTE:` block in the lesson header explicitly states the lesson does NOT certify workers to work within the MAD. MAD lookup uses the OSHA MAD Calculator reference (osha.gov/power-generation/rulemaking/madcalculator). No false claims of qualification capability. Scope is correctly limited.

---

## 7. Final Verdict

**VERDICT: GREEN**

**Polish-5 confirmations:**
- Gap-K1 olfactory fatigue vs. nerve paralysis distinction: VERIFIED CORRECT ✓
- Gap-K2 construction PEL (1926.55) callout block: VERIFIED CORRECT ✓

**Vite build: CLEAN ✓ built in 4.34s**

**Directive 18z: ALL 9 lessons pass — no cards-less-than-vocab violations**

**Regressions: NONE detected across all 30 canonical items + all 5 polish stages**

**Cross-topic DAG: All T04/T07/T08 cross-references CLEAN**

**New findings this round:**
- Gap-M1: LOW informational — L09 `fc-severe` supplemental card has no matching `key_terms` entry (schema-tidiness only; lesson content and rendering are correct; no safety or accuracy issue)
- Gap-M2: Dismissed on inspection (SDS correctly in vocabulary_assumed from L01)

**RT-L-1 (pellistor "irreversibly") — deferred per orchestrator adjudication, still present, no escalation this round.**

**T18 ready to close?** YES — from pedagogy + coverage + directive-18z lens, T18 is saturated. The only remaining open item is the orchestrator-adjudicated RT-L-1 defer (pellistor mechanism word). If that defer is accepted, T18 is COMPLETE. If future pipeline decides to fix it, a single-sentence surgical fix + one final-verify confirmation would close it. No new blockers found this round.

=== T18 FINAL-VERIFY-5 RT M PEDAGOGY END ===
