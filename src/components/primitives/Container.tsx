import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ContainerProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

/** Medida do conteúdo: 1320px com goteira fluida. */
export function Container({ as: Tag = "div", children, className }: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full max-w-site px-(--gutter)", className)}>{children}</Tag>
  );
}
