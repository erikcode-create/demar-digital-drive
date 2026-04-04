import { describe, it, expect, beforeAll } from "vitest";

// ---------------------------------------------------------------------------
// Lazy imports (avoids top-level ESM resolution issues in Vitest)
// ---------------------------------------------------------------------------

let getReviewTier: (actionType: string) => "opus" | "sonnet";
let buildReviewPrompt: (opts: {
  actionType?: string;
  reason?: string;
  targetKeyword?: string;
  originalCode?: string;
  modifiedCode?: string;
  researchContext?: string | object | null;
  livePage?: {
    title: string;
    description: string;
    wordCount: number;
    headings: Array<{ tag: string; text: string }>;
  } | null;
  competitors?: Array<{
    title: string;
    url: string;
    description: string;
    wordCount: number;
    headings: Array<{ tag: string; text: string }>;
  }> | null;
}) => string;

beforeAll(async () => {
  const mod = await import(
    "../../monitoring/agents/review/reviewer-agent.mjs"
  );
  getReviewTier = mod.getReviewTier;
  buildReviewPrompt = mod.buildReviewPrompt;
});

// ---------------------------------------------------------------------------
// getReviewTier
// ---------------------------------------------------------------------------

describe("getReviewTier", () => {
  it("returns 'opus' for write-content", () => {
    expect(getReviewTier("write-content")).toBe("opus");
  });

  it("returns 'opus' for update-content", () => {
    expect(getReviewTier("update-content")).toBe("opus");
  });

  it("returns 'opus' for fix-homepage", () => {
    expect(getReviewTier("fix-homepage")).toBe("opus");
  });

  it("returns 'sonnet' for fix-meta", () => {
    expect(getReviewTier("fix-meta")).toBe("sonnet");
  });

  it("returns 'sonnet' for fix-schema", () => {
    expect(getReviewTier("fix-schema")).toBe("sonnet");
  });

  it("returns 'sonnet' for fix-technical", () => {
    expect(getReviewTier("fix-technical")).toBe("sonnet");
  });

  it("returns 'sonnet' for fix-links", () => {
    expect(getReviewTier("fix-links")).toBe("sonnet");
  });

  it("returns 'sonnet' for unknown action type", () => {
    expect(getReviewTier("some-unknown-type")).toBe("sonnet");
  });

  it("returns 'sonnet' for empty string", () => {
    expect(getReviewTier("")).toBe("sonnet");
  });
});

// ---------------------------------------------------------------------------
// buildReviewPrompt — full context
// ---------------------------------------------------------------------------

const fullOpts = {
  actionType: "write-content",
  reason: "Competitor pages are 3x longer and rank higher for target keyword",
  targetKeyword: "LTL freight shipping Nevada",
  originalCode: 'export default function FreightPage() { return <div>Freight</div>; }',
  modifiedCode: 'export default function FreightPage() { return <div><h1>LTL Freight Shipping in Nevada</h1><p>DeMar Transportation offers...</p></div>; }',
  researchContext: "SERP top result: 'Best LTL Freight Carriers 2024' — avgWordCount: 1800",
  livePage: {
    title: "LTL Freight | DeMar Transportation",
    description: "Reliable LTL freight shipping in Nevada.",
    wordCount: 620,
    headings: [
      { tag: "h1", text: "LTL Freight Services" },
      { tag: "h2", text: "Why Choose DeMar?" },
    ],
  },
  competitors: [
    {
      title: "Top LTL Freight Carrier",
      url: "https://example.com/ltl",
      description: "Award-winning LTL services nationwide.",
      wordCount: 1800,
      headings: [
        { tag: "h1", text: "LTL Freight Shipping" },
        { tag: "h2", text: "Our Services" },
      ],
    },
  ],
};

describe("buildReviewPrompt — required sections", () => {
  it("includes the senior SEO editor role introduction", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("senior SEO editor");
  });

  it("includes Action Intent section", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("Action Intent");
  });

  it("includes the action type", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("write-content");
  });

  it("includes the reason", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("Competitor pages are 3x longer");
  });

  it("includes the target keyword", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("LTL freight shipping Nevada");
  });

  it("includes Research Context section", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("Research Context");
  });

  it("includes the research context content", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("avgWordCount: 1800");
  });

  it("includes Original File section", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("Original File");
  });

  it("includes the original code in a tsx block", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("```tsx");
    expect(prompt).toContain("FreightPage");
  });

  it("includes Modified File section", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("Modified File");
  });

  it("includes the modified code", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("LTL Freight Shipping in Nevada");
  });

  it("includes Current Live Page section", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("Current Live Page");
  });

  it("includes live page title", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("LTL Freight | DeMar Transportation");
  });

  it("includes live page description", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("Reliable LTL freight shipping in Nevada.");
  });

  it("includes live page word count", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("620");
  });

  it("includes live page headings with uppercase tags", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("H1");
    expect(prompt).toContain("H2");
    expect(prompt).toContain("LTL Freight Services");
    expect(prompt).toContain("Why Choose DeMar?");
  });

  it("includes Top Competitor Pages section", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("Top Competitor Pages");
  });

  it("includes competitor title", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("Top LTL Freight Carrier");
  });

  it("includes competitor URL", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("https://example.com/ltl");
  });

  it("includes competitor description", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("Award-winning LTL services");
  });

  it("includes competitor word count", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("1800");
  });
});

