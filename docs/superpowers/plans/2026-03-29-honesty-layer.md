# Honesty Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a confidence field (VERIFIED/INFERRED/UNABLE_TO_VERIFY) to every check across all 6 existing scanners, update scoring to exclude unverifiable checks, and update Discord embeds to display confidence indicators with reasons.

**Architecture:** Modify shared utilities (`scanner.mjs`, `discord.mjs`) to support the new check format, then update each scanner module to annotate every check with its confidence level and reason. Backward-compatible — checks without a confidence field default to VERIFIED.

**Tech Stack:** Node.js (ESM), cheerio, Discord webhooks

**Spec:** `docs/superpowers/specs/2026-03-29-enhanced-monitoring-design.md` (Section 1)

---

## File Structure

```
Files to modify:
├── monitoring/lib/scanner.mjs        # Add computeVerifiedCount, update computeScore/computeStatus
├── monitoring/lib/discord.mjs        # Render confidence indicators in embeds
├── monitoring/scans/security.mjs     # Add confidence: "VERIFIED" to all checks
├── monitoring/scans/seo.mjs          # VERIFIED for HTML head checks, UNABLE_TO_VERIFY for H1
├── monitoring/scans/accessibility.mjs # UNABLE_TO_VERIFY for SPA checks, VERIFIED for lang
├── monitoring/scans/dependencies.mjs  # Add confidence: "VERIFIED" to all checks
├── monitoring/scans/performance.mjs   # Add confidence: "VERIFIED" to all checks
├── monitoring/scans/images.mjs        # INFERRED for image checks, VERIFIED for copyright
├── monitoring/run-scans.mjs           # No changes needed (passes checks through as-is)
```

---

### Task 1: Update shared scanner utilities

**Files:**
- Modify: `monitoring/lib/scanner.mjs`

- [ ] **Step 1: Update `computeScore` to exclude UNABLE_TO_VERIFY checks**

Replace the entire `computeScore` function in `monitoring/lib/scanner.mjs`:

```js
export function computeScore(checks) {
  const scorable = checks.filter((c) => c.confidence !== "UNABLE_TO_VERIFY");
  if (scorable.length === 0) return 100;
  const passCount = scorable.filter((c) => c.status === "pass").length;
  return Math.round((passCount / scorable.length) * 100);
}
```

- [ ] **Step 2: Update `computeStatus` to only consider VERIFIED/INFERRED checks**

Replace the entire `computeStatus` function in `monitoring/lib/scanner.mjs`:

```js
export function computeStatus(checks) {
  const scorable = checks.filter((c) => c.confidence !== "UNABLE_TO_VERIFY");
  if (scorable.some((c) => c.status === "fail")) return "fail";
  if (scorable.some((c) => c.status === "warn")) return "warn";
  return "pass";
}
```

- [ ] **Step 3: Add `computeVerifiedCount` function**

Add this new export after `computeScore` in `monitoring/lib/scanner.mjs`:

```js
export function computeVerifiedCount(checks) {
  return checks.filter((c) => c.confidence !== "UNABLE_TO_VERIFY").length;
}
```

- [ ] **Step 4: Verify the monitoring system still runs**

Run: `cd monitoring && node run-scans.mjs --scan security 2>&1 | head -5`
Expected: Scan runs without errors (existing checks have no `confidence` field, so the filter `c.confidence !== "UNABLE_TO_VERIFY"` returns all checks — backward compatible).

- [ ] **Step 5: Commit**

```bash
git add monitoring/lib/scanner.mjs
git commit -m "feat: update score/status computation to support Honesty Layer confidence levels"
```

---

### Task 2: Update Discord embed rendering

**Files:**
- Modify: `monitoring/lib/discord.mjs`

- [ ] **Step 1: Add UNABLE_TO_VERIFY color and emoji constants**

In `monitoring/lib/discord.mjs`, replace the `COLORS` and `STATUS_EMOJI` constants:

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

