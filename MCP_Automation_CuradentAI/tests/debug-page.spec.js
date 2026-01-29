// @ts-check
import { test } from '@playwright/test';

test('Debug: Capture sign-in page', async ({ page }) => {
  const baseUrl = process.env.BASE_URL || 'https://qa-app.curadent.ai';
  await page.goto(baseUrl);

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Take screenshot
  await page.screenshot({ path: 'sign-in-page-screenshot.png', fullPage: true });

  // Log page content for debugging
  const content = await page.content();
  console.log('Page URL:', page.url());
  console.log('Page Title:', await page.title());

  // Log all visible input fields
  const inputs = await page.locator('input').all();
  console.log('Found inputs:', inputs.length);
  for (const input of inputs) {
    const type = await input.getAttribute('type');
    const name = await input.getAttribute('name');
    const placeholder = await input.getAttribute('placeholder');
    const id = await input.getAttribute('id');
    console.log(`Input - type: ${type}, name: ${name}, placeholder: ${placeholder}, id: ${id}`);
  }

  // Log all visible text on page
  const bodyText = await page.locator('body').innerText();
  console.log('Page text:', bodyText.substring(0, 2000));
});
