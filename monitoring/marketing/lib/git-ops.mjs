import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");

function exec(cmd, { ignoreError = false } = {}) {
  try {
    return execSync(cmd, { cwd: REPO_ROOT, encoding: "utf-8", timeout: 120000 });
  } catch (err) {
    if (ignoreError) {
      console.warn(`[git-ops] Command failed (ignored): ${cmd}\n  ${err.message}`);
      return err.stdout || err.message;
    }
    throw new Error(`[git-ops] Command failed: ${cmd}\n  ${err.stderr || err.message}`);
  }
}

export function hasChanges() {
  return exec("git status --porcelain").trim().length > 0;
}

export function buildSucceeds() {
  try {
    execSync("npm run build", { cwd: REPO_ROOT, encoding: "utf-8", timeout: 120000 });
    return true;
  } catch {
    return false;
  }
}

export function commitAndPush(message, files = []) {
  // Verify we're on main
  const branch = exec("git rev-parse --abbrev-ref HEAD").trim();
  if (branch !== "main") {
    throw new Error(`[git-ops] Expected to be on main, but on ${branch}`);
  }

  // Stage only the specific files that were changed
  // (never use git add -A — it picks up unrelated untracked files)
  if (files.length > 0) {
    for (const file of files) {
      exec(`git add "${file}"`);
    }
  } else {
    // Fallback: stage only tracked files that have been modified
    exec("git add -u");
  }

  // Check if there's anything to commit
  const status = exec("git status --porcelain").trim();
  if (!status) {
    throw new Error("[git-ops] No changes to commit after applying change");
  }

  // Escape double quotes in commit message
  const safeMsg = message.replace(/"/g, '\\"');
  exec(`git commit -m "${safeMsg}"`);
  exec("git push origin main");
}

export function writeStagingManifest(agentName, changes) {
  const manifest = {
    agent: agentName,
    timestamp: new Date().toISOString(),
    changes: changes, // [{file, url, type}]
  };
  const manifestPath = path.join(REPO_ROOT, "staging-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

export function createPRBranch(branchName) {
  exec(`git checkout -b ${branchName}`);
}

export function createPR(title, body, branchName) {
  exec(`git add -A`);
  exec(`git commit -m "${title}"`);
  exec(`git push -u origin ${branchName}`);
  try {
    const safeBody = body.replace(/"/g, '\\"');
    exec(`gh pr create --title "${title}" --body "${safeBody}" --base main`);
    console.log(`PR created on branch ${branchName}`);
  } catch (err) {
    console.error(`PR creation failed: ${err}`);
  }
  exec("git checkout main");
}

export function cleanupBranch(branchName) {
  exec("git checkout .");
  exec("git checkout main");
  exec(`git branch -D ${branchName}`);
}
