# New Scanners Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 5 new scanner modules (schema validation, social preview, broken links, content freshness, DNS/domain health), register them in the orchestrator, and add the `whois` dependency.

**Architecture:** Each scanner follows the existing pattern: export `async function run()` returning `{ category, status, score, checks[] }`. Every check includes `confidence` and `reason` fields (Honesty Layer). New scanners are registered in `run-scans.mjs` under FULL_SCANS. Content freshness copyright check also runs in lightweight.

**Tech Stack:** Node.js (ESM), cheerio, `whois` npm package, Node.js `dns` module

**Spec:** `docs/superpowers/specs/2026-03-29-enhanced-monitoring-design.md` (Sections 2-6)

---

## File Structure

```
Files to create:
├── monitoring/scans/schema.mjs          # JSON-LD validation
├── monitoring/scans/social-preview.mjs  # OG/Twitter image verification
├── monitoring/scans/links.mjs           # Broken link checker with full crawl
├── monitoring/scans/freshness.mjs       # Content staleness detection
├── monitoring/scans/dns.mjs             # Domain health, WHOIS, DNS records

Files to modify:
├── monitoring/run-scans.mjs             # Register new scanners, update scan groups
├── monitoring/package.json              # Add whois dependency, new npm scripts
```

---

### Task 1: Create schema validation scanner

**Files:**
- Create: `monitoring/scans/schema.mjs`

- [ ] **Step 1: Create the schema scanner**

Create `monitoring/scans/schema.mjs`:

