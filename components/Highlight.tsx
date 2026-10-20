import { MATCH_END, MATCH_START } from "@/lib/posts";

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Wraps each search term found in `text` in <mark>.
export function Highlight({ text, query }: { text: string; query: string }) {
  const terms = query
    .split(/\s+/)
    .map((term) => term.replace(/["']/g, ""))
    .filter((term) => term.length > 1 && term.toLowerCase() !== "or");
  if (terms.length === 0) return <>{text}</>;

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  return (
    <>
      {text.split(pattern).map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part))}
    </>
  );
}

// Renders a database search snippet, where matches are wrapped in MATCH_START / MATCH_END.
export function Snippet({ text }: { text: string }) {
  const parts = text.split(new RegExp(`${escapeRegExp(MATCH_START)}|${escapeRegExp(MATCH_END)}`));
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part))}
    </>
  );
}
