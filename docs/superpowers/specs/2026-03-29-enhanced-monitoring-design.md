# Enhanced Website Monitoring System — Design Spec

**Goal:** Expand the existing 6-scanner monitoring system to 11 scanners, add an uptime monitor, an autonomous auto-fix system powered by Claude Code, and a cross-cutting Honesty Layer that forces every check to declare its confidence level.

**Architecture:** Enhance the existing `monitoring/` directory. Same scan module pattern (`run()` → `{ category, status, score, checks }`), same Discord webhook, same GitHub Actions infrastructure. New scanners follow the established interface. New workflows for uptime monitoring and auto-fix run alongside the existing scan workflow.

**Tech Stack:** Node.js (ESM), cheerio, GitHub Actions, Discord webhooks, Anthropic API (Claude Code CLI), Google PageSpeed Insights API.

**Inspiration:** Dylan Davis's "One Prompt Change That Forces Claude to Be Honest" — the Honesty Layer applies his three rules: leave it blank when uncertain, penalize guessing (UNABLE_TO_VERIFY checks don't count toward scores), and show the source (VERIFIED/INFERRED/UNABLE_TO_VERIFY with reasons).

---

## 1. Honesty Layer — Core Refactor

### Current Check Format
```js
{ name: "HSTS", status: "pass", detail: "max-age=31536000" }
```

### New Check Format
```js
{ name: "HSTS", status: "pass", detail: "max-age=31536000", confidence: "VERIFIED", reason: null }
```

### Confidence Levels

- **VERIFIED** — scanner directly observed the fact via HTTP response, file fetch, or API call. `reason` is null.
- **INFERRED** — scanner derived the result indirectly. `reason` explains how (e.g., "CSP detected via HTML meta tag, not HTTP header").
- **UNABLE_TO_VERIFY** — scanner cannot reliably check this. `reason` explains the limitation (e.g., "SPA renders content client-side; cheerio cannot execute JavaScript").

### Scoring Changes

- VERIFIED and INFERRED checks count toward the score as today (pass/warn/fail).
- UNABLE_TO_VERIFY checks are excluded from score calculation — they don't inflate or deflate the number.
- A new `verifiedScore` field is computed alongside the existing `score`: percentage based only on VERIFIED + INFERRED checks.
- Discord shows both: "Score: 80/100 (5 of 8 checks verified)".

### Discord Display

- VERIFIED pass: ✅ green checkmark (existing behavior)
- VERIFIED/INFERRED fail: ❌ red X (existing behavior)
- VERIFIED/INFERRED warn: ⚠️ yellow warning (existing behavior)
- INFERRED (any status): adds italic reason line below the check detail
- UNABLE_TO_VERIFY: ⬜ gray square, shows reason, does not count toward score

### Existing Scanner Confidence Mapping

| Scanner | Check | Confidence | Reason |
|---------|-------|-----------|--------|
| security.mjs | All header checks | VERIFIED | Direct HTTP header observation |
| security.mjs | SSL certificate | VERIFIED | Direct TLS handshake |
| security.mjs | Exposed files | VERIFIED | Direct HTTP fetch |
| seo.mjs | Title, meta desc, viewport, OG, canonical | VERIFIED | Present in raw HTML `<head>` |
| seo.mjs | H1 tag | UNABLE_TO_VERIFY | SPA renders content client-side; cheerio cannot execute JavaScript |
| seo.mjs | robots.txt, sitemap | VERIFIED | Direct file fetch |
| seo.mjs | Internal links (from raw HTML) | VERIFIED | Direct HTTP fetch per link |
| accessibility.mjs | All checks (headings, buttons, links, skip nav) | UNABLE_TO_VERIFY | SPA renders content client-side; cheerio parses raw HTML without JavaScript execution |
| accessibility.mjs | HTML lang attribute | VERIFIED | Present in raw HTML |
| dependencies.mjs | npm audit | VERIFIED | Direct npm registry query |
| dependencies.mjs | Outdated packages | VERIFIED | Direct npm registry query |
| performance.mjs | All PageSpeed checks | VERIFIED | Google renders page with real browser |
| images.mjs | Image format, alt text, lazy loading | INFERRED | Only checks images in initial HTML, not dynamically loaded images |
| images.mjs | Copyright year | VERIFIED | Text present in raw HTML |