```js
import { fetchPage, TARGET_URL, computeStatus, computeScore } from "../lib/scanner.mjs";

const EXPECTED_TYPES = {
  "/": ["TransportCompany"],
};

const REQUIRED_PROPS = {
  TransportCompany: ["name", "url", "telephone"],
  Organization: ["name", "url"],
  LocalBusiness: ["name", "url", "telephone"],
};

function validateEmail(val) {
  return typeof val === "string" && val.includes("@");
}

function validatePhone(val) {
  return typeof val === "string" && /[\d\-\+\(\)]{7,}/.test(val);
}

function validateUrl(val) {
  try { new URL(val); return true; } catch { return false; }
}

export async function run() {
  const checks = [];
  const { $ } = await fetchPage();

  const jsonLdScripts = $('script[type="application/ld+json"]');

  if (jsonLdScripts.length === 0) {
    checks.push({ name: "JSON-LD Present", status: "fail", detail: "No JSON-LD structured data found", confidence: "VERIFIED", reason: null });
    return { category: "Schema Validation", status: computeStatus(checks), score: computeScore(checks), checks };
  }

  const schemas = [];
  jsonLdScripts.each((_, el) => {
    try {
      const data = JSON.parse($(el).html());
      if (data["@graph"]) {
        data["@graph"].forEach((item) => schemas.push(item));
      } else {
        schemas.push(data);
      }
    } catch { /* skip malformed */ }
  });

  checks.push({ name: "JSON-LD Present", status: "pass", detail: `${schemas.length} schema(s) found`, confidence: "VERIFIED", reason: null });

  // Schema type correctness
  const pathname = new URL(TARGET_URL).pathname;
  const expectedTypes = EXPECTED_TYPES[pathname] || [];
  const foundTypes = schemas.map((s) => s["@type"]).filter(Boolean);

  if (expectedTypes.length > 0) {
    const missing = expectedTypes.filter((t) => !foundTypes.includes(t));
    if (missing.length === 0) {
      checks.push({ name: "Schema Type Correctness", status: "pass", detail: `Found expected type(s): ${expectedTypes.join(", ")}`, confidence: "VERIFIED", reason: null });
    } else {
      checks.push({ name: "Schema Type Correctness", status: "warn", detail: `Missing expected type(s): ${missing.join(", ")}. Found: ${foundTypes.join(", ")}`, confidence: "VERIFIED", reason: null });
    }
  } else {
    checks.push({ name: "Schema Type Correctness", status: "pass", detail: `Types found: ${foundTypes.join(", ") || "none"}`, confidence: "VERIFIED", reason: null });
  }

  // Required properties
  for (const schema of schemas) {
    const type = schema["@type"];
    const required = REQUIRED_PROPS[type];
    if (!required) continue;

    const missing = required.filter((prop) => !schema[prop]);
    if (missing.length === 0) {
      checks.push({ name: `${type} Required Props`, status: "pass", detail: `All required properties present: ${required.join(", ")}`, confidence: "VERIFIED", reason: null });
    } else {
      checks.push({ name: `${type} Required Props`, status: "warn", detail: `Missing: ${missing.join(", ")}`, confidence: "VERIFIED", reason: null });
    }
  }

  // Property value validation
  for (const schema of schemas) {
    if (schema.telephone && !validatePhone(schema.telephone)) {
      checks.push({ name: "Phone Format", status: "warn", detail: `"${schema.telephone}" doesn't look like a valid phone number`, confidence: "VERIFIED", reason: null });
    } else if (schema.telephone) {
      checks.push({ name: "Phone Format", status: "pass", detail: `${schema.telephone}`, confidence: "VERIFIED", reason: null });
    }

    if (schema.email && !validateEmail(schema.email)) {
      checks.push({ name: "Email Format", status: "warn", detail: `"${schema.email}" doesn't look like a valid email`, confidence: "VERIFIED", reason: null });
    } else if (schema.email) {
      checks.push({ name: "Email Format", status: "pass", detail: `${schema.email}`, confidence: "VERIFIED", reason: null });
    }

    if (schema.url && !validateUrl(schema.url)) {
      checks.push({ name: "Schema URL", status: "warn", detail: `"${schema.url}" is not a valid URL`, confidence: "VERIFIED", reason: null });
    } else if (schema.url) {
      checks.push({ name: "Schema URL", status: "pass", detail: `${schema.url}`, confidence: "VERIFIED", reason: null });
    }
  }

  // Nested schema integrity (ContactPoint)
  for (const schema of schemas) {
    const channel = schema.availableChannel;
    if (channel?.servicePhone) {
      const cp = channel.servicePhone;
      if (!cp.telephone) {
        checks.push({ name: "ContactPoint Integrity", status: "warn", detail: "ContactPoint missing telephone", confidence: "VERIFIED", reason: null });
      } else if (!cp.contactType) {
        checks.push({ name: "ContactPoint Integrity", status: "warn", detail: "ContactPoint missing contactType", confidence: "VERIFIED", reason: null });
      } else {
        checks.push({ name: "ContactPoint Integrity", status: "pass", detail: `ContactPoint: ${cp.contactType}, ${cp.telephone}`, confidence: "VERIFIED", reason: null });
      }
    }
  }

  // Multiple schema conflict
  const typeSet = new Set(foundTypes);
  const conflicting = [["Restaurant", "TransportCompany"], ["Hotel", "TransportCompany"]];
  for (const [a, b] of conflicting) {
    if (typeSet.has(a) && typeSet.has(b)) {
      checks.push({ name: "Schema Conflict", status: "warn", detail: `Conflicting types: ${a} and ${b}`, confidence: "VERIFIED", reason: null });
    }
  }
  if (checks.every((c) => c.name !== "Schema Conflict")) {
    checks.push({ name: "Schema Conflict", status: "pass", detail: "No conflicting schema types", confidence: "VERIFIED", reason: null });
  }

  return { category: "Schema Validation", status: computeStatus(checks), score: computeScore(checks), checks };
}
```

- [ ] **Step 2: Test the scanner**

Run: `cd monitoring && node -e "import('./scans/schema.mjs').then(m => m.run()).then(r => { console.log(r.category, r.score + '/100'); r.checks.forEach(c => console.log(c.status, c.name, '-', c.detail)); })"`
Expected: Schema Validation with checks for type correctness, required props, phone/email/URL format, ContactPoint integrity, and no conflicts.

- [ ] **Step 3: Commit**

```bash
git add monitoring/scans/schema.mjs
git commit -m "feat: add schema validation scanner with JSON-LD type and property checks"
```

---

### Task 2: Create social preview scanner

**Files:**
- Create: `monitoring/scans/social-preview.mjs`

- [ ] **Step 1: Create the social preview scanner**

Create `monitoring/scans/social-preview.mjs`:

```js
import { fetchPage, TARGET_URL, computeStatus, computeScore } from "../lib/scanner.mjs";

const PLACEHOLDER_PATTERNS = [
  /lovable/i, /vercel/i, /next\.js/i, /my-app/i, /example\.com/i,
  /localhost/i, /placeholder/i, /untitled/i, /your[- ]?company/i,
];

