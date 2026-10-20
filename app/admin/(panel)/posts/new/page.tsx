import { Suspense } from "react";
import { requireAdmin } from "@/lib/session";
import { PostForm } from "../../PostForm";

async function NewPost() {
  await requireAdmin();
  return <PostForm />;
}

export default function NewPostPage() {
  return (
    <>
      <h1>New post</h1>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        <NewPost />
      </Suspense>
    </>
  );
}
