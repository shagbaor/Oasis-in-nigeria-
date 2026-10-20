import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/session";
import { listAllPosts } from "@/lib/posts";
import { countUnreadMessages } from "@/lib/messages";
import { formatDate } from "@/lib/format";
import { removePost } from "../actions";
import { ConfirmButton } from "./ConfirmButton";

async function Dashboard() {
  await requireAdmin();
  const [posts, unread] = await Promise.all([listAllPosts(), countUnreadMessages()]);

  return (
    <>
      <div className="admin-title">
        <h1>Posts</h1>
        <Link href="/admin/posts/new" className="btn btn-small">
          New post
        </Link>
      </div>

      {unread > 0 && (
        <p className="admin-notice">
          You have <Link href="/admin/messages">{unread} unread message{unread === 1 ? "" : "s"}</Link>.
        </p>
      )}

      {posts.length === 0 ? (
        <p className="muted">No posts yet. Write your first one!</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link href={`/admin/posts/${post.id}`} className="admin-post-title">
                      {post.title}
                    </Link>
                    <div className="small muted">/blog/{post.slug}</div>
                  </td>
                  <td>
                    <span className={`badge${post.published ? " badge-live" : ""}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="nowrap">{formatDate(post.published_at ?? post.updated_at)}</td>
                  <td className="row-actions">
                    {post.published && (
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        View
                      </Link>
                    )}
                    <Link href={`/admin/posts/${post.id}`}>Edit</Link>
                    <form action={removePost}>
                      <input type="hidden" name="id" value={post.id} />
                      <ConfirmButton message={`Delete "${post.title}"? This cannot be undone.`}>Delete</ConfirmButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function AdminHome() {
  return (
    <Suspense fallback={<p className="muted">Loading…</p>}>
      <Dashboard />
    </Suspense>
  );
}
