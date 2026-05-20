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
  await expect(page.locator('#pp-client')).toHaveCount(1);
  await expect(page.locator('#pp-program')).toHaveCount(1);
  await expect(page.locator('#pp-service-area')).toHaveCount(1);
  await expect(page.locator('#pp-job')).toHaveCount(1);
  await expect(page.locator('#pp-job-list')).toHaveCount(1);

  // Submit button and error div present.
  await expect(page.locator('#pp-cascade-submit')).toHaveCount(1);
  await expect(page.locator('#pp-cascade-error')).toHaveCount(1);

  // Program and SA start disabled; submit disabled with empty fields.
  await expect(page.locator('#pp-program')).toBeDisabled();
  await expect(page.locator('#pp-service-area')).toBeDisabled();
  await expect(page.locator('#pp-cascade-submit')).toBeDisabled();

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

  await page.locator('#pp-client').selectOption({ label: fixtures.client.name });
  await page.waitForFunction(() => {
    const s = document.getElementById('pp-program');
    return s && !s.disabled && s.options.length > 1;
  }, { timeout: 8_000 });

  await expect(page.locator('#pp-program')).toBeEnabled();
  const opts = await page.locator('#pp-program option').allTextContents();
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

  await page.locator('#pp-client').selectOption({ label: fixtures.client.name });
  await page.waitForFunction(() => !document.getElementById('pp-program').disabled, { timeout: 8_000 });
  await page.locator('#pp-program').selectOption('rus');
  await page.waitForFunction(() => {
    const s = document.getElementById('pp-service-area');
    return s && !s.disabled && s.options.length > 1;
  }, { timeout: 10_000 });

  const saOpts = await page.locator('#pp-service-area option').allTextContents();
  expect(saOpts.some(t => t.includes(`SA-${fixtures.tag}`))).toBe(true);

  expect(pageErrors.map(e => e.message)).toEqual([]);
});

// ---------------------------------------------------------------------------
// Test 6: new job name -> resolve-or-create returns 201
// ---------------------------------------------------------------------------
test('cascade: new job name creates project (201)', async ({ page }) => {
  if (!HAS_DB) test.skip('Requires DATABASE_URL');

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err));

  await login(page);
  await openCreateModal(page);

  await page.locator('#pp-client').selectOption({ label: fixtures.client.name });
  await page.waitForFunction(() => !document.getElementById('pp-program').disabled, { timeout: 8_000 });
  await page.locator('#pp-program').selectOption('rus');
  await page.waitForFunction(() => !document.getElementById('pp-service-area').disabled, { timeout: 10_000 });
  await page.locator('#pp-service-area').selectOption({ index: 1 });
  await page.waitForFunction(() => !document.getElementById('pp-job').disabled, { timeout: 8_000 });

  const jobName = `NewJob-${Date.now()}`;
  await page.locator('#pp-job').fill(jobName);

  // Submit button should now be enabled.
  await expect(page.locator('#pp-cascade-submit')).toBeEnabled({ timeout: 3_000 });

  // Intercept the resolve-or-create call to verify 201.
  let responseStatus = null;
  page.on('response', res => {
    if (res.url().includes('/api/projects/resolve-or-create')) responseStatus = res.status();
  });

  await page.locator('#pp-cascade-submit').click();
  await page.waitForFunction(() => responseStatus !== null, { timeout: 10_000 });

  expect(responseStatus).toBe(201);

  expect(pageErrors.map(e => e.message)).toEqual([]);
});

// ---------------------------------------------------------------------------
// Test 7: SA-not-initialized returns 404 -> inline error shown
// ---------------------------------------------------------------------------
test('cascade: SA not initialized shows inline error on 404', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err));

  await login(page);
  await openCreateModal(page);

  // Mock resolve-or-create to return 404.
  await page.route('**/api/projects/resolve-or-create', route => {
    route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: 'SA folder not found' }) });
  });

  // Directly invoke ppCascadeSubmit with fields set via evaluate.
  await page.evaluate(() => {
    document.getElementById('pp-client').value = 'fake-client';
    document.getElementById('pp-program').value = 'rus';
    const saSel = document.getElementById('pp-service-area');
    saSel.disabled = false;
    const opt = document.createElement('option');
    opt.value = 'fake-sa-id';
    opt.textContent = 'Fake SA';
    saSel.appendChild(opt);
    saSel.value = 'fake-sa-id';
    const jobIn = document.getElementById('pp-job');
    jobIn.disabled = false;
    jobIn.value = 'Some Job';
  });

  await page.evaluate(() => ppCascadeSubmit());
  await page.waitForFunction(() => {
    const el = document.getElementById('pp-cascade-error');
    return el && el.style.display !== 'none' && el.textContent.length > 0;
  }, { timeout: 8_000 });

  const errText = await page.locator('#pp-cascade-error').textContent();
  expect(errText.toLowerCase()).toContain('not initialized');

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

  await page.locator('#pp-client').selectOption({ label: fixtures.client.name });
  await page.waitForFunction(() => !document.getElementById('pp-program').disabled, { timeout: 8_000 });
  await page.locator('#pp-program').selectOption('rus');

  const storedClient = await page.evaluate(() => sessionStorage.getItem('lf_pp_cascade_client'));
  const storedProgram = await page.evaluate(() => sessionStorage.getItem('lf_pp_cascade_program'));
  expect(storedClient).toBe(String(fixtures.client.id));
  expect(storedProgram).toBe('rus');

  expect(pageErrors.map(e => e.message)).toEqual([]);
});

// ---------------------------------------------------------------------------
// Test 9: submit button disabled until all four fields filled
// ---------------------------------------------------------------------------
test('cascade: submit stays disabled until all four fields filled', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err));

  await login(page);
  await openCreateModal(page);

  // Initially disabled.
  await expect(page.locator('#pp-cascade-submit')).toBeDisabled();

  // Set client — still no program/sa/job, still disabled.
  await page.evaluate(() => {
    const s = document.getElementById('pp-client');
    const opt = document.createElement('option');
    opt.value = 'fake-c';
    opt.textContent = 'Fake C';
    s.appendChild(opt);
    s.value = 'fake-c';
  });
  await page.evaluate(() => ppUpdateSubmitState());
  await expect(page.locator('#pp-cascade-submit')).toBeDisabled();

  // Fill all four via evaluate.
  await page.evaluate(() => {
    ['pp-program', 'pp-service-area'].forEach(id => {
      const s = document.getElementById(id);
      s.disabled = false;
      const opt = document.createElement('option');
      opt.value = 'x';
      opt.textContent = 'X';
      s.appendChild(opt);
      s.value = 'x';
    });
    const j = document.getElementById('pp-job');
    j.disabled = false;
    j.value = 'Some Job Name';
    ppUpdateSubmitState();
  });
  await expect(page.locator('#pp-cascade-submit')).toBeEnabled();

  expect(pageErrors.map(e => e.message)).toEqual([]);
});
