import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaginaInterna } from "@/components/layout/PaginaInterna";
import { PalestranteSection } from "@/components/sections/PalestranteSection";

import { metadataDePalestrante, resumoDoPalestrante } from "@/lib/docs";
import { alvoCompraDeOutraRota } from "@/lib/links";
import { generateBreadcrumbs, palestranteSchema } from "@/lib/schema";
import { PALESTRANTES_PATH, canonicalUrl, palestrantePath } from "@/lib/site";
import { SECAO_VAZIA, getPalestrante, getPalestrantes, getSecoes, getSettings } from "@/lib/cms";

const HOME_LABEL = "Início";
const INDICE_LABEL = "Palestrantes";

type Props = { params: Promise<{ slug: string }> };

/** Uma rota por pessoa anunciada. Sem registro, nenhum HTML é escrito. */
export function generateStaticParams(): Array<{ slug: string }> {
  return getPalestrantes().map((palestrante) => ({ slug: palestrante.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const palestrante = getPalestrante(slug);

  return palestrante ? metadataDePalestrante(palestrante) : {};
}

export default async function PalestrantePage({ params }: Props) {
  const { slug } = await params;
  const palestrante = getPalestrante(slug);

  if (!palestrante) notFound();

  const secao = getSecoes()["palestrante"] ?? SECAO_VAZIA;

  const schema = [
    palestranteSchema({ palestrante, descricao: resumoDoPalestrante(palestrante) }),
    generateBreadcrumbs([
      { name: HOME_LABEL, url: canonicalUrl("/") },
      { name: INDICE_LABEL, url: canonicalUrl(PALESTRANTES_PATH) },
      { name: palestrante.nome, url: canonicalUrl(palestrantePath(palestrante.slug)) },
    ]),
  ];

  return (
    <PaginaInterna schema={schema}>
      <PalestranteSection
        palestrante={palestrante}
        secao={secao}
        compra={alvoCompraDeOutraRota(getSettings())}
        indiceHref={`${PALESTRANTES_PATH}/`}
      />
    </PaginaInterna>
  );
}
