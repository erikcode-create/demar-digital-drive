import { fetchPage, TARGET_URL, computeStatus, computeScore } from "../lib/scanner.mjs";

const EXPECTED_TYPES = {
  "/": ["TransportCompany"],
};

const REQUIRED_PROPS = {
  TransportCompany: ["name", "url", "telephone"],
  Organization: ["name", "url"],
  LocalBusiness: ["name", "url", "telephone"],
};

function validateEmail(val) {
  return typeof val === "string" && val.includes("@");
}

function validatePhone(val) {
  return typeof val === "string" && /[\d\-\+\(\)]{7,}/.test(val);
}

function validateUrl(val) {
  try { new URL(val); return true; } catch { return false; }
}

export async function run() {
  const checks = [];
  const { $ } = await fetchPage();

  const jsonLdScripts = $('script[type="application/ld+json"]');

  if (jsonLdScripts.length === 0) {
    checks.push({ name: "JSON-LD Present", status: "fail", detail: "No JSON-LD structured data found", confidence: "VERIFIED", reason: null });
    return { category: "Schema Validation", status: computeStatus(checks), score: computeScore(checks), checks };
  }

  const schemas = [];
  jsonLdScripts.each((_, el) => {
    try {
      const data = JSON.parse($(el).html());
      if (data["@graph"]) {
        data["@graph"].forEach((item) => schemas.push(item));
      } else {
        schemas.push(data);
      }
    } catch { /* skip malformed */ }
  });

  checks.push({ name: "JSON-LD Present", status: "pass", detail: `${schemas.length} schema(s) found`, confidence: "VERIFIED", reason: null });

  const pathname = new URL(TARGET_URL).pathname;
  const expectedTypes = EXPECTED_TYPES[pathname] || [];
  const foundTypes = schemas.map((s) => s["@type"]).filter(Boolean);

  if (expectedTypes.length > 0) {
    const missing = expectedTypes.filter((t) => !foundTypes.includes(t));
    if (missing.length === 0) {
      checks.push({ name: "Schema Type Correctness", status: "pass", detail: `Found expected type(s): ${expectedTypes.join(", ")}`, confidence: "VERIFIED", reason: null });
    } else {
      checks.push({ name: "Schema Type Correctness", status: "warn", detail: `Missing expected type(s): ${missing.join(", ")}. Found: ${foundTypes.join(", ")}`, confidence: "VERIFIED", reason: null });
    }
  } else {
    checks.push({ name: "Schema Type Correctness", status: "pass", detail: `Types found: ${foundTypes.join(", ") || "none"}`, confidence: "VERIFIED", reason: null });
  }

  for (const schema of schemas) {
    const type = schema["@type"];
    const required = REQUIRED_PROPS[type];
    if (!required) continue;

    const missing = required.filter((prop) => !schema[prop]);
    if (missing.length === 0) {
      checks.push({ name: `${type} Required Props`, status: "pass", detail: `All required properties present: ${required.join(", ")}`, confidence: "VERIFIED", reason: null });
    } else {
      checks.push({ name: `${type} Required Props`, status: "warn", detail: `Missing: ${missing.join(", ")}`, confidence: "VERIFIED", reason: null });
    }
  }

  for (const schema of schemas) {
    if (schema.telephone && !validatePhone(schema.telephone)) {
      checks.push({ name: "Phone Format", status: "warn", detail: `"${schema.telephone}" doesn't look like a valid phone number`, confidence: "VERIFIED", reason: null });
    } else if (schema.telephone) {
      checks.push({ name: "Phone Format", status: "pass", detail: `${schema.telephone}`, confidence: "VERIFIED", reason: null });
    }

    if (schema.email && !validateEmail(schema.email)) {
      checks.push({ name: "Email Format", status: "warn", detail: `"${schema.email}" doesn't look like a valid email`, confidence: "VERIFIED", reason: null });
    } else if (schema.email) {
      checks.push({ name: "Email Format", status: "pass", detail: `${schema.email}`, confidence: "VERIFIED", reason: null });
    }

    if (schema.url && !validateUrl(schema.url)) {
      checks.push({ name: "Schema URL", status: "warn", detail: `"${schema.url}" is not a valid URL`, confidence: "VERIFIED", reason: null });
    } else if (schema.url) {
      checks.push({ name: "Schema URL", status: "pass", detail: `${schema.url}`, confidence: "VERIFIED", reason: null });
    }
  }

  for (const schema of schemas) {
    const channel = schema.availableChannel;
    if (channel?.servicePhone) {
      const cp = channel.servicePhone;
      if (!cp.telephone) {
        checks.push({ name: "ContactPoint Integrity", status: "warn", detail: "ContactPoint missing telephone", confidence: "VERIFIED", reason: null });
      } else if (!cp.contactType) {
        checks.push({ name: "ContactPoint Integrity", status: "warn", detail: "ContactPoint missing contactType", confidence: "VERIFIED", reason: null });
      } else {
        checks.push({ name: "ContactPoint Integrity", status: "pass", detail: `ContactPoint: ${cp.contactType}, ${cp.telephone}`, confidence: "VERIFIED", reason: null });
      }
    }
  }

  const typeSet = new Set(foundTypes);
  const conflicting = [["Restaurant", "TransportCompany"], ["Hotel", "TransportCompany"]];
  for (const [a, b] of conflicting) {
    if (typeSet.has(a) && typeSet.has(b)) {
      checks.push({ name: "Schema Conflict", status: "warn", detail: `Conflicting types: ${a} and ${b}`, confidence: "VERIFIED", reason: null });
    }
  }
  if (checks.every((c) => c.name !== "Schema Conflict")) {
    checks.push({ name: "Schema Conflict", status: "pass", detail: "No conflicting schema types", confidence: "VERIFIED", reason: null });
  }

  return { category: "Schema Validation", status: computeStatus(checks), score: computeScore(checks), checks };
}
