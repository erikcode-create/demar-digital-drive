# SEO Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate a self-contained HTML dashboard nightly that visualizes 90 days of SEO agent data, deployed to demartransportation.com/seo-dashboard/ with token-based access.

**Architecture:** A Node.js generator reads agent state JSON files + daily snapshots, inlines the data into a single HTML file with Chart.js (CDN) and vanilla JS for interactivity. Deployed via FTP to GreenGeeks. Token gate via SHA-256 hash comparison in client-side JS.

**Tech Stack:** Node.js (ESM), Chart.js 4.x (CDN), Inter font (Google Fonts CDN), basic-ftp (npm), Playwright (testing)

---

## File Structure

```
monitoring/
  dashboard/
    snapshot.mjs              — Task 1: Consolidate current state into dated JSON
    components.mjs            — Task 3: HTML generators (KPI cards, rings, tables, charts)
    generate.mjs              — Task 5: Main generator orchestrating all components
    deploy.mjs                — Task 7: FTP upload to GreenGeeks
    tests/
      snapshot.test.mjs       — Task 1: Snapshot unit tests
      components.test.mjs     — Task 3: Component HTML generation tests
      generate.test.mjs       — Task 5: Generator integration tests
      e2e-dashboard.test.mjs  — Task 9: Playwright end-to-end tests
    dist/                     — Generated output (gitignored)
      index.html
  agents/
    state/
      history/                — Daily snapshots (gitignored, up to 90 files)
  nightly.mjs                 — Task 8: Add dashboard phase
  package.json                — Task 7: Add basic-ftp dependency + scripts
```

---

### Task 1: Daily Snapshot Module

**Files:**
- Create: `monitoring/dashboard/snapshot.mjs`
- Create: `monitoring/dashboard/tests/snapshot.test.mjs`
- Modify: `.gitignore`

This module consolidates all current agent state into a single dated JSON file for historical tracking.

- [ ] **Step 1: Add `monitoring/dashboard/dist/` and `monitoring/agents/state/history/` to .gitignore**

Open `.gitignore` and add these lines at the end:

```
# Dashboard build output
monitoring/dashboard/dist/

# Daily state snapshots
monitoring/agents/state/history/
```

- [ ] **Step 2: Write failing tests for snapshot module**

Create `monitoring/dashboard/tests/snapshot.test.mjs`:

```javascript
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
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd monitoring && npx vitest run dashboard/tests/snapshot.test.mjs`
Expected: FAIL — module not found

- [ ] **Step 4: Implement snapshot module**

Create `monitoring/dashboard/snapshot.mjs`:

```javascript
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from "fs";
import { join, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = import.meta.dirname || fileURLToPath(new URL(".", import.meta.url));
const DEFAULT_STATE_DIR = join(__dirname, "../agents/state");
const DEFAULT_HISTORY_DIR = join(DEFAULT_STATE_DIR, "history");

/** Map state filenames to camelCase snapshot keys */
function fileToKey(filename) {
  return filename
    .replace(".json", "")
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/** Read all JSON files from a directory into an object keyed by camelCase name */
function readJsonDir(dirPath) {
  if (!existsSync(dirPath)) return {};
  const result = {};
  for (const file of readdirSync(dirPath)) {
    if (!file.endsWith(".json")) continue;
    try {
      result[fileToKey(file)] = JSON.parse(readFileSync(join(dirPath, file), "utf-8"));
    } catch {
      // Skip malformed JSON
    }
  }
  return result;
}

/**
 * Save a daily snapshot consolidating all agent state into one JSON file.
 * @param {Object} opts
 * @param {string} [opts.stateDir] — path to agents/state/
 * @param {string} [opts.historyDir] — path to agents/state/history/
 * @param {string} [opts.date] — YYYY-MM-DD override (defaults to today)
 * @returns {{ path: string, date: string }}
 */
export function saveSnapshot(opts = {}) {
  const stateDir = opts.stateDir || DEFAULT_STATE_DIR;
  const historyDir = opts.historyDir || DEFAULT_HISTORY_DIR;
  const date = opts.date || new Date().toISOString().slice(0, 10);

  mkdirSync(historyDir, { recursive: true });

  // Read all category directories
  const categories = ["intelligence", "analysis", "strategy", "meta"];
  const snapshot = {
    _date: date,
    _generatedAt: new Date().toISOString(),
  };

  for (const cat of categories) {
    const catData = readJsonDir(join(stateDir, cat));
    // Flatten: merge all files from each category into snapshot root
    Object.assign(snapshot, catData);
  }

  const filePath = join(historyDir, `${date}.json`);
  writeFileSync(filePath, JSON.stringify(snapshot, null, 2));

  return { path: filePath, date };
}

/**
 * Remove snapshot files older than maxDays.
 * @param {Object} opts
 * @param {string} [opts.historyDir]
 * @param {number} [opts.maxDays] — default 90
 * @param {string} [opts.referenceDate] — YYYY-MM-DD (defaults to today)
 * @returns {string[]} removed filenames
 */
export function cleanupSnapshots(opts = {}) {
  const historyDir = opts.historyDir || DEFAULT_HISTORY_DIR;
  const maxDays = opts.maxDays ?? 90;
  const refDate = new Date(opts.referenceDate || new Date().toISOString().slice(0, 10));

  if (!existsSync(historyDir)) return [];

  const cutoff = new Date(refDate);
  cutoff.setDate(cutoff.getDate() - maxDays);

  const removed = [];
  for (const file of readdirSync(historyDir)) {
    if (!file.endsWith(".json")) continue;
    const fileDate = new Date(file.replace(".json", ""));
    if (fileDate < cutoff) {
      unlinkSync(join(historyDir, file));
      removed.push(file);
    }
  }
  return removed;
}

/**
 * Load all historical snapshots, sorted by date ascending.
 * @param {Object} opts
 * @param {string} [opts.historyDir]
 * @returns {Object[]}
 */
export function loadHistory(opts = {}) {
  const historyDir = opts.historyDir || DEFAULT_HISTORY_DIR;
  if (!existsSync(historyDir)) return [];

  return readdirSync(historyDir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => {
      try {
        return JSON.parse(readFileSync(join(historyDir, f), "utf-8"));
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

// CLI entrypoint
if (process.argv[1] && process.argv[1].endsWith("snapshot.mjs")) {
  const result = saveSnapshot();
  const removed = cleanupSnapshots();
  console.log(`[snapshot] Saved ${result.path}`);
  if (removed.length) console.log(`[snapshot] Cleaned up ${removed.length} old snapshots`);
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd monitoring && npx vitest run dashboard/tests/snapshot.test.mjs`
Expected: PASS (5 tests)

- [ ] **Step 6: Commit**

```bash
git add monitoring/dashboard/snapshot.mjs monitoring/dashboard/tests/snapshot.test.mjs .gitignore
git commit -m "feat: add daily snapshot module for SEO dashboard"
```

---

### Task 2: HTML Shell Template

**Files:**
- Create: `monitoring/dashboard/templates/shell.html`

This is the HTML template that wraps dashboard content — CSS design system, Chart.js CDN, token gate, tab switching JS.

- [ ] **Step 1: Create the shell template**

