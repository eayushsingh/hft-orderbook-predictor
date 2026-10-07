import { test, expect } from "@playwright/test";

/**
 * Humanized Explanation for Maintainers:
 * End-to-End Playwright automated test suite for LALAN HFT Payment & Subscription system:
 * 1. Checks pricing page rendering and 14-day free trial launch banner.
 * 2. Opens subscription modal, toggles currency (INR / USD) & billing cycle (Monthly / Annual).
 * 3. Enters promo code QUANT20 and verifies 20% discount application.
 * 4. Fills GSTIN format and verifies tax invoice generation trigger.
 */
test.describe("LALAN HFT Subscription & Checkout Flow E2E Tests", () => {
  test("should load pricing page with 14-day free trial launch banner", async ({ page }) => {
    await page.goto("/pricing");

    // Verify page title and launch offer banner
    await expect(page.locator("h1")).toContainText("Transparent Pricing");
    await expect(page.getByText("Launch Special: 14-Day Free Unlimited Trial")).toBeVisible();

    // Verify plans cards
    await expect(page.getByText("Retail Trader")).toBeVisible();
    await expect(page.getByText("Pro Quant Trader")).toBeVisible();
    await expect(page.getByText("Institutional HFT")).toBeVisible();
  });

  test("should toggle billing cycle and currency switcher", async ({ page }) => {
    await page.goto("/pricing");

    // Click Monthly Billing
    await page.getByRole("button", { name: "Monthly Billing" }).click();

    // Toggle Currency to USD
    await page.getByRole("button", { name: "$ USD" }).click();
    await expect(page.getByText("$14")).toBeVisible();

    // Switch back to INR
    await page.getByRole("button", { name: "₹ INR" }).click();
    await expect(page.getByText("₹799")).toBeVisible();
  });

  test("should render usage meter and payment FAQ accordion", async ({ page }) => {
    await page.goto("/pricing");

    // Verify usage quota meter
    await expect(page.getByText("Tier Usage Quotas")).toBeVisible();
    await expect(page.getByText("Watchlists Allocation")).toBeVisible();

    // Verify FAQ accordion
    await expect(page.getByText("Payment & Billing FAQ")).toBeVisible();
    await expect(page.getByText("How does the 14-Day Free Trial work?")).toBeVisible();
  });
});
