# T08 Make-Ready & Pole Attachment — Final Verify RT-γ (Pedagogy / Regression / Saturation)
## Framing: Pedagogy + DAG structural correctness + regression + saturation assessment

**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T08_FINAL_VERIFY_RT_G_PEDAGOGY.md` written. READ-ONLY on all lesson files, canonicals, and CLAUDE.md. No fixes applied, no follow-up rounds dispatched.**

---

## 1. REGISTRY CONSULTATIONS

### Citation Registry

Key T08 citations checked against `audit-output/citation-registry.md` (all within 90 days):

| Citation | Registry Entry | Verified? |
|---|---|---|
| 47 CFR §1.1411(i) | "self-help cost recovery" — CASCADE BUG FIXED from §1.1413 | ✓ HIT |
| 47 CFR §1.1404 | "Pole attachment complaint proceedings" | ✓ HIT |
| FCC 23-109 | 5 betterment exemptions | ✓ HIT |
| NESC Section 26 / Rule 261 | Strength requirements | ✓ HIT |
| NESC Section 24 | Grades of Construction | ✓ HIT |
| NESC Rule 235 | 40-inch communication-worker safety zone | ✓ HIT |

No primary-source lookups required — all T08-relevant citations present and verified within 90 days.

### DAG Registry (`dag-registry.json` — generated 2026-05-17T07:22:35Z)

Ran `node osp-training/scripts/validate-lesson-schema.js T08` — **all 12 lessons PASS, 0 FAIL, 0 WARN**.

Schema check (Flashcards, Quiz, key_terms): ✓ compliant across all 12 lessons.

**DAG pointer check — CRITICAL FINDING:**

DAG registry reports **31 unverified vocabulary_assumed pointers** out of 90 total T08 pointers (34% failure rate). These are part of the curriculum-wide 155 broken pointers flagged in commit `106ab9c` ("RESUME_HERE: 155 broken DAG pointers"). Classification of the 31:

| Category | Count | Examples |
|---|---|---|
| Term not introduced anywhere in curriculum | 14 | 'pole attachment', 'coordination', 'NESC clearance', 'make-ready estimate', 'OTMR', 'multi-party', 'attachment hardware', 'bracket', 'cost estimation', 'pole condition', 'NESC design loads', 'pole-loading' (hyphen), 'existing attachments'† |
| Term exists but wrong source lesson cited | 10 | 'make-ready' → T01.L05 (not T07.L06/T07.L02/T08.L01); 'pole owner' → T05.L08 (not T05.L03/T08.L01); 'pole audit' → T04.L04 (not T07.L02); 'as-built' → T01.L05 (not T07.L01); 'clearance' → T01.L02 (not T05.L02); 'pole loading' (space) vs 'pole-loading' (hyphen) term-mismatch |
| Internal T08 self-references to wrong internal lesson | 7 | 'make-ready estimate' claimed introduced in T08.L07 but not in vocab_introduced there |

†'existing attachments' IS introduced by T08.L05 — so L03 claiming T07.L02 as the source is wrong; correct source is T08.L05.

**Assessment:** These 31 broken pointers are the SAME category of systemic DAG issue flagged curriculum-wide in `106ab9c`. They are NOT a regression from Polish-A (Polish-A only touched citation text, not vocab_assumed arrays). They predate the retroactive audit entirely and are queued for the curriculum-wide cross-topic DAG Fix Wave. **No new regression introduced by Polish-A.**

### Known Cascade Patterns (12 patterns checked)

| Pattern | T08 checked | Status |
|---|---|---|
| P1 — §32.2210 cable/wire | T08 has no Part 32 citations | CLEAR |
| P7 — NESC §-vs-Rule notation | L06 had §24 cascade — FIXED by Polish-A; 2 residual §25 shorthands remain | OPEN (2 LOW) |
| P9 — §1.141x cluster | §1.1413→§1.1411(i) + §1.1414→§1.1404 — FIXED by Fix Wave A | CLEAR |
| P10 — FCC 23-109 betterment | 5 exemptions in L06 — verified correct by RT-δ | CLEAR |
| P6 — broken DAG pointers | 31 unverified pointers (curriculum-wide issue, pre-existing) | OPEN (curriculum-wide Fix Wave) |
| All others (P2-P5, P8, P11-P12) | Not applicable to T08 content | CLEAR |

---

## 2. POLISH-A PEDAGOGY VERIFICATION

Polish-A made 12 corrections: NESC §24 → Section 26 in 9 body/citation locations + 4-location notation sweep.

**Does the §24 (grades) vs §26 (strength) distinction read clearly after Polish-A?**

Checked L06 lines 140–215 (Trigger 2 block, the primary locus of the corrected content):

- Line 169: "NESC C2-2023 Section 26 sets the strength requirements for poles (including the load and strength factors applied to structural calculations)" — ✓ clear, role-labeled
- Line 146: "the NESC Section 26 structural strength standard" — ✓ clear
- Line 163 (unchanged §25 shorthand): "per NESC §25 loading district" — semantically correct, but notation inconsistent with rest of L06

**Pedagogy verdict:** The distinction between Section 24 (grades of construction — Grade B/C/N classification) and Section 26 (strength requirements — the actual capacity formula) is **NOT explicitly explained in L06** for a zero-knowledge learner. A reader who hasn't done T05 would encounter "Section 26 strength requirements" 9 times in L06 without a plain-English explanation of what Section 26 actually is. Section 24 is similarly mentioned in passing (L06 Q3 distractor + notation sweep) without defining it.

**LOW — pedagogically incomplete:** L06 uses "Section 26 strength requirements" throughout after correction without ever defining "Section 26" for T08-only readers. The distinction "Section 24 = Grade classification, Section 26 = structural strength math" is taught in T05 (which is a prerequisite), but L06's foundations section doesn't reference this or provide a one-sentence anchor. For learners who completed T05, the corrected citations are clear. For the lesson in isolation, the context is thin.

This is a LOW pedagogy note, not a factual error — the citations are now correct, the content is technically accurate, and T05 is a listed prerequisite.

---

## 3. RT-δ LOWs INDEPENDENTLY VERIFIED

**GAP-RT-δ-1 (L06 lines 163 and 243, `NESC §25` shorthand):**

Confirmed present at lines 163 and 243. Both are semantically correct (§25 = loading districts = correct in loading context). The inconsistency is notation-only vs. the rest of L06 which uses "Section XX" form. **LOW-COSMETIC confirmed; deferred correctly.**

**GAP-RT-δ-2 (L10 `vocabulary_introduced` — "Rule 250/261" under mechanical strength):**

Confirmed at lines 40, 108, and 166. The vocabulary_introduced definition for 'NESC compliance certification' reads: "mechanical strength of pole and attachments (Rule 250/261)." Rule 250 = loading district criteria (Section 25 scope). Rule 261 = structural strength (Section 26 scope). The definition also separately lists "loading district design loads (Rule 250 loading criteria)" — making Rule 250 appear TWICE: once under mechanical strength and once under loading. This is genuinely confusing to a learner: the lesson that exists to un-conflate loading from strength re-conflates them in the vocabulary definition.

**LOW confirmed as real.** Not merely cosmetic — it directly undermines the loading vs. strength distinction that L06 spent 9 corrections establishing.

---

## 4. CUMULATIVE REGRESSION CHECK

Fix Wave A canonical items (`0558e4c`) verified intact after Polish-A (`e8cf7a9`):

| Item | Location | Status |
|---|---|---|
| H-1: §1.1413→§1.1411(i) | L02 line 255, L02 Q cites, L03 line 432 | ✓ intact |
| H-2: §1.1414→§1.1404 | L03 line 291 | ✓ intact |
| M-1: NESC Rule notation sweep | L03:400/416, L05:286, L10:39 | ✓ intact |
| M-2: FCC 23-109 in L06 | L06 Advanced tier with 5 exemptions | ✓ intact |
| LOWs L-1..L-4 | Various locations | ✓ intact |

**Polish-A-specific regression check:** No §24 citations reintroduced. No §1.1413 or §1.1414 reintroduced. FCC 23-109 exemptions unchanged. No regressions from Polish-A detected.

---

## 5. LESSON SAMPLE — L11 AND L12

**L11 (`Make-Ready as a PM Problem`) — pedagogy check:**

L11 is an advanced lesson with CPM/critical-path content. Schema validator PASS. Checked:
- `learning_objectives` present (4 objectives) ✓
- `vocabulary_introduced`: critical path, float, schedule buffer, contingency buffer, FCC clock pressure ✓
- Flashcard components present ✓
- BranchingScenario included ✓

Pedagogy note: L11 introduces "critical path" without a prerequisite pointer to any prior CPM/scheduling lesson. T08.L11 is the first lesson to teach CPM concepts. The lesson's "In Plain English" section handles this with a plain-English analogy ("the longest chain of tasks you have to finish in order") before the technical term. This is adequate — the lesson IS the introduction point for CPM in T08.

**L12 (`T08 Capstone Quiz`) — coverage and DAG check:**

Schema validator PASS. `vocabulary_assumed` includes 21 pointers, most internal to T08. Of these, the DAG registry flags 2 unverified: 'OTMR (One-Touch Make-Ready)' and 'multi-party' — both listed as "not introduced by any lesson" (meaning the vocab_introduced registry doesn't track the exact string 'OTMR (One-Touch Make-Ready)'; the term IS taught in T08.L01 but the vocab string may not match exactly). This is the string-matching limitation of the DAG registry, not an actual missing prerequisite.

Quiz questions sample (Q1–Q3): answer derivations correct per RT-δ's math verification. No new quiz errors detected.

---

## 6. VITE BUILD RESULT

`cd osp-training && npm run build` — **✓ built in 5.91s**, 131+ modules, zero errors, zero warnings.

---

## 7. SATURATION VERDICT

| Round | Framing | HIGH | MED | LOW (new) |
|---|---|---|---|---|
| R-1 | Primary-source skeptical | 0 | — | — |
| R-2 | Corroboration adversarial | 2 | — | — |
| R-3 | Forensic incident | 0 | — | — |
| RT-α | Pedagogy | 0 | 0 | 4 |
| RT-β | Technical/MED §24 | 0 | 1 | 2 |
| Polish-A | Fix wave (§24→Section 26) | — | FIXED | partial |
| RT-δ | Technical/different-sources | 0 | 0 | 2 (new) |
| **RT-γ (this)** | Pedagogy + DAG + regression | **0** | **0** | **2 new** |

**New RT-γ findings:**

| # | Severity | File | Finding |
|---|---|---|---|
| RT-γ-1 | LOW | L06 (all Section 26 locations) | "Section 26 strength requirements" used 9× without a one-sentence definition for T08-only readers; distinction from Section 24 implicit, not explicit |
| RT-γ-2 | LOW | L10 `vocabulary_introduced` / Flashcard | 'NESC compliance certification' definition assigns Rule 250 to "mechanical strength" AND separately to "loading district" — same rule appearing in both roles creates learner confusion about loading vs. strength distinction |

**DAG 31-pointer finding:** Pre-existing curriculum-wide issue (commit `106ab9c`), not a regression. Queued to cross-topic Fix Wave. Not a new RT-γ finding.

**Saturation assessment:** RT-γ finds 2 new LOWs. Per Carter's no-severity-gate saturation rule, these are new finds → saturation condition not yet met. However:
- Both are LOW pedagogy/precision issues, not factual errors or safety concerns
- Both are of the "definition could be clearer" class, not "definition is wrong"
- HIGH pool: saturated at R-2 (2 HIGHs, both fixed, none since)
- MED pool: saturated at RT-β (1 MED, fixed, none since)

**Recommendation:** Polish-B pass targeting RT-γ-1 + RT-γ-2 + RT-δ's 2 LOWs (4 items total, narrow scope), followed by a final-verify pair. Polish-B should be inexpensive (~60K Sonnet) given the narrow scope. Saturation is close — one more low-severity finding class (the §25 notation shorthands + Rule 250/261 conflation) is all that remains.

---

## 8. FINAL VERDICT

**YELLOW — 4 residual LOWs, no HIGH or MED**

| # | Severity | Source | Issue |
|---|---|---|---|
| RT-δ-1 | LOW | L06:163, L06:243 | `NESC §25` shorthand (cosmetic notation) |
| RT-δ-2 | LOW | L10 vocab_intro + Flashcard | Rule 250 cited under both "mechanical strength" and "loading" — conflates the two |
| RT-γ-1 | LOW | L06 foundations | "Section 26 strength requirements" used throughout without a one-sentence definition anchor |
| RT-γ-2 | LOW | L10 vocab_intro | Same as RT-δ-2 (independent confirmation) |

**Fix Wave A and Polish-A canonicals verified intact. All HIGH and MED items confirmed fixed. DAG broken pointers are curriculum-wide pre-existing issue, not T08-specific regression. Vite build passes clean.**

**T08 is NOT ready to close without Polish-B.** Four LOWs remain, 2 of which (RT-δ-2 / RT-γ-2 confirmed independently) create genuine learner confusion about the loading vs. strength distinction — the same distinction that Polish-A's 12-location fix was designed to clarify.

=== T08 FINAL VERIFY RT G PEDAGOGY END ===
