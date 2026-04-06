# QA System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 13-component QA system with agent-aware layered testing, staging branch gating, visual regression, rollback automation, and post-deploy smoke tests for the DeMar Transportation website.

**Architecture:** Agent output validators and diff validators catch issues inside the pipeline. Agents push to `staging` branch. CI runs lint, unit tests, E2E (Playwright visual/CTA/accessibility/business facts), and build verification in parallel. On pass, auto-merge to main triggers deploy + post-deploy smoke tests. On smoke failure, auto-revert. Nightly scheduled screenshots catch environmental drift.

**Tech Stack:** Vitest (unit tests), Playwright (E2E + smoke + visual regression), axe-core (accessibility), Husky + lint-staged (pre-commit), GitHub Actions (CI/CD)

**Spec:** `docs/superpowers/specs/2026-04-03-qa-system-design.md`

---

## Phase 1: Tooling & First Unit Tests

### Task 1: Install test dependencies and configure Vitest

**Files:**
- Modify: `package.json`
- Create: `tests/vitest.config.ts`
- Create: `tests/unit/.gitkeep`

- [ ] **Step 1: Install Vitest and Husky dependencies**

```bash
cd /Users/erik/Library/CloudStorage/OneDrive-demarconsultinggroup.com/Claude/DeMar\ Transportation/DeMar\ Transportation/DeMar-Transportation-Website
npm install --save-dev vitest husky lint-staged
```

- [ ] **Step 2: Create Vitest config**

Create `tests/vitest.config.ts`:
```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    root: path.resolve(__dirname, ".."),
    include: ["tests/unit/**/*.test.{ts,mts}"],
    environment: "node",
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
});
```

- [ ] **Step 3: Add test scripts to package.json**

Add to the `"scripts"` section of `package.json`:
```json
"test": "vitest run --config tests/vitest.config.ts",
"test:watch": "vitest --config tests/vitest.config.ts",
"test:unit": "vitest run --config tests/vitest.config.ts",
"prepare": "husky"
```

- [ ] **Step 4: Run vitest to verify config works (expect 0 tests)**

```bash
npm run test:unit
```
Expected: "No test files found" or similar — confirms Vitest is configured correctly.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tests/vitest.config.ts
git commit -m "feat: add Vitest and Husky dependencies with test config"
```

---

### Task 2: Install Playwright and configure for E2E

**Files:**
- Modify: `package.json`
- Create: `tests/playwright.config.ts`
- Create: `tests/e2e/.gitkeep`
- Create: `tests/smoke/.gitkeep`

- [ ] **Step 1: Install Playwright**

```bash
npm install --save-dev @playwright/test @axe-core/playwright
npx playwright install chromium
```

- [ ] **Step 2: Create Playwright config**

Create `tests/playwright.config.ts`:
```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",
  use: {
    baseURL: process.env.SMOKE_BASE_URL || "http://localhost:8080",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop-chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: process.env.SMOKE_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:8080",
        reuseExistingServer: !process.env.CI,
        cwd: "..",
      },
});
```

- [ ] **Step 3: Add Playwright scripts to package.json**

Add to `"scripts"`:
```json
"test:e2e": "playwright test --config tests/playwright.config.ts",
"test:e2e:visual": "playwright test tests/e2e/visual/ --config tests/playwright.config.ts",
"test:smoke": "SMOKE_BASE_URL=https://demartransportation.com playwright test tests/smoke/ --config tests/playwright.config.ts",
"test:update-snapshots": "playwright test tests/e2e/visual/ --config tests/playwright.config.ts --update-snapshots",
"test:all": "npm run test:unit && npm run test:e2e"
```

- [ ] **Step 4: Create directory structure**

```bash
mkdir -p tests/e2e/visual/snapshots tests/smoke tests/fixtures
```

- [ ] **Step 5: Verify Playwright config works**

```bash
npx playwright test --config tests/playwright.config.ts --list
```
Expected: "No tests found" — confirms config is valid.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tests/playwright.config.ts tests/e2e/.gitkeep tests/smoke/.gitkeep tests/fixtures/
git commit -m "feat: add Playwright config for E2E, smoke, and visual regression tests"
```

---

### Task 3: Set up Husky pre-commit hooks

**Files:**
- Modify: `package.json` (lint-staged config)
- Create: `.husky/pre-commit`

- [ ] **Step 1: Initialize Husky**

```bash
npx husky init
```

This creates `.husky/` directory and a default `pre-commit` file.

- [ ] **Step 2: Add lint-staged config to package.json**

Add top-level `"lint-staged"` key to `package.json`:
```json
"lint-staged": {
  "*.{ts,tsx}": [
    "eslint --fix"
  ]
}
```

Note: We skip `tsc --noEmit` in pre-commit (too slow for every commit — CI handles it). We skip `vitest related` for now — added in Phase 4 after tests exist.

- [ ] **Step 3: Write pre-commit hook**

Replace `.husky/pre-commit` contents with:
```bash
npx lint-staged
```

- [ ] **Step 4: Test the hook by making a trivial change and committing**

```bash
echo "// test" >> src/vite-env.d.ts
git add src/vite-env.d.ts
git commit -m "test: verify pre-commit hook"
```
Expected: lint-staged runs ESLint on the staged file. Commit succeeds.

- [ ] **Step 5: Revert the test change**

```bash
git revert HEAD --no-edit
```

- [ ] **Step 6: Commit the hook setup**

```bash
git add .husky/ package.json
git commit -m "feat: add Husky pre-commit hook with lint-staged ESLint"
```

---

### Task 4: Create test fixtures

**Files:**
- Create: `tests/fixtures/business-facts.json`
- Create: `tests/fixtures/sample-blog-post.tsx`
- Create: `tests/fixtures/sample-service-page.tsx`

- [ ] **Step 1: Create business facts source of truth**

Create `tests/fixtures/business-facts.json`:
```json
{
  "phone": "(775) 230-4767",
  "phoneTel": "+17752304767",
  "email": "info@DeMarTransportation.com",
  "address": "10471 Double R Blvd, Reno, NV 89521",
  "companyName": "DeMar Transportation",
  "dotNumber": "4392091",
  "officeHours": "Mon-Fri, 7:00 AM - 6:00 PM PST",
  "dispatchHours": "24/7"
}
```

- [ ] **Step 2: Create sample blog post fixture**

Create `tests/fixtures/sample-blog-post.tsx`. Copy the structure from an existing blog post (e.g., `src/pages/blog/WhyFreightQuoteKeepsChanging.tsx`) but with test content. This fixture must have:
- `import BlogPost from "@/components/BlogPost"`
- A `const content` variable with markdown
- `export default` function returning `<BlogPost ... />`
- `metaTitle`, `metaDescription`, `content` props
- At least one internal link (`/quote` or `/contact`)
- A FAQ section

Read an existing blog post to match the exact pattern, then create the fixture with placeholder test content.

- [ ] **Step 3: Create sample service page fixture**

Create `tests/fixtures/sample-service-page.tsx`. Copy structure from `src/pages/services/DryVan.tsx` with test content. Must have:
- React component with Helmet meta tags
- At least one CTA link to `/quote`
- Phone number `(775) 230-4767`
- `export default`

Read an existing service page to match the exact pattern.

- [ ] **Step 4: Commit fixtures**

```bash
git add tests/fixtures/
git commit -m "feat: add test fixtures for business facts and sample pages"
```

---

### Task 5: Write unit tests for source-reader

**Files:**
- Create: `tests/unit/source-reader.test.ts`

This is the most critical library — agents depend on it for every page read. Test against the fixture files.

- [ ] **Step 1: Write failing tests for extractText**

Create `tests/unit/source-reader.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

// source-reader is ESM .mjs — import dynamically
let sourceReader: any;

beforeAll(async () => {
  sourceReader = await import(
    "../../monitoring/agents/lib/source-reader.mjs"
  );
});

describe("source-reader", () => {
  describe("extractText", () => {
    it("extracts visible text from BlogPost content prop", () => {
      const fixture = fs.readFileSync(
        path.resolve(__dirname, "../fixtures/sample-blog-post.tsx"),
        "utf-8"
      );
      const text = sourceReader.extractText(fixture);
      expect(text.length).toBeGreaterThan(100);
      expect(text).not.toContain("import ");
      expect(text).not.toContain("export default");
    });

    it("extracts text from service page JSX", () => {
      const fixture = fs.readFileSync(
        path.resolve(__dirname, "../fixtures/sample-service-page.tsx"),
        "utf-8"
      );
      const text = sourceReader.extractText(fixture);
      expect(text.length).toBeGreaterThan(50);
    });

    it("returns empty string for empty input", () => {
      const text = sourceReader.extractText("");
      expect(text).toBe("");
    });
  });

  describe("extractHeadings", () => {
    it("extracts h1, h2, h3 from service page", () => {
      const fixture = fs.readFileSync(
        path.resolve(__dirname, "../fixtures/sample-service-page.tsx"),
        "utf-8"
      );
      const headings = sourceReader.extractHeadings(fixture);
      expect(headings).toBeInstanceOf(Array);
      expect(headings.length).toBeGreaterThan(0);
      expect(headings[0]).toHaveProperty("level");
      expect(headings[0]).toHaveProperty("text");
    });

    it("falls back to BlogPost title prop as H1", () => {
      const fixture = fs.readFileSync(
        path.resolve(__dirname, "../fixtures/sample-blog-post.tsx"),
        "utf-8"
      );
      const headings = sourceReader.extractHeadings(fixture);
      const h1s = headings.filter((h: any) => h.level === 1);
      expect(h1s.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("extractMetaTitle", () => {
    it("extracts metaTitle from BlogPost prop", () => {
      const fixture = fs.readFileSync(
        path.resolve(__dirname, "../fixtures/sample-blog-post.tsx"),
        "utf-8"
      );
      const title = sourceReader.extractMetaTitle(fixture);
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(10);
    });

    it("extracts title from Helmet in service page", () => {
      const fixture = fs.readFileSync(
        path.resolve(__dirname, "../fixtures/sample-service-page.tsx"),
        "utf-8"
      );
      const title = sourceReader.extractMetaTitle(fixture);
      expect(title).toBeTruthy();
    });
  });

  describe("extractMetaDescription", () => {
    it("extracts metaDescription from BlogPost prop", () => {
      const fixture = fs.readFileSync(
        path.resolve(__dirname, "../fixtures/sample-blog-post.tsx"),
        "utf-8"
      );
      const desc = sourceReader.extractMetaDescription(fixture);
      expect(desc).toBeTruthy();
      expect(desc.length).toBeGreaterThan(50);
    });
  });

  describe("extractInternalLinks", () => {
    it("finds Link to= and a href= patterns", () => {
      const fixture = fs.readFileSync(
        path.resolve(__dirname, "../fixtures/sample-blog-post.tsx"),
        "utf-8"
      );
      const links = sourceReader.extractInternalLinks(fixture);
      expect(links).toBeInstanceOf(Array);
      expect(links.some((l: string) => l.startsWith("/"))).toBe(true);
    });
  });

  describe("extractImages", () => {
    it("extracts img src and alt from service page", () => {
      const fixture = fs.readFileSync(
        path.resolve(__dirname, "../fixtures/sample-service-page.tsx"),
        "utf-8"
      );
      const images = sourceReader.extractImages(fixture);
      expect(images).toBeInstanceOf(Array);
    });
  });
});
```

