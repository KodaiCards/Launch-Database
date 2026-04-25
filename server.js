require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Anthropic = require('@anthropic-ai/sdk');
const XLSX = require('xlsx');
const { pool, initSchema } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Uploads directory ───────────────────────────────────────────────────────
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${uuidv4()}_${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─── Password Protection ─────────────────────────────────────────────────────
if (process.env.APP_PASSWORD) {
  app.use((req, res, next) => {
    const auth = req.headers.authorization;
    if (auth) {
      const [scheme, encoded] = auth.split(' ');
      if (scheme === 'Basic') {
        const [user, pass] = Buffer.from(encoded, 'base64').toString().split(':');
        if (pass === process.env.APP_PASSWORD) return next();
      }
    }
    res.set('WWW-Authenticate', 'Basic realm="Launch Fiber Services"');
    res.status(401).send('Authentication required');
  });
  console.log('✓ Password protection enabled');
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOAD_DIR));

// ─── Anthropic client ─────────────────────────────────────────────────────────
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('WARNING: ANTHROPIC_API_KEY is not set. AI assistant will not work.');
  console.error('Add it in Railway dashboard → Variables → ANTHROPIC_API_KEY');
}
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function calcProjectFinancials(type, billingRate, footage) {
  const PERMITTING_RATE = 90;
  const PERMITTING_HRS_PER_MILE = 27.5;
  const PERMITTING_MIN_HRS = 15;

  if (type === 'permitting' && footage) {
    const miles = footage / 5280;
    const hrs = Math.max(miles * PERMITTING_HRS_PER_MILE, PERMITTING_MIN_HRS);
    return { expectedHours: +hrs.toFixed(2), expectedRevenue: +(hrs * PERMITTING_RATE).toFixed(2), miles: +miles.toFixed(4) };
  }
  return { expectedHours: null, expectedRevenue: null, miles: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// CLIENTS
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/clients', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM clients ORDER BY name');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/clients', async (req, res) => {
  const { name, is_rus, notes } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO clients (name, is_rus, notes) VALUES ($1,$2,$3) RETURNING *',
      [name, is_rus || false, notes]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// CONTRACTS
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/contracts', async (req, res) => {
  const { client_id } = req.query;
  try {
    const q = client_id
      ? 'SELECT c.*, cl.name as client_name FROM contracts c JOIN clients cl ON cl.id=c.client_id WHERE c.client_id=$1 ORDER BY c.contract_number'
      : 'SELECT c.*, cl.name as client_name FROM contracts c JOIN clients cl ON cl.id=c.client_id ORDER BY cl.name, c.contract_number';
    const { rows } = await pool.query(q, client_id ? [client_id] : []);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/contracts', async (req, res) => {
  const { client_id, contract_number, name } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO contracts (client_id, contract_number, name) VALUES ($1,$2,$3) RETURNING *',
      [client_id, contract_number, name]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// STAFF
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/staff', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM staff WHERE active=true ORDER BY name');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/staff', async (req, res) => {
  const { name } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO staff (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET active=true RETURNING *', [name]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/projects', async (req, res) => {
  const { status, client_id, type } = req.query;
  let where = [];
  let params = [];
  let i = 1;
  if (status) { where.push(`p.status=$${i++}`); params.push(status); }
  if (client_id) { where.push(`p.client_id=$${i++}`); params.push(client_id); }
  if (type) { where.push(`p.project_type=$${i++}`); params.push(type); }

  const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
  try {
    const { rows } = await pool.query(`
      SELECT p.*,
        cl.name as client_name,
        co.contract_number,
        co.name as contract_name,
        pp.name as parent_name,
        COALESCE(SUM(te.hours),0) as logged_hours,
        (SELECT COUNT(*) FROM projects ch WHERE ch.parent_id = p.id) as child_count
      FROM projects p
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN contracts co ON co.id = p.contract_id
      LEFT JOIN projects pp ON pp.id = p.parent_id
      LEFT JOIN time_entries te ON te.project_id = p.id
      ${whereStr}
      GROUP BY p.id, cl.name, co.contract_number, co.name, pp.name
      ORDER BY COALESCE(p.parent_id, p.id), p.parent_id NULLS FIRST, p.created_at DESC
    `, params);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*,
        cl.name as client_name,
        co.contract_number,
        co.name as contract_name,
        pp.name as parent_name
      FROM projects p
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN contracts co ON co.id = p.contract_id
      LEFT JOIN projects pp ON pp.id = p.parent_id
      WHERE p.id = $1
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/projects', async (req, res) => {
  const {
    name, client_id, contract_id, work_order_number,
    project_type, status = 'active', billing_type, billing_rate,
    footage, start_date, notes, parent_id, budget_code_id, concentrator_id
  } = req.body;

  try {
    const fin = calcProjectFinancials(project_type, billing_rate, footage);

    const { rows } = await pool.query(`
      INSERT INTO projects (
        name, client_id, contract_id, work_order_number,
        project_type, status, billing_type, billing_rate,
        footage, miles, expected_hours, expected_revenue,
        start_date, notes, parent_id, budget_code_id, concentrator_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      RETURNING *
    `, [
      name, client_id, contract_id || null, work_order_number,
      project_type, status, billing_type, billing_rate,
      footage || null, fin.miles, fin.expectedHours, fin.expectedRevenue,
      start_date || null, notes, parent_id || null, budget_code_id || null, concentrator_id || null
    ]);

    // Auto-create permit stage if permitting project
    if (project_type === 'permitting') {
      await pool.query(
        'INSERT INTO permit_stages (project_id, stage) VALUES ($1,$2) ON CONFLICT DO NOTHING',
        [rows[0].id, 'potential']
      );
    }

    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/projects/:id', async (req, res) => {
  const {
    name, client_id, contract_id, work_order_number,
    project_type, status, billing_type, billing_rate,
    footage, start_date, completed_date, billed_date, notes, parent_id, budget_code_id, concentrator_id
  } = req.body;

  try {
    const fin = calcProjectFinancials(project_type, billing_rate, footage);
    const { rows } = await pool.query(`
      UPDATE projects SET
        name=$1, client_id=$2, contract_id=$3, work_order_number=$4,
        project_type=$5, status=$6, billing_type=$7, billing_rate=$8,
        footage=$9, miles=$10, expected_hours=$11, expected_revenue=$12,
        start_date=$13, completed_date=$14, billed_date=$15, notes=$16, parent_id=$17, budget_code_id=$18, concentrator_id=$19
      WHERE id=$20 RETURNING *
    `, [
      name, client_id, contract_id || null, work_order_number,
      project_type, status, billing_type, billing_rate,
      footage || null, fin.miles, fin.expectedHours, fin.expectedRevenue,
      start_date || null, completed_date || null, billed_date || null, notes, parent_id || null, budget_code_id || null, concentrator_id || null,
      req.params.id
    ]);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM projects WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// TIME ENTRIES
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/time-entries', async (req, res) => {
  const { project_id, staff_id, month, year } = req.query;
  let where = [];
  let params = [];
  let i = 1;
  if (project_id) { where.push(`te.project_id=$${i++}`); params.push(project_id); }
  if (staff_id) { where.push(`te.staff_id=$${i++}`); params.push(staff_id); }
  if (month && year) {
    where.push(`EXTRACT(MONTH FROM te.entry_date)=$${i++} AND EXTRACT(YEAR FROM te.entry_date)=$${i++}`);
    params.push(month, year);
  }
  const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
  try {
    const { rows } = await pool.query(`
      SELECT te.*, p.name as project_name, p.work_order_number, p.project_type,
             s.name as staff_name
      FROM time_entries te
      LEFT JOIN projects p ON p.id = te.project_id
      LEFT JOIN staff s ON s.id = te.staff_id
      ${whereStr}
      ORDER BY te.entry_date DESC, te.created_at DESC
    `, params);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/time-entries', async (req, res) => {
  const { project_id, staff_id, entry_date, hours, job_title, notes } = req.body;
  try {
    const { rows } = await pool.query(`
      INSERT INTO time_entries (project_id, staff_id, entry_date, hours, job_title, notes)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
    `, [project_id, staff_id || null, entry_date, hours, job_title, notes]);

    // Update project actual_hours
    await pool.query(`
      UPDATE projects SET actual_hours = (
        SELECT COALESCE(SUM(hours),0) FROM time_entries WHERE project_id=$1
      ) WHERE id=$1
    `, [project_id]);

    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/time-entries/bulk', async (req, res) => {
  const { entries } = req.body; // [{project_id, staff_id, entry_date, hours, job_title}]
  if (!entries || !entries.length) return res.status(400).json({ error: 'No entries' });

  const importBatch = `import_${Date.now()}`;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const inserted = [];
    for (const e of entries) {
      const { rows } = await client.query(`
        INSERT INTO time_entries (project_id, staff_id, entry_date, hours, job_title, import_batch)
        VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
      `, [e.project_id, e.staff_id || null, e.entry_date, e.hours, e.job_title, importBatch]);
      inserted.push(rows[0]);
    }
    // Update actual_hours for affected projects
    const projectIds = [...new Set(entries.map(e => e.project_id))];
    for (const pid of projectIds) {
      await client.query(`
        UPDATE projects SET actual_hours = (
          SELECT COALESCE(SUM(hours),0) FROM time_entries WHERE project_id=$1
        ) WHERE id=$1
      `, [pid]);
    }
    await client.query('COMMIT');
    res.json({ inserted: inserted.length, batch: importBatch });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

app.delete('/api/time-entries/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM time_entries WHERE id=$1 RETURNING project_id', [req.params.id]);
    if (rows[0]) {
      await pool.query(`
        UPDATE projects SET actual_hours = (
          SELECT COALESCE(SUM(hours),0) FROM time_entries WHERE project_id=$1
        ) WHERE id=$1
      `, [rows[0].project_id]);
    }
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// PERMIT PIPELINE
// ─────────────────────────────────────────────────────────────────────────────
const PERMIT_STAGES = ['potential','started','submitted','approved','checklist','billed'];

app.get('/api/permits', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*,
        cl.name as client_name,
        co.contract_number,
        ps_cur.stage as current_stage,
        (SELECT json_agg(ps2 ORDER BY ps2.created_at) FROM permit_stages ps2 WHERE ps2.project_id=p.id) as stages,
        (SELECT json_agg(pd ORDER BY pd.created_at DESC) FROM permit_documents pd WHERE pd.project_id=p.id) as documents
      FROM projects p
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN contracts co ON co.id = p.contract_id
      LEFT JOIN LATERAL (
        SELECT stage FROM permit_stages WHERE project_id=p.id AND completed_at IS NULL
        ORDER BY created_at LIMIT 1
      ) ps_cur ON true
      WHERE p.project_type = 'permitting'
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/permits/:projectId/advance', async (req, res) => {
  const { updated_by, notes } = req.body;
  const { projectId } = req.params;
  try {
    // Get current stage
    const { rows: current } = await pool.query(
      'SELECT stage FROM permit_stages WHERE project_id=$1 AND completed_at IS NULL ORDER BY created_at LIMIT 1',
      [projectId]
    );
    const currentStage = current[0]?.stage || 'potential';
    const nextIdx = PERMIT_STAGES.indexOf(currentStage) + 1;
    if (nextIdx >= PERMIT_STAGES.length) return res.json({ message: 'Already at final stage' });
    const nextStage = PERMIT_STAGES[nextIdx];

    // Complete current stage
    await pool.query(
      'UPDATE permit_stages SET completed_at=NOW(), notes=$1, updated_by=$2 WHERE project_id=$3 AND stage=$4',
      [notes, updated_by, projectId, currentStage]
    );
    // Create next stage
    await pool.query(
      'INSERT INTO permit_stages (project_id, stage, updated_by) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING',
      [projectId, nextStage, updated_by]
    );
    res.json({ previous: currentStage, current: nextStage });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/permits/:projectId/documents', upload.single('file'), async (req, res) => {
  const { doc_type, uploaded_by, notes, revision_number } = req.body;
  if (!req.file) return res.status(400).json({ error: 'No file' });
  try {
    const { rows } = await pool.query(`
      INSERT INTO permit_documents (project_id, doc_type, file_name, file_path, file_size, revision_number, uploaded_by, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
    `, [req.params.projectId, doc_type, req.file.originalname, req.file.filename, req.file.size, revision_number || 1, uploaded_by, notes]);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// BUDGETS
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/budgets', async (req, res) => {
  const { project_id } = req.query;
  try {
    let q, params;
    if (project_id) {
      q = `SELECT b.*, p.name as project_name FROM budgets b
           LEFT JOIN projects p ON p.id = b.project_id
           WHERE b.project_id = $1 ORDER BY b.created_at DESC`;
      params = [project_id];
    } else {
      q = `SELECT b.*, p.name as project_name FROM budgets b
           LEFT JOIN projects p ON p.id = b.project_id
           ORDER BY b.created_at DESC`;
      params = [];
    }
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/budgets/:id/summary', async (req, res) => {
  try {
    // Get the budget
    const { rows: budgetRows } = await pool.query(
      `SELECT b.*, p.name as project_name FROM budgets b
       LEFT JOIN projects p ON p.id = b.project_id WHERE b.id = $1`, [req.params.id]
    );
    if (!budgetRows.length) return res.status(404).json({ error: 'Budget not found' });
    const budget = budgetRows[0];

    // Get all codes with spent amounts
    const { rows: codes } = await pool.query(`
      SELECT bc.*,
        COALESCE(SUM(
          CASE
            WHEN proj.billing_type = 'footage' THEN proj.expected_revenue
            WHEN proj.billing_type = 'hourly' THEN proj.actual_hours * proj.billing_rate
            ELSE 0
          END
        ), 0) as spent,
        COUNT(proj.id) as project_count,
        json_agg(json_build_object(
          'id', proj.id, 'name', proj.name, 'status', proj.status,
          'project_type', proj.project_type,
          'billable', CASE
            WHEN proj.billing_type = 'footage' THEN proj.expected_revenue
            WHEN proj.billing_type = 'hourly' THEN proj.actual_hours * proj.billing_rate
            ELSE 0
          END
        )) FILTER (WHERE proj.id IS NOT NULL) as projects
      FROM budget_codes bc
      LEFT JOIN projects proj ON proj.budget_code_id = bc.id
      WHERE bc.budget_id = $1
      GROUP BY bc.id
      ORDER BY bc.code
    `, [req.params.id]);

    const totalAllocated = codes.reduce((s, c) => s + parseFloat(c.allocated_amount || 0), 0);
    const totalSpent = codes.reduce((s, c) => s + parseFloat(c.spent || 0), 0);

    res.json({
      ...budget,
      codes,
      total_allocated: totalAllocated,
      total_spent: totalSpent,
      total_remaining: totalAllocated - totalSpent
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/budgets', async (req, res) => {
  const { project_id, name, total_amount, notes } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO budgets (project_id, name, total_amount, notes)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [project_id, name, total_amount || 0, notes || null]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/budgets/:id', async (req, res) => {
  const { name, total_amount, notes } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE budgets SET name=$1, total_amount=$2, notes=$3 WHERE id=$4 RETURNING *`,
      [name, total_amount, notes || null, req.params.id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/budgets/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM budgets WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// BUDGET CODES
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/budget-codes', async (req, res) => {
  const { budget_id } = req.query;
  try {
    const q = budget_id
      ? 'SELECT * FROM budget_codes WHERE budget_id=$1 ORDER BY code'
      : 'SELECT bc.*, b.name as budget_name FROM budget_codes bc JOIN budgets b ON b.id=bc.budget_id ORDER BY b.name, bc.code';
    const { rows } = await pool.query(q, budget_id ? [budget_id] : []);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/budget-codes', async (req, res) => {
  const { budget_id, code, description, allocated_amount } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO budget_codes (budget_id, code, description, allocated_amount)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [budget_id, code, description || null, allocated_amount || 0]
    );
    // Recalculate budget total from sum of codes
    await pool.query(
      `UPDATE budgets SET total_amount = (
        SELECT COALESCE(SUM(allocated_amount),0) FROM budget_codes WHERE budget_id=$1
      ) WHERE id=$1`, [budget_id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/budget-codes/:id', async (req, res) => {
  const { code, description, allocated_amount } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE budget_codes SET code=$1, description=$2, allocated_amount=$3
       WHERE id=$4 RETURNING *`,
      [code, description || null, allocated_amount || 0, req.params.id]
    );
    // Recalculate budget total
    if (rows[0]) {
      await pool.query(
        `UPDATE budgets SET total_amount = (
          SELECT COALESCE(SUM(allocated_amount),0) FROM budget_codes WHERE budget_id=$1
        ) WHERE id=$1`, [rows[0].budget_id]
      );
    }
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/budget-codes/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM budget_codes WHERE id=$1 RETURNING budget_id', [req.params.id]);
    // Recalculate budget total
    if (rows[0]) {
      await pool.query(
        `UPDATE budgets SET total_amount = (
          SELECT COALESCE(SUM(allocated_amount),0) FROM budget_codes WHERE budget_id=$1
        ) WHERE id=$1`, [rows[0].budget_id]
      );
    }
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// CONCENTRATORS / SERVICE AREAS
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/concentrators', async (req, res) => {
  const { contract_label } = req.query;
  try {
    const q = contract_label
      ? 'SELECT * FROM concentrators WHERE contract_label=$1 AND active=true ORDER BY area_name'
      : 'SELECT * FROM concentrators WHERE active=true ORDER BY contract_label, area_name';
    const { rows } = await pool.query(q, contract_label ? [contract_label] : []);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/concentrators', async (req, res) => {
  const { contract_label, area_name, work_order_number, notes } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO concentrators (contract_label, area_name, work_order_number, notes)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [contract_label, area_name, work_order_number || null, notes || null]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Budget summary broken down by area/concentrator
app.get('/api/budgets/:id/by-area', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        c.id as concentrator_id,
        c.area_name,
        c.work_order_number,
        c.contract_label,
        COUNT(DISTINCT p.id) as project_count,
        COALESCE(SUM(
          CASE
            WHEN p.billing_type = 'footage' AND p.status IN ('completed','billed') THEN p.expected_revenue
            WHEN p.billing_type = 'hourly' THEN p.actual_hours * p.billing_rate
            ELSE 0
          END
        ), 0) as spent,
        json_agg(json_build_object(
          'id', p.id, 'name', p.name, 'project_type', p.project_type,
          'status', p.status,
          'earned', CASE
            WHEN p.billing_type = 'footage' AND p.status IN ('completed','billed') THEN p.expected_revenue
            WHEN p.billing_type = 'hourly' THEN p.actual_hours * p.billing_rate
            ELSE 0
          END
        )) FILTER (WHERE p.id IS NOT NULL) as projects
      FROM concentrators c
      LEFT JOIN projects p ON p.concentrator_id = c.id
      WHERE c.active = true
      GROUP BY c.id, c.area_name, c.work_order_number, c.contract_label
      ORDER BY c.contract_label, c.area_name
    `);

    // Get budget total
    const { rows: budgetRows } = await pool.query('SELECT total_amount FROM budgets WHERE id=$1', [req.params.id]);
    const budgetTotal = budgetRows[0] ? parseFloat(budgetRows[0].total_amount) : 0;
    const totalSpent = rows.reduce((s, r) => s + parseFloat(r.spent || 0), 0);

    res.json({
      budget_total: budgetTotal,
      total_spent: totalSpent,
      total_remaining: budgetTotal - totalSpent,
      areas: rows
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const yearStart = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];

    const [activeR, unbilledR, monthRevR, ytdRevR, recentR, alertR] = await Promise.all([
      // Active = leaf projects only (exclude grandparents/parents which are file-management containers)
      pool.query(`
        SELECT COUNT(*) FROM projects p
        WHERE p.status='active'
          AND NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id)
      `),
      pool.query(`SELECT COUNT(*), COALESCE(SUM(expected_revenue),0) as total FROM projects WHERE status='completed' AND billed_date IS NULL`),
      // Monthly revenue: work performed this month, regardless of billing type or
      // billing date. Every hour logged this month earns at the project's billing_rate.
      // Resets automatically on the 1st (monthStart is the first of the current month).
      pool.query(`
        SELECT COALESCE(SUM(te.hours * p.billing_rate), 0) AS rev
        FROM time_entries te
        JOIN projects p ON p.id = te.project_id
        WHERE te.entry_date >= $1
      `, [monthStart]),
      // YTD revenue: same shape as monthly, applied to year-to-date billed work.
      pool.query(`
        SELECT COALESCE(SUM(
          CASE
            WHEN billing_type = 'footage' THEN expected_revenue
            WHEN billing_type = 'hourly' THEN actual_hours * billing_rate
            ELSE 0
          END
        ), 0) AS rev
        FROM projects
        WHERE billed_date >= $1
      `, [yearStart]),
      pool.query(`
        SELECT p.id, p.name, p.project_type, p.status, p.work_order_number,
               cl.name as client_name, p.expected_hours, p.actual_hours,
               p.expected_revenue, p.created_at, p.parent_id,
               pp.name as parent_name, pp.parent_id as grandparent_id,
               con.area_name as concentrator_area
        FROM projects p
        LEFT JOIN clients cl ON cl.id=p.client_id
        LEFT JOIN projects pp ON pp.id=p.parent_id
        LEFT JOIN concentrators con ON con.id=p.concentrator_id
        WHERE p.status='active'
        ORDER BY p.created_at DESC
      `),
      pool.query(`
        SELECT p.id, p.name, p.project_type, p.work_order_number, p.expected_revenue,
               cl.name as client_name, p.completed_date
        FROM projects p
        LEFT JOIN clients cl ON cl.id=p.client_id
        WHERE p.status='completed' AND p.billed_date IS NULL
        ORDER BY p.completed_date ASC
      `)
    ]);

    res.json({
      active_projects: parseInt(activeR.rows[0].count),
      unbilled_count: parseInt(unbilledR.rows[0].count),
      unbilled_total: parseFloat(unbilledR.rows[0].total),
      month_revenue: parseFloat(monthRevR.rows[0].rev),
      ytd_revenue: parseFloat(ytdRevR.rows[0].rev),
      recent_projects: recentR.rows,
      unbilled_projects: alertR.rows
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// REVENUE
// ─────────────────────────────────────────────────────────────────────────────

// Monthly summary — all months for a given year
app.get('/api/revenue/monthly-summary', async (req, res) => {
  const year = req.query.year || new Date().getFullYear();
  try {
    const { rows } = await pool.query(`
      WITH monthly AS (
        SELECT
          EXTRACT(MONTH FROM te.entry_date)::int as month,
          COALESCE(SUM(te.hours), 0) as hours,
          COALESCE(SUM(te.hours * p.billing_rate), 0) as earned
        FROM time_entries te
        JOIN projects p ON p.id = te.project_id
        WHERE EXTRACT(YEAR FROM te.entry_date) = $1
        GROUP BY month
      ),
      billed_monthly AS (
        SELECT
          EXTRACT(MONTH FROM p.billed_date)::int as month,
          COALESCE(SUM(
            CASE
              WHEN p.billing_type = 'footage' THEN p.expected_revenue
              WHEN p.billing_type = 'hourly' THEN p.actual_hours * p.billing_rate
              ELSE 0
            END
          ), 0) as billed
        FROM projects p
        WHERE p.billed_date IS NOT NULL
          AND EXTRACT(YEAR FROM p.billed_date) = $1
        GROUP BY month
      )
      SELECT
        m.month,
        COALESCE(m.hours, 0) as hours,
        COALESCE(m.earned, 0) as earned,
        COALESCE(b.billed, 0) as billed
      FROM generate_series(1, 12) AS s(month)
      LEFT JOIN monthly m ON m.month = s.month
      LEFT JOIN billed_monthly b ON b.month = s.month
      ORDER BY s.month
    `, [year]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Revenue by client — filterable by month/year
app.get('/api/revenue/by-client', async (req, res) => {
  const year = req.query.year || new Date().getFullYear();
  const month = req.query.month; // optional
  try {
    let dateFilter, params;
    if (month) {
      dateFilter = `AND EXISTS (
        SELECT 1 FROM time_entries te2 WHERE te2.project_id = p.id
        AND EXTRACT(MONTH FROM te2.entry_date) = $2
        AND EXTRACT(YEAR FROM te2.entry_date) = $1
      )`;
      params = [year, month];
    } else {
      dateFilter = `AND (EXTRACT(YEAR FROM p.start_date) = $1 OR p.start_date IS NULL)`;
      params = [year];
    }

    // Parameterized lateral filter — never interpolate user input into SQL strings
    const lateralFilter = month
      ? `AND EXTRACT(MONTH FROM te.entry_date) = $2 AND EXTRACT(YEAR FROM te.entry_date) = $1`
      : `AND EXTRACT(YEAR FROM te.entry_date) = $1`;

    const { rows } = await pool.query(`
      SELECT
        cl.id as client_id,
        cl.name as client_name,
        COUNT(DISTINCT p.id) as project_count,
        COALESCE(SUM(p.expected_revenue), 0) as expected_total,
        COALESCE(SUM(COALESCE(te_hrs.hrs, 0) * p.billing_rate), 0) as earned_hourly,
        COALESCE(SUM(
          CASE WHEN p.billing_type = 'footage' AND p.status IN ('completed','billed')
          THEN p.expected_revenue ELSE 0 END
        ), 0) as earned_footage,
        COALESCE(SUM(
          CASE WHEN p.billed_date IS NOT NULL THEN
            CASE
              WHEN p.billing_type = 'footage' THEN p.expected_revenue
              WHEN p.billing_type = 'hourly' THEN p.actual_hours * p.billing_rate
              ELSE 0
            END
          ELSE 0 END
        ), 0) as billed_total,
        COALESCE(SUM(COALESCE(te_hrs.hrs, 0)), 0) as total_hours
      FROM clients cl
      LEFT JOIN projects p ON p.client_id = cl.id ${dateFilter}
      LEFT JOIN LATERAL (
        SELECT COALESCE(SUM(te.hours), 0) as hrs
        FROM time_entries te
        WHERE te.project_id = p.id
        ${lateralFilter}
      ) te_hrs ON true
      GROUP BY cl.id, cl.name
      ORDER BY client_name
    `, params);

    // Calculate totals
    rows.forEach(r => {
      r.earned_total = parseFloat(r.earned_hourly) + parseFloat(r.earned_footage);
    });

    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Detailed project breakdown for a specific month
app.get('/api/revenue/details', async (req, res) => {
  const year = req.query.year || new Date().getFullYear();
  const month = req.query.month;
  try {
    let whereClause, params;
    if (month) {
      whereClause = `WHERE EXISTS (
        SELECT 1 FROM time_entries te2 WHERE te2.project_id = p.id
        AND EXTRACT(MONTH FROM te2.entry_date) = $2
        AND EXTRACT(YEAR FROM te2.entry_date) = $1
      ) OR (p.billing_type = 'footage' AND EXTRACT(MONTH FROM p.start_date) = $2 AND EXTRACT(YEAR FROM p.start_date) = $1)`;
      params = [year, month];
    } else {
      whereClause = `WHERE (EXTRACT(YEAR FROM p.start_date) = $1 OR p.start_date IS NULL OR EXISTS (
        SELECT 1 FROM time_entries te2 WHERE te2.project_id = p.id AND EXTRACT(YEAR FROM te2.entry_date) = $1
      ))`;
      params = [year];
    }

    const hoursFilter = month
      ? `AND EXTRACT(MONTH FROM te.entry_date) = $2 AND EXTRACT(YEAR FROM te.entry_date) = $1`
      : `AND EXTRACT(YEAR FROM te.entry_date) = $1`;

    const { rows } = await pool.query(`
      SELECT p.id, p.name, p.project_type, p.status, p.work_order_number,
             p.billing_type, p.billing_rate, p.footage, p.expected_revenue,
             p.billed_date,
             cl.name as client_name,
             co.contract_number,
             COALESCE(te_sum.hrs, 0) as period_hours,
             CASE
               WHEN p.billing_type = 'hourly' THEN COALESCE(te_sum.hrs, 0) * p.billing_rate
               WHEN p.billing_type = 'footage' AND p.status IN ('completed','billed') THEN p.expected_revenue
               ELSE 0
             END as earned
      FROM projects p
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN contracts co ON co.id = p.contract_id
      LEFT JOIN LATERAL (
        SELECT COALESCE(SUM(te.hours), 0) as hrs
        FROM time_entries te WHERE te.project_id = p.id ${hoursFilter}
      ) te_sum ON true
      ${whereClause}
      ORDER BY cl.name, p.project_type, p.name
    `, params);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/revenue/unbilled', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*,
        cl.name as client_name,
        co.contract_number,
        COALESCE(SUM(te.hours),0) as logged_hours,
        CASE
          WHEN p.billing_type = 'hourly' THEN COALESCE(SUM(te.hours),0) * p.billing_rate
          WHEN p.billing_type = 'footage' THEN p.expected_revenue
          ELSE 0
        END as earned_amount
      FROM projects p
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN contracts co ON co.id = p.contract_id
      LEFT JOIN time_entries te ON te.project_id = p.id
      WHERE p.billed_date IS NULL AND p.status = 'completed'
      GROUP BY p.id, cl.name, co.contract_number
      ORDER BY cl.name, p.project_type, p.completed_date
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/reports/hours', async (req, res) => {
  const { month, year } = req.query;
  const m = month || new Date().getMonth() + 1;
  const y = year || new Date().getFullYear();
  try {
    const { rows } = await pool.query(`
      SELECT
        s.name as staff_name,
        p.name as project_name,
        p.work_order_number,
        p.project_type,
        cl.name as client_name,
        te.entry_date,
        te.hours,
        te.job_title
      FROM time_entries te
      JOIN projects p ON p.id = te.project_id
      LEFT JOIN staff s ON s.id = te.staff_id
      LEFT JOIN clients cl ON cl.id = p.client_id
      WHERE EXTRACT(MONTH FROM te.entry_date)=$1
        AND EXTRACT(YEAR FROM te.entry_date)=$2
      ORDER BY s.name, te.entry_date
    `, [m, y]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/reports/billing', async (req, res) => {
  const { month, year } = req.query;
  const m = month || new Date().getMonth() + 1;
  const y = year || new Date().getFullYear();
  try {
    const { rows } = await pool.query(`
      SELECT p.*,
        cl.name as client_name,
        cl.is_rus,
        co.contract_number,
        COALESCE(SUM(te.hours),0) as logged_hours,
        CASE
          WHEN p.billing_type='footage' THEN p.expected_revenue
          WHEN p.billing_type='hourly' THEN COALESCE(SUM(te.hours),0) * p.billing_rate
        END as billable_amount
      FROM projects p
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN contracts co ON co.id = p.contract_id
      LEFT JOIN time_entries te ON te.project_id = p.id
        AND EXTRACT(MONTH FROM te.entry_date)=$1
        AND EXTRACT(YEAR FROM te.entry_date)=$2
      WHERE p.billed_date IS NULL
        AND (p.status = 'completed'
          OR EXISTS(SELECT 1 FROM time_entries te2 WHERE te2.project_id=p.id
            AND EXTRACT(MONTH FROM te2.entry_date)=$1
            AND EXTRACT(YEAR FROM te2.entry_date)=$2))
      GROUP BY p.id, cl.name, cl.is_rus, co.contract_number
      ORDER BY cl.name, p.project_type
    `, [m, y]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/projects/:id/mark-billed', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE projects SET billed_date=NOW(), status='billed' WHERE id=$1 RETURNING *`,
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// AI CHAT — FULL TOOL SUITE
// ─────────────────────────────────────────────────────────────────────────────

async function getDBContext() {
  const [clients, projects, staff, contracts, budgets, concentrators] = await Promise.all([
    pool.query('SELECT id, name, is_rus FROM clients ORDER BY name'),
    pool.query(`
      SELECT p.id, p.name, p.project_type, p.status, p.work_order_number,
             p.billing_type, p.billing_rate, p.footage, p.miles,
             p.expected_hours, p.expected_revenue, p.actual_hours,
             cl.name as client_name, co.contract_number,
             p.start_date, p.completed_date, p.billed_date, p.notes,
             p.parent_id, pp.name as parent_name,
             p.budget_code_id, bc.code as budget_code_name,
             p.concentrator_id, con.area_name as concentrator_area, con.contract_label as concentrator_contract
      FROM projects p
      LEFT JOIN clients cl ON cl.id=p.client_id
      LEFT JOIN contracts co ON co.id=p.contract_id
      LEFT JOIN projects pp ON pp.id=p.parent_id
      LEFT JOIN budget_codes bc ON bc.id=p.budget_code_id
      LEFT JOIN concentrators con ON con.id=p.concentrator_id
      ORDER BY p.created_at DESC LIMIT 50
    `),
    pool.query('SELECT id, name FROM staff WHERE active=true ORDER BY name'),
    pool.query('SELECT c.*, cl.name as client_name FROM contracts c JOIN clients cl ON cl.id=c.client_id ORDER BY cl.name, c.contract_number'),
    pool.query(`
      SELECT b.id, b.name, b.project_id, b.total_amount, p.name as project_name,
             json_agg(json_build_object(
               'id', bc.id, 'code', bc.code, 'allocated_amount', bc.allocated_amount, 'description', bc.description
             )) FILTER (WHERE bc.id IS NOT NULL) as codes
      FROM budgets b
      LEFT JOIN projects p ON p.id = b.project_id
      LEFT JOIN budget_codes bc ON bc.budget_id = b.id
      GROUP BY b.id, b.name, b.project_id, b.total_amount, p.name
      ORDER BY b.created_at DESC
    `),
    pool.query('SELECT id, contract_label, area_name, work_order_number FROM concentrators WHERE active=true ORDER BY contract_label, area_name')
  ]);
  return { clients: clients.rows, projects: projects.rows, staff: staff.rows, contracts: contracts.rows, budgets: budgets.rows, concentrators: concentrators.rows };
}

const SYSTEM_PROMPT = `You are the AI project manager for Launch Fiber Services, a fiber optic infrastructure company in Macon, Georgia. You have FULL access to the database through tools. You are smart, proactive, and thorough.

RATE STRUCTURE:
- Inspection: $90/hr (RUS work only, PSC client)
- Resident Engineer (RE): $100/hr (RUS/PSC only)
- Permitting: $90/hr billed at 27.5 hours/mile (15 hour minimum), billing_type = 'footage'
- Design: VARIABLE - always ask for billing rate
- Other: VARIABLE - always ask for billing rate

CLIENTS: PSC (RUS), COX, IFT, TRI-CO
RUS work is PSC only. Contracts and work orders are managed manually or through the AI.

YOUR CAPABILITIES — you can do ALL of the following:
1. CREATE, UPDATE, and DELETE projects (including nested sub-projects)
2. CREATE clients, staff members, and contracts
3. LOG time entries (single or bulk from CSV)
4. MARK projects as billed or change their status
5. ADVANCE permit stages
6. QUERY the database for any information — projects, hours, revenue, etc.
7. Answer questions about project data, billing, revenue, hours

NESTED PROJECTS:
- Projects support a 3-level hierarchy: GRANDPARENT → PARENT → CHILD.
- Example: "RUS 217 Engineering Contract" (grandparent) → "Butler" (parent/area) → "Butler SR74 Permitting" (child/actual work)
- A top-level project has parent_id = null. Set parent_id to nest under another project.
- The user does NOT need to specify every level. Be smart:
  - "Add inspection in Butler" → You know Butler is an area under the RUS 217 project. Create a child project under Butler, auto-set the concentrator and WO#.
  - "Create a permitting project for Mt. Paran, 8000 LF" → Find Mt. Paran's parent, nest under it, set concentrator_id and WO# 16316.
  - If an area parent doesn't exist yet, offer to create it as a mid-level project.
- Time entries can be logged against any level but typically go on the lowest (child) level.
- In the DATABASE CONTEXT, projects with a parent_name are nested. Check grandparent_id to understand the full chain.

BUDGETS:
- Parent projects can have a BUDGET — an external funding source with a name like "RUS 217 Reconnect 3".
- Each budget has BUDGET CODES (job codes) with allocated dollar amounts, e.g. "Inspection: $50,000", "RE: $75,000", "Permitting: $30,000".
- Projects link to a budget_code_id so their billable work draws from that code's allocation.
- When asked to set up a budget, first create the budget (create_budget), then add each code (create_budget_code), then link projects to the appropriate codes (update_project with budget_code_id).
- To see budget utilization, use query_database to join budgets, budget_codes, and projects.
- The "spent" amount for a code = sum of billable work from all projects linked to that code (hourly: actual_hours × billing_rate, footage: expected_revenue).
- If the user uploads a contract document, extract the budget codes and amounts and offer to set them up.
- The DATABASE CONTEXT includes budgets with their codes — use the budget code IDs when linking projects.
- When referencing budgets, always inform the user of per-area spending and remaining budget.

CONCENTRATORS / SERVICE AREAS:
- The DATABASE CONTEXT includes a concentrators list — these are service areas with their WO numbers, grouped by contract.
- Each concentrator has: id, contract_label (e.g. "Contract 3"), area_name (e.g. "Mt. Paran"), work_order_number (e.g. "16316").
- When creating a project, if the user mentions an AREA NAME (like "Mt. Paran", "Butler", "Talbotton", etc.), AUTOMATICALLY look up the matching concentrator and set both:
  1. concentrator_id = the concentrator's UUID
  2. work_order_number = the concentrator's WO number
- Do NOT ask for the WO# if you can match it from the concentrator data. Only ask if you can't find a match.
- Be fuzzy with area matching: "Paran" should match "Mt. Paran", "Crossroads" should match "Crossroad School", "hwy240" should match "HWY 240".
- All concentrator areas draw from the same budget (RUS 217). When discussing budget status, break down spending by area.
- The concentrator list in DATABASE CONTEXT has the exact UUIDs — use those when setting concentrator_id.

HOW TO WORK:
- When the user asks to create/update/delete something, first summarize what you'll do, then ask for confirmation.
- When the user confirms (says yes, ok, correct, go ahead, etc.), IMMEDIATELY call the appropriate tool. Do not say "I'll create it now" — just call the tool.
- Use the DATABASE CONTEXT below to find correct UUIDs for client_id, contract_id, staff_id, and project_id. Match by name when the user refers to things by name.
- If a user mentions a client that doesn't exist, offer to create it.
- If a user mentions a staff member that doesn't exist, offer to create them.
- For permitting projects, always set billing_type to 'footage' and billing_rate to 90. The footage field drives the financial calculation.
- For inspection, set billing_rate to 90 and billing_type to 'hourly'.
- For RE, set billing_rate to 100 and billing_type to 'hourly'.
- For design/other, ASK for the billing rate before creating.

QUERYING DATA:
- You have a query_database tool that can run SELECT queries. Use it to answer questions about projects, hours, revenue, etc.
- NEVER run INSERT, UPDATE, DELETE, DROP, ALTER, or any modifying SQL through query_database. Only SELECT.
- Use the specific action tools (create_project, update_project, etc.) for modifications.

WORKFORCE FILE IMPORTS:
When a user uploads an Excel or CSV file with workforce/timesheet data, you must be intelligent about processing it:

1. THE FILE DATA IS STORED SERVER-SIDE. You receive only the upload_id, headers, row count, and 5 sample rows.
   Use the get_upload_data tool to fetch the actual data in batches of 50 rows.
   Start with offset=0, then increment by 50 until has_more is false.

2. ANALYZE THE SAMPLE FIRST: Look at the 5 sample rows to understand the structure before fetching everything.
   Common columns include: employee/name/worker, date, work_order/WO/project, hours, job_title/position/role.

2. MATCH TO EXISTING DATA:
   - Match work order numbers (WO-001, etc.) to existing projects in the DATABASE CONTEXT
   - Match employee names to existing staff members
   - Match client names to existing clients
   - Be fuzzy — "J. Smith" might be "John Smith", "WO 001" might be "WO-001"

3. HANDLE MISSING DATA:
   - If a work order doesn't match any project, tell the user and offer to CREATE the project. Ask what type/rate it should be.
   - If an employee isn't in the system, offer to CREATE them as staff.
   - If dates are in different formats (MM/DD/YYYY, M/D/YY, etc.), normalize to YYYY-MM-DD.

4. SUMMARIZE BEFORE ACTING: Show the user a clear breakdown:
   - How many entries will be logged
   - Which projects they map to
   - Which employees are involved
   - Any entries that couldn't be matched (and what to do about them)
   - Total hours per project and per employee

5. MAKE INTELLIGENT ASSUMPTIONS:
   - If a column is labeled "Regular Hours" and "OT Hours", combine them or note the overtime
   - If there are multiple date columns, use the most specific one (entry_date over pay_period)
   - If work orders have prefixes like "PSC-" or "RUS-", use that to identify the client
   - If a sheet has subtotals or summary rows, skip them
   - If hours are blank or zero for a row, skip that row
   - Look for patterns: if all work orders start with the same prefix, they likely belong to the same client/contract

6. WAIT FOR CONFIRMATION before calling log_time_entries. Show exactly what will be saved.

DATABASE CONTEXT (current data):
{CONTEXT}`;

// ─── TOOL DEFINITIONS ────────────────────────────────────────────────────────
const AI_TOOLS = [
  {
    name: 'create_project',
    description: 'Create a new project in the database. Can be a top-level project or a sub-project nested under a parent. Call this ONLY after the user has confirmed the details.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Project name' },
        client_id: { type: 'string', description: 'Client UUID from database context' },
        contract_id: { type: 'string', description: 'Contract UUID (optional, for PSC/RUS)' },
        work_order_number: { type: 'string', description: 'Work order number' },
        project_type: { type: 'string', enum: ['inspection', 're', 'permitting', 'design', 'other'] },
        billing_type: { type: 'string', enum: ['hourly', 'footage'] },
        billing_rate: { type: 'number', description: 'Hourly rate in dollars' },
        footage: { type: 'number', description: 'Linear footage (permitting projects only)' },
        status: { type: 'string', enum: ['active', 'completed', 'on_hold'], default: 'active' },
        start_date: { type: 'string', description: 'YYYY-MM-DD format (optional)' },
        notes: { type: 'string' },
        parent_id: { type: 'string', description: 'UUID of parent project to nest this under (optional). Use this to create sub-projects.' },
        budget_code_id: { type: 'string', description: 'UUID of budget code this project bills against (optional). Get from database context budgets.' },
        concentrator_id: { type: 'string', description: 'UUID of the concentrator/service area this project belongs to. Look up from concentrators in database context by area name.' }
      },
      required: ['name', 'client_id', 'project_type', 'billing_type', 'billing_rate']
    }
  },
  {
    name: 'update_project',
    description: 'Update an existing project. Only include the fields that are changing. Can move a project under a parent or make it top-level. Call ONLY after user confirms.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'UUID of the project to update' },
        name: { type: 'string' },
        client_id: { type: 'string' },
        contract_id: { type: 'string' },
        work_order_number: { type: 'string' },
        project_type: { type: 'string', enum: ['inspection', 're', 'permitting', 'design', 'other'] },
        status: { type: 'string', enum: ['active', 'completed', 'on_hold', 'billed'] },
        billing_type: { type: 'string', enum: ['hourly', 'footage'] },
        billing_rate: { type: 'number' },
        footage: { type: 'number' },
        start_date: { type: 'string' },
        completed_date: { type: 'string' },
        notes: { type: 'string' },
        parent_id: { type: ['string', 'null'], description: 'UUID of parent project, or null to make it top-level' },
        budget_code_id: { type: ['string', 'null'], description: 'UUID of budget code this project bills against, or null to unlink' },
        concentrator_id: { type: ['string', 'null'], description: 'UUID of concentrator/service area, or null to unlink' }
      },
      required: ['project_id']
    }
  },
  {
    name: 'delete_project',
    description: 'Delete a project and all its associated data. Call ONLY after user explicitly confirms deletion.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'UUID of the project to delete' }
      },
      required: ['project_id']
    }
  },
  {
    name: 'create_client',
    description: 'Create a new client in the database.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Client name' },
        is_rus: { type: 'boolean', description: 'Whether this is a RUS client (default false)' },
        notes: { type: 'string' }
      },
      required: ['name']
    }
  },
  {
    name: 'create_staff',
    description: 'Create a new staff member.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Staff member full name' }
      },
      required: ['name']
    }
  },
  {
    name: 'create_contract',
    description: 'Create a new contract for a client.',
    input_schema: {
      type: 'object',
      properties: {
        client_id: { type: 'string', description: 'Client UUID' },
        contract_number: { type: 'string', description: 'Contract number/identifier' },
        name: { type: 'string', description: 'Contract name/description' }
      },
      required: ['client_id', 'contract_number']
    }
  },
  {
    name: 'log_time_entries',
    description: 'Log one or more time entries for projects. Call after user confirms.',
    input_schema: {
      type: 'object',
      properties: {
        entries: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              project_id: { type: 'string' },
              staff_id: { type: 'string' },
              entry_date: { type: 'string', description: 'YYYY-MM-DD format' },
              hours: { type: 'number' },
              job_title: { type: 'string' }
            },
            required: ['project_id', 'entry_date', 'hours']
          }
        }
      },
      required: ['entries']
    }
  },
  {
    name: 'update_project_status',
    description: 'Quick status change for a project: active, completed, on_hold, or billed. For marking billed, also sets billed_date.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'Project UUID' },
        status: { type: 'string', enum: ['active', 'completed', 'on_hold', 'billed'] }
      },
      required: ['project_id', 'status']
    }
  },
  {
    name: 'advance_permit_stage',
    description: 'Advance a permitting project to the next stage in the pipeline.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string' },
        updated_by: { type: 'string', description: 'Name of person advancing the stage' },
        notes: { type: 'string' }
      },
      required: ['project_id']
    }
  },
  {
    name: 'query_database',
    description: 'Run a read-only SELECT query against the database to look up information. Use this to answer questions about projects, hours, revenue, budgets, staff, etc. ONLY SELECT queries allowed — never INSERT/UPDATE/DELETE/DROP/ALTER.',
    input_schema: {
      type: 'object',
      properties: {
        sql: { type: 'string', description: 'A SELECT query to run. Available tables: clients, contracts, staff, projects, time_entries, permit_stages, permit_documents, invoices, invoice_items, budgets, budget_codes, concentrators. Key columns — projects: id, name, client_id, contract_id, work_order_number, project_type, status, billing_type, billing_rate, footage, miles, expected_hours, expected_revenue, actual_hours, start_date, completed_date, billed_date, notes, parent_id, budget_code_id, concentrator_id. budgets: id, project_id, name, total_amount. budget_codes: id, budget_id, code, description, allocated_amount. concentrators: id, contract_label, area_name, work_order_number.' },
        description: { type: 'string', description: 'What you are looking up and why' }
      },
      required: ['sql', 'description']
    }
  },
  {
    name: 'create_budget',
    description: 'Create a budget for a parent project. A budget represents an external funding source (e.g. "RUS 217 Reconnect 3") with allocated amounts per job code.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'UUID of the parent project this budget is for' },
        name: { type: 'string', description: 'Budget name, e.g. "RUS 217 Reconnect 3"' },
        notes: { type: 'string' }
      },
      required: ['project_id', 'name']
    }
  },
  {
    name: 'create_budget_code',
    description: 'Add a job/contract code to a budget with its allocated dollar amount. Each code represents a category of work that draws from the budget.',
    input_schema: {
      type: 'object',
      properties: {
        budget_id: { type: 'string', description: 'UUID of the budget' },
        code: { type: 'string', description: 'Code name, e.g. "Inspection", "Resident Engineer", "Permitting", "Design"' },
        description: { type: 'string', description: 'Optional description of this code' },
        allocated_amount: { type: 'number', description: 'Dollar amount allocated to this code' }
      },
      required: ['budget_id', 'code', 'allocated_amount']
    }
  },
  {
    name: 'update_budget_code',
    description: 'Update an existing budget code (change allocation amount, name, etc).',
    input_schema: {
      type: 'object',
      properties: {
        budget_code_id: { type: 'string', description: 'UUID of the budget code to update' },
        code: { type: 'string' },
        description: { type: 'string' },
        allocated_amount: { type: 'number' }
      },
      required: ['budget_code_id']
    }
  },
  {
    name: 'get_upload_data',
    description: 'Fetch rows from an uploaded Excel/CSV file. The file is stored server-side by upload_id. Fetch in batches of up to 50 rows at a time. Start with offset 0 and increase by the batch size to page through. Use this to read the actual data after the user uploads a file.',
    input_schema: {
      type: 'object',
      properties: {
        upload_id: { type: 'string', description: 'The upload_id from the uploaded file context' },
        offset: { type: 'number', description: 'Row offset to start from (default 0)', default: 0 },
        limit: { type: 'number', description: 'Number of rows to fetch (default 50, max 100)', default: 50 }
      },
      required: ['upload_id']
    }
  }
];