const UNVERIFIED_EMOJI = "⬜";
```

- [ ] **Step 2: Update `buildEmbed` to show confidence indicators**

Replace the entire `buildEmbed` function in `monitoring/lib/discord.mjs`:

```js
export function buildEmbed(scanResult) {
  const { category, status, score, checks } = scanResult;

  const scorable = checks.filter((c) => c.confidence !== "UNABLE_TO_VERIFY");
  const unverifiable = checks.filter((c) => c.confidence === "UNABLE_TO_VERIFY");
  const passingCount = scorable.filter((c) => c.status === "pass").length;

  let description = `**Score: ${score}/100** (${scorable.length} of ${checks.length} checks verified)\n`;
  description += `${passingCount}/${scorable.length} verified checks passed\n\n`;

  // Show failing/warning verified checks
  const failingChecks = scorable.filter((c) => c.status !== "pass");
  for (const check of failingChecks) {
    const emoji = STATUS_EMOJI[check.status];
    description += `${emoji} **${check.name}**\n${check.detail}\n`;
    if (check.confidence === "INFERRED" && check.reason) {
      description += `*${check.reason}*\n`;
    }
    description += "\n";
  }

  // Show passing checks with INFERRED confidence
  const inferredPassing = scorable.filter((c) => c.status === "pass" && c.confidence === "INFERRED");
  for (const check of inferredPassing) {
    description += `✅ **${check.name}**\n${check.detail}\n`;
    if (check.reason) {
      description += `*${check.reason}*\n`;
    }
    description += "\n";
  }

  // Show unverifiable checks
  if (unverifiable.length > 0) {
    for (const check of unverifiable) {
      description += `${UNVERIFIED_EMOJI} **${check.name}** — UNABLE TO VERIFY\n`;
      if (check.reason) {
        description += `*${check.reason}*\n`;
      }
      description += "\n";
    }
  }

  // Trim to Discord's 4096-char embed description limit
  if (description.length > 4000) {
    description = description.substring(0, 3997) + "...";
  }

  return {
    title: `${STATUS_EMOJI[status]} ${category}`,
    description: description.trim(),
    color: COLORS[status],
    timestamp: new Date().toISOString(),
  };
}
```

- [ ] **Step 3: Verify Discord embed builds without errors**

Run: `cd monitoring && node -e "import('./lib/discord.mjs').then(m => { const embed = m.buildEmbed({ category: 'Test', status: 'pass', score: 100, checks: [{ name: 'Check1', status: 'pass', detail: 'ok', confidence: 'VERIFIED', reason: null }, { name: 'Check2', status: 'warn', detail: 'hmm', confidence: 'UNABLE_TO_VERIFY', reason: 'SPA limitation' }] }); console.log(JSON.stringify(embed, null, 2)); })"`
Expected: JSON output showing score "100/100 (1 of 2 checks verified)" and the UNABLE_TO_VERIFY check displayed with gray square.

- [ ] **Step 4: Commit**

```bash
git add monitoring/lib/discord.mjs
git commit -m "feat: render confidence indicators in Discord embeds (Honesty Layer)"
```

---

### Task 3: Add confidence to security scanner

**Files:**
- Modify: `monitoring/scans/security.mjs`

All security checks are VERIFIED — they directly observe HTTP headers, TLS handshakes, and file responses.

- [ ] **Step 1: Update header checks to include confidence**

In `monitoring/scans/security.mjs`, replace the REQUIRED_HEADERS loop (the `for (const { name, label } of REQUIRED_HEADERS)` block):

```js
  for (const { name, label } of REQUIRED_HEADERS) {
    const value = headers[name];
    if (value) {
      checks.push({ name: label, status: "pass", detail: value, confidence: "VERIFIED", reason: null });
    } else {
      checks.push({ name: label, status: "fail", detail: `Missing ${label} header`, confidence: "VERIFIED", reason: null });
    }
  }
```

- [ ] **Step 2: Update WARN_HEADERS loop to include confidence**

Replace the `for (const { name, label, shouldBeAbsent } of WARN_HEADERS)` block:

```js
  for (const { name, label, shouldBeAbsent } of WARN_HEADERS) {
    const value = headers[name];
    if (shouldBeAbsent && value) {
      checks.push({ name: label, status: "warn", detail: `Exposed: ${value}`, confidence: "VERIFIED", reason: null });
    } else if (shouldBeAbsent && !value) {
      checks.push({ name: label, status: "pass", detail: "Not exposed", confidence: "VERIFIED", reason: null });
    }
  }
