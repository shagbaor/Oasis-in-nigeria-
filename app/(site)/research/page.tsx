import type { Metadata } from "next";
import { PostIndex } from "@/components/PostIndex";

export const metadata: Metadata = {
  title: "Research",
  description: "Research, reports and findings from OASIS.",
};

export default function ResearchPage() {
  return (
    <PostIndex
      kind="research"
      eyebrow="Evidence & insight"
      title="Research"
      lead="Our studies, reports and findings on inclusion, affirming spaces and sustainable communities."
    />
  );
}
