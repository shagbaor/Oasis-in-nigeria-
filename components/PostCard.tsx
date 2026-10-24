import Link from "next/link";
import { KIND_INFO, postPath, type PostSummary } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { Highlight, Snippet } from "./Highlight";
import { DocumentIcon, PenIcon } from "./Icons";

// Languages a publication's PDF can be read in, main language first.
export function pdfLanguages(post: Pick<PostSummary, "pdf_file_id" | "pdf_language" | "pdf_translations">) {
  if (!post.pdf_file_id) return [];
  return [post.pdf_language, ...post.pdf_translations.map((t) => t.language)];
}

// The whole tile is one link (the title's ::after covers it); the rest is visual.
// `query` and `snippet` are set when the card is a search result.
export function PostCard({ post, query, snippet }: { post: PostSummary; query?: string; snippet?: string | null }) {
  const hasMatchInSnippet = Boolean(snippet && /⁣\[/.test(snippet));
  const kind = KIND_INFO[post.kind];
  const languages = pdfLanguages(post);
  return (
    <article className={`card post-card post-card-${post.kind}`}>
      <div className="post-card-media">
        {post.cover_image_url ? (
          // Cover images are uploads or external URLs, so next/image sizing doesn't apply.
          // eslint-disable-next-line @next/next/no-img-element
          <img className="post-card-cover" src={post.cover_image_url} alt="" loading="lazy" />
        ) : (
          <div className="post-card-placeholder" aria-hidden="true">
            <span className="post-card-icon">
              {post.kind === "research" ? <DocumentIcon size={34} /> : <PenIcon size={34} />}
            </span>
          </div>
        )}
        <span className="post-card-badge">{kind.label}</span>
      </div>
      <div className="post-card-body">
        <p className="post-card-meta">
          <time dateTime={post.published_at ? new Date(post.published_at).toISOString() : undefined}>
            {formatDate(post.published_at)}
          </time>
          <span>{post.reading_minutes} min read</span>
        </p>
        <h3>
          <Link href={postPath(post)}>{query ? <Highlight text={post.title} query={query} /> : post.title}</Link>
        </h3>
        {post.excerpt && (
          <p className="post-card-excerpt">{query ? <Highlight text={post.excerpt} query={query} /> : post.excerpt}</p>
        )}
        {hasMatchInSnippet && (
          <p className="search-snippet">
            …<Snippet text={snippet!.trim()} />…
          </p>
        )}
        <div className="post-card-foot">
          <span className="post-card-cta" aria-hidden="true">
            {post.kind === "research" ? "Read publication" : "Read post"}
          </span>
          {languages.length > 0 && (
            <span className="post-card-pdf">
              PDF{languages.length > 1 ? ` · ${languages.length} languages` : ""}
              <span className="sr-only"> available in {languages.join(", ")}</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
