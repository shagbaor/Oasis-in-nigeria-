// Browser-side uploader: shrinks large photos, then sends the file in chunks.
import { IMAGE_TYPES, PDF_TYPE, fileUrl, maxBytesFor } from "@/lib/uploads";

const MAX_IMAGE_SIDE = 1800;

export type UploadedFile = { id: string; name: string; size: number; url: string };

async function shrinkImage(file: File): Promise<File> {
  // GIFs may be animated, so leave them as they are.
  if (file.type === "image/gif") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) return file;
  context.fillStyle = "#ffffff"; // JPEG has no transparency
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  if (!blob || (scale === 1 && blob.size >= file.size)) return file;
  return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
}

async function send(url: string, init: RequestInit) {
  const response = await fetch(url, init);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? "Upload failed. Please try again.");
  return body;
}

export async function uploadFile(original: File, onProgress?: (fraction: number) => void): Promise<UploadedFile> {
  if (!IMAGE_TYPES.includes(original.type) && original.type !== PDF_TYPE) {
    throw new Error("Please choose a JPG, PNG, WebP or GIF image, or a PDF.");
  }
  const file = IMAGE_TYPES.includes(original.type) ? await shrinkImage(original) : original;
  const max = maxBytesFor(file.type);
  if (file.size > max) throw new Error(`That file is too large (limit ${Math.round(max / 1024 / 1024)} MB).`);

  const { id, chunkSize } = await send("/api/admin/files", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: file.name, type: file.type, size: file.size }),
  });

  const chunks = Math.ceil(file.size / chunkSize);
  for (let index = 0; index < chunks; index++) {
    const part = file.slice(index * chunkSize, (index + 1) * chunkSize);
    await send(`/api/admin/files/${id}?index=${index}`, {
      method: "PUT",
      headers: { "Content-Type": "application/octet-stream" },
      body: part,
    });
    onProgress?.((index + 1) / chunks);
  }
  await send(`/api/admin/files/${id}`, { method: "POST" });

  return { id, name: file.name, size: file.size, url: fileUrl(id, file.name) };
}
