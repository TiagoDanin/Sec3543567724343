import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { PartnerChip } from "@/components/cards/PartnerChip";
import { parceiros as copy } from "@/lib/copy";
import type { Parceiro } from "@/lib/cms";

export type ParceirosSectionProps = {
  parceiros: Parceiro[];
};

export function ParceirosSection({ parceiros }: ParceirosSectionProps) {
  return (
    <Section id="parceiros" variant="panel" tight>
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={copy.eyebrow}
            eyebrowTone="mint"
            title={copy.title}
            titleSize="md"
            lede={copy.lede}
            slim
          />
        </Reveal>

        <Reveal>
          <ul className="flex flex-wrap gap-2.5">
            {parceiros.map((parceiro) => (
              <li key={parceiro.slug}>
                {/* Handle deduzido do nome: sem confirmação, o chip fica sem link. */}
                <PartnerChip name={parceiro.nome} href={parceiro.url || undefined} />
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
