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

let carregando: Promise<boolean> | null = null;

/**
 * Idempotente: chamadas simultâneas compartilham o mesmo download. `isnet_fp16`
 * é o modelo pequeno — 42 MB contra 84 MB, sem perda visível em foto de rosto.
 */
export function precarregarRecorte(): Promise<boolean> {
  if (carregando) return carregando;

  carregando = (async () => {
    publicar({ fase: "baixando", progresso: 0 });

    try {
      const { preload } = await import("@imgly/background-removal");

      await preload({
        model: "isnet_fp16",
        progress: (_chave, atual, total) => {
          if (total > 0) publicar({ fase: "baixando", progresso: atual / total });
        },
      });

      publicar({ fase: "pronto" });
      return true;
    } catch (erro) {
      // Falhando, a carta segue funcionando com as máscaras em gradiente.
      if (process.env.NODE_ENV !== "production") console.error("[recorte] preload:", erro);
      publicar({ fase: "indisponivel" });
      return false;
    }
  })();

  return carregando;
}

/** Foto sem fundo, em PNG com alfa. Devolve `null` se o recorte falhar. */
export async function recortarFundo(arquivo: Blob): Promise<Blob | null> {
  try {
    const { removeBackground } = await import("@imgly/background-removal");

    return await removeBackground(arquivo, {
      model: "isnet_fp16",
      output: { format: "image/png" },
    });
  } catch {
    return null;
  }
}
