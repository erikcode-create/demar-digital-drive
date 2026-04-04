/**
 * Research Agent Module
 *
 * Gathers web research context before action agents generate content.
 * Research is fed to both the writer and reviewer agents.
 *
 * Exports:
 *   runResearch({ actionType, targetKeyword, targetPage }) -> ResearchResult
 *   formatResearchContext(research) -> string (markdown)
 */

import { fetchCompetitorPages, fetchLivePage } from "../review/competitor-fetcher.mjs";
import { generateWithClaude } from "../../marketing/lib/claude-api.mjs";

const SERPER_API_URL = "https://google.serper.dev/search";

// ---------------------------------------------------------------------------
// Types (JSDoc)
// ---------------------------------------------------------------------------

/**
 * @typedef {{ title: string, url: string, description: string }} SerpResult
 *
 * @typedef {{
 *   keyword: string,
 *   serp: { topResults: SerpResult[], peopleAlsoAsk: string[] },
 *   competitorAnalysis: {
 *     avgWordCount: number,
 *     commonHeadings: string[],
 *     topicsCovered: string[],
 *     missingFromOurs: string[]
 *   },
 *   currentLivePage: { title: string, description: string, wordCount: number, headings: Array<{tag:string,text:string}> } | null,
 *   factSources: Array<{ claim: string, source: string, date: string }>
 * }} ResearchResult
 */

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Build the empty/default shape so callers always get a full object.
 * @param {string} keyword
 * @returns {ResearchResult}
 */
function emptyResult(keyword) {
  return {
    keyword,
    serp: { topResults: [], peopleAlsoAsk: [] },
    competitorAnalysis: {
      avgWordCount: 0,
      commonHeadings: [],
      topicsCovered: [],
      missingFromOurs: [],
    },
    currentLivePage: null,
    factSources: [],
  };
}

/**
 * Fetch "People Also Ask" questions from Serper for a given keyword.
 * Returns an empty array when SERPER_API_KEY is absent or the call fails.
 *
 * @param {string} keyword
 * @returns {Promise<string[]>}
 */
async function fetchPeopleAlsoAsk(keyword) {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(SERPER_API_URL, {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: keyword, num: 10 }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) return [];

    const data = await response.json();
    const paa = data.peopleAlsoAsk || [];
    return paa.map((item) => item.question || "").filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Fetch top SERP organic results (title, url, description) for a keyword.
 * Returns empty array when SERPER_API_KEY is absent or the call fails.
 *
 * @param {string} keyword
 * @returns {Promise<SerpResult[]>}
 */
async function fetchSerpTopResults(keyword) {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(SERPER_API_URL, {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: keyword, num: 10 }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) return [];

    const data = await response.json();
    const organic = data.organic || [];
    return organic.slice(0, 5).map((item) => ({
      title: item.title || "",
      url: item.link || "",
      description: item.snippet || "",
    }));
  } catch {
    return [];
  }
}

/**
 * Use Claude to synthesize competitor data into topics, gaps, and fact sources.
 *
 * @param {string} keyword
 * @param {Array<{ title: string, url: string, description: string, headings: Array<{tag:string,text:string}>, wordCount: number }>} competitors
 * @param {{ title: string, description: string, wordCount: number, headings: Array<{tag:string,text:string}> } | null} currentPage
 * @returns {Promise<{ commonHeadings: string[], topicsCovered: string[], missingFromOurs: string[], factSources: Array<{ claim: string, source: string, date: string }> }>}
 */
