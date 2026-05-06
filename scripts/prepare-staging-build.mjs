import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const STAGING_ROBOTS = ["User-agent: *", "Disallow: /", ""].join("\n");
export const STAGING_ROBOTS_HEADER =
  'Header always set X-Robots-Tag "noindex, nofollow, noarchive"';

function ensureHtaccessHasNoIndexHeader(htaccess) {
  if (htaccess.includes("X-Robots-Tag")) {
    return htaccess;
  }

  const stagingBlock = [
    "# === Staging Crawl Protection ===",
    STAGING_ROBOTS_HEADER,
    "",
  ].join("\n");

  if (htaccess.includes("# === Security Headers ===")) {
    return htaccess.replace(
      "# === Security Headers ===",
      `${stagingBlock}# === Security Headers ===`,
    );
  }

  return `${stagingBlock}${htaccess}`;
}

export function prepareStagingBuild(distDir = "dist") {
  const resolvedDistDir = resolve(distDir);

  if (!existsSync(resolvedDistDir)) {
    throw new Error(`Cannot prepare staging build because ${resolvedDistDir} does not exist.`);
  }

  writeFileSync(join(resolvedDistDir, "robots.txt"), STAGING_ROBOTS);

  const htaccessPath = join(resolvedDistDir, ".htaccess");
  const currentHtaccess = existsSync(htaccessPath)
    ? readFileSync(htaccessPath, "utf8")
    : "";

  writeFileSync(htaccessPath, ensureHtaccessHasNoIndexHeader(currentHtaccess));
}

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectRun) {
  prepareStagingBuild(process.argv[2] ?? "dist");
}