export async function run() {
  const checks = [];
  const { $ } = await fetchPage();

  // OG image reachable
  const ogImage = $('meta[property="og:image"]').attr("content") || "";
  if (ogImage) {
    try {
      const res = await fetch(ogImage, { method: "HEAD", signal: AbortSignal.timeout(10000) });
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.startsWith("image/")) {
        checks.push({ name: "OG Image Reachable", status: "pass", detail: `${ogImage} (${contentType})`, confidence: "VERIFIED", reason: null });
      } else if (res.ok) {
        checks.push({ name: "OG Image Reachable", status: "warn", detail: `${ogImage} returned ${contentType} (expected image/*)`, confidence: "VERIFIED", reason: null });
      } else {
        checks.push({ name: "OG Image Reachable", status: "fail", detail: `${ogImage} returned HTTP ${res.status}`, confidence: "VERIFIED", reason: null });
      }
    } catch (err) {
      checks.push({ name: "OG Image Reachable", status: "fail", detail: `Could not fetch: ${err.message}`, confidence: "VERIFIED", reason: null });
    }
  } else {
    checks.push({ name: "OG Image Reachable", status: "fail", detail: "No og:image meta tag found", confidence: "VERIFIED", reason: null });
  }

  // Twitter image reachable
  const twitterImage = $('meta[name="twitter:image"]').attr("content") || "";
  if (twitterImage) {
    try {
      const res = await fetch(twitterImage, { method: "HEAD", signal: AbortSignal.timeout(10000) });
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.startsWith("image/")) {
        checks.push({ name: "Twitter Image Reachable", status: "pass", detail: `${twitterImage} (${contentType})`, confidence: "VERIFIED", reason: null });
      } else {
        checks.push({ name: "Twitter Image Reachable", status: "fail", detail: `HTTP ${res.status} or wrong content-type: ${contentType}`, confidence: "VERIFIED", reason: null });
      }
    } catch (err) {
      checks.push({ name: "Twitter Image Reachable", status: "fail", detail: `Could not fetch: ${err.message}`, confidence: "VERIFIED", reason: null });
    }
  } else {
    checks.push({ name: "Twitter Image Reachable", status: "warn", detail: "No twitter:image meta tag found", confidence: "VERIFIED", reason: null });
  }

  // Placeholder detection
  const fieldsToCheck = {
    "og:title": $('meta[property="og:title"]').attr("content") || "",
    "og:description": $('meta[property="og:description"]').attr("content") || "",
    "og:image": ogImage,
    "twitter:title": $('meta[name="twitter:title"]').attr("content") || "",
    "twitter:description": $('meta[name="twitter:description"]').attr("content") || "",
    "twitter:image": twitterImage,
  };

  const placeholdersFound = [];
  for (const [field, value] of Object.entries(fieldsToCheck)) {
    if (!value) continue;
    for (const pattern of PLACEHOLDER_PATTERNS) {
      if (pattern.test(value)) {
        placeholdersFound.push(`${field} contains "${value.match(pattern)[0]}"`);
        break;
      }
    }
  }

  if (placeholdersFound.length === 0) {
    checks.push({ name: "Placeholder Detection", status: "pass", detail: "No placeholder/template text found in social tags", confidence: "VERIFIED", reason: null });
  } else {
    checks.push({ name: "Placeholder Detection", status: "fail", detail: placeholdersFound.join("; "), confidence: "VERIFIED", reason: null });
  }

  // URL consistency
  const ogUrl = $('meta[property="og:url"]').attr("content") || "";
  const canonical = $('link[rel="canonical"]').attr("href") || "";

  if (ogUrl && canonical) {
    if (ogUrl === canonical) {
      checks.push({ name: "URL Consistency", status: "pass", detail: `og:url and canonical match: ${ogUrl}`, confidence: "VERIFIED", reason: null });
    } else {
      checks.push({ name: "URL Consistency", status: "warn", detail: `og:url (${ogUrl}) differs from canonical (${canonical})`, confidence: "VERIFIED", reason: null });
    }
  } else if (!ogUrl) {
    checks.push({ name: "URL Consistency", status: "warn", detail: "No og:url set", confidence: "VERIFIED", reason: null });
  } else {
    checks.push({ name: "URL Consistency", status: "warn", detail: "No canonical URL set", confidence: "VERIFIED", reason: null });
  }

  return { category: "Social Preview", status: computeStatus(checks), score: computeScore(checks), checks };
}
```

- [ ] **Step 2: Test the scanner**

Run: `cd monitoring && node -e "import('./scans/social-preview.mjs').then(m => m.run()).then(r => { console.log(r.category, r.score + '/100'); r.checks.forEach(c => console.log(c.status, c.name, '-', c.detail)); })"`
Expected: All checks pass (we fixed OG tags, images are reachable, no placeholders).

- [ ] **Step 3: Commit**

```bash
git add monitoring/scans/social-preview.mjs
git commit -m "feat: add social preview scanner for OG/Twitter verification"
```

---

### Task 3: Create broken link checker

**Files:**
- Create: `monitoring/scans/links.mjs`

- [ ] **Step 1: Create the broken link checker**

Create `monitoring/scans/links.mjs`:

```js
import { fetchPage, TARGET_URL, computeStatus, computeScore } from "../lib/scanner.mjs";

