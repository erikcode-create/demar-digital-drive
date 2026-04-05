/**
 * Strategy Agent (The Brain)
 *
 * Reads all intelligence and analysis state, uses Claude to produce
 * a prioritized action queue, and posts the top recommendations
 * to the SEO Dashboard Discord channel.
 */

import { generateWithClaude } from "../../marketing/lib/claude-api.mjs";

export const name = "strategy-agent";
export const category = "strategy";
export const description =
  "Analyzes all SEO intelligence and produces a prioritized action queue for action agents.";

/**
 * Safely read state, returning null if the key does not exist.
 */
function safeRead(context, cat, key) {
  try {
    return context.state.read(cat, key);
  } catch {
    return null;
  }
}

/**
 * Build a concise text summary of each data source so Claude can reason
 * over the full picture without exceeding context limits.
 */
function summarizeInputs(data) {
  const sections = [];

  if (data.ranks) {
    const drops = Array.isArray(data.ranks.drops) ? data.ranks.drops : [];
    const opps = Array.isArray(data.ranks.opportunities) ? data.ranks.opportunities : [];
    sections.push(
      `## Rank Changes\n` +
        `Drops (${drops.length}): ${drops
          .slice(0, 15)
          .map((d) => `${d.keyword} (pos ${d.previousPosition} -> ${d.currentPosition})`)
          .join("; ")}\n` +
        `Opportunities (${opps.length}): ${opps
          .slice(0, 15)
          .map((o) => `${o.keyword} pos ${o.position}`)
          .join("; ")}`
    );
  }

  if (data.searchConsole) {
    const pages = Array.isArray(data.searchConsole.pages)
      ? data.searchConsole.pages
      : Array.isArray(data.searchConsole)
        ? data.searchConsole
        : [];
    const highImpLowCTR = pages
      .filter((p) => p.impressions > 100 && p.ctr < 0.03)
      .slice(0, 10);
    if (highImpLowCTR.length > 0) {
      sections.push(
        `## Search Console: High Impression / Low CTR Pages\n` +
          highImpLowCTR
            .map((p) => `${p.page || p.path}: ${p.impressions} imp, ${(p.ctr * 100).toFixed(1)}% CTR`)
            .join("\n")
      );
    }
  }

  if (data.competitors) {
    const gaps = Array.isArray(data.competitors.gaps)
      ? data.competitors.gaps
      : Array.isArray(data.competitors)
        ? data.competitors
        : [];
    if (gaps.length > 0) {
      sections.push(
        `## Competitor Gaps\n` +
          gaps
            .slice(0, 10)
            .map((g) => `${g.keyword}: competitor ranks ${g.competitorPosition}, we rank ${g.ourPosition || "unranked"}`)
            .join("\n")
      );
    }
  }

  if (data.siteAudit) {
    const issues = Array.isArray(data.siteAudit.issues)
      ? data.siteAudit.issues
      : Array.isArray(data.siteAudit)
        ? data.siteAudit
        : [];
    if (issues.length > 0) {
      sections.push(
        `## Technical Issues (Site Audit)\n` +
          issues
            .slice(0, 15)
            .map((i) => `[${i.severity || "info"}] ${i.page || ""}: ${i.issue || i.description || JSON.stringify(i)}`)
            .join("\n")
      );
    }
  }

  if (data.eeat) {
    const scores = Array.isArray(data.eeat.pages)
      ? data.eeat.pages
      : Array.isArray(data.eeat)
        ? data.eeat
        : [];
    const weak = scores.filter((p) => (p.score || p.total || 0) < 60).slice(0, 10);
    if (weak.length > 0) {
      sections.push(
        `## Weak E-E-A-T Pages (score < 60)\n` +
          weak.map((p) => `${p.page || p.path}: score ${p.score || p.total}`).join("\n")
      );
    }
  }

  if (data.contentGaps) {
    const gaps = Array.isArray(data.contentGaps.topics)
      ? data.contentGaps.topics
      : Array.isArray(data.contentGaps)
        ? data.contentGaps
        : [];
    if (gaps.length > 0) {
      sections.push(
        `## Content Gaps (missing topics)\n` +
          gaps
            .slice(0, 10)
            .map((g) => `${g.keyword || g.topic}: volume ${g.volume || "unknown"}, intent ${g.intent || "unknown"}`)
            .join("\n")
      );
    }
  }

  return sections.length > 0 ? sections.join("\n\n") : "No data available from any intelligence source.";
}

