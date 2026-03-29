# Marketing Automation System Design

**Date:** 2026-03-29
**Status:** Approved
**Context:** Turn Claude Code into an autonomous marketing manager for DeMar Transportation using the coreyhaines31/marketingskills library, brand kit, and daily GitHub Actions workflows posting to dedicated Discord channels.

---

## 1. Brand Kit

Reverse-engineer brand identity from the live site (demartransportation.com).

### Artifacts

- `marketing/brand-kit.json` — machine-readable reference consumed by all marketing scripts
  - Colors (hex): primary, secondary, accent, backgrounds, text
  - Typography: font families, weights, size scale
  - Logo paths and alt text
  - Voice/tone descriptors (extracted from existing copy)
  - Company info: MC + broker authority, own fleet + 3PL, partner warehouses, service areas
  - Spacing and layout conventions
- `marketing/brand-kit.html` — visual rendered version for human review

### Builder Script

- `monitoring/marketing/brand-kit-builder.mjs` — scrapes live site, extracts brand elements, generates both files
- Can be run on-demand or as part of initial setup
- Uses Claude API to analyze existing copy for voice/tone patterns

### Integration

- All marketing scripts read `brand-kit.json` before generating any content
- Brand kit data populates the `product-marketing-context` skill so all 34 marketing skills understand DeMar's positioning

---

## 2. Discord Channels

### New Channels (3)

| Channel | Env Var | Purpose |
|---------|---------|---------|
| Marketing & CRO | `DISCORD_CRO_WEBHOOK_URL` | CRO audit scores, conversion recommendations, auto-fix notifications |
| Funnels & Landing Pages | `DISCORD_FUNNELS_WEBHOOK_URL` | Landing page health, new page generation, campaign page auto-PRs |
| Social Media | `DISCORD_SOCIAL_WEBHOOK_URL` | LinkedIn post copy, AI-generated images, companion landing page links |

### Implementation

- Extend `postToChannel()` in `monitoring/lib/discord.mjs` to support `"cro"`, `"funnels"`, `"social"` channel keys
- Add webhook URLs to `monitoring/.env.example`
- Add webhook URLs as GitHub Actions secrets: `DISCORD_CRO_WEBHOOK_URL`, `DISCORD_FUNNELS_WEBHOOK_URL`, `DISCORD_SOCIAL_WEBHOOK_URL`
- Same embed format and color coding as existing channels (green/3066993, yellow/16776960, red/15158332)

### Total Channel Architecture (6)

| # | Channel | Env Var | Existing/New |
|---|---------|---------|-------------|
| 1 | Website Health | `DISCORD_WEBHOOK_URL` | Existing |
| 2 | Content & Copywriting | `DISCORD_CONTENT_WEBHOOK_URL` | Existing |
| 3 | SEO | `DISCORD_SEO_WEBHOOK_URL` | Existing |
| 4 | Marketing & CRO | `DISCORD_CRO_WEBHOOK_URL` | New |
| 5 | Funnels & Landing Pages | `DISCORD_FUNNELS_WEBHOOK_URL` | New |
| 6 | Social Media | `DISCORD_SOCIAL_WEBHOOK_URL` | New |

---

## 3. Marketing Scripts

All scripts live in `monitoring/marketing/` and follow the existing scanner pattern.

### 3.1 CRO Audit (`cro-audit.mjs`)

- Crawls all site pages (service pages, landing pages, homepage, contact, about)
- Scores each page on CRO factors: CTAs (presence, placement, copy), forms, social proof, above-fold content, trust signals, mobile UX
- Uses Claude API to generate specific improvement recommendations
- Auto-generates fix PRs for low-risk improvements (CTA text, button placement, social proof additions)
- Posts per-page scores and recommendations to CRO Discord channel
- Outputs: `{ category: "CRO", status, score, checks[] }` matching scanner interface

### 3.2 Funnel Generator (`funnel-generator.mjs`)

- Checks landing page freshness and service coverage gaps
- Identifies services without dedicated landing pages or with stale content
- Uses Claude API + brand kit to generate new React landing page components
- Creates auto-PRs for new/updated landing pages
- Posts generation reports to Funnels Discord channel
- Adds routes to App.tsx and navigation links as needed

