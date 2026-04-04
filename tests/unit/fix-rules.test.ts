import { describe, it, expect, beforeAll } from "vitest";

interface ScanCheck {
  name: string;
  status: string;
  detail?: string;
}

interface ScanResult {
  category: string;
  checks: ScanCheck[];
}

interface FixableItem {
  tier: number;
  id: string;
  model: string;
  commitMsg: string;
  check: ScanCheck;
  prompt: string;
  branchPrefix: string | null;
  category: string;
}

// classifyIssues is the only public export from fix-rules.mjs
let classifyIssues: (results: ScanResult[]) => FixableItem[];

beforeAll(async () => {
  const mod = await import("../../monitoring/lib/fix-rules.mjs");
  classifyIssues = mod.classifyIssues;
});

// Helper: wrap a single check in the results shape classifyIssues expects
function wrap(check: ScanCheck, category = "Test"): ScanResult[] {
  return [{ category, checks: [check] }];
}

describe("fix-rules: classifyIssues", () => {
  describe("return value shape", () => {
    it("returns an array", () => {
      expect(Array.isArray(classifyIssues([]))).toBe(true);
    });

    it("returns an empty array when given no results", () => {
      expect(classifyIssues([])).toEqual([]);
    });

    it("every returned item has required fields: tier, id, model, commitMsg, check, prompt", () => {
      const results = wrap({ name: "npm audit", status: "warn", detail: "1 vulnerability" });
      const fixable = classifyIssues(results);
      expect(fixable.length).toBeGreaterThan(0);
      for (const item of fixable) {
        expect(item).toHaveProperty("tier");
        expect(item).toHaveProperty("id");
        expect(item).toHaveProperty("model");
        expect(item).toHaveProperty("commitMsg");
        expect(item).toHaveProperty("check");
        expect(item).toHaveProperty("prompt");
      }
    });

    it("tier values are 1 or 2", () => {
      // Trigger one of each tier
      const results = [
        {
          category: "Deps",
          checks: [{ name: "npm audit", status: "warn" }],
        },
        {
          category: "Schema",
          checks: [{ name: "Required Props", status: "warn", detail: "missing" }],
        },
      ];
      const fixable = classifyIssues(results);
      for (const item of fixable) {
        expect([1, 2]).toContain(item.tier);
      }
    });

    it("model values are 'haiku', 'sonnet', or 'opus'", () => {
      const results = [
        { category: "Deps", checks: [{ name: "npm audit", status: "fail" }] },
        { category: "Schema", checks: [{ name: "Required Props", status: "warn", detail: "x" }] },
        { category: "Meta", checks: [{ name: "Page Meta", status: "warn", detail: "y" }] },
        { category: "Content", checks: [{ name: "Content Quality", status: "fail", detail: "z" }] },
      ];
      const fixable = classifyIssues(results);
      expect(fixable.length).toBeGreaterThan(0);
      for (const item of fixable) {
        expect(["haiku", "sonnet", "opus"]).toContain(item.model);
      }
    });
  });

  describe("Tier 1 rules", () => {
    it("npm-audit rule: matches a check with name 'npm audit' and status 'warn'", () => {
      const fixable = classifyIssues(
        wrap({ name: "npm audit", status: "warn", detail: "2 vulnerabilities" })
      );
      expect(fixable).toHaveLength(1);
      expect(fixable[0].id).toBe("npm-audit");
      expect(fixable[0].tier).toBe(1);
    });

    it("npm-audit rule: matches when status is 'fail'", () => {
      const fixable = classifyIssues(
        wrap({ name: "npm audit", status: "fail", detail: "critical" })
      );
      expect(fixable).toHaveLength(1);
      expect(fixable[0].id).toBe("npm-audit");
    });

    it("npm-audit rule: does not match when status is 'pass'", () => {
      const fixable = classifyIssues(
        wrap({ name: "npm audit", status: "pass" })
      );
      expect(fixable).toHaveLength(0);
    });

    it("npm-audit rule: does not match an unrelated check", () => {
      const fixable = classifyIssues(
        wrap({ name: "Meta Description", status: "fail", detail: "Too long" })
      );
      // meta-description-length rule might match but npm-audit should not
      const npmItem = fixable.find((f) => f.id === "npm-audit");
      expect(npmItem).toBeUndefined();
    });

    it("copyright-year rule: is classified as tier 1", () => {
      const fixable = classifyIssues(
        wrap({
          name: "Copyright Year",
          status: "warn",
          detail: "Copyright year does not match current year",
        })
      );
      expect(fixable).toHaveLength(1);
      expect(fixable[0].id).toBe("copyright-year");
      expect(fixable[0].tier).toBe(1);
    });

    it("copyright-year rule: does not match a passing check", () => {
      const fixable = classifyIssues(
        wrap({ name: "Copyright Year", status: "pass", detail: "Up to date" })
      );
      expect(fixable).toHaveLength(0);
    });
  });

  describe("Tier 2 rules", () => {
    it("schema-required-props rule: is classified as tier 2", () => {
      const fixable = classifyIssues(
        wrap({ name: "Required Props", status: "warn", detail: "Missing @type" })
      );
      const item = fixable.find((f) => f.id === "schema-required-props");
      expect(item).toBeDefined();
      expect(item!.tier).toBe(2);
    });

    it("og-tags rule: matches Placeholder Detection fail", () => {
      const fixable = classifyIssues(
        wrap({ name: "Placeholder Detection", status: "fail", detail: "placeholder text found" })
      );
      const item = fixable.find((f) => f.id === "og-tags");
      expect(item).toBeDefined();
      expect(item!.tier).toBe(2);
    });

    it("og-tags rule: matches OG Image fail", () => {
      const fixable = classifyIssues(
        wrap({ name: "OG Image", status: "fail", detail: "no OG image" })
      );
      const item = fixable.find((f) => f.id === "og-tags");
      expect(item).toBeDefined();
    });

    it("og-tags rule: does not match OG Image when status is 'warn' (not 'fail')", () => {
      const fixable = classifyIssues(
        wrap({ name: "OG Image", status: "warn", detail: "small image" })
      );
      const item = fixable.find((f) => f.id === "og-tags");
      expect(item).toBeUndefined();
    });
  });

  describe("NEVER_FIX behaviour", () => {
    it("does not classify CSP-related checks", () => {
      const fixable = classifyIssues(
        wrap({ name: "CSP Header", status: "fail", detail: "Missing Content-Security-Policy" })
      );
      expect(fixable).toHaveLength(0);
    });

    it("does not classify HSTS-related checks", () => {
      const fixable = classifyIssues(
        wrap({ name: "HSTS Header", status: "fail", detail: "Missing Strict-Transport-Security" })
      );
      expect(fixable).toHaveLength(0);
    });

    it("does not classify X-Frame-Options checks", () => {
      const fixable = classifyIssues(
        wrap({ name: "X-Frame-Options", status: "fail", detail: "missing" })
      );
      expect(fixable).toHaveLength(0);
    });

    it("does not classify Permissions-Policy checks", () => {
      const fixable = classifyIssues(
        wrap({ name: "Permissions-Policy", status: "fail", detail: "missing" })
      );
      expect(fixable).toHaveLength(0);
    });
  });

  describe("general classification behaviour", () => {
    it("skips all passing checks", () => {
      const results = [
        {
          category: "Deps",
          checks: [
            { name: "npm audit", status: "pass" },
            { name: "Copyright Year", status: "pass" },
          ],
        },
      ];
      expect(classifyIssues(results)).toHaveLength(0);
    });

    it("only returns the first matching rule per check", () => {
      // npm audit should only be classified once even if multiple rules could match
      const results = wrap({ name: "npm audit", status: "fail" });
      const fixable = classifyIssues(results);
      expect(fixable).toHaveLength(1);
    });

    it("handles results with empty checks array", () => {
      const results = [{ category: "Empty", checks: [] }];
      expect(classifyIssues(results)).toHaveLength(0);
    });

    it("processes multiple checks across multiple result objects", () => {
      const results = [
        { category: "Deps", checks: [{ name: "npm audit", status: "warn" }] },
        { category: "Freshness", checks: [{ name: "Copyright Year", status: "warn", detail: "current year" }] },
      ];
      const fixable = classifyIssues(results);
      const ids = fixable.map((f) => f.id);
      expect(ids).toContain("npm-audit");
      expect(ids).toContain("copyright-year");
    });
  });
});
