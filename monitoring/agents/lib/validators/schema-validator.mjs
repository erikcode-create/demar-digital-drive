import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load business facts from fixtures
const BUSINESS_FACTS_PATH = join(
  __dirname,
  "../../../../..",
  "tests/fixtures/business-facts.json"
);

function loadBusinessFacts() {
  try {
    const raw = readFileSync(BUSINESS_FACTS_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return {
      phoneTel: "+17752304767",
      email: "info@DeMarTransportation.com",
    };
  }
}

/**
 * Recursively collect all string values for a given key from an object/array.
 */
function collectValues(obj, targetKey) {
  const results = [];

  if (Array.isArray(obj)) {
    for (const item of obj) {
      results.push(...collectValues(item, targetKey));
    }
  } else if (obj !== null && typeof obj === "object") {
    for (const [key, value] of Object.entries(obj)) {
      if (key === targetKey && typeof value === "string") {
        results.push(value);
      }
      if (typeof value === "object" && value !== null) {
        results.push(...collectValues(value, targetKey));
      }
    }
  }

  return results;
}

/**
 * Collect all string values in the schema (recursively), regardless of key name.
 */
function collectAllStrings(obj) {
  const results = [];

  if (Array.isArray(obj)) {
    for (const item of obj) {
      results.push(...collectAllStrings(item));
    }
  } else if (obj !== null && typeof obj === "object") {
    for (const value of Object.values(obj)) {
      if (typeof value === "string") {
        results.push(value);
      } else if (typeof value === "object" && value !== null) {
        results.push(...collectAllStrings(value));
      }
    }
  }

  return results;
}

/**
 * URL-like keys to check for proper domain.
 */
const URL_KEYS = ["url", "@id", "sameAs", "logo", "image", "thumbnailUrl", "contentUrl"];

/**
 * Validate a JSON-LD schema string.
 *
 * @param {string} jsonString
 * @returns {{ passed: boolean, errors: string[] }}
 */
export function validateSchema(jsonString) {
  const errors = [];
  const facts = loadBusinessFacts();

  // 1. Parses as valid JSON
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    return { passed: false, errors: [`Invalid JSON: ${e.message}`] };
  }

  // 2. Has @context referencing schema.org
  const context = parsed["@context"];
  if (!context) {
    errors.push("Missing @context field");
  } else {
    const contextStr = typeof context === "string" ? context : JSON.stringify(context);
    if (!contextStr.includes("schema.org")) {
      errors.push(`@context does not reference schema.org (got: ${contextStr})`);
    }
  }

  // 3. Has @type field
  if (!parsed["@type"]) {
    errors.push("Missing @type field");
  }

  // 4. URLs don't contain localhost or 127.0.0.1
  const allStrings = collectAllStrings(parsed);
  for (const str of allStrings) {
    // Only check strings that look like URLs
    if (str.startsWith("http://") || str.startsWith("https://")) {
      if (str.includes("localhost") || str.includes("127.0.0.1")) {
        errors.push(`URL contains localhost/127.0.0.1: ${str}`);
      }
    }
  }

  // 5. URL fields use https://demartransportation.com
  for (const key of URL_KEYS) {
    const values = collectValues(parsed, key);
    for (const val of values) {
      if (val.startsWith("http://") || val.startsWith("https://")) {
        if (
          !val.includes("schema.org") &&
          !val.startsWith("https://demartransportation.com") &&
          !val.startsWith("http://demartransportation.com")
        ) {
          errors.push(
            `URL field "${key}" does not use https://demartransportation.com (got: ${val})`
          );
        }
      }
    }
  }

  // 6. Phone number matches source of truth if present
  const phoneValues = collectValues(parsed, "telephone");
  for (const phone of phoneValues) {
    if (phone !== facts.phoneTel) {
      errors.push(
        `Phone number mismatch: expected ${facts.phoneTel}, got ${phone}`
      );
    }
  }

  // 7. Email matches source of truth if present
  const emailValues = collectValues(parsed, "email");
  for (const email of emailValues) {
    if (email.toLowerCase() !== facts.email.toLowerCase()) {
      errors.push(
        `Email mismatch: expected ${facts.email}, got ${email}`
      );
    }
  }

  return {
    passed: errors.length === 0,
    errors,
  };
}
