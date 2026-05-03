// Browser smoke test — Projects tree expand/collapse state survives the
// polling re-render. This is the regression net for CLEANUP_PLAN.md
// Track 1.2.3 (introducing the makeTreeState() primitive). Without this
// test, refactoring the bespoke `expandedRollups` Set to the new API risks
// the bug fixed in commit 35d22e6: the polling tick rebuilt the tbody
// every 8 seconds and re-collapsed every expanded rollup.
//
// Flow:
//   1. Seed a parent project + a child project under it.
//   2. Login as admin, navigate to Projects.
//   3. Confirm child row exists in DOM but is hidden (parent collapsed).
//   4. Click the parent's chevron → child row becomes visible.
//   5. Wait 9 s — past one POLL_MS=8000 polling tick.
//   6. Assert child row is STILL visible (state survived re-render).

const { test, expect } = require('@playwright/test');
const { seedClient, seedProject, cleanup, close } = require('./_db');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test_admin_password_123';

let parent, child;

test.beforeAll(async () => {
  // Plain non-RUS client + a unique parent + child. parent_id link forms
  // a 2-level rollup tree, which is exactly the shape ptreeToggle walks.
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

test('expanded rollup survives the 8s poll re-render', async ({ page }) => {
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

  // 2. Navigate to Projects
  await page.locator('[data-view="projects"]').click();
  // Wait for the projects table to render with our parent row. Loading
  // state sets a single TR with colspan=9; once data lands the parent's
  // chevron lives at id `pc-<parent.id>`.
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

  // 5. Wait ~9s — past one POLL_MS=8000 polling tick. The poll rebuilds
  //    the tbody from scratch; the bug we're guarding against is "rebuild
  //    drops the expanded state and child row goes hidden again."
  await page.waitForTimeout(9_000);

  // 6. Same selector — assert STILL visible. setHtmlIfChanged may keep
  //    the same DOM if nothing changed, but we don't care which path
  //    served the visibility — we only care that the user-facing
  //    expanded state survived.
  await expect(page.locator(`tr.ptree-pt-${parent.id}`)).toBeVisible();

  // 7. No uncaught exceptions during the whole flow. Catches any
  //    ReferenceError introduced by a bad refactor of expandedRollups
  //    call sites.
  expect(pageErrors, `uncaught browser errors: ${pageErrors.map(e => e.message).join('; ')}`)
    .toEqual([]);
});
