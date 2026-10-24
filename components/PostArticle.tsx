import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  KIND_INFO,
  getPostForPreview,
  getPublishedPost,
  listPublishedPosts,
  postPath,
  postStatus,
  type PdfFile,
  type Post,
  type PostKind,
} from "@/lib/posts";
import { pageMetadata } from "@/lib/seo";
import { isAdmin } from "@/lib/session";
import { formatDate } from "@/lib/format";
import { fileUrl, formatBytes } from "@/lib/uploads";
import { AdminEditBar } from "./AdminEditBar";
import { PostCard } from "./PostCard";
import { ArticleJsonLd } from "./StructuredData";

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
    description: post.excerpt || plainSummary(post.content) || `${KIND_INFO[kind].label} from OASIS.`,
    type: "article",
    images: post.cover_image_url ? [post.cover_image_url] : undefined,
  });
}

export async function PostArticle({ kind, slug }: { kind: PostKind; slug: Promise<string> }) {
  const postSlug = await slug;
  // Drafts and scheduled posts are hidden from the public, but admins can preview them.
  const post = (await getPublishedPost(kind, postSlug)) ?? ((await isAdmin()) ? await getPostForPreview(kind, postSlug) : null);
  if (!post) notFound();
  const info = KIND_INFO[kind];
  const status = postStatus(post);
  const pdfs = pdfFiles(post);

  return (
    <article className={`post post-${kind}`}>
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
      <header className="page-hero post-hero">
        <div className="container container-narrow">
          <Link href={info.href} className="back-link">
            ← All {kind === "research" ? "publications" : "posts"}
          </Link>
          <p className="label">{info.label}</p>
          <h1>{post.title}</h1>
          {post.excerpt && <p className="lead post-standfirst">{post.excerpt}</p>}
          <p className="post-meta">
            <time dateTime={post.published_at ? new Date(post.published_at).toISOString() : undefined}>
              {formatDate(post.published_at)}
            </time>
            <span>{post.reading_minutes} min read</span>
          </p>
          {pdfs.length > 0 && (
            <a href="#download" className="btn btn-light btn-small post-pdf-jump">
              Download PDF
              <span className="post-pdf-languages">
                {pdfs.length > 3 ? `${pdfs.length} languages` : pdfs.map((f) => f.language).join(", ")}
              </span>
            </a>
          )}
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
        {pdfs.length > 0 && (
          <aside className="download-box" id="download" aria-labelledby="download-heading">
            <h2 id="download-heading">Download the full {kind === "research" ? "publication" : "document"}</h2>
            {pdfs.length > 1 && <p className="muted small">Available in {pdfs.length} languages. Choose the one you prefer.</p>}
            <ul className="download-list">
              {pdfs.map((file) => (
                <li key={file.id} lang={LANGUAGE_CODES[file.language.toLowerCase()]}>
                  <div>
                    <strong>{file.language}</strong>
                    <span className="muted small">PDF{file.size ? ` · ${formatBytes(file.size)}` : ""}</span>
                  </div>
                  <div className="download-actions">
                    <a
                      className="btn btn-outline btn-small"
                      href={fileUrl(file.id, file.name)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open the ${file.language} PDF`}
                    >
                      Open
                    </a>
                    <a
                      className="btn btn-small"
                      href={`${fileUrl(file.id, file.name)}?download`}
                      download={file.name}
                      aria-label={`Download the ${file.language} PDF`}
                    >
                      Download
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        )}
        <p className="post-back">
          <Link href={info.href} className="link-arrow">
            Back to all {kind === "research" ? "publications" : "posts"}
          </Link>
        </p>
      </div>
      {status === "published" && <KeepReading kind={kind} currentId={post.id} />}
    </article>
  );
}

// Codes for the lang attribute, so screen readers pronounce language names correctly.
const LANGUAGE_CODES: Record<string, string> = {
  english: "en",
  hausa: "ha",
  yoruba: "yo",
  igbo: "ig",
  "nigerian pidgin": "pcm",
  ijaw: "ijc",
  efik: "efi",
  ibibio: "ibb",
  tiv: "tiv",
  kanuri: "kr",
  fulfulde: "ff",
  french: "fr",
  arabic: "ar",
};

// The main PDF followed by the same document in other languages.
function pdfFiles(post: Post): PdfFile[] {
  if (!post.pdf_file_id || !post.pdf_name) return [];
  return [
    { id: post.pdf_file_id, name: post.pdf_name, size: post.pdf_size ?? 0, language: post.pdf_language },
    ...post.translations,
  ];
}

async function KeepReading({ kind, currentId }: { kind: PostKind; currentId: number }) {
  const others = (await listPublishedPosts(kind, 4)).filter((p) => p.id !== currentId).slice(0, 3);
  if (others.length === 0) return null;
  return (
    <section className="section section-white keep-reading" aria-labelledby="keep-reading-heading">
      <div className="container">
        <div className="section-head section-head-row">
          <h2 id="keep-reading-heading">{kind === "research" ? "More publications" : "Keep reading"}</h2>
          <Link href={KIND_INFO[kind].href} className="link-arrow">
            All {kind === "research" ? "publications" : "posts"}
          </Link>
        </div>
        <div className="cards cards-3">
          {others.map((other) => (
            <PostCard key={other.id} post={other} />
          ))}
        </div>
      </div>
    </section>
  );
}