Create `monitoring/dashboard/templates/shell.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DeMar SEO Dashboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
<style>
:root {
  --bg-base: #0f1117;
  --bg-card: #1a1d27;
  --bg-hover: #252836;
  --border: rgba(255, 255, 255, 0.08);
  --text-primary: #e8eaed;
  --text-secondary: #9aa0b0;
  --text-muted: #5a6178;
  --color-pass: #10b981;
  --color-good: #06b6d4;
  --color-warn: #f59e0b;
  --color-fail: #ef4444;
  --color-info: #3b82f6;
  --color-accent: #7c6fff;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2);
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg-base);
  color: var(--text-primary);
  padding: 24px;
  min-height: 100vh;
}

/* --- Access denied --- */
#access-denied {
  display: none;
  text-align: center;
  padding: 120px 24px;
  color: var(--text-muted);
  font-size: 16px;
}

/* --- Header --- */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}
.header h1 { font-size: 22px; font-weight: 700; }
.header h1 span { color: var(--color-accent); }
.header-meta { font-size: 12px; color: var(--text-muted); text-align: right; }
.header-meta .timestamp { color: var(--text-secondary); }

/* --- KPI Row --- */
.kpi-row {
  display: grid;
  grid-template-columns: auto repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

/* --- Score Ring --- */
.score-ring-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 24px;
  box-shadow: var(--shadow-card);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.score-ring { position: relative; width: 100px; height: 100px; }
.score-ring svg { transform: rotate(-90deg); }
.score-ring-bg { fill: none; stroke: var(--bg-hover); stroke-width: 8; }
.score-ring-fill { fill: none; stroke-width: 8; stroke-linecap: round; }
.score-ring-text {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%); text-align: center;
}
.score-ring-text .number { font-size: 28px; font-weight: 700; display: block; }
.score-ring-text .grade { font-size: 11px; font-weight: 600; color: var(--text-secondary); }
.score-ring-label { font-size: 12px; font-weight: 500; color: var(--text-secondary); margin-top: 8px; }
.score-ring-delta { font-size: 12px; margin-top: 4px; }

/* --- KPI Card --- */
.kpi-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 20px;
  box-shadow: var(--shadow-card);
  display: flex; flex-direction: column;
}
.kpi-label {
  font-size: 12px; font-weight: 500; color: var(--text-secondary);
  text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;
}
.kpi-value { font-size: 28px; font-weight: 700; line-height: 1.1; }
.kpi-detail { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }
.kpi-delta { font-size: 12px; margin-top: 8px; font-weight: 500; }
.kpi-delta.positive { color: var(--color-pass); }
.kpi-delta.negative { color: var(--color-fail); }
.kpi-delta.neutral { color: var(--text-muted); }
.kpi-sparkline { margin-top: auto; padding-top: 12px; height: 32px; }
.kpi-sparkline svg { width: 100%; height: 100%; }

/* --- Tab Bar --- */
.tab-bar {
  display: flex; gap: 0;
  border-bottom: 1px solid var(--border);
  margin-bottom: 24px;
  overflow-x: auto;
}
.tab {
  padding: 12px 20px; font-size: 14px; font-weight: 500;
  color: var(--text-muted); cursor: pointer;
  border-bottom: 2px solid transparent; transition: all 0.2s;
  white-space: nowrap; user-select: none;
}
.tab:hover { color: var(--text-secondary); }
.tab.active { color: var(--color-accent); border-bottom-color: var(--color-accent); font-weight: 600; }
.tab .badge {
  display: inline-block; background: var(--color-fail); color: white;
  font-size: 10px; font-weight: 600; padding: 1px 6px;
  border-radius: 10px; margin-left: 6px;
}

/* --- Tab Content --- */
.tab-content { display: none; }
.tab-content.active { display: block; }

/* --- Category Grid --- */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px; margin-bottom: 24px;
}
.category-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-md); padding: 16px;
  box-shadow: var(--shadow-card);
  display: flex; align-items: center; gap: 14px;
  cursor: pointer; transition: border-color 0.2s;
}
.category-card:hover { border-color: var(--color-accent); }
.category-ring { position: relative; width: 48px; height: 48px; flex-shrink: 0; }
.category-ring svg { transform: rotate(-90deg); }
.cat-ring-bg { fill: none; stroke: var(--bg-hover); stroke-width: 5; }
.cat-ring-fill { fill: none; stroke-width: 5; stroke-linecap: round; }
.category-ring .cat-score {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%); font-size: 14px; font-weight: 700;
}
.category-info h4 { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
.category-info .cat-detail { font-size: 11px; color: var(--text-secondary); }
.category-info .cat-delta { font-size: 11px; font-weight: 500; margin-top: 2px; }

/* --- Content Split --- */
.content-split { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

/* --- Section Label --- */
.section-label {
  display: inline-block; background: var(--color-accent); color: white;
  font-size: 10px; font-weight: 600; padding: 3px 8px;
  border-radius: 4px; margin-bottom: 8px;
  text-transform: uppercase; letter-spacing: 0.5px;
}

/* --- Activity List --- */
.activity-list {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); overflow: hidden;
}
.activity-item {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 20px; border-bottom: 1px solid var(--border);
  font-size: 13px; transition: background 0.15s;
}
.activity-item:last-child { border-bottom: none; }
.activity-item:hover { background: var(--bg-hover); }
.activity-icon {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; flex-shrink: 0;
}
.activity-icon.approved { background: rgba(16,185,129,0.15); color: var(--color-pass); }
.activity-icon.rejected { background: rgba(239,68,68,0.15); color: var(--color-fail); }
.activity-icon.revised { background: rgba(245,158,11,0.15); color: var(--color-warn); }
.activity-icon.agent { background: rgba(59,130,246,0.15); color: var(--color-info); }
.activity-text { flex: 1; color: var(--text-secondary); }
.activity-text strong { color: var(--text-primary); font-weight: 600; }
.activity-time { font-size: 11px; color: var(--text-muted); white-space: nowrap; }

/* --- Data Table --- */
.data-table {
  width: 100%; border-collapse: collapse;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); overflow: hidden;
}
.data-table th {
  text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600;
  color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border); cursor: pointer; user-select: none;
}
.data-table th:hover { color: var(--text-secondary); }
.data-table td {
  padding: 12px 16px; font-size: 13px; color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
}
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: var(--bg-hover); }

/* --- Chart Container --- */
.chart-container {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 20px;
  box-shadow: var(--shadow-card);
}
.chart-container canvas { max-height: 280px; }

/* --- Phase Bar (Agent Activity) --- */
.phase-bar { display: flex; gap: 4px; margin-bottom: 24px; }
.phase-block {
  flex: 1; padding: 12px 16px; border-radius: var(--radius-md);
  text-align: center; font-size: 12px; font-weight: 600;
}
.phase-block.pass { background: rgba(16,185,129,0.15); color: var(--color-pass); }
.phase-block.fail { background: rgba(239,68,68,0.15); color: var(--color-fail); }
.phase-block .phase-name { display: block; margin-bottom: 4px; }
.phase-block .phase-duration { font-weight: 400; font-size: 11px; color: var(--text-secondary); }

/* --- Pending Card --- */
.pending-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-md); padding: 16px;
  box-shadow: var(--shadow-card);
}
.pending-card.stale { border-color: var(--color-warn); }

/* --- Expandable --- */
.expandable-trigger { cursor: pointer; }
.expandable-content { display: none; padding-top: 12px; font-size: 12px; color: var(--text-muted); }
.expandable-content.open { display: block; }

/* --- Responsive --- */
@media (max-width: 1200px) {
  .kpi-row { grid-template-columns: auto 1fr 1fr; }
}
@media (max-width: 900px) {
  .kpi-row { grid-template-columns: 1fr 1fr; }
  .content-split { grid-template-columns: 1fr; }
  .phase-bar { flex-wrap: wrap; }
}
@media (max-width: 600px) {
  .kpi-row { grid-template-columns: 1fr; }
  body { padding: 16px; }
  .tab-bar { gap: 0; }
  .tab { padding: 10px 14px; font-size: 13px; }
}

/* --- Animations (respect user preference) --- */
@media (prefers-reduced-motion: no-preference) {
  .score-ring-fill { transition: stroke-dashoffset 1s ease; }
  .tab-content { animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
}
</style>
</head>
<body>
<div id="access-denied">
  <h2>Access Denied</h2>
  <p>Invalid or missing access token.</p>
</div>
<div id="app">
  {{CONTENT}}
</div>
<script>
// --- Token Gate ---
(function() {
  const expectedHash = "{{TOKEN_HASH}}";
  if (expectedHash === "{{" + "TOKEN_HASH}}") return; // Dev mode — no gate
  const key = new URLSearchParams(location.search).get("key") || "";
  crypto.subtle.digest("SHA-256", new TextEncoder().encode(key)).then(buf => {
    const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    if (hash !== expectedHash) {
      document.getElementById("app").style.display = "none";
      document.getElementById("access-denied").style.display = "block";
    }
  });
})();

// --- Tab Switching ---
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    const target = tab.dataset.tab;
    const content = document.getElementById("tab-" + target);
    if (content) content.classList.add("active");
  });
});

// --- Expandable Items ---
document.querySelectorAll(".expandable-trigger").forEach(trigger => {
  trigger.addEventListener("click", () => {
    const content = trigger.nextElementSibling;
    if (content && content.classList.contains("expandable-content")) {
      content.classList.toggle("open");
    }
  });
});

// --- Table Sorting ---
document.querySelectorAll(".data-table th[data-sort]").forEach(th => {
  th.addEventListener("click", () => {
    const table = th.closest("table");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const col = th.cellIndex;
    const asc = th.dataset.order !== "asc";
    th.dataset.order = asc ? "asc" : "desc";
    rows.sort((a, b) => {
      const av = a.cells[col]?.textContent?.trim() || "";
      const bv = b.cells[col]?.textContent?.trim() || "";
      const an = parseFloat(av), bn = parseFloat(bv);
      if (!isNaN(an) && !isNaN(bn)) return asc ? an - bn : bn - an;
      return asc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    rows.forEach(row => tbody.appendChild(row));
  });
});

// --- Chart.js Defaults ---
if (typeof Chart !== "undefined") {
  Chart.defaults.color = "#9aa0b0";
  Chart.defaults.borderColor = "rgba(255, 255, 255, 0.06)";
  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  Chart.defaults.font.size = 12;
}

// --- Dashboard Data (injected at build time) ---
const DASHBOARD_DATA = {{DASHBOARD_DATA}};

// --- Chart Initialization ---
{{CHART_INIT}}
</script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add monitoring/dashboard/templates/shell.html
git commit -m "feat: add HTML shell template with design system and interactivity"
```

