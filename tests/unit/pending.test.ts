import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PENDING_DIR = path.resolve(
  __dirname,
  "../../monitoring/agents/pending"
);

// ---------------------------------------------------------------------------
// Module type
// ---------------------------------------------------------------------------

type PendingModule = {
  writePending: (opts: {
    actionId: string;
    type: string;
    priority: number;
    targetPage?: string | null;
    targetKeyword?: string | null;
    targetFile?: string | null;
    reason?: string;
    agentModel?: string;
    reviewTier?: string;
    originalCode?: string;
    modifiedCode?: string;
    researchContext?: object;
    auxiliaryFiles?: Record<string, string>;
  }) => string;
  readPending: (actionId: string) => {
    manifest: Record<string, unknown>;
    originalCode: string;
    modifiedCode: string;
    researchContext: Record<string, unknown>;
  } | null;
  readAllPending: () => Record<string, unknown>[];
  updateManifest: (
    actionId: string,
    updates: Record<string, unknown>
  ) => Record<string, unknown> | null;
  updateModifiedCode: (actionId: string, newCode: string) => boolean;
  readAuxiliaryFile: (actionId: string, originalPath: string) => string | null;
  archivePending: (actionId: string) => string | null;
  cleanupArchive: (maxDays?: number) => string[];
  PENDING_DIR: string;
};

let pending: PendingModule;

// IDs used across test suites — prefixed with "test-" to avoid collisions
const TEST_ID = "test-act-001";
const TEST_ID_2 = "test-act-002";
const TEST_ID_3 = "test-act-003";
const ARCHIVE_TEST_ID = "test-archive-001";

function cleanAll() {
  // Remove all test- prefixed action directories
  if (!fs.existsSync(PENDING_DIR)) return;
  for (const entry of fs.readdirSync(PENDING_DIR)) {
    if (entry.startsWith("test-")) {
      fs.rmSync(path.join(PENDING_DIR, entry), { recursive: true, force: true });
    }
  }
  // Remove test archive date dirs (we inject known dates)
  const archiveDir = path.join(PENDING_DIR, "archive");
  if (fs.existsSync(archiveDir)) {
    for (const dateDir of fs.readdirSync(archiveDir)) {
      const full = path.join(archiveDir, dateDir);
      // Check if it contains only test- entries
      let hasNonTest = false;
      for (const entry of fs.readdirSync(full)) {
        if (!entry.startsWith("test-")) { hasNonTest = true; break; }
      }
      if (!hasNonTest) {
        fs.rmSync(full, { recursive: true, force: true });
      }
    }
    // Remove empty archive dir if we created it
    if (fs.existsSync(archiveDir) && fs.readdirSync(archiveDir).length === 0) {
      fs.rmdirSync(archiveDir);
    }
  }
}

beforeAll(async () => {
  pending = await import("../../monitoring/agents/lib/pending.mjs");
});

afterAll(() => {
  cleanAll();
});

