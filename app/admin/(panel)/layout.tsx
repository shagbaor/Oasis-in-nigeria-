import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin">
      <header className="admin-header">
        <div className="container admin-nav">
          <Link href="/admin" className="brand">
            <Image src="/logo.svg" alt="" width={30} height={30} />
            <span>OASIS Admin</span>
          </Link>
          <nav aria-label="Admin">
            <Link href="/admin">Posts</Link>
            <Link href="/admin/posts/new">New post</Link>
            <Link href="/admin/messages">Messages</Link>
            <Link href="/" target="_blank">
              View site
            </Link>
            <form action={logout}>
              <button type="submit" className="link-button">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="container admin-main">{children}</main>
    </div>
  );
}
