/**
 * Reviewer Agent Module
 *
 * Evaluates a single pending change and returns APPROVE/REVISE/REJECT verdict.
 * Builds a detailed prompt with all available context and sends to Claude for evaluation.
 */

import { generateWithClaude } from "../../marketing/lib/claude-api.mjs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");

const require = createRequire(import.meta.url);

// ---------------------------------------------------------------------------
// Business facts (loaded once at module level)
// ---------------------------------------------------------------------------

let _businessFacts = null;

function loadBusinessFacts() {
  if (_businessFacts) return _businessFacts;
  try {
    _businessFacts = require(path.join(REPO_ROOT, "tests/fixtures/business-facts.json"));
  } catch {
    _businessFacts = {
      phone: "(775) 230-4767",
      phoneTel: "+17752304767",
      email: "info@DeMarTransportation.com",
      address: "10471 Double R Blvd, Reno, NV 89521",
      companyName: "DeMar Transportation",
      dotNumber: "4392091",
    };
  }
  return _businessFacts;
}

// ---------------------------------------------------------------------------
// Tier selection
// ---------------------------------------------------------------------------

const OPUS_TYPES = new Set(["write-content", "update-content", "fix-homepage"]);

/**
 * Returns "opus" for content-heavy changes and "sonnet" for technical fixes.
 * @param {string} actionType
 * @returns {"opus"|"sonnet"}
 */
export function getReviewTier(actionType) {
  if (OPUS_TYPES.has(actionType)) return "opus";
  return "sonnet";
}

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

/**
 * Builds the full review prompt string.
 *
 * @param {object} opts
 * @param {string} opts.actionType
 * @param {string} opts.reason
 * @param {string} [opts.targetKeyword]
 * @param {string} [opts.originalCode]
 * @param {string} opts.modifiedCode
 * @param {string|object} [opts.researchContext]
 * @param {object|null} [opts.livePage]      - { title, description, wordCount, headings }
 * @param {Array} [opts.competitors]          - [{ title, url, description, wordCount, headings }]
 * @returns {string}
 */
