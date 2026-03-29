# Discord Website Monitoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a monitoring system that scans demartransportation.com for security, SEO, performance, dependency, and accessibility issues, and posts results to Discord via webhook.

**Architecture:** Modular Node.js scan scripts in a `monitoring/` directory, orchestrated by `run-scans.mjs`. Each scanner exports a `run()` function returning a standardized result object. Results are formatted as color-coded Discord embeds and posted via webhook. GitHub Actions handles scheduled runs (daily lightweight Mon-Sat, weekly full Sunday). Ad-hoc runs via CLI or `gh workflow run`.

**Tech Stack:** Node.js 20 (native fetch), cheerio (HTML parsing), dotenv (local env), GitHub Actions (scheduling)

---

## File Structure

```
monitoring/
├── lib/
│   ├── discord.mjs         # buildEmbed(), postResults() — formats and posts to Discord
│   └── scanner.mjs         # fetchPage(), fetchHeaders() — shared HTTP utilities
├── scans/
│   ├── security.mjs        # Security headers, SSL, exposed files
│   ├── dependencies.mjs    # npm audit, outdated packages
│   ├── seo.mjs             # Meta tags, OG, schema, sitemap, robots.txt, broken links
│   ├── performance.mjs     # PageSpeed Insights API (Core Web Vitals)
│   ├── images.mjs          # Image format, alt text, lazy loading
│   └── accessibility.mjs   # Headings, ARIA, alt text coverage
├── run-scans.mjs           # CLI orchestrator: --type lightweight|full, --scan <name>
├── package.json            # Monitoring-specific deps (cheerio, dotenv)
└── .env.example            # Template for DISCORD_WEBHOOK_URL
.github/workflows/
└── website-monitor.yml     # Scheduled + manual trigger workflow
```

---

### Task 1: Monitoring scaffold and Discord lib

**Files:**
- Create: `monitoring/package.json`
- Create: `monitoring/lib/discord.mjs`
- Create: `monitoring/.env.example`
- Create: `monitoring/.env` (gitignored, local only)

- [ ] **Step 1: Create monitoring/package.json**

```json
{
  "name": "demar-transportation-monitor",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "scan": "node run-scans.mjs --type full",
    "scan:light": "node run-scans.mjs --type lightweight",
    "scan:security": "node run-scans.mjs --scan security",
    "scan:seo": "node run-scans.mjs --scan seo",
    "scan:perf": "node run-scans.mjs --scan performance",
    "scan:deps": "node run-scans.mjs --scan dependencies",
    "scan:images": "node run-scans.mjs --scan images",
    "scan:a11y": "node run-scans.mjs --scan accessibility"
  },
  "dependencies": {
    "cheerio": "^1.0.0",
    "dotenv": "^16.4.7"
  }
}
```

- [ ] **Step 2: Create monitoring/.env.example**

```
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
```

- [ ] **Step 3: Create monitoring/.env with the real webhook URL**

```
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/1487670142706909374/ERbpH5Rf5KoJoP3-KzYIr5deg7L-EIZ0nfCaIaErMsTlrfLARIX6lYLHZBlrRDhyeAGh
```

- [ ] **Step 4: Create monitoring/lib/discord.mjs**

```js
const COLORS = {
  pass: 3066993,   // green
  warn: 16776960,  // yellow
  fail: 15158332,  // red
};

const STATUS_EMOJI = {
  pass: "✅",
  warn: "⚠️",
  fail: "❌",
};

export function buildEmbed(scanResult) {
  const { category, status, score, checks } = scanResult;

  const failingChecks = checks.filter((c) => c.status !== "pass");
  const passingCount = checks.filter((c) => c.status === "pass").length;

  let description = `**Score: ${score}/100**\n`;
  description += `${passingCount}/${checks.length} checks passed\n\n`;

  if (failingChecks.length > 0) {
    for (const check of failingChecks) {
      const emoji = STATUS_EMOJI[check.status];
      description += `${emoji} **${check.name}**\n${check.detail}\n\n`;
    }
  } else {
    description += "All checks passed.";
  }

  return {
    title: `${STATUS_EMOJI[status]} ${category}`,
    description: description.trim(),
    color: COLORS[status],
    timestamp: new Date().toISOString(),
  };
}

function buildSummaryLine(results) {
  const counts = { pass: 0, warn: 0, fail: 0 };
  for (const r of results) {
    counts[r.status]++;
  }
  const parts = [];
  if (counts.pass > 0) parts.push(`✅ ${counts.pass} passed`);
  if (counts.warn > 0) parts.push(`⚠️ ${counts.warn} warnings`);
  if (counts.fail > 0) parts.push(`❌ ${counts.fail} critical`);
  return parts.join(" · ");
}

export async function postResults(results, webhookUrl) {
  const summary = buildSummaryLine(results);
  const embeds = results.map(buildEmbed);

  const payload = {
    content: `**Website Scan — ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}**\n${summary}`,
    embeds: embeds.slice(0, 10), // Discord max 10 embeds per message
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Discord webhook failed (${res.status}): ${text}`);
  }

  console.log("Posted scan results to Discord.");
}
```

- [ ] **Step 5: Verify .env is gitignored**

The root `.gitignore` already contains `.env` and `.env.*` patterns. Since `monitoring/.env` matches `.env` by name in a subdirectory, it is covered. No changes needed.

- [ ] **Step 6: Install dependencies**

Run: `cd monitoring && npm install`

- [ ] **Step 7: Test Discord posting with a mock result**

Create a temporary test file `monitoring/test-discord.mjs`:

```js
import "dotenv/config";
import { postResults } from "./lib/discord.mjs";

