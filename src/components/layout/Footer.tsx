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
      <Container className="grid grid-cols-[1.4fr_1fr_1fr] gap-[clamp(28px,4vw,48px)] pb-8 pt-[clamp(44px,5.5vw,64px)] max-[860px]:grid-cols-1">
        <div>
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
          <nav key={column.title} className="flex flex-col items-start gap-2.5">
            <h2 className="text-cream-3 mb-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em]">
              {column.title}
            </h2>

            {column.lead ? <p className="text-cream text-[15px]">{column.lead}</p> : null}

            {column.links?.map((link) => (
              <a
                key={link.href}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener" } : {})}
                className="text-cream-2 ease-brand border-b border-transparent text-[15px] transition-colors duration-250 hover:text-orange hover:border-orange focus-visible:text-orange focus-visible:border-orange"
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