- [ ] **Step 2: Run tests to see which pass and which fail**

```bash
npm run test:unit
```

Examine failures. If `extractText` etc. are not exported from source-reader.mjs, they need to be exported. Check the actual exports of `monitoring/agents/lib/source-reader.mjs` and adjust either the test imports or add exports to the source module.

- [ ] **Step 3: Fix any import/export issues to make tests pass**

The source-reader may only export `readPage`, `readAllPages`, `readPagesByType` (high-level functions) but not the individual extractors. If so, two options:
- Option A: Add named exports for the internal helpers (preferred — they're pure functions worth testing directly).
- Option B: Test via `readPage` with fixture file paths.

Choose option A if the functions are defined at module scope. Add `export` keyword to `extractText`, `extractHeadings`, `extractMetaTitle`, `extractMetaDescription`, `extractInternalLinks`, `extractImages` in `monitoring/agents/lib/source-reader.mjs`.

- [ ] **Step 4: Run tests and verify all pass**

```bash
npm run test:unit
```
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/unit/source-reader.test.ts monitoring/agents/lib/source-reader.mjs
git commit -m "test: add unit tests for source-reader extraction functions"
```

---

### Task 6: Write unit tests for state management

**Files:**
- Create: `tests/unit/state.test.ts`

- [ ] **Step 1: Write failing tests for state read/write**

Create `tests/unit/state.test.ts`:
```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";

let state: any;
const TEST_STATE_DIR = path.resolve(__dirname, "../fixtures/test-state");

beforeAll(async () => {
  state = await import("../../monitoring/agents/lib/state.mjs");
});

describe("state", () => {
  beforeEach(() => {
    // Create a clean test state directory
    fs.mkdirSync(path.join(TEST_STATE_DIR, "test-category"), {
      recursive: true,
    });
  });

  afterEach(() => {
    // Clean up test state
    fs.rmSync(TEST_STATE_DIR, { recursive: true, force: true });
  });

  describe("write and read", () => {
    it("round-trips JSON data", () => {
      const data = { score: 85, items: ["a", "b"] };
      // state.write and state.read use a fixed state directory
      // We test the actual state module against its real directory
      state.write("test-qa", "round-trip-test", data);
      const result = state.read("test-qa", "round-trip-test");
      expect(result.score).toBe(85);
      expect(result.items).toEqual(["a", "b"]);
      expect(result._updatedAt).toBeTruthy();

      // Cleanup
      const stateDir = path.resolve(
        __dirname,
        "../../monitoring/agents/state/test-qa"
      );
      fs.rmSync(stateDir, { recursive: true, force: true });
    });

    it("returns null for non-existent key", () => {
      const result = state.read("test-qa", "does-not-exist-xyz");
      expect(result).toBeNull();
    });
  });

  describe("appendLog", () => {
    it("appends an entry to run log", () => {
      const entry = {
        agent: "test-agent",
        status: "success",
        timestamp: new Date().toISOString(),
      };
      state.appendLog(entry);
      const log = state.read("meta", "run-log");
      expect(log.entries).toBeInstanceOf(Array);
      const lastEntry = log.entries[log.entries.length - 1];
      expect(lastEntry.agent).toBe("test-agent");
    });
  });

  describe("markRun and getLastRun", () => {
    it("records and retrieves last run timestamp", () => {
      state.markRun("test-qa-agent");
      const lastRun = state.getLastRun("test-qa-agent");
      expect(lastRun).toBeTruthy();
      // Should be within the last few seconds
      const diff = Date.now() - new Date(lastRun).getTime();
      expect(diff).toBeLessThan(5000);
    });
  });

  describe("getDelta and formatDelta", () => {
    it("returns up arrow for improvement", () => {
      expect(state.getDelta(90, 80)).toBe("↑");
    });

    it("returns down arrow for regression", () => {
      expect(state.getDelta(70, 80)).toBe("↓");
    });

    it("returns right arrow for no change", () => {
      expect(state.getDelta(80, 80)).toBe("→");
    });

    it("formats delta with sign", () => {
      const formatted = state.formatDelta(90, 80);
      expect(formatted).toContain("↑");
      expect(formatted).toContain("10");
    });
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm run test:unit
```

- [ ] **Step 3: Fix any issues (export adjustments, path issues)**

If `getDelta`/`formatDelta` are not exported, add exports. Check the actual function signatures against the test expectations and adjust.

- [ ] **Step 4: Verify all tests pass**

```bash
npm run test:unit
```
Expected: All source-reader + state tests PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/unit/state.test.ts monitoring/agents/lib/state.mjs
git commit -m "test: add unit tests for state management read/write/log/delta"
```

---

### Task 7: Write unit tests for pages registry

**Files:**
- Create: `tests/unit/pages.test.ts`

- [ ] **Step 1: Write tests for page registry**

Create `tests/unit/pages.test.ts`:
```typescript
import { describe, it, expect } from "vitest";

let pages: any;

beforeAll(async () => {
  pages = await import("../../monitoring/seo/lib/pages.mjs");
});

describe("pages registry", () => {
  describe("getAllPages", () => {
    it("returns an array of page objects", () => {
      const allPages = pages.getAllPages();
      expect(allPages).toBeInstanceOf(Array);
      expect(allPages.length).toBeGreaterThan(20);
    });

    it("every page has required fields", () => {
      const allPages = pages.getAllPages();
      for (const page of allPages) {
        expect(page).toHaveProperty("path");
        expect(page).toHaveProperty("name");
        expect(page).toHaveProperty("type");
        expect(page).toHaveProperty("url");
        expect(page.url).toMatch(/^https:\/\/demartransportation\.com/);
      }
    });

    it("includes core pages", () => {
      const allPages = pages.getAllPages();
      const paths = allPages.map((p: any) => p.path);
      expect(paths).toContain("/");
      expect(paths).toContain("/about");
      expect(paths).toContain("/contact");
      expect(paths).toContain("/quote");
      expect(paths).toContain("/careers");
    });

    it("includes service pages", () => {
      const allPages = pages.getAllPages();
      const servicePaths = allPages
        .filter((p: any) => p.type === "service")
        .map((p: any) => p.path);
      expect(servicePaths).toContain("/services/dry-van");
      expect(servicePaths).toContain("/services/reefer");
      expect(servicePaths).toContain("/services/flatbed");
    });

    it("auto-discovers blog posts from filesystem", () => {
      const allPages = pages.getAllPages();
      const blogPages = allPages.filter((p: any) => p.type === "blog");
      expect(blogPages.length).toBeGreaterThan(0);
      for (const blog of blogPages) {
        expect(blog.path).toMatch(/^\/blog\//);
      }
    });

    it("auto-discovers resource pages from filesystem", () => {
      const allPages = pages.getAllPages();
      const resourcePages = allPages.filter(
        (p: any) => p.type === "resource"
      );
      expect(resourcePages.length).toBeGreaterThan(0);
      for (const resource of resourcePages) {
        expect(resource.path).toMatch(/^\/resources\//);
      }
    });
  });

  describe("toKebabCase", () => {
    it("converts PascalCase to kebab-case", () => {
      expect(pages.toKebabCase("DryVan")).toBe("dry-van");
      expect(pages.toKebabCase("SprintVan")).toBe("sprint-van");
    });

    it("handles letter-to-digit boundaries", () => {
      expect(pages.toKebabCase("3pl")).toBe("3pl");
    });
  });

  describe("SITE_URL", () => {
    it("is the production URL", () => {
      expect(pages.SITE_URL).toBe("https://demartransportation.com");
    });
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm run test:unit
```

- [ ] **Step 3: Fix any export issues (toKebabCase may need to be exported)**

If `toKebabCase` is not exported, add `export` to its definition in `monitoring/seo/lib/pages.mjs`.

- [ ] **Step 4: Verify all tests pass**

```bash
npm run test:unit
```

- [ ] **Step 5: Commit**

```bash
git add tests/unit/pages.test.ts monitoring/seo/lib/pages.mjs
git commit -m "test: add unit tests for page registry and slug generation"
```

---

### Task 8: Write unit tests for fix-rules

**Files:**
- Create: `tests/unit/fix-rules.test.ts`

- [ ] **Step 1: Write tests for rule matching and tier classification**

Create `tests/unit/fix-rules.test.ts`:
```typescript
import { describe, it, expect } from "vitest";

let fixRules: any;

beforeAll(async () => {
  fixRules = await import("../../monitoring/lib/fix-rules.mjs");
});

describe("fix-rules", () => {
  describe("FIX_RULES", () => {
    it("is a non-empty array", () => {
      expect(fixRules.FIX_RULES).toBeInstanceOf(Array);
      expect(fixRules.FIX_RULES.length).toBeGreaterThan(0);
    });

    it("every rule has required fields", () => {
      for (const rule of fixRules.FIX_RULES) {
        expect(rule).toHaveProperty("tier");
        expect(rule).toHaveProperty("id");
        expect(rule).toHaveProperty("model");
        expect(rule).toHaveProperty("match");
        expect(rule).toHaveProperty("prompt");
        expect(rule).toHaveProperty("commitMsg");
        expect([1, 2]).toContain(rule.tier);
        expect(["haiku", "sonnet", "opus"]).toContain(rule.model);
        expect(typeof rule.match).toBe("function");
      }
    });

    it("tier 1 rules include npm-audit and copyright-year", () => {
      const tier1Ids = fixRules.FIX_RULES.filter(
        (r: any) => r.tier === 1
      ).map((r: any) => r.id);
      expect(tier1Ids).toContain("npm-audit");
      expect(tier1Ids).toContain("copyright-year");
    });

    it("tier 2 rules include schema and content fixes", () => {
      const tier2Ids = fixRules.FIX_RULES.filter(
        (r: any) => r.tier === 2
      ).map((r: any) => r.id);
      expect(tier2Ids).toContain("schema-required-props");
      expect(tier2Ids).toContain("og-tags");
    });
  });

  describe("NEVER_FIX", () => {
    it("includes security headers", () => {
      expect(fixRules.NEVER_FIX).toBeInstanceOf(Array);
      expect(fixRules.NEVER_FIX.length).toBeGreaterThan(0);
    });
  });

  describe("rule matching", () => {
    it("npm-audit rule matches audit check", () => {
      const npmRule = fixRules.FIX_RULES.find(
        (r: any) => r.id === "npm-audit"
      );
      const check = {
        name: "npm audit",
        status: "fail",
        detail: "5 vulnerabilities found",
      };
      expect(npmRule.match(check)).toBe(true);
    });

    it("npm-audit rule does not match unrelated check", () => {
      const npmRule = fixRules.FIX_RULES.find(
        (r: any) => r.id === "npm-audit"
      );
      const check = {
        name: "meta description",
        status: "fail",
        detail: "too short",
      };
      expect(npmRule.match(check)).toBe(false);
    });
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm run test:unit
```

- [ ] **Step 3: Fix any export/import issues**

Ensure `FIX_RULES` and `NEVER_FIX` are exported from `monitoring/lib/fix-rules.mjs`.

- [ ] **Step 4: Verify all pass**

```bash
npm run test:unit
```

- [ ] **Step 5: Commit**

```bash
git add tests/unit/fix-rules.test.ts
git commit -m "test: add unit tests for fix-rules tier classification and matching"
```

---

## Phase 2: Agent Output Validators + Diff Validator

### Task 9: Create content validator

**Files:**
- Create: `monitoring/agents/lib/validators/content-validator.mjs`
- Create: `tests/unit/content-validator.test.ts`

- [ ] **Step 1: Write failing test for content validator**

Create `tests/unit/content-validator.test.ts`:
```typescript
import { describe, it, expect } from "vitest";

let validator: any;

beforeAll(async () => {
  validator = await import(
    "../../monitoring/agents/lib/validators/content-validator.mjs"
  );
});

describe("content-validator", () => {
  const validContent = `import BlogPost from "@/components/BlogPost";

const content = \`
# Why Freight Shipping Costs Change

Freight shipping costs fluctuate based on many factors. At DeMar Transportation, we help you understand these changes so you can plan your logistics budget effectively.

## Understanding Market Dynamics

The freight market operates on supply and demand principles. When capacity is tight, rates increase. When there is excess capacity, rates decrease. Seasonal patterns also play a significant role in determining freight costs throughout the year.

## How Fuel Prices Affect Your Rates

Fuel surcharges are a standard component of freight pricing. As diesel prices rise, carriers must pass these costs along. DeMar Transportation provides transparent fuel surcharge calculations so you always know exactly what you are paying.

## Tips for Getting Better Freight Rates

Planning ahead can save you significant money on freight shipping. Here are strategies that work:

- Book shipments well in advance when possible
- Be flexible with pickup and delivery dates
- Consolidate smaller shipments into full truckloads
- Build relationships with reliable carriers like DeMar Transportation

## Frequently Asked Questions

**How often do freight rates change?**
Rates can change daily based on market conditions, fuel prices, and seasonal demand patterns.

**Can I lock in a freight rate?**
Yes, contract rates provide price stability. Contact us at (775) 230-4767 to discuss contract options.

Get a [free quote](/quote) today to see current rates for your shipping needs.
\`;

export default function WhyFreightCostsChange() {
  return (
    <BlogPost
      title="Why Freight Shipping Costs Change"
      metaTitle="Why Freight Shipping Costs Change | DeMar Transportation"
      metaDescription="Learn why freight shipping costs fluctuate and how to get better rates. DeMar Transportation explains market dynamics, fuel surcharges, and money-saving strategies."
      content={content}
      publishDate="2026-04-03"
      category="Industry Insights"
    />
  );
}`;

  it("passes for valid blog post content", () => {
    const result = validator.validateContent(validContent, {
      targetKeyword: "freight shipping costs",
    });
    expect(result.passed).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("fails for content under 1500 words (this fixture is short)", () => {
    const shortContent = `import BlogPost from "@/components/BlogPost";
const content = \`Short post.\`;
export default function Test() { return <BlogPost title="Test" metaTitle="Test" metaDescription="Test description for the page" content={content} />; }`;
    const result = validator.validateContent(shortContent, {});
    expect(result.passed).toBe(false);
    expect(result.errors.some((e: string) => e.includes("word count"))).toBe(
      true
    );
  });

  it("fails for missing import BlogPost", () => {
    const noImport = `const content = "hello";
export default function Test() { return <div />; }`;
    const result = validator.validateContent(noImport, {});
    expect(result.passed).toBe(false);
    expect(
      result.errors.some((e: string) => e.includes("import BlogPost"))
    ).toBe(true);
  });

  it("fails for missing export default", () => {
    const noExport = `import BlogPost from "@/components/BlogPost";
const content = "hello";
function Test() { return <BlogPost content={content} />; }`;
    const result = validator.validateContent(noExport, {});
    expect(result.passed).toBe(false);
    expect(
      result.errors.some((e: string) => e.includes("export default"))
    ).toBe(true);
  });

  it("fails for placeholder text", () => {
    const placeholder = validContent.replace(
      "Freight shipping costs",
      "[INSERT TOPIC HERE]"
    );
    const result = validator.validateContent(placeholder, {});
    expect(result.passed).toBe(false);
    expect(
      result.errors.some((e: string) => e.includes("placeholder"))
    ).toBe(true);
  });

  it("fails for em dashes", () => {
    const emDash = validContent.replace("factors.", "factors — and more.");
    const result = validator.validateContent(emDash, {});
    expect(result.passed).toBe(false);
    expect(result.errors.some((e: string) => e.includes("em dash"))).toBe(
      true
    );
  });

  it("fails for exclamation marks", () => {
    const exclaim = validContent.replace("effectively.", "effectively!");
    const result = validator.validateContent(exclaim, {});
    expect(result.passed).toBe(false);
    expect(
      result.errors.some((e: string) => e.includes("exclamation"))
    ).toBe(true);
  });

  it("checks phone number matches source of truth if present", () => {
    const wrongPhone = validContent.replace(
      "(775) 230-4767",
      "(555) 123-4567"
    );
    const result = validator.validateContent(wrongPhone, {});
    expect(result.passed).toBe(false);
    expect(result.errors.some((e: string) => e.includes("phone"))).toBe(
      true
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:unit -- tests/unit/content-validator.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 3: Create the content validator**

Create `monitoring/agents/lib/validators/content-validator.mjs`:
```javascript
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUSINESS_FACTS = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../../../../tests/fixtures/business-facts.json"),
    "utf-8"
  )
);

const PLACEHOLDER_PATTERNS = [
  /\[INSERT/i,
  /\[TODO/i,
  /\[PLACEHOLDER/i,
  /Lorem ipsum/i,
  /\[YOUR /i,
  /\[COMPANY/i,
  /TBD\b/,
];

const COMPETITOR_BLOCKLIST = [
  "XPO Logistics",
  "J.B. Hunt",
  "Werner Enterprises",
  "Schneider National",
  "Knight-Swift",
];

export function validateContent(code, metadata = {}) {
  const errors = [];

  // Required structure
  if (!code.includes('import BlogPost')) {
    errors.push("Missing import BlogPost statement");
  }
  if (!code.includes("export default")) {
    errors.push("Missing export default statement");
  }

  // Word count — extract text between backticks (content variable)
  const contentMatch = code.match(/const content\s*=\s*`([\s\S]*?)`/);
  if (contentMatch) {
    const words = contentMatch[1]
      .replace(/[#*`\[\]()]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 0);
    if (words.length < 1500) {
      errors.push(
        `Content word count too low: ${words.length} (minimum 1500)`
      );
    }
  } else {
    errors.push("Could not extract content variable for word count check");
  }

  // Placeholder text
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(code)) {
      errors.push(`Contains placeholder text matching: ${pattern.source}`);
    }
  }

  // Competitor brand names
  for (const competitor of COMPETITOR_BLOCKLIST) {
    if (code.includes(competitor)) {
      errors.push(`Contains competitor brand name: ${competitor}`);
    }
  }

  // Brand guidelines
  if (code.includes("\u2014")) {
    errors.push("Contains em dash (\u2014) — use regular dashes instead");
  }
  if (/[^\\]!(?!==)/.test(code.replace(/```[\s\S]*?```/g, ""))) {
    // Check for ! outside code blocks, but not !== or != operators
    const textContent = code.replace(/<[^>]+>/g, "").replace(/\{[^}]+\}/g, "");
    if (textContent.includes("!") && !textContent.match(/^[^!]*$/)) {
      const exclamationInText = textContent.match(/\w+!/g);
      if (exclamationInText) {
        errors.push(
          "Contains exclamation marks in text content — remove per brand guidelines"
        );
      }
    }
  }

  // Phone number check
  const phonePattern = /\(\d{3}\)\s*\d{3}-\d{4}/g;
  const phones = code.match(phonePattern);
  if (phones) {
    for (const phone of phones) {
      if (phone !== BUSINESS_FACTS.phone) {
        errors.push(
          `Phone number ${phone} does not match source of truth: ${BUSINESS_FACTS.phone}`
        );
      }
    }
  }

  // Email check
  const emailPattern = /[\w.+-]+@[\w-]+\.[\w.]+/g;
  const emails = code.match(emailPattern);
  if (emails) {
    for (const email of emails) {
      if (
        email.toLowerCase() !== BUSINESS_FACTS.email.toLowerCase() &&
        !email.includes("@radix") &&
        !email.includes("@types") &&
        !email.includes("@/")
      ) {
        errors.push(
          `Email ${email} does not match source of truth: ${BUSINESS_FACTS.email}`
        );
      }
    }
  }

  // H2 headings count
  const h2Count = (code.match(/^## /gm) || []).length;
  if (h2Count < 2) {
    errors.push(`Only ${h2Count} H2 headings found (minimum 2)`);
  }

  // Target keyword check
  if (metadata.targetKeyword) {
    const lowerCode = code.toLowerCase();
    const lowerKeyword = metadata.targetKeyword.toLowerCase();
    if (!lowerCode.includes(lowerKeyword)) {
      errors.push(
        `Target keyword "${metadata.targetKeyword}" not found in content`
      );
    }
  }

  // Internal link validation
  const linkPattern = /(?:to|href)=["'](\/([\w-]+(?:\/[\w-]+)*)?)["']/g;
  let match;
  while ((match = linkPattern.exec(code)) !== null) {
    const linkPath = match[1];
    // Basic validation — starts with / and has valid segments
    if (!/^\/[\w-]+(\/[\w-]+)*\/?$/.test(linkPath) && linkPath !== "/") {
      errors.push(`Potentially invalid internal link: ${linkPath}`);
    }
  }

  return { passed: errors.length === 0, errors };
}
```

- [ ] **Step 4: Run tests and iterate**

```bash
npm run test:unit -- tests/unit/content-validator.test.ts
```

Fix any assertion mismatches — the exclamation mark detection may need tuning. Adjust the validator logic until all tests pass.

- [ ] **Step 5: Commit**

```bash
git add monitoring/agents/lib/validators/content-validator.mjs tests/unit/content-validator.test.ts
git commit -m "feat: add content writer output validator with word count, brand, and fact checks"
```

---

### Task 10: Create schema validator

**Files:**
- Create: `monitoring/agents/lib/validators/schema-validator.mjs`
- Create: `tests/unit/schema-validator.test.ts`

- [ ] **Step 1: Write failing test**

Create `tests/unit/schema-validator.test.ts`:
```typescript
import { describe, it, expect } from "vitest";

let validator: any;

beforeAll(async () => {
  validator = await import(
    "../../monitoring/agents/lib/validators/schema-validator.mjs"
  );
});

describe("schema-validator", () => {
  const validSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "TransportService",
    name: "DeMar Transportation",
    telephone: "+17752304767",
    email: "info@DeMarTransportation.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "10471 Double R Blvd",
      addressLocality: "Reno",
      addressRegion: "NV",
      postalCode: "89521",
    },
    url: "https://demartransportation.com",
  });

  it("passes for valid schema JSON", () => {
    const result = validator.validateSchema(validSchema);
    expect(result.passed).toBe(true);
  });

  it("fails for invalid JSON", () => {
    const result = validator.validateSchema("not json {{{");
    expect(result.passed).toBe(false);
    expect(result.errors.some((e: string) => e.includes("parse"))).toBe(true);
  });

  it("fails for missing @context", () => {
    const noContext = JSON.stringify({ "@type": "Thing", name: "Test" });
    const result = validator.validateSchema(noContext);
    expect(result.passed).toBe(false);
    expect(result.errors.some((e: string) => e.includes("@context"))).toBe(
      true
    );
  });

  it("fails for missing @type", () => {
    const noType = JSON.stringify({
      "@context": "https://schema.org",
      name: "Test",
    });
    const result = validator.validateSchema(noType);
    expect(result.passed).toBe(false);
    expect(result.errors.some((e: string) => e.includes("@type"))).toBe(true);
  });

  it("fails for localhost URLs", () => {
    const localhost = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      url: "http://localhost:8080/services",
    });
    const result = validator.validateSchema(localhost);
    expect(result.passed).toBe(false);
    expect(result.errors.some((e: string) => e.includes("localhost"))).toBe(
      true
    );
  });

  it("fails for wrong phone number", () => {
    const wrongPhone = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      telephone: "+15551234567",
    });
    const result = validator.validateSchema(wrongPhone);
    expect(result.passed).toBe(false);
    expect(result.errors.some((e: string) => e.includes("phone"))).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

```bash
npm run test:unit -- tests/unit/schema-validator.test.ts
```

- [ ] **Step 3: Implement schema validator**

Create `monitoring/agents/lib/validators/schema-validator.mjs`:
```javascript
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUSINESS_FACTS = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../../../../tests/fixtures/business-facts.json"),
    "utf-8"
  )
);

export function validateSchema(jsonString) {
  const errors = [];

  // Parse check
  let schema;
  try {
    schema = JSON.parse(jsonString);
  } catch (e) {
    errors.push(`Failed to parse JSON: ${e.message}`);
    return { passed: false, errors };
  }

  // Required fields
  if (!schema["@context"]) {
    errors.push("Missing @context field");
  } else if (!schema["@context"].includes("schema.org")) {
    errors.push(`@context should reference schema.org, got: ${schema["@context"]}`);
  }

  if (!schema["@type"]) {
    errors.push("Missing @type field");
  }

  // URL validation — deep scan all string values
  const allValues = JSON.stringify(schema);
  if (allValues.includes("localhost")) {
    errors.push("Schema contains localhost URL — must use production domain");
  }
  if (allValues.includes("127.0.0.1")) {
    errors.push("Schema contains 127.0.0.1 — must use production domain");
  }

  // Phone number check
  if (schema.telephone) {
    const normalizedPhone = schema.telephone.replace(/[\s()-]/g, "");
    const expectedPhone = BUSINESS_FACTS.phoneTel.replace(/[\s()-]/g, "");
    if (normalizedPhone !== expectedPhone) {
      errors.push(
        `Phone ${schema.telephone} does not match source of truth: ${BUSINESS_FACTS.phoneTel}`
      );
    }
  }

  // Email check
  if (schema.email) {
    if (schema.email.toLowerCase() !== BUSINESS_FACTS.email.toLowerCase()) {
      errors.push(
        `Email ${schema.email} does not match source of truth: ${BUSINESS_FACTS.email}`
      );
    }
  }

  // URL domain check
  if (schema.url && !schema.url.startsWith("https://demartransportation.com")) {
    errors.push(`URL ${schema.url} should use https://demartransportation.com`);
  }

  return { passed: errors.length === 0, errors };
}
```

- [ ] **Step 4: Run tests**

```bash
npm run test:unit -- tests/unit/schema-validator.test.ts
```
Expected: All PASS.

- [ ] **Step 5: Commit**

```bash
git add monitoring/agents/lib/validators/schema-validator.mjs tests/unit/schema-validator.test.ts
git commit -m "feat: add schema output validator with JSON-LD and business fact checks"
```

---

### Task 11: Create meta tag validator

**Files:**
- Create: `monitoring/agents/lib/validators/meta-validator.mjs`
- Create: `tests/unit/meta-validator.test.ts`

- [ ] **Step 1: Write failing test**

Create `tests/unit/meta-validator.test.ts`:
```typescript
import { describe, it, expect } from "vitest";

let validator: any;

beforeAll(async () => {
  validator = await import(
    "../../monitoring/agents/lib/validators/meta-validator.mjs"
  );
});

describe("meta-validator", () => {
  it("passes for valid title and description", () => {
    const result = validator.validateMeta({
      title: "Dry Van Shipping Services | DeMar Transportation",
      description:
        "Professional dry van freight shipping across the US. DeMar Transportation offers reliable FTL and LTL dry van services with 24/7 dispatch from Reno, NV.",
    });
    expect(result.passed).toBe(true);
  });

  it("fails for title too short", () => {
    const result = validator.validateMeta({
      title: "Hi",
      description: "A valid description that is long enough to pass the check.",
    });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e: string) => e.includes("title"))).toBe(true);
  });

  it("fails for title too long", () => {
    const result = validator.validateMeta({
      title: "A".repeat(70),
      description: "A valid description that is long enough to pass the check.",
    });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e: string) => e.includes("title"))).toBe(true);
  });

  it("fails for description too short", () => {
    const result = validator.validateMeta({
      title: "Valid Title for a Page | DeMar Transportation",
      description: "Too short",
    });
    expect(result.passed).toBe(false);
    expect(
      result.errors.some((e: string) => e.includes("description"))
    ).toBe(true);
  });

  it("fails for description too long", () => {
    const result = validator.validateMeta({
      title: "Valid Title for a Page | DeMar Transportation",
      description: "A".repeat(170),
    });
    expect(result.passed).toBe(false);
  });

  it("fails for all-caps words in title", () => {
    const result = validator.validateMeta({
      title: "BEST Shipping Services | DeMar Transportation",
      description:
        "A valid description that meets the length requirements for meta tags.",
    });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e: string) => e.includes("caps"))).toBe(true);
  });

  it("allows known acronyms like LTL, FTL, 3PL", () => {
    const result = validator.validateMeta({
      title: "FTL and LTL Freight Services | DeMar",
      description:
        "Professional FTL and LTL freight shipping services. DeMar Transportation provides reliable 3PL logistics solutions across the United States.",
    });
    expect(result.passed).toBe(true);
  });

  it("fails for placeholder text", () => {
    const result = validator.validateMeta({
      title: "[INSERT TITLE] | DeMar Transportation",
      description: "A valid description that meets the length requirement.",
    });
    expect(result.passed).toBe(false);
    expect(
      result.errors.some((e: string) => e.includes("placeholder"))
    ).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

```bash
npm run test:unit -- tests/unit/meta-validator.test.ts
```

- [ ] **Step 3: Implement meta validator**

Create `monitoring/agents/lib/validators/meta-validator.mjs`:
```javascript
const ALLOWED_ACRONYMS = [
  "LTL", "FTL", "3PL", "CDL", "DOT", "FMCSA", "GPS", "ELD", "OTR",
  "CWV", "SEO", "FAQ", "US", "USA", "NV", "PST", "UTC",
];

const PLACEHOLDER_PATTERNS = [
  /\[INSERT/i,
  /\[TODO/i,
  /\[PLACEHOLDER/i,
  /TBD\b/,
  /Lorem ipsum/i,
];

export function validateMeta({ title, description, targetKeyword } = {}) {
  const errors = [];

  // Title checks
  if (title) {
    if (title.length < 30) {
      errors.push(`Meta title too short: ${title.length} chars (minimum 30)`);
    }
    if (title.length > 60) {
      errors.push(`Meta title too long: ${title.length} chars (maximum 60)`);
    }

    // All-caps check (skip known acronyms)
    const words = title.split(/\s+/);
    for (const word of words) {
      const clean = word.replace(/[^A-Z0-9]/g, "");
      if (
        clean.length >= 4 &&
        clean === clean.toUpperCase() &&
        !ALLOWED_ACRONYMS.includes(clean)
      ) {
        errors.push(
          `Title contains all-caps word "${word}" — use title case instead`
        );
      }
    }

    for (const pattern of PLACEHOLDER_PATTERNS) {
      if (pattern.test(title)) {
        errors.push(`Title contains placeholder text: ${pattern.source}`);
      }
    }
  } else {
    errors.push("Missing meta title");
  }

  // Description checks
  if (description) {
    if (description.length < 120) {
      errors.push(
        `Meta description too short: ${description.length} chars (minimum 120)`
      );
    }
    if (description.length > 160) {
      errors.push(
        `Meta description too long: ${description.length} chars (maximum 160)`
      );
    }

    for (const pattern of PLACEHOLDER_PATTERNS) {
      if (pattern.test(description)) {
        errors.push(
          `Description contains placeholder text: ${pattern.source}`
        );
      }
    }
  } else {
    errors.push("Missing meta description");
  }

  // Target keyword check
  if (targetKeyword) {
    const lowerTitle = (title || "").toLowerCase();
    const lowerDesc = (description || "").toLowerCase();
    const lowerKeyword = targetKeyword.toLowerCase();
    if (!lowerTitle.includes(lowerKeyword) && !lowerDesc.includes(lowerKeyword)) {
      errors.push(
        `Target keyword "${targetKeyword}" not found in title or description`
      );
    }
  }

  return { passed: errors.length === 0, errors };
}
```

- [ ] **Step 4: Run tests**

```bash
npm run test:unit -- tests/unit/meta-validator.test.ts
```
Expected: All PASS.

- [ ] **Step 5: Commit**

```bash
git add monitoring/agents/lib/validators/meta-validator.mjs tests/unit/meta-validator.test.ts
git commit -m "feat: add meta tag validator with length, caps, and placeholder checks"
```

---

### Task 12: Create technical fix validator

**Files:**
- Create: `monitoring/agents/lib/validators/technical-validator.mjs`
- Create: `tests/unit/technical-validator.test.ts`

- [ ] **Step 1: Write failing test**

Create `tests/unit/technical-validator.test.ts`:
```typescript
import { describe, it, expect } from "vitest";

let validator: any;

beforeAll(async () => {
  validator = await import(
    "../../monitoring/agents/lib/validators/technical-validator.mjs"
  );
});

describe("technical-validator", () => {
  const validCode = `import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function DryVan() {
  return (
    <>
      <Helmet>
        <title>Dry Van Shipping | DeMar Transportation</title>
      </Helmet>
      <div>
        <h1>Dry Van Freight Services</h1>
        <img src="/images/dry-van.jpg" alt="Dry van trailer for freight shipping" />
        <Link to="/quote">Get a Quote</Link>
      </div>
    </>
  );
}`;

  it("passes for valid component code", () => {
    const result = validator.validateTechnicalFix(validCode, {
      originalSize: validCode.length,
    });
    expect(result.passed).toBe(true);
  });

  it("fails for missing export default", () => {
    const noExport = validCode.replace("export default ", "");
    const result = validator.validateTechnicalFix(noExport, {
      originalSize: validCode.length,
    });
    expect(result.passed).toBe(false);
    expect(
      result.errors.some((e: string) => e.includes("export default"))
    ).toBe(true);
  });

  it("fails for file size change > 20%", () => {
    const bloated = validCode + "\n".repeat(1000) + "// extra content\n".repeat(500);
    const result = validator.validateTechnicalFix(bloated, {
      originalSize: validCode.length,
    });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e: string) => e.includes("size"))).toBe(true);
  });

  it("fails for alt text over 125 characters", () => {
    const longAlt = validCode.replace(
      'alt="Dry van trailer for freight shipping"',
      `alt="${"A".repeat(130)}"`
    );
    const result = validator.validateTechnicalFix(longAlt, {
      originalSize: validCode.length,
    });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e: string) => e.includes("alt"))).toBe(true);
  });

  it("fails for alt text starting with 'image of'", () => {
    const badAlt = validCode.replace(
      'alt="Dry van trailer for freight shipping"',
      'alt="Image of a dry van trailer"'
    );
    const result = validator.validateTechnicalFix(badAlt, {
      originalSize: validCode.length,
    });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e: string) => e.includes("image of"))).toBe(
      true
    );
  });

  it("validates JSON-LD blocks parse correctly", () => {
    const withBadSchema =
      validCode +
      '\n<script type="application/ld+json">{not valid json}</script>';
    const result = validator.validateTechnicalFix(withBadSchema, {
      originalSize: validCode.length,
    });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e: string) => e.includes("JSON-LD"))).toBe(
      true
    );
  });

  it("fails for merge conflict markers", () => {
    const conflict = validCode + "\n<<<<<<< HEAD\nsome code\n=======\n";
    const result = validator.validateTechnicalFix(conflict, {
      originalSize: validCode.length,
    });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e: string) => e.includes("conflict"))).toBe(
      true
    );
  });
});
```

- [ ] **Step 2: Run test to verify failure**

```bash
npm run test:unit -- tests/unit/technical-validator.test.ts
```

- [ ] **Step 3: Implement technical validator**

Create `monitoring/agents/lib/validators/technical-validator.mjs`:
```javascript
export function validateTechnicalFix(code, metadata = {}) {
  const errors = [];

  // Required structure
  if (!code.includes("export default")) {
    errors.push("Missing export default statement");
  }

  // File size check
  if (metadata.originalSize) {
    const ratio = code.length / metadata.originalSize;
    if (ratio > 1.2 || ratio < 0.8) {
      const pct = Math.round((ratio - 1) * 100);
      errors.push(
        `File size changed by ${pct > 0 ? "+" : ""}${pct}% (max allowed: ±20%)`
      );
    }
  }

  // Alt text validation
  const altPattern = /alt=["']([^"']*)["']/g;
  let match;
  while ((match = altPattern.exec(code)) !== null) {
    const alt = match[1];
    if (alt.length > 125) {
      errors.push(
        `Alt text too long (${alt.length} chars, max 125): "${alt.substring(0, 50)}..."`
      );
    }
    if (/^image of\b/i.test(alt)) {
      errors.push(
        `Alt text starts with "image of" — describe the content directly: "${alt.substring(0, 50)}"`
      );
    }
  }

  // JSON-LD validation
  const jsonLdPattern =
    /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/g;
  let jsonLdMatch;
  while ((jsonLdMatch = jsonLdPattern.exec(code)) !== null) {
    try {
      JSON.parse(jsonLdMatch[1]);
    } catch (e) {
      errors.push(`Invalid JSON-LD block: ${e.message}`);
    }
  }

  // Merge conflict markers
  if (/^<{7}\s/m.test(code) || /^={7}$/m.test(code) || /^>{7}\s/m.test(code)) {
    errors.push("File contains merge conflict markers");
  }

  return { passed: errors.length === 0, errors };
}
```

- [ ] **Step 4: Run tests**

```bash
npm run test:unit -- tests/unit/technical-validator.test.ts
```
Expected: All PASS.

- [ ] **Step 5: Commit**

```bash
git add monitoring/agents/lib/validators/technical-validator.mjs tests/unit/technical-validator.test.ts
git commit -m "feat: add technical fix validator with alt text, JSON-LD, and size checks"
```

---

### Task 13: Create diff validator

**Files:**
- Create: `monitoring/agents/lib/validators/diff-validator.mjs`
- Create: `tests/unit/diff-validator.test.ts`

- [ ] **Step 1: Write failing test**

Create `tests/unit/diff-validator.test.ts`:
```typescript
import { describe, it, expect } from "vitest";

let validator: any;

beforeAll(async () => {
  validator = await import(
    "../../monitoring/agents/lib/validators/diff-validator.mjs"
  );
});

describe("diff-validator", () => {
  describe("validateFileContent", () => {
    it("passes for valid React component", () => {
      const code = `import React from "react";
export default function Page() {
  return <div><h1>Test</h1></div>;
}`;
      const result = validator.validateFileContent(code, {
        maxAddedLines: 500,
      });
      expect(result.passed).toBe(true);
    });

    it("fails for merge conflict markers", () => {
      const code = `import React from "react";
<<<<<<< HEAD
const x = 1;
=======
const x = 2;
>>>>>>> branch
export default function Page() { return <div />; }`;
      const result = validator.validateFileContent(code, {});
      expect(result.passed).toBe(false);
      expect(result.errors.some((e: string) => e.includes("conflict"))).toBe(
        true
      );
    });

    it("fails for duplicate export default", () => {
      const code = `import React from "react";
export default function Page() { return <div />; }
export default function Other() { return <span />; }`;
      const result = validator.validateFileContent(code, {});
      expect(result.passed).toBe(false);
      expect(
        result.errors.some((e: string) => e.includes("duplicate"))
      ).toBe(true);
    });

    it("fails for missing return statement in component", () => {
      const code = `import React from "react";
export default function Page() {
  const x = 1;
}`;
      const result = validator.validateFileContent(code, {});
      expect(result.passed).toBe(false);
      expect(result.errors.some((e: string) => e.includes("return"))).toBe(
        true
      );
    });

    it("validates all JSON-LD blocks parse", () => {
      const code = `import React from "react";
export default function Page() {
  return <div>
    <script type="application/ld+json">{"@context":"https://schema.org"}</script>
    <script type="application/ld+json">{broken json</script>
  </div>;
}`;
      const result = validator.validateFileContent(code, {});
      expect(result.passed).toBe(false);
      expect(result.errors.some((e: string) => e.includes("JSON-LD"))).toBe(
        true
      );
    });

    it("fails if file is too large", () => {
      const code =
        `import React from "react";\nexport default function Page() { return <div />; }\n` +
        "// line\n".repeat(600);
      const result = validator.validateFileContent(code, {
        maxAddedLines: 500,
      });
      expect(result.passed).toBe(false);
      expect(result.errors.some((e: string) => e.includes("lines"))).toBe(
        true
      );
    });
  });
});
```

- [ ] **Step 2: Run test to verify failure**

```bash
npm run test:unit -- tests/unit/diff-validator.test.ts
```

- [ ] **Step 3: Implement diff validator**

Create `monitoring/agents/lib/validators/diff-validator.mjs`:
```javascript
/**
 * Validates file content after an agent has written it to disk,
 * before git commit. Checks the full file for structural integrity.
 */
export function validateFileContent(code, options = {}) {
  const errors = [];
  const maxLines = options.maxAddedLines || 500;

  // Merge conflict markers
  if (/^<{7}\s/m.test(code) || /^={7}$/m.test(code) || /^>{7}\s/m.test(code)) {
    errors.push("File contains merge conflict markers");
  }

  // Duplicate export default
  const exportDefaults = code.match(/export default\b/g);
  if (exportDefaults && exportDefaults.length > 1) {
    errors.push(
      `File has ${exportDefaults.length} duplicate export default statements`
    );
  }

  // Missing export default (required for React page components)
  if (!code.includes("export default")) {
    errors.push("File is missing export default statement");
  }

  // Missing return/JSX in component (basic check)
  if (
    code.includes("export default function") &&
    !code.includes("return") &&
    !code.includes("=>")
  ) {
    errors.push(
      "Component function has no return statement — likely broken JSX"
    );
  }

  // JSON-LD validation
  const jsonLdPattern =
    /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/g;
  let match;
  while ((match = jsonLdPattern.exec(code)) !== null) {
    try {
      JSON.parse(match[1]);
    } catch (e) {
      errors.push(`Invalid JSON-LD block: ${e.message}`);
    }
  }

  // File size check
  const lineCount = code.split("\n").length;
  if (lineCount > maxLines) {
    errors.push(
      `File has ${lineCount} lines (max ${maxLines}) — unusually large for a single change`
    );
  }

  return { passed: errors.length === 0, errors };
}
```

- [ ] **Step 4: Run tests**

```bash
npm run test:unit -- tests/unit/diff-validator.test.ts
```
Expected: All PASS.

- [ ] **Step 5: Commit**

```bash
git add monitoring/agents/lib/validators/diff-validator.mjs tests/unit/diff-validator.test.ts
git commit -m "feat: add diff validator for structural integrity before agent commits"
```

---

### Task 14: Create unified validator entry point

**Files:**
- Create: `monitoring/agents/lib/validators/index.mjs`

- [ ] **Step 1: Create the entry point that routes to the correct validator**

Create `monitoring/agents/lib/validators/index.mjs`:
```javascript
import { validateContent } from "./content-validator.mjs";
import { validateSchema } from "./schema-validator.mjs";
import { validateMeta } from "./meta-validator.mjs";
import { validateTechnicalFix } from "./technical-validator.mjs";
import { validateFileContent } from "./diff-validator.mjs";

const AGENT_VALIDATORS = {
  "content-writer": (code, metadata) => validateContent(code, metadata),
  "schema-generator": (code, metadata) => validateSchema(code, metadata),
  "meta-tag-optimizer": (code, metadata) => validateMeta(metadata),
  "technical-fixer": (code, metadata) => validateTechnicalFix(code, metadata),
  "homepage-optimizer": (code, metadata) => validateTechnicalFix(code, metadata),
  "internal-link-optimizer": (code, metadata) =>
    validateTechnicalFix(code, metadata),
};

/**
 * Validate agent output before commit.
 * @param {string} agentType - The agent name (e.g., "content-writer")
 * @param {string} code - The generated/modified code
 * @param {object} metadata - Additional context (targetKeyword, originalSize, etc.)
 * @returns {{ passed: boolean, errors: string[] }}
 */
export function validate(agentType, code, metadata = {}) {
  const agentValidator = AGENT_VALIDATORS[agentType];
  if (!agentValidator) {
    return { passed: true, errors: [] };
  }
  return agentValidator(code, metadata);
}

/**
 * Validate the full file content after write, before git commit.
 * Runs the diff/structural validator regardless of agent type.
 */
export { validateFileContent };
```

- [ ] **Step 2: Commit**

```bash
git add monitoring/agents/lib/validators/index.mjs
git commit -m "feat: add unified validator entry point routing to agent-specific validators"
```

---

### Task 15: Integrate validators into action agents

**Files:**
- Modify: `monitoring/agents/action/content-writer.mjs`
- Modify: `monitoring/agents/action/schema-generator.mjs`
- Modify: `monitoring/agents/action/meta-tag-optimizer.mjs`
- Modify: `monitoring/agents/action/technical-fixer.mjs`
- Modify: `monitoring/agents/action/homepage-optimizer.mjs`
- Modify: `monitoring/agents/action/internal-link-optimizer.mjs`

- [ ] **Step 1: Add validator import to each action agent**

At the top of each of the 6 action agent files, add:
```javascript
import { validate, validateFileContent } from "../lib/validators/index.mjs";
```

- [ ] **Step 2: Add validation gate in content-writer.mjs**

In `content-writer.mjs`, find the section where `buildSucceeds()` is called (around line 467 for update-content and line 549 for write-content). Before the `buildSucceeds()` call, add the validation gate:

```javascript
// Before buildSucceeds() call:
const validation = validate("content-writer", generatedCode, {
  targetKeyword: action?.keyword || topic?.keyword || "",
});
if (!validation.passed) {
  console.log(`  ❌ Content validation failed: ${validation.errors.join(", ")}`);
  context.discord.post("seo", {
    embeds: [{
      title: "❌ Content Writer: Output Rejected",
      description: validation.errors.map(e => `• ${e}`).join("\n"),
      color: 15158332,
    }],
  });
  // Revert the file
  fs.unlinkSync(filePath); // for new files
  // OR: execSync(`git checkout -- ${filePath}`); // for modified files
  continue; // skip to next action
}
```

Also add after file write but before commit:
```javascript
const diffCheck = validateFileContent(
  fs.readFileSync(filePath, "utf-8"),
  { maxAddedLines: 500 }
);
if (!diffCheck.passed) {
  console.log(`  ❌ Diff validation failed: ${diffCheck.errors.join(", ")}`);
  // Revert and skip
}
```

- [ ] **Step 3: Add validation gate in schema-generator.mjs**

Find where the schema JSON is generated and before `buildSucceeds()`:
```javascript
const validation = validate("schema-generator", schemaJson, {});
if (!validation.passed) {
  console.log(`  ❌ Schema validation failed: ${validation.errors.join(", ")}`);
  context.discord.post("seo", {
    embeds: [{
      title: "❌ Schema Generator: Output Rejected",
      description: validation.errors.map(e => `• ${e}`).join("\n"),
      color: 15158332,
    }],
  });
  execSync(`git checkout -- ${filePath}`);
  continue;
}
```

- [ ] **Step 4: Add validation gate in meta-tag-optimizer.mjs**

Before commit:
```javascript
const validation = validate("meta-tag-optimizer", "", {
  title: newTitle,
  description: newDescription,
  targetKeyword: action?.keyword || "",
});
if (!validation.passed) {
  console.log(`  ❌ Meta validation failed: ${validation.errors.join(", ")}`);
  // Discord notify + revert + skip
}
```

- [ ] **Step 5: Add validation gate in technical-fixer.mjs, homepage-optimizer.mjs, internal-link-optimizer.mjs**

Same pattern — validate before commit, revert on failure. Use `validateTechnicalFix` with `originalSize` from reading the file before modification:
```javascript
const originalSize = fs.readFileSync(filePath, "utf-8").length;
// ... agent makes changes ...
const validation = validate(name, modifiedCode, { originalSize });
```

- [ ] **Step 6: Run existing agent tests (build check)**

```bash
npm run build
```
Expected: Build succeeds — validators are new imports but don't change existing behavior.

- [ ] **Step 7: Commit**

```bash
git add monitoring/agents/action/*.mjs
git commit -m "feat: integrate output validators into all 6 action agents"
```

---

## Phase 3: Staging Branch Flow

### Task 16: Modify git-ops for staging branch

**Files:**
- Modify: `monitoring/marketing/lib/git-ops.mjs`

- [ ] **Step 1: Read current git-ops.mjs**

Read `monitoring/marketing/lib/git-ops.mjs` to see the exact current implementation.

- [ ] **Step 2: Modify commitAndPush to target staging branch**

Update the `commitAndPush` function to:
1. Create `staging` branch if it doesn't exist
2. Switch to staging, commit, push to staging
3. Switch back to main

```javascript
export function commitAndPush(message) {
  // Ensure staging branch exists
  try {
    exec("git rev-parse --verify staging");
  } catch {
    exec("git branch staging");
  }

  // Stash current changes, apply on staging
  exec("git stash");
  exec("git checkout staging");
  exec("git merge main --no-edit"); // keep staging up to date with main
  exec("git stash pop");
  exec("git add -A");
  exec(`git commit -m "${message}"`);
  exec("git push origin staging");
  exec("git checkout main");
}
```

- [ ] **Step 3: Add writeStagingManifest function**

Add to `git-ops.mjs`:
```javascript
export function writeStagingManifest(agentName, changes) {
  const manifest = {
    agent: agentName,
    timestamp: new Date().toISOString(),
    changes: changes, // [{file, url, type}]
  };
  const manifestPath = path.join(REPO_ROOT, "staging-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add monitoring/marketing/lib/git-ops.mjs
git commit -m "feat: modify git-ops to push agent changes to staging branch"
```

---

### Task 17: Create staging CI workflow

**Files:**
- Create: `.github/workflows/staging-ci.yml`

- [ ] **Step 1: Create the staging CI workflow**

Create `.github/workflows/staging-ci.yml`:
```yaml
name: Staging CI

on:
  push:
    branches: [staging]

permissions:
  contents: write

jobs:
  backend-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm run test:unit
      - run: npm run build

  frontend-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install chromium --with-deps
      - name: Start dev server and run E2E tests
        run: |
          npm run dev &
          npx wait-on http://localhost:8080 --timeout 30000
          npm run test:e2e
        env:
          CI: true

  merge-to-main:
    runs-on: ubuntu-latest
    needs: [backend-validation, frontend-validation]
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}
      - name: Merge staging into main
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git checkout main
          git merge staging --no-edit
          git push origin main
      - name: Notify Discord on failure
        if: failure()
        run: |
          curl -H "Content-Type: application/json" \
            -d '{"content":"❌ **Staging CI Failed** — merge to main blocked. Check: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"}' \
            ${{ secrets.DISCORD_WEBHOOK_URL }}
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/staging-ci.yml
git commit -m "feat: add staging CI workflow with parallel backend/frontend validation"
```

---

### Task 18: Add smoke failure check to orchestrator

**Files:**
- Modify: `monitoring/agents/orchestrator.mjs`

- [ ] **Step 1: Read current orchestrator to find the action phase entry point**

Read `monitoring/agents/orchestrator.mjs` around lines 188-232 to see the action phase runner.

- [ ] **Step 2: Add smoke failure flag check before action phase**

At the start of the action phase runner (before reading the action queue), add:
```javascript
// Check for smoke test failure flag
const smokeFailure = context.state.read("meta", "smoke-failure");
if (smokeFailure) {
  console.log("⚠️  Smoke test failure flag is set — skipping action phase");
  context.discord.post("health", {
    embeds: [{
      title: "⚠️ Agent Actions Blocked",
      description: `Post-deploy smoke tests failed at ${smokeFailure.timestamp}. Actions are blocked until the flag is cleared.\n\nTo clear: \`rm monitoring/agents/state/meta/smoke-failure.json\``,
      color: 16776960,
    }],
  });
  return;
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add monitoring/agents/orchestrator.mjs
git commit -m "feat: block agent actions when smoke test failure flag is set"
```

---

## Phase 4: E2E Tests

### Task 19: Write business facts E2E test

**Files:**
- Create: `tests/e2e/business-facts.spec.ts`

- [ ] **Step 1: Create business facts test**

Create `tests/e2e/business-facts.spec.ts`:
```typescript
import { test, expect } from "@playwright/test";
import businessFacts from "../fixtures/business-facts.json";

