import { describe, it, expect, beforeAll } from "vitest";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ValidationResult {
  passed: boolean;
  errors: string[];
}

type ValidateContent = (code: string, metadata?: Record<string, string>) => ValidationResult;

// ---------------------------------------------------------------------------
// Module under test
// ---------------------------------------------------------------------------

let validateContent: ValidateContent;

beforeAll(async () => {
  const mod = await import(
    "../../monitoring/agents/lib/validators/content-validator.mjs"
  );
  validateContent = mod.validateContent;
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a minimal valid TSX blog post with the given content block and word
 * count.  `contentBody` is raw JSX that will be placed inside the
 * `const content = (<>...</>)` expression.
 */
function buildPost({
  contentBody = "",
  importBlogPost = true,
  exportDefault = true,
  extraWords = 0,
}: {
  contentBody?: string;
  importBlogPost?: boolean;
  exportDefault?: boolean;
  extraWords?: number;
} = {}): string {
  // Fill up to 1500+ words worth of prose so word-count check passes by default
  const filler = Array.from(
    { length: extraWords },
    (_, i) => `word${i}`
  ).join(" ");

  // Build a ~1600-word paragraph baseline when no extra words needed and no
  // custom body — ensures the default helper already passes word count.
  const prose =
    contentBody ||
    [
      "<p>",
      Array.from({ length: 1600 }, () => "freight").join(" "),
      "</p>",
      "<h2>Section One</h2>",
      "<p>More content about freight shipping logistics.</p>",
      "<h2>Section Two</h2>",
      "<p>Additional content about shipping and transportation services.</p>",
      filler ? `<p>${filler}</p>` : "",
    ].join("\n");

  const importLine = importBlogPost ? 'import BlogPost from "@/components/BlogPost";' : "";
  const exportLine = exportDefault ? "export default FreightPost;" : "";

  return `${importLine}
import { Link } from "react-router-dom";

const FreightPost = () => {
  const content = (
    <>
      ${prose}
    </>
  );

  return (
    <BlogPost
      title="Freight Shipping Guide"
      content={content}
    />
  );
};

${exportLine}`;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("content-validator: validateContent()", () => {
  // -------------------------------------------------------------------------
  // Return shape
  // -------------------------------------------------------------------------

  describe("return value shape", () => {
    it("returns an object with passed (boolean) and errors (array)", () => {
      const result = validateContent(buildPost());
      expect(result).toHaveProperty("passed");
      expect(result).toHaveProperty("errors");
      expect(typeof result.passed).toBe("boolean");
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it("passes a valid post with no errors", () => {
      const result = validateContent(buildPost());
      expect(result.passed).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  // -------------------------------------------------------------------------
  // Word count
  // -------------------------------------------------------------------------

  describe("word count >= 1500", () => {
    it("fails when content has fewer than 1500 words", () => {
      const shortBody =
        "<h2>Short Post</h2><p>" +
        Array.from({ length: 200 }, () => "word").join(" ") +
        "</p><h2>Second Heading</h2><p>end content</p>";
      const result = validateContent(buildPost({ contentBody: shortBody }));
      expect(result.passed).toBe(false);
      expect(result.errors.some((e) => /word count/i.test(e))).toBe(true);
    });

    it("passes when content has exactly 1500 words", () => {
      const body =
        "<h2>Section One</h2><p>" +
        Array.from({ length: 1493 }, () => "freight").join(" ") +
        "</p><h2>Section Two</h2><p>end of content here</p>";
      const result = validateContent(buildPost({ contentBody: body }));
      // Should not fail on word count (may fail on other checks - we just test
      // the count-specific error is absent)
      const wordCountError = result.errors.find((e) => /word count/i.test(e));
      expect(wordCountError).toBeUndefined();
    });

    it("passes the default valid post (1500+ words)", () => {
      const result = validateContent(buildPost());
      const wordCountError = result.errors.find((e) => /word count/i.test(e));
      expect(wordCountError).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // Structural checks
  // -------------------------------------------------------------------------

  describe("import BlogPost statement", () => {
    it("fails when import BlogPost is missing", () => {
      const result = validateContent(buildPost({ importBlogPost: false }));
      expect(result.passed).toBe(false);
      expect(result.errors.some((e) => /import BlogPost/i.test(e))).toBe(true);
    });

    it("passes when import BlogPost is present", () => {
      const result = validateContent(buildPost({ importBlogPost: true }));
      const err = result.errors.find((e) => /import BlogPost/i.test(e));
      expect(err).toBeUndefined();
    });
  });

  describe("export default statement", () => {
    it("fails when export default is missing", () => {
      const result = validateContent(buildPost({ exportDefault: false }));
      expect(result.passed).toBe(false);
      expect(result.errors.some((e) => /export default/i.test(e))).toBe(true);
    });

    it("passes when export default is present", () => {
      const result = validateContent(buildPost({ exportDefault: true }));
      const err = result.errors.find((e) => /export default/i.test(e));
      expect(err).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // Placeholder text
  // -------------------------------------------------------------------------

  describe("placeholder text detection", () => {
    const placeholders = [
      "Lorem ipsum",
      "[INSERT",
      "[TODO",
      "[PLACEHOLDER",
      "TBD",
    ];

    for (const placeholder of placeholders) {
      it(`fails when content contains "${placeholder}"`, () => {
        const body = `<h2>Section</h2><p>${placeholder} some content here</p><h2>Two</h2><p>${Array(100).fill("word").join(" ")}</p>`;
        const result = validateContent(buildPost({ contentBody: body }));
        expect(result.passed).toBe(false);
        expect(
          result.errors.some((e) => /placeholder/i.test(e))
        ).toBe(true);
      });
    }

    it("passes when no placeholder text is present", () => {
      const result = validateContent(buildPost());
      const err = result.errors.find((e) => /placeholder/i.test(e));
      expect(err).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // Competitor brand names
  // -------------------------------------------------------------------------

  describe("competitor brand name blocklist", () => {
    const competitors = [
      "XPO Logistics",
      "J.B. Hunt",
      "Werner Enterprises",
      "Schneider National",
      "Knight-Swift",
    ];

    for (const brand of competitors) {
      it(`fails when content mentions "${brand}"`, () => {
        const body = `<h2>Section One</h2><p>We are better than ${brand} for your shipping needs.</p><h2>Section Two</h2><p>${Array(100).fill("freight").join(" ")}</p>`;
        const result = validateContent(buildPost({ contentBody: body }));
        expect(result.passed).toBe(false);
        expect(
          result.errors.some((e) => /competitor/i.test(e))
        ).toBe(true);
      });
    }

    it("passes when no competitor brands are mentioned", () => {
      const result = validateContent(buildPost());
      const err = result.errors.find((e) => /competitor/i.test(e));
      expect(err).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // Em dashes
  // -------------------------------------------------------------------------

  describe("em dash prohibition", () => {
    it("fails when an em dash is present in the content", () => {
      const body = `<h2>Section One</h2><p>This is a sentence\u2014with an em dash\u2014in it. ${Array(50).fill("freight").join(" ")}</p><h2>Section Two</h2><p>more content</p>`;
      const result = validateContent(buildPost({ contentBody: body }));
      expect(result.passed).toBe(false);
      expect(
        result.errors.some((e) => /em dash/i.test(e))
      ).toBe(true);
    });

    it("passes when no em dashes are present", () => {
      const result = validateContent(buildPost());
      const err = result.errors.find((e) => /em dash/i.test(e));
      expect(err).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // Exclamation marks
  // -------------------------------------------------------------------------

  describe("exclamation mark prohibition", () => {
    it("fails when an exclamation mark appears in text content", () => {
      const body = `<h2>Section One</h2><p>We ship fast! Call us now! ${Array(50).fill("freight").join(" ")}</p><h2>Section Two</h2><p>more content</p>`;
      const result = validateContent(buildPost({ contentBody: body }));
      expect(result.passed).toBe(false);
      expect(
        result.errors.some((e) => /exclamation/i.test(e))
      ).toBe(true);
    });

    it("passes when no exclamation marks are present", () => {
      const result = validateContent(buildPost());
      const err = result.errors.find((e) => /exclamation/i.test(e));
      expect(err).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // Phone number validation
  // -------------------------------------------------------------------------

  describe("phone number validation", () => {
    it("passes when the correct phone number is present", () => {
      const body = `<h2>Section One</h2><p>Call us at (775) 230-4767 to get a quote. ${Array(50).fill("freight").join(" ")}</p><h2>Section Two</h2><p>more content</p>`;
      const result = validateContent(buildPost({ contentBody: body }));
      const err = result.errors.find((e) => /phone/i.test(e));
      expect(err).toBeUndefined();
    });

    it("passes when no phone number appears in the content", () => {
      const result = validateContent(buildPost());
      const err = result.errors.find((e) => /phone/i.test(e));
      expect(err).toBeUndefined();
    });

    it("fails when a wrong phone number appears", () => {
      const body = `<h2>Section One</h2><p>Call us at (800) 555-1234 for a quote. ${Array(50).fill("freight").join(" ")}</p><h2>Section Two</h2><p>more content</p>`;
      const result = validateContent(buildPost({ contentBody: body }));
      expect(result.passed).toBe(false);
      expect(
        result.errors.some((e) => /phone/i.test(e))
      ).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // Email validation
  // -------------------------------------------------------------------------

  describe("email validation", () => {
    it("passes when the correct email is present", () => {
      const body = `<h2>Section One</h2><p>Contact us at info@DeMarTransportation.com for more info. ${Array(50).fill("freight").join(" ")}</p><h2>Section Two</h2><p>more</p>`;
      const result = validateContent(buildPost({ contentBody: body }));
      const err = result.errors.find((e) => /email/i.test(e));
      expect(err).toBeUndefined();
    });

    it("passes when no email appears in the content", () => {
      const result = validateContent(buildPost());
      const err = result.errors.find((e) => /email/i.test(e));
      expect(err).toBeUndefined();
    });

    it("fails when a wrong email appears", () => {
      const body = `<h2>Section One</h2><p>Email us at contact@wrongdomain.com today. ${Array(50).fill("freight").join(" ")}</p><h2>Section Two</h2><p>more</p>`;
      const result = validateContent(buildPost({ contentBody: body }));
      expect(result.passed).toBe(false);
      expect(
        result.errors.some((e) => /email/i.test(e))
      ).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // H2 heading count
  // -------------------------------------------------------------------------

  describe("H2 heading count >= 2", () => {
    it("fails when there are fewer than 2 H2 headings", () => {
      const body = `<h2>Only Section</h2><p>${Array(1600).fill("freight").join(" ")}</p>`;
      const result = validateContent(buildPost({ contentBody: body }));
      expect(result.passed).toBe(false);
      expect(
        result.errors.some((e) => /h2|heading/i.test(e))
      ).toBe(true);
    });

    it("fails when there are zero H2 headings", () => {
      const body = `<p>${Array(1600).fill("freight").join(" ")}</p>`;
      const result = validateContent(buildPost({ contentBody: body }));
      expect(result.passed).toBe(false);
      expect(
        result.errors.some((e) => /h2|heading/i.test(e))
      ).toBe(true);
    });

    it("passes when there are exactly 2 H2 headings", () => {
      const body = `<h2>Section One</h2><p>${Array(800).fill("freight").join(" ")}</p><h2>Section Two</h2><p>${Array(800).fill("shipping").join(" ")}</p>`;
      const result = validateContent(buildPost({ contentBody: body }));
      const err = result.errors.find((e) => /h2|heading/i.test(e));
      expect(err).toBeUndefined();
    });

    it("passes when there are more than 2 H2 headings", () => {
      const result = validateContent(buildPost());
      const err = result.errors.find((e) => /h2|heading/i.test(e));
      expect(err).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // Target keyword
  // -------------------------------------------------------------------------

  describe("target keyword presence", () => {
    it("passes when no targetKeyword is provided in metadata", () => {
      const result = validateContent(buildPost(), {});
      const err = result.errors.find((e) => /keyword/i.test(e));
      expect(err).toBeUndefined();
    });

    it("passes when targetKeyword is present in the content", () => {
      const keyword = "freight shipping rates";
      const body = `<h2>Section One: freight shipping rates guide</h2><p>Learn about freight shipping rates for your business. ${Array(50).fill("freight").join(" ")}</p><h2>Section Two</h2><p>more info</p>`;
      const result = validateContent(buildPost({ contentBody: body }), {
        targetKeyword: keyword,
      });
      const err = result.errors.find((e) => /keyword/i.test(e));
      expect(err).toBeUndefined();
    });

    it("fails when targetKeyword is absent from the content", () => {
      const result = validateContent(buildPost(), {
        targetKeyword: "this-keyword-is-definitely-not-in-the-post",
      });
      expect(result.passed).toBe(false);
      expect(
        result.errors.some((e) => /keyword/i.test(e))
      ).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // Internal links
  // -------------------------------------------------------------------------

  describe("internal links must start with /", () => {
    it("passes when all Link `to` props start with /", () => {
      const body = `<h2>Section One</h2><p>See our <Link to="/services/ltl">LTL services</Link> page. ${Array(50).fill("freight").join(" ")}</p><h2>Section Two</h2><p>more content</p>`;
      const result = validateContent(buildPost({ contentBody: body }));
      const err = result.errors.find((e) => /internal link/i.test(e));
      expect(err).toBeUndefined();
    });

    it("fails when a Link `to` prop does not start with /", () => {
      const body = `<h2>Section One</h2><p>See our <Link to="https://external.com/page">external link</Link> and <Link to="relative-path">relative</Link> here. ${Array(50).fill("freight").join(" ")}</p><h2>Section Two</h2><p>more</p>`;
      const result = validateContent(buildPost({ contentBody: body }));
      expect(result.passed).toBe(false);
      expect(
        result.errors.some((e) => /internal link/i.test(e))
      ).toBe(true);
    });

    it("passes when no internal links are present", () => {
      const result = validateContent(buildPost());
      const err = result.errors.find((e) => /internal link/i.test(e));
      expect(err).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // Multiple violations produce multiple errors
  // -------------------------------------------------------------------------

  describe("multiple violations", () => {
    it("reports all violations at once", () => {
      // Missing import, missing export, has em dash and exclamation
      const code = `import { Link } from "react-router-dom";

const Bad = () => {
  const content = (
    <>
      <h2>Only One Heading</h2>
      <p>Short text\u2014bad! Lorem ipsum placeholder.</p>
    </>
  );
  return <div>{content}</div>;
};`;
      const result = validateContent(code);
      expect(result.passed).toBe(false);
      // Expect multiple errors: import, export, word count, h2, em dash, exclamation, placeholder
      expect(result.errors.length).toBeGreaterThan(3);
    });
  });
});
