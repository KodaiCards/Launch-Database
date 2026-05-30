// Browser smoke test — Phase B2b: permitting portal project-create cascade picker.
//
// Validates the 4-level cascade (Client -> Program -> SA -> Job) inside the
// project-create modal of permitting.html. The cascade replaces the old flat
// #proj-existing dropdown and resolves/creates leaf projects via
// POST /api/projects/resolve-or-create.
//
// Tests that require a live database skip automatically when no
// DATABASE_URL / TEST_DATABASE_URL is set in env.

const { test, expect } = require('@playwright/test');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test_admin_password_123';
const HAS_DB = !!(process.env.TEST_DATABASE_URL || process.env.DATABASE_URL);

// ---------------------------------------------------------------------------
// Login helper
// ---------------------------------------------------------------------------
async function login(page) {
  await page.goto('/login');
  await page.fill('#username', ADMIN_USERNAME);
  await page.fill('#password', ADMIN_PASSWORD);
  await page.click('#submit-btn');
  await page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 15_000 });
}

// Open the project-create modal and navigate to the permitting portal.
async function openCreateModal(page) {
  await page.goto('/permitting');
  // Click the "Add Project" button to open the modal in create mode.
  const addBtn = page.locator('button:has-text("Add Project"), [onclick*="openProjectModal"]').first();
  await addBtn.waitFor({ timeout: 10_000 });
  await addBtn.click();
  await page.waitForSelector('#project-modal', { state: 'visible', timeout: 8_000 });
}

// ---------------------------------------------------------------------------
// Test 1: DOM structure — cascade elements exist in create modal
// ---------------------------------------------------------------------------
test('project-create modal has cascade picker elements', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', err => {
    pageErrors.push(err);
    console.error('[browser:pageerror]', err.message);
  });

  await login(page);
  await openCreateModal(page);

  // Cascade wrapper should be visible in create mode.
  await expect(page.locator('#pp-cascade-wrap')).toBeVisible({ timeout: 5_000 });

  // All four cascade elements present.
  await expect(page.locator('#proj-client')).toHaveCount(1);
  await expect(page.locator('#pp-prog-sel')).toHaveCount(1);
  await expect(page.locator('#pp-service-area')).toHaveCount(1);
  await expect(page.locator('#pp-job-select')).toHaveCount(1);
  // Datalist for SA + inline error div present (post-W212B cascade refactor:
  // #pp-cascade-submit no longer exists — the standard saveProject() button
  // handles validation + submission).
  await expect(page.locator('#pp-sa-list')).toHaveCount(1);
  await expect(page.locator('#pp-cascade-error')).toHaveCount(1);

  // Program and SA start disabled.
  await expect(page.locator('#pp-prog-sel')).toBeDisabled();
  await expect(page.locator('#pp-service-area')).toBeDisabled();
  await expect(page.locator('#pp-job-select')).toBeDisabled();

  expect(pageErrors.map(e => e.message)).toEqual([]);
});

// ---------------------------------------------------------------------------
// Test 2: cascade wrapper hidden in edit mode
// ---------------------------------------------------------------------------
test('cascade wrapper is hidden in edit mode', async ({ page }) => {
  if (!HAS_DB) test.skip('Requires DATABASE_URL');

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err));

  await login(page);
  await page.goto('/permitting');

  // If there are projects, clicking edit should open modal without cascade.
  const editBtn = page.locator('[onclick*="editProject"]').first();
  if (await editBtn.count() === 0) {
    test.skip('No projects in DB to test edit mode');
    return;
  }
  await editBtn.click();
  await page.waitForSelector('#project-modal', { state: 'visible', timeout: 8_000 });

  // Cascade should be hidden when proj-id is set (edit mode).
  const cascadeWrap = page.locator('#pp-cascade-wrap');
  await expect(cascadeWrap).toBeHidden({ timeout: 3_000 });

  expect(pageErrors.map(e => e.message)).toEqual([]);
});

// ---------------------------------------------------------------------------
// Test 3: old flat #proj-existing dropdown is gone
// ---------------------------------------------------------------------------
test('old flat proj-existing dropdown is removed', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err));

  await login(page);
  await openCreateModal(page);

  // The old dropdown should not exist.
  await expect(page.locator('#proj-existing')).toHaveCount(0);
  await expect(page.locator('#proj-existing-wrap')).toHaveCount(0);

  expect(pageErrors.map(e => e.message)).toEqual([]);
});

// ---------------------------------------------------------------------------
// DB-required fixtures
// ---------------------------------------------------------------------------
let fixtures = null;
const { Pool } = require('pg');

