"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/our-work", label: "Our work" },
  { href: "/research", label: "Research" },
  { href: "/blog", label: "Blog" },
  { href: "/work-with-us", label: "Work with us" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand" onClick={close}>
          <Image src="/oasis-logo.svg" alt="OASIS home" width={98} height={40} priority />
        </Link>
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav id="nav-menu" className={`nav-menu${open ? " open" : ""}`} aria-label="Main">
          {LINKS.map((link) => (
            <Suspense
              key={link.href}
              fallback={
                <Link href={link.href} onClick={close}>
                  {link.label}
                </Link>
              }
            >
              <NavLink href={link.href} label={link.label} onClick={close} />
            </Suspense>
          ))}
          <Link href="/contact" className="btn btn-small" onClick={close}>
            Contact us
          </Link>
        </nav>
      </div>
    </header>
  );
}

// Reading the URL is request-time data, so this sits inside <Suspense> above.
function NavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  const pathname = usePathname();
  const current = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link href={href} onClick={onClick} aria-current={current ? "page" : undefined}>
      {label}
    </Link>
  );
}
