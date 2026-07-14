import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";

vi.mock("node:fs");

const mockFs = vi.mocked(fs);

function frontmatter(body: Record<string, string>): string {
  return Object.entries(body)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

function mdx(fields: Record<string, string>, content = "Hello there."): string {
  return `---\n${frontmatter(fields)}\n---\n${content}\n`;
}

const validFields = {
  title: '"Hello, World"',
  description: '"A description."',
  date: '"2026-01-15"',
  tags: '["meta", "test"]',
  draft: "false",
};

function mockFiles(files: Record<string, string>) {
  mockFs.readdirSync.mockReturnValue(
    Object.keys(files) as unknown as ReturnType<typeof fs.readdirSync>,
  );
  mockFs.readFileSync.mockImplementation((filePath) => {
    const filename = String(filePath).split(/[\\/]/).pop()!;
    if (filename in files) return files[filename];
    throw new Error(`ENOENT: ${filePath}`);
  });
  mockFs.existsSync.mockImplementation((filePath) => {
    const filename = String(filePath).split(/[\\/]/).pop()!;
    return filename in files;
  });
}

let getAllPosts: typeof import("./posts").getAllPosts;
let getPostBySlug: typeof import("./posts").getPostBySlug;

beforeEach(async () => {
  vi.resetModules();
  ({ getAllPosts, getPostBySlug } = await import("./posts"));
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("getAllPosts", () => {
  it("returns a fully-shaped Post for valid frontmatter", () => {
    mockFiles({ "hello-world.mdx": mdx(validFields, "one two three") });

    const posts = getAllPosts();

    expect(posts).toEqual([
      {
        slug: "hello-world",
        title: "Hello, World",
        description: "A description.",
        date: new Date("2026-01-15").toISOString(),
        tags: ["meta", "test"],
        draft: false,
        readingMinutes: 1,
        content: "one two three\n",
      },
    ]);
  });

  it("floors reading time at 1 minute for empty content", () => {
    mockFiles({ "empty.mdx": mdx(validFields, "") });

    const [post] = getAllPosts();

    expect(post.readingMinutes).toBe(1);
  });

  it("accepts an empty tags array", () => {
    mockFiles({ "no-tags.mdx": mdx({ ...validFields, tags: "[]" }) });

    const [post] = getAllPosts();

    expect(post.tags).toEqual([]);
  });

  it.each([
    ["title", { ...validFields, title: '""' }],
    ["description", { ...validFields, description: '""' }],
    ["date", { ...validFields, date: '""' }],
    ["tags", { ...validFields, tags: '"not-an-array"' }],
    ["draft", { ...validFields, draft: '"true"' }],
  ])("throws when %s is missing or malformed", (field, fields) => {
    mockFiles({ "bad.mdx": mdx(fields) });

    expect(() => getAllPosts()).toThrowError(
      `Post "bad" is missing required frontmatter field: ${field}`,
    );
  });

  it("sorts posts by date descending", () => {
    mockFiles({
      "older.mdx": mdx({ ...validFields, date: '"2025-01-01"' }),
      "newer.mdx": mdx({ ...validFields, date: '"2026-01-01"' }),
    });

    const posts = getAllPosts();

    expect(posts.map((p) => p.slug)).toEqual(["newer", "older"]);
  });

  it("excludes drafts in production but includes them otherwise", () => {
    mockFiles({ "draft.mdx": mdx({ ...validFields, draft: "true" }) });

    expect(getAllPosts()).toHaveLength(1);

    vi.stubEnv("NODE_ENV", "production");

    expect(getAllPosts()).toHaveLength(0);
  });
});

describe("getPostBySlug", () => {
  it("returns null when the file does not exist", () => {
    mockFiles({});

    expect(getPostBySlug("missing")).toBeNull();
  });

  it("returns the post when it exists and is visible", () => {
    mockFiles({ "hello-world.mdx": mdx(validFields) });

    expect(getPostBySlug("hello-world")?.slug).toBe("hello-world");
  });

  it("returns null for a draft in production", () => {
    mockFiles({ "draft.mdx": mdx({ ...validFields, draft: "true" }) });
    vi.stubEnv("NODE_ENV", "production");

    expect(getPostBySlug("draft")).toBeNull();
  });
});
