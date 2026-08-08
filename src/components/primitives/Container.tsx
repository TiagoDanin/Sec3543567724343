import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ContainerProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
};

/** Medida do conteúdo: 1320px com goteira fluida. */
export function Container({ as: Tag = "div", children, className, id }: ContainerProps) {
  return (
    <Tag id={id} className={cn("max-w-site mx-auto w-full px-(--gutter)", className)}>
      {children}
    </Tag>
  );
}
