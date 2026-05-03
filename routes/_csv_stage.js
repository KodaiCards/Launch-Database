// routes/_csv_stage.js — shared in-memory store for the CSV import flow.
//
// The /api/hours/csv-validate endpoint parses a file and stages every
// valid row in this Map under a temp `stage_id`. /api/hours/csv-edit-row
// mutates a row in place; /api/hours/csv-commit walks the row set and
// inserts. The AI tools module also reaches into the same Map for the
// csv_smart_import shortcut, which is why this lives in its own
// module — both feature modules can require() it without one having
// to import the other.
//
// In-memory only. Multi-instance deployments would lose state on a
// process restart between validate and commit; for now this matches
// the uploadStore + _pendingApprovals patterns elsewhere in the
// codebase.

const csvStage = new Map();   // stageId → { validRows, expiresAt }
const CSV_STAGE_TTL_MS = 30 * 60 * 1000;

// Sweep expired entries every 5 minutes. setInterval keeps the process
// alive in tests; .unref() lets node shut down cleanly when nothing
// else is pending.
const _sweep = setInterval(() => {
  const now = Date.now();
  for (const [k, v] of csvStage) if (v.expiresAt < now) csvStage.delete(k);
}, 5 * 60 * 1000);
if (typeof _sweep.unref === 'function') _sweep.unref();

module.exports = { csvStage, CSV_STAGE_TTL_MS };
