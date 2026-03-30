import "dotenv/config";
import * as cheerio from "cheerio";
import { postToChannel } from "../../lib/discord.mjs";
import { getAllPages, SITE_URL } from "../lib/pages.mjs";
import { saveDaily, loadPrevious, formatDelta } from "../lib/history.mjs";

const CONCURRENCY = 3;

async function fetchPage(url) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(15000),
    headers: { "User-Agent": "DeMar-SiteAudit/1.0" },
  });
  const html = await res.text();
  return { status: res.status, html };
}

function auditPage(page, status, $) {
  const issues = [];
  const checks = { total: 0, passed: 0 };

  function check(name, pass, issue) {
    checks.total++;
    if (pass) {
      checks.passed++;
    } else {
      issues.push({ page: page.name, path: page.path, issue: issue || name });
    }
  }

  // HTTP status
  check("HTTP Status", status === 200, `HTTP ${status}`);

  // Title tag
  const title = $("title").text().trim();
  const titleExists = title.length > 0;
  const titleLen = title.length;
  check("Title exists", titleExists, "Missing title tag");
  if (titleExists) {
    check(
      "Title length",
      titleLen >= 30 && titleLen <= 60,
      `Title length ${titleLen} chars (ideal: 30-60)`
    );
  }

  // Meta description
  const metaDesc = $('meta[name="description"]').attr("content") || "";
  const descExists = metaDesc.trim().length > 0;
  const descLen = metaDesc.trim().length;
  check("Meta description exists", descExists, "Missing meta description");
  if (descExists) {
    check(
      "Meta description length",
      descLen >= 120 && descLen <= 160,
      `Meta description length ${descLen} chars (ideal: 120-160)`
    );
  }

  // H1
  const h1Count = $("h1").length;
  check("H1 exists", h1Count >= 1, "Missing H1 tag");
  if (h1Count > 0) {
    check("Single H1", h1Count === 1, `${h1Count} H1 tags found (should be 1)`);
  }

  // Image alt text
  const images = $("img");
  let missingAlt = 0;
  images.each((_, el) => {
    const alt = $(el).attr("alt");
    if (!alt || alt.trim().length === 0) missingAlt++;
  });
  check(
    "Image alt text",
    missingAlt === 0,
    `${missingAlt} image${missingAlt === 1 ? "" : "s"} missing alt text`
  );

  // Canonical
  const canonical = $('link[rel="canonical"]').attr("href");
  check("Canonical tag", !!canonical, "Missing canonical tag");

  // JSON-LD schema
  const jsonLd = $('script[type="application/ld+json"]');
  check("Schema.org JSON-LD", jsonLd.length > 0, "Missing JSON-LD schema");

  // Open Graph tags
  const ogTitle = $('meta[property="og:title"]').attr("content");
  const ogDesc = $('meta[property="og:description"]').attr("content");
  const ogImage = $('meta[property="og:image"]').attr("content");
  check("og:title", !!ogTitle, "Missing og:title");
  check("og:description", !!ogDesc, "Missing og:description");
  check("og:image", !!ogImage, "Missing og:image");

  // Internal links
  const internalLinks = $("a[href]").filter((_, el) => {
    const href = $(el).attr("href") || "";
    return (
      href.startsWith("/") ||
      href.startsWith(SITE_URL) ||
      href.includes("demartransportation.com")
    );
  });
  check(
    "Internal links",
    internalLinks.length > 0,
    "No internal links found"
  );

  return {
    page: page.name,
    path: page.path,
    type: page.type,
    status,
    checks,
    issues,
    internalLinkCount: internalLinks.length,
  };
}

async function processInBatches(pages, batchSize) {
  const results = [];

  for (let i = 0; i < pages.length; i += batchSize) {
    const batch = pages.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (page) => {
        try {
          const { status, html } = await fetchPage(page.url);
          const $ = cheerio.load(html);
          return auditPage(page, status, $);
        } catch (err) {
          console.error(`  Error fetching ${page.url}: ${err.message}`);
          return {
            page: page.name,
            path: page.path,
            type: page.type,
            status: 0,
            checks: { total: 1, passed: 0 },
            issues: [{ page: page.name, path: page.path, issue: `Fetch failed: ${err.message}` }],
            internalLinkCount: 0,
          };
        }
      })
    );
    results.push(...batchResults);
  }

  return results;
}

function buildDiscordEmbeds(score, prevScore, allIssues, pageResults) {
  const MAX_ISSUES = 15;

  let color;
  if (score >= 90) color = 3066993;
  else if (score >= 70) color = 16776960;
  else color = 15158332;

  let trendStr = "";
  if (prevScore !== null && prevScore !== undefined) {
    trendStr = ` ${formatDelta(score - prevScore)}`;
  }

  let description = `**Overall Health Score: ${score}%${trendStr}**\n`;
  description += `${pageResults.length} pages audited\n\n`;

  if (allIssues.length > 0) {
    description += "**Top Issues:**\n";
    const displayed = allIssues.slice(0, MAX_ISSUES);
    for (const issue of displayed) {
      description += `- \`${issue.path}\` ${issue.issue}\n`;
    }
    const remaining = allIssues.length - displayed.length;
    if (remaining > 0) {
      description += `\n*...and ${remaining} more issue${remaining === 1 ? "" : "s"} across other pages.*\n`;
    }
  } else {
    description += "All checks passing across every page.\n";
  }

  if (description.length > 4000) {
    description = description.substring(0, 3997) + "...";
  }

  return {
    title: "Site Audit Dashboard",
    description: description.trim(),
    color,
    timestamp: new Date().toISOString(),
  };
}

async function run() {
  console.log("Starting site audit dashboard...");
  const pages = getAllPages();
  console.log(`Auditing ${pages.length} pages (concurrency: ${CONCURRENCY})...`);

  const pageResults = await processInBatches(pages, CONCURRENCY);

  // Compute overall score
  let totalChecks = 0;
  let totalPassed = 0;
  const allIssues = [];

  for (const result of pageResults) {
    totalChecks += result.checks.total;
    totalPassed += result.checks.passed;
    allIssues.push(...result.issues);
  }

  const score = totalChecks > 0 ? Math.round((totalPassed / totalChecks) * 100) : 0;
  console.log(`Audit complete. Score: ${score}% (${totalPassed}/${totalChecks} checks passed)`);

  // Save and load history
  const auditData = {
    score,
    pages: pageResults.map((r) => ({
      name: r.page,
      path: r.path,
      type: r.type,
      status: r.status,
      passed: r.checks.passed,
      total: r.checks.total,
      issues: r.issues.map((i) => i.issue),
      internalLinks: r.internalLinkCount,
    })),
    timestamp: new Date().toISOString(),
  };

  await saveDaily("audits", auditData);
  const previous = await loadPrevious("audits");
  const prevScore = previous ? previous.score : null;

  // Build and post Discord embed
  const embed = buildDiscordEmbeds(score, prevScore, allIssues, pageResults);
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  await postToChannel("seo", {
    content: `**Site Audit Dashboard -- ${dateStr}**`,
    embeds: [embed],
  });

  console.log("Posted audit results to Discord #seo channel.");
}

run().catch(console.error);
