require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Anthropic = require('@anthropic-ai/sdk');
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
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOAD_DIR));

// ─── Anthropic client ─────────────────────────────────────────────────────────
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
        COALESCE(SUM(te.hours),0) as logged_hours
      FROM projects p
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN contracts co ON co.id = p.contract_id
      LEFT JOIN time_entries te ON te.project_id = p.id
      ${whereStr}
      GROUP BY p.id, cl.name, co.contract_number, co.name
      ORDER BY p.created_at DESC
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
        co.name as contract_name
      FROM projects p
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN contracts co ON co.id = p.contract_id
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
    footage, start_date, notes
  } = req.body;

  try {
    const fin = calcProjectFinancials(project_type, billing_rate, footage);

    const { rows } = await pool.query(`
      INSERT INTO projects (
        name, client_id, contract_id, work_order_number,
        project_type, status, billing_type, billing_rate,
        footage, miles, expected_hours, expected_revenue,
        start_date, notes
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *
    `, [
      name, client_id, contract_id || null, work_order_number,
      project_type, status, billing_type, billing_rate,
      footage || null, fin.miles, fin.expectedHours, fin.expectedRevenue,
      start_date || null, notes
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
    footage, start_date, completed_date, billed_date, notes
  } = req.body;

  try {
    const fin = calcProjectFinancials(project_type, billing_rate, footage);
    const { rows } = await pool.query(`
      UPDATE projects SET
        name=$1, client_id=$2, contract_id=$3, work_order_number=$4,
        project_type=$5, status=$6, billing_type=$7, billing_rate=$8,
        footage=$9, miles=$10, expected_hours=$11, expected_revenue=$12,
        start_date=$13, completed_date=$14, billed_date=$15, notes=$16
      WHERE id=$17 RETURNING *
    `, [
      name, client_id, contract_id || null, work_order_number,
      project_type, status, billing_type, billing_rate,
      footage || null, fin.miles, fin.expectedHours, fin.expectedRevenue,
      start_date || null, completed_date || null, billed_date || null, notes,
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
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const yearStart = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];

    const [activeR, unbilledR, monthHrsR, ytdRevR, recentR, alertR] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM projects WHERE status='active'`),
      pool.query(`SELECT COUNT(*), COALESCE(SUM(expected_revenue),0) as total FROM projects WHERE status='completed' AND billed_date IS NULL`),
      pool.query(`SELECT COALESCE(SUM(hours),0) as hours FROM time_entries WHERE entry_date >= $1`, [monthStart]),
      pool.query(`SELECT COALESCE(SUM(actual_revenue + CASE WHEN billing_type='hourly' THEN actual_hours*billing_rate ELSE 0 END),0) as rev FROM projects WHERE billed_date >= $1`, [yearStart]),
      pool.query(`
        SELECT p.id, p.name, p.project_type, p.status, p.work_order_number,
               cl.name as client_name, p.expected_hours, p.actual_hours,
               p.expected_revenue, p.created_at
        FROM projects p
        LEFT JOIN clients cl ON cl.id=p.client_id
        WHERE p.status='active'
        ORDER BY p.created_at DESC LIMIT 10
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
      month_hours: parseFloat(monthHrsR.rows[0].hours),
      ytd_revenue: parseFloat(ytdRevR.rows[0].rev),
      recent_projects: recentR.rows,
      unbilled_projects: alertR.rows
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────────────────────────────────────
// REVENUE
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/revenue/by-client', async (req, res) => {
  const { year } = req.query;
  const yearFilter = year || new Date().getFullYear();
  try {
    const { rows } = await pool.query(`
      SELECT
        cl.id as client_id,
        cl.name as client_name,
        COUNT(DISTINCT p.id) as project_count,
        COALESCE(SUM(p.expected_revenue),0) as expected_total,
        COALESCE(SUM(
          CASE p.billing_type
            WHEN 'footage' THEN p.expected_revenue
            WHEN 'hourly' THEN p.actual_hours * p.billing_rate
          END
        ),0) as earned_total,
        COALESCE(SUM(CASE WHEN p.billed_date IS NOT NULL THEN p.expected_revenue ELSE 0 END),0) as billed_total
      FROM clients cl
      LEFT JOIN projects p ON p.client_id = cl.id
        AND (EXTRACT(YEAR FROM p.start_date) = $1 OR p.start_date IS NULL)
      GROUP BY cl.id, cl.name
      ORDER BY earned_total DESC
    `, [yearFilter]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/revenue/by-month', async (req, res) => {
  const { year } = req.query;
  const yearFilter = year || new Date().getFullYear();
  try {
    const { rows } = await pool.query(`
      SELECT
        EXTRACT(MONTH FROM te.entry_date) as month,
        EXTRACT(YEAR FROM te.entry_date) as year,
        COALESCE(SUM(te.hours),0) as total_hours,
        cl.name as client_name,
        p.project_type,
        COALESCE(SUM(te.hours * p.billing_rate),0) as revenue
      FROM time_entries te
      JOIN projects p ON p.id = te.project_id
      JOIN clients cl ON cl.id = p.client_id
      WHERE EXTRACT(YEAR FROM te.entry_date) = $1
        AND p.billing_type = 'hourly'
      GROUP BY month, year, cl.name, p.project_type
      ORDER BY year, month
    `, [yearFilter]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/revenue/unbilled', async (req, res) => {
  const { month, year } = req.query;
  let where = `p.billed_date IS NULL`;
  let params = [];
  if (month && year) {
    where += ` AND EXTRACT(MONTH FROM p.completed_date)=$1 AND EXTRACT(YEAR FROM p.completed_date)=$2`;
    params = [month, year];
  } else {
    where += ` AND p.status = 'completed'`;
  }
  try {
    const { rows } = await pool.query(`
      SELECT p.*,
        cl.name as client_name,
        co.contract_number,
        COALESCE(SUM(te.hours),0) as logged_hours
      FROM projects p
      LEFT JOIN clients cl ON cl.id = p.client_id
      LEFT JOIN contracts co ON co.id = p.contract_id
      LEFT JOIN time_entries te ON te.project_id = p.id
      WHERE ${where}
      GROUP BY p.id, cl.name, co.contract_number
      ORDER BY cl.name, p.project_type, p.completed_date
    `, params);
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
// AI CHAT
// ─────────────────────────────────────────────────────────────────────────────

async function getDBContext() {
  const [clients, projects, staff, contracts] = await Promise.all([
    pool.query('SELECT id, name, is_rus FROM clients ORDER BY name'),
    pool.query(`
      SELECT p.id, p.name, p.project_type, p.status, p.work_order_number,
             p.billing_type, p.billing_rate, p.footage, p.miles,
             p.expected_hours, p.expected_revenue, p.actual_hours,
             cl.name as client_name, co.contract_number
      FROM projects p
      LEFT JOIN clients cl ON cl.id=p.client_id
      LEFT JOIN contracts co ON co.id=p.contract_id
      WHERE p.status != 'billed'
      ORDER BY p.created_at DESC LIMIT 50
    `),
    pool.query('SELECT id, name FROM staff WHERE active=true ORDER BY name'),
    pool.query('SELECT c.*, cl.name as client_name FROM contracts c JOIN clients cl ON cl.id=c.client_id ORDER BY cl.name, c.contract_number')
  ]);
  return { clients: clients.rows, projects: projects.rows, staff: staff.rows, contracts: contracts.rows };
}

const SYSTEM_PROMPT = `You are the AI project manager for Launch Fiber Services, a fiber optic infrastructure company in Macon, Georgia.

RATE STRUCTURE:
- Inspection: $90/hr (RUS work only, PSC client)
- Resident Engineer (RE): $100/hr (RUS/PSC only)
- Permitting: $90/hr billed at 27.5 hours/mile (15 hour minimum)
- Design: VARIABLE - always ask for billing rate
- Other: VARIABLE - always ask for billing rate

CLIENTS: PSC (RUS - Contracts 3, 4, 5), COX, IFT, TRI-CO
RUS work is PSC only. Each contract has individual work orders.

RULES:
1. Always confirm the billing rate before creating any project - ask even for standard rates.
2. For permitting projects, calculate billing from footage automatically.
3. For CSV workforce imports, match work order numbers to existing projects.
4. Always summarize what you are about to do and ask the user to confirm before calling any tool.
5. When the user confirms (says yes, ok, looks good, correct, etc.) - call the appropriate tool immediately.
6. Use the DATABASE CONTEXT to find correct UUIDs for client_id and contract_id.

DATABASE CONTEXT:
{CONTEXT}`;

// Tool definitions for Claude to use
const AI_TOOLS = [
  {
    name: 'create_project',
    description: 'Create a new project in the database. Only call this after the user has confirmed the project details.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Project name' },
        client_id: { type: 'string', description: 'Client UUID from database context' },
        contract_id: { type: 'string', description: 'Contract UUID from database context (optional)' },
        work_order_number: { type: 'string', description: 'Work order number' },
        project_type: { type: 'string', enum: ['inspection', 're', 'permitting', 'design', 'other'] },
        billing_type: { type: 'string', enum: ['hourly', 'footage'] },
        billing_rate: { type: 'number', description: 'Hourly rate in dollars' },
        footage: { type: 'number', description: 'Linear footage (permitting projects only)' },
        status: { type: 'string', enum: ['active', 'completed', 'on_hold'], default: 'active' },
        notes: { type: 'string' }
      },
      required: ['name', 'client_id', 'project_type', 'billing_type', 'billing_rate']
    }
  },
  {
    name: 'log_time_entries',
    description: 'Log time entries for one or more projects. Only call after user confirms.',
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
    name: 'mark_project_billed',
    description: 'Mark a project as billed. Only call after user confirms.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'Project UUID' }
      },
      required: ['project_id']
    }
  },
  {
    name: 'advance_permit_stage',
    description: 'Advance a permitting project to the next stage.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string' },
        updated_by: { type: 'string' }
      },
      required: ['project_id']
    }
  }
];

async function executeTool(toolName, toolInput) {
  switch (toolName) {
    case 'create_project': {
      const fin = calcProjectFinancials(toolInput.project_type, toolInput.billing_rate, toolInput.footage);
      const { rows } = await pool.query(`
        INSERT INTO projects (
          name, client_id, contract_id, work_order_number,
          project_type, status, billing_type, billing_rate,
          footage, miles, expected_hours, expected_revenue,
          notes
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
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
        toolInput.notes || null
      ]);
      if (toolInput.project_type === 'permitting') {
        await pool.query(
          'INSERT INTO permit_stages (project_id, stage) VALUES ($1,$2) ON CONFLICT DO NOTHING',
          [rows[0].id, 'potential']
        );
      }
      return { success: true, project: rows[0] };
    }
    case 'log_time_entries': {
      const result = await pool.query(
        'SELECT 1'
      );
      const importBatch = `ai_import_${Date.now()}`;
      let count = 0;
      for (const e of toolInput.entries) {
        await pool.query(
          'INSERT INTO time_entries (project_id, staff_id, entry_date, hours, job_title, import_batch) VALUES ($1,$2,$3,$4,$5,$6)',
          [e.project_id, e.staff_id || null, e.entry_date, e.hours, e.job_title || null, importBatch]
        );
        count++;
      }
      const projectIds = [...new Set(toolInput.entries.map(e => e.project_id))];
      for (const pid of projectIds) {
        await pool.query(
          'UPDATE projects SET actual_hours = (SELECT COALESCE(SUM(hours),0) FROM time_entries WHERE project_id=$1) WHERE id=$1',
          [pid]
        );
      }
      return { success: true, inserted: count };
    }
    case 'mark_project_billed': {
      const { rows } = await pool.query(
        "UPDATE projects SET billed_date=NOW(), status='billed' WHERE id=$1 RETURNING name",
        [toolInput.project_id]
      );
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
        'UPDATE permit_stages SET completed_at=NOW(), updated_by=$1 WHERE project_id=$2 AND stage=$3',
        [toolInput.updated_by || 'AI', toolInput.project_id, currentStage]
      );
      await pool.query(
        'INSERT INTO permit_stages (project_id, stage, updated_by) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING',
        [toolInput.project_id, nextStage, toolInput.updated_by || 'AI']
      );
      return { success: true, previous: currentStage, current: nextStage };
    }
    default:
      return { success: false, error: 'Unknown tool' };
  }
}

// Detect if user message is a simple confirmation
function isConfirmation(msg) {
  const confirmWords = ['yes','yep','yeah','correct','ok','okay','confirm','looks good','that's right','right','sure','go ahead','do it','create it','save it','add it','approved','affirmative','yup','y'];
  const lower = (msg || '').toLowerCase().trim().replace(/[.!]/g,'');
  return confirmWords.includes(lower) || lower.length < 15 && confirmWords.some(w => lower.includes(w));
}

app.post('/api/ai/chat', async (req, res) => {
  const { messages, session_id } = req.body;
  if (!messages || !messages.length) return res.status(400).json({ error: 'No messages' });

  try {
    const ctx = await getDBContext();
    const systemPrompt = SYSTEM_PROMPT.replace('{CONTEXT}', JSON.stringify(ctx, null, 2));

    const lastUserMsg = messages[messages.length - 1]?.content || '';
    const userConfirming = isConfirmation(lastUserMsg);

    // If user is confirming, force tool use so Claude actually executes instead of just talking
    const toolChoice = userConfirming ? { type: 'any' } : { type: 'auto' };

    let response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: systemPrompt,
      tools: AI_TOOLS,
      tool_choice: toolChoice,
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    });

    let finalText = '';
    let toolResults = [];

    // Handle tool use in a loop
    while (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(b => b.type === 'tool_use');
      const textBlock = response.content.find(b => b.type === 'text');
      if (textBlock) finalText += textBlock.text + '\n';

      const toolResultContents = [];
      for (const toolUseBlock of toolUseBlocks) {
        const toolResult = await executeTool(toolUseBlock.name, toolUseBlock.input);
        toolResults.push({ tool: toolUseBlock.name, result: toolResult });
        toolResultContents.push({
          type: 'tool_result',
          tool_use_id: toolUseBlock.id,
          content: JSON.stringify(toolResult)
        });
      }

      // Continue conversation with tool results
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        tools: AI_TOOLS,
        messages: [
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'assistant', content: response.content },
          { role: 'user', content: toolResultContents }
        ]
      });
    }

    // Get final text response
    const lastText = response.content.find(b => b.type === 'text');
    if (lastText) finalText += lastText.text;

    res.json({
      content: finalText.trim(),
      toolResults,
      usage: response.usage
    });

  } catch (e) {
    const msg = e?.message || e?.error?.message || JSON.stringify(e) || 'Unknown error';
    console.error('AI error:', msg, e?.status);
    res.status(500).json({ error: msg });
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