const mockResults = [
  {
    category: "Test Scan",
    status: "pass",
    score: 100,
    checks: [
      { name: "Connectivity", status: "pass", detail: "Webhook is working" },
    ],
  },
];

await postResults(mockResults, process.env.DISCORD_WEBHOOK_URL);
```

Run: `node test-discord.mjs`
Expected: Message appears in Discord channel with green embed. Then delete `test-discord.mjs`.

- [ ] **Step 8: Commit**

```bash
git add monitoring/package.json monitoring/package-lock.json monitoring/lib/discord.mjs monitoring/.env.example
git commit -m "feat: add monitoring scaffold and Discord webhook lib"
```

---

### Task 2: Shared scanner utilities

**Files:**
- Create: `monitoring/lib/scanner.mjs`

- [ ] **Step 1: Create monitoring/lib/scanner.mjs**

```js
import * as cheerio from "cheerio";

const TARGET_URL = "https://demartransportation.com";

export { TARGET_URL };

export async function fetchHeaders(url = TARGET_URL) {
  const res = await fetch(url, { redirect: "follow" });
  return {
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    redirected: res.redirected,
    url: res.url,
  };
}

export async function fetchPage(url = TARGET_URL) {
  const res = await fetch(url, { redirect: "follow" });
  const html = await res.text();
  const $ = cheerio.load(html);
  return { $, html, status: res.status, url: res.url };
}

export async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  return res.json();
}

export function computeStatus(checks) {
  if (checks.some((c) => c.status === "fail")) return "fail";
  if (checks.some((c) => c.status === "warn")) return "warn";
  return "pass";
}

export function computeScore(checks) {
  if (checks.length === 0) return 100;
  const passCount = checks.filter((c) => c.status === "pass").length;
  return Math.round((passCount / checks.length) * 100);
}
```

- [ ] **Step 2: Commit**

```bash
git add monitoring/lib/scanner.mjs
git commit -m "feat: add shared scanner utilities (fetch, parse, scoring)"
```

---

### Task 3: Security scanner

**Files:**
- Create: `monitoring/scans/security.mjs`

- [ ] **Step 1: Create monitoring/scans/security.mjs**

```js
import { fetchHeaders, TARGET_URL, computeStatus, computeScore } from "../lib/scanner.mjs";
import https from "node:https";

const REQUIRED_HEADERS = [
  { name: "strict-transport-security", label: "HSTS" },
  { name: "x-frame-options", label: "X-Frame-Options" },
  { name: "x-content-type-options", label: "X-Content-Type-Options" },
  { name: "referrer-policy", label: "Referrer-Policy" },
  { name: "content-security-policy", label: "Content-Security-Policy" },
  { name: "permissions-policy", label: "Permissions-Policy" },
];

const WARN_HEADERS = [
  { name: "x-powered-by", label: "X-Powered-By Exposure", shouldBeAbsent: true },
];

const SENSITIVE_PATHS = [
  "/.env",
  "/.env.local",
  "/.git/config",
  "/source.map",
  "/main.js.map",
];

function checkSSL(hostname) {
  return new Promise((resolve) => {
    const req = https.request({ hostname, port: 443, method: "HEAD" }, (res) => {
      const cert = res.socket.getPeerCertificate();
      if (!cert || !cert.valid_to) {
        resolve({ name: "SSL Certificate", status: "fail", detail: "Could not read certificate" });
        return;
      }
      const expiryDate = new Date(cert.valid_to);
      const daysLeft = Math.floor((expiryDate - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysLeft < 7) {
        resolve({ name: "SSL Certificate", status: "fail", detail: `Expires in ${daysLeft} days (${cert.valid_to})` });
      } else if (daysLeft < 30) {
        resolve({ name: "SSL Certificate", status: "warn", detail: `Expires in ${daysLeft} days (${cert.valid_to})` });
      } else {
        resolve({ name: "SSL Certificate", status: "pass", detail: `Valid for ${daysLeft} days (expires ${cert.valid_to})` });
      }
      req.end();
    });
    req.on("error", () => {
      resolve({ name: "SSL Certificate", status: "fail", detail: "SSL connection failed" });
    });
    req.end();
  });
}

export async function run() {
  const checks = [];

  // Security headers
  const { headers } = await fetchHeaders();

  for (const { name, label } of REQUIRED_HEADERS) {
    const value = headers[name];
    if (value) {
      checks.push({ name: label, status: "pass", detail: value });
    } else {
      checks.push({ name: label, status: "fail", detail: `Missing ${label} header` });
    }
  }

  for (const { name, label, shouldBeAbsent } of WARN_HEADERS) {
    const value = headers[name];
    if (shouldBeAbsent && value) {
      checks.push({ name: label, status: "warn", detail: `Exposed: ${value}` });
    } else if (shouldBeAbsent && !value) {
      checks.push({ name: label, status: "pass", detail: "Not exposed" });
    }
  }

  // HTTPS redirect
  try {
    const httpRes = await fetch(`http://demartransportation.com`, { redirect: "manual" });
    const location = httpRes.headers.get("location") || "";
    if (location.startsWith("https://")) {
      checks.push({ name: "HTTP→HTTPS Redirect", status: "pass", detail: `Redirects to ${location}` });
    } else {
      checks.push({ name: "HTTP→HTTPS Redirect", status: "fail", detail: "No HTTPS redirect found" });
    }
  } catch {
    checks.push({ name: "HTTP→HTTPS Redirect", status: "warn", detail: "Could not test HTTP redirect" });
  }

  // SSL certificate
  const hostname = new URL(TARGET_URL).hostname;
  const sslCheck = await checkSSL(hostname);
  checks.push(sslCheck);

  // Exposed sensitive files
  for (const path of SENSITIVE_PATHS) {
    try {
      const res = await fetch(`${TARGET_URL}${path}`, { redirect: "follow" });
      if (res.status === 200) {
        checks.push({ name: `Exposed: ${path}`, status: "fail", detail: `${path} is publicly accessible (HTTP 200)` });
      } else {
        checks.push({ name: `Exposed: ${path}`, status: "pass", detail: `${path} returns ${res.status}` });
      }
    } catch {
      checks.push({ name: `Exposed: ${path}`, status: "pass", detail: `${path} not reachable` });
    }
  }

  return {
    category: "Security",
    status: computeStatus(checks),
    score: computeScore(checks),
    checks,
  };
}
```

- [ ] **Step 2: Test the scanner locally**

Create `monitoring/test-security.mjs`:

```js
import { run } from "./scans/security.mjs";
const result = await run();
console.log(JSON.stringify(result, null, 2));
```

Run: `cd monitoring && node test-security.mjs`
Expected: JSON output with security check results. Then delete the test file.

- [ ] **Step 3: Commit**

```bash
git add monitoring/scans/security.mjs
git commit -m "feat: add security scanner (headers, SSL, exposed files)"
```

---

### Task 4: Dependency scanner

**Files:**
- Create: `monitoring/scans/dependencies.mjs`

- [ ] **Step 1: Create monitoring/scans/dependencies.mjs**

```js
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { computeStatus, computeScore } from "../lib/scanner.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../../");

