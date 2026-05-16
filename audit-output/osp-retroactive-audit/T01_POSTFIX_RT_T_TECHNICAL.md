# T01 Post-Fix RT-T — Technical + Primary-Source Verification
**Framing:** senior OSP engineer + technical reviewer — primary-source citation re-verification, independent gap research from technical lens
**Scope:** 9 rogue-agent fix commits; specific primary-source checks on OTMR 47 CFR, NWP 57, TIA-598, ANSI O5.1, ICEA S-87-640, ITU-T G.984; L08 sampled-flashcard verbatim; learning_objectives sanity; Vite build; RT-S 3-LOW reconciliation; independent gap research
**Write-path used:** this report file ONLY
**Constraints acknowledged:** I WILL NOT write to any lesson file. I WILL NOT create or modify any *_CANONICAL.md file. I WILL NOT write to CLAUDE.md / ARCH.md / course-catalog.js / SLEEP_SNAPSHOT.md / HANDOFF.md / public/training/. I will find bugs and REPORT, not fix. I will NOT dispatch follow-up audit rounds.

---

## 1. 9-Commit Technical Re-Verification

| Commit | Claim | Technical verdict |
|---|---|---|
| `6d5ae89` R3-01: L10 NESC source_lesson T01.L08→T01.L02 | NESC formally introduced in L02 vocabulary_introduced. Correct redirect. | VERIFIED |
| `ad8e797` R3-04: [confirm edition] on ANSI O5.1 (L02 ×2), ICEA S-87-640 (L03 ×2, L09), ITU-T G.984 (L07) | All placements independently confirmed in lesson text. Standard editions legitimately in flux (ANSI O5.1 latest = 2022; ICEA S-87-640 latest = 2023; ITU-T G.984 series last amended 2014 with some sub-parts — edition confirmation warranted). See §2 for depth. | VERIFIED — markers appropriate |
| `7fd9d06` R3-05: L05 "15 days"→"15 business days" | L05 line 211 reads "15 business days to complete simple attachments from approval to start." Citation: 47 CFR 1.1411(h)(2)(ii). See §2 for primary-source analysis — nuance exists but "15 business days" is correct for the OTMR simple make-ready window. | VERIFIED — with note (see §2) |
| `7038f70` R3-02+R3-03: L02 sag variability caveat + L09 NWP 57 full title | L02 sag caveat adds span length, cable weight, temperature, ice/wind variables — physically correct. L09 NWP 57 gets full title "Electric Utility Line and Telecommunications Activities" + 2021/2026 reissuance context — confirmed accurate per NWP 57 2026 package. | VERIFIED |
| `c93f803` R3-06: L03 jacket color variants "orange or yellow" for LSZH/conduit | See §2 technical analysis — ISSUE FOUND. TIA-598 does not specify orange or yellow as jacket colors for OSP conduit-application cables. OSP outdoor cables are standardly black per TIA-598; jacket color coding applies primarily to indoor/premises cables. L03's claim is not TIA-598-grounded. | ⚠ OVERSTATED — technical gap |
| `3f03ee0` R4-01+R4-02: L07 PON false-positive + L06 OTDR preview | R4-01 no file change — correct determination. R4-02 L06 preview language added — pedagogically and technically appropriate. | VERIFIED |
| `9b706de` R4-04: 13 Flashcard entries added to L08 | Spot-checked 6 of 13 (MMF, OS2, TIA, USDA, NHPA, XGS-PON). All back text matches L08 body prose without invented definitions. Technical content of definitions confirmed correct (e.g., MMF: 50 or 62.5 µm core, OM3/OM4/OM5 grades — technically accurate; XGS-PON: 10 Gb/s symmetric — accurate per ITU-T G.9807.1). | VERIFIED |
| `574e516` R4-05: learning_objectives added to L01-L09 | Body-grounded check below (§4). | VERIFIED |
| `b2d2990` Rogue agent self-RT | Superseded by independent verification. | N/A |

**Summary: 8/9 VERIFIED; 1 OVERSTATED (R3-06 jacket color per TIA-598 not confirmed).**

---

## 2. Primary-Source Verification

### 47 CFR 1.1411(h)(2)(ii) — OTMR "15 business days"

**Verdict: TECHNICALLY CORRECT but subsection assignment UNCERTAIN.**

Primary-source research (FCC 18-111 order; FCC eCFR search; multiple secondary confirmations) confirms:
- The OTMR framework under 47 CFR 1.1411 does specify a "15 business days" window for the attacher's contractor to complete simple make-ready work after approval and notice
- Multiple FCC-aligned sources confirm "15 business days" as the key OTMR simple make-ready construction window (distinct from the 15-calendar-day application review period and the 10 business-day completeness check)
- The subsection (h)(2)(ii) citation is plausible but could not be confirmed via direct text retrieval (eCFR returned 403 Forbidden to agent). The subsection structure referenced in secondary sources suggests this may be (j)(2) or a parallel subsection — the lesson body says "(h)(2)(ii)" without independent primary-source confirmation.

