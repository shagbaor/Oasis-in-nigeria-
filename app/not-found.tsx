import { NotFoundContent } from "@/components/NotFoundContent";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollEffects } from "@/components/ScrollEffects";

// Unmatched URLs render outside the (site) layout, so add the site chrome here.
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <NotFoundContent />
      </main>
      <SiteFooter />
      <ScrollEffects />
    </>
  );
}
