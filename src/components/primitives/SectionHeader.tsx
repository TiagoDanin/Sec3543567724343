import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type EyebrowProps = {
  children: ReactNode;
  tone?: "orange" | "mint" | "dim";
  className?: string;
};

/** Rótulo mono que abre a seção. Laranja é hierarquia; menta é dado. */
export function Eyebrow({ children, tone = "orange", className }: EyebrowProps) {
  const toneClass = {
    orange: "text-orange",
    mint: "text-mint",
    dim: "text-cream-3",
  }[tone];

  return (
    <p
      className={cn(
        "font-mono text-[11px] font-medium tracking-[0.24em] uppercase",
        toneClass,
        className,
      )}
    >
      {children}
    </p>
  );
}

export type SectionTitleProps = {
  children: ReactNode;
  size?: "md" | "lg";
  className?: string;
  as?: "h1" | "h2" | "h3";
};

export function SectionTitle({
  children,
  size = "lg",
  className,
  as: Tag = "h2",
}: SectionTitleProps) {
  return (
    <Tag
      className={cn(
        "font-display leading-[1.12] font-bold tracking-[-0.02em]",
        size === "lg" ? "text-[clamp(1.75rem,3.2vw,2.5rem)]" : "text-[clamp(1.6rem,2.7vw,2.25rem)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export type SectionHeaderProps = {
  eyebrow?: ReactNode;
  eyebrowTone?: EyebrowProps["tone"];
  title: ReactNode;
  titleSize?: SectionTitleProps["size"];
  lede?: ReactNode;
  /** Alinha título e apoio pela base. Colapsa em coluna abaixo de 1000px. */
  alignEnd?: boolean;
  slim?: boolean;
  className?: string;
};

/**
 * Rótulo mono, depois grade de duas colunas com o título à esquerda e o apoio
 * à direita. Colapsa em coluna única abaixo de 860px.
 */
export function SectionHeader({
  eyebrow,
  eyebrowTone,
  title,
  titleSize,
  lede,
  alignEnd = false,
  slim = false,
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(slim ? "mb-[clamp(30px,3.5vw,48px)]" : "mb-[clamp(40px,5vw,64px)]", className)}
    >
      {eyebrow ? (
        <Eyebrow tone={eyebrowTone} className="mb-[22px] max-[860px]:mb-4">
          {eyebrow}
        </Eyebrow>
      ) : null}

      <div
        className={cn(
          "grid grid-cols-2 items-start gap-[clamp(24px,3.6vw,48px)]",
          alignEnd && "items-end max-[1000px]:items-start",
          "max-[860px]:grid-cols-1 max-[860px]:gap-[18px]",
        )}
      >
        <SectionTitle size={titleSize}>{title}</SectionTitle>
        {lede ? <p className="text-cream-2 text-[17px] leading-[1.65]">{lede}</p> : null}
      </div>
    </header>
  );
}
