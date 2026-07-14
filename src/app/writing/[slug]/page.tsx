import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { getHighlighter } from "@/lib/highlighter";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return {};
  }
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const highlighter = await getHighlighter();

  return (
    <article className="prose">
      <h1>{post.title}</h1>
      <p className="text-sm text-muted-foreground">
        {new Date(post.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        {" · "}
        {post.readingMinutes} min read
      </p>
      <MDXRemote
        source={post.content}
        options={{
          mdxOptions: {
            rehypePlugins: [
              [
                rehypeShikiFromHighlighter,
                highlighter,
                {
                  themes: {
                    light: "github-light-high-contrast",
                    dark: "github-dark-high-contrast",
                  },
                  defaultColor: false,
                },
              ],
            ],
          },
        }}
      />
    </article>
  );
}
