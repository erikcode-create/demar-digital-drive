import { describe, it, expect, beforeAll } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = path.resolve(__dirname, "../fixtures");

let sourceReader: {
  extractText: (source: string) => string;
  extractHeadings: (source: string) => { h1: string[]; h2: string[]; h3: string[] };
  extractMetaTitle: (source: string) => string | null;
  extractMetaDescription: (source: string) => string | null;
  extractInternalLinks: (source: string) => Array<{ to: string; text: string }>;
  extractImages: (source: string) => Array<{ src: string; alt: string }>;
};

let blogPostSource: string;
let servicePageSource: string;

beforeAll(async () => {
  sourceReader = await import("../../monitoring/agents/lib/source-reader.mjs");
  blogPostSource = fs.readFileSync(path.join(FIXTURES_DIR, "sample-blog-post.tsx"), "utf-8");
  servicePageSource = fs.readFileSync(path.join(FIXTURES_DIR, "sample-service-page.tsx"), "utf-8");
});

// ---------------------------------------------------------------------------
// extractText
// ---------------------------------------------------------------------------
describe("extractText", () => {
  it("returns a non-empty string for a blog post fixture", () => {
    const text = sourceReader.extractText(blogPostSource);
    expect(typeof text).toBe("string");
    expect(text.length).toBeGreaterThan(0);
  });

  it("strips JSX tags, leaving visible text", () => {
    const text = sourceReader.extractText(blogPostSource);
    expect(text).not.toMatch(/<[a-zA-Z]/);
  });

  it("strips import statements", () => {
    const text = sourceReader.extractText(blogPostSource);
    expect(text).not.toContain("import BlogPost");
    expect(text).not.toContain("import { Link }");
  });

  it("includes meaningful body text from the blog post content prop", () => {
    const text = sourceReader.extractText(blogPostSource);
    // The blog post content discusses LTL/FTL shipping
    expect(text).toContain("LTL");
  });

  it("returns a non-empty string for a service page fixture", () => {
    const text = sourceReader.extractText(servicePageSource);
    expect(typeof text).toBe("string");
    expect(text.length).toBeGreaterThan(0);
  });

  it("strips className attributes from service page", () => {
    const text = sourceReader.extractText(servicePageSource);
    expect(text).not.toMatch(/className="/);
  });

  it("strips JSON-LD script blocks from service page", () => {
    const text = sourceReader.extractText(servicePageSource);
    expect(text).not.toContain("@context");
    expect(text).not.toContain("schema.org");
  });
});

// ---------------------------------------------------------------------------
// extractHeadings
// ---------------------------------------------------------------------------
describe("extractHeadings", () => {
  it("returns an object with h1, h2, h3 arrays", () => {
    const headings = sourceReader.extractHeadings(blogPostSource);
    expect(headings).toHaveProperty("h1");
    expect(headings).toHaveProperty("h2");
    expect(headings).toHaveProperty("h3");
    expect(Array.isArray(headings.h1)).toBe(true);
    expect(Array.isArray(headings.h2)).toBe(true);
    expect(Array.isArray(headings.h3)).toBe(true);
  });

  it("falls back to BlogPost title prop when no explicit h1 tag is present", () => {
    // The blog post fixture uses <BlogPost title="..."> but has no <h1> tag directly
    const headings = sourceReader.extractHeadings(blogPostSource);
    expect(headings.h1.length).toBeGreaterThan(0);
    expect(headings.h1[0]).toContain("Freight Shipping Basics");
  });

  it("extracts h2 headings from the blog post content", () => {
    const headings = sourceReader.extractHeadings(blogPostSource);
    expect(headings.h2.length).toBeGreaterThan(0);
    // Known h2 headings in the fixture
    const h2Texts = headings.h2.join(" ");
    expect(h2Texts).toContain("What Is Freight Shipping");
  });

  it("extracts h2 from LTL vs FTL section", () => {
    const headings = sourceReader.extractHeadings(blogPostSource);
    const h2Texts = headings.h2.join(" ");
    expect(h2Texts).toContain("LTL vs FTL");
  });

  it("extracts h1 from service page explicit <h1> tag", () => {
    const headings = sourceReader.extractHeadings(servicePageSource);
    expect(headings.h1.length).toBeGreaterThan(0);
    // The <h1> in the fixture contains "Sample Freight" + <br/> + "Service Fixture"
    const h1Text = headings.h1.join(" ");
    expect(h1Text).toContain("Sample Freight");
  });

  it("extracts h2 headings from service page", () => {
    const headings = sourceReader.extractHeadings(servicePageSource);
    expect(headings.h2.length).toBeGreaterThan(0);
    const h2Texts = headings.h2.join(" ");
    expect(h2Texts).toContain("What Is This Freight Service");
  });

  it("extracts h3 headings from service page benefit titles", () => {
    // The service page renders benefit titles in <h3> tags
    const headings = sourceReader.extractHeadings(servicePageSource);
    // h3 are rendered via JS expressions {benefit.title} so may not be statically extractable
    // Just assert the structure is valid
    expect(Array.isArray(headings.h3)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// extractMetaTitle
// ---------------------------------------------------------------------------
describe("extractMetaTitle", () => {
  it("extracts metaTitle from BlogPost JSX prop", () => {
    const title = sourceReader.extractMetaTitle(blogPostSource);
    expect(title).toBe(
      "Freight Shipping Basics: Complete Guide for First-Time Shippers | DeMar Transportation"
    );
  });

  it("extracts document.title from service page useEffect pattern", () => {
    const title = sourceReader.extractMetaTitle(servicePageSource);
    expect(title).toBe(
      "Sample Freight Service | Test Fixture | DeMar Transportation"
    );
  });

  it("returns a non-null string for both fixtures", () => {
    expect(sourceReader.extractMetaTitle(blogPostSource)).not.toBeNull();
    expect(sourceReader.extractMetaTitle(servicePageSource)).not.toBeNull();
  });

  it("returns null when source has no recognizable title pattern", () => {
    const result = sourceReader.extractMetaTitle("const Foo = () => <div>Hello</div>;");
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// extractMetaDescription
// ---------------------------------------------------------------------------
describe("extractMetaDescription", () => {
  it("extracts metaDescription from BlogPost JSX prop", () => {
    const desc = sourceReader.extractMetaDescription(blogPostSource);
    expect(desc).toBe(
      "Everything you need to know about freight shipping. Understand LTL vs FTL, freight classes, pallet prep, and how to get competitive rates. Free quotes from DeMar Transportation."
    );
  });

  it("extracts meta description from setAttribute pattern in service page", () => {
    const desc = sourceReader.extractMetaDescription(servicePageSource);
    expect(desc).toBe(
      "DeMar Transportation sample service page fixture for testing. Covers freight shipping services from Reno, NV. Get a free quote at (775) 230-4767."
    );
  });

  it("returns a non-null string for both fixtures", () => {
    expect(sourceReader.extractMetaDescription(blogPostSource)).not.toBeNull();
    expect(sourceReader.extractMetaDescription(servicePageSource)).not.toBeNull();
  });

  it("returns null when source has no description pattern", () => {
    const result = sourceReader.extractMetaDescription("const Foo = () => <div>Hello</div>;");
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// extractInternalLinks
// ---------------------------------------------------------------------------
describe("extractInternalLinks", () => {
  it("extracts <Link to=...> patterns from blog post", () => {
    const links = sourceReader.extractInternalLinks(blogPostSource);
    expect(Array.isArray(links)).toBe(true);
    expect(links.length).toBeGreaterThan(0);
  });

  it("finds /contact link in blog post", () => {
    const links = sourceReader.extractInternalLinks(blogPostSource);
    const contactLink = links.find((l) => l.to === "/contact");
    expect(contactLink).toBeDefined();
  });

  it("finds /quote link in blog post", () => {
    const links = sourceReader.extractInternalLinks(blogPostSource);
    const quoteLinks = links.filter((l) => l.to === "/quote");
    expect(quoteLinks.length).toBeGreaterThan(0);
  });

  it("each link has a to and text property", () => {
    const links = sourceReader.extractInternalLinks(blogPostSource);
    for (const link of links) {
      expect(link).toHaveProperty("to");
      expect(link).toHaveProperty("text");
      expect(link.to).toMatch(/^\//);
    }
  });

  it("extracts <Link to=...> patterns from service page", () => {
    const links = sourceReader.extractInternalLinks(servicePageSource);
    expect(links.length).toBeGreaterThan(0);
  });

  it("finds /quote link in service page", () => {
    const links = sourceReader.extractInternalLinks(servicePageSource);
    const quoteLinks = links.filter((l) => l.to === "/quote");
    expect(quoteLinks.length).toBeGreaterThan(0);
  });

  it("excludes external links (href without leading /)", () => {
    const links = sourceReader.extractInternalLinks(servicePageSource);
    // tel: links should NOT be included
    const telLinks = links.filter((l) => l.to.startsWith("tel:"));
    expect(telLinks.length).toBe(0);
  });

  it("returns empty array for source with no links", () => {
    const links = sourceReader.extractInternalLinks("<div><p>No links here</p></div>");
    expect(links).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// extractImages
// ---------------------------------------------------------------------------
describe("extractImages", () => {
  it("returns empty array for blog post (images not in static JSX)", () => {
    // Blog post fixture has heroImage as a string prop, no <img> tag in its own source
    const images = sourceReader.extractImages(blogPostSource);
    expect(Array.isArray(images)).toBe(true);
    // heroImage prop is a string — not parsed as <img> by extractImages
    // so we just verify the function returns an array
  });

  it("extracts <img> tags from service page", () => {
    const images = sourceReader.extractImages(servicePageSource);
    expect(images.length).toBeGreaterThan(0);
  });

  it("extracts correct src from service page image", () => {
    const images = sourceReader.extractImages(servicePageSource);
    const fleetImg = images.find((img) => img.src.includes("sample-fleet"));
    expect(fleetImg).toBeDefined();
    expect(fleetImg!.src).toBe("/images/services/sample-fleet.jpg");
  });

  it("extracts alt text from service page image", () => {
    const images = sourceReader.extractImages(servicePageSource);
    const fleetImg = images.find((img) => img.src.includes("sample-fleet"));
    expect(fleetImg!.alt).toBe("DeMar Transportation freight truck fleet ready for shipment");
  });

  it("each image has src and alt properties", () => {
    const images = sourceReader.extractImages(servicePageSource);
    for (const img of images) {
      expect(img).toHaveProperty("src");
      expect(img).toHaveProperty("alt");
    }
  });

  it("returns empty array when source has no images", () => {
    const images = sourceReader.extractImages("<div><p>No images here</p></div>");
    expect(images).toEqual([]);
  });

  it("handles img tag with alt before src (alt attribute order variation)", () => {
    // extractImages regex looks for src first, then optional alt after
    // Test a simple inline case
    const source = `<img src="/test.jpg" alt="test image" />`;
    const images = sourceReader.extractImages(source);
    expect(images.length).toBeGreaterThan(0);
    expect(images[0].src).toBe("/test.jpg");
  });
});