async function synthesizeWithClaude(keyword, competitors, currentPage) {
  const competitorSummary = competitors
    .map((c, i) => {
      const headingText = c.headings.map((h) => h.text).join(", ");
      return `Competitor ${i + 1}: "${c.title}" (${c.url})\n  Word count: ${c.wordCount}\n  Key headings: ${headingText || "none"}\n  Description: ${c.description}`;
    })
    .join("\n\n");

  const currentPageSummary = currentPage
    ? `Current DeMar page:\n  Title: ${currentPage.title}\n  Word count: ${currentPage.wordCount}\n  Headings: ${currentPage.headings.map((h) => h.text).join(", ")}\n  Description: ${currentPage.description}`
    : "Current DeMar page: not available";

  const prompt = `You are a competitive content analyst. Analyze the following competitor pages for the keyword "${keyword}" and identify content gaps versus the current DeMar Transportation page.

${competitorSummary}

${currentPageSummary}

Return a JSON object with exactly these fields:
{
  "commonHeadings": ["array of heading topics that appear across multiple competitor pages"],
  "topicsCovered": ["array of key topics/subjects covered by competitors"],
  "missingFromOurs": ["array of topics competitors cover that DeMar's current page does NOT address"],
  "factSources": [
    { "claim": "a specific verifiable fact or statistic mentioned", "source": "url or site name", "date": "year or date if known, else empty string" }
  ]
}

Return ONLY valid JSON. No markdown fences, no explanation.`;

  try {
    const output = await generateWithClaude(prompt, { model: "sonnet", timeout: 60_000 });

    // Strip markdown fences if present
    const cleaned = output.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      commonHeadings: Array.isArray(parsed.commonHeadings) ? parsed.commonHeadings : [],
      topicsCovered: Array.isArray(parsed.topicsCovered) ? parsed.topicsCovered : [],
      missingFromOurs: Array.isArray(parsed.missingFromOurs) ? parsed.missingFromOurs : [],
      factSources: Array.isArray(parsed.factSources)
        ? parsed.factSources.map((f) => ({
            claim: String(f.claim || ""),
            source: String(f.source || ""),
            date: String(f.date || ""),
          }))
        : [],
    };
  } catch {
    return { commonHeadings: [], topicsCovered: [], missingFromOurs: [], factSources: [] };
  }
}

// ---------------------------------------------------------------------------
// runResearch
// ---------------------------------------------------------------------------

/**
 * Gather competitive research context for a given action type, keyword, and page.
 *
 * @param {{ actionType?: string, targetKeyword: string, targetPage?: string }} options
 * @returns {Promise<ResearchResult>}
 */
export async function runResearch({ actionType = "", targetKeyword, targetPage = "" } = {}) {
  const result = emptyResult(targetKeyword || "");

  if (!targetKeyword) return result;

  // Run independent fetches in parallel to keep latency down
  const [competitorPages, peopleAlsoAsk, serpTopResults, currentLivePage] = await Promise.all([
    fetchCompetitorPages(targetKeyword, 3).catch(() => []),
    fetchPeopleAlsoAsk(targetKeyword).catch(() => []),
    fetchSerpTopResults(targetKeyword).catch(() => []),
    targetPage ? fetchLivePage(targetPage).catch(() => null) : Promise.resolve(null),
  ]);

  // Populate SERP data
  result.serp.topResults = serpTopResults;
  result.serp.peopleAlsoAsk = peopleAlsoAsk;

  // Populate current live page
  if (currentLivePage) {
    result.currentLivePage = {
      title: currentLivePage.title,
      description: currentLivePage.description,
      wordCount: currentLivePage.wordCount,
      headings: currentLivePage.headings,
    };
  }

  // Compute avg word count from competitors
  if (competitorPages.length > 0) {
    const totalWords = competitorPages.reduce((sum, c) => sum + (c.wordCount || 0), 0);
    result.competitorAnalysis.avgWordCount = Math.round(totalWords / competitorPages.length);
  }

  // Synthesize with Claude when we have competitor data
  if (competitorPages.length > 0) {
    const synthesis = await synthesizeWithClaude(
      targetKeyword,
      competitorPages,
      result.currentLivePage
    );
    result.competitorAnalysis.commonHeadings = synthesis.commonHeadings;
    result.competitorAnalysis.topicsCovered = synthesis.topicsCovered;
    result.competitorAnalysis.missingFromOurs = synthesis.missingFromOurs;
    result.factSources = synthesis.factSources;
  }

  return result;
}

