import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
  description: "All posts.",
};

export default function WritingIndexPage() {
  const posts = getAllPosts();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Writing</h1>
      <ul className="mt-8 space-y-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/writing/${post.slug}`}
              className="text-lg font-medium underline"
            >
              {post.title}
            </Link>
            <p className="text-sm text-neutral-500">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" · "}
              {post.readingMinutes} min read
              {post.draft ? " · draft" : ""}
            </p>
            <p className="text-neutral-700">{post.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
