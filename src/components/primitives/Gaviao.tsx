import Image from "next/image";
import { asset } from "@/lib/site";
import { cn } from "@/lib/utils";

export type GaviaoProps = {
  /** Texto alternativo. O gavião é decorativo quando ausente. */
  alt?: string;
  className?: string;
};

/** Gavião do XibéSec, em voo. O posicionamento fica com quem usa. */
export function Gaviao({ alt, className }: GaviaoProps) {
  return (
    <Image
      src={asset("/images/marca/gaviao.webp")}
      alt={alt ?? ""}
      aria-hidden={alt ? undefined : true}
      width={300}
      height={306}
      loading="lazy"
      className={cn("select-none", className)}
    />
  );
}
