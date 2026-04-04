/**
 * Meta Tag Optimizer Action Agent
 *
 * Ported from monitoring/seo/meta-tag-optimizer.mjs.
 * Reads the current action from the strategy queue, optimizes the title tag
 * and meta description for the target page, verifies build, and commits.
 */

import { generateWithClaude } from "../../marketing/lib/claude-api.mjs";
import { buildSucceeds } from "../../marketing/lib/git-ops.mjs";
import { writePending } from "../lib/pending.mjs";
import { validate, validateFileContent } from "../lib/validators/index.mjs";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const SITE_URL = "https://demartransportation.com";

export const name = "meta-tag-optimizer";
export const category = "action";
export const description =
  "Optimizes title tags and meta descriptions for target pages based on strategy actions.";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pathToSourceFile(urlPath) {
  if (urlPath === "/") return "src/pages/Index.tsx";
  if (urlPath.startsWith("/blog/")) {
    const slug = urlPath.replace("/blog/", "");
    const componentName = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("");
    return `src/pages/blog/${componentName}.tsx`;
  }
  const segments = urlPath.split("/").filter(Boolean);
  const fileName = segments
    .map((s) =>
      s
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("")
    )
    .join("/");
  return `src/pages/${fileName}.tsx`;
}

function markActionCompleted(context, actionId) {
  try {
    const completed = context.state.read("strategy", "completed-actions") || { ids: [] };
    if (!completed.ids.includes(actionId)) {
      completed.ids.push(actionId);
    }
    context.state.write("strategy", "completed-actions", completed);
  } catch {
    context.state.write("strategy", "completed-actions", { ids: [actionId] });
  }

  try {
    const queue = context.state.read("strategy", "action-queue");
    if (queue && queue.actions) {
      const action = queue.actions.find((a) => a.id === actionId);
      if (action) action.status = "completed";
      context.state.write("strategy", "action-queue", queue);
    }
  } catch {
    // Queue may not exist
  }
}

// ---------------------------------------------------------------------------
// Read current meta tags from the page source
// ---------------------------------------------------------------------------

