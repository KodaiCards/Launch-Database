// routes/_helpers.js — shared backend utilities used by extracted route
// modules. Pulled out of server.js as part of CLEANUP_PLAN.md Track 1.3 so
// individual route files (contracts.js, projects.js, etc.) don't have to
// duplicate this logic.
//
// Imports the pg pool from db.js directly rather than taking it as an
// argument, so call sites stay clean. Behavior is byte-for-byte identical
// to the original definitions in server.js.

const { pool } = require('../db');

// updateProjectHours — re-aggregate a project's actual_hours from
// time_entries + child projects' actual_hours, then propagate up to the
// parent. Cycle-safe (50-deep guard) so a malformed parent_id chain
// doesn't blow the stack.
async function updateProjectHours(projectId, _visited) {
  const visited = _visited || new Set();
  if (visited.has(projectId)) {
    console.warn(`[updateProjectHours] Cycle detected at project ${projectId} — aborting propagation. Investigate parent_id chain.`);
    return;
  }
  if (visited.size >= 50) {
    console.warn(`[updateProjectHours] Depth limit reached at project ${projectId} — aborting propagation.`);
    return;
  }
  visited.add(projectId);

  await pool.query(`
    UPDATE projects SET actual_hours = (
      SELECT COALESCE(SUM(hours),0) FROM time_entries WHERE project_id=$1
    ) + (
      SELECT COALESCE(SUM(actual_hours),0) FROM projects WHERE parent_id=$1
    ) WHERE id=$1
  `, [projectId]);

  const { rows } = await pool.query('SELECT parent_id FROM projects WHERE id=$1', [projectId]);
  if (rows[0] && rows[0].parent_id) {
    await updateProjectHours(rows[0].parent_id, visited);
  }
}

// ─── Undo infrastructure ──────────────────────────────────────────────────
// Destructive endpoints (bulk hours delete, project tree delete, contract
// cascade) save a snapshot of the removed rows here BEFORE returning. The
// UI shows an undo bar; if the user clicks Undo within the TTL, the bucket
// is replayed via /api/undo/:token to re-insert the rows.
const UNDO_TTL_SECONDS = 60;  // UI shows 15s but server keeps a buffer

async function saveUndoBucket(userId, kind, payload) {
  // Prune expired rows opportunistically. Keeps the table small without a
  // dedicated cron — destructive ops are infrequent enough that the cost
  // of one DELETE alongside the INSERT is negligible.
  try {
    await pool.query(`DELETE FROM undo_buckets WHERE expires_at < NOW()`);
  } catch (e) { /* not fatal — table may not exist on first boot */ }
  const expiresAt = new Date(Date.now() + UNDO_TTL_SECONDS * 1000);
  const { rows } = await pool.query(
    `INSERT INTO undo_buckets (user_id, kind, payload, expires_at)
       VALUES ($1, $2, $3::jsonb, $4) RETURNING id, expires_at`,
    [userId || null, kind, JSON.stringify(payload), expiresAt]
  );
  return { token: rows[0].id, expires_at: rows[0].expires_at };
}

async function popUndoBucket(token) {
  const { rows } = await pool.query(
    `DELETE FROM undo_buckets WHERE id = $1 AND expires_at >= NOW() RETURNING kind, payload`,
    [token]
  );
  return rows[0] || null;
}

// Walk the descendant tree of a project (BFS via parent_id). Returns each
// project row with a __depth field so the undo restorer can re-insert
// parents before children. Used by both the project tree-delete and the
// contract cascade-delete.
async function collectProjectTree(rootId) {
  const all = [];
  const queue = [{ id: rootId, depth: 0 }];
  const seen = new Set();
  while (queue.length) {
    const { id, depth } = queue.shift();
    if (seen.has(id)) continue;
    seen.add(id);
    const { rows } = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (!rows[0]) continue;
    rows[0].__depth = depth;
    all.push(rows[0]);
    const { rows: kids } = await pool.query('SELECT id FROM projects WHERE parent_id = $1', [id]);
    for (const k of kids) queue.push({ id: k.id, depth: depth + 1 });
  }
  return all;
}

// Permitting hours calc — taper rule (added 2026-05-05 per owner spec).
//
// Owner's spec: "I need the ability to slightly scale down the calc as
// the permit gets over 2 miles, the mileage after drops by 2 hours each
// mile."
//
// Implementation: a randomized base hours-per-mile factor (25 → 30 in
// 0.25 steps, 21 possible values) applies to miles 1 and 2 in full.
// Each mile beyond 2 contributes (base − 2 × (mile_index − 2)) hours,
// floored at PERMITTING_FLOOR_HRS_PER_MILE so the calc can't go to zero
// or negative for very long permits.
//
// Examples (base = 27.5, floor = 5):
//   1 mile  → 27.5 hrs
//   2 miles → 55.0 hrs
//   3 miles → 27.5 + 27.5 + 25.5 = 80.5 hrs
//   4 miles → above + 23.5 = 104.0 hrs
//   5 miles → above + 21.5 = 125.5 hrs
//   ...
//   13.25 miles → first 2 at 27.5 + 11 tapered miles → flat at floor for all beyond.
//
// Fractional last mile is pro-rated against the rate that would apply
// to that integer mile slot.
//
// 25-hour absolute minimum still applies when total comes in below 25
// (covers the sub-mile case the owner originally specified).
const PERMITTING_FLOOR_HRS_PER_MILE = 5;
const PERMITTING_TAPER_AFTER_MILES = 2;
const PERMITTING_TAPER_DROP_PER_MILE = 2;
const PERMITTING_MIN_TOTAL_HOURS = 25;

