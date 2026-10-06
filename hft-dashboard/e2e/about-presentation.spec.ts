import { expect, test } from '@playwright/test';

test.describe('About Page PPT Presentation Deck E2E Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('should render About Page with PPT Presentation Deck view mode active by default', async ({
    page,
  }) => {
    await expect(page.locator('h1')).toContainText('About LALAN Quantitative Platform');
    await expect(page.getByText('PPT Presentation Deck')).toBeVisible();
    await expect(page.getByText('Slide 1 of 11')).toBeVisible();
  });

  test('should navigate slides using next and previous buttons', async ({ page }) => {
    // Click Next Slide
    const nextButton = page.getByTitle('Next Slide (Right Arrow)');
    await nextButton.click();
    await expect(page.getByText('Slide 2 of 11')).toBeVisible();
    await expect(page.getByText('High-Frequency System Architecture')).toBeVisible();

    // Click Previous Slide
    const prevButton = page.getByTitle('Previous Slide (Left Arrow)');
    await prevButton.click();
    await expect(page.getByText('Slide 1 of 11')).toBeVisible();
  });

  test('should open Slide Grid Modal overview and jump to Slide 6', async ({ page }) => {
    const gridButton = page.getByTitle('Overview Grid View (G key)');
    await gridButton.click();

    await expect(page.getByText('Presentation Slide Index Grid')).toBeVisible();

    // Select Slide 6
    await page.getByText('Institutional Benchmark Comparison').click();
    await expect(page.getByText('Slide 6 of 11')).toBeVisible();
  });
});
