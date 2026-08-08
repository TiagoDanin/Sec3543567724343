import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type NoteProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Observação de rodapé de seção. Fica na sans: a monoespaçada carrega só hora,
 * valor, contagem e rótulo — texto de leitura nunca vai para mono.
 */
export type NoteWithLinkProps = {
  /** Frase completa, com o token `{link}` na posição do link. */
  text: string;
  label: string;
  /** Sem destino, o rótulo continua na frase — como texto, sem virar link. */
  href?: string;
  className?: string;
};

/**
 * Nota cuja frase inteira vem do CMS, incluindo o que vem antes e depois do
 * link. Sem o token `{link}` o texto é renderizado como está.
 */
export function NoteWithLink({ text, label, href, className }: NoteWithLinkProps) {
  if (!text) return null;

  const [before, after] = text.split("{link}");
  const external = href?.startsWith("http") ?? false;
  const rotulo = after !== undefined && label ? label : null;

  return (
    <Note className={className}>
      {before}
      {rotulo && href ? (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
          {rotulo}
        </a>
      ) : (
        rotulo
      )}
      {after}
    </Note>
  );
}

export function Note({ children, className }: NoteProps) {
  return (
    <p
      className={cn(
        "text-cream-3 mt-6 max-w-[70ch] text-sm leading-[1.7]",
        "[&_a]:text-mint [&_a]:border-mint/40 [&_a]:border-b",
        "[&_a:hover]:text-cream [&_a:hover]:border-cream",
        className,
      )}
    >
      {children}
    </p>
  );
}
