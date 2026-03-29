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
          break;
        }
      }
    }
  }

  return fixable;
}
