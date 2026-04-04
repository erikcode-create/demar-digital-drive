/**
 * Schema Generator Action Agent
 *
 * Adds JSON-LD structured data to pages that are missing it.
 * Handles action type "fix-schema".
 */

import { generateWithClaude } from "../../marketing/lib/claude-api.mjs";
import { commitAndPush, buildSucceeds } from "../../marketing/lib/git-ops.mjs";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const SITE_URL = "https://demartransportation.com";

export const name = "schema-generator";
export const category = "action";
export const description =
  "Adds JSON-LD structured data to pages missing schema markup.";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Normalize a URL path to lowercase kebab-case.
 * Converts /services/Dry-Van or /Services/DryVan → /services/dry-van.
 */
function normalizeTargetPage(urlPath) {
  if (!urlPath) return urlPath;
  return urlPath
    // Split on "/" to process each segment independently
    .split("/")
    .map((segment) => {
      if (!segment) return segment; // preserve leading/trailing slashes
      // PascalCase or camelCase → kebab-case (e.g. DryVan → dry-van)
      return segment
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/([a-zA-Z])(\d)/g, "$1-$2")
        .toLowerCase();
    })
    .join("/");
}

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
 * Determine the appropriate schema type for the given URL path.
 */
function inferSchemaType(urlPath) {
  if (urlPath.startsWith("/blog/")) return "BlogPosting";
  if (urlPath.startsWith("/services/") || urlPath === "/services") return "Service";
  if (urlPath.startsWith("/resources/") || urlPath === "/resources") return "Article";
  if (urlPath.includes("/faq") || urlPath.includes("/faqs")) return "FAQPage";
  if (urlPath === "/") return "WebSite";
  if (urlPath.includes("/about")) return "AboutPage";
  if (urlPath.includes("/contact")) return "ContactPage";
  // Default for unknown pages
  return "WebPage";
}

/**
 * Check if the source file already has application/ld+json structured data.
 */
function hasExistingSchema(sourceCode) {
  return sourceCode.includes("application/ld+json");
}

// ---------------------------------------------------------------------------
// Main run
// ---------------------------------------------------------------------------

