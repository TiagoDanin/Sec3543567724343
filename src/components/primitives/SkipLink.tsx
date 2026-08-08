import type { ReactNode } from "react";

export type SkipLinkProps = {
  href: string;
  children: ReactNode;
};

/** Sai do repouso apenas no foco de teclado. */
export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="bg-mint text-ink fixed top-2 left-2 z-200 -translate-y-[180%] px-[18px] py-3 font-mono text-xs font-bold tracking-[0.1em] uppercase focus:translate-y-0"
    >
      {children}
    </a>
  );
}
