# Multi-Agent Review System Design

## Problem

The nightly SEO agent system generates and commits code changes (blog posts, meta tags, schema, technical fixes) with no quality review beyond structural validation. Most action agents use Haiku (cheapest model), increasing hallucination risk. Validators only check structure (word count, char limits, JSON validity, no placeholders) — nobody checks whether the content is actually accurate, relevant, or competitive. Changes can sail through to staging that contain fabricated statistics, irrelevant advice, or claims that don't match DeMar's services.

## Solution

Split the action phase into two independent orchestrators separated by a pending directory:

1. **Generation Orchestrator** (modified existing) — researches context, generates candidate changes, validates structure, writes to a `pending/` directory instead of committing to git.
2. **Review Orchestrator** (new) — independently evaluates each candidate using tiered AI review, revision loops, and competitor comparison before committing approved changes to staging.

## Architecture

```
Nightly Run
│
├─ Phase 1: Intelligence     (unchanged)
├─ Phase 2: Analysis         (unchanged)
├─ Phase 3: Strategy         (unchanged)
│
├─ Phase 4: Generation Orchestrator
│     for each action in strategy queue:
│       1. Research Agent gathers web context (Serper + scraping + Sonnet synthesis)
│       2. Writer Agent generates change (Sonnet minimum for all agents)
│       3. Structural validators run (existing)
│       4. Build check passes
│       5. Writes to pending/{action-id}/ directory
│
├─ Phase 5: Review Orchestrator
│     for each pending item (sorted by priority):
│       1. Fetch live page + top competitor pages
│       2. Reviewer Agent evaluates (Opus for content, Sonnet for technical)
│       3. APPROVE → apply change, commit to staging
│       4. REVISE → feedback to writer, re-generate, re-review (max 2 rounds)
│       5. Double failure → escalate writer to Opus, final Opus review
│       6. REJECT → skip, Discord alert
│       7. Archive processed item
│
└─ Phase 6: Reporting         (modified — includes review stats)
```

The two orchestrators share state only through the `pending/` directory. The generation orchestrator produces candidates; the review orchestrator evaluates them. Neither knows the other's internals.

---

## Component 1: Research Agent

New module: `monitoring/agents/research/research-agent.mjs`

Before any action agent generates content, the Research Agent gathers real-world context. This context is saved to the pending directory and fed to both the writer and reviewer.

### Research scope by action type

| Action Type | Research Steps |
|---|---|
| write-content | Serper search for target keyword, scrape top 3 ranking pages, extract headings/word count/key topics, pull People Also Ask questions |
| update-content | Same as write-content + fetch current live page for before-state |
| fix-meta | Serper SERP for keyword, extract titles/descriptions of top 5 results to see what's winning for CTR |
| fix-schema | Fetch live page, extract current schema, check schema.org type requirements |
| fix-technical | Fetch live page, identify current technical state |
| fix-links, fix-homepage | Serper search for related terms, identify internal linking opportunities from competitor patterns |

### Model

Sonnet for research synthesis (reading scraped content and summarizing key findings).

### Output format

Saved as `research.json` in the pending action directory:

```json
{
  "keyword": "LTL freight shipping Reno",
  "serp": {
    "topResults": [
      { "title": "...", "url": "...", "description": "..." }
    ],
    "peopleAlsoAsk": ["...", "..."]
  },
  "competitorAnalysis": {
    "avgWordCount": 2100,
    "commonHeadings": ["...", "..."],
    "topicsCovered": ["...", "..."],
    "missingFromOurs": ["...", "..."]
  },
  "currentLivePage": {
    "title": "...",
    "description": "...",
    "wordCount": 800,
    "headings": ["...", "..."]
  },
  "factSources": [
    { "claim": "LTL market worth $45B", "source": "url", "date": "2025" }
  ]
}
```

### Web scraping

Uses Serper API (already integrated in `monitoring/seo/lib/serper.mjs`) for search results. For scraping top-ranking pages, uses `fetch` + cheerio (same pattern as existing scanners). Falls back gracefully if a page blocks scraping — the research just has less context, it does not fail the action.

### Cost/time budget

~15-30 seconds per action, 1 Sonnet call for synthesis.

---

## Component 2: Writer Agent Upgrades

All existing action agents are modified with model upgrades and research context injection. No new agents — same 6 agents with better inputs.

### Model changes

