const COLORS = {
  pass: 3066993,   // green
  warn: 16776960,  // yellow
  fail: 15158332,  // red
};

const STATUS_EMOJI = {
  pass: "✅",
  warn: "⚠️",
  fail: "❌",
};

const UNVERIFIED_EMOJI = "⬜";

export function buildEmbed(scanResult) {
  const { category, status, score, checks } = scanResult;

  const scorable = checks.filter((c) => c.confidence !== "UNABLE_TO_VERIFY");
  const unverifiable = checks.filter((c) => c.confidence === "UNABLE_TO_VERIFY");
  const passingCount = scorable.filter((c) => c.status === "pass").length;

  let description = `**Score: ${score}/100** (${scorable.length} of ${checks.length} checks verified)\n`;
  description += `${passingCount}/${scorable.length} verified checks passed\n\n`;

  // Show failing/warning verified checks
  const failingChecks = scorable.filter((c) => c.status !== "pass");
  for (const check of failingChecks) {
    const emoji = STATUS_EMOJI[check.status];
    description += `${emoji} **${check.name}**\n${check.detail}\n`;
    if (check.confidence === "INFERRED" && check.reason) {
      description += `*${check.reason}*\n`;
    }
    description += "\n";
  }

  // Show passing checks with INFERRED confidence
  const inferredPassing = scorable.filter((c) => c.status === "pass" && c.confidence === "INFERRED");
  for (const check of inferredPassing) {
    description += `✅ **${check.name}**\n${check.detail}\n`;
    if (check.reason) {
      description += `*${check.reason}*\n`;
    }
    description += "\n";
  }

  // Show unverifiable checks
  if (unverifiable.length > 0) {
    for (const check of unverifiable) {
      description += `${UNVERIFIED_EMOJI} **${check.name}** — UNABLE TO VERIFY\n`;
      if (check.reason) {
        description += `*${check.reason}*\n`;
      }
      description += "\n";
    }
  }

  // Trim to Discord's 4096-char embed description limit
  if (description.length > 4000) {
    description = description.substring(0, 3997) + "...";
  }

  return {
    title: `${STATUS_EMOJI[status]} ${category}`,
    description: description.trim(),
    color: COLORS[status],
    timestamp: new Date().toISOString(),
  };
}

function buildSummaryLine(results) {
  const counts = { pass: 0, warn: 0, fail: 0 };
  for (const r of results) {
    counts[r.status]++;
  }
  const parts = [];
  if (counts.pass > 0) parts.push(`✅ ${counts.pass} passed`);
  if (counts.warn > 0) parts.push(`⚠️ ${counts.warn} warnings`);
  if (counts.fail > 0) parts.push(`❌ ${counts.fail} critical`);
  return parts.join(" · ");
}

// Channel-aware posting: "health" (default) or "content"
export async function postToChannel(channel, payload) {
  const urls = {
    health: process.env.DISCORD_WEBHOOK_URL,
    content: process.env.DISCORD_CONTENT_WEBHOOK_URL,
    seo: process.env.DISCORD_SEO_WEBHOOK_URL,
    cro: process.env.DISCORD_CRO_WEBHOOK_URL,
    funnels: process.env.DISCORD_FUNNELS_WEBHOOK_URL,
    social: process.env.DISCORD_SOCIAL_WEBHOOK_URL,
    "seo-dashboard": process.env.DISCORD_SEO_DASHBOARD_WEBHOOK_URL,
  };
  const webhookUrl = urls[channel];
  if (!webhookUrl) {
    console.error(`No webhook URL for channel "${channel}". Set the corresponding DISCORD_*_WEBHOOK_URL env var.`);
    return;
  }
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Discord webhook failed for ${channel} (${res.status}): ${text}`);
  }
}

export async function postResults(results, webhookUrl) {
  const summary = buildSummaryLine(results);
  const embeds = results.map(buildEmbed);

  const payload = {
    content: `**Website Scan — ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}**\n${summary}`,
    embeds: embeds.slice(0, 10), // Discord max 10 embeds per message
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Discord webhook failed (${res.status}): ${text}`);
  }

  console.log("Posted scan results to Discord.");
}
