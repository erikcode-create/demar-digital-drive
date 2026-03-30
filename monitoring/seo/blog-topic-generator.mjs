import "dotenv/config";
import * as cheerio from "cheerio";
import { postToChannel } from "../lib/discord.mjs";
import { generateWithClaude } from "../marketing/lib/claude-api.mjs";

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

async function crawlTitlesAndH1s() {
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

      results.push({ path: page.path, name: page.name, title, h1 });
    } catch (err) {
      console.error(`  Failed to crawl ${page.name}: ${err.message}`);
      results.push({ path: page.path, name: page.name, title: page.name, h1: "" });
    }
  }
  return results;
}

async function generateTopics(existingContent) {
  const titleList = existingContent
    .map((p) => `- ${p.title || p.name} (${p.path})`)
    .join("\n");

  const prompt = `You are a content strategist for DeMar Transportation, a US freight carrier (dry van, reefer, flatbed, hazmat, FTL, LTL, 3PL, warehousing) based in Reno NV. Here are all existing page titles on the site:
${titleList}

The site already has 15 resource guides and 5 blog posts. Suggest the next 5 blog post topics that would: target long-tail keywords with commercial intent, fill content gaps not covered by existing pages, attract shippers who need freight services, be different enough from existing content to avoid keyword cannibalization. For each topic provide: suggested title, target keyword, estimated search intent (informational/commercial/transactional), why it would drive leads, and 3 suggested H2 subheadings. Return ONLY a JSON array (no markdown fences, no explanation) with objects: { "title": string, "targetKeyword": string, "searchIntent": "informational"|"commercial"|"transactional", "leadDriverReason": string, "h2Subheadings": [string, string, string] }.`;

  console.log("Sending content data to Claude for topic generation...");
  const output = await generateWithClaude(prompt, { model: "haiku" });
  const match = output.match(/\[[\s\S]*\]/);
  if (!match) {
    console.error("Could not parse Claude response as JSON array");
    return [];
  }
  return JSON.parse(match[0]);
}

export default async function run() {
  console.log("=== Blog Topic Generator ===");
  console.log(`Crawling ${PAGES.length} pages for existing content...`);

  const existingContent = await crawlTitlesAndH1s();
  const topics = await generateTopics(existingContent);

  console.log(`Generated ${topics.length} blog topic suggestion(s).`);

  if (topics.length === 0) {
    console.log("No topics generated. Skipping Discord post.");
    return { topics: 0 };
  }

  // Build Discord embed
  const intentEmoji = {
    informational: "\\ud83d\\udcd6",
    commercial: "\\ud83d\\udcb0",
    transactional: "\\ud83d\\udee0\\ufe0f",
  };

  let description = "";
  for (let i = 0; i < topics.length; i++) {
    const t = topics[i];
    const emoji = intentEmoji[t.searchIntent] || "\\ud83d\\udcdd";
    description += `**${i + 1}. ${t.title}**\n`;
    description += `  Keyword: \`${t.targetKeyword}\`\n`;
    description += `  Intent: ${t.searchIntent} ${emoji}\n`;
    description += `  Why: ${t.leadDriverReason}\n`;
    description += `  H2s: ${t.h2Subheadings.join(" | ")}\n\n`;
  }

  const embeds = [
    {
      title: "\\ud83d\\udcdd Blog Topic Suggestions",
      description: description.substring(0, 4000),
      color: 3447003,
      timestamp: new Date().toISOString(),
    },
  ];

  await postToChannel("seo", {
    content: `**Blog Topic Generator -- ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}**\n${topics.length} new topic suggestions based on content gap analysis.`,
    embeds: embeds.slice(0, 10),
  });

  console.log("Blog topic suggestions posted to Discord.");
  return { topics: topics.length };
}

run().catch(console.error);
