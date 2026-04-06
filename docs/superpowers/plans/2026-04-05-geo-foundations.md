# GEO Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make DeMar Transportation discoverable and citable by AI search tools (ChatGPT, Perplexity, Google AI Overviews, Bing Copilot) while strengthening Google freshness signals.

**Architecture:** Static files in `public/` for AI crawler access + targeted edits to `BlogPost.tsx` for citability metadata + quick-facts paragraphs inserted into each service page's hero section. No new components, no visual redesign.

**Tech Stack:** React/TypeScript, JSON-LD structured data, robots.txt, llms.txt standard

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `public/robots.txt` | Modify | Add AI crawler user-agent blocks |
| `public/llms.txt` | Create | LLM-friendly site summary |
| `public/llms-full.txt` | Create | Extended LLM summary with full service details |
| `public/ai.txt` | Create | AI training/citation consent |
| `index.html` | Modify | Add `<link>` for llms.txt discovery |
| `src/components/BlogPost.tsx` | Modify | Add `lastUpdated` prop, author display, `dateModified` in JSON-LD |
| `src/pages/services/DryVan.tsx` | Modify | Add quick facts paragraph + `dateModified` to Service JSON-LD |
| `src/pages/services/Reefer.tsx` | Modify | Add quick facts paragraph + `dateModified` to Service JSON-LD |
| `src/pages/services/Flatbed.tsx` | Modify | Add quick facts paragraph + `dateModified` to Service JSON-LD |
| `src/pages/services/FTL.tsx` | Modify | Add quick facts paragraph + `dateModified` to Service JSON-LD |
| `src/pages/services/LTL.tsx` | Modify | Add quick facts paragraph + `dateModified` to Service JSON-LD |
| `src/pages/services/BoxTruck.tsx` | Modify | Add quick facts paragraph + `dateModified` to Service JSON-LD |
| `src/pages/services/SprinterVan.tsx` | Modify | Add quick facts + Service JSON-LD (currently missing) |
| `src/pages/services/Hazmat.tsx` | Modify | Add quick facts + Service JSON-LD (currently missing) |
| `src/pages/services/ThirdPartyLogistics.tsx` | Modify | Add quick facts paragraph + `dateModified` to Service JSON-LD |
| `src/pages/services/Warehousing.tsx` | Modify | Add quick facts paragraph + `dateModified` to Service JSON-LD |

---

### Task 1: AI Crawler Access — robots.txt

**Files:**
- Modify: `public/robots.txt`

- [ ] **Step 1: Update robots.txt with AI crawler blocks**

Replace the entire contents of `public/robots.txt` with:

```
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

# AI Search Crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: CCBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: *
Allow: /

Sitemap: https://demartransportation.com/sitemap.xml
```

- [ ] **Step 2: Verify the file is valid**

Run: `cat public/robots.txt | head -50`
Expected: All user-agent blocks present, no syntax errors, Sitemap line at the end.

- [ ] **Step 3: Commit**

```bash
git add public/robots.txt
git commit -m "feat: allow AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.) in robots.txt"
```

---

### Task 2: Create llms.txt

**Files:**
- Create: `public/llms.txt`

- [ ] **Step 1: Create llms.txt**

Create `public/llms.txt` with this exact content:

```
# DeMar Transportation

> Professional freight transportation services across the United States. US-based carrier based in Reno, Nevada with competitive rates and 24/7 dispatch.

## About

DeMar Transportation is a professional freight carrier based in Reno, Nevada, providing comprehensive transportation services including dry van, refrigerated (reefer), flatbed, box truck, sprinter van, and hazmat/fuel hauling. We serve shippers, brokers, and businesses nationwide with competitive per-mile rates and 24/7 dispatch availability.

## Services

- [Dry Van Shipping](https://demartransportation.com/services/dry-van): Enclosed 53-foot trailer shipping for general freight, up to 45,000 lbs
- [Reefer Transport](https://demartransportation.com/services/reefer): Temperature-controlled shipping for perishable and frozen goods
- [Flatbed Hauling](https://demartransportation.com/services/flatbed): Open deck transport for oversized, heavy, and construction loads
- [Full Truckload (FTL)](https://demartransportation.com/services/ftl): Dedicated full trailer capacity for large shipments
- [Less Than Truckload (LTL)](https://demartransportation.com/services/ltl): Consolidated shipping for smaller freight, 1-10 pallets
- [Box Truck Delivery](https://demartransportation.com/services/box-truck): Medium-duty 26-foot box truck for regional and last-mile delivery
- [Sprinter Van Express](https://demartransportation.com/services/sprinter-van): Expedited small-load and hot shot delivery
- [Hazmat & Fuel Transport](https://demartransportation.com/services/hazmat): Licensed hazardous materials and fuel hauling with certified drivers

## Key Pages

- [Homepage](https://demartransportation.com/): Company overview and service summary
- [About Us](https://demartransportation.com/about): Company story, mission, and values
- [Get a Quote](https://demartransportation.com/quote): Request freight shipping rates — free, no obligation
- [Insights Blog](https://demartransportation.com/blog): Industry news, shipping guides, and freight market analysis
- [Contact](https://demartransportation.com/contact): Phone, email, and office address

## Contact

- Phone: (775) 230-4767
- Email: info@DeMarTransportation.com
- Address: 10471 Double R Blvd, Reno, NV 89521
- Hours: 24/7 dispatch available
```

