import type { Metadata } from "next";

// The shared preview picture drawn by app/opengraph-image.tsx. Pages that set
// their own openGraph replace the inherited file-based image, so it is added
// back explicitly here.
export const SHARE_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "OASIS: Safety. Dignity. Recovery. Outreach for Affirming Spaces, Inclusion and Sustainability",
};

// Title, description, canonical address and social preview text for one page.
export function pageMetadata({
  title,
  description,
  path,
  images,
  type = "website",
}: {
  title?: string;
  description: string;
  path: string;
  images?: string[];
  type?: "website" | "article";
}): Metadata {
  const fullTitle = title ? `${title} · OASIS` : undefined;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      siteName: "OASIS",
      locale: "en_NG",
      ...(fullTitle ? { title: fullTitle } : {}),
      description,
      url: path,
      type,
      images: images ?? [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      ...(fullTitle ? { title: fullTitle } : {}),
      description,
      images: images ?? [SHARE_IMAGE],
    },
  };
}
