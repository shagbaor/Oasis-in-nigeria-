"use client";

import { startTransition, useActionState, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { sendMessage, type ContactState } from "@/app/(site)/actions";
import { CONTACT_SUBJECTS } from "@/lib/format";

// Links like /contact?subject=Funding preselect the subject.
function subjectFromUrl(value: string | null) {
  return (CONTACT_SUBJECTS as readonly string[]).includes(value ?? "") ? (value as string) : CONTACT_SUBJECTS[0];
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const [subject, setSubject] = useState<string>(() => subjectFromUrl(searchParams.get("subject")));
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<ContactState, FormData>(async (prev, formData) => {
    const result = await sendMessage(prev, formData);
    if (result?.ok) {
      formRef.current?.reset();
      setSubject(CONTACT_SUBJECTS[0]);
    }
    return result;
  }, null);

  // Submitting via onSubmit (not the action prop) keeps what the visitor typed if sending fails.
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => action(formData));
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} className="contact-form">
      <label>
        Name
        <input type="text" name="name" autoComplete="name" required maxLength={200} />
      </label>
      <label>
        Email
        <input type="email" name="email" autoComplete="email" required maxLength={200} />
      </label>
      <label>
        Subject
        <select name="subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
          {CONTACT_SUBJECTS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <label>
        Message
        <textarea name="message" rows={5} required maxLength={5000} />
      </label>
      <label className="hp" aria-hidden="true">
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <button type="submit" className="btn" disabled={pending}>
        {pending ? "Sending…" : "Send Message"}
      </button>
      <p className={`form-status${state && !state.ok ? " error" : ""}`} role="status" aria-live="polite">
        {state?.message}
      </p>
    </form>
  );
}
