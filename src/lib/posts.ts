import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const WRITING_DIR = path.join(process.cwd(), "content", "writing");
const WORDS_PER_MINUTE = 238;

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
  readingMinutes: number;
  content: string;
};

function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function loadPost(filename: string): Post {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(WRITING_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const { title, description, date, tags, draft } = data;

  if (typeof title !== "string" || title.length === 0) {
    throw new Error(
      `Post "${slug}" is missing required frontmatter field: title`,
    );
  }
  if (typeof description !== "string" || description.length === 0) {
    throw new Error(
      `Post "${slug}" is missing required frontmatter field: description`,
    );
  }
  if (!date) {
    throw new Error(
      `Post "${slug}" is missing required frontmatter field: date`,
    );
  }
  if (!Array.isArray(tags)) {
    throw new Error(
      `Post "${slug}" is missing required frontmatter field: tags`,
    );
  }
  if (typeof draft !== "boolean") {
    throw new Error(
      `Post "${slug}" is missing required frontmatter field: draft`,
    );
  }

  const isoDate = new Date(date).toISOString();

  return {
    slug,
    title,
    description,
    date: isoDate,
    tags,
    draft,
    readingMinutes: readingMinutes(content),
    content,
  };
}

function isVisible(post: Post): boolean {
  return !post.draft || process.env.NODE_ENV !== "production";
}

export function getAllPosts(): Post[] {
  const filenames = fs
    .readdirSync(WRITING_DIR)
    .filter((f) => f.endsWith(".mdx"));
  return filenames
    .map(loadPost)
    .filter(isVisible)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(WRITING_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const post = loadPost(path.basename(filePath));
  return isVisible(post) ? post : null;
}
