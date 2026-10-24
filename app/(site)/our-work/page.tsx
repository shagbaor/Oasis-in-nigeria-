import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Band, Label, PatternPanel, ProverbBox } from "@/components/Brand";
import { AIM, FOCUS, GUIDING_PRINCIPLE, MISSION, MISSION_AREAS, OBJECTIVES, PROVERBS, VISION } from "@/lib/identity";

export const metadata: Metadata = pageMetadata({
  title: "Our work",
  path: "/our-work",
  description:
    "How OASIS helps people displaced by floods, drought and other climate disruption in Nigeria: mental wellbeing, safer housing, healthcare and livelihoods.",
});

export default function OurWorkPage() {
  return (
    <>
      <section className="work-hero">
        <div className="container work-hero-grid">
          <div>
            <Label>Thematic focus</Label>
            <h1 className="page-title">Inclusive climate adaptation and mental-health recovery</h1>
          </div>
          <PatternPanel className="work-pattern" />
        </div>
        <Band />
      </section>

      <section className="section section-cream">
        <div className="container focus-grid">
          <table className="id-table focus-table">
            <thead>
              <tr>
                <th scope="col">Focus</th>
                <th scope="col">Detail</th>
              </tr>
            </thead>
            <tbody>
              {FOCUS.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td>{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <aside className="focus-aside">
            <div className="principle-card">
              <Label>Our guiding principle</Label>
              <p>{GUIDING_PRINCIPLE}</p>
            </div>
            <ProverbBox proverb={PROVERBS.slowly} />
          </aside>
        </div>
      </section>

      <section className="section section-white" id="objectives">
        <div className="container">
          <div className="section-head">
            <Label>Our aim and objectives</Label>
            <h2>Five core objectives</h2>
            <p className="aim">{AIM}</p>
          </div>
          <table className="id-table objectives-table">
            <thead>
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Objective</th>
                <th scope="col">What we do</th>
                <th scope="col">Mission area</th>
              </tr>
            </thead>
            <tbody>
              {OBJECTIVES.map((row, i) => (
                <tr key={row.title}>
                  <td className="objective-number">{String(i + 1).padStart(2, "0")}</td>
                  <th scope="row">{row.title}</th>
                  <td data-label="What we do">{row.detail}</td>
                  <td data-label="Mission area" className="applies">
                    {row.area}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="split-panels">
        <div className="panel-dark">
          <div className="panel-inner">
            <Label>Our vision</Label>
            <p className="vision">{VISION}</p>
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
            <div className="work-cta">
              <Link href="/work-with-us" className="btn">
                Partner with us
              </Link>
              <Link href="/publications" className="btn btn-outline">
                Read our publications
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
