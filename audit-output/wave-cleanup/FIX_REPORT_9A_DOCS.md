# Phase 9A Docs Cleanup — Fix Report

**Wave:** Phase 9A  
**Branch:** `claude/debug-previous-issues-MoN9D`  
**Commits:** `ab96013` (delete-now) · `3ebeb23` (delete-after-verify, clean)  
**Scope:** Root-level planning docs — deletions only. Zero code changes.

---

## Files Deleted

| File | Class | Commit | Rationale |
|---|---|---|---|
| `ADMIN_FIXES_PLAN.md` | DELETE-NOW | `ab96013` | Content captured in CLAUDE.md §4 lessons. Zero references in code/HTML/SQL. |
| `SPLICE_COMPETITIVE_RESEARCH.md` | DELETE-NOW | `ab96013` | Stub only (product list). `research/00_index.md` referenced in DISCOVERY.md did not exist and was out of scope for this trivial wave. Zero references. |
| `BUILD_PLAN.md` | DELETE-AFTER-VERIFY | `3ebeb23` | grep confirmed zero references in code/HTML/SQL. Only references: docs being deleted + stale CLAUDE.md preservation stanza (superseded by this wave). Content captured in CLAUDE.md §4. |
| `HANDOFF_NEXT_PM.md` | DELETE-AFTER-VERIFY | `3ebeb23` | grep confirmed zero references in code/HTML/SQL. Only references: CLAUDE.md preservation stanza (superseded). Content captured in CLAUDE.md §1/§3. |

---

## Files Kept — References Found

| File | References Found | Decision |
|---|---|---|
| `PROJECT_NORTH_STAR.md` | Inline comments in `routes/projects.js:295`, `routes/ai.js:2170`, `routes/splice.js:11`, `migrations/0010_splice_templates.sql:5` | **KEEP.** Code files reference this doc as design rationale. Scope rule: "if referenced by code, leave it." |
| `PORTAL_LAUNCHER_PLAN.md` | `CLAUDE.md` body text (§2 section "Per PORTAL_LAUNCHER_PLAN.md.") | **KEEP.** Referenced by a kept doc (CLAUDE.md). Scope rule: "if referenced by another doc, leave it." |
| `SPLICE_MATRIX_SUGGESTIONS.md` | `SPLICE_BUILD_PLAN.md` lines 835, 867, 934, 979 (audit-reference citations for shipped work) | **KEEP.** Referenced by `SPLICE_BUILD_PLAN.md` which is explicitly in-scope KEEP. Scope rule: "if referenced by another doc, leave it." |

---

## Files Not Touched (per scope)

| File | Reason |
|---|---|
| `SPLICE_BUILD_PLAN.md` | Explicitly in KEEP list — unscoped Phase 6 content. |
| `CLAUDE.md` | Not in scope. |
| `README.md` | Not in scope. |
| `CLEANUP_CANDIDATES.md` | Not in scope. |
| `audit-output/**` | Not in scope. |

---

## Grep methodology

For each delete-after-verify file, ran:

```
grep -r <filename> . --include="*.md" --include="*.js" --include="*.html" --include="*.json" --include="*.sql" --exclude-dir=".git"
```

Then filtered out self-references and cross-references within files also being deleted. References remaining in kept files (code or docs) triggered the KEEP decision.

---

## Note on CLAUDE.md preservation stanza

`CLAUDE.md` (repo copy) contains a stanza:

> "Don't edit / delete `PROJECT_NORTH_STAR.md`, `BUILD_PLAN.md`, `ADMIN_FIXES_PLAN.md`, `HANDOFF_NEXT_PM.md`, `PORTAL_LAUNCHER_PLAN.md`, `SPLICE_*.md`, `README.md` until the audit pipeline approves cleanup."

The audit pipeline has now approved cleanup (DISCOVERY.md verdict issued). This stanza is stale. The two files deleted in `3ebeb23` (`BUILD_PLAN.md`, `HANDOFF_NEXT_PM.md`) were covered by this stanza but cleared by the grep verification. The repo-level CLAUDE.md is not updated here (out of scope for a code-file-free trivial wave); recommend a follow-up to prune the stale preservation stanza from the repo CLAUDE.md in Phase 9B or standalone.

=== PHASE 9A DOCS REPORT END ===
