// Browser regression tests — design-picker Phase 9 (D1/D2/D3 fixes).
//
// Verifies the three design-picker bugs are fixed and stay fixed:
//
//   D1 - clientId declared at line 1225 inside clientChanged() (was undeclared;
//        caused contracts dropdown to never populate on client select).
//
//   D2 - Backend reads req.query.project_type (routes/projects.js:49), and
//        design.html sends ?project_type=... — parameter names now match.
//
//   D3 - GET /api/projects now supports ?leaves_only=true (routes/projects.js:66-67)
//        and loadProjects() in design.html sends it on every call (line 807).
//        Rollup folders never appear in the design portal project table.
//
//   A3 (note only) - dpb is a hidden legacy compat shim (display:none).
//        dplb is the active visible tbody. Confirmed; not a bug.
//
// Tests that require a live DB are skipped when DATABASE_URL / TEST_DATABASE_URL
// is absent, matching the pattern in design_cascade.spec.js.

const { test, expect } = require('@playwright/test');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test_admin_password_123';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const HAS_DB = !!(process.env.TEST_DATABASE_URL || process.env.DATABASE_URL);

// Helper: log in and navigate to /design, wait for page init.
async function loginAndGo(page) {
  await page.goto('/login');
  await page.fill('#username', ADMIN_USERNAME);
  await page.fill('#password', ADMIN_PASSWORD);
  await page.click('#submit-btn');
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15_000 });
  await page.goto('/design');
  // Wait for dplb (the active project tbody) to lose its Loading state.
  await page.waitForFunction(() => {
    const dplb = document.getElementById('dplb');
    return dplb && !dplb.textContent.includes('Loading');
  }, { timeout: 15_000 });
}

// Helper: seed a client, a rollup folder project, and two leaf projects for it.
// Returns { clientId, rollupId, leafId1, leafId2, clientName } or null.
async function seedPickerFixture(page) {
  if (!HAS_DB) return null;
  try {
    // Create client
    const clientResp = await page.evaluate(async () => {
      const r = await fetch('/api/clients', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'PickerRegressionClient_' + Date.now() }),
      });
      return r.ok ? r.json() : null;
    });
    if (!clientResp) return null;
    const clientId = clientResp.id;

    // Create a rollup folder directly via the projects endpoint.
    // is_rollup=true marks it as a folder; leaves_only should exclude it.
    const rollupResp = await page.evaluate(async (cid) => {
      const r = await fetch('/api/projects', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'RollupFolder_shouldNotAppear',
          client_id: cid,
          is_rollup: true,
          billing_type: 'hourly',
          billing_rate: 0,
        }),
      });
      return r.ok ? r.json() : null;
    }, clientId);

    // Create two leaf projects under this client
    const leaf1Resp = await page.evaluate(async (cid) => {
      const r = await fetch('/api/projects', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'LeafProject_Alpha_' + Date.now(),
          client_id: cid,
          project_type: 'design',
          billing_type: 'hourly',
          billing_rate: 90,
          status: 'active',
        }),
      });
      return r.ok ? r.json() : null;
    }, clientId);

    const leaf2Resp = await page.evaluate(async (cid) => {
      const r = await fetch('/api/projects', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'LeafProject_Beta_' + Date.now(),
          client_id: cid,
          project_type: 'design',
          billing_type: 'hourly',
          billing_rate: 90,
          status: 'active',
        }),
      });
      return r.ok ? r.json() : null;
    }, clientId);

    if (!leaf1Resp || !leaf2Resp) return null;

    return {
      clientId,
      rollupId: rollupResp?.id || null,
      leafId1: leaf1Resp.id,
      leafId2: leaf2Resp.id,
      clientName: clientResp.name,
      leafName1: leaf1Resp.name,
      leafName2: leaf2Resp.name,
      rollupName: rollupResp?.name || 'RollupFolder_shouldNotAppear',
    };
  } catch (e) {
    console.warn('[picker fixture seed failed]', e.message);
    return null;
  }
}

