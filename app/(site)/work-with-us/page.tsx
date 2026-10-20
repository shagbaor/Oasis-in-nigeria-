import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Band, Label, ProverbBox } from "@/components/Brand";
import { FOCUS, PRINCIPLES, PROVERBS, WAYS_TO_WORK, contactHref } from "@/lib/identity";

export const metadata: Metadata = pageMetadata({
  title: "Work with us",
  path: "/work-with-us",
  description:
    "Partner, fund or collaborate with OASIS to support people affected by climate-related displacement in Nigeria. Community, healthcare and housing partners welcome.",
});

const WHERE_WE_BEGIN = FOCUS.find((row) => row.label === "Where we begin")!;

export default function WorkWithUsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Label>Work with us</Label>
          <h1>One hand cannot lift a thatched roof</h1>
          <p className="lead">
            No single organisation can do this alone. Our objectives depend on trusted community, healthcare and
            housing partners.
          </p>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container involved-page-grid">
          <div>
            <Label>Where we begin</Label>
            <p className="purpose">{WHERE_WE_BEGIN.detail}</p>
            <p className="muted">
              If you share our commitment to safety, dignity and recovery, we would like to hear from you.
            </p>
          </div>
          <ProverbBox proverb={PROVERBS.oneHand} />
        </div>
      </section>

      <section className="section section-dark section-patterned">
        <Band onDark className="band-top" />
        <div className="container">
          <div className="section-head">
            <Label>Ways to work with us</Label>
            <h2>Partner, fund or collaborate</h2>
          </div>
          <div className="cards cards-3">
            {WAYS_TO_WORK.map((way) => (
              <article className="card card-dark" key={way.title}>
                <h3>{way.title}</h3>
                <p>{way.text}</p>
                <Link href={contactHref(way.subject)} className="link-arrow">
                  {way.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container">
          <div className="section-head">
            <Label>What partners can expect</Label>
            <h2>The standards we hold ourselves to</h2>
            <p>These principles apply to everyone connected to OASIS, including our partners and funders.</p>
          </div>
          <table className="id-table">
            <thead>
              <tr>
                <th scope="col">Principle</th>
                <th scope="col">Our commitment</th>
                <th scope="col">Applies to</th>
              </tr>
            </thead>
            <tbody>
              {PRINCIPLES.map((row) => (
                <tr key={row.principle}>
                  <th scope="row">{row.principle}</th>
                  <td data-label="Our commitment">{row.commitment}</td>
                  <td data-label="Applies to" className="applies">
                    {row.appliesTo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="work-cta page-cta">
            <Link href={contactHref("Partnership")} className="btn">
              Get in touch
            </Link>
            <Link href="/our-work" className="btn btn-outline">
              See our objectives
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
