// Shared handle to the page's smooth-scroll instance, so the menu can pause it.
import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setSmoothScroll(lenis: Lenis | null) {
  instance = lenis;
}

export function pauseSmoothScroll(paused: boolean) {
  if (paused) instance?.stop();
  else instance?.start();
}
