import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { Band, Motto } from "./Brand";
import { FULL_NAME } from "@/lib/identity";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Band />
      <div className="footer-body">
        <div className="container footer-inner">
          <Image src="/oasis-logo-reversed.svg" alt="OASIS" width={148} height={60} className="footer-logo" />
          <Motto className="motto-on-dark footer-motto" />
          <p>{FULL_NAME}</p>
          <nav className="footer-links" aria-label="Footer">
            <Link href="/about">About</Link>
            <Link href="/our-work">Our work</Link>
            <Link href="/research">Research</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/work-with-us">Work with us</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <p className="small">
            &copy; <CurrentYear /> OASIS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
