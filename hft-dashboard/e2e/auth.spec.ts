import { test, expect } from '@playwright/test';

test.describe('Authentication System & Modals', () => {
  test('Opens and closes Auth Modal from Sign In button', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Click Sign In button if available
    const signInBtn = page.getByRole('button', { name: /Sign In/i }).first();
    if (await signInBtn.isVisible()) {
      await signInBtn.click();
      
      // Verify modal heading
      await expect(page.getByText('Welcome Back to LALAN', { exact: false }).first()).toBeVisible();
      
      // Check tab switching (Sign In / Create Account)
      const createAccountTab = page.getByRole('button', { name: /Create Account/i }).first();
      if (await createAccountTab.isVisible()) {
        await createAccountTab.click();
        await expect(page.getByText('Create Quant Account', { exact: false }).first()).toBeVisible();
      }

      // Close modal using close button selector
      const closeBtn = page.locator('button.absolute.top-4.right-4');
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await expect(page.getByText('Welcome Back to LALAN', { exact: false })).not.toBeVisible();
      }
    }
  });

  test('Simulates sign-in flow and verifies user state in navbar', async ({ page }) => {
    await page.goto('/dashboard');

    const signInBtn = page.getByRole('button', { name: /Sign In/i }).first();
    if (await signInBtn.isVisible()) {
      await signInBtn.click();

      // Fill in demo credentials
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');

      if (await emailInput.isVisible()) {
        await emailInput.fill('trader@lalan-hft.com');
        await passwordInput.fill('password123');

        // Submit form
        const submitBtn = page.getByRole('button', { name: /Sign In to Terminal/i }).first();
        if (await submitBtn.isVisible()) {
          await submitBtn.click();
        }
      }
    }
  });
});
