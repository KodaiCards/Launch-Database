import { test, expect, Page } from '@playwright/test';

test.describe('Document Scanner', () => {
  let page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();

    // Navigate to the app and authenticate
    await page.goto('http://localhost:3000/photos/');

    // Wait for auth check
    await page.waitForTimeout(1000);

    // Check if we're authenticated (looking for the app container)
    const appContainer = await page.locator('#app').isVisible().catch(() => false);

    if (!appContainer) {
      // If not authenticated, we might need to mock auth or skip
      console.warn('Not authenticated, test may fail');
    }
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('should navigate to scanner page', async () => {
    // Click the "Scan Document" button
    const scanButton = page.locator('a:has-text("📄 Scan Document")');
    await expect(scanButton).toBeVisible();

    await scanButton.click();

    // Should navigate to scanner.html
    await page.waitForURL('**/scanner.html');
    expect(page.url()).toContain('scanner.html');
  });

  test('scanner page should have required elements', async () => {
    await page.goto('http://localhost:3000/photos/scanner.html');

    // Check header
    const header = page.locator('.scanner-header h1');
    await expect(header).toHaveText('Document Scanner');

    // Check back button
    const backButton = page.locator('.btn-back');
    await expect(backButton).toBeVisible();

    // Check capture step
    const captureStep = page.locator('#step-capture');
    await expect(captureStep).toBeVisible();
  });

  test('scanner page should have camera elements or error message', async () => {
    await page.goto('http://localhost:3000/photos/scanner.html');

    // Wait a moment for OpenCV to potentially load
    await page.waitForTimeout(1000);

    // Check if either video element or camera error is present
    const videoElement = page.locator('#camera-video');
    const errorMessage = page.locator('#camera-error');

    const hasVideo = await videoElement.isVisible().catch(() => false);
    const hasError = await errorMessage.isVisible().catch(() => false);

    // At least one should be present
    expect(hasVideo || hasError).toBeTruthy();
  });

  test('scanner page should have capture button', async () => {
    await page.goto('http://localhost:3000/photos/scanner.html');

    const captureButton = page.locator('#btn-capture');
    await expect(captureButton).toBeVisible();
    await expect(captureButton).toContainText('Capture');
  });

  test('scanner page should have OpenCV and jscanify script tags', async () => {
    await page.goto('http://localhost:3000/photos/scanner.html');

    // Check for script tags
    const scripts = page.locator('script');
    const scriptCount = await scripts.count();

    // Should have multiple scripts including vendor libs
    expect(scriptCount).toBeGreaterThan(2);

    // Check that src attributes contain expected files
    const html = await page.content();
    expect(html).toContain('opencv.min.js');
    expect(html).toContain('jscanify.min.js');
    expect(html).toContain('scanner.js');
  });

  test('adjust step elements should be present but hidden initially', async () => {
    await page.goto('http://localhost:3000/photos/scanner.html');

    const adjustStep = page.locator('#step-adjust');
    const canvas = page.locator('#adjust-canvas');
    const cornerHandles = page.locator('.corner-handle');

    // Should exist in DOM but be hidden
    expect(await adjustStep.isVisible()).toBe(false);
    await expect(canvas).toBeInDOM();
    await expect(cornerHandles.first()).toBeInDOM();
  });

  test('enhance step elements should be present but hidden initially', async () => {
    await page.goto('http://localhost:3000/photos/scanner.html');

    const enhanceStep = page.locator('#step-enhance');
    const filterTabs = page.locator('.tab-btn');
    const uploadButton = page.locator('#btn-upload');

    // Should exist in DOM but be hidden
    expect(await enhanceStep.isVisible()).toBe(false);
    await expect(filterTabs.first()).toBeInDOM();
    await expect(uploadButton).toBeInDOM();
  });

  test('scanner page has required form controls', async () => {
    await page.goto('http://localhost:3000/photos/scanner.html');

    // Enhance step form controls
    const caption = page.locator('#enhance-caption');
    const project = page.locator('#enhance-project');
    const gpsToggle = page.locator('#enhance-gps');

    await expect(caption).toBeInDOM();
    await expect(project).toBeInDOM();
    await expect(gpsToggle).toBeInDOM();
  });

  test('back button should navigate to index.html', async () => {
    await page.goto('http://localhost:3000/photos/scanner.html');

    const backButton = page.locator('.btn-back');
    await backButton.click();

    await page.waitForURL('**/index.html');
    expect(page.url()).toContain('index.html');
  });
});
