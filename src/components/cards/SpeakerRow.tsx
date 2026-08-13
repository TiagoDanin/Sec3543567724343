import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SpeakerRowProps = {
  name?: string;
  /** Cargo e organização na mesma linha. */
  role?: string;
  topic?: string;
  /** Temas da palestra, separados por ponto médio. */
  subjects?: string[];
  href?: string;
  /**
   * `h2` na rota que existe para listar pessoas: ali cada nome é um assunto da
   * página, não um rótulo de linha.
   */
  nameAs?: "p" | "h2" | "h3";
  placeholder?: string;
  topicPlaceholder?: string;
  className?: string;
};

/**
 * Uma pessoa por linha: nome e cargo à esquerda, a palestra à direita. A edição
 * não publica retrato, e sem ele um cartão vira caixa de texto estreita: a linha
 * larga é o que deixa o título da palestra caber sem quebrar em três.
 *
 * Sem `name` a linha declara a pendência, que é o estado enquanto a organização
 * não anuncia o próximo nome.
 */
export function SpeakerRow({
  name,
  role,
  topic,
  subjects,
  href,
  nameAs: Nome = "p",
  placeholder = "A confirmar",
  topicPlaceholder = "Tema em breve",
  className,
}: SpeakerRowProps) {
  const pending = !name;

  const body = (
    <>
      <div>
        <Nome
          className={cn(
            "font-display text-[20px] leading-[1.2] font-bold",
            pending ? "text-cream-3" : "text-cream group-hover:text-mint ease-brand duration-280",
          )}
        >
          {name ?? placeholder}
        </Nome>

        {role ? (
          <p className="text-mint mt-2.5 font-mono text-[11px] tracking-[0.14em] uppercase">
            {role}
          </p>
        ) : null}
      </div>

      <div>
        <p className={cn("text-[16px] leading-[1.6]", pending ? "text-cream-3" : "text-cream-2")}>
          {topic ?? topicPlaceholder}
        </p>

        {subjects?.length ? (
          <p className="text-cream-3 mt-3 font-mono text-[11px] tracking-[0.12em] uppercase">
            {subjects.join(" · ")}
          </p>
        ) : null}
      </div>
    </>
  );

  const classes = cn(
    "bg-ink grid grid-cols-[minmax(220px,0.8fr)_minmax(0,1.5fr)] items-start gap-x-10 gap-y-3 px-1 py-[30px]",
    "max-[820px]:grid-cols-1 max-[820px]:py-6",
    className,
  );

  return (
    <li className={href ? "group" : classes}>
      {href ? (
        <a
          href={href}
          className={cn(classes, "ease-brand hover:bg-panel transition-colors duration-300")}
        >
          {body}
        </a>
      ) : (
        body
      )}
    </li>
  );
}

export type SpeakerListProps = {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
};

/** Grade de 1px: o filete vem do fundo, as linhas ficam por cima. */
export function SpeakerList({ children, className, ...props }: SpeakerListProps) {
  return (
    <ul className={cn("bg-line border-line grid gap-px border-y", className)} {...props}>
      {children}
    </ul>
  );
}