const MAX_DEPTH = 3;
const MAX_URLS = 100;
const TIMEOUT = 5000;

async function crawl(startUrl) {
  const visited = new Set();
  const allLinks = []; // { source, href, type: "internal"|"external"|"anchor"|"mixed-content" }
  const queue = [{ url: startUrl, depth: 0 }];

  while (queue.length > 0 && visited.size < MAX_URLS) {
    const { url, depth } = queue.shift();
    if (visited.has(url) || depth > MAX_DEPTH) continue;
    visited.add(url);

    let $;
    try {
      const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(TIMEOUT) });
      if (!res.ok) continue;
      const html = await res.text();
      const cheerio = await import("cheerio");
      $ = cheerio.load(html);
    } catch {
      continue;
    }

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return;

      if (href.startsWith("#")) {
        allLinks.push({ source: url, href, type: "anchor" });
        return;
      }

      let resolved;
      try {
        resolved = new URL(href, url).href;
      } catch { return; }

      const isInternal = resolved.startsWith(TARGET_URL);

      // Mixed content check
      if (resolved.startsWith("http://") && url.startsWith("https://")) {
        allLinks.push({ source: url, href: resolved, type: "mixed-content" });
      }

      allLinks.push({ source: url, href: resolved, type: isInternal ? "internal" : "external" });

      if (isInternal && !visited.has(resolved) && depth + 1 <= MAX_DEPTH) {
        queue.push({ url: resolved, depth: depth + 1 });
      }
    });
  }

  return allLinks;
}

async function checkLink(url, method = "HEAD") {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    let redirectCount = 0;

    const res = await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "DeMar-Monitor/1.0" },
    });

    clearTimeout(timeout);
    return { status: res.status, ok: res.ok, redirected: res.redirected };
  } catch (err) {
    return { status: 0, ok: false, error: err.message };
  }
}

export async function run() {
  const checks = [];

  const allLinks = await crawl(TARGET_URL);

  // Internal links
  const internalLinks = [...new Set(allLinks.filter((l) => l.type === "internal").map((l) => l.href))];
  const brokenInternal = [];

  for (const link of internalLinks.slice(0, MAX_URLS)) {
    const result = await checkLink(link);
    if (!result.ok) {
      const source = allLinks.find((l) => l.href === link)?.source || "unknown";
      brokenInternal.push(`${link} (${result.status || result.error}) from ${source}`);
    }
  }

  if (brokenInternal.length === 0) {
    checks.push({ name: "Internal Links", status: "pass", detail: `All ${internalLinks.length} internal links valid`, confidence: "VERIFIED", reason: null });
  } else {
    checks.push({ name: "Internal Links", status: "fail", detail: `${brokenInternal.length} broken: ${brokenInternal.slice(0, 3).join("; ")}${brokenInternal.length > 3 ? "..." : ""}`, confidence: "VERIFIED", reason: null });
  }

  // External links
  const externalLinks = [...new Set(allLinks.filter((l) => l.type === "external").map((l) => l.href))];
  const brokenExternal = [];

  for (const link of externalLinks.slice(0, MAX_URLS)) {
    const result = await checkLink(link);
    if (!result.ok) {
      // Retry with GET (some servers reject HEAD)
      const retry = await checkLink(link, "GET");
      if (!retry.ok) {
        const source = allLinks.find((l) => l.href === link)?.source || "unknown";
        brokenExternal.push(`${link} (${retry.status || retry.error})`);
      }
    }
  }

  if (brokenExternal.length === 0) {
    checks.push({ name: "External Links", status: "pass", detail: `All ${externalLinks.length} external links valid`, confidence: "VERIFIED", reason: null });
  } else {
    checks.push({ name: "External Links", status: "warn", detail: `${brokenExternal.length} unreachable: ${brokenExternal.slice(0, 3).join("; ")}${brokenExternal.length > 3 ? "..." : ""}`, confidence: "VERIFIED", reason: null });
  }

  // Anchor links
  const anchorLinks = allLinks.filter((l) => l.type === "anchor");
  if (anchorLinks.length > 0) {
    checks.push({ name: "Anchor Links", status: "pass", detail: `${anchorLinks.length} anchor links found`, confidence: "INFERRED", reason: "Anchor targets assumed present based on common SPA patterns; cheerio cannot verify in-page anchors rendered by JavaScript" });
  } else {
    checks.push({ name: "Anchor Links", status: "pass", detail: "No anchor links found", confidence: "VERIFIED", reason: null });
  }

  // Mixed content
  const mixedContent = allLinks.filter((l) => l.type === "mixed-content");
  if (mixedContent.length === 0) {
    checks.push({ name: "Mixed Content", status: "pass", detail: "No http:// links on https:// pages", confidence: "VERIFIED", reason: null });
  } else {
    const examples = mixedContent.slice(0, 3).map((l) => l.href).join("; ");
    checks.push({ name: "Mixed Content", status: "fail", detail: `${mixedContent.length} http:// links found: ${examples}`, confidence: "VERIFIED", reason: null });
  }

  return { category: "Broken Links", status: computeStatus(checks), score: computeScore(checks), checks };
}
```

- [ ] **Step 2: Test the scanner**

Run: `cd monitoring && node -e "import('./scans/links.mjs').then(m => m.run()).then(r => { console.log(r.category, r.score + '/100'); r.checks.forEach(c => console.log(c.status, c.name, '-', c.detail)); })" 2>&1`
Expected: Internal/external links checked, anchor links INFERRED, no mixed content.

- [ ] **Step 3: Commit**

```bash
git add monitoring/scans/links.mjs
git commit -m "feat: add broken link checker with full site crawl"
```

---

### Task 4: Create content freshness scanner

**Files:**
- Create: `monitoring/scans/freshness.mjs`

- [ ] **Step 1: Create the content freshness scanner**

Create `monitoring/scans/freshness.mjs`:

```js
import { fetchPage, TARGET_URL, computeStatus, computeScore } from "../lib/scanner.mjs";

