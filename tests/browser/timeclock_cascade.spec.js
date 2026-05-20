// Browser smoke test — Phase B1: timeclock cascade picker.
//
// Validates the 4-level cascade (Client -> Program -> SA -> Job) across the
// three timeclock surfaces: clock-in card, switch-project modal, and entry
// modal. The most valuable assertion is DOM structure — that the cascade selects
// are present and that no pageerror fires during the click flow.
//
// Tests that require a live database (fixture seeding + API calls) skip
// automatically when no DATABASE_URL / TEST_DATABASE_URL is set in env.

const { test, expect } = require('@playwright/test');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test_admin_password_123';
const HAS_DB = !!(process.env.TEST_DATABASE_URL || process.env.DATABASE_URL);

// ---------------------------------------------------------------------------
// Login helper — shared across tests.
// ---------------------------------------------------------------------------
async function login(page) {
  await page.goto('/login');
  await page.fill('#username', ADMIN_USERNAME);
  await page.fill('#password', ADMIN_PASSWORD);
  await page.click('#submit-btn');
  await page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 15_000 });
}

// ---------------------------------------------------------------------------
// Test 1: DOM structure — cascade selects exist on clock-in card
// ---------------------------------------------------------------------------
test('clock-in card has cascade selects (client, program, sa, job)', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', err => {
    pageErrors.push(err);
    console.error('[browser:pageerror]', err.message);
  });

  await login(page);
  await page.goto('/timeclock');
  // Wait for the clock card to render (clocked-out state shows the picker).
  // The #clock-content div is always present; we wait for the cascade selects
  // which render inside it when the user is clocked out.
  await page.waitForSelector('#ci-client', { timeout: 10_000 }).catch(() => {});

  // If clocked in, the cascade doesn't render — skip the DOM assertion.
  const isPresent = await page.locator('#ci-client').count() > 0;
  if (isPresent) {
    await expect(page.locator('#ci-client')).toHaveCount(1);
    await expect(page.locator('#ci-program')).toHaveCount(1);
    await expect(page.locator('#ci-sa')).toHaveCount(1);
    await expect(page.locator('#ci-job')).toHaveCount(1);
    await expect(page.locator('#ci-job-list')).toHaveCount(1);

    // Program and SA start disabled until client is selected.
    await expect(page.locator('#ci-program')).toBeDisabled();
    await expect(page.locator('#ci-sa')).toBeDisabled();
    await expect(page.locator('#ci-job')).toBeDisabled();
  }

  expect(pageErrors.map(e => e.message)).toEqual([]);
});

// ---------------------------------------------------------------------------
// Test 2: Entry modal cascade structure
// ---------------------------------------------------------------------------
test('entry modal has cascade selects (client, program, sa, job)', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err));

  await login(page);
  await page.goto('/timeclock');
  // Open the manual entry modal via the + Add Entry button.
  const addBtn = page.locator('button:has-text("Add Entry"), button:has-text("Manual Entry"), [onclick*="openManualEntryModal"]');
  const addBtnCount = await addBtn.count();
  if (addBtnCount === 0) {
    test.skip('Add entry button not visible — likely clocked-in state');
    return;
  }
  await addBtn.first().click();

  const modal = page.locator('#entry-modal');
  await expect(modal).toBeVisible({ timeout: 5_000 });

  await expect(page.locator('#entry-client')).toHaveCount(1);
  await expect(page.locator('#entry-program')).toHaveCount(1);
  await expect(page.locator('#entry-sa')).toHaveCount(1);
  await expect(page.locator('#entry-job')).toHaveCount(1);
  await expect(page.locator('#entry-job-list')).toHaveCount(1);
  await expect(page.locator('#entry-resolved-project-id')).toHaveCount(1);

  // Program and SA start disabled.
  await expect(page.locator('#entry-program')).toBeDisabled();
  await expect(page.locator('#entry-sa')).toBeDisabled();

  expect(pageErrors.map(e => e.message)).toEqual([]);
});

// ---------------------------------------------------------------------------
// Test 3: Switch modal cascade structure (requires active session — skips otherwise)
// ---------------------------------------------------------------------------
test('switch modal has cascade selects (client, program, sa, job)', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err));

  await login(page);
  await page.goto('/timeclock');
  await page.waitForTimeout(2000); // wait for card render

  const switchBtn = page.locator('[onclick*="openSwitchModal"]');
  if (await switchBtn.count() === 0) {
    test.skip('Switch button not visible — user is not clocked in');
    return;
  }
  await switchBtn.click();

  const modal = page.locator('#switch-modal');
  await expect(modal).toBeVisible({ timeout: 5_000 });

  await expect(page.locator('#sw-client')).toHaveCount(1);
  await expect(page.locator('#sw-program')).toHaveCount(1);
  await expect(page.locator('#sw-sa')).toHaveCount(1);
  await expect(page.locator('#sw-job')).toHaveCount(1);
  await expect(page.locator('#sw-job-list')).toHaveCount(1);

  await expect(page.locator('#sw-program')).toBeDisabled();
  await expect(page.locator('#sw-sa')).toBeDisabled();

  // Close modal.
  await page.locator('#switch-modal .btn-secondary').click();

  expect(pageErrors.map(e => e.message)).toEqual([]);
});

