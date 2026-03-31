import { getTopQueries, getTopPages, authenticate } from "../../seo/lib/search-console.mjs";

export const name = "search-console";
export const category = "intelligence";
export const description = "Pull top queries, top pages, and CTR opportunities from Google Search Console";

const GREEN = 3066993;
const YELLOW = 16776960;

export async function run(context) {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    if (!context.config.dryRun) {
      await context.discord.post("seo-dashboard", {
        embeds: [{
          title: "\ud83d\udd0e Search Console Dashboard",
          description: "Search Console not configured -- add `GOOGLE_SERVICE_ACCOUNT_JSON` secret.",
          color: YELLOW,
          timestamp: new Date().toISOString(),
        }],
      });
    }
    return { success: false, summary: "GOOGLE_SERVICE_ACCOUNT_JSON not configured", data: null };
  }

  await authenticate();

  const queriesResponse = await getTopQueries(28);
  const pagesResponse = await getTopPages(28);

  const queries = (queriesResponse.rows || []).slice(0, 20).map(row => ({
    query: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  }));

  const pages = (pagesResponse.rows || []).slice(0, 20).map(row => ({
    page: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  }));

  const previous = context.state.read("intelligence", "search-console");

  const data = { queries, pages, timestamp: new Date().toISOString() };
  context.state.write("intelligence", "search-console", data);

  // Build queries table
  let queryTable = "Query                Clicks  Impr   CTR%   Pos\n";
  queryTable += "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500  \u2500\u2500\u2500\u2500\u2500\u2500  \u2500\u2500\u2500\u2500\u2500  \u2500\u2500\u2500\u2500\u2500  \u2500\u2500\u2500\u2500\n";
  for (const q of queries) {
    const qName = q.query.length > 19 ? q.query.slice(0, 18) + "\u2026" : q.query.padEnd(19);
    const clicks = String(q.clicks).padStart(6);
    const impressions = String(q.impressions).padStart(5);
    const ctr = (q.ctr * 100).toFixed(1).padStart(5);
    const position = q.position.toFixed(1).padStart(4);
    queryTable += `${qName}  ${clicks}  ${impressions}  ${ctr}  ${position}\n`;
  }

  // Build pages table
  let pageTable = "Page                          Clicks  Impr\n";
  pageTable += "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500  \u2500\u2500\u2500\u2500\u2500\u2500  \u2500\u2500\u2500\u2500\u2500\n";
  for (const p of pages) {
    const path = p.page.replace(/^https?:\/\/[^/]+/, "") || "/";
    const pName = path.length > 28 ? path.slice(0, 27) + "\u2026" : path.padEnd(28);
    const clicks = String(p.clicks).padStart(6);
    const impressions = String(p.impressions).padStart(5);
    pageTable += `${pName}  ${clicks}  ${impressions}\n`;
  }

  // Compute trend info
  let trendNote = "";
  if (previous?.queries) {
    const prevClicks = previous.queries.reduce((s, q) => s + q.clicks, 0);
    const currClicks = queries.reduce((s, q) => s + q.clicks, 0);
    const delta = currClicks - prevClicks;
    const sign = delta > 0 ? "+" : "";
    trendNote = `\nTotal clicks: ${currClicks} (${sign}${delta})`;
  }

  if (!context.config.dryRun) {
    const embeds = [
      {
        title: "\ud83d\udd0e Top Queries",
        description: `\`\`\`\n${queryTable}\`\`\`${trendNote}`,
        color: GREEN,
        timestamp: new Date().toISOString(),
      },
      {
        title: "\ud83d\udcc4 Top Pages",
        description: `\`\`\`\n${pageTable}\`\`\``,
        color: GREEN,
        timestamp: new Date().toISOString(),
      },
    ];

    await context.discord.post("seo-dashboard", { embeds });
  }

  const totalClicks = queries.reduce((s, q) => s + q.clicks, 0);
  return {
    success: true,
    summary: `${queries.length} queries, ${pages.length} pages, ${totalClicks} total clicks`,
    data,
  };
}
