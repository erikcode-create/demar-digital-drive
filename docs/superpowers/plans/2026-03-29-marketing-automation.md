# Marketing Automation System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Claude Code into an autonomous marketing manager with daily CRO audits, funnel/landing page generation, and LinkedIn social media content — all posting to dedicated Discord channels via GitHub Actions.

**Architecture:** Three independent GitHub Actions workflows (CRO, Funnels, Social Media) running daily on staggered schedules, each executing a dedicated script in `monitoring/marketing/`. All scripts consume a brand kit JSON file for consistency. New Discord channels are added by extending the existing `postToChannel()` pattern in `monitoring/lib/discord.mjs`. Claude API (Anthropic) powers content generation and analysis. Auto-PRs follow the existing `auto-fix.mjs` tier pattern.

**Tech Stack:** Node.js (ESM), GitHub Actions, Anthropic Claude API (`@anthropic-ai/claude-code` CLI), Discord webhooks, cheerio (HTML parsing), nano-banana MCP (image generation)

**Spec:** `docs/superpowers/specs/2026-03-29-marketing-automation-design.md`

---

## File Structure

### New Files

| File | Responsibility |
|------|---------------|
| `monitoring/marketing/brand-kit-builder.mjs` | Scrapes live site, extracts brand elements, generates brand kit files |
| `monitoring/marketing/brand-kit.json` | Machine-readable brand identity (colors, fonts, voice, company info) |
| `monitoring/marketing/brand-kit.html` | Visual brand reference for human review |
| `monitoring/marketing/cro-audit.mjs` | CRO scanner — crawls pages, scores conversions, generates fix PRs |
| `monitoring/marketing/funnel-generator.mjs` | Landing page freshness/coverage checker and generator |
| `monitoring/marketing/social-generator.mjs` | LinkedIn post + image + companion landing page generator |
| `monitoring/marketing/lib/claude-api.mjs` | Shared Claude API invocation helper (extracted from auto-fix pattern) |
| `monitoring/marketing/lib/git-ops.mjs` | Shared git operations (commit, branch, PR creation) |
| `.github/workflows/marketing-cro.yml` | Daily CRO audit workflow (10am PDT) |
| `.github/workflows/marketing-funnels.yml` | Daily funnel generation workflow (11am PDT) |
| `.github/workflows/marketing-social.yml` | Daily social media workflow (12pm PDT) |

### Modified Files

| File | Change |
|------|--------|
| `monitoring/lib/discord.mjs` | Add `cro`, `funnels`, `social` channel keys to `postToChannel()` |
| `monitoring/.env.example` | Add 3 new webhook URL entries |
| `monitoring/package.json` | Add npm scripts for marketing commands |

---

## Task 1: Extend Discord Integration with New Channels

**Files:**
- Modify: `monitoring/lib/discord.mjs:83-93`
- Modify: `monitoring/.env.example`

- [ ] **Step 1: Add new channel keys to `postToChannel()`**

In `monitoring/lib/discord.mjs`, update the `urls` object inside `postToChannel()`:

```javascript
// Channel-aware posting
export async function postToChannel(channel, payload) {
  const urls = {
    health: process.env.DISCORD_WEBHOOK_URL,
    content: process.env.DISCORD_CONTENT_WEBHOOK_URL,
    seo: process.env.DISCORD_SEO_WEBHOOK_URL,
    cro: process.env.DISCORD_CRO_WEBHOOK_URL,
    funnels: process.env.DISCORD_FUNNELS_WEBHOOK_URL,
    social: process.env.DISCORD_SOCIAL_WEBHOOK_URL,
  };
  const webhookUrl = urls[channel];
  if (!webhookUrl) {
    console.error(`No webhook URL for channel "${channel}". Set the corresponding DISCORD_*_WEBHOOK_URL env var.`);
    return;
  }
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Discord webhook failed for ${channel} (${res.status}): ${text}`);
  }
}
```

- [ ] **Step 2: Update `.env.example`**

Replace the contents of `monitoring/.env.example`:

```
# Website Health channel
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN

# Content & Copywriting channel
DISCORD_CONTENT_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN

# SEO channel
DISCORD_SEO_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN

# Marketing & CRO channel
DISCORD_CRO_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN

# Funnels & Landing Pages channel
DISCORD_FUNNELS_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN

# Social Media channel
DISCORD_SOCIAL_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN

# Anthropic API (for AI-powered marketing generation)
ANTHROPIC_API_KEY=sk-ant-...
```

- [ ] **Step 3: Verify existing scans still work**

Run: `cd monitoring && node -e "import('./lib/discord.mjs').then(m => console.log('Discord module loads OK'))"`
Expected: "Discord module loads OK"

- [ ] **Step 4: Commit**

```bash
git add monitoring/lib/discord.mjs monitoring/.env.example
git commit -m "[marketing] Add CRO, Funnels, and Social Media Discord channel support"
```

---

## Task 2: Create Shared Marketing Utilities

**Files:**
- Create: `monitoring/marketing/lib/claude-api.mjs`
- Create: `monitoring/marketing/lib/git-ops.mjs`

- [ ] **Step 1: Create marketing directory structure**

```bash
mkdir -p monitoring/marketing/lib
```

- [ ] **Step 2: Create Claude API helper**

Create `monitoring/marketing/lib/claude-api.mjs`:

```javascript
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");

const MODELS = {
  haiku: "claude-haiku-4-5-20251001",
  sonnet: "claude-sonnet-4-6",
  opus: "claude-opus-4-6",
};

