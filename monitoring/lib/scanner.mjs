import * as cheerio from "cheerio";

const TARGET_URL = "https://demartransportation.com";

export { TARGET_URL };

export const SCANNER_HEADERS = {
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.9",
  "user-agent": "DeMarScanner/1.0 (+https://demartransportation.com)",
};

export function scannerFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...SCANNER_HEADERS,
      ...(options.headers || {}),
    },
  });
}

export async function fetchHeaders(url = TARGET_URL) {
  const res = await scannerFetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000) });
  const bodySnippet = await res.clone().text().then((body) => body.slice(0, 2000)).catch(() => "");
  return {
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    redirected: res.redirected,
    url: res.url,
    bodySnippet,
  };
}

export async function fetchPage(url = TARGET_URL) {
  const res = await scannerFetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000) });
  const html = await res.text();
  const $ = cheerio.load(html);
  return { $, html, status: res.status, url: res.url };
}

export async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  return res.json();
}

export function computeStatus(checks) {
  const scorable = checks.filter((c) => c.confidence !== "UNABLE_TO_VERIFY");
  if (scorable.some((c) => c.status === "fail")) return "fail";
  if (scorable.some((c) => c.status === "warn")) return "warn";
  return "pass";
}

export function computeScore(checks) {
  const scorable = checks.filter((c) => c.confidence !== "UNABLE_TO_VERIFY");
  if (scorable.length === 0) return 100;
  const passCount = scorable.filter((c) => c.status === "pass").length;
  return Math.round((passCount / scorable.length) * 100);
}

export function computeVerifiedCount(checks) {
  return checks.filter((c) => c.confidence !== "UNABLE_TO_VERIFY").length;
}
