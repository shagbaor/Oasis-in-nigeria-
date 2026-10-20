import { isAdmin } from "@/lib/session";
import { UploadError, createFile } from "@/lib/files";
import { CHUNK_SIZE } from "@/lib/uploads";

// Starts an upload. The browser then sends the file in chunks to /api/admin/files/[id].
export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Please sign in again." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name : "";
  const type = typeof body?.type === "string" ? body.type : "";
  const size = typeof body?.size === "number" ? body.size : 0;

  try {
    const id = await createFile(name, type, size);
    return Response.json({ id, chunkSize: CHUNK_SIZE });
  } catch (error) {
    if (error instanceof UploadError) return Response.json({ error: error.message }, { status: 400 });
    throw error;
  }
}
