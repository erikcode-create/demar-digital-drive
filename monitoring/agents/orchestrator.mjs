#!/usr/bin/env node
import "dotenv/config";
import { join } from "path";
import { fileURLToPath } from "url";
import * as state from "./lib/state.mjs";
import * as sourceReader from "./lib/source-reader.mjs";
import { postToChannel } from "../lib/discord.mjs";

const __dirname = import.meta.dirname || new URL(".", import.meta.url).pathname;

// ─── Agent Registry ────────────────────────────────────────────────
// Each entry: [name, category, module path]
const AGENTS = {
  // Intelligence (Phase 1)
  "rank-tracker":        { category: "intelligence", path: "./intelligence/rank-tracker.mjs" },
  "search-console":      { category: "intelligence", path: "./intelligence/search-console.mjs" },
  "competitor-tracker":   { category: "intelligence", path: "./intelligence/competitor-tracker.mjs" },
  "backlink-monitor":    { category: "intelligence", path: "./intelligence/backlink-monitor.mjs" },
  "cwv-monitor":         { category: "intelligence", path: "./intelligence/cwv-monitor.mjs" },

  // Analysis (Phase 2)
  "site-auditor":        { category: "analysis", path: "./analysis/site-auditor.mjs" },
  "eeat-scorer":         { category: "analysis", path: "./analysis/eeat-scorer.mjs" },
  "page-scorer":         { category: "analysis", path: "./analysis/page-scorer.mjs" },
  "content-gap-analyzer": { category: "analysis", path: "./analysis/content-gap-analyzer.mjs" },

  // Strategy (Phase 3)
  "strategy":            { category: "strategy", path: "./strategy/strategy-agent.mjs" },

  // Action (Phase 4)
  "content-writer":      { category: "action", path: "./action/content-writer.mjs" },
  "meta-tag-optimizer":  { category: "action", path: "./action/meta-tag-optimizer.mjs" },
  "internal-link-optimizer": { category: "action", path: "./action/internal-link-optimizer.mjs" },
  "technical-fixer":     { category: "action", path: "./action/technical-fixer.mjs" },
  "schema-generator":    { category: "action", path: "./action/schema-generator.mjs" },
  "homepage-optimizer":  { category: "action", path: "./action/homepage-optimizer.mjs" },
};

// Phase execution order
const PHASES = {
  intelligence: ["rank-tracker", "search-console", "backlink-monitor", "cwv-monitor"],
  "intelligence-serial": ["competitor-tracker"], // needs rank data first
  analysis: ["site-auditor", "eeat-scorer", "page-scorer", "content-gap-analyzer"],
  strategy: ["strategy"],
  action: ["content-writer", "meta-tag-optimizer", "internal-link-optimizer", "technical-fixer"],
};

// Closed-loop definitions
const LOOPS = {
  "rank-recovery": {
    description: "Detect rank drops, analyze, fix, monitor recovery",
    phases: [
      { agents: ["rank-tracker"], parallel: true },
      { agents: ["strategy"], parallel: false, filter: "rank-drops" },
      { agents: ["content-writer", "meta-tag-optimizer"], parallel: false },
    ],
  },
  "content-gaps": {
    description: "Find competitor gaps, plan content, write it",
    phases: [
      { agents: ["rank-tracker", "competitor-tracker"], parallel: false }, // serial: competitor needs ranks
      { agents: ["content-gap-analyzer"], parallel: false },
      { agents: ["strategy"], parallel: false, filter: "content-gaps" },
      { agents: ["content-writer"], parallel: false },
    ],
  },
  "eeat-improvement": {
    description: "Score E-E-A-T, identify weak pages, improve them",
    phases: [
      { agents: ["eeat-scorer"], parallel: true },
      { agents: ["strategy"], parallel: false, filter: "eeat-weak" },
      { agents: ["meta-tag-optimizer", "internal-link-optimizer"], parallel: false },
    ],
  },
};

// ─── Context Builder ───────────────────────────────────────────────

function buildContext(config = {}) {
  return {
    state: {
      read: state.read,
      write: state.write,
      readAll: state.readAll,
      getLastRun: state.getLastRun,
      markRun: state.markRun,
      appendLog: state.appendLog,
      getDelta: state.getDelta,
      formatDelta: state.formatDelta,
    },
    discord: {
      post: postToChannel,
    },
    source: {
      readPage: sourceReader.readPage,
      readAllPages: sourceReader.readAllPages,
      readPagesByType: sourceReader.readPagesByType,
    },
    config: {
      dryRun: config.dryRun || false,
      verbose: config.verbose || false,
      limit: config.limit || null,
      filter: config.filter || null,
    },
  };
}