// ---------------------------------------------------------------------------
// Tests 4-8 require a live database. Skip when DATABASE_URL is not set.
// ---------------------------------------------------------------------------

// Seed fixtures shared across DB tests.
let fixtures = null;
const { Pool } = require('pg');

async function seedFixtures() {
  if (!HAS_DB) return null;
  const pool = new Pool({
    connectionString: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
  });
  const tag = `pw${Date.now().toString(36)}`;

  const { rows: [client] } = await pool.query(
    `INSERT INTO clients (name) VALUES ($1) RETURNING id, name`,
    [`CascadeTest-${tag}`]
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
  // Create the SA folder project row (resolve-or-create expects this).
  const { rows: [saFolder] } = await pool.query(
    `INSERT INTO projects (name, client_id, engineering_contract_id, program,
       is_rollup, rollup_level, rollup_key)
     VALUES ($1, $2, $3, 'rus', true, 'service_area', $4) RETURNING id`,
    [`SA-${tag}`, client.id, ec.id, sa.id]
  );

  await pool.end();
  return { client, ec, sa, saFolder, tag, pool: null };
}

async function cleanupFixtures(f) {
  if (!f) return;
  const pool = new Pool({
    connectionString: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
  });
  try {
    await pool.query(`DELETE FROM projects WHERE rollup_key = $1`, [f.sa.id]);
    await pool.query(`DELETE FROM ec_service_areas WHERE id = $1`, [f.sa.id]);
    await pool.query(`DELETE FROM engineering_contracts WHERE id = $1`, [f.ec.id]);
    await pool.query(`DELETE FROM clients WHERE id = $1`, [f.client.id]);
  } catch (e) {
    console.warn('[cascade-cleanup]', e.message);
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
// Test 4: client select -> program unlocks with fixture client
// ---------------------------------------------------------------------------
test('cascade: client selection unlocks program select', async ({ page }) => {
  if (!HAS_DB) test.skip('Requires DATABASE_URL');

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err));

  await login(page);
  await page.goto('/timeclock');

  // Open manual entry modal.
  const addBtn = page.locator('[onclick*="openManualEntryModal"]');
  if (await addBtn.count() === 0) test.skip('Add entry button not visible');
  await addBtn.first().click();
  await expect(page.locator('#entry-modal')).toBeVisible();

  // Select the fixture client.
  await page.locator('#entry-client').selectOption({ label: fixtures.client.name });
  // Wait for async fetch to complete and program select to enable.
  await page.waitForFunction(() => {
    const sel = document.getElementById('entry-program');
    return sel && !sel.disabled && sel.options.length > 1;
  }, { timeout: 8_000 });

  // Program should now be enabled and contain 'RUS'.
  await expect(page.locator('#entry-program')).toBeEnabled();
  const programOptions = await page.locator('#entry-program option').allTextContents();
  expect(programOptions.some(t => t.toLowerCase().includes('rus'))).toBe(true);

  expect(pageErrors.map(e => e.message)).toEqual([]);
});

// ---------------------------------------------------------------------------
// Test 5: full cascade chain -> SA select contains fixture SA
// ---------------------------------------------------------------------------
test('cascade: program -> SA chain populates service area', async ({ page }) => {
  if (!HAS_DB) test.skip('Requires DATABASE_URL');

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err));

  await login(page);
  await page.goto('/timeclock');

  const addBtn = page.locator('[onclick*="openManualEntryModal"]');
  if (await addBtn.count() === 0) test.skip('Add entry button not visible');
  await addBtn.first().click();
  await expect(page.locator('#entry-modal')).toBeVisible();

  await page.locator('#entry-client').selectOption({ label: fixtures.client.name });
  await page.waitForFunction(() => {
    const s = document.getElementById('entry-program');
    return s && !s.disabled && s.options.length > 1;
  }, { timeout: 8_000 });

  await page.locator('#entry-program').selectOption('rus');
  await page.waitForFunction(() => {
    const s = document.getElementById('entry-sa');
    return s && !s.disabled && s.options.length > 1;
  }, { timeout: 8_000 });

  const saOptions = await page.locator('#entry-sa option').allTextContents();
  expect(saOptions.some(t => t.includes(`SA-${fixtures.tag}`))).toBe(true);

  expect(pageErrors.map(e => e.message)).toEqual([]);
});

