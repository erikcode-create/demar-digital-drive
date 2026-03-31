/**
 * Page Scorer Agent
 *
 * Produces a composite SEO score per page by combining data from multiple
 * sources: site audit, E-E-A-T scores, keyword rank data, and Core Web Vitals.
 *
 * Score formula: SEO health (30%) + E-E-A-T (25%) + rank position (25%) + CWV (20%)
 *
 * Ported from: monitoring/seo/page-performance-scorer.mjs
 */

export const name = "page-scorer";
export const category = "analysis";
export const description = "Composite page scores from audit, E-E-A-T, ranks, and CWV data";

const GREEN = 3066993;
const YELLOW = 16776960;
const RED = 15158332;

/**
 * Convert a Google rank position (1-100+) to a 0-100 score.
 * Position 1 = 100, position 10 = 60, position 20 = 30, 50+ = 5, unranked = 0.
 */
function rankToScore(position) {
  if (position == null || position <= 0) return 0;
  if (position === 1) return 100;
  if (position <= 3) return 90;
  if (position <= 5) return 80;
  if (position <= 10) return 60;
  if (position <= 20) return 30;
  if (position <= 50) return 10;
  return 5;
}

/**
 * Convert CWV metrics to a 0-100 score based on Google thresholds.
 */
function cwvToScore(cwvPage) {
  if (!cwvPage) return null;

  let score = 0;
  let metrics = 0;

  // LCP: good < 2500ms, needs improvement < 4000ms
  if (cwvPage.lcp != null) {
    metrics++;
    if (cwvPage.lcp <= 2500) score += 100;
    else if (cwvPage.lcp <= 4000) score += 50;
    else score += 10;
  }

  // FID/INP: good < 200ms, needs improvement < 500ms
  const interaction = cwvPage.inp ?? cwvPage.fid;
  if (interaction != null) {
    metrics++;
    if (interaction <= 200) score += 100;
    else if (interaction <= 500) score += 50;
    else score += 10;
  }

  // CLS: good < 0.1, needs improvement < 0.25
  if (cwvPage.cls != null) {
    metrics++;
    if (cwvPage.cls <= 0.1) score += 100;
    else if (cwvPage.cls <= 0.25) score += 50;
    else score += 10;
  }

  return metrics > 0 ? Math.round(score / metrics) : null;
}

