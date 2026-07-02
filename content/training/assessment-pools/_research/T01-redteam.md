# T01 assessment pools — independent red-team report

> Red-teamer: C2 (Sonnet-5 builder). Author = C1 (author ≠ RT, per the gate). Scope: full T01 —
> all nine lesson pools `T01-L01.json` … `T01-L09.json` **plus** `T01-final.json` (24Q topic
> final, added in a second pass once C1 finished it), red-teamed against `content/training/
> assessment-pools/_research/T01.md` (C1's research log, both the L01-L09 tables and its
> `T01-final.json` addendum). 96 questions total.
>
> Method: read every question in all 9 pool files in full (no sampling). Checked, per question:
> (1) answer-key correctness, (2) whether the `citation` field — or its absence — is justified
> by an actual logged, verified source in `T01.md`, (3) ambiguity / double-correct / leading
> stems, (4) banned type residue, (5) structural validity (`answerIndex` in range, `correctMap`
> keys/values match `targets`/`items`). Also ran an automated structural check (Python) across
> all 72 questions for type/answerIndex/correctMap validity and citation-field presence.

## Structural check (automated) — PASS

- **Banned types:** zero `fill-in-blank` or any type outside `mc`/`drag-match` across all 96
  questions in the 10 pools (9 lessons + final).
- **`answerIndex` bounds:** valid (0 ≤ index < choices.length) on every `mc` question.
- **`drag-match` correctMap:** every `correctMap` key set exactly equals its `targets` id set,
  and every value is a valid `items` id — no orphan/missing mappings.
- **No duplicate question ids** within or across pools.
- **Floors:** every lesson pool has 8 questions (≥ `drawCount` 4), `drawCount: 4`,
  `passThreshold: 70` — matches the `_readme.md` launch dial, `kind: "lesson"` correct on all 9.
  `T01-final.json` has 24 questions (≥ `drawCount` 15), `drawCount: 15`, `passThreshold: 80`,
  `kind: "topic_final"` — matches the topic-final launch dial.

## Answer-key / ambiguity / leading-stem check — PASS

Read every question stem, choice set, and explanation. No double-correct answers, no ambiguous
stems, no leading language that telegraphs the answer independent of domain knowledge. The one
judgment-framed question (`T01-L04-Q4`, "which is LEAST critical to include") has a defensible
single best answer (vendor name vs. the three traceability-critical fields) — not flagged.

Cross-checked the two corrected citation-error claims from the research log
(RUS 1751F-630 misapplied to general OSP-scope; 47 CFR 1.1411 misapplied to attachment fees
instead of 1.1409) against how the pools actually use them — both corrections are applied
consistently everywhere those facts appear (`T01-L01-Q7`, `T01-L02-Q4/Q5`), not just in the
first occurrence. Same check on the three L04-L09 corrections (RUS Form 219, RUS 1753F-201,
GR-771-CORE for splice closures) — consistently applied in `T01-L04-Q5`, `T01-L05-Q7`,
`T01-L09-Q2`.

**`T01-final.json` (24Q, second pass):** same read-every-question method. No double-correct,
ambiguous, or leading stems. Spot-checked every synthesis fact against the per-lesson pools it
draws from — the 5 corrected citation errors (1751F-630, 1.1409/1.1411, Form 219/515,
1753F-201/1755, GR-771-CORE) are re-applied correctly in the final's versions of those questions
(`T01-final-Q4/Q7/Q8/Q12/Q21`), not silently reverted to the legacy-wrong citations. `T01-final`'s
research-log addendum states it introduces **zero new citations** — reuses only sources already
verified in the L01-L09 tables — and that check holds: every citation string in the final pool
traces to a source already in the table above it in `T01.md`.

## Citation completeness — FINDINGS (not a clean pass)

