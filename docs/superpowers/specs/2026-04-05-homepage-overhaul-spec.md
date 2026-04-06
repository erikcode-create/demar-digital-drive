# Homepage Overhaul Spec

**Goal:** Redesign the homepage to use the new design foundation tokens, creating an editorial, typography-led layout that stands apart from generic freight company templates.

**Scope:** Hero, Services, About, ResourcesPreview, Footer components. Does NOT touch Header/navigation, routing, meta tags, or SEO structured data.

---

## 1. Hero Section (Hero.tsx)

### Layout
- **Kill the background image** — replace with a clean split layout
- Left side (60%): editorial text block
- Right side (40%): subtle CSS-only geometric accent (gradient shapes or angled divs using primary/accent colors)
- Full viewport height not required — content-driven height with generous `--space-2xl` vertical padding

### Typography
- **Headline** in `font-serif text-display`: "Driven by Purpose. Delivering Results."
- **Subheadline** in `font-sans text-body`: existing copy about nationwide freight
- **Badge** ("Asset-Based Carrier & Licensed Broker") stays, styled as small caps `text-caption`

### CTAs
- Primary: "Request a Quote" button with `--accent` background, `--accent-foreground` (navy) text
- Secondary: "Call (775) 230-4767" as a text link, not a button

### Trust Strip (replaces floating feature cards + stats bar)
- Single horizontal strip below the hero text
- 6 items in a row: 10+ Equipment Types, 24/7 Availability, 48 States, Safety First, 24/7 Service, US-Based Team
- Clean type on `--surface-low` background, no card borders
- Each item: icon + label, `text-caption` size

### Removed
- Background truck image and gradient overlay
- Floating feature cards (merged into trust strip)
- Scroll indicator chevron animation

---

## 2. Services Grid (Services.tsx)

### Layout — Bento Grid
- **Row 1:** 2 large cards (Dry Van, Reefer) — `span 2.5 columns each` on desktop, full width on mobile
- **Row 2:** 3 medium cards (Flatbed, FTL, LTL) — equal width
- **Row 3:** 5 compact cards (Box Truck, Sprinter Van, Hazmat, 3PL, Warehousing) — equal width

### Section Heading
- `font-serif text-heading`: "Full-Spectrum Freight, One Partner"
- Subtext in `font-sans text-body`

### Card Treatment
- `--space-lg` internal padding, `--radius` corners
- Icons get a tinted background circle (primary color at 10% opacity)
- Large cards: `font-serif text-subheading` title, 2-line description, "Learn more" link
- Medium cards: `font-serif text-subheading` title, 1-line description, "Learn more" link
- Compact cards: `font-sans` bold title, icon only, link on card click
- Hover: `--shadow-float` elevation, no scale transform
- Bottom CTA: "Get a Free Quote" stays

### Mobile
- All cards stack single column
- Large/medium/compact visual distinction maintained via card height and content density

---

## 3. About / Trust Section (About.tsx)

### Section A: Trust Strip
Already defined in Hero section trust strip. The current "Why Choose Us" dark section with 4 differentiator cards is **removed** — its content is absorbed into the hero trust strip.

### Section B: About Content
- **Left column (60%):**
  - Heading in `font-serif text-heading`: "One Partner for All Your Freight"
  - 2-3 short paragraphs of body copy
  - Pull quote: "We don't oversell. We deliver. Your freight is our reputation." — styled with thick left border in `--accent` color, `font-serif text-subheading` italic
- **Right column (40%):**
  - 6 checkmark items as a clean vertical list
  - Each item: checkmark icon + text, `--space-sm` vertical gap between items
- CTAs at bottom: "Request a Quote" primary + "Call (775) 230-4767" text link

### Removed from About
- "Why Choose Us" dark-background card section (merged into hero trust strip)
- Apply to Drive form (belongs on /careers page, not homepage)
- `ApplyToDriveForm` import removed from About.tsx

### Section C: CTA Banner
- Full-width strip with `--accent` background
- `font-serif text-heading` heading: "Ready to Ship?"
- Single CTA button: "Request a Quote" with navy background on gold strip
- Remove the redundant second phone button

---

## 4. Resources Preview (ResourcesPreview.tsx)

### Layout — Editorial List
- Section heading in `font-serif text-heading`: "Freight Shipping Guides"
- **3 items** (not 4): Pricing Guide, FTL vs LTL, Beginner's Guide
- Each item: horizontal row with icon (left) + title + one-line description (right)
- Stacked vertically with `--space-md` gaps
- "View All Resources" link at bottom, always visible (not hidden on desktop)

### Removed
- Card-based grid layout (replaced with editorial list)
- "Types of Freight Trailers" resource (trimmed to 3 highest-value)

---

## 5. Footer (Footer.tsx)

### Layout — 3 Columns
- **Above columns:** Logo + single-line company description
- **Column 1 — Services:** 10 service links (unchanged)
- **Column 2 — Company & Resources:** Merged. About, Careers, Contact, FAQ, then top 4 resource links
- **Column 3 — Contact:** Phone in `font-serif text-subheading` (prominent), email, address, 24/7 note

### Removed
- Separate Insights/Blog column (deduplicated — blog links already in Resources)
- Duplicate links between Resources and Insights columns

### Bottom Bar
- Copyright, Privacy Policy, Terms of Service — unchanged

---

## Design Tokens Consumed

This spec uses the following tokens from the Design Foundation:

| Token | Where Used |
|---|---|
| `font-serif` | All headings (hero, sections, pull quote, footer phone) |
| `font-sans` | Body text, UI elements, compact cards |
| `text-display` | Hero headline |
| `text-heading` | Section headings, CTA banner |
| `text-subheading` | Card titles (large/medium), pull quote, footer phone |
| `text-body` | Paragraphs, descriptions |
| `text-caption` | Hero badge, trust strip items |
| `--space-sm` | List item gaps |
| `--space-md` | Card gaps, resource item gaps |
| `--space-lg` | Card internal padding, between components |
| `--space-xl` | Section padding |
| `--space-2xl` | Hero vertical padding |
| `--radius` | Card corners |
| `--accent` | CTA buttons, pull quote border, CTA banner background |
| `--shadow-float` | Card hover state |
| `--surface-low` | Trust strip background |

---

## Files Modified

| File | Changes |
|---|---|
| `src/components/Hero.tsx` | Full rewrite — typography-led layout, trust strip, remove background image |
| `src/components/Services.tsx` | Bento grid layout, tiered card sizes |
| `src/components/About.tsx` | Simplify to two-column content + CTA banner, remove Apply form and Why Choose Us |
| `src/components/ResourcesPreview.tsx` | Editorial list layout, 3 items |
| `src/components/Footer.tsx` | Consolidate to 3 columns |

## Files NOT Modified

- `src/pages/Index.tsx` — section order unchanged
- `src/components/Header.tsx` — separate concern
- `index.html` — meta tags unchanged
- No new files created
