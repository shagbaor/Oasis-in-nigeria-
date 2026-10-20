import Link from "next/link";

export function NotFoundContent() {
  return (
    <section className="page-hero not-found">
      <div className="container">
        <p className="eyebrow">404</p>
        <h1>We couldn&apos;t find that page</h1>
        <p className="lead">It may have moved or no longer exists.</p>
        <Link href="/" className="btn">
          Back to home
        </Link>
      </div>
    </section>
  );
}
