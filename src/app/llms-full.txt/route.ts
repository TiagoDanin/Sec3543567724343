import { renderLlmsFull } from "@/lib/docs";
import { textResponse } from "@/lib/text-route";

export const dynamic = "force-static";

export function GET() {
  return textResponse(renderLlmsFull(), "text/plain");
}
