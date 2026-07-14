# SPEC — Billing: rate catalog, RUS codes, submission packaging (PLAN 2.7, System A)

> ✔ **RATIFIED** — Carter, 2026-07-13 (succession-sprint session; all samples delivered — *3 CLOSED). Verbatim: "Heres multiple different types of invoices we send. RUS vs Normal with permitting inspection and Design all covered. I included all the RUS billing codes but they are extremely subjective. The highlighted cells dont mean anything. The vast majority will be un used."
> Samples (Carter's Desktop, `Billing 2026/Billing for June 2026/…` — PII/client files stay OFF the repo; foreman gets structure notes below + scrubbed fixtures): Tri-co ×2 · COX ×1 · Palmetto ×2 (RUS) · `RUS Billing CODES.xlsx` (154 codes).

## The two invoice archetypes (decoded from the samples)
1. **Task-summary invoice (non-RUS — Tri-co & COX share ONE template):** title line (project + permit #, e.g. "Jones County SR 11 Permit #U-169-022983-3") → `Task | Description | <Hours|Footage> | Rate | Subtotal` → descriptive task rows (basemapping, HLD generation, ROW research, field visits, permit paperwork / fiber assignments, Vetro inputs, KMZ…) → ONE totals row (qty × rate: 30h × $90 · 40h × $90 · 7,802 ft × $0.60). The task rows describe the work; the money is a single quantity × rate.
2. **RUS WO-summary invoice (Palmetto):** header block (period + deliverable type + "Contract 3 / 515-3") → item group = **RUS code** (`a-2`, `g-1-J`) under "RUS 217 Engineering Contract GA 1706 -A72" → **per-WO lines** (`WO# 16298 · 3.07 mi · $850/Mile · $2,609.50` / `WO# 16298 · 130.25 h · $90.00 · $11,722.50`) → subtotals per group + summary. **Backup sheets in the same workbook** ("Reconnect 3" detail + "Timecards" — ~2,000 rows of per-day per-person detail).

## Design
- **Client format PROFILES (data, not code — D015):** each client+deliverable gets a profile row (archetype, columns, unit label, title pattern, header block, backup-sheet spec, export file-naming pattern mirroring Carter's folder convention: `<Month Year> Launch <Deliverable> <Program> Summary`). New client = new profile row, never new code. The existing sample-PDF→template engine (I5) extends for PDF; **XLSX export is primary** (the samples ARE xlsx) via the `xlsx` lib already in node_modules.
- **Rate catalog:** extend `pricing_entries` (client × program × code/task → rate + unit). Units seen: $/hour, $/foot, $/mile. **The rate-fallback consolidation rides this package** (the ~6 hardcoded COALESCE fallbacks repoint at the catalog — silent-money-error rescue, I4).
- **RUS code catalog:** import all 154 rows as data (217 code, description, REIMB/FEE, payment type, LEA desc, 506 code + its payment). **Codes are SUBJECTIVE (Carter): the system NEVER auto-assigns** — admin picks the code per invoice item, with a favorites/recently-used shortlist since "the vast majority will be unused." Cell highlighting in the source file is meaningless — ignore formatting, import values only.
- **Assembly (keystone-only — O20 port is the prerequisite, specs/cutover.md step 2):** hours lines pull from CONFIRMED day segments (specs/hours.md — unbilled bucket is excluded by definition); mileage lines from WO/plant-records quantities (map units when the map lands); the Timecards backup sheet auto-generates from the same segments. Multi-code splits never change economics (banked rule).
- **Billing method × timing per job** (banked): each job carries how + when it bills; the "did I bill this" glance (I3) ships in this package — per job/WO/SA: billed / ready-to-bill / unbilled amounts at sight.

## Done-when
- Regenerate June from system data: a Palmetto inspection workbook (summary + backup sheets) and a Tri-co/COX task invoice that match the samples' structure (VO compares field-by-field against the real files on Carter's machine).
- Rates resolve ONLY from the catalog (grep proves the hardcoded fallbacks are gone); unknown rate → red flag, never a silent default.
- RUS code picker: manual, favorites-first, both 217/506 stored; no path auto-codes anything.
- Invoice rows all link keystone (no orphan paths — O16 class dead); "did I bill this" answers per WO in one glance.
- Money lens on EVERY package (hard rule 8); premerge + logged-out checks (no invoice data on any public surface).

## Sequencing
After 2.6 hours (its confirmed segments are the feed). The O20 port (cutover step 2) can start earlier — it is this spec's enabling dependency.
