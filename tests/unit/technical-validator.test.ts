import { describe, it, expect, beforeAll } from "vitest";

interface ValidationResult {
  passed: boolean;
  errors: string[];
}

let validateTechnicalFix: (code: string, metadata?: { originalSize?: number }) => ValidationResult;

beforeAll(async () => {
  const mod = await import(
    "../../monitoring/agents/lib/validators/technical-validator.mjs"
  );
  validateTechnicalFix = mod.validateTechnicalFix;
});

// ─── Fixtures ───────────────────────────────────────────────────────────────

const VALID_JSX = `
import React from 'react';

export default function MyComponent() {
  return (
    <div>
      <img src="/foo.png" alt="A friendly dog playing fetch" />
      <script type="application/ld+json">
        ${JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: "Test" })}
      </script>
    </div>
  );
}
`;

// ─── Return shape ────────────────────────────────────────────────────────────

describe("validateTechnicalFix: return shape", () => {
  it("returns an object with passed (boolean) and errors (array)", () => {
    const result = validateTechnicalFix(VALID_JSX);
    expect(result).toHaveProperty("passed");
    expect(result).toHaveProperty("errors");
    expect(typeof result.passed).toBe("boolean");
    expect(Array.isArray(result.errors)).toBe(true);
  });

  it("errors is empty when all checks pass", () => {
    const result = validateTechnicalFix(VALID_JSX);
    expect(result.passed).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// ─── JSX structure ───────────────────────────────────────────────────────────

describe("validateTechnicalFix: JSX structure", () => {
  it("passes when both import and export default are present", () => {
    const result = validateTechnicalFix(VALID_JSX);
    expect(result.passed).toBe(true);
  });

  it("fails when import statement is missing", () => {
    const code = `
export default function MyComponent() {
  return <div />;
}
`;
    const result = validateTechnicalFix(code);
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /import/i.test(e))).toBe(true);
  });

  it("fails when export default is missing", () => {
    const code = `
import React from 'react';

function MyComponent() {
  return <div />;
}
`;
    const result = validateTechnicalFix(code);
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /export default/i.test(e))).toBe(true);
  });

  it("fails when both import and export default are missing", () => {
    const code = `function MyComponent() { return <div />; }`;
    const result = validateTechnicalFix(code);
    expect(result.passed).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });
});

// ─── File size ───────────────────────────────────────────────────────────────

describe("validateTechnicalFix: file size", () => {
  it("passes when originalSize is not provided", () => {
    const result = validateTechnicalFix(VALID_JSX);
    expect(result.passed).toBe(true);
  });

  it("passes when code is exactly the original size", () => {
    const result = validateTechnicalFix(VALID_JSX, {
      originalSize: VALID_JSX.length,
    });
    expect(result.passed).toBe(true);
  });

  it("passes when code is within 20% of original (smaller)", () => {
    // 80% of original is exactly the boundary — should pass
    const original = "x".repeat(1000);
    const code = `import x from 'y';\nexport default function F(){return <div>` + "x".repeat(800 - 50) + `</div>;}`;
    const result = validateTechnicalFix(code, { originalSize: 1000 });
    // code.length ≥ 800 (80% of 1000) → pass
    expect(result.errors.some((e) => /size/i.test(e))).toBe(false);
  });

  it("passes when code is within 20% of original (larger)", () => {
    // 120% of original is exactly the boundary — should pass
    const result = validateTechnicalFix(VALID_JSX, {
      originalSize: Math.floor(VALID_JSX.length / 1.19), // new is ~119% of original → pass
    });
    expect(result.errors.some((e) => /size/i.test(e))).toBe(false);
  });

  it("fails when code is more than 20% smaller than original", () => {
    // originalSize = 10000, code.length = VALID_JSX.length (< 8000)
    const result = validateTechnicalFix(VALID_JSX, { originalSize: 10000 });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /size/i.test(e))).toBe(true);
  });

  it("fails when code is more than 20% larger than original", () => {
    // originalSize = 50 → 120% = 60; VALID_JSX.length >> 60
    const result = validateTechnicalFix(VALID_JSX, { originalSize: 50 });
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /size/i.test(e))).toBe(true);
  });
});

// ─── Alt text length ─────────────────────────────────────────────────────────

describe("validateTechnicalFix: alt text", () => {
  it("passes when all alt text is under 125 characters", () => {
    const result = validateTechnicalFix(VALID_JSX);
    expect(result.passed).toBe(true);
  });

  it("fails when alt text exceeds 125 characters", () => {
    const longAlt = "a".repeat(126);
    const code = `
import React from 'react';
export default function F() {
  return <img src="/a.png" alt="${longAlt}" />;
}
`;
    const result = validateTechnicalFix(code);
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /alt.*125|125.*alt/i.test(e))).toBe(true);
  });

  it("passes when alt text is exactly 125 characters", () => {
    const exactAlt = "b".repeat(125);
    const code = `
import React from 'react';
export default function F() {
  return <img src="/a.png" alt="${exactAlt}" />;
}
`;
    const result = validateTechnicalFix(code);
    expect(result.errors.some((e) => /alt.*125|125.*alt/i.test(e))).toBe(false);
  });

  it("fails when alt text starts with 'image of' (case-insensitive)", () => {
    const code = `
import React from 'react';
export default function F() {
  return <img src="/a.png" alt="image of a truck" />;
}
`;
    const result = validateTechnicalFix(code);
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /image of/i.test(e))).toBe(true);
  });

  it("fails when alt text starts with 'Image Of' (mixed case)", () => {
    const code = `
import React from 'react';
export default function F() {
  return <img src="/a.png" alt="Image Of a warehouse" />;
}
`;
    const result = validateTechnicalFix(code);
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /image of/i.test(e))).toBe(true);
  });

  it("passes when alt text contains 'image of' but not as a prefix", () => {
    const code = `
import React from 'react';
export default function F() {
  return <img src="/a.png" alt="Truck with image of DeMar logo" />;
}
`;
    const result = validateTechnicalFix(code);
    expect(result.errors.some((e) => /image of/i.test(e))).toBe(false);
  });

  it("checks multiple alt attributes in one file", () => {
    const longAlt = "c".repeat(130);
    const code = `
import React from 'react';
export default function F() {
  return (
    <div>
      <img src="/a.png" alt="short alt" />
      <img src="/b.png" alt="${longAlt}" />
      <img src="/c.png" alt="image of something" />
    </div>
  );
}
`;
    const result = validateTechnicalFix(code);
    expect(result.passed).toBe(false);
    // Should report both the length violation and the prefix violation
    const hasLength = result.errors.some((e) => /alt.*125|125.*alt/i.test(e));
    const hasPrefix = result.errors.some((e) => /image of/i.test(e));
    expect(hasLength).toBe(true);
    expect(hasPrefix).toBe(true);
  });
});

