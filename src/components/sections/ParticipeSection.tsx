import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { CallCard } from "@/components/cards/CallCard";
import { participe as copy } from "@/lib/copy";
import { site } from "@/lib/site";
import { formatDate, type Settings } from "@/lib/cms";

export type ParticipeSectionProps = {
  settings: Settings;
};

export function ParticipeSection({ settings }: ParticipeSectionProps) {
  const prazo = settings.volunteersDeadline ? formatDate(settings.volunteersDeadline) : "";

  return (
    <Section id="participe">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={copy.eyebrow}
            eyebrowTone="mint"
            title={copy.title}
            lede={copy.lede}
            slim
          />
        </Reveal>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
          <Reveal>
            <CallCard
              eyebrow={copy.palestrantes.eyebrow}
              title={copy.palestrantes.title}
              ctaLabel={copy.palestrantes.cta}
              ctaHref={site.social.instagram}
              className="h-full"
            >
              {copy.palestrantes.text}
            </CallCard>
          </Reveal>

          <Reveal step={1}>
            <CallCard
              eyebrow={copy.voluntarios.eyebrow}
              eyebrowTone="mint"
              title={copy.voluntarios.title}
              deadline={prazo ? `${copy.voluntarios.deadlinePrefix} ${prazo}` : undefined}
              ctaLabel={copy.voluntarios.cta}
              ctaHref={site.social.instagram}
              ctaVariant="mint"
              className="h-full"
            >
              {copy.voluntarios.text}
            </CallCard>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
