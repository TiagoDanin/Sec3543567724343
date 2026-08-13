import { Container } from "@/components/primitives/Container";
import { Reveal } from "@/components/primitives/Reveal";
import { Eyebrow, SectionHeader } from "@/components/primitives/SectionHeader";
import { MediaCarousel } from "@/components/data/MediaCarousel";
import { cn } from "@/lib/utils";
import type { Materia, Secao } from "@/lib/cms";

export type ImprensaSectionProps = {
  materias: Materia[];
  /** A frase de terceiro que abre a seção, ao lado do rótulo. */
  destaque?: Materia;
  secao: Secao;
  /** `h1` na rota dedicada, onde a seção é o assunto da página. */
  titleAs?: "h1" | "h2";
};

/** A citação de terceiro, assinada pelo veículo — o link leva à publicação. */
function Citacao({ materia, className }: { materia: Materia; className?: string }) {
  return (
    <p className={cn("text-cream-2 max-w-[46ch] text-[1.2rem] leading-[1.5]", className)}>
      <span className="text-orange">“</span>
      {materia.trecho}
      <span className="text-orange">”</span>{" "}
      <a
        href={materia.url}
        target="_blank"
        rel="noopener"
        className="text-cream-3 hover:text-mint ease-brand font-mono text-[11px] tracking-[0.16em] whitespace-nowrap uppercase transition-colors duration-250"
      >
        {materia.veiculo}
      </a>
    </p>
  );
}

/**
 * Prova social de imprensa, na porta da seção de patrocínio: quem decide verba
 * lê isto antes de abrir o mídia kit.
 *
 * O clipping corre num trilho horizontal, um card por publicação, com o veículo
 * em mono laranja no topo.
 *
 * Na home a abertura é uma linha só — rótulo à esquerda, citação de terceiro à
 * direita: a frase mais forte da seção sem gastar a altura de um bloco display.
 * Na rota dedicada, onde a cobertura é o assunto da página, entram o título e o
 * apoio inteiros, e a citação passa a abrir o clipping.
 */
export function ImprensaSection({ materias, destaque, secao, titleAs }: ImprensaSectionProps) {
  if (materias.length === 0) return null;

  return (
    <section id="imprensa" className="py-[clamp(36px,4.5vw,56px)]">
      <Container>
        <Reveal>
          {titleAs ? (
            <>
              <SectionHeader
                eyebrow={secao.eyebrow}
                eyebrowTone={secao.eyebrowTom}
                title={secao.titulo}
                titleAs={titleAs}
                lede={secao.lede}
                slim
              />

              {destaque ? (
                <Citacao materia={destaque} className="border-line border-b pb-5" />
              ) : null}
            </>
          ) : (
            <div className="border-line flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b pb-5">
              <Eyebrow tone={secao.eyebrowTom}>{secao.eyebrow}</Eyebrow>
              {destaque ? <Citacao materia={destaque} /> : null}
            </div>
          )}
        </Reveal>

        <MediaCarousel materias={materias} />
      </Container>
    </section>
  );
}
