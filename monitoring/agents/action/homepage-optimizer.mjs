/**
 * Homepage Optimizer Action Agent
 *
 * Fixes homepage issues: missing H1, no internal links, low word count, missing schema.
 * Handles action type "fix-homepage".
 */

import { generateWithClaude } from "../../marketing/lib/claude-api.mjs";
import { commitAndPush, buildSucceeds } from "../../marketing/lib/git-ops.mjs";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const SITE_URL = "https://demartransportation.com";
const HOMEPAGE_SOURCE = "src/pages/Index.tsx";

export const name = "homepage-optimizer";
export const category = "action";
export const description =
  "Optimizes the homepage: H1, internal links to service pages, content depth, and schema markup.";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
 * Detect issues in the homepage source code.
 */
function detectIssues(sourceCode, servicePages) {
  const issues = [];

  // Check for H1 tag
  const hasH1 = /<h1[\s>]/i.test(sourceCode);
  if (!hasH1) {
    issues.push("Missing H1 tag — homepage has no primary heading for SEO");
  }

  // Check for application/ld+json schema
  const hasSchema = sourceCode.includes("application/ld+json");
  if (!hasSchema) {
    issues.push("Missing JSON-LD structured data (WebSite or LocalBusiness schema)");
  }

  // Check for internal links to service pages
  const serviceLinks = servicePages.filter((p) => sourceCode.includes(`"${p.path}"`) || sourceCode.includes(`'${p.path}'`) || sourceCode.includes(`to="${p.path}"`) || sourceCode.includes(`href="${p.path}"`));
  if (serviceLinks.length < 3) {
    issues.push(`Only ${serviceLinks.length} internal service page links found — should link to at least 3 service pages`);
  }

  // Rough word count check (count JSX text content)
  const textContent = sourceCode.replace(/<[^>]+>/g, " ").replace(/\{[^}]+\}/g, " ").replace(/\s+/g, " ");
  const wordCount = textContent.split(" ").filter((w) => w.length > 3).length;
  if (wordCount < 150) {
    issues.push(`Low estimated text content (~${wordCount} meaningful words) — homepage should have more descriptive content`);
  }

  return issues;
}

// ---------------------------------------------------------------------------
// Main run
// ---------------------------------------------------------------------------

