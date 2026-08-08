import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export type TicketCardProps = {
  /** Rótulo do cartão, ex.: "Lote 2 · Meia-entrada". */
  name: string;
  /** Preço em CENTAVOS. String formatada não soma nem alimenta Offer.price. */
  priceInCents: number;
  /** Condições de pagamento e prazo, já em texto. */
  terms?: string;
  href: string;
  ctaLabel?: string;
  className?: string;
};

/**
 * Os lotes têm o mesmo peso visual; o laranja é do que o ponteiro toca. O foco
 * dentro do cartão dispara o mesmo estado do hover, para quem navega por teclado
 * enxergar o mesmo destaque.
 */
export function TicketCard({
  name,
  priceInCents,
  terms,
  href,
  ctaLabel = "Comprar no Sympla",
  className,
}: TicketCardProps) {
  const price = brl.format(priceInCents / 100);

  return (
    <article
      className={cn(
        "border-line-2 bg-ink flex flex-col gap-2 border p-[clamp(24px,2.6vw,32px)]",
        "ease-brand transition-colors duration-280",
        "hover:border-orange hover:bg-orange/6 focus-within:border-orange focus-within:bg-orange/6",
        "[&:hover_.tier-name]:text-orange [&:focus-within_.tier-name]:text-orange",
        "[&:hover_.tier-price]:text-orange [&:focus-within_.tier-price]:text-orange",
        className,
      )}
    >
      <p className="tier-name text-cream-3 ease-brand font-mono text-[12px] tracking-[0.14em] uppercase transition-colors duration-280">
        {name}
      </p>

      <p className="tier-price ease-brand mt-1.5 font-sans text-[clamp(2rem,3.4vw,2.75rem)] leading-[1.05] font-bold tracking-[-0.02em] tabular-nums transition-colors duration-280">
        {price}
      </p>

      {terms ? (
        <p className="text-cream-3 mb-[22px] font-mono text-[12px]">{terms}</p>
      ) : (
        <div className="mb-[22px]" />
      )}

      <Button
        variant="ghost"
        full
        href={href}
        target="_blank"
        rel="noopener"
        aria-label={`${ctaLabel} — ${name}, ${price}`}
      >
        {ctaLabel}
      </Button>
    </article>
  );
}
