import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type LinkButtonProps = {
  label: string;
  description?: string;
  href: string;
  icon?: ReactNode;
  /** O ingresso é a ação: bloco cheio, não filete. */
  highlight?: boolean;
  external?: boolean;
  className?: string;
};

/**
 * Linha da página de links (QR code do evento). Um por linha, alvo generoso no
 * polegar: 64px de altura mínima.
 */
export function LinkButton({
  label,
  description,
  href,
  icon,
  highlight = false,
  external = true,
  className,
}: LinkButtonProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className={cn(
        "flex min-h-16 items-center gap-4 border px-[18px] py-4",
        "ease-brand transition-[border-color,background-color,transform] duration-280",
        highlight
          ? "bg-orange border-orange hover:bg-orange-2 hover:border-orange-2"
          : "border-line-2 bg-panel hover:border-mint",
        "hover:translate-x-[3px] focus-visible:translate-x-[3px]",
        className,
      )}
    >
      {icon ? (
        <span
          className={cn(
            "[&_svg]:size-[22px] [&_svg]:shrink-0 [&_svg]:fill-none [&_svg]:stroke-[1.5]",
            "[&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round]",
            highlight ? "[&_svg]:stroke-ink" : "[&_svg]:stroke-mint",
          )}
        >
          {icon}
        </span>
      ) : null}

      <span className="block min-w-0">
        <b
          className={cn(
            "block font-mono text-[14px] font-bold leading-[1.3] tracking-[0.04em]",
            highlight ? "text-ink" : "text-cream",
          )}
        >
          {label}
        </b>
        {description ? (
          <i
            className={cn(
              "mt-1 block text-[13px] not-italic leading-[1.45]",
              highlight ? "text-ink/78" : "text-cream-3",
            )}
          >
            {description}
          </i>
        ) : null}
      </span>
    </a>
  );
}
