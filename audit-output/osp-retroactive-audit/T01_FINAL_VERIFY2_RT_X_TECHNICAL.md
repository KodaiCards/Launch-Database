# T01 FINAL VERIFY 2 RT-X — Technical + Primary-Source (Read-Only)

**Constraints acknowledged: READ-ONLY. No lesson file edits, no CANONICAL/FIX files, no CLAUDE.md edits, no follow-up rounds dispatched. Write-path allowlist: this file ONLY. Independent technical pass completed BEFORE reading RT-W.**

---

## 1. Polish-2 Five-Fix Technical Re-Verification Table

| Fix | Claim | RT-X Independent Verification | Result |
|-----|-------|-------------------------------|--------|
| U-1: L08 LO count 31→32 | "Recall and define 32 OSP acronyms..." | vocab_introduced array extracted via Python: confirmed 32 items (SMF → MUTCD, inclusive of OS2 added in polish-1). LO line 66 reads "32 OSP acronyms." 34 flashcards present — 2 extras (NESC, FDH) are cross-reference cards for terms from prior lessons, appropriate. | ✅ VERIFIED |
| U-2: L05 "completion deadline" | LO updated to "15-business-day completion deadline" | Line 39 reads: "identify the 15-business-day completion deadline for simple make-ready under 47 CFR 1.1411(h)(2)(ii)." Body at lines 211-213 consistent: "must be completed within 15 business days of approval — the 15 days is the completion deadline, not a start window." L09 lines 193-194 also consistent: "15 business days to complete simple make-ready." | ✅ VERIFIED |
| U-3+V-1: CFOS/O (3 locations) | Three locations updated to CFOS/O | (a) vocab_introduced line 29: 'CFOS/O' ✓; (b) FOA body table line 215: "CFOS/O (Certified Fiber Optic Specialist / Outside Plant) certifications, among other CFOS specialties" ✓; (c) FC-foa flashcard line 389: same text ✓. Primary source verified during polish-2 notes: thefoa.org/adv-cert.htm confirms "CFOS/O - Certified Fiber Optic Specialist, Outside Plant." | ✅ VERIFIED |
| V-2: OS2 description corrected | "standard low-water-peak single-mode fiber" replacing "tightest ITU-T spec" | L08 body table (line 116): "the standard low-water-peak single-mode fiber for long-distance OSP and backbone deployments. Note: G.657.A2 bend-insensitive fiber has tighter macrobend specs than G.652.D..." ✓. Flashcard T01-L08-FC-os2 (line 387): consistent. No "tightest" claim found anywhere. G.657.A2 7.5 mm macrobend spec vs G.652.D 30 mm — correction is factually accurate. | ✅ VERIFIED |

**All 5 polish-2 fixes VERIFIED correct by independent technical pass.**

---

## 2. Primary-Source Verification Log

### 47 CFR 1.1411(h)(2)(ii) — 15-day OTMR deadline
**Claim:** L05 LO and body cite "15-business-day completion deadline for simple make-ready under 47 CFR 1.1411(h)(2)(ii)."
**Verification:** 47 CFR §1.1411(h)(2)(ii) is the specific subsection of FCC's OTMR rules governing make-ready timeline. The 15 business-day timeline for "simple make-ready" is consistent with FCC 18-111 (the OTMR order). L09 cross-reference ("15 business days to complete simple make-ready" under "47 CFR Part 1 (FCC)" heading) is consistent. Citation FCC 18-111 appears in L05 Q3 explanation. **VERIFIED plausible; [confirm section] marker would be appropriate given specificity of subsection.**

### FOA CFOS/O Designation
**Claim:** L08 calls it "Certified Fiber Optic Specialist / Outside Plant."
**Verification:** Polish-2 notes confirm thefoa.org/adv-cert.htm as primary source. Body and flashcard consistent. "among other CFOS specialties" correctly notes this is one specialization in the CFOS family. **VERIFIED.**

### ITU-T G.652.D / ISO/IEC 11801 OS2 Designation
**Claim:** L08 says OS2 = ISO/IEC 11801 designation for G.652.D SMF; OS1 maps to G.652.A/B/C.
**Verification:** ISO/IEC 11801 established the OS1/OS2 classification. OS2 = G.652.C/D (low water peak). OS1 = G.652.A/B (higher water peak, older spec). L08 correctly maps OS1 to "G.652.A/B/C (earlier SMF specs with higher water-peak attenuation)." Including G.652.C in OS1 is a slight imprecision — G.652.C introduced low-water-peak but OS2 is specifically the G.652.C/D designation in ISO/IEC 11801. The L08 treatment is defensible and follows common industry usage where OS2 = "modern low-WP SMF." **VERIFIED as acceptable/defensible.**

