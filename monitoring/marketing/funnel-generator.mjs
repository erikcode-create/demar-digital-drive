import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { postToChannel } from "../lib/discord.mjs";
import { generateWithClaude } from "./lib/claude-api.mjs";
import { hasChanges, buildSucceeds, createPRBranch, createPR, cleanupBranch } from "./lib/git-ops.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const SITE_URL = "https://demartransportation.com";

const SERVICE_PAGES = [
  { slug: "dry-van", name: "Dry Van", file: "DryVan.tsx" },
  { slug: "reefer", name: "Reefer", file: "Reefer.tsx" },
  { slug: "flatbed", name: "Flatbed", file: "Flatbed.tsx" },
  { slug: "box-truck", name: "Box Truck", file: "BoxTruck.tsx" },
  { slug: "sprinter-van", name: "Sprinter Van", file: "SprinterVan.tsx" },
  { slug: "hazmat", name: "Hazmat", file: "Hazmat.tsx" },
  { slug: "ftl", name: "FTL Shipping", file: "FTL.tsx" },
  { slug: "ltl", name: "LTL Shipping", file: "LTL.tsx" },
  { slug: "3pl", name: "3PL Logistics", file: "ThirdPartyLogistics.tsx" },
  { slug: "warehousing", name: "Warehousing", file: "Warehousing.tsx" },
];

async function checkPageFreshness(slug) {
  const url = `${SITE_URL}/services/${slug}`;
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000) });
    if (res.status !== 200) return { exists: false, status: res.status };
    const html = await res.text();
    return { exists: true, contentLength: html.length, status: 200 };
  } catch (err) {
    return { exists: false, error: err.message };
  }
}

async function identifyLandingPageGaps(brandKit) {
  const prompt = `You are a marketing strategist for ${brandKit.company.name}, a freight transportation company.

Current service pages: ${SERVICE_PAGES.map(s => s.name).join(", ")}

Services offered: ${brandKit.company.services.join(", ")}
Differentiators: ${brandKit.company.differentiators.join(", ")}

Identify up to 3 high-value landing pages that DON'T exist yet but SHOULD. Think about:
- Industry-specific pages (e.g., "Pharmaceutical Shipping", "Automotive Parts Logistics")
- Geography-specific pages (e.g., "Freight Shipping from Reno NV")
- Use-case pages (e.g., "Emergency Freight Services", "Seasonal Shipping Solutions")

IMPORTANT: Only suggest pages that would drive real leads for a freight company.
Do NOT suggest pages for services they don't offer.

Return ONLY valid JSON (no markdown fences):
[
  {
    "slug": "<url-slug>",
    "title": "<page title>",
    "description": "<what this landing page covers>",
    "targetKeywords": ["<3-5 SEO keywords>"],
    "priority": "high|medium"
  }
]`;

  const output = await generateWithClaude(prompt, { model: "sonnet" });
  const match = output.match(/\[[\s\S]*\]/);
  return match ? JSON.parse(match[0]) : [];
}

async function generateLandingPage(pageSpec, brandKit) {
  const prompt = `Create a React component for a new landing page for ${brandKit.company.name}.

Page: ${pageSpec.title}
Slug: /services/${pageSpec.slug}
Description: ${pageSpec.description}
Target keywords: ${pageSpec.targetKeywords.join(", ")}

Brand voice: ${brandKit.voice.tone.join(", ")}
NEVER say: ${brandKit.voice.dontSay.join(", ")}
Company: ${brandKit.company.name}, ${brandKit.company.address}, ${brandKit.company.phone}

Follow this exact pattern from existing service pages:
- Import Header and Footer components from @/components
- Use useEffect to set document.title and meta description
- Include JSON-LD schema (Service type)
- Include a hero section, content sections (800-1200 words), and a CTA section linking to /quote
- Use Tailwind CSS classes matching existing pages
- Export default the component

Return ONLY the complete TypeScript React component code (no markdown fences, no explanations).`;

  return await generateWithClaude(prompt, { model: "opus", timeout: 600000 });
}

