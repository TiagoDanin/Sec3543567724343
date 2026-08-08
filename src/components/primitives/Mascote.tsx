import Image from "next/image";
import { asset } from "@/lib/site";
import { cn } from "@/lib/utils";

export type MascoteProps = {
  /** Texto alternativo. A arte é decorativa quando ausente. */
  alt?: string;
  className?: string;
};

/** Cada luz é uma camada própria, empilhada sobre a base e acesa por opacidade. */
const LUZES = [
  { nome: "peitoral", classe: "animate-peitoral" },
  { nome: "duto", classe: "animate-duto" },
  { nome: "olho", classe: "animate-led-olho" },
  { nome: "grafismo", classe: "animate-led-grafismo" },
  { nome: "cabo", classe: "animate-led-cabo" },
] as const;

const W = 1400;
const H = 1448;

/**
 * Mascote com as luzes pulsando. A arte é bitmap fatiado em camadas: a base
 * traz tudo no piso da animação, e cada camada de luz acende a sua parte por
 * cima. Animar opacidade de imagem é trabalho de compositor — o desenho em si
 * nunca é repintado.
 */
export function Mascote({ alt, className }: MascoteProps) {
  return (
    <div
      className={cn("relative", className)}
      role={alt ? "img" : undefined}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
    >
      <Image
        src={asset("/images/marca/mascote/mascote-base.webp")}
        alt=""
        width={W}
        height={H}
        priority
        className="w-full"
      />
      {LUZES.map(({ nome, classe }) => (
        <Image
          key={nome}
          src={asset(`/images/marca/mascote/mascote-${nome}.webp`)}
          alt=""
          aria-hidden="true"
          width={W}
          height={H}
          priority
          className={cn("absolute inset-0 w-full", classe)}
        />
      ))}
    </div>
  );
}
