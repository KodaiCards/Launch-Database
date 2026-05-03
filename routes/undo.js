// routes/undo.js — POST /api/undo/:token replay handler.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.6.
// Smoke-tested via tests/hours_bulk_delete.test.js (time_entries_bulk
// kind) and tests/project_tree_delete.test.js (project_tree kind);
// contract_cascade kind is exercised by the contract-delete cascade flow.
//
// Restorers re-INSERT with the original UUIDs so foreign-key references
// from rows we didn't delete still resolve. Wrapped in a transaction —
// either the whole undo succeeds or none of it lands.

const { popUndoBucket, updateProjectHours } = require('./_helpers');

module.exports = function installUndoRoutes(app, pool, mw) {
  const { requireAuth } = mw;

  app.post('/api/undo/:token', requireAuth, async (req, res) => {
    let bucket;
    try {
      bucket = await popUndoBucket(req.params.token);
    } catch (e) {
      return res.status(500).json({ error: 'Undo lookup failed.' });
    }
    if (!bucket) return res.status(404).json({ error: 'Undo window expired or already used.' });

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      if (bucket.kind === 'time_entries_bulk') {
        const entries = bucket.payload.entries || [];
        for (const e of entries) {
          await client.query(
            `INSERT INTO time_entries (id, project_id, staff_id, entry_date, hours, job_title, notes, import_batch, created_at, user_id)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
               ON CONFLICT (id) DO NOTHING`,
            [e.id, e.project_id, e.staff_id, e.entry_date, e.hours, e.job_title, e.notes, e.import_batch, e.created_at, e.user_id || null]
          );
        }
        // Recompute hours on every project we touched
        const touched = [...new Set(entries.map(e => e.project_id).filter(Boolean))];
        for (const pid of touched) {
          try { await updateProjectHours(pid); } catch (uerr) { /* keep going */ }
        }
        await client.query('COMMIT');
        return res.json({ ok: true, restored: entries.length });
      }

      if (bucket.kind === 'project_tree') {
        const { projects = [], time_entries = [], invoice_items = [], permit_stages = [], permit_documents = [], billing_batch_items = [] } = bucket.payload;
        // Insert projects parents-first (sort by depth ascending). Each
        // project row carries an explicit depth field captured at delete time.
        const ordered = [...projects].sort((a, b) => (a.__depth || 0) - (b.__depth || 0));
        for (const p of ordered) {
          const cols = Object.keys(p).filter(k => !k.startsWith('__'));
          const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
          const vals = cols.map(k => p[k]);
          await client.query(
            `INSERT INTO projects (${cols.join(', ')}) VALUES (${placeholders}) ON CONFLICT (id) DO NOTHING`,
            vals
          );
        }
        for (const r of time_entries) {
          const cols = Object.keys(r);
          await client.query(
            `INSERT INTO time_entries (${cols.join(', ')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(', ')}) ON CONFLICT (id) DO NOTHING`,
            cols.map(k => r[k])
          );
        }
        for (const r of invoice_items) {
          const cols = Object.keys(r);
          await client.query(
            `INSERT INTO invoice_items (${cols.join(', ')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(', ')}) ON CONFLICT (id) DO NOTHING`,
            cols.map(k => r[k])
          );
        }
        for (const r of permit_stages) {
          const cols = Object.keys(r);
          await client.query(
            `INSERT INTO permit_stages (${cols.join(', ')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(', ')}) ON CONFLICT (id) DO NOTHING`,
            cols.map(k => r[k])
          );
        }
        for (const r of permit_documents) {
          const cols = Object.keys(r);
          await client.query(
            `INSERT INTO permit_documents (${cols.join(', ')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(', ')}) ON CONFLICT (id) DO NOTHING`,
            cols.map(k => r[k])
          );
        }
        // billing_batch_items has no PK so ON CONFLICT can't dedupe; the
        // delete already happened, so a plain INSERT is correct here.
        for (const r of billing_batch_items) {
          const cols = Object.keys(r);
          try {
            await client.query(
              `INSERT INTO billing_batch_items (${cols.join(', ')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(', ')})`,
              cols.map(k => r[k])
            );
          } catch (bbiErr) {
            // Batch may have been confirmed/deleted in the meantime — skip.
          }
        }
        await client.query('COMMIT');
        return res.json({
          ok: true,
          restored_projects: projects.length,
          restored_time_entries: time_entries.length,
        });
      }

      if (bucket.kind === 'contract_cascade') {
        const { contract, project_tree } = bucket.payload;
        // Restore the contract first (projects reference it).
        if (contract) {
          const cols = Object.keys(contract);
          await client.query(
            `INSERT INTO contracts (${cols.join(', ')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(', ')}) ON CONFLICT (id) DO NOTHING`,
            cols.map(k => contract[k])
          );
        }
        // Then the project tree (same logic as project_tree kind).
        if (project_tree) {
          const { projects = [], time_entries = [], invoice_items = [], permit_stages = [], permit_documents = [] } = project_tree;
          const ordered = [...projects].sort((a, b) => (a.__depth || 0) - (b.__depth || 0));
          for (const p of ordered) {
            const cols = Object.keys(p).filter(k => !k.startsWith('__'));
            await client.query(
              `INSERT INTO projects (${cols.join(', ')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(', ')}) ON CONFLICT (id) DO NOTHING`,
              cols.map(k => p[k])
            );
          }
          for (const r of time_entries) {
            const cols = Object.keys(r);
            await client.query(
              `INSERT INTO time_entries (${cols.join(', ')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(', ')}) ON CONFLICT (id) DO NOTHING`,
              cols.map(k => r[k])
            );
          }
          for (const r of invoice_items) {
            const cols = Object.keys(r);
            await client.query(
              `INSERT INTO invoice_items (${cols.join(', ')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(', ')}) ON CONFLICT (id) DO NOTHING`,
              cols.map(k => r[k])
            );
          }
          for (const r of permit_stages) {
            const cols = Object.keys(r);
            await client.query(
              `INSERT INTO permit_stages (${cols.join(', ')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(', ')}) ON CONFLICT (id) DO NOTHING`,
              cols.map(k => r[k])
            );
          }
          for (const r of permit_documents) {
            const cols = Object.keys(r);
            await client.query(
              `INSERT INTO permit_documents (${cols.join(', ')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(', ')}) ON CONFLICT (id) DO NOTHING`,
              cols.map(k => r[k])
            );
          }
        }
        await client.query('COMMIT');
        return res.json({ ok: true });
      }

      await client.query('ROLLBACK');
      return res.status(400).json({ error: `Unknown undo kind: ${bucket.kind}` });
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch {}
      console.error('[undo:replay]', bucket.kind, e && e.message);
      return res.status(500).json({ error: 'Undo failed: ' + (e.message || 'unknown error') });
    } finally {
      client.release();
    }
  });
};
