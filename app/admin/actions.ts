"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { checkAdminPassword, createSession, deleteSession, requireAdmin } from "@/lib/session";
import { createPost, deletePost, updatePost, type PostInput } from "@/lib/posts";
import { deleteMessage, setMessageRead } from "@/lib/messages";
import { isUniqueViolation } from "@/lib/db";
import { slugify } from "@/lib/format";

export type FormState = { error: string } | null;

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  if (!password || !checkAdminPassword(password)) {
    // Slow down repeated guessing.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { error: "Incorrect password." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

function readPostForm(formData: FormData): PostInput | string {
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "").trim() || title);
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const cover = String(formData.get("cover_image_url") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!title) return "Please add a title.";
  if (!slug) return "Please add a URL slug using letters or numbers.";
  if (cover && !/^https?:\/\//i.test(cover)) return "The cover image must be a full http(s) URL.";

  return { title, slug, excerpt, content, cover_image_url: cover || null, published };
}

export async function savePost(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const input = readPostForm(formData);
  if (typeof input === "string") return { error: input };

  const id = Number(formData.get("id")) || null;
  try {
    if (id) await updatePost(id, input);
    else await createPost(input);
  } catch (error) {
    if (isUniqueViolation(error)) return { error: `Another post already uses the slug "${input.slug}".` };
    console.error("Failed to save post", error);
    return { error: "Could not save the post. Please try again." };
  }
  redirect("/admin");
}

export async function removePost(formData: FormData) {
  await requireAdmin();
  await deletePost(Number(formData.get("id")));
  redirect("/admin");
}

export async function toggleMessageRead(formData: FormData) {
  await requireAdmin();
  await setMessageRead(Number(formData.get("id")), formData.get("is_read") === "true");
  refresh();
}

export async function removeMessage(formData: FormData) {
  await requireAdmin();
  await deleteMessage(Number(formData.get("id")));
  refresh();
}
