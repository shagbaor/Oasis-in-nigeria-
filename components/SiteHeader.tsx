"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#work", label: "Our Work" },
  { href: "/#involved", label: "Get Involved" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand" aria-label="OASIS home" onClick={close}>
          <Image src="/logo.svg" alt="" width={36} height={36} />
          <span>OASIS</span>
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
            Contact Us
          </Link>
        </nav>
      </div>
    </header>
  );
}
