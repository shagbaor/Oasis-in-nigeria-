import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { Band, Motto } from "./Brand";
import { BackToTop } from "./BackToTop";
import { InstagramIcon, MailIcon, PinIcon } from "./Icons";
import { ADDRESS_LINES, CONTACT_EMAIL, FULL_NAME, INSTAGRAM } from "@/lib/identity";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/about", label: "About" },
      { href: "/our-work", label: "Our work" },
      { href: "/publications", label: "Publications" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Get involved",
    links: [
      { href: "/work-with-us", label: "Work with us" },
      { href: "/donate", label: "Donate" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Band />
      <div className="footer-body">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Image src="/oasis-logo-reversed.svg" alt="OASIS" width={118} height={48} className="footer-logo" />
            <Motto className="motto-on-dark footer-motto" />
            <p className="footer-name">{FULL_NAME}</p>
            <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" className="footer-follow">
              <InstagramIcon /> Follow us on Instagram
            </a>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} className="footer-col" aria-label={column.title}>
              <h2 className="footer-heading">{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="footer-col">
            <h2 className="footer-heading">Connect</h2>
            <ul className="footer-contact">
              <li>
                <MailIcon />
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
              <li>
                <InstagramIcon />
                <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer">
                  {INSTAGRAM.handle}
                </a>
              </li>
              <li>
                <PinIcon />
                <address className="footer-address">{ADDRESS_LINES.join(", ")}</address>
              </li>
            </ul>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>
            &copy; <CurrentYear /> OASIS. All rights reserved.
          </p>
          <nav aria-label="Legal" className="footer-legal">
            <Link href="/policies">Policies</Link>
            <Link href="/policies#privacy">Privacy</Link>
            <Link href="/policies#safeguarding">Safeguarding</Link>
          </nav>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
