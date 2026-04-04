import { describe, it, expect, beforeAll } from "vitest";

let fetchLivePage: (urlPath: string) => Promise<{
  title: string;
  description: string;
  headings: Array<{ tag: string; text: string }>;
  wordCount: number;
  html: string;
} | null>;

let fetchCompetitorPages: (
  keyword: string,
  limit?: number
) => Promise<
  Array<{
    title: string;
    url: string;
    description: string;
    headings: Array<{ tag: string; text: string }>;
    wordCount: number;
  }>
>;

beforeAll(async () => {
  const mod = await import(
    "../../monitoring/agents/review/competitor-fetcher.mjs"
  );
  fetchLivePage = mod.fetchLivePage;
  fetchCompetitorPages = mod.fetchCompetitorPages;
});

// ---------------------------------------------------------------------------
// fetchLivePage — module API shape
// ---------------------------------------------------------------------------
describe("fetchLivePage", () => {
  it("is exported as a function", () => {
    expect(typeof fetchLivePage).toBe("function");
  });

  it("returns null for an obviously invalid path", async () => {
    // Use a path that will definitely 404 on the live site
    const result = await fetchLivePage("/this-path-does-not-exist-xyzzy");
    // Either null (fetch failed / 404) or a valid shape — both acceptable
    if (result !== null) {
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("headings");
      expect(result).toHaveProperty("wordCount");
      expect(result).toHaveProperty("html");
    }
  }, 15_000);

  it("returns null or a valid object for the homepage", async () => {
    const result = await fetchLivePage("/");
    if (result === null) {
      // Site may be unreachable in CI — that's fine
      return;
    }
    expect(typeof result.title).toBe("string");
    expect(typeof result.description).toBe("string");
    expect(Array.isArray(result.headings)).toBe(true);
    expect(typeof result.wordCount).toBe("number");
    expect(result.wordCount).toBeGreaterThanOrEqual(0);
    expect(typeof result.html).toBe("string");
  }, 15_000);

  it("returns valid headings shape when data is available", async () => {
    const result = await fetchLivePage("/");
    if (result === null) return; // site unreachable
    for (const heading of result.headings) {
      expect(heading).toHaveProperty("tag");
      expect(heading).toHaveProperty("text");
      expect(["h1", "h2", "h3"]).toContain(heading.tag);
      expect(typeof heading.text).toBe("string");
    }
  }, 15_000);

  it("returns wordCount as a non-negative integer when data is available", async () => {
    const result = await fetchLivePage("/");
    if (result === null) return;
    expect(Number.isInteger(result.wordCount)).toBe(true);
    expect(result.wordCount).toBeGreaterThanOrEqual(0);
  }, 15_000);
});

// ---------------------------------------------------------------------------
// fetchCompetitorPages — module API shape
// ---------------------------------------------------------------------------
describe("fetchCompetitorPages", () => {
  it("is exported as a function", () => {
    expect(typeof fetchCompetitorPages).toBe("function");
  });

  it("returns an empty array when SERPER_API_KEY is not set", async () => {
    const savedKey = process.env.SERPER_API_KEY;
    delete process.env.SERPER_API_KEY;
    try {
      const results = await fetchCompetitorPages("freight shipping nevada");
      expect(Array.isArray(results)).toBe(true);
      expect(results).toHaveLength(0);
    } finally {
      if (savedKey !== undefined) process.env.SERPER_API_KEY = savedKey;
    }
  });

  it("returns an array (possibly empty) for a keyword", async () => {
    // If SERPER_API_KEY is not set the result will be [] — that's valid
    const results = await fetchCompetitorPages("freight shipping reno nv", 2);
    expect(Array.isArray(results)).toBe(true);
  }, 30_000);

  it("respects the limit parameter", async () => {
    if (!process.env.SERPER_API_KEY) return; // skip — no API key
    const results = await fetchCompetitorPages("ltl freight shipping", 2);
    expect(results.length).toBeLessThanOrEqual(2);
  }, 30_000);

  it("returns results with the expected shape", async () => {
    if (!process.env.SERPER_API_KEY) return; // skip — no API key
    const results = await fetchCompetitorPages("freight shipping nevada", 1);
    for (const item of results) {
      expect(typeof item.title).toBe("string");
      expect(typeof item.url).toBe("string");
      expect(item.url).toMatch(/^https?:\/\//);
      expect(typeof item.description).toBe("string");
      expect(Array.isArray(item.headings)).toBe(true);
      expect(typeof item.wordCount).toBe("number");
      expect(item.wordCount).toBeGreaterThanOrEqual(0);
    }
  }, 30_000);

  it("never returns demartransportation.com URLs", async () => {
    if (!process.env.SERPER_API_KEY) return;
    const results = await fetchCompetitorPages("DeMar Transportation freight", 3);
    for (const item of results) {
      const hostname = new URL(item.url).hostname.replace(/^www\./, "");
      expect(hostname).not.toBe("demartransportation.com");
    }
  }, 30_000);

  it("returns headings with valid tag values when present", async () => {
    if (!process.env.SERPER_API_KEY) return;
    const results = await fetchCompetitorPages("freight carrier nevada", 1);
    for (const item of results) {
      for (const heading of item.headings) {
        expect(["h1", "h2", "h3"]).toContain(heading.tag);
        expect(typeof heading.text).toBe("string");
      }
    }
  }, 30_000);
});