export async function run(context) {
  console.log("Starting page scorer agent...");

  // Read data from other agents via shared state
  const siteAudit = context.state.read("analysis", "site-audit");
  const eeatScores = context.state.read("analysis", "eeat-scores");
  const rankData = context.state.read("intelligence", "ranks");
  const cwvData = context.state.read("intelligence", "cwv");

  if (!siteAudit) {
    return {
      success: false,
      summary: "Site audit data not available. Run site-auditor first.",
      data: null,
    };
  }

  const auditPages = siteAudit.pages || [];
  if (auditPages.length === 0) {
    return { success: false, summary: "No pages in site audit data", data: null };
  }

  // Index E-E-A-T scores by path
  const eeatByPath = new Map();
  if (eeatScores?.pages) {
    for (const p of eeatScores.pages) {
      eeatByPath.set(p.path, p);
    }
  }

  // Index rank data by path
  const rankByPath = new Map();
  if (rankData?.keywords) {
    for (const kw of rankData.keywords) {
      const path = kw.page || kw.path;
      if (path) {
        // If multiple keywords map to the same page, use the best rank
        const existing = rankByPath.get(path);
        if (!existing || (kw.position && kw.position < existing.position)) {
          rankByPath.set(path, kw);
        }
      }
    }
  }

  // Index CWV data by path
  const cwvByPath = new Map();
  if (cwvData?.pages) {
    for (const p of cwvData.pages) {
      cwvByPath.set(p.path, p);
    }
  }

  // Compute composite scores
  const scoredPages = [];

  for (const auditPage of auditPages) {
    const path = auditPage.path;

    // SEO health score (from audit checks ratio): 0-100
    const healthScore = auditPage.total > 0
      ? Math.round((auditPage.passed / auditPage.total) * 100)
      : 0;

    // E-E-A-T score: 0-100
    const eeat = eeatByPath.get(path);
    const eeatScore = eeat?.overall ?? null;

    // Rank score: 0-100 (derived from position)
    const rank = rankByPath.get(path);
    const rankScore = rank?.position ? rankToScore(rank.position) : null;

    // CWV score: 0-100
    const cwv = cwvByPath.get(path);
    const cwvScore = cwvToScore(cwv);

    // Weighted composite: use available data, reweight if some sources missing
    let totalWeight = 0;
    let weightedSum = 0;

    // SEO health: 30%
    weightedSum += healthScore * 30;
    totalWeight += 30;

    // E-E-A-T: 25%
    if (eeatScore != null) {
      weightedSum += eeatScore * 25;
      totalWeight += 25;
    }

    // Rank: 25%
    if (rankScore != null) {
      weightedSum += rankScore * 25;
      totalWeight += 25;
    }

    // CWV: 20%
    if (cwvScore != null) {
      weightedSum += cwvScore * 20;
      totalWeight += 20;
    }

    const compositeScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

    scoredPages.push({
      path,
      name: auditPage.name,
      type: auditPage.type,
      compositeScore,
      breakdown: {
        health: { score: healthScore, weight: 30 },
        eeat: { score: eeatScore, weight: eeatScore != null ? 25 : 0 },
        rank: {
          score: rankScore,
          position: rank?.position ?? null,
          keyword: rank?.keyword ?? null,
          weight: rankScore != null ? 25 : 0,
        },
        cwv: {
          score: cwvScore,
          lcp: cwv?.lcp ?? null,
          cls: cwv?.cls ?? null,
          weight: cwvScore != null ? 20 : 0,
        },
      },
      issues: auditPage.issues || [],
    });
  }

  // Sort by composite score descending
  scoredPages.sort((a, b) => b.compositeScore - a.compositeScore);

  const avgScore = scoredPages.length > 0
    ? Math.round(scoredPages.reduce((s, p) => s + p.compositeScore, 0) / scoredPages.length)
    : 0;

  const data = {
    avgScore,
    pageCount: scoredPages.length,
    pages: scoredPages,
    dataSources: {
      siteAudit: !!siteAudit,
      eeatScores: eeatByPath.size,
      rankData: rankByPath.size,
      cwvData: cwvByPath.size,
    },
    timestamp: new Date().toISOString(),
  };

  context.state.write("analysis", "page-scores", data);
  console.log(`Scored ${scoredPages.length} pages, avg ${avgScore}/100`);

  // Post Discord embeds
  if (!context.config.dryRun) {
    const color = avgScore >= 70 ? GREEN : avgScore >= 50 ? YELLOW : RED;

    // Top 10
    const top10 = scoredPages.slice(0, 10);
    let topDesc = "";
    for (const s of top10) {
      const dot = s.compositeScore >= 70 ? "\u{1F7E2}" : s.compositeScore >= 50 ? "\u{1F7E1}" : "\u{1F534}";
      const parts = [];
      parts.push(`H:${s.breakdown.health.score}`);
      if (s.breakdown.eeat.score != null) parts.push(`E:${s.breakdown.eeat.score}`);
      if (s.breakdown.rank.score != null) parts.push(`R:${s.breakdown.rank.position}`);
      if (s.breakdown.cwv.score != null) parts.push(`C:${s.breakdown.cwv.score}`);
      topDesc += `${dot} **${s.compositeScore}** ${s.name} (${parts.join(" | ")})\n`;
    }

    // Bottom 10
    const bottom10 = [...scoredPages].reverse().slice(0, 10);
    let bottomDesc = "";
    for (const s of bottom10) {
      const dot = s.compositeScore >= 70 ? "\u{1F7E2}" : s.compositeScore >= 50 ? "\u{1F7E1}" : "\u{1F534}";
      const parts = [];
      parts.push(`H:${s.breakdown.health.score}`);
      if (s.breakdown.eeat.score != null) parts.push(`E:${s.breakdown.eeat.score}`);
      if (s.breakdown.rank.score != null) parts.push(`R:${s.breakdown.rank.position}`);
      if (s.breakdown.cwv.score != null) parts.push(`C:${s.breakdown.cwv.score}`);
      bottomDesc += `${dot} **${s.compositeScore}** ${s.name} (${parts.join(" | ")})\n`;
    }

    const sourceInfo = [
      `Health: ${scoredPages.length} pages`,
      `E-E-A-T: ${eeatByPath.size} pages`,
      `Ranks: ${rankByPath.size} keywords`,
      `CWV: ${cwvByPath.size} pages`,
    ].join(" | ");

    const embeds = [
      {
        title: "SEO Page Performance Scorecard",
        description: [
          `**Average Score: ${avgScore}/100** across ${scoredPages.length} pages`,
          `Formula: Health (30%) + E-E-A-T (25%) + Rank (25%) + CWV (20%)`,
          `Data: ${sourceInfo}`,
          "",
          "**Top 10 Pages:**",
          topDesc,
        ].join("\n").substring(0, 4000),
        color,
        timestamp: new Date().toISOString(),
      },
      {
        title: "Weakest Pages",
        description: `**Bottom 10 Pages:**\n${bottomDesc}`.substring(0, 4000),
        color: RED,
        timestamp: new Date().toISOString(),
      },
    ];

    const dateStr = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    await context.discord.post("seo-dashboard", {
      content: `**Page Performance Scorecard -- ${dateStr}**`,
      embeds,
    });
    console.log("Posted page scores to Discord #seo-dashboard channel.");
  }

  return {
    success: true,
    summary: `Avg ${avgScore}/100 across ${scoredPages.length} pages (sources: audit=${!!siteAudit}, eeat=${eeatByPath.size}, ranks=${rankByPath.size}, cwv=${cwvByPath.size})`,
    data,
  };
}
