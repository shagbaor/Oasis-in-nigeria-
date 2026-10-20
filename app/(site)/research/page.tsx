import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PostIndex } from "@/components/PostIndex";

export const metadata: Metadata = pageMetadata({
  title: "Research",
  path: "/research",
  description:
    "Research and reports from OASIS on climate-related displacement, mental wellbeing and recovery in Nigeria, with downloadable PDFs.",
});

export default function ResearchPage({ searchParams }: PageProps<"/research">) {
  return (
    <PostIndex
      searchParams={searchParams}
      kind="research"
      eyebrow="Evidence and insight"
      title="Research"
      lead="Community-led evidence on climate displacement, mental wellbeing and recovery in Nigeria. We obtain consent, pay people for their expertise and return findings to communities."
    />
  );
}