| Agent | Current Model | New Model |
|---|---|---|
| content-writer (topic generation) | Haiku | Sonnet |
| content-writer (blog post) | Sonnet | Sonnet (unchanged) |
| content-writer (content update) | Sonnet | Sonnet (unchanged) |
| meta-tag-optimizer (generate) | Haiku | Sonnet |
| meta-tag-optimizer (apply) | Haiku | Sonnet |
| schema-generator | Haiku | Sonnet |
| technical-fixer | Haiku | Sonnet |
| internal-link-optimizer | Haiku | Sonnet |
| homepage-optimizer | Sonnet | Sonnet (unchanged) |

Haiku is no longer used for any generation that touches production code.

### Research context injection

Each action agent's prompt gets an additional section prepended with the research findings:

```
## Research Context

Top-ranking pages for "{keyword}":
- {competitor 1 title} ({word count} words) — covers: {topics}
- {competitor 2 title} ({word count} words) — covers: {topics}

Topics competitors cover that we don't: {list}
People Also Ask: {questions}
Verified facts: {claim} (source: {url}, {date})

Current live page state:
- Title: {title}, Description: {description}
- Word count: {count}, Headings: {list}

## Your Task
{existing prompt continues here}
```

### Output change

Instead of calling `commitAndPush()`, action agents call `writePending()` which saves the modified file, original file, research context, and manifest to the `pending/` directory. The existing structural validators and build check still run before writing to pending — no point sending something to review that doesn't compile.

---

## Component 3: Reviewer Agent

New module: `monitoring/agents/review/reviewer-agent.mjs`

Evaluates each pending change and returns a verdict: APPROVE, REVISE, or REJECT.

### Tiered model selection

| Action Type | Reviewer Model | Rationale |
|---|---|---|
| write-content, update-content | Opus | Content quality, factual accuracy, brand voice need the best judgment |
| fix-homepage | Opus | High-visibility page, significant impact |
| fix-meta | Sonnet | Structured output, easier to evaluate |
| fix-schema | Sonnet | Schema has clear right/wrong answers |
| fix-technical | Sonnet | Mechanical changes, less judgment needed |
| fix-links | Sonnet | Link relevance is relatively straightforward |

### Review criteria

For content-heavy changes (Opus review):
- **Factual accuracy** — are statistics or claims backed by the research context? Flag anything that looks fabricated
- **Brand consistency** — matches DeMar's voice, services, market position? No claims about services DeMar doesn't offer
- **SEO value** — covers topics competitors are covering? Genuinely better than what's ranking, or just filler?
- **E-E-A-T signals** — experience/expertise claims grounded or generic?
- **Live site comparison** — is this actually an improvement over current state?
- **Competitor comparison** — does this compete with what's ranking in the top 5?
- **Business facts** — cross-checks phone, email, services, DOT number against business-facts.json

For technical changes (Sonnet review):
- **Intent match** — does the change match the stated action intent? If the action says "fix meta description," did it only touch meta description?
- **No side effects** — did it change things it shouldn't have?
- **Live site comparison** — is the current state actually broken in the way the action claims?
- **Schema validity** — for schema changes, validates against schema.org specs

### Reviewer prompt structure

```
You are a senior SEO editor reviewing an automated change before it goes live.

## Action Intent
{action type, reason, target keyword from strategy}

## Research Context
{full research.json — what competitors are doing, current SERP state}

## Original File
{original.tsx content}

## Modified File
{modified.tsx content}

## Current Live Page
{fetched HTML/content from live site}

## Top Competitor Pages for "{keyword}"
{titles, descriptions, key content from top 3 SERP results}

## Business Facts (source of truth)
{phone, email, address, DOT number, services offered}

## Your Job
Evaluate whether this change should go live. Consider:
1. Is this change factually accurate?
2. Is it better than what's currently live?
3. Is it competitive with what's ranking?
4. Does it match DeMar's brand and services?
5. Are there any hallucinated claims or made-up data?
6. Does the change match the stated intent without unintended side effects?

Respond with JSON:
{
  "verdict": "APPROVE" | "REVISE" | "REJECT",
  "confidence": 0-100,
  "issues": ["specific issue 1", "specific issue 2"],
  "feedback": "If REVISE — specific instructions for what to fix",
  "summary": "One-line summary of your assessment"
}
```

### Verdict handling

