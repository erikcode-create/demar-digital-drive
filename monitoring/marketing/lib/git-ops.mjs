import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");

function exec(cmd) {
  try {
    return execSync(cmd, { cwd: REPO_ROOT, encoding: "utf-8", timeout: 120000 });
  } catch (err) {
    return err.stdout || err.message;
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

export function commitAndPush(message) {
  exec("git add -A");
  exec(`git commit -m "${message}"`);
  exec("git push");
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
