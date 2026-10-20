import { isAdmin } from "@/lib/session";
import { UploadError, completeFile, isFileId, putChunk } from "@/lib/files";

type Context = RouteContext<"/api/admin/files/[id]">;

async function handle(params: Context["params"], work: (id: string) => Promise<void>) {
  if (!(await isAdmin())) return Response.json({ error: "Please sign in again." }, { status: 401 });
  const { id } = await params;
  if (!isFileId(id)) return Response.json({ error: "Upload not found." }, { status: 404 });

  try {
    await work(id);
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof UploadError) return Response.json({ error: error.message }, { status: 400 });
    throw error;
  }
}

// Stores one chunk: PUT /api/admin/files/[id]?index=0 with the raw bytes as the body.
export async function PUT(request: Request, { params }: Context) {
  return handle(params, async (id) => {
    const index = Number(new URL(request.url).searchParams.get("index"));
    await putChunk(id, index, Buffer.from(await request.arrayBuffer()));
  });
}

// Marks the upload finished once every chunk has arrived.
export async function POST(_request: Request, { params }: Context) {
  return handle(params, completeFile);
}