```

- [ ] **Step 3: Update HTTPS redirect check to include confidence**

Replace the HTTPS redirect try/catch block:

```js
  // HTTPS redirect
  try {
    const httpRes = await fetch(`http://demartransportation.com`, { redirect: "manual", signal: AbortSignal.timeout(10000) });
    const location = httpRes.headers.get("location") || "";
    if (location.startsWith("https://")) {
      checks.push({ name: "HTTP→HTTPS Redirect", status: "pass", detail: `Redirects to ${location}`, confidence: "VERIFIED", reason: null });
    } else {
      checks.push({ name: "HTTP→HTTPS Redirect", status: "fail", detail: "No HTTPS redirect found", confidence: "VERIFIED", reason: null });
    }
  } catch {
    checks.push({ name: "HTTP→HTTPS Redirect", status: "warn", detail: "Could not test HTTP redirect", confidence: "VERIFIED", reason: null });
  }
```

- [ ] **Step 4: Update `checkSSL` function to include confidence**

Replace the entire `checkSSL` function:

```js
function checkSSL(hostname) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({ name: "SSL Certificate", status: "warn", detail: "SSL check timed out (10s)", confidence: "VERIFIED", reason: null });
    }, 10000);

    const req = https.request({ hostname, port: 443, method: "HEAD", timeout: 10000 }, (res) => {
      const cert = res.socket.getPeerCertificate();
      res.resume();
      clearTimeout(timeout);
      if (!cert || !cert.valid_to) {
        resolve({ name: "SSL Certificate", status: "fail", detail: "Could not read certificate", confidence: "VERIFIED", reason: null });
        return;
      }
      const expiryDate = new Date(cert.valid_to);
      const daysLeft = Math.floor((expiryDate - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysLeft < 7) {
        resolve({ name: "SSL Certificate", status: "fail", detail: `Expires in ${daysLeft} days (${cert.valid_to})`, confidence: "VERIFIED", reason: null });
      } else if (daysLeft < 30) {
        resolve({ name: "SSL Certificate", status: "warn", detail: `Expires in ${daysLeft} days (${cert.valid_to})`, confidence: "VERIFIED", reason: null });
      } else {
        resolve({ name: "SSL Certificate", status: "pass", detail: `Valid for ${daysLeft} days (expires ${cert.valid_to})`, confidence: "VERIFIED", reason: null });
      }
    });
    req.on("timeout", () => {
      req.destroy();
      clearTimeout(timeout);
      resolve({ name: "SSL Certificate", status: "warn", detail: "SSL check timed out", confidence: "VERIFIED", reason: null });
    });
    req.on("error", () => {
      clearTimeout(timeout);
      resolve({ name: "SSL Certificate", status: "fail", detail: "SSL connection failed", confidence: "VERIFIED", reason: null });
    });
    req.end();
  });
}
```

- [ ] **Step 5: Update exposed file checks to include confidence**

Replace the exposed sensitive files loop:

```js
  // Exposed sensitive files
  for (const path of SENSITIVE_PATHS) {
    try {
      const res = await fetch(`${TARGET_URL}${path}`, { redirect: "follow", signal: AbortSignal.timeout(10000) });
      if (res.status === 200) {
        checks.push({ name: `Exposed: ${path}`, status: "fail", detail: `${path} is publicly accessible (HTTP 200)`, confidence: "VERIFIED", reason: null });
      } else {
        checks.push({ name: `Exposed: ${path}`, status: "pass", detail: `${path} returns ${res.status}`, confidence: "VERIFIED", reason: null });
      }
    } catch {
      checks.push({ name: `Exposed: ${path}`, status: "pass", detail: `${path} not reachable`, confidence: "VERIFIED", reason: null });
    }
  }
