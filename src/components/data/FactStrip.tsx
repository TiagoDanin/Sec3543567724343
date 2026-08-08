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
      <ul className="max-w-site text-cream-3 mx-auto flex flex-wrap items-baseline gap-x-[clamp(20px,3vw,44px)] gap-y-3 px-(--gutter) py-[18px] font-mono text-[12px] tracking-[0.14em] uppercase">
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
              className="bg-cream/22 ml-[clamp(8px,1.4vw,20px)] size-[5px] rotate-45 self-center"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
