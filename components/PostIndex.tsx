import { Suspense } from "react";
import { connection } from "next/server";
import { PostCard } from "./PostCard";
import { listPublishedPosts, type PostKind } from "@/lib/posts";

async function PostList({ kind }: { kind: PostKind }) {
  await connection();
  const posts = await listPublishedPosts(kind);

  if (posts.length === 0) {
    return <p className="muted empty">Nothing published yet. Check back soon!</p>;
  }
  return (
    <div className="cards cards-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export function PostIndex({ kind, eyebrow, title, lead }: { kind: PostKind; eyebrow: string; title: string; lead: string }) {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="label">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="lead">{lead}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Suspense fallback={<p className="muted empty">Loading…</p>}>
            <PostList kind={kind} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
