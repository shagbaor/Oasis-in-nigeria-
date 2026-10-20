import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPublishedPost, type PostKind } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { fileUrl, formatBytes } from "@/lib/uploads";

const SECTIONS: Record<PostKind, { href: string; label: string }> = {
  blog: { href: "/blog", label: "All posts" },
  research: { href: "/research", label: "All research" },
};

export async function postMetadata(kind: PostKind, slug: string): Promise<Metadata> {
  const post = await getPublishedPost(kind, slug);
  if (!post) return { title: "Not found" };
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

export async function PostArticle({ kind, slug }: { kind: PostKind; slug: Promise<string> }) {
  const post = await getPublishedPost(kind, await slug);
  if (!post) notFound();
  const section = SECTIONS[kind];

  return (
    <article className="post">
      <header className="page-hero">
        <div className="container container-narrow">
          <Link href={section.href} className="back-link">
            ← {section.label}
          </Link>
          {kind === "research" && <p className="label">Research</p>}
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
        {post.pdf_file_id && post.pdf_name && (
          <aside className="download-box">
            <div>
              <strong>Download the full {kind === "research" ? "report" : "document"}</strong>
              <span className="muted small">
                PDF{post.pdf_size ? ` · ${formatBytes(post.pdf_size)}` : ""}
              </span>
            </div>
            <div className="download-actions">
              <a className="btn btn-outline" href={fileUrl(post.pdf_file_id, post.pdf_name)} target="_blank" rel="noreferrer">
                Open
              </a>
              <a className="btn" href={`${fileUrl(post.pdf_file_id, post.pdf_name)}?download`} download={post.pdf_name}>
                Download PDF
              </a>
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
