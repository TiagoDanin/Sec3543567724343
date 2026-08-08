import { renderHome } from "@/lib/docs";
import { textResponse } from "@/lib/text-route";

export const dynamic = "force-static";

/** Espelho da home. É o destino do `<link rel="alternate" type="text/markdown">`. */
export function GET() {
  return textResponse(renderHome(), "text/markdown");
}
