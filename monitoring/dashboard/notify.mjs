import { postToChannel } from "../lib/discord.mjs";

/**
 * Post dashboard update notification to Discord.
 */
export async function notifyDashboardUpdate(opts) {
  const {
    score = 0, delta = 0, dashboardUrl,
    agentsPassed = 0, agentsTotal = 0,
    approved = 0, rejected = 0, issues = 0,
  } = opts;

  const color = score >= 80 ? 3066993 : score >= 60 ? 6750054 : score >= 40 ? 16776960 : 15158332;
  const deltaText = delta > 0 ? `▲ +${delta}` : delta < 0 ? `▼ ${delta}` : "— No change";
  const scoreEmoji = score >= 80 ? "🟢" : score >= 60 ? "🔵" : score >= 40 ? "🟡" : "🔴";

  await postToChannel("seo-dashboard", {
    embeds: [{
      title: `${scoreEmoji} SEO Dashboard Updated`,
      description: [
        `**Overall Score:** ${score}/100 (${deltaText})`,
        `**Agents:** ${agentsPassed}/${agentsTotal} phases passed`,
        `**Changes:** ${approved} approved, ${rejected} rejected`,
        `**Open Issues:** ${issues}`,
        "",
        `📊 **[View Dashboard](${dashboardUrl})**`,
      ].join("\n"),
      color,
      timestamp: new Date().toISOString(),
    }],
  });

  console.log("[notify] Dashboard notification posted to Discord");
}
