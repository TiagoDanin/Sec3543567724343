import { cn } from "@/lib/utils";

export type Fact = {
  /** O número. Sai em mono laranja. */
  value: string;
  label: string;
};

export type FactStripProps = {
  facts: Fact[];
  className?: string;
  "aria-label"?: string;
};

/**
 * Faixa de fatos verificáveis. Materializa o princípio "porte se demonstra com
 * fato": cada afirmação de escala vem com um número, uma data ou um nome.
 */
export function FactStrip({ facts, className, ...props }: FactStripProps) {
  return (
    <div className={cn("bg-panel border-line border-y", className)} {...props}>
      <ul className="mx-auto flex max-w-site flex-wrap items-baseline gap-y-3 gap-x-[clamp(20px,3vw,44px)] px-(--gutter) py-[18px] font-mono text-[12px] uppercase tracking-[0.14em] text-cream-3">
        {facts.map((fact) => (
          <li
            key={`${fact.value}-${fact.label}`}
            className="relative flex items-baseline gap-[0.6em] [&:last-child>span]:hidden"
          >
            <b className="text-orange font-mono text-[16px] font-bold tracking-[0.02em]">
              {fact.value}
            </b>
            {fact.label}
            <span
              aria-hidden="true"
              className="ml-[clamp(8px,1.4vw,20px)] size-[5px] self-center rotate-45 bg-cream/22"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
