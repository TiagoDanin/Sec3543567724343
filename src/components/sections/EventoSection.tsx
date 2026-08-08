import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeader, SectionTitle } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { EdicoesBloco } from "@/components/data/EdicoesBloco";
import type { Edicao, Secao, Settings, Sobre } from "@/lib/cms";

// Rótulos de interface da seção.
const EDICOES_LABEL = "Edições";
const REGISTRO_PENDENTE = "registro em curadoria";

// Ordinal da edição, derivado de quantas vieram antes. Nada de "Quarta" fixo:
// o número muda sozinho quando uma edição entra ou sai do conteúdo.
const ORDINAIS = [
  "Primeira",
  "Segunda",
  "Terceira",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sétima",
  "Oitava",
  "Nona",
  "Décima",
];

const ordinal = (posicao: number) => ORDINAIS[posicao - 1] ?? `${posicao}ª`;

export type EventoSectionProps = {
  sobre: Sobre;
  edicoes: Edicao[];
  settings: Settings;
  secao: Secao;
  showEdicoes: boolean;
};

/** Origem do nome. `**termo**` marca o destaque sem exigir MDX. */
function Origem({ sobre }: { sobre: Sobre }) {
  return (
    <>
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
    </>
  );
}

/**
 * O evento e a origem do nome, com a linha do tempo das edições à esquerda e o
 * baralho de registros à direita. Cada registro gruda um pouco mais abaixo que o
 * anterior: rolando, eles passam um por cima do outro sem a seção sair da tela.
 */
export function EventoSection({
  sobre,
  edicoes,
  settings,
  secao,
  showEdicoes,
}: EventoSectionProps) {
  const anoAtual = new Date(settings.eventStartDate).getFullYear();

  const atual = {
    year: anoAtual,
    label: `${ordinal(edicoes.length + 1)} edição`,
    detail: settings.eventDisplayDate.replace(/ de \d{4}$/, ""),
    current: true,
  };

  return (
    <Section id="evento" variant="panel">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={secao.eyebrow}
            eyebrowTone={secao.eyebrowTom}
            title={sobre.titulo}
            lede={sobre.texto}
          />
        </Reveal>
      </Container>

      <Container
        id="origem"
        className="mt-[clamp(8px,1.6vw,20px)] grid grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] items-start gap-[clamp(36px,5vw,72px)] max-[900px]:grid-cols-1"
      >
        {showEdicoes ? (
          <EdicoesBloco
            edicoes={edicoes.map(({ ano, tema, foto }) => ({ ano, tema, foto }))}
            atual={atual}
            edicoesLabel={EDICOES_LABEL}
            registroPendente={REGISTRO_PENDENTE}
          >
            <Origem sobre={sobre} />
          </EdicoesBloco>
        ) : (
          <Reveal>
            <Origem sobre={sobre} />
          </Reveal>
        )}
      </Container>
    </Section>
  );
}
