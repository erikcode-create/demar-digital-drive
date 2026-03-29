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
