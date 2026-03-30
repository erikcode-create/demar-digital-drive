import "dotenv/config";
import * as cheerio from "cheerio";
import { postToChannel } from "../lib/discord.mjs";
import { generateWithClaude } from "../marketing/lib/claude-api.mjs";
import {
  hasChanges,
  buildSucceeds,
  createPRBranch,
  createPR,
  cleanupBranch,
} from "../marketing/lib/git-ops.mjs";

const SITE_URL = "https://demartransportation.com";

const PAGES = [
  { path: "/", name: "Homepage" },
  { path: "/about", name: "About" },
  { path: "/contact", name: "Contact" },
  { path: "/quote", name: "Quote Request" },
  { path: "/careers", name: "Careers" },
  { path: "/faq", name: "FAQ" },
  { path: "/services/dry-van", name: "Dry Van" },
  { path: "/services/reefer", name: "Reefer" },
  { path: "/services/flatbed", name: "Flatbed" },
  { path: "/services/box-truck", name: "Box Truck" },
  { path: "/services/sprinter-van", name: "Sprinter Van" },
  { path: "/services/hazmat", name: "Hazmat" },
  { path: "/services/ftl", name: "FTL" },
  { path: "/services/ltl", name: "LTL" },
  { path: "/services/3pl", name: "3PL" },
  { path: "/services/warehousing", name: "Warehousing" },
  { path: "/resources", name: "Resources Hub" },
  { path: "/resources/freight-shipping-cost", name: "Freight Shipping Cost" },
  { path: "/resources/how-to-get-freight-quote", name: "How to Get Quote" },
  { path: "/resources/how-to-choose-freight-carrier", name: "Choose Carrier" },
  { path: "/resources/dry-van-vs-reefer", name: "Dry Van vs Reefer" },
  { path: "/resources/ftl-vs-ltl", name: "FTL vs LTL" },
  { path: "/resources/hot-shot-vs-full-truckload", name: "Hot Shot vs FTL" },
  { path: "/resources/types-of-freight-trailers", name: "Trailer Types" },
  { path: "/resources/how-to-ship-freight", name: "How to Ship Freight" },
  { path: "/resources/how-to-ship-refrigerated-goods", name: "Ship Refrigerated" },
  { path: "/resources/how-to-ship-hazardous-materials", name: "Ship Hazmat" },
  { path: "/resources/oversized-load-shipping", name: "Oversized Loads" },
  { path: "/resources/freight-classes-explained", name: "Freight Classes" },
  { path: "/resources/broker-vs-carrier-vs-3pl", name: "Broker vs Carrier" },
  { path: "/resources/freight-shipping-glossary", name: "Glossary" },
  { path: "/resources/seasonal-freight-shipping", name: "Seasonal Shipping" },
  { path: "/blog", name: "Blog" },
  { path: "/blog/why-freight-quote-keeps-changing", name: "Why Quotes Change" },
  { path: "/blog/small-business-freight-shipping", name: "Small Business Freight" },
  { path: "/blog/emergency-expedited-freight", name: "Emergency Freight" },
  { path: "/blog/freight-damage-prevention", name: "Freight Damage" },
  { path: "/blog/ecommerce-freight-shipping", name: "E-commerce Freight" },
];

// Focus on content pages for freshness auditing
const CONTENT_PAGES = PAGES.filter(
  (p) =>
    p.path.startsWith("/resources") ||
    p.path.startsWith("/blog") ||
    p.path.startsWith("/services") ||
    p.path === "/faq"
);

/**
 * Fetch a page and extract its text content.
 */
async function crawlPageText(pageInfo) {
  const url = `${SITE_URL}${pageInfo.path}`;
  console.log(`  Crawling ${pageInfo.name} (${url})...`);

  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    // Remove non-content elements
    $("script, style, nav, footer, header").remove();
    const text = $("body").text().replace(/\s+/g, " ").trim();

    return { page: pageInfo, text: text.substring(0, 4000) };
  } catch (err) {
    console.error(`  Failed to crawl ${pageInfo.name}: ${err.message}`);
    return { page: pageInfo, text: "" };
  }
}

