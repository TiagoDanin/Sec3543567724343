import Image from "next/image";
import { PendingSlot } from "@/components/primitives/PendingSlot";
import { cn } from "@/lib/utils";

export type EditionCardProps = {
  year: number;
  title: string;
  /** Legenda à direita. Ausente a foto, declara a pendência. */
  caption?: string;
  photo?: string;
  id?: string;
  /** Índice na pilha: controla o recuo do sticky e a inclinação. */
  index?: number;
  /** Registro no topo da pilha agora. */
  active?: boolean;
  className?: string;
};

/**
 * Registro de uma edição anterior. A moldura de 12px imita a margem de uma foto
 * revelada. Sem `photo` entra o espaço reservado — as fotos existem mas ainda
 * não foram entregues, e não se substitui por ilustração ou stock.
 */
export function EditionCard({
  year,
  title,
  caption = "Registro em curadoria",
  photo,
  id,
  index = 0,
  active = false,
  className,
}: EditionCardProps) {
  return (
    <figure
      id={id}
      style={{ "--i": index } as React.CSSProperties}
      className={cn(
        "bg-ink border-line m-0 border",
        "ease-brand transition-transform duration-400 hover:rotate-0",
        active && "border-mint rotate-0",
        className,
      )}
    >
      <div className="mx-3 mt-3">
        {photo ? (
          <div className="relative aspect-16/10">
            <Image src={photo} alt={title} fill className="object-cover" sizes="640px" />
          </div>
        ) : (
          <PendingSlot mark={String(year)} label={`${title}: ${caption}`} />
        )}
      </div>

      <figcaption className="flex items-baseline justify-between gap-4 px-3 pt-3.5 pb-3">
        <b className="text-cream text-[16px] font-bold">{title}</b>
        <span className="text-cream-3 font-mono text-[11px] tracking-[0.2em] uppercase">
          {caption}
        </span>
      </figcaption>
    </figure>
  );
}
