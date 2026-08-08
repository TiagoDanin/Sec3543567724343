import { docsAtivos, renderAgents, renderDoc } from "@/lib/docs";
import { textResponse } from "@/lib/text-route";

export const dynamic = "force-static";
export const dynamicParams = false;

/** `agents.md` não vem de uma seção da página: é o manual do evento para agentes. */
const AGENTS = "agents.md";

/**
 * Um arquivo Markdown por documento publicado. Os nomes saem de `docsAtivos()`,
 * então uma seção desligada em `contents/settings` não gera arquivo — e o
 * `sitemap` e o `llms.txt`, que leem a mesma lista, não apontam para o vazio.
 */
export function generateStaticParams(): Array<{ doc: string }> {
  return [{ doc: AGENTS }, ...docsAtivos().map((doc) => ({ doc: `${doc.slug}.md` }))];
}

export async function GET(_request: Request, ctx: { params: Promise<{ doc: string }> }) {
  const { doc } = await ctx.params;

  if (doc === AGENTS) return textResponse(renderAgents(), "text/markdown");

  const slug = doc.replace(/\.md$/, "");
  const encontrado = docsAtivos().find((item) => item.slug === slug);

  if (!encontrado) return new Response("Not Found", { status: 404 });

  return textResponse(renderDoc(encontrado), "text/markdown");
}