async function seedFixtures() {
  if (!HAS_DB) return null;
  const pool = new Pool({
    connectionString: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
  });
  const tag = `pptest${Date.now().toString(36)}`;

  const { rows: [client] } = await pool.query(
    `INSERT INTO clients (name) VALUES ($1) RETURNING id, name`,
    [`PPCascadeTest-${tag}`]
  );
  const { rows: [ec] } = await pool.query(
    `INSERT INTO engineering_contracts (client_id, program, name)
     VALUES ($1, 'rus', $2) RETURNING id`,
    [client.id, `EC-RUS-${tag}`]
  );
  const { rows: [sa] } = await pool.query(
    `INSERT INTO ec_service_areas (engineering_contract_id, name)
     VALUES ($1, $2) RETURNING id`,
    [ec.id, `SA-${tag}`]
  );
  // SA folder project row (resolve-or-create expects rollup_key = sa.id).
  const { rows: [saFolder] } = await pool.query(
    `INSERT INTO projects (name, client_id, engineering_contract_id, program,
       is_rollup, rollup_level, rollup_key)
     VALUES ($1, $2, $3, 'rus', true, 'service_area', $4) RETURNING id`,
    [`SA-${tag}`, client.id, ec.id, sa.id]
  );

  await pool.end();
  return { client, ec, sa, saFolder, tag };
}

async function cleanupFixtures(f) {
  if (!f) return;
  const pool = new Pool({
    connectionString: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
  });
  try {
    await pool.query(`DELETE FROM projects WHERE rollup_key = $1 OR parent_id IN (SELECT id FROM projects WHERE rollup_key = $1)`, [f.sa.id]);
    await pool.query(`DELETE FROM projects WHERE rollup_key = $1`, [f.sa.id]);
    await pool.query(`DELETE FROM ec_service_areas WHERE id = $1`, [f.sa.id]);
    await pool.query(`DELETE FROM engineering_contracts WHERE id = $1`, [f.ec.id]);
    await pool.query(`DELETE FROM clients WHERE id = $1`, [f.client.id]);
  } catch (e) {
    console.warn('[pp-cascade-cleanup]', e.message);
  }
  await pool.end();
}

test.beforeAll(async () => {
  if (HAS_DB) fixtures = await seedFixtures();
});

test.afterAll(async () => {
  if (fixtures) await cleanupFixtures(fixtures);
});

// ---------------------------------------------------------------------------
// Test 4: client select unlocks program
// ---------------------------------------------------------------------------
test('cascade: client selection unlocks program select', async ({ page }) => {
  if (!HAS_DB) test.skip('Requires DATABASE_URL');

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err));

  await login(page);
  await openCreateModal(page);

  await page.locator('#proj-client').selectOption({ label: fixtures.client.name });
  await page.waitForFunction(() => {
    const s = document.getElementById('pp-prog-sel');
    return s && !s.disabled && s.options.length > 1;
  }, { timeout: 8_000 });

  await expect(page.locator('#pp-prog-sel')).toBeEnabled();
  const opts = await page.locator('#pp-prog-sel option').allTextContents();
  expect(opts.some(t => t.toLowerCase().includes('rus'))).toBe(true);

  expect(pageErrors.map(e => e.message)).toEqual([]);
});

// ---------------------------------------------------------------------------
// Test 5: program selection unlocks SA and populates fixture SA
// ---------------------------------------------------------------------------
test('cascade: program selection populates service areas', async ({ page }) => {
  if (!HAS_DB) test.skip('Requires DATABASE_URL');

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err));

  await login(page);
  await openCreateModal(page);

  await page.locator('#proj-client').selectOption({ label: fixtures.client.name });
  await page.waitForFunction(() => !document.getElementById('pp-prog-sel').disabled, { timeout: 8_000 });
  await page.locator('#pp-prog-sel').selectOption('rus');
  // #pp-service-area is now an <input list="pp-sa-list">. The datalist
  // #pp-sa-list holds the SA options. Wait for the input to enable and the
  // datalist to populate.
  await page.waitForFunction(() => {
    const s = document.getElementById('pp-service-area');
    const dl = document.getElementById('pp-sa-list');
    return s && !s.disabled && dl && dl.options.length >= 1;
  }, { timeout: 10_000 });

  const saOpts = await page.locator('#pp-sa-list option').allTextContents();
  expect(saOpts.some(t => t.includes(`SA-${fixtures.tag}`))).toBe(true);

  expect(pageErrors.map(e => e.message)).toEqual([]);
});

// ---------------------------------------------------------------------------
// Test 8: sessionStorage stickiness persists client + program
// ---------------------------------------------------------------------------
test('cascade: sessionStorage stickiness saves client and program', async ({ page }) => {
  if (!HAS_DB) test.skip('Requires DATABASE_URL');

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err));

  await login(page);
  await openCreateModal(page);

  await page.locator('#proj-client').selectOption({ label: fixtures.client.name });
  await page.waitForFunction(() => !document.getElementById('pp-prog-sel').disabled, { timeout: 8_000 });
  await page.locator('#pp-prog-sel').selectOption('rus');

  const storedClient = await page.evaluate(() => sessionStorage.getItem('lf_pp_cascade_client'));
  const storedProgram = await page.evaluate(() => sessionStorage.getItem('lf_pp_cascade_program'));
  expect(storedClient).toBe(String(fixtures.client.id));
  expect(storedProgram).toBe('rus');

  expect(pageErrors.map(e => e.message)).toEqual([]);
});

