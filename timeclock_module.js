// ─────────────────────────────────────────────────────────────────────────────
// TIME CLOCK MODULE
//
// Implements the Launch Time Clock portal: a punch-clock + timer hybrid where
// users clock in against a specific project + job, can switch projects mid-shift,
// and clock out to produce a time_entries row that flows into the existing
// Hours tab and manager team-scoping unchanged.
//
// Key concepts:
//   - SESSION: an active period between clock-in and clock-out. One DB row in
//     time_clock_sessions. Multiple sessions per day are normal (one per
//     project the user worked on).
//   - On clock-out, we INSERT a corresponding row into time_entries so the
//     hours immediately appear in admin/manager/portal Hours tabs and any
//     downstream revenue calcs.
//   - SWITCH project = clock-out current session + clock-in new session in
//     a single transaction.
//   - AUDIT: every mutation to time_entries (whether from time clock, manual
//     entry in admin, CSV import, etc) writes a row to time_entry_audit.
//     Admin viewer shows all changes with actor, before/after, and a flag
//     marking "meaningful" changes (hours/project/job changed) vs trivial
//     changes (notes, etc).
//
// LINKING: A user must have users.staff_id set before they can use the time
// clock. Admin sets this in the user management modal. Without it, clock-in
// returns 400 with a clear message ("ask your admin to link you to a staff
// record"). This is by design — the user explicitly asked for manual linking
// rather than auto-linking by name.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Business timezone ─────────────────────────────────────────────────────
// Day boundaries (entry_date), week boundaries (Mon–Sun grid), and the
// "did this shift cross midnight" check all need to happen in the BUSINESS's
// local time, not UTC. Railway containers run in UTC, so a shift started at
// 6 PM Central was being attributed to the NEXT day's payroll because
// new Date(...).toISOString() converts to UTC first.
//
// Override with BUSINESS_TZ env var (IANA name like 'America/New_York') if
// the business operates in a different zone.
const BUSINESS_TZ = process.env.BUSINESS_TZ || 'America/Chicago';

// Convert a Date (or ISO string) into the business-local 'YYYY-MM-DD' for use
// as time_entries.entry_date. Uses Intl rather than manual offset math so DST
// transitions are handled automatically.
function dateInBusinessTz(d) {
  const date = d instanceof Date ? d : new Date(d);
  // 'en-CA' formats as YYYY-MM-DD by default — the format we want.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(date);
}