// ---------------------------------------------------------------------------
// buildReviewPrompt — business facts
// ---------------------------------------------------------------------------

describe("buildReviewPrompt — business facts", () => {
  it("includes Business Facts section", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("Business Facts");
  });

  it("includes the company phone number", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("(775) 230-4767");
  });

  it("includes the company name", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("DeMar Transportation");
  });

  it("includes the company email", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("info@DeMarTransportation.com");
  });

  it("includes the company address", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("10471 Double R Blvd");
  });

  it("includes the DOT number", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("4392091");
  });
});

// ---------------------------------------------------------------------------
// buildReviewPrompt — verdict instructions
// ---------------------------------------------------------------------------

describe("buildReviewPrompt — verdict instructions", () => {
  it("requests a JSON response with verdict field", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("verdict");
  });

  it("mentions APPROVE verdict option", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("APPROVE");
  });

  it("mentions REVISE verdict option", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("REVISE");
  });

  it("mentions REJECT verdict option", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("REJECT");
  });

  it("includes confidence field in response format", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("confidence");
  });

  it("includes issues field in response format", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("issues");
  });

  it("includes feedback field in response format", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("feedback");
  });

  it("includes summary field in response format", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("summary");
  });

  it("mentions evaluation criteria: Factual Accuracy", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("Factual Accuracy");
  });

  it("mentions evaluation criteria: Hallucination Check", () => {
    const prompt = buildReviewPrompt(fullOpts);
    expect(prompt).toContain("Hallucination Check");
  });
});

// ---------------------------------------------------------------------------
// buildReviewPrompt — graceful handling of null/missing fields
// ---------------------------------------------------------------------------

describe("buildReviewPrompt — graceful null handling", () => {
  it("handles missing originalCode gracefully", () => {
    const prompt = buildReviewPrompt({ ...fullOpts, originalCode: undefined });
    expect(prompt).toContain("Original File");
    expect(prompt).toContain("no original file");
  });

  it("handles null livePage gracefully", () => {
    const prompt = buildReviewPrompt({ ...fullOpts, livePage: null });
    expect(prompt).toContain("Current Live Page");
    expect(prompt).toContain("not available");
  });

  it("handles null competitors gracefully", () => {
    const prompt = buildReviewPrompt({ ...fullOpts, competitors: null });
    expect(prompt).toContain("Top Competitor Pages");
    expect(prompt).toContain("No competitor data");
  });

  it("handles empty competitors array gracefully", () => {
    const prompt = buildReviewPrompt({ ...fullOpts, competitors: [] });
    expect(prompt).toContain("No competitor data");
  });

  it("handles null researchContext gracefully", () => {
    const prompt = buildReviewPrompt({ ...fullOpts, researchContext: null });
    expect(prompt).toContain("Research Context");
    expect(prompt).toContain("No research context");
  });

  it("handles object researchContext by JSON-stringifying it", () => {
    const prompt = buildReviewPrompt({
      ...fullOpts,
      researchContext: { keyword: "test", avgWordCount: 900 },
    });
    expect(prompt).toContain("avgWordCount");
    expect(prompt).toContain("900");
  });

  it("handles missing actionType without throwing", () => {
    expect(() =>
      buildReviewPrompt({ ...fullOpts, actionType: undefined })
    ).not.toThrow();
  });

  it("handles missing reason without throwing", () => {
    expect(() =>
      buildReviewPrompt({ ...fullOpts, reason: undefined })
    ).not.toThrow();
  });

  it("handles live page with empty headings", () => {
    const prompt = buildReviewPrompt({
      ...fullOpts,
      livePage: { ...fullOpts.livePage!, headings: [] },
    });
    expect(prompt).toContain("none detected");
  });

  it("handles competitor with empty headings", () => {
    const prompt = buildReviewPrompt({
      ...fullOpts,
      competitors: [{ ...fullOpts.competitors![0], headings: [] }],
    });
    // Should not throw and should still include competitor section
    expect(prompt).toContain("Top LTL Freight Carrier");
  });

  it("returns a non-empty string for minimal input", () => {
    const prompt = buildReviewPrompt({ modifiedCode: "export default () => null;" });
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(100);
  });

  it("always includes business facts even with minimal input", () => {
    const prompt = buildReviewPrompt({ modifiedCode: "export default () => null;" });
    expect(prompt).toContain("(775) 230-4767");
    expect(prompt).toContain("DeMar Transportation");
  });
});
