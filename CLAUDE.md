# DeMar Transportation Website

## Project Overview

React/Vite/TypeScript SPA deployed to GitHub Pages via `deploy.yml`. Uses shadcn/ui + Tailwind CSS.

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

Three channels, three webhooks:

| Channel | Env Var | Purpose |
|---|---|---|
| Website Health | `DISCORD_WEBHOOK_URL` | Scan results, uptime alerts, auto-fix notifications |
| Content & Copywriting | `DISCORD_CONTENT_WEBHOOK_URL` | Content suggestions, copy changes, text updates |
| SEO | `DISCORD_SEO_WEBHOOK_URL` | Daily SEO audit results (seo, schema, social-preview, links, freshness) |

- Use `postToChannel("health"|"content"|"seo", payload)` from `monitoring/lib/discord.mjs`
- Color coding: green (pass/3066993), yellow (warn/16776960), red (fail/15158332)
- One embed per scanner, max 10 per message (Discord limit)
- Summary line: counts of passed/warnings/critical

### GitHub Actions Workflows

| Workflow | File | Schedule |
|---|---|---|
| Deploy | `.github/workflows/deploy.yml` | Push to main |
| Website Monitor | `.github/workflows/website-monitor.yml` | Mon-Sat 7am PDT lightweight, Sun 7am PDT full |
| SEO Audit | `.github/workflows/seo-audit.yml` | Daily 9am PDT |
| Website Uptime | `.github/workflows/website-uptime.yml` | Every 15 min (check), daily 8am PDT (summary) |
| CRO Audit | `.github/workflows/marketing-cro.yml` | Daily 10am PDT |
| Funnels | `.github/workflows/marketing-funnels.yml` | Daily 11am PDT |
| Social Media | `.github/workflows/marketing-social.yml` | Daily 12pm PDT |

`website-monitor.yml` and `website-uptime.yml` both support `workflow_dispatch`.

### Uptime Monitor

Separate system from scanners. Checks site availability every 15 minutes, tracks state via GitHub Actions cache.

- **Script:** `monitoring/uptime.mjs` (`check` or `summary` command)
- **State:** `monitoring/uptime-state.json` (gitignored, persisted via Actions cache)
- **Discord alerts:** State-change only (site down / site recovered), plus daily summary at 8am PDT
- **Key commands:** `cd monitoring && node uptime.mjs check` / `cd monitoring && node uptime.mjs summary`

## Important Constraints

- **GitHub Pages cannot set custom HTTP response headers.** CSP is set via `<meta>` tag only. Security scanners will always show missing headers like HSTS, X-Frame-Options, etc. -- this is expected.
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
