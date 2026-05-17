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
