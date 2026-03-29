import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";
import { buildEmbed, postToChannel } from "../lib/discord.mjs";
import { generateWithClaude } from "./lib/claude-api.mjs";
import { hasChanges, buildSucceeds, createPRBranch, createPR, cleanupBranch } from "./lib/git-ops.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = "https://demartransportation.com";

const PAGES = [
  { path: "/", name: "Homepage" },
  { path: "/about", name: "About" },
  { path: "/contact", name: "Contact" },
  { path: "/quote", name: "Quote Request" },
  { path: "/services/dry-van", name: "Dry Van" },
  { path: "/services/reefer", name: "Reefer" },
  { path: "/services/flatbed", name: "Flatbed" },
  { path: "/services/box-truck", name: "Box Truck" },
  { path: "/services/sprinter-van", name: "Sprinter Van" },
  { path: "/services/hazmat", name: "Hazmat" },
  { path: "/services/ftl", name: "FTL Shipping" },
  { path: "/services/ltl", name: "LTL Shipping" },
  { path: "/services/3pl", name: "3PL Logistics" },
  { path: "/services/warehousing", name: "Warehousing" },
  { path: "/faq", name: "FAQ" },
  { path: "/careers", name: "Careers" },
];

async function auditPage(pageInfo) {
  const url = `${SITE_URL}${pageInfo.path}`;
  console.log(`  Auditing ${pageInfo.name} (${url})...`);

  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000) });
    const html = await res.text();
    const $ = cheerio.load(html);

    const checks = [];

    // Check: CTA presence
    const ctaKeywords = ["get a quote", "request a quote", "contact us", "call now", "get started", "learn more", "request quote"];
    const bodyText = $("body").text().toLowerCase();
    const hasCTA = ctaKeywords.some(kw => bodyText.includes(kw));
    checks.push({
      name: `${pageInfo.name}: CTA Presence`,
      status: hasCTA ? "pass" : "fail",
      detail: hasCTA ? "Page contains call-to-action" : "No clear CTA found in page content",
      confidence: "INFERRED",
      reason: "Checked static HTML only; React-rendered CTAs may exist at runtime",
    });

    // Check: Phone number visible
    const hasPhone = bodyText.includes("775") || bodyText.includes("(775)");
    checks.push({
      name: `${pageInfo.name}: Phone Number`,
      status: hasPhone ? "pass" : "warn",
      detail: hasPhone ? "Phone number found" : "Phone number not visible in static HTML",
      confidence: "INFERRED",
      reason: "Checked static HTML; may be rendered by React at runtime",
    });

    // Check: Meta title
    const title = $("title").text();
    const titleLength = title.length;
    checks.push({
      name: `${pageInfo.name}: Meta Title`,
      status: titleLength > 10 && titleLength <= 60 ? "pass" : titleLength > 0 ? "warn" : "fail",
      detail: `Title: "${title}" (${titleLength} chars)`,
      confidence: "VERIFIED",
    });

    // Check: Meta description
    const metaDesc = $('meta[name="description"]').attr("content") || "";
    checks.push({
      name: `${pageInfo.name}: Meta Description`,
      status: metaDesc.length >= 120 && metaDesc.length <= 160 ? "pass" : metaDesc.length > 0 ? "warn" : "fail",
      detail: metaDesc.length > 0 ? `Description: ${metaDesc.length} chars` : "No meta description",
      confidence: "VERIFIED",
    });

    // Check: Schema markup
    const schemas = $('script[type="application/ld+json"]');
    checks.push({
      name: `${pageInfo.name}: Schema Markup`,
      status: schemas.length > 0 ? "pass" : "warn",
      detail: schemas.length > 0 ? `${schemas.length} JSON-LD block(s) found` : "No JSON-LD schema markup",
      confidence: "VERIFIED",
    });

    return checks;
  } catch (err) {
    return [{
      name: `${pageInfo.name}: Page Load`,
      status: "fail",
      detail: `Failed to load: ${err.message}`,
      confidence: "VERIFIED",
    }];
  }
}

async function generateCRORecommendations(allChecks) {
  const failingChecks = allChecks.filter(c => c.status !== "pass");
  if (failingChecks.length === 0) return null;

  const summary = failingChecks.map(c => `- ${c.name}: ${c.detail}`).join("\n");

  const brandKit = JSON.parse(fs.readFileSync(path.join(__dirname, "brand-kit.json"), "utf-8"));

  const prompt = `You are a CRO specialist for ${brandKit.company.name}, a freight transportation company.

Brand voice: ${brandKit.voice.tone.join(", ")}
Services: ${brandKit.company.services.join(", ")}
NEVER say: ${brandKit.voice.dontSay.join(", ")}

The following CRO issues were found on the website:
${summary}

For each issue, provide a specific, actionable fix. Focus on the top 5 most impactful fixes.

Return your response as a JSON array (no markdown fences):
[
  {
    "page": "<page name>",
    "issue": "<what's wrong>",
    "fix": "<specific fix>",
    "impact": "high|medium|low",
    "autoFixable": true/false
  }
]`;

  try {
    const output = await generateWithClaude(prompt, { model: "sonnet" });
    const match = output.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : null;
  } catch (err) {
    console.error("Failed to generate recommendations:", err.message);
    return null;
  }
}

