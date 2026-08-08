"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { apurar, type Arquetipo, type Quiz } from "@/lib/content-types";
import { semAssinatura } from "@/lib/exportar-carta";
import { Button } from "@/components/primitives/Button";
import { Resultado } from "./Resultado";

export type QuizFlowProps = {
  quiz: Quiz;
  data: string;
  dominio: string;
  ctaHref: string;
  ctaTarget?: "_blank";
  ctaRel?: "noopener";
};

type Etapa = "abertura" | "perguntas" | "resultado";

/** Guarda o resultado na URL para a pessoa reabrir e reenviar o link. */
const PARAM = "r";

/**
 * Slug pedido na URL, ou vazio no servidor.
 *
 * `useSyncExternalStore` e não efeito com `setState`: o ESLint 9 barra o
 * segundo (`react-hooks/set-state-in-effect`), e é a via sancionada para ler
 * algo que só existe no cliente sem divergir da hidratação. Sem assinatura —
 * `replaceState` não emite evento, e o único leitor é o primeiro render.
 */
function useSlugDaUrl(): string {
  return useSyncExternalStore(
    semAssinatura,
    () => new URLSearchParams(window.location.search).get(PARAM) ?? "",
    () => "",
  );
}

export function QuizFlow({ quiz, data, dominio, ctaHref, ctaTarget, ctaRel }: QuizFlowProps) {
  const { copy, perguntas, arquetipos } = quiz;

  const [nome, setNome] = useState("");
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});

  // Estado local do quiz respondido aqui e agora. Enquanto for `null`, a etapa
  // pode vir da URL — é o que faz `?r=slug` abrir direto no resultado.
  const [apurado, setApurado] = useState<Arquetipo | null>(null);
  const [comecou, setComecou] = useState(false);

  const slug = useSlugDaUrl();
  const daUrl = arquetipos.find((item) => item.slug === slug) ?? null;

  const arquetipo = apurado ?? (comecou ? null : daUrl);
  const etapa: Etapa = arquetipo ? "resultado" : comecou ? "perguntas" : "abertura";

  const tituloRef = useRef<HTMLHeadingElement>(null);

  // O foco precisa acompanhar a troca de tela: sem isso o teclado continua no
  // botão que sumiu, e o leitor de tela nunca sai da pergunta anterior.
  useEffect(() => {
    if (etapa !== "abertura") tituloRef.current?.focus();
  }, [etapa, indice]);

  const responder = useCallback(
    (chavePergunta: string, chaveAlternativa: string) => {
      const atualizado = { ...respostas, [chavePergunta]: chaveAlternativa };
      setRespostas(atualizado);

      if (indice + 1 < perguntas.length) {
        setIndice(indice + 1);
        return;
      }

      const vencedor = apurar(atualizado, perguntas, arquetipos);
      setApurado(vencedor);

      if (vencedor) {
        const url = new URL(window.location.href);
        url.searchParams.set(PARAM, vencedor.slug);
        window.history.replaceState(null, "", url);
      }
    },
    [respostas, indice, perguntas, arquetipos],
  );

  const refazer = useCallback(() => {
    setRespostas({});
    setIndice(0);
    setApurado(null);
    setComecou(true);

    const url = new URL(window.location.href);
    url.searchParams.delete(PARAM);
    window.history.replaceState(null, "", url);
  }, []);

  if (etapa === "abertura") {
    return (
      <form
        className="max-w-xl"
        onSubmit={(event) => {
          event.preventDefault();
          setComecou(true);
        }}
      >
        <label htmlFor="quiz-nome" className="text-cream font-mono block text-[12px] tracking-[0.18em] uppercase">
          {copy.nomeLabel}
        </label>
        <input
          id="quiz-nome"
          name="nome"
          type="text"
          value={nome}
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
              className="font-display text-cream text-[clamp(22px,3.4vw,32px)] leading-[1.16] tracking-[-0.01em] outline-none"
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
                    className="border-line bg-panel text-cream-2 hover:border-mint hover:text-cream peer-checked:border-mint peer-checked:text-cream peer-focus-visible:outline-mint block cursor-pointer border px-5 py-4 text-[16px] leading-[1.5] transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2"
                  >
                    {alternativa.texto}
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>

        {indice > 0 ? (
          <Button variant="ghost" size="sm" className="mt-7" onClick={() => setIndice(indice - 1)}>
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
      data={data}
      dominio={dominio}
      onRefazer={refazer}
      ctaHref={ctaHref}
      ctaTarget={ctaTarget}
      ctaRel={ctaRel}
    />
  );
}