const PLACEHOLDER_PATTERNS = [
  /lorem ipsum/i, /lovable/i, /example\.com/i, /your[- ]?company/i,
  /\bTODO\b/, /\bFIXME\b/, /coming soon/i, /under construction/i,
  /\[placeholder\]/i, /insert text here/i,
];

const EXPECTED_PHONE = "(775) 230-4767";
const EXPECTED_EMAIL = "info@DeMarTransportation.com";

export async function run() {
  const checks = [];

  // Fetch homepage
  const { $, html } = await fetchPage();

  // Copyright year
  const bodyText = $("body").text() + html; // Check both rendered text and raw HTML
  const copyrightMatch = bodyText.match(/©\s*(\d{4})/);
  const currentYear = new Date().getFullYear();
  if (copyrightMatch) {
    const year = parseInt(copyrightMatch[1]);
    if (year === currentYear) {
      checks.push({ name: "Copyright Year", status: "pass", detail: `© ${year}`, confidence: "VERIFIED", reason: null });
    } else {
      checks.push({ name: "Copyright Year", status: "warn", detail: `© ${year} (current year is ${currentYear})`, confidence: "VERIFIED", reason: null });
    }
  } else {
    // Check for dynamic year pattern in raw HTML
    if (html.includes("getFullYear")) {
      checks.push({ name: "Copyright Year", status: "pass", detail: "Dynamic year via getFullYear()", confidence: "INFERRED", reason: "JavaScript generates copyright year at runtime; cannot verify rendered value" });
    } else {
      checks.push({ name: "Copyright Year", status: "warn", detail: "No copyright year found", confidence: "INFERRED", reason: "Copyright text may be rendered by JavaScript at runtime" });
    }
  }

  // Placeholder text detection
  const placeholdersFound = [];
  for (const pattern of PLACEHOLDER_PATTERNS) {
    const match = html.match(pattern);
    if (match) {
      // Exclude matches inside script tags or JSON-LD
      const matchIndex = html.indexOf(match[0]);
      const precedingText = html.substring(Math.max(0, matchIndex - 100), matchIndex);
      if (!precedingText.includes("<script") && !precedingText.includes("application/ld+json")) {
        placeholdersFound.push(match[0]);
      }
    }
  }

  if (placeholdersFound.length === 0) {
    checks.push({ name: "Placeholder Text", status: "pass", detail: "No placeholder/template text detected", confidence: "INFERRED", reason: "Only checks content in initial HTML, not dynamically rendered content" });
  } else {
    checks.push({ name: "Placeholder Text", status: "fail", detail: `Found: ${[...new Set(placeholdersFound)].join(", ")}`, confidence: "VERIFIED", reason: null });
  }

  // Stale meta content
  const title = $("title").text() || "";
  const metaDesc = $('meta[name="description"]').attr("content") || "";
  const stalePatterns = [/lovable/i, /vercel/i, /next\.js app/i, /my-app/i, /untitled/i];
  const staleMeta = [];
  for (const pattern of stalePatterns) {
    if (pattern.test(title)) staleMeta.push(`title: "${title.match(pattern)[0]}"`);
    if (pattern.test(metaDesc)) staleMeta.push(`description: "${metaDesc.match(pattern)[0]}"`);
  }

  if (staleMeta.length === 0) {
    checks.push({ name: "Stale Meta Content", status: "pass", detail: "No platform/template text in title or description", confidence: "VERIFIED", reason: null });
  } else {
    checks.push({ name: "Stale Meta Content", status: "fail", detail: staleMeta.join("; "), confidence: "VERIFIED", reason: null });
  }

  // Contact info consistency
  const hasPhone = html.includes("775") && html.includes("230") && html.includes("4767");
  const hasEmail = html.toLowerCase().includes("info@demartransportation.com");

  if (hasPhone && hasEmail) {
    checks.push({ name: "Contact Info Present", status: "pass", detail: `Phone and email found in HTML`, confidence: "INFERRED", reason: "Only checks initial HTML; contact info may also be rendered by JavaScript" });
  } else if (!hasPhone && !hasEmail) {
    checks.push({ name: "Contact Info Present", status: "warn", detail: "Neither phone nor email found in initial HTML", confidence: "INFERRED", reason: "Contact info may be rendered by JavaScript at runtime" });
  } else {
    const missing = !hasPhone ? "phone" : "email";
    checks.push({ name: "Contact Info Present", status: "warn", detail: `Missing ${missing} in initial HTML`, confidence: "INFERRED", reason: "Contact info may be rendered by JavaScript at runtime" });
  }

  // 404 page exists
  try {
    const res = await fetch(`${TARGET_URL}/this-page-does-not-exist-12345`, { redirect: "follow", signal: AbortSignal.timeout(10000) });
    const text = await res.text();
    const hasCustom404 = text.length > 500 || text.includes("not found") || text.includes("404") || res.status === 404;
    if (res.status === 404) {
      checks.push({ name: "404 Page", status: "pass", detail: "Returns HTTP 404 with content", confidence: "VERIFIED", reason: null });
    } else if (res.status === 200 && hasCustom404) {
      checks.push({ name: "404 Page", status: "pass", detail: "SPA catches unknown routes (HTTP 200 with app shell)", confidence: "INFERRED", reason: "SPA returns 200 for all routes; cannot distinguish custom 404 from catch-all" });
    } else {
      checks.push({ name: "404 Page", status: "warn", detail: `Unknown URL returned HTTP ${res.status}`, confidence: "VERIFIED", reason: null });
    }
  } catch (err) {
    checks.push({ name: "404 Page", status: "warn", detail: `Could not test: ${err.message}`, confidence: "VERIFIED", reason: null });
  }

  return { category: "Content Freshness", status: computeStatus(checks), score: computeScore(checks), checks };
}
```

- [ ] **Step 2: Test the scanner**

Run: `cd monitoring && node -e "import('./scans/freshness.mjs').then(m => m.run()).then(r => { console.log(r.category, r.score + '/100'); r.checks.forEach(c => console.log(c.status, c.name, '-', c.detail)); })" 2>&1`
Expected: Copyright pass (dynamic year), no placeholders, no stale meta, contact info present, 404 page check.

- [ ] **Step 3: Commit**

```bash
git add monitoring/scans/freshness.mjs
git commit -m "feat: add content freshness scanner for stale/placeholder detection"
```

---

### Task 5: Create DNS & domain health scanner

**Files:**
- Create: `monitoring/scans/dns.mjs`
- Modify: `monitoring/package.json` (add whois dependency)

- [ ] **Step 1: Install whois dependency**

Run: `cd monitoring && npm install whois`

- [ ] **Step 2: Create the DNS scanner**

Create `monitoring/scans/dns.mjs`:

```js
import { TARGET_URL, computeStatus, computeScore } from "../lib/scanner.mjs";
import dns from "node:dns/promises";
import https from "node:https";

