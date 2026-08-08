import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionTitle, Eyebrow } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { Button } from "@/components/primitives/Button";
import { Terminal } from "@/components/data/Terminal";
import { ctf as copy } from "@/lib/copy";
import type { Ctf } from "@/lib/cms";

export type CtfSectionProps = {
  ctf: Ctf;
};

export function CtfSection({ ctf }: CtfSectionProps) {
  return (
    <Section id="ctf" variant="panel">
      <Container className="grid grid-cols-[1.15fr_.85fr] items-center gap-[clamp(32px,4.5vw,56px)] max-[900px]:grid-cols-1">
        <Reveal>
          <Eyebrow tone="mint" className="mb-[22px]">
            {copy.eyebrow}
          </Eyebrow>

          <SectionTitle size="md">{ctf.titulo}</SectionTitle>

          <p className="text-cream-2 mt-[18px] max-w-[600px] text-[17px] leading-[1.7]">
            {ctf.texto}
          </p>

          <p className="text-mint mt-[18px] font-mono text-[13px]">{copy.incluso}</p>

          <Button variant="mint" href="#ingressos" className="mt-8">
            {copy.cta}
          </Button>
        </Reveal>

        <Reveal>
          <Terminal
            name={copy.terminalName}
            lines={ctf.linhas.map((line) => ({ kind: line.kind, text: line.texto }))}
          />
        </Reveal>
      </Container>
    </Section>
  );
}
