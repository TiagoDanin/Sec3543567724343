"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Parts = { d: string; h: string; m: string; s: string };

const ZERO: Parts = { d: "--", h: "--", m: "--", s: "--" };

function partsUntil(target: number): Parts {
  const diff = Math.max(0, target - Date.now());
  const total = Math.floor(diff / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    d: pad(Math.floor(total / 86400)),
    h: pad(Math.floor((total % 86400) / 3600)),
    m: pad(Math.floor((total % 3600) / 60)),
    s: pad(total % 60),
  };
}

export type CountdownProps = {
  /** Data-alvo em ISO com offset. */
  target: string;
  className?: string;
  label?: string;
};

/**
 * Contagem regressiva. Começa em `--` e só passa a contar depois da montagem,
 * para o servidor e o cliente renderizarem a mesma marcação.
 *
 * `aria-live="off"` de propósito: é informação ambiente e não deve interromper
 * leitor de tela a cada segundo.
 */
export function Countdown({ target, className, label = "Contagem regressiva" }: CountdownProps) {
  const [parts, setParts] = useState<Parts>(ZERO);

  useEffect(() => {
    const at = new Date(target).getTime();
    if (Number.isNaN(at)) return;

    setParts(partsUntil(at));
    const id = window.setInterval(() => setParts(partsUntil(at)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const units: Array<{ key: keyof Parts; unit: string; tone: string }> = [
    { key: "d", unit: "dias", tone: "text-orange" },
    { key: "h", unit: "hrs", tone: "text-cream" },
    { key: "m", unit: "min", tone: "text-cream" },
    { key: "s", unit: "seg", tone: "text-mint" },
  ];

  return (
    <div role="timer" aria-live="off" aria-label={label} className={cn("flex gap-2", className)}>
      {units.map(({ key, unit, tone }) => (
        <span
          key={key}
          className="border-line bg-panel flex items-baseline gap-[0.4em] border px-[11px] py-[7px] max-[760px]:flex-1 max-[760px]:justify-center max-[760px]:px-1"
        >
          <b className={cn("font-mono text-[19px] font-bold leading-[1.1] tabular-nums", tone)}>
            {parts[key]}
          </b>
          <i className="text-cream-3 font-mono text-[10px] not-italic uppercase tracking-[0.16em] max-[760px]:text-[9px] max-[760px]:tracking-[0.08em]">
            {unit}
          </i>
        </span>
      ))}
    </div>
  );
}
