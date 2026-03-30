import "dotenv/config";
import { postToChannel } from "../../lib/discord.mjs";
import { saveDaily, loadPrevious, formatDelta } from "../lib/history.mjs";
import { getTopQueries, getTopPages, authenticate } from "../lib/search-console.mjs";

const GREEN = 3066993;
const YELLOW = 16776960;
const RED = 15158332;

async function run() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    await postToChannel("seo-dashboard", {
      embeds: [{
        title: "🔎 Search Console Dashboard",
        description: "Search Console not configured — add `GOOGLE_SERVICE_ACCOUNT_JSON` secret.",
        color: YELLOW,
        timestamp: new Date().toISOString(),
      }],
    });
    return;
  }

  await authenticate();

  const queries = await getTopQueries(20, 28);
  const pages = await getTopPages(20, 28);

  const data = { queries, pages, timestamp: new Date().toISOString() };
  await saveDaily("search-console", data);

  const previous = await loadPrevious("search-console");

  // Build queries table
  let queryTable = "Query                Clicks  Impr   CTR%   Pos\n";
  queryTable += "───────────────────  ──────  ─────  ─────  ────\n";
  for (const q of queries) {
    const name = q.query.length > 19 ? q.query.slice(0, 18) + "…" : q.query.padEnd(19);
    const clicks = String(q.clicks).padStart(6);
    const impressions = String(q.impressions).padStart(5);
    const ctr = (q.ctr * 100).toFixed(1).padStart(5);
    const position = q.position.toFixed(1).padStart(4);
    queryTable += `${name}  ${clicks}  ${impressions}  ${ctr}  ${position}\n`;
  }

  // Build pages table
  let pageTable = "Page                          Clicks  Impr\n";
  pageTable += "────────────────────────────  ──────  ─────\n";
  for (const p of pages) {
    const path = p.page.replace(/^https?:\/\/[^/]+/, "") || "/";
    const name = path.length > 28 ? path.slice(0, 27) + "…" : path.padEnd(28);
    const clicks = String(p.clicks).padStart(6);
    const impressions = String(p.impressions).padStart(5);
    pageTable += `${name}  ${clicks}  ${impressions}\n`;
  }

  // Compute trend info
  let trendNote = "";
  if (previous?.queries) {
    const prevClicks = previous.queries.reduce((s, q) => s + q.clicks, 0);
    const currClicks = queries.reduce((s, q) => s + q.clicks, 0);
    trendNote = `\nTotal clicks: ${currClicks} (${formatDelta(currClicks - prevClicks)})`;
  }

  const embeds = [
    {
      title: "🔎 Top Queries",
      description: `\`\`\`\n${queryTable}\`\`\`${trendNote}`,
      color: GREEN,
      timestamp: new Date().toISOString(),
    },
    {
      title: "📄 Top Pages",
      description: `\`\`\`\n${pageTable}\`\`\``,
      color: GREEN,
      timestamp: new Date().toISOString(),
    },
  ];

  await postToChannel("seo-dashboard", { embeds });
}

run().catch(console.error);
