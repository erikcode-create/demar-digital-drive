import { describe, it, expect, beforeAll } from "vitest";

type ValidateSchemaFn = (jsonString: string) => { passed: boolean; errors: string[] };

let validateSchema: ValidateSchemaFn;

beforeAll(async () => {
  const mod = await import(
    "../../monitoring/agents/lib/validators/schema-validator.mjs"
  );
  validateSchema = mod.validateSchema;
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function validSchema(overrides: Record<string, unknown> = {}): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "DeMar Transportation",
    url: "https://demartransportation.com",
    ...overrides,
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("validateSchema", () => {
  describe("return shape", () => {
    it("returns an object with passed (boolean) and errors (array)", () => {
      const result = validateSchema(validSchema());
      expect(typeof result.passed).toBe("boolean");
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it("returns passed: true and empty errors for a valid minimal schema", () => {
      const result = validateSchema(validSchema());
      expect(result.passed).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("JSON parsing", () => {
    it("fails when input is not valid JSON", () => {
      const result = validateSchema("not json {{{");
      expect(result.passed).toBe(false);
      expect(result.errors.some((e) => e.toLowerCase().includes("invalid json"))).toBe(true);
    });

    it("fails for an empty string", () => {
      const result = validateSchema("");
      expect(result.passed).toBe(false);
    });

    it("passes for a JSON array containing a valid schema object", () => {
      const schema = JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          url: "https://demartransportation.com",
        },
      ]);
      // Array is valid JSON but lacks top-level @context/@type — should fail those checks
      const result = validateSchema(schema);
      // Should mention missing @context and @type since the array itself doesn't have them
      expect(result.passed).toBe(false);
    });
  });

  describe("@context field", () => {
    it("fails when @context is missing", () => {
      const schema = JSON.stringify({ "@type": "LocalBusiness" });
      const result = validateSchema(schema);
      expect(result.passed).toBe(false);
      expect(result.errors.some((e) => e.includes("@context"))).toBe(true);
    });

    it("fails when @context does not reference schema.org", () => {
      const schema = JSON.stringify({
        "@context": "https://example.com/vocab",
        "@type": "LocalBusiness",
      });
      const result = validateSchema(schema);
      expect(result.passed).toBe(false);
      expect(result.errors.some((e) => e.includes("schema.org"))).toBe(true);
    });

    it("passes when @context is 'https://schema.org'", () => {
      const result = validateSchema(validSchema({ "@context": "https://schema.org" }));
      expect(result.passed).toBe(true);
    });

    it("passes when @context is 'http://schema.org'", () => {
      const result = validateSchema(validSchema({ "@context": "http://schema.org" }));
      expect(result.passed).toBe(true);
    });
  });

  describe("@type field", () => {
    it("fails when @type is missing", () => {
      const schema = JSON.stringify({ "@context": "https://schema.org" });
      const result = validateSchema(schema);
      expect(result.passed).toBe(false);
      expect(result.errors.some((e) => e.includes("@type"))).toBe(true);
    });

    it("passes with @type LocalBusiness", () => {
      const result = validateSchema(validSchema({ "@type": "LocalBusiness" }));
      expect(result.passed).toBe(true);
    });

    it("passes with @type Organization", () => {
      const result = validateSchema(validSchema({ "@type": "Organization" }));
      expect(result.passed).toBe(true);
    });
  });

  describe("no localhost / 127.0.0.1 URLs", () => {
    it("fails when a string value contains localhost URL", () => {
      const schema = validSchema({ url: "http://localhost:3000/page" });
      const result = validateSchema(schema);
      expect(result.passed).toBe(false);
      expect(result.errors.some((e) => e.includes("localhost"))).toBe(true);
    });

    it("fails when a string value contains 127.0.0.1", () => {
      const schema = validSchema({ url: "http://127.0.0.1:8080/" });
      const result = validateSchema(schema);
      expect(result.passed).toBe(false);
      expect(result.errors.some((e) => e.includes("127.0.0.1"))).toBe(true);
    });

    it("does not flag non-URL strings that happen to contain 'localhost' as text", () => {
      // A description mentioning localhost in plain text (not a URL) should not fail
      const schema = validSchema({ description: "Do not use localhost in production." });
      const result = validateSchema(schema);
      expect(result.passed).toBe(true);
    });

    it("fails when localhost appears in a nested object", () => {
      const schema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        url: "https://demartransportation.com",
        image: {
          "@type": "ImageObject",
          url: "http://localhost/logo.png",
        },
      });
      const result = validateSchema(schema);
      expect(result.passed).toBe(false);
      expect(result.errors.some((e) => e.includes("localhost"))).toBe(true);
    });
  });

  describe("URL fields use https://demartransportation.com", () => {
    it("fails when 'url' field points to a different domain", () => {
      const schema = validSchema({ url: "https://example.com/page" });
      const result = validateSchema(schema);
      expect(result.passed).toBe(false);
      expect(result.errors.some((e) => e.includes("demartransportation.com"))).toBe(true);
    });

    it("passes when 'url' starts with https://demartransportation.com", () => {
      const result = validateSchema(validSchema({ url: "https://demartransportation.com/services" }));
      expect(result.passed).toBe(true);
    });

    it("fails when '@id' points to a different domain", () => {
      const schema = validSchema({ "@id": "https://otherdomain.com/#org" });
      const result = validateSchema(schema);
      expect(result.passed).toBe(false);
      expect(result.errors.some((e) => e.includes('"@id"'))).toBe(true);
    });

    it("passes when '@id' starts with https://demartransportation.com", () => {
      const result = validateSchema(validSchema({ "@id": "https://demartransportation.com/#org" }));
      expect(result.passed).toBe(true);
    });

    it("does not flag schema.org URLs used as type identifiers", () => {
      // schema.org URLs in @context / @type references should be allowed
      const result = validateSchema(validSchema());
      expect(result.passed).toBe(true);
    });
  });

  describe("phone number validation", () => {
    it("passes when no telephone field is present", () => {
      const result = validateSchema(validSchema());
      expect(result.passed).toBe(true);
    });

    it("passes when telephone matches +17752304767", () => {
      const result = validateSchema(validSchema({ telephone: "+17752304767" }));
      expect(result.passed).toBe(true);
    });

    it("fails when telephone does not match the source of truth", () => {
      const result = validateSchema(validSchema({ telephone: "+18001234567" }));
      expect(result.passed).toBe(false);
      expect(result.errors.some((e) => e.toLowerCase().includes("phone"))).toBe(true);
    });

    it("fails when telephone uses formatted style instead of E.164", () => {
      const result = validateSchema(validSchema({ telephone: "(775) 230-4767" }));
      expect(result.passed).toBe(false);
    });

    it("fails for telephone in nested ContactPoint", () => {
      const schema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        url: "https://demartransportation.com",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+19999999999",
        },
      });
      const result = validateSchema(schema);
      expect(result.passed).toBe(false);
      expect(result.errors.some((e) => e.toLowerCase().includes("phone"))).toBe(true);
    });
  });

  describe("email validation", () => {
    it("passes when no email field is present", () => {
      const result = validateSchema(validSchema());
      expect(result.passed).toBe(true);
    });

    it("passes when email matches info@DeMarTransportation.com (case-insensitive)", () => {
      const result = validateSchema(validSchema({ email: "info@DeMarTransportation.com" }));
      expect(result.passed).toBe(true);
    });

    it("passes when email matches in lowercase", () => {
      const result = validateSchema(validSchema({ email: "info@demartransportation.com" }));
      expect(result.passed).toBe(true);
    });

    it("fails when email is a different address", () => {
      const result = validateSchema(validSchema({ email: "contact@example.com" }));
      expect(result.passed).toBe(false);
      expect(result.errors.some((e) => e.toLowerCase().includes("email"))).toBe(true);
    });
  });

  describe("multiple errors accumulate", () => {
    it("reports multiple errors in a single call", () => {
      const schema = JSON.stringify({
        "@context": "https://example.com",
        // missing @type
        url: "https://otherdomain.com",
        telephone: "+18001234567",
        email: "wrong@example.com",
      });
      const result = validateSchema(schema);
      expect(result.passed).toBe(false);
      expect(result.errors.length).toBeGreaterThan(2);
    });
  });
});
