import type { CSSProperties } from "react";
import type { Arquetipo, QuizCopy } from "@/lib/content-types";
import {
  GRAFISMO_LARANJA_DATA_URI,
  GRAFISMO_VERDE_DATA_URI,
  LOGO_DATA_URI,
  MASCOTE_DATA_URI,
} from "./carta-assets";

/**
 * Recorte da foto sem borda: três máscaras empilhadas, e é isso que faz a
 * pessoa parecer parte da cena em vez de colada dentro de uma moldura.
 *
 * 1. elipse radial apaga as quatro bordas de uma vez;
 * 2. queda diagonal dissolve o ombro no ângulo em que o corpo sai do quadro;
 * 3. o topo desaparece, para o alto da cabeça não bater numa linha reta.
 *
 * Empilhadas em três elementos, não em `mask-image` com três camadas: máscaras
 * na mesma propriedade se sobrepõem por `mask-composite`, cujo suporte diverge
 * entre navegadores. Aninhar é o que se comporta igual em todos.
 */
const MASCARA_ELIPSE = "radial-gradient(ellipse 64% 86% at 50% 40%, #000 52%, transparent 82%)";
const MASCARA_BASE = "linear-gradient(200deg, #000 66%, transparent 100%)";
const MASCARA_TOPO = "linear-gradient(180deg, transparent 0%, #000 16%)";

/**
 * O mascote é figura inteira, não retrato: as três máscaras foram calibradas
 * para uma foto em que a cabeça sangra pela borda de cima, e aplicadas a ele
 * comiam a cabeça. Só a dissolução dos pés, que apoia a figura no chão da cena.
 */
const MASCARA_MASCOTE = "linear-gradient(180deg, #000 82%, transparent 100%)";

/**
 * Formato de story do Instagram e do WhatsApp: 9:16, tela cheia no celular.
 * O feed (4:5) recorta a carta pelas pontas; o story é onde ela é postada.
 */
export const CARTA_LARGURA = 1080;
export const CARTA_ALTURA = 1920;

export type CartaProps = {
  arquetipo: Arquetipo;
  nome: string;
  copy: QuizCopy;
  data: string;
  dominio: string;
  /** Ausente: o mascote. */
  foto?: string;
  /** Enquadramento da foto, em porcentagem do quadro. */
  fotoX?: number;
  fotoY?: number;
  fotoZoom?: number;
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
 * A carta do resultado, desenhada em DOM para ser fotografada por
 * `html-to-image` — a prévia na tela e o arquivo exportado são o mesmo nó, então
 * não existe a classe de bug em que os dois divergem.
 *
 * A composição é a mesma da home: cena de mata em contraluz ao fundo, véu de
 * leitura por cima, figura recortada com `drop-shadow` e faixa de grafismo
 * marajoara como régua. Sem a cena a carta vira um retângulo de gradiente, que
 * é exatamente o que a marca não é.
 *
 * Tudo é dimensionado em `cqw` sobre um container query: a mesma marcação serve
 * à prévia de 320px e à exportação de 1080px sem uma segunda tabela de posições.
 */
export function Carta({
  arquetipo,
  nome,
  copy,
  data,
  dominio,
  foto,
  fotoX = 50,
  fotoY = 20,
  fotoZoom = 1,
}: CartaProps) {
  const temFoto = Boolean(foto);
  const gerencial = arquetipo.trilha === "gerencial";

  return (
    <div
      data-carta
      className="bg-ink-deep relative isolate w-full overflow-hidden select-none"
      style={{ containerType: "inline-size", aspectRatio: `${CARTA_LARGURA} / ${CARTA_ALTURA}` }}
    >
      {/* Chão de cor, sem arte de fundo: com a foto de uma pessoa, a mata atrás
          vira uma segunda cena e as duas competem. O brilho em menta dá
          profundidade sem disputar com o retrato. */}
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
          // A foto ocupa a carta inteira em largura e mais da metade da altura:
          // é o assunto da peça, e o formato 9:16 dá espaço para isso.
          // O mascote fica mais estreito porque `contain` encaixa pela menor
          // dimensão — quadro largo demais o encolhe no meio do vazio.
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
            {/* `next/image` não serve aqui: ele embrulha a tag em wrapper com
                estilo próprio, e a foto da pessoa é um `blob:` local que não
                passa pelo otimizador. `html-to-image` precisa de uma <img>
                simples com a fonte já resolvida. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={foto ?? MASCOTE_DATA_URI}
              alt=""
              aria-hidden
              className="h-full w-full"
              style={{
                // `contain` para o mascote: ele é figura recortada e inteira, e
                // `cover` cortaria braço e martelo fora do quadro.
                objectFit: temFoto ? "cover" : "contain",
                // Ancorado acima do centro: cortar no meio decapita quem mandou
                // foto vertical de celular. O mascote fica pelos pés, apoiado no
                // chão da cena em vez de boiar no quadro.
                objectPosition: temFoto ? `${fotoX}% ${fotoY}%` : "center bottom",
                transform: temFoto && fotoZoom !== 1 ? `scale(${fotoZoom})` : undefined,
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

      {/* Uma faixa só, no fechamento. A segunda, atrás do bloco de texto,
          cruzava o nome do arquétipo e disputava a leitura com ele. */}
      {/* Véu local sob o texto: a foto desce até aqui, e sem ele o nome do
          arquétipo assenta sobre o ombro da pessoa. */}
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
        style={{ left: "6cqw", right: "6cqw", bottom: "17cqw" }}
      >
        <p
          className="text-mint font-mono"
          style={{ fontSize: "3.1cqw", letterSpacing: "0.28em", margin: 0 }}
        >
          {arquetipo.sigla || "XBS"} · {gerencial ? "TRILHA GERENCIAL" : "TRILHA TÉCNICA"}
        </p>
        <p
          className="text-orange font-display uppercase"
          style={{
            // Três degraus: "Desmontador" (11) cabe grande em uma linha,
            // "Arquiteta de Caos" (17) quebra em duas, "Engenheira de
            // Confiança" (23) precisa do menor corpo para não tocar as bordas.
            fontSize:
              arquetipo.nome.length > 20
                ? "8.6cqw"
                : arquetipo.nome.length > 12
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
            className="text-cream border-line-2 font-mono border-t"
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
          backgroundImage: `url("${gerencial ? GRAFISMO_LARANJA_DATA_URI : GRAFISMO_VERDE_DATA_URI}")`,
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
        }}
      />

      <div
        className="text-cream-3 font-mono absolute z-2 flex justify-between"
        style={{
          left: "6cqw",
          right: "6cqw",
          bottom: "10.5cqw",
          fontSize: "2.7cqw",
          letterSpacing: "0.12em",
        }}
      >
        <span>{dominio}</span>
        <span>{data}</span>
      </div>

      <span className="sr-only">
        {copy.cartaLabel}: {arquetipo.nome}
        {nome ? ` — ${nome}` : ""}
      </span>
    </div>
  );
}