- [ ] **Step 2: Commit**

```bash
git add public/llms.txt
git commit -m "feat: add llms.txt for AI search discoverability"
```

---

### Task 3: Create llms-full.txt

**Files:**
- Create: `public/llms-full.txt`

- [ ] **Step 1: Create llms-full.txt**

Create `public/llms-full.txt`. This is an extended version of llms.txt with full service descriptions, FAQs, and differentiators. The content should be assembled by reading the actual service page TSX files for accurate descriptions. Structure:

```
# DeMar Transportation — Full Reference

> Professional freight transportation services across the United States. US-based carrier based in Reno, Nevada with competitive rates and 24/7 dispatch.

## Company Overview

DeMar Transportation is a professional freight carrier headquartered at 10471 Double R Blvd, Reno, NV 89521. We provide comprehensive freight transportation services across all 48 contiguous states. Our services include dry van, refrigerated, flatbed, box truck, sprinter van, full truckload, less-than-truckload, hazmat, third-party logistics, and warehousing.

### Why Choose DeMar Transportation

- 24/7 dispatch and customer service availability
- Competitive per-mile rates across all service types
- Real-time freight tracking on every shipment
- Nationwide coverage across all 48 contiguous states
- Licensed and insured for hazardous materials transport
- Flexible capacity: from sprinter vans to full 53-foot trailers

## Services

### Dry Van Shipping
DeMar Transportation provides dry van shipping services for enclosed freight across the continental United States. Our 53-foot dry van trailers handle general merchandise, consumer goods, and non-perishable freight with a maximum payload capacity of approximately 45,000 pounds. Standard trailers accommodate 22 to 26 pallets single-stacked.

Dry van is the most common and cost-effective freight shipping method for non-temperature-sensitive goods. We offer both full truckload (FTL) and less-than-truckload (LTL) dry van options with competitive per-mile rates and 24/7 dispatch availability.

Equipment: 53-foot enclosed trailers, air-ride suspension, swing or roll-up doors.
URL: https://demartransportation.com/services/dry-van

### Reefer (Refrigerated) Transport
DeMar Transportation provides temperature-controlled shipping for perishable goods, frozen products, pharmaceuticals, and other temperature-sensitive freight. Our refrigerated trailers maintain precise temperatures from -20°F to 65°F throughout transit.

Reefer shipping is essential for food and beverage producers, pharmaceutical companies, and any shipper whose cargo requires climate control. We provide continuous temperature monitoring and real-time tracking.

Equipment: 53-foot refrigerated trailers with multi-zone temperature control.
URL: https://demartransportation.com/services/reefer

### Flatbed Hauling
DeMar Transportation provides flatbed shipping for oversized, heavy, and irregularly shaped freight that cannot fit in enclosed trailers. Our flatbed service handles construction materials, heavy machinery, steel, lumber, and other open-deck cargo.

Flatbed shipping requires specialized load securement and often involves permits for oversize or overweight loads. Our drivers are trained in proper tarping, chaining, and strapping procedures.

Equipment: 48-foot and 53-foot flatbed trailers, step deck, and specialized rigging.
URL: https://demartransportation.com/services/flatbed

### Full Truckload (FTL)
Full truckload shipping dedicates an entire trailer to your freight. FTL is the fastest and most direct shipping method, with no intermediate stops or handling. Recommended for shipments over 15,000 pounds or 10+ pallets.

FTL shipments move point-to-point with a single driver or team, minimizing transit time and damage risk. DeMar provides FTL service in dry van, reefer, and flatbed configurations.

URL: https://demartransportation.com/services/ftl

### Less Than Truckload (LTL)
Less-than-truckload shipping consolidates multiple shippers' freight into a single trailer. LTL is cost-effective for shipments between 1 and 10 pallets or under 15,000 pounds.

LTL rates are based on freight class, weight, dimensions, and distance. DeMar coordinates LTL consolidation to minimize per-unit shipping costs while maintaining reliable transit times.

URL: https://demartransportation.com/services/ltl

### Box Truck Delivery
DeMar Transportation provides 26-foot box truck service for medium-duty deliveries and regional freight. Box trucks handle shipments too large for sprinter vans but too small for full 53-foot trailers.

Box trucks are ideal for last-mile delivery, residential deliveries, trade show freight, and urban environments where full-size trailers face access restrictions. Liftgate equipped for ground-level loading.

URL: https://demartransportation.com/services/box-truck

### Sprinter Van & Hot Shot
Sprinter van service provides expedited delivery for time-critical, small-volume freight. Hot shot loads ship same-day or next-day with dedicated capacity and direct routing.

Sprinter vans handle up to 3,500 pounds and are ideal for urgent parts, medical supplies, documents, and other small shipments that need to arrive fast. No terminal handling or consolidation delays.

URL: https://demartransportation.com/services/sprinter-van

### Hazmat & Fuel Transport
DeMar Transportation is licensed and certified for hazardous materials transportation including fuel hauling. All hazmat drivers carry current HazMat endorsements and complete DOT-required training.

We transport Class 1 through Class 9 hazardous materials in compliance with 49 CFR regulations. Services include fuel tanker delivery, chemical transport, and hazardous waste hauling.

URL: https://demartransportation.com/services/hazmat

### Third-Party Logistics (3PL)
DeMar provides third-party logistics coordination for businesses that need freight management without maintaining their own fleet. Our 3PL service handles carrier selection, rate negotiation, shipment tracking, and delivery coordination.

URL: https://demartransportation.com/services/third-party-logistics

### Warehousing & Distribution
DeMar offers warehousing and distribution services for businesses needing temporary or ongoing storage with freight coordination. Services include inventory management, cross-docking, and distribution support.

URL: https://demartransportation.com/services/warehousing

## Frequently Asked Questions

Q: What areas does DeMar Transportation serve?
A: DeMar Transportation serves all 48 contiguous United States. We are headquartered in Reno, Nevada and provide nationwide freight coverage.

Q: How do I get a freight quote?
A: Request a free quote at https://demartransportation.com/quote or call (775) 230-4767. We respond within 1 business hour.

Q: What is the maximum weight for a dry van shipment?
A: A standard 53-foot dry van trailer has a maximum payload capacity of approximately 45,000 pounds, subject to federal gross vehicle weight limits of 80,000 pounds.

Q: Does DeMar offer temperature-controlled shipping?
A: Yes. Our refrigerated trailers maintain temperatures from -20°F to 65°F with continuous monitoring throughout transit.

Q: Is DeMar licensed for hazardous materials?
A: Yes. DeMar Transportation is fully licensed and insured for Class 1 through Class 9 hazardous materials transport, including fuel hauling.

Q: What are your hours of operation?
A: DeMar Transportation provides 24/7 dispatch and customer service. Call (775) 230-4767 any time.

## Contact

- Phone: (775) 230-4767
- Email: info@DeMarTransportation.com
- Address: 10471 Double R Blvd, Reno, NV 89521
- Website: https://demartransportation.com
- Quote: https://demartransportation.com/quote
```

