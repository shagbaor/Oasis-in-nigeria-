import Link from "next/link";
import { isAdmin } from "@/lib/session";

// Shown on public posts only to signed-in admins, so they can jump to the editor.
export async function AdminEditBar({ postId }: { postId: number }) {
  if (!(await isAdmin())) return null;
  return (
    <div className="admin-edit-bar">
      <div className="container container-narrow admin-edit-bar-inner">
        <span>You&apos;re signed in as admin.</span>
        <Link href={`/admin/posts/${postId}`} className="btn btn-small btn-light">
          Edit this post
        </Link>
      </div>
    </div>
  );
}
