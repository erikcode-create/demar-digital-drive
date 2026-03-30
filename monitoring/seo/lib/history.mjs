import "dotenv/config";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, "..", "data");

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function dateNDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function filePath(category, date) {
  return join(DATA_DIR, category, `${date}.json`);
}

/**
 * Save daily data to data/{category}/YYYY-MM-DD.json
 * Creates directories as needed.
 */
export function saveDaily(category, data) {
  const date = todayString();
  const fp = filePath(category, date);
  mkdirSync(dirname(fp), { recursive: true });
  writeFileSync(fp, JSON.stringify(data, null, 2));
  return fp;
}

/**
 * Load data for a specific date. Defaults to today.
 * Returns null if file not found.
 */
export function loadDaily(category, date) {
  const d = date || todayString();
  const fp = filePath(category, d);
  if (!existsSync(fp)) return null;
  try {
    return JSON.parse(readFileSync(fp, "utf-8"));
  } catch {
    return null;
  }
}

/**
 * Load yesterday's data. Returns null if not found.
 */
export function loadPrevious(category) {
  return loadDaily(category, yesterdayString());
}

/**
 * Load the last N days of data as an array of { date, data }.
 * Skips days with no data file.
 */
export function loadRange(category, days) {
  const results = [];
  for (let i = 0; i < days; i++) {
    const date = dateNDaysAgo(i);
    const data = loadDaily(category, date);
    if (data !== null) {
      results.push({ date, data });
    }
  }
  return results;
}

/**
 * Returns a direction arrow based on numeric comparison.
 * "↑" if current > previous, "↓" if current < previous, "→" if equal or missing.
 */
export function getDelta(current, previous) {
  if (current == null || previous == null) return "→";
  if (current > previous) return "↑";
  if (current < previous) return "↓";
  return "→";
}

/**
 * Returns a formatted delta string like "+5 ↑", "-3 ↓", or "0 →".
 */
export function formatDelta(current, previous) {
  if (current == null || previous == null) return "N/A";
  const diff = current - previous;
  const arrow = getDelta(current, previous);
  const sign = diff > 0 ? "+" : "";
  return `${sign}${diff} ${arrow}`;
}
