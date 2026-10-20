import { getFile, readChunk } from "@/lib/files";

// Serves an uploaded file, streaming it from the database one chunk at a time.
// File ids are random and files never change, so browsers and Vercel's CDN can cache them for good.
export async function GET(request: Request, { params }: RouteContext<"/files/[id]/[name]">) {
  const { id } = await params;
  const file = await getFile(id);
  if (!file) return new Response("Not found", { status: 404 });

  const download = new URL(request.url).searchParams.has("download");
  let index = 0;
  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (index >= file.chunk_count) {
        controller.close();
        return;
      }
      controller.enqueue(new Uint8Array(await readChunk(file.id, index++)));
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": file.content_type,
      "Content-Length": String(file.size),
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(file.name)}`,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      // Chrome won't show PDFs under a sandbox policy, so only images get one.
      ...(file.content_type.startsWith("image/") ? { "Content-Security-Policy": "sandbox" } : {}),
    },
  });
}
