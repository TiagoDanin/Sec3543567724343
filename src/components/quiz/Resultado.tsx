"use client";

import { forwardRef, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { EVENTOS, evento } from "@/lib/analytics";
import type { Arquetipo, QuizCopy } from "@/lib/content-types";
import {
  baixar,
  compartilhar,
  gerarCarta,
  isWebKitRestrito,
  podeCompartilhar,
  semAssinatura,
} from "@/lib/exportar-carta";
import {
  type EstadoRecorte,
  estadoRecorte,
  ouvirRecorte,
  recortarFundo,
} from "@/lib/recorte-fundo";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";
import { Carta, COR_DO_TIME } from "./Carta";
import { CartaVerso } from "./CartaVerso";

/** Snapshot de servidor estável: recriar o objeto a cada render faz laço. */
const OCIOSO: EstadoRecorte = { fase: "ocioso" };

/** Limites do enquadramento. Roda, pinça e a barra compartilham a mesma escala. */
const ZOOM_MIN = 1;
const ZOOM_MAX = 2.2;

const limitar = (valor: number, min: number, max: number) => Math.min(max, Math.max(min, valor));

/** Troca `{chave}` pelos valores. Token sem valor sai do texto. */
function interpolar(modelo: string, valores: Record<string, string>): string {
  return modelo.replace(/\{(\w+)\}/g, (_, chave: string) => valores[chave] ?? "");
}

export type ResultadoProps = {
  arquetipo: Arquetipo;
  nome: string;
  copy: QuizCopy;
  dominio: string;
  onRefazer: () => void;
  ctaHref: string;
  ctaTarget?: "_blank";
  ctaRel?: "noopener";
};

type Estado = "pronto" | "gerando" | "erro";

export const Resultado = forwardRef<HTMLHeadingElement, ResultadoProps>(function Resultado(
  { arquetipo, nome, copy, dominio, onRefazer, ctaHref, ctaTarget, ctaRel },
  ref,
) {
  const cartaRef = useRef<HTMLDivElement>(null);
  const versoRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [foto, setFoto] = useState<string | undefined>();
  const [fotoFundo, setFotoFundo] = useState<string | undefined>();
  const [posicao, setPosicao] = useState({ x: 50, y: 20 });
  const [zoom, setZoom] = useState(1);
  const [estado, setEstado] = useState<Estado>("pronto");
  const [virada, setVirada] = useState(false);

  // Guardado para reprocessar se o recorte for ligado depois da escolha.
  const originalRef = useRef<File | null>(null);
  const [recortar, setRecortar] = useState(true);
  const [recortando, setRecortando] = useState(false);

  const corTime = COR_DO_TIME[arquetipo.timeCor] ?? COR_DO_TIME.blue;

  const recorte = useSyncExternalStore(ouvirRecorte, estadoRecorte, () => OCIOSO);
  const recorteDisponivel = recorte.fase === "pronto";

  // O HTML estático é o mesmo para todos: o aviso nasce oculto e aparece no
  // primeiro quadro de cliente.
  const webkit = useSyncExternalStore(semAssinatura, isWebKitRestrito, () => false);

  // A troca revoga a URL anterior dentro do próprio `setFoto`; aqui fica só a
  // última, ao desmontar. Por ref, senão a dependência revogaria a URL em uso.
  const fotoRef = useRef<string | undefined>(undefined);
  const fundoRef = useRef<string | undefined>(undefined);
  fotoRef.current = foto;
  fundoRef.current = fotoFundo;

  useEffect(() => {
    return () => {
      if (fotoRef.current) URL.revokeObjectURL(fotoRef.current);
      if (fundoRef.current) URL.revokeObjectURL(fundoRef.current);
    };
  }, []);

  /** Mostra a foto na hora e troca pela recortada quando ela ficar pronta. */
  const aplicarFoto = useCallback(async (arquivo: File, comRecorte: boolean) => {
    const original = URL.createObjectURL(arquivo);

    setFoto((anterior) => {
      if (anterior) URL.revokeObjectURL(anterior);
      return original;
    });
    setFotoFundo((anterior) => {
      if (anterior) URL.revokeObjectURL(anterior);
      return undefined;
    });

    if (!comRecorte) return;

    setRecortando(true);
    const recortada = await recortarFundo(arquivo);
    setRecortando(false);

    if (!recortada) return;

    // A original não é revogada: vira a camada de trás, a meia opacidade.
    setFoto(URL.createObjectURL(recortada));
    setFotoFundo(original);
  }, []);

  const escolherFoto = useCallback(
    (arquivo: File | undefined) => {
      if (!arquivo) return;

      evento(EVENTOS.quizFotoEnviada, { comRecorte: recortar && recorteDisponivel });

      originalRef.current = arquivo;
      setPosicao({ x: 50, y: 20 });
      setZoom(1);
      void aplicarFoto(arquivo, recortar && recorteDisponivel);
    },
    [aplicarFoto, recortar, recorteDisponivel],
  );

  /** Religar o recorte reprocessa a foto que já está na carta. */
  const alternarRecorte = useCallback(
    (ligado: boolean) => {
      setRecortar(ligado);
      const original = originalRef.current;
      if (original) void aplicarFoto(original, ligado && recorteDisponivel);
    },
    [aplicarFoto, recorteDisponivel],
  );

  const removerFoto = useCallback(() => {
    setFoto((anterior) => {
      if (anterior) URL.revokeObjectURL(anterior);
      return undefined;
    });
    setFotoFundo((anterior) => {
      if (anterior) URL.revokeObjectURL(anterior);
      return undefined;
    });
    originalRef.current = null;
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  /**
   * Ponteiros ativos sobre a carta. Um arrasta; dois viram pinça, e é por isso
   * que a lista mora fora do handler: o segundo dedo chega num evento próprio.
   */
  const ponteirosRef = useRef(new Map<number, { x: number; y: number }>());
  const pincaRef = useRef<{ distancia: number; zoom: number } | null>(null);

  /** Valor corrente do gesto, fora do React: o estado só recebe ao soltar. */
  const vivoRef = useRef({ x: 50, y: 20, zoom: 1 });
  const quadroRef = useRef(0);

  const pintar = useCallback(() => {
    quadroRef.current = 0;
    const no = cartaRef.current?.querySelector<HTMLElement>("[data-carta]");
    if (!no) return;

    const { x, y, zoom: z } = vivoRef.current;
    no.style.setProperty("--foto-x", `${x}%`);
    no.style.setProperty("--foto-y", `${y}%`);
    no.style.setProperty("--foto-zoom", String(z));
  }, []);

  /** Um repinte por quadro: `pointermove` dispara mais rápido que o vsync. */
  const agendar = useCallback(() => {
    if (quadroRef.current) return;
    quadroRef.current = requestAnimationFrame(pintar);
  }, [pintar]);

  // A barra e o refazer escrevem no estado; sem isto o gesto seguinte partiria
  // do valor que o ref guardou da última vez.
  useEffect(() => {
    vivoRef.current = { x: posicao.x, y: posicao.y, zoom };
  }, [posicao, zoom]);

  const arrastar = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const alvo = event.currentTarget;
      alvo.setPointerCapture(event.pointerId);

      const ponteiros = ponteirosRef.current;
      ponteiros.set(event.pointerId, { x: event.clientX, y: event.clientY });

      vivoRef.current = { ...posicao, zoom };

      const inicio = { px: event.clientX, py: event.clientY, ...posicao };
      const caixa = alvo.getBoundingClientRect();

      const separacao = () => {
        const [a, b] = [...ponteiros.values()];
        return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
      };

      if (ponteiros.size === 2) {
        pincaRef.current = { distancia: separacao(), zoom: vivoRef.current.zoom };
      }

      const mover = (e: PointerEvent) => {
        if (!ponteiros.has(e.pointerId)) return;
        ponteiros.set(e.pointerId, { x: e.clientX, y: e.clientY });

        // Dois dedos: a distância entre eles vira escala, e o arrasto para —
        // senão o enquadramento foge junto com a pinça.
        if (ponteiros.size === 2 && pincaRef.current) {
          const atual = separacao();
          if (atual > 0) {
            const razao = atual / pincaRef.current.distancia;
            vivoRef.current.zoom = limitar(pincaRef.current.zoom * razao, ZOOM_MIN, ZOOM_MAX);
            agendar();
          }
          return;
        }

        const dx = ((e.clientX - inicio.px) / caixa.width) * 100;
        const dy = ((e.clientY - inicio.py) / caixa.height) * 100;

        vivoRef.current.x = limitar(inicio.x - dx, 0, 100);
        vivoRef.current.y = limitar(inicio.y - dy, 0, 100);
        agendar();
      };

      const soltar = (e: PointerEvent) => {
        ponteiros.delete(e.pointerId);
        if (ponteiros.size < 2) pincaRef.current = null;
        if (ponteiros.size > 0) return;

        alvo.removeEventListener("pointermove", mover);
        alvo.removeEventListener("pointerup", soltar);
        alvo.removeEventListener("pointercancel", soltar);

        if (quadroRef.current) {
          cancelAnimationFrame(quadroRef.current);
          quadroRef.current = 0;
        }

        // O React reassume só agora: durante o gesto ele reconstruiria as
        // máscaras a cada evento, e é isso que engasgava.
        const { x, y, zoom: z } = vivoRef.current;
        setPosicao({ x, y });
        setZoom(z);
      };

      alvo.addEventListener("pointermove", mover);
      alvo.addEventListener("pointerup", soltar);
      alvo.addEventListener("pointercancel", soltar);
    },
    [posicao, zoom, agendar],
  );

  /**
   * Roda e pinça de trackpad, em listener nativo: o React anexa `wheel` como
   * passivo, e ali `preventDefault` é ignorado — a página rolaria junto.
   *
   * A pinça de trackpad chega como `wheel` com `ctrlKey`, convenção que todo
   * navegador segue e que nenhum atalho de teclado dispara sobre a carta.
   */
  useEffect(() => {
    const alvo = cartaRef.current;
    if (!alvo) return;

    let repousar: ReturnType<typeof setTimeout>;

    const aoRolar = (event: WheelEvent) => {
      if (virada) return;
      event.preventDefault();

      // `deltaMode` 1 conta linhas, não pixels: sem normalizar, o Firefox salta.
      const bruto = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      // A pinça já vem em passos finos; a roda precisa de mais ganho por clique.
      const fator = event.ctrlKey ? 0.01 : 0.002;

      vivoRef.current.zoom = limitar(vivoRef.current.zoom - bruto * fator, ZOOM_MIN, ZOOM_MAX);
      agendar();

      // O gesto não tem "soltar": o estado entra quando a roda para.
      clearTimeout(repousar);
      repousar = setTimeout(() => setZoom(vivoRef.current.zoom), 140);
    };

    alvo.addEventListener("wheel", aoRolar, { passive: false });
    return () => {
      clearTimeout(repousar);
      alvo.removeEventListener("wheel", aoRolar);
    };
  }, [virada, agendar]);

  const [desafioCopiado, setDesafioCopiado] = useState(false);

  /**
   * O laço que traz gente nova: copia um texto pronto com o link do resultado,
   * para colar no grupo. `share` nativo quando existe; área de transferência no
   * desktop, onde a folha de compartilhamento não aceita texto.
   */
  const desafiar = useCallback(async () => {
    // Link limpo: com `?r=` e `?n=` o desafiado abriria a carta de quem o
    // desafiou, em vez de responder o quiz.
    const url = typeof window === "undefined" ? "" : window.location.href.split("?")[0];

    const texto = interpolar(copy.desafioTexto, {
      arquetipo: arquetipo.nome,
      raridade: arquetipo.raridade,
      url,
    });

    // `navigator.share` existe no Chrome de desktop e abre uma folha que quase
    // ninguém usa; no celular é o caminho direto para o WhatsApp. Daí a checagem
    // de toque, e não de existência da API.
    const noCelular =
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      navigator.maxTouchPoints > 0;

    try {
      if (noCelular) {
        await navigator.share({ text: texto });
        evento(EVENTOS.quizCompartilhado, { arquetipo: arquetipo.slug, via: "desafio" });
        return;
      }
      await navigator.clipboard.writeText(texto);
      evento(EVENTOS.quizCompartilhado, { arquetipo: arquetipo.slug, via: "desafio-copia" });
      setDesafioCopiado(true);
    } catch {
      // Cancelar a folha ou negar a permissão não merece mensagem de erro.
    }
  }, [arquetipo, copy.desafioTexto]);

  const exportar = useCallback(
    async (modo: "baixar" | "compartilhar") => {
      const frente = cartaRef.current;
      const verso = versoRef.current;
      if (!frente || !verso) return;

      setEstado("gerando");

      try {
        if (modo === "compartilhar") {
          // A face em foco, não as duas: compartilhar é um gesto único, e
          // mandar dois arquivos deixa a pessoa escolher na hora errada.
          const node = virada ? verso : frente;
          const sufixo = virada ? "-verso" : "";
          const arquivo = `xibesec-${arquetipo.slug}${sufixo}.png`;
          const blob = await gerarCarta(node);
          const file = new File([blob], arquivo, { type: "image/png" });

          if (podeCompartilhar(file)) {
            const texto = interpolar(copy.compartilharTexto, {
              resumo: arquetipo.resumo,
              arquetipo: arquetipo.nome,
              url: dominio,
            });
            await compartilhar(file, arquetipo.nome, texto);
            evento(EVENTOS.quizCompartilhado, {
              arquetipo: arquetipo.slug,
              via: "arquivo",
              face: virada ? "verso" : "frente",
            });
          } else {
            baixar(blob, arquivo);
            evento(EVENTOS.quizCartaBaixada, { arquetipo: arquetipo.slug });
          }
        } else {
          // Baixar leva as duas faces: é o caso em que a pessoa quer o par
          // inteiro para montar o carrossel depois.
          baixar(await gerarCarta(frente), `xibesec-${arquetipo.slug}.png`);
          baixar(await gerarCarta(verso), `xibesec-${arquetipo.slug}-verso.png`);
          evento(EVENTOS.quizCartaBaixada, { arquetipo: arquetipo.slug, faces: 2 });
        }

        setEstado("pronto");
      } catch (erro) {
        // Cancelar a folha de compartilhamento rejeita a promessa, mas não é falha.
        if (erro instanceof DOMException && erro.name === "AbortError") {
          setEstado("pronto");
          return;
        }
        if (process.env.NODE_ENV !== "production") console.error("[exportar]", erro);
        setEstado("erro");
      }
    },
    [arquetipo, dominio, copy.compartilharTexto, virada],
  );

  const ocupado = estado === "gerando";

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:gap-14">
      <div>
        {/* As duas faces ficam montadas o tempo todo: `html-to-image` não
            fotografa nó ausente, e o verso precisa estar no DOM para exportar
            sem a pessoa ter que virar a carta antes. */}
        <div style={{ perspective: "1600px" }}>
          <div
            className="ease-brand relative transition-transform duration-700 motion-reduce:transition-none"
            style={{
              transformStyle: "preserve-3d",
              transform: virada ? "rotateY(180deg)" : undefined,
            }}
          >
            <div
              ref={cartaRef}
              onPointerDown={virada ? undefined : arrastar}
              // Sem foto o alvo é o seletor: a carta inteira vira o botão de
              // enviar, que é o gesto que a pessoa tenta antes de achar o texto.
              onClick={!foto && !virada ? () => inputRef.current?.click() : undefined}
              style={{ backfaceVisibility: "hidden" }}
              className={cn(
                !virada && "touch-none select-none",
                foto && !virada && "cursor-grab active:cursor-grabbing",
                !foto && !virada && "cursor-pointer",
              )}
            >
              <Carta
                arquetipo={arquetipo}
                nome={nome}
                copy={copy}
                foto={foto}
                fotoFundo={fotoFundo}
                fotoX={posicao.x}
                fotoY={posicao.y}
                fotoZoom={zoom}
              />
            </div>

            <div
              ref={versoRef}
              className="absolute inset-0"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <CartaVerso arquetipo={arquetipo} nome={nome} copy={copy} />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={() => setVirada((v) => !v)}>
            {virada ? copy.verFrente : copy.verVerso}
          </Button>
          {!virada ? (
            <Button variant="ghost" size="sm" onClick={() => inputRef.current?.click()}>
              {copy.fotoTrocar}
            </Button>
          ) : null}
          {foto && !virada ? (
            <Button variant="ghost" size="sm" onClick={removerFoto}>
              {copy.fotoRemover}
            </Button>
          ) : null}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => escolherFoto(event.target.files?.[0])}
        />

        {recorte.fase !== "indisponivel" ? (
          <div className="mt-5">
            {/* `py-2` no rótulo: o quadrado sozinho não dá alvo de toque. */}
            <label className="flex cursor-pointer items-start gap-3 py-2">
              <input
                type="checkbox"
                checked={recortar}
                disabled={!recorteDisponivel}
                onChange={(event) => alternarRecorte(event.target.checked)}
                className="accent-mint mt-[3px] size-[18px] shrink-0 disabled:cursor-not-allowed"
              />
              <span className="text-cream-2 text-[14px] leading-[1.55]">
                {copy.recorteLabel}
                {recorte.fase === "baixando" ? (
                  <span className="text-cream-3 mt-1 block font-mono text-[11px] tracking-[0.12em] uppercase">
                    {copy.recorteBaixando} {Math.round(recorte.progresso * 100)}%
                  </span>
                ) : null}
                {recortando ? (
                  <span className="text-mint mt-1 block font-mono text-[11px] tracking-[0.12em] uppercase">
                    {copy.recorteProcessando}
                  </span>
                ) : null}
              </span>
            </label>

            {recorte.fase === "baixando" ? (
              <div aria-hidden className="bg-line-2 mt-2 h-px w-full">
                <div
                  className="bg-mint h-px transition-[width] duration-300"
                  style={{ width: `${Math.round(recorte.progresso * 100)}%` }}
                />
              </div>
            ) : null}
          </div>
        ) : null}

        {foto ? (
          <div className="mt-5">
            <label
              htmlFor="quiz-zoom"
              className="text-cream-3 block font-mono text-[11px] tracking-[0.18em] uppercase"
            >
              {copy.zoomLabel}
            </label>
            <input
              id="quiz-zoom"
              type="range"
              min={ZOOM_MIN}
              max={ZOOM_MAX}
              step={0.05}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="accent-mint mt-2 w-full"
            />
            <p className="text-cream-3 mt-2 text-[13px] leading-[1.55]">{copy.fotoAjuda}</p>
          </div>
        ) : null}
      </div>

      <div>
        <p className="text-mint font-mono text-[11px] tracking-[0.24em] uppercase">
          {copy.resultadoEyebrow}
        </p>
        <h2
          ref={ref}
          tabIndex={-1}
          className="font-display text-cream mt-4 text-[clamp(28px,5vw,46px)] leading-[1.04] tracking-[-0.02em] uppercase outline-none"
        >
          {arquetipo.nome}
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {arquetipo.time ? (
            <span
              className="inline-block border px-3 py-1.5 font-mono text-[11px] tracking-[0.2em] uppercase"
              style={{ color: corTime, borderColor: corTime }}
            >
              {arquetipo.time}
            </span>
          ) : null}
        </div>
        <p className="text-cream mt-5 text-[19px] leading-[1.5] font-medium">{arquetipo.resumo}</p>
        <p className="text-cream-2 mt-4 text-[17px] leading-[1.65]">{arquetipo.texto}</p>

        <dl className="border-line mt-7 grid gap-6 border-t pt-7 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { rotulo: copy.resultadoAreaLabel, valor: arquetipo.area },
            { rotulo: copy.resultadoCorLabel, valor: arquetipo.timeCorNome, cor: corTime },
            { rotulo: copy.resultadoTimeLabel, valor: arquetipo.timePapel },
            { rotulo: copy.resultadoFerramentaLabel, valor: arquetipo.ferramenta },
            { rotulo: copy.resultadoSiglaLabel, valor: arquetipo.sigla, mono: true },
            {
              rotulo: copy.resultadoRaridadeLabel,
              valor: `${arquetipo.raridadeLabel} · ${arquetipo.raridade}`,
              mono: true,
            },
          ]
            .filter((item) => item.valor)
            .map((item) => (
              <div key={item.rotulo}>
                <dt className="text-cream-3 font-mono text-[11px] tracking-[0.2em] uppercase">
                  {item.rotulo}
                </dt>
                <dd
                  className={cn(
                    "mt-1.5 text-[16px]",
                    item.mono ? "text-mint font-mono" : "text-cream",
                  )}
                  style={item.cor ? { color: item.cor } : undefined}
                >
                  {item.valor}
                </dd>
              </div>
            ))}
        </dl>

        {arquetipo.noEvento ? (
          <p className="border-orange bg-panel text-cream-2 mt-7 border-l-2 px-5 py-4 text-[15.5px] leading-[1.6]">
            {arquetipo.noEvento}
          </p>
        ) : null}

        {webkit ? (
          <div role="status" className="border-orange bg-panel mt-7 border-l-2 px-5 py-4">
            <p className="text-orange font-mono text-[10px] tracking-[0.2em] uppercase">
              {copy.avisoSafariTitulo}
            </p>
            <p className="text-cream-2 mt-2 text-[15px] leading-[1.6]">{copy.avisoSafariTexto}</p>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={() => exportar("compartilhar")} disabled={ocupado}>
            {ocupado ? copy.gerando : copy.compartilhar}
          </Button>
          <Button variant="mint" onClick={() => exportar("baixar")} disabled={ocupado}>
            {copy.baixar}
          </Button>
          <Button variant="ghost" onClick={desafiar}>
            {desafioCopiado ? copy.desafiarCopiado : copy.desafiar}
          </Button>
          <Button variant="ghost" onClick={onRefazer}>
            {copy.ctaRefazer}
          </Button>
        </div>

        <p role="status" aria-live="polite" className="text-orange mt-3 min-h-[1.5em] text-[14px]">
          {estado === "erro" ? copy.erroExportar : ""}
        </p>

        <div className="border-line mt-10 border-t pt-8">
          <h3 className="font-display text-cream text-[clamp(19px,2.6vw,26px)] leading-[1.16]">
            {copy.fechoTitulo}
          </h3>
          <p className="text-cream-2 mt-3 text-[16px] leading-[1.6]">{copy.fechoTexto}</p>
          <Button href={ctaHref} target={ctaTarget} rel={ctaRel} size="lg" className="mt-6" arrow>
            {copy.ctaEvento}
          </Button>
        </div>
      </div>
    </div>
  );
});
