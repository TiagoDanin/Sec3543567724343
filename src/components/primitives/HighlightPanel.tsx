import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type HighlightPanelProps = {
  /** Selo em bloco cheio, ex.: "Novidade 2026". */
  flag?: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  className?: string;
};

/** Bloco de destaque: borda laranja e lavagem diagonal. */
export function HighlightPanel({ flag, eyebrow, title, children, className }: HighlightPanelProps) {
  return (
    <div
      className={cn(
        "border-orange grid grid-cols-[1fr_1.2fr] items-center gap-[clamp(24px,3.6vw,48px)] border p-[clamp(28px,3.6vw,48px)]",
        "from-orange/12 bg-linear-120 to-transparent to-60%",
        "max-[860px]:grid-cols-1",
        className,
      )}
    >
      <div>
        {flag ? (
          <p className="bg-orange text-ink mb-5 inline-block px-3 py-1.5 font-mono text-[11px] font-bold tracking-[0.16em] uppercase">
            {flag}
          </p>
        ) : null}

        {eyebrow ? (
          <p className="text-cream/50 mb-3.5 font-mono text-[11px] font-medium tracking-[0.24em] uppercase">
            {eyebrow}
          </p>
        ) : null}

        <h2 className="font-display text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[1.16] font-bold tracking-[-0.02em]">
          {title}
        </h2>
      </div>

      <p className="text-cream-2 text-[17px] leading-[1.7]">{children}</p>
    </div>
  );
}
