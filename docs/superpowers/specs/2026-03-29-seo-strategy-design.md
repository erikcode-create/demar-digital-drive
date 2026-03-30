# DeMar Transportation SEO & GEO Strategy

## Goal
Rank DeMar Transportation on Google search and AI chatbots (ChatGPT, Perplexity, Gemini, Claude) for freight shipping queries. Primary objective: lead generation — drive shippers to the quote form.

## Target Audience
Mix of all verticals (manufacturers, agriculture, construction, e-commerce). No single dominant vertical. Nationwide coverage, US-based carrier headquartered in Reno, NV.

---

## Phase 1: Technical SEO (Completed)

### Meta Tags & Titles
- All 34 pages now have unique `document.title` and meta descriptions
- Titles are keyword-optimized with `| DeMar Transportation` suffix
- Meta descriptions include primary keywords, phone number, and CTA

### Structured Data (JSON-LD)
| Schema Type | Where | Purpose |
|---|---|---|
| TransportCompany | index.html | Business identity, NAP, services |
| WebSite + SearchAction | index.html | Sitelinks search box |
| Service | 10 service pages | Service-specific schema |
| BreadcrumbList | 10 service pages + 15 resource pages | SERP breadcrumb display |
| Article | 15 resource pages | Article rich results |
| FAQPage | FAQ page + 15 resource pages | FAQ rich results |
| LocalBusiness | Contact page | Local business schema |
| CollectionPage | Resources index | Collection schema |

### Sitemap & Robots
- `sitemap.xml`: 34 URLs with appropriate priorities and change frequencies
- `robots.txt`: All crawlers allowed, sitemap referenced
- No AI crawler blocks (critical for GEO)

### Internal Linking
- Service pages → Related resource articles (3 per page)
- Resource articles → Related service pages + other resources
- Homepage → Resource hub preview (4 featured articles)
- Footer → Top 6 resource articles
- Header nav → Resources link (desktop + mobile)

---

## Phase 2: Content Hub (Completed)

### Resource Center (`/resources`)
15 GEO-optimized guide pages organized into 4 categories:

**Pricing & Quotes (Bottom of Funnel)**
1. How Much Does Freight Shipping Cost? — targets "freight shipping cost"
2. How to Get a Freight Quote — targets "how to get freight quote"
3. How to Choose a Freight Carrier — targets "choose freight carrier"

**Equipment Guides (Mid Funnel)**
4. Dry Van vs Reefer — targets "dry van vs reefer"
5. FTL vs LTL — targets "FTL vs LTL"
6. Hot Shot vs Full Truckload — targets "hot shot vs full truckload"
7. Types of Freight Trailers — targets "types of freight trailers"

**Shipping Guides (Mid Funnel)**
8. How to Ship Freight: Beginner's Guide — targets "how to ship freight"
9. How to Ship Refrigerated Goods — targets "ship refrigerated goods"
10. How to Ship Hazardous Materials — targets "ship hazmat"
11. Oversized Load Shipping Guide — targets "oversized load shipping"

**Industry Knowledge (Top of Funnel / LLM Citation)**
12. Freight Classes Explained — targets "freight classes NMFC"
13. Freight Broker vs Carrier vs 3PL — targets "broker vs carrier vs 3PL"
14. Freight Shipping Glossary — targets "freight shipping terms"
15. Seasonal Freight Shipping — targets "freight peak season"

### GEO Optimization Pattern (Every Resource Page)
- First 200 words directly answer the primary query (LLMs extract opening content)
- Clear H1 → H2 → H3 heading hierarchy
- Bullet points, numbered lists, comparison tables
- Specific numbers and statistics (rates, dimensions, weights)
- FAQ section at bottom with FAQPage schema
- CTA to quote form
- Article + BreadcrumbList JSON-LD schemas

---

## Phase 3: Off-Page SEO (Action Required)

These items require manual action outside the codebase.

### 3.1 Google Business Profile (HIGH PRIORITY)
- **Action:** Claim and optimize GBP listing at business.google.com
- **Details:** Add all service categories (Freight Forwarding Service, Trucking Company, Logistics Service), upload facility/fleet photos, set business hours (Office: M-F 7am-6pm PST, Dispatch: 24/7), add description with keywords
- **Impact:** Appears in Google Maps, local pack, and "near me" searches
- **Timeline:** Do this first — highest single-action ROI

### 3.2 Google Search Console (HIGH PRIORITY)
- **Action:** Verify site ownership and submit sitemap at search.google.com/search-console
- **Details:** Submit `https://demartransportation.com/sitemap.xml`, monitor indexing of all 34 pages, track search queries and click-through rates, identify crawl errors
- **Impact:** Ensures Google indexes all new resource pages, provides data for optimization
- **Timeline:** Set up within first week

