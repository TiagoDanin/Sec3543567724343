import { Button } from "@/components/primitives/Button";
import { Container } from "@/components/primitives/Container";
import { Countdown } from "@/components/data/Countdown";
import { externo } from "@/lib/links";
import { formatDate, formatPrice, lowestPrice, type Ingresso, type Settings } from "@/lib/cms";

// Rótulos de interface: pertencem ao componente, não ao CMS.
const LABEL = "Faltam";
const ARIA = "Contagem regressiva e lote em venda";
// O rótulo promete o checkout, então o botão vai ao Sympla — e não à tabela de
// preços logo abaixo, que o leitor alcança rolando.
const CTA = "Comprar ingresso";

export type CountdownBarProps = {
  settings: Settings;
  ingressos: Ingresso[];
};

/**
 * Barra única: contagem, lote em venda e compra na mesma linha.
 *
 * O botão sai abaixo de 520px. A barra fica logo depois do hero, ou seja a mais
 * de 520px de rolagem — que é exatamente quando o `Dock` já entrou levando à
 * mesma compra. Empilhar um botão de largura cheia por cima de outro fixo não
 * põe a compra mais perto: gasta meia dobra repetindo o que já está na tela.
 */
export function CountdownBar({ settings, ingressos }: CountdownBarProps) {
  const cheapest = lowestPrice(ingressos);
  const lote = ingressos[0];

  return (
    <section aria-label={ARIA} className="bg-ink border-line border-b">
      <Container className="flex flex-wrap items-center gap-x-[clamp(14px,2.2vw,28px)] gap-y-3 py-[clamp(14px,1.8vw,20px)]">
        <p className="text-cream-3 font-mono text-[11px] tracking-[0.24em] uppercase">{LABEL}</p>

        <Countdown target={settings.eventStartDate} className="mr-auto max-[760px]:w-full" />

        {cheapest !== null && lote ? (
          <p className="border-line text-cream-3 flex flex-wrap items-baseline gap-[0.45em] border-l pl-[clamp(0px,1.6vw,20px)] font-mono text-[12px] tracking-[0.06em] max-[760px]:mr-auto max-[760px]:border-l-0 max-[760px]:pl-0">
            <strong className="text-cream text-[14px]">Lote {lote.lote}</strong> a partir de{" "}
            <strong className="text-cream text-[14px]">{formatPrice(cheapest)}</strong>
            <span className="text-cream/50 text-[11px] tracking-[0.14em] uppercase">
              vendas até {formatDate(lote.validThrough)}
            </span>
          </p>
        ) : null}

        <Button size="sm" {...externo(settings.ticketsUrl)} className="max-[520px]:hidden">
          {CTA}
        </Button>
      </Container>
    </section>
  );
}