37 of 72 lesson questions, and 9 of 24 final questions (`T01-final-Q3/Q9/Q10/Q14/Q15/Q17/Q22/Q23`
+ Q1's pointer-gap counted separately below), have no `citation` field. The great majority are
general professional/procedural knowledge (role responsibilities, project-stage sequencing,
terminology, as-built-vs-as-designed) in the same category C1's own log already treats as not
requiring a primary-source citation (the "PE licensing — general level" precedent), and every
uncited final question is a direct synthesis of an already-checked-and-accepted uncited lesson
question (e.g. `T01-final-Q9` restates `T01-L04-Q1`'s macrobend-after-closure scenario). Those
are **not** flagged — requiring a citation for "who fixes a punch-list item" or "what's an inline
splice closure" would be gate-maximalism past the point of catching real risk.

Two categories of **real** gaps found:

### 1. Specific unverified facts asserted with zero citation AND zero research-log coverage

- **`T01-L04-Q7`** — asserts a specific number: "a minimum bend radius (commonly around 30 mm
  for coiled fiber in a splice case)". No `citation` field. **Not mentioned anywhere in
  `T01.md`** — this number was not run through the citation gate at all. This is exactly the
  R18 failure mode (a specific fact stated as settled truth from memory). **Recommend:** either
  source the 30mm figure against a real splice-tray/closure spec (Telcordia GR-771-CORE or a
  named vendor tray datasheet — GR-771-CORE is already cited elsewhere in this same lesson pool
  for closure requirements, so it's a plausible home for this fact too) and add a `citation`, or
  hedge the language the way `T01-L02-Q2`/`Q3` do for unverified NESC rule numbers ("commonly
  cited around 30mm; verify against the tray manufacturer's spec").
- **`T01-L08-Q7`** — asserts a specific standard-number mapping: "per ISO/IEC 11801" that OS2
  corresponds to G.652.D SMF. No `citation` field, and **ISO/IEC 11801 does not appear anywhere
  in `T01.md`** — it was never run through the citation gate either, despite the question
  explicitly invoking a named standard by number in its own prompt text. The OS1/OS2↔G.652
  mapping itself is correct to my own knowledge, but "correct" and "gate-compliant" are
  different bars here — this is the second uncited number-bearing claim.

### 2. Citations that point at the research log for verification the log doesn't actually contain

Four questions cite "(see T01.md research log)" or "independently verified this session" for a
source that has **no corresponding row in `T01.md`'s citation tables**:

- `T01-L01-Q3` — "Standard industry/BICSI OSP-vs-ISP demarcation convention... see T01.md
  research log" — no BICSI-demarcation row exists in the log.
- `T01-L05-Q1` — cites "ANSI/TIA-606-C (documentation/administration standard)" — not in the log.
- `T01-L08-Q3` — cites "BICSI credentialing program scope (RCDD); FOA credentialing program
  scope (CFOT/CFOS)" — not in the log.
- `T01-L08-Q4` — "NFPA 70 (NEC) scope; IEEE C2 (NESC) scope — both independently verified this
  session (see T01.md)" — the log verifies NESC C2-2023 for *pole-zone/clearance* facts, but has
  no row establishing the general NEC-vs-NESC jurisdictional-scope claim this question makes.

**`T01-final.json` repeats this same pattern twice** rather than introducing new instances:
`T01-final-Q1` reuses `T01-L01-Q3`'s uncovered "BICSI/industry demarcation convention" pointer,
and `T01-final-Q19` reuses `T01-L08-Q4`'s uncovered NESC/NEC-scope "see T01.md" pointer. Same
root cause, not a new defect — fixing the two lesson-level rows (below) also resolves their
final-pool echoes.

None of these six are facts I doubt (they're standard, well-known industry facts I can
independently corroborate from general domain knowledge), but the pools assert a specific
document/organization citation and point to a log entry that isn't there — a paper-trail gap,
not necessarily a correctness gap. **Recommend:** either add the four missing rows to `T01.md`
(quick, since these are uncontroversial), or soften the citation text to drop the false "see
T01.md" pointer.

### Not flagged (spot-checked, judged acceptable)

- `T01-L08-Q6` (IBT / Insulated Bonding Transformer function) — uncited, no log row, but
  describes a real, standard OSP grounding practice at a general-mechanism level (no specific
  number/section asserted) — same tier as the PE-licensing precedent, not held to the same bar
  as #1/#2 above.
- The various uncited L04-L06 role/process/definition questions — general professional
  knowledge, consistent with C1's own stated exemption tier.

## UNVERIFIED-EXACT hedge check — PASS

Everywhere C1's research log flags a fact as UNVERIFIED-EXACT (NESC specific rule/table numbers
in `T01-L02-Q2`/`Q3`, the 47 CFR 1.1411 subsection lettering in `T01-L05-Q5` and
`T01-final-Q11`, the CE categorical-exclusion code dropped from `T01-L08-Q2`), the corresponding
pool question correctly avoids asserting the unverified specific as settled fact — either
omitting it or explicitly hedging in the explanation text. No question in any of the 10 pools
asserts an UNVERIFIED-EXACT item as fact. This is the main thing Focus Area (2) asked me to
check, and it holds across the full T01 set including the final.

## WebSearch-only citation sourcing (Focus Area 4)

Every citation in the pools ultimately traces to WebSearch-corroborated snippets, not primary-
document fetch (WebFetch to primary hosts returned 403 org-proxy denials for this session too —
same denial C1 logged). This is a session-environment constraint, not a C1 authoring failure —
noted for the record, not a defect. `T01-final.json` adds no new sourcing since it deliberately
reuses only already-verified citations (see above), so this constraint doesn't compound on it.

## Verdict

**FINDINGS — not a clean PASS, not a full BLOCKED.** 94 of 96 questions across the full T01 set
(9 lesson pools + `T01-final`) are sound: correct answer keys, no ambiguity, no banned types,
structurally valid, and either properly cited or acceptably general-knowledge. Two questions
(`T01-L04-Q7`, `T01-L08-Q7` — both in the lesson pools; the final introduced no new instances of
this failure mode) assert specific unverified facts with **zero** citation and **zero**
research-log coverage — a genuine R18-pattern gate miss on those two items specifically. Six
questions total (four lesson-level + two echoed into the final) cite a research-log entry that
isn't actually there (paper-trail gap, not a correctness gap) — fixing the four lesson-level rows
resolves all six.

**Recommendation:** fix the two zero-citation specific-fact questions (source + cite, or hedge
the language) and backfill the four missing log rows before this pool set is flipped visible to
trainees. Everything else — including all of `T01-final.json` — clears the gate as-is.
