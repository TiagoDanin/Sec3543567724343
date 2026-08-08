import { cn } from "@/lib/utils";

export type BrandProps = {
  href?: string;
  className?: string;
};

/**
 * Marca do cabeçalho composta em tipo, não em imagem: o lockup completo fica
 * ilegível a 38px de altura.
 */
export function Brand({ href = "/", className }: BrandProps) {
  const word = (
    <span className="font-display text-cream text-[19px] leading-none font-bold tracking-[0.01em] whitespace-nowrap uppercase max-[360px]:hidden">
      Xibé<em className="text-orange not-italic">Sec</em>
      <b className="text-orange ml-[3px] align-[0.55em] font-mono text-[10px] font-bold tracking-[0.06em]">
        26
      </b>
    </span>
  );

  return (
    <a
      href={href}
      aria-label="XibéSec 26, início"
      className={cn("flex shrink-0 items-center", className)}
    >
      {word}
    </a>
  );
}
