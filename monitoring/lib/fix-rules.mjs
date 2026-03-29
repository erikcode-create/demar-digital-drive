// Tier 1: Auto-commit (safe, reversible)
// Tier 2: Auto-PR (needs human review)
// null: Never auto-fix
//
// Model tiers:
//   haiku  — mechanical fixes, pattern-based (cheapest, fastest)
//   sonnet — content-aware fixes, needs some understanding
//   opus   — deep content generation, nuanced rewrites

const FIX_RULES = [
  // --- Tier 1: Auto-commit (safe fixes) ---
  {
    tier: 1,
    id: "npm-audit",
    model: "haiku",
    match: (check) => check.name === "npm audit" && check.status !== "pass",
    prompt: `Run \`cd /home/runner/work/demar-digital-drive/demar-digital-drive && npm audit fix\` (do NOT use --force). Then run \`npm run build\` and confirm it succeeds. If the build fails, revert all changes with \`git checkout .\`.`,
    commitMsg: "[auto-fix] Run npm audit fix for dependency vulnerabilities",
  },
  {
    tier: 1,
    id: "copyright-year",
    model: "haiku",
    match: (check) => check.name === "Copyright Year" && check.status === "warn" && check.detail?.includes("current year"),
    prompt: `Find the hardcoded copyright year in the source code and replace it with a dynamic expression using new Date().getFullYear(). Check src/components/Footer.tsx first. Then run \`npm run build\` and confirm it succeeds.`,
    commitMsg: "[auto-fix] Update copyright year to dynamic expression",
  },
  {
    tier: 1,
    id: "meta-description-length",
    model: "haiku",
    match: (check) => check.name === "Meta Description Length" && check.status === "warn",
    prompt: `The meta description in index.html is too long (over 160 characters). Trim it to under 160 characters while keeping it meaningful for a freight transportation company. Then run \`npm run build\` and confirm it succeeds.`,
    commitMsg: "[auto-fix] Trim meta description to under 160 characters",
  },
  {
    tier: 1,
    id: "missing-alt-text",
    model: "haiku",
    match: (check) => check.name?.includes("Alt Text") && check.status !== "pass",
    prompt: (check) => `Images are missing alt text: ${check.detail}. Add descriptive alt attributes to all <img> tags missing them. Use short, relevant descriptions for a freight transportation company website. Then run \`npm run build\` and confirm it succeeds.`,
    commitMsg: "[auto-fix] Add missing image alt text",
  },

  // --- Tier 2: Auto-PR (needs human review) ---
  {
    tier: 2,
    id: "schema-required-props",
    model: "haiku",
    match: (check) => check.name?.includes("Required Props") && check.status === "warn",
    prompt: (check) => `The JSON-LD schema in index.html is missing required properties: ${check.detail}. Add the missing properties with appropriate values for DeMar Transportation (freight carrier, 10471 Double R Blvd, Reno, NV 89521, (775) 230-4767). Then run \`npm run build\` and confirm it succeeds.`,
    commitMsg: "[auto-fix] Add missing JSON-LD schema properties",
    branchPrefix: "auto-fix/schema-props",
  },
  {
    tier: 2,
    id: "og-tags",
    model: "haiku",
    match: (check) => (check.name === "Placeholder Detection" && check.status === "fail") || (check.name?.includes("OG Image") && check.status === "fail"),
    prompt: (check) => `Social preview tags have issues: ${check.detail}. Fix the OG/Twitter meta tags in index.html. For images, use /demar-logo-official.png as the branded image. Then run \`npm run build\` and confirm it succeeds.`,
    commitMsg: "[auto-fix] Update OG/Twitter social preview tags",
    branchPrefix: "auto-fix/social-tags",
  },
  {
    tier: 2,
    id: "broken-internal-links",
    model: "haiku",
    match: (check) => check.name === "Internal Links" && check.status === "fail",
    prompt: (check) => `Broken internal links were found: ${check.detail}. Fix or remove the broken links in the source code. Then run \`npm run build\` and confirm it succeeds.`,
    commitMsg: "[auto-fix] Fix broken internal links",
    branchPrefix: "auto-fix/broken-links",
  },
  {
    tier: 2,
    id: "placeholder-text",
    model: "haiku",
    match: (check) => check.name === "Placeholder Text" && check.status === "fail",
    prompt: (check) => `Placeholder/template text was found in the HTML: ${check.detail}. Find and remove or replace this text in the source code with appropriate DeMar Transportation content. Then run \`npm run build\` and confirm it succeeds.`,
    commitMsg: "[auto-fix] Remove placeholder/template text",
    branchPrefix: "auto-fix/placeholder-text",
  },

  // --- SEO Content Fixes (Sonnet - needs content awareness) ---
  {
    tier: 2,
    id: "internal-linking",
    model: "sonnet",
    match: (check) => check.name === "Internal Links" && check.status === "warn" && check.detail?.includes("few internal links"),
    prompt: (check) => `The page has too few internal links. Review the content pages in src/pages/ and src/pages/services/ and add natural internal links between related pages. Service pages should cross-link to other services and to /quote, /contact, /about, /faq. Use <Link to="..."> from react-router-dom. Do NOT add forced or unnatural links. Then run \`npm run build\` and confirm it succeeds.`,
    commitMsg: "[auto-fix] Improve internal linking between content pages",
    branchPrefix: "auto-fix/internal-links",
  },
  {
    tier: 2,
    id: "thin-page-content",
    model: "sonnet",
    match: (check) => check.name?.includes("Content Length") && check.status === "warn",
    prompt: (check) => `A page has thin content: ${check.detail}. Expand the page content with relevant, authoritative freight industry information. DeMar Transportation is an asset-based carrier with 3PL capabilities based in Reno, NV. They offer dry van, reefer, flatbed, box truck, sprinter van, hazmat, FTL, LTL, 3PL, and warehousing services nationwide. Do NOT claim to be a "direct carrier" or use "no middleman" language — they also broker loads. Then run \`npm run build\` and confirm it succeeds.`,
    commitMsg: "[auto-fix] Expand thin page content for SEO",
    branchPrefix: "auto-fix/thin-content",
  },
  {
    tier: 2,
    id: "missing-meta-tags",
    model: "sonnet",
    match: (check) => check.name?.includes("Page Meta") && check.status !== "pass",
    prompt: (check) => `Pages are missing or have poor meta tags: ${check.detail}. Add or improve document.title and meta description for each affected page using useEffect. Titles should be under 60 characters and include the service name + "DeMar Transportation". Descriptions should be 120-160 characters, include a call to action, and mention Reno NV or nationwide service. Then run \`npm run build\` and confirm it succeeds.`,
    commitMsg: "[auto-fix] Add/improve page meta titles and descriptions",
    branchPrefix: "auto-fix/meta-tags",
  },
  {
    tier: 2,
    id: "missing-schema",
    model: "sonnet",
    match: (check) => check.name?.includes("Page Schema") && check.status !== "pass",
    prompt: (check) => `Pages are missing JSON-LD structured data: ${check.detail}. Add Service-type JSON-LD schema to service pages that are missing it. Use the pattern from existing service pages (dangerouslySetInnerHTML with JSON.stringify). Company info: DeMar Transportation, 10471 Double R Blvd, Reno, NV 89521, (775) 230-4767, info@DeMarTransportation.com. Then run \`npm run build\` and confirm it succeeds.`,
    commitMsg: "[auto-fix] Add JSON-LD structured data to pages",
    branchPrefix: "auto-fix/page-schema",
  },

  // --- Deep Content Generation (Opus - needs nuance and authority) ---
  {
    tier: 2,
    id: "content-rewrite",
    model: "opus",
    match: (check) => check.name === "Content Quality" && check.status === "fail",
    prompt: (check) => `Content quality issues detected: ${check.detail}. Rewrite the affected content to be authoritative, accurate, and SEO-optimized for the freight/logistics industry. DeMar Transportation is an asset-based carrier with 3PL capabilities (own fleet + carrier network + warehouse network). Based in Reno, NV 89521. NEVER claim "direct carrier", "no middleman", or "no broker markup" — they also broker loads. Focus on transparency, competitive rates, and nationwide coverage. Then run \`npm run build\` and confirm it succeeds.`,
    commitMsg: "[auto-fix] Improve content quality and accuracy",
    branchPrefix: "auto-fix/content-quality",
  },
  {
    tier: 2,
    id: "new-page-content",
    model: "opus",
    match: (check) => check.name === "Missing Service Page" && check.status === "fail",
    prompt: (check) => `A service page is missing: ${check.detail}. Create a new page in src/pages/services/ following the existing pattern (Header + content + Footer, useEffect for title/meta, JSON-LD schema, 800-1200 words of authoritative content). Do NOT import LandstarSidebar. Do NOT use "direct carrier" or "no middleman" language. Company: DeMar Transportation, 10471 Double R Blvd, Reno, NV 89521, (775) 230-4767. Add the route to src/App.tsx as a lazy import. Then run \`npm run build\` and confirm it succeeds.`,
    commitMsg: "[auto-fix] Create missing service page",
    branchPrefix: "auto-fix/new-page",
  },
];

// Issues that should NEVER be auto-fixed (GitHub Pages limitations)
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
            model: rule.model || "haiku",
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
