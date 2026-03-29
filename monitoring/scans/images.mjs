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
    checks.push({ name: "Images Found", status: "warn", detail: "No images detected on page", confidence: "INFERRED", reason: "Only checks images in initial HTML; dynamically loaded images are not detected" });
  } else {
    // Modern formats
    const modernPct = Math.round((modernFormat / totalImages) * 100);
    if (modernPct >= 80) {
      checks.push({ name: "Modern Image Formats", status: "pass", detail: `${modernPct}% using WebP/AVIF (${modernFormat}/${totalImages})`, confidence: "INFERRED", reason: "Only checks images in initial HTML, not dynamically loaded images" });
    } else if (modernPct >= 40) {
      checks.push({ name: "Modern Image Formats", status: "warn", detail: `${modernPct}% using WebP/AVIF (${modernFormat}/${totalImages})`, confidence: "INFERRED", reason: "Only checks images in initial HTML, not dynamically loaded images" });
    } else {
      checks.push({ name: "Modern Image Formats", status: "fail", detail: `Only ${modernPct}% using WebP/AVIF (${modernFormat}/${totalImages})`, confidence: "INFERRED", reason: "Only checks images in initial HTML, not dynamically loaded images" });
    }

    // Alt text
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

    // Lazy loading
    const lazyPct = Math.round((lazyLoaded / totalImages) * 100);
    if (lazyPct >= 60) {
      checks.push({ name: "Lazy Loading", status: "pass", detail: `${lazyPct}% of images use loading="lazy" (${lazyLoaded}/${totalImages})`, confidence: "INFERRED", reason: "Only checks images in initial HTML, not dynamically loaded images" });
    } else {
      checks.push({ name: "Lazy Loading", status: "warn", detail: `Only ${lazyPct}% use loading="lazy" (${lazyLoaded}/${totalImages})`, confidence: "INFERRED", reason: "Only checks images in initial HTML, not dynamically loaded images" });
    }
  }

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
    checks.push({ name: "Copyright Year", status: "warn", detail: "No copyright year found", confidence: "INFERRED", reason: "Copyright text may be rendered by JavaScript at runtime" });
  }

  return {
    category: "Images & Content",
    status: computeStatus(checks),
    score: computeScore(checks),
    checks,
  };
}
