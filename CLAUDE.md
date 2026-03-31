# DeMar Transportation Website

## Project Overview

React/Vite/TypeScript SPA deployed to GreenGeeks (Apache/cPanel) via FTP in `deploy.yml`. Uses shadcn/ui + Tailwind CSS.

- **Live site:** https://demartransportation.com
- **Repo:** erikcode-create/demar-digital-drive
- **Dev server:** `npm run dev` (port 8080)
- **Build:** `npm run build` (output: `dist/`)
- **Path alias:** `@` maps to `./src`

## Monitoring System

Automated website health scanner in `monitoring/`. Posts results to Discord via webhook. Runs on GitHub Actions.

- **Entry point:** `monitoring/run-scans.mjs`
- **Scanners:** `monitoring/scans/*.mjs` (security, dependencies, seo, performance, images, accessibility, schema, social-preview, links, freshness, dns)
- **Shared lib:** `monitoring/lib/scanner.mjs` (fetch helpers, score computation), `monitoring/lib/discord.mjs` (webhook posting)
- **Detailed docs:** `monitoring/README.md`

### Key Commands

```bash
cd monitoring && node run-scans.mjs --type full          # all 11 scanners
cd monitoring && node run-scans.mjs --type lightweight   # security + dependencies + freshness + dns
cd monitoring && node run-scans.mjs --scan <name>        # single scanner (security|dependencies|seo|performance|images|accessibility|schema|social-preview|links|freshness|dns)
```

### Scanner Interface

Every scanner exports `run()` returning:

```typescript
{
  category: string;          // e.g. "Security"
  status: "pass" | "warn" | "fail";
  score: number;             // 0-100
  checks: Check[];
}
```

### Check Format (Honesty Layer)

```typescript
{
  name: string;              // what was checked
  status: "pass" | "warn" | "fail";
  detail: string;            // human-readable result
  confidence?: "VERIFIED" | "INFERRED" | "UNABLE_TO_VERIFY";
  reason?: string;           // why this confidence level
}
```

