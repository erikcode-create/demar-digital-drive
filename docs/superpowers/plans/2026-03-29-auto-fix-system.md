# Auto-Fix System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** After scans detect issues, automatically fix safe issues (Tier 1: commit to main) or create PRs for review (Tier 2). Uses Claude Code CLI with ANTHROPIC_API_KEY in GitHub Actions.

**Architecture:** `monitoring/auto-fix.mjs` receives scan results JSON, classifies fixable issues by tier, invokes Claude Code CLI with scoped prompts, verifies build, commits or creates PR, posts Discord notification. Integrates into `website-monitor.yml` as a post-scan step.

**Tech Stack:** Node.js (ESM), Claude Code CLI (`@anthropic-ai/claude-code`), GitHub Actions, `gh` CLI for PRs

---

## File Structure

```
Files to create:
├── monitoring/auto-fix.mjs           # Auto-fix orchestrator
├── monitoring/lib/fix-rules.mjs      # Tier 1/2 classification rules

Files to modify:
├── monitoring/run-scans.mjs          # Output results JSON file for auto-fix consumption
├── .github/workflows/website-monitor.yml  # Add auto-fix step after scan
├── monitoring/package.json           # Add @anthropic-ai/claude-code dependency
```

---

### Task 1: Update run-scans.mjs to output results JSON

**Files:**
- Modify: `monitoring/run-scans.mjs`

- [ ] **Step 1: Add results JSON output**

After the scan loop and before `postResults`, write results to a JSON file and set a GitHub Actions output for whether fixable issues exist.

Add after line `results.push(result)` block (after the for loop, before `postResults`):

```js
// Write results to file for auto-fix consumption
import fs from "node:fs";
const resultsPath = new URL("./scan-results.json", import.meta.url);
fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
console.log(`Results written to ${resultsPath.pathname}`);

// Set GitHub Actions output
const hasFailures = results.some(r => r.status === "fail" || r.status === "warn");
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_fixable_issues=${hasFailures}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `results_path=${resultsPath.pathname}\n`);
}
```

Also add `import fs from "node:fs";` at the top of the file (after existing imports).

- [ ] **Step 2: Add scan-results.json to .gitignore**

Append `monitoring/scan-results.json` to `.gitignore`.

- [ ] **Step 3: Commit**

---

### Task 2: Create fix classification rules

**Files:**
- Create: `monitoring/lib/fix-rules.mjs`

- [ ] **Step 1: Create the rules module**

Create `monitoring/lib/fix-rules.mjs`:

```js
// Tier 1: Auto-commit (safe, reversible)
// Tier 2: Auto-PR (needs human review)
// null: Never auto-fix

const FIX_RULES = [
  {
    tier: 1,
    id: "npm-audit",
    match: (check) => check.name === "npm audit" && check.status !== "pass",
    prompt: `Run \`cd /home/runner/work/demar-digital-drive/demar-digital-drive && npm audit fix\` (do NOT use --force). Then run \`npm run build\` and confirm it succeeds. If the build fails, revert all changes with \`git checkout .\`.`,
    commitMsg: "[auto-fix] Run npm audit fix for dependency vulnerabilities",
  },
  {
    tier: 1,
    id: "copyright-year",
    match: (check) => check.name === "Copyright Year" && check.status === "warn" && check.detail?.includes("current year"),
    prompt: `Find the hardcoded copyright year in the source code and replace it with a dynamic expression using new Date().getFullYear(). Check src/components/Footer.tsx first. Then run \`npm run build\` and confirm it succeeds.`,
    commitMsg: "[auto-fix] Update copyright year to dynamic expression",
  },
  {
    tier: 1,
    id: "meta-description-length",
    match: (check) => check.name === "Meta Description Length" && check.status === "warn",
    prompt: `The meta description in index.html is too long (over 160 characters). Trim it to under 160 characters while keeping it meaningful. Then run \`npm run build\` and confirm it succeeds.`,
    commitMsg: "[auto-fix] Trim meta description to under 160 characters",
  },
  {
    tier: 2,
    id: "schema-required-props",
    match: (check) => check.name?.includes("Required Props") && check.status === "warn",
    prompt: (check) => `The JSON-LD schema in index.html is missing required properties: ${check.detail}. Add the missing properties with appropriate values for DeMar Transportation (freight carrier). Then run \`npm run build\` and confirm it succeeds.`,
    commitMsg: "[auto-fix] Add missing JSON-LD schema properties",
    branchPrefix: "auto-fix/schema-props",
  },
  {
    tier: 2,
    id: "og-tags",
    match: (check) => (check.name === "Placeholder Detection" && check.status === "fail") || (check.name?.includes("OG Image") && check.status === "fail"),
    prompt: (check) => `Social preview tags have issues: ${check.detail}. Fix the OG/Twitter meta tags in index.html. For images, use a proper branded image URL (not lovable-uploads). Then run \`npm run build\` and confirm it succeeds.`,
    commitMsg: "[auto-fix] Update OG/Twitter social preview tags",
    branchPrefix: "auto-fix/social-tags",
  },
  {
    tier: 2,
    id: "broken-internal-links",
    match: (check) => check.name === "Internal Links" && check.status === "fail",
    prompt: (check) => `Broken internal links were found: ${check.detail}. Fix or remove the broken links in the source code. Then run \`npm run build\` and confirm it succeeds.`,
    commitMsg: "[auto-fix] Fix broken internal links",
    branchPrefix: "auto-fix/broken-links",
  },
  {
    tier: 2,
    id: "placeholder-text",
    match: (check) => check.name === "Placeholder Text" && check.status === "fail",
    prompt: (check) => `Placeholder/template text was found in the HTML: ${check.detail}. Find and remove or replace this text in the source code with appropriate DeMar Transportation content. Then run \`npm run build\` and confirm it succeeds.`,
    commitMsg: "[auto-fix] Remove placeholder/template text",
    branchPrefix: "auto-fix/placeholder-text",
  },
];

