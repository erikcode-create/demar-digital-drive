/**
 * Internal Link Optimizer Action Agent
 *
 * Ported from monitoring/seo/internal-link-optimizer.mjs.
 * Uses context.source.readAllPages() to build a link matrix from source files
 * (no HTTP crawling), then uses Claude to suggest and apply link additions.
 */

import { generateWithClaude } from "../../marketing/lib/claude-api.mjs";
import { commitAndPush, buildSucceeds } from "../../marketing/lib/git-ops.mjs";
import { validate, validateFileContent } from "../lib/validators/index.mjs";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");

export const name = "internal-link-optimizer";
export const category = "action";
export const description =
  "Analyzes and improves internal linking between pages based on strategy actions.";

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

/**
 * Extract internal link targets from a TSX source string.
 * Looks for <Link to="/..."> and <a href="/...">.
 */
function extractInternalLinks(source) {
  const links = new Set();
  // React Router Link: to="/path"
  const linkMatches = source.matchAll(/to=["'](\/.+?)["']/g);
  for (const m of linkMatches) {
    links.add(m[1].split("?")[0].split("#")[0].replace(/\/$/, "") || "/");
  }
  // Regular anchor: href="/path"
  const hrefMatches = source.matchAll(/href=["'](\/.+?)["']/g);
  for (const m of hrefMatches) {
    links.add(m[1].split("?")[0].split("#")[0].replace(/\/$/, "") || "/");
  }
  return [...links];
}

// ---------------------------------------------------------------------------
// Main run
// ---------------------------------------------------------------------------

export async function run(context) {
  const action = context.config.currentAction;
  if (!action) {
    return { success: false, summary: "No currentAction provided in context.config", data: null };
  }

  if (action.type !== "fix-links") {
    return {
      success: false,
      summary: `Wrong action type for internal-link-optimizer: ${action.type}. Expected fix-links.`,
      data: null,
    };
  }

  console.log(`=== Internal Link Optimizer Agent ===`);
  console.log(`Action: ${action.id} | Target: ${action.targetPage || "site-wide"}`);

  // -----------------------------------------------------------------------
  // 1. Build the link matrix from source files
  // -----------------------------------------------------------------------
  console.log("  Reading all pages from source...");
  let allPages;
  try {
    allPages = context.source.readAllPages();
  } catch (err) {
    return { success: false, summary: `Failed to read pages: ${err.message}`, data: null };
  }

  // allPages should be an array of { path, name, source } or similar
  const pageList = Array.isArray(allPages) ? allPages : [];

  const linkMatrix = {};
  for (const page of pageList) {
    const pagePath = page.path || page.urlPath || page.route;
    const source = page.source || page.content || "";
    const internalLinks = typeof source === "string" ? extractInternalLinks(source) : [];
    linkMatrix[pagePath] = {
      name: page.name || pagePath,
      linksTo: internalLinks,
      count: internalLinks.length,
    };
  }

  console.log(`  Built link matrix for ${Object.keys(linkMatrix).length} pages.`);

  // -----------------------------------------------------------------------
  // 2. Identify under-linked pages and get Claude suggestions
  // -----------------------------------------------------------------------
  const matrixSummary = Object.entries(linkMatrix)
    .map(
      ([pagePath, data]) =>
        `${data.name} (${pagePath}): ${data.count} internal links -> [${data.linksTo.join(", ")}]`
    )
    .join("\n");

  const targetClause = action.targetPage
    ? `Focus especially on improving internal links TO and FROM the page: ${action.targetPage}`
    : "Analyze the full site link matrix.";

  const prompt = `You are an SEO internal linking specialist for DeMar Transportation, a US freight carrier and broker.

${targetClause}

Strategy reason: ${action.reason}
Details: ${action.details}

Current internal link matrix:
${matrixSummary}

Rules:
- Each page should have 3-5 relevant internal links
- Links should be topically relevant (service pages link to related resources, blog posts link to relevant services)
- Use descriptive anchor text, not "click here" or "learn more"
- Focus on the highest-impact additions

Return ONLY a JSON array (no markdown fences) of the top 5 most impactful link additions:
[
  {
    "sourcePath": "/page-that-needs-the-link",
    "targetPath": "/page-to-link-to",
    "anchorText": "descriptive anchor text",
    "placement": "where in the source page content to add the link"
  }
]`;

  console.log("  Getting link suggestions from Claude (haiku)...");
  let suggestions;
  try {
    const output = await generateWithClaude(prompt, { model: "haiku", timeout: 120000 });
    const match = output.match(/\[[\s\S]*\]/);
    suggestions = match ? JSON.parse(match[0]) : [];
  } catch (err) {
    return { success: false, summary: `Failed to get link suggestions: ${err.message}`, data: null };
  }

  if (suggestions.length === 0) {
    console.log("  No link suggestions generated.");
    return { success: true, summary: "No link improvements needed", data: { suggestions: 0 } };
  }

  console.log(`  Got ${suggestions.length} suggestions.`);

  // -----------------------------------------------------------------------
  // 3. Apply link additions
  // -----------------------------------------------------------------------
  let appliedCount = 0;
  const appliedSuggestions = [];
  const limit = context.config.limit || 5;

  for (const suggestion of suggestions.slice(0, limit)) {
    const srcFile = pathToSourceFile(suggestion.sourcePath);
    const fullPath = path.join(REPO_ROOT, srcFile);

    if (!existsSync(fullPath)) {
      console.log(`  Skipping: source file not found: ${srcFile}`);
      continue;
    }

    const originalCode = readFileSync(fullPath, "utf-8");

    const fixPrompt = `Read and edit the React component file below. Add an internal link to "${suggestion.targetPath}" with anchor text "${suggestion.anchorText}" in the ${suggestion.placement} area.

Use React Router Link component: <Link to="${suggestion.targetPath}">${suggestion.anchorText}</Link>

If the file does not already import Link from react-router-dom, add the import.

Make ONLY this addition. Do not change any other content.

Here is the current file content:
\`\`\`tsx
${originalCode}
\`\`\`

Return ONLY the complete updated file. No markdown fences. No explanation.`;

    try {
      console.log(`  Adding link: ${suggestion.sourcePath} -> ${suggestion.targetPath}...`);
      const output = await generateWithClaude(fixPrompt, { model: "haiku", timeout: 120000 });

      let code = output.trim();
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
        console.log(`  Skipping: invalid output for ${srcFile}`);
        continue;
      }

      // Validate generated output before writing
      const validation = validate("internal-link-optimizer", code, {
        targetKeyword: action?.keyword || "",
        originalSize: originalCode.length,
      });
      if (!validation.passed) {
        console.log(`  ❌ Validation failed for ${srcFile}: ${validation.errors.join(", ")}`);
        continue;
      }

      writeFileSync(fullPath, code);

      // Validate file content after write
      const diffCheck = validateFileContent(readFileSync(fullPath, "utf-8"), { maxAddedLines: 200 });
      if (!diffCheck.passed) {
        console.log(`  ❌ Diff check failed for ${srcFile}: ${diffCheck.errors.join(", ")}`);
        writeFileSync(fullPath, originalCode);
        continue;
      }

      appliedCount++;
      appliedSuggestions.push(suggestion);
    } catch (err) {
      console.error(`  Failed to apply link to ${srcFile}: ${err.message}`);
    }
  }

  if (appliedCount === 0) {
    console.log("  No links were successfully applied.");
    return { success: true, summary: "Link suggestions generated but none applied", data: { suggestions: suggestions.length, applied: 0 } };
  }

  // -----------------------------------------------------------------------
  // 4. Verify build
  // -----------------------------------------------------------------------
  console.log("  Verifying build...");
  if (!buildSucceeds()) {
    console.error("  Build failed after link additions. Reverting all changes.");
    try {
      const { execSync } = await import("node:child_process");
      execSync("git checkout -- .", { cwd: REPO_ROOT });
    } catch {}
    return { success: false, summary: "Build failed after link additions", data: null };
  }

  // -----------------------------------------------------------------------
  // 5. Commit and push
  // -----------------------------------------------------------------------
  const commitMsg = `[seo-auto] Add ${appliedCount} internal link(s)${action.targetPage ? ` for ${action.targetPage}` : ""}`;
  commitAndPush(commitMsg);
  console.log("  Committed and pushed.");

  markActionCompleted(context, action.id);

  // -----------------------------------------------------------------------
  // 6. Post to Discord
  // -----------------------------------------------------------------------
  let desc = `**${appliedCount} internal link(s) added.**\n\n`;
  for (const s of appliedSuggestions) {
    desc += `- ${s.sourcePath} -> ${s.targetPath}: "${s.anchorText}"\n`;
  }

  try {
    await context.discord.post("seo", {
      content: `**Internal Link Optimizer Agent**`,
      embeds: [{
        title: "Internal Links Optimized",
        description: desc.substring(0, 4000),
        color: 3066993,
        timestamp: new Date().toISOString(),
      }],
    });
  } catch {}

  return {
    success: true,
    summary: `Added ${appliedCount} internal link(s)`,
    data: { suggestions: suggestions.length, applied: appliedCount, links: appliedSuggestions },
  };
}
