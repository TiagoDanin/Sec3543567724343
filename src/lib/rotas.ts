import "server-only";
import { getPalestrante, getPalestrantes, getSettings } from "./cms";
import type { NavItem, Palestrante, SectionKey } from "./content-types";
import { PALESTRANTES_PATH, palestrantePath } from "./site";

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
   * Entra na coluna de páginas do rodapé. Fica de fora o que já tem caminho:
   * as rotas que espelham uma seção da home, e o que está no menu do topo.
   * Chega-se a elas por lá e pelo mapa do site.
   */
  rodape: boolean;
  /**
   * Condição própria, somada à feature flag. Existe para a rota que não espelha
   * uma seção da home e cuja publicação depende de haver o que publicar.
   */
  publicaSe?: () => boolean;
  /**
   * Descrição da rota no mapa do site. Sem ela, a frase vem do catálogo de
   * documentos, que é onde mora o resumo de toda rota com espelho em Markdown.
   */
  resumo?: string;
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
    path: "/faq",
    rotulo: "Dúvidas frequentes",
    secao: "faq",
    changeFrequency: "monthly",
    priority: 0.6,
    rodape: false,
  },
  // A página existe enquanto houver nome anunciado, e não depende da seção da
  // home: a organização pode publicar os nomes aqui antes de abrir a vitrine na
  // página inicial. Sem palestrante nenhum, some do menu, do sitemap e do mapa.
  {
    path: PALESTRANTES_PATH,
    rotulo: "Palestrantes",
    secao: null,
    publicaSe: () => getPalestrantes().length > 0,
    changeFrequency: "weekly",
    priority: 0.8,
    rodape: false,
  },
  {
    path: "/press",
    rotulo: "Na imprensa",
    secao: "imprensa",
    changeFrequency: "monthly",
    priority: 0.5,
    rodape: false,
  },
  {
    path: "/quiz",
    rotulo: "Quiz",
    secao: null,
    changeFrequency: "monthly",
    priority: 0.5,
    rodape: false,
  },
  {
    path: "/terminal",
    rotulo: "Terminal",
    secao: null,
    changeFrequency: "monthly",
    priority: 0.4,
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

function rotaDePalestrante(palestrante: Palestrante): Rota {
  return {
    path: palestrantePath(palestrante.slug),
    rotulo: palestrante.nome,
    secao: null,
    changeFrequency: "monthly",
    priority: 0.6,
    rodape: false,
    resumo: palestrante.palestraTitulo || palestrante.resumo,
  };
}

/**
 * Uma pessoa, uma rota. Não moram no catálogo fixo porque nascem do conteúdo:
 * anunciar um nome novo em `contents/palestrantes/` publica a página, a linha do
 * sitemap e o link no mapa do site, sem tocar em código.
 */
export function rotasDePalestrantes(): Rota[] {
  return rotaPublicada(PALESTRANTES_PATH) ? getPalestrantes().map(rotaDePalestrante) : [];
}

/** Barra final é convenção de endereço, não identidade: `/quiz/` é `/quiz`. */
const semBarraFinal = (path: string) => (path === "/" ? path : path.replace(/\/+$/, ""));

function encontrarRota(path: string): Rota | undefined {
  const alvo = semBarraFinal(path);
  const fixa = ROTAS.find((item) => item.path === alvo);
  if (fixa) return fixa;

  const prefixo = `${PALESTRANTES_PATH}/`;
  if (!alvo.startsWith(prefixo)) return undefined;

  const palestrante = getPalestrante(alvo.slice(prefixo.length));
  return palestrante ? rotaDePalestrante(palestrante) : undefined;
}

/** A rota está no ar? Seção desligada não publica a página que a espelha. */
export function rotaPublicada(path: string): boolean {
  const rota = encontrarRota(path);
  if (!rota) return false;
  if (rota.secao !== null && getSettings().sections[rota.secao] !== true) return false;
  return rota.publicaSe === undefined || rota.publicaSe();
}

/** Cada pessoa entra logo depois do índice, na ordem de leitura do mapa. */
export function rotasPublicadas(): Rota[] {
  return ROTAS.filter((rota) => rotaPublicada(rota.path)).flatMap((rota) =>
    rota.path === PALESTRANTES_PATH ? [rota, ...rotasDePalestrantes()] : [rota],
  );
}

export function rotasDoRodape(): Rota[] {
  return rotasPublicadas().filter((rota) => rota.rodape);
}

/**
 * Itens do menu que levam a algum lugar. Âncora depende da seção que a publica;
 * link de rota, da rota estar no ar. Sem esse segundo teste, um item apontaria
 * para um endereço que o build não gera.
 */
export function itensDoMenu(itens: NavItem[]): NavItem[] {
  const { sections } = getSettings();

  return itens.filter((item) => {
    if (item.noMenu) return false;
    if (item.secao && sections[item.secao as SectionKey] !== true) return false;
    return !item.href.startsWith("/") || item.href === "/" || rotaPublicada(item.href);
  });
}
