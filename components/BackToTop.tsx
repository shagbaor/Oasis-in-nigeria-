"use client";

import { ArrowUpIcon } from "./Icons";

export function BackToTop() {
  return (
    <button
      type="button"
      className="back-to-top"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        document.querySelector<HTMLElement>(".skip-link")?.focus({ preventScroll: true });
      }}
    >
      <ArrowUpIcon /> Back to top
    </button>
  );
}
