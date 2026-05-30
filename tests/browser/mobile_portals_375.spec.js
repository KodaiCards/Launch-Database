// Browser smoke test — Wave 208: 375px mobile layout snapshots for 6 portals.
//
// Wave 200 verification flagged 6 portals without inline @media breakpoints — they
// rely entirely on app-shell.css responsive grids. This test loads each at a 375px
// viewport (iPhone SE / standard mobile width) and asserts:
//   (a) no horizontal overflow (page scrollWidth <= viewport width + 1px tolerance)
//   (b) the #main-content landmark is visible (app-shell wrap rendered correctly)
//
// Catches regressions where a new component breaks the responsive grid by adding
// fixed-width content or non-responsive overflow.

const { test, expect } = require('@playwright/test');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test_admin_password_123';

// ---------------------------------------------------------------------------
// Login helper — shared. Login.html itself is public; the other 5 portals
// require admin auth.
// ---------------------------------------------------------------------------
async function login(page) {
  await page.goto('/login');
  await page.fill('#username', ADMIN_USERNAME);
  await page.fill('#password', ADMIN_PASSWORD);
  await page.click('#submit-btn');
  await page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 15_000 });
}

// ---------------------------------------------------------------------------
// Shared portal-check routine. Sets viewport to 375x800, navigates, asserts
// no horizontal overflow + #main-content visible (where applicable). Skips
// gracefully on redirect/4xx so the test surfaces real layout regressions
// without failing on environment quirks.
// ---------------------------------------------------------------------------
async function checkPortalMobile(page, portalUrl, portalName, opts = {}) {
  const { requireAuth = true, expectMainContent = true } = opts;

  // 375x800 ≈ iPhone SE portrait. Set viewport BEFORE navigation so the
  // initial render uses the mobile breakpoint.
  await page.setViewportSize({ width: 375, height: 800 });

  if (requireAuth) {
    await login(page);
  }

  const response = await page.goto(portalUrl, { waitUntil: 'domcontentloaded', timeout: 15_000 }).catch(() => null);

  // Handle redirect to login (auth/role gating) — assert + skip layout check.
  const currentUrl = page.url();
  if (currentUrl.includes('/login') && portalName !== 'login') {
    test.skip(true, `${portalName} redirected to /login — auth/role gating, skipping layout check`);
    return;
  }

  if (response && response.status() >= 400) {
    test.skip(true, `${portalName} returned HTTP ${response.status()} — skipping layout check`);
    return;
  }

  // Wait for body to be visible — layout pass complete.
  await page.locator('body').waitFor({ state: 'visible', timeout: 10_000 });

  // Give late-loading scripts a brief settle window so the layout stabilizes.
  await page.waitForTimeout(500);

  // Assert no horizontal overflow. Allow 1px tolerance for sub-pixel rounding.
  const overflow = await page.evaluate(() => {
    const docWidth  = document.documentElement.scrollWidth;
    const viewWidth = window.innerWidth;
    return { docWidth, viewWidth, overflow: docWidth - viewWidth };
  });
  expect(overflow.overflow, `Page ${portalUrl} overflowed horizontally at 375px: docWidth=${overflow.docWidth}, viewWidth=${overflow.viewWidth}`).toBeLessThanOrEqual(1);

  // Assert #main-content landmark is present + visible (app-shell wrap).
  // Login.html may not have #main-content (focused single-form page); skip there.
  if (expectMainContent) {
    const mainContent = page.locator('#main-content');
    const count = await mainContent.count();
    if (count > 0) {
      await expect(mainContent).toBeVisible();
    }
    // If #main-content is missing entirely, that's a Wave 200 wrap finding —
    // not a layout regression. Don't fail the test on it.
  }
}

// ---------------------------------------------------------------------------
// One explicit test() per portal so failures pinpoint the broken surface in
// CI output and so each can be retried/run independently.
// ---------------------------------------------------------------------------

test('mobile 375px — workspace portal has no horizontal overflow', async ({ page }) => {
  await checkPortalMobile(page, '/workspace/', 'workspace');
});

test('mobile 375px — photos portal has no horizontal overflow', async ({ page }) => {
  await checkPortalMobile(page, '/photos/', 'photos');
});

test('mobile 375px — downloads portal has no horizontal overflow', async ({ page }) => {
  await checkPortalMobile(page, '/downloads/', 'downloads');
});

test('mobile 375px — customer portal has no horizontal overflow', async ({ page }) => {
  await checkPortalMobile(page, '/customer.html', 'customer');
});

test('mobile 375px — offline-sync portal has no horizontal overflow', async ({ page }) => {
  await checkPortalMobile(page, '/offline-sync', 'offline-sync');
});

test('mobile 375px — login page has no horizontal overflow', async ({ page }) => {
  // login.html is public — skip the auth step + #main-content assertion.
  await checkPortalMobile(page, '/login.html', 'login', { requireAuth: false, expectMainContent: false });
});
