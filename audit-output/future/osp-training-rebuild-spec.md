# OSP Design Training — Rebuild Spec

> **Status:** Design captured 2026-05-13. MAJOR multi-month project. MVP-first phasing.
> Replaces the current `osp-design-training` React/Vite SPA + `/training/` tile content.

---

## 1. User's complaint (verbatim 2026-05-13)

> "The osp training guide sucks, it reads as AI generated and isnt detailed enough. It condeses everything down too much. It needs to be at least 80 hours of real learning. There needs to be tests, flashcards, drag and drops etc at every lesson. there should be accurate content and no refrence to myself or admin or AI"

## 2. Standing user decisions (2026-05-13)

| Question | Answer |
|---|---|
| **Content source** | In-house knowledge + SOPs + **BICSI OSP-DRD / RCDD cert prep** + Industry standards (BICSI, ANSI/TIA-758-C, NESC, NEC) |
| **Target audience** | BICSI OSP-DRD cert prep candidates |
| **Platform** | **Moodle** (not React/Vite, not Open edX, not LearnDash) |
| **Integration** | Separate subdomain (`training.launchfiber.com` or similar) + SSO from launch-database |
| **Interactives per lesson** | Multiple choice + Flashcards (spaced repetition) + Drag-and-drop + Scenario / case-study |
| **Scale** | 80+ hours of real content |
| **Tone** | NO references to "Claude," "AI," "the admin," or the orchestrator's process. Reads as an authored OSP course, not as machine output. |
| **Phasing** | **MVP first — Moodle infra + SSO + ONE BICSI topic area (~5 hrs content) end-to-end with all 4 interactive types.** Then expand topic by topic. |

## 3. What we're replacing

**Current state:** `kodaicards/osp-design-training` repo — React/Vite SPA with AI-generated, over-condensed content. Was folded into `launch-database` via OSP-Merge wave (`/training/` tile, served from `public/training/` as pre-built dist).

**Plan:** The React SPA + `public/training/` static dist will be **decommissioned** once the Moodle MVP is ready and the launcher's Training tile is rewired. The old SPA stays accessible until the Moodle pilot is reviewed and approved.

**Phase 8 ("UI-A polish + OSP-Merge smoke test")** in the queue is now superseded for the OSP-Merge portion — the smoke test isn't needed because we're decommissioning, not polishing. The launcher Training tile work stays.

## 4. BICSI OSP-DRD syllabus mapping

The BICSI OSP-DRD (Outside Plant Designer) credential covers these knowledge domains. Course structure mirrors them:

| # | Topic Area | Approx. Hours | Notes |
|---|---|---|---|
| 1 | Outside Plant Industry & Career Overview | 3-4 | Foundational, history, players |
| 2 | Codes & Standards (NESC, NEC, ANSI/TIA-758-C, OSHA, FCC) | 8-10 | Heavy reading; high-impact for compliance |
| 3 | Site Survey & Field Investigation | 4-5 | Hands-on, field-practical |
| 4 | Routing & Topology Design | 6-8 | Big topic — aerial vs. underground, easements |
| 5 | Optical & Copper Cable Selection | 6-8 | Fiber types, copper, hybrid, hardened OSP cable |
| 6 | Hardware & Accessories | 5-6 | Splice closures, terminals, hangers |
| 7 | Pathway & Right-of-Way | 4-5 | Easements, joint use, encroachment |
| 8 | Bonding & Grounding | 4-5 | Safety + reliability critical |
| 9 | Installation Techniques | 6-8 | Aerial, underground, direct-burial, conduit, microduct |
| 10 | Splicing & Termination | 4-6 | Fusion / mechanical splice, connectors |
| 11 | Testing & Acceptance | 5-6 | OTDR, OLTS, power-meter, loss budgets |
| 12 | Documentation & As-Builts | 3-4 | Drawings, GIS, work orders |
| 13 | Project Management & Estimating | 4-5 | Scoping, budgeting, scheduling |
| 14 | Permitting & Stakeholder Coordination | 3-4 | Public works, utility coordination |
| 15 | Safety, OSHA, Confined Space | 3-4 | Field safety nonnegotiable |
| **Total** | | **~80-90 hours** | Aligned to BICSI OSP-DRD blueprint |

**MVP topic recommendation:** Topic 2 (Codes & Standards) or Topic 5 (Cable Selection). Codes & Standards is bigger but proves the platform handles dense reference material + heavy quizzing. Cable Selection is more visual (good for drag-drop / diagram interactives). **Default recommendation: Topic 5 (Cable Selection)** — proves all four interactive types more cleanly.

