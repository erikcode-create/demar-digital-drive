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

/**
 * Fetch a page and extract all internal links.
 */
async function crawlPage(pageInfo) {
  const url = `${SITE_URL}${pageInfo.path}`;
  console.log(`  Crawling ${pageInfo.name} (${url})...`);

  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    const internalLinks = new Set();
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      // Normalize internal links
      if (href.startsWith("/") && !href.startsWith("//")) {
        internalLinks.add(href.split("?")[0].split("#")[0].replace(/\/$/, "") || "/");
      } else if (href.startsWith(SITE_URL)) {
        const path = new URL(href).pathname.replace(/\/$/, "") || "/";
        internalLinks.add(path);
      }
    });

    return { page: pageInfo, links: [...internalLinks] };
  } catch (err) {
    console.error(`  Failed to crawl ${pageInfo.name}: ${err.message}`);
    return { page: pageInfo, links: [] };
  }
}

/**
 * Build link matrix and get Claude suggestions.
 */
async function analyzeLinkMatrix(crawlResults) {
  const matrix = {};
  for (const result of crawlResults) {
    matrix[result.page.path] = {
      name: result.page.name,
      linksTo: result.links,
      linkCount: result.links.length,
    };
  }

  // Identify internal-only links (links to known pages)
  const knownPaths = new Set(PAGES.map((p) => p.path));
  const internalMatrix = {};
  for (const [pagePath, data] of Object.entries(matrix)) {
    const internalLinksToKnown = data.linksTo.filter((l) => knownPaths.has(l));
    internalMatrix[pagePath] = {
      name: data.name,
      linksTo: internalLinksToKnown,
      count: internalLinksToKnown.length,
    };
  }

  const matrixSummary = Object.entries(internalMatrix)
    .map(([path, data]) => `${data.name} (${path}): ${data.count} internal links -> [${data.linksTo.join(", ")}]`)
    .join("\n");

  console.log("  Sending link matrix to Claude for analysis...");

  const prompt = `You are an SEO internal linking specialist for DeMar Transportation, a US freight carrier. Here is the current internal link matrix for our site. Each page should have 3-5 relevant internal links. Identify pages that are under-linked (fewer than 3 internal links) and suggest specific new links. For each suggestion, provide: source page path, target page path, suggested anchor text, and which section of the source page it should go in. Focus on topically relevant connections. Return JSON array of suggestions.

Current link matrix:
${matrixSummary}

Return ONLY a JSON array (no markdown fences) with this structure:
[
  {
    "sourcePath": "/services/dry-van",
    "targetPath": "/resources/dry-van-vs-reefer",
    "anchorText": "Compare dry van vs reefer shipping",
    "section": "content body or related links"
  }
]

Limit to the top 10 most impactful suggestions.`;

  const output = await generateWithClaude(prompt, { model: "haiku" });
  const match = output.match(/\[[\s\S]*\]/);
  return {
    suggestions: match ? JSON.parse(match[0]) : [],
    matrix: internalMatrix,
  };
}

/**
 * Apply link suggestions via Claude Code.
 */