```

- [ ] **Step 6: Run the security scanner to verify**

Run: `cd monitoring && node run-scans.mjs --scan security 2>&1`
Expected: Scan completes, shows score. No errors.

- [ ] **Step 7: Commit**

```bash
git add monitoring/scans/security.mjs
git commit -m "feat: add VERIFIED confidence to all security scanner checks"
```

---

### Task 4: Add confidence to SEO scanner

**Files:**
- Modify: `monitoring/scans/seo.mjs`

Most SEO checks parse raw HTML `<head>` tags (VERIFIED). The H1 check is UNABLE_TO_VERIFY because the SPA renders H1 via JavaScript.

- [ ] **Step 1: Update title, meta description, and viewport checks**

In `monitoring/scans/seo.mjs`, replace the title check block (lines ~7-14):

```js
  // Title tag
  const title = $("title").text().trim();
  if (title && title.length >= 10 && title.length <= 70) {
    checks.push({ name: "Title Tag", status: "pass", detail: `"${title}" (${title.length} chars)`, confidence: "VERIFIED", reason: null });
  } else if (title) {
    checks.push({ name: "Title Tag", status: "warn", detail: `"${title}" (${title.length} chars — ideal: 10-70)`, confidence: "VERIFIED", reason: null });
  } else {
    checks.push({ name: "Title Tag", status: "fail", detail: "Missing title tag", confidence: "VERIFIED", reason: null });
  }
```

Replace the meta description block:

```js
  // Meta description
  const metaDesc = $('meta[name="description"]').attr("content") || "";
  if (metaDesc && metaDesc.length >= 50 && metaDesc.length <= 160) {
    checks.push({ name: "Meta Description", status: "pass", detail: `${metaDesc.length} chars`, confidence: "VERIFIED", reason: null });
  } else if (metaDesc) {
    checks.push({ name: "Meta Description", status: "warn", detail: `${metaDesc.length} chars (ideal: 50-160)`, confidence: "VERIFIED", reason: null });
  } else {
    checks.push({ name: "Meta Description", status: "fail", detail: "Missing meta description", confidence: "VERIFIED", reason: null });
  }
```

Replace the viewport block:

```js
  // Viewport
  const viewport = $('meta[name="viewport"]').attr("content") || "";
  if (viewport.includes("width=device-width")) {
    checks.push({ name: "Viewport Meta", status: "pass", detail: viewport, confidence: "VERIFIED", reason: null });
  } else {
    checks.push({ name: "Viewport Meta", status: "fail", detail: "Missing or incorrect viewport meta tag", confidence: "VERIFIED", reason: null });
  }
```

- [ ] **Step 2: Update OG tags and canonical checks**

Replace the OG tags block:

```js
  // Open Graph tags
  const ogTags = ["og:title", "og:description", "og:image", "og:url"];
  const missingOg = ogTags.filter((tag) => !$(`meta[property="${tag}"]`).attr("content"));
  if (missingOg.length === 0) {
    checks.push({ name: "Open Graph Tags", status: "pass", detail: "All OG tags present", confidence: "VERIFIED", reason: null });
  } else {
    checks.push({
      name: "Open Graph Tags",
      status: "warn",
      detail: `Missing: ${missingOg.join(", ")}`,
      confidence: "VERIFIED",
      reason: null,
    });
  }
```

Replace the canonical block:

```js
  // Canonical URL
  const canonical = $('link[rel="canonical"]').attr("href") || "";
  if (canonical) {
    checks.push({ name: "Canonical URL", status: "pass", detail: canonical, confidence: "VERIFIED", reason: null });
  } else {
    checks.push({ name: "Canonical URL", status: "warn", detail: "No canonical URL set", confidence: "VERIFIED", reason: null });
  }
```

- [ ] **Step 3: Update JSON-LD and H1 checks**

Replace the JSON-LD block:

```js
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
    checks.push({ name: "Structured Data (JSON-LD)", status: "pass", detail: `Types: ${types.join(", ") || "present but no @type"}`, confidence: "VERIFIED", reason: null });
  } else {
    checks.push({ name: "Structured Data (JSON-LD)", status: "warn", detail: "No JSON-LD structured data found", confidence: "VERIFIED", reason: null });
  }