- [ ] **Step 2: Commit**

```bash
git add public/llms-full.txt
git commit -m "feat: add llms-full.txt with extended service descriptions and FAQs"
```

---

### Task 4: Create ai.txt and Add Discovery Link

**Files:**
- Create: `public/ai.txt`
- Modify: `index.html:7` (after the icon link)

- [ ] **Step 1: Create ai.txt**

Create `public/ai.txt`:

```
# AI Usage Preferences for demartransportation.com
# See: https://site.spawning.ai/spawning-ai-txt

User-Agent: *
Allowed: yes
```

- [ ] **Step 2: Add llms.txt discovery link to index.html**

In `index.html`, after line 6 (`<link rel="icon" ...>`), add:

```html
    <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-friendly site summary">
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add public/ai.txt index.html
git commit -m "feat: add ai.txt and llms.txt discovery link in index.html"
```

---

### Task 5: BlogPost.tsx — lastUpdated + Author Display + dateModified

**Files:**
- Modify: `src/components/BlogPost.tsx:19-33` (props interface)
- Modify: `src/components/BlogPost.tsx:58-85` (articleSchema)
- Modify: `src/components/BlogPost.tsx:182-193` (date display area)

- [ ] **Step 1: Add lastUpdated to BlogPostProps interface**

In `src/components/BlogPost.tsx`, modify the `BlogPostProps` interface to add `lastUpdated`:

