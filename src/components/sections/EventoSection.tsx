import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeader, SectionTitle, Eyebrow } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { TimelineList } from "@/components/data/TimelineList";
import { EditionCard } from "@/components/cards/EditionCard";
import { evento } from "@/lib/copy";
import type { Edicao, Settings, Sobre } from "@/lib/cms";

export type EventoSectionProps = {
  sobre: Sobre;
  edicoes: Edicao[];
  settings: Settings;
  showEdicoes: boolean;
};

/**
 * O evento e a origem do nome, com a linha do tempo das edições à esquerda e o
 * baralho de registros à direita. Cada registro gruda um pouco mais abaixo que o
 * anterior: rolando, eles passam um por cima do outro sem a seção sair da tela.
 */
export function EventoSection({ sobre, edicoes, settings, showEdicoes }: EventoSectionProps) {
  const anoAtual = new Date(settings.eventStartDate).getFullYear();

  const entries = [
    ...edicoes.map((edicao) => ({
      year: edicao.ano,
      label: edicao.tema,
      href: `#ed-${edicao.ano}`,
    })),
    {
      year: anoAtual,
      label: evento.edicaoAtual,
      detail: settings.eventDisplayDate.replace(/ de \d{4}$/, ""),
      current: true,
    },
  ];

  return (
    <Section id="evento" variant="panel">
      <Container>
        <Reveal>
          <SectionHeader eyebrow={evento.eyebrow} title={sobre.titulo} lede={sobre.texto} />
        </Reveal>
      </Container>

      <Container
        id="origem"
        className="mt-[clamp(8px,1.6vw,20px)] grid grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] items-start gap-[clamp(36px,5vw,72px)] max-[900px]:grid-cols-1"
      >
        <Reveal className="sticky top-[calc(var(--nav-h)+30px)] max-[900px]:static">
          <SectionTitle as="h3" size="md" className="mb-1.5">
            {sobre.origemTitulo}
          </SectionTitle>

          {sobre.origemTexto.split("\n\n").map((paragraph, index) => (
            <p key={index} className="text-cream-2 mt-[18px] text-[16px] leading-[1.7]">
              {paragraph.split("**").map((chunk, position) =>
                position % 2 === 1 ? (
                  <strong key={position} className="text-cream font-bold">
                    {chunk}
                  </strong>
                ) : (
                  chunk
                ),
              )}
            </p>
          ))}

          {showEdicoes ? (
            <>
              <Eyebrow tone="dim" className="mt-[clamp(32px,3.6vw,44px)] mb-4">
                {evento.edicoesLabel}
              </Eyebrow>
              <TimelineList entries={entries} />
            </>
          ) : null}
        </Reveal>

        {showEdicoes ? (
          <div className="min-w-0">
            <div className="grid gap-[clamp(20px,2.6vw,32px)] max-[900px]:gap-0 max-[900px]:pb-[clamp(40px,12vw,90px)]">
              {edicoes.map((edicao, index) => (
                <EditionCard
                  key={edicao.ano}
                  id={`ed-${edicao.ano}`}
                  year={edicao.ano}
                  title={edicao.tema}
                  caption={evento.registroPendente}
                  index={index}
                  className="sticky top-[calc(var(--nav-h)+38px+var(--i)*16px)] scroll-mt-[calc(var(--nav-h)+38px)] rotate-[calc((var(--i)-1)*1.6deg)] max-[900px]:top-[calc(var(--nav-h)+24px+var(--i)*14px)] max-[900px]:mt-[calc(var(--i)*-8px)]"
                />
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
