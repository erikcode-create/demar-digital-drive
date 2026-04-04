import { describe, it, expect, beforeAll } from "vitest";

interface ValidationResult {
  passed: boolean;
  errors: string[];
}

let validateMeta: (opts: {
  title?: string;
  description?: string;
  targetKeyword?: string;
}) => ValidationResult;

beforeAll(async () => {
  const mod = await import(
    "../../monitoring/agents/lib/validators/meta-validator.mjs"
  );
  validateMeta = mod.validateMeta;
});

// ─── Return shape ────────────────────────────────────────────────────────────

describe("return value shape", () => {
  it("returns an object with passed and errors", () => {
    const result = validateMeta({ title: "Valid Title Here For Test", description: "A".repeat(130) });
    expect(result).toHaveProperty("passed");
    expect(result).toHaveProperty("errors");
    expect(Array.isArray(result.errors)).toBe(true);
  });

  it("passed is true when there are no errors", () => {
    const result = validateMeta({
      title: "Reliable Freight Carrier Services",
      description: "DeMar Transportation offers reliable LTL and FTL freight carrier services across Nevada and the western United States with on-time delivery.",
    });
    expect(result.passed).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("passed is false when there are errors", () => {
    const result = validateMeta({ title: "Hi" });
    expect(result.passed).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

// ─── Missing title / description ────────────────────────────────────────────

describe("missing title and description", () => {
  it("errors when title is missing", () => {
    const result = validateMeta({ description: "A".repeat(130) });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /title/i.test(e))).toBe(true);
  });

  it("errors when description is missing", () => {
    const result = validateMeta({ title: "Reliable Freight Carrier Services" });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /description/i.test(e))).toBe(true);
  });

  it("errors for both when both are missing", () => {
    const result = validateMeta({});
    expect(result.passed).toBe(false);
    const titleErr = result.errors.some((e) => /title.*missing/i.test(e));
    const descErr = result.errors.some((e) => /description.*missing/i.test(e));
    expect(titleErr).toBe(true);
    expect(descErr).toBe(true);
  });
});

// ─── Title length ────────────────────────────────────────────────────────────

describe("title length", () => {
  it("passes for a title with 30 characters", () => {
    const title = "A".repeat(30);
    const result = validateMeta({ title, description: "A".repeat(130) });
    const lengthErr = result.errors.some((e) => /title.*length|title.*character|title.*short|title.*long/i.test(e));
    expect(lengthErr).toBe(false);
  });

  it("passes for a title with 60 characters", () => {
    const title = "A".repeat(60);
    const result = validateMeta({ title, description: "A".repeat(130) });
    const lengthErr = result.errors.some((e) => /title.*length|title.*character|title.*short|title.*long/i.test(e));
    expect(lengthErr).toBe(false);
  });

  it("errors for a title that is too short (< 30 characters)", () => {
    const result = validateMeta({ title: "Short", description: "A".repeat(130) });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /title/i.test(e) && /short|length|character/i.test(e))).toBe(true);
  });

  it("errors for a title that is too long (> 60 characters)", () => {
    const title = "A".repeat(61);
    const result = validateMeta({ title, description: "A".repeat(130) });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /title/i.test(e) && /long|length|character/i.test(e))).toBe(true);
  });

  it("errors for a title with exactly 29 characters", () => {
    const title = "A".repeat(29);
    const result = validateMeta({ title, description: "A".repeat(130) });
    expect(result.errors.some((e) => /title/i.test(e))).toBe(true);
  });

  it("errors for a title with exactly 61 characters", () => {
    const title = "A".repeat(61);
    const result = validateMeta({ title, description: "A".repeat(130) });
    expect(result.errors.some((e) => /title/i.test(e))).toBe(true);
  });
});

// ─── Description length ──────────────────────────────────────────────────────

describe("description length", () => {
  it("passes for a description with 120 characters", () => {
    const description = "A".repeat(120);
    const result = validateMeta({ title: "Reliable Freight Carrier Services", description });
    const lengthErr = result.errors.some((e) => /description/i.test(e) && /short|long|length|character/i.test(e));
    expect(lengthErr).toBe(false);
  });

  it("passes for a description with 160 characters", () => {
    const description = "A".repeat(160);
    const result = validateMeta({ title: "Reliable Freight Carrier Services", description });
    const lengthErr = result.errors.some((e) => /description/i.test(e) && /short|long|length|character/i.test(e));
    expect(lengthErr).toBe(false);
  });

  it("errors for a description that is too short (< 120 characters)", () => {
    const result = validateMeta({
      title: "Reliable Freight Carrier Services",
      description: "Too short.",
    });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /description/i.test(e) && /short|length|character/i.test(e))).toBe(true);
  });

  it("errors for a description that is too long (> 160 characters)", () => {
    const description = "A".repeat(161);
    const result = validateMeta({ title: "Reliable Freight Carrier Services", description });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /description/i.test(e) && /long|length|character/i.test(e))).toBe(true);
  });

  it("errors for a description with exactly 119 characters", () => {
    const description = "A".repeat(119);
    const result = validateMeta({ title: "Reliable Freight Carrier Services", description });
    expect(result.errors.some((e) => /description/i.test(e))).toBe(true);
  });

  it("errors for a description with exactly 161 characters", () => {
    const description = "A".repeat(161);
    const result = validateMeta({ title: "Reliable Freight Carrier Services", description });
    expect(result.errors.some((e) => /description/i.test(e))).toBe(true);
  });
});