export async function run(context) {
  const action = context.config.currentAction;
  if (!action) {
    return { success: false, summary: "No currentAction provided in context.config", data: null };
  }

  if (action.type !== "fix-schema") {
    return {
      success: false,
      summary: `Wrong action type for schema-generator: ${action.type}. Expected fix-schema.`,
      data: null,
    };
  }

  if (!action.targetPage) {
    return { success: false, summary: "fix-schema action requires targetPage", data: null };
  }

  console.log(`=== Schema Generator Agent ===`);

  // Normalize targetPage to lowercase kebab-case as a safety net against
  // strategy agent returning paths like /services/Dry-Van or /Services/DryVan.
  const targetPage = normalizeTargetPage(action.targetPage);
  if (targetPage !== action.targetPage) {
    console.log(`  Normalized targetPage: ${action.targetPage} → ${targetPage}`);
  }
  console.log(`Action: ${action.id} | Page: ${targetPage}`);

  // -----------------------------------------------------------------------
  // 1. Read the current page source
  // -----------------------------------------------------------------------
  const srcFile = pathToSourceFile(targetPage);
  const fullPath = path.join(REPO_ROOT, srcFile);

  if (!existsSync(fullPath)) {
    return { success: false, summary: `Source file not found: ${srcFile}`, data: null };
  }

  const sourceCode = readFileSync(fullPath, "utf-8");

  // -----------------------------------------------------------------------
  // 2. Check if schema already exists
  // -----------------------------------------------------------------------
  if (hasExistingSchema(sourceCode)) {
    console.log(`  Page already has application/ld+json schema. Skipping.`);
    markActionCompleted(context, action.id);
    return {
      success: true,
      summary: `Schema already present on ${targetPage}. No changes needed.`,
      data: { page: targetPage, skipped: true },
    };
  }

  const schemaType = inferSchemaType(targetPage);
  console.log(`  Inferred schema type: ${schemaType}`);

  // -----------------------------------------------------------------------
  // 3. Generate the modified file with JSON-LD via Claude (haiku)
  // -----------------------------------------------------------------------
  const prompt = `You are an expert React/TypeScript developer adding JSON-LD structured data to a React component.

Page URL: ${targetPage} (full URL: ${SITE_URL}${targetPage})
Schema type to add: ${schemaType}
Reason: ${action.reason || "Page is missing structured data for SEO"}
Additional context: ${action.details || "Add the most appropriate schema for this page type"}

Here is the current TypeScript source file:

\`\`\`tsx
${sourceCode}
\`\`\`

Task: Add a useEffect that injects a <script type="application/ld+json"> tag into the document head with appropriate ${schemaType} structured data for DeMar Transportation.

DeMar Transportation details:
- Business: US freight carrier and broker
- Location: Reno, NV
- Services: dry van, reefer, flatbed, hazmat, FTL, LTL, 3PL, warehousing, box truck, sprinter van
- Website: ${SITE_URL}
- Phone: (775) 500-0520

Requirements:
1. Add the useEffect INSIDE the component function, before the return statement
2. The useEffect should create a script tag, set its type to "application/ld+json", set its innerHTML to JSON.stringify(schemaObject), append it to document.head, and return a cleanup function that removes it
3. Use a unique id on the script tag (e.g., "schema-${schemaType.toLowerCase()}-${targetPage.replace(/\//g, "-").replace(/^-/, "")}") to avoid duplicates
4. Generate realistic, accurate schema data matching the page content
5. For Service schema: include name, description, provider (DeMar Transportation), areaServed (US), serviceType
6. For BlogPosting schema: include headline, description, author, publisher, datePublished (use a plausible date from the content or today), url
7. For FAQPage schema: extract actual Q&A pairs from the component content
8. For WebPage/AboutPage/ContactPage: use appropriate schema fields
9. Make sure "import { useEffect" is added to the React import if not already present
10. Do NOT change any other content, styling, or logic

Return the COMPLETE updated TypeScript file (no markdown fences, no explanation — just the raw file content starting with imports).`;

  console.log("  Generating schema with Claude (haiku)...");
  let updatedCode;
  try {
    updatedCode = await generateWithClaude(prompt, { model: "haiku", timeout: 120000 });
  } catch (err) {
    return { success: false, summary: `Failed to generate schema: ${err.message}`, data: null };
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

  if (!hasExistingSchema(code)) {
    return { success: false, summary: "Generated code is missing application/ld+json — Claude may have failed to add schema", data: null };
  }

  // -----------------------------------------------------------------------
  // 4. Write the file and verify build
  // -----------------------------------------------------------------------
  const originalCode = sourceCode;
  writeFileSync(fullPath, code);
  console.log(`  Wrote updated file: ${srcFile}`);

  console.log("  Verifying build...");
  if (!buildSucceeds()) {
    console.error("  Build failed. Reverting changes.");
    writeFileSync(fullPath, originalCode);
    return { success: false, summary: "Build failed after schema injection", data: null };
  }

  // -----------------------------------------------------------------------
  // 5. Commit and push
  // -----------------------------------------------------------------------
  const commitMsg = `[seo-auto] Add ${schemaType} JSON-LD schema: ${targetPage}`;
  commitAndPush(commitMsg);
  console.log("  Committed and pushed.");

  markActionCompleted(context, action.id);

  // -----------------------------------------------------------------------
  // 6. Post to Discord
  // -----------------------------------------------------------------------
  try {
    await context.discord.post("seo", {
      content: `**Schema Generator Agent**`,
      embeds: [{
        title: "JSON-LD Schema Added",
        description: [
          `**Page:** ${targetPage}`,
          `**Schema Type:** ${schemaType}`,
          `**File:** \`${srcFile}\``,
          "",
          `**Reason:** ${action.reason || "Page was missing structured data"}`,
        ].join("\n").substring(0, 4000),
        color: 3066993,
        timestamp: new Date().toISOString(),
      }],
    });
  } catch {}

  return {
    success: true,
    summary: `Added ${schemaType} JSON-LD schema to ${targetPage}`,
    data: {
      page: targetPage,
      schemaType,
      file: srcFile,
    },
  };
}
