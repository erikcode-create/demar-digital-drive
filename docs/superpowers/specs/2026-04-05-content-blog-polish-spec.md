# Content & Blog Polish Spec

**Goal:** Apply design foundation tokens to the blog index page and BlogPost template, creating an editorial reading experience that cascades to all 14 existing blog posts without modifying individual post files.

**Scope:** Blog.tsx (index) and BlogPost.tsx (template). Does NOT touch individual blog post files, routing, or content.

---

## 1. Blog Index Page (Blog.tsx)

### Hero
- Light `surface` background (not dark) — save dark for service pages
- `font-serif text-display` heading: "Insights"
- Subtitle in `text-body text-muted-foreground`: "Freight shipping guides, industry analysis, and logistics expertise."
- No background image or gradient overlay

### Featured Post
- Most recent post (first in the array) gets a full-width large card
- Title in `font-serif text-heading`
- Description in `text-body`
- Meta line: category pill + date + read time in `text-caption`
- Card uses `surface-low` background, `--radius` corners, `--space-lg` padding
- Hover: `--shadow-float`

### Post Grid
- Remaining 13 posts in a 2-column responsive grid (`md:grid-cols-2`)
- Title in `font-serif text-subheading`
- Description in `text-caption text-muted-foreground`
- Meta line: category pill + date + read time in `text-caption`
- Cards: `surface-low` background, `--radius` corners, `--space-md` padding
- Hover: `--shadow-float`

### Category Pills
- Small inline label before date/readtime
- Styled as rounded pill with category-based background tint:
  - "Pricing & Rates" → `accent/10` text `accent`
  - "Shipping Guides" → `primary/10` text `primary`
  - "Industry Knowledge" → `muted` text `muted-foreground`
  - "Business Strategy" → `primary/10` text `primary`
  - "Technology" → `accent/10` text `accent`
  - Default fallback → `muted` text `muted-foreground`

### Spacing
- Section padding: `--space-2xl`
- Between featured and grid: `--space-xl`
- Grid gap: `--space-md`

---

## 2. BlogPost Template (BlogPost.tsx)

### Hero
- Light `surface` background instead of dark
- `font-serif text-display` for the title
- Subtitle/category in `text-caption` uppercase tracking
- Meta line: publication date + read time in `text-caption text-muted-foreground`
- Description in `text-body text-muted-foreground`
- Hero image (if provided): displayed as a rounded image (`--radius`) below the title with `--space-lg` top margin, NOT as a background overlay. Max height constrained, object-cover.
- If no hero image: just the text, no placeholder

### Article Body (Prose)
- Wrapper with Tailwind prose overrides targeting child elements:
  - `h2` → `font-serif text-heading text-primary` with `--space-xl` top margin
  - `h3` → `font-serif text-subheading text-primary` with `--space-lg` top margin
  - `p` → `text-body text-muted-foreground leading-relaxed`
  - `table` → existing styling preserved
  - `a` (internal links) → `text-accent hover:underline`
- Body max-width: `max-w-3xl` for comfortable reading line length
- Paragraph spacing: `--space-md`

### Inline CTA
- `surface-low` background box with `border-l-4 border-accent` (matching homepage pull quote pattern)
- `--space-lg` padding
- Heading in `font-serif text-subheading`: "Need a Freight Quote?"
- One text paragraph + one "Get a Quote" link styled as text with arrow
- No phone button (simplify)

### FAQ Section
- Keep accordion functionality
- Section heading: `font-serif text-heading`
- Question text: `font-serif text-subheading`
- Answer text: `text-body text-muted-foreground`
- Card background: `surface-low`, `--radius` corners

### Related Articles
- Editorial list style matching homepage ResourcesPreview pattern
- Each item: horizontal row with title (`font-serif text-subheading`) + arrow
- `--space-md` gaps between items
- Hover: title color shifts to accent

### Bottom CTA
- Accent background banner (same pattern as homepage/service pages)
- `font-serif text-heading` heading: "Ready to Ship?"
- Single "Request a Quote" button with primary background

### Preserved
- All JSON-LD schema markup (BlogPosting, FAQPage, BreadcrumbList)
- Meta tag handling via useEffect
- Header/Footer rendering
- Content passed as children/props — individual post files untouched

---

## 3. Design Token Usage

| Token | Where Used |
|---|---|
| `font-serif` | Index heading, post titles, article h2/h3, FAQ questions |
| `font-sans` | Body text, descriptions, meta |
| `text-display` | Index hero heading, article title |
| `text-heading` | Featured post title, article h2s, section headings |
| `text-subheading` | Grid post titles, article h3s, FAQ questions, inline CTA |
| `text-body` | Descriptions, article paragraphs |
| `text-caption` | Meta (date, read time, category), labels |
| `--space-md` | Grid gaps, paragraph spacing, FAQ item gaps |
| `--space-lg` | Card padding, between components |
| `--space-xl` | Between featured and grid, article h2 top margin |
| `--space-2xl` | Section padding |
| `--radius` | Card corners, hero image corners |
| `--accent` | Category pills, CTA border, links |
| `--shadow-float` | Card hover |
| `--surface-low` | Card backgrounds, FAQ cards, inline CTA |

---

## 4. Files Modified

| File | Changes |
|---|---|
| `src/pages/Blog.tsx` | Redesign: featured post + grid, design tokens |
| `src/components/BlogPost.tsx` | Update: light hero, prose overrides, editorial styling |

## Files NOT Modified

- All 14 individual blog post files in `src/pages/blog/` — template changes cascade
- `src/App.tsx` — routing unchanged
- No new files created
