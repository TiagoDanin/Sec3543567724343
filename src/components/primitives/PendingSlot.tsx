import { cn } from "@/lib/utils";

export type PendingSlotProps = {
  /** Proporção da moldura, no formato aceito por `aspect-ratio`. */
  ratio?: string;
  /** Marca d'água central — o ano da edição, por exemplo. */
  mark?: string;
  className?: string;
  label?: string;
};

/**
 * Espaço reservado para material que existe mas ainda não foi entregue: foto de
 * edição anterior, retrato de palestrante. Hachurado e tracejado de propósito,
 * para nunca ser confundido com conteúdo. Não substituir por ilustração ou stock.
 */
export function PendingSlot({
  ratio = "16/10",
  mark,
  className,
  label = "Registro em curadoria",
}: PendingSlotProps) {
  return (
    <div
      role="img"
      aria-label={label}
      style={{ aspectRatio: ratio }}
      className={cn(
        "hatch border-line-2 flex items-center justify-center border border-dashed",
        className,
      )}
    >
      {mark ? (
        <span className="font-display text-cream/20 text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold tracking-[0.02em] tabular-nums">
          {mark}
        </span>
      ) : null}
    </div>
  );
}
