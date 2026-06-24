# Training Module Review — Rubric & Output Schema (v1)

> Owner: review lead (oversight + schema). All review agents MUST follow this exact
> output schema so findings consolidate cleanly. Do not invent your own format.

## What we are evaluating

The OSP/ISP training platform (`osp-training/`) — 254 lessons across 24 topics.
Two goals, in priority order:

1. **Accuracy first.** Every technical claim, number, standard citation, regulatory
   clock, and procedure must be correct and current. This is real revenue + government
   (RUS) engineering training. A wrong NESC clearance or OSHA reg is a defect, not a typo.
2. **Engagement + learning science second.** Make it less boring and structured the way
   people actually learn (see `00-PEDAGOGY-FRAMEWORK.md`). Never trade accuracy for flair.

## Three scoring axes (score every lesson 1–5)

### Axis A — Technical Accuracy
- 5 = every checkable claim verified correct & current; standards cited with edition.
- 4 = correct, but ≥1 citation missing edition/year or slightly stale phrasing.
- 3 = mostly correct; ≥1 claim unverifiable or imprecise (rounding, vague range).
- 2 = ≥1 claim that is wrong or misleading as written.
- 1 = multiple wrong claims, or a safety/compliance error that could cause field harm.

### Axis B — Pedagogy (does it teach the way people learn?)
Score against the framework. Key checks: concrete-before-abstract, retrieval practice
present, worked examples with shown steps, cognitive-load managed (chunked, signaled,
no wall-of-text), feedback is explanatory, prerequisites honored (no forward refs).
- 5 = strong on most principles; 3 = some present, gaps; 1 = passive wall of text.

### Axis C — Engagement ("less boring")
Hook/relevance up front, stakes made concrete (money/safety/exam), curiosity gaps,
active over passive, varied interaction, narrative/scenario where it fits.
- 5 = genuinely engaging; 3 = competent but dry; 1 = a slog.

## Severity tags for findings (use these exact tags)

- `❌ WRONG` — factually incorrect; will mislead. Must fix. Give the correct value + source.
- `⚠️ RISKY` — imprecise/stale/ambiguous or citation without edition; verify & tighten.
- `🟡 PEDAGOGY` — accurate but taught poorly (load, order, no retrieval, etc.).
- `🥱 BORING` — accurate but a slog; propose a concrete engagement fix.
- `✅ GOOD` — exemplar worth preserving / cloning the pattern elsewhere.

## Accuracy research rules (cheap but correct)

- You do NOT need to web-verify everything. Spend research budget on **high-risk, checkable
  hard facts**: numeric values, standard numbers/editions, regulatory clocks & deadlines,
  OSHA reg cites, clearance/separation distances, fiber spec values, FOA/BICSI exam facts.
- Prefer primary/authoritative sources: ITU-T, IEEE/NESC, OSHA (osha.gov), TIA, USDA RUS
  bulletins (7 CFR / 1751F), FCC, USACE, FOA (thefoa.org), BICSI. Note the source inline.
- If a claim can be derived (e.g. critical angle from indices), re-derive it; don't web-search.
- If you cannot verify within a reasonable budget, tag `⚠️ RISKY — unverified` and move on.
  Do not stall. Do not hallucinate a citation to look thorough.
- Watch specifically for: stale standard editions, made-up precision, off-by-one clocks
  (e.g. FCC make-ready timelines), conflated OSHA sections, wrong color codes, wrong
  burial depths/clearances, NEPA/§106 process errors, RUS form numbers.

## Output file (one per cluster)

Write to `training-review/findings/<CLUSTER>.md` using EXACTLY this structure:

```
# Findings — <CLUSTER NAME> (topics: T0X, T0Y, ...)

## Summary
- Lessons reviewed: N
- Overall: Accuracy avg X.X / Pedagogy avg X.X / Engagement avg X.X
- Headline: 2–4 sentences. Biggest accuracy risks + biggest engagement wins available.

## Accuracy findings (the important table)
| Lesson | Tag | Claim as written | Problem | Correct value / fix | Source |
|--------|-----|------------------|---------|---------------------|--------|
| T0X.L0Y | ❌ WRONG | "..." | ... | ... | OSHA 1926.xxx |

(Only rows for ❌/⚠️. Don't list every correct fact. Be specific — quote the claim.)

## Per-topic scorecard
| Topic | Lessons | Accuracy | Pedagogy | Engagement | One-line verdict |
|-------|---------|----------|----------|------------|------------------|

## Pedagogy & engagement notes (per topic, terse)
For each topic: 2–5 bullets. Tag each 🟡/🥱/✅. Give a CONCRETE fix, not "add more engagement".
Good: "T05.L06 dumps 4 loading-district tables back to back — split into a SliderExploration
where the learner picks district + span and sees the load; that's retrieval + dual coding."

## Top 10 fixes for this cluster (prioritized)
1. [severity] Lesson — what to change — why it matters.
```

Keep prose tight. Tables over paragraphs. Accuracy rows are the deliverable that matters most.
