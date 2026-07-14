import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/.+/);
});

test("shared chrome renders on every page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator("header").getByRole("link")).toHaveCount(0);
  await expect(page.locator("main#main")).toBeVisible();
});

test("sidebar nav links to every section", async ({ page }) => {
  await page.goto("/writing/hello-world");
  await page.getByRole("button", { name: /open menu/i }).click();

  const nav = page.getByRole("navigation");
  const home = nav.getByRole("link", { name: "Home" });
  const writing = nav.getByRole("link", { name: "Writing" });
  await expect(home).toHaveAttribute("href", "/");
  await expect(writing).toHaveAttribute("href", "/writing");

  await writing.click();
  await expect(page).toHaveURL(/\/writing$/);
  await expect(nav).toBeHidden();
});

test("theme toggle switches and persists across reload", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /^Theme:/ });

  await trigger.click();
  await page.getByRole("menuitemradio", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: /^Theme:/ }).click();
  await page.getByRole("menuitemradio", { name: "System" }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    /light|dark/,
  );
});

test("writing index loads and lists a published post", async ({ page }) => {
  const response = await page.goto("/writing");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("link", { name: /hello, world/i })).toBeVisible();
});

test("published post page loads", async ({ page }) => {
  const response = await page.goto("/writing/hello-world");
  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { name: /hello, world/i }),
  ).toBeVisible();
});

test("draft post 404s in production", async ({ page }) => {
  const response = await page.goto("/writing/notes-on-drafts");
  expect(response?.status()).toBe(404);
});
