"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";
import { CLARITY_TAG } from "@/lib/analytics";
import { medicaoDesligada } from "@/lib/analytics-client";

/**
 * Quem já recusou não recebe o script: diferente do gtag, o Clarity não tem
 * bandeira que interrompa a coleta depois de carregado, e a gravação da sessão
 * começa no primeiro quadro.
 */
export function ClarityTag() {
  useEffect(() => {
    if (medicaoDesligada()) return;

    Clarity.init(CLARITY_TAG);
    Clarity.consentV2({ ad_Storage: "denied", analytics_Storage: "granted" });
  }, []);

  return null;
}