// ─── Agent Runner ──────────────────────────────────────────────────

async function runAgent(name, context) {
  const agentDef = AGENTS[name];
  if (!agentDef) {
    console.error(`Unknown agent: ${name}`);
    return { success: false, summary: `Unknown agent: ${name}` };
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(`Running: ${name} (${agentDef.category})`);
  console.log(`${"─".repeat(60)}`);

  const startTime = Date.now();

  try {
    const mod = await import(agentDef.path);
    const result = await mod.run(context);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    context.state.markRun(name);
    context.state.appendLog({
      agent: name,
      category: agentDef.category,
      success: result.success,
      summary: result.summary,
      elapsed: `${elapsed}s`,
    });

    console.log(`\n${result.success ? "✓" : "✗"} ${name}: ${result.summary} (${elapsed}s)`);
    return result;
  } catch (err) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const summary = `Error: ${err.message}`;

    context.state.appendLog({
      agent: name,
      category: agentDef.category,
      success: false,
      summary,
      elapsed: `${elapsed}s`,
    });

    console.error(`\n✗ ${name}: ${summary} (${elapsed}s)`);
    if (context.config.verbose) console.error(err.stack);
    return { success: false, summary, data: null };
  }
}

async function runAgentsParallel(names, context) {
  const results = {};
  const promises = names.map(async (name) => {
    results[name] = await runAgent(name, context);
  });
  await Promise.all(promises);
  return results;
}

async function runAgentsSerial(names, context) {
  const results = {};
  for (const name of names) {
    results[name] = await runAgent(name, context);
  }
  return results;
}

// ─── Phase Runners ─────────────────────────────────────────────────

async function runPhase(phaseName, context) {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`Phase: ${phaseName.toUpperCase()}`);
  console.log(`${"═".repeat(60)}`);

  if (phaseName === "intelligence") {
    // Run parallel agents first, then serial ones
    const parallelResults = await runAgentsParallel(PHASES.intelligence, context);
    const serialResults = await runAgentsSerial(PHASES["intelligence-serial"], context);
    return { ...parallelResults, ...serialResults };
  }

  if (phaseName === "action") {
    // Check for smoke test failure flag
    const smokeFailure = context.state.read("meta", "smoke-failure");
    if (smokeFailure) {
      console.log("⚠️  Smoke test failure flag is set — skipping action phase");
      context.discord.post("health", {
        embeds: [{
          title: "⚠️ Agent Actions Blocked",
          description: `Post-deploy smoke tests failed at ${smokeFailure.timestamp}. Actions are blocked until the flag is cleared.\n\nTo clear: \`rm monitoring/agents/state/meta/smoke-failure.json\``,
          color: 16776960,
        }],
      });
      return;
    }

    // Action agents run sequentially (each may modify code + build)
    const actionQueue = context.state.read("strategy", "action-queue");
    if (!actionQueue || !actionQueue.actions || actionQueue.actions.length === 0) {
      console.log("No actions in queue. Skipping action phase.");
      return {};
    }

    const limit = context.config.limit || actionQueue.actions.length;
    const pending = actionQueue.actions.filter(a => a.status === "pending").slice(0, limit);
    console.log(`Processing ${pending.length} action(s) from queue...`);

    const results = {};
    for (const action of pending) {
      // Route to the right action agent based on action type
      const agentName = routeAction(action.type);
      if (agentName) {
        const actionContext = { ...context, config: { ...context.config, currentAction: action } };
        results[`${agentName}:${action.id}`] = await runAgent(agentName, actionContext);
      }
    }
    return results;
  }

  // Default: run all agents in the phase in parallel
  const agents = PHASES[phaseName];
  if (!agents) {
    console.error(`Unknown phase: ${phaseName}`);
    return {};
  }
  return await runAgentsParallel(agents, context);
}

function routeAction(actionType) {
  const routes = {
    "write-content": "content-writer",
    "update-content": "content-writer",
    "fix-meta": "meta-tag-optimizer",
    "fix-links": "internal-link-optimizer",
    "fix-technical": "technical-fixer",
    "fix-schema": "schema-generator",
    "fix-homepage": "homepage-optimizer",
  };
  return routes[actionType] || null;
}

// ─── Loop Runner ───────────────────────────────────────────────────