// Add N days to a 'YYYY-MM-DD' string without ever crossing the
// JS-Date / timezone boundary. Used for building the Mon–Sun week grid keys
// so the keys exactly match time_entries.entry_date (which is already a
// 'YYYY-MM-DD' string thanks to db.js's pg type parser).
function addDaysToDateString(dateStr, n) {
  // Parse YYYY-MM-DD as a UTC date so adding days is pure arithmetic with no
  // DST ambiguity, then re-stringify the UTC value. Both source and result
  // are pure date strings, so the UTC roundtrip is safe — DST only matters
  // when there's a time-of-day component.
  const [y, m, d] = dateStr.split('-').map(Number);
  const t = Date.UTC(y, m - 1, d) + n * 24 * 3600 * 1000;
  const dt = new Date(t);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA BOOTSTRAP — runs every startup, idempotent
// ═══════════════════════════════════════════════════════════════════════════

async function bootstrapTimeClockSchema(pool) {
  const ddl = [
    // 1. Link users → staff. Admin sets this manually. Without a linked
    //    staff record, time clock features are blocked for that user.
    //    SET NULL on staff delete so user accounts survive staff cleanup.
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS staff_id UUID REFERENCES staff(id) ON DELETE SET NULL`,

    // 2. Active + historical clock sessions. ended_at IS NULL means the
    //    user is currently clocked in on this row.
    `CREATE TABLE IF NOT EXISTS time_clock_sessions (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
       staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
       project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
       job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
       job_title TEXT,
       started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       ended_at TIMESTAMPTZ,
       notes TEXT,
       created_time_entry_id UUID REFERENCES time_entries(id) ON DELETE SET NULL,
       created_at TIMESTAMPTZ DEFAULT NOW()
     )`,

    // Partial unique index — at most ONE active (un-ended) session per user.
    // This prevents weird states where a user accidentally has two timers
    // running. The clock-in handler also enforces this in code, but the
    // index is the safety net.
    `CREATE UNIQUE INDEX IF NOT EXISTS uniq_active_session_per_user
       ON time_clock_sessions (user_id) WHERE ended_at IS NULL`,

    `CREATE INDEX IF NOT EXISTS idx_sessions_user_started
       ON time_clock_sessions (user_id, started_at DESC)`,

    // 3. Audit log for time_entries. Every INSERT/UPDATE/DELETE writes one row.
    //    before_data and after_data capture the FULL row state in JSON for
    //    forensics. change_summary is a one-line human description for the UI.
    //    meaningful=TRUE for hours/project/job changes (the ones you'd want
    //    to highlight); FALSE for trivial edits like notes.
    `CREATE TABLE IF NOT EXISTS time_entry_audit (
       id BIGSERIAL PRIMARY KEY,
       time_entry_id UUID,
       actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
       actor_username TEXT,
       action VARCHAR(20) NOT NULL,
       change_summary TEXT,
       before_data JSONB,
       after_data JSONB,
       meaningful BOOLEAN DEFAULT FALSE,
       source VARCHAR(20),          -- 'timeclock' | 'admin' | 'portal' | 'csv' | 'api'
       at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       user_agent TEXT,
       ip TEXT
     )`,

    `CREATE INDEX IF NOT EXISTS idx_audit_entry ON time_entry_audit (time_entry_id, at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_audit_actor ON time_entry_audit (actor_user_id, at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_audit_at ON time_entry_audit (at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_audit_meaningful ON time_entry_audit (meaningful, at DESC) WHERE meaningful = TRUE`,
    // forgot_clock_out — TRUE when the session ran longer than the soft cap
    // (see CLOCK_OUT_REVIEW_THRESHOLD_HOURS below). The session is closed
    // and the time entry is created either way, but the flag drives an
    // admin "needs review" badge so misclicks/forgotten clock-outs aren't
    // silently truncated to 24 hours like the previous version did.
    `ALTER TABLE time_clock_sessions ADD COLUMN IF NOT EXISTS forgot_clock_out BOOLEAN DEFAULT FALSE`,
  ];

  for (const stmt of ddl) {
    try { await pool.query(stmt); }
    catch (e) { console.error('[timeclock] schema:', e.message, '\n  stmt:', stmt.split('\n')[0]); }
  }
  console.log('  ✓ Time Clock schema bootstrapped');
}

// ═══════════════════════════════════════════════════════════════════════════
// AUDIT LOGGER
//
// Called by time_entries POST/PUT/DELETE handlers in server.js. Captures the
// before/after state, generates a human-readable summary, and flags whether
// the change is "meaningful" (hours / project / job changed) vs trivial
// (notes / typos).
//
// Usage from server.js:
//   const auditLogger = require('./timeclock_module').makeAuditLogger(pool);
//   await auditLogger({
//     req,                        // for actor + IP + user-agent
//     timeEntryId: r.rows[0].id,
//     action: 'created',
//     before: null,
//     after: r.rows[0],
//     source: 'admin',
//   });
// ═══════════════════════════════════════════════════════════════════════════

function makeAuditLogger(pool) {
  return async function logChange({ req, timeEntryId, action, before, after, source }) {
    try {
      const actor = req?.user || {};
      // Determine if change is meaningful — hours/project/job_id moves matter
      // for payroll + billing; notes / job_title typos don't.
      let meaningful = false;
      let summary = '';
      if (action === 'created') {
        meaningful = true;
        const hrs = parseFloat(after?.hours) || 0;
        summary = `Created entry: ${hrs.toFixed(2)} hrs on ${after?.entry_date || '?'}`;
      } else if (action === 'deleted') {
        meaningful = true;
        const hrs = parseFloat(before?.hours) || 0;
        summary = `Deleted entry: ${hrs.toFixed(2)} hrs on ${before?.entry_date || '?'}`;
      } else if (action === 'updated' && before && after) {
        const changes = [];
        const hrsBefore = parseFloat(before.hours) || 0;
        const hrsAfter = parseFloat(after.hours) || 0;
        if (Math.abs(hrsBefore - hrsAfter) > 0.001) {
          changes.push(`Hours: ${hrsBefore.toFixed(2)} → ${hrsAfter.toFixed(2)}`);
          meaningful = true;
        }
        if (String(before.project_id || '') !== String(after.project_id || '')) {
          changes.push(`Project changed`);
          meaningful = true;
        }
        if (String(before.job_id || '') !== String(after.job_id || '')) {
          changes.push(`Job changed`);
          meaningful = true;
        }
        if (String(before.entry_date || '') !== String(after.entry_date || '')) {
          changes.push(`Date: ${before.entry_date} → ${after.entry_date}`);
          meaningful = true;
        }
        if (String(before.staff_id || '') !== String(after.staff_id || '')) {
          changes.push(`Staff changed`);
          // not "meaningful" by itself unless it changes who's getting paid
        }
        if ((before.notes || '') !== (after.notes || '')) {
          changes.push(`Notes edited`);
        }
        if ((before.job_title || '') !== (after.job_title || '')) {
          changes.push(`Job title: "${before.job_title || ''}" → "${after.job_title || ''}"`);
        }
        summary = changes.length ? changes.join('; ') : 'No-op save';
      }

      await pool.query(`
        INSERT INTO time_entry_audit (
          time_entry_id, actor_user_id, actor_username, action,
          change_summary, before_data, after_data, meaningful,
          source, user_agent, ip
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      `, [
        timeEntryId,
        actor.id || null,
        actor.username || actor.full_name || null,
        action,
        summary,
        before ? JSON.stringify(before) : null,
        after ? JSON.stringify(after) : null,
        meaningful,
        source || 'api',
        req?.get?.('user-agent')?.slice(0, 500) || null,
        // Trust the proxy header in production (Railway sets x-forwarded-for)
        req?.ip || req?.headers?.['x-forwarded-for']?.split(',')[0] || null,
      ]);
    } catch (e) {
      // Audit failure should NEVER break the underlying mutation. Log and
      // move on — losing one audit row beats losing the user's hours.
      console.error('[timeclock] audit log failed:', e.message);
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════════

// Soft cap: a session longer than this gets `forgot_clock_out=true` and
// admin attention, but the actual hours are still recorded. The previous
// 24-hour HARD cap silently destroyed wages — a 26-hour session became 24.
// We never lose hours; we flag them for review.
const CLOCK_OUT_REVIEW_THRESHOLD_HOURS = 12;
// Absolute cap — anything above this is almost certainly clock skew or a
// bug, not a real shift. Refuse to insert; admin must edit manually.
const CLOCK_OUT_HARD_LIMIT_HOURS = 36;

function installTimeClockRoutes(app, pool, requireAuth) {
  const audit = makeAuditLogger(pool);

  // Helper: resolve current user's staff_id. Returns { ok: true, staffId }
  // OR { ok: false, error } — the latter when the user has no linked staff
  // record. All clock-in/clock-out operations must call this first.
  async function getLinkedStaff(req) {
    if (!req.user?.id) return { ok: false, error: 'Not authenticated' };
    try {
      const { rows } = await pool.query(
        `SELECT u.staff_id, s.name as staff_name
         FROM users u LEFT JOIN staff s ON s.id = u.staff_id
         WHERE u.id = $1`, [req.user.id]
      );
      if (!rows[0]) return { ok: false, error: 'User not found' };
      if (!rows[0].staff_id) {
        return {
          ok: false,
          error: 'Your account is not linked to a staff record. Ask an administrator to link you in user management.'
        };
      }
      return { ok: true, staffId: rows[0].staff_id, staffName: rows[0].staff_name };
    } catch (e) { return { ok: false, error: e.message }; }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET /api/timeclock/active
  // Returns the user's current open session (or null if not clocked in).
  // Used by the portal on page load + every poll tick to render Clock In
  // vs Clock Out + Switch + elapsed timer.
  // ─────────────────────────────────────────────────────────────────────────
  // GET /api/timeclock/recent — top-N projects this user has clocked into
  // recently. Powers the "quick clock-in" buttons on the timeclock home
  // (one tap to resume yesterday's project). Defaults to last 14 days,
  // top 3 unique projects ordered by most-recent activity.
  app.get('/api/timeclock/recent', requireAuth(), async (req, res) => {
    const days = Math.max(1, Math.min(90, parseInt(req.query.days || '14', 10) || 14));
    const limit = Math.max(1, Math.min(10, parseInt(req.query.limit || '3', 10) || 3));
    try {
      const { rows } = await pool.query(`
        SELECT DISTINCT ON (s.project_id)
          s.project_id,
          s.job_id,
          s.job_title,
          MAX(s.started_at) OVER (PARTITION BY s.project_id) AS last_started,
          p.name AS project_name,
          p.work_order_number,
          j.name AS job_name,
          cl.name AS client_name
        FROM time_clock_sessions s
        LEFT JOIN projects p ON p.id = s.project_id
        LEFT JOIN jobs j ON j.id = s.job_id
        LEFT JOIN clients cl ON cl.id = p.client_id
        WHERE s.user_id = $1
          AND s.started_at > NOW() - ($2 || ' days')::interval
          AND p.id IS NOT NULL
        ORDER BY s.project_id, s.started_at DESC
        LIMIT $3
      `, [req.user.id, String(days), limit]);
      // The DISTINCT ON above doesn't sort across projects — re-sort by
      // last_started so the most recent comes first in the UI.
      rows.sort((a, b) => new Date(b.last_started) - new Date(a.last_started));
      res.json(rows);
    } catch (e) {
      console.error('[timeclock:recent]', e && e.message);
      res.status(500).json({ error: 'Failed to load recent projects.' });
    }
  });

  app.get('/api/timeclock/active', requireAuth(), async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT s.*,
               p.name as project_name, p.work_order_number,
               j.name as job_name,
               cl.name as client_name
        FROM time_clock_sessions s
        LEFT JOIN projects p ON p.id = s.project_id
        LEFT JOIN jobs j ON j.id = s.job_id
        LEFT JOIN clients cl ON cl.id = p.client_id
        WHERE s.user_id = $1 AND s.ended_at IS NULL
        ORDER BY s.started_at DESC LIMIT 1
      `, [req.user.id]);
      res.json(rows[0] || null);
    } catch (e) {
      console.error('[timeclock:active]', e && e.message);
      res.status(500).json({ error: 'Failed to load active session.' });
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // POST /api/timeclock/clock-in
  // Body: { project_id, job_id?, job_title?, notes? }
  // Creates a new session row. Refuses if user already has an active session
  // (the unique index would catch it too — this gives a friendlier error).
  // ─────────────────────────────────────────────────────────────────────────
  app.post('/api/timeclock/clock-in', requireAuth(), async (req, res) => {
    const { project_id, job_id, job_title, notes } = req.body || {};
    if (!project_id) return res.status(400).json({ error: 'project_id required' });

    const link = await getLinkedStaff(req);
    if (!link.ok) return res.status(400).json({ error: link.error });

    try {
      // Block if already clocked in
      const { rows: existing } = await pool.query(
        `SELECT id FROM time_clock_sessions WHERE user_id = $1 AND ended_at IS NULL LIMIT 1`,
        [req.user.id]
      );
      if (existing[0]) {
        return res.status(409).json({
          error: 'You are already clocked in. Use Switch Project or Clock Out first.',
          active_session_id: existing[0].id,
        });
      }

      // Resolve job_title — if job_id provided, look up the name; otherwise
      // accept the free-text job_title. Either is fine; both populate the
      // resulting time_entries.job_title for downstream display.
      let resolvedTitle = job_title || null;
      if (job_id && !resolvedTitle) {
        const { rows: j } = await pool.query(`SELECT name FROM jobs WHERE id = $1`, [job_id]);
        resolvedTitle = j[0]?.name || null;
      }

      const { rows } = await pool.query(`
        INSERT INTO time_clock_sessions (user_id, staff_id, project_id, job_id, job_title, notes)
        VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
      `, [req.user.id, link.staffId, project_id, job_id || null, resolvedTitle, notes || null]);

      res.json(rows[0]);
    } catch (e) {
      // Could be the unique-index violation if a race condition slipped past
      if (e.code === '23505') {
        return res.status(409).json({ error: 'You are already clocked in (race condition detected).' });
      }
      console.error('[timeclock:clock-in]', e && e.stack || e);
      res.status(500).json({ error: 'Clock-in failed. Try again.' });
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // POST /api/timeclock/clock-out
  // Body: { notes? }
  // Closes the user's active session and creates a corresponding
  // time_entries row so the hours flow into the existing Hours pipeline.
  //
  // Rounding policy: hours computed as decimal hours (ms / 3600000), kept
  // to 2 decimals. We don't round to nearest 0.25 etc — admin can enforce
  // company policy if needed via a settings flag in a later round.
  // ─────────────────────────────────────────────────────────────────────────
  app.post('/api/timeclock/clock-out', requireAuth(), async (req, res) => {
    const { notes } = req.body || {};
    const link = await getLinkedStaff(req);
    if (!link.ok) return res.status(400).json({ error: link.error });

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Find active session
      const { rows: sessions } = await client.query(
        `SELECT * FROM time_clock_sessions
         WHERE user_id = $1 AND ended_at IS NULL
         ORDER BY started_at DESC LIMIT 1 FOR UPDATE`,
        [req.user.id]
      );
      const session = sessions[0];
      if (!session) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'No active session to clock out from.' });
      }

      const endedAt = new Date();
      const durationMs = endedAt - new Date(session.started_at);
      let rawHours = durationMs / 3600000;
      if (rawHours < 0) rawHours = 0;
      // HARD limit: anything above 36h is almost certainly a clock-skew bug
      // or stuck timer. Refuse and tell the user to clean it up manually so
      // we don't write a clearly-wrong entry that downstream payroll uses.
      if (rawHours > CLOCK_OUT_HARD_LIMIT_HOURS) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: `Session is ${Math.round(rawHours)} hours long (limit ${CLOCK_OUT_HARD_LIMIT_HOURS}). This is almost certainly a forgotten clock-out. Ask an administrator to close this session and create the correct hours manually.`,
          session_id: session.id,
          started_at: session.started_at,
        });
      }
      const needsReview = rawHours > CLOCK_OUT_REVIEW_THRESHOLD_HOURS;
      const hours = Math.round(rawHours * 100) / 100;

      // Combine session notes + clock-out notes
      const finalNotes = [
        session.notes,
        notes,
        needsReview ? `[auto-flag: long shift (${hours.toFixed(2)}h) — likely forgot to clock out]` : null,
      ].filter(Boolean).join(' | ') || null;

      // entry_date uses the START date in the BUSINESS timezone — a session
      // that crosses midnight is attributed to the day it began (matches
      // most payroll conventions). The previous toISOString().slice(0,10)
      // used UTC, which broke for any shift after ~5–7 PM local.
      const entryDate = dateInBusinessTz(session.started_at);
      const { rows: te } = await client.query(`
        INSERT INTO time_entries (project_id, staff_id, entry_date, hours, job_title, notes, user_id)
        VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *
      `, [
        session.project_id, session.staff_id, entryDate, hours,
        session.job_title, finalNotes, req.user.id
      ]);

      // Close the session, recording the review flag for admin triage.
      await client.query(
        `UPDATE time_clock_sessions
         SET ended_at = $1, notes = $2, created_time_entry_id = $3, forgot_clock_out = $4
         WHERE id = $5`,
        [endedAt, finalNotes, te[0].id, needsReview, session.id]
      );

      await client.query('COMMIT');

      // Audit OUTSIDE the transaction — wrapped in its own try/catch in the
      // logger, but extra-belt-and-suspenders here so a logging hiccup never
      // appears as a 500 to the user (the entry IS already committed).
      try {
        await audit({
          req, timeEntryId: te[0].id, action: 'created',
          before: null, after: te[0], source: 'timeclock',
        });
      } catch (auditErr) {
        console.error('[timeclock] post-commit audit failed:', auditErr && auditErr.message);
      }

      res.json({
        session: { ...session, ended_at: endedAt, forgot_clock_out: needsReview },
        time_entry: te[0],
        hours,
        needs_review: needsReview,
      });
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch {}
      console.error('[timeclock:clock-out]', e && e.stack || e);
      res.status(500).json({ error: 'Clock-out failed. Try again or ask an administrator.' });
    } finally {
      client.release();
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // POST /api/timeclock/switch
  // Body: { project_id, job_id?, job_title?, notes? }
  // Clock out current + clock in new, atomically. Used when a worker moves
  // from one project to another mid-shift without going off the clock.
  // ─────────────────────────────────────────────────────────────────────────
  app.post('/api/timeclock/switch', requireAuth(), async (req, res) => {
    const { project_id, job_id, job_title, notes } = req.body || {};
    if (!project_id) return res.status(400).json({ error: 'project_id required for switch' });

    const link = await getLinkedStaff(req);
    if (!link.ok) return res.status(400).json({ error: link.error });

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Close the current session (same logic as clock-out)
      const { rows: sessions } = await client.query(
        `SELECT * FROM time_clock_sessions
         WHERE user_id = $1 AND ended_at IS NULL
         ORDER BY started_at DESC LIMIT 1 FOR UPDATE`,
        [req.user.id]
      );
      const oldSession = sessions[0];
      let createdEntry = null;

      if (oldSession) {
        const endedAt = new Date();
        const durationMs = endedAt - new Date(oldSession.started_at);
        let rawHours = Math.max(0, durationMs / 3600000);
        if (rawHours > CLOCK_OUT_HARD_LIMIT_HOURS) {
          await client.query('ROLLBACK');
          return res.status(400).json({
            error: `Current session is ${Math.round(rawHours)} hours long (limit ${CLOCK_OUT_HARD_LIMIT_HOURS}). Close it manually before switching projects.`,
            session_id: oldSession.id,
          });
        }
        const needsReview = rawHours > CLOCK_OUT_REVIEW_THRESHOLD_HOURS;
        const hours = Math.round(rawHours * 100) / 100;

        if (hours > 0) {
          // Same tz-correct entry_date logic as clock-out.
          const entryDate = dateInBusinessTz(oldSession.started_at);
          const noteAddon = needsReview
            ? `[auto-flag: long shift (${hours.toFixed(2)}h) — likely forgot to clock out]`
            : null;
          const finalNotes = [oldSession.notes, noteAddon].filter(Boolean).join(' | ') || null;
          const { rows: te } = await client.query(`
            INSERT INTO time_entries (project_id, staff_id, entry_date, hours, job_title, notes, user_id)
            VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *
          `, [
            oldSession.project_id, oldSession.staff_id, entryDate, hours,
            oldSession.job_title, finalNotes, req.user.id
          ]);
          createdEntry = te[0];
          await client.query(
            `UPDATE time_clock_sessions SET ended_at = $1, created_time_entry_id = $2, forgot_clock_out = $3 WHERE id = $4`,
            [endedAt, te[0].id, needsReview, oldSession.id]
          );
        } else {
          // Zero-hour session — close without creating an entry
          await client.query(
            `UPDATE time_clock_sessions SET ended_at = $1 WHERE id = $2`,
            [endedAt, oldSession.id]
          );
        }
      }

      // 2. Open the new session
      let resolvedTitle = job_title || null;
      if (job_id && !resolvedTitle) {
        const { rows: j } = await client.query(`SELECT name FROM jobs WHERE id = $1`, [job_id]);
        resolvedTitle = j[0]?.name || null;
      }
      const { rows: newSession } = await client.query(`
        INSERT INTO time_clock_sessions (user_id, staff_id, project_id, job_id, job_title, notes)
        VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
      `, [req.user.id, link.staffId, project_id, job_id || null, resolvedTitle, notes || null]);

      await client.query('COMMIT');

      if (createdEntry) {
        try {
          await audit({
            req, timeEntryId: createdEntry.id, action: 'created',
            before: null, after: createdEntry, source: 'timeclock',
          });
        } catch (auditErr) {
          console.error('[timeclock] post-commit audit failed:', auditErr && auditErr.message);
        }
      }

      res.json({
        closed_session: oldSession,
        created_time_entry: createdEntry,
        new_session: newSession[0],
      });
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch {}
      console.error('[timeclock:switch]', e && e.stack || e);
      res.status(500).json({ error: 'Switch failed. Try again or ask an administrator.' });
    } finally {
      client.release();
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET /api/timeclock/week?week_offset=0
  // Returns time entries for one Mon-Sun week. week_offset 0 = current,
  // -1 = last week, etc. Always scoped to req.user.id (you can only see
  // your own time clock data).
  // ─────────────────────────────────────────────────────────────────────────
  app.get('/api/timeclock/week', requireAuth(), async (req, res) => {
    // Validate week_offset: must be a finite integer in a sane range.
    // Without this, parseInt returned NaN for garbage input which then went
    // to Postgres as the string "NaN" and the interval cast errored out.
    const rawOffset = req.query.week_offset;
    const offset = parseInt(rawOffset == null ? '0' : String(rawOffset), 10);
    if (!Number.isFinite(offset) || offset < -260 || offset > 260) {
      return res.status(400).json({ error: 'week_offset must be an integer between -260 and 260' });
    }
    try {
      // Compute Mon-Sun bounds in the BUSINESS timezone, not the Postgres
      // server's timezone (which on Railway is UTC). Otherwise the week grid
      // is off by one day for any user east of UTC working past midnight, or
      // west of UTC starting before noon.
      const { rows: bounds } = await pool.query(`
        SELECT
          (date_trunc('week', (NOW() AT TIME ZONE $2)::date) + ($1 || ' weeks')::interval)::date AS week_start,
          (date_trunc('week', (NOW() AT TIME ZONE $2)::date) + ($1 || ' weeks')::interval + interval '6 days')::date AS week_end
      `, [String(offset), BUSINESS_TZ]);
      const { week_start, week_end } = bounds[0];

      const { rows: entries } = await pool.query(`
        SELECT te.*,
               p.name as project_name, p.work_order_number,
               s.name as staff_name,
               cl.name as client_name,
               j.name as project_job_name
        FROM time_entries te
        LEFT JOIN projects p ON p.id = te.project_id
        LEFT JOIN staff s ON s.id = te.staff_id
        LEFT JOIN clients cl ON cl.id = p.client_id
        LEFT JOIN jobs j ON j.id = p.job_id
        WHERE te.user_id = $1
          AND te.entry_date BETWEEN $2 AND $3
        ORDER BY te.entry_date ASC, te.created_at ASC
      `, [req.user.id, week_start, week_end]);

      // Aggregate by day. Use STRING addition (addDaysToDateString) instead
      // of JS Date math — the previous code did `new Date(week_start);
      // d.setDate(...); d.toISOString().slice(0,10)`, which round-tripped
      // through UTC and produced keys that didn't match entry_date for
      // half the week in any non-UTC zone.
      const byDay = {};
      for (let i = 0; i < 7; i++) {
        const key = addDaysToDateString(String(week_start), i);
        byDay[key] = { hours: 0, entry_count: 0 };
      }
      let totalHours = 0;
      // Sum unrounded ms-derived hours per day, round ONCE at the end —
      // summing already-rounded entries can lose pennies on big weeks.
      const rawByDay = {};
      for (const e of entries) {
        const key = String(e.entry_date).slice(0, 10);
        const h = parseFloat(e.hours || 0);
        rawByDay[key] = (rawByDay[key] || 0) + h;
        if (byDay[key]) byDay[key].entry_count++;
        totalHours += h;
      }
      for (const key of Object.keys(byDay)) {
        byDay[key].hours = Math.round((rawByDay[key] || 0) * 100) / 100;
      }

      res.json({
        week_offset: offset,
        week_start, week_end,
        business_tz: BUSINESS_TZ,
        entries,
        by_day: byDay,
        total_hours: Math.round(totalHours * 100) / 100,
      });
    } catch (e) {
      console.error('[timeclock:week]', e && e.stack || e);
      res.status(500).json({ error: 'Failed to load week.' });
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET /api/_admin/timeclock-audit
  // Admin-only view of all time_entries audit history. Filterable by user,
  // date range, and meaningful-only flag.
  // ─────────────────────────────────────────────────────────────────────────
  app.get('/api/_admin/timeclock-audit', requireAuth('admin'), async (req, res) => {
    const { user_id, project_id, from, to, meaningful_only, limit } = req.query;
    const where = [];
    const params = [];
    let i = 1;
    if (user_id) { where.push(`tea.actor_user_id = $${i++}`); params.push(user_id); }
    if (project_id) {
      // Filter on either before_data->>'project_id' or after_data
      where.push(`(tea.before_data->>'project_id' = $${i} OR tea.after_data->>'project_id' = $${i})`);
      params.push(project_id);
      i++;
    }
    if (from) { where.push(`tea.at >= $${i++}::timestamptz`); params.push(from); }
    if (to)   { where.push(`tea.at <= $${i++}::timestamptz`); params.push(to); }
    if (String(meaningful_only).toLowerCase() === 'true') {
      where.push(`tea.meaningful = TRUE`);
    }
    const whereStr = where.length ? `WHERE ${where.join(' AND ')}` : '';
    let lim = parseInt(limit || '100', 10);
    if (!Number.isFinite(lim)) lim = 100;
    lim = Math.min(500, Math.max(10, lim));
    params.push(lim);

    try {
      const { rows } = await pool.query(`
        SELECT tea.*,
               u.full_name as actor_full_name,
               p.name as project_name
        FROM time_entry_audit tea
        LEFT JOIN users u ON u.id = tea.actor_user_id
        LEFT JOIN projects p ON p.id = COALESCE((tea.after_data->>'project_id')::uuid,
                                                 (tea.before_data->>'project_id')::uuid)
        ${whereStr}
        ORDER BY tea.at DESC
        LIMIT $${i++}
      `, params);
      res.json(rows);
    } catch (e) {
      console.error('[timeclock:audit-list]', e && e.message);
      res.status(500).json({ error: 'Failed to load audit log.' });
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // GET /api/_admin/timeclock-audit/:entry_id
  // All audit rows for one specific time entry — shows the full history
  // of who touched it and when.
  // ─────────────────────────────────────────────────────────────────────────
  app.get('/api/_admin/timeclock-audit/:entry_id', requireAuth('admin'), async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT tea.*, u.full_name as actor_full_name
        FROM time_entry_audit tea
        LEFT JOIN users u ON u.id = tea.actor_user_id
        WHERE tea.time_entry_id = $1
        ORDER BY tea.at ASC
      `, [req.params.entry_id]);
      res.json(rows);
    } catch (e) {
      console.error('[timeclock:audit-by-entry]', e && e.message);
      res.status(500).json({ error: 'Failed to load audit history.' });
    }
  });
}

module.exports = {
  bootstrapTimeClockSchema,
  installTimeClockRoutes,
  makeAuditLogger,
};
