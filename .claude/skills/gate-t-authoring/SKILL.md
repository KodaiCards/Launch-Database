---
name: gate-t-authoring
description: The mechanical formats for gated training content — research-log rows, citation logging, the mechanical-diff completeness check, pool JSON shape, UNVERIFIED flagging. Use when authoring or red-teaming assessment pools or lesson content.
---

# Gate T authoring mechanics (procedure for law/GATES.md Gate T — the law; read it first)

## Research log (`content/training/_research/<topic>.md`)
One row per DISTINCT citation used anywhere in the topic (pool questions, explanations, prose References):
`| <citation string exactly as used> | <what claim it supports> | <source URL/where verified> | <verified-by: websearch-crosscheck | primary-source> |`
**EVERY citation gets a row — not just uncertain ones.** A citation present in content but absent from the log is a gate failure (proven: misses dropped to zero when log-everything became the rule).

## The mechanical diff (completeness check — never a read-through)
Extract every distinct citation string from the topic's pools + lessons (grep for citation fields + References blocks) → diff against the log's rows → zero orphans both directions. Red-team AND VO both run this independently.

## Unverifiable exacts
Cannot confirm an exact section/form number via multi-source cross-check? Flag it in the log and DO NOT assert the specific in any pool question — teach the principle, put the general reference in the References block. Never guess a number. Never author from memory, period.

## Pool JSON shape (server-authoritative engine)
`{ "drawCount": N, "pool": [ { "id", "type", "prompt", "choices": [...], "answerIndex", "explanation", "citation" } ] }`
- Pool size ≥ drawCount (launch dial: lesson 4-of-8, topic-final 15-of-~22).
- `explanation` is TRAINEE-FACING: plain language, teach-then-apply, plain reference form OK ("per the NESC clearance rules"), NEVER pipeline vocabulary or internal IDs.
- No question requires recalling a code NUMBER (PRODUCT_BAR §1) — test practical use.
- Choices must not be positionally gameable; the engine shuffles, but never encode order-dependence.

## Red-team pass (author ≠ red-teamer, always)
1. Mechanical diff (above). 2. Re-derive any figures/math from scratch — never read-and-trust. 3. PRODUCT_BAR §1 scoring per the readability-pass skill. 4. Fresh-grep any error class you find across the WHOLE topic (never fix-from-inventory). 5. Take every assessment as a trainee.
