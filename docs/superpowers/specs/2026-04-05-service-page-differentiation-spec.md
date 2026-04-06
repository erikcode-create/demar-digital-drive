# Service Page Differentiation Spec

**Goal:** Create a shared `ServicePageLayout` template that applies design foundation tokens consistently, adds category-based visual differentiation, and reduces each service page from 400-800 lines of duplicated JSX to ~80 lines of data.

**Scope:** New template component + rewrite of all 10 service pages. Does NOT touch Header, Footer, routing, or App.tsx.

---

## 1. ServicePageLayout Template

### New File: `src/components/ServicePageLayout.tsx`

A single shared component (~250 lines) that renders all service page sections. Each service page passes a data object as props.

### Props Interface

```ts
interface ServicePageProps {
  // Identity
  title: string;              // "Dry Van Shipping Services"
  slug: string;               // "dry-van"
  icon: LucideIcon;           // Package
  category: "standard" | "temperature" | "heavy" | "lastmile" | "logistics";
  badge: string;              // "Most Popular Service"
  description: string;        // Hero subtitle paragraph
  metaTitle: string;          // Document title
  metaDescription: string;    // Meta description

  // Content sections (all optional except overview)
  overview: {
    heading: string;          // "What Is Dry Van Freight Shipping?"
    paragraphs: string[];     // Array of paragraph strings
  };
  capabilities?: {
    heading: string;
    paragraphs: string[];
    subsections?: Array<{ heading: string; items: Array<{ title: string; detail: string }> }>;
  };
  specs?: Array<{ value: string; label: string; desc: string }>;
  cargoTypes?: Array<{ title: string; desc: string }>;
  features?: Array<{ title: string; desc: string }>;
  industries?: Array<{ name: string; detail: string }>;
  whyDemar: {
    paragraphs: string[];
    relatedServices: Array<{ name: string; slug: string }>;
  };
  faq?: Array<{ q: string; a: string }>;
  relatedResources: Array<{ title: string; description: string; to: string }>;

  // Schema
  schema: {
    serviceType: string;      // "Dry Van Freight Shipping"
    serviceDescription: string;
  };
}
```

### Template Sections (rendered in order)

All sections use the design foundation tokens. Sections with no data are skipped.

1. **Meta & Schema** — `useEffect` sets document title/description. JSON-LD for Service, BreadcrumbList, and optionally FAQPage.

2. **Hero** — Category-tinted dark background. Badge, `font-serif text-display` h1, description, CTAs (quote button + phone text link). The category tint is applied as a subtle gradient overlay at 15% opacity.

3. **Overview** — `font-serif text-heading` h2, body paragraphs on `surface` background.

4. **Capabilities** (optional) — `font-serif text-heading` h2, paragraphs, optional subsection cards.

5. **Specs** (optional) — 3-column grid of spec cards on `surface-low` background. Value in `text-heading font-serif text-accent`, label in bold, description in caption.

6. **Cargo Types** (optional) — Responsive grid of small cards with icon + title + description.

7. **Features** (optional) — Two-column list with accent checkmark icons.

8. **Industries** (optional) — Two-column grid of cards.

9. **Why DeMar** — Dark background section with paragraphs and cross-links to related services.

10. **FAQ** (optional) — Stacked cards with Q&A. Only rendered if `faq` array provided.

11. **Related Resources** — Editorial list (matching homepage ResourcesPreview style).

12. **CTA Banner** — Accent background, `font-serif text-heading`, single "Request a Quote" button.

### Shared Layout

The template renders Header and Footer itself (matching current pattern where each service page does this independently).

Skip-to-content accessibility link included at the top.

---

## 2. Category Visual Differentiation

### Category Tint Map

| Category | Services | HSL Tint | Applied To |
|---|---|---|---|
| `standard` | Dry Van, FTL, LTL | None (default navy) | — |
| `temperature` | Reefer | `210 60% 50%` | Hero gradient, spec card accents |
| `heavy` | Flatbed, Hazmat | `30 60% 50%` | Hero gradient, spec card accents |
| `lastmile` | Box Truck, Sprinter Van | `160 50% 45%` | Hero gradient, spec card accents |
| `logistics` | 3PL, Warehousing | `270 40% 50%` | Hero gradient, spec card accents |

