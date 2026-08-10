import type { ReactNode } from "react";
import { Container } from "@/components/primitives/Container";
import { cn } from "@/lib/utils";

export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterColumn = {
  title: string;
  links?: FooterLink[];
  /** Texto solto no topo da coluna, ex.: o nome da realizadora. */
  lead?: string;
};

export type FooterProps = {
  /** Marcas do evento e de quem realiza, separadas por filete. */
  brand?: ReactNode;
  tagline?: string;
  columns: FooterColumn[];
  children?: ReactNode;
  className?: string;
};

export function Footer({ brand, tagline, columns, children, className }: FooterProps) {
  return (
    <footer className={cn("bg-panel border-line border-t", className)}>
      {/* No celular a marca ocupa a linha inteira e as colunas de links ficam
          lado a lado — até no aparelho mais estreito. Enfileiradas, elas custam
          meia tela para listar dez endereços. */}
      <Container className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-[clamp(24px,3vw,40px)] pt-[clamp(44px,5.5vw,64px)] pb-8 max-[1080px]:grid-cols-3 max-[860px]:gap-x-6 max-[560px]:gap-x-4">
        <div className="max-[1080px]:col-span-3">
          {brand ? (
            <div className="mb-5 flex items-center gap-[clamp(16px,2vw,24px)]">{brand}</div>
          ) : null}
          {tagline ? (
            <p className="text-cream/50 max-w-[320px] font-mono text-[12px] leading-[1.7]">
              {tagline}
            </p>
          ) : null}
        </div>

        {columns.map((column) => (
          <nav key={column.title} className="flex flex-col items-start gap-2.5 max-[860px]:gap-0.5">
            <h2 className="text-cream-3 mb-1.5 font-mono text-[11px] font-medium tracking-[0.2em] uppercase">
              {column.title}
            </h2>

            {column.lead ? <p className="text-cream text-[15px]">{column.lead}</p> : null}

            {column.links?.map((link) => (
              <a
                key={link.href}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener" } : {})}
                // O alvo cresce no toque sem afastar as linhas: o que era
                // espaço morto entre elas vira área clicável.
                className="text-cream-2 ease-brand hover:text-orange hover:border-orange focus-visible:text-orange focus-visible:border-orange border-b border-transparent text-[15px] break-words transition-colors duration-250 max-[860px]:py-1.5"
              >
                {link.label}
              </a>
            ))}
          </nav>
        ))}
      </Container>

      {children}
    </footer>
  );
}
