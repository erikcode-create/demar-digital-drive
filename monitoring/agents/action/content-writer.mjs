/**
 * Content Writer Action Agent
 *
 * Ported from monitoring/seo/blog-topic-generator.mjs.
 * Instead of generating random topics, reads from the strategy action queue
 * and writes or updates content based on the assigned action.
 */

import { generateWithClaude } from "../../marketing/lib/claude-api.mjs";
import { commitAndPush, buildSucceeds } from "../../marketing/lib/git-ops.mjs";
import { readFileSync, writeFileSync, readdirSync, existsSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const SITE_URL = "https://demartransportation.com";

export const name = "content-writer";
export const category = "action";
export const description =
  "Writes new blog posts or updates existing pages based on strategy actions.";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugToComponentName(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function getExistingBlogSlugs() {
  const blogDir = path.join(REPO_ROOT, "src/pages/blog");
  if (!existsSync(blogDir)) return [];
  return readdirSync(blogDir)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.replace(".tsx", ""));
}

// ---------------------------------------------------------------------------
// New content: generate topic metadata then full post
// ---------------------------------------------------------------------------

async function generateTopicFromAction(action) {
  const existingBlogs = getExistingBlogSlugs().join(", ");

  const prompt = `You are a content strategist for DeMar Transportation, a US freight carrier and broker (MC and broker authority, own fleet + 3PL, partner warehouses) based in Reno NV. Services: dry van, reefer, flatbed, hazmat, FTL, LTL, 3PL, warehousing, box truck, sprinter van.

The SEO strategy agent has identified this action:
- Target keyword: ${action.targetKeyword || "not specified"}
- Reason: ${action.reason}
- Details: ${action.details}

Existing blog post files: ${existingBlogs}

Create a blog post plan for this topic. Return ONLY a JSON object (no markdown fences):
{
  "title": "Blog post H1 title (includes target keyword naturally)",
  "slug": "url-slug-lowercase-hyphen-separated",
  "targetKeyword": "${action.targetKeyword || "choose the best keyword"}",
  "category": "one of: Pricing & Rates, Shipping Guides, Industry Knowledge, Compliance & Safety, Logistics Strategy",
  "faqs": [
    { "question": "...", "answer": "2-3 sentences with specific numbers/data" }
  ],
  "relatedLinks": [
    { "label": "descriptive anchor text", "to": "/existing/page/path" }
  ],
  "metaTitle": "Under 60 chars, includes keyword",
  "metaDescription": "Under 160 chars, includes keyword, has CTA",
  "subtitle": "short category label",
  "description": "1-2 sentence description for blog listing",
  "readTime": "8 min"
}

Provide 5 FAQs and 4 related links pointing to real pages on demartransportation.com.`;

  console.log("  Generating topic metadata with Claude (haiku)...");
  const output = await generateWithClaude(prompt, { model: "haiku", timeout: 120000 });
  const match = output.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Could not parse topic metadata from Claude response");
  }
  return JSON.parse(match[0]);
}

