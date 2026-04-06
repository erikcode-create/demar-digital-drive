# Nightly SEO Automation System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive nightly automation system that autonomously finds SEO issues, generates content, fixes errors, and continuously improves demartransportation.com — running on the Hostinger VPS via cron.

**Architecture:** Fix the broken source-reader foundation first, then expand the agent system with new capabilities: schema generator, empty-page filler, homepage optimizer, and a nightly master job that chains everything. All agents share state via JSON files, use Claude API for content generation, and post results to Discord.

**Tech Stack:** Node.js 22, ESM modules, Claude API (haiku for fast tasks, sonnet for content), Serper API, Google Search Console API, Discord webhooks, cron on Ubuntu 24.04 VPS.

---

## Critical Fixes (Must Do First)

### Task 1: Fix source-reader text extraction for BlogPost component pages

The source-reader extracts 1-2 words from blog/resource pages that actually have 200-400 lines of content. The `extractText()` function fails because content is inside `<BlogPost content={<>...</>}>` JSX prop pattern. This breaks the site auditor scores (60/100 is wrong), E-E-A-T scoring, and content gap analysis.

**Files:**
- Modify: `monitoring/agents/lib/source-reader.mjs:62-93`
- Test: manual verification via VPS

- [ ] **Step 1: Fix extractText() to handle BlogPost content prop**

The current regex strips JSX tags but doesn't enter the `content={<>...</>}` prop. Replace the function:

```javascript
function extractText(source) {
  // For BlogPost component pages, extract content from the content prop
  const blogPostContentMatch = source.match(/content=\{[\s]*<>([\s\S]*?)<\/>[\s]*\}/);
  let text = blogPostContentMatch ? blogPostContentMatch[1] : source;

  // For ResourceArticle component pages, same pattern
  const resourceContentMatch = source.match(/content=\{[\s]*<>([\s\S]*?)<\/>[\s]*\}/);
  if (!blogPostContentMatch && resourceContentMatch) {
    text = resourceContentMatch[1];
  }

  // Remove imports and type definitions
  text = text.replace(/^import\s+.*$/gm, "");
  text = text.replace(/^export\s+(interface|type)\s+[\s\S]*?^}/gm, "");

  // Remove JSX comments
  text = text.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

  // Remove className, style, and other JSX attributes
  text = text.replace(/className="[^"]*"/g, "");
  text = text.replace(/style=\{[^}]*\}/g, "");

  // Remove JSON-LD script blocks
  text = text.replace(/<script[\s\S]*?<\/script>/g, "");

  // Remove JSX tags but keep content
  text = text.replace(/<[^>]+>/g, " ");

  // Remove JSX expressions that aren't text
  text = text.replace(/\{[^}]*\.\.\.[^}]*\}/g, "");
  text = text.replace(/\{\/\*.*?\*\/\}/g, "");

  // Clean up whitespace
  text = text.replace(/\s+/g, " ").trim();

  // Remove code artifacts
  text = text.replace(/const\s+\w+\s*=.*?;/g, "");
  text = text.replace(/return\s*\(/g, "");
  text = text.replace(/export\s+default\s+\w+;?/g, "");

  return text;
}
```

- [ ] **Step 2: Fix extractHeadings() to read BlogPost title prop as H1**

Blog posts don't have `<h1>` in source — the BlogPost component renders the `title` prop as H1. Add fallback:

```javascript
function extractHeadings(source) {
  const headings = { h1: [], h2: [], h3: [] };

  for (const level of ["h1", "h2", "h3"]) {
    const regex = new RegExp(`<${level}[^>]*>([\\s\\S]*?)</${level}>`, "gi");
    let match;
    while ((match = regex.exec(source)) !== null) {
      const text = match[1].replace(/<[^>]+>/g, "").replace(/\{[^}]*\}/g, "").replace(/\s+/g, " ").trim();
      if (text) headings[level].push(text);
    }
  }

  // Fallback: BlogPost/ResourceArticle title prop counts as H1
  if (headings.h1.length === 0) {
    const titleProp = source.match(/title=["']([^"']+)["']/);
    if (titleProp) headings.h1.push(titleProp[1]);
  }

  return headings;
}
```

