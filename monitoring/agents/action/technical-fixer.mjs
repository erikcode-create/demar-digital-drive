/**
 * Technical Fixer Action Agent
 *
 * Combines patterns from broken-link-fixer.mjs and other SEO fixers.
 * Handles action type "fix-technical": missing alt text, broken internal links,
 * missing schema markup, and other technical SEO issues.
 */

import { generateWithClaude } from "../../marketing/lib/claude-api.mjs";
import { commitAndPush, buildSucceeds } from "../../marketing/lib/git-ops.mjs";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");

export const name = "technical-fixer";
export const category = "action";
export const description =
  "Fixes technical SEO issues: missing alt text, broken links, missing schema markup, and more.";

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
 * Detect what kind of technical issue we are dealing with based on the
 * action details string. Returns an array of issue categories.
 */
function classifyIssue(details) {
  const lower = (details || "").toLowerCase();
  const categories = [];

  if (lower.includes("alt text") || lower.includes("alt attribute") || lower.includes("image alt")) {
    categories.push("alt-text");
  }
  if (lower.includes("broken link") || lower.includes("404") || lower.includes("dead link")) {
    categories.push("broken-links");
  }
  if (lower.includes("schema") || lower.includes("json-ld") || lower.includes("structured data")) {
    categories.push("schema");
  }
  if (lower.includes("heading") || lower.includes("h1") || lower.includes("h2") || lower.includes("heading hierarchy")) {
    categories.push("headings");
  }
  if (lower.includes("canonical") || lower.includes("duplicate")) {
    categories.push("canonical");
  }
  if (lower.includes("accessibility") || lower.includes("aria") || lower.includes("a11y")) {
    categories.push("accessibility");
  }

  // Default if nothing specific detected
  if (categories.length === 0) {
    categories.push("general");
  }

  return categories;
}

// ---------------------------------------------------------------------------
// Fix strategies per issue type
// ---------------------------------------------------------------------------

async function fixAltText(sourceCode, fullPath, action) {
  const prompt = `You are fixing missing alt text on images in a React/TypeScript component for DeMar Transportation's website.

Page: ${action.targetPage}
Issue: ${action.details}

Here is the current file:
\`\`\`tsx
${sourceCode}
\`\`\`

Find all <img> tags that have empty alt="" or are missing alt attributes. Add descriptive, SEO-friendly alt text that:
- Describes the image content accurately
- Includes relevant keywords naturally (freight, shipping, trucking, etc.)
- Is under 125 characters
- Does not start with "image of" or "picture of"

Also check for any images used via CSS background-image and suggest adding aria-label if appropriate.

Return ONLY the complete updated file. No markdown fences. No explanation.`;

  return generateWithClaude(prompt, { model: "haiku", timeout: 120000 });
}

async function fixBrokenLinks(sourceCode, fullPath, action) {
  const prompt = `You are fixing broken internal links in a React/TypeScript component for DeMar Transportation's website.

Page: ${action.targetPage}
Issue: ${action.details}

Here is the current file:
\`\`\`tsx
${sourceCode}
\`\`\`

Check all Link to="..." and a href="..." in this file. Fix any that point to:
- Non-existent paths (common valid paths: /, /about, /contact, /quote, /careers, /faq, /blog, /resources, /services/dry-van, /services/reefer, /services/flatbed, /services/box-truck, /services/sprinter-van, /services/hazmat, /services/ftl, /services/ltl, /services/3pl, /services/warehousing)
- Broken external URLs mentioned in the action details

For broken internal links, update to the correct path. For broken external links, either update the URL or remove the link (keeping the anchor text as plain text).

Return ONLY the complete updated file. No markdown fences. No explanation.`;

  return generateWithClaude(prompt, { model: "haiku", timeout: 120000 });
}

async function fixSchema(sourceCode, fullPath, action) {
  const prompt = `You are adding or fixing JSON-LD structured data in a React/TypeScript component for DeMar Transportation's website.

Page: ${action.targetPage}
Issue: ${action.details}

Here is the current file:
\`\`\`tsx
${sourceCode}
\`\`\`

Add or fix JSON-LD schema markup for this page. DeMar Transportation is a freight carrier and broker based in Reno, NV.

Common schemas to add:
- LocalBusiness (for service pages)
- FAQPage (if the page has FAQ content)
- BreadcrumbList (for navigation hierarchy)
- Service (for service pages)
- BlogPosting (for blog posts, usually handled by BlogPost component)

Add the schema as a <script type="application/ld+json"> tag in a useEffect or via Helmet, following the existing pattern in the codebase. If the page already uses BlogPost component, it likely handles schema already.

Return ONLY the complete updated file. No markdown fences. No explanation.`;

  return generateWithClaude(prompt, { model: "haiku", timeout: 120000 });
}

async function fixGeneral(sourceCode, fullPath, action) {
  const prompt = `You are fixing a technical SEO issue in a React/TypeScript component for DeMar Transportation's website.

Page: ${action.targetPage}
Issue: ${action.details}
Reason: ${action.reason}

Here is the current file:
\`\`\`tsx
${sourceCode}
\`\`\`

Fix the described issue while following these rules:
- Make the minimum changes needed
- Do not change content or copy unless specifically required
- Preserve all existing imports and component structure
- Use React best practices (hooks, proper JSX)
- No em dashes, no exclamation points in any text changes

Return ONLY the complete updated file. No markdown fences. No explanation.`;

  return generateWithClaude(prompt, { model: "haiku", timeout: 120000 });
}

// ---------------------------------------------------------------------------
// Main run
// ---------------------------------------------------------------------------