function rateForMileIndex(mileIndex, baseFactor) {
  // mileIndex is 1-based: mile 1 = first mile, mile 2 = second mile, ...
  if (mileIndex <= PERMITTING_TAPER_AFTER_MILES) return baseFactor;
  const tapered = baseFactor - PERMITTING_TAPER_DROP_PER_MILE * (mileIndex - PERMITTING_TAPER_AFTER_MILES);
  return Math.max(PERMITTING_FLOOR_HRS_PER_MILE, tapered);
}

function computeTaperedPermittingHours(miles, baseFactor) {
  if (miles <= 0) return 0;
  let total = 0;
  const wholeMiles = Math.floor(miles);
  for (let m = 1; m <= wholeMiles; m++) {
    total += rateForMileIndex(m, baseFactor);
  }
  const fraction = miles - wholeMiles;
  if (fraction > 0) {
    total += rateForMileIndex(wholeMiles + 1, baseFactor) * fraction;
  }
  return total;
}

// Pure-math: compute expected hours / expected revenue / miles for a
// project from its type, rate, and footage. Permitting uses a randomized
// hours-per-mile factor between 25 and 30 (in 0.25 steps) for the first
// 2 miles, then tapers down by 2 hrs/mile thereafter (floored — see
// computeTaperedPermittingHours above). Caller may pass a previously-
// saved factor via hoursPerMileOverride so re-renders of the same
// project don't draw a new random number every time.
function calcProjectFinancials(type, billingRate, footage, hoursPerMileOverride) {
  const ratePresent = billingRate !== null && billingRate !== undefined && billingRate !== '' && !isNaN(parseFloat(billingRate));
  const PERMITTING_RATE = ratePresent ? parseFloat(billingRate) : null;

  if (type === 'permitting' && footage) {
    const miles = footage / 5280;
    let hoursPerMile;
    if (hoursPerMileOverride && hoursPerMileOverride > 0) {
      // Caller supplied a previously-saved random factor — re-use it
      hoursPerMile = +parseFloat(hoursPerMileOverride);
    } else {
      // Random between 25.00 and 30.00 in 0.25 increments → 21 possible values
      const steps = Math.floor(Math.random() * 21);
      hoursPerMile = 25 + steps * 0.25;
    }
    let totalHours = computeTaperedPermittingHours(miles, hoursPerMile);
    // Floor at 25 hours total — covers sub-mile permits and the small
    // total at very-low-fraction miles.
    if (totalHours < PERMITTING_MIN_TOTAL_HOURS) totalHours = PERMITTING_MIN_TOTAL_HOURS;
    // Snap to 0.25 increments
    totalHours = Math.round(totalHours * 4) / 4;
    return {
      expectedHours: totalHours,
      expectedRevenue: PERMITTING_RATE != null ? +(totalHours * PERMITTING_RATE).toFixed(2) : null,
      miles: +miles.toFixed(4),
      permittingHoursPerMile: hoursPerMile
    };
  }
  return { expectedHours: null, expectedRevenue: null, miles: null, permittingHoursPerMile: null };
}

// Snap an hours value to the nearest 0.25 increment.
//
// Owner rule: hours always live on the 0.25 grid. The snap is the only
// thing that protects the invariant when hours come in via free-text
// inputs, CSV imports, or bulk endpoints where humans might type 8.3
// instead of 8.25. The snap fires SILENTLY and the snapped value is
// what gets returned, so the frontend always receives the canonical
// representation.
//
// Notes:
//  - The snap rounds half-away-from-zero (Math.round semantics on
//    positive values). For 0.125 → 0.25, for 0.124 → 0.0.
//  - Negative inputs are clamped to 0 — hours are never negative.
//  - Non-numeric / null / undefined input returns null so callers can
//    tell snap-to-zero apart from "the field wasn't provided" and
//    handle each appropriately.
//  - The "NO ROUNDING EVER" rule from the owner means no LOSSY
//    rounding (5.3 → 5). This snap aligns to 0.25 which preserves
//    quarter-hour accuracy and is the rule's intent.
function snapHoursToQuarter(input) {
  if (input == null || input === '') return null;
  const n = Number(input);
  if (!Number.isFinite(n)) return null;
  if (n <= 0) return 0;
  return Math.round(n * 4) / 4;
}

module.exports = {
  updateProjectHours,
  saveUndoBucket,
  popUndoBucket,
  collectProjectTree,
  calcProjectFinancials,
  snapHoursToQuarter,
  UNDO_TTL_SECONDS,
};
