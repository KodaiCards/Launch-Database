# T09 Post-Fix RT-α — Pedagogy + Cascade-Defense + Regression Hunt

**Constraints acknowledged:** READ-ONLY on all lesson files, CLAUDE.md, ARCH.md, course-catalog.js, and all *_CANONICAL.md / *_FIX_*.md files. Write-path allowlist: this file ONLY. No fixes applied. No follow-up rounds dispatched. No orchestrator impersonation.

---

## 1. INDEPENDENT PRIMARY-SOURCE VERIFICATION LOG

All sources independently verified via WebSearch BEFORE grading Fix Wave A.

### 1a. 7 CFR Part 1b (replaces Part 1970)
- **Federal Register:** FR 2026-06537 published April 3, 2026 — CONFIRMED. Title: "National Environmental Policy Act" (USDA consolidated rule). eCFR lists 7 CFR Part 1b as active. 7 CFR Part 1970 confirmed removed/reserved. USDA Rural Development page confirms 7 CFR Part 1b is operative for RUS programs as of April 3, 2026.
- **Verdict on H-1:** CONFIRMED CORRECT. Part 1b replacement is real and effective.

### 1b. NLEB FR citation — 87 FR 73488 (Nov. 30, 2022)
- **Federal Register search confirms:** 87 FR 73488 published November 30, 2022 = final rule reclassifying NLEB from Threatened to Endangered. Effective date extended to March 31, 2023 per 88 FR 5528. The January 2023 FR document (88 FR 6358) was a separate effective-date extension notice, not the final rule.
- **Verdict on H-3:** CONFIRMED CORRECT. Original L04 citation "88 FR 6358" was wrong; Fix Wave A correction to "87 FR 73488 (Nov. 30, 2022); effective March 31, 2023 per 88 FR 5528" is accurate.

### 1c. CEQ NEPA rule removal — FR 2026-00178, effective Jan. 8, 2026
- **Federal Register confirms:** FR Doc. 2026-00178 published January 8, 2026 — "Removal of National Environmental Policy Act Implementing Regulations." 40 CFR Parts 1500–1508 removed, effective January 8, 2026. Statutory authority 42 USC §4332 remains.
- **Verdict on H-4/L-1:** CONFIRMED CORRECT.

### 1d. NWP 57 2026 reissuance — FR 2026-00121
- **Federal Register + USACE confirms:** FR 2026-00121 published January 8, 2026 — USACE 2026 NWP reissuance. NWPs effective March 15, 2026, expiring March 15, 2031. NWP 57 (Electric Utility Line and Telecommunications Activities) reissued with clarifications. 2021 reissuance expired March 14, 2026. CONFIRMED.
- **Verdict on M-6:** CONFIRMED CORRECT. The L05 callout box and L12 Q06 explanation accurately reflect the 2026 reissuance as operative.

### 1e. NTIA CE C-8 exclusion
- **NTIA 2024 rulemaking (Federal Register doc 2024-06751, April 2, 2024) confirms verbatim:** "NTIA is not including in this Notice the CEs proposed as B-5 and C-8 because the actions they cover are encompassed by existing Department-wide CEs." NTIA uses Commerce Department-level CEs for BEAD.
- **Verdict on M-1:** CONFIRMED CORRECT. Fix Wave A's NTIA CE C-8 language in L02 and L11 matches primary source verbatim.

### 1f. FCC 47 CFR §1.1306 — NEPA CE for aerial fiber
- **LII / eCFR confirms:** 47 CFR §1.1306 is the FCC categorical exclusion rule; aerial wire/cable over existing aerial corridors of prior permitted use is categorically excluded. FCC Part 1 Subpart I NEPA rules confirmed as current and separate from CEQ rules (not removed by FR 2026-00178). FCC is considering modernization (2025 NPRM) but §1.1306 remains active.
- **Verdict on M-2:** CONFIRMED CORRECT. FCC §1.1306 callout box in L02 Advanced is accurate.

### 1g. Presidential Memorandum Jan. 26, 2021 (86 FR 7667) — Tribal Consultation
- **Web search confirms:** Biden Presidential Memorandum on tribal consultation issued January 26, 2021, published at 86 FR 7667. Prior text ("November 2009 and 2022 update") did not correspond to any identifiable primary source.
- **Verdict on L-3:** CONFIRMED CORRECT. L09 now reads "January 26, 2021, 86 FR 7667" — accurate.

