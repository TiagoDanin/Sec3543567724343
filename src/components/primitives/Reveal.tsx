"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Escalonamento em passos de 80ms. O sistema usa no máximo 3. */
  step?: 0 | 1 | 2;
};

/**
 * O gesto autoral do projeto, repetido: subida com desfoque.
 *
 * O estado invisível é aplicado por classe no próprio nó, depois da montagem —
 * sem JavaScript o conteúdo aparece inteiro, como manda o DESIGN.md. Por isso o
 * efeito escreve direto no DOM em vez de guardar estado em React: o alvo é o
 * elemento, e o React não precisa re-renderizar por causa disso.
 */
export function Reveal({ children, as: Tag = "div", className, step = 0 }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.style.transitionDelay = `${step * 80}ms`;
    node.classList.add("reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add("reveal-in");
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [step]);

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
