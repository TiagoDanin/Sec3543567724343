// O recorte roda aqui, e não na página, porque a inferência do ONNX segura a
// main thread por vários segundos — tempo em que a carta não responde ao
// arrasto. A biblioteca tem um modo de worker próprio, mas ele só liga junto
// com WebGPU, que não existe fora de contexto seguro.

import { preload, removeBackground } from "@imgly/background-removal";

/** A sessão do ONNX é memoizada por `JSON.stringify`: as duas chamadas usam esta. */
const CONFIG = {
  model: "isnet_fp16" as const,
  output: { format: "image/png" as const },
};

export type Recorte = { tipo: "preload" } | { tipo: "recortar"; blob: Blob };

export type PedidoRecorte = Recorte & { id: number };

export type RespostaRecorte =
  | { id: number; tipo: "progresso"; atual: number; total: number }
  | { id: number; tipo: "pronto" }
  | { id: number; tipo: "recorte"; blob: Blob }
  | { id: number; tipo: "erro" };

// `self` tipado à mão: puxar a lib `webworker` colide com a `dom` do resto.
const escopo = self as unknown as {
  onmessage: ((event: MessageEvent<PedidoRecorte>) => void) | null;
  postMessage: (mensagem: RespostaRecorte) => void;
};

escopo.onmessage = async ({ data }) => {
  const { id } = data;

  try {
    if (data.tipo === "preload") {
      await preload({
        ...CONFIG,
        progress: (_chave, atual, total) =>
          escopo.postMessage({ id, tipo: "progresso", atual, total }),
      });
      escopo.postMessage({ id, tipo: "pronto" });
      return;
    }

    escopo.postMessage({ id, tipo: "recorte", blob: await removeBackground(data.blob, CONFIG) });
  } catch {
    escopo.postMessage({ id, tipo: "erro" });
  }
};
