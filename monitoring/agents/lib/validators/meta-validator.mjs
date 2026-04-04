/**
 * Meta tag validator for DeMar Transportation.
 *
 * Validates title and description tags against SEO best-practice rules.
 * Returns a structured result so callers (agents, tests) can inspect every
 * failure independently.
 */

// Acronyms that are explicitly allowed in all-caps inside a page title.
const ALLOWED_CAPS = new Set([
  "LTL", "FTL", "3PL", "CDL", "DOT", "FMCSA", "GPS", "ELD",
  "OTR", "SEO", "FAQ", "US", "USA", "NV", "PST", "UTC",
]);

// Substrings that indicate placeholder / draft content.
// Checked case-insensitively.
const PLACEHOLDER_PATTERNS = [
  "[INSERT",
  "[TODO",
  "[PLACEHOLDER",
  "TBD",
  "LOREM IPSUM",
];

/**
 * Validate meta title and description against SEO rules.
 *
 * @param {object} opts
 * @param {string} [opts.title]           - The <title> tag value.
 * @param {string} [opts.description]     - The meta description value.
 * @param {string} [opts.targetKeyword]   - Optional target keyword that must
 *                                          appear in title or description.
 * @returns {{ passed: boolean, errors: string[] }}
 */
export function validateMeta({ title, description, targetKeyword } = {}) {
  const errors = [];

  // ── Missing fields ────────────────────────────────────────────────────────
  if (!title) {
    errors.push("Title is missing.");
  }
  if (!description) {
    errors.push("Description is missing.");
  }

  // ── Title checks ──────────────────────────────────────────────────────────
  if (title) {
    const titleLen = title.length;

    if (titleLen < 30) {
      errors.push(
        `Title is too short (${titleLen} characters). Minimum is 30.`
      );
    } else if (titleLen > 60) {
      errors.push(
        `Title is too long (${titleLen} characters). Maximum is 60.`
      );
    }

    // All-caps word check: split on whitespace; any token that is all
    // uppercase letters (2+ chars) and not in ALLOWED_CAPS is an error.
    const disallowedCaps = title
      .split(/\s+/)
      .filter((word) => {
        // Strip leading/trailing punctuation for the check
        const clean = word.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, "");
        if (clean.length < 2) return false;
        return /^[A-Z0-9]+$/.test(clean) && !ALLOWED_CAPS.has(clean);
      });

    if (disallowedCaps.length > 0) {
      errors.push(
        `Title contains disallowed all-caps words: ${disallowedCaps.join(", ")}. ` +
          `Only these acronyms are allowed in caps: ${[...ALLOWED_CAPS].join(", ")}.`
      );
    }

    // Placeholder text check
    const titleUpper = title.toUpperCase();
    for (const pattern of PLACEHOLDER_PATTERNS) {
      if (titleUpper.includes(pattern)) {
        errors.push(
          `Title contains placeholder text "${pattern}". Replace with real content.`
        );
        break; // One placeholder error per field is enough
      }
    }
  }

  // ── Description checks ────────────────────────────────────────────────────
  if (description) {
    const descLen = description.length;

    if (descLen < 120) {
      errors.push(
        `Description is too short (${descLen} characters). Minimum is 120.`
      );
    } else if (descLen > 160) {
      errors.push(
        `Description is too long (${descLen} characters). Maximum is 160.`
      );
    }

    // Placeholder text check
    const descUpper = description.toUpperCase();
    for (const pattern of PLACEHOLDER_PATTERNS) {
      if (descUpper.includes(pattern)) {
        errors.push(
          `Description contains placeholder text "${pattern}". Replace with real content.`
        );
        break;
      }
    }
  }

  // ── Target keyword check ──────────────────────────────────────────────────
  if (targetKeyword && targetKeyword.trim().length > 0) {
    const kwLower = targetKeyword.toLowerCase();
    const titleLower = (title || "").toLowerCase();
    const descLower = (description || "").toLowerCase();

    if (!titleLower.includes(kwLower) && !descLower.includes(kwLower)) {
      errors.push(
        `Target keyword "${targetKeyword}" is not present in title or description.`
      );
    }
  }

  return {
    passed: errors.length === 0,
    errors,
  };
}
