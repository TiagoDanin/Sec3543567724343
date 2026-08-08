"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Escalonamento em passos de 80ms. O sistema usa no máximo 3. */
  step?: 0 | 1 | 2;
};

/**
 * O gesto autoral do projeto, repetido: subida com desfoque. Sem JavaScript o
 * conteúdo aparece inteiro — o estado invisível só passa a valer depois que o
 * componente monta.
 */
export function Reveal({ children, as: Tag = "div", className, step = 0 }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setArmed(true);
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={armed ? { transitionDelay: `${step * 80}ms` } : undefined}
      className={cn(armed && "reveal", shown && "reveal-in", className)}
    >
      {children}
    </Tag>
  );
}
