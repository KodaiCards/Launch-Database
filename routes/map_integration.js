// routes/map_integration.js — POC bridge between the fiber-route map and the keystone.
//
// Three pieces (see docs/map_requirements.md):
//   1. DB-backed map storage  — the map's injectable window.storage (key→value),
//      so plans persist server-side instead of localStorage.
//   2. Construction contracts + cost catalog — the per-CC unit price list Carter
//      uploads from Excel ("Handhole = $200"); item_key matches the map's ptype.
//   3. Estimate — counts a stored plan's structures by ptype, prices them against
//      a CC catalog → construction expected (13 handholes → $2,600). The chain.
//
// Mount (CEO, server.js):
//   require('./routes/map_integration')(app, pool, { requireManagerOrAdmin, upload });

const XLSX = require('xlsx');
const fs = require('fs');
const { computeEstimate } = require('./_map_estimate');

const CENT = (n) => Math.round(Number(n || 0) * 100) / 100;
const norm = (s) => String(s == null ? '' : s).trim().toLowerCase().replace(/[\s_-]+/g, '');

module.exports = function installMapIntegrationRoutes(app, pool, mw) {
  const gate = (mw && mw.requireManagerOrAdmin) || ((req, res, next) => next());
  const upload = mw && mw.upload;
  const { requirePermission } = require('./_permissions');
  const viewProjects = requirePermission(pool, 'projects.view_all');
  const manageProjects = requirePermission(pool, 'projects.manage');

  // ── 1. DB-backed window.storage (key → value) ──────────────────────────────
  // The map calls store.get(k) expecting {value} and store.set(k, v) with a string.
  app.get('/api/map/store/:key', viewProjects, async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT value FROM map_store WHERE store_key = $1', [req.params.key]);
      res.json(rows.length ? { value: rows[0].value } : null);
    } catch (e) { console.error('[map:store-get]', e && e.message); res.status(500).json({ error: 'store get failed' }); }
  });
  app.put('/api/map/store/:key', manageProjects, async (req, res) => {
    const value = req.body && typeof req.body.value === 'string' ? req.body.value
      : (req.body != null ? JSON.stringify(req.body.value ?? req.body) : null);
    try {
      await pool.query(
        `INSERT INTO map_store (store_key, value, updated_at) VALUES ($1,$2,now())
         ON CONFLICT (store_key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [req.params.key, value]);
      res.json({ ok: true });
    } catch (e) { console.error('[map:store-put]', e && e.message); res.status(500).json({ error: 'store set failed' }); }
  });

  // ── 2. Construction contracts + cost catalog ───────────────────────────────
  app.get('/api/construction-contracts', viewProjects, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT cc.*, c.name AS client_name FROM construction_contracts cc
         LEFT JOIN clients c ON c.id = cc.client_id ORDER BY cc.created_at DESC`);
      res.json(rows);
    } catch (e) { console.error('[cc:list]', e && e.message); res.status(500).json({ error: 'Failed to load construction contracts.' }); }
  });

  app.post('/api/construction-contracts', manageProjects, async (req, res) => {
    const b = req.body || {};
    if (!b.name || !String(b.name).trim()) return res.status(400).json({ error: 'name required' });
    try {
      const { rows } = await pool.query(
        `INSERT INTO construction_contracts (client_id, name, notes, total_budget, total_miles)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [b.client_id || null, String(b.name).trim(), b.notes || null, b.total_budget ?? null, b.total_miles ?? null]);
      res.status(201).json(rows[0]);
    } catch (e) { console.error('[cc:create]', e && e.message); res.status(500).json({ error: 'Failed to create construction contract.' }); }
  });

  app.get('/api/construction-contracts/:id/catalog', viewProjects, async (req, res) => {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM cost_catalog WHERE construction_contract_id = $1 ORDER BY item_key', [req.params.id]);
      res.json(rows);
    } catch (e) { console.error('[cc:catalog-get]', e && e.message); res.status(500).json({ error: 'Failed to load catalog.' }); }
  });

  // Upload the unit price list: multipart Excel/CSV (file) OR JSON { items:[{item_key,label,unit,unit_price}] }.
  // Replaces the CC's catalog. Excel columns matched loosely: item/unit/price.
  app.post('/api/construction-contracts/:id/catalog', manageProjects, ...(upload ? [upload.single('file')] : []), async (req, res) => {
    let items = [];
    try {
      if (req.file) {
        const wb = XLSX.readFile(req.file.path);
        const rows2d = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: '', raw: false, blankrows: false });
        await fs.promises.unlink(req.file.path).catch(() => null);
        const hdr = (rows2d[0] || []).map(norm);
        const col = (names) => { for (const n of names) { const i = hdr.indexOf(n); if (i >= 0) return i; } return -1; };
        const ki = col(['itemkey', 'item', 'unit', 'unittype', 'type', 'structure']);
        const li = col(['label', 'description', 'desc', 'name']);
        const ui = col(['uom', 'units', 'measure']);
        const pi = col(['unitprice', 'price', 'cost', 'rate', 'amount']);
        for (let r = 1; r < rows2d.length; r++) {
          const row = rows2d[r] || []; const key = ki >= 0 ? row[ki] : row[0];
          if (!String(key || '').trim()) continue;
          items.push({ item_key: norm(key), label: li >= 0 ? row[li] : String(key).trim(),
            unit: ui >= 0 ? row[ui] : null, unit_price: parseFloat(String(pi >= 0 ? row[pi] : 0).replace(/[$,]/g, '')) || 0 });
        }
      } else if (req.body && Array.isArray(req.body.items)) {
        items = req.body.items.map((it) => ({ item_key: norm(it.item_key), label: it.label || it.item_key,
          unit: it.unit || null, unit_price: parseFloat(it.unit_price) || 0 }));
      } else {
        return res.status(400).json({ error: 'Provide an Excel/CSV file or JSON { items: [...] }.' });
      }
      if (!items.length) return res.status(400).json({ error: 'No catalog rows parsed.' });

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query('DELETE FROM cost_catalog WHERE construction_contract_id = $1', [req.params.id]);
        for (const it of items) {
          await client.query(
            `INSERT INTO cost_catalog (construction_contract_id, item_key, label, unit, unit_price)
             VALUES ($1,$2,$3,$4,$5)
             ON CONFLICT (construction_contract_id, item_key)
             DO UPDATE SET label = EXCLUDED.label, unit = EXCLUDED.unit, unit_price = EXCLUDED.unit_price`,
            [req.params.id, it.item_key, it.label, it.unit, it.unit_price]);
        }
        await client.query('COMMIT');
      } catch (e) { await client.query('ROLLBACK').catch(() => {}); throw e; } finally { client.release(); }
      res.json({ ok: true, count: items.length });
    } catch (e) { console.error('[cc:catalog-upload]', e && e.message); res.status(500).json({ error: 'Failed to load catalog.' }); }
  });

  // ── SA boundary + center (hand-drawn on the map; powers the overview) ───────
  app.put('/api/service-areas/:id/boundary', manageProjects, async (req, res) => {
    const b = req.body || {};
    const bj = b.boundary != null ? JSON.stringify(b.boundary) : null;
    try {
      const { rows } = await pool.query(
        `UPDATE service_areas
            SET boundary = $2::jsonb,
                center_lat = COALESCE($3, center_lat),
                center_lng = COALESCE($4, center_lng)
          WHERE id = $1
        RETURNING id, boundary, center_lat, center_lng`,
        [req.params.id, bj, b.center_lat ?? null, b.center_lng ?? null]);
      if (!rows[0]) return res.status(404).json({ error: 'Service area not found' });
      res.json(rows[0]);
    } catch (e) { console.error('[map:boundary]', e && e.message); res.status(500).json({ error: 'Failed to save boundary.' }); }
  });

  // ── 3. Estimate — price a stored plan's structures via a CC catalog ─────────
  // GET /api/map/estimate?plan=<planId>&cc=<ccId>
  // Reads the map's stored points (frm_pts_<plan>) + spans (frm_segs_<plan>),
  // counts structures by ptype, prices via the CC catalog, sums span footage.
  app.get('/api/map/estimate', viewProjects, async (req, res) => {
    const plan = req.query.plan, ccId = req.query.cc;
    if (!plan || !ccId) return res.status(400).json({ error: 'plan and cc required' });
    try {
      res.json(await computeEstimate(pool, plan, ccId));
    } catch (e) { console.error('[map:estimate]', e && e.message); res.status(500).json({ error: 'Failed to estimate.' }); }
  });

  // ── Per-SA rollup — the loop: derive an SA's construction numbers from its
  // linked map plan + construction contract. Drives projections/budgets.
  app.get('/api/service-areas/:id/map-rollup', viewProjects, async (req, res) => {
    try {
      const { rows } = await pool.query(
        'SELECT id, name, map_plan_id, construction_contract_id FROM service_areas WHERE id = $1', [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: 'Service area not found' });
      const sa = rows[0];
      if (!sa.map_plan_id) {
        return res.json({ service_area_id: sa.id, name: sa.name, linked: false,
          reason: 'No map plan linked to this service area.' });
      }
      const est = await computeEstimate(pool, sa.map_plan_id, sa.construction_contract_id);
      res.json({ service_area_id: sa.id, name: sa.name, linked: true,
        construction_contract_id: sa.construction_contract_id || null, ...est });
    } catch (e) { console.error('[map:sa-rollup]', e && e.message); res.status(500).json({ error: 'Failed to roll up map data.' }); }
  });
};
