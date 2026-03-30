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

async function crawlMetaTags() {
  const results = [];
  for (const page of PAGES) {
    const url = `${SITE_URL}${page.path}`;
    console.log(`  Crawling ${page.name} (${url})...`);
    try {
      const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000) });
      const html = await res.text();
      const $ = cheerio.load(html);

      const title = $("title").text().trim();
      const description = $('meta[name="description"]').attr("content") || "";

      results.push({
        path: page.path,
        name: page.name,
        title,
        titleLength: title.length,
        description,
        descriptionLength: description.length,
      });
    } catch (err) {
      console.error(`  Failed to crawl ${page.name}: ${err.message}`);
      results.push({
        path: page.path,
        name: page.name,
        title: "",
        titleLength: 0,
        description: "",
        descriptionLength: 0,
        error: err.message,
      });
    }
  }
  return results;
}

async function analyzeMetaTags(metaData) {
  const report = metaData
    .map(
      (m) =>
        `Page: ${m.name} (${m.path})\n  Title (${m.titleLength} chars): "${m.title}"\n  Description (${m.descriptionLength} chars): "${m.description}"`
    )
    .join("\n\n");

  const prompt = `You are an SEO meta tag specialist for DeMar Transportation, a US freight carrier. Analyze these title tags and meta descriptions. For each page, evaluate: title length (ideal 50-60 chars), description length (ideal 120-155 chars), keyword presence, uniqueness across pages, click-through appeal. Flag any that are too long, too short, missing keywords, or duplicated. For flagged pages, provide improved title and/or description. Return ONLY a JSON array (no markdown fences, no explanation) with objects: { "path": string, "issue": string, "currentTitle": string, "suggestedTitle": string|null, "currentDescription": string, "suggestedDescription": string|null }. Only include pages that have issues.

Here is the data:
${report}`;

  console.log("Sending meta tag data to Claude for analysis...");
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
  const branchName = `seo-auto/meta-tags-${today}`;

  console.log(`Creating PR branch: ${branchName}`);
  createPRBranch(branchName);

  const fixInstructions = issues
    .map((issue, i) => {
      const parts = [`${i + 1}. Page: ${issue.path} (${issue.issue})`];
      if (issue.suggestedTitle) parts.push(`   New title: "${issue.suggestedTitle}"`);
      if (issue.suggestedDescription) parts.push(`   New description: "${issue.suggestedDescription}"`);
      return parts.join("\n");
    })
    .join("\n");

  const prompt = `You are editing the DeMar Transportation website (React/Vite/TypeScript SPA).

Update meta tags for these pages:
${fixInstructions}

Rules:
- Pages set meta tags via useEffect in their page components under src/pages/
- Look for document.title assignments and meta description updates
- For index.html, update tags directly
- Keep existing component structure
- Do NOT change any content other than title tags and meta descriptions
- Run \`npm run build\` and confirm it succeeds

Make the minimal changes needed.`;

  console.log("Invoking Claude to apply meta tag fixes...");
  await generateWithClaude(prompt, { model: "haiku", timeout: 600000 });

  if (!hasChanges()) {
    console.log("No changes detected after fix attempt. Cleaning up.");
    cleanupBranch(branchName);
    return false;
  }

  if (!buildSucceeds()) {
    console.log("Build failed after meta tag fixes. Reverting.");
    cleanupBranch(branchName);
    return false;
  }

  const prBody = `## SEO Meta Tag Optimization\n\n${issues.map((i) => `- **${i.path}:** ${i.issue}${i.suggestedTitle ? `\n  - Title: "${i.suggestedTitle}"` : ""}${i.suggestedDescription ? `\n  - Description: "${i.suggestedDescription}"` : ""}`).join("\n")}\n\n---\nGenerated by DeMar SEO Automation`;

  createPR("[seo-auto] Meta tag optimization", prBody, branchName);
  console.log("PR created for meta tag fixes.");
  return true;
}

export default async function run() {
  console.log("=== Meta Tag Optimizer ===");
  console.log(`Crawling ${PAGES.length} pages...`);

  const metaData = await crawlMetaTags();
  const issues = await analyzeMetaTags(metaData);

  console.log(`Found ${issues.length} meta tag issue(s).`);

  // Post to Discord
  const color = issues.length === 0 ? 3066993 : issues.length <= 5 ? 16776960 : 15158332;
  const status = issues.length === 0 ? "pass" : issues.length <= 5 ? "warn" : "fail";
  const statusEmoji = status === "pass" ? "\\u2705" : status === "warn" ? "\\u26a0\\ufe0f" : "\\u274c";

  let description = `**${issues.length} issue(s)** found across ${PAGES.length} pages.\n\n`;
  for (const issue of issues.slice(0, 15)) {
    description += `**${issue.path}** - ${issue.issue}\n`;
    if (issue.suggestedTitle) description += `  Title: "${issue.suggestedTitle}"\n`;
    if (issue.suggestedDescription) description += `  Desc: "${issue.suggestedDescription.substring(0, 80)}..."\n`;
    description += "\n";
  }
  if (issues.length > 15) {
    description += `_...and ${issues.length - 15} more._\n`;
  }

  const embeds = [
    {
      title: `${statusEmoji} Meta Tag Audit`,
      description: description.substring(0, 4000),
      color,
      timestamp: new Date().toISOString(),
    },
  ];

  // Apply fixes if there are issues and we have API key
  let prCreated = false;
  if (issues.length > 0 && process.env.ANTHROPIC_API_KEY) {
    console.log("Applying meta tag fixes...");
    prCreated = await applyFixes(issues);
    if (prCreated) {
      embeds.push({
        title: "PR Created",
        description: `Auto-PR created to fix ${issues.length} meta tag issue(s).`,
        color: 3447003,
        timestamp: new Date().toISOString(),
      });
    }
  }

  await postToChannel("seo", {
    content: `**Meta Tag Optimizer -- ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}**`,
    embeds: embeds.slice(0, 10),
  });

  console.log("Meta tag optimizer complete.");
  return { issues: issues.length, prCreated };
}

run().catch(console.error);
