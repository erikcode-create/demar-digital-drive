import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_CATEGORY = "test-qa";
const TEST_STATE_DIR = path.resolve(
  __dirname,
  "../../monitoring/agents/state",
  TEST_CATEGORY
);
const META_STATE_DIR = path.resolve(
  __dirname,
  "../../monitoring/agents/state/meta"
);

// Track meta keys created during tests so we can clean up
const metaKeysCreated: string[] = [];

let state: {
  read: (category: string, key: string) => unknown;
  write: (category: string, key: string, data: object) => string;
  readAll: (category: string) => Record<string, unknown>;
  appendLog: (entry: object) => void;
  markRun: (agentName: string) => void;
  getLastRun: (agentName: string) => string | null;
  getDelta: (current: number | null, previous: number | null) => string;
  formatDelta: (current: number | null, previous: number | null) => string;
};

beforeAll(async () => {
  state = await import("../../monitoring/agents/lib/state.mjs");
});

afterAll(() => {
  // Clean up test-qa category
  if (fs.existsSync(TEST_STATE_DIR)) {
    fs.rmSync(TEST_STATE_DIR, { recursive: true, force: true });
  }

  // Clean up any meta keys we touched during tests
  for (const key of metaKeysCreated) {
    const fp = path.join(META_STATE_DIR, `${key}.json`);
    if (fs.existsSync(fp)) {
      fs.unlinkSync(fp);
    }
  }
});

beforeEach(() => {
  // Clean up test-qa directory between tests for isolation
  if (fs.existsSync(TEST_STATE_DIR)) {
    fs.rmSync(TEST_STATE_DIR, { recursive: true, force: true });
  }
});

// ---------------------------------------------------------------------------
// read / write
// ---------------------------------------------------------------------------

describe("write / read round-trip", () => {
  it("writes data and reads it back", () => {
    const data = { foo: "bar", count: 42 };
    state.write(TEST_CATEGORY, "round-trip", data);
    const result = state.read(TEST_CATEGORY, "round-trip") as Record<
      string,
      unknown
    >;

    expect(result).not.toBeNull();
    expect(result.foo).toBe("bar");
    expect(result.count).toBe(42);
  });

  it("automatically adds _updatedAt to written data", () => {
    const before = new Date();
    state.write(TEST_CATEGORY, "timestamps", { value: 1 });
    const after = new Date();

    const result = state.read(TEST_CATEGORY, "timestamps") as Record<
      string,
      unknown
    >;
    expect(result._updatedAt).toBeDefined();

    const updatedAt = new Date(result._updatedAt as string);
    expect(updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime() - 5);
    expect(updatedAt.getTime()).toBeLessThanOrEqual(after.getTime() + 5);
  });

  it("_updatedAt is a valid ISO string", () => {
    state.write(TEST_CATEGORY, "iso-check", { x: 1 });
    const result = state.read(TEST_CATEGORY, "iso-check") as Record<
      string,
      unknown
    >;
    expect(typeof result._updatedAt).toBe("string");
    expect(new Date(result._updatedAt as string).toISOString()).toBe(
      result._updatedAt
    );
  });

  it("overwrites existing data on second write", () => {
    state.write(TEST_CATEGORY, "overwrite", { value: "first" });
    state.write(TEST_CATEGORY, "overwrite", { value: "second" });
    const result = state.read(TEST_CATEGORY, "overwrite") as Record<
      string,
      unknown
    >;
    expect(result.value).toBe("second");
  });

  it("write returns the file path string", () => {
    const fp = state.write(TEST_CATEGORY, "return-path", { ok: true });
    expect(typeof fp).toBe("string");
    expect(fp).toContain("test-qa");
    expect(fp).toContain("return-path.json");
  });
});

// ---------------------------------------------------------------------------
// read — missing key
// ---------------------------------------------------------------------------