// ─── All-caps words ──────────────────────────────────────────────────────────

describe("no all-caps words in title", () => {
  const validTitle = "RELIABLE freight carrier services test"; // RELIABLE is not in allowed list

  it("errors when title contains an all-caps word not in the allowed list", () => {
    const result = validateMeta({ title: validTitle, description: "A".repeat(130) });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /caps|uppercase/i.test(e))).toBe(true);
  });

  it("does not error for allowed acronym LTL", () => {
    const result = validateMeta({
      title: "LTL Freight Services for Western Carriers",
      description: "A".repeat(130),
    });
    const capsErr = result.errors.some((e) => /caps|uppercase/i.test(e));
    expect(capsErr).toBe(false);
  });

  it("does not error for allowed acronym FTL", () => {
    const result = validateMeta({
      title: "FTL Trucking Solutions for Regional Freight",
      description: "A".repeat(130),
    });
    const capsErr = result.errors.some((e) => /caps|uppercase/i.test(e));
    expect(capsErr).toBe(false);
  });

  it("does not error for allowed acronym 3PL", () => {
    const result = validateMeta({
      title: "3PL Logistics Provider for Small Businesses",
      description: "A".repeat(130),
    });
    const capsErr = result.errors.some((e) => /caps|uppercase/i.test(e));
    expect(capsErr).toBe(false);
  });

  it("does not error for allowed acronym DOT", () => {
    const result = validateMeta({
      title: "DOT Compliance Services for Freight Carriers",
      description: "A".repeat(130),
    });
    const capsErr = result.errors.some((e) => /caps|uppercase/i.test(e));
    expect(capsErr).toBe(false);
  });

  it("does not error for allowed acronym GPS", () => {
    const result = validateMeta({
      title: "GPS Tracking for Freight Delivery Services",
      description: "A".repeat(130),
    });
    const capsErr = result.errors.some((e) => /caps|uppercase/i.test(e));
    expect(capsErr).toBe(false);
  });

  it("does not error for allowed acronym US", () => {
    const result = validateMeta({
      title: "US Freight Carrier and Transportation Services",
      description: "A".repeat(130),
    });
    const capsErr = result.errors.some((e) => /caps|uppercase/i.test(e));
    expect(capsErr).toBe(false);
  });

  it("does not error for allowed acronym USA", () => {
    const result = validateMeta({
      title: "USA Freight Carrier and Transportation Services",
      description: "A".repeat(130),
    });
    const capsErr = result.errors.some((e) => /caps|uppercase/i.test(e));
    expect(capsErr).toBe(false);
  });

  it("errors for multiple disallowed caps words", () => {
    const result = validateMeta({
      title: "BEST TRUCKING SERVICES IN NEVADA",
      description: "A".repeat(130),
    });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /caps|uppercase/i.test(e))).toBe(true);
  });

  it("all allowed acronyms together do not trigger error", () => {
    // Build a title using only allowed acronyms + lowercase words (keeping it 30-60 chars)
    const result = validateMeta({
      title: "LTL FTL DOT GPS ELD US NV Freight",
      description: "A".repeat(130),
    });
    const capsErr = result.errors.some((e) => /caps|uppercase/i.test(e));
    expect(capsErr).toBe(false);
  });

  it("checks all allowed acronyms: CDL, FMCSA, ELD, OTR, SEO, FAQ, NV, PST, UTC", () => {
    const acronyms = ["CDL", "FMCSA", "ELD", "OTR", "SEO", "FAQ", "NV", "PST", "UTC"];
    for (const acronym of acronyms) {
      // Each title uses one acronym padded with lowercase words
      const title = `${acronym} Transportation Services For Trucks`.slice(0, 60);
      // Make sure the title is at least 30 chars
      const paddedTitle = title.length >= 30 ? title : title + " ".repeat(30 - title.length) + "x".repeat(30 - title.length);
      const result = validateMeta({
        title: paddedTitle.slice(0, 60),
        description: "A".repeat(130),
      });
      const capsErr = result.errors.some((e) => /caps|uppercase/i.test(e));
      expect(capsErr).toBe(false);
    }
  });
});

