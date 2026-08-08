import { Container } from "@/components/primitives/Container";
import { Reveal } from "@/components/primitives/Reveal";
import type { Materia, Secao } from "@/lib/cms";

const ano = new Intl.DateTimeFormat("pt-BR", { year: "numeric", timeZone: "America/Belem" });

export type ImprensaSectionProps = {
  materias: Materia[];
  /** A frase de terceiro que abre a seção, ao lado do rótulo. */
  destaque?: Materia;
  secao: Secao;
};

/**
 * Prova social de imprensa, na porta da seção de patrocínio: quem decide verba
 * lê isto antes de abrir o mídia kit.
 *
 * A manchete publicada é quem comanda — cada matéria ocupa uma linha larga da
 * grade de 1px, com o veículo em mono laranja ancorando à esquerda. A citação
 * de terceiro recua para uma linha de apoio junto ao rótulo: continua sendo a
 * frase mais forte da seção, sem gastar a altura de um bloco display.
 */
export function ImprensaSection({ materias, destaque, secao }: ImprensaSectionProps) {
  if (materias.length === 0) return null;

  return (
    <section id="imprensa" className="py-[clamp(36px,4.5vw,56px)]">
      <Container>
        <Reveal>
          <div className="border-line flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b pb-5">
            <p className="text-mint font-mono text-[11px] font-medium tracking-[0.24em] uppercase">
              {secao.eyebrow}
            </p>

            {destaque ? (
              <p className="text-cream-2 max-w-[46ch] text-[1.2rem] leading-[1.5]">
                <span className="text-orange">“</span>
                {destaque.trecho}
                <span className="text-orange">”</span>{" "}
                <a
                  href={destaque.url}
                  target="_blank"
                  rel="noopener"
                  className="text-cream-3 hover:text-mint ease-brand font-mono text-[11px] tracking-[0.16em] whitespace-nowrap uppercase transition-colors duration-250"
                >
                  {destaque.veiculo}
                </a>
              </p>
            ) : null}
          </div>
        </Reveal>

        {/* Grade de 1px: o filete vem do fundo, as linhas ficam por cima. */}
        <ul className="bg-line grid gap-px">
          {materias.map((materia) => (
            <li key={materia.slug} className="bg-ink">
              <a
                href={materia.url}
                target="_blank"
                rel="noopener"
                className="group ease-brand hover:bg-panel grid grid-cols-[minmax(9rem,10rem)_1fr_auto] items-baseline gap-6 px-1 py-3 transition-colors duration-300 max-[720px]:grid-cols-1 max-[720px]:gap-1"
              >
                <span className="text-orange group-hover:text-orange-2 ease-brand font-mono text-[11px] tracking-[0.24em] uppercase transition-colors duration-250">
                  {materia.veiculo}
                </span>

                <span className="text-cream text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.35] font-medium">
                  {materia.titulo}
                </span>

                <span className="text-cream/40 font-mono text-[11px] tabular-nums">
                  {materia.data ? ano.format(new Date(materia.data)) : null}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