## 5. Lesson architecture

Each topic area decomposes into:

```
Topic Area (e.g., "Cable Selection")
├── Module 1 (e.g., "Fiber Optic Cable Fundamentals")
│   ├── Lesson 1.1: "Single-mode vs Multi-mode" (~20 min)
│   │   ├── Reading content (markdown / HTML in Moodle pages)
│   │   ├── Embedded diagrams + photos
│   │   ├── Flashcards (8-12 cards per lesson)
│   │   ├── Drag-and-drop (e.g., label parts of fiber cross-section)
│   │   ├── Multiple choice quiz (5-8 questions)
│   │   └── Scenario question (1 per lesson, 5-10 min decision-tree)
│   ├── Lesson 1.2: "Loose-tube vs Tight-buffer Construction" (~25 min)
│   └── ...
├── Module 2 (...)
└── Module N (...)
─────────────────────────────────
Topic Final Exam (cumulative, 25-50 questions, ≥70% to pass)
```

5-hour MVP topic ≈ 10-12 lessons × ~25 min each + 1 final exam.

## 6. Moodle setup

### Infrastructure
- **Self-hosted Moodle 4.x** on Railway (alongside launch-database) or a separate Hetzner/DigitalOcean VPS if Railway plugin costs exceed direct-host.
- **Database:** dedicated Postgres or MySQL for Moodle (not shared with launch-database — Moodle expects its own DB schema).
- **Storage:** Moodle's built-in moodledata directory on a persistent volume; for static media (diagrams, photos) use Moodle's file API.
- **Backups:** standard Moodle backup cron + DB snapshots.

### Plugins needed
- **H5P** (already bundled with Moodle 4.x via mod_h5pactivity) — provides drag-and-drop, flashcards, image-hotspot interactives. Industry standard.
- **Quiz** (core) — multiple choice with question banks + adaptive feedback.
- **Lesson** (core) — branching scenario / case-study with decision paths.
- **Spaced-repetition flashcards** — H5P's "Dialog Cards" + optional `mod_flashcards` community plugin for spaced repetition. Evaluate at build time.
- **OAuth2 / SAML SSO** — `auth_oauth2` core plugin. Required for SSO bridge.

### SSO bridge from launch-database
- Launch-database stays the identity provider (existing `users` table is canonical).
- New endpoint `/api/auth/sso/moodle` on launch-database — accepts a session JWT, returns an OAuth2 access token for Moodle to consume.
- Moodle's `auth_oauth2` plugin configured with launch-database as the OAuth2 provider.
- User flow: launch-database login → click Training tile → 302 to `training.launchfiber.com` → Moodle OAuth2 redirect to launch-database → token exchange → seamless landing in Moodle.
- First-time-login: Moodle creates a local user record (or finds by email) and binds the launch-database user_id as an external field for future logins.

### Subdomain + DNS
- `training.launchfiber.com` (or whatever subdomain naming we land on)
- Wildcard cert on launchfiber.com covering training subdomain
- Reverse proxy or direct serve depending on host

## 7. Authoring workflow

Content authoring is the bottleneck. ~80 hours of cert-prep content = approximately:
- 80 lessons × ~25 min each
- Each lesson: 800-1200 words of authoritative content + 5-10 quiz questions + 8-12 flashcard pairs + 1-2 drag-drops + 1 scenario
- Total authoring artifact count: ~80 articles, ~640 quiz Qs, ~800 flashcards, ~160 drag-drops, ~80 scenarios

**Authoring pipeline:**
1. **Outline phase** — per topic, write a detailed module/lesson outline aligned to BICSI OSP-DRD exam objectives. Approve before content writing.
2. **Content draft phase** — AI-assisted but grounded in:
   - User's in-house SOPs (need to gather these)
   - Cited industry standards (the user named NESC, NEC, ANSI/TIA-758-C — need access copies)
   - BICSI OSP-DRD reference texts
3. **Review phase** — user (or a subject-matter expert) reviews drafts before publication. Mark items as "verified" before they go live.
4. **Interactive build phase** — H5P drag-drops + flashcards + scenario branches authored in Moodle's H5P editor or imported as `.h5p` packages.
5. **Quiz authoring** — multiple choice with answer rationales (good cert prep explains WHY).

