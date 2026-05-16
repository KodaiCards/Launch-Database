# T01 POLISH-1 Closeout Notes

**Commit:** `98bcaba`
**Files modified:** L03, L05, L08, L09 (T01 only — no other files touched)
**Vite build:** CLEAN (✓ built in 12.76s, 131+ modules)

---

## Primary-source verifications

### NEW-T2 — TIA-598 outdoor jacket color
**Source:** FOA ColCodes.htm (thefoa.org) + TIA-598 secondary summaries via WebSearch
**Finding:** "Outdoor cables are almost always black for UV resistance, regardless of the fiber inside. For these, you must read the printed legend on the jacket." Carbon black in HDPE is what provides UV protection — colored pigments cannot provide equivalent UV resistance. LSZH OSP cable is identified by print legend (e.g., "LSZH", "OFNR", "OFNP"), NOT jacket color. Non-black outdoor jackets (e.g., yellow for high-visibility utility coordination) are vendor-specific variants, not TIA-598 standard color conventions.
**Verdict:** R3-06 regression confirmed wrong. Fix applied.

### NEW-T1 / NEW-T3 — 47 CFR 1.1411(h) OTMR 15-business-day rule
**Source:** WebSearch via ojua.org OTMR summary + Katapult Engineering blog on FCC pole attachment timeline
**Finding:** "Make-ready work in an OTMR application is not to exceed 15 business days." The 15 business days is the COMPLETION deadline from approval — not a window to START work. Prior L05 text "15 business days to complete simple attachments from approval to start" was ambiguous/inverted. L09 had "15 days" (wrong — should be "business days").
**Verdict:** Both fixes applied and are consistent with 47 CFR 1.1411(h)(2)(ii).

---

## Fixes applied (BEFORE → AFTER)

### NEW-T2 MED — L03 jacket-color claim
**BEFORE:** "Jacket color varies by application: black is standard for aerial and direct-buried OSP; orange or yellow jackets indicate conduit-application or LSZH (Low-Smoke Zero-Halogen) variants used in conduit systems..."
**AFTER:** Explains black is standard (carbon black = UV protection), LSZH identified by printed legend on jacket (not color), non-black = vendor variant not TIA-598 convention. "Always read the jacket print."

### NEW-T1 LOW — L05 OTMR phrasing
**BEFORE:** "OTMR rules give the fiber company 15 business days to complete simple attachments from approval to start"
**AFTER:** "under OTMR, simple make-ready must be completed within 15 business days of approval — the 15 days is the completion deadline, not a start window"

### NEW-T3 LOW — L09 "15 days" → "15 business days"
**BEFORE:** "(15 days for simple attachments). Attachment fee calculation."
**AFTER:** "(15 business days to complete simple make-ready). Attachment fee calculation."

### NEW-S1 LOW — L08 OS2 missing from vocab_introduced
**BEFORE:** `vocab_introduced` array had HDPE, ADSS (no OS2); flashcard `T01-L08-FC-os2` rendered but no array entry
**AFTER:** `'OS2'` added to `vocab_introduced` between `'HDPE'` and `'ADSS'`

### NEW-S2 LOW — L08 HDPE missing flashcard
**BEFORE:** `vocab_introduced` had `'HDPE'`; no `T01-L08-FC-hdpe` flashcard in `cards` array
**AFTER:** Added `{ id: 'T01-L08-FC-hdpe', front: 'HDPE', back: 'High-Density Polyethylene — a rigid thermoplastic used for OSP conduit and cable outer jackets. Resists UV radiation, moisture, and chemical exposure. OSP fiber conduit is typically Schedule 40 PVC or HDPE; innerduct inside conduit is often corrugated HDPE.' }` — definition pulled verbatim from L08 prose line 257.

### NEW-S4 LOW — L09 Flashcard ordering
**BEFORE:** Flashcard block was between `</section>` (foundations) and `<section data-tier="working">` — wrong position
**AFTER:** Flashcard block moved to between `</section>` (advanced) and `{/* PRACTICE QUIZ */}` — correct order: Foundations → Working → Advanced → Flashcards → Quiz

---

## Neighborhood scan findings (NOT fixed — surfaced only)

- L03: Learning objective line 39 mentions "Explain why LSZH and colored jacket variants exist" — should be reviewed to align with the corrected jacket-color content (LSZH isn't identified by color; the objective's phrasing is still defensible but slightly ambiguous given the fix).
- L05: The `learning_objectives` array at line 39 mentions "15-business-day response timeline under 47 CFR 1.1411(h)(2)(ii)" — text says "response" which could be interpreted as application response (15-day review period) vs. make-ready completion. The body content now correctly says "completion deadline." Objective language is not wrong but slightly ambiguous.
- L08: The `learning_objectives` line 65 says "31 OSP acronyms" — with OS2 now added to `vocab_introduced`, the count implied by this objective may need verification (OS2 was already in the table and flashcards, just not formally tracked in the array).

=== T01 POLISH-1 NOTES END ===
