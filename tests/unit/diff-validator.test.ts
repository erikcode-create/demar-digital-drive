import { describe, it, expect, beforeAll } from "vitest";

let validateFileContent: (
  code: string,
  options?: { maxAddedLines?: number }
) => { passed: boolean; errors: string[] };

beforeAll(async () => {
  const mod = await import(
    "../../monitoring/agents/lib/validators/diff-validator.mjs"
  );
  validateFileContent = mod.validateFileContent;
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeComponent(body: string, hasExportDefault = true): string {
  const exportLine = hasExportDefault
    ? `export default function MyComponent() {\n  return (\n    <div>${body}</div>\n  );\n}`
    : `function MyComponent() {\n  return (\n    <div>${body}</div>\n  );\n}`;

  return `import React from "react";\n\n${exportLine}\n`;
}

// ---------------------------------------------------------------------------
// Return value shape
// ---------------------------------------------------------------------------

describe("validateFileContent: return value shape", () => {
  it("returns an object with passed and errors properties", () => {
    const result = validateFileContent("const x = 1;");
    expect(result).toHaveProperty("passed");
    expect(result).toHaveProperty("errors");
  });

  it("passed is a boolean", () => {
    const result = validateFileContent("const x = 1;");
    expect(typeof result.passed).toBe("boolean");
  });

  it("errors is an array", () => {
    const result = validateFileContent("const x = 1;");
    expect(Array.isArray(result.errors)).toBe(true);
  });

  it("returns passed:true and empty errors for valid minimal file", () => {
    const result = validateFileContent("const x = 1;\n");
    expect(result.passed).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns passed:false when errors exist", () => {
    const result = validateFileContent("<<<<<<< HEAD\nconst x = 1;\n=======\nconst x = 2;\n>>>>>>> branch");
    expect(result.passed).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Merge conflict markers
// ---------------------------------------------------------------------------

describe("validateFileContent: merge conflict markers", () => {
  it("detects <<<<<<< conflict start marker", () => {
    const code = "<<<<<<< HEAD\nconst x = 1;\n";
    const { errors } = validateFileContent(code);
    expect(errors.some((e) => e.includes("<<<<<<<"))).toBe(true);
  });

  it("detects ======= conflict separator", () => {
    const code = "const x = 1;\n=======\nconst x = 2;\n";
    const { errors } = validateFileContent(code);
    expect(errors.some((e) => e.includes("======="))).toBe(true);
  });

  it("detects >>>>>>> conflict end marker", () => {
    const code = "const x = 2;\n>>>>>>> feature-branch\n";
    const { errors } = validateFileContent(code);
    expect(errors.some((e) => e.includes(">>>>>>>"))).toBe(true);
  });

  it("reports all three markers in a full conflict block", () => {
    const code = [
      "<<<<<<< HEAD",
      "const x = 1;",
      "=======",
      "const x = 2;",
      ">>>>>>> feature-branch",
    ].join("\n");
    const { errors } = validateFileContent(code);
    const conflictErrors = errors.filter(
      (e) =>
        e.includes("<<<<<<<") || e.includes("=======") || e.includes(">>>>>>>")
    );
    expect(conflictErrors.length).toBe(3);
  });

  it("does not flag lines that merely contain = signs", () => {
    const code = "const x = 1;\nconst y = 2;\n";
    const { errors } = validateFileContent(code);
    const conflictErrors = errors.filter((e) => e.includes("======="));
    expect(conflictErrors).toHaveLength(0);
  });

  it("does not flag a line starting with fewer than 7 < characters", () => {
    const code = "<<<<<< not a conflict\n";
    const { errors } = validateFileContent(code);
    const conflictErrors = errors.filter((e) => e.includes("<<<<<<<"));
    expect(conflictErrors).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Duplicate export default
// ---------------------------------------------------------------------------

describe("validateFileContent: duplicate export default", () => {
  it("passes when there is exactly one export default", () => {
    const code = `import React from "react";\nexport default function Foo() { return <div />; }\n`;
    const { errors } = validateFileContent(code);
    const dupErrors = errors.filter((e) => e.includes("Duplicate export default"));
    expect(dupErrors).toHaveLength(0);
  });

  it("detects two export default statements", () => {
    const code = [
      `import React from "react";`,
      `export default function Foo() { return <div />; }`,
      `export default function Bar() { return <span />; }`,
    ].join("\n");
    const { errors } = validateFileContent(code);
    expect(errors.some((e) => e.includes("Duplicate export default"))).toBe(true);
  });

  it("detects three export default statements", () => {
    const code = [
      `export default function A() { return null; }`,
      `export default function B() { return null; }`,
      `export default function C() { return null; }`,
    ].join("\n");
    const { errors } = validateFileContent(code);
    const msg = errors.find((e) => e.includes("Duplicate export default"));
    expect(msg).toBeDefined();
    expect(msg).toContain("3");
  });

  it("does not flag export default object literal as duplicate when alone", () => {
    const code = `const config = { a: 1 };\nexport default config;\n`;
    const { errors } = validateFileContent(code);
    const dupErrors = errors.filter((e) => e.includes("Duplicate export default"));
    expect(dupErrors).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Missing export default
// ---------------------------------------------------------------------------

describe("validateFileContent: missing export default", () => {
  it("flags missing export default in a React component file", () => {
    const code = `import React from "react";\nfunction Foo() { return <div />; }\n`;
    const { errors } = validateFileContent(code);
    expect(errors.some((e) => e.includes("Missing export default"))).toBe(true);
  });

  it("does not flag missing export default in a plain utility file", () => {
    const code = `export function helper() { return 42; }\n`;
    const { errors } = validateFileContent(code);
    const missingErrors = errors.filter((e) => e.includes("Missing export default"));
    expect(missingErrors).toHaveLength(0);
  });

  it("does not flag when export default is present", () => {
    const code = makeComponent("Hello");
    const { errors } = validateFileContent(code);
    const missingErrors = errors.filter((e) => e.includes("Missing export default"));
    expect(missingErrors).toHaveLength(0);
  });

  it("detects missing export default when file uses @/ imports (local alias)", () => {
    const code = `import { Button } from "@/components/ui/button";\nfunction Page() { return <div />; }\n`;
    const { errors } = validateFileContent(code);
    expect(errors.some((e) => e.includes("Missing export default"))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Component return statement
// ---------------------------------------------------------------------------

describe("validateFileContent: component return statement", () => {
  it("passes when export default function has a return statement", () => {
    const code = `export default function MyPage() {\n  return <div>Hello</div>;\n}\n`;
    const { errors } = validateFileContent(code);
    const returnErrors = errors.filter((e) => e.includes("return statement"));
    expect(returnErrors).toHaveLength(0);
  });

  it("flags export default function with no return statement", () => {
    const code = `export default function Broken() {\n  console.log("hello");\n}\n`;
    const { errors } = validateFileContent(code);
    expect(errors.some((e) => e.includes("return statement"))).toBe(true);
  });

  it("passes for export default function with early return", () => {
    const code = [
      `export default function Foo() {`,
      `  if (!data) return null;`,
      `  return <div>{data}</div>;`,
      `}`,
    ].join("\n");
    const { errors } = validateFileContent(code);
    const returnErrors = errors.filter((e) => e.includes("return statement"));
    expect(returnErrors).toHaveLength(0);
  });

  it("does not check return on non-function export default (e.g. const)", () => {
    const code = `const config = { a: 1 };\nexport default config;\n`;
    const { errors } = validateFileContent(code);
    const returnErrors = errors.filter((e) => e.includes("return statement"));
    expect(returnErrors).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// JSON-LD validation
// ---------------------------------------------------------------------------

describe("validateFileContent: JSON-LD blocks", () => {
  it("passes when JSON-LD block is valid JSON", () => {
    const code = [
      `<script type="application/ld+json">`,
      `{"@context":"https://schema.org","@type":"WebPage","name":"Test"}`,
      `</script>`,
    ].join("\n");
    const { errors } = validateFileContent(code);
    const jsonErrors = errors.filter((e) => e.includes("JSON-LD"));
    expect(jsonErrors).toHaveLength(0);
  });

  it("flags invalid JSON in JSON-LD block", () => {
    const code = [
      `<script type="application/ld+json">`,
      `{"@context":"https://schema.org","@type": INVALID}`,
      `</script>`,
    ].join("\n");
    const { errors } = validateFileContent(code);
    expect(errors.some((e) => e.includes("JSON-LD block #1"))).toBe(true);
  });

  it("identifies which block number is invalid when multiple exist", () => {
    const validBlock = [
      `<script type="application/ld+json">`,
      `{"@context":"https://schema.org","@type":"WebPage"}`,
      `</script>`,
    ].join("\n");
    const invalidBlock = [
      `<script type="application/ld+json">`,
      `{broken json here}`,
      `</script>`,
    ].join("\n");
    const code = `${validBlock}\n<div />\n${invalidBlock}`;
    const { errors } = validateFileContent(code);
    expect(errors.some((e) => e.includes("JSON-LD block #2"))).toBe(true);
    expect(errors.some((e) => e.includes("JSON-LD block #1"))).toBe(false);
  });

  it("passes when there are no JSON-LD blocks", () => {
    const code = `<div><p>Hello world</p></div>`;
    const { errors } = validateFileContent(code);
    const jsonErrors = errors.filter((e) => e.includes("JSON-LD"));
    expect(jsonErrors).toHaveLength(0);
  });

  it("handles TSX template literal JSON-LD pattern {`{...}`}", () => {
    const code = [
      `<script type="application/ld+json">`,
      `{\`{"@context":"https://schema.org","@type":"WebPage","name":"Test"}\`}`,
      `</script>`,
    ].join("\n");
    const { errors } = validateFileContent(code);
    const jsonErrors = errors.filter((e) => e.includes("JSON-LD"));
    expect(jsonErrors).toHaveLength(0);
  });

  it("flags malformed TSX template literal JSON-LD", () => {
    const code = [
      `<script type="application/ld+json">`,
      `{\`{broken: json}\`}`,
      `</script>`,
    ].join("\n");
    const { errors } = validateFileContent(code);
    expect(errors.some((e) => e.includes("JSON-LD block #1"))).toBe(true);
  });

  it("validates multiple valid JSON-LD blocks without errors", () => {
    const block = (type: string) =>
      `<script type="application/ld+json">{"@context":"https://schema.org","@type":"${type}"}</script>`;
    const code = `${block("WebPage")}\n${block("Organization")}\n${block("BreadcrumbList")}`;
    const { errors } = validateFileContent(code);
    const jsonErrors = errors.filter((e) => e.includes("JSON-LD"));
    expect(jsonErrors).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Line count limit
// ---------------------------------------------------------------------------

describe("validateFileContent: line count limit", () => {
  it("passes when line count is within default limit (500)", () => {
    const code = Array(100).fill("const x = 1;").join("\n");
    const { errors } = validateFileContent(code);
    const limitErrors = errors.filter((e) => e.includes("lines"));
    expect(limitErrors).toHaveLength(0);
  });

  it("flags when line count exceeds default limit of 500", () => {
    const code = Array(501).fill("const x = 1;").join("\n");
    const { errors } = validateFileContent(code);
    expect(errors.some((e) => e.includes("exceeding the limit of 500"))).toBe(true);
  });

  it("passes when line count equals the default limit exactly (500)", () => {
    const code = Array(500).fill("x").join("\n");
    const { errors } = validateFileContent(code);
    const limitErrors = errors.filter((e) => e.includes("exceeding the limit"));
    expect(limitErrors).toHaveLength(0);
  });

  it("uses custom maxAddedLines when provided", () => {
    const code = Array(51).fill("const x = 1;").join("\n");
    const { errors } = validateFileContent(code, { maxAddedLines: 50 });
    expect(errors.some((e) => e.includes("exceeding the limit of 50"))).toBe(true);
  });

  it("passes with custom maxAddedLines when within the limit", () => {
    const code = Array(50).fill("const x = 1;").join("\n");
    const { errors } = validateFileContent(code, { maxAddedLines: 50 });
    const limitErrors = errors.filter((e) => e.includes("exceeding the limit"));
    expect(limitErrors).toHaveLength(0);
  });

  it("error message includes actual line count", () => {
    const code = Array(510).fill("x").join("\n");
    const { errors } = validateFileContent(code);
    expect(errors.some((e) => e.includes("510"))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Combined / integration
// ---------------------------------------------------------------------------

describe("validateFileContent: combined checks", () => {
  it("returns multiple errors when multiple issues exist", () => {
    const code = [
      `import React from "react";`,
      `<<<<<<< HEAD`,
      `function Foo() { console.log("x"); }`,
      `export default function Foo() { console.log("x"); }`,
      `export default function Bar() { return <div />; }`,
    ].join("\n");
    const { passed, errors } = validateFileContent(code);
    expect(passed).toBe(false);
    expect(errors.length).toBeGreaterThanOrEqual(2);
  });

  it("passes a complete valid React component file", () => {
    const code = [
      `import React from "react";`,
      `import { Link } from "react-router-dom";`,
      ``,
      `export default function HomePage() {`,
      `  return (`,
      `    <div>`,
      `      <h1>Welcome</h1>`,
      `      <Link to="/contact">Contact Us</Link>`,
      `    </div>`,
      `  );`,
      `}`,
    ].join("\n");
    const { passed, errors } = validateFileContent(code);
    expect(passed).toBe(true);
    expect(errors).toHaveLength(0);
  });

  it("handles non-string input gracefully", () => {
    // @ts-expect-error testing runtime behavior with wrong type
    const result = validateFileContent(null);
    expect(result.passed).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("passes an empty string (no component heuristics triggered)", () => {
    const result = validateFileContent("");
    expect(result.passed).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
