import "dotenv/config";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { postResults } from "./lib/discord.mjs";

const LIGHTWEIGHT_SCANS = ["security", "dependencies", "freshness", "dns"];
const FULL_SCANS = [
  "security", "dependencies", "seo", "performance", "images", "accessibility",
  "schema", "social-preview", "links", "freshness", "dns",
];

const SCAN_MODULES = {
  security: "./scans/security.mjs",
  dependencies: "./scans/dependencies.mjs",
  seo: "./scans/seo.mjs",
  performance: "./scans/performance.mjs",
  images: "./scans/images.mjs",
  accessibility: "./scans/accessibility.mjs",
  schema: "./scans/schema.mjs",
  "social-preview": "./scans/social-preview.mjs",
  links: "./scans/links.mjs",
  freshness: "./scans/freshness.mjs",
  dns: "./scans/dns.mjs",
};

function parseArgs() {
  const args = process.argv.slice(2);
  let type = "full";
  let scan = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--type" && args[i + 1]) {
      type = args[i + 1];
      i++;
    } else if (args[i] === "--scan" && args[i + 1]) {
      scan = args[i + 1];
      i++;
    }
  }

  return { type, scan };
}

async function main() {
  const { type, scan } = parseArgs();
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK_URL not set. Add it to .env or environment.");
    process.exit(1);
  }

  let scanNames;
  if (scan) {
    if (!SCAN_MODULES[scan]) {
      console.error(`Unknown scan: ${scan}. Available: ${Object.keys(SCAN_MODULES).join(", ")}`);
      process.exit(1);
    }
    scanNames = [scan];
  } else if (type === "lightweight") {
    scanNames = LIGHTWEIGHT_SCANS;
  } else {
    scanNames = FULL_SCANS;
  }

  console.log(`Running ${type} scan: ${scanNames.join(", ")}`);
  const results = [];

  for (const name of scanNames) {
    console.log(`  Running ${name}...`);
    try {
      const mod = await import(SCAN_MODULES[name]);
      const result = await mod.run();
      results.push(result);
      console.log(`  ${name}: ${result.status} (${result.score}/100)`);
    } catch (err) {
      console.error(`  ${name} failed: ${err.message}`);
      results.push({
        category: name.charAt(0).toUpperCase() + name.slice(1),
        status: "fail",
        score: 0,
        checks: [{ name: "Scanner Error", status: "fail", detail: err.message }],
      });
    }
  }

  // Write results to file for auto-fix consumption
  const resultsPath = fileURLToPath(new URL("./scan-results.json", import.meta.url));
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`Results written to ${resultsPath}`);

  // Set GitHub Actions output
  const hasFailures = results.some(r => r.status === "fail" || r.status === "warn");
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_fixable_issues=${hasFailures}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `results_path=${resultsPath}\n`);
  }

  await postResults(results, webhookUrl);
  console.log("Done.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
