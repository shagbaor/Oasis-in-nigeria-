import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["600", "700"] });

const siteHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteHost ? `https://${siteHost}` : "http://localhost:3000"),
  title: {
    default: "OASIS — Outreach for Affirming Spaces, Inclusion and Sustainability",
    template: "%s · OASIS",
  },
  description:
    "OASIS is a non-profit building affirming spaces, advancing inclusion, and championing sustainable communities.",
  openGraph: {
    title: "OASIS — Outreach for Affirming Spaces, Inclusion and Sustainability",
    description: "Building affirming spaces, advancing inclusion, and championing sustainable communities.",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#0f766e" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
