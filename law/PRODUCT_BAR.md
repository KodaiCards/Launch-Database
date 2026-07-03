# PRODUCT BAR — the quality floor for everything user-facing
> ✔ **RATIFIED** — Carter, 2026-07-02 (canon walkthrough sign-off).
> Law. Owned by Carter. Every gate references this file; failing it blocks merge/flip. If a check here is ambiguous for a given piece of work, that's a `*` — ask, don't guess.

## 1. Training content — "User Readability"
**Audience: Inspectors dualing as Engineers-in-training.** They are learning the whole field, Basics → Advanced. Assume zero prior OSP knowledge at T01; assume exactly what earlier lessons taught after that.

**The core (Carter's definition):** *plain language that builds on foundations; technical principles explained plainly.*

Enforceable checks:
1. **Teach-then-apply.** Every code/standard/regulation appears in the pattern: *"This is NESC code XXX — it states XXX — we use this in XXX because it helps us do XXX."* A fact that can't say what it's FOR in the field doesn't belong in body prose.
2. **Plain language, one idea per paragraph.** New terms defined at first use in words a new hire knows. Analogies and field scenarios over abstraction.
3. **Builds on foundations.** Each lesson leans only on what earlier lessons established; if it needs something not yet taught, teach it or move it.
4. **Codes are references, not curriculum.** Exact code/form/CFR citations live in a per-lesson References block. Learning what a body governs: yes. Test questions demanding code-NUMBER recall: never.
5. **Natural names everywhere trainees look.** No T0x/L0x, no internal IDs, no pipeline vocabulary ("research log", "UNVERIFIED-EXACT", "red-team", "not a graded quiz") in any trainee-visible surface — lesson names, headers, answer explanations, buttons.
6. **The playthrough question:** after reading, could a new hire tell you *why this matters on a jobsite*? If it just threw facts, it fails.
7. **Interactions are honest:** no typed-answer questions; options shuffled (nothing gameable by position); per-attempt pool draw.

## 2. Platform UI / interaction
Working ≠ done. The bar is **interaction quality**, judged with a human's attitude, not an agent's render-check:
1. **Layout uses the space.** No thin vertical columns sprawling down a page with acres of empty horizontal room (the Settings page failure). Dense, scannable, grouped.
2. **No dead weight.** Tabs/pages/buttons nobody will use get REMOVED, not left "in case." (Kill list: `*` pending Carter's pass.)
3. **Fewer clicks; auto-populate anything derivable** ("if X then Y" with override); **no confirmation pop-ups** — optimistic + undo bar.
4. **Visible organization.** A user landing on a page should see what it's for and where things are without instruction. Disorganization is a defect even when every button works.
5. **Light + dark, mobile-responsive** on anything the field touches.
6. **Human-lens review is part of done** for UI surfaces: Foreman plays it as a user; significant surfaces get a Carter (or Partner-with-mockups) pass before flip.

## 3. Platform data / money (standing)
- Money math server-side only; client/customer surfaces never show internal cost, margin, or rates.
- Configurable over hard-coded, platform-wide (D013). RUS = a program profile; county = the universal first grouping level.
- Every paid hour lands somewhere explicit (job, area/WO, or overhead) — no orphans, no silent buckets.
