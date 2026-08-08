import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Ritmo vertical reduzido. */
  tight?: boolean;
  /** Fundo de painel com filete em cima e embaixo. */
  variant?: "ink" | "panel" | "light";
  "aria-label"?: string;
};

/**
 * Seções alternam o chão de igapó e o painel. A variante `light` inverte o tema
 * localmente para receber logo de patrocinador com fundo branco chapado — é a
 * única inversão do sistema.
 */
export function Section({
  children,
  id,
  className,
  tight = false,
  variant = "ink",
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        tight ? "py-(--sec-y-tight)" : "py-(--sec-y)",
        variant === "panel" && "bg-panel border-line border-y",
        variant === "light" && "on-light text-ink bg-white",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
