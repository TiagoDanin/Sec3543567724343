import type { CSSProperties } from "react";
import type { Arquetipo, QuizCopy, TimeCor } from "@/lib/content-types";
import { GRAFISMO_VERDE_DATA_URI, LOGO_DATA_URI, MASCOTE_DATA_URI } from "./carta-assets";

/**
 * Recorte da foto sem borda. Empilhadas em três elementos, e não em três
 * camadas da mesma propriedade, porque `mask-composite` diverge entre
 * navegadores.
 */
const MASCARA_ELIPSE = "radial-gradient(ellipse 64% 86% at 50% 40%, #000 52%, transparent 82%)";
const MASCARA_BASE = "linear-gradient(200deg, #000 66%, transparent 100%)";
const MASCARA_TOPO = "linear-gradient(180deg, transparent 0%, #000 16%)";

/** As três máscaras acima são para retrato; no mascote elas comem a cabeça. */
const MASCARA_MASCOTE = "linear-gradient(180deg, #000 82%, transparent 100%)";

/** Story do Instagram: 9:16. O feed (4:5) recortaria a carta pelas pontas. */
export const CARTA_LARGURA = 1080;
export const CARTA_ALTURA = 1920;

/**
 * Cor do time na roda de cibersegurança. É acento local do selo — os tokens da
 * marca continuam mandando no resto da carta.
 *
 * Escrita como valor, não como classe do Tailwind: o scanner é estático e uma
 * classe montada em tempo de execução some do CSS.
 */
export const COR_DO_TIME: Record<TimeCor, string> = {
  red: "#E2564A",
  blue: "#4F9BE3",
  purple: "#A97BE0",
  yellow: "#E3C44F",
  orange: "#EE7B2E",
  white: "#F2E4C4",
};

export type CartaProps = {
  arquetipo: Arquetipo;
  nome: string;
  copy: QuizCopy;
  /** Ausente: o mascote. */
  foto?: string;
  /** Enquadramento da foto, em porcentagem do quadro. */
  fotoX?: number;
  fotoY?: number;
  fotoZoom?: number;
  /** Original por trás da recortada, a meia opacidade. */
  fotoFundo?: string;
};

const mask = (image: string): CSSProperties => ({
  WebkitMaskImage: image,
  maskImage: image,
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskSize: "100% 100%",
  maskSize: "100% 100%",
});

/**
 * A carta do resultado. É o mesmo nó que a prévia mostra e que `html-to-image`
 * exporta, dimensionado em `cqw` para servir aos dois tamanhos sem uma segunda
 * tabela de posições.
 */
