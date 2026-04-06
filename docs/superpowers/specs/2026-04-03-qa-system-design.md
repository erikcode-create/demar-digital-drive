# QA System Design: Agent-Aware Layered Testing

**Date:** 2026-04-03
**Status:** Draft
**Approach:** C — Agent-aware test framework with layered CI and strict gating

## Problem

The DeMar Transportation website has 14 automated agents making nightly changes (blog posts, schema fixes, meta tag updates, technical fixes) with zero test coverage. The only safety net is `npm run build` succeeding. There are no unit tests, no E2E tests, no pre-commit hooks, no CI validation before merge, and ESLint is not enforced. Bad agent output is only caught after it hits production.

## Goals

1. Nothing reaches `main` without passing lint + tests + build
2. Agent changes go through a `staging` branch with CI validation before merge
3. Agent outputs are validated inside the pipeline before even creating a commit
4. Visual regressions from agent changes are caught via Playwright screenshots
5. Post-deploy smoke tests verify the live site is functional
6. Business-critical content (phone, email, CTAs) is verified on every change
7. Failed deploys auto-revert to last known good state
8. Agent changes are diff-validated programmatically before commit
9. Nightly scheduled screenshots catch visual drift independent of code changes

## Architecture Overview

```
Agent Pipeline                    Git Flow                    CI/CD
─────────────────────────────────────────────────────────────────────
Agent generates change
  ↓
Agent Output Validator ──fail──→ skip + log to Discord
  ↓ pass
  ↓                              Push to `staging` branch
  ↓                              CI triggers on `staging`:
                                   ├─ Lint (ESLint + TS)
                                   ├─ Unit Tests (Vitest)
                                   ├─ E2E Tests (Playwright)
                                   │   ├─ Visual regression
                                   │   ├─ CTA presence
                                   │   ├─ Accessibility (axe-core)
                                   │   └─ Business facts
                                   └─ Build verification
                                        ↓ all pass
                                   Auto-merge staging → main
                                        ↓
                                   Deploy workflow triggers
                                        ↓
                                   Post-deploy smoke tests
                                        ↓ fail
                                   Auto-revert staging merge
                                   Discord alert + block next agent run

Nightly (independent of agent runs):
  Scheduled regression screenshots → diff against baselines → Discord alert on drift
```

## Components

### 1. Playwright Visual Regression

**Location:** `tests/e2e/visual/`
**Tool:** Playwright + @playwright/test
**Runs:** In CI on staging branch pushes

**Baseline pages (always tested):**
- Homepage (`/`)
- Contact (`/contact`)
- Quote (`/quote`)
- Careers (`/careers`)
- Services index (one representative: `/services/dry-van`)
- Blog index (`/blog`)
- Resources index (`/resources`)
- FAQ (`/faq`)
- About (`/about`)

**Dynamic pages:** Agent changes include metadata about which pages were modified. The Playwright suite reads this from a `staging-manifest.json` file the agent writes, and adds those pages to the visual test run.

**Viewports:** Desktop (1280x720) + Mobile (375x812)

**Diff strategy:** Pixel comparison with 0.5% threshold tolerance. Failures produce a diff image artifact uploaded to the CI run.

**Baseline management:** Golden screenshots stored in `tests/e2e/visual/snapshots/`. Updated manually via `npm run test:update-snapshots` when intentional design changes are made.

### 2. TDD for Agent Code

**Location:** `tests/unit/`
**Tool:** Vitest
**Runs:** In CI on every push to staging + locally via pre-commit hook

**What gets tested:**

| Module | Tests |
|--------|-------|
| `source-reader.mjs` | extractText, extractHeadings, extractMetaTitle, extractMetaDescription, variable content patterns, BlogPost component parsing |
| `state.mjs` | read/write atomicity, locking, concurrent access, category isolation |
| `pages.mjs` | page registry completeness, URL normalization, slug generation, auto-discovery |
| `orchestrator.mjs` | phase ordering, agent failure isolation, lock acquire/release, graceful shutdown |
| `discord.mjs` | channel routing, embed formatting, message chunking (10 embed limit) |
| `serper.mjs` | response parsing, error handling, rate limit behavior |
| `git-ops.mjs` | buildSucceeds, commitAndPush, branch creation |
| `claude-api.mjs` | response extraction, markdown fence stripping, retry logic |
| `fix-rules.mjs` | tier classification, rule matching |

