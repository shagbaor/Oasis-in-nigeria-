"use server";

import { createMessage } from "@/lib/messages";
import { sendContactEmail } from "@/lib/email";
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

  // Save a copy for the admin and email it to the team. Either one succeeding is enough.
  const input = { name, email, subject, message };
  const [saved, emailed] = await Promise.allSettled([createMessage(input), sendContactEmail(input)]);
  if (saved.status === "rejected") console.error("Failed to save contact message", saved.reason);
  if (emailed.status === "rejected") console.error("Failed to email contact message", emailed.reason);

  const delivered = saved.status === "fulfilled" || (emailed.status === "fulfilled" && emailed.value);
  if (!delivered) {
    return {
      ok: false,
      message: "Sorry, something went wrong. Please try again, or email us at talktous@oasisinnigeria.org.",
    };
  }
  return { ok: true, message: "Thank you! Your message has been sent. We'll be in touch soon." };
}
