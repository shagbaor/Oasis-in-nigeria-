import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { getPost, postPath, postStatus } from "@/lib/posts";
import { toSiteInputValue } from "@/lib/format";
import { removePost } from "../../../actions";
import { ConfirmButton } from "../../ConfirmButton";
import { PostForm } from "../../PostForm";

async function EditPost({ params }: { params: PageProps<"/admin/posts/[id]">["params"] }) {
  await requireAdmin();
  const id = Number((await params).id);
  const post = Number.isInteger(id) ? await getPost(id) : null;
  if (!post) notFound();

  return (
    <>
      <div className="admin-title">
        <h1>Edit</h1>
        <Link href={postPath(post)} target="_blank" className="btn btn-small btn-outline">
          {postStatus(post) === "published" ? "View live" : "Preview"}
        </Link>
      </div>
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
          status: postStatus(post),
          publish_at: postStatus(post) === "scheduled" ? toSiteInputValue(post.published_at) : "",
        }}
      />
      <section className="danger-zone" aria-labelledby="danger-heading">
        <div>
          <h2 id="danger-heading">Delete this post</h2>
          <p className="muted small">It is removed from the site straight away, with its images and PDF. This cannot be undone.</p>
        </div>
        <form action={removePost}>
          <input type="hidden" name="id" value={post.id} />
          <ConfirmButton message={`Delete "${post.title}"? This cannot be undone.`} className="btn btn-danger">
            Delete post
          </ConfirmButton>
        </form>
      </section>
    </>
  );
}

export default function EditPostPage({ params }: PageProps<"/admin/posts/[id]">) {
  return (
    <Suspense fallback={<p className="muted">Loading…</p>}>
      <EditPost params={params} />
    </Suspense>
  );
}