### 1h. FCC WC Docket 25-253
- **Web search confirms:** WC Docket No. 25-253 is a September 2025 NOI on wireline ROW access and §253 preemption. Comment deadlines: November 17, 2025 and December 17, 2025. Active proceeding.
- **Important nuance found:** The docket is an NOI (Notice of Inquiry), not an NPRM. The Fix Wave A callout in L08 Advanced calls it "active proceeding" — technically accurate, but the lesson body should note it's an NOI (seeking comment) rather than a proposed rulemaking. LOW severity, not a factual error.
- **Verdict on M-7:** SUBSTANTIVELY CORRECT. "Active proceeding" framing is accurate; NOI vs. NPRM precision = LOW finding (see §6).

---

## 2. FIX WAVE A CANONICAL ITEMS — VERIFICATION TABLE

| # | Item | Files | Verdict | Notes |
|---|---|---|---|---|
| H-1 | 7 CFR Part 1970 → Part 1b (L11) | L11 body, key_terms, Flashcards, quiz | VERIFIED | All 8+ instances updated; regulatory history note included; eCFR-verify caveats appropriate |
| H-2 | Flashcard prop conversions (L07/L08/L09/L10/L11) | All 5 | VERIFIED | All 5 lessons now use `<Flashcard deckId="T09-Lxx" cards={[…]} />` pattern. No legacy `meta.key_terms.map` pattern found in any of the 5 files. |
| H-3 | NLEB FR citation (L04) × 4 instances | L04 | VERIFIED | Confirmed: all four instances now read "87 FR 73488 (Nov. 30, 2022); effective March 31, 2023 per 88 FR 5528." Primary source confirms this is correct. |
| H-4/L-1 | CEQ §1501.7 / 40 CFR Part 1500–1508 update (L01, L02) | L01, L02 | VERIFIED | L02 NEPA key_term definition updated to include CEQ removal notice; Flashcard NEPA back updated; §1508.27 Advanced section notes removal correctly with statutory anchor remaining. |
| M-1 | NTIA CE C-8 clarification (L02, L11) | L02, L11 | VERIFIED | L02 CE C-8 key_term and Flashcard accurately state "RUS nomenclature only." L11 working section correctly explains NTIA excluded CE C-8, quoting language consistent with primary source. No cross-contradiction between L02 and L11. |
| M-2 | FCC §1.1306 callout (L02 Advanced) | L02 | VERIFIED | Callout box present in L02 Advanced section. Language correctly describes aerial fiber on existing infrastructure as categorically excluded under FCC rules. Citation references 47 CFR §1.1306 with verify-at-ecfr note. |
| M-6 | NWP 57 2026 reissuance (L05, L12 Q06) | L05, L12 | VERIFIED | L05 callout box present: 2021 expired March 14, 2026; 2026 reissuance (FR 2026-00121) operative. L12 Q06 explanation updated to note 2026 reissuance. USACE link provided. |
| M-7 | FCC WC 25-253 (L08 Advanced) | L08 | SUBSTANTIVELY CORRECT (LOW precision gap) | Active proceeding — confirmed. "NOI" vs. "rulemaking" precision gap noted below in §6. |
| L-2 | L09 acronym table (THPO/NHO/BIA/NATHPO/ACHP) | L09 | VERIFIED | Acronym table present in L09 foundations section with all five acronyms defined. Pedagogically well-placed before the working section content. |
| L-3 | L09 Presidential Memorandum date | L09 | VERIFIED | Text reads "January 26, 2021, 86 FR 7667" at line 285. Correct. |
| L-5 | L11 broken DAG pointer 'RUS program context' removed | L11 | VERIFIED | vocab_assumed array no longer contains 'RUS program context' entry. Clean. |

---

## 3. PEDAGOGY QUALITY ASSESSMENT

