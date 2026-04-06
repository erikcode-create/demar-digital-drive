# Design Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install the typographic, spacing, and color token layer that all subsequent design sub-projects build on — zero component changes.

**Architecture:** Add two font packages (DM Serif Text, Inter Variable), update CSS custom properties in `src/index.css`, and extend `tailwind.config.ts` with font families, font sizes, spacing aliases, and a narrower container. Existing utility classes continue working unchanged.

**Tech Stack:** Tailwind CSS 3.4, @fontsource/dm-serif-text, @fontsource-variable/inter, CSS custom properties (HSL)

**Spec:** `docs/superpowers/specs/2026-04-05-design-foundation-spec.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `package.json` | Modify | Add font packages to dependencies |
| `src/index.css` | Modify | Font imports, updated color tokens, new typography/spacing tokens, body font |
| `tailwind.config.ts` | Modify | Font families, font sizes, spacing aliases, container max-width |

---

### Task 1: Install Font Packages

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install DM Serif Text and Inter Variable**

```bash
cd "/Users/erik/Library/CloudStorage/OneDrive-demarconsultinggroup.com/Claude/DeMar Transportation/DeMar Transportation/DeMar-Transportation-Website" && npm install @fontsource/dm-serif-text @fontsource-variable/inter
```

Expected: Both packages added to `dependencies` in `package.json`. No errors.

- [ ] **Step 2: Verify packages installed**

```bash
cd "/Users/erik/Library/CloudStorage/OneDrive-demarconsultinggroup.com/Claude/DeMar Transportation/DeMar Transportation/DeMar-Transportation-Website" && ls node_modules/@fontsource/dm-serif-text/index.css && ls node_modules/@fontsource-variable/inter/index.css
```

Expected: Both files exist.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add DM Serif Text and Inter Variable font packages"
```

---

### Task 2: Add Font Imports and Update CSS Tokens

**Files:**
- Modify: `src/index.css` (all 132 lines)

- [ ] **Step 1: Add font imports at top of file**

Add these two lines at the very top of `src/index.css`, before `@tailwind base;`:

```css
@import "@fontsource/dm-serif-text/400.css";
@import "@fontsource-variable/inter";
```

The file should now start:

```css
@import "@fontsource/dm-serif-text/400.css";
@import "@fontsource-variable/inter";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 2: Update light mode color tokens**

In the `:root` block, make these changes:

Replace:
```css
    /* Accent: Golden Yellow — precision instrument, CTAs only */
    --accent: 45 97% 54%;
    --accent-foreground: 225 97% 4%;
```

With:
```css
    /* Accent: Golden Yellow — precision instrument, CTAs only */
    --accent: 45 80% 52%;
    --accent-foreground: 225 97% 4%;
```

Replace:
```css
    --background: 240 20% 99%;
```

With:
```css
    --background: 240 10% 98.5%;
```

Replace:
```css
    /* No-Line Rule: borders are ghost-level or absent */
    --border: 240 10% 92%;
```

With:
```css
    /* No-Line Rule: borders are ghost-level or absent */
    --border: 240 6% 91%;
```

Replace:
```css
    --accent-gradient: linear-gradient(45deg, hsl(45 97% 54%), hsl(45 97% 64%));
```

With:
```css
    --accent-gradient: linear-gradient(45deg, hsl(45 80% 52%), hsl(45 80% 62%));
```

Replace:
```css
    --radius: 0.5rem;
```

With:
```css
    --radius: 0.75rem;
```

- [ ] **Step 3: Update dark mode accent token**

In the `.dark` block, replace:
```css
    --accent: 45 97% 54%;
```

With:
```css
    --accent: 45 80% 52%;
```

And replace:
```css
    --ring: 45 97% 54%;
```

With:
```css
    --ring: 45 80% 52%;
```

- [ ] **Step 4: Add typography and spacing tokens to :root**

Add these tokens inside the `:root` block, after the `--transition-bounce` line and before the `--radius` line:

```css
    /* Typography Scale */
    --text-display: clamp(2.5rem, 5vw, 4rem);
    --text-heading: clamp(1.5rem, 3vw, 2.25rem);
    --text-subheading: 1.25rem;
    --text-body: 1rem;
    --text-caption: 0.875rem;

    /* Spacing Scale (4px base grid) */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 2rem;
    --space-xl: 4rem;
    --space-2xl: 6rem;
