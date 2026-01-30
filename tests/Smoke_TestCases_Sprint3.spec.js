// @ts-check
import { test, expect } from '@playwright/test';
import { waitForEmail } from './helpers/zeptomail';

const BASE_URL = process.env.BASE_URL || 'https://dev-app.curadent.ai';
const TEST_EMAIL = process.env.TEST_EMAIL || 'siddhi.dale@mindbowser.com';

test.describe('First Time Login via Invitation Email', () => {

  test('CURADENTAI-2422: Launch Sign In via Invitation Email', async ({ page }) => {

    // Step 1: Read invitation email from ZeptoMail
    const email = await waitForEmail({
      apiUrl: process.env.ZEPTO_API_URL,
      apiKey: process.env.ZEPTO_API_KEY,
      to: TEST_EMAIL,
      subjectRegex: /invited to join curadentai/i,
    });

    // Step 2: Validate email content
    expect(email.userEmail).toBe(TEST_EMAIL);
    expect(email.tempPassword).toBeTruthy();
    expect(email.setupLink).toBeTruthy();

    // Step 3: Navigate via "Complete Your Setup" link
    await page.goto(email.setupLink);
    await page.waitForLoadState('networkidle');

    // Step 4: Login using temporary credentials
    await page.fill('input[name="username"]', email.userEmail);
    await page.fill('input[name="password"]', email.tempPassword);
    await page.click('button[type="submit"]');

    // Step 5: Verify first-time password setup screen
    await expect(
      page.getByText(/create new password/i)
    ).toBeVisible();
  });

});













// // @ts-check
// import { test, expect } from '@playwright/test';
// import { waitForEmail } from './helpers/zeptomail';

// /**
//  * Smoke Test Cases - Sprint 3
//  * Test Cases: CURADENTAI-2422 to CURADENTAI-2462
//  * Generated from Qase Test Management
//  */

// const BASE_URL = process.env.BASE_URL || 'https://dev-app.curadent.ai/login';

// // Test credentials - should be configured in .env file
// const TEST_EMAIL = process.env.TEST_EMAIL || 'siddhi.dale@mindbowser.com';
// const TEST_PASSWORD = process.env.TEST_PASSWORD || 'Test@123';

// test.describe('Sign In for First Time', () => {

//   test('CURADENTAI-2422: Launch Sign In Page', async ({ page }) => {
//     // Description: Verify that the invited user can open the CuradentAI sign-in screen
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     // Verify Sign In page loads with required elements
//     await expect(page.getByText('Sign In').first()).toBeVisible();
//     await expect(page.locator('input[name="username"]')).toBeVisible();
//     await expect(page.locator('input[name="password"]')).toBeVisible();
//     await expect(page.locator('input[type="checkbox"]')).toBeVisible();
//     await expect(page.getByText('Remember me')).toBeVisible();
//   });

//   test('CURADENTAI-2423: UI Sign In Page', async ({ page }) => {
//     // Description: Verify the UI of the Sign In page is as per design
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     // Verify UI elements match approved design
//     await expect(page.getByText('Sign In').first()).toBeVisible();
//     await expect(page.getByText('Enter your login credentials to continue.')).toBeVisible();
//     await expect(page.getByText('Email *')).toBeVisible();
//     await expect(page.getByText('Password *')).toBeVisible();
//     await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
//     await expect(page.getByText('Forgot Password?')).toBeVisible();
//     await expect(page.getByText('Sign Up here')).toBeVisible();
//   });

//   test('CURADENTAI-2424: Login with valid credentials', async ({ page }) => {
//     // Description: Verify user can log in with valid credentials
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     // Enter valid Login ID and password
//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);

//     // Click Sign In
//     await page.getByRole('button', { name: 'Sign In' }).click();

//     // Wait for navigation (either to Set New Password page or Dashboard)
//     await page.waitForLoadState('networkidle');

//     // Verify user is redirected (URL should change from login page)
//     await expect(page).not.toHaveURL(/\/login$/);
//   });

