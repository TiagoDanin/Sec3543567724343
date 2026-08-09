/**
 * GA4 sem cookie: `analytics_storage: "denied"` faz o gtag enviar cookieless
 * pings, sem client ID e sem session ID. É o que dispensa o aviso de
 * consentimento, e o que custa visitante único e taxa de retorno no relatório.
 * Trocar por `granted` obriga a criar o aviso.
 */

export const MEASUREMENT_ID = "G-0RPCPVFHQS";

export const GTAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;

type GtagArgs =
  | ["js", Date]
  | ["config", string, Record<string, unknown>?]
  | ["consent", "default", Record<string, string>]
  | ["event", string, Record<string, unknown>?];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArgs) => void;
  }
}

/**
 * Inline no `<head>`, antes do gtag.js baixar: a negativa precisa estar na fila
 * quando o script inicializa, senão ele grava o cookie antes de lê-la.
 * `page_path` normaliza a barra final do `trailingSlash`, que abriria duas
 * linhas no relatório para a mesma rota.
 */
export const GTAG_BOOTSTRAP = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
gtag('js',new Date());
gtag('config','${MEASUREMENT_ID}',{anonymize_ip:true,page_path:location.pathname.replace(/(.)\\/$/,'$1')});
`.trim();

/**
 * Evento no padrão objeto-ação: `ingresso_clicado`. Passa pela `window.gtag`, e
 * não por `dataLayer.push`: o gtag.js lê `arguments` de dentro da fila, e um
 * array empurrado à mão chegaria como um parâmetro só.
 */
export function evento(nome: string, dados?: Record<string, unknown>): void {
  window.gtag?.("event", nome, dados);
}