const GITHUB_PAGES_IPS = ["185.199.108.153", "185.199.109.153", "185.199.110.153", "185.199.111.153"];

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

async function checkWhois(domain) {
  try {
    const whois = await import("whois");
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({ name: "Domain Expiry", status: "warn", detail: "WHOIS lookup timed out (15s)", confidence: "UNABLE_TO_VERIFY", reason: "WHOIS server did not respond within timeout" });
      }, 15000);

      whois.default.lookup(domain, (err, data) => {
        clearTimeout(timeout);
        if (err || !data) {
          resolve({ name: "Domain Expiry", status: "warn", detail: `WHOIS lookup failed: ${err?.message || "no data"}`, confidence: "UNABLE_TO_VERIFY", reason: "WHOIS query failed; cannot determine domain expiry" });
          return;
        }

        // Try to parse expiry date from various formats
        const expiryPatterns = [
          /Registry Expiry Date:\s*(.+)/i,
          /Expiration Date:\s*(.+)/i,
          /Expiry Date:\s*(.+)/i,
          /paid-till:\s*(.+)/i,
          /Registrar Registration Expiration Date:\s*(.+)/i,
        ];

        let expiryStr = null;
        for (const pattern of expiryPatterns) {
          const match = data.match(pattern);
          if (match) {
            expiryStr = match[1].trim();
            break;
          }
        }

        if (!expiryStr) {
          resolve({ name: "Domain Expiry", status: "warn", detail: "Could not parse expiry date from WHOIS", confidence: "UNABLE_TO_VERIFY", reason: "WHOIS response format not recognized for this registrar" });
          return;
        }

        const expiryDate = new Date(expiryStr);
        if (isNaN(expiryDate.getTime())) {
          resolve({ name: "Domain Expiry", status: "warn", detail: `Unparseable date: ${expiryStr}`, confidence: "UNABLE_TO_VERIFY", reason: "WHOIS date format could not be parsed" });
          return;
        }

        const daysLeft = Math.floor((expiryDate - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysLeft < 30) {
          resolve({ name: "Domain Expiry", status: "fail", detail: `Domain expires in ${daysLeft} days (${expiryDate.toISOString().split("T")[0]})`, confidence: "INFERRED", reason: "WHOIS data parsed from raw text; format varies by registrar" });
        } else if (daysLeft < 60) {
          resolve({ name: "Domain Expiry", status: "warn", detail: `Domain expires in ${daysLeft} days (${expiryDate.toISOString().split("T")[0]})`, confidence: "INFERRED", reason: "WHOIS data parsed from raw text; format varies by registrar" });
        } else {
          resolve({ name: "Domain Expiry", status: "pass", detail: `Domain valid for ${daysLeft} days (expires ${expiryDate.toISOString().split("T")[0]})`, confidence: "INFERRED", reason: "WHOIS data parsed from raw text; format varies by registrar" });
        }
      });
    });
  } catch {
    return { name: "Domain Expiry", status: "warn", detail: "whois module not available", confidence: "UNABLE_TO_VERIFY", reason: "whois npm package not installed or not loadable" };
  }
}

