"use client";

import { SUBJECT_EVENT } from "./ContactForm";

export function SubjectLink({ subject, children }: { subject: string; children: React.ReactNode }) {
  return (
    <a
      href="#contact"
      className="link-arrow"
      onClick={() => window.dispatchEvent(new CustomEvent(SUBJECT_EVENT, { detail: subject }))}
    >
      {children}
    </a>
  );
}
