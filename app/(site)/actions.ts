"use server";

import { createMessage } from "@/lib/messages";
import { CONTACT_SUBJECTS } from "@/lib/format";

export type ContactState = { ok: boolean; message: string } | null;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Hidden field that people never fill in; bots usually do.
  if (formData.get("website")) return { ok: true, message: "Thank you! Your message has been sent." };

  const name = String(formData.get("name") ?? "").trim().slice(0, 200);
  const email = String(formData.get("email") ?? "").trim().slice(0, 200);
  const message = String(formData.get("message") ?? "").trim().slice(0, 5000);
  const rawSubject = String(formData.get("subject") ?? "");
  const subject = (CONTACT_SUBJECTS as readonly string[]).includes(rawSubject) ? rawSubject : CONTACT_SUBJECTS[0];

  if (!name || !EMAIL_PATTERN.test(email) || !message) {
    return { ok: false, message: "Please fill in your name, a valid email and a message." };
  }

  try {
    await createMessage({ name, email, subject, message });
  } catch (error) {
    console.error("Failed to save contact message", error);
    return { ok: false, message: "Sorry, something went wrong. Please try again later." };
  }
  return { ok: true, message: "Thank you! Your message has been sent. We'll be in touch soon." };
}