### How Tints Apply

- **Hero section:** Background gradient blends primary navy with category tint at 15% opacity. Standard category uses pure navy (no tint).
- **Spec card value color:** Category tint replaces accent gold for the big value text (e.g., "53 ft" in cool blue for reefer). Standard category keeps accent gold.
- **Everything else:** Unchanged. The tint is a whisper, not a theme change.

### Implementation

A `categoryTints` map in the template resolves category to HSL values. Used inline in the hero gradient and spec value color. No new CSS variables needed.

---

## 3. Service Page Data Files

### Migration Pattern

Each service page (e.g., `src/pages/services/DryVan.tsx`) is rewritten from ~400-800 lines to ~80 lines:

```tsx
import ServicePageLayout from "@/components/ServicePageLayout";
import { Package } from "lucide-react";

const DryVan = () => (
  <ServicePageLayout
    title="Dry Van Shipping Services"
    slug="dry-van"
    icon={Package}
    category="standard"
    badge="Most Popular Service"
    // ... all data props
  />
);

export default DryVan;
```

### Content Preservation

All existing content (text, specs, FAQs, schema data) is preserved exactly. The migration is structural, not editorial. No content is added, removed, or reworded.

### Service Category Assignments

| Service | File | Category | Icon |
|---|---|---|---|
| Dry Van | DryVan.tsx | standard | Package |
| Reefer | Reefer.tsx | temperature | Snowflake |
| Flatbed | Flatbed.tsx | heavy | Truck |
| FTL | FTL.tsx | standard | Container |
| LTL | LTL.tsx | standard | Layers |
| Box Truck | BoxTruck.tsx | lastmile | Building |
| Sprinter Van | SprinterVan.tsx | lastmile | Car |
| Hazmat | Hazmat.tsx | heavy | Wrench |
| 3PL | ThirdPartyLogistics.tsx | logistics | Network |
| Warehousing | Warehousing.tsx | logistics | Warehouse |

---

## 4. Design Token Usage

| Token | Where Used |
|---|---|
| `font-serif` | Hero h1, section h2s, spec values, FAQ questions |
| `font-sans` | Body text, descriptions, labels |
| `text-display` | Hero headline |
| `text-heading` | Section h2s, CTA banner |
| `text-subheading` | Spec labels, card titles |
| `text-body` | Paragraphs, descriptions |
| `text-caption` | Badge, labels, small text |
| `--space-md` | Card gaps, internal padding |
| `--space-lg` | Between components |
| `--space-xl` | Section padding |
| `--space-2xl` | Hero padding |
| `--radius` | Card corners |
| `--accent` | CTA buttons, checkmarks, spec values (standard category) |
| `--shadow-float` | Card hover |
| `--shadow-card` | Card resting state |
| `--surface` / `--surface-low` | Alternating section backgrounds |

---

## 5. Files Modified

| File | Action |
|---|---|
| `src/components/ServicePageLayout.tsx` | **Create** — shared template (~250 lines) |
| `src/pages/services/DryVan.tsx` | Rewrite to data + template (~80 lines) |
| `src/pages/services/Reefer.tsx` | Rewrite to data + template |
| `src/pages/services/Flatbed.tsx` | Rewrite to data + template |
| `src/pages/services/FTL.tsx` | Rewrite to data + template |
| `src/pages/services/LTL.tsx` | Rewrite to data + template |
| `src/pages/services/BoxTruck.tsx` | Rewrite to data + template |
| `src/pages/services/SprinterVan.tsx` | Rewrite to data + template |
| `src/pages/services/Hazmat.tsx` | Rewrite to data + template |
| `src/pages/services/ThirdPartyLogistics.tsx` | Rewrite to data + template |
| `src/pages/services/Warehousing.tsx` | Rewrite to data + template |

## Files NOT Modified

- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/pages/Index.tsx`
- `src/App.tsx` (routes unchanged — same component names, same paths)
- No new routes added
