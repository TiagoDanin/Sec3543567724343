"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { evento } from "@/lib/analytics-client";

export type LinkMedidoProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  medirComo: string;
  /** Vira parâmetro do evento. Nada aqui pode vir do que a pessoa digitou. */
  dados?: Record<string, unknown>;
  children: ReactNode;
};

/** `<a>` que conta o clique. Para link fora de `Button`, como o logo de patrocinador. */
export function LinkMedido({ medirComo, dados, children, onClick, ...props }: LinkMedidoProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        evento(medirComo, dados);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