export async function run() {
  const checks = [];

  // npm audit
  try {
    const auditOutput = execSync("npm audit --json 2>/dev/null", {
      cwd: PROJECT_ROOT,
      encoding: "utf-8",
      timeout: 30000,
    });
    const audit = JSON.parse(auditOutput);
    const vulns = audit.metadata?.vulnerabilities || {};
    const critical = vulns.critical || 0;
    const high = vulns.high || 0;
    const moderate = vulns.moderate || 0;
    const low = vulns.low || 0;
    const total = critical + high + moderate + low;

    if (critical > 0 || high > 0) {
      checks.push({
        name: "npm audit",
        status: "fail",
        detail: `${total} vulnerabilities: ${critical} critical, ${high} high, ${moderate} moderate, ${low} low`,
      });
    } else if (moderate > 0) {
      checks.push({
        name: "npm audit",
        status: "warn",
        detail: `${total} vulnerabilities: ${moderate} moderate, ${low} low`,
      });
    } else if (low > 0) {
      checks.push({
        name: "npm audit",
        status: "warn",
        detail: `${low} low-severity vulnerabilities`,
      });
    } else {
      checks.push({
        name: "npm audit",
        status: "pass",
        detail: "No known vulnerabilities",
      });
    }
  } catch (err) {
    // npm audit exits non-zero when vulnerabilities are found
    try {
      const audit = JSON.parse(err.stdout || "{}");
      const vulns = audit.metadata?.vulnerabilities || {};
      const critical = vulns.critical || 0;
      const high = vulns.high || 0;
      const moderate = vulns.moderate || 0;
      const low = vulns.low || 0;
      const total = critical + high + moderate + low;

      if (total > 0) {
        checks.push({
          name: "npm audit",
          status: critical > 0 || high > 0 ? "fail" : "warn",
          detail: `${total} vulnerabilities: ${critical} critical, ${high} high, ${moderate} moderate, ${low} low`,
        });
      } else {
        checks.push({ name: "npm audit", status: "pass", detail: "No known vulnerabilities" });
      }
    } catch {
      checks.push({ name: "npm audit", status: "warn", detail: "Could not parse npm audit output" });
    }
  }

  // Outdated packages
  try {
    const outdatedOutput = execSync("npm outdated --json 2>/dev/null", {
      cwd: PROJECT_ROOT,
      encoding: "utf-8",
      timeout: 30000,
    });
    const outdated = JSON.parse(outdatedOutput || "{}");
    const outdatedCount = Object.keys(outdated).length;

    if (outdatedCount === 0) {
      checks.push({ name: "Outdated Packages", status: "pass", detail: "All packages up to date" });
    } else {
      const majorUpdates = Object.entries(outdated).filter(
        ([, info]) => info.current?.split(".")[0] !== info.latest?.split(".")[0]
      );
      if (majorUpdates.length > 0) {
        const names = majorUpdates.slice(0, 5).map(([n]) => n).join(", ");
        checks.push({
          name: "Outdated Packages",
          status: "warn",
          detail: `${outdatedCount} outdated (${majorUpdates.length} major): ${names}${majorUpdates.length > 5 ? "..." : ""}`,
        });
      } else {
        checks.push({
          name: "Outdated Packages",
          status: "pass",
          detail: `${outdatedCount} minor/patch updates available`,
        });
      }
    }
  } catch (err) {
    // npm outdated exits non-zero when there are outdated packages
    try {
      const outdated = JSON.parse(err.stdout || "{}");
      const outdatedCount = Object.keys(outdated).length;
      if (outdatedCount > 0) {
        const majorUpdates = Object.entries(outdated).filter(
          ([, info]) => info.current?.split(".")[0] !== info.latest?.split(".")[0]
        );
        const names = Object.keys(outdated).slice(0, 5).join(", ");
        checks.push({
          name: "Outdated Packages",
          status: majorUpdates.length > 0 ? "warn" : "pass",
          detail: `${outdatedCount} outdated packages: ${names}${outdatedCount > 5 ? "..." : ""}`,
        });
      } else {
        checks.push({ name: "Outdated Packages", status: "pass", detail: "All packages up to date" });
      }
    } catch {
      checks.push({ name: "Outdated Packages", status: "warn", detail: "Could not check outdated packages" });
    }
  }

  return {
    category: "Dependencies",
    status: computeStatus(checks),
    score: computeScore(checks),
    checks,
  };
}
```

- [ ] **Step 2: Test locally**

Run: `cd monitoring && node -e "import('./scans/dependencies.mjs').then(m => m.run()).then(r => console.log(JSON.stringify(r, null, 2)))"`
Expected: JSON with npm audit and outdated package results.

- [ ] **Step 3: Commit**

```bash
git add monitoring/scans/dependencies.mjs
git commit -m "feat: add dependency scanner (npm audit, outdated packages)"
```

---

### Task 5: SEO scanner

**Files:**
- Create: `monitoring/scans/seo.mjs`

- [ ] **Step 1: Create monitoring/scans/seo.mjs**

```js
import { fetchPage, fetchHeaders, TARGET_URL, computeStatus, computeScore } from "../lib/scanner.mjs";

