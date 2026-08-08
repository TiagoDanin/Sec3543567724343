import Image from "next/image";
import { cn } from "@/lib/utils";

export type BioHeaderProps = {
  logo?: string;
  handle?: string;
  lede?: string;
  /** Data, horário e cidade. O primeiro sai em menta. */
  facts?: string[];
  className?: string;
};

/** Cabeçalho da página de links (QR code do evento). */
export function BioHeader({ logo, handle, lede, facts, className }: BioHeaderProps) {
  return (
    <header className={cn("text-center", className)}>
      {logo ? (
        <Image
          src={logo}
          alt="XibéSec 26"
          width={1600}
          height={1282}
          priority
          className="mx-auto h-[clamp(84px,17vw,112px)] w-auto"
        />
      ) : null}

      {handle ? (
        <p className="text-orange mt-[18px] font-mono text-[13px] font-medium tracking-[0.2em]">
          {handle}
        </p>
      ) : null}

      {lede ? <p className="text-cream-2 mt-4 text-[15px] leading-[1.65]">{lede}</p> : null}

      {facts?.length ? (
        <ul className="border-line text-cream-3 mt-5 flex flex-wrap justify-center gap-x-[18px] gap-y-2 border-t pt-[18px] font-mono text-[12px] tracking-[0.12em] uppercase">
          {facts.map((fact, index) => (
            <li key={fact} className={index === 0 ? "text-mint" : undefined}>
              {fact}
            </li>
          ))}
        </ul>
      ) : null}
    </header>
  );
}

export type SocialRowProps = {
  links: Array<{ label: string; href: string }>;
  className?: string;
  "aria-label"?: string;
};

export function SocialRow({ links, className, ...props }: SocialRowProps) {
  return (
    <nav
      className={cn(
        "border-line mt-[clamp(28px,5vw,40px)] flex flex-wrap justify-center gap-x-[22px] gap-y-2.5 border-t pt-[22px] font-mono text-[12px] tracking-[0.14em] uppercase",
        className,
      )}
      {...props}
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener"
          className="text-cream-2 ease-brand hover:text-orange hover:border-orange focus-visible:text-orange focus-visible:border-orange border-b border-transparent transition-colors duration-250"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