beforeEach(() => {
  // Remove individual test IDs before each test for isolation
  for (const id of [TEST_ID, TEST_ID_2, TEST_ID_3]) {
    const dir = path.join(PENDING_DIR, id);
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

// ---------------------------------------------------------------------------
// PENDING_DIR export
// ---------------------------------------------------------------------------

describe("PENDING_DIR", () => {
  it("exports PENDING_DIR as an absolute path", () => {
    expect(typeof pending.PENDING_DIR).toBe("string");
    expect(path.isAbsolute(pending.PENDING_DIR)).toBe(true);
  });

  it("PENDING_DIR ends with 'pending'", () => {
    expect(pending.PENDING_DIR.endsWith("pending")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// writePending
// ---------------------------------------------------------------------------

describe("writePending", () => {
  it("returns the action directory path", () => {
    const result = pending.writePending({
      actionId: TEST_ID,
      type: "write-content",
      priority: 1,
    });
    expect(typeof result).toBe("string");
    expect(fs.existsSync(result)).toBe(true);
  });

  it("creates manifest.json with correct fields", () => {
    pending.writePending({
      actionId: TEST_ID,
      type: "write-content",
      priority: 2,
      targetPage: "/blog/test",
      targetKeyword: "trucking",
      targetFile: "src/pages/blog/Test.tsx",
      reason: "content gap",
      agentModel: "sonnet",
      reviewTier: "opus",
    });

    const manifestPath = path.join(PENDING_DIR, TEST_ID, "manifest.json");
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as Record<string, unknown>;
    expect(manifest.actionId).toBe(TEST_ID);
    expect(manifest.type).toBe("write-content");
    expect(manifest.priority).toBe(2);
    expect(manifest.targetPage).toBe("/blog/test");
    expect(manifest.targetKeyword).toBe("trucking");
    expect(manifest.targetFile).toBe("src/pages/blog/Test.tsx");
    expect(manifest.reason).toBe("content gap");
    expect(manifest.agentModel).toBe("sonnet");
    expect(manifest.reviewTier).toBe("opus");
    expect(manifest.status).toBe("pending");
    expect(manifest.revisionCount).toBe(0);
    expect(Array.isArray(manifest.reviewHistory)).toBe(true);
    expect((manifest.reviewHistory as unknown[]).length).toBe(0);
    expect(typeof manifest.generatedAt).toBe("string");
  });

  it("sets generatedAt to a valid ISO timestamp", () => {
    const before = new Date();
    pending.writePending({ actionId: TEST_ID, type: "fix-schema", priority: 1 });
    const after = new Date();

    const manifest = JSON.parse(
      fs.readFileSync(path.join(PENDING_DIR, TEST_ID, "manifest.json"), "utf-8")
    ) as Record<string, unknown>;
    const ts = new Date(manifest.generatedAt as string).getTime();
    expect(ts).toBeGreaterThanOrEqual(before.getTime() - 5);
    expect(ts).toBeLessThanOrEqual(after.getTime() + 5);
  });

  it("writes original.tsx with the provided code", () => {
    pending.writePending({
      actionId: TEST_ID,
      type: "write-content",
      priority: 1,
      originalCode: "// original code",
    });
    const code = fs.readFileSync(
      path.join(PENDING_DIR, TEST_ID, "original.tsx"),
      "utf-8"
    );
    expect(code).toBe("// original code");
  });

  it("writes modified.tsx with the provided code", () => {
    pending.writePending({
      actionId: TEST_ID,
      type: "write-content",
      priority: 1,
      modifiedCode: "// modified code",
    });
    const code = fs.readFileSync(
      path.join(PENDING_DIR, TEST_ID, "modified.tsx"),
      "utf-8"
    );
    expect(code).toBe("// modified code");
  });

  it("writes research.json with the provided context", () => {
    pending.writePending({
      actionId: TEST_ID,
      type: "write-content",
      priority: 1,
      researchContext: { keywords: ["freight", "shipping"], volume: 1000 },
    });
    const research = JSON.parse(
      fs.readFileSync(path.join(PENDING_DIR, TEST_ID, "research.json"), "utf-8")
    ) as Record<string, unknown>;
    expect(research.keywords).toEqual(["freight", "shipping"]);
    expect(research.volume).toBe(1000);
  });

  it("writes auxiliary files with sanitized names", () => {
    pending.writePending({
      actionId: TEST_ID,
      type: "write-content",
      priority: 1,
      auxiliaryFiles: {
        "src/App.tsx": "// App code",
        "src/router/index.ts": "// router",
      },
    });

    const dir = path.join(PENDING_DIR, TEST_ID);
    expect(fs.existsSync(path.join(dir, "aux-src-App.tsx"))).toBe(true);
    expect(
      fs.readFileSync(path.join(dir, "aux-src-App.tsx"), "utf-8")
    ).toBe("// App code");
  });

  it("records auxiliary file mapping in manifest.auxiliaryFiles", () => {
    pending.writePending({
      actionId: TEST_ID,
      type: "write-content",
      priority: 1,
      auxiliaryFiles: { "src/App.tsx": "// code" },
    });
    const manifest = JSON.parse(
      fs.readFileSync(path.join(PENDING_DIR, TEST_ID, "manifest.json"), "utf-8")
    ) as Record<string, unknown>;
    const auxFiles = manifest.auxiliaryFiles as Record<string, string>;
    expect(auxFiles["src/App.tsx"]).toBe("aux-src-App.tsx");
  });

  it("handles empty originalCode and modifiedCode gracefully", () => {
    pending.writePending({
      actionId: TEST_ID,
      type: "write-content",
      priority: 1,
      originalCode: "",
      modifiedCode: "",
    });
    const orig = fs.readFileSync(
      path.join(PENDING_DIR, TEST_ID, "original.tsx"),
      "utf-8"
    );
    const mod = fs.readFileSync(
      path.join(PENDING_DIR, TEST_ID, "modified.tsx"),
      "utf-8"
    );
    expect(orig).toBe("");
    expect(mod).toBe("");
  });

  it("uses defaults for optional fields", () => {
    pending.writePending({ actionId: TEST_ID, type: "fix-meta", priority: 3 });
    const manifest = JSON.parse(
      fs.readFileSync(path.join(PENDING_DIR, TEST_ID, "manifest.json"), "utf-8")
    ) as Record<string, unknown>;
    expect(manifest.targetPage).toBeNull();
    expect(manifest.targetKeyword).toBeNull();
    expect(manifest.targetFile).toBeNull();
    expect(manifest.agentModel).toBe("unknown");
    expect(manifest.reviewTier).toBe("sonnet");
    expect(manifest.reason).toBe("");
  });
});

// ---------------------------------------------------------------------------
// readPending
// ---------------------------------------------------------------------------

describe("readPending", () => {
  it("returns null for a non-existent actionId", () => {
    const result = pending.readPending("test-does-not-exist-xyz");
    expect(result).toBeNull();
  });

  it("returns manifest, originalCode, modifiedCode, and researchContext", () => {
    pending.writePending({
      actionId: TEST_ID,
      type: "write-content",
      priority: 1,
      originalCode: "orig",
      modifiedCode: "mod",
      researchContext: { key: "value" },
    });

    const result = pending.readPending(TEST_ID);
    expect(result).not.toBeNull();
    expect(result!.manifest.actionId).toBe(TEST_ID);
    expect(result!.originalCode).toBe("orig");
    expect(result!.modifiedCode).toBe("mod");
    expect((result!.researchContext as Record<string, unknown>).key).toBe("value");
  });

  it("round-trips all manifest fields", () => {
    pending.writePending({
      actionId: TEST_ID,
      type: "fix-schema",
      priority: 5,
      targetPage: "/services",
      targetKeyword: "ltl freight",
      targetFile: "src/pages/Services.tsx",
      reason: "Schema error",
      agentModel: "haiku",
      reviewTier: "sonnet",
    });

    const result = pending.readPending(TEST_ID);
    expect(result!.manifest.type).toBe("fix-schema");
    expect(result!.manifest.priority).toBe(5);
    expect(result!.manifest.targetPage).toBe("/services");
    expect(result!.manifest.targetKeyword).toBe("ltl freight");
    expect(result!.manifest.targetFile).toBe("src/pages/Services.tsx");
    expect(result!.manifest.reason).toBe("Schema error");
    expect(result!.manifest.agentModel).toBe("haiku");
    expect(result!.manifest.reviewTier).toBe("sonnet");
    expect(result!.manifest.status).toBe("pending");
    expect(result!.manifest.revisionCount).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// readAllPending
// ---------------------------------------------------------------------------

describe("readAllPending", () => {
  it("returns an empty array when no pending entries exist", () => {
    const result = pending.readAllPending();
    // Filter to test IDs only to avoid interference from other tests
    const testResults = result.filter((m) =>
      (m.actionId as string).startsWith("test-")
    );
    expect(Array.isArray(result)).toBe(true);
    expect(testResults.length).toBe(0);
  });

  it("returns manifests for all pending actions", () => {
    pending.writePending({ actionId: TEST_ID, type: "write-content", priority: 2 });
    pending.writePending({ actionId: TEST_ID_2, type: "fix-meta", priority: 1 });

    const all = pending.readAllPending().filter((m) =>
      (m.actionId as string).startsWith("test-")
    );
    expect(all.length).toBe(2);
  });

  it("sorts by priority ascending (lower number = higher priority)", () => {
    pending.writePending({ actionId: TEST_ID, type: "write-content", priority: 3 });
    pending.writePending({ actionId: TEST_ID_2, type: "fix-meta", priority: 1 });
    pending.writePending({ actionId: TEST_ID_3, type: "fix-schema", priority: 2 });

    const all = pending.readAllPending().filter((m) =>
      (m.actionId as string).startsWith("test-")
    );
    expect(all.length).toBe(3);
    expect(all[0].priority).toBe(1);
    expect(all[1].priority).toBe(2);
    expect(all[2].priority).toBe(3);
  });

  it("skips the archive directory", () => {
    // Make sure archive dir doesn't show up as a manifest
    const archiveDir = path.join(PENDING_DIR, "archive");
    fs.mkdirSync(archiveDir, { recursive: true });

    const all = pending.readAllPending();
    const archiveEntry = all.find(
      (m) => m.actionId === "archive"
    );
    expect(archiveEntry).toBeUndefined();
  });

  it("skips entries with non-pending status", () => {
    pending.writePending({ actionId: TEST_ID, type: "write-content", priority: 1 });
    // Manually change status to "approved"
    const manifestPath = path.join(PENDING_DIR, TEST_ID, "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as Record<string, unknown>;
    manifest.status = "approved";
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    const all = pending.readAllPending().filter((m) =>
      (m.actionId as string).startsWith("test-")
    );
    expect(all.find((m) => m.actionId === TEST_ID)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// updateManifest
// ---------------------------------------------------------------------------

describe("updateManifest", () => {
  it("returns null for a non-existent actionId", () => {
    const result = pending.updateManifest("test-nonexistent-xyz", { status: "approved" });
    expect(result).toBeNull();
  });

  it("merges updates into the manifest", () => {
    pending.writePending({ actionId: TEST_ID, type: "write-content", priority: 1 });

    const updated = pending.updateManifest(TEST_ID, {
      status: "approved",
      revisionCount: 1,
    });

    expect(updated).not.toBeNull();
    expect(updated!.status).toBe("approved");
    expect(updated!.revisionCount).toBe(1);
    // Original fields preserved
    expect(updated!.type).toBe("write-content");
    expect(updated!.actionId).toBe(TEST_ID);
  });

  it("persists changes to disk", () => {
    pending.writePending({ actionId: TEST_ID, type: "write-content", priority: 1 });
    pending.updateManifest(TEST_ID, { buildPassed: true });

    const onDisk = JSON.parse(
      fs.readFileSync(path.join(PENDING_DIR, TEST_ID, "manifest.json"), "utf-8")
    ) as Record<string, unknown>;
    expect(onDisk.buildPassed).toBe(true);
  });

  it("can append to reviewHistory via spread", () => {
    pending.writePending({ actionId: TEST_ID, type: "write-content", priority: 1 });

    const existing = pending.readPending(TEST_ID)!.manifest;
    const history = [
      ...(existing.reviewHistory as unknown[]),
      { reviewer: "opus", verdict: "approve", timestamp: new Date().toISOString() },
    ];
    const updated = pending.updateManifest(TEST_ID, { reviewHistory: history });

    expect((updated!.reviewHistory as unknown[]).length).toBe(1);
    expect(
      ((updated!.reviewHistory as Record<string, unknown>[])[0]).verdict
    ).toBe("approve");
  });

  it("returns the full merged manifest object", () => {
    pending.writePending({
      actionId: TEST_ID,
      type: "fix-meta",
      priority: 2,
      targetPage: "/about",
    });

    const updated = pending.updateManifest(TEST_ID, { status: "rejected" });
    expect(updated!.targetPage).toBe("/about");
    expect(updated!.priority).toBe(2);
    expect(updated!.status).toBe("rejected");
  });
});

// ---------------------------------------------------------------------------
// updateModifiedCode
// ---------------------------------------------------------------------------

describe("updateModifiedCode", () => {
  it("returns false for a non-existent actionId", () => {
    const result = pending.updateModifiedCode("test-nonexistent-xyz", "// new");
    expect(result).toBe(false);
  });

  it("returns true and overwrites modified.tsx", () => {
    pending.writePending({
      actionId: TEST_ID,
      type: "write-content",
      priority: 1,
      modifiedCode: "// original modified",
    });

    const ok = pending.updateModifiedCode(TEST_ID, "// revised code");
    expect(ok).toBe(true);

    const code = fs.readFileSync(
      path.join(PENDING_DIR, TEST_ID, "modified.tsx"),
      "utf-8"
    );
    expect(code).toBe("// revised code");
  });

  it("does not touch original.tsx", () => {
    pending.writePending({
      actionId: TEST_ID,
      type: "write-content",
      priority: 1,
      originalCode: "// keep this",
      modifiedCode: "// will change",
    });

    pending.updateModifiedCode(TEST_ID, "// changed");

    const orig = fs.readFileSync(
      path.join(PENDING_DIR, TEST_ID, "original.tsx"),
      "utf-8"
    );
    expect(orig).toBe("// keep this");
  });

  it("can set modified code to an empty string", () => {
    pending.writePending({
      actionId: TEST_ID,
      type: "write-content",
      priority: 1,
      modifiedCode: "// some code",
    });

    pending.updateModifiedCode(TEST_ID, "");
    const code = fs.readFileSync(
      path.join(PENDING_DIR, TEST_ID, "modified.tsx"),
      "utf-8"
    );
    expect(code).toBe("");
  });
});

// ---------------------------------------------------------------------------
// readAuxiliaryFile
// ---------------------------------------------------------------------------

describe("readAuxiliaryFile", () => {
  it("returns null for a non-existent actionId", () => {
    const result = pending.readAuxiliaryFile("test-nonexistent-xyz", "src/App.tsx");
    expect(result).toBeNull();
  });

  it("returns null for an originalPath not in auxiliaryFiles", () => {
    pending.writePending({
      actionId: TEST_ID,
      type: "write-content",
      priority: 1,
    });
    const result = pending.readAuxiliaryFile(TEST_ID, "src/NotStaged.tsx");
    expect(result).toBeNull();
  });

  it("returns the file contents for a staged auxiliary file", () => {
    pending.writePending({
      actionId: TEST_ID,
      type: "write-content",
      priority: 1,
      auxiliaryFiles: { "src/App.tsx": "// app code here" },
    });

    const result = pending.readAuxiliaryFile(TEST_ID, "src/App.tsx");
    expect(result).toBe("// app code here");
  });

  it("handles multiple auxiliary files correctly", () => {
    pending.writePending({
      actionId: TEST_ID,
      type: "write-content",
      priority: 1,
      auxiliaryFiles: {
        "src/App.tsx": "// app",
        "src/router/index.ts": "// router",
      },
    });

    expect(pending.readAuxiliaryFile(TEST_ID, "src/App.tsx")).toBe("// app");
    expect(pending.readAuxiliaryFile(TEST_ID, "src/router/index.ts")).toBe("// router");
  });
});

// ---------------------------------------------------------------------------
// archivePending
// ---------------------------------------------------------------------------

describe("archivePending", () => {
  afterAll(() => {
    // Clean up any leftover archive dirs from this suite
    const archiveDir = path.join(PENDING_DIR, "archive");
    if (fs.existsSync(archiveDir)) {
      const today = new Date().toISOString().slice(0, 10);
      const todayArchive = path.join(archiveDir, today);
      if (fs.existsSync(todayArchive)) {
        for (const entry of fs.readdirSync(todayArchive)) {
          if (entry.startsWith("test-")) {
            fs.rmSync(path.join(todayArchive, entry), { recursive: true, force: true });
          }
        }
        // Remove today's dir if empty
        if (fs.readdirSync(todayArchive).length === 0) {
          fs.rmdirSync(todayArchive);
        }
      }
      // Remove archive dir if empty
      if (fs.readdirSync(archiveDir).length === 0) {
        fs.rmdirSync(archiveDir);
      }
    }
  });

  it("returns null for a non-existent actionId", () => {
    const result = pending.archivePending("test-nonexistent-xyz");
    expect(result).toBeNull();
  });

  it("moves the action directory to archive/{today}/{actionId}", () => {
    pending.writePending({
      actionId: ARCHIVE_TEST_ID,
      type: "write-content",
      priority: 1,
    });

    const today = new Date().toISOString().slice(0, 10);
    const archivePath = pending.archivePending(ARCHIVE_TEST_ID);

    expect(archivePath).not.toBeNull();
    expect(archivePath).toContain("archive");
    expect(archivePath).toContain(today);
    expect(archivePath).toContain(ARCHIVE_TEST_ID);
    expect(fs.existsSync(archivePath!)).toBe(true);
  });

  it("removes the action from the pending directory", () => {
    pending.writePending({
      actionId: TEST_ID,
      type: "write-content",
      priority: 1,
    });

    pending.archivePending(TEST_ID);
    expect(fs.existsSync(path.join(PENDING_DIR, TEST_ID))).toBe(false);
  });

  it("archived directory contains manifest.json", () => {
    pending.writePending({
      actionId: TEST_ID_2,
      type: "write-content",
      priority: 1,
      targetPage: "/blog/archived",
    });

    const archivePath = pending.archivePending(TEST_ID_2)!;
    const manifestPath = path.join(archivePath, "manifest.json");
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as Record<string, unknown>;
    expect(manifest.targetPage).toBe("/blog/archived");

    // Clean up
    fs.rmSync(archivePath, { recursive: true, force: true });
  });

  it("archived action no longer appears in readAllPending", () => {
    pending.writePending({
      actionId: TEST_ID_3,
      type: "write-content",
      priority: 1,
    });

    pending.archivePending(TEST_ID_3);

    const all = pending.readAllPending().filter((m) =>
      (m.actionId as string).startsWith("test-")
    );
    expect(all.find((m) => m.actionId === TEST_ID_3)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// cleanupArchive
// ---------------------------------------------------------------------------

describe("cleanupArchive", () => {
  // Helper: create a fake archive date directory with a fake action inside
  function createFakeArchive(dateStr: string, actionId: string) {
    const dir = path.join(PENDING_DIR, "archive", dateStr, actionId);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, "manifest.json"),
      JSON.stringify({ actionId, status: "approved" }, null, 2)
    );
    return dir;
  }

  afterAll(() => {
    // Remove all test-cleanup-* archive dirs
    const archiveDir = path.join(PENDING_DIR, "archive");
    if (!fs.existsSync(archiveDir)) return;
    for (const dateDir of fs.readdirSync(archiveDir)) {
      const full = path.join(archiveDir, dateDir);
      for (const entry of fs.readdirSync(full)) {
        if (entry.startsWith("test-cleanup-")) {
          fs.rmSync(path.join(full, entry), { recursive: true, force: true });
        }
      }
      if (fs.readdirSync(full).length === 0) {
        fs.rmdirSync(full);
      }
    }
    if (fs.existsSync(archiveDir) && fs.readdirSync(archiveDir).length === 0) {
      fs.rmdirSync(archiveDir);
    }
  });

  it("returns empty array when archive directory does not exist", () => {
    // If archive doesn't exist, should not throw
    const result = pending.cleanupArchive(30);
    expect(Array.isArray(result)).toBe(true);
  });

  it("deletes archive dirs older than maxDays", () => {
    // Create a directory dated 60 days ago
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 60);
    const oldDateStr = oldDate.toISOString().slice(0, 10);
    createFakeArchive(oldDateStr, "test-cleanup-old");

    const removed = pending.cleanupArchive(30);
    expect(removed.length).toBeGreaterThanOrEqual(1);
    expect(
      fs.existsSync(path.join(PENDING_DIR, "archive", oldDateStr))
    ).toBe(false);
  });

  it("preserves archive dirs within maxDays", () => {
    // Create a directory dated 5 days ago
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 5);
    const recentDateStr = recentDate.toISOString().slice(0, 10);
    createFakeArchive(recentDateStr, "test-cleanup-recent");

    pending.cleanupArchive(30);

    const dir = path.join(PENDING_DIR, "archive", recentDateStr);
    // The date dir should still exist (we may not have cleaned it)
    // Check that the action dir still exists
    const actionDir = path.join(dir, "test-cleanup-recent");
    expect(fs.existsSync(actionDir)).toBe(true);

    // Clean up manually
    fs.rmSync(actionDir, { recursive: true, force: true });
    if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
  });

  it("skips non-date directory names gracefully", () => {
    // Create a directory with a non-date name
    const bogusDir = path.join(PENDING_DIR, "archive", "not-a-date");
    fs.mkdirSync(bogusDir, { recursive: true });

    // Should not throw
    expect(() => pending.cleanupArchive(30)).not.toThrow();

    // Clean up
    fs.rmdirSync(bogusDir);
  });

  it("returns the list of removed paths", () => {
    const veryOldDate = new Date();
    veryOldDate.setDate(veryOldDate.getDate() - 90);
    const veryOldDateStr = veryOldDate.toISOString().slice(0, 10);
    createFakeArchive(veryOldDateStr, "test-cleanup-very-old");

    const removed = pending.cleanupArchive(30);
    const removedPath = path.join(PENDING_DIR, "archive", veryOldDateStr);
    expect(removed).toContain(removedPath);
  });
});
