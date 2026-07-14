import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/.+/);
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
