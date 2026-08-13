import { notFound } from "next/navigation";
import { PaginaInterna } from "@/components/layout/PaginaInterna";
import { ImprensaSection } from "@/components/sections/ImprensaSection";

import { metadataDeRota } from "@/lib/docs";
import { rotaPublicada } from "@/lib/rotas";
import { generateBreadcrumbs, imprensaSchema } from "@/lib/schema";
import { canonicalUrl } from "@/lib/site";
import { SECAO_VAZIA, destaqueDaImprensa, getImprensa, getSecoes } from "@/lib/cms";

const ROTA = "/press";
const HOME_LABEL = "Início";
const TITULO = "Na imprensa";
const DESCRICAO =
  "O que veículos de imprensa e referências do setor publicaram sobre o XibéSec desde a primeira edição: matérias, análises e notas institucionais, com link para a fonte.";

export const metadata = metadataDeRota({
  path: ROTA,
  title: TITULO,
  description: DESCRICAO,
});

export default function ImprensaPage() {
  if (!rotaPublicada(ROTA)) notFound();

  const materias = getImprensa();
  const secao = getSecoes()["imprensa"] ?? SECAO_VAZIA;

  const schema = [
    imprensaSchema({ titulo: secao.titulo || TITULO, descricao: DESCRICAO, materias }),
    generateBreadcrumbs([
      { name: HOME_LABEL, url: canonicalUrl("/") },
      { name: TITULO, url: canonicalUrl(ROTA) },
    ]),
  ];

  return (
    <PaginaInterna schema={schema}>
      <ImprensaSection
        materias={materias}
        destaque={destaqueDaImprensa(materias)}
        secao={secao}
        titleAs="h1"
      />
    </PaginaInterna>
  );
}