async function applyLinkFixes(suggestions) {
  if (!suggestions || suggestions.length === 0) return 0;

  const today = new Date().toISOString().slice(0, 10);
  const branchName = `seo-auto/internal-links-${today}`;
  createPRBranch(branchName);

  let appliedCount = 0;

  for (const suggestion of suggestions.slice(0, 5)) {
    // Map path to source file
    const srcPath = pathToSourceFile(suggestion.sourcePath);
    if (!srcPath) continue;

    const fixPrompt = `Read the React component at ${srcPath} and add an internal link to ${suggestion.targetPath} with anchor text '${suggestion.anchorText}' in the ${suggestion.section} section. Use React Router Link component. Only add the link, don't change anything else. If a suitable location cannot be found, make no changes.`;

    try {
      console.log(`  Applying link: ${suggestion.sourcePath} -> ${suggestion.targetPath}...`);
      await generateWithClaude(fixPrompt, { model: "haiku", timeout: 120000 });
      appliedCount++;
    } catch (err) {
      console.error(`  Failed to apply link fix: ${err.message}`);
    }
  }

  if (!hasChanges()) {
    console.log("  No changes were made. Cleaning up branch.");
    cleanupBranch(branchName);
    return 0;
  }

  if (!buildSucceeds()) {
    console.log("  Build failed after link additions. Reverting.");
    cleanupBranch(branchName);
    return 0;
  }

  const prBody = suggestions
    .slice(0, 5)
    .map((s) => `- **${s.sourcePath}** -> ${s.targetPath}: "${s.anchorText}"`)
    .join("\n");

  createPR(
    "[seo-auto] Internal link optimization",
    `## Internal Link Optimization\n\nAdded internal links to improve site connectivity and SEO.\n\n${prBody}\n\n---\nGenerated by DeMar SEO Automation`,
    branchName
  );

  return appliedCount;
}

/**
 * Map a URL path to a source file path.
 */
function pathToSourceFile(urlPath) {
  if (urlPath === "/") return "src/pages/Index.tsx";
  // Convert /services/dry-van -> src/pages/services/DryVan.tsx (approximate)
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

export default async function run() {
  console.log("=== Internal Link Optimizer ===");
  console.log(`Crawling ${PAGES.length} pages...`);

  // Crawl all pages
  const crawlResults = [];
  for (const page of PAGES) {
    const result = await crawlPage(page);
    crawlResults.push(result);
  }

  console.log("Analyzing link matrix...");
  const { suggestions, matrix } = await analyzeLinkMatrix(crawlResults);

  // Build Discord embed
  const underLinked = Object.entries(matrix)
    .filter(([, data]) => data.count < 3)
    .sort((a, b) => a[1].count - b[1].count);

  let linkCountSummary = "**Link Counts:**\n";
  for (const [path, data] of Object.entries(matrix)) {
    const indicator = data.count < 3 ? "🔴" : data.count <= 5 ? "🟡" : "🟢";
    linkCountSummary += `${indicator} ${data.name}: ${data.count} links\n`;
  }

  let desc = linkCountSummary.substring(0, 2000);

  if (underLinked.length > 0) {
    desc += `\n**Under-linked Pages (< 3 links):** ${underLinked.length}\n`;
  }

  if (suggestions.length > 0) {
    desc += "\n**Top Suggested Links:**\n";
    for (const s of suggestions.slice(0, 5)) {
      desc += `- ${s.sourcePath} -> ${s.targetPath}: "${s.anchorText}"\n`;
    }
  }

  const status = underLinked.length > 5 ? "fail" : underLinked.length > 0 ? "warn" : "pass";
  const color = status === "pass" ? 3066993 : status === "warn" ? 16776960 : 15158332;
  const statusEmoji = status === "pass" ? "✅" : status === "warn" ? "⚠️" : "❌";

  const embeds = [
    {
      title: `${statusEmoji} Internal Link Audit`,
      description: desc.substring(0, 4000),
      color,
      timestamp: new Date().toISOString(),
    },
  ];

  // Apply fixes if we have suggestions and API key
  let fixCount = 0;
  if (suggestions.length > 0 && process.env.ANTHROPIC_API_KEY) {
    console.log("Applying internal link suggestions...");
    fixCount = await applyLinkFixes(suggestions);
  }

  if (fixCount > 0) {
    embeds.push({
      title: "🔧 Auto-Fix Applied",
      description: `Added ${fixCount} internal link(s). PR created for review.`,
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
    content: `**🔗 Internal Link Optimization — ${today}**\n${PAGES.length} pages analyzed · ${underLinked.length} under-linked · ${suggestions.length} suggestions`,
    embeds: embeds.slice(0, 10),
  });

  console.log("Internal link optimization complete.");
  return { suggestions, underLinked: underLinked.length, fixCount };
}

run().catch(console.error);
