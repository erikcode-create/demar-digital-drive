import { getExternalLinks, getTopPages, authenticate } from "../../seo/lib/search-console.mjs";

export const name = "backlink-monitor";
export const category = "intelligence";
export const description = "Monitor site visibility via Google Search Console page performance data";

const GREEN = 3066993;
const YELLOW = 16776960;
const RED = 15158332;

export async function run(context) {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    if (!context.config.dryRun) {
      await context.discord.post("seo-dashboard", {
        embeds: [{
          title: "🔗 Link & Page Monitor",
          description: "Search Console not configured — add `GOOGLE_SERVICE_ACCOUNT_JSON` secret.",
          color: YELLOW,
          timestamp: new Date().toISOString(),
        }],
      });
    }
    return { success: false, summary: "GOOGLE_SERVICE_ACCOUNT_JSON not configured", data: null };
  }

  await authenticate();

  // Get top pages by clicks/impressions (this is the closest to "link value" from Search Console)
  const pagesResult = await getTopPages(28);
  const rows = pagesResult.rows || [];

  // Extract page-level metrics
  const pages = rows.map(row => ({
    page: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  })).sort((a, b) => b.clicks - a.clicks);

  const totalClicks = pages.reduce((sum, p) => sum + p.clicks, 0);
  const totalImpressions = pages.reduce((sum, p) => sum + p.impressions, 0);
  const avgPosition = pages.length > 0
    ? (pages.reduce((sum, p) => sum + p.position, 0) / pages.length).toFixed(1)
    : "N/A";

  const previous = context.state.read("intelligence", "backlinks");

  const data = {
    totalClicks,
    totalImpressions,
    avgPosition: parseFloat(avgPosition) || 0,
    pageCount: pages.length,
    topPages: pages.slice(0, 20),
    timestamp: new Date().toISOString(),
  };
  context.state.write("intelligence", "backlinks", data);

  // Compute changes
  let changes = "";
  if (previous) {
    const clickDiff = totalClicks - (previous.totalClicks || 0);
    const impDiff = totalImpressions - (previous.totalImpressions || 0);
    const clickSign = clickDiff > 0 ? "+" : "";
    const impSign = impDiff > 0 ? "+" : "";
    changes = `\n**Clicks:** ${clickSign}${clickDiff} | **Impressions:** ${impSign}${impDiff}`;
  }

  // Top 10 pages table
  let pageTable = "Page                          Clicks  Pos\n";
  pageTable += "─────────────────────────────  ──────  ────\n";
  const top10 = pages.slice(0, 10);
  for (const p of top10) {
    const path = new URL(p.page).pathname;
    const pName = path.length > 29 ? path.slice(0, 28) + "…" : path.padEnd(29);
    const clicks = String(p.clicks).padStart(6);
    const pos = p.position.toFixed(1).padStart(4);
    pageTable += `${pName}  ${clicks}  ${pos}\n`;
  }

  const summary = `${totalClicks} clicks, ${totalImpressions} impressions, avg pos ${avgPosition} (${pages.length} pages)`;

  if (!context.config.dryRun) {
    await context.discord.post("seo-dashboard", {
      embeds: [{
        title: "🔗 Link & Page Monitor",
        description: `**Clicks:** ${totalClicks} | **Impressions:** ${totalImpressions} | **Avg Position:** ${avgPosition}\n\`\`\`\n${pageTable}\`\`\`${changes}`,
        color: GREEN,
        timestamp: new Date().toISOString(),
      }],
    });
  }

  return { success: true, summary, data };
}
