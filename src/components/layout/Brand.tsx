import Image from "next/image";
import { asset } from "@/lib/site";
import { cn } from "@/lib/utils";

export type BrandProps = {
  href?: string;
  className?: string;
};

/**
 * Lettering da marca, sem a cuia: o lockup completo fica ilegível na altura do
 * cabeçalho. O SVG é bitmap vetorizado — as lascas menores que um pixel nesta
 * escala foram descartadas, senão são 5 MB de granulado invisível.
 */
export function Brand({ href = "/", className }: BrandProps) {
  const word = (
    <Image
      src={asset("/images/marca/lockup-xibesec.svg")}
      alt=""
      width={1194}
      height={235}
      priority
      className="h-[22px] w-auto max-[360px]:hidden"
    />
  );

  return (
    <a
      href={href}
      aria-label="XibéSec 26, início"
      className={cn("flex shrink-0 items-center", className)}
    >
      {word}
    </a>
  );
}
