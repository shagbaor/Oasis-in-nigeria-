import { Suspense } from "react";
import { PostArticle, postMetadata } from "@/components/PostArticle";

export async function generateMetadata({ params }: PageProps<"/publications/[slug]">) {
  return postMetadata("research", (await params).slug);
}

export default function PublicationPage({ params }: PageProps<"/publications/[slug]">) {
  return (
    <Suspense fallback={<div className="page-hero" />}>
      <PostArticle kind="research" slug={params.then((p) => p.slug)} />
    </Suspense>
  );
}
