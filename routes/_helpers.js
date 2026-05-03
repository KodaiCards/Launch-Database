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

// Pure-math: compute expected hours / expected revenue / miles for a
// project from its type, rate, and footage. Permitting uses a randomized
// hours-per-mile factor between 25 and 30 (in 0.25 steps) with a 25-hour
// minimum if under a mile. Caller may pass a previously-saved factor via
// hoursPerMileOverride so re-renders of the same project don't draw a new
// random number every time.
function calcProjectFinancials(type, billingRate, footage, hoursPerMileOverride) {
  const ratePresent = billingRate !== null && billingRate !== undefined && billingRate !== '' && !isNaN(parseFloat(billingRate));
  const PERMITTING_RATE = ratePresent ? parseFloat(billingRate) : null;

  if (type === 'permitting' && footage) {
    const miles = footage / 5280;
    let hoursPerMile, totalHours;
    if (hoursPerMileOverride && hoursPerMileOverride > 0) {
      // Caller supplied a previously-saved random factor — re-use it
      hoursPerMile = +parseFloat(hoursPerMileOverride);
      totalHours = miles * hoursPerMile;
    } else {
      // Random between 25.00 and 30.00 in 0.25 increments → 21 possible values
      const steps = Math.floor(Math.random() * 21);
      hoursPerMile = 25 + steps * 0.25;
      totalHours = miles * hoursPerMile;
    }
    // Minimum 25 hours if project is under a mile
    if (miles < 1) totalHours = Math.max(25, totalHours);
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

module.exports = {
  updateProjectHours,
  saveUndoBucket,
  popUndoBucket,
  collectProjectTree,
  calcProjectFinancials,
  UNDO_TTL_SECONDS,
};
