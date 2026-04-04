import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdirSync, rmSync, writeFileSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { createServer } from "http";

const TEST_DIR = join(import.meta.dirname, "__test_e2e__");
const DIST_DIR = join(TEST_DIR, "dist");
let outputPath;
let httpServer;
let serverPort;
let serverUrl;

/** Start a minimal static HTTP server that serves the dist directory */
function startServer(distDir) {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const filePath = join(distDir, "index.html");
      try {
        const content = readFileSync(filePath);
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(content);
      } catch (err) {
        res.writeHead(500);
        res.end("Server error: " + err.message);
      }
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, port });
    });
    server.on("error", reject);
  });
}

describe("E2E Dashboard", () => {
  beforeAll(async () => {
    // Create fixture data
    mkdirSync(join(TEST_DIR, "state/analysis"), { recursive: true });
    mkdirSync(join(TEST_DIR, "state/intelligence"), { recursive: true });
    mkdirSync(join(TEST_DIR, "state/meta"), { recursive: true });
    mkdirSync(join(TEST_DIR, "state/history"), { recursive: true });
    mkdirSync(DIST_DIR, { recursive: true });

    // Site audit with issues
    writeFileSync(join(TEST_DIR, "state/analysis/site-audit.json"), JSON.stringify({
      score: 74,
      pages: [
        { name: "Home", path: "/", issues: [] },
        { name: "Dry Van", path: "/services/dry-van", issues: [
          { severity: "warning", name: "Title too long", detail: "71 chars" },
        ]},
        { name: "Warehousing", path: "/services/warehousing", issues: [
          { severity: "critical", name: "Missing meta description" },
        ]},
      ],
    }));

    // Rankings
    writeFileSync(join(TEST_DIR, "state/intelligence/rankings.json"), JSON.stringify({
      keywords: [
        { keyword: "freight shipping reno", position: 4, change: 3, bestEver: 2, url: "/services/dry-van" },
        { keyword: "ltl freight nevada", position: 12, change: -2, bestEver: 8, url: "/services/ltl" },
      ],
    }));

    // Run log
    writeFileSync(join(TEST_DIR, "state/meta/run-log.json"), JSON.stringify([
      { agent: "site-auditor", success: true, elapsed: "2.6s", timestamp: "2026-04-04T03:40:00Z" },
      { agent: "rank-tracker", success: true, elapsed: "5.1s", timestamp: "2026-04-04T03:41:00Z" },
      { agent: "content-writer", success: false, summary: "API rate limit exceeded", timestamp: "2026-04-04T03:42:00Z" },
    ]));

    // Historical snapshots
    for (let i = 0; i < 7; i++) {
      const d = new Date("2026-03-29");
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      writeFileSync(join(TEST_DIR, "state/history", `${dateStr}.json`), JSON.stringify({
        _date: dateStr,
        siteAudit: { score: 68 + i },
        runLog: [{ agent: "test", success: true }],
      }));
    }

    // Generate dashboard
    const { generateDashboard } = await import("../generate.mjs");
    outputPath = await generateDashboard({
      stateDir: join(TEST_DIR, "state"),
      historyDir: join(TEST_DIR, "state/history"),
      outputDir: DIST_DIR,
      token: "e2e-test-token",
    });

    // Start HTTP server so crypto.subtle works (requires secure context / localhost)
    const { server, port } = await startServer(DIST_DIR);
    httpServer = server;
    serverPort = port;
    serverUrl = `http://127.0.0.1:${serverPort}`;
  }, 30000);

  afterAll(async () => {
    if (httpServer) {
      await new Promise((resolve) => httpServer.close(resolve));
    }
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it("generates HTML file", () => {
    expect(existsSync(outputPath)).toBe(true);
  });

  it("renders correctly in Playwright", async () => {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    try {
      // Load with valid token via HTTP so crypto.subtle is available
      await page.goto(`${serverUrl}/?key=e2e-test-token`);
      await page.waitForTimeout(500);

      // Header
      const title = await page.$eval(".header h1", (el) => el.textContent);
      expect(title).toContain("DeMar");

      // KPI cards — 4 in the main row + 3 in the Changes tab pipeline stats = 7 total in DOM
      const kpiCards = await page.$$(".kpi-card");
      expect(kpiCards.length).toBe(7);

      // Score ring
      const scoreValue = await page.$eval(".score-ring-text .number", (el) => el.textContent);
      expect(scoreValue).toBe("74");

      // Tabs exist
      const tabs = await page.$$(".tab");
      expect(tabs.length).toBe(4);

      // Default tab is active
      const activeTab = await page.$eval(".tab.active", (el) => el.textContent.trim());
      expect(activeTab).toBe("Site Health");

      // Site Health tab content visible
      const categoryCards = await page.$$(".category-card");
      expect(categoryCards.length).toBeGreaterThan(0);

      // Switch to Rankings tab
      await page.click('[data-tab="rankings"]');
      await page.waitForTimeout(200);
      const rankingsContent = await page.$("#tab-rankings");
      const isVisible = await rankingsContent.evaluate((el) => el.classList.contains("active"));
      expect(isVisible).toBe(true);

      // Keywords visible
      const keywordText = await page.textContent("#tab-rankings");
      expect(keywordText).toContain("freight shipping reno");

      // Switch to Agent Activity
      await page.click('[data-tab="agents"]');
      await page.waitForTimeout(200);
      const agentContent = await page.textContent("#tab-agents");
      expect(agentContent).toContain("site-auditor");

      // Switch to Changes
      await page.click('[data-tab="changes"]');
      await page.waitForTimeout(200);
      const changesVisible = await page.$("#tab-changes");
      const changesActive = await changesVisible.evaluate((el) => el.classList.contains("active"));
      expect(changesActive).toBe(true);

      // Chart.js canvases present
      const canvases = await page.$$("canvas");
      expect(canvases.length).toBeGreaterThanOrEqual(2);

      // Responsive: tablet
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(200);
      const tabletScreenshot = await page.screenshot({ fullPage: true });
      expect(tabletScreenshot.length).toBeGreaterThan(0);

      // Responsive: mobile
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(200);
      const mobileScreenshot = await page.screenshot({ fullPage: true });
      expect(mobileScreenshot.length).toBeGreaterThan(0);
    } finally {
      await browser.close();
    }
  }, 30000);

  it("blocks access without valid token", async () => {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
      // Load WITHOUT token
      await page.goto(`${serverUrl}/`);
      await page.waitForTimeout(1000);

      // Access denied should be visible
      const denied = await page.$("#access-denied");
      const deniedDisplay = await denied.evaluate((el) => getComputedStyle(el).display);
      expect(deniedDisplay).not.toBe("none");

      // App content should be hidden
      const app = await page.$("#app");
      const appDisplay = await app.evaluate((el) => getComputedStyle(el).display);
      expect(appDisplay).toBe("none");
    } finally {
      await browser.close();
    }
  }, 30000);

  it("blocks access with wrong token", async () => {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await page.goto(`${serverUrl}/?key=wrong-token`);
      await page.waitForTimeout(1000);

      const denied = await page.$("#access-denied");
      const deniedDisplay = await denied.evaluate((el) => getComputedStyle(el).display);
      expect(deniedDisplay).not.toBe("none");
    } finally {
      await browser.close();
    }
  }, 30000);
});
