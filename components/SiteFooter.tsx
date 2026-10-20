import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="brand">
          <Image src="/logo.svg" alt="" width={32} height={32} />
          <span>OASIS</span>
        </div>
        <p>Outreach for Affirming Spaces, Inclusion and Sustainability</p>
        <nav className="footer-links" aria-label="Footer">
          <Link href="/#about">About</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
        <p className="small">
          &copy; <CurrentYear /> OASIS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
