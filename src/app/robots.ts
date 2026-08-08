import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Rastreadores de assistentes de IA. Cada um lê o bloco do próprio user-agent
 * antes do bloco `*`, então a liberação precisa ser explícita: bot bloqueado
 * não cita o evento, e citação é justamente o que se quer aqui.
 */
const AI_CRAWLERS = [
  // OpenAI — ChatGPT
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic — Claude
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google Gemini e AI Overviews
  "Google-Extended",
  // Apple Intelligence
  "Applebot-Extended",
  // Demais assistentes
  "DuckAssistBot",
  "Amazonbot",
  "meta-externalagent",
  "MistralAI-User",
  "cohere-ai",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // `/dev/` é resíduo de build dentro de `dist/`, não conteúdo do site.
      { userAgent: "*", allow: "/", disallow: "/dev/" },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: "/dev/" },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
