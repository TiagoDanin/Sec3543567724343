// Exportação da carta do quiz para PNG, no navegador.

const LARGURA = 1080;

/** Estável entre renders: `useSyncExternalStore` reassina em laço se mudar. */
export const semAssinatura = () => () => {};

/**
 * Detectado por motor, não por nome: todo navegador no iOS é WebKit por baixo,
 * inclusive o Chrome de iPhone, e é no WebKit que a exportação sai vazia.
 */
export function isWebKitRestrito(): boolean {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent;
  const iOS = /iP(hone|ad|od)/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const safariDesktop = /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox/.test(ua);

  return iOS || safariDesktop;
}

async function paraBlob(node: HTMLElement): Promise<Blob> {
  const { toBlob } = await import("html-to-image");

  const opcoes = {
    pixelRatio: LARGURA / node.offsetWidth,
    // Ligado, concatena `?<timestamp>` na URL de cada imagem — e `blob:` com
    // query string não existe, então a exportação morre assim que há foto.
    cacheBust: false,
  };

  // A primeira passada sai sem as imagens; a segunda as encontra em cache.
  await toBlob(node, opcoes);
  const blob = await toBlob(node, opcoes);

  if (!blob) throw new Error("html-to-image devolveu vazio");
  return blob;
}

async function imagensProntas(node: HTMLElement): Promise<void> {
  const imagens = [...node.querySelectorAll("img")];

  await Promise.all(
    imagens.map(async (img) => {
      if (img.complete && img.naturalWidth > 0) return;
      // Imagem que falha não derruba a carta inteira.
      await img.decode().catch(() => undefined);
    }),
  );
}

export async function gerarCarta(node: HTMLElement): Promise<Blob> {
  // Sem esperar a fonte, a carta é serializada em Arial.
  if (typeof document !== "undefined" && document.fonts) {
    await document.fonts.ready;
  }

  await imagensProntas(node);

  return paraBlob(node);
}

export function baixar(blob: Blob, nomeArquivo: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = nomeArquivo;
  link.click();

  URL.revokeObjectURL(url);
}

/** Consultado com o arquivo em mãos: suporte a texto não implica a arquivo. */
export function podeCompartilhar(file: File): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  );
}

export async function compartilhar(file: File, titulo: string, texto: string): Promise<void> {
  await navigator.share({ files: [file], title: titulo, text: texto });
}
