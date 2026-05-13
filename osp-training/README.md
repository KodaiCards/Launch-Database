# OSP / ISP Master Training

Interactive training platform targeting BICSI RCDD, BICSI OSP, and FOA CFOS/S
preparation. Built as a React SPA, deployable to Railway.

## Status

This is the **v0.1 scaffold + Module 1** build. Modules 2–12 are stubbed in
the sidebar and intentionally not populated yet — see
[`docs/field-vs-textbook-research.md`](./docs/field-vs-textbook-research.md)
for why.

| Module | State |
|---|---|
| 01 — Fiber Physics | ✅ Built, with scenario quiz |
| 02 — OSP Design | ⏳ Planned (needs NESC edition decision) |
| 03 — Permitting & Planning | ⏳ Planned |
| 04 — Splicing Specialist | ⏳ Planned |
| 05 — Networking Blueprints & ISP | ⏳ Planned |
| 06 — RCDD Prep Core | ⏳ Planned |
| 07 — Fiber Topology & Matrix | ⏳ Planned (Nodes & Connections engine) |
| 08 — Testing (OLTS / OTDR) | ⏳ Planned |
| 09 — OSP Construction | ⏳ Planned |
| 10 — Data Center Standards | ⏳ Planned |
| 11 — Revenue & Estimation | ⏳ Planned |
| 12 — Final Certification Sim | ⏳ Planned |

## Architecture

```
/
├── index.html
├── package.json
├── railway.json              # Railway build + start config
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── docs/
│   └── field-vs-textbook-research.md   # editorial rulebook
└── src/
    ├── main.jsx
    ├── App.jsx              # 12-module sidebar shell
    ├── index.css            # Tailwind + custom badge/panel classes
    ├── components/
    │   └── InteractiveQuiz.jsx          # MC + drag-drop in one component
    └── modules/
        └── Module01_FiberPhysics.jsx    # full module + quiz bank
```

### State management

For v0.1: local component state only (`useState`). No global store yet.

When the Nodes & Connections topology engine (Module 7) lands, a single
Zustand or Redux Toolkit store is appropriate — but it isn't needed yet
and shouldn't be added speculatively.

### Component breakdown (current)

- `App` — sidebar nav + active module renderer.
- `InteractiveQuiz` — accepts an array of question objects of two types:
  - `mc` (multiple choice, single correct answer)
  - `dragdrop` (HTML5 drag/drop, fiber → port mapping)
  Tracks per-question state, score, and reveal-on-answer flow. No
  external DnD library; HTML5 native DnD only.
- `Module01_FiberPhysics` — long-form sections + embedded `InteractiveQuiz`.
  Helper components `Section` and `Callout` (book / field / verify) are
  defined in-file.

### Component breakdown (planned)

- `TopologyCanvas` — Nodes & Connections engine (D3 + canvas). Module 7.
- `Flashcard` + `useSpacedRepetition` — SM-2 style scheduling. Cross-module.
- `OTDRTraceViewer` — interactive trace canvas. Module 8.
- `LinkBudgetCalculator` — already partially demonstrated in Module 1's
  worked example; will become an actual interactive calculator.
- `PoleLoadingCalc` — Module 2.
- `PermitFormSim` — Module 3, with regional permit templates.

## Editorial principle

This platform is built on the principle that **textbook answers and field
practice often diverge**, and that hiding the divergence misleads the
student. Every numeric claim in module content is tagged:

- **Book** — citable to a published standard (TIA / NESC / ITU-T / BICSI).
- **Field** — common practice / rule of thumb. Approximate.
- **Verify** — value the author is not confident enough in to print as
  fact. Confirm against the standard or AHJ before relying on it.

See `docs/field-vs-textbook-research.md` for the full editorial ruleset.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview  # serves the production build locally
```

## Railway deploy

1. Push this repo to a GitHub remote and create a Railway project from it.
2. Railway detects `railway.json` and `package.json`. The Nixpacks builder
   will run `npm ci && npm run build` and start the app with
   `npm run start`, which serves the built `dist/` over Vite preview on
   `0.0.0.0:$PORT`.
3. No environment variables are required for v0.1. (Add a `PORT` only if
   you want to override Railway's default.)

## What this build is not

- It is not a substitute for AHJ-issued permits, stamped engineering
  drawings, or hands-on splicing instruction.
- It is not a guarantee of cert-exam pass; it is a study aid that takes
  the divergence between standards and field practice seriously.
- It does not (yet) contain modules 2–12. The brief asked us not to
  hallucinate standards; populating eleven more modules in one pass would
  have done exactly that. See section 4 of the research doc for the
  ambiguities that need resolving first.