//   test('CURADENTAI-2425: Set new password on first login', async ({ page }) => {
//     // Description: Verify user can set a new password on first login
//     // Precondition: User is on Set New Password page
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     // This test assumes user is redirected to Set New Password page after first login
//     // Check if Set New Password elements are present
//     const newPasswordField = page.locator('input[name="newPassword"], input[placeholder*="New Password"]');
//     const confirmPasswordField = page.locator('input[name="confirmPassword"], input[placeholder*="Confirm Password"]');

//     if (await newPasswordField.isVisible({ timeout: 5000 }).catch(() => false)) {
//       await newPasswordField.fill('NewPassword@123');
//       await confirmPasswordField.fill('NewPassword@123');

//       const resetButton = page.getByRole('button', { name: /reset password/i });
//       await resetButton.click();

//       // Verify navigation to Dashboard
//       await page.waitForLoadState('networkidle');
//     }
//   });

//   test('CURADENTAI-2426: Password mismatch validation', async ({ page }) => {
//     // Description: Verify error message appears when passwords do not match
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     // Navigate to Set New Password page (via login or direct URL)
//     const newPasswordField = page.locator('input[name="newPassword"], input[placeholder*="New Password"]');
//     const confirmPasswordField = page.locator('input[name="confirmPassword"], input[placeholder*="Confirm Password"]');

//     if (await newPasswordField.isVisible({ timeout: 5000 }).catch(() => false)) {
//       // Enter mismatched passwords
//       await newPasswordField.fill('Abcd@1234');
//       await confirmPasswordField.fill('Abcd@1235');

//       const resetButton = page.getByRole('button', { name: /reset password/i });
//       await resetButton.click();

//       // Verify error message
//       await expect(page.getByText(/passwords do not match/i)).toBeVisible();
//     }
//   });

//   test('CURADENTAI-2427: Password policy validation', async ({ page }) => {
//     // Description: Verify password follows security rules
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     const newPasswordField = page.locator('input[name="newPassword"], input[placeholder*="New Password"]');

//     if (await newPasswordField.isVisible({ timeout: 5000 }).catch(() => false)) {
//       // Enter weak password
//       await newPasswordField.fill('weak');

//       const resetButton = page.getByRole('button', { name: /reset password/i });
//       await resetButton.click();

//       // Verify password policy validation message
//       await expect(page.getByText(/password/i).filter({ hasText: /character|special|length/i })).toBeVisible();
//     }
//   });

//   test('CURADENTAI-2428: Login after password reset', async ({ page }) => {
//     // Description: Verify user can log in using newly set password
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     // Enter credentials
//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();

//     await page.waitForLoadState('networkidle');

//     // Verify user lands on Dashboard
//     await expect(page).not.toHaveURL(/\/login$/);
//   });

// });

// test.describe('Forgot Password', () => {

//   test('CURADENTAI-2429: Navigate between Sign In and Forgot Password', async ({ page }) => {
//     // Description: Verify user can navigate between Sign In and Forgot Password screens
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     // Click on Forgot Password link
//     await page.getByText('Forgot Password?').click();
//     await page.waitForLoadState('networkidle');

//     // Verify navigation to Forgot Password screen (page shows "Forget Password")
//     await expect(page.getByText(/forget password/i).first()).toBeVisible();

//     // Click back arrow or back link to return to Sign In
//     const backButton = page.locator('[aria-label="back"], button:has-text("Back"), a:has-text("Back")').first();
//     if (await backButton.isVisible({ timeout: 3000 }).catch(() => false)) {
//       await backButton.click();
//       await page.waitForLoadState('networkidle');

//       // Verify return to Sign In page
//       await expect(page.getByText('Sign In').first()).toBeVisible();
//     }
//   });

//   test('CURADENTAI-2430: Forgot Password with valid email', async ({ page }) => {
//     // Description: Verify user can request password reset link using valid registered email
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     // Click Forgot Password
//     await page.getByText('Forgot Password?').click();
//     await page.waitForLoadState('networkidle');

