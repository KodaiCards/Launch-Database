# T02 Retroactive Audit — R-3: Field-Crew Learner / Pedagogy-Pitch / Jargon-Before-Definition

**Framing:** Senior OSP engineer + curriculum reviewer operating simultaneously as a field-experienced crew member with zero formal engineering training attempting to learn from these lessons cold.

**Constraints acknowledged (FIRST LINE):** READ-ONLY contract. No lesson file edits. No *_CANONICAL.md or *_FIX_*.md created. No orchestrator impersonation. No follow-up rounds dispatched. Write-path: this file only.

---

## Stack Snapshot

T02 has 12 lessons (L01–L12). Foundations / Working / Advanced structure is present in all sampled lessons. Acronym tables and flashcard blocks are consistent. The writing level is generally good — better than typical OSP training material — but several specific jargon-before-definition failures exist, formula-unpacking is nearly complete but has two structural gaps, and two analogy absences stand out for the most abstract physics concepts.

---

## R-1 + R-2 Reconciliation (≤120 words — do NOT re-flag)

R-1 flagged: L01 critical-angle contradiction, 3 MED, 6 LOW flashcard gaps.  
R-2 flagged: L08 OM5 EMB wavelength (28000 MHz·km listed as @ 953 nm but EMB spec is @ 850 nm in TWO locations), L01 OM2 core-diameter error, L07 GPON-DAG null, L07 1490nm band classification, L08 broken T02.L07b pointer.

Not re-flagged below. R-3 framing (learner usability + jargon + math completeness + analogies) is orthogonal to R-1's citation/technical framing and R-2's adversarial-corroboration framing. Overlap expected to be low.

---

## NEW Findings from R-3 Learner-Pedagogy Framing

