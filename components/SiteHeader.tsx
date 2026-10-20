"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { pauseSmoothScroll } from "@/lib/smooth-scroll";
import { CONTACT_EMAIL, INSTAGRAM } from "@/lib/identity";
import { InstagramIcon } from "./Icons";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/our-work", label: "Our work" },
  { href: "/research", label: "Research" },
  { href: "/blog", label: "Blog" },
  { href: "/work-with-us", label: "Work with us" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  // Compact header with a shadow once the page has scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the menu is open: lock page scroll, close on Escape, keep Tab inside the menu.
  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("menu-open");
    pauseSmoothScroll(true);
    const button = buttonRef.current;
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab" || !panelRef.current) return;
      const items = [button, ...panelRef.current.querySelectorAll<HTMLElement>("a")].filter(Boolean) as HTMLElement[];
      const index = items.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey ? index - 1 : index + 1;
      if (next < 0 || next >= items.length) {
        event.preventDefault();
        items[next < 0 ? items.length - 1 : 0].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("menu-open");
      pauseSmoothScroll(false);
      document.removeEventListener("keydown", onKey);
      button?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}${open ? " is-menu-open" : ""}`}>
        <div className="container nav">
          <Link href="/" className="brand" onClick={close}>
            <Image src="/oasis-logo.svg" alt="OASIS home" width={84} height={34} priority />
          </Link>

          <nav className="nav-desktop" aria-label="Main">
            {LINKS.map((link) => (
              <CurrentLink key={link.href} href={link.href} label={link.label} />
            ))}
            <Link href="/donate" className="btn btn-small">
              Donate
            </Link>
          </nav>

          <button
            ref={buttonRef}
            type="button"
            className="menu-button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            <span className="menu-button-text">{open ? "Close" : "Menu"}</span>
            <span className="menu-icon" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      {/* Outside <header>: its backdrop blur would otherwise trap this fixed overlay. */}
      <div id="mobile-menu" className={`mobile-menu${open ? " is-open" : ""}`} inert={!open}>
        <div className="mobile-menu-backdrop" onClick={close} />
        <div
          ref={panelRef}
          className="mobile-menu-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-lenis-prevent
        >
          <nav aria-label="Mobile">
            <ol className="mobile-menu-links">
              {LINKS.map((link, i) => (
                <li key={link.href} style={{ "--i": i } as React.CSSProperties}>
                  <CurrentLink href={link.href} label={link.label} onClick={close} />
                </li>
              ))}
            </ol>
          </nav>
          <div className="mobile-menu-actions" style={{ "--i": LINKS.length } as React.CSSProperties}>
            <Link href="/donate" className="btn" onClick={close}>
              Donate
            </Link>
            <Link href="/contact" className="btn btn-outline" onClick={close}>
              Get in touch
            </Link>
          </div>
          <div className="mobile-menu-foot" style={{ "--i": LINKS.length + 1 } as React.CSSProperties}>
            <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" className="social-link">
              <InstagramIcon /> {INSTAGRAM.handle}
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <p className="mobile-menu-motto">
              Safety. Dignity. <span className="motto-accent">Recovery.</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

type LinkProps = { href: string; label: string; onClick?: () => void };

// Reading the URL is request-time data, so the highlighted link streams in
// behind <Suspense>; the fallback is the same link without the highlight.
function CurrentLink(props: LinkProps) {
  return (
    <Suspense
      fallback={
        <Link href={props.href} onClick={props.onClick}>
          {props.label}
        </Link>
      }
    >
      <HighlightedLink {...props} />
    </Suspense>
  );
}

function HighlightedLink({ href, label, onClick }: LinkProps) {
  const pathname = usePathname();
  const current = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link href={href} onClick={onClick} aria-current={current ? "page" : undefined}>
      {label}
    </Link>
  );
}