// ─── Placeholder text ────────────────────────────────────────────────────────

describe("no placeholder text", () => {
  it("errors when title contains [INSERT", () => {
    const result = validateMeta({
      title: "[INSERT Title Here For Your Page]",
      description: "A".repeat(130),
    });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /placeholder/i.test(e))).toBe(true);
  });

  it("errors when description contains [TODO", () => {
    const result = validateMeta({
      title: "Reliable Freight Carrier Services",
      description: "[TODO: write a proper meta description for this page here]",
    });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /placeholder/i.test(e))).toBe(true);
  });

  it("errors when title contains [PLACEHOLDER", () => {
    const result = validateMeta({
      title: "[PLACEHOLDER] Title for Freight Services",
      description: "A".repeat(130),
    });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /placeholder/i.test(e))).toBe(true);
  });

  it("errors when title contains TBD", () => {
    const result = validateMeta({
      title: "Freight Services TBD — Coming Soon To Nevada",
      description: "A".repeat(130),
    });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /placeholder/i.test(e))).toBe(true);
  });

  it("errors when description contains Lorem ipsum", () => {
    const result = validateMeta({
      title: "Reliable Freight Carrier Services",
      description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore",
    });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /placeholder/i.test(e))).toBe(true);
  });

  it("placeholder check is case-insensitive for Lorem ipsum", () => {
    const result = validateMeta({
      title: "Reliable Freight Carrier Services",
      description: "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore",
    });
    expect(result.errors.some((e) => /placeholder/i.test(e))).toBe(true);
  });
});

// ─── Target keyword ──────────────────────────────────────────────────────────

describe("target keyword", () => {
  it("passes when keyword appears in title", () => {
    const result = validateMeta({
      title: "Nevada Freight Carrier Services",
      description: "A".repeat(130),
      targetKeyword: "freight carrier",
    });
    const kwErr = result.errors.some((e) => /keyword/i.test(e));
    expect(kwErr).toBe(false);
  });

  it("passes when keyword appears in description", () => {
    const result = validateMeta({
      title: "Reliable Transportation Services",
      description: "DeMar provides freight carrier services across the western US with reliable on-time delivery guaranteed.",
      targetKeyword: "freight carrier",
    });
    const kwErr = result.errors.some((e) => /keyword/i.test(e));
    expect(kwErr).toBe(false);
  });

  it("errors when keyword is absent from both title and description", () => {
    const result = validateMeta({
      title: "Reliable Transportation Services",
      description: "We provide trucking solutions across the western United States with guaranteed delivery times.",
      targetKeyword: "freight carrier",
    });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /keyword/i.test(e))).toBe(true);
  });

  it("keyword check is case-insensitive", () => {
    const result = validateMeta({
      title: "FREIGHT CARRIER Services for Nevada",
      description: "A".repeat(130),
      targetKeyword: "freight carrier",
    });
    // The title has all-caps "FREIGHT" and "CARRIER" which aren't allowed acronyms,
    // so there will be a caps error — but there should NOT be a keyword error
    const kwErr = result.errors.some((e) => /keyword/i.test(e));
    expect(kwErr).toBe(false);
  });

  it("no keyword error when targetKeyword is not provided", () => {
    const result = validateMeta({
      title: "Reliable Freight Carrier Services",
      description: "A".repeat(130),
    });
    const kwErr = result.errors.some((e) => /keyword/i.test(e));
    expect(kwErr).toBe(false);
  });

  it("no keyword error when targetKeyword is empty string", () => {
    const result = validateMeta({
      title: "Reliable Freight Carrier Services",
      description: "A".repeat(130),
      targetKeyword: "",
    });
    const kwErr = result.errors.some((e) => /keyword/i.test(e));
    expect(kwErr).toBe(false);
  });
});

// ─── Multiple errors ─────────────────────────────────────────────────────────

describe("multiple simultaneous errors", () => {
  it("reports all errors at once", () => {
    const result = validateMeta({
      title: "Hi", // too short
      description: "Short.", // too short
    });
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });

  it("a fully valid input returns passed=true and zero errors", () => {
    const result = validateMeta({
      title: "DeMar Transportation — Nevada Freight Carrier",
      description: "DeMar Transportation provides LTL and FTL freight carrier services across Nevada and the western US. DOT-compliant, GPS-tracked, on-time delivery.",
      targetKeyword: "freight carrier",
    });
    expect(result.passed).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