export async function run() {
  const checks = [];
  const { $, html } = await fetchPage();

  // Title tag
  const title = $("title").text().trim();
  if (title && title.length >= 10 && title.length <= 70) {
    checks.push({ name: "Title Tag", status: "pass", detail: `"${title}" (${title.length} chars)` });
  } else if (title) {
    checks.push({ name: "Title Tag", status: "warn", detail: `"${title}" (${title.length} chars — ideal: 10-70)` });
  } else {
    checks.push({ name: "Title Tag", status: "fail", detail: "Missing title tag" });
  }

  // Meta description
  const metaDesc = $('meta[name="description"]').attr("content") || "";
  if (metaDesc && metaDesc.length >= 50 && metaDesc.length <= 160) {
    checks.push({ name: "Meta Description", status: "pass", detail: `${metaDesc.length} chars` });
  } else if (metaDesc) {
    checks.push({ name: "Meta Description", status: "warn", detail: `${metaDesc.length} chars (ideal: 50-160)` });
  } else {
    checks.push({ name: "Meta Description", status: "fail", detail: "Missing meta description" });
  }

  // Viewport
  const viewport = $('meta[name="viewport"]').attr("content") || "";
  if (viewport.includes("width=device-width")) {
    checks.push({ name: "Viewport Meta", status: "pass", detail: viewport });
  } else {
    checks.push({ name: "Viewport Meta", status: "fail", detail: "Missing or incorrect viewport meta tag" });
  }

  // Open Graph tags
  const ogTags = ["og:title", "og:description", "og:image", "og:url"];
  const missingOg = ogTags.filter((tag) => !$(`meta[property="${tag}"]`).attr("content"));
  if (missingOg.length === 0) {
    checks.push({ name: "Open Graph Tags", status: "pass", detail: "All OG tags present" });
  } else {
    checks.push({
      name: "Open Graph Tags",
      status: "warn",
      detail: `Missing: ${missingOg.join(", ")}`,
    });
  }

  // Canonical URL
  const canonical = $('link[rel="canonical"]').attr("href") || "";
  if (canonical) {
    checks.push({ name: "Canonical URL", status: "pass", detail: canonical });
  } else {
    checks.push({ name: "Canonical URL", status: "warn", detail: "No canonical URL set" });
  }

  // JSON-LD structured data
  const jsonLdScripts = $('script[type="application/ld+json"]');
  if (jsonLdScripts.length > 0) {
    const types = [];
    jsonLdScripts.each((_, el) => {
      try {
        const data = JSON.parse($(el).html());
        if (data["@type"]) types.push(data["@type"]);
        if (data["@graph"]) data["@graph"].forEach((item) => types.push(item["@type"]));
      } catch { /* skip malformed */ }
    });
    checks.push({ name: "Structured Data (JSON-LD)", status: "pass", detail: `Types: ${types.join(", ") || "present but no @type"}` });
  } else {
    checks.push({ name: "Structured Data (JSON-LD)", status: "warn", detail: "No JSON-LD structured data found" });
  }

  // H1 tag
  const h1s = $("h1");
  if (h1s.length === 1) {
    checks.push({ name: "H1 Tag", status: "pass", detail: `"${h1s.first().text().trim().substring(0, 60)}"` });
  } else if (h1s.length === 0) {
    checks.push({ name: "H1 Tag", status: "fail", detail: "No H1 tag found" });
  } else {
    checks.push({ name: "H1 Tag", status: "warn", detail: `${h1s.length} H1 tags found (should be 1)` });
  }

  // Robots.txt
  try {
    const robotsRes = await fetch(`${TARGET_URL}/robots.txt`);
    if (robotsRes.ok) {
      const robotsText = await robotsRes.text();
      const hasSitemap = robotsText.toLowerCase().includes("sitemap:");
      checks.push({
        name: "robots.txt",
        status: "pass",
        detail: `Present${hasSitemap ? ", includes sitemap reference" : " (no sitemap reference)"}`,
      });
    } else {
      checks.push({ name: "robots.txt", status: "warn", detail: `HTTP ${robotsRes.status}` });
    }
  } catch {
    checks.push({ name: "robots.txt", status: "warn", detail: "Could not fetch robots.txt" });
  }

  // Sitemap
  try {
    const sitemapRes = await fetch(`${TARGET_URL}/sitemap.xml`);
    if (sitemapRes.ok) {
      const sitemapText = await sitemapRes.text();
      const urlCount = (sitemapText.match(/<loc>/g) || []).length;
      checks.push({ name: "Sitemap", status: "pass", detail: `Found with ${urlCount} URLs` });
    } else {
      checks.push({ name: "Sitemap", status: "warn", detail: `HTTP ${sitemapRes.status} — sitemap may be missing` });
    }
  } catch {
    checks.push({ name: "Sitemap", status: "warn", detail: "Could not fetch sitemap.xml" });
  }

  // Broken internal links (sample check)
  const internalLinks = new Set();
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (href && (href.startsWith("/") || href.startsWith(TARGET_URL))) {
      const url = href.startsWith("/") ? `${TARGET_URL}${href}` : href;
      internalLinks.add(url);
    }
  });

  let brokenCount = 0;
  const brokenLinks = [];
  const linksToCheck = Array.from(internalLinks).slice(0, 20); // limit to avoid rate limiting
  for (const link of linksToCheck) {
    try {
      const res = await fetch(link, { method: "HEAD", redirect: "follow" });
      if (res.status >= 400) {
        brokenCount++;
        brokenLinks.push(`${link} (${res.status})`);
      }
    } catch {
      brokenCount++;
      brokenLinks.push(`${link} (failed)`);
    }
  }

  if (brokenCount === 0) {
    checks.push({ name: "Internal Links", status: "pass", detail: `Checked ${linksToCheck.length} links, none broken` });
  } else {
    checks.push({
      name: "Internal Links",
      status: "fail",
      detail: `${brokenCount} broken: ${brokenLinks.slice(0, 3).join(", ")}${brokenCount > 3 ? "..." : ""}`,
    });
  }

  return {
    category: "SEO",
    status: computeStatus(checks),
    score: computeScore(checks),
    checks,
  };
}
```

- [ ] **Step 2: Test locally**

Run: `cd monitoring && node -e "import('./scans/seo.mjs').then(m => m.run()).then(r => console.log(JSON.stringify(r, null, 2)))"`
Expected: JSON with SEO check results.

- [ ] **Step 3: Commit**

```bash
git add monitoring/scans/seo.mjs
git commit -m "feat: add SEO scanner (meta, OG, schema, sitemap, broken links)"
```

---

### Task 6: Performance scanner

**Files:**
- Create: `monitoring/scans/performance.mjs`

- [ ] **Step 1: Create monitoring/scans/performance.mjs**

```js
import { TARGET_URL, computeStatus, computeScore } from "../lib/scanner.mjs";