| ID | Sev | Category | File | Line Range | Issue | Fix Shape | Confidence |
|----|-----|----------|------|-----------|-------|-----------|------------|
| R3-01 | MED | jargon-DAG | L01 | ~167–170 | "Snell's Law" used inline as a proper-noun fact-dump with no plain-English setup or analogy before the formula block. A field-crew learner hits "Snell's Law describes what happens" with zero grounding in what Snell's Law is or why it exists. The formula n₁ × sin(θ₁) = n₂ × sin(θ₂) then appears without variable definitions inline. | Add 1-sentence prior-framing ("Snell's Law is just the rule for how much light bends when it crosses from one material into another") + inline variable definitions for n₁, n₂, θ₁, θ₂ in the prose before the formula block. | HIGH |
| R3-02 | MED | math-completeness | L01 | ~186–193 | Critical-angle formula `sin(θ_c) = n₂ / n₁` is shown but no intermediate steps are shown converting this to "θ_c ≈ 85°" for the G.652 values. The lesson says "sin(θ_c) = 1.463 / 1.468 ≈ 0.9966, so θ_c ≈ 85°" — the inversion step (θ_c = arcsin(0.9966)) is skipped. For a learner without trig background, arcsin is unexplained. | Add one intermediate step: "θ_c = arcsin(0.9966). The arcsin (inverse sine) function asks: what angle has a sine of 0.9966? The answer is about 85°. You can check this on any calculator with a sin⁻¹ key." | HIGH |
| R3-03 | MED | analogy-missing | L01 | ~195–213 | Numerical Aperture (NA) section has the formula NA = √(n₁² − n₂²) but no plain-English analogy for what NA *feels like* in the field before the equation. The concept of "acceptance cone" is mentioned but not given a real-world picture. A learner who doesn't know what a "cone of light" is will stall here. | Add analogy before the formula: "Think of NA like the flare angle of a funnel. A wide funnel (high NA) catches light from a wide angle — that's multimode. A narrow funnel (low NA) only catches light aimed almost perfectly straight — that's single-mode. The formula quantifies how wide that funnel is." | HIGH |
| R3-04 | LOW | jargon-DAG | L01 | ~238–250 | "evanescent field" used in the Advanced section (MFD discussion) with no definition or analogy. A learner who has been following well will hit this term cold. The word "evanescent" is unusual vocabulary. | Add inline definition: "…the evanescent field — a small tail of light energy that extends just barely past the glass boundary, like the glow that halos a neon sign even in the air around it." | MEDIUM |
| R3-05 | LOW | jargon-DAG | L02 | ~171–174 | "Rayleigh scattering" is introduced without a plain-English setup. The lesson says "Rayleigh scattering — light scattering from microscopic density variations" which is technically correct but doesn't tell a learner *why* it matters or give them an analogy. "1/λ⁴" scaling is stated with no unpacking. | Add one sentence: "Think of Rayleigh scattering like sunlight scattering off dust — the smaller the particles relative to the wavelength, the more they scatter, and the effect grows very fast as wavelength decreases (it's a 4th-power relationship — halve the wavelength, get 16× more scattering)." | MEDIUM |
| R3-06 | LOW | jargon-DAG | L02 | ~181–184 | "OH⁻ water peak" and "hydroxyl ions" are introduced but the connection to "water in glass" is only implied, not explicit. A non-chemistry reader may not know what "hydroxyl" means. | Add: "OH⁻ is the chemical symbol for a hydroxyl ion — basically a water molecule fragment. When fiber is drawn, trace amounts of water vapor can bond into the glass structure, creating this absorption spike. G.652.D fiber is manufactured with tight controls on hydrogen exposure during drawing to minimize it." | LOW |
| R3-07 | MED | math-completeness | L03 | ~120–158 | The chromatic dispersion formula ΔT = D × Δλ × L has full variable definitions and a worked numerical example — PASS. However, the *units* of ΔT are stated as "picoseconds" but the unit derivation is not shown (ps/(nm·km) × nm × km = ps). A learner who is careful about units will not be able to verify this without being shown the cancellation. | Add one line after variable definitions: "Check the units: ps/(nm·km) × nm × km → the nm and km cancel, leaving ps. Good — the result is in picoseconds, which is what we want." | LOW |
| R3-08 | LOW | analogy-missing | L03 | ~275–297 | The PMD "bicycle wheel" analogy in L09 is excellent; L03's Advanced PMD section introduces the concept without any analogy ("two polarization orientations of the same light wave travel at slightly different speeds"). For a learner first encountering polarization, this is abstract. L03 is a foundation lesson for PMD; L09 has the full analogy but a learner may not know to proceed there. | Add a forward pointer: "Polarization is like a vibrating rope — it can vibrate side-to-side or up-and-down. In fiber, light has two such vibration planes. PMD happens when one plane travels slightly slower than the other through imperfect fiber. We dig into this with a full analogy in T02.L09." | LOW |
| R3-09 | HIGH | jargon-DAG | L05 | ~67–75 | The dB formula block introduces "log₁₀" (logarithm base 10) with the inline tag "(the 'log' key on a calculator)" but NO plain-English explanation of what a logarithm is or why it exists. The lesson title is "Decibels Without the Algebra Fear" — yet logarithm is used in the central formula without the promised fear-removal. The *key_terms* flashcard for 'logarithm' IS present and IS good (line ~21: "The log base 10 of a number answers: '10 to what power equals this number?'"), but that card is not rendered as a Flashcard component near the formula. A learner who skips/misses the flashcard section will hit the formula cold. | Render the logarithm key_term flashcard near or immediately before the formula block, OR copy the key_terms definition inline: "A logarithm (the 'log' key on your calculator) asks: '10 to what power equals this number?' log₁₀(100) = 2 because 10² = 100. log₁₀(0.5) = −0.30 because 10^(−0.30) ≈ 0.5. That's why 3 dB ≈ half the power." | HIGH |
| R3-10 | LOW | prose-readability | L05 | ~142–159 | Example 2 (converting −28 dBm to µW) uses "10^(−3) × 10^(0.2)" as an intermediate step without explaining the property of exponents being used (a^(b+c) = a^b × a^c). A learner who is algebraically weak won't follow this decomposition. | Add one sentence: "We split 10^(−2.8) into 10^(−3) × 10^(0.2) using the exponent rule: 10^(a+b) = 10^a × 10^b. Here −3 + 0.2 = −2.8. This lets us use the familiar 10^(−3) = 0.001 and approximate 10^(0.2) ≈ 1.585." | LOW |
| R3-11 | LOW | structure | L06 | ~205–231 | The Advanced section introduces "ORL" (Optical Return Loss) and "UPC/APC connectors" without prior definition in the lesson body. UPC and APC have no inline definitions and are not in key_terms or the acronym table. A learner who is reading sequentially for the first time will encounter "APC (angled physical contact — the green connectors)" as an aside without understanding the context. | Add UPC/APC to the lesson's acronym table: "APC = Angled Physical Contact (green connector — angled end-face minimizes reflections); UPC = Ultra Physical Contact (blue connector — flat end-face, more common for OSP interconnect)." | LOW |
| R3-12 | MED | jargon-DAG | L07 | ~128–130 | "VCSELs (vertical-cavity surface-emitting lasers)" is introduced in the 850 nm section with expansion in parentheses — good. However, the expansion "vertical-cavity surface-emitting" is itself jargon that means nothing to a field learner. The practical implication (cheap, fast, good for short distances) is stated, which saves the sentence. But a learner seeking to understand "what is a VCSEL" from this sentence will not succeed. | Add a one-sentence plain-English description after the expansion: "— a type of low-cost laser chip that emits light from its flat top surface (like a tiny flashlight pointing straight up) rather than from the side like conventional laser diodes. Cheaper to manufacture in large volumes, which is why every data center uses them." | LOW |
| R3-13 | MED | jargon-DAG | L07 | ~242–243 | "EDFA amplifier" introduced inline: "EDFA amplification is native to the C-band — DWDM systems boost all channels simultaneously with one amplifier." EDFA is not in the acronym table, not in key_terms, and the expansion "Erbium-Doped Fiber Amplifier" does not appear anywhere in L07. EDFA is a meaningful concept for OSP crews coordinating with carrier networks. | Add EDFA to the L07 acronym table: "EDFA = Erbium-Doped Fiber Amplifier — an inline optical amplifier that boosts light without converting to electrical signal. Works only in the C-band (1530–1565 nm). When DWDM routes span >80 km, EDFA amplifiers are placed at intervals." | MEDIUM |
| R3-14 | LOW | math-completeness | L09 | ~80 (DGD card) | The DGD key_terms flashcard states "Formula: DGD_rms = PMD_coefficient x sqrt(L)" but the lesson body does NOT contain a worked numerical example showing the formula applied step-by-step. For the 100 km example mentioned in L03's Advanced section, no intermediate arithmetic is shown. | Add a brief numerical demonstration in the Working section: "Example: G.652.D fiber, 100 km. PMD_coeff = 0.2 ps/√km. DGD_rms = 0.2 × √100 = 0.2 × 10 = 2 ps. At 10 Gb/s, one bit period = 100 ps. 2 ps is well within the 10% tolerance (10 ps). At 100 Gb/s, one bit period = 10 ps — the same 2 ps DGD is now 20% of a bit period, which degrades signal quality." | LOW |
| R3-15 | LOW | structure | L10 | prereq meta | L10 lists `T02.L09` as a prerequisite — correct. But L10's "In Plain English" opening says "You've learned what attenuation, chromatic dispersion (CD), and PMD are. Now: how do you actually measure these properties?" A learner following lesson order (L01→L10) may not have done L09 first if they skipped it (L09 is marked `lesson_type: 'advanced'` which implies optional). L10 introduces `DGD` in vocabulary_assumed referencing L09 — correct. The lesson should add a one-sentence caveat if L09 was skipped. | Add note: "This lesson references DGD (Differential Group Delay) from T02.L09. If you skipped L09 (the advanced PMD lesson), you can still follow this lesson — just know that PMD characterization requires specialized instruments distinct from standard OTDR testers." | LOW |

