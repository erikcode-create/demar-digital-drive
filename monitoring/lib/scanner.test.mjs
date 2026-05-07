import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchHeaders, fetchPage } from "./scanner.mjs";

describe("scanner fetch helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends browser-compatible headers when fetching headers", async () => {
    let requestOptions;
    vi.stubGlobal("fetch", async (_url, options) => {
      requestOptions = options;
      return new Response("", { status: 200, headers: { "x-test": "ok" } });
    });

    await fetchHeaders("https://example.test");

    expect(requestOptions.headers.accept).toContain("text/html");
    expect(requestOptions.headers["accept-language"]).toContain("en-US");
    expect(requestOptions.headers["user-agent"]).toContain("DeMarScanner");
  });

  it("sends browser-compatible headers when fetching pages", async () => {
    let requestOptions;
    vi.stubGlobal("fetch", async (_url, options) => {
      requestOptions = options;
      return new Response("<!doctype html><title>ok</title>", {
        status: 200,
        headers: { "content-type": "text/html" },
      });
    });

    await fetchPage("https://example.test");

    expect(requestOptions.headers.accept).toContain("text/html");
    expect(requestOptions.headers["accept-language"]).toContain("en-US");
    expect(requestOptions.headers["user-agent"]).toContain("DeMarScanner");
  });
});
