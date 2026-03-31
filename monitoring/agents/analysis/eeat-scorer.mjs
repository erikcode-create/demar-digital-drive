/**
 * E-E-A-T Scorer Agent
 *
 * Reads TSX source text and sends it to Claude (haiku) for E-E-A-T scoring.
 * Scores 5 pages per run, rotating by day-of-year so all pages get covered
 * over time.
 *
 * Ported from: monitoring/seo/dashboard/content-eeat-scorer.mjs
 */

import { invokeClaude } from "../../marketing/lib/claude-api.mjs";

export const name = "eeat-scorer";
export const category = "analysis";
export const description = "Score pages on Google E-E-A-T quality signals using Claude";

const GREEN = 3066993;
const YELLOW = 16776960;
const RED = 15158332;

function parseJsonResponse(text) {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = fenceMatch ? fenceMatch[1].trim() : text.trim();
  return JSON.parse(jsonStr);
}

export async function run(context) {
  console.log("Starting E-E-A-T scorer agent...");

  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY not set. Posting notice to Discord.");
    if (!context.config.dryRun) {
      await context.discord.post("seo-dashboard", {
        embeds: [{
          title: "E-E-A-T Content Scores",
          description: "Claude API not configured. Add `ANTHROPIC_API_KEY` secret.",
          color: YELLOW,
          timestamp: new Date().toISOString(),
        }],
      });
    }
    return { success: false, summary: "ANTHROPIC_API_KEY not configured", data: null };
  }

  const allPages = context.source.readAllPages();
  const totalPages = allPages.length;

  if (totalPages === 0) {
    return { success: false, summary: "No pages found to score", data: null };
  }

  // Rotate 5 pages based on day of year
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
  const startIdx = dayOfYear % totalPages;

  const selectedPages = [];
  for (let i = 0; i < 5 && i < totalPages; i++) {
    selectedPages.push(allPages[(startIdx + i) % totalPages]);
  }

  console.log(`Scoring ${selectedPages.length} pages (day ${dayOfYear}, start index ${startIdx}):`);
  for (const p of selectedPages) {
    console.log(`  - ${p.name} (${p.path})`);
  }

  const results = [];

  for (const page of selectedPages) {
    console.log(`Scoring E-E-A-T for ${page.name} (${page.path})...`);

    try {
      // Use source text content, truncated to avoid token bloat
      const text = (page.textContent || "").slice(0, 4000);

      if (text.length < 50) {
        console.warn(`  Skipping ${page.path}: insufficient text content (${text.length} chars)`);
        continue;
      }

      const prompt = `Analyze this web page content for Google's E-E-A-T quality signals. Score each dimension 0-100 and provide a 1-sentence recommendation for each. Respond ONLY with valid JSON, no other text.

Page: ${page.name} (${page.path})

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

      const result = await invokeClaude(prompt, { model: "haiku" });

      if (!result.success) {
        console.error(`  Claude call failed for ${page.path}: ${result.output}`);
        continue;
      }

      const scores = parseJsonResponse(result.output);

      results.push({
        path: page.path,
        name: page.name,
        type: page.type,
        ...scores,
      });
    } catch (err) {
      console.error(`  Error scoring ${page.path}:`, err.message);
    }
  }

  if (results.length === 0) {
    if (!context.config.dryRun) {
      await context.discord.post("seo-dashboard", {
        embeds: [{
          title: "E-E-A-T Content Scores",
          description: "Could not score any pages. Check logs for errors.",
          color: RED,
          timestamp: new Date().toISOString(),
        }],
      });
    }
    return { success: false, summary: "Failed to score any pages", data: null };
  }

  const avgOverall = Math.round(results.reduce((s, r) => s + (r.overall || 0), 0) / results.length);

  // Merge with existing scores from previous runs
  const existing = context.state.read("analysis", "eeat-scores");
  const existingPages = existing?.pages || [];
  const mergedMap = new Map();

  // Load previous scores
  for (const p of existingPages) {
    mergedMap.set(p.path, p);
  }
  // Overwrite with fresh scores
  for (const r of results) {
    mergedMap.set(r.path, r);
  }

  const allScored = Array.from(mergedMap.values());
  const globalAvg = allScored.length > 0
    ? Math.round(allScored.reduce((s, r) => s + (r.overall || 0), 0) / allScored.length)
    : avgOverall;

  const data = {
    pages: allScored,
    avgOverall: globalAvg,
    lastBatchAvg: avgOverall,
    lastBatchPaths: results.map((r) => r.path),
    totalScored: allScored.length,
    timestamp: new Date().toISOString(),
  };

  context.state.write("analysis", "eeat-scores", data);

  // Build Discord embed
  if (!context.config.dryRun) {
    let table = "Page              Exp  Expt Auth Trust  Ovr\n";
    table +=    "----------------  ---  ---- ---- -----  ---\n";

    for (const r of results) {
      const path = r.path || "/";
      const label = path.length > 16 ? path.slice(0, 15) + "\u2026" : path.padEnd(16);
      const exp = String(r.experience?.score || 0).padStart(3);
      const expertise = String(r.expertise?.score || 0).padStart(4);
      const auth = String(r.authoritativeness?.score || 0).padStart(4);
      const trust = String(r.trustworthiness?.score || 0).padStart(5);
      const overall = String(r.overall || 0).padStart(3);
      table += `${label}  ${exp}  ${expertise} ${auth}  ${trust}  ${overall}\n`;
    }

    let recs = "\n**Top Recommendations:**\n";
    for (const r of results) {
      const rec = r.topRecommendation || "N/A";
      const truncated = rec.length > 100 ? rec.slice(0, 97) + "..." : rec;
      recs += `- \`${r.path}\`: ${truncated}\n`;
    }

    const trendNote = `\n**Batch Avg:** ${avgOverall}/100 | **Overall Avg:** ${globalAvg}/100 (${allScored.length} pages scored)`;
    const color = avgOverall >= 75 ? GREEN : avgOverall >= 50 ? YELLOW : RED;

    const embed = {
      title: "E-E-A-T Content Scores",
      description: `\`\`\`\n${table}\`\`\`${trendNote}${recs}`.substring(0, 4000),
      color,
      timestamp: new Date().toISOString(),
    };

    await context.discord.post("seo-dashboard", { embeds: [embed] });
    console.log("Posted E-E-A-T scores to Discord #seo-dashboard channel.");
  }

  return {
    success: true,
    summary: `Scored ${results.length} pages, batch avg ${avgOverall}/100, overall avg ${globalAvg}/100`,
    data,
  };
}
