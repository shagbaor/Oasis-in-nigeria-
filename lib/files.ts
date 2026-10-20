import "server-only";
import { query } from "./db";
import { CHUNK_SIZE, maxBytesFor } from "./uploads";

export type FileMeta = {
  id: string;
  name: string;
  content_type: string;
  size: number;
  chunk_count: number;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FILE_URL_PATTERN = /\/files\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\//gi;

export function isFileId(value: string) {
  return UUID_PATTERN.test(value);
}

// File ids referenced by /files/<id>/ URLs in the given text.
export function fileIdsIn(...texts: (string | null | undefined)[]) {
  const ids = new Set<string>();
  for (const text of texts) {
    for (const match of (text ?? "").matchAll(FILE_URL_PATTERN)) ids.add(match[1].toLowerCase());
  }
  return [...ids];
}

function safeName(name: string) {
  const cleaned = name.replace(/[\\/:*?"<>|\u0000-\u001f]+/g, "-").trim().slice(0, 120);
  return cleaned || "file";
}

export async function createFile(name: string, contentType: string, size: number) {
  const max = maxBytesFor(contentType);
  if (!max) throw new UploadError("That file type isn't supported.");
  if (!Number.isInteger(size) || size <= 0) throw new UploadError("The file is empty.");
  if (size > max) throw new UploadError(`That file is too large (limit ${Math.round(max / 1024 / 1024)} MB).`);

  const rows = await query<{ id: string }>(
    "INSERT INTO files (name, content_type, size, chunk_count) VALUES ($1, $2, $3, $4) RETURNING id",
    [safeName(name), contentType, size, Math.ceil(size / CHUNK_SIZE)]
  );
  return rows[0].id;
}

async function getIncompleteFile(id: string) {
  const rows = await query<FileMeta>(
    "SELECT id, name, content_type, size, chunk_count FROM files WHERE id = $1 AND NOT complete",
    [id]
  );
  return rows[0] ?? null;
}

export async function putChunk(id: string, index: number, data: Buffer) {
  const file = await getIncompleteFile(id);
  if (!file) throw new UploadError("Upload not found.");
  if (!Number.isInteger(index) || index < 0 || index >= file.chunk_count) throw new UploadError("Invalid chunk.");

  const isLast = index === file.chunk_count - 1;
  const expected = isLast ? file.size - CHUNK_SIZE * (file.chunk_count - 1) : CHUNK_SIZE;
  if (data.length !== expected) throw new UploadError("Chunk has the wrong size.");

  // Sent as base64 text so the query works the same with every Postgres driver.
  await query(
    `INSERT INTO file_chunks (file_id, idx, data) VALUES ($1, $2, decode($3, 'base64'))
     ON CONFLICT (file_id, idx) DO UPDATE SET data = EXCLUDED.data`,
    [id, index, data.toString("base64")]
  );
}

export async function completeFile(id: string) {
  const rows = await query<{ id: string }>(
    `UPDATE files f SET complete = true
     WHERE id = $1 AND NOT complete
       AND (SELECT count(*) FROM file_chunks c WHERE c.file_id = f.id) = f.chunk_count
       AND (SELECT COALESCE(sum(length(c.data)), 0) FROM file_chunks c WHERE c.file_id = f.id) = f.size
     RETURNING id`,
    [id]
  );
  if (!rows[0]) throw new UploadError("The upload is incomplete. Please try again.");
}

export async function getFile(id: string) {
  if (!isFileId(id)) return null;
  const rows = await query<FileMeta>(
    "SELECT id, name, content_type, size, chunk_count FROM files WHERE id = $1 AND complete",
    [id]
  );
  return rows[0] ?? null;
}

export async function readChunk(id: string, index: number) {
  const rows = await query<{ data: string }>(
    "SELECT encode(data, 'base64') AS data FROM file_chunks WHERE file_id = $1 AND idx = $2",
    [id, index]
  );
  if (!rows[0]) throw new Error(`Missing chunk ${index} of file ${id}`);
  return Buffer.from(rows[0].data, "base64");
}

const UNREFERENCED = `NOT EXISTS (
  SELECT 1 FROM posts p
  WHERE p.pdf_file_id = f.id
     OR p.content LIKE '%' || f.id::text || '%'
     OR p.cover_image_url LIKE '%' || f.id::text || '%'
)`;

// Deletes the given files if no post uses them any more, plus any upload
// older than a day that was never used (e.g. the editor was closed without saving).
export async function cleanupFiles(candidateIds: string[] = []) {
  const ids = candidateIds.filter(isFileId);
  await query(
    `DELETE FROM files f
     WHERE (f.id = ANY(string_to_array($1, ',')::uuid[]) OR f.created_at < now() - interval '1 day')
       AND ${UNREFERENCED}`,
    [ids.join(",")]
  );
}

export async function storageUsed() {
  const rows = await query<{ bytes: string }>("SELECT COALESCE(sum(size), 0) AS bytes FROM files");
  return Number(rows[0].bytes);
}

export class UploadError extends Error {}
