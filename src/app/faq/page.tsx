import { notFound } from "next/navigation";
import { PaginaInterna } from "@/components/layout/PaginaInterna";
import { FaqSection } from "@/components/sections/FaqSection";

import { metadataDeRota } from "@/lib/docs";
import { rotaPublicada } from "@/lib/rotas";
import { generateBreadcrumbs, generateFaqSchema, webPageSchema } from "@/lib/schema";
import { canonicalUrl } from "@/lib/site";
import { SECAO_VAZIA, getFaq, getSecoes } from "@/lib/cms";

const ROTA = "/faq";
const HOME_LABEL = "Início";
const TITULO = "Dúvidas frequentes";
const DESCRICAO =
  "Respostas sobre o XibéSec 2026: data, local, preço do lote vigente, o que o ingresso inclui, como funciona o CTF, certificado, cancelamento e o que ainda está em definição.";

export const metadata = metadataDeRota({
  path: ROTA,
  title: TITULO,
  description: DESCRICAO,
});

export default function FaqPage() {
  if (!rotaPublicada(ROTA)) notFound();

  const duvidas = getFaq();
  const secao = getSecoes()["faq"] ?? SECAO_VAZIA;

  const schema = [
    webPageSchema({ path: ROTA, titulo: secao.titulo || TITULO, descricao: DESCRICAO }),
    // O `FAQPage` fica na rota dedicada e na home: as duas publicam as mesmas
    // respostas, e um `WebPage` sem a entidade que ele descreve não diz nada.
    ...(duvidas.length > 0 ? [generateFaqSchema(duvidas)] : []),
    generateBreadcrumbs([
      { name: HOME_LABEL, url: canonicalUrl("/") },
      { name: TITULO, url: canonicalUrl(ROTA) },
    ]),
  ];

  return (
    <PaginaInterna schema={schema}>
      <FaqSection duvidas={duvidas} secao={secao} titleAs="h1" />
    </PaginaInterna>
  );
}