/**
 * Filter the prompt to only cover a specific focus area when context.config.filter is set.
 */
function buildFilterClause(filter) {
  const map = {
    "rank-drops": "Focus ONLY on rank drops and opportunities from the Rank Changes data. Ignore other data sources.",
    "content-gaps": "Focus ONLY on missing topics from the Content Gaps data. Generate write-content actions for those topics.",
    "eeat-weak": "Focus ONLY on pages with weak E-E-A-T scores. Generate update-content actions to improve E-E-A-T signals.",
    "technical": "Focus ONLY on technical issues from the Site Audit. Generate fix-technical actions.",
    "meta-tags": "Focus ONLY on high-impression/low-CTR pages from Search Console. Generate fix-meta actions to improve titles and descriptions.",
    "competitors": "Focus ONLY on competitor gaps. Generate write-content or update-content actions to close those gaps.",
  };
  return map[filter] || "";
}

export async function run(context) {
  console.log("=== Strategy Agent ===");

  // -----------------------------------------------------------------------
  // 1. Gather all intelligence
  // -----------------------------------------------------------------------
  console.log("Reading intelligence and analysis state...");

  const data = {
    ranks: safeRead(context, "intelligence", "ranks"),
    searchConsole: safeRead(context, "intelligence", "search-console"),
    competitors: safeRead(context, "intelligence", "competitors"),
    siteAudit: safeRead(context, "analysis", "site-audit"),
    eeat: safeRead(context, "analysis", "eeat-scores"),
    contentGaps: safeRead(context, "analysis", "content-gaps"),
  };

  const completedActions = safeRead(context, "strategy", "completed-actions") || { ids: [] };

  const summary = summarizeInputs(data);
  console.log("Data summary length:", summary.length, "chars");

  // -----------------------------------------------------------------------
  // 2. Build the prompt
  // -----------------------------------------------------------------------
  const filterClause = context.config.filter ? buildFilterClause(context.config.filter) : "";

  const prompt = `You are the SEO strategy brain for DeMar Transportation (demartransportation.com), a US freight carrier and broker based in Reno NV. Services: dry van, reefer, flatbed, hazmat, FTL, LTL, 3PL, warehousing, box truck, sprinter van.

Here is the current state of all SEO intelligence:

${summary}

Previously completed action IDs (do not repeat these): ${JSON.stringify(completedActions.ids || [])}

${filterClause}

Based on this data, produce a prioritized action queue of up to 10 actions. Each action should be the single most impactful thing an agent can do. Prioritize by expected SEO impact: rank recovery > content gaps with high volume > technical fixes > E-E-A-T improvements > meta tag tweaks.

For each action assign a unique ID like "act-001", "act-002", etc.

Action types:
- "write-content": create a new blog post or page targeting a keyword
- "update-content": improve an existing page (E-E-A-T, depth, freshness)
- "fix-meta": optimize title tag and/or meta description for CTR
- "fix-links": add or fix internal links
- "fix-technical": fix a technical SEO issue (alt text, broken links, accessibility)
- "fix-schema": add JSON-LD structured data to a page that is missing schema markup (BlogPosting for /blog/, Service for /services/, Article for /resources/, FAQPage for /faq, WebSite/LocalBusiness for homepage)
- "fix-homepage": fix homepage-specific issues including missing H1, insufficient internal links to service pages, low content depth, or missing schema; targetPage should be "/"

CRITICAL — targetPage URL format rules:
- ALL paths must be lowercase kebab-case. Never use capital letters or underscores in targetPage.
- Service pages: /services/dry-van, /services/reefer, /services/flatbed, /services/box-truck, /services/sprinter-van, /services/hazmat, /services/ftl, /services/ltl, /services/3pl, /services/warehousing
- Core pages: /, /about, /contact, /quote, /careers, /faq, /privacy, /support
- Blog pages: /blog/<kebab-case-slug> (e.g. /blog/freight-shipping-tips)
- Resource pages: /resources/<kebab-case-slug>
- New pages (write-content): use null for targetPage
- WRONG examples (never do this): /services/Dry-Van, /Services/dry-van, /services/DryVan
- CORRECT examples: /services/dry-van, /services/box-truck, /services/sprinter-van

Return ONLY a JSON object (no markdown fences, no explanation) with this structure:
{
  "actions": [
    {
      "id": "act-001",
      "priority": 1,
      "type": "write-content",
      "reason": "Why this action matters with specific data",
      "targetKeyword": "keyword if applicable or null",
      "targetPage": "/path or null for new pages",
      "details": "Specific instructions the action agent needs to execute this"
    }
  ]
}

If there is not enough data to justify any actions, return {"actions": []}.`;

  // -----------------------------------------------------------------------
  // 3. Ask Claude
  // -----------------------------------------------------------------------
  console.log("Generating action queue with Claude (opus)...");
  let actionQueue;
  try {
    const output = await generateWithClaude(prompt, { model: "opus", timeout: 300000 });
    const match = output.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error("Could not parse Claude response as JSON object");
      console.error("Raw output (first 500 chars):", output.substring(0, 500));
      return { success: false, summary: "Failed to parse strategy output", data: null };
    }
    actionQueue = JSON.parse(match[0]);
  } catch (err) {
    console.error("Strategy generation failed:", err.message);
    return { success: false, summary: `Strategy generation failed: ${err.message}`, data: null };
  }

  // Mark all actions as pending
  for (const action of actionQueue.actions) {
    action.status = "pending";
  }

  console.log(`Generated ${actionQueue.actions.length} actions.`);

  // -----------------------------------------------------------------------
  // 4. Write to state
  // -----------------------------------------------------------------------
  context.state.write("strategy", "action-queue", actionQueue);
  console.log("Wrote action queue to state.");

  // -----------------------------------------------------------------------
  // 5. Post top 5 to Discord
  // -----------------------------------------------------------------------
  const top5 = actionQueue.actions.slice(0, 5);
  if (top5.length > 0) {
    let desc = "";
    for (const action of top5) {
      desc += `**#${action.priority} [${action.type}]** ${action.reason}\n`;
      if (action.targetKeyword) desc += `  Keyword: \`${action.targetKeyword}\`\n`;
      if (action.targetPage) desc += `  Page: ${action.targetPage}\n`;
      desc += "\n";
    }

    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    try {
      await context.discord.post("seo-dashboard", {
        content: `**SEO Strategy Agent -- ${today}**${context.config.filter ? ` (filter: ${context.config.filter})` : ""}\n${actionQueue.actions.length} actions queued.`,
        embeds: [
          {
            title: "Top Recommended Actions",
            description: desc.substring(0, 4000),
            color: 3447003, // blue
            timestamp: new Date().toISOString(),
            footer: { text: "Strategy Agent | Multi-Agent SEO System" },
          },
        ],
      });
      console.log("Posted strategy summary to Discord (seo-dashboard).");
    } catch (err) {
      console.error("Discord post failed:", err.message);
    }
  }

  return {
    success: true,
    summary: `Generated ${actionQueue.actions.length} prioritized actions.${context.config.filter ? ` Filter: ${context.config.filter}` : ""}`,
    data: actionQueue,
  };
}