async function writeBlogPost(topic) {
  const today = new Date().toISOString().split("T")[0];
  const faqsJson = JSON.stringify(topic.faqs, null, 2);
  const relatedLinksJson = JSON.stringify(topic.relatedLinks, null, 2);

  const prompt = `Write a complete React/TypeScript blog post component file for DeMar Transportation's website.

COMPONENT NAME: ${slugToComponentName(topic.slug)}
SLUG: ${topic.slug}
TITLE: ${topic.title}
SUBTITLE: ${topic.subtitle}
DESCRIPTION: ${topic.description}
META TITLE: ${topic.metaTitle}
META DESCRIPTION: ${topic.metaDescription}
PUBLISH DATE: ${today}
READ TIME: ${topic.readTime}
TARGET KEYWORD: ${topic.targetKeyword}

FAQs (use these exactly):
${faqsJson}

Related Links (use these exactly):
${relatedLinksJson}

TEMPLATE TO FOLLOW (this is the exact structure - follow it precisely):
\`\`\`tsx
import BlogPost from "@/components/BlogPost";
import { Link } from "react-router-dom";

const ComponentName = () => {
  const faqs = [ /* paste the FAQs here */ ];
  const relatedLinks = [ /* paste the related links here */ ];
  const content = (
    <>
      <p>First paragraph directly answers the target query in 200+ words...</p>
      <h2>Section Title</h2>
      <p>Content paragraphs...</p>
      {/* More sections with h2, h3, p tags */}
    </>
  );

  return (
    <BlogPost
      title="..."
      subtitle="..."
      description="..."
      metaTitle="..."
      metaDescription="..."
      slug="..."
      publishDate="..."
      readTime="..."
      content={content}
      faqs={faqs}
      relatedLinks={relatedLinks}
    />
  );
};

export default ComponentName;
\`\`\`

CRITICAL WRITING GUIDELINES:

=== COPYWRITING PRINCIPLES ===
1. CLARITY OVER CLEVERNESS. Get to the point. Do not bury the value in qualifications.
2. BENEFITS OVER FEATURES. Describe what it means for the shipper.
3. SPECIFICITY OVER VAGUENESS. Never use "streamline," "optimize," "innovative," "leverage," or "solutions." Use specific numbers, lane examples, dollar amounts.
4. CUSTOMER LANGUAGE. Write the way a logistics manager talks. Use terms like "deadhead miles," "detention charges," "lumper fees," "drop trailer."
5. ACTIVE VOICE. Remove "almost," "very," "really," "quite," "basically."
6. ONE IDEA PER SECTION.
7. NO EXCLAMATION POINTS. Ever.
8. USE RHETORICAL QUESTIONS sparingly.

=== SEO & E-E-A-T REQUIREMENTS ===
9. GEO-OPTIMIZED: First 200 words must directly answer the target query "${topic.targetKeyword}" in a clear, quotable statement for AI search engines.
10. TARGET KEYWORD in the title, first paragraph, and at least 2 h2 headings. Natural 1-3% density.
11. E-E-A-T SIGNALS: Include first-hand experience signals and cite specific industry data.
12. AI CITATION READINESS: Include at least 2 clear, quotable factual statements with specific numbers.
13. CONTENT DEPTH: 1500+ words minimum.

=== CONTENT STRUCTURE ===
14. 4-6 internal links using React Router Link component with descriptive anchor text.
15. Use h2 for major sections (5-7) and h3 for subsections.
16. Write in flowing paragraphs, NOT bullet lists. Only use bullets for truly list-like data.
17. Vary paragraph length for natural reading rhythm.
18. Reference DeMar Transportation naturally in 2-3 places.

=== STYLE RULES ===
19. NO EM DASHES. Never use the character \u2014. Use commas, periods, semicolons instead.
20. Do NOT use any markdown. This is JSX/TSX only.
21. Do NOT wrap strings in curly braces unless they contain JSX expressions.
22. Use regular apostrophes ' in JSX text content.
23. NEVER fabricate statistics or testimonials.

Return ONLY the complete .tsx file content. No markdown fences. No explanation. Raw TypeScript/React code starting with "import" and ending with the export default statement.`;

  console.log(`  Writing blog post: ${topic.title}...`);
  const output = await generateWithClaude(prompt, { model: "sonnet", timeout: 300000 });

  let code = output.trim();

  // Extract from markdown fences if present
  const fenceMatch = code.match(/```(?:tsx?|jsx?|typescript|javascript)?\s*\n([\s\S]*?)```/);
  if (fenceMatch) {
    code = fenceMatch[1].trim();
  } else if (!code.startsWith("import")) {
    const importIdx = code.indexOf("import BlogPost");
    if (importIdx === -1) {
      const anyImport = code.indexOf("import ");
      if (anyImport !== -1) code = code.substring(anyImport);
    } else {
      code = code.substring(importIdx);
    }
  }

  // Strip trailing explanation
  const exportMatch = code.match(/export default \w+;/);
  if (exportMatch) {
    code = code.substring(0, exportMatch.index + exportMatch[0].length);
  }

  if (!code.includes("import BlogPost") || !code.includes("export default")) {
    console.error("  Raw output (first 500 chars):", output.substring(0, 500));
    throw new Error("Generated code missing required imports or export");
  }

  return code;
}

// ---------------------------------------------------------------------------
// Update App.tsx, Blog.tsx, prerender.mjs, sitemap.xml
// ---------------------------------------------------------------------------

function updateAppTsx(post) {
  const appPath = path.join(REPO_ROOT, "src/App.tsx");
  let content = readFileSync(appPath, "utf-8");
  const componentName = slugToComponentName(post.slug);
  const importLine = `const ${componentName} = lazy(() => import("./pages/blog/${componentName}"));`;
  const routeLine = `              <Route path="/blog/${post.slug}" element={<${componentName} />} />`;

  if (!content.includes(importLine)) {
    content = content.replace(
      "const queryClient = new QueryClient();",
      `${importLine}\n\nconst queryClient = new QueryClient();`
    );
  }
  if (!content.includes(`path="/blog/${post.slug}"`)) {
    content = content.replace(
      '              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}',
      `${routeLine}\n              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}`
    );
  }
  writeFileSync(appPath, content);
  console.log("  Updated App.tsx");
}

