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
