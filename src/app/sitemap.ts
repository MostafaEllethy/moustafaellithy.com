import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/writing`,
      lastModified: new Date(),
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/writing/${post.slug}`,
      lastModified: new Date(post.date),
    })),
  ];
}
