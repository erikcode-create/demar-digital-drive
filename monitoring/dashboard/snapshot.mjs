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
