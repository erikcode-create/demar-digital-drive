import { describe, expect, it } from "vitest";
import { evaluateSensitivePathResponse, isBotChallengeBody } from "./security.mjs";

describe("evaluateSensitivePathResponse", () => {
  it("treats SPA fallback HTML as not exposed", async () => {
    const response = new Response(
      '<!DOCTYPE html><html><body><div id="root"></div><script type="module" src="/assets/index.js"></script></body></html>',
      {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      },
    );

    const check = await evaluateSensitivePathResponse("/.env.local", response);

    expect(check).toMatchObject({
      name: "Exposed: /.env.local",
      status: "pass",
      confidence: "VERIFIED",
    });
    expect(check.detail).toContain("SPA fallback");
  });

  it("fails when a sensitive path returns file contents", async () => {
    const response = new Response("VITE_PUBLIC_KEY=abc123", {
      status: 200,
      headers: { "content-type": "text/plain" },
    });

    const check = await evaluateSensitivePathResponse("/.env.local", response);

    expect(check).toMatchObject({
      name: "Exposed: /.env.local",
      status: "fail",
      detail: "/.env.local is publicly accessible (HTTP 200)",
      confidence: "VERIFIED",
    });
  });

  it("marks bot challenges as unable to verify", async () => {
    const response = new Response("<title>One moment, please...</title><script>wsidchk</script>", {
      status: 200,
      headers: { "content-type": "text/html" },
    });

    const check = await evaluateSensitivePathResponse("/source.map", response);

    expect(check).toMatchObject({
      name: "Exposed: /source.map",
      status: "warn",
      confidence: "UNABLE_TO_VERIFY",
    });
    expect(isBotChallengeBody("<title>One moment, please...</title>")).toBe(true);
  });
});
