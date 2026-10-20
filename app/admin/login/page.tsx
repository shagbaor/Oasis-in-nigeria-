import Image from "next/image";
import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <div className="brand">
          <Image src="/logo.svg" alt="" width={36} height={36} />
          <span>OASIS Admin</span>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
