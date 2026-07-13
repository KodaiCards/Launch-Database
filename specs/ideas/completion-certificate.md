# OSP course completion certificate

> **Carter, 2026-07-13 (verbatim):** "The training needs a completion certificate. An official looking one with our logo and color scheme that shows completion of the OSP design course."

Status: **SUPERSEDED by specs/certificates.md (RATIFIED 2026-07-13)** — draft approved with edits (no seal, raised footer, Rudy Douglas · Director, logo-blue #4e8ec6); v1 code in the spec. Was: SEED + APPROVED DRAFT PENDING — visual draft delivered same day (artifact `dfc3bb9b`, Partner-designed: ospnavy/ospamber palette, real logo embedded, landscape letter, engraved-serif, spark seal, cert ID + verify line). Carter reviews the draft; his edits land here.

## Implementation shape (when ratified)
- Render: HTML → PDF through the EXISTING Puppeteer pipeline (same as invoices) — the draft is already print-clean (`@page letter landscape`).
- Trigger: auto-issue when the final gated assessment of the OSP course passes (server-side check across all published topics — definition of "complete" must track the rolling topic flips; certificate names the course, not a topic count).
- Fields from trainee record: legal name, completion date, certificate number (`LFS-OSP-<year>-<seq>`, unique, stored).
- Verify endpoint: `launchfiber.app/verify` — public lookup of cert number → name + course + date (the line is on the draft; cheap credibility win).
- Belongs to Track 1 (training) — small package; sequence after wave-2 pressure eases or whenever Carter green-lights the draft.
