import { expect, test } from '@playwright/test';

test.describe('Production FAQ Knowledge Base E2E Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/support');
  });

  test('should render FAQ Knowledge Base header and category pills', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Frequently Asked Questions');
    await expect(page.getByText('General Platform')).toBeVisible();
    await expect(page.getByText('L2 Terminal Engine')).toBeVisible();
    await expect(page.getByText('Robo-Advisor AI')).toBeVisible();
  });

  test('should filter FAQ list when typing in search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search eg: OBI formula/i);
    await searchInput.fill('Disruptor');

    await expect(page.getByText('How does LALAN achieve sub-microsecond engine execution latency?')).toBeVisible();
  });

  test('should filter FAQs when selecting a category pill', async ({ page }) => {
    await page.getByRole('button', { name: /Tax-Loss Harvesting/i }).click();

    await expect(page.getByText('What is Tax-Loss Harvesting (TLH) and how does it save on taxes?')).toBeVisible();
  });
});
