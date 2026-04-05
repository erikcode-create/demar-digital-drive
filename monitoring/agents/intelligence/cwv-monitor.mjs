import { getAllPages, SITE_URL } from "../../seo/lib/pages.mjs";

export const name = "cwv-monitor";
export const category = "intelligence";
export const description = "Monitor Core Web Vitals via PageSpeed Insights API (5 rotating pages per run)";

const GREEN = 3066993;
const YELLOW = 16776960;
const RED = 15158332;

const PRIORITY_PATHS = [
  "/", "/about", "/quote", "/services", "/services/dry-van",
  "/services/reefer", "/services/flatbed", "/services/hazmat",
  "/services/ftl", "/services/ltl",
];

const PAGES_PER_RUN = process.env.GOOGLE_PSI_API_KEY ? 10 : 3;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function rateMetric(value, good, needsImprovement) {
  if (value < good) return "pass";
  if (value < needsImprovement) return "warn";
  return "fail";
}

function statusIcon(rating) {
  if (rating === "pass") return "\u2705";
  if (rating === "warn") return "\u26a0\ufe0f";
  return "\u274c";
}

async function fetchCWV(url, retries = 2) {
  const apiKey = process.env.GOOGLE_PSI_API_KEY;
  const keyParam = apiKey ? `&key=${apiKey}` : "";
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance&strategy=mobile${keyParam}`;
  const res = await fetch(apiUrl);
  if (res.status === 429 && retries > 0) {
    console.log(`Rate limited on ${url}, waiting 30s before retry...`);
    await sleep(30000);
    return fetchCWV(url, retries - 1);
  }
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

/**
 * Pick which pages to check this run, rotating through all pages.
 * Uses state to track which offset we're at.
 */
function pickPages(context) {
  const allPages = getAllPages();
  const allUrls = [];
  const used = new Set();

  // Priority paths first
  for (const path of PRIORITY_PATHS) {
    const fullUrl = `${SITE_URL}${path}`;
    allUrls.push(fullUrl);
    used.add(path);
  }

  // Fill remaining with other pages
  for (const p of allPages) {
    const url = p.path ? `${SITE_URL}${p.path}` : (p.url || p);
    if (!used.has(p.path)) {
      allUrls.push(url);
      used.add(p.path);
    }
  }

  // Read rotation offset from previous state
  const previous = context.state.read("intelligence", "cwv");
  const lastOffset = previous?.rotationOffset || 0;
  const offset = lastOffset >= allUrls.length ? 0 : lastOffset;

  // Pick PAGES_PER_RUN pages starting from offset
  const selected = [];
  for (let i = 0; i < PAGES_PER_RUN && i < allUrls.length; i++) {
    const idx = (offset + i) % allUrls.length;
    selected.push(allUrls[idx]);
  }

  const nextOffset = (offset + PAGES_PER_RUN) % allUrls.length;

  return { selected, nextOffset, totalPages: allUrls.length };
}

export async function run(context) {
  const { selected: pages, nextOffset, totalPages } = pickPages(context);

  console.log(`Checking CWV for ${pages.length} pages (of ${totalPages} total, rotating)...`);

  const results = [];
  for (const url of pages) {
    console.log(`Fetching CWV for ${url}...`);
    const result = await fetchCWV(url);
    if (result) results.push(result);
    if (pages.indexOf(url) < pages.length - 1) {
      await sleep(process.env.GOOGLE_PSI_API_KEY ? 1000 : 5000); // 1s with key, 5s without
    }
  }

  if (results.length === 0) {
    if (!context.config.dryRun) {
      await context.discord.post("seo-dashboard", {
        embeds: [{
          title: "\u26a1 Core Web Vitals",
          description: "Could not fetch any PageSpeed data. API may be rate-limited.",
          color: RED,
          timestamp: new Date().toISOString(),
        }],
      });
    }
    return { success: false, summary: "No PageSpeed data returned", data: null };
  }

  const avgScore = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);
  const previous = context.state.read("intelligence", "cwv");

  const data = {
    pages: results,
    avgScore,
    rotationOffset: nextOffset,
    totalPagesTracked: totalPages,
    timestamp: new Date().toISOString(),
  };
  context.state.write("intelligence", "cwv", data);

  // Build table
  let table = "Page            Score  LCP     CLS    TBT     TTFB\n";
  table += "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500  \u2500\u2500\u2500\u2500\u2500  \u2500\u2500\u2500\u2500\u2500\u2500  \u2500\u2500\u2500\u2500\u2500  \u2500\u2500\u2500\u2500\u2500\u2500  \u2500\u2500\u2500\u2500\u2500\u2500\n";

  for (const r of results) {
    const path = r.url.replace(/^https?:\/\/[^/]+/, "") || "/";
    const pageName = path.length > 14 ? path.slice(0, 13) + "\u2026" : path.padEnd(14);

    const lcpRating = rateMetric(r.lcp, 2500, 4000);
    const clsRating = rateMetric(r.cls, 0.1, 0.25);
    const tbtRating = rateMetric(r.tbt, 200, 600);
    const ttfbRating = rateMetric(r.ttfb, 800, 1800);

    const scoreStr = String(r.score).padStart(3);
    const lcpStr = `${(r.lcp / 1000).toFixed(1)}s`.padStart(5) + statusIcon(lcpRating);
    const clsStr = r.cls.toFixed(3).padStart(5) + statusIcon(clsRating);
    const tbtStr = `${Math.round(r.tbt)}ms`.padStart(5) + statusIcon(tbtRating);
    const ttfbStr = `${Math.round(r.ttfb)}ms`.padStart(5) + statusIcon(ttfbRating);

    table += `${pageName}  ${scoreStr}    ${lcpStr} ${clsStr} ${tbtStr} ${ttfbStr}\n`;
  }

  let trendNote = `\n**Avg Score:** ${avgScore}/100`;
  if (previous?.avgScore) {
    const delta = avgScore - previous.avgScore;
    const sign = delta > 0 ? "+" : "";
    trendNote += ` (${sign}${delta})`;
  }

  const color = avgScore >= 90 ? GREEN : avgScore >= 50 ? YELLOW : RED;

  if (!context.config.dryRun) {
    await context.discord.post("seo-dashboard", {
      embeds: [{
        title: "\u26a1 Core Web Vitals",
        description: `\`\`\`\n${table}\`\`\`${trendNote}\n\nThresholds: LCP <2.5s, CLS <0.1, TBT <200ms, TTFB <800ms\n_Checked ${results.length} of ${totalPages} pages (rotating ${PAGES_PER_RUN}/run)_`,
        color,
        timestamp: new Date().toISOString(),
      }],
    });
  }

  return {
    success: true,
    summary: `Avg score ${avgScore}/100 across ${results.length} pages`,
    data,
  };
}
