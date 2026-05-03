// Playwright config — runs the browser-side smoke test described in
// CLEANUP_PLAN.md Track 0 step 7.
//
// What this catches that the backend tests don't: silent frontend bugs
// where a typo references an undefined symbol (e.g. the `clientsCache`
// regression — a one-letter typo broke contract dropdowns for days
// without producing any HTTP error). Those manifest as `pageerror` events
// in Chromium, which a vanilla curl smoke test can never see.
//
// `webServer` boots `node server.js` with the same env vars the node:test
// suite uses, against the same Postgres instance. Tests run against the
// live HTML/JS bundle so this exercises the real frontend code path.

module.exports = {
  testDir: 'tests/browser',
  // Browser smoke is allowed to be slower than backend tests because we're
  // booting Chromium and waiting on real renders. 60s per test is plenty
  // for a single tab click; CI will timeout the whole job at 10 min.
  timeout: 60_000,
  expect: { timeout: 10_000 },
  // One worker keeps server contention low and DB seeding deterministic.
  // We can lift this later if more browser tests get added.
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],

  use: {
    baseURL: 'http://127.0.0.1:3007',
    // Capture artifacts on failure — invaluable for diagnosing CI flake.
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],

  // Boot the server before tests run. Playwright kills it after.
  // Port 3007 chosen to not collide with the typical 3000 dev port; the
  // backend tests already run on ephemeral ports so there's no overlap.
  webServer: {
    command: 'node server.js',
    url: 'http://127.0.0.1:3007/login',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    env: {
      // Reuse the same env contract as tests/_helpers.js. CI sets
      // TEST_DATABASE_URL on the job; the webServer needs DATABASE_URL
      // because server.js reads that name (no helper to remap).
      DATABASE_URL: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL || '',
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'test_admin_password_123',
      JWT_SECRET: process.env.JWT_SECRET || 'browser-smoke-jwt-secret',
      NODE_ENV: 'test',
      PORT: '3007',
    },
  },
};
