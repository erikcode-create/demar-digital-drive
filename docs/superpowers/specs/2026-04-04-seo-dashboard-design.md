# SEO Dashboard Design Specification

## Overview

A self-contained HTML dashboard generated nightly that visualizes all SEO agent data — site health scores, keyword rankings, agent activity, review pipeline status, and open issues. Deployed to `demartransportation.com/seo-dashboard/` with token-based access. Link posted to Discord after each generation.

**Audience:** Internal only (Erik + Colby)
**Access:** Token in URL query param (`?key=<token>`)
**Data retention:** 90 days of daily snapshots
**Inspiration:** Agentic-SEO-Skill HTML report format + Ahrefs/SEMrush dashboard patterns + 21st.dev component design

---

## Architecture

### Data Pipeline

```
Nightly Run (nightly.mjs)
  │
  ├── Intelligence → Analysis → Strategy → Action → Review (existing)
  │
  └── NEW: Dashboard Phase
       │
       ├── 1. Save daily snapshot
       │     monitoring/agents/state/history/YYYY-MM-DD.json
       │     (consolidated: all agent state categories + run log + review results)
       │
       ├── 2. Generate dashboard
       │     monitoring/dashboard/generate.mjs
       │     Reads: state/*.json + state/history/*.json (last 90 days)
       │     Outputs: monitoring/dashboard/dist/index.html
       │
       ├── 3. FTP deploy
       │     Upload index.html → seo-dashboard/index.html on GreenGeeks
       │
       └── 4. Discord notification
             Post embed with score + link to seo-dashboard channel
```

### Daily Snapshots

After each nightly run, a snapshot consolidator saves all current agent state into a single dated JSON file:

**File:** `monitoring/agents/state/history/YYYY-MM-DD.json`

**Structure:**
```json
{
  "_date": "2026-04-04",
  "_generatedAt": "2026-04-04T03:42:00Z",
  "siteAudit": { "score": 74, "pages": [...], "checks": {...} },
  "rankings": { "keywords": [...], "changes": {...} },
  "searchConsole": { "topQueries": [...], "topPages": [...] },
  "competitors": { "rankings": {...} },
  "cwv": { "metrics": {...} },
  "eeat": { "scores": {...} },
  "backlinks": { "profile": {...} },
  "runLog": [ { "agent": "...", "success": true, "elapsed": "..." } ],
  "reviewResults": { "approved": 3, "rejected": 1, "revised": 1, "items": [...] }
}
```

**Retention:** 90 files maximum. The snapshot script deletes files older than 90 days.

**Gitignore:** `monitoring/agents/state/history/` is gitignored (already covered by `monitoring/agents/state/` being gitignored in the existing `.gitignore` patterns).

### Dashboard Generator

**File:** `monitoring/dashboard/generate.mjs`

**Inputs:**
- Current state: `monitoring/agents/state/{category}/*.json`
- Historical snapshots: `monitoring/agents/state/history/*.json` (up to 90)
- Pending items: `monitoring/agents/pending/*/manifest.json`
- Run log: `monitoring/agents/state/meta/run-log.json`
- Dashboard token: `SEO_DASHBOARD_TOKEN` env var

**Output:** `monitoring/dashboard/dist/index.html` — a single self-contained HTML file with:
- Embedded CSS (Inter font via Google Fonts CDN)
- Chart.js via CDN for trend charts
- All data inlined as `<script>const DASHBOARD_DATA = {...}</script>`
- Token validation JS (checks `?key=` param, shows "Access denied" if missing/wrong)

### Token Gate

The generated HTML includes the expected token hash (SHA-256). On page load, JS hashes the `?key=` query param and compares. No match = page content hidden, "Access denied" message shown. This is not cryptographic security — it's a simple gate to prevent casual access. The URL with token is only shared in Discord.

```javascript
const expectedHash = "INJECTED_AT_BUILD_TIME";
const key = new URLSearchParams(location.search).get("key") || "";
crypto.subtle.digest("SHA-256", new TextEncoder().encode(key))
  .then(buf => {
    const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
    if (hash !== expectedHash) {
      document.getElementById("app").innerHTML = "<p>Access denied</p>";
    }
  });
```

---

## UI Design

### Design System

**Theme:** Dark mode only (internal tool)

