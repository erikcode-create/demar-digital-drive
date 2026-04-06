/**
 * Revision Loop Module
 *
 * Manages the feedback cycle between the reviewer and writer when a change
 * gets a REVISE verdict. Sends feedback back to the writer, gets a revised
 * version, and re-reviews. Max 3 rounds. Round 3 escalates the writer to Opus.
 */

import { generateWithClaude } from "../../marketing/lib/claude-api.mjs";
import { readPending, updateManifest, updateModifiedCode } from "../lib/pending.mjs";
import { reviewChange } from "./reviewer-agent.mjs";
import { validate } from "../lib/validators/index.mjs";

// ---------------------------------------------------------------------------
// getWriterModel
// ---------------------------------------------------------------------------

/**
 * Returns the writer model for the given revision round.
 * Rounds 1-2 use the base model; round 3+ escalates to Opus.
 *
 * @param {number} roundNumber - 1-based round number
 * @param {string} [baseModel="sonnet"] - model to use for rounds 1-2
 * @returns {string} model name ("opus" | baseModel)
 */
export function getWriterModel(roundNumber, baseModel = "opus") {
  return baseModel;
}

// ---------------------------------------------------------------------------
// buildRevisionPrompt
// ---------------------------------------------------------------------------

/**
 * Builds the revision prompt that sends reviewer feedback back to the writer.
 *
 * @param {object} opts
 * @param {string} opts.originalPrompt      - the original task prompt
 * @param {string} opts.previousCode        - the code that was reviewed (and needs revision)
 * @param {string} opts.reviewerFeedback    - free-text feedback from the reviewer
 * @param {string[]} opts.reviewerIssues    - specific issues found (array of strings)
 * @param {string|object|null} [opts.researchContext] - optional research context
 * @param {number} [opts.roundNumber=1]     - 1-based round number
 * @returns {string}
 */