const PAGES_WITH_PHONE = ["/", "/contact", "/faq"];
const PAGES_WITH_EMAIL = ["/contact"];

test.describe("Business Facts Validation", () => {
  test("phone number is correct in header", async ({ page }) => {
    await page.goto("/");
    const phoneTelLinks = page.locator(`a[href="tel:${businessFacts.phoneTel}"]`);
    await expect(phoneTelLinks.first()).toBeVisible();
  });

  test("phone number is correct in footer", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toContainText(businessFacts.phone);
  });

  for (const pagePath of PAGES_WITH_PHONE) {
    test(`phone number present on ${pagePath}`, async ({ page }) => {
      await page.goto(pagePath);
      await expect(page.locator("body")).toContainText(businessFacts.phone);
    });
  }

  for (const pagePath of PAGES_WITH_EMAIL) {
    test(`email link correct on ${pagePath}`, async ({ page }) => {
      await page.goto(pagePath);
      const mailtoLink = page.locator(
        `a[href="mailto:${businessFacts.email}"]`
      );
      await expect(mailtoLink.first()).toBeVisible();
    });
  }

  test("address on contact page", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("body")).toContainText(businessFacts.address);
  });

  test("company name not misspelled on homepage", async ({ page }) => {
    await page.goto("/");
    const bodyText = await page.locator("body").textContent();
    // Check for common misspellings
    expect(bodyText).not.toContain("Demar Transportation");
    expect(bodyText).not.toContain("DeMar Transporation");
    expect(bodyText).not.toContain("De Mar Transportation");
  });

  test("JSON-LD contains correct business info", async ({ page }) => {
    await page.goto("/");
    const jsonLd = await page.locator('script[type="application/ld+json"]').all();
    expect(jsonLd.length).toBeGreaterThan(0);

    for (const script of jsonLd) {
      const content = await script.textContent();
      if (content && content.includes("telephone")) {
        const data = JSON.parse(content);
        if (data.telephone) {
          expect(data.telephone).toContain("7752304767");
        }
      }
    }
  });
});
```

- [ ] **Step 2: Run E2E test against dev server**

```bash
npm run dev &
sleep 5
npm run test:e2e -- tests/e2e/business-facts.spec.ts
kill %1
```

- [ ] **Step 3: Fix any selectors that don't match the actual DOM**

Adjust selectors based on actual page structure. The phone number format and link structure may differ slightly.

- [ ] **Step 4: Verify all pass**

```bash
npm run test:e2e -- tests/e2e/business-facts.spec.ts
```

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/business-facts.spec.ts
git commit -m "test: add E2E business facts validation for phone, email, address"
```

