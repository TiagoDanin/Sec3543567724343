import { PaginaInterna } from "@/components/layout/PaginaInterna";
import { MapaDoSite } from "@/components/sections/MapaDoSite";

import { arquivosParaMaquina, markdownDaRota, metadataDeRota, resumoDaRota } from "@/lib/docs";
import { rotasPublicadas } from "@/lib/rotas";
import { generateBreadcrumbs, webPageSchema } from "@/lib/schema";
import { canonicalUrl, site } from "@/lib/site";
import { SECAO_VAZIA, getSecoes } from "@/lib/cms";

const ROTA = "/sitemap";
const HOME_LABEL = "Início";
const TITULO = "Mapa do site";
const DESCRICAO =
  "Todas as páginas publicadas do XibéSec 2026 e os arquivos que o site escreve para leitura por máquina: llms.txt, espelhos em Markdown e sitemap.xml.";

export const metadata = metadataDeRota({ path: ROTA, title: TITULO, description: DESCRICAO });

export default function SitemapPage() {
  const secoes = getSecoes();
  const secao = secoes["sitemap"] ?? SECAO_VAZIA;
  const arquivos = secoes["sitemap-arquivos"] ?? SECAO_VAZIA;

  const paginas = rotasPublicadas().map((rota) => ({
    rotulo: rota.rotulo,
    href: canonicalUrl(rota.path).replace(site.siteUrl, ""),
    resumo: rota.path === "/" ? site.siteDescription : resumoDaRota(rota.path),
    markdown: markdownDaRota(rota.path),
  }));

  const schema = [
    webPageSchema({ path: ROTA, titulo: secao.titulo || TITULO, descricao: DESCRICAO }),
    generateBreadcrumbs([
      { name: HOME_LABEL, url: canonicalUrl("/") },
      { name: TITULO, url: canonicalUrl(ROTA) },
    ]),
  ];

  return (
    <PaginaInterna schema={schema}>
      <MapaDoSite
        eyebrow={secao.eyebrow}
        titulo={secao.titulo}
        lede={secao.lede}
        paginas={paginas}
        arquivosTitulo={arquivos.titulo}
        arquivos={arquivosParaMaquina()}
      />
    </PaginaInterna>
  );
}
