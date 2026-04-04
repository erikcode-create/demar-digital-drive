/**
 * review-orchestrator.mjs — Entry point for the review phase.
 *
 * Reads all pending candidate changes, runs the review pipeline for each
 * (fetching live page + competitor context), handles APPROVE/REVISE/REJECT
 * verdicts, commits approved changes to staging, archives processed items,
 * and posts Discord notifications.
 *
 * CLI flags:
 *   --limit N          review at most N pending items
 *   --dry-run          run reviews but don't commit
 *   --action-id <id>   review a single specific action
 *   --skip-competitors skip competitor page fetching
 */

import { execSync } from "node:child_process";
import { writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  readAllPending,
  readPending,
  updateManifest,
  archivePending,
  cleanupArchive,
} from "./lib/pending.mjs";
import {
  commitAndPush,
  buildSucceeds,
  writeStagingManifest,
} from "../marketing/lib/git-ops.mjs";
import { reviewChange } from "./review/reviewer-agent.mjs";
import { runRevisionLoop } from "./review/revision-loop.mjs";
import { fetchLivePage, fetchCompetitorPages } from "./review/competitor-fetcher.mjs";
import { formatResearchContext } from "./research/research-agent.mjs";
import { postToChannel } from "../lib/discord.mjs";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");

// ---------------------------------------------------------------------------
// CLI Parsing
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    limit: Infinity,
    dryRun: false,
    actionId: null,
    skipCompetitors: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--dry-run") {
      opts.dryRun = true;
    } else if (arg === "--skip-competitors") {
      opts.skipCompetitors = true;
    } else if (arg === "--limit" && args[i + 1]) {
      opts.limit = parseInt(args[++i], 10) || Infinity;
    } else if (arg === "--action-id" && args[i + 1]) {
      opts.actionId = args[++i];
    }
  }

  return opts;
}

// ---------------------------------------------------------------------------
// Agent type mapping for revision loop validator routing
// ---------------------------------------------------------------------------

const ACTION_TYPE_TO_AGENT = {
  "write-content": "content-writer",
  "update-content": "content-writer",
  "fix-meta": "meta-tag-optimizer",
  "fix-schema": "schema-generator",
  "fix-technical": "technical-fixer",
  "fix-links": "internal-link-optimizer",
  "fix-homepage": "homepage-optimizer",
};

function getAgentType(actionType) {
  return ACTION_TYPE_TO_AGENT[actionType] ?? "content-writer";
}

// ---------------------------------------------------------------------------
// applyChange — write files to repo, verify build
// ---------------------------------------------------------------------------

/**
 * Applies a pending change to the repo filesystem.
 * Returns true if successful (and build passes), false otherwise.
 *
 * @param {string} actionId
 * @returns {boolean}
 */