- **APPROVE** — apply file change and all auxiliary files, commit to staging via `commitAndPush()`
- **REVISE** — feed `feedback` back to the writer agent with the research context. Writer produces new version. Re-review. Max 2 revision rounds before escalation.
- **REJECT** — skip action, log detailed reason to Discord, mark action as failed in state

### Confidence threshold

If confidence < 60 even on APPROVE, treat as REVISE. Forces the reviewer to articulate what's uncertain rather than passing something it's unsure about.

---

## Component 4: Revision Loop & Escalation

New module: `monitoring/agents/review/revision-loop.mjs`

Manages the feedback cycle between reviewer and writer.

### Flow

```
Round 1: Writer (Sonnet) generates
         Reviewer evaluates
         REVISE with feedback

Round 2: Writer (Sonnet) re-generates with feedback
         Reviewer evaluates
         REVISE again

Round 3: Writer (Opus) re-generates from scratch with all context + both rounds of feedback
         Reviewer (Opus) evaluates
         APPROVE → commit
         REJECT → skip, Discord alert with full 3-round history
```

### Revision prompt

The revision wraps the original prompt with the reviewer's feedback:

```
Your previous attempt was reviewed and needs changes.

## Reviewer Feedback
{reviewer's feedback field}

## Specific Issues Found
{reviewer's issues array}

## Previous Attempt (DO NOT repeat these mistakes)
{modified.tsx from failed attempt}

## Original Task
{original full prompt with research context}

Generate a corrected version that addresses all reviewer feedback.
```

### Rules

- Rounds 1-2 use the same model as the original writer (Sonnet)
- Round 3 escalates the writer to Opus, and uses Opus for the final review
- Each revision overwrites `modified.tsx` in the pending directory
- `manifest.json` tracks `revisionCount` and appends review history
- Build check + structural validators re-run after every revision
- If the escalated Opus attempt also gets REJECT, the action is marked failed with full history sent to Discord

### Cost guardrail

Maximum 3 generation calls + 3 review calls per action. No infinite loops. If the system can't produce something good in 3 tries (Sonnet, Sonnet, Opus), a human should look at it.

---

## Component 5: Pending Directory & State

New module: `monitoring/agents/lib/pending.mjs`

The contract between the two orchestrators. Generation writes here, review reads from here.

### Directory structure

```
monitoring/agents/pending/
├── act-001/
│   ├── manifest.json
│   ├── original.tsx
│   ├── modified.tsx
│   └── research.json
├── act-002/
│   ├── manifest.json
│   ├── original.tsx
│   ├── modified.tsx
│   └── research.json
└── archive/
    └── 2026-04-05/
        └── act-001/  (processed items)
```

### manifest.json

```json
{
  "actionId": "act-001",
  "type": "write-content",
  "priority": 1,
  "targetPage": "/blog/ltl-freight-guide",
  "targetKeyword": "LTL freight shipping Reno",
  "targetFile": "src/pages/blog/LtlFreightGuide.tsx",
  "reason": "Content gap: no LTL-specific content, competitors ranking with dedicated pages",
  "agentModel": "sonnet",
  "generatedAt": "2026-04-05T03:15:00Z",
  "buildPassed": true,
  "structuralValidation": { "passed": true, "errors": [] },
  "reviewTier": "opus",
  "status": "pending",
  "revisionCount": 0,
  "reviewHistory": [],
  "auxiliaryFiles": {
    "src/App.tsx": "path to modified version or diff",
    "src/pages/Blog.tsx": "path to modified version or diff",
    "public/sitemap.xml": "path to modified version or diff",
    "prerender.mjs": "path to modified version or diff"
  }
}
```

The `auxiliaryFiles` field handles cases like the content-writer which modifies App.tsx (adds route), Blog.tsx (adds listing), sitemap.xml, and prerender.mjs in addition to the main blog post file. When the reviewer approves, ALL files (main + auxiliary) are applied and committed together as a single atomic unit.

### Status lifecycle

```
pending → under-review → approved → committed
                       → revision-1 → under-review → approved | revision-2
                       → rejected
                       → escalated → under-review → approved | rejected
```

Status updates are written directly to `manifest.json`. The pending directory IS the state — no separate state files needed.

### Cleanup

After the review orchestrator completes, all processed directories get moved to `monitoring/agents/pending/archive/{date}/`. Archived items older than 7 days get deleted automatically at the start of each nightly run.