/**
 * Ask Claude to audit content freshness.
 */
async function auditFreshness(crawlResult) {
  if (!crawlResult.text) return { page: crawlResult.page, issues: [] };

  const currentYear = new Date().getFullYear();

  console.log(`  Auditing freshness of ${crawlResult.page.name}...`);

  const prompt = `You are a content freshness auditor for a freight carrier website. The current year is ${currentYear}. Analyze this content from "${crawlResult.page.name}". Flag any:
- Outdated year references (anything before ${currentYear - 1})
- Stale pricing/rate data
- Outdated statistics
- References to "this year" or "recently" that may be stale
- Any factual claims that may have changed

For each issue, provide: the outdated text, why it's stale, and a suggested updated replacement. Return ONLY a JSON array (no markdown fences):
[
  {
    "outdatedText": "exact text that is stale",
    "reason": "why it's outdated",
    "suggestedReplacement": "updated text",
    "severity": "high" | "medium" | "low"
  }
]

If the content appears fresh and up-to-date, return an empty array [].

Page content:
${crawlResult.text}`;

  try {
    const output = await generateWithClaude(prompt, { model: "haiku" });
    const match = output.match(/\[[\s\S]*\]/);
    const issues = match ? JSON.parse(match[0]) : [];
    return { page: crawlResult.page, issues };
  } catch (err) {
    console.error(`  Failed to audit ${crawlResult.page.name}: ${err.message}`);
    return { page: crawlResult.page, issues: [] };
  }
}

/**
 * Map URL path to source file.
 */
