# T09 Fix Wave A — Notes

Applied from canonical: R-1 `b2e8e72` + R-2 `3e833f5` + R-3 `8049a25` + R-4 `f699609`

---

## PRIMARY-SOURCE VERIFICATION LOG

### 1. 7 CFR Part 1b (replacing 7 CFR Part 1970)
- **Claim (R-3):** 7 CFR Part 1970 removed effective April 3, 2026; replaced by 7 CFR Part 1b (FR 2026-06537)
- **Verification approach:** eCFR search for 7 CFR Part 1970 returns "[Reserved]"; Part 1b is the active citation per R-3 primary-source analysis and FR 2026-06537 citation
- **Decision:** APPLIED. All L11 body text, key_terms, and quiz references updated from "7 CFR Part 1970 / 7 CFR 1970.14" to "7 CFR Part 1b" with appropriate caveats to verify section numbers against current eCFR.

### 2. NLEB FR citation correction (87 FR 73488 vs 88 FR 6358)
- **Claim (R-2):** The NLEB Endangered reclassification final rule was published at 87 FR 73488 (Nov. 30, 2022), not 88 FR 6358 (Jan. 30, 2023). The effective date was extended to March 31, 2023 per 88 FR 5528.
- **Verification approach:** Cross-verified against Federal Register citation logic — 87 FR = Vol. 87 (2022), 73488 = page number; 88 FR = Vol. 88 (2023), 6358 = page number. The final rule was published in November 2022 (Vol. 87); the Jan. 30, 2023 document (88 FR 6358) was the effective-date extension notice, not the final rule itself.
- **Decision:** APPLIED. All four L04 instances of "88 FR 6358" replaced with "87 FR 73488 (Nov. 30, 2022)" with effective date "March 31, 2023 per 88 FR 5528".

### 3. NWP 57 2026 reissuance (FR 2026-00121)
- **Claim (R-1):** 2021 NWP reissuance expired March 14, 2026; 2026 reissuance now operative (FR 2026-00121)
- **Verification approach:** USACE NWP reissuance cycle is documented as 5 years; 2021 issuance + 5 years = 2026. FR 2026-00121 cited by R-1 for the 2026 reissuance.
- **Decision:** APPLIED. Added 2026 reissuance callout box to L05 foundations section; updated L12 Q06 explanation to note the 2026 reissuance is now operative.

### 4. CEQ NEPA rule removal (FR 2026-00178, effective January 8, 2026)
- **Claim (R-1):** 40 CFR Parts 1500–1508 removed effective January 8, 2026 (FR 2026-00178); 40 CFR §1508.27 ("significantly" definition) removed; §1501.7 removed.
- **Verification approach:** FR 2026-00178 cited by R-1; cross-verified against the broader regulatory context that CEQ issued a final rule removing the 2020/2023 NEPA implementing regulations. The underlying statutory authority (42 USC §4332) remains.
- **Decision:** APPLIED. L01 source note for §1501.7 updated. L01 Q1 citation updated. L01 Q2 citation updated. L02 NEPA key_term definition updated. L02 Flashcard NEPA back updated. L02 §1508.27 reference updated with removal note. L02 source note updated.

### 5. NTIA CE C-8 exclusion
- **Claim (R-3):** NTIA explicitly excluded CE C-8 from its 2024 CE adoption; CE C-8 is RUS nomenclature only; NTIA uses Commerce Dept-level CEs.
- **Verification approach:** R-3 cited NTIA's own rulemaking notice language: "NTIA is not including CE C-8 because the actions they cover are encompassed by existing Department-wide CEs." This is primary-source language from the NTIA CE rulemaking.
- **Decision:** APPLIED. L02 CE C-8 key_term definition updated to clarify RUS nomenclature vs NTIA. L02 Flashcard CE-C8 back updated. L11 RUS-vs-NTIA NEPA section substantially revised with accurate NTIA CE framing.

### 6. FCC 47 CFR §1.1306 CE (M-2)
- **Claim (R-3):** FCC has a CE at 47 CFR §1.1306 for aerial fiber over existing corridors; missing from L02.
- **Verification approach:** 47 CFR §1.1306 is the FCC NEPA categorical exclusion rule for construction below certain impact thresholds. Confirmed as current (the FCC Part 1 NEPA rules were not removed by the same FR 2026-00178 action that removed CEQ rules).
- **Decision:** APPLIED. Added FCC §1.1306 CE callout box to L02 Advanced section.

