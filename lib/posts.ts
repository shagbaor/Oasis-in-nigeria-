import "server-only";
import { query } from "./db";
import { cleanupFiles, fileIdsIn } from "./files";

export const POST_KINDS = ["blog", "research"] as const;
export type PostKind = (typeof POST_KINDS)[number];

export type Post = {
  id: number;
  kind: PostKind;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  pdf_file_id: string | null;
  pdf_name: string | null;
  pdf_size: number | null;
  published: boolean;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type PostSummary = Pick<
  Post,
  | "id"
  | "kind"
  | "title"
  | "slug"
  | "excerpt"
  | "cover_image_url"
  | "pdf_file_id"
  | "published"
  | "published_at"
  | "updated_at"
>;

export type PostInput = Pick<
  Post,
  "kind" | "title" | "slug" | "excerpt" | "content" | "cover_image_url" | "pdf_file_id" | "published"
> & {
  // With published: a set time schedules the post (or backdates it). Null means "now",
  // keeping the original date if the post was already live.
  publish_at: Date | null;
};

export type PostStatus = "draft" | "scheduled" | "published";

// A post is on the public site once it is published and its publish time has passed.
const IS_LIVE = "(published AND published_at <= now())";

export function postStatus(post: Pick<Post, "published" | "published_at">, now = new Date()): PostStatus {
  if (!post.published) return "draft";
  return post.published_at && new Date(post.published_at) > now ? "scheduled" : "published";
}

export function postPath(post: Pick<Post, "kind" | "slug">) {
  return `/${post.kind === "research" ? "research" : "blog"}/${post.slug}`;
}

const SUMMARY_COLUMNS =
  "id, kind, title, slug, excerpt, cover_image_url, pdf_file_id, published, published_at, updated_at";

const POST_WITH_PDF = `
  SELECT p.*, f.name AS pdf_name, f.size AS pdf_size
  FROM posts p LEFT JOIN files f ON f.id = p.pdf_file_id AND f.complete`;

export function listPublishedPosts(kind: PostKind, limit = 50) {
  return query<PostSummary>(
    `SELECT ${SUMMARY_COLUMNS} FROM posts
     WHERE ${IS_LIVE} AND kind = $1 ORDER BY published_at DESC LIMIT $2`,
    [kind, limit],
  );
}

export async function getPublishedPost(kind: PostKind, slug: string) {
  const rows = await query<Post>(
    `${POST_WITH_PDF} WHERE p.slug = $1 AND p.kind = $2 AND p.published AND p.published_at <= now()`,
    [slug, kind],
  );
  return rows[0] ?? null;
}

// Any post with this address, whatever its status. Only for admin previews.
export async function getPostForPreview(kind: PostKind, slug: string) {
  const rows = await query<Post>(`${POST_WITH_PDF} WHERE p.slug = $1 AND p.kind = $2`, [slug, kind]);
  return rows[0] ?? null;
}

// Full-text search document: title matters most, then the summary, then the body.
// Kept identical to the posts_search_idx expression in db/schema.sql so the index is used.
const SEARCH_DOCUMENT = `(setweight(to_tsvector('english', coalesce(title, '')), 'A')
  || setweight(to_tsvector('english', coalesce(excerpt, '')), 'B')
  || setweight(to_tsvector('english', coalesce(content, '')), 'C'))`;

// Matches whole words (with stemming, e.g. "housing" finds "house") or any part of the title or summary.
const SEARCH_MATCH = `(${SEARCH_DOCUMENT} @@ websearch_to_tsquery('english', $1)
  OR title ILIKE $2 OR excerpt ILIKE $2)`;

const likePattern = (q: string) => `%${q.replace(/[\\%_]/g, "\\$&")}%`;

export type SearchResult = PostSummary & { snippet: string | null };

// Marks around matched words in search snippets; see components/Highlight.tsx.
export const MATCH_START = "\u2063[";
export const MATCH_END = "]\u2063";

export function searchPublishedPosts(kind: PostKind, q: string, limit = 50) {
  return query<SearchResult>(
    `SELECT ${SUMMARY_COLUMNS},
       ts_headline('english',
         regexp_replace(content, '!?\\[([^\\]]*)\\]\\([^)]*\\)|[#*_>\x60|-]+', ' \\1 ', 'g'),
         websearch_to_tsquery('english', $1),
         'MaxWords=28, MinWords=12, MaxFragments=1, StartSel=${MATCH_START}, StopSel=${MATCH_END}') AS snippet
     FROM posts
     WHERE ${IS_LIVE} AND kind = $3 AND ${SEARCH_MATCH}
     ORDER BY ts_rank(${SEARCH_DOCUMENT}, websearch_to_tsquery('english', $1)) DESC, published_at DESC
     LIMIT $4`,
    [q, likePattern(q), kind, limit],
  );
}

export type PostFilters = { q?: string; kind?: PostKind; status?: PostStatus };

export function listAllPosts({ q = "", kind, status }: PostFilters = {}) {
  const conditions = ["TRUE"];
  // Postgres rejects parameters a query doesn't use, so only send the search ones when searching.
  const params: unknown[] = q ? [q, likePattern(q)] : [];
  if (q) conditions.push(SEARCH_MATCH);
  if (kind) {
    params.push(kind);
    conditions.push(`kind = $${params.length}`);
  }
  if (status === "published") conditions.push(IS_LIVE);
  if (status === "scheduled") conditions.push("published AND published_at > now()");
  if (status === "draft") conditions.push("NOT published");
  return query<PostSummary>(
    `SELECT ${SUMMARY_COLUMNS} FROM posts WHERE ${conditions.join(" AND ")}
     ORDER BY ${q ? `ts_rank(${SEARCH_DOCUMENT}, websearch_to_tsquery('english', $1)) DESC, ` : ""}
       COALESCE(published_at, created_at) DESC`,
    params,
  );
}

export async function getPost(id: number) {
  const rows = await query<Post>(`${POST_WITH_PDF} WHERE p.id = $1`, [id]);
  return rows[0] ?? null;
}

function referencedFiles(post: Pick<Post, "content" | "cover_image_url" | "pdf_file_id">) {
  return [...fileIdsIn(post.content, post.cover_image_url), ...(post.pdf_file_id ? [post.pdf_file_id] : [])];
}

// published_at: drafts have none; a chosen time is used as given; otherwise keep the
// original date of an already-live post, or use now.
const PUBLISHED_AT = (publishedParam: string, atParam: string, existing: string) => `CASE
  WHEN NOT ${publishedParam} THEN NULL
  WHEN ${atParam}::timestamptz IS NOT NULL THEN ${atParam}::timestamptz
  WHEN ${existing} IS NOT NULL AND ${existing} <= now() THEN ${existing}
  ELSE now()
END`;

export async function createPost(input: PostInput) {
  const rows = await query<{ id: number }>(
    `INSERT INTO posts (kind, title, slug, excerpt, content, cover_image_url, pdf_file_id, published, published_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ${PUBLISHED_AT("$8", "$9", "NULL::timestamptz")})
     RETURNING id`,
    [
      input.kind,
      input.title,
      input.slug,
      input.excerpt,
      input.content,
      input.cover_image_url,
      input.pdf_file_id,
      input.published,
      input.publish_at?.toISOString() ?? null,
    ],
  );
  await cleanupFiles();
  return rows[0].id;
}

export async function updatePost(id: number, input: PostInput) {
  const before = await getPost(id);
  await query(
    `UPDATE posts SET
       kind = $2, title = $3, slug = $4, excerpt = $5, content = $6, cover_image_url = $7, pdf_file_id = $8,
       published = $9,
       published_at = ${PUBLISHED_AT("$9", "$10", "published_at")},
       updated_at = now()
     WHERE id = $1`,
    [
      id,
      input.kind,
      input.title,
      input.slug,
      input.excerpt,
      input.content,
      input.cover_image_url,
      input.pdf_file_id,
      input.published,
      input.publish_at?.toISOString() ?? null,
    ],
  );
  // Remove images or PDFs that were taken out of the post.
  await cleanupFiles(before ? referencedFiles(before) : []);
}

export async function deletePost(id: number) {
  const before = await getPost(id);
  await query("DELETE FROM posts WHERE id = $1", [id]);
  await cleanupFiles(before ? referencedFiles(before) : []);
}
