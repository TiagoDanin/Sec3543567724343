import type { ReactNode } from "react";
import { Tag } from "@/components/primitives/Tag";
import { cn } from "@/lib/utils";

const hour = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Belem",
});

export type AgendaRowProps = {
  /** ISO com offset. String livre não ordena nem calcula duração. */
  startsAt: string;
  title: string;
  children?: ReactNode;
  /** Ausente, o item fica na grade sem gerar página de detalhe. */
  href?: string;
  status?: "confirmado" | "em-definicao";
  className?: string;
};

/** Linha da grade: hora em menta, conteúdo, etiqueta de estado. */
export function AgendaRow({
  startsAt,
  title,
  children,
  href,
  status = "confirmado",
  className,
}: AgendaRowProps) {
  const time = hour.format(new Date(startsAt));

  const body = (
    <>
      <time
        dateTime={startsAt}
        className="text-mint font-mono text-[19px] tabular-nums"
      >
        {time}
      </time>

      <div>
        <h3 className="font-display mb-2 text-[20px] font-bold leading-[1.2]">{title}</h3>
        {children ? <p className="text-cream-3 text-[15px] leading-[1.6]">{children}</p> : null}
      </div>

      <span className="justify-self-start max-[820px]:empty:hidden">
        {status === "em-definicao" ? <Tag>Em definição</Tag> : null}
      </span>
    </>
  );

  const classes = cn(
    "bg-ink grid grid-cols-[120px_1fr_140px] items-start gap-8 px-1 py-[30px]",
    "ease-brand transition-colors duration-300 hover:bg-panel",
    "max-[820px]:grid-cols-1 max-[820px]:gap-2.5 max-[820px]:py-6",
    className,
  );

  return (
    <li className={href ? undefined : classes}>
      {href ? (
        <a href={href} className={classes}>
          {body}
        </a>
      ) : (
        body
      )}
    </li>
  );
}

export type AgendaListProps = {
  children: ReactNode;
  className?: string;
};

/** Grade de 1px: o filete vem do fundo, as linhas ficam por cima. */
export function AgendaList({ children, className }: AgendaListProps) {
  return (
    <ol className={cn("bg-line border-line grid gap-px border-y", className)}>{children}</ol>
  );
}
