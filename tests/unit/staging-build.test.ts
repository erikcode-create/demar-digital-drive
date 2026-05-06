import { describe, expect, test } from "vitest";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const stagingBuildModule = () =>
  import(pathToFileURL(join(process.cwd(), "scripts/prepare-staging-build.mjs")).href);

describe("prepareStagingBuild", () => {
  test("blocks indexing and adds a staging X-Robots-Tag header", async () => {
    const { prepareStagingBuild } = await stagingBuildModule();
    const distDir = mkdtempSync(join(tmpdir(), "demar-staging-dist-"));

    try {
      writeFileSync(
        join(distDir, ".htaccess"),
        [
          "# === Security Headers ===",
          'Header always set X-Frame-Options "DENY"',
          "",
          "# === SPA Fallback ===",
          "RewriteRule ^ /index.html [L]",
          "",
        ].join("\n"),
      );

      prepareStagingBuild(distDir);

      expect(readFileSync(join(distDir, "robots.txt"), "utf8")).toBe(
        ["User-agent: *", "Disallow: /", ""].join("\n"),
      );
      expect(readFileSync(join(distDir, ".htaccess"), "utf8")).toContain(
        'Header always set X-Robots-Tag "noindex, nofollow, noarchive"',
      );
    } finally {
      rmSync(distDir, { recursive: true, force: true });
    }
  });

  test("is idempotent when run more than once", async () => {
    const { prepareStagingBuild } = await stagingBuildModule();
    const distDir = mkdtempSync(join(tmpdir(), "demar-staging-dist-"));

    try {
      mkdirSync(distDir, { recursive: true });

      prepareStagingBuild(distDir);
      prepareStagingBuild(distDir);

      const htaccess = readFileSync(join(distDir, ".htaccess"), "utf8");
      const matches = htaccess.match(/X-Robots-Tag/g) ?? [];
      expect(matches).toHaveLength(1);
    } finally {
      rmSync(distDir, { recursive: true, force: true });
    }
  });
});

describe("staging deploy workflow", () => {
  test("deploys to a separate staging directory and prepares noindex output", () => {
    const workflow = readFileSync(
      join(process.cwd(), ".github/workflows/deploy-staging.yml"),
      "utf8",
    );

    expect(workflow).toContain("node scripts/prepare-staging-build.mjs");
    expect(workflow).toContain("STAGING_SSH_TARGET_DIR");
    expect(workflow).toContain("dist/ \"$SSH_USERNAME@$SSH_HOST:$STAGING_SSH_TARGET_DIR/\"");
    expect(workflow).not.toContain("~/public_html/");
  });
});
