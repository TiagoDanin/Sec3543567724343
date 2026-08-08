import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type KitBannerProps = {
  title: string;
  children: ReactNode;
  /** Botões da direita. */
  actions?: ReactNode;
  className?: string;
};

/** Faixa de chamada ao fim de uma seção — mídia kit, contato da organização. */
export function KitBanner({ title, children, actions, className }: KitBannerProps) {
  return (
    <div
      className={cn(
        "border-line bg-panel mt-[clamp(32px,4vw,56px)] flex flex-wrap items-center justify-between gap-6 border p-[clamp(28px,3.2vw,40px)]",
        className,
      )}
    >
      <div>
        <h3 className="font-display mb-2 text-[clamp(1.35rem,2.1vw,1.625rem)] leading-[1.18] font-bold tracking-[-0.01em]">
          {title}
        </h3>
        <p className="text-cream-3 text-[15px]">{children}</p>
      </div>

      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
