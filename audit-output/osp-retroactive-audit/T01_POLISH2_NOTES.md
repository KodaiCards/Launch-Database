# T01 Polish-2 Notes
SHA: 5275b4d0a4d6df8794e99518b68648995e7af16d

## Fixes applied

### U-1: L08 acronym count (learning_objectives)
BEFORE: "Recall and define 31 OSP acronyms..."
AFTER: "Recall and define 32 OSP acronyms..."
Rationale: vocab_introduced has 32 entries (SMF through MUTCD). Polish-1 added OS2 (NEW-S1) making it 32.

### U-2: L05 learning_objective wording
BEFORE: "identify the 15-business-day response timeline under 47 CFR 1.1411(h)(2)(ii)"
AFTER: "identify the 15-business-day completion deadline for simple make-ready under 47 CFR 1.1411(h)(2)(ii)"
Rationale: Lesson body (Stage 4 make-ready paragraph) correctly describes it as "completion deadline not a start window." Objective now matches.

### U-3 + V-1: CFOS/O naming (3 locations in L08)
Primary source: thefoa.org/adv-cert.htm confirms "CFOS/O - Certified Fiber Optic Specialist, Outside Plant"

Location 1 — vocab_introduced array:
BEFORE: 'CFOS'
AFTER: 'CFOS/O'

Location 2 — FOA body table (Standards bodies section):
BEFORE: "CFOS (Certified Fiber Optic Specialist)"
AFTER: "CFOS/O (Certified Fiber Optic Specialist / Outside Plant)"

Location 3 — T01-L08-FC-foa flashcard back:
BEFORE: "and CFOS (Certified Fiber Optic Specialist) certifications"
AFTER: "and CFOS/O (Certified Fiber Optic Specialist / Outside Plant) certifications, among other CFOS specialties"

Note: flashcard T01-L08-FC-cfos already had front: 'CFOS/O' and cert table row already said CFOS/O — those were pre-correct.

### V-2: OS2 "tightest ITU-T single-mode spec" inaccuracy (2 locations in L08)
Primary source: ITU-T G.657.A2 has tighter macrobend specs (7.5 mm bend radius) than G.652.D; OS2/G.652.D is the standard OSP trunk/feeder spec, not the strictest macrobend spec overall.

Location 1 — OS2 body table prose:
BEFORE: "G.652.D SMF — the tightest ITU-T single-mode spec, standard for modern OSP and backbone deployments"
AFTER: "G.652.D SMF — the standard low-water-peak single-mode fiber for long-distance OSP and backbone deployments. Note: G.657.A2 bend-insensitive fiber has tighter macrobend specs than G.652.D and is used for tight-bend drop applications — OS2 is the standard for mainstream OSP trunk and feeder runs."

Location 2 — T01-L08-FC-os2 flashcard back:
BEFORE: "G.652.D SMF, the tightest ITU-T single-mode spec, standard for modern OSP and backbone deployments."
AFTER: "G.652.D SMF, the standard low-water-peak single-mode fiber for long-distance OSP and backbone deployments. (G.657.A2 has tighter macrobend specs but is used for drop applications, not mainstream trunk runs.)"

## Vite build: PASS (✓ built in 5.87s, 131 modules)

## Neighborhood scan findings (NOT fixed — scoped out)
- L08 BICSI row (line 210): "CFOS and CFOT are FOA credentials, not BICSI" — "CFOS" here is generic family-name reference, not the specific CFOS/O; acceptable as-is since context is "FOA vs BICSI" distinction not cert naming.
- L08 MMF row and flashcard: correctly references OM3/OM4/OM5 but does not mention OM1/OM2 — tracked as Polish Queue P6 (T02 retroactive audit handles OM1/OM2 context).

=== T01 POLISH2 NOTES END ===
