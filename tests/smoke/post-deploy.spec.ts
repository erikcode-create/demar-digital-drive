/**
 * Post-deploy smoke tests — hit the LIVE production site.
 *
 * Run via: npm run test:smoke
 * (sets SMOKE_BASE_URL=https://demartransportation.com)
 *
 * These tests intentionally bypass the Playwright config's baseURL and use
 * full absolute URLs so they always target production regardless of env.
 */

import { test, expect } from "@playwright/test";

const LIVE_URL = "https://demartransportation.com";

// ── 1. sitemap.xml accessible, valid XML, contains demartransportation.com URLs ─

test("sitemap.xml is accessible, valid XML, and contains site URLs", async ({
  request,
}) => {
  const res = await request.get(`${LIVE_URL}/sitemap.xml`);
  expect(res.status(), "sitemap.xml HTTP status").toBe(200);

  const contentType = res.headers()["content-type"] ?? "";
  expect(
    contentType.includes("xml") || contentType.includes("text"),
    `Expected XML content-type, got: ${contentType}`
  ).toBeTruthy();

  const body = await res.text();

  // Must be parseable as XML — check for opening XML declaration or <urlset>
  expect(body, "sitemap body should start with XML").toMatch(
    /<(\?xml|urlset|sitemapindex)/i
  );

  // Must reference the live domain
  expect(body, "sitemap should contain live domain URLs").toContain(
    "demartransportation.com"
  );
});

// ── 2. robots.txt accessible, not blocking with "Disallow: /" ─────────────────

test("robots.txt is accessible and does not block all crawlers", async ({
  request,
}) => {
  const res = await request.get(`${LIVE_URL}/robots.txt`);
  expect(res.status(), "robots.txt HTTP status").toBe(200);

  const body = await res.text();

  // Must not have a blanket Disallow: / for all user-agents
  // Pattern to catch: User-agent: *  followed (eventually) by  Disallow: /
  const lines = body.split("\n").map((l) => l.trim());
  let inStarBlock = false;
  for (const line of lines) {
    if (/^user-agent:\s*\*$/i.test(line)) {
      inStarBlock = true;
    } else if (/^user-agent:/i.test(line)) {
      inStarBlock = false;
    } else if (inStarBlock && /^disallow:\s*\/\s*$/i.test(line)) {
      throw new Error(
        "robots.txt has 'Disallow: /' under User-agent: * — site is blocked from crawlers"
      );
    }
  }
});

// ── 3. All sitemap URLs return HTTP 200 ───────────────────────────────────────

test("all sitemap URLs return HTTP 200", async ({ request }) => {
  const sitemapRes = await request.get(`${LIVE_URL}/sitemap.xml`);
  expect(sitemapRes.status()).toBe(200);

  const xml = await sitemapRes.text();

  // Extract all <loc> values
  const locMatches = [...xml.matchAll(/<loc>\s*(https?:\/\/[^<]+)\s*<\/loc>/gi)];
  const urls = locMatches.map((m) => m[1].trim());

  expect(urls.length, "sitemap should have at least one URL").toBeGreaterThan(0);

  // Check each URL — collect failures rather than stopping on first
  const failures: string[] = [];
  for (const url of urls) {
    const res = await request.get(url);
    if (res.status() !== 200) {
      failures.push(`${url} → HTTP ${res.status()}`);
    }
  }

  expect(
    failures,
    `Sitemap URLs that did not return 200:\n${failures.join("\n")}`
  ).toHaveLength(0);
});

// ── 4. Homepage renders with no console errors ────────────────────────────────

test("homepage renders with no console errors", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto(`${LIVE_URL}/`);
  await page.waitForLoadState("networkidle");

  expect(
    consoleErrors,
    `Console errors on homepage:\n${consoleErrors.join("\n")}`
  ).toHaveLength(0);
});

// ── 5. Homepage has correct title (not "React App", contains "DeMar") ─────────

test('homepage title contains "DeMar" and is not the default "React App"', async ({
  page,
}) => {
  await page.goto(`${LIVE_URL}/`);
  await page.waitForLoadState("networkidle");

  const title = await page.title();
  expect(title, "title should not be default React App").not.toBe("React App");
  expect(title, 'title should contain "DeMar"').toContain("DeMar");
});

// ── 6. Homepage has meta description > 50 chars ───────────────────────────────

test("homepage meta description is longer than 50 characters", async ({
  page,
}) => {
  await page.goto(`${LIVE_URL}/`);

  const metaDescription = await page
    .locator('meta[name="description"]')
    .getAttribute("content");

  expect(
    metaDescription,
    "meta description should be present"
  ).not.toBeNull();

  expect(
    (metaDescription ?? "").length,
    `meta description is only ${(metaDescription ?? "").length} chars — must be > 50`
  ).toBeGreaterThan(50);
});

