"use client";

import { startTransition, useActionState, useRef, useState } from "react";
import Link from "next/link";
import { savePost, type FormState } from "../actions";
import { uploadFile } from "./upload";
import { IMAGE_TYPES, PDF_TYPE, fileUrl, formatBytes } from "@/lib/uploads";
import { formatDateTime, fromSiteInputValue } from "@/lib/format";

type PostFields = {
  id?: number;
  kind: "blog" | "research";
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  pdf: { id: string; name: string; size: number } | null;
  status: "draft" | "scheduled" | "published";
  // Scheduled time in Nigeria time, as "YYYY-MM-DDTHH:mm" (empty if none).
  publish_at: string;
};

type Visibility = "draft" | "now" | "schedule";
const VISIBILITY_FOR_STATUS: Record<PostFields["status"], Visibility> = {
  draft: "draft",
  published: "now",
  scheduled: "schedule",
};
const SAVE_LABELS: Record<Visibility, string> = { draft: "Save draft", now: "Publish", schedule: "Schedule" };

const EMPTY: PostFields = {
  kind: "blog",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image_url: null,
  pdf: null,
  status: "draft",
  publish_at: "",
};

const IMAGE_ACCEPT = IMAGE_TYPES.join(",");

export function PostForm({ post = EMPTY }: { post?: PostFields }) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePost, null);
  const [cover, setCover] = useState(post.cover_image_url ?? "");
  const [pdf, setPdf] = useState(post.pdf);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [visibility, setVisibility] = useState<Visibility>(VISIBILITY_FOR_STATUS[post.status]);
  const [publishAt, setPublishAt] = useState(post.publish_at);
  const scheduledDate = visibility === "schedule" ? fromSiteInputValue(publishAt) : null;

  // Submitting via onSubmit (not the action prop) stops React clearing the form when saving fails.
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => action(formData));
  };

  async function upload(file: File, label: string) {
    setUploadError(null);
    setUploading(`Uploading ${label}…`);
    try {
      return await uploadFile(file, (fraction) => setUploading(`Uploading ${label}… ${Math.round(fraction * 100)}%`));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed. Please try again.");
      return null;
    } finally {
      setUploading(null);
    }
  }

  async function insertImages(files: File[]) {
    const textarea = contentRef.current;
    for (const [i, file] of files.entries()) {
      const uploaded = await upload(file, files.length > 1 ? `image ${i + 1} of ${files.length}` : "image");
      if (!uploaded || !textarea) continue;
      const alt = file.name
        .replace(/\.[^.]+$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/[[\]]/g, "");
      const before = textarea.value.slice(0, textarea.selectionStart);
      const gap = before === "" || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
      textarea.focus();
      textarea.setRangeText(
        `${gap}![${alt}](${uploaded.url})\n\n`,
        textarea.selectionStart,
        textarea.selectionEnd,
        "end",
      );
    }
  }

  return (
    <form onSubmit={onSubmit} className="admin-form post-form">
      {post.id && <input type="hidden" name="id" value={post.id} />}
      <label>
        Type
        <select name="kind" defaultValue={post.kind}>
          <option value="blog">Blog post</option>
          <option value="research">Research</option>
        </select>
      </label>
      <label>
        Title
        <input name="title" defaultValue={post.title} required maxLength={200} />
      </label>
      <label>
        URL slug
        <input
          name="slug"
          defaultValue={post.slug}
          placeholder="Leave blank to generate from the title"
          maxLength={80}
        />
        <span className="hint">The address of the page, e.g. /blog/your-slug or /research/your-slug</span>
      </label>
      <label>
        Summary
        <textarea name="excerpt" defaultValue={post.excerpt} rows={2} maxLength={400} />
        <span className="hint">A short summary shown in lists and in link previews.</span>
      </label>

      <div className="field">
        <span className="field-label">Cover image</span>
        <input type="hidden" name="cover_image_url" value={cover} />
        {cover ? (
          <div className="cover-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt="" />
            <button type="button" className="link-button danger" onClick={() => setCover("")}>
              Remove cover
            </button>
          </div>
        ) : (
          <FilePicker
            label="Upload cover image"
            accept={IMAGE_ACCEPT}
            disabled={!!uploading}
            onFiles={async (files) => {
              const uploaded = await upload(files[0], "cover image");
              if (uploaded) setCover(uploaded.url);
            }}
          />
        )}
      </div>

      <div className="field">
        <div className="field-head">
          <label htmlFor="content" className="field-label">
            Content
          </label>
          <FilePicker
            label="Insert image"
            accept={IMAGE_ACCEPT}
            multiple
            disabled={!!uploading}
            onFiles={insertImages}
            small
          />
        </div>
        <textarea id="content" ref={contentRef} name="content" defaultValue={post.content} rows={20} className="mono" />
        <span className="hint">
          Images are added where your cursor is. Formatting uses Markdown: <code>## Heading</code>,{" "}
          <code>**bold**</code>, <code>*italic*</code>, <code>[link](https://…)</code>, <code>- list item</code>,{" "}
          <code>&gt; quote</code>.
        </span>
      </div>

      <div className="field">
        <span className="field-label">Downloadable PDF</span>
        <input type="hidden" name="pdf_file_id" value={pdf?.id ?? ""} />
        {pdf ? (
          <div className="pdf-chip">
            <a href={fileUrl(pdf.id, pdf.name)} target="_blank" rel="noreferrer">
              {pdf.name}
            </a>
            <span className="muted small">{formatBytes(pdf.size)}</span>
            <button type="button" className="link-button danger" onClick={() => setPdf(null)}>
              Remove
            </button>
          </div>
        ) : (
          <FilePicker
            label="Attach PDF"
            accept={PDF_TYPE}
            disabled={!!uploading}
            onFiles={async (files) => {
              const uploaded = await upload(files[0], "PDF");
              if (uploaded) setPdf(uploaded);
            }}
          />
        )}
        <span className="hint">Optional. Shown as a download button at the end of the post (up to 25 MB).</span>
      </div>

      {(uploading || uploadError) && (
        <p className={`form-status${uploadError ? " error" : ""}`} role="status" aria-live="polite">
          {uploading ?? uploadError}
        </p>
      )}

      <fieldset className="visibility">
        <legend className="field-label">Visibility</legend>
        <div className="visibility-options">
          {(
            [
              ["draft", "Draft", "Hidden from the public site."],
              ["now", "Publish now", post.status === "published" ? "Live on the site." : "Goes live when you save."],
              ["schedule", "Schedule", "Saved now, goes live automatically at the time you choose."],
            ] as const
          ).map(([value, label, hint]) => (
            <label key={value} className={`visibility-option${visibility === value ? " is-selected" : ""}`}>
              <input
                type="radio"
                name="visibility"
                value={value}
                checked={visibility === value}
                onChange={() => setVisibility(value)}
              />
              <span>
                <strong>{label}</strong>
                <span className="hint">{hint}</span>
              </span>
            </label>
          ))}
        </div>
        {visibility === "schedule" && (
          <label className="schedule-time">
            Publish on (Nigeria time, WAT)
            <input
              type="datetime-local"
              name="publish_at"
              value={publishAt}
              onChange={(event) => setPublishAt(event.target.value)}
              required
            />
            <span className="hint">
              {scheduledDate
                ? scheduledDate > new Date()
                  ? `Goes live ${formatDateTime(scheduledDate)} WAT. Until then only admins can see it.`
                  : `That time has passed, so the post goes live when you save, dated ${formatDateTime(scheduledDate)}.`
                : "Choose a date and time."}
            </span>
          </label>
        )}
      </fieldset>
      {state?.error && (
        <p className="form-status error" role="alert">
          {state.error}
        </p>
      )}
      <div className="form-actions">
        <button type="submit" className="btn" disabled={pending || !!uploading}>
          {pending ? "Saving…" : SAVE_LABELS[visibility]}
        </button>
        <Link href="/admin">Cancel</Link>
      </div>
    </form>
  );
}

function FilePicker({
  label,
  accept,
  multiple,
  disabled,
  small,
  onFiles,
}: {
  label: string;
  accept: string;
  multiple?: boolean;
  disabled?: boolean;
  small?: boolean;
  onFiles: (files: File[]) => void;
}) {
  return (
    <label className={`btn btn-outline${small ? " btn-small" : ""}${disabled ? " is-disabled" : ""}`}>
      {label}
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          const files = [...(event.target.files ?? [])];
          event.target.value = "";
          if (files.length) onFiles(files);
        }}
      />
    </label>
  );
}
