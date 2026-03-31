import { checkRanks } from "../../seo/lib/serper.mjs";

export const name = "rank-tracker";
export const category = "intelligence";
export const description = "Track keyword rankings via Serper API and detect position changes";

const KEYWORDS = [
  // Brand
  "demar transportation", "demar freight",
  // Service
  "dry van shipping", "reefer freight", "flatbed trucking", "hazmat shipping",
  "ftl freight", "ltl freight", "3pl services", "freight warehousing",
  // Location
  "freight shipping reno", "trucking company nevada", "freight carrier reno nv",
  // Long-tail
  "how to ship refrigerated goods", "freight shipping cost calculator",
  "types of freight trailers", "how to choose freight carrier", "ftl vs ltl shipping",
  // Commercial
  "freight quote", "get freight quote online", "freight shipping rates",
  "trucking company near me",
  // Blog
  "why freight quote keeps changing", "small business freight shipping",
  "emergency expedited freight",
  // Additional high-value
  "freight broker near me", "hazmat freight carrier",
  "refrigerated trucking company", "flatbed shipping rates", "warehouse and distribution services",
];

const FEATURE_CODES = {
  featured_snippet: "FS",
  people_also_ask: "PAA",
  local_pack: "LP",
  knowledge_panel: "KP",
  image_pack: "IMG",
  video: "VID",
  top_stories: "NEWS",
  sitelinks: "SL",
};

function abbreviateFeatures(features) {
  if (!features || features.length === 0) return "";
  return features
    .map((f) => FEATURE_CODES[f] || f)
    .join(",");
}

function computeStats(results) {
  const ranked = results.filter((r) => r.rank !== null && r.rank !== undefined);
  const avgRank = ranked.length > 0
    ? Math.round(ranked.reduce((sum, r) => sum + r.rank, 0) / ranked.length)
    : null;
  const top10 = ranked.filter((r) => r.rank <= 10).length;
  const top20 = ranked.filter((r) => r.rank <= 20).length;
  const top50 = ranked.filter((r) => r.rank <= 50).length;
  const top100 = ranked.filter((r) => r.rank <= 100).length;
  const unranked = results.length - ranked.length;

  return { avgRank, top10, top20, top50, top100, unranked, totalTracked: results.length };
}

function buildTable(results, previous, getDelta, formatDelta) {
  const prevMap = new Map();
  if (previous?.keywords) {
    for (const entry of previous.keywords) {
      prevMap.set(entry.keyword, entry.rank);
    }
  }

  const header = "Keyword                          | Rank | Chg   | SERP";
  const divider = "-".repeat(header.length);
  const rows = [header, divider];

  for (const r of results) {
    const kw = r.keyword.length > 32
      ? r.keyword.substring(0, 30) + ".."
      : r.keyword.padEnd(32);
    const rank = r.rank != null ? String(r.rank).padStart(4) : "   -";
    const prevRank = prevMap.get(r.keyword);
    let change;
    if (r.rank == null) {
      change = prevRank != null ? "lost " : "  -  ";
    } else if (prevRank == null) {
      change = " new ";
    } else {
      change = formatDelta(prevRank, r.rank).padStart(5);
    }
    const features = abbreviateFeatures(r.features);
    rows.push(`${kw} | ${rank} | ${change} | ${features}`);
  }

  return rows.join("\n");
}

function pickColor(currentAvg, previousAvg) {
  if (currentAvg == null) return 15158332; // red -- nothing ranked
  if (previousAvg == null) return 3066993; // green -- first run
  if (currentAvg < previousAvg) return 3066993; // green -- improved (lower rank = better)
  if (currentAvg > previousAvg) return 15158332; // red -- declined
  return 16776960; // yellow -- unchanged
}

export async function run(context) {
  if (!process.env.SERPER_API_KEY) {
    if (!context.config.dryRun) {
      await context.discord.post("seo-dashboard", {
        embeds: [{
          title: "\ud83d\udcca Keyword Rank Tracker",
          description: "Serper not configured -- add `SERPER_API_KEY` secret.",
          color: 16776960,
          timestamp: new Date().toISOString(),
        }],
      });
    }
    return { success: false, summary: "SERPER_API_KEY not configured", data: null };
  }

  console.log(`Checking ranks for ${KEYWORDS.length} keywords...`);

  const results = await checkRanks(KEYWORDS);
  const previous = context.state.read("intelligence", "ranks");
  const stats = computeStats(results);
  const prevStats = previous?.stats || {};

  const timestamp = new Date().toISOString();
  const data = { keywords: results, stats, summary: { averageRank: stats.avgRank }, timestamp };
  context.state.write("intelligence", "ranks", data);

  // Build summary line
  const avgLabel = stats.avgRank != null ? `Avg rank: **${stats.avgRank}**` : "No keywords ranking";
  const summaryParts = [
    avgLabel,
    `Top 10: **${stats.top10}**`,
    `Top 20: **${stats.top20}**`,
    `Top 50: **${stats.top50}**`,
    `Top 100: **${stats.top100}**`,
    `Unranked: **${stats.unranked}**`,
  ];
  const summaryLine = summaryParts.join(" | ");

  // Build keyword table
  const table = buildTable(results, previous, context.state.getDelta, context.state.formatDelta);
  let description = `${summaryLine}\n\n\`\`\`\n${table}\n\`\`\``;

  // Truncate if too long for Discord (4096 char limit on embed description)
  if (description.length > 3900) {
    const cutoff = description.lastIndexOf("\n", 3850);
    const shown = description.substring(0, cutoff).split("\n").length - 4;
    const remaining = results.length - shown;
    description = description.substring(0, cutoff) + `\n... and ${remaining} more keywords\n\`\`\``;
  }

  const color = pickColor(stats.avgRank, prevStats.avgRank);
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!context.config.dryRun) {
    await context.discord.post("seo-dashboard", {
      embeds: [
        {
          title: "\ud83d\udcca Keyword Rank Tracker",
          description,
          color,
          footer: { text: `${stats.totalTracked} keywords tracked | ${dateStr}` },
          timestamp,
        },
      ],
    });
  }

  const summaryText = stats.avgRank != null
    ? `Avg rank ${stats.avgRank}, ${stats.top10} in top 10, ${stats.unranked} unranked`
    : `No keywords ranking out of ${stats.totalTracked} tracked`;

  return { success: true, summary: summaryText, data };
}