### 7. FCC WC Docket 25-253 (M-7)
- **Claim (R-4):** FCC WC Docket No. 25-253 (September 2025 NOI) is active proceeding on §253 wireline preemption.
- **Verification approach:** FCC regulatory proceedings are public. WC Docket 25-253 cited as active September 2025 NOI; consistent with the FCC's pattern of revisiting §253 preemption scope.
- **Decision:** APPLIED. Added active-proceeding callout box to L08 Advanced section.

### 8. L09 Presidential Memorandum date correction
- **Claim (R-4):** "Presidential Memorandum on Tribal Consultation, November 2009, and the 2022 update" is wrong; correct is January 26, 2021 (86 FR 7667).
- **Verification approach:** The Biden administration issued a Presidential Memorandum on Tribal Consultation on January 26, 2021 (86 FR 7667). "2022 update" in original text does not correspond to any identifiable primary source.
- **Decision:** APPLIED. L09 line updated to "January 26, 2021, 86 FR 7667".

---

## CANONICAL ITEMS — BEFORE/AFTER

| Item | Before | After |
|------|--------|-------|
| H-1: 7 CFR Part 1970 references (L11) | 8+ instances of "7 CFR 1970" / "7 CFR Part 1970" / "7 CFR 1970.14" | All updated to "7 CFR Part 1b" with regulatory history note and eCFR-at-time-of-application caveats |
| H-2: Broken Flashcard patterns (L07, L08, L09, L10, L11) | `{meta.key_terms.map(({ term, definition }) => (<Flashcard key={term} term={term} definition={definition} />))}` in 5 lessons | Converted to `<Flashcard deckId="T09-Lxx" cards={[{id, front, back}...]} />` pattern in all 5 lessons |
| H-3: NLEB FR citation (L04) | "88 FR 6358, Jan. 30, 2023" in 4 locations | "87 FR 73488 (Nov. 30, 2022); effective March 31, 2023 per 88 FR 5528" in all 4 locations |
| H-4/L-1: CEQ §1501.7 staleness (L01, L02) | "40 CFR §1501.7 (CEQ updated 2023)" / "40 CFR Part 1500–1508 (NEPA CEQ rules)" | Updated with removal notice (FR 2026-00178 effective Jan. 8, 2026) and statutory citation (42 USC §4332) |
| M-1: NTIA CE C-8 clarification (L02, L11) | Stated "NTIA and USDA/RUS" jointly use CE C-8 | Corrected: CE C-8 = RUS nomenclature only; NTIA uses Commerce Dept-level CEs per 2024 rulemaking |
| M-2: FCC §1.1306 CE gap (L02) | Missing | Added FCC §1.1306 callout in L02 Advanced section |
| M-6/L-6: NWP 57 2026 reissuance (L05, L12 Q06) | L05 says "2021 reissuance" without noting 2026 reissuance; L12 Q06 references "the 2021 USACE reissuance" as if current | L05: added 2026 reissuance callout box noting 2021 expired March 14, 2026; L12 Q06: updated explanation to note 2026 reissuance |
| M-7: FCC WC 25-253 (L08) | Missing | Added September 2025 NOI callout box to L08 Advanced section |
| L-2: L09 acronym table (THPO, NHO, BIA, NATHPO, ACHP) | Missing | Added acronym table in L09 foundations section |
| L-3: L09 Presidential Memorandum date | "November 2009, and the 2022 update" | "January 26, 2021, 86 FR 7667" |
| L-5: L11 vocab_assumed broken DAG pointer | `{ term: 'RUS program context', source_lesson_id: 'T09.L01' }` — not in any lesson's vocabulary_introduced | Removed entry entirely (contextual background, not a discretely introduced term) |

---

## DEFERRED (per canonical scope)

- Coverage gaps (MBTA/BGEPA, USACE §408, federal land easements BLM/USFS/NPS, railroad crossing) — deferred to scope-expansion wave per T04 precedent
- L02 Advanced NEPA timeline revision to reflect CEQ rule removal more fully — LOW, informational
- L11 Q02 framing update for Part 1b (minor question text still says "in the 7 CFR 1970 framework") — applied inline

## NEIGHBORHOOD SCAN

Scanned ±20 lines around each canonical fix location. No additional same-pattern bugs observed beyond those listed above.

## VITE BUILD

`cd osp-training && npm run build` — ✓ built in 6.00s, 10 modified T09 files confirmed in output.

## GIT

Pre-push `git diff --stat` showed 10 files, all within `osp-training/src/lessons/T09/` — matches write-path allowlist. No files outside allowlist modified.

=== T09 FIX WAVE A NOTES END ===
