import { describe, it, expect, beforeAll } from "vitest";

// ---------------------------------------------------------------------------
// Lazy imports (avoids top-level ESM resolution issues in Vitest)
// ---------------------------------------------------------------------------

let runResearch: (opts: {
  actionType?: string;
  targetKeyword: string;
  targetPage?: string;
}) => Promise<{
  keyword: string;
  serp: { topResults: Array<{ title: string; url: string; description: string }>; peopleAlsoAsk: string[] };
  competitorAnalysis: {
    avgWordCount: number;
    commonHeadings: string[];
    topicsCovered: string[];
    missingFromOurs: string[];
  };
  currentLivePage: {
    title: string;
    description: string;
    wordCount: number;
    headings: Array<{ tag: string; text: string }>;
  } | null;
  factSources: Array<{ claim: string; source: string; date: string }>;
}>;

let formatResearchContext: (research: unknown) => string;

beforeAll(async () => {
  const mod = await import(
    "../../monitoring/agents/research/research-agent.mjs"
  );
  runResearch = mod.runResearch;
  formatResearchContext = mod.formatResearchContext;
});

// ---------------------------------------------------------------------------
// Module API shape
// ---------------------------------------------------------------------------

describe("module exports", () => {
  it("exports runResearch as a function", () => {
    expect(typeof runResearch).toBe("function");
  });

  it("exports formatResearchContext as a function", () => {
    expect(typeof formatResearchContext).toBe("function");
  });
});

// ---------------------------------------------------------------------------
// runResearch — return shape (no API keys required)
// ---------------------------------------------------------------------------

describe("runResearch — return shape", () => {
  it("returns the full structure even when APIs are unavailable", async () => {
    // Remove API keys to force graceful degradation
    const savedSerper = process.env.SERPER_API_KEY;
    const savedAnthropic = process.env.ANTHROPIC_API_KEY;
    delete process.env.SERPER_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;

    try {
      const result = await runResearch({ targetKeyword: "LTL freight" });

      // Top-level shape
      expect(result).toHaveProperty("keyword");
      expect(result).toHaveProperty("serp");
      expect(result).toHaveProperty("competitorAnalysis");
      expect(result).toHaveProperty("currentLivePage");
      expect(result).toHaveProperty("factSources");

      // keyword echoed back
      expect(result.keyword).toBe("LTL freight");

      // serp shape
      expect(result.serp).toHaveProperty("topResults");
      expect(result.serp).toHaveProperty("peopleAlsoAsk");
      expect(Array.isArray(result.serp.topResults)).toBe(true);
      expect(Array.isArray(result.serp.peopleAlsoAsk)).toBe(true);

      // competitorAnalysis shape
      expect(result.competitorAnalysis).toHaveProperty("avgWordCount");
      expect(result.competitorAnalysis).toHaveProperty("commonHeadings");
      expect(result.competitorAnalysis).toHaveProperty("topicsCovered");
      expect(result.competitorAnalysis).toHaveProperty("missingFromOurs");
      expect(typeof result.competitorAnalysis.avgWordCount).toBe("number");
      expect(Array.isArray(result.competitorAnalysis.commonHeadings)).toBe(true);
      expect(Array.isArray(result.competitorAnalysis.topicsCovered)).toBe(true);
      expect(Array.isArray(result.competitorAnalysis.missingFromOurs)).toBe(true);

      // currentLivePage should be null when no targetPage given
      expect(result.currentLivePage).toBeNull();

      // factSources
      expect(Array.isArray(result.factSources)).toBe(true);
    } finally {
      if (savedSerper !== undefined) process.env.SERPER_API_KEY = savedSerper;
      if (savedAnthropic !== undefined) process.env.ANTHROPIC_API_KEY = savedAnthropic;
    }
  }, 15_000);

  it("returns keyword as empty string when targetKeyword is empty string", async () => {
    const savedSerper = process.env.SERPER_API_KEY;
    delete process.env.SERPER_API_KEY;
    try {
      const result = await runResearch({ targetKeyword: "" });
      expect(result.keyword).toBe("");
    } finally {
      if (savedSerper !== undefined) process.env.SERPER_API_KEY = savedSerper;
    }
  }, 10_000);

  it("sets currentLivePage to null when targetPage is not provided", async () => {
    const savedSerper = process.env.SERPER_API_KEY;
    delete process.env.SERPER_API_KEY;
    try {
      const result = await runResearch({ targetKeyword: "freight broker" });
      expect(result.currentLivePage).toBeNull();
    } finally {
      if (savedSerper !== undefined) process.env.SERPER_API_KEY = savedSerper;
    }
  }, 15_000);

  it("competitorAnalysis.avgWordCount is 0 when no competitors found", async () => {
    const savedSerper = process.env.SERPER_API_KEY;
    delete process.env.SERPER_API_KEY;
    try {
      const result = await runResearch({ targetKeyword: "flatbed trucking nevada" });
      expect(result.competitorAnalysis.avgWordCount).toBe(0);
    } finally {
      if (savedSerper !== undefined) process.env.SERPER_API_KEY = savedSerper;
    }
  }, 10_000);

  it("factSources is an empty array when no competitors and no Claude", async () => {
    const savedSerper = process.env.SERPER_API_KEY;
    const savedAnthropic = process.env.ANTHROPIC_API_KEY;
    delete process.env.SERPER_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    try {
      const result = await runResearch({ targetKeyword: "truckload shipping" });
      expect(result.factSources).toHaveLength(0);
    } finally {
      if (savedSerper !== undefined) process.env.SERPER_API_KEY = savedSerper;
      if (savedAnthropic !== undefined) process.env.ANTHROPIC_API_KEY = savedAnthropic;
    }
  }, 10_000);
});

