import { Suspense } from "react";
import { PostArticle, postMetadata } from "@/components/PostArticle";

export async function generateMetadata({ params }: PageProps<"/research/[slug]">) {
  return postMetadata("research", (await params).slug);
}

export default function ResearchPostPage({ params }: PageProps<"/research/[slug]">) {
  return (
    <Suspense fallback={<div className="page-hero" />}>
      <PostArticle kind="research" slug={params.then((p) => p.slug)} />
    </Suspense>
  );
}
