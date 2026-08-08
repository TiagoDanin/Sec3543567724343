import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TagProps = {
  children: ReactNode;
  tone?: "orange" | "mint";
  className?: string;
};

/**
 * Etiqueta de estado. O uso canônico é `Em definição` na grade — indefinido é
 * declarado, nunca preenchido com invenção.
 */
export function Tag({ children, tone = "orange", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-block border px-[9px] py-[5px] whitespace-nowrap",
        "font-mono text-[10px] tracking-[0.14em] uppercase",
        tone === "orange" ? "text-orange border-orange/50" : "text-mint border-mint/50",
        className,
      )}
    >
      {children}
    </span>
  );
}
