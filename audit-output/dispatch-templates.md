# Dispatch Templates — Reusable Scope Blocks

> Agents Read this file from dispatch prompts instead of having boilerplate inlined.
> Orchestrator's prompts reference template names; agent fills in wave-specific values.
>
> **Purpose: Opus cost-cut.** Inlined boilerplate in dispatch prompts costs Opus output tokens.
> Moving boilerplate here costs Sonnet input tokens (cheaper) + saves Opus per dispatch.

---

## Template: RT-α (post-fix pedagogy)

Standing scope (every RT-α uses these unchanged):

1. **Registries first** (agent-protocol §14). Citation-registry hits + DAG validator + cascade-pattern step-1 scan.
2. **Verify each canonical item from prior fix-agent** — sample at least 50% of HIGH/MED, 25% of LOW.
3. **Pedagogy assessment** — does the fix read clearly for the field-crew learner? New content woven in or stacked?
4. **Cumulative regression sample** — 3-5 items from earlier wave still intact?
5. **Under-audited lesson rotation** — 2-3 lessons not heavily covered in prior rounds.
6. **Build verification** — `cd osp-training && npm run build`.
7. **Validator + DAG** — `node osp-training/scripts/validate-lesson-schema.js T<XX>` + `node osp-training/scripts/build-dag-registry.js`.
8. **STRUCTURED NEW FINDINGS table** + GREEN/YELLOW/RED verdict + saturation hint for RT-β.

Registry-first verification per §8: SKIP primary-source lookup for registry hits <90 days old. Cite registry SHA instead.

---

## Template: RT-β (post-fix technical / pair-mate to RT-α)

Standing scope:

1. **Registries first** (agent-protocol §14).
2. **Cascade-defense framing** — different lens than RT-α (technical / numeric / forensic / corroboration-adversarial as specified in dispatch).
3. **Skip RT-α's verifications.** Per §8 RT-β duplicate-verification skip rule. Trust RT-α for items they already primary-source-verified in this wave. Cover NEW items / under-audited surfaces / cascade sweeps.
4. **Math re-derivation** — sample worked examples / quiz numerics with independent derivation.
5. **Cross-T<XX> sample** — 2-3 lessons RT-α did not cover.
6. **Build + validator + DAG**.
7. **STRUCTURED NEW FINDINGS table** + GREEN/YELLOW/RED + SATURATION verdict (polish scope?).

---

## Template: Fix-agent (Fix Wave A — applying canonical)

Standing scope:

1. **Read canonical from prompt.** Apply each item per BEFORE→AFTER spec.
2. **Registry-first** for any citation/value replacement (§8). If registry has the replacement value verified <90 days → use it. Else primary-source verify + add to registry.
3. **Cascade-pattern step-1** — `known-cascade-patterns.md`. Don't replicate known wrong-values.
4. **NEIGHBORHOOD scan after each fix.** Scan ±20 lines OR same vocabulary_assumed/key_terms array for same-pattern bugs. APPLY trivial mechanical fixes within scope (e.g., adding a missing vocab pointer in the same lesson, fixing same-typo elsewhere in same file). REPORT non-trivial same-pattern findings as Polish-Queue items.
5. **Math** — re-derive any numeric replacement in closeout. Show arithmetic step-by-step.
6. **Build + validator + DAG** after all fixes.
7. **CLOSEOUT** per agent-protocol §7: write-path ack first-line + `git log -5` + diff-stat + BEFORE→AFTER per item + neighborhood findings + registry/DAG/build counts.

**Don't dispatch back to orchestrator for surgical 1-line fixes within scope.** Absorb them.

---

## Template: Polish-agent (post-RT consolidated polish)

Standing scope:

1. **Read RT-α + RT-β findings.** Apply ALL convergent items + items either RT flagged individually.
2. **Registry-first** for any citation/value (§8).
3. **NEIGHBORHOOD-AND-FIX policy.** Polish stage owns:
   - All LOW findings from prior RT pair
   - Any pre-existing LOW backlog items in the lessons being touched (Polish Queue residuals for this topic)
   - Same-pattern fixes detected during neighborhood scan
   - Mechanical schema/vocab pointer adds caught during the scan
4. **NO orchestrator round-trip for trivial 1-fix items.** If polish discovers another item in scope, apply it.
5. **OUT-of-scope items only** (different topic, different framework, requires Carter input) go to closeout's "Deferred for cross-topic sweep" section.
6. **Build + validator + DAG.**

---

## Template: Audit (R-1..R-N)

Standing scope:

1. **Registries first** + cascade-patterns step-1 + DAG validator.
2. **Framing as specified in dispatch** (primary-source-skeptical / corroboration-adversarial / forensic / pedagogy / standards-precision / etc.).
3. **Same scope as paired-audit** (NOT split). Different framings, same scope.
4. **Forensic scenario coverage table** (if forensic framing).
5. **STRUCTURED NEW FINDINGS table** + SATURATION hint + R-N reconciliation table.

Registry-first verification: SKIP primary-source for registry hits <90 days. Note in report what you skipped.

---

## Reuse pattern in dispatch prompts

Orchestrator prompts look like:

```
T<XX> POST-FIX RT-α — pedagogy framing. Pair-mate to RT-β (after).

Read agent-protocol.md + dispatch-templates.md#rt-alpha.

Wave context: <fix-wave SHA> applied <N> canonical (<short summary>).
Write-path: audit-output/<wave>/T<XX>_POSTFIX_RT_A_PEDAGOGY.md ONLY.
Token cap: 130K.

Specific to this topic: <2-3 sentences if needed; otherwise the template suffices>.

Result first line: acknowledge constraint. ≤250 words.
```

That's ~150 words instead of 400-700. Same agent behavior because the standing scope is in this file.