```

- [ ] **Step 5: Set default body font**

In the second `@layer base` block, update the body rule from:

```css
  body {
    @apply bg-background text-foreground;
  }
```

To:

```css
  body {
    @apply bg-background text-foreground font-sans;
  }
```

- [ ] **Step 6: Verify file renders without syntax errors**

```bash
cd "/Users/erik/Library/CloudStorage/OneDrive-demarconsultinggroup.com/Claude/DeMar Transportation/DeMar Transportation/DeMar-Transportation-Website" && npx tailwindcss -i src/index.css -o /dev/null --minify 2>&1 | head -20
```

Expected: No CSS syntax errors. (Warnings about unused classes are OK.)

- [ ] **Step 7: Commit**

```bash
git add src/index.css
git commit -m "feat: add font imports, update color/spacing/typography tokens"
```

---

### Task 3: Extend Tailwind Config

**Files:**
- Modify: `tailwind.config.ts` (all 121 lines)

- [ ] **Step 1: Add font family extensions**

Inside `theme.extend`, add a `fontFamily` block right before the `colors` block (after line 20, before line 21):

```ts
			fontFamily: {
				serif: ['"DM Serif Text"', 'Georgia', 'serif'],
				sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
			},
```

- [ ] **Step 2: Add font size extensions**

Inside `theme.extend`, add a `fontSize` block after the `fontFamily` block:

```ts
			fontSize: {
				display: ['var(--text-display)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
				heading: ['var(--text-heading)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
				subheading: ['var(--text-subheading)', { lineHeight: '1.3' }],
				body: ['var(--text-body)', { lineHeight: '1.6' }],
				caption: ['var(--text-caption)', { lineHeight: '1.5' }],
			},
```

- [ ] **Step 3: Add spacing aliases**

Inside `theme.extend`, add a `spacing` block after the `fontSize` block:

```ts
			spacing: {
				'space-xs': 'var(--space-xs)',
				'space-sm': 'var(--space-sm)',
				'space-md': 'var(--space-md)',
				'space-lg': 'var(--space-lg)',
				'space-xl': 'var(--space-xl)',
				'space-2xl': 'var(--space-2xl)',
			},
```

- [ ] **Step 4: Update container max-width**

Replace:
```ts
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
```

With:
```ts
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1200px'
			}
		},
```

- [ ] **Step 5: Verify build succeeds**

```bash
cd "/Users/erik/Library/CloudStorage/OneDrive-demarconsultinggroup.com/Claude/DeMar Transportation/DeMar Transportation/DeMar-Transportation-Website" && npm run build 2>&1 | tail -10
```

Expected: Build completes successfully. Output shows `dist/` files generated with no errors.

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: extend Tailwind with font families, type scale, spacing, narrower container"
```

---

### Task 4: Final Verification

- [ ] **Step 1: Run full build**

```bash
cd "/Users/erik/Library/CloudStorage/OneDrive-demarconsultinggroup.com/Claude/DeMar Transportation/DeMar Transportation/DeMar-Transportation-Website" && npm run build
```

Expected: Clean build, no errors.

- [ ] **Step 2: Verify fonts are bundled in dist**

```bash
cd "/Users/erik/Library/CloudStorage/OneDrive-demarconsultinggroup.com/Claude/DeMar Transportation/DeMar Transportation/DeMar-Transportation-Website" && find dist/assets -name "*.woff2" | head -10
```

Expected: At least 2 `.woff2` files (DM Serif Text and Inter Variable).

- [ ] **Step 3: Start dev server and visually confirm**

```bash
cd "/Users/erik/Library/CloudStorage/OneDrive-demarconsultinggroup.com/Claude/DeMar Transportation/DeMar Transportation/DeMar-Transportation-Website" && timeout 10 npm run dev 2>&1 | head -5
```

Expected: Dev server starts on port 8080 without errors. (Font change will be visible as Inter replaces system font for body text.)

- [ ] **Step 4: Run unit tests**

```bash
cd "/Users/erik/Library/CloudStorage/OneDrive-demarconsultinggroup.com/Claude/DeMar Transportation/DeMar Transportation/DeMar-Transportation-Website" && npm run test 2>&1 | tail -20
```

Expected: All existing tests pass. (No tests are expected to break — this is additive CSS/config only.)
