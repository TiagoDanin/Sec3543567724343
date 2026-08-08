// Tipos de domínio e helpers PUROS: nada aqui pode importar de
// `nextjs-studio/server`, senão um `'use client'` que importe um tipo daqui
// arrasta código de servidor para o bundle do navegador.

export type Settings = {
  eventStartDate: string;
  eventEndDate: string;
  eventDisplayDate: string;
  venueName: string;
  venueAddress: string;
  venueMapUrl: string;
  ticketsUrl: string;
  volunteersDeadline: string;
  cfpDeadline: string;
  sections: Record<SectionKey, boolean>;
};

export type SectionKey =
  | "fatos"
  | "sobre"
  | "edicoes"
  | "agenda"
  | "ctf"
  | "palestrantes"
  | "ingressos"
  | "participe"
  | "patrocinio"
  | "parceiros"
  | "local"
  | "faq";

export type Sobre = {
  titulo: string;
  texto: string;
  origemTitulo: string;
  origemTexto: string;
};

export type Fato = { valor: string; label: string };

export type NavItem = { label: string; href: string; grupo: string; noMenu: boolean };

export type Ingresso = {
  nome: string;
  slug: string;
  lote: number;
  /** Centavos. */
  preco: number;
  parcelas: number;
  validThrough: string;
  ctaUrl: string;
  featured: boolean;
  order: number;
};

export type Trilha = "tecnica" | "gerencial" | "geral" | "ctf";

export type AgendaItem = {
  titulo: string;
  slug: string;
  descricao: string;
  startsAt: string;
  endsAt: string;
  trilha: Trilha;
  tipo: string;
  status: "confirmado" | "em-definicao";
  order: number;
};

export type Edicao = {
  ano: number;
  tema: string;
  publico: number | null;
  resumo: string;
  status: "confirmado" | "a-conferir";
};

export type TerminalKind = "cmd" | "ok" | "warn" | "plain";

export type Ctf = {
  titulo: string;
  texto: string;
  linhas: Array<{ kind: TerminalKind; texto: string }>;
};

export type Cota = { nome: string; label: string; disponivel: boolean; order: number };

export type Patrocinador = {
  nome: string;
  slug: string;
  logo: string;
  url: string;
  cota: string;
  order: number;
};

export type Parceiro = { nome: string; slug: string; url: string; order: number };

export type Organizacao = { nome: string; papel: string; url: string; logo: string };

export type Palestrante = {
  nome: string;
  slug: string;
  cargo: string;
  empresa: string;
  foto: string;
  resumo: string;
  order: number;
};

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** Preço em centavos → texto. Formatar é do render, o dado continua número. */
export function formatPrice(cents: number): string {
  return brl.format(cents / 100);
}

/** "2026-08-10T23:59:00-03:00" → "10/08/2026". */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Belem" }).format(date);
}

/** Menor preço da lista, em centavos. Alimenta a barra de lote e o dock. */
export function lowestPrice(ingressos: Ingresso[]): number | null {
  if (ingressos.length === 0) return null;
  return Math.min(...ingressos.map((ticket) => ticket.preco));
}
