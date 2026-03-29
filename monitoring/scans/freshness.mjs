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

  const { $, html } = await fetchPage();

  // Copyright year
  const bodyText = $("body").text() + html;
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
    // Check raw HTML first, then check JS bundles for dynamic copyright
    let foundInBundle = html.includes("getFullYear");
    if (!foundInBundle) {
      const scripts = $('script[src]').toArray().map((el) => $(el).attr("src")).filter(Boolean);
      for (const src of scripts) {
        try {
          const scriptUrl = new URL(src, TARGET_URL).href;
          const res = await fetch(scriptUrl, { signal: AbortSignal.timeout(10000) });
          if (res.ok) {
            const js = await res.text();
            if (js.includes("getFullYear")) {
              foundInBundle = true;
              break;
            }
          }
        } catch { /* skip unreachable scripts */ }
      }
    }
    if (foundInBundle) {
      checks.push({ name: "Copyright Year", status: "pass", detail: "Dynamic year via getFullYear()", confidence: "INFERRED", reason: "Found getFullYear() in JS bundle; copyright year generated at runtime" });
    } else {
      checks.push({ name: "Copyright Year", status: "warn", detail: "No copyright year found in HTML or JS bundles", confidence: "UNABLE_TO_VERIFY", reason: "SPA may render copyright via framework not detectable by static analysis" });
    }
  }

  // Placeholder text detection
  const placeholdersFound = [];
  for (const pattern of PLACEHOLDER_PATTERNS) {
    const match = html.match(pattern);
    if (match) {
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
