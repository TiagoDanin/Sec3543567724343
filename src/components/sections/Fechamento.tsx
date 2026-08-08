import Image from "next/image";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { Button } from "@/components/primitives/Button";
import { fechamento as copy } from "@/lib/copy";
import { asset } from "@/lib/site";
import type { Settings } from "@/lib/cms";

export type FechamentoProps = {
  settings: Settings;
};

export function Fechamento({ settings }: FechamentoProps) {
  return (
    <section className="bg-ink-deep border-line overflow-hidden border-t">
      <Container className="grid grid-cols-[1.2fr_.8fr] items-end gap-[clamp(24px,4vw,48px)] pt-[clamp(52px,6.5vw,88px)] max-[860px]:grid-cols-1">
        <Reveal className="pb-[clamp(52px,6.5vw,88px)]">
          <Eyebrow tone="mint" className="mb-[22px]">
            {copy.eyebrow}
          </Eyebrow>

          <h2 className="font-display mb-[18px] text-[clamp(1.9rem,3.8vw,3rem)] leading-[1.04] font-bold tracking-[-0.025em] uppercase">
            {copy.title}
          </h2>

          <p className="text-cream-2 mb-[30px] max-w-[46ch] text-[17px] leading-[1.65]">
            {copy.text}
          </p>

          <Button size="lg" href={settings.ticketsUrl} target="_blank" rel="noopener">
            {copy.cta}
          </Button>
        </Reveal>

        <Image
          src={asset("/images/marca/mascote.png")}
          alt=""
          width={1400}
          height={1750}
          loading="lazy"
          className="w-[min(100%,320px)] self-end justify-self-center drop-shadow-[0_20px_40px_rgba(0,0,0,.55)] max-[860px]:order-first max-[860px]:w-[min(56vw,220px)] max-[860px]:justify-self-start"
        />
      </Container>
    </section>
  );
}