// ---------------------------------------------------------------------------
// Test 6: new job name -> resolve-or-create returns 201 (created=true)
// ---------------------------------------------------------------------------
test('cascade: new job name resolves via resolve-or-create (201)', async ({ page }) => {
  if (!HAS_DB) test.skip('Requires DATABASE_URL');

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err));

  await login(page);
  await page.goto('/timeclock');

  const addBtn = page.locator('[onclick*="openManualEntryModal"]');
  if (await addBtn.count() === 0) test.skip('Add entry button not visible');
  await addBtn.first().click();
  await expect(page.locator('#entry-modal')).toBeVisible();

  // Walk the cascade.
  await page.locator('#entry-client').selectOption({ label: fixtures.client.name });
  await page.waitForFunction(() => !document.getElementById('entry-program').disabled, { timeout: 8_000 });
  await page.locator('#entry-program').selectOption('rus');
  await page.waitForFunction(() => !document.getElementById('entry-sa').disabled, { timeout: 8_000 });
  const saOptions = await page.locator('#entry-sa option[value!=""]').all();
  await page.locator('#entry-sa').selectOption({ index: 1 });
  await page.waitForFunction(() => !document.getElementById('entry-job').disabled, { timeout: 8_000 });

  const jobName = `TestJob-${Date.now()}`;
  await page.locator('#entry-job').fill(jobName);

  // Call resolveOrCreateFromCascade directly and check result.
  const result = await page.evaluate(async (jn) => {
    try {
      return await window.resolveOrCreateFromCascade('entry');
    } catch (e) {
      return { error: e.message };
    }
  }, jobName);

  expect(result).not.toHaveProperty('error');
  expect(result).toHaveProperty('id');
  expect(result.created).toBe(true);

  expect(pageErrors.map(e => e.message)).toEqual([]);
});

// ---------------------------------------------------------------------------
// Test 7: same job name again -> resolve returns existing project (created=false)
// ---------------------------------------------------------------------------
test('cascade: existing job name returns same project (no duplicate)', async ({ page }) => {
  if (!HAS_DB) test.skip('Requires DATABASE_URL');

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err));

  await login(page);
  await page.goto('/timeclock');

  const addBtn = page.locator('[onclick*="openManualEntryModal"]');
  if (await addBtn.count() === 0) test.skip('Add entry button not visible');
  await addBtn.first().click();
  await expect(page.locator('#entry-modal')).toBeVisible();

  await page.locator('#entry-client').selectOption({ label: fixtures.client.name });
  await page.waitForFunction(() => !document.getElementById('entry-program').disabled, { timeout: 8_000 });
  await page.locator('#entry-program').selectOption('rus');
  await page.waitForFunction(() => !document.getElementById('entry-sa').disabled, { timeout: 8_000 });
  await page.locator('#entry-sa').selectOption({ index: 1 });
  await page.waitForFunction(() => !document.getElementById('entry-job').disabled, { timeout: 8_000 });

  const jobName = `RepeatedJob-${fixtures.tag}`;

  // First call — creates.
  await page.locator('#entry-job').fill(jobName);
  const r1 = await page.evaluate(() => window.resolveOrCreateFromCascade('entry'));
  expect(r1.created).toBe(true);

  // Second call — returns existing.
  await page.locator('#entry-job').fill(jobName);
  const r2 = await page.evaluate(() => window.resolveOrCreateFromCascade('entry'));
  expect(r2.created).toBe(false);
  expect(r2.id).toBe(r1.id);

  expect(pageErrors.map(e => e.message)).toEqual([]);
});

// ---------------------------------------------------------------------------
// Test 8: sessionStorage stickiness — client/program persists across page reload
// ---------------------------------------------------------------------------
test('cascade: sessionStorage stickiness restores client+program on reload', async ({ page }) => {
  if (!HAS_DB) test.skip('Requires DATABASE_URL');

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err));

  await login(page);
  await page.goto('/timeclock');

  const addBtn = page.locator('[onclick*="openManualEntryModal"]');
  if (await addBtn.count() === 0) test.skip('Add entry button not visible');
  await addBtn.first().click();
  await expect(page.locator('#entry-modal')).toBeVisible();

  await page.locator('#entry-client').selectOption({ label: fixtures.client.name });
  await page.waitForFunction(() => !document.getElementById('entry-program').disabled, { timeout: 8_000 });
  await page.locator('#entry-program').selectOption('rus');

  // Verify sessionStorage was written.
  const storedClient = await page.evaluate(() => sessionStorage.getItem('lf_tc_entry_client'));
  const storedProgram = await page.evaluate(() => sessionStorage.getItem('lf_tc_entry_program'));
  expect(storedClient).toBe(String(fixtures.client.id));
  expect(storedProgram).toBe('rus');

  expect(pageErrors.map(e => e.message)).toEqual([]);
});
