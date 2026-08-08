import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type IncludedItem = {
  icon: ReactNode;
  text: string;
};

export type IncludedListProps = {
  items: IncludedItem[];
  className?: string;
};

/**
 * O que a inscrição dá direito. Quatro itens: 4 · 2 · 1 coluna — nunca uma
 * linha órfã.
 */
export function IncludedList({ items, className }: IncludedListProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-4 gap-6 max-[1000px]:grid-cols-2 max-[560px]:grid-cols-1",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.text} className="border-line flex flex-col gap-3 border-t pt-4">
          <span className="[&_svg]:stroke-mint [&_svg]:size-[26px] [&_svg]:shrink-0 [&_svg]:fill-none [&_svg]:stroke-[1.5] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round]">
            {item.icon}
          </span>
          <p className="text-cream-2 text-sm leading-[1.55]">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}