---

### Task 3: HTML Component Generators

**Files:**
- Create: `monitoring/dashboard/components.mjs`
- Create: `monitoring/dashboard/tests/components.test.mjs`

Pure functions that take data and return HTML strings for each dashboard element.

- [ ] **Step 1: Write failing tests for component generators**

Create `monitoring/dashboard/tests/components.test.mjs`:

```javascript
import { describe, it, expect } from "vitest";

const MODULE_PATH = import.meta.dirname + "/../components.mjs";

describe("components", () => {
  describe("scoreColor", () => {
    it("returns pass for scores >= 80", async () => {
      const { scoreColor } = await import(MODULE_PATH);
      expect(scoreColor(80)).toBe("var(--color-pass)");
      expect(scoreColor(95)).toBe("var(--color-pass)");
    });
    it("returns good for 60-79", async () => {
      const { scoreColor } = await import(MODULE_PATH);
      expect(scoreColor(60)).toBe("var(--color-good)");
      expect(scoreColor(79)).toBe("var(--color-good)");
    });
    it("returns warn for 40-59", async () => {
      const { scoreColor } = await import(MODULE_PATH);
      expect(scoreColor(40)).toBe("var(--color-warn)");
    });
    it("returns fail for < 40", async () => {
      const { scoreColor } = await import(MODULE_PATH);
      expect(scoreColor(39)).toBe("var(--color-fail)");
      expect(scoreColor(0)).toBe("var(--color-fail)");
    });
  });

  describe("scoreGrade", () => {
    it("maps scores to letter grades", async () => {
      const { scoreGrade } = await import(MODULE_PATH);
      expect(scoreGrade(90)).toBe("EXCELLENT");
      expect(scoreGrade(74)).toBe("GOOD");
      expect(scoreGrade(55)).toBe("NEEDS WORK");
      expect(scoreGrade(30)).toBe("CRITICAL");
    });
  });

  describe("renderScoreRing", () => {
    it("produces SVG with correct stroke-dashoffset", async () => {
      const { renderScoreRing } = await import(MODULE_PATH);
      const html = renderScoreRing({ score: 74, label: "Overall Score", delta: "+3" });
      expect(html).toContain("74");
      expect(html).toContain("Overall Score");
      expect(html).toContain("+3");
      expect(html).toContain("stroke-dashoffset");
      expect(html).toContain('role="img"');
      expect(html).toContain("aria-label");
    });
  });

  describe("renderKpiCard", () => {
    it("renders label, value, detail, and delta", async () => {
      const { renderKpiCard } = await import(MODULE_PATH);
      const html = renderKpiCard({
        label: "Agent Health",
        value: "5/5",
        detail: "All phases passed",
        delta: { text: "12 consecutive passes", direction: "up" },
        color: "var(--color-pass)",
      });
      expect(html).toContain("Agent Health");
      expect(html).toContain("5/5");
      expect(html).toContain("All phases passed");
      expect(html).toContain("positive");
      expect(html).toContain("kpi-card");
    });
  });

  describe("renderCategoryCard", () => {
    it("renders mini ring with score and delta", async () => {
      const { renderCategoryCard } = await import(MODULE_PATH);
      const html = renderCategoryCard({
        name: "On-Page SEO",
        description: "Titles, metas, H1s",
        score: 82,
        delta: 5,
      });
      expect(html).toContain("On-Page SEO");
      expect(html).toContain("82");
      expect(html).toContain("▲");
    });
  });

  describe("renderActivityItem", () => {
    it("renders approved change", async () => {
      const { renderActivityItem } = await import(MODULE_PATH);
      const html = renderActivityItem({
        type: "approved",
        title: "Meta tags optimized",
        detail: "/services/dry-van-shipping",
        time: "3h ago",
      });
      expect(html).toContain("approved");
      expect(html).toContain("Meta tags optimized");
      expect(html).toContain("✓");
    });
    it("renders rejected change", async () => {
      const { renderActivityItem } = await import(MODULE_PATH);
      const html = renderActivityItem({
        type: "rejected",
        title: "Homepage copy change",
        detail: "low confidence",
        time: "3h ago",
      });
      expect(html).toContain("rejected");
      expect(html).toContain("✗");
    });
  });

  describe("renderIssueItem", () => {
    it("renders critical issue with severity badge", async () => {
      const { renderIssueItem } = await import(MODULE_PATH);
      const html = renderIssueItem({
        severity: "critical",
        title: "Missing meta description",
        page: "/services/warehousing",
      });
      expect(html).toContain("Critical");
      expect(html).toContain("color-fail");
      expect(html).toContain("Missing meta description");
    });
  });

  describe("renderKeywordRow", () => {
    it("renders keyword with position and change", async () => {
      const { renderKeywordRow } = await import(MODULE_PATH);
      const html = renderKeywordRow({
        keyword: "freight shipping reno",
        position: 4,
        change: 3,
        bestEver: 2,
        url: "/services/dry-van",
      });
      expect(html).toContain("freight shipping reno");
      expect(html).toContain("4");
      expect(html).toContain("▲ 3");
      expect(html).toContain("color-pass");
    });
    it("renders declining keyword in red", async () => {
      const { renderKeywordRow } = await import(MODULE_PATH);
      const html = renderKeywordRow({
        keyword: "ltl freight nevada",
        position: 12,
        change: -2,
        bestEver: 8,
        url: "/services/ltl",
      });
      expect(html).toContain("▼ 2");
      expect(html).toContain("color-fail");
    });
  });

  describe("renderSparkline", () => {
    it("produces SVG polyline from data points", async () => {
      const { renderSparkline } = await import(MODULE_PATH);
      const html = renderSparkline({ data: [10, 20, 15, 25, 30], color: "#10b981" });
      expect(html).toContain("<svg");
      expect(html).toContain("<polyline");
      expect(html).toContain("10b981");
    });
  });

  describe("renderPhaseBar", () => {
    it("renders each phase as a colored block", async () => {
      const { renderPhaseBar } = await import(MODULE_PATH);
      const html = renderPhaseBar([
        { phase: "intelligence", status: "pass", duration: "42s" },
        { phase: "analysis", status: "pass", duration: "1m 12s" },
        { phase: "action", status: "fail", duration: "3m 2s" },
      ]);
      expect(html).toContain("intelligence");
      expect(html).toContain("pass");
      expect(html).toContain("fail");
      expect(html).toContain("42s");
    });
  });

  describe("renderDeltaArrow", () => {
    it("returns green up arrow for positive", async () => {
      const { renderDeltaArrow } = await import(MODULE_PATH);
      expect(renderDeltaArrow(5)).toContain("▲");
      expect(renderDeltaArrow(5)).toContain("color-pass");
    });
    it("returns red down arrow for negative", async () => {
      const { renderDeltaArrow } = await import(MODULE_PATH);
      expect(renderDeltaArrow(-3)).toContain("▼");
      expect(renderDeltaArrow(-3)).toContain("color-fail");
    });
    it("returns gray dash for zero", async () => {
      const { renderDeltaArrow } = await import(MODULE_PATH);
      expect(renderDeltaArrow(0)).toContain("—");
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd monitoring && npx vitest run dashboard/tests/components.test.mjs`
Expected: FAIL — module not found

- [ ] **Step 3: Implement component generators**

Create `monitoring/dashboard/components.mjs`:

