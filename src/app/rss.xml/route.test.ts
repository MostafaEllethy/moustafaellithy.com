import { describe, expect, it, vi } from "vitest";
import type { Post } from "@/lib/posts";

const getAllPosts = vi.fn<() => Post[]>();

vi.mock("@/lib/posts", () => ({
  getAllPosts: () => getAllPosts(),
}));

function post(overrides: Partial<Post> = {}): Post {
  return {
    slug: "hello-world",
    title: "Hello, World",
    description: "A description.",
    date: "2026-01-15T00:00:00.000Z",
    tags: [],
    draft: false,
    readingMinutes: 1,
    content: "",
    ...overrides,
  };
}

describe("GET /rss.xml", () => {
  it("sets the XML content type", async () => {
    getAllPosts.mockReturnValue([]);
    const { GET } = await import("./route");

    const response = GET();

    expect(response.headers.get("Content-Type")).toBe(
      "application/xml; charset=utf-8",
    );
  });

  it("escapes reserved XML characters in title and description", async () => {
    getAllPosts.mockReturnValue([
      post({
        title: `Tom & Jerry <"quoted" & 'apostrophe'>`,
        description: `A & B < C > D "E" 'F'`,
      }),
    ]);
    const { GET } = await import("./route");

    const body = await GET().text();

    expect(body).toContain(
      "Tom &amp; Jerry &lt;&quot;quoted&quot; &amp; &apos;apostrophe&apos;&gt;",
    );
    expect(body).toContain(
      "A &amp; B &lt; C &gt; D &quot;E&quot; &apos;F&apos;",
    );
    expect(body).not.toMatch(/&amp;amp;/);
  });
});