export async function run() {
  const checks = [];
  const hostname = new URL(TARGET_URL).hostname;

  // SSL certificate
  const sslCheck = await checkSSL(hostname);
  checks.push(sslCheck);

  // Domain expiry
  const whoisCheck = await checkWhois(hostname);
  checks.push(whoisCheck);

  // DNS resolution
  try {
    const addresses = await dns.resolve4(hostname);
    const matchesGitHub = addresses.some((ip) => GITHUB_PAGES_IPS.includes(ip));
    if (matchesGitHub) {
      checks.push({ name: "DNS Resolution", status: "pass", detail: `Resolves to GitHub Pages: ${addresses.join(", ")}`, confidence: "VERIFIED", reason: null });
    } else {
      checks.push({ name: "DNS Resolution", status: "warn", detail: `Resolves to ${addresses.join(", ")} (not GitHub Pages IPs)`, confidence: "VERIFIED", reason: null });
    }
  } catch (err) {
    checks.push({ name: "DNS Resolution", status: "fail", detail: `DNS resolution failed: ${err.message}`, confidence: "VERIFIED", reason: null });
  }

  // CNAME check
  try {
    const cnames = await dns.resolveCname(hostname);
    const githubCname = cnames.some((c) => c.includes("github.io"));
    if (githubCname) {
      checks.push({ name: "CNAME Configuration", status: "pass", detail: `CNAME: ${cnames.join(", ")}`, confidence: "VERIFIED", reason: null });
    } else {
      checks.push({ name: "CNAME Configuration", status: "warn", detail: `CNAME: ${cnames.join(", ")} (expected *.github.io)`, confidence: "VERIFIED", reason: null });
    }
  } catch {
    // No CNAME means using A records (apex domain) — check if A records are correct
    checks.push({ name: "CNAME Configuration", status: "pass", detail: "No CNAME (using A records for apex domain)", confidence: "VERIFIED", reason: null });
  }

  // www redirect
  try {
    const wwwRes = await fetch(`https://www.${hostname}`, { redirect: "manual", signal: AbortSignal.timeout(10000) });
    const location = wwwRes.headers.get("location") || "";
    if (wwwRes.status >= 300 && wwwRes.status < 400 && location.includes(hostname)) {
      checks.push({ name: "www Redirect", status: "pass", detail: `www.${hostname} redirects to ${location}`, confidence: "VERIFIED", reason: null });
    } else if (wwwRes.ok) {
      checks.push({ name: "www Redirect", status: "pass", detail: `www.${hostname} resolves (HTTP ${wwwRes.status})`, confidence: "VERIFIED", reason: null });
    } else {
      checks.push({ name: "www Redirect", status: "warn", detail: `www.${hostname} returned HTTP ${wwwRes.status}`, confidence: "VERIFIED", reason: null });
    }
  } catch {
    checks.push({ name: "www Redirect", status: "warn", detail: `www.${hostname} not reachable`, confidence: "VERIFIED", reason: null });
  }

  return { category: "DNS & Domain", status: computeStatus(checks), score: computeScore(checks), checks };
}
```

- [ ] **Step 3: Test the scanner**

Run: `cd monitoring && node -e "import('./scans/dns.mjs').then(m => m.run()).then(r => { console.log(r.category, r.score + '/100'); r.checks.forEach(c => console.log(c.status, c.name, '-', c.detail)); })" 2>&1`
Expected: SSL pass, domain expiry (may be INFERRED or UNABLE_TO_VERIFY), DNS resolves to GitHub Pages, CNAME or A records configured, www redirect check.

- [ ] **Step 4: Commit**

```bash
git add monitoring/scans/dns.mjs monitoring/package.json monitoring/package-lock.json
git commit -m "feat: add DNS & domain health scanner with SSL, WHOIS, and DNS checks"
```

---

### Task 6: Register new scanners in orchestrator

**Files:**
- Modify: `monitoring/run-scans.mjs`
- Modify: `monitoring/package.json`

- [ ] **Step 1: Update SCAN_MODULES, LIGHTWEIGHT_SCANS, and FULL_SCANS**

In `monitoring/run-scans.mjs`, replace the constants at the top (lines 4-14):

```js
const LIGHTWEIGHT_SCANS = ["security", "dependencies", "freshness", "dns"];
const FULL_SCANS = [
  "security", "dependencies", "seo", "performance", "images", "accessibility",
  "schema", "social-preview", "links", "freshness", "dns",
];

