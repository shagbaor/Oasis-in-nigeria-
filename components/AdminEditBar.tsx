import Link from "next/link";
import { isAdmin } from "@/lib/session";
import { formatDateTime } from "@/lib/format";
import type { PostStatus } from "@/lib/posts";

// Shown on posts only to signed-in admins: a shortcut to the editor, and a
// clear warning when the post is a draft or scheduled (so not public yet).
export async function AdminEditBar({
  postId,
  status,
  publishAt,
}: {
  postId: number;
  status: PostStatus;
  publishAt: Date | null;
}) {
  if (!(await isAdmin())) return null;
  const message =
    status === "draft"
      ? "Preview: this draft is hidden from the public."
      : status === "scheduled"
        ? `Preview: scheduled to go live ${formatDateTime(publishAt)} WAT. Hidden from the public until then.`
        : "You're signed in as admin.";
  return (
    <div className={`admin-edit-bar${status === "published" ? "" : " is-preview"}`}>
      <div className="container container-narrow admin-edit-bar-inner">
        <span>{message}</span>
        <Link href={`/admin/posts/${postId}`} className="btn btn-small btn-light">
          Edit this post
        </Link>
      </div>
    </div>
  );
}