**Test data:** Fixture TSX files in `tests/fixtures/` that mirror real page structures. No mocking of the filesystem — tests read real fixture files.

### 3. Parallel Sub-Agent Testing in CI

**Location:** `.github/workflows/staging-ci.yml`
**Strategy:** Frontend and backend validation run as parallel CI jobs.

```yaml
jobs:
  backend-validation:    # ~30s
    - npm ci
    - npm run lint
    - npm run build
    - npm run test:unit

  frontend-validation:   # ~90s (needs browser)
    - npm ci
    - npx playwright install chromium
    - npm run test:e2e       # visual + CTA + accessibility
    - npm run test:smoke:local  # local dev server smoke

  merge:                 # depends on both above
    needs: [backend-validation, frontend-validation]
    - merge staging → main
```

### 4. Pre-Commit Hooks

**Tool:** Husky + lint-staged
**Location:** `.husky/pre-commit`

**On every commit:**
- ESLint on staged `.ts`/`.tsx` files
- TypeScript type-check (`tsc --noEmit`)
- Vitest related tests (`vitest related` — runs only tests affected by changed files)

**Configuration:**
```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "bash -c 'tsc --noEmit'"],
    "src/**/*.{ts,tsx}": ["vitest related --run"]
  }
}
```

**Agent bypass:** Agents run on the VPS where hooks execute in the git environment. The hooks apply equally — agent commits must also pass lint + type-check.

### 5. CI on Staging Branch

**File:** `.github/workflows/staging-ci.yml`
**Trigger:** Push to `staging` branch

**Pipeline:**
1. Lint (ESLint)
2. Type-check (tsc --noEmit)
3. Unit tests (Vitest)
4. Build (Vite)
5. E2E tests against dev server (Playwright)
6. If all pass → auto-merge `staging` into `main`
7. If any fail → Discord alert to `#website-health`, block merge

**Auto-merge mechanism:** GitHub Actions bot merges staging → main via `gh pr merge` or direct fast-forward merge if no conflicts.

### 6. Agent → Staging PR Flow

**Current flow:**
```
Agent → commit to main → deploy
```

**New flow:**
```
Agent → commit to staging → CI validates → auto-merge to main → deploy
```

**Changes required:**
- All agents' `commitAndPush` in `git-ops.mjs` targets `staging` instead of `main`
- Agents write a `staging-manifest.json` listing modified pages + change type
- CI reads the manifest to determine which additional pages to test
- On merge failure (conflicts), Discord alert + skip until manual resolution

**Manifest format:**
```json
{
  "agent": "content-writer",
  "timestamp": "2026-04-03T07:00:00Z",
  "changes": [
    {
      "file": "src/pages/blog/new-post.tsx",
      "url": "/blog/new-post",
      "type": "new-content"
    }
  ],
  "supportingFiles": [
    "src/App.tsx",
    "src/pages/Blog.tsx",
    "public/sitemap.xml"
  ]
}
```

### 7. Source-of-Truth Business Facts Validation

**Location:** `tests/e2e/business-facts.spec.ts`
**Tool:** Playwright
**Runs:** In CI E2E suite

**Source of truth file:** `tests/fixtures/business-facts.json`
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

**Checks per page:**
- Phone number text matches on pages where it appears (header, footer, contact, hero)
- `tel:` href matches phoneTel
- `mailto:` href matches email
- Company name not misspelled
- Address correct on contact page and in JSON-LD
- No agent has introduced a different phone number or email anywhere

### 8. CTA Presence Tests

**Location:** `tests/e2e/cta-presence.spec.ts`
**Tool:** Playwright
**Runs:** In CI E2E suite

**Rules:**
| Page Type | Required CTAs |
|-----------|--------------|
| Homepage | "Request a Quote" button, phone CTA, at least 3 service links |
| Service pages | Quote CTA, phone CTA |
| Blog posts | At least 1 inline CTA (quote or contact link) |
| Resource pages | At least 1 inline CTA |
| Contact page | Phone link, email link, quote form link, careers link |
| Careers page | Application form present |

**Detection:** Playwright queries for `a[href="/quote"]`, `a[href^="tel:"]`, `a[href^="mailto:"]`, and buttons containing CTA text. Fails if required CTAs are missing from any page.

### 9. Post-Deploy Smoke Suite