const PSI_API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

async function fetchPSI(strategy) {
  const url = `${PSI_API}?url=${encodeURIComponent(TARGET_URL)}&strategy=${strategy}&category=performance&category=accessibility`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`PageSpeed API returned ${res.status}`);
  }
  return res.json();
}

function extractMetrics(data) {
  const audits = data.lighthouseResult?.audits || {};
  return {
    lcp: audits["largest-contentful-paint"]?.displayValue || "N/A",
    lcpScore: audits["largest-contentful-paint"]?.score ?? -1,
    fcp: audits["first-contentful-paint"]?.displayValue || "N/A",
    fcpScore: audits["first-contentful-paint"]?.score ?? -1,
    cls: audits["cumulative-layout-shift"]?.displayValue || "N/A",
    clsScore: audits["cumulative-layout-shift"]?.score ?? -1,
    tbt: audits["total-blocking-time"]?.displayValue || "N/A",
    tbtScore: audits["total-blocking-time"]?.score ?? -1,
    ttfb: audits["server-response-time"]?.displayValue || "N/A",
    ttfbScore: audits["server-response-time"]?.score ?? -1,
    performanceScore: Math.round((data.lighthouseResult?.categories?.performance?.score || 0) * 100),
    renderBlocking: audits["render-blocking-resources"]?.details?.items?.length || 0,
    thirdParty: audits["third-party-summary"]?.details?.items?.length || 0,
  };
}

function scoreToStatus(score) {
  if (score >= 0.9) return "pass";
  if (score >= 0.5) return "warn";
  return "fail";
}

export async function run() {
  const checks = [];

  for (const strategy of ["mobile", "desktop"]) {
    try {
      const data = await fetchPSI(strategy);
      const m = extractMetrics(data);
      const label = strategy.charAt(0).toUpperCase() + strategy.slice(1);

      checks.push({
        name: `${label} Performance Score`,
        status: m.performanceScore >= 90 ? "pass" : m.performanceScore >= 50 ? "warn" : "fail",
        detail: `${m.performanceScore}/100`,
      });

      checks.push({
        name: `${label} LCP`,
        status: scoreToStatus(m.lcpScore),
        detail: m.lcp,
      });

      checks.push({
        name: `${label} FCP`,
        status: scoreToStatus(m.fcpScore),
        detail: m.fcp,
      });

      checks.push({
        name: `${label} CLS`,
        status: scoreToStatus(m.clsScore),
        detail: m.cls,
      });

      checks.push({
        name: `${label} TBT (proxy for INP)`,
        status: scoreToStatus(m.tbtScore),
        detail: m.tbt,
      });

      checks.push({
        name: `${label} TTFB`,
        status: scoreToStatus(m.ttfbScore),
        detail: m.ttfb,
      });

      if (strategy === "mobile") {
        if (m.renderBlocking > 0) {
          checks.push({
            name: "Render-Blocking Resources",
            status: "warn",
            detail: `${m.renderBlocking} render-blocking resources`,
          });
        } else {
          checks.push({ name: "Render-Blocking Resources", status: "pass", detail: "None detected" });
        }

        if (m.thirdParty > 3) {
          checks.push({
            name: "Third-Party Scripts",
            status: "warn",
            detail: `${m.thirdParty} third-party scripts loaded`,
          });
        } else {
          checks.push({
            name: "Third-Party Scripts",
            status: "pass",
            detail: `${m.thirdParty} third-party scripts`,
          });
        }
      }
    } catch (err) {
      checks.push({
        name: `${strategy} PageSpeed`,
        status: "warn",
        detail: `Could not fetch: ${err.message}`,
      });
    }
  }

  return {
    category: "Performance",
    status: computeStatus(checks),
    score: computeScore(checks),
    checks,
  };
}
```

- [ ] **Step 2: Test locally**

Run: `cd monitoring && node -e "import('./scans/performance.mjs').then(m => m.run()).then(r => console.log(JSON.stringify(r, null, 2)))"`
Expected: JSON with Core Web Vitals for mobile and desktop. This call takes ~30 seconds due to PageSpeed API.

- [ ] **Step 3: Commit**

```bash
git add monitoring/scans/performance.mjs
git commit -m "feat: add performance scanner (Core Web Vitals via PageSpeed API)"
```

---

### Task 7: Images & content scanner

**Files:**
- Create: `monitoring/scans/images.mjs`

- [ ] **Step 1: Create monitoring/scans/images.mjs**

```js
import { fetchPage, computeStatus, computeScore } from "../lib/scanner.mjs";

