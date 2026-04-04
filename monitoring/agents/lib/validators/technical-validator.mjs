/**
 * Technical Fix Validator
 *
 * Validates that a code fix meets structural and quality requirements:
 * - Valid JSX structure (import + export default present)
 * - File size within 20% of original (if originalSize provided in metadata)
 * - Alt text under 125 characters
 * - No "image of" prefix in alt text
 * - All JSON-LD blocks parse as valid JSON
 * - No merge conflict markers (<<<, ===, >>>)
 *
 * @param {string} code - The code to validate
 * @param {{ originalSize?: number }} [metadata] - Optional metadata
 * @returns {{ passed: boolean, errors: string[] }}
 */
export function validateTechnicalFix(code, metadata = {}) {
  const errors = [];

  checkJsxStructure(code, errors);
  checkFileSize(code, metadata, errors);
  checkAltText(code, errors);
  checkJsonLd(code, errors);
  checkMergeConflicts(code, errors);

  return {
    passed: errors.length === 0,
    errors,
  };
}

// ─── Check: JSX structure ────────────────────────────────────────────────────

function checkJsxStructure(code, errors) {
  const hasImport = /^\s*import\s+/m.test(code);
  const hasExportDefault = /\bexport\s+default\b/.test(code);

  if (!hasImport) {
    errors.push("Missing import statement: valid JSX files must have at least one import");
  }
  if (!hasExportDefault) {
    errors.push("Missing export default: valid JSX files must have an export default");
  }
}

// ─── Check: File size within 20% of original ─────────────────────────────────

function checkFileSize(code, metadata, errors) {
  if (typeof metadata.originalSize !== "number") return;

  const { originalSize } = metadata;
  const newSize = code.length;
  const minAllowed = originalSize * 0.8;
  const maxAllowed = originalSize * 1.2;

  if (newSize < minAllowed) {
    const pct = Math.round((1 - newSize / originalSize) * 100);
    errors.push(
      `File size too small: new size (${newSize}) is ${pct}% smaller than original (${originalSize}); max allowed reduction is 20%`
    );
  } else if (newSize > maxAllowed) {
    const pct = Math.round((newSize / originalSize - 1) * 100);
    errors.push(
      `File size too large: new size (${newSize}) is ${pct}% larger than original (${originalSize}); max allowed increase is 20%`
    );
  }
}

// ─── Check: Alt text quality ──────────────────────────────────────────────────

// Matches alt="..." or alt='...' (handles escaped quotes inside is out of scope)
const ALT_ATTR_RE = /\balt=(?:"([^"]*)"|'([^']*)')/g;

function checkAltText(code, errors) {
  let match;
  ALT_ATTR_RE.lastIndex = 0;

  while ((match = ALT_ATTR_RE.exec(code)) !== null) {
    const alt = match[1] !== undefined ? match[1] : match[2];

    if (alt.length > 125) {
      errors.push(
        `Alt text exceeds 125 characters (${alt.length} chars): "${alt.slice(0, 40)}..."`
      );
    }

    if (/^image of\b/i.test(alt)) {
      errors.push(
        `Alt text must not start with "image of": "${alt.slice(0, 60)}"`
      );
    }
  }
}

// ─── Check: JSON-LD blocks ────────────────────────────────────────────────────

// Matches content between <script type="application/ld+json"> ... </script>
// Handles both single and double quotes on the type attribute
const JSONLD_RE =
  /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

function checkJsonLd(code, errors) {
  let match;
  JSONLD_RE.lastIndex = 0;
  let blockIndex = 0;

  while ((match = JSONLD_RE.exec(code)) !== null) {
    blockIndex++;
    const content = match[1].trim();

    // In JSX the content may be a template literal or JS expression — only
    // validate blocks that look like raw JSON (start with { or [).
    if (!content.startsWith("{") && !content.startsWith("[")) continue;

    try {
      JSON.parse(content);
    } catch (err) {
      errors.push(
        `Invalid JSON in JSON-LD block #${blockIndex}: ${err.message}`
      );
    }
  }
}

// ─── Check: Merge conflict markers ───────────────────────────────────────────

// A conflict marker line starts with exactly 7 of the same char (<, =, or >)
// followed by either end-of-line or a space/non-word character.
// We deliberately avoid matching normal === (triple equals) or >> in arrow fns.

const CONFLICT_RE = /^(<<<<<<< |>>>>>>> |={7}$)/m;

function checkMergeConflicts(code, errors) {
  if (CONFLICT_RE.test(code)) {
    errors.push(
      "Merge conflict markers detected (<<<, ===, or >>>); file must not contain unresolved conflicts"
    );
  }
}