```

Replace the H1 block — this is the key UNABLE_TO_VERIFY change:

```js
  // H1 tag — SPA renders content client-side, cheerio can't see it
  const h1s = $("h1");
  if (h1s.length === 1) {
    checks.push({ name: "H1 Tag", status: "pass", detail: `"${h1s.first().text().trim().substring(0, 60)}"`, confidence: "VERIFIED", reason: null });
  } else if (h1s.length === 0) {
    checks.push({ name: "H1 Tag", status: "warn", detail: "No H1 tag in raw HTML", confidence: "UNABLE_TO_VERIFY", reason: "SPA renders content client-side; cheerio parses raw HTML without JavaScript execution. H1 may exist when page renders in browser." });
  } else {
    checks.push({ name: "H1 Tag", status: "warn", detail: `${h1s.length} H1 tags found (should be 1)`, confidence: "VERIFIED", reason: null });
  }
```

- [ ] **Step 4: Update robots.txt, sitemap, and internal links checks**

Replace the robots.txt block:

```js
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
        confidence: "VERIFIED",
        reason: null,
      });
    } else {
      checks.push({ name: "robots.txt", status: "warn", detail: `HTTP ${robotsRes.status}`, confidence: "VERIFIED", reason: null });
    }
  } catch {
    checks.push({ name: "robots.txt", status: "warn", detail: "Could not fetch robots.txt", confidence: "VERIFIED", reason: null });
  }
```

Replace the sitemap block:

```js
  // Sitemap
  try {
    const sitemapRes = await fetch(`${TARGET_URL}/sitemap.xml`);
    if (sitemapRes.ok) {
      const sitemapText = await sitemapRes.text();
      const urlCount = (sitemapText.match(/<loc>/g) || []).length;
      checks.push({ name: "Sitemap", status: "pass", detail: `Found with ${urlCount} URLs`, confidence: "VERIFIED", reason: null });
    } else {
      checks.push({ name: "Sitemap", status: "warn", detail: `HTTP ${sitemapRes.status} — sitemap may be missing`, confidence: "VERIFIED", reason: null });
    }
  } catch {
    checks.push({ name: "Sitemap", status: "warn", detail: "Could not fetch sitemap.xml", confidence: "VERIFIED", reason: null });
  }
```

Replace the internal links block:

```js
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
  const linksToCheck = Array.from(internalLinks).slice(0, 20);
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
    checks.push({ name: "Internal Links", status: "pass", detail: `Checked ${linksToCheck.length} links, none broken`, confidence: "VERIFIED", reason: null });
  } else {
    checks.push({
      name: "Internal Links",
      status: "fail",
      detail: `${brokenCount} broken: ${brokenLinks.slice(0, 3).join(", ")}${brokenCount > 3 ? "..." : ""}`,
      confidence: "VERIFIED",
      reason: null,
    });
  }
```

- [ ] **Step 5: Run the SEO scanner to verify**

Run: `cd monitoring && node run-scans.mjs --scan seo 2>&1`
Expected: Scan completes. H1 check should show as UNABLE_TO_VERIFY instead of a hard fail.

- [ ] **Step 6: Commit**

```bash
git add monitoring/scans/seo.mjs
git commit -m "feat: add confidence levels to SEO scanner (H1 marked UNABLE_TO_VERIFY for SPA)"
```

---

### Task 5: Add confidence to accessibility scanner

**Files:**
- Modify: `monitoring/scans/accessibility.mjs`

Most accessibility checks are UNABLE_TO_VERIFY because they inspect DOM elements rendered by JavaScript. HTML lang attribute is VERIFIED because it's in raw HTML.

- [ ] **Step 1: Replace the entire `run` function**

Replace the entire content of `monitoring/scans/accessibility.mjs`:

```js
import { fetchPage, computeStatus, computeScore } from "../lib/scanner.mjs";