---

### Task 20: Write CTA presence E2E test

**Files:**
- Create: `tests/e2e/cta-presence.spec.ts`

- [ ] **Step 1: Create CTA presence test**

Create `tests/e2e/cta-presence.spec.ts`:
```typescript
import { test, expect } from "@playwright/test";

test.describe("CTA Presence Tests", () => {
  test("homepage has quote CTA", async ({ page }) => {
    await page.goto("/");
    const quoteCTA = page.locator('a[href="/quote"], a[href*="quote"]');
    await expect(quoteCTA.first()).toBeVisible();
  });

  test("homepage has phone CTA", async ({ page }) => {
    await page.goto("/");
    const phoneCTA = page.locator('a[href^="tel:"]');
    await expect(phoneCTA.first()).toBeVisible();
  });

  test("homepage has at least 3 service links", async ({ page }) => {
    await page.goto("/");
    const serviceLinks = page.locator('a[href^="/services/"]');
    const count = await serviceLinks.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  const servicePages = [
    "/services/dry-van",
    "/services/reefer",
    "/services/flatbed",
  ];

  for (const servicePath of servicePages) {
    test(`${servicePath} has quote CTA`, async ({ page }) => {
      await page.goto(servicePath);
      const quoteCTA = page.locator('a[href="/quote"], a[href*="quote"]');
      await expect(quoteCTA.first()).toBeVisible();
    });

    test(`${servicePath} has phone CTA`, async ({ page }) => {
      await page.goto(servicePath);
      const phoneCTA = page.locator('a[href^="tel:"]');
      await expect(phoneCTA.first()).toBeVisible();
    });
  }

  test("contact page has phone, email, quote, and careers links", async ({
    page,
  }) => {
    await page.goto("/contact");
    await expect(page.locator('a[href^="tel:"]').first()).toBeVisible();
    await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
    const quoteOrCareers = page.locator(
      'a[href="/quote"], a[href="/careers"]'
    );
    const count = await quoteOrCareers.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("careers page has application form", async ({ page }) => {
    await page.goto("/careers");
    // Check for form elements indicating the driver application
    const form = page.locator("form, [role='form']");
    const formInputs = page.locator(
      "input[type='text'], input[type='email'], select"
    );
    const inputCount = await formInputs.count();
    expect(inputCount).toBeGreaterThanOrEqual(3);
  });

  test("blog post has at least 1 CTA", async ({ page }) => {
    await page.goto("/blog/why-freight-quote-keeps-changing");
    const cta = page.locator(
      'a[href="/quote"], a[href="/contact"], a[href^="tel:"]'
    );
    const count = await cta.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
```