### Gitignore

The entire `pending/` directory is gitignored. It's ephemeral working state.

---

## Component 6: Review Orchestrator

New entry point: `monitoring/agents/review-orchestrator.mjs`

Separate process that reads pending items and runs the review pipeline.

### CLI interface

```bash
cd monitoring && node agents/review-orchestrator.mjs                    # review all pending
cd monitoring && node agents/review-orchestrator.mjs --limit 5          # review at most 5
cd monitoring && node agents/review-orchestrator.mjs --dry-run           # review but don't commit
cd monitoring && node agents/review-orchestrator.mjs --action-id act-001 # review single action
cd monitoring && node agents/review-orchestrator.mjs --skip-competitors  # skip competitor fetch
```

### Processing flow

1. Read all `pending/*/manifest.json` files where `status === "pending"`
2. Sort by priority (ascending — priority 1 first)
3. For each pending item:
   a. Update status to `under-review`
   b. Fetch live page via HTTP
   c. Fetch competitor pages via Serper + scrape top 3
   d. Call reviewer agent with appropriate model tier
   e. Handle verdict via revision-loop module
   f. On APPROVE: apply all files (main + auxiliary), run build check, `commitAndPush()`, `writeStagingManifest()`
   g. On final REJECT: log to Discord with full review history
   h. Archive processed directory
4. Post nightly summary to Discord

### Failure isolation

If the review orchestrator crashes mid-run, unprocessed items stay in `pending/` with status `pending`. Next run picks them up. Items with status `under-review` from a crashed run are treated as `pending` on restart (stale lock detection based on timestamp > 1 hour).

---

## Component 7: Generation Orchestrator Changes

Modified: `monitoring/agents/orchestrator.mjs`

### Action phase changes

The action phase loop changes from:
```javascript
for each action:
  run action agent → validate → build → commitAndPush()
```
to:
```javascript
for each action:
  run research agent → inject research context → run action agent → validate → build → writePending()
```

`commitAndPush()` is removed from the action phase. The generation orchestrator's job is to produce validated, buildable candidates in `pending/`.

### Research injection

Before calling each action agent, the orchestrator:
1. Calls the research agent with the action's keyword and type
2. Saves research output to `pending/{action-id}/research.json`
3. Passes the research context object to the action agent for prompt injection

### Existing safety mechanisms unchanged

- Smoke test failure flag still blocks entire action phase
- Lock mechanism still prevents concurrent runs
- `--dry-run` skips action phase entirely
- `--limit` still caps number of actions processed

---

## Component 8: Nightly Run Integration

Updated master job sequence:

```bash
#!/bin/bash
cd /opt/demar-website

# Pull latest code
git pull origin main

# Run phases
cd monitoring
node agents/orchestrator.mjs --phase intelligence
node agents/orchestrator.mjs --phase analysis
node agents/orchestrator.mjs --phase strategy
node agents/orchestrator.mjs --phase action          # writes to pending/

# Review phase (new)
node agents/review-orchestrator.mjs

# Reporting (updated)
node agents/orchestrator.mjs --phase reporting
```

The review orchestrator runs as its own step. If it fails, reporting still runs and includes the failure in the Discord summary.

---

## Component 9: Discord Reporting

### Generation phase message (seo-dashboard channel)

```
📝 Generation Complete — 7 candidates produced

✅ 5 passed structural validation + build
❌ 2 failed build (skipped, not sent to review)

Pending review:
  1. [write-content] LTL freight guide → Opus review
  2. [fix-meta] /services/dry-van → Sonnet review
  3. [update-content] /blog/shipping-tips → Opus review
  4. [fix-schema] /about → Sonnet review
  5. [fix-links] /services/ftl → Sonnet review
```

### Per-action review result (seo channel)

Approved:
```
✅ APPROVED: New blog post "LTL Freight Guide"
  Reviewer: Opus (confidence: 87)
  Summary: "Well-researched, covers all competitor topics, accurate claims"
  Rounds: 1 (approved on first attempt)
```

Approved after revision:
```
⚠️ APPROVED after revision: Meta tags for /services/dry-van
  Reviewer: Sonnet (confidence: 72)
  Round 1: REVISE — "Title too generic, doesn't match SERP winners"
  Round 2: APPROVE — "Title now competitive with top 3 results"
```

