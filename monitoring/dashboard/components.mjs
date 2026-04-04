/**
 * Pure HTML generators for dashboard components.
 * Each function takes data and returns an HTML string.
 */

// --- Utilities ---

export function scoreColor(score) {
  if (score >= 80) return "var(--color-pass)";
  if (score >= 60) return "var(--color-good)";
  if (score >= 40) return "var(--color-warn)";
  return "var(--color-fail)";
}

export function scoreGrade(score) {
  if (score >= 90) return "EXCELLENT";
  if (score >= 70) return "GOOD";
  if (score >= 50) return "NEEDS WORK";
  return "CRITICAL";
}

export function renderDeltaArrow(change) {
  if (change > 0) return `<span style="color:var(--color-pass)">▲ ${change}</span>`;
  if (change < 0) return `<span style="color:var(--color-fail)">▼ ${Math.abs(change)}</span>`;
  return `<span style="color:var(--text-muted)">— No change</span>`;
}

// --- Score Ring (hero, 100px) ---

export function renderScoreRing({ score, label, delta }) {
  const circumference = 2 * Math.PI * 42; // r=42
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);
  const grade = scoreGrade(score);

  return `<div class="score-ring-card">
  <div class="score-ring" role="img" aria-label="Score: ${score} out of 100">
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle class="score-ring-bg" cx="50" cy="50" r="42"/>
      <circle class="score-ring-fill" cx="50" cy="50" r="42"
              stroke="${color}" stroke-dasharray="${circumference.toFixed(1)}"
              stroke-dashoffset="${offset.toFixed(1)}"/>
    </svg>
    <div class="score-ring-text">
      <span class="number" style="color:${color}">${score}</span>
      <span class="grade">${grade}</span>
    </div>
  </div>
  <div class="score-ring-label">${label}</div>
  ${delta ? `<div class="score-ring-delta" style="color:var(--color-pass)">${delta}</div>` : ""}
</div>`;
}

// --- KPI Card ---

export function renderKpiCard({ label, value, detail, delta, color, sparklineHtml }) {
  const deltaDir = delta?.direction === "up" ? "positive" : delta?.direction === "down" ? "negative" : "neutral";
  const deltaIcon = delta?.direction === "up" ? "▲" : delta?.direction === "down" ? "▼" : "—";

  return `<div class="kpi-card">
  <div class="kpi-label">${label}</div>
  <div class="kpi-value" style="color:${color || "var(--text-primary)"}">${value}</div>
  ${detail ? `<div class="kpi-detail">${detail}</div>` : ""}
  ${delta ? `<div class="kpi-delta ${deltaDir}">${deltaIcon} ${delta.text}</div>` : ""}
  ${sparklineHtml ? `<div class="kpi-sparkline">${sparklineHtml}</div>` : ""}
</div>`;
}

// --- Category Score Card (mini ring, 48px) ---

export function renderCategoryCard({ name, description, score, delta }) {
  const circumference = 2 * Math.PI * 20; // r=20
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);

  return `<div class="category-card">
  <div class="category-ring" role="img" aria-label="${name}: ${score} out of 100">
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle class="cat-ring-bg" cx="24" cy="24" r="20"/>
      <circle class="cat-ring-fill" cx="24" cy="24" r="20" stroke="${color}"
              stroke-dasharray="${circumference.toFixed(1)}"
              stroke-dashoffset="${offset.toFixed(1)}"/>
    </svg>
    <span class="cat-score" style="color:${color}">${score}</span>
  </div>
  <div class="category-info">
    <h4>${name}</h4>
    <div class="cat-detail">${description}</div>
    <div class="cat-delta">${renderDeltaArrow(delta)}</div>
  </div>
</div>`;
}

// --- Activity Item ---

export function renderActivityItem({ type, title, detail, time }) {
  const icons = { approved: "✓", rejected: "✗", revised: "↻", agent: "●" };
  const icon = icons[type] || "●";

  return `<div class="activity-item">
  <div class="activity-icon ${type}">${icon}</div>
  <div class="activity-text"><strong>${title}</strong> — ${detail}</div>
  <div class="activity-time">${time}</div>
</div>`;
}

// --- Issue Item ---

export function renderIssueItem({ severity, title, page }) {
  const severityMap = {
    critical: { icon: "!", class: "rejected", color: "var(--color-fail)", label: "Critical" },
    warning: { icon: "!", class: "revised", color: "var(--color-warn)", label: "Warning" },
    info: { icon: "i", class: "agent", color: "var(--text-muted)", label: "Info" },
  };
  const s = severityMap[severity] || severityMap.info;

  return `<div class="activity-item">
  <div class="activity-icon ${s.class}" style="font-size:10px;font-weight:700">${s.icon}</div>
  <div class="activity-text"><strong>${title}</strong> — ${page}</div>
  <div class="activity-time" style="color:${s.color}">${s.label}</div>
</div>`;
}

// --- Keyword Table Row ---

export function renderKeywordRow({ keyword, position, change, bestEver, url, serpFeatures }) {
  const changeHtml = renderDeltaArrow(change);
  return `<tr>
  <td>${keyword}</td>
  <td style="font-weight:600">${position}</td>
  <td>${changeHtml}</td>
  <td style="color:var(--text-muted)">${bestEver}</td>
  <td style="font-size:11px">${url || ""}</td>
  <td style="font-size:11px;color:var(--text-muted)">${serpFeatures || ""}</td>
</tr>`;
}

// --- Sparkline ---

export function renderSparkline({ data, color, width = 100, height = 24 }) {
  if (!data || data.length < 2) return "";
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const fillPoints = `0,${height} ${points} ${width},${height}`;

  return `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
  <polyline fill="none" stroke="${color}" stroke-width="1.5" points="${points}"/>
  <polyline fill="${color}22" stroke="none" points="${fillPoints}"/>
</svg>`;
}

// --- Phase Bar (Agent Activity) ---

export function renderPhaseBar(phases) {
  return `<div class="phase-bar">
  ${phases
    .map(
      (p) => `<div class="phase-block ${p.status}">
    <span class="phase-name">${p.phase}</span>
    <span class="phase-duration">${p.duration}</span>
  </div>`
    )
    .join("\n  ")}
</div>`;
}
