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

// Only analyze resource and blog pages for external link opportunities
const CONTENT_PAGES = PAGES.filter(
  (p) => p.path.startsWith("/resources") || p.path.startsWith("/blog")
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

    // Remove script/style elements
    $("script, style, nav, footer, header").remove();
    const text = $("body").text().replace(/\s+/g, " ").trim();

    // Also count existing external links
    const externalLinks = [];
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      if (href.startsWith("http") && !href.includes("demartransportation.com")) {
        externalLinks.push(href);
      }
    });

    return { page: pageInfo, text: text.substring(0, 3000), externalLinks };
  } catch (err) {
    console.error(`  Failed to crawl ${pageInfo.name}: ${err.message}`);
    return { page: pageInfo, text: "", externalLinks: [] };
  }
}

/**
 * Ask Claude to identify claims needing external citations.
 */
async function analyzePageForCitations(crawlResult) {
  if (!crawlResult.text) return { page: crawlResult.page, suggestions: [] };

  console.log(`  Analyzing ${crawlResult.page.name} for citation opportunities...`);

  const prompt = `You are an SEO specialist. Analyze this content from "${crawlResult.page.name}" on a freight carrier's website. Identify 2-3 specific claims, statistics, or industry facts that should cite authoritative external sources (FMCSA, DOT, Bureau of Transportation Statistics, ATRI, ATA, industry publications). For each, provide: the claim text, a suggested authoritative URL to link to, and the anchor text. Only suggest real, well-known authoritative sources. Return ONLY a JSON array (no markdown fences):

[
  {
    "claimText": "the specific claim needing a citation",
    "suggestedUrl": "https://...",
    "anchorText": "descriptive anchor text",
    "source": "FMCSA / DOT / etc"
  }
]

Page content:
${crawlResult.text}

If there are no suitable claims to cite, return an empty array [].`;

  try {
    const output = await generateWithClaude(prompt, { model: "haiku" });
    const match = output.match(/\[[\s\S]*\]/);
    const suggestions = match ? JSON.parse(match[0]) : [];
    return { page: crawlResult.page, suggestions };
  } catch (err) {
    console.error(`  Failed to analyze ${crawlResult.page.name}: ${err.message}`);
    return { page: crawlResult.page, suggestions: [] };
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
 * Apply external link suggestions via Claude Code.
 */
async function applyExternalLinks(allSuggestions) {
  const withSuggestions = allSuggestions.filter((s) => s.suggestions.length > 0);
  if (withSuggestions.length === 0) return 0;

  const today = new Date().toISOString().slice(0, 10);
  const branchName = `seo-auto/external-links-${today}`;
  createPRBranch(branchName);

  let appliedCount = 0;

  for (const result of withSuggestions.slice(0, 5)) {
    const srcPath = pathToSourceFile(result.page.path);

    const linksToAdd = result.suggestions
      .slice(0, 2)
      .map(
        (s) =>
          `- Add external link to "${s.suggestedUrl}" with anchor text "${s.anchorText}" near the claim: "${s.claimText.substring(0, 100)}"`
      )
      .join("\n");

    const fixPrompt = `Read the React component at ${srcPath} and add external citation links. Use <a href="..." target="_blank" rel="noopener noreferrer"> tags (not React Router Link). Only add the links, don't change any other content.

Links to add:
${linksToAdd}

If a suitable location cannot be found for a link, skip it.`;

    try {
      console.log(`  Adding external links to ${result.page.name}...`);
      await generateWithClaude(fixPrompt, { model: "haiku", timeout: 120000 });
      appliedCount++;
    } catch (err) {
      console.error(`  Failed to add links to ${result.page.name}: ${err.message}`);
    }
  }

  if (!hasChanges()) {
    console.log("  No changes were made. Cleaning up branch.");
    cleanupBranch(branchName);
    return 0;
  }

  if (!buildSucceeds()) {
    console.log("  Build failed after external link additions. Reverting.");
    cleanupBranch(branchName);
    return 0;
  }

  const prBody = withSuggestions
    .slice(0, 5)
    .flatMap((r) =>
      r.suggestions.slice(0, 2).map((s) => `- **${r.page.name}:** [${s.anchorText}](${s.suggestedUrl})`)
    )
    .join("\n");

  createPR(
    "[seo-auto] External link enrichment",
    `## External Link Enrichment\n\nAdded authoritative external citations to improve E-E-A-T signals.\n\n${prBody}\n\n---\nGenerated by DeMar SEO Automation`,
    branchName
  );

  return appliedCount;
}

export default async function run() {
  console.log("=== External Link Enrichment ===");
  console.log(`Analyzing ${CONTENT_PAGES.length} content pages...`);

  // Crawl all content pages
  const crawlResults = [];
  for (const page of CONTENT_PAGES) {
    const result = await crawlPageText(page);
    crawlResults.push(result);
  }

  // Analyze each page for citation opportunities
  console.log("Identifying citation opportunities...");
  const allSuggestions = [];
  for (const result of crawlResults) {
    if (result.text) {
      const analysis = await analyzePageForCitations(result);
      allSuggestions.push(analysis);
    }
  }

  // Count existing external links
  const totalExisting = crawlResults.reduce((sum, r) => sum + r.externalLinks.length, 0);
  const totalSuggestions = allSuggestions.reduce((sum, r) => sum + r.suggestions.length, 0);

  // Build Discord embed
  let desc = `**Existing External Links:** ${totalExisting} across ${CONTENT_PAGES.length} pages\n`;
  desc += `**New Citation Opportunities:** ${totalSuggestions}\n\n`;

  for (const result of allSuggestions) {
    if (result.suggestions.length === 0) continue;
    desc += `**${result.page.name}:**\n`;
    for (const s of result.suggestions) {
      desc += `- "${s.claimText.substring(0, 80)}..." -> [${s.source}](${s.suggestedUrl})\n`;
    }
    desc += "\n";
  }

  const status = totalSuggestions > 10 ? "warn" : totalSuggestions > 0 ? "pass" : "pass";
  const color = status === "pass" ? 3066993 : status === "warn" ? 16776960 : 15158332;
  const statusEmoji = status === "pass" ? "✅" : "⚠️";

  const embeds = [
    {
      title: `${statusEmoji} External Link Enrichment`,
      description: desc.substring(0, 4000),
      color,
      timestamp: new Date().toISOString(),
    },
  ];

  // Apply fixes
  let fixCount = 0;
  if (totalSuggestions > 0 && process.env.ANTHROPIC_API_KEY) {
    console.log("Adding external citation links...");
    fixCount = await applyExternalLinks(allSuggestions);
  }

  if (fixCount > 0) {
    embeds.push({
      title: "🔧 Auto-Fix Applied",
      description: `Added external citations to ${fixCount} page(s). PR created for review.`,
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
    content: `**📚 External Link Enrichment — ${today}**\n${CONTENT_PAGES.length} pages analyzed · ${totalExisting} existing external links · ${totalSuggestions} new suggestions`,
    embeds: embeds.slice(0, 10),
  });

  console.log("External link enrichment complete.");
  return { totalSuggestions, fixCount };
}

run().catch(console.error);
