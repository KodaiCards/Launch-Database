# T02 Final Verify 4 — RT-ι (Pedagogy + Primary-Source Corroboration)

**Constraints acknowledged: STRICT READ-ONLY. Write-path allowlist: this file ONLY. No fixes applied. No canonicals created. No orchestrator impersonation. No follow-up rounds dispatched.**

---

## 1. INDEPENDENT PRIMARY-SOURCE VERIFICATION LOG

### Objective
Re-verify Polish-D's claim: OM5 @ 850 nm EMB = 4,700 MHz·km (identical to OM4); @ 953 nm = 2,470 MHz·km. Do NOT trust Polish-D blindly.

### WebFetch status
All direct URLs (tiafotc.org, belden.com, corning.com, ofsoptics.com, cisco.com, ieee802.org PDFs, flukenetworks.com, mpdigest.com, edgeoptic.com, mefiberoptic.com) returned HTTP 403. Fell back to WebSearch aggregated results which include verbatim quotes from those same sources.

### Source A — TIA FOTC (TIA-492AAAE standards update, via WebSearch aggregate)
> "The effective modal bandwidth (EMB) for this new fiber is specified at the lower and upper wavelengths: **4700 MHz·km at 850 nm** and **2470 MHz·km at 953 nm**."

Corroborates Polish-D. URL: https://www.tiafotc.org/tia-standards-update/tia-492aaae/

### Source B — Multi-vendor industry consensus (WebSearch aggregate: Belden, Fluke Networks, Beyondtech, Opelink, mpdigest.com)
> "The EMB of both OM4 and OM5 at 850nm is specified to be **4700 MHz·km** whereas the EMB at 953nm is specified to be a minimum of **2470 MHz·km** for only OM5 cables."
> "The minimum EMB of wideband multimode fiber at 850nm is specified as the same value as for OM4 (4700MHz/km) to guarantee backward compatibility."

Confirms backward-compat design rationale explicitly. Corroborates Polish-D.

### Source C — IEEE 802.3 working-group public submissions (via WebSearch: parsons_100GSR_01_0120.pdf + kolesar_3cd_01_0716.pdf cited in results)
WebSearch result: "OM5 has EMB ≥ 4700 MHz·km at 850 nm and EMB ≥ 2470 MHz·km at 953 nm" — referenced in IEEE 802.3 100G SR study group documents.
Direct PDF fetch blocked (403), but the WebSearch engine extracted values from the PDFs.

### VERDICT on Polish-D primary-source claim
**INDEPENDENTLY CONFIRMED.** Three-source family convergence (TIA FOTC + multi-vendor industry + IEEE 802.3 working-group):
- OM5 @ 850 nm = **4,700 MHz·km** (CORRECT — same as OM4, intentional backward-compat)
- OM5 @ 953 nm = **2,470 MHz·km** (CORRECT — unique OM5 spec)
- Prior lesson value of "28,000 MHz·km" = **FABRICATED** — confirmed by absence from every source

Polish-D's claim stands. The 3rd cascade-precedent check passes.

---

## 2. Polish-D 3-Loci Verification (in-situ file check)

**Fix 1 — L08 key_terms OM5 definition (line 23):**
Current text: `'...EMB = 4,700 MHz·km @ 850 nm (identical to OM4 — intentional backward-compat design per TIA-492AAAE) + 2,470 MHz·km @ 953 nm (new spec unique to OM5, enabling SWDM4 short-wavelength WDM). Lime green jacket. OM5\'s differentiator is ADDING the 953 nm spec, not increasing 850 nm bandwidth...'`
**VERIFIED.** Backward-compat reframe explicit. Differentiator correctly named as 953 nm addition.

**Fix 2 — L08 Flashcard back text OM5 (line 124):**
Current text: `'...EMB = 4,700 MHz·km @ 850 nm (same as OM4 — backward-compat by design per TIA-492AAAE) + 2,470 MHz·km @ 953 nm (new OM5-only spec enabling SWDM4). OM5\'s value is the ADDED 953 nm spec for short-wavelength WDM, not a higher 850 nm number...'`
**VERIFIED.** Phrasing consistent with key_terms. Explicit "not a higher 850 nm number" guard present.

**Fix 3 — L08 OM grade table OM5 row (lines 188–194):**
Current table cell: `4,700 MHz·km @ 850 nm (same as OM4); 2,470 MHz·km @ 953 nm (SWDM4)` + inline note: `Per TIA-492AAAE: OM5 intentionally keeps the 850 nm EMB identical to OM4 (4,700 MHz·km) for backward compatibility. OM5's differentiator is the added 953 nm EMB spec (2,470 MHz·km)...`
**VERIFIED.** All three loci corrected. No residual "28,000" value anywhere — grep across all T02 lessons returned zero hits.

