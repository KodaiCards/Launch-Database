# Field vs. Textbook Research

> Living document. Every claim either cites a standard or is explicitly tagged
> as field practice / rule of thumb. Items marked **VERIFY** are believed to
> be true but the author has not pinned down the precise authoritative source
> at time of writing — they should be confirmed against the latest published
> standard before being baked into module content.
>
> The point of this document, and of this branch, is that the textbook answer
> and the field answer are often **not the same number**, and a training
> platform that hides that distinction misleads its users.

---

## 1. Why this distinction matters

BICSI RCDD, BICSI OSP, and FOA CFOS exams are written against specific
editions of specific standards (TIA, NESC, ITU-T, ANSI, BICSI Manuals).
A correct exam answer is the answer the standard prescribes.

Real installations are governed by:

- the **AHJ** (Authority Having Jurisdiction) — local utility, municipality,
  state DOT, railroad, or facility owner;
- the **employer's internal practice** — internal loss budgets, safety
  factors, preferred vendors, and rules of thumb that are usually tighter
  than the standard;
- the **as-built reality** — what the fiber count, slack, depth, and
  clearances actually ended up being once the crew left.

Treating the textbook number as universally correct teaches students wrong;
treating the field rule-of-thumb as universally correct fails them on the
exam. Both have to be present, clearly labeled.

The Module 1 callouts in this build use three labels:

- **Book** — citable to a published standard, and the answer the cert exam
  expects.
- **Field** — common practice; varies by region, AHJ, contractor.
- **Verify** — value or rule the author is not confident enough in to state
  as fact; ask the AHJ / cable datasheet / current standard revision.

---

## 2. Examples of the gap

### 2.1 Connector loss

| Source | Per-connector loss | Notes |
|---|---|---|
| TIA-568 (legacy "max") | 0.75 dB | Conservative ceiling; the value most textbooks cite. |
| TIA-568.3-D reference-grade | tighter than 0.75 dB | Newer "reference-grade" category — value depends on connector class; **VERIFY exact figure for cited revision before quoting.** |
| FOA field rule-of-thumb | 0.30 dB (fusion splice-on / adhesive-polish) | Stated in FOA reference materials as a typical real-world value. Not a standard. |
| Designer planning value | 0.50 dB | Common compromise — well below TIA max, well above FOA typical. |

The same fiber link, budgeted three different ways, produces materially
different headroom numbers. A platform that just teaches "0.75 dB per
connector" and stops is teaching the worst-case ceiling, not the working
number.

### 2.2 Fusion splice loss

- Textbook / TIA worst-case planning: **0.10 dB** per fusion splice.
- Field acceptance criteria (commonly): **≤ 0.05 dB**, often with the
  splicer set to re-splice anything reading > 0.10 dB.
- The figure the splicer's screen reports is an *estimate* from a profile
  alignment camera, not a measurement; the real value is what an OTDR
  (preferably bidirectional) shows. **VERIFY** what the contract calls out
  as the acceptance method before quoting a number.

### 2.3 Fiber attenuation per km (G.652.D SMF)

| Wavelength | ITU-T G.652.D max | Vendor "typical" | Designer planning |
|---|---|---|---|
| 1310 nm | ≤ 0.40 dB/km | ≈ 0.32–0.35 dB/km | 0.35 dB/km |
| 1550 nm | ≤ 0.30 dB/km | ≈ 0.18–0.22 dB/km | 0.22–0.25 dB/km |
| 1625 nm | ≤ 0.40 dB/km | ≈ 0.20–0.23 dB/km | 0.25 dB/km |

Source for the ITU-T column: ITU-T Recommendation G.652. The "typical"
column is drawn from major vendor datasheets (Corning SMF-28e+, Prysmian,
OFS) and varies between vendors and product variants; treat it as
representative, not authoritative.

### 2.4 OTDR test wavelengths

- Textbook prescription: certify SMF at **1310 + 1550** for acceptance,
  and use **1625 nm** for in-service fault location (because bend loss
  scales with wavelength).
- Field practice: many crews actually only carry a 1310/1550 OTDR module
  unless the customer explicitly paid for 1625 nm. The "always test at
  three wavelengths" line you see in study guides assumes equipment that
  many small contractors don't own.
- The exam will still want you to know all three wavelengths and *why*
  each one is used. The field gap doesn't change the right exam answer.

### 2.5 NESC clearances and burial depths (Module 2 territory — placeholder)

