"use client";

import { Button, type ButtonProps } from "@/components/primitives/Button";
import { evento } from "@/lib/analytics";

export type BotaoMedidoProps = ButtonProps & {
  /** Nome do evento, no padrão objeto-ação: `ingresso_clicado`. */
  medirComo: string;
  /** Onde na página o clique aconteceu: `hero`, `dock`, `tabela`. */
  local: string;
  /** Lote, cota ou chamada: o que separa dois cliques do mesmo tipo. */
  item?: string;
};

/**
 * Só CTA de conversão passa por aqui. Medir todo clique da página produz
 * relatório que ninguém lê e coleta que ninguém justifica.
 */
export function BotaoMedido({ medirComo, local, item, ...props }: BotaoMedidoProps) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement & HTMLButtonElement>) => {
    evento(medirComo, { local, ...(item ? { item } : {}) });
    props.onClick?.(e as never);
  };

  return <Button {...(props as ButtonProps)} onClick={onClick} />;
}