function updateBlogTsx(post) {
  const blogPath = path.join(REPO_ROOT, "src/pages/Blog.tsx");
  let content = readFileSync(blogPath, "utf-8");
  const today = new Date().toISOString().split("T")[0];

  if (content.includes(`slug: "${post.slug}"`)) return;

  const newEntry = `  {
    slug: "${post.slug}",
    title: "${post.title.replace(/"/g, '\\"')}",
    description:
      "${post.description.replace(/"/g, '\\"')}",
    category: "${post.category}",
    date: "${today}",
    readTime: "${post.readTime}",
  },`;

  content = content.replace(
    /^(const blogPosts = \[[\s\S]*?)(^\];)/m,
    `$1${newEntry}\n$2`
  );

  writeFileSync(blogPath, content);
  console.log("  Updated Blog.tsx");
}

function updatePrerenderMjs(post) {
  const prerenderPath = path.join(REPO_ROOT, "scripts/prerender.mjs");
  let content = readFileSync(prerenderPath, "utf-8");
  const route = `/blog/${post.slug}`;
  if (content.includes(`'${route}'`)) return;

  content = content.replace(
    /^(const routes = \[[\s\S]*?)(^\];)/m,
    `$1  '${route}',\n$2`
  );
  writeFileSync(prerenderPath, content);
  console.log("  Updated prerender.mjs");
}

function updateSitemapXml(post) {
  const sitemapPath = path.join(REPO_ROOT, "public/sitemap.xml");
  let content = readFileSync(sitemapPath, "utf-8");
  const url = `https://demartransportation.com/blog/${post.slug}`;
  if (content.includes(url)) return;

  const entry = `  <url>
    <loc>${url}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  content = content.replace("</urlset>", `${entry}\n</urlset>`);
  writeFileSync(sitemapPath, content);
  console.log("  Updated sitemap.xml");
}

// ---------------------------------------------------------------------------
// Update existing content
// ---------------------------------------------------------------------------

async function updateExistingContent(action, context) {
  console.log(`  Reading existing page: ${action.targetPage}...`);

  let pageContent;
  try {
    pageContent = context.source.readPage(action.targetPage);
  } catch (err) {
    return { success: false, summary: `Could not read page ${action.targetPage}: ${err.message}` };
  }

  const prompt = `You are editing an existing page on DeMar Transportation's website (React/Vite/TypeScript SPA).

TARGET PAGE: ${action.targetPage}
REASON FOR UPDATE: ${action.reason}
SPECIFIC INSTRUCTIONS: ${action.details}
TARGET KEYWORD: ${action.targetKeyword || "maintain existing keyword focus"}

Current page source:
\`\`\`tsx
${pageContent.rawSource || (typeof pageContent === "string" ? pageContent : JSON.stringify(pageContent))}
\`\`\`

Make the minimum changes needed to address the instructions. Preserve the existing component structure, imports, and exports. Focus on:
- Adding E-E-A-T signals (first-hand experience, industry data citations)
- Improving content depth and specificity
- Adding AI-citation-ready quotable statements with numbers
- Strengthening keyword presence if needed

STYLE RULES:
- NO EM DASHES (never use \u2014)
- No exclamation points
- Active voice, customer language
- No marketing buzzwords (streamline, optimize, innovative, leverage, solutions)
- Specific numbers and examples over vague claims

Return ONLY the complete updated .tsx file. No markdown fences. No explanation.`;

  console.log("  Generating content update with Claude (sonnet)...");
  const output = await generateWithClaude(prompt, { model: "sonnet", timeout: 300000 });

  let code = output.trim();
  const fenceMatch = code.match(/```(?:tsx?|jsx?|typescript|javascript)?\s*\n([\s\S]*?)```/);
  if (fenceMatch) {
    code = fenceMatch[1].trim();
  } else if (!code.startsWith("import")) {
    const anyImport = code.indexOf("import ");
    if (anyImport !== -1) code = code.substring(anyImport);
  }

  const exportMatch = code.match(/export default \w+;/);
  if (exportMatch) {
    code = code.substring(0, exportMatch.index + exportMatch[0].length);
  }

  if (!code.includes("export default")) {
    // Try to salvage: find the component name and append export default
    const funcMatch = code.match(/(?:export\s+)?(?:function|const)\s+(\w+)/);
    if (funcMatch) {
      code += `\n\nexport default ${funcMatch[1]};\n`;
      console.log(`  [fallback] Appended export default ${funcMatch[1]};`);
    } else {
      throw new Error("Updated code missing export default statement");
    }
  }

  // Map URL path to source file
  const srcFile = pathToSourceFile(action.targetPage);
  const fullPath = path.join(REPO_ROOT, srcFile);

  if (!existsSync(fullPath)) {
    throw new Error(`Source file not found: ${srcFile}`);
  }

  writeFileSync(fullPath, code);
  console.log(`  Wrote updated file: ${srcFile}`);

  return { success: true, filePath: srcFile };
}