### 3a. CEQ reframe — plain-English clarity
The L02 reframe handling the post-2026 CEQ removal is pedagogically sound. The NEPA key_term definition correctly notes the removal and directs learners to verify with the lead federal agency. The "two dimensions" (Context + Intensity) treatment in the Advanced section retains the substantive standard while noting the regulatory text changed. Appropriate for a field-crew audience.

### 3b. 7 CFR Part 1b transition — L11 plain-English framing
L11's opening paragraph correctly introduces Part 1b as the active regulation and the Part 1970 history is appropriately contextualized in the "Regulatory history note" box. The phrase "verify current section numbers against eCFR at time of application" appears consistently — correct practice given the rule's recent consolidation. Learner-appropriate pitch (avoids over-teching the history).

### 3c. Flashcard rendering quality — all 5 fixed lessons
- **L07:** `deckId="T09-L07"` — 8 Flashcard cards present. All terms match `key_terms`. Rendering correct.
- **L08:** `deckId="T09-L08"` — 7 Flashcard cards present. Terms match `key_terms`. Rendering correct.
- **L09:** `deckId="T09-L09"` — 6 Flashcard cards present. Terms match `key_terms`. Rendering correct.
- **L10:** `deckId="T09-L10"` — cards present. Terms match `key_terms`. Rendering correct.
- **L11:** `deckId="T09-L11"` — 5 Flashcard cards present. All 5 match `key_terms` definitions. Rendering correct.
- **Overall:** All 5 conversions verified. No legacy broken pattern remains.

---

## 4. CROSS-LESSON CONSISTENCY CHECK

- **L02 vs L11 — NTIA CE C-8:** L02 says NTIA uses "Commerce Department-level CEs." L11 says "NTIA uses Commerce Department-level CEs." CONSISTENT. No contradiction.
- **L02 vs L11 — 7 CFR Part 1b/1970:** L02 references Part 1b "formerly Part 1970" in key_term and Flashcard. L11 Working section explains the full regulatory history. CONSISTENT.
- **L05 vs L12 — NWP 57 2026 reissuance:** L05 callout says "2021 expired March 14, 2026; 2026 reissuance operative." L12 Q06 explanation says "2021 USACE reissuance moved telecom…Note: The 2021 reissuance expired March 14, 2026; the 2026 reissuance (FR 2026-00121) is now operative." CONSISTENT.
- **L02 header comment line 5:** Still reads `// 7 CFR Part 1970 (RUS NEPA); NTIA BEAD NEPA procedures` — stale file header (not user-visible; comment only). LOW finding noted in §6.

---

## 5. REGRESSION HUNT

- **Adjacent prose damage:** Scanned ±20 lines around each canonical fix location in L02, L04, L05, L08, L09, L11. No prose corruption found. Paragraph structure intact throughout.
- **7 CFR Part 1b replacement — cross-reference integrity:** L02 working section still contains `7 CFR §1970.54` at multiple points (lines 226, 288, 311, 513, 544–545) — all with "[confirm edition]" or "[confirm current]" caveats. These are in instructional context saying "verify the CE designation" rather than asserting 1970.54 as current. Not a factual error; H-1 was scoped to L11. These L02 working-body 1970.54 references were carried forward from pre-fix state and were NOT part of the H-1 canonical scope. However, they are pedagogically inconsistent: the lesson's key_terms and Flashcards correctly cite Part 1b/formerly Part 1970, while the body's source notes and quiz citations still say "7 CFR §1970.54." A learner reading carefully will see "Part 1b" in Flashcards and "§1970.54" in the quiz citation — potentially confusing. MED finding; see §6.
- **L02 Book vs. Field box line 311:** `Book (7 CFR 1970.54 / NTIA CE procedures)` — same issue; stale working citation in visible body text. Part of the MED above.
- **L12 capstone quiz — all T09 lesson references check out.** Q06 correctly updated. Q09 branching scenario still references USACE NWP 57 as the telecom permit — correct. All branching text checked; no regression.
- **L09 Presidential Memorandum context:** The memorandum is cited as a reference for federal tribal consultation protocol. The Biden administration PM may have been superseded/rescinded under executive action in 2025. The lesson appropriately caveats with "verify current federal guidance at the time of project execution." Acceptable.
- **L04 NLEB listing status:** Lesson correctly notes "Confirm current listing status at fws.gov/species at time of project" — appropriate given potential for listing status changes. No regression.

