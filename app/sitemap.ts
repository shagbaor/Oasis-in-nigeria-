import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { SITE_URL } from "@/lib/identity";
import { listPublishedPosts, postPath, type PostSummary } from "@/lib/posts";

const PAGES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/our-work", priority: 0.9, changeFrequency: "monthly" },
  { path: "/publications", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/work-with-us", priority: 0.7, changeFrequency: "monthly" },
  { path: "/donate", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/policies", priority: 0.3, changeFrequency: "yearly" },
];

// Built per request so scheduled posts appear as soon as they go live.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();

  let posts: PostSummary[] = [];
  try {
    const [research, blog] = await Promise.all([listPublishedPosts("research", 1000), listPublishedPosts("blog", 1000)]);
    posts = [...research, ...blog];
  } catch (error) {
    console.error("sitemap: could not load posts", error);
  }

  return [
    ...PAGES.map(({ path, priority, changeFrequency }) => ({
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      changeFrequency,
      priority,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}${postPath(post)}`,
      lastModified: post.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
