import { cn } from "@/lib/utils";

export type TimelineEntry = {
  year: number;
  label: string;
  /** Ausente, a linha não vira área de clique. */
  href?: string;
  /** Informação à direita, ex.: a data da edição corrente. */
  detail?: string;
  /** A edição atual, marcada em laranja. */
  current?: boolean;
  /** A linha espelha qual registro está sendo visto agora. */
  active?: boolean;
  /** Intercepta o salto por âncora quando o destino é `sticky`. */
  onNavigate?: () => void;
};

export type TimelineListProps = {
  entries: TimelineEntry[];
  className?: string;
};

/**
 * Linha do tempo das edições. O ano é dado: mono e menta, como manda o sistema.
 * A linha inteira é a área de clique quando há registro para mostrar.
 */
export function TimelineList({ entries, className }: TimelineListProps) {
  return (
    <ol className={cn("bg-line border-line grid gap-px border", className)}>
      {entries.map((entry) => {
        const row = (
          <>
            <span
              className={cn(
                "w-[3.6em] shrink-0 font-mono text-[15px] leading-none font-medium tabular-nums",
                "ease-brand transition-colors duration-300",
                entry.current
                  ? "text-orange font-bold"
                  : entry.active
                    ? "text-cream"
                    : "text-mint group-hover:text-cream",
              )}
            >
              {entry.year}
            </span>

            <span
              className={cn("text-[17px] font-medium", entry.current && "text-orange font-bold")}
            >
              {entry.label}
            </span>

            {entry.detail ? (
              // Numa coluna estreita o dado desce para a própria linha, alinhado
              // com o rótulo: disputado no mesmo eixo, ele quebra o ano e a
              // etiqueta em duas linhas cada e a régua da lista se perde.
              <span
                className={cn(
                  "ml-auto font-mono text-[12px] tracking-[0.14em] uppercase",
                  "max-[900px]:order-last max-[900px]:ml-[calc(3.6em+1rem)] max-[900px]:w-full",
                  entry.current ? "text-orange font-bold" : "text-cream-3",
                )}
              >
                {entry.detail}
              </span>
            ) : null}
          </>
        );

        // A seta aparece no hover, no foco e na linha do registro em vista.
        const rowClasses = cn(
          "flex items-baseline gap-[22px] px-[26px] py-[22px]",
          "max-[900px]:flex-wrap max-[900px]:gap-x-4 max-[900px]:gap-y-1 max-[900px]:px-4 max-[900px]:py-[15px]",
          "after:ease-brand after:ml-auto after:size-[0.85em] after:shrink-0 after:bg-current",
          "after:opacity-0 after:-translate-x-2 after:transition after:duration-300",
          "after:[content:''] after:[mask:var(--ico-arw)_center/contain_no-repeat]",
          "hover:after:translate-x-0 hover:after:opacity-72",
          "focus-visible:after:translate-x-0 focus-visible:after:opacity-72",
          entry.active && "after:translate-x-0 after:opacity-72",
        );

        return (
          <li
            key={entry.year}
            className={cn(
              "group ease-brand transition-colors duration-300",
              entry.current
                ? "bg-orange/8 hover:bg-orange/15"
                : entry.active
                  ? "bg-panel"
                  : "bg-ink hover:bg-panel",
            )}
          >
            {entry.href ? (
              <a
                href={entry.href}
                onClick={
                  entry.onNavigate
                    ? (event) => {
                        event.preventDefault();
                        entry.onNavigate?.();
                      }
                    : undefined
                }
                className={cn(rowClasses, "focus-visible:outline-offset-[-4px]")}
              >
                {row}
              </a>
            ) : (
              <span className="flex items-baseline gap-[22px] px-[26px] py-[22px] max-[900px]:flex-wrap max-[900px]:gap-x-4 max-[900px]:gap-y-1 max-[900px]:px-4 max-[900px]:py-[15px]">
                {row}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