---

## Jargon-Before-Definition Table (Carter's #1 concern — dedicated subsection)

Terms that appear in lesson PROSE without a prior inline definition or acronym table entry at first use:

| Term | Lesson | First appearance (approx.) | Defined first? | Notes |
|------|--------|---------------------------|---------------|-------|
| Snell's Law | L01 | Line ~169 | NO | Used as a proper noun with no prior setup |
| arcsin / inverse sine | L01 | Line ~190 (implied in θ_c ≈ 85°) | NO | Intermediate trig step skipped |
| evanescent field | L01 | Line ~239 | NO | Advanced section; no definition |
| Rayleigh scattering | L02 | Line ~171 | Partial | Technical definition present, analogy absent |
| hydroxyl ions / OH⁻ | L02 | Line ~181 | Partial | Chemical symbol given, plain-English connection absent |
| logarithm / log₁₀ | L05 | Line ~68 | In flashcard but NOT rendered near formula | Critical gap in "Decibels Without Algebra Fear" |
| ORL (Optical Return Loss) | L06 | Advanced section | NO | Not in acronym table; not in key_terms |
| APC / UPC connectors | L06 | Advanced section | Partial | "green connectors" / "blue connectors" given, no acronym expansion in table |
| VCSEL (what it actually IS) | L07 | Line ~128 | Partial | Expansion given, plain-English description absent |
| EDFA | L07 | Advanced section | NO | Not in acronym table, not in key_terms |
| DFB / ECL lasers | L07 | Advanced section | NO | "DFB/ECL lasers" used without expansion |
| birefringence | L09 | key_terms card | YES (flashcard) | Defined in key_terms; acceptable |
| four-wave mixing | L08 | ~Line 228 | NO | "nonlinear effect" mentioned with no explanation of what four-wave mixing physically is |