function pathToSourceFile(urlPath) {
  if (urlPath === "/") return "src/pages/Index.tsx";
  if (urlPath.startsWith("/blog/")) {
    const slug = urlPath.replace("/blog/", "");
    return `src/pages/blog/${slugToComponentName(slug)}.tsx`;
  }
  if (urlPath.startsWith("/resources/")) {
    const slug = urlPath.replace("/resources/", "");
    return `src/pages/resources/${slugToComponentName(slug)}.tsx`;
  }
  if (urlPath.startsWith("/services/")) {
    const slug = urlPath.replace("/services/", "");
    return `src/pages/services/${slugToComponentName(slug)}.tsx`;
  }
  const coreMap = {
    "/about": "src/pages/AboutPage.tsx",
    "/contact": "src/pages/Contact.tsx",
    "/quote": "src/pages/Quote.tsx",
    "/careers": "src/pages/Careers.tsx",
    "/faq": "src/pages/FAQ.tsx",
    "/privacy": "src/pages/Privacy.tsx",
    "/support": "src/pages/Support.tsx",
    "/blog": "src/pages/Blog.tsx",
  };
  return coreMap[urlPath] || null;
}

// ---------------------------------------------------------------------------
// Mark action as completed in the queue
// ---------------------------------------------------------------------------

function markActionCompleted(context, actionId) {
  try {
    const completed = context.state.read("strategy", "completed-actions") || { ids: [] };
    if (!completed.ids.includes(actionId)) {
      completed.ids.push(actionId);
    }
    context.state.write("strategy", "completed-actions", completed);
  } catch {
    context.state.write("strategy", "completed-actions", { ids: [actionId] });
  }

  try {
    const queue = context.state.read("strategy", "action-queue");
    if (queue && queue.actions) {
      const action = queue.actions.find((a) => a.id === actionId);
      if (action) action.status = "completed";
      context.state.write("strategy", "action-queue", queue);
    }
  } catch {
    // Queue may not exist, that is fine
  }
}

// ---------------------------------------------------------------------------
// Main run
// ---------------------------------------------------------------------------

