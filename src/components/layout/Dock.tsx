"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DockProps = {
  /** Linha principal, ex.: lote e preço de entrada. */
  headline: string;
  /** Linha de apoio, ex.: prazo do lote. */
  detail?: string;
  action: ReactNode;
  /** Rolagem, em px, a partir da qual a barra entra. */
  showAfter?: number;
  className?: string;
};

/**
 * Barra fixa de compra, só abaixo de 860px. Entra depois do hero para não cobrir
 * a primeira dobra.
 */
export function Dock({ headline, detail, action, showAfter = 520, className }: DockProps) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const onScroll = () => setOn(window.scrollY > showAfter);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showAfter]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-90 hidden items-center justify-between gap-3.5 max-[860px]:flex",
        "border-line border-t bg-ink-deep/96 px-(--gutter) py-[11px] backdrop-blur-[14px]",
        "pb-[calc(11px+env(safe-area-inset-bottom))]",
        "ease-brand transition-transform duration-400",
        on ? "translate-y-0" : "translate-y-[110%]",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-px">
        <strong className="text-cream font-mono text-[12px]">{headline}</strong>
        {detail ? (
          <span className="text-cream-3 font-mono text-[10px] uppercase tracking-[0.14em]">
            {detail}
          </span>
        ) : null}
      </div>
      {action}
    </div>
  );
}
