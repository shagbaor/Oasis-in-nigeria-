"use client";

import { startTransition, useActionState } from "react";
import Link from "next/link";
import { savePost, type FormState } from "../actions";

type PostFields = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  published: boolean;
};

const EMPTY: PostFields = { title: "", slug: "", excerpt: "", content: "", cover_image_url: null, published: false };

export function PostForm({ post = EMPTY }: { post?: PostFields }) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePost, null);

  // Submitting via onSubmit (not the action prop) stops React clearing the form when saving fails.
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => action(formData));
  };

  return (
    <form onSubmit={onSubmit} className="admin-form post-form">
      {post.id && <input type="hidden" name="id" value={post.id} />}
      <label>
        Title
        <input name="title" defaultValue={post.title} required maxLength={200} />
      </label>
      <label>
        URL slug
        <input name="slug" defaultValue={post.slug} placeholder="Leave blank to generate from the title" maxLength={80} />
        <span className="hint">The post will live at /blog/your-slug</span>
      </label>
      <label>
        Excerpt
        <textarea name="excerpt" defaultValue={post.excerpt} rows={2} maxLength={400} />
        <span className="hint">A short summary shown on the blog list and in link previews.</span>
      </label>
      <label>
        Cover image URL
        <input name="cover_image_url" type="url" defaultValue={post.cover_image_url ?? ""} placeholder="https://…" />
      </label>
      <label>
        Content
        <textarea name="content" defaultValue={post.content} rows={18} className="mono" />
        <span className="hint">
          Supports Markdown: <code>## Heading</code>, <code>**bold**</code>, <code>*italic*</code>,{" "}
          <code>[link](https://…)</code>, <code>- list item</code>, <code>![alt](image-url)</code>.
        </span>
      </label>
      <label className="checkbox">
        <input type="checkbox" name="published" defaultChecked={post.published} />
        Published (visible on the public blog)
      </label>
      {state?.error && (
        <p className="form-status error" role="alert">
          {state.error}
        </p>
      )}
      <div className="form-actions">
        <button type="submit" className="btn" disabled={pending}>
          {pending ? "Saving…" : "Save post"}
        </button>
        <Link href="/admin">Cancel</Link>
      </div>
    </form>
  );
}
