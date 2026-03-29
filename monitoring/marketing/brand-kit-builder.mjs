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

  const metaDescription = $('meta[name="description"]').attr("content") || "";
  const title = $("title").text() || "";
  const ogImage = $('meta[property="og:image"]').attr("content") || "";
  const themeColor = $('meta[name="theme-color"]').attr("content") || "";

  console.log("Fetching additional pages for voice analysis...");
  const copySnippets = [];
  for (const pagePath of PAGES_TO_ANALYZE) {
    try {
      const pageHtml = await fetchPageContent(`${SITE_URL}${pagePath}`);
      const page$ = cheerio.load(pageHtml);
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
