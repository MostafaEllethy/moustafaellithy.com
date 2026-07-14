import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];

const ROUTES = [
  { name: "home page", path: "/" },
  { name: "writing index", path: "/writing" },
  { name: "article page", path: "/writing/hello-world" },
];

for (const { name, path } of ROUTES) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`${name} has no WCAG 2.2 AA violations (${colorScheme})`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(WCAG_TAGS)
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
}
