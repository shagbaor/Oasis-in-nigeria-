import type { Metadata } from "next";
import Link from "next/link";
import { Label } from "@/components/Brand";
import { CONTACT_EMAIL } from "@/lib/identity";

export const metadata: Metadata = {
  title: "Policies",
  description: "How OASIS handles your information, keeps people safe and uses stories and images.",
};

const LAST_UPDATED = "20 October 2026";

const SECTIONS = [
  { id: "privacy", title: "Privacy" },
  { id: "cookies", title: "Cookies" },
  { id: "safeguarding", title: "Safeguarding and confidentiality" },
  { id: "content", title: "Stories, images and consent" },
  { id: "contact", title: "Questions and concerns" },
];

const Email = () => <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function PoliciesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Label>Policies</Label>
          <h1>How we protect people and information</h1>
          <p className="lead">We protect choice, dignity and confidentiality. Last updated {LAST_UPDATED}.</p>
        </div>
      </section>

      <section className="section section-white">
        <div className="container policy-layout">
          <nav className="policy-toc" aria-label="On this page">
            <p className="policy-toc-title">On this page</p>
            <ol>
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="policy-body">
            <section className="policy-section" id="privacy">
              <h2>Privacy</h2>
              <h3>What we collect</h3>
              <p>
                When you use the contact form we collect your name, email address, the subject you choose and your
                message. We do not ask for, and you do not need to share, details of your health, identity or
                experiences to contact us.
              </p>
              <h3>Why we use it</h3>
              <p>We use this information only to read and reply to your message. We do not sell or share it for marketing.</p>
              <h3>Where it is kept</h3>
              <p>
                Messages are emailed to our team inbox and a copy is stored in our secure database so it is not lost.
                The website is hosted by Vercel and the database is provided by Neon, with data stored in the European
                Union (Frankfurt). Emails are delivered by our email provider. Only authorised OASIS staff can read
                messages.
              </p>
              <h3>How long we keep it</h3>
              <p>We keep messages only as long as we need them to respond and follow up, and delete them after that.</p>
              <h3>Your rights</h3>
              <p>
                Under the Nigeria Data Protection Act 2023 you can ask to see the information we hold about you, ask us
                to correct or delete it, and withdraw your consent at any time. Email <Email /> and we will respond.
              </p>
            </section>

            <section className="policy-section" id="cookies">
              <h2>Cookies</h2>
              <p>
                This website does not use advertising or tracking cookies. The only cookie we set is a strictly
                necessary one that keeps OASIS staff signed in to the website&apos;s admin area. Visitors to the public
                pages do not receive it.
              </p>
            </section>

            <section className="policy-section" id="safeguarding">
              <h2>Safeguarding and confidentiality</h2>
              <p>
                Our care respects identity, consent and agency. Support is confidential and person-centred, and nobody
                has to share more than they choose to.
              </p>
              <ul>
                <li>We protect choice, dignity and confidentiality in everything we do.</li>
                <li>These standards apply to everyone connected to OASIS: leaders, staff, partners and funders alike.</li>
                <li>We connect people to qualified partners for healthcare and specialist support.</li>
                <li>
                  If you are worried about how someone connected to OASIS has behaved, tell us at <Email />. We take every
                  concern seriously and handle it confidentially.
                </li>
              </ul>
              <p className="safety-note">
                <strong>OASIS is not an emergency service.</strong> If you or someone else is in immediate danger, call{" "}
                <a href="tel:112">112</a>, Nigeria&apos;s national emergency number.
              </p>
            </section>

            <section className="policy-section" id="content">
              <h2>Stories, images and consent</h2>
              <p>
                We never require trauma stories or photographs. When people choose to share their experiences or images
                with us, we:
              </p>
              <ul>
                <li>ask for informed consent before using them, and respect a decision to say no;</li>
                <li>pay people for their expertise and return research findings to communities;</li>
                <li>do not publish anything that could identify someone without their permission;</li>
                <li>remove content if the person who shared it withdraws their consent.</li>
              </ul>
            </section>

            <section className="policy-section" id="contact">
              <h2>Questions and concerns</h2>
              <p>
                For anything about these policies, or to use your data rights, email <Email /> or use our{" "}
                <Link href="/contact">contact form</Link>.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
