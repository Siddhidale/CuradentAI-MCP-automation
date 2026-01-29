// @ts-check
import { test } from '@playwright/test';

test('Debug: Capture Forgot Password page', async ({ page }) => {
  const baseUrl = process.env.BASE_URL || 'https://dev-app.curadent.ai/login';
  await page.goto(baseUrl);
  await page.waitForLoadState('networkidle');

  // Click Forgot Password
  await page.getByText('Forgot Password?').click();
  await page.waitForLoadState('networkidle');

  // Take screenshot
  await page.screenshot({ path: 'forgot-password-screenshot.png', fullPage: true });

  // Log page content
  console.log('Page URL:', page.url());
  console.log('Page Title:', await page.title());

  // Log all visible text
  const bodyText = await page.locator('body').innerText();
  console.log('Page text:', bodyText.substring(0, 2000));
});
