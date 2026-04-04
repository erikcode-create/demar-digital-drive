import { test, expect } from "@playwright/test";

/**
 * CTA Presence E2E Tests
 *
 * Verifies that calls-to-action are present on all page types.
 * Tests run against the local dev server (port 8080).
 *
 * Detection selectors:
 *   Quote CTA:     a[href="/quote"] or a[href*="quote"]
 *   Phone CTA:     a[href^="tel:"]
 *   Email:         a[href^="mailto:"]
 *   Service links: a[href^="/services/"]
 *
 * Each beforeEach waits for networkidle to ensure React has fully hydrated
 * before assertions run.
 */

test.describe("Homepage (/) CTA presence", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test('has a "Request a Quote" or quote link', async ({ page }) => {
    const quoteLinks = page.locator('a[href="/quote"], a[href*="quote"]');
    await expect(quoteLinks.first()).toBeVisible();
  });

  test("has a phone CTA", async ({ page }) => {
    const phoneLinks = page.locator('a[href^="tel:"]');
    await expect(phoneLinks.first()).toBeVisible();
  });

  test("has at least 3 service links", async ({ page }) => {
    const serviceLinks = page.locator('a[href^="/services/"]');
    const count = await serviceLinks.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});

test.describe("Service page /services/dry-van CTA presence", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/services/dry-van");
    await page.waitForLoadState("networkidle");
  });

  test("has a quote CTA", async ({ page }) => {
    const quoteLinks = page.locator('a[href="/quote"], a[href*="quote"]');
    await expect(quoteLinks.first()).toBeVisible();
  });

  test("has a phone CTA", async ({ page }) => {
    const phoneLinks = page.locator('a[href^="tel:"]');
    await expect(phoneLinks.first()).toBeVisible();
  });
});

test.describe("Service page /services/reefer CTA presence", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/services/reefer");
    await page.waitForLoadState("networkidle");
  });

  test("has a quote CTA", async ({ page }) => {
    const quoteLinks = page.locator('a[href="/quote"], a[href*="quote"]');
    await expect(quoteLinks.first()).toBeVisible();
  });

  test("has a phone CTA", async ({ page }) => {
    const phoneLinks = page.locator('a[href^="tel:"]');
    await expect(phoneLinks.first()).toBeVisible();
  });
});

test.describe("Service page /services/flatbed CTA presence", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/services/flatbed");
    await page.waitForLoadState("networkidle");
  });

  test("has a quote CTA", async ({ page }) => {
    const quoteLinks = page.locator('a[href="/quote"], a[href*="quote"]');
    await expect(quoteLinks.first()).toBeVisible();
  });

  test("has a phone CTA", async ({ page }) => {
    const phoneLinks = page.locator('a[href^="tel:"]');
    await expect(phoneLinks.first()).toBeVisible();
  });
});

test.describe("Contact page (/contact) CTA presence", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
  });

  test("has a phone link", async ({ page }) => {
    const phoneLinks = page.locator('a[href^="tel:"]');
    await expect(phoneLinks.first()).toBeVisible();
  });

  test("has an email link", async ({ page }) => {
    const emailLinks = page.locator('a[href^="mailto:"]');
    await expect(emailLinks.first()).toBeVisible();
  });

  test("has a quote or careers link", async ({ page }) => {
    const ctaLinks = page.locator(
      'a[href="/quote"], a[href*="quote"], a[href="/careers"]'
    );
    await expect(ctaLinks.first()).toBeVisible();
  });
});

test.describe("Careers page (/careers) CTA presence", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/careers");
    await page.waitForLoadState("networkidle");
  });

  test("has an application form with inputs", async ({ page }) => {
    // The ApplyToDriveForm is rendered inside section#apply
    const formInputs = page.locator("#apply input");
    await expect(formInputs.first()).toBeVisible();
  });
});

test.describe("Blog post CTA presence", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog/why-freight-quote-keeps-changing");
    await page.waitForLoadState("networkidle");
  });

  test("has at least 1 CTA (quote, contact, or phone link)", async ({
    page,
  }) => {
    // BlogPost template always renders an inline CTA section with /quote and tel: links
    const ctaLinks = page.locator(
      'a[href="/quote"], a[href*="quote"], a[href^="tel:"], a[href="/contact"]'
    );
    const count = await ctaLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
