# Resume Pointer — 2026-05-17 paused early (usage cap)

## In-flight when paused (will land + need orchestrator acknowledgment only)
- T08 RT-γ pedagogy (final-verify pair-mate to RT-δ). Read result, log YELLOW/GREEN.
- T06 R-1 retroactive audit (primary-source-skeptical). Read result, queue R-2 for next resume.

## T08 closeout (do FIRST on resume)
- RT-δ `3e6b1be` landed YELLOW with 2 LOWs:
  - L06 lines 163/243 `NESC §25` shorthand (cosmetic)
  - L10 vocab_introduced "Rule 250/261" bundled — separate Rule 250 (loading) from Rule 261 (strength)
- HIGH+MED saturated. All Fix Wave A canonicals intact.
- **Decision pending RT-γ:** if RT-γ also returns YELLOW/GREEN with no new HIGH/MED, dispatch Polish-B (2 LOWs above) -> final-verify pair -> close T08.

## T06 retroactive audit queue
- R-1 in flight when paused
- After R-1: R-2 corroboration-adversarial framing (sequential, DIFFERENT framing same scope)
- Then saturation per Carter's no-severity-gate rule

## After T08 + T06 close
- T07 retroactive audit (same pipeline)
- T03 retroactive audit (was earlier-wave, never got full retroactive treatment)
- Then continue forward queue (per directive 21 no-stop)

## Token state at pause
- Carter flagged "about to run out of usage" 2026-05-17
- Don't dispatch new agents on resume until cap reset verified
- Orchestrator acknowledges in-flight landings minimally — no narration

## Cross-wave open polish items (carried from CLAUDE.md §4 Polish Tracker)
- P5 T08 contingency range -> already handled by current T08 wave
- P6 T02.L08 OM1/OM2 Flashcard render -> T02 retroactive polish
- P7 T02/T03 G.655 -> T02 retroactive + T03 audit
- P9 T04 L07 §32.2210/§32.2410/§32.2420 -> T04 back-fill sweep

## Update — T06 R-1 landed during pause

T06 R-1 verdict: YELLOW. 3 HIGH + 4 MED + 2 LOW. Math clean. Vite clean.

**3 HIGH:**
- T06-H1: L09 NESC §32 vs §35 framing entirely wrong (comm/supply split is fictional — Section 32 = Underground Conduit Systems supply infra, §33 = Supply Cable, §35 = Direct-Buried both supply+comm; comm/supply separation lives in Rule 320, Rule 353/354)
- T06-H2: T06.L01 vocab_assumed "soil type" → T04.L03 (GIS lesson) — soil type not introduced anywhere
- T06-H3: T06.L01 vocab_assumed "route alignment" → T04.L02 (Drone/LiDAR) — route alignment not introduced anywhere

**4 MED:**
- T06-M1: L04 "40% fill — NEC Chapter 9 Table 1" — wrong; NEC 770.110(B) + 800.110(B) exempt comm cables from Chapter 9 fill tables. 40% is industry convention not NEC mandate.
- T06-M2: L06 annotated diagram cites "NESC §35 6-inch minimum" comm-crossing-supply — wrong section (cascade with H1)
- T06-M3: CGA Best Practices cited as v19 — current is v20.0 (2024)
- T06-M4: T06.L01 vocab_assumed "conduit" → T04.L01 — should be T01.L02

**Next on resume (T06):** Dispatch R-2 corroboration-adversarial framing (sequential, SAME scope DIFFERENT framing). R-2 hint: sample L05 (H-20/H-25 ratings, 330 ft pedestal spacing), L07 (HDD slurry/frac-out), L08 (pedestal spacing standards).

**Saturation rule applies:** continue R-3+ until no new finds.


## Update — T06 R-2 landed `7df11fa`

R-1 reconciliation: all 9 AGREE, no conflicts.

**4 NEW findings:**
- R2-N1 HIGH: L09:306 `47 CFR §32.2210` → `§32.2410` (Cable and wire facilities). Same P9 systemic bug from T04 propagated.
- R2-N2 HIGH: L09 missing NESC §34 (= Underground Communication Cable). Whole lesson conceptual framework wrong — attributes §34 scope to §32. Flashcards/quizzes/LOs all need rework.
- R2-N3 MED: L07:186 bentonite "controlled waste" wrong (non-hazardous inert clay). Misleading for crews.
- R2-N4 MED: L05 H-20 = "20-ton axle" + L08.Q3 H-20 = "10-ton axle" — both wrong + contradictory. AASHTO H-20 = 40,000 lb GVW two-axle, rear axle 32,000 lb.

R-2 self-assesses saturation reached. But per Carter's no-severity-gate rule, R-2 found 2 NEW HIGH → dispatch R-3 before fix wave.