export async function invokeClaude(prompt, { model = "sonnet", timeout = 300000 } = {}) {
  const modelId = MODELS[model] || MODELS.sonnet;
  const safePrompt = prompt.replace(/"/g, '\\"');

  console.log(`[claude-api] Using model: ${model} (${modelId})`);
  try {
    const result = execSync(
      `npx -y @anthropic-ai/claude-code --print --model ${modelId} "${safePrompt}"`,
      { cwd: REPO_ROOT, encoding: "utf-8", timeout, env: { ...process.env, PATH: process.env.PATH } }
    );
    return { success: true, output: result.trim() };
  } catch (err) {
    return { success: false, output: err.stdout || err.message };
  }
}

export async function generateWithClaude(prompt, { model = "sonnet", timeout = 300000 } = {}) {
  const result = await invokeClaude(prompt, { model, timeout });
  if (!result.success) {
    throw new Error(`Claude generation failed: ${result.output}`);
  }
  return result.output;
}
```

- [ ] **Step 3: Create git operations helper**

Create `monitoring/marketing/lib/git-ops.mjs`:

```javascript
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");

function exec(cmd) {
  try {
    return execSync(cmd, { cwd: REPO_ROOT, encoding: "utf-8", timeout: 120000 });
  } catch (err) {
    return err.stdout || err.message;
  }
}

export function hasChanges() {
  return exec("git status --porcelain").trim().length > 0;
}

export function buildSucceeds() {
  try {
    execSync("npm run build", { cwd: REPO_ROOT, encoding: "utf-8", timeout: 120000 });
    return true;
  } catch {
    return false;
  }
}

export function commitAndPush(message) {
  exec("git add -A");
  exec(`git commit -m "${message}"`);
  exec("git push");
}

export function createPRBranch(branchName) {
  exec(`git checkout -b ${branchName}`);
}

export function createPR(title, body, branchName) {
  exec(`git add -A`);
  exec(`git commit -m "${title}"`);
  exec(`git push -u origin ${branchName}`);
  try {
    const safeBody = body.replace(/"/g, '\\"');
    exec(`gh pr create --title "${title}" --body "${safeBody}" --base main`);
    console.log(`PR created on branch ${branchName}`);
  } catch (err) {
    console.error(`PR creation failed: ${err}`);
  }
  exec("git checkout main");
}

export function cleanupBranch(branchName) {
  exec("git checkout .");
  exec("git checkout main");
  exec(`git branch -D ${branchName}`);
}
```

- [ ] **Step 4: Verify modules load**

Run: `cd monitoring && node -e "import('./marketing/lib/claude-api.mjs').then(() => console.log('claude-api OK')); import('./marketing/lib/git-ops.mjs').then(() => console.log('git-ops OK'))"`
Expected: Both print "OK"

- [ ] **Step 5: Commit**

```bash
git add monitoring/marketing/lib/
git commit -m "[marketing] Add shared Claude API and git operations utilities"
```

---

## Task 3: Build the Brand Kit

**Files:**
- Create: `monitoring/marketing/brand-kit-builder.mjs`
- Output: `monitoring/marketing/brand-kit.json`
- Output: `monitoring/marketing/brand-kit.html`

- [ ] **Step 1: Create brand kit builder script**

Create `monitoring/marketing/brand-kit-builder.mjs`:

```javascript
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";
import { generateWithClaude } from "./lib/claude-api.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = "https://demartransportation.com";

const PAGES_TO_ANALYZE = [
  "/",
  "/about",
  "/services/dry-van",
  "/services/reefer",
  "/services/flatbed",
  "/contact",
  "/quote",
];

async function fetchPageContent(url) {
  const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000) });
  return await res.text();
}

async function extractBrandElements() {
  console.log("Fetching homepage...");
  const html = await fetchPageContent(SITE_URL);
  const $ = cheerio.load(html);

  // Extract what we can from static HTML
  const metaDescription = $('meta[name="description"]').attr("content") || "";
  const title = $("title").text() || "";
  const ogImage = $('meta[property="og:image"]').attr("content") || "";
  const themeColor = $('meta[name="theme-color"]').attr("content") || "";

  // Fetch multiple pages to analyze copy patterns
  console.log("Fetching additional pages for voice analysis...");
  const copySnippets = [];
  for (const pagePath of PAGES_TO_ANALYZE) {
    try {
      const pageHtml = await fetchPageContent(`${SITE_URL}${pagePath}`);
      const page$ = cheerio.load(pageHtml);
      // Get text from meta tags and any visible-in-source content
      const pageTitle = page$("title").text();
      const pageMeta = page$('meta[name="description"]').attr("content") || "";
      if (pageTitle) copySnippets.push(pageTitle);
      if (pageMeta) copySnippets.push(pageMeta);
    } catch (e) {
      console.log(`  Skipping ${pagePath}: ${e.message}`);
    }
  }

  return { html, metaDescription, title, ogImage, themeColor, copySnippets };
}

