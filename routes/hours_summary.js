// routes/hours_summary.js — Per-person Hours view + CSV export (Phase 5 follow-ups).
// Mount: require('./routes/hours_summary')(app, pool, { requireManagerOrAdmin })
//
// Hours-only reporting over the service-area model. NEVER exposes dollars —
// this is a labor view for managers/admin, distinct from billing.
//
//   GET /api/hours/summary?from=&to=      → JSON rows, one per (staff, job)
//   GET /api/hours/summary.csv?from=&to=  → same rows, streamed as CSV
//
// Source: time_entries ⋈ service_area_jobs ⋈ service_areas ⋈ clients ⋈ staff,
// grouped per staff member + service-area job line item. Date range filters on
// entry_date (inclusive); both bounds optional.

// Build the WHERE clause + params for an optional [from, to] entry_date range.
function dateFilter(from, to) {
  const where = ['te.service_area_job_id IS NOT NULL'];
  const params = [];
  if (from) { params.push(from); where.push(`te.entry_date >= $${params.length}`); }
  if (to)   { params.push(to);   where.push(`te.entry_date <= $${params.length}`); }
  return { whereSql: 'WHERE ' + where.join(' AND '), params };
}

// Shared query: hours grouped per staff member + job line item. No dollars.
async function querySummary(pool, from, to) {
  const { whereSql, params } = dateFilter(from, to);
  const { rows } = await pool.query(
    `SELECT
       COALESCE(s.id::text, '')   AS staff_id,
       COALESCE(s.name, '— Unattributed —') AS staff_name,
       saj.id                     AS job_id,
       j.name                     AS job_name,
       saj.team                   AS team,
       sa.name                    AS service_area_name,
       c.name                     AS client_name,
       SUM(te.hours)::float       AS total_hours,
       COUNT(*)::int              AS entry_count
     FROM time_entries te
     JOIN service_area_jobs saj ON saj.id = te.service_area_job_id
     JOIN service_areas     sa  ON sa.id  = saj.service_area_id
     LEFT JOIN clients      c   ON c.id   = sa.client_id
     LEFT JOIN jobs         j   ON j.id   = saj.job_id
     LEFT JOIN staff        s   ON s.id   = te.staff_id
     ${whereSql}
     GROUP BY s.id, s.name, saj.id, j.name, saj.team, sa.name, c.name
     ORDER BY staff_name, client_name, service_area_name, j.name`,
    params
  );
  return rows;
}

// Escape one CSV field per RFC 4180; also neutralize spreadsheet formula
// injection (leading = + - @) since this export is opened in Excel.
function csvCell(v) {
  let s = v === null || v === undefined ? '' : String(v);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  if (/[",\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
  return s;
}

module.exports = function installHoursSummaryRoutes(app, pool, mw) {
  const requireManagerOrAdmin =
    (mw && mw.requireManagerOrAdmin) || ((_req, _res, next) => next());
  const { requirePermission } = require('./_permissions');
  const viewAllHours = requirePermission(pool, 'hours.view_all');

  app.get('/api/hours/summary', viewAllHours, async (req, res) => {
    try {
      const rows = await querySummary(pool, req.query.from || null, req.query.to || null);
      const totalHours = rows.reduce((sum, r) => sum + (r.total_hours || 0), 0);
      res.json({ rows, total_hours: totalHours, from: req.query.from || null, to: req.query.to || null });
    } catch (e) {
      console.error('[hours-summary]', e && e.message);
      res.status(500).json({ error: 'Failed to load hours summary.' });
    }
  });

  app.get('/api/hours/summary.csv', viewAllHours, async (req, res) => {
    try {
      const from  = req.query.from || null;
      const to    = req.query.to   || null;
      const group = req.query.group || null; // 'client' | 'area' | null (default: per-person)
      const rows  = await querySummary(pool, from, to);
      const stamp = new Date().toISOString().slice(0, 10);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');

      let lines, filename;
      if (group === 'client') {
        // Aggregate by client
        const map = new Map();
        for (const r of rows) {
          const k = r.client_name || '— No client —';
          const cur = map.get(k) || { client: k, entries: 0, hours: 0 };
          cur.entries += r.entry_count; cur.hours += r.total_hours || 0;
          map.set(k, cur);
        }
        const agg = [...map.values()].sort((a, b) => b.hours - a.hours);
        lines = [['Client', 'Entries', 'Hours'].map(csvCell).join(',')];
        for (const r of agg) lines.push([r.client, r.entries, r.hours.toFixed(2)].map(csvCell).join(','));
        filename = `hours-by-client-${stamp}.csv`;
      } else if (group === 'area') {
        // Aggregate by client + service area
        const map = new Map();
        for (const r of rows) {
          const k = (r.client_name || '') + '|' + (r.service_area_name || '');
          const cur = map.get(k) || { client: r.client_name || '', area: r.service_area_name || '', entries: 0, hours: 0 };
          cur.entries += r.entry_count; cur.hours += r.total_hours || 0;
          map.set(k, cur);
        }
        const agg = [...map.values()].sort((a, b) => b.hours - a.hours);
        lines = [['Client', 'Service Area', 'Entries', 'Hours'].map(csvCell).join(',')];
        for (const r of agg) lines.push([r.client, r.area, r.entries, r.hours.toFixed(2)].map(csvCell).join(','));
        filename = `hours-by-area-${stamp}.csv`;
      } else {
        // Default: per-person + job (original behavior)
        lines = [['Staff', 'Client', 'Service Area', 'Team', 'Job', 'Entries', 'Hours'].map(csvCell).join(',')];
        for (const r of rows) {
          lines.push([
            r.staff_name, r.client_name || '', r.service_area_name || '',
            r.team || '', r.job_name || '', r.entry_count,
            (r.total_hours || 0).toFixed(2),
          ].map(csvCell).join(','));
        }
        filename = `hours-summary-${stamp}.csv`;
      }

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(lines.join('\r\n') + '\r\n');
    } catch (e) {
      console.error('[hours-summary:csv]', e && e.message);
      res.status(500).json({ error: 'Failed to export hours CSV.' });
    }
  });
};

module.exports._helpers = { dateFilter, csvCell };