export async function run() {
  const checks = [];
  const { $ } = await fetchPage();

  // Image format analysis
  const images = $("img");
  let totalImages = 0;
  let modernFormat = 0;
  let missingAlt = 0;
  let lazyLoaded = 0;

  images.each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("data-src") || "";
    if (!src || src.startsWith("data:")) return;
    totalImages++;

    if (src.match(/\.(webp|avif)(\?|$)/i)) {
      modernFormat++;
    }

    const alt = $(el).attr("alt");
    if (!alt && alt !== "") {
      missingAlt++;
    } else if (alt === "") {
      // decorative image, acceptable
    }

    const loading = $(el).attr("loading");
    if (loading === "lazy") {
      lazyLoaded++;
    }
  });

  // Also check <source> elements in <picture> for modern formats
  $("picture source").each((_, el) => {
    const type = $(el).attr("type") || "";
    if (type.includes("webp") || type.includes("avif")) {
      modernFormat++;
    }
  });

  if (totalImages === 0) {
    checks.push({ name: "Images Found", status: "warn", detail: "No images detected on page" });
  } else {
    // Modern formats
    const modernPct = Math.round((modernFormat / totalImages) * 100);
    if (modernPct >= 80) {
      checks.push({ name: "Modern Image Formats", status: "pass", detail: `${modernPct}% using WebP/AVIF (${modernFormat}/${totalImages})` });
    } else if (modernPct >= 40) {
      checks.push({ name: "Modern Image Formats", status: "warn", detail: `${modernPct}% using WebP/AVIF (${modernFormat}/${totalImages})` });
    } else {
      checks.push({ name: "Modern Image Formats", status: "fail", detail: `Only ${modernPct}% using WebP/AVIF (${modernFormat}/${totalImages})` });
    }

    // Alt text
    if (missingAlt === 0) {
      checks.push({ name: "Image Alt Text", status: "pass", detail: `All ${totalImages} images have alt attributes` });
    } else {
      checks.push({
        name: "Image Alt Text",
        status: missingAlt > totalImages * 0.3 ? "fail" : "warn",
        detail: `${missingAlt}/${totalImages} images missing alt attribute`,
      });
    }

    // Lazy loading
    const lazyPct = Math.round((lazyLoaded / totalImages) * 100);
    if (lazyPct >= 60) {
      checks.push({ name: "Lazy Loading", status: "pass", detail: `${lazyPct}% of images use loading="lazy" (${lazyLoaded}/${totalImages})` });
    } else {
      checks.push({ name: "Lazy Loading", status: "warn", detail: `Only ${lazyPct}% use loading="lazy" (${lazyLoaded}/${totalImages})` });
    }
  }

  // Copyright year freshness
  const bodyText = $("body").text();
  const copyrightMatch = bodyText.match(/©\s*(\d{4})/);
  if (copyrightMatch) {
    const year = parseInt(copyrightMatch[1]);
    const currentYear = new Date().getFullYear();
    if (year === currentYear) {
      checks.push({ name: "Copyright Year", status: "pass", detail: `© ${year}` });
    } else {
      checks.push({ name: "Copyright Year", status: "warn", detail: `© ${year} (current year is ${currentYear})` });
    }
  } else {
    checks.push({ name: "Copyright Year", status: "warn", detail: "No copyright year found" });
  }

  return {
    category: "Images & Content",
    status: computeStatus(checks),
    score: computeScore(checks),
    checks,
  };
}
```

- [ ] **Step 2: Test locally**

Run: `cd monitoring && node -e "import('./scans/images.mjs').then(m => m.run()).then(r => console.log(JSON.stringify(r, null, 2)))"`
Expected: JSON with image format, alt text, lazy loading, and copyright year checks.

- [ ] **Step 3: Commit**

```bash
git add monitoring/scans/images.mjs
git commit -m "feat: add images & content scanner (formats, alt text, freshness)"
```

---

### Task 8: Accessibility scanner

**Files:**
- Create: `monitoring/scans/accessibility.mjs`

- [ ] **Step 1: Create monitoring/scans/accessibility.mjs**

```js
import { fetchPage, computeStatus, computeScore } from "../lib/scanner.mjs";