describe("read — non-existent key", () => {
  it("returns null when key does not exist", () => {
    const result = state.read(TEST_CATEGORY, "does-not-exist-key-xyz");
    expect(result).toBeNull();
  });

  it("returns null for a category that has never been written", () => {
    const result = state.read("test-never-created-category-xyz", "any-key");
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// readAll
// ---------------------------------------------------------------------------

describe("readAll", () => {
  it("returns empty object for missing category", () => {
    const result = state.readAll("test-qa-readall-missing");
    expect(result).toEqual({});
  });

  it("returns all written keys", () => {
    state.write(TEST_CATEGORY, "key-a", { letter: "a" });
    state.write(TEST_CATEGORY, "key-b", { letter: "b" });

    const result = state.readAll(TEST_CATEGORY) as Record<
      string,
      Record<string, unknown>
    >;
    expect(Object.keys(result)).toHaveLength(2);
    expect(result["key-a"].letter).toBe("a");
    expect(result["key-b"].letter).toBe("b");
  });
});

// ---------------------------------------------------------------------------
// appendLog
// ---------------------------------------------------------------------------

describe("appendLog", () => {
  // We use unique run-log keys via a wrapper, but appendLog always writes to
  // meta/run-log.json. We read the log before and after to verify our entry.
  it("appends an entry to the run log", () => {
    const uniqueId = `test-qa-${Date.now()}`;
    state.appendLog({ agent: "test-agent", runId: uniqueId });

    // Read the raw run-log file
    const logPath = path.resolve(
      __dirname,
      "../../monitoring/agents/state/meta/run-log.json"
    );
    expect(fs.existsSync(logPath)).toBe(true);

    const rawLog = JSON.parse(fs.readFileSync(logPath, "utf-8")) as Array<
      Record<string, unknown>
    >;
    const entry = rawLog.find((e) => e.runId === uniqueId);
    expect(entry).toBeDefined();
    expect(entry!.agent).toBe("test-agent");
  });

  it("adds a timestamp to each log entry", () => {
    const uniqueId = `test-ts-${Date.now()}`;
    const before = new Date();
    state.appendLog({ check: "timestamp-check", runId: uniqueId });
    const after = new Date();

    const logPath = path.resolve(
      __dirname,
      "../../monitoring/agents/state/meta/run-log.json"
    );
    const rawLog = JSON.parse(fs.readFileSync(logPath, "utf-8")) as Array<
      Record<string, unknown>
    >;
    const entry = rawLog.find((e) => e.runId === uniqueId);

    expect(entry!.timestamp).toBeDefined();
    const ts = new Date(entry!.timestamp as string).getTime();
    expect(ts).toBeGreaterThanOrEqual(before.getTime() - 5);
    expect(ts).toBeLessThanOrEqual(after.getTime() + 5);
  });

  it("appends multiple entries in order", () => {
    const id1 = `order-test-1-${Date.now()}`;
    const id2 = `order-test-2-${Date.now() + 1}`;
    state.appendLog({ seq: 1, runId: id1 });
    state.appendLog({ seq: 2, runId: id2 });

    const logPath = path.resolve(
      __dirname,
      "../../monitoring/agents/state/meta/run-log.json"
    );
    const rawLog = JSON.parse(fs.readFileSync(logPath, "utf-8")) as Array<
      Record<string, unknown>
    >;
    const idx1 = rawLog.findIndex((e) => e.runId === id1);
    const idx2 = rawLog.findIndex((e) => e.runId === id2);

    expect(idx1).toBeGreaterThanOrEqual(0);
    expect(idx2).toBeGreaterThan(idx1);
  });
});

// ---------------------------------------------------------------------------
// markRun / getLastRun
// ---------------------------------------------------------------------------

describe("markRun / getLastRun", () => {
  const testAgent = `test-qa-agent-${Date.now()}`;

  beforeAll(() => {
    // Track that we'll be writing to meta/last-run
    if (!metaKeysCreated.includes("last-run")) {
      metaKeysCreated.push("last-run");
    }
  });

  it("getLastRun returns null for an agent that has never run", () => {
    const result = state.getLastRun("test-qa-never-ran-agent-xyz-99999");
    expect(result).toBeNull();
  });

  it("markRun records the current time for an agent", () => {
    const before = new Date();
    state.markRun(testAgent);
    const after = new Date();

    const lastRun = state.getLastRun(testAgent);
    expect(lastRun).not.toBeNull();

    const ts = new Date(lastRun!).getTime();
    expect(ts).toBeGreaterThanOrEqual(before.getTime() - 5);
    expect(ts).toBeLessThanOrEqual(after.getTime() + 5);
  });

  it("markRun updates the timestamp on repeated calls", async () => {
    state.markRun(testAgent);
    const first = state.getLastRun(testAgent);

    // Small delay to ensure timestamps differ
    await new Promise((r) => setTimeout(r, 10));

    state.markRun(testAgent);
    const second = state.getLastRun(testAgent);

    expect(second).not.toBeNull();
    expect(new Date(second!).getTime()).toBeGreaterThanOrEqual(
      new Date(first!).getTime()
    );
  });

  it("markRun does not affect other agents", () => {
    const otherAgent = `test-qa-other-agent-${Date.now()}`;
    const wasNull = state.getLastRun(otherAgent);

    state.markRun(testAgent);

    // Only null if the other agent truly hasn't run yet
    if (wasNull === null) {
      expect(state.getLastRun(otherAgent)).toBeNull();
    }
  });
});

// ---------------------------------------------------------------------------
// getDelta
// ---------------------------------------------------------------------------

describe("getDelta", () => {
  it('returns "↑" when current is greater than previous', () => {
    expect(state.getDelta(10, 5)).toBe("↑");
    expect(state.getDelta(100, 1)).toBe("↑");
  });

  it('returns "↓" when current is less than previous', () => {
    expect(state.getDelta(3, 10)).toBe("↓");
    expect(state.getDelta(0, 100)).toBe("↓");
  });

  it('returns "→" when current equals previous', () => {
    expect(state.getDelta(5, 5)).toBe("→");
    expect(state.getDelta(0, 0)).toBe("→");
  });

  it('returns "→" when current is null', () => {
    expect(state.getDelta(null, 5)).toBe("→");
  });

  it('returns "→" when previous is null', () => {
    expect(state.getDelta(5, null)).toBe("→");
  });

  it('returns "→" when both are null', () => {
    expect(state.getDelta(null, null)).toBe("→");
  });
});

// ---------------------------------------------------------------------------
// formatDelta
// ---------------------------------------------------------------------------

describe("formatDelta", () => {
  it("formats a positive delta with a + sign and ↑ arrow", () => {
    expect(state.formatDelta(10, 5)).toBe("+5 ↑");
    expect(state.formatDelta(100, 90)).toBe("+10 ↑");
  });

  it("formats a negative delta without + sign and with ↓ arrow", () => {
    expect(state.formatDelta(3, 10)).toBe("-7 ↓");
    expect(state.formatDelta(0, 5)).toBe("-5 ↓");
  });

  it('formats zero delta as "0 →"', () => {
    expect(state.formatDelta(5, 5)).toBe("0 →");
  });

  it('returns "N/A" when current is null', () => {
    expect(state.formatDelta(null, 5)).toBe("N/A");
  });

  it('returns "N/A" when previous is null', () => {
    expect(state.formatDelta(5, null)).toBe("N/A");
  });

  it('returns "N/A" when both are null', () => {
    expect(state.formatDelta(null, null)).toBe("N/A");
  });
});