**Technical gap:** The L05 body (line 211) contains a TECHNICAL MISFRAME: it says "OTMR rules give the fiber company 15 business days to complete simple attachments from approval to start." This inverts the relationship — 15 business days is the contractor's window TO COMPLETE make-ready (construction), not "from approval to start." The L05 learning_objective (line 39) correctly says "identify the 15-business-day response timeline" — the body's phrasing is slightly off but the number and context are correct.

**NEW-T1 LOW: L05 body line 211 — "15 business days to complete simple attachments from approval to start" should read "15 business days to complete simple make-ready from the notice date." The "to start" phrasing is technically imprecise; the timeline governs completion, not commencement.**

### USACE NWP 57 Title and 2026 Reissuance

**Verdict: VERIFIED.**

Multiple primary-source corroborations confirm:
- Full title: "Electric Utility Line and Telecommunications Activities" — CONFIRMED per USACE POA 2026 NWP 57 document header and Federal Register 2026 reissuance notices
- 2021 NWP package originally issued (effective March 15, 2021); 2026 NWP reissuance effective March 15, 2026, expiration March 15, 2031
- Core scope for telecommunications line crossings unchanged across reissuance
- L09's language accurately captures this: "2021 NWP package reissued in 2026 NWP package effective March 15, 2026, core scope unchanged" — ACCURATE

### TIA-598 Jacket Colors for OSP Conduit Cable

**Verdict: OVERSTATED — NEW-T2 MED.**

TIA-598 governs fiber, buffer tube, and cable identification within fiber optic cables. For outdoor/OSP cables, TIA-598 consistently specifies black jackets for UV resistance. Color-coded jackets (orange for multimode, yellow for single-mode, aqua for OM3/OM4) are for indoor/premises patchcords and short runs — NOT for OSP outdoor cable jackets. Multiple primary-source cross-references confirm: OSP outdoor cables are black; identification is via jacket print, not jacket color.

L03 line 113-115 (post R3-06 fix) states: "orange or yellow jackets indicate conduit-application or LSZH variants used in conduit systems where fire-smoke toxicity is a concern." This claim is not TIA-598-grounded for outdoor OSP cable. LSZH outdoor conduit cables may exist with color marking, but TIA-598 does not specify orange/yellow as the standard for OSP conduit-application cable. The correct statement would be: "LSZH jackets are marked LSZH on the print; jacket color for outdoor OSP cable is standardly black per TIA-598, with fiber type and rating identified via jacket print legend."

**NEW-T2 MED: L03 jacket color claim for conduit-application/LSZH OSP cables is not supported by TIA-598 primary source. TIA-598 color conventions apply to indoor patchcords/premises cable. For outdoor OSP cable, black jacket + printed legend is the TIA-598 norm regardless of LSZH rating.**

### ANSI O5.1 — Setting Depth Formula and Edition

**Verdict: [confirm edition] placement APPROPRIATE; setting depth formula APPROXIMATELY CORRECT.**

ANSI O5.1 latest edition = 2022 (confirmed: ANSI O5.1-2022 "Wood Poles — Specifications and Dimensions" published). The `[confirm edition]` marker in L02 is appropriate.

The "10% of pole length + 2 feet" setting depth formula: Multiple industry sources confirm this is a widely used field rule of thumb attributed to ANSI O5.1 practice. The search confirms it is an industry-standard rule aligned with ANSI O5.1 embedment guidance, though ANSI O5.1 itself contains dimension tables rather than a simple formula. The lesson's presentation is technically defensible as a practical rule of thumb with the [confirm edition] marker present. No error here.

### ICEA S-87-640 — Edition Status

**Verdict: [confirm edition] APPROPRIATE.**

Current edition = ICEA S-87-640:2023 (confirmed). The [confirm edition] marker is correct and warranted.

### ITU-T G.984 — Edition Status

**Verdict: [confirm edition] APPROPRIATE.**

G.984 series sub-parts last amended 2012–2014 with no recent overhaul found. Edition confirmation at publication time remains appropriate. Marker correctly placed in L07.

---

## 3. L08 Sampled-Flashcard Verbatim Check

Sampled 6 of 13 new cards against L08 body:

| Card front | Body source | Match? |
|---|---|---|
| MMF | Line 109-111: "50 or 62.5 µm core; multiple propagation modes; used for short runs inside buildings; OM3/OM4/OM5 grades" | ✓ VERBATIM MATCH |
| OS2 | Lines 114-116: "ISO/IEC 11801 designation for G.652.D SMF — tightest ITU-T single-mode spec, standard for modern OSP" | ✓ VERBATIM MATCH |
| TIA | Lines 199-200: "Publishes TIA-568, TIA-598, TIA-606, TIA-942. Primary technical reference for fiber cabling in North America." | ✓ VERBATIM MATCH |
| USDA | Lines 203-204: "cabinet department that administers the Rural Utilities Service (RUS)" | ✓ VERBATIM MATCH |
| NHPA | Lines 312-313: "Section 106 requires review of potential impacts on historic properties before federally funded projects proceed." | ✓ VERBATIM MATCH |
| XGS-PON | Lines 392-393: "10 Gb/s both downstream and upstream over same passive optical infrastructure as GPON" | ✓ VERBATIM MATCH |