export async function run() {
  const checks = [];
  const { $ } = await fetchPage();

  // Heading hierarchy
  const headings = [];
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    headings.push(parseInt(el.tagName.charAt(1)));
  });

  let hierarchyValid = true;
  for (let i = 1; i < headings.length; i++) {
    if (headings[i] > headings[i - 1] + 1) {
      hierarchyValid = false;
      break;
    }
  }

  if (headings.length === 0) {
    checks.push({ name: "Heading Hierarchy", status: "fail", detail: "No headings found on page" });
  } else if (hierarchyValid) {
    checks.push({ name: "Heading Hierarchy", status: "pass", detail: `${headings.length} headings, proper hierarchy` });
  } else {
    checks.push({ name: "Heading Hierarchy", status: "warn", detail: `${headings.length} headings, skipped levels detected` });
  }

  // ARIA labels on interactive elements
  const buttons = $("button, [role='button']");
  let buttonsWithLabel = 0;
  let buttonsTotal = 0;
  buttons.each((_, el) => {
    buttonsTotal++;
    const hasLabel =
      $(el).attr("aria-label") ||
      $(el).attr("aria-labelledby") ||
      $(el).text().trim().length > 0 ||
      $(el).attr("title");
    if (hasLabel) buttonsWithLabel++;
  });

  if (buttonsTotal === 0) {
    checks.push({ name: "Button Labels", status: "pass", detail: "No buttons found" });
  } else if (buttonsWithLabel === buttonsTotal) {
    checks.push({ name: "Button Labels", status: "pass", detail: `All ${buttonsTotal} buttons have accessible labels` });
  } else {
    checks.push({
      name: "Button Labels",
      status: "warn",
      detail: `${buttonsTotal - buttonsWithLabel}/${buttonsTotal} buttons missing accessible labels`,
    });
  }

  // Links with accessible text
  const links = $("a");
  let emptyLinks = 0;
  links.each((_, el) => {
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr("aria-label") || "";
    const title = $(el).attr("title") || "";
    const img = $(el).find("img[alt]");
    if (!text && !ariaLabel && !title && img.length === 0) {
      emptyLinks++;
    }
  });

  if (emptyLinks === 0) {
    checks.push({ name: "Link Accessibility", status: "pass", detail: `All ${links.length} links have accessible text` });
  } else {
    checks.push({
      name: "Link Accessibility",
      status: "warn",
      detail: `${emptyLinks}/${links.length} links missing accessible text`,
    });
  }

  // Alt text coverage (images)
  const images = $("img");
  let withAlt = 0;
  let totalImages = 0;
  images.each((_, el) => {
    const src = $(el).attr("src") || "";
    if (!src || src.startsWith("data:")) return;
    totalImages++;
    if ($(el).attr("alt") !== undefined) withAlt++;
  });

  if (totalImages === 0) {
    checks.push({ name: "Alt Text Coverage", status: "pass", detail: "No content images found" });
  } else {
    const coverage = Math.round((withAlt / totalImages) * 100);
    if (coverage === 100) {
      checks.push({ name: "Alt Text Coverage", status: "pass", detail: `100% (${withAlt}/${totalImages} images)` });
    } else if (coverage >= 80) {
      checks.push({ name: "Alt Text Coverage", status: "warn", detail: `${coverage}% (${withAlt}/${totalImages} images)` });
    } else {
      checks.push({ name: "Alt Text Coverage", status: "fail", detail: `${coverage}% (${withAlt}/${totalImages} images)` });
    }
  }

  // Language attribute
  const lang = $("html").attr("lang");
  if (lang) {
    checks.push({ name: "HTML lang Attribute", status: "pass", detail: `lang="${lang}"` });
  } else {
    checks.push({ name: "HTML lang Attribute", status: "fail", detail: "Missing lang attribute on <html>" });
  }

  // Skip navigation link
  const skipLink = $('a[href="#main"], a[href="#content"], a.skip-link, a.skip-to-content, [class*="skip"]').first();
  if (skipLink.length > 0) {
    checks.push({ name: "Skip Navigation", status: "pass", detail: "Skip link found" });
  } else {
    checks.push({ name: "Skip Navigation", status: "warn", detail: "No skip navigation link detected" });
  }

  return {
    category: "Accessibility",
    status: computeStatus(checks),
    score: computeScore(checks),
    checks,
  };
}
```

- [ ] **Step 2: Test locally**

Run: `cd monitoring && node -e "import('./scans/accessibility.mjs').then(m => m.run()).then(r => console.log(JSON.stringify(r, null, 2)))"`
Expected: JSON with heading, ARIA, alt text, lang, and skip navigation checks.

- [ ] **Step 3: Commit**

```bash
git add monitoring/scans/accessibility.mjs
git commit -m "feat: add accessibility scanner (headings, ARIA, alt text, lang)"
```

---

### Task 9: Scan orchestrator

**Files:**
- Create: `monitoring/run-scans.mjs`

- [ ] **Step 1: Create monitoring/run-scans.mjs**

```js
import "dotenv/config";
import { postResults } from "./lib/discord.mjs";

const LIGHTWEIGHT_SCANS = ["security", "dependencies"];
const FULL_SCANS = ["security", "dependencies", "seo", "performance", "images", "accessibility"];

const SCAN_MODULES = {
  security: "./scans/security.mjs",
  dependencies: "./scans/dependencies.mjs",
  seo: "./scans/seo.mjs",
  performance: "./scans/performance.mjs",
  images: "./scans/images.mjs",
  accessibility: "./scans/accessibility.mjs",
};

function parseArgs() {
  const args = process.argv.slice(2);
  let type = "full";
  let scan = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--type" && args[i + 1]) {
      type = args[i + 1];
      i++;
    } else if (args[i] === "--scan" && args[i + 1]) {
      scan = args[i + 1];
      i++;
    }
  }

  return { type, scan };
}