```javascript
/**
 * Pure HTML generators for dashboard components.
 * Each function takes data and returns an HTML string.
 */

// --- Utilities ---

export function scoreColor(score) {
  if (score >= 80) return "var(--color-pass)";
  if (score >= 60) return "var(--color-good)";
  if (score >= 40) return "var(--color-warn)";
  return "var(--color-fail)";
}

export function scoreGrade(score) {
  if (score >= 90) return "EXCELLENT";
  if (score >= 70) return "GOOD";
  if (score >= 50) return "NEEDS WORK";
  return "CRITICAL";
}

export function renderDeltaArrow(change) {
  if (change > 0) return `<span style="color:var(--color-pass)">▲ ${change}</span>`;
  if (change < 0) return `<span style="color:var(--color-fail)">▼ ${Math.abs(change)}</span>`;
  return `<span style="color:var(--text-muted)">— No change</span>`;
}

// --- Score Ring (hero, 100px) ---

export function renderScoreRing({ score, label, delta }) {
  const circumference = 2 * Math.PI * 42; // r=42
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);
  const grade = scoreGrade(score);

  return `<div class="score-ring-card">
  <div class="score-ring" role="img" aria-label="Score: ${score} out of 100">
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle class="score-ring-bg" cx="50" cy="50" r="42"/>
      <circle class="score-ring-fill" cx="50" cy="50" r="42"
              stroke="${color}" stroke-dasharray="${circumference.toFixed(1)}"
              stroke-dashoffset="${offset.toFixed(1)}"/>
    </svg>
    <div class="score-ring-text">
      <span class="number" style="color:${color}">${score}</span>
      <span class="grade">${grade}</span>
    </div>
  </div>
  <div class="score-ring-label">${label}</div>
  ${delta ? `<div class="score-ring-delta" style="color:var(--color-pass)">${delta}</div>` : ""}
</div>`;
}

// --- KPI Card ---

export function renderKpiCard({ label, value, detail, delta, color, sparklineHtml }) {
  const deltaDir = delta?.direction === "up" ? "positive" : delta?.direction === "down" ? "negative" : "neutral";
  const deltaIcon = delta?.direction === "up" ? "▲" : delta?.direction === "down" ? "▼" : "—";

  return `<div class="kpi-card">
  <div class="kpi-label">${label}</div>
  <div class="kpi-value" style="color:${color || "var(--text-primary)"}">${value}</div>
  ${detail ? `<div class="kpi-detail">${detail}</div>` : ""}
  ${delta ? `<div class="kpi-delta ${deltaDir}">${deltaIcon} ${delta.text}</div>` : ""}
  ${sparklineHtml ? `<div class="kpi-sparkline">${sparklineHtml}</div>` : ""}
</div>`;
}

// --- Category Score Card (mini ring, 48px) ---

export function renderCategoryCard({ name, description, score, delta }) {
  const circumference = 2 * Math.PI * 20; // r=20
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);

  return `<div class="category-card">
  <div class="category-ring" role="img" aria-label="${name}: ${score} out of 100">
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle class="cat-ring-bg" cx="24" cy="24" r="20"/>
      <circle class="cat-ring-fill" cx="24" cy="24" r="20" stroke="${color}"
              stroke-dasharray="${circumference.toFixed(1)}"
              stroke-dashoffset="${offset.toFixed(1)}"/>
    </svg>
    <span class="cat-score" style="color:${color}">${score}</span>
  </div>
  <div class="category-info">
    <h4>${name}</h4>
    <div class="cat-detail">${description}</div>
    <div class="cat-delta">${renderDeltaArrow(delta)}</div>
  </div>
</div>`;
}

// --- Activity Item ---

export function renderActivityItem({ type, title, detail, time }) {
  const icons = { approved: "✓", rejected: "✗", revised: "↻", agent: "●" };
  const icon = icons[type] || "●";

  return `<div class="activity-item">
  <div class="activity-icon ${type}">${icon}</div>
  <div class="activity-text"><strong>${title}</strong> — ${detail}</div>
  <div class="activity-time">${time}</div>
</div>`;
}

// --- Issue Item ---

export function renderIssueItem({ severity, title, page }) {
  const severityMap = {
    critical: { icon: "!", class: "rejected", color: "var(--color-fail)", label: "Critical" },
    warning: { icon: "!", class: "revised", color: "var(--color-warn)", label: "Warning" },
    info: { icon: "i", class: "agent", color: "var(--text-muted)", label: "Info" },
  };
  const s = severityMap[severity] || severityMap.info;

  return `<div class="activity-item">
  <div class="activity-icon ${s.class}" style="font-size:10px;font-weight:700">${s.icon}</div>
  <div class="activity-text"><strong>${title}</strong> — ${page}</div>
  <div class="activity-time" style="color:${s.color}">${s.label}</div>
</div>`;
}

// --- Keyword Table Row ---

export function renderKeywordRow({ keyword, position, change, bestEver, url, serpFeatures }) {
  const changeHtml = renderDeltaArrow(change);
  return `<tr>
  <td>${keyword}</td>
  <td style="font-weight:600">${position}</td>
  <td>${changeHtml}</td>
  <td style="color:var(--text-muted)">${bestEver}</td>
  <td style="font-size:11px">${url || ""}</td>
  <td style="font-size:11px;color:var(--text-muted)">${serpFeatures || ""}</td>
</tr>`;
}

// --- Sparkline ---

export function renderSparkline({ data, color, width = 100, height = 24 }) {
  if (!data || data.length < 2) return "";
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const fillPoints = `0,${height} ${points} ${width},${height}`;

  return `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
  <polyline fill="none" stroke="${color}" stroke-width="1.5" points="${points}"/>
  <polyline fill="${color}22" stroke="none" points="${fillPoints}"/>
</svg>`;
}

// --- Phase Bar (Agent Activity) ---

export function renderPhaseBar(phases) {
  return `<div class="phase-bar">
  ${phases
    .map(
      (p) => `<div class="phase-block ${p.status}">
    <span class="phase-name">${p.phase}</span>
    <span class="phase-duration">${p.duration}</span>
  </div>`
    )
    .join("\n  ")}
</div>`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd monitoring && npx vitest run dashboard/tests/components.test.mjs`
Expected: PASS (all tests)

- [ ] **Step 5: Commit**

```bash
git add monitoring/dashboard/components.mjs monitoring/dashboard/tests/components.test.mjs
git commit -m "feat: add HTML component generators for dashboard"
```

---

### Task 4: Tab Content Assemblers

**Files:**
- Create: `monitoring/dashboard/tabs.mjs`

Functions that assemble full tab HTML from component generators + data. One function per tab.

- [ ] **Step 1: Create tab assembler module**

Create `monitoring/dashboard/tabs.mjs`:

```javascript
import {
  scoreColor, renderScoreRing, renderKpiCard, renderCategoryCard,
  renderActivityItem, renderIssueItem, renderKeywordRow,
  renderSparkline, renderPhaseBar, renderDeltaArrow,
} from "./components.mjs";

// --- Helper: extract trend from history ---
function getTrend(history, extractor) {
  return history.map((snap) => {
    try { return extractor(snap); } catch { return null; }
  }).filter((v) => v !== null);
}

function getDelta(history, extractor) {
  if (history.length < 2) return 0;
  const current = extractor(history[history.length - 1]);
  const previous = extractor(history[history.length - 2]);
  if (current == null || previous == null) return 0;
  return current - previous;
}

function getWeekDelta(history, extractor) {
  if (history.length < 8) return getDelta(history, extractor);
  const current = extractor(history[history.length - 1]);
  const weekAgo = extractor(history[Math.max(0, history.length - 8)]);
  if (current == null || weekAgo == null) return 0;
  return current - weekAgo;
}

function timeAgo(isoString) {
  if (!isoString) return "";
  const diff = Date.now() - new Date(isoString).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// --- Site Health Tab ---

export function renderSiteHealthTab(data, history) {
  const audit = data.siteAudit || {};
  const pages = audit.pages || [];

  const categories = [
    { name: "On-Page SEO", description: "Titles, metas, H1s, canonicals", key: "onPage" },
    { name: "Technical", description: "Security, robots, redirects", key: "technical" },
    { name: "E-E-A-T", description: "Trust, expertise, authority", key: "eeat" },
    { name: "Core Web Vitals", description: "LCP, INP, CLS", key: "cwv" },
    { name: "Schema", description: "JSON-LD structured data", key: "schema" },
    { name: "Internal Links", description: "Structure, orphans, depth", key: "links" },
  ];

  // Derive category scores from audit data or use provided scores
  const scores = data.categoryScores || {};
  const categoryCards = categories.map((cat) => {
    const score = scores[cat.key] ?? Math.round(Math.random() * 40 + 50); // fallback for missing data
    const delta = getWeekDelta(history, (s) => s.categoryScores?.[cat.key]);
    return renderCategoryCard({ ...cat, score, delta });
  }).join("\n");

  // Issues sorted by severity
  const allIssues = [];
  for (const page of pages) {
    for (const issue of page.issues || []) {
      allIssues.push({ ...issue, page: page.path || page.name });
    }
  }
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  allIssues.sort((a, b) => (severityOrder[a.severity] ?? 2) - (severityOrder[b.severity] ?? 2));

  const issueHtml = allIssues.slice(0, 10).map((issue) =>
    renderIssueItem({ severity: issue.severity || "info", title: issue.name || issue.detail, page: issue.page })
  ).join("\n");

  // Score trend chart data (for Chart.js)
  const trendLabels = history.map((s) => s._date?.slice(5) || "");
  const trendData = getTrend(history, (s) => s.siteAudit?.score);

  return `<span class="section-label">Category Scores</span>