// Issues that should NEVER be auto-fixed
const NEVER_FIX = [
  "CSP", "HSTS", "X-Frame-Options", "X-Content-Type-Options",
  "Referrer-Policy", "Permissions-Policy",
];

export function classifyIssues(results) {
  const fixable = [];

  for (const result of results) {
    for (const check of result.checks || []) {
      if (check.status === "pass") continue;
      if (NEVER_FIX.some((n) => check.name?.includes(n))) continue;

      for (const rule of FIX_RULES) {
        if (rule.match(check)) {
          const prompt = typeof rule.prompt === "function" ? rule.prompt(check) : rule.prompt;
          fixable.push({
            tier: rule.tier,
            id: rule.id,
            category: result.category,
            check,
            prompt,
            commitMsg: rule.commitMsg,
            branchPrefix: rule.branchPrefix || null,
          });
          break; // One rule per check
        }
      }
    }
  }

  return fixable;
}
```

- [ ] **Step 2: Commit**

---

### Task 3: Create auto-fix orchestrator

**Files:**
- Create: `monitoring/auto-fix.mjs`

- [ ] **Step 1: Create the orchestrator**

Create `monitoring/auto-fix.mjs`:

```js
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { classifyIssues } from "./lib/fix-rules.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const LOCK_FILE = path.join(__dirname, "auto-fix-lock.json");

function log(msg) {
  console.log(`[auto-fix] ${msg}`);
}

function hasRunToday() {
  try {
    const lock = JSON.parse(fs.readFileSync(LOCK_FILE, "utf-8"));
    const lastRun = new Date(lock.lastRun);
    const today = new Date();
    return lastRun.toDateString() === today.toDateString();
  } catch {
    return false;
  }
}

function markRun() {
  fs.writeFileSync(LOCK_FILE, JSON.stringify({ lastRun: new Date().toISOString() }));
}

function exec(cmd, opts = {}) {
  try {
    return execSync(cmd, { cwd: REPO_ROOT, encoding: "utf-8", timeout: 120000, ...opts });
  } catch (err) {
    return err.stdout || err.message;
  }
}

async function postDiscord(webhookUrl, embeds) {
  if (!webhookUrl) return;
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds }),
  });
}

async function invokeClaude(prompt) {
  const fullPrompt = `${prompt}\n\nIMPORTANT: A wrong answer is 3x worse than a blank answer. If you are not confident the fix is correct, do not apply it. Just say "SKIPPED: <reason>" and make no changes.`;

  try {
    const result = execSync(
      `npx -y @anthropic-ai/claude-code --print "${fullPrompt.replace(/"/g, '\\"')}"`,
      { cwd: REPO_ROOT, encoding: "utf-8", timeout: 300000, env: { ...process.env, PATH: process.env.PATH } }
    );
    return { success: true, output: result };
  } catch (err) {
    return { success: false, output: err.stdout || err.message };
  }
}

function hasChanges() {
  const status = exec("git status --porcelain");
  return status.trim().length > 0;
}

