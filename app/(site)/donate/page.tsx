import type { Metadata } from "next";
import Link from "next/link";
import { Band, Label, ProverbBox } from "@/components/Brand";
import { BANK_TRANSFER, ONLINE_GIVING_URL } from "@/lib/donate";
import { CONTACT_EMAIL, OBJECTIVES, PROVERBS, contactHref } from "@/lib/identity";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support safety, dignity and recovery for people affected by climate-related displacement in Nigeria.",
};

const STANDARDS = [
  {
    title: "Communities shape the budget",
    text: "Affected communities hold governing roles and share authority over resource decisions.",
  },
  {
    title: "Funding follows community goals",
    text: "Funding supports community-defined goals, not priorities set from outside.",
  },
  {
    title: "Dignity in how we fundraise",
    text: "We never require trauma stories or photographs, and we return findings to communities.",
  },
  {
    title: "The same standards for everyone",
    text: "We apply our standards of choice, dignity and confidentiality to leaders, staff and funders alike.",
  },
];

export default function DonatePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Label>Donate</Label>
          <h1>Support safety, dignity and recovery</h1>
          <p className="lead">
            Your gift helps marginalised people affected by climate-related displacement in Nigeria stay safe, stay
            mentally well and rebuild their lives.
          </p>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container">
          <div className="section-head">
            <Label>What your gift supports</Label>
            <h2>Five connected objectives</h2>
            <p>Donations fund the work behind each of our objectives.</p>
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

      <section className="section section-white" id="give">
        <div className="container">
          <div className="section-head">
            <Label>Ways to give</Label>
            <h2>Make a donation</h2>
          </div>
          <div className="donate-options">
            <article className="donate-option">
              <h3>Give online</h3>
              {ONLINE_GIVING_URL ? (
                <>
                  <p>Make a secure one-off or regular gift online.</p>
                  <a href={ONLINE_GIVING_URL} className="btn" target="_blank" rel="noopener noreferrer">
                    Donate online
                  </a>
                </>
              ) : (
                <p>
                  Online giving is coming soon. In the meantime, contact us and we will send you the details to give.
                </p>
              )}
            </article>

            <article className="donate-option">
              <h3>Bank transfer</h3>
              {BANK_TRANSFER ? (
                <dl className="bank-details">
                  <dt>Bank</dt>
                  <dd>{BANK_TRANSFER.bank}</dd>
                  <dt>Account name</dt>
                  <dd>{BANK_TRANSFER.accountName}</dd>
                  <dt>Account number</dt>
                  <dd>{BANK_TRANSFER.accountNumber}</dd>
                  {BANK_TRANSFER.note && <dd className="bank-note">{BANK_TRANSFER.note}</dd>}
                </dl>
              ) : (
                <p>Contact us for our bank details. We confirm every transfer by email.</p>
              )}
            </article>

            <article className="donate-option">
              <h3>Talk to us</h3>
              <p>
                For larger gifts, regular giving or giving on behalf of an organisation, email{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or send us a message.
              </p>
              <Link href={contactHref("Donation")} className="btn btn-outline">
                Contact us about giving
              </Link>
            </article>
          </div>
          <p className="muted donate-funders">
            Funding an organisation or programme? See <Link href="/work-with-us">work with us</Link>.
          </p>
        </div>
      </section>

      <section className="section section-dark section-patterned">
        <Band onDark className="band-top" />
        <div className="container donate-standards">
          <div>
            <Label>How we use your gift</Label>
            <h2>Accountable to communities</h2>
            <ul className="standards-list">
              {STANDARDS.map((item) => (
                <li key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <ProverbBox proverb={PROVERBS.joinedHands} dark />
        </div>
      </section>
    </>
  );
}
