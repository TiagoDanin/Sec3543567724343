import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { NoteWithLink } from "@/components/primitives/Note";
import { SpeakerCard } from "@/components/cards/SpeakerCard";
import { asset, palestrantePath } from "@/lib/site";
import { credencial, iniciais, type Palestrante, type Secao } from "@/lib/cms";

/** Espaços reservados enquanto nenhum nome de 2026 foi anunciado. */
const PLACEHOLDERS = 4;

export type PalestrantesSectionProps = {
  palestrantes: Palestrante[];
  secao: Secao;
  /** `h1` na rota dedicada, onde a seção é o assunto da página. */
  titleAs?: "h1" | "h2";
};

/**
 * Sem registros, a seção mostra espaços reservados e declara a pendência, em vez
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
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
            {vazio
              ? Array.from({ length: PLACEHOLDERS }, (_, index) => (
                  <li key={index}>
                    <SpeakerCard />
                  </li>
                ))
              : palestrantes.map((speaker) => (
                  <li key={speaker.slug}>
                    <SpeakerCard
                      name={speaker.nome}
                      role={credencial(speaker)}
                      topic={speaker.palestraTitulo}
                      photo={speaker.foto ? asset(speaker.foto) : undefined}
                      initials={iniciais(speaker.nome)}
                      href={`${palestrantePath(speaker.slug)}/`}
                      nameAs={titleAs === "h1" ? "h2" : "span"}
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
