import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { Band, Label, Motto, PatternPanel, ProverbBox } from "@/components/Brand";
import {
  INTELLECTUAL_GROUNDING,
  LETTERS,
  PHILOSOPHY,
  PRINCIPLES,
  PROVERBS,
  PURPOSE_LONG,
} from "@/lib/identity";

export const metadata: Metadata = pageMetadata({
  title: "About",
  path: "/about",
  description:
    "About OASIS (Outreach for Affirming Spaces, Inclusion and Sustainability): our name, our motto Safety. Dignity. Recovery., and the values behind our work in Nigeria.",
});

export default function AboutPage() {
  return (
    <>
      <section className="section section-cream">
        <div className="container about-name">
          <div>
            <Label>The name</Label>
            <h1 className="page-title">Every letter carries a commitment.</h1>
            <Band className="band-short" />
            <table className="id-table letters-table">
              <thead>
                <tr>
                  <th scope="col">Letter</th>
                  <th scope="col">Word</th>
                  <th scope="col">What it means for our work</th>
                </tr>
              </thead>
              <tbody>
                {LETTERS.map((row) => (
                  <tr key={row.word}>
                    <td className="big-letter" aria-hidden="true">
                      {row.letter}
                    </td>
                    <th scope="row">{row.word}</th>
                    <td>{row.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <aside className="about-aside">
            <div className="motto-card">
              <Image src="/oasis-logo.svg" alt="OASIS" width={300} height={122} />
              <hr />
              <Label>Our motto</Label>
              <Motto />
            </div>
            <p className="purpose">{PURPOSE_LONG}</p>
            <ProverbBox proverb={PROVERBS.noOneBehind} />
          </aside>
        </div>
      </section>

      <section className="philosophy-hero">
        <div className="container philosophy-grid">
          <div>
            <Label>Our political philosophy</Label>
            <h2 className="page-title">
              {PHILOSOPHY.headline.map((line) => (
                <span key={line}>{line} </span>
              ))}
            </h2>
            <p className="philosophy-intro">{PHILOSOPHY.intro}</p>
          </div>
          <PatternPanel className="philosophy-pattern" />
        </div>
        <Band />
      </section>

      <section className="section section-cream">
        <div className="container">
          <table className="id-table philosophy-table">
            <thead>
              <tr>
                <td />
                <th scope="col">Our decolonial approach</th>
                <th scope="col">Our feminist approach</th>
              </tr>
            </thead>
            <tbody>
              {PHILOSOPHY.rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td data-label="Our decolonial approach">{row.decolonial}</td>
                  <td data-label="Our feminist approach">{row.feminist}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="philosophy-close">
            <p className="purpose">{PHILOSOPHY.summary}</p>
            <ProverbBox proverb={PROVERBS.joinedHands} />
          </div>
        </div>
      </section>

      <section className="split-panels split-panels-wide">
        <div className="panel-light">
          <div className="panel-inner">
            <Label>Principles in practice</Label>
            <h2 className="page-title">How we hold ourselves to account</h2>
            <Band className="band-short" />
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
            <p className="muted grounding">
              {INTELLECTUAL_GROUNDING.before}
              <cite>{INTELLECTUAL_GROUNDING.title}</cite>
              {INTELLECTUAL_GROUNDING.after}
            </p>
          </div>
        </div>
        <div className="panel-dark">
          <PatternPanel className="pattern-strip" />
          <Band onDark />
          <div className="panel-inner closing">
            <ProverbBox proverb={PROVERBS.multitude} dark />
            <Image src="/oasis-logo-reversed.svg" alt="" width={300} height={122} className="closing-logo" />
            <Motto className="motto-on-dark" />
          </div>
        </div>
      </section>
    </>
  );
}
