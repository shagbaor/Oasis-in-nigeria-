import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { getPost } from "@/lib/posts";
import { PostForm } from "../../PostForm";

async function EditPost({ params }: { params: PageProps<"/admin/posts/[id]">["params"] }) {
  await requireAdmin();
  const id = Number((await params).id);
  const post = Number.isInteger(id) ? await getPost(id) : null;
  if (!post) notFound();

  return (
    <PostForm
      post={{
        id: post.id,
        kind: post.kind,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        cover_image_url: post.cover_image_url,
        pdf:
          post.pdf_file_id && post.pdf_name
            ? { id: post.pdf_file_id, name: post.pdf_name, size: post.pdf_size ?? 0 }
            : null,
        published: post.published,
      }}
    />
  );
}

export default function EditPostPage({ params }: PageProps<"/admin/posts/[id]">) {
  return (
    <>
      <h1>Edit</h1>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        <EditPost params={params} />
      </Suspense>
    </>
  );
}
