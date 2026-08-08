// Exportação da carta do quiz para PNG, no navegador.
//
// O site é estático: não há servidor para renderizar imagem, e a carta precisa
// sair do mesmo DOM que a pessoa está vendo. `html-to-image` fotografa o nó via
// `<foreignObject>` em SVG — é o que preserva as máscaras em gradiente da carta,
// que `canvas` desenhado à mão não reproduz sem composição manual de camadas.

/** Largura final do PNG. Formato de feed do Instagram. */
const LARGURA = 1080;

/**
 * O WebKit falha ao rasterizar o `<foreignObject>` que `html-to-image` monta:
 * a imagem sai vazia, cortada ou sem as máscaras. Não há contorno confiável, e
 * um arquivo quebrado é pior que um aviso — então a interface manda usar Chrome.
 *
 * Detectado por motor, não por nome: todo navegador no iOS é WebKit por baixo,
 * inclusive o Chrome de iPhone. Checar "Safari" no user agent deixaria passar
 * justamente os casos que falham.
 */
/**
 * Assinatura vazia para `useSyncExternalStore` quando o valor lido não muda
 * depois da hidratação — é o caso do motor do navegador e do parâmetro da URL.
 * Precisa ser a mesma referência entre renders, senão o React reassina em laço.
 */
export const semAssinatura = () => () => {};

export function isWebKitRestrito(): boolean {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent;
  const iOS = /iP(hone|ad|od)/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const safariDesktop = /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox/.test(ua);

  return iOS || safariDesktop;
}

async function paraBlob(node: HTMLElement): Promise<Blob> {
  // Import dinâmico: a biblioteca só é baixada quando alguém exporta de fato,
  // então ela fica fora do bundle inicial da rota.
  const { toBlob } = await import("html-to-image");

  const opcoes = {
    pixelRatio: LARGURA / node.offsetWidth,
    // A carta tem ponta em V; sem fundo próprio, o vazio sai preto em alguns
    // visualizadores em vez de transparente.
    backgroundColor: undefined,
    cacheBust: true,
  };

  // A primeira passada costuma sair sem as imagens: elas ainda estão sendo
  // decodificadas quando o SVG é serializado. Descartar a primeira é o contorno
  // conhecido — a segunda encontra tudo em cache.
  await toBlob(node, opcoes);
  const blob = await toBlob(node, opcoes);

  if (!blob) throw new Error("html-to-image devolveu vazio");
  return blob;
}

export async function gerarCarta(node: HTMLElement): Promise<Blob> {
  // Sem isso a carta sai em Arial: fonte ainda não carregada no momento da
  // serialização é substituída, e o arquivo fica com a tipografia errada.
  if (typeof document !== "undefined" && document.fonts) {
    await document.fonts.ready;
  }

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

/**
 * Compartilhamento nativo, que no celular entrega o arquivo direto ao Instagram
 * ou ao WhatsApp. `canShare` é consultado com o arquivo em mãos porque o suporte
 * a texto não implica suporte a arquivo — em desktop a chamada falharia.
 */
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