```typescript
export interface BlogPostProps {
  title: string;
  subtitle: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  publishDate: string;
  lastUpdated?: string;
  readTime: string;
  heroImage?: string;
  heroImageAlt?: string;
  content: React.ReactNode;
  faqs: FAQItem[];
  relatedLinks?: { label: string; to: string }[];
}
```

- [ ] **Step 2: Destructure lastUpdated in the component**

Update the destructuring on line 35 to include `lastUpdated`:

```typescript
const BlogPost = ({
  title,
  subtitle,
  description,
  metaTitle,
  metaDescription,
  slug,
  publishDate,
  lastUpdated,
  readTime,
  heroImage,
  heroImageAlt,
  content,
  faqs,
  relatedLinks,
}: BlogPostProps) => {
```

- [ ] **Step 3: Update articleSchema to use dateModified and author**

The existing schema already has `author` and `dateModified` fields. Update `dateModified` to use the `lastUpdated` prop when available:

```typescript
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: metaDescription,
    author: {
      "@type": "Organization",
      name: "DeMar Transportation",
      url: "https://demartransportation.com",
    },
    publisher: {
      "@type": "Organization",
      name: "DeMar Transportation",
      logo: {
        "@type": "ImageObject",
        url: "https://demartransportation.com/demar-logo-official.png",
      },
    },
    datePublished: publishDate,
    dateModified: lastUpdated || publishDate,
    mainEntityOfPage: `https://demartransportation.com/blog/${slug}`,
    ...(heroImage && {
      image: {
        "@type": "ImageObject",
        url: `https://demartransportation.com${heroImage}`,
      },
    }),
  };