// ─── JSON-LD validation ───────────────────────────────────────────────────────

describe("validateTechnicalFix: JSON-LD blocks", () => {
  it("passes when all JSON-LD blocks are valid JSON", () => {
    const result = validateTechnicalFix(VALID_JSX);
    expect(result.passed).toBe(true);
  });

  it("passes when there are no JSON-LD script blocks", () => {
    const code = `
import React from 'react';
export default function F() {
  return <div><p>No schema here</p></div>;
}
`;
    const result = validateTechnicalFix(code);
    expect(result.errors.some((e) => /json/i.test(e))).toBe(false);
  });

  it("fails when a JSON-LD block contains invalid JSON", () => {
    const code = `
import React from 'react';
export default function F() {
  return (
    <div>
      <script type="application/ld+json">
        { "@context": "https://schema.org", "@type": "WebPage", name: "Bad JSON" }
      </script>
    </div>
  );
}
`;
    const result = validateTechnicalFix(code);
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /json/i.test(e))).toBe(true);
  });

  it("fails when one of multiple JSON-LD blocks is invalid", () => {
    const validSchema = JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage" });
    const code = `
import React from 'react';
export default function F() {
  return (
    <div>
      <script type="application/ld+json">${validSchema}</script>
      <script type="application/ld+json">{ bad json here }</script>
    </div>
  );
}
`;
    const result = validateTechnicalFix(code);
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /json/i.test(e))).toBe(true);
  });

  it("ignores script tags that are not type application/ld+json", () => {
    const code = `
import React from 'react';
export default function F() {
  return (
    <div>
      <script type="text/javascript">{ not: valid: json }</script>
    </div>
  );
}
`;
    const result = validateTechnicalFix(code);
    expect(result.errors.some((e) => /json/i.test(e))).toBe(false);
  });
});

// ─── Merge conflict markers ───────────────────────────────────────────────────

describe("validateTechnicalFix: merge conflict markers", () => {
  it("passes when there are no merge conflict markers", () => {
    const result = validateTechnicalFix(VALID_JSX);
    expect(result.passed).toBe(true);
  });

  it("fails when <<< conflict marker is present", () => {
    const code = `
import React from 'react';
export default function F() {
  return (
<<<<<<< HEAD
    <div>Current</div>
=======
    <div>Incoming</div>
>>>>>>> branch
  );
}
`;
    const result = validateTechnicalFix(code);
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /conflict|marker/i.test(e))).toBe(true);
  });

  it("fails when === conflict marker is present without <<< or >>>", () => {
    const code = `
import React from 'react';
export default function F() {
  // Some conflict artifact
=======
  return <div />;
}
`;
    const result = validateTechnicalFix(code);
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /conflict|marker/i.test(e))).toBe(true);
  });

  it("fails when >>> conflict marker is present", () => {
    const code = `
import React from 'react';
export default function F() {
  return <div />;
>>>>>>> some-branch
}
`;
    const result = validateTechnicalFix(code);
    expect(result.passed).toBe(false);
    expect(result.errors.some((e) => /conflict|marker/i.test(e))).toBe(true);
  });

  it("does not flag normal === equality operators", () => {
    const code = `
import React from 'react';
export default function F() {
  const x = 1 === 1;
  return <div>{String(x)}</div>;
}
`;
    const result = validateTechnicalFix(code);
    expect(result.errors.some((e) => /conflict|marker/i.test(e))).toBe(false);
  });

  it("does not flag arrow functions or comparison operators containing >", () => {
    const code = `
import React from 'react';
export default function F() {
  const arr = [1, 2, 3];
  return <div>{arr.map((x) => x > 0 ? x : 0)}</div>;
}
`;
    const result = validateTechnicalFix(code);
    expect(result.errors.some((e) => /conflict|marker/i.test(e))).toBe(false);
  });
});

// ─── Multiple errors accumulate ──────────────────────────────────────────────

describe("validateTechnicalFix: multiple errors", () => {
  it("accumulates multiple errors from different checks", () => {
    // Missing import, long alt text, invalid JSON-LD, conflict marker
    const longAlt = "d".repeat(200);
    const code = `
export default function F() {
  return (
    <div>
      <img src="/a.png" alt="${longAlt}" />
      <script type="application/ld+json">{ bad json }</script>
<<<<<<< HEAD
    </div>
  );
}
`;
    const result = validateTechnicalFix(code);
    expect(result.passed).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });
});
