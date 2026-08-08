import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { CallCard } from "@/components/cards/CallCard";
import { formatDate, type Chamada, type Secao, type Settings } from "@/lib/cms";

export type ParticipeSectionProps = {
  chamadas: Chamada[];
  secao: Secao;
  settings: Settings;
};

export function ParticipeSection({ chamadas, secao, settings }: ParticipeSectionProps) {
  // O prazo de voluntários é a única data que a chamada mostra hoje.
  const prazo = settings.volunteersDeadline ? formatDate(settings.volunteersDeadline) : "";

  return (
    <Section id="participe">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={secao.eyebrow}
            eyebrowTone={secao.eyebrowTom}
            title={secao.titulo}
            lede={secao.lede}
            slim
          />
        </Reveal>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
          {chamadas.map((chamada, index) => (
            <Reveal key={chamada.chave} step={(index % 3) as 0 | 1 | 2}>
              <CallCard
                eyebrow={chamada.eyebrow}
                eyebrowTone={chamada.eyebrowTom}
                title={chamada.titulo}
                deadline={
                  chamada.prazoPrefixo && prazo ? `${chamada.prazoPrefixo} ${prazo}` : undefined
                }
                ctaLabel={chamada.ctaLabel}
                ctaHref={chamada.ctaUrl}
                ctaVariant={chamada.ctaVariante}
                className="h-full"
              >
                {chamada.texto}
              </CallCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
