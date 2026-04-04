import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";
import { loadHistory } from "./snapshot.mjs";
import { renderScoreRing, renderKpiCard, renderSparkline, renderDeltaArrow, scoreColor } from "./components.mjs";
import { renderSiteHealthTab, renderRankingsTab, renderAgentActivityTab, renderChangesTab } from "./tabs.mjs";

const __dirname = import.meta.dirname || fileURLToPath(new URL(".", import.meta.url));
const DEFAULT_STATE_DIR = join(__dirname, "../agents/state");
const DEFAULT_HISTORY_DIR = join(DEFAULT_STATE_DIR, "history");
const DEFAULT_OUTPUT_DIR = join(__dirname, "dist");
const TEMPLATE_PATH = join(__dirname, "templates/shell.html");

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Generate the dashboard HTML file.
 * @param {Object} opts
 * @param {string} [opts.stateDir]   — path to agents/state/
 * @param {string} [opts.historyDir] — path to agents/state/history/
 * @param {string} [opts.outputDir]  — where to write index.html
 * @param {string} [opts.token]      — dashboard access token (raw); hashed before embedding
 * @returns {Promise<string>} path to written HTML file
 */
export async function generateDashboard(opts = {}) {
  const stateDir = opts.stateDir || DEFAULT_STATE_DIR;
  const historyDir = opts.historyDir || DEFAULT_HISTORY_DIR;
  const outputDir = opts.outputDir || DEFAULT_OUTPUT_DIR;
  const token = opts.token !== undefined ? opts.token : process.env.SEO_DASHBOARD_TOKEN;

  mkdirSync(outputDir, { recursive: true });

  // Read current state from all category directories
  const data = {};
  const categories = ["intelligence", "analysis", "strategy", "meta"];
  for (const cat of categories) {
    const dir = join(stateDir, cat);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir)) {
      if (!file.endsWith(".json")) continue;
      try {
        const key = file.replace(".json", "").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        data[key] = JSON.parse(readFileSync(join(dir, file), "utf-8"));
      } catch { /* skip malformed JSON */ }
    }
  }

  // Read history
  const history = loadHistory({ historyDir });

  // Read pending items (graceful failure if pending directory unavailable)
  let pendingItems = [];
  try {
    const pendingDir = join(stateDir, "../../agents/pending");
    if (existsSync(pendingDir)) {
      for (const dir of readdirSync(pendingDir)) {
        if (dir === "archive") continue;
        const manifest = join(pendingDir, dir, "manifest.json");
        if (existsSync(manifest)) {
          try {
            const item = JSON.parse(readFileSync(manifest, "utf-8"));
            if (item.status === "pending") pendingItems.push(item);
          } catch { /* skip */ }
        }
      }
    }
  } catch { /* skip */ }

  // Compute KPIs
  const score = data.siteAudit?.score ?? 0;
  const prevScore = history.length > 1 ? history[history.length - 2]?.siteAudit?.score : null;
  const scoreDelta = prevScore != null ? score - prevScore : 0;

  const runLog = data.runLog || [];
  const lastEntries = runLog.slice(-10);
  const passCount = lastEntries.filter((e) => e.success).length;

  const review = data.reviewResults || {};
  const pendingCount = pendingItems.length;

  // Build overview KPIs
  const scoreTrend = history.map((s) => s.siteAudit?.score).filter((v) => v != null);

  const overviewHtml = `
<div class="header">
  <div><h1><span>DeMar</span> SEO Dashboard</h1></div>
  <div class="header-meta">
    <div class="timestamp">Last updated: ${new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</div>
    <div>Data from ${history.length} daily snapshots</div>
  </div>
</div>

<div class="kpi-row">
  ${renderScoreRing({ score, label: "Overall Score", delta: scoreDelta !== 0 ? renderDeltaArrow(scoreDelta) : "" })}
  ${renderKpiCard({
    label: "Agent Health",
    value: `${passCount}/${lastEntries.length}`,
    detail: passCount === lastEntries.length ? "All recent runs passed" : `${lastEntries.length - passCount} failures`,
    delta: { text: `Last ${lastEntries.length} runs`, direction: passCount === lastEntries.length ? "up" : "down" },
    color: passCount === lastEntries.length ? "var(--color-pass)" : "var(--color-warn)",
    sparklineHtml: renderSparkline({ data: lastEntries.map((e) => e.success ? 1 : 0), color: "#10b981" }),
  })}
  ${renderKpiCard({
    label: "Rankings",
    value: String((data.rankings?.keywords || []).length),
    detail: "Keywords tracked",
    color: "var(--color-info)",
    sparklineHtml: renderSparkline({ data: scoreTrend, color: "#3b82f6" }),
  })}
  ${renderKpiCard({
    label: "Review Pipeline",
    value: String((review.approved || 0) + (review.rejected || 0) + (review.revised || 0)),
    detail: `${review.approved || 0} approved · ${review.rejected || 0} rejected`,
    color: "var(--color-info)",
  })}
  ${renderKpiCard({
    label: "Open Issues",
    value: String((data.siteAudit?.pages || []).reduce((sum, p) => sum + (p.issues?.length || 0), 0)),
    detail: "Across all pages",
    color: "var(--color-warn)",
  })}
</div>

<div class="tab-bar">
  <div class="tab active" data-tab="health">Site Health</div>
  <div class="tab" data-tab="rankings">Rankings</div>
  <div class="tab" data-tab="agents">Agent Activity</div>
  <div class="tab" data-tab="changes">Changes${pendingCount > 0 ? ` <span class="badge">${pendingCount}</span>` : ""}</div>
</div>

<div id="tab-health" class="tab-content active">${renderSiteHealthTab(data, history)}</div>
<div id="tab-rankings" class="tab-content">${renderRankingsTab(data, history)}</div>
<div id="tab-agents" class="tab-content">${renderAgentActivityTab(data, history)}</div>
<div id="tab-changes" class="tab-content">${renderChangesTab(data, pendingItems)}</div>`;

  // Chart initialization JS
  const chartInit = buildChartInit(data, history);

  // Read template
  let template = readFileSync(TEMPLATE_PATH, "utf-8");

  // Inject content
  template = template.replace("{{CONTENT}}", overviewHtml);
  template = template.replace(
    "{{DASHBOARD_DATA}}",
    JSON.stringify({ score, history: history.map((h) => ({ date: h._date, score: h.siteAudit?.score })) })
  );
  template = template.replace("{{CHART_INIT}}", chartInit);

  // Inject token hash (only when a token is provided)
  if (token) {
    template = template.replace("{{TOKEN_HASH}}", hashToken(token));
  }

  const outputPath = join(outputDir, "index.html");
  writeFileSync(outputPath, template);
  console.log(`[dashboard] Generated ${outputPath}`);
  return outputPath;
}