- [ ] **Step 2: Run E2E test**

```bash
npm run test:e2e -- tests/e2e/cta-presence.spec.ts
```

- [ ] **Step 3: Fix selectors as needed**

Adjust based on actual DOM structure.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/cta-presence.spec.ts
git commit -m "test: add CTA presence E2E tests for all page types"
```

---

### Task 21: Write accessibility E2E test

**Files:**
- Create: `tests/e2e/accessibility.spec.ts`

- [ ] **Step 1: Create accessibility test with axe-core**

Create `tests/e2e/accessibility.spec.ts`:
```typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES_TO_TEST = [
  "/",
  "/contact",
  "/quote",
  "/careers",
  "/services/dry-van",
  "/blog",
  "/faq",
];

test.describe("Accessibility (axe-core)", () => {
  for (const pagePath of PAGES_TO_TEST) {
    test(`${pagePath} has no critical accessibility violations`, async ({
      page,
    }) => {
      await page.goto(pagePath);
      // Wait for page to be fully rendered
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      // Filter to critical and serious only — minor/moderate are informational
      const critical = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      if (critical.length > 0) {
        const summary = critical
          .map(
            (v) =>
              `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} instances)`
          )
          .join("\n");
        expect(critical, `Accessibility violations on ${pagePath}:\n${summary}`).toHaveLength(0);
      }
    });
  }
});
```

- [ ] **Step 2: Run accessibility tests**

```bash
npm run test:e2e -- tests/e2e/accessibility.spec.ts
```

- [ ] **Step 3: Review results — some violations may be pre-existing**

If there are pre-existing violations, document them and add them to an ignore list or create separate tasks to fix them. The test should pass for the current state of the site.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/accessibility.spec.ts
git commit -m "test: add axe-core accessibility tests for critical pages"
```

