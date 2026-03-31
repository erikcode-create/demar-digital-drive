/**
 * Site Auditor Agent
 *
 * Reads TSX source files directly (no HTTP crawling) and audits each page for
 * SEO health: title tag, meta description, heading structure, image alt text,
 * internal links, and word count.
 *
 * Ported from: monitoring/seo/dashboard/site-audit-dashboard.mjs
 */

export const name = "site-auditor";
export const category = "analysis";
export const description = "Audit all pages for SEO health by reading source TSX files";

function auditPage(page) {
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

  // Title tag
  const title = page.metaTitle || "";
  const titleLen = title.length;
  check("Title exists", titleLen > 0, "Missing title tag");
  if (titleLen > 0) {
    check(
      "Title length",
      titleLen >= 50 && titleLen <= 60,
      `Title length ${titleLen} chars (ideal: 50-60)`
    );
  }

  // Meta description
  const desc = page.metaDescription || "";
  const descLen = desc.length;
  check("Meta description exists", descLen > 0, "Missing meta description");
  if (descLen > 0) {
    check(
      "Meta description length",
      descLen >= 150 && descLen <= 160,
      `Meta description length ${descLen} chars (ideal: 150-160)`
    );
  }

  // H1 count
  const h1Count = page.headings?.h1?.length || 0;
  check("H1 exists", h1Count >= 1, "Missing H1 tag");
  if (h1Count > 0) {
    check("Single H1", h1Count === 1, `${h1Count} H1 tags found (should be 1)`);
  }

  // Image alt text coverage
  const images = page.images || [];
  const totalImages = images.length;
  const missingAlt = images.filter((img) => !img.alt || img.alt.trim().length === 0).length;
  if (totalImages > 0) {
    check(
      "Image alt text",
      missingAlt === 0,
      `${missingAlt}/${totalImages} image${missingAlt === 1 ? "" : "s"} missing alt text`
    );
  }

  // Internal link count
  const linkCount = page.internalLinks?.length || 0;
  check("Internal links", linkCount > 0, "No internal links found");

  // Word count (min 300 for content pages)
  const wordCount = page.wordCount || 0;
  const isContentPage = ["service", "resource", "blog"].includes(page.type);
  if (isContentPage) {
    check(
      "Word count",
      wordCount >= 300,
      `Word count ${wordCount} (min 300 for content pages)`
    );
  }

  // JSON-LD schema presence (check raw source)
  const hasSchema = page.rawSource?.includes("application/ld+json") || false;
  check("Schema.org JSON-LD", hasSchema, "Missing JSON-LD schema");

  return {
    page: page.name,
    path: page.path,
    type: page.type,
    checks,
    issues,
    internalLinkCount: linkCount,
    wordCount,
    titleLen,
    descLen,
    h1Count,
    imageCount: totalImages,
    missingAltCount: missingAlt,
  };
}

function buildDiscordEmbed(score, allIssues, pageResults) {
  const MAX_ISSUES = 15;

  let color;
  if (score >= 90) color = 3066993;
  else if (score >= 70) color = 16776960;
  else color = 15158332;

  let description = `**Overall Health Score: ${score}/100**\n`;
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

export async function run(context) {
  console.log("Starting site auditor agent...");

  const pages = context.source.readAllPages();
  console.log(`Auditing ${pages.length} pages from source files...`);

  if (pages.length === 0) {
    return { success: false, summary: "No pages found to audit", data: null };
  }

  const pageResults = pages.map((page) => auditPage(page));

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
  console.log(`Audit complete. Score: ${score}/100 (${totalPassed}/${totalChecks} checks passed)`);

  // Build state data
  const data = {
    score,
    totalChecks,
    totalPassed,
    issueCount: allIssues.length,
    pages: pageResults.map((r) => ({
      name: r.page,
      path: r.path,
      type: r.type,
      passed: r.checks.passed,
      total: r.checks.total,
      issues: r.issues.map((i) => i.issue),
      internalLinks: r.internalLinkCount,
      wordCount: r.wordCount,
      titleLen: r.titleLen,
      descLen: r.descLen,
      h1Count: r.h1Count,
      imageCount: r.imageCount,
      missingAltCount: r.missingAltCount,
    })),
    timestamp: new Date().toISOString(),
  };

  // Write to shared state
  context.state.write("analysis", "site-audit", data);

  // Post Discord embed
  if (!context.config.dryRun) {
    const embed = buildDiscordEmbed(score, allIssues, pageResults);
    const dateStr = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    await context.discord.post("seo-dashboard", {
      content: `**Site Audit Dashboard -- ${dateStr}**`,
      embeds: [embed],
    });
    console.log("Posted audit results to Discord #seo-dashboard channel.");
  }

  return {
    success: true,
    summary: `Score ${score}/100 across ${pages.length} pages (${allIssues.length} issues)`,
    data,
  };
}