async function generateBrandKit(elements) {
  const prompt = `You are a brand strategist analyzing a freight transportation company website. Based on the following extracted elements, create a comprehensive brand kit JSON.

Website: ${SITE_URL}
Title: ${elements.title}
Meta Description: ${elements.metaDescription}
Theme Color: ${elements.themeColor}
OG Image: ${elements.ogImage}

Copy samples from various pages:
${elements.copySnippets.map((s, i) => `${i + 1}. "${s}"`).join("\n")}

Company facts (DO NOT change these):
- Name: DeMar Transportation
- Type: Motor carrier (MC authority) + freight broker
- Fleet: Own trucks (dry van, reefer, flatbed, box truck, sprinter van, hazmat-certified)
- Also offers: 3PL logistics and warehousing through partner network
- Address: 10471 Double R Blvd, Reno, NV 89521
- Phone: (775) 230-4767
- Email: info@DeMarTransportation.com
- Website: https://demartransportation.com

IMPORTANT brand rules:
- NEVER use "direct carrier", "no middleman", "no broker markup" — they also broker loads
- Emphasize: reliability, transparency, competitive rates, nationwide coverage, flexibility
- They are both asset-based AND a broker — present this as a STRENGTH (more capacity, more options)

Return ONLY valid JSON (no markdown fences) with this exact structure:
{
  "company": {
    "name": "DeMar Transportation",
    "legalName": "DeMar Consulting Group LLC dba DeMar Transportation",
    "tagline": "<extract or create a concise tagline>",
    "address": "10471 Double R Blvd, Reno, NV 89521",
    "phone": "(775) 230-4767",
    "email": "info@DeMarTransportation.com",
    "website": "https://demartransportation.com",
    "services": ["Dry Van", "Reefer", "Flatbed", "Box Truck", "Sprinter Van", "Hazmat", "FTL", "LTL", "3PL Logistics", "Warehousing & Distribution"],
    "differentiators": ["<3-5 key differentiators>"]
  },
  "colors": {
    "primary": "<hex from site>",
    "secondary": "<hex>",
    "accent": "<hex>",
    "background": "<hex>",
    "text": "<hex>",
    "success": "#22c55e",
    "warning": "#f59e0b",
    "error": "#ef4444"
  },
  "typography": {
    "headingFont": "<font family from site>",
    "bodyFont": "<font family>",
    "weights": { "light": 300, "regular": 400, "medium": 500, "semibold": 600, "bold": 700 }
  },
  "voice": {
    "tone": ["<3-5 tone descriptors>"],
    "doSay": ["<5-7 phrases/patterns to use>"],
    "dontSay": ["direct carrier", "no middleman", "no broker markup", "cheapest rates", "<other phrases to avoid>"],
    "personality": "<2-3 sentence brand personality description>"
  },
  "visual": {
    "logoPath": "/demar-logo-official.png",
    "ogImage": "${elements.ogImage || "/demar-logo-official.png"}",
    "imageStyle": "<describe the image/photo style>",
    "iconStyle": "<describe icon usage>"
  },
  "linkedin": {
    "companyPage": "",
    "postStyle": "<describe ideal LinkedIn post format>",
    "hashtags": ["<5-8 relevant hashtags>"],
    "contentPillars": ["<4-6 content themes to rotate through>"]
  }
}`;

  const output = await generateWithClaude(prompt, { model: "sonnet" });

  // Parse the JSON from Claude's response
  const jsonMatch = output.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract JSON from Claude response");
  }
  return JSON.parse(jsonMatch[0]);
}

