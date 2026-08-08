"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { TimelineList, type TimelineEntry } from "./TimelineList";
import { EditionCard } from "@/components/cards/EditionCard";
import { Eyebrow } from "@/components/primitives/SectionHeader";
import { useDesktop } from "@/lib/use-media";

export type EdicaoResumo = { ano: number; tema: string; foto?: string };

export type EdicoesBlocoProps = {
  edicoes: EdicaoResumo[];
  /** A edição corrente, que fecha a linha do tempo sem carta no baralho. */
  atual: TimelineEntry;
  edicoesLabel: string;
  registroPendente: string;
  /** Texto da origem do nome, renderizado no servidor. */
  children: ReactNode;
};

const NAV_FALLBACK = 66;

/**
 * Linha do tempo à esquerda e baralho de registros à direita, sincronizados.
 *
 * Duas sutilezas herdadas do protótipo:
 *
 * 1. As cartas são `sticky`. Tanto o salto por âncora quanto `offsetTop` enxergam
 *    a posição GRUDADA, não a de fluxo — com a carta colada no topo, as duas
 *    leituras dizem que ela já está visível e o clique não faz nada. A saída é
 *    desligar o sticky por um instante, medir, e religar antes da pintura.
 *
 * 2. Marcar a carta pelo ponto de cola erra por um: quando a seguinte sobe por
 *    cima, a anterior continua grudada e ainda passaria no teste. O critério é
 *    uma linha de leitura a 45% da altura da janela — a última carta que a
 *    cruzou é a que o olho está vendo.
 *
 * Em coluna de celular o baralho não é baralho: as cartas deixam de passar uma
 * por cima da outra e viram uma fila. Fica só a mais recente — a linha do tempo
 * ao lado já nomeia todas as edições, e enfileirar molduras que repetem aquela
 * mesma lista custa duas dobras. A carta é montada, não escondida: linha da
 * lista que não tem carta para mostrar também perde o link.
 */
export function EdicoesBloco({
  edicoes,
  atual,
  edicoesLabel,
  registroPendente,
  children,
}: EdicoesBlocoProps) {
  const desktop = useDesktop();
  const deckRef = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(-1);

  const alturaNav = () =>
    parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h"), 10) ||
    NAV_FALLBACK;

  const cartas = useCallback(
    () => Array.from(deckRef.current?.querySelectorAll<HTMLElement>("[data-carta]") ?? []),
    [],
  );

  useEffect(() => {
    let frame = 0;

    const marcar = () => {
      frame = 0;
      const lista = cartas();
      if (lista.length === 0) return;

      const linhaLeitura = window.innerHeight * 0.45;
      const piso = alturaNav();
      let atualIndex = -1;

      lista.forEach((carta, index) => {
        const r = carta.getBoundingClientRect();
        if (r.top <= linhaLeitura && r.bottom > piso) atualIndex = index;
      });

      setAtivo(atualIndex);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(marcar);
    };

    marcar();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [cartas]);

  const irParaCarta = (index: number) => {
    const deck = deckRef.current;
    const lista = cartas();
    const carta = lista[index];
    if (!deck || !carta) return;

    // Mede o fluxo real com o sticky desligado, e religa antes da pintura.
    deck.dataset.semCola = "true";
    const y = carta.getBoundingClientRect().top + window.scrollY;
    delete deck.dataset.semCola;

    const parada = alturaNav() + 38 + index * 16;
    const calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: Math.max(0, y - parada), behavior: calmo ? "auto" : "smooth" });
  };

  const cartasVisiveis = desktop ? edicoes : edicoes.slice(-1);
  const posicao = new Map(cartasVisiveis.map((edicao, index) => [edicao.ano, index]));

  const entries: TimelineEntry[] = [
    ...edicoes.map((edicao) => {
      const index = posicao.get(edicao.ano);
      return {
        year: edicao.ano,
        label: edicao.tema,
        href: index === undefined ? undefined : `#ed-${edicao.ano}`,
        onNavigate: index === undefined ? undefined : () => irParaCarta(index),
        active: index !== undefined && index === ativo,
      };
    }),
    atual,
  ];

  return (
    <>
      <div className="sticky top-[calc(var(--nav-h)+30px)] max-[900px]:static">
        {children}

        <Eyebrow tone="dim" className="mt-[clamp(24px,3.6vw,44px)] mb-4">
          {edicoesLabel}
        </Eyebrow>

        <TimelineList entries={entries} />
      </div>

      <div className="min-w-0">
        <div
          ref={deckRef}
          className="grid gap-[clamp(20px,2.6vw,32px)] max-[900px]:gap-0 [&[data-sem-cola]_[data-carta]]:static"
        >
          {cartasVisiveis.map((edicao, index) => (
            <EditionCard
              key={edicao.ano}
              id={`ed-${edicao.ano}`}
              year={edicao.ano}
              title={edicao.tema}
              caption={registroPendente}
              photo={edicao.foto || undefined}
              // Fora do baralho não há pilha para inclinar: a carta única entra
              // reta, na posição que o `EditionCard` trata como sem desvio.
              index={desktop ? index : 1}
              active={index === ativo}
              data-carta=""
              className="sticky top-[calc(var(--nav-h)+38px+var(--i)*16px)] scroll-mt-[calc(var(--nav-h)+38px)] max-[900px]:static max-[900px]:scroll-mt-[calc(var(--nav-h)+24px)]"
            />
          ))}
        </div>
      </div>
    </>
  );
}