//     // Enter registered email address
//     const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]').first();
//     await emailInput.fill(TEST_EMAIL);

//     // Click Reset Request Link
//     const resetButton = page.getByRole('button', { name: /reset|request|send/i });
//     await resetButton.click();

//     // Verify confirmation message
//     await expect(page.getByText(/reset link|sent to your email|check your email/i)).toBeVisible({ timeout: 10000 });
//   });

//   test('CURADENTAI-2431: Forgot Password with invalid email', async ({ page }) => {
//     // Description: Verify error message appears when unregistered email is entered
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     await page.getByText('Forgot Password?').click();
//     await page.waitForLoadState('networkidle');

//     // Enter unregistered email
//     const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]').first();
//     await emailInput.fill('unregistered@example.com');

//     const resetButton = page.getByRole('button', { name: /reset|request|send/i });
//     await resetButton.click();

//     // Verify message (could be success or error depending on security implementation)
//     await page.waitForLoadState('networkidle');
//   });

//   test('CURADENTAI-2432: Resend reset password link', async ({ page }) => {
//     // Description: Verify user can resend password reset link
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     await page.getByText('Forgot Password?').click();
//     await page.waitForLoadState('networkidle');

//     const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]').first();
//     await emailInput.fill(TEST_EMAIL);

//     const resetButton = page.getByRole('button', { name: /reset|request|send/i });
//     await resetButton.click();

//     await page.waitForLoadState('networkidle');

//     // Look for Resend Link option
//     const resendLink = page.getByText(/resend/i);
//     if (await resendLink.isVisible({ timeout: 5000 }).catch(() => false)) {
//       await resendLink.click();
//       // Verify confirmation message
//       await expect(page.getByText(/sent|resent/i)).toBeVisible({ timeout: 10000 });
//     }
//   });

//   test('CURADENTAI-2433: Reset password using email link', async ({ page }) => {
//     // Description: Verify user can reset password using reset link received via email
//     // This test uses ZeptoMail API to fetch the reset email. Configure the
//     // following env vars: ZEPTO_API_URL, ZEPTO_API_KEY (do NOT commit real keys).

//     const ZEPTO_API_URL = process.env.ZEPTO_API_URL;
//     const ZEPTO_API_KEY = process.env.ZEPTO_API_KEY;
//     const NEW_PASSWORD = process.env.NEW_TEST_PASSWORD || 'NewPassword@123';

//     // Request reset link via UI
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');
//     await page.getByText('Forgot Password?').click();
//     await page.waitForLoadState('networkidle');
//     const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]').first();
//     await emailInput.fill(TEST_EMAIL);
//     const resetButton = page.getByRole('button', { name: /reset|request|send/i });
//     await resetButton.click();

//     // Wait for confirmation toast / message
//     await expect(page.getByText(/reset link|sent to your email|check your email/i)).toBeVisible({ timeout: 10000 });

//     if (!ZEPTO_API_URL || !ZEPTO_API_KEY) {
//       test.info().annotations.push({ type: 'warning', description: 'ZEPTO_API_URL or ZEPTO_API_KEY not set — skipping link fetch' });
//       return;
//     }

//     // Poll ZeptoMail API for the reset email and extract link
//     const email = await waitForEmail({
//       apiUrl: ZEPTO_API_URL,
//       apiKey: ZEPTO_API_KEY,
//       to: TEST_EMAIL,
//       subjectRegex: /reset|password/i,
//       timeout: 120000,
//       interval: 3000,
//     });

//     if (!email || !email.link) throw new Error('Reset link not found in email');

//     // Navigate to reset link and set new password
//     await page.goto(email.link);
//     await page.waitForLoadState('networkidle');

//     const newPasswordField = page.locator('input[name="newPassword"], input[placeholder*="New Password"], input[name="password"]');
//     const confirmPasswordField = page.locator('input[name="confirmPassword"], input[placeholder*="Confirm Password"]');