**Next on resume (T06):** R-3 forensic/field-failure framing. Verify R-2's NESC §34 + §32.2410 claims via DIFFERENT sources (cascade-defense). Sweep remaining T06 lessons for cascade bugs.

**T06 canonical accumulating:** 5 HIGH (R-1: 3 + R-2: 2) + 6 MED (R-1: 4 + R-2: 2) + 2 LOW. Heavy fix wave + 2-RT pair + polish + final-verify pair anticipated.

## Update — Haiku §34 vs §35 tiebreaker resolved `51f4482`

- §34 = Cable in underground structures (vaults/conduits/handholes) — supply + comm
- §35 = Direct-Buried Cable and Cable in Duct Not Part of a Conduit System — supply + comm
- Distinction is LOCATION not cable type
- **R-2's H1 specific claim "§34 = comm exclusively" REFUTED.** R-3 correct.

**Impact on T06 Fix Wave A canonical:** drop R-2's "add §34 framework" instruction. Keep R-1's §32/§35 framework correction (§32=supply conduit, §33=supply cable, §35=direct-buried both). Lesson does NOT need §34 added.

**Haiku ground-truth efficiency confirmed:** 89K tokens / 38 sec / definitive on section-title question. Perfect role for this class.

## Update — Infrastructure landed `6bd224f` + curriculum-wide bug findings

Schema validator + DAG registry + citation registry all working. Validator caught REAL bugs that per-topic audits missed:

**Systematic curriculum-wide bugs (queued for cross-topic Fix Wave after retroactive audits close):**