### 3.3 Social Media Generator (`social-generator.mjs`)

- Generates daily LinkedIn post copy aligned to brand voice from brand kit
- Calls nano-banana MCP for AI image generation matching brand colors/style
- Generates companion landing page (React component) for the post's CTA
- Creates auto-PR for companion landing page
- Posts to Social Media Discord channel: post copy, image (as attachment), landing page link
- Content themes rotate: service highlights, industry insights, company culture, customer stories

### 3.4 Brand Kit Builder (`brand-kit-builder.mjs`)

- Scrapes demartransportation.com for colors, fonts, logos, copy patterns
- Uses Claude API to analyze voice/tone from existing content
- Outputs `brand-kit.json` and `brand-kit.html`
- Run on-demand or during initial setup

---

## 4. GitHub Actions Workflows

### 4.1 CRO Audit (`marketing-cro.yml`)

- **Schedule:** Daily at 10:00 AM PDT (17:00 UTC)
- **Trigger:** `schedule` + `workflow_dispatch`
- **Steps:** Checkout → Install deps → Run `cro-audit.mjs` → Post to Discord
- **Secrets:** `ANTHROPIC_API_KEY`, `DISCORD_CRO_WEBHOOK_URL`
- **Permissions:** `contents: write` (for auto-PR creation)

### 4.2 Funnels (`marketing-funnels.yml`)

- **Schedule:** Daily at 11:00 AM PDT (18:00 UTC)
- **Trigger:** `schedule` + `workflow_dispatch`
- **Steps:** Checkout → Install deps → Run `funnel-generator.mjs` → Post to Discord
- **Secrets:** `ANTHROPIC_API_KEY`, `DISCORD_FUNNELS_WEBHOOK_URL`
- **Permissions:** `contents: write`, `pull-requests: write`

### 4.3 Social Media (`marketing-social.yml`)

- **Schedule:** Daily at 12:00 PM PDT (19:00 UTC)
- **Trigger:** `schedule` + `workflow_dispatch`
- **Steps:** Checkout → Install deps → Run `social-generator.mjs` → Post to Discord
- **Secrets:** `ANTHROPIC_API_KEY`, `DISCORD_SOCIAL_WEBHOOK_URL`
- **Permissions:** `contents: write`, `pull-requests: write`

### Staggered Schedule Rationale

1-hour gaps between workflows to avoid Anthropic API rate limits and keep Discord updates digestible throughout the day.

---

## 5. Marketing Skills Library

### Installation

- Source: `coreyhaines31/marketingskills` (34 skills)
- Install to: `~/.claude/skills/marketing/`
- Method: Clone and copy, or `npx skills add`

### Key Skills Used by Scripts

| Script | Skills Referenced |
|--------|-----------------|
| CRO Audit | `page-cro`, `signup-flow-cro`, `form-cro`, `popup-cro` |
| Funnel Generator | `copywriting`, `content-strategy`, `lead-magnets`, `launch-strategy` |
| Social Generator | `social-content`, `copywriting`, `ad-creative`, `marketing-psychology` |
| Brand Kit Builder | `product-marketing-context`, `customer-research` |

### Product Marketing Context

Configure `product-marketing-context` with DeMar's specifics:
- Motor carrier + freight broker (dual authority)
- Own fleet (dry van, reefer, flatbed, box truck, sprinter, hazmat)
- 3PL and warehousing capabilities via partner network
- Service areas and target customer profiles
- Competitive differentiators

---

## 6. Auto-Pilot Safety Tiers

### Tier 1: Auto-Commit

- Meta tag tweaks (descriptions, OG tags)
- CTA text improvements
- Schema markup updates
- Commit prefix: `[marketing-auto]`

### Tier 2: Auto-PR

- New landing pages
- Social companion pages
- Significant copy changes
- CRO-driven layout adjustments
- PR prefix: `[marketing]`

### Tier 3: Never Auto-Fix

- Pricing information
- Legal content / compliance
- Business model claims
- Contact information
- Service area boundaries

### Safety Requirements

- Build verification (`npm run build`) before any commit or PR
- Discord notification for every action taken (with diff summary)
- Max 1 auto-PR per workflow per day
- All generated content must reference brand kit for consistency