function pathToSourceFile(urlPath) {
  if (urlPath === "/") return "src/pages/Index.tsx";
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

/**
 * Apply freshness fixes via Claude Code.
 */
async function applyFreshnessFixes(allResults) {
  const withIssues = allResults.filter((r) => r.issues.length > 0);
  if (withIssues.length === 0) return 0;

  const today = new Date().toISOString().slice(0, 10);
  const branchName = `seo-auto/content-freshness-${today}`;
  createPRBranch(branchName);

  let fixedCount = 0;

  for (const result of withIssues) {
    const srcPath = pathToSourceFile(result.page.path);

    // Only auto-fix high and medium severity items
    const fixableIssues = result.issues.filter(
      (i) => i.severity === "high" || i.severity === "medium"
    );
    if (fixableIssues.length === 0) continue;

    const replacements = fixableIssues
      .map(
        (i) =>
          `- Replace "${i.outdatedText.substring(0, 150)}" with "${i.suggestedReplacement.substring(0, 150)}" (reason: ${i.reason})`
      )
      .join("\n");

    const fixPrompt = `Read the React component at ${srcPath} and update the following stale content:
${replacements}

Rules:
- Only update the specified text, don't change anything else
- Keep the same tone and formatting
- Do NOT change pricing, legal content, business model claims, or contact info
- If the exact text isn't found, skip that replacement`;

    try {
      console.log(`  Updating content in ${result.page.name}...`);
      await generateWithClaude(fixPrompt, { model: "haiku", timeout: 120000 });
      fixedCount++;
    } catch (err) {
      console.error(`  Failed to update ${result.page.name}: ${err.message}`);
    }
  }

  if (!hasChanges()) {
    console.log("  No changes were made. Cleaning up branch.");
    cleanupBranch(branchName);
    return 0;
  }

  if (!buildSucceeds()) {
    console.log("  Build failed after freshness updates. Reverting.");
    cleanupBranch(branchName);
    return 0;
  }

  const prBody = withIssues
    .flatMap((r) =>
      r.issues
        .filter((i) => i.severity === "high" || i.severity === "medium")
        .map((i) => `- **${r.page.name}:** ${i.reason}`)
    )
    .slice(0, 20)
    .join("\n");

  createPR(
    "[seo-auto] Content freshness updates",
    `## Content Freshness Updates\n\nUpdated stale content flagged by automated freshness audit.\n\n${prBody}\n\n---\nGenerated by DeMar SEO Automation`,
    branchName
  );

  return fixedCount;
}

export default async function run() {
  console.log("=== Content Freshness Audit ===");
  console.log(`Auditing ${CONTENT_PAGES.length} content pages...`);

  // Crawl all content pages
  const crawlResults = [];
  for (const page of CONTENT_PAGES) {
    const result = await crawlPageText(page);
    crawlResults.push(result);
  }

  // Audit each page for freshness
  console.log("Analyzing content freshness...");
  const allResults = [];
  for (const result of crawlResults) {
    if (result.text) {
      const audit = await auditFreshness(result);
      allResults.push(audit);
    }
  }

  // Summarize findings
  const totalIssues = allResults.reduce((sum, r) => sum + r.issues.length, 0);
  const highSeverity = allResults.reduce(
    (sum, r) => sum + r.issues.filter((i) => i.severity === "high").length,
    0
  );
  const medSeverity = allResults.reduce(
    (sum, r) => sum + r.issues.filter((i) => i.severity === "medium").length,
    0
  );
  const lowSeverity = allResults.reduce(
    (sum, r) => sum + r.issues.filter((i) => i.severity === "low").length,
    0
  );

  const freshPages = allResults.filter((r) => r.issues.length === 0).length;
  const stalePages = allResults.filter((r) => r.issues.length > 0).length;

  // Build Discord embed
  let desc = `**Pages Audited:** ${CONTENT_PAGES.length}\n`;
  desc += `✅ Fresh: ${freshPages} pages\n`;
  desc += `⚠️ Stale: ${stalePages} pages\n\n`;
  desc += `**Issues Found:** ${totalIssues}\n`;
  desc += `🔴 High: ${highSeverity} · 🟡 Medium: ${medSeverity} · 🟢 Low: ${lowSeverity}\n\n`;

  for (const result of allResults) {
    if (result.issues.length === 0) continue;
    desc += `**${result.page.name}** (${result.issues.length} issues):\n`;
    for (const issue of result.issues.slice(0, 3)) {
      const icon = issue.severity === "high" ? "🔴" : issue.severity === "medium" ? "🟡" : "🟢";
      desc += `${icon} ${issue.reason}\n`;
    }
    if (result.issues.length > 3) {
      desc += `...and ${result.issues.length - 3} more\n`;
    }
    desc += "\n";
  }

  const status = highSeverity > 0 ? "fail" : stalePages > 0 ? "warn" : "pass";
  const color = status === "pass" ? 3066993 : status === "warn" ? 16776960 : 15158332;
  const statusEmoji = status === "pass" ? "✅" : status === "warn" ? "⚠️" : "❌";

  const embeds = [
    {
      title: `${statusEmoji} Content Freshness Audit`,
      description: desc.substring(0, 4000),
      color,
      timestamp: new Date().toISOString(),
    },
  ];

  // Apply fixes
  let fixCount = 0;
  if (totalIssues > 0 && process.env.ANTHROPIC_API_KEY) {
    console.log("Applying content freshness updates...");
    fixCount = await applyFreshnessFixes(allResults);
  }

  if (fixCount > 0) {
    embeds.push({
      title: "🔧 Auto-Fix Applied",
      description: `Updated content on ${fixCount} page(s). PR created for review.`,
      color: 3066993,
      timestamp: new Date().toISOString(),
    });
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  await postToChannel("seo", {
    content: `**📅 Content Freshness Audit — ${today}**\n${CONTENT_PAGES.length} pages audited · ${freshPages} fresh · ${stalePages} stale · ${totalIssues} issues found`,
    embeds: embeds.slice(0, 10),
  });

  console.log("Content freshness audit complete.");
  return { totalIssues, highSeverity, fixCount };
}

run().catch(console.error);
