import "dotenv/config";
import { postToChannel } from "../../lib/discord.mjs";
import { saveDaily, loadPrevious, formatDelta } from "../lib/history.mjs";
import { getCompetitorDomains, checkRanks } from "../lib/serper.mjs";

const GREEN = 3066993;
const YELLOW = 16776960;
const RED = 15158332;

const TRACKED_KEYWORDS = [
  "dry van shipping", "reefer freight", "flatbed trucking", "hazmat shipping",
  "ftl freight", "ltl freight", "freight quote", "3pl services",
  "freight shipping rates", "trucking company near me",
];

async function run() {
  if (!process.env.SERPER_API_KEY) {
    await postToChannel("seo-dashboard", {
      embeds: [{
        title: "🏁 Competitor Tracker",
        description: "Serper not configured — add `SERPER_API_KEY` secret.",
        color: YELLOW,
        timestamp: new Date().toISOString(),
      }],
    });
    return;
  }

  const allResults = await getCompetitorDomains(TRACKED_KEYWORDS);
  const competitors = allResults.slice(0, 5);
  const competitorDomains = competitors.map(c => c.domain);

  // Build rank matrix: keyword -> { our rank, competitor ranks }
  const matrix = [];
  for (const kw of TRACKED_KEYWORDS) {
    const ranks = await checkRanks(kw);
    const row = { keyword: kw, ourRank: ranks.ourRank || "-" };
    for (const domain of competitorDomains) {
      row[domain] = ranks.competitors?.[domain] || "-";
    }
    matrix.push(row);
  }

  const data = { competitors, matrix, timestamp: new Date().toISOString() };
  await saveDaily("competitors", data);

  const previous = await loadPrevious("competitors");

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
  header += "\n" + "─".repeat(header.length) + "\n";

  let tableBody = "";
  let behindCount = 0;
  for (const row of matrix) {
    const kwName = row.keyword.length > kwCol - 1
      ? row.keyword.slice(0, kwCol - 2) + "…"
      : row.keyword.padEnd(kwCol);
    let line = kwName + "  " + String(row.ourRank).padStart(3);
    for (const domain of competitorDomains) {
      const rank = row[domain];
      const val = String(rank).padStart(rankCol);
      line += "  " + val;
      // Track where we're behind
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

  const embed = {
    title: "🏁 Competitor Tracker",
    description,
    color,
    timestamp: new Date().toISOString(),
  };

  await postToChannel("seo-dashboard", { embeds: [embed] });
}

run().catch(console.error);
