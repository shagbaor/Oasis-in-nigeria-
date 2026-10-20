import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { ContactForm } from "@/components/ContactForm";
import { Label } from "@/components/Brand";
import { ADDRESS_LINES, CONTACT_EMAIL, INSTAGRAM } from "@/lib/identity";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  path: "/contact",
  description:
    "Contact OASIS in Yenagoa, Bayelsa State, Nigeria, for support, partnership, funding or research. Email talktous@oasisinnigeria.org. Every enquiry is confidential.",
});

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Label>Get in touch</Label>
          <h1>We&apos;d love to hear from you</h1>
          <p className="lead">
            Whether you are looking for support, or want to partner, fund or collaborate with us, send us a message.
          </p>
        </div>
      </section>

      <section className="section section-white">
        <div className="container split">
          <div>
            <p className="safety-note">
              <strong>If you are in immediate danger,</strong> call <a href="tel:112">112</a>, Nigeria&apos;s national
              emergency number.
            </p>
            <h2 className="contact-heading">Confidential by default</h2>
            <p className="muted">
              Every enquiry is treated confidentially. We protect choice, dignity and confidentiality, and we never
              require trauma stories or photographs.
            </p>
            <ul className="contact-list">
              <li>
                <span>Email</span>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
              <li>
                <span>Instagram</span>
                <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer">
                  {INSTAGRAM.handle}
                </a>
              </li>
              <li>
                <span>Address</span>
                <address className="contact-address">
                  {ADDRESS_LINES.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
              </li>
            </ul>
          </div>
          {/* The form reads ?subject= from the URL, which is only known at request time. */}
          <Suspense fallback={<div className="contact-form" aria-busy="true" />}>
            <ContactForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
