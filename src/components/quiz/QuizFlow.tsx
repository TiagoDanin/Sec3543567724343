"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { EVENTOS } from "@/lib/analytics";
import { evento } from "@/lib/analytics-client";
import { apurar, type Arquetipo, type Quiz } from "@/lib/content-types";
import { semAssinatura } from "@/lib/exportar-carta";
import { normalizarNome } from "@/lib/nome";
import { conexaoEconomica, precarregarRecorte } from "@/lib/recorte-fundo";
import { Button } from "@/components/primitives/Button";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Resultado } from "./Resultado";

export type QuizFlowProps = {
  quiz: Quiz;
  dominio: string;
  ctaHref: string;
  ctaTarget?: "_blank";
  ctaRel?: "noopener";
};

type Etapa = "abertura" | "perguntas" | "resultado";

/** Guardam o resultado na URL para a pessoa reabrir e reenviar o link. */
const PARAM = "r";
const PARAM_NOME = "n";

/**
 * `useSyncExternalStore` e não efeito com `setState`, barrado pela regra
 * `react-hooks/set-state-in-effect`. Sem assinatura: `replaceState` não emite
 * evento, e o único leitor é o primeiro render.
 */
function useParametroDaUrl(chave: string): string {
  // O snapshot precisa ser estável entre renders, senão o React relê em laço.
  const ler = useCallback(
    () => new URLSearchParams(window.location.search).get(chave) ?? "",
    [chave],
  );

  return useSyncExternalStore(semAssinatura, ler, VAZIO);
}

const VAZIO = () => "";