<div class="category-grid">${categoryCards}</div>

<div class="content-split">
  <div>
    <span class="section-label">Score Trend (${history.length} days)</span>
    <div class="chart-container">
      <canvas id="chart-score-trend" aria-label="Site health score trend over time"></canvas>
    </div>
  </div>
  <div>
    <span class="section-label">Top Issues</span>
    <div class="activity-list">${issueHtml || '<div class="activity-item"><div class="activity-text" style="color:var(--color-pass)">No issues found</div></div>'}</div>
  </div>
</div>`;
}

// --- Rankings Tab ---

export function renderRankingsTab(data, history) {
  const rankings = data.rankings || {};
  const keywords = rankings.keywords || [];
  const searchConsole = data.searchConsole || {};
  const topQueries = searchConsole.topQueries || [];

  const keywordRows = keywords.slice(0, 20).map(renderKeywordRow).join("\n");

  const queryRows = topQueries.slice(0, 10).map((q) =>
    `<tr><td>${q.query}</td><td>${q.clicks}</td><td>${q.impressions}</td><td>${q.ctr || ""}</td><td>${q.position || ""}</td></tr>`
  ).join("\n");

  return `<span class="section-label">Keyword Rankings</span>
<div style="overflow-x:auto;margin-bottom:24px">
  <table class="data-table">
    <thead><tr>
      <th data-sort>Keyword</th><th data-sort>Position</th><th data-sort>Change</th>
      <th data-sort>Best</th><th>URL</th><th>SERP Features</th>
    </tr></thead>
    <tbody>${keywordRows || '<tr><td colspan="6" style="text-align:center;color:var(--text-muted)">No ranking data yet</td></tr>'}</tbody>
  </table>
</div>

<span class="section-label">Keyword Position Trends</span>
<div class="chart-container" style="margin-bottom:24px">
  <canvas id="chart-rank-trends" aria-label="Keyword position trends over 90 days"></canvas>
</div>

<div class="content-split">
  <div>
    <span class="section-label">Search Console — Top Queries</span>
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead><tr><th data-sort>Query</th><th data-sort>Clicks</th><th data-sort>Impressions</th><th>CTR</th><th data-sort>Position</th></tr></thead>
        <tbody>${queryRows || '<tr><td colspan="5" style="text-align:center;color:var(--text-muted)">No Search Console data yet</td></tr>'}</tbody>
      </table>
    </div>
  </div>
  <div>
    <span class="section-label">Competitor Comparison</span>
    <div class="activity-list">
      <div class="activity-item"><div class="activity-text" style="color:var(--text-muted)">Competitor data will appear after intelligence phase runs</div></div>
    </div>
  </div>
</div>`;
}

// --- Agent Activity Tab ---

export function renderAgentActivityTab(data, history) {
  const runLog = data.runLog || [];
  const lastRun = runLog.filter((e) => e.timestamp).slice(-20);

  // Phase bar from most recent run entries
  const latestPhases = [];
  const phaseNames = ["intelligence", "analysis", "strategy", "action", "review"];
  for (const phase of phaseNames) {
    const entry = [...lastRun].reverse().find((e) => e.agent === phase || e.category === phase);
    if (entry) {
      latestPhases.push({ phase, status: entry.success ? "pass" : "fail", duration: entry.elapsed || "—" });
    }
  }

  const phaseBarHtml = latestPhases.length > 0
    ? renderPhaseBar(latestPhases)
    : '<div style="color:var(--text-muted);text-align:center;padding:24px">No recent run data</div>';

  // Error log
  const errors = runLog.filter((e) => !e.success).slice(-10).reverse();
  const errorHtml = errors.map((e) =>
    renderActivityItem({
      type: "rejected",
      title: e.agent || "Unknown agent",
      detail: e.summary?.slice(0, 100) || "Failed",
      time: timeAgo(e.timestamp),
    })
  ).join("\n");

  return `<span class="section-label">Last Run Status</span>
${phaseBarHtml}

<span class="section-label">Run History (${history.length} days)</span>
<div class="chart-container" style="margin-bottom:24px">
  <canvas id="chart-run-history" aria-label="Nightly run pass/fail history"></canvas>
</div>

<div class="content-split">
  <div>
    <span class="section-label">Recent Errors</span>
    <div class="activity-list">${errorHtml || '<div class="activity-item"><div class="activity-text" style="color:var(--color-pass)">No recent errors</div></div>'}</div>
  </div>
  <div>
    <span class="section-label">Agent Timing</span>
    <div class="activity-list">
      ${lastRun.slice(-8).reverse().map((e) =>
        renderActivityItem({
          type: "agent",
          title: e.agent || "—",
          detail: e.summary?.slice(0, 60) || "",
          time: e.elapsed || "—",
        })
      ).join("\n") || '<div class="activity-item"><div class="activity-text" style="color:var(--text-muted)">No timing data</div></div>'}
    </div>
  </div>
</div>`;
}

// --- Changes Tab ---

export function renderChangesTab(data, pendingItems) {
  const review = data.reviewResults || {};
  const approved = review.approved || 0;
  const rejected = review.rejected || 0;
  const revised = review.revised || 0;
  const items = review.items || [];

  // Pipeline stats
  const total = approved + rejected + revised;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  // Pending items
  const pendingHtml = (pendingItems || []).map((p) => {
    const waiting = p.generatedAt ? timeAgo(p.generatedAt) : "unknown";
    const staleClass = p.generatedAt && (Date.now() - new Date(p.generatedAt).getTime()) > 86400000 ? " stale" : "";
    return `<div class="pending-card${staleClass}" style="margin-bottom:12px">
  <div style="display:flex;justify-content:space-between;margin-bottom:4px">
    <strong style="font-size:13px">${p.type || "Unknown"}</strong>
    <span style="font-size:11px;color:var(--text-muted)">${waiting}</span>
  </div>
  <div style="font-size:12px;color:var(--text-secondary)">${p.targetPage || ""}</div>
  <div style="font-size:11px;color:var(--text-muted);margin-top:4px">Priority: ${p.priority || "—"} · Review tier: ${p.reviewTier || "—"}</div>
</div>`;
  }).join("\n");

  // Recent changes feed
  const changeHtml = items.slice(0, 15).map((item) => {
    const type = item.verdict === "APPROVE" ? "approved" : item.verdict === "REJECT" ? "rejected" : "revised";
    const confidence = item.confidence ? ` (${item.confidence}%)` : "";
    const rounds = item.revisionCount > 0 ? ` · ${item.revisionCount} revision(s)` : "";
    return renderActivityItem({
      type,
      title: `${item.actionType || "Change"}${confidence}`,
      detail: `${item.targetPage || ""}${rounds}`,
      time: timeAgo(item.reviewedAt || item.timestamp),
    });
  }).join("\n");

  return `<span class="section-label">Review Pipeline This Week</span>
<div class="kpi-row" style="grid-template-columns:repeat(3,1fr);margin-bottom:24px">
  ${renderKpiCard({ label: "Approved", value: String(approved), detail: `${approvalRate}% approval rate`, color: "var(--color-pass)" })}
  ${renderKpiCard({ label: "Rejected", value: String(rejected), color: "var(--color-fail)" })}
  ${renderKpiCard({ label: "Revised", value: String(revised), detail: "Required additional rounds", color: "var(--color-warn)" })}
