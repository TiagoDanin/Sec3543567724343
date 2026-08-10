import type { MetadataRoute } from "next";
import { rotasPublicadas } from "@/lib/rotas";
import { canonicalUrl } from "@/lib/site";

// Exigido pelo `output: "export"`: a rota precisa ser resolvida no build.
export const dynamic = "force-static";

/**
 * Só rota HTML entra aqui — os espelhos em Markdown são anunciados pelo
 * `<link rel="alternate">` de cada página e indexados em `/llms.txt`, que é
 * onde assistentes de IA os procuram. Listá-los também no sitemap só criaria
 * concorrência entre a página e o próprio espelho.
 *
 * Regra: só publicar URL que o build realmente gera.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  return rotasPublicadas().map((rota) => ({
    url: canonicalUrl(rota.path),
    lastModified: agora,
    changeFrequency: rota.changeFrequency,
    priority: rota.priority,
  }));
}
