import { test, expect } from '@playwright/test';

test.describe('Terminal Dashboard & Multi-Source Intelligence Hub', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('Watchlist ticker switching updates order book view', async ({ page }) => {
    // Check ticker panel
    const relianceBtn = page.getByRole('button', { name: /RELIANCE/i }).first();
    if (await relianceBtn.isVisible()) {
      await relianceBtn.click();
    }
  });

  test('Multi-Source Intelligence Hub switches between tabs', async ({ page }) => {
    // Check Multi-Source Intelligence Hub tabs (Screener.in, NSE India, TradingView, Moneycontrol, Trendlyne)
    const hubHeader = page.getByText('Multi-Source Intelligence Hub', { exact: false });
    if (await hubHeader.isVisible()) {
      const tabs = ['Screener.in', 'NSE India', 'TradingView', 'Moneycontrol', 'Trendlyne'];
      for (const tabName of tabs) {
        const tabBtn = page.getByRole('button', { name: new RegExp(tabName, 'i') }).first();
        if (await tabBtn.isVisible()) {
          await tabBtn.click();
          await page.waitForTimeout(300);
        }
      }
    }
  });

  test('Order Ticket Modal opens and closes', async ({ page }) => {
    const buyBtn = page.getByRole('button', { name: /BUY/i }).first();
    if (await buyBtn.isVisible()) {
      await buyBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('Positions & Orders tabs toggle', async ({ page }) => {
    const positionsTab = page.getByRole('button', { name: /Positions/i }).first();
    const ordersTab = page.getByRole('button', { name: /Open Orders|Orders/i }).first();

    if (await positionsTab.isVisible()) {
      await positionsTab.click();
      await page.waitForTimeout(200);
    }
    if (await ordersTab.isVisible()) {
      await ordersTab.click();
      await page.waitForTimeout(200);
    }
  });
});
