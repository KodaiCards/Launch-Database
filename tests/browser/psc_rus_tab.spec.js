// Browser smoke test — Track 0 step 7.
//
// Logs into the admin app and clicks the PSC RUS tab. The single most
// valuable assertion is "no `pageerror` events fired" — that's what
// catches the `clientsCache`-class of typo bugs (a one-letter typo on a
// cache name throws ReferenceError at click-time without any HTTP error,
// and a backend smoke test would miss it entirely).
//
// We don't assert pixel-perfect UI; we assert that the user can reach the
// PSC RUS section, that the projection card lands in the DOM, and that
// no uncaught exception fired during the click flow.

const { test, expect } = require('@playwright/test');

// Default-admin creds match the CI env vars set in .github/workflows/test.yml
// and the fallback in tests/_helpers.js.
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test_admin_password_123';

test('admin can log in and open the PSC RUS tab without uncaught errors', async ({ page }) => {
  // Collect every uncaught exception fired by the page. We assert at the
  // end that the array is empty. Logging to stdout helps CI diagnosis.
  const pageErrors = [];
  page.on('pageerror', (err) => {
    pageErrors.push(err);
    console.error('[browser:pageerror]', err.message);
  });

  // 1. Login. login.html submits to /api/auth/login and redirects on 200.
  await page.goto('/login');
  await page.fill('#username', ADMIN_USERNAME);
  await page.fill('#password', ADMIN_PASSWORD);
  await page.click('#submit-btn');
  // Wait for the redirect away from /login. Don't assert on a specific
  // path because the redirect target depends on getRedirectTarget().
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15_000 });

  // Admin users land on the multi-tile launcher (no auto-redirect when
  // multiple portals are accessible). Navigate explicitly to the admin
  // SPA where the [data-view="inspection"] tab lives.
  await page.goto('/admin.html');

  // 2. Click the PSC RUS tab. The label says "PSC RUS" but the data-view
  //    attribute still uses the historical "inspection" name. Use the
  //    attribute selector so we're robust to label tweaks.
  const pscTab = page.locator('[data-view="inspection"]');
  await expect(pscTab).toBeVisible();
  await pscTab.click();

  // 3. After clicking the tab, the inspection view must be visible. Wave
  //    Projection FE-2 (commit d0bc210) deleted the old
  //    #psc-rus-projection-card placeholder (replaced by the dashboard's
  //    #rus-proj-tile + #rus-proj-expand). The new gate: confirm the
  //    inspection view actually opened by checking #view-inspection is
  //    visible, and confirm its filter controls (the part most exposed to
  //    clientsCache-style bugs because they reference cached data) are
  //    in the DOM.
  await expect(page.locator('#view-inspection')).toBeVisible();
  await expect(page.locator('#insp-period')).toHaveCount(1);
  await expect(page.locator('#insp-status')).toHaveCount(1);

  // 4. Brief settle so any async loaders trigger their error paths if they
  //    were going to. 1500ms is enough for the polling tick + the
  //    /api/automation/psc-rus-projection round-trip.
  await page.waitForTimeout(1500);

  // 5. Final gate.
  expect(pageErrors, `uncaught browser errors: ${pageErrors.map(e => e.message).join('; ')}`)
    .toEqual([]);
});