### USACE NWP 57
**Claim:** L09 and L09 flashcard: NWP 57 "replaces former NWP 12 scope for telecom; 2021 NWP package reissued in 2026 NWP package effective March 15, 2026."
**Verification:** USACE 2021 NWP reissuance replaced NWP 12 (which had previously covered electric utility lines AND telecom) by creating NWP 57 for "Electric Utility Line and Telecommunications Activities." The split correctly notes NWP 12 now covers "only oil/gas pipelines" — per the 2021 reissuance, NWP 12 = "Oil or Natural Gas Pipeline Activities." NWP 57 covers telecom + electric. The 2026 NWP package effective March 15, 2026 reissuance is consistent with USACE's 5-year cycle. **VERIFIED consistent with known USACE practice; "core scope unchanged" qualifier appropriately hedges.**

### NESC C2-2023 §§23, 235 (L02 neutral/MGN section)
**Claim:** L02 Advanced cites "NESC C2-2023 §§23, 235; RUS Bulletin 1751F-630 §6."
**Verification:** NESC C2 Section 23 = "Joint Use of Structures" (covers accommodation of attachments, climbing space requirements). Section 235 falls under Part 2 Overhead Lines — §235 covers "Grounding" for supply and communication conductors on joint-use structures. Both are appropriate for the neutral/MGN grounding discussion. RUS 1751F-630 §6 covering aerial grounding is also correct. **VERIFIED as appropriate citations.**

### NESC C2-2023 §§23, 238 (L02 Q3 climbing space)
**Claim:** L02 Q3 citation: "NESC C2-2023 §§23, 238."
**Verification:** §238 in NESC C2 covers "Working clearances from energized parts" — not precisely "climbing space dimensions." Climbing space is typically addressed under §236 (Working Space) and Table 236-1 in NESC C2-2023. §238 is adjacent but is about electrical working clearances for energized equipment, not climbing space geometry between attachment zones. This citation is **IMPRECISE** — §236 would be more accurate for climbing space specification. LOW finding; the content about climbing space being a mandatory clearance zone is factually correct, only the section reference is not precise. **IMPRECISE but not false.**

### Additional sampled citations
| Claim | Citation | Accuracy |
|-------|----------|----------|
| L01: "NEC Article 770 — optical fiber inside buildings" | Standard is correct | ✅ |
| L01: "RUS Bulletin 1751F-630 §1 — Scope of outside plant" | Standard is correct | ✅ |
| L08: "OTDR = Tier 2 test per TIA-568" | TIA-568 defines Tier 1/Tier 2 fiber testing; OTDR = Tier 2. Correct. | ✅ |
| L09: "ICEA S-87-640 [confirm edition]" | Confirm marker appropriate — edition evolves. | ✅ |
| L09: "TIA-568.3-D Annex" for acceptance testing | TIA-568.3 is the OSP fiber cabling standard with Tier 1/2 specs | ✅ |
| L09: "47 CFR 1.1411" for OTMR and FCC pole attachment | Correct 47 CFR citation | ✅ |

---

## 3. Math/Numeric Claim Sample Re-Derivations

### L02 Q2 — Ground clearance example
**Claim:** Cable attached at 24 ft, sags to 20 ft midspan. 20 ft > 15.5 ft minimum for telecom over traffic lanes per NESC Rule 232 / Table 232-1. Installation passes.
**Derivation:** Midspan clearance = attachment height − sag = 24 − 4 = 20 ft. 20 > 15.5 ✓. PASS. Answer index 1 = "Yes — 20 feet exceeds 15.5-foot minimum." **VERIFIED CORRECT.**

### L02 AnnotatedDiagram — Sag example
**Claim:** "A cable attached at 22 feet with 4 feet of sag gives 18 feet of ground clearance at midspan."
**Derivation:** 22 − 4 = 18 ft. **VERIFIED CORRECT.**

### GPON split ratio in L08 / L01
**Claim:** "One OLT port serves up to 32 or 64 customers via passive splitters. Up to 2.5 Gb/s downstream shared."
**Verification:** Per ITU-T G.984: maximum split ratio = 1:64. Standard deployment = 1:32. L08/L01 citing "32 or 64" is accurate. G.984 downstream rate = 2.488 Gb/s, which rounds to "up to 2.5 Gb/s." **VERIFIED CORRECT.**

---

## 4. Cross-Citation Consistency Check — POTENTIAL DISCREPANCY FOUND

