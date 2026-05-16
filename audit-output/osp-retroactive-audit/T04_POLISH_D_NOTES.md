# T04 Polish-D Notes

Applied 2 surgical LOW fixes from RT-η `55fca1a` + RT-θ `569be78`.

## LOW-A — T04.L04 acronym table FCC 18-111 codification (line 125)

BEFORE:
```
(FCC 18-111); relevant context...
```

AFTER:
```
(FCC Order 18-111, now codified at 47 CFR 1.1411); relevant context...
```

Matches prose phrasing already applied at line 488 in Polish-C.

## LOW-B — T04.L10 capstone vocab_assumed missing OTMR

BEFORE: No OTMR entry in `vocabulary_assumed`.

AFTER: Added `{ term: 'OTMR', source_lesson_id: 'T01.L05' }` immediately before the `pole audit` entry (line 34), matching existing entry format.

## Vite build

`✓ built in 6.09s` — clean, no errors.

=== T04 POLISH-D NOTES END ===
