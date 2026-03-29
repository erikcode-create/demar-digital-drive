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
