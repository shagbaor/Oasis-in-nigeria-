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
  "id" | "kind" | "title" | "slug" | "excerpt" | "cover_image_url" | "pdf_file_id" | "published" | "published_at" | "updated_at"
>;

export type PostInput = Pick<
  Post,
  "kind" | "title" | "slug" | "excerpt" | "content" | "cover_image_url" | "pdf_file_id" | "published"
>;

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
     WHERE published AND kind = $1 ORDER BY published_at DESC LIMIT $2`,
    [kind, limit]
  );
}

export async function getPublishedPost(kind: PostKind, slug: string) {
  const rows = await query<Post>(`${POST_WITH_PDF} WHERE p.slug = $1 AND p.kind = $2 AND p.published`, [slug, kind]);
  return rows[0] ?? null;
}

export function listAllPosts() {
  return query<PostSummary>(
    `SELECT ${SUMMARY_COLUMNS} FROM posts ORDER BY COALESCE(published_at, created_at) DESC`
  );
}

export async function getPost(id: number) {
  const rows = await query<Post>(`${POST_WITH_PDF} WHERE p.id = $1`, [id]);
  return rows[0] ?? null;
}

function referencedFiles(post: Pick<Post, "content" | "cover_image_url" | "pdf_file_id">) {
  return [...fileIdsIn(post.content, post.cover_image_url), ...(post.pdf_file_id ? [post.pdf_file_id] : [])];
}

export async function createPost(input: PostInput) {
  const rows = await query<{ id: number }>(
    `INSERT INTO posts (kind, title, slug, excerpt, content, cover_image_url, pdf_file_id, published, published_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CASE WHEN $8 THEN now() END)
     RETURNING id`,
    [input.kind, input.title, input.slug, input.excerpt, input.content, input.cover_image_url, input.pdf_file_id, input.published]
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
       published_at = CASE WHEN $9 THEN COALESCE(published_at, now()) END,
       updated_at = now()
     WHERE id = $1`,
    [id, input.kind, input.title, input.slug, input.excerpt, input.content, input.cover_image_url, input.pdf_file_id, input.published]
  );
  // Remove images or PDFs that were taken out of the post.
  await cleanupFiles(before ? referencedFiles(before) : []);
}

export async function deletePost(id: number) {
  const before = await getPost(id);
  await query("DELETE FROM posts WHERE id = $1", [id]);
  await cleanupFiles(before ? referencedFiles(before) : []);
}
