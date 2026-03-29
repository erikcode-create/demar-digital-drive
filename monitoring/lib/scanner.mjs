import * as cheerio from "cheerio";

const TARGET_URL = "https://demartransportation.com";

export { TARGET_URL };

export async function fetchHeaders(url = TARGET_URL) {
  const res = await fetch(url, { redirect: "follow" });
  return {
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    redirected: res.redirected,
    url: res.url,
  };
}

export async function fetchPage(url = TARGET_URL) {
  const res = await fetch(url, { redirect: "follow" });
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
  if (checks.some((c) => c.status === "fail")) return "fail";
  if (checks.some((c) => c.status === "warn")) return "warn";
  return "pass";
}

export function computeScore(checks) {
  if (checks.length === 0) return 100;
  const passCount = checks.filter((c) => c.status === "pass").length;
  return Math.round((passCount / checks.length) * 100);
}