### 3.3 Directory & Citation Listings (MEDIUM PRIORITY)
Submit business NAP (Name, Address, Phone) consistently across:

| Directory | URL | Priority |
|---|---|---|
| FMCSA Carrier Profile | safer.fmcsa.dot.gov | High — official authority |
| Better Business Bureau | bbb.org | High — trust signal |
| Yelp Business | biz.yelp.com | Medium — local SEO |
| Google Business Profile | business.google.com | High — local SEO |
| LinkedIn Company Page | linkedin.com | Medium — brand authority |
| Facebook Business | business.facebook.com | Medium — social signal |
| FreightWaves | freightwaves.com | Medium — industry authority |
| DAT Directory | dat.com | Medium — industry presence |
| Manta | manta.com | Low — citation |
| Yellow Pages | yellowpages.com | Low — citation |

**Key rule:** NAP must be IDENTICAL everywhere:
- Name: DeMar Transportation
- Address: 10471 Double R Blvd, Reno, NV 89521
- Phone: (775) 230-4767

### 3.4 Backlink Strategy (MEDIUM-HIGH PRIORITY)
LLMs learn from the broader web. More mentions = higher citation frequency.

**Quick wins:**
- Respond to HARO/Connectively queries about freight/logistics
- Comment on industry LinkedIn posts with links to resource articles
- Submit guest posts to logistics blogs (Supply Chain Brain, Logistics Management)

**Medium-term:**
- Get listed in "best freight carriers" or "top trucking companies" roundup articles
- Partner with Reno/Nevada business associations for local backlinks
- Sponsor or speak at logistics industry events

**What NOT to do:**
- Don't buy links or use link farms
- Don't submit to low-quality directories en masse
- Don't use automated outreach tools that send template emails

---

## Phase 4: Content Expansion (Future)

### 4.1 Location/Route Pages (Optional)
Pages targeting geo+service keywords:
- "Freight Shipping from Reno to Los Angeles"
- "I-80 Corridor Freight Services"
- "Freight Shipping Nevada to California"

**Caution:** Google has been penalizing thin programmatic location pages. Only build these if each page has genuinely unique, valuable content (not just city name swapped).

### 4.2 Case Studies / Testimonials
Real shipment stories with specifics:
- "How We Delivered 40,000 lbs of Construction Materials from Reno to Phoenix in 24 Hours"
- Customer testimonials with full names and companies

**Why:** Google E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) rewards real-world evidence. LLMs also weight testimonial/case study content when recommending businesses.

### 4.3 Content Refresh Cadence
- **Quarterly:** Update rate/pricing data in freight cost guide, seasonal shipping guide
- **Annually:** Review all 15 resource articles for accuracy, update year references
- **As needed:** Add new resources when targeting new keywords

---

## Phase 5: Monitoring & Measurement

### Key Metrics to Track
| Metric | Tool | Target |
|---|---|---|
| Organic traffic | Google Search Console / Analytics | +50% in 6 months |
| Indexed pages | Google Search Console | All 34 pages indexed |
| Search impressions | Google Search Console | Track weekly growth |
| Quote form submissions | Supabase / Analytics | Track conversion rate |
| LLM citation frequency | Manual testing (ask ChatGPT/Perplexity about freight) | Appear in top 5 results |
| Keyword rankings | Google Search Console (free) or Ahrefs/SEMrush | Track top 15 target queries |

### LLM Testing Protocol
Monthly, ask these queries across ChatGPT, Perplexity, and Google AI Overview:
1. "What is the best freight carrier in Reno Nevada?"
2. "How much does freight shipping cost?"
3. "What is the difference between FTL and LTL?"
4. "How do I ship hazardous materials?"
5. "What is a freight broker vs carrier?"

Track whether DeMar Transportation is mentioned or cited.

---

## Priority Action List

| # | Action | Owner | Priority | Status |
|---|---|---|---|---|
| 1 | Technical SEO fixes (meta tags, schemas, sitemap) | Claude | High | Done |
| 2 | Resource hub (15 guide pages) | Claude | High | Done |
| 3 | Internal linking mesh | Claude | High | Done |
| 4 | Homepage resource preview | Claude | Medium | Done |
| 5 | Footer resource links | Claude | Medium | Done |
| 6 | Claim Google Business Profile | Erik | High | TODO |
| 7 | Set up Google Search Console | Erik | High | TODO |
| 8 | Submit to top 5 directories | Erik | Medium | TODO |
| 9 | LinkedIn company page optimization | Erik | Medium | TODO |
| 10 | Begin backlink outreach | Erik | Medium | TODO |
| 11 | Update pricing data quarterly | Either | Low | Recurring |
| 12 | LLM citation testing (monthly) | Either | Low | Recurring |