**Provenance & accuracy:** every quiz question and flashcard should cite its source (e.g., "ANSI/TIA-758-C §6.2.4" or "BICSI OSP-DRD Manual Ch. 5"). This is both for accuracy and for legal defensibility if a learner contests an answer.

## 8. MVP scope (Phase 1 of the rebuild)

**Goal:** Prove the full stack end-to-end with ONE topic area (~5 hrs content).

**Deliverables:**
1. Moodle instance live at training subdomain
2. SSO bridge from launch-database working — admin user can SSO in, gets enrolled in the MVP course
3. ONE topic area complete: ~12 lessons × ~25 min each (5 hrs)
4. Each lesson has: reading content + flashcards + 1+ drag-drop + 5+ quiz Qs + 1 scenario
5. Final topic exam (25 Qs, ≥70% pass)
6. Launcher Training tile rewired to SSO into Moodle (replaces current `/training/`)
7. Decommission plan for old React SPA documented

**Recommended MVP topic:** Cable Selection (most visual, proves drag-drop the best).

**Effort estimate:** ~3-4 weeks at sustainable pace. Most of this is content authoring, not infra.

## 9. Open questions before kickoff

1. **Hosting** — Moodle on Railway or separate VPS?
2. **In-house SOPs** — does the user have SOPs we can read in, or will content be 100% AI-drafted from public standards? (User's answer of "in-house knowledge / SOPs" implies the former — need to surface the source material.)
3. **Source material access** — do we have copies of NESC, NEC, ANSI/TIA-758-C, BICSI OSP-DRD manuals? (These are paid standards. The user/firm may already own copies.)
4. **Subject-matter review** — who reviews and approves content before publication? User personally? Internal SME? External BICSI-credentialed reviewer?
5. **Subdomain naming** — `training.launchfiber.com`? `learn.launchfiber.com`? Other?
6. **Cert exam alignment** — should the course publish a coverage matrix mapping each lesson to BICSI OSP-DRD exam objectives? (Strong recommendation: yes.)
7. **Learner accounts** — does Moodle auto-provision a learner account on first SSO, or does the admin pre-create accounts? Recommend auto-provision.
8. **Progress visibility** — should launch-database admin see learner progress (% complete, exam scores) inside the admin portal? Or is Moodle-only fine?
9. **Decommission timing** — when to delete `osp-design-training` repo + `public/training/` SPA: after MVP is approved, or after MVP + 1-2 more topics are live?
10. **Repurpose old SPA content** — any portions of the current SPA content that are worth keeping vs. starting from scratch? Probably nothing — user explicitly said it "reads as AI generated."

## 10. Sequencing — full pipeline

This is a multi-month project. Recommended phasing:

| Phase | Scope | Estimated effort |
|---|---|---|
| **Discovery** | Lock answers to 10 open questions. Inventory user's in-house SOPs + standards access. | 1-2 days |
| **Infra wave** | Stand up Moodle, DB, storage, plugins, SSL. Implement OAuth2 SSO bridge from launch-database. | 1 week |
| **MVP content wave** | Author ONE topic area (~5 hrs of lessons + interactives + exam). Multi-step audit/verify/fix per content draft. | 2-3 weeks |
| **Launcher integration** | Rewire Training tile to SSO into Moodle. Decommission `public/training/` and the React SPA. | 2-3 days |
| **Pilot review** | User tests the full MVP flow as a learner. Iterate on UX + content quality. | 1 week |
| **Topic expansion (x14)** | Repeat content authoring wave per remaining BICSI topic. Sustainable cadence: ~1 topic per week. | 14+ weeks |
| **Cert-exam alignment polish** | Final cumulative exam, certificate-of-completion, BICSI exam-objective coverage matrix. | 1 week |
| **Maintenance** | Ongoing: updates as BICSI syllabus / industry standards change. | Continuous |

**Total to full 80-hr course:** 4-5 months of sustained work.

## 11. Quality gates (every content wave)

- No first-person ("I", "we"), no admin/AI/Claude references, no marketing copy.
- Every factual claim cites its source standard or SOP.
- Every quiz answer (including wrong ones) has a rationale.
- Every drag-and-drop has at least 2 alternate orderings tested for correctness.
- Every scenario has at least 3 decision paths that lead somewhere meaningful (not just "wrong, try again").
- Spaced-repetition flashcards have a clear front (term) + back (definition + citation).
- All images / diagrams have alt text and are color-blind-safe.
- All content goes through user / SME review before publication.

=== OSP TRAINING REBUILD SPEC END ===
