import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const TEST_DIR = join(import.meta.dirname, "__test_generate__");
const DIST_DIR = join(TEST_DIR, "dist");

describe("generate", () => {
  beforeEach(() => {
    mkdirSync(join(TEST_DIR, "state/analysis"), { recursive: true });
    mkdirSync(join(TEST_DIR, "state/meta"), { recursive: true });
    mkdirSync(join(TEST_DIR, "state/history"), { recursive: true });
    mkdirSync(DIST_DIR, { recursive: true });

    writeFileSync(
      join(TEST_DIR, "state/analysis/site-audit.json"),
      JSON.stringify({ score: 74, pages: [{ name: "Home", path: "/", issues: [] }] })
    );
    writeFileSync(
      join(TEST_DIR, "state/meta/run-log.json"),
      JSON.stringify([{ agent: "site-auditor", success: true, elapsed: "2s", timestamp: new Date().toISOString() }])
    );
    writeFileSync(
      join(TEST_DIR, "state/history/2026-04-03.json"),
      JSON.stringify({ _date: "2026-04-03", siteAudit: { score: 71 } })
    );
  });

  afterEach(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it("generates an HTML file with all required sections", async () => {
    const { generateDashboard } = await import("../generate.mjs");
    const outputPath = await generateDashboard({
      stateDir: join(TEST_DIR, "state"),
      historyDir: join(TEST_DIR, "state/history"),
      outputDir: DIST_DIR,
      token: "test-secret-123",
    });

    expect(existsSync(outputPath)).toBe(true);
    const html = readFileSync(outputPath, "utf-8");

    // Structure checks
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("DeMar SEO Dashboard");
    expect(html).toContain("chart.js");
    expect(html).toContain("Inter");

    // Token gate
    expect(html).not.toContain("test-secret-123"); // raw token NOT in output
    expect(html).toContain("crypto.subtle.digest"); // hash check present

    // Tabs
    expect(html).toContain('data-tab="health"');
    expect(html).toContain('data-tab="rankings"');
    expect(html).toContain('data-tab="agents"');
    expect(html).toContain('data-tab="changes"');
    expect(html).toContain("tab-health");
    expect(html).toContain("tab-rankings");

    // Data
    expect(html).toContain("DASHBOARD_DATA");
    expect(html).toContain("74"); // score
  });

  it("includes token hash but not raw token", async () => {
    const { generateDashboard } = await import("../generate.mjs");
    const outputPath = await generateDashboard({
      stateDir: join(TEST_DIR, "state"),
      historyDir: join(TEST_DIR, "state/history"),
      outputDir: DIST_DIR,
      token: "my-secret",
    });

    const html = readFileSync(outputPath, "utf-8");
    expect(html).not.toContain("my-secret");
    // Should contain a 64-char hex hash
    const hashMatch = html.match(/expectedHash\s*=\s*"([a-f0-9]{64})"/);
    expect(hashMatch).toBeTruthy();
  });

  it("works with no token (dev mode)", async () => {
    const { generateDashboard } = await import("../generate.mjs");
    const outputPath = await generateDashboard({
      stateDir: join(TEST_DIR, "state"),
      historyDir: join(TEST_DIR, "state/history"),
      outputDir: DIST_DIR,
    });

    const html = readFileSync(outputPath, "utf-8");
    expect(html).toContain("{{TOKEN_HASH}}"); // placeholder stays for dev mode
  });
});
