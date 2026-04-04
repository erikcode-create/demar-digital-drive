/**
 * Competitor Fetcher Module
 *
 * Provides context to the reviewer agent by:
 *   1. Fetching the live DeMar page for a given URL path
 *   2. Scraping top SERP competitor pages for a given keyword
 */

import * as cheerio from "cheerio";

const DEMAR_BASE_URL = "https://demartransportation.com";
const DEMAR_HOSTNAME = "demartransportation.com";
const SERPER_API_URL = "https://google.serper.dev/search";
const USER_AGENT = "DeMar-ReviewBot/1.0";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Strip script and style tags from a cheerio root, then extract body text.
 * Splits on whitespace to count words.
 */
function extractWordCount($) {
  $("script, style").remove();
  const text = ($("body").text() || $.root().text()).replace(/\s+/g, " ").trim();
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Extract h1/h2/h3 headings from a parsed cheerio document.
 * Returns a flat array of { tag, text } objects.
 */
function extractHeadings($) {
  const headings = [];
  $("h1, h2, h3").each((_, el) => {
    const tag = el.tagName.toLowerCase();
    const text = $(el).text().replace(/\s+/g, " ").trim();
    if (text) headings.push({ tag, text });
  });
  return headings;
}

// ---------------------------------------------------------------------------
// fetchLivePage
// ---------------------------------------------------------------------------

/**
 * Fetches https://demartransportation.com{urlPath}, parses with cheerio,
 * and returns structured page data.
 *
 * @param {string} urlPath - e.g. "/services/ltl-freight"
 * @returns {Promise<{ title: string, description: string, headings: Array<{tag:string,text:string}>, wordCount: number, html: string } | null>}
 */
export async function fetchLivePage(urlPath) {
  const url = `${DEMAR_BASE_URL}${urlPath}`;
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $("title").first().text().trim() || "";
    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "";
    const headings = extractHeadings($);
    const wordCount = extractWordCount($);

    return { title, description, headings, wordCount, html };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// fetchCompetitorPages
// ---------------------------------------------------------------------------

/**
 * Searches Serper for the given keyword, filters out DeMar results,
 * scrapes the top `limit` competitor pages, and returns structured data.
 *
 * @param {string} keyword
 * @param {number} limit - max number of competitor pages to return (default 3)
 * @returns {Promise<Array<{ title: string, url: string, description: string, headings: Array<{tag:string,text:string}>, wordCount: number }>>}
 */
export async function fetchCompetitorPages(keyword, limit = 3) {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    return [];
  }

  // --- Step 1: Get SERP results ---
  let organicResults = [];
  try {
    const serperResponse = await fetch(SERPER_API_URL, {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: keyword, num: 10 }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!serperResponse.ok) {
      return [];
    }

    const data = await serperResponse.json();
    organicResults = data.organic || [];
  } catch {
    return [];
  }

  // --- Step 2: Filter out DeMar results ---
  const competitorUrls = [];
  for (const result of organicResults) {
    if (competitorUrls.length >= limit) break;
    try {
      const hostname = new URL(result.link).hostname.replace(/^www\./, "");
      if (hostname !== DEMAR_HOSTNAME && !hostname.endsWith(`.${DEMAR_HOSTNAME}`)) {
        competitorUrls.push({ url: result.link, snippet: result.snippet || "" });
      }
    } catch {
      // skip malformed URLs
    }
  }

  // --- Step 3: Scrape each competitor page ---
  const results = [];
  for (const { url, snippet } of competitorUrls) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(8_000),
      });

      if (!response.ok) {
        // Fall back to SERP snippet data only
        results.push({
          title: "",
          url,
          description: snippet,
          headings: [],
          wordCount: 0,
        });
        continue;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const title = $("title").first().text().trim() || "";
      const description =
        $('meta[name="description"]').attr("content") ||
        $('meta[property="og:description"]').attr("content") ||
        snippet;
      const headings = extractHeadings($);
      const wordCount = extractWordCount($);

      results.push({ title, url, description, headings, wordCount });
    } catch {
      // Graceful fallback — include the URL with empty/snippet data
      results.push({
        title: "",
        url,
        description: snippet,
        headings: [],
        wordCount: 0,
      });
    }
  }

  return results;
}
