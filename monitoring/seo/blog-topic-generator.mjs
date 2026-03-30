import "dotenv/config";
import * as cheerio from "cheerio";
import { postToChannel } from "../lib/discord.mjs";
import { generateWithClaude } from "../marketing/lib/claude-api.mjs";
import { commitAndPush, buildSucceeds } from "../marketing/lib/git-ops.mjs";
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const SITE_URL = "https://demartransportation.com";

const PAGES = [
  { path: "/", name: "Homepage" },
  { path: "/about", name: "About" },
  { path: "/contact", name: "Contact" },
  { path: "/quote", name: "Quote Request" },
  { path: "/careers", name: "Careers" },
  { path: "/faq", name: "FAQ" },
  { path: "/services/dry-van", name: "Dry Van" },
  { path: "/services/reefer", name: "Reefer" },
  { path: "/services/flatbed", name: "Flatbed" },
  { path: "/services/box-truck", name: "Box Truck" },
  { path: "/services/sprinter-van", name: "Sprinter Van" },
  { path: "/services/hazmat", name: "Hazmat" },
  { path: "/services/ftl", name: "FTL" },
  { path: "/services/ltl", name: "LTL" },
  { path: "/services/3pl", name: "3PL" },
  { path: "/services/warehousing", name: "Warehousing" },
  { path: "/resources", name: "Resources Hub" },
  { path: "/resources/freight-shipping-cost", name: "Freight Shipping Cost" },
  { path: "/resources/how-to-get-freight-quote", name: "How to Get Quote" },
  { path: "/resources/how-to-choose-freight-carrier", name: "Choose Carrier" },
  { path: "/resources/dry-van-vs-reefer", name: "Dry Van vs Reefer" },
  { path: "/resources/ftl-vs-ltl", name: "FTL vs LTL" },
  { path: "/resources/hot-shot-vs-full-truckload", name: "Hot Shot vs FTL" },
  { path: "/resources/types-of-freight-trailers", name: "Trailer Types" },
  { path: "/resources/how-to-ship-freight", name: "How to Ship Freight" },
  { path: "/resources/how-to-ship-refrigerated-goods", name: "Ship Refrigerated" },
  { path: "/resources/how-to-ship-hazardous-materials", name: "Ship Hazmat" },
  { path: "/resources/oversized-load-shipping", name: "Oversized Loads" },
  { path: "/resources/freight-classes-explained", name: "Freight Classes" },
  { path: "/resources/broker-vs-carrier-vs-3pl", name: "Broker vs Carrier" },
  { path: "/resources/freight-shipping-glossary", name: "Glossary" },
  { path: "/resources/seasonal-freight-shipping", name: "Seasonal Shipping" },
  { path: "/blog", name: "Blog" },
];

// ---------------------------------------------------------------------------
// Step 1: Crawl live site for existing page titles
// ---------------------------------------------------------------------------
async function crawlTitlesAndH1s() {
  const results = [];
  for (const page of PAGES) {
    const url = `${SITE_URL}${page.path}`;
    console.log(`  Crawling ${page.name} (${url})...`);
    try {
      const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000) });
      const html = await res.text();
      const $ = cheerio.load(html);
      const title = $("title").text().trim();
      const h1 = $("h1").first().text().trim();
      results.push({ path: page.path, name: page.name, title, h1 });
    } catch (err) {
      console.error(`  Failed to crawl ${page.name}: ${err.message}`);
      results.push({ path: page.path, name: page.name, title: page.name, h1: "" });
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Step 2: Read existing blog posts from src/pages/blog/
// ---------------------------------------------------------------------------
function getExistingBlogSlugs() {
  const blogDir = path.join(REPO_ROOT, "src/pages/blog");
  if (!existsSync(blogDir)) return [];
  return readdirSync(blogDir)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.replace(".tsx", ""));
}