export function buildRevisionPrompt({
  originalPrompt,
  previousCode,
  reviewerFeedback,
  reviewerIssues,
  researchContext,
  roundNumber = 1,
} = {}) {
  const lines = [];

  lines.push("Your previous attempt was reviewed and needs changes.");
  lines.push("");

  // Escalation notice on round 3+
  if (roundNumber >= 3) {
    lines.push("## ⚠ ESCALATION NOTICE");
    lines.push(
      "This is your final attempt. Two previous attempts have failed review. " +
      "Read the feedback below extremely carefully and address every issue. " +
      "Failure to resolve all issues will result in the change being REJECTED."
    );
    lines.push("");
  }

  // Reviewer feedback
  lines.push("## Reviewer Feedback");
  lines.push(reviewerFeedback ?? "No feedback provided.");
  lines.push("");

  // Specific issues
  lines.push("## Specific Issues Found");
  const issues = Array.isArray(reviewerIssues) ? reviewerIssues : [];
  if (issues.length > 0) {
    for (const issue of issues) {
      lines.push(`- ${issue}`);
    }
  } else {
    lines.push("- No specific issues listed.");
  }
  lines.push("");

  // Previous attempt
  lines.push("## Previous Attempt (DO NOT repeat these mistakes)");
  lines.push("```tsx");
  lines.push(previousCode ?? "");
  lines.push("```");
  lines.push("");

  // Research context (optional)
  if (researchContext != null) {
    lines.push("## Research Context");
    const ctx =
      typeof researchContext === "string"
        ? researchContext
        : JSON.stringify(researchContext, null, 2);
    lines.push(ctx);
    lines.push("");
  }

  // Original task
  lines.push("## Original Task");
  lines.push(originalPrompt ?? "");
  lines.push("");

  // Final instruction
  lines.push(
    "Return the complete file contents only. Do not include markdown fences, " +
    "explanations, or any text outside the file itself."
  );

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// runRevisionLoop
// ---------------------------------------------------------------------------

/**
 * Runs the full review + revision loop for a pending action.
 *
 * @param {object} opts
 * @param {string} opts.actionId           - pending action identifier
 * @param {string} opts.originalPrompt     - the original generation prompt
 * @param {string} opts.agentType          - agent type for validator lookup
 * @param {object} opts.reviewParams       - extra params forwarded to reviewChange()
 * @param {string|object|null} [opts.formattedResearch] - research context for revision prompts
 * @param {object} [opts.validationMeta]   - extra metadata for validate()
 * @returns {Promise<{ approved: boolean, finalVerdict: object, rounds: number }>}
 */
export async function runRevisionLoop({
  actionId,
  originalPrompt,
  agentType,
  reviewParams,
  formattedResearch = null,
  validationMeta = {},
} = {}) {
  const MAX_ROUNDS = 3;
  let rounds = 0;
  let finalVerdict = null;

  for (let round = 1; round <= MAX_ROUNDS; round++) {
    rounds = round;

    // Read latest pending state
    const pending = readPending(actionId);
    if (!pending) {
      throw new Error(`[revision-loop] Pending action not found: ${actionId}`);
    }

    const { manifest, modifiedCode, originalCode, researchContext } = pending;

    // (a) Review the current code
    console.log(`[revision-loop] Round ${round}/${MAX_ROUNDS} — reviewing ${actionId}`);
    const verdict = await reviewChange({
      ...reviewParams,
      originalCode,
      modifiedCode,
    });

    finalVerdict = verdict;

    // (b) Record the review in the manifest
    const reviewEntry = {
      round,
      verdict: verdict.verdict,
      confidence: verdict.confidence,
      feedback: verdict.feedback,
      issues: verdict.issues,
      summary: verdict.summary,
      timestamp: new Date().toISOString(),
    };

    const reviewHistory = Array.isArray(manifest.reviewHistory)
      ? [...manifest.reviewHistory, reviewEntry]
      : [reviewEntry];

    updateManifest(actionId, {
      revisionCount: round,
      reviewHistory,
      lastReviewAt: reviewEntry.timestamp,
    });

    // (c) APPROVE — done
    if (verdict.verdict === "APPROVE") {
      console.log(`[revision-loop] APPROVED on round ${round}`);
      updateManifest(actionId, { status: "approved" });
      return { approved: true, finalVerdict: verdict, rounds };
    }

    // (d) REJECT on final round — give up
    if (verdict.verdict === "REJECT" && round === MAX_ROUNDS) {
      console.log(`[revision-loop] REJECTED on round ${round} — escalation failed`);
      updateManifest(actionId, { status: "rejected" });
      return { approved: false, finalVerdict: verdict, rounds };
    }

    // If REJECT on round < MAX_ROUNDS, still try to revise (treat as REVISE)
    // (e) Generate revision
    const writerModel = getWriterModel(round + 1); // next round's model
    console.log(
      `[revision-loop] Generating revision (round ${round + 1}, model: ${writerModel})…`
    );

    const revisionPrompt = buildRevisionPrompt({
      originalPrompt,
      previousCode: modifiedCode,
      reviewerFeedback: verdict.feedback,
      reviewerIssues: verdict.issues,
      researchContext: formattedResearch ?? researchContext,
      roundNumber: round + 1,
    });

    const rawOutput = await generateWithClaude(revisionPrompt, {
      model: writerModel,
      timeout: 900000, // 15 min — large pages need extra time
    });

    // (f) Clean up code — strip fences, extract between import/export
    let cleanedCode = rawOutput.trim();

    // Strip leading/trailing markdown fences
    const fenceMatch = cleanedCode.match(/```(?:tsx?|jsx?)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      cleanedCode = fenceMatch[1].trim();
    }

    // Extract from first import/export to last line (common writer output)
    const codeStart = cleanedCode.search(/^(import |export )/m);
    if (codeStart > 0) {
      cleanedCode = cleanedCode.slice(codeStart).trim();
    }

    // Strip trailing revision notes after "export default ..." statement
    const exportDefaultMatch = cleanedCode.match(/^export default \w+;/m);
    if (exportDefaultMatch) {
      const exportEnd = cleanedCode.indexOf(exportDefaultMatch[0]) + exportDefaultMatch[0].length;
      cleanedCode = cleanedCode.slice(0, exportEnd).trim() + "\n";
    }

    // Safety net: replace em dashes and en dashes (brand guideline)
    cleanedCode = cleanedCode.replace(/\u2014/g, ",");
    cleanedCode = cleanedCode.replace(/\u2013/g, "-");

    // Strip stray markdown bold/italic markers that break JSX
    cleanedCode = cleanedCode.replace(/(?<![*])\*\*(?![*])/g, "");

    // (g) Structural validation
    const validation = validate(agentType, cleanedCode, {
      ...validationMeta,
      targetKeyword: manifest.targetKeyword,
      originalSize: originalCode ? originalCode.length : 0,
    });

    if (!validation.passed) {
      console.warn(
        `[revision-loop] Structural validation failed on round ${round + 1}:`,
        validation.errors
      );
      // Record validation failure in manifest but continue — the reviewer
      // will catch semantic issues; structural failure is logged for visibility
      updateManifest(actionId, {
        structuralValidation: { passed: false, errors: validation.errors },
      });
    } else {
      updateManifest(actionId, {
        structuralValidation: { passed: true, errors: [] },
      });
    }

    // (h) Write new code for the next round's review
    updateModifiedCode(actionId, cleanedCode);
  }

  // Should not reach here, but guard anyway
  return { approved: false, finalVerdict, rounds };
}
