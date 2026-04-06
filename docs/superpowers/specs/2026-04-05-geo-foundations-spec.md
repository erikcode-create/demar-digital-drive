# GEO Foundations — Design Specification

## Goal

Make DeMar Transportation discoverable and citable by AI search tools (ChatGPT, Perplexity, Google AI Overviews, Bing Copilot) while strengthening Google freshness signals.

## Scope

Static files for AI crawler access + targeted content improvements for citability + freshness signal infrastructure. No visual design changes. No new components.

## Non-Goals

- GEO monitoring/tracking agent (future project)
- Visual redesign of any pages
- New blog posts or service pages
- Changes to the multi-agent orchestrator

---

## 1. AI Crawler Access Layer

### 1.1 robots.txt Updates

Add explicit `User-agent` / `Allow` blocks for AI crawlers to `public/robots.txt`:

- `GPTBot` — OpenAI's web crawler (ChatGPT, AI Overviews)
- `ChatGPT-User` — ChatGPT browsing mode
- `ClaudeBot` — Anthropic's crawler
- `PerplexityBot` — Perplexity AI
- `Bytespider` — ByteDance/TikTok AI
- `CCBot` — Common Crawl (used by many LLM training sets)
- `Google-Extended` — Google's AI/Gemini crawler
- `Applebot-Extended` — Apple Intelligence

Keep existing Googlebot, Bingbot, Twitterbot, facebookexternalhit blocks unchanged. Keep the wildcard `User-agent: *` / `Allow: /` as fallback.

### 1.2 llms.txt

Create `public/llms.txt` following the emerging llms.txt standard:

```
# DeMar Transportation

> Professional freight transportation services across the United States. US-based carrier with competitive rates and 24/7 service.

## About

DeMar Transportation is a professional freight carrier based in Reno, Nevada, providing comprehensive transportation services including dry van, refrigerated (reefer), flatbed, box truck, sprinter van, and hazmat/fuel hauling. We serve shippers, brokers, and businesses nationwide.

## Services

- [Dry Van Shipping](https://demartransportation.com/services/dry-van): Enclosed trailer shipping for general freight
- [Reefer Transport](https://demartransportation.com/services/reefer): Temperature-controlled shipping for perishables
- [Flatbed Hauling](https://demartransportation.com/services/flatbed): Open deck transport for oversized and heavy loads
- [FTL Shipping](https://demartransportation.com/services/ftl): Full truckload dedicated capacity
- [LTL Freight](https://demartransportation.com/services/ltl): Less-than-truckload consolidated shipping
- [Box Truck Delivery](https://demartransportation.com/services/box-truck): Medium-duty delivery for smaller shipments
- [Sprinter Van Express](https://demartransportation.com/services/sprinter-van): Expedited small-load delivery
- [Hazmat/Fuel Transport](https://demartransportation.com/services/hazmat): Licensed hazardous materials hauling

## Key Pages

- [Homepage](https://demartransportation.com/): Company overview and service summary
- [About Us](https://demartransportation.com/about): Company story, mission, and values
- [Get a Quote](https://demartransportation.com/quote): Request freight shipping rates
- [Insights Blog](https://demartransportation.com/blog): Industry news and shipping guides
- [Contact](https://demartransportation.com/contact): Phone, email, and address

## Contact

- Phone: (775) 230-4767
- Email: info@DeMarTransportation.com
- Address: 10471 Double R Blvd, Reno, NV 89521
```

### 1.3 llms-full.txt

Create `public/llms-full.txt` — extended version with:

- Full service descriptions (2-3 paragraphs each) pulled from service page content
- Common FAQs with direct answers
- Competitive differentiators (24/7 service, nationwide coverage, competitive rates)
- Equipment specifications per service type
- Service area coverage details

### 1.4 ai.txt

Create `public/ai.txt` declaring AI usage preferences:

```
# AI Usage Preferences for demartransportation.com
# See: https://site.spawning.ai/spawning-ai-txt

User-Agent: *
Allowed: yes
```

### 1.5 HTML Discovery Link

Add to `index.html` `<head>`:

```html
<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-friendly site summary">
```

---

## 2. Content Citability Improvements

### 2.1 Blog Post "Last Updated" Display

In `BlogPost.tsx`:

