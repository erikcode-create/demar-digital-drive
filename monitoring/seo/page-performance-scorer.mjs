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
  { path: "/", name: "Homepage", type: "core" },
  { path: "/about", name: "About", type: "core" },
  { path: "/contact", name: "Contact", type: "core" },
  { path: "/quote", name: "Quote Request", type: "core" },
  { path: "/careers", name: "Careers", type: "core" },
  { path: "/faq", name: "FAQ", type: "core" },
  { path: "/services/dry-van", name: "Dry Van", type: "service" },
  { path: "/services/reefer", name: "Reefer", type: "service" },
  { path: "/services/flatbed", name: "Flatbed", type: "service" },
  { path: "/services/box-truck", name: "Box Truck", type: "service" },
  { path: "/services/sprinter-van", name: "Sprinter Van", type: "service" },
  { path: "/services/hazmat", name: "Hazmat", type: "service" },
  { path: "/services/ftl", name: "FTL", type: "service" },
  { path: "/services/ltl", name: "LTL", type: "service" },
  { path: "/services/3pl", name: "3PL", type: "service" },
  { path: "/services/warehousing", name: "Warehousing", type: "service" },
  { path: "/resources", name: "Resources Hub", type: "resource" },
  { path: "/resources/freight-shipping-cost", name: "Freight Shipping Cost", type: "resource" },
  { path: "/resources/how-to-get-freight-quote", name: "How to Get Quote", type: "resource" },
  { path: "/resources/how-to-choose-freight-carrier", name: "Choose Carrier", type: "resource" },
  { path: "/resources/dry-van-vs-reefer", name: "Dry Van vs Reefer", type: "resource" },
  { path: "/resources/ftl-vs-ltl", name: "FTL vs LTL", type: "resource" },
  { path: "/resources/hot-shot-vs-full-truckload", name: "Hot Shot vs FTL", type: "resource" },
  { path: "/resources/types-of-freight-trailers", name: "Trailer Types", type: "resource" },
  { path: "/resources/how-to-ship-freight", name: "How to Ship Freight", type: "resource" },
  { path: "/resources/how-to-ship-refrigerated-goods", name: "Ship Refrigerated", type: "resource" },
  { path: "/resources/how-to-ship-hazardous-materials", name: "Ship Hazmat", type: "resource" },
  { path: "/resources/oversized-load-shipping", name: "Oversized Loads", type: "resource" },
  { path: "/resources/freight-classes-explained", name: "Freight Classes", type: "resource" },
  { path: "/resources/broker-vs-carrier-vs-3pl", name: "Broker vs Carrier", type: "resource" },
  { path: "/resources/freight-shipping-glossary", name: "Glossary", type: "resource" },
  { path: "/resources/seasonal-freight-shipping", name: "Seasonal Shipping", type: "resource" },
  { path: "/blog", name: "Blog", type: "blog" },
  { path: "/blog/why-freight-quote-keeps-changing", name: "Why Quotes Change", type: "blog" },
  { path: "/blog/small-business-freight-shipping", name: "Small Business Freight", type: "blog" },
  { path: "/blog/emergency-expedited-freight", name: "Emergency Freight", type: "blog" },
  { path: "/blog/freight-damage-prevention", name: "Freight Damage", type: "blog" },
  { path: "/blog/ecommerce-freight-shipping", name: "E-commerce Freight", type: "blog" },
];

function countWords($) {
  $("script, style, noscript").remove();
  const text = $("body").text().replace(/\s+/g, " ").trim();
  return text.split(" ").filter((w) => w.length > 0).length;
}

function scoreWordCount(wordCount, pageType) {
  const threshold = pageType === "blog" || pageType === "resource" ? 1500 : 500;
  if (wordCount >= threshold) return 25;
  if (wordCount >= threshold * 0.6) return 15;
  if (wordCount >= threshold * 0.3) return 8;
  return 0;
}