export function Carta({
  arquetipo,
  nome,
  copy,
  foto,
  fotoX = 50,
  fotoY = 20,
  fotoZoom = 1,
  fotoFundo,
}: CartaProps) {
  const temFoto = Boolean(foto);
  const corTime = COR_DO_TIME[arquetipo.timeCor] ?? COR_DO_TIME.blue;
  const maiorPalavra = Math.max(...arquetipo.nome.split(" ").map((p) => p.length));

  return (
    <div
      data-carta
      className="bg-ink-deep relative isolate w-full overflow-hidden select-none"
      style={
        {
          containerType: "inline-size",
          aspectRatio: `${CARTA_LARGURA} / ${CARTA_ALTURA}`,
          // O enquadramento entra por variável para o arrasto escrever direto no
          // nó: a cada `pointermove`, re-renderizar as máscaras engasga.
          "--foto-x": `${fotoX}%`,
          "--foto-y": `${fotoY}%`,
          "--foto-zoom": fotoZoom,
        } as CSSProperties
      }
    >
      {/* Cor, e não arte: atrás de um retrato, a mata vira uma segunda cena. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(72% 42% at 50% 34%, rgba(79,227,172,.14), transparent 72%), linear-gradient(178deg, #1B2E15 0%, #152310 46%, #0F1A0C 100%)",
        }}
      />

      <div
        className="absolute z-1"
        style={{
          // Quadro mais estreito para o mascote: `contain` encaixa pela menor
          // dimensão, e um quadro largo o encolheria no meio do vazio.
          left: temFoto ? "2cqw" : "13cqw",
          top: temFoto ? "26cqw" : "30cqw",
          width: temFoto ? "96cqw" : "74cqw",
          height: temFoto ? "104cqw" : "88cqw",
          ...mask(temFoto ? MASCARA_ELIPSE : MASCARA_MASCOTE),
        }}
      >
        <div className="h-full w-full" style={temFoto ? mask(MASCARA_BASE) : undefined}>
          <div
            className="relative h-full w-full"
            style={{
              ...(temFoto ? mask(MASCARA_TOPO) : {}),
              filter:
                "drop-shadow(0 3cqw 5cqw rgba(0,0,0,.6)) drop-shadow(0 0 4cqw rgba(79,227,172,.3))",
            }}
          >
            {/* `next/image` embrulha a tag em wrapper próprio, e a foto é um
                `blob:` que não passa pelo otimizador. */}
            {fotoFundo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fotoFundo}
                alt=""
                aria-hidden
                draggable={false}
                className="absolute inset-0 h-full w-full"
                style={{
                  objectFit: "cover",
                  objectPosition: "var(--foto-x) var(--foto-y)",
                  transform: "scale(var(--foto-zoom))",
                  opacity: 0.5,
                }}
              />
            ) : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={foto ?? MASCOTE_DATA_URI}
              alt=""
              aria-hidden
              draggable={false}
              className="relative h-full w-full"
              style={{
                // `cover` cortaria o martelo do mascote fora do quadro.
                objectFit: temFoto ? "cover" : "contain",
                // Acima do centro: cortar no meio decapita foto de celular.
                objectPosition: temFoto ? "var(--foto-x) var(--foto-y)" : "center bottom",
                transform: temFoto ? "scale(var(--foto-zoom))" : undefined,
              }}
            />
          </div>
        </div>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_DATA_URI}
        alt=""
        aria-hidden
        className="absolute z-2"
        style={{
          left: "50%",
          top: "7cqw",
          width: "44cqw",
          transform: "translateX(-50%)",
          filter: "drop-shadow(0 1cqw 2cqw rgba(0,0,0,.55))",
        }}
      />

      {/* Sem este véu o nome do arquétipo assenta sobre o ombro da pessoa. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-1"
        style={{
          height: "62cqw",
          backgroundImage:
            "linear-gradient(180deg, transparent 0%, rgba(15,26,12,.72) 26%, #0F1A0C 52%)",
        }}
      />

      <div
        className="absolute z-2 text-center"
        // Sem o nome o bloco encurta e desceria até encostar no rodapé.
        style={{ left: "6cqw", right: "6cqw", bottom: nome ? "17cqw" : "20cqw" }}
      >
        {arquetipo.time ? (
          <p
            className="inline-block border font-mono uppercase"
            style={{
              fontSize: "3cqw",
              letterSpacing: "0.22em",
              padding: "1.4cqw 3.4cqw",
              margin: "0 0 3cqw",
              color: corTime,
              borderColor: corTime,
              backgroundColor: "rgba(15,26,12,.5)",
            }}
          >
            {arquetipo.time}
          </p>
        ) : null}
        {arquetipo.raridade ? (
          <p
            className="text-mint font-mono"
            style={{ fontSize: "2.8cqw", letterSpacing: "0.28em", margin: 0 }}
          >
            {arquetipo.raridadeLabel} · {arquetipo.raridade}
          </p>
        ) : null}
        <p
          className="text-orange font-display uppercase"
          style={{
            // Pela maior palavra, não pelo nome: é ela que não tem onde quebrar.
            fontSize:
              maiorPalavra > 12
                ? "7.6cqw"
                : maiorPalavra > 10
                  ? "8.8cqw"
                  : maiorPalavra > 8
                    ? "10cqw"
                    : "11.4cqw",
            lineHeight: 0.94,
            letterSpacing: "-0.02em",
            textWrap: "balance",
            margin: "3cqw 0 0",
            textShadow: "0 0.6cqw 1.6cqw rgba(0,0,0,.55)",
          }}
        >
          {arquetipo.nome}
        </p>
        {nome ? (
          <p
            className="text-cream border-line-2 border-t font-mono"
            style={{
              fontSize: nome.length > 22 ? "3.2cqw" : "4cqw",
              letterSpacing: "0.16em",
              paddingTop: "3.6cqw",
              margin: "3.6cqw auto 0",
              maxWidth: "76cqw",
              overflowWrap: "anywhere",
            }}
          >
            {nome.toUpperCase()}
          </p>
        ) : null}
      </div>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-2"
        style={{
          height: "8cqw",
          opacity: 0.92,
          // Verde fixo: a faixa é grafismo da marca, não do time. Colorida pelo
          // arquétipo, a carta deixaria de se parecer com o XibéSec.
          backgroundImage: `url("${GRAFISMO_VERDE_DATA_URI}")`,
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
        }}
      />

      <div
        className="text-cream-3 absolute z-2 flex justify-between font-mono"
        style={{
          left: "6cqw",
          right: "6cqw",
          bottom: "10.5cqw",
          fontSize: "2.7cqw",
          letterSpacing: "0.12em",
        }}
      >
        <span>{copy.cartaRodapeEsquerda}</span>
        <span>{copy.cartaRodapeDireita}</span>
      </div>

      <span className="sr-only">
        {copy.cartaLabel}: {arquetipo.nome}
        {nome ? ` — ${nome}` : ""}
      </span>
    </div>
  );
}
