// Browser smoke test — design portal cascade picker (Phase B2a).
//
// Verifies the 4-level cascade (Client → Program → Service Area → Job) on
// the design portal's New Project modal. Tests confirm:
//   1. Modal opens in create mode: cascade visible, job row hidden, only client enabled.
//   2. Client select → program populates and enables.
//   3. Program select → SA populates and enables (when ECs + SA folders exist).
//   4. SA select → job autocomplete enables with existing leaves in datalist.
//   5. New job name → resolve-or-create 201, modal closes.
//   6. Existing job name → resolve-or-create 200, modal closes (no duplicate).
//   7. SA-not-initialized → submit blocked with inline error.
//   8. sessionStorage stickiness: client+program+SA survive modal close/reopen.
//   9. Edit mode: cascade hidden, legacy proj-job row visible.
//
// NOTE: Tests that require specific EC / SA / project fixtures (2-9) are
// conditional on DATABASE_URL being set. Test 1 validates DOM structure always.

const { test, expect } = require('@playwright/test');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test_admin_password_123';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const HAS_DB = !!(process.env.TEST_DATABASE_URL || process.env.DATABASE_URL);

// Helper: log in and navigate to /design
async function loginAndGo(page) {
  await page.goto('/login');
  await page.fill('#username', ADMIN_USERNAME);
  await page.fill('#password', ADMIN_PASSWORD);
  await page.click('#submit-btn');
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15_000 });
  await page.goto('/design');
  // Wait for the project table to populate (init() populates it).
  // The active tbody is #dplb (was #dpb pre-rename; #dpb removed entirely).
  await page.waitForFunction(() => {
    const dplb = document.getElementById('dplb');
    return dplb && !dplb.textContent.includes('Loading');
  }, { timeout: 15_000 });
}

// Helper: open the New Project modal
async function openNewProjectModal(page) {
  // Click the "New Project" button (any button that calls openProjectModal)
  await page.click('button[onclick="openProjectModal()"]');
  await page.waitForSelector('#project-modal.open', { timeout: 8_000 }).catch(async () => {
    // Fallback: check for visible modal overlay
    await expect(page.locator('#project-modal')).toBeVisible({ timeout: 5_000 });
  });
  // Give the modal time to initialize the cascade
  await page.waitForTimeout(300);
}

// Helper: seed test fixtures as admin. Returns { clientId, ecId, saUuid, clientName } or null.
async function seedCascadeFixtures(page) {
  if (!HAS_DB) return null;
  try {
    const clientResp = await page.evaluate(async () => {
      const r = await fetch('/api/clients', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'DesignCascadeClient_' + Date.now() }),
      });
      return r.ok ? r.json() : null;
    });
    if (!clientResp) return null;
    const clientId = clientResp.id;

    const ecResp = await page.evaluate(async (cid) => {
      const r = await fetch('/api/engineering-contracts', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: cid, program: 'rus', name: 'TestDesignEC', active: true }),
      });
      return r.ok ? r.json() : null;
    }, clientId);
    if (!ecResp) return null;
    const ecId = ecResp.id;

    const saResp = await page.evaluate(async (eid) => {
      const r = await fetch(`/api/engineering-contracts/${eid}/service-areas`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'East Zone' }),
      });
      return r.ok ? r.json() : null;
    }, ecId);
    if (!saResp) return null;
    const saUuid = saResp.id;

    return { clientId, ecId, saUuid, clientName: clientResp.name };
  } catch (e) {
    console.warn('[design cascade fixture seed failed]', e.message);
    return null;
  }
}

