import { notFound } from "next/navigation";
import { PaginaInterna } from "@/components/layout/PaginaInterna";
import { CtfSection } from "@/components/sections/CtfSection";

import { alvoCompraDeOutraRota } from "@/lib/links";
import { metadataDeRota } from "@/lib/docs";
import { rotaPublicada } from "@/lib/rotas";
import { generateBreadcrumbs, webPageSchema } from "@/lib/schema";
import { canonicalUrl } from "@/lib/site";
import { SECAO_VAZIA, getCtf, getSecoes, getSettings } from "@/lib/cms";

const ROTA = "/ctf";
const HOME_LABEL = "Início";
const TITULO = "CTF";
const DESCRICAO =
  "A competição CTF presencial do XibéSec 2026: ataque e defesa, disputa individual, acesso incluso em qualquer ingresso e premiação para os melhores colocados.";

export const metadata = metadataDeRota({
  path: ROTA,
  title: `${TITULO} · Capture the flag`,
  description: DESCRICAO,
});

export default function CtfPage() {
  if (!rotaPublicada(ROTA)) notFound();

  const ctf = getCtf();
  const secao = getSecoes()["ctf"] ?? SECAO_VAZIA;

  const schema = [
    webPageSchema({ path: ROTA, titulo: ctf.titulo || TITULO, descricao: DESCRICAO }),
    generateBreadcrumbs([
      { name: HOME_LABEL, url: canonicalUrl("/") },
      { name: TITULO, url: canonicalUrl(ROTA) },
    ]),
  ];

  return (
    <PaginaInterna schema={schema}>
      <CtfSection ctf={ctf} secao={secao} cta={alvoCompraDeOutraRota(getSettings())} titleAs="h1" />
    </PaginaInterna>
  );
}
