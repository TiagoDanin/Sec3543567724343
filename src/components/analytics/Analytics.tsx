import Script from "next/script";
import { GTAG_BOOTSTRAP, GTAG_SRC } from "@/lib/analytics";

/**
 * Vai dentro do `<head>`, e a posição é o que faz a configuração valer: o
 * `next/script` emite um preload do gtag.js no topo do `<head>`, e um bootstrap
 * no corpo pode chegar depois de o script inicializar. `<script>` nativo porque
 * `beforeInteractive` não vale fora do `_document`.
 */
export function ConsentBootstrap() {
  return <script dangerouslySetInnerHTML={{ __html: GTAG_BOOTSTRAP }} />;
}

/**
 * Não usa `@next/third-parties`: o `<GoogleAnalytics>` de lá carrega o gtag.js
 * sem ponto de entrada para o `consent default`, que é o que dispensa o aviso
 * de cookies.
 */
export function Analytics() {
  return <Script id="gtag-js" strategy="afterInteractive" src={GTAG_SRC} />;
}
