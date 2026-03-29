# DeMar Transportation — Discord Website Monitoring System

**Date:** 2026-03-28
**Status:** Approved
**Target:** https://demartransportation.com

## Overview

A website monitoring system that runs automated security, SEO, performance, dependency, and content scans against demartransportation.com and posts detailed results to a Discord channel via webhook. Scheduled scans run on GitHub Actions (no local machine dependency). Ad-hoc scans can be triggered manually via CLI or Claude Code sessions.

## Architecture

```
Website/
├── monitoring/
│   ├── scans/
│   │   ├── security.mjs        # Security header & SSL checks
│   │   ├── seo.mjs             # SEO meta, schema, sitemap checks
│   │   ├── performance.mjs     # Core Web Vitals via PageSpeed API
│   │   ├── dependencies.mjs    # npm audit + outdated packages
│   │   ├── images.mjs          # Image format, alt text, lazy loading
│   │   └── accessibility.mjs   # Heading hierarchy, ARIA, alt text
│   ├── lib/
│   │   ├── discord.mjs         # Discord webhook posting (rich embeds)
│   │   └── scanner.mjs         # Shared fetch/parse utilities
│   ├── run-scans.mjs           # Orchestrator: runs all or specific scans
│   └── package.json            # Scanner dependencies
├── .github/workflows/
│   ├── deploy.yml              # (existing)
│   └── website-monitor.yml     # Scheduled + manual trigger scans
```

## Discord Integration

- **Server:** DeMar Transportation (created 2026-03-28)
- **Channel:** Single channel for all scan results
- **Webhook URL:** Stored as GitHub Actions secret `DISCORD_WEBHOOK_URL`, never committed
- **Local use:** `.env` file (gitignored) with `DISCORD_WEBHOOK_URL` for ad-hoc runs

### Embed Format

Each scan posts a color-coded Discord embed:

| Color | Hex | Meaning |
|-------|-----|---------|
| Green | `3066993` | All checks pass |
| Yellow | `16776960` | Warnings, non-critical issues |
| Red | `15158332` | Critical issues needing attention |

A summary line leads each scan run message:
`✅ 4 passed · ⚠️ 1 warning · ❌ 1 critical`

Each category gets its own embed within the message, with failed checks listed as bullet points with severity tags.

## Scan Categories

### Daily Lightweight Scans (every morning, 7am PDT)

#### Security Scan (`security.mjs`)
- Security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
- SSL/TLS certificate validity and days until expiration
- HTTP → HTTPS redirect verification
- Mixed content detection
- Exposed sensitive files (.env, source maps, .git)
- X-Powered-By header exposure

#### Dependency Scan (`dependencies.mjs`)
- `npm audit` for known vulnerabilities (critical, high, moderate, low)
- Outdated packages with available updates
- Known CVEs in current dependency tree

### Weekly Full Scans (Sunday 7am PDT)

All daily scans plus:

#### SEO Scan (`seo.mjs`)
- Meta tags (title, description, viewport)
- Open Graph tags (og:title, og:description, og:image)
- Canonical URLs and self-referencing canonicals
- Structured data / JSON-LD validation
- Schema.org entity completeness
- Sitemap health (valid XML, URL accuracy, freshness dates)
- robots.txt configuration
- Broken links (internal)
- Mobile viewport configuration

#### Performance Scan (`performance.mjs`)
- Core Web Vitals via Google PageSpeed Insights API:
  - LCP (Largest Contentful Paint)
  - INP (Interaction to Next Paint)
  - CLS (Cumulative Layout Shift)
  - FCP (First Contentful Paint)
  - TTFB (Time to First Byte)
- Both mobile and desktop scores
- Render-blocking resources
- Third-party script impact

#### Images & Content Scan (`images.mjs`)
- Image formats (WebP/AVIF vs PNG/JPG)
- Missing alt text
- Lazy loading implementation
- Content freshness (copyright year, outdated dates)

#### Accessibility Scan (`accessibility.mjs`)
- Heading hierarchy (h1 → h2 → h3 order)
- ARIA labels on interactive elements
- Alt text coverage percentage
- Color contrast basics

## Standardized Scan Result Format

Every scanner exports a `run()` function returning:

```js
{
  category: "Security",           // Human-readable category name
  status: "pass" | "warn" | "fail",  // Overall status (worst check wins)
  score: 85,                      // 0-100 aggregate score
  checks: [
    {
      name: "HSTS Header",
      status: "pass",
      detail: "max-age=31536000; includeSubDomains"
    },
    {
      name: "CSP Header",
      status: "fail",
      detail: "Missing Content-Security-Policy header"
    }
  ]
}
```

## Trigger Paths

### 1. GitHub Actions Scheduled (no local dependency)

```yaml
on:
  schedule:
    - cron: '0 14 * * *'       # Daily at 7am PDT (lightweight)
    - cron: '0 14 * * 0'       # Sunday at 7am PDT (full — runs instead of lightweight)
  workflow_dispatch:
    inputs:
      scan_type:
        type: choice
        options: [lightweight, full]
        default: full
```

### 2. Manual / Ad-Hoc

```bash
# Via GitHub CLI (no local deps needed)
gh workflow run website-monitor.yml -f scan_type=full

# Via local Node.js
node monitoring/run-scans.mjs --type full
node monitoring/run-scans.mjs --type lightweight
node monitoring/run-scans.mjs --scan security    # single scan
```

### 3. Claude Code Sessions

Claude can trigger scans after making changes (security hardening, SEO updates, dependency upgrades) to verify the work and post results to Discord.

## Secrets & Configuration

| Secret/Variable | Location | Purpose |
|----------------|----------|---------|
| `DISCORD_WEBHOOK_URL` | GitHub Actions secret | Webhook for posting scan results |
| `DISCORD_WEBHOOK_URL` | `.env` (gitignored) | Local ad-hoc scan runs |
| `TARGET_URL` | Hardcoded in scanner | `https://demartransportation.com` |

## Dependencies (monitoring/package.json)

- `node-fetch` or native fetch (Node 18+) — HTTP requests
- `cheerio` — HTML parsing for SEO/accessibility checks
- `dotenv` — local .env loading for ad-hoc runs

No heavy frameworks. Lightweight, fast scans.

## Key Design Decisions

1. **GitHub Actions over local cron** — reliable, no dependency on Mac being on
2. **Single Discord channel** — keeps things simple, embeds are color-coded and labeled by category
3. **ES modules (.mjs)** — modern, no build step needed
4. **Modular scanners** — each scan is independent, easy to add new ones later
5. **Standardized result format** — consistent output makes Discord formatting and future integrations simple
6. **No database** — scan results are ephemeral (posted to Discord), no storage needed
7. **PageSpeed Insights API** — free tier, no key required for basic usage
