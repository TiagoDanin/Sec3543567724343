import { cn } from "@/lib/utils";
import type { Materia } from "@/lib/cms";

const ano = new Intl.DateTimeFormat("pt-BR", { year: "numeric", timeZone: "America/Belem" });

export type MediaTickerProps = {
  materias: Materia[];
  className?: string;
};

/**
 * Esteira de manchetes — a mesma mecânica da faixa de grafismo, carregando
 * clipping em vez de padrão: trilha duplicada, meio ciclo fecha a volta.
 *
 * Corre devagar porque aqui há texto para ler. Para no ponteiro e no foco de
 * teclado, e `prefers-reduced-motion` a converte em faixa de rolagem manual.
 * O separador é o mesmo losango de 5px da faixa de fatos.
 */
export function MediaTicker({ materias, className }: MediaTickerProps) {
  if (materias.length === 0) return null;

  // A trilha precisa de duas voltas idênticas para o laço não ter emenda.
  const trilha = [...materias, ...materias];

  return (
    <div
      className={cn(
        "ticker-host group relative overflow-hidden",
        // Esmaece as pontas para o texto entrar e sair em vez de ser cortado.
        "[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]",
        className,
      )}
    >
      <ul className="animate-ticker flex w-max items-center">
        {trilha.map((materia, index) => (
          <li
            key={`${materia.slug}-${index}`}
            // A segunda volta é cópia visual: leitor de tela lê a lista uma vez.
            aria-hidden={index >= materias.length ? "true" : undefined}
            className="flex shrink-0 items-center"
          >
            <a
              href={materia.url}
              target="_blank"
              rel="noopener"
              tabIndex={index >= materias.length ? -1 : undefined}
              className="ease-brand group/item flex items-baseline gap-3 px-[clamp(20px,3vw,36px)] py-4 transition-colors duration-250"
            >
              <span className="text-orange group-hover/item:text-orange-2 ease-brand shrink-0 font-mono text-[11px] tracking-[0.24em] whitespace-nowrap uppercase transition-colors duration-250">
                {materia.veiculo}
              </span>

              <span className="text-cream-2 group-hover/item:text-cream ease-brand text-[15px] whitespace-nowrap transition-colors duration-250">
                {materia.titulo}
              </span>

              {materia.data ? (
                <span className="text-cream/40 shrink-0 font-mono text-[11px] tabular-nums">
                  {ano.format(new Date(materia.data))}
                </span>
              ) : null}
            </a>

            <span aria-hidden="true" className="bg-cream/22 size-[5px] shrink-0 rotate-45" />
          </li>
        ))}
      </ul>
    </div>
  );
}
