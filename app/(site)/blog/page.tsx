import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PostIndex } from "@/components/PostIndex";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  path: "/blog",
  description:
    "News and stories from OASIS on climate displacement, mental wellbeing and recovery for marginalised communities in Nigeria.",
});

export default function BlogPage({ searchParams }: PageProps<"/blog">) {
  return (
    <PostIndex
      searchParams={searchParams}
      kind="blog"
      eyebrow="Stories and updates"
      title="The OASIS Blog"
      lead="News and reflections from OASIS on safety, dignity and recovery."
    />
  );
}
