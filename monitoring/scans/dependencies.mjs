import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { computeStatus, computeScore } from "../lib/scanner.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../../");

export async function run() {
  const checks = [];

  // npm audit
  try {
    const auditOutput = execSync("npm audit --json 2>/dev/null", {
      cwd: PROJECT_ROOT,
      encoding: "utf-8",
      timeout: 30000,
    });
    const audit = JSON.parse(auditOutput);
    const vulns = audit.metadata?.vulnerabilities || {};
    const critical = vulns.critical || 0;
    const high = vulns.high || 0;
    const moderate = vulns.moderate || 0;
    const low = vulns.low || 0;
    const total = critical + high + moderate + low;

    if (critical > 0 || high > 0) {
      checks.push({
        name: "npm audit",
        status: "fail",
        detail: `${total} vulnerabilities: ${critical} critical, ${high} high, ${moderate} moderate, ${low} low`,
        confidence: "VERIFIED",
        reason: null,
      });
    } else if (moderate > 0) {
      checks.push({
        name: "npm audit",
        status: "warn",
        detail: `${total} vulnerabilities: ${moderate} moderate, ${low} low`,
        confidence: "VERIFIED",
        reason: null,
      });
    } else if (low > 0) {
      checks.push({
        name: "npm audit",
        status: "warn",
        detail: `${low} low-severity vulnerabilities`,
        confidence: "VERIFIED",
        reason: null,
      });
    } else {
      checks.push({
        name: "npm audit",
        status: "pass",
        detail: "No known vulnerabilities",
        confidence: "VERIFIED",
        reason: null,
      });
    }
  } catch (err) {
    try {
      const audit = JSON.parse(err.stdout || "{}");
      const vulns = audit.metadata?.vulnerabilities || {};
      const critical = vulns.critical || 0;
      const high = vulns.high || 0;
      const moderate = vulns.moderate || 0;
      const low = vulns.low || 0;
      const total = critical + high + moderate + low;

      if (total > 0) {
        checks.push({
          name: "npm audit",
          status: critical > 0 || high > 0 ? "fail" : "warn",
          detail: `${total} vulnerabilities: ${critical} critical, ${high} high, ${moderate} moderate, ${low} low`,
          confidence: "VERIFIED",
          reason: null,
        });
      } else {
        checks.push({ name: "npm audit", status: "pass", detail: "No known vulnerabilities", confidence: "VERIFIED", reason: null });
      }
    } catch {
      checks.push({ name: "npm audit", status: "warn", detail: "Could not parse npm audit output", confidence: "VERIFIED", reason: null });
    }
  }

  // Outdated packages
  try {
    const outdatedOutput = execSync("npm outdated --json 2>/dev/null", {
      cwd: PROJECT_ROOT,
      encoding: "utf-8",
      timeout: 30000,
    });
    const outdated = JSON.parse(outdatedOutput || "{}");
    const outdatedCount = Object.keys(outdated).length;

    if (outdatedCount === 0) {
      checks.push({ name: "Outdated Packages", status: "pass", detail: "All packages up to date" });
    } else {
      const majorUpdates = Object.entries(outdated).filter(
        ([, info]) => info.current?.split(".")[0] !== info.latest?.split(".")[0]
      );
      if (majorUpdates.length > 0) {
        const names = majorUpdates.slice(0, 5).map(([n]) => n).join(", ");
        checks.push({
          name: "Outdated Packages",
          status: "warn",
          detail: `${outdatedCount} outdated (${majorUpdates.length} major): ${names}${majorUpdates.length > 5 ? "..." : ""}`,
        });
      } else {
        checks.push({
          name: "Outdated Packages",
          status: "pass",
          detail: `${outdatedCount} minor/patch updates available`,
        });
      }
    }
  } catch (err) {
    try {
      const outdated = JSON.parse(err.stdout || "{}");
      const outdatedCount = Object.keys(outdated).length;
      if (outdatedCount > 0) {
        const majorUpdates = Object.entries(outdated).filter(
          ([, info]) => info.current?.split(".")[0] !== info.latest?.split(".")[0]
        );
        const names = Object.keys(outdated).slice(0, 5).join(", ");
        checks.push({
          name: "Outdated Packages",
          status: majorUpdates.length > 0 ? "warn" : "pass",
          detail: `${outdatedCount} outdated packages: ${names}${outdatedCount > 5 ? "..." : ""}`,
        });
      } else {
        checks.push({ name: "Outdated Packages", status: "pass", detail: "All packages up to date" });
      }
    } catch {
      checks.push({ name: "Outdated Packages", status: "warn", detail: "Could not check outdated packages" });
    }
  }

  return {
    category: "Dependencies",
    status: computeStatus(checks),
    score: computeScore(checks),
    checks,
  };
}
