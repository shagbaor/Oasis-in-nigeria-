import { ADDRESS, AIM, CONTACT_EMAIL, FULL_NAME, SITE_URL, SOCIALS } from "@/lib/identity";

// Escape "<" so content can never close the <script> tag early.
const json = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

// Tells search engines who OASIS is (name, logo, address, contacts), so a search
// for the organisation can show the right details.
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NGO",
        "@id": ORGANIZATION_ID,
        name: "OASIS",
        alternateName: [FULL_NAME, "OASIS Nigeria", "OASIS in Nigeria"],
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/oasis-logo.png`, width: 600, height: 247 },
        image: `${SITE_URL}/opengraph-image`,
        slogan: "Safety. Dignity. Recovery.",
        description: AIM,
        email: CONTACT_EMAIL,
        address: {
          "@type": "PostalAddress",
          addressLocality: ADDRESS.locality,
          addressRegion: ADDRESS.region,
          addressCountry: ADDRESS.countryCode,
        },
        areaServed: { "@type": "Country", name: "Nigeria" },
        knowsAbout: [
          "Climate-related displacement",
          "Mental health and psychosocial support",
          "Safer housing",
          "Access to healthcare",
          "Livelihood recovery",
          "Climate preparedness",
        ],
        sameAs: SOCIALS.map((social) => social.url),
        contactPoint: { "@type": "ContactPoint", contactType: "general enquiries", email: CONTACT_EMAIL, areaServed: "NG" },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "OASIS",
        alternateName: FULL_NAME,
        inLanguage: "en-NG",
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(data) }} />;
}

export function ArticleJsonLd({
  kind,
  title,
  description,
  path,
  image,
  published,
  modified,
}: {
  kind: "blog" | "research";
  title: string;
  description: string;
  path: string;
  image: string | null;
  published: Date | null;
  modified: Date;
}) {
  const url = `${SITE_URL}${path}`;
  const data = {
    "@context": "https://schema.org",
    "@type": kind === "research" ? "Report" : "BlogPosting",
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    image: image ? new URL(image, SITE_URL).toString() : `${SITE_URL}/opengraph-image`,
    datePublished: published ? new Date(published).toISOString() : undefined,
    dateModified: new Date(modified).toISOString(),
    inLanguage: "en-NG",
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(data) }} />;
}
