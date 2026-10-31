"use client";

import { useState } from "react";

// Copies text to the clipboard and briefly confirms it, for screen readers too.
export function CopyButton({ text, label = "Copy", className = "btn btn-small" }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          // Clipboard blocked: the text is still visible and selectable.
        }
      }}
    >
      {copied ? "Copied ✓" : label}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Address copied" : ""}
      </span>
    </button>
  );
}