export async function run(context) {
  const action = context.config.currentAction;
  if (!action) {
    return { success: false, summary: "No currentAction provided in context.config", data: null };
  }

  if (action.type !== "fix-homepage") {
    return {
      success: false,
      summary: `Wrong action type for homepage-optimizer: ${action.type}. Expected fix-homepage.`,
      data: null,
    };
  }

  console.log(`=== Homepage Optimizer Agent ===`);
  console.log(`Action: ${action.id}`);

  // -----------------------------------------------------------------------
  // 1. Read homepage source
  // -----------------------------------------------------------------------
  const fullPath = path.join(REPO_ROOT, HOMEPAGE_SOURCE);

  if (!existsSync(fullPath)) {
    return { success: false, summary: `Homepage source not found: ${HOMEPAGE_SOURCE}`, data: null };
  }

  const sourceCode = readFileSync(fullPath, "utf-8");

  // Also try getting page data from context
  let homepageData = null;
  try {
    homepageData = context.source.readPage("/");
  } catch {
    // Not critical
  }

  // -----------------------------------------------------------------------
  // 2. Get all service pages for internal linking
  // -----------------------------------------------------------------------
  let servicePages = [];
  try {
    const allPages = context.source.readAllPages();
    servicePages = allPages.filter((p) => p.type === "service");
    console.log(`  Found ${servicePages.length} service page(s) for internal linking`);
  } catch (err) {
    console.warn(`  Could not load service pages: ${err.message}`);
  }

  // -----------------------------------------------------------------------
  // 3. Detect issues
  // -----------------------------------------------------------------------
  const issues = detectIssues(sourceCode, servicePages);
  if (issues.length === 0) {
    console.log("  No homepage issues detected. Skipping.");
    markActionCompleted(context, action.id);
    return {
      success: true,
      summary: "Homepage already has H1, internal links, and schema. No changes needed.",
      data: { page: "/", skipped: true },
    };
  }

  console.log(`  Detected ${issues.length} issue(s):`);
  issues.forEach((i) => console.log(`    - ${i}`));

  // -----------------------------------------------------------------------
  // 4. Generate improved homepage with Claude (sonnet)
  // -----------------------------------------------------------------------
  const servicePageList = servicePages
    .slice(0, 10)
    .map((p) => `  - ${p.title || p.path} → ${p.path}`)
    .join("\n");

  const prompt = `You are an expert React/TypeScript developer and SEO specialist improving the homepage of DeMar Transportation.

DeMar Transportation details:
- Business: US freight carrier and broker
- Location: Reno, NV
- Services: dry van, reefer, flatbed, hazmat, FTL, LTL, 3PL, warehousing, box truck, sprinter van
- Target customers: logistics managers, supply chain directors, shippers
- Website: ${SITE_URL}
- Phone: (775) 500-0520

Issues to fix:
${issues.map((i, n) => `${n + 1}. ${i}`).join("\n")}

Service pages to link to internally:
${servicePageList || "  (none found — add links to /services if present)"}

Additional context from strategy: ${action.reason || ""}
Specific instructions: ${action.details || "Improve homepage for SEO"}

Here is the current TypeScript source file (${HOMEPAGE_SOURCE}):

\`\`\`tsx
${sourceCode}
\`\`\`

Task: Fix all of the identified issues above. Specifically:

1. **H1 tag**: If missing, add a clear H1 that includes the primary keyword "freight carrier" or "freight broker" naturally. The H1 should be visible on the page (not hidden).

2. **JSON-LD schema**: If missing, add a useEffect that injects a WebSite + LocalBusiness schema. The useEffect should:
   - Create a script tag with type="application/ld+json" and id="schema-homepage"
   - Set innerHTML to a JSON string with @context, @type: "WebSite" and a nested @type: "LocalBusiness"
   - Append to document.head
   - Return cleanup function that removes the script

3. **Internal links**: If service pages are under-linked, add React Router <Link> components (or <a> tags if no router is in use) pointing to the service pages listed above. Links should be contextual (e.g., within a services section or CTA area), not just a raw list.

4. **Content depth**: If word count is low, expand key sections with 1-2 sentences of genuine, specific copy about DeMar's capabilities. Do not add fluff — add real, useful information.

Requirements:
- Preserve ALL existing functionality, layout structure, and styling
- Use the same component patterns already in the file
- Make sure "import { useEffect" is added to React import if not present
- Make sure Link is imported from react-router-dom if adding <Link> tags and it is not already imported
- Do NOT change document.title, meta tags, or any existing schema
- Keep changes minimal and surgical — only fix the identified issues

Return the COMPLETE updated TypeScript file (no markdown fences, no explanation — just the raw file content starting with imports).`;

  console.log("  Generating improved homepage with Claude (sonnet)...");
  let updatedCode;
  try {
    updatedCode = await generateWithClaude(prompt, { model: "sonnet", timeout: 120000 });
  } catch (err) {
    return { success: false, summary: `Failed to generate homepage improvements: ${err.message}`, data: null };
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

  // Ensure the code ends at the export default
  const exportMatch = code.match(/export default \w+;/);
  if (exportMatch) {
    code = code.substring(0, exportMatch.index + exportMatch[0].length);
  }

  if (!code.includes("export default")) {
    return { success: false, summary: "Generated code missing export default", data: null };
  }

  // -----------------------------------------------------------------------
  // 5. Write the file and verify build
  // -----------------------------------------------------------------------
  const originalCode = sourceCode;
  writeFileSync(fullPath, code);
  console.log(`  Wrote updated file: ${HOMEPAGE_SOURCE}`);

  console.log("  Verifying build...");
  if (!buildSucceeds()) {
    console.error("  Build failed. Reverting changes.");
    writeFileSync(fullPath, originalCode);
    return { success: false, summary: "Build failed after homepage optimization", data: null };
  }

  // -----------------------------------------------------------------------
  // 6. Commit and push
  // -----------------------------------------------------------------------
  const commitMsg = `[seo-auto] Optimize homepage: H1, internal links, schema`;
  commitAndPush(commitMsg);
  console.log("  Committed and pushed.");

  markActionCompleted(context, action.id);

  // -----------------------------------------------------------------------
  // 7. Post to Discord
  // -----------------------------------------------------------------------
  try {
    await context.discord.post("seo", {
      content: `**Homepage Optimizer Agent**`,
      embeds: [{
        title: "Homepage Optimized",
        description: [
          `**Page:** / (Homepage)`,
          `**Issues Fixed (${issues.length}):**`,
          ...issues.map((i) => `  • ${i}`),
          "",
          `**Service pages linked:** ${servicePages.length}`,
        ].join("\n").substring(0, 4000),
        color: 3066993,
        timestamp: new Date().toISOString(),
      }],
    });
  } catch {}

  return {
    success: true,
    summary: `Optimized homepage: fixed ${issues.length} issue(s) (${issues.join("; ")})`,
    data: {
      page: "/",
      issuesFixed: issues,
      servicePageCount: servicePages.length,
    },
  };
}
