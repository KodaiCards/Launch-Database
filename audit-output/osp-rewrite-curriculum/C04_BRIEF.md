# C04 — Practice Exam Bank (Consolidated Cert Pool)

## Current State
- **Module 12** (`Module12_CertificationSim.jsx`) wraps `CertificationSim` component
- **Question bank:** `src/data/cert-sim-bank.js` — 68 platform-original questions (cs-001 to cs-068)
- **Domain weights:** RCDD v15 blueprint weights (10/63/11/16) CONFIRMED as identical to v14 per Red Team 2026-05-08
- **Sim config:** 50-item/75-min half-length default (actual RCDD = 100/150)
- **Backend:** `POST /api/training/cert-attempt` at `routes/training.js:143-197` records cert mock attempts to `training_cert_attempts` table

## Five Design Questions

### Q1: Component reuse or rebuild?
**Recommendation: KEEP Module12 as-is, REFACTOR INTO per-cert lesson files under new schema.**

The CertificationSim component is functional; migrate it. BUT don't keep Module12 as a monolithic "grab-bag" lesson. Instead:
- C04.L01 = RCDD Prep (exam structure + study strategy + ethics) [salvage sections 12.1-12.3 from Module12]
- C04.L02 = RCDD Practice Exam (full 100-item mock with timed simulation)
- C04.L03 = OSP Designer Practice Exam (100 items, 120 min)
- C04.L04 = CFOS/S Written Practice Exam (targeted pool, FOA-spec)

Each lesson's exam component accepts parameterized question count + time budget + domain filter.

### Q2: Shared pool vs. per-cert segregation?
**Recommendation: SEGREGATED pools per cert.**

Reason: RCDD questions heavily weight Design (63%), making a merged pool biased. OSP Designer + CFOS/S have different domain breakdowns + reference materials. Segregated pools allow:
- Cert-specific domain weighting
- Cert-specific performance analytics (`cert_track` = RCDD|OSP|CFOS)
- Cleaner blueprint alignment per cert

Current 68-question bank = ~40 RCDD-scoped, ~18 OSP-scoped, ~10 CFOS-scoped (rough audit estimate). Expand each silo independently.

### Q3: Hookup to `training_cert_attempts`?
**Answer: YES.** Each exam submit → `POST /api/training/cert-attempt` already wired. Schema captures:
- `user_id, cert_track, attempt_date, score, passed (bool), time_taken_seconds, domain_scores (jsonb)`

Query string parameter `?cert_track=RCDD|OSP|CFOS` routes to the correct exam variant + populates `domain_scores` with per-domain % breakdown on closeout.

### Q4: Single C04 mock exam or three separate cert-track lessons?
**Recommendation: THREE lessons under C04 (not one catch-all).**

Per ARCH.md, C04 is a CERT-PREP topic with 3 lessons:
- C04.L01 = overview + ethics + resource links (unified)
- C04.L02 = RCDD Designer mock (100-item timed)
- C04.L03 = FOA CFOS/S written mock (closed-book simulation)

(OSP Designer gets its own dedicated cert-track lesson in the OSP-Cert section; RCDD mock moves to ISP course per Carter's 2026-05-16 lock — NOT in OSP.)

### Q5: Question authoring conventions?
**Locked shape (per ARCH.md + current cert-sim-bank.js):**
```javascript
{
  id:           'c04-rcdd-NNN' | 'c04-osp-NNN' | 'c04-cfos-NNN',
  cert_track:   'RCDD' | 'OSP' | 'CFOS',
  domain:       'Define Scope' | 'Design' | 'Bid/Tender' | 'Installation' (RCDD); vary per OSP/CFOS,
  stem:         'Scenario or knowledge question text',
  choices:      ['option A', 'option B', 'option C', 'option D'],
  answerIndex:  0 | 1 | 2 | 3,
  explanation:  'Rationale + source (public-only, cite section/page)',
  blueprint_pct: 0.05  // alignment to cert blueprint (5% weight assigned)
}
```

All questions = platform-original. No dump-site content. Ethics disclaimer front-loaded in C04.L01.

## Action Items
1. **Brief approved** → dispatch C04 author wave (L01 + L02 + L03, 10-15 lessons total)
2. **Question pool expansion** → 200+ RCDD-scoped before RCDD cert-track launches (retroactive authoring per §4)
3. **Schema update:** `training_cert_attempts.domain_scores` → ensure it captures per-domain % on every submit

---

**C04 BRIEF END**