function generateBrandKitHTML(brandKit) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${brandKit.company.name} — Brand Kit</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: ${brandKit.typography.bodyFont}, system-ui, sans-serif; max-width: 900px; margin: 0 auto; padding: 2rem; color: ${brandKit.colors.text}; }
    h1 { font-family: ${brandKit.typography.headingFont}, system-ui, sans-serif; font-size: 2rem; margin-bottom: 0.5rem; color: ${brandKit.colors.primary}; }
    h2 { font-size: 1.4rem; margin: 2rem 0 1rem; border-bottom: 2px solid ${brandKit.colors.primary}; padding-bottom: 0.5rem; }
    .color-grid { display: flex; gap: 1rem; flex-wrap: wrap; }
    .swatch { width: 120px; height: 80px; border-radius: 8px; display: flex; align-items: end; padding: 0.5rem; font-size: 0.75rem; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
    .voice-list { list-style: none; padding: 0; }
    .voice-list li { padding: 0.5rem 0; border-bottom: 1px solid #eee; }
    .do { color: #22c55e; } .dont { color: #ef4444; }
    .tag { display: inline-block; background: ${brandKit.colors.primary}; color: #fff; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.85rem; margin: 0.25rem; }
    .section { margin-bottom: 2rem; }
    .tagline { font-size: 1.2rem; color: ${brandKit.colors.secondary}; font-style: italic; margin-bottom: 2rem; }
  </style>
</head>
<body>
  <h1>${brandKit.company.name}</h1>
  <p class="tagline">${brandKit.company.tagline}</p>

  <div class="section">
    <h2>Colors</h2>
    <div class="color-grid">
      ${Object.entries(brandKit.colors).map(([name, hex]) => `<div class="swatch" style="background:${hex}">${name}<br>${hex}</div>`).join("\n      ")}
    </div>
  </div>

  <div class="section">
    <h2>Typography</h2>
    <p><strong>Headings:</strong> ${brandKit.typography.headingFont}</p>
    <p><strong>Body:</strong> ${brandKit.typography.bodyFont}</p>
  </div>

  <div class="section">
    <h2>Voice & Tone</h2>
    <p><strong>Personality:</strong> ${brandKit.voice.personality}</p>
    <p><strong>Tone:</strong> ${brandKit.voice.tone.join(", ")}</p>
    <h3 style="margin-top:1rem">Do Say</h3>
    <ul class="voice-list">${brandKit.voice.doSay.map(s => `<li class="do">+ ${s}</li>`).join("")}</ul>
    <h3 style="margin-top:1rem">Don't Say</h3>
    <ul class="voice-list">${brandKit.voice.dontSay.map(s => `<li class="dont">- ${s}</li>`).join("")}</ul>
  </div>

  <div class="section">
    <h2>Services</h2>
    <div>${brandKit.company.services.map(s => `<span class="tag">${s}</span>`).join("")}</div>
  </div>

  <div class="section">
    <h2>LinkedIn Content</h2>
    <p><strong>Post Style:</strong> ${brandKit.linkedin.postStyle}</p>
    <p><strong>Hashtags:</strong> ${brandKit.linkedin.hashtags.map(h => `<span class="tag">${h}</span>`).join("")}</p>
    <p><strong>Content Pillars:</strong></p>
    <ul>${brandKit.linkedin.contentPillars.map(p => `<li>${p}</li>`).join("")}</ul>
  </div>

  <div class="section">
    <h2>Company Info</h2>
    <p>${brandKit.company.address}</p>
    <p>${brandKit.company.phone} | ${brandKit.company.email}</p>
    <p>${brandKit.company.website}</p>
  </div>

  <footer style="margin-top:3rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#999">
    Generated ${new Date().toISOString().split("T")[0]} by DeMar Marketing Automation
  </footer>
</body>
</html>`;
}

async function main() {
  console.log("Building brand kit...");
  const elements = await extractBrandElements();
  console.log("Generating brand kit with Claude...");
  const brandKit = await generateBrandKit(elements);

  const jsonPath = path.join(__dirname, "brand-kit.json");
  const htmlPath = path.join(__dirname, "brand-kit.html");

  fs.writeFileSync(jsonPath, JSON.stringify(brandKit, null, 2));
  console.log(`Brand kit JSON written to ${jsonPath}`);

  const html = generateBrandKitHTML(brandKit);
  fs.writeFileSync(htmlPath, html);
  console.log(`Brand kit HTML written to ${htmlPath}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Run the brand kit builder locally to generate initial brand kit**

Run: `cd monitoring && ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY node marketing/brand-kit-builder.mjs`
Expected: `brand-kit.json` and `brand-kit.html` created in `monitoring/marketing/`

- [ ] **Step 3: Review generated brand-kit.json for accuracy**

Open `monitoring/marketing/brand-kit.json` and verify:
- Company info matches (address, phone, services)
- Colors extracted reasonably from the site
- Voice rules include the "don't say" restrictions
- No "direct carrier" or "no middleman" in doSay

- [ ] **Step 4: Commit**

```bash
git add monitoring/marketing/brand-kit-builder.mjs monitoring/marketing/brand-kit.json monitoring/marketing/brand-kit.html
git commit -m "[marketing] Create brand kit builder and generate initial brand kit"
```

---

## Task 4: Create CRO Audit Script

**Files:**
- Create: `monitoring/marketing/cro-audit.mjs`

- [ ] **Step 1: Create the CRO audit script**

Create `monitoring/marketing/cro-audit.mjs`:

```javascript
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

  // Compute overall score
  const scorable = allChecks.filter(c => c.confidence !== "UNABLE_TO_VERIFY");
  const passCount = scorable.filter(c => c.status === "pass").length;
  const score = Math.round((passCount / scorable.length) * 100);
  const status = scorable.some(c => c.status === "fail") ? "fail" : scorable.some(c => c.status === "warn") ? "warn" : "pass";

  // Generate AI recommendations
  console.log("Generating CRO recommendations...");
  const recommendations = await generateCRORecommendations(allChecks);

  // Apply auto-fixes
  let fixCount = 0;
  if (recommendations && process.env.ANTHROPIC_API_KEY) {
    console.log("Applying auto-fixes...");
    fixCount = await applyAutoFixes(recommendations);
  }

  // Build Discord message
  const result = { category: "CRO Audit", status, score, checks: allChecks };
  const embed = buildEmbed(result);

  // Add recommendations to embed
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
      color: 3447003, // blue
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
```

- [ ] **Step 2: Verify script loads without errors**

Run: `cd monitoring && node -e "import('./marketing/cro-audit.mjs').catch(e => console.log('Expected: needs env vars'))" 2>&1 | head -5`
Expected: Error about missing webhook URL (expected without .env)

- [ ] **Step 3: Commit**

```bash
git add monitoring/marketing/cro-audit.mjs
git commit -m "[marketing] Create CRO audit script with AI recommendations and auto-fix"
```

---

## Task 5: Create Funnel Generator Script

**Files:**
- Create: `monitoring/marketing/funnel-generator.mjs`

- [ ] **Step 1: Create the funnel generator script**

Create `monitoring/marketing/funnel-generator.mjs`:

```javascript
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

  // Check freshness of existing pages
  console.log("Checking existing page freshness...");
  const freshnessResults = [];
  for (const page of SERVICE_PAGES) {
    const result = await checkPageFreshness(page.slug);
    freshnessResults.push({ ...page, ...result });
    console.log(`  ${page.name}: ${result.exists ? "OK" : "MISSING"} (${result.status || "error"})`);
  }

  const missingPages = freshnessResults.filter(p => !p.exists);

  // Identify landing page gaps
  console.log("Identifying landing page opportunities...");
  const gaps = await identifyLandingPageGaps(brandKit);
  console.log(`  Found ${gaps.length} landing page opportunities`);

  // Generate new pages (max 1 per run to avoid overwhelming)
  let generatedPage = null;
  const highPriorityGaps = gaps.filter(g => g.priority === "high");
  const pageToGenerate = highPriorityGaps[0] || gaps[0];

  if (pageToGenerate) {
    console.log(`Generating landing page: ${pageToGenerate.title}...`);
    const branchName = `marketing/landing-page-${pageToGenerate.slug}-${Date.now()}`;
    createPRBranch(branchName);

    try {
      const componentCode = await generateLandingPage(pageToGenerate, brandKit);

      // Write the component file
      const componentName = pageToGenerate.slug
        .split("-")
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join("");
      const filePath = path.join(REPO_ROOT, `src/pages/services/${componentName}.tsx`);

      // Extract just the code (remove markdown fences if present)
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

  // Post to Discord
  const embeds = [];

  // Freshness embed
  const existingCount = freshnessResults.filter(p => p.exists).length;
  embeds.push({
    title: "📄 Landing Page Freshness",
    description: `**${existingCount}/${SERVICE_PAGES.length}** service pages active\n\n` +
      freshnessResults.map(p => `${p.exists ? "✅" : "❌"} ${p.name}`).join("\n"),
    color: missingPages.length > 0 ? 16776960 : 3066993,
    timestamp: new Date().toISOString(),
  });

  // Opportunities embed
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

  // Generated page embed
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
```

- [ ] **Step 2: Verify script loads**

Run: `cd monitoring && node -e "import('./marketing/funnel-generator.mjs').catch(e => console.log('Expected: needs env vars'))"`

- [ ] **Step 3: Commit**

```bash
git add monitoring/marketing/funnel-generator.mjs
git commit -m "[marketing] Create funnel generator with AI-powered landing page creation"
```

---

## Task 6: Create Social Media Generator Script

**Files:**
- Create: `monitoring/marketing/social-generator.mjs`

- [ ] **Step 1: Create the social media generator script**

Create `monitoring/marketing/social-generator.mjs`:

```javascript
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { postToChannel } from "../lib/discord.mjs";
import { generateWithClaude } from "./lib/claude-api.mjs";
import { hasChanges, buildSucceeds, createPRBranch, createPR, cleanupBranch } from "./lib/git-ops.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");

// Content pillars rotate by day of week
const DAY_THEMES = {
  0: "industry-insights",    // Sunday
  1: "service-spotlight",    // Monday
  2: "customer-success",     // Tuesday
  3: "behind-the-scenes",    // Wednesday
  4: "tips-and-education",   // Thursday
  5: "company-culture",      // Friday
  6: "weekly-recap",         // Saturday
};

async function generateLinkedInPost(brandKit, theme) {
  const prompt = `You are a LinkedIn content creator for ${brandKit.company.name}.

Brand voice: ${brandKit.voice.personality}
Tone: ${brandKit.voice.tone.join(", ")}
NEVER say: ${brandKit.voice.dontSay.join(", ")}
DO say: ${brandKit.voice.doSay.join(", ")}
Services: ${brandKit.company.services.join(", ")}
Differentiators: ${brandKit.company.differentiators.join(", ")}
LinkedIn post style: ${brandKit.linkedin.postStyle}

Today's content theme: "${theme}"

Create a LinkedIn post that:
1. Opens with a hook (question, bold statement, or surprising stat)
2. Provides value (insight, tip, or story)
3. Ends with a clear CTA (visit website, request quote, or engage)
4. Is 150-300 words
5. Uses line breaks for readability (LinkedIn style)
6. Includes 3-5 relevant hashtags from: ${brandKit.linkedin.hashtags.join(", ")}

IMPORTANT: This is for a freight/logistics company. Keep it professional but approachable.
Do NOT make up specific customer names or fake testimonials.
Do NOT claim "direct carrier" or "no middleman" — they also broker loads.

Return ONLY valid JSON (no markdown fences):
{
  "post": "<the full LinkedIn post text with \\n for line breaks>",
  "imagePrompt": "<a detailed prompt for generating a matching image — describe the scene, colors, style>",
  "companionPage": {
    "title": "<title for a companion landing page on the website>",
    "slug": "<url-slug>",
    "description": "<what the companion page should cover — 1-2 sentences>"
  }
}`;

  const output = await generateWithClaude(prompt, { model: "sonnet" });
  const match = output.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Failed to parse LinkedIn post JSON");
  return JSON.parse(match[0]);
}

async function generateImage(imagePrompt, brandKit) {
  // Use nano-banana MCP if available, otherwise skip
  // In GitHub Actions, image generation may not be available
  // Post the prompt to Discord so user can generate manually if needed
  console.log("Image generation prompt ready (nano-banana MCP required for auto-generation)");
  return null;
}

async function generateCompanionPage(spec, brandKit) {
  const branchName = `marketing/social-page-${spec.slug}-${Date.now()}`;
  createPRBranch(branchName);

  const prompt = `Create a React component for a companion landing page for ${brandKit.company.name}.

Page: ${spec.title}
Slug: /landing/${spec.slug}
Description: ${spec.description}

Brand voice: ${brandKit.voice.tone.join(", ")}
NEVER say: ${brandKit.voice.dontSay.join(", ")}
Company: ${brandKit.company.name}, ${brandKit.company.address}, ${brandKit.company.phone}

This is a focused landing page linked from a LinkedIn post. It should:
- Have a clear, single CTA (request a quote or contact)
- Be concise (500-800 words)
- Include a hero section with the page title
- Import Header and Footer from @/components
- Use useEffect for document.title and meta description
- Use Tailwind CSS
- Export default the component

Return ONLY the TypeScript React component code (no markdown fences).`;

  try {
    const code = await generateWithClaude(prompt, { model: "sonnet", timeout: 600000 });
    const cleanCode = code.replace(/^```\w*\n?/, "").replace(/\n?```$/, "");

    const componentName = spec.slug
      .split("-")
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join("");

    // Create landing directory if needed
    const landingDir = path.join(REPO_ROOT, "src/pages/landing");
    if (!fs.existsSync(landingDir)) {
      fs.mkdirSync(landingDir, { recursive: true });
    }

    const filePath = path.join(landingDir, `${componentName}.tsx`);
    fs.writeFileSync(filePath, cleanCode);

    if (hasChanges() && buildSucceeds()) {
      createPR(
        `[marketing] Add companion landing page: ${spec.title}`,
        `## Social Media Companion Page\n\n**Page:** ${spec.title}\n**Route:** /landing/${spec.slug}\n**Context:** Companion page for LinkedIn post\n\n${spec.description}\n\n---\nGenerated by DeMar Marketing Automation`,
        branchName
      );
      return true;
    } else {
      cleanupBranch(branchName);
      return false;
    }
  } catch (err) {
    console.error(`Companion page generation failed: ${err.message}`);
    cleanupBranch(branchName);
    return false;
  }
}

