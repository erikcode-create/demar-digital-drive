import "dotenv/config";

const CHANNELS = [
  { name: "Marketing & CRO", env: "DISCORD_CRO_WEBHOOK_URL" },
  { name: "Funnels & Landing Pages", env: "DISCORD_FUNNELS_WEBHOOK_URL" },
  { name: "Social Media", env: "DISCORD_SOCIAL_WEBHOOK_URL" },
];

async function verifyWebhook(name, url) {
  if (!url) return { name, status: "missing", detail: "Env var not set" };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `✅ **${name}** channel verified! Marketing automation is connected.`,
        embeds: [{
          title: `🔗 ${name} — Connected`,
          description: "This channel will receive daily marketing automation updates from DeMar Transportation's CI/CD pipeline.",
          color: 3066993,
          timestamp: new Date().toISOString(),
        }],
      }),
    });
    return { name, status: res.ok ? "ok" : "error", detail: res.ok ? "Webhook verified" : `HTTP ${res.status}` };
  } catch (err) {
    return { name, status: "error", detail: err.message };
  }
}

async function main() {
  console.log("Verifying Discord webhooks for marketing channels...\n");
  for (const ch of CHANNELS) {
    const url = process.env[ch.env];
    const result = await verifyWebhook(ch.name, url);
    const icon = result.status === "ok" ? "✅" : result.status === "missing" ? "⬜" : "❌";
    console.log(`${icon} ${result.name}: ${result.detail}`);
  }
  console.log("\nTo configure missing webhooks:");
  console.log("1. Create channels in Discord server");
  console.log("2. Edit each channel → Integrations → Webhooks → New Webhook");
  console.log("3. Copy webhook URL and add to monitoring/.env and GitHub Actions secrets");
}

main();