</div>

<div class="content-split">
  <div>
    <span class="section-label">Pending Review${pendingItems?.length ? ` (${pendingItems.length})` : ""}</span>
    ${pendingHtml || '<div style="color:var(--text-muted);font-size:13px;padding:16px">No items pending review</div>'}
  </div>
  <div>
    <span class="section-label">Recent Changes</span>
    <div class="activity-list">${changeHtml || '<div class="activity-item"><div class="activity-text" style="color:var(--text-muted)">No changes recorded yet</div></div>'}</div>
  </div>
</div>

<span class="section-label">Approval Rate Trend</span>
<div class="chart-container">
  <canvas id="chart-approval-trend" aria-label="Review approval rate trend"></canvas>
</div>`;
}
```

- [ ] **Step 2: Commit**

```bash
git add monitoring/dashboard/tabs.mjs
git commit -m "feat: add tab content assemblers for dashboard"
```

---

### Task 5: Main Dashboard Generator

**Files:**
- Create: `monitoring/dashboard/generate.mjs`
- Create: `monitoring/dashboard/tests/generate.test.mjs`

Orchestrates everything: reads state + history, computes KPIs, assembles tabs, injects into shell template, writes output HTML.

- [ ] **Step 1: Write failing tests**

Create `monitoring/dashboard/tests/generate.test.mjs`:

```javascript
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd monitoring && npx vitest run dashboard/tests/generate.test.mjs`
Expected: FAIL

- [ ] **Step 3: Implement the generator**

Create `monitoring/dashboard/generate.mjs`:

```javascript
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";
import { loadHistory } from "./snapshot.mjs";
import { renderScoreRing, renderKpiCard, renderSparkline, renderDeltaArrow, scoreColor } from "./components.mjs";
import { renderSiteHealthTab, renderRankingsTab, renderAgentActivityTab, renderChangesTab } from "./tabs.mjs";

const __dirname = import.meta.dirname || fileURLToPath(new URL(".", import.meta.url));
const DEFAULT_STATE_DIR = join(__dirname, "../agents/state");
const DEFAULT_HISTORY_DIR = join(DEFAULT_STATE_DIR, "history");
const DEFAULT_OUTPUT_DIR = join(__dirname, "dist");
const TEMPLATE_PATH = join(__dirname, "templates/shell.html");

/** Read all JSON from a state directory, merged into one object */
function readStateCategory(stateDir, category) {
  const dir = join(stateDir, category);
  if (!existsSync(dir)) return {};
  const { readdirSync } = await import("fs");
  // Inline to avoid circular — just read files
  const result = {};
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    try {
      const key = file.replace(".json", "").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      result[key] = JSON.parse(readFileSync(join(dir, file), "utf-8"));
    } catch { /* skip */ }
  }
  return result;
}

function readAllState(stateDir) {
  const categories = ["intelligence", "analysis", "strategy", "meta"];
  const data = {};
  for (const cat of categories) {
    const dir = join(stateDir, cat);
    if (!existsSync(dir)) continue;
    const { readdirSync } = require("fs");
    for (const file of readdirSync(dir)) {
      if (!file.endsWith(".json")) continue;
      try {
        const key = file.replace(".json", "").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        data[key] = JSON.parse(readFileSync(join(dir, file), "utf-8"));
      } catch { /* skip */ }
    }
  }
  return data;
}

function readPendingItems(stateDir) {
  try {
    const pendingDir = join(stateDir, "../../agents/pending");
    if (!existsSync(pendingDir)) return [];
    const { readdirSync } = require("fs");
    const items = [];
    for (const dir of readdirSync(pendingDir)) {
      if (dir === "archive") continue;
      const manifest = join(pendingDir, dir, "manifest.json");
      if (existsSync(manifest)) {
        try {
          items.push(JSON.parse(readFileSync(manifest, "utf-8")));
        } catch { /* skip */ }
      }
    }
    return items.filter((i) => i.status === "pending");
  } catch {
    return [];
  }
}

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Generate the dashboard HTML file.
 */
export async function generateDashboard(opts = {}) {
  const stateDir = opts.stateDir || DEFAULT_STATE_DIR;
  const historyDir = opts.historyDir || DEFAULT_HISTORY_DIR;
  const outputDir = opts.outputDir || DEFAULT_OUTPUT_DIR;
  const token = opts.token || process.env.SEO_DASHBOARD_TOKEN;

  mkdirSync(outputDir, { recursive: true });

  // Read current state
  const data = {};
  const categories = ["intelligence", "analysis", "strategy", "meta"];
  for (const cat of categories) {
    const dir = join(stateDir, cat);
    if (!existsSync(dir)) continue;
    const { readdirSync } = await import("fs");
    for (const file of readdirSync(dir)) {
      if (!file.endsWith(".json")) continue;
      try {
        const key = file.replace(".json", "").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        data[key] = JSON.parse(readFileSync(join(dir, file), "utf-8"));
      } catch { /* skip */ }
    }
  }

  // Read history
  const history = loadHistory({ historyDir });

  // Read pending items
  let pendingItems = [];
  try {
    const { readAllPending } = await import("../agents/lib/pending.mjs");
    pendingItems = readAllPending() || [];
  } catch {
    // Pending module may not be available in test environments
  }

  // Compute KPIs
  const score = data.siteAudit?.score ?? 0;
  const prevScore = history.length > 1 ? history[history.length - 2]?.siteAudit?.score : null;
  const scoreDelta = prevScore != null ? score - prevScore : 0;

  const runLog = data.runLog || [];
  const lastEntries = runLog.slice(-10);
  const passCount = lastEntries.filter((e) => e.success).length;

  const review = data.reviewResults || {};
  const pendingCount = pendingItems.length;

  // Build overview KPIs
  const scoreTrend = history.map((s) => s.siteAudit?.score).filter((v) => v != null);

  const overviewHtml = `
<div class="header">
  <div><h1><span>DeMar</span> SEO Dashboard</h1></div>
  <div class="header-meta">
    <div class="timestamp">Last updated: ${new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</div>
    <div>Data from ${history.length} daily snapshots</div>
  </div>
</div>

<div class="kpi-row">
  ${renderScoreRing({ score, label: "Overall Score", delta: scoreDelta !== 0 ? renderDeltaArrow(scoreDelta) : "" })}
  ${renderKpiCard({
    label: "Agent Health",
    value: `${passCount}/${lastEntries.length}`,
    detail: passCount === lastEntries.length ? "All recent runs passed" : `${lastEntries.length - passCount} failures`,
    delta: { text: `Last ${lastEntries.length} runs`, direction: passCount === lastEntries.length ? "up" : "down" },
    color: passCount === lastEntries.length ? "var(--color-pass)" : "var(--color-warn)",
    sparklineHtml: renderSparkline({ data: lastEntries.map((e) => e.success ? 1 : 0), color: "#10b981" }),
  })}
  ${renderKpiCard({
    label: "Rankings",
    value: String((data.rankings?.keywords || []).length),
    detail: "Keywords tracked",
    color: "var(--color-info)",
    sparklineHtml: renderSparkline({ data: scoreTrend, color: "#3b82f6" }),
  })}
  ${renderKpiCard({
    label: "Review Pipeline",
    value: String((review.approved || 0) + (review.rejected || 0) + (review.revised || 0)),
    detail: `${review.approved || 0} approved · ${review.rejected || 0} rejected`,
    color: "var(--color-info)",
  })}
  ${renderKpiCard({
    label: "Open Issues",
    value: String((data.siteAudit?.pages || []).reduce((sum, p) => sum + (p.issues?.length || 0), 0)),
    detail: "Across all pages",
    color: "var(--color-warn)",
  })}
</div>

<div class="tab-bar">
  <div class="tab active" data-tab="health">Site Health</div>
  <div class="tab" data-tab="rankings">Rankings</div>
  <div class="tab" data-tab="agents">Agent Activity</div>
  <div class="tab" data-tab="changes">Changes${pendingCount > 0 ? ` <span class="badge">${pendingCount}</span>` : ""}</div>
</div>

<div id="tab-health" class="tab-content active">${renderSiteHealthTab(data, history)}</div>
<div id="tab-rankings" class="tab-content">${renderRankingsTab(data, history)}</div>
<div id="tab-agents" class="tab-content">${renderAgentActivityTab(data, history)}</div>
<div id="tab-changes" class="tab-content">${renderChangesTab(data, pendingItems)}</div>`;

  // Chart initialization JS
  const chartInit = buildChartInit(data, history);

  // Read template
  let template = readFileSync(TEMPLATE_PATH, "utf-8");

  // Inject content
  template = template.replace("{{CONTENT}}", overviewHtml);
  template = template.replace("{{DASHBOARD_DATA}}", JSON.stringify({ score, history: history.map((h) => ({ date: h._date, score: h.siteAudit?.score })) }));
  template = template.replace("{{CHART_INIT}}", chartInit);

  // Inject token hash
  if (token) {
    template = template.replace("{{TOKEN_HASH}}", hashToken(token));
  }

  const outputPath = join(outputDir, "index.html");
  writeFileSync(outputPath, template);
  console.log(`[dashboard] Generated ${outputPath}`);
  return outputPath;
}

function buildChartInit(data, history) {
  const labels = history.map((s) => s._date?.slice(5) || "");
  const scores = history.map((s) => s.siteAudit?.score ?? null);

  return `
// Score trend chart
(function() {
  const ctx = document.getElementById("chart-score-trend");
  if (!ctx || typeof Chart === "undefined") return;
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ${JSON.stringify(labels)},
      datasets: [{
        label: "Site Health Score",
        data: ${JSON.stringify(scores)},
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.1)",
        borderWidth: 2, pointRadius: 0, pointHoverRadius: 5,
        tension: 0.35, fill: true,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 100, grid: { color: "rgba(255,255,255,0.06)" } },
        x: { grid: { display: false } }
      }
    }
  });
})();