- Add optional `lastUpdated` prop (string, ISO date format)
- Display "Last Updated: [formatted date]" below the hero section, next to the existing publish date
- Only render when `lastUpdated` is provided and differs from `date`
- Add `dateModified` field to the BlogPosting JSON-LD schema using this value

### 2.2 Blog Post Author Attribution

In `BlogPost.tsx`:

- Add `author` field to BlogPosting JSON-LD, value: `{ "@type": "Organization", "name": "DeMar Transportation", "url": "https://demartransportation.com" }`
- Display "By DeMar Transportation" text near the date line
- This strengthens E-E-A-T organizational authority signals

### 2.3 Service Page Quick Facts

For each of the 10 service pages, add a 2-3 sentence "quick facts" summary paragraph immediately after the hero section heading. This passage should:

- Directly answer "What is [service name]?" in plain language
- Include one quantifiable claim or differentiator
- Be structured as a standalone paragraph that AI tools can extract as a citation

Example for Dry Van:
> "DeMar Transportation provides dry van shipping services for enclosed freight across the continental United States. Our 53-foot dry van trailers handle general merchandise, consumer goods, and non-perishable freight with competitive per-mile rates and 24/7 dispatch availability."

### 2.4 Service Page dateModified

Add `dateModified` to existing Service JSON-LD schemas on each service page, using the page's last meaningful update date.

---

## 3. Freshness Signals

### 3.1 Blog Post lastUpdated Prop

The `BlogPost.tsx` template already receives metadata props. Add `lastUpdated?: string` to the props interface. Each blog post file passes this when content has been meaningfully updated.

### 3.2 Service Page Last Updated Metadata

Each service page should export or contain a `lastUpdated` date string. This feeds into:
- The `dateModified` JSON-LD field
- The sitemap `<lastmod>` tag

### 3.3 Sitemap lastmod Accuracy

The Vite build's sitemap plugin should use actual `lastUpdated` dates from page metadata rather than build date. If the current sitemap generator doesn't support per-page dates, document this as a future improvement (don't block this spec on build tooling changes).

### 3.4 Strategy Agent Freshness Priority

Add a note to `monitoring/agents/strategy/` configuration or documentation: when scoring potential actions, boost "update existing content" tasks for service pages and blog posts older than 90 days. This ensures the agent system refreshes existing content, not just creates new posts.

---

## Files Modified

| File | Change |
|------|--------|
| `public/robots.txt` | Add AI crawler user-agent blocks |
| `public/llms.txt` | New file — LLM summary |
| `public/llms-full.txt` | New file — Extended LLM summary |
| `public/ai.txt` | New file — AI preferences |
| `index.html` | Add `<link>` for llms.txt discovery |
| `src/components/BlogPost.tsx` | Add lastUpdated display, author attribution, dateModified JSON-LD |
| `src/pages/blog/*.tsx` | Add lastUpdated props where applicable |
| `src/pages/services/DryVan.tsx` | Add quick facts paragraph, dateModified JSON-LD |
| `src/pages/services/Reefer.tsx` | Add quick facts paragraph, dateModified JSON-LD |
| `src/pages/services/Flatbed.tsx` | Add quick facts paragraph, dateModified JSON-LD |
| `src/pages/services/FTL.tsx` | Add quick facts paragraph, dateModified JSON-LD |
| `src/pages/services/LTL.tsx` | Add quick facts paragraph, dateModified JSON-LD |
| `src/pages/services/BoxTruck.tsx` | Add quick facts paragraph, dateModified JSON-LD |
| `src/pages/services/SprinterVan.tsx` | Add quick facts paragraph, dateModified JSON-LD |
| `src/pages/services/Hazmat.tsx` | Add quick facts paragraph, dateModified JSON-LD |
| `src/pages/services/ThirdPartyLogistics.tsx` | Add quick facts paragraph, dateModified JSON-LD |
| `src/pages/services/Warehousing.tsx` | Add quick facts paragraph, dateModified JSON-LD |

## Success Criteria

1. `llms.txt`, `llms-full.txt`, and `ai.txt` are accessible at their public URLs after deploy
2. `robots.txt` explicitly allows all major AI crawlers
3. Blog posts show "Last Updated" date and author attribution
4. All 10 service pages have citability-optimized quick facts paragraphs
5. JSON-LD schemas include `dateModified` and `author` fields
6. Build passes with no errors
7. No visual design changes — layout remains identical