async function main() {
  const { type, scan } = parseArgs();
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK_URL not set. Add it to .env or environment.");
    process.exit(1);
  }

  let scanNames;
  if (scan) {
    if (!SCAN_MODULES[scan]) {
      console.error(`Unknown scan: ${scan}. Available: ${Object.keys(SCAN_MODULES).join(", ")}`);
      process.exit(1);
    }
    scanNames = [scan];
  } else if (type === "lightweight") {
    scanNames = LIGHTWEIGHT_SCANS;
  } else {
    scanNames = FULL_SCANS;
  }

  console.log(`Running ${type} scan: ${scanNames.join(", ")}`);
  const results = [];

  for (const name of scanNames) {
    console.log(`  Running ${name}...`);
    try {
      const mod = await import(SCAN_MODULES[name]);
      const result = await mod.run();
      results.push(result);
      console.log(`  ${name}: ${result.status} (${result.score}/100)`);
    } catch (err) {
      console.error(`  ${name} failed: ${err.message}`);
      results.push({
        category: name.charAt(0).toUpperCase() + name.slice(1),
        status: "fail",
        score: 0,
        checks: [{ name: "Scanner Error", status: "fail", detail: err.message }],
      });
    }
  }

  await postResults(results, webhookUrl);
  console.log("Done.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Test lightweight scan end-to-end**

Run: `cd monitoring && node run-scans.mjs --type lightweight`
Expected: Security and dependency scans run, results posted to Discord with color-coded embeds.

- [ ] **Step 3: Test full scan end-to-end**

Run: `cd monitoring && node run-scans.mjs --type full`
Expected: All 6 scans run (takes ~60s due to PageSpeed API), results posted to Discord.

- [ ] **Step 4: Test single scan**

Run: `cd monitoring && node run-scans.mjs --scan security`
Expected: Only security scan runs, single embed posted to Discord.

- [ ] **Step 5: Commit**

```bash
git add monitoring/run-scans.mjs
git commit -m "feat: add scan orchestrator (lightweight, full, single scan modes)"
```

---

### Task 10: GitHub Actions workflow

**Files:**
- Create: `.github/workflows/website-monitor.yml`

- [ ] **Step 1: Create .github/workflows/website-monitor.yml**

```yaml
name: Website Monitor

on:
  schedule:
    - cron: '0 14 * * 1-6'  # Mon-Sat 7am PDT (lightweight)
    - cron: '0 14 * * 0'    # Sunday 7am PDT (full)
  workflow_dispatch:
    inputs:
      scan_type:
        description: 'Scan type to run'
        type: choice
        options:
          - lightweight
          - full
        default: full

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install monitoring dependencies
        run: cd monitoring && npm ci

      - name: Determine scan type
        id: scan-type
        run: |
          if [ "${{ github.event_name }}" = "workflow_dispatch" ]; then
            echo "type=${{ github.event.inputs.scan_type }}" >> $GITHUB_OUTPUT
          elif [ "$(date -u +%u)" = "7" ]; then
            echo "type=full" >> $GITHUB_OUTPUT
          else
            echo "type=lightweight" >> $GITHUB_OUTPUT
          fi

      - name: Run scans
        env:
          DISCORD_WEBHOOK_URL: ${{ secrets.DISCORD_WEBHOOK_URL }}
        run: cd monitoring && node run-scans.mjs --type ${{ steps.scan-type.outputs.type }}
```

- [ ] **Step 2: Add the Discord webhook as a GitHub secret**

Run: `gh secret set DISCORD_WEBHOOK_URL --repo erikcode-create/demar-digital-drive --body "https://discord.com/api/webhooks/1487670142706909374/ERbpH5Rf5KoJoP3-KzYIr5deg7L-EIZ0nfCaIaErMsTlrfLARIX6lYLHZBlrRDhyeAGh"`

Expected: `✓ Set secret DISCORD_WEBHOOK_URL for erikcode-create/demar-digital-drive`

- [ ] **Step 3: Commit and push**

```bash
git add .github/workflows/website-monitor.yml
git commit -m "feat: add GitHub Actions workflow for scheduled website monitoring"
git push
```

- [ ] **Step 4: Test the workflow manually**

Run: `gh workflow run website-monitor.yml -f scan_type=full --repo erikcode-create/demar-digital-drive`
Expected: Workflow starts. Check status with `gh run list --workflow=website-monitor.yml`.

- [ ] **Step 5: Verify Discord receives the results**

Wait for the workflow to complete (~2 min), then check the Discord channel for scan results.

---

### Task 11: Update .gitignore and clean up

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add monitoring .env to .gitignore**

The root `.gitignore` already covers `.env` files. Verify by running:

Run: `grep -n "\.env" .gitignore`
Expected: Lines showing `.env` and `.env.*` patterns. If present, no changes needed.

- [ ] **Step 2: Final verification — run full scan locally**

Run: `cd monitoring && node run-scans.mjs --type full`
Expected: All 6 scans complete, results appear in Discord with properly formatted embeds.

- [ ] **Step 3: Final commit with all files**

```bash
git add -A
git commit -m "feat: DeMar Transportation website monitoring system

- Security scanner (headers, SSL, exposed files)
- Dependency scanner (npm audit, outdated packages)
- SEO scanner (meta, OG, schema, sitemap, broken links)
- Performance scanner (Core Web Vitals via PageSpeed API)
- Images & content scanner (formats, alt text, freshness)
- Accessibility scanner (headings, ARIA, lang, skip nav)
- Discord webhook integration with color-coded embeds
- GitHub Actions: daily lightweight (Mon-Sat), weekly full (Sun)
- Manual trigger via gh workflow run"
```

- [ ] **Step 4: Push to trigger GitHub Pages deploy**

Run: `git push`
Expected: Both `deploy.yml` and `website-monitor.yml` workflows appear in GitHub Actions.