async function runLoop(loopName, context) {
  const loop = LOOPS[loopName];
  if (!loop) {
    console.error(`Unknown loop: ${loopName}`);
    return;
  }

  console.log(`\n${"═".repeat(60)}`);
  console.log(`Loop: ${loopName} -- ${loop.description}`);
  console.log(`${"═".repeat(60)}`);

  for (const phase of loop.phases) {
    const loopContext = phase.filter
      ? { ...context, config: { ...context.config, filter: phase.filter } }
      : context;

    if (phase.parallel) {
      await runAgentsParallel(phase.agents, loopContext);
    } else {
      await runAgentsSerial(phase.agents, loopContext);
    }
  }
}

// ─── Full Cycle ────────────────────────────────────────────────────

async function runFullCycle(context) {
  console.log(`\n${"═".repeat(60)}`);
  console.log("FULL CYCLE");
  console.log(`${"═".repeat(60)}`);

  const startTime = Date.now();

  await runPhase("intelligence", context);
  await runPhase("analysis", context);
  await runPhase("strategy", context);

  if (!context.config.dryRun) {
    await runPhase("action", context);
  } else {
    console.log("\n[DRY RUN] Skipping action phase. Review action-queue.json for recommendations.");
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nFull cycle complete in ${elapsed}s`);

  // Post summary to Discord
  try {
    const actionQueue = context.state.read("strategy", "action-queue");
    const actionCount = actionQueue?.actions?.length || 0;
    const ranks = context.state.read("intelligence", "ranks");
    const avgRank = ranks?.summary?.averageRank || "N/A";

    await context.discord.post("seo-dashboard", {
      embeds: [{
        title: "🔄 Multi-Agent SEO Cycle Complete",
        description: [
          `**Duration:** ${elapsed}s`,
          `**Mode:** ${context.config.dryRun ? "Dry Run" : "Full Execution"}`,
          `**Avg Rank:** ${avgRank}`,
          `**Actions Queued:** ${actionCount}`,
        ].join("\n"),
        color: 3066993,
        timestamp: new Date().toISOString(),
      }],
    });
  } catch (err) {
    console.error("Failed to post cycle summary to Discord:", err.message);
  }
}

// ─── CLI Argument Parsing ──────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    mode: null,       // "full-cycle" | "phase" | "agent" | "loop"
    target: null,     // phase name, agent name, or loop name
    dryRun: false,
    verbose: false,
    limit: null,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--full-cycle":
        parsed.mode = "full-cycle";
        break;
      case "--phase":
        parsed.mode = "phase";
        parsed.target = args[++i];
        break;
      case "--agent":
        parsed.mode = "agent";
        parsed.target = args[++i];
        break;
      case "--loop":
        parsed.mode = "loop";
        parsed.target = args[++i];
        break;
      case "--dry-run":
        parsed.dryRun = true;
        break;
      case "--verbose":
        parsed.verbose = true;
        break;
      case "--limit":
        parsed.limit = parseInt(args[++i], 10);
        break;
      default:
        console.error(`Unknown argument: ${args[i]}`);
        printUsage();
        process.exit(1);
    }
  }

  if (!parsed.mode) {
    printUsage();
    process.exit(1);
  }

  return parsed;
}

function printUsage() {
  console.log(`
Multi-Agent SEO Orchestrator

Usage:
  node orchestrator.mjs --full-cycle              Run all phases (intelligence → analysis → strategy → action)
  node orchestrator.mjs --phase <name>            Run a single phase (intelligence, analysis, strategy, action)
  node orchestrator.mjs --agent <name>            Run a single agent
  node orchestrator.mjs --loop <name>             Run a closed loop (rank-recovery, content-gaps, eeat-improvement)

Options:
  --dry-run       Run intelligence/analysis/strategy but skip action phase
  --verbose       Show detailed error traces
  --limit <n>     Limit action phase to N items from the queue

Available agents:
  ${Object.keys(AGENTS).join(", ")}

Available loops:
  ${Object.keys(LOOPS).join(", ")}
`);
}

// ─── Main ──────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();

  // Acquire lock (except for single agent runs)
  if (args.mode !== "agent") {
    if (!state.acquireLock()) {
      console.error("Another orchestrator is already running. Exiting.");
      process.exit(1);
    }
  }

  const context = buildContext({
    dryRun: args.dryRun,
    verbose: args.verbose,
    limit: args.limit,
  });

  try {
    switch (args.mode) {
      case "full-cycle":
        await runFullCycle(context);
        break;
      case "phase":
        await runPhase(args.target, context);
        break;
      case "agent":
        await runAgent(args.target, context);
        break;
      case "loop":
        await runLoop(args.target, context);
        break;
    }
  } finally {
    if (args.mode !== "agent") {
      state.releaseLock();
    }
  }
}

main().catch((err) => {
  console.error("Orchestrator failed:", err);
  state.releaseLock();
  process.exit(1);
});