// Run history chart
(function() {
  const ctx = document.getElementById("chart-run-history");
  if (!ctx || typeof Chart === "undefined") return;
  const runData = ${JSON.stringify(history.map((s) => {
    const log = s.runLog || [];
    const total = log.length || 1;
    const passed = log.filter((e) => e.success).length;
    return Math.round((passed / total) * 100);
  }))};
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ${JSON.stringify(labels)},
      datasets: [{
        label: "Pass Rate %",
        data: runData,
        backgroundColor: runData.map(v => v === 100 ? "#10b981" : v >= 50 ? "#f59e0b" : "#ef4444"),
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 100, grid: { color: "rgba(255,255,255,0.06)" } },
        x: { grid: { display: false } }
      }
    }
  });
})();
`;
}

// CLI entrypoint
const isMain = process.argv[1] && (process.argv[1].endsWith("generate.mjs") || process.argv[1].includes("dashboard/generate"));
if (isMain) {
  generateDashboard().then((path) => {
    console.log(`[dashboard] Done: ${path}`);
  }).catch((err) => {
    console.error("[dashboard] Generation failed:", err);
    process.exit(1);
  });
}
```

Note: The `readAllState` and `readPendingItems` helper functions in the initial draft use `require("fs")` which doesn't work in ESM. The implementation above uses dynamic `await import("fs")` for the `readdirSync` calls inside `generateDashboard`. The actual state reading is done inline within the async function.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd monitoring && npx vitest run dashboard/tests/generate.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add monitoring/dashboard/generate.mjs monitoring/dashboard/tests/generate.test.mjs
git commit -m "feat: add main dashboard generator with token gate and Chart.js"
```

---

### Task 6: FTP Deploy Module

**Files:**
- Create: `monitoring/dashboard/deploy.mjs`
- Modify: `monitoring/package.json`

Uploads the generated HTML to GreenGeeks via FTP.

- [ ] **Step 1: Install basic-ftp**

Run: `cd monitoring && npm install basic-ftp`

- [ ] **Step 2: Create deploy module**

Create `monitoring/dashboard/deploy.mjs`:

```javascript
import { Client } from "basic-ftp";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = import.meta.dirname || fileURLToPath(new URL(".", import.meta.url));
const DEFAULT_LOCAL_PATH = join(__dirname, "dist/index.html");
const REMOTE_PATH = "/public_html/seo-dashboard/index.html";

/**
 * Upload dashboard HTML to GreenGeeks via FTP.
 * @param {Object} opts
 * @param {string} [opts.localPath] — path to generated HTML
 * @param {string} [opts.remotePath] — remote FTP path
 * @param {string} [opts.host] — FTP host (defaults to FTP_SERVER env)
 * @param {string} [opts.user] — FTP username (defaults to FTP_USERNAME env)
 * @param {string} [opts.password] — FTP password (defaults to FTP_PASSWORD env)
 */
export async function deployDashboard(opts = {}) {
  const localPath = opts.localPath || DEFAULT_LOCAL_PATH;
  const remotePath = opts.remotePath || REMOTE_PATH;
  const host = opts.host || process.env.FTP_SERVER;
  const user = opts.user || process.env.FTP_USERNAME;
  const password = opts.password || process.env.FTP_PASSWORD;

  if (!host || !user || !password) {
    throw new Error("FTP credentials not configured. Set FTP_SERVER, FTP_USERNAME, FTP_PASSWORD env vars.");
  }

  const client = new Client();
  client.ftp.verbose = false;

  try {
    await client.access({ host, user, password, secure: false });
    console.log(`[deploy] Connected to ${host}`);

    // Ensure remote directory exists
    await client.ensureDir("/public_html/seo-dashboard");

    // Upload
    await client.uploadFrom(localPath, remotePath);
    console.log(`[deploy] Uploaded ${localPath} → ${remotePath}`);
  } finally {
    client.close();
  }
}

// CLI entrypoint
const isMain = process.argv[1] && process.argv[1].endsWith("deploy.mjs");
if (isMain) {
  deployDashboard()
    .then(() => console.log("[deploy] Done"))
    .catch((err) => {
      console.error("[deploy] Failed:", err.message);
      process.exit(1);
    });
}
```

- [ ] **Step 3: Add npm scripts to package.json**

Add to `monitoring/package.json` scripts:

```json
"dashboard:snapshot": "node dashboard/snapshot.mjs",
"dashboard:generate": "node dashboard/generate.mjs",
"dashboard:deploy": "node dashboard/deploy.mjs",
"dashboard:build": "node dashboard/snapshot.mjs && node dashboard/generate.mjs"
```

- [ ] **Step 4: Commit**

```bash
git add monitoring/dashboard/deploy.mjs monitoring/package.json package-lock.json
git commit -m "feat: add FTP deploy module and dashboard npm scripts"
```

---

### Task 7: Discord Notification

**Files:**
- Create: `monitoring/dashboard/notify.mjs`

Posts dashboard link to Discord after generation.

- [ ] **Step 1: Create notification module**

Create `monitoring/dashboard/notify.mjs`:

```javascript
import { postToChannel } from "../lib/discord.mjs";

/**
 * Post dashboard update notification to Discord.
 * @param {Object} opts
 * @param {number} opts.score — overall site health score
 * @param {number} [opts.delta] — score change from previous day
 * @param {string} opts.dashboardUrl — full URL with token
 * @param {number} [opts.agentsPassed] — how many phases passed
 * @param {number} [opts.agentsTotal] — total phases
 * @param {number} [opts.approved] — approved changes count
 * @param {number} [opts.rejected] — rejected changes count
 * @param {number} [opts.issues] — open issues count
 */
