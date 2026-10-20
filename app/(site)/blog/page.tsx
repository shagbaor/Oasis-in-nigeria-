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
      eyebrow="Stories and updates"
      title="The OASIS Blog"
      lead="News and reflections from OASIS on safety, dignity and recovery."
    />
  );
}