function scoreHeadings(h1Count, h2Count, h3Count) {
  let score = 0;
  if (h1Count === 1) score += 5; // Exactly one H1
  else if (h1Count > 1) score += 2; // Multiple H1s is bad but at least they exist
  if (h2Count >= 2) score += 5;
  else if (h2Count === 1) score += 3;
  if (h3Count >= 1) score += 5;
  else if (h2Count >= 3) score += 3; // H2s compensate for missing H3s
  return score;
}

function scoreInternalLinks(count) {
  if (count >= 3) return 20;
  if (count >= 2) return 14;
  if (count >= 1) return 8;
  return 0;
}

function scoreSchema(hasSchema) {
  return hasSchema ? 15 : 0;
}

function scoreMetaTags(titleLen, descLen) {
  let score = 0;
  if (titleLen >= 50 && titleLen <= 60) score += 8;
  else if (titleLen >= 30 && titleLen <= 70) score += 5;
  else if (titleLen > 0) score += 2;

  if (descLen >= 120 && descLen <= 155) score += 7;
  else if (descLen >= 80 && descLen <= 170) score += 4;
  else if (descLen > 0) score += 2;

  return score;
}

function scoreCTA($) {
  const bodyText = $("body").text().toLowerCase();
  const ctaKeywords = ["get a quote", "request a quote", "contact us", "call now", "get started", "request quote"];
  const links = [];
  $("a").each((_, el) => {
    const href = ($(el).attr("href") || "").toLowerCase();
    links.push(href);
  });
  const hasCtaText = ctaKeywords.some((kw) => bodyText.includes(kw));
  const hasCtaLink = links.some((href) => href.includes("quote") || href.includes("contact") || href.includes("tel:"));
  if (hasCtaText && hasCtaLink) return 10;
  if (hasCtaText || hasCtaLink) return 5;
  return 0;
}

async function crawlAndScore() {
  const results = [];
  for (const page of PAGES) {
    const url = `${SITE_URL}${page.path}`;
    console.log(`  Scoring ${page.name} (${url})...`);
    try {
      const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000) });
      const html = await res.text();
      const $ = cheerio.load(html);

      // Extract metrics
      const wordCount = countWords(cheerio.load(html)); // fresh $ since countWords modifies DOM
      const h1Count = $("h1").length;
      const h2Count = $("h2").length;
      const h3Count = $("h3").length;

      const internalLinks = [];
      const externalLinks = [];
      $("a[href]").each((_, el) => {
        const href = $(el).attr("href") || "";
        if (href.startsWith("/") || href.includes("demartransportation.com")) {
          internalLinks.push(href);
        } else if (href.startsWith("http")) {
          externalLinks.push(href);
        }
      });

      const hasSchema = $('script[type="application/ld+json"]').length > 0;
      const title = $("title").text().trim();
      const description = $('meta[name="description"]').attr("content") || "";
      const hasFAQ = $("body").text().toLowerCase().includes("frequently asked") || $("body").text().toLowerCase().includes("faq");

      // Calculate scores
      const wordScore = scoreWordCount(wordCount, page.type);
      const headingScore = scoreHeadings(h1Count, h2Count, h3Count);
      const linkScore = scoreInternalLinks(internalLinks.length);
      const schemaScore = scoreSchema(hasSchema);
      const metaScore = scoreMetaTags(title.length, description.length);
      const ctaScore = scoreCTA($);
      const totalScore = wordScore + headingScore + linkScore + schemaScore + metaScore + ctaScore;

      results.push({
        path: page.path,
        name: page.name,
        type: page.type,
        score: totalScore,
        breakdown: {
          wordCount: { score: wordScore, value: wordCount },
          headings: { score: headingScore, h1: h1Count, h2: h2Count, h3: h3Count },
          internalLinks: { score: linkScore, count: internalLinks.length },
          schema: { score: schemaScore, present: hasSchema },
          meta: { score: metaScore, titleLen: title.length, descLen: description.length },
          cta: { score: ctaScore },
        },
      });
    } catch (err) {
      console.error(`  Failed to score ${page.name}: ${err.message}`);
      results.push({
        path: page.path,
        name: page.name,
        type: page.type,
        score: 0,
        error: err.message,
        breakdown: null,
      });
    }
  }
  return results.sort((a, b) => b.score - a.score);
}

