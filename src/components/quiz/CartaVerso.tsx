import type { Arquetipo, QuizCopy } from "@/lib/content-types";
import { GRAFISMO_VERDE_DATA_URI, LOGO_DATA_URI } from "./carta-assets";
import { CARTA_ALTURA, CARTA_LARGURA, COR_DO_TIME } from "./Carta";

export type CartaVersoProps = {
  arquetipo: Arquetipo;
  nome: string;
  copy: QuizCopy;
};

/**
 * O verso da carta. Sem foto: o espaço que a pessoa ocupa na frente é onde a
 * piada cabe, e é isso que faz valer a pena postar os dois lados.
 */
export function CartaVerso({ arquetipo, nome, copy }: CartaVersoProps) {
  const corTime = COR_DO_TIME[arquetipo.timeCor] ?? COR_DO_TIME.blue;
  const maiorPalavra = Math.max(...arquetipo.nome.split(" ").map((p) => p.length));

  const ficha = [
    [copy.resultadoAreaLabel, arquetipo.area],
    [copy.resultadoFerramentaLabel, arquetipo.ferramenta],
    [copy.resultadoTimeLabel, arquetipo.timePapel],
  ].filter(([, valor]) => valor);

  return (
    <div
      data-carta-verso
      className="bg-ink-deep relative isolate w-full overflow-hidden select-none"
      style={{ containerType: "inline-size", aspectRatio: `${CARTA_LARGURA} / ${CARTA_ALTURA}` }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(70% 40% at 50% 30%, rgba(79,227,172,.12), transparent 72%), linear-gradient(178deg, #1B2E15 0%, #152310 46%, #0F1A0C 100%)",
        }}
      />

      {/* Coluna única em fluxo: com blocos absolutos, o texto de tamanho
          variável abria vão morto no meio e encavalava o logo. */}
      <div
        className="absolute z-2 flex flex-col justify-between"
        style={{ left: "8cqw", right: "8cqw", top: "8cqw", bottom: "19cqw" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_DATA_URI}
          alt=""
          aria-hidden
          style={{
            width: "34cqw",
            alignSelf: "center",
            margin: "0 0 9cqw",
            filter: "drop-shadow(0 1cqw 2cqw rgba(0,0,0,.55))",
          }}
        />

        <div>
          <p
            className="text-cream font-display uppercase"
            style={{
              fontSize: maiorPalavra > 12 ? "6cqw" : "7.2cqw",
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
              margin: 0,
              textWrap: "balance",
            }}
          >
            {arquetipo.nome}
          </p>

          <p
            className="font-mono uppercase"
            style={{
              fontSize: "2.6cqw",
              letterSpacing: "0.22em",
              margin: "2.6cqw 0 0",
              color: corTime,
            }}
          >
            {arquetipo.time}
          </p>

          {/* A piada é o motivo de existir o verso, e fica no ponto mais alto da
            leitura. Menor que o nome: ali quem manda é o arquétipo. */}
          <p
            className="text-orange font-display"
            style={{
              fontSize: "4.6cqw",
              lineHeight: 1.2,
              margin: "7cqw 0 0",
              textWrap: "balance",
            }}
          >
            {arquetipo.resumo}
          </p>

          <p
            className="text-cream-2"
            style={{ fontSize: "3.2cqw", lineHeight: 1.6, margin: "5cqw 0 0" }}
          >
            {arquetipo.texto}
          </p>
        </div>

        <div className="border-line-2 grid border-t" style={{ gap: "2.8cqw", paddingTop: "5cqw" }}>
          {ficha.map(([rotulo, valor]) => (
            <div key={rotulo} className="flex justify-between" style={{ gap: "4cqw" }}>
              <span
                className="text-cream-3 font-mono uppercase"
                style={{ fontSize: "2.3cqw", letterSpacing: "0.18em", flexShrink: 0 }}
              >
                {rotulo}
              </span>
              <span
                className="text-cream text-right"
                style={{ fontSize: "2.7cqw", lineHeight: 1.3 }}
              >
                {valor}
              </span>
            </div>
          ))}
        </div>

        {nome ? (
          <p
            className="text-cream border-line-2 border-t text-center font-mono"
            style={{
              fontSize: nome.length > 22 ? "2.8cqw" : "3.4cqw",
              letterSpacing: "0.16em",
              paddingTop: "4cqw",
              margin: "4cqw 0 0",
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
          bottom: "9.6cqw",
          fontSize: "2.7cqw",
          letterSpacing: "0.12em",
        }}
      >
        <span>{copy.cartaRodapeEsquerda}</span>
        <span>{copy.cartaRodapeDireita}</span>
      </div>
    </div>
  );
}