**Summary:** 4 HIGH/MED jargon-before-definition failures (Snell's Law, arcsin, logarithm near formula, EDFA), 8 LOW/partial gaps.

---

## Math Worked-Example Completeness Table

Checking each formula against the 5-point checklist: (1) plain-English description before formula, (2) all variables defined with units, (3) every algebra step shown, (4) worked numerical example, (5) sanity-check sentence.

| Formula | Lesson | (1) Plain Eng | (2) Vars+Units | (3) All Steps | (4) Numerical | (5) Sanity | Notes |
|---------|--------|--------------|---------------|--------------|--------------|-----------|-------|
| TIR critical angle: sin(θ_c) = n₂/n₁ | L01 | ✓ | ✓ | PARTIAL | ✓ | ✓ | arcsin inversion step skipped (R3-02) |
| Snell's Law: n₁sin(θ₁)=n₂sin(θ₂) | L01 | ✗ | PARTIAL | ✓ | Implicit | ✓ | Variables not defined inline (R3-01) |
| NA = √(n₁²−n₂²) | L01 | PARTIAL | ✓ | N/A | ✓ | ✓ | Analogy missing (R3-03) |
| dB/km = loss/km | L02 | ✓ | ✓ | ✓ | ✓ | ✓ | PASS |
| ΔT = D × Δλ × L | L03 | ✓ | ✓ | ✓ | ✓ | ✓ | Unit cancellation not shown (R3-07, LOW) |
| dB = 10×log₁₀(Pout/Pin) | L05 | ✓ | ✓ | ✓ | ✓ | ✓ | Logarithm not explained near formula (R3-09, HIGH) |
| dBm = 10×log₁₀(P/1mW) | L05 | ✓ | ✓ | ✓ | ✓ | ✓ | PASS |
| Budget = Tx − Rx | L06 | ✓ | ✓ | ✓ | ✓ | ✓ | PASS |
| DGD_rms = PMD × √L | L09 | ✓ | ✓ | N/A | MISSING | MISSING | No numerical walkthrough in body (R3-14) |
| ORL = −10×log₁₀(Prefl/Pin) | L06 Advanced | PARTIAL | ✓ | N/A | None | None | Advanced section, acceptable for tier |

---

## Coverage Gaps Still Unexamined (≤120 words)

- L12 capstone quiz content not audited (ran out of token budget; did not read quiz question details).
- L11 "field gotcha" BranchingScenario content not fully read — only meta/key_terms reviewed.
- L08's SideBySide interactive component content not inspected.
- L09 and L10 slider interactive compute logic not audited for math accuracy (that's R-1/R-2 territory).
- Cross-lesson vocabulary_assumed back-reference accuracy (does each term's `source_lesson_id` actually introduce that term?) checked only for L01, L07, L10 — not all 12.

---

## Saturation Hint for R-4 (≤80 words)

R-3 found 3 HIGH/MED jargon-before-definition gaps (Snell's Law setup, arcsin step, logarithm near formula), 1 HIGH analogy absence (NA concept), 1 MED missing acronym (EDFA), and 1 MED missing analogy (NA acceptance cone). These are pedagogy-class bugs orthogonal to R-1/R-2 technical/citation findings. An R-4 framing of "quiz-answer-quality + interactive-element learner-UX" would be the most distinct next framing — checking whether wrong-answer distractors are plausibly confusing vs. obviously silly.

---

## Closeout

Vite build: `✓ built in 5.95s` (confirmed green prior to this commit).

=== T02 AUDIT R3 LEARNER PEDAGOGY END ===
