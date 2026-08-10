import "server-only";
import { getSettings } from "./cms";
import type { SectionKey } from "./content-types";

/**
 * Catálogo das rotas HTML do site. É a fonte única de `sitemap.xml`, da página
 * `/sitemap`, do documento em Markdown que a espelha e das colunas de navegação
 * do rodapé — lugares que, escritos à mão, divergem no primeiro dia em que uma
 * seção é desligada.
 *
 * Rótulo e ritmo de atualização são navegação e metadado técnico, não copy: o
 * título e o texto de cada página continuam vindo de `contents/`.
 *
 * Nada aqui importa `docs.ts`: é o contrário — o documento do mapa do site lê
 * este catálogo, e a dependência só pode apontar para um lado.
 */

export type Rota = {
  path: string;
  rotulo: string;
  /** Seção que governa a publicação. `null`: a rota existe sempre. */
  secao: SectionKey | null;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
  /**
   * Entra na coluna de páginas do rodapé. As rotas que espelham uma seção da
   * home ficam de fora: elas são para busca e link direto, e quem navega já
   * tem a seção na própria home. Chega-se a elas pelo mapa do site.
   */
  rodape: boolean;
};

const ROTAS: Rota[] = [
  {
    path: "/",
    rotulo: "Início",
    secao: null,
    changeFrequency: "weekly",
    priority: 1,
    rodape: true,
  },
  {
    path: "/evento",
    rotulo: "O evento",
    secao: "sobre",
    changeFrequency: "monthly",
    priority: 0.8,
    rodape: false,
  },
  {
    path: "/ctf",
    rotulo: "CTF",
    secao: "ctf",
    changeFrequency: "monthly",
    priority: 0.7,
    rodape: false,
  },
  {
    path: "/patrocinio",
    rotulo: "Patrocínio",
    secao: "patrocinio",
    changeFrequency: "monthly",
    priority: 0.7,
    rodape: false,
  },
  {
    path: "/local",
    rotulo: "Local",
    secao: "local",
    changeFrequency: "monthly",
    priority: 0.6,
    rodape: false,
  },
  {
    path: "/quiz",
    rotulo: "Quiz",
    secao: null,
    changeFrequency: "monthly",
    priority: 0.5,
    rodape: true,
  },
  {
    path: "/sitemap",
    rotulo: "Mapa do site",
    secao: null,
    changeFrequency: "monthly",
    priority: 0.3,
    rodape: true,
  },
  {
    path: "/privacidade",
    rotulo: "Privacidade",
    secao: null,
    changeFrequency: "yearly",
    priority: 0.2,
    rodape: true,
  },
];

/** A rota está no ar? Seção desligada não publica a página que a espelha. */
export function rotaPublicada(path: string): boolean {
  const rota = ROTAS.find((item) => item.path === path);
  if (!rota) return false;
  return rota.secao === null || getSettings().sections[rota.secao] === true;
}

export function rotasPublicadas(): Rota[] {
  return ROTAS.filter((rota) => rotaPublicada(rota.path));
}

export function rotasDoRodape(): Rota[] {
  return rotasPublicadas().filter((rota) => rota.rodape);
}
