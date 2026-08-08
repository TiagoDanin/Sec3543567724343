// Fonte única de URL, identidade e SEO. A URL do site não se repete em nenhum
// outro arquivo: tudo passa por `absoluteUrl` e `pageMetadata`.

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const site = {
  siteName: "XibéSec 2026",
  siteTagline: "Para quem tem fome de segurança",
  siteDescription:
    "O encontro de cibersegurança que leva a energia do Norte do Brasil para quem vive infosec, hacking e tecnologia. 4ª edição: 19 de setembro de 2026, 09h às 19h, Bristol Marambaia Hotel, Belém do Pará.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://xibesec.com.br",
  locale: "pt-BR",

  ogImage: "/og-xibesec-2026.png",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt:
    "XibéSec 26: logotipo e mascote ciber-amazônico na mata, com a data 19 de setembro de 2026, das 09h às 19h, no Bristol Marambaia Hotel em Belém, PA.",

  themeColor: "#152310",

  organizationName: "Hekate, Inc.",
  organizationUrl: "https://www.hekateinc.com/",
  contactEmail: "contact@hekateinc.com",

  city: "Belém",
  region: "PA",
  regionName: "Pará",
  country: "BR",

  keywords: [
    "XibéSec",
    "cibersegurança",
    "segurança da informação",
    "infosec",
    "hacking",
    "CTF",
    "Belém",
    "Pará",
    "Amazônia",
    "evento de segurança",
    "conferência",
  ],

  social: {
    instagram: "https://www.instagram.com/xibesec/",
    linkedin: "https://www.linkedin.com/company/xibesec/",
    linktree: "https://linktr.ee/xibesec",
  },
} as const;

/** URL absoluta, respeitando `basePath` quando o site não está na raiz. */
export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${site.siteUrl}${basePath}${clean === "/" ? "" : clean}`;
}

/** Caminho de asset servido de `public/`, com `basePath` aplicado. */
export function asset(path: string): string {
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}

export function socialLinks(): string[] {
  return Object.values(site.social);
}

/**
 * Metadata completo de uma página interna. Toda rota nova passa por aqui — é o
 * que impede uma página sair sem canonical.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}) {
  const url = absoluteUrl(path);
  const fullTitle = `${title} · ${site.siteName}`;
  const ogImage = absoluteUrl(image ?? site.ogImage);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.siteName,
      locale: "pt_BR",
      type: "website" as const,
      images: [
        {
          url: ogImage,
          width: site.ogImageWidth,
          height: site.ogImageHeight,
          alt: site.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