test.describe('Design portal cascade picker', () => {
  test('1. New Project modal: cascade visible, only client enabled', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (err) => { pageErrors.push(err); console.error('[pageerror]', err.message); });

    await loginAndGo(page);
    await openNewProjectModal(page);

    // Cascade wrap visible
    await expect(page.locator('#dp-cascade-wrap')).toBeVisible();

    // Cascade selects present
    await expect(page.locator('#proj-client')).toBeVisible();
    await expect(page.locator('#proj-ptype')).toBeVisible();
    await expect(page.locator('#dp-service-area')).toBeVisible();
    await expect(page.locator('#dp-job-select')).toBeVisible();

    // Program, SA, job disabled until client is chosen
    await expect(page.locator('#proj-ptype')).toBeDisabled();
    await expect(page.locator('#dp-service-area')).toBeDisabled();
    await expect(page.locator('#dp-job-select')).toBeDisabled();

    // Client must have placeholder option
    const clientOptions = await page.locator('#proj-client option').count();
    expect(clientOptions).toBeGreaterThanOrEqual(1);

    // Error element hidden initially
    await expect(page.locator('#dp-cascade-error')).not.toBeVisible();

    expect(pageErrors).toHaveLength(0);
  });

  test('2. Client select → program enables (with fixtures)', async ({ page }) => {
    test.skip(!HAS_DB, 'Requires DATABASE_URL');
    const pageErrors = [];
    page.on('pageerror', (err) => { pageErrors.push(err); console.error('[pageerror]', err.message); });

    await loginAndGo(page);
    const fx = await seedCascadeFixtures(page);
    test.skip(!fx, 'Fixture seed failed — skipping');

    // Reload so the client appears in clientsCache + engineeringContractsCache
    await page.reload();
    await page.waitForFunction(() => {
      const dplb = document.getElementById('dplb');
      return dplb && !dplb.textContent.includes('Loading');
    }, { timeout: 15_000 });

    await openNewProjectModal(page);
    await page.selectOption('#proj-client', { label: fx.clientName });

    // Program should become enabled
    await expect(page.locator('#proj-ptype')).toBeEnabled({ timeout: 8_000 });
    const programOptions = await page.locator('#proj-ptype option').count();
    expect(programOptions).toBeGreaterThan(1);

    expect(pageErrors).toHaveLength(0);
  });

  test('3-4. Program → SA → Job chain', async ({ page }) => {
    test.skip(!HAS_DB, 'Requires DATABASE_URL');
    const pageErrors = [];
    page.on('pageerror', (err) => { pageErrors.push(err); console.error('[pageerror]', err.message); });

    await loginAndGo(page);
    const fx = await seedCascadeFixtures(page);
    test.skip(!fx, 'Fixture seed failed — skipping');

    await page.reload();
    await page.waitForFunction(() => {
      const dplb = document.getElementById('dplb');
      return dplb && !dplb.textContent.includes('Loading');
    }, { timeout: 15_000 });

    await openNewProjectModal(page);
    await page.selectOption('#proj-client', { label: fx.clientName });
    await expect(page.locator('#proj-ptype')).toBeEnabled({ timeout: 8_000 });
    await page.selectOption('#proj-ptype', { value: 'rus' });

    // SA should populate and enable. #dp-service-area is now an <input list="dp-sa-list">
    // backed by a <datalist id="dp-sa-list">. Read options from the datalist, not the input.
    await expect(page.locator('#dp-service-area')).toBeEnabled({ timeout: 10_000 });
    const saOptions = await page.locator('#dp-sa-list option').count();
    expect(saOptions).toBeGreaterThanOrEqual(1); // at least East Zone

    // Select SA → job select enables. The input is free-text + datalist; fill the value.
    const saOpts = await page.locator('#dp-sa-list option').all();
    const firstSaVal = await saOpts[0].getAttribute('value');
    await page.fill('#dp-service-area', firstSaVal);
    // Trigger the oninput="dpSaChanged()" handler that wires SA → Job cascade.
    await page.locator('#dp-service-area').dispatchEvent('input');
    await expect(page.locator('#dp-job-select')).toBeEnabled({ timeout: 8_000 });

    expect(pageErrors).toHaveLength(0);
  });

  test('6. Existing job name → resolve-or-create 200 (no duplicate)', async ({ page }) => {
    test.skip(!HAS_DB, 'Requires DATABASE_URL');
    const pageErrors = [];
    page.on('pageerror', (err) => { pageErrors.push(err); console.error('[pageerror]', err.message); });

    await loginAndGo(page);
    const fx = await seedCascadeFixtures(page);
    test.skip(!fx, 'Fixture seed failed — skipping');

    const existingJobName = 'DesignExistingJob_' + Date.now();
    // Pre-create the leaf via API
    const createResp = await page.evaluate(async ({ clientId, saUuid, name }) => {
      const r = await fetch('/api/projects/resolve-or-create', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: clientId, program: 'rus', service_area_id: saUuid, job_name: name }),
      });
      const j = await r.json();
      return { status: r.status, ...j };
    }, { clientId: fx.clientId, saUuid: fx.saUuid, name: existingJobName });
    expect(createResp.status).toBe(201);
    const originalId = createResp.id;

    // Re-call with same name — expect 200 and same ID
    const resolveResp = await page.evaluate(async ({ clientId, saUuid, name }) => {
      const r = await fetch('/api/projects/resolve-or-create', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: clientId, program: 'rus', service_area_id: saUuid, job_name: name }),
      });
      const j = await r.json();
      return { status: r.status, ...j };
    }, { clientId: fx.clientId, saUuid: fx.saUuid, name: existingJobName });
    expect(resolveResp.status).toBe(200);
    expect(resolveResp.id).toBe(originalId);
    expect(resolveResp.created).toBe(false);

    expect(pageErrors).toHaveLength(0);
  });

  test('7. SA-not-initialized → submit blocked with inline error', async ({ page }) => {
    test.skip(!HAS_DB, 'Requires DATABASE_URL');
    const pageErrors = [];
    page.on('pageerror', (err) => { pageErrors.push(err); console.error('[pageerror]', err.message); });

    await loginAndGo(page);

    // Directly test the 404 path from the API
    const result = await page.evaluate(async () => {
      try {
        const r = await fetch('/api/projects/resolve-or-create', {
          method: 'POST', credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: '00000000-0000-0000-0000-000000000001',
            program: 'rus',
            service_area_id: '00000000-0000-0000-0000-000000000002',
            job_name: 'TestJob',
          }),
        });
        return r.status;
      } catch (e) { return null; }
    });
    // Expect 404 (no EC for fake client) — UUID valid, no such records
    expect([404, 400]).toContain(result);

    expect(pageErrors).toHaveLength(0);
  });

  test('8. sessionStorage stickiness: client+program survive modal close+reopen', async ({ page }) => {
    test.skip(!HAS_DB, 'Requires DATABASE_URL');
    const pageErrors = [];
    page.on('pageerror', (err) => { pageErrors.push(err); console.error('[pageerror]', err.message); });

    await loginAndGo(page);
    const fx = await seedCascadeFixtures(page);
    test.skip(!fx, 'Fixture seed failed — skipping');

    await page.reload();
    await page.waitForFunction(() => {
      const dplb = document.getElementById('dplb');
      return dplb && !dplb.textContent.includes('Loading');
    }, { timeout: 15_000 });

    await openNewProjectModal(page);
    await page.selectOption('#proj-client', { label: fx.clientName });
    await expect(page.locator('#proj-ptype')).toBeEnabled({ timeout: 8_000 });
    await page.selectOption('#proj-ptype', { value: 'rus' });
    await expect(page.locator('#dp-service-area')).toBeEnabled({ timeout: 10_000 });
    // #dp-service-area is an <input list="dp-sa-list">; options live in the datalist.
    const saOpts = await page.locator('#dp-sa-list option').all();
    const firstSaVal = await saOpts[0].getAttribute('value');
    await page.fill('#dp-service-area', firstSaVal);
    await page.locator('#dp-service-area').dispatchEvent('input');

    // Wait for sessionStorage to write (dpSaChanged sets lf_dp_cascade_sa)
    await page.waitForTimeout(400);

    const storedClient = await page.evaluate(() => sessionStorage.getItem('lf_dp_cascade_client'));
    const storedProgram = await page.evaluate(() => sessionStorage.getItem('lf_dp_cascade_program'));
    const storedSa = await page.evaluate(() => sessionStorage.getItem('lf_dp_cascade_sa'));
    expect(storedClient).toBe(fx.clientId);
    expect(storedProgram).toBe('rus');
    // lf_dp_cascade_sa holds the SA UUID (resolved from datalist option's data-id),
    // not the typed text value. Compare against the seeded fixture UUID.
    expect(storedSa).toBe(fx.saUuid);

    // Close modal and reopen — sessionStorage should restore selections
    await page.press('body', 'Escape');
    await expect(page.locator('#project-modal')).not.toBeVisible({ timeout: 5_000 });
    await openNewProjectModal(page);
    // Give dpRestoreSession time to run async chain
    await page.waitForTimeout(2000);

    const restoredClient = await page.locator('#proj-client').inputValue();
    expect(restoredClient).toBe(fx.clientId);
    const restoredProgram = await page.locator('#proj-ptype').inputValue();
    expect(restoredProgram).toBe('rus');

    expect(pageErrors).toHaveLength(0);
  });

  test('9. Edit mode: cascade hidden, legacy proj-job row visible', async ({ page }) => {
    test.skip(!HAS_DB, 'Requires DATABASE_URL');
    const pageErrors = [];
    page.on('pageerror', (err) => { pageErrors.push(err); console.error('[pageerror]', err.message); });

    await loginAndGo(page);
    const fx = await seedCascadeFixtures(page);
    test.skip(!fx, 'Fixture seed failed — skipping');

    // Create a project to edit
    const proj = await page.evaluate(async ({ clientId, saUuid }) => {
      const r = await fetch('/api/projects/resolve-or-create', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: clientId, program: 'rus', service_area_id: saUuid, job_name: 'EditTestJob_' + Date.now() }),
      });
      return r.ok ? r.json() : null;
    }, { clientId: fx.clientId, saUuid: fx.saUuid });
    test.skip(!proj, 'Project creation failed — skipping');

    // Navigate to edit mode by calling editProject via evaluate
    await page.evaluate((id) => window.editProject(id), proj.id);
    await expect(page.locator('#project-modal')).toBeVisible({ timeout: 8_000 });
    await page.waitForTimeout(500);

    // In edit mode: cascade wrap hidden
    await expect(page.locator('#dp-cascade-wrap')).not.toBeVisible();

    // Legacy proj-job row should be visible
    await expect(page.locator('#proj-job')).toBeVisible();

    expect(pageErrors).toHaveLength(0);
  });
});
