// JSON-LD (schema.org). Gerado a partir de `site.ts` + `contents/` — nunca
// escrito como string fixa, senão volta a divergir do conteúdo publicado.
import { site, absoluteUrl, socialLinks } from "./site";
import type { Ingresso, Settings } from "./content-types";

const ORG_ID = `${absoluteUrl("/")}#organization`;
const WEBSITE_ID = `${absoluteUrl("/")}#website`;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: site.organizationName,
  url: site.organizationUrl,
  email: site.contactEmail,
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: absoluteUrl("/"),
  name: site.siteName,
  description: site.siteDescription,
  inLanguage: site.locale,
  publisher: { "@id": ORG_ID },
};

/** Preço do `Offer` em unidade monetária, a partir dos centavos do conteúdo. */
const price = (cents: number) => (cents / 100).toFixed(2);

export function eventSchema({
  settings,
  ingressos,
}: {
  settings: Settings;
  ingressos: Ingresso[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: site.siteName,
    description: site.siteDescription,
    startDate: settings.eventStartDate,
    endDate: settings.eventEndDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    inLanguage: site.locale,
    url: absoluteUrl("/"),
    image: [absoluteUrl(site.ogImage)],
    location: {
      "@type": "Place",
      name: settings.venueName,
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.venueAddress,
        addressLocality: site.city,
        addressRegion: site.region,
        addressCountry: site.country,
      },
    },
    organizer: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: site.organizationName,
      email: site.contactEmail,
      url: site.organizationUrl,
    },
    offers: ingressos.map((ticket) => ({
      "@type": "Offer",
      name: ticket.nome,
      price: price(ticket.preco),
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      validThrough: ticket.validThrough,
      url: ticket.ctaUrl,
    })),
  };
}

export function generateFaqSchema(items: Array<{ pergunta: string; resposta: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.pergunta,
      acceptedAnswer: { "@type": "Answer", text: item.resposta },
    })),
  };
}

export function generateBreadcrumbs(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export const organizationWithSocial = {
  ...organizationSchema,
  sameAs: socialLinks(),
};

export function SchemaMarkup({ schema }: { schema: object | object[] }) {
  const list = Array.isArray(schema) ? schema : [schema];
  return (
    <>
      {list.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