async function getRecommendations(scores) {
  const scoreReport = scores
    .map((s) => {
      if (s.error) return `${s.name} (${s.path}): ERROR - ${s.error}`;
      const b = s.breakdown;
      return `${s.name} (${s.path}): ${s.score}/100 [words:${b.wordCount.value}(${b.wordCount.score}/25), headings:h1=${b.headings.h1}/h2=${b.headings.h2}/h3=${b.headings.h3}(${b.headings.score}/15), links:${b.internalLinks.count}(${b.internalLinks.score}/20), schema:${b.schema.present ? "yes" : "no"}(${b.schema.score}/15), meta:t${b.meta.titleLen}/d${b.meta.descLen}(${b.meta.score}/15), cta:(${b.cta.score}/10)]`;
    })
    .join("\n");

  const prompt = `Here are the SEO performance scores for each page on DeMar Transportation's website. Identify the 5 weakest pages and provide specific, actionable improvement recommendations for each. Focus on quick wins that can be implemented in the source code (adding schema markup, improving meta tags, adding internal links, adding CTAs). Return ONLY a JSON array (no markdown fences, no explanation) with objects: { "path": string, "name": string, "currentScore": number, "recommendations": [{ "action": string, "expectedScoreGain": number }] }. Only include the 5 weakest pages.

${scoreReport}`;

  console.log("Sending scores to Claude for recommendations...");
  const output = await generateWithClaude(prompt, { model: "haiku" });
  const match = output.match(/\[[\s\S]*\]/);
  if (!match) {
    console.error("Could not parse Claude response as JSON array");
    return [];
  }
  return JSON.parse(match[0]);
}

async function applyFixes(recommendations) {
  if (!recommendations || recommendations.length === 0) return false;

  const today = new Date().toISOString().split("T")[0];
  const branchName = `seo-auto/page-scores-${today}`;

  console.log(`Creating PR branch: ${branchName}`);
  createPRBranch(branchName);

  const fixInstructions = recommendations
    .map((rec, i) => {
      const actions = rec.recommendations.map((r) => `   - ${r.action}`).join("\n");
      return `${i + 1}. ${rec.name} (${rec.path}) -- current score: ${rec.currentScore}/100\n${actions}`;
    })
    .join("\n\n");

  const prompt = `You are editing the DeMar Transportation website (React/Vite/TypeScript SPA).

Apply these SEO improvements to the 5 weakest pages:
${fixInstructions}

Rules:
- Page components are in src/pages/
- For schema markup, add JSON-LD scripts in useEffect or Helmet
- For internal links, add relevant links to other service/resource pages
- For CTAs, add "Get a Quote" or "Contact Us" links pointing to /quote or /contact
- Do NOT change pricing, legal content, or business claims
- Do NOT use "direct carrier", "no middleman", or "no broker markup"
- Keep existing component structure and imports
- Run \`npm run build\` and confirm it succeeds

Make the minimal changes needed for maximum score improvement.`;

  console.log("Invoking Claude to apply quick-win fixes...");
  await generateWithClaude(prompt, { model: "haiku", timeout: 600000 });

  if (!hasChanges()) {
    console.log("No changes detected after fix attempt. Cleaning up.");
    cleanupBranch(branchName);
    return false;
  }

  if (!buildSucceeds()) {
    console.log("Build failed after page score fixes. Reverting.");
    cleanupBranch(branchName);
    return false;
  }

  const prBody = `## SEO Page Performance Improvements\n\nImproved the 5 weakest-scoring pages:\n\n${recommendations.map((r) => `- **${r.name}** (${r.currentScore}/100): ${r.recommendations.map((a) => a.action).join("; ")}`).join("\n")}\n\n---\nGenerated by DeMar SEO Automation`;

  createPR("[seo-auto] Page performance improvements", prBody, branchName);
  console.log("PR created for page performance fixes.");
  return true;
}

