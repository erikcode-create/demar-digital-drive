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
