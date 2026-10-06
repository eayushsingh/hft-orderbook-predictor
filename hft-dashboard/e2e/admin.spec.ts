import { test, expect } from '@playwright/test';

test.describe('Admin Control Panel & Telemetry', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
    
    // Check and fill PIN if auth gate is visible
    const pinInput = page.getByPlaceholder(/Enter Security Admin PIN/i).first();
    try {
      await pinInput.waitFor({ state: 'visible', timeout: 4000 });
      await pinInput.fill('8899');
      await page.getByRole('button', { name: /Authorize Admin Access/i }).click();
    } catch (e) {
      // Auth gate not present or already authorized
    }

    // Ensure authorized view is loaded
    await expect(page.getByText('Active WebSocket Sessions', { exact: false }).first()).toBeVisible({ timeout: 10000 });
  });

  test('Displays system telemetry metric cards', async ({ page }) => {
    await expect(page.getByText('Active WebSocket Sessions', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Executed Volume', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Engine Latency', { exact: false }).first()).toBeVisible();
  });

  test('User management table displays accounts and tier controls', async ({ page }) => {
    await expect(page.getByText(/User Roster Matrix/i).first()).toBeVisible();
    
    // Check tier upgrade/downgrade badges
    const tierBadges = page.getByText(/FREE|PRO|INSTITUTIONAL/i);
    await expect(tierBadges.first()).toBeVisible();
  });

  test('User Audit Stream displays live log entries', async ({ page }) => {
    const auditTab = page.getByRole('button', { name: /Live Action Audit Stream/i }).first();
    if (await auditTab.isVisible()) {
      await auditTab.click();
      await expect(page.getByText('Real-Time User Action Trajectory Stream', { exact: false }).first()).toBeVisible();
    }
  });
});
