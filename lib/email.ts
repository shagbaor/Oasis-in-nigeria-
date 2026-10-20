import "server-only";
import type { MessageInput } from "./messages";

// Contact form messages are emailed through Resend (https://resend.com).
// RESEND_API_KEY      — API key from the Resend dashboard
// CONTACT_TO_EMAIL    — where messages go (defaults to talktous@oasisinnigeria.org)
// CONTACT_FROM_EMAIL  — sender on a domain verified in Resend,
//                       e.g. "OASIS website <website@oasisinnigeria.org>"
const DEFAULT_TO = "talktous@oasisinnigeria.org";
const RESEND_URL = process.env.RESEND_API_URL ?? "https://api.resend.com/emails";

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL);
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendContactEmail(input: MessageInput) {
  if (!isEmailConfigured()) {
    console.warn("Contact email not sent: set RESEND_API_KEY and CONTACT_FROM_EMAIL to enable it.");
    return false;
  }

  const rows: [string, string][] = [
    ["Name", input.name],
    ["Email", input.email],
    ["Subject", input.subject],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${input.message}\n\n— Sent from the contact form on the OASIS website`;
  const html = `<table cellpadding="4" style="font-family:Georgia,serif;font-size:15px;color:#22493c">
${rows.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`).join("\n")}
</table>
<p style="font-family:Georgia,serif;font-size:15px;color:#22493c;white-space:pre-wrap;border-left:4px solid #bc6c4c;padding-left:12px">${escapeHtml(input.message)}</p>
<p style="font-family:Georgia,serif;font-size:13px;color:#5e6f68">Sent from the contact form on the OASIS website. Reply to this email to answer ${escapeHtml(input.name)} directly.</p>`;

  const response = await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL || DEFAULT_TO],
      reply_to: input.email,
      subject: `[Website] ${input.subject} — ${input.name}`.replace(/[\r\n]+/g, " "),
      text,
      html,
    }),
  });
  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  }
  return true;
}
