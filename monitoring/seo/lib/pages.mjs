import "dotenv/config";
import { readdirSync } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";

export const SITE_URL = "https://demartransportation.com";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "../../..");

/**
 * Convert a PascalCase filename (without extension) to a kebab-case slug.
 * e.g. SmallBusinessFreightShipping -> small-business-freight-shipping
 */
export function toKebabCase(name) {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2")   // camelCase boundary: lower->upper
    .replace(/([a-zA-Z])(\d)/g, "$1-$2")    // letter->digit boundary (e.g. Vs3pl -> vs-3pl)
    .toLowerCase();
}

/**
 * Convert a kebab-case slug to a Title Case readable name.
 * e.g. small-business-freight-shipping -> Small Business Freight Shipping
 */
function toReadableName(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Auto-discover blog post pages from src/pages/blog/*.tsx
 */
function discoverBlogPosts() {
  const blogDir = join(REPO_ROOT, "src/pages/blog");
  try {
    return readdirSync(blogDir)
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => {
        const slug = toKebabCase(basename(file, ".tsx"));
        return {
          path: `/blog/${slug}`,
          name: toReadableName(slug),
          type: "blog",
        };
      })
      .sort((a, b) => a.path.localeCompare(b.path));
  } catch (err) {
    console.warn(`[pages.mjs] Could not read blog dir: ${err.message}`);
    return [];
  }
}

/**
 * Auto-discover resource pages from src/pages/resources/*.tsx
 */
function discoverResourcePages() {
  const resourcesDir = join(REPO_ROOT, "src/pages/resources");
  try {
    return readdirSync(resourcesDir)
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => {
        const slug = toKebabCase(basename(file, ".tsx"));
        return {
          path: `/resources/${slug}`,
          name: toReadableName(slug),
          type: "resource",
        };
      })
      .sort((a, b) => a.path.localeCompare(b.path));
  } catch (err) {
    console.warn(`[pages.mjs] Could not read resources dir: ${err.message}`);
    return [];
  }
}

const PAGES = [
  // Core
  { path: "/", name: "Home", type: "core" },
  { path: "/about", name: "About", type: "core" },
  { path: "/contact", name: "Contact", type: "core" },
  { path: "/quote", name: "Get a Quote", type: "core" },
  { path: "/careers", name: "Careers", type: "core" },
  { path: "/faq", name: "FAQ", type: "core" },
  { path: "/privacy", name: "Privacy Policy", type: "core" },
  { path: "/support", name: "Support", type: "core" },

  // Services (keep hardcoded - stable, special slug mappings like 3pl->ThirdPartyLogistics)
  { path: "/services/dry-van", name: "Dry Van", type: "service" },
  { path: "/services/reefer", name: "Reefer", type: "service" },
  { path: "/services/flatbed", name: "Flatbed", type: "service" },
  { path: "/services/box-truck", name: "Box Truck", type: "service" },
  { path: "/services/sprinter-van", name: "Sprinter Van", type: "service" },
  { path: "/services/hazmat", name: "Hazmat", type: "service" },
  { path: "/services/ftl", name: "Full Truckload", type: "service" },
  { path: "/services/ltl", name: "Less Than Truckload", type: "service" },
  { path: "/services/3pl", name: "3PL", type: "service" },
  { path: "/services/warehousing", name: "Warehousing", type: "service" },

  // Resources index + auto-discovered resource pages
  { path: "/resources", name: "Resources", type: "resource" },
  ...discoverResourcePages(),

  // Blog index + auto-discovered blog posts
  { path: "/blog", name: "Blog", type: "blog" },
  ...discoverBlogPosts(),
];

/**
 * Returns all pages on the site with their path, name, type, and full URL.
 * @returns {Array<{ path: string, name: string, type: string, url: string }>}
 */
export function getAllPages() {
  return PAGES.map((page) => ({
    ...page,
    url: `${SITE_URL}${page.path}`,
  }));
}
