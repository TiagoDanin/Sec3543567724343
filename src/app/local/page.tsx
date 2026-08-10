import { notFound } from "next/navigation";
import { PaginaInterna } from "@/components/layout/PaginaInterna";
import { LocalSection } from "@/components/sections/LocalSection";

import { metadataDeRota } from "@/lib/docs";
import { rotaPublicada } from "@/lib/rotas";
import { generateBreadcrumbs, webPageSchema } from "@/lib/schema";
import { canonicalUrl, site } from "@/lib/site";
import { SECAO_VAZIA, getSecoes, getSettings } from "@/lib/cms";

const ROTA = "/local";
const HOME_LABEL = "Início";
const TITULO = "Local";

export const metadata = metadataDeRota({
  path: ROTA,
  title: TITULO,
  description: `Onde acontece o XibéSec 2026: endereço, cidade e como chegar ao local do encontro em ${site.city}, ${site.regionName}.`,
});

export default function LocalPage() {
  if (!rotaPublicada(ROTA)) notFound();

  const settings = getSettings();
  const secao = getSecoes()["local"] ?? SECAO_VAZIA;
  const descricao = `O XibéSec 2026 acontece no ${settings.venueName}, ${settings.venueAddress}, em ${settings.eventDisplayDate}.`;

  const schema = [
    webPageSchema({ path: ROTA, titulo: settings.venueName || TITULO, descricao }),
    generateBreadcrumbs([
      { name: HOME_LABEL, url: canonicalUrl("/") },
      { name: TITULO, url: canonicalUrl(ROTA) },
    ]),
  ];

  return (
    <PaginaInterna schema={schema}>
      <LocalSection settings={settings} secao={secao} titleAs="h1" />
    </PaginaInterna>
  );
}
