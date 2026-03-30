import "dotenv/config";
import { postToChannel } from "../../lib/discord.mjs";
import { saveDaily, loadPrevious, formatDelta } from "../lib/history.mjs";
import { getBacklinks, authenticate } from "../lib/search-console.mjs";

const GREEN = 3066993;
const YELLOW = 16776960;
const RED = 15158332;

async function run() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    await postToChannel("seo-dashboard", {
      embeds: [{
        title: "🔗 Backlink Monitor",
        description: "Search Console not configured — add `GOOGLE_SERVICE_ACCOUNT_JSON` secret.",
        color: YELLOW,
        timestamp: new Date().toISOString(),
      }],
    });
    return;
  }

  await authenticate();

  const backlinks = await getBacklinks();
  const total = backlinks.totalLinks || 0;
  const domains = backlinks.topDomains || [];
  const pages = backlinks.topPages || [];

  const data = { total, domains, pages, timestamp: new Date().toISOString() };
  await saveDaily("backlinks", data);

  const previous = await loadPrevious("backlinks");

  // Compute new/lost
  let newLost = "";
  if (previous) {
    const diff = total - (previous.total || 0);
    if (diff > 0) {
      newLost = `\n**+${diff} new links** since last check`;
    } else if (diff < 0) {
      newLost = `\n**${diff} links lost** since last check`;
    } else {
      newLost = "\nNo change since last check";
    }

    // Identify new/lost domains
    const prevDomainSet = new Set((previous.domains || []).map(d => d.domain));
    const currDomainSet = new Set(domains.map(d => d.domain));
    const newDomains = domains.filter(d => !prevDomainSet.has(d.domain));
    const lostDomains = (previous.domains || []).filter(d => !currDomainSet.has(d.domain));

    if (newDomains.length > 0) {
      newLost += `\n**New domains:** ${newDomains.map(d => d.domain).join(", ")}`;
    }
    if (lostDomains.length > 0) {
      newLost += `\n**Lost domains:** ${lostDomains.map(d => d.domain).join(", ")}`;
    }
  }

  // Top 10 referring domains table
  let domainTable = "Domain                         Links\n";
  domainTable += "─────────────────────────────  ─────\n";
  const top10 = domains.slice(0, 10);
  for (const d of top10) {
    const name = d.domain.length > 29 ? d.domain.slice(0, 28) + "…" : d.domain.padEnd(29);
    const count = String(d.count).padStart(5);
    domainTable += `${name}  ${count}\n`;
  }

  const totalLine = `**Total backlinks:** ${total}${previous ? ` (${formatDelta(total - (previous.total || 0))})` : ""}`;

  const embed = {
    title: "🔗 Backlink Monitor",
    description: `${totalLine}\n\`\`\`\n${domainTable}\`\`\`${newLost}`,
    color: total > (previous?.total || 0) ? GREEN : total < (previous?.total || 0) ? RED : GREEN,
    timestamp: new Date().toISOString(),
  };

  await postToChannel("seo-dashboard", { embeds: [embed] });
}

run().catch(console.error);
