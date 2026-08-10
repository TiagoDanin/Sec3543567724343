"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Button } from "@/components/primitives/Button";
import { desligarMedicao, medicaoDesligada } from "@/lib/analytics-client";

const ouvintes = new Set<() => void>();

function assinar(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

export type BotaoOposicaoProps = {
  botaoDesligar: string;
  botaoLigar: string;
  estadoDesligado: string;
};

export function BotaoOposicao({ botaoDesligar, botaoLigar, estadoDesligado }: BotaoOposicaoProps) {
  // Sem JavaScript não há botão, e é por isso que a página também ensina a
  // bloquear pelo navegador.
  const desligada = useSyncExternalStore(assinar, medicaoDesligada, () => false);

  const alternar = useCallback(() => {
    desligarMedicao(!medicaoDesligada());
    ouvintes.forEach((ouvinte) => ouvinte());
  }, []);

  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
      <Button variant={desligada ? "ghost" : "mint"} size="sm" onClick={alternar}>
        {desligada ? botaoLigar : botaoDesligar}
      </Button>

      {desligada ? (
        <p className="text-mint font-mono text-[12px] tracking-[0.08em]" role="status">
          {estadoDesligado}
        </p>
      ) : null}
    </div>
  );
}