export function buildReviewPrompt({
  actionType,
  reason,
  targetKeyword,
  originalCode,
  modifiedCode,
  researchContext,
  livePage,
  competitors,
} = {}) {
  const facts = loadBusinessFacts();
  const lines = [];

  // Introduction
  lines.push(
    "You are a senior SEO editor reviewing an automated change to the DeMar Transportation website. " +
    "Your job is to evaluate the proposed modification for quality, accuracy, brand alignment, and competitive fit. " +
    "Be critical — approving a bad change is worse than rejecting a good one."
  );
  lines.push("");

  // Action Intent
  lines.push("## Action Intent");
  lines.push(`- **Type:** ${actionType ?? "unknown"}`);
  lines.push(`- **Reason:** ${reason ?? "not specified"}`);
  lines.push(`- **Target Keyword:** ${targetKeyword ?? "none"}`);
  lines.push("");

  // Research Context
  lines.push("## Research Context");
  if (researchContext != null) {
    const ctx =
      typeof researchContext === "string"
        ? researchContext
        : JSON.stringify(researchContext, null, 2);
    lines.push(ctx);
  } else {
    lines.push("No research context provided.");
  }
  lines.push("");

  // Original File
  lines.push("## Original File");
  if (originalCode) {
    lines.push("```tsx");
    lines.push(originalCode);
    lines.push("```");
  } else {
    lines.push("*(no original file provided — this is a new file)*");
  }
  lines.push("");

  // Modified File
  lines.push("## Modified File");
  lines.push("```tsx");
  lines.push(modifiedCode ?? "");
  lines.push("```");
  lines.push("");

  // Current Live Page
  lines.push("## Current Live Page");
  if (livePage) {
    lines.push(`- **Title:** ${livePage.title ?? "N/A"}`);
    lines.push(`- **Description:** ${livePage.description ?? "N/A"}`);
    lines.push(`- **Word Count:** ${livePage.wordCount ?? 0}`);
    const headings = Array.isArray(livePage.headings) ? livePage.headings : [];
    if (headings.length > 0) {
      lines.push("- **Headings:**");
      for (const h of headings) {
        lines.push(`  - ${(h.tag ?? "").toUpperCase()}: ${h.text ?? ""}`);
      }
    } else {
      lines.push("- **Headings:** none detected");
    }
  } else {
    lines.push("Live page data not available.");
  }
  lines.push("");

  // Top Competitor Pages
  lines.push("## Top Competitor Pages");
  if (Array.isArray(competitors) && competitors.length > 0) {
    for (const [i, comp] of competitors.entries()) {
      lines.push(`### Competitor ${i + 1}`);
      lines.push(`- **Title:** ${comp.title ?? "N/A"}`);
      lines.push(`- **URL:** ${comp.url ?? "N/A"}`);
      lines.push(`- **Description:** ${comp.description ?? "N/A"}`);
      lines.push(`- **Word Count:** ${comp.wordCount ?? 0}`);
      const headings = Array.isArray(comp.headings) ? comp.headings : [];
      if (headings.length > 0) {
        lines.push("- **Headings:**");
        for (const h of headings) {
          lines.push(`  - ${(h.tag ?? "").toUpperCase()}: ${h.text ?? ""}`);
        }
      } else {
        lines.push("- **Headings:** none");
      }
      lines.push("");
    }
  } else {
    lines.push("No competitor data available.");
    lines.push("");
  }

  // Business Facts
  lines.push("## Business Facts (Must Be Accurate)");
  lines.push(`- **Company Name:** ${facts.companyName}`);
  lines.push(`- **Phone:** ${facts.phone}`);
  lines.push(`- **Email:** ${facts.email}`);
  lines.push(`- **Address:** ${facts.address}`);
  lines.push(`- **DOT Number:** ${facts.dotNumber}`);
  if (facts.officeHours) lines.push(`- **Office Hours:** ${facts.officeHours}`);
  if (facts.dispatchHours) lines.push(`- **Dispatch:** ${facts.dispatchHours}`);
  lines.push("");

  // Evaluation Instructions
  lines.push("## Evaluation Instructions");
  lines.push(
    "Evaluate the Modified File on the following criteria:"
  );
  lines.push("");
  lines.push(
    "1. **Factual Accuracy** — Does the content match the Business Facts above? " +
    "Check phone numbers, email, address, company name, and DOT number carefully. " +
    "Any discrepancy is an automatic REJECT."
  );
  lines.push(
    "2. **Improvement Over Current** — Is the modified version meaningfully better than the live page? " +
    "Consider word count, heading structure, keyword usage, and user value."
  );
  lines.push(
    "3. **Competitive Fit** — Does it match or exceed competitor pages in depth, clarity, and relevance?"
  );
  lines.push(
    "4. **Brand Match** — Does the tone match a professional freight/trucking company in Nevada? " +
    "No hype, no generic filler, no off-brand language."
  );
  lines.push(
    "5. **Hallucination Check** — Are any claims made that cannot be verified from the research context? " +
    "Flag unverifiable statistics, fake awards, or invented services."
  );
  lines.push(
    "6. **Intent Match** — Does the change address the stated reason and target keyword?"
  );
  lines.push("");

  // Response format
  lines.push("## Required Response Format");
  lines.push(
    "Respond ONLY with a valid JSON object. Do not include any text before or after the JSON."
  );
  lines.push("```json");
  lines.push(JSON.stringify(
    {
      verdict: "APPROVE | REVISE | REJECT",
      confidence: "0-100 integer",
      issues: ["list of specific issues found (empty array if none)"],
      feedback: "Detailed feedback for the action agent if verdict is REVISE or REJECT",
      summary: "One-sentence summary of the evaluation decision",
    },
    null,
    2
  ));
  lines.push("```");
  lines.push("");
  lines.push(
    "Use APPROVE when the change is ready to deploy as-is. " +
    "Use REVISE when the change has fixable issues. " +
    "Use REJECT when the change has unfixable problems (hallucinations, wrong facts, off-brand)."
  );

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Review execution
// ---------------------------------------------------------------------------

/**
 * Sends the review prompt to Claude and returns the parsed verdict.
 *
 * @param {object} opts - Same as buildReviewPrompt, plus:
 * @param {string} [opts.modelOverride] - Override model selection ("opus"|"sonnet")
 * @returns {Promise<{ verdict: string, confidence: number, issues: string[], feedback: string, summary: string }>}
 */
export async function reviewChange({
  actionType,
  reason,
  targetKeyword,
  originalCode,
  modifiedCode,
  researchContext,
  livePage,
  competitors,
  modelOverride,
} = {}) {
  const tier = modelOverride ?? getReviewTier(actionType);
  const timeout = tier === "opus" ? 300000 : 180000;

  const prompt = buildReviewPrompt({
    actionType,
    reason,
    targetKeyword,
    originalCode,
    modifiedCode,
    researchContext,
    livePage,
    competitors,
  });

  const raw = await generateWithClaude(prompt, { model: tier, timeout });

  // Extract JSON from response (Claude sometimes wraps in markdown fences)
  let jsonStr = raw.trim();
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim();
  }

  let result;
  try {
    result = JSON.parse(jsonStr);
  } catch {
    // Fallback: try to extract bare JSON object
    const objMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (objMatch) {
      result = JSON.parse(objMatch[0]);
    } else {
      throw new Error(`Failed to parse reviewer response as JSON: ${raw.slice(0, 200)}`);
    }
  }

  // Normalize verdict field
  const verdict = String(result.verdict ?? "REVISE").toUpperCase();
  const confidence = Number(result.confidence ?? 50);
  const issues = Array.isArray(result.issues) ? result.issues : [];
  const feedback = String(result.feedback ?? "");
  const summary = String(result.summary ?? "");

  // Low-confidence APPROVE → downgrade to REVISE
  const finalVerdict = verdict === "APPROVE" && confidence < 60 ? "REVISE" : verdict;

  return {
    verdict: finalVerdict,
    confidence,
    issues,
    feedback,
    summary,
  };
}
