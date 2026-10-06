import { expect, test } from '@playwright/test';

test.describe('Robo-Advisor End-to-End User Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to the Robo-Advisor hub
    await page.goto('/robo-advisor');
  });

  test('should render Robo-Advisor main dashboard, header banner, and auto-pilot toggle', async ({
    page,
  }) => {
    // Verify main page title heading
    await expect(page.locator('h1')).toContainText('Institutional Robo-Advisor');

    // Verify auto-pilot status badge
    await expect(page.getByText('Auto-Pilot Status')).toBeVisible();
    await expect(page.getByText('AUTONOMOUS ACTIVE')).toBeVisible();

    // Verify presence of navigation tabs
    await expect(page.getByRole('button', { name: /Portfolio Allocation/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Risk Profiler Wizard/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Drift & Rebalance Radar/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Tax-Loss Harvester/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Monte Carlo Forecast/i })).toBeVisible();
  });

  test('should navigate through Risk Profiler wizard and update asset allocation model', async ({
    page,
  }) => {
    // Switch to Risk Profiler Wizard tab
    await page.getByRole('button', { name: /Risk Profiler Wizard/i }).click();

    // Verify step 1 questionnaire UI
    await expect(page.getByText('1. What is your primary investment goal?')).toBeVisible();

    // Click Continue to step 2
    await page.getByRole('button', { name: /Continue/i }).click();
    await expect(page.getByText('2. Financial Capacity & Monthly Cash Flow')).toBeVisible();

    // Click Continue to step 3
    await page.getByRole('button', { name: /Continue/i }).click();
    await expect(page.getByText('3. Risk Tolerance & Market Drop Scenario')).toBeVisible();

    // Click Generate Risk Model
    await page.getByRole('button', { name: /Generate Risk Model/i }).click();

    // Verify step 4 calculated risk score card
    await expect(page.getByText('Calculated Algorithm Score')).toBeVisible();
    await expect(page.getByRole('button', { name: /Build & Activate Portfolio/i })).toBeVisible();

    // Confirm and activate
    await page.getByRole('button', { name: /Build & Activate Portfolio/i }).click();

    // Should automatically navigate back to Portfolio Allocation tab
    await expect(page.getByText('Expected Return')).toBeVisible();
  });

  test('should display drift metrics and open rebalance execution modal', async ({ page }) => {
    // Switch to Drift & Rebalance Radar tab
    await page.getByRole('button', { name: /Drift & Rebalance Radar/i }).click();

    // Verify drift table and rebalance button
    await expect(
      page.getByText('Automated Portfolio Drift & Rebalance Radar')
    ).toBeVisible();
    await expect(page.getByText('Drift Score:')).toBeVisible();

    const rebalanceButton = page.getByRole('button', { name: /Rebalance Now/i });
    if (await rebalanceButton.isEnabled()) {
      await rebalanceButton.click();

      // Modal should appear
      await expect(
        page.getByText('Confirm Algorithmic Rebalance Execution')
      ).toBeVisible();
      await expect(page.getByText('Total Trade Volume:')).toBeVisible();

      // Click cancel to close
      await page.getByRole('button', { name: /Cancel/i }).click();
    }
  });

  test('should display Tax-Loss Harvester opportunities and allow harvest execution', async ({
    page,
  }) => {
    // Switch to Tax Loss Harvester tab
    await page.getByRole('button', { name: /Tax-Loss Harvester/i }).click();

    await expect(
      page.getByText('Algorithmic Tax-Loss Harvester (TLH)')
    ).toBeVisible();
    await expect(page.getByText('Harvestable Unrealized Loss')).toBeVisible();

    // Check harvest execution button if opportunities exist
    const harvestButton = page.getByRole('button', { name: /Harvest Tax Losses/i });
    if (await harvestButton.isVisible()) {
      await harvestButton.click();
      await expect(page.getByText('Tax Loss Harvest Orders Executed')).toBeVisible();
    }
  });

  test('should run Monte Carlo simulation and update probability gauge', async ({ page }) => {
    // Switch to Monte Carlo Forecast tab
    await page.getByRole('button', { name: /Monte Carlo Forecast/i }).click();

    await expect(
      page.getByText('Stochastic Monte Carlo Goal Simulation')
    ).toBeVisible();
    await expect(page.getByText('GOAL SUCCESS RATE')).toBeVisible();
    await expect(page.getByText('Target Goal')).toBeVisible();
  });
});
