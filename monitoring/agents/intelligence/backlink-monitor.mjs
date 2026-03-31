import { getBacklinks, authenticate } from "../../seo/lib/search-console.mjs";

export const name = "backlink-monitor";
export const category = "intelligence";
export const description = "Monitor backlink profile via Google Search Console Links API";

const GREEN = 3066993;
const YELLOW = 16776960;
const RED = 15158332;

export async function run(context) {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    if (!context.config.dryRun) {
      await context.discord.post("seo-dashboard", {
        embeds: [{
          title: "\ud83d\udd17 Backlink Monitor",
          description: "Search Console not configured -- add `GOOGLE_SERVICE_ACCOUNT_JSON` secret.",
          color: YELLOW,
          timestamp: new Date().toISOString(),
        }],
      });
    }
    return { success: false, summary: "GOOGLE_SERVICE_ACCOUNT_JSON not configured", data: null };
  }

  await authenticate();

  const backlinks = await getBacklinks();
  const total = backlinks.totalLinks || 0;
  const domains = backlinks.topDomains || [];
  const pages = backlinks.topPages || [];

  const previous = context.state.read("intelligence", "backlinks");

  const data = { total, domains, pages, timestamp: new Date().toISOString() };
  context.state.write("intelligence", "backlinks", data);

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
  domainTable += "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500  \u2500\u2500\u2500\u2500\u2500\n";
  const top10 = domains.slice(0, 10);
  for (const d of top10) {
    const dName = d.domain.length > 29 ? d.domain.slice(0, 28) + "\u2026" : d.domain.padEnd(29);
    const count = String(d.count).padStart(5);
    domainTable += `${dName}  ${count}\n`;
  }

  const prevTotal = previous?.total || 0;
  const delta = total - prevTotal;
  const sign = delta > 0 ? "+" : "";
  const totalLine = `**Total backlinks:** ${total}${previous ? ` (${sign}${delta})` : ""}`;

  const color = total > prevTotal ? GREEN : total < prevTotal ? RED : GREEN;

  if (!context.config.dryRun) {
    await context.discord.post("seo-dashboard", {
      embeds: [{
        title: "\ud83d\udd17 Backlink Monitor",
        description: `${totalLine}\n\`\`\`\n${domainTable}\`\`\`${newLost}`,
        color,
        timestamp: new Date().toISOString(),
      }],
    });
  }

  return {
    success: true,
    summary: `${total} total backlinks, ${domains.length} referring domains${previous ? ` (${sign}${delta})` : ""}`,
    data,
  };
}