// ---------------------------------------------------------------------------
// formatResearchContext — thorough tests using mock data
// ---------------------------------------------------------------------------

const mockResearch = {
  keyword: "LTL freight shipping",
  serp: {
    topResults: [
      {
        title: "Best LTL Freight Services",
        url: "https://example.com/ltl",
        description: "Top-rated LTL freight with nationwide coverage.",
      },
      {
        title: "LTL Shipping Guide",
        url: "https://freight101.com/guide",
        description: "Everything you need to know about less-than-truckload shipping.",
      },
    ],
    peopleAlsoAsk: [
      "What is LTL freight?",
      "How much does LTL shipping cost?",
      "What are LTL freight classes?",
    ],
  },
  competitorAnalysis: {
    avgWordCount: 1450,
    commonHeadings: ["What is LTL Freight?", "LTL vs FTL", "How to Choose a Carrier"],
    topicsCovered: ["freight classes", "dimensional weight", "transit times", "insurance"],
    missingFromOurs: ["freight classes explained", "dimensional weight pricing"],
  },
  currentLivePage: {
    title: "LTL Freight | DeMar Transportation",
    description: "DeMar Transportation offers reliable LTL freight services in Nevada.",
    wordCount: 620,
    headings: [
      { tag: "h1", text: "LTL Freight Services" },
      { tag: "h2", text: "Why Choose DeMar?" },
      { tag: "h2", text: "Service Areas" },
    ],
  },
  factSources: [
    {
      claim: "LTL freight accounts for $50B in annual revenue in the US",
      source: "https://freightwaves.com/article/ltl-market-2024",
      date: "2024",
    },
    {
      claim: "Average LTL transit time is 3-5 business days",
      source: "ShippingSchool.com",
      date: "",
    },
  ],
};

