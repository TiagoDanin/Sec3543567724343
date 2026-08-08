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
                entry.current ? "text-orange font-bold" : "text-mint group-hover:text-cream",
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
              <span
                className={cn(
                  "ml-auto font-mono text-[12px] tracking-[0.14em] uppercase",
                  entry.current ? "text-orange font-bold" : "text-cream-3",
                )}
              >
                {entry.detail}
              </span>
            ) : null}
          </>
        );

        const rowClasses = "flex items-baseline gap-[22px] px-[26px] py-[22px]";

        return (
          <li
            key={entry.year}
            className={cn(
              "group ease-brand transition-colors duration-300",
              entry.current ? "bg-orange/8 hover:bg-orange/15" : "bg-ink hover:bg-panel",
            )}
          >
            {entry.href ? (
              <a
                href={entry.href}
                className={cn(rowClasses, "focus-visible:outline-offset-[-4px]")}
              >
                {row}
              </a>
            ) : (
              <span className={rowClasses}>{row}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
