// Browser walk — every PUBLISHED training lesson renders with 0 console errors
// and its assessment mounts. Stage 3 of `npm run premerge` (GATES §premerge, WO-3).
//
// Strategy: spider the live SPA rather than hard-code a lesson list, so the walk
// automatically covers whatever the catalog marks `available: true`. From the OSP
// splash we collect every course tile, and from each course page every lesson
// link, then visit each lesson and fail on any pageerror / console error.
//
// Boots via playwright.config.js `webServer` (node server.js against Postgres),
// so this stage needs DATABASE_URL — it runs in the Registrar's premerge
// environment, not on a foreman branch (foremen have no DB access).

const { test, expect } = require('@playwright/test');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test_admin_password_123';

// Console/page errors that are environmental noise, not lesson bugs. Kept
// deliberately narrow: only the training API 4xx/5xx a bare test DB produces and
// favicon. (A blanket "Failed to load resource" ignore would mask real breakage —
// a missing JS chunk or lesson asset — which is exactly what this walk must catch.)
const IGNORE = [
  /\/api\/training\/.*\b(404|500)\b/i,
  /favicon/i,
];
const isReal = (msg) => !IGNORE.some((re) => re.test(msg));

async function login(page) {
  await page.goto('/login');
  await page.fill('#username', ADMIN_USERNAME);
  await page.fill('#password', ADMIN_PASSWORD);
  await page.click('#submit-btn');
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15_000 });
}

// Collect hrefs on the current SPA view matching a hash-route fragment.
async function hashLinks(page, fragment) {
  return page.$$eval(
    'a[href]',
    (as, frag) =>
      Array.from(new Set(
        as.map((a) => a.getAttribute('href'))
          .filter((h) => h && h.includes(frag)),
      )),
    fragment,
  );
}

test.describe('Training — published lesson walk', () => {
  test('every published lesson renders clean and loads its assessment', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => { if (isReal(e.message)) errors.push(`[pageerror] ${e.message}`); });
    page.on('console', (m) => { if (m.type() === 'error' && isReal(m.text())) errors.push(`[console] ${m.text()}`); });

    await login(page);

    // OSP splash — general topics.
    await page.goto('/training/#/osp');
    await page.waitForLoadState('networkidle');
    const courseLinks = await hashLinks(page, '/course/');
    expect(courseLinks.length, 'splash lists at least one published course').toBeGreaterThan(0);

    // Reduce to unique course IDs (drop any /lesson/ deep links on the splash).
    const courseIds = Array.from(new Set(
      courseLinks
        .map((h) => (h.match(/\/course\/([^/]+)(?:$|\?)/) || [])[1])
        .filter(Boolean),
    ));

    let lessonsWalked = 0;
    for (const courseId of courseIds) {
      await page.goto(`/training/#/course/${courseId}`);
      await page.waitForLoadState('networkidle');
      const lessonLinks = await hashLinks(page, `/course/${courseId}/lesson/`);

      for (const href of lessonLinks) {
        const route = href.replace(/^#/, '');
        await page.goto(`/training/#${route.startsWith('/') ? route : '/' + route}`);
        await page.waitForLoadState('networkidle');
        // Renders: the lesson layout heading is present.
        await expect(page.locator('h1, h2, h3').first(), `${route} renders a heading`).toBeVisible({ timeout: 10_000 });
        // Assessment loads: Quiz / PooledAssessment / TopicFinal render inside a
        // `.panel`. `.panel` is also used by other lesson primitives, so this asserts
        // the lesson mounted interactive content, not the assessment specifically — a
        // *precise* assessment-present assertion needs a stable hook (e.g.
        // data-testid="assessment-panel") on the shared Quiz/PooledAssessment
        // components, which is the shared-infra owner's to add (#46). Until then an
        // assessment that throws on mount is still caught by the 0-error check below.
        await expect(page.locator('.panel').first(), `${route} mounts a content/assessment panel`).toBeVisible({ timeout: 10_000 });
        lessonsWalked++;
      }
    }

    expect(lessonsWalked, 'walked at least one lesson').toBeGreaterThan(0);
    expect(errors, `console/page errors during walk:\n${errors.join('\n')}`).toHaveLength(0);
    console.log(`training walk: ${lessonsWalked} lessons across ${courseIds.length} courses, 0 real console errors`);
  });
});
