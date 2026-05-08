// Browser smoke test — Projects tree expand/collapse state survives an
// SSE-driven re-render. This is the regression net for the tree expand
// state persistence introduced in CLEANUP_PLAN.md Track 1.2.3.
//
// Original test guarded against a 8s polling tick re-collapsing expanded
// rollups (commit 35d22e6). With POLL_MS now 60s, SSE is the primary
// refresh path. This test verifies the same invariant via an SSE event:
// the tree state must survive a loadProjects() triggered by SSE.
//
// Flow:
//   1. Seed a parent project + a child project under it.
//   2. Login as admin, navigate to Projects.
//   3. Confirm child row is hidden (parent collapsed by default).
//   4. Click the parent's chevron — child row becomes visible.
//   5. Dispatch a fake SSE project_updated event via page.evaluate() to
//      trigger the same debounced loadProjects() the real SSE would fire.
//   6. Wait for the debounce (600ms) + re-render to complete.
//   7. Assert child row is STILL visible (expanded state survived re-render).

const { test, expect } = require('@playwright/test');
const { seedClient, seedProject, cleanup, close } = require('./_db');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test_admin_password_123';

let parent, child;

test.beforeAll(async () => {
  const client = await seedClient({ name: 'tree-state-' + Date.now() });
  parent = await seedProject({
    client_id: client.id,
    name: 'tree-parent-' + Date.now(),
  });
  child = await seedProject({
    client_id: client.id,
    parent_id: parent.id,
    name: 'tree-child-' + Date.now(),
  });
});

test.afterAll(async () => {
  await cleanup();
  await close();
});

test('expanded rollup survives an SSE-driven re-render', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (err) => {
    pageErrors.push(err);
    console.error('[browser:pageerror]', err.message);
  });

  // 1. Login
  await page.goto('/login');
  await page.fill('#username', ADMIN_USERNAME);
  await page.fill('#password', ADMIN_PASSWORD);
  await page.click('#submit-btn');
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15_000 });

  // Admin users have multiple portal tiles, so the launcher does not
  // auto-redirect — navigate explicitly to the admin SPA where the
  // [data-view="..."] tabs live.
  await page.goto('/admin.html');

  // 2. Navigate to Projects
  await page.locator('[data-view="projects"]').click();
  const chevSelector = `#pc-${parent.id}`;
  await page.locator(chevSelector).waitFor({ state: 'attached', timeout: 15_000 });

  // 3. Child row exists but is hidden (parent collapsed by default)
  const childRowSelector = `tr.ptree-pt-${parent.id}`;
  const childRow = page.locator(childRowSelector);
  await expect(childRow).toHaveCount(1);
  await expect(childRow).toBeHidden();

  // 4. Click the parent chevron — child row becomes visible
  await page.locator(chevSelector).click();
  await expect(childRow).toBeVisible({ timeout: 5_000 });

  // 5. Simulate an SSE project_updated event. The projects_tab.js module
  //    listens for document CustomEvent 'sse:project_updated' and debounces
  //    loadProjects() with a 500ms delay. This is the same code path that
  //    fires when a real SSE message arrives from the server.
  await page.evaluate(() => {
    document.dispatchEvent(new CustomEvent('sse:project_updated', { detail: { id: 'synthetic' } }));
  });

  // 6. Wait for the 500ms debounce + fetch + DOM render to complete.
  //    600ms covers the debounce; add another 2s for the API round-trip.
  await page.waitForTimeout(2_600);

  // 7. Expanded state must have survived the re-render.
  await expect(page.locator(`tr.ptree-pt-${parent.id}`)).toBeVisible();

  // 8. No uncaught exceptions during the flow.
  expect(pageErrors, `uncaught browser errors: ${pageErrors.map(e => e.message).join('; ')}`)
    .toEqual([]);
});
