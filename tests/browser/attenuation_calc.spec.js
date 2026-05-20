// Browser smoke test — Fiber Attenuation Calculator (public/js/attenuation_calc.js)
//
// Verifies the calculator is correctly mounted in the design portal header,
// opens on button click, and computes the correct dB loss for a known set of
// inputs. No backend DB required — the calculator is purely client-side math.
//
// Math verification (primary check):
//   G.652.D, 1550 nm, 10 km span, 3 splices @ 0.10 dB, 2 connectors @ 0.50 dB
//   fiberLoss       = 10 × 0.22 = 2.20 dB
//   spliceLossTotal = 3  × 0.10 = 0.30 dB
//   connLossTotal   = 2  × 0.50 = 1.00 dB
//   total                       = 3.50 dB   ← asserted below
//
// G.657.A2 math verification (corrected coefficients per ITU-T G.657 §6.1):
//   G.657.A2, 1550 nm, 10 km span, 2 splices @ 0.10 dB, 2 connectors @ 0.50 dB
//   fiberLoss       = 10 × 0.21 = 2.10 dB   (corrected from 0.25 to 0.21 dB/km)
//   spliceLossTotal = 2  × 0.10 = 0.20 dB
//   connLossTotal   = 2  × 0.50 = 1.00 dB
//   total                       = 3.30 dB   ← asserted below
//
// G.655 @ 1310 nm blocked: UI must show warning and not compute a result.

const { test, expect } = require('@playwright/test');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test_admin_password_123';

// Helper: log in and navigate to the design portal.
async function loginAndGoDesign(page) {
  await page.goto('/login');
  await page.fill('#username', ADMIN_USERNAME);
  await page.fill('#password', ADMIN_PASSWORD);
  await page.click('#submit-btn');
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15_000 });
  await page.goto('/design.html');
  // Wait until the page has settled (design portal loads project table)
  await page.waitForTimeout(1500);
}

