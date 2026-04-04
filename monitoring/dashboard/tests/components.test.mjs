import { describe, it, expect } from "vitest";

const MODULE_PATH = import.meta.dirname + "/../components.mjs";

describe("components", () => {
  describe("scoreColor", () => {
    it("returns pass for scores >= 80", async () => {
      const { scoreColor } = await import(MODULE_PATH);
      expect(scoreColor(80)).toBe("var(--color-pass)");
      expect(scoreColor(95)).toBe("var(--color-pass)");
    });
    it("returns good for 60-79", async () => {
      const { scoreColor } = await import(MODULE_PATH);
      expect(scoreColor(60)).toBe("var(--color-good)");
      expect(scoreColor(79)).toBe("var(--color-good)");
    });
    it("returns warn for 40-59", async () => {
      const { scoreColor } = await import(MODULE_PATH);
      expect(scoreColor(40)).toBe("var(--color-warn)");
    });
    it("returns fail for < 40", async () => {
      const { scoreColor } = await import(MODULE_PATH);
      expect(scoreColor(39)).toBe("var(--color-fail)");
      expect(scoreColor(0)).toBe("var(--color-fail)");
    });
  });

  describe("scoreGrade", () => {
    it("maps scores to letter grades", async () => {
      const { scoreGrade } = await import(MODULE_PATH);
      expect(scoreGrade(90)).toBe("EXCELLENT");
      expect(scoreGrade(74)).toBe("GOOD");
      expect(scoreGrade(55)).toBe("NEEDS WORK");
      expect(scoreGrade(30)).toBe("CRITICAL");
    });
  });

  describe("renderScoreRing", () => {
    it("produces SVG with correct stroke-dashoffset", async () => {
      const { renderScoreRing } = await import(MODULE_PATH);
      const html = renderScoreRing({ score: 74, label: "Overall Score", delta: "+3" });
      expect(html).toContain("74");
      expect(html).toContain("Overall Score");
      expect(html).toContain("+3");
      expect(html).toContain("stroke-dashoffset");
      expect(html).toContain('role="img"');
      expect(html).toContain("aria-label");
    });
  });

  describe("renderKpiCard", () => {
    it("renders label, value, detail, and delta", async () => {
      const { renderKpiCard } = await import(MODULE_PATH);
      const html = renderKpiCard({
        label: "Agent Health",
        value: "5/5",
        detail: "All phases passed",
        delta: { text: "12 consecutive passes", direction: "up" },
        color: "var(--color-pass)",
      });
      expect(html).toContain("Agent Health");
      expect(html).toContain("5/5");
      expect(html).toContain("All phases passed");
      expect(html).toContain("positive");
      expect(html).toContain("kpi-card");
    });
  });

  describe("renderCategoryCard", () => {
    it("renders mini ring with score and delta", async () => {
      const { renderCategoryCard } = await import(MODULE_PATH);
      const html = renderCategoryCard({
        name: "On-Page SEO",
        description: "Titles, metas, H1s",
        score: 82,
        delta: 5,
      });
      expect(html).toContain("On-Page SEO");
      expect(html).toContain("82");
      expect(html).toContain("▲");
    });
  });

  describe("renderActivityItem", () => {
    it("renders approved change", async () => {
      const { renderActivityItem } = await import(MODULE_PATH);
      const html = renderActivityItem({
        type: "approved",
        title: "Meta tags optimized",
        detail: "/services/dry-van-shipping",
        time: "3h ago",
      });
      expect(html).toContain("approved");
      expect(html).toContain("Meta tags optimized");
      expect(html).toContain("✓");
    });
    it("renders rejected change", async () => {
      const { renderActivityItem } = await import(MODULE_PATH);
      const html = renderActivityItem({
        type: "rejected",
        title: "Homepage copy change",
        detail: "low confidence",
        time: "3h ago",
      });
      expect(html).toContain("rejected");
      expect(html).toContain("✗");
    });
  });

  describe("renderIssueItem", () => {
    it("renders critical issue with severity badge", async () => {
      const { renderIssueItem } = await import(MODULE_PATH);
      const html = renderIssueItem({
        severity: "critical",
        title: "Missing meta description",
        page: "/services/warehousing",
      });
      expect(html).toContain("Critical");
      expect(html).toContain("color-fail");
      expect(html).toContain("Missing meta description");
    });
  });

  describe("renderKeywordRow", () => {
    it("renders keyword with position and change", async () => {
      const { renderKeywordRow } = await import(MODULE_PATH);
      const html = renderKeywordRow({
        keyword: "freight shipping reno",
        position: 4,
        change: 3,
        bestEver: 2,
        url: "/services/dry-van",
      });
      expect(html).toContain("freight shipping reno");
      expect(html).toContain("4");
      expect(html).toContain("▲ 3");
      expect(html).toContain("color-pass");
    });
    it("renders declining keyword in red", async () => {
      const { renderKeywordRow } = await import(MODULE_PATH);
      const html = renderKeywordRow({
        keyword: "ltl freight nevada",
        position: 12,
        change: -2,
        bestEver: 8,
        url: "/services/ltl",
      });
      expect(html).toContain("▼ 2");
      expect(html).toContain("color-fail");
    });
  });

  describe("renderSparkline", () => {
    it("produces SVG polyline from data points", async () => {
      const { renderSparkline } = await import(MODULE_PATH);
      const html = renderSparkline({ data: [10, 20, 15, 25, 30], color: "#10b981" });
      expect(html).toContain("<svg");
      expect(html).toContain("<polyline");
      expect(html).toContain("10b981");
    });
  });

  describe("renderPhaseBar", () => {
    it("renders each phase as a colored block", async () => {
      const { renderPhaseBar } = await import(MODULE_PATH);
      const html = renderPhaseBar([
        { phase: "intelligence", status: "pass", duration: "42s" },
        { phase: "analysis", status: "pass", duration: "1m 12s" },
        { phase: "action", status: "fail", duration: "3m 2s" },
      ]);
      expect(html).toContain("intelligence");
      expect(html).toContain("pass");
      expect(html).toContain("fail");
      expect(html).toContain("42s");
    });
  });

  describe("renderDeltaArrow", () => {
    it("returns green up arrow for positive", async () => {
      const { renderDeltaArrow } = await import(MODULE_PATH);
      expect(renderDeltaArrow(5)).toContain("▲");
      expect(renderDeltaArrow(5)).toContain("color-pass");
    });
    it("returns red down arrow for negative", async () => {
      const { renderDeltaArrow } = await import(MODULE_PATH);
      expect(renderDeltaArrow(-3)).toContain("▼");
      expect(renderDeltaArrow(-3)).toContain("color-fail");
    });
    it("returns gray dash for zero", async () => {
      const { renderDeltaArrow } = await import(MODULE_PATH);
      expect(renderDeltaArrow(0)).toContain("—");
    });
  });
});
