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

### Marketing Automation

Autonomous marketing system in `monitoring/marketing/`. Uses Claude API for content generation and posts to dedicated Discord channels.

#### Key Commands

```bash
cd monitoring && npm run marketing:brand-kit    # Build/refresh brand kit
cd monitoring && npm run marketing:cro          # Run CRO audit
cd monitoring && npm run marketing:funnels      # Run funnel generator
cd monitoring && npm run marketing:social       # Run social media generator
```

#### Brand Kit

- `monitoring/marketing/brand-kit.json` — machine-readable brand identity
- `monitoring/marketing/brand-kit.html` — visual reference
- Refresh with `npm run marketing:brand-kit`
- All marketing scripts consume brand-kit.json for consistency

#### Marketing Discord Channels

| Channel | Env Var | Purpose |
|---|---|---|
| Marketing & CRO | `DISCORD_CRO_WEBHOOK_URL` | Daily CRO audit, conversion recommendations, auto-fix PRs |
| Funnels & Landing Pages | `DISCORD_FUNNELS_WEBHOOK_URL` | Landing page freshness, new page generation |
| Social Media | `DISCORD_SOCIAL_WEBHOOK_URL` | Daily LinkedIn post, image prompt, companion pages |

#### Marketing GitHub Actions Workflows

| Workflow | File | Schedule |
|---|---|---|
| CRO Audit | `.github/workflows/marketing-cro.yml` | Daily 10am PDT |
| Funnels | `.github/workflows/marketing-funnels.yml` | Daily 11am PDT |
| Social Media | `.github/workflows/marketing-social.yml` | Daily 12pm PDT |

#### Safety Tiers

- **Auto-commit:** Meta tag tweaks, CTA text improvements
- **Auto-PR:** New landing pages, companion pages, significant copy changes (prefix: `[marketing-auto]`)
- **Never auto-fix:** Pricing, legal content, business model claims, contact info

### SEO Automation

Claude-powered SEO optimization system in `monitoring/seo/`. Each job crawls the live site, analyzes with Claude API, posts results to Discord #seo channel, and auto-creates PRs for fixes.

#### Key Commands

```bash
cd monitoring && npm run seo:internal-links    # Optimize internal linking
cd monitoring && npm run seo:external-links    # Add authoritative external citations
cd monitoring && npm run seo:broken-links      # Find and fix broken links
cd monitoring && npm run seo:freshness         # Flag and update stale content
cd monitoring && npm run seo:meta-tags         # Optimize title tags and meta descriptions
cd monitoring && npm run seo:cannibalization   # Fix keyword cannibalization
cd monitoring && npm run seo:blog-topics       # Generate and write 5 new blog posts
cd monitoring && npm run seo:page-scores       # Score all pages on SEO metrics
```

#### SEO GitHub Actions Workflows

| Workflow | File | Schedule |
|---|---|---|
| Internal Link Optimizer | `seo-internal-links.yml` | Daily 6am PDT |
| External Link Enrichment | `seo-external-links.yml` | Daily 7am PDT |
| Broken Link Fixer | `seo-broken-links.yml` | Daily 8am PDT |
| Content Freshness | `seo-content-freshness.yml` | Daily 9am PDT |
| Meta Tag Optimizer | `seo-meta-tags.yml` | Daily 10am PDT |
| Keyword Cannibalization | `seo-cannibalization.yml` | Daily 11am PDT |
| Blog Post Writer | `seo-blog-topics.yml` | Daily 12pm PDT |
| Page Performance Scorer | `seo-page-scores.yml` | Daily 1pm PDT |

All jobs use `model: "haiku"` for analysis and `model: "sonnet"` for content generation. Auto-PRs are created on `seo-auto/*` branches. Requires `ANTHROPIC_API_KEY` and `DISCORD_SEO_WEBHOOK_URL` secrets.

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
