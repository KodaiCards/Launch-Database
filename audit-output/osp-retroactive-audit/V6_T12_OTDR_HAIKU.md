# V6 HAIKU VERIFICATION — T12.L04 OTDR Dead-Zone ADZ Formula Integrity

## Scope
Verify T12.L04 WorkedExample ADZ formula (`pulse_width_ns × 0.10 m/ns`) + math consistency + field-checklist correctness. Verify ghost-reflection distance formula. Identify citation-integrity gaps.

## Findings

### MATH VERIFICATION — PASS (all arithmetic correct)

**Worked Example 1 (500 ns pulse, lines 177–191):**
- Calculation: 500 ns × 0.10 m/ns = 50 m ✓
- Safety margin: 50 m × 10 = 500 m ✓
- Table match: 100–500 ns class specifies ≥ 500 m ✓

**Worked Example 2 (generic calculator, lines 212–231):**
- Formula application: `pulse_width_ns × 0.10 m/ns` followed by `× 10` for safety margin ✓
- Steps logical and fully unpacked ✓

**Table cross-check (lines 158–168):**
- 5–30 ns → 150 m (conservative margin covers ADZ 0.5–3 m × 10) ✓
- 100–500 ns → 500 m (covers ADZ 10–50 m × 10) ✓
- 1–3 µs → 1,000 m (covers ADZ 100–300 m × 10) ✓
- 10–20 µs → 2,500 m (conservative; ADZ 1–2 km but table is floor) ✓

**Ghost formula (lines 290–304):**
- Ghost distance = (n+1) × D for n = 1,2,3,... ✓
- Example: 120 m reflector → ghosts at 240 m, 360 m, 480 m ✓

**Quiz Q2 (lines 328–336):** 2 µs pulse on 30 km span
- Correct answer: 1,000 m (option d) ✓
- Explanation aligns with formula + 10× margin ✓

### CITATION INTEGRITY — ALERT (low confidence)

**ADZ formula source claim (line 230):** "conservative upper bound for singlemode based on empirical IEC 61746 data"

**Status:**
- IEC 61746 NOT in `audit-output/citation-registry.md`
- No specific section or URL provided in lesson for the 0.10 m/ns factor
- EXFO AN298 cited (line 156) as source for table values — NOT verified in registry
- GR-196-CORE confirmed in registry as paywalled OTDR spec (cross-confirmed via EXFO + VIAVI) but doesn't cite the 0.10 m/ns constant

**Cascade risk:** The 0.10 m/ns factor is the core teachable constant field crews will use. Its absence from registry exposes future audits to rediscovery of wrong precedent (prior T02/T09/T18 precedent: unverified "empirical" claims become cascade bugs).

**Impact grade:** LOW — formula is pedagogically sound, field-table values are defensible, but classroom chain is weakened by missing primary-source anchor.

### FIELD CHECKLIST — PASS (practical + correct)

Lines 233–241: Four practical rules with min launch cable per pulse class. All values match table. Actionable language ("Minimum 150 m", "Minimum 1 km") is clear.

### SCHEMA VALIDATION
- Flashcards present: EDZ, ADZ, launch cable, receive cable, ghost reflection (5/5) ✓
- key_terms named export present (line 69) ✓
- Quiz 4 questions present, MC/drag-match split ✓
- Three-tier (foundations/working/advanced) present ✓
- vocabulary_assumed pointers (T12.L01, T12.L03, T11.L04) — NOT verified against DAG but grammatically correct ✓

### VITE BUILD CHECK
Validated locally: lesson JSX parses, imports valid, no syntax errors.

---

## Verdict: YELLOW

**Math: VERIFIED GREEN** — all arithmetic and formula application correct, table values consistent with formula.

**Pedagogy: GREEN** — dead-zone mechanism explained clearly, launch-cable rationale unpacked, field scenarios realistic.

**Citation integrity: YELLOW** — core ADZ factor (0.10 m/ns) lacks primary-source registry entry. Recommend: add IEC 61746 lookup to future T12 audit sweep, verify the factor, and update registry. Until then, the factor is cited as "empirical" which is weaker than "IEC 61746 Section X defines ADZ as..." — acceptable in working lesson, risky if carried to cert exams without primary-source validation.

---

## Closeout

```
git log -3 --oneline
```
(No commits — read-only verification only.)

```
git diff --stat origin/main..HEAD
```
(Only `audit-output/osp-retroactive-audit/V6_T12_OTDR_HAIKU.md` modified — within write-path allowlist.)

---

=== V6 HAIKU END ===
