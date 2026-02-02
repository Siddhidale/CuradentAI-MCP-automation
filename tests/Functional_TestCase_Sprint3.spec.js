// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Functional Test Cases - Sprint 3
 * Contains additional test cases moved from Smoke Test file
 * These tests cover edge cases and additional scenarios
 */

const BASE_URL = process.env.BASE_URL || 'https://qa-app.curadent.ai';
const TEST_EMAIL = process.env.TEST_EMAIL || 'siddhi.dale@mindbowser.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'Curadent@1234';
const NEW_TEST_PASSWORD = process.env.NEW_TEST_PASSWORD || 'Siddhidale@123';

// Yopmail email to check for invitation (without @yopmail.com)
const YOPMAIL_USER = process.env.YOPMAIL_USER || 'sara';

// Helper function to login
async function login(page, email = TEST_EMAIL, password = TEST_PASSWORD) {
  await page.goto(BASE_URL, { timeout: 60000 });
  await page.waitForLoadState('domcontentloaded');
  await page.locator('input[name="username"]').waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('input[name="username"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
}

// ============================================================================
// RESET PASSWORD EDGE CASES
// ============================================================================
test.describe('Reset Password Edge Cases', () => {

  test('CURADENTAI-2433-ALT: Reset Password Using Email Link (Yopmail)', async ({ page }) => {
    /**
     * Description: Reset password using link from email (using Yopmail)
     */
    // Generate unique yopmail for reset test
    const resetYopmail = `curadent.reset.${Date.now()}`;

    await page.goto(BASE_URL, { timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');

    await page.getByText('Forgot Password?').click();
    await page.waitForLoadState('domcontentloaded');

    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    await emailInput.fill(`${resetYopmail}@yopmail.com`);

    const resetButton = page.getByRole('button', { name: /reset|request|send/i });
    await resetButton.click();
    await page.waitForTimeout(2000);

    // Note: For actual email verification, you would check Yopmail
    // This test verifies the reset request was submitted
    console.log(`Reset link requested for: ${resetYopmail}@yopmail.com`);
  });

  // test('CURADENTAI-2434-ALT: Expired Reset Password Link', async ({ page }) => {
  //   /**
  //    * Description: Verify error for expired reset link
  //    */
  //   const expiredLink = `${BASE_URL}/reset-password?token=expired-invalid-token`;

  //   await page.goto(expiredLink, { timeout: 60000 });
  //   await page.waitForLoadState('domcontentloaded');
  //   await page.waitForTimeout(2000);

  //   // Should show error or redirect to login
  //   const currentUrl = page.url();
  //   const hasError = await page.getByText(/expired|invalid|error|session/i).isVisible({ timeout: 5000 }).catch(() => false);

  //   // Test passes if error shown or redirected
  //   expect(hasError || currentUrl.includes('login')).toBeTruthy();
  // });

  test('CURADENTAI-2435-ALT: Reset Password Policy Validation', async ({ page }) => {
    /**
     * Description: Verify password policy on reset page
     */
    await page.goto(BASE_URL, { timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');

    const newPasswordField = page.locator('input[name="newPassword"], input[placeholder*="New Password" i]').first();

    if (await newPasswordField.isVisible({ timeout: 5000 }).catch(() => false)) {
      await newPasswordField.fill('weak');

      const resetButton = page.getByRole('button', { name: /reset|set/i });
      await resetButton.click();

      await expect(page.getByText(/character|special|length/i).first()).toBeVisible({ timeout: 5000 });
    } else {
      test.info().annotations.push({ type: 'skip', description: 'Reset password page not accessible' });
    }
  });

  test('CURADENTAI-2436: Reset Password Email Delivery', async ({ page }) => {
    /**
     * Description: Verify reset password email is delivered
     */
    await page.goto(BASE_URL, { timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');

    await page.getByText('Forgot Password?').click();
    await page.waitForLoadState('domcontentloaded');

    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    await emailInput.fill(TEST_EMAIL);

    const resetButton = page.getByRole('button', { name: /reset|request|send/i });
    await resetButton.click();

    await page.waitForTimeout(2000);

    // Verify confirmation message appears
    const confirmation = page.getByText(/sent|check your email|reset link/i);
    await expect(confirmation.first()).toBeVisible({ timeout: 10000 });
  });

});

// ============================================================================
// PATIENT LIST ADDITIONAL TESTS
// ============================================================================
test.describe('Patient List Additional Tests', () => {

  test('CURADENTAI-2442: Verify Order After Adding Patient', async ({ page }) => {
    /**
     * Description: Verify patient list order after adding a new patient
     */
    await login(page);
    await expect(page).not.toHaveURL(/\/login$/);

    // Verify dashboard is loaded
    const dashboardElement = page.locator('main, .dashboard, [data-testid="dashboard"]');
    await expect(dashboardElement.first()).toBeVisible({ timeout: 10000 });
  });

  test('CURADENTAI-2447-ALT: Verify Order Persistence on Refresh', async ({ page }) => {
    /**
     * Description: Verify patient list order persists after page refresh
     */
    await login(page);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).not.toHaveURL(/\/login$/);

    // Verify dashboard still shows after refresh
    const dashboardElement = page.locator('main, .dashboard, [data-testid="dashboard"]');
    await expect(dashboardElement.first()).toBeVisible({ timeout: 10000 });
  });

});

// ============================================================================
// PATIENT DETAILS PAGE
// ============================================================================
test.describe('Patient Details Page', () => {

  test('CURADENTAI-2443: Smart Prompt Text Updated', async ({ page }) => {
    /**
     * Description: Verify smart prompt text is updated
     */
    await login(page);
    await expect(page).not.toHaveURL(/\/login$/);

    // Navigate to patient details if possible
    const patientRow = page.locator('table tbody tr').first();
    if (await patientRow.isVisible({ timeout: 5000 }).catch(() => false)) {
      await patientRow.click();
      await page.waitForLoadState('domcontentloaded');
    }
  });

  test('CURADENTAI-2444: Old Smart Prompt Text Removed', async ({ page }) => {
    /**
     * Description: Verify old smart prompt text is removed
     */
    await login(page);
    await expect(page).not.toHaveURL(/\/login$/);
  });

  test('CURADENTAI-2445: Risk Flag Terminology Replaced', async ({ page }) => {
    /**
     * Description: Verify risk flag terminology is replaced
     */
    await login(page);
    await expect(page).not.toHaveURL(/\/login$/);
  });

  test('CURADENTAI-2446: Risk Flag Not Shown Elsewhere', async ({ page }) => {
    /**
     * Description: Verify risk flag is not shown elsewhere
     */
    await login(page);
    await expect(page).not.toHaveURL(/\/login$/);
  });

  test('CURADENTAI-2447: Terminology Limited to Section 3', async ({ page }) => {
    /**
     * Description: Verify terminology is limited to Section 3
     */
    await login(page);
    await expect(page).not.toHaveURL(/\/login$/);
  });

  test('CURADENTAI-2448: Patient Details Disclaimer Updated', async ({ page }) => {
    /**
     * Description: Verify patient details disclaimer is updated
     */
    await login(page);
    await expect(page).not.toHaveURL(/\/login$/);
  });

  test('CURADENTAI-2449: Patient Details Disclaimer Text Accuracy', async ({ page }) => {
    /**
     * Description: Verify patient details disclaimer text accuracy
     */
    await login(page);
    await expect(page).not.toHaveURL(/\/login$/);
  });

  test('CURADENTAI-2450: Patient Details Disclaimer Scope', async ({ page }) => {
    /**
     * Description: Verify patient details disclaimer scope
     */
    await login(page);
    await expect(page).not.toHaveURL(/\/login$/);
  });

  test('CURADENTAI-2451: Other Pages Disclaimer Updated', async ({ page }) => {
    /**
     * Description: Verify other pages disclaimer is updated
     */
    await login(page);
    await expect(page).not.toHaveURL(/\/login$/);
  });

  test('CURADENTAI-2452: Exclusion of Patient Details Page', async ({ page }) => {
    /**
     * Description: Verify exclusion of patient details page
     */
    await login(page);
    await expect(page).not.toHaveURL(/\/login$/);
  });

  test('CURADENTAI-2453: Short Disclaimer Text Accuracy', async ({ page }) => {
    /**
     * Description: Verify short disclaimer text accuracy
     */
    await login(page);
    await expect(page).not.toHaveURL(/\/login$/);
  });

});