async function main() {
  if (!process.env.DISCORD_SOCIAL_WEBHOOK_URL) {
    console.error("DISCORD_SOCIAL_WEBHOOK_URL not set.");
    process.exit(1);
  }

  const brandKit = JSON.parse(fs.readFileSync(path.join(__dirname, "brand-kit.json"), "utf-8"));

  const dayOfWeek = new Date().getDay();
  const theme = DAY_THEMES[dayOfWeek];
  console.log(`Today's content theme: ${theme}`);

  // Generate LinkedIn post
  console.log("Generating LinkedIn post...");
  const postData = await generateLinkedInPost(brandKit, theme);

  // Generate image (if MCP available)
  console.log("Processing image...");
  const imagePath = await generateImage(postData.imagePrompt, brandKit);

  // Generate companion landing page
  let companionCreated = false;
  if (postData.companionPage && process.env.ANTHROPIC_API_KEY) {
    console.log("Generating companion landing page...");
    companionCreated = await generateCompanionPage(postData.companionPage, brandKit);
  }

  // Post to Discord
  const embeds = [];

  // LinkedIn post embed
  embeds.push({
    title: `📱 LinkedIn Post — ${theme.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}`,
    description: postData.post.substring(0, 4000),
    color: 0x0A66C2, // LinkedIn blue
    timestamp: new Date().toISOString(),
    footer: { text: "Copy and paste to LinkedIn" },
  });

  // Image prompt embed
  embeds.push({
    title: "🎨 Image Prompt",
    description: `**Generate this image for the post:**\n\n${postData.imagePrompt}`,
    color: 0x9B59B6, // purple
    timestamp: new Date().toISOString(),
  });

  // Companion page embed
  if (companionCreated) {
    embeds.push({
      title: "🔗 Companion Landing Page Created",
      description: `**${postData.companionPage.title}**\nRoute: \`/landing/${postData.companionPage.slug}\`\nPR created for review.`,
      color: 3066993,
      timestamp: new Date().toISOString(),
    });
  }

  await postToChannel("social", {
    content: `**📣 Daily Social Media Content — ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}**\nTheme: **${theme.replace(/-/g, " ")}**`,
    embeds: embeds.slice(0, 10),
  });

  console.log("Social content posted to Discord.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Verify script loads**

Run: `cd monitoring && node -e "import('./marketing/social-generator.mjs').catch(e => console.log('Expected: needs env vars'))"`

- [ ] **Step 3: Commit**

```bash
git add monitoring/marketing/social-generator.mjs
git commit -m "[marketing] Create social media generator with LinkedIn post and companion page creation"
```

---

## Task 7: Add npm Scripts for Marketing Commands

**Files:**
- Modify: `monitoring/package.json`

- [ ] **Step 1: Add marketing scripts to package.json**

Add these scripts to `monitoring/package.json`'s `scripts` section:

```json
{
  "scripts": {
    "scan": "node run-scans.mjs --type full",
    "scan:light": "node run-scans.mjs --type lightweight",
    "scan:security": "node run-scans.mjs --scan security",
    "scan:seo": "node run-scans.mjs --scan seo",
    "scan:perf": "node run-scans.mjs --scan performance",
    "scan:deps": "node run-scans.mjs --scan dependencies",
    "scan:images": "node run-scans.mjs --scan images",
    "scan:a11y": "node run-scans.mjs --scan accessibility",
    "scan:schema": "node run-scans.mjs --scan schema",
    "scan:social": "node run-scans.mjs --scan social-preview",
    "scan:links": "node run-scans.mjs --scan links",
    "scan:fresh": "node run-scans.mjs --scan freshness",
    "scan:dns": "node run-scans.mjs --scan dns",
    "uptime": "node uptime.mjs check",
    "uptime:summary": "node uptime.mjs summary",
    "auto-fix": "node auto-fix.mjs",
    "seo-audit": "node seo-audit.mjs",
    "marketing:brand-kit": "node marketing/brand-kit-builder.mjs",
    "marketing:cro": "node marketing/cro-audit.mjs",
    "marketing:funnels": "node marketing/funnel-generator.mjs",
    "marketing:social": "node marketing/social-generator.mjs"
  }
}
```

- [ ] **Step 2: Verify package.json is valid**

Run: `cd monitoring && node -e "JSON.parse(require('fs').readFileSync('package.json','utf-8')); console.log('Valid JSON')"`
Expected: "Valid JSON"

- [ ] **Step 3: Commit**

```bash
git add monitoring/package.json
git commit -m "[marketing] Add npm scripts for marketing automation commands"
```

---

## Task 8: Create GitHub Actions Workflows

**Files:**
- Create: `.github/workflows/marketing-cro.yml`
- Create: `.github/workflows/marketing-funnels.yml`
- Create: `.github/workflows/marketing-social.yml`

- [ ] **Step 1: Create CRO audit workflow**

Create `.github/workflows/marketing-cro.yml`:

```yaml
name: Marketing CRO Audit

on:
  schedule:
    - cron: '0 17 * * *'  # Daily at 10am PDT (17:00 UTC)
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

jobs:
  cro-audit:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ github.token }}

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Configure git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

      - name: Install project dependencies
        run: npm ci

      - name: Install monitoring dependencies
        run: cd monitoring && npm ci

      - name: Run CRO audit
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          DISCORD_CRO_WEBHOOK_URL: ${{ secrets.DISCORD_CRO_WEBHOOK_URL }}
          GH_TOKEN: ${{ github.token }}
        run: cd monitoring && node marketing/cro-audit.mjs
```

- [ ] **Step 2: Create funnels workflow**

Create `.github/workflows/marketing-funnels.yml`:

```yaml
name: Marketing Funnels

on:
  schedule:
    - cron: '0 18 * * *'  # Daily at 11am PDT (18:00 UTC)
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

jobs:
  funnels:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ github.token }}

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Configure git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

      - name: Install project dependencies
        run: npm ci

      - name: Install monitoring dependencies
        run: cd monitoring && npm ci

      - name: Run funnel generator
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          DISCORD_FUNNELS_WEBHOOK_URL: ${{ secrets.DISCORD_FUNNELS_WEBHOOK_URL }}
          GH_TOKEN: ${{ github.token }}
        run: cd monitoring && node marketing/funnel-generator.mjs
```

- [ ] **Step 3: Create social media workflow**

Create `.github/workflows/marketing-social.yml`:

```yaml
name: Marketing Social Media

on:
  schedule:
    - cron: '0 19 * * *'  # Daily at 12pm PDT (19:00 UTC)
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

jobs:
  social-media:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ github.token }}

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Configure git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

      - name: Install project dependencies
        run: npm ci

      - name: Install monitoring dependencies
        run: cd monitoring && npm ci

      - name: Run social media generator
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          DISCORD_SOCIAL_WEBHOOK_URL: ${{ secrets.DISCORD_SOCIAL_WEBHOOK_URL }}
          GH_TOKEN: ${{ github.token }}
        run: cd monitoring && node marketing/social-generator.mjs
```

- [ ] **Step 4: Verify YAML syntax**

Run: `for f in .github/workflows/marketing-*.yml; do echo "Checking $f..."; python3 -c "import yaml; yaml.safe_load(open('$f'))" && echo "  OK"; done`
Expected: All three files pass YAML validation

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/marketing-cro.yml .github/workflows/marketing-funnels.yml .github/workflows/marketing-social.yml
git commit -m "[marketing] Add GitHub Actions workflows for daily CRO, funnel, and social media automation"
```

---

## Task 9: Create Discord Channels and Configure Webhooks

This task requires manual Discord setup. The script creates a helper that validates webhook configuration.

**Files:**
- Create: `monitoring/marketing/verify-webhooks.mjs`

- [ ] **Step 1: Create webhook verification script**

Create `monitoring/marketing/verify-webhooks.mjs`:

```javascript
import "dotenv/config";

const CHANNELS = [
  { name: "Marketing & CRO", env: "DISCORD_CRO_WEBHOOK_URL" },
  { name: "Funnels & Landing Pages", env: "DISCORD_FUNNELS_WEBHOOK_URL" },
  { name: "Social Media", env: "DISCORD_SOCIAL_WEBHOOK_URL" },
];

async function verifyWebhook(name, url) {
  if (!url) return { name, status: "missing", detail: "Env var not set" };
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `✅ **${name}** channel verified! Marketing automation is connected.`,
        embeds: [{
          title: `🔗 ${name} — Connected`,
          description: "This channel will receive daily marketing automation updates from DeMar Transportation's CI/CD pipeline.",
          color: 3066993,
          timestamp: new Date().toISOString(),
        }],
      }),
    });
    return { name, status: res.ok ? "ok" : "error", detail: res.ok ? "Webhook verified" : `HTTP ${res.status}` };
  } catch (err) {
    return { name, status: "error", detail: err.message };
  }
}