async function main() {
  if (!process.env.DISCORD_FUNNELS_WEBHOOK_URL) {
    console.error("DISCORD_FUNNELS_WEBHOOK_URL not set.");
    process.exit(1);
  }

  const brandKit = JSON.parse(fs.readFileSync(path.join(__dirname, "brand-kit.json"), "utf-8"));
  console.log("Running funnel generator...");

  console.log("Checking existing page freshness...");
  const freshnessResults = [];
  for (const page of SERVICE_PAGES) {
    const result = await checkPageFreshness(page.slug);
    freshnessResults.push({ ...page, ...result });
    console.log(`  ${page.name}: ${result.exists ? "OK" : "MISSING"} (${result.status || "error"})`);
  }

  const missingPages = freshnessResults.filter(p => !p.exists);

  console.log("Identifying landing page opportunities...");
  const gaps = await identifyLandingPageGaps(brandKit);
  console.log(`  Found ${gaps.length} landing page opportunities`);

  let generatedPage = null;
  const highPriorityGaps = gaps.filter(g => g.priority === "high");
  const pageToGenerate = highPriorityGaps[0] || gaps[0];

  if (pageToGenerate) {
    console.log(`Generating landing page: ${pageToGenerate.title}...`);
    const branchName = `marketing/landing-page-${pageToGenerate.slug}-${Date.now()}`;
    createPRBranch(branchName);

    try {
      const componentCode = await generateLandingPage(pageToGenerate, brandKit);

      const componentName = pageToGenerate.slug
        .split("-")
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join("");
      const filePath = path.join(REPO_ROOT, `src/pages/services/${componentName}.tsx`);

      const cleanCode = componentCode.replace(/^```\w*\n?/, "").replace(/\n?```$/, "");
      fs.writeFileSync(filePath, cleanCode);

      if (hasChanges() && buildSucceeds()) {
        createPR(
          `[marketing] Add ${pageToGenerate.title} landing page`,
          `## New Landing Page\n\n**Page:** ${pageToGenerate.title}\n**Route:** /services/${pageToGenerate.slug}\n**Keywords:** ${pageToGenerate.targetKeywords.join(", ")}\n\n${pageToGenerate.description}\n\n---\nGenerated by DeMar Marketing Automation`,
          branchName
        );
        generatedPage = pageToGenerate;
      } else {
        console.log("Build failed or no changes. Cleaning up.");
        cleanupBranch(branchName);
      }
    } catch (err) {
      console.error(`Failed to generate page: ${err.message}`);
      cleanupBranch(branchName);
    }
  }

  const embeds = [];

  const existingCount = freshnessResults.filter(p => p.exists).length;
  embeds.push({
    title: "📄 Landing Page Freshness",
    description: `**${existingCount}/${SERVICE_PAGES.length}** service pages active\n\n` +
      freshnessResults.map(p => `${p.exists ? "✅" : "❌"} ${p.name}`).join("\n"),
    color: missingPages.length > 0 ? 16776960 : 3066993,
    timestamp: new Date().toISOString(),
  });

  if (gaps.length > 0) {
    embeds.push({
      title: "🎯 Landing Page Opportunities",
      description: gaps.map(g =>
        `${g.priority === "high" ? "🔴" : "🟡"} **${g.title}**\n${g.description}\nKeywords: ${g.targetKeywords.join(", ")}`
      ).join("\n\n"),
      color: 3447003,
      timestamp: new Date().toISOString(),
    });
  }

  if (generatedPage) {
    embeds.push({
      title: "🚀 New Landing Page Generated",
      description: `**${generatedPage.title}**\nRoute: \`/services/${generatedPage.slug}\`\nPR created for review.`,
      color: 3066993,
      timestamp: new Date().toISOString(),
    });
  }

  await postToChannel("funnels", {
    content: `**🔄 Daily Funnel Report — ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}**`,
    embeds: embeds.slice(0, 10),
  });

  console.log("Funnel report posted to Discord.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
