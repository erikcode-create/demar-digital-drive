/**
 * Content Validator
 *
 * Validates the output of the content-writer agent (TSX blog post files).
 * Returns { passed: boolean, errors: string[] }.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Business facts — single source of truth
// ---------------------------------------------------------------------------

let _facts = null;

function getBusinessFacts() {
  if (_facts) return _facts;
  const factsPath = path.resolve(
    __dirname,
    "../../../../tests/fixtures/business-facts.json"
  );
  _facts = JSON.parse(readFileSync(factsPath, "utf8"));
  return _facts;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extract the visible text of the content block from the TSX source.
 *
 * Handles two formats produced by the content-writer:
 *   1. JSX:      const content = (\n    <>\n      ...\n    </>\n  );
 *   2. Backtick: const content = `...`;
 *
 * Returns the raw source slice so that regex checks work on it.
 */
function extractContentBlock(code) {
  // --- backtick format ---
  const backtickMatch = code.match(/const\s+content\s*=\s*`([\s\S]*?)`/);
  if (backtickMatch) {
    return backtickMatch[1];
  }

  // --- JSX format: const content = ( ... ); ---
  // Find the opening paren after `const content =`
  const assignIdx = code.search(/const\s+content\s*=/);
  if (assignIdx === -1) return null;

  const afterAssign = code.indexOf("(", assignIdx);
  if (afterAssign === -1) return null;

  // Walk the source from the opening paren, matching parens
  let depth = 0;
  let start = -1;
  let end = -1;
  for (let i = afterAssign; i < code.length; i++) {
    if (code[i] === "(") {
      depth++;
      if (depth === 1) start = i;
    } else if (code[i] === ")") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (start === -1 || end === -1) return null;
  return code.slice(start + 1, end);
}

/**
 * Strip JSX/HTML tags and return plain text, preserving whitespace so word
 * splitting still works correctly.
 */
function stripTags(html) {
  return html.replace(/<[^>]*>/g, " ");
}

/**
 * Count words in a string (split on whitespace).
 */
function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Validate a content-writer TSX output.
 *
 * @param {string} code - The full TSX file content.
 * @param {Record<string,string>} [metadata] - Optional metadata, e.g. { targetKeyword }.
 * @returns {{ passed: boolean, errors: string[] }}
 */
export function validateContent(code, metadata = {}) {
  const errors = [];
  const facts = getBusinessFacts();

  // --- 1. import BlogPost (blog posts only) ---
  const isBlogPost = metadata.filePath?.includes("/blog/") || metadata.actionType === "write-content";
  if (isBlogPost && !/import\s+BlogPost\b/.test(code)) {
    errors.push('Missing "import BlogPost" statement');
  }

  // --- 2. export default ---
  if (!/export\s+default\b/.test(code)) {
    errors.push('Missing "export default" statement');
  }

  // Extract the content block for content-specific checks
  const contentBlock = extractContentBlock(code);
  const rawText = contentBlock ? stripTags(contentBlock) : "";

  // --- 3. Word count >= 1500 (blog posts only; other pages have varied length) ---
  const minWords = isBlogPost ? 1500 : 300;
  if (contentBlock !== null) {
    const wordCount = countWords(rawText);
    if (wordCount < minWords) {
      errors.push(
        `Word count too low: ${wordCount} words (minimum ${minWords}). Extract the content block and check word count.`
      );
    }
  } else {
    // If we can't find the content block, do a full-file word count as fallback
    const wordCount = countWords(stripTags(code));
    if (wordCount < minWords) {
      errors.push(
        `Word count too low: ${wordCount} words (minimum ${minWords}). Could not locate "const content" block.`
      );
    }
  }

  // --- 4. No placeholder text ---
  const placeholderPatterns = [
    { pattern: /Lorem ipsum/i, label: "Lorem ipsum" },
    { pattern: /\[INSERT/i, label: "[INSERT" },
    { pattern: /\[TODO/i, label: "[TODO" },
    { pattern: /\[PLACEHOLDER/i, label: "[PLACEHOLDER" },
    { pattern: /\bTBD\b/, label: "TBD" },
  ];
  for (const { pattern, label } of placeholderPatterns) {
    if (pattern.test(code)) {
      errors.push(`Contains placeholder text: "${label}"`);
      break; // One error is enough for placeholder category
    }
  }

  // --- 5. No competitor brand names ---
  const competitors = [
    "XPO Logistics",
    "J.B. Hunt",
    "Werner Enterprises",
    "Schneider National",
    "Knight-Swift",
  ];
  for (const brand of competitors) {
    if (code.includes(brand)) {
      errors.push(`Contains competitor brand name: "${brand}"`);
      break; // Report first occurrence; one error per category
    }
  }

  // --- 6. No em dashes ---
  if (code.includes("\u2014")) {
    errors.push(
      "Contains em dash (\u2014) — use commas, periods, or semicolons instead (brand guideline)"
    );
  }

  // --- 7. No exclamation marks in text content ---
  // Strip JSX attribute strings (e.g. alt="foo!") before checking
  // Strategy: remove anything inside HTML/JSX attribute quotes, then check for !
  const strippedForExclamation = code
    // Remove string literals in JSX attributes: attr="..." and attr='...'
    .replace(/\b\w+\s*=\s*"[^"]*"/g, "")
    .replace(/\b\w+\s*=\s*'[^']*'/g, "");

  if (strippedForExclamation.includes("!")) {
    errors.push(
      'Contains exclamation mark ("!") in text content — per brand guidelines, no exclamation points'
    );
  }

  // --- 8. Phone number matches source of truth if present ---
  // Match common phone number patterns: (NXX) NXX-XXXX or NXX-NXX-XXXX
  const phoneRegex = /\(\d{3}\)\s*\d{3}-\d{4}|\d{3}-\d{3}-\d{4}/g;
  const phoneMatches = code.match(phoneRegex);
  if (phoneMatches) {
    const correctPhone = facts.phone; // "(775) 230-4767"
    // Normalize to digits-only for comparison so "775-230-4767" matches "(775) 230-4767"
    const correctDigits = correctPhone.replace(/\D/g, "");
    const wrongNumbers = phoneMatches.filter((n) => {
      return n.replace(/\D/g, "") !== correctDigits;
    });
    if (wrongNumbers.length > 0) {
      errors.push(
        `Phone number mismatch: found "${wrongNumbers[0]}" but expected "${correctPhone}"`
      );
    }
  }

  // --- 9. Email matches source of truth if present ---
  const emailRegex = /[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi;
  const emailMatches = code.match(emailRegex);
  if (emailMatches) {
    const correctEmail = facts.email.toLowerCase();
    const wrongEmails = emailMatches.filter(
      (e) => e.toLowerCase() !== correctEmail
    );
    if (wrongEmails.length > 0) {
      errors.push(
        `Email address mismatch: found "${wrongEmails[0]}" but expected "${facts.email}"`
      );
    }
  }

  // --- 10. At least 2 H2 headings ---
  // Match <h2> tags (JSX) or ## (markdown in backtick strings)
  const h2TagCount = (contentBlock || code).match(/<h2[\s>]/gi)?.length ?? 0;
  const h2MdCount = contentBlock
    ? (contentBlock.match(/^##\s+/gm)?.length ?? 0)
    : 0;
  const totalH2 = h2TagCount + h2MdCount;

  if (totalH2 < 2) {
    errors.push(
      `Insufficient H2 headings: found ${totalH2} (minimum 2 required for content structure)`
    );
  }

  // --- 11. Target keyword present if provided ---
  const { targetKeyword } = metadata;
  if (targetKeyword && targetKeyword.trim()) {
    const keywordLower = targetKeyword.toLowerCase();
    const codeLower = code.toLowerCase();
    if (!codeLower.includes(keywordLower)) {
      // Check if all significant words appear individually
      const stopWords = new Set(["a", "an", "the", "in", "on", "of", "for", "and", "or", "to", "is", "at", "by", "how"]);
      const words = keywordLower.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
      const missingWords = words.filter(w => !codeLower.includes(w));
      if (missingWords.length > 0) {
        errors.push(
          `Target keyword "${targetKeyword}" not found in content (missing words: ${missingWords.join(", ")})`
        );
      }
    }
  }

  // --- 12. Internal links reference valid-looking routes (start with /) ---
  // Match Link to="..." or Link to='...' patterns
  const linkToRegex = /<Link\s[^>]*\bto\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let linkMatch;
  const badLinks = [];
  while ((linkMatch = linkToRegex.exec(code)) !== null) {
    const href = linkMatch[1] ?? linkMatch[2];
    if (href && !href.startsWith("/")) {
      badLinks.push(href);
    }
  }
  if (badLinks.length > 0) {
    errors.push(
      `Internal link(s) do not start with "/": ${badLinks.map((l) => `"${l}"`).join(", ")}`
    );
  }

  return {
    passed: errors.length === 0,
    errors,
  };
}