async function main() {
  console.log("Verifying Discord webhooks for marketing channels...\n");
  for (const ch of CHANNELS) {
    const url = process.env[ch.env];
    const result = await verifyWebhook(ch.name, url);
    const icon = result.status === "ok" ? "✅" : result.status === "missing" ? "⬜" : "❌";
    console.log(`${icon} ${result.name}: ${result.detail}`);
  }
  console.log("\nTo configure missing webhooks:");
  console.log("1. Create channels in Discord server");
  console.log("2. Edit each channel → Integrations → Webhooks → New Webhook");
  console.log("3. Copy webhook URL and add to monitoring/.env and GitHub Actions secrets");
}

main();
```

- [ ] **Step 2: Manual — Create 3 Discord channels in server**

In your Discord server, create these text channels:
1. `#marketing-cro`
2. `#funnels-landing-pages`
3. `#social-media`

- [ ] **Step 3: Manual — Create webhooks for each channel**

For each channel: Edit Channel → Integrations → Webhooks → New Webhook → Copy URL

- [ ] **Step 4: Manual — Add webhook URLs to `monitoring/.env`**

Add to `monitoring/.env`:
```
DISCORD_CRO_WEBHOOK_URL=<paste CRO webhook>
DISCORD_FUNNELS_WEBHOOK_URL=<paste Funnels webhook>
DISCORD_SOCIAL_WEBHOOK_URL=<paste Social webhook>
```

