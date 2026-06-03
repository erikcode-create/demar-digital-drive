import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const TEXT_EXTENSIONS = new Set([
  ".css",
  ".html",
  ".json",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".xml",
]);

// Directories that are gitignored, generated, or hold immutable historical
// logs — never part of what ships, so excluded from the recursive scan.
const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  ".git",
  "state",
  "pending",
  "history",
]);

const WEBSITE_PATHS = ["index.html", "public", "src"];

// The SEO automation generates and reviews website content. If it hardcodes
// the physical street address, a future agent run can re-inject it into the
// site — so the tracked automation source must stay address-free too.
const AUTOMATION_PATHS = ["monitoring"];

// Schema field names that imply a street-level PostalAddress. Forbidden in the
// served site (which uses only addressLocality/addressRegion), but allowed as
// plain field-name references in automation prompts — so website-scan only.
const FORBIDDEN_SCHEMA_FIELDS = ["streetAddress", "postalCode"];

// The literal physical address. Forbidden everywhere that ships or feeds the site.
const FORBIDDEN_ADDRESS_LITERALS = [
  "10471 Double R Blvd",
  "Double R Blvd",
  "Reno, NV 89521",
  "89521",
  "39.4631",
  "-119.773",
];

function collectTextFiles(targetPath: string): string[] {
  const stats = statSync(targetPath);

  if (stats.isFile()) {
    return TEXT_EXTENSIONS.has(path.extname(targetPath)) ? [targetPath] : [];
  }

  return readdirSync(targetPath)
    .filter((entry) => !SKIP_DIRS.has(entry))
    .flatMap((entry) => collectTextFiles(path.join(targetPath, entry)));
}

function findExposed(paths: string[], forbidden: string[]): string[] {
  const files = paths.flatMap((targetPath) => collectTextFiles(targetPath));

  return files.flatMap((file) => {
    const content = readFileSync(file, "utf8");

    return forbidden
      .filter((part) => content.includes(part))
      .map((part) => `${file}: ${part}`);
  });
}

describe("website address privacy", () => {
  it("does not expose the physical street address in served website source", () => {
    const exposed = findExposed(WEBSITE_PATHS, [
      ...FORBIDDEN_ADDRESS_LITERALS,
      ...FORBIDDEN_SCHEMA_FIELDS,
    ]);

    expect(exposed).toEqual([]);
  });

  it("does not hardcode the physical street address in SEO automation source", () => {
    const exposed = findExposed(AUTOMATION_PATHS, FORBIDDEN_ADDRESS_LITERALS);

    expect(exposed).toEqual([]);
  });
});