//     if (await newPasswordField.isVisible({ timeout: 5000 }).catch(() => false)) {
//       await newPasswordField.fill(NEW_PASSWORD);
//       if (await confirmPasswordField.isVisible().catch(() => false)) {
//         await confirmPasswordField.fill(NEW_PASSWORD);
//       }

//       const submitBtn = page.getByRole('button', { name: /reset|set new password|submit/i }).first();
//       if (await submitBtn.isVisible().catch(() => false)) await submitBtn.click();
//       await page.waitForLoadState('networkidle');
//       await expect(page).not.toHaveURL(/\/login$/);
//     } else {
//       throw new Error('Reset password form not found at reset link');
//     }
//   });

//   test('CURADENTAI-2434: Expired reset password link', async ({ page }) => {
//     // Description: Verify system displays error for expired or used reset link
//     // Note: This test requires an expired reset link
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     // This test would need an expired reset link to verify the error message
//   });

//   test('CURADENTAI-2435: Reset password policy validation', async ({ page }) => {
//     // Description: Verify password rules are validated on reset password page
//     // Note: This test requires navigation to reset password page
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');
//   });

//   test('CURADENTAI-2436: Login after password reset via Forgot Password', async ({ page }) => {
//     // Description: Verify user can log in after resetting password via Forgot Password flow
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();

//     await page.waitForLoadState('networkidle');
//     await expect(page).not.toHaveURL(/\/login$/);
//   });

// });

// test.describe('Help Center', () => {

//   test('CURADENTAI-2437: Successful email delivery', async ({ page }) => {
//     // Description: Verify email is received at support email address
//     // Note: This test requires email verification capability
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     // Navigate to Help Center if available
//     const helpLink = page.getByText(/help|support|contact/i).first();
//     if (await helpLink.isVisible({ timeout: 3000 }).catch(() => false)) {
//       await helpLink.click();
//       await page.waitForLoadState('networkidle');
//     }
//   });

// });

// test.describe('Email Delivery', () => {

//   test('CURADENTAI-2439: Reset password email delivery', async ({ page }) => {
//     // Description: Verify reset password email is delivered with valid link
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     await page.getByText('Forgot Password?').click();
//     await page.waitForLoadState('networkidle');

//     const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]').first();
//     await emailInput.fill(TEST_EMAIL);

//     const resetButton = page.getByRole('button', { name: /reset|request|send/i });
//     await resetButton.click();

//     // Verify reset request was submitted
//     await expect(page.getByText(/reset link|sent|email/i)).toBeVisible({ timeout: 10000 });
//   });

//   test('CURADENTAI-2440: Send medical history form link', async ({ page }) => {
//     // Description: Verify medical history form link is sent after saving patient
//     // Precondition: User logged in and Add Patient popup is open
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     // Login first
//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');

//     // Navigate to Add Patient (this will depend on the app's UI)
//     const addPatientButton = page.getByRole('button', { name: /add patient/i });
//     if (await addPatientButton.isVisible({ timeout: 5000 }).catch(() => false)) {
//       await addPatientButton.click();
//       await page.waitForLoadState('networkidle');
//     }
//   });

//   test('CURADENTAI-2441: Medical history email delivery', async ({ page }) => {
//     // Description: Verify medical history form email is delivered correctly
//     // Note: Requires patient save workflow
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');
//   });

// });

// test.describe('Settings - User Profile', () => {

//   test('CURADENTAI-2442: Verify designation is readonly', async ({ page }) => {
//     // Description: Ensure designation cannot be edited
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     // Login first
//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');

//     // Navigate to Settings/User Profile
//     const settingsLink = page.getByText(/settings/i).first();
//     if (await settingsLink.isVisible({ timeout: 5000 }).catch(() => false)) {
//       await settingsLink.click();
//       await page.waitForLoadState('networkidle');