function applyChange(actionId) {
  const pending = readPending(actionId);
  if (!pending) {
    console.error(`[review-orchestrator] Cannot apply: action not found: ${actionId}`);
    return false;
  }

  const { manifest, modifiedCode } = pending;

  if (!manifest.targetFile) {
    console.error(`[review-orchestrator] No targetFile in manifest for ${actionId}`);
    return false;
  }

  // Write main file
  const mainFilePath = path.join(REPO_ROOT, manifest.targetFile);
  try {
    writeFileSync(mainFilePath, modifiedCode, "utf-8");
    console.log(`[review-orchestrator] Wrote ${manifest.targetFile}`);
  } catch (err) {
    console.error(`[review-orchestrator] Failed to write ${manifest.targetFile}: ${err.message}`);
    return false;
  }

  // Write auxiliary files
  if (manifest.auxiliaryFiles && Object.keys(manifest.auxiliaryFiles).length > 0) {
    const actionDir = path.resolve(__dirname, "pending", actionId);
    for (const [filePath, safeName] of Object.entries(manifest.auxiliaryFiles)) {
      try {
        const auxContent = readFileSync(path.join(actionDir, safeName), "utf-8");
        const destPath = path.join(REPO_ROOT, filePath);
        writeFileSync(destPath, auxContent, "utf-8");
        console.log(`[review-orchestrator] Wrote auxiliary file: ${filePath}`);
      } catch (err) {
        console.error(`[review-orchestrator] Failed to write auxiliary ${filePath}: ${err.message}`);
        // Non-fatal — continue
      }
    }
  }

  // Build check
  if (!buildSucceeds()) {
    console.error(`[review-orchestrator] Build failed after applying ${actionId} — reverting`);
    try {
      execSync("git checkout -- .", { cwd: REPO_ROOT });
    } catch (revertErr) {
      console.error(`[review-orchestrator] Revert also failed: ${revertErr.message}`);
    }
    return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// Discord helpers
// ---------------------------------------------------------------------------

/**
 * Post per-action result to the "seo" channel.
 */
async function postActionResult(actionId, verdict, rounds, summary) {
  try {
    const isApproved = verdict === "APPROVE";
    const wasRevised = isApproved && rounds > 1;
    const emoji = isApproved ? (wasRevised ? "⚠️" : "✅") : "❌";
    const status = isApproved
      ? wasRevised
        ? `APPROVED after ${rounds} rounds`
        : "APPROVED"
      : "REJECTED";

    await postToChannel("seo", {
      embeds: [
        {
          title: `${emoji} ${status}: ${actionId}`,
          description: (summary ?? "").substring(0, 4000),
          color: isApproved ? 3066993 : 15158332,
          timestamp: new Date().toISOString(),
        },
      ],
    });
  } catch (err) {
    console.warn(`[review-orchestrator] Discord per-action post failed: ${err.message}`);
  }
}

/**
 * Post nightly summary to the "seo-dashboard" channel.
 */
async function postNightlySummary({ total, approved, firstAttempt, afterRevision, rejected }) {
  try {
    let color;
    if (approved === total && total > 0) {
      color = 3066993; // green
    } else if (rejected === total && total > 0) {
      color = 15158332; // red
    } else {
      color = 16776960; // yellow — mixed
    }

    await postToChannel("seo-dashboard", {
      embeds: [
        {
          title: "🌙 Nightly Review Summary",
          description:
            `**Actions reviewed:** ${total}\n` +
            `  ✅ Approved: ${approved} (${firstAttempt} first-attempt, ${afterRevision} after revision)\n` +
            `  ❌ Rejected: ${rejected}\n\n` +
            `**Committed to staging:** ${approved} changes\n` +
            `→ staging CI will validate and auto-merge to main`,
          color,
          timestamp: new Date().toISOString(),
        },
      ],
    });
  } catch (err) {
    console.warn(`[review-orchestrator] Discord nightly summary post failed: ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const opts = parseArgs();
  console.log(
    `[review-orchestrator] Starting review phase` +
      (opts.dryRun ? " (DRY RUN)" : "") +
      (opts.actionId ? ` — single action: ${opts.actionId}` : "")
  );

  // 1. Cleanup old archives (7 days)
  const removed = cleanupArchive(7);
  if (removed.length > 0) {
    console.log(`[review-orchestrator] Cleaned up ${removed.length} old archive directories`);
  }

  // 2. Read pending items
  let manifests;
  if (opts.actionId) {
    const pending = readPending(opts.actionId);
    if (!pending) {
      console.error(`[review-orchestrator] Action not found: ${opts.actionId}`);
      process.exit(1);
    }
    manifests = [pending.manifest];
  } else {
    manifests = readAllPending();
  }

  // Apply --limit
  if (isFinite(opts.limit)) {
    manifests = manifests.slice(0, opts.limit);
  }

  if (manifests.length === 0) {
    console.log("[review-orchestrator] No pending items to review.");
    await postNightlySummary({ total: 0, approved: 0, firstAttempt: 0, afterRevision: 0, rejected: 0 });
    return;
  }

  console.log(`[review-orchestrator] Reviewing ${manifests.length} pending item(s)`);

  // Accumulators for summary
  let totalApproved = 0;
  let totalFirstAttempt = 0;
  let totalAfterRevision = 0;
  let totalRejected = 0;
  const stagingChanges = [];

  // 3. Process each pending item sequentially
  for (const manifest of manifests) {
    const actionId = manifest.actionId;
    console.log(`\n[review-orchestrator] Processing: ${actionId} (${manifest.type})`);

    // a. Update status to "under-review"
    updateManifest(actionId, { status: "under-review" });

    // b/c. Fetch live page + competitor pages (unless --skip-competitors)
    let livePage = null;
    let competitors = [];

    if (!opts.skipCompetitors) {
      if (manifest.targetPage) {
        console.log(`[review-orchestrator] Fetching live page: ${manifest.targetPage}`);
        livePage = await fetchLivePage(manifest.targetPage);
      }

      if (manifest.targetKeyword) {
        console.log(`[review-orchestrator] Fetching competitor pages for: ${manifest.targetKeyword}`);
        competitors = await fetchCompetitorPages(manifest.targetKeyword, 3);
      }
    }

    // d. Format research context
    const pending = readPending(actionId);
    let formattedResearch = null;
    if (pending?.researchContext && Object.keys(pending.researchContext).length > 0) {
      try {
        formattedResearch = formatResearchContext(pending.researchContext);
      } catch {
        formattedResearch = JSON.stringify(pending.researchContext, null, 2);
      }
    }

    // Common review params
    const reviewParams = {
      actionType: manifest.type,
      reason: manifest.reason ?? "",
      targetKeyword: manifest.targetKeyword ?? null,
      originalCode: pending?.originalCode ?? "",
      modifiedCode: pending?.modifiedCode ?? "",
      researchContext: formattedResearch ?? pending?.researchContext ?? {},
      livePage,
      competitors,
    };

    // e. Initial review
    console.log(`[review-orchestrator] Sending to reviewer (tier: ${manifest.reviewTier ?? "sonnet"})`);
    let verdict;
    let rounds = 1;
    let approved = false;

    try {
      verdict = await reviewChange({
        ...reviewParams,
        modelOverride: manifest.reviewTier ?? undefined,
      });
    } catch (err) {
      console.error(`[review-orchestrator] Review failed for ${actionId}: ${err.message}`);
      updateManifest(actionId, { status: "rejected", reviewError: err.message });
      archivePending(actionId);
      totalRejected++;
      await postActionResult(
        actionId,
        "REJECT",
        1,
        `Review failed with error: ${err.message.substring(0, 200)}`
      );
      continue;
    }

    // Record first review in manifest history
    const reviewEntry = {
      round: 1,
      verdict: verdict.verdict,
      confidence: verdict.confidence,
      feedback: verdict.feedback,
      issues: verdict.issues,
      summary: verdict.summary,
      timestamp: new Date().toISOString(),
    };
    updateManifest(actionId, {
      revisionCount: 1,
      reviewHistory: [reviewEntry],
      lastReviewAt: reviewEntry.timestamp,
    });

    // f. Handle APPROVE
    if (verdict.verdict === "APPROVE") {
      console.log(`[review-orchestrator] APPROVED: ${actionId} (confidence: ${verdict.confidence})`);
      approved = true;
      rounds = 1;
      updateManifest(actionId, { status: "approved" });

    // g. Handle REVISE — enter revision loop
    } else if (verdict.verdict === "REVISE") {
      console.log(`[review-orchestrator] REVISE: ${actionId} — entering revision loop`);
      const agentType = getAgentType(manifest.type);

      try {
        const loopResult = await runRevisionLoop({
          actionId,
          originalPrompt: manifest.reason ?? "",
          agentType,
          reviewParams,
          formattedResearch,
          validationMeta: {
            targetPage: manifest.targetPage,
            targetKeyword: manifest.targetKeyword,
          },
        });

        approved = loopResult.approved;
        rounds = loopResult.rounds + 1; // +1 for the initial review
        verdict = loopResult.finalVerdict;

        if (!approved) {
          console.log(`[review-orchestrator] Revision loop rejected: ${actionId}`);
          updateManifest(actionId, { status: "rejected" });
        }
      } catch (err) {
        console.error(`[review-orchestrator] Revision loop failed for ${actionId}: ${err.message}`);
        approved = false;
        updateManifest(actionId, { status: "rejected", reviewError: err.message });
      }

    // h. Handle REJECT
    } else {
      console.log(`[review-orchestrator] REJECTED: ${actionId}`);
      approved = false;
      updateManifest(actionId, { status: "rejected" });
    }

    // f (cont). Apply + commit if approved
    if (approved) {
      if (opts.dryRun) {
        console.log(`[review-orchestrator] DRY RUN — skipping apply+commit for ${actionId}`);
      } else {
        // Apply change to repo
        const applied = applyChange(actionId);

        if (applied) {
          // Build commit message
          const targetPage = manifest.targetPage ?? manifest.targetFile ?? "unknown";
          let commitMsg;
          if (rounds > 1) {
            commitMsg = `[seo-auto] ${manifest.type}: ${targetPage} (reviewed, ${rounds} rounds)`;
          } else {
            commitMsg = `[seo-auto] ${manifest.type}: ${targetPage} (reviewed by ${manifest.reviewTier ?? "sonnet"})`;
          }

          try {
            commitAndPush(commitMsg);
            console.log(`[review-orchestrator] Committed to staging: ${commitMsg}`);

            stagingChanges.push({
              file: manifest.targetFile ?? "unknown",
              url: manifest.targetPage ?? "",
              type: manifest.type,
            });

            writeStagingManifest("review-orchestrator", stagingChanges);
          } catch (err) {
            console.error(`[review-orchestrator] Commit failed for ${actionId}: ${err.message}`);
            // Revert any uncommitted changes
            try {
              execSync("git checkout -- .", { cwd: REPO_ROOT });
            } catch {}
          }
        } else {
          console.error(`[review-orchestrator] Apply failed for ${actionId} — marking rejected`);
          approved = false;
          updateManifest(actionId, { status: "rejected", applyFailed: true });
        }
      }
    }

    // i. Archive the processed item
    archivePending(actionId);

    // j. Collect result for summary
    if (approved) {
      totalApproved++;
      if (rounds === 1) {
        totalFirstAttempt++;
      } else {
        totalAfterRevision++;
      }
    } else {
      totalRejected++;
    }

    // Post per-action result to Discord
    await postActionResult(actionId, approved ? "APPROVE" : "REJECT", rounds, verdict?.summary ?? "");
  }

  // 4. Post nightly summary to Discord
  const total = manifests.length;
  console.log(
    `\n[review-orchestrator] Summary: ${total} reviewed, ` +
      `${totalApproved} approved (${totalFirstAttempt} first-attempt, ${totalAfterRevision} after revision), ` +
      `${totalRejected} rejected`
  );

  await postNightlySummary({
    total,
    approved: totalApproved,
    firstAttempt: totalFirstAttempt,
    afterRevision: totalAfterRevision,
    rejected: totalRejected,
  });

  console.log("[review-orchestrator] Review phase complete.");
}

main().catch((err) => {
  console.error("[review-orchestrator] Fatal error:", err);
  process.exit(1);
});