const SCAN_MODULES = {
  security: "./scans/security.mjs",
  dependencies: "./scans/dependencies.mjs",
  seo: "./scans/seo.mjs",
  performance: "./scans/performance.mjs",
  images: "./scans/images.mjs",
  accessibility: "./scans/accessibility.mjs",
  schema: "./scans/schema.mjs",
  "social-preview": "./scans/social-preview.mjs",
  links: "./scans/links.mjs",
  freshness: "./scans/freshness.mjs",
  dns: "./scans/dns.mjs",
};
```

- [ ] **Step 2: Add npm scripts for new scanners**

In `monitoring/package.json`, add these scripts:

```json
"scan:schema": "node run-scans.mjs --scan schema",
"scan:social": "node run-scans.mjs --scan social-preview",
"scan:links": "node run-scans.mjs --scan links",
"scan:fresh": "node run-scans.mjs --scan freshness",
"scan:dns": "node run-scans.mjs --scan dns"
```

- [ ] **Step 3: Run a full scan to verify all 11 scanners**

Run: `cd monitoring && node run-scans.mjs --type full 2>&1`
Expected: All 11 scanners run and post to Discord. No errors.

- [ ] **Step 4: Run a lightweight scan to verify the 4 lightweight scanners**

Run: `cd monitoring && node run-scans.mjs --type lightweight 2>&1`
Expected: security, dependencies, freshness, dns run. No errors.

- [ ] **Step 5: Commit**

```bash
git add monitoring/run-scans.mjs monitoring/package.json
git commit -m "feat: register 5 new scanners in orchestrator, update scan groups"
```

---

### Task 7: End-to-end verification and Discord summary

**Files:** None (verification only)

- [ ] **Step 1: Run full scan and verify Discord output**

Run: `cd monitoring && node run-scans.mjs --type full 2>&1`
Expected: All 11 scanners complete. Discord shows results for all categories with confidence indicators.

- [ ] **Step 2: Verify individual new scanners**

Run each one individually to confirm they work in isolation:
```
cd monitoring && node run-scans.mjs --scan schema 2>&1
cd monitoring && node run-scans.mjs --scan social-preview 2>&1
cd monitoring && node run-scans.mjs --scan links 2>&1
cd monitoring && node run-scans.mjs --scan freshness 2>&1
cd monitoring && node run-scans.mjs --scan dns 2>&1
```
Expected: Each runs independently and posts to Discord.

- [ ] **Step 3: Commit any fixes if needed**

If issues found during verification:
```bash
git add -A monitoring/
git commit -m "fix: resolve issues found during new scanner verification"
```
