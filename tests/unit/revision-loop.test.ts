import { describe, it, expect, beforeAll } from "vitest";

// ---------------------------------------------------------------------------
// Lazy imports (avoids top-level ESM resolution issues in Vitest)
// ---------------------------------------------------------------------------

let getWriterModel: (roundNumber: number, baseModel?: string) => string;
let buildRevisionPrompt: (opts: {
  originalPrompt?: string;
  previousCode?: string;
  reviewerFeedback?: string;
  reviewerIssues?: string[];
  researchContext?: string | object | null;
  roundNumber?: number;
}) => string;

beforeAll(async () => {
  const mod = await import(
    "../../monitoring/agents/review/revision-loop.mjs"
  );
  getWriterModel = mod.getWriterModel;
  buildRevisionPrompt = mod.buildRevisionPrompt;
});

// ---------------------------------------------------------------------------
// getWriterModel
// ---------------------------------------------------------------------------

describe("getWriterModel", () => {
  it("returns base model ('sonnet') for round 1", () => {
    expect(getWriterModel(1)).toBe("sonnet");
  });

  it("returns base model ('sonnet') for round 2", () => {
    expect(getWriterModel(2)).toBe("sonnet");
  });

  it("escalates to 'opus' for round 3", () => {
    expect(getWriterModel(3)).toBe("opus");
  });

  it("escalates to 'opus' for round 4+", () => {
    expect(getWriterModel(4)).toBe("opus");
    expect(getWriterModel(10)).toBe("opus");
  });

  it("returns custom baseModel for rounds 1-2", () => {
    expect(getWriterModel(1, "haiku")).toBe("haiku");
    expect(getWriterModel(2, "haiku")).toBe("haiku");
  });

  it("still escalates to opus on round 3 regardless of baseModel", () => {
    expect(getWriterModel(3, "haiku")).toBe("opus");
  });
});

// ---------------------------------------------------------------------------
// buildRevisionPrompt — shared fixtures
// ---------------------------------------------------------------------------

const baseOpts = {
  originalPrompt: "Write a freight page for DeMar Transportation.",
  previousCode: 'export default function FreightPage() { return <div>Freight</div>; }',
  reviewerFeedback: "The content is too thin. Add more detail about services and pricing.",
  reviewerIssues: [
    "Word count is only 120 — need at least 800",
    "Missing H2 subheadings",
    "No call-to-action button",
  ],
  researchContext: "Top competitor avg word count: 1800. Target keyword: 'freight shipping Nevada'.",
  roundNumber: 1,
};

// ---------------------------------------------------------------------------
// buildRevisionPrompt — required content
// ---------------------------------------------------------------------------

describe("buildRevisionPrompt — required content", () => {
  it("contains the intro message about previous attempt needing changes", () => {
    const prompt = buildRevisionPrompt(baseOpts);
    expect(prompt).toContain("Your previous attempt was reviewed and needs changes.");
  });

  it("contains the reviewer feedback", () => {
    const prompt = buildRevisionPrompt(baseOpts);
    expect(prompt).toContain("The content is too thin. Add more detail about services and pricing.");
  });

  it("contains all specific issues as bullet points", () => {
    const prompt = buildRevisionPrompt(baseOpts);
    expect(prompt).toContain("Word count is only 120");
    expect(prompt).toContain("Missing H2 subheadings");
    expect(prompt).toContain("No call-to-action button");
  });

  it("contains the previous code", () => {
    const prompt = buildRevisionPrompt(baseOpts);
    expect(prompt).toContain("FreightPage");
    expect(prompt).toContain("```tsx");
  });

  it("contains the original task / original prompt", () => {
    const prompt = buildRevisionPrompt(baseOpts);
    expect(prompt).toContain("Write a freight page for DeMar Transportation.");
  });

  it("contains research context when provided", () => {
    const prompt = buildRevisionPrompt(baseOpts);
    expect(prompt).toContain("Top competitor avg word count: 1800");
    expect(prompt).toContain("freight shipping Nevada");
  });

  it("contains instruction to return complete file without markdown fences", () => {
    const prompt = buildRevisionPrompt(baseOpts);
    expect(prompt).toContain("Return the complete file contents only");
    expect(prompt).toContain("Do not include markdown fences");
  });
});

