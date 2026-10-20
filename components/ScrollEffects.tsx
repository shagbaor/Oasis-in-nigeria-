"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setSmoothScroll } from "@/lib/smooth-scroll";

// Elements that fade and rise into view as they are scrolled to.
const REVEAL_SELECTOR = [
  "main .label",
  "main h1",
  "main h2",
  "main .lead",
  "main .proverb",
  "main .card",
  "main .id-table",
  "main .area-grid li",
  "main .objective-cards li",
  "main .motto-card",
  "main .purpose",
  "main .principle-card",
  "main .contact-form",
  "main .donate-option",
  "main .policy-section",
].join(",");

// Smooth scrolling and scroll-in animations, both skipped for visitors who
// prefer reduced motion.
export function ScrollEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.05, anchors: true, autoRaf: true, stopInertiaOnNavigate: true });
    setSmoothScroll(lenis);

    const root = document.documentElement;
    root.classList.add("reveal-ready");

    // Reveal anything that is on screen or already scrolled past, so content
    // jumped over (End key, anchor links, find-in-page) never stays hidden.
    const pending = new Set<HTMLElement>();
    let frame = 0;
    const reveal = () => {
      frame = 0;
      const limit = window.innerHeight * 0.94;
      for (const el of pending) {
        if (el.getBoundingClientRect().top < limit) {
          el.classList.add("is-visible");
          pending.delete(el);
        }
      }
    };
    const scheduleReveal = () => {
      if (!frame) frame = requestAnimationFrame(reveal);
    };

    // Tag new elements (including after client-side navigation) and stagger
    // siblings that enter together.
    const scan = () => {
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
        // Heroes have their own entrance animation (see globals.css).
        if (el.dataset.reveal !== undefined || el.closest(".hero, .page-hero")) return;
        el.dataset.reveal = "";
        const siblings = el.parentElement ? [...el.parentElement.children] : [];
        el.style.setProperty("--reveal-delay", `${Math.min(siblings.indexOf(el), 5) * 70}ms`);
        pending.add(el);
      });
      scheduleReveal();
    };
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", scheduleReveal, { passive: true });
    window.addEventListener("resize", scheduleReveal);
    lenis.on("scroll", scheduleReveal);

    // Scroll position and progress as CSS variables, for parallax, the sliding
    // border bands and the progress bar.
    const setScrollVars = ({ scroll, limit }: { scroll: number; limit: number }) => {
      root.style.setProperty("--sy", scroll.toFixed(1));
      root.style.setProperty("--progress", limit > 0 ? (scroll / limit).toFixed(4) : "0");
    };
    lenis.on("scroll", setScrollVars);
    setScrollVars({ scroll: window.scrollY, limit: document.documentElement.scrollHeight - window.innerHeight });

    // Glass tiles: move the specular highlight with the pointer.
    const onPointerMove = (event: PointerEvent) => {
      const tile = (event.target as Element | null)?.closest?.<HTMLElement>(".card-dark, .proverb-dark");
      if (!tile) return;
      const rect = tile.getBoundingClientRect();
      tile.style.setProperty("--gx", `${event.clientX - rect.left}px`);
      tile.style.setProperty("--gy", `${event.clientY - rect.top}px`);
    };
    document.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      mutations.disconnect();
      window.removeEventListener("scroll", scheduleReveal);
      window.removeEventListener("resize", scheduleReveal);
      document.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
      root.classList.remove("reveal-ready");
      root.style.removeProperty("--sy");
      root.style.removeProperty("--progress");
      lenis.destroy();
      setSmoothScroll(null);
    };
  }, []);

  return <div className="scroll-progress" aria-hidden="true" />;
}