export function QuizFlow({ quiz, dominio, ctaHref, ctaTarget, ctaRel }: QuizFlowProps) {
  const { copy, perguntas, arquetipos } = quiz;

  const [nomeDigitado, setNome] = useState("");
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});

  // Estado local do quiz respondido aqui e agora. Enquanto for `null`, a etapa
  // pode vir da URL — é o que faz `?r=slug` abrir direto no resultado.
  const [apurado, setApurado] = useState<Arquetipo | null>(null);
  const [comecou, setComecou] = useState(false);

  const slug = useParametroDaUrl(PARAM);
  const nomeDaUrl = useParametroDaUrl(PARAM_NOME);
  const daUrl = arquetipos.find((item) => item.slug === slug) ?? null;

  // Recarregar mantém o nome: sem isso a carta reaberta perde quem é a pessoa.
  const nome = normalizarNome(nomeDigitado || (comecou ? "" : nomeDaUrl));
  const arquetipo = apurado ?? (comecou ? null : daUrl);
  const etapa: Etapa = arquetipo ? "resultado" : comecou ? "perguntas" : "abertura";

  const tituloRef = useRef<HTMLHeadingElement>(null);

  // Na abertura, para o download ter as sete perguntas de vantagem. Em conexão
  // econômica não começa: são dados do plano de alguém.
  useEffect(() => {
    if (!conexaoEconomica()) void precarregarRecorte();
  }, []);

  // Sem mover o foco, o leitor de tela nunca sai da pergunta anterior.
  useEffect(() => {
    if (etapa !== "abertura") tituloRef.current?.focus();
  }, [etapa, indice]);

  const responder = useCallback(
    (chavePergunta: string, chaveAlternativa: string) => {
      const atualizado = { ...respostas, [chavePergunta]: chaveAlternativa };
      setRespostas(atualizado);

      // A posição, não a alternativa: é o funil que interessa, e a resposta é
      // da pessoa. Sem isto não dá para saber em que pergunta o quiz perde.
      evento(EVENTOS.quizProgresso, { posicao: indice + 1, total: perguntas.length });

      if (indice + 1 < perguntas.length) {
        setIndice(indice + 1);
        return;
      }

      const vencedor = apurar(atualizado, perguntas, arquetipos);
      setApurado(vencedor);

      if (vencedor) {
        evento(EVENTOS.quizConcluido, { arquetipo: vencedor.slug });
        const url = new URL(window.location.href);
        url.searchParams.set(PARAM, vencedor.slug);
        if (nomeDigitado) url.searchParams.set(PARAM_NOME, nomeDigitado);
        window.history.replaceState(null, "", url);
      }
    },
    [respostas, indice, perguntas, arquetipos, nomeDigitado],
  );

  const refazer = useCallback(() => {
    evento(EVENTOS.quizIniciado, { refazendo: true });
    setRespostas({});
    setIndice(0);
    setApurado(null);
    setComecou(true);

    const url = new URL(window.location.href);
    url.searchParams.delete(PARAM);
    url.searchParams.delete(PARAM_NOME);
    window.history.replaceState(null, "", url);
  }, []);

  const etapaAtual = () => {
    if (etapa === "abertura") {
      return (
        <form
          className="max-w-xl"
          onSubmit={(event) => {
            event.preventDefault();
            evento(EVENTOS.quizIniciado);
            setComecou(true);
          }}
        >
          <label
            htmlFor="quiz-nome"
            className="text-cream block font-mono text-[12px] tracking-[0.18em] uppercase"
          >
            {copy.nomeLabel}
          </label>
          <input
            id="quiz-nome"
            name="nome"
            type="text"
            value={nomeDigitado}
            maxLength={28}
            autoComplete="name"
            placeholder={copy.nomePlaceholder}
            onChange={(event) => setNome(event.target.value)}
            className="border-line-2 bg-ink-deep text-cream placeholder:text-cream-3 focus-visible:border-mint mt-3 w-full border px-4 py-3.5 text-[17px] outline-none"
          />
          <p className="text-cream-3 mt-3 text-[14px] leading-[1.6]">{copy.nomeAjuda}</p>
          <Button type="submit" size="lg" className="mt-7" arrow>
            {copy.ctaComecar}
          </Button>
        </form>
      );
    }

    if (etapa === "perguntas") {
      const pergunta = perguntas[indice];
      if (!pergunta) return null;

      const total = perguntas.length;
      const posicao = indice + 1;

      return (
        <div className="max-w-2xl">
          <div className="flex items-center gap-4">
            <span className="text-mint font-mono text-[11px] tracking-[0.24em] uppercase">
              {copy.progressoPrefixo} {posicao}/{total}
            </span>
            <span aria-hidden className="border-line-2 flex h-px flex-1 gap-1 border-t-0">
              <span className="bg-line-2 relative h-px w-full">
                <span
                  className="bg-mint absolute inset-y-0 left-0 transition-[width] duration-500"
                  style={{ width: `${(posicao / total) * 100}%` }}
                />
              </span>
            </span>
          </div>

          <fieldset className="mt-7 border-0 p-0">
            <legend className="contents">
              <h2
                ref={tituloRef}
                tabIndex={-1}
                className="font-display text-cream text-[clamp(26px,4.2vw,40px)] leading-[1.12] tracking-[-0.015em] text-balance outline-none"
              >
                {pergunta.enunciado}
              </h2>
            </legend>

            <div className="mt-7 grid gap-px">
              {pergunta.alternativas.map((alternativa) => {
                const id = `${pergunta.chave}-${alternativa.chave}`;
                return (
                  <div key={alternativa.chave} className="relative">
                    <input
                      type="radio"
                      id={id}
                      name={pergunta.chave}
                      value={alternativa.chave}
                      checked={respostas[pergunta.chave] === alternativa.chave}
                      onChange={() => responder(pergunta.chave, alternativa.chave)}
                      className="peer absolute h-px w-px overflow-hidden opacity-0"
                    />
                    <label
                      htmlFor={id}
                      className="border-line bg-panel text-cream-2 hover:border-mint hover:text-cream peer-checked:border-mint peer-checked:text-cream peer-focus-visible:outline-mint block cursor-pointer border px-5 py-4.5 text-[18px] leading-[1.45] transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2"
                    >
                      {alternativa.texto}
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>

          {indice > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="mt-7"
              onClick={() => {
                evento(EVENTOS.quizVoltou, { posicao });
                setIndice(indice - 1);
              }}
            >
              {copy.ctaVoltar}
            </Button>
          ) : null}
        </div>
      );
    }

    if (!arquetipo) return null;

    return (
      <Resultado
        ref={tituloRef}
        arquetipo={arquetipo}
        nome={nome}
        copy={copy}
        dominio={dominio}
        onRefazer={refazer}
        ctaHref={ctaHref}
        ctaTarget={ctaTarget}
        ctaRel={ctaRel}
      />
    );
  };

  return (
    <>
      {/* No resultado o cabeçalho encolhe para o título: quem chegou até aqui
          já leu a chamada, e a carta é o que precisa caber na tela. */}
      <Section className={etapa === "resultado" ? "pt-6 pb-6" : "pt-(--nav-h) pb-(--sec-y-tight)"}>
        <Container>
          <p className="text-orange font-mono text-[11px] tracking-[0.24em] uppercase">
            {copy.eyebrow}
          </p>
          <h1 className="font-display text-cream mt-5 max-w-4xl text-[clamp(30px,6vw,60px)] leading-[1.02] tracking-[-0.02em] text-balance uppercase">
            {copy.titulo}
          </h1>

          {etapa === "resultado" ? null : (
            <>
              <p className="text-cream-2 mt-6 max-w-2xl text-[17px] leading-[1.65]">{copy.lede}</p>

              <noscript>
                <div className="border-orange bg-panel mt-9 max-w-2xl border-l-2 px-5 py-4">
                  <p className="text-orange font-mono text-[10px] tracking-[0.2em] uppercase">
                    {copy.semJsTitulo}
                  </p>
                  <p className="text-cream-2 mt-2 text-[15px] leading-[1.6]">{copy.semJsTexto}</p>
                </div>
              </noscript>
            </>
          )}
        </Container>
      </Section>

      <Section variant="panel">
        <Container>{etapaAtual()}</Container>
      </Section>
    </>
  );
}