---

### Task 22: Write visual regression E2E test

**Files:**
- Create: `tests/e2e/visual/visual-regression.spec.ts`

- [ ] **Step 1: Create visual regression test**

Create `tests/e2e/visual/visual-regression.spec.ts`:
```typescript
import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const BASELINE_PAGES = [
  { path: "/", name: "homepage" },
  { path: "/contact", name: "contact" },
  { path: "/quote", name: "quote" },
  { path: "/careers", name: "careers" },
  { path: "/services/dry-van", name: "services-dry-van" },
  { path: "/blog", name: "blog-index" },
  { path: "/resources", name: "resources-index" },
  { path: "/faq", name: "faq" },
  { path: "/about", name: "about" },
];

// Load dynamic pages from staging manifest if it exists
function getDynamicPages(): Array<{ path: string; name: string }> {
  try {
    const manifestPath = path.resolve(
      __dirname,
      "../../../staging-manifest.json"
    );
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      return manifest.changes
        .filter((c: any) => c.url)
        .map((c: any) => ({
          path: c.url,
          name: `dynamic-${c.url.replace(/\//g, "-").slice(1)}`,
        }));
    }
  } catch {
    // No manifest — only test baseline pages
  }
  return [];
}

const ALL_PAGES = [...BASELINE_PAGES, ...getDynamicPages()];

