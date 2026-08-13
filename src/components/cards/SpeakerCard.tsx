import { cn } from "@/lib/utils";

export type SpeakerCardProps = {
  name?: string;
  /** Cargo e organização na mesma linha. */
  role?: string;
  topic?: string;
  href?: string;
  className?: string;
  /** Texto do quadrado quando ainda não há nome anunciado. */
  placeholder?: string;
  /**
   * `h2` na rota que existe para listar pessoas: ali cada nome é um assunto da
   * página, não um rótulo de cartão.
   */
  nameAs?: "span" | "h2";
};

/**
 * Nasce como espaço reservado: com `name` ausente o cartão declara a pendência
 * em vez de inventar um nome. Anunciada a pessoa, o cartão é só tipografia. Não
 * há retrato nem moldura à espera de um: o nome, o cargo e a palestra são o que
 * a organização entregou, e moldura vazia só ocuparia a grade sem dizer nada.
 */
export function SpeakerCard({
  name,
  role,
  topic,
  href,
  className,
  placeholder = "Em breve",
  nameAs: Nome = "span",
}: SpeakerCardProps) {
  const pending = !name;

  const body = pending ? (
    <span className="text-cream/42 flex aspect-square items-center justify-center font-mono text-[13px] tracking-[0.2em] uppercase">
      {placeholder}
    </span>
  ) : (
    <>
      <Nome className="text-cream block px-5 pt-[22px] text-[16px] font-bold">{name}</Nome>

      {role ? (
        <span className="text-mint block px-5 pt-[9px] font-mono text-[11px] tracking-[0.12em] uppercase">
          {role}
        </span>
      ) : null}

      <span className="text-cream-3 block px-5 pt-3 pb-[22px] text-[15px] leading-[1.5]">
        {topic ?? "Tema em breve"}
      </span>
    </>
  );

  // `h-full` para a moldura tomar a altura da linha da grade: sem isso o cartão
  // de nome curto fica mais baixo que o vizinho e a fileira desalinha embaixo.
  const classes = cn(
    "bg-panel block h-full border",
    pending ? "border-line-2 border-dashed" : "border-line-2 border-solid",
    href && "ease-brand transition-colors duration-280 hover:border-mint",
    className,
  );

  return href ? (
    <a href={href} className={classes}>
      {body}
    </a>
  ) : (
    <div className={classes}>{body}</div>
  );
}
