#!/usr/bin/env node
/**
 * nightly.mjs — Nightly master job for DeMar Transportation SEO agents
 *
 * Sequence:
 *   1. Discord "starting" notification
 *   2. git pull --rebase origin main (with abort+reset recovery on failure)
 *   3. npm install --production in monitoring/
 *   4. Run agent phases: intelligence → analysis → strategy → action --limit 5
 *   5. git pull again (action agents may have pushed commits)
 *   6. Discord "complete" summary with per-phase status + duration
 *   7. On crash → Discord error notification
 */

import "dotenv/config";
import { execSync } from "child_process";
import { join } from "path";
import { fileURLToPath } from "url";
import { postToChannel } from "./lib/discord.mjs";

const __dirname = import.meta.dirname || fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const MONITORING_DIR = __dirname;

// ─── Helpers ───────────────────────────────────────────────────────────────

function now() {
  return new Date().toISOString();
}

function elapsed(startMs) {
  const ms = Date.now() - startMs;
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  return `${Math.floor(ms / 60_000)}m ${Math.round((ms % 60_000) / 1000)}s`;
}

function run(cmd, opts = {}) {
  console.log(`[nightly] $ ${cmd}`);
  execSync(cmd, {
    stdio: "inherit",
    timeout: opts.timeout ?? 120_000,
    cwd: opts.cwd ?? MONITORING_DIR,
    ...opts,
  });
}

// ─── Git helpers ───────────────────────────────────────────────────────────

function gitPull() {
  try {
    run("git pull --rebase origin main", { cwd: REPO_ROOT, timeout: 60_000 });
    console.log("[nightly] git pull succeeded");
  } catch (err) {
    console.error("[nightly] git pull --rebase failed, aborting rebase and resetting...", err.message);
    try {
      execSync("git rebase --abort", { cwd: REPO_ROOT, stdio: "inherit" });
    } catch (_) {
      // rebase may not be in progress — ignore
    }
    execSync("git reset --hard origin/main", { cwd: REPO_ROOT, stdio: "inherit" });
    console.log("[nightly] reset --hard to origin/main completed");
  }
}

// ─── Phase runner ──────────────────────────────────────────────────────────

async function runPhase(phase, extraArgs = "") {
  const start = Date.now();
  const cmd = `node agents/orchestrator.mjs --phase ${phase}${extraArgs ? " " + extraArgs : ""}`;
  try {
    run(cmd, { timeout: 10 * 60_000 }); // 10-minute timeout
    return { phase, status: "pass", duration: elapsed(start) };
  } catch (err) {
    console.error(`[nightly] Phase "${phase}" failed:`, err.message);
    return { phase, status: "fail", duration: elapsed(start), error: err.message };
  }
}

// ─── Discord notifications ─────────────────────────────────────────────────

async function notifyStarting() {
  try {
    await postToChannel("health", {
      embeds: [{
        title: "🌙 Nightly Agent Run — Starting",
        description: `**DeMar Transportation** nightly SEO cycle is starting.\n\nPhases: intelligence → analysis → strategy → action\nStarted at: ${now()}`,
        color: 3447003, // blue
        timestamp: new Date().toISOString(),
      }],
    });
  } catch (err) {
    console.error("[nightly] Failed to send starting notification:", err.message);
  }
}

async function notifyComplete(phaseResults, totalDuration) {
  const lines = phaseResults.map(r => {
    const icon = r.status === "pass" ? "✅" : "❌";
    return `${icon} **${r.phase}** — ${r.duration}${r.status === "fail" ? `\n> ${r.error?.slice(0, 120)}` : ""}`;
  });

  const passCount = phaseResults.filter(r => r.status === "pass").length;
  const failCount = phaseResults.filter(r => r.status === "fail").length;
  const overallStatus = failCount === 0 ? "pass" : passCount > 0 ? "warn" : "fail";
  const colors = { pass: 3066993, warn: 16776960, fail: 15158332 };
  const icons = { pass: "✅", warn: "⚠️", fail: "❌" };

  try {
    await postToChannel("health", {
      embeds: [{
        title: `${icons[overallStatus]} Nightly Agent Run — Complete`,
        description: `**Total duration:** ${totalDuration}\n**Result:** ${passCount}/${phaseResults.length} phases passed\n\n${lines.join("\n\n")}`,
        color: colors[overallStatus],
        timestamp: new Date().toISOString(),
      }],
    });
  } catch (err) {
    console.error("[nightly] Failed to send complete notification:", err.message);
  }
}

async function notifyError(err, totalDuration) {
  try {
    await postToChannel("health", {
      embeds: [{
        title: "❌ Nightly Agent Run — Crashed",
        description: `**Error:** ${err.message?.slice(0, 500) ?? "Unknown error"}\n\n**Duration before crash:** ${totalDuration}\n\nCheck cron logs for full stack trace.`,
        color: 15158332, // red
        timestamp: new Date().toISOString(),
      }],
    });
  } catch (notifyErr) {
    console.error("[nightly] Failed to send error notification:", notifyErr.message);
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const globalStart = Date.now();
  console.log(`[nightly] === Nightly run starting at ${now()} ===`);

  // 1. Starting notification
  await notifyStarting();

  const phaseResults = [];

  try {
    // 2. git pull before run
    console.log("[nightly] Step 1: git pull");
    gitPull();

    // 3. npm install --production
    console.log("[nightly] Step 2: npm install --production");
    run("npm install --production", { timeout: 120_000 });

    // 4. Run phases sequentially
    console.log("[nightly] Step 3: running agent phases");

    phaseResults.push(await runPhase("intelligence"));
    phaseResults.push(await runPhase("analysis"));
    phaseResults.push(await runPhase("strategy"));
    phaseResults.push(await runPhase("action", "--limit 5"));

    // 5. git pull after action (action agents may push commits)
    console.log("[nightly] Step 4: git pull post-action");
    gitPull();

    // 6. Complete notification
    const totalDuration = elapsed(globalStart);
    console.log(`[nightly] === Nightly run complete in ${totalDuration} ===`);
    await notifyComplete(phaseResults, totalDuration);

  } catch (err) {
    console.error("[nightly] Unhandled crash:", err);
    await notifyError(err, elapsed(globalStart));
    process.exit(1);
  }
}

main();
