// JSON-LD (schema.org). Gerado a partir de `site.ts` + `contents/` — nunca
// escrito como string fixa, senão volta a divergir do conteúdo publicado.
import { site, absoluteUrl, canonicalUrl, socialLinks } from "./site";
import type { AgendaItem, Ingresso, Palestrante, Patrocinador, Settings } from "./content-types";

/** A home com a barra final, como o canonical a publica. Base dos `@id`. */
const HOME = canonicalUrl("/");

const ORG_ID = `${HOME}#organization`;
const WEBSITE_ID = `${HOME}#website`;
const EVENT_ID = `${HOME}#event`;

/**
 * `streetAddress` sem repetir cidade e UF — elas já vão em `addressLocality` e
 * `addressRegion`, e o endereço do CMS é uma linha só, do jeito que se escreve
 * num convite.
 */
function streetAddress(venueAddress: string): string {
  const cauda = new RegExp(`[,.]?\\s*${site.city}\\s*[/-]\\s*${site.region}\\.?\\s*$`, "i");
  return venueAddress.replace(cauda, "").trim();
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: site.organizationName,
  url: site.organizationUrl,
  email: site.contactEmail,
  logo: absoluteUrl("/images/marca/logo-hekate.png"),
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: HOME,
  name: site.siteName,
  description: site.siteDescription,
  inLanguage: site.locale,
  publisher: { "@id": ORG_ID },
  // Amarra o site à entidade do evento: é o que faz um sistema de busca
  // entender que a página é sobre o XibéSec, não sobre a organizadora.
  about: { "@id": EVENT_ID },
};

/** Preço do `Offer` em unidade monetária, a partir dos centavos do conteúdo. */
const price = (cents: number) => (cents / 100).toFixed(2);

export function eventSchema({
  settings,
  ingressos,
  agenda = [],
  patrocinadores = [],
  palestrantes = [],
}: {
  settings: Settings;
  ingressos: Ingresso[];
  /** Só a grade confirmada vira `subEvent`: item em definição não é promessa. */
  agenda?: AgendaItem[];
  patrocinadores?: Patrocinador[];
  palestrantes?: Palestrante[];
}) {
  const confirmados = agenda.filter((item) => item.status === "confirmado");

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": EVENT_ID,
    name: site.siteName,
    description: site.siteDescription,
    startDate: settings.eventStartDate,
    endDate: settings.eventEndDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    inLanguage: site.locale,
    isAccessibleForFree: false,
    keywords: [...site.keywords].join(", "),
    url: HOME,
    image: [absoluteUrl(site.ogImage)],
    location: {
      "@type": "Place",
      name: settings.venueName,
      ...(settings.venueMapUrl ? { hasMap: settings.venueMapUrl } : {}),
      address: {
        "@type": "PostalAddress",
        streetAddress: streetAddress(settings.venueAddress),
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
      availabilityEnds: ticket.validThrough,
      url: ticket.ctaUrl,
    })),
    ...(confirmados.length > 0 && {
      subEvent: confirmados.map((item) => ({
        "@type": "Event",
        name: item.titulo,
        description: item.descricao,
        startDate: item.startsAt,
        endDate: item.endsAt,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: { "@type": "Place", name: settings.venueName },
      })),
    }),
    ...(patrocinadores.length > 0 && {
      sponsor: patrocinadores.map((item) => ({
        "@type": "Organization",
        name: item.nome,
        ...(item.url ? { url: item.url } : {}),
      })),
    }),
    ...(palestrantes.length > 0 && {
      performer: palestrantes.map((item) => generatePersonSchema(item)),
    }),
  };
}

/** `Person` de palestrante. Cargo e organização só entram quando existem. */
export function generatePersonSchema(palestrante: Palestrante) {
  return {
    "@type": "Person",
    name: palestrante.nome,
    ...(palestrante.cargo ? { jobTitle: palestrante.cargo } : {}),
    ...(palestrante.empresa
      ? { worksFor: { "@type": "Organization", name: palestrante.empresa } }
      : {}),
    ...(palestrante.foto ? { image: absoluteUrl(palestrante.foto) } : {}),
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
