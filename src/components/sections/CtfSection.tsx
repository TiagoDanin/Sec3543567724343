import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionTitle, Eyebrow } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { Button } from "@/components/primitives/Button";
import { Terminal } from "@/components/data/Terminal";
import type { LinkAlvo } from "@/lib/links";
import type { Ctf, Secao } from "@/lib/cms";

// O prompt é elemento de interface do terminal, não conteúdo do evento.
const TERMINAL_NAME = "xibesec@2026: ~/ctf";

export type CtfSectionProps = {
  ctf: Ctf;
  secao: Secao;
  /** Destino do CTA. Ausente, o botão não é renderizado. */
  cta?: LinkAlvo;
  /** `h1` na rota dedicada, onde a seção é o assunto da página. */
  titleAs?: "h1" | "h2";
};

export function CtfSection({ ctf, secao, cta, titleAs }: CtfSectionProps) {
  return (
    <Section id="ctf" variant="panel">
      <Container className="grid grid-cols-[1.15fr_.85fr] items-center gap-[clamp(32px,4.5vw,56px)] max-[900px]:grid-cols-1">
        <Reveal>
          <Eyebrow tone={secao.eyebrowTom} className="mb-[22px]">
            {secao.eyebrow}
          </Eyebrow>

          <SectionTitle size="md" as={titleAs}>
            {ctf.titulo}
          </SectionTitle>

          <p className="text-cream-2 mt-[18px] max-w-[600px] text-[17px] leading-[1.7]">
            {ctf.texto}
          </p>

          {ctf.incluso ? (
            <p className="text-mint mt-[18px] font-mono text-[13px]">{ctf.incluso}</p>
          ) : null}

          {secao.cta && cta ? (
            <Button variant="mint" {...cta} className="mt-8">
              {secao.cta}
            </Button>
          ) : null}
        </Reveal>

        {/* A janela é a contraparte gráfica da coluna de texto, e só existe
            enquanto houver duas colunas. Em coluna única ela deixa de equilibrar
            e passa a repetir: modalidade, formato, acesso e premiação já estão
            no parágrafo acima — e a saída em `pre` ainda abriria rolagem
            horizontal dentro de 350px. */}
        <Reveal className="max-[900px]:hidden">
          <Terminal
            name={TERMINAL_NAME}
            lines={ctf.linhas.map((line) => ({ kind: line.kind, text: line.texto }))}
          />
        </Reveal>
      </Container>
    </Section>
  );
}
