import { cn } from "@/lib/utils";

export type PartnerChipProps = {
  name: string;
  /** Ausente, o chip renderiza sem link — handle ainda não confirmado. */
  href?: string;
  className?: string;
};

/** Organização parceira. Filete de 1px, menta no hover. */
export function PartnerChip({ name, href, className }: PartnerChipProps) {
  const classes = cn(
    "border-line-2 text-cream-2 block border px-4 py-2.5 font-mono text-[13px]",
    href && "ease-brand transition-colors duration-250 hover:text-mint hover:border-mint",
    className,
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener" className={classes}>
      {name}
    </a>
  ) : (
    <span className={classes}>{name}</span>
  );
}
