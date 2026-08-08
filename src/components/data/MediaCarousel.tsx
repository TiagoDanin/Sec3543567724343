"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { Materia } from "@/lib/cms";

const ano = new Intl.DateTimeFormat("pt-BR", { year: "numeric", timeZone: "America/Belem" });

export type MediaCarouselProps = {
  materias: Materia[];
  className?: string;
};

/**
 * Trilho de clipping com encaixe por `scroll-snap`.
 *
 * As setas são botões, não âncoras: `href="#card"` dentro de um container com
 * rolagem própria move a PÁGINA junto com o trilho — e, com `scroll-behavior:
 * smooth` no documento, o resultado é a seção inteira deslizando sozinha. Um
 * `scrollBy` no elemento certo resolve os dois problemas.
 *
 * O estado das pontas é escrito direto no DOM pelo próprio handler de rolagem:
 * é sincronizar com um sistema externo, não estado de React, e evita um
 * `setState` por quadro de scroll.
 */
export function MediaCarousel({ materias, className }: MediaCarouselProps) {
  const trilhoRef = useRef<HTMLUListElement>(null);
  const raizRef = useRef<HTMLDivElement>(null);

  const marcarPontas = useCallback(() => {
    const trilho = trilhoRef.current;
    const raiz = raizRef.current;
    if (!trilho || !raiz) return;

    const folga = 4;
    const fim = trilho.scrollWidth - trilho.clientWidth;
    raiz.dataset.inicio = String(trilho.scrollLeft <= folga);
    raiz.dataset.fim = String(trilho.scrollLeft >= fim - folga);
  }, []);

  useEffect(() => {
    const trilho = trilhoRef.current;
    if (!trilho) return;

    marcarPontas();
    trilho.addEventListener("scroll", marcarPontas, { passive: true });
    window.addEventListener("resize", marcarPontas);
    return () => {
      trilho.removeEventListener("scroll", marcarPontas);
      window.removeEventListener("resize", marcarPontas);
    };
  }, [marcarPontas]);

  /** Avança ou volta uma "página" de cards, nunca menos que um card inteiro. */
  const mover = (direcao: 1 | -1) => {
    const trilho = trilhoRef.current;
    if (!trilho) return;

    const card = trilho.querySelector<HTMLElement>("li");
    const largura = card ? card.getBoundingClientRect().width + 1 : trilho.clientWidth;
    const passo = Math.max(largura, Math.floor(trilho.clientWidth / largura) * largura);

    const calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    trilho.scrollBy({ left: direcao * passo, behavior: calmo ? "auto" : "smooth" });
  };

  const seta =
    "border-line-2 text-cream-3 hover:border-mint hover:text-mint ease-brand flex size-9 items-center justify-center border font-mono text-[14px] transition-colors duration-250 disabled:pointer-events-none disabled:opacity-30";

  return (
    <div ref={raizRef} className={cn("group/car", className)}>
      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => mover(-1)}
          aria-label="Ver publicações anteriores"
          className={cn(seta, "group-data-[inicio=true]/car:opacity-30")}
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => mover(1)}
          aria-label="Ver próximas publicações"
          className={cn(seta, "group-data-[fim=true]/car:opacity-30")}
        >
          ›
        </button>
      </div>

      {/* Grade de coluna automática, filete de 1px vindo do fundo, barra de
          rolagem escondida — quem indica que há mais é o card cortado na borda. */}
      <ul
        ref={trilhoRef}
        className={[
          "border-line bg-line mt-3 grid auto-cols-[21rem] grid-flow-col gap-px border-y",
          // `proximity`, não `mandatory`: o obrigatório reencaixa a cada
          // mudança de layout — fonte que termina de carregar, `Reveal` que
          // anima — e o trilho desliza sozinho sem ninguém tocar nele.
          // O `scroll-smooth` sai pelo mesmo motivo: quem anima é o botão.
          "[scroll-snap-type:x_proximity] overflow-x-auto",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "max-[640px]:auto-cols-[82vw]",
        ].join(" ")}
      >
        {materias.map((materia) => (
          <li key={materia.slug} className="bg-ink [scroll-snap-align:start]">
            <a
              href={materia.url}
              target="_blank"
              rel="noopener"
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
        ))}
      </ul>
    </div>
  );
}