- [ ] **Step 3: Fix extractMetaTitle() to read metaTitle prop from BlogPost**

The current regex looks for `metaTitle:` (colon) but BlogPost uses `metaTitle=` (equals). Add the pattern:

```javascript
function extractMetaTitle(source) {
  // Pattern: metaTitle="..." (JSX prop)
  const metaTitleProp = source.match(/metaTitle=["'`]([^"'`]+)["'`]/);
  if (metaTitleProp) return metaTitleProp[1];

  // Pattern: document.title = "..."
  const titleMatch = source.match(/document\.title\s*=\s*["'`]([^"'`]+)["'`]/);
  if (titleMatch) return titleMatch[1];

  // Pattern: metaTitle: "..."
  const metaMatch = source.match(/metaTitle:\s*["'`]([^"'`]+)["'`]/);
  if (metaMatch) return metaMatch[1];

  // Pattern: title prop
  const propMatch = source.match(/title=["'`]([^"'`]+)["'`]/);
  if (propMatch) return propMatch[1];

  return null;
}
```

- [ ] **Step 4: Fix extractMetaDescription() similarly**

```javascript
function extractMetaDescription(source) {
  // Pattern: metaDescription="..." (JSX prop)
  const metaDescProp = source.match(/metaDescription=["'`]([^"'`]+)["'`]/);
  if (metaDescProp) return metaDescProp[1];

  // Pattern: description="..." (JSX prop)
  const descProp = source.match(/\bdescription=["'`]([^"'`]+)["'`]/);
  if (descProp) return descProp[1];

  // Pattern: meta.setAttribute("content", "...")
  const setAttrMatch = source.match(/setAttribute\(\s*["']content["']\s*,\s*["'`]([^"'`]+)["'`]\)/);
  if (setAttrMatch) return setAttrMatch[1];

  // Pattern: metaDescription: "..."
  const metaMatch = source.match(/metaDescription:\s*["'`]([^"'`]+)["'`]/);
  if (metaMatch) return metaMatch[1];

  return null;
}
```

- [ ] **Step 5: Verify on VPS**

```bash
ssh root@76.13.24.125 'cd /opt/demar-website && git pull && cd monitoring && node -e "
import { readPage } from \"./agents/lib/source-reader.mjs\";
const page = readPage(\"/blog/small-business-freight-shipping\");
console.log(\"Word count:\", page.wordCount);
console.log(\"H1:\", page.headings.h1);
console.log(\"Title:\", page.metaTitle);
console.log(\"Desc:\", page.metaDescription?.substring(0, 50));
"'
```

Expected: Word count ~2500+, H1 has the title, metaTitle populated.

- [ ] **Step 6: Commit**

```bash
git add monitoring/agents/lib/source-reader.mjs
git commit -m "fix: source-reader now extracts content from BlogPost/ResourceArticle component props"
```

---

### Task 2: Update pages.mjs to include all existing blog posts

The pages registry only lists 5 blog posts but there are 13. Missing posts are invisible to all agents.

**Files:**
- Modify: `monitoring/seo/lib/pages.mjs:47-53`

- [ ] **Step 1: Add missing blog posts to PAGES array**

Add after the existing blog entries:

```javascript
  // Blog (continued - generated posts)
  { path: "/blog/dedicated-fleet-vs-spot-market", name: "Dedicated Fleet vs Spot Market", type: "blog" },
  { path: "/blog/food-beverage-freight-shipping", name: "Food & Beverage Freight Shipping", type: "blog" },
  { path: "/blog/freight-shipping-insurance-coverage", name: "Freight Shipping Insurance Coverage", type: "blog" },
  { path: "/blog/last-mile-delivery-freight-shipping", name: "Last Mile Delivery Freight Shipping", type: "blog" },
  { path: "/blog/partial-truckload-ptl-shipping", name: "Partial Truckload (PTL) Shipping", type: "blog" },
  { path: "/blog/real-time-freight-tracking", name: "Real-Time Freight Tracking", type: "blog" },
  { path: "/blog/reverse-logistics-return-freight", name: "Reverse Logistics & Return Freight", type: "blog" },
  { path: "/blog/white-glove-freight-handling", name: "White Glove Freight Handling", type: "blog" },
```

- [ ] **Step 2: Make pages.mjs auto-discover blog posts**

Replace the hardcoded blog section with auto-discovery so new posts are automatically included:

```javascript
import { readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = import.meta.dirname || new URL(".", import.meta.url).pathname;
const REPO_ROOT = join(__dirname, "../../..");

function discoverBlogPosts() {
  const blogDir = join(REPO_ROOT, "src/pages/blog");
  try {
    return readdirSync(blogDir)
      .filter(f => f.endsWith(".tsx") && f !== "index.tsx")
      .map(f => {
        const name = f.replace(".tsx", "");
        // Convert PascalCase to kebab-case: SmallBusinessFreight -> small-business-freight
        const slug = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
        // Convert kebab to readable: small-business-freight -> Small Business Freight
        const readable = slug.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
        return { path: `/blog/${slug}`, name: readable, type: "blog" };
      });
  } catch { return []; }
}

function discoverResourcePages() {
  const resDir = join(REPO_ROOT, "src/pages/resources");
  try {
    return readdirSync(resDir)
      .filter(f => f.endsWith(".tsx") && f !== "index.tsx")
      .map(f => {
        const name = f.replace(".tsx", "");
        const slug = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
        const readable = slug.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
        return { path: `/resources/${slug}`, name: readable, type: "resource" };
      });
  } catch { return []; }
}
```

Then replace the hardcoded blog/resource entries in PAGES with:

```javascript
  ...discoverBlogPosts(),
  ...discoverResourcePages(),
```

- [ ] **Step 3: Verify discovery works**

```bash
cd monitoring && node -e "import { getAllPages } from './seo/lib/pages.mjs'; console.log(getAllPages().length, 'pages'); getAllPages().filter(p=>p.type==='blog').forEach(p=>console.log(p.path));"
```

Expected: 13 blog posts listed, 15 resource pages listed.

- [ ] **Step 4: Commit**

```bash
git add monitoring/seo/lib/pages.mjs
git commit -m "feat: auto-discover blog and resource pages instead of hardcoded list"
```

---

## New Agents

### Task 3: Schema generator agent

Adds JSON-LD structured data to pages missing it. The audit found 25 pages without schema.

**Files:**
- Create: `monitoring/agents/action/schema-generator.mjs`
- Modify: `monitoring/agents/orchestrator.mjs` (register agent)

- [ ] **Step 1: Create schema-generator.mjs**

```javascript
import "dotenv/config";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { generateWithClaude } from "../../marketing/lib/claude-api.mjs";
import { commitAndPush, buildSucceeds } from "../../marketing/lib/git-ops.mjs";

const __dirname = import.meta.dirname || new URL(".", import.meta.url).pathname;
const REPO_ROOT = join(__dirname, "../../..");

export const name = "schema-generator";
export const category = "action";
export const description = "Add JSON-LD schema markup to pages missing structured data";

export async function run(context) {
  const action = context.config.currentAction;
  if (!action || action.type !== "fix-schema") {
    return { success: false, summary: "No fix-schema action provided" };
  }

  const { targetPage, details } = action;
  if (!targetPage) {
    return { success: false, summary: "No targetPage specified" };
  }

  // Read the page source
  const pageData = context.source.readPage(targetPage);
  if (!pageData) {
    return { success: false, summary: `Could not read page: ${targetPage}` };
  }

  const fullPath = join(REPO_ROOT, pageData.sourceFile);
  const original = readFileSync(fullPath, "utf-8");

  // Check if page already has JSON-LD
  if (original.includes("application/ld+json")) {
    return { success: true, summary: `${targetPage} already has JSON-LD schema` };
  }

  // Determine schema type based on page type
  let schemaType = "WebPage";
  if (targetPage.startsWith("/blog/")) schemaType = "BlogPosting";
  else if (targetPage.startsWith("/services/")) schemaType = "Service";
  else if (targetPage.startsWith("/resources/")) schemaType = "Article";
  else if (targetPage === "/faq") schemaType = "FAQPage";
  else if (targetPage === "/about") schemaType = "AboutPage";
  else if (targetPage === "/contact") schemaType = "ContactPage";

  const prompt = `You are an SEO expert. Add JSON-LD structured data to this React/TypeScript page.

Page: ${targetPage}
Schema type needed: ${schemaType}
Current title: ${pageData.metaTitle || "unknown"}
Current description: ${pageData.metaDescription || "unknown"}
Word count: ${pageData.wordCount}
${details ? `Additional context: ${details}` : ""}

Rules:
- Add a useEffect hook that creates a <script type="application/ld+json"> element
- Use schema.org vocabulary
- For BlogPosting: include headline, description, datePublished, author (DeMar Transportation), publisher
- For Service: include name, description, provider (DeMar Transportation), areaServed (United States)
- For Article: include headline, description, author, publisher
- For FAQPage: include mainEntity with Question/Answer pairs from the page content
- Keep it valid JSON-LD
- Return ONLY the complete modified file content, no explanation

Current file:
${original.substring(0, 8000)}`;

  try {
    const result = await generateWithClaude(prompt, { model: "haiku", timeout: 60000 });

    // Extract code from response
    let newCode = result;
    const codeMatch = result.match(/```(?:tsx?|jsx?)?\n([\s\S]*?)```/);
    if (codeMatch) newCode = codeMatch[1];

    writeFileSync(fullPath, newCode);

    if (!buildSucceeds()) {
      writeFileSync(fullPath, original);
      return { success: false, summary: `Schema addition broke build for ${targetPage}, reverted` };
    }

    await commitAndPush(`[seo-bot] Add ${schemaType} JSON-LD schema to ${targetPage}`);

    await context.discord.post("seo", {
      embeds: [{
        title: "🏷️ Schema Added",
        description: `**Page:** ${targetPage}\n**Type:** ${schemaType}\n**Status:** Build verified ✓`,
        color: 3066993,
        timestamp: new Date().toISOString(),
      }],
    });

    return {
      success: true,
      summary: `Added ${schemaType} schema to ${targetPage}`,
      data: { page: targetPage, schemaType },
    };
  } catch (err) {
    writeFileSync(fullPath, original);
    return { success: false, summary: `Schema generation failed for ${targetPage}: ${err.message}` };
  }
}
```

- [ ] **Step 2: Register in orchestrator.mjs**

Add to AGENTS object:

```javascript
  "schema-generator":    { category: "action", path: "./action/schema-generator.mjs" },
```

Add to routeAction():

```javascript
    "fix-schema": "schema-generator",
```

- [ ] **Step 3: Commit**

```bash
git add monitoring/agents/action/schema-generator.mjs monitoring/agents/orchestrator.mjs
git commit -m "feat: add schema-generator agent for JSON-LD structured data"
```

---

### Task 4: Homepage optimizer agent

The homepage scores 2/7: missing H1, no internal links, only 36 words, no schema. This needs a dedicated fix.

**Files:**
- Create: `monitoring/agents/action/homepage-optimizer.mjs`
- Modify: `monitoring/agents/orchestrator.mjs` (register agent)

- [ ] **Step 1: Create homepage-optimizer.mjs**

```javascript
import "dotenv/config";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { generateWithClaude } from "../../marketing/lib/claude-api.mjs";
import { commitAndPush, buildSucceeds } from "../../marketing/lib/git-ops.mjs";

const __dirname = import.meta.dirname || new URL(".", import.meta.url).pathname;
const REPO_ROOT = join(__dirname, "../../..");

export const name = "homepage-optimizer";
export const category = "action";
export const description = "Optimize homepage for SEO: H1, internal links, schema, content";

export async function run(context) {
  const action = context.config.currentAction;
  if (!action || action.type !== "fix-homepage") {
    return { success: false, summary: "No fix-homepage action provided" };
  }

  const pageData = context.source.readPage("/");
  if (!pageData) {
    return { success: false, summary: "Could not read homepage source" };
  }

  const fullPath = join(REPO_ROOT, pageData.sourceFile);
  const original = readFileSync(fullPath, "utf-8");

  // Get all service pages for internal linking
  const services = context.source.readAllPages().filter(p => p.type === "service");
  const serviceList = services.map(s => `${s.name}: ${s.path}`).join("\n");

  const issues = [];
  if (pageData.headings.h1.length === 0) issues.push("Missing H1 tag");
  if (pageData.internalLinks.length === 0) issues.push("No internal links");
  if (pageData.wordCount < 100) issues.push(`Only ${pageData.wordCount} words`);
  if (!original.includes("application/ld+json")) issues.push("Missing JSON-LD schema");

  const prompt = `You are an SEO expert optimizing the homepage of DeMar Transportation (demartransportation.com), a freight and logistics company based in Reno, Nevada.

Current issues:
${issues.map(i => "- " + i).join("\n")}

Service pages to link to:
${serviceList}

Requirements:
1. Add an H1 tag with the primary keyword "Freight Shipping & Logistics Services"
2. Add internal links to all service pages using descriptive anchor text
3. Add LocalBusiness + WebSite JSON-LD schema in a useEffect
4. Keep all existing content and components — only ADD, don't remove
5. The homepage uses React with shadcn/ui and Tailwind CSS
6. Import Link from "react-router-dom" if not already imported
7. Return ONLY the complete modified file, no explanation

Current file:
${original}`;

  try {
    const result = await generateWithClaude(prompt, { model: "sonnet", timeout: 120000 });

    let newCode = result;
    const codeMatch = result.match(/```(?:tsx?|jsx?)?\n([\s\S]*?)```/);
    if (codeMatch) newCode = codeMatch[1];

    writeFileSync(fullPath, newCode);

    if (!buildSucceeds()) {
      writeFileSync(fullPath, original);
      return { success: false, summary: "Homepage optimization broke build, reverted" };
    }

    await commitAndPush("[seo-bot] Optimize homepage: add H1, internal links, JSON-LD schema");

    await context.discord.post("seo", {
      embeds: [{
        title: "🏠 Homepage Optimized",
        description: `**Issues fixed:** ${issues.join(", ")}\n**Build:** Verified ✓`,
        color: 3066993,
        timestamp: new Date().toISOString(),
      }],
    });

    return {
      success: true,
      summary: `Homepage optimized: fixed ${issues.length} issues`,
      data: { issues },
    };
  } catch (err) {
    writeFileSync(fullPath, original);
    return { success: false, summary: `Homepage optimization failed: ${err.message}` };
  }
}
```

- [ ] **Step 2: Register in orchestrator.mjs**

Add to AGENTS:
```javascript
  "homepage-optimizer":  { category: "action", path: "./action/homepage-optimizer.mjs" },
```

Add to routeAction():
```javascript
    "fix-homepage": "homepage-optimizer",
```

- [ ] **Step 3: Commit**

```bash
git add monitoring/agents/action/homepage-optimizer.mjs monitoring/agents/orchestrator.mjs
git commit -m "feat: add homepage-optimizer agent for H1, internal links, schema"
```

---

### Task 5: Update strategy agent to generate schema and homepage actions

The strategy agent needs to know about the new action types so it queues them.

**Files:**
- Modify: `monitoring/agents/strategy/strategy-agent.mjs`

- [ ] **Step 1: Update the strategy prompt**

In the Claude prompt within strategy-agent.mjs, add to the action types section:

```
Action types you can create:
- "write-content": Write a new blog post targeting a keyword
- "update-content": Improve existing page content
- "fix-meta": Fix title tag or meta description
- "fix-links": Add internal links to a page
- "fix-technical": Fix technical SEO issues (alt text, broken links, accessibility)
- "fix-schema": Add JSON-LD structured data to a page (NEW)
- "fix-homepage": Optimize homepage SEO elements (NEW)
```

- [ ] **Step 2: Commit**

```bash
git add monitoring/agents/strategy/strategy-agent.mjs
git commit -m "feat: strategy agent now generates fix-schema and fix-homepage actions"
```

---

### Task 6: Nightly master job with git pull, full cycle, and error recovery

Create a robust nightly runner that pulls latest code, runs the full agent cycle, handles errors gracefully, and reports everything to Discord.

**Files:**
- Create: `monitoring/nightly.mjs`
- Modify: VPS crontab

- [ ] **Step 1: Create nightly.mjs**

```javascript
#!/usr/bin/env node
import "dotenv/config";
import { execSync } from "child_process";
import { join } from "path";
import { postToChannel } from "./lib/discord.mjs";

const __dirname = import.meta.dirname || new URL(".", import.meta.url).pathname;
const REPO_ROOT = join(__dirname, "..");

async function notify(channel, title, description, color = 3066993) {
  try {
    await postToChannel(channel, {
      embeds: [{ title, description, color, timestamp: new Date().toISOString() }],
    });
  } catch (err) {
    console.error("Discord notification failed:", err.message);
  }
}

function gitPull() {
  console.log("Pulling latest changes...");
  try {
    const result = execSync("git pull --rebase origin main", {
      cwd: REPO_ROOT,
      encoding: "utf-8",
      timeout: 30000,
    });
    console.log(result);
    return true;
  } catch (err) {
    console.error("Git pull failed:", err.message);
    // Try to recover
    try {
      execSync("git rebase --abort", { cwd: REPO_ROOT, timeout: 5000 });
      execSync("git reset --hard origin/main", { cwd: REPO_ROOT, timeout: 5000 });
      console.log("Recovered: reset to origin/main");
    } catch { /* ignore */ }
    return false;
  }
}

function npmInstall() {
  console.log("Checking dependencies...");
  try {
    execSync("npm install --production", {
      cwd: join(REPO_ROOT, "monitoring"),
      encoding: "utf-8",
      timeout: 60000,
    });
    return true;
  } catch (err) {
    console.error("npm install failed:", err.message);
    return false;
  }
}

function runPhase(phase, extraArgs = "") {
  console.log(`\n=== Running phase: ${phase} ===`);
  try {
    const result = execSync(
      `node agents/orchestrator.mjs --phase ${phase} ${extraArgs}`,
      {
        cwd: join(REPO_ROOT, "monitoring"),
        encoding: "utf-8",
        timeout: 600000, // 10 minutes per phase
        stdio: "pipe",
      }
    );
    console.log(result);
    return { success: true, output: result };
  } catch (err) {
    console.error(`Phase ${phase} failed:`, err.message);
    return { success: false, output: err.stderr || err.message };
  }
}

async function main() {
  const startTime = Date.now();
  const results = { phases: {}, errors: [] };

  console.log(`\n${"=".repeat(60)}`);
  console.log(`NIGHTLY SEO RUN — ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}`);
  console.log(`${"=".repeat(60)}\n`);

  await notify("health", "�� Nightly SEO Run Starting", "Pulling latest code and running full agent cycle...");

  // Step 1: Git pull
  if (!gitPull()) {
    await notify("health", "❌ Nightly Run Failed", "Git pull failed. Check VPS logs.", 15158332);
    process.exit(1);
  }

  // Step 2: npm install (in case deps changed)
  npmInstall();

  // Step 3: Intelligence phase
  results.phases.intelligence = runPhase("intelligence");

  // Step 4: Analysis phase
  results.phases.analysis = runPhase("analysis");

  // Step 5: Strategy phase
  results.phases.strategy = runPhase("strategy");

  // Step 6: Action phase (the one that makes changes)
  results.phases.action = runPhase("action", "--limit 5");

  // Step 7: Git pull again to get any changes pushed by action agents
  gitPull();

  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  const phaseResults = Object.entries(results.phases)
    .map(([name, r]) => `${r.success ? "✅" : "❌"} ${name}`)
    .join("\n");

  await notify("health", "🌙 Nightly SEO Run Complete", [
    `**Duration:** ${elapsed} minutes`,
    `**Phases:**`,
    phaseResults,
  ].join("\n"));

  console.log(`\nNightly run complete in ${elapsed} minutes.`);
}

main().catch(async (err) => {
  console.error("Nightly run crashed:", err);
  await notify("health", "💥 Nightly Run Crashed", err.message, 15158332);
  process.exit(1);
});
```

- [ ] **Step 2: Add npm script to package.json**

In `monitoring/package.json` scripts section:

```json
"nightly": "node nightly.mjs"
```

- [ ] **Step 3: Update VPS crontab**

Replace the individual phase crons with a single nightly job:

```bash
ssh root@76.13.24.125 '(crontab -l | grep -v "demar-website" | grep -v "DeMar Transportation"; cat << "CRON"

# DeMar Transportation SEO - Nightly full cycle at 3am EST (07:00 UTC)
0 7 * * * cd /opt/demar-website/monitoring && /usr/bin/node nightly.mjs >> /var/log/demar-agents.log 2>&1

# DeMar Transportation SEO - Weekly deep run Sunday 2am EST (06:00 UTC)
0 6 * * 0 cd /opt/demar-website/monitoring && /usr/bin/node agents/orchestrator.mjs --full-cycle >> /var/log/demar-agents.log 2>&1
CRON
) | crontab -'
```

- [ ] **Step 4: Add log rotation**

```bash
ssh root@76.13.24.125 'cat > /etc/logrotate.d/demar-agents << "EOF"
/var/log/demar-agents.log {
    weekly
    rotate 4
    compress
    missingok
    notifempty
}
EOF'
```

- [ ] **Step 5: Commit**

```bash
git add monitoring/nightly.mjs monitoring/package.json
git commit -m "feat: add nightly master job with git pull, full cycle, error recovery, Discord reporting"
```

---

### Task 7: Update run-agents.sh to use nightly.mjs

**Files:**
- Modify: `monitoring/run-agents.sh` (on VPS)

- [ ] **Step 1: Simplify run-agents.sh**

```bash
ssh root@76.13.24.125 'cat > /opt/demar-website/monitoring/run-agents.sh << "SCRIPT"
#!/bin/bash
cd /opt/demar-website/monitoring
/usr/bin/node nightly.mjs "$@" 2>&1 | tee -a /var/log/demar-agents.log
echo "--- Run completed at $(date) ---" >> /var/log/demar-agents.log
SCRIPT
chmod +x /opt/demar-website/monitoring/run-agents.sh'
```

---

### Task 8: Push all changes to VPS and run first nightly

- [ ] **Step 1: Push all commits to GitHub**

```bash
git push origin main
```

- [ ] **Step 2: Pull on VPS**

```bash
ssh root@76.13.24.125 'cd /opt/demar-website && git pull'
```

- [ ] **Step 3: Install deps on VPS**

```bash
ssh root@76.13.24.125 'cd /opt/demar-website/monitoring && npm install'
```

- [ ] **Step 4: Test nightly run**

```bash
ssh root@76.13.24.125 'cd /opt/demar-website/monitoring && node nightly.mjs'
```

Watch Discord channels for notifications.

- [ ] **Step 5: Verify crontab**

```bash
ssh root@76.13.24.125 'crontab -l'
```

Expected: single nightly job at 3am EST + weekly deep run Sunday 2am.

---

## Summary

| Task | What | Impact |
|------|------|--------|
| 1 | Fix source-reader text extraction | Unlocks accurate auditing of ALL pages |
| 2 | Auto-discover blog/resource pages | New posts automatically enter the system |
| 3 | Schema generator agent | Fixes 25 pages missing JSON-LD |
| 4 | Homepage optimizer agent | Fixes worst-scoring page on the site |
| 5 | Strategy agent update | Routes new action types correctly |
| 6 | Nightly master job | Single robust job replaces 4 separate crons |
| 7 | Update VPS runner | Clean up VPS scripts |
| 8 | Deploy and test | Verify everything works end-to-end |

After this, the system will run every night at 3am EST:
1. Pull latest code
2. Track rankings, search console data, competitors, backlinks, CWV
3. Audit every page, score E-E-A-T, find content gaps
4. Strategize and prioritize top 5 actions
5. Execute: generate blog posts, fix meta tags, add schema, optimize links
6. Report everything to Discord

The weekly Sunday run does a deeper full cycle with all closed loops (rank recovery, content gaps, E-E-A-T improvement).