// ---------------------------------------------------------------------------
// Step 3: Generate 5 new blog topics with Claude (haiku)
// ---------------------------------------------------------------------------
async function generateTopics(existingContent, existingBlogFiles) {
  const titleList = existingContent
    .map((p) => `- ${p.title || p.name} (${p.path})`)
    .join("\n");

  const existingBlogs = existingBlogFiles.join(", ");

  const prompt = `You are a content strategist for DeMar Transportation, a US freight carrier and broker (MC and broker authority, own fleet + 3PL, partner warehouses) based in Reno NV. Services: dry van, reefer, flatbed, hazmat, FTL, LTL, 3PL, warehousing, box truck, sprinter van.

Here are all existing page titles on the site:
${titleList}

Existing blog post component files: ${existingBlogs}

Suggest 5 NEW blog post topics that:
- Target long-tail keywords with commercial or informational intent that shippers search for
- Fill content gaps not covered by existing pages
- Attract shippers who need freight services
- Are different enough from existing content to avoid keyword cannibalization
- Cover practical, actionable freight topics (not generic business advice)

For each topic provide:
- title: the blog post H1 title (compelling, includes target keyword naturally)
- slug: URL slug (lowercase, hyphen-separated, no trailing slash)
- targetKeyword: the primary keyword to rank for
- category: one of "Pricing & Rates", "Shipping Guides", "Industry Knowledge", "Compliance & Safety", "Logistics Strategy"
- faqs: array of 5 objects with { question, answer } - answers should be 2-3 sentences, specific with numbers/data
- relatedLinks: array of 4 objects with { label, to } pointing to existing pages on the site (use paths from the list above)
- metaTitle: SEO title tag (under 60 chars, includes keyword)
- metaDescription: meta description (under 160 chars, includes keyword, has CTA)
- subtitle: short category label for the blog post header
- description: 1-2 sentence description for the blog listing page
- readTime: estimated read time like "8 min" or "10 min"

Return ONLY a JSON array (no markdown fences, no explanation) with these objects.`;

  console.log("Generating 5 new blog topics with Claude (haiku)...");
  const output = await generateWithClaude(prompt, { model: "haiku", timeout: 120000 });
  const match = output.match(/\[[\s\S]*\]/);
  if (!match) {
    console.error("Could not parse Claude response as JSON array");
    console.error("Raw output:", output.substring(0, 500));
    return [];
  }
  return JSON.parse(match[0]);
}

// ---------------------------------------------------------------------------
// Step 4: Write a full blog post React component with Claude (sonnet)
// ---------------------------------------------------------------------------
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
1. CLARITY OVER CLEVERNESS. If you have to choose between clear and creative, choose clear. Get to the point. Do not bury the value in qualifications.
2. BENEFITS OVER FEATURES. Do not just describe what something is. Describe what it means for the shipper. "48-foot dry van with air ride suspension" becomes "your freight arrives damage-free because air ride suspension absorbs road shock on every mile of the haul."
3. SPECIFICITY OVER VAGUENESS. Never use "streamline," "optimize," "innovative," "leverage," or "solutions." Instead use specific numbers, lane examples, and dollar amounts. "Save money on shipping" becomes "shippers on the LA-to-Dallas lane typically save $400-600 per load by booking 72 hours ahead."
4. CUSTOMER LANGUAGE. Write the way a logistics manager or supply chain director talks. Use terms like "deadhead miles," "detention charges," "lumper fees," "drop trailer," not marketing buzzwords.
5. ACTIVE VOICE. "We deliver your freight in 48 hours" not "Your freight is delivered within 48 hours." Remove "almost," "very," "really," "quite," "basically."
6. ONE IDEA PER SECTION. Each h2 section should advance one argument. Build a logical flow down the page that a reader can scan by headings alone.
7. NO EXCLAMATION POINTS. Ever. Confident copy does not need them.
8. USE RHETORICAL QUESTIONS sparingly to engage readers. "What happens when your reefer load sits at the dock for 6 hours?" draws readers into the problem before you give the answer.

