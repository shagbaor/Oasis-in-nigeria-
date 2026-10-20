// Visual elements from the OASIS Founding Identity.
import type { Proverb } from "@/lib/identity";

// Italic section label, e.g. "Our mission". Large enough for Terracotta text to pass contrast.
export function Label({ children, as: Tag = "p" }: { children: React.ReactNode; as?: "p" | "span" }) {
  return <Tag className="label">{children}</Tag>;
}

// Strip of Terracotta triangles and diamonds used as a border.
export function Band({ onDark = false, className = "" }: { onDark?: boolean; className?: string }) {
  return <div className={`band${onDark ? " band-on-dark" : ""} ${className}`} aria-hidden="true" />;
}

// Forest Green panel filled with the circle, wave, dot and leaf pattern.
export function PatternPanel({ className = "" }: { className?: string }) {
  return <div className={`pattern-panel ${className}`} aria-hidden="true" />;
}

export function Motto({ className = "" }: { className?: string }) {
  return (
    <p className={`motto ${className}`}>
      Safety. Dignity. <span className="motto-accent">Recovery.</span>
    </p>
  );
}

export function ProverbBox({ proverb, dark = false }: { proverb: Proverb; dark?: boolean }) {
  return (
    <figure className={`proverb${dark ? " proverb-dark" : ""}`}>
      <figcaption className="proverb-label">{proverb.language} proverb</figcaption>
      <blockquote>
        <p className="proverb-original" lang={LANG_CODES[proverb.language]}>
          {proverb.original}
        </p>
        <p className="proverb-translation">‘{proverb.translation}’</p>
      </blockquote>
      <p className="proverb-meaning">{proverb.meaning}</p>
    </figure>
  );
}

const LANG_CODES: Record<Proverb["language"], string> = { Yoruba: "yo", Igbo: "ig", Hausa: "ha" };