test.describe("Visual Regression", () => {
  for (const page of ALL_PAGES) {
    test(`${page.name} matches visual baseline`, async ({ page: pwPage }) => {
      await pwPage.goto(page.path);
      await pwPage.waitForLoadState("networkidle");
      // Wait for fonts and images
      await pwPage.waitForTimeout(1000);

      await expect(pwPage).toHaveScreenshot(`${page.name}.png`, {
        maxDiffPixelRatio: 0.005,
        fullPage: true,
      });
    });
  }
});
```

- [ ] **Step 2: Generate initial baseline snapshots**

```bash
npm run test:update-snapshots
```

This creates golden screenshots in `tests/e2e/visual/visual-regression.spec.ts-snapshots/`.

- [ ] **Step 3: Verify snapshots were created**

```bash
ls tests/e2e/visual/visual-regression.spec.ts-snapshots/
```
Expected: `.png` files for each baseline page × each project (desktop + mobile).

- [ ] **Step 4: Run visual regression to verify it passes against own baselines**

```bash
npm run test:e2e:visual
```
Expected: All PASS (comparing against just-created snapshots).

- [ ] **Step 5: Commit baselines**

```bash
git add tests/e2e/visual/
git commit -m "test: add visual regression tests with initial baseline snapshots"
```

---

## Phase 5: Post-Deploy Smoke + Rollback

### Task 23: Write post-deploy smoke test

**Files:**
- Create: `tests/smoke/post-deploy.spec.ts`

- [ ] **Step 1: Create smoke test**

Create `tests/smoke/post-deploy.spec.ts`:
```typescript
import { test, expect, request } from "@playwright/test";

const LIVE_URL = "https://demartransportation.com";