function buildSucceeds() {
  try {
    execSync("npm run build", { cwd: REPO_ROOT, encoding: "utf-8", timeout: 120000 });
    return true;
  } catch {
    return false;
  }
}

async function handleTier1(fix, webhookUrl) {
  log(`Tier 1 fix: ${fix.id} — ${fix.check.name}`);

  const result = await invokeClaude(fix.prompt);

  if (result.output.includes("SKIPPED:")) {
    log(`Claude skipped: ${result.output}`);
    return { applied: false, reason: "Claude declined to fix" };
  }

  if (!hasChanges()) {
    log("No changes made.");
    return { applied: false, reason: "No changes detected" };
  }

  if (!buildSucceeds()) {
    log("Build failed after fix. Reverting.");
    exec("git checkout .");
    return { applied: false, reason: "Build failed after fix" };
  }

  exec(`git add -A`);
  exec(`git commit -m "${fix.commitMsg}"`);
  exec(`git push`);
  log("Committed and pushed to main.");

  await postDiscord(webhookUrl, [{
    title: "\u{1F527} Auto-Fix Applied",
    description: `**Category:** ${fix.category}\n**Issue:** ${fix.check.name} — ${fix.check.detail}\n**Fix:** ${fix.commitMsg}\n**Tier:** 1 (auto-committed to main)`,
    color: 3066993,
    timestamp: new Date().toISOString(),
  }]);

  return { applied: true };
}

async function handleTier2(fix, webhookUrl) {
  log(`Tier 2 fix: ${fix.id} — ${fix.check.name}`);

  const branch = `${fix.branchPrefix}-${Date.now()}`;
  exec(`git checkout -b ${branch}`);

  const result = await invokeClaude(fix.prompt);

  if (result.output.includes("SKIPPED:")) {
    log(`Claude skipped: ${result.output}`);
    exec("git checkout main");
    exec(`git branch -D ${branch}`);
    return { applied: false, reason: "Claude declined to fix" };
  }

  if (!hasChanges()) {
    log("No changes made.");
    exec("git checkout main");
    exec(`git branch -D ${branch}`);
    return { applied: false, reason: "No changes detected" };
  }

  if (!buildSucceeds()) {
    log("Build failed after fix. Reverting.");
    exec("git checkout .");
    exec("git checkout main");
    exec(`git branch -D ${branch}`);
    return { applied: false, reason: "Build failed after fix" };
  }

  exec(`git add -A`);
  exec(`git commit -m "${fix.commitMsg}"`);
  exec(`git push -u origin ${branch}`);

  // Create PR
  const prBody = `## Auto-Fix\n\n**Category:** ${fix.category}\n**Issue:** ${fix.check.name}\n**Detail:** ${fix.check.detail}\n\nThis PR was automatically generated by the monitoring auto-fix system.\n\n---\n\u{1F916} Generated by DeMar Transportation Auto-Fix`;
  try {
    exec(`gh pr create --title "${fix.commitMsg}" --body "${prBody.replace(/"/g, '\\"')}" --base main`);
    log(`PR created on branch ${branch}.`);
  } catch (err) {
    log(`PR creation failed: ${err}`);
  }

  exec("git checkout main");

  await postDiscord(webhookUrl, [{
    title: "\u{1F4CB} Auto-Fix PR Created",
    description: `**Category:** ${fix.category}\n**Issue:** ${fix.check.name} — ${fix.check.detail}\n**Fix:** ${fix.commitMsg}\n**Branch:** \`${branch}\`\n**Tier:** 2 (PR created for review)`,
    color: 16776960,
    timestamp: new Date().toISOString(),
  }]);

  return { applied: true, branch };
}

async function main() {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    log("ANTHROPIC_API_KEY not set. Skipping auto-fix.");
    return;
  }

  // Rate limit: max one run per day
  if (hasRunToday()) {
    log("Already ran today. Skipping.");
    return;
  }

  // Load scan results
  const resultsArg = process.argv.find(a => a.startsWith("--results="));
  const resultsPath = resultsArg
    ? resultsArg.split("=")[1]
    : path.join(__dirname, "scan-results.json");

  if (!fs.existsSync(resultsPath)) {
    log(`No results file at ${resultsPath}. Skipping.`);
    return;
  }

  const results = JSON.parse(fs.readFileSync(resultsPath, "utf-8"));
  const fixable = classifyIssues(results);

  if (fixable.length === 0) {
    log("No auto-fixable issues found.");
    return;
  }

  log(`Found ${fixable.length} fixable issue(s): ${fixable.map(f => f.id).join(", ")}`);

  // Process Tier 1 first (on main), then Tier 2 (on branches)
  const tier1 = fixable.filter(f => f.tier === 1);
  const tier2 = fixable.filter(f => f.tier === 2);

  for (const fix of tier1) {
    await handleTier1(fix, webhookUrl);
  }

  for (const fix of tier2) {
    await handleTier2(fix, webhookUrl);
  }

  markRun();
  log("Auto-fix run complete.");
}

