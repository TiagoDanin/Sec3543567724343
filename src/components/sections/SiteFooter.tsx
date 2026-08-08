import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import { asset, site } from "@/lib/site";
import type { Organizacao, Settings } from "@/lib/cms";

// Títulos de coluna são estrutura de navegação, não conteúdo editorial.
const COL_REDES = "Redes";
const COL_REALIZACAO = "Realização";

export type SiteFooterProps = {
  settings: Settings;
  equipe: Organizacao[];
};

/** As duas marcas convivem: o evento e quem realiza, separados por filete. */
export function SiteFooter({ settings, equipe }: SiteFooterProps) {
  const organizacao = equipe[0];
  const tagline = `${site.siteTagline}. ${site.city}, ${site.regionName}, Brasil`;

  return (
    <Footer
      tagline={tagline}
      brand={
        <>
          <Image
            src={asset("/images/marca/logo-xibesec.png")}
            alt={site.siteName}
            width={1600}
            height={1282}
            loading="lazy"
            className="h-16 w-auto"
          />

          {organizacao?.logo ? (
            <>
              <span aria-hidden="true" className="bg-line-2 my-1.5 w-px self-stretch" />
              <a
                href={organizacao.url}
                target="_blank"
                rel="noopener"
                className="group inline-flex"
              >
                <Image
                  src={asset(organizacao.logo)}
                  alt={`${organizacao.nome}, ${organizacao.papel.toLowerCase()} do ${site.siteName}`}
                  width={242}
                  height={209}
                  loading="lazy"
                  className="ease-brand h-16 w-auto opacity-85 transition-opacity duration-280 group-hover:opacity-100"
                />
              </a>
            </>
          ) : null}
        </>
      }
      columns={[
        {
          title: COL_REDES,
          links: [
            { label: "Instagram", href: site.social.instagram, external: true },
            { label: "LinkedIn", href: site.social.linkedin, external: true },
            { label: "Linktree", href: site.social.linktree, external: true },
            { label: "Sympla", href: settings.ticketsUrl, external: true },
          ],
        },
        {
          title: COL_REALIZACAO,
          lead: organizacao?.nome,
          links: [
            { label: site.contactEmail, href: `mailto:${site.contactEmail}` },
            {
              label: site.organizationUrl.replace(/^https?:\/\/|\/$/g, ""),
              href: site.organizationUrl,
              external: true,
            },
          ],
        },
      ]}
    />
  );
}
