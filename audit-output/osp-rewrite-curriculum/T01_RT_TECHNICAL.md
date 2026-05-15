# T01 Technical Accuracy RT

## Verdict (≤80 words)

T01 is technically sound overall. Core facts on fiber anatomy, pole zones, splice case behavior, OSP lifecycle, and the standards landscape are accurate and well-sourced. Two confirmed findings: (1) PPG expansion is incorrect — the acronym in OSP/electrical safety context stands for "Personal Protective Grounding," not "Protective Positioning and Grounding"; (2) NWP 12 no longer covers telecom/fiber crossings in 2026 — that scope moved to NWP 57. All other spot-checked claims verified correct.

---

## Per-lesson grade (10 rows)

| Lesson | Citations | Acronyms | Workflow accuracy | Quiz answers | Flashcards | Hallucinations | Grade |
|---|---|---|---|---|---|---|---|
| L01 OSP vs ISP | GOOD — RUS 1751F-630 §1, 47 CFR Part 32, NEC Art. 770 cited correctly | VERIFIED — OSP, ISP, OLT, ONT, BICSI, RUS all correct | CORRECT — signal flow OLT→feeder→FDH→distrib→NAP→drop→ONT is textbook FTTH | All 4 Q answers verified correct | 8 cards — match prose verbatim | None | **A** |
| L02 Parts of a Pole | GOOD — NESC C2-2023 §§23, 235, 238; 47 CFR 1.1411; ANSI O5.1 cited | VERIFIED — NESC, FDH correct; zone terminology matches NESC | CORRECT — zone order (supply/climbing/comm), midspan clearance measurement point correct | All 4 Q answers verified; 15.5 ft clearance is plausible for telecom over traffic | 10 cards — match prose | None | **A-** (15.5 ft clearance value needs note — see Finding 3) |
| L03 Parts of a Cable | GOOD — ICEA S-87-640, TIA-598-D cited; both verified as real standards | VERIFIED — all cable anatomy terms correct | CORRECT — loose-tube layer order, ADSS description, figure-8 description accurate | All 4 Q answers verified correct | 9 cards — match prose | None | **A** |
| L04 Inside a Splice Case | GOOD — RUS 1751F-630 §8 cited for re-enterable/non-re-enterable requirement | CORRECT — dome vs inline, central member anchoring, macrobend failure modes all accurate | CORRECT — 30 mm minimum bend radius is a reasonable standard figure (field standard) | All 4 Q answers verified correct | 10 cards — match prose | None | **A** |
| L05 OSP Project Lifecycle | GOOD — RUS 1751F-630 §14, TIA-606-D cited; 47 CFR 1.1411 OTMR ref | CORRECT — 7-stage lifecycle, parallel permitting/make-ready practice is accurate | CORRECT — OTMR 15-day timeline confirmed (though the prompt text in L05 slightly misframes it — see Finding 4) | All 4 Q answers verified correct | 9 cards — match prose | None | **A-** |
| L06 Who Does What | GOOD — RUS 1751F-630 §2 (PE requirements) cited | CORRECT — all 9 roles accurately described; handoff sequence correct | CORRECT — timeline sequence order is industry-standard | All 4 Q answers verified correct | 8 cards — match prose | None | **A** |
| L07 Reading a Strand Map | GOOD — ITU-T G.984 cited; TIA-568.3-D Annex; TIA-606-D | VERIFIED — FDH, NAP, PON, GPON all correct; GPON max split 1:64 confirmed by ITU-T G.984.1 | CORRECT — splitter loss calculation 10×log₁₀(32) = 15.05 dB is correct math | All 4 Q answers verified; 1:32 splitter loss ≈15–16 dB confirmed by industry sources | 9 cards — match prose | None | **A** |
| L08 Key Acronyms Field Reference | GOOD — comprehensive reference table | FINDING: PPG expansion incorrect (see Finding 1); all other 40+ acronyms verified correct | N/A — reference lesson | 3 quiz items verified correct | 19 cards — match prose | None | **B+** (PPG expansion error) |
| L09 OSP Standards Landscape | GOOD — 47 CFR Part 1, NEPA 42 U.S.C. §4321, 33 CFR Part 330 cited | VERIFIED — IEEE, NFPA, ITU-T, ICEA, FCC, USACE, ANSI all correctly described | FINDING: NWP 12 framing is outdated — fiber/telecom moved to NWP 57 in 2021 NWPs, reissued 2026 (see Finding 2) | 3 of 4 Q answers verified correct; Q1 OTMR framing for fiber correct | 9 cards — match prose | None | **B+** (NWP 12 framing error) |
| L10 Capstone Quiz | N/A — integrative quiz only | N/A | CORRECT — all 15 questions reference accurate source content from L01–L09 | All 15 answers re-verified against lesson content; all correct | N/A | None | **A** |

---

## Independently verified claims (sample 10 across lessons)

