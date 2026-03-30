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

function extractBodyText($, limit = 200) {
  // Remove script/style content
  $("script, style, noscript").remove();
  const text = $("body").text().replace(/\s+/g, " ").trim();
  const words = text.split(" ");
  return words.slice(0, limit).join(" ");
}

async function crawlPageContent() {
  const results = [];
  for (const page of PAGES) {
    const url = `${SITE_URL}${page.path}`;
    console.log(`  Crawling ${page.name} (${url})...`);
    try {
      const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000) });
      const html = await res.text();
      const $ = cheerio.load(html);

      const title = $("title").text().trim();
      const h1 = $("h1").first().text().trim();
      const h2s = [];
      $("h2").each((_, el) => h2s.push($(el).text().trim()));
      const description = $('meta[name="description"]').attr("content") || "";
      const bodyText = extractBodyText($, 200);

      results.push({
        path: page.path,
        name: page.name,
        title,
        h1,
        h2s: h2s.slice(0, 10),
        description,
        openingText: bodyText,
      });
    } catch (err) {
      console.error(`  Failed to crawl ${page.name}: ${err.message}`);
      results.push({ path: page.path, name: page.name, error: err.message });
    }
  }
  return results;
}

async function analyzeCannibalization(pageData) {
  const validPages = pageData.filter((p) => !p.error);
  const report = validPages
    .map(
      (p) =>
        `Page: ${p.name} (${p.path})\n  Title: "${p.title}"\n  H1: "${p.h1}"\n  H2s: ${p.h2s.join(", ") || "none"}\n  Meta: "${p.description}"\n  Opening: "${p.openingText.substring(0, 300)}"`
    )
    .join("\n\n");

  const prompt = `You are an SEO keyword cannibalization specialist. Analyze these pages from DeMar Transportation's website. For each page, I'm providing the title, H1, H2s, meta description, and opening text. Identify any pairs of pages that appear to target the same primary keyword or topic. For each cannibalization pair: identify the primary keyword they compete for, recommend which page should own that keyword, and provide specific changes for the other page to differentiate (new title, new H1, adjusted opening paragraph focus). Return ONLY a JSON array (no markdown fences, no explanation) with objects: { "keyword": string, "page1": { "path": string, "name": string }, "page2": { "path": string, "name": string }, "owner": string (path of the page that should own the keyword), "otherPage": string (path of the page that needs changes), "changes": { "newTitle": string|null, "newH1": string|null, "newDescription": string|null, "focusShift": string (brief description of how to differentiate) } }. Only include actual cannibalization issues.

Here is the data:
${report}`;

  console.log("Sending page data to Claude for cannibalization analysis...");
  const output = await generateWithClaude(prompt, { model: "haiku" });
  const match = output.match(/\[[\s\S]*\]/);
  if (!match) {
    console.error("Could not parse Claude response as JSON array");
    return [];
  }
  return JSON.parse(match[0]);
}

async function applyFixes(issues) {
  if (!issues || issues.length === 0) return false;

  const today = new Date().toISOString().split("T")[0];
  const branchName = `seo-auto/keyword-dedup-${today}`;

  console.log(`Creating PR branch: ${branchName}`);
  createPRBranch(branchName);

  const fixInstructions = issues
    .map((issue, i) => {
      const parts = [
        `${i + 1}. Keyword: "${issue.keyword}"`,
        `   Owner page: ${issue.owner}`,
        `   Page to differentiate: ${issue.otherPage}`,
      ];
      if (issue.changes.newTitle) parts.push(`   New title: "${issue.changes.newTitle}"`);
      if (issue.changes.newH1) parts.push(`   New H1: "${issue.changes.newH1}"`);
      if (issue.changes.newDescription) parts.push(`   New description: "${issue.changes.newDescription}"`);
      parts.push(`   Focus shift: ${issue.changes.focusShift}`);
      return parts.join("\n");
    })
    .join("\n\n");

  const prompt = `You are editing the DeMar Transportation website (React/Vite/TypeScript SPA).

Fix these keyword cannibalization issues by updating the "page to differentiate" in each pair:
${fixInstructions}

Rules:
- Page components are in src/pages/
- Update document.title, H1 elements, meta descriptions, and opening paragraphs as specified
- Do NOT change any content on the "owner" pages
- Keep existing component structure and imports
- Do NOT use "direct carrier", "no middleman", or "no broker markup"
- Run \`npm run build\` and confirm it succeeds

Make the minimal changes needed to differentiate the pages.`;

  console.log("Invoking Claude to apply differentiation fixes...");
  await generateWithClaude(prompt, { model: "haiku", timeout: 600000 });

  if (!hasChanges()) {
    console.log("No changes detected after fix attempt. Cleaning up.");
    cleanupBranch(branchName);
    return false;
  }

  if (!buildSucceeds()) {
    console.log("Build failed after keyword fixes. Reverting.");
    cleanupBranch(branchName);
    return false;
  }

  const prBody = `## Keyword Cannibalization Fixes\n\n${issues.map((i) => `- **Keyword:** "${i.keyword}"\n  - Owner: ${i.owner}\n  - Differentiated: ${i.otherPage}\n  - Changes: ${i.changes.focusShift}`).join("\n")}\n\n---\nGenerated by DeMar SEO Automation`;

  createPR("[seo-auto] Keyword cannibalization fixes", prBody, branchName);
  console.log("PR created for keyword differentiation.");
  return true;
}

export default async function run() {
  console.log("=== Keyword Cannibalization Detector ===");
  console.log(`Crawling ${PAGES.length} pages...`);

  const pageData = await crawlPageContent();
  const issues = await analyzeCannibalization(pageData);

  console.log(`Found ${issues.length} cannibalization issue(s).`);

  // Build Discord embed
  const color = issues.length === 0 ? 3066993 : issues.length <= 3 ? 16776960 : 15158332;
  const status = issues.length === 0 ? "pass" : issues.length <= 3 ? "warn" : "fail";
  const statusEmoji = status === "pass" ? "\\u2705" : status === "warn" ? "\\u26a0\\ufe0f" : "\\u274c";

  let description = `**${issues.length} cannibalization pair(s)** detected across ${PAGES.length} pages.\n\n`;
  for (const issue of issues.slice(0, 10)) {
    description += `**Keyword:** "${issue.keyword}"\n`;
    description += `  ${issue.page1.name} vs ${issue.page2.name}\n`;
    description += `  Owner: ${issue.owner} | Differentiate: ${issue.otherPage}\n`;
    description += `  Fix: ${issue.changes.focusShift}\n\n`;
  }
  if (issues.length > 10) {
    description += `_...and ${issues.length - 10} more._\n`;
  }

  const embeds = [
    {
      title: `${statusEmoji} Keyword Cannibalization Audit`,
      description: description.substring(0, 4000),
      color,
      timestamp: new Date().toISOString(),
    },
  ];

  // Apply fixes if there are issues and we have API key
  let prCreated = false;
  if (issues.length > 0 && process.env.ANTHROPIC_API_KEY) {
    console.log("Applying keyword differentiation fixes...");
    prCreated = await applyFixes(issues);
    if (prCreated) {
      embeds.push({
        title: "PR Created",
        description: `Auto-PR created to fix ${issues.length} cannibalization issue(s).`,
        color: 3447003,
        timestamp: new Date().toISOString(),
      });
    }
  }

  await postToChannel("seo", {
    content: `**Keyword Cannibalization Audit -- ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}**`,
    embeds: embeds.slice(0, 10),
  });

  console.log("Keyword cannibalization audit complete.");
  return { issues: issues.length, prCreated };
}

run().catch(console.error);
