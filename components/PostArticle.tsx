import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostForPreview, getPublishedPost, postPath, postStatus, type PostKind } from "@/lib/posts";
import { pageMetadata } from "@/lib/seo";
import { isAdmin } from "@/lib/session";
import { formatDate } from "@/lib/format";
import { fileUrl, formatBytes } from "@/lib/uploads";
import { AdminEditBar } from "./AdminEditBar";
import { ArticleJsonLd } from "./StructuredData";

const SECTIONS: Record<PostKind, { href: string; label: string }> = {
  blog: { href: "/blog", label: "All posts" },
  research: { href: "/research", label: "All research" },
};

// Plain-text opening of a post, for descriptions when it has no summary.
function plainSummary(markdown: string, max = 160) {
  const text = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…` : text;
}

export async function postMetadata(kind: PostKind, slug: string): Promise<Metadata> {
  const post = await getPublishedPost(kind, slug);
  // Drafts, scheduled posts and missing posts are never indexed.
  if (!post) return { title: "Not found", robots: { index: false, follow: false } };
  return pageMetadata({
    title: post.title,
    path: postPath(post),
    description: post.excerpt || plainSummary(post.content) || `${kind === "research" ? "Research" : "News"} from OASIS.`,
    type: "article",
    images: post.cover_image_url ? [post.cover_image_url] : undefined,
  });
}

export async function PostArticle({ kind, slug }: { kind: PostKind; slug: Promise<string> }) {
  const postSlug = await slug;
  // Drafts and scheduled posts are hidden from the public, but admins can preview them.
  const post = (await getPublishedPost(kind, postSlug)) ?? ((await isAdmin()) ? await getPostForPreview(kind, postSlug) : null);
  if (!post) notFound();
  const section = SECTIONS[kind];
  const status = postStatus(post);

  return (
    <article className="post">
      {status === "published" && (
        <ArticleJsonLd
          kind={kind}
          title={post.title}
          description={post.excerpt || plainSummary(post.content)}
          path={postPath(post)}
          image={post.cover_image_url}
          published={post.published_at}
          modified={post.updated_at}
        />
      )}
      <Suspense fallback={null}>
        <AdminEditBar postId={post.id} status={status} publishAt={post.published_at} />
      </Suspense>
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
