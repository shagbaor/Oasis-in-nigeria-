import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/session";
import { listAllPosts, postPath, type PostFilters } from "@/lib/posts";
import { storageUsed } from "@/lib/files";
import { formatBytes } from "@/lib/uploads";
import { countUnreadMessages } from "@/lib/messages";
import { formatDate } from "@/lib/format";
import { SearchBox } from "@/components/SearchBox";
import { Highlight } from "@/components/Highlight";
import { removePost } from "../actions";
import { ConfirmButton } from "./ConfirmButton";

type SearchParams = PageProps<"/admin">["searchParams"];

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

function readFilters(params: Awaited<SearchParams>): Required<Pick<PostFilters, "q">> & PostFilters {
  const kind = first(params.type);
  const status = first(params.status);
  return {
    q: first(params.q).trim().slice(0, 100),
    kind: kind === "blog" || kind === "research" ? kind : undefined,
    status: status === "published" || status === "draft" ? status : undefined,
  };
}

// Link to the dashboard with one filter changed and the others kept.
function filterHref(filters: PostFilters, change: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  const merged = { q: filters.q, type: filters.kind, status: filters.status, ...change };
  for (const [key, value] of Object.entries(merged)) if (value) params.set(key, value);
  const query = params.toString();
  return query ? `/admin?${query}` : "/admin";
}

function FilterChips({ filters }: { filters: PostFilters }) {
  const groups = [
    { key: "type", current: filters.kind, options: [["", "All"], ["blog", "Blog"], ["research", "Research"]] },
    { key: "status", current: filters.status, options: [["", "Any status"], ["published", "Published"], ["draft", "Drafts"]] },
  ];
  return (
    <div className="filter-chips">
      {groups.map((group) => (
        <div key={group.key} className="chip-group" role="group" aria-label={group.key === "type" ? "Type" : "Status"}>
          {group.options.map(([value, label]) => {
            const active = (group.current ?? "") === value;
            return (
              <Link
                key={value}
                href={filterHref(filters, { [group.key]: value || undefined })}
                className={`chip${active ? " is-active" : ""}`}
                aria-current={active ? "true" : undefined}
                scroll={false}
              >
                {label}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}

async function Dashboard({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const filters = readFilters(await searchParams);
  const filtering = Boolean(filters.q || filters.kind || filters.status);
  const [posts, unread, storage] = await Promise.all([listAllPosts(filters), countUnreadMessages(), storageUsed()]);

  return (
    <>
      {unread > 0 && (
        <p className="admin-notice">
          You have <Link href="/admin/messages">{unread} unread message{unread === 1 ? "" : "s"}</Link>.
        </p>
      )}

      <FilterChips filters={filters} />

      {filtering && (
        <p className="search-summary" role="status">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
          {filters.q ? ` matching “${filters.q}”` : ""} ·{" "}
          <Link href="/admin" scroll={false}>
            Clear filters
          </Link>
        </p>
      )}

      {posts.length === 0 ? (
        <p className="muted">{filtering ? "No posts match. Try different words or filters." : "No posts yet. Write your first one!"}</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
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
                  <td className="cell-title">
                    <Link href={`/admin/posts/${post.id}`} className="admin-post-title">
                      {filters.q ? <Highlight text={post.title} query={filters.q} /> : post.title}
                    </Link>
                    <div className="small muted">{postPath(post)}</div>
                  </td>
                  <td data-label="Type">{post.kind === "research" ? "Research" : "Blog"}</td>
                  <td data-label="Status">
                    <span className={`badge${post.published ? " badge-live" : ""}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td data-label="Date" className="nowrap">
                    {formatDate(post.published_at ?? post.updated_at)}
                  </td>
                  <td className="cell-actions">
                    <div className="row-actions">
                      <Link href={`/admin/posts/${post.id}`} className="action-btn">
                        Edit
                      </Link>
                      {post.published && (
                        <Link href={postPath(post)} target="_blank" className="action-btn">
                          View
                        </Link>
                      )}
                      <form action={removePost}>
                        <input type="hidden" name="id" value={post.id} />
                        <ConfirmButton message={`Delete "${post.title}"? This cannot be undone.`}>Delete</ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="small muted storage-note">
        Uploaded images and PDFs use {formatBytes(storage)} of database storage. Your Neon console shows the plan&apos;s
        total limit.
      </p>
    </>
  );
}

export default function AdminHome({ searchParams }: PageProps<"/admin">) {
  return (
    <>
      <div className="admin-title">
        <h1>Blog &amp; research</h1>
        <Link href="/admin/posts/new" className="btn btn-small">
          New post
        </Link>
      </div>
      <div className="admin-search">
        <Suspense fallback={<div className="search-box" />}>
          <SearchBox label="Search posts" placeholder="Search posts by title, summary or text…" />
        </Suspense>
      </div>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        <Dashboard searchParams={searchParams} />
      </Suspense>
    </>
  );
}