**Location:** `tests/smoke/`
**Tool:** Playwright (hits live site)
**Runs:** After deploy workflow completes (triggered by deploy.yml success)
**File:** `.github/workflows/post-deploy-smoke.yml`

**Checks:**
1. **All 36 sitemap URLs return HTTP 200** — Fetch sitemap.xml, parse URLs, HEAD request each
2. **No console errors** — Playwright captures console.error on homepage, contact, quote pages
3. **Supabase client initializes** — No JS errors related to Supabase on quote page
4. **Forms render** — Quote form has all required fields visible. Careers form has all required fields visible. (No submission.)
5. **JSON-LD valid** — Extract `<script type="application/ld+json">` from homepage, contact page. Parse as JSON. Verify required fields present.
6. **robots.txt accessible** — GET /robots.txt returns 200, does not contain `Disallow: /`
7. **Sitemap accessible** — GET /sitemap.xml returns 200, valid XML
8. **Meta tags present** — Homepage has title (not "React App"), description, OG tags
9. **SPA routing works** — Navigate to `/services/dry-van` directly (not via client nav). Page renders, not 404.
10. **Google Maps iframe loads** — Contact page iframe element present with maps URL

**On failure:** Discord alert to `#website-health` with failing checks. Next agent run is blocked until resolved.

### 10. Agent Output Validators

**Location:** `monitoring/agents/lib/validators/`
**Runs:** Inside agent pipeline, before git commit

Each agent type gets a validator that runs on the generated output before it's written to disk or committed.

#### Content Writer Validator (`content-validator.mjs`)
```
- Word count >= 1500
- Contains import BlogPost statement
- Contains export default statement
- Valid JSX (no unclosed tags — basic regex checks)
- No placeholder text: "Lorem ipsum", "[INSERT", "TODO", "PLACEHOLDER"
- No competitor brand names (configurable blocklist)
- No em dashes (—) per brand guidelines
- No exclamation marks per brand guidelines
- Phone number if present matches source of truth
- Email if present matches source of truth
- All internal links reference valid routes from page registry
- Target keyword present in content
- At least 2 H2 headings
- Has FAQ section
```

#### Schema Validator (`schema-validator.mjs`)
```
- Output parses as valid JSON
- Has @context: "https://schema.org"
- Has @type field
- Required fields present for the schema type
- URLs use https://demartransportation.com (not localhost, not relative)
- Phone/email match source of truth
- Address matches source of truth
```

#### Meta Tag Validator (`meta-validator.mjs`)
```
- Title length: 30-60 characters
- Description length: 120-160 characters
- No duplicate title across all pages (check against page registry)
- Contains target keyword
- No all-caps words
- No placeholder text
```

#### Technical Fix Validator (`technical-validator.mjs`)
```
- Valid JSX structure (import + export default present)
- File size within 20% of original (no massive additions/deletions)
- No removed imports that are still used (basic reference check)
- Alt text under 125 characters
- No "image of" prefix in alt text
- Schema JSON-LD parses correctly
```

**Validator integration point:**
```javascript
// In each action agent, before commitAndPush:
const validation = await validate(agentType, generatedCode, metadata);
if (!validation.passed) {
  context.discord.post('seo', {
    title: `❌ ${agentType} output rejected`,
    description: validation.errors.join('\n'),
    color: 15158332 // red
  });
  return { success: false, reason: validation.errors };
}
// Proceed with commit
```

### 11. Agent Dry-Run Diffing

**Location:** `monitoring/agents/lib/diff-validator.mjs`
**Runs:** Inside agent pipeline, after file is written but before git commit

This is distinct from the output validators (component 10). Validators check the generated content in isolation. Dry-run diffing checks the actual diff — what changed in the file on disk — to catch contextual problems.

**Process:**
1. Agent writes the modified file to disk
2. Diff validator runs `git diff` on the modified file
3. Validates the diff programmatically
4. If validation fails, reverts the file and skips commit

**Diff checks:**
```
- No JSX syntax errors in the full file (not just the generated snippet)
- All JSON-LD blocks in the file still parse as valid JSON
- No imports were removed that are still referenced in the file
- No export default was removed or duplicated
- Diff size is reasonable (< 500 lines added for a blog post, < 100 for a fix)
- No accidental whitespace-only changes to unrelated parts of the file
- No merge conflict markers (<<<, ===, >>>)
- File still contains required structural elements (React component, return statement)
- For multi-file changes: all supporting files (App.tsx, Blog.tsx, sitemap.xml) are consistent
```

