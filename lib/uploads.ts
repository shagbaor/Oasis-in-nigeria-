// Upload rules shared by the browser uploader and the server.

export const CHUNK_SIZE = 2 * 1024 * 1024;

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const PDF_TYPE = "application/pdf";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_PDF_BYTES = 25 * 1024 * 1024;

export function maxBytesFor(contentType: string) {
  if (contentType === PDF_TYPE) return MAX_PDF_BYTES;
  if (IMAGE_TYPES.includes(contentType)) return MAX_IMAGE_BYTES;
  return 0;
}

export function fileUrl(id: string, name: string) {
  return `/files/${id}/${encodeURIComponent(name)}`;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
