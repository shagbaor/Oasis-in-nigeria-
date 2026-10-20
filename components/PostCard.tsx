import Link from "next/link";
import { postPath, type PostSummary } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { Highlight, Snippet } from "./Highlight";

// `query` and `snippet` are set when the card is a search result.
export function PostCard({ post, query, snippet }: { post: PostSummary; query?: string; snippet?: string | null }) {
  const hasMatchInSnippet = Boolean(snippet && /⁣\[/.test(snippet));
  return (
    <article className="card post-card">
      {post.cover_image_url && (
        // Cover images are uploads or external URLs, so next/image sizing doesn't apply.
        // eslint-disable-next-line @next/next/no-img-element
        <img className="post-card-cover" src={post.cover_image_url} alt="" loading="lazy" />
      )}
      <div className="post-card-body">
        {post.kind === "research" && <span className="tag">Research{post.pdf_file_id ? " · PDF" : ""}</span>}
        <time className="post-date" dateTime={post.published_at ? new Date(post.published_at).toISOString() : undefined}>
          {formatDate(post.published_at)}
        </time>
        <h3>
          <Link href={postPath(post)}>{query ? <Highlight text={post.title} query={query} /> : post.title}</Link>
        </h3>
        {post.excerpt && <p>{query ? <Highlight text={post.excerpt} query={query} /> : post.excerpt}</p>}
        {hasMatchInSnippet && (
          <p className="search-snippet">
            …<Snippet text={snippet!.trim()} />…
          </p>
        )}
      </div>
    </article>
  );
}
