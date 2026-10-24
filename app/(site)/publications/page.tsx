import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PostIndex } from "@/components/PostIndex";

export const metadata: Metadata = pageMetadata({
  title: "Publications",
  path: "/publications",
  description:
    "Publications from OASIS: research and reports on climate-related displacement, mental wellbeing and recovery in Nigeria, with PDFs to download.",
});

export default function PublicationsPage({ searchParams }: PageProps<"/publications">) {
  return (
    <PostIndex
      searchParams={searchParams}
      kind="research"
      eyebrow="Evidence and insight"
      title="Publications"
      lead="Community-led evidence on climate displacement, mental wellbeing and recovery in Nigeria. We obtain consent, pay people for their expertise and return findings to communities."
    />
  );
}