- `VERIFIED` -- directly observed (e.g. HTTP header present)
- `INFERRED` -- derived from indirect evidence (e.g. cheerio can't run JS, so absence may be false negative)
- `UNABLE_TO_VERIFY` -- check could not run; excluded from score computation

### Adding a New Scanner

1. Create `monitoring/scans/<name>.mjs`
2. Export `async function run()` returning `{ category, status, score, checks }`
3. Use helpers from `../lib/scanner.mjs`: `fetchPage`, `fetchHeaders`, `computeStatus`, `computeScore`
4. Register in `SCAN_MODULES` and `FULL_SCANS` (and optionally `LIGHTWEIGHT_SCANS`) in `run-scans.mjs`
5. Add npm script in `monitoring/package.json`

### Discord Integration

Four channels, four webhooks:

| Channel | Env Var | Purpose |
|---|---|---|
| Website Health | `DISCORD_WEBHOOK_URL` | Scan results, uptime alerts, auto-fix notifications |
| Content & Copywriting | `DISCORD_CONTENT_WEBHOOK_URL` | Content suggestions, copy changes, text updates |
| SEO | `DISCORD_SEO_WEBHOOK_URL` | Daily SEO audit results (seo, schema, social-preview, links, freshness) |
| SEO Dashboard | `DISCORD_SEO_DASHBOARD_WEBHOOK_URL` | Ahrefs-like dashboards: rank tracking, site audit, backlinks, CWV, E-E-A-T, competitors |

- Use `postToChannel("health"|"content"|"seo"|"seo-dashboard", payload)` from `monitoring/lib/discord.mjs`
- Color coding: green (pass/3066993), yellow (warn/16776960), red (fail/15158332)
- One embed per scanner, max 10 per message (Discord limit)
- Summary line: counts of passed/warnings/critical

### GitHub Actions Workflows

| Workflow | File | Trigger |
|---|---|---|
| Deploy (GreenGeeks SSH) | `.github/workflows/deploy.yml` | Push to main, manual dispatch |

All other workflows (monitoring, SEO, marketing) have been removed. Their functionality is replaced by the multi-agent SEO system below.

### Multi-Agent SEO System

Coordinated multi-agent system in `monitoring/agents/`. Agents share intelligence via JSON state files so rank drops trigger content improvements, content gaps get filled, and E-E-A-T scores feed back to the writer. Reads source TSX files directly instead of crawling the live site.

#### Architecture

5 phases run in sequence: Intelligence (data collection) → Analysis (evaluation) → Strategy (prioritization) → Action (execution) → Reporting (Discord).

#### Agent Commands

```bash
cd monitoring && npm run agents:full            # Full cycle: all 5 phases
cd monitoring && npm run agents:intelligence    # Phase 1: rank tracking, search console, competitors, backlinks, CWV
cd monitoring && npm run agents:analysis        # Phase 2: site audit, E-E-A-T, page scores, content gaps
cd monitoring && npm run agents:strategy        # Phase 3: analyze all data, produce action queue
cd monitoring && npm run agents:action          # Phase 4: execute top actions from queue
cd monitoring && npm run agents:dry-run         # Full cycle without executing actions
cd monitoring && npm run agents:rank-recovery   # Closed loop: detect rank drops → fix → monitor
cd monitoring && npm run agents:content-gaps    # Closed loop: find gaps → write content → track
cd monitoring && npm run agents:eeat            # Closed loop: score E-E-A-T → improve weak pages
```

Single agent: `cd monitoring && node agents/orchestrator.mjs --agent <name>`

Available agents: rank-tracker, search-console, competitor-tracker, backlink-monitor, cwv-monitor, site-auditor, eeat-scorer, page-scorer, content-gap-analyzer, strategy, content-writer, meta-tag-optimizer, internal-link-optimizer, technical-fixer

#### Shared Libraries

- `monitoring/agents/lib/state.mjs` — shared state read/write (file-based message bus)
- `monitoring/agents/lib/source-reader.mjs` — parse TSX source files directly (no HTTP crawling)
- `monitoring/seo/lib/pages.mjs` — canonical page list
- `monitoring/seo/lib/serper.mjs` — Serper API client
- `monitoring/seo/lib/search-console.mjs` — Google Search Console API client
- `monitoring/marketing/lib/claude-api.mjs` — Claude API wrapper
- `monitoring/marketing/lib/git-ops.mjs` — git commit/push/PR operations
- `monitoring/lib/discord.mjs` — Discord webhook posting

#### State Directory

Agent state stored in `monitoring/agents/state/` (gitignored). Categories: intelligence/, analysis/, strategy/, meta/.

#### Discord Channel Routing

| Agent Category | Channel | Env Var |
|---|---|---|
| Intelligence/Analysis/Strategy | seo-dashboard | `DISCORD_SEO_DASHBOARD_WEBHOOK_URL` |
| Content Writer | seo | `DISCORD_SEO_WEBHOOK_URL` |
| Meta/Link/Tech Fixers | seo | `DISCORD_SEO_WEBHOOK_URL` |
| Build Failures | health | `DISCORD_WEBHOOK_URL` |

Requires `SERPER_API_KEY`, `GOOGLE_SERVICE_ACCOUNT_JSON`, `DISCORD_SEO_DASHBOARD_WEBHOOK_URL`, `DISCORD_SEO_WEBHOOK_URL`, and `ANTHROPIC_API_KEY` secrets.

#### Legacy Scripts

Old standalone scripts remain in `monitoring/seo/` and `monitoring/marketing/` for reference. They are no longer triggered by GitHub Actions.

### Blog / Insights

Blog posts live at `/blog` (displayed as "Insights" in the nav). Uses `BlogPost` template component with BlogPosting + FAQPage + BreadcrumbList JSON-LD schemas, hero images, and inline CTAs.

- **Template:** `src/components/BlogPost.tsx`
- **Posts:** `src/pages/blog/*.tsx`
- **Images:** `public/images/blog/` (sourced from Pixabay)
- **Index:** `src/pages/Blog.tsx`
- **Daily auto-generation:** `monitoring/seo/blog-topic-generator.mjs` writes 5 new posts/day

## Important Constraints

- **Security headers are set via `public/.htaccess`** (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP). CSP is also duplicated in a `<meta>` tag in `index.html` as a fallback.
- **SPA + cheerio limitation:** Scanners fetch raw HTML. React-rendered content is invisible to cheerio. SEO/accessibility scanners only see SSR or `<head>` content, not runtime DOM.
- **Never commit `.env` files or secrets.**
- **Auto-commit hooks** are configured in `.claude/settings.local.json` -- every Write/Edit triggers `git add + commit + push`.

### Auto-Fix System

After scans detect issues, `monitoring/auto-fix.mjs` classifies them and invokes Claude Code CLI to fix:

- **Tier 1 (auto-commit):** npm audit fix, copyright year, meta description length
- **Tier 2 (auto-PR):** schema props, OG/Twitter tags, broken links, placeholder text
- **Never auto-fix:** security headers, business content, structural changes
- **Safety:** build verification, max 1 run/day, `[auto-fix]` commit prefix, Discord notifications
- **Rules:** `monitoring/lib/fix-rules.mjs`
- **Requires:** `ANTHROPIC_API_KEY` GitHub secret

## Scan Tiers

- **Lightweight (daily Mon-Sat):** security, dependencies, freshness, dns -- fast, no external API calls
- **Full (weekly Sunday):** all 11 scanners including PageSpeed Insights API (performance), link crawling, and WHOIS lookups
