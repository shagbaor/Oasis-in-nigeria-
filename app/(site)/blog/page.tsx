import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { PostCard } from "@/components/PostCard";
import { listPublishedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories, news and updates from OASIS.",
};

async function PostList() {
  await connection();
  const posts = await listPublishedPosts();

  if (posts.length === 0) {
    return <p className="muted empty">No posts yet. Check back soon!</p>;
  }
  return (
    <div className="cards cards-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default function BlogPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Stories &amp; updates</p>
          <h1>The OASIS Blog</h1>
          <p className="lead">News from our programmes, voices from our community, and ways to take action.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Suspense fallback={<p className="muted empty">Loading posts…</p>}>
            <PostList />
          </Suspense>
        </div>
      </section>
    </>
  );
}
