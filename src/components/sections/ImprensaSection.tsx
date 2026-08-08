import { Container } from "@/components/primitives/Container";
import { Reveal } from "@/components/primitives/Reveal";
import { MediaCarousel } from "@/components/data/MediaCarousel";
import type { Materia, Secao } from "@/lib/cms";

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
 * O clipping corre num trilho horizontal com encaixe por `scroll-snap`: cards de
 * largura fixa, um por publicação, com o veículo em mono laranja no topo. A
 * navegação é por âncora — o carrossel funciona sem uma linha de JavaScript, e
 * arrastar no touch faz o mesmo que as setas.
 *
 * A citação de terceiro fica na linha do rótulo: continua sendo a frase mais
 * forte da seção sem gastar a altura de um bloco display.
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

        <MediaCarousel materias={materias} />
      </Container>
    </section>
  );
}