- [ ] **Step 5: Manual — Add webhook URLs to GitHub Actions secrets**

Go to repo Settings → Secrets and variables → Actions → New repository secret:
- `DISCORD_CRO_WEBHOOK_URL`
- `DISCORD_FUNNELS_WEBHOOK_URL`
- `DISCORD_SOCIAL_WEBHOOK_URL`

- [ ] **Step 6: Verify webhooks work**

Run: `cd monitoring && node marketing/verify-webhooks.mjs`
Expected: All three channels show "✅ ... Webhook verified"

- [ ] **Step 7: Commit**

```bash
git add monitoring/marketing/verify-webhooks.mjs
git commit -m "[marketing] Add webhook verification script for marketing Discord channels"
```

---

## Task 10: Install Marketing Skills Library

- [ ] **Step 1: Clone the marketing skills library**

```bash
git clone https://github.com/coreyhaines31/marketingskills.git /tmp/marketingskills
```

- [ ] **Step 2: Copy skills to Claude Code skills directory**

```bash
mkdir -p ~/.claude/skills/marketing
cp -r /tmp/marketingskills/skills/* ~/.claude/skills/marketing/
```

- [ ] **Step 3: Verify skills are installed**

```bash
ls ~/.claude/skills/marketing/ | head -20
```

Expected: List of 34 skill files/directories

