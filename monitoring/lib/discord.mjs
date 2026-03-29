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

export function buildEmbed(scanResult) {
  const { category, status, score, checks } = scanResult;

  const failingChecks = checks.filter((c) => c.status !== "pass");
  const passingCount = checks.filter((c) => c.status === "pass").length;

  let description = `**Score: ${score}/100**\n`;
  description += `${passingCount}/${checks.length} checks passed\n\n`;

  if (failingChecks.length > 0) {
    for (const check of failingChecks) {
      const emoji = STATUS_EMOJI[check.status];
      description += `${emoji} **${check.name}**\n${check.detail}\n\n`;
    }
  } else {
    description += "All checks passed.";
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
