"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Brand } from "./Brand";
import { cn } from "@/lib/utils";

export type NavItem = {
  label: string;
  href: string;
};

export type NavBarProps = {
  items: NavItem[];
  /** Botão à direita, escondido abaixo de 900px (vive na gaveta e no dock). */
  action?: ReactNode;
  className?: string;
};

/**
 * Barra fixa. Transparente no topo com véu em degradê; ao passar 56px de rolagem
 * ganha fundo, desfoque e filete. A gaveta mobile fecha por `Esc` e por clique
 * no item.
 */
export function NavBar({ items, action, className }: NavBarProps) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 56);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "ease-brand sticky top-0 z-100 border-b transition-[background-color,border-color,backdrop-filter] duration-350",
        stuck
          ? "border-line bg-ink-deep/66 backdrop-blur-[34px] backdrop-saturate-160"
          : "border-transparent backdrop-blur-[3px]",
        open && "bg-ink-deep",
        className,
      )}
    >
      {/* Véu de leitura, some quando a barra ganha fundo próprio. */}
      <span
        aria-hidden="true"
        className={cn(
          "from-ink-deep/58 ease-brand absolute inset-0 -z-10 bg-linear-to-b to-transparent transition-opacity duration-350",
          (stuck || open) && "opacity-0",
        )}
      />

      <div className="max-w-site mx-auto flex h-(--nav-h) items-center gap-[clamp(16px,3vw,32px)] px-(--gutter)">
        <Brand />

        <nav
          id="menu"
          aria-label="Seções da página"
          className={cn(
            "mr-auto flex items-center gap-[clamp(14px,1.9vw,26px)] font-mono text-[12px] tracking-[0.08em] uppercase",
            "max-[1080px]:fixed max-[1080px]:inset-x-0 max-[1080px]:top-(--nav-h) max-[1080px]:bottom-auto",
            "max-[1080px]:border-line max-[1080px]:bg-ink-deep max-[1080px]:flex-col max-[1080px]:items-stretch",
            "max-[1080px]:max-h-[calc(100dvh-var(--nav-h))] max-[1080px]:gap-0 max-[1080px]:overflow-y-auto",
            "max-[1080px]:border-b max-[1080px]:px-(--gutter) max-[1080px]:pt-1 max-[1080px]:pb-6 max-[1080px]:text-sm",
            "max-[1080px]:ease-brand max-[1080px]:transition-transform max-[1080px]:duration-420",
            open ? "max-[1080px]:translate-y-0" : "max-[1080px]:-translate-y-[115%]",
          )}
        >
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "text-cream-3 ease-brand border-b border-transparent py-1.5 transition-colors duration-250",
                "hover:text-orange hover:border-orange focus-visible:text-orange focus-visible:border-orange",
                "max-[1080px]:border-line max-[1080px]:py-4",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          {action ? <span className="max-[900px]:hidden">{action}</span> : null}

          <button
            type="button"
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((value) => !value)}
            className="border-line-2 hidden size-11 flex-col items-center justify-center gap-[5px] border max-[1080px]:flex"
          >
            <span
              className={cn(
                "bg-cream ease-brand block h-[1.5px] w-[18px] transition-transform duration-300",
                open && "translate-y-[6.5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "bg-cream block h-[1.5px] w-[18px] transition-opacity",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "bg-cream ease-brand block h-[1.5px] w-[18px] transition-transform duration-300",
                open && "-translate-y-[6.5px] -rotate-45",
              )}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