- [ ] **Step 4: Clean up temp clone**

```bash
rm -rf /tmp/marketingskills
```

---

## Task 11: Update Documentation

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add marketing automation section to CLAUDE.md**

Add after the "### GitHub Actions Workflows" table:

```markdown
### Marketing Automation

Autonomous marketing system in `monitoring/marketing/`. Uses Claude API for content generation and posts to dedicated Discord channels.

#### Key Commands

```bash
cd monitoring && npm run marketing:brand-kit    # Build/refresh brand kit
cd monitoring && npm run marketing:cro          # Run CRO audit
cd monitoring && npm run marketing:funnels      # Run funnel generator
cd monitoring && npm run marketing:social       # Run social media generator
```

#### Brand Kit

- `monitoring/marketing/brand-kit.json` — machine-readable brand identity
- `monitoring/marketing/brand-kit.html` — visual reference
- Refresh with `npm run marketing:brand-kit`
- All marketing scripts consume brand-kit.json for consistency

#### Marketing Discord Channels

| Channel | Env Var | Purpose |
|---|---|---|
| Marketing & CRO | `DISCORD_CRO_WEBHOOK_URL` | Daily CRO audit, conversion recommendations, auto-fix PRs |
| Funnels & Landing Pages | `DISCORD_FUNNELS_WEBHOOK_URL` | Landing page freshness, new page generation |
| Social Media | `DISCORD_SOCIAL_WEBHOOK_URL` | Daily LinkedIn post, image prompt, companion pages |

#### Marketing GitHub Actions Workflows

| Workflow | File | Schedule |
|---|---|---|
| CRO Audit | `.github/workflows/marketing-cro.yml` | Daily 10am PDT |
| Funnels | `.github/workflows/marketing-funnels.yml` | Daily 11am PDT |
| Social Media | `.github/workflows/marketing-social.yml` | Daily 12pm PDT |

#### Safety Tiers

- **Auto-commit:** Meta tag tweaks, CTA text improvements
- **Auto-PR:** New landing pages, companion pages, significant copy changes (prefix: `[marketing-auto]`)
- **Never auto-fix:** Pricing, legal content, business model claims, contact info
```

- [ ] **Step 2: Update the GitHub Actions Workflows table**

Add the three marketing workflows to the existing table in the "### GitHub Actions Workflows" section.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "[marketing] Document marketing automation system in CLAUDE.md"
```

---

## Task 12: End-to-End Verification

- [ ] **Step 1: Verify build passes**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 2: Run brand kit builder**

Run: `cd monitoring && ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY node marketing/brand-kit-builder.mjs`
Expected: `brand-kit.json` and `brand-kit.html` generated

- [ ] **Step 3: Run CRO audit (dry run)**

Run: `cd monitoring && node marketing/cro-audit.mjs 2>&1 | head -20`
Expected: Starts auditing pages (will fail at Discord post without webhook, which is expected)

- [ ] **Step 4: Run webhook verification**

Run: `cd monitoring && node marketing/verify-webhooks.mjs`
Expected: Shows status of each webhook

- [ ] **Step 5: Trigger one workflow manually via GitHub Actions**

Run: `gh workflow run marketing-cro.yml`
Expected: Workflow starts running on GitHub Actions

- [ ] **Step 6: Commit any final changes**

```bash
git add -A
git commit -m "[marketing] Marketing automation system complete"
```
