// Foto de celular chega com a orientação em EXIF, e quem a aplica é o navegador
// ao desenhar. O recorte de fundo devolve um PNG já rasterizado, sem o metadado
// — as duas camadas da carta saem em orientações diferentes e a de trás aparece
// deitada. Redesenhar num canvas grava a orientação nos pixels.

/** A carta exportada tem 1080 de largura; acima disto só custa memória. */
const LADO_MAXIMO = 1600;

function carregar(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("a imagem não decodificou"));
    img.src = url;
  });
}

/** Falhando, devolve o arquivo original: carta com foto torta é melhor que sem foto. */
export async function normalizarFoto(arquivo: Blob): Promise<Blob> {
  if (typeof document === "undefined") return arquivo;

  const url = URL.createObjectURL(arquivo);

  try {
    const img = await carregar(url);
    if (!img.naturalWidth || !img.naturalHeight) return arquivo;

    const escala = Math.min(1, LADO_MAXIMO / Math.max(img.naturalWidth, img.naturalHeight));

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * escala);
    canvas.height = Math.round(img.naturalHeight * escala);

    const ctx = canvas.getContext("2d");
    if (!ctx) return arquivo;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // PNG só quando a origem já era PNG: JPEG chapa a transparência de preto.
    const tipo = arquivo.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, tipo, 0.92));

    return blob ?? arquivo;
  } catch {
    return arquivo;
  } finally {
    URL.revokeObjectURL(url);
  }
}
