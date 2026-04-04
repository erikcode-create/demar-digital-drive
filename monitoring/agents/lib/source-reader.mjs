import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { getAllPages } from "../../seo/lib/pages.mjs";

const __dirname = import.meta.dirname || new URL(".", import.meta.url).pathname;
const REPO_ROOT = join(__dirname, "../../..");

// Map URL paths to source file paths
const PATH_TO_FILE = {
  "/": "src/pages/Index.tsx",
  "/about": "src/pages/AboutPage.tsx",
  "/contact": "src/pages/Contact.tsx",
  "/quote": "src/pages/Quote.tsx",
  "/careers": "src/pages/Careers.tsx",
  "/faq": "src/pages/FAQ.tsx",
  "/privacy": "src/pages/Privacy.tsx",
  "/support": "src/pages/Support.tsx",
  "/blog": "src/pages/Blog.tsx",
};

/**
 * Resolve a URL path to its source TSX file path.
 */
function resolveSourceFile(urlPath) {
  // Direct mapping
  if (PATH_TO_FILE[urlPath]) return PATH_TO_FILE[urlPath];

  // Service pages: /services/dry-van → src/pages/services/DryVan.tsx
  if (urlPath.startsWith("/services/")) {
    const slug = urlPath.replace("/services/", "");
    const name = slug.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join("");
    // Handle special cases
    const nameMap = {
      "3pl": "ThirdPartyLogistics",
    };
    const fileName = nameMap[slug] || name;
    return `src/pages/services/${fileName}.tsx`;
  }

  // Resource pages: /resources/freight-shipping-cost → src/pages/resources/FreightShippingCost.tsx
  if (urlPath.startsWith("/resources/") && urlPath !== "/resources") {
    const slug = urlPath.replace("/resources/", "");
    const name = slug.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join("");
    return `src/pages/resources/${name}.tsx`;
  }

  // Blog pages: /blog/some-slug → src/pages/blog/SomeSlug.tsx
  if (urlPath.startsWith("/blog/")) {
    const slug = urlPath.replace("/blog/", "");
    const name = slug.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join("");
    return `src/pages/blog/${name}.tsx`;
  }

  return null;
}

/**
 * Strip JSX tags and extract visible text content from TSX source.
 */
export function extractText(source) {
  let text = source;

  // Handle BlogPost content={<>...</>} inline prop pattern
  const contentPropMatch = text.match(/content=\{(\s*<>[\s\S]*?<\/>)\s*\}/);
  if (contentPropMatch) {
    // Use the inner fragment content as the primary text source
    text = contentPropMatch[1];
  } else {
    // Handle BlogPost const content = (<>...</>) variable pattern
    // Some files define content as a variable then pass it as content={content}
    const contentVarMatch = text.match(/const\s+content\s*=\s*\(\s*(<>[\s\S]*?<\/>)\s*\)/);
    if (contentVarMatch) {
      text = contentVarMatch[1];
    }
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

  // Remove JSX expressions that aren't text (functions, objects)
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

/**
 * Extract headings from TSX source (h1, h2, h3 text content).
 */
export function extractHeadings(source) {
  const headings = { h1: [], h2: [], h3: [] };

  for (const level of ["h1", "h2", "h3"]) {
    const regex = new RegExp(`<${level}[^>]*>([\\s\\S]*?)</${level}>`, "gi");
    let match;
    while ((match = regex.exec(source)) !== null) {
      // Strip inner JSX tags to get text
      const text = match[1].replace(/<[^>]+>/g, "").replace(/\{[^}]*\}/g, "").replace(/\s+/g, " ").trim();
      if (text) headings[level].push(text);
    }
  }

  // BlogPost component renders the title prop as H1 — use it as fallback if no h1 found
  if (headings.h1.length === 0) {
    // Match title="..." (JSX prop, not metaTitle)
    const titlePropMatch = source.match(/(?<![a-zA-Z])title="([^"]+)"/);
    if (titlePropMatch) headings.h1.push(titlePropMatch[1]);
  }

  return headings;
}

/**
 * Extract internal React Router links from TSX source.
 */