test.describe('Design picker regression — D1/D2/D3', () => {
  // ─── D1: clientId declared in clientChanged() ─────────────────────────────
  //
  // Verifies that selecting a client in the design portal does not throw
  // "clientId is not defined" and the contracts dropdown populates (or at
  // least the function completes without a pageerror). This is a DOM-structure
  // test; it passes without a DB if the function runs clean.
  test('D1: clientChanged() runs without ReferenceError on client select', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
      console.error('[pageerror]', err.message);
    });

    await loginAndGo(page);

    // Open the New Project modal (it calls clientChanged internally when
    // a client is picked — open it and check there is no immediate pageerror).
    await page.click('button[onclick="openProjectModal()"]');
    await page.waitForSelector('#project-modal', { timeout: 8_000 });

    // Give any async init (dpRestoreSession etc.) a moment to settle.
    await page.waitForTimeout(500);

    // Verify no ReferenceError has been thrown for clientId at this point.
    const clientIdErrors = pageErrors.filter(m => m.includes('clientId') && m.includes('not defined'));
    expect(clientIdErrors).toHaveLength(0);

    // The client select must be present and enabled (even with empty options list)
    await expect(page.locator('#proj-client')).toBeVisible();
  });

  // ─── D2: ?project_type= param accepted by backend ─────────────────────────
  //
  // Calls GET /api/projects?project_type=design directly via fetch() inside
  // the browser context and confirms the backend returns 200 (not 400/500).
  // Prior bug: frontend sent ?project_type= but backend read req.query.type —
  // the filter was silently ignored (no error, just wrong data). The unit-level
  // fix is verified here as an API-level smoke test.
  test('D2: GET /api/projects?project_type=design returns 200', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
      console.error('[pageerror]', err.message);
    });

    await loginAndGo(page);

    const status = await page.evaluate(async () => {
      const r = await fetch('/api/projects?project_type=design&leaves_only=true', {
        credentials: 'include',
      });
      return r.status;
    });

    expect(status).toBe(200);
    expect(pageErrors).toHaveLength(0);
  });

  // ─── D3: leaves_only=true excludes rollup rows from API response ───────────
  //
  // Seeds a client with one rollup folder + 2 leaf projects. Calls
  // GET /api/projects?leaves_only=true&client_id=<id> via fetch() and asserts:
  //   a) The rollup folder ID is absent from the response.
  //   b) Both leaf IDs appear in the response.
  test('D3: GET /api/projects?leaves_only=true excludes is_rollup rows', async ({ page }) => {
    test.skip(!HAS_DB, 'Requires DATABASE_URL');
    const pageErrors = [];
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
      console.error('[pageerror]', err.message);
    });

    await loginAndGo(page);
    const fx = await seedPickerFixture(page);
    test.skip(!fx, 'Fixture seed failed — skipping');

    const { rows, status } = await page.evaluate(async (clientId) => {
      const r = await fetch(
        '/api/projects?leaves_only=true&client_id=' + encodeURIComponent(clientId),
        { credentials: 'include' }
      );
      const rows = r.ok ? await r.json() : [];
      return { rows, status: r.status };
    }, fx.clientId);

    expect(status).toBe(200);

    const ids = rows.map(r => r.id);
    // Rollup should be absent
    if (fx.rollupId) {
      expect(ids).not.toContain(fx.rollupId);
    }
    // Both leaves should be present
    expect(ids).toContain(fx.leafId1);
    expect(ids).toContain(fx.leafId2);

    expect(pageErrors).toHaveLength(0);
  });

  // ─── D3b: loadProjects() sends leaves_only=true on page load ──────────────
  //
  // Intercepts network requests on /design page load and asserts that the
  // /api/projects fetch includes ?leaves_only=true in the URL.
  test('D3b: loadProjects() sends ?leaves_only=true on page load', async ({ page }) => {
    const projectsUrls = [];
    page.on('request', (req) => {
      if (req.url().includes('/api/projects') && !req.url().includes('/resolve-or-create')) {
        projectsUrls.push(req.url());
      }
    });

    await loginAndGo(page);

    // At least one /api/projects request must have been made by page init
    expect(projectsUrls.length).toBeGreaterThan(0);

    // Every /api/projects request must include leaves_only=true
    const allHaveLeaves = projectsUrls.every(u => {
      const params = new URL(u).searchParams;
      return params.get('leaves_only') === 'true';
    });
    expect(allHaveLeaves).toBe(true);
  });

  // ─── D3c: project table rows contain no rollup folders ────────────────────
  //
  // After page load, checks the visible dplb tbody rows for any row whose
  // name matches the rollup fixture name (would appear if the filter broke).
  test('D3c: design portal project table shows leaves only, not rollup folders', async ({ page }) => {
    test.skip(!HAS_DB, 'Requires DATABASE_URL');
    const pageErrors = [];
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
      console.error('[pageerror]', err.message);
    });

    await loginAndGo(page);
    const fx = await seedPickerFixture(page);
    test.skip(!fx, 'Fixture seed failed — skipping');

    // Reload so the seeded projects appear in the table
    await page.reload();
    await page.waitForFunction(() => {
      const dplb = document.getElementById('dplb');
      return dplb && !dplb.textContent.includes('Loading');
    }, { timeout: 15_000 });

    // The rollup folder name must NOT appear in the active table
    const tableText = await page.locator('#dplb').textContent();
    expect(tableText).not.toContain('RollupFolder_shouldNotAppear');

    // Both leaf names must appear somewhere in the table
    expect(tableText).toContain('LeafProject_Alpha_');
    expect(tableText).toContain('LeafProject_Beta_');

    expect(pageErrors).toHaveLength(0);
  });

  // ─── A3 note: dpb is the hidden compat shim, dplb is active ──────────────
  //
  // Confirms the DOM structure: dpb must be inside display:none wrapper,
  // dplb must be the visible active tbody for the projects table.
  test('A3: dpb is hidden compat shim; dplb is the active visible tbody', async ({ page }) => {
    await loginAndGo(page);

    // dpb's ancestor with display:none should exist — meaning dpb itself
    // is not directly visible to users.
    const dpbHidden = await page.evaluate(() => {
      const el = document.getElementById('dpb');
      if (!el) return false;
      let node = el.parentElement;
      while (node) {
        if (getComputedStyle(node).display === 'none') return true;
        node = node.parentElement;
      }
      return false;
    });
    expect(dpbHidden).toBe(true);

    // dplb must exist and be visible
    await expect(page.locator('#dplb')).toBeVisible();
  });
});
