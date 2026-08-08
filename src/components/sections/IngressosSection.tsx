import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { TicketCard } from "@/components/cards/TicketCard";
import { IncludedList } from "@/components/data/IncludedList";
import { ingressos as copy } from "@/lib/copy";
import { formatDate, type Ingresso } from "@/lib/cms";

const ICONS = [
  <svg key="booth" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 9h18M3 9l2-4h14l2 4M3 9v11h18V9M8 20v-6h5v6" />
  </svg>,
  <svg key="flag" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 21V3M6 4h12l-3 4 3 4H6" />
  </svg>,
  <svg key="mic" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3ZM5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" />
  </svg>,
  <svg key="cert" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 3h14v13H5zM8 7h8M8 11h5M9 16v5l3-2 3 2v-5" />
  </svg>,
];

export type IngressosSectionProps = {
  ingressos: Ingresso[];
};

export function IngressosSection({ ingressos }: IngressosSectionProps) {
  return (
    <Section id="ingressos" variant="panel">
      <Container>
        <Reveal>
          <SectionHeader eyebrow={copy.eyebrow} title={copy.title} lede={copy.lede} alignEnd />
        </Reveal>

        <div className="mb-[clamp(40px,5vw,64px)] grid grid-cols-3 gap-5 max-[960px]:grid-cols-1 max-[960px]:gap-4">
          {ingressos.map((ticket, index) => (
            <Reveal key={ticket.slug} step={(index % 3) as 0 | 1 | 2}>
              <TicketCard
                name={ticket.nome}
                priceInCents={ticket.preco}
                terms={`em até ${ticket.parcelas}x · vendas até ${formatDate(ticket.validThrough)}`}
                href={ticket.ctaUrl}
                ctaLabel={copy.cta}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>

        <IncludedList
          items={copy.incluso.map((text, index) => ({ icon: ICONS[index], text }))}
        />
      </Container>
    </Section>
  );
}