**VERIFY before populating Module 2.** The author is not going to pretend
to recall specific NESC clearance numbers from memory in this document.
The relevant tables in the *current edition* of the NESC (IEEE C2),
together with the project's actual AHJ overrides, are the only defensible
sources. Module 2 should:

1. Cite the NESC edition by year and section number.
2. Note that the AHJ (utility, DOT, railroad) can — and routinely does —
   require clearances or burial depths *greater* than the NESC minimum.
3. Refuse to print a single number "from memory" without the citation.

This is the same posture this document takes throughout: if a number isn't
sourced, it doesn't go on the page.

### 2.6 AutoCAD / GIS workflow

- Textbook framing (BICSI OSPDRM): describes a generic CAD workflow with
  layers for poles, anchors, ducts, splice cases, etc.
- Field reality:
  - Most ILECs, MSOs, and large contractors actually live in
    AutoCAD + 3GIS / FiberDB / ARAMIS / Bentley OpenComms / VETRO FiberMap
    or equivalent — i.e., **CAD plus a fiber-management system**, not CAD
    alone.
  - Permit submittals are increasingly **PDF + KMZ** rather than DWG; many
    municipalities never open the DWG.
  - Splice diagrams and fiber-management ("nodes and connections") are
    rarely maintained inside AutoCAD itself in 2026 — that's exactly the
    workflow Module 7 is meant to replicate.
- Anything we say about a *specific* vendor's UI in module text should be
  marked **Verify** unless the author can re-check current docs.

---

## 3. Editorial rules for module authors

1. **No bare numbers.** Every dB value, every dimension, every clearance
   in module text must either cite a standard (with edition / revision) or
   be tagged as a field rule-of-thumb / planning value.
2. **State the year.** Standards revise. "TIA-568.3-D" is meaningful;
   "TIA-568" alone is not.
3. **Acknowledge AHJ override.** OSP design especially — burial depth,
   clearances, separation, restoration — is an AHJ-driven discipline.
   Don't write "the burial depth is X feet"; write "the NESC minimum is X,
   the AHJ may require more, confirm before designing."
4. **Cite once, not three times.** If a value comes from G.652.D, say so
   the first time, then use the value. Don't pretend it's universal.
5. **Distinguish exam answer from job answer.** Where the cert-exam answer
   and the working-job answer diverge, show both and tell the student
   which is which.
6. **If you don't know, say so.** Mark **VERIFY** and move on. A "Verify"
   tag in shipped content is acceptable; an invented number is not.

---

## 4. Open questions for the user

These are real ambiguities the author hit while drafting Module 1, and that
will recur across the curriculum. They warrant clarification before
producing modules that depend on them:

1. **Which TIA-568.3 revision are we teaching to?** -D is the one most
   recently widely cited; -E is referenced in industry materials but the
   exact published status / date should be confirmed with the official
   TIA standards portal before module content commits to its values.
2. **Which NESC edition is the target?** NESC publishes on a five-year
   cycle (most recently 2023). The current BICSI OSP exam is keyed to a
   specific edition; we should match it.
3. **Which BICSI OSPDRM and TDMM editions are current for cert prep at
   ship time?** The mission brief cites OSPDRM 6th and TDMM 15th. If a
   newer edition has been issued by the time we publish, modules should
   be re-pegged to it.
4. **Connector loss target for Module 1's worked link budget.** This
   build uses 0.50 dB/connector as a defensible planning value. The user
   may want to override this to 0.30 (FOA / field) or 0.75 (TIA legacy
   max). The choice should be explicit, not silent.
5. **Are we teaching G.652.D as the "default" SMF, or G.657.A2 (bend-
   insensitive)?** The answer affects every macrobend / drop-cable
   discussion. Most modern FTTH and indoor SMF is G.657; long OSP
   backbones are still G.652.D. Worth stating up front.

---

## 5. What this branch produces

- A scaffold the platform can grow into without being rewritten:
  React + Vite + Tailwind, dark theme, sidebar of 12 modules, a single
  reusable `InteractiveQuiz` component supporting both multiple-choice
  and drag-and-drop fiber routing.
- A complete Module 1 (Fiber Physics) written against the editorial
  rules above.
- This research document, which is meant to outlive Module 1 and govern
  every subsequent module.
- A Railway deploy config (`railway.json`) so the build can be hosted
  immediately.

It deliberately does **not** populate modules 2–12 with content. Doing so
without resolving the ambiguities in section 4 would produce a polished
product that quietly contains invented numbers — exactly what the brief
warned against.