**Colors:**
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-base` | `#0f1117` | Page background |
| `--bg-card` | `#1a1d27` | Card surfaces |
| `--bg-hover` | `#252836` | Hover states, ring backgrounds |
| `--border` | `rgba(255,255,255,0.08)` | Card borders, dividers |
| `--text-primary` | `#e8eaed` | Headings, values |
| `--text-secondary` | `#9aa0b0` | Labels, descriptions |
| `--text-muted` | `#5a6178` | Timestamps, inactive elements |
| `--color-pass` | `#10b981` | Scores 80+, passing, upward trends |
| `--color-good` | `#06b6d4` | Scores 60-79 |
| `--color-warn` | `#f59e0b` | Scores 40-59, warnings |
| `--color-fail` | `#ef4444` | Scores <40, failures, critical issues |
| `--color-info` | `#3b82f6` | Informational, links |
| `--color-accent` | `#7c6fff` | Brand accent, active tab |

**Typography:**
- Font: Inter (Google Fonts CDN), fallback to system stack
- KPI values: 28px, weight 700
- Section headings: 16px, weight 600
- Card titles: 13px, weight 600
- Labels: 12px, weight 500, uppercase, letter-spacing 0.5px
- Body: 14px, weight 400
- Monospace for numbers: system monospace stack

**Cards:**
- Background: `--bg-card`
- Border: 1px solid `--border`
- Border radius: 12px (cards), 8px (inner elements)
- Padding: 20-24px
- Shadow: `0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)`

**Score indicators:**
- Hero score: SVG donut ring (100px diameter), color-coded, animated `stroke-dashoffset`
- Category scores: SVG mini-ring (48px), color-coded
- KPI values: Large colored numbers with delta arrows below

**Trend indicators:**
- Delta arrows: `▲ +3` green / `▼ -2` red / `— No change` gray
- Sparklines: Inline SVG polylines (100px wide, 32px tall) with gradient fill
- Full charts: Chart.js line charts with gradient fill, tension 0.35, hidden points (show on hover)

### Layout

**Structure:** Fixed header + KPI row + tab bar + tab content

```
┌─────────────────────────────────────────────────┐
│ DeMar SEO Dashboard          Last updated: ...  │  Header
├─────────────────────────────────────────────────┤
│ [Score Ring] [Agent Health] [Rankings] [Pipeline] [Issues] │  KPI Row
├─────────────────────────────────────────────────┤
│ Site Health | Rankings | Agent Activity | Changes│  Tab Bar
├─────────────────────────────────────────────────┤
│                                                 │
│  Tab Content (switches without page reload)     │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Responsive breakpoints:**
- Desktop (>1200px): Full grid, 3-4 column cards
- Tablet (768-1200px): 2-column grid
- Mobile (<768px): Single column, scrollable KPI row

### Tab: Site Health (Default)

**Top section — Category Score Grid (6 cards):**
Each card shows: mini score ring + category name + description + delta arrow
- On-Page SEO (titles, metas, H1s, canonicals)
- Technical (security, robots, redirects)
- E-E-A-T (trust, expertise, authority)
- Core Web Vitals (LCP, INP, CLS)
- Schema (JSON-LD structured data)
- Internal Links (structure, orphans, depth)

**Bottom section — Split layout:**

Left: **Score Trends** — Chart.js line chart showing all 6 category scores over 90 days. Toggleable series.

Right: **Top Issues** — Sorted by severity (critical → warning → info). Each shows icon, description, affected page, severity badge. Expandable for details. Max 10 shown, "Show all" link.

### Tab: Rankings

**Top section — Keyword Table:**
Sortable columns: Keyword | Position | Change | Best Ever | URL | SERP Features
- Rows color-coded by change direction
- Filterable by page or position range

**Middle section — Position Trend Chart:**
Chart.js line chart, inverted Y axis (position 1 at top). Top 10 keywords, 90 days. Legend with toggleable series.

**Bottom section — Split layout:**

Left: **Search Console** — Top 10 queries table (clicks, impressions, CTR, avg position). Top 10 pages by clicks.

Right: **Competitor Comparison** — Table showing your position vs top 3 competitors per keyword. Color-coded cells (green = you're ahead, red = behind).

### Tab: Agent Activity

**Top section — Last Run Status:**
Horizontal bar showing each phase as a colored block: Intelligence → Analysis → Strategy → Action → Review. Green for pass, red for fail. Duration label on each block.

**Middle section — Run History:**
90-day bar chart (Chart.js). One bar per night. Color: green (all pass), yellow (partial), red (all fail). Hover shows phase-level breakdown.

**Bottom section — Split layout:**

Left: **Error Log** — Recent failures, expandable. Shows: timestamp, agent name, error message (truncated), phase.

Right: **Agent Timing** — Table: agent name, avg duration (last 7 runs), trend sparkline, last run duration. Sorted by slowest.

### Tab: Changes

**Top section — Review Pipeline Stats:**
3 KPI cards: Approved (count + rate), Rejected (count + rate), Revised (count + avg rounds). Plus a 90-day trend chart of approval rate.

**Middle section — Pending Review:**
Cards for each item in `pending/` directory. Shows: action type, target page, priority, time waiting. Yellow highlight if waiting > 24h.

**Bottom section — Recent Changes Feed:**
Full list, most recent first. Each row shows:
- Status icon (✓ approved, ↻ revised, ✗ rejected)
- Action type + target page
- Verdict + confidence percentage
- Revision count (if > 0)
- Timestamp
- Click to expand: reviewer feedback, model used, diff summary

---

## Integration

### Nightly Job Changes

Add three new steps to `monitoring/nightly.mjs` after the review phase:

1. **Save daily snapshot** — `node dashboard/snapshot.mjs`
2. **Generate dashboard** — `node dashboard/generate.mjs`
3. **Deploy dashboard** — FTP upload `dashboard/dist/index.html` to `seo-dashboard/` on GreenGeeks
4. **Discord notification** — Post dashboard link embed to `seo-dashboard` channel

### Discord Embed

Posted to `seo-dashboard` channel after successful generation:

```
🔍 SEO Dashboard Updated