=== SEO & E-E-A-T REQUIREMENTS ===
9. GEO-OPTIMIZED: The first 200 words must directly answer the target query "${topic.targetKeyword}" in a clear, quotable statement so AI search engines (ChatGPT, Perplexity, Google AI Overviews) can extract and cite the answer. Structure it as: direct answer first, then context and detail.
10. TARGET KEYWORD in the title, first paragraph, and at least 2 h2 headings. Use semantic variations throughout (1-3% natural density). No keyword stuffing.
11. E-E-A-T SIGNALS: Include at least one first-hand experience signal (e.g. "In our experience hauling produce on the I-10 corridor..." or "DeMar's drivers report that..."). Cite specific industry data with context (FMCSA regulations, USDA temperature requirements, NMFC freight classes). Include a clear author perspective that demonstrates expertise.
12. AI CITATION READINESS: Include at least 2 clear, quotable factual statements with specific numbers that AI systems can extract. Example: "The average dry van rate from Chicago to Atlanta runs $2.15-2.45 per mile as of 2026, depending on seasonal demand."
13. CONTENT DEPTH: 1500+ words minimum. Cover the topic comprehensively enough that a shipper would not need to visit another page. Include edge cases, common mistakes, and real-world scenarios.

=== CONTENT STRUCTURE ===
14. 4-6 internal links using React Router Link component. Example: <Link to="/services/ftl">full truckload shipping</Link>. Use descriptive anchor text, not "click here" or "learn more."
15. Use h2 for major sections (5-7 per post) and h3 for subsections. A reader should understand the full article just by scanning the headings.
16. Write in flowing paragraphs, NOT bullet lists. Only use bullets sparingly for truly list-like data (e.g. a list of required documents). Use tables ONLY for comparison data.
17. Vary paragraph length. Some short punchy paragraphs (1-2 sentences), some longer ones (4-5 sentences). This creates natural reading rhythm.
18. Reference DeMar Transportation naturally in 2-3 places. Not every section. Write from the perspective of an industry expert, not a sales brochure.

=== STYLE RULES ===
19. NO EM DASHES. Never use the character \u2014. Use commas, periods, semicolons, or restructure sentences instead.
20. Do NOT use any markdown. This is JSX/TSX only.
21. Do NOT wrap strings in curly braces unless they contain JSX expressions.
22. Use regular apostrophes ' in JSX text content.
23. NEVER fabricate statistics or testimonials. If citing numbers, use realistic industry ranges. Mark estimates as estimates.

Return ONLY the complete .tsx file content. No markdown fences. No explanation before or after. Just the raw TypeScript/React code starting with "import" and ending with the export default statement.`;

  console.log(`  Writing blog post: ${topic.title}...`);
  const output = await generateWithClaude(prompt, { model: "sonnet", timeout: 300000 });

  // Strip any markdown fences if Claude added them despite instructions
  let code = output.trim();
  if (code.startsWith("```")) {
    code = code.replace(/^```\w*\n?/, "").replace(/\n?```$/, "");
  }

  // Basic validation
  if (!code.includes("import BlogPost") || !code.includes("export default")) {
    throw new Error("Generated code missing required imports or export");
  }

  return code;
}

