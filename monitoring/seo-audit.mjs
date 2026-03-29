import "dotenv/config";
import { buildEmbed, postToChannel } from "./lib/discord.mjs";

const SEO_SCANS = ["seo", "schema", "social-preview", "links", "freshness"];

const SCAN_MODULES = {
  seo: "./scans/seo.mjs",
  schema: "./scans/schema.mjs",
  "social-preview": "./scans/social-preview.mjs",
  links: "./scans/links.mjs",
  freshness: "./scans/freshness.mjs",
};

async function main() {
  if (!process.env.DISCORD_SEO_WEBHOOK_URL) {
    console.error("DISCORD_SEO_WEBHOOK_URL not set.");
    process.exit(1);
  }

  console.log("Running daily SEO audit...");
  const results = [];

  for (const name of SEO_SCANS) {
    console.log(`  Running ${name}...`);
    try {
      const mod = await import(SCAN_MODULES[name]);
      const result = await mod.run();
      results.push(result);
      console.log(`  ${name}: ${result.status} (${result.score}/100)`);
    } catch (err) {
      console.error(`  ${name} failed: ${err.message}`);
      results.push({
        category: name,
        status: "fail",
        score: 0,
        checks: [{ name: "Scanner Error", status: "fail", detail: err.message }],
      });
    }
  }

  const passCount = results.filter((r) => r.status === "pass").length;
  const warnCount = results.filter((r) => r.status === "warn").length;
  const failCount = results.filter((r) => r.status === "fail").length;
  const avgScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);

  const parts = [];
  if (passCount > 0) parts.push(`✅ ${passCount} passed`);
  if (warnCount > 0) parts.push(`⚠️ ${warnCount} warnings`);
  if (failCount > 0) parts.push(`❌ ${failCount} critical`);

  const embeds = results.map(buildEmbed);

  await postToChannel("seo", {
    content: `**🔍 Daily SEO Audit — ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}**\nOverall score: **${avgScore}/100** · ${parts.join(" · ")}`,
    embeds: embeds.slice(0, 10),
  });

  console.log("SEO audit posted to Discord.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