test.describe('Fiber Attenuation Calculator — design portal', () => {

  test('1. Calculator button visible in design portal header', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (err) => { pageErrors.push(err); console.error('[pageerror]', err.message); });

    await loginAndGoDesign(page);

    // The mountAttenuationCalc call injects a button into #att-calc-btn-wrap
    const btn = page.locator('#att-calc-btn-wrap button');
    await expect(btn).toBeVisible({ timeout: 8_000 });
    await expect(btn).toHaveText(/Attenuation Calc/i);

    expect(pageErrors).toHaveLength(0);
  });

  test('2. Click button opens calculator modal with expected fields', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (err) => { pageErrors.push(err); console.error('[pageerror]', err.message); });

    await loginAndGoDesign(page);

    // Open the modal
    await page.click('#att-calc-btn-wrap button');

    // Modal overlay appears
    const overlay = page.locator('#att-calc-modal-overlay');
    await expect(overlay).toBeVisible({ timeout: 5_000 });

    // Key form fields are present
    await expect(page.locator('#att-fiber-type')).toBeVisible();
    await expect(page.locator('#att-span')).toBeVisible();
    await expect(page.locator('#att-splices')).toBeVisible();
    await expect(page.locator('#att-connectors')).toBeVisible();

    // Wavelength radio group
    await expect(page.locator('input[name="att-wl"][value="1310"]')).toBeAttached();
    await expect(page.locator('input[name="att-wl"][value="1490"]')).toBeAttached();
    await expect(page.locator('input[name="att-wl"][value="1550"]')).toBeAttached();

    // Results section
    await expect(page.locator('#att-r-total')).toBeVisible();

    expect(pageErrors).toHaveLength(0);
  });

  test('3. Math correctness: G.652.D, 1550 nm, 10 km, 3 splices, 2 connectors → 3.50 dB', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (err) => { pageErrors.push(err); console.error('[pageerror]', err.message); });

    await loginAndGoDesign(page);

    // Open modal
    await page.click('#att-calc-btn-wrap button');
    await expect(page.locator('#att-calc-modal-overlay')).toBeVisible({ timeout: 5_000 });

    // Set fiber type: G.652.D (should be default, but set explicitly)
    await page.selectOption('#att-fiber-type', 'G.652.D');

    // Set wavelength: 1550 nm
    await page.click('input[name="att-wl"][value="1550"]');

    // Set span: 10 km (unit default is km)
    await page.locator('#att-unit-m').click(); // ensure km unit is active
    await page.fill('#att-span', '10');

    // Set splices: 3
    await page.fill('#att-splices', '3');

    // Set connectors: 2
    await page.fill('#att-connectors', '2');

    // Allow reactive update to settle
    await page.waitForTimeout(200);

    // Assert total loss = 3.50 dB
    // fiberLoss = 10 × 0.22 = 2.20 dB
    // spliceLoss = 3 × 0.10 = 0.30 dB
    // connLoss = 2 × 0.50 = 1.00 dB
    // total = 3.50 dB
    const totalText = await page.locator('#att-r-total').textContent();
    expect(totalText).toContain('3.50');

    // Component breakdown assertions
    const fiberText = await page.locator('#att-r-fiber').textContent();
    expect(fiberText).toContain('2.20');

    const spliceText = await page.locator('#att-r-splice').textContent();
    expect(spliceText).toContain('0.30');

    const connText = await page.locator('#att-r-conn').textContent();
    expect(connText).toContain('1.00');

    // Sanity check should be green (3.50 dB < 28 dB green threshold for 1550 nm)
    await expect(page.locator('#att-sanity.green')).toBeVisible();

    expect(pageErrors).toHaveLength(0);
  });

  test('4. Unit toggle: feet input converts correctly', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (err) => { pageErrors.push(err); console.error('[pageerror]', err.message); });

    await loginAndGoDesign(page);
    await page.click('#att-calc-btn-wrap button');
    await expect(page.locator('#att-calc-modal-overlay')).toBeVisible({ timeout: 5_000 });

    // Select G.652.D, 1550 nm, switch to feet
    await page.selectOption('#att-fiber-type', 'G.652.D');
    await page.click('input[name="att-wl"][value="1550"]');

    // 3280.84 feet = 1 km, so 3280.84 ft × 0.22 dB/km = 0.22 dB fiber loss
    await page.click('#att-unit-ft');
    await page.fill('#att-span', '3280.84');
    await page.fill('#att-splices', '0');
    await page.fill('#att-connectors', '0');

    await page.waitForTimeout(200);

    // Fiber loss should be 0.22 dB (1 km × 0.22 dB/km)
    const fiberText = await page.locator('#att-r-fiber').textContent();
    const fiberVal = parseFloat(fiberText);
    // Allow ±0.01 dB rounding from the feet→km conversion
    expect(fiberVal).toBeGreaterThan(0.21);
    expect(fiberVal).toBeLessThan(0.23);

    expect(pageErrors).toHaveLength(0);
  });

  test('5. Red sanity check fires when total exceeds 35 dB (1550 nm yellow threshold)', async ({ page }) => {
    // NEW-1 fix: LOW-B1 raised 1550 nm thresholds to green=28, yellow=35.
    // 160 km × 0.22 dB/km = 35.20 dB which exceeds the yellow threshold (35 dB) → RED.
    // (Old 150 km test produced 33 dB which now falls between green=28 and yellow=35 → YELLOW, not RED.)
    const pageErrors = [];
    page.on('pageerror', (err) => { pageErrors.push(err); console.error('[pageerror]', err.message); });

    await loginAndGoDesign(page);
    await page.click('#att-calc-btn-wrap button');
    await expect(page.locator('#att-calc-modal-overlay')).toBeVisible({ timeout: 5_000 });

    await page.selectOption('#att-fiber-type', 'G.652.D');
    await page.click('input[name="att-wl"][value="1550"]');
    // 160 km × 0.22 dB/km = 35.20 dB — exceeds the 35 dB yellow threshold → RED
    await page.locator('#att-unit-m').click();
    await page.fill('#att-span', '160');
    await page.fill('#att-splices', '0');
    await page.fill('#att-connectors', '0');

    await page.waitForTimeout(200);

    // Sanity should show red (35.20 dB > 35 dB yellow threshold)
    await expect(page.locator('#att-sanity.red')).toBeVisible();

    expect(pageErrors).toHaveLength(0);
  });

  test('6. Modal closes on Escape key', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (err) => { pageErrors.push(err); console.error('[pageerror]', err.message); });

    await loginAndGoDesign(page);
    await page.click('#att-calc-btn-wrap button');
    await expect(page.locator('#att-calc-modal-overlay')).toBeVisible({ timeout: 5_000 });

    await page.keyboard.press('Escape');
    await expect(page.locator('#att-calc-modal-overlay')).not.toBeVisible({ timeout: 3_000 });

    expect(pageErrors).toHaveLength(0);
  });

  test('7. Advanced override changes per-splice loss in calculation', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (err) => { pageErrors.push(err); console.error('[pageerror]', err.message); });

    await loginAndGoDesign(page);
    await page.click('#att-calc-btn-wrap button');
    await expect(page.locator('#att-calc-modal-overlay')).toBeVisible({ timeout: 5_000 });

    await page.selectOption('#att-fiber-type', 'G.652.D');
    await page.click('input[name="att-wl"][value="1550"]');
    await page.locator('#att-unit-m').click();
    await page.fill('#att-span', '0');     // zero fiber loss for clean isolation
    await page.fill('#att-splices', '10');
    await page.fill('#att-connectors', '0');

    // Open advanced section
    await page.click('#att-adv-toggle');
    await expect(page.locator('#att-adv-section.open')).toBeVisible();

    // Set per-splice to 0.20 dB
    await page.fill('#att-splice-loss-override', '0.20');
    await page.waitForTimeout(200);

    // 10 × 0.20 = 2.00 dB
    const spliceText = await page.locator('#att-r-splice').textContent();
    expect(spliceText).toContain('2.00');

    const totalText = await page.locator('#att-r-total').textContent();
    expect(totalText).toContain('2.00');

    expect(pageErrors).toHaveLength(0);
  });

  test('8. _attCalc.calculate() is exposed for unit testing', async ({ page }) => {
    // Verifies the exported test helper works correctly for CI math validation.
    await loginAndGoDesign(page);

    // Wait for the script to load
    await page.waitForFunction(() => window._attCalc !== undefined, { timeout: 8_000 });

    const result = await page.evaluate(() => {
      return window._attCalc.calculate({
        spanKm: 10,
        fiberType: 'G.652.D',
        wavelength: 1550,
        splices: 3,
        spliceLoss: 0.10,
        connectors: 2,
        connLoss: 0.50
      });
    });

    // fiberLoss = 10 × 0.22 = 2.20
    expect(result.fiberLoss).toBeCloseTo(2.20, 5);
    // spliceLossTotal = 3 × 0.10 = 0.30
    expect(result.spliceLossTotal).toBeCloseTo(0.30, 5);
    // connLossTotal = 2 × 0.50 = 1.00
    expect(result.connLossTotal).toBeCloseTo(1.00, 5);
    // total = 3.50
    expect(result.total).toBeCloseTo(3.50, 5);
  });

  // MED-A1: G.657.A2 math correctness (corrected coefficients per ITU-T G.657 §6.1)
  test('9. Math correctness: G.657.A2, 1550 nm, 10 km, 2 splices, 2 connectors → 3.30 dB', async ({ page }) => {
    // G.657.A2 @ 1550 nm corrected coefficient: 0.21 dB/km (ITU-T G.657 §6.1 max ≤0.21 dB/km)
    // fiberLoss       = 10 km × 0.21 dB/km = 2.10 dB
    // spliceLossTotal = 2 × 0.10 dB         = 0.20 dB
    // connLossTotal   = 2 × 0.50 dB         = 1.00 dB
    // total           = 2.10 + 0.20 + 1.00  = 3.30 dB
    await loginAndGoDesign(page);

    await page.waitForFunction(() => window._attCalc !== undefined, { timeout: 8_000 });

    const result = await page.evaluate(() => {
      return window._attCalc.calculate({
        spanKm: 10,
        fiberType: 'G.657.A2',
        wavelength: 1550,
        splices: 2,
        spliceLoss: 0.10,
        connectors: 2,
        connLoss: 0.50
      });
    });

    // fiberLoss = 10 × 0.21 = 2.10  (corrected from old wrong value 0.25 → 2.50)
    expect(result.fiberLoss).toBeCloseTo(2.10, 5);
    expect(result.spliceLossTotal).toBeCloseTo(0.20, 5);
    expect(result.connLossTotal).toBeCloseTo(1.00, 5);
    expect(result.total).toBeCloseTo(3.30, 5);
  });

  // MED-A1: G.657.A2 math correctness @ 1310 nm
  test('10. Math correctness: G.657.A2, 1310 nm _attCalc API → correct coefficient 0.35 dB/km', async ({ page }) => {
    // G.657.A2 @ 1310 nm corrected coefficient: 0.35 dB/km (ITU-T G.657 §6.1 max ≤0.35 dB/km)
    // fiberLoss = 5 km × 0.35 dB/km = 1.75 dB  (old wrong value: 5 × 0.40 = 2.00 dB)
    await loginAndGoDesign(page);

    await page.waitForFunction(() => window._attCalc !== undefined, { timeout: 8_000 });

    const result = await page.evaluate(() => {
      return window._attCalc.calculate({
        spanKm: 5,
        fiberType: 'G.657.A2',
        wavelength: 1310,
        splices: 0,
        spliceLoss: 0.10,
        connectors: 0,
        connLoss: 0.50
      });
    });

    // Corrected coefficient: 0.35 dB/km @ 1310 nm per ITU-T G.657 §6.1
    expect(result.fiberLoss).toBeCloseTo(1.75, 5);  // 5 × 0.35
    expect(result.coeff).toBeCloseTo(0.35, 5);
    expect(result.total).toBeCloseTo(1.75, 5);
  });

  // MED-A1: G.655 @ 1310 nm must throw (blocked combination)
  test('11. _attCalc.calculate() throws on G.655 @ 1310 nm (out-of-spec combo)', async ({ page }) => {
    // G.655 has no ITU-T specification at 1310 nm (λ_cc ≤ 1480 nm).
    // calculate() must throw with a descriptive error, not return NaN.
    await loginAndGoDesign(page);

    await page.waitForFunction(() => window._attCalc !== undefined, { timeout: 8_000 });

    const threw = await page.evaluate(() => {
      try {
        window._attCalc.calculate({
          spanKm: 5, fiberType: 'G.655', wavelength: 1310,
          splices: 0, spliceLoss: 0.10, connectors: 0, connLoss: 0.50
        });
        return false; // did not throw — test should fail
      } catch (e) {
        return e.message.includes('1310') || e.message.includes('cutoff');
      }
    });

    expect(threw).toBe(true);
  });

  // MED-A1: G.655 @ 1310 nm UI — 1310 nm radio is disabled (combination is blocked)
  test('12. UI: G.655 selected disables 1310 nm radio (G.655 + 1310 nm is out-of-spec)', async ({ page }) => {
    // NEW-2 fix: when G.655 is selected with 1310nm active, the UI auto-switches to 1490nm.
    // After the auto-switch, blocked = G.655+1490nm = false, so the warning hides.
    // The stable observable state is: the 1310nm radio is disabled (aria-disabled + input.disabled).
    // We assert that rather than the transient warning visibility.
    const pageErrors = [];
    page.on('pageerror', (err) => { pageErrors.push(err); console.error('[pageerror]', err.message); });

    await loginAndGoDesign(page);
    await page.click('#att-calc-btn-wrap button');
    await expect(page.locator('#att-calc-modal-overlay')).toBeVisible({ timeout: 5_000 });

    // Select G.655 — UI will auto-switch away from 1310nm and mark the radio disabled
    await page.selectOption('#att-fiber-type', 'G.655');
    await page.waitForTimeout(300);

    // The 1310 nm radio should be disabled — G.655 has no ITU-T spec at 1310 nm
    const radio1310 = page.locator('input[name="att-wl"][value="1310"]');
    await expect(radio1310).toBeDisabled({ timeout: 3_000 });

    expect(pageErrors).toHaveLength(0);
  });

});

