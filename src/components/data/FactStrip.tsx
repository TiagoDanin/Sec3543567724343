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
 *
 * Uma linha só no desktop, com losango entre os fatos. Em coluna de celular a
 * faixa vira grade de duas colunas e o losango sai: separador só faz sentido
 * entre vizinhos na mesma linha, e enfileirado ele sobra na ponta de cada
 * quebra — exatamente onde não separa nada.
 */
export function FactStrip({ facts, className, ...props }: FactStripProps) {
  return (
    <div className={cn("bg-panel border-line border-y", className)} {...props}>
      <ul className="max-w-site text-cream-3 mx-auto flex flex-wrap items-baseline gap-x-[clamp(20px,3vw,44px)] gap-y-3 px-(--gutter) py-[18px] font-mono text-[12px] tracking-[0.14em] uppercase max-[760px]:grid max-[760px]:grid-cols-2 max-[760px]:gap-x-4 max-[760px]:gap-y-2.5 max-[760px]:py-4">
        {facts.map((fact) => (
          <li
            key={`${fact.value}-${fact.label}`}
            // Contagem ímpar deixa o último fato sozinho na linha: ele ocupa as
            // duas colunas em vez de abrir um buraco ao lado.
            className="relative flex items-baseline gap-[0.6em] max-[760px]:last:col-span-2 [&:last-child>span]:hidden"
          >
            <b className="text-orange font-mono text-[16px] font-bold tracking-[0.02em]">
              {fact.value}
            </b>
            {fact.label}
            <span
              aria-hidden="true"
              className="bg-cream/22 ml-[clamp(8px,1.4vw,20px)] size-[5px] rotate-45 self-center max-[760px]:hidden"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