---

## 3. Reframe Quality (Pedagogy + Cross-Lesson Sweep)

**Prose positioning of OM5 differentiator:**
The lesson clearly and consistently frames OM5's value as ADDING the 953 nm spec — not increasing 850 nm bandwidth. The phrase "OM5's differentiator is ADDING the 953 nm spec, not increasing 850 nm bandwidth" appears in key_terms (line 23). Flashcard reiterates "not a higher 850 nm number" (line 124). Table includes inline note.

**Any remaining implication that OM5 has higher 850 nm bandwidth than OM4?**
Grep for all permutations ("OM5.*higher.*850", "850.*higher.*OM5", "OM5.*boost", "OM5.*exceed.*OM4.*850") returned zero results. No residual misleading framing.

**Cross-lesson sweep (L01, L05, L07, L09, L10, L12):**
- L01 line 221: `For 50-µm multimode (OM3/OM4/OM5): NA ≈ 0.20` — NA value only, no EMB claim. CLEAN.
- L07 line 133: `data center and campus applications (OM1–OM5)` — wavelength context only, no EMB claim. CLEAN.
- L05 (dB lesson), L09 (PMD), L10 (fiber characterization), L12 (capstone): grep for OM5/4700/2470/953 returned zero results. CLEAN.
- **Zero stale OM5 EMB claims across all T02 lessons outside L08.**

**Pedagogy quality of reframe:**
The backward-compat explanation is genuinely instructive for the field-crew audience. A learner reading the key_terms will understand WHY OM5 doesn't boost 850 nm (backward compatibility), and WHAT OM5 actually adds (953 nm for SWDM4). No confusing "higher bandwidth" implication remains anywhere.

---

## 4. Regression Hunt (Polish-A/B/C + Fix Wave A Intact?)

**Polish-A — G.655 (NZ-DSF) Flashcard:**
- `vocabulary_introduced` includes `'G.655 (NZ-DSF)'` ✓
- key_terms entry at line 27 with full definition ✓
- Flashcard render at line 126 ✓
- Prose section at lines 230–250 ✓
- **INTACT. No regression.**

**Polish-B — Rate-separation phrasing (25GbE / IEEE 802.3by / SWDM MSA):**
- key_terms OM5 at line 23: `Rate-specific reach: 10GbE up to ~400 m, 25GbE up to ~100 m (per IEEE 802.3by; 200 m achievable via SWDM MSA), 100GbE SWDM4 up to ~150 m (per SWDM MSA)` ✓
- Flashcard OM5 at line 124: identical phrasing ✓
- **INTACT. No regression.**

**Polish-C — SWDM MSA / 802.3by / 10GbE citations:**
Verified via grep: `SWDM`, `802\.3by` present in multiple loci in L08. No citation damage from Polish-D.
- **INTACT. No regression.**

**Fix Wave A corrections (G.655 in key_terms/prose, OM1/OM2 Flashcard renders):**
- G.655 in vocabulary_introduced line 17 ✓
- OM1 Flashcard at line 119, OM2 Flashcard at line 120 ✓
- **INTACT. No regression.**

---

## 5. Vite Build Result

```
✓ built in 5.97s
```
All modules resolved. No import errors. Build clean.

---

## 6. Saturation Verdict — 8th Framing

After R-1 through R-4 + Fix Wave A + Polish-A/B/C/D + RT-α through RT-θ + this RT-ι:

**New findings this round:** ZERO new findings. All items checked (primary-source re-verification, 3-loci check, cross-lesson sweep, regression hunt, capstone quiz check) returned clean.

**Rediscoveries only:** Polish-C citation markers `[confirm edition]` on TIA-492AAAD and ITU-T G.655 remain — these are intentional pending Carter's edition lock, not errors. Already tracked as P3 in Polish Queue. Not a new finding.

**Saturation criteria met:** No new findings at any severity. Only prior-known deferred items (P3 edition confirmation) remain. 8th framing is saturated.

---

## 7. Final Verdict

**VERDICT: GREEN**

All Polish-D fixes independently verified against ≥3 source families. The 3rd cascade-precedent check passed — Polish-D's claim was correct and is now independently confirmed. No regressions from any prior polish stage. No stale OM5 EMB claims anywhere in the T02 lesson set. Cross-lesson sweep clean. Vite build clean.

**T02 IS READY TO CLOSE.**

Remaining open item (P3): TIA-492AAAD and ITU-T G.655 edition `[confirm edition]` markers — these are intentional, Carter-gated, and correctly marked in the lesson. Not a blocker for closure.

=== T02 FINAL VERIFY 4 RT I PEDAGOGY END ===