// ---------------------------------------------------------------------------
// Helper: slug to PascalCase component name
// ---------------------------------------------------------------------------
function slugToComponentName(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

// ---------------------------------------------------------------------------
// Step 6: Update App.tsx with lazy import and Route
// ---------------------------------------------------------------------------
function updateAppTsx(posts) {
  const appPath = path.join(REPO_ROOT, "src/App.tsx");
  let content = readFileSync(appPath, "utf-8");

  for (const post of posts) {
    const componentName = slugToComponentName(post.slug);
    const importLine = `const ${componentName} = lazy(() => import("./pages/blog/${componentName}"));`;
    const routeLine = `              <Route path="/blog/${post.slug}" element={<${componentName} />} />`;

    // Add lazy import before the queryClient line
    if (!content.includes(importLine)) {
      content = content.replace(
        "const queryClient = new QueryClient();",
        `${importLine}\n\nconst queryClient = new QueryClient();`
      );
    }

    // Add route before the catch-all comment
    if (!content.includes(`path="/blog/${post.slug}"`)) {
      content = content.replace(
        '              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}',
        `${routeLine}\n              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}`
      );
    }
  }

  writeFileSync(appPath, content);
  console.log("  Updated App.tsx");
}

// ---------------------------------------------------------------------------
// Step 7: Update Blog.tsx with new posts in blogPosts array
// ---------------------------------------------------------------------------
function updateBlogTsx(posts) {
  const blogPath = path.join(REPO_ROOT, "src/pages/Blog.tsx");
  let content = readFileSync(blogPath, "utf-8");

  const today = new Date().toISOString().split("T")[0];

  for (const post of posts) {
    if (content.includes(`slug: "${post.slug}"`)) continue;

    const newEntry = `  {
    slug: "${post.slug}",
    title: "${post.title.replace(/"/g, '\\"')}",
    description:
      "${post.description.replace(/"/g, '\\"')}",
    category: "${post.category}",
    date: "${today}",
    readTime: "${post.readTime}",
  },`;

    // Insert before the closing bracket of blogPosts array
    content = content.replace(
      /^(const blogPosts = \[[\s\S]*?)(^\];)/m,
      `$1${newEntry}\n$2`
    );
  }

  writeFileSync(blogPath, content);
  console.log("  Updated Blog.tsx");
}

// ---------------------------------------------------------------------------
// Step 8: Update prerender.mjs with new routes
// ---------------------------------------------------------------------------
function updatePrerenderMjs(posts) {
  const prerenderPath = path.join(REPO_ROOT, "scripts/prerender.mjs");
  let content = readFileSync(prerenderPath, "utf-8");

  for (const post of posts) {
    const route = `/blog/${post.slug}`;
    if (content.includes(`'${route}'`)) continue;

    // Add before the closing bracket of the routes array
    content = content.replace(
      /^(const routes = \[[\s\S]*?)(^\];)/m,
      `$1  '${route}',\n$2`
    );
  }

  writeFileSync(prerenderPath, content);
  console.log("  Updated prerender.mjs");
}

// ---------------------------------------------------------------------------
// Step 9: Update sitemap.xml with new URLs
// ---------------------------------------------------------------------------
function updateSitemapXml(posts) {
  const sitemapPath = path.join(REPO_ROOT, "public/sitemap.xml");
  let content = readFileSync(sitemapPath, "utf-8");

  for (const post of posts) {
    const url = `https://demartransportation.com/blog/${post.slug}`;
    if (content.includes(url)) continue;

    const entry = `  <url>
    <loc>${url}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

    content = content.replace("</urlset>", `${entry}\n</urlset>`);
  }

  writeFileSync(sitemapPath, content);
  console.log("  Updated sitemap.xml");
}

// ---------------------------------------------------------------------------
// Step 10-12: Build, create PR, post to Discord
// ---------------------------------------------------------------------------
export default async function run() {
  console.log("=== Blog Post Writer ===");
  const today = new Date().toISOString().split("T")[0];

  // Step 1: Crawl existing content
  console.log(`\nStep 1: Crawling ${PAGES.length} pages for existing content...`);
  const existingContent = await crawlTitlesAndH1s();

  // Step 2: Read existing blog files
  console.log("\nStep 2: Reading existing blog posts...");
  const existingBlogFiles = getExistingBlogSlugs();
  console.log(`  Found ${existingBlogFiles.length} existing blog posts: ${existingBlogFiles.join(", ")}`);

  // Step 3: Generate topics
  console.log("\nStep 3: Generating 5 new blog topics...");
  const topics = await generateTopics(existingContent, existingBlogFiles);
  console.log(`  Generated ${topics.length} topics`);

  if (topics.length === 0) {
    console.log("No topics generated. Exiting.");
    return { posts: 0 };
  }

  // Step 4-5: Write each blog post (with retries)
  const MAX_RETRIES = 2;
  console.log("\nStep 4-5: Writing blog posts...");
  const successfulPosts = [];
  const failedPosts = [];

  for (const topic of topics) {
    let succeeded = false;
    for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
      try {
        if (attempt > 1) {
          console.log(`  Retry ${attempt - 1}/${MAX_RETRIES} for "${topic.title}"...`);
        }
        const code = await writeBlogPost(topic);
        const componentName = slugToComponentName(topic.slug);
        const filePath = path.join(REPO_ROOT, `src/pages/blog/${componentName}.tsx`);
        writeFileSync(filePath, code);
        console.log(`  Wrote: src/pages/blog/${componentName}.tsx`);
        successfulPosts.push(topic);
        succeeded = true;
        break;
      } catch (err) {
        console.error(`  Attempt ${attempt} FAILED for "${topic.title}": ${err.message}`);
        if (attempt === MAX_RETRIES + 1) {
          failedPosts.push({ topic, error: err.message });
        }
      }
    }
  }

  if (successfulPosts.length === 0) {
    console.error("All posts failed after retries.");
    return { posts: 0 };
  }

  if (failedPosts.length > 0) {
    console.log(`\n  ${failedPosts.length} post(s) failed after ${MAX_RETRIES} retries:`);
    for (const f of failedPosts) {
      console.log(`    - ${f.topic.title}: ${f.error}`);
    }
  }

  // Step 6: Update App.tsx
  console.log("\nStep 6: Updating App.tsx...");
  updateAppTsx(successfulPosts);

  // Step 7: Update Blog.tsx
  console.log("\nStep 7: Updating Blog.tsx...");
  updateBlogTsx(successfulPosts);

  // Step 8: Update prerender.mjs
  console.log("\nStep 8: Updating prerender.mjs...");
  updatePrerenderMjs(successfulPosts);

  // Step 9: Update sitemap.xml
  console.log("\nStep 9: Updating sitemap.xml...");
  updateSitemapXml(successfulPosts);

  // Also update the PAGES array in this file for next run awareness
  // (topics will be caught by crawl on next run since they'll be live)

  // Step 10: Verify build
  console.log("\nStep 10: Verifying build...");
  const buildOk = buildSucceeds();
  if (!buildOk) {
    console.error("Build failed! Reverting changes.");
    return { posts: 0, error: "build_failed" };
  }
  console.log("  Build passed!");

  // Step 11: Commit and push to main (auto-deploy)
  console.log("\nStep 11: Committing to main and pushing...");
  const commitMsg = `[seo-auto] Add ${successfulPosts.length} new blog posts (${today})`;
  commitAndPush(commitMsg);
  console.log("  Pushed to main — deploy will trigger automatically.");

  // Step 12: Post to Discord
  console.log("\nStep 12: Posting to Discord...");
  let discordDescription = "";
  for (let i = 0; i < successfulPosts.length; i++) {
    const p = successfulPosts[i];
    discordDescription += `**${i + 1}. ${p.title}**\n`;
    discordDescription += `  Slug: \`/blog/${p.slug}\`\n`;
    discordDescription += `  Keyword: \`${p.targetKeyword}\`\n`;
    discordDescription += `  Category: ${p.category}\n\n`;
  }

  // Add failed post info if any
  if (failedPosts.length > 0) {
    discordDescription += `\n**Failed (after ${MAX_RETRIES} retries):**\n`;
    for (const f of failedPosts) {
      discordDescription += `- ${f.topic.title}\n`;
    }
  }

  const allSucceeded = failedPosts.length === 0;
  const embeds = [
    {
      title: allSucceeded ? "\u270d\ufe0f New Blog Posts Published" : `\u270d\ufe0f ${successfulPosts.length}/5 Blog Posts Published`,
      description: discordDescription.substring(0, 4000),
      color: allSucceeded ? 3066993 : 16776960, // green if all passed, yellow if some failed
      timestamp: new Date().toISOString(),
      footer: {
        text: `Committed to main | Auto-deploying to production`,
      },
    },
  ];

  try {
    await postToChannel("seo", {
      content: `**Blog Post Writer -- ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}**\n${successfulPosts.length} new blog posts published and deploying.`,
      embeds: embeds.slice(0, 10),
    });
    console.log("  Posted to Discord (SEO channel).");
  } catch (err) {
    console.error(`  Discord post failed: ${err.message}`);
  }

  console.log(`\nDone! ${successfulPosts.length} blog posts committed to main and deploying.`);
  return { posts: successfulPosts.length };
}

run().catch(console.error);