Overall Score: 74/100 (▲ +3)
5/5 agents passed | 6 approved, 1 rejected | 23 open issues

📊 View Dashboard
https://demartransportation.com/seo-dashboard/?key=<token>
```

### FTP Deployment

Use the same FTP credentials as the existing `deploy.yml`:
- Host: from `FTP_SERVER` secret
- Username: from `FTP_USERNAME` secret
- Password: from `FTP_PASSWORD` secret
- Remote path: `/public_html/seo-dashboard/index.html`

The generator can call FTP directly via `basic-ftp` npm package (already a pattern in the codebase), or the nightly job can use `lftp`/`curl` to upload.

### New Secrets Required

| Secret | Purpose |
|--------|---------|
| `SEO_DASHBOARD_TOKEN` | Token for URL-based access gate |

All other secrets (FTP, Discord webhooks) already exist.

---

## File Structure

```
monitoring/
  dashboard/
    generate.mjs          — Main generator: reads state, builds HTML, writes dist/
    snapshot.mjs           — Daily snapshot consolidator
    templates/
      shell.html          — HTML template with CSS, JS framework, Chart.js CDN
      components.mjs      — HTML generators for cards, charts, tables, rings
    dist/
      index.html          — Generated output (gitignored)
  agents/
    state/
      history/            — Daily snapshots (gitignored)
        2026-04-04.json
        2026-04-03.json
        ...
```

---

## Testing Strategy

**Unit tests** (`monitoring/dashboard/tests/`):
- `snapshot.test.mjs` — Snapshot consolidation, file naming, retention cleanup
- `components.test.mjs` — HTML generation for each component type (KPI cards, score rings, tables, charts)
- `generate.test.mjs` — Full generation with mock data, token injection, output structure

**Integration test:**
- `e2e-dashboard.mjs` — Generate dashboard with fixture data, open in Playwright, verify:
  - All 4 tabs render and switch
  - KPI cards show correct values
  - Score rings have correct stroke-dashoffset for given scores
  - Charts render (Chart.js canvas elements present)
  - Token gate blocks access without valid key
  - Token gate allows access with valid key
  - Responsive layout at 3 breakpoints (desktop, tablet, mobile)
  - All activity items and issues render
  - Sortable tables sort correctly
  - Expandable items expand/collapse

**Visual regression:**
- Playwright screenshots at desktop/tablet/mobile saved for manual review

---

## Accessibility

- Never use color alone — all status indicators include text labels or icons
- Contrast ratios: primary text 13:1, secondary 7:1, muted 4.5:1 (all exceed WCAG AA)
- Score rings include `role="img"` with `aria-label="Score: 74 out of 100"`
- Chart.js canvases include `aria-label` describing the trend
- Tab navigation keyboard-accessible (arrow keys to switch tabs)
- `@media (prefers-reduced-motion: no-preference)` wraps all animations
- Visually hidden summary text at top for screen readers
