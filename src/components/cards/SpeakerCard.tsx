import Image from "next/image";
import { PendingSlot } from "@/components/primitives/PendingSlot";
import { cn } from "@/lib/utils";

export type SpeakerCardProps = {
  name?: string;
  /** Cargo e organização na mesma linha. */
  role?: string;
  topic?: string;
  photo?: string;
  href?: string;
  className?: string;
  /** Texto do quadrado quando ainda não há nome anunciado. */
  placeholder?: string;
  /** Iniciais na moldura enquanto o retrato não chega. */
  initials?: string;
  /** Descrição da moldura sem retrato, para leitor de tela. */
  photoPending?: string;
  /**
   * `h2` na rota que existe para listar pessoas: ali cada nome é um assunto da
   * página, não um rótulo de cartão.
   */
  nameAs?: "span" | "h2";
};

/**
 * Nasce como espaço reservado: com `name` ausente o cartão declara a pendência
 * em vez de inventar um nome. Anunciada a pessoa e ainda sem retrato, a moldura
 * hachurada leva as iniciais, nunca ilustração nem foto de banco de imagem.
 */
export function SpeakerCard({
  name,
  role,
  topic,
  photo,
  href,
  className,
  placeholder = "Em breve",
  initials,
  photoPending = "Retrato em curadoria",
  nameAs: Nome = "span",
}: SpeakerCardProps) {
  const pending = !name;

  const retrato = photo ? (
    <div className="relative aspect-square">
      <Image src={photo} alt={name ?? ""} fill className="object-cover" sizes="260px" />
    </div>
  ) : name ? (
    <PendingSlot
      ratio="1/1"
      mark={initials}
      label={`${photoPending}: ${name}`}
      className="border-0"
    />
  ) : (
    <span className="text-cream/42 flex aspect-square items-center justify-center font-mono text-[13px] tracking-[0.2em] uppercase">
      {placeholder}
    </span>
  );

  const body = (
    <>
      {retrato}

      <Nome
        className={cn(
          "border-line-2 block border-t px-5 pt-[18px] text-[16px] font-bold",
          pending ? "text-cream-3 border-dashed" : "text-cream border-solid",
        )}
      >
        {name ?? "A confirmar"}
      </Nome>

      {role ? (
        <span className="text-mint block px-5 pt-[7px] font-mono text-[11px] tracking-[0.12em] uppercase">
          {role}
        </span>
      ) : null}

      <span className="text-cream-3 block px-5 pt-[5px] pb-[18px] font-mono text-[12px]">
        {topic ?? "Tema em breve"}
      </span>
    </>
  );

  const classes = cn(
    "bg-panel block border",
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
