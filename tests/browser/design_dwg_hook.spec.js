const { test, expect } = require('@playwright/test');

test.describe('Design Portal DWG Export Hook', () => {
  test('should display Export DWGs button in pipeline header', async ({ page }) => {
    await page.goto('/design.html');

    // Wait for page to load and check button exists
    const exportBtn = page.locator('text=Export DWGs');
    await expect(exportBtn).toBeVisible();
  });

  test('Export DWGs button should open offline-sync.html in new tab', async ({ context, page }) => {
    await page.goto('/design.html');

    // Listen for new page/tab opening
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click('button:has-text("Export DWGs")')
    ]);

    // Verify the new page navigated to offline-sync.html
    await newPage.waitForLoadState('domcontentloaded');
    expect(newPage.url()).toContain('/offline-sync.html');

    // Verify the page title indicates it's the offline sync page
    const pageTitle = await newPage.locator('h1').first();
    await expect(pageTitle).toContainText('Offline DWG Sync');

    await newPage.close();
  });

  test('Export DWGs button should have correct icon and styling', async ({ page }) => {
    await page.goto('/design.html');

    const exportBtn = page.locator('button:has-text("Export DWGs")');

    // Check the button has the cloud-arrow-down icon
    const icon = exportBtn.locator('i.fa-solid');
    await expect(icon).toHaveClass(/fa-cloud-arrow-down/);

    // Verify button has correct styling classes
    await expect(exportBtn).toHaveClass(/btn-secondary/);
    await expect(exportBtn).toHaveClass(/btn-sm/);
  });
});
