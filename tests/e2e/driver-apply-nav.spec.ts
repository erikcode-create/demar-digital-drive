import { expect, test } from "@playwright/test";

test.describe("Driver application navigation", () => {
  test("links directly from the header to the careers application form", async ({
    page,
  }, testInfo) => {
    await page.goto("/");

    const isMobile = testInfo.project.name.includes("mobile");
    if (isMobile) {
      await page.getByRole("button", { name: "Toggle menu" }).click();
    }

    const applyLink = page.getByRole("link", { name: "Drivers Apply Here" });
    await expect(applyLink).toBeVisible();
    await applyLink.click();

    await expect(page).toHaveURL(/\/careers#apply$/);
    await expect(
      page.getByRole("heading", { name: "Apply to Drive with DeMar" }),
    ).toBeVisible();

    const sectionBox = await page.locator("#apply").boundingBox();
    expect(sectionBox?.y).toBeGreaterThan(72);
  });
});
