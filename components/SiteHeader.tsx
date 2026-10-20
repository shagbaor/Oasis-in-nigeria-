"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/our-work", label: "Our work" },
  { href: "/research", label: "Research" },
  { href: "/blog", label: "Blog" },
  { href: "/#involved", label: "Work with us" },
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
            <Link key={link.href} href={link.href} onClick={close}>
              {link.label}
            </Link>
          ))}
          <Link href="/#contact" className="btn btn-small" onClick={close}>
            Contact us
          </Link>
        </nav>
      </div>
    </header>
  );
}