| # | Bug | Scope | Source |
|---|---|---|---|
| C-1 | 47 lessons missing `learning_objectives` in meta | T02/T03/T04/T18/T19 | validator |
| C-2 | 155 broken DAG pointers (12.9% error rate) | All topics | dag-registry.json |
| C-3 | "pole" assumed by 19 lessons but never introduced | T07/T08/T05 etc | dag-registry |
| C-4 | EDS/RTS never introduced anywhere | T05 references | dag-registry |
| C-5 | T19.L08 references T11.L01 (doesn't exist) | T19 | validator |

These are CHEAPER to fix as a single curriculum-wide sweep than per-topic. Queue after T03/T06/T07/T08 retroactive audits close.

**Available tooling for future audits/RTs:**
- `audit-output/citation-registry.md` (30+ verified citations + 6 cascade-resolved entries)
- `audit-output/dag-registry.json` (1042 verified pointers, 155 broken — listed)
- `audit-output/known-cascade-patterns.md` (12 patterns)
- `osp-training/scripts/validate-lesson-schema.js` (5 sec runtime)
- agent-protocol.md §14 (registry usage rule)

Future audits should use these BEFORE manual checks. Should cut ~30-50% of mechanical audit work.

## T08 CLOSED ✅ 2026-05-17 overnight

Final SHA: `bd28816` (RT-ζ GREEN).

Full T08 retroactive arc:
- R-1 + R-2 + R-3 audit (3 framings, ~350K)
- Fix Wave A `0558e4c`: 2 HIGH (§1.1413→§1.1411(i), §1.1414→§1.1404) + 2 MED (NESC notation, FCC 23-109 betterment) + 4 LOW
- RT-α YELLOW + RT-β cascade catch (§24→§26)
- Polish-A `e8cf7a9`: 12 L06 §24→§26 + 4 notation sweep
- RT-γ + RT-δ YELLOW (4 LOWs)
- Polish-B `870b65f`: §25 notation + Section 26 anchor + Rule 250/261 split
- RT-ε `87995a2` GREEN + RT-ζ `bd28816` GREEN

Total Sonnet burn ~1.6M. Bugs caught/fixed: 2 HIGH + 3 MED + 8 LOW. Vite clean throughout. Validator 12/12 PASS post-close.

**T05 Polish queue add:** RT-ζ flagged Rule 261 citation-registry entry uses T05's "Grades B/C/N triggers" framing but T08 teaches "strength of line supports" — T08 is more accurate per NESC. Haiku ground-truth tiebreaker needed during next T05 polish wave; registry update accordingly.

## T06 CLOSED ✅ 2026-05-17 overnight

Final SHA: `3ccdb4b` (RT-ζ GREEN).

Arc: R-1 + R-2 + R-3 + Haiku tiebreaker (~400K) → Fix Wave A `7488214` (15 canonical: 4 HIGH + 8 MED + 3 LOW) → 2 RT pair (HIGH regression L11 + CGA v19 sweep incomplete) → Polish-A `81d5e8e` → 2 RT pair (3 new LOWs RT-δ) → Polish-B `1a9a956` (Q6 hedge + H-20/HS-20 + 12 DAG pointers) → 2 RT pair GREEN/GREEN.

Burn ~1.4M Sonnet. Bugs caught/fixed: 4 HIGH + 8 MED + 9 LOW. Global broken-DAG count 152→139 (T06-internal 0).

**Outstanding queue:**
- T07 R-3 (R-2 found 2 NEW HIGH — saturation rule continues)
- T03 R-3 (R-2 found 5 new MEDs — saturation rule continues)
- After T07/T03 close: cross-topic curriculum-wide Fix Wave (47 missing LOs + 139 remaining broken DAG pointers + the 5 cross-topic DAG bugs RT-δ neighborhood scan flagged)

## T07 CLOSED ✅ 2026-05-17 overnight

Final SHA: `3c35d3c` (RT-δ GREEN).

Arc: R-1 + R-2 + R-3 (~430K) → Fix Wave A `25571c9` (17 items: 5 HIGH + 6 MED + 6 LOW) → 2 RT pair YELLOW (cross-topic 18/15.5 cascade catch) → Haiku tiebreaker `911128d` (15.5 ft comm, 18 ft supply per NESC Rule 232 Table 232-1) → Polish-A `07e16f7` → RT-γ caught L05 scope miss → Polish-B `a6d1614` → RT-δ GREEN.

Burn ~1.5M Sonnet. Bugs caught/fixed: 6 HIGH + 7 MED + 7 LOW = 20. T07 DAG broken 19→0 (perfect). Global 139→121.

**Outstanding queue:**
- T03 R-3 (R-2 found 5 new MEDs/LOWs — saturation rule continues)
- After T03 closes: cross-topic curriculum-wide Fix Wave (47 missing LOs + 121 remaining broken DAG pointers + the 5 cross-topic DAG bugs flagged earlier)

## T03 CLOSED ✅ 2026-05-18 (continuing past midnight UTC)

Final SHA: `7d40db8` (RT-δ GREEN).

Arc: R-1 + R-2 + R-3 + R-4 + R-5 (~700K, 5 framings) → Fix Wave A `d3216ac` (1 HIGH + 10 MED + 15 LOW + 9 DAG fixes: G.655/G.656 added L05 with comparison table + Flashcards; L05 unit error; NEC DAG; §770.179(B) framing; OPGW advanced L04; TIA-598-D color code L01; ADSS span guide L09; GR-20 pulling tension L08; learning_objectives all 12; NEC edition markers; ICEA confirm markers) → 2 RT pair YELLOW (NEC pointer L07 missing) → Polish-A `f0e39db` + Polish-B `0c803b0` (NEC pointers added across 6 lessons total) → 2 RT pair GREEN with editorial-only LOWs.

Burn ~1.7M Sonnet. Bugs caught/fixed: 1 HIGH + 10 MED + 15 LOW + 9 DAG. Validator 1/12 → 12/12 PASS. T03 DAG broken 0.

## OSP RETROACTIVE AUDIT PHASE COMPLETE ✅

All 9 originally-authored topics CLOSED under new saturation pipeline:
- T01 ✅ T02 ✅ T03 ✅ T04 ✅ T05 ✅ T06 ✅ T07 ✅ T08 ✓ (P5 polish remnant) T09 ✅ T18 ✅ T19 ✓ (under new pipeline)

Aggregate burn estimate: ~14M Sonnet across all retroactive audits. Bugs caught/fixed: ~50+ HIGH (cascade catches like H₂S IDLH 100ppm, OM5 EMB 4700 not 28000, 18ft/15.5ft Rule 232 cross-topic, methane density up not down) + ~80+ MED + ~120+ LOW.

## NEXT QUEUE (priority order)

### Cross-topic curriculum-wide sweep wave (HIGH priority — final retroactive cleanup)

1. **Vocab-pointer sweep** — same NEC pattern but for TIA, FOA, RUS, ICEA, ITU-T, NESC across T03 L01/L11/L12. Plus T07/T08 same pattern. Plus T05.L06 `radial ice thickness` should be vocab_assumed from T03.L09. Plus L04 ADSS+messenger dupe.
2. **5 cross-topic DAG bugs** flagged from earlier audits:
   - T07.L07 HDD pointer → T06.L01
   - T07.L07 open-cut term-string
   - T19.L01 conduit → T01.L02
   - T19.L09 feeder cable → T03.L08
   - T06.L04 conduit fill alias
3. **Polish Queue residuals** (P3, P5 from §4)

Estimated burn: ~600K-1M Sonnet single sweep wave (cheap relative to per-topic).

### OSP-RW remaining authoring (after sweep)
- T10-T17, T20-T22 (general remaining + cert prep tracks). 12 topics × ~1.5M = ~18M Sonnet.
- OSP-RW.6 Moodle teardown
- OSP-RW.7 E2E QA + production cut

### Then Launch-DB Phase 1-11 + future-build (attenuation calc, client portal, ISP course)