### Shared Utility Changes

**`lib/scanner.mjs`:**
- `computeScore(checks)` — updated to exclude UNABLE_TO_VERIFY checks from the denominator.
- `computeVerifiedCount(checks)` — new function, returns count of VERIFIED + INFERRED checks.
- `computeStatus(checks)` — updated to only consider VERIFIED + INFERRED checks.

**`lib/discord.mjs`:**
- `buildEmbed()` — updated to render confidence indicators (gray square for UNABLE_TO_VERIFY, italic reasons for INFERRED).
- Embed description updated to show: "Score: X/100 (N of M checks verified)".

---

## 2. New Scanner: Schema Validation (`scans/schema.mjs`)

Validates JSON-LD structured data content, not just presence.

### Checks

1. **Schema Type Correctness** — validates `@type` is appropriate for the page. For DeMar Transportation homepage, `TransportCompany` is correct. Maintains a map of expected types per URL path.
2. **Required Properties** — each schema type has required fields per schema.org spec. For `TransportCompany`: name, url, telephone. Flags missing required properties.
3. **Property Value Validation** — telephone matches E.164-like format, URLs return 200, email contains `@`.
4. **Nested Schema Integrity** — validates nested objects (ContactPoint, PostalAddress, OpeningHoursSpecification) have their own required fields.
5. **Multiple Schema Conflict** — warns if contradictory schemas exist on the same page.

### Confidence

All checks are VERIFIED — JSON-LD is in raw HTML `<script type="application/ld+json">`, fully parseable without JavaScript execution.

### Scan Tier

Full scans only.

---

## 3. New Scanner: Social Preview Verification (`scans/social-preview.mjs`)

Validates that sharing the site on social media renders correctly.

### Checks

1. **OG Image Reachable** — fetches `og:image` URL, verifies HTTP 200 with image content-type.
2. **OG Image Dimensions** — checks image meets minimum 1200x630 (Facebook recommended). Parses image headers or uses lightweight dimension detection.
3. **Twitter Image Reachable** — fetches `twitter:image` URL, verifies HTTP 200 with image content-type.
4. **Placeholder Detection** — scans OG/Twitter title, description, and image URLs for platform placeholders: "Lovable", "Vercel", "Next.js", "my-app", "example.com", "localhost", "placeholder", "untitled".
5. **URL Consistency** — verifies `og:url` matches canonical URL matches actual page URL.

### Confidence

All checks are VERIFIED — OG tags are in raw HTML, image URLs are directly fetched and observed.

### Scan Tier

Full scans only.

---

## 4. New Scanner: Broken Link Checker (`scans/links.mjs`)

Full site crawl with internal and external link validation.

### Crawl Behavior

- Starts at homepage, discovers all internal links via `<a href>` tags.
- Follows internal links up to 3 levels deep.
- External links get HEAD requests only (faster, less intrusive to third-party servers).
- 5-second timeout per request.
- Max 100 URLs total (safety cap to prevent runaway crawls).
- Deduplicates URLs before checking.

### Checks

1. **Internal Links** — all internal links return HTTP 200. Reports broken links with source page URL. Follows redirects but flags redirect chains (3+ hops).
2. **External Links** — all outbound links return HTTP 2xx or 3xx. Reports dead external links with source page URL.
3. **Anchor Links** — checks `href="#section"` style links. Since SPA content isn't in raw HTML, these are INFERRED.
4. **Redirect Chains** — flags any link (internal or external) that redirects more than twice.
5. **Mixed Content** — flags any `http://` links found on the `https://` site.

### Confidence