export async function run(context) {
  const action = context.config.currentAction;
  if (!action) {
    return { success: false, summary: "No currentAction provided in context.config", data: null };
  }

  console.log(`=== Content Writer Agent ===`);
  console.log(`Action: ${action.id} | Type: ${action.type} | Keyword: ${action.targetKeyword || "none"}`);

  const MAX_RETRIES = 2;

  // -----------------------------------------------------------------------
  // Handle "update-content"
  // -----------------------------------------------------------------------
  if (action.type === "update-content") {
    if (!action.targetPage) {
      return { success: false, summary: "update-content action requires targetPage", data: null };
    }

    for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
      try {
        if (attempt > 1) console.log(`  Retry ${attempt - 1}/${MAX_RETRIES}...`);
        const result = await updateExistingContent(action, context);
        if (!result.success) return { success: false, summary: result.summary, data: null };

        console.log("  Verifying build...");
        if (!buildSucceeds()) {
          console.error("  Build failed after content update. Reverting.");
          // Restore original file from git
          try {
            const { execSync } = await import("node:child_process");
            execSync(`git checkout -- ${result.filePath}`, { cwd: REPO_ROOT });
          } catch {}
          if (attempt === MAX_RETRIES + 1) {
            return { success: false, summary: "Build failed after content update", data: null };
          }
          continue;
        }

        const commitMsg = `[seo-auto] Update content: ${action.targetPage} (${action.targetKeyword || "content improvement"})`;
        commitAndPush(commitMsg);
        console.log("  Committed and pushed.");

        markActionCompleted(context, action.id);

        try {
          await context.discord.post("seo", {
            content: `**Content Writer Agent**`,
            embeds: [{
              title: "Content Updated",
              description: `**Page:** ${action.targetPage}\n**Keyword:** ${action.targetKeyword || "N/A"}\n**Reason:** ${action.reason}\n\n[View page](${SITE_URL}${action.targetPage})`,
              color: 3066993,
              timestamp: new Date().toISOString(),
            }],
          });
        } catch {}

        return {
          success: true,
          summary: `Updated content on ${action.targetPage}`,
          data: { page: action.targetPage, type: "update-content" },
        };
      } catch (err) {
        console.error(`  Attempt ${attempt} failed: ${err.message}`);
        if (attempt === MAX_RETRIES + 1) {
          return { success: false, summary: `Failed to update content: ${err.message}`, data: null };
        }
      }
    }
  }

  // -----------------------------------------------------------------------
  // Handle "write-content" (new blog post)
  // -----------------------------------------------------------------------
  if (action.type === "write-content") {
    let topic;
    let code;

    for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
      try {
        if (attempt > 1) console.log(`  Retry ${attempt - 1}/${MAX_RETRIES}...`);

        // Generate topic metadata
        topic = await generateTopicFromAction(action);
        console.log(`  Topic: ${topic.title} (slug: ${topic.slug})`);

        // Check for duplicate slug
        const existingSlugs = getExistingBlogSlugs();
        if (existingSlugs.includes(slugToComponentName(topic.slug))) {
          topic.slug = `${topic.slug}-${Date.now().toString(36).slice(-4)}`;
          console.log(`  Slug conflict, using: ${topic.slug}`);
        }

        // Write the full post
        code = await writeBlogPost(topic);

        const componentName = slugToComponentName(topic.slug);
        const filePath = path.join(REPO_ROOT, `src/pages/blog/${componentName}.tsx`);
        writeFileSync(filePath, code);
        console.log(`  Wrote: src/pages/blog/${componentName}.tsx`);

        // Update supporting files
        updateAppTsx(topic);
        updateBlogTsx(topic);
        updatePrerenderMjs(topic);
        updateSitemapXml(topic);

        // Verify build
        console.log("  Verifying build...");
        if (!buildSucceeds()) {
          console.error("  Build failed. Cleaning up...");
          try { unlinkSync(filePath); } catch {}
          // Restore modified files
          try {
            const { execSync } = await import("node:child_process");
            execSync("git checkout -- src/App.tsx src/pages/Blog.tsx scripts/prerender.mjs public/sitemap.xml", {
              cwd: REPO_ROOT,
            });
          } catch {}
          if (attempt === MAX_RETRIES + 1) {
            return { success: false, summary: "Build failed after writing new blog post", data: null };
          }
          continue;
        }

        // Commit and push
        const today = new Date().toISOString().split("T")[0];
        const commitMsg = `[seo-auto] New blog post: ${topic.title} (${today})`;
        commitAndPush(commitMsg);
        console.log("  Committed and pushed to main.");

        markActionCompleted(context, action.id);

        // Post to Discord
        try {
          await context.discord.post("seo", {
            content: `**Content Writer Agent**`,
            embeds: [{
              title: "New Blog Post Published",
              description: `**[${topic.title}](${SITE_URL}/blog/${topic.slug})**\nKeyword: \`${topic.targetKeyword}\` | ${topic.category}\n\n**Reason:** ${action.reason}`,
              color: 3066993,
              timestamp: new Date().toISOString(),
              footer: { text: "Committed to main | Auto-deploying" },
            }],
          });
        } catch {}

        return {
          success: true,
          summary: `Published new blog post: ${topic.title}`,
          data: { slug: topic.slug, title: topic.title, type: "write-content" },
        };
      } catch (err) {
        console.error(`  Attempt ${attempt} failed: ${err.message}`);
        if (attempt === MAX_RETRIES + 1) {
          // Notify Discord about failure
          try {
            await context.discord.post("seo", {
              content: `**Content Writer Agent**`,
              embeds: [{
                title: "Content Write Failed",
                description: `**Action:** ${action.id}\n**Keyword:** ${action.targetKeyword || "N/A"}\n**Error:** ${err.message}`,
                color: 15158332,
                timestamp: new Date().toISOString(),
              }],
            });
          } catch {}
          return { success: false, summary: `Failed to write content: ${err.message}`, data: null };
        }
      }
    }
  }

  return {
    success: false,
    summary: `Unknown action type for content-writer: ${action.type}. Expected write-content or update-content.`,
    data: null,
  };
}