**Integration point:**
```javascript
// After file write, before commitAndPush:
const diffResult = await validateDiff(filePath, { maxAddedLines: 500 });
if (!diffResult.passed) {
  execSync(`git checkout -- ${filePath}`); // revert
  context.discord.post('seo', {
    title: `❌ Diff validation failed for ${filePath}`,
    description: diffResult.errors.join('\n'),
  });
  return { success: false, reason: diffResult.errors };
}
```

### 12. Scheduled Regression Screenshots

**Location:** `tests/e2e/visual/scheduled-regression.spec.ts`
**Tool:** Playwright
**Runs:** Nightly via GitHub Actions on a cron schedule, independent of agent runs or code changes

**Purpose:** Catch visual drift that isn't caused by code changes — CDN issues, third-party embed changes, expired SSL visual warnings, font loading failures, Google Maps API changes, etc.

**Schedule:** `.github/workflows/nightly-visual-regression.yml` runs at 6:00 AM UTC daily (before the agent nightly run at 7:00 AM).

**Pages tested:** Same baseline set as component 1:
- Homepage, Contact, Quote, Careers, Services/dry-van, Blog, Resources, FAQ, About
- Desktop (1280x720) + Mobile (375x812)

**Diff strategy:**
- Compares against golden snapshots in `tests/e2e/visual/snapshots/`
- Uses 1% threshold (slightly more lenient than CI's 0.5% since external factors cause minor rendering variance)
- On diff detected: uploads diff images as workflow artifacts + posts to Discord `#website-health` with before/after thumbnails

**Distinct from component 1:** Component 1 runs in CI triggered by code changes. Component 12 runs on a schedule regardless of whether any code changed. Together they cover both code-driven and environment-driven visual regressions.

### 13. Rollback Automation

**Location:** `.github/workflows/post-deploy-smoke.yml` (extended)
**Trigger:** Post-deploy smoke test failure

**Auto-revert process:**
1. Smoke tests fail after deploy
2. Workflow identifies the merge commit that triggered the deploy (the staging → main merge)
3. Creates a revert commit: `git revert --no-edit <merge-commit-sha>`
4. Pushes revert to `main`, which triggers a redeploy of the reverted state
5. Sets `smoke-failure` flag in agent state (via SSH to VPS)
6. Posts to Discord `#website-health`:
   - Which smoke checks failed
   - Which merge commit was reverted
   - Link to the CI run with details
   - Instructions: "Agent runs blocked until flag cleared. Investigate and fix on staging."

**Safety guardrails:**
- Only reverts the most recent merge commit (not a chain of reverts)
- If the revert itself fails to deploy cleanly, alerts Discord and stops — no revert-of-revert loops
- Revert commit message: `[auto-revert] Smoke test failure: <failing check names>`
- Max 1 auto-revert per 24 hours — if a second smoke failure happens within 24h, alert only (no auto-revert). This prevents oscillation.
- The reverted changes remain on `staging` for investigation. Nothing is lost.

**Recovery flow:**
1. Human receives Discord alert
2. Investigates failing checks on staging branch
3. Fixes the issue on staging
4. CI re-validates staging
5. Clears `smoke-failure` flag on VPS: `rm monitoring/agents/state/meta/smoke-failure.json`
6. Next staging → main merge proceeds normally

## Test Directory Structure

```
tests/
├── unit/                          # Vitest
│   ├── source-reader.test.ts
│   ├── state.test.ts
│   ├── pages.test.ts
│   ├── orchestrator.test.ts
│   ├── discord.test.ts
│   ├── git-ops.test.ts
│   ├── claude-api.test.ts
│   └── fix-rules.test.ts
├── e2e/                           # Playwright (local dev server)
│   ├── visual/
│   │   ├── visual-regression.spec.ts
│   │   └── snapshots/             # golden screenshots
│   ├── business-facts.spec.ts
│   ├── cta-presence.spec.ts
│   └── accessibility.spec.ts      # axe-core integration
├── smoke/                         # Playwright (live site)
│   └── post-deploy.spec.ts
├── fixtures/
│   ├── business-facts.json
│   ├── sample-blog-post.tsx
│   ├── sample-service-page.tsx
│   └── sample-resource-page.tsx
├── vitest.config.ts
└── playwright.config.ts
```

## New Package Dependencies

```json
{
  "devDependencies": {
    "vitest": "^3.x",
    "@playwright/test": "^1.x",
    "@axe-core/playwright": "^4.x",
    "husky": "^9.x",
    "lint-staged": "^15.x"
  }
}
```

## New npm Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:unit": "vitest run --config tests/vitest.config.ts",
    "test:e2e": "playwright test --config tests/playwright.config.ts",
    "test:e2e:visual": "playwright test tests/e2e/visual/ --config tests/playwright.config.ts",
    "test:smoke": "playwright test tests/smoke/ --config tests/playwright.config.ts",
    "test:smoke:local": "playwright test tests/smoke/ --config tests/playwright.config.ts --grep @local",
    "test:update-snapshots": "playwright test tests/e2e/visual/ --update-snapshots",
    "test:all": "npm run test:unit && npm run test:e2e",
    "prepare": "husky"
  }
}
```

## New GitHub Actions Workflows

### `.github/workflows/staging-ci.yml`
- **Trigger:** Push to `staging`
- **Jobs:** backend-validation (lint, build, unit tests) || frontend-validation (Playwright E2E)
- **On success:** Auto-merge staging → main
- **On failure:** Discord alert, block merge

### `.github/workflows/post-deploy-smoke.yml`
- **Trigger:** After deploy.yml succeeds (workflow_run)
- **Job:** Run smoke suite against live site
- **On failure:** Auto-revert merge commit, redeploy, Discord alert to #website-health

### `.github/workflows/nightly-visual-regression.yml`
- **Trigger:** Cron schedule, 6:00 AM UTC daily
- **Job:** Run Playwright visual regression against live site
- **On diff detected:** Upload diff artifacts, Discord alert to #website-health

## Agent Pipeline Changes

### `monitoring/marketing/lib/git-ops.mjs`
- `commitAndPush` targets `staging` branch instead of `main`
- New function `writeStagingManifest(agentName, changes)` writes manifest JSON

### All action agents
- Import and call relevant validator before commit (component 10)
- Run diff validator after file write, before git commit (component 11)
- On validation failure: revert file, log to Discord, skip commit, continue to next action
- Write staging manifest after successful commit

### `monitoring/agents/orchestrator.mjs`
- Check for post-deploy smoke failure flag before starting action phase
- If smoke tests failed on last deploy, skip actions and alert

## Rollback Strategy

See Component 13 (Rollback Automation) for full details. Summary:

1. Post-deploy smoke tests fail → auto-revert the merge commit on main → redeploy
2. Set `smoke-failure` flag → orchestrator blocks next agent run
3. Discord alert with failing checks + revert details
4. Human fixes on staging → CI re-validates → clears flag → normal flow resumes
5. Safety: max 1 auto-revert per 24h, no revert-of-revert loops

## Migration Plan

This is a net-new test infrastructure. No existing tests to migrate. The rollout order matters:

1. **Phase 1:** Install tooling (Vitest, Playwright, Husky, lint-staged). Set up configs. Write first unit tests for source-reader and state libraries.
2. **Phase 2:** Write agent output validators + diff validator. Integrate into agent pipeline. Agents still push to main but with validation gates.
3. **Phase 3:** Create staging branch flow. Set up staging-ci.yml. Switch agents to push to staging.
4. **Phase 4:** Write E2E tests (visual, CTAs, business facts, accessibility). Add to CI.
5. **Phase 5:** Write post-deploy smoke suite + rollback automation. Set up post-deploy-smoke.yml.
6. **Phase 6:** Set up nightly visual regression workflow (scheduled, independent of code changes).
7. **Phase 7:** Update VPS cron/nightly to work with new staging flow. End-to-end validation.

## Success Criteria

- Zero agent-generated changes reach main without passing lint + tests + build
- Visual regressions from agent changes caught before merge
- Visual drift from external factors caught nightly via scheduled screenshots
- Business-critical facts (phone, email, CTAs) verified on every change
- Post-deploy failures detected within 5 minutes, auto-reverted, and surfaced to Discord
- Agent diffs validated programmatically before commit (no broken JSX, valid JSON-LD)
- Agent output quality measurably improves (fewer retries, fewer reverts)
- Max downtime from bad deploy: time to run smoke tests + revert + redeploy (~10 minutes)
