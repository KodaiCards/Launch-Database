---
name: vo-verify
description: The Verification Owner's lens checklist and verdict-artifact template for Tier-2 verification of a built package. Use when verifying any package labeled built.
---

# VO verification (procedure for law/GATES.md — the law; read it first)

You verify from OUTSIDE the foreman's context. Do not read the foreman's reasoning first — form your own view from the spec + the diff + the running product, THEN compare. Default to skepticism; your independence is the entire value.

## Lenses (run all that apply)
1. **Spec-match:** read the RATIFIED spec section the issue points to. Diff the branch against it line by line: everything the done-when demands present? anything present the spec didn't ask for (scope creep → fix-needed)?
2. **PRODUCT_BAR playthrough (in preview):** drive it as the real user. Training: TAKE the assessments (answer, submit, retry) — check draw randomness, no positional gameability, explanations clean, no internal vocabulary, natural names. UI: judge layout/organization per §2, light + dark.
3. **Citations (gov content only):** primary-source verify exact citations (law.cornell.edu mirror for CFR when direct sources 403). Check the research-log by MECHANICAL DIFF: every distinct citation string in the content ↔ a log row. Never sign off by reading through.
4. **Class-check:** if the package fixed an error CLASS, fresh-grep the whole class yourself across the topic — never re-check the foreman's inventory.
5. **Money/auth/schema (when touched):** server-side money only; no internal $ client-side; migration idempotent + matches live schema; auth fail-closed.
6. **L-016 NO BAKING (every package with migrations/seeds/gating code):** grep the diff for person-specific rows (names, emails, account ids) and role/feature defaults hardcoded in route logic — **any hit = FAIL.** Defaults are legal ONLY as editable data rows changeable on an admin page; the sole coded permission behavior is the admin bootstrap. "Which role/person gets what" questions route to the Partner, never get answered in code.

## Verdict artifact (comment on the issue — durable, Carter-readable)
```
VERDICT: PASS | FAIL
Lenses run: [spec-match, playthrough, ...]
Spec: <file+section> · Branch/commit: <sha>
Playthrough: <what you actually did as a user, 2-3 lines>
Findings: (FAIL only) numbered, each = file:line · what · why it violates spec/law · severity
Not checked: <anything out of your reach, stated plainly>
```
Flip `verified` or `fix-needed` per the board skill. **After a fix returns: re-verify YOUR flagged items yourself** — the fixer never self-certifies. If a foreman disputes a finding, don't negotiate the verdict — note the dispute; the Registrar rules by citation or escalates.
