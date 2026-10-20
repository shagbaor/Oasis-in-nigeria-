import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Noto_Serif } from "next/font/google";
import "./globals.css";

// TeX Gyre Pagella, the typeface of the OASIS Founding Identity (GUST Font License).
const pagella = localFont({
  variable: "--font-pagella",
  display: "swap",
  src: [
    { path: "./fonts/pagella-regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/pagella-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/pagella-bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/pagella-bolditalic.woff2", weight: "700", style: "italic" },
  ],
});

// Fallback for Hausa letters Pagella lacks (ɗ, ƙ), as in the identity document.
// Not preloaded: browsers only fetch it when a page uses those characters.
const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  preload: false,
});

const siteHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteHost ? `https://${siteHost}` : "http://localhost:3000"),
  title: {
    default: "OASIS — Outreach for Affirming Spaces, Inclusion and Sustainability",
    template: "%s · OASIS",
  },
  description:
    "Protecting mental wellbeing and supporting practical recovery where climate disruption and exclusion meet in Nigeria.",
  openGraph: {
    title: "OASIS — Outreach for Affirming Spaces, Inclusion and Sustainability",
    description: "Safety. Dignity. Recovery. Protecting mental wellbeing and supporting practical recovery where climate disruption and exclusion meet in Nigeria.",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#22493c" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NG" className={`${pagella.variable} ${notoSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