// ---------------------------------------------------------------------------
// buildRevisionPrompt — escalation notice
// ---------------------------------------------------------------------------

describe("buildRevisionPrompt — escalation notice", () => {
  it("does NOT contain ESCALATION notice on round 1", () => {
    const prompt = buildRevisionPrompt({ ...baseOpts, roundNumber: 1 });
    expect(prompt).not.toContain("ESCALATION NOTICE");
    expect(prompt).not.toContain("two previous attempts");
  });

  it("does NOT contain ESCALATION notice on round 2", () => {
    const prompt = buildRevisionPrompt({ ...baseOpts, roundNumber: 2 });
    expect(prompt).not.toContain("ESCALATION NOTICE");
    expect(prompt).not.toContain("two previous attempts");
  });

  it("contains ESCALATION NOTICE on round 3", () => {
    const prompt = buildRevisionPrompt({ ...baseOpts, roundNumber: 3 });
    expect(prompt).toContain("ESCALATION NOTICE");
  });

  it("mentions two previous attempts on round 3", () => {
    const prompt = buildRevisionPrompt({ ...baseOpts, roundNumber: 3 });
    expect(prompt).toContain("Two previous attempts");
  });

  it("contains ESCALATION NOTICE on round 4+", () => {
    const prompt = buildRevisionPrompt({ ...baseOpts, roundNumber: 4 });
    expect(prompt).toContain("ESCALATION NOTICE");
  });
});

// ---------------------------------------------------------------------------
// buildRevisionPrompt — research context handling
// ---------------------------------------------------------------------------

describe("buildRevisionPrompt — research context", () => {
  it("omits Research Context section when researchContext is null", () => {
    const prompt = buildRevisionPrompt({ ...baseOpts, researchContext: null });
    expect(prompt).not.toContain("## Research Context");
  });

  it("omits Research Context section when researchContext is undefined", () => {
    const prompt = buildRevisionPrompt({ ...baseOpts, researchContext: undefined });
    expect(prompt).not.toContain("## Research Context");
  });

  it("includes Research Context section when string is provided", () => {
    const prompt = buildRevisionPrompt({
      ...baseOpts,
      researchContext: "SERP data: avg 1200 words",
    });
    expect(prompt).toContain("## Research Context");
    expect(prompt).toContain("SERP data: avg 1200 words");
  });

  it("JSON-stringifies object researchContext", () => {
    const prompt = buildRevisionPrompt({
      ...baseOpts,
      researchContext: { keyword: "freight", avgWordCount: 1500 },
    });
    expect(prompt).toContain("## Research Context");
    expect(prompt).toContain("avgWordCount");
    expect(prompt).toContain("1500");
  });
});

// ---------------------------------------------------------------------------
// buildRevisionPrompt — graceful null handling
// ---------------------------------------------------------------------------

describe("buildRevisionPrompt — null/missing inputs", () => {
  it("does not throw with no arguments", () => {
    expect(() => buildRevisionPrompt({})).not.toThrow();
  });

  it("handles missing reviewerIssues gracefully", () => {
    const prompt = buildRevisionPrompt({ ...baseOpts, reviewerIssues: undefined });
    expect(prompt).toContain("Specific Issues Found");
  });

  it("handles empty reviewerIssues array gracefully", () => {
    const prompt = buildRevisionPrompt({ ...baseOpts, reviewerIssues: [] });
    expect(prompt).toContain("No specific issues listed.");
  });

  it("handles missing previousCode gracefully", () => {
    const prompt = buildRevisionPrompt({ ...baseOpts, previousCode: undefined });
    expect(prompt).toContain("```tsx");
  });

  it("handles missing originalPrompt gracefully", () => {
    const prompt = buildRevisionPrompt({ ...baseOpts, originalPrompt: undefined });
    expect(prompt).toContain("## Original Task");
  });

  it("returns a non-empty string for minimal input", () => {
    const prompt = buildRevisionPrompt({ reviewerFeedback: "Fix this." });
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(50);
  });
});