// MED-A1: splice matrix portal mount test
test.describe('Fiber Attenuation Calculator — splice matrix portal', () => {

  async function loginAndGoSplice(page) {
    await page.goto('/login');
    await page.fill('#username', ADMIN_USERNAME);
    await page.fill('#password', ADMIN_PASSWORD);
    await page.click('#submit-btn');
    await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15_000 });
    await page.goto('/splice.html');
    await page.waitForTimeout(1500);
  }

  test('S1. Calculator button visible in splice matrix portal header', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (err) => { pageErrors.push(err); console.error('[pageerror]', err.message); });

    await loginAndGoSplice(page);

    const btn = page.locator('#att-calc-btn-wrap button');
    await expect(btn).toBeVisible({ timeout: 8_000 });
    await expect(btn).toHaveText(/Attenuation Calc/i);

    expect(pageErrors).toHaveLength(0);
  });

  test('S2. G.657.A2 spot-check via _attCalc in splice portal', async ({ page }) => {
    // Verifies the same corrected G.657.A2 coefficients are available in the splice portal.
    await loginAndGoSplice(page);

    await page.waitForFunction(() => window._attCalc !== undefined, { timeout: 8_000 });

    const coeff = await page.evaluate(() => {
      return window._attCalc.FIBER_COEFFICIENTS['G.657.A2'].coeffs[1550];
    });

    // Must be 0.21 (corrected per ITU-T G.657 §6.1), NOT old wrong value 0.25
    expect(coeff).toBeCloseTo(0.21, 5);
  });

});
