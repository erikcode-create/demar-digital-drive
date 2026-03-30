import "dotenv/config";
import { postToChannel } from "../../lib/discord.mjs";
import { saveDaily, loadPrevious, formatDelta } from "../lib/history.mjs";
import { getAllPages, SITE_URL } from "../lib/pages.mjs";
import { generateWithClaude } from "../../marketing/lib/claude-api.mjs";

const GREEN = 3066993;
const YELLOW = 16776960;
const RED = 15158332;

function stripTags(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseJsonResponse(text) {
  // Handle markdown code fences
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = fenceMatch ? fenceMatch[1].trim() : text.trim();
  return JSON.parse(jsonStr);
}

async function run() {
  if (!process.env.ANTHROPIC_API_KEY) {
    await postToChannel("seo-dashboard", {
      embeds: [{
        title: "🏆 E-E-A-T Content Scores",
        description: "Claude API not configured — add `ANTHROPIC_API_KEY` secret.",
        color: YELLOW,
        timestamp: new Date().toISOString(),
      }],
    });
    return;
  }

  const allPages = await getAllPages();
  const totalPages = allPages.length;

  // Rotate 5 pages based on day of year
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
  const startIdx = dayOfYear % totalPages;

  const selectedPages = [];
  for (let i = 0; i < 5 && i < totalPages; i++) {
    selectedPages.push(allPages[(startIdx + i) % totalPages]);
  }

  const results = [];

  for (const page of selectedPages) {
    const url = page.startsWith("http") ? page : `${SITE_URL}${page}`;
    console.log(`Scoring E-E-A-T for ${url}...`);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`Failed to fetch ${url}: ${res.status}`);
        continue;
      }
      const html = await res.text();
      const text = stripTags(html).slice(0, 4000); // Limit to avoid token bloat

      const prompt = `Analyze this web page content for Google's E-E-A-T quality signals. Score each dimension 0-100 and provide a 1-sentence recommendation for each. Respond ONLY with valid JSON, no other text.

Page URL: ${url}

Content:
${text}

Respond in this exact JSON format:
{
  "experience": { "score": 75, "reason": "..." },
  "expertise": { "score": 80, "reason": "..." },
  "authoritativeness": { "score": 65, "reason": "..." },
  "trustworthiness": { "score": 85, "reason": "..." },
  "overall": 76,
  "topRecommendation": "..."
}`;

      const response = await generateWithClaude(prompt, { model: "haiku" });
      const scores = parseJsonResponse(response);

      results.push({
        page: url,
        ...scores,
      });
    } catch (err) {
      console.error(`Error scoring ${url}:`, err.message);
    }
  }

  if (results.length === 0) {
    await postToChannel("seo-dashboard", {
      embeds: [{
        title: "🏆 E-E-A-T Content Scores",
        description: "Could not score any pages. Check logs for errors.",
        color: RED,
        timestamp: new Date().toISOString(),
      }],
    });
    return;
  }

  const avgOverall = Math.round(results.reduce((s, r) => s + (r.overall || 0), 0) / results.length);
  const data = { pages: results, avgOverall, timestamp: new Date().toISOString() };
  await saveDaily("eeat", data);

  const previous = await loadPrevious("eeat");

  // Build table
  let table = "Page              Exp  Exp  Auth Trust  Ovr\n";
  table += "────────────────  ───  ───  ────  ───── ───\n";

  for (const r of results) {
    const path = r.page.replace(/^https?:\/\/[^/]+/, "") || "/";
    const name = path.length > 16 ? path.slice(0, 15) + "…" : path.padEnd(16);
    const exp = String(r.experience?.score || 0).padStart(3);
    const expertise = String(r.expertise?.score || 0).padStart(3);
    const auth = String(r.authoritativeness?.score || 0).padStart(4);
    const trust = String(r.trustworthiness?.score || 0).padStart(5);
    const overall = String(r.overall || 0).padStart(3);
    table += `${name}  ${exp}  ${expertise}  ${auth}  ${trust} ${overall}\n`;
  }

  // Recommendations
  let recs = "\n**Top Recommendations:**\n";
  for (const r of results) {
    const path = r.page.replace(/^https?:\/\/[^/]+/, "") || "/";
    const rec = r.topRecommendation || "N/A";
    const truncated = rec.length > 100 ? rec.slice(0, 97) + "..." : rec;
    recs += `- \`${path}\`: ${truncated}\n`;
  }

  let trendNote = `\n**Avg Overall:** ${avgOverall}/100`;
  if (previous?.avgOverall) {
    trendNote += ` (${formatDelta(avgOverall - previous.avgOverall)})`;
  }

  const color = avgOverall >= 75 ? GREEN : avgOverall >= 50 ? YELLOW : RED;

  const embed = {
    title: "🏆 E-E-A-T Content Scores",
    description: `\`\`\`\n${table}\`\`\`${trendNote}${recs}`,
    color,
    timestamp: new Date().toISOString(),
  };

  await postToChannel("seo-dashboard", { embeds: [embed] });
}

run().catch(console.error);
