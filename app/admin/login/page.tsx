import Image from "next/image";
import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <div className="brand">
          <Image src="/oasis-logo.svg" alt="OASIS" width={98} height={40} />
          <span>Admin</span>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
