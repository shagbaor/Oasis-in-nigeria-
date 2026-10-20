import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { ContactForm } from "@/components/ContactForm";
import { SubjectLink } from "@/components/SubjectLink";
import { PostCard } from "@/components/PostCard";
import { listPublishedPosts, type PostKind } from "@/lib/posts";

const PILLARS = [
  {
    title: "Outreach",
    text: "We go where people are — meeting communities directly with support, information and connection to services.",
    icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 14.2a7.2 7.2 0 0 1-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.2 7.2 0 0 1-6 3.2Z",
  },
  {
    title: "Affirming Spaces",
    text: "We create and support safe physical and online spaces where people can show up as themselves without fear.",
    icon: "M12 3 2 9l10 6 10-6-10-6Zm-6 9.2V16l6 3.6 6-3.6v-3.8l-6 3.6-6-3.6Z",
  },
  {
    title: "Inclusion",
    text: "Through training, dialogue and advocacy, we help institutions and communities become more welcoming to all.",
    icon: "M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13Zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 2 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5Z",
  },
  {
    title: "Sustainability",
    text: "We support livelihoods, wellbeing and environmental stewardship so that communities can thrive long-term.",
    icon: "M17 8C8 10 5.9 16.2 3.8 21.3l1.9.7.9-2.3c.5.2 1 .3 1.4.3C19 20 22 3 22 3c-1 2-8 2.3-13 3.3S2 11.5 2 13.5s1.8 3.8 1.8 3.8C7 8 17 8 17 8Z",
  },
];

const VALUES = [
  ["Dignity", "Every person is treated with respect, always."],
  ["Safety", "We protect the privacy and wellbeing of those we serve."],
  ["Community", "Solutions are shaped by the people they are meant for."],
  ["Integrity", "We are transparent and accountable in everything we do."],
  ["Stewardship", "We care for people and the planet together."],
];

const WAYS = [
  {
    title: "Volunteer",
    text: "Lend your time and talents to outreach events, mentoring, communications and more.",
    subject: "Volunteering",
    cta: "Become a volunteer",
  },
  {
    title: "Donate",
    text: "Your gift funds safe spaces, community programmes and direct support for people in need.",
    subject: "Donation",
    cta: "Support our work",
  },
  {
    title: "Partner",
    text: "Organisations, businesses and funders — let's work together to widen our reach and impact.",
    subject: "Partnership",
    cta: "Partner with us",
  },
];

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
    <section className={`section${research ? "" : " section-tint"}`} id={kind}>
      <div className="container">
        <div className="section-head section-head-row">
          <div>
            <p className="eyebrow">{research ? "Evidence & insight" : "Stories & updates"}</p>
            <h2>{research ? "Latest research" : "From our blog"}</h2>
          </div>
          <Link href={`/${kind}`} className="link-arrow link-arrow-teal">
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
        <div className="container hero-inner">
          <p className="eyebrow">Outreach for Affirming Spaces, Inclusion and Sustainability</p>
          <h1>Every person deserves a place where they belong.</h1>
          <p className="lead">
            OASIS is a non-profit organisation creating safe, affirming spaces, championing inclusion, and building
            communities that can thrive for generations.
          </p>
          <div className="hero-actions">
            <a href="#involved" className="btn">
              Get Involved
            </a>
            <a href="#about" className="btn btn-ghost">
              Learn More
            </a>
          </div>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,64 C240,120 480,0 720,48 C960,96 1200,24 1440,64 L1440,120 L0,120 Z" />
        </svg>
      </section>

      <section className="section" id="about">
        <div className="container split">
          <div>
            <p className="eyebrow">Who we are</p>
            <h2>An oasis of safety, dignity and hope</h2>
          </div>
          <div className="prose">
            <p>
              We believe that inclusion is not a privilege — it is a right. OASIS works alongside individuals and
              communities who are too often left out, to create environments where everyone is seen, respected and
              supported.
            </p>
            <p>
              Through outreach, education, advocacy and community-led programmes, we connect people to the resources,
              networks and opportunities they need to live with dignity, while caring for the environment that
              sustains us all.
            </p>
            <div className="mission-grid">
              <div className="mission-card">
                <h3>Our Mission</h3>
                <p>To build affirming spaces and inclusive communities through outreach, empowerment and sustainable action.</p>
              </div>
              <div className="mission-card">
                <h3>Our Vision</h3>
                <p>A society where every person can live openly, safely and fully, in harmony with their community and environment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tint" id="work">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">What we do</p>
            <h2>Four pillars, one purpose</h2>
            <p>Our programmes are built around the four commitments in our name.</p>
          </div>
          <div className="cards">
            {PILLARS.map((pillar) => (
              <article className="card" key={pillar.title}>
                <div className="card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d={pillar.icon} />
                  </svg>
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="values">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">What guides us</p>
            <h2>Our values</h2>
          </div>
          <ul className="values">
            {VALUES.map(([name, text]) => (
              <li key={name}>
                <strong>{name}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-dark" id="involved">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Join the movement</p>
            <h2>Ways to get involved</h2>
            <p>Whatever your skills or resources, there is a place for you at OASIS.</p>
          </div>
          <div className="cards cards-3">
            {WAYS.map((way) => (
              <article className="card card-dark" key={way.title}>
                <h3>{way.title}</h3>
                <p>{way.text}</p>
                <SubjectLink subject={way.subject}>{way.cta}</SubjectLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <LatestPosts kind="research" />
      </Suspense>

      <Suspense fallback={null}>
        <LatestPosts kind="blog" />
      </Suspense>

      <section className="section" id="contact">
        <div className="container split">
          <div>
            <p className="eyebrow">Get in touch</p>
            <h2>We&apos;d love to hear from you</h2>
            <p className="muted">
              Whether you need support, want to volunteer, or are interested in partnering, send us a message. All
              enquiries are treated confidentially.
            </p>
            <ul className="contact-list">
              <li>
                <span>Email</span>
                <a href="mailto:hello@oasis.org">hello@oasis.org</a>
              </li>
              <li>
                <span>Location</span>Nigeria
              </li>
            </ul>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
