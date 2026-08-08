import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type NoteProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Observação de rodapé de seção. Fica na sans: a monoespaçada carrega só hora,
 * valor, contagem e rótulo — texto de leitura nunca vai para mono.
 */
export function Note({ children, className }: NoteProps) {
  return (
    <p
      className={cn(
        "text-cream-3 mt-6 max-w-[70ch] text-sm leading-[1.7]",
        "[&_a]:text-mint [&_a]:border-mint/40 [&_a]:border-b",
        "[&_a:hover]:text-cream [&_a:hover]:border-cream",
        className,
      )}
    >
      {children}
    </p>
  );
}