Rejected:
```
❌ REJECTED: Schema update for /about
  Reviewer: Sonnet (confidence: 91)
  Summary: "Added LocalBusiness schema but DeMar already has Organization schema — would create conflicting types"
  Rounds: 3 (escalated to Opus, still rejected)
```

### Nightly summary (seo-dashboard channel)

```
🌙 Nightly Review Summary — April 5, 2026

Actions generated: 7
Actions reviewed:  5
  ✅ Approved:     3 (1 first-attempt, 2 after revision)
  ❌ Rejected:     1
  🔺 Escalated:    1 (approved by Opus)

Model usage:
  Sonnet: 8 calls (research: 3, generation: 5, review: 2)
  Opus:   4 calls (review: 3, escalated generation: 1)

Committed to staging: 4 changes
  → staging CI will validate and auto-merge to main
```

### Channel routing

| Event | Channel | Env Var |
|---|---|---|
| Generation summary | seo-dashboard | `DISCORD_SEO_DASHBOARD_WEBHOOK_URL` |
| Per-action review result | seo | `DISCORD_SEO_WEBHOOK_URL` |
| Nightly summary | seo-dashboard | `DISCORD_SEO_DASHBOARD_WEBHOOK_URL` |
| Build/commit failures | health | `DISCORD_WEBHOOK_URL` |

---

## File Structure

### New files

```
monitoring/agents/
├── review-orchestrator.mjs          # Review phase entry point
├── research/
│   └── research-agent.mjs           # Web research before generation
├── review/
│   ├── reviewer-agent.mjs           # Evaluates pending changes
│   ├── revision-loop.mjs            # Manages revise/escalate flow
│   └── competitor-fetcher.mjs       # Fetches live + competitor pages
├── lib/
│   └── pending.mjs                  # Read/write/archive pending directory
├── pending/                         # Gitignored, ephemeral working state
│   └── archive/                     # Processed items, auto-cleaned after 7 days
```

### Modified files

```
monitoring/agents/
├── orchestrator.mjs                 # Action phase writes to pending/ instead of git
├── action/
│   ├── content-writer.mjs           # Model upgrade (haiku→sonnet), research injection, writePending()
│   ├── meta-tag-optimizer.mjs       # Model upgrade (haiku→sonnet), research injection, writePending()
│   ├── schema-generator.mjs         # Model upgrade (haiku→sonnet), research injection, writePending()
│   ├── technical-fixer.mjs          # Model upgrade (haiku→sonnet), research injection, writePending()
│   ├── internal-link-optimizer.mjs  # Model upgrade (haiku→sonnet), research injection, writePending()
│   └── homepage-optimizer.mjs       # Research injection, writePending()
├── marketing/lib/
│   └── git-ops.mjs                  # Add writePending(), keep commitAndPush() for review orchestrator
```

### Unchanged files

```
monitoring/agents/
├── marketing/lib/claude-api.mjs     # Already supports haiku/sonnet/opus
├── lib/validators/                  # Structural validators still run in generation phase
├── intelligence/                    # All intelligence agents unchanged
├── analysis/                        # All analysis agents unchanged
├── strategy/                        # Strategy agent unchanged
```

---

## Dependencies

### Existing (no new installs)
- `@anthropic-ai/claude-code` — Claude API via CLI (already used)
- `cheerio` — HTML parsing for scraping (already in monitoring/package.json)
- Serper API — search results (already integrated, requires `SERPER_API_KEY`)

### No new dependencies required

All functionality builds on existing libraries: fetch for HTTP, cheerio for HTML parsing, fs for file operations, Claude Code CLI for AI calls, Serper for search.

---

## Success Criteria

1. No action agent output reaches staging without passing AI review
2. Content-heavy changes (blog posts, content updates, homepage) are reviewed by Opus
3. Every action agent uses Sonnet minimum — no Haiku for production code generation
4. Research context is gathered and available for both writer and reviewer for every action
5. Revision loop caps at 3 rounds (Sonnet, Sonnet, Opus escalation) per action
6. Failed reviews produce actionable Discord notifications with full history
7. Pending directory provides clean separation — generation crash doesn't affect review, review crash doesn't lose candidates
8. Nightly summary shows approval rate, revision rate, rejection rate, and model usage
9. Existing structural validators and build checks continue to run unchanged
10. Staging CI + auto-merge flow continues to work unchanged downstream