- Internal/external link HTTP status: VERIFIED (direct HTTP observation).
- Anchor link targets: INFERRED with reason "anchor target assumed present based on common SPA patterns; cheerio cannot verify in-page anchors rendered by JavaScript".
- Mixed content detection in raw HTML: VERIFIED.

### Scan Tier

Full scans only.

---

## 5. New Scanner: Content Freshness (`scans/freshness.mjs`)

Detects stale, placeholder, or template content across all pages.

### Checks

1. **Copyright Year** — checks copyright text across all crawled pages. Verifies year matches current year.
2. **Placeholder Text Detection** — scans raw HTML for template strings: "Lorem ipsum", "Lovable", "example.com", "your-company", "TODO", "FIXME", "coming soon", "under construction", "[placeholder]", "Insert text here".
3. **Contact Info Consistency** — verifies phone number (775) 230-4767 and email info@DeMarTransportation.com appear consistently. Flags if different numbers/emails appear on different pages or if contact info is missing from a page that should have it.
4. **Stale Meta Content** — checks if `<title>` or `<meta name="description">` contain platform/template names.
5. **404 Page Exists** — fetches a known-bad URL (`/this-page-does-not-exist-12345`) and checks for a custom 404 page vs. generic server error or blank page.

### Confidence

- Checks on raw HTML `<head>` content (meta tags, title): VERIFIED.
- Checks on body content: INFERRED with reason "only checks content in initial HTML, not dynamically rendered content".
- 404 page check: VERIFIED (direct HTTP observation).

### Scan Tier

Full scans only. Content freshness copyright year also runs in lightweight scans.

---

## 6. New Scanner: DNS & Domain Health (`scans/dns.mjs`)

Monitors infrastructure underneath the website.

### Checks

