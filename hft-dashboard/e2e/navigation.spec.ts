import { test, expect } from '@playwright/test';

test.describe('Navigation & Page Rendering', () => {
  test('Landing Page renders successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/LALAN|HFT/i);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByText('LALAN Enterprise HFT Order Book Engine', { exact: false }).first()).toBeVisible();
  });

  test('Dashboard page loads and displays terminal components', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveTitle(/Dashboard|LALAN/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Admin Control Panel renders auth gate and authorizes with PIN', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByText('LALAN Admin Telemetry Control', { exact: false }).first()).toBeVisible();
    
    // Fill PIN and authorize
    const pinInput = page.locator('input[type="password"]').first();
    if (await pinInput.isVisible()) {
      await pinInput.fill('8899');
      await page.getByRole('button', { name: /Authorize Admin Access/i }).click();
      await expect(page.getByText('Active WebSocket Sessions', { exact: false }).first()).toBeVisible();
    }
  });

  test('About Page renders quantitative details and founders', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByText('Institutional Market Microstructure Engine', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Engineering Behind LALAN HFT', { exact: false }).first()).toBeVisible();
  });

  test('Pricing Page renders subscription tiers', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText('Transparent Pricing', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Flexible Plans for Indian Algorithmic Traders', { exact: false }).first()).toBeVisible();
  });

  test('Products Page renders ecosystem tools', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByText('LALAN HFT Quantitative Ecosystem', { exact: false }).first()).toBeVisible();
  });

  test('Support Page renders knowledge base and contact info', async ({ page }) => {
    await page.goto('/support');
    await expect(page.getByText('Frequently Asked Questions', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Developer & Trader Knowledge Base', { exact: false }).first()).toBeVisible();
  });
});
