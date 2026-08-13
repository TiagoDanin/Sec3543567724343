import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { NoteWithLink } from "@/components/primitives/Note";
import { SpeakerList, SpeakerRow } from "@/components/cards/SpeakerRow";
import { palestrantePath } from "@/lib/site";
import { credencial, type Palestrante, type Secao } from "@/lib/cms";

/** Linhas reservadas enquanto nenhum nome de 2026 foi anunciado. */
const PLACEHOLDERS = 4;

export type PalestrantesSectionProps = {
  palestrantes: Palestrante[];
  secao: Secao;
  /** `h1` na rota dedicada, onde a seção é o assunto da página. */
  titleAs?: "h1" | "h2";
};

/**
 * Sem registros, a seção mostra linhas reservadas e declara a pendência, em vez
 * de inventar nome ou sumir da página.
 */
export function PalestrantesSection({ palestrantes, secao, titleAs }: PalestrantesSectionProps) {
  const vazio = palestrantes.length === 0;

  return (
    <Section id="palestrantes">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={secao.eyebrow}
            eyebrowTone={secao.eyebrowTom}
            title={secao.titulo}
            titleAs={titleAs}
            lede={secao.lede}
            alignEnd
          />
        </Reveal>

        <Reveal>
          <SpeakerList>
            {vazio
              ? Array.from({ length: PLACEHOLDERS }, (_, index) => <SpeakerRow key={index} />)
              : palestrantes.map((speaker) => (
                  <SpeakerRow
                    key={speaker.slug}
                    name={speaker.nome}
                    role={credencial(speaker)}
                    topic={speaker.palestraTitulo}
                    subjects={speaker.temas}
                    href={`${palestrantePath(speaker.slug)}/`}
                    nameAs={titleAs === "h1" ? "h2" : "h3"}
                  />
                ))}
          </SpeakerList>
        </Reveal>

        <NoteWithLink text={secao.nota} label={secao.notaLinkLabel} href={secao.notaLinkUrl} />
      </Container>
    </Section>
  );
}
