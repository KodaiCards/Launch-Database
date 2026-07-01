# Assessment pools (server-authoritative)

One JSON file per assessment. The **server** loads these to draw a random subset
per attempt, strip answer keys, and grade server-side (`routes/_assessment_pools.js`).
The SPA never receives answer keys and never scores — it renders the drawn set and
submits answers.

## File format

Filename = `<assessmentId>.json` (e.g. `T01-L01.json`, `T01-final.json`).

```jsonc
{
  "assessmentId": "T01-L01",   // unique; lesson id, or "<course>-final" for a topic final
  "kind": "lesson",             // "lesson" | "topic_final"
  "courseId": "T01",
  "lessonId": "T01-L01",         // omit/null for topic_final
  "drawCount": 4,                // shown per attempt (launch dial: lesson 4, topic_final 15)
  "passThreshold": 70,           // lesson 70, topic_final 80
  "pool": [ /* >= drawCount questions */ ]
}
```

`drawCount` / `passThreshold` are **data, not code** (D013) — deepen pools
(4→6, 15→25) post-launch by editing the file, no rebuild.

## Allowed question types (NO typed/free-text — Carter's ban, enforced at load)

- **`mc`** — `{ id, type:"mc", prompt, choices:[...], answerIndex, explanation?, citation?, fieldNote? }`
- **`drag-match`** — `{ id, type:"drag-match", prompt, items:[{id,label}], targets:[{id,label}], correctMap:{targetId:itemId}, explanation?, citation?, fieldNote? }`

A pool with any other type (or a `fill-in-blank`) **fails to load** on purpose.

## ⛔ THE GATE (non-negotiable — government content)

Every real pool file ships **only** with, alongside it:
- a per-topic **research-log** (citations for every answer), and
- an **INDEPENDENT red-team report** (author ≠ red-teamer).

**Never author questions from memory** (the R18 quarantine). No artifacts = not merged.
Files prefixed `_` (like `_readme.md` and any `_fixture*`) are **mechanism-only**, NOT
content, and are exempt — they must never be published to trainees.