export default async function run() {
  console.log("=== Page Performance Scorer ===");
  console.log(`Scoring ${PAGES.length} pages...`);

  const scores = await crawlAndScore();
  const avgScore = Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length);

  console.log(`Average score: ${avgScore}/100`);

  // Get AI recommendations for bottom 5
  const recommendations = await getRecommendations(scores);

  // Build Discord embeds
  const overallStatus = avgScore >= 70 ? "pass" : avgScore >= 50 ? "warn" : "fail";
  const color = overallStatus === "pass" ? 3066993 : overallStatus === "warn" ? 16776960 : 15158332;
  const statusEmoji = overallStatus === "pass" ? "\\u2705" : overallStatus === "warn" ? "\\u26a0\\ufe0f" : "\\u274c";

  // Top 10 pages
  const top10 = scores.slice(0, 10);
  let topDesc = "**Top 10 Pages:**\n";
  for (const s of top10) {
    const bar = s.score >= 70 ? "\\ud83d\\udfe2" : s.score >= 50 ? "\\ud83d\\udfe1" : "\\ud83d\\udd34";
    topDesc += `${bar} **${s.score}** - ${s.name} (${s.path})\n`;
  }

  // Bottom 10 pages
  const bottom10 = [...scores].reverse().slice(0, 10);
  let bottomDesc = "**Bottom 10 Pages:**\n";
  for (const s of bottom10) {
    const bar = s.score >= 70 ? "\\ud83d\\udfe2" : s.score >= 50 ? "\\ud83d\\udfe1" : "\\ud83d\\udd34";
    bottomDesc += `${bar} **${s.score}** - ${s.name} (${s.path})\n`;
  }

  const embeds = [
    {
      title: `${statusEmoji} SEO Page Performance Scorecard`,
      description: `**Average Score: ${avgScore}/100** across ${PAGES.length} pages\n\nScoring: Words (25) + Headings (15) + Internal Links (20) + Schema (15) + Meta Tags (15) + CTA (10)\n\n${topDesc}`.substring(0, 4000),
      color,
      timestamp: new Date().toISOString(),
    },
    {
      title: "Weakest Pages",
      description: bottomDesc.substring(0, 4000),
      color: 15158332,
      timestamp: new Date().toISOString(),
    },
  ];

  // Add recommendations embed
  if (recommendations.length > 0) {
    let recDesc = "";
    for (const rec of recommendations) {
      recDesc += `**${rec.name}** (${rec.currentScore}/100):\n`;
      for (const r of rec.recommendations) {
        recDesc += `  - ${r.action} (+${r.expectedScoreGain}pts)\n`;
      }
      recDesc += "\n";
    }
    embeds.push({
      title: "AI Recommendations (Bottom 5)",
      description: recDesc.substring(0, 4000),
      color: 3447003,
      timestamp: new Date().toISOString(),
    });
  }

  // Apply fixes
  let prCreated = false;
  if (recommendations.length > 0 && process.env.ANTHROPIC_API_KEY) {
    console.log("Applying quick-win fixes for bottom 5 pages...");
    prCreated = await applyFixes(recommendations);
    if (prCreated) {
      embeds.push({
        title: "PR Created",
        description: `Auto-PR created with improvements for ${recommendations.length} weakest pages.`,
        color: 3447003,
        timestamp: new Date().toISOString(),
      });
    }
  }

  await postToChannel("seo", {
    content: `**SEO Page Performance Scorecard -- ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}**\nAverage score: **${avgScore}/100** across ${PAGES.length} pages`,
    embeds: embeds.slice(0, 10),
  });

  console.log("Page performance scorecard posted to Discord.");
  return { avgScore, prCreated, pageCount: PAGES.length };
}

run().catch(console.error);