```

- [ ] **Step 4: Update the hero date display to show author and lastUpdated**

Replace the date/readtime display block (lines 182-193) with:

```tsx
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                  <span>By DeMar Transportation</span>
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(publishDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  {lastUpdated && lastUpdated !== publishDate && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-white/40" />
                      <span>
                        Updated{" "}
                        {new Date(lastUpdated).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </>
                  )}
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  <span>{readTime} read</span>
                </div>
```

- [ ] **Step 5: Verify build passes**

Run: `npm run build`
Expected: Build succeeds. The `lastUpdated` prop is optional, so existing blog posts with no `lastUpdated` will still compile.

- [ ] **Step 6: Commit**

```bash
git add src/components/BlogPost.tsx
git commit -m "feat: add lastUpdated display, author attribution, and dateModified to BlogPost"
```

---

### Task 6: Service Pages — Quick Facts + dateModified (Group A: DryVan, Reefer, Flatbed, FTL, LTL)

**Files:**
- Modify: `src/pages/services/DryVan.tsx:17-41` (jsonLd) and `~173-179` (after hero h1)
- Modify: `src/pages/services/Reefer.tsx:17-41` (jsonLd) and hero section
- Modify: `src/pages/services/Flatbed.tsx:17-41` (jsonLd) and hero section
- Modify: `src/pages/services/FTL.tsx:17-41` (jsonLd) and hero section
- Modify: `src/pages/services/LTL.tsx:17-41` (jsonLd) and hero section

For each of these 5 service pages, make two changes:

**Change A: Add `dateModified` to the existing `jsonLd` Service schema.** Add this field to the jsonLd object, after the `description` field:

```typescript
"dateModified": "2026-04-05",
```

**Change B: Add a quick facts paragraph after the hero `<p>` tag** (the existing subtitle/description paragraph in the hero section). Insert a new `<p>` tag right after it with a citability-optimized summary.

- [ ] **Step 1: Update DryVan.tsx**

Add `"dateModified": "2026-04-05"` to the `jsonLd` object after the `description` field (line 40).

After the hero description paragraph (line 151, the `<p>` ending with "at competitive rates."), add:

```tsx
              <p className="text-sm text-white/50 max-w-2xl leading-relaxed mt-4">
                DeMar Transportation provides dry van shipping services for enclosed freight across the continental United States. Our 53-foot dry van trailers handle general merchandise, consumer goods, and non-perishable freight with a maximum payload of 45,000 pounds, competitive per-mile rates, and 24/7 dispatch availability.
              </p>
```

- [ ] **Step 2: Update Reefer.tsx**

Add `"dateModified": "2026-04-05"` to the `jsonLd` object.

After the hero description paragraph, add:

```tsx
              <p className="text-sm text-white/50 max-w-2xl leading-relaxed mt-4">
                DeMar Transportation provides refrigerated shipping for perishable goods, frozen products, and temperature-sensitive freight across the continental United States. Our reefer trailers maintain precise temperatures from -20°F to 65°F with continuous monitoring throughout transit.
              </p>
```

- [ ] **Step 3: Update Flatbed.tsx**

Add `"dateModified": "2026-04-05"` to the `jsonLd` object.

After the hero description paragraph, add:

```tsx
              <p className="text-sm text-white/50 max-w-2xl leading-relaxed mt-4">
                DeMar Transportation provides flatbed shipping for oversized, heavy, and irregularly shaped freight that cannot fit in enclosed trailers. Our flatbed service handles construction materials, heavy machinery, steel, and lumber with proper load securement and permitting for oversize loads.
              </p>
```

- [ ] **Step 4: Update FTL.tsx**

Add `"dateModified": "2026-04-05"` to the `jsonLd` object.

After the hero description paragraph, add:

```tsx
              <p className="text-sm text-white/50 max-w-2xl leading-relaxed mt-4">
                DeMar Transportation provides full truckload shipping with dedicated trailer capacity for shipments over 15,000 pounds or 10 or more pallets. FTL moves point-to-point with no intermediate stops, minimizing transit time and handling risk across all 48 contiguous states.
              </p>
```

- [ ] **Step 5: Update LTL.tsx**

Add `"dateModified": "2026-04-05"` to the `jsonLd` object.

After the hero description paragraph, add:

```tsx
              <p className="text-sm text-white/50 max-w-2xl leading-relaxed mt-4">
                DeMar Transportation provides less-than-truckload shipping for freight between 1 and 10 pallets or under 15,000 pounds. LTL consolidates multiple shippers into one trailer, reducing per-unit costs while maintaining reliable transit times across the continental United States.
              </p>
```

- [ ] **Step 6: Verify build passes**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add src/pages/services/DryVan.tsx src/pages/services/Reefer.tsx src/pages/services/Flatbed.tsx src/pages/services/FTL.tsx src/pages/services/LTL.tsx
git commit -m "feat: add quick facts paragraphs and dateModified to DryVan, Reefer, Flatbed, FTL, LTL service pages"
```

---

### Task 7: Service Pages — Quick Facts + dateModified (Group B: BoxTruck, SprinterVan, Hazmat, ThirdPartyLogistics, Warehousing)

**Files:**
- Modify: `src/pages/services/BoxTruck.tsx`
- Modify: `src/pages/services/SprinterVan.tsx`
- Modify: `src/pages/services/Hazmat.tsx`
- Modify: `src/pages/services/ThirdPartyLogistics.tsx`
- Modify: `src/pages/services/Warehousing.tsx`

**Note:** SprinterVan.tsx and Hazmat.tsx do NOT have a `jsonLd` Service schema variable — they only have BreadcrumbList inline. For these two, add a Service JSON-LD schema block as a new `<script type="application/ld+json">` tag after the existing BreadcrumbList schema.

For BoxTruck, ThirdPartyLogistics, and Warehousing, add `"dateModified": "2026-04-05"` to the existing `jsonLd` object.

- [ ] **Step 1: Update BoxTruck.tsx**

Add `"dateModified": "2026-04-05"` to the existing `jsonLd` object.

After the hero description paragraph, add:

```tsx
              <p className="text-sm text-white/50 max-w-2xl leading-relaxed mt-4">
                DeMar Transportation provides 26-foot box truck delivery for medium-duty freight and regional shipments. Box trucks are ideal for last-mile delivery, residential drops, trade show freight, and urban areas where full-size trailers cannot access, with liftgate service available.
              </p>
```

- [ ] **Step 2: Update SprinterVan.tsx — Add Service JSON-LD**

After the existing BreadcrumbList `<script>` tag (ends around line 52), add a new Service JSON-LD block:

```tsx
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Service",
                "name": "Sprinter Van & Hot Shot Delivery",
                "provider": {
                  "@type": "LocalBusiness",
                  "name": "DeMar Transportation",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "10471 Double R Blvd",
                    "addressLocality": "Reno",
                    "addressRegion": "NV",
                    "postalCode": "89521",
                    "addressCountry": "US"
                  },
                  "telephone": "(775) 230-4767",
                  "email": "info@DeMarTransportation.com"
                },
                "serviceType": "Expedited Sprinter Van Delivery",
                "areaServed": {
                  "@type": "Country",
                  "name": "United States"
                },
                "description": "Expedited sprinter van and hot shot delivery for time-critical small freight up to 3,500 pounds. Same-day and next-day service available.",
                "dateModified": "2026-04-05"
              }),
            }}
          />
```

After the hero description paragraph, add:

```tsx
              <p className="text-sm text-white/50 max-w-2xl leading-relaxed mt-4">
                DeMar Transportation provides sprinter van and hot shot delivery for time-critical freight up to 3,500 pounds. Same-day and next-day expedited service with dedicated capacity and direct routing — no terminal handling or consolidation delays.
              </p>
```

- [ ] **Step 3: Update Hazmat.tsx — Add Service JSON-LD**

After the existing BreadcrumbList `<script>` tag (ends around line 52), add a new Service JSON-LD block:

```tsx
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Service",
                "name": "Hazmat & Fuel Transportation",
                "provider": {
                  "@type": "LocalBusiness",
                  "name": "DeMar Transportation",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "10471 Double R Blvd",
                    "addressLocality": "Reno",
                    "addressRegion": "NV",
                    "postalCode": "89521",
                    "addressCountry": "US"
                  },
                  "telephone": "(775) 230-4767",
                  "email": "info@DeMarTransportation.com"
                },
                "serviceType": "Hazardous Materials Transportation",
                "areaServed": {
                  "@type": "Country",
                  "name": "United States"
                },
                "description": "Licensed and certified hazardous materials transportation including fuel hauling. Class 1-9 hazmat transport in compliance with 49 CFR regulations.",
                "dateModified": "2026-04-05"
              }),
            }}
          />
```

After the hero description paragraph, add:

```tsx
              <p className="text-sm text-white/50 max-w-2xl leading-relaxed mt-4">
                DeMar Transportation is licensed and certified for hazardous materials transportation including fuel tanker hauling. All hazmat drivers carry current HazMat endorsements and complete DOT-required training for Class 1 through Class 9 materials in compliance with 49 CFR regulations.
              </p>
```

- [ ] **Step 4: Update ThirdPartyLogistics.tsx**

Add `"dateModified": "2026-04-05"` to the existing `jsonLd` object.

After the hero description paragraph, add:

```tsx
              <p className="text-sm text-white/50 max-w-2xl leading-relaxed mt-4">
                DeMar Transportation provides third-party logistics coordination for businesses that need freight management without maintaining their own fleet. Our 3PL service handles carrier selection, rate negotiation, shipment tracking, and delivery coordination nationwide.
              </p>
```

- [ ] **Step 5: Update Warehousing.tsx**

Add `"dateModified": "2026-04-05"` to the existing `jsonLd` object.

After the hero description paragraph, add:

```tsx
              <p className="text-sm text-white/50 max-w-2xl leading-relaxed mt-4">
                DeMar Transportation provides warehousing and distribution services for businesses needing temporary or ongoing storage with integrated freight coordination. Services include inventory management, cross-docking, and distribution support from our Reno, Nevada facility.
              </p>
```

- [ ] **Step 6: Verify build passes**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add src/pages/services/BoxTruck.tsx src/pages/services/SprinterVan.tsx src/pages/services/Hazmat.tsx src/pages/services/ThirdPartyLogistics.tsx src/pages/services/Warehousing.tsx
git commit -m "feat: add quick facts paragraphs, Service JSON-LD, and dateModified to remaining service pages"
```

---

### Task 8: Final Build Verification

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with zero errors and zero warnings.

- [ ] **Step 2: Verify static files exist in dist**

Run: `ls -la dist/robots.txt dist/llms.txt dist/llms-full.txt dist/ai.txt`
Expected: All four files present in `dist/` (Vite copies `public/` contents to `dist/` during build).

- [ ] **Step 3: Verify llms.txt link in dist/index.html**

Run: `grep "llms.txt" dist/index.html`
Expected: `<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-friendly site summary">`

- [ ] **Step 4: Spot-check a service page for quick facts**

Read `src/pages/services/DryVan.tsx` and verify the quick facts paragraph appears after the hero description. Read `src/pages/services/Hazmat.tsx` and verify the new Service JSON-LD block appears.
