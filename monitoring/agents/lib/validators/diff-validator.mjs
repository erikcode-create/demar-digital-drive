/**
 * Diff Validator
 *
 * Validates the structural integrity of a full file's content before committing.
 * This is distinct from technical-validator (code quality) — this checks structural
 * correctness of the entire file to prevent broken commits.
 *
 * Checks:
 * - No merge conflict markers (<<<<<<, =======, >>>>>>>)
 * - No duplicate export default statements
 * - Missing export default detected
 * - Component function has return statement (if export default function exists)
 * - All JSON-LD blocks parse as valid JSON
 * - File line count within maxAddedLines limit (default 500)
 */

/**
 * Validate full file content for structural integrity.
 *
 * @param {string} code - Full file content to validate
 * @param {object} [options]
 * @param {number} [options.maxAddedLines=500] - Maximum total line count allowed
 * @returns {{ passed: boolean, errors: string[] }}
 */
export function validateFileContent(code, options = {}) {
  const { maxAddedLines = 500 } = options;
  const errors = [];

  if (typeof code !== "string") {
    return { passed: false, errors: ["Input must be a string"] };
  }

  // 1. Check for merge conflict markers
  const conflictMarkers = [
    { pattern: /^<{7}(?:\s|$)/m, label: "<<<<<<< (conflict start marker)" },
    { pattern: /^={7}(?:\s|$)/m, label: "======= (conflict separator)" },
    { pattern: /^>{7}(?:\s|$)/m, label: ">>>>>>> (conflict end marker)" },
  ];
  for (const { pattern, label } of conflictMarkers) {
    if (pattern.test(code)) {
      errors.push(`Merge conflict marker found: ${label}`);
    }
  }

  // 2. Check for duplicate export default statements
  // Match "export default" followed by function/class/identifier (not re-exports like "export default from")
  const exportDefaultMatches = [...code.matchAll(/^export\s+default\b/gm)];
  if (exportDefaultMatches.length > 1) {
    errors.push(
      `Duplicate export default statements found (${exportDefaultMatches.length} occurrences)`
    );
  }

  // 3. Check for missing export default (only when file looks like a React component/module)
  // Heuristic: if the file contains JSX or React patterns but no export default
  const looksLikeComponent =
    /\bimport\s+React\b/.test(code) ||
    /\bimport\s+\{[^}]*\}\s+from\s+['"]react['"]/.test(code) ||
    /\bfrom\s+['"]@\//.test(code) ||
    /<[A-Z][A-Za-z]*[\s/>]/.test(code); // JSX component usage

  if (looksLikeComponent && exportDefaultMatches.length === 0) {
    errors.push("Missing export default — React component files must have a default export");
  }

  // 4. Check that export default function has a return statement
  // Find "export default function FooName(...) {" or "export default function(...) {"
  const exportDefaultFnMatch = code.match(
    /export\s+default\s+function\s*\w*\s*\([^)]*\)\s*\{/
  );
  if (exportDefaultFnMatch) {
    // Find the function body — scan from the match position to find balanced braces
    const startIdx = code.indexOf(exportDefaultFnMatch[0]);
    const bodyStart = code.indexOf("{", startIdx + exportDefaultFnMatch[0].length - 1);
    if (bodyStart !== -1) {
      const body = extractFunctionBody(code, bodyStart);
      if (body !== null && !/\breturn\b/.test(body)) {
        errors.push(
          "export default function body has no return statement"
        );
      }
    }
  }

  // 5. Validate all JSON-LD blocks
  // Look for <script type="application/ld+json">...</script>
  const jsonLdPattern = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let jsonLdMatch;
  let jsonLdIndex = 0;
  while ((jsonLdMatch = jsonLdPattern.exec(code)) !== null) {
    jsonLdIndex++;
    const rawJson = jsonLdMatch[1].trim();

    // In TSX/JSX, the JSON-LD block may be a template literal: {`{...}`}
    // Strip surrounding { ` ` } if present
    let jsonStr = rawJson;
    const templateLiteralMatch = rawJson.match(/^\{`([\s\S]*?)`\}$/);
    if (templateLiteralMatch) {
      jsonStr = templateLiteralMatch[1].trim();
    }

    // Also handle plain backtick template literals without outer braces
    const backtickMatch = rawJson.match(/^`([\s\S]*?)`$/);
    if (backtickMatch) {
      jsonStr = backtickMatch[1].trim();
    }

    try {
      JSON.parse(jsonStr);
    } catch (err) {
      errors.push(`JSON-LD block #${jsonLdIndex} is not valid JSON: ${err.message}`);
    }
  }

  // 6. Check line count limit
  const lineCount = code.split("\n").length;
  if (lineCount > maxAddedLines) {
    errors.push(
      `File has ${lineCount} lines, exceeding the limit of ${maxAddedLines}`
    );
  }

  return {
    passed: errors.length === 0,
    errors,
  };
}

/**
 * Extract the body content of a function given the position of its opening brace.
 * Returns the body string (without outer braces), or null if unbalanced.
 *
 * @param {string} code
 * @param {number} openBraceIdx - index of the opening `{`
 * @returns {string|null}
 */
function extractFunctionBody(code, openBraceIdx) {
  let depth = 0;
  let i = openBraceIdx;
  const start = openBraceIdx + 1;

  while (i < code.length) {
    const ch = code[i];
    if (ch === "{") {
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) {
        return code.slice(start, i);
      }
    }
    i++;
  }

  // Unbalanced braces
  return null;
}
