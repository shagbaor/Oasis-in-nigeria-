"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Search field that updates ?q= in the URL as you type. Without JavaScript it
// still works as a normal form submit.
export function SearchBox({ label, placeholder }: { label: string; placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const apply = (next: string) => {
    clearTimeout(timer.current);
    const params = new URLSearchParams(searchParams.toString());
    const q = next.trim();
    if (q) params.set("q", q);
    else params.delete("q");
    const query = params.toString();
    startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <form
      role="search"
      className={`search-box${pending ? " is-pending" : ""}`}
      action={pathname}
      onSubmit={(event) => {
        event.preventDefault();
        apply(value);
      }}
    >
      <label className="sr-only" htmlFor="search-input">
        {label}
      </label>
      <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        id="search-input"
        type="search"
        name="q"
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        maxLength={100}
        onChange={(event) => {
          const next = event.target.value;
          setValue(next);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => apply(next), 300);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape" && value) {
            event.preventDefault();
            setValue("");
            apply("");
          }
        }}
      />
      {pending && <span className="search-spinner" aria-hidden="true" />}
      {value && !pending && (
        <button
          type="button"
          className="search-clear"
          aria-label="Clear search"
          onClick={() => {
            setValue("");
            apply("");
          }}
        >
          ×
        </button>
      )}
    </form>
  );
}
