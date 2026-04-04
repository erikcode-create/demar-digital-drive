/**
 * pending.mjs — CRUD operations for the pending/ staging directory.
 *
 * Action agents write candidate code changes here instead of committing
 * directly to git. A review orchestrator reads from pending/, reviews each
 * change, and commits approved ones.
 *
 * Directory layout:
 *   monitoring/agents/pending/{actionId}/
 *     manifest.json       — metadata + review status
 *     original.tsx        — original source code (may be empty for new files)
 *     modified.tsx        — AI-generated candidate code
 *     research.json       — research context used to generate the change
 *     aux-{sanitized}.{ext} — auxiliary files (e.g. aux-src-App.tsx)
 *
 *   monitoring/agents/pending/archive/{YYYY-MM-DD}/{actionId}/
 *     — archived entries (approved, rejected, or expired)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Root pending directory — one level above lib/ */
export const PENDING_DIR = path.resolve(__dirname, "../pending");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function actionDir(actionId) {
  return path.join(PENDING_DIR, actionId);
}

function archiveBaseDir() {
  return path.join(PENDING_DIR, "archive");
}

/**
 * Convert an original file path (e.g. "src/App.tsx") into a safe filename
 * stored in the action directory (e.g. "aux-src-App.tsx").
 */
function sanitizeAuxName(originalPath) {
  // Replace path separators and other risky chars with hyphens
  const base = originalPath.replace(/[/\\:*?"<>|]/g, "-");
  return `aux-${base}`;
}

// ---------------------------------------------------------------------------
// writePending
// ---------------------------------------------------------------------------

/**
 * Stage a candidate code change for review.
 *
 * @param {object} opts
 * @param {string}  opts.actionId          — unique action identifier (e.g. "act-001")
 * @param {string}  opts.type              — action type (e.g. "write-content")
 * @param {number}  opts.priority          — lower = higher priority (1 is highest)
 * @param {string}  [opts.targetPage]      — page route this change affects
 * @param {string}  [opts.targetKeyword]   — SEO keyword context
 * @param {string}  [opts.targetFile]      — relative path of the primary file being changed
 * @param {string}  [opts.reason]          — human-readable justification
 * @param {string}  [opts.agentModel]      — model that generated the change
 * @param {string}  [opts.reviewTier]      — review model to use ("opus"|"sonnet"|"haiku")
 * @param {string}  [opts.originalCode]    — original source code (empty string for new files)
 * @param {string}  [opts.modifiedCode]    — AI-generated candidate code
 * @param {object}  [opts.researchContext] — structured research data used to generate the change
 * @param {object}  [opts.auxiliaryFiles]  — map of originalPath → code for extra files to stage
 * @returns {string} — path to the action directory
 */
export function writePending({
  actionId,
  type,
  priority,
  targetPage = null,
  targetKeyword = null,
  targetFile = null,
  reason = "",
  agentModel = "unknown",
  reviewTier = "sonnet",
  originalCode = "",
  modifiedCode = "",
  researchContext = {},
  auxiliaryFiles = {},
}) {
  const dir = actionDir(actionId);
  fs.mkdirSync(dir, { recursive: true });

  // Build auxiliary file map: originalPath -> sanitized filename
  const auxMap = {};
  for (const [origPath, code] of Object.entries(auxiliaryFiles)) {
    const safeName = sanitizeAuxName(origPath);
    auxMap[origPath] = safeName;
    fs.writeFileSync(path.join(dir, safeName), code, "utf-8");
  }

  // manifest.json
  const manifest = {
    actionId,
    type,
    priority,
    targetPage,
    targetKeyword,
    targetFile,
    reason,
    agentModel,
    generatedAt: new Date().toISOString(),
    buildPassed: false,
    structuralValidation: { passed: false, errors: [] },
    reviewTier,
    status: "pending",
    revisionCount: 0,
    reviewHistory: [],
    auxiliaryFiles: auxMap,
  };
  fs.writeFileSync(
    path.join(dir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf-8"
  );

  // original.tsx
  fs.writeFileSync(path.join(dir, "original.tsx"), originalCode, "utf-8");

  // modified.tsx
  fs.writeFileSync(path.join(dir, "modified.tsx"), modifiedCode, "utf-8");

  // research.json
  fs.writeFileSync(
    path.join(dir, "research.json"),
    JSON.stringify(researchContext, null, 2),
    "utf-8"
  );

  return dir;
}

// ---------------------------------------------------------------------------
// readPending
// ---------------------------------------------------------------------------

/**
 * Read all files for a single pending action.
 *
 * @param {string} actionId
 * @returns {{ manifest: object, originalCode: string, modifiedCode: string, researchContext: object } | null}
 */
export function readPending(actionId) {
  const dir = actionDir(actionId);
  if (!fs.existsSync(dir)) return null;

  const manifestPath = path.join(dir, "manifest.json");
  if (!fs.existsSync(manifestPath)) return null;

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const originalCode = fs.existsSync(path.join(dir, "original.tsx"))
      ? fs.readFileSync(path.join(dir, "original.tsx"), "utf-8")
      : "";
    const modifiedCode = fs.existsSync(path.join(dir, "modified.tsx"))
      ? fs.readFileSync(path.join(dir, "modified.tsx"), "utf-8")
      : "";
    const researchContext = fs.existsSync(path.join(dir, "research.json"))
      ? JSON.parse(fs.readFileSync(path.join(dir, "research.json"), "utf-8"))
      : {};

    return { manifest, originalCode, modifiedCode, researchContext };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// readAllPending
// ---------------------------------------------------------------------------

/**
 * Return manifests for all pending actions, sorted ascending by priority.
 * Skips the archive subdirectory and any entries not in "pending" status.
 *
 * @returns {object[]} — array of manifest objects
 */
export function readAllPending() {
  if (!fs.existsSync(PENDING_DIR)) return [];

  const manifests = [];
  for (const entry of fs.readdirSync(PENDING_DIR)) {
    if (entry === "archive") continue; // skip archive

    const dir = path.join(PENDING_DIR, entry);
    if (!fs.statSync(dir).isDirectory()) continue;

    const manifestPath = path.join(dir, "manifest.json");
    if (!fs.existsSync(manifestPath)) continue;

    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      if (manifest.status === "pending") {
        manifests.push(manifest);
      }
    } catch {
      // skip corrupt manifests
    }
  }

  return manifests.sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
}

// ---------------------------------------------------------------------------
// updateManifest
// ---------------------------------------------------------------------------

/**
 * Merge updates into an existing manifest.json and return the updated manifest.
 *
 * @param {string} actionId
 * @param {object} updates — partial manifest fields to merge
 * @returns {object | null} — updated manifest, or null if action not found
 */
export function updateManifest(actionId, updates) {
  const dir = actionDir(actionId);
  const manifestPath = path.join(dir, "manifest.json");
  if (!fs.existsSync(manifestPath)) return null;

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  } catch {
    return null;
  }

  const updated = { ...manifest, ...updates };
  fs.writeFileSync(manifestPath, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}

// ---------------------------------------------------------------------------
// updateModifiedCode
// ---------------------------------------------------------------------------

/**
 * Overwrite modified.tsx with new code (e.g. after a review revision).
 *
 * @param {string} actionId
 * @param {string} newCode
 * @returns {boolean} — true if successful, false if action not found
 */
export function updateModifiedCode(actionId, newCode) {
  const dir = actionDir(actionId);
  const modifiedPath = path.join(dir, "modified.tsx");
  if (!fs.existsSync(dir)) return false;

  fs.writeFileSync(modifiedPath, newCode, "utf-8");
  return true;
}

// ---------------------------------------------------------------------------
// readAuxiliaryFile
// ---------------------------------------------------------------------------

/**
 * Read an auxiliary file by its original path.
 *
 * @param {string} actionId
 * @param {string} originalPath — the key used in auxiliaryFiles when staging
 * @returns {string | null} — file contents, or null if not found
 */
export function readAuxiliaryFile(actionId, originalPath) {
  const result = readPending(actionId);
  if (!result) return null;

  const { manifest } = result;
  const safeName = manifest.auxiliaryFiles?.[originalPath];
  if (!safeName) return null;

  const filePath = path.join(actionDir(actionId), safeName);
  if (!fs.existsSync(filePath)) return null;

  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// archivePending
// ---------------------------------------------------------------------------

/**
 * Move a pending action to the archive directory.
 * Archive path: pending/archive/{YYYY-MM-DD}/{actionId}/
 *
 * @param {string} actionId
 * @returns {string | null} — archive path, or null if action not found
 */
export function archivePending(actionId) {
  const srcDir = actionDir(actionId);
  if (!fs.existsSync(srcDir)) return null;

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const destDir = path.join(archiveBaseDir(), today, actionId);
  fs.mkdirSync(path.dirname(destDir), { recursive: true });

  fs.renameSync(srcDir, destDir);
  return destDir;
}

// ---------------------------------------------------------------------------
// cleanupArchive
// ---------------------------------------------------------------------------

/**
 * Delete archive date-directories older than maxDays.
 *
 * @param {number} maxDays — archive entries older than this many days are deleted
 * @returns {string[]} — list of removed date directories
 */
export function cleanupArchive(maxDays = 30) {
  const archiveDir = archiveBaseDir();
  if (!fs.existsSync(archiveDir)) return [];

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - maxDays);

  const removed = [];
  for (const entry of fs.readdirSync(archiveDir)) {
    // Expect YYYY-MM-DD format; skip anything that doesn't parse
    const date = new Date(entry);
    if (isNaN(date.getTime())) continue;

    if (date < cutoff) {
      const dirPath = path.join(archiveDir, entry);
      fs.rmSync(dirPath, { recursive: true, force: true });
      removed.push(dirPath);
    }
  }

  return removed;
}
