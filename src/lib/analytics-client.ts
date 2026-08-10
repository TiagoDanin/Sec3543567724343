"use client";

import Clarity from "@microsoft/clarity";
import { sendGAEvent } from "@next/third-parties/google";
import { CHAVE_DESLIGA_GA, CHAVE_OPTOUT } from "./analytics";

// Separado de `analytics.ts` porque `sendGAEvent` vem de um módulo `'use
// client'` e `EVENTOS` é lido por server component.

/** Nada do que a pessoa digitou entra aqui: contagem, não conteúdo. */
export function evento(nome: string, dados?: Record<string, unknown>): void {
  sendGAEvent("event", nome, dados ?? {});
}

export function medicaoDesligada(): boolean {
  try {
    return localStorage.getItem(CHAVE_OPTOUT) === "1";
  } catch {
    return false;
  }
}

export function desligarMedicao(desligar: boolean): void {
  try {
    if (desligar) localStorage.setItem(CHAVE_OPTOUT, "1");
    else localStorage.removeItem(CHAVE_OPTOUT);
  } catch {
    // sem storage, a escolha vale só enquanto a aba estiver aberta
  }

  (window as unknown as Record<string, boolean>)[CHAVE_DESLIGA_GA] = desligar;

  // O Clarity não tem bandeira equivalente: retirar o consentimento interrompe
  // daqui em diante, e o que ele já gravou nesta sessão não volta.
  if (desligar) {
    try {
      Clarity.consent(false);
    } catch {
      // script nunca chegou a carregar
    }
  }
}
