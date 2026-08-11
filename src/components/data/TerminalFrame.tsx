import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TerminalFrameProps = {
  /** Rótulo da barra de título. */
  name?: string;
  children: ReactNode;
  /** Caixa e tipografia do corpo, que cada uso escolhe. */
  bodyClassName?: string;
  className?: string;
};

/**
 * Casca de terminal: barra de título e a varredura de fósforo atravessando o
 * corpo. A varredura é uma camada com `overflow hidden` do tamanho exato do
 * corpo: posicionada direto nele, o rastro passaria do fim e criaria rolagem.
 */
export function TerminalFrame({
  name = "xibesec@2026: ~",
  children,
  bodyClassName,
  className,
}: TerminalFrameProps) {
  return (
    <div className={cn("bg-shell border-mint/34 relative overflow-hidden border", className)}>
      <div className="border-mint/20 bg-mint/5 flex items-center gap-[7px] border-b px-3.5 py-[11px]">
        <span className="bg-orange size-2" />
        <span className="bg-mint size-2" />
        <span className="bg-cream/30 size-2" />
        <span className="text-cream-3 ml-2 font-mono text-[11px] tracking-[0.1em]">{name}</span>
      </div>

      <div className={cn("text-cream-2 relative", bodyClassName)}>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-2 overflow-hidden"
        >
          <span className="animate-scan from-mint/0 via-mint/7 to-mint/15 absolute inset-x-0 -top-[90px] h-[90px] bg-linear-to-b shadow-[0_1px_0_rgb(79_227_172/0.9),0_6px_22px_rgb(79_227_172/0.22)]" />
        </span>

        {children}
      </div>
    </div>
  );
}
