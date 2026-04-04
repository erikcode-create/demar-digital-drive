import { test, expect } from "@playwright/test";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const facts = require("../fixtures/business-facts.json") as {
  phone: string;
  phoneTel: string;
  email: string;
  address: string;
  companyName: string;
  dotNumber: string;
  officeHours: string;
  dispatchHours: string;
};

// ── Header phone tel: link ────────────────────────────────────────────────────

test("header has phone tel: link with correct href", async ({ page }) => {
  await page.goto("/");
  // The top info bar has a tel: link wrapping the phone text
  const telLink = page.locator(`header a[href="tel:${facts.phoneTel}"]`).first();
  await expect(telLink).toBeVisible();
  await expect(telLink).toHaveAttribute("href", `tel:${facts.phoneTel}`);
});

// ── Footer phone number text ──────────────────────────────────────────────────

test("footer contains phone number text", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer).toContainText(facts.phone);
});

// ── Phone number on key pages ─────────────────────────────────────────────────

for (const path of ["/", "/contact", "/faq"]) {
  test(`phone number present on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("body")).toContainText(facts.phone);
  });
}

// ── Email mailto on /contact ──────────────────────────────────────────────────

test("/contact has email mailto link", async ({ page }) => {
  await page.goto("/contact");
  const mailtoLink = page.locator(
    `a[href="mailto:${facts.email}"]`
  ).first();
  await expect(mailtoLink).toBeVisible();
  await expect(mailtoLink).toHaveAttribute("href", `mailto:${facts.email}`);
});

// ── Address on /contact ───────────────────────────────────────────────────────

test("/contact shows office address", async ({ page }) => {
  await page.goto("/contact");
  // Address is split across two lines: "10471 Double R Blvd" and "Reno, NV 89521"
  await expect(page.locator("body")).toContainText("10471 Double R Blvd");
  await expect(page.locator("body")).toContainText("Reno, NV 89521");
});

// ── Company name misspelling check ────────────────────────────────────────────

const misspellings = [
  "Demar Transportation",
  "DeMar Transporation",
  "De Mar Transportation",
];

for (const misspelling of misspellings) {
  test(`company name misspelling not found: "${misspelling}"`, async ({
    page,
  }) => {
    // Check the most visible pages
    for (const path of ["/", "/contact", "/about"]) {
      await page.goto(path);
      const bodyText = await page.locator("body").innerText();
      expect(bodyText).not.toContain(misspelling);
    }
  });
}

// ── JSON-LD on homepage has correct phone ─────────────────────────────────────

test("homepage JSON-LD contains correct phone number", async ({ page }) => {
  await page.goto("/");

  const jsonLdContent = await page.evaluate(() => {
    const scripts = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]')
    );
    return scripts.map((s) => s.textContent).join("\n");
  });

  // The phone in JSON-LD is stored as "+1-775-230-4767" or "+17752304767"
  // Verify it contains the digits of the phone number
  const phoneDigits = facts.phoneTel.replace("+", ""); // "17752304767"
  expect(jsonLdContent).toMatch(/telephone/i);
  // Accept either format: +1-775-230-4767 or +17752304767
  const hasPhone =
    jsonLdContent.includes("+1-775-230-4767") ||
    jsonLdContent.includes(facts.phoneTel);
  expect(hasPhone).toBe(true);
});