async function applyAutoFixes(recommendations) {
  if (!recommendations) return 0;

  const autoFixable = recommendations.filter(r => r.autoFixable && r.impact === "high");
  if (autoFixable.length === 0) return 0;

  const branchName = `marketing/cro-fixes-${Date.now()}`;
  createPRBranch(branchName);

  const fixPrompt = `You are fixing CRO issues on the DeMar Transportation website (React/Vite/TypeScript SPA).

Apply these high-impact fixes:
${autoFixable.map((f, i) => `${i + 1}. Page: ${f.page} — Issue: ${f.issue} — Fix: ${f.fix}`).join("\n")}

Rules:
- Edit files in src/pages/ and src/components/
- Do NOT use "direct carrier", "no middleman", or "no broker markup"
- Keep existing component structure
- Use existing imports and patterns
- Run \`npm run build\` and confirm it succeeds

Make the minimal changes needed.`;

  await generateWithClaude(fixPrompt, { model: "sonnet", timeout: 600000 });

  if (!hasChanges()) {
    cleanupBranch(branchName);
    return 0;
  }

  if (!buildSucceeds()) {
    console.log("Build failed after CRO fixes. Reverting.");
    cleanupBranch(branchName);
    return 0;
  }

  createPR(
    "[marketing-auto] CRO improvements",
    `## CRO Auto-Fix\n\n${autoFixable.map(f => `- **${f.page}:** ${f.fix}`).join("\n")}\n\n---\nGenerated by DeMar Marketing Automation`,
    branchName
  );

  return autoFixable.length;
}

async function main() {
  if (!process.env.DISCORD_CRO_WEBHOOK_URL) {
    console.error("DISCORD_CRO_WEBHOOK_URL not set.");
    process.exit(1);
  }

  console.log("Running CRO audit...");
  const allChecks = [];

  for (const page of PAGES) {
    const checks = await auditPage(page);
    allChecks.push(...checks);
  }

  const scorable = allChecks.filter(c => c.confidence !== "UNABLE_TO_VERIFY");
  const passCount = scorable.filter(c => c.status === "pass").length;
  const score = Math.round((passCount / scorable.length) * 100);
  const status = scorable.some(c => c.status === "fail") ? "fail" : scorable.some(c => c.status === "warn") ? "warn" : "pass";

  console.log("Generating CRO recommendations...");
  const recommendations = await generateCRORecommendations(allChecks);

  let fixCount = 0;
  if (recommendations && process.env.ANTHROPIC_API_KEY) {
    console.log("Applying auto-fixes...");
    fixCount = await applyAutoFixes(recommendations);
  }

  const result = { category: "CRO Audit", status, score, checks: allChecks };
  const embed = buildEmbed(result);

  let recText = "";
  if (recommendations && recommendations.length > 0) {
    recText = "\n\n**Top Recommendations:**\n" + recommendations.slice(0, 5).map(r =>
      `${r.impact === "high" ? "🔴" : r.impact === "medium" ? "🟡" : "🟢"} **${r.page}:** ${r.fix}`
    ).join("\n");
  }
  if (fixCount > 0) {
    recText += `\n\n🔧 **${fixCount} auto-fix(es) applied** — PR created for review.`;
  }

  const embeds = [embed];
  if (recText) {
    embeds.push({
      title: "📊 AI Recommendations",
      description: recText.trim().substring(0, 4000),
      color: 3447003,
      timestamp: new Date().toISOString(),
    });
  }

  const counts = { pass: 0, warn: 0, fail: 0 };
  for (const c of scorable) counts[c.status]++;
  const parts = [];
  if (counts.pass > 0) parts.push(`✅ ${counts.pass} passed`);
  if (counts.warn > 0) parts.push(`⚠️ ${counts.warn} warnings`);
  if (counts.fail > 0) parts.push(`❌ ${counts.fail} critical`);

  await postToChannel("cro", {
    content: `**📈 Daily CRO Audit — ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}**\nOverall score: **${score}/100** · ${parts.join(" · ")}`,
    embeds: embeds.slice(0, 10),
  });

  console.log("CRO audit posted to Discord.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