export function extractInternalLinks(source) {
  const links = [];
  // Match <Link to="/path"> patterns
  const regex = /<Link[^>]*to="([^"]+)"[^>]*>([\s\S]*?)<\/Link>/gi;
  let match;
  while ((match = regex.exec(source)) !== null) {
    const to = match[1];
    const text = match[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (to.startsWith("/")) {
      links.push({ to, text });
    }
  }

  // Also match <a href="/path"> for internal links
  const aRegex = /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  while ((match = aRegex.exec(source)) !== null) {
    const href = match[1];
    const text = match[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (href.startsWith("/")) {
      links.push({ to: href, text });
    }
  }

  return links;
}

/**
 * Extract meta title from useEffect or Helmet patterns.
 */
export function extractMetaTitle(source) {
  // Pattern: document.title = "..."
  const titleMatch = source.match(/document\.title\s*=\s*["'`]([^"'`]+)["'`]/);
  if (titleMatch) return titleMatch[1];

  // Pattern: metaTitle="..." JSX prop (BlogPost component)
  const metaJsxMatch = source.match(/metaTitle="([^"]+)"/);
  if (metaJsxMatch) return metaJsxMatch[1];

  // Pattern: metaTitle: "..." (object/colon syntax)
  const metaMatch = source.match(/metaTitle:\s*["'`]([^"'`]+)["'`]/);
  if (metaMatch) return metaMatch[1];

  // Pattern: title prop passed to component
  const propMatch = source.match(/title=["'`]([^"'`]+)["'`]/);
  if (propMatch) return propMatch[1];

  return null;
}

/**
 * Extract meta description from source.
 */
export function extractMetaDescription(source) {
  // Pattern: meta.setAttribute("content", "...") — value may span multiple lines
  const setAttrMatch = source.match(/setAttribute\(\s*["']content["']\s*,\s*["'`]([\s\S]+?)["'`]\s*\)/);
  if (setAttrMatch) return setAttrMatch[1].replace(/\s+/g, " ").trim();

  // Pattern: metaDescription="..." JSX prop (BlogPost component)
  const metaJsxMatch = source.match(/metaDescription="([^"]+)"/);
  if (metaJsxMatch) return metaJsxMatch[1];

  // Pattern: metaDescription: "..." (object/colon syntax)
  const metaMatch = source.match(/metaDescription:\s*["'`]([^"'`]+)["'`]/);
  if (metaMatch) return metaMatch[1];

  // Pattern: description="..." JSX prop (BlogPost component uses description for subtitle/summary)
  const descJsxMatch = source.match(/description="([^"]+)"/);
  if (descJsxMatch) return descJsxMatch[1];

  // Pattern: description= prop (colon syntax)
  const propMatch = source.match(/description=["'`]([^"'`]+)["'`]/);
  if (propMatch) return propMatch[1];

  return null;
}

/**
 * Extract image references from source.
 */
export function extractImages(source) {
  const images = [];
  // Match the entire <img ...> or <img ... /> tag, then extract src and alt separately
  const tagRegex = /<img\b([^>]*?)(?:\/>|>)/gi;
  let match;
  while ((match = tagRegex.exec(source)) !== null) {
    const attrs = match[1];
    const srcMatch = attrs.match(/src=["']([^"']+)["']/);
    const altMatch = attrs.match(/alt=["']([^"']*)["']/);
    if (srcMatch) {
      images.push({ src: srcMatch[1], alt: altMatch ? altMatch[1] : "" });
    }
  }

  // Also check JSX src={...} patterns
  const jsxRegex = /src=\{["']([^"']+)["']\}/g;
  while ((match = jsxRegex.exec(source)) !== null) {
    images.push({ src: match[1], alt: "" });
  }

  return images;
}

/**
 * Get last modified date for a file from git log.
 */
function getLastModified(filePath) {
  try {
    const result = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      cwd: REPO_ROOT,
      encoding: "utf-8",
      timeout: 5000,
    }).trim();
    return result || null;
  } catch {
    return null;
  }
}

/**
 * Read and parse a single page by its URL path.
 * Returns structured page data without making any HTTP requests.
 */
export function readPage(urlPath) {
  const sourceFile = resolveSourceFile(urlPath);
  if (!sourceFile) return null;

  const fullPath = join(REPO_ROOT, sourceFile);
  if (!existsSync(fullPath)) return null;

  const source = readFileSync(fullPath, "utf-8");
  const textContent = extractText(source);

  return {
    path: urlPath,
    sourceFile,
    textContent,
    headings: extractHeadings(source),
    internalLinks: extractInternalLinks(source),
    metaTitle: extractMetaTitle(source),
    metaDescription: extractMetaDescription(source),
    images: extractImages(source),
    wordCount: textContent.split(/\s+/).filter(Boolean).length,
    lastModified: getLastModified(sourceFile),
    rawSource: source,
  };
}

/**
 * Read all pages on the site. Returns array of page data objects.
 */
export function readAllPages() {
  const pages = getAllPages();
  const results = [];

  for (const page of pages) {
    const data = readPage(page.path);
    if (data) {
      results.push({ ...page, ...data });
    }
  }

  return results;
}

/**
 * Read pages of a specific type (core, service, resource, blog).
 */
export function readPagesByType(type) {
  const pages = getAllPages().filter(p => p.type === type);
  const results = [];

  for (const page of pages) {
    const data = readPage(page.path);
    if (data) {
      results.push({ ...page, ...data });
    }
  }

  return results;
}
