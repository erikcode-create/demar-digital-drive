/**
 * Content Gap Analyzer Agent
 *
 * Compares competitor keyword data against our existing pages to identify
 * topic gaps and content opportunities. Uses Claude (haiku) to cluster
 * competitor keywords into topic groups and estimate opportunity value.
 *
 * NEW agent (no existing script to port).
 */

import { invokeClaude } from "../../marketing/lib/claude-api.mjs";

export const name = "content-gap-analyzer";
export const category = "analysis";
export const description = "Identify content gaps by comparing competitor keywords to our pages";

const GREEN = 3066993;
const YELLOW = 16776960;
const RED = 15158332;

function parseJsonResponse(text) {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = fenceMatch ? fenceMatch[1].trim() : text.trim();
  return JSON.parse(jsonStr);
}

export async function run(context) {
  console.log("Starting content gap analyzer agent...");

  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY not set.");
    if (!context.config.dryRun) {
      await context.discord.post("seo-dashboard", {
        embeds: [{
          title: "Content Gap Analysis",
          description: "Claude API not configured. Add `ANTHROPIC_API_KEY` secret.",
          color: YELLOW,
          timestamp: new Date().toISOString(),
        }],
      });
    }
    return { success: false, summary: "ANTHROPIC_API_KEY not configured", data: null };
  }

  // Read competitor data from intelligence state
  const competitorData = context.state.read("intelligence", "competitors");

  if (!competitorData || !competitorData.competitors || competitorData.competitors.length === 0) {
    console.warn("No competitor data available. Run competitor-tracker first.");

    // Still useful to analyze our own pages for thin content areas
    const data = {
      gaps: [],
      competitorCount: 0,
      ourPageCount: 0,
      note: "No competitor data available. Run competitor-tracker intelligence agent first.",
      timestamp: new Date().toISOString(),
    };
    context.state.write("analysis", "content-gaps", data);

    if (!context.config.dryRun) {
      await context.discord.post("seo-dashboard", {
        embeds: [{
          title: "Content Gap Analysis",
          description: "No competitor data available yet. Run the competitor-tracker intelligence agent first to populate keyword data.",
          color: YELLOW,
          timestamp: new Date().toISOString(),
        }],
      });
    }

    return {
      success: true,
      summary: "No competitor data available; wrote empty gap analysis",
      data,
    };
  }

  // Read our pages
  const ourPages = context.source.readAllPages();
  const ourPagePaths = ourPages.map((p) => p.path);
  const ourPageSummaries = ourPages.map((p) => ({
    path: p.path,
    name: p.name,
    type: p.type,
    wordCount: p.wordCount,
    title: p.metaTitle || "",
  }));

  // Collect competitor keywords
  const competitorKeywords = [];
  for (const comp of competitorData.competitors) {
    const keywords = comp.keywords || comp.rankingKeywords || [];
    for (const kw of keywords) {
      competitorKeywords.push({
        keyword: kw.keyword || kw.query || kw,
        position: kw.position || kw.rank || null,
        volume: kw.volume || kw.searchVolume || null,
        competitor: comp.domain || comp.name || "unknown",
      });
    }
  }

  if (competitorKeywords.length === 0) {
    console.warn("Competitor data exists but contains no keywords.");
    const data = {
      gaps: [],
      competitorCount: competitorData.competitors.length,
      ourPageCount: ourPages.length,
      note: "Competitor data contains no keyword entries.",
      timestamp: new Date().toISOString(),
    };
    context.state.write("analysis", "content-gaps", data);
    return { success: true, summary: "No competitor keywords found in data", data };
  }

  // Also pull rank data to know which keywords we already rank for
  const rankData = context.state.read("intelligence", "ranks");
  const ourKeywords = [];
  if (rankData?.keywords) {
    for (const kw of rankData.keywords) {
      ourKeywords.push({
        keyword: kw.keyword || kw.query,
        position: kw.position,
        page: kw.page || kw.path,
      });
    }
  }

  console.log(`Analyzing gaps: ${competitorKeywords.length} competitor keywords vs ${ourPages.length} our pages`);

  // Truncate to avoid token bloat (send top keywords by volume or just first 200)
  const sortedCompKeywords = [...competitorKeywords]
    .sort((a, b) => (b.volume || 0) - (a.volume || 0))
    .slice(0, 200);

  const prompt = `You are an SEO content gap analyst for DeMar Transportation, a freight shipping and logistics company.

**Our existing pages:**
${JSON.stringify(ourPageSummaries, null, 2).slice(0, 3000)}

**Our currently ranking keywords:**
${JSON.stringify(ourKeywords.slice(0, 50), null, 2)}

**Competitor keywords (sorted by search volume):**
${JSON.stringify(sortedCompKeywords.slice(0, 150), null, 2).slice(0, 4000)}

Analyze the competitor keywords and identify content gaps where competitors rank but we either:
1. Have no page targeting that topic
2. Have a page but it's thin or poorly optimized for that keyword cluster

Cluster the competitor keywords into topic groups and identify the top 15 content gap opportunities.

For each gap, estimate the opportunity value as "high", "medium", or "low" based on:
- Search volume (if available)
- Number of competitors ranking for related keywords
- Relevance to freight/logistics/shipping business

Respond ONLY with valid JSON in this format:
{
  "gaps": [
    {
      "topic": "Topic name",
      "keywords": ["keyword1", "keyword2"],
      "opportunityValue": "high",
      "estimatedVolume": 500,
      "competitorsRanking": ["competitor1.com", "competitor2.com"],
      "ourCoverage": "none" | "thin" | "partial",
      "existingPage": "/path-if-exists" | null,
      "suggestedAction": "Create new page about X" | "Expand existing page at /path",
      "suggestedSlug": "/resources/topic-slug" | "/blog/topic-slug"
    }
  ],
  "summary": "Brief 2-sentence summary of the gap analysis"
}`;

  console.log("Sending gap analysis request to Claude...");
  let gaps;

  try {
    const result = await invokeClaude(prompt, { model: "haiku", timeout: 900000 });
    if (!result.success) {
      throw new Error(`Claude call failed: ${result.output}`);
    }
    const parsed = parseJsonResponse(result.output);
    gaps = parsed.gaps || [];
  } catch (err) {
    console.error("Failed to get gap analysis from Claude:", err.message);

    if (!context.config.dryRun) {
      await context.discord.post("seo-dashboard", {
        embeds: [{
          title: "Content Gap Analysis",
          description: `Analysis failed: ${err.message}`,
          color: RED,
          timestamp: new Date().toISOString(),
        }],
      });
    }

    return { success: false, summary: `Claude analysis failed: ${err.message}`, data: null };
  }

  // Sort gaps by opportunity value
  const valueOrder = { high: 3, medium: 2, low: 1 };
  gaps.sort((a, b) => (valueOrder[b.opportunityValue] || 0) - (valueOrder[a.opportunityValue] || 0));

  const data = {
    gaps,
    competitorCount: competitorData.competitors.length,
    competitorKeywordCount: competitorKeywords.length,
    ourPageCount: ourPages.length,
    highValueGaps: gaps.filter((g) => g.opportunityValue === "high").length,
    mediumValueGaps: gaps.filter((g) => g.opportunityValue === "medium").length,
    lowValueGaps: gaps.filter((g) => g.opportunityValue === "low").length,
    timestamp: new Date().toISOString(),
  };

  context.state.write("analysis", "content-gaps", data);
  console.log(`Found ${gaps.length} content gaps (${data.highValueGaps} high, ${data.mediumValueGaps} medium, ${data.lowValueGaps} low)`);

  // Post Discord embed with top 10
  if (!context.config.dryRun) {
    const top10 = gaps.slice(0, 10);
    let gapList = "";

    for (const gap of top10) {
      const icon = gap.opportunityValue === "high" ? "\u{1F534}"
        : gap.opportunityValue === "medium" ? "\u{1F7E1}" : "\u{1F7E2}";
      const vol = gap.estimatedVolume ? ` (~${gap.estimatedVolume} vol)` : "";
      const coverage = gap.ourCoverage === "none" ? "no page"
        : gap.ourCoverage === "thin" ? "thin page" : "partial";
      const action = gap.suggestedAction || "";
      gapList += `${icon} **${gap.topic}**${vol}\n`;
      gapList += `   Coverage: ${coverage} | ${action}\n`;
      if (gap.keywords?.length > 0) {
        gapList += `   Keywords: ${gap.keywords.slice(0, 3).join(", ")}\n`;
      }
      gapList += "\n";
    }

    const color = data.highValueGaps >= 5 ? RED : data.highValueGaps >= 2 ? YELLOW : GREEN;

    const embed = {
      title: "Content Gap Analysis",
      description: [
        `**${gaps.length} content gaps found** (${data.highValueGaps} high, ${data.mediumValueGaps} medium, ${data.lowValueGaps} low)`,
        `Analyzed ${competitorKeywords.length} competitor keywords across ${competitorData.competitors.length} competitors`,
        `Our site: ${ourPages.length} pages`,
        "",
        "**Top Opportunities:**",
        gapList,
      ].join("\n").substring(0, 4000),
      color,
      timestamp: new Date().toISOString(),
    };

    const dateStr = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    await context.discord.post("seo-dashboard", {
      content: `**Content Gap Analysis -- ${dateStr}**`,
      embeds: [embed],
    });
    console.log("Posted content gap analysis to Discord #seo-dashboard channel.");
  }

  return {
    success: true,
    summary: `Found ${gaps.length} gaps (${data.highValueGaps} high value) from ${competitorKeywords.length} competitor keywords`,
    data,
  };
}
