# Design Foundation Spec

**Goal:** Establish the typographic, spacing, and color token layer that all subsequent design sub-projects build on.

**Scope:** CSS variables, Tailwind config, font packages. Zero component changes.

---

## 1. Typography

### Font Pairing

- **Headings (H1–H3):** DM Serif Text — chunky editorial serif, 2026 serif renaissance trend
- **Body/UI:** Inter Variable — clean, legible, variable font with excellent OpenType support
- **Packages:** `@fontsource/dm-serif-text`, `@fontsource-variable/inter`
- **Loading:** Bundled via npm (no CDN), imported in `src/index.css`

### Type Scale (5 sizes)

| Token | Value | Use | Font |
|---|---|---|---|
| `--text-display` | `clamp(2.5rem, 5vw, 4rem)` | Hero headlines | DM Serif Text |
| `--text-heading` | `clamp(1.5rem, 3vw, 2.25rem)` | Section H2s | DM Serif Text |
| `--text-subheading` | `1.25rem` | H3, card titles | DM Serif Text |
| `--text-body` | `1rem` | Paragraphs, UI | Inter |
| `--text-caption` | `0.875rem` | Labels, metadata | Inter |

Fluid sizing via `clamp()` — no breakpoint-based typography overrides needed.

### Tailwind Font Families

```ts
fontFamily: {
  serif: ['"DM Serif Text"', 'Georgia', 'serif'],
  sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
}
```

Default `font-sans` applied to `<body>` via Tailwind's base layer.

---

## 2. Spacing & Layout

### Spacing Tokens (4px base grid)

| Token | Value | Use |
|---|---|---|
| `--space-xs` | `0.25rem` (4px) | Icon gaps, tight padding |
| `--space-sm` | `0.5rem` (8px) | Inline element spacing |
| `--space-md` | `1rem` (16px) | Component internal padding |
| `--space-lg` | `2rem` (32px) | Between components |
| `--space-xl` | `4rem` (64px) | Section padding |
| `--space-2xl` | `6rem` (96px) | Hero/major section breaks |

### Layout

- **Container max-width:** 1200px (down from 1400px)
- **Border radius:** `--radius: 0.75rem` (up from 0.5rem)

---

## 3. Color Refinements

### Changed Tokens

| Token | Current | New | Rationale |
|---|---|---|---|
| `--accent` | `45 97% 54%` | `45 80% 52%` | Desaturate 97→80%. Still gold, stops vibrating against navy. WCAG-safe on dark |
| `--accent-foreground` | `0 0% 0%` | `225 97% 4%` | Navy on gold instead of pure black — palette cohesion |
| `--background` | `240 20% 99%` | `240 10% 98.5%` | Less blue-tinted white, cleaner neutral |
| `--border` | `240 10% 92%` | `240 6% 91%` | Softer borders |
| `--radius` | `0.5rem` | `0.75rem` | Slightly rounder cards, organic trend |

### Updated Gradient

```css
--accent-gradient: linear-gradient(45deg, hsl(45 80% 52%), hsl(45 80% 62%));
```

### Unchanged

Primary navy, foreground, destructive, surface stack, dark mode structure, shadow tokens — all remain as-is.

### Dark Mode Accent Adjustments

Same hue shift applied to dark mode accent values to maintain consistency.

---

## 4. Implementation Strategy

### Approach: Token-first, zero visual changes

1. Install font packages
2. Import fonts in `src/index.css`
3. Update CSS custom properties (colors, spacing, typography, radius)
4. Extend `tailwind.config.ts` (font families, font sizes, spacing aliases)
5. Set default `font-sans` on body

### What this does NOT change

- No component modifications
- No page layouts
- No visual differences (tokens defined but not yet consumed)
- Existing Tailwind utility classes continue working unchanged

### Files Touched

- `package.json` — add font packages
- `src/index.css` — font imports, updated CSS variables, new tokens
- `tailwind.config.ts` — font families, font sizes, spacing, container width

### Verification

- `npm run build` succeeds
- Dev server renders without errors
- No visible regressions (tokens are additive, not replacing existing classes yet)
