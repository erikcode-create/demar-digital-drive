import "dotenv/config";
import { postResults } from "./lib/discord.mjs";

const mockResults = [
  {
    category: "Test Scan",
    status: "pass",
    score: 100,
    checks: [
      { name: "Connectivity", status: "pass", detail: "Webhook is working" },
    ],
  },
];

await postResults(mockResults, process.env.DISCORD_WEBHOOK_URL);