test.describe("Post-Deploy Smoke Tests", () => {
  test("sitemap.xml is accessible and valid", async () => {
    const ctx = await request.newContext();
    const resp = await ctx.get(`${LIVE_URL}/sitemap.xml`);
    expect(resp.status()).toBe(200);
    const body = await resp.text();
    expect(body).toContain("<urlset");
    expect(body).toContain("<url>");
    expect(body).toContain("demartransportation.com");
  });

  test("robots.txt is accessible and not blocking", async () => {
    const ctx = await request.newContext();
    const resp = await ctx.get(`${LIVE_URL}/robots.txt`);
    expect(resp.status()).toBe(200);
    const body = await resp.text();
    expect(body).not.toContain("Disallow: /\n");
  });

  test("all sitemap URLs return 200", async () => {
    const ctx = await request.newContext();
    const sitemapResp = await ctx.get(`${LIVE_URL}/sitemap.xml`);
    const sitemap = await sitemapResp.text();

    const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    expect(urls.length).toBeGreaterThan(20);

    const failures: string[] = [];
    for (const url of urls) {
      const resp = await ctx.head(url);
      if (resp.status() !== 200) {
        failures.push(`${url} → ${resp.status()}`);
      }
    }
    expect(failures, `Failed URLs:\n${failures.join("\n")}`).toHaveLength(0);
  });

  test("homepage renders with no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto(LIVE_URL);
    await page.waitForLoadState("networkidle");

    // Filter out known benign errors (e.g., third-party scripts)
    const criticalErrors = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("third-party")
    );
    expect(
      criticalErrors,
      `Console errors: ${criticalErrors.join(", ")}`
    ).toHaveLength(0);
  });

  test("homepage has correct title", async ({ page }) => {
    await page.goto(LIVE_URL);
    const title = await page.title();
    expect(title).not.toBe("React App");
    expect(title).toContain("DeMar");
  });

  test("homepage has meta description", async ({ page }) => {
    await page.goto(LIVE_URL);
    const desc = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(desc).toBeTruthy();
    expect(desc!.length).toBeGreaterThan(50);
  });

  test("homepage has OG tags", async ({ page }) => {
    await page.goto(LIVE_URL);
    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute("content");
    expect(ogTitle).toBeTruthy();
  });

  test("homepage JSON-LD is valid", async ({ page }) => {
    await page.goto(LIVE_URL);
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .all();
    expect(scripts.length).toBeGreaterThan(0);

    for (const script of scripts) {
      const content = await script.textContent();
      expect(() => JSON.parse(content!)).not.toThrow();
    }
  });

  test("SPA routing works for deep links", async ({ page }) => {
    await page.goto(`${LIVE_URL}/services/dry-van`);
    await page.waitForLoadState("networkidle");
    // Should not show 404 content
    const body = await page.locator("body").textContent();
    expect(body).not.toContain("Page Not Found");
    expect(body).toContain("Dry Van");
  });

  test("quote form renders with required fields", async ({ page }) => {
    await page.goto(`${LIVE_URL}/quote`);
    await page.waitForLoadState("networkidle");
    // Check for key form inputs
    await expect(
      page.locator('input[type="email"], input[placeholder*="email" i]').first()
    ).toBeVisible();
    await expect(
      page.locator('input[type="tel"], input[placeholder*="phone" i]').first()
    ).toBeVisible();
  });

  test("careers form renders", async ({ page }) => {
    await page.goto(`${LIVE_URL}/careers`);
    await page.waitForLoadState("networkidle");
    const inputs = page.locator("input, select");
    const count = await inputs.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test("contact page has Google Maps embed", async ({ page }) => {
    await page.goto(`${LIVE_URL}/contact`);
    await page.waitForLoadState("networkidle");
    const iframe = page.locator('iframe[src*="google.com/maps"]');
    await expect(iframe).toBeVisible();
  });

  test("Supabase client initializes without errors", async ({ page }) => {
    const supabaseErrors: string[] = [];
    page.on("console", (msg) => {
      if (
        msg.type() === "error" &&
        msg.text().toLowerCase().includes("supabase")
      ) {
        supabaseErrors.push(msg.text());
      }
    });
    await page.goto(`${LIVE_URL}/quote`);
    await page.waitForLoadState("networkidle");
    expect(supabaseErrors).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run smoke test against live site**

```bash
npm run test:smoke
```

- [ ] **Step 3: Fix any failures due to actual site differences**

Adjust selectors, URL patterns, or expected content based on what the live site actually renders.

- [ ] **Step 4: Commit**

```bash
git add tests/smoke/post-deploy.spec.ts
git commit -m "test: add post-deploy smoke tests for live site validation"
```

---

### Task 24: Create post-deploy smoke + rollback workflow

**Files:**
- Create: `.github/workflows/post-deploy-smoke.yml`

- [ ] **Step 1: Create the workflow**

Create `.github/workflows/post-deploy-smoke.yml`:
```yaml
name: Post-Deploy Smoke Tests

on:
  workflow_run:
    workflows: ["Deploy to GreenGeeks"]
    types: [completed]
    branches: [main]

permissions:
  contents: write

jobs:
  smoke-test:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npx playwright install chromium --with-deps

      - name: Wait for deploy to propagate
        run: sleep 30

      - name: Run smoke tests
        id: smoke
        run: npm run test:smoke
        continue-on-error: true

      - name: Auto-revert on failure
        if: steps.smoke.outcome == 'failure'
        run: |
          # Find the merge commit that triggered this deploy
          MERGE_COMMIT=$(git log main -1 --format="%H")

          # Check if we already reverted in the last 24h
          LAST_REVERT=$(git log main --since="24 hours ago" --grep="\[auto-revert\]" --format="%H" | head -1)
          if [ -n "$LAST_REVERT" ]; then
            echo "Already auto-reverted in last 24h — alerting only"
            curl -H "Content-Type: application/json" \
              -d "{\"content\":\"🔴 **Smoke tests failed AGAIN** — manual intervention required. Second failure in 24h, auto-revert skipped.\n\nRun: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}\"}" \
              ${{ secrets.DISCORD_WEBHOOK_URL }}
            exit 1
          fi

          # Revert the merge commit
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git revert --no-edit $MERGE_COMMIT
          git push origin main

          # Set smoke failure flag on VPS
          ssh -o StrictHostKeyChecking=no -i ~/.ssh/deploy_key ${{ secrets.SSH_USERNAME }}@${{ secrets.SSH_HOST }} \
            "echo '{\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"commit\":\"$MERGE_COMMIT\",\"run\":\"${{ github.run_id }}\"}' > /opt/demar-website/monitoring/agents/state/meta/smoke-failure.json"

          # Alert Discord
          curl -H "Content-Type: application/json" \
            -d "{\"content\":\"🔴 **Post-Deploy Smoke Tests FAILED** — auto-reverted commit \`${MERGE_COMMIT:0:7}\`\n\n⚠️ Agent actions are now blocked until the smoke-failure flag is cleared.\n\n🔗 Check: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}\n\n📋 To clear after fixing: \`rm /opt/demar-website/monitoring/agents/state/meta/smoke-failure.json\`\"}" \
            ${{ secrets.DISCORD_WEBHOOK_URL }}

      - name: Notify success
        if: steps.smoke.outcome == 'success'
        run: |
          curl -H "Content-Type: application/json" \
            -d '{"content":"✅ **Post-Deploy Smoke Tests Passed** — site is healthy."}' \
            ${{ secrets.DISCORD_WEBHOOK_URL }}
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/post-deploy-smoke.yml
git commit -m "feat: add post-deploy smoke test workflow with auto-revert on failure"
```

---

## Phase 6: Nightly Visual Regression

### Task 25: Create nightly visual regression workflow

**Files:**
- Create: `.github/workflows/nightly-visual-regression.yml`

- [ ] **Step 1: Create the workflow**

Create `.github/workflows/nightly-visual-regression.yml`:
```yaml
name: Nightly Visual Regression

on:
  schedule:
    - cron: "0 6 * * *" # 6:00 AM UTC daily
  workflow_dispatch: # allow manual trigger

jobs:
  visual-regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install chromium --with-deps

      - name: Run visual regression against live site
        id: visual
        run: |
          SMOKE_BASE_URL=https://demartransportation.com \
          npx playwright test tests/e2e/visual/ \
            --config tests/playwright.config.ts \
            --reporter=html
        continue-on-error: true

      - name: Upload diff artifacts
        if: steps.visual.outcome == 'failure'
        uses: actions/upload-artifact@v4
        with:
          name: visual-regression-diffs
          path: test-results/
          retention-days: 7

      - name: Alert Discord on visual drift
        if: steps.visual.outcome == 'failure'
        run: |
          curl -H "Content-Type: application/json" \
            -d "{\"content\":\"👁️ **Visual Drift Detected** — nightly screenshot comparison found differences.\n\nThis may be caused by external factors (CDN, fonts, third-party embeds) or recent code changes.\n\n📸 Download diff images: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}\n\nIf intentional, update baselines: \`npm run test:update-snapshots\`\"}" \
            ${{ secrets.DISCORD_WEBHOOK_URL }}
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/nightly-visual-regression.yml
git commit -m "feat: add nightly visual regression workflow for live site drift detection"
```

---

## Phase 7: VPS Integration & Final Wiring

### Task 26: Update orchestrator to write staging manifests

**Files:**
- Modify: `monitoring/agents/orchestrator.mjs`

- [ ] **Step 1: Read the action routing section of orchestrator**

Read `monitoring/agents/orchestrator.mjs` around lines 221-232 (action routing) and the section where actions are marked complete.

- [ ] **Step 2: Import writeStagingManifest and wire it into the action flow**

After a successful action agent run (after `commitAndPush` succeeds), call:
```javascript
import { writeStagingManifest } from "../marketing/lib/git-ops.mjs";

// After successful action execution:
writeStagingManifest(agentName, [{
  file: action.targetPage ? pathToSourceFile(action.targetPage) : "",
  url: action.targetPage || "",
  type: action.type || "unknown",
}]);
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add monitoring/agents/orchestrator.mjs
git commit -m "feat: wire staging manifest generation into orchestrator action flow"
```

---

### Task 27: Run full test suite end-to-end

**Files:** None (verification task)

- [ ] **Step 1: Run unit tests**

```bash
npm run test:unit
```
Expected: All PASS.

- [ ] **Step 2: Run E2E tests against dev server**

```bash
npm run test:e2e
```
Expected: All PASS (may need dev server running).

- [ ] **Step 3: Run smoke tests against live site**

```bash
npm run test:smoke
```
Expected: All PASS.

- [ ] **Step 4: Run full build**

```bash
npm run build
```
Expected: Build succeeds.

- [ ] **Step 5: Verify pre-commit hook works**

Make a trivial change, commit it, verify lint-staged runs:
```bash
echo "// verify" >> src/vite-env.d.ts
git add src/vite-env.d.ts
git commit -m "test: verify pre-commit hook"
git revert HEAD --no-edit
```

- [ ] **Step 6: Create staging branch for first time**

```bash
git branch staging
git push origin staging
```

- [ ] **Step 7: Final commit with all passing tests**

```bash
git add -A
git commit -m "feat: complete QA system implementation — 13 components across 7 phases"
```
