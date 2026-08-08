"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

// Relógio compartilhado: o snapshot precisa ser estável entre ticks, senão o
// React re-renderiza em laço. O valor só muda quando o intervalo dispara.
let clock = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!timer) {
    clock = Date.now();
    timer = setInterval(() => {
      clock = Date.now();
      for (const listener of listeners) listener();
    }, 1000);
  }
  onChange();

  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

const pad = (value: number) => String(value).padStart(2, "0");

export type CountdownProps = {
  /** Data-alvo em ISO com offset. */
  target: string;
  className?: string;
  label?: string;
};

/**
 * Contagem regressiva. Renderiza `--` no servidor e no primeiro quadro, para a
 * marcação bater na hidratação.
 *
 * `aria-live="off"` de propósito: é informação ambiente e não deve interromper
 * leitor de tela a cada segundo.
 */
export function Countdown({ target, className, label = "Contagem regressiva" }: CountdownProps) {
  const now = useSyncExternalStore(
    subscribe,
    () => clock,
    () => 0,
  );

  const at = new Date(target).getTime();
  const ready = now > 0 && !Number.isNaN(at);
  const total = ready ? Math.floor(Math.max(0, at - now) / 1000) : 0;

  const parts = ready
    ? {
        d: pad(Math.floor(total / 86400)),
        h: pad(Math.floor((total % 86400) / 3600)),
        m: pad(Math.floor((total % 3600) / 60)),
        s: pad(total % 60),
      }
    : { d: "--", h: "--", m: "--", s: "--" };

  const units = [
    { key: "d", value: parts.d, unit: "dias", tone: "text-orange" },
    { key: "h", value: parts.h, unit: "hrs", tone: "text-cream" },
    { key: "m", value: parts.m, unit: "min", tone: "text-cream" },
    { key: "s", value: parts.s, unit: "seg", tone: "text-mint" },
  ];

  return (
    <div role="timer" aria-live="off" aria-label={label} className={cn("flex gap-2", className)}>
      {units.map(({ key, value, unit, tone }) => (
        <span
          key={key}
          className="border-line bg-panel flex items-baseline gap-[0.4em] border px-[11px] py-[7px] max-[760px]:flex-1 max-[760px]:justify-center max-[760px]:px-1"
        >
          <b className={cn("font-mono text-[19px] leading-[1.1] font-bold tabular-nums", tone)}>
            {value}
          </b>
          <i className="text-cream-3 font-mono text-[10px] tracking-[0.16em] uppercase not-italic max-[760px]:text-[9px] max-[760px]:tracking-[0.08em]">
            {unit}
          </i>
        </span>
      ))}
    </div>
  );
}
