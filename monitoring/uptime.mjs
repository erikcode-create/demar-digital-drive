import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TARGET_URL = "https://demartransportation.com";
const TIMEOUT_MS = 10000;
const MAX_LOG_ENTRIES = 672; // 7 days at 15-min intervals

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = path.join(__dirname, "uptime-state.json");

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  } catch {
    return {
      currentStatus: "unknown",
      since: new Date().toISOString(),
      lastResponseTime: null,
      log: [],
    };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

async function checkSite() {
  const start = Date.now();
  try {
    const res = await fetch(TARGET_URL, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const responseTime = Date.now() - start;
    return {
      status: res.ok ? "up" : "down",
      httpStatus: res.status,
      responseTime,
      error: null,
    };
  } catch (err) {
    return {
      status: "down",
      httpStatus: 0,
      responseTime: Date.now() - start,
      error: err.message,
    };
  }
}

async function postDiscord(webhookUrl, embeds) {
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds }),
  });
}

async function alertStateChange(webhookUrl, newStatus, check, state) {
  if (newStatus === "down") {
    const detail = check.error || `HTTP ${check.httpStatus}`;
    await postDiscord(webhookUrl, [{
      title: "\u{1F534} Site DOWN",
      description: `**${TARGET_URL}** is unreachable.\n\n**Reason:** ${detail}\n**Time:** ${new Date().toUTCString()}`,
      color: 15158332,
      timestamp: new Date().toISOString(),
    }]);
  } else if (newStatus === "up" && state.currentStatus === "down") {
    const downSince = new Date(state.since);
    const downtimeMin = Math.round((Date.now() - downSince.getTime()) / 60000);
    await postDiscord(webhookUrl, [{
      title: "\u{1F7E2} Site RECOVERED",
      description: `**${TARGET_URL}** is back online.\n\n**Downtime:** ${downtimeMin} min\n**Response time:** ${check.responseTime}ms\n**Time:** ${new Date().toUTCString()}`,
      color: 3066993,
      timestamp: new Date().toISOString(),
    }]);
  }
}

function computeDailySummary(log) {
  if (log.length === 0) {
    return { uptimePercent: 100, incidents: 0, totalDowntimeMin: 0, avgResponse: 0, peakResponse: 0, checks: 0 };
  }

  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const last24h = log.filter((e) => new Date(e.timestamp).getTime() > oneDayAgo);

  if (last24h.length === 0) {
    return { uptimePercent: 100, incidents: 0, totalDowntimeMin: 0, avgResponse: 0, peakResponse: 0, checks: 0 };
  }

  const upCount = last24h.filter((e) => e.status === "up").length;
  const uptimePercent = Math.round((upCount / last24h.length) * 1000) / 10;

  let incidents = 0;
  let totalDownChecks = 0;
  let wasDown = false;
  for (const entry of last24h) {
    if (entry.status === "down" && !wasDown) {
      incidents++;
      wasDown = true;
    } else if (entry.status === "up") {
      wasDown = false;
    }
    if (entry.status === "down") totalDownChecks++;
  }
  const totalDowntimeMin = totalDownChecks * 15;

  const responseTimes = last24h.filter((e) => e.responseTime > 0).map((e) => e.responseTime);
  const avgResponse = responseTimes.length > 0 ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) : 0;
  const peakResponse = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;

  return { uptimePercent, incidents, totalDowntimeMin, avgResponse, peakResponse, checks: last24h.length };
}

async function postDailySummary(webhookUrl, log) {
  const summary = computeDailySummary(log);

  const color = summary.uptimePercent >= 99.5 ? 3066993 : summary.uptimePercent >= 95 ? 16776960 : 15158332;

  const incidentText = summary.incidents === 0
    ? "No incidents"
    : `${summary.incidents} incident(s), ~${summary.totalDowntimeMin} min downtime`;

  await postDiscord(webhookUrl, [{
    title: `\u{1F4CA} Daily Uptime: ${summary.uptimePercent}%`,
    description: [
      `**Site:** ${TARGET_URL}`,
      `**Checks:** ${summary.checks} in last 24h`,
      `**Incidents:** ${incidentText}`,
      `**Avg response:** ${summary.avgResponse}ms`,
      `**Peak response:** ${summary.peakResponse}ms`,
    ].join("\n"),
    color,
    timestamp: new Date().toISOString(),
  }]);
}

async function runCheck() {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK_URL not set.");
    process.exit(1);
  }

  const state = loadState();
  const check = await checkSite();

  console.log(`Status: ${check.status} | HTTP: ${check.httpStatus} | Response: ${check.responseTime}ms`);

  if (state.currentStatus !== "unknown" && check.status !== state.currentStatus) {
    await alertStateChange(webhookUrl, check.status, check, state);
  }

  if (check.status !== state.currentStatus) {
    state.since = new Date().toISOString();
  }
  state.currentStatus = check.status;
  state.lastResponseTime = check.responseTime;
  state.log.push({
    timestamp: new Date().toISOString(),
    status: check.status,
    responseTime: check.responseTime,
  });

  if (state.log.length > MAX_LOG_ENTRIES) {
    state.log = state.log.slice(-MAX_LOG_ENTRIES);
  }

  saveState(state);
  console.log("State saved.");
}

async function runSummary() {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK_URL not set.");
    process.exit(1);
  }

  const state = loadState();
  await postDailySummary(webhookUrl, state.log);
  console.log("Daily summary posted.");
}

const command = process.argv[2] || "check";
if (command === "summary") {
  runSummary().catch((err) => { console.error("Fatal:", err); process.exit(1); });
} else {
  runCheck().catch((err) => { console.error("Fatal:", err); process.exit(1); });
}
