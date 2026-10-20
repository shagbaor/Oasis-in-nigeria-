import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { connection } from "next/server";
import { PostCard } from "@/components/PostCard";
import { Band, Label, PatternPanel, ProverbBox } from "@/components/Brand";
import { listPublishedPosts, type PostKind } from "@/lib/posts";
import { AIM, FULL_NAME, MISSION, MISSION_AREAS, OBJECTIVES, PROVERBS, PURPOSE, VISION, WAYS_TO_WORK, contactHref } from "@/lib/identity";

export const metadata: Metadata = pageMetadata({
  path: "/",
  description:
    "OASIS is a Nigerian non-profit helping marginalised people affected by climate-related displacement stay safe, recover their mental wellbeing and rebuild their lives.",
});

async function LatestPosts({ kind }: { kind: PostKind }) {
  await connection();
  let posts;
  try {
    posts = await listPublishedPosts(kind, 3);
  } catch (error) {
    console.error(`Could not load latest ${kind} posts`, error);
    return null;
  }
  if (posts.length === 0) return null;

  const research = kind === "research";
  return (
    <section className={`section${research ? " section-white" : ""}`} id={kind}>
      <div className="container">
        <div className="section-head section-head-row">
          <div>
            <Label>{research ? "Evidence and insight" : "Stories and updates"}</Label>
            <h2>{research ? "Latest research" : "From our blog"}</h2>
          </div>
          <Link href={`/${kind}`} className="link-arrow">
            {research ? "All research" : "All posts"}
          </Link>
        </div>
        <div className="cards cards-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="hero" id="top">
        <Band className="hero-band" />
        <div className="hero-grid">
          <div className="hero-copy">
            <Label>{FULL_NAME}</Label>
            <h1 className="hero-motto">
              <span>Safety.</span> <span>Dignity.</span> <span className="motto-accent">Recovery.</span>
            </h1>
            <p className="lead">{PURPOSE}</p>
            <div className="hero-actions">
              <Link href="/our-work" className="btn">
                Our work
              </Link>
              <Link href="/contact" className="btn btn-outline">
                Get in touch
              </Link>
            </div>
            <ProverbBox proverb={PROVERBS.palace} />
          </div>
          <PatternPanel className="hero-pattern" />
        </div>
      </section>

      <section className="split-panels" id="about">
        <div className="panel-dark">
          <div className="panel-inner">
            <Label>Our vision</Label>
            <p className="vision">{VISION}</p>
          </div>
          <div className="panel-foot">
            <Band onDark />
            <PatternPanel className="pattern-strip" />
          </div>
        </div>
        <div className="panel-light">
          <div className="panel-inner">
            <Label>Our mission</Label>
            <p className="mission">{MISSION}</p>
            <ul className="area-grid">
              {MISSION_AREAS.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
            <ProverbBox proverb={PROVERBS.kiteAndEagle} />
          </div>
        </div>
      </section>

      <section className="section" id="work">
        <div className="container">
          <div className="section-head section-head-row">
            <div>
              <Label>Core objectives</Label>
              <h2>Five core objectives</h2>
              <p>{AIM}</p>
            </div>
            <Link href="/our-work" className="link-arrow">
              How we work
            </Link>
          </div>
          <ol className="objective-cards">
            {OBJECTIVES.map((objective, i) => (
              <li key={objective.title}>
                <span className="objective-number">{String(i + 1).padStart(2, "0")}</span>
                <h3>{objective.title}</h3>
                <p>{objective.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Suspense fallback={null}>
        <LatestPosts kind="research" />
      </Suspense>

      <section className="section section-dark section-patterned" id="involved">
        <Band onDark className="band-top" />
        <div className="container involved-grid">
          <div>
            <Label>Work with us</Label>
            <h2>One hand cannot lift a thatched roof</h2>
            <p className="involved-lead">
              We work with trusted community, healthcare and housing partners. If you share our commitment to safety,
              dignity and recovery, we would like to hear from you.
            </p>
            <ProverbBox proverb={PROVERBS.oneHand} dark />
          </div>
          <div className="involved-cards">
            {WAYS_TO_WORK.map((way) => (
              <Link href={contactHref(way.subject)} className="card card-dark card-link" key={way.title}>
                <h3>{way.title}</h3>
                <span className="link-arrow">{way.cta}</span>
              </Link>
            ))}
            <Link href="/work-with-us" className="btn btn-light">
              More about working with us
            </Link>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <LatestPosts kind="blog" />
      </Suspense>

      <section className="section section-white" id="contact">
        <div className="container contact-teaser">
          <div>
            <Label>Get in touch</Label>
            <h2>We&apos;d love to hear from you</h2>
            <p className="muted">
              Whether you are looking for support, or want to partner, fund or collaborate with us, send us a message.
              Every enquiry is treated confidentially.
            </p>
            <Link href="/contact" className="btn">
              Contact us
            </Link>
          </div>
          <p className="safety-note">
            <strong>If you are in immediate danger,</strong> call <a href="tel:112">112</a>, Nigeria&apos;s national
            emergency number.
          </p>
        </div>
      </section>
    </>
  );
}