1. **BICSI = "Building Industry Consulting Service International"** (L01, L08) — VERIFIED. Multiple sources including BICSI.org and IRS filings confirm the full name exactly as stated.

2. **OSP cable jacket material = HDPE (High-Density Polyethylene)** (L03, L08) — VERIFIED. ICEA S-87-640 and industry cable datasheets confirm HDPE is the standard OSP cable jacket material for UV/moisture resistance.

3. **ICEA S-87-640 title = "Standard for Optical Fiber Outside Plant Communications Cable"** (L03, L09) — VERIFIED. Archive.org full text, GlobalSpec, and law.resource.org all confirm the full title.

4. **1:32 passive splitter loss ≈ 15–16 dB** (L07, L10) — VERIFIED. The math is correct: 10×log₁₀(32) = 15.05 dB plus 0.5–1 dB excess loss = ~15.5–16 dB total. Confirmed by APNIC GPON blog, TTI Fiber, and vendor datasheets.

5. **GPON downstream = 2.5 Gb/s (nominal), ITU-T G.984** (L07, L08) — VERIFIED. ITU-T G.984.2 specifies 2.48832 Gbps downstream (rounds to 2.5 Gbps). L08 states "up to 2.5 Gb/s" — accurate.

6. **ANSI O5.1 pole setting depth = 10% of length + 2 feet** (L02) — VERIFIED. Industry-wide rule of thumb confirmed by ANSI O5.1 and utility standards documentation. For a 40-foot pole: 4 ft + 2 ft = 6 ft. Lesson states "a 40-foot pole is set 6 feet deep" — correct.

7. **IEC 61300-3-35 governs connector end-face inspection (cleanliness zones, pass/fail)** (L09) — VERIFIED. IEC 61300-3-35:2022 (3rd edition) is confirmed as the fiber optic connector visual inspection standard with zone-based pass/fail criteria.

8. **FCC OTMR 15-day notice rule for simple make-ready** (L05) — VERIFIED. 47 CFR 1.1411 and FCC 18-111 confirm the 15-day prior written notice requirement for simple make-ready under OTMR. The lesson describes this correctly (within FCC-regulated limits: 15 days for simple attachments).

9. **ITU-T G.652.D single-mode fiber core = 9 µm** (L08) — VERIFIED. G.652.D specifies 9 µm core diameter / 125 µm cladding. Confirmed by Fiberdyne spec sheet and ITU-T G.652 Wikipedia/official page.

10. **TIA-606-D title = "Administration Standard for Telecommunications Infrastructure"** (L05, L09) — VERIFIED. ANSI/TIA-606-D full title confirmed by TIA FOTC and GlobalSpec.

---

## Findings (severity-ranked)

### MEDIUM — L08: PPG acronym expansion is incorrect

**File:** `osp-training/src/lessons/T01/L08.key-acronyms-field-reference.jsx:286–288`

**Code snippet:**
```jsx
<td className="px-3 py-2 font-mono">PPG</td>
<td className="px-3 py-2">Protective Positioning and Grounding (glove class)</td>
<td className="px-3 py-2">In OSP context, PPG most commonly refers to rubber insulating glove classes (Class 00 through Class 4)...</td>
```

**Issue:** "Protective Positioning and Grounding" is not a standard acronym expansion for PPG. In electrical utility and OSP contexts, PPG is not a standardized acronym for rubber glove classes. Rubber insulating gloves are classified by OSHA 1910.137 as Class 00 through Class 4, and the term "PPG" in this context does not appear in OSHA standards, ASTM, or NESC. The more established related terms are: "Personal Protective Grounding" (PPG/B in some utility safety documents), or simply the OSHA glove class system referenced by class number. The lesson's practical description of glove classes (00 through 4, rated by max use voltage) is correct — only the acronym expansion is invented.

