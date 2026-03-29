# Uptime Monitor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a separate uptime monitoring system that checks site availability every 15 minutes, tracks state, alerts Discord on outages/recovery, and posts a daily summary.

**Architecture:** A standalone `monitoring/uptime.mjs` script handles HTTP checks, state management (JSON file persisted via GitHub Actions cache), and Discord notifications. A new GitHub Actions workflow runs every 15 minutes for checks and once daily for the summary.

**Tech Stack:** Node.js (ESM), GitHub Actions with `actions/cache`, Discord webhook (reuses existing `DISCORD_WEBHOOK_URL` secret)

---

## File Structure

```
Files to create:
├── monitoring/uptime.mjs                      # Uptime check logic, state management, Discord alerts
├── .github/workflows/website-uptime.yml       # 15-min check + daily summary workflow

Files to modify:
├── monitoring/package.json                    # Add uptime npm scripts
```

---

### Task 1: Create uptime monitor script

**Files:**
- Create: `monitoring/uptime.mjs`

- [ ] **Step 1: Create the uptime monitor**

Create `monitoring/uptime.mjs`:

```js
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TARGET_URL = "https://demartransportation.com";
const TIMEOUT_MS = 10000;
const WARN_RESPONSE_MS = 2000;
const FAIL_RESPONSE_MS = 5000;
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
      color: 15158332, // red
      timestamp: new Date().toISOString(),
    }]);
  } else if (newStatus === "up" && state.currentStatus === "down") {
    const downSince = new Date(state.since);
    const downtimeMin = Math.round((Date.now() - downSince.getTime()) / 60000);
    await postDiscord(webhookUrl, [{
      title: "\u{1F7E2} Site RECOVERED",
      description: `**${TARGET_URL}** is back online.\n\n**Downtime:** ${downtimeMin} min\n**Response time:** ${check.responseTime}ms\n**Time:** ${new Date().toUTCString()}`,
      color: 3066993, // green
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

  // Detect state change
  if (state.currentStatus !== "unknown" && check.status !== state.currentStatus) {
    await alertStateChange(webhookUrl, check.status, check, state);
  }

  // Update state
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

  // Trim log to max entries
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

// CLI: node uptime.mjs check | summary
const command = process.argv[2] || "check";
if (command === "summary") {
  runSummary().catch((err) => { console.error("Fatal:", err); process.exit(1); });
} else {
  runCheck().catch((err) => { console.error("Fatal:", err); process.exit(1); });
}
```

- [ ] **Step 2: Test the check command locally**

Run: `cd monitoring && node uptime.mjs check`
Expected: `Status: up | HTTP: 200 | Response: XXXms` and `State saved.` No Discord alert on first run (state is "unknown").

- [ ] **Step 3: Test the summary command locally**

Run: `cd monitoring && node uptime.mjs summary`
Expected: Posts daily summary embed to Discord with 1 check in log.

- [ ] **Step 4: Commit**

```bash
git add monitoring/uptime.mjs monitoring/uptime-state.json
git commit -m "feat: add uptime monitor with state tracking and Discord alerts"
```

---

### Task 2: Create GitHub Actions workflow

**Files:**
- Create: `.github/workflows/website-uptime.yml`

- [ ] **Step 1: Create the workflow file**

Create `.github/workflows/website-uptime.yml`:

```yaml
name: Website Uptime

on:
  schedule:
    - cron: '*/15 * * * *'   # Every 15 minutes (uptime check)
    - cron: '0 15 * * *'     # Daily at 8am PDT (summary)
  workflow_dispatch:
    inputs:
      command:
        description: 'Command to run'
        type: choice
        options:
          - check
          - summary
        default: check

jobs:
  uptime:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install monitoring dependencies
        run: cd monitoring && npm ci

      - name: Restore uptime state
        uses: actions/cache/restore@v4
        with:
          path: monitoring/uptime-state.json
          key: uptime-state

      - name: Determine command
        id: cmd
        run: |
          if [ "${{ github.event_name }}" = "workflow_dispatch" ]; then
            echo "command=${{ github.event.inputs.command }}" >> $GITHUB_OUTPUT
          elif [ "${{ github.event.schedule }}" = "0 15 * * *" ]; then
            echo "command=summary" >> $GITHUB_OUTPUT
          else
            echo "command=check" >> $GITHUB_OUTPUT
          fi

      - name: Run uptime ${{ steps.cmd.outputs.command }}
        env:
          DISCORD_WEBHOOK_URL: ${{ secrets.DISCORD_WEBHOOK_URL }}
        run: cd monitoring && node uptime.mjs ${{ steps.cmd.outputs.command }}

      - name: Save uptime state
        uses: actions/cache/save@v4
        with:
          path: monitoring/uptime-state.json
          key: uptime-state-${{ github.run_id }}

      - name: Cleanup old cache
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          # Delete previous uptime-state caches (keep only latest)
          gh api repos/${{ github.repository }}/actions/caches \
            --jq '.actions_caches[] | select(.key | startswith("uptime-state")) | .id' \
            | head -n -1 \
            | while read id; do
                gh api -X DELETE repos/${{ github.repository }}/actions/caches/$id 2>/dev/null || true
              done
```

- [ ] **Step 2: Verify workflow YAML syntax**

Run: `cat .github/workflows/website-uptime.yml | python3 -c "import sys, yaml; yaml.safe_load(sys.stdin); print('YAML valid')" 2>&1`
Expected: `YAML valid`

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/website-uptime.yml
git commit -m "feat: add uptime monitoring workflow (15-min checks, daily summary)"
```

---

### Task 3: Add npm scripts and update .gitignore

**Files:**
- Modify: `monitoring/package.json`

- [ ] **Step 1: Add uptime npm scripts**

Add to `monitoring/package.json` scripts:
```json
"uptime": "node uptime.mjs check",
"uptime:summary": "node uptime.mjs summary"
```

- [ ] **Step 2: Add uptime-state.json to .gitignore**

Add `monitoring/uptime-state.json` to `.gitignore` (state is ephemeral, persisted via Actions cache, should not be in repo).

- [ ] **Step 3: Commit**

```bash
git add monitoring/package.json .gitignore
git commit -m "feat: add uptime npm scripts, gitignore state file"
```

---

### Task 4: End-to-end verification

**Files:** None (verification only)

- [ ] **Step 1: Run uptime check and verify Discord output**

Run: `cd monitoring && node uptime.mjs check`
Expected: Status up, state saved, no Discord alert (no state change from previous check).

- [ ] **Step 2: Simulate a state change to verify alerting**

Run: `cd monitoring && node -e "
import fs from 'node:fs';
const state = JSON.parse(fs.readFileSync('uptime-state.json', 'utf-8'));
state.currentStatus = 'down';
state.since = new Date(Date.now() - 30*60000).toISOString();
fs.writeFileSync('uptime-state.json', JSON.stringify(state, null, 2));
console.log('State set to down. Next check should trigger recovery alert.');
"`
Then run: `cd monitoring && node uptime.mjs check`
Expected: Recovery alert posted to Discord ("Site RECOVERED, downtime: 30 min").

- [ ] **Step 3: Run daily summary**

Run: `cd monitoring && node uptime.mjs summary`
Expected: Daily summary posted to Discord with uptime percentage and response stats.

- [ ] **Step 4: Clean up test state**

Run: `rm monitoring/uptime-state.json`

- [ ] **Step 5: Commit any fixes if needed**

```bash
git add -A monitoring/
git commit -m "fix: resolve issues found during uptime monitor verification"
```