//       // Check designation field is readonly
//       const designationField = page.locator('[name="designation"], [data-testid="designation"]');
//       if (await designationField.isVisible({ timeout: 3000 }).catch(() => false)) {
//         await expect(designationField).toBeDisabled();
//       }
//     }
//   });

//   test('CURADENTAI-2443: Verify old password cannot be reused', async ({ page }) => {
//     // Description: Prevent reuse of last password
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     // Login and navigate to Change Password
//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');

//     // Navigate to Change Password settings
//     const changePasswordLink = page.getByText(/change password/i);
//     if (await changePasswordLink.isVisible({ timeout: 5000 }).catch(() => false)) {
//       await changePasswordLink.click();
//       // Attempt to use old password - verify validation error
//     }
//   });

//   test('CURADENTAI-2459: Display custom designation role in profile', async ({ page }) => {
//     // Description: Verify saved designation role displays in User Profile
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');

//     // Navigate to User Profile
//     const profileLink = page.getByText(/profile|user profile/i).first();
//     if (await profileLink.isVisible({ timeout: 5000 }).catch(() => false)) {
//       await profileLink.click();
//       await page.waitForLoadState('networkidle');

//       // Verify designation role is displayed
//       const designationField = page.locator('[name="designation"], [data-testid="designation"], text=/designation/i');
//       await expect(designationField.first()).toBeVisible();
//     }
//   });

// });

// test.describe('Sign In Page UI', () => {

//   test('CURADENTAI-2444: Verify updated sign-in UI', async ({ page }) => {
//     // Description: Validate UI matches Figma
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     // Compare sign-in page with Figma design
//     await expect(page.getByText('Sign In').first()).toBeVisible();
//     await expect(page.getByText('CuradentAI')).toBeVisible();
//     await expect(page.locator('input[name="username"]')).toBeVisible();
//     await expect(page.locator('input[name="password"]')).toBeVisible();
//     await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
//   });

// });

// test.describe('Patient List', () => {

//   test('CURADENTAI-2445: Verify patient list default order', async ({ page }) => {
//     // Description: Recently added patient appears first
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');

//     // Navigate to patient list
//     const patientListLink = page.getByText(/patients|patient list/i).first();
//     if (await patientListLink.isVisible({ timeout: 5000 }).catch(() => false)) {
//       await patientListLink.click();
//       await page.waitForLoadState('networkidle');

//       // Verify patients are listed (latest at top)
//       const patientList = page.locator('[data-testid="patient-list"], .patient-list, table tbody tr');
//       await expect(patientList.first()).toBeVisible();
//     }
//   });

//   test('CURADENTAI-2446: Verify order after adding patient', async ({ page }) => {
//     // Description: Validate dynamic ordering - new patient appears first
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');
//   });

//   test('CURADENTAI-2447: Verify order persistence on refresh', async ({ page }) => {
//     // Description: Ensure order remains after reload
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');

//     // Refresh page
//     await page.reload();
//     await page.waitForLoadState('networkidle');

//     // Verify order unchanged
//   });

// });

// test.describe('Patient Details Page - Analysis Report Version', () => {

//   test('CURADENTAI-2448: Smart Prompt text updated', async ({ page }) => {
//     // Description: Verify "Smart Prompt" text is updated to "Clarifications Recommended"
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');

//     // Navigate to Patient Details -> Current Analysis Report
//     // Verify "Clarifications Recommended" text is displayed
//   });

//   test('CURADENTAI-2449: Old Smart Prompt text removed', async ({ page }) => {
//     // Description: Verify old text "Smart Prompt" is not visible
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');

//     // Navigate to Current Analysis Report section
//     // Verify "Smart Prompt" text is NOT displayed
//   });

//   test('CURADENTAI-2450: Risk Flag terminology replaced', async ({ page }) => {
//     // Description: Verify "Risk Flag" is replaced with "Guidance"
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');

//     // Navigate to Current Analysis Report -> Section 3
//     // Verify "Guidance" term is displayed
//   });

//   test('CURADENTAI-2451: Risk Flag not shown elsewhere', async ({ page }) => {
//     // Description: Ensure "Risk Flag" term is not visible in Section 3
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');

