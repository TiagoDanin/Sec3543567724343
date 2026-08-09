"use client";

import { forwardRef, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
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

/** Snapshot de servidor estável: recriar o objeto a cada render faz laço. */
const OCIOSO: EstadoRecorte = { fase: "ocioso" };

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
  const inputRef = useRef<HTMLInputElement>(null);

  const [foto, setFoto] = useState<string | undefined>();
  const [fotoFundo, setFotoFundo] = useState<string | undefined>();
  const [posicao, setPosicao] = useState({ x: 50, y: 20 });
  const [zoom, setZoom] = useState(1);
  const [estado, setEstado] = useState<Estado>("pronto");

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

  const arrastar = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!foto) return;

      const alvo = event.currentTarget;
      alvo.setPointerCapture(event.pointerId);

      const inicio = { px: event.clientX, py: event.clientY, ...posicao };
      const caixa = alvo.getBoundingClientRect();

      const mover = (e: PointerEvent) => {
        const dx = ((e.clientX - inicio.px) / caixa.width) * 100;
        const dy = ((e.clientY - inicio.py) / caixa.height) * 100;

        setPosicao({
          x: Math.min(100, Math.max(0, inicio.x - dx)),
          y: Math.min(100, Math.max(0, inicio.y - dy)),
        });
      };

      const soltar = () => {
        alvo.removeEventListener("pointermove", mover);
        alvo.removeEventListener("pointerup", soltar);
      };

      alvo.addEventListener("pointermove", mover);
      alvo.addEventListener("pointerup", soltar);
    },
    [foto, posicao],
  );

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
        return;
      }
      await navigator.clipboard.writeText(texto);
      setDesafioCopiado(true);
    } catch {
      // Cancelar a folha ou negar a permissão não merece mensagem de erro.
    }
  }, [arquetipo, copy.desafioTexto]);

  const exportar = useCallback(
    async (modo: "baixar" | "compartilhar") => {
      const node = cartaRef.current;
      if (!node) return;

      setEstado("gerando");

      try {
        const blob = await gerarCarta(node);
        const arquivo = `xibesec-${arquetipo.slug}.png`;
        const file = new File([blob], arquivo, { type: "image/png" });

        if (modo === "compartilhar" && podeCompartilhar(file)) {
          const texto = interpolar(copy.compartilharTexto, {
            resumo: arquetipo.resumo,
            arquetipo: arquetipo.nome,
            url: dominio,
          });
          await compartilhar(file, arquetipo.nome, texto);
        } else {
          baixar(blob, arquivo);
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
    [arquetipo, dominio, copy.compartilharTexto],
  );

  const ocupado = estado === "gerando";

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:gap-14">
      <div>
        <div
          ref={cartaRef}
          onPointerDown={arrastar}
          className={foto ? "cursor-grab touch-none active:cursor-grabbing" : undefined}
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

        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={() => inputRef.current?.click()}>
            {copy.fotoTrocar}
          </Button>
          {foto ? (
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
              min={1}
              max={2.2}
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