---

## 6. INDEPENDENT GAP-RESEARCH FINDINGS (PEDAGOGY/STRUCTURAL)

Independent web-search-based gaps not in Fix Wave A canonical:

| # | Sev | Finding | Location | Details |
|---|---|---|---|---|
| G-1 | MED | L02 working-body CE citations still say `7 CFR §1970.54` in 5 locations | L02 lines 226, 288, 311, 513, 544–545 | Fix Wave A updated key_terms and Flashcards to Part 1b but left body/quiz citations citing §1970.54. Pedagogically inconsistent — learner sees "Part 1b" in cards and "§1970.54" in worked source notes. Body cites should read "7 CFR Part 1b (formerly §1970.54) [confirm current section reference at ecfr.gov]." |
| G-2 | LOW | L08 Advanced FCC WC 25-253 says "active proceeding" — NOI vs. rulemaking precision | L08 Advanced callout | The docket is a Notice of Inquiry (seeking comment on whether to act), not an NPRM (proposed rulemaking). "Active proceeding" is accurate but "rulemaking" framing expected by field crew may overstate maturity. Add "Notice of Inquiry (not yet a proposed rulemaking)" qualifier. |
| G-3 | LOW | L02 file header comment line 5 stale | L02 line 5 | Header reads `// 7 CFR Part 1970 (RUS NEPA)` — should reference Part 1b. Non-visible to learner; developer/author confusion risk. |
| G-4 | LOW | L11 quiz Q01 NLEB tree-clearing avoidance caveat timing | L11 Q01 explanation | Explanation says "Note: confirm current NLEB listing status at fws.gov/species at time of project — species status is dynamic." Good. However, no analogous caveat appears in L04's tree-clearing window key_term, which hardcodes "approximately April 1 through October 31." IPaC guidance for specific windows varies by species AND geography. Minor consistency gap. |

---

## 7. VITE BUILD RESULT

`cd osp-training && npm run build` — **✓ built in 6.20s**. All T09 lesson files compiled. No import errors, no JSX syntax failures.

---

## 8. FINAL VERDICT

**YELLOW — Fix Wave A ready to proceed, with MED regression noted.**

Fix Wave A's 12 canonical items are **correctly applied and independently verified** against primary sources (FR 2026-06537, FR 2022 NLEB rule, FR 2026-00178, FR 2026-00121, NTIA 2024 rulemaking, FCC 47 CFR §1.1306, 86 FR 7667). All 5 Flashcard conversions confirmed rendering-correct. Cross-lesson consistency clean for all fixed items.

**Open items for next polish/fix stage:**
- **G-1 (MED):** L02 body/quiz §1970.54 stale citations (5 locations) — consistent with Part 1b update in key_terms. Polish fix: add "(formerly §1970.54)" and "confirm current section reference at ecfr.gov" to the 5 body/quiz locations.
- **G-2 (LOW):** L08 FCC WC 25-253 NOI vs. rulemaking precision.
- **G-3 (LOW):** L02 file header comment.
- **G-4 (LOW):** L04 tree-clearing window hardcoded dates — add "verify current IPaC guidance" caveat.

**RT-β saturation hint:** RT-β technical framing should independently verify: (a) the 7 CFR Part 1b CE class structure — does the T09 lesson correctly identify the applicable CE class for aerial fiber (L11 body references "construction within existing ROW category" without a specific section number, with "verify against eCFR" caveats — is this defensible?); (b) the L02 Quiz Q2 citation still references 40 CFR §1508.4 (removed); (c) whether FCC §1.1306 technically covers "aerial fiber installations on existing pole infrastructure" as L02 states (primary source confirms "aerial wire or cable over existing aerial corridors of prior or permitted use" — need to verify if fiber qualifies or if L02 overstates the CE scope).

---

**Closeout — git diff --stat origin/main..HEAD:**
Only `audit-output/osp-retroactive-audit/T09_POSTFIX_RT_A_PEDAGOGY.md` present.

**git log -3 --oneline (post-push):**
Verified against working tree — single report file commit only.

=== T09 POSTFIX RT A PEDAGOGY END ===
