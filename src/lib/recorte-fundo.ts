// Recorte do fundo da foto, no navegador.
//
// A biblioteca baixa ~127 MB de um CDN externo antes do primeiro uso, e é por
// isso que o download começa na abertura da página e não no clique: as sete
// perguntas são o tempo que ele tem para terminar.

export type EstadoRecorte =
  | { fase: "ocioso" }
  | { fase: "baixando"; progresso: number }
  | { fase: "pronto" }
  | { fase: "indisponivel" };

/**
 * A API não existe no Safari nem no Firefox; ausência conta como conexão boa,
 * porque supor o pior desligaria o recurso para metade dos aparelhos.
 */
export function conexaoEconomica(): boolean {
  if (typeof navigator === "undefined") return false;

  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;

  if (!conn) return false;
  return conn.saveData === true || conn.effectiveType === "2g" || conn.effectiveType === "3g";
}

type Ouvinte = (estado: EstadoRecorte) => void;

let estado: EstadoRecorte = { fase: "ocioso" };
const ouvintes = new Set<Ouvinte>();

function publicar(novo: EstadoRecorte) {
  estado = novo;
  for (const ouvinte of ouvintes) ouvinte(estado);
}

export function estadoRecorte(): EstadoRecorte {
  return estado;
}

export function ouvirRecorte(ouvinte: Ouvinte): () => void {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

import type { Recorte, RespostaRecorte } from "./recorte-worker";

type Fim = { ok: boolean; blob?: Blob };
type Espera = { concluir: (fim: Fim) => void; progresso?: (atual: number, total: number) => void };

let worker: Worker | undefined;
let proximoId = 0;
const esperando = new Map<number, Espera>();

function abrirWorker(): Worker | undefined {
  if (worker) return worker;

  try {
    worker = new Worker(new URL("./recorte-worker.ts", import.meta.url), { type: "module" });
  } catch {
    return undefined;
  }

  worker.onmessage = ({ data }: MessageEvent<RespostaRecorte>) => {
    const espera = esperando.get(data.id);
    if (!espera) return;

    if (data.tipo === "progresso") {
      espera.progresso?.(data.atual, data.total);
      return;
    }

    esperando.delete(data.id);
    espera.concluir({
      ok: data.tipo !== "erro",
      blob: data.tipo === "recorte" ? data.blob : undefined,
    });
  };

  worker.onerror = () => {
    for (const espera of esperando.values()) espera.concluir({ ok: false });
    esperando.clear();
  };

  return worker;
}

function pedir(pedido: Recorte, progresso?: Espera["progresso"]): Promise<Fim> {
  const alvo = abrirWorker();
  if (!alvo) return Promise.resolve({ ok: false });

  const id = ++proximoId;
  return new Promise<Fim>((resolve) => {
    esperando.set(id, { concluir: resolve, progresso });
    alvo.postMessage({ ...pedido, id });
  });
}

let carregando: Promise<boolean> | null = null;

/** Idempotente: chamadas simultâneas compartilham o mesmo download. */
export function precarregarRecorte(): Promise<boolean> {
  if (carregando) return carregando;

  publicar({ fase: "baixando", progresso: 0 });

  carregando = pedir({ tipo: "preload" }, (atual, total) => {
    if (total > 0) publicar({ fase: "baixando", progresso: atual / total });
  }).then(({ ok }) => {
    // Falhando, a carta segue funcionando com as máscaras em gradiente.
    publicar(ok ? { fase: "pronto" } : { fase: "indisponivel" });
    return ok;
  });

  return carregando;
}

/** Foto sem fundo, em PNG com alfa. Devolve `null` se o recorte falhar. */
export async function recortarFundo(arquivo: Blob): Promise<Blob | null> {
  const { blob } = await pedir({ tipo: "recortar", blob: arquivo });
  return blob ?? null;
}
