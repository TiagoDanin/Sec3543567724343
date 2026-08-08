import Image from "next/image";
import { Button } from "@/components/primitives/Button";
import { asset } from "@/lib/site";
import type { Hero as HeroContent, Settings } from "@/lib/cms";

export type HeroProps = {
  hero: HeroContent;
  settings: Settings;
};

/**
 * Arte de fundo com véu que abre para a direita, lockup e manchete à esquerda,
 * mascote flutuando sobre o brilho menta. Em tela estreita o véu vira vertical:
 * o texto atravessaria a parte clara da mata.
 */
export function Hero({ hero, settings }: HeroProps) {
  // "Av. Pedro Álvares Cabral, 9031. Marambaia, Belém/PA" → "Belém/PA"
  const cidade = settings.venueAddress.split(",").slice(-1)[0]?.trim() ?? "";

  return (
    <section id="topo" className="border-line relative overflow-hidden border-b">
      <div aria-hidden="true" className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat max-[900px]:bg-[78%_center]"
          style={{
            backgroundImage: `image-set(url("${asset("/images/hero/hero-bg.webp")}") type("image/webp"), url("${asset("/images/hero/hero-bg.png")}") type("image/png"))`,
            backgroundPosition: "72% center",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,#0F1A0C_4%,rgba(15,26,12,.88)_30%,rgba(15,26,12,.34)_56%,rgba(15,26,12,.18)_100%),linear-gradient(#12200D_0%,transparent_14%),linear-gradient(0deg,#152310_0%,rgba(21,35,16,.55)_12%,transparent_30%)] max-[900px]:bg-[linear-gradient(#12200D_0%,rgba(15,26,12,.9)_26%,rgba(15,26,12,.72)_62%,rgba(21,35,16,.55)_100%),linear-gradient(0deg,#152310_0%,rgba(21,35,16,.6)_10%,transparent_26%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(620px_620px_at_72%_58%,rgba(79,227,172,.13),transparent_68%)]" />
      </div>

      <div className="max-w-site relative mx-auto grid min-h-[min(760px,calc(100svh-var(--nav-h)))] grid-cols-[1.12fr_.88fr] items-center gap-[clamp(24px,3vw,48px)] px-(--gutter) pt-[clamp(40px,5vw,64px)] pb-[clamp(48px,6vw,76px)] max-[900px]:min-h-0 max-[900px]:grid-cols-1 max-[900px]:items-start max-[900px]:gap-[clamp(20px,5vw,32px)] max-[900px]:pt-[clamp(30px,7vw,48px)]">
        <div>
          <p className="text-mint mb-[26px] font-mono text-[12px] tracking-[0.28em] uppercase">
            {hero.lugares.map((lugar, index) => (
              <span key={lugar}>
                {index > 0 ? <span className="text-mint/50 mx-[0.3em]">·</span> : null}
                {lugar}
              </span>
            ))}
          </p>

          <Image
            src={asset("/images/marca/logo-xibesec.png")}
            alt={hero.logoAlt}
            width={1600}
            height={1282}
            priority
            className="mb-[clamp(22px,2.6vw,32px)] w-[min(100%,clamp(260px,26vw,390px))] max-[900px]:w-[min(82%,300px)]"
          />

          <h1 className="font-display mb-5 text-[clamp(2.1rem,4.3vw,3.25rem)] leading-[1.02] font-bold tracking-[0.01em] uppercase">
            {hero.tituloLinha}
            <br />
            <em className="text-orange not-italic">{hero.tituloDestaque}</em>
          </h1>

          <p className="text-cream-2 mb-8 max-w-[520px] text-[17px] leading-[1.6] max-[900px]:mb-7">
            {hero.lede}
          </p>

          <div className="mb-9 flex flex-wrap gap-3.5 max-[900px]:mb-7 [&>a]:max-[900px]:flex-auto">
            <Button href="#ingressos" arrow>
              {hero.ctaPrimario}
            </Button>
            {hero.ctaSecundario ? (
              <Button href="#programacao" variant="ghost">
                {hero.ctaSecundario}
              </Button>
            ) : null}
          </div>

          <p className="text-cream-3 flex flex-wrap gap-x-7 gap-y-2.5 font-mono text-[13px]">
            <span>
              <time dateTime={settings.eventStartDate}>{settings.eventDisplayDate}</time>
              {hero.horario ? ` · ${hero.horario}` : null}
            </span>
            <span aria-hidden="true" className="text-cream/25">
              /
            </span>
            <span>
              {settings.venueName} · {cidade}
            </span>
          </p>
        </div>

        <div className="relative flex translate-x-[-7%] translate-y-[6%] items-end justify-center max-[900px]:translate-none max-[900px]:justify-start">
          <span
            aria-hidden="true"
            className="absolute aspect-square w-[78%] rounded-full bg-[radial-gradient(circle,rgba(79,227,172,.18),transparent_65%)] max-[900px]:-left-[6%]"
          />
          <Image
            src={asset("/images/marca/mascote.png")}
            alt={hero.mascoteAlt}
            width={1400}
            height={1750}
            priority
            className="animate-floaty relative w-full max-w-[min(46vw,520px)] drop-shadow-[0_30px_50px_rgba(0,0,0,.55)] max-[900px]:max-w-[min(66vw,300px)]"
          />
        </div>
      </div>
    </section>
  );
}
