import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { PartnerChip } from "@/components/cards/PartnerChip";
import type { Parceiro, Secao } from "@/lib/cms";

export type ParceirosSectionProps = {
  parceiros: Parceiro[];
  secao: Secao;
};

export function ParceirosSection({ parceiros, secao }: ParceirosSectionProps) {
  return (
    <Section id="parceiros" variant="panel" tight>
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={secao.eyebrow}
            eyebrowTone={secao.eyebrowTom}
            title={secao.titulo}
            titleSize="md"
            lede={secao.lede}
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
