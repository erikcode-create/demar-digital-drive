import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

// We'll mock the state module by writing test fixture files directly
const TEST_STATE_DIR = join(import.meta.dirname, "../../agents/state/__test_snapshot__");
const TEST_HISTORY_DIR = join(TEST_STATE_DIR, "history");

// Module under test — we pass stateDir override for testing
const MODULE_PATH = join(import.meta.dirname, "../snapshot.mjs");

describe("snapshot", () => {
  beforeEach(() => {
    mkdirSync(join(TEST_STATE_DIR, "analysis"), { recursive: true });
    mkdirSync(join(TEST_STATE_DIR, "intelligence"), { recursive: true });
    mkdirSync(join(TEST_STATE_DIR, "meta"), { recursive: true });
    mkdirSync(join(TEST_STATE_DIR, "strategy"), { recursive: true });
    mkdirSync(TEST_HISTORY_DIR, { recursive: true });
  });

  afterEach(() => {
    rmSync(TEST_STATE_DIR, { recursive: true, force: true });
  });

  it("creates a dated snapshot file", async () => {
    writeFileSync(
      join(TEST_STATE_DIR, "analysis/site-audit.json"),
      JSON.stringify({ score: 74, pages: [], _updatedAt: "2026-04-04T03:00:00Z" })
    );
    writeFileSync(
      join(TEST_STATE_DIR, "meta/run-log.json"),
      JSON.stringify([{ agent: "site-auditor", success: true }])
    );

    const { saveSnapshot } = await import(MODULE_PATH);
    const result = await saveSnapshot({
      stateDir: TEST_STATE_DIR,
      historyDir: TEST_HISTORY_DIR,
      date: "2026-04-04",
    });

    expect(result.path).toContain("2026-04-04.json");
    expect(existsSync(result.path)).toBe(true);

    const snapshot = JSON.parse(readFileSync(result.path, "utf-8"));
    expect(snapshot._date).toBe("2026-04-04");
    expect(snapshot._generatedAt).toBeDefined();
    expect(snapshot.siteAudit).toBeDefined();
    expect(snapshot.siteAudit.score).toBe(74);
    expect(snapshot.runLog).toBeInstanceOf(Array);
    expect(snapshot.runLog[0].agent).toBe("site-auditor");
  });

  it("reads all state categories into snapshot", async () => {
    writeFileSync(
      join(TEST_STATE_DIR, "analysis/site-audit.json"),
      JSON.stringify({ score: 61 })
    );
    writeFileSync(
      join(TEST_STATE_DIR, "analysis/eeat-scores.json"),
      JSON.stringify({ overall: 78 })
    );
    writeFileSync(
      join(TEST_STATE_DIR, "intelligence/rankings.json"),
      JSON.stringify({ keywords: [{ keyword: "freight reno", position: 4 }] })
    );

    const { saveSnapshot } = await import(MODULE_PATH);
    const result = await saveSnapshot({
      stateDir: TEST_STATE_DIR,
      historyDir: TEST_HISTORY_DIR,
      date: "2026-04-04",
    });

    const snapshot = JSON.parse(readFileSync(result.path, "utf-8"));
    expect(snapshot.siteAudit.score).toBe(61);
    expect(snapshot.eeatScores.overall).toBe(78);
    expect(snapshot.rankings.keywords[0].keyword).toBe("freight reno");
  });

  it("handles missing state files gracefully", async () => {
    // No state files written — empty dirs only
    const { saveSnapshot } = await import(MODULE_PATH);
    const result = await saveSnapshot({
      stateDir: TEST_STATE_DIR,
      historyDir: TEST_HISTORY_DIR,
      date: "2026-04-04",
    });

    const snapshot = JSON.parse(readFileSync(result.path, "utf-8"));
    expect(snapshot._date).toBe("2026-04-04");
    // No crash, just empty data
  });

  it("cleans up snapshots older than maxDays", async () => {
    // Create old snapshot files
    writeFileSync(join(TEST_HISTORY_DIR, "2026-01-01.json"), "{}");
    writeFileSync(join(TEST_HISTORY_DIR, "2026-01-02.json"), "{}");
    writeFileSync(join(TEST_HISTORY_DIR, "2026-04-03.json"), "{}");

    const { cleanupSnapshots } = await import(MODULE_PATH);
    const removed = cleanupSnapshots({
      historyDir: TEST_HISTORY_DIR,
      maxDays: 90,
      referenceDate: "2026-04-04",
    });

    expect(removed).toContain("2026-01-01.json");
    expect(removed).toContain("2026-01-02.json");
    expect(removed).not.toContain("2026-04-03.json");
    expect(existsSync(join(TEST_HISTORY_DIR, "2026-01-01.json"))).toBe(false);
    expect(existsSync(join(TEST_HISTORY_DIR, "2026-04-03.json"))).toBe(true);
  });

  it("loadHistory reads all snapshot files sorted by date", async () => {
    writeFileSync(
      join(TEST_HISTORY_DIR, "2026-04-02.json"),
      JSON.stringify({ _date: "2026-04-02", siteAudit: { score: 70 } })
    );
    writeFileSync(
      join(TEST_HISTORY_DIR, "2026-04-03.json"),
      JSON.stringify({ _date: "2026-04-03", siteAudit: { score: 72 } })
    );
    writeFileSync(
      join(TEST_HISTORY_DIR, "2026-04-04.json"),
      JSON.stringify({ _date: "2026-04-04", siteAudit: { score: 74 } })
    );

    const { loadHistory } = await import(MODULE_PATH);
    const history = loadHistory({ historyDir: TEST_HISTORY_DIR });

    expect(history).toHaveLength(3);
    expect(history[0]._date).toBe("2026-04-02");
    expect(history[2]._date).toBe("2026-04-04");
  });
});
