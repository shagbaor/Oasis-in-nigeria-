import "server-only";
import { query } from "./db";

export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  published: boolean;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type PostSummary = Pick<
  Post,
  "id" | "title" | "slug" | "excerpt" | "cover_image_url" | "published" | "published_at" | "updated_at"
>;

export type PostInput = Pick<Post, "title" | "slug" | "excerpt" | "content" | "cover_image_url" | "published">;

const SUMMARY_COLUMNS = "id, title, slug, excerpt, cover_image_url, published, published_at, updated_at";

export function listPublishedPosts(limit = 50) {
  return query<PostSummary>(
    `SELECT ${SUMMARY_COLUMNS} FROM posts
     WHERE published ORDER BY published_at DESC LIMIT $1`,
    [limit]
  );
}

export async function getPublishedPost(slug: string) {
  const rows = await query<Post>("SELECT * FROM posts WHERE slug = $1 AND published", [slug]);
  return rows[0] ?? null;
}

export function listAllPosts() {
  return query<PostSummary>(
    `SELECT ${SUMMARY_COLUMNS} FROM posts ORDER BY COALESCE(published_at, created_at) DESC`
  );
}

export async function getPost(id: number) {
  const rows = await query<Post>("SELECT * FROM posts WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function createPost(input: PostInput) {
  const rows = await query<{ id: number }>(
    `INSERT INTO posts (title, slug, excerpt, content, cover_image_url, published, published_at)
     VALUES ($1, $2, $3, $4, $5, $6, CASE WHEN $6 THEN now() END)
     RETURNING id`,
    [input.title, input.slug, input.excerpt, input.content, input.cover_image_url, input.published]
  );
  return rows[0].id;
}

export async function updatePost(id: number, input: PostInput) {
  await query(
    `UPDATE posts SET
       title = $2, slug = $3, excerpt = $4, content = $5, cover_image_url = $6, published = $7,
       published_at = CASE WHEN $7 THEN COALESCE(published_at, now()) END,
       updated_at = now()
     WHERE id = $1`,
    [id, input.title, input.slug, input.excerpt, input.content, input.cover_image_url, input.published]
  );
}

export async function deletePost(id: number) {
  await query("DELETE FROM posts WHERE id = $1", [id]);
}
