/**
 * A base legal é o legítimo interesse (LGPD, art. 7º, IX), não consentimento —
 * e isso só se sustenta enquanto a medição não virar publicidade. Trocar
 * qualquer `ad_*` por `granted` muda a base legal, não só a configuração.
 */

export const MEASUREMENT_ID = "G-0RPCPVFHQS";

export const CHAVE_OPTOUT = "xibesec:sem-medicao";

/** Convenção do gtag.js: com esta chave em `true` no `window`, ele não coleta. */
export const CHAVE_DESLIGA_GA = `ga-disable-${MEASUREMENT_ID}`;

/** Inline no `<head>`: quando o gtag.js inicializa, a visita já foi contada. */
export const GTAG_BOOTSTRAP = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});
try{if(localStorage.getItem('${CHAVE_OPTOUT}')==='1')window['${CHAVE_DESLIGA_GA}']=true}catch(e){}
`.trim();

/** Nome digitado à mão no componente vira uma linha separada no painel. */
export const EVENTOS = {
  ingressoClicado: "ingresso_clicado",
  patrocinadorClicado: "patrocinador_clicado",
  shellAberto: "shell_aberto",
  shellComando: "shell_comando",
  shellFlagEncontrada: "shell_flag_encontrada",
  shellSudoTentativa: "shell_sudo_tentativa",
  shellSudoSucesso: "shell_sudo_sucesso",
  quizIniciado: "quiz_iniciado",
  quizConcluido: "quiz_concluido",
  quizFotoEnviada: "quiz_foto_enviada",
  quizCartaBaixada: "quiz_carta_baixada",
  quizCompartilhado: "quiz_compartilhado",
} as const;