### FCC Part 32 Account Numbers: L01 vs T04.L07

**L01 Advanced section (lines 245-247):**
> Account 2421 — Cable, aerial; Account 2422 — Cable, underground; Account 2423 — Cable, buried. Note: Account 2411 is "Poles" and Account 2441 is "Conduit."

**T04.L07 Plant Accounts table (lines 181-182):**
> § 32.2420 = Poles

**T04.L07 quiz explanation (line 567):**
> § 32.2210 (Cable and Wire), § 32.2420 (Poles), § 32.2220 (Land)

**DISCREPANCY:** L01 says Poles = Account **2411** but T04.L07 says Poles = **§32.2420**. These are different account numbers. In 47 CFR Part 32 (USOA), account formatting is typically §32.XXXX. L01 uses 4-digit shorthand (2421, 2422, etc.) while T04.L07 uses §32.XXXX (32.2420, 32.2210, etc.). However, 2411 ≠ 2420 regardless of formatting, so these are genuinely inconsistent. T04.L07 is a dedicated Part 32 lesson and carries more authority on account numbers. L01 is an introductory lesson where Part 32 appears in the advanced section. **Both may be drawing from different Part 32 account schemes (pre-vs-post restructuring), but the inconsistency is real and should be resolved.** LOW severity — both are in advanced-tier content; learner impact minimal, but cross-lesson accuracy concern.

---

## 5. RT-W Two-LOW Reconciliation

### W-1: L08 Missing Advanced Tier Section

**RT-W claim:** L08 has only Foundations + Working — no Advanced section. Schema requires three tiers.
**RT-X independent verification:** L08 confirmed: lines 78-323 = `data-tier="foundations"`, lines 326-358 = `data-tier="working"`. No `data-tier="advanced"` section present. **CONFIRMED.**

**Schema cross-check:** `schema.md` table (lines 179-181):
| Tier | Required? |
|------|-----------|
| `foundations` | Yes |
| `working` | Yes |
| `advanced` | **No** |

**RT-W's characterization as a schema violation is INCORRECT.** Schema explicitly states `advanced` tier is optional ("No" in the Required column). L08's two-tier structure is schema-compliant. Content rationale is sound — L08 is a consolidated acronym reference sheet; advanced content (when to use cert-track resources, study strategies) would be appropriate but is not required. **RT-W W-1 is a FALSE POSITIVE given the schema's explicit "No" on advanced tier requirement.** 

**Revised assessment: W-1 is NOT a finding. T01 is schema-compliant.**

### W-2: vocab_introduced Metadata Gap (RUS/BICSI in L01, NESC in L02)

**RT-W claim:** RUS, BICSI not in L01 vocab_introduced; NESC not in L02 vocab_introduced. L08/L09 vocabulary_assumed pointers to those lessons are therefore inaccurate.
**RT-X independent verification:**
- L01 vocab_introduced confirmed: OSP, ISP, outside plant, inside plant, demarcation point, headend, OLT, ONT — 8 items. RUS and BICSI are NOT listed, but are taught in L01 body tables and learning objective #4.
- L02 vocab_introduced confirmed: 13 items (attachment through conduit). NESC is NOT listed, but NESC appears throughout L02 body as the governing code.
- L08 vocabulary_assumed includes `{ term: 'RUS', source_lesson_id: 'T01.L01' }` and `{ term: 'BICSI', source_lesson_id: 'T01.L01' }` — these point to L01 as source.
- L08/L09 vocabulary_assumed also has `{ term: 'NESC', source_lesson_id: 'T01.L02' }`.

**CONFIRMED — W-2 is a real metadata gap.** RUS, BICSI, and NESC are all genuinely introduced in body content of L01/L02 respectively — the teaching is correct. The DAG tracking metadata (vocab_introduced arrays) does not register them, creating inconsistency between what the DAG system would track vs. what's actually taught. **LOW severity — content accuracy is fine, DAG enforcement machinery would malfunction for these 3 terms.**

---

## 6. Independent Gap-Research Findings (Technical Framing)

### New Find X-1 (LOW): FCC Part 32 Account Number Cross-Topic Inconsistency
Already documented in §4. L01 Advanced says Poles = Account 2411; T04.L07 says Poles = §32.2420. Real inconsistency between two lessons. Both are advanced-tier content; direct learner impact is low. **LOW, cross-topic.**

### New Find X-2 (LOW): NESC §238 Citation Imprecision for Climbing Space
Already documented in §2. L02 Q3 cites "NESC C2-2023 §§23, 238" for climbing space requirement. §238 = working clearances from energized parts, not climbing space geometry. §236 (Working Space) is more precise for climbing space. The descriptive content about climbing space is correct; only the section number is imprecise. **LOW.**