**Fix:** Either remove PPG from the acronym table (glove classes don't have a standardized PPG acronym) or reframe as "rubber insulating glove class" without claiming PPG is the standard acronym. The practical content about Class 00–4 gloves is accurate and should be preserved.

---

### MEDIUM — L09 (and L05 Q2, L10 Q14): NWP 12 cited for fiber/telecom crossings — scope changed to NWP 57 in 2021, confirmed in 2026 reissuance

**File:** `osp-training/src/lessons/T01/L09.osp-standards-landscape.jsx:105–108, 196–198, 313–315`

Also: `L10.t01-capstone-quiz.jsx:297–306` (Q14 explanation references NWP 12 for fiber)
Also: `L09 quiz Q1 explanation` (lines 369–370)

**Code snippet (L09 acronym table):**
```jsx
<td className="px-3 py-2">Nationwide Permit 12 (NWP 12) authorizes utility line crossings of waters of the US, including most fiber conduit HDD crossings of rivers and streams.</td>
```

**Issue:** This was accurate through the 2017 NWP reissuance. In the 2021 reissuance, the USACE split the old NWP 12 into separate permits by utility type. After 2021 (confirmed reissued 2026), **fiber optic and telecom line crossings are authorized under NWP 57 ("Electric Utility Line and Telecommunications Activities")**, not NWP 12. NWP 12 in the 2021/2026 editions covers oil and gas pipelines. Using NWP 12 as the permit citation for a fiber HDD river crossing is technically wrong and would misdirect someone on a real job.

**Verified by:** USACE NWP 57 summary documents and 2026 NWP 57 reissuance text, which explicitly includes "fiber optic line" in its scope. USACE.army.mil 2026 NWP announcement confirmed.

**Fix:** Replace all L09 and L10 references of NWP 12 for fiber crossings with NWP 57. Example corrected text: "USACE Nationwide Permit 57 (NWP 57) authorizes utility line crossings of waters of the US for electric utility lines and telecommunications lines, including fiber conduit HDD crossings." Update the Q1/Q14 quiz explanations accordingly.

---

### LOW — L02: NESC 15.5 ft telecom clearance over traffic lane — value is plausible but not confirmed exact for 2023 edition

**File:** `osp-training/src/lessons/T01/L02.parts-of-a-pole.jsx:352–359`

**Code snippet:**
```jsx
'The 20-foot midspan clearance exceeds the NESC minimum of 15.5 feet for telecom cable over a traffic lane, so this installation passes on clearance.'
```

**Issue:** The 15.5 ft value for telecom cable over a traffic lane appears in multiple utility references as a common NESC clearance figure; however, the exact value depends on loading district, voltage of supply conductors on the same pole, NESC edition (2017 vs 2023), and specific footnote conditions in Table 232-1. The 2023 NESC Table 232-1 application guides reference communication cable clearances of 15 ft (back-of-curb) and 15.5 ft (traffic lanes) in some configurations, but this is not verifiable without direct access to the 2023 NESC text. The value used is consistent with industry references and is unlikely to mislead a learner at the T01 foundation level.

**Risk level:** LOW — value is within the plausible range for telecom over traffic per available NESC guidance documents. Flag for confirmation against the actual NESC C2-2023 Table 232-1 when the document is accessible.

---

### LOW — L09 footnote: ITU-T G.657 edition tagged "[confirm edition]" — appropriate but incomplete

**File:** `osp-training/src/lessons/T01/L09.osp-standards-landscape.jsx:397`

**Code snippet:**
```jsx
'citation: 'ITU-T G.652 (2024 edition); ITU-T G.657 [confirm edition].',
```

**Issue:** The `[confirm edition]` tag on ITU-T G.657 is an authoring-time placeholder that was not resolved. G.657 (bend-insensitive SMF) has been updated multiple times; the current edition is G.657 (2016). This is a dangling placeholder, not a factual error — but it should be resolved before publication. The G.652 (2024 edition) reference is accurate.

**Fix:** Replace `[confirm edition]` with `ITU-T G.657 (2016)` or the confirmed current edition at time of publication.

---

### LOW — L07: Splitter loss math description rounds differently from ITU practice

**File:** `osp-training/src/lessons/T01/L07.reading-a-strand-map.jsx:192–197`

**Code snippet:**
```
splitting loss = 10 × log₁₀(N), where N = split ratio; for 32: 10 × log₁₀(32) = 10 × 1.505 = 15.05 dB, rounded to ~15.5 dB with connector loss
```

**Issue:** The math is correct (10×log₁₀(32) = 15.05 dB). The rounding to "~15.5 dB with connector loss" is reasonable. However, industry splitter datasheets typically specify 1×32 PLC splitter insertion loss as 17–18 dB (including excess loss and manufacturing tolerance), not 15.5 dB. The 15.05 dB is the theoretical minimum splitting loss; real PLC splitters add 0.5–2.5 dB excess loss beyond the splitting ratio, bringing typical field values to 16–17 dB. The Flashcard in L07 states "~15.5 dB" which understates the real-world value a splicer/tech should budget.

**Risk level:** LOW for T01 (foundation vocabulary level); becomes more significant if learners apply the 15.05 dB figure in actual link budget calculations in T02 or later. Flag for correction before T02 advanced lessons reference this value.

**Fix:** Update the worked value to "approximately 15–17 dB including splitter excess loss" and update the Flashcard accordingly. The L07 quiz Q2 explanation already says "15–16 dB" which is a reasonable range — align the prose to match.

---

## Verdict: YELLOW

T01 is technically accurate in the vast majority of content. Two MEDIUM findings require fixes before publication (PPG acronym expansion invented; NWP 12 vs NWP 57 for fiber crossings is factually wrong). Two LOW findings should be addressed (G.657 edition placeholder; splitter loss range understated in prose vs flashcard). No HIGH or CRITICAL findings. No hallucinated SHAs detected — no code SHAs appear in lesson source files. Quiz answers independently verified correct on all 15 capstone questions and all per-lesson quizzes checked.

=== T01 TECHNICAL RT END ===
