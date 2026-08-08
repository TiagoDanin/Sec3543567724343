import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { MediaTicker } from "@/components/data/MediaTicker";
import { cn } from "@/lib/utils";
import type { Materia, Secao } from "@/lib/cms";

const ano = new Intl.DateTimeFormat("pt-BR", { year: "numeric", timeZone: "America/Belem" });

export type ImprensaSectionProps = {
  materias: Materia[];
  /** A frase de terceiro que abre a seção. Sem ela, só a esteira. */
  destaque?: Materia;
  secao: Secao;
};

/**
 * Prova social de imprensa, na porta da seção de patrocínio: quem decide verba
 * lê isto antes de abrir o mídia kit.
 *
 * A composição é uma citação verificável em escala de manchete, com a fonte
 * clicável logo abaixo, e a esteira do clipping correndo sob ela. O porte se
 * demonstra com o que os outros publicaram, não com adjetivo nosso.
 */
export function ImprensaSection({ materias, destaque, secao }: ImprensaSectionProps) {
  if (materias.length === 0) return null;

  const naEsteira = destaque ? materias.filter((m) => m.slug !== destaque.slug) : materias;

  return (
    <Section id="imprensa" tight>
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={secao.eyebrow}
            eyebrowTone={secao.eyebrowTom}
            title={secao.titulo}
            titleSize="md"
            lede={secao.lede}
            slim
          />
        </Reveal>

        {destaque ? (
          <Reveal>
            <figure className="border-line m-0 border-y py-[clamp(28px,4vw,48px)]">
              <blockquote>
                <p
                  className={cn(
                    "font-display text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.14] font-bold tracking-[-0.02em]",
                    "text-cream max-w-[22ch]",
                  )}
                >
                  {/* Aspas tipográficas fora do fluxo: a linha do texto continua
                      alinhada à margem, e a abertura sangra para a esquerda. */}
                  <span aria-hidden="true" className="text-orange -ml-[0.55em] pr-[0.1em]">
                    “
                  </span>
                  {destaque.trecho}
                  <span aria-hidden="true" className="text-orange">
                    ”
                  </span>
                </p>
              </blockquote>

              <figcaption className="mt-6">
                <a
                  href={destaque.url}
                  target="_blank"
                  rel="noopener"
                  className="group ease-brand inline-flex flex-wrap items-baseline gap-x-3 gap-y-1 transition-colors duration-250"
                >
                  <span className="text-mint group-hover:text-cream ease-brand font-mono text-[12px] tracking-[0.2em] uppercase transition-colors duration-250">
                    {destaque.veiculo}
                  </span>
                  <span className="text-cream-3 group-hover:text-cream-2 ease-brand border-b border-transparent text-[14px] transition-colors duration-250 group-hover:border-current">
                    {destaque.titulo}
                    {destaque.data ? `, ${ano.format(new Date(destaque.data))}` : null}
                  </span>
                </a>
              </figcaption>
            </figure>
          </Reveal>
        ) : null}

        {naEsteira.length > 0 ? (
          <MediaTicker materias={naEsteira} className="border-line -mx-(--gutter) border-b" />
        ) : null}
      </Container>
    </Section>
  );
}
