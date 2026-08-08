import "server-only";

/**
 * Resposta de arquivo de texto gerado no build. O `Content-Type` só vale no
 * `next dev` — no GitHub Pages quem decide é a extensão do arquivo em `dist/`,
 * e é por isso que cada rota se chama `llms.txt` ou `<slug>.md`.
 */
export function textResponse(body: string, type: "text/plain" | "text/markdown"): Response {
  return new Response(`${body.trimEnd()}\n`, {
    headers: { "content-type": `${type}; charset=utf-8` },
  });
}