// ── 7. Homepage has OG tags ───────────────────────────────────────────────────

test("homepage has Open Graph tags", async ({ page }) => {
  await page.goto(`${LIVE_URL}/`);

  const ogTitle = await page
    .locator('meta[property="og:title"]')
    .getAttribute("content");
  const ogDescription = await page
    .locator('meta[property="og:description"]')
    .getAttribute("content");
  const ogUrl = await page
    .locator('meta[property="og:url"]')
    .getAttribute("content");

  expect(ogTitle, "og:title should be present and non-empty").toBeTruthy();
  expect(
    ogDescription,
    "og:description should be present and non-empty"
  ).toBeTruthy();
  expect(ogUrl, "og:url should be present and non-empty").toBeTruthy();
});

// ── 8. Homepage JSON-LD parses as valid JSON ──────────────────────────────────

test("homepage JSON-LD scripts parse as valid JSON", async ({ page }) => {
  await page.goto(`${LIVE_URL}/`);
  await page.waitForLoadState("networkidle");

  const jsonLdTexts = await page.evaluate(() => {
    const scripts = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]')
    );
    return scripts.map((s) => s.textContent ?? "");
  });

  expect(
    jsonLdTexts.length,
    "homepage should have at least one JSON-LD script"
  ).toBeGreaterThan(0);

  for (const text of jsonLdTexts) {
    expect(() => JSON.parse(text), `JSON-LD failed to parse:\n${text}`).not.toThrow();
  }
});

// ── 9. SPA routing — /services/dry-van loads correctly (not 404) ──────────────

test("/services/dry-van loads without 404", async ({ page }) => {
  const response = await page.goto(`${LIVE_URL}/services/dry-van`);
  expect(
    response?.status(),
    "/services/dry-van should not return HTTP 404"
  ).not.toBe(404);

  await page.waitForLoadState("networkidle");

  // The page body should contain relevant content — not a generic "Not Found"
  const bodyText = await page.locator("body").innerText();
  expect(
    bodyText,
    "page body should not say Not Found"
  ).not.toMatch(/not found/i);
});

// ── 10. Quote form renders with email and phone inputs visible ────────────────

test("/quote form renders with email and phone inputs visible", async ({
  page,
}) => {
  await page.goto(`${LIVE_URL}/quote`);
  await page.waitForLoadState("networkidle");

  // Email input
  const emailInput = page
    .locator('input[type="email"], input[name*="email"], input[placeholder*="email" i]')
    .first();
  await expect(emailInput, "email input should be visible on /quote").toBeVisible();

  // Phone input
  const phoneInput = page
    .locator(
      'input[type="tel"], input[name*="phone"], input[placeholder*="phone" i]'
    )
    .first();
  await expect(phoneInput, "phone input should be visible on /quote").toBeVisible();
});

// ── 11. Careers form renders with at least 5 inputs ──────────────────────────

test("/careers form renders with at least 5 inputs", async ({ page }) => {
  await page.goto(`${LIVE_URL}/careers`);
  await page.waitForLoadState("networkidle");

  // Count all visible input/textarea/select elements inside a form
  const inputCount = await page
    .locator("form input, form textarea, form select")
    .count();

  expect(
    inputCount,
    `careers form should have at least 5 inputs, found ${inputCount}`
  ).toBeGreaterThanOrEqual(5);
});

// ── 12. Contact page has Google Maps iframe ───────────────────────────────────

test("/contact page has a Google Maps iframe", async ({ page }) => {
  await page.goto(`${LIVE_URL}/contact`);
  await page.waitForLoadState("networkidle");

  const mapsIframe = page
    .locator('iframe[src*="google.com/maps"], iframe[src*="maps.google"]')
    .first();

  await expect(
    mapsIframe,
    "contact page should have a Google Maps iframe"
  ).toBeVisible();
});

// ── 13. Supabase client initializes without errors on /quote ─────────────────

test("Supabase client initializes without JS errors on /quote", async ({
  page,
}) => {
  const supabaseErrors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      // Only capture errors likely related to Supabase initialization
      if (
        text.toLowerCase().includes("supabase") ||
        text.toLowerCase().includes("@supabase") ||
        text.toLowerCase().includes("invalid api key") ||
        text.toLowerCase().includes("failed to fetch") ||
        text.toLowerCase().includes("supabaseurl") ||
        text.toLowerCase().includes("supabasekey")
      ) {
        supabaseErrors.push(text);
      }
    }
  });

  page.on("pageerror", (err) => {
    if (err.message.toLowerCase().includes("supabase")) {
      supabaseErrors.push(`Page error: ${err.message}`);
    }
  });

  await page.goto(`${LIVE_URL}/quote`);
  await page.waitForLoadState("networkidle");

  expect(
    supabaseErrors,
    `Supabase-related errors on /quote:\n${supabaseErrors.join("\n")}`
  ).toHaveLength(0);
});
