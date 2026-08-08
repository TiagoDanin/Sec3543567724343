import type { ReactNode } from "react";
import { Button } from "@/components/primitives/Button";
import { Eyebrow } from "@/components/primitives/SectionHeader";
import { cn } from "@/lib/utils";

export type CallCardProps = {
  eyebrow: string;
  eyebrowTone?: "orange" | "mint";
  title: string;
  children: ReactNode;
  /** Prazo da chamada. Sai em menta porque é dado, não copy. */
  deadline?: string;
  ctaLabel: string;
  ctaHref: string;
  ctaVariant?: "primary" | "mint";
  className?: string;
};

/** Cartão de chamada aberta — palestrantes, voluntários, caravanas. */
export function CallCard({
  eyebrow,
  eyebrowTone = "orange",
  title,
  children,
  deadline,
  ctaLabel,
  ctaHref,
  ctaVariant = "primary",
  className,
}: CallCardProps) {
  return (
    <article
      className={cn(
        "border-line bg-panel flex flex-col items-start gap-3.5 border p-[clamp(28px,3.2vw,40px)]",
        "ease-brand transition-colors duration-300 hover:border-orange",
        className,
      )}
    >
      <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>

      <h3 className="font-display text-2xl font-bold leading-[1.18] tracking-[-0.01em]">{title}</h3>

      <p className="text-cream-3 text-[15px] leading-[1.65]">{children}</p>

      {deadline ? <p className="text-mint font-mono text-[12px]">{deadline}</p> : null}

      <Button variant={ctaVariant} href={ctaHref} target="_blank" rel="noopener" className="mt-2">
        {ctaLabel}
      </Button>
    </article>
  );
}
