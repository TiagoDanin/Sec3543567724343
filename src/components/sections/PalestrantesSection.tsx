import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { Note } from "@/components/primitives/Note";
import { SpeakerCard } from "@/components/cards/SpeakerCard";
import { palestrantes as copy } from "@/lib/copy";
import { asset } from "@/lib/site";
import type { Palestrante } from "@/lib/cms";

export type PalestrantesSectionProps = {
  palestrantes: Palestrante[];
};

/**
 * Nenhum nome de 2026 foi anunciado: sem registros, a seção mostra espaços
 * reservados e declara a pendência, em vez de inventar nome ou sumir da página.
 */
export function PalestrantesSection({ palestrantes }: PalestrantesSectionProps) {
  const vazio = palestrantes.length === 0;

  return (
    <Section id="palestrantes">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={copy.eyebrow}
            title={copy.title}
            lede={copy.lede}
            alignEnd
          />
        </Reveal>

        <Reveal>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
            {vazio
              ? Array.from({ length: copy.placeholders }, (_, index) => (
                  <li key={index}>
                    <SpeakerCard />
                  </li>
                ))
              : palestrantes.map((speaker) => (
                  <li key={speaker.slug}>
                    <SpeakerCard
                      name={speaker.nome}
                      topic={speaker.resumo}
                      photo={speaker.foto ? asset(speaker.foto) : undefined}
                      href={`/palestrantes/${speaker.slug}`}
                    />
                  </li>
                ))}
          </ul>
        </Reveal>

        <Note>
          {copy.noteLead} <a href="#participe">{copy.noteLink}</a> {copy.noteTail}
        </Note>
      </Container>
    </Section>
  );
}
