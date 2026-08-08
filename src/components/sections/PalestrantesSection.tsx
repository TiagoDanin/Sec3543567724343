import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { NoteWithLink } from "@/components/primitives/Note";
import { SpeakerCard } from "@/components/cards/SpeakerCard";
import { asset } from "@/lib/site";
import type { Palestrante, Secao } from "@/lib/cms";

/** Espaços reservados enquanto nenhum nome de 2026 foi anunciado. */
const PLACEHOLDERS = 4;

export type PalestrantesSectionProps = {
  palestrantes: Palestrante[];
  secao: Secao;
};

/**
 * Sem registros, a seção mostra espaços reservados e declara a pendência, em vez
 * de inventar nome ou sumir da página.
 */
export function PalestrantesSection({ palestrantes, secao }: PalestrantesSectionProps) {
  const vazio = palestrantes.length === 0;

  return (
    <Section id="palestrantes">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={secao.eyebrow}
            eyebrowTone={secao.eyebrowTom}
            title={secao.titulo}
            lede={secao.lede}
            alignEnd
          />
        </Reveal>

        <Reveal>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
            {vazio
              ? Array.from({ length: PLACEHOLDERS }, (_, index) => (
                  <li key={index}>
                    <SpeakerCard />
                  </li>
                ))
              : palestrantes.map((speaker) => (
                  <li key={speaker.slug}>
                    {/* O card não linka: a rota de detalhe `/palestrantes/<slug>`
                        ainda não existe em `app/`, e âncora para 404 é pior que
                        card sem link. */}
                    <SpeakerCard
                      name={speaker.nome}
                      topic={speaker.resumo}
                      photo={speaker.foto ? asset(speaker.foto) : undefined}
                    />
                  </li>
                ))}
          </ul>
        </Reveal>

        <NoteWithLink text={secao.nota} label={secao.notaLinkLabel} href={secao.notaLinkUrl} />
      </Container>
    </Section>
  );
}
