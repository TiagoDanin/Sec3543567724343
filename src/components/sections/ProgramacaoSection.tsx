import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { Note } from "@/components/primitives/Note";
import { AgendaList, AgendaRow } from "@/components/data/AgendaRow";
import { programacao } from "@/lib/copy";
import { site } from "@/lib/site";
import type { AgendaItem } from "@/lib/cms";

export type ProgramacaoSectionProps = {
  agenda: AgendaItem[];
};

export function ProgramacaoSection({ agenda }: ProgramacaoSectionProps) {
  return (
    <Section id="programacao">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={programacao.eyebrow}
            title={programacao.title}
            lede={programacao.lede}
            alignEnd
          />
        </Reveal>

        {/* O reveal envolve a grade inteira: `AgendaRow` já é o `<li>`, e um
            wrapper por linha aninharia lista dentro de item de lista. */}
        <Reveal>
          <AgendaList>
            {agenda.map((item) => (
              <AgendaRow
                key={item.titulo}
                startsAt={item.startsAt}
                title={item.titulo}
                status={item.status}
                href={item.slug ? `/programacao/${item.slug}` : undefined}
              >
                {item.descricao}
              </AgendaRow>
            ))}
          </AgendaList>
        </Reveal>

        <Note>
          {programacao.noteLead}{" "}
          <a href={site.social.instagram} target="_blank" rel="noopener">
            {programacao.noteLink}
          </a>
          .
        </Note>
      </Container>
    </Section>
  );
}
