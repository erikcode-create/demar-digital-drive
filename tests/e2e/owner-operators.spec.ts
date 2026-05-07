import { test, expect } from "@playwright/test";

test.describe("Owner operators page", () => {
  test("loads from top navigation with required recruiting copy", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    if (test.info().project.name.includes("mobile")) {
      await page.getByRole("button", { name: "Toggle menu" }).click();
    }

    const navLink = page.getByRole("link", { name: "Owner Operators" }).first();
    await expect(navLink).toBeVisible();

    await navLink.click();
    await expect(page).toHaveURL(/\/owner-operators\/?$/);
    await expect(page.getByRole("heading", { name: /Keep 90% of profits/i })).toBeVisible();
    await expect(page.getByText(/weekly settlement statements/i).first()).toBeVisible();
    await expect(page.getByText(/fuel discounts/i).first()).toBeVisible();
    await expect(page.getByText(/insurance savings/i).first()).toBeVisible();
    await expect(page.getByText(/full dispatch/i).first()).toBeVisible();
    await expect(page.getByText(/back office/i).first()).toBeVisible();
    await expect(page.getByText(/pay for and maintain your own truck/i)).toBeVisible();
  });

  test("submits the dedicated owner-operator signup form", async ({ page }) => {
    let submittedPayload: Record<string, unknown> | null = null;

    await page.route("**/functions/v1/send-owner-operator-signup", async (route) => {
      submittedPayload = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto("/owner-operators");
    await page.waitForLoadState("networkidle");

    await page.getByLabel("First Name *").fill("Alex");
    await page.getByLabel("Last Name *").fill("Rivera");
    await page.getByLabel("Email *").fill("alex@example.com");
    await page.getByLabel("Phone *").fill("7755551212");
    await page.getByLabel("City *").fill("Reno");
    await page.getByLabel("State *").selectOption("NV");
    await page.getByLabel("Years CDL-A Experience *").selectOption("6-10 years");
    await page.getByLabel("Truck Type *").selectOption("Sleeper Tractor");
    await page.getByLabel("Trailer Access *").selectOption("I need trailer options");
    await page.getByLabel("Current Operating Status *").selectOption("Ready to lease on");
    await page.getByLabel("Preferred Start Timeframe *").selectOption("Within 30 days");
    await page.getByLabel("Notes").fill("Interested in Western regional freight.");

    await page.getByRole("button", { name: /submit signup/i }).click();

    await expect(page.getByText("Signup received. Our recruiting team will contact you soon.")).toBeVisible();
    expect(submittedPayload).toMatchObject({
      firstName: "Alex",
      lastName: "Rivera",
      email: "alex@example.com",
      phone: "7755551212",
      city: "Reno",
      state: "NV",
      yearsExperience: "6-10 years",
      truckType: "Sleeper Tractor",
      trailerAccess: "I need trailer options",
      operatingStatus: "Ready to lease on",
      startTimeframe: "Within 30 days",
      notes: "Interested in Western regional freight.",
    });
  });
});
