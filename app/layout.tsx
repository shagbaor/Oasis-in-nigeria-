import type { Metadata, Viewport } from "next";
import { Noto_Serif } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/identity";

// The brand font is Palatino Linotype. It is declared in globals.css: devices
// that have it installed use it, others download the matching TeX Gyre Pagella.

// Fallback for Hausa letters Pagella lacks (ɗ, ƙ), as in the identity document.
// Not preloaded: browsers only fetch it when a page uses those characters.
const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  preload: false,
});

const SITE_TITLE = "OASIS — Outreach for Affirming Spaces, Inclusion and Sustainability";
const SITE_DESCRIPTION =
  "OASIS is a Nigerian non-profit helping marginalised people affected by climate-related displacement stay safe, recover their mental wellbeing and rebuild their lives. Based in Uyo, Akwa Ibom State.";

export const metadata: Metadata = {
  // All links, canonical addresses and preview images use the official domain.
  metadataBase: new URL(SITE_URL),
  applicationName: "OASIS",
  title: { default: SITE_TITLE, template: "%s · OASIS" },
  description: SITE_DESCRIPTION,
  keywords: [
    "OASIS Nigeria",
    "Outreach for Affirming Spaces, Inclusion and Sustainability",
    "NGO Nigeria",
    "climate displacement",
    "mental health",
    "psychosocial support",
    "safer housing",
    "climate adaptation",
    "Uyo",
    "Akwa Ibom",
  ],
  category: "nonprofit",
  openGraph: {
    siteName: "OASIS",
    locale: "en_NG",
    type: "website",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = { themeColor: "#22493c" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NG" className={notoSerif.variable}>
      <body>{children}</body>
    </html>
  );
}
