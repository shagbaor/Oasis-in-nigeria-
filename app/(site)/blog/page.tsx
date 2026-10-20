import type { Metadata } from "next";
import { PostIndex } from "@/components/PostIndex";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories, news and updates from OASIS.",
};

export default function BlogPage() {
  return (
    <PostIndex
      kind="blog"
      eyebrow="Stories & updates"
      title="The OASIS Blog"
      lead="News from our programmes, voices from our community, and ways to take action."
    />
  );
}