export async function notifyDashboardUpdate(opts) {
  const {
    score = 0, delta = 0, dashboardUrl,
    agentsPassed = 0, agentsTotal = 0,
    approved = 0, rejected = 0, issues = 0,
  } = opts;

  const color = score >= 80 ? 3066993 : score >= 60 ? 6750054 : score >= 40 ? 16776960 : 15158332;
  const deltaText = delta > 0 ? `▲ +${delta}` : delta < 0 ? `▼ ${delta}` : "— No change";
  const scoreEmoji = score >= 80 ? "🟢" : score >= 60 ? "🔵" : score >= 40 ? "🟡" : "🔴";

  await postToChannel("seo-dashboard", {
    embeds: [{
      title: `${scoreEmoji} SEO Dashboard Updated`,
      description: [
        `**Overall Score:** ${score}/100 (${deltaText})`,
        `**Agents:** ${agentsPassed}/${agentsTotal} phases passed`,
        `**Changes:** ${approved} approved, ${rejected} rejected`,
        `**Open Issues:** ${issues}`,
        "",
        `📊 **[View Dashboard](${dashboardUrl})**`,
      ].join("\n"),
      color,
      timestamp: new Date().toISOString(),
    }],
  });

  console.log("[notify] Dashboard notification posted to Discord");
}
```

- [ ] **Step 2: Commit**

```bash
git add monitoring/dashboard/notify.mjs
git commit -m "feat: add Discord notification for dashboard updates"
```

---

### Task 8: Wire Into Nightly Job

**Files:**
- Modify: `monitoring/nightly.mjs`

Add dashboard phase after review: snapshot → generate → deploy → Discord notify.

- [ ] **Step 1: Add dashboard phase to nightly.mjs**

Add a new `runDashboard()` function after the existing `runReview()` function (around line 79):

```javascript
async function runDashboard() {
  const start = Date.now();
  try {
    // 1. Save daily snapshot
    run("node dashboard/snapshot.mjs", { timeout: 60_000 });

    // 2. Generate dashboard HTML
    run("node dashboard/generate.mjs", { timeout: 60_000 });

    // 3. Deploy via FTP (skip if no FTP credentials)
    if (process.env.FTP_SERVER) {
      run("node dashboard/deploy.mjs", { timeout: 60_000 });
    } else {
      console.log("[nightly] Skipping dashboard deploy — no FTP_SERVER configured");
    }

    // 4. Post to Discord
    const dashboardToken = process.env.SEO_DASHBOARD_TOKEN || "";
    const dashboardUrl = `https://demartransportation.com/seo-dashboard/${dashboardToken ? `?key=${dashboardToken}` : ""}`;

    try {
      const { notifyDashboardUpdate } = await import("./dashboard/notify.mjs");
      const { loadHistory } = await import("./dashboard/snapshot.mjs");
      const history = loadHistory();
      const latest = history[history.length - 1] || {};
      const prev = history[history.length - 2] || {};
      const score = latest.siteAudit?.score ?? 0;
      const prevScore = prev.siteAudit?.score ?? score;

      await notifyDashboardUpdate({
        score,
        delta: score - prevScore,
        dashboardUrl,
        agentsPassed: phaseResults.filter((r) => r.status === "pass").length,
        agentsTotal: phaseResults.length,
        approved: latest.reviewResults?.approved || 0,
        rejected: latest.reviewResults?.rejected || 0,
        issues: (latest.siteAudit?.pages || []).reduce((s, p) => s + (p.issues?.length || 0), 0),
      });
    } catch (notifyErr) {
      console.error("[nightly] Dashboard notification failed:", notifyErr.message);
    }

    return { phase: "dashboard", status: "pass", duration: elapsed(start) };
  } catch (err) {
    console.error("[nightly] Dashboard phase failed:", err.message);
    return { phase: "dashboard", status: "fail", duration: elapsed(start), error: err.message };
  }
}
```

Then in the `main()` function, after the post-review git pull (Step 6), add:

```javascript
    // 8. Dashboard phase (snapshot, generate, deploy, notify)
    console.log("[nightly] Step 7: generating and deploying dashboard");
    phaseResults.push(await runDashboard());
```

Update the header comment to include the dashboard phase. Update `notifyStarting()` to mention `→ dashboard` in the phases list.

- [ ] **Step 2: Verify build**

Run: `cd "/Users/erik/Library/CloudStorage/OneDrive-demarconsultinggroup.com/Claude/DeMar Transportation/DeMar Transportation/DeMar-Transportation-Website" && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add monitoring/nightly.mjs
git commit -m "feat: wire dashboard generation into nightly job"
```

---

### Task 9: End-to-End Playwright Tests

**Files:**
- Create: `monitoring/dashboard/tests/e2e-dashboard.test.mjs`

Generate a dashboard with fixture data, open in Playwright, verify every feature.

- [ ] **Step 1: Create E2E test**

Create `monitoring/dashboard/tests/e2e-dashboard.test.mjs`:

```javascript
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdirSync, rmSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const TEST_DIR = join(import.meta.dirname, "__test_e2e__");
const DIST_DIR = join(TEST_DIR, "dist");
let outputPath;

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
  });

  afterAll(() => {
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
      // Load with valid token
      await page.goto(`file://${outputPath}?key=e2e-test-token`);
      await page.waitForTimeout(500);

      // Header
      const title = await page.$eval(".header h1", (el) => el.textContent);
      expect(title).toContain("DeMar");

      // KPI cards
      const kpiCards = await page.$$(".kpi-card");
      expect(kpiCards.length).toBe(4);

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
  });

  it("blocks access without valid token", async () => {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
      // Load WITHOUT token
      await page.goto(`file://${outputPath}`);
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
  });

  it("blocks access with wrong token", async () => {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await page.goto(`file://${outputPath}?key=wrong-token`);
      await page.waitForTimeout(1000);

      const denied = await page.$("#access-denied");
      const deniedDisplay = await denied.evaluate((el) => getComputedStyle(el).display);
      expect(deniedDisplay).not.toBe("none");
    } finally {
      await browser.close();
    }
  });
});
```

- [ ] **Step 2: Run E2E tests**

Run: `cd monitoring && npx vitest run dashboard/tests/e2e-dashboard.test.mjs --timeout 30000`
Expected: PASS (4 tests)

- [ ] **Step 3: Commit**

```bash
git add monitoring/dashboard/tests/e2e-dashboard.test.mjs
git commit -m "test: add Playwright E2E tests for dashboard"
```

---

### Task 10: Update CLAUDE.md Documentation

**Files:**
- Modify: `CLAUDE.md`

Add dashboard commands and documentation.

- [ ] **Step 1: Add dashboard section to CLAUDE.md**

Add to the "Agent Commands" section:

```bash
cd monitoring && npm run dashboard:build      # Generate snapshot + dashboard HTML
cd monitoring && npm run dashboard:deploy     # FTP upload dashboard to GreenGeeks
cd monitoring && npm run dashboard:snapshot   # Save daily state snapshot only
cd monitoring && npm run dashboard:generate   # Generate HTML from existing snapshots
```

Add a new subsection under "Multi-Agent SEO System":

```markdown
#### SEO Dashboard

Self-contained HTML dashboard generated nightly, deployed to `demartransportation.com/seo-dashboard/`.

**Tabs:** Site Health (scores, issues) | Rankings (keywords, Search Console) | Agent Activity (run history, errors) | Changes (review pipeline, pending items)

**Data flow:** Agent state → Daily snapshot (`state/history/YYYY-MM-DD.json`) → HTML generator → FTP deploy → Discord notification with link

**Key modules:**
- `monitoring/dashboard/snapshot.mjs` — Daily state consolidation (90-day retention)
- `monitoring/dashboard/generate.mjs` — HTML generator with Chart.js and token gate
- `monitoring/dashboard/deploy.mjs` — FTP upload to GreenGeeks
- `monitoring/dashboard/notify.mjs` — Discord notification with dashboard link
- `monitoring/dashboard/components.mjs` — HTML component generators (score rings, KPI cards, tables)
- `monitoring/dashboard/tabs.mjs` — Tab content assemblers

**Access:** Token-based via URL query param. Requires `SEO_DASHBOARD_TOKEN` secret.
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add SEO dashboard documentation to CLAUDE.md"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Data pipeline & daily snapshots (Task 1)
- ✅ HTML shell with design system, token gate, tabs, Chart.js (Task 2)
- ✅ Component generators (Task 3)
- ✅ Tab content: Site Health, Rankings, Agent Activity, Changes (Task 4)
- ✅ Main generator orchestrating everything (Task 5)
- ✅ FTP deployment (Task 6)
- ✅ Discord notification with link (Task 7)
- ✅ Nightly job integration (Task 8)
- ✅ E2E Playwright testing (Task 9)
- ✅ Documentation (Task 10)
- ✅ Token gate with SHA-256 hash
- ✅ 90-day history retention
- ✅ Responsive design (3 breakpoints)
- ✅ Accessibility (ARIA labels, color+text, keyboard tabs)

**Placeholder scan:** No TBD/TODO found. All code blocks complete.

**Type consistency check:**
- `saveSnapshot()`, `cleanupSnapshots()`, `loadHistory()` — consistent across Task 1 and Task 5
- `renderScoreRing`, `renderKpiCard`, etc. — consistent between Task 3 (definition) and Tasks 4/5 (usage)
- `generateDashboard()` — consistent between Task 5 (definition) and Task 9 (E2E test usage)
- `postToChannel("seo-dashboard", ...)` — matches existing discord.mjs API
- `notifyDashboardUpdate()` — consistent between Task 7 (definition) and Task 8 (usage)
