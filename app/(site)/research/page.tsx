import type { Metadata } from "next";
import { PostIndex } from "@/components/PostIndex";

export const metadata: Metadata = {
  title: "Research",
  description: "Research, reports and findings from OASIS.",
};

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