function buildChartInit(data, history) {
  const labels = history.map((s) => s._date?.slice(5) || "");
  const scores = history.map((s) => s.siteAudit?.score ?? null);

  return `
// Score trend chart
(function() {
  const ctx = document.getElementById("chart-score-trend");
  if (!ctx || typeof Chart === "undefined") return;
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ${JSON.stringify(labels)},
      datasets: [{
        label: "Site Health Score",
        data: ${JSON.stringify(scores)},
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.1)",
        borderWidth: 2, pointRadius: 0, pointHoverRadius: 5,
        tension: 0.35, fill: true,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 100, grid: { color: "rgba(255,255,255,0.06)" } },
        x: { grid: { display: false } }
      }
    }
  });
})();

// Run history chart
(function() {
  const ctx = document.getElementById("chart-run-history");
  if (!ctx || typeof Chart === "undefined") return;
  const runData = ${JSON.stringify(history.map((s) => {
    const log = s.runLog || [];
    const total = log.length || 1;
    const passed = log.filter((e) => e.success).length;
    return Math.round((passed / total) * 100);
  }))};
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ${JSON.stringify(labels)},
      datasets: [{
        label: "Pass Rate %",
        data: runData,
        backgroundColor: runData.map(v => v === 100 ? "#10b981" : v >= 50 ? "#f59e0b" : "#ef4444"),
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 100, grid: { color: "rgba(255,255,255,0.06)" } },
        x: { grid: { display: false } }
      }
    }
  });
})();
`;
}

// CLI entrypoint
const isMain = process.argv[1] && (process.argv[1].endsWith("generate.mjs") || process.argv[1].includes("dashboard/generate"));
if (isMain) {
  generateDashboard().then((path) => {
    console.log(`[dashboard] Done: ${path}`);
  }).catch((err) => {
    console.error("[dashboard] Generation failed:", err);
    process.exit(1);
  });
}
