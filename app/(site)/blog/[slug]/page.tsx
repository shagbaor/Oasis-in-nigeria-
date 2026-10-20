import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPublishedPost } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPublishedPost((await params).slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

async function PostContent({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const post = await getPublishedPost((await params).slug);
  if (!post) notFound();

  return (
    <article className="post">
      <header className="page-hero">
        <div className="container container-narrow">
          <Link href="/blog" className="back-link">
            ← All posts
          </Link>
          <h1>{post.title}</h1>
          <time className="post-date" dateTime={post.published_at ? new Date(post.published_at).toISOString() : undefined}>
            {formatDate(post.published_at)}
          </time>
        </div>
      </header>
      <div className="container container-narrow section-sm">
        {post.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="post-cover" src={post.cover_image_url} alt="" />
        )}
        <div className="markdown">
          <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
        </div>
      </div>
    </article>
  );
}

export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<div className="page-hero" />}>
      <PostContent params={params} />
    </Suspense>
  );
}