main().catch((err) => {
  console.error("[auto-fix] Fatal:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Add lock file to .gitignore**

Append `monitoring/auto-fix-lock.json` to `.gitignore`.

- [ ] **Step 3: Test dry classification locally**

Run: `cd monitoring && node -e "
import { classifyIssues } from './lib/fix-rules.mjs';
import fs from 'node:fs';
// Use results from last scan
const results = JSON.parse(fs.readFileSync('scan-results.json', 'utf-8'));
const fixable = classifyIssues(results);
fixable.forEach(f => console.log('Tier', f.tier, '-', f.id, ':', f.check.name, '-', f.check.detail?.slice(0, 80)));
if (fixable.length === 0) console.log('No fixable issues found');
"`

Expected: Lists fixable issues from last scan (placeholder text, OG tags).

- [ ] **Step 4: Commit**

---

### Task 4: Update GitHub Actions workflow

**Files:**
- Modify: `.github/workflows/website-monitor.yml`

- [ ] **Step 1: Add auto-fix step and results output**

Update the workflow to:
1. Add `id: scan` to the scan step
2. Add auto-fix step after scan
3. Add cache for auto-fix lock file

The scan step needs to output results. Add this updated workflow:

Replace the `Run scans` step with:
```yaml
      - name: Run scans
        id: scan
        env:
          DISCORD_WEBHOOK_URL: ${{ secrets.DISCORD_WEBHOOK_URL }}
        run: cd monitoring && node run-scans.mjs --type ${{ steps.scan-type.outputs.type }}
```

Add these steps after:
```yaml
      - name: Restore auto-fix lock
        uses: actions/cache/restore@v4
        with:
          path: monitoring/auto-fix-lock.json
          key: auto-fix-lock

      - name: Auto-fix detected issues
        if: steps.scan.outputs.has_fixable_issues == 'true'
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          DISCORD_WEBHOOK_URL: ${{ secrets.DISCORD_WEBHOOK_URL }}
          GH_TOKEN: ${{ github.token }}
        run: cd monitoring && node auto-fix.mjs

      - name: Save auto-fix lock
        if: always()
        uses: actions/cache/save@v4
        with:
          path: monitoring/auto-fix-lock.json
          key: auto-fix-lock-${{ github.run_id }}
```

Also increase `timeout-minutes` to 15 (auto-fix with Claude may take longer).

- [ ] **Step 2: Verify YAML syntax**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/website-monitor.yml')); print('Valid')"`

- [ ] **Step 3: Commit**

---

### Task 5: Add npm scripts and dependencies

**Files:**
- Modify: `monitoring/package.json`

- [ ] **Step 1: Add auto-fix npm script**

Add to scripts: `"auto-fix": "node auto-fix.mjs"`

Note: `@anthropic-ai/claude-code` is invoked via `npx -y` so it doesn't need to be a dependency. It's installed on-demand in CI.

- [ ] **Step 2: Commit**

---

### Task 6: End-to-end verification

**Files:** None (verification only)

- [ ] **Step 1: Generate scan results for classification test**

Run a scan to produce `scan-results.json`:
```bash
cd monitoring && node run-scans.mjs --type full 2>&1
```

- [ ] **Step 2: Test issue classification**

```bash
cd monitoring && node -e "
import { classifyIssues } from './lib/fix-rules.mjs';
import fs from 'node:fs';
const results = JSON.parse(fs.readFileSync('scan-results.json', 'utf-8'));
const fixable = classifyIssues(results);
console.log(JSON.stringify(fixable.map(f => ({ tier: f.tier, id: f.id, name: f.check.name })), null, 2));
"
```

- [ ] **Step 3: Verify auto-fix script loads without errors**

```bash
cd monitoring && node -e "import('./auto-fix.mjs')" 2>&1
```
(Will exit quickly since ANTHROPIC_API_KEY is not set locally)

- [ ] **Step 4: Verify build passes**

```bash
npm run build
```

- [ ] **Step 5: Commit any fixes**
