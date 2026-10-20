import { Suspense } from "react";
import { PostArticle, postMetadata } from "@/components/PostArticle";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  return postMetadata("blog", (await params).slug);
}

export default function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<div className="page-hero" />}>
      <PostArticle kind="blog" slug={params.then((p) => p.slug)} />
    </Suspense>
  );
}
