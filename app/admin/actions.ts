"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { checkAdminPassword, createSession, deleteSession, requireAdmin } from "@/lib/session";
import {
  POST_KINDS,
  createPost,
  deletePost,
  updatePost,
  type PdfTranslation,
  type PostInput,
  type PostKind,
} from "@/lib/posts";
import { getFile } from "@/lib/files";
import { MAX_PDF_TRANSLATIONS, PDF_TYPE } from "@/lib/uploads";
import { deleteMessage, setMessageRead } from "@/lib/messages";
import { isUniqueViolation } from "@/lib/db";
import { fromSiteInputValue, slugify } from "@/lib/format";

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

async function readPostForm(formData: FormData): Promise<PostInput | string> {
  const rawKind = String(formData.get("kind") ?? "");
  const kind: PostKind = (POST_KINDS as readonly string[]).includes(rawKind) ? (rawKind as PostKind) : "blog";
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "").trim() || title);
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const cover = String(formData.get("cover_image_url") ?? "").trim();
  const pdfId = String(formData.get("pdf_file_id") ?? "").trim();
  const pdfLanguage = cleanLanguage(formData.get("pdf_language")) || "English";
  const translationIds = formData.getAll("translation_file_id").map((v) => String(v).trim());
  const translationLanguages = formData.getAll("translation_language").map(cleanLanguage);
  const translations: PdfTranslation[] = translationIds.map((file_id, i) => ({
    file_id,
    language: translationLanguages[i] ?? "",
  }));
  const visibility = String(formData.get("visibility") ?? "draft");
  const published = visibility === "now" || visibility === "schedule";
  const publishAt = visibility === "schedule" ? fromSiteInputValue(String(formData.get("publish_at") ?? "")) : null;

  if (!title) return "Please add a title.";
  if (!slug) return "Please add a URL slug using letters or numbers.";
  if (cover && !/^(https?:\/\/|\/files\/)/i.test(cover))
    return "The cover image must be an uploaded image or a full http(s) URL.";
  if (pdfId && (await getFile(pdfId))?.content_type !== PDF_TYPE)
    return "The attached PDF could not be found. Please upload it again.";
  const translationError = await checkTranslations(pdfId, pdfLanguage, translations);
  if (translationError) return translationError;
  if (visibility === "schedule" && !publishAt) return "Please choose the date and time to publish.";

  return {
    kind,
    title,
    slug,
    excerpt,
    content,
    cover_image_url: cover || null,
    pdf_file_id: pdfId || null,
    pdf_language: pdfLanguage,
    pdf_translations: translations,
    published,
    publish_at: publishAt,
  };
}

function cleanLanguage(value: FormDataEntryValue | null) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, 40);
}

async function checkTranslations(pdfId: string, pdfLanguage: string, translations: PdfTranslation[]) {
  if (translations.length === 0) return null;
  if (!pdfId) return "Attach the main PDF before adding it in other languages.";
  if (translations.length > MAX_PDF_TRANSLATIONS) return `You can add up to ${MAX_PDF_TRANSLATIONS} other languages.`;
  const seen = new Set([pdfLanguage.toLowerCase()]);
  for (const { file_id, language } of translations) {
    if (!language) return "Please choose the language of each translated PDF.";
    if (seen.has(language.toLowerCase())) return `${language} is listed more than once. Each language can have one PDF.`;
    seen.add(language.toLowerCase());
    if (file_id === pdfId || (await getFile(file_id))?.content_type !== PDF_TYPE)
      return `The ${language} PDF could not be found. Please upload it again.`;
  }
  return null;
}

export async function savePost(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const input = await readPostForm(formData);
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