// ---------------------------------------------------------------------------
// formatResearchContext
// ---------------------------------------------------------------------------

/**
 * Format a ResearchResult into a readable markdown string for injection into
 * writer/reviewer prompts.
 *
 * @param {ResearchResult} research
 * @returns {string}
 */
export function formatResearchContext(research) {
  if (!research) return "";

  const lines = [];

  lines.push(`## Research Context: "${research.keyword || ""}"`);
  lines.push("");

  // --- Top-ranking pages ---
  lines.push("### Top-Ranking Pages");
  const topResults = research.serp?.topResults ?? [];
  if (topResults.length > 0) {
    for (const r of topResults) {
      lines.push(`- **${r.title || "(no title)"}** — ${r.url}`);
      if (r.description) lines.push(`  ${r.description}`);
    }
  } else {
    lines.push("_No SERP data available._");
  }
  lines.push("");

  // --- Competitor analysis ---
  lines.push("### Competitor Analysis");
  const ca = research.competitorAnalysis;
  if (ca) {
    if (ca.avgWordCount > 0) {
      lines.push(`- **Average competitor word count:** ${ca.avgWordCount}`);
    }

    if (ca.commonHeadings?.length > 0) {
      lines.push(`- **Common headings across competitors:**`);
      for (const h of ca.commonHeadings) {
        lines.push(`  - ${h}`);
      }
    }

    if (ca.topicsCovered?.length > 0) {
      lines.push(`- **Topics covered by competitors:**`);
      for (const t of ca.topicsCovered) {
        lines.push(`  - ${t}`);
      }
    }

    if (ca.missingFromOurs?.length > 0) {
      lines.push(`- **Topics competitors cover that we are missing:**`);
      for (const m of ca.missingFromOurs) {
        lines.push(`  - ${m}`);
      }
    }

    if (
      ca.avgWordCount === 0 &&
      (!ca.commonHeadings || ca.commonHeadings.length === 0) &&
      (!ca.topicsCovered || ca.topicsCovered.length === 0) &&
      (!ca.missingFromOurs || ca.missingFromOurs.length === 0)
    ) {
      lines.push("_No competitor analysis available._");
    }
  } else {
    lines.push("_No competitor analysis available._");
  }
  lines.push("");

  // --- People Also Ask ---
  lines.push("### People Also Ask");
  const paa = research.serp?.peopleAlsoAsk ?? [];
  if (paa.length > 0) {
    for (const q of paa) {
      lines.push(`- ${q}`);
    }
  } else {
    lines.push("_No PAA data available._");
  }
  lines.push("");

  // --- Current live page ---
  lines.push("### Current Live Page State");
  const clp = research.currentLivePage;
  if (clp) {
    lines.push(`- **Title:** ${clp.title || "(none)"}`);
    lines.push(`- **Meta description:** ${clp.description || "(none)"}`);
    lines.push(`- **Word count:** ${clp.wordCount}`);
    if (clp.headings?.length > 0) {
      lines.push("- **Headings:**");
      for (const h of clp.headings) {
        lines.push(`  - [${h.tag.toUpperCase()}] ${h.text}`);
      }
    } else {
      lines.push("- **Headings:** (none detected)");
    }
  } else {
    lines.push("_Current page data not available._");
  }
  lines.push("");

  // --- Verified facts ---
  lines.push("### Verified Facts & Sources");
  const facts = research.factSources ?? [];
  if (facts.length > 0) {
    for (const f of facts) {
      const dateStr = f.date ? ` (${f.date})` : "";
      lines.push(`- ${f.claim} — Source: ${f.source}${dateStr}`);
    }
  } else {
    lines.push("_No verified facts available._");
  }

  return lines.join("\n");
}
