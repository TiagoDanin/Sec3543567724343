import { notFound } from "next/navigation";
import { PaginaInterna } from "@/components/layout/PaginaInterna";
import { PatrocinioSection } from "@/components/sections/PatrocinioSection";

import { metadataDeRota } from "@/lib/docs";
import { rotaPublicada } from "@/lib/rotas";
import { generateBreadcrumbs, webPageSchema } from "@/lib/schema";
import { canonicalUrl } from "@/lib/site";
import { SECAO_VAZIA, getPatrocinadoresPorCota, getSecoes } from "@/lib/cms";

const ROTA = "/patrocinio";
const HOME_LABEL = "Início";
const TITULO = "Patrocínio";
const DESCRICAO =
  "Como patrocinar o XibéSec 2026: cotas, patrocinadores confirmados e o contato da organização para receber o mídia kit da edição.";

export const metadata = metadataDeRota({ path: ROTA, title: TITULO, description: DESCRICAO });

export default function PatrocinioPage() {
  if (!rotaPublicada(ROTA)) notFound();

  const secoes = getSecoes();
  const secao = secoes["patrocinio"] ?? SECAO_VAZIA;

  const schema = [
    webPageSchema({ path: ROTA, titulo: secao.titulo || TITULO, descricao: DESCRICAO }),
    generateBreadcrumbs([
      { name: HOME_LABEL, url: canonicalUrl("/") },
      { name: TITULO, url: canonicalUrl(ROTA) },
    ]),
  ];

  return (
    <PaginaInterna schema={schema}>
      <PatrocinioSection
        grupos={getPatrocinadoresPorCota()}
        secao={secao}
        kit={secoes["patrocinio-kit"] ?? SECAO_VAZIA}
        titleAs="h1"
      />
    </PaginaInterna>
  );
}