export async function run(context) {
  const action = context.config.currentAction;
  if (!action) {
    return { success: false, summary: "No currentAction provided in context.config", data: null };
  }

  if (action.type !== "fix-technical") {
    return {
      success: false,
      summary: `Wrong action type for technical-fixer: ${action.type}. Expected fix-technical.`,
      data: null,
    };
  }

  if (!action.targetPage) {
    return { success: false, summary: "fix-technical action requires targetPage", data: null };
  }

  console.log(`=== Technical Fixer Agent ===`);
  console.log(`Action: ${action.id} | Page: ${action.targetPage}`);
  console.log(`Details: ${action.details}`);

  const issueTypes = classifyIssue(action.details);
  console.log(`  Classified as: ${issueTypes.join(", ")}`);

  // -----------------------------------------------------------------------
  // 1. Read source file
  // -----------------------------------------------------------------------
  const srcFile = pathToSourceFile(action.targetPage);
  const fullPath = path.join(REPO_ROOT, srcFile);

  if (!existsSync(fullPath)) {
    return { success: false, summary: `Source file not found: ${srcFile}`, data: null };
  }

  const originalCode = readFileSync(fullPath, "utf-8");

  // -----------------------------------------------------------------------
  // 2. Apply fixes based on issue type
  // -----------------------------------------------------------------------
  let updatedOutput;
  try {
    // Use the most specific fixer available; for multiple issues, fix in sequence
    const primaryIssue = issueTypes[0];

    switch (primaryIssue) {
      case "alt-text":
        updatedOutput = await fixAltText(originalCode, fullPath, action);
        break;
      case "broken-links":
        updatedOutput = await fixBrokenLinks(originalCode, fullPath, action);
        break;
      case "schema":
        updatedOutput = await fixSchema(originalCode, fullPath, action);
        break;
      case "headings":
      case "canonical":
      case "accessibility":
      case "general":
      default:
        updatedOutput = await fixGeneral(originalCode, fullPath, action);
        break;
    }
  } catch (err) {
    return { success: false, summary: `Failed to generate fix: ${err.message}`, data: null };
  }

  // Clean up the response
  let code = updatedOutput.trim();
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
    return { success: false, summary: "Generated fix missing export default", data: null };
  }

  // Check if anything actually changed
  if (code.trim() === originalCode.trim()) {
    console.log("  No changes detected in the output.");
    return { success: true, summary: "No changes needed", data: { changed: false } };
  }

  writeFileSync(fullPath, code);
  console.log(`  Wrote updated file: ${srcFile}`);

  // -----------------------------------------------------------------------
  // 3. If there are additional issue types, apply them sequentially
  // -----------------------------------------------------------------------
  for (const additionalIssue of issueTypes.slice(1)) {
    const currentCode = readFileSync(fullPath, "utf-8");
    let additionalOutput;

    try {
      switch (additionalIssue) {
        case "alt-text":
          additionalOutput = await fixAltText(currentCode, fullPath, action);
          break;
        case "broken-links":
          additionalOutput = await fixBrokenLinks(currentCode, fullPath, action);
          break;
        case "schema":
          additionalOutput = await fixSchema(currentCode, fullPath, action);
          break;
        default:
          continue; // Skip general if we already applied a specific fix
      }

      let addlCode = additionalOutput.trim();
      const addlFence = addlCode.match(/```(?:tsx?|jsx?|typescript|javascript)?\s*\n([\s\S]*?)```/);
      if (addlFence) addlCode = addlFence[1].trim();
      else if (!addlCode.startsWith("import")) {
        const idx = addlCode.indexOf("import ");
        if (idx !== -1) addlCode = addlCode.substring(idx);
      }
      const addlExport = addlCode.match(/export default \w+;/);
      if (addlExport) addlCode = addlCode.substring(0, addlExport.index + addlExport[0].length);

      if (addlCode.includes("export default")) {
        writeFileSync(fullPath, addlCode);
        console.log(`  Applied additional fix: ${additionalIssue}`);
      }
    } catch (err) {
      console.error(`  Additional fix (${additionalIssue}) failed: ${err.message}`);
    }
  }

  // -----------------------------------------------------------------------
  // 4. Verify build
  // -----------------------------------------------------------------------
  console.log("  Verifying build...");
  if (!buildSucceeds()) {
    console.error("  Build failed. Reverting changes.");
    writeFileSync(fullPath, originalCode);
    return { success: false, summary: "Build failed after technical fix", data: null };
  }

  // -----------------------------------------------------------------------
  // 5. Commit and push
  // -----------------------------------------------------------------------
  const issueLabel = issueTypes.join(", ");
  const commitMsg = `[seo-auto] Fix technical: ${issueLabel} on ${action.targetPage}`;
  commitAndPush(commitMsg);
  console.log("  Committed and pushed.");

  markActionCompleted(context, action.id);

  // -----------------------------------------------------------------------
  // 6. Post to Discord
  // -----------------------------------------------------------------------
  try {
    await context.discord.post("seo", {
      content: `**Technical Fixer Agent**`,
      embeds: [{
        title: "Technical Issue Fixed",
        description: [
          `**Page:** ${action.targetPage}`,
          `**Issue type:** ${issueLabel}`,
          `**Details:** ${action.details}`,
          `**Reason:** ${action.reason}`,
        ].join("\n").substring(0, 4000),
        color: 3066993,
        timestamp: new Date().toISOString(),
      }],
    });
  } catch {}

  return {
    success: true,
    summary: `Fixed technical issue (${issueLabel}) on ${action.targetPage}`,
    data: {
      page: action.targetPage,
      issueTypes,
      file: srcFile,
    },
  };
}
