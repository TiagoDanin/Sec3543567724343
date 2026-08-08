import { Button } from "@/components/primitives/Button";
import { Container } from "@/components/primitives/Container";
import { Countdown } from "@/components/data/Countdown";
import { countdown } from "@/lib/copy";
import { formatDate, formatPrice, lowestPrice, type Ingresso, type Settings } from "@/lib/cms";

export type CountdownBarProps = {
  settings: Settings;
  ingressos: Ingresso[];
};

/** Barra única: contagem, lote em venda e compra na mesma linha. */
export function CountdownBar({ settings, ingressos }: CountdownBarProps) {
  const cheapest = lowestPrice(ingressos);
  const lote = ingressos[0]?.lote;
  const validThrough = ingressos[0]?.validThrough;

  return (
    <section aria-label={countdown.ariaLabel} className="bg-ink border-line border-b">
      <Container className="flex flex-wrap items-center gap-y-3 gap-x-[clamp(14px,2.2vw,28px)] py-[clamp(14px,1.8vw,20px)]">
        <p className="text-cream-3 font-mono text-[11px] tracking-[0.24em] uppercase">
          {countdown.label}
        </p>

        <Countdown target={settings.eventStartDate} className="mr-auto max-[760px]:w-full" />

        {cheapest !== null ? (
          <p className="border-line text-cream-3 flex flex-wrap items-baseline gap-[0.45em] border-l pl-[clamp(0px,1.6vw,20px)] font-mono text-[12px] tracking-[0.06em] max-[760px]:mr-auto max-[760px]:border-l-0 max-[760px]:pl-0">
            <strong className="text-cream text-[14px]">Lote {lote}</strong> a partir de{" "}
            <strong className="text-cream text-[14px]">{formatPrice(cheapest)}</strong>
            {validThrough ? (
              <span className="text-cream/50 text-[11px] tracking-[0.14em] uppercase">
                vendas até {formatDate(validThrough)}
              </span>
            ) : null}
          </p>
        ) : null}

        <Button size="sm" href="#ingressos" className="max-[520px]:w-full">
          {countdown.cta}
        </Button>
      </Container>
    </section>
  );
}
