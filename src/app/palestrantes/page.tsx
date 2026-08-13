import { notFound } from "next/navigation";
import { PaginaInterna } from "@/components/layout/PaginaInterna";
import { PalestrantesSection } from "@/components/sections/PalestrantesSection";

import { metadataDeRota } from "@/lib/docs";
import { rotaPublicada } from "@/lib/rotas";
import { generateBreadcrumbs, palestrantesSchema } from "@/lib/schema";
import { PALESTRANTES_PATH, canonicalUrl } from "@/lib/site";
import { SECAO_VAZIA, getPalestrantes, getSecoes } from "@/lib/cms";

const HOME_LABEL = "Início";
const TITULO = "Palestrantes";
const DESCRICAO =
  "Quem apresenta no XibéSec 2026: os palestrantes confirmados da 4ª edição, com a palestra de cada um. Encontro de cibersegurança em Belém do Pará, 19 de setembro de 2026.";

export const metadata = metadataDeRota({
  path: PALESTRANTES_PATH,
  title: TITULO,
  description: DESCRICAO,
});

export default function PalestrantesPage() {
  if (!rotaPublicada(PALESTRANTES_PATH)) notFound();

  const palestrantes = getPalestrantes();
  const secao = getSecoes()["palestrantes"] ?? SECAO_VAZIA;

  const schema = [
    palestrantesSchema({
      titulo: secao.titulo || TITULO,
      descricao: DESCRICAO,
      palestrantes,
    }),
    generateBreadcrumbs([
      { name: HOME_LABEL, url: canonicalUrl("/") },
      { name: TITULO, url: canonicalUrl(PALESTRANTES_PATH) },
    ]),
  ];

  return (
    <PaginaInterna schema={schema}>
      <PalestrantesSection palestrantes={palestrantes} secao={secao} titleAs="h1" />
    </PaginaInterna>
  );
}
