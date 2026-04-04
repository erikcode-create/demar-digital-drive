import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const BASELINE_PAGES = [
  { path: "/", name: "homepage" },
  { path: "/contact", name: "contact" },
  { path: "/quote", name: "quote" },
  { path: "/careers", name: "careers" },
  { path: "/services/dry-van", name: "services-dry-van" },
  { path: "/blog", name: "blog-index" },
  { path: "/resources", name: "resources-index" },
  { path: "/faq", name: "faq" },
  { path: "/about", name: "about" },
];

// Also load dynamic pages from staging manifest if it exists
function getDynamicPages() {
  try {
    const manifestPath = path.resolve(__dirname, "../../../staging-manifest.json");
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      return manifest.changes
        .filter((c: { url?: string }) => c.url)
        .map((c: { url: string }) => ({
          path: c.url,
          name: `dynamic-${c.url.replace(/\//g, "-").slice(1)}`,
        }));
    }
  } catch (_) { /* ignore missing state file */ }
  return [];
}

const ALL_PAGES = [...BASELINE_PAGES, ...getDynamicPages()];

test.describe("Visual Regression", () => {
  for (const pg of ALL_PAGES) {
    test(`${pg.name} matches visual baseline`, async ({ page }) => {
      await page.goto(pg.path);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000); // fonts/images

      await expect(page).toHaveScreenshot(`${pg.name}.png`, {
        maxDiffPixelRatio: 0.005,
        fullPage: true,
      });
    });
  }
});
