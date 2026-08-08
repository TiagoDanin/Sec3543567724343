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
import { Button } from "@/components/primitives/Button";
import { Carta } from "./Carta";

export type ResultadoProps = {
  arquetipo: Arquetipo;
  nome: string;
  copy: QuizCopy;
  data: string;
  dominio: string;
  onRefazer: () => void;
  ctaHref: string;
  ctaTarget?: "_blank";
  ctaRel?: "noopener";
};

type Estado = "pronto" | "gerando" | "erro";

export const Resultado = forwardRef<HTMLHeadingElement, ResultadoProps>(function Resultado(
  { arquetipo, nome, copy, data, dominio, onRefazer, ctaHref, ctaTarget, ctaRel },
  ref,
) {
  const cartaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [foto, setFoto] = useState<string | undefined>();
  const [posicao, setPosicao] = useState({ x: 50, y: 20 });
  const [zoom, setZoom] = useState(1);
  const [estado, setEstado] = useState<Estado>("pronto");

  // O servidor não tem `navigator`, e o HTML estático é o mesmo para todo mundo:
  // o aviso nasce oculto e aparece no primeiro quadro de cliente. Via
  // `useSyncExternalStore` porque `setState` em efeito é barrado pelo ESLint 9.
  const webkit = useSyncExternalStore(semAssinatura, isWebKitRestrito, () => false);

  // `ObjectURL` vaza se não for revogado — a pessoa pode trocar de foto várias
  // vezes antes de exportar.
  useEffect(() => {
    return () => {
      if (foto) URL.revokeObjectURL(foto);
    };
  }, [foto]);

  const escolherFoto = useCallback(
    (arquivo: File | undefined) => {
      if (!arquivo) return;
      if (foto) URL.revokeObjectURL(foto);

      setFoto(URL.createObjectURL(arquivo));
      setPosicao({ x: 50, y: 20 });
      setZoom(1);
    },
    [foto],
  );

  const removerFoto = useCallback(() => {
    if (foto) URL.revokeObjectURL(foto);
    setFoto(undefined);
    if (inputRef.current) inputRef.current.value = "";
  }, [foto]);

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
          await compartilhar(file, arquetipo.nome, `${arquetipo.resumo} — ${dominio}`);
        } else {
          baixar(blob, arquivo);
        }

        setEstado("pronto");
      } catch (erro) {
        // Cancelar a folha de compartilhamento não é falha: o navegador rejeita
        // a promessa, mas nada quebrou.
        if (erro instanceof DOMException && erro.name === "AbortError") {
          setEstado("pronto");
          return;
        }
        setEstado("erro");
      }
    },
    [arquetipo, dominio],
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
            data={data}
            dominio={dominio}
            foto={foto}
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

        {foto ? (
          <div className="mt-5">
            <label
              htmlFor="quiz-zoom"
              className="text-cream-3 font-mono block text-[11px] tracking-[0.18em] uppercase"
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
        <p className="text-cream-2 mt-5 text-[17px] leading-[1.65]">{arquetipo.texto}</p>

        <dl className="border-line mt-7 grid gap-px border-t pt-7 sm:grid-cols-2">
          <div>
            <dt className="text-cream-3 font-mono text-[11px] tracking-[0.2em] uppercase">Área</dt>
            <dd className="text-cream mt-1.5 text-[16px]">{arquetipo.area}</dd>
          </div>
          <div>
            <dt className="text-cream-3 font-mono text-[11px] tracking-[0.2em] uppercase">
              {copy.resultadoTrilhaLabel}
            </dt>
            <dd className="text-mint mt-1.5 font-mono text-[16px]">
              {arquetipo.trilha === "gerencial" ? "Gerencial" : "Técnica"}
            </dd>
          </div>
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
