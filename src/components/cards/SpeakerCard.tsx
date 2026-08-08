import Image from "next/image";
import { cn } from "@/lib/utils";

export type SpeakerCardProps = {
  name?: string;
  topic?: string;
  photo?: string;
  href?: string;
  className?: string;
  /** Texto do quadrado quando ainda não há retrato. */
  placeholder?: string;
};

/**
 * Nasce como espaço reservado: nenhum nome de 2026 foi anunciado. Com `name`
 * ausente o cartão declara a pendência em vez de inventar um nome.
 */
export function SpeakerCard({
  name,
  topic,
  photo,
  href,
  className,
  placeholder = "Em breve",
}: SpeakerCardProps) {
  const pending = !name;

  const body = (
    <>
      {photo ? (
        <div className="relative aspect-square">
          <Image src={photo} alt={name ?? ""} fill className="object-cover" sizes="260px" />
        </div>
      ) : (
        <span className="text-cream/42 flex aspect-square items-center justify-center font-mono text-[13px] tracking-[0.2em] uppercase">
          {placeholder}
        </span>
      )}

      <span
        className={cn(
          "border-line-2 block border-t px-5 pt-[18px] text-[16px] font-bold",
          photo ? "text-cream border-solid" : "text-cream-3 border-dashed",
        )}
      >
        {name ?? "A confirmar"}
      </span>

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