// ─── TOOL EXECUTION ──────────────────────────────────────────────────────────
async function executeTool(toolName, toolInput) {
  try {
    switch (toolName) {
      case 'create_project': {
        const fin = calcProjectFinancials(toolInput.project_type, toolInput.billing_rate, toolInput.footage);
        const { rows } = await pool.query(`
          INSERT INTO projects (
            name, client_id, contract_id, work_order_number,
            project_type, status, billing_type, billing_rate,
            footage, miles, expected_hours, expected_revenue,
            start_date, notes, parent_id, budget_code_id, concentrator_id
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
          RETURNING *
        `, [
          toolInput.name,
          toolInput.client_id,
          toolInput.contract_id || null,
          toolInput.work_order_number || null,
          toolInput.project_type,
          toolInput.status || 'active',
          toolInput.billing_type,
          toolInput.billing_rate,
          toolInput.footage || null,
          fin.miles,
          fin.expectedHours,
          fin.expectedRevenue,
          toolInput.start_date || null,
          toolInput.notes || null,
          toolInput.parent_id || null,
          toolInput.budget_code_id || null,
          toolInput.concentrator_id || null
        ]);
        if (toolInput.project_type === 'permitting') {
          await pool.query(
            'INSERT INTO permit_stages (project_id, stage) VALUES ($1,$2) ON CONFLICT DO NOTHING',
            [rows[0].id, 'potential']
          );
        }
        return { success: true, project: rows[0] };
      }

      case 'update_project': {
        // First fetch the existing project
        const { rows: existing } = await pool.query('SELECT * FROM projects WHERE id=$1', [toolInput.project_id]);
        if (!existing.length) return { success: false, error: 'Project not found' };
        const p = existing[0];

        // Merge updates with existing values
        const name = toolInput.name ?? p.name;
        const client_id = toolInput.client_id ?? p.client_id;
        const contract_id = toolInput.contract_id ?? p.contract_id;
        const work_order_number = toolInput.work_order_number ?? p.work_order_number;
        const project_type = toolInput.project_type ?? p.project_type;
        const status = toolInput.status ?? p.status;
        const billing_type = toolInput.billing_type ?? p.billing_type;
        const billing_rate = toolInput.billing_rate ?? p.billing_rate;
        const footage = toolInput.footage ?? p.footage;
        const start_date = toolInput.start_date ?? p.start_date;
        const completed_date = toolInput.completed_date ?? p.completed_date;
        const notes = toolInput.notes !== undefined ? toolInput.notes : p.notes;
        const parent_id = toolInput.parent_id !== undefined ? toolInput.parent_id : p.parent_id;
        const budget_code_id = toolInput.budget_code_id !== undefined ? toolInput.budget_code_id : p.budget_code_id;
        const concentrator_id = toolInput.concentrator_id !== undefined ? toolInput.concentrator_id : p.concentrator_id;

        const fin = calcProjectFinancials(project_type, billing_rate, footage);
        const { rows } = await pool.query(`
          UPDATE projects SET
            name=$1, client_id=$2, contract_id=$3, work_order_number=$4,
            project_type=$5, status=$6, billing_type=$7, billing_rate=$8,
            footage=$9, miles=$10, expected_hours=$11, expected_revenue=$12,
            start_date=$13, completed_date=$14, notes=$15, parent_id=$16, budget_code_id=$17, concentrator_id=$18
          WHERE id=$19 RETURNING *
        `, [
          name, client_id, contract_id, work_order_number,
          project_type, status, billing_type, billing_rate,
          footage, fin.miles, fin.expectedHours, fin.expectedRevenue,
          start_date, completed_date, notes, parent_id || null, budget_code_id || null, concentrator_id || null,
          toolInput.project_id
        ]);
        return { success: true, project: rows[0] };
      }

      case 'delete_project': {
        const { rows } = await pool.query('DELETE FROM projects WHERE id=$1 RETURNING name', [toolInput.project_id]);
        if (!rows.length) return { success: false, error: 'Project not found' };
        return { success: true, deleted: rows[0].name };
      }

      case 'create_client': {
        const { rows } = await pool.query(
          'INSERT INTO clients (name, is_rus, notes) VALUES ($1,$2,$3) RETURNING *',
          [toolInput.name, toolInput.is_rus || false, toolInput.notes || null]
        );
        return { success: true, client: rows[0] };
      }

      case 'create_staff': {
        const { rows } = await pool.query(
          'INSERT INTO staff (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET active=true RETURNING *',
          [toolInput.name]
        );
        return { success: true, staff: rows[0] };
      }

      case 'create_contract': {
        const { rows } = await pool.query(
          'INSERT INTO contracts (client_id, contract_number, name) VALUES ($1,$2,$3) RETURNING *',
          [toolInput.client_id, toolInput.contract_number, toolInput.name || null]
        );
        return { success: true, contract: rows[0] };
      }

      case 'log_time_entries': {
        const importBatch = `ai_import_${Date.now()}`;
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          let count = 0;
          for (const e of toolInput.entries) {
            await client.query(
              'INSERT INTO time_entries (project_id, staff_id, entry_date, hours, job_title, import_batch) VALUES ($1,$2,$3,$4,$5,$6)',
              [e.project_id, e.staff_id || null, e.entry_date, e.hours, e.job_title || null, importBatch]
            );
            count++;
          }
          // Update actual_hours for affected projects
          const projectIds = [...new Set(toolInput.entries.map(e => e.project_id))];
          for (const pid of projectIds) {
            await client.query(
              'UPDATE projects SET actual_hours = (SELECT COALESCE(SUM(hours),0) FROM time_entries WHERE project_id=$1) WHERE id=$1',
              [pid]
            );
          }
          await client.query('COMMIT');
          return { success: true, inserted: count, batch: importBatch };
        } catch (err) {
          await client.query('ROLLBACK');
          return { success: false, error: 'Bulk insert failed and was rolled back: ' + err.message };
        } finally {
          client.release();
        }
      }

      case 'update_project_status': {
        let query, params;
        if (toolInput.status === 'billed') {
          query = `UPDATE projects SET status='billed', billed_date=NOW() WHERE id=$1 RETURNING name, status`;
          params = [toolInput.project_id];
        } else if (toolInput.status === 'completed') {
          query = `UPDATE projects SET status='completed', completed_date=COALESCE(completed_date, NOW()) WHERE id=$1 RETURNING name, status`;
          params = [toolInput.project_id];
        } else {
          query = `UPDATE projects SET status=$1 WHERE id=$2 RETURNING name, status`;
          params = [toolInput.status, toolInput.project_id];
        }
        const { rows } = await pool.query(query, params);
        if (!rows.length) return { success: false, error: 'Project not found' };
        return { success: true, project: rows[0] };
      }

      case 'advance_permit_stage': {
        const STAGES = ['potential','started','submitted','approved','checklist','billed'];
        const { rows: current } = await pool.query(
          'SELECT stage FROM permit_stages WHERE project_id=$1 AND completed_at IS NULL ORDER BY created_at LIMIT 1',
          [toolInput.project_id]
        );
        const currentStage = current[0]?.stage || 'potential';
        const nextIdx = STAGES.indexOf(currentStage) + 1;
        if (nextIdx >= STAGES.length) return { success: false, message: 'Already at final stage' };
        const nextStage = STAGES[nextIdx];
        await pool.query(
          'UPDATE permit_stages SET completed_at=NOW(), updated_by=$1, notes=$2 WHERE project_id=$3 AND stage=$4',
          [toolInput.updated_by || 'AI', toolInput.notes || null, toolInput.project_id, currentStage]
        );
        await pool.query(
          'INSERT INTO permit_stages (project_id, stage, updated_by) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING',
          [toolInput.project_id, nextStage, toolInput.updated_by || 'AI']
        );
        return { success: true, previous: currentStage, current: nextStage };
      }

      case 'query_database': {
        // Safety: only allow SELECT queries
        const sqlClean = toolInput.sql.trim().replace(/;+$/, '');
        const firstWord = sqlClean.split(/\s+/)[0].toUpperCase();
        if (firstWord !== 'SELECT' && firstWord !== 'WITH') {
          return { success: false, error: 'Only SELECT queries are allowed. Use the specific action tools for modifications.' };
        }
        // Extra safety: reject dangerous keywords
        const upper = sqlClean.toUpperCase();
        if (/\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|GRANT|REVOKE)\b/.test(upper)) {
          return { success: false, error: 'Modifying queries are not allowed through query_database. Use the specific tools instead.' };
        }
        const { rows } = await pool.query(sqlClean);
        return { success: true, row_count: rows.length, rows: rows.slice(0, 100) };
      }

      case 'create_budget': {
        const { rows } = await pool.query(
          `INSERT INTO budgets (project_id, name, notes) VALUES ($1,$2,$3) RETURNING *`,
          [toolInput.project_id, toolInput.name, toolInput.notes || null]
        );
        return { success: true, budget: rows[0] };
      }

      case 'create_budget_code': {
        const { rows } = await pool.query(
          `INSERT INTO budget_codes (budget_id, code, description, allocated_amount) VALUES ($1,$2,$3,$4) RETURNING *`,
          [toolInput.budget_id, toolInput.code, toolInput.description || null, toolInput.allocated_amount || 0]
        );
        // Recalculate budget total
        await pool.query(
          `UPDATE budgets SET total_amount = (SELECT COALESCE(SUM(allocated_amount),0) FROM budget_codes WHERE budget_id=$1) WHERE id=$1`,
          [toolInput.budget_id]
        );
        return { success: true, budget_code: rows[0] };
      }

      case 'update_budget_code': {
        const { rows: existing } = await pool.query('SELECT * FROM budget_codes WHERE id=$1', [toolInput.budget_code_id]);
        if (!existing.length) return { success: false, error: 'Budget code not found' };
        const bc = existing[0];
        const code = toolInput.code ?? bc.code;
        const description = toolInput.description !== undefined ? toolInput.description : bc.description;
        const allocated_amount = toolInput.allocated_amount ?? bc.allocated_amount;
        const { rows } = await pool.query(
          `UPDATE budget_codes SET code=$1, description=$2, allocated_amount=$3 WHERE id=$4 RETURNING *`,
          [code, description, allocated_amount, toolInput.budget_code_id]
        );
        // Recalculate budget total
        await pool.query(
          `UPDATE budgets SET total_amount = (SELECT COALESCE(SUM(allocated_amount),0) FROM budget_codes WHERE budget_id=$1) WHERE id=$1`,
          [rows[0].budget_id]
        );
        return { success: true, budget_code: rows[0] };
      }

      case 'get_upload_data': {
        const data = uploadStore.get(toolInput.upload_id);
        if (!data) return { success: false, error: 'Upload expired or not found. Ask the user to re-upload.' };
        if (data.raw_text) return { success: true, raw_text: data.raw_text, row_count: 0 };

        const offset = toolInput.offset || 0;
        const limit = Math.min(toolInput.limit || 50, 100);
        const slice = data.rows.slice(offset, offset + limit);

        return {
          success: true,
          filename: data.filename,
          headers: data.headers,
          total_rows: data.rows.length,
          offset,
          returned: slice.length,
          has_more: offset + limit < data.rows.length,
          rows: slice
        };
      }

      default:
        return { success: false, error: 'Unknown tool: ' + toolName };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ─── FILE UPLOAD FOR AI ──────────────────────────────────────────────────────
// ─── IN-MEMORY UPLOAD STORE ──────────────────────────────────────────────────
const uploadStore = new Map(); // uploadId → { rows, headers, filename, timestamp }
// Clean up old uploads every 30 minutes
setInterval(() => {
  const cutoff = Date.now() - 30 * 60 * 1000;
  for (const [id, data] of uploadStore) {
    if (data.timestamp < cutoff) uploadStore.delete(id);
  }
}, 5 * 60 * 1000);

app.post('/api/ai/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const ext = path.extname(req.file.originalname).toLowerCase();
    let rows = [];
    let headers = [];

    if (ext === '.xlsx' || ext === '.xls') {
      const workbook = XLSX.readFile(req.file.path);
      const sheetNames = workbook.SheetNames;

      for (const sheetName of sheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        if (jsonData.length > 0 && rows.length === 0) {
          rows = jsonData;
          headers = Object.keys(jsonData[0] || {});
        }
      }

    } else if (ext === '.csv' || ext === '.tsv') {
      const content = fs.readFileSync(req.file.path, 'utf8');
      const workbook = XLSX.read(content, { type: 'string' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      headers = Object.keys(rows[0] || {});

    } else {
      const content = fs.readFileSync(req.file.path, 'utf8');
      const uploadId = uuidv4();
      uploadStore.set(uploadId, { raw_text: content.substring(0, 50000), filename: req.file.originalname, timestamp: Date.now() });
      fs.unlink(req.file.path, () => {});
      return res.json({ success: true, upload_id: uploadId, filename: req.file.originalname, raw_text: content.substring(0, 2000) });
    }

    // Store full data server-side, send only summary to client
    const uploadId = uuidv4();
    uploadStore.set(uploadId, { rows, headers, filename: req.file.originalname, timestamp: Date.now() });

    fs.unlink(req.file.path, () => {});

    res.json({
      success: true,
      upload_id: uploadId,
      filename: req.file.originalname,
      headers,
      row_count: rows.length,
      preview: rows.slice(0, 5) // Only 5 sample rows sent to client
    });

  } catch (e) {
    console.error('File parse error:', e.message);
    res.status(500).json({ error: 'Failed to parse file: ' + e.message });
  }
});

// AI fetches rows in batches from stored upload
app.get('/api/ai/upload/:id', async (req, res) => {
  const data = uploadStore.get(req.params.id);
  if (!data) return res.status(404).json({ error: 'Upload expired or not found' });
  if (data.raw_text) return res.json({ rows: [], raw_text: data.raw_text, row_count: 0 });

  const offset = parseInt(req.query.offset) || 0;
  const limit = Math.min(parseInt(req.query.limit) || 50, 100); // Max 100 rows per batch
  const slice = data.rows.slice(offset, offset + limit);

  res.json({
    filename: data.filename,
    headers: data.headers,
    total_rows: data.rows.length,
    offset,
    limit,
    returned: slice.length,
    has_more: offset + limit < data.rows.length,
    rows: slice
  });
});

// ─── AI CHAT ENDPOINT ────────────────────────────────────────────────────────
app.post('/api/ai/chat', async (req, res) => {
  const { messages, session_id } = req.body;
  if (!messages || !messages.length) return res.status(400).json({ error: 'No messages' });

  try {
    const ctx = await getDBContext();

    // Split system prompt into static rules + dynamic DB context, cache both.
    // Static block changes only when SYSTEM_PROMPT does. DB context block is identical
    // across all iterations within a single chat request, so it caches perfectly.
    const [staticPromptPart] = SYSTEM_PROMPT.split('{CONTEXT}');
    const systemBlocks = [
      {
        type: 'text',
        text: staticPromptPart,
        cache_control: { type: 'ephemeral' }
      },
      {
        type: 'text',
        text: JSON.stringify(ctx, null, 2),
        cache_control: { type: 'ephemeral' }
      }
    ];

    // Cache all 14 tool definitions in one breakpoint by marking the last one.
    const cachedTools = AI_TOOLS.map((t, i) =>
      i === AI_TOOLS.length - 1 ? { ...t, cache_control: { type: 'ephemeral' } } : t
    );

    let response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemBlocks,
      tools: cachedTools,
      tool_choice: { type: 'auto' },
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    });

    let finalText = '';
    let toolResults = [];
    let conversationMessages = [...messages.map(m => ({ role: m.role, content: m.content }))];

    // Handle tool use in a loop (Claude may chain multiple tools)
    let iterations = 0;
    const MAX_ITERATIONS = 10;

    while (response.stop_reason === 'tool_use' && iterations < MAX_ITERATIONS) {
      iterations++;
      const toolUseBlocks = response.content.filter(b => b.type === 'tool_use');
      const textBlocks = response.content.filter(b => b.type === 'text');
      for (const tb of textBlocks) {
        if (tb.text.trim()) finalText += tb.text + '\n';
      }

      const toolResultContents = [];
      for (const toolUseBlock of toolUseBlocks) {
        console.log(`AI Tool Call: ${toolUseBlock.name}`, JSON.stringify(toolUseBlock.input).substring(0, 200));
        const toolResult = await executeTool(toolUseBlock.name, toolUseBlock.input);
        console.log(`AI Tool Result: ${toolUseBlock.name}`, JSON.stringify(toolResult).substring(0, 200));
        toolResults.push({ tool: toolUseBlock.name, input: toolUseBlock.input, result: toolResult });
        toolResultContents.push({
          type: 'tool_result',
          tool_use_id: toolUseBlock.id,
          content: JSON.stringify(toolResult)
        });
      }

      // Continue conversation with tool results
      conversationMessages.push({ role: 'assistant', content: response.content });
      conversationMessages.push({ role: 'user', content: toolResultContents });

      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: systemBlocks,
        tools: cachedTools,
        tool_choice: { type: 'auto' },
        messages: conversationMessages
      });
    }

    // Get final text response
    const lastTextBlocks = response.content.filter(b => b.type === 'text');
    for (const tb of lastTextBlocks) {
      if (tb.text.trim()) finalText += tb.text;
    }

    // Log cache performance — helpful for verifying caching is reducing token spend.
    // cache_creation_input_tokens = first-time cache writes (full price + 25%)
    // cache_read_input_tokens = cache hits (10% of normal price, lower rate-limit weight)
    if (response.usage) {
      const u = response.usage;
      console.log(`AI usage — in:${u.input_tokens} out:${u.output_tokens} cache_write:${u.cache_creation_input_tokens || 0} cache_read:${u.cache_read_input_tokens || 0} iters:${iterations}`);
    }

    res.json({
      content: finalText.trim(),
      toolResults,
      usage: response.usage
    });

  } catch (e) {
    const msg = e?.message || e?.error?.message || 'Unknown error';
    console.error('AI error:', msg);
    console.error('  Status:', e?.status);
    console.error('  Type:', e?.constructor?.name);
    console.error('  Full:', JSON.stringify(e, Object.getOwnPropertyNames(e || {})));
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('  ANTHROPIC_API_KEY is NOT SET — add it in Railway Variables');
    }
    res.status(500).json({ error: msg || 'AI request failed — check server logs' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SPA FALLBACK
// ─────────────────────────────────────────────────────────────────────────────

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─────────────────────────────────────────────────────────────────────────────
// START
// ─────────────────────────────────────────────────────────────────────────────

async function start() {
  await initSchema();
  app.listen(PORT, () => console.log(`✓ Launch Fiber Services running on port ${PORT}`));
}

start().catch(console.error);