function extractCurrentMeta(sourceCode) {
  // Look for document.title assignments
  const titleMatch = sourceCode.match(/document\.title\s*=\s*["'`]([^"'`]+)["'`]/);
  // Look for meta description content
  const descMatch = sourceCode.match(
    /meta\s*\[\s*name\s*=\s*["']description["']\s*\].*?content\s*=\s*["'`]([^"'`]+)["'`]/s
  ) || sourceCode.match(
    /metaDescription[=:]\s*["'`]([^"'`]+)["'`]/
  );
  // Look for Helmet or BlogPost meta props
  const metaTitleMatch = sourceCode.match(/metaTitle[=:]\s*["'`]([^"'`]+)["'`]/);

  return {
    title: metaTitleMatch ? metaTitleMatch[1] : titleMatch ? titleMatch[1] : null,
    description: descMatch ? descMatch[1] : null,
  };
}

// ---------------------------------------------------------------------------
// Main run
// ---------------------------------------------------------------------------

export async function run(context) {
  const action = context.config.currentAction;
  if (!action) {
    return { success: false, summary: "No currentAction provided in context.config", data: null };
  }

  if (action.type !== "fix-meta") {
    return {
      success: false,
      summary: `Wrong action type for meta-tag-optimizer: ${action.type}. Expected fix-meta.`,
      data: null,
    };
  }

  if (!action.targetPage) {
    return { success: false, summary: "fix-meta action requires targetPage", data: null };
  }

  console.log(`=== Meta Tag Optimizer Agent ===`);
  console.log(`Action: ${action.id} | Page: ${action.targetPage} | Keyword: ${action.targetKeyword || "none"}`);

  // -----------------------------------------------------------------------
  // 1. Read the current page source
  // -----------------------------------------------------------------------
  const srcFile = pathToSourceFile(action.targetPage);
  const fullPath = path.join(REPO_ROOT, srcFile);

  if (!existsSync(fullPath)) {
    return { success: false, summary: `Source file not found: ${srcFile}`, data: null };
  }

  const sourceCode = readFileSync(fullPath, "utf-8");
  const currentMeta = extractCurrentMeta(sourceCode);

  console.log(`  Current title: ${currentMeta.title || "(not found)"}`);
  console.log(`  Current description: ${currentMeta.description || "(not found)"}`);

  // Also try reading from live page via context
  let livePageData = null;
  try {
    livePageData = context.source.readPage(action.targetPage);
  } catch {
    // Not critical
  }

  // -----------------------------------------------------------------------
  // 2. Generate improved meta tags with Claude (haiku)
  // -----------------------------------------------------------------------
  const prompt = `You are an SEO meta tag specialist for DeMar Transportation, a US freight carrier and broker based in Reno NV.

Page: ${action.targetPage}
Target keyword: ${action.targetKeyword || "infer from the page content"}
Current title: "${currentMeta.title || "unknown"}"
Current meta description: "${currentMeta.description || "unknown"}"
Reason for optimization: ${action.reason}
Specific instructions: ${action.details}

Generate an optimized title tag and meta description for this page.

Requirements:
- Title: 50-60 characters, includes target keyword naturally, compelling for clicks
- Description: 120-155 characters, includes keyword, has clear CTA or value proposition
- Both should be unique and not duplicate other pages on the site
- Use customer language (logistics managers, supply chain directors)
- No exclamation points, no marketing buzzwords

Return ONLY a JSON object (no markdown fences):
{
  "title": "The new title tag",
  "description": "The new meta description",
  "reasoning": "Brief explanation of why these are better"
}`;

  console.log("  Generating optimized meta tags with Claude (sonnet)...");
  let newMeta;
  try {
    const output = await generateWithClaude(prompt, { model: "sonnet", timeout: 60000 });
    const match = output.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Could not parse meta tag response");
    newMeta = JSON.parse(match[0]);
  } catch (err) {
    return { success: false, summary: `Failed to generate meta tags: ${err.message}`, data: null };
  }

  console.log(`  New title: ${newMeta.title}`);
  console.log(`  New description: ${newMeta.description}`);

  // -----------------------------------------------------------------------
  // 3. Apply changes to the source file
  // -----------------------------------------------------------------------
  const editPrompt = `Read and edit the React component file at ${fullPath}.

Make ONLY these changes:
1. Update the title tag/document.title to: "${newMeta.title}"
2. Update the meta description to: "${newMeta.description}"

Look for:
- document.title = "..." assignments in useEffect
- metaTitle="..." props on BlogPost or Helmet components
- metaDescription="..." props
- meta[name="description"] content updates

Make the minimum changes needed. Do NOT change any content, structure, or other meta tags.

Return the complete updated file.`;

  console.log("  Applying meta tag changes...");
  let updatedCode;
  try {
    updatedCode = await generateWithClaude(editPrompt, { model: "sonnet", timeout: 120000 });
  } catch (err) {
    return { success: false, summary: `Failed to apply meta tag edits: ${err.message}`, data: null };
  }

  // Clean up the response
  let code = updatedCode.trim();
  const fenceMatch = code.match(/```(?:tsx?|jsx?|typescript|javascript)?\s*\n([\s\S]*?)```/);
  if (fenceMatch) {
    code = fenceMatch[1].trim();
  } else if (!code.startsWith("import")) {
    const anyImport = code.indexOf("import ");
    if (anyImport !== -1) code = code.substring(anyImport);
  }

  const exportMatch = code.match(/export default \w+;/);
  if (exportMatch) {
    code = code.substring(0, exportMatch.index + exportMatch[0].length);
  }

  if (!code.includes("export default")) {
    return { success: false, summary: "Generated code missing export default", data: null };
  }

  // Validate generated output before writing
  const validation = validate("meta-tag-optimizer", code, {
    targetKeyword: action?.targetKeyword || "",
    originalSize: sourceCode.length,
    newTitle: newMeta.title,
    newDescription: newMeta.description,
  });
  if (!validation.passed) {
    console.log(`  ❌ Validation failed: ${validation.errors.join(", ")}`);
    try {
      await context.discord.post("seo", {
        embeds: [{
          title: `❌ ${name}: Output Rejected`,
          description: validation.errors.map(e => `• ${e}`).join("\n").slice(0, 4000),
          color: 15158332,
        }],
      });
    } catch {}
    return { success: false, reason: validation.errors.join("; "), data: null };
  }

  // Back up original before writing
  const originalCode = sourceCode;
  writeFileSync(fullPath, code);
  console.log(`  Wrote updated file: ${srcFile}`);

  // Validate file content after write
  const diffCheck = validateFileContent(readFileSync(fullPath, "utf-8"), { maxAddedLines: 200 });
  if (!diffCheck.passed) {
    console.log(`  ❌ Diff check failed: ${diffCheck.errors.join(", ")}`);
    writeFileSync(fullPath, originalCode);
    return { success: false, summary: `Diff check failed: ${diffCheck.errors.join("; ")}`, data: null };
  }

  // -----------------------------------------------------------------------
  // 4. Verify build
  // -----------------------------------------------------------------------
  console.log("  Verifying build...");
  if (!buildSucceeds()) {
    console.error("  Build failed. Reverting changes.");
    writeFileSync(fullPath, originalCode);
    return { success: false, summary: "Build failed after meta tag update", data: null };
  }

  // -----------------------------------------------------------------------
  // 5. Write to pending and revert
  // -----------------------------------------------------------------------
  writePending({
    actionId: action.id,
    type: action.type,
    priority: action.priority || 1,
    targetPage: action.targetPage || "/",
    targetKeyword: action.targetKeyword || "",
    targetFile: srcFile,
    reason: action.reason || "",
    agentModel: "sonnet",
    reviewTier: "sonnet",
    originalCode: originalCode,
    modifiedCode: code,
    researchContext: context.config.researchContext || {},
  });
  console.log("  Staged to pending directory.");

  // Restore original file so working tree is clean for next action
  writeFileSync(fullPath, originalCode);

  markActionCompleted(context, action.id);

  // -----------------------------------------------------------------------
  // 6. Post to Discord
  // -----------------------------------------------------------------------
  try {
    await context.discord.post("seo", {
      content: `**Meta Tag Optimizer Agent**`,
      embeds: [{
        title: "Meta Tags Staged for Review",
        description: [
          `**Page:** ${action.targetPage}`,
          `**Keyword:** ${action.targetKeyword || "N/A"}`,
          "",
          `**Old title:** ${currentMeta.title || "unknown"}`,
          `**New title:** ${newMeta.title}`,
          "",
          `**Old description:** ${currentMeta.description || "unknown"}`,
          `**New description:** ${newMeta.description}`,
          "",
          `**Reasoning:** ${newMeta.reasoning}`,
        ].join("\n").substring(0, 4000),
        color: 3066993,
        timestamp: new Date().toISOString(),
      }],
    });
  } catch {}

  return {
    success: true,
    summary: `Optimized meta tags for ${action.targetPage}: "${newMeta.title}"`,
    data: {
      page: action.targetPage,
      oldTitle: currentMeta.title,
      newTitle: newMeta.title,
      oldDescription: currentMeta.description,
      newDescription: newMeta.description,
    },
  };
}
