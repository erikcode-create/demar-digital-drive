import { describe, it, expect } from "vitest";
import { getAllPages, SITE_URL, toKebabCase } from "../../monitoring/seo/lib/pages.mjs";

describe("SITE_URL", () => {
  it("equals the production URL", () => {
    expect(SITE_URL).toBe("https://demartransportation.com");
  });
});

describe("toKebabCase", () => {
  it("converts PascalCase to kebab-case", () => {
    expect(toKebabCase("SmallBusinessFreightShipping")).toBe(
      "small-business-freight-shipping"
    );
  });

  it("converts camelCase to kebab-case", () => {
    expect(toKebabCase("dryVanShipping")).toBe("dry-van-shipping");
  });

  it("handles letter-to-digit boundaries", () => {
    expect(toKebabCase("BrokerVsCarrierVs3pl")).toBe(
      "broker-vs-carrier-vs-3pl"
    );
  });

  it("handles single word", () => {
    expect(toKebabCase("Flatbed")).toBe("flatbed");
  });

  it("handles already-lowercase input", () => {
    expect(toKebabCase("homepage")).toBe("homepage");
  });

  it("handles FtlVsLtl style names", () => {
    expect(toKebabCase("FtlVsLtl")).toBe("ftl-vs-ltl");
  });
});

describe("getAllPages", () => {
  let pages: ReturnType<typeof getAllPages>;

  beforeAll(() => {
    pages = getAllPages();
  });

  it("returns an array", () => {
    expect(Array.isArray(pages)).toBe(true);
  });

  it("returns at least one page", () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  it("every page has required fields: path, name, type, url", () => {
    for (const page of pages) {
      expect(page).toHaveProperty("path");
      expect(page).toHaveProperty("name");
      expect(page).toHaveProperty("type");
      expect(page).toHaveProperty("url");
    }
  });

  it("every URL starts with https://demartransportation.com", () => {
    for (const page of pages) {
      expect(page.url).toMatch(/^https:\/\/demartransportation\.com/);
    }
  });

  it("every URL equals SITE_URL + path", () => {
    for (const page of pages) {
      expect(page.url).toBe(`${SITE_URL}${page.path}`);
    }
  });

  // Core pages
  it("includes the home page /", () => {
    expect(pages.some((p) => p.path === "/")).toBe(true);
  });

  it("includes /about", () => {
    expect(pages.some((p) => p.path === "/about")).toBe(true);
  });

  it("includes /contact", () => {
    expect(pages.some((p) => p.path === "/contact")).toBe(true);
  });

  it("includes /quote", () => {
    expect(pages.some((p) => p.path === "/quote")).toBe(true);
  });

  it("includes /careers", () => {
    expect(pages.some((p) => p.path === "/careers")).toBe(true);
  });

  // Service pages
  it("includes /services/dry-van", () => {
    expect(pages.some((p) => p.path === "/services/dry-van")).toBe(true);
  });

  it("includes /services/reefer", () => {
    expect(pages.some((p) => p.path === "/services/reefer")).toBe(true);
  });

  it("includes /services/flatbed", () => {
    expect(pages.some((p) => p.path === "/services/flatbed")).toBe(true);
  });

  // Blog auto-discovery
  it("includes at least one page with type === 'blog'", () => {
    expect(pages.some((p) => p.type === "blog")).toBe(true);
  });

  it("auto-discovers blog posts (more than just the /blog index)", () => {
    const blogPages = pages.filter((p) => p.type === "blog");
    expect(blogPages.length).toBeGreaterThan(1);
  });

  it("auto-discovered blog posts have /blog/ prefix", () => {
    const blogPosts = pages.filter(
      (p) => p.type === "blog" && p.path !== "/blog"
    );
    for (const post of blogPosts) {
      expect(post.path).toMatch(/^\/blog\//);
    }
  });

  // Resource auto-discovery
  it("includes at least one page with type === 'resource'", () => {
    expect(pages.some((p) => p.type === "resource")).toBe(true);
  });

  it("auto-discovers resource pages (more than just the /resources index)", () => {
    const resourcePages = pages.filter((p) => p.type === "resource");
    expect(resourcePages.length).toBeGreaterThan(1);
  });

  it("auto-discovered resource pages have /resources/ prefix", () => {
    const resourcePages = pages.filter(
      (p) => p.type === "resource" && p.path !== "/resources"
    );
    for (const page of resourcePages) {
      expect(page.path).toMatch(/^\/resources\//);
    }
  });
});