1. **SSL Certificate Expiry** — moved from `security.mjs` to consolidate domain health. Warns at 30 days, fails at 7 days. Uses the existing `checkSSL()` function.
2. **Domain Expiry** — queries WHOIS data for `demartransportation.com` expiration date. Warns at 60 days, fails at 30 days. Uses `whois` npm package. If WHOIS parsing fails, returns UNABLE_TO_VERIFY with reason "WHOIS response format not recognized for this registrar" instead of guessing.
3. **DNS Resolution** — verifies the domain resolves to expected GitHub Pages IPs (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`). Uses Node.js `dns.promises.resolve4()`.
4. **CNAME/Apex Configuration** — verifies DNS is properly configured for GitHub Pages custom domain.
5. **www Redirect** — checks that `www.demartransportation.com` either redirects to non-www or resolves correctly. Flags dead www subdomain.

### Confidence

- SSL certificate: VERIFIED (direct TLS handshake).
- Domain expiry: INFERRED with reason "WHOIS data parsed from raw text, format varies by registrar". Falls back to UNABLE_TO_VERIFY if parsing fails entirely.
- DNS resolution: VERIFIED (direct DNS query).
- CNAME/Apex: VERIFIED (direct DNS query).
- www redirect: VERIFIED (direct HTTP observation).

### Dependencies

- `whois` npm package added to `monitoring/package.json`.
- `dns` module from Node.js standard library (no install needed).
- `whois` CLI available on GitHub Actions Ubuntu runners by default.

### Scan Tier

Full scans only. SSL check also runs in lightweight scans.

---

## 7. Uptime Monitor — Separate Workflow

### New Workflow: `.github/workflows/website-uptime.yml`

Runs every 15 minutes, independent of the scan workflow.

### Cron Schedule

```yaml
schedule:
  - cron: '*/15 * * * *'   # Every 15 minutes (uptime checks)
  - cron: '0 14 * * *'     # Daily at 7am PDT (daily summary)
```

### Per-Run Checks

1. **Site Available** — HEAD request to `https://demartransportation.com`, expects HTTP 200. Timeout: 10 seconds.
2. **Response Time** — measures time-to-first-byte in milliseconds. Warn if >2000ms, fail if >5000ms or timeout.

### State Tracking

Uses GitHub Actions cache to persist state between runs:
```json
{
  "currentStatus": "up",
  "since": "2026-03-29T14:00:00Z",
  "lastResponseTime": 245,
  "log": [
    { "timestamp": "2026-03-29T14:00:00Z", "status": "up", "responseTime": 245 },
    { "timestamp": "2026-03-29T14:15:00Z", "status": "up", "responseTime": 312 }
  ]
}
```

### Discord Notifications

**State change — site down:**
> **🔴 Site DOWN** — demartransportation.com returned HTTP 503 at 2:15 PM PDT

**State change — site recovered:**
> **🟢 Site RECOVERED** — demartransportation.com back online at 2:45 PM PDT (downtime: 30 min)

**Daily summary (7am PDT):**
> **📊 Daily Uptime: 99.7%** — 1 incident (30 min downtime), avg response: 245ms, peak: 890ms

### GitHub Actions Minutes

~720 runs/month × ~10 seconds each = ~120 minutes/month. Well within the 2,000 free minutes/month.

### No Honesty Layer

Uptime checks are always VERIFIED — they directly observe HTTP status and response time. No confidence field needed since there's no ambiguity.

---

## 8. Auto-Fix System

### How It Works

After scans detect issues, the workflow checks if any are auto-fixable. If yes, it installs Claude Code CLI, gives it scoped instructions for the specific issue, and either commits directly or creates a PR.

### Integration Point

New step in `website-monitor.yml`, runs after the scan and Discord notification steps:
```yaml
- name: Auto-fix detected issues
  if: steps.scan.outputs.has_fixable_issues == 'true'
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
    DISCORD_WEBHOOK_URL: ${{ secrets.DISCORD_WEBHOOK_URL }}
  run: cd monitoring && node auto-fix.mjs --results '${{ steps.scan.outputs.results_json }}'
```

### Auto-Fix Tiers

**Tier 1: Auto-commit to main (safe, reversible fixes)**
- `npm audit fix` (non-breaking only, never `--force`)
- Copyright year updates (e.g., hardcoded 2025 → dynamic `new Date().getFullYear()`)
- Meta description length trimming (if over 160 chars)
- Placeholder text removal (only when replacement is obvious and unambiguous)

**Tier 2: Auto-PR (needs human review)**
- Dependency major version upgrades
- JSON-LD schema type or property corrections
- OG/Twitter tag content updates
- Broken internal link fixes
- New SEO improvements (adding missing canonical, etc.)

**Never auto-fix:**
- CSP or security header changes
- Business content (phone numbers, service descriptions, pricing)
- Structural changes (component refactors, routing, new pages)
- Anything where the correct fix is ambiguous

### Safety Rails

1. **Build verification** — `npm run build` must pass after any fix. If build fails, the fix is abandoned entirely.
2. **Tagged commits** — auto-fix commits use prefix `[auto-fix]` in the commit message.
3. **Discord notification** — every fix (committed or PR'd) gets a detailed before/after Discord embed with reasoning.
4. **Max one auto-fix run per day** — prevents loops where a fix triggers a new scan that triggers another fix. Uses a timestamp file in GitHub Actions cache.
5. **Scoped prompts** — Claude Code receives only the specific issue to fix, not a broad "fix everything" instruction.
6. **No force operations** — never runs `npm audit fix --force`, `git push --force`, or any destructive command.

### Claude Code Invocation

The `auto-fix.mjs` orchestrator:
1. Receives scan results JSON.
2. Filters for auto-fixable issues (checks against the tier 1/tier 2 lists).
3. For each fixable issue, constructs a scoped prompt:
   ```
   Fix the following issue in this repository:
   Issue: npm audit found 3 moderate vulnerabilities
   Action: Run `npm audit fix` (do NOT use --force)
   Then verify: Run `npm run build` and confirm it succeeds
   A wrong answer is 3x worse than a blank answer. If you are not confident
   the fix is correct, do not apply it.
   ```
4. Invokes Claude Code CLI with the prompt.
5. Checks if changes were made. If yes:
   - Tier 1: commits and pushes to main.
   - Tier 2: creates branch `auto-fix/<issue-slug>`, commits, pushes, opens PR via `gh pr create`.
6. Posts Discord notification with before/after and reasoning.

### Required GitHub Secrets

- `ANTHROPIC_API_KEY` — for Claude Code CLI (new, user will add)
- `DISCORD_WEBHOOK_URL` — already configured
- `GITHUB_TOKEN` — automatically available in GitHub Actions, used for PR creation

---

## 9. Updated Scan Grouping

### Lightweight Scans (Daily, Mon-Sat 7am PDT)

1. Security (headers, SSL, exposed files)
2. Dependencies (npm audit, outdated)
3. Content Freshness (copyright year check only)
4. DNS & Domain Health (SSL expiry only)

### Full Scans (Weekly, Sunday 7am PDT)

All 11 scanners:
1. Security
2. Dependencies
3. SEO
4. Performance
5. Images
6. Accessibility
7. Schema Validation
8. Social Preview
9. Broken Links
10. Content Freshness (full)
11. DNS & Domain Health (full)

### Uptime (Every 15 Minutes, Separate Workflow)

Site availability + response time. Discord alerts on state changes only. Daily summary at 7am PDT.

### Auto-Fix (After Any Scan with Fixable Issues)

Triggered automatically when scan results contain auto-fixable issues. Max once per day.

---

## 10. File Structure

```
monitoring/
├── run-scans.mjs                 # MODIFY: pass confidence to Discord, add new scan imports
├── auto-fix.mjs                  # NEW: auto-fix orchestrator
├── package.json                  # MODIFY: add whois dependency
├── lib/
│   ├── scanner.mjs               # MODIFY: update computeScore/computeStatus for Honesty Layer
│   ├── discord.mjs               # MODIFY: render confidence indicators in embeds
│   └── uptime.mjs                # NEW: uptime state management and daily summary logic
├── scans/
│   ├── security.mjs              # MODIFY: add confidence fields, move SSL to dns.mjs
│   ├── dependencies.mjs          # MODIFY: add confidence fields
│   ├── seo.mjs                   # MODIFY: add confidence fields
│   ├── performance.mjs           # MODIFY: add confidence fields
│   ├── images.mjs                # MODIFY: add confidence fields
│   ├── accessibility.mjs         # MODIFY: add confidence fields
│   ├── schema.mjs                # NEW: JSON-LD validation
│   ├── social-preview.mjs        # NEW: OG/Twitter verification
│   ├── links.mjs                 # NEW: broken link checker with full crawl
│   ├── freshness.mjs             # NEW: content staleness detection
│   └── dns.mjs                   # NEW: domain health, WHOIS, DNS records
.github/workflows/
├── website-monitor.yml           # MODIFY: add auto-fix step, update scan list
└── website-uptime.yml            # NEW: 15-min uptime checks + daily summary
```

---

## 11. Discord Channel Usage

All notifications go to the single existing Discord channel:

- **Scan results** — daily lightweight and weekly full (existing, enhanced with confidence indicators)
- **Uptime alerts** — state-change notifications (down/recovered)
- **Daily uptime summary** — once per day
- **Auto-fix notifications** — before/after with reasoning for every fix applied
- **Auto-PR notifications** — link to PR for human review

Message types are visually distinct via embed colors and title prefixes:
- Scan results: category-colored (green/yellow/red)
- Uptime down: red embed
- Uptime recovered: green embed
- Daily summary: blue embed
- Auto-fix applied: green embed with 🤖 prefix
- Auto-PR created: yellow embed with 🤖 prefix

---

## 12. GitHub Secrets Required

| Secret | Purpose | Status |
|--------|---------|--------|
| `DISCORD_WEBHOOK_URL` | Discord notifications | Already configured |
| `ANTHROPIC_API_KEY` | Claude Code CLI for auto-fixes | User will add |
| `GITHUB_TOKEN` | PR creation in auto-fix | Auto-available in Actions |
