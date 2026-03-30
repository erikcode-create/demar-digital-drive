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
const MAX_CONCURRENT = 200;
const REQUEST_TIMEOUT = 10000;

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
 * Crawl a page and collect all links with their source page.
 */
async function crawlPageLinks(pageInfo) {
  const url = `${SITE_URL}${pageInfo.path}`;
  console.log(`  Crawling ${pageInfo.name} (${url})...`);

  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    const links = [];
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      // Skip anchors, mailto, tel, javascript
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      let fullUrl = href;
      if (href.startsWith("/")) {
        fullUrl = `${SITE_URL}${href}`;
      } else if (!href.startsWith("http")) {
        return; // skip relative or weird hrefs
      }

      links.push({
        url: fullUrl,
        sourcePage: pageInfo.path,
        sourcePageName: pageInfo.name,
        anchorText: $(el).text().trim().substring(0, 100),
      });
    });

    return links;
  } catch (err) {
    console.error(`  Failed to crawl ${pageInfo.name}: ${err.message}`);
    return [];
  }
}

/**
 * Simple concurrent queue for link checking.
 */
async function checkLinks(uniqueUrls) {
  const results = new Map();
  let completed = 0;
  const total = uniqueUrls.length;

  async function checkOne(url) {
    try {
      const res = await fetch(url, {
        method: "HEAD",
        redirect: "manual",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });

      const status = res.status;
      let category = "ok";

      if (status >= 200 && status < 300) {
        category = "ok";
      } else if (status === 301 || status === 302 || status === 307 || status === 308) {
        category = "redirect";
      } else if (status === 404 || status === 410) {
        category = "broken";
      } else if (status === 403) {
        // Many sites block HEAD requests, retry with GET
        try {
          const getRes = await fetch(url, {
            method: "GET",
            redirect: "follow",
            signal: AbortSignal.timeout(REQUEST_TIMEOUT),
          });
          category = getRes.ok ? "ok" : "broken";
        } catch {
          category = "error";
        }
      } else {
        category = "error";
      }

      const redirectUrl = category === "redirect" ? res.headers.get("location") || "" : "";

      results.set(url, { status, category, redirectUrl });
    } catch (err) {
      results.set(url, { status: 0, category: "error", error: err.message });
    }

    completed++;
    if (completed % 50 === 0 || completed === total) {
      console.log(`  Checked ${completed}/${total} links...`);
    }
  }

  // Process in batches of MAX_CONCURRENT
  for (let i = 0; i < uniqueUrls.length; i += MAX_CONCURRENT) {
    const batch = uniqueUrls.slice(i, i + MAX_CONCURRENT);
    await Promise.all(batch.map(checkOne));
  }

  return results;
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
 * Ask Claude for replacement URLs and apply fixes.
 */
async function fixBrokenLinks(brokenLinks) {
  if (brokenLinks.length === 0) return 0;

  const today = new Date().toISOString().slice(0, 10);
  const branchName = `seo-auto/broken-links-${today}`;
  createPRBranch(branchName);

  const brokenSummary = brokenLinks
    .slice(0, 20)
    .map((l) => `- ${l.url} (found on ${l.sourcePageName}, anchor: "${l.anchorText}")`)
    .join("\n");

  console.log("  Asking Claude for replacement suggestions...");
  const prompt = `These links on demartransportation.com are broken:
${brokenSummary}

For each, suggest either a replacement URL or recommend removing the link. Return ONLY a JSON array (no markdown fences):
[
  {
    "brokenUrl": "https://...",
    "action": "replace" | "remove",
    "replacementUrl": "https://..." | null,
    "reason": "why"
  }
]`;

  let suggestions = [];
  try {
    const output = await generateWithClaude(prompt, { model: "haiku" });
    const match = output.match(/\[[\s\S]*\]/);
    suggestions = match ? JSON.parse(match[0]) : [];
  } catch (err) {
    console.error(`  Failed to get replacement suggestions: ${err.message}`);
    cleanupBranch(branchName);
    return 0;
  }

  if (suggestions.length === 0) {
    cleanupBranch(branchName);
    return 0;
  }

  // Group broken links by source page
  const byPage = {};
  for (const link of brokenLinks) {
    const suggestion = suggestions.find((s) => s.brokenUrl === link.url);
    if (!suggestion) continue;
    if (!byPage[link.sourcePage]) byPage[link.sourcePage] = [];
    byPage[link.sourcePage].push({ ...link, ...suggestion });
  }

  let fixedCount = 0;
  for (const [pagePath, fixes] of Object.entries(byPage)) {
    const srcPath = pathToSourceFile(pagePath);

    const fixInstructions = fixes
      .map((f) =>
        f.action === "replace"
          ? `- Replace "${f.brokenUrl}" with "${f.replacementUrl}"`
          : `- Remove the link to "${f.brokenUrl}" (keep the anchor text as plain text)`
      )
      .join("\n");

    const fixPrompt = `Read the React component at ${srcPath} and fix these broken links:
${fixInstructions}

Only fix the specified links, don't change anything else.`;

    try {
      console.log(`  Fixing broken links in ${pagePath}...`);
      await generateWithClaude(fixPrompt, { model: "haiku", timeout: 120000 });
      fixedCount++;
    } catch (err) {
      console.error(`  Failed to fix links in ${pagePath}: ${err.message}`);
    }
  }

  if (!hasChanges()) {
    console.log("  No changes were made. Cleaning up branch.");
    cleanupBranch(branchName);
    return 0;
  }

  if (!buildSucceeds()) {
    console.log("  Build failed after broken link fixes. Reverting.");
    cleanupBranch(branchName);
    return 0;
  }

  const prBody = Object.entries(byPage)
    .flatMap(([, fixes]) =>
      fixes.map((f) =>
        f.action === "replace"
          ? `- Replaced \`${f.brokenUrl}\` with \`${f.replacementUrl}\``
          : `- Removed broken link: \`${f.brokenUrl}\``
      )
    )
    .join("\n");

  createPR(
    "[seo-auto] Fix broken links",
    `## Broken Link Fixes\n\nFixed broken links found during automated scan.\n\n${prBody}\n\n---\nGenerated by DeMar SEO Automation`,
    branchName
  );

  return fixedCount;
}

export default async function run() {
  console.log("=== Broken Link Fixer ===");
  console.log(`Crawling ${PAGES.length} pages for links...`);

  // Crawl all pages and collect links
  const allLinks = [];
  for (const page of PAGES) {
    const links = await crawlPageLinks(page);
    allLinks.push(...links);
  }

  console.log(`Found ${allLinks.length} total links.`);

  // Deduplicate URLs
  const uniqueUrls = [...new Set(allLinks.map((l) => l.url))];
  console.log(`Checking ${uniqueUrls.length} unique URLs...`);

  // Check all links
  const linkResults = await checkLinks(uniqueUrls);

  // Categorize results
  const okCount = [...linkResults.values()].filter((r) => r.category === "ok").length;
  const redirectCount = [...linkResults.values()].filter((r) => r.category === "redirect").length;
  const brokenCount = [...linkResults.values()].filter((r) => r.category === "broken").length;
  const errorCount = [...linkResults.values()].filter((r) => r.category === "error").length;

  console.log(`Results: ${okCount} OK, ${redirectCount} redirects, ${brokenCount} broken, ${errorCount} errors`);

  // Get details of broken links with their source pages
  const brokenLinks = allLinks.filter((l) => {
    const result = linkResults.get(l.url);
    return result && (result.category === "broken" || result.category === "error");
  });

  // Deduplicate broken links by URL (keep first occurrence)
  const seenBroken = new Set();
  const uniqueBrokenLinks = brokenLinks.filter((l) => {
    if (seenBroken.has(l.url)) return false;
    seenBroken.add(l.url);
    return true;
  });

  // Get redirect details
  const redirectDetails = [...linkResults.entries()]
    .filter(([, r]) => r.category === "redirect")
    .map(([url, r]) => ({ url, redirectTo: r.redirectUrl, status: r.status }));

  // Build Discord embed
  let desc = `**Total Links Checked:** ${uniqueUrls.length}\n`;
  desc += `✅ OK: ${okCount}\n`;
  desc += `↪️ Redirects: ${redirectCount}\n`;
  desc += `❌ Broken: ${brokenCount}\n`;
  desc += `⚠️ Errors/Timeouts: ${errorCount}\n\n`;

  if (uniqueBrokenLinks.length > 0) {
    desc += "**Broken Links:**\n";
    for (const link of uniqueBrokenLinks.slice(0, 10)) {
      const result = linkResults.get(link.url);
      desc += `- \`${link.url}\` (${result.status || "timeout"}) on ${link.sourcePageName}\n`;
    }
    if (uniqueBrokenLinks.length > 10) {
      desc += `...and ${uniqueBrokenLinks.length - 10} more\n`;
    }
    desc += "\n";
  }

  if (redirectDetails.length > 0) {
    desc += "**Redirects (should update):**\n";
    for (const r of redirectDetails.slice(0, 5)) {
      desc += `- ${r.status}: \`${r.url}\` -> \`${r.redirectTo}\`\n`;
    }
    if (redirectDetails.length > 5) {
      desc += `...and ${redirectDetails.length - 5} more\n`;
    }
  }

  const hasBroken = brokenCount > 0 || errorCount > 0;
  const status = brokenCount > 0 ? "fail" : errorCount > 0 ? "warn" : "pass";
  const color = status === "pass" ? 3066993 : status === "warn" ? 16776960 : 15158332;
  const statusEmoji = status === "pass" ? "✅" : status === "warn" ? "⚠️" : "❌";

  const embeds = [
    {
      title: `${statusEmoji} Broken Link Check`,
      description: desc.substring(0, 4000),
      color,
      timestamp: new Date().toISOString(),
    },
  ];

  // Fix broken links
  let fixCount = 0;
  if (hasBroken && uniqueBrokenLinks.length > 0 && process.env.ANTHROPIC_API_KEY) {
    console.log("Fixing broken links...");
    fixCount = await fixBrokenLinks(uniqueBrokenLinks);
  }

  if (fixCount > 0) {
    embeds.push({
      title: "🔧 Auto-Fix Applied",
      description: `Fixed broken links on ${fixCount} page(s). PR created for review.`,
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
    content: `**🔗 Broken Link Check — ${today}**\n${uniqueUrls.length} links checked · ${brokenCount} broken · ${redirectCount} redirects`,
    embeds: embeds.slice(0, 10),
  });

  console.log("Broken link check complete.");
  return { total: uniqueUrls.length, broken: brokenCount, redirects: redirectCount, fixCount };
}

run().catch(console.error);