//     // Review entire Section 3
//     // Verify "Risk Flag" is not present
//   });

//   test('CURADENTAI-2452: Terminology limited to Section 3', async ({ page }) => {
//     // Description: Verify terminology change applies only to Section 3
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');

//     // Review other sections
//     // Verify no terminology changes outside Section 3
//   });

// });

// test.describe('Patient Details - Disclaimer', () => {

//   test('CURADENTAI-2453: Patient Details disclaimer updated', async ({ page }) => {
//     // Description: Verify detailed disclaimer text on Patient Details page
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');

//     // Navigate to Patient Details page
//     // Scroll to disclaimer section
//     // Verify detailed disclaimer is displayed
//   });

//   test('CURADENTAI-2454: Patient Details disclaimer text accuracy', async ({ page }) => {
//     // Description: Verify disclaimer text matches exactly
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');
//   });

//   test('CURADENTAI-2455: Patient Details disclaimer scope', async ({ page }) => {
//     // Description: Ensure disclaimer appears only on Patient Details page
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');

//     // Navigate away from Patient Details
//     // Verify disclaimer not shown on other pages
//   });

//   test('CURADENTAI-2456: Other pages disclaimer updated', async ({ page }) => {
//     // Description: Verify short disclaimer on non-Patient pages
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');

//     // Navigate to Dashboard or other pages
//     // Scroll to footer or disclaimer section
//     // Verify short disclaimer is displayed
//   });

//   test('CURADENTAI-2457: Exclusion of Patient Details page', async ({ page }) => {
//     // Description: Ensure short disclaimer not shown on Patient Details
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');
//   });

//   test('CURADENTAI-2458: Short disclaimer text accuracy', async ({ page }) => {
//     // Description: Verify exact text & wording
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     await page.locator('input[name="username"]').fill(TEST_EMAIL);
//     await page.locator('input[name="password"]').fill(TEST_PASSWORD);
//     await page.getByRole('button', { name: 'Sign In' }).click();
//     await page.waitForLoadState('networkidle');
//   });

// });

// test.describe('Reset Password', () => {

//   test('CURADENTAI-2460: Prevent reuse of old password', async ({ page }) => {
//     // Description: Verify validation message when new password is same as old password
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     // Navigate to reset password page via email link
//     // Enter current (old) password in New Password field
//     // Enter same password in Confirm Password field
//     // Click Reset Password
//     // Verify toaster message: "The new password cannot be the same as the old password. Please choose a different password."
//   });

//   test('CURADENTAI-2461: Send reset password link', async ({ page }) => {
//     // Description: Verify reset password link is sent to entered email successfully
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     // Click Forgot Password
//     await page.getByText('Forgot Password?').click();
//     await page.waitForLoadState('networkidle');

//     // Enter registered email
//     const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]').first();
//     await emailInput.fill(TEST_EMAIL);

//     // Click Reset Request Link
//     const resetButton = page.getByRole('button', { name: /reset|request|send/i });
//     await resetButton.click();

//     // Verify confirmation message
//     await expect(page.getByText(/reset link|sent|email/i)).toBeVisible({ timeout: 10000 });
//   });

//   test('CURADENTAI-2462: Send reset password link (duplicate)', async ({ page }) => {
//     // Description: Verify reset password link is sent to entered email successfully
//     await page.goto(BASE_URL);
//     await page.waitForLoadState('networkidle');

//     // Click Forgot Password
//     await page.getByText('Forgot Password?').click();
//     await page.waitForLoadState('networkidle');

//     // Enter registered email
//     const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]').first();
//     await emailInput.fill(TEST_EMAIL);

//     // Click Reset Request Link
//     const resetButton = page.getByRole('button', { name: /reset|request|send/i });
//     await resetButton.click();

//     // Verify confirmation message
//     await expect(page.getByText(/reset link|sent|email/i)).toBeVisible({ timeout: 10000 });
//   });


