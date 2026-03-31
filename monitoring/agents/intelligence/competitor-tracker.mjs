import { getCompetitorDomains, checkRank } from "../../seo/lib/serper.mjs";

export const name = "competitor-tracker";
export const category = "intelligence";
export const description = "Track competitor rankings across target keywords via Serper API";

const GREEN = 3066993;
const YELLOW = 16776960;
const RED = 15158332;

const TRACKED_KEYWORDS = [
  "dry van shipping", "reefer freight", "flatbed trucking", "hazmat shipping",
  "ftl freight", "ltl freight", "freight quote", "3pl services",
  "freight shipping rates", "trucking company near me",
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function run(context) {
  if (!process.env.SERPER_API_KEY) {
    if (!context.config.dryRun) {
      await context.discord.post("seo-dashboard", {
        embeds: [{
          title: "\ud83c\udfc1 Competitor Tracker",
          description: "Serper not configured -- add `SERPER_API_KEY` secret.",
          color: YELLOW,
          timestamp: new Date().toISOString(),
        }],
      });
    }
    return { success: false, summary: "SERPER_API_KEY not configured", data: null };
  }

  console.log(`Discovering competitors across ${TRACKED_KEYWORDS.length} keywords...`);

  const allResults = await getCompetitorDomains(TRACKED_KEYWORDS);
  const competitors = allResults.slice(0, 5);
  const competitorDomains = competitors.map(c => c.domain);

  // Build rank matrix: for each keyword, get our rank and each competitor's rank
  // We use checkRank (singular) for our domain, then need to re-query for competitor domains
  const matrix = [];
  for (let i = 0; i < TRACKED_KEYWORDS.length; i++) {
    const kw = TRACKED_KEYWORDS[i];
    if (i > 0) await sleep(1000);

    console.log(`Checking ranks for: ${kw}`);
    const ourResult = await checkRank(kw, "demartransportation.com");
    const row = { keyword: kw, ourRank: ourResult.rank || "-" };

    // Check each competitor's rank for this keyword
    for (const domain of competitorDomains) {
      await sleep(500);
      const compResult = await checkRank(kw, domain);
      row[domain] = compResult.rank || "-";
    }

    matrix.push(row);
  }

  const previous = context.state.read("intelligence", "competitors");

  const data = { competitors, matrix, timestamp: new Date().toISOString() };
  context.state.write("intelligence", "competitors", data);

  // Build compact competitor labels (first 8 chars of domain)
  const labels = competitorDomains.map(d => {
    const short = d.replace(/\.com$|\.net$|\.org$/, "");
    return short.length > 8 ? short.slice(0, 8) : short;
  });

  // Build table header
  const kwCol = 22;
  const rankCol = 4;
  let header = "Keyword".padEnd(kwCol) + "  Us";
  for (const label of labels) {
    header += "  " + label.padStart(rankCol > label.length ? rankCol : label.length);
  }
  header += "\n" + "\u2500".repeat(header.length) + "\n";

  let tableBody = "";
  let behindCount = 0;
  for (const row of matrix) {
    const kwName = row.keyword.length > kwCol - 1
      ? row.keyword.slice(0, kwCol - 2) + "\u2026"
      : row.keyword.padEnd(kwCol);
    let line = kwName + "  " + String(row.ourRank).padStart(3);
    for (const domain of competitorDomains) {
      const rank = row[domain];
      const val = String(rank).padStart(rankCol);
      line += "  " + val;
      if (typeof row.ourRank === "number" && typeof rank === "number" && rank < row.ourRank) {
        behindCount++;
      }
    }
    tableBody += line + "\n";
  }

  const color = behindCount > 15 ? RED : behindCount > 5 ? YELLOW : GREEN;

  let description = `**Top 5 competitors tracked across ${TRACKED_KEYWORDS.length} keywords**\n`;
  description += `Domains: ${competitorDomains.join(", ")}\n\n`;
  description += `\`\`\`\n${header}${tableBody}\`\`\``;

  if (behindCount > 0) {
    description += `\n:warning: We rank behind competitors on **${behindCount}** keyword/domain pairs`;
  }

  if (!context.config.dryRun) {
    await context.discord.post("seo-dashboard", {
      embeds: [{
        title: "\ud83c\udfc1 Competitor Tracker",
        description,
        color,
        timestamp: new Date().toISOString(),
      }],
    });
  }

  return {
    success: true,
    summary: `${competitorDomains.length} competitors tracked, behind on ${behindCount} keyword/domain pairs`,
    data,
  };
}
