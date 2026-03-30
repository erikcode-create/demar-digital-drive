import "dotenv/config";

const SERPER_API_URL = "https://google.serper.dev/search";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getApiKey() {
  const key = process.env.SERPER_API_KEY;
  if (!key) throw new Error("SERPER_API_KEY environment variable is not set");
  return key;
}

/**
 * Check the Google ranking for a keyword and domain.
 * Returns { keyword, rank, url, features }.
 * rank is 1-based position or null if not found in top 100.
 */
export async function checkRank(keyword, domain = "demartransportation.com") {
  const apiKey = getApiKey();

  const response = await fetch(SERPER_API_URL, {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: keyword, num: 100 }),
  });

  if (!response.ok) {
    throw new Error(`Serper API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Detect SERP features
  const features = [];
  if (data.answerBox) features.push("featured_snippet");
  if (data.peopleAlsoAsk?.length) features.push("people_also_ask");
  if (data.localResults?.places?.length || data.places?.length) features.push("local_pack");
  if (data.knowledgeGraph) features.push("knowledge_graph");
  if (data.images?.length) features.push("image_pack");
  if (data.videos?.length) features.push("video_carousel");
  if (data.topStories?.length) features.push("top_stories");
  if (data.relatedSearches?.length) features.push("related_searches");
  if (data.sitelinks) features.push("sitelinks");

  // Find domain in organic results
  const organic = data.organic || [];
  for (let i = 0; i < organic.length; i++) {
    const result = organic[i];
    try {
      const resultDomain = new URL(result.link).hostname.replace(/^www\./, "");
      if (resultDomain === domain || resultDomain.endsWith(`.${domain}`)) {
        return {
          keyword,
          rank: i + 1,
          url: result.link,
          features,
        };
      }
    } catch {
      // skip malformed URLs
    }
  }

  return { keyword, rank: null, url: null, features };
}

/**
 * Batch check rankings for multiple keywords.
 * 1 second delay between requests for rate limiting.
 */
export async function checkRanks(keywords, domain = "demartransportation.com") {
  const results = [];
  for (let i = 0; i < keywords.length; i++) {
    if (i > 0) await sleep(1000);
    const result = await checkRank(keywords[i], domain);
    results.push(result);
  }
  return results;
}

/**
 * For each keyword, collect all domains appearing in the top 20 results.
 * Returns an array of { domain, count } sorted by frequency descending.
 */
export async function getCompetitorDomains(keywords, domain = "demartransportation.com") {
  const apiKey = getApiKey();
  const domainCounts = {};

  for (let i = 0; i < keywords.length; i++) {
    if (i > 0) await sleep(1000);

    const response = await fetch(SERPER_API_URL, {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: keywords[i], num: 20 }),
    });

    if (!response.ok) continue;

    const data = await response.json();
    const organic = data.organic || [];

    for (const result of organic) {
      try {
        const resultDomain = new URL(result.link).hostname.replace(/^www\./, "");
        if (resultDomain !== domain && !resultDomain.endsWith(`.${domain}`)) {
          domainCounts[resultDomain] = (domainCounts[resultDomain] || 0) + 1;
        }
      } catch {
        // skip malformed URLs
      }
    }
  }

  return Object.entries(domainCounts)
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count);
}
