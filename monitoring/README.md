# Monitoring System

Automated website health monitoring for demartransportation.com. Runs scanners, computes scores, posts results to Discord.

## Architecture

```
run-scans.mjs          # CLI entry point, orchestrates scan execution
lib/
  scanner.mjs          # Shared utilities: fetch helpers, score/status computation
  discord.mjs          # Discord webhook: embed builder, color coding, posting
scans/
  security.mjs         # HTTP headers, SSL cert, HTTPS redirect, exposed files
  dependencies.mjs     # npm audit, outdated packages (runs against project root)
  seo.mjs              # Title, meta, OG tags, canonical, structured data, robots.txt, sitemap, broken links
  performance.mjs      # PageSpeed Insights API (mobile + desktop Core Web Vitals)
  images.mjs           # Format analysis (WebP/AVIF), alt text, lazy loading, copyright year
  accessibility.mjs    # Heading hierarchy, button labels, link accessibility, alt text, lang attr, skip nav
```

## Type Definitions

### Scanner Result

```typescript
interface ScanResult {
  category: string;                    // Display name, e.g. "Security"
  status: "pass" | "warn" | "fail";   // Worst status across scorable checks
  score: number;                       // 0-100, percentage of scorable checks passing
  checks: Check[];
}
```

### Check

```typescript
interface Check {
  name: string;                        // What was checked
  status: "pass" | "warn" | "fail";   // Result
  detail: string;                      // Human-readable explanation
  confidence?: Confidence;             // Honesty Layer (optional)
  reason?: string;                     // Why this confidence level (optional)
}

type Confidence = "VERIFIED" | "INFERRED" | "UNABLE_TO_VERIFY";
```

### Status/Score Computation

- `computeStatus(checks)` -- returns worst status among checks where `confidence !== "UNABLE_TO_VERIFY"`
- `computeScore(checks)` -- `passCount / scorableCount * 100`, excludes `UNABLE_TO_VERIFY`

## Honesty Layer

Addresses the fundamental limitation: scanners fetch static HTML via `fetch()` + cheerio. React-rendered content is invisible.

| Confidence | Meaning | Example |
|---|---|---|
| `VERIFIED` | Directly observed in response | HTTP header present, meta tag in raw HTML |
| `INFERRED` | Indirect evidence, may be inaccurate | No H1 in HTML, but React likely renders one |
| `UNABLE_TO_VERIFY` | Cannot determine | Check requires JS execution or browser context |

Checks with `UNABLE_TO_VERIFY` are excluded from score and status computation so they don't penalize the site unfairly.

## Discord Embed Format

Each scan result becomes one embed:

```
Title:  [emoji] Category
Color:  green (pass) / yellow (warn) / red (fail)
Body:   Score: X/100
        N/M checks passed
        [only failing/warning checks listed with emoji + name + detail]
```

Summary message before embeds: `Website Scan -- [date]` with counts of passed/warnings/critical.

Color codes: pass=3066993 (green), warn=16776960 (yellow), fail=15158332 (red). Max 10 embeds per Discord message.

## Running Locally

### Setup

```bash
cd monitoring
npm install
echo "DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/..." > .env
```

### Commands

```bash
npm run scan              # Full scan (all 6 scanners)
npm run scan:light        # Lightweight (security + dependencies)
npm run scan:security     # Single scanner
npm run scan:seo
npm run scan:perf
npm run scan:deps
npm run scan:images
npm run scan:a11y
```

Or directly:

```bash
node run-scans.mjs --type full
node run-scans.mjs --type lightweight
node run-scans.mjs --scan security
```

## Adding a New Scanner

1. Create `scans/<name>.mjs`:

```javascript
import { fetchPage, fetchHeaders, TARGET_URL, computeStatus, computeScore } from "../lib/scanner.mjs";

export async function run() {
  const checks = [];

  // Your checks here
  checks.push({
    name: "Check Name",
    status: "pass",           // or "warn" or "fail"
    detail: "What happened",
    confidence: "VERIFIED",   // optional
    reason: "Directly observed in HTTP response",  // optional
  });

  return {
    category: "Your Category",
    status: computeStatus(checks),
    score: computeScore(checks),
    checks,
  };
}
```

2. Register in `run-scans.mjs`:
   - Add to `SCAN_MODULES` object
   - Add to `FULL_SCANS` array
   - Optionally add to `LIGHTWEIGHT_SCANS` if it's fast and has no external API dependencies

3. Add npm script in `package.json`:
   ```json
   "scan:<alias>": "node run-scans.mjs --scan <name>"
   ```

## Scan Tiers

| Tier | Scanners | Schedule | Notes |
|---|---|---|---|
| Lightweight | security, dependencies | Mon-Sat 7am PDT | Fast, no external APIs |
| Full | all 6 | Sunday 7am PDT | Includes PageSpeed API, page fetches |

## GitHub Actions

Workflow: `.github/workflows/website-monitor.yml`

- Cron: `0 14 * * 1-6` (lightweight), `0 14 * * 0` (full) -- times are UTC, 7am PDT
- Manual trigger via `workflow_dispatch` with scan type selector
- Secret required: `DISCORD_WEBHOOK_URL`
- Runs on `ubuntu-latest`, Node 20, timeout 10 minutes

## Scanner Details

### security.mjs
Checks HTTP response headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, CSP, Permissions-Policy), X-Powered-By exposure, HTTP-to-HTTPS redirect, SSL certificate expiry, and exposed sensitive paths (`.env`, `.git/config`, source maps).

**Known false positives:** GitHub Pages does not allow custom HTTP response headers. Missing headers like HSTS and X-Frame-Options will always fail. CSP can only be set via `<meta>` tag.

### dependencies.mjs
Runs `npm audit --json` and `npm outdated --json` against the project root. Only scanner that reads local filesystem instead of fetching the live site.

### seo.mjs
Checks title tag, meta description, viewport, Open Graph tags, canonical URL, JSON-LD structured data, H1 tag, robots.txt, sitemap.xml, and samples up to 20 internal links for broken links.

### performance.mjs
Calls Google PageSpeed Insights API (no key required for basic usage) for both mobile and desktop. Reports LCP, FCP, CLS, TBT, TTFB, render-blocking resources, and third-party script count.

### images.mjs
Checks image format usage (WebP/AVIF), alt text presence, lazy loading adoption, and copyright year freshness.

### accessibility.mjs
Checks heading hierarchy, button labels (ARIA), link accessible text, image alt text coverage, HTML lang attribute, and skip navigation link.