describe("formatResearchContext — content correctness", () => {
  it("includes the keyword in the heading", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("LTL freight shipping");
  });

  it("includes the Top-Ranking Pages section heading", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("Top-Ranking Pages");
  });

  it("includes competitor titles in Top-Ranking Pages", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("Best LTL Freight Services");
    expect(output).toContain("LTL Shipping Guide");
  });

  it("includes competitor URLs in Top-Ranking Pages", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("https://example.com/ltl");
    expect(output).toContain("https://freight101.com/guide");
  });

  it("includes competitor descriptions", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("nationwide coverage");
    expect(output).toContain("less-than-truckload");
  });

  it("includes the Competitor Analysis section heading", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("Competitor Analysis");
  });

  it("includes average word count", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("1450");
  });

  it("includes common headings", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("What is LTL Freight?");
    expect(output).toContain("LTL vs FTL");
    expect(output).toContain("How to Choose a Carrier");
  });

  it("includes topics covered by competitors", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("freight classes");
    expect(output).toContain("dimensional weight");
    expect(output).toContain("transit times");
  });

  it("includes topics missing from our page", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("freight classes explained");
    expect(output).toContain("dimensional weight pricing");
  });

  it("includes the People Also Ask section heading", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("People Also Ask");
  });

  it("lists all People Also Ask questions", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("What is LTL freight?");
    expect(output).toContain("How much does LTL shipping cost?");
    expect(output).toContain("What are LTL freight classes?");
  });

  it("includes the Current Live Page State section heading", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("Current Live Page State");
  });

  it("includes the live page title", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("LTL Freight | DeMar Transportation");
  });

  it("includes the live page meta description", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("reliable LTL freight services in Nevada");
  });

  it("includes the live page word count", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("620");
  });

  it("includes headings from the live page with tag labels", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("H1");
    expect(output).toContain("LTL Freight Services");
    expect(output).toContain("H2");
    expect(output).toContain("Why Choose DeMar?");
    expect(output).toContain("Service Areas");
  });

  it("includes the Verified Facts section heading", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("Verified Facts");
  });

  it("includes fact claims", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("LTL freight accounts for $50B");
    expect(output).toContain("Average LTL transit time is 3-5 business days");
  });

  it("includes fact sources", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("freightwaves.com");
    expect(output).toContain("ShippingSchool.com");
  });

  it("includes fact date when present", () => {
    const output = formatResearchContext(mockResearch);
    expect(output).toContain("2024");
  });

  it("returns a non-empty string", () => {
    const output = formatResearchContext(mockResearch);
    expect(typeof output).toBe("string");
    expect(output.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// formatResearchContext — graceful degradation with empty/partial data
// ---------------------------------------------------------------------------

describe("formatResearchContext — graceful degradation", () => {
  it("handles null input without throwing", () => {
    expect(() => formatResearchContext(null)).not.toThrow();
    expect(formatResearchContext(null)).toBe("");
  });

  it("handles undefined input without throwing", () => {
    expect(() => formatResearchContext(undefined)).not.toThrow();
    expect(formatResearchContext(undefined)).toBe("");
  });

  it("handles empty serp.topResults gracefully", () => {
    const data = { ...mockResearch, serp: { topResults: [], peopleAlsoAsk: [] } };
    const output = formatResearchContext(data);
    expect(output).toContain("No SERP data available");
  });

  it("handles empty serp.peopleAlsoAsk gracefully", () => {
    const data = {
      ...mockResearch,
      serp: { ...mockResearch.serp, peopleAlsoAsk: [] },
    };
    const output = formatResearchContext(data);
    expect(output).toContain("No PAA data available");
  });

  it("handles null currentLivePage gracefully", () => {
    const data = { ...mockResearch, currentLivePage: null };
    const output = formatResearchContext(data);
    expect(output).toContain("not available");
  });

  it("handles empty factSources gracefully", () => {
    const data = { ...mockResearch, factSources: [] };
    const output = formatResearchContext(data);
    expect(output).toContain("No verified facts available");
  });

  it("handles missing competitorAnalysis sections gracefully", () => {
    const data = {
      ...mockResearch,
      competitorAnalysis: {
        avgWordCount: 0,
        commonHeadings: [],
        topicsCovered: [],
        missingFromOurs: [],
      },
    };
    const output = formatResearchContext(data);
    expect(output).toContain("No competitor analysis available");
  });

  it("handles minimal research object with only keyword", () => {
    const data = {
      keyword: "freight",
      serp: { topResults: [], peopleAlsoAsk: [] },
      competitorAnalysis: {
        avgWordCount: 0,
        commonHeadings: [],
        topicsCovered: [],
        missingFromOurs: [],
      },
      currentLivePage: null,
      factSources: [],
    };
    const output = formatResearchContext(data);
    expect(typeof output).toBe("string");
    expect(output).toContain("freight");
  });

  it("handles live page with empty headings array", () => {
    const data = {
      ...mockResearch,
      currentLivePage: {
        title: "Test Page",
        description: "Test description",
        wordCount: 300,
        headings: [],
      },
    };
    const output = formatResearchContext(data);
    expect(output).toContain("none detected");
  });

  it("produces sections in the correct order", () => {
    const output = formatResearchContext(mockResearch);
    const topIdx = output.indexOf("Top-Ranking Pages");
    const compIdx = output.indexOf("Competitor Analysis");
    const paaIdx = output.indexOf("People Also Ask");
    const liveIdx = output.indexOf("Current Live Page State");
    const factsIdx = output.indexOf("Verified Facts");

    expect(topIdx).toBeGreaterThan(-1);
    expect(compIdx).toBeGreaterThan(topIdx);
    expect(paaIdx).toBeGreaterThan(compIdx);
    expect(liveIdx).toBeGreaterThan(paaIdx);
    expect(factsIdx).toBeGreaterThan(liveIdx);
  });
});
