import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { NoteWithLink } from "@/components/primitives/Note";
import { AgendaList, AgendaRow } from "@/components/data/AgendaRow";
import type { AgendaItem, Secao } from "@/lib/cms";

export type ProgramacaoSectionProps = {
  agenda: AgendaItem[];
  secao: Secao;
};

export function ProgramacaoSection({ agenda, secao }: ProgramacaoSectionProps) {
  return (
    <Section id="programacao">
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

        <NoteWithLink text={secao.nota} label={secao.notaLinkLabel} href={secao.notaLinkUrl} />
      </Container>
    </Section>
  );
}
