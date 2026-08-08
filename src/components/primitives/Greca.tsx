"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type GrecaProps = {
  tone?: "orange" | "green";
  className?: string;
  /** Velocidade da esteira em px por px de rolagem. */
  ratio?: number;
};

/**
 * Faixa de grafismo marajoara — a régua estrutural da página. A esteira interna
 * tem 200% de largura e corre para a esquerda conforme a rolagem; `prefers-
 * reduced-motion` congela o deslocamento.
 */
export function Greca({ tone = "orange", className, ratio = 0.35 }: GrecaProps) {
  const beltRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const belt = beltRef.current;
    if (!belt) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = belt.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const travelled = window.innerHeight - rect.top;
      belt.style.setProperty("--gx", `${-travelled * ratio}px`);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [ratio]);

  return (
    <div
      aria-hidden="true"
      className={cn("relative h-[54px] overflow-hidden opacity-85 max-[640px]:h-[38px]", className)}
    >
      <i
        ref={beltRef}
        className="absolute inset-y-0 left-0 w-[200%] bg-left bg-repeat-x will-change-transform"
        style={{
          backgroundImage: `url(/images/grafismo/pattern-${tone}.png)`,
          backgroundSize: "auto 100%",
          transform: "translate3d(var(--gx, 0px), 0, 0)",
        }}
      />
    </div>
  );
}
