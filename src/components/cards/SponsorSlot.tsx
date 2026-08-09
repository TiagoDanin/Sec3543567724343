import Image from "next/image";
import { LinkMedido } from "@/components/analytics/LinkMedido";
import { EVENTOS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export type SponsorSlotProps = {
  name: string;
  logo?: string;
  href?: string;
  tier?: string;
  className?: string;
};

/**
 * Patrocinador confirmado. Vive dentro da seção clara, que inverte o tema para
 * receber logo em arquivo com fundo branco chapado.
 *
 * A seção não exibe cota vaga: mostrar espaço reservado de patrocínio depende de
 * aval da organização — ver PRODUCT.md.
 */
export function SponsorSlot({ name, logo, href, tier, className }: SponsorSlotProps) {
  const content = logo ? (
    <Image
      src={logo}
      alt={name}
      width={800}
      height={229}
      className="ease-brand h-auto w-[min(200px,58%)] transition-transform duration-300 group-hover:scale-104"
    />
  ) : (
    <span className="text-[16px] tracking-[0.06em]">{name}</span>
  );

  const classes = cn(
    "group border-line-2 flex min-h-[104px] max-w-[420px] items-center justify-center border p-6 text-center",
    "ease-brand transition-colors duration-300 hover:text-orange hover:border-orange",
    className,
  );

  return href ? (
    <LinkMedido
      medirComo={EVENTOS.patrocinadorClicado}
      dados={{ nome: name, ...(tier ? { cota: tier } : {}) }}
      href={href}
      target="_blank"
      rel="noopener"
      className={classes}
      aria-label={tier ? `${name}, patrocinador ${tier} (abre em nova aba)` : name}
    >
      {content}
    </LinkMedido>
  ) : (
    <div className={classes}>{content}</div>
  );
}
