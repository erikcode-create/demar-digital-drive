import "dotenv/config";
import { postToChannel } from "../../lib/discord.mjs";
import { saveDaily, loadPrevious, formatDelta } from "../lib/history.mjs";
import { getAllPages, SITE_URL } from "../lib/pages.mjs";

const GREEN = 3066993;
const YELLOW = 16776960;
const RED = 15158332;

const PRIORITY_PATHS = [
  "/", "/about", "/quote", "/services", "/services/dry-van",
  "/services/reefer", "/services/flatbed", "/services/hazmat",
  "/services/ftl", "/services/ltl",
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function rateMetric(value, good, needsImprovement) {
  if (value < good) return "pass";
  if (value < needsImprovement) return "warn";
  return "fail";
}

function statusIcon(rating) {
  if (rating === "pass") return "✅";
  if (rating === "warn") return "⚠️";
  return "❌";
}

async function fetchCWV(url) {
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance&strategy=mobile`;
  const res = await fetch(apiUrl);
  if (!res.ok) {
    console.error(`PSI error for ${url}: ${res.status}`);
    return null;
  }
  const data = await res.json();
  const audits = data.lighthouseResult?.audits;
  const categories = data.lighthouseResult?.categories;
  if (!audits || !categories) return null;

  const score = Math.round((categories.performance?.score || 0) * 100);
  const lcp = audits["largest-contentful-paint"]?.numericValue || 0;
  const cls = audits["cumulative-layout-shift"]?.numericValue || 0;
  const tbt = audits["total-blocking-time"]?.numericValue || 0;
  const ttfb = audits["server-response-time"]?.numericValue || 0;

  return { url, score, lcp, cls, tbt, ttfb };
}

async function run() {
  // Pick top 10 pages: prioritize known important paths
  const allPages = await getAllPages();
  const pages = [];
  const used = new Set();

  for (const path of PRIORITY_PATHS) {
    const fullUrl = `${SITE_URL}${path}`;
    const match = allPages.find(p => p === fullUrl || p === path);
    if (match) {
      pages.push(fullUrl);
      used.add(path);
    } else {
      pages.push(fullUrl);
    }
    if (pages.length >= 10) break;
  }

  // Fill remaining with other pages
  if (pages.length < 10) {
    for (const p of allPages) {
      const url = p.startsWith("http") ? p : `${SITE_URL}${p}`;
      if (!pages.includes(url)) {
        pages.push(url);
        if (pages.length >= 10) break;
      }
    }
  }

  const results = [];
  for (const url of pages) {
    console.log(`Fetching CWV for ${url}...`);
    const result = await fetchCWV(url);
    if (result) results.push(result);
    await sleep(2000); // Rate limit
  }

  if (results.length === 0) {
    await postToChannel("seo-dashboard", {
      embeds: [{
        title: "⚡ Core Web Vitals",
        description: "Could not fetch any PageSpeed data. API may be rate-limited.",
        color: RED,
        timestamp: new Date().toISOString(),
      }],
    });
    return;
  }

  const avgScore = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);
  const data = { pages: results, avgScore, timestamp: new Date().toISOString() };
  await saveDaily("cwv", data);

  const previous = await loadPrevious("cwv");

  // Build table
  let table = "Page            Score  LCP     CLS    TBT     TTFB\n";
  table += "──────────────  ─────  ──────  ─────  ──────  ──────\n";

  for (const r of results) {
    const path = r.url.replace(/^https?:\/\/[^/]+/, "") || "/";
    const name = path.length > 14 ? path.slice(0, 13) + "…" : path.padEnd(14);

    const lcpRating = rateMetric(r.lcp, 2500, 4000);
    const clsRating = rateMetric(r.cls, 0.1, 0.25);
    const tbtRating = rateMetric(r.tbt, 200, 600);
    const ttfbRating = rateMetric(r.ttfb, 800, 1800);

    const scoreStr = String(r.score).padStart(3);
    const lcpStr = `${(r.lcp / 1000).toFixed(1)}s`.padStart(5) + statusIcon(lcpRating);
    const clsStr = r.cls.toFixed(3).padStart(5) + statusIcon(clsRating);
    const tbtStr = `${Math.round(r.tbt)}ms`.padStart(5) + statusIcon(tbtRating);
    const ttfbStr = `${Math.round(r.ttfb)}ms`.padStart(5) + statusIcon(ttfbRating);

    table += `${name}  ${scoreStr}    ${lcpStr} ${clsStr} ${tbtStr} ${ttfbStr}\n`;
  }

  let trendNote = `\n**Avg Score:** ${avgScore}/100`;
  if (previous?.avgScore) {
    trendNote += ` (${formatDelta(avgScore - previous.avgScore)})`;
  }

  const color = avgScore >= 90 ? GREEN : avgScore >= 50 ? YELLOW : RED;

  const embed = {
    title: "⚡ Core Web Vitals",
    description: `\`\`\`\n${table}\`\`\`${trendNote}\n\nThresholds: LCP <2.5s, CLS <0.1, TBT <200ms, TTFB <800ms`,
    color,
    timestamp: new Date().toISOString(),
  };

  await postToChannel("seo-dashboard", { embeds: [embed] });
}

run().catch(console.error);
