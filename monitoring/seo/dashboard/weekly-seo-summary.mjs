import "dotenv/config";
import { postToChannel } from "../../lib/discord.mjs";
import { loadRange, loadDaily } from "../lib/history.mjs";

const GREEN = 3066993;
const YELLOW = 16776960;
const RED = 15158332;

function arrow(val) {
  if (val > 0) return `+${val} ↑`;
  if (val < 0) return `${val} ↓`;
  return "→ no change";
}

function safeAvg(arr) {
  if (!arr || arr.length === 0) return null;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

async function run() {
  const categories = ["ranks", "audits", "backlinks", "cwv", "eeat", "search-console", "competitors"];
  const weekData = {};

  for (const cat of categories) {
    try {
      weekData[cat] = await loadRange(cat, 7);
    } catch {
      weekData[cat] = [];
    }
  }

  const wins = [];
  const issues = [];

  // --- Ranks summary ---
  let ranksSummary = "No rank data available";
  const ranksData = weekData.ranks?.filter(Boolean) || [];
  if (ranksData.length >= 2) {
    const first = ranksData[0];
    const last = ranksData[ranksData.length - 1];
    if (first.avgRank != null && last.avgRank != null) {
      const change = last.avgRank - first.avgRank;
      ranksSummary = `Avg rank: ${last.avgRank.toFixed(1)} (${arrow(-change)})`; // negative change = improvement
      if (change < 0) wins.push(`Avg rank improved by ${Math.abs(change).toFixed(1)} positions`);
      if (change > 2) issues.push(`Avg rank dropped by ${change.toFixed(1)} positions`);
    }
  }

  // --- Audit summary ---
  let auditSummary = "No audit data available";
  const auditData = weekData.audits?.filter(Boolean) || [];
  if (auditData.length >= 2) {
    const first = auditData[0];
    const last = auditData[auditData.length - 1];
    if (first.score != null && last.score != null) {
      const change = last.score - first.score;
      auditSummary = `Audit score: ${last.score}/100 (${arrow(change)})`;
      if (change > 0) wins.push(`Audit score improved by ${change} points`);
      if (change < -5) issues.push(`Audit score dropped by ${Math.abs(change)} points`);
    }
  }

  // --- Backlinks summary ---
  let backlinkSummary = "No backlink data available";
  const blData = weekData.backlinks?.filter(Boolean) || [];
  if (blData.length >= 2) {
    const first = blData[0];
    const last = blData[blData.length - 1];
    const net = (last.total || 0) - (first.total || 0);
    backlinkSummary = `Total: ${last.total || 0} (${arrow(net)} this week)`;
    if (net > 0) wins.push(`Gained ${net} new backlinks`);
    if (net < 0) issues.push(`Lost ${Math.abs(net)} backlinks`);
  }

  // --- CWV summary ---
  let cwvSummary = "No CWV data available";
  const cwvData = weekData.cwv?.filter(Boolean) || [];
  if (cwvData.length >= 2) {
    const first = cwvData[0];
    const last = cwvData[cwvData.length - 1];
    if (first.avgScore != null && last.avgScore != null) {
      const change = last.avgScore - first.avgScore;
      cwvSummary = `Avg perf score: ${last.avgScore}/100 (${arrow(change)})`;
      if (change > 5) wins.push(`CWV performance improved by ${change} points`);
      if (change < -5) issues.push(`CWV performance dropped by ${Math.abs(change)} points`);
    }
  }

  // --- E-E-A-T summary ---
  let eeatSummary = "No E-E-A-T data available";
  const eeatData = weekData.eeat?.filter(Boolean) || [];
  if (eeatData.length >= 2) {
    const first = eeatData[0];
    const last = eeatData[eeatData.length - 1];
    if (first.avgOverall != null && last.avgOverall != null) {
      const change = last.avgOverall - first.avgOverall;
      eeatSummary = `Avg E-E-A-T: ${last.avgOverall}/100 (${arrow(change)})`;
      if (change > 5) wins.push(`E-E-A-T scores improved by ${change} points`);
      if (change < -5) issues.push(`E-E-A-T scores dropped by ${Math.abs(change)} points`);
    }
  }

  // --- Search Console summary ---
  let scSummary = "No Search Console data available";
  const scData = weekData["search-console"]?.filter(Boolean) || [];
  if (scData.length >= 2) {
    const first = scData[0];
    const last = scData[scData.length - 1];
    const firstClicks = first.queries?.reduce((s, q) => s + q.clicks, 0) || 0;
    const lastClicks = last.queries?.reduce((s, q) => s + q.clicks, 0) || 0;
    const firstImpressions = first.queries?.reduce((s, q) => s + q.impressions, 0) || 0;
    const lastImpressions = last.queries?.reduce((s, q) => s + q.impressions, 0) || 0;
    const clickDelta = lastClicks - firstClicks;
    const impDelta = lastImpressions - firstImpressions;
    scSummary = `Clicks: ${lastClicks} (${arrow(clickDelta)}) | Impressions: ${lastImpressions} (${arrow(impDelta)})`;
    if (clickDelta > 0) wins.push(`Search clicks increased by ${clickDelta}`);
    if (clickDelta < 0) issues.push(`Search clicks decreased by ${Math.abs(clickDelta)}`);
  }

  // Build embeds
  const overviewLines = [
    `**Rankings:** ${ranksSummary}`,
    `**Audit:** ${auditSummary}`,
    `**Backlinks:** ${backlinkSummary}`,
    `**Core Web Vitals:** ${cwvSummary}`,
    `**E-E-A-T:** ${eeatSummary}`,
    `**Search Console:** ${scSummary}`,
  ];

  const overviewEmbed = {
    title: "📈 Weekly SEO Summary",
    description: overviewLines.join("\n"),
    color: GREEN,
    timestamp: new Date().toISOString(),
  };

  // Top wins
  const topWins = wins.slice(0, 3);
  const winsEmbed = {
    title: "🏆 Top Wins",
    description: topWins.length > 0
      ? topWins.map((w, i) => `${i + 1}. ${w}`).join("\n")
      : "No notable wins this week. Keep building!",
    color: GREEN,
    timestamp: new Date().toISOString(),
  };

  // Action items
  const topIssues = issues.slice(0, 3);
  const issuesEmbed = {
    title: "⚠️ Action Items",
    description: topIssues.length > 0
      ? topIssues.map((iss, i) => `${i + 1}. ${iss}`).join("\n")
      : "No critical issues this week. All systems healthy.",
    color: topIssues.length > 0 ? YELLOW : GREEN,
    timestamp: new Date().toISOString(),
  };

  await postToChannel("seo-dashboard", {
    embeds: [overviewEmbed, winsEmbed, issuesEmbed],
  });
}

run().catch(console.error);