**All 6 sampled cards: verbatim match to body. No invented definitions detected.**

---

## 4. Learning Objectives Sanity (L01-L09)

Spot-checked L02, L03, L05, L09 from technical framing:

- L02: "Identify three vertical zones…sag/midspan clearance…pole tag…FCC Part 1.1411 attachment fees" — all taught in body ✓
- L03: "Identify layers of loose-tube cable…distinguish lashed/ADSS/direct-buried…decode jacket print…LSZH and colored jacket variants" — all body-grounded ✓ (note: the LSZH jacket color objective ties to the TIA-598 gap in §2; the learning objective itself is valid, the body content it teaches is what's technically imprecise)
- L05: "Name seven stages…OTMR 15-business-day timeline…as-designed vs as-built…permit package stage" — all body-grounded ✓
- L09: "Map OSP standards stack…code adoption…USACE Section 404/NWP 57…conflicting standards/AHJ" — all body-grounded ✓

**All spot-checked: body-grounded. PASS.**

---

## 5. Vite Build Result

`cd osp-training && npm run build`

**✓ built in 4.62s. Zero errors. All T01 assets compiled cleanly. BUILD GREEN.**

---

## 6. RT-S 3-LOW Reconciliation

RT-S flagged:
- **NEW-S1 LOW:** OS2 in L08 flashcards but not in vocab_introduced — CONCUR. Schema gap. Downstream lessons citing OS2 in vocab_assumed will lack authoritative source_lesson_id.
- **NEW-S2 LOW:** HDPE in vocab_introduced but no dedicated flashcard — CONCUR. PVC has a flashcard; HDPE does not. Body mentions HDPE substantively (line 256-258, line 113).
- **NEW-S4 LOW:** L09 Flashcard block between Foundations and Working, not after Advanced — INDEPENDENTLY VERIFIED. L09 lines 236-249 confirm Flashcard precedes the Working section. Pattern violation matches RT-S finding.

**All 3 RT-S LOWs: CONCUR AND INDEPENDENTLY CONFIRMED.**

---

## 7. Independent Technical Gap Research

**NEW-T1 LOW:** (captured in §2) L05 line 211 OTMR phrasing "15 business days to complete simple attachments from approval to start" — imprecise; "to start" should be "to complete simple make-ready from the notice date."

**NEW-T2 MED:** (captured in §2) L03 jacket color claim (orange/yellow for conduit-application/LSZH OSP cable) is not grounded in TIA-598. TIA-598 specifies outdoor OSP cable as black; colored jackets are premises/indoor cable conventions. The R3-06 fix introduced technically unverified content.

**NEW-T3 LOW — L09 47 CFR citation for OTMR:** L05 carries (h)(2)(ii) subsection but L09 references "47 CFR Part 1 (FCC)" generally with "OTMR timeline (15 days for simple attachments)" — note this says "15 days" not "15 business days." Inconsistency with L05's corrected "15 business days." If L05 was corrected to "business days," L09's reference should match.

**No HIGH findings from technical independent research.** The 1 MED (TIA-598 jacket color) is the primary new technical finding not surfaced by RT-S.

---

## 8. Final Verdict

**YELLOW — T01 not closeable; 2 new findings (1 MED, 1 LOW technical) + 3 RT-S LOWs all confirmed.**

| ID | Severity | Item | Owner |
|---|---|---|---|
| NEW-T2 | MED | L03 jacket color claim (orange/yellow for OSP conduit/LSZH cable) not supported by TIA-598; outdoor OSP cable is standardly black with print legend identification | T01 polish wave |
| NEW-S1 | LOW | L08: OS2 added to flashcards but not vocab_introduced — schema violation | T01 polish wave |
| NEW-S2 | LOW | L08: HDPE in vocab_introduced but no dedicated flashcard | T01 polish wave |
| NEW-S4 | LOW | L09: Flashcard block between Foundations and Working (not after Advanced) | T01 polish wave |
| NEW-T1 | LOW | L05 line 211: "15 business days from approval to start" should be "15 business days to complete simple make-ready from the notice date" — phrasing inverts direction | T01 polish wave |
| NEW-T3 | LOW | L09 body says "15 days for simple attachments" — should be "15 business days" for consistency with L05 R3-05 fix | T01 polish wave |

**The 9 rogue-agent commits are technically sound except R3-06 (jacket colors), which introduced a MED-level factually ungrounded claim about TIA-598 OSP conduit cable jacket coloring. Vite build clean. RT-S 3 LOWs all confirmed from technical framing. T01 requires a polish wave addressing the 6 items above before closing.**

=== T01 POSTFIX RT T TECHNICAL END ===
