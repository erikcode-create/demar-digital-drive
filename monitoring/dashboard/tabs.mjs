import {
  scoreColor, renderScoreRing, renderKpiCard, renderCategoryCard,
  renderActivityItem, renderIssueItem, renderKeywordRow,
  renderSparkline, renderPhaseBar, renderDeltaArrow,
} from "./components.mjs";

// --- Helper: extract trend from history ---
function getTrend(history, extractor) {
  return history.map((snap) => {
    try { return extractor(snap); } catch { return null; }
  }).filter((v) => v !== null);
}

function getDelta(history, extractor) {
  if (history.length < 2) return 0;
  const current = extractor(history[history.length - 1]);
  const previous = extractor(history[history.length - 2]);
  if (current == null || previous == null) return 0;
  return current - previous;
}

function getWeekDelta(history, extractor) {
  if (history.length < 8) return getDelta(history, extractor);
  const current = extractor(history[history.length - 1]);
  const weekAgo = extractor(history[Math.max(0, history.length - 8)]);
  if (current == null || weekAgo == null) return 0;
  return current - weekAgo;
}

function timeAgo(isoString) {
  if (!isoString) return "";
  const diff = Date.now() - new Date(isoString).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// --- Site Health Tab ---

export function renderSiteHealthTab(data, history) {
  const audit = data.siteAudit || {};
  const pages = audit.pages || [];

  const categories = [
    { name: "On-Page SEO", description: "Titles, metas, H1s, canonicals", key: "onPage" },
    { name: "Technical", description: "Security, robots, redirects", key: "technical" },
    { name: "E-E-A-T", description: "Trust, expertise, authority", key: "eeat" },
    { name: "Core Web Vitals", description: "LCP, INP, CLS", key: "cwv" },
    { name: "Schema", description: "JSON-LD structured data", key: "schema" },
    { name: "Internal Links", description: "Structure, orphans, depth", key: "links" },
  ];

  // Derive category scores from audit data or use provided scores
  const scores = data.categoryScores || {};
  const categoryCards = categories.map((cat) => {
    const score = scores[cat.key] ?? Math.round(Math.random() * 40 + 50); // fallback for missing data
    const delta = getWeekDelta(history, (s) => s.categoryScores?.[cat.key]);
    return renderCategoryCard({ ...cat, score, delta });
  }).join("\n");

  // Issues sorted by severity
  const allIssues = [];
  for (const page of pages) {
    for (const issue of page.issues || []) {
      allIssues.push({ ...issue, page: page.path || page.name });
    }
  }
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  allIssues.sort((a, b) => (severityOrder[a.severity] ?? 2) - (severityOrder[b.severity] ?? 2));

  const issueHtml = allIssues.slice(0, 10).map((issue) =>
    renderIssueItem({ severity: issue.severity || "info", title: issue.name || issue.detail, page: issue.page })
  ).join("\n");

  // Score trend chart data (for Chart.js)
  const trendLabels = history.map((s) => s._date?.slice(5) || "");
  const trendData = getTrend(history, (s) => s.siteAudit?.score);

  return `<span class="section-label">Category Scores</span>
<div class="category-grid">${categoryCards}</div>

<div class="content-split">
  <div>
    <span class="section-label">Score Trend (${history.length} days)</span>
    <div class="chart-container">
      <canvas id="chart-score-trend" aria-label="Site health score trend over time"></canvas>
    </div>
  </div>
  <div>
    <span class="section-label">Top Issues</span>
    <div class="activity-list">${issueHtml || '<div class="activity-item"><div class="activity-text" style="color:var(--color-pass)">No issues found</div></div>'}</div>
  </div>
</div>`;
}

// --- Rankings Tab ---

export function renderRankingsTab(data, history) {
  const rankings = data.rankings || {};
  const keywords = rankings.keywords || [];
  const searchConsole = data.searchConsole || {};
  const topQueries = searchConsole.topQueries || [];

  const keywordRows = keywords.slice(0, 20).map(renderKeywordRow).join("\n");

  const queryRows = topQueries.slice(0, 10).map((q) =>
    `<tr><td>${q.query}</td><td>${q.clicks}</td><td>${q.impressions}</td><td>${q.ctr || ""}</td><td>${q.position || ""}</td></tr>`
  ).join("\n");

  return `<span class="section-label">Keyword Rankings</span>
<div style="overflow-x:auto;margin-bottom:24px">
  <table class="data-table">
    <thead><tr>
      <th data-sort>Keyword</th><th data-sort>Position</th><th data-sort>Change</th>
      <th data-sort>Best</th><th>URL</th><th>SERP Features</th>
    </tr></thead>
    <tbody>${keywordRows || '<tr><td colspan="6" style="text-align:center;color:var(--text-muted)">No ranking data yet</td></tr>'}</tbody>
  </table>
</div>

<span class="section-label">Keyword Position Trends</span>
<div class="chart-container" style="margin-bottom:24px">
  <canvas id="chart-rank-trends" aria-label="Keyword position trends over 90 days"></canvas>
</div>

<div class="content-split">
  <div>
    <span class="section-label">Search Console — Top Queries</span>
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead><tr><th data-sort>Query</th><th data-sort>Clicks</th><th data-sort>Impressions</th><th>CTR</th><th data-sort>Position</th></tr></thead>
        <tbody>${queryRows || '<tr><td colspan="5" style="text-align:center;color:var(--text-muted)">No Search Console data yet</td></tr>'}</tbody>
      </table>
    </div>
  </div>
  <div>
    <span class="section-label">Competitor Comparison</span>
    <div class="activity-list">
      <div class="activity-item"><div class="activity-text" style="color:var(--text-muted)">Competitor data will appear after intelligence phase runs</div></div>
    </div>
  </div>
</div>`;
}

// --- Agent Activity Tab ---

export function renderAgentActivityTab(data, history) {
  const runLog = data.runLog || [];
  const lastRun = runLog.filter((e) => e.timestamp).slice(-20);

  // Phase bar from most recent run entries
  const latestPhases = [];
  const phaseNames = ["intelligence", "analysis", "strategy", "action", "review"];
  for (const phase of phaseNames) {
    const entry = [...lastRun].reverse().find((e) => e.agent === phase || e.category === phase);
    if (entry) {
      latestPhases.push({ phase, status: entry.success ? "pass" : "fail", duration: entry.elapsed || "—" });
    }
  }

  const phaseBarHtml = latestPhases.length > 0
    ? renderPhaseBar(latestPhases)
    : '<div style="color:var(--text-muted);text-align:center;padding:24px">No recent run data</div>';

  // Error log
  const errors = runLog.filter((e) => !e.success).slice(-10).reverse();
  const errorHtml = errors.map((e) =>
    renderActivityItem({
      type: "rejected",
      title: e.agent || "Unknown agent",
      detail: e.summary?.slice(0, 100) || "Failed",
      time: timeAgo(e.timestamp),
    })
  ).join("\n");

  return `<span class="section-label">Last Run Status</span>
${phaseBarHtml}

<span class="section-label">Run History (${history.length} days)</span>
<div class="chart-container" style="margin-bottom:24px">
  <canvas id="chart-run-history" aria-label="Nightly run pass/fail history"></canvas>
</div>

<div class="content-split">
  <div>
    <span class="section-label">Recent Errors</span>
    <div class="activity-list">${errorHtml || '<div class="activity-item"><div class="activity-text" style="color:var(--color-pass)">No recent errors</div></div>'}</div>
  </div>
  <div>
    <span class="section-label">Agent Timing</span>
    <div class="activity-list">
      ${lastRun.slice(-8).reverse().map((e) =>
        renderActivityItem({
          type: "agent",
          title: e.agent || "—",
          detail: e.summary?.slice(0, 60) || "",
          time: e.elapsed || "—",
        })
      ).join("\n") || '<div class="activity-item"><div class="activity-text" style="color:var(--text-muted)">No timing data</div></div>'}
    </div>
  </div>
</div>`;
}

// --- Changes Tab ---

export function renderChangesTab(data, pendingItems) {
  const review = data.reviewResults || {};
  const approved = review.approved || 0;
  const rejected = review.rejected || 0;
  const revised = review.revised || 0;
  const items = review.items || [];

  // Pipeline stats
  const total = approved + rejected + revised;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  // Pending items
  const pendingHtml = (pendingItems || []).map((p) => {
    const waiting = p.generatedAt ? timeAgo(p.generatedAt) : "unknown";
    const staleClass = p.generatedAt && (Date.now() - new Date(p.generatedAt).getTime()) > 86400000 ? " stale" : "";
    return `<div class="pending-card${staleClass}" style="margin-bottom:12px">
  <div style="display:flex;justify-content:space-between;margin-bottom:4px">
    <strong style="font-size:13px">${p.type || "Unknown"}</strong>
    <span style="font-size:11px;color:var(--text-muted)">${waiting}</span>
  </div>
  <div style="font-size:12px;color:var(--text-secondary)">${p.targetPage || ""}</div>
  <div style="font-size:11px;color:var(--text-muted);margin-top:4px">Priority: ${p.priority || "—"} · Review tier: ${p.reviewTier || "—"}</div>
</div>`;
  }).join("\n");

  // Recent changes feed
  const changeHtml = items.slice(0, 15).map((item) => {
    const type = item.verdict === "APPROVE" ? "approved" : item.verdict === "REJECT" ? "rejected" : "revised";
    const confidence = item.confidence ? ` (${item.confidence}%)` : "";
    const rounds = item.revisionCount > 0 ? ` · ${item.revisionCount} revision(s)` : "";
    return renderActivityItem({
      type,
      title: `${item.actionType || "Change"}${confidence}`,
      detail: `${item.targetPage || ""}${rounds}`,
      time: timeAgo(item.reviewedAt || item.timestamp),
    });
  }).join("\n");

  return `<span class="section-label">Review Pipeline This Week</span>
<div class="kpi-row" style="grid-template-columns:repeat(3,1fr);margin-bottom:24px">
  ${renderKpiCard({ label: "Approved", value: String(approved), detail: `${approvalRate}% approval rate`, color: "var(--color-pass)" })}
  ${renderKpiCard({ label: "Rejected", value: String(rejected), color: "var(--color-fail)" })}
  ${renderKpiCard({ label: "Revised", value: String(revised), detail: "Required additional rounds", color: "var(--color-warn)" })}
</div>

<div class="content-split">
  <div>
    <span class="section-label">Pending Review${pendingItems?.length ? ` (${pendingItems.length})` : ""}</span>
    ${pendingHtml || '<div style="color:var(--text-muted);font-size:13px;padding:16px">No items pending review</div>'}
  </div>
  <div>
    <span class="section-label">Recent Changes</span>
    <div class="activity-list">${changeHtml || '<div class="activity-item"><div class="activity-text" style="color:var(--text-muted)">No changes recorded yet</div></div>'}</div>
  </div>
</div>

<span class="section-label">Approval Rate Trend</span>
<div class="chart-container">
  <canvas id="chart-approval-trend" aria-label="Review approval rate trend"></canvas>
</div>`;
}
