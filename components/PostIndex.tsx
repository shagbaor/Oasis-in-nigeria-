import { Suspense } from "react";
import { connection } from "next/server";
import { PostCard } from "./PostCard";
import { SearchBox } from "./SearchBox";
import { listPublishedPosts, searchPublishedPosts, type PostKind } from "@/lib/posts";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const firstValue = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

async function PostList({ kind, searchParams }: { kind: PostKind; searchParams: SearchParams }) {
  await connection();
  const q = firstValue((await searchParams).q).trim().slice(0, 100);
  const noun = kind === "research" ? "research" : "posts";

  if (!q) {
    const posts = await listPublishedPosts(kind);
    if (posts.length === 0) return <p className="muted empty">Nothing published yet. Check back soon!</p>;
    return (
      <div className="cards cards-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    );
  }

  const results = await searchPublishedPosts(kind, q);
  return (
    <>
      <p className="search-summary" role="status">
        {results.length === 0 ? "No" : results.length} {kind === "research" ? "result" : "post"}
        {results.length === 1 ? "" : "s"} for “{q}”
      </p>
      {results.length === 0 ? (
        <p className="muted empty">Try different or fewer words, or browse all {noun}.</p>
      ) : (
        <div className="cards cards-3">
          {results.map((post) => (
            <PostCard key={post.id} post={post} query={q} snippet={post.snippet} />
          ))}
        </div>
      )}
    </>
  );
}

export function PostIndex({
  kind,
  eyebrow,
  title,
  lead,
  searchParams,
}: {
  kind: PostKind;
  eyebrow: string;
  title: string;
  lead: string;
  searchParams: SearchParams;
}) {
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
          <div className="search-bar">
            <Suspense fallback={<div className="search-box" />}>
              <SearchBox
                label={kind === "research" ? "Search research" : "Search the blog"}
                placeholder={kind === "research" ? "Search research…" : "Search the blog…"}
              />
            </Suspense>
          </div>
          <Suspense fallback={<p className="muted empty">Loading…</p>}>
            <PostList kind={kind} searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
