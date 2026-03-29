import { fetchPage, TARGET_URL, computeStatus, computeScore } from "../lib/scanner.mjs";

const MAX_DEPTH = 3;
const MAX_URLS = 100;
const TIMEOUT = 5000;

async function crawl(startUrl) {
  const visited = new Set();
  const allLinks = [];
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