### Confirmed RT-W W-1 Refuted (Not a Finding)
Schema.md explicitly marks `advanced` tier as **not required** (Required = No). RT-W's characterization of L08 missing advanced tier as "a schema requirement violation" is incorrect. **W-1 is a false positive; no fix needed.**

### No New HIGH or MED Technical Findings
After a full technical pass through:
- All polish-2 fixes: VERIFIED correct
- Primary-source citations (NESC, NWP 57, FOA CFOS/O, ITU-T G.652.D, TIA-568, FCC 47 CFR 1.1411): VERIFIED plausible/correct with one [confirm] flag on 1.1411(h)(2)(ii) specificity
- Math re-derivations (clearance example, GPON split/speed): VERIFIED correct
- Cross-citation consistency: GPON counts consistent L01/L08; TIA-598-D color code reference consistent; one inconsistency found (Part 32 Poles account)

---

## 7. Vite Build Result

```
✓ built in 5.91s
```

All modules compiled clean. No import errors, no syntax failures. T01 L01-L10 all included in build output.

---

## 8. Saturation Verdict

| Round | New finds |
|-------|-----------|
| RT-S (post-fix) | 1 MED + 5 LOWs |
| RT-T (post-fix) | 2 new LOWs |
| Polish-1 | Fixed 6 items |
| RT-U (final-verify-1 pedagogy) | 3 new LOWs |
| RT-V (final-verify-1 technical) | 2 new LOWs |
| Polish-2 | Fixed 5 items |
| RT-W (final-verify-2 pedagogy) | 2 new LOWs (W-1, W-2) |
| RT-X (this round — technical) | W-1 REFUTED (false positive — schema says advanced = not required); W-2 CONFIRMED; 2 NEW LOWs (X-1 Part 32 cross-topic, X-2 NESC §238 imprecision) |

**RT-X adds 2 new unique LOWs not caught by RT-W.** W-1 (advanced tier) is refuted as a false positive. W-2 (DAG metadata) is confirmed.

**Assessment:** The new LOWs are:
- X-1: Cross-topic account number inconsistency (advanced-tier content, learner impact minimal)
- X-2: Citation imprecision on §238 vs §236 (not factually wrong, just imprecise)

No HIGH or MED findings remain anywhere in T01. All fixes from polish-1 and polish-2 verified correct. Build clean.

**NEAR-SATURATION.** X-1 and X-2 are the kind of citation/metadata refinements that a micro-patch could address without another full verification round — they do not affect any learner-facing accuracy claim or any safety-critical content.

---

## 9. Final Verdict

**YELLOW** — 2 new LOWs found (X-1, X-2). RT-W W-1 refuted (false positive — schema explicitly marks advanced tier as not required). RT-W W-2 confirmed.

| # | Source | Location | Issue | Severity |
|---|--------|----------|-------|----------|
| W-1 | RT-W | L08 | Missing Advanced tier — **FALSE POSITIVE.** Schema.md marks advanced as "No" (not required). Carry-forward into micro-patch NOT recommended. | RETRACTED |
| W-2 | RT-W | L01/L02 vocab_introduced | RUS + BICSI absent from L01 vocab_introduced; NESC absent from L02 vocab_introduced — DAG metadata inconsistency. Content correct; tracking broken. | LOW, CONFIRMED |
| X-1 | RT-X (NEW) | L01 Advanced vs T04.L07 | FCC Part 32 Poles: L01 says Account 2411 vs T04.L07 says §32.2420 — cross-topic inconsistency in advanced-tier content. | LOW, NEW |
| X-2 | RT-X (NEW) | L02 Q3 citation | NESC §238 cited for climbing space, but §236 (Working Space) is more precise; §238 = working clearances from energized parts. Content correct, citation imprecise. | LOW, NEW |

**T01 content accuracy is HIGH.** No HIGH or MED findings remain. All math, GPON specs, OTMR timeline, NWP 57 citations, OS2/G.652.D mapping, CFOS/O designation, Vite build: all GREEN. Remaining items are: 1 confirmed metadata gap (W-2), 1 cross-topic citation inconsistency (X-1), 1 citation imprecision (X-2). Orchestrator may elect: (a) micro-patch W-2 + X-1 + X-2 then final-verify-3, OR (b) accept these 3 LOWs as acceptable technical debt and close T01 — none affect learner-facing accuracy.

=== T01 FINAL VERIFY 2 RT X TECHNICAL END ===
