import { mkdirSync, writeFileSync, readFileSync, existsSync, renameSync, readdirSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_DIR = join(__dirname, "..", "state");

function ensureDir(fp) {
  mkdirSync(dirname(fp), { recursive: true });
}

function filePath(category, key) {
  return join(STATE_DIR, category, `${key}.json`);
}

/**
 * Read a JSON state file. Returns null if not found.
 */
export function read(category, key) {
  const fp = filePath(category, key);
  if (!existsSync(fp)) return null;
  try {
    return JSON.parse(readFileSync(fp, "utf-8"));
  } catch {
    return null;
  }
}

/**
 * Write a JSON state file atomically (write to .tmp then rename).
 * Automatically adds _updatedAt timestamp.
 */
export function write(category, key, data) {
  const fp = filePath(category, key);
  ensureDir(fp);

  const payload = {
    _updatedAt: new Date().toISOString(),
    ...data,
  };

  const tmp = fp + ".tmp";
  writeFileSync(tmp, JSON.stringify(payload, null, 2));
  renameSync(tmp, fp);
  return fp;
}

/**
 * Read all JSON files in a category directory.
 * Returns an object keyed by filename (without .json).
 */
export function readAll(category) {
  const dir = join(STATE_DIR, category);
  if (!existsSync(dir)) return {};

  const result = {};
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const key = file.replace(".json", "");
    try {
      result[key] = JSON.parse(readFileSync(join(dir, file), "utf-8"));
    } catch {
      // skip corrupt files
    }
  }
  return result;
}

/**
 * Append an entry to the run log.
 */
export function appendLog(entry) {
  const fp = filePath("meta", "run-log");
  ensureDir(fp);

  let log = [];
  if (existsSync(fp)) {
    try {
      log = JSON.parse(readFileSync(fp, "utf-8"));
    } catch {
      log = [];
    }
  }

  log.push({
    timestamp: new Date().toISOString(),
    ...entry,
  });

  // Keep last 500 entries
  if (log.length > 500) log = log.slice(-500);

  writeFileSync(fp, JSON.stringify(log, null, 2));
}

/**
 * Get the last run timestamp for a named agent. Returns null if never run.
 */
export function getLastRun(agentName) {
  const data = read("meta", "last-run");
  if (!data) return null;
  return data[agentName] || null;
}

/**
 * Record that an agent just ran.
 */
export function markRun(agentName) {
  const data = read("meta", "last-run") || {};
  data[agentName] = new Date().toISOString();
  write("meta", "last-run", data);
}

/**
 * Acquire orchestrator lock. Returns true if acquired, false if already locked.
 */
export function acquireLock() {
  const fp = filePath("meta", "orchestrator.lock");
  ensureDir(fp);

  if (existsSync(fp)) {
    try {
      const lock = JSON.parse(readFileSync(fp, "utf-8"));
      const age = Date.now() - new Date(lock.acquiredAt).getTime();
      // Stale lock if older than 30 minutes
      if (age < 30 * 60 * 1000) return false;
    } catch {
      // corrupt lock, take it
    }
  }

  writeFileSync(fp, JSON.stringify({
    acquiredAt: new Date().toISOString(),
    pid: process.pid,
  }));
  return true;
}

/**
 * Release orchestrator lock.
 */
export function releaseLock() {
  const fp = filePath("meta", "orchestrator.lock");
  if (existsSync(fp)) unlinkSync(fp);
}

/**
 * Compute delta arrow for rank comparisons (lower is better for ranks).
 */
export function getDelta(current, previous) {
  if (current == null || previous == null) return "→";
  if (current > previous) return "↑";
  if (current < previous) return "↓";
  return "→";
}

/**
 * Format delta as "+5 ↑" style string.
 */
export function formatDelta(current, previous) {
  if (current == null || previous == null) return "N/A";
  const diff = current - previous;
  const arrow = getDelta(current, previous);
  const sign = diff > 0 ? "+" : "";
  return `${sign}${diff} ${arrow}`;
}
