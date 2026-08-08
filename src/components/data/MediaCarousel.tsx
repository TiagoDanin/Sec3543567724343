"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { Materia } from "@/lib/cms";

const ano = new Intl.DateTimeFormat("pt-BR", { year: "numeric", timeZone: "America/Belem" });

/** Píxeis por quadro. A 60fps dá ~24px/s: dá tempo de ler cada manchete. */
const VELOCIDADE = 0.4;

/** Quanto o trilho espera, em ms, depois que a pessoa mexe nele. */
const PAUSA_APOS_TOQUE = 2500;

export type MediaCarouselProps = {
  materias: Materia[];
  className?: string;
};

/**
 * Trilho de clipping que anda sozinho.
 *
 * A trilha é duplicada e o laço fecha no meio do percurso, então o retorno ao
 * início é invisível — mesma mecânica da faixa de grafismo, aplicada a cards.
 * O avanço é feito em `scrollLeft`, não em `transform`: assim as setas, o
 * arraste no touch e a roda do mouse continuam controlando o mesmo eixo.
 *
 * Para quando o ponteiro entra, quando algo dentro recebe foco de teclado, e
 * por alguns segundos depois de qualquer interação manual — ninguém está lendo
 * uma manchete que foge. `prefers-reduced-motion` desliga o movimento e deixa
 * só as setas e o arraste.
 */
export function MediaCarousel({ materias, className }: MediaCarouselProps) {
  const trilhoRef = useRef<HTMLUListElement>(null);
  const raizRef = useRef<HTMLDivElement>(null);
  const pausadoAte = useRef(0);
  const sobre = useRef(false);

  // Duas voltas idênticas: o laço fecha na metade, sem emenda visível.
  const trilha = [...materias, ...materias];

  const adiar = useCallback(() => {
    pausadoAte.current = Date.now() + PAUSA_APOS_TOQUE;
  }, []);

  useEffect(() => {
    const trilho = trilhoRef.current;
    if (!trilho) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const passo = () => {
      const metade = trilho.scrollWidth / 2;

      if (!sobre.current && Date.now() >= pausadoAte.current && metade > 0) {
        // Volta um ciclo inteiro antes de avançar: o salto acontece na posição
        // equivalente da segunda cópia, então o olho não vê corte.
        if (trilho.scrollLeft >= metade) trilho.scrollLeft -= metade;
        trilho.scrollLeft += VELOCIDADE;
      }

      frame = window.requestAnimationFrame(passo);
    };

    frame = window.requestAnimationFrame(passo);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  /** Avança ou volta uma "página" de cards, nunca menos que um card inteiro. */
  const mover = (direcao: 1 | -1) => {
    const trilho = trilhoRef.current;
    if (!trilho) return;
    adiar();

    const card = trilho.querySelector<HTMLElement>("li");
    const largura = card ? card.getBoundingClientRect().width + 1 : trilho.clientWidth;
    const cabem = Math.max(1, Math.floor(trilho.clientWidth / largura));

    const calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    trilho.scrollBy({ left: direcao * cabem * largura, behavior: calmo ? "auto" : "smooth" });
  };

  const seta =
    "border-line-2 text-cream-3 hover:border-mint hover:text-mint ease-brand flex size-9 items-center justify-center border font-mono text-[14px] transition-colors duration-250";

  return (
    <div
      ref={raizRef}
      onMouseEnter={() => {
        sobre.current = true;
      }}
      onMouseLeave={() => {
        sobre.current = false;
      }}
      onFocusCapture={() => {
        sobre.current = true;
      }}
      onBlurCapture={() => {
        sobre.current = false;
      }}
      className={cn("group/car", className)}
    >
      {/* As setas saem no toque: arrastar é o gesto nativo do trilho, e um alvo
          de 36px fica abaixo do mínimo confortável para o polegar. */}
      <div className="mt-6 flex items-center justify-end gap-2 max-[640px]:hidden">
        <button
          type="button"
          onClick={() => mover(-1)}
          aria-label="Ver publicações anteriores"
          className={seta}
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => mover(1)}
          aria-label="Ver próximas publicações"
          className={seta}
        >
          ›
        </button>
      </div>

      {/* Sem `scroll-snap`: o encaixe brigaria com o avanço contínuo, puxando o
          trilho de volta a cada quadro. Quem indica que há mais é o card
          cortado na borda. */}
      <ul
        ref={trilhoRef}
        onPointerDown={adiar}
        onWheel={adiar}
        onTouchStart={adiar}
        className={[
          "border-line bg-line mt-3 grid auto-cols-[21rem] grid-flow-col gap-px border-y",
          "[scrollbar-width:none] overflow-x-auto [&::-webkit-scrollbar]:hidden",
          "max-[640px]:auto-cols-[82vw]",
        ].join(" ")}
      >
        {trilha.map((materia, index) => {
          const eco = index >= materias.length;
          return (
            <li
              key={`${materia.slug}-${index}`}
              aria-hidden={eco ? "true" : undefined}
              className="bg-ink"
            >
              <a
                href={materia.url}
                target="_blank"
                rel="noopener"
                tabIndex={eco ? -1 : undefined}
                className="group ease-brand hover:bg-panel flex h-full flex-col gap-3 p-[clamp(18px,2vw,26px)] transition-colors duration-300"
              >
                <span className="text-orange group-hover:text-orange-2 ease-brand font-mono text-[11px] tracking-[0.24em] uppercase transition-colors duration-250">
                  {materia.veiculo}
                </span>

                <span className="text-cream text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.3] font-medium">
                  {materia.titulo}
                </span>

                <span className="text-cream/40 mt-auto font-mono text-[11px] tabular-nums">
                  {materia.data ? ano.format(new Date(materia.data)) : null}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