const SPA_REASON = "SPA renders content client-side; cheerio parses raw HTML without JavaScript execution. These elements may exist when page renders in browser.";

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
    checks.push({ name: "Heading Hierarchy", status: "warn", detail: "No headings found in raw HTML", confidence: "UNABLE_TO_VERIFY", reason: SPA_REASON });
  } else if (hierarchyValid) {
    checks.push({ name: "Heading Hierarchy", status: "pass", detail: `${headings.length} headings, proper hierarchy`, confidence: "VERIFIED", reason: null });
  } else {
    checks.push({ name: "Heading Hierarchy", status: "warn", detail: `${headings.length} headings, skipped levels detected`, confidence: "VERIFIED", reason: null });
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
    checks.push({ name: "Button Labels", status: "pass", detail: "No buttons found in raw HTML", confidence: "UNABLE_TO_VERIFY", reason: SPA_REASON });
  } else if (buttonsWithLabel === buttonsTotal) {
    checks.push({ name: "Button Labels", status: "pass", detail: `All ${buttonsTotal} buttons have accessible labels`, confidence: "VERIFIED", reason: null });
  } else {
    checks.push({
      name: "Button Labels",
      status: "warn",
      detail: `${buttonsTotal - buttonsWithLabel}/${buttonsTotal} buttons missing accessible labels`,
      confidence: "VERIFIED",
      reason: null,
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

  if (links.length === 0) {
    checks.push({ name: "Link Accessibility", status: "pass", detail: "No links found in raw HTML", confidence: "UNABLE_TO_VERIFY", reason: SPA_REASON });
  } else if (emptyLinks === 0) {
    checks.push({ name: "Link Accessibility", status: "pass", detail: `All ${links.length} links have accessible text`, confidence: "VERIFIED", reason: null });
  } else {
    checks.push({
      name: "Link Accessibility",
      status: "warn",
      detail: `${emptyLinks}/${links.length} links missing accessible text`,
      confidence: "VERIFIED",
      reason: null,
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
    checks.push({ name: "Alt Text Coverage", status: "pass", detail: "No content images found in raw HTML", confidence: "UNABLE_TO_VERIFY", reason: SPA_REASON });
  } else {
    const coverage = Math.round((withAlt / totalImages) * 100);
    if (coverage === 100) {
      checks.push({ name: "Alt Text Coverage", status: "pass", detail: `100% (${withAlt}/${totalImages} images)`, confidence: "VERIFIED", reason: null });
    } else if (coverage >= 80) {
      checks.push({ name: "Alt Text Coverage", status: "warn", detail: `${coverage}% (${withAlt}/${totalImages} images)`, confidence: "VERIFIED", reason: null });
    } else {
      checks.push({ name: "Alt Text Coverage", status: "fail", detail: `${coverage}% (${withAlt}/${totalImages} images)`, confidence: "VERIFIED", reason: null });
    }
  }

  // Language attribute — present in raw HTML, always VERIFIED
  const lang = $("html").attr("lang");
  if (lang) {
    checks.push({ name: "HTML lang Attribute", status: "pass", detail: `lang="${lang}"`, confidence: "VERIFIED", reason: null });
  } else {
    checks.push({ name: "HTML lang Attribute", status: "fail", detail: "Missing lang attribute on <html>", confidence: "VERIFIED", reason: null });
  }

  // Skip navigation link
  const skipLink = $('a[href="#main"], a[href="#main-content"], a[href="#content"], a.skip-link, a.skip-to-content, [class*="skip"]').first();
  if (skipLink.length > 0) {
    checks.push({ name: "Skip Navigation", status: "pass", detail: "Skip link found", confidence: "VERIFIED", reason: null });
  } else {
    checks.push({ name: "Skip Navigation", status: "warn", detail: "No skip navigation link found in raw HTML", confidence: "UNABLE_TO_VERIFY", reason: SPA_REASON });
  }

  return {
    category: "Accessibility",
    status: computeStatus(checks),
    score: computeScore(checks),
    checks,
  };
}
```

Note: Also updated the skip nav selector to include `#main-content` (which is what the site uses).

- [ ] **Step 2: Run the accessibility scanner to verify**

Run: `cd monitoring && node run-scans.mjs --scan accessibility 2>&1`
Expected: Scan completes. SPA-dependent checks show as UNABLE_TO_VERIFY. HTML lang should show as VERIFIED pass. Score should only reflect verified checks.

- [ ] **Step 3: Commit**

```bash
git add monitoring/scans/accessibility.mjs
git commit -m "feat: add confidence levels to accessibility scanner (SPA checks marked UNABLE_TO_VERIFY)"
```

---

### Task 6: Add confidence to dependencies scanner

**Files:**
- Modify: `monitoring/scans/dependencies.mjs`

All dependency checks are VERIFIED — they directly query the npm registry.

- [ ] **Step 1: Update npm audit checks to include confidence**

In `monitoring/scans/dependencies.mjs`, find the first `checks.push` inside the npm audit `try` block (the one that pushes fail for critical/high) and update ALL `checks.push` calls in the npm audit section to include `confidence: "VERIFIED", reason: null`. There are 7 total `checks.push` calls in the npm audit section (lines ~25-63).

Every `checks.push({` call in this file should have `confidence: "VERIFIED", reason: null` added as the last two properties. For example:

```js
checks.push({
  name: "npm audit",
  status: "fail",
  detail: `${total} vulnerabilities: ${critical} critical, ${high} high, ${moderate} moderate, ${low} low`,
  confidence: "VERIFIED",
  reason: null,
});
```

Apply this pattern to all 7 npm audit `checks.push` calls and all 5 outdated packages `checks.push` calls (12 total across the file).

- [ ] **Step 2: Run the dependencies scanner to verify**

Run: `cd monitoring && node run-scans.mjs --scan dependencies 2>&1`
Expected: Scan completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add monitoring/scans/dependencies.mjs
git commit -m "feat: add VERIFIED confidence to all dependency scanner checks"
```

---

### Task 7: Add confidence to performance scanner

**Files:**
- Modify: `monitoring/scans/performance.mjs`

All performance checks are VERIFIED — Google PageSpeed Insights renders the page with a real browser.

- [ ] **Step 1: Add confidence to all checks.push calls**

In `monitoring/scans/performance.mjs`, add `confidence: "VERIFIED", reason: null` to every `checks.push` call. There are 10 total: Performance Score, LCP, FCP, CLS, TBT, TTFB (×2 for mobile/desktop), Render-Blocking Resources, Third-Party Scripts, and the error fallback.

For example, the performance score check becomes:

```js
        checks.push({
          name: `${label} Performance Score`,
          status: m.performanceScore >= 90 ? "pass" : m.performanceScore >= 50 ? "warn" : "fail",
          detail: `${m.performanceScore}/100`,
          confidence: "VERIFIED",
          reason: null,
        });
```

The error fallback becomes:

```js
      } catch (err) {
        checks.push({
          name: `${strategy} PageSpeed`,
          status: "warn",
          detail: `Could not fetch: ${err.message}`,
          confidence: "VERIFIED",
          reason: null,
        });
      }
```

Apply this to all 10 `checks.push` calls.

- [ ] **Step 2: Run the performance scanner to verify**

Run: `cd monitoring && node run-scans.mjs --scan performance 2>&1`
Expected: Scan completes (may show warn if PageSpeed API rate-limited, but no code errors).

- [ ] **Step 3: Commit**

```bash
git add monitoring/scans/performance.mjs
git commit -m "feat: add VERIFIED confidence to all performance scanner checks"
```

---

### Task 8: Add confidence to images scanner

**Files:**
- Modify: `monitoring/scans/images.mjs`

Image checks that inspect DOM elements are INFERRED (only sees initial HTML, not dynamically loaded images). Copyright year check is VERIFIED (text in raw HTML).

- [ ] **Step 1: Update image format, alt text, and lazy loading checks**

In `monitoring/scans/images.mjs`, update the checks inside the `if (totalImages === 0)` else block. The "Images Found" warning for zero images:

```js
  if (totalImages === 0) {
    checks.push({ name: "Images Found", status: "warn", detail: "No images detected in raw HTML", confidence: "INFERRED", reason: "Only checks images in initial HTML; dynamically loaded images are not detected" });
  } else {
```

Modern formats check:

```js
    const modernPct = Math.round((modernFormat / totalImages) * 100);
    if (modernPct >= 80) {
      checks.push({ name: "Modern Image Formats", status: "pass", detail: `${modernPct}% using WebP/AVIF (${modernFormat}/${totalImages})`, confidence: "INFERRED", reason: "Only checks images in initial HTML, not dynamically loaded images" });
    } else if (modernPct >= 40) {
      checks.push({ name: "Modern Image Formats", status: "warn", detail: `${modernPct}% using WebP/AVIF (${modernFormat}/${totalImages})`, confidence: "INFERRED", reason: "Only checks images in initial HTML, not dynamically loaded images" });
    } else {
      checks.push({ name: "Modern Image Formats", status: "fail", detail: `Only ${modernPct}% using WebP/AVIF (${modernFormat}/${totalImages})`, confidence: "INFERRED", reason: "Only checks images in initial HTML, not dynamically loaded images" });
    }
```

Alt text check:

```js
    if (missingAlt === 0) {
      checks.push({ name: "Image Alt Text", status: "pass", detail: `All ${totalImages} images have alt attributes`, confidence: "INFERRED", reason: "Only checks images in initial HTML, not dynamically loaded images" });
    } else {
      checks.push({
        name: "Image Alt Text",
        status: missingAlt > totalImages * 0.3 ? "fail" : "warn",
        detail: `${missingAlt}/${totalImages} images missing alt attribute`,
        confidence: "INFERRED",
        reason: "Only checks images in initial HTML, not dynamically loaded images",
      });
    }
```

Lazy loading check:

```js
    const lazyPct = Math.round((lazyLoaded / totalImages) * 100);
    if (lazyPct >= 60) {
      checks.push({ name: "Lazy Loading", status: "pass", detail: `${lazyPct}% of images use loading="lazy" (${lazyLoaded}/${totalImages})`, confidence: "INFERRED", reason: "Only checks images in initial HTML, not dynamically loaded images" });
    } else {
      checks.push({ name: "Lazy Loading", status: "warn", detail: `Only ${lazyPct}% use loading="lazy" (${lazyLoaded}/${totalImages})`, confidence: "INFERRED", reason: "Only checks images in initial HTML, not dynamically loaded images" });
    }
```

- [ ] **Step 2: Update copyright year check**

Replace the copyright year block:

```js
  // Copyright year freshness
  const bodyText = $("body").text();
  const copyrightMatch = bodyText.match(/©\s*(\d{4})/);
  if (copyrightMatch) {
    const year = parseInt(copyrightMatch[1]);
    const currentYear = new Date().getFullYear();
    if (year === currentYear) {
      checks.push({ name: "Copyright Year", status: "pass", detail: `© ${year}`, confidence: "VERIFIED", reason: null });
    } else {
      checks.push({ name: "Copyright Year", status: "warn", detail: `© ${year} (current year is ${currentYear})`, confidence: "VERIFIED", reason: null });
    }
  } else {
    checks.push({ name: "Copyright Year", status: "warn", detail: "No copyright year found in raw HTML", confidence: "INFERRED", reason: "Copyright text may be rendered by JavaScript at runtime" });
  }
```

- [ ] **Step 3: Run the images scanner to verify**

Run: `cd monitoring && node run-scans.mjs --scan images 2>&1`
Expected: Scan completes. Image checks show as INFERRED, copyright as VERIFIED.

- [ ] **Step 4: Commit**

```bash
git add monitoring/scans/images.mjs
git commit -m "feat: add confidence levels to images scanner (INFERRED for DOM checks, VERIFIED for copyright)"
```

---

### Task 9: End-to-end verification

**Files:** None (verification only)

- [ ] **Step 1: Run full scan locally**

Run: `cd monitoring && node run-scans.mjs --type full 2>&1`
Expected: All 6 scanners complete. Discord receives embeds with confidence indicators. UNABLE_TO_VERIFY checks shown with gray squares and reasons. Scores exclude unverifiable checks.

- [ ] **Step 2: Verify Discord output**

Check Discord channel. The accessibility scanner should show most checks as "⬜ UNABLE TO VERIFY" with the SPA reason, and the score should only reflect the HTML lang attribute check. SEO should show H1 as ⬜ with the SPA reason.

- [ ] **Step 3: Run lightweight scan**

Run: `cd monitoring && node run-scans.mjs --type lightweight 2>&1`
Expected: Security and dependencies run with all VERIFIED checks. No errors.

- [ ] **Step 4: Commit any fixes if needed**

If any issues were found during verification, fix them and commit:
```bash
git add -A monitoring/
git commit -m "fix: resolve issues found during Honesty Layer verification"
```
